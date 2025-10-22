<template>
  <div class="outreach-module">
    <!-- Network Status Banner -->
    <div v-if="!isOnline" class="network-status-banner offline">
      <div class="banner-content">
        <i class="fas fa-cloud-offline"></i>
        <span
          >Offline Mode - Data will sync automatically when internet
          returns</span
        >
      </div>
    </div>

    <div class="header-section">
      <h2>Outreach Module</h2>
      <div class="header-actions">
        <button class="sync-btn" @click="syncData" :disabled="isSyncing">
          <i class="fas fa-sync-alt"></i>
          {{ isSyncing ? "Syncing..." : "Sync Data" }}
          <span v-if="pendingSyncCount > 0" class="sync-count">{{
            pendingSyncCount
          }}</span>
        </button>
        <button class="back-btn" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
      </div>
    </div>

    <div class="module-content">
      <!-- Navigation Tabs -->
      <div class="module-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          :class="['tab', { active: activeTab === tab.id }]"
        >
          <i :class="tab.icon"></i>
          {{ tab.name }}
        </button>
      </div>

      <!-- Forms List View -->
      <div v-if="activeTab === 'forms'" class="forms-view">
        <div class="forms-header">
          <h3>Outreach Forms</h3>
          <div class="forms-actions">
            <button class="add-form-btn" @click="showFormSelector = true">
              <i class="fas fa-plus"></i>
              Add New Form
            </button>
          </div>
        </div>

        <!-- Form Selector Modal -->
        <div
          v-if="showFormSelector"
          class="modal-overlay"
          @click="showFormSelector = false"
        >
          <div class="modal-content" @click.stop>
            <h4>Select Form Type</h4>
            <div class="form-options">
              <button
                v-for="form in formTypes"
                :key="form.id"
                @click="createNewForm(form.id)"
                class="form-option-btn"
              >
                <i :class="form.icon"></i>
                <span>{{ form.name }}</span>
              </button>
            </div>
            <button class="close-modal-btn" @click="showFormSelector = false">
              <i class="fas fa-times"></i>
              Close
            </button>
          </div>
        </div>

        <!-- Forms List -->
        <div class="forms-list">
          <div
            v-for="form in forms"
            :key="form.id"
            class="form-card"
            :class="{ offline: !form.synced }"
          >
            <div class="form-card-header">
              <h4>{{ getFormTypeName(form.formType) }}</h4>
              <div class="form-status">
                <span :class="['status-badge', form.status.toLowerCase()]">
                  {{ form.status }}
                </span>
                <span v-if="!form.synced" class="offline-badge">
                  <i class="fas fa-cloud-offline"></i>
                  Offline
                </span>
              </div>
            </div>
            <div class="form-card-body">
              <p><strong>Child:</strong> {{ form.childName || "N/A" }}</p>
              <p><strong>Date:</strong> {{ formatDate(form.createdAt) }}</p>
              <p v-if="form.caseId">
                <strong>Case ID:</strong> {{ form.caseId }}
              </p>
            </div>
            <div class="form-card-actions">
              <button
                v-if="form.status !== 'completed'"
                @click="editForm(form)"
                class="edit-btn"
              >
                <i class="fas fa-edit"></i>
                Edit
              </button>
              <button
                v-if="form.status !== 'completed'"
                @click="completeForm(form)"
                class="complete-btn"
              >
                <i class="fas fa-check"></i>
                Complete
              </button>
              <button
                v-if="form.synced === false"
                @click="syncSingleForm(form)"
                class="sync-single-btn"
              >
                <i class="fas fa-sync"></i>
                Sync
              </button>
            </div>
          </div>

          <div v-if="forms.length === 0" class="no-forms">
            <i class="fas fa-file-alt"></i>
            <p>
              No forms found. Click "Add New Form" to create your first outreach
              form.
            </p>
          </div>
        </div>
      </div>

      <!-- Form Editor View -->
      <div v-else-if="activeTab === 'form-editor'" class="form-editor-view">
        <div class="editor-header">
          <h3>
            {{
              currentForm ? getFormTypeName(currentForm.formType) : "New Form"
            }}
          </h3>
          <div class="editor-actions">
            <button @click="saveFormAsDraft" class="save-draft-btn">
              <i class="fas fa-save"></i>
              Save Draft
            </button>
            <button
              @click="submitForm"
              class="submit-btn"
              :disabled="isSubmitting"
            >
              <i class="fas fa-paper-plane"></i>
              {{ isSubmitting ? "Submitting..." : "Submit" }}
            </button>
            <button @click="setActiveTab('forms')" class="cancel-btn">
              <i class="fas fa-times"></i>
              Cancel
            </button>
          </div>
        </div>

        <!-- Render the appropriate form component -->
        <div class="form-container">
          <InitialReferralForm
            v-if="currentForm?.formType === 'initial-referral'"
            :edit-data="currentForm"
            :is-edit-mode="!!currentForm.id"
            :is-outreach-mode="true"
            @form-saved="handleFormSaved"
          />
          <InitialAssessmentForm
            v-else-if="currentForm?.formType === 'initial-assessment'"
            :edit-data="currentForm"
            :is-edit-mode="!!currentForm.id"
            :is-outreach-mode="true"
            @form-saved="handleFormSaved"
          />
          <ChildOverviewForm
            v-else-if="currentForm?.formType === 'child-overview'"
            :edit-data="currentForm"
            :is-edit-mode="!!currentForm.id"
            :is-outreach-mode="true"
            @form-saved="handleFormSaved"
          />
        </div>
      </div>

      <!-- Sync Status View -->
      <div v-else-if="activeTab === 'sync'" class="sync-view">
        <h3>Sync Status</h3>
        <div class="network-info">
          <div class="network-status">
            <span
              :class="['status-indicator', isOnline ? 'online' : 'offline']"
            ></span>
            <span>{{ isOnline ? "Online" : "Offline" }}</span>
          </div>
          <button
            @click="checkConnection"
            :disabled="isChecking"
            class="check-connection-btn"
          >
            <i class="fas fa-sync"></i>
            {{ isChecking ? "Checking..." : "Check Connection" }}
          </button>
        </div>

        <div class="sync-info">
          <div class="sync-stats">
            <div class="stat-card">
              <h4>Total Forms</h4>
              <p>{{ forms.length }}</p>
            </div>
            <div class="stat-card">
              <h4>Pending Sync</h4>
              <p>{{ pendingSyncCount }}</p>
            </div>
            <div class="stat-card">
              <h4>Completed</h4>
              <p>{{ completedFormsCount }}</p>
            </div>
          </div>

          <div class="sync-history">
            <h4>Recent Sync Activity</h4>
            <div v-if="syncHistory.length === 0" class="no-history">
              <p>No sync activity yet.</p>
            </div>
            <div v-else class="history-list">
              <div
                v-for="entry in syncHistory"
                :key="entry.id"
                class="history-item"
              >
                <div class="history-icon">
                  <i
                    :class="
                      entry.success
                        ? 'fas fa-check-circle'
                        : 'fas fa-exclamation-circle'
                    "
                  ></i>
                </div>
                <div class="history-details">
                  <p>{{ entry.message }}</p>
                  <small>{{ formatDate(entry.timestamp) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import InitialReferralForm from "./InitialReferralForm.vue";
import InitialAssessmentForm from "./InitialAssessmentForm.vue";
import ChildOverviewForm from "./ChildOverviewForm.vue";
import { useToast } from "../composables/useToast.js";
import { useNetworkStatus } from "../composables/useNetworkStatus.js";
import EnhancedOutreachService from "../services/enhancedOutreachService.js";

const router = useRouter();
const { success, error, warning } = useToast();
const { isOnline, isChecking, checkConnection } = useNetworkStatus();

// State management
const activeTab = ref("forms");
const showFormSelector = ref(false);
const currentForm = ref(null);
const isSubmitting = ref(false);
const isSyncing = ref(false);

// Form data
const forms = ref([]);

// Sync data
const syncHistory = ref([]);

// Tabs configuration
const tabs = [
  { id: "forms", name: "Forms", icon: "fas fa-file-alt" },
  { id: "sync", name: "Sync Status", icon: "fas fa-sync-alt" },
];

// Form types configuration
const formTypes = [
  {
    id: "initial-referral",
    name: "Initial Child Referral",
    icon: "fas fa-user-friends",
  },
  {
    id: "initial-assessment",
    name: "Initial Assessment",
    icon: "fas fa-clipboard-list",
  },
  {
    id: "child-overview",
    name: "Child Overview",
    icon: "fas fa-user",
  },
];

// Computed properties
const pendingSyncCount = computed(() => {
  return forms.value.filter((form) => !form.synced).length;
});

const completedFormsCount = computed(() => {
  return forms.value.filter((form) => form.status === "completed").length;
});

// Network status watcher
let onlineStatusWatcher;

// Methods
const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

const goBack = () => {
  router.push("/dashboard");
};

const getFormTypeName = (formType) => {
  const form = formTypes.find((f) => f.id === formType);
  return form ? form.name : formType;
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const createNewForm = (formType) => {
  showFormSelector.value = false;
  currentForm.value = EnhancedOutreachService.createFormTemplate(formType);
  activeTab.value = "form-editor";
};

const editForm = (form) => {
  currentForm.value = { ...form };
  activeTab.value = "form-editor";
};

const completeForm = async (form) => {
  try {
    const existingForm = await EnhancedOutreachService.getFormById(form.id);
    if (existingForm) {
      existingForm.status = "completed";
      existingForm.updatedAt = new Date().toISOString();

      // Save to local storage
      const result = await EnhancedOutreachService.saveFormLocally(
        existingForm
      );
      if (result.success) {
        success("Form marked as completed");
        // Update forms list
        loadFormsFromStorage();
      } else {
        error("Error saving form: " + result.error);
      }
    }
  } catch (err) {
    error("Error completing form: " + err.message);
  }
};

const saveFormAsDraft = async () => {
  try {
    if (currentForm.value) {
      const result = await EnhancedOutreachService.saveFormLocally(
        currentForm.value
      );
      if (result.success) {
        success("Form saved as draft");
        // Update forms list
        loadFormsFromStorage();
      } else {
        error("Error saving form: " + result.error);
      }
    }
  } catch (err) {
    error("Error saving form: " + err.message);
  }
};

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    if (currentForm.value) {
      // Mark as completed
      currentForm.value.status = "completed";
      currentForm.value.updatedAt = new Date().toISOString();

      // Save to local storage
      const result = await EnhancedOutreachService.saveFormLocally(
        currentForm.value
      );
      if (result.success) {
        success("Form submitted successfully!");
        setActiveTab("forms");
        // Refresh forms list
        loadFormsFromStorage();
      } else {
        error("Error submitting form: " + result.error);
      }
    }
  } catch (err) {
    error("Error submitting form: " + err.message);
  } finally {
    isSubmitting.value = false;
  }
};

const handleFormSaved = async (formData) => {
  try {
    // Handle form saved event from child components
    if (currentForm.value) {
      // Update the form data
      currentForm.value.data = { ...formData };
      currentForm.value.updatedAt = new Date().toISOString();

      // Save to local storage
      const result = await EnhancedOutreachService.saveFormLocally(
        currentForm.value
      );
      if (result.success) {
        success("Form data saved successfully!");
        loadFormsFromStorage();
        setActiveTab("forms");
      } else {
        error("Error saving form: " + result.error);
      }
    }
  } catch (err) {
    error("Error handling form save: " + err.message);
  }
};

const syncSingleForm = async (form) => {
  try {
    const result = await EnhancedOutreachService.syncForm(form);
    if (result.success) {
      // Update the form in our local list
      const index = forms.value.findIndex((f) => f.id === form.id);
      if (index !== -1) {
        forms.value[index] = result.form;
        await EnhancedOutreachService.saveFormLocally(result.form);
      }

      // Add to sync history
      const historyEntry = {
        id: `sync-${Date.now()}`,
        success: true,
        message: `Successfully synced form: ${getFormTypeName(form.formType)}`,
        timestamp: new Date().toISOString(),
      };
      syncHistory.value.unshift(historyEntry);
      await EnhancedOutreachService.saveSyncHistory(historyEntry);

      success("Form synced successfully!");
    } else {
      error("Error syncing form: " + result.error);

      // Add to sync history
      const historyEntry = {
        id: `sync-${Date.now()}`,
        success: false,
        message: `Failed to sync form: ${getFormTypeName(form.formType)} - ${
          result.error
        }`,
        timestamp: new Date().toISOString(),
      };
      syncHistory.value.unshift(historyEntry);
      await EnhancedOutreachService.saveSyncHistory(historyEntry);
    }
  } catch (err) {
    error("Error syncing form: " + err.message);

    // Add to sync history
    const historyEntry = {
      id: `sync-${Date.now()}`,
      success: false,
      message: `Failed to sync form: ${getFormTypeName(form.formType)} - ${
        err.message
      }`,
      timestamp: new Date().toISOString(),
    };
    syncHistory.value.unshift(historyEntry);
    await EnhancedOutreachService.saveSyncHistory(historyEntry);
  }
};

const syncData = async () => {
  isSyncing.value = true;
  try {
    const result = await EnhancedOutreachService.syncAllForms();
    if (result.success) {
      // Refresh forms list
      loadFormsFromStorage();

      success(
        `Synced ${result.syncedCount} of ${result.totalCount} forms successfully!`
      );
    } else {
      error("Error syncing data: " + result.error);
    }
  } catch (err) {
    error("Error syncing data: " + err.message);
  } finally {
    isSyncing.value = false;
  }
};

// Auto-sync when coming back online
const handleOnlineStatusChange = async () => {
  if (isOnline.value) {
    // When coming back online, auto-sync pending forms
    setTimeout(async () => {
      const result = await EnhancedOutreachService.autoSyncWhenOnline();
      if (result.success && result.syncedCount > 0) {
        success(`Auto-synced ${result.syncedCount} forms`);
        // Refresh forms list
        loadFormsFromStorage();
      }
    }, 2000); // Wait 2 seconds for connection to stabilize
  }
};

// Storage methods (now using EnhancedOutreachService)
const saveFormsToStorage = async () => {
  try {
    // Forms are now saved individually via EnhancedOutreachService
    // Sync history is also handled by the service
  } catch (err) {
    console.error("Error saving to storage:", err);
    error("Failed to save data");
  }
};

const loadFormsFromStorage = async () => {
  try {
    // Load forms using EnhancedOutreachService
    forms.value = await EnhancedOutreachService.getAllForms();

    // Load sync history
    syncHistory.value = await EnhancedOutreachService.getSyncHistory();
  } catch (err) {
    console.error("Error loading from storage:", err);
    warning("Failed to load saved data");
  }
};

// Lifecycle hooks
onMounted(async () => {
  // Initialize the enhanced outreach service
  await EnhancedOutreachService.initialize();

  // Load data
  await loadFormsFromStorage();

  // Watch for online status changes
  onlineStatusWatcher = watch(isOnline, handleOnlineStatusChange);

  // Add sample data if empty (for demonstration)
  if (forms.value.length === 0) {
    const sampleForms = [
      {
        id: "sample-1",
        formType: "initial-referral",
        childName: "Maria Santos",
        caseId: "TKP-2024-001",
        status: "completed",
        synced: true,
        createdAt: "2024-10-15T10:00:00Z",
        syncedAt: "2024-10-15T11:00:00Z",
        data: {},
      },
      {
        id: "sample-2",
        formType: "child-overview",
        childName: "John Mwansa",
        caseId: "TKP-2024-002",
        status: "draft",
        synced: false,
        createdAt: "2024-10-18T09:30:00Z",
        data: {},
      },
    ];

    for (const form of sampleForms) {
      await EnhancedOutreachService.saveFormLocally(form);
    }

    // Reload after adding sample data
    await loadFormsFromStorage();
  }
});

onUnmounted(() => {
  if (onlineStatusWatcher) {
    onlineStatusWatcher();
  }
});
</script>

<style scoped>
.outreach-module {
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.header-section h2 {
  color: #4a148c;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.sync-btn,
.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sync-btn {
  background-color: #4a148c;
  color: white;
}

.sync-btn:hover:not(:disabled) {
  background-color: #2d1b69;
  transform: translateY(-2px);
}

.sync-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sync-count {
  background-color: #ff5722;
  color: white;
  border-radius: 50%;
  padding: 0.1rem 0.4rem;
  font-size: 0.8rem;
}

.back-btn {
  background-color: #6c757d;
  color: white;
}

.back-btn:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

.module-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.tab:hover {
  color: #4a148c;
}

.tab.active {
  color: #4a148c;
  border-bottom-color: #4a148c;
}

.forms-view,
.form-editor-view,
.sync-view {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.forms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.forms-header h3 {
  color: #4a148c;
  margin: 0;
}

.add-form-btn {
  background: linear-gradient(135deg, #4a148c 0%, #2d1b69 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.add-form-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-content h4 {
  color: #4a148c;
  margin-top: 0;
  text-align: center;
}

.form-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
}

.form-option-btn {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #495057;
}

.form-option-btn:hover {
  background: #e9ecef;
  border-color: #4a148c;
  transform: translateY(-2px);
}

.close-modal-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.close-modal-btn:hover {
  background: #5a6268;
}

.forms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.form-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.form-card.offline {
  border-left: 4px solid #ff9800;
}

.form-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.form-card-header h4 {
  color: #4a148c;
  margin: 0 0 0.5rem 0;
}

.form-status {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.draft {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background-color: #d4edda;
  color: #155724;
}

.offline-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #ff9800;
  font-weight: 500;
}

.form-card-body p {
  margin: 0.5rem 0;
  color: #495057;
  font-size: 0.9rem;
}

.form-card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.form-card-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #17a2b8;
  color: white;
}

.edit-btn:hover {
  background-color: #138496;
}

.complete-btn {
  background-color: #28a745;
  color: white;
}

.complete-btn:hover {
  background-color: #218838;
}

.sync-single-btn {
  background-color: #4a148c;
  color: white;
}

.sync-single-btn:hover {
  background-color: #2d1b69;
}

.no-forms {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.no-forms i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ced4da;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.editor-header h3 {
  color: #4a148c;
  margin: 0;
}

.editor-actions {
  display: flex;
  gap: 1rem;
}

.save-draft-btn,
.submit-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.save-draft-btn {
  background-color: #6c757d;
  color: white;
}

.save-draft-btn:hover {
  background-color: #5a6268;
}

.submit-btn {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background-color: #c82333;
}

.form-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.sync-view h3 {
  color: #4a148c;
  margin-top: 0;
}

.sync-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.stat-card h4 {
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.stat-card p {
  color: #4a148c;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.sync-history h4 {
  color: #4a148c;
  margin-bottom: 1rem;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.history-icon {
  font-size: 1.5rem;
  align-self: flex-start;
}

.history-icon .fa-check-circle {
  color: #28a745;
}

.history-icon .fa-exclamation-circle {
  color: #dc3545;
}

.history-details {
  flex: 1;
}

.history-details p {
  margin: 0 0 0.25rem 0;
  color: #495057;
}

.history-details small {
  color: #6c757d;
}

.no-history {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .outreach-module {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .forms-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .forms-actions {
    display: flex;
    justify-content: center;
  }

  .forms-list {
    grid-template-columns: 1fr;
  }

  .editor-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .editor-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .sync-stats {
    grid-template-columns: 1fr;
  }

  .module-tabs {
    flex-wrap: wrap;
  }

  .tab {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
}
</style>
