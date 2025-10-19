<template>
  <div class="child-tracker-container">
    <!-- Header -->
    <div class="tracker-header">
      <div class="header-nav">
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
          <h2 class="tracker-title">Child Tracker - In-house/children</h2>
          <p class="tracker-subtitle">Search and track children from TKP Care Plans using unique identification patterns</p>
        </div>
        <div class="header-right">
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
      <div class="tracker-info">
        <span class="info-badge">Primary Source: Child Overview and Background Forms</span>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-header">
        <h3>🔍 Search Child</h3>
        <div class="search-stats">
          <span class="stat-item">
            <strong>{{ totalChildren }}</strong> Children Tracked
          </span>
          <span class="stat-item">
            <strong>{{ activeChildren }}</strong> Active Cases
          </span>
        </div>
      </div>

      <div class="search-form">
        <div class="search-inputs">
          <div class="form-group">
            <label>Search by Child ID</label>
            <input 
              v-model="searchId" 
              type="text" 
              placeholder="e.g., JOHN03252TO001"
              class="search-input"
              @input="searchChildren"
            />
          </div>
          <div class="form-group">
            <label>Search by Name</label>
            <input 
              v-model="searchName" 
              type="text" 
              placeholder="Enter first or last name"
              class="search-input"
              @input="searchChildren"
            />
          </div>
          <div class="form-group">
            <label>Filter by Age Range</label>
            <select v-model="ageFilter" @change="searchChildren" class="search-select">
              <option value="">All Ages</option>
              <option value="0-12">0-12 years</option>
              <option value="13-15">13-15 years</option>
              <option value="16-18">16-18 years</option>
            </select>
          </div>
          <div class="form-group">
            <label>Filter by Location</label>
            <select v-model="locationFilter" @change="searchChildren" class="search-select">
              <option value="">All Locations</option>
              <option value="lusaka">Lusaka</option>
              <option value="chongwe">Chongwe</option>
              <option value="kafue">Kafue</option>
            </select>
          </div>
        </div>
        <div class="search-actions">
          <button @click="clearSearch" class="clear-btn">Clear Search</button>
          <button @click="exportData" class="export-btn" :disabled="filteredChildren.length === 0">
            Export Results
          </button>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="results-section">
      <div class="results-header">
        <h3>Search Results</h3>
        <span class="results-count">{{ filteredChildren.length }} children found</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading children data...</p>
      </div>

      <!-- No Results -->
      <div v-else-if="filteredChildren.length === 0 && !loading" class="no-results">
        <div class="no-results-icon">👥</div>
        <h4>No children found</h4>
        <p v-if="hasSearchCriteria">Try adjusting your search criteria</p>
        <p v-else>No children have been registered yet</p>
      </div>

      <!-- Results List -->
      <div v-else class="children-list">
        <div 
          v-for="child in paginatedChildren" 
          :key="child.id" 
          class="child-card"
          @click="viewChildDetails(child)"
        >
          <div class="child-header">
            <div class="child-id">
              <span class="id-label">ID:</span>
              <span class="id-value">{{ child.uniqueId }}</span>
            </div>
            <div class="child-status" :class="child.status">
              {{ child.status }}
            </div>
          </div>
          
          <div class="child-info">
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">👤 Name:</span>
                <span class="info-value">{{ child.fullName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⚥ Gender:</span>
                <span class="info-value">{{ child.gender }}</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">🎂 Age:</span>
                <span class="info-value">{{ child.age }} years</span>
              </div>
              <div class="info-item">
                <span class="info-label">📍 Location:</span>
                <span class="info-value">{{ child.location }}</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">🏛️ Tribe:</span>
                <span class="info-value">{{ child.tribe || 'Not specified' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">📅 Date Added:</span>
                <span class="info-value">{{ formatDate(child.createdAt) }}</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item full-width">
                <span class="info-label">📋 Form Type:</span>
                <span class="info-value form-type">{{ child.formType }}</span>
              </div>
            </div>
          </div>

          <div class="child-actions">
            <button @click.stop="viewChildDetails(child)" class="action-btn view">
              View Details
            </button>
            <button @click.stop="editChild(child)" class="action-btn edit">
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredChildren.length > pageSize" class="pagination-container">
        <Pagination
          :current-page="currentPage"
          :total-items="filteredChildren.length"
          :page-size="pageSize"
          @page-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- Child Details Modal -->
    <div v-if="selectedChild" class="modal-overlay" @click="closeModal">
      <div class="modal-content child-details-modal" @click.stop>
        <div class="modal-header">
          <h3>Child Details</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="child-details">
            <!-- Basic Information -->
            <div class="details-section">
              <h4>Basic Information</h4>
              <div class="details-grid">
                <div class="detail-item">
                  <label>Unique ID:</label>
                  <span class="unique-id">{{ selectedChild.uniqueId }}</span>
                </div>
                <div class="detail-item">
                  <label>Full Name:</label>
                  <span>{{ selectedChild.fullName }}</span>
                </div>
                <div class="detail-item" v-if="selectedChild.otherName">
                  <label>Other Names:</label>
                  <span>{{ selectedChild.otherName }}</span>
                </div>
                <div class="detail-item" v-if="selectedChild.customId">
                  <label>Custom ID:</label>
                  <span class="custom-id">{{ selectedChild.customId }}</span>
                </div>
                <div class="detail-item">
                  <label>Gender:</label>
                  <span>{{ selectedChild.gender }}</span>
                </div>
                <div class="detail-item">
                  <label>Age at Intake:</label>
                  <span>{{ selectedChild.age }} years</span>
                </div>
                <div class="detail-item">
                  <label>Date of Birth:</label>
                  <span>{{ formatDate(selectedChild.dateOfBirth) }}</span>
                </div>
                <div class="detail-item" v-if="selectedChild.dateOfAdmission">
                  <label>Date of Admission:</label>
                  <span>{{ formatDate(selectedChild.dateOfAdmission) }}</span>
                </div>
                <div class="detail-item">
                  <label>Place of Birth:</label>
                  <span>{{ selectedChild.placeOfBirth }}</span>
                </div>
              </div>
            </div>

            <!-- Location Information -->
            <div class="details-section">
              <h4>Location Information</h4>
              <div class="details-grid">
                <div class="detail-item">
                  <label>Current Location:</label>
                  <span>{{ selectedChild.location }}</span>
                </div>
                <div class="detail-item">
                  <label>District:</label>
                  <span>{{ selectedChild.district }}</span>
                </div>
                <div class="detail-item">
                  <label>Village:</label>
                  <span>{{ selectedChild.village || 'Not specified' }}</span>
                </div>
                <div class="detail-item">
                  <label>Chief:</label>
                  <span>{{ selectedChild.chief || 'Not specified' }}</span>
                </div>
              </div>
            </div>

            <!-- Cultural Information -->
            <div class="details-section">
              <h4>Cultural Information</h4>
              <div class="details-grid">
                <div class="detail-item">
                  <label>Tribe:</label>
                  <span>{{ selectedChild.tribe || 'Not specified' }}</span>
                </div>
                <div class="detail-item">
                  <label>Nationality:</label>
                  <span>{{ selectedChild.nationality }}</span>
                </div>
                <div class="detail-item">
                  <label>Religion:</label>
                  <span>{{ selectedChild.religion || 'Not specified' }}</span>
                </div>
                <div class="detail-item">
                  <label>Denomination:</label>
                  <span>{{ selectedChild.denomination || 'Not specified' }}</span>
                </div>
              </div>
            </div>

            <!-- Case Information -->
            <div class="details-section">
              <h4>Case Information</h4>
              <div class="details-grid">
                <div class="detail-item">
                  <label>Form Type:</label>
                  <span class="form-type">{{ selectedChild.formType }}</span>
                </div>
                <div class="detail-item">
                  <label>Status:</label>
                  <span :class="['status-badge', selectedChild.status]">{{ selectedChild.status }}</span>
                </div>
                <div class="detail-item">
                  <label>Date Added:</label>
                  <span>{{ formatDate(selectedChild.createdAt) }}</span>
                </div>
                <div class="detail-item">
                  <label>Last Updated:</label>
                  <span>{{ formatDate(selectedChild.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="editChild(selectedChild)" class="edit-btn">Edit Child</button>
          <button @click="closeModal" class="cancel-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FormService from '../services/formService.js'
import AuthService from '../services/auth.js'
import Pagination from './Pagination.vue'

const router = useRouter()

// Reactive data
const children = ref([])
const filteredChildren = ref([])
const loading = ref(false)
const selectedChild = ref(null)

// Search and filter
const searchId = ref('')
const searchName = ref('')
const ageFilter = ref('')
const locationFilter = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(12)

// Computed properties
const totalChildren = computed(() => children.value.length)
const activeChildren = computed(() => 
  children.value.filter(child => child.status === 'Active').length
)

const hasSearchCriteria = computed(() => 
  searchId.value || searchName.value || ageFilter.value || locationFilter.value
)

const paginatedChildren = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredChildren.value.slice(start, end)
})

// Methods
const generateUniqueId = (child) => {
  // Use Child Overview form field names
  const firstName = (child.childFirstName || '').toUpperCase()
  const lastName = (child.childSurname || '').toUpperCase()
  const tribe = (child.tribe || '').toUpperCase()
  
  // Generate pattern: FirstName(2) + LastName(2) + LocationCode(03) + Year(2) + Tribe(2) + Sequence(001)
  const firstNamePrefix = firstName.substring(0, 2).padEnd(2, 'X')
  const lastNamePrefix = lastName.substring(0, 2).padEnd(2, 'X')
  const locationCode = '03' // Lusaka code
  const currentYear = new Date().getFullYear().toString().slice(-2)
  const tribePrefix = tribe.substring(0, 2).padEnd(2, 'X')
  const sequence = '001'
  
  return `${firstNamePrefix}${lastNamePrefix}${locationCode}${currentYear}${tribePrefix}${sequence}`
}

const processFormData = (formData, formType) => {
  const uniqueId = generateUniqueId(formData)
  
  return {
    id: formData.id,
    uniqueId,
    // Use specific field names from Child Overview form
    fullName: `${formData.childFirstName || ''} ${formData.childMiddleName || ''} ${formData.childSurname || ''}`.replace(/\s+/g, ' ').trim(),
    otherName: `${formData.otherFirstName || ''} ${formData.otherMiddleName || ''} ${formData.otherSurname || ''}`.replace(/\s+/g, ' ').trim() || null,
    gender: formData.gender || 'Not specified',
    age: formData.ageAtIntake || formData.age || 0,
    dateOfBirth: formData.dateOfBirth,
    dateOfAdmission: formData.dateOfAdmission,
    placeOfBirth: formData.placeOfBirth || 'Not specified',
    location: formData.residentArea || formData.district || 'Not specified',
    district: formData.district || 'Not specified',
    village: formData.village,
    chief: formData.chief,
    tribe: formData.tribe,
    nationality: formData.nationality || 'Not specified',
    religion: formData.religion,
    denomination: formData.denomination,
    customId: formData.id, // The ID field from the form
    formType: getFormTypeName(formType),
    status: determineStatus(formData, formType),
    createdAt: formData.createdAt,
    updatedAt: formData.updatedAt || formData.createdAt,
    rawData: formData
  }
}

const getFormTypeName = (formType) => {
  const names = {
    'initial-referral': 'Initial Child Referral',
    'child-overview': 'Child Overview and Background (TKP Care Plan)',
    'initial-assessment': 'TKP Initial Assessment'
  }
  return names[formType] || 'Unknown Form'
}

const determineStatus = (formData, formType) => {
  // Determine status based on form completion and type
  if (formType === 'child-overview') {
    // More comprehensive form, likely active case
    return 'Active'
  } else if (formType === 'initial-assessment') {
    // Assessment completed, determine based on recommendation
    if (formData.tkpRecommendation === 'ADMIT TO TKP HOUSE') {
      return 'Admitted'
    } else if (formData.tkpRecommendation === 'DO NOT ADMIT') {
      return 'Not Admitted'
    }
    return 'Under Assessment'
  } else {
    // Initial referral
    return 'Referred'
  }
}

const loadChildren = async () => {
  loading.value = true
  try {
    // Load primarily Child Overview forms as they have the most comprehensive data
    const overviewResult = await FormService.getForms('child-overview', 1000)
    
    const allChildren = []
    
    // Process Child Overview forms (primary source)
    if (overviewResult.success) {
      overviewResult.forms.forEach(form => {
        allChildren.push(processFormData(form, 'child-overview'))
      })
    }
    
    // Load other forms as supplementary data
    const [referralResult, assessmentResult] = await Promise.all([
      FormService.getForms('initial-referral', 1000),
      FormService.getForms('initial-assessment', 1000)
    ])
    
    // Only add children from other forms if they don't exist in overview
    if (referralResult.success) {
      referralResult.forms.forEach(form => {
        const childData = processFormData(form, 'initial-referral')
        const exists = allChildren.find(child => 
          child.fullName.toLowerCase() === childData.fullName.toLowerCase() &&
          child.dateOfBirth === childData.dateOfBirth
        )
        if (!exists) {
          allChildren.push(childData)
        }
      })
    }
    
    if (assessmentResult.success) {
      assessmentResult.forms.forEach(form => {
        const childData = processFormData(form, 'initial-assessment')
        const exists = allChildren.find(child => 
          child.fullName.toLowerCase() === childData.fullName.toLowerCase() &&
          child.dateOfBirth === childData.dateOfBirth
        )
        if (!exists) {
          allChildren.push(childData)
        }
      })
    }
    
    children.value = allChildren.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    filteredChildren.value = [...children.value]
    
  } catch (error) {
    console.error('Error loading children:', error)
  } finally {
    loading.value = false
  }
}

const searchChildren = () => {
  let filtered = [...children.value]
  
  // Filter by ID
  if (searchId.value.trim()) {
    const searchTerm = searchId.value.toLowerCase().trim()
    filtered = filtered.filter(child =>
      child.uniqueId.toLowerCase().includes(searchTerm)
    )
  }
  
  // Filter by name
  if (searchName.value.trim()) {
    const searchTerm = searchName.value.toLowerCase().trim()
    filtered = filtered.filter(child =>
      child.fullName.toLowerCase().includes(searchTerm)
    )
  }
  
  // Filter by age range
  if (ageFilter.value) {
    const [minAge, maxAge] = ageFilter.value.split('-').map(Number)
    filtered = filtered.filter(child => {
      const age = parseInt(child.age)
      return age >= minAge && age <= maxAge
    })
  }
  
  // Filter by location
  if (locationFilter.value) {
    const locationTerm = locationFilter.value.toLowerCase()
    filtered = filtered.filter(child =>
      child.location.toLowerCase().includes(locationTerm) ||
      child.district.toLowerCase().includes(locationTerm)
    )
  }
  
  filteredChildren.value = filtered
  currentPage.value = 1 // Reset to first page
}

const clearSearch = () => {
  searchId.value = ''
  searchName.value = ''
  ageFilter.value = ''
  locationFilter.value = ''
  filteredChildren.value = [...children.value]
  currentPage.value = 1
}

const viewChildDetails = (child) => {
  selectedChild.value = child
}

const editChild = (child) => {
  // Emit event to parent to switch to form editing
  // This would typically navigate to the appropriate form
  console.log('Edit child:', child)
  alert(`Edit functionality would navigate to ${child.formType} form for editing`)
}

const closeModal = () => {
  selectedChild.value = null
}

const formatDate = (date) => {
  if (!date) return 'Not specified'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}

const exportData = () => {
  const dataStr = JSON.stringify(filteredChildren.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `child-tracker-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

// Navigation methods
const goBack = () => {
  router.push('/dashboard')
}

const handleLogout = async () => {
  const result = await AuthService.logout()
  if (result.success) {
    router.push('/login')
  }
}

// Lifecycle
onMounted(() => {
  loadChildren()
})
</script>

<style scoped>
.child-tracker-container {
  background: #EEEEEE;
  min-height: 100vh;
  padding: 0;
}

.tracker-header {
  background: linear-gradient(135deg, #4A148C 0%, #2D1B69 100%);
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.3);
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.logout-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.logout-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.tracker-title {
  color: white;
  font-size: 1.75rem;
  margin: 0 0 0.25rem 0;
  font-weight: 700;
}

.tracker-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin: 0;
}

.tracker-info {
  display: flex;
  justify-content: center;
  padding: 1rem 2rem 1.5rem;
}

.info-badge {
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.9), rgba(255, 138, 80, 0.9));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
}

.search-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 2rem 2rem;
  padding: 2rem;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.search-header h3 {
  color: #4A148C;
  font-size: 1.4rem;
  margin: 0;
}

.search-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  color: #FF5722;
  font-size: 0.9rem;
}

.stat-item strong {
  display: block;
  font-size: 1.5rem;
  color: #4A148C;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #4A148C;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.search-input,
.search-select {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus,
.search-select:focus {
  outline: none;
  border-color: #4A148C;
  box-shadow: 0 0 0 3px rgba(74, 20, 140, 0.1);
}

.search-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.clear-btn,
.export-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-btn {
  background: #6c757d;
  color: white;
}

.clear-btn:hover {
  background: #5a6268;
}

.export-btn {
  background: #28a745;
  color: white;
}

.export-btn:hover:not(:disabled) {
  background: #218838;
}

.export-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.results-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 0 2rem 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.results-header h3 {
  color: #4A148C;
  font-size: 1.4rem;
  margin: 0;
}

.results-count {
  color: #FF5722;
  font-weight: 600;
  font-size: 1.1rem;
}

.loading-state,
.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A148C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results h4 {
  color: #4A148C;
  margin-bottom: 0.5rem;
}

.children-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.child-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.child-card:hover {
  border-color: #4A148C;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 20, 140, 0.15);
}

.child-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.child-id {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.id-label {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.id-value {
  color: #4A148C;
  font-weight: 700;
  font-family: monospace;
  background: rgba(74, 20, 140, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.child-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.child-status.Active {
  background: #d4edda;
  color: #155724;
}

.child-status.Admitted {
  background: #d1ecf1;
  color: #0c5460;
}

.child-status.Referred {
  background: #fff3cd;
  color: #856404;
}

.child-status.Under.Assessment {
  background: #e2e3e5;
  color: #383d41;
}

.child-status.Not.Admitted {
  background: #f8d7da;
  color: #721c24;
}

.child-status.Inactive {
  background: #f8d7da;
  color: #721c24;
}

.child-info {
  margin-bottom: 1rem;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.info-value.form-type {
  color: #FF5722;
  font-weight: 600;
}

.child-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn.view {
  background: #17a2b8;
  color: white;
}

.action-btn.view:hover {
  background: #138496;
}

.action-btn.edit {
  background: #ffc107;
  color: #212529;
}

.action-btn.edit:hover {
  background: #e0a800;
}

.pagination-container {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f8f9fa;
}

/* Modal Styles */
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

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 80vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.child-details-modal {
  width: 900px;
  max-width: 90vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f8f9fa;
  background: #f8f9fa;
}

.modal-header h3 {
  color: #4A148C;
  margin: 0;
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.child-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.details-section h4 {
  color: #4A148C;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8f9fa;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  color: #666;
  font-weight: 500;
  font-size: 0.85rem;
}

.detail-item span {
  color: #333;
  font-weight: 500;
}

.detail-item .unique-id {
  color: #4A148C;
  font-family: monospace;
  background: rgba(74, 20, 140, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 700;
}

.detail-item .custom-id {
  color: #FF5722;
  font-family: monospace;
  background: rgba(255, 87, 34, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 700;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  width: fit-content;
}

.status-badge.Active {
  background: #d4edda;
  color: #155724;
}

.status-badge.Admitted {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.Referred {
  background: #fff3cd;
  color: #856404;
}

.status-badge.Under.Assessment {
  background: #e2e3e5;
  color: #383d41;
}

.status-badge.Not.Admitted {
  background: #f8d7da;
  color: #721c24;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f8f9fa;
  background: #f8f9fa;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #e0a800;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #5a6268;
}

/* Responsive Design */
@media (max-width: 768px) {
  .child-tracker-container {
    padding: 0;
  }

  .header-nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
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
  }

  .back-button,
  .logout-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .tracker-title {
    font-size: 1.5rem;
  }

  .tracker-subtitle {
    font-size: 0.875rem;
  }

  .search-section,
  .results-section {
    margin: 0 1rem 1.5rem;
  }
  
  .search-inputs {
    grid-template-columns: 1fr;
  }
  
  .search-actions {
    justify-content: stretch;
  }
  
  .clear-btn,
  .export-btn {
    flex: 1;
  }
  
  .children-list {
    grid-template-columns: 1fr;
  }
  
  .info-row {
    grid-template-columns: 1fr;
  }
  
  .child-details-modal {
    width: 95vw;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .search-header,
  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-stats {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-nav {
    padding: 0.75rem;
  }

  .tracker-title {
    font-size: 1.25rem;
  }

  .tracker-subtitle {
    font-size: 0.8rem;
  }

  .back-button,
  .logout-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    width: 100%;
    justify-content: center;
  }

  .header-right {
    flex-direction: row;
    gap: 0.5rem;
  }

  .search-section,
  .results-section {
    margin: 0 0.5rem 1rem;
  }

  .child-card {
    padding: 1rem;
  }
  
  .child-actions {
    flex-direction: column;
  }
  
  .action-btn {
    text-align: center;
  }
}
</style>