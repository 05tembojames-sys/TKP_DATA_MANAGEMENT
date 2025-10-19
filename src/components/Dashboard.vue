<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="header-section">
      <!-- Logout Button -->
      <button @click="handleLogout" class="logout-button">
        Logout
      </button>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">
      <div v-if="currentView === 'main'">
        <!-- Two Column Layout -->
        <div class="dashboard-layout">
          
          <!-- Left Section - Logo and Summary -->
          <div class="left-section">
            <!-- Logo Card -->
            <div class="logo-card">
              <div class="logo-container">
                <svg viewBox="0 0 100 100" class="logo-svg">
                  <defs>
                    <linearGradient id="kGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#4A148C;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#2D1B69;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <!-- K Letter Shape -->
                  <path d="M20 15 L20 85 L30 85 L30 55 L45 40 L70 85 L82 85 L50 35 L80 15 L68 15 L45 35 L30 50 L30 15 Z" fill="url(#kGradient)"/>
                </svg>
              </div>
              <h1 class="project-title">THE KUKHOMA PROJECT</h1>
            </div>
            
            <!-- Summary Section -->
            <div class="summary-section">
              <h3>Summary of the data in the system</h3>
              <div class="summary-stats">
                <div class="stat-item">
                  <div class="stat-number">{{ users.length || 0 }}</div>
                  <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">1</div>
                  <div class="stat-label">Active Sessions</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ totalReports || 0 }}</div>
                  <div class="stat-label">Reports Generated</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ totalChildren || 0 }}</div>
                  <div class="stat-label">Children Tracked</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ totalEvents || 0 }}</div>
                  <div class="stat-label">Events Recorded</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ totalDataEntries || 0 }}</div>
                  <div class="stat-label">Data Entries</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Section - Dashboard Buttons -->
          <div class="right-section">
            <!-- Section Title -->
            <div class="section-title">
              <h2>The khukoma project data management system</h2>
            </div>
            
            <!-- Dashboard Buttons Grid (3x3) -->
            <div class="dashboard-buttons-grid">
              <button class="dashboard-btn tracker-btn" @click="setCurrentView('tracker-capture')">
                <i class="fas fa-search-location btn-icon"></i>
                <span>Tracker Capture</span>
              </button>
              
              <button class="dashboard-btn reports-btn" @click="setCurrentView('reports')">
                <i class="fas fa-chart-bar btn-icon"></i>
                <span>Reports</span>
              </button>
              
              <button class="dashboard-btn data-entry-btn" @click="setCurrentView('data-entry')">
                <i class="fas fa-keyboard btn-icon"></i>
                <span>Data Entry</span>
              </button>
              
              <button class="dashboard-btn child-tracker-btn" @click="setCurrentView('child-tracker')">
                <i class="fas fa-baby btn-icon"></i>
                <span>Child Tracker</span>
              </button>
              
              <button class="dashboard-btn analytics-btn" @click="setCurrentView('visualization')">
                <i class="fas fa-chart-line btn-icon"></i>
                <span>Analytics</span>
              </button>
              
              <button class="dashboard-btn events-btn" @click="setCurrentView('event-reports')">
                <i class="fas fa-calendar-alt btn-icon"></i>
                <span>Events</span>
              </button>
              
              <button class="dashboard-btn capture-btn" @click="setCurrentView('capture')">
                <i class="fas fa-camera btn-icon"></i>
                <span>Capture</span>
              </button>
              
              <button class="dashboard-btn residents-btn" @click="setCurrentView('child-tracker-2')">
                <i class="fas fa-home btn-icon"></i>
                <span>Residents</span>
              </button>
              
              <button class="dashboard-btn analysis-btn" @click="setCurrentView('data-analysis')">
                <i class="fas fa-microscope btn-icon"></i>
                <span>Analysis</span>
              </button>
              
              <button 
                class="dashboard-btn users-btn" 
                @click="canManageUsers ? $router.push('/user-management') : null"
                :disabled="!canManageUsers"
                :class="{ 'btn-disabled': !canManageUsers }"
              >
                <i class="fas fa-users-cog btn-icon"></i>
                <span>Users</span>
              </button>
            </div>
            
            <!-- Dashboard Description -->
            <div class="dashboard-description">
              <p class="description-text">
                <strong>The Kukhoma Project Data Management System</strong> provides comprehensive tools for child protection and support services. 
                Use <em>Tracker Capture</em> to monitor individual cases, <em>Data Entry</em> for structured form collection, generate <em>Reports</em> for insights, 
                and track <em>Residents</em> in our care facilities. Advanced <em>Analytics</em> help identify trends and measure impact across all programs. 
                <em>Users</em> module allows administrators to manage system access and user permissions.
              </p>
            </div>
          </div>
          
        </div>
      </div>

      <!-- User Management Section -->
      <div v-if="currentView === 'manage-users'" class="user-management">
        <div class="section-header">
          <h2>Manage Users</h2>
          <div class="header-actions">
            <button class="dashboard-btn" @click="showAddUserForm = true">
              Add New User
            </button>
            <button class="back-btn" @click="setCurrentView('main')">
              Back to Dashboard
            </button>
          </div>
        </div>

        <!-- Add User Form -->
        <div v-if="showAddUserForm" class="user-form">
          <h3>Add New User</h3>
          <form @submit.prevent="handleAddUser">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input v-model="newUser.fullName" type="text" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="newUser.email" type="email" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Password</label>
                <input v-model="newUser.password" type="password" required minlength="6" />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input v-model="newUser.phoneNumber" type="tel" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Role</label>
                <select v-model="newUser.role" required>
                  <option value="admin">Administrator</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
                <small style="color: #28a745; font-size: 0.85rem; margin-top: 0.25rem; display: block;">
                  ✓ All roles can log in. Permissions are based on role selection.
                </small>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="dashboard-btn" :disabled="loading">
                {{ loading ? 'Creating...' : 'Create User' }}
              </button>
              <button type="button" class="cancel-btn" @click="cancelAddUser">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Edit User Form -->
        <div v-if="showEditUserForm" class="user-form">
          <h3>Edit User</h3>
          <form @submit.prevent="handleUpdateUser">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input v-model="editUser.fullName" type="text" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="editUser.email" type="email" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Phone Number</label>
                <input v-model="editUser.phoneNumber" type="tel" required />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="dashboard-btn" :disabled="loading">
                {{ loading ? 'Updating...' : 'Update User' }}
              </button>
              <button type="button" class="cancel-btn" @click="cancelEditUser">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Users Table -->
        <div class="users-table">
          <div v-if="loadingUsers" class="loading">Loading users...</div>
          <div v-else-if="users.length === 0" class="no-users">
            No users found. Add your first user above.
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.fullName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phoneNumber }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td class="actions">
                  <button class="edit-btn" @click="startEditUser(user)">
                    Edit
                  </button>
                  <button class="delete-btn" @click="confirmDeleteUser(user)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Data Entry Forms Section -->
      <div v-if="currentView === 'data-entry'" class="forms-section">
        <div class="section-header">
          <h2>Data Entry</h2>
          <div class="header-actions">
            <button class="back-btn" @click="setCurrentView('main')">
              Back to Dashboard
            </button>
          </div>
        </div>

        <!-- Forms Navigation -->
        <div class="forms-navigation">
          <div class="form-tabs">
            <button 
              v-for="form in availableForms" 
              :key="form.id"
              @click="setCurrentForm(form.id)"
              :class="['form-tab', { active: currentForm === form.id }]"
            >
              {{ form.name }}
            </button>
          </div>
        </div>

        <!-- Form Content -->
        <div class="form-content">
          <!-- Initial Child Referral Forms List -->
          <div v-if="currentForm === 'initial-referral-list'" class="forms-list-container">
            <FormsList 
              :form-type="'initial-referral'" 
              @form-edit="handleFormEdit"
              @add-new-form="handleAddNewForm"
            />
          </div>

          <!-- Child Overview Forms List -->
          <div v-else-if="currentForm === 'child-overview-list'" class="forms-list-container">
            <FormsList 
              :form-type="'child-overview'" 
              @form-edit="handleFormEdit"
              @add-new-form="handleAddNewForm"
            />
          </div>

          <!-- TKP Initial Assessment Forms List -->
          <div v-else-if="currentForm === 'initial-assessment-list'" class="forms-list-container">
            <FormsList 
              :form-type="'initial-assessment'" 
              @form-edit="handleFormEdit"
              @add-new-form="handleAddNewForm"
            />
          </div>

          <!-- Initial Child Referral Form -->
          <div v-else-if="currentForm === 'initial-referral-new'" class="form-container">
            <div class="form-header">
              <h3>New Initial Child Referral Form</h3>
              <button @click="backToFormsList('initial-referral')" class="back-to-list-btn">
                ← Back to Forms List
              </button>
            </div>
            <InitialReferralForm @form-saved="handleFormSaved" />
          </div>

          <!-- Child Overview and Background Form -->
          <div v-else-if="currentForm === 'child-overview-new'" class="form-container">
            <div class="form-header">
              <h3>New Child Overview and Background Form</h3>
              <button @click="backToFormsList('child-overview')" class="back-to-list-btn">
                ← Back to Forms List
              </button>
            </div>
            <ChildOverviewForm @form-saved="handleFormSaved" />
          </div>

          <!-- TKP Initial Assessment Form -->
          <div v-else-if="currentForm === 'initial-assessment-new'" class="form-container">
            <div class="form-header">
              <h3>New TKP Initial Assessment Form</h3>
              <button @click="backToFormsList('initial-assessment')" class="back-to-list-btn">
                ← Back to Forms List
              </button>
            </div>
            <InitialAssessmentForm @form-saved="handleFormSaved" />
          </div>
        </div>
      </div>

      <!-- Child Tracker Section -->
      <div v-if="currentView === 'child-tracker' || currentView === 'child-tracker-2'" class="child-tracker-section">
        <ChildTracker />
        <div class="section-actions">
          <button class="back-btn" @click="setCurrentView('main')">
            Back to Dashboard
          </button>
        </div>
      </div>

      <!-- Data Visualization Section -->
      <div v-if="currentView === 'visualization'" class="visualization-section">
        <DataVisualization />
        <div class="section-actions">
          <button class="back-btn" @click="setCurrentView('main')">
            Back to Dashboard
          </button>
        </div>
      </div>

      <!-- Data Analysis Section -->
      <div v-if="currentView === 'data-analysis'" class="data-analysis-section">
        <DataAnalysis />
        <div class="section-actions">
          <button class="back-btn" @click="setCurrentView('main')">
            Back to Dashboard
          </button>
        </div>
      </div>

      <!-- Reports Section -->
      <div v-if="currentView === 'reports'" class="reports-section">
        <Reports :can-approve="canApproveReports" />
        <div class="section-actions">
          <button class="back-btn" @click="setCurrentView('main')">
            Back to Dashboard
          </button>
        </div>
      </div>

      <!-- Event Reports Section -->
      <div v-if="currentView === 'event-reports'" class="event-reports-section">
        <EventReports />
        <div class="section-actions">
          <button class="back-btn" @click="setCurrentView('main')">
            Back to Dashboard
          </button>
        </div>
      </div>

      <!-- Other Sections Placeholder -->
      <div v-if="!['main', 'manage-users', 'data-entry', 'child-tracker', 'child-tracker-2', 'visualization', 'data-analysis', 'reports', 'event-reports'].includes(currentView)" class="section-placeholder">
        <h2>{{ getSectionTitle(currentView) }}</h2>
        <p>This section is under development.</p>
        <button class="back-btn" @click="setCurrentView('main')">
          Back to Dashboard
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'
import AuthService from '../services/auth.js'
import UserService from '../services/userService.js'
import KLogo from './KLogo.vue'
import InitialReferralForm from './InitialReferralForm.vue'
import ChildOverviewForm from './ChildOverviewForm.vue'
import InitialAssessmentForm from './InitialAssessmentForm.vue'
import FormsList from './FormsList.vue'
import ChildTracker from './ChildTracker.vue'
import DataVisualization from './DataVisualization.vue'
import DataAnalysis from './DataAnalysis.vue'
import Reports from './Reports.vue'
import EventReports from './EventReports.vue'
import FormService from '../services/formService.js'

// Import custom SVG icon (uncomment when you add the file)
// import DataEntryIcon from '../assets/icons/data-entry.svg?url'

const router = useRouter()
const { success, error, confirm } = useToast()

// View management
const currentView = ref('main')

// User management
const users = ref([])
const loadingUsers = ref(false)
const loading = ref(false)
const showAddUserForm = ref(false)
const showEditUserForm = ref(false)

// Summary statistics
const totalReports = ref(0)
const totalChildren = ref(0)
const totalEvents = ref(0)
const totalDataEntries = ref(0)

// Forms management
const currentForm = ref('initial-referral-list')
const selectedFormType = ref('initial-referral')
const availableForms = ref([
  { id: 'initial-referral-list', name: 'Initial Child Referral Forms' },
  { id: 'child-overview-list', name: 'Child Overview Forms' },
  { id: 'initial-assessment-list', name: 'TKP Initial Assessment Forms' }
])

// Form data
const newUser = ref({
  fullName: '',
  email: '',
  password: '',
  phoneNumber: ''
})

const editUser = ref({
  id: '',
  uid: '',
  fullName: '',
  email: '',
  phoneNumber: ''
})

// Permission checking computed properties
const canManageUsers = computed(() => {
  const role = AuthService.getUserRoleInfo()
  return role === 'admin' || role === 'manager' || AuthService.hasPermission('users_write')
})

const canApproveReports = computed(() => {
  const role = AuthService.getUserRoleInfo()
  return role === 'admin' || role === 'manager'
})


// View management functions
const setCurrentView = async (view) => {
  // Handle navigation to capture page
  if (view === 'capture') {
    router.push('/capture')
    return
  }
  
  // Handle navigation to tracker capture page
  if (view === 'tracker-capture') {
    router.push('/tracker-capture')
    return
  }
  
  // Handle navigation to event reports page
  if (view === 'event-reports') {
    router.push('/event-reports')
    return
  }
  
  currentView.value = view
  
  if (view === 'manage-users') {
    await loadUsers()
  }
}

// Form management functions
const setCurrentForm = (formId) => {
  currentForm.value = formId
  // Extract form type from the form ID for list views
  if (formId.endsWith('-list')) {
    selectedFormType.value = formId.replace('-list', '')
  } else if (formId.endsWith('-new')) {
    selectedFormType.value = formId.replace('-new', '')
  }
}

const handleFormSaved = (formData) => {
  success('Form saved successfully!')
  // Switch back to the corresponding forms list after saving
  if (currentForm.value === 'initial-referral-new') {
    currentForm.value = 'initial-referral-list'
  } else if (currentForm.value === 'child-overview-new') {
    currentForm.value = 'child-overview-list'
  } else if (currentForm.value === 'initial-assessment-new') {
    currentForm.value = 'initial-assessment-list'
  }
}

const handleFormEdit = (form) => {
  // Switch to the appropriate form and populate with data
  currentForm.value = form.formType + '-new'
  selectedFormType.value = form.formType
  success('Form loaded for editing')
}

const handleAddNewForm = (formType) => {
  // Switch to the new form creation view
  currentForm.value = formType + '-new'
  selectedFormType.value = formType
}

const backToFormsList = (formType) => {
  // Return to the forms list view
  currentForm.value = formType + '-list'
  selectedFormType.value = formType
}

// Load summary data
const loadSummaryData = async () => {
  try {
    // Load users count
    const usersResult = await UserService.getAllUsers()
    if (usersResult.success) {
      users.value = usersResult.users || []
    }
    
    // Load form statistics
    const formStatsResult = await FormService.getFormStatistics()
    if (formStatsResult.success) {
      totalReports.value = formStatsResult.statistics.totalReferrals
      totalChildren.value = formStatsResult.statistics.totalOverviews
      totalEvents.value = formStatsResult.statistics.totalAssessments
      totalDataEntries.value = formStatsResult.statistics.totalForms
    } else {
      // Fallback to mock data if form stats fail
      totalReports.value = 24
      totalChildren.value = 156
      totalEvents.value = 89
      totalDataEntries.value = 1247
    }
  } catch (error) {
    console.error('Error loading summary data:', error)
    // Fallback to mock data
    totalReports.value = 24
    totalChildren.value = 156
    totalEvents.value = 89
    totalDataEntries.value = 1247
  }
}

const getSectionTitle = (view) => {
  const titles = {
    'tracker-capture': 'Tracker Capture/outreach',
    'reports': 'Reports - Weekly',
    'data-entry': 'Data Entry / Forms',
    'event-reports': 'Event Reports',
    'child-tracker': 'Child Tracker - In-house/children',
    'child-tracker-2': 'Child Tracker - In-house/children',
    'visualization': 'Visualization',
    'data-analysis': 'Data Analysis',
    'capture': 'Capture'
  }
  return titles[view] || 'Section'
}

// User management functions
const loadUsers = async () => {
  loadingUsers.value = true
  try {
    const result = await UserService.getAllUsers()
    if (result.success) {
      users.value = result.users || []
    } else {
      error(result.error || 'Failed to load users')
    }
  } catch (err) {
    console.error('Error loading users:', err)
    error('An unexpected error occurred while loading users')
  } finally {
    loadingUsers.value = false
  }
}

const handleAddUser = async () => {
  loading.value = true
  try {
    // Validate form data
    if (!newUser.value.fullName.trim()) {
      error('Full name is required')
      return
    }
    if (!newUser.value.email.trim()) {
      error('Email is required')
      return
    }
    if (!newUser.value.password || newUser.value.password.length < 6) {
      error('Password must be at least 6 characters')
      return
    }
    if (!newUser.value.phoneNumber.trim()) {
      error('Phone number is required')
      return
    }

    // Check for duplicate email/username
    const { default: DuplicationService } = await import('../services/duplicationService.js')
    
    const duplicateCheck = await DuplicationService.checkDuplicateUser({
      email: newUser.value.email,
      username: newUser.value.fullName // Using fullName as username for now
    })
    
    if (duplicateCheck.hasDuplicates) {
      const duplicateFields = duplicateCheck.duplicates.map(dup => {
        return `${dup.field}: ${dup.value}`
      }).join(', ')
      
      error(`User already exists with ${duplicateFields}. Please use different credentials.`)
      loading.value = false
      return
    }

    const result = await UserService.addUser(newUser.value)
    if (result.success) {
      success('User created successfully!')
      resetAddUserForm()
      await loadUsers()
    } else {
      error(result.error || 'Failed to create user')
    }
  } catch (err) {
    console.error('Error adding user:', err)
    error('An unexpected error occurred while creating user')
  } finally {
    loading.value = false
  }
}

const handleUpdateUser = async () => {
  loading.value = true
  try {
    // Validate form data
    if (!editUser.value.fullName.trim()) {
      error('Full name is required')
      return
    }
    if (!editUser.value.email.trim()) {
      error('Email is required')
      return
    }
    if (!editUser.value.phoneNumber.trim()) {
      error('Phone number is required')
      return
    }

    const result = await UserService.updateUser(editUser.value.uid, editUser.value)
    if (result.success) {
      success('User updated successfully!')
      cancelEditUser()
      await loadUsers()
    } else {
      error(result.error || 'Failed to update user')
    }
  } catch (err) {
    console.error('Error updating user:', err)
    error('An unexpected error occurred while updating user')
  } finally {
    loading.value = false
  }
}

const startEditUser = (user) => {
  editUser.value = {
    id: user.id,
    uid: user.uid,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber
  }
  showEditUserForm.value = true
  showAddUserForm.value = false
}

const confirmDeleteUser = async (user) => {
  const confirmed = await confirm(
    `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`,
    'Delete User'
  )
  
  if (confirmed) {
    try {
      const result = await UserService.deleteUser(user.uid)
      if (result.success) {
        success('User deleted successfully!')
        await loadUsers()
      } else {
        error(result.error || 'Failed to delete user')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      error('An unexpected error occurred while deleting user')
    }
  }
}

const resetAddUserForm = () => {
  newUser.value = {
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'admin' // Default to admin role for dashboard users
  }
  showAddUserForm.value = false
}

const cancelAddUser = () => {
  resetAddUserForm()
}

const cancelEditUser = () => {
  showEditUserForm.value = false
  editUser.value = {
    id: '',
    uid: '',
    fullName: '',
    email: '',
    phoneNumber: ''
  }
}

// Utility functions
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString()
}


const handleLogout = async () => {
  const result = await AuthService.logout()
  if (result.success) {
    router.push('/login')
  }
}

// Load summary data when component mounts
onMounted(() => {
  loadSummaryData()
})
</script>

<style scoped>
/* Dashboard Layout */
.dashboard {
  min-height: 100vh;
  background-color: #EEEEEE; /* Light gray background */
}

/* Top Section */
.header-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #EEEEEE;
}

.logo-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-container {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-svg {
  width: 100%;
  height: 100%;
}

.project-title {
  color: #4A148C; /* Dark purple */
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
}

.logout-button {
  background-color: #4A148C; /* Dark purple - same as logo */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #2D1B69; /* Darker purple on hover */
}

/* Main Content */
.dashboard-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Dashboard Layout */
.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;
}

/* Left Section */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.logo-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 300px;
}

.logo-container {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-svg {
  width: 100%;
  height: 100%;
}

.project-title {
  color: #4A148C; /* Dark purple */
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0;
  text-align: center;
  line-height: 1.3;
}

.summary-section {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-section h3 {
  color: #4A148C;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 0.5rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4A148C;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

/* Right Section */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  text-align: left;
}

/* Dashboard Buttons Grid - Responsive Layout */
.dashboard-buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  max-width: 100%;
  justify-items: center;
}

.dashboard-btn {
  background: linear-gradient(135deg, #4A148C 0%, #2D1B69 100%);
  color: #FFFFFF;
  padding: 18px 14px;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 95px;
  width: 150px;
  max-width: 150px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  box-shadow: 0 4px 15px rgba(74, 20, 140, 0.25);
  overflow: hidden;
}

.dashboard-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dashboard-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(74, 20, 140, 0.35);
}

.dashboard-btn:hover::before {
  opacity: 1;
}

.dashboard-btn:active {
  transform: translateY(-1px);
}

/* Individual button color schemes */
.tracker-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.tracker-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.reports-btn {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
}

.reports-btn:hover {
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
}

.data-entry-btn {
  background: linear-gradient(135deg, #FFD93D 0%, #FFC53D 100%);
  box-shadow: 0 4px 15px rgba(255, 217, 61, 0.3);
  color: #333;
}

.data-entry-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 217, 61, 0.4);
}

.child-tracker-btn {
  background: linear-gradient(135deg, #A8E6CF 0%, #7BDCB5 100%);
  box-shadow: 0 4px 15px rgba(168, 230, 207, 0.3);
  color: #333;
}

.child-tracker-btn:hover {
  box-shadow: 0 6px 20px rgba(168, 230, 207, 0.4);
}

.analytics-btn {
  background: linear-gradient(135deg, #95E1D3 0%, #38A3A5 100%);
  box-shadow: 0 4px 15px rgba(149, 225, 211, 0.3);
}

.analytics-btn:hover {
  box-shadow: 0 6px 20px rgba(149, 225, 211, 0.4);
}

.events-btn {
  background: linear-gradient(135deg, #FAA43A 0%, #F77F00 100%);
  box-shadow: 0 4px 15px rgba(250, 164, 58, 0.3);
}

.events-btn:hover {
  box-shadow: 0 6px 20px rgba(250, 164, 58, 0.4);
}

.capture-btn {
  background: linear-gradient(135deg, #B983FF 0%, #8C5EFF 100%);
  box-shadow: 0 4px 15px rgba(185, 131, 255, 0.3);
}

.capture-btn:hover {
  box-shadow: 0 6px 20px rgba(185, 131, 255, 0.4);
}

.residents-btn {
  background: linear-gradient(135deg, #FD79A8 0%, #E84393 100%);
  box-shadow: 0 4px 15px rgba(253, 121, 168, 0.3);
}

.residents-btn:hover {
  box-shadow: 0 6px 20px rgba(253, 121, 168, 0.4);
}

.analysis-btn {
  background: linear-gradient(135deg, #74B9FF 0%, #0984E3 100%);
  box-shadow: 0 4px 15px rgba(116, 185, 255, 0.3);
}

.analysis-btn:hover {
  box-shadow: 0 6px 20px rgba(116, 185, 255, 0.4);
}

.users-btn {
  background: linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%);
  box-shadow: 0 4px 15px rgba(162, 155, 254, 0.3);
}

.users-btn:hover {
  box-shadow: 0 6px 20px rgba(162, 155, 254, 0.4);
}

.btn-icon {
  font-size: 2rem;
  flex-shrink: 0;
  opacity: 0.95;
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.dashboard-btn:hover .btn-icon {
  opacity: 1;
  transform: scale(1.1) rotate(5deg);
}

/* Disabled button state */
.dashboard-btn:disabled,
.dashboard-btn.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
  box-shadow: 0 2px 8px rgba(158, 158, 158, 0.2);
}

.dashboard-btn:disabled:hover,
.dashboard-btn.btn-disabled:hover {
  transform: none;
  box-shadow: 0 2px 8px rgba(158, 158, 158, 0.2);
}

.dashboard-btn:disabled .btn-icon,
.dashboard-btn.btn-disabled .btn-icon {
  transform: none;
}

.dashboard-btn span {
  line-height: 1.1;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  display: block;
  letter-spacing: 0.3px;
}

/* Dashboard Description */
.dashboard-description {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border-left: 4px solid #4A148C;
}

.description-text {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  text-align: justify;
}

.description-text strong {
  color: #4A148C;
  font-weight: 600;
}

.description-text em {
  color: #2D1B69;
  font-style: normal;
  font-weight: 500;
  background: rgba(74, 20, 140, 0.1);
  padding: 1px 4px;
  border-radius: 3px;
}

/* User Management Section */
.user-management {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #EEEEEE;
}

.section-header h2 {
  color: #4A148C; /* Dark purple */
  margin: 0;
  font-size: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.back-btn {
  background-color: #333333; /* Dark gray */
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #555;
}

/* Forms */
.user-form {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.user-form h3 {
  color: #4A148C;
  margin: 0 0 1.5rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #4A148C; /* Dark purple */
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #4A148C;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4A148C;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 1.5rem;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

/* Users Table */
.users-table {
  margin-top: 2rem;
}

.loading, .no-users {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th, td {
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

th {
  background-color: #4A148C; /* Dark purple */
  color: white;
  font-weight: bold;
}

tbody tr:hover {
  background-color: #f8f9fa;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  background-color: #17a2b8;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #138496;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* Forms Section */
.forms-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.forms-navigation {
  margin-bottom: 2rem;
  border-bottom: 2px solid #EEEEEE;
  padding-bottom: 1rem;
}

.form-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.form-tab {
  background-color: #f8f9fa;
  color: #4A148C;
  padding: 12px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.form-tab:hover {
  background-color: #e9ecef;
  border-color: #4A148C;
}

.form-tab.active {
  background-color: #4A148C;
  color: white;
  border-color: #4A148C;
}

.form-content {
  min-height: 500px;
}

.form-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #e9ecef;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  border-left: 6px solid #4A148C;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  position: relative;
  overflow: hidden;
}

.form-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #4A148C 0%, #FF5722 100%);
}

.form-header h3 {
  color: #4A148C;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-header h3::before {
  content: '📋';
  font-size: 1.5rem;
}

.back-to-list-btn {
  background-color: #4A148C;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(74, 20, 140, 0.3);
}

.back-to-list-btn:hover {
  background-color: #2D1B69;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(74, 20, 140, 0.4);
}

.back-to-list-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(74, 20, 140, 0.3);
}

.forms-list-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Child Tracker Section */
.child-tracker-section {
  background: transparent;
  padding: 0;
}

/* Data Visualization Section */
.visualization-section {
  background: transparent;
  padding: 0;
  position: relative;
}

/* Data Analysis Section */
.data-analysis-section {
  background: transparent;
  padding: 0;
  position: relative;
}

/* Reports Section */
.reports-section {
  background: transparent;
  padding: 0;
  position: relative;
}

.section-actions {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

/* Section Placeholder */
.section-placeholder {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.section-placeholder h2 {
  color: #4A148C;
  margin-bottom: 1rem;
}

.section-placeholder p {
  color: #666;
  margin-bottom: 2rem;
}


/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-buttons-grid {
    grid-template-columns: repeat(3, minmax(140px, 1fr));
  }
}

@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .dashboard-buttons-grid {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    justify-items: center;
  }
  
  .dashboard-btn {
    width: 140px;
    max-width: 140px;
  }
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .dashboard-buttons-grid {
    grid-template-columns: repeat(2, minmax(130px, 1fr));
    justify-items: center;
    max-width: none;
  }
  
  .dashboard-btn {
    width: 130px;
    max-width: 130px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1.5rem;
  }
  
  .form-header h3 {
    font-size: 1.2rem;
    text-align: center;
  }
  
  .back-to-list-btn {
    width: 100%;
    justify-content: center;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .logo-card {
    max-width: none;
    width: 100%;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
}

/* Mobile-specific (max-width: 600px) */
@media (max-width: 600px) {
  .dashboard-buttons-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    justify-items: center;
    gap: 0.5rem;
  }
  
  .project-title {
    font-size: 1.1rem;
  }
  
  .section-title h2 {
    font-size: 1.3rem;
  }
  
  .user-management {
    padding: 1rem;
  }
  
  table {
    font-size: 0.8rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
  
  .message {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
  
  .logo-card {
    padding: 1.5rem;
  }
  
  .logo-container {
    width: 60px;
    height: 60px;
  }
  
  .dashboard-btn {
    font-size: 0.8rem;
    padding: 14px 10px;
    min-height: 75px;
    width: 120px;
    max-width: 120px;
    gap: 6px;
  }
  
  .dashboard-btn span {
    font-size: 0.75rem;
    line-height: 1.0;
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
  }
  
  .description-text {
    font-size: 0.85rem;
    text-align: left;
  }
}

</style>
