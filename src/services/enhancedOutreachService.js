import localforage from "localforage";
import { db } from "../firebase/config.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

class EnhancedOutreachService {
  constructor() {
    this.storageKey = "tkp_outreach_forms";
    this.syncHistoryKey = "tkp_sync_history";
    this.offlineQueueKey = "tkp_offline_queue";
    this.isInitialized = false;
    this.formsStore = null;
    this.syncHistoryStore = null;
    this.offlineQueueStore = null;
  }

  // Initialize the service
  async initialize() {
    if (this.isInitialized) return;

    // Initialize localForage stores
    this.formsStore = localforage.createInstance({
      name: "TKPDataManagement",
      storeName: "outreach_forms",
    });

    this.syncHistoryStore = localforage.createInstance({
      name: "TKPDataManagement",
      storeName: "sync_history",
    });

    this.offlineQueueStore = localforage.createInstance({
      name: "TKPDataManagement",
      storeName: "offline_queue",
    });

    this.isInitialized = true;
  }

  // Create a new form template
  createFormTemplate(formType) {
    return {
      id: this.generateId(),
      formType,
      childName: "",
      caseId: "",
      status: "draft",
      synced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {},
    };
  }

  // Generate a unique ID
  generateId() {
    return "form-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }

  // Save form locally using localForage
  async saveFormLocally(form) {
    try {
      await this.initialize();

      // Deep clone to remove Vue proxies
      const formToSave = JSON.parse(JSON.stringify(form));
      await this.formsStore.setItem(formToSave.id, formToSave);

      return { success: true };
    } catch (error) {
      console.error("Error saving form:", error);
      return { success: false, error: error.message };
    }
  }

  // Delete form locally
  async deleteFormLocally(formId) {
    try {
      await this.initialize();

      await this.formsStore.removeItem(formId);

      return { success: true };
    } catch (error) {
      console.error("Error deleting form:", error);
      return { success: false, error: error.message };
    }
  }

  // Get all forms from localForage
  async getAllForms() {
    try {
      await this.initialize();
      const forms = [];

      await this.formsStore.iterate((value) => {
        forms.push(value);
      });

      // Sort by creation date, newest first
      forms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return forms;
    } catch (error) {
      console.error("Error loading forms:", error);
      return [];
    }
  }

  // Get form by ID from localForage
  async getFormById(formId) {
    try {
      await this.initialize();
      const form = await this.formsStore.getItem(formId);
      return form || null;
    } catch (error) {
      console.error("Error getting form by ID:", error);
      return null;
    }
  }

  // Sync a single form with Firebase
  async syncForm(form) {
    try {
      await this.initialize();

      // Check if we're online before attempting to sync
      if (!navigator.onLine) {
        // Add to offline queue instead
        await this.addToOfflineQueue(form);
        return {
          success: false,
          error: "No internet connection - added to offline queue",
        };
      }

      let firebaseDocId = form.firebaseDocId;

      // If the form doesn't have a Firebase document ID, create a new document
      if (!firebaseDocId) {
        // Add the form to Firestore
        const formData = {
          ...form,
          createdAt: form.createdAt
            ? Timestamp.fromDate(new Date(form.createdAt))
            : Timestamp.now(),
          updatedAt: Timestamp.now(),
          syncedAt: Timestamp.now(),
        };

        // Remove local-only properties
        delete formData.firebaseDocId;

        // Wrap Firebase call in try/catch to handle offline scenarios
        try {
          const docRef = await addDoc(
            collection(db, "outreach_forms"),
            formData
          );
          firebaseDocId = docRef.id;
        } catch (firebaseError) {
          // If Firebase call fails, add to offline queue
          await this.addToOfflineQueue(form);
          throw new Error(
            `Failed to sync form to Firebase: ${firebaseError.message}`
          );
        }
      } else {
        // Update existing document in Firestore
        const formData = {
          ...form,
          updatedAt: Timestamp.now(),
          syncedAt: Timestamp.now(),
        };

        // Remove local-only properties
        delete formData.firebaseDocId;

        // Wrap Firebase call in try/catch to handle offline scenarios
        try {
          await updateDoc(doc(db, "outreach_forms", firebaseDocId), formData);
        } catch (firebaseError) {
          // If Firebase call fails, add to offline queue
          await this.addToOfflineQueue(form);
          throw new Error(
            `Failed to update form in Firebase: ${firebaseError.message}`
          );
        }
      }

      // Update the form with the Firebase document ID and mark as synced
      const syncedForm = {
        ...form,
        firebaseDocId,
        synced: true,
        syncedAt: new Date().toISOString(),
      };

      // Save the synced form locally
      await this.saveFormLocally(syncedForm);

      // Remove from offline queue if it was there
      await this.removeFromOfflineQueue(form.id);

      // Add to sync history
      const historyEntry = {
        id: `sync-${Date.now()}`,
        success: true,
        message: `Successfully synced form: ${form.formType}`,
        timestamp: new Date().toISOString(),
      };
      await this.saveSyncHistory(historyEntry);

      return { success: true, form: syncedForm };
    } catch (error) {
      console.error("Error syncing form:", error);

      // Add to offline queue for retry if not already there
      try {
        await this.addToOfflineQueue(form);
      } catch (queueError) {
        console.error("Error adding to offline queue:", queueError);
      }

      // Add to sync history
      const historyEntry = {
        id: `sync-${Date.now()}`,
        success: false,
        message: `Failed to sync form: ${form.formType} - ${error.message}`,
        timestamp: new Date().toISOString(),
      };
      await this.saveSyncHistory(historyEntry);

      return { success: false, error: error.message };
    }
  }

  // Sync all forms with Firebase
  async syncAllForms() {
    try {
      // Check if we're online before attempting to sync
      if (!navigator.onLine) {
        return { success: false, error: "No internet connection" };
      }

      const forms = await this.getAllForms();
      const unsyncedForms = forms.filter((form) => !form.synced);

      let syncedCount = 0;
      let errorCount = 0;

      // Sync each unsynced form
      for (const form of unsyncedForms) {
        try {
          const result = await this.syncForm(form);
          if (result.success) {
            syncedCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error("Error syncing form:", error);
        }
      }

      // Also process offline queue
      const queue = await this.getOfflineQueue();
      for (const item of queue) {
        try {
          const result = await this.syncForm(item);
          if (result.success) {
            syncedCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error("Error syncing queued form:", error);
        }
      }

      return {
        success: true,
        syncedCount,
        errorCount,
        totalCount: unsyncedForms.length + queue.length,
      };
    } catch (error) {
      console.error("Error syncing all forms:", error);
      return { success: false, error: error.message };
    }
  }

  // Auto-sync when coming online
  async autoSyncWhenOnline() {
    try {
      // Only auto-sync if we're online
      if (!navigator.onLine) {
        return { success: true, syncedCount: 0 };
      }

      // Process offline queue first
      const queue = await this.getOfflineQueue();
      let syncedCount = 0;
      let errorCount = 0;

      for (const item of queue) {
        try {
          const result = await this.syncForm(item);
          if (result.success) {
            syncedCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error("Error syncing queued form:", error);
        }
      }

      // Check if we have unsynced forms
      const forms = await this.getAllForms();
      const unsyncedForms = forms.filter((form) => !form.synced);

      // Sync unsynced forms
      for (const form of unsyncedForms) {
        try {
          const result = await this.syncForm(form);
          if (result.success) {
            syncedCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error("Error syncing form:", error);
        }
      }

      return { success: true, syncedCount, errorCount };
    } catch (error) {
      console.error("Error in auto-sync:", error);
      return { success: false, error: error.message };
    }
  }

  // Save sync history to localForage
  async saveSyncHistory(historyEntry) {
    try {
      await this.initialize();

      // Get existing history
      let history = await this.getSyncHistory();
      history.unshift(historyEntry);

      // Keep only the last 50 entries
      if (history.length > 50) {
        history.splice(50);
      }

      await this.syncHistoryStore.setItem("history", history);

      return { success: true };
    } catch (error) {
      console.error("Error saving sync history:", error);
      return { success: false, error: error.message };
    }
  }

  // Get sync history from localForage
  async getSyncHistory() {
    try {
      await this.initialize();
      const history = await this.syncHistoryStore.getItem("history");
      return history || [];
    } catch (error) {
      console.error("Error loading sync history:", error);
      return [];
    }
  }

  // Add item to offline queue
  async addToOfflineQueue(form) {
    try {
      await this.initialize();

      // Check if item already exists in queue
      const existingQueue = await this.getOfflineQueue();
      const existingIndex = existingQueue.findIndex(
        (item) => item.id === form.id
      );

      // Deep clone to remove Vue proxies
      const formToSave = JSON.parse(JSON.stringify(form));

      if (existingIndex >= 0) {
        // Update existing item
        existingQueue[existingIndex] = formToSave;
      } else {
        // Add new item
        existingQueue.push(formToSave);
      }

      await this.offlineQueueStore.setItem("queue", existingQueue);

      return { success: true };
    } catch (error) {
      console.error("Error adding to offline queue:", error);
      return { success: false, error: error.message };
    }
  }

  // Remove item from offline queue
  async removeFromOfflineQueue(formId) {
    try {
      await this.initialize();

      const queue = await this.getOfflineQueue();
      const updatedQueue = queue.filter((item) => item.id !== formId);

      await this.offlineQueueStore.setItem("queue", updatedQueue);

      return { success: true };
    } catch (error) {
      console.error("Error removing from offline queue:", error);
      return { success: false, error: error.message };
    }
  }

  // Get offline queue
  async getOfflineQueue() {
    try {
      await this.initialize();
      const queue = await this.offlineQueueStore.getItem("queue");
      return queue || [];
    } catch (error) {
      console.error("Error loading offline queue:", error);
      return [];
    }
  }
}

// Export a singleton instance
const enhancedOutreachService = new EnhancedOutreachService();
export default enhancedOutreachService;
