<template>
  <div class="dhis2-user-app">
    <TopHeader />
    
    <div class="app-container">
      <!-- Left Sidebar - Filters -->
      <aside class="filter-sidebar">
        <div class="sidebar-header">
          <h3>Search & Filter</h3>
        </div>
        
        <div class="filter-content">
          <!-- Search -->
          <div class="filter-group">
            <label>Search</label>
            <div class="search-input-wrapper">
              <input 
                type="text" 
                v-model="searchQuery" 
                @input="performSearch"
                placeholder="Search by name, username, email..." 
                class="dhis2-input"
              />
              <i class="fas fa-search search-icon"></i>
            </div>
          </div>

          <!-- Role Filter -->
          <div class="filter-group">
            <label>User Role</label>
            <select v-model="selectedRole" @change="applyFilters" class="dhis2-select">
              <option value="">All roles</option>
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <!-- Org Unit Filter -->
          <div class="filter-group">
            <label>Organisation Unit</label>
            <select v-model="selectedOrgUnit" @change="applyFilters" class="dhis2-select">
              <option value="">All units</option>
              <option value="Main Center">Main Center</option>
              <option value="Outreach - Lusaka">Outreach - Lusaka</option>
              <option value="Outreach - Chongwe">Outreach - Chongwe</option>
              <option value="Education Unit">Education Unit</option>
              <option value="Health Unit">Health Unit</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div class="filter-group">
            <label>Status</label>
            <select v-model="selectedStatus" @change="applyFilters" class="dhis2-select">
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div class="filter-actions">
            <button @click="resetFilters" class="dhis2-btn secondary full-width">
              Clear Filters
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content - User List -->
      <main class="main-content">
        <div class="content-header">
          <h1 class="page-title">User management</h1>
          <div class="header-actions">
            <button @click="exportUsers" class="dhis2-btn secondary icon-btn" title="Export Users">
              <i class="fas fa-download"></i>
            </button>
            <button @click="refreshUsers" class="dhis2-btn secondary icon-btn" title="Refresh List">
              <i class="fas fa-sync"></i>
            </button>
            <button @click="showAddUserModal = true" class="dhis2-btn primary">
              <i class="fas fa-plus"></i> Add user
            </button>
          </div>
        </div>

        <div class="user-list-container">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading users...</p>
          </div>

          <div v-else-if="filteredUsers.length === 0" class="empty-state">
            <i class="fas fa-users"></i>
            <p>No users found matching your criteria.</p>
          </div>

          <table v-else class="dhis2-table">
            <thead>
              <tr>
                <th @click="sortBy('name')" class="sortable">
                  Display name <i class="fas fa-sort"></i>
                </th>
                <th @click="sortBy('username')" class="sortable">
                  Username <i class="fas fa-sort"></i>
                </th>
                <th @click="sortBy('email')" class="sortable">
                  Email <i class="fas fa-sort"></i>
                </th>
                <th>Role</th>
                <th>Organisation unit</th>
                <th>Last login</th>
                <th>Status</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ formatRole(user.role) }}</td>
                <td>{{ user.orgUnit }}</td>
                <td>{{ formatDate(user.lastLogin) }}</td>
                <td>
                  <span class="status-badge" :class="user.status">
                    {{ formatStatus(user.status) }}
                  </span>
                </td>
                <td class="actions-col">
                  <div class="action-buttons">
                    <button @click="editUser(user)" class="icon-btn small" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="viewUser(user)" class="icon-btn small" title="View Details">
                      <i class="fas fa-info-circle"></i>
                    </button>
                    <button @click="toggleUserStatus(user)" class="icon-btn small" :title="user.status === 'active' ? 'Deactivate' : 'Activate'">
                      <i class="fas" :class="user.status === 'active' ? 'fa-ban' : 'fa-check'"></i>
                    </button>
                    <button @click="deleteUser(user)" class="icon-btn small danger" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-bar" v-if="totalPages > 1">
          <div class="pagination-info">
            Showing {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredUsers.length) }} of {{ filteredUsers.length }}
          </div>
          <div class="pagination-controls">
            <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="page-current">Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddUserModal || showEditUserModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ showAddUserModal ? "Create new user" : "Edit user" }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveUser">
            <div class="form-section">
              <h4>Details</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Username *</label>
                  <input v-model="userForm.username" type="text" class="dhis2-input" required />
                </div>
                <div class="form-group">
                  <label>Full Name *</label>
                  <input v-model="userForm.name" type="text" class="dhis2-input" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Email *</label>
                  <input v-model="userForm.email" type="email" class="dhis2-input" required />
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input v-model="userForm.phone" type="tel" class="dhis2-input" />
                </div>
              </div>
              <div class="form-row" v-if="showAddUserModal">
                <div class="form-group">
                  <label>Password *</label>
                  <input v-model="userForm.password" type="password" class="dhis2-input" required minlength="8" />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>Access & Organisation</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Role *</label>
                  <select v-model="userForm.role" class="dhis2-select" required>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Organisation Unit *</label>
                  <select v-model="userForm.orgUnit" class="dhis2-select" required>
                    <option value="Main Center">Main Center</option>
                    <option value="Outreach - Lusaka">Outreach - Lusaka</option>
                    <option value="Outreach - Chongwe">Outreach - Chongwe</option>
                    <option value="Education Unit">Education Unit</option>
                    <option value="Health Unit">Health Unit</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select v-model="userForm.status" class="dhis2-select">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="dhis2-btn secondary">Cancel</button>
              <button type="submit" class="dhis2-btn primary" :disabled="userLoading">
                {{ userLoading ? "Saving..." : "Save" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showUserDetailsModal" class="modal-overlay" @click.self="showUserDetailsModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>User Details</h3>
          <button @click="showUserDetailsModal = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedUser">
          <div class="detail-row">
            <label>Name:</label>
            <span>{{ selectedUser.name }}</span>
          </div>
          <div class="detail-row">
            <label>Username:</label>
            <span>{{ selectedUser.username }}</span>
          </div>
          <div class="detail-row">
            <label>Email:</label>
            <span>{{ selectedUser.email }}</span>
          </div>
          <div class="detail-row">
            <label>Role:</label>
            <span>{{ formatRole(selectedUser.role) }}</span>
          </div>
          <div class="detail-row">
            <label>Organisation Unit:</label>
            <span>{{ selectedUser.orgUnit }}</span>
          </div>
          <div class="detail-row">
            <label>Last Login:</label>
            <span>{{ formatDate(selectedUser.lastLogin) }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showUserDetailsModal = false" class="dhis2-btn secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import TopHeader from "./TopHeader.vue";
import { useToast } from "../composables/useToast.js";
import UserService from "../services/userService.js";

const router = useRouter();
const { success, error, confirm } = useToast();

// State
const loading = ref(false);
const userLoading = ref(false);
const searchQuery = ref("");
const selectedStatus = ref("");
const selectedRole = ref("");
const selectedOrgUnit = ref("");
const sortField = ref("name");
const sortOrder = ref("asc");
const currentPage = ref(1);
const pageSize = ref(10);

// Modals
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const showUserDetailsModal = ref(false);
const selectedUser = ref(null);

// Data
const allUsers = ref([]);
const userForm = ref({
  name: "",
  username: "",
  email: "",
  phone: "",
  role: "user",
  orgUnit: "",
  status: "active",
  password: "",
  permissions: [],
});

// Computed
const filteredUsers = computed(() => {
  let filtered = allUsers.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((user) => user.status === selectedStatus.value);
  }

  if (selectedRole.value) {
    filtered = filtered.filter((user) => user.role === selectedRole.value);
  }

  if (selectedOrgUnit.value) {
    filtered = filtered.filter((user) => user.orgUnit === selectedOrgUnit.value);
  }

  filtered.sort((a, b) => {
    const aVal = a[sortField.value] || '';
    const bVal = b[sortField.value] || '';
    return sortOrder.value === "asc" 
      ? aVal.toString().localeCompare(bVal.toString())
      : bVal.toString().localeCompare(aVal.toString());
  });

  return filtered;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value));

// Methods
const loadUsers = async () => {
  loading.value = true;
  try {
    const result = await UserService.getAllUsers();
    if (result.success) {
      allUsers.value = result.users || [];
    } else {
      error("Failed to load users: " + result.error);
    }
  } catch (err) {
    console.error(err);
    error("An error occurred while loading users");
  } finally {
    loading.value = false;
  }
};

const performSearch = () => { currentPage.value = 1; };
const applyFilters = () => { currentPage.value = 1; };
const resetFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = "";
  selectedRole.value = "";
  selectedOrgUnit.value = "";
  currentPage.value = 1;
};

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

const formatRole = (role) => {
  const map = { admin: "Administrator", manager: "Manager", user: "User", viewer: "Viewer" };
  return map[role] || role;
};

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (date) => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString();
};

const viewUser = (user) => {
  selectedUser.value = user;
  showUserDetailsModal.value = true;
};

const editUser = (user) => {
  selectedUser.value = user;
  userForm.value = { ...user, password: "" };
  showEditUserModal.value = true;
};

const deleteUser = async (user) => {
  if (await confirm(`Are you sure you want to delete ${user.name}?`)) {
    try {
      const result = await UserService.deleteUser(user.id);
      if (result.success) {
        allUsers.value = allUsers.value.filter(u => u.id !== user.id);
        success("User deleted successfully");
      } else {
        error("Failed to delete user: " + result.error);
      }
    } catch (err) {
      error("Error deleting user");
    }
  }
};

const toggleUserStatus = async (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active';
  try {
    const result = await UserService.updateUserStatus(user.id, newStatus);
    if (result.success) {
      user.status = newStatus;
      success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } else {
      error("Failed to update status");
    }
  } catch (err) {
    error("Error updating status");
  }
};

const saveUser = async () => {
  userLoading.value = true;
  try {
    if (showAddUserModal.value) {
      const result = await UserService.addUser(userForm.value);
      if (result.success) {
        success("User created successfully");
        loadUsers();
        closeModal();
      } else {
        error("Failed to create user: " + result.error);
      }
    } else {
      const result = await UserService.updateUser(selectedUser.value.id, userForm.value);
      if (result.success) {
        success("User updated successfully");
        loadUsers();
        closeModal();
      } else {
        error("Failed to update user: " + result.error);
      }
    }
  } catch (err) {
    error("Error saving user");
  } finally {
    userLoading.value = false;
  }
};

const closeModal = () => {
  showAddUserModal.value = false;
  showEditUserModal.value = false;
  showUserDetailsModal.value = false;
  selectedUser.value = null;
  userForm.value = {
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "user",
    orgUnit: "",
    status: "active",
    password: "",
    permissions: [],
  };
};

const exportUsers = async () => {
  const result = await UserService.exportUsers('csv');
  if (result.success) {
    const blob = new Blob([result.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    success("Users exported");
  } else {
    error("Export failed");
  }
};

const refreshUsers = () => {
  loadUsers();
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.dhis2-user-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f5f7;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  color: #212121;
}

.app-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.filter-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #616161;
  font-weight: 500;
}

.filter-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: #494949;
  font-weight: 500;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #757575;
  font-size: 0.9rem;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  color: #212121;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.user-list-container {
  flex: 1;
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 3px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.dhis2-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.dhis2-table th,
.dhis2-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.dhis2-table th {
  background: #f8f9fa;
  font-weight: 500;
  color: #494949;
  position: sticky;
  top: 0;
  z-index: 1;
}

.dhis2-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.dhis2-table th.sortable:hover {
  background: #f0f0f0;
}

.dhis2-table tr:hover {
  background: #f5f9fc;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background: #f5f5f5;
  color: #757575;
}

.status-badge.suspended {
  background: #ffebee;
  color: #c62828;
}

.actions-col {
  width: 140px;
  text-align: right;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

/* Pagination */
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-top: 1px solid #d5d5d5;
}

.pagination-info {
  font-size: 0.85rem;
  color: #757575;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  background: white;
  border: 1px solid #d5d5d5;
  padding: 4px 12px;
  border-radius: 3px;
  cursor: pointer;
  color: #494949;
}

.page-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-current {
  font-size: 0.85rem;
  color: #494949;
}

/* Common Components */
.dhis2-input,
.dhis2-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  font-size: 0.9rem;
  outline: none;
  background: white;
}

.dhis2-input:focus,
.dhis2-select:focus {
  border-color: #2b6693;
  box-shadow: 0 0 0 2px rgba(43, 102, 147, 0.1);
}

.dhis2-btn {
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 3px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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

.dhis2-btn.primary:disabled {
  background: #a0a0a0;
  cursor: not-allowed;
}

.dhis2-btn.secondary {
  background: white;
  color: #494949;
  border: 1px solid #d5d5d5;
}

.dhis2-btn.secondary:hover {
  background: #f5f5f5;
}

.dhis2-btn.full-width {
  width: 100%;
}

.icon-btn {
  width: 36px;
  padding: 0;
}

.icon-btn.small {
  width: 28px;
  height: 28px;
  font-size: 0.8rem;
  background: transparent;
  border: none;
  color: #757575;
}

.icon-btn.small:hover {
  background: #e0e0e0;
  color: #212121;
}

.icon-btn.small.danger:hover {
  background: #ffebee;
  color: #c62828;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2b6693;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #757575;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section h4 {
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  color: #616161;
  text-transform: uppercase;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
  margin-bottom: 16px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.detail-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row label {
  width: 150px;
  font-weight: 500;
  color: #616161;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #757575;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #d5d5d5;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2b6693;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .filter-sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #d5d5d5;
    display: none; /* Hidden by default on mobile to save space */
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .dhis2-btn {
    flex: 1;
  }

  .user-list-container {
    overflow-x: auto;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .modal-card {
    width: 95%;
    max-height: 90vh;
  }
  
  .pagination-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .pagination-controls {
    justify-content: center;
  }
}
</style>
