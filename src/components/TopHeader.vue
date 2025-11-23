<template>
  <div class="dhis-top-header">
    <div class="header-left">
      <div class="logo-container-small">
        <img src="../assets/logo.png" alt="TKP Logo" class="header-logo" />
      </div>
      <div class="app-title">TKP Data Management</div>
    </div>
    <div class="header-right">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search apps" 
          v-model="searchQuery"
          @input="filterApps"
          @focus="showSearchResults = true"
        />
        <!-- Search Results Dropdown -->
        <div v-if="showSearchResults && searchQuery" class="search-dropdown" @click.stop>
          <div v-if="filteredApps.length > 0">
            <div 
              v-for="app in filteredApps" 
              :key="app.id"
              class="search-result-item"
              @click="navigateToApp(app.id)"
            >
              <i :class="app.icon"></i>
              <span>{{ app.name }}</span>
            </div>
          </div>
          <div v-else class="no-results">
            <p>No apps found</p>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <!-- Apps Menu -->
        <div class="action-item" title="Apps" @click="toggleAppMenu">
          <i class="fas fa-th"></i>
        </div>
        
        <!-- Notifications -->
        <div class="action-item" title="Notifications" @click="toggleNotifications">
          <i class="fas fa-bell"></i>
          <span class="badge" v-if="notifications.length > 0">{{ notifications.length }}</span>
        </div>
        
        <!-- Messages -->
        <div class="action-item" title="Messages" @click="toggleMessages">
          <i class="fas fa-envelope"></i>
          <span class="badge" v-if="unreadMessages > 0">{{ unreadMessages }}</span>
        </div>
        
        <!-- User Profile -->
        <div class="action-item user-profile" @click="toggleUserMenu" title="Profile">
          <div class="avatar">{{ getInitials() }}</div>
        </div>
      </div>
    </div>

    <!-- Apps Dropdown Menu -->
    <div v-if="showAppMenu" class="apps-dropdown" @click.self="closeAllMenus">
      <div class="dropdown-header">
        <h3>Apps</h3>
        <button @click="closeAllMenus" class="close-btn">×</button>
      </div>
      <div class="apps-grid">
        <div class="app-item" @click="navigateToApp('dashboard')">
          <div class="app-icon-wrapper blue"><i class="fa-solid fa-home"></i></div>
          <span>Dashboard</span>
        </div>
        <div class="app-item" @click="navigateToApp('tracker-capture')">
          <div class="app-icon-wrapper blue"><i class="fa-solid fa-search"></i></div>
          <span>Tracker Capture</span>
        </div>
        <div class="app-item" @click="navigateToApp('data-entry')">
          <div class="app-icon-wrapper green"><i class="fa-solid fa-keyboard"></i></div>
          <span>Data Entry</span>
        </div>
        <div class="app-item" @click="navigateToApp('capture')">
          <div class="app-icon-wrapper green"><i class="fa-solid fa-edit"></i></div>
          <span>Capture</span>
        </div>
        <div class="app-item" @click="navigateToApp('tkp-documents')">
          <div class="app-icon-wrapper blue"><i class="fa-solid fa-file-alt"></i></div>
          <span>TKP Documents</span>
        </div>
        <div class="app-item" @click="navigateToApp('reports')">
          <div class="app-icon-wrapper orange"><i class="fa-solid fa-chart-bar"></i></div>
          <span>Reports</span>
        </div>
        <div class="app-item" @click="navigateToApp('event-reports')">
          <div class="app-icon-wrapper purple"><i class="fa-solid fa-calendar-days"></i></div>
          <span>Event Reports</span>
        </div>
        <div class="app-item" @click="navigateToApp('data-analytics')">
          <div class="app-icon-wrapper teal"><i class="fa-solid fa-chart-line"></i></div>
          <span>Data Analytics</span>
        </div>
        <div class="app-item" @click="navigateToApp('data-visualizer')">
          <div class="app-icon-wrapper purple"><i class="fa-solid fa-chart-pie"></i></div>
          <span>Data Visualizer</span>
        </div>
        <div class="app-item" @click="navigateToApp('pivot-tables')">
          <div class="app-icon-wrapper orange"><i class="fa-solid fa-table"></i></div>
          <span>Pivot Tables</span>
        </div>
        <div class="app-item" @click="navigateToApp('maps')">
          <div class="app-icon-wrapper green"><i class="fa-solid fa-map-marked-alt"></i></div>
          <span>Maps</span>
        </div>
        <div class="app-item" @click="navigateToApp('outreach')">
          <div class="app-icon-wrapper red"><i class="fa-solid fa-route"></i></div>
          <span>Outreach</span>
        </div>
        <div class="app-item" @click="navigateToApp('import-export')">
          <div class="app-icon-wrapper indigo"><i class="fa-solid fa-file-import"></i></div>
          <span>Import/Export</span>
        </div>
        <div class="app-item" @click="navigateToApp('data-quality')">
          <div class="app-icon-wrapper teal"><i class="fa-solid fa-check-double"></i></div>
          <span>Data Quality</span>
        </div>
        <div class="app-item" @click="navigateToApp('approval')">
          <div class="app-icon-wrapper green"><i class="fa-solid fa-thumbs-up"></i></div>
          <span>Approval</span>
        </div>
        <div class="app-item" @click="navigateToApp('messaging')">
          <div class="app-icon-wrapper blue"><i class="fa-solid fa-comments"></i></div>
          <span>Messaging</span>
        </div>
        <div class="app-item" @click="navigateToApp('maintenance')">
          <div class="app-icon-wrapper orange"><i class="fa-solid fa-tools"></i></div>
          <span>Maintenance</span>
        </div>
        <div class="app-item" v-if="canManageUsers" @click="navigateToApp('user-management')">
          <div class="app-icon-wrapper indigo"><i class="fa-solid fa-users-cog"></i></div>
          <span>Users</span>
        </div>
        <div class="app-item" v-if="isSuperAdmin" @click="navigateToApp('system-management')">
          <div class="app-icon-wrapper gray"><i class="fa-solid fa-screwdriver-wrench"></i></div>
          <span>System</span>
        </div>
        <div class="app-item" @click="navigateToApp('child-tracker-2')">
          <div class="app-icon-wrapper purple"><i class="fa-solid fa-house-user"></i></div>
          <span>In Housed Girls</span>
        </div>
      </div>
    </div>

    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="notifications-dropdown" @click.self="closeAllMenus">
      <div class="dropdown-header">
        <h3>Notifications</h3>
        <button @click="closeAllMenus" class="close-btn">×</button>
      </div>
      <div class="dropdown-content">
        <div v-if="notifications.length > 0" class="notifications-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
          >
            <div class="notification-icon" :class="notification.type">
              <i :class="getNotificationIcon(notification.type)"></i>
            </div>
            <div class="notification-content">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="fas fa-bell-slash"></i>
          <p>No notifications</p>
        </div>
      </div>
      <div class="dropdown-footer">
        <button @click="viewAllNotifications">View All</button>
      </div>
    </div>

    <!-- Messages Dropdown -->
    <div v-if="showMessages" class="messages-dropdown" @click.self="closeAllMenus">
      <div class="dropdown-header">
        <h3>Messages</h3>
        <button @click="closeAllMenus" class="close-btn">×</button>
      </div>
      <div class="dropdown-content">
        <div v-if="messages.length > 0" class="messages-list">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message-item"
            :class="{ unread: !message.read }"
            @click="openMessage(message)"
          >
            <div class="message-avatar">{{ message.sender.charAt(0) }}</div>
            <div class="message-content">
              <h4>{{ message.sender }}</h4>
              <p>{{ message.preview }}</p>
              <span class="message-time">{{ message.time }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="fas fa-envelope-open"></i>
          <p>No messages</p>
        </div>
      </div>
    </div>

    <!-- User Profile Dropdown -->
    <div v-if="showUserMenu" class="user-dropdown" @click.self="closeAllMenus">
      <div class="dropdown-header">
        <div class="user-info">
          <div class="avatar large">{{ getInitials() }}</div>
          <div>
            <h3>{{ currentUserName }}</h3>
        <div class="menu-item logout" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
</div>

    <!-- Click outside to close -->
    <div 
      v-if="showAppMenu || showNotifications || showMessages || showUserMenu || showSearchResults" 
      class="overlay"
      @click="closeAllMenus"
    ></div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AuthService from "../services/auth.js";

const router = useRouter();

// UI State
const showAppMenu = ref(false);
const showNotifications = ref(false);
const showMessages = ref(false);
const showUserMenu = ref(false);
const showSearchResults = ref(false);
const searchQuery = ref("");

// User Data
const currentUserName = ref("");
const currentUserEmail = ref("");

// Apps list for search
const allApps = ref([
  { id: 'dashboard', name: 'Dashboard', icon: 'fa-solid fa-home' },
  { id: 'tracker-capture', name: 'Tracker Capture', icon: 'fa-solid fa-search' },
  { id: 'data-entry', name: 'Data Entry', icon: 'fa-solid fa-keyboard' },
  { id: 'capture', name: 'Capture', icon: 'fa-solid fa-edit' },
  { id: 'tkp-documents', name: 'TKP Documents', icon: 'fa-solid fa-file-alt' },
  { id: 'reports', name: 'Reports', icon: 'fa-solid fa-chart-bar' },
  { id: 'event-reports', name: 'Event Reports', icon: 'fa-solid fa-calendar-days' },
  { id: 'data-analytics', name: 'Data Analytics', icon: 'fa-solid fa-chart-line' },
  { id: 'data-visualizer', name: 'Data Visualizer', icon: 'fa-solid fa-chart-pie' },
  { id: 'pivot-tables', name: 'Pivot Tables', icon: 'fa-solid fa-table' },
  { id: 'maps', name: 'Maps', icon: 'fa-solid fa-map-marked-alt' },
  { id: 'outreach', name: 'Outreach', icon: 'fa-solid fa-route' },
  { id: 'import-export', name: 'Import/Export', icon: 'fa-solid fa-file-import' },
  { id: 'data-quality', name: 'Data Quality', icon: 'fa-solid fa-check-double' },
  { id: 'approval', name: 'Approval', icon: 'fa-solid fa-thumbs-up' },
  { id: 'messaging', name: 'Messaging', icon: 'fa-solid fa-comments' },
  { id: 'maintenance', name: 'Maintenance', icon: 'fa-solid fa-tools' },
  { id: 'user-management', name: 'User Management', icon: 'fa-solid fa-users-cog' },
  { id: 'system-management', name: 'System Management', icon: 'fa-solid fa-screwdriver-wrench' },
  { id: 'child-tracker-2', name: 'In Housed Girls', icon: 'fa-solid fa-house-user' }
]);

const filteredApps = ref([]);

// Notifications
const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Form Submitted',
    message: 'Initial Referral form has been successfully submitted',
    time: '5 minutes ago',
    read: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'Pending Review',
    message: 'Child Overview form requires your review',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'System Update',
    message: 'New features have been added to the dashboard',
    time: '2 hours ago',
    read: true
  }
]);

// Messages
const messages = ref([
  {
    id: 1,
    sender: 'Sarah Johnson',
    preview: 'Review the medical assessment for...',
    time: '10 min ago',
    read: false
  },
  {
    id: 2,
    sender: 'Michael Brown',
    preview: 'Follow-up needed on case #1234',
    time: '1 hour ago',
    read: false
  }
]);

const unreadMessages = computed(() => {
  return messages.value.filter(m => !m.read).length;
});

// Permissions
const canManageUsers = computed(() => {
  const role = AuthService.getUserRoleInfo();
  return (
    role === "admin" ||
    role === "manager" ||
    AuthService.hasPermission("users_write")
  );
});

const isSuperAdmin = computed(() => {
  const currentUser = AuthService.getCurrentUser();
  return currentUser && currentUser.email === 'davidchileshe33@gmail.com';
});

// Methods
const getInitials = () => {
  if (!currentUserName.value) return "U";
  const nameParts = currentUserName.value.split(" ");
  if (nameParts.length >= 2) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
  return nameParts[0][0].toUpperCase();
};

const toggleAppMenu = () => {
  closeAllMenus();
  showAppMenu.value = !showAppMenu.value;
};

const toggleNotifications = () => {
  closeAllMenus();
  showNotifications.value = !showNotifications.value;
};

const toggleMessages = () => {
  closeAllMenus();
  showMessages.value = !showMessages.value;
};

const toggleUserMenu = () => {
  closeAllMenus();
  showUserMenu.value = !showUserMenu.value;
};

const closeAllMenus = () => {
  showAppMenu.value = false;
  showNotifications.value = false;
  showMessages.value = false;
  showUserMenu.value = false;
  showSearchResults.value = false;
};

const filterApps = () => {
  if (!searchQuery.value.trim()) {
    filteredApps.value = [];
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  filteredApps.value = allApps.value.filter(app => 
    app.name.toLowerCase().includes(query)
  );
};

const getNotificationIcon = (type) => {
  const icons = {
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
    info: 'fas fa-info-circle'
  };
  return icons[type] || 'fas fa-bell';
};

const viewAllNotifications = () => {
  closeAllMenus();
  // Navigate to notifications page or show modal
  console.log('View all notifications');
};

const openMessage = (message) => {
  closeAllMenus();
  // Open message detail
  console.log('Open message:', message);
};

const navigateToProfile = () => {
  closeAllMenus();
  // Navigate to profile page
  console.log('Navigate to profile');
};

const navigateToSettings = () => {
  closeAllMenus();
  // Navigate to settings page
  console.log('Navigate to settings');
};

const navigateToHelp = () => {
  closeAllMenus();
  // Navigate to help page
  console.log('Navigate to help');
};

const handleLogout = async () => {
  const result = await AuthService.logout();
  if (result.success) {
    closeAllMenus();
    router.push("/login");
  }
};

const navigateToApp = (app) => {
  closeAllMenus();
  searchQuery.value = "";
  
  // Direct route navigation
  switch(app) {
    case 'dashboard':
      router.push('/dashboard');
      break;
    case 'user-management':
      router.push('/user-management');
      break;
    case 'system-management':
      router.push('/system-management');
      break;
    case 'data-analytics':
      router.push('/data-analytics');
      break;
    case 'tracker-capture':
      router.push('/tracker-capture');
      break;
    case 'event-reports':
      router.push('/event-reports');
      break;
    case 'outreach':
      router.push('/outreach');
      break;
    case 'reports':
      router.push({ path: '/dashboard', query: { view: 'reports' } });
      break;
    case 'data-entry':
      router.push({ path: '/dashboard', query: { view: 'data-entry' } });
      break;
    case 'capture':
      router.push('/capture');
      break;
    case 'tkp-documents':
      router.push('/tkp-documents');
      break;
    // New apps - now fully functional
    case 'data-visualizer':
      router.push('/data-visualizer');
      break;
    case 'pivot-tables':
      router.push('/pivot-tables');
      break;
    case 'maps':
      router.push('/maps');
      break;
    case 'import-export':
      router.push('/import-export');
      break;
    case 'data-quality':
      router.push('/data-quality');
      break;
    case 'approval':
      router.push('/approval');
      break;
    case 'messaging':
      router.push('/messaging');
      break;
    case 'maintenance':
      router.push('/maintenance');
      break;
    case 'child-tracker-2':
      router.push({ path: '/dashboard', query: { view: 'child-tracker-2' } });
      break;
    default:
      router.push('/dashboard');
  }
};

onMounted(() => {
  const currentUser = AuthService.getCurrentUser();
  if (currentUser) {
    currentUserName.value = currentUser.name || currentUser.fullName || currentUser.email;
    currentUserEmail.value = currentUser.email;
  } else {
    const savedUserData = localStorage.getItem("tkp_user_data");
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData);
        currentUserName.value = userData.user.name || userData.user.fullName || userData.user.email || "User";
        currentUserEmail.value = userData.user.email || "";
      } catch (e) {
        currentUserName.value = "User";
        currentUserEmail.value = "";
      }
    }
  }
});
</script>

<style scoped>
/* Top Header */
.dhis-top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c6693; /* DHIS2 Blue */
  color: white;
  height: 48px;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-container-small {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-title {
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  position: relative;
  margin-right: 10px;
}

.search-box input {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 4px;
  padding: 6px 12px 6px 32px;
  color: white;
  font-size: 0.9rem;
  width: 200px;
  transition: background 0.2s;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-box input:focus {
  background: rgba(255, 255, 255, 0.25);
  outline: none;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  pointer-events: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-item {
  position: relative;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.action-item:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ef4444;
  color: white;
  font-size: 0.65rem;
  padding: 2px 4px;
  border-radius: 10px;
  min-width: 14px;
  text-align: center;
  font-weight: 600;
}

.user-profile {
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: #1e40af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  border: 2px solid rgba(255,255,255,0.2);
}

.avatar.large {
  width: 48px;
  height: 48px;
  font-size: 1.2rem;
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 999;
}

/* Common Dropdown Styles */
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
}

.dropdown-content {
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-footer {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  text-align: center;
}

.dropdown-footer button {
  background: #2c6693;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
}

.dropdown-footer button:hover {
  background: #1e4b70;
}

/* Search Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  z-index: 1001;
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  color: #374151;
}

.search-result-item:hover {
  background: #f3f4f6;
}

.search-result-item i {
  font-size: 1.2rem;
  color: #6b7280;
}

.no-results {
  padding: 24px;
  text-align: center;
  color: #6b7280;
}

/* Apps Dropdown */
.apps-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 360px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  border-radius: 0 0 4px 4px;
  z-index: 1001;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
  text-align: center;
}

.app-item:hover {
  background-color: #f3f4f6;
}

.app-item span {
  font-size: 0.75rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.2;
}

.app-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.app-icon-wrapper.blue { background-color: #3b82f6; }
.app-icon-wrapper.green { background-color: #10b981; }
.app-icon-wrapper.orange { background-color: #f59e0b; }
.app-icon-wrapper.purple { background-color: #8b5cf6; }
.app-icon-wrapper.teal { background-color: #14b8a6; }
.app-icon-wrapper.red { background-color: #ef4444; }
.app-icon-wrapper.indigo { background-color: #6366f1; }
.app-icon-wrapper.gray { background-color: #6b7280; }

/* Notifications Dropdown */
.notifications-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 380px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  border-radius: 0 0 4px 4px;
  z-index: 1001;
}

.notifications-list {
  padding: 0;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.success {
  background: #d1fae5;
  color: #059669;
}

.notification-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.notification-icon.error {
  background: #fee2e2;
  color: #dc2626;
}

.notification-icon.info {
  background: #dbeafe;
  color: #2563eb;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.notification-content p {
  margin: 0 0 4px 0;
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Messages Dropdown */
.messages-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 360px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  border-radius: 0 0 4px 4px;
  z-index: 1001;
}

.messages-list {
  padding: 0;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
  cursor: pointer;
}

.message-item:hover {
  background: #f9fafb;
}

.message-item.unread {
  background: #eff6ff;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.message-content h4 {
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.message-content p {
  margin: 0 0 4px 0;
  font-size: 0.8125rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* User Dropdown */
.user-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 280px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  border-radius: 0 0 4px 4px;
  z-index: 1001;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-info h3 {
  margin: 0;
  font-size: 0.9375rem;
}

.user-email {
  margin: 4px 0 0 0;
  font-size: 0.8125rem;
  color: #6b7280;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  color: #374151;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item i {
  width: 20px;
  font-size: 1rem;
  color: #6b7280;
}

.menu-item.logout {
  color: #dc2626;
}

.menu-item.logout i {
  color: #dc2626;
}

.menu-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

/* Empty State */
.empty-state {
  padding: 48px 24px;
  text-align: center;
  color: #9ca3af;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-right .search-box {
    display: none;
  }
  
  .apps-dropdown,
  .notifications-dropdown,
  .messages-dropdown,
  .user-dropdown {
    width: 90vw;
    max-width: 360px;
  }
}
</style>
