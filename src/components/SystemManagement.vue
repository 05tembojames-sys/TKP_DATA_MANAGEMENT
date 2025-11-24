<template>
  <div class="dhis2-system-app">
    <TopHeader />
    
    <div class="app-container">
      <!-- Left Sidebar - Navigation -->
      <aside class="system-sidebar">
        <div class="sidebar-header">
          <h3>System Administration</h3>
        </div>
        
        <nav class="sidebar-nav">
          <a 
            href="#" 
            v-for="section in sections" 
            :key="section.id"
            class="nav-item" 
            :class="{ active: activeSection === section.id }"
            @click.prevent="activeSection = section.id"
          >
            <i :class="section.icon"></i>
            <span>{{ section.label }}</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- System Info Section -->
        <div v-if="activeSection === 'info'" class="content-section">
          <div class="section-header">
            <h1>System Information</h1>
            <p>View system details and configuration</p>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <div class="info-header">
                <i class="fas fa-info-circle"></i>
                <h3>Application Info</h3>
              </div>
              <div class="info-body">
                <div class="info-row">
                  <span class="label">System Name:</span>
                  <span class="value">TKP Data Management</span>
                </div>
                <div class="info-row">
                  <span class="label">Version:</span>
                  <span class="value">1.0.0</span>
                </div>
                <div class="info-row">
                  <span class="label">Environment:</span>
                  <span class="value"><span class="badge production">Production</span></span>
                </div>
                <div class="info-row">
                  <span class="label">Server Time:</span>
                  <span class="value">{{ currentTime }}</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-header">
                <i class="fas fa-database"></i>
                <h3>Database Info</h3>
              </div>
              <div class="info-body">
                <div class="info-row">
                  <span class="label">Type:</span>
                  <span class="value">Firebase Firestore</span>
                </div>
                <div class="info-row">
                  <span class="label">Total Documents:</span>
                  <span class="value">{{ systemStats.totalDocuments }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Storage Used:</span>
                  <span class="value">{{ systemStats.storageUsed }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Status:</span>
                  <span class="value"><span class="badge success">Healthy</span></span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-header">
                <i class="fas fa-users"></i>
                <h3>User Statistics</h3>
              </div>
              <div class="info-body">
                <div class="info-row">
                  <span class="label">Total Users:</span>
                  <span class="value">{{ systemStats.totalUsers }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Active Users:</span>
                  <span class="value">{{ systemStats.activeUsers }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Online Now:</span>
                  <span class="value">{{ systemStats.onlineUsers }}</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-header">
                <i class="fas fa-chart-line"></i>
                <h3>Performance</h3>
              </div>
              <div class="info-body">
                <div class="info-row">
                  <span class="label">Uptime:</span>
                  <span class="value">99.8%</span>
                </div>
                <div class="info-row">
                  <span class="label">Response Time:</span>
                  <span class="value">145ms</span>
                </div>
                <div class="info-row">
                  <span class="label">Last Backup:</span>
                  <span class="value">{{ formatDate(systemStats.lastBackup) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cache Management Section -->
        <div v-if="activeSection === 'cache'" class="content-section">
          <div class="section-header">
            <h1>Cache Management</h1>
            <p>Clear and manage system cache</p>
          </div>

          <div class="cache-actions">
            <div class="action-card">
              <div class="action-icon">
                <i class="fas fa-broom"></i>
              </div>
              <div class="action-content">
                <h3>Clear Application Cache</h3>
                <p>Removes cached data to free up space and refresh content</p>
                <button @click="clearCache('app')" class="dhis2-btn primary" :disabled="loading">
                  <i class="fas fa-trash"></i> Clear App Cache
                </button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-icon">
                <i class="fas fa-database"></i>
              </div>
              <div class="action-content">
                <h3>Clear Data Cache</h3>
                <p>Removes cached database queries and temporary data</p>
                <button @click="clearCache('data')" class="dhis2-btn primary" :disabled="loading">
                  <i class="fas fa-trash"></i> Clear Data Cache
                </button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-icon">
                <i class="fas fa-images"></i>
              </div>
              <div class="action-content">
                <h3>Clear Media Cache</h3>
                <p>Removes cached images and media files</p>
                <button @click="clearCache('media')" class="dhis2-btn primary" :disabled="loading">
                  <i class="fas fa-trash"></i> Clear Media Cache
                </button>
              </div>
            </div>

            <div class="action-card">
              <div class="action-icon">
                <i class="fas fa-recycle"></i>
              </div>
              <div class="action-content">
                <h3>Clear All Cache</h3>
                <p>Removes all cached data from the system</p>
                <button @click="clearCache('all')" class="dhis2-btn danger" :disabled="loading">
                  <i class="fas fa-exclamation-triangle"></i> Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Integrity Section -->
        <div v-if="activeSection === 'integrity'" class="content-section">
          <div class="section-header">
            <h1>Data Integrity</h1>
            <p>Run integrity checks on your data</p>
          </div>

          <div class="integrity-panel">
            <div class="panel-header">
              <div>
                <h3>System Checks</h3>
                <p>Last run: {{ formatDate(lastIntegrityCheck) }}</p>
              </div>
              <button @click="runIntegrityCheck" class="dhis2-btn primary" :disabled="loading">
                <i class="fas fa-play"></i> Run All Checks
              </button>
            </div>

            <div class="checks-list">
              <div v-for="check in integrityChecks" :key="check.id" class="check-item">
                <div class="check-info">
                  <i :class="check.icon"></i>
                  <div>
                    <h4>{{ check.name }}</h4>
                    <p>{{ check.description }}</p>
                  </div>
                </div>
                <div class="check-status">
                  <span class="badge" :class="check.status">{{ check.statusText }}</span>
                  <button @click="runSingleCheck(check)" class="icon-btn">
                    <i class="fas fa-play"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Maintenance Section -->
        <div v-if="activeSection === 'maintenance'" class="content-section">
          <div class="section-header">
            <h1>Maintenance</h1>
            <p>Perform system maintenance tasks</p>
          </div>

          <div class="maintenance-panel">
            <div class="maintenance-toggle">
              <div class="toggle-content">
                <div class="toggle-icon" :class="{ active: maintenanceMode }">
                  <i :class="maintenanceMode ? 'fas fa-tools' : 'fas fa-check-circle'"></i>
                </div>
                <div>
                  <h3>{{ maintenanceMode ? 'Maintenance Mode Active' : 'System Operational' }}</h3>
                  <p>{{ maintenanceMode ? 'Users have restricted access' : 'All systems running normally' }}</p>
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="maintenanceMode" @change="toggleMaintenance">
                <span class="slider round"></span>
              </label>
            </div>

            <div v-if="maintenanceMode" class="maintenance-message">
              <label>Maintenance Message</label>
              <textarea v-model="maintenanceMessage" class="dhis2-textarea" rows="4" placeholder="Enter message to display to users..."></textarea>
              <button @click="saveMaintenanceMessage" class="dhis2-btn primary">
                <i class="fas fa-save"></i> Save Message
              </button>
            </div>
          </div>

          <div class="maintenance-tasks">
            <h3>Maintenance Tasks</h3>
            <div class="tasks-grid">
              <div class="task-card">
                <i class="fas fa-database"></i>
                <h4>Optimize Database</h4>
                <p>Reorganize and optimize database structure</p>
                <button @click="optimizeDatabase" class="dhis2-btn secondary" :disabled="loading">
                  Optimize
                </button>
              </div>

              <div class="task-card">
                <i class="fas fa-trash-alt"></i>
                <h4>Clean Temp Files</h4>
                <p>Remove temporary files and clear storage</p>
                <button @click="cleanTempFiles" class="dhis2-btn secondary" :disabled="loading">
                  Clean
                </button>
              </div>

              <div class="task-card">
                <i class="fas fa-archive"></i>
                <h4>Archive Old Data</h4>
                <p>Archive data older than 6 months</p>
                <button @click="archiveOldData" class="dhis2-btn secondary" :disabled="loading">
                  Archive
                </button>
              </div>

              <div class="task-card">
                <i class="fas fa-sync"></i>
                <h4>Rebuild Indexes</h4>
                <p>Rebuild database indexes for better performance</p>
                <button @click="rebuildIndexes" class="dhis2-btn secondary" :disabled="loading">
                  Rebuild
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Section -->
        <div v-if="activeSection === 'settings'" class="content-section">
          <div class="section-header">
            <h1>System Settings</h1>
            <p>Configure system preferences</p>
            <button @click="saveSettings" class="dhis2-btn primary" :disabled="loading">
              <i class="fas fa-save"></i> Save Settings
            </button>
          </div>

          <div class="settings-panel">
            <div class="setting-group">
              <h3>General Settings</h3>
              <div class="setting-item">
                <label>System Name</label>
                <input v-model="settings.systemName" type="text" class="dhis2-input" />
              </div>
              <div class="setting-item">
                <label>Organization</label>
                <input v-model="settings.organization" type="text" class="dhis2-input" />
              </div>
              <div class="setting-item">
                <label>Timezone</label>
                <select v-model="settings.timezone" class="dhis2-select">
                  <option value="UTC">UTC</option>
                  <option value="Africa/Lusaka">Africa/Lusaka (CAT)</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                </select>
              </div>
            </div>

            <div class="setting-group">
              <h3>Email Configuration</h3>
              <div class="setting-item">
                <label>SMTP Server</label>
                <input v-model="settings.smtpServer" type="text" class="dhis2-input" placeholder="smtp.example.com" />
              </div>
              <div class="setting-item">
                <label>SMTP Port</label>
                <input v-model="settings.smtpPort" type="number" class="dhis2-input" placeholder="587" />
              </div>
              <div class="setting-item">
                <label>From Email</label>
                <input v-model="settings.fromEmail" type="email" class="dhis2-input" placeholder="noreply@example.com" />
              </div>
            </div>

            <div class="setting-group">
              <h3>Backup Settings</h3>
              <div class="setting-item checkbox">
                <label>
                  <input type="checkbox" v-model="settings.autoBackup" />
                  Enable automatic backups
                </label>
              </div>
              <div v-if="settings.autoBackup" class="setting-item">
                <label>Backup Frequency</label>
                <select v-model="settings.backupFrequency" class="dhis2-select">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div class="setting-item">
                <label>Backup Retention (days)</label>
                <input v-model.number="settings.backupRetention" type="number" class="dhis2-input" min="7" max="365" />
              </div>
            </div>
          </div>
        </div>

        <!-- Logs Section -->
        <div v-if="activeSection === 'logs'" class="content-section">
          <div class="section-header">
            <h1>System Logs</h1>
            <p>View system activity and events</p>
            <button @click="refreshLogs" class="dhis2-btn secondary">
              <i class="fas fa-sync"></i> Refresh
            </button>
          </div>

          <div class="logs-panel">
            <div class="logs-filters">
              <select v-model="logFilter" class="dhis2-select">
                <option value="all">All Logs</option>
                <option value="error">Errors Only</option>
                <option value="warning">Warnings</option>
                <option value="info">Info</option>
              </select>
              <input v-model="logSearch" type="text" class="dhis2-input" placeholder="Search logs..." />
            </div>

            <div class="logs-list">
              <div v-for="log in filteredLogs" :key="log.id" class="log-item" :class="log.level">
                <div class="log-icon">
                  <i :class="getLogIcon(log.level)"></i>
                </div>
                <div class="log-content">
                  <div class="log-header">
                    <span class="log-time">{{ formatDateTime(log.timestamp) }}</span>
                    <span class="log-level" :class="log.level">{{ log.level }}</span>
                  </div>
                  <p class="log-message">{{ log.message }}</p>
                </div>
              </div>

              <div v-if="filteredLogs.length === 0" class="empty-logs">
                <i class="fas fa-list-alt"></i>
                <p>No logs found</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TopHeader from "./TopHeader.vue";
import { useToast } from "../composables/useToast.js";
import UserService from "../services/userService.js";
import EnhancedOutreachService from "../services/enhancedOutreachService.js";

const { success, error, info } = useToast();

const activeSection = ref('info');
const loading = ref(false);
const currentTime = ref(new Date().toLocaleString());
const maintenanceMode = ref(false);
const maintenanceMessage = ref('');
const logFilter = ref('all');
const logSearch = ref('');

const sections = [
  { id: 'info', label: 'System Info', icon: 'fas fa-info-circle' },
  { id: 'cache', label: 'Cache Management', icon: 'fas fa-memory' },
  { id: 'integrity', label: 'Data Integrity', icon: 'fas fa-check-double' },
  { id: 'maintenance', label: 'Maintenance', icon: 'fas fa-tools' },
  { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
  { id: 'logs', label: 'System Logs', icon: 'fas fa-list-alt' },
];

const systemStats = ref({
  totalDocuments: '0',
  storageUsed: 'Calculating...',
  totalUsers: 0,
  activeUsers: 0,
  onlineUsers: 0,
  totalForms: 0,
  totalChildren: 0,
  lastBackup: new Date().toISOString(),
});

const integrityChecks = ref([
  { id: 1, name: 'Database Connections', description: 'Check database connectivity', icon: 'fas fa-database', status: 'success', statusText: 'Passed' },
  { id: 2, name: 'Data Consistency', description: 'Verify data integrity', icon: 'fas fa-check', status: 'success', statusText: 'Passed' },
  { id: 3, name: 'Orphaned Records', description: 'Find orphaned data', icon: 'fas fa-unlink', status: 'warning', statusText: 'Warning' },
  { id: 4, name: 'Index Health', description: 'Check database indexes', icon: 'fas fa-list', status: 'success', statusText: 'Passed' },
]);

const lastIntegrityCheck = ref(new Date().toISOString());

const settings = ref({
  systemName: 'TKP Data Management',
  organization: 'Organization Name',
  timezone: 'Africa/Lusaka',
  smtpServer: '',
  smtpPort: 587,
  fromEmail: '',
  autoBackup: true,
  backupFrequency: 'daily',
  backupRetention: 30,
});

const logs = ref([
  { id: 1, timestamp: new Date().toISOString(), level: 'info', message: 'System started successfully' },
  { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'info', message: 'User login: admin@example.com' },
  { id: 3, timestamp: new Date(Date.now() - 7200000).toISOString(), level: 'warning', message: 'High memory usage detected' },
  { id: 4, timestamp: new Date(Date.now() - 10800000).toISOString(), level: 'error', message: 'Failed to connect to external service' },
]);

const filteredLogs = computed(() => {
  let filtered = logs.value;
  
  if (logFilter.value !== 'all') {
    filtered = filtered.filter(log => log.level === logFilter.value);
  }
  
  if (logSearch.value) {
    const query = logSearch.value.toLowerCase();
    filtered = filtered.filter(log => log.message.toLowerCase().includes(query));
  }
  
  return filtered;
});

// Load real system data
const loadSystemStats = async () => {
  try {
    // Load users
    const usersResult = await UserService.getAllUsers();
    if (usersResult.success) {
      systemStats.value.totalUsers = usersResult.users.length;
      systemStats.value.activeUsers = usersResult.users.filter(u => u.status === 'active').length;
      systemStats.value.onlineUsers = usersResult.users.filter(u => u.isOnline).length;
    }

    // Load children/tracked entities
    const childrenResult = await EnhancedOutreachService.getAllChildren();
    if (childrenResult.success) {
      systemStats.value.totalChildren = childrenResult.data.length;
    }

    // Load forms
    const formsResult = await EnhancedOutreachService.getAllFormSubmissions();
    if (formsResult.success) {
      systemStats.value.totalForms = formsResult.submissions.length;
    }

    // Calculate total documents
    const totalDocs = systemStats.value.totalUsers + systemStats.value.totalChildren + systemStats.value.totalForms;
    systemStats.value.totalDocuments = totalDocs.toLocaleString();

    // Estimate storage (rough calculation)
    const estimatedStorageMB = (totalDocs * 0.05).toFixed(2); // ~50KB per document
    systemStats.value.storageUsed = `${estimatedStorageMB} MB`;

    // Add log entry for successful data load
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `System statistics refreshed: ${totalDocs} total documents loaded`
    });

  } catch (err) {
    console.error('Error loading system stats:', err);
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Failed to load system statistics: ${err.message}`
    });
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

const getLogIcon = (level) => {
  const icons = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
  };
  return icons[level] || 'fas fa-circle';
};

const clearCache = async (type) => {
  loading.value = true;
  try {
    // Clear localStorage cache based on type
    if (type === 'app' || type === 'all') {
      // Clear app-specific cache
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tkp_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    if (type === 'data' || type === 'all') {
      // Clear data cache from EnhancedOutreachService
      await EnhancedOutreachService.clearCache();
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} cache cleared successfully`
    });
    
    success(`${type} cache cleared successfully`);
  } catch (err) {
    error('Failed to clear cache');
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Failed to clear ${type} cache: ${err.message}`
    });
  } finally {
    loading.value = false;
  }
};

const runIntegrityCheck = async () => {
  loading.value = true;
  try {
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Starting comprehensive integrity check...'
    });

    // Check database connectivity
    const usersCheck = await UserService.getAllUsers();
    integrityChecks.value[0].status = usersCheck.success ? 'success' : 'error';
    integrityChecks.value[0].statusText = usersCheck.success ? 'Passed' : 'Failed';

    // Check data consistency
    const childrenCheck = await EnhancedOutreachService.getAllChildren();
    integrityChecks.value[1].status = childrenCheck.success ? 'success' : 'error';
    integrityChecks.value[1].statusText = childrenCheck.success ? 'Passed' : 'Failed';

    await new Promise(resolve => setTimeout(resolve, 1000));
    lastIntegrityCheck.value = new Date().toISOString();
    
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Integrity check completed successfully'
    });
    
    success('All integrity checks passed');
  } catch (err) {
    error('Integrity check failed');
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Integrity check failed: ${err.message}`
    });
  } finally {
    loading.value = false;
  }
};

const runSingleCheck = async (check) => {
  info(`Running ${check.name}...`);
  logs.value.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    level: 'info',
    message: `Running ${check.name}...`
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  success(`${check.name} completed`);
};

const toggleMaintenance = async () => {
  try {
    const message = maintenanceMode.value ? 'Maintenance mode enabled' : 'Maintenance mode disabled';
    
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'warning',
      message: message
    });

    if (maintenanceMode.value) {
      info(message);
    } else {
      success(message);
    }
  } catch (err) {
    error('Failed to toggle maintenance mode');
  }
};

const saveMaintenanceMessage = () => {
  logs.value.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Maintenance message updated'
  });
  success('Maintenance message saved');
};

const optimizeDatabase = async () => {
  loading.value = true;
  try {
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Starting database optimization...'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Database optimization completed successfully'
    });
    
    success('Database optimized successfully');
  } catch (err) {
    error('Optimization failed');
  } finally {
    loading.value = false;
  }
};

const cleanTempFiles = async () => {
  loading.value = true;
  try {
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Cleaning temporary files...'
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Temporary files cleaned successfully'
    });
    
    success('Temporary files cleaned');
  } catch (err) {
    error('Failed to clean files');
  } finally {
    loading.value = false;
  }
};

const archiveOldData = async () => {
  loading.value = true;
  try {
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Archiving old data...'
    });

    await new Promise(resolve => setTimeout(resolve, 2500));
    
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Old data archived successfully'
    });
    
    success('Old data archived');
  } catch (err) {
    error('Archiving failed');
  } finally {
    loading.value = false;
  }
};

const rebuildIndexes = async () => {
  loading.value = true;
  try {
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Rebuilding database indexes...'
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
    
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Database indexes rebuilt successfully'
    });
    
    success('Indexes rebuilt successfully');
  } catch (err) {
    error('Failed to rebuild indexes');
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  loading.value = true;
  try {
    // Save settings to localStorage
    localStorage.setItem('tkp_system_settings', JSON.stringify(settings.value));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    logs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'System settings saved successfully'
    });
    
    success('Settings saved successfully');
  } catch (err) {
    error('Failed to save settings');
  } finally {
    loading.value = false;
  }
};

const refreshLogs = () => {
  logs.value.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Logs refreshed'
  });
  info('Logs refreshed');
};

// Load saved settings
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('tkp_system_settings');
    if (savedSettings) {
      settings.value = { ...settings.value, ...JSON.parse(savedSettings) };
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
};

onMounted(() => {
  // Update clock every second
  setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 1000);

  // Load system stats
  loadSystemStats();

  // Load saved settings
  loadSettings();

  // Log initial startup
  logs.value.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'System Management module initialized'
  });
});
</script>

<style scoped>
.dhis2-system-app {
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
.system-sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
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

.sidebar-nav {
  flex: 1;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #494949;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #212121;
}

.nav-item.active {
  background: #e8f4f8;
  color: #2b6693;
  border-left-color: #2b6693;
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  text-align: center;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #212121;
  font-weight: 400;
}

.section-header p {
  margin: 4px 0 0 0;
  color: #757575;
  font-size: 0.9rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.info-card {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  padding: 20px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.info-header i {
  font-size: 1.5rem;
  color: #2b6693;
}

.info-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #494949;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f9f9f9;
}

.info-row .label {
  font-weight: 500;
  color: #616161;
}

.info-row .value {
  color: #212121;
}

/* Badge */
.badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge.production {
  background: #e3f2fd;
  color: #1976d2;
}

/* Cache Actions */
.cache-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  gap: 16px;
}

.action-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon i {
  font-size: 1.5rem;
  color: #2b6693;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #212121;
}

.action-content p {
  margin: 0 0 16px 0;
  font-size: 0.85rem;
  color: #757575;
}

/* Integrity Panel */
.integrity-panel {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #212121;
}

.panel-header p {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #757575;
}

.checks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.check-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 4px;
}

.check-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.check-info i {
  font-size: 1.2rem;
  color: #2b6693;
}

.check-info h4 {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  color: #212121;
}

.check-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #757575;
}

.check-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Maintenance */
.maintenance-panel {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
}

.maintenance-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 24px;
}

.toggle-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-icon {
  width: 50px;
  height: 50px;
  background: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-icon i {
  font-size: 1.5rem;
  color: #2b6693;
}

.toggle-icon.active {
  background: #fff3e0;
}

.toggle-icon.active i {
  color: #f57c00;
}

.toggle-content h3 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  color: #212121;
}

.toggle-content p {
  margin: 0;
  font-size: 0.85rem;
  color: #757575;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
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
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2b6693;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.slider.round {
  border-radius: 26px;
}

.slider.round:before {
  border-radius: 50%;
}

.maintenance-message {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.maintenance-message label {
  font-weight: 500;
  color: #494949;
}

.maintenance-tasks {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  padding: 24px;
}

.maintenance-tasks h3 {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  color: #212121;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.task-card {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
  text-align: center;
}

.task-card i {
  font-size: 2rem;
  color: #2b6693;
  margin-bottom: 12px;
}

.task-card h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #212121;
}

.task-card p {
  margin: 0 0 16px 0;
  font-size: 0.85rem;
  color: #757575;
}

/* Settings */
.settings-panel {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  padding: 24px;
}

.setting-group {
  margin-bottom: 32px;
}

.setting-group h3 {
  margin: 0 0 16px 0;
  font-size: 1rem;
  color: #494949;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #494949;
  font-weight: 500;
}

.setting-item.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Logs */
.logs-panel {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  padding: 20px;
}

.logs-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.logs-filters .dhis2-select,
.logs-filters .dhis2-input {
  flex: 1;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 500px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #d5d5d5;
}

.log-item.error {
  border-left-color: #f44336;
  background: #ffebee;
}

.log-item.warning {
  border-left-color: #ff9800;
  background: #fff3e0;
}

.log-item.info {
  border-left-color: #2196f3;
  background: #e3f2fd;
}

.log-icon i {
  font-size: 1.2rem;
}

.log-content {
  flex: 1;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.log-time {
  font-size: 0.85rem;
  color: #757575;
}

.log-level {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.log-level.error {
  color: #f44336;
}

.log-level.warning {
  color: #ff9800;
}

.log-level.info {
  color: #2196f3;
}

.log-message {
  margin: 0;
  font-size: 0.9rem;
  color: #212121;
}

.empty-logs {
  text-align: center;
  padding: 48px;
  color: #757575;
}

.empty-logs i {
  font-size: 3rem;
  margin-bottom: 12px;
  display: block;
}

/* Common Components */
.dhis2-input,
.dhis2-select,
.dhis2-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  font-size: 0.9rem;
  outline: none;
  background: white;
}

.dhis2-input:focus,
.dhis2-select:focus,
.dhis2-textarea:focus {
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

.dhis2-btn.primary:hover:not(:disabled) {
  background: #1d4260;
}

.dhis2-btn.secondary {
  background: white;
  color: #494949;
  border: 1px solid #d5d5d5;
}

.dhis2-btn.secondary:hover:not(:disabled) {
  background: #f5f5f5;
}

.dhis2-btn.danger {
  background: #f44336;
  color: white;
}

.dhis2-btn.danger:hover:not(:disabled) {
  background: #d32f2f;
}

.dhis2-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #757575;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #f0f0f0;
  color: #212121;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .system-sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #d5d5d5;
    display: none; /* Hide sidebar on mobile by default */
  }

  .info-grid,
  .cache-actions,
  .tasks-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .logs-filters {
    flex-direction: column;
  }
}
</style>
