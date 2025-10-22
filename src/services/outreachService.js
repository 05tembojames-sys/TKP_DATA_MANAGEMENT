/**
 * Outreach Service
 * Handles offline data storage and synchronization for outreach forms
 */

import FormService from "./formService.js";

class OutreachService {
  constructor() {
    this.storageKey = "outreach_forms";
    this.syncHistoryKey = "outreach_sync_history";
    this.offlineQueueKey = "outreach_offline_queue";
  }

  /**
   * Save a form locally (offline)
   */
  async saveFormLocally(form) {
    try {
      const forms = this.getAllFormsFromLocalStorage();
      const existingIndex = forms.findIndex((f) => f.id === form.id);

      if (existingIndex !== -1) {
        // Update existing form
        forms[existingIndex] = { ...form, updatedAt: new Date().toISOString() };
      } else {
        // Add new form
        forms.push({ ...form, createdAt: new Date().toISOString() });
      }

      localStorage.setItem(this.storageKey, JSON.stringify(forms));
      return { success: true, form };
    } catch (error) {
      console.error("Error saving form locally:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all forms from local storage
   */
  getAllFormsFromLocalStorage() {
    try {
      const formsData = localStorage.getItem(this.storageKey);
      return formsData ? JSON.parse(formsData) : [];
    } catch (error) {
      console.error("Error loading forms from localStorage:", error);
      return [];
    }
  }

  /**
   * Get a specific form by ID
   */
  getFormById(formId) {
    const forms = this.getAllFormsFromLocalStorage();
    return forms.find((form) => form.id === formId) || null;
  }

  /**
   * Delete a form locally
   */
  async deleteFormLocally(formId) {
    try {
      const forms = this.getAllFormsFromLocalStorage();
      const updatedForms = forms.filter((form) => form.id !== formId);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedForms));
      return { success: true };
    } catch (error) {
      console.error("Error deleting form locally:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save sync history
   */
  saveSyncHistory(entry) {
    try {
      const history = this.getSyncHistory();
      history.unshift({ ...entry, timestamp: new Date().toISOString() });
      // Keep only the last 50 entries
      if (history.length > 50) {
        history.splice(50);
      }
      localStorage.setItem(this.syncHistoryKey, JSON.stringify(history));
    } catch (error) {
      console.error("Error saving sync history:", error);
    }
  }

  /**
   * Get sync history
   */
  getSyncHistory() {
    try {
      const historyData = localStorage.getItem(this.syncHistoryKey);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      console.error("Error loading sync history:", error);
      return [];
    }
  }

  /**
   * Add form to offline queue for later sync
   */
  addToOfflineQueue(form) {
    try {
      const queue = this.getOfflineQueue();
      queue.push({ ...form, queuedAt: new Date().toISOString() });
      localStorage.setItem(this.offlineQueueKey, JSON.stringify(queue));
    } catch (error) {
      console.error("Error adding to offline queue:", error);
    }
  }

  /**
   * Get offline queue
   */
  getOfflineQueue() {
    try {
      const queueData = localStorage.getItem(this.offlineQueueKey);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error("Error loading offline queue:", error);
      return [];
    }
  }

  /**
   * Remove from offline queue
   */
  removeFromOfflineQueue(formId) {
    try {
      const queue = this.getOfflineQueue();
      const updatedQueue = queue.filter((item) => item.id !== formId);
      localStorage.setItem(this.offlineQueueKey, JSON.stringify(updatedQueue));
    } catch (error) {
      console.error("Error removing from offline queue:", error);
    }
  }

  /**
   * Sync a single form to the server
   */
  async syncForm(form) {
    try {
      let result;

      // Determine which form service method to use based on form type
      switch (form.formType) {
        case "initial-referral":
          result = await FormService.saveInitialReferral(form.data);
          break;
        case "initial-assessment":
          result = await FormService.saveInitialAssessment(form.data);
          break;
        case "child-overview":
          result = await FormService.saveChildOverview(form.data);
          break;
        default:
          throw new Error(`Unsupported form type: ${form.formType}`);
      }

      if (result.success) {
        // Update the form with server ID and mark as synced
        const updatedForm = {
          ...form,
          id: result.id, // Use server-generated ID
          synced: true,
          syncedAt: new Date().toISOString(),
        };

        // Save updated form locally
        await this.saveFormLocally(updatedForm);

        // Remove from offline queue if it was there
        this.removeFromOfflineQueue(form.id);

        return { success: true, form: updatedForm };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error syncing form:", error);
      // Add to offline queue for retry
      this.addToOfflineQueue(form);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync all pending forms to the server
   */
  async syncAllForms() {
    try {
      const forms = this.getAllFormsFromLocalStorage();
      const pendingForms = forms.filter((form) => !form.synced);

      const results = [];
      const syncHistory = [];

      for (const form of pendingForms) {
        try {
          const result = await this.syncForm(form);
          results.push(result);

          syncHistory.push({
            formId: form.id,
            formType: form.formType,
            success: result.success,
            message: result.success
              ? `Successfully synced ${form.formType} form`
              : `Failed to sync ${form.formType} form: ${result.error}`,
          });
        } catch (error) {
          console.error(`Error syncing form ${form.id}:`, error);
          results.push({ success: false, error: error.message, form });

          syncHistory.push({
            formId: form.id,
            formType: form.formType,
            success: false,
            message: `Error syncing ${form.formType} form: ${error.message}`,
          });
        }
      }

      // Save sync history
      syncHistory.forEach((entry) => this.saveSyncHistory(entry));

      return {
        success: true,
        results,
        syncedCount: results.filter((r) => r.success).length,
        totalCount: pendingForms.length,
      };
    } catch (error) {
      console.error("Error syncing all forms:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize the service - load any forms from offline queue
   */
  async initialize() {
    try {
      // Move any items from offline queue to main storage
      const queue = this.getOfflineQueue();
      if (queue.length > 0) {
        const forms = this.getAllFormsFromLocalStorage();
        queue.forEach((item) => {
          if (!forms.find((f) => f.id === item.id)) {
            forms.push(item);
          }
        });
        localStorage.setItem(this.storageKey, JSON.stringify(forms));
        // Clear the queue
        localStorage.setItem(this.offlineQueueKey, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error initializing outreach service:", error);
    }
  }

  /**
   * Generate a unique ID for local forms
   */
  generateLocalId() {
    return `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new form template
   */
  createFormTemplate(formType) {
    return {
      id: this.generateLocalId(),
      formType: formType,
      status: "draft",
      synced: false,
      data: {},
      createdAt: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export default new OutreachService();
