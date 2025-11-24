<template>
  <div class="dhis2-app-shell">
    <TopHeader />
    
    <!-- App Toolbar -->
    <div class="app-toolbar">
      <div class="toolbar-left">
        <span class="app-title">Outreach Management</span>
        <div class="toolbar-divider"></div>
        <button class="toolbar-btn" :class="{ active: activeView === 'list' }" @click="activeView = 'list'">
          <i class="fas fa-list"></i> List
        </button>
        <button class="toolbar-btn" :class="{ active: activeView === 'map' }" @click="activeView = 'map'">
          <i class="fas fa-map-marker-alt"></i> Map
        </button>
        <button class="toolbar-btn" :class="{ active: activeView === 'analytics' }" @click="activeView = 'analytics'">
          <i class="fas fa-chart-bar"></i> Analytics
        </button>
      </div>
      <div class="toolbar-right">
        <div class="sync-status" :class="{ 'offline': !isOnline }">
          <i class="fas" :class="isOnline ? 'fa-wifi' : 'fa-wifi-slash'"></i>
          <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
        </div>
        <button class="toolbar-btn primary" @click="syncData" :disabled="isSyncing">
          <i class="fas fa-sync" :class="{ 'fa-spin': isSyncing }"></i>
          {{ isSyncing ? 'Syncing...' : 'Sync' }}
          <span v-if="pendingSyncCount > 0" class="badge">{{ pendingSyncCount }}</span>
        </button>
      </div>
    </div>

    <div class="app-content">
      <!-- Left Sidebar: Org Unit & Filters -->
      <aside class="sidebar" v-if="activeView === 'list'">
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Organisation Unit</h3>
            <button class="icon-btn"><i class="fas fa-chevron-up"></i></button>
          </div>
          <div class="org-unit-tree">
            <div class="tree-item" :class="{ selected: selectedOrgUnit === 'Lusaka District' }" @click="filterOrgUnit('Lusaka District')">
              <i class="fas fa-caret-down"></i>
              <span class="org-icon"><i class="fas fa-hospital"></i></span>
              <span class="org-name">Lusaka District</span>
            </div>
            <div class="tree-children">
              <div class="tree-item" :class="{ selected: selectedOrgUnit === 'Chongwe Outreach' }" @click="filterOrgUnit('Chongwe Outreach')">
                <span class="org-icon"><i class="fas fa-clinic-medical"></i></span>
                <span class="org-name">Chongwe Outreach</span>
              </div>
              <div class="tree-item" :class="{ selected: selectedOrgUnit === 'Kafue Center' }" @click="filterOrgUnit('Kafue Center')">
                <span class="org-icon"><i class="fas fa-clinic-medical"></i></span>
                <span class="org-name">Kafue Center</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="section-header">
            <h3>Program</h3>
          </div>
          <div class="program-selector">
            <select v-model="selectedProgram" class="dhis2-select">
              <option value="all">All Programs</option>
              <option value="child-care">Child Care</option>
              <option value="medical">Medical Support</option>
              <option value="education">Education & Literacy</option>
              <option value="psychosocial">Psychosocial Support</option>
            </select>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="section-header">
            <h3>Status</h3>
          </div>
          <div class="filter-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="filters.active" /> Active
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="filters.completed" /> Completed
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="filters.cancelled" /> Cancelled
            </label>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="main-workspace" v-if="activeView === 'list'">
        <!-- Top Bar within Workspace -->
        <div class="workspace-header">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Search by child name, ID, or location..." />
          </div>
          <div class="workspace-actions">
            <button class="dhis2-btn primary" @click="showFormSelector = true">
              <i class="fas fa-plus"></i> Register Event
            </button>
            <button class="dhis2-btn secondary">
              <i class="fas fa-cog"></i> Columns
            </button>
            <button class="dhis2-btn secondary" @click="downloadEvents">
              <i class="fas fa-download"></i> Download
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="data-table-container">
          <table class="dhis2-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Org Unit</th>
                <th>Event Type</th>
                <th>Child / Beneficiary</th>
                <th>Status</th>
                <th>Sync</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="form in paginatedForms" :key="form.id">
                <td>{{ formatDate(form.createdAt) }}</td>
                <td>{{ form.orgUnit || 'Lusaka District' }}</td>
                <td>
                  <div class="event-type-badge" :class="form.formType">
                    {{ getFormTypeName(form.formType) }}
                  </div>
                </td>
                <td class="font-medium">{{ form.childName || 'N/A' }}</td>
                <td>
                  <span class="status-tag" :class="form.status.toLowerCase()">
                    {{ form.status }}
                  </span>
                </td>
                <td>
                  <i class="fas" :class="form.synced ? 'fa-check-circle text-green' : 'fa-cloud-upload-alt text-orange'" :title="form.synced ? 'Synced' : 'Pending Sync'"></i>
                </td>
                <td class="actions-col">
                  <button class="icon-action" title="Edit" @click="editForm(form)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="icon-action" title="View" @click="viewForm(form)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="icon-action delete" title="Delete" @click="deleteForm(form)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedForms.length === 0">
                <td colspan="7" class="empty-state">
                  <div class="empty-content">
                    <i class="fas fa-inbox"></i>
                    <p>No outreach events found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination-bar">
          <div class="pagination-info">
            Showing {{ paginatedForms.length }} of {{ filteredForms.length }} events (Page {{ currentPage }} of {{ totalPages }})
          </div>
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <button class="active">{{ currentPage }}</button>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          </div>
        </div>
      </main>

      <!-- Map View -->
      <div class="map-view-container" v-if="activeView === 'map'" style="flex: 1; display: flex; flex-direction: column;">
        <Maps :show-header="false" />
      </div>

      <!-- Analytics View -->
      <div class="analytics-view-container" v-if="activeView === 'analytics'" style="flex: 1; display: flex; flex-direction: column; overflow: auto;">
        <DataVisualizer :show-header="false" />
      </div>
    </div>

    <!-- Modals -->
    <!-- Form Selector Modal -->
    <div class="modal-backdrop" v-if="showFormSelector" @click="showFormSelector = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Register New Outreach Event</h3>
          <button class="close-btn" @click="showFormSelector = false">×</button>
        </div>
        <div class="modal-body">
          <div class="program-stages-grid">
            <div 
              v-for="form in formTypes" 
              :key="form.id" 
              class="stage-card"
              @click="createNewForm(form.id)"
            >
              <div class="stage-icon">
                <i :class="form.icon"></i>
              </div>
              <div class="stage-info">
                <h4>{{ form.name }}</h4>
                <p>Register a new {{ form.name.toLowerCase() }} event</p>
              </div>
              <div class="stage-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Editor Modal (Full Screen) -->
    <div class="fullscreen-modal" v-if="activeView === 'editor'">
      <div class="editor-toolbar">
        <div class="editor-title">
          <button class="back-icon-btn" @click="activeView = 'list'">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h3>{{ currentForm ? getFormTypeName(currentForm.formType) : 'New Event' }}</h3>
          <span class="editor-subtitle" v-if="currentForm?.childName"> - {{ currentForm.childName }}</span>
        </div>
        <div class="editor-actions">
          <button class="dhis2-btn secondary" @click="saveFormAsDraft">Save Draft</button>
          <button class="dhis2-btn primary" @click="submitForm" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Complete & Save' }}
          </button>
        </div>
      </div>
      
      <div class="editor-content">
        <div class="form-wrapper">
          <BirthDeliveryForm
            v-if="currentForm?.formType === 'birth-delivery'"
            @form-saved="handleFormSaved"
          />
          <CarePlanBabyForm
            v-else-if="currentForm?.formType === 'care-plan-baby'"
            @form-saved="handleFormSaved"
          />
          <MedicalIntakeForm
            v-else-if="currentForm?.formType === 'medical-intake'"
            @form-saved="handleFormSaved"
          />
          <PsychologicalAssessmentForm
            v-else-if="currentForm?.formType === 'psychological-assessment'"
            @form-saved="handleFormSaved"
          />
          <AcademicsLiteracyForm
            v-else-if="currentForm?.formType === 'academics-literacy'"
            @form-saved="handleFormSaved"
          />
          <LifeSkillsSurveyForm
            v-else-if="currentForm?.formType === 'life-skills'"
            @form-saved="handleFormSaved"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import TopHeader from "./TopHeader.vue";
import BirthDeliveryForm from "./BirthDeliveryForm.vue";
import CarePlanBabyForm from "./CarePlanBabyForm.vue";
import MedicalIntakeForm from "./MedicalIntakeForm.vue";
import PsychologicalAssessmentForm from "./PsychologicalAssessmentForm.vue";
import AcademicsLiteracyForm from "./AcademicsLiteracyForm.vue";
import LifeSkillsSurveyForm from "./LifeSkillsSurveyForm.vue";
import Maps from "./Maps.vue";
import DataVisualizer from "./DataVisualizer.vue";
import { useToast } from "../composables/useToast.js";
import { useNetworkStatus } from "../composables/useNetworkStatus.js";
import EnhancedOutreachService from "../services/enhancedOutreachService.js";

const router = useRouter();
const { success, error, warning } = useToast();
const { isOnline, isChecking, checkConnection } = useNetworkStatus();

// UI State
const activeView = ref('list'); // list, map, analytics, editor
const showFormSelector = ref(false);
const searchQuery = ref("");
const selectedProgram = ref("child-care");
const selectedOrgUnit = ref("Lusaka District");
const filters = ref({
  active: true,
  completed: true,
  cancelled: false
});

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Data State
const forms = ref([]);
const currentForm = ref(null);
const isSubmitting = ref(false);
const isSyncing = ref(false);
const syncHistory = ref([]);

// Configuration
const formTypes = [
  { id: "birth-delivery", name: "Birth & Delivery Report", icon: "fas fa-baby" },
  { id: "care-plan-baby", name: "Care Plan (Baby)", icon: "fas fa-baby-carriage" },
  { id: "medical-intake", name: "Medical Intake", icon: "fas fa-stethoscope" },
  { id: "psychological-assessment", name: "Psychological Assessment", icon: "fas fa-brain" },
  { id: "academics-literacy", name: "Academics & Literacy", icon: "fas fa-book-reader" },
  { id: "life-skills", name: "Life Skills Survey", icon: "fas fa-users-cog" },
];

// Computed
const filteredForms = computed(() => {
  let result = forms.value;

  // Search Filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(f => 
      (f.childName && f.childName.toLowerCase().includes(query)) ||
      (f.caseId && f.caseId.toLowerCase().includes(query)) ||
      (f.orgUnit && f.orgUnit.toLowerCase().includes(query))
    );
  }

  // Org Unit Filter
  if (selectedOrgUnit.value && selectedOrgUnit.value !== "Lusaka District") {
    result = result.filter(f => f.orgUnit === selectedOrgUnit.value);
  }

  // Program Filter
  // For now, we just show all forms, but in a real app we would filter by program
  // if (selectedProgram.value !== 'all') { ... }

  // Status Filter
  result = result.filter(f => {
    if (filters.value.active && f.status === 'active') return true;
    if (filters.value.completed && f.status === 'completed') return true;
    if (filters.value.cancelled && f.status === 'cancelled') return true;
    if (f.status === 'draft') return true; // Always show drafts for now
    return false;
  });

  return result;
});

const paginatedForms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredForms.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredForms.value.length / itemsPerPage.value));

const pendingSyncCount = computed(() => forms.value.filter(f => !f.synced).length);

// Methods
const getFormTypeName = (type) => {
  const ft = formTypes.find(f => f.id === type);
  return ft ? ft.name : type;
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const filterOrgUnit = (unitName) => {
  selectedOrgUnit.value = unitName;
  currentPage.value = 1; // Reset to first page
};

const createNewForm = (formType) => {
  showFormSelector.value = false;
  currentForm.value = EnhancedOutreachService.createFormTemplate(formType);
  // Add mock org unit
  currentForm.value.orgUnit = selectedOrgUnit.value;
  activeView.value = 'editor';
};

const editForm = (form) => {
  currentForm.value = { ...form };
  activeView.value = 'editor';
};

const viewForm = (form) => {
  // Read-only mode could be implemented, for now just edit
  editForm(form);
};

const deleteForm = async (form) => {
  if (confirm(`Are you sure you want to delete the event for ${form.childName}?`)) {
    try {
      const result = await EnhancedOutreachService.deleteForm(form.id);
      if (result.success) {
        success("Event deleted successfully");
        loadFormsFromStorage();
      } else {
        error("Failed to delete event: " + result.error);
      }
    } catch (err) {
      error("Failed to delete event");
    }
  }
};

const downloadEvents = () => {
  const data = filteredForms.value.map(f => ({
    Date: formatDate(f.createdAt),
    OrgUnit: f.orgUnit,
    EventType: getFormTypeName(f.formType),
    ChildName: f.childName,
    CaseID: f.caseId,
    Status: f.status,
    Synced: f.synced ? 'Yes' : 'No'
  }));

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `outreach_events_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const goToPage = (page) => {
  currentPage.value = page;
};

const saveFormAsDraft = async () => {
  try {
    if (currentForm.value) {
      currentForm.value.status = 'draft';
      const result = await EnhancedOutreachService.saveFormLocally(currentForm.value);
      if (result.success) {
        success("Draft saved successfully");
        loadFormsFromStorage();
      } else {
        error("Error saving draft: " + result.error);
      }
    }
  } catch (err) {
    error("Error: " + err.message);
  }
};

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    if (currentForm.value) {
      currentForm.value.status = 'completed';
      currentForm.value.updatedAt = new Date().toISOString();
      
      const result = await EnhancedOutreachService.saveFormLocally(currentForm.value);
      if (result.success) {
        success("Event completed successfully");
        activeView.value = 'list';
        loadFormsFromStorage();
      } else {
        error("Error submitting: " + result.error);
      }
    }
  } catch (err) {
    error("Error: " + err.message);
  } finally {
    isSubmitting.value = false;
  }
};

const handleFormSaved = async (formData) => {
  // Callback from child form components
  if (currentForm.value) {
    currentForm.value.data = { ...formData };
    // Auto-save draft
    await EnhancedOutreachService.saveFormLocally(currentForm.value);
  }
};

const syncData = async () => {
  isSyncing.value = true;
  try {
    const result = await EnhancedOutreachService.syncAllForms();
    if (result.success) {
      loadFormsFromStorage();
      success(`Synced ${result.syncedCount} forms`);
    } else {
      error("Sync failed: " + result.error);
    }
  } catch (err) {
    error("Sync error: " + err.message);
  } finally {
    isSyncing.value = false;
  }
};

const loadFormsFromStorage = async () => {
  try {
    forms.value = await EnhancedOutreachService.getAllForms();
  } catch (err) {
    console.error("Load error:", err);
  }
};

// Lifecycle
onMounted(async () => {
  await EnhancedOutreachService.initialize();
  await loadFormsFromStorage();
  
  // Watch for online status to auto-sync
  watch(isOnline, async (online) => {
    if (online) {
      const result = await EnhancedOutreachService.autoSyncWhenOnline();
      if (result.success && result.syncedCount > 0) {
        success(`Auto-synced ${result.syncedCount} forms`);
        loadFormsFromStorage();
      }
    }
  });
});
</script>

<style scoped>
.dhis2-app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f5f7;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  color: #212121;
}

/* Toolbar */
.app-toolbar {
  height: 48px;
  background: white;
  border-bottom: 1px solid #d5d5d5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2b6693;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #d5d5d5;
  margin: 0 8px;
}

.toolbar-btn {
  height: 32px;
  padding: 0 12px;
  border: none;
  background: transparent;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #494949;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #e0e0e0;
}

.toolbar-btn.active {
  background: #e8f4f8;
  color: #2b6693;
}

.toolbar-btn.primary {
  background: #2b6693;
  color: white;
}

.toolbar-btn.primary:hover {
  background: #1d4260;
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #10b981;
}

.sync-status.offline {
  color: #ef4444;
}

.badge {
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 1px 5px;
  border-radius: 10px;
  margin-left: 4px;
}

/* App Content */
.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-section {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #616161;
  font-weight: 500;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #757575;
}

.org-unit-tree {
  font-size: 0.9rem;
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 3px;
}

.tree-item:hover {
  background: #f5f5f5;
}

.tree-item.selected {
  background: #e3f2fd;
  color: #1976d2;
}

.tree-children {
  padding-left: 24px;
}

.org-icon {
  color: #757575;
}

.dhis2-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d5d5d5;
  border-radius: 3px;
  font-size: 0.9rem;
  color: #212121;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #212121;
  cursor: pointer;
}

/* Main Workspace */
.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f3f5f7;
  overflow: hidden;
}

.workspace-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: 1px solid #d5d5d5;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #757575;
}

.search-bar input {
  width: 100%;
  padding: 8px 8px 8px 32px;
  border: 1px solid #d5d5d5;
  border-radius: 3px;
  font-size: 0.9rem;
}

.workspace-actions {
  display: flex;
  gap: 8px;
}

.dhis2-btn {
  height: 36px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 3px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.dhis2-btn.primary {
  background: #2b6693;
  color: white;
}

.dhis2-btn.primary:hover {
  background: #1d4260;
}

.dhis2-btn.secondary {
  background: white;
  border-color: #d5d5d5;
  color: #494949;
}

.dhis2-btn.secondary:hover {
  background: #f5f5f5;
}

/* Data Table */
.data-table-container {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.dhis2-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.dhis2-table th {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #d5d5d5;
  background: #f8f9fa;
  font-weight: 500;
  color: #494949;
  font-size: 0.85rem;
}

.dhis2-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  color: #212121;
  font-size: 0.9rem;
}

.dhis2-table tr:hover {
  background: #f5f9fc;
}

.event-type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  background: #e3f2fd;
  color: #1565c0;
  font-weight: 500;
}

.status-tag {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
}

.status-tag.active { background: #e8f5e9; color: #2e7d32; }
.status-tag.completed { background: #e3f2fd; color: #1565c0; }
.status-tag.cancelled { background: #ffebee; color: #c62828; }
.status-tag.draft { background: #fff3e0; color: #ef6c00; }

.text-green { color: #10b981; }
.text-orange { color: #f59e0b; }

.actions-col {
  text-align: right;
  white-space: nowrap;
}

.icon-action {
  background: none;
  border: none;
  cursor: pointer;
  color: #757575;
  padding: 4px 8px;
  font-size: 1rem;
  transition: color 0.2s;
}

.icon-action:hover { color: #2b6693; }
.icon-action.delete:hover { color: #ef4444; }

.empty-state {
  text-align: center;
  padding: 40px;
  color: #757575;
}

.empty-content i {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #e0e0e0;
}

/* Pagination */
.pagination-bar {
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #d5d5d5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 0.85rem;
  color: #616161;
}

.pagination-controls button {
  padding: 4px 12px;
  border: 1px solid #d5d5d5;
  background: white;
  cursor: pointer;
  margin-left: 4px;
  border-radius: 3px;
  font-size: 0.85rem;
}

.pagination-controls button.active {
  background: #2b6693;
  color: white;
  border-color: #2b6693;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 600px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #212121;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #757575;
}

.modal-body {
  padding: 24px;
}

.program-stages-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.stage-card {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.stage-card:hover {
  border-color: #2b6693;
  background: #f0f7fc;
}

.stage-icon {
  width: 40px;
  height: 40px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.stage-info {
  flex: 1;
}

.stage-info h4 {
  margin: 0 0 4px 0;
  color: #212121;
}

.stage-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #757575;
}

.stage-arrow {
  color: #bdbdbd;
}

/* Fullscreen Editor */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f3f5f7;
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  height: 64px;
  background: white;
  border-bottom: 1px solid #d5d5d5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-icon-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #494949;
  padding: 8px;
  border-radius: 50%;
}

.back-icon-btn:hover {
  background: #f5f5f5;
}

.editor-title h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #212121;
}

.editor-subtitle {
  color: #757575;
  font-size: 1.1rem;
}

.editor-actions {
  display: flex;
  gap: 12px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
}

.form-wrapper {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 32px;
  min-height: 500px;
}

@media (max-width: 768px) {
  .app-toolbar {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
    gap: 8px;
  }

  .toolbar-left, .toolbar-right {
    justify-content: space-between;
    width: 100%;
  }

  .app-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #d5d5d5;
    display: none; /* Hide sidebar on mobile by default */
  }

  .workspace-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .search-bar {
    width: 100%;
  }

  .workspace-actions {
    width: 100%;
    justify-content: space-between;
  }

  .dhis2-btn {
    flex: 1;
    justify-content: center;
  }

  .editor-toolbar {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
    gap: 8px;
  }

  .editor-title {
    justify-content: flex-start;
  }

  .editor-actions {
    width: 100%;
  }

  .editor-actions button {
    flex: 1;
  }

  .editor-content {
    padding: 8px;
  }

  .form-wrapper {
    padding: 16px;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
