<template>
  <div class="user-management-container">
    <!-- Header -->
    <div class="user-management-header">
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
        <h1 class="page-title">User Management</h1>
      </div>
      <div class="header-right">
        <button @click="showAddUserModal = true" class="add-user-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14" />
            <path d="m5 12 14 0" />
          </svg>
          Add User
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="user-management-content">
      <!-- Setup Information Banner -->
      <div v-if="allUsers.length === 0 && !loading" class="info-banner">
        <div class="banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <div class="banner-content">
          <strong>Setting up User Management</strong>
          <p>If this is your first time using the user management system, Firebase indexes may still be building. 
             This can take 5-10 minutes. You can create users, but some features like login history may be limited until setup completes.</p>
        </div>
      </div>
      
      <!-- Filters and Search -->
      <div class="filters-panel">
        <div class="search-section">
          <div class="search-input-group">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input 
              type="text" 
              v-model="searchQuery" 
              @input="performSearch"
              placeholder="Search users by name, email, or role..."
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

        <div class="filter-controls">
          <div class="filter-group">
            <label class="filter-label">Status</label>
            <select v-model="selectedStatus" @change="applyFilters" class="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Role</label>
            <select v-model="selectedRole" @change="applyFilters" class="filter-select">
              <option value="">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Organization Unit</label>
                  <select v-model="selectedOrgUnit" @change="applyFilters" class="filter-select">
                    <option value="">All Units</option>
                    <option value="Main Center">Main Center</option>
                    <option value="Outreach - Lusaka">Outreach - Lusaka</option>
                    <option value="Outreach - Chongwe">Outreach - Chongwe</option>
                    <option value="Education Unit">Education Unit</option>
                    <option value="Health Unit">Health Unit</option>
                  </select>
          </div>

          <div class="filter-actions">
            <button @click="applyFilters" class="filter-button">
              Filter
            </button>
            <button @click="resetFilters" class="reset-button">
              Reset
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="user-stats">
          <div class="stat-card">
            <div class="stat-number">{{ totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ activeUsers }}</div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ inactiveUsers }}</div>
            <div class="stat-label">Inactive</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ onlineUsers }}</div>
            <div class="stat-label">Online Now</div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="users-table-container">
        <div class="table-header">
          <h3>Users ({{ filteredUsers.length }})</h3>
          <div class="table-controls">
            <button @click="exportUsers" class="export-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>
            <button @click="refreshUsers" class="refresh-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th @click="sortBy('name')" class="sortable">
                  <div class="th-content">
                    Name
                    <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 10l5-5 5 5" />
                      <path d="M7 14l5 5 5-5" />
                    </svg>
                  </div>
                </th>
                <th @click="sortBy('email')" class="sortable">
                  <div class="th-content">
                    Email
                    <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 10l5-5 5 5" />
                      <path d="M7 14l5 5 5-5" />
                    </svg>
                  </div>
                </th>
                <th @click="sortBy('role')" class="sortable">
                  <div class="th-content">
                    Role
                    <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 10l5-5 5 5" />
                      <path d="M7 14l5 5 5-5" />
                    </svg>
                  </div>
                </th>
                <th @click="sortBy('orgUnit')" class="sortable">
                  <div class="th-content">
                    Organization Unit
                    <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 10l5-5 5 5" />
                      <path d="M7 14l5 5 5-5" />
                    </svg>
                  </div>
                </th>
                <th @click="sortBy('status')" class="sortable">
                  <div class="th-content">
                    Status
                    <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 10l5-5 5 5" />
                      <path d="M7 14l5 5 5-5" />
                    </svg>
                  </div>
                </th>
                <th @click="sortBy('lastLogin')" class="sortable">
                  <div class="th-content">
                    Last Login
                    <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 10l5-5 5 5" />
                      <path d="M7 14l5 5 5-5" />
                    </svg>
                  </div>
                </th>
                <th class="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in paginatedUsers" 
                :key="user.id" 
                class="user-row"
                :class="{ 'online': user.isOnline }"
              >
                <td class="user-name-cell">
                  <div class="user-info">
                    <div class="user-avatar">
                      <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                      <div v-else class="avatar-placeholder">
                        {{ getInitials(user.name) }}
                      </div>
                      <div v-if="user.isOnline" class="online-indicator"></div>
                    </div>
                    <div class="name-details">
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-username">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="user-email">
                  <a :href="'mailto:' + user.email" class="email-link">{{ user.email }}</a>
                </td>
                <td class="user-role">
                  <span class="role-badge" :class="user.role">
                    {{ formatRole(user.role) }}
                  </span>
                </td>
                <td class="user-org-unit">{{ user.orgUnit }}</td>
                <td class="user-status">
                  <span class="status-badge" :class="user.status">
                    <div class="status-dot"></div>
                    {{ formatStatus(user.status) }}
                  </span>
                </td>
                <td class="user-last-login">{{ formatDate(user.lastLogin) }}</td>
                <td class="user-actions">
                  <div class="action-buttons">
                    <button @click="viewUser(user)" class="action-button view-btn" title="View Details">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button @click="editUser(user)" class="action-button edit-btn" title="Edit User">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button @click="toggleUserStatus(user)" class="action-button toggle-btn" :title="user.status === 'active' ? 'Deactivate' : 'Activate'">
                      <svg v-if="user.status === 'active'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22,4 12,14.01 9,11.01" />
                      </svg>
                    </button>
                    <button @click="deleteUser(user)" class="action-button delete-btn" title="Delete User">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" v-if="totalPages > 1">
          <div class="pagination-info">
            Showing {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredUsers.length) }} of {{ filteredUsers.length }} users
          </div>
          <div class="pagination">
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
            <div class="page-numbers">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                class="page-number"
                :class="{ active: page === currentPage }"
              >
                {{ page }}
              </button>
            </div>
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
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddUserModal || showEditUserModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddUserModal ? 'Add New User' : 'Edit User' }}</h3>
          <button @click="closeModal" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveUser">
            <div class="form-section">
              <h4>Personal Information</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Full Name *</label>
                  <input v-model="userForm.name" type="text" required />
                </div>
                <div class="form-group">
                  <label>Username *</label>
                  <input v-model="userForm.username" type="text" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Email Address *</label>
                  <input v-model="userForm.email" type="email" required />
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input v-model="userForm.phone" type="tel" />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>System Access</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Role *</label>
                  <select v-model="userForm.role" required>
                    <option value="">Select Role</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <small style="color: #28a745; font-size: 0.85rem; margin-top: 0.25rem; display: block; font-weight: 500;">
                    ✓ All roles can log in. Permissions are controlled via role & permissions.
                  </small>
                </div>
                <div class="form-group">
                  <label>Organization Unit *</label>
                  <select v-model="userForm.orgUnit" required>
                    <option value="">Select Unit</option>
                    <option value="Main Center">Main Center</option>
                    <option value="Outreach - Lusaka">Outreach - Lusaka</option>
                    <option value="Outreach - Chongwe">Outreach - Chongwe</option>
                    <option value="Education Unit">Education Unit</option>
                    <option value="Health Unit">Health Unit</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Status *</label>
                  <select v-model="userForm.status" required>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div class="form-group" v-if="showAddUserModal">
                  <label>Temporary Password *</label>
                  <input v-model="userForm.password" type="password" :required="showAddUserModal" minlength="8" />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>Permissions</h4>
              <div class="permissions-grid">
                <label class="permission-item" v-for="permission in availablePermissions" :key="permission.id">
                  <input 
                    type="checkbox" 
                    :value="permission.id"
                    v-model="userForm.permissions"
                  />
                  <span class="checkmark"></span>
                  <div class="permission-info">
                    <div class="permission-name">{{ permission.name }}</div>
                    <div class="permission-description">{{ permission.description }}</div>
                  </div>
                </label>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel-button">
                Cancel
              </button>
              <button type="submit" class="save-button" :disabled="userLoading">
                {{ userLoading ? 'Saving...' : (showAddUserModal ? 'Create User' : 'Update User') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showUserDetailsModal" class="modal-overlay" @click="showUserDetailsModal = false">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>User Details - {{ selectedUser?.name }}</h3>
          <button @click="showUserDetailsModal = false" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="user-details-content" v-if="selectedUser">
            <div class="details-sections">
              <div class="detail-section">
                <h4>Personal Information</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <strong>Name:</strong> {{ selectedUser.name }}
                  </div>
                  <div class="detail-item">
                    <strong>Username:</strong> @{{ selectedUser.username }}
                  </div>
                  <div class="detail-item">
                    <strong>Email:</strong> {{ selectedUser.email }}
                  </div>
                  <div class="detail-item">
                    <strong>Phone:</strong> {{ selectedUser.phone || 'Not provided' }}
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4>System Access</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <strong>Role:</strong> 
                    <span class="role-badge" :class="selectedUser.role">{{ formatRole(selectedUser.role) }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Organization Unit:</strong> {{ selectedUser.orgUnit }}
                  </div>
                  <div class="detail-item">
                    <strong>Status:</strong> 
                    <span class="status-badge" :class="selectedUser.status">{{ formatStatus(selectedUser.status) }}</span>
                  </div>
                  <div class="detail-item">
                    <strong>Last Login:</strong> {{ formatDate(selectedUser.lastLogin) }}
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4>Activity</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <strong>Created:</strong> {{ formatDate(selectedUser.createdAt) }}
                  </div>
                  <div class="detail-item">
                    <strong>Updated:</strong> {{ formatDate(selectedUser.updatedAt) }}
                  </div>
                  <div class="detail-item">
                    <strong>Login Count:</strong> {{ selectedUser.loginCount || 0 }}
                  </div>
                  <div class="detail-item">
                    <strong>Online:</strong> 
                    <span :class="selectedUser.isOnline ? 'text-success' : 'text-muted'">
                      {{ selectedUser.isOnline ? 'Yes' : 'No' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { useToast } from '../composables/useToast.js'
import UserService from '../services/userService.js'

const router = useRouter()
const { success, error, confirm } = useToast()

// Reactive data
const loading = ref(false)
const userLoading = ref(false)
const loadingMessage = ref('')
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedRole = ref('')
const selectedOrgUnit = ref('')
const sortField = ref('name')
const sortOrder = ref('asc')
const currentPage = ref(1)
const pageSize = ref(10)

// Modals
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showUserDetailsModal = ref(false)

// Data
const allUsers = ref([])
const selectedUser = ref(null)

// Form data
const userForm = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  role: '',
  orgUnit: '',
  status: 'active',
  password: '',
  permissions: []
})

const availablePermissions = ref([
  { id: 'users_read', name: 'View Users', description: 'Can view user information' },
  { id: 'users_write', name: 'Manage Users', description: 'Can create, edit, and delete users' },
  { id: 'forms_read', name: 'View Forms', description: 'Can view form data' },
  { id: 'forms_write', name: 'Manage Forms', description: 'Can create and edit forms' },
  { id: 'reports_read', name: 'View Reports', description: 'Can view reports' },
  { id: 'reports_write', name: 'Manage Reports', description: 'Can create and manage reports' },
  { id: 'analytics_read', name: 'View Analytics', description: 'Can view analytics and dashboards' },
  { id: 'system_admin', name: 'System Administration', description: 'Full system administration access' }
])

// Computed properties
const filteredUsers = computed(() => {
  let filtered = allUsers.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }

  // Role filter
  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  // Org unit filter
  if (selectedOrgUnit.value) {
    filtered = filtered.filter(user => user.orgUnit === selectedOrgUnit.value)
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

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredUsers.value.length / pageSize.value)
)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const totalUsers = computed(() => allUsers.value.length)
const activeUsers = computed(() => allUsers.value.filter(u => u.status === 'active').length)
const inactiveUsers = computed(() => allUsers.value.filter(u => u.status === 'inactive').length)
const onlineUsers = computed(() => allUsers.value.filter(u => u.isOnline).length)

// Methods
const goBack = () => {
  router.push('/dashboard')
}

const performSearch = () => {
  currentPage.value = 1
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
  selectedRole.value = ''
  selectedOrgUnit.value = ''
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

const exportUsers = async () => {
  try {
    loading.value = true
    loadingMessage.value = 'Exporting users...'
    
    const result = await UserService.exportUsers('csv')
    
    if (result.success) {
      // Create and download CSV file
      const blob = new Blob([result.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kukhoma-users-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      alert('Users exported successfully')
    } else {
      alert('Failed to export users: ' + result.error)
    }
  } catch (error) {
    alert('An error occurred while exporting users')
  } finally {
    loading.value = false
  }
}

const refreshUsers = () => {
  loadUsers()
}

const getInitials = (name) => {
  if (!name || typeof name !== 'string') {
    return 'U'
  }
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}

const formatRole = (role) => {
  const roleMap = {
    admin: 'Administrator',
    manager: 'Manager',
    user: 'User',
    viewer: 'Viewer'
  }
  return roleMap[role] || role
}

const formatStatus = (status) => {
  const statusMap = {
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString()
}

const viewUser = (user) => {
  selectedUser.value = user
  showUserDetailsModal.value = true
}

const editUser = (user) => {
  selectedUser.value = user
  userForm.value = {
    ...user,
    permissions: user.permissions || []
  }
  showEditUserModal.value = true
}

const toggleUserStatus = async (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const confirmMessage = `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${user.name}?`
  
  const confirmed = await confirm(confirmMessage, 'Update User Status')
  if (confirmed) {
    try {
      userLoading.value = true
      const result = await UserService.updateUserStatus(user.id, newStatus)
      
      if (result.success) {
        user.status = newStatus
        success(result.message)
      } else {
        error('Failed to update user status: ' + result.error)
      }
    } catch (err) {
      error('An error occurred while updating user status')
    } finally {
      userLoading.value = false
    }
  }
}

const deleteUser = async (user) => {
  const confirmMessage = `Are you sure you want to delete ${user.name}? This action cannot be undone.`
  
  const confirmed = await confirm(confirmMessage, 'Delete User')
  if (confirmed) {
    try {
      userLoading.value = true
      const result = await UserService.deleteUser(user.id)
      
      if (result.success) {
        allUsers.value = allUsers.value.filter(u => u.id !== user.id)
        success(result.message)
      } else {
        error('Failed to delete user: ' + result.error)
      }
    } catch (err) {
      error('An error occurred while deleting user')
    } finally {
      userLoading.value = false
    }
  }
}

const saveUser = async () => {
  userLoading.value = true
  
  try {
    if (showAddUserModal.value) {
      const result = await UserService.addUser(userForm.value)
      if (result.success) {
        allUsers.value.push({
          id: result.id,
          ...userForm.value,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isOnline: false,
          loginCount: 0
        })
        success('User created successfully')
      } else {
        error('Failed to create user: ' + result.error)
      }
    } else {
      const result = await UserService.updateUser(selectedUser.value.id, userForm.value)
      if (result.success) {
        const userIndex = allUsers.value.findIndex(u => u.id === selectedUser.value.id)
        if (userIndex !== -1) {
          allUsers.value[userIndex] = {
            ...allUsers.value[userIndex],
            ...userForm.value,
            updatedAt: new Date().toISOString()
          }
        }
        success('User updated successfully')
      } else {
        error('Failed to update user: ' + result.error)
      }
    }
    
    closeModal()
    
  } catch (error) {
    error('An error occurred while saving the user')
  } finally {
    userLoading.value = false
  }
}

const closeModal = () => {
  showAddUserModal.value = false
  showEditUserModal.value = false
  showUserDetailsModal.value = false
  selectedUser.value = null
  resetUserForm()
}

const resetUserForm = () => {
  userForm.value = {
    name: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    orgUnit: '',
    status: 'active',
    password: '',
    permissions: []
  }
}

const loadUsers = async () => {
  loading.value = true
  loadingMessage.value = 'Loading users...'
  
  try {
    const result = await UserService.getAllUsers()
    if (result.success) {
      allUsers.value = result.users || []
      if (result.users.length === 0) {
        console.log('No users found in the system')
      }
    } else {
      console.error('Failed to load users:', result.error)
      
      // Check if it's an index error
      if (result.error.includes('index') || result.error.includes('Index')) {
        error('Database indexes are being built. Some features may be limited. Please wait a few minutes and refresh the page.')
      } else {
        error('Failed to load users: ' + result.error)
      }
      
      allUsers.value = []
    }
  } catch (error) {
    console.error('Error loading users:', error)
    
    // Check if it's a Firebase index error
    if (error.message && (error.message.includes('index') || error.message.includes('Index'))) {
      error('Database indexes are still being created. The system will work normally once they are ready. Please refresh in a few minutes.')
    } else {
      error('An error occurred while loading users. Please check your internet connection and try again.')
    }
    
    allUsers.value = []
  } finally {
    loading.value = false
  }
}


// Initialize component
onMounted(() => {
  loadUsers()
})

// Watch for filter changes
watch([selectedStatus, selectedRole, selectedOrgUnit, searchQuery], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.user-management-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.user-management-header {
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left, .header-right {
  flex: 1;
}

.header-center {
  flex: 2;
  text-align: center;
}

.back-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: #5a6268;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.add-user-button {
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

.add-user-button:hover {
  background: #0056b3;
}

.user-management-content {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.info-banner {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #2196f3;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.1);
}

.banner-icon {
  color: #2196f3;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.banner-content {
  flex: 1;
}

.banner-content strong {
  color: #1565c0;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: block;
}

.banner-content p {
  color: #424242;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.filters-panel {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-input-group {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
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
  top: 50%;
  transform: translateY(-50%);
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

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) auto;
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
}

.filter-button, .reset-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.filter-button {
  background: #007bff;
  color: white;
}

.filter-button:hover {
  background: #0056b3;
}

.reset-button {
  background: #6c757d;
  color: white;
}

.reset-button:hover {
  background: #5a6268;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.25rem;
  border-left: 4px solid #007bff;
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

.users-table-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.table-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.table-controls {
  display: flex;
  gap: 0.5rem;
}

.export-button, .refresh-button {
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

.export-button:hover, .refresh-button:hover {
  background: #f8f9fa;
}

.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
  white-space: nowrap;
}

.users-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.users-table th.sortable:hover {
  background: #e9ecef;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-icon {
  opacity: 0.5;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: top;
}

.user-row {
  transition: background-color 0.2s;
}

.user-row:hover {
  background: #f8f9fa;
}

.user-row.online {
  background: rgba(40, 167, 69, 0.05);
}

.user-name-cell {
  min-width: 250px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #28a745;
  border: 2px solid white;
  border-radius: 50%;
}

.name-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
}

.user-username {
  font-size: 0.8rem;
  color: #6c757d;
}

.email-link {
  color: #007bff;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #dc3545;
  color: white;
}

.role-badge.manager {
  background: #fd7e14;
  color: white;
}

.role-badge.user {
  background: #007bff;
  color: white;
}

.role-badge.viewer {
  background: #6c757d;
  color: white;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.active .status-dot {
  background: #28a745;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.inactive .status-dot {
  background: #dc3545;
}

.status-badge.suspended {
  background: #fff3cd;
  color: #856404;
}

.status-badge.suspended .status-dot {
  background: #ffc107;
}

.user-actions {
  min-width: 160px;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.action-button {
  background: none;
  border: 1px solid #ced4da;
  padding: 0.375rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.view-btn {
  color: #007bff;
  border-color: #007bff;
}

.view-btn:hover {
  background: #007bff;
  color: white;
}

.edit-btn {
  color: #28a745;
  border-color: #28a745;
}

.edit-btn:hover {
  background: #28a745;
  color: white;
}

.toggle-btn {
  color: #ffc107;
  border-color: #ffc107;
}

.toggle-btn:hover {
  background: #ffc107;
  color: #212529;
}

.delete-btn {
  color: #dc3545;
  border-color: #dc3545;
}

.delete-btn:hover {
  background: #dc3545;
  color: white;
}

.pagination-container {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.pagination-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-button {
  background: white;
  border: 1px solid #ced4da;
  padding: 0.5rem 0.75rem;
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

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  background: white;
  border: 1px solid #ced4da;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.page-number:hover {
  background: #f8f9fa;
}

.page-number.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.large-modal {
  max-width: 900px;
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

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
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

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.permission-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.permission-item:hover {
  background: #f8f9fa;
}

.permission-item input {
  margin: 0;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ced4da;
  border-radius: 0.25rem;
  position: relative;
  flex-shrink: 0;
}

.permission-item input:checked + .checkmark {
  background: #007bff;
  border-color: #007bff;
}

.permission-item input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.permission-info {
  flex: 1;
}

.permission-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.permission-description {
  font-size: 0.85rem;
  color: #6c757d;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 2rem;
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

.save-button {
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

.save-button:hover:not(:disabled) {
  background: #0056b3;
}

.save-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* User Details Modal */
.user-details-content {
  max-height: 60vh;
  overflow-y: auto;
}

.details-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item strong {
  color: #495057;
  font-size: 0.9rem;
}

.text-success {
  color: #28a745 !important;
}

.text-muted {
  color: #6c757d !important;
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
  .user-management-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .header-left, .header-center, .header-right {
    flex: none;
    width: 100%;
  }

  .header-center {
    text-align: left;
  }

  .user-management-content {
    padding: 1rem;
  }

  .filter-controls {
    grid-template-columns: 1fr;
  }

  .user-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .users-table {
    font-size: 0.8rem;
  }

  .user-name-cell {
    min-width: 200px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .permissions-grid {
    grid-template-columns: 1fr;
  }

  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>