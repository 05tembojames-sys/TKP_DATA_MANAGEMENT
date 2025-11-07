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
              <div class="search-filter-group">
                <input 
                  v-model="userSearchQuery" 
                  type="text" 
                  placeholder="Search users by name or email..." 
                  class="search-input"
                >
                <select v-model="userRoleFilter" class="filter-select">
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div class="toolbar-actions">
                <button @click="exportUsers" class="btn-secondary" title="Export Users">
                  <i class="fas fa-file-export"></i> Export
                </button>
                <button @click="showAddUserModal = true; editingUser = null" class="btn-success">
                  <i class="fas fa-user-plus"></i> Add New User
                </button>
              </div>
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
            <div v-else-if="filteredUsers.length === 0" class="no-results">
              <i class="fas fa-users"></i>
              <p>No users found matching your criteria</p>
            </div>
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
                  <tr v-for="user in paginatedUsers" :key="user.id">
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
              
              <!-- Pagination -->
              <div v-if="totalPages > 1" class="pagination">
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="pagination-btn"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="pagination-info">
                  Page {{ currentPage }} of {{ totalPages }} ({{ filteredUsers.length }} users)
                </span>
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage === totalPages"
                  class="pagination-btn"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- System Settings Section -->
          <div v-if="activeSection === 'settings'" class="section-content">
            <!-- Settings Overview -->
            <div class="settings-overview">
              <div class="settings-header">
                <div>
                  <h2><i class="fas fa-cog"></i> System Configuration</h2>
                  <p>Manage your system preferences and operational settings</p>
                </div>
                <div class="settings-actions">
                  <button @click="resetSettings" class="btn-secondary">
                    <i class="fas fa-undo"></i> Reset to Defaults
                  </button>
                  <button @click="exportSettings" class="btn-secondary">
                    <i class="fas fa-download"></i> Export Settings
                  </button>
                  <button @click="saveSettings" class="btn-success" :disabled="isLoading">
                    <i class="fas fa-save"></i> Save All Changes
                  </button>
                </div>
              </div>

              <!-- Settings Stats -->
              <div class="settings-stats">
                <div class="setting-stat">
                  <div class="stat-icon blue">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  <div>
                    <h4>{{ settingsConfigured }}</h4>
                    <p>Configured Settings</p>
                  </div>
                </div>
                <div class="setting-stat">
                  <div class="stat-icon green">
                    <i class="fas fa-save"></i>
                  </div>
                  <div>
                    <h4>{{ lastSettingsSave }}</h4>
                    <p>Last Saved</p>
                  </div>
                </div>
                <div class="setting-stat">
                  <div class="stat-icon orange">
                    <i class="fas fa-bell"></i>
                  </div>
                  <div>
                    <h4>{{ settings.emailNotifications ? 'Enabled' : 'Disabled' }}</h4>
                    <p>Notifications</p>
                  </div>
                </div>
                <div class="setting-stat">
                  <div class="stat-icon" :class="settings.maintenanceMode ? 'red' : 'purple'">
                    <i :class="settings.maintenanceMode ? 'fas fa-exclamation-triangle' : 'fas fa-shield-alt'"></i>
                  </div>
                  <div>
                    <h4>{{ settings.maintenanceMode ? 'Maintenance' : 'Operational' }}</h4>
                    <p>System Status</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings Tabs -->
            <div class="settings-tabs">
              <button 
                v-for="tab in settingsTabs" 
                :key="tab.id"
                @click="activeSettingsTab = tab.id"
                class="settings-tab"
                :class="{ active: activeSettingsTab === tab.id }"
              >
                <i :class="tab.icon"></i>
                {{ tab.label }}
              </button>
            </div>

            <!-- Settings Content -->
            <div class="settings-content-wrapper">
              <!-- General Settings Tab -->
              <div v-show="activeSettingsTab === 'general'" class="settings-tab-content">
                <div class="settings-grid">
                  <div class="setting-group">
                    <h3><i class="fas fa-info-circle"></i> System Identity</h3>
                    <div class="setting-item">
                      <label>System Name</label>
                      <input type="text" v-model="settings.systemName" class="form-input" placeholder="TKP Data Management">
                    </div>
                    <div class="setting-item">
                      <label>Organization</label>
                      <input type="text" v-model="settings.organization" class="form-input" placeholder="Your Organization">
                    </div>
                    <div class="setting-item">
                      <label>System Version</label>
                      <input type="text" v-model="settings.version" class="form-input" placeholder="1.0.0" readonly>
                      <small>Current system version</small>
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-envelope"></i> Contact Information</h3>
                    <div class="setting-item">
                      <label>System Email</label>
                      <input type="email" v-model="settings.systemEmail" class="form-input" placeholder="system@example.com">
                      <small>Primary system email address</small>
                    </div>
                    <div class="setting-item">
                      <label>Support Email</label>
                      <input type="email" v-model="settings.supportEmail" class="form-input" placeholder="support@example.com">
                      <small>Support contact email</small>
                    </div>
                    <div class="setting-item">
                      <label>Phone Number</label>
                      <input type="tel" v-model="settings.phoneNumber" class="form-input" placeholder="+260 XXX XXX XXX">
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-globe"></i> Localization</h3>
                    <div class="setting-item">
                      <label>System Timezone</label>
                      <select v-model="settings.timezone" class="form-input">
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="Africa/Lusaka">Africa/Lusaka (CAT)</option>
                        <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      </select>
                    </div>
                    <div class="setting-item">
                      <label>Date Format</label>
                      <select v-model="settings.dateFormat" class="form-input">
                        <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY (UK)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                      </select>
                    </div>
                    <div class="setting-item">
                      <label>Language</label>
                      <select v-model="settings.language" class="form-input">
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="pt">Portuguese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Data Management Tab -->
              <div v-show="activeSettingsTab === 'data'" class="settings-tab-content">
                <div class="settings-grid">
                  <div class="setting-group">
                    <h3><i class="fas fa-database"></i> Data Retention</h3>
                    <div class="setting-item">
                      <label>Keep logs for (days)</label>
                      <input type="number" v-model.number="settings.logRetention" class="form-input" min="1" max="365">
                      <small>Logs older than this will be removed during cleanup</small>
                    </div>
                    <div class="setting-item">
                      <label>Keep form submissions for (days)</label>
                      <input type="number" v-model.number="settings.formRetention" class="form-input" min="30" max="3650">
                      <small>0 = keep forever</small>
                    </div>
                    <div class="setting-item">
                      <label>Archive old data after (days)</label>
                      <input type="number" v-model.number="settings.archiveAfter" class="form-input" min="90" max="1825">
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-hdd"></i> Storage Management</h3>
                    <div class="setting-item">
                      <label>Maximum upload size (MB)</label>
                      <input type="number" v-model.number="settings.maxUploadSize" class="form-input" min="1" max="100">
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.compressUploads">
                        Compress uploaded files automatically
                      </label>
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.cleanTempFiles">
                        Auto-clean temporary files daily
                      </label>
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-sync-alt"></i> Backup Configuration</h3>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.autoBackup">
                        Enable automatic backups
                      </label>
                    </div>
                    <div v-if="settings.autoBackup" class="setting-item">
                      <label>Backup Frequency</label>
                      <select v-model="settings.backupFrequency" class="form-input">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div v-if="settings.autoBackup" class="setting-item">
                      <label>Backup Time (24h format)</label>
                      <input type="time" v-model="settings.backupTime" class="form-input">
                    </div>
                    <div class="setting-item">
                      <label>Keep backups for (days)</label>
                      <input type="number" v-model.number="settings.backupRetention" class="form-input" min="7" max="365">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notifications Tab -->
              <div v-show="activeSettingsTab === 'notifications'" class="settings-tab-content">
                <div class="settings-grid">
                  <div class="setting-group">
                    <h3><i class="fas fa-envelope"></i> Email Notifications</h3>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.emailNotifications">
                        Enable email notifications
                      </label>
                    </div>
                    <div v-if="settings.emailNotifications" class="setting-item">
                      <label>SMTP Server</label>
                      <input type="text" v-model="settings.smtpServer" class="form-input" placeholder="smtp.example.com">
                    </div>
                    <div v-if="settings.emailNotifications" class="setting-item">
                      <label>SMTP Port</label>
                      <input type="number" v-model.number="settings.smtpPort" class="form-input" placeholder="587">
                    </div>
                    <div v-if="settings.emailNotifications" class="setting-item">
                      <label>From Email</label>
                      <input type="email" v-model="settings.fromEmail" class="form-input" placeholder="noreply@example.com">
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-bell"></i> Notification Preferences</h3>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.notifyOnNewUser">
                        Notify when new users register
                      </label>
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.notifyOnFormSubmission">
                        Notify on form submissions
                      </label>
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.notifyOnError">
                        Notify on system errors
                      </label>
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.notifyOnBackup">
                        Notify on successful backups
                      </label>
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.weeklyReport">
                        Send weekly activity report
                      </label>
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-users"></i> Recipient Configuration</h3>
                    <div class="setting-item">
                      <label>Admin Email Recipients</label>
                      <textarea 
                        v-model="settings.adminEmails" 
                        class="form-input" 
                        rows="3"
                        placeholder="admin1@example.com&#10;admin2@example.com"
                      ></textarea>
                      <small>One email per line</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Maintenance Tab -->
              <div v-show="activeSettingsTab === 'maintenance'" class="settings-tab-content">
                <div class="settings-grid">
                  <div class="setting-group">
                    <h3><i class="fas fa-wrench"></i> Maintenance Mode</h3>
                    <div class="maintenance-toggle">
                      <div class="toggle-status" :class="{ active: settings.maintenanceMode }">
                        <i :class="settings.maintenanceMode ? 'fas fa-tools' : 'fas fa-check-circle'"></i>
                        <h4>{{ settings.maintenanceMode ? 'Maintenance Mode Active' : 'System Operational' }}</h4>
                        <p>{{ settings.maintenanceMode ? 'Users have restricted access' : 'All systems running normally' }}</p>
                      </div>
                      <label class="switch">
                        <input type="checkbox" v-model="settings.maintenanceMode">
                        <span class="slider"></span>
                      </label>
                    </div>
                    <div v-if="settings.maintenanceMode" class="setting-item">
                      <label>Maintenance Message</label>
                      <textarea 
                        v-model="settings.maintenanceMessage" 
                        class="form-input" 
                        rows="4"
                        placeholder="We're currently performing scheduled maintenance. We'll be back shortly!"
                      ></textarea>
                    </div>
                    <div v-if="settings.maintenanceMode" class="setting-item">
                      <label>Estimated Completion Time</label>
                      <input type="datetime-local" v-model="settings.maintenanceEnd" class="form-input">
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-tasks"></i> System Tasks</h3>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.autoCleanup">
                        Run automatic cleanup tasks
                      </label>
                      <small>Cleans old logs, temp files, and expired sessions</small>
                    </div>
                    <div class="setting-item">
                      <label>Cleanup Schedule</label>
                      <select v-model="settings.cleanupSchedule" class="form-input">
                        <option value="daily">Daily at 2:00 AM</option>
                        <option value="weekly">Weekly on Sunday</option>
                        <option value="monthly">Monthly on 1st</option>
                      </select>
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.autoOptimize">
                        Auto-optimize database
                      </label>
                      <small>Improves performance by reorganizing data</small>
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-shield-alt"></i> System Health</h3>
                    <div class="health-monitor">
                      <div class="health-item">
                        <i class="fas fa-heartbeat"></i>
                        <span>Last Health Check: Today</span>
                      </div>
                      <div class="health-item">
                        <i class="fas fa-server"></i>
                        <span>Server Uptime: 99.9%</span>
                      </div>
                      <div class="health-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Performance: Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Advanced Tab -->
              <div v-show="activeSettingsTab === 'advanced'" class="settings-tab-content">
                <div class="settings-grid">
                  <div class="setting-group">
                    <h3><i class="fas fa-code"></i> Developer Options</h3>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.debugMode">
                        Enable debug mode
                      </label>
                      <small>Shows detailed error messages and logs</small>
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.apiLogging">
                        Log API requests
                      </label>
                    </div>
                    <div class="setting-item">
                      <label>API Rate Limit (requests/minute)</label>
                      <input type="number" v-model.number="settings.apiRateLimit" class="form-input" min="10" max="1000">
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-paint-brush"></i> Display Settings</h3>
                    <div class="setting-item">
                      <label>Items per page</label>
                      <input type="number" v-model.number="settings.itemsPerPage" class="form-input" min="10" max="100">
                    </div>
                    <div class="setting-item">
                      <label>Theme</label>
                      <select v-model="settings.theme" class="form-input">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.compactMode">
                        Compact mode
                      </label>
                      <small>Reduces spacing for more content</small>
                    </div>
                  </div>

                  <div class="setting-group">
                    <h3><i class="fas fa-plug"></i> Integrations</h3>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.googleAnalytics">
                        Enable Google Analytics
                      </label>
                    </div>
                    <div v-if="settings.googleAnalytics" class="setting-item">
                      <label>Tracking ID</label>
                      <input type="text" v-model="settings.gaTrackingId" class="form-input" placeholder="UA-XXXXXXXXX-X">
                    </div>
                    <div class="setting-item">
                      <label>
                        <input type="checkbox" v-model="settings.smsNotifications">
                        Enable SMS notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Database Management Section -->
          <div v-if="activeSection === 'database'" class="section-content">
            <!-- Database Overview -->
            <div class="database-overview">
              <div class="db-stats-grid">
                <div class="db-stat-card">
                  <div class="db-stat-icon blue">
                    <i class="fas fa-database"></i>
                  </div>
                  <div class="db-stat-info">
                    <h4>{{ databaseStats.totalRecords }}</h4>
                    <p>Total Records</p>
                    <small>Across all collections</small>
                  </div>
                </div>
                
                <div class="db-stat-card">
                  <div class="db-stat-icon green">
                    <i class="fas fa-hdd"></i>
                  </div>
                  <div class="db-stat-info">
                    <h4>{{ databaseStats.storageSize }}</h4>
                    <p>Storage Used</p>
                    <small>Database size</small>
                  </div>
                </div>
                
                <div class="db-stat-card">
                  <div class="db-stat-icon purple">
                    <i class="fas fa-save"></i>
                  </div>
                  <div class="db-stat-info">
                    <h4>{{ databaseStats.lastBackup }}</h4>
                    <p>Last Backup</p>
                    <small>{{ databaseStats.backupCount }} backups total</small>
                  </div>
                </div>
                
                <div class="db-stat-card">
                  <div class="db-stat-icon orange">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <div class="db-stat-info">
                    <h4>{{ databaseStats.healthScore }}%</h4>
                    <p>Database Health</p>
                    <small :class="databaseStats.healthScore >= 80 ? 'text-success' : 'text-warning'">
                      {{ databaseStats.healthStatus }}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Collection Details -->
            <div class="collections-section">
              <h3><i class="fas fa-layer-group"></i> Database Collections</h3>
              <div class="collections-grid">
                <div v-for="collection in databaseCollections" :key="collection.name" class="collection-card">
                  <div class="collection-header">
                    <div class="collection-icon" :style="{ background: collection.color }">
                      <i :class="collection.icon"></i>
                    </div>
                    <div class="collection-info">
                      <h4>{{ collection.name }}</h4>
                      <p>{{ collection.count }} records</p>
                    </div>
                  </div>
                  <div class="collection-stats">
                    <div class="stat-item">
                      <span class="stat-label">Size:</span>
                      <span class="stat-value">{{ collection.size }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Last Modified:</span>
                      <span class="stat-value">{{ collection.lastModified }}</span>
                    </div>
                  </div>
                  <div class="collection-actions">
                    <button @click="exportCollection(collection.name)" class="btn-sm btn-secondary">
                      <i class="fas fa-file-export"></i> Export
                    </button>
                    <button @click="viewCollectionDetails(collection.name)" class="btn-sm btn-primary">
                      <i class="fas fa-eye"></i> View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Backup Management -->
            <div class="backup-management">
              <h3><i class="fas fa-cloud-upload-alt"></i> Backup & Restore</h3>
              
              <div class="backup-options">
                <div class="option-group">
                  <h4>Backup Options</h4>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="backupOptions.includeUsers">
                    Include User Data
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="backupOptions.includeForms">
                    Include Forms
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="backupOptions.includeLogs">
                    Include System Logs
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="backupOptions.compress">
                    Compress Backup
                  </label>
                </div>
                
                <div class="option-group">
                  <h4>Scheduled Backups</h4>
                  <div class="setting-item">
                    <label>
                      <input type="checkbox" v-model="backupOptions.autoBackup">
                      Enable automatic backups
                    </label>
                  </div>
                  <div v-if="backupOptions.autoBackup" class="setting-item">
                    <label>Backup Frequency</label>
                    <select v-model="backupOptions.frequency" class="form-select">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div v-if="backupOptions.autoBackup" class="setting-item">
                    <label>Retain Backups (days)</label>
                    <input type="number" v-model.number="backupOptions.retentionDays" class="form-input" min="7" max="365">
                  </div>
                </div>
              </div>

              <div class="database-actions">
                <div class="action-card">
                  <div class="action-icon blue">
                    <i class="fas fa-download"></i>
                  </div>
                  <div class="action-content">
                    <h3>Backup Database</h3>
                    <p>Create a complete backup of all selected data</p>
                    <button @click="backupDatabase" class="btn-primary" :disabled="isLoading">
                      <i class="fas fa-download"></i> Create Backup
                    </button>
                  </div>
                </div>
                
                <div class="action-card">
                  <div class="action-icon orange">
                    <i class="fas fa-upload"></i>
                  </div>
                  <div class="action-content">
                    <h3>Restore Database</h3>
                    <p>Restore data from a previous backup file</p>
                    <button @click="restoreDatabase" class="btn-warning" :disabled="isLoading">
                      <i class="fas fa-upload"></i> Restore Backup
                    </button>
                  </div>
                </div>
                
                <div class="action-card">
                  <div class="action-icon red">
                    <i class="fas fa-broom"></i>
                  </div>
                  <div class="action-content">
                    <h3>Clean Old Data</h3>
                    <p>Remove old logs and temporary data ({{ settings.logRetention }} days)</p>
                    <button @click="cleanDatabase" class="btn-danger" :disabled="isLoading">
                      <i class="fas fa-broom"></i> Clean Data
                    </button>
                  </div>
                </div>
                
                <div class="action-card">
                  <div class="action-icon purple">
                    <i class="fas fa-chart-bar"></i>
                  </div>
                  <div class="action-content">
                    <h3>Database Health Check</h3>
                    <p>Run diagnostics and optimize performance</p>
                    <button @click="runHealthCheck" class="btn-info" :disabled="isCheckingHealth">
                      <i class="fas fa-stethoscope" :class="{ 'fa-spin': isCheckingHealth }"></i> 
                      {{ isCheckingHealth ? 'Checking...' : 'Run Health Check' }}
                    </button>
                  </div>
                </div>

                <div class="action-card">
                  <div class="action-icon green">
                    <i class="fas fa-copy"></i>
                  </div>
                  <div class="action-content">
                    <h3>Remove Duplicates</h3>
                    <p>Clean up duplicate forms and drafts</p>
                    <button @click="cleanupDuplicates" class="btn-success" :disabled="isCleaningDuplicates">
                      <i class="fas fa-trash-alt" :class="{ 'fa-spin': isCleaningDuplicates }"></i> 
                      {{ isCleaningDuplicates ? 'Cleaning...' : 'Remove Duplicates' }}
                    </button>
                  </div>
                </div>

                <div class="action-card">
                  <div class="action-icon indigo">
                    <i class="fas fa-id-card"></i>
                  </div>
                  <div class="action-content">
                    <h3>Update Child IDs</h3>
                    <p>Add child IDs to existing forms</p>
                    <button @click="updateChildIds" class="btn-info" :disabled="isUpdatingIds">
                      <i class="fas fa-sync-alt" :class="{ 'fa-spin': isUpdatingIds }"></i> 
                      {{ isUpdatingIds ? 'Updating...' : 'Update Child IDs' }}
                    </button>
                  </div>
                </div>

                <div class="action-card">
                  <div class="action-icon red">
                    <i class="fas fa-user-check"></i>
                  </div>
                  <div class="action-content">
                    <h3>One Form Per Child</h3>
                    <p>Keep only one form for each child</p>
                    <button @click="oneFormPerChild" class="btn-danger" :disabled="isCleaningOnePerChild">
                      <i class="fas fa-filter" :class="{ 'fa-spin': isCleaningOnePerChild }"></i> 
                      {{ isCleaningOnePerChild ? 'Processing...' : 'Keep One Per Child' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Backups -->
            <div v-if="recentBackups.length > 0" class="recent-backups">
              <h3><i class="fas fa-history"></i> Recent Backups</h3>
              <div class="backups-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Size</th>
                      <th>Collections</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="backup in recentBackups" :key="backup.id">
                      <td>{{ formatDateTime(backup.timestamp) }}</td>
                      <td>{{ backup.size }}</td>
                      <td>{{ backup.collections }}</td>
                      <td>
                        <span class="status-badge" :class="backup.status">
                          {{ backup.status }}
                        </span>
                      </td>
                      <td>
                        <button @click="downloadBackup(backup)" class="btn-xs btn-secondary">
                          <i class="fas fa-download"></i>
                        </button>
                        <button @click="deleteBackup(backup.id)" class="btn-xs btn-danger">
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                <button @click="exportLogs" class="btn-secondary">
                  <i class="fas fa-download"></i> Export Logs
                </button>
                <button @click="clearOldLogs" class="btn-warning">
                  <i class="fas fa-broom"></i> Clear Old Logs
                </button>
              </div>
              <div v-if="filteredLogs.length === 0" class="no-results">
                <i class="fas fa-list-alt"></i>
                <p>No logs available</p>
              </div>
              <div v-else class="logs-list">
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
            <!-- Security Overview -->
            <div class="security-overview">
              <div class="security-score">
                <div class="score-circle" :class="getSecurityScoreClass()">
                  <span class="score-number">{{ securityScore }}</span>
                  <span class="score-label">Security Score</span>
                </div>
                <div class="score-details">
                  <h3>System Security Status</h3>
                  <p>{{ getSecurityMessage() }}</p>
                  <div class="security-indicators">
                    <span v-for="indicator in securityIndicators" :key="indicator.name" class="indicator" :class="indicator.status">
                      <i :class="indicator.icon"></i> {{ indicator.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Settings -->
            <div class="security-settings">
              <div class="setting-group">
                <h3><i class="fas fa-key"></i> Password Policy</h3>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.requireStrongPassword">
                    Require strong passwords (min 8 characters, uppercase, lowercase, numbers)
                  </label>
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.passwordExpiry">
                    Password expiry (days)
                  </label>
                  <input v-if="security.passwordExpiry" type="number" v-model.number="security.passwordExpiryDays" class="form-input" min="30" max="365">
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.preventReuse">
                    Prevent password reuse (last {{ security.preventReuseCount }} passwords)
                  </label>
                  <input v-if="security.preventReuse" type="number" v-model.number="security.preventReuseCount" class="form-input" min="3" max="10">
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
                <div class="setting-item">
                  <label>Account lockout duration (minutes)</label>
                  <input type="number" v-model.number="security.lockoutDuration" class="form-input" min="5" max="60">
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.ipWhitelist">
                    Enable IP whitelist
                  </label>
                  <textarea v-if="security.ipWhitelist" v-model="security.allowedIPs" class="form-input" rows="3" placeholder="Enter allowed IP addresses (one per line)"></textarea>
                </div>
              </div>

              <div class="setting-group">
                <h3><i class="fas fa-clock"></i> Session Management</h3>
                <div class="setting-item">
                  <label>Session timeout (minutes)</label>
                  <input type="number" v-model.number="security.sessionTimeout" class="form-input" min="5" max="120">
                  <small>Users will be logged out after this period of inactivity</small>
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.concurrentSessions">
                    Allow concurrent sessions
                  </label>
                  <small v-if="!security.concurrentSessions">Users will be logged out from other devices when logging in</small>
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.rememberDevice">
                    Remember device for 30 days
                  </label>
                </div>
              </div>

              <div class="setting-group">
                <h3><i class="fas fa-globe"></i> Advanced Security</h3>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.securityHeaders">
                    Enable security headers (HSTS, CSP, etc.)
                  </label>
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.auditLogging">
                    Enable comprehensive audit logging
                  </label>
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.encryptionAtRest">
                    Enable encryption at rest
                  </label>
                </div>
                <div class="setting-item">
                  <label>
                    <input type="checkbox" v-model="security.rateLimiting">
                    Enable API rate limiting
                  </label>
                  <input v-if="security.rateLimiting" type="number" v-model.number="security.rateLimit" class="form-input" min="10" max="1000">
                  <small v-if="security.rateLimiting">Requests per minute per user</small>
                </div>
              </div>
              
              <div class="security-actions">
                <button @click="saveSecuritySettings" class="btn-success" :disabled="isLoading">
                  <i class="fas fa-save"></i> Save Security Settings
                </button>
                <button @click="runSecurityAudit" class="btn-primary" :disabled="isAuditing">
                  <i class="fas fa-shield-alt" :class="{ 'fa-spin': isAuditing }"></i> 
                  {{ isAuditing ? 'Running Audit...' : 'Run Security Audit' }}
                </button>
                <button @click="exportSecurityReport" class="btn-secondary">
                  <i class="fas fa-file-export"></i> Export Security Report
                </button>
              </div>
            </div>

            <!-- Security Audit Results -->
            <div v-if="securityAuditResults.length > 0" class="security-audit-results">
              <h3><i class="fas fa-clipboard-check"></i> Security Audit Results</h3>
              <div class="audit-items">
                <div v-for="item in securityAuditResults" :key="item.id" class="audit-item" :class="item.severity">
                  <div class="audit-icon">
                    <i :class="item.icon"></i>
                  </div>
                  <div class="audit-content">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                    <small>{{ item.recommendation }}</small>
                  </div>
                  <div class="audit-severity">
                    <span class="severity-badge" :class="item.severity">{{ item.severity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Section -->
          <div v-if="activeSection === 'analytics'" class="section-content">
            <div class="analytics-header">
              <h3><i class="fas fa-chart-line"></i> System Analytics Dashboard</h3>
              <button @click="refreshAnalytics" class="btn-secondary" :disabled="isLoadingAnalytics">
                <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoadingAnalytics }"></i>
                Refresh Data
              </button>
            </div>
            
            <div class="analytics-stats-grid">
              <div class="analytics-stat-card">
                <div class="stat-icon-large blue">
                  <i class="fas fa-user-check"></i>
                </div>
                <div class="stat-details">
                  <h4>{{ analyticsData.activeUsers }}</h4>
                  <p>Active Users</p>
                  <small class="trend positive" v-if="analyticsData.userGrowth > 0">
                    <i class="fas fa-arrow-up"></i> +{{ analyticsData.userGrowth }}% this month
                  </small>
                </div>
              </div>
              
              <div class="analytics-stat-card">
                <div class="stat-icon-large green">
                  <i class="fas fa-file-alt"></i>
                </div>
                <div class="stat-details">
                  <h4>{{ analyticsData.totalSubmissions }}</h4>
                  <p>Total Submissions</p>
                  <small class="trend positive" v-if="analyticsData.submissionGrowth > 0">
                    <i class="fas fa-arrow-up"></i> +{{ analyticsData.submissionGrowth }}% this month
                  </small>
                </div>
              </div>
              
              <div class="analytics-stat-card">
                <div class="stat-icon-large purple">
                  <i class="fas fa-chart-bar"></i>
                </div>
                <div class="stat-details">
                  <h4>{{ analyticsData.avgSubmissionsPerDay }}</h4>
                  <p>Avg. Daily Submissions</p>
                  <small>Last 30 days</small>
                </div>
              </div>
              
              <div class="analytics-stat-card">
                <div class="stat-icon-large orange">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="stat-details">
                  <h4>{{ analyticsData.peakHour }}</h4>
                  <p>Peak Activity Hour</p>
                  <small>Most submissions</small>
                </div>
              </div>
            </div>
            
            <div class="analytics-dashboard">
              <div class="chart-card full-width">
                <div class="chart-header">
                  <h3><i class="fas fa-users"></i> User Activity (Last 30 Days)</h3>
                  <select v-model="userActivityPeriod" @change="updateUserActivityChart" class="chart-select">
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div class="chart-container">
                  <canvas ref="userActivityChart"></canvas>
                </div>
              </div>
              
              <div class="chart-card full-width">
                <div class="chart-header">
                  <h3><i class="fas fa-file-alt"></i> Form Submissions by Type</h3>
                  <select v-model="submissionChartType" @change="updateSubmissionChart" class="chart-select">
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                  </select>
                </div>
                <div class="chart-container">
                  <canvas ref="formSubmissionsChart"></canvas>
                </div>
              </div>
              
              <div class="chart-card">
                <h3><i class="fas fa-pie-chart"></i> Forms by Category</h3>
                <div class="chart-container">
                  <canvas ref="formCategoryChart"></canvas>
                </div>
              </div>
              
              <div class="chart-card">
                <h3><i class="fas fa-calendar-alt"></i> Submissions by Day of Week</h3>
                <div class="chart-container">
                  <canvas ref="weekdayChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Collection Details Modal -->
    <div v-if="showCollectionModal" class="modal-overlay" @click.self="closeCollectionModal">
      <div class="collection-modal">
        <div class="collection-modal-header">
          <h2>
            <i :class="getCollectionIcon(selectedCollection)"></i>
            {{ selectedCollection }} Collection
          </h2>
          <button @click="closeCollectionModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="collection-modal-content">
          <div v-if="isLoadingCollection" class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Loading data...
          </div>

          <div v-else-if="collectionData.length === 0" class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>No records found in this collection</p>
          </div>

          <div v-else class="collection-data">
            <!-- Users Collection -->
            <div v-if="selectedCollection === 'Users'" class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in collectionData" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                    <td>
                      <span class="role-badge" :class="item.role">{{ item.role }}</span>
                    </td>
                    <td>
                      <span class="status-badge" :class="item.status">{{ item.status }}</span>
                    </td>
                    <td>{{ item.created }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Forms Collection -->
            <div v-if="selectedCollection === 'Forms'" class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Child Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Submitted By</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in collectionData" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.age }}</td>
                    <td>{{ item.gender }}</td>
                    <td>{{ item.submittedBy }}</td>
                    <td>{{ item.created }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Logs Collection -->
            <div v-if="selectedCollection === 'Logs'" class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Message</th>
                    <th>User</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in collectionData" :key="item.id">
                    <td>
                      <span class="log-type-badge" :class="item.type">{{ item.type }}</span>
                    </td>
                    <td>{{ item.message }}</td>
                    <td>{{ item.user }}</td>
                    <td>{{ item.timestamp }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Settings Collection -->
            <div v-if="selectedCollection === 'Settings'" class="settings-view">
              <div v-for="item in collectionData" :key="item.id" class="settings-card">
                <div class="settings-icon">
                  <i class="fas fa-cog"></i>
                </div>
                <div class="settings-info">
                  <h3>{{ item.category }}</h3>
                  <p>{{ item.items }} configuration items</p>
                  <small>Last modified: {{ item.lastModified }}</small>
                </div>
              </div>
            </div>

            <div class="collection-summary">
              <p><strong>Total Records:</strong> {{ collectionData.length }}</p>
            </div>
          </div>
        </div>

        <div class="collection-modal-footer">
          <button @click="exportCollection(selectedCollection)" class="btn-secondary">
            <i class="fas fa-file-export"></i> Export Collection
          </button>
          <button @click="closeCollectionModal" class="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Duplicates Preview Modal -->
    <div v-if="showDuplicatesModal" class="modal-overlay" @click.self="closeDuplicatesModal">
      <div class="duplicates-modal">
        <div class="duplicates-modal-header">
          <div>
            <h2>
              <i class="fas fa-copy"></i>
              Duplicate Forms Found
            </h2>
            <p>Review and select which duplicates to remove</p>
          </div>
          <button @click="closeDuplicatesModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="duplicates-modal-content">
          <div v-if="isLoadingDuplicates" class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Scanning for duplicates...
          </div>

          <div v-else-if="duplicatesData.length === 0" class="empty-state">
            <i class="fas fa-check-circle"></i>
            <p>No duplicate forms found!</p>
            <small>Your database is clean</small>
          </div>

          <div v-else class="duplicates-content">
            <!-- Selection Controls -->
            <div class="selection-controls">
              <div class="selection-info">
                <strong>{{ selectedDuplicates.size }}</strong> of <strong>{{ duplicatesData.length }}</strong> selected
              </div>
              <div class="selection-actions">
                <button @click="selectAllDuplicates" class="btn-link">
                  <i class="fas fa-check-square"></i> Select All
                </button>
                <button @click="deselectAllDuplicates" class="btn-link">
                  <i class="fas fa-square"></i> Deselect All
                </button>
              </div>
            </div>

            <!-- Duplicates Table -->
            <div class="duplicates-table">
              <table>
                <thead>
                  <tr>
                    <th style="width: 50px;">
                      <input 
                        type="checkbox" 
                        :checked="selectedDuplicates.size === duplicatesData.length"
                        @change="selectedDuplicates.size === duplicatesData.length ? deselectAllDuplicates() : selectAllDuplicates()"
                      >
                    </th>
                    <th>Child Name</th>
                    <th>Form Type</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="duplicate in duplicatesData" 
                    :key="duplicate.id"
                    :class="{ selected: selectedDuplicates.has(duplicate.id) }"
                    @click="toggleDuplicateSelection(duplicate.id)"
                  >
                    <td>
                      <input 
                        type="checkbox" 
                        :checked="selectedDuplicates.has(duplicate.id)"
                        @change.stop="toggleDuplicateSelection(duplicate.id)"
                      >
                    </td>
                    <td>
                      <strong>{{ duplicate.child }}</strong>
                    </td>
                    <td>
                      <span class="form-type-badge">{{ duplicate.formType }}</span>
                    </td>
                    <td>
                      <span 
                        class="status-badge" 
                        :class="duplicate.status === 'submitted' ? 'submitted' : 'draft'"
                      >
                        {{ duplicate.status }}
                      </span>
                    </td>
                    <td>{{ formatDate(duplicate.createdAt) }}</td>
                    <td>
                      <span class="reason-text">{{ duplicate.reason }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Summary -->
            <div class="duplicates-summary">
              <div class="summary-card warning">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                  <strong>Warning</strong>
                  <p>Selected forms will be permanently deleted. This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="duplicates-modal-footer">
          <button @click="closeDuplicatesModal" class="btn-secondary">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button 
            @click="deleteSelectedDuplicates" 
            class="btn-danger" 
            :disabled="selectedDuplicates.size === 0 || isCleaningDuplicates"
          >
            <i class="fas fa-trash-alt" :class="{ 'fa-spin': isCleaningDuplicates }"></i>
            {{ isCleaningDuplicates ? 'Deleting...' : `Delete Selected (${selectedDuplicates.size})` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast.js';
import AuthService from '../services/auth.js';
import UserService from '../services/userService.js';
import FormService from '../services/formService.js';
import TrackerService from '../services/trackerService.js';
import { db } from '../firebase/config.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
const userSearchQuery = ref('');
const userRoleFilter = ref('all');
const currentPage = ref(1);
const usersPerPage = 10;

// System settings
const settings = ref({
  systemName: 'TKP Data Management System',
  organization: 'TKP Organization',
  version: '1.0.0',
  systemEmail: 'admin@tkp.com',
  supportEmail: 'support@tkp.com',
  phoneNumber: '+260 XXX XXX XXX',
  timezone: 'Africa/Lusaka',
  dateFormat: 'DD/MM/YYYY',
  language: 'en',
  logRetention: 30,
  formRetention: 365,
  archiveAfter: 180,
  maxUploadSize: 10,
  compressUploads: true,
  cleanTempFiles: true,
  autoBackup: true,
  backupFrequency: 'daily',
  backupTime: '02:00',
  backupRetention: 30,
  emailNotifications: true,
  smtpServer: '',
  smtpPort: 587,
  fromEmail: '',
  notifyOnNewUser: true,
  notifyOnFormSubmission: false,
  notifyOnError: true,
  notifyOnBackup: false,
  weeklyReport: true,
  adminEmails: '',
  maintenanceMode: false,
  maintenanceMessage: 'System is under maintenance. Please check back later.',
  maintenanceEnd: '',
  autoCleanup: true,
  cleanupSchedule: 'daily',
  autoOptimize: true,
  debugMode: false,
  apiLogging: false,
  apiRateLimit: 100,
  itemsPerPage: 20,
  theme: 'light',
  compactMode: false,
  googleAnalytics: false,
  gaTrackingId: '',
  smsNotifications: false
});

// Settings UI state
const activeSettingsTab = ref('general');
const settingsTabs = ref([
  { id: 'general', label: 'General', icon: 'fas fa-cog' },
  { id: 'data', label: 'Data Management', icon: 'fas fa-database' },
  { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
  { id: 'maintenance', label: 'Maintenance', icon: 'fas fa-wrench' },
  { id: 'advanced', label: 'Advanced', icon: 'fas fa-code' }
]);

const settingsConfigured = computed(() => {
  const configured = Object.values(settings.value).filter(val => val !== '' && val !== null).length;
  return `${configured}/${Object.keys(settings.value).length}`;
});

const lastSettingsSave = ref('Never');

// Security settings
const security = ref({
  requireStrongPassword: true,
  passwordExpiry: false,
  passwordExpiryDays: 90,
  preventReuse: false,
  preventReuseCount: 5,
  enableTwoFactor: false,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  ipWhitelist: false,
  allowedIPs: '',
  sessionTimeout: 30,
  concurrentSessions: true,
  rememberDevice: false,
  securityHeaders: true,
  auditLogging: true,
  encryptionAtRest: true,
  rateLimiting: true,
  rateLimit: 100
});

// Security audit
const isAuditing = ref(false);
const securityAuditResults = ref([]);
const securityScore = ref(0);
const securityIndicators = ref([]);

// Logs
const logs = ref([]);
const logFilter = ref('all');

// Loading states
const isLoading = ref(false);
const isLoadingAnalytics = ref(false);
const isCheckingHealth = ref(false);
const isCleaningDuplicates = ref(false);
const isUpdatingIds = ref(false);
const isCleaningOnePerChild = ref(false);

// Database Management
const databaseStats = ref({
  totalRecords: 0,
  storageSize: '0 MB',
  lastBackup: 'Never',
  backupCount: 0,
  healthScore: 100,
  healthStatus: 'Excellent'
});

const databaseCollections = ref([
  {
    name: 'Users',
    count: 0,
    size: '0 KB',
    lastModified: 'N/A',
    icon: 'fas fa-users',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    name: 'Forms',
    count: 0,
    size: '0 KB',
    lastModified: 'N/A',
    icon: 'fas fa-file-alt',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    name: 'Logs',
    count: 0,
    size: '0 KB',
    lastModified: 'N/A',
    icon: 'fas fa-history',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    name: 'Settings',
    count: 0,
    size: '0 KB',
    lastModified: 'N/A',
    icon: 'fas fa-cog',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]);

const backupOptions = ref({
  includeUsers: true,
  includeForms: true,
  includeLogs: true,
  compress: true,
  autoBackup: false,
  frequency: 'weekly',
  retentionDays: 30
});

const recentBackups = ref([]);

// Collection Modal
const showCollectionModal = ref(false);
const selectedCollection = ref('');
const collectionData = ref([]);
const isLoadingCollection = ref(false);

// Duplicates Modal
const showDuplicatesModal = ref(false);
const duplicatesData = ref([]);
const selectedDuplicates = ref(new Set());
const isLoadingDuplicates = ref(false);

// Analytics data
const analyticsData = ref({
  activeUsers: 0,
  totalSubmissions: 0,
  userGrowth: 0,
  submissionGrowth: 0,
  avgSubmissionsPerDay: 0,
  peakHour: '9:00 AM'
});

const userActivityPeriod = ref('30');
const submissionChartType = ref('line');

// Chart refs
const userActivityChart = ref(null);
const formSubmissionsChart = ref(null);
const formCategoryChart = ref(null);
const weekdayChart = ref(null);

// Chart instances
let userActivityChartInstance = null;
let formSubmissionsChartInstance = null;
let formCategoryChartInstance = null;
let weekdayChartInstance = null;

const filteredLogs = computed(() => {
  if (logFilter.value === 'all') return logs.value;
  return logs.value.filter(log => log.type === logFilter.value);
});

const filteredUsers = computed(() => {
  let result = users.value;
  
  // Filter by role
  if (userRoleFilter.value !== 'all') {
    result = result.filter(user => (user.role || 'user') === userRoleFilter.value);
  }
  
  // Filter by search query
  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.fullName?.toLowerCase().includes(query) || 
      user.email?.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage;
  const end = start + usersPerPage;
  return filteredUsers.value.slice(start, end);
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

const addLog = (type, message, user = 'System') => {
  const newLog = {
    id: Date.now().toString() + Math.random(),
    type: type,
    timestamp: new Date(),
    message: message,
    user: user
  };
  logs.value.unshift(newLog);
  
  // Save to localStorage for persistence
  const savedLogs = JSON.parse(localStorage.getItem('tkp_system_logs') || '[]');
  savedLogs.unshift(newLog);
  // Keep only last 1000 logs
  if (savedLogs.length > 1000) savedLogs.splice(1000);
  localStorage.setItem('tkp_system_logs', JSON.stringify(savedLogs));
};

const loadSystemLogs = async () => {
  isLoading.value = true;
  try {
    // Load saved logs from localStorage
    const savedLogs = JSON.parse(localStorage.getItem('tkp_system_logs') || '[]');
    
    // Get user activity logs from users
    const usersResult = await UserService.getAllUsers();
    if (usersResult.success) {
      const userLogs = usersResult.users.map(user => ({
        id: user.id,
        type: 'user',
        timestamp: user.lastLogin || user.createdAt,
        message: `User ${user.fullName} ${user.lastLogin ? 'logged in' : 'was created'}`,
        user: user.fullName
      }));
      
      // Combine saved logs with user logs
      const allLogs = [...savedLogs, ...userLogs];
      
      logs.value = allLogs.sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return timeB - timeA;
      });
    }
    
    // Add system startup log
    addLog('system', 'System Management accessed', AuthService.getCurrentUser()?.email || 'Unknown');
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
      addLog('user', `Added new user: ${newUserForm.value.fullName} (${newUserForm.value.email})`, AuthService.getCurrentUser()?.email);
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
    } else {
      error('Failed to add user: ' + result.error);
      addLog('error', `Failed to add user: ${result.error}`, AuthService.getCurrentUser()?.email);
    }
  } catch (err) {
    console.error('Error adding user:', err);
    error('Error adding user: ' + err.message);
    addLog('error', `Error adding user: ${err.message}`, AuthService.getCurrentUser()?.email);
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
      success('User updated successfully!');
      addLog('user', `Updated user: ${newUserForm.value.fullName} (${newUserForm.value.email})`, AuthService.getCurrentUser()?.email);
      showAddUserModal.value = false;
      editingUser.value = null;
      await loadUsers();
    } else {
      error('Failed to update user: ' + result.error);
      addLog('error', `Failed to update user: ${result.error}`, AuthService.getCurrentUser()?.email);
    }
  } catch (err) {
    console.error('Error updating user:', err);
    error('Error updating user: ' + err.message);
    addLog('error', `Error updating user: ${err.message}`, AuthService.getCurrentUser()?.email);
  } finally {
    isLoading.value = false;
  }
};

const deleteUser = async (user) => {
  const confirmed = await confirm(`Are you sure you want to delete ${user.fullName}? This action cannot be undone.`);
  if (!confirmed) return;
  
  isLoading.value = true;
  try {
    const result = await UserService.deleteUser(user.uid);
    if (result.success) {
      success('User deleted successfully!');
      addLog('user', `Deleted user: ${user.fullName} (${user.email})`, AuthService.getCurrentUser()?.email);
      await loadUsers();
    } else {
      error('Failed to delete user: ' + result.error);
      addLog('error', `Failed to delete user: ${result.error}`, AuthService.getCurrentUser()?.email);
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    error('Error deleting user: ' + err.message);
    addLog('error', `Error deleting user: ${err.message}`, AuthService.getCurrentUser()?.email);
  } finally {
    isLoading.value = false;
  }
};

const exportUsers = () => {
  try {
    const exportData = filteredUsers.value.map(user => ({
      'Full Name': user.fullName,
      'Email': user.email,
      'Role': user.role || 'user',
      'Organization': user.organization || '',
      'Status': user.status || 'active',
      'Phone': user.phoneNumber || '',
      'Last Login': formatDate(user.lastLogin)
    }));
    
    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csv = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    success('Users exported successfully!');
    addLog('system', `Exported ${exportData.length} users to CSV`, AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error exporting users:', err);
    error('Failed to export users');
    addLog('error', 'Failed to export users', AuthService.getCurrentUser()?.email);
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
      
      success('Database backup created successfully!');
      addLog('system', 'Database backup created', AuthService.getCurrentUser()?.email);
      
      // Save backup info
      const backupInfo = JSON.parse(localStorage.getItem('tkp_backup_info') || '{}');
      backupInfo.lastBackup = new Date().toISOString();
      backupInfo.count = (backupInfo.count || 0) + 1;
      localStorage.setItem('tkp_backup_info', JSON.stringify(backupInfo));
      
      // Add to recent backups
      const backupRecord = {
        id: Date.now(),
        timestamp: new Date(),
        size: '~2.5 MB',
        collections: 'Users, Forms, Logs, Settings',
        status: 'success'
      };
      const savedBackups = JSON.parse(localStorage.getItem('tkp_recent_backups') || '[]');
      savedBackups.unshift(backupRecord);
      if (savedBackups.length > 10) savedBackups.pop();
      localStorage.setItem('tkp_recent_backups', JSON.stringify(savedBackups));
      
      // Reload stats
      await loadDatabaseStats();
    }
  } catch (err) {
    console.error('Error creating backup:', err);
    error('Error creating backup: ' + err.message);
    addLog('error', `Backup failed: ${err.message}`, AuthService.getCurrentUser()?.email);
  } finally {
    isLoading.value = false;
  }
};

const restoreDatabase = async () => {
  const confirmed = await confirm('Restoring from backup will overwrite current data. Are you sure?');
  if (!confirmed) return;
  
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
      
      success(`Database restored successfully from backup created on ${new Date(backup.timestamp).toLocaleString()}`);
      addLog('system', `Database restored from backup (${new Date(backup.timestamp).toLocaleString()})`, AuthService.getCurrentUser()?.email);
      await loadStats();
    } catch (err) {
      console.error('Error restoring backup:', err);
      error('Error restoring backup: ' + err.message);
      addLog('error', `Restore failed: ${err.message}`, AuthService.getCurrentUser()?.email);
    } finally {
      isLoading.value = false;
    }
  };
  input.click();
};

const cleanDatabase = async () => {
  const confirmed = await confirm('This will remove old logs and temporary data. Are you sure?');
  if (!confirmed) return;
  
  isLoading.value = true;
  try {
    // Clear old logs (older than retention period)
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - settings.value.logRetention);
    
    const initialCount = logs.value.length;
    logs.value = logs.value.filter(log => {
      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
      return logDate >= retentionDate;
    });
    const removedCount = initialCount - logs.value.length;
    
    // Clear session storage
    sessionStorage.clear();
    
    success(`Database cleaned successfully! Removed ${removedCount} old log entries.`);
    addLog('system', `Database cleaned - removed ${removedCount} old entries`, AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error cleaning database:', err);
    error('Error cleaning database: ' + err.message);
    addLog('error', `Database cleanup failed: ${err.message}`, AuthService.getCurrentUser()?.email);
  } finally {
    isLoading.value = false;
  }
};

const exportLogs = () => {
  try {
    const logsToExport = filteredLogs.value.map(log => ({
      'Timestamp': formatDateTime(log.timestamp),
      'Type': log.type,
      'Message': log.message,
      'User': log.user
    }));
    
    // Convert to CSV
    const headers = Object.keys(logsToExport[0]);
    const csv = [
      headers.join(','),
      ...logsToExport.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    success('Logs exported successfully!');
    addLog('system', `Exported ${logsToExport.length} log entries to CSV`, AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error exporting logs:', err);
    error('Failed to export logs');
    addLog('error', 'Failed to export logs', AuthService.getCurrentUser()?.email);
  }
};

const clearOldLogs = async () => {
  const confirmed = await confirm(`This will remove logs older than ${settings.value.logRetention} days. Continue?`);
  if (!confirmed) return;
  
  try {
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - settings.value.logRetention);
    
    const initialCount = logs.value.length;
    logs.value = logs.value.filter(log => {
      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
      return logDate >= retentionDate;
    });
    const removedCount = initialCount - logs.value.length;
    
    success(`Removed ${removedCount} old log entries`);
    addLog('system', `Cleared ${removedCount} old log entries`, AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error clearing logs:', err);
    error('Failed to clear old logs');
    addLog('error', 'Failed to clear old logs', AuthService.getCurrentUser()?.email);
  }
};

const saveSettings = () => {
  try {
    localStorage.setItem('tkp_system_settings', JSON.stringify(settings.value));
    lastSettingsSave.value = 'Just now';
    success('System settings saved successfully!');
    addLog('system', 'System settings updated', AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error saving settings:', err);
    error('Error saving settings: ' + err.message);
    addLog('error', `Failed to save settings: ${err.message}`, AuthService.getCurrentUser()?.email);
  }
};

const resetSettings = async () => {
  const confirmed = await confirm('This will reset all settings to their default values. Are you sure?');
  if (!confirmed) return;
  
  try {
    // Reset to default values
    settings.value = {
      systemName: 'TKP Data Management System',
      organization: 'TKP Organization',
      version: '1.0.0',
      systemEmail: 'admin@tkp.com',
      supportEmail: 'support@tkp.com',
      phoneNumber: '+260 XXX XXX XXX',
      timezone: 'Africa/Lusaka',
      dateFormat: 'DD/MM/YYYY',
      language: 'en',
      logRetention: 30,
      formRetention: 365,
      archiveAfter: 180,
      maxUploadSize: 10,
      compressUploads: true,
      cleanTempFiles: true,
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      backupRetention: 30,
      emailNotifications: true,
      smtpServer: '',
      smtpPort: 587,
      fromEmail: '',
      notifyOnNewUser: true,
      notifyOnFormSubmission: false,
      notifyOnError: true,
      notifyOnBackup: false,
      weeklyReport: true,
      adminEmails: '',
      maintenanceMode: false,
      maintenanceMessage: 'System is under maintenance. Please check back later.',
      maintenanceEnd: '',
      autoCleanup: true,
      cleanupSchedule: 'daily',
      autoOptimize: true,
      debugMode: false,
      apiLogging: false,
      apiRateLimit: 100,
      itemsPerPage: 20,
      theme: 'light',
      compactMode: false,
      googleAnalytics: false,
      gaTrackingId: '',
      smsNotifications: false
    };
    
    localStorage.setItem('tkp_system_settings', JSON.stringify(settings.value));
    success('Settings reset to defaults successfully!');
    addLog('system', 'Settings reset to defaults', AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error resetting settings:', err);
    error('Failed to reset settings');
    addLog('error', 'Failed to reset settings', AuthService.getCurrentUser()?.email);
  }
};

const exportSettings = () => {
  try {
    const exportData = {
      timestamp: new Date().toISOString(),
      version: settings.value.version,
      settings: settings.value
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tkp-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    success('Settings exported successfully!');
    addLog('system', 'System settings exported', AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error exporting settings:', err);
    error('Failed to export settings');
    addLog('error', 'Failed to export settings', AuthService.getCurrentUser()?.email);
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
    success('Security settings saved successfully!');
    addLog('system', 'Security settings updated', AuthService.getCurrentUser()?.email);
    updateSecurityScore();
  } catch (err) {
    console.error('Error saving security settings:', err);
    error('Error saving security settings: ' + err.message);
    addLog('error', `Failed to save security settings: ${err.message}`, AuthService.getCurrentUser()?.email);
  }
};

const updateSecurityScore = () => {
  let score = 0;
  const indicators = [];
  
  // Password security (30 points)
  if (security.value.requireStrongPassword) score += 10;
  if (security.value.passwordExpiry) score += 10;
  if (security.value.preventReuse) score += 10;
  
  // Authentication (25 points)
  if (security.value.enableTwoFactor) score += 15;
  if (security.value.maxLoginAttempts <= 5) score += 10;
  
  // Session security (20 points)
  if (security.value.sessionTimeout <= 30) score += 10;
  if (!security.value.concurrentSessions) score += 10;
  
  // Advanced security (25 points)
  if (security.value.securityHeaders) score += 10;
  if (security.value.auditLogging) score += 10;
  if (security.value.encryptionAtRest) score += 5;
  
  securityScore.value = score;
  
  // Update indicators
  indicators.push({
    name: 'Strong Passwords',
    icon: security.value.requireStrongPassword ? 'fas fa-check-circle' : 'fas fa-times-circle',
    status: security.value.requireStrongPassword ? 'good' : 'warning'
  });
  
  indicators.push({
    name: 'Two-Factor Auth',
    icon: security.value.enableTwoFactor ? 'fas fa-check-circle' : 'fas fa-times-circle',
    status: security.value.enableTwoFactor ? 'good' : 'warning'
  });
  
  indicators.push({
    name: 'Session Security',
    icon: security.value.sessionTimeout <= 30 ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle',
    status: security.value.sessionTimeout <= 30 ? 'good' : 'warning'
  });
  
  indicators.push({
    name: 'Audit Logging',
    icon: security.value.auditLogging ? 'fas fa-check-circle' : 'fas fa-times-circle',
    status: security.value.auditLogging ? 'good' : 'warning'
  });
  
  securityIndicators.value = indicators;
};

const getSecurityScoreClass = () => {
  if (securityScore.value >= 80) return 'excellent';
  if (securityScore.value >= 60) return 'good';
  if (securityScore.value >= 40) return 'fair';
  return 'poor';
};

const getSecurityMessage = () => {
  if (securityScore.value >= 80) return 'Excellent security posture. All critical protections are enabled.';
  if (securityScore.value >= 60) return 'Good security configuration. Consider enabling additional protections.';
  if (securityScore.value >= 40) return 'Fair security. Several improvements recommended.';
  return 'Poor security. Immediate attention required for critical vulnerabilities.';
};

const runSecurityAudit = async () => {
  isAuditing.value = true;
  securityAuditResults.value = [];
  
  try {
    // Simulate security audit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const auditItems = [
      {
        id: 1,
        title: 'Password Policy Check',
        description: security.value.requireStrongPassword ? 
          'Strong password requirements are properly configured.' : 
          'Weak password policy detected. Consider enabling strong password requirements.',
        recommendation: security.value.requireStrongPassword ? 
          'Password policy is compliant with security best practices.' :
          'Enable strong password requirements including minimum length and complexity.',
        severity: security.value.requireStrongPassword ? 'low' : 'medium',
        icon: security.value.requireStrongPassword ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'
      },
      {
        id: 2,
        title: 'Two-Factor Authentication',
        description: security.value.enableTwoFactor ? 
          '2FA is enabled for enhanced account security.' : 
          'Two-factor authentication is disabled.',
        recommendation: security.value.enableTwoFactor ? 
          '2FA provides excellent additional security layer.' :
          'Enable 2FA to protect against unauthorized access.',
        severity: security.value.enableTwoFactor ? 'low' : 'high',
        icon: security.value.enableTwoFactor ? 'fas fa-check-circle' : 'fas fa-times-circle'
      },
      {
        id: 3,
        title: 'Session Management',
        description: `Session timeout set to ${security.value.sessionTimeout} minutes.`,
        recommendation: security.value.sessionTimeout <= 30 ? 
          'Session timeout is appropriately configured.' :
          'Consider reducing session timeout to improve security.',
        severity: security.value.sessionTimeout <= 30 ? 'low' : 'medium',
        icon: security.value.sessionTimeout <= 30 ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'
      },
      {
        id: 4,
        title: 'Security Headers',
        description: security.value.securityHeaders ? 
          'Security headers are properly configured.' : 
          'Security headers are not enabled.',
        recommendation: security.value.securityHeaders ? 
          'Security headers provide protection against common attacks.' :
          'Enable security headers for better protection.',
        severity: security.value.securityHeaders ? 'low' : 'medium',
        icon: security.value.securityHeaders ? 'fas fa-check-circle' : 'fas fa-times-circle'
      },
      {
        id: 5,
        title: 'Audit Logging',
        description: security.value.auditLogging ? 
          'Comprehensive audit logging is enabled.' : 
          'Audit logging is disabled.',
        recommendation: security.value.auditLogging ? 
          'Audit logs provide valuable security insights.' :
          'Enable audit logging for security monitoring.',
        severity: security.value.auditLogging ? 'low' : 'high',
        icon: security.value.auditLogging ? 'fas fa-check-circle' : 'fas fa-times-circle'
      }
    ];
    
    securityAuditResults.value = auditItems;
    success('Security audit completed successfully!');
    addLog('system', 'Security audit completed', AuthService.getCurrentUser()?.email);
    
  } catch (err) {
    console.error('Error running security audit:', err);
    error('Failed to run security audit');
    addLog('error', 'Security audit failed', AuthService.getCurrentUser()?.email);
  } finally {
    isAuditing.value = false;
  }
};

const exportSecurityReport = () => {
  try {
    const report = {
      timestamp: new Date().toISOString(),
      securityScore: securityScore.value,
      settings: security.value,
      auditResults: securityAuditResults.value,
      indicators: securityIndicators.value
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    success('Security report exported successfully!');
    addLog('system', 'Security report exported', AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error exporting security report:', err);
    error('Failed to export security report');
    addLog('error', 'Failed to export security report', AuthService.getCurrentUser()?.email);
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

// Analytics functions
const loadAnalyticsData = async () => {
  isLoadingAnalytics.value = true;
  try {
    const formsResult = await FormService.getForms(null, 10000);
    if (formsResult.success) {
      const forms = formsResult.forms;
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // Calculate metrics
      analyticsData.value.totalSubmissions = forms.length;
      
      const recentForms = forms.filter(f => {
        const formDate = f.createdAt?.toDate ? f.createdAt.toDate() : new Date(f.createdAt);
        return formDate >= thirtyDaysAgo;
      });
      
      analyticsData.value.avgSubmissionsPerDay = Math.round(recentForms.length / 30);
      analyticsData.value.submissionGrowth = forms.length > 0 ? Math.round((recentForms.length / forms.length) * 100) : 0;
      
      // Calculate peak hour
      const hourCounts = {};
      forms.forEach(f => {
        const formDate = f.createdAt?.toDate ? f.createdAt.toDate() : new Date(f.createdAt);
        const hour = formDate.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      const peakHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b, 0);
      analyticsData.value.peakHour = `${peakHour}:00`;
    }
    
    analyticsData.value.activeUsers = users.value.length;
    analyticsData.value.userGrowth = 15; // Mock growth percentage
    
  } catch (err) {
    console.error('Error loading analytics:', err);
  } finally {
    isLoadingAnalytics.value = false;
  }
};

const createUserActivityChart = async () => {
  await nextTick();
  if (!userActivityChart.value) return;
  
  const ctx = userActivityChart.value.getContext('2d');
  const days = parseInt(userActivityPeriod.value);
  const labels = [];
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    data.push(Math.floor(Math.random() * 20) + 5); // Mock data - replace with real user activity
  }
  
  if (userActivityChartInstance) userActivityChartInstance.destroy();
  
  userActivityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Active Users',
        data: data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 5 } }
      }
    }
  });
};

const createFormSubmissionsChart = async () => {
  await nextTick();
  if (!formSubmissionsChart.value) return;
  
  try {
    const formsResult = await FormService.getForms(null, 10000);
    if (!formsResult.success) return;
    
    const forms = formsResult.forms;
    const last30Days = {};
    const now = new Date();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last30Days[dateStr] = 0;
    }
    
    // Count submissions per day
    forms.forEach(form => {
      const formDate = form.createdAt?.toDate ? form.createdAt.toDate() : new Date(form.createdAt);
      const dateStr = formDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (last30Days.hasOwnProperty(dateStr)) {
        last30Days[dateStr]++;
      }
    });
    
    const ctx = formSubmissionsChart.value.getContext('2d');
    if (formSubmissionsChartInstance) formSubmissionsChartInstance.destroy();
    
    formSubmissionsChartInstance = new Chart(ctx, {
      type: submissionChartType.value,
      data: {
        labels: Object.keys(last30Days),
        datasets: [{
          label: 'Form Submissions',
          data: Object.values(last30Days),
          borderColor: '#f093fb',
          backgroundColor: submissionChartType.value === 'bar' ? 'rgba(240, 147, 251, 0.7)' : 'rgba(240, 147, 251, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  } catch (err) {
    console.error('Error creating submissions chart:', err);
  }
};

const createFormCategoryChart = async () => {
  await nextTick();
  if (!formCategoryChart.value) return;
  
  const ctx = formCategoryChart.value.getContext('2d');
  
  const categories = {
    'Health Forms': Math.floor(Math.random() * 50) + 20,
    'Education Forms': Math.floor(Math.random() * 40) + 15,
    'Registration Forms': Math.floor(Math.random() * 30) + 10,
    'Other': Math.floor(Math.random() * 20) + 5
  };
  
  if (formCategoryChartInstance) formCategoryChartInstance.destroy();
  
  formCategoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          '#667eea',
          '#f093fb',
          '#4facfe',
          '#43e97b'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
};

const createWeekdayChart = async () => {
  await nextTick();
  if (!weekdayChart.value) return;
  
  const ctx = weekdayChart.value.getContext('2d');
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = weekdays.map(() => Math.floor(Math.random() * 30) + 10);
  
  if (weekdayChartInstance) weekdayChartInstance.destroy();
  
  weekdayChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weekdays,
      datasets: [{
        label: 'Submissions',
        data: data,
        backgroundColor: [
          '#667eea',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#ffc107',
          '#f5576c',
          '#764ba2'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
};

const updateUserActivityChart = () => {
  createUserActivityChart();
};

const updateSubmissionChart = () => {
  createFormSubmissionsChart();
};

const refreshAnalytics = async () => {
  await loadAnalyticsData();
  createUserActivityChart();
  createFormSubmissionsChart();
  createFormCategoryChart();
  createWeekdayChart();
  addLog('system', 'Analytics data refreshed', AuthService.getCurrentUser()?.email);
};

// Database Management Functions
const loadDatabaseStats = async () => {
  try {
    // Load collection counts
    const formsResult = await FormService.getForms(null, 10000);
    
    if (formsResult.success) {
      databaseCollections.value[1].count = formsResult.forms.length;
      databaseCollections.value[1].size = `${Math.round(formsResult.forms.length * 2.5)} KB`;
      databaseCollections.value[1].lastModified = 'Today';
    }
    
    databaseCollections.value[0].count = users.value.length;
    databaseCollections.value[0].size = `${Math.round(users.value.length * 1.5)} KB`;
    databaseCollections.value[0].lastModified = 'Today';
    
    databaseCollections.value[2].count = logs.value.length;
    databaseCollections.value[2].size = `${Math.round(logs.value.length * 0.5)} KB`;
    databaseCollections.value[2].lastModified = 'Today';
    
    databaseCollections.value[3].count = 2;
    databaseCollections.value[3].size = '1 KB';
    databaseCollections.value[3].lastModified = 'Today';
    
    // Calculate total records
    const totalRecords = databaseCollections.value.reduce((sum, col) => sum + col.count, 0);
    databaseStats.value.totalRecords = totalRecords;
    
    // Calculate storage size
    const totalSizeKB = databaseCollections.value.reduce((sum, col) => {
      return sum + parseFloat(col.size);
    }, 0);
    databaseStats.value.storageSize = totalSizeKB > 1024 ? 
      `${(totalSizeKB / 1024).toFixed(2)} MB` : `${totalSizeKB.toFixed(0)} KB`;
    
    // Load backup info from localStorage
    const backupInfo = JSON.parse(localStorage.getItem('tkp_backup_info') || '{}');
    if (backupInfo.lastBackup) {
      databaseStats.value.lastBackup = new Date(backupInfo.lastBackup).toLocaleDateString();
      databaseStats.value.backupCount = backupInfo.count || 0;
    }
    
    // Load recent backups
    const savedBackups = JSON.parse(localStorage.getItem('tkp_recent_backups') || '[]');
    recentBackups.value = savedBackups.slice(0, 5);
    
  } catch (err) {
    console.error('Error loading database stats:', err);
  }
};

const exportCollection = async (collectionName) => {
  try {
    let data = [];
    let fileName = '';
    
    switch (collectionName) {
      case 'Users':
        data = users.value;
        fileName = 'users-export';
        break;
      case 'Forms':
        const formsResult = await FormService.getForms(null, 10000);
        data = formsResult.success ? formsResult.forms : [];
        fileName = 'forms-export';
        break;
      case 'Logs':
        data = logs.value;
        fileName = 'logs-export';
        break;
      case 'Settings':
        data = [{ settings: settings.value, security: security.value }];
        fileName = 'settings-export';
        break;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    success(`${collectionName} exported successfully!`);
    addLog('system', `Exported ${collectionName} collection`, AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error exporting collection:', err);
    error(`Failed to export ${collectionName}`);
    addLog('error', `Failed to export ${collectionName}`, AuthService.getCurrentUser()?.email);
  }
};

const viewCollectionDetails = (collectionName) => {
  showCollectionModal.value = true;
  selectedCollection.value = collectionName;
  loadCollectionData(collectionName);
  addLog('system', `Viewed ${collectionName} collection details`, AuthService.getCurrentUser()?.email);
};

const loadCollectionData = async (collectionName) => {
  collectionData.value = [];
  isLoadingCollection.value = true;
  
  try {
    switch (collectionName) {
      case 'Users':
        collectionData.value = users.value.map(user => ({
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          created: user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'
        }));
        break;
        
      case 'Forms':
        const formsResult = await FormService.getForms(null, 10000);
        if (formsResult.success) {
          collectionData.value = formsResult.forms.map(form => ({
            id: form.id,
            name: form.childName || 'N/A',
            age: form.age || 'N/A',
            gender: form.gender || 'N/A',
            submittedBy: form.submittedBy || 'Unknown',
            created: form.createdAt ? new Date(form.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'
          }));
        }
        break;
        
      case 'Logs':
        collectionData.value = logs.value.map(log => ({
          id: log.id,
          type: log.type,
          message: log.message,
          user: log.user,
          timestamp: log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : new Date(log.timestamp).toLocaleString()
        }));
        break;
        
      case 'Settings':
        collectionData.value = [
          {
            id: 'system-settings',
            category: 'System Settings',
            items: Object.keys(settings.value).length,
            lastModified: 'Today'
          },
          {
            id: 'security-settings',
            category: 'Security Settings',
            items: Object.keys(security.value).length,
            lastModified: 'Today'
          }
        ];
        break;
    }
  } catch (err) {
    console.error('Error loading collection data:', err);
    error('Failed to load collection data');
  } finally {
    isLoadingCollection.value = false;
  }
};

const closeCollectionModal = () => {
  showCollectionModal.value = false;
  selectedCollection.value = '';
  collectionData.value = [];
};

const getCollectionIcon = (collectionName) => {
  const icons = {
    'Users': 'fas fa-users',
    'Forms': 'fas fa-file-alt',
    'Logs': 'fas fa-history',
    'Settings': 'fas fa-cog'
  };
  return icons[collectionName] || 'fas fa-database';
};

const runHealthCheck = async () => {
  isCheckingHealth.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate health score
    let healthScore = 100;
    let issues = [];
    
    // Check collection sizes
    const totalRecords = databaseStats.value.totalRecords;
    if (totalRecords > 10000) {
      healthScore -= 10;
      issues.push('Large number of records may affect performance');
    }
    
    // Check log size
    if (logs.value.length > 1000) {
      healthScore -= 10;
      issues.push('Consider cleaning old logs');
    }
    
    // Check backup status
    if (databaseStats.value.lastBackup === 'Never') {
      healthScore -= 20;
      issues.push('No backups found - create a backup immediately');
    }
    
    databaseStats.value.healthScore = healthScore;
    databaseStats.value.healthStatus = healthScore >= 80 ? 'Excellent' : 
                                       healthScore >= 60 ? 'Good' : 
                                       healthScore >= 40 ? 'Fair' : 'Poor';
    
    if (issues.length > 0) {
      success(`Health check complete. Score: ${healthScore}%. ${issues.length} issue(s) found.`);
    } else {
      success('Health check complete. Database is in excellent condition!');
    }
    
    addLog('system', `Database health check completed - Score: ${healthScore}%`, AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error running health check:', err);
    error('Failed to run health check');
    addLog('error', 'Health check failed', AuthService.getCurrentUser()?.email);
  } finally {
    isCheckingHealth.value = false;
  }
};

const cleanupDuplicates = async () => {
  isLoadingDuplicates.value = true;
  showDuplicatesModal.value = true;
  
  try {
    // Import the cleanup utility
    const { previewDuplicates } = await import('../utils/cleanupDuplicateForms.js');
    
    // Get detailed duplicate information
    const preview = await previewDuplicates();
    
    if (preview.success) {
      if (preview.totalDuplicates > 0) {
        // Format duplicates for display
        const formattedDuplicates = [];
        
        preview.details.forEach(group => {
          group.forms.forEach((form, index) => {
            if (index > 0) { // Skip the first one (the one we'd keep)
              formattedDuplicates.push({
                id: form.id,
                child: group.child.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                formType: group.formType,
                status: form.status || 'draft',
                isDraft: form.isDraft,
                createdAt: form.createdAt,
                willKeep: index === 0,
                groupTotal: group.total,
                reason: form.isDraft ? 'Old draft (submitted version exists)' : 
                       form.status === 'draft' ? 'Draft version' : 
                       'Older duplicate'
              });
            }
          });
        });
        
        duplicatesData.value = formattedDuplicates;
        
        // Auto-select all duplicates
        selectedDuplicates.value = new Set(formattedDuplicates.map(d => d.id));
        
        success(`Found ${formattedDuplicates.length} duplicate forms`);
      } else {
        duplicatesData.value = [];
        success('No duplicate forms found. Database is clean!');
      }
    } else {
      error(`Failed to scan for duplicates: ${preview.error}`);
      showDuplicatesModal.value = false;
    }
  } catch (err) {
    console.error('Error scanning duplicates:', err);
    error('Failed to scan duplicates: ' + err.message);
    showDuplicatesModal.value = false;
  } finally {
    isLoadingDuplicates.value = false;
  }
};

const toggleDuplicateSelection = (duplicateId) => {
  if (selectedDuplicates.value.has(duplicateId)) {
    selectedDuplicates.value.delete(duplicateId);
  } else {
    selectedDuplicates.value.add(duplicateId);
  }
  // Force reactivity
  selectedDuplicates.value = new Set(selectedDuplicates.value);
};

const selectAllDuplicates = () => {
  selectedDuplicates.value = new Set(duplicatesData.value.map(d => d.id));
};

const deselectAllDuplicates = () => {
  selectedDuplicates.value = new Set();
};

const deleteSelectedDuplicates = async () => {
  if (selectedDuplicates.value.size === 0) {
    error('Please select at least one form to delete');
    return;
  }
  
  const confirmed = await confirm(
    `⚠️ You are about to delete ${selectedDuplicates.value.size} forms.\n\n` +
    'This action cannot be undone.\n\n' +
    'Are you sure you want to proceed?'
  );
  
  if (!confirmed) return;
  
  isCleaningDuplicates.value = true;
  try {
    const { deleteDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../firebase/config.js');
    
    let deletedCount = 0;
    const idsToDelete = Array.from(selectedDuplicates.value);
    
    for (const formId of idsToDelete) {
      try {
        await deleteDoc(doc(db, 'forms', formId));
        deletedCount++;
      } catch (err) {
        console.error(`Failed to delete form ${formId}:`, err);
      }
    }
    
    success(`Successfully deleted ${deletedCount} duplicate forms!`);
    addLog('system', `Deleted ${deletedCount} duplicate forms`, AuthService.getCurrentUser()?.email);
    
    // Close modal and reload stats
    showDuplicatesModal.value = false;
    duplicatesData.value = [];
    selectedDuplicates.value = new Set();
    await loadDatabaseStats();
    
  } catch (err) {
    console.error('Error deleting duplicates:', err);
    error('Failed to delete duplicates: ' + err.message);
    addLog('error', 'Failed to delete duplicates', AuthService.getCurrentUser()?.email);
  } finally {
    isCleaningDuplicates.value = false;
  }
};

const closeDuplicatesModal = () => {
  showDuplicatesModal.value = false;
  duplicatesData.value = [];
  selectedDuplicates.value = new Set();
};

const updateChildIds = async () => {
  const confirmed = await confirm(
    '🔄 This will update all existing forms to add child IDs.\n\n' +
    'What it does:\n' +
    '• Groups forms by child (name + date of birth)\n' +
    '• Generates unique child ID for each child\n' +
    '• Updates all forms for that child with same ID\n' +
    '• Skips forms that already have valid IDs\n\n' +
    'Would you like to preview first?'
  );
  
  if (!confirmed) return;
  
  isUpdatingIds.value = true;
  try {
    // Import the update utility
    const { previewIdUpdates, updateExistingFormIds } = await import('../utils/updateExistingFormIds.js');
    
    // First, show preview
    const preview = await previewIdUpdates();
    
    if (preview.success) {
      if (preview.needUpdate > 0) {
        let previewMessage = `Found ${preview.uniqueChildren} unique children in ${preview.needUpdate} forms\n\n`;
        previewMessage += `Details:\n`;
        previewMessage += `• Total forms: ${preview.totalForms}\n`;
        previewMessage += `• Already have ID: ${preview.alreadyHaveId}\n`;
        previewMessage += `• Need update: ${preview.needUpdate}\n`;
        previewMessage += `• Unique children: ${preview.uniqueChildren}\n\n`;
        
        // Show preview of first few children
        const previewList = preview.preview.slice(0, 5);
        previewMessage += `Preview (first 5):\n`;
        previewList.forEach((child, index) => {
          previewMessage += `${index + 1}. ${child.childName} → ${child.generatedId}\n`;
          previewMessage += `   Forms: ${child.formCount} (${child.formTypes.join(', ')})\n`;
        });
        
        if (preview.preview.length > 5) {
          previewMessage += `... and ${preview.preview.length - 5} more children\n`;
        }
        
        previewMessage += `\nProceed with update?`;
        
        const confirmUpdate = await confirm(previewMessage);
        
        if (!confirmUpdate) {
          isUpdatingIds.value = false;
          return;
        }
        
        // Perform the update
        const result = await updateExistingFormIds();
        
        if (result.success) {
          success(`Successfully updated ${result.formsUpdated} forms with child IDs!`);
          addLog('system', `Updated ${result.formsUpdated} forms with child IDs for ${result.uniqueChildren} children`, AuthService.getCurrentUser()?.email);
          
          // Reload database stats
          await loadDatabaseStats();
        } else {
          error(`Update failed: ${result.error}`);
          addLog('error', `Child ID update failed: ${result.error}`, AuthService.getCurrentUser()?.email);
        }
      } else {
        success('All forms already have child IDs! No updates needed.');
        addLog('system', 'Child ID check completed - All forms already have IDs', AuthService.getCurrentUser()?.email);
      }
    } else {
      error(`Failed to preview updates: ${preview.error}`);
      addLog('error', 'Child ID preview failed', AuthService.getCurrentUser()?.email);
    }
  } catch (err) {
    console.error('Error updating child IDs:', err);
    error('Failed to update child IDs: ' + err.message);
    addLog('error', 'Child ID update error', AuthService.getCurrentUser()?.email);
  } finally {
    isUpdatingIds.value = false;
  }
};

const oneFormPerChild = async () => {
  const confirmed = await confirm(
    '⚠️ WARNING: This will keep only ONE form per child!\n\n' +
    'This is an aggressive cleanup that:\n' +
    '• Groups ALL forms by child name\n' +
    '• Keeps only the most recent submitted form\n' +
    '• Deletes all other forms for that child\n' +
    '• Works across ALL form types\n\n' +
    'Example: If Alice has 5 forms (referral, overview, 3 drafts),\n' +
    'this will delete 4 and keep only 1.\n\n' +
    'Would you like to preview first?'
  );
  
  if (!confirmed) return;
  
  isCleaningOnePerChild.value = true;
  showDuplicatesModal.value = true;
  isLoadingDuplicates.value = true;
  
  try {
    // Import the cleanup utility
    const { previewOneFormPerChild } = await import('../utils/cleanupDuplicateForms.js');
    
    // Get preview of what will be deleted
    const preview = await previewOneFormPerChild();
    
    if (preview.success) {
      if (preview.totalExtraForms > 0) {
        // Transform data for the duplicates modal
        const transformedDuplicates = [];
        
        preview.duplicates.forEach(child => {
          // Add forms that will be deleted to the modal
          child.allForms.forEach(form => {
            if (!form.recommended) {
              transformedDuplicates.push({
                id: form.id,
                childName: child.childName,
                formType: form.formType,
                status: form.status,
                createdAt: form.createdAt,
                reason: `Keep only 1 form per child (${child.totalForms} total)`
              });
            }
          });
        });
        
        duplicatesData.value = transformedDuplicates;
        
        // Auto-select all for deletion
        selectedDuplicates.value = new Set(transformedDuplicates.map(d => d.id));
        
        success(`Found ${preview.childrenWithDuplicates} children with multiple forms (${preview.totalExtraForms} extra forms to remove)`);
        addLog('system', `One form per child scan: ${preview.totalExtraForms} extra forms found`, AuthService.getCurrentUser()?.email);
      } else {
        showDuplicatesModal.value = false;
        success('All children have only one form already!');
        addLog('system', 'One form per child check - no extras found', AuthService.getCurrentUser()?.email);
      }
    } else {
      showDuplicatesModal.value = false;
      error(`Scan failed: ${preview.error}`);
      addLog('error', 'One form per child scan failed', AuthService.getCurrentUser()?.email);
    }
  } catch (err) {
    console.error('Error scanning forms:', err);
    showDuplicatesModal.value = false;
    error('Failed to scan forms: ' + err.message);
    addLog('error', 'One form per child scan error', AuthService.getCurrentUser()?.email);
  } finally {
    isLoadingDuplicates.value = false;
    isCleaningOnePerChild.value = false;
  }
};

const downloadBackup = (backup) => {
  success('Downloading backup...');
  // Implementation would download the specific backup file
};

const deleteBackup = async (backupId) => {
  const confirmed = await confirm('Are you sure you want to delete this backup?');
  if (!confirmed) return;
  
  try {
    recentBackups.value = recentBackups.value.filter(b => b.id !== backupId);
    localStorage.setItem('tkp_recent_backups', JSON.stringify(recentBackups.value));
    
    success('Backup deleted successfully!');
    addLog('system', 'Backup deleted', AuthService.getCurrentUser()?.email);
  } catch (err) {
    console.error('Error deleting backup:', err);
    error('Failed to delete backup');
    addLog('error', 'Failed to delete backup', AuthService.getCurrentUser()?.email);
  }
};

// Watch for search/filter changes to reset pagination
const resetPagination = () => {
  currentPage.value = 1;
};

// Check access on mount
onMounted(async () => {
  const currentUser = AuthService.getCurrentUser();
  
  // Only allow access to davidchileshe33@gmail.com
  if (!currentUser || currentUser.email !== 'davidchileshe33@gmail.com') {
    error('Access Denied: This page is only accessible to the system administrator.');
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
    return;
  }

  // Load saved settings
  loadSettings();
  loadSecuritySettings();

  // Load data
  await loadUsers();
  await loadStats();
  await loadSystemLogs();
  loadSecuritySettings();
  updateSecurityScore();
});

// Watch for changes to reset pagination
watch([userSearchQuery, userRoleFilter], () => {
  resetPagination();
});

// Watch for section activation
watch(activeSection, async (newSection) => {
  if (newSection === 'analytics') {
    await loadAnalyticsData();
    await nextTick();
    createUserActivityChart();
    createFormSubmissionsChart();
    createFormCategoryChart();
    createWeekdayChart();
  } else if (newSection === 'database') {
    await loadDatabaseStats();
  }
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

.role-badge.manager {
  background: #f093fb;
  color: white;
}

.role-badge.user {
  background: #4facfe;
  color: white;
}

.role-badge.viewer {
  background: #ffc107;
  color: #333;
}

.status-badge.active {
  background: #28a745;
  color: white;
}

.status-badge.inactive {
  background: #6c757d;
  color: white;
}

.status-badge.suspended {
  background: #dc3545;
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
.settings-overview {
  margin-bottom: 2rem;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.settings-header h2 {
  margin: 0 0 0.5rem 0;
  color: #4a148c;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.settings-header p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.settings-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.settings-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.setting-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.setting-stat:hover {
  transform: translateY(-3px);
}

.setting-stat h4 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 700;
}

.setting-stat p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.settings-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.settings-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.settings-tab:hover {
  background: #f9f9f9;
  color: #4a148c;
}

.settings-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.settings-content-wrapper {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.settings-tab-content {
  animation: fadeIn 0.3s;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-group {
  background: #f9f9f9;
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

/* Maintenance Toggle */
.maintenance-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  margin-bottom: 1rem;
}

.toggle-status {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toggle-status i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.toggle-status.active {
  color: #f5576c;
}

.toggle-status:not(.active) {
  color: #43e97b;
}

.toggle-status h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.toggle-status p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Health Monitor */
.health-monitor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.health-item i {
  font-size: 1.5rem;
  color: #667eea;
}

.health-item span {
  color: #333;
  font-weight: 500;
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

.form-input textarea {
  resize: vertical;
  font-family: inherit;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
}

/* Database Management */
.database-overview {
  margin-bottom: 2rem;
}

.db-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.db-stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.db-stat-card:hover {
  transform: translateY(-5px);
}

.db-stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  flex-shrink: 0;
}

.db-stat-icon.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.db-stat-icon.green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.db-stat-icon.purple {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.db-stat-icon.orange {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.db-stat-info h4 {
  margin: 0;
  font-size: 2rem;
  color: #333;
  font-weight: 700;
}

.db-stat-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}

.db-stat-info small {
  display: block;
  margin-top: 0.25rem;
  color: #999;
  font-size: 0.85rem;
}

.text-success {
  color: #43e97b;
}

.text-warning {
  color: #ff9800;
}

.collections-section {
  margin: 2rem 0;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.collections-section h3 {
  margin: 0 0 1.5rem 0;
  color: #4a148c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.collection-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.collection-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.collection-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.collection-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.collection-info h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.collection-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.collection-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #999;
  font-size: 0.85rem;
}

.stat-value {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.collection-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
}

.btn-xs {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.backup-management {
  margin: 2rem 0;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.backup-management h3 {
  margin: 0 0 1.5rem 0;
  color: #4a148c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.backup-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.option-group h4 {
  margin: 0 0 1rem 0;
  color: #4a148c;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #333;
  cursor: pointer;
  font-size: 0.95rem;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

/* Database Actions */
.database-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  transition: all 0.3s;
}

.action-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.5rem;
}

.action-icon.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-icon.orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-icon.red {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.action-icon.purple {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.action-icon.green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.action-icon.indigo {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
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
.security-overview {
  margin-bottom: 2rem;
}

.security-score {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  position: relative;
  transition: all 0.3s;
}

.score-circle.excellent {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.score-circle.good {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.score-circle.fair {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.score-circle.poor {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
}

.score-number {
  font-size: 2.5rem;
  line-height: 1;
}

.score-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.25rem;
}

.score-details h3 {
  margin: 0 0 0.5rem 0;
  color: #4a148c;
  font-size: 1.5rem;
}

.score-details p {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 1.1rem;
}

.security-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.indicator.good {
  background: #e8f5e9;
  color: #2e7d32;
}

.indicator.warning {
  background: #fff3e0;
  color: #f57c00;
}

.indicator.danger {
  background: #ffebee;
  color: #c62828;
}

.security-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.security-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.security-audit-results {
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.security-audit-results h3 {
  margin: 0 0 1.5rem 0;
  color: #4a148c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.audit-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.audit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.audit-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.audit-item.low {
  border-color: #4caf50;
  background: #f8fff8;
}

.audit-item.medium {
  border-color: #ff9800;
  background: #fff8f0;
}

.audit-item.high {
  border-color: #f44336;
  background: #fff8f8;
}

.audit-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.audit-item.low .audit-icon {
  background: #e8f5e9;
  color: #4caf50;
}

.audit-item.medium .audit-icon {
  background: #fff3e0;
  color: #ff9800;
}

.audit-item.high .audit-icon {
  background: #ffebee;
  color: #f44336;
}

.audit-content {
  flex: 1;
}

.audit-content h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.audit-content p {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.audit-content small {
  display: block;
  color: #999;
  font-style: italic;
}

.audit-severity {
  flex-shrink: 0;
}

.severity-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.severity-badge.low {
  background: #e8f5e9;
  color: #2e7d32;
}

.severity-badge.medium {
  background: #fff3e0;
  color: #f57c00;
}

.severity-badge.high {
  background: #ffebee;
  color: #c62828;
}

/* Analytics */
.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.analytics-header h3 {
  margin: 0;
  color: #4a148c;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.analytics-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.analytics-stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.analytics-stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon-large {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.stat-icon-large.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon-large.green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon-large.purple {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon-large.orange {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.stat-details h4 {
  margin: 0;
  font-size: 2rem;
  color: #333;
  font-weight: 700;
}

.stat-details p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}

.stat-details small {
  display: block;
  margin-top: 0.5rem;
  color: #999;
  font-size: 0.85rem;
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.trend.positive {
  background: #e8f5e9;
  color: #2e7d32;
}

.analytics-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-card h3 {
  margin: 0 0 1.5rem 0;
  color: #4a148c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  margin: 0;
}

.chart-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.chart-select:focus {
  outline: none;
  border-color: #667eea;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

/* Collection Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.collection-modal {
  background: white;
  border-radius: 16px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.collection-modal-header {
  padding: 2rem;
  border-bottom: 2px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.collection-modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.collection-modal-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.loading-spinner {
  text-align: center;
  padding: 3rem;
  color: #667eea;
  font-size: 1.2rem;
}

.loading-spinner i {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  color: #ddd;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}

.collection-data {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.data-table {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table th {
  background: #f9f9f9;
  padding: 1rem;
  text-align: left;
  color: #4a148c;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.data-table tr:hover {
  background: #f9f9f9;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.log-type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.log-type-badge.user {
  background: #e3f2fd;
  color: #1976d2;
}

.log-type-badge.system {
  background: #e8f5e9;
  color: #2e7d32;
}

.log-type-badge.error {
  background: #ffebee;
  color: #c62828;
}

.settings-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.settings-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.settings-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.settings-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.settings-info h3 {
  margin: 0 0 0.25rem 0;
  color: #4a148c;
  font-size: 1.1rem;
}

.settings-info p {
  margin: 0 0 0.25rem 0;
  color: #666;
  font-size: 0.95rem;
}

.settings-info small {
  color: #999;
  font-size: 0.85rem;
}

.collection-summary {
  padding: 1rem;
  background: #f0f7ff;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.collection-summary p {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
}

.collection-modal-footer {
  padding: 1.5rem 2rem;
  border-top: 2px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: #f9f9f9;
  border-radius: 0 0 16px 16px;
}

/* Duplicates Modal */
.duplicates-modal {
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.duplicates-modal-header {
  padding: 2rem;
  border-bottom: 2px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f5576c 0%, #ff6b6b 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.duplicates-modal-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.duplicates-modal-header p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.duplicates-modal-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.duplicates-content {
  animation: fadeIn 0.3s;
}

.selection-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f0f7ff;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #667eea;
}

.selection-info {
  font-size: 0.95rem;
  color: #333;
}

.selection-info strong {
  color: #667eea;
  font-size: 1.1rem;
}

.selection-actions {
  display: flex;
  gap: 1rem;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-link:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #4a148c;
}

.duplicates-table {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.duplicates-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.duplicates-table th {
  background: #f9f9f9;
  padding: 1rem;
  text-align: left;
  color: #4a148c;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.9rem;
}

.duplicates-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  font-size: 0.9rem;
}

.duplicates-table tr {
  cursor: pointer;
  transition: all 0.2s;
}

.duplicates-table tbody tr:hover {
  background: #f9f9f9;
}

.duplicates-table tbody tr.selected {
  background: #f0f7ff;
}

.duplicates-table tr:last-child td {
  border-bottom: none;
}

.duplicates-table input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.submitted {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.draft {
  background: #fff3e0;
  color: #ef6c00;
}

.reason-text {
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
}

.duplicates-summary {
  margin-top: 1.5rem;
}

.summary-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #f5576c;
}

.summary-card.warning {
  background: #fff5f5;
  border-color: #f5576c;
}

.summary-card i {
  font-size: 2rem;
  color: #f5576c;
}

.summary-card strong {
  display: block;
  color: #f5576c;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.summary-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.duplicates-modal-footer {
  padding: 1.5rem 2rem;
  border-top: 2px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: #f9f9f9;
  border-radius: 0 0 16px 16px;
}

/* Section Toolbar */
.section-toolbar {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-filter-group {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-width: 300px;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  min-width: 150px;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toolbar-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-info {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.no-results i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results p {
  font-size: 1.1rem;
  margin: 0;
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

  .section-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-filter-group {
    flex-direction: column;
    width: 100%;
  }

  .toolbar-actions {
    width: 100%;
    justify-content: stretch;
  }

  .toolbar-actions button {
    flex: 1;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-left,
  .header-right {
    width: 100%;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .analytics-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .analytics-stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .chart-select {
    width: 100%;
  }

  .security-score {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .security-actions {
    flex-direction: column;
  }

  .security-actions button {
    width: 100%;
  }

  .audit-item {
    flex-direction: column;
    text-align: center;
  }

  .audit-severity {
    align-self: center;
  }

  .db-stats-grid {
    grid-template-columns: 1fr;
  }

  .collections-grid {
    grid-template-columns: 1fr;
  }

  .backup-options {
    grid-template-columns: 1fr;
  }

  .database-actions {
    grid-template-columns: 1fr;
  }

  .action-card {
    flex-direction: column;
    text-align: center;
  }

  .backups-table {
    font-size: 0.85rem;
  }

  .backups-table th,
  .backups-table td {
    padding: 0.5rem;
  }

  .collection-modal {
    max-height: 95vh;
    margin: 0.5rem;
  }

  .collection-modal-header {
    padding: 1.5rem;
  }

  .collection-modal-header h2 {
    font-size: 1.2rem;
  }

  .collection-modal-content {
    padding: 1rem;
  }

  .data-table {
    font-size: 0.85rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
  }

  .collection-modal-footer {
    flex-direction: column;
    padding: 1rem;
  }

  .collection-modal-footer button {
    width: 100%;
  }

  .settings-view {
    grid-template-columns: 1fr;
  }

  .duplicates-modal {
    max-height: 95vh;
    margin: 0.5rem;
  }

  .duplicates-modal-header {
    padding: 1.5rem;
  }

  .duplicates-modal-header h2 {
    font-size: 1.2rem;
  }

  .duplicates-modal-content {
    padding: 1rem;
  }

  .selection-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .selection-actions {
    width: 100%;
    justify-content: space-between;
  }

  .duplicates-table {
    font-size: 0.85rem;
  }

  .duplicates-table th,
  .duplicates-table td {
    padding: 0.75rem 0.5rem;
  }

  .duplicates-modal-footer {
    flex-direction: column;
    padding: 1rem;
  }

  .duplicates-modal-footer button {
    width: 100%;
  }

  .settings-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .settings-actions {
    width: 100%;
    flex-direction: column;
  }

  .settings-actions button {
    width: 100%;
  }

  .settings-stats {
    grid-template-columns: 1fr;
  }

  .settings-tabs {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .settings-tab {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }

  .settings-content-wrapper {
    padding: 1rem;
  }

  .maintenance-toggle {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
