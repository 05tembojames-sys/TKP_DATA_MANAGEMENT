<template>
  <div class="dhis2-capture">
    <!-- DHIS2 Top Header -->
    <TopHeader />

    <!-- Page Title Bar -->
    <div class="page-title-bar">
      <h1 class="page-title">Capture</h1>
    </div>

    <!-- Main Three-Column Layout -->
    <div class="capture-layout">
      <!-- LEFT SIDEBAR: Organisation Unit Tree -->
      <div class="org-unit-sidebar">
        <div class="sidebar-header">
          <span>Organisation unit</span>
        </div>
        
        <div class="org-tree-container">
          <OrgUnitTreeNode 
            v-for="ou in orgUnits" 
            :key="ou.id"
            :node="ou"
            :selected="selectedOrgUnit"
            :expanded="expandedOrgUnits"
            @select="selectOrgUnit"
            @toggle="toggleOrgUnit"
          />
        </div>
      </div>

      <!-- MIDDLE: Working List / Form View -->
      <div class="main-content">
        <!-- TAB NAVIGATION -->
        <div class="tabs-container">
          <button 
            class="tab-button"
            :class="{ active: currentTab === 'list' }"
            @click="currentTab = 'list'"
          >
            Working list
          </button>
        </div>

        <!-- LIST VIEW -->
        <div v-if="viewMode === 'list'" class="list-view">
          <!-- ACTION BAR -->
          <div class="action-bar">
            <!-- Search Box -->
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input 
                type="text" 
                v-model="searchQuery"
                @input="handleSearch"
                placeholder="Search by attributes"
                class="search-input"
              />
            </div>

            <!-- Program Selector -->
            <select v-model="selectedProgram" class="program-select">
              <option value="">Select program</option>
              <option v-for="program in programs" :key="program.id" :value="program.id">
                {{ program.name }}
              </option>
            </select>

            <!-- Register Button -->
            <button @click="registerNewEvent" class="register-button">
              <i class="fas fa-plus"></i>
              Register event
            </button>
          </div>

          <!-- EVENT TABLE -->
          <div class="table-container">
            <table class="event-table">
              <thead>
                <tr>
                  <th @click="sortBy('name')" class="sortable">
                    Name
                    <i class="fas fa-sort"></i>
                  </th>
                  <th @click="sortBy('date')" class="sortable">
                    Date
                    <i class="fas fa-sort"></i>
                  </th>
                  <th @click="sortBy('status')" class="sortable">
                    Status
                    <i class="fas fa-sort"></i>
                  </th>
                  <th @click="sortBy('orgUnit')" class="sortable">
                    Organisation unit
                    <i class="fas fa-sort"></i>
                  </th>
                  <th class="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading" class="loading-row">
                  <td colspan="5" class="loading-cell">
                    <i class="fas fa-spinner fa-spin"></i>
                    Loading...
                  </td>
                </tr>
                <tr v-else-if="filteredEvents.length === 0" class="empty-row">
                  <td colspan="5" class="empty-cell">
                    <div class="empty-state-small">
                      <i class="fas fa-inbox"></i>
                      <p>No events found</p>
                    </div>
                  </td>
                </tr>
                <tr 
                  v-else
                  v-for="event in paginatedEvents" 
                  :key="event.id"
                  class="event-row"
                  @click="viewEventDetails(event)"
                >
                  <td>{{ event.childFirstName }} {{ event.childSurname }}</td>
                  <td>{{ formatDate(event.createdAt) }}</td>
                  <td>
                    <span class="status-badge" :class="event.status">
                      {{ event.status || 'draft' }}
                    </span>
                  </td>
                  <td>{{ event.orgUnitName || 'Main Center' }}</td>
                  <td class="actions-cell">
                    <button 
                      @click.stop="editEvent(event)" 
                      class="action-btn edit-btn"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click.stop="viewEvent(event)" 
                      class="action-btn view-btn"
                      title="View"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      @click.stop="deleteEvent(event.id)" 
                      class="action-btn delete-btn"
                      title="Delete"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- PAGINATION -->
          <div class="pagination-bar">
            <div class="pagination-info">
              Showing {{ paginationStart }}-{{ paginationEnd }} of {{ totalEvents }} entries
            </div>
            <div class="pagination-controls">
              <button 
                @click="goToFirstPage" 
                :disabled="currentPage === 1"
                class="page-btn"
              >
                «
              </button>
              <button 
                @click="previousPage" 
                :disabled="currentPage === 1"
                class="page-btn"
              >
                ‹
              </button>
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                class="page-btn"
                :class="{ active: page === currentPage }"
              >
                {{ page }}
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="page-btn"
              >
                ›
              </button>
              <button 
                @click="goToLastPage" 
                :disabled="currentPage === totalPages"
                class="page-btn"
              >
                »
              </button>
            </div>
          </div>
        </div>

        <!-- FORM VIEW -->
        <div v-else class="form-view">
          <div class="form-header">
            <button @click="backToList" class="back-button">
              <i class="fas fa-arrow-left"></i>
              Back to working list
            </button>
            <h2 class="form-title">{{ getFormTitle() }}</h2>
          </div>

          <div class="form-content">
            <!-- Initial Referral Form -->
            <InitialReferralForm
              v-if="selectedProgram === 'initial-referral'"
              ref="referralForm"
              :initialData="currentEventData"
              @form-saved="handleFormSaved"
            />

            <!-- Medical Intake Form -->
            <MedicalIntakeForm
              v-else-if="selectedProgram === 'medical-intake'"
              ref="medicalForm"
              :initialData="currentEventData"
              @form-saved="handleFormSaved"
            />

            <!-- Child Overview Form -->
            <ChildOverviewForm
              v-else-if="selectedProgram === 'child-overview'"
              ref="overviewForm"
              :initialData="currentEventData"
              @form-saved="handleFormSaved"
            />

            <!-- Initial Assessment Form -->
            <InitialAssessmentForm
              v-else-if="selectedProgram === 'initial-assessment'"
              ref="assessmentForm"
              :initialData="currentEventData"
              @form-saved="handleFormSaved"
            />
          </div>
        </div>
      </div>

      <!-- RIGHT SIDEBAR: Event Details (when event selected) -->
      <!-- MODAL: Event Details -->
      <div v-if="selectedEvent" class="modal-overlay" @click.self="closeDetails">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Event Details</h3>
            <button @click="closeDetails" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <FormDataDisplay :form="selectedEvent">
              <template #actions>
                <!-- We handle actions in the modal footer -->
                <div style="display: none;"></div>
              </template>
            </FormDataDisplay>
          </div>
          <div class="modal-footer">
            <button @click="editEvent(selectedEvent)" class="modal-btn primary">
              <i class="fas fa-edit"></i>
              Edit Event
            </button>
            <button @click="deleteEvent(selectedEvent.id)" class="modal-btn danger">
              <i class="fas fa-trash"></i>
              Delete Event
            </button>
            <button @click="closeDetails" class="modal-btn secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TopHeader from './TopHeader.vue';
import InitialReferralForm from './InitialReferralForm.vue';
import MedicalIntakeForm from './MedicalIntakeForm.vue';
import ChildOverviewForm from './ChildOverviewForm.vue';
import InitialAssessmentForm from './InitialAssessmentForm.vue';
import OrgUnitTreeNode from './OrgUnitTreeNode.vue';
import CaptureService from '../services/captureService.js';
import formService from '../services/formService.js';
import FormDataDisplay from './FormDataDisplay.vue';

const router = useRouter();
const route = useRoute();

// State
const orgUnits = ref([]);
const programs = ref([]);
const events = ref([]);
const selectedOrgUnit = ref('');
const selectedProgram = ref('');
const selectedEvent = ref(null);
const currentEventData = ref(null);
const expandedOrgUnits = ref(new Set());
const viewMode = ref('list'); // 'list' or 'form'
const currentTab = ref('list');
const loading = ref(false);
const searchQuery = ref('');
const sortColumn = ref('date');
const sortDirection = ref('desc');
const currentPage = ref(1);
const pageSize = ref(10);

// Computed
const filteredEvents = computed(() => {
  let filtered = events.value;
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(event => 
      (event.childFirstName?.toLowerCase().includes(query)) ||
      (event.childSurname?.toLowerCase().includes(query)) ||
      (event.status?.toLowerCase().includes(query))
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortColumn.value];
    let bVal = b[sortColumn.value];
    
    if (sortColumn.value === 'date') {
      aVal = new Date(a.createdAt);
      bVal = new Date(b.createdAt);
    }
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  return filtered;
});

const totalEvents = computed(() => filteredEvents.value.length);
const totalPages = computed(() => Math.ceil(totalEvents.value / pageSize.value));

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredEvents.value.slice(start, end);
});

const paginationStart = computed(() => {
  if (totalEvents.value === 0) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  const end = currentPage.value * pageSize.value;
  return end > totalEvents.value ? totalEvents.value : end;
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const loadOrgUnits = async () => {
  try {
    const response = await CaptureService.getOrgUnits();
    orgUnits.value = buildOrgTree(response);
    if (response.length > 0) {
      selectedOrgUnit.value = response[0].id;
    }
  } catch (error) {
    console.error('Error loading org units:', error);
  }
};

const buildOrgTree = (flatList) => {
  // Build hierarchical tree from flat list
  const map = new Map();
  const roots = [];
  
  flatList.forEach(ou => {
    map.set(ou.id, { ...ou, children: [] });
  });
  
  flatList.forEach(ou => {
    const node = map.get(ou.id);
    if (ou.parent) {
      const parent = map.get(ou.parent);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });
  
  return roots;
};

const loadPrograms = async () => {
  try {
    const response = await CaptureService.getDataSets();
    programs.value = response;
    if (response.length > 0 && !selectedProgram.value) {
      selectedProgram.value = response[0].id;
    }
  } catch (error) {
    console.error('Error loading programs:', error);
  }
};

const loadEvents = async () => {
  if (!selectedProgram.value) return;
  
  try {
    loading.value = true;
    const response = await formService.getForms(selectedProgram.value);
    if (response.success) {
      events.value = response.forms || [];
    }
  } catch (error) {
    console.error('Error loading events:', error);
    events.value = [];
  } finally {
    loading.value = false;
  }
};

const selectOrgUnit = (ouId) => {
  selectedOrgUnit.value = ouId;
  loadEvents();
};

const toggleOrgUnit = (ouId) => {
  if (expandedOrgUnits.value.has(ouId)) {
    expandedOrgUnits.value.delete(ouId);
  } else {
    expandedOrgUnits.value.add(ouId);
  }
};

const registerNewEvent = () => {
  if (!selectedProgram.value) {
    alert('Please select a program first');
    return;
  }
  currentEventData.value = null;
  viewMode.value = 'form';
};

const editEvent = (event) => {
  currentEventData.value = event;
  viewMode.value = 'form';
  selectedEvent.value = null;
};

const viewEvent = (event) => {
  // Open details sidebar instead of navigating
  selectedEvent.value = event;
};

const viewEventDetails = (event) => {
  selectedEvent.value = event;
};

const closeDetails = () => {
  selectedEvent.value = null;
};

const deleteEvent = async (eventId) => {
  if (!confirm('Are you sure you want to delete this event?')) return;
  
  try {
    loading.value = true;
    const result = await formService.deleteForm(eventId);
    if (result.success) {
      await loadEvents();
      selectedEvent.value = null;
    } else {
      alert('Failed to delete event: ' + result.error);
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Error deleting event');
  } finally {
    loading.value = false;
  }
};

const handleFormSaved = async () => {
  viewMode.value = 'list';
  await loadEvents();
};

const backToList = () => {
  viewMode.value = 'list';
  currentEventData.value = null;
};

const getFormTitle = () => {
  const program = programs.value.find(p => p.id === selectedProgram.value);
  return program ? `New ${program.name}` : 'New Event';
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-GB');
};

const handleSearch = () => {
  currentPage.value = 1;
};

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToFirstPage = () => {
  currentPage.value = 1;
};

const goToLastPage = () => {
  currentPage.value = totalPages.value;
};

// Watch
watch(selectedProgram, () => {
  loadEvents();
});

// Lifecycle
onMounted(async () => {
  await loadOrgUnits();
  await loadPrograms();
  await loadEvents();
});
</script>

<style scoped>
/* DHIS2 Color Variables */
.dhis2-capture {
  --dhis2-blue: #147cd7;
  --dhis2-blue-hover: #1169ba;
  --dhis2-blue-light: #e8f3fa;
  --text-dark: #212934;
  --text-gray: #494949;
  --border-color: #d5dde5;
  --bg-gray: #f4f6f8;
  --white: #ffffff;
  
  background: var(--bg-gray);
  min-height: 100vh;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  color: var(--text-dark);
}

/* Page Title Bar */
.page-title-bar {
  background: var(--white);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 24px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 400;
  color: var(--text-dark);
}

/* Three Column Layout */
.capture-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: calc(100vh - 120px);
}

/* LEFT SIDEBAR: Org Unit Tree */
.org-unit-sidebar {
  background: var(--white);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.sidebar-header {
  padding: 16px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-gray);
  border-bottom: 1px solid var(--border-color);
  letter-spacing: 0.5px;
}

.org-tree-container {
  padding: 8px;
}

/* MAIN CONTENT */
.main-content {
  background: var(--white);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Tabs */
.tabs-container {
  border-bottom: 1px solid var(--border-color);
  padding: 0 24px;
}

.tab-button {
  padding: 12px 16px;
  border: none;
  background: none;
  color: var(--text-gray);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s;
}

.tab-button:hover {
  color: var(--dhis2-blue);
}

.tab-button.active {
  color: var(--dhis2-blue);
  border-bottom-color: var(--dhis2-blue);
  font-weight: 500;
}

/* LIST VIEW */
.list-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Action Bar */
.action-bar {
  padding: 16px 24px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
  background: var(--white);
}

.search-box {
  flex: 1;
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-gray);
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: var(--dhis2-blue);
}

.program-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  background: var(--white);
  min-width: 200px;
}

.program-select:focus {
  outline: none;
  border-color: var(--dhis2-blue);
}

.register-button {
  padding: 8px 16px;
  background: var(--dhis2-blue);
  color: var(--white);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: background 0.2s;
}

.register-button:hover {
  background: var(--dhis2-blue-hover);
}

/* Table */
.table-container {
  flex: 1;
  overflow-y: auto;
}

.event-table {
  width: 100%;
  border-collapse: collapse;
}

.event-table thead {
  position: sticky;
  top: 0;
  background: var(--white);
  z-index: 10;
}

.event-table th {
  text-align: left;
  padding: 12px 24px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-gray);
  border-bottom: 1px solid var(--border-color);
  letter-spacing: 0.5px;
}

.event-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.event-table th.sortable:hover {
  background: var(--bg-gray);
}

.event-table td {
  padding: 12px 24px;
  border-bottom: 1px solid var(--bg-gray);
}

.event-row {
  cursor: pointer;
  transition: background 0.15s;
}

.event-row:hover {
  background: var(--bg-gray);
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.draft {
  background: #e0e0e0;
  color: #666;
}

.status-badge.submitted {
  background: var(--dhis2-blue-light);
  color: var(--dhis2-blue);
}

.status-badge.completed {
  background: #e8f5e9;
  color: #4caf50;
}

.status-badge.approved {
  background: #e8f5e9;
  color: #4caf50;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  background: var(--white);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-gray);
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-gray);
  color: var(--dhis2-blue);
}

.action-btn.delete-btn:hover {
  color: #f44336;
  border-color: #f44336;
}

.loading-row,
.empty-row {
  height: 200px;
}

.loading-cell,
.empty-cell {
  text-align: center;
  color: var(--text-gray);
}

.empty-state-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-state-small i {
  font-size: 48px;
  opacity: 0.3;
}

/* Pagination */
.pagination-bar {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--white);
}

.pagination-info {
  font-size: 14px;
  color: var(--text-gray);
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background: var(--white);
  color: var(--text-dark);
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  min-width: 36px;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: var(--bg-gray);
}

.page-btn.active {
  background: var(--dhis2-blue);
  color: var(--white);
  border-color: var(--dhis2-blue);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* FORM VIEW */
.form-view {
  height: 100%;
  overflow-y: auto;
}

.form-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
}

.back-button {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background: var(--white);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dhis2-blue);
  font-size: 14px;
  margin-bottom: 16px;
  transition: all 0.2s;
}

.back-button:hover {
  background: var(--bg-gray);
}

.form-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.form-content {
  padding: 24px;
}

/* RIGHT SIDEBAR: Details */
/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: var(--white);
  border-radius: 4px;
  width: 900px;
  max-width: 95%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-dark);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-gray);
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.detail-item p {
  margin: 0;
  font-size: 15px;
  color: var(--text-dark);
  font-weight: 400;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: var(--bg-gray);
}

.modal-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.modal-btn.primary {
  background: var(--dhis2-blue);
  color: var(--white);
}

.modal-btn.primary:hover {
  background: var(--dhis2-blue-hover);
}

.modal-btn.danger {
  background: #f44336;
  color: var(--white);
}

.modal-btn.danger:hover {
  background: #d32f2f;
}

.modal-btn.secondary {
  background: white;
  border: 1px solid var(--border-color);
  color: var(--text-gray);
}

.modal-btn.secondary:hover {
  background: var(--bg-gray);
}

/* Responsive */
@media (max-width: 1024px) {
  .capture-layout {
    grid-template-columns: 1fr;
  }
  
  .org-unit-sidebar {
    display: none;
  }
  
  .details-sidebar {
    position: fixed;
    right: 0;
    top: 88px;
    height: calc(100vh - 88px);
    z-index: 100;
  }
}
</style>
