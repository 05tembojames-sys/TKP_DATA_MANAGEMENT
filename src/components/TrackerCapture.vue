<template>
  <div class="tracker-capture-container">
    <!-- Top Header -->
    <TopHeader />

    <!-- Tracker Sub-Header -->
    <div class="tracker-sub-header">
      <div class="header-left">
        <h1 class="tracker-title">Tracker Capture</h1>
        <div class="program-select-container">
          <select v-model="selectedProgram" class="program-select">
            <option value="" disabled>Select Program</option>
            <option v-for="prog in programs" :key="prog.id" :value="prog.id">{{ prog.name }}</option>
          </select>
        </div>
      </div>
      <div class="header-right">
        <button @click="showRegisterModal = true" class="register-button">
          <i class="fas fa-plus"></i>
          Register
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="tracker-main">
      <!-- Left Sidebar - Organisation Units -->
      <div class="org-unit-sidebar">
        <div class="sidebar-header">
          <h3>Organisation Units</h3>
        </div>
        <div class="org-search-container" style="padding: 0.5rem;">
           <input type="text" placeholder="Search Org Unit..." class="search-org-input" />
        </div>
        <div class="org-tree">
          <div 
            v-for="unit in orgUnits" 
            :key="unit.id"
            class="org-unit-item"
            :class="{ active: selectedOrgUnit === unit.id }"
            @click="selectOrgUnit(unit.id)"
          >
            <i :class="unit.icon"></i>
            <span>{{ unit.name }}</span>
          </div>
        </div>
      </div>

      <!-- Center Panel - Tracked Entities List (Visible when no entity selected) -->
      <div v-if="!selectedEntity" class="entities-panel">
        <!-- Search and Filters -->
        <div class="search-section">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Search by name, ID..."
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="filters">
            <select v-model="filterStatus" @change="filterEntities" class="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select v-model="filterGender" @change="filterEntities" class="filter-select">
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <!-- Entities List -->
        <div class="entities-list">
          <div class="list-header">
            <span class="col-wide">Name</span>
            <span class="col">ID</span>
            <span class="col">Age</span>
            <span class="col">Gender</span>
            <span class="col">Enrollment Date</span>
            <span class="col-action">Action</span>
          </div>
          
          <div 
            v-for="entity in paginatedEntities" 
            :key="entity.id"
            class="entity-item"
            :class="{ selected: selectedEntity?.id === entity.id }"
            @click="selectEntity(entity)"
          >
            <span class="col-wide entity-name">
              <i class="fas fa-user-circle"></i>
              {{ entity.firstName }} {{ entity.lastName }}
            </span>
            <span class="col">{{ entity.caseId || entity.childId }}</span>
            <span class="col">{{ entity.age }}</span>
            <span class="col">{{ entity.gender }}</span>
            <span class="col">{{ formatDate(entity.enrollmentDate) }}</span>
            <span class="col-action">
              <button @click.stop="selectEntity(entity)" class="view-btn">
                <i class="fas fa-arrow-right"></i>
              </button>
            </span>
          </div>

          <div v-if="filteredEntities.length === 0" class="no-results">
            <i class="fas fa-inbox"></i>
            <p>No tracked entities found</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="filteredEntities.length > 0">
          <span>Showing {{ paginationText }}</span>
          <div class="pagination-controls">
            <button @click="previousPage" :disabled="currentPage === 1">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel - Entity Dashboard (Full Main Area when selected) -->
      <div v-else class="dashboard-panel">
         <div class="dashboard-top-bar">
             <button @click="backToSearch" class="back-btn">
                <i class="fas fa-arrow-left"></i> Back to List
             </button>
         </div>
         <div class="entity-dashboard">
          <!-- Profile Header -->
          <div class="profile-header">
            <div class="profile-avatar">
              {{ selectedEntity.firstName.charAt(0) }}{{ selectedEntity.lastName.charAt(0) }}
            </div>
            <div class="profile-info">
              <h2>{{ selectedEntity.firstName }} {{ selectedEntity.lastName }}</h2>
              <div class="profile-meta">
                <span><i class="fas fa-id-card"></i> {{ selectedEntity.caseId || selectedEntity.childId }}</span>
                <span><i class="fas fa-calendar"></i> {{ selectedEntity.age }} years</span>
                <span><i class="fas fa-venus-mars"></i> {{ selectedEntity.gender }}</span>
              </div>
            </div>
            <div class="profile-actions">
              <button @click="editEntity" class="action-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteEntity" class="action-btn danger">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="dashboard-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="{ active: activeTab === tab.id }"
              class="tab-button"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Attributes Tab -->
            <div v-if="activeTab === 'attributes'" class="attributes-view">
              <h3>Tracked Entity Attributes</h3>
              <div class="attributes-grid">
                <div 
                  v-for="(value, key) in selectedEntity.attributes" 
                  :key="key" 
                  v-show="value && value !== 'N/A' && value !== 'None reported' && value !== 'None'"
                  class="attribute-item"
                >
                  <label>{{ formatAttributeName(key) }}</label>
                  <span>{{ value }}</span>
                </div>
              </div>
              <div v-if="!hasVisibleAttributes" class="no-attributes">
                <i class="fas fa-info-circle"></i>
                <p>No additional attributes available for this entity</p>
              </div>
            </div>

            <!-- Enrollment Tab -->
            <div v-if="activeTab === 'enrollment'" class="enrollment-view">
              <div class="enrollment-header">
                <h3>Program Enrollments</h3>
                <button @click="enrollInProgram" class="enroll-btn">
                  <i class="fas fa-plus"></i>
                  Enroll in Program
                </button>
              </div>
              
              <div class="enrollments-list">
                <div v-for="enrollment in selectedEntity.enrollments" :key="enrollment.id" class="enrollment-card">
                  <div class="enrollment-main">
                    <div class="enrollment-info">
                      <h4>{{ enrollment.program }}</h4>
                      <p>Enrolled: {{ formatDate(enrollment.enrollmentDate) }}</p>
                      <span class="status-badge" :class="enrollment.status">{{ enrollment.status }}</span>
                    </div>
                    <button @click="viewEnrollment(enrollment)" class="view-enrollment-btn">
                      View Details
                    </button>
                  </div>
                  
                  <!-- Current Stage Indicator -->
                  <div class="current-stage-section">
                    <div class="stage-header">
                      <h5><i class="fas fa-map-marked-alt"></i> Current Stage</h5>
                      <span class="stage-badge" :class="getCurrentStageClass(selectedEntity)">
                        {{ formatStageName(selectedEntity.attributes?.currentStage || 'referral') }}
                      </span>
                    </div>
                    
                    <!-- Program Stages Progress -->
                    <div class="stages-timeline">
                      <div 
                        v-for="stage in programStages" 
                        :key="stage.id"
                        class="stage-step"
                        :class="getStageStatus(stage.id, selectedEntity)"
                      >
                        <div class="stage-marker">
                          <i :class="getStageIcon(stage.id, selectedEntity)"></i>
                        </div>
                        <div class="stage-content">
                          <strong>{{ stage.name }}</strong>
                          <span class="stage-forms">{{ getStageFormCount(stage.id, selectedEntity) }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Completed Forms -->
                    <div class="completed-forms">
                      <h6><i class="fas fa-check-square"></i> Completed Forms</h6>
                      <div class="forms-list">
                        <div 
                          v-for="event in getCompletedForms(selectedEntity)" 
                          :key="event.id"
                          class="form-chip"
                          :class="event.status"
                        >
                          <i class="fas fa-check-circle"></i>
                          {{ event.formType }}
                        </div>
                        <div v-if="getCompletedForms(selectedEntity).length === 0" class="no-forms">
                          <i class="fas fa-info-circle"></i>
                          <span>No completed forms yet</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Events Tab -->
            <div v-if="activeTab === 'events'" class="events-view">
              <div class="events-header">
                <h3>Program Events</h3>
                <button @click="scheduleEvent" class="schedule-btn">
                  <i class="fas fa-plus"></i>
                  Schedule Event
                </button>
              </div>
              
              <!-- Quick Access Section -->
              <div class="quick-forms-section">
                <h4><i class="fas fa-bolt"></i> Quick Access</h4>
                <div class="quick-forms-grid">
                  <div class="quick-form-card" @click="openForm('Child Overview')">
                    <i class="fas fa-child" style="color: #93c5fd;"></i>
                    <span>Child Overview</span>
                  </div>
                  <div class="quick-form-card" @click="openForm('Medical Intake')">
                    <i class="fas fa-user-md" style="color: #86efac;"></i>
                    <span>Medical Intake</span>
                  </div>
                  <div class="quick-form-card" @click="openForm('Academics & Literacy')">
                    <i class="fas fa-book" style="color: #fde047;"></i>
                    <span>Academics</span>
                  </div>
                  <div class="quick-form-card" @click="openForm('Care Plan Summary')">
                    <i class="fas fa-clipboard-list" style="color: #d8b4fe;"></i>
                    <span>Care Plan</span>
                  </div>
                  <div class="quick-form-card" @click="openForm('Regular Follow-up')">
                    <i class="fas fa-walking" style="color: #f9a8d4;"></i>
                    <span>Follow-up</span>
                  </div>
                </div>
              </div>

              <div class="events-timeline">
                <div class="timeline-title">
                  <i class="fas fa-history"></i>
                  Timeline
                </div>
                
                <div v-for="event in selectedEntity.events" :key="event.id" class="timeline-item">
                  <div class="timeline-marker" :class="event.status"></div>
                  <div class="event-card">
                    <div class="event-header">
                      <h4>{{ event.formType }}</h4>
                      <span class="event-date">{{ formatDate(event.date) }}</span>
                    </div>
                    <div class="event-meta">
                      <span class="status-badge" :class="event.status">{{ event.status }}</span>
                      <span class="event-org">{{ event.orgUnitName || 'Main Center' }}</span>
                    </div>
                    <div class="event-actions">
                      <button @click="enterData(event)" class="data-entry-btn">
                        <i class="fas fa-edit"></i> {{ event.status === 'completed' ? 'View Data' : 'Enter Data' }}
                      </button>
                      <button @click="viewEventDetails(event)" class="view-details-btn">
                        <i class="fas fa-eye"></i> Details
                      </button>
                    </div>
                  </div>
                </div>
                
                <div v-if="!selectedEntity.events || selectedEntity.events.length === 0" class="no-events">
                  <i class="fas fa-calendar-times"></i>
                  <p>No events recorded for this entity</p>
                </div>
              </div>
            </div>

            <!-- Indicators Tab -->
            <div v-if="activeTab === 'indicators'" class="indicators-view">
              <h3>Program Indicators</h3>
              <div class="indicators-grid">
                <div v-for="indicator in programIndicators" :key="indicator.id" class="indicator-card">
                  <div class="indicator-icon" :style="{ backgroundColor: indicator.color }">
                    <i :class="indicator.icon"></i>
                  </div>
                  <div class="indicator-details">
                    <div class="indicator-value">{{ indicator.value }}</div>
                    <div class="indicator-label">{{ indicator.label }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes Tab -->
            <div v-if="activeTab === 'notes'" class="notes-view">
              <div class="notes-header">
                <h3>Notes & Comments</h3>
                <button @click="showAddNote = !showAddNote" class="add-note-btn">
                  <i class="fas fa-plus"></i>
                  Add Note
                </button>
              </div>
              
              <div v-if="showAddNote" class="add-note-form">
                <textarea v-model="newNote" placeholder="Type your note here..."></textarea>
                <div class="note-actions">
                  <button @click="showAddNote = false" class="cancel-btn">Cancel</button>
                  <button @click="saveNote" class="save-btn">Save Note</button>
                </div>
              </div>
              
              <div class="notes-list">
                <div v-for="note in selectedEntity.notes" :key="note.id" class="note-item">
                  <div class="note-header">
                    <strong>{{ note.createdBy }}</strong>
                    <span class="note-date">{{ formatDate(note.createdDate) }}</span>
                  </div>
                  <p>{{ note.text }}</p>
                </div>
                
                <div v-if="!selectedEntity.notes || selectedEntity.notes.length === 0" class="no-results">
                  <i class="fas fa-sticky-note"></i>
                  <p>No notes available</p>
                </div>
              </div>
            </div>

          </div> <!-- End Tab Content -->
        </div> <!-- End Entity Dashboard -->
      </div> <!-- End Dashboard Panel -->
    </div> <!-- End Tracker Main -->

    <!-- Register Modal -->
    <div v-if="showRegisterModal" class="modal-overlay" @click="showRegisterModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Register New Tracked Entity</h3>
          <button @click="showRegisterModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>First Name *</label>
              <input type="text" v-model="newEntity.firstName" />
            </div>
            <div class="form-group">
              <label>Last Name *</label>
              <input type="text" v-model="newEntity.lastName" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Date of Birth *</label>
              <input type="date" v-model="newEntity.dateOfBirth" />
            </div>
            <div class="form-group">
              <label>Gender *</label>
              <select v-model="newEntity.gender">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Program</label>
            <select v-model="newEntity.program">
              <option value="child-protection">Child Protection Program</option>
              <option value="pregnancy-support">Pregnancy Support Program</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showRegisterModal = false" class="cancel-button">Cancel</button>
          <button @click="registerEntity" class="save-button">Register</button>
        </div>
      </div>
    </div>

    <!-- Enrollment Details Modal -->
    <div v-if="showEnrollmentModal" class="modal-overlay" @click="showEnrollmentModal = false">
      <div class="modal-content enrollment-modal" @click.stop>
        <div class="modal-header">
          <h3>Enrollment Details</h3>
          <button @click="showEnrollmentModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedEnrollment" class="enrollment-details">
            <!-- Program Information -->
            <div class="detail-section">
              <h4><i class="fas fa-briefcase"></i> Program Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Program Name</label>
                  <span>{{ selectedEnrollment.program }}</span>
                </div>
                <div class="detail-item">
                  <label>Enrollment Date</label>
                  <span>{{ formatDate(selectedEnrollment.enrollmentDate) }}</span>
                </div>
                <div class="detail-item">
                  <label>Status</label>
                  <span class="status-badge" :class="selectedEnrollment.status">
                    {{ selectedEnrollment.status }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Days Enrolled</label>
                  <span>{{ calculateDaysEnrolled(selectedEnrollment.enrollmentDate) }} days</span>
                </div>
              </div>
            </div>

            <!-- Participant Information -->
            <div class="detail-section">
              <h4><i class="fas fa-user"></i> Participant Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Name</label>
                  <span>{{ selectedEntity?.firstName }} {{ selectedEntity?.lastName }}</span>
                </div>
                <div class="detail-item">
                  <label>Case ID</label>
                  <span>{{ selectedEntity?.caseId || selectedEntity?.childId }}</span>
                </div>
                <div class="detail-item">
                  <label>Age</label>
                  <span>{{ selectedEntity?.age }} years</span>
                </div>
                <div class="detail-item">
                  <label>Gender</label>
                  <span>{{ selectedEntity?.gender }}</span>
                </div>
              </div>
            </div>

            <!-- Program Progress -->
            <div class="detail-section">
              <h4><i class="fas fa-chart-line"></i> Program Progress</h4>
              <div class="progress-stats">
                <div class="progress-item">
                  <div class="progress-label">Completed Events</div>
                  <div class="progress-bar-container">
                    <div class="progress-bar" :style="{ width: completedPercentage + '%' }"></div>
                  </div>
                  <div class="progress-text">{{ completedEvents }} of {{ totalEvents }} events</div>
                </div>
              </div>
            </div>

            <!-- Recent Events -->
            <div class="detail-section">
              <h4><i class="fas fa-history"></i> Recent Events</h4>
              <div class="recent-events">
                <div v-for="event in recentEnrollmentEvents" :key="event.id" class="event-summary">
                  <div class="event-icon" :class="event.status">
                    <i :class="event.status === 'completed' ? 'fas fa-check' : 'fas fa-clock'"></i>
                  </div>
                  <div class="event-info">
                    <strong>{{ event.formType }}</strong>
                    <span>{{ formatDate(event.date) }}</span>
                  </div>
                  <span class="status-badge small" :class="event.status">{{ event.status }}</span>
                </div>
                <div v-if="recentEnrollmentEvents.length === 0" class="no-events">
                  <i class="fas fa-info-circle"></i>
                  <p>No events recorded yet</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="detail-section">
              <h4><i class="fas fa-cog"></i> Actions</h4>
              <div class="enrollment-actions">
                <button @click="scheduleEvent" class="action-button primary">
                  <i class="fas fa-calendar-plus"></i>
                  Schedule Event
                </button>
                <button @click="viewAllEvents" class="action-button secondary">
                  <i class="fas fa-list"></i>
                  View All Events
                </button>
                <button v-if="selectedEnrollment.status === 'active'" @click="completeEnrollment" class="action-button success">
                  <i class="fas fa-check-circle"></i>
                  Complete Enrollment
                </button>
                <button v-if="selectedEnrollment.status === 'active'" @click="cancelEnrollment" class="action-button danger">
                  <i class="fas fa-times-circle"></i>
                  Cancel Enrollment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Enrollment Modal -->
    <div v-if="showNewEnrollmentModal" class="modal-overlay" @click="showNewEnrollmentModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Enroll in Program</h3>
          <button @click="showNewEnrollmentModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="enrollment-form">
            <!-- Current Entity Info -->
            <div class="info-section">
              <h4><i class="fas fa-user"></i> Enrolling</h4>
              <div class="entity-summary">
                <div class="entity-avatar">
                  {{ selectedEntity?.firstName?.charAt(0) }}{{ selectedEntity?.lastName?.charAt(0) }}
                </div>
                <div class="entity-info">
                  <strong>{{ selectedEntity?.firstName }} {{ selectedEntity?.lastName }}</strong>
                  <span>{{ selectedEntity?.caseId || selectedEntity?.childId }}</span>
                </div>
              </div>
            </div>

            <!-- Program Selection -->
            <div class="form-group">
              <label>Select Program *</label>
              <select v-model="newEnrollment.program" class="form-select">
                <option value="">-- Select Program --</option>
                <option value="Child Protection Program">Child Protection Program</option>
                <option value="Pregnancy Support Program">Pregnancy Support Program</option>
                <option value="Family Support Program">Family Support Program</option>
                <option value="Education Support Program">Education Support Program</option>
                <option value="Medical Support Program">Medical Support Program</option>
              </select>
            </div>

            <!-- Enrollment Date -->
            <div class="form-group">
              <label>Enrollment Date *</label>
              <input 
                type="date" 
                v-model="newEnrollment.enrollmentDate"
                :max="today"
                class="form-input"
              />
            </div>

            <!-- Organization Unit -->
            <div class="form-group">
              <label>Organization Unit *</label>
              <select v-model="newEnrollment.orgUnit" class="form-select">
                <option value="">-- Select Organization Unit --</option>
                <option value="main">Main Center</option>
                <option value="lusaka">Lusaka Outreach</option>
                <option value="chongwe">Chongwe Outreach</option>
              </select>
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label>Notes (Optional)</label>
              <textarea 
                v-model="newEnrollment.notes"
                rows="3"
                class="form-textarea"
                placeholder="Add any enrollment notes or comments..."
              ></textarea>
            </div>

            <!-- Attribution -->
            <div class="form-group">
              <label>Enrolled By</label>
              <input 
                type="text" 
                v-model="newEnrollment.enrolledBy"
                class="form-input"
                placeholder="Staff name"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showNewEnrollmentModal = false" class="cancel-button">Cancel</button>
          <button @click="submitEnrollment" class="save-button" :disabled="!isEnrollmentValid">
            <i class="fas fa-check"></i>
            Enroll in Program
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import TopHeader from "./TopHeader.vue";
import { ref, computed, onMounted, nextTick, watch } from "vue";
import TrackerService from "../services/trackerService.js";
import FormService from "../services/formService.js";
import { useToast } from "../composables/useToast.js";

const { addToast: showToast } = useToast();
const router = useRouter();

// State
const searchQuery = ref("");
const appliedSearchQuery = ref(""); // For debounced search
const filterStatus = ref("");
const filterGender = ref("");
const selectedOrgUnit = ref("main");
const selectedProgram = ref("child-protection");
const selectedEntity = ref(null);
const activeTab = ref("enrollment");
const currentPage = ref(1);
const pageSize = ref(10);
const showRegisterModal = ref(false);
const showAddNote = ref(false);
const newNote = ref("");
const loading = ref(true);
const allEntities = ref([]);
const showEnrollmentModal = ref(false);
const selectedEnrollment = ref(null);
const showNewEnrollmentModal = ref(false);

const newEnrollment = ref({
  program: '',
  enrollmentDate: new Date().toISOString().split('T')[0],
  orgUnit: 'main',
  notes: '',
  enrolledBy: 'Current User'
});

const today = computed(() => new Date().toISOString().split('T')[0]);

const isEnrollmentValid = computed(() => {
  return newEnrollment.value.program && 
         newEnrollment.value.enrollmentDate && 
         newEnrollment.value.orgUnit;
});

const newEntity = ref({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  program: "child-protection"
});

// Data
const orgUnits = ref([
  { id: "main", name: "Main Center", icon: "fas fa-building" },
  { id: "lusaka", name: "Lusaka Outreach", icon: "fas fa-map-marker-alt" },
  { id: "chongwe", name: "Chongwe Outreach", icon: "fas fa-map-marker-alt" }
]);

const programs = ref([
  { id: "child-protection", name: "Child Protection Program" },
  { id: "pregnancy-support", name: "Pregnancy Support Program" },
  { id: "family-support", name: "Family Support Program" }
]);

const tabs = ref([
  { id: "enrollment", label: "Enrollment", icon: "fas fa-briefcase" },
  { id: "attributes", label: "Profile", icon: "fas fa-user" },
  { id: "events", label: "Data Entry", icon: "fas fa-edit" },
  { id: "notes", label: "Notes", icon: "fas fa-sticky-note" }
]);

const programStages = ref([
  { id: 'referral', name: 'Referral', order: 1 },
  { id: 'assessment', name: 'Assessment', order: 2 },
  { id: 'enrollment', name: 'Enrollment', order: 3 },
  { id: 'care-plan', name: 'Care Plan', order: 4 },
  { id: 'follow-up', name: 'Follow-up', order: 5 }
]);

const programIndicators = computed(() => {
  if (!selectedEntity.value) return [];
  
  const completedEvents = selectedEntity.value.events?.filter(e => e.status === 'completed').length || 0;
  const totalEvents = selectedEntity.value.events?.length || 0;
  const scheduledEvents = selectedEntity.value.events?.filter(e => e.status === 'scheduled').length || 0;
  
  const enrollmentDate = new Date(selectedEntity.value.enrollmentDate);
  const daysInProgram = Math.floor((new Date() - enrollmentDate) / (1000 * 60 * 60 * 24));
  
  const progress = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;
  
  return [
    { id: 1, label: "Days in Program", value: daysInProgram.toString(), icon: "fas fa-calendar", color: "#3b82f6" },
    { id: 2, label: "Completed Events", value: `${completedEvents}/${totalEvents}`, icon: "fas fa-check-circle", color: "#10b981" },
    { id: 3, label: "Upcoming Events", value: scheduledEvents.toString(), icon: "fas fa-clock", color: "#f59e0b" },
    { id: 4, label: "Overall Progress", value: `${progress}%`, icon: "fas fa-chart-line", color: "#8b5cf6" }
  ];
});

// Computed
const filteredEntities = computed(() => {
  return allEntities.value.filter(entity => {
    const matchesSearch = !appliedSearchQuery.value || 
      entity.childFirstName?.toLowerCase().includes(appliedSearchQuery.value.toLowerCase()) ||
      entity.childLastName?.toLowerCase().includes(appliedSearchQuery.value.toLowerCase()) ||
      entity.childName?.toLowerCase().includes(appliedSearchQuery.value.toLowerCase()) ||
      entity.childId?.toLowerCase().includes(appliedSearchQuery.value.toLowerCase()) ||
      entity.caseId?.toLowerCase().includes(appliedSearchQuery.value.toLowerCase());
    
    const matchesStatus = !filterStatus.value || entity.status === filterStatus.value;
    const matchesGender = !filterGender.value || entity.gender?.toLowerCase() === filterGender.value.toLowerCase();
    const matchesOrgUnit = !selectedOrgUnit.value || entity.orgUnit === selectedOrgUnit.value;
    const matchesProgram = !selectedProgram.value || entity.program === selectedProgram.value || (!entity.program && selectedProgram.value === 'child-protection');
    
    return matchesSearch && matchesStatus && matchesGender && matchesOrgUnit && matchesProgram;
  });
});

const paginatedEntities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredEntities.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredEntities.value.length / pageSize.value));

const paginationText = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1;
  const end = Math.min(currentPage.value * pageSize.value, filteredEntities.value.length);
  return `${start}-${end} of ${filteredEntities.value.length}`;
});

const hasVisibleAttributes = computed(() => {
  if (!selectedEntity.value?.attributes) return false;
  
  return Object.values(selectedEntity.value.attributes).some(value => 
    value && value !== 'N/A' && value !== 'None reported' && value !== 'None'
  );
});

const completedEvents = computed(() => {
  return selectedEntity.value?.events?.filter(e => e.status === 'completed').length || 0;
});

const totalEvents = computed(() => {
  return selectedEntity.value?.events?.length || 0;
});

const completedPercentage = computed(() => {
  if (totalEvents.value === 0) return 0;
  return Math.round((completedEvents.value / totalEvents.value) * 100);
});

const recentEnrollmentEvents = computed(() => {
  if (!selectedEntity.value?.events) return [];
  return selectedEntity.value.events.slice(0, 5); // Show 5 most recent events
});

// Helper methods for stage tracking
const formatStageName = (stageId) => {
  const stageNames = {
    'referral': 'Referral',
    'assessment': 'Assessment',
    'enrollment': 'Enrollment',
    'care-plan': 'Care Plan',
    'follow-up': 'Follow-up'
  };
  return stageNames[stageId] || stageId;
};

const getCurrentStageClass = (entity) => {
  const stage = entity?.attributes?.currentStage || 'referral';
  const stageClasses = {
    'referral': 'stage-referral',
    'assessment': 'stage-assessment',
    'enrollment': 'stage-enrollment',
    'care-plan': 'stage-care-plan',
    'follow-up': 'stage-follow-up'
  };
  return stageClasses[stage] || 'stage-referral';
};

const getStageStatus = (stageId, entity) => {
  const currentStage = entity?.attributes?.currentStage || 'referral';
  const stages = ['referral', 'assessment', 'enrollment', 'care-plan', 'follow-up'];
  const currentIndex = stages.indexOf(currentStage);
  const stageIndex = stages.indexOf(stageId);
  
  if (stageIndex < currentIndex) return 'completed';
  if (stageIndex === currentIndex) return 'current';
  return 'pending';
};

const getStageIcon = (stageId, entity) => {
  const status = getStageStatus(stageId, entity);
  if (status === 'completed') return 'fas fa-check-circle';
  if (status === 'current') return 'fas fa-dot-circle';
  return 'far fa-circle';
};

const getStageFormCount = (stageId, entity) => {
  if (!entity?.events) return '0 forms';
  
  const stageEvents = entity.events.filter(event => {
    const eventStage = getEventStage(event.formType);
    return eventStage === stageId;
  });
  
  const count = stageEvents.length;
  return count === 1 ? '1 form' : `${count} forms`;
};

const getEventStage = (formType) => {
  const stageMap = {
    // Referral Stage
    'Initial Referral': 'referral',
    
    // Assessment Stage
    'TKP Initial Assessment': 'assessment',
    'Initial Assessment': 'assessment',
    
    // Enrollment Stage
    'Child Overview & Background': 'enrollment',
    'Child Overview': 'enrollment',
    'Program Enrollment': 'enrollment',
    
    // Care Plan Stage
    'Medical Intake Assessment': 'care-plan',
    'Medical Intake': 'care-plan',
    'Academics & Literacy': 'care-plan',
    'Academics and Literacy': 'care-plan',
    'Psychological Assessment': 'care-plan',
    'Life Skills Survey': 'care-plan',
    'Birth & Delivery Report': 'care-plan',
    'Birth and Delivery Report': 'care-plan',
    'Care Plan Summary': 'care-plan',
    'Care Plan (Baby)': 'care-plan',
    'Care Plan Baby': 'care-plan',
    
    // Follow-up Stage
    'Care Plan - Ongoing Life Skills': 'follow-up',
    'Care Plan Ongoing Life Skills': 'follow-up',
    'Regular Follow-up': 'follow-up',
    'Follow-up Visit': 'follow-up'
  };
  
  return stageMap[formType] || 'referral';
};

const getCompletedForms = (entity) => {
  if (!entity?.events) return [];
  return entity.events.filter(e => e.status === 'completed' || e.status === 'complete');
};

const formatMedications = (meds) => {
  if (!meds) return 'None';
  if (typeof meds === 'string') return meds;
  
  // Handle the specific object structure with a 'list' array
  if (meds.list && Array.isArray(meds.list)) {
      if (meds.list.length === 0) return 'None';
      return meds.list.map(m => {
          if (!m.name) return '';
          const dosage = m.dosage ? ` (${m.dosage})` : '';
          const freq = m.frequency ? ` - ${m.frequency}` : '';
          return `${m.name}${dosage}${freq}`;
      }).filter(Boolean).join(', ');
  }
  
  // Fallback if it's an object but not matching the structure
  return 'None';
};

// Methods
const loadCases = async () => {
  loading.value = true;
  try {
    const result = await TrackerService.getAllCases();
    
    if (result.success && result.cases) {
      // Transform cases to entities format
      const entities = result.cases.map(case_ => {
        // Get the most complete form data for attributes
        const primaryEvent = case_.events?.find(e => e.formType === 'child-overview' || e.data?.sourceType === 'child-overview') 
          || case_.events?.find(e => e.formType === 'initial-assessment' || e.data?.sourceType === 'initial-assessment')
          || case_.events?.[0];
        
        const formData = primaryEvent?.data || {};
        
        // Extract all available attributes from form data
        const attributes = {
          // Basic Information
          dateOfBirth: case_.dateOfBirth || formData.dateOfBirth || 'N/A',
          age: case_.age || formData.age || 'N/A',
          gender: case_.gender || formData.gender || 'N/A',
          
          // Contact Information
          phoneNumber: formData.phoneNumber || formData.contactNumber || formData.guardianPhone || 'N/A',
          address: formData.address || formData.currentAddress || formData.residentialAddress || 'N/A',
          district: formData.district || formData.currentDistrict || 'N/A',
          province: formData.province || 'N/A',
          
          // Guardian Information
          guardianName: formData.guardianName || formData.caregiverName || formData.parentGuardianName || 'N/A',
          guardianRelationship: formData.guardianRelationship || formData.relationshipToChild || 'N/A',
          guardianPhone: formData.guardianPhone || formData.guardianContact || 'N/A',
          guardianOccupation: formData.guardianOccupation || 'N/A',
          
          // Education Information
          schoolName: formData.schoolName || formData.currentSchool || 'N/A',
          gradeLevel: formData.gradeLevel || formData.currentGrade || 'N/A',
          educationLevel: formData.educationLevel || 'N/A',
          
          // Medical Information
          medicalConditions: formData.medicalConditions || formData.knownMedicalConditions || 'None reported',
          allergies: formData.allergies || 'None reported',
          medications: formatMedications(formData.currentMedications || formData.medications),
          
          // Program Information
          program: case_.program || formData.program || 'Child Protection Program',
          referralSource: formData.referralSource || formData.sourceOfReferral || 'N/A',
          referralDate: case_.enrollmentDate || formData.dateOfReferral || formData.referralDate || 'N/A',
          dateOfAdmission: formData.dateOfAdmission || formData.admissionDate || 'N/A',
          
          // Additional Information
          nationality: formData.nationality || 'Zambian',
          placeOfBirth: formData.placeOfBirth || 'N/A',
          language: formData.primaryLanguage || formData.language || 'N/A',
          religion: formData.religion || 'N/A',
          
          // Case Information
          caseId: case_.caseId,
          childId: case_.childId,
          currentStage: case_.currentStage || 'referral',
          status: case_.status || 'active',
          assignedWorker: case_.assignedWorker || 'System User',
          lastActivity: case_.lastActivity || case_.updatedAt
        };
        
        return {
          id: case_.id,
          firstName: case_.childFirstName || 'Unknown',
          lastName: case_.childLastName || 'Child',
          age: case_.age || 0,
          gender: case_.gender || 'Unknown',
          enrollmentDate: case_.enrollmentDate || case_.createdAt,
          enrollmentDate: case_.enrollmentDate || case_.createdAt,
          status: case_.status || 'active',
          orgUnit: case_.orgUnit || 'main',
          caseId: case_.caseId,
          childId: case_.childId,
          childName: case_.childName,
          attributes: attributes,
          enrollments: [
            {
              id: case_.id,
              program: case_.program || 'Child Protection Program',
              enrollmentDate: case_.enrollmentDate || case_.createdAt,
              status: case_.status || 'active'
            }
          ],
          events: case_.events || [],
          notes: []
        };
      });
      
      // De-duplication based on caseId (optimised O(N))
      const uniqueEntities = [];
      const entityMap = new Map();
      
      for (const entity of entities) {
        // If no caseId, treat as unique
        if (!entity.caseId) {
          uniqueEntities.push(entity);
          continue;
        }

        if (entityMap.has(entity.caseId)) {
          // It's a duplicate - merge it
          const existingEntity = entityMap.get(entity.caseId);
          
          // Merge events, avoiding duplicates
          if (entity.events && entity.events.length > 0) {
            const existingEventIds = new Set(existingEntity.events.map(e => e.id));
            entity.events.forEach(event => {
              if (!existingEventIds.has(event.id)) {
                existingEntity.events.push(event);
              }
            });
          }
          
          // Merge attributes - prefer non-N/A values from the duplicate if current is missing/N/A
          for (const [key, value] of Object.entries(entity.attributes)) {
            if (value && value !== 'N/A' && value !== 'None reported' && value !== 'None') {
              if (!existingEntity.attributes[key] || 
                  existingEntity.attributes[key] === 'N/A' || 
                  existingEntity.attributes[key] === 'None reported' || 
                  existingEntity.attributes[key] === 'None') {
                existingEntity.attributes[key] = value;
              }
            }
          }
        } else {
          // New unique entity
          entityMap.set(entity.caseId, entity);
          uniqueEntities.push(entity);
        }
      }
      
      allEntities.value = uniqueEntities;
      
      console.log(`Loaded ${allEntities.value.length} tracked entities from Firebase (original: ${entities.length})`);
      if (entities.length !== uniqueEntities.length) {
        console.log(`Removed ${entities.length - uniqueEntities.length} duplicate entries based on caseId matching`);
      }
    } else {
      console.warn('No cases returned from TrackerService');
      allEntities.value = [];
    }
  } catch (error) {
    console.error('Error loading cases:', error);
    showToast('Error loading cases', 'error');
    allEntities.value = [];
  } finally {
    loading.value = false;
  }
};

const selectOrgUnit = (unitId) => {
  selectedOrgUnit.value = unitId;
  console.log("Selected org unit:", unitId);
};

const selectEntity = async (entity) => {
  loading.value = true;
  try {
    // Load full case details
    const result = await TrackerService.getCaseDetails(entity.id);
    
    if (result.success && result.details) {
      const details = result.details;
      
      // Update selected entity with full details and events
      selectedEntity.value = {
        ...entity,
        events: details.events || entity.events || [],
        notes: details.notes || []
      };
      
      activeTab.value = "attributes";
    } else {
      selectedEntity.value = entity;
      activeTab.value = "attributes";
    }
    
    // Scroll to dashboard on mobile
    nextTick(() => {
      if (window.innerWidth <= 768) {
        const dashboard = document.querySelector('.dashboard-panel');
        if (dashboard) {
          dashboard.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  } catch (error) {
    console.error('Error loading entity details:', error);
    selectedEntity.value = entity;
    activeTab.value = "enrollment"; // Default to Enrollment widget
  } finally {
    loading.value = false;
  }
};

const backToSearch = () => {
    selectedEntity.value = null;
    currentPage.value = 1;
};

const filterEntities = () => {
  currentPage.value = 1;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return 'Invalid Date';
  }
};

const formatAttributeName = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const registerEntity = async () => {
  if (!newEntity.value.firstName || !newEntity.value.lastName || !newEntity.value.dateOfBirth || !newEntity.value.gender) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  try {
    const enrollmentData = {
      childFirstName: newEntity.value.firstName,
      childLastName: newEntity.value.lastName,
      dateOfBirth: newEntity.value.dateOfBirth,
      gender: newEntity.value.gender,
      program: newEntity.value.program,
      enrollmentDate: new Date().toISOString(),
      initialFormType: 'child-overview'
    };
    
    const result = await TrackerService.createEnrollment(enrollmentData);
    
    if (result.success) {
      showToast('Entity registered successfully', 'success');
      showRegisterModal.value = false;
      
      // Reset form
      newEntity.value = {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        program: "child-protection"
      };
      
      // Reload cases
      await loadCases();
    } else {
      showToast(result.error || 'Failed to register entity', 'error');
    }
  } catch (error) {
    console.error('Error registering entity:', error);
    showToast('Error registering entity', 'error');
  }
};

const editEntity = () => {
  console.log("Edit entity:", selectedEntity.value);
  showToast('Edit functionality coming soon', 'info');
};

const deleteEntity = async () => {
  if (!selectedEntity.value) return;

  if (confirm(`Are you sure you want to PERMANENTLY delete ${selectedEntity.value.firstName} ${selectedEntity.value.lastName} and all associated records? This action cannot be undone.`)) {
    try {
      loading.value = true;
      // Use caseId if available, otherwise fallback to id
      const deleteId = selectedEntity.value.caseId || selectedEntity.value.id;
      
      const result = await TrackerService.deleteCase(deleteId);
      
      if (result.success) {
        showToast('Entity and associated data deleted successfully', 'success');
        // Clear selection to return to list view
        selectedEntity.value = null;
        // Reload list to reflect changes
        await loadCases();
      } else {
        showToast(result.error || 'Failed to delete entity', 'error');
      }
    } catch (error) {
      console.error('Error deleting entity:', error);
      showToast('An unexpected error occurred while deleting', 'error');
    } finally {
      loading.value = false;
    }
  }
};

const enrollInProgram = () => {
  if (!selectedEntity.value) {
    showToast('Please select a child first', 'error');
    return;
  }
  
  // Reset form
  newEnrollment.value = {
    program: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    orgUnit: selectedOrgUnit.value || 'main',
    notes: '',
    enrolledBy: 'Current User'
  };
  
  showNewEnrollmentModal.value = true;
};

const submitEnrollment = async () => {
  if (!isEnrollmentValid.value || !selectedEntity.value) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  try {
    loading.value = true;
    
    // Create enrollment data
    const enrollmentData = {
      entityId: selectedEntity.value.id,
      caseId: selectedEntity.value.caseId,
      childId: selectedEntity.value.childId,
      childFirstName: selectedEntity.value.firstName,
      childLastName: selectedEntity.value.lastName,
      program: newEnrollment.value.program,
      enrollmentDate: newEnrollment.value.enrollmentDate,
      orgUnit: newEnrollment.value.orgUnit,
      status: 'active',
      notes: newEnrollment.value.notes,
      enrolledBy: newEnrollment.value.enrolledBy,
      createdAt: new Date().toISOString()
    };
    
    // Add to entity's enrollments
    const newEnrollmentEntry = {
      id: `ENR${Date.now()}`,
      program: newEnrollment.value.program,
      enrollmentDate: newEnrollment.value.enrollmentDate,
      status: 'active',
      orgUnit: newEnrollment.value.orgUnit,
      notes: newEnrollment.value.notes
    };
    
    // Update the selected entity
    if (selectedEntity.value.enrollments) {
      selectedEntity.value.enrollments.push(newEnrollmentEntry);
    } else {
      selectedEntity.value.enrollments = [newEnrollmentEntry];
    }
    
    // Update in allEntities
    const entityIndex = allEntities.value.findIndex(e => e.id === selectedEntity.value.id);
    if (entityIndex !== -1) {
      allEntities.value[entityIndex] = {...selectedEntity.value};
    }
    
    // Log enrollment (in real app, save to Firebase)
    console.log('Enrollment created:', enrollmentData);
    
    showToast(`Successfully enrolled in ${newEnrollment.value.program}`, 'success');
    showNewEnrollmentModal.value = false;
    
    // Switch to enrollment tab to show the new enrollment
    activeTab.value = 'enrollment';
    
  } catch (error) {
    console.error('Error creating enrollment:', error);
    showToast('Error creating enrollment', 'error');
  } finally {
    loading.value = false;
  }
};

const viewEnrollment = (enrollment) => {
  selectedEnrollment.value = enrollment;
  showEnrollmentModal.value = true;
};

const calculateDaysEnrolled = (enrollmentDate) => {
  if (!enrollmentDate) return 0;
  const start = new Date(enrollmentDate);
  const now = new Date();
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const viewAllEvents = () => {
  showEnrollmentModal.value = false;
  activeTab.value = 'events';
  showToast('Switched to Events tab', 'info');
};

const completeEnrollment = () => {
  if (confirm('Mark this enrollment as completed?')) {
    selectedEnrollment.value.status = 'completed';
    showToast('Enrollment marked as completed', 'success');
    showEnrollmentModal.value = false;
  }
};

const cancelEnrollment = () => {
  if (confirm('Are you sure you want to cancel this enrollment?')) {
    selectedEnrollment.value.status = 'cancelled';
    showToast('Enrollment cancelled', 'success');
    showEnrollmentModal.value = false;
  }
};

const scheduleEvent = () => {
  console.log("Schedule event");
  showToast('Schedule event functionality coming soon', 'info');
};

const getDataSetId = (formName) => {
  const map = {
    'Child Overview': 'child-overview',
    'Medical Intake': 'medical-intake',
    'Academics & Literacy': 'academics-literacy',
    'Care Plan Summary': 'care-plan-summary',
    'Regular Follow-up': 'regular-follow-up',
    'Initial Referral': 'initial-referral',
    'Initial Assessment': 'initial-assessment',
    'Psychological Assessment': 'psychological-assessment',
    'Life Skills Survey': 'life-skills-survey',
    'Birth & Delivery Report': 'birth-delivery-report'
  };
  return map[formName] || formName.toLowerCase().replace(/ /g, '-');
};

const enterData = (event) => {
  console.log("Enter data for event:", event);
  
  // Navigate to Capture page with the child case ID and form type
  if (selectedEntity.value) {
    const formType = event.formType || event.stage;
    const dataSetId = getDataSetId(formType);
    
    router.push({
      path: '/capture',
      query: {
        caseId: selectedEntity.value.id,
        preset: dataSetId,
        childId: selectedEntity.value.childId,
        childName: `${selectedEntity.value.firstName} ${selectedEntity.value.lastName}`
      }
    });
  } else {
    showToast('No child selected', 'error');
  }
};

const viewEventDetails = (event) => {
  console.log("View event details:", event);
  showToast('View event details functionality coming soon', 'info');
};

const openForm = (formType) => {
  if (!selectedEntity.value) {
    showToast('Please select a child first', 'error');
    return;
  }
  
  const dataSetId = getDataSetId(formType);
  
  router.push({
    path: '/capture',
    query: {
      caseId: selectedEntity.value.id,
      preset: dataSetId,
      childId: selectedEntity.value.childId,
      childName: `${selectedEntity.value.firstName} ${selectedEntity.value.lastName}`
    }
  });
  
  showToast(`Opening ${formType} form...`, 'info');
};

const saveNote = () => {
  if (!newNote.value.trim()) return;
  
  selectedEntity.value.notes.unshift({
    id: `N${Date.now()}`,
    text: newNote.value,
    createdBy: "Current User",
    createdDate: new Date().toISOString()
  });
  
  newNote.value = "";
  showAddNote.value = false;
  showToast('Note added successfully', 'success');
};

// Debounced search watcher
let searchTimeout;
watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    appliedSearchQuery.value = newVal;
    currentPage.value = 1;
  }, 300);
});

// Load data on mount
onMounted(async () => {
  await loadCases();
});
</script>

<style scoped>
.tracker-capture-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.tracker-sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.tracker-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #2c6693; /* DHIS2 Blue */
  margin: 0;
  white-space: nowrap;
}

.program-badge {
  padding: 0.25rem 0.75rem;
  background: #E0F2F1;
  color: #00695C;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #B2DFDB;
}

.search-org-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.program-select-container {
  flex: 1;
  max-width: 300px;
}

.program-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #374151;
}

.register-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-button:hover {
  background-color: #059669;
}

.tracker-main {
  display: grid;
  grid-template-columns: 280px 1fr;
  flex: 1;
  height: calc(100vh - 100px);
  overflow: hidden;
  background: #F4F6F8;
}

/* Organisation Unit Sidebar */
.org-unit-sidebar {
  background: white;
  border-right: 1px solid #D5D5D5;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 10px 12px;
  background: #F3F5F7;
  border-bottom: 1px solid #D5D5D5;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #494949;
  text-transform: uppercase;
}

.org-tree {
  padding: 8px;
}

.org-unit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 2px;
  cursor: pointer;
  color: #333;
  margin-bottom: 2px;
  font-size: 14px;
  border: 1px solid transparent;
}

.org-unit-item:hover {
  background: #E8F4F8;
}

.org-unit-item.active {
  background: #FF9800; /* DHIS2 Orange */
  color: white;
}

.org-unit-item i {
  width: 16px;
  color: #6b7280;
}

.org-unit-item.active i {
  color: #1e40af;
}

/* Entities Panel */
.entities-panel {
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-section {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.search-bar {
  position: relative;
  margin-bottom: 0.75rem;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-bar input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.8125rem;
}

.entities-list {
  flex: 1;
  overflow-y: auto;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1.2fr 0.5fr 0.6fr 1fr 100px;
  gap: 0;
  padding: 0;
  background: #F3F5F7;
  border-bottom: 1px solid #D5D5D5;
  position: sticky;
  top: 0;
  z-index: 5;
}

.list-header span {
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 700;
  color: #4A5768;
  text-transform: uppercase;
  border-right: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
}

.entity-item {
  display: grid;
  grid-template-columns: 2fr 1.2fr 0.5fr 0.6fr 1fr 100px;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid #EEE;
  cursor: pointer;
  transition: background 0.1s;
  font-size: 13px;
  align-items: stretch;
  background: white;
}

.entity-item:nth-child(even) {
  background: #FBFBFB; /* Zebra striping */
}

.entity-item:hover {
  background: #E3F2FD; /* Highlight row */
}

.entity-item.selected {
  background: #FFF8E1;
  border-left: 3px solid #ff9800;
}

.entity-name {
  font-weight: 500;
  color: #1D5288;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.entity-name i {
  color: #6b7280;
}

.view-btn {
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  background: #3b82f6;
  color: white;
}

.no-results {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-controls button {
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-controls button:hover:not(:disabled) {
  background: #e5e7eb;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Dashboard Panel */
.dashboard-panel {
  background: white;
  overflow-y: auto;
}

.no-selection {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #9ca3af;
}

.no-selection i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-selection h3 {
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.dashboard-top-bar {
  padding: 0.5rem 1rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.back-btn:hover {
  background: #f3f4f6;
  color:#111827;
}

.entity-dashboard {
  height: calc(100% - 50px); /* Adjust for top bar */
  display: flex;
  flex-direction: column;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: white; /* DHIS2 style is often white with blue accents, or simple gray */
  color: #111827;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #2c6693; /* DHIS2 Blue */
  color: white;
  border: 3px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  color: #111827;
}

.profile-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9375rem;
  color: #4b5563;
}

.profile-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.action-btn.danger {
  color: #ef4444;
  border-color: #fca5a5;
}

.action-btn.danger:hover {
  background: #fee2e2;
  border-color: #ef4444;
}

.dashboard-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 2rem;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9375rem;
}

.tab-button:hover {
  color: #111827;
  background: #f9fafb;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.attribute-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attribute-item label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.attribute-item span {
  font-size: 0.9375rem;
  color: #111827;
}

.no-attributes {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.no-attributes i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-attributes p {
  margin: 0;
  font-size: 0.9375rem;
}

.enrollment-header,
.events-header,
.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.enrollment-header h3,
.events-header h3,
.notes-header h3 {
  margin: 0;
  color: #111827;
}

.enroll-btn,
.schedule-btn,
.add-note-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.scheduled {
  background: #fef3c7;
  color: #92400e;
}

.events-timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 0.5rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
}

.timeline-marker.completed {
  background: #10b981;
  border-color: #10b981;
}

.timeline-marker.scheduled {
  background: #f59e0b;
  border-color: #f59e0b;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -1.5rem;
  top: 1.5rem;
  bottom: -2rem;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item:last-child::before {
  display: none;
}

.event-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.event-header h4 {
  margin: 0;
  color: #111827;
}

.event-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.event-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.event-org {
  font-size: 0.875rem;
  color: #6b7280;
}

.event-actions {
  display: flex;
  gap: 0.75rem;
}

.data-entry-btn,
.view-enrollment-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.data-entry-btn {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.data-entry-btn:hover {
  background: #2563eb;
}

.view-enrollment-btn:hover {
  background: #f3f4f6;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.indicator-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.indicator-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.indicator-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.indicator-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.add-note-form {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.add-note-form textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 0.75rem;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.save-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.save-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.cancel-btn {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.note-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.note-header strong {
  color: #111827;
}

.note-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.note-item p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}

/* Modal */
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
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9375rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-button,
.save-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-button {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.save-button {
  background: #10b981;
  border: none;
  color: white;
}

.save-button:hover {
  background: #059669;
}

/* Enrollment Modal Styles */
.enrollment-modal {
  max-width: 800px;
}

.enrollment-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.detail-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 600;
}

.detail-section h4 i {
  color: #3b82f6;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item span {
  font-size: 0.9375rem;
  color: #111827;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.progress-bar-container {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8125rem;
  color: #111827;
  font-weight: 600;
}

.recent-events {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.event-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.event-icon.completed {
  background: #d1fae5;
  color: #10b981;
}

.event-icon.scheduled {
  background: #fef3c7;
  color: #f59e0b;
}

.event-icon.draft {
  background: #e5e7eb;
  color: #6b7280;
}

.event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-info strong {
  font-size: 0.9375rem;
  color: #111827;
}

.event-info span {
  font-size: 0.8125rem;
  color: #6b7280;
}

.status-badge.small {
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
}

.no-events {
  text-align: center;
  padding: 2rem 1rem;
  color: #9ca3af;
}

.no-events i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.no-events p {
  margin: 0;
  font-size: 0.875rem;
}

.enrollment-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.action-button.primary {
  background: #3b82f6;
  color: white;
}

.action-button.primary:hover {
  background: #2563eb;
}

.action-button.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-button.secondary:hover {
  background: #e5e7eb;
}

.action-button.success {
  background: #10b981;
  color: white;
}

.action-button.success:hover {
  background: #059669;
}

.action-button.danger {
  background: #ef4444;
  color: white;
}

.action-button.danger:hover {
  background: #dc2626;
}

/* Enrollment Form Styles */
.enrollment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 1.5rem;
  color: white;
}

.info-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.entity-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.entity-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.entity-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.entity-info strong {
  font-size: 1.25rem;
  font-weight: 600;
}

.entity-info span {
  font-size: 0.875rem;
  opacity: 0.9;
}

.form-select,
.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-family: inherit;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
}

.save-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.save-button:disabled:hover {
  background: #9ca3af;
}

.save-button i {
  margin-right: 0.5rem;
}

/* Enrollment Card & Stage Tracking Styles */
.enrollment-card {
  background: white;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.enrollment-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.enrollment-info h4 {
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.enrollment-info p {
  margin: 0 0 0.75rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.completed {
  background: #dbeafe;
  color: #1e40af;
}

.current-stage-section {
  padding: 1.5rem;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stage-header h5 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
}

.stage-header h5 i {
  color: #3b82f6;
}

.stage-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 16px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: capitalize;
}

.stage-badge.stage-referral {
  background: #fef3c7;
  color: #92400e;
}

.stage-badge.stage-assessment {
  background: #dbeafe;
  color: #1e40af;
}

.stage-badge.stage-enrollment {
  background: #e0e7ff;
  color: #4338ca;
}

.stage-badge.stage-care-plan {
  background: #d1fae5;
  color: #065f46;
}

.stage-badge.stage-follow-up {
  background: #fce7f3;
  color: #9f1239;
}

.stages-timeline {
  position: relative;
  padding-left: 1.5rem;
}

.stages-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  background: #e5e7eb;
}

.stage-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  position: relative;
}

.stage-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: white;
  border: 2px solid #e5e7eb;
  z-index: 1;
  position: relative;
  left: -1.5rem;
}

.stage-step.completed .stage-marker {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.stage-step.current .stage-marker {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.stage-step.pending .stage-marker {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #9ca3af;
}

.stage-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stage-content strong {
  font-size: 0.9375rem;
  color: #111827;
}

.stage-step.pending .stage-content strong {
  color: #9ca3af;
}

.stage-forms {
  font-size: 0.8125rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.stage-step.completed .stage-forms {
  background: #d1fae5;
  color: #065f46;
}

.stage-step.current .stage-forms {
  background: #dbeafe;
  color: #1e40af;
}

.completed-forms {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
}

.completed-forms h6 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.completed-forms h6 i {
  color: #10b981;
}

.forms-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.form-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 0.8125rem;
  color: #374151;
  transition: all 0.2s;
}

.form-chip i {
  color: #10b981;
  font-size: 0.75rem;
}

.form-chip.completed {
  border-color: #10b981;
  background: #ecfdf5;
}

.form-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-forms {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  color: #9ca3af;
  font-size: 0.875rem;
}

.no-forms i {
  color: #d1d5db;
}

/* Quick Forms Section */
.quick-forms-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
}

.quick-forms-section h4 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.quick-forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.quick-form-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-form-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.quick-form-card i {
  font-size: 2rem;
  opacity: 0.9;
}

.quick-form-card span {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;
}

.timeline-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
}

.timeline-title i {
  color: #3b82f6;
}

.view-details-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

@media (max-width: 1024px) {
  .tracker-main {
    grid-template-columns: 200px 350px 1fr;
  }
}

@media (max-width: 768px) {
  .tracker-main {
    display: flex;
    flex-direction: column;
    height: auto;
    overflow-y: auto;
  }

  .org-unit-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .entities-panel {
    width: 100%;
    height: auto;
    min-height: 500px;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .dashboard-panel {
    width: 100%;
    height: auto;
    min-height: 500px;
    overflow: visible;
  }

  /* Header adjustments */
  .tracker-sub-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .header-right {
    width: 100%;
  }

  .register-button {
    width: 100%;
    justify-content: center;
  }

  /* Filters */
  .search-section {
    padding: 1rem;
  }
  
  .filters {
    flex-direction: column;
    margin-top: 0.5rem;
  }

  /* List View to Cards */
  .list-header {
    display: none;
  }

  .entity-item {
    display: grid;
    grid-template-areas: 
      "name name"
      "id age"
      "gender date"
      "action action";
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    height: auto;
  }

  .entity-item > span:nth-child(1) { 
    grid-area: name; 
    font-size: 1.125rem;
    color: #111827;
  }

  .entity-item > span:nth-child(2) { 
    grid-area: id; 
    font-size: 0.875rem;
  }
  .entity-item > span:nth-child(2)::before { content: 'ID: '; color: #6b7280; font-weight: 500; }

  .entity-item > span:nth-child(3) { 
    grid-area: age; 
    font-size: 0.875rem;
  }
  .entity-item > span:nth-child(3)::before { content: 'Age: '; color: #6b7280; font-weight: 500; }

  .entity-item > span:nth-child(4) { 
    grid-area: gender; 
    font-size: 0.875rem;
  }
  .entity-item > span:nth-child(4)::before { content: 'Sex: '; color: #6b7280; font-weight: 500; }

  .entity-item > span:nth-child(5) { 
    grid-area: date; 
    font-size: 0.875rem;
  }
  .entity-item > span:nth-child(5)::before { content: 'Enrolled: '; color: #6b7280; font-weight: 500; }

  .entity-item > span:nth-child(6) { 
    grid-area: action; 
    justify-self: end;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
    border-top: 1px solid #f3f4f6;
    padding-top: 0.75rem;
  }

  /* Dashboard Tabs */
  .dashboard-tabs {
    overflow-x: auto;
    padding: 0 1rem;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .tab-button {
    padding: 1rem;
  }

  /* Dashboard Header */
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
  }

  .profile-meta {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .profile-actions {
    margin-top: 1rem;
  }

  /* Tab Contents */
  .attributes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  /* Detail Modals */
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .enrollment-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  /* Modals */
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .form-row {
     grid-template-columns: 1fr;
  }

  .quick-forms-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .enrollment-main {
    flex-direction: column;
    gap: 1rem;
  }

  .stage-step {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .stage-marker {
    left: 0;
    margin-bottom: 0.5rem;
  }

  .stages-timeline {
    padding-left: 0;
  }

  .stages-timeline::before {
    left: 15px;
  }
}

@media (max-width: 480px) {
  .quick-forms-grid {
    grid-template-columns: 1fr;
  }

}
</style>
