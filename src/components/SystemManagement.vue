<template>
  <div class="system-management">
    <!-- Header -->
    <div class="system-header">
      <div class="header-content">
        <div class="header-left">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>
        <div class="header-center">
          <h1><i class="fas fa-tools"></i> System Management</h1>
          <p class="subtitle">Complete system administration and control</p>
        </div>
        <div class="header-right">
          <span class="admin-badge">
            <i class="fas fa-shield-alt"></i> Administrator
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon users">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>{{ totalUsers }}</h3>
          <p>Total Users</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon forms">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="stat-info">
          <h3>{{ totalForms }}</h3>
          <p>Total Forms</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon children">
          <i class="fas fa-child"></i>
        </div>
        <div class="stat-info">
          <h3>{{ totalChildren }}</h3>
          <p>Children Tracked</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon storage">
          <i class="fas fa-database"></i>
        </div>
        <div class="stat-info">
          <h3>{{ storageUsed }}</h3>
          <p>Storage Used</p>
        </div>
      </div>
    </div>

    <!-- Management Sections -->
    <div class="management-grid">
      <!-- User Management -->
      <div class="management-card">
        <div class="card-header">
          <h2><i class="fas fa-users-cog"></i> User Management</h2>
        </div>
        <div class="card-body">
          <p>Manage system users, roles, and permissions</p>
          <button @click="activeSection = 'users'" class="action-btn primary">
            <i class="fas fa-user-plus"></i> Manage Users
          </button>
        </div>
      </div>

      <!-- System Settings -->
      <div class="management-card">
        <div class="card-header">
          <h2><i class="fas fa-cog"></i> System Settings</h2>
        </div>
        <div class="card-body">
          <p>Configure system preferences and options</p>
          <button @click="activeSection = 'settings'" class="action-btn primary">
            <i class="fas fa-sliders-h"></i> Configure Settings
          </button>
        </div>
      </div>

      <!-- Database Management -->
      <div class="management-card">
        <div class="card-header">
          <h2><i class="fas fa-database"></i> Database Management</h2>
        </div>
        <div class="card-body">
          <p>Backup, restore, and manage database</p>
          <button @click="activeSection = 'database'" class="action-btn primary">
            <i class="fas fa-server"></i> Manage Database
          </button>
        </div>
      </div>

      <!-- System Logs -->
      <div class="management-card">
        <div class="card-header">
          <h2><i class="fas fa-list-alt"></i> System Logs</h2>
        </div>
        <div class="card-body">
          <p>View system activity and audit trails</p>
          <button @click="activeSection = 'logs'" class="action-btn primary">
            <i class="fas fa-eye"></i> View Logs
          </button>
        </div>
      </div>

      <!-- Security & Permissions -->
      <div class="management-card">
        <div class="card-header">
          <h2><i class="fas fa-lock"></i> Security</h2>
        </div>
        <div class="card-body">
          <p>Manage security settings and permissions</p>
          <button @click="activeSection = 'security'" class="action-btn primary">
            <i class="fas fa-shield-alt"></i> Security Settings
          </button>
        </div>
      </div>

      <!-- Reports & Analytics -->
      <div class="management-card">
        <div class="card-header">
          <h2><i class="fas fa-chart-line"></i> Analytics</h2>
        </div>
        <div class="card-body">
          <p>System performance and usage analytics</p>
          <button @click="activeSection = 'analytics'" class="action-btn primary">
            <i class="fas fa-chart-bar"></i> View Analytics
          </button>
        </div>
      </div>
    </div>

    <!-- Active Section Modal/Panel -->
    <div v-if="activeSection" class="section-modal" @click.self="activeSection = null">
      <div class="modal-content-large">
        <div class="modal-header">
          <h2>{{ getSectionTitle() }}</h2>
          <button @click="activeSection = null" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- User Management Section -->
          <div v-if="activeSection === 'users'" class="section-content">
            <div class="section-toolbar">
              <button @click="showAddUserModal = true; editingUser = null" class="btn-success">
                <i class="fas fa-user-plus"></i> Add New User
              </button>
            </div>

            <!-- Add/Edit User Form Modal -->
            <div v-if="showAddUserModal" class="user-form-modal">
              <h3>{{ editingUser ? 'Edit User' : 'Add New User' }}</h3>
              <div class="form-grid">
                <div class="form-field">
                  <label>Full Name *</label>
                  <input v-model="newUserForm.fullName" type="text" required>
                </div>
                <div class="form-field">
                  <label>Email *</label>
                  <input v-model="newUserForm.email" type="email" required>
                </div>
                <div class="form-field">
                  <label>{{ editingUser ? 'New Password (leave blank to keep current)' : 'Password *' }}</label>
                  <input v-model="newUserForm.password" type="password" :required="!editingUser">
                </div>
                <div class="form-field">
                  <label>Phone Number</label>
                  <input v-model="newUserForm.phoneNumber" type="tel">
                </div>
                <div class="form-field">
                  <label>Role *</label>
                  <select v-model="newUserForm.role">
                    <option value="admin">Administrator</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div class="form-field">
                  <label>Organization</label>
                  <input v-model="newUserForm.organization" type="text">
                </div>
              </div>
              <div class="form-actions">
                <button @click="editingUser ? updateUser() : addUser()" class="btn-primary" :disabled="isLoading">
                  {{ isLoading ? 'Saving...' : (editingUser ? 'Update User' : 'Add User') }}
                </button>
                <button @click="showAddUserModal = false; editingUser = null" class="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>

            <div v-if="isLoading" class="loading">Loading users...</div>
            <div v-else class="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Organization</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.fullName }}</td>
                    <td>{{ user.email }}</td>
                    <td><span class="role-badge" :class="user.role">{{ user.role || 'user' }}</span></td>
                    <td>{{ user.organization || 'N/A' }}</td>
                    <td><span class="status-badge" :class="user.status || 'active'">{{ user.status || 'active' }}</span></td>
                    <td>{{ formatDate(user.lastLogin) }}</td>
                    <td class="actions">
                      <button @click="editUser(user)" class="btn-icon edit" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteUser(user)" class="btn-icon delete" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- System Settings Section -->
          <div v-if="activeSection === 'settings'" class="section-content">
            <div class="settings-grid">
              <div class="setting-group">
                <h3><i class="fas fa-cog"></i> General Settings</h3>
                <div class="setting-item">
                  <label>System Name</label>
                  <input type="text" v-model="settings.systemName" class="form-input">
                </div>
                <div class="setting-item">
                  <label>System Email</label>
                  <input type="email" v-model="settings.systemEmail" class="form-input">
                </div>
              </div>
              
              <div class="setting-group">
                <h3><i class="fas fa-database"></i> Data Management</h3>
                <div class="setting-item">
                  <label>Keep logs for (days)</label>
                  <input type="number" v-model.number="settings.logRetention" class="form-input" min="1" max="365">
                  <small>Logs older than this will be removed during cleanup</small>
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="settings.autoBackup">
                    Enable automatic daily backups
                  </label>
                </div>
              </div>
              
              <div class="setting-group">
                <h3><i class="fas fa-wrench"></i> System Maintenance</h3>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="settings.maintenanceMode">
                    Maintenance Mode (restricts access)
                  </label>
                </div>
              </div>
              
              <button @click="saveSettings" class="btn-success" :disabled="isLoading">
                <i class="fas fa-save"></i> Save Settings
              </button>
            </div>
          </div>

          <!-- Database Management Section -->
          <div v-if="activeSection === 'database'" class="section-content">
            <div class="database-actions">
              <div class="action-card">
                <h3><i class="fas fa-download"></i> Backup Database</h3>
                <p>Create a complete backup of all system data</p>
                <button @click="backupDatabase" class="btn-primary">Create Backup</button>
              </div>
              <div class="action-card">
                <h3><i class="fas fa-upload"></i> Restore Database</h3>
                <p>Restore data from a previous backup</p>
                <button @click="restoreDatabase" class="btn-warning">Restore Backup</button>
              </div>
              <div class="action-card">
                <h3><i class="fas fa-broom"></i> Clean Old Data</h3>
                <p>Remove old logs and temporary data</p>
                <button @click="cleanDatabase" class="btn-danger">Clean Data</button>
              </div>
            </div>
          </div>

          <!-- System Logs Section -->
          <div v-if="activeSection === 'logs'" class="section-content">
            <div class="logs-container">
              <div class="log-filters">
                <select v-model="logFilter" class="form-select">
                  <option value="all">All Logs</option>
                  <option value="user">User Activity</option>
                  <option value="system">System Events</option>
                  <option value="error">Errors</option>
                </select>
              </div>
              <div class="logs-list">
                <div v-for="log in filteredLogs" :key="log.id" class="log-item" :class="log.type">
                  <div class="log-time">{{ formatDateTime(log.timestamp) }}</div>
                  <div class="log-message">{{ log.message }}</div>
                  <div class="log-user">{{ log.user }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Section -->
          <div v-if="activeSection === 'security'" class="section-content">
            <div class="security-settings">
              <div class="setting-group">
                <h3><i class="fas fa-key"></i> Password Policy</h3>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.requireStrongPassword">
                    Require strong passwords (min 8 characters, uppercase, lowercase, numbers)
                  </label>
                </div>
              </div>

              <div class="setting-group">
                <h3><i class="fas fa-shield-alt"></i> Authentication</h3>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.enableTwoFactor">
                    Enable two-factor authentication (2FA)
                  </label>
                </div>
                <div class="setting-item">
                  <label>Maximum login attempts before lockout</label>
                  <input type="number" v-model.number="security.maxLoginAttempts" class="form-input" min="3" max="10">
                </div>
              </div>

              <div class="setting-group">
                <h3><i class="fas fa-clock"></i> Session Management</h3>
                <div class="setting-item">
                  <label>Session timeout (minutes)</label>
                  <input type="number" v-model.number="security.sessionTimeout" class="form-input" min="5" max="120">
                  <small>Users will be logged out after this period of inactivity</small>
                </div>
              </div>
              
              <button @click="saveSecuritySettings" class="btn-success" :disabled="isLoading">
                <i class="fas fa-save"></i> Save Security Settings
              </button>
            </div>
          </div>

          <!-- Analytics Section -->
          <div v-if="activeSection === 'analytics'" class="section-content">
            <div class="analytics-dashboard">
              <div class="chart-card">
                <h3>User Activity (Last 30 Days)</h3>
                <p>Chart placeholder - Integration needed</p>
              </div>
              <div class="chart-card">
                <h3>Form Submissions</h3>
                <p>Chart placeholder - Integration needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast.js';
import AuthService from '../services/auth.js';
import UserService from '../services/userService.js';
import FormService from '../services/formService.js';
import TrackerService from '../services/trackerService.js';
import { db } from '../firebase/config.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const router = useRouter();
const { success, error, confirm } = useToast();

// Stats
const totalUsers = ref(0);
const totalForms = ref(0);
const totalChildren = ref(0);
const storageUsed = ref('0 MB');

// Active section
const activeSection = ref(null);

// Users data
const users = ref([]);
const showAddUserModal = ref(false);
const newUserForm = ref({
  fullName: '',
  email: '',
  password: '',
  phoneNumber: '',
  role: 'user',
  organization: '',
  status: 'active'
});
const editingUser = ref(null);

// Settings
const settings = ref({
  systemName: 'The Kukhoma Project',
  systemEmail: 'admin@kukhoma.org',
  logRetention: 90,
  autoBackup: false,
  maintenanceMode: false
});

// Security settings
const security = ref({
  requireStrongPassword: true,
  enableTwoFactor: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5
});

// Logs
const logs = ref([]);
const logFilter = ref('all');

// Loading states
const isLoading = ref(false);

const filteredLogs = computed(() => {
  if (logFilter.value === 'all') return logs.value;
  return logs.value.filter(log => log.type === logFilter.value);
});

// Methods
const goBack = () => {
  router.push('/dashboard');
};

const getSectionTitle = () => {
  const titles = {
    users: 'User Management',
    settings: 'System Settings',
    database: 'Database Management',
    logs: 'System Logs',
    security: 'Security Settings',
    analytics: 'System Analytics'
  };
  return titles[activeSection.value] || '';
};

const formatDate = (date) => {
  if (!date) return 'Never';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString();
};

const formatDateTime = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleString();
};

const loadUsers = async () => {
  isLoading.value = true;
  try {
    const result = await UserService.getAllUsers();
    if (result.success) {
      users.value = result.users || [];
      totalUsers.value = users.value.length;
    }
  } catch (error) {
    console.error('Error loading users:', error);
    alert('Failed to load users: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const loadStats = async () => {
  try {
    // Load all forms count
    const formsResult = await FormService.getForms(null, 10000);
    if (formsResult.success) {
      totalForms.value = formsResult.forms.length;
      
      // Calculate unique children from all forms
      const uniqueChildren = new Set();
      formsResult.forms.forEach(form => {
        if (form.childName) uniqueChildren.add(form.childName);
        if (form.firstName && form.lastName) {
          uniqueChildren.add(`${form.firstName} ${form.lastName}`);
        }
      });
      totalChildren.value = uniqueChildren.size;
      
      // Calculate storage (rough estimate)
      const storageBytes = JSON.stringify(formsResult.forms).length;
      const storageMB = (storageBytes / (1024 * 1024)).toFixed(2);
      storageUsed.value = `${storageMB} MB`;
    }

    // Try to get tracker entries for more accurate children count
    try {
      const trackerResult = await TrackerService.getAllTrackedEntities();
      if (trackerResult.success && trackerResult.entities) {
        const trackerChildren = trackerResult.entities.filter(e => e.type === 'child');
        if (trackerChildren.length > totalChildren.value) {
          totalChildren.value = trackerChildren.length;
        }
      }
    } catch (err) {
      console.log('Tracker data not available');
    }
  } catch (err) {
    console.error('Error loading stats:', err);
    error('Failed to load system statistics');
  }
};

const loadSystemLogs = async () => {
  isLoading.value = true;
  try {
    // Get user activity logs
    const usersResult = await UserService.getAllUsers();
    if (usersResult.success) {
      const userLogs = usersResult.users.map(user => ({
        id: user.id,
        type: 'user',
        timestamp: user.lastLogin || user.createdAt,
        message: `User ${user.fullName} ${user.lastLogin ? 'logged in' : 'was created'}`,
        user: user.fullName
      }));
      
      logs.value = userLogs.sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return timeB - timeA;
      });
    }
  } catch (error) {
    console.error('Error loading logs:', error);
  } finally {
    isLoading.value = false;
  }
};

const addUser = async () => {
  if (!newUserForm.value.fullName || !newUserForm.value.email || !newUserForm.value.password) {
    error('Please fill in all required fields');
    return;
  }
  
  if (newUserForm.value.password.length < 6) {
    error('Password must be at least 6 characters long');
    return;
  }
  
  isLoading.value = true;
  try {
    const result = await UserService.addUser(newUserForm.value);
    if (result.success) {
      success(`User ${newUserForm.value.fullName} added successfully!`);
      showAddUserModal.value = false;
      newUserForm.value = {
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'user',
        organization: '',
        status: 'active'
      };
      await loadUsers();
      await loadSystemLogs(); // Refresh logs
    } else {
      error('Failed to add user: ' + result.error);
    }
  } catch (err) {
    console.error('Error adding user:', err);
    error('Error adding user: ' + err.message);
  } finally {
    isLoading.value = false;
  }
};

const editUser = (user) => {
  editingUser.value = { ...user };
  showAddUserModal.value = true;
  newUserForm.value = {
    fullName: user.fullName,
    email: user.email,
    password: '',
    phoneNumber: user.phoneNumber,
    role: user.role || 'user',
    organization: user.organization || '',
    status: user.status || 'active'
  };
};

const updateUser = async () => {
  if (!editingUser.value) return;
  
  isLoading.value = true;
  try {
    const result = await UserService.updateUser(editingUser.value.uid, newUserForm.value);
    if (result.success) {
      alert('User updated successfully!');
      showAddUserModal.value = false;
      editingUser.value = null;
      await loadUsers();
    } else {
      alert('Failed to update user: ' + result.error);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Error updating user: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const deleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete ${user.fullName}? This action cannot be undone.`)) {
    return;
  }
  
  isLoading.value = true;
  try {
    const result = await UserService.deleteUser(user.uid);
    if (result.success) {
      alert('User deleted successfully!');
      await loadUsers();
    } else {
      alert('Failed to delete user: ' + result.error);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Error deleting user: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const backupDatabase = async () => {
  isLoading.value = true;
  try {
    // Get all forms
    const formsResult = await FormService.getForms(null, 10000);
    if (formsResult.success) {
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          forms: formsResult.forms,
          users: users.value,
          settings: settings.value,
          security: security.value
        }
      };
      
      // Create and download backup file
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tkp-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Database backup created successfully!');
    }
  } catch (error) {
    console.error('Error creating backup:', error);
    alert('Error creating backup: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const restoreDatabase = () => {
  if (!confirm('Restoring from backup will overwrite current data. Are you sure?')) {
    return;
  }
  
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    isLoading.value = true;
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      
      // Validate backup structure
      if (!backup.data || !backup.timestamp) {
        throw new Error('Invalid backup file format');
      }
      
      // Restore settings
      if (backup.data.settings) {
        settings.value = backup.data.settings;
        localStorage.setItem('tkp_system_settings', JSON.stringify(backup.data.settings));
      }
      
      if (backup.data.security) {
        security.value = backup.data.security;
        localStorage.setItem('tkp_security_settings', JSON.stringify(backup.data.security));
      }
      
      alert(`Database restored successfully from backup created on ${new Date(backup.timestamp).toLocaleString()}`);
      await loadStats();
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Error restoring backup: ' + error.message);
    } finally {
      isLoading.value = false;
    }
  };
  input.click();
};

const cleanDatabase = async () => {
  if (!confirm('This will remove old logs and temporary data. Are you sure?')) {
    return;
  }
  
  isLoading.value = true;
  try {
    // Clear old logs (older than retention period)
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - settings.value.logRetention);
    
    logs.value = logs.value.filter(log => {
      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
      return logDate >= retentionDate;
    });
    
    // Clear session storage
    sessionStorage.clear();
    
    alert(`Database cleaned successfully! Removed logs older than ${settings.value.logRetention} days.`);
  } catch (error) {
    console.error('Error cleaning database:', error);
    alert('Error cleaning database: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const saveSettings = () => {
  try {
    localStorage.setItem('tkp_system_settings', JSON.stringify(settings.value));
    alert('System settings saved successfully!');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Error saving settings: ' + error.message);
  }
};

const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('tkp_system_settings');
    if (savedSettings) {
      settings.value = { ...settings.value, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
};

const saveSecuritySettings = () => {
  try {
    localStorage.setItem('tkp_security_settings', JSON.stringify(security.value));
    alert('Security settings saved successfully!');
  } catch (error) {
    console.error('Error saving security settings:', error);
    alert('Error saving security settings: ' + error.message);
  }
};

const loadSecuritySettings = () => {
  try {
    const savedSecurity = localStorage.getItem('tkp_security_settings');
    if (savedSecurity) {
      security.value = { ...security.value, ...JSON.parse(savedSecurity) };
    }
  } catch (error) {
    console.error('Error loading security settings:', error);
  }
};

// Check access on mount
onMounted(async () => {
  const currentUser = AuthService.getCurrentUser();
  
  // Only allow access to davidchileshe33@gmail.com
  if (!currentUser || currentUser.email !== 'davidchileshe33@gmail.com') {
    alert('Access Denied: This page is only accessible to the system administrator.');
    router.push('/dashboard');
    return;
  }

  // Load saved settings
  loadSettings();
  loadSecuritySettings();

  // Load data
  await loadUsers();
  await loadStats();
  await loadSystemLogs();
});
</script>

<style scoped>
.system-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 2rem;
}

.system-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-center {
  text-align: center;
  flex: 1;
}

.header-center h1 {
  margin: 0;
  color: #4a148c;
  font-size: 2rem;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-size: 0.95rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #5a6268;
}

.admin-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.quick-stats {
  max-width: 1400px;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.forms {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.children {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.storage {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.stat-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.management-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem;
}

.management-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.management-card:hover {
  transform: translateY(-5px);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.card-body {
  padding: 1.5rem;
}

.card-body p {
  color: #666;
  margin: 0 0 1rem 0;
}

.action-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
}

.action-btn.primary {
  background: #4a148c;
  color: white;
}

.action-btn.primary:hover {
  background: #6a1b9a;
}

.section-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content-large {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #4a148c;
}

.role-badge,
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.role-badge.admin {
  background: #667eea;
  color: white;
}

.status-badge.active {
  background: #28a745;
  color: white;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.25rem;
}

.btn-icon.edit {
  background: #ffc107;
  color: white;
}

.btn-icon.delete {
  background: #dc3545;
  color: white;
}

/* User Form Modal */
.user-form-modal {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 2px solid #667eea;
}

.user-form-modal h3 {
  margin: 0 0 1.5rem 0;
  color: #4a148c;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-field input,
.form-field select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-field input:focus,
.form-field select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-success {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.btn-success:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-warning {
  padding: 0.75rem 1.5rem;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-warning:hover {
  background: #e0a800;
  transform: translateY(-2px);
}

.btn-danger {
  padding: 0.75rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

/* Settings */
.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-group {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.setting-group h3 {
  margin: 0 0 1rem 0;
  color: #4a148c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-item {
  margin-bottom: 1rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.setting-item input[type="checkbox"] {
  margin-right: 0.5rem;
}

.setting-item small {
  display: block;
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
}

/* Database Actions */
.database-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  text-align: center;
  transition: all 0.3s;
}

.action-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.action-card h3 {
  margin: 0 0 1rem 0;
  color: #4a148c;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-card p {
  color: #666;
  margin: 0 0 1.5rem 0;
}

/* Logs */
.logs-container {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
}

.log-filters {
  margin-bottom: 1rem;
}

.logs-list {
  max-height: 500px;
  overflow-y: auto;
}

.log-item {
  padding: 1rem;
  border-left: 4px solid #667eea;
  background: #f8f9fa;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
}

.log-item.error {
  border-left-color: #dc3545;
  background: #fff5f5;
}

.log-item.user {
  border-left-color: #28a745;
}

.log-item.system {
  border-left-color: #ffc107;
}

.log-time {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
}

.log-message {
  color: #333;
}

.log-user {
  font-size: 0.85rem;
  color: #667eea;
  font-weight: 600;
}

/* Security Settings */
.security-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Analytics */
.analytics-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  color: #4a148c;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

/* Section Toolbar */
.section-toolbar {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .database-actions {
    grid-template-columns: 1fr;
  }

  .analytics-dashboard {
    grid-template-columns: 1fr;
  }

  .log-item {
    grid-template-columns: 1fr;
  }
}
</style>
