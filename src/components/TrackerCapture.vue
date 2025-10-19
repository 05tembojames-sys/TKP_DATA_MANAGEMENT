<template>
  <div class="tracker-capture-container">
    <!-- Header -->
    <div class="tracker-header">
      <div class="header-left">
        <button @click="goBack" class="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <div class="header-center">
        <h1 class="tracker-title">Tracker Capture - Child Cases</h1>
        <div class="data-source-indicator">
          <span class="indicator-badge firebase">📡 Live Firebase Data</span>
        </div>
      </div>
      <div class="header-right">
        <button @click="showNewEnrollmentModal = true" class="new-enrollment-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14" />
            <path d="m5 12 14 0" />
          </svg>
          New Enrollment
        </button>
        <button @click="handleLogout" class="logout-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="tracker-content">
      <!-- Search and Filter Panel -->
      <div class="search-panel">
        <div class="search-controls">
          <div class="search-input-group">
            <label class="search-label">Search Cases</label>
            <div class="search-input-container">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                @input="performSearch"
                placeholder="Search by name, ID, or case number..."
                class="search-input"
              />
              <button v-if="searchQuery" @click="clearSearch" class="clear-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m18 6-12 12" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-item">
              <label class="filter-label">Status</label>
              <select v-model="selectedStatus" @change="applyFilters" class="filter-select">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>

            <div class="filter-item">
              <label class="filter-label">Age Group</label>
              <select v-model="selectedAgeGroup" @change="applyFilters" class="filter-select">
                <option value="">All Ages</option>
                <option value="0-5">0-5 years</option>
                <option value="6-12">6-12 years</option>
                <option value="13-17">13-17 years</option>
                <option value="18+">18+ years</option>
              </select>
            </div>

            <div class="filter-item">
              <label class="filter-label">Program Stage</label>
              <select v-model="selectedStage" @change="applyFilters" class="filter-select">
                <option value="">All Stages</option>
                <option value="referral">Referral</option>
                <option value="assessment">Assessment</option>
                <option value="enrollment">Enrollment</option>
                <option value="care-plan">Care Plan</option>
                <option value="follow-up">Follow-up</option>
              </select>
            </div>
          </div>

          <div class="search-actions">
            <button @click="performSearch" class="search-button">
              Search
            </button>
            <button @click="resetFilters" class="reset-button">
              Reset
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats">
          <div class="stat-card">
            <div class="stat-number">{{ totalCases }}</div>
            <div class="stat-label">Total Cases</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ activeCases }}</div>
            <div class="stat-label">Active Cases</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ completedCases }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ newThisMonth }}</div>
            <div class="stat-label">New This Month</div>
          </div>
        </div>
      </div>

      <!-- Cases List or Selected Case View -->
      <div class="tracker-main">
        <!-- Cases List View -->
        <div v-if="!selectedCase" class="cases-list-view">
          <div class="list-header">
            <h3>Tracked Cases ({{ filteredCases.length }})</h3>
            <div class="list-controls">
              <button @click="viewMode = 'table'" :class="{ active: viewMode === 'table' }" class="view-toggle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Table
              </button>
              <button @click="viewMode = 'cards'" :class="{ active: viewMode === 'cards' }" class="view-toggle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="4" />
                  <rect x="3" y="9" width="18" height="4" />
                  <rect x="3" y="15" width="18" height="4" />
                </svg>
                Cards
              </button>
            </div>
          </div>

          <!-- Table View -->
          <div v-if="viewMode === 'table'" class="cases-table-container">
            <table class="cases-table">
              <thead>
                <tr>
                  <th @click="sortBy('childName')" class="sortable">
                    Child Name
                    <svg class="sort-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 10l5-5 5 5" />
                      <path d="M7 14l5 5 5-5" />
                    </svg>
                  </th>
                  <th @click="sortBy('caseId')" class="sortable">Case ID</th>
                  <th @click="sortBy('age')" class="sortable">Age</th>
                  <th @click="sortBy('status')" class="sortable">Status</th>
                  <th @click="sortBy('currentStage')" class="sortable">Current Stage</th>
                  <th @click="sortBy('lastActivity')" class="sortable">Last Activity</th>
                  <th @click="sortBy('assignedWorker')" class="sortable">Assigned Worker</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="case_ in paginatedCases" 
                  :key="case_.id" 
                  @click="selectCase(case_)"
                  class="case-row"
                >
                  <td class="child-name-cell">
                    <div class="child-info">
                      <div class="child-name">{{ case_.childName }}</div>
                      <div class="child-id">ID: {{ case_.childId }}</div>
                    </div>
                  </td>
                  <td>{{ case_.caseId }}</td>
                  <td>{{ case_.age }} years</td>
                  <td>
                    <span class="status-badge" :class="case_.status">
                      {{ formatStatus(case_.status) }}
                    </span>
                  </td>
                  <td>{{ case_.currentStage }}</td>
                  <td>{{ formatDate(case_.lastActivity) }}</td>
                  <td>{{ case_.assignedWorker }}</td>
                  <td class="actions-cell">
                    <button @click.stop="selectCase(case_)" class="action-button view-button">
                      View
                    </button>
                    <button @click.stop="editCase(case_)" class="action-button edit-button">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="pagination" v-if="totalPages > 1">
              <button 
                @click="currentPage = 1" 
                :disabled="currentPage === 1"
                class="pagination-button"
              >
                First
              </button>
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="pagination-button"
              >
                Previous
              </button>
              <span class="pagination-info">
                Page {{ currentPage }} of {{ totalPages }} ({{ filteredCases.length }} cases)
              </span>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="pagination-button"
              >
                Next
              </button>
              <button 
                @click="currentPage = totalPages" 
                :disabled="currentPage === totalPages"
                class="pagination-button"
              >
                Last
              </button>
            </div>
          </div>

          <!-- Cards View -->
          <div v-if="viewMode === 'cards'" class="cases-cards-container">
            <div class="cases-cards-grid">
              <div 
                v-for="case_ in paginatedCases" 
                :key="case_.id" 
                @click="selectCase(case_)"
                class="case-card"
              >
                <div class="card-header">
                  <div class="child-info">
                    <h4 class="child-name">{{ case_.childName }}</h4>
                    <div class="child-details">
                      <span class="child-age">{{ case_.age }} years old</span>
                      <span class="case-id">Case ID: {{ case_.caseId }}</span>
                    </div>
                  </div>
                  <span class="status-badge" :class="case_.status">
                    {{ formatStatus(case_.status) }}
                  </span>
                </div>
                <div class="card-content">
                  <div class="stage-info">
                    <strong>Current Stage:</strong> {{ case_.currentStage }}
                  </div>
                  <div class="worker-info">
                    <strong>Assigned Worker:</strong> {{ case_.assignedWorker }}
                  </div>
                  <div class="activity-info">
                    <strong>Last Activity:</strong> {{ formatDate(case_.lastActivity) }}
                  </div>
                </div>
                <div class="card-footer">
                  <button @click.stop="selectCase(case_)" class="card-action-button primary">
                    View Case
                  </button>
                  <button @click.stop="editCase(case_)" class="card-action-button secondary">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <!-- Pagination for Cards -->
            <div class="pagination" v-if="totalPages > 1">
              <button 
                @click="currentPage = 1" 
                :disabled="currentPage === 1"
                class="pagination-button"
              >
                First
              </button>
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="pagination-button"
              >
                Previous
              </button>
              <span class="pagination-info">
                Page {{ currentPage }} of {{ totalPages }} ({{ filteredCases.length }} cases)
              </span>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="pagination-button"
              >
                Next
              </button>
              <button 
                @click="currentPage = totalPages" 
                :disabled="currentPage === totalPages"
                class="pagination-button"
              >
                Last
              </button>
            </div>
          </div>

          <!-- No Cases Message -->
          <div v-if="filteredCases.length === 0" class="no-cases-message">
            <div class="no-cases-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="m22 21-3-3m0-6a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
              </svg>
              <h3>No Cases Found</h3>
              <p>{{ searchQuery ? 'No cases match your search criteria.' : 'No cases have been enrolled yet.' }}</p>
              <button @click="showNewEnrollmentModal = true" class="primary-button">
                Enroll New Case
              </button>
            </div>
          </div>
        </div>

        <!-- Selected Case Detail View -->
        <div v-if="selectedCase" class="case-detail-view">
          <div class="case-detail-header">
            <div class="case-info">
              <button @click="selectedCase = null" class="back-to-list-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m12 19-7-7 7-7" />
                  <path d="m19 12H5" />
                </svg>
                Back to Cases List
              </button>
              <h2>{{ selectedCase.childName }}</h2>
              <div class="case-meta">
                <span class="case-id">Case ID: {{ selectedCase.caseId }}</span>
                <span class="status-badge" :class="selectedCase.status">
                  {{ formatStatus(selectedCase.status) }}
                </span>
              </div>
            </div>
            <div class="case-actions">
              <button @click="addEvent" class="add-event-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14" />
                  <path d="m5 12 14 0" />
                </svg>
                Add Event
              </button>
              <button @click="editCase(selectedCase)" class="edit-case-button">
                Edit Case
              </button>
            </div>
          </div>

          <!-- Case Timeline and Forms -->
          <div class="case-detail-content">
            <div class="case-summary-panel">
              <div class="summary-cards">
                <div class="summary-card">
                  <div class="card-title">Basic Information</div>
                  <div class="card-content">
                    <div class="info-item">
                      <strong>Age:</strong> {{ selectedCase.age }} years
                    </div>
                    <div class="info-item">
                      <strong>Gender:</strong> {{ selectedCase.gender }}
                    </div>
                    <div class="info-item">
                      <strong>Date of Birth:</strong> {{ formatDate(selectedCase.dateOfBirth) }}
                    </div>
                    <div class="info-item">
                      <strong>Enrollment Date:</strong> {{ formatDate(selectedCase.enrollmentDate) }}
                    </div>
                  </div>
                </div>
                <div class="summary-card">
                  <div class="card-title">Case Management</div>
                  <div class="card-content">
                    <div class="info-item">
                      <strong>Current Stage:</strong> {{ selectedCase.currentStage }}
                    </div>
                    <div class="info-item">
                      <strong>Assigned Worker:</strong> {{ selectedCase.assignedWorker }}
                    </div>
                    <div class="info-item">
                      <strong>Last Activity:</strong> {{ formatDate(selectedCase.lastActivity) }}
                    </div>
                    <div class="info-item">
                      <strong>Total Events:</strong> {{ selectedCase.events.length }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Program Stages and Events -->
            <div class="program-stages">
              <h3>Program Timeline</h3>
              <div class="timeline">
                <div 
                  v-for="(stage, index) in programStages" 
                  :key="stage.id"
                  class="timeline-stage"
                  :class="{ 
                    completed: stage.completed, 
                    active: stage.active,
                    upcoming: !stage.completed && !stage.active
                  }"
                >
                  <div class="stage-indicator">
                    <div class="stage-number">{{ index + 1 }}</div>
                  </div>
                  <div class="stage-content">
                    <h4 class="stage-title">{{ stage.name }}</h4>
                    <div class="stage-description">{{ stage.description }}</div>
                    <div class="stage-events">
                      <div 
                        v-for="event in getStageEvents(stage.id)" 
                        :key="event.id"
                        class="event-item"
                        @click="viewEvent(event)"
                      >
                        <div class="event-info">
                          <div class="event-title">{{ event.formType }}</div>
                          <div class="event-date">{{ formatDate(event.date) }}</div>
                        </div>
                        <div class="event-status">
                          <span class="status-badge" :class="event.status">
                            {{ formatStatus(event.status) }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      v-if="stage.active || stage.completed"
                      @click="addStageEvent(stage)"
                      class="add-stage-event-button"
                    >
                      Add {{ stage.name }} Event
                    </button>
                  </div>
                </div>
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
          <h3>Enroll New Case</h3>
          <button @click="showNewEnrollmentModal = false" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createNewEnrollment">
            <div class="form-row">
              <div class="form-group">
                <label>Child First Name *</label>
                <input v-model="newEnrollment.childFirstName" type="text" required />
              </div>
              <div class="form-group">
                <label>Child Last Name *</label>
                <input v-model="newEnrollment.childLastName" type="text" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Date of Birth *</label>
                <input v-model="newEnrollment.dateOfBirth" type="date" required />
              </div>
              <div class="form-group">
                <label>Gender *</label>
                <select v-model="newEnrollment.gender" required>
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Enrollment Program *</label>
              <select v-model="newEnrollment.program" required>
                <option value="">Select Program</option>
                <option value="child-protection">Child Protection Program</option>
                <option value="pregnancy-support">Pregnancy Support Program</option>
                <option value="family-support">Family Support Program</option>
              </select>
            </div>
            <div class="form-group">
              <label>Initial Form Type *</label>
              <select v-model="newEnrollment.initialFormType" required>
                <option value="">Select Initial Form</option>
                <option value="initial-referral">Initial Referral Form</option>
                <option value="initial-assessment">Initial Assessment Form</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" @click="showNewEnrollmentModal = false" class="cancel-button">
                Cancel
              </button>
              <button type="submit" class="create-button" :disabled="enrollmentLoading">
                {{ enrollmentLoading ? 'Creating...' : 'Create & Start Form' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import FormService from '../services/formService.js'
import TrackerService from '../services/trackerService.js'
import AuthService from '../services/auth.js'

const router = useRouter()

// Reactive data
const loading = ref(false)
const loadingMessage = ref('')
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedAgeGroup = ref('')
const selectedStage = ref('')
const viewMode = ref('table')
const currentPage = ref(1)
const pageSize = ref(10)
const sortField = ref('lastActivity')
const sortOrder = ref('desc')

// Cases data
const allCases = ref([])
const selectedCase = ref(null)
const showNewEnrollmentModal = ref(false)
const enrollmentLoading = ref(false)

// New enrollment form
const newEnrollment = ref({
  childFirstName: '',
  childLastName: '',
  dateOfBirth: '',
  gender: '',
  program: '',
  initialFormType: ''
})

// Program stages
const programStages = ref([
  {
    id: 'referral',
    name: 'Initial Referral',
    description: 'Child referred to the program',
    completed: true,
    active: false
  },
  {
    id: 'assessment',
    name: 'Initial Assessment',
    description: 'Comprehensive assessment of child needs',
    completed: true,
    active: false
  },
  {
    id: 'enrollment',
    name: 'Program Enrollment',
    description: 'Child enrolled in program services',
    completed: false,
    active: true
  },
  {
    id: 'care-plan',
    name: 'Care Plan Development',
    description: 'Individual care plan created',
    completed: false,
    active: false
  },
  {
    id: 'follow-up',
    name: 'Regular Follow-up',
    description: 'Ongoing monitoring and support',
    completed: false,
    active: false
  }
])

// Computed properties
const filteredCases = computed(() => {
  let filtered = allCases.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(case_ => 
      case_.childName.toLowerCase().includes(query) ||
      case_.caseId.toLowerCase().includes(query) ||
      case_.childId.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(case_ => case_.status === selectedStatus.value)
  }

  // Age group filter
  if (selectedAgeGroup.value) {
    filtered = filtered.filter(case_ => {
      const age = case_.age
      switch (selectedAgeGroup.value) {
        case '0-5': return age <= 5
        case '6-12': return age >= 6 && age <= 12
        case '13-17': return age >= 13 && age <= 17
        case '18+': return age >= 18
        default: return true
      }
    })
  }

  // Stage filter
  if (selectedStage.value) {
    filtered = filtered.filter(case_ => 
      case_.currentStage.toLowerCase().includes(selectedStage.value)
    )
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]
    
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const paginatedCases = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCases.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredCases.value.length / pageSize.value)
)

const totalCases = computed(() => allCases.value.length)
const activeCases = computed(() => allCases.value.filter(c => c.status === 'active').length)
const completedCases = computed(() => allCases.value.filter(c => c.status === 'completed').length)
const newThisMonth = computed(() => {
  const thisMonth = new Date()
  thisMonth.setDate(1)
  return allCases.value.filter(c => new Date(c.enrollmentDate) >= thisMonth).length
})

// Methods
const goBack = () => {
  router.push('/dashboard')
}

const handleLogout = async () => {
  const result = await AuthService.logout()
  if (result.success) {
    router.push('/login')
  }
}

const performSearch = () => {
  currentPage.value = 1
  // Search is reactive through computed property
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedAgeGroup.value = ''
  selectedStage.value = ''
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const selectCase = (case_) => {
  selectedCase.value = case_
  loadCaseDetails(case_.id)
}

const editCase = (case_) => {
  // Navigate to appropriate form based on case stage
  const formRoute = getFormRouteForCase(case_)
  router.push(formRoute)
}

const addEvent = () => {
  if (!selectedCase.value) return
  
  // Show modal to select event type or navigate to form
  const formType = prompt('Select form type: initial-referral, child-overview, initial-assessment')
  if (formType) {
    router.push(`/capture?preset=${formType}&caseId=${selectedCase.value.id}`)
  }
}

const addStageEvent = (stage) => {
  const formType = getFormTypeForStage(stage.id)
  router.push(`/capture?preset=${formType}&caseId=${selectedCase.value.id}&stage=${stage.id}`)
}

const viewEvent = (event) => {
  // Navigate to view the specific form/event
  router.push(`/capture?view=${event.id}`)
}

const getStageEvents = (stageId) => {
  if (!selectedCase.value) return []
  return selectedCase.value.events.filter(event => event.stageId === stageId)
}

const createNewEnrollment = async () => {
  enrollmentLoading.value = true
  
  try {
    const enrollment = await TrackerService.createEnrollment({
      ...newEnrollment.value,
      enrollmentDate: new Date().toISOString(),
      status: 'active',
      currentStage: 'referral'
    })
    
    if (enrollment.success) {
      // Navigate to the initial form
      const formRoute = `/capture?preset=${newEnrollment.value.initialFormType}&caseId=${enrollment.caseId}`
      router.push(formRoute)
    } else {
      alert('Failed to create enrollment: ' + enrollment.error)
    }
  } catch (error) {
    console.error('Error creating enrollment:', error)
    alert('Failed to create enrollment')
  } finally {
    enrollmentLoading.value = false
    showNewEnrollmentModal.value = false
    resetEnrollmentForm()
  }
}

const resetEnrollmentForm = () => {
  newEnrollment.value = {
    childFirstName: '',
    childLastName: '',
    dateOfBirth: '',
    gender: '',
    program: '',
    initialFormType: ''
  }
}

const loadCases = async () => {
  loading.value = true
  loadingMessage.value = 'Loading cases from Firebase forms...'
  
  try {
    console.log('TrackerCapture: Loading cases from Firebase...')
    const result = await TrackerService.getAllCases()
    
    console.log('TrackerCapture: Cases loaded:', {
      success: result.success,
      count: result.cases?.length || 0,
      error: result.error
    })
    
    if (result.success) {
      allCases.value = result.cases
      console.log('TrackerCapture: Cases set to reactive value:', allCases.value.length)
    } else {
      console.error('Failed to load cases:', result.error)
      // Show user-friendly error
      alert(`Failed to load cases: ${result.error}`)
    }
  } catch (error) {
    console.error('Error loading cases:', error)
    // Show user-friendly error
    alert(`Error loading cases: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const loadCaseDetails = async (caseId) => {
  loading.value = true
  loadingMessage.value = 'Loading case details...'
  
  try {
    const result = await TrackerService.getCaseDetails(caseId)
    if (result.success) {
      selectedCase.value = { ...selectedCase.value, ...result.details }
      updateProgramStages()
    }
  } catch (error) {
    console.error('Error loading case details:', error)
  } finally {
    loading.value = false
  }
}

const updateProgramStages = () => {
  if (!selectedCase.value) return
  
  // Update program stages based on case progress
  programStages.value.forEach((stage, index) => {
    const hasEvents = selectedCase.value.events.some(event => event.stageId === stage.id)
    stage.completed = hasEvents && selectedCase.value.currentStage !== stage.id
    stage.active = selectedCase.value.currentStage === stage.id
  })
}

const getFormTypeForStage = (stageId) => {
  const stageFormMap = {
    'referral': 'initial-referral',
    'assessment': 'initial-assessment',
    'enrollment': 'child-overview',
    'care-plan': 'child-overview',
    'follow-up': 'child-overview'
  }
  return stageFormMap[stageId] || 'initial-referral'
}

const getFormRouteForCase = (case_) => {
  // Determine which form to edit based on case stage
  const formType = getFormTypeForStage(case_.currentStage)
  return `/capture?preset=${formType}&caseId=${case_.id}&edit=true`
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const formatStatus = (status) => {
  const statusMap = {
    'active': 'Active',
    'completed': 'Completed',
    'pending': 'Pending',
    'transferred': 'Transferred',
    'draft': 'Draft'
  }
  return statusMap[status] || status
}

// Initialize component
onMounted(() => {
  loadCases()
})

// Watch for page changes
watch([selectedStatus, selectedAgeGroup, selectedStage, searchQuery], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.tracker-capture-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.tracker-header {
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-end;
}

.header-center {
  flex: 2;
  text-align: center;
}

.back-button,
.logout-button {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.back-button:hover,
.logout-button:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.logout-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

.logout-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.tracker-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.data-source-indicator {
  margin-top: 0.5rem;
}

.indicator-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: #28a745;
  color: white;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.indicator-badge.firebase {
  background: linear-gradient(45deg, #FF6B35, #F7931E);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.new-enrollment-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-left: auto;
}

.new-enrollment-button:hover {
  background: #0056b3;
}

.tracker-content {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.search-panel {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: end;
  margin-bottom: 1.5rem;
}

.search-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: #6c757d;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.125rem;
}

.clear-search:hover {
  background: #f8f9fa;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  white-space: nowrap;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  background: white;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.search-actions {
  display: flex;
  gap: 0.5rem;
}

.search-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.search-button:hover {
  background: #0056b3;
}

.reset-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background: #5a6268;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.tracker-main {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.list-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.list-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.list-controls {
  display: flex;
  gap: 0.5rem;
}

.view-toggle {
  background: white;
  border: 1px solid #ced4da;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.view-toggle:hover {
  background: #f8f9fa;
}

.view-toggle.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.cases-table-container {
  overflow-x: auto;
}

.cases-table {
  width: 100%;
  border-collapse: collapse;
}

.cases-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
  white-space: nowrap;
}

.cases-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.cases-table th.sortable:hover {
  background: #e9ecef;
}

.sort-icon {
  opacity: 0.5;
  margin-left: 0.5rem;
}

.cases-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: top;
}

.case-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.case-row:hover {
  background: #f8f9fa;
}

.child-name-cell {
  min-width: 200px;
}

.child-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.child-name {
  font-weight: 600;
  color: #2c3e50;
}

.child-id {
  font-size: 0.8rem;
  color: #6c757d;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.completed {
  background: #cce5ff;
  color: #004085;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.transferred {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.draft {
  background: #e2e3e5;
  color: #495057;
}

.actions-cell {
  white-space: nowrap;
}

.action-button {
  background: none;
  border: 1px solid #ced4da;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 0.25rem;
  transition: all 0.2s;
}

.view-button {
  color: #007bff;
  border-color: #007bff;
}

.view-button:hover {
  background: #007bff;
  color: white;
}

.edit-button {
  color: #28a745;
  border-color: #28a745;
}

.edit-button:hover {
  background: #28a745;
  color: white;
}

.cases-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.case-card {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.case-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.child-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.child-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.child-age, .case-id {
  font-size: 0.9rem;
  color: #6c757d;
}

.card-content {
  margin-bottom: 1rem;
}

.card-content > div {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  gap: 0.5rem;
}

.card-action-button {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  transition: all 0.2s;
}

.card-action-button.primary {
  background: #007bff;
  color: white;
}

.card-action-button.primary:hover {
  background: #0056b3;
}

.card-action-button.secondary {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
}

.card-action-button.secondary:hover {
  background: #007bff;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.pagination-button {
  background: white;
  border: 1px solid #ced4da;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background: #f8f9fa;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.no-cases-message {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 3rem;
}

.no-cases-content {
  text-align: center;
  color: #6c757d;
  max-width: 400px;
}

.no-cases-content svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-cases-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #495057;
}

.no-cases-content p {
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
}

.primary-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background: #0056b3;
}

/* Case Detail View Styles */
.case-detail-view {
  padding: 0;
}

.case-detail-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.back-to-list-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.25rem 0;
}

.back-to-list-button:hover {
  text-decoration: underline;
}

.case-detail-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.case-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.case-actions {
  display: flex;
  gap: 0.5rem;
}

.add-event-button, .edit-case-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-event-button:hover, .edit-case-button:hover {
  background: #0056b3;
}

.edit-case-button {
  background: #28a745;
}

.edit-case-button:hover {
  background: #218838;
}

.case-detail-content {
  padding: 1.5rem;
}

.case-summary-panel {
  margin-bottom: 2rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: white;
}

.summary-card .card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-item {
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.info-item strong {
  color: #495057;
  margin-right: 0.5rem;
}

.program-stages h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 1.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-stage {
  position: relative;
  padding-left: 4rem;
  margin-bottom: 2rem;
}

.timeline-stage:last-child {
  margin-bottom: 0;
}

.stage-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 3rem;
  height: 3rem;
  background: white;
  border: 3px solid #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.timeline-stage.completed .stage-indicator {
  border-color: #28a745;
  background: #28a745;
}

.timeline-stage.active .stage-indicator {
  border-color: #007bff;
  background: white;
}

.timeline-stage.upcoming .stage-indicator {
  border-color: #ced4da;
  background: white;
}

.stage-number {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
}

.timeline-stage.completed .stage-number {
  color: white;
}

.timeline-stage.active .stage-number {
  color: #007bff;
}

.stage-content {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.timeline-stage.active .stage-content {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.stage-title {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.stage-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.stage-events {
  margin-bottom: 1rem;
}

.event-item {
  padding: 0.75rem;
  border: 1px solid #f1f3f4;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.event-item:hover {
  background: #f8f9fa;
  border-color: #e9ecef;
}

.event-item:last-child {
  margin-bottom: 0;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-title {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.event-date {
  font-size: 0.8rem;
  color: #6c757d;
}

.add-stage-event-button {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-stage-event-button:hover {
  background: #138496;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 0.5rem 0.5rem 0 0;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.125rem;
}

.close-button:hover {
  background: #e9ecef;
  color: #495057;
}

.modal-body {
  padding: 1.5rem;
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
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.cancel-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background: #5a6268;
}

.create-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.create-button:hover:not(:disabled) {
  background: #0056b3;
}

.create-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  margin: 0;
  color: #495057;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tracker-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .header-left, .header-center, .header-right {
    flex: none;
    width: 100%;
  }

  .header-left {
    order: 1;
  }

  .header-center {
    order: 2;
    text-align: center;
  }

  .header-right {
    order: 3;
    justify-content: center;
    flex-wrap: wrap;
  }

  .back-button,
  .logout-button,
  .new-enrollment-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .tracker-content {
    padding: 1rem;
  }

  .search-controls {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filter-group {
    flex-direction: column;
  }

  .search-actions {
    justify-content: stretch;
  }

  .search-button, .reset-button {
    flex: 1;
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .list-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .cases-table-container {
    font-size: 0.8rem;
  }

  .cases-cards-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .case-detail-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .case-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .tracker-header {
    padding: 0.75rem;
  }

  .tracker-title {
    font-size: 1.25rem;
  }

  .back-button,
  .logout-button,
  .new-enrollment-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    width: 100%;
    justify-content: center;
  }

  .header-right {
    flex-direction: column;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .search-input,
  .filter-select {
    font-size: 0.875rem;
  }
}
</style>