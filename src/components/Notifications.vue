<template>
  <div class="dhis2-app-shell">
    <TopHeader />
    
    <div class="app-content">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Notifications</h3>
          </div>
          <nav class="sidebar-nav">
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeFilter === 'all' }"
              @click.prevent="activeFilter = 'all'"
            >
              <i class="fas fa-list"></i>
              All Notifications
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeFilter === 'unread' }"
              @click.prevent="activeFilter = 'unread'"
            >
              <i class="fas fa-envelope"></i>
              Unread
              <span class="count-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
            </a>
            <div class="nav-divider"></div>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeFilter === 'sponsorship' }"
              @click.prevent="activeFilter = 'sponsorship'"
            >
              <i class="fas fa-heart text-red"></i>
              Sponsorships
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeFilter === 'approval' }"
              @click.prevent="activeFilter = 'approval'"
            >
              <i class="fas fa-check-circle text-green"></i>
              Approvals
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeFilter === 'system' }"
              @click.prevent="activeFilter = 'system'"
            >
              <i class="fas fa-cog text-blue"></i>
              System
            </a>
          </nav>
        </div>
        
        <div class="sidebar-action">
          <button class="dhis2-btn secondary full-width" @click="markAllAsRead">
            <i class="fas fa-check-double"></i> Mark all as read
          </button>
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="main-workspace">
        <div class="workspace-header">
          <h2 class="module-title">{{ getFilterTitle(activeFilter) }}</h2>
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Search notifications..." />
          </div>
        </div>

        <div class="workspace-content">
          <div class="notifications-list" v-if="filteredNotifications.length > 0">
            <div 
              v-for="notification in filteredNotifications" 
              :key="notification.id"
              class="notification-card"
              :class="{ unread: !notification.read }"
              @click="viewNotification(notification)"
            >
              <div class="notification-icon-wrapper" :class="notification.type">
                <i :class="getNotificationIcon(notification.type)"></i>
              </div>
              
              <div class="notification-details">
                <div class="notification-header">
                  <h4 class="notification-title">{{ notification.title }}</h4>
                  <span class="notification-time">{{ notification.time }}</span>
                </div>
                <p class="notification-message">{{ notification.message }}</p>
                
                <div class="notification-actions" v-if="notification.type === 'heart' || notification.type === 'warning'">
                  <button class="action-link" @click.stop="handleAction(notification)">
                    {{ getActionLabel(notification.type) }}
                  </button>
                </div>
              </div>
              
              <div class="notification-status">
                <div class="status-dot" v-if="!notification.read"></div>
              </div>
            </div>
          </div>
          
          <div class="empty-state" v-else>
            <i class="fas fa-bell-slash"></i>
            <p>No notifications found</p>
          </div>
        </div>
      </main>

      <!-- Sponsorship Detail Modal -->
      <div v-if="showSponsorModal && selectedSponsorship" class="modal-overlay" @click="closeSponsorModal">
        <div class="modal-card" @click.stop>
          <div class="modal-header">
            <h3>Sponsorship Request</h3>
            <button class="close-btn" @click="closeSponsorModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="detail-row">
              <label>Child Name:</label>
              <div class="detail-value highlight">{{ selectedSponsorship.childName }}</div>
            </div>
            <div class="detail-row">
              <label>Sponsor Name:</label>
              <div class="detail-value">{{ selectedSponsorship.name }}</div>
            </div>
            <div class="detail-row">
              <label>Email:</label>
              <div class="detail-value">
                <a :href="'mailto:' + selectedSponsorship.email">{{ selectedSponsorship.email }}</a>
              </div>
            </div>
            <div class="detail-row">
              <label>Phone:</label>
              <div class="detail-value">{{ selectedSponsorship.phone || 'N/A' }}</div>
            </div>
            <div class="detail-row">
              <label>Message:</label>
              <div class="detail-value message-box">{{ selectedSponsorship.message }}</div>
            </div>
            <div class="detail-row">
              <label>Date Received:</label>
              <div class="detail-value">{{ formatFullDate(selectedSponsorship.createdAt) }}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="dhis2-btn secondary" @click="closeSponsorModal">Close</button>
            <button class="dhis2-btn primary" @click="navigateToStory(selectedSponsorship.storyId)">
              View Story
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import TopHeader from "./TopHeader.vue";
import AuthService from "../services/auth.js";
import { db } from "../firebase/config.js";
import { collection, query, where, onSnapshot, orderBy, limit, updateDoc, doc } from "firebase/firestore";
import { useToast } from "../composables/useToast.js";

const router = useRouter();
const { success, error } = useToast();

// State
const activeFilter = ref('all');
const searchQuery = ref('');
const notifications = ref([]);
const listeners = [];
const currentUserRole = ref('');

// Modal State
const showSponsorModal = ref(false);
const selectedSponsorship = ref(null);

// Computed
const filteredNotifications = computed(() => {
  let result = notifications.value;
  
  // Filter by category
  if (activeFilter.value === 'unread') {
    result = result.filter(n => !n.read);
  } else if (activeFilter.value !== 'all') {
    // Map filter to type
    const typeMap = {
      'sponsorship': 'heart',
      'approval': 'warning',
      'system': 'info'
    };
    const targetType = typeMap[activeFilter.value] || activeFilter.value;
    result = result.filter(n => n.type === targetType);
  }
  
  // Filter by search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.message.toLowerCase().includes(q)
    );
  }
  
  return result;
});

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

// Methods
const getFilterTitle = (filter) => {
  const titles = {
    'all': 'All Notifications',
    'unread': 'Unread Notifications',
    'sponsorship': 'Sponsorship Requests',
    'approval': 'Pending Approvals',
    'system': 'System Notifications'
  };
  return titles[filter] || 'Notifications';
};

const getNotificationIcon = (type) => {
  const icons = {
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
    info: 'fas fa-info-circle',
    heart: 'fas fa-heart'
  };
  return icons[type] || 'fas fa-bell';
};

const getActionLabel = (type) => {
  if (type === 'heart') return 'View Request';
  if (type === 'warning') return 'Review Form';
  return 'View Details';
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatFullDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString();
};

const viewNotification = async (notification) => {
  // Mark as read if not already
  if (!notification.read) {
    // In a real app with a dedicated notifications collection, we'd update it here
    // For now, we'll just update local state since we're pulling from source collections
    notification.read = true;
  }
  
  handleAction(notification);
};

const handleAction = (notification) => {
  if (notification.type === 'heart') {
    // Open modal with details
    selectedSponsorship.value = notification.data;
    showSponsorModal.value = true;
  } else if (notification.type === 'warning') {
    // Navigate to approval app
    router.push('/approval');
  }
};

const closeSponsorModal = () => {
  showSponsorModal.value = false;
  selectedSponsorship.value = null;
};

const navigateToStory = (storyId) => {
  // Navigate to success stories
  // Ideally, we'd pass the storyId to open it directly, but for now just navigating
  router.push('/success-stories');
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
  success('All notifications marked as read');
};

// Data Fetching
const setupListeners = () => {
  // 1. Sponsorship Interests
  if (currentUserRole.value === 'admin' || currentUserRole.value === 'manager') {
    const sponsorshipQuery = query(
      collection(db, 'sponsorship_interests'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubSponsorship = onSnapshot(sponsorshipQuery, (snapshot) => {
      const sponsorshipNotifs = snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'heart',
        title: 'New Sponsorship Interest',
        message: `${doc.data().name} is interested in sponsoring ${doc.data().childName}`,
        time: formatTime(doc.data().createdAt),
        rawTime: doc.data().createdAt,
        read: doc.data().status !== 'pending', // Assume pending = unread for this demo
        sourceId: doc.id,
        collection: 'sponsorship_interests',
        data: doc.data() // Store full data for modal
      }));
      
      updateNotifications(sponsorshipNotifs, 'sponsorship');
    });
    listeners.push(unsubSponsorship);

    // 2. Pending Approvals
    const approvalsQuery = query(
      collection(db, 'forms'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubApprovals = onSnapshot(approvalsQuery, (snapshot) => {
      const approvalNotifs = snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'warning',
        title: 'Pending Approval',
        message: `Form ${doc.id.substring(0, 8)}... requires review`,
        time: formatTime(doc.data().createdAt),
        rawTime: doc.data().createdAt,
        read: false,
        sourceId: doc.id,
        collection: 'forms',
        data: doc.data()
      }));
      
      updateNotifications(approvalNotifs, 'approval');
    }, (err) => {
      console.log("Error fetching approvals:", err);
    });
    listeners.push(unsubApprovals);
  }
};

const notificationSources = ref({
  sponsorship: [],
  approval: [],
  system: []
});

const updateNotifications = (newItems, source) => {
  notificationSources.value[source] = newItems;
  
  const all = [
    ...notificationSources.value.sponsorship,
    ...notificationSources.value.approval,
    ...notificationSources.value.system
  ];
  
  notifications.value = all.sort((a, b) => {
    const timeA = a.rawTime?.toDate ? a.rawTime.toDate() : new Date(a.rawTime || 0);
    const timeB = b.rawTime?.toDate ? b.rawTime.toDate() : new Date(b.rawTime || 0);
    return timeB - timeA;
  });
};

onMounted(() => {
  const currentUser = AuthService.getCurrentUser();
  if (currentUser) {
    currentUserRole.value = AuthService.getUserRoleInfo();
    setupListeners();
  } else {
    // Fallback
    const savedUserData = localStorage.getItem("tkp_user_data");
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      currentUserRole.value = userData.role || "user";
      setupListeners();
    }
  }
});

onUnmounted(() => {
  listeners.forEach(unsub => unsub());
});
</script>

<style scoped>
.dhis2-app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f5f7;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  color: #212121;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
}

.sidebar-section {
  padding: 12px 0;
  flex: 1;
}

.section-header {
  padding: 0 16px 8px;
}

.section-header h3 {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #616161;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #494949;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  position: relative;
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
  font-size: 1rem;
}

.nav-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}

.count-badge {
  position: absolute;
  right: 16px;
  background: #2b6693;
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
}

.sidebar-action {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

/* Main Workspace */
.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f3f5f7;
  overflow: hidden;
}

.workspace-header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: 1px solid #d5d5d5;
}

.module-title {
  margin: 0;
  font-size: 1.5rem;
  color: #2b6693;
  font-weight: 400;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #757575;
}

.search-bar input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  border: 1px solid #a0a0a0;
  border-radius: 20px;
  font-size: 0.9rem;
  outline: none;
}

.search-bar input:focus {
  border-color: #2b6693;
}

.workspace-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Notifications List */
.notifications-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.notification-card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.notification-card.unread {
  background: #fff;
  border-left: 4px solid #2b6693;
}

.notification-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.2rem;
}

.notification-icon-wrapper.heart {
  background: #fce4ec;
  color: #e91e63;
}

.notification-icon-wrapper.warning {
  background: #fff3e0;
  color: #ff9800;
}

.notification-icon-wrapper.info {
  background: #e3f2fd;
  color: #2196f3;
}

.notification-icon-wrapper.success {
  background: #e8f5e9;
  color: #4caf50;
}

.notification-details {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.notification-title {
  margin: 0;
  font-size: 1.1rem;
  color: #212121;
  font-weight: 500;
}

.notification-time {
  font-size: 0.85rem;
  color: #757575;
}

.notification-message {
  margin: 0 0 16px 0;
  color: #424242;
  line-height: 1.5;
}

.action-link {
  background: none;
  border: none;
  color: #2b6693;
  font-weight: 500;
  padding: 0;
  cursor: pointer;
  font-size: 0.9rem;
}

.action-link:hover {
  text-decoration: underline;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #2b6693;
  border-radius: 50%;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #757575;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #e0e0e0;
}

.empty-state p {
  font-size: 1.2rem;
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
  backdrop-filter: blur(2px);
}

.modal-card {
  background: white;
  width: 500px;
  max-width: 90%;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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
  font-size: 1.2rem;
  color: #2b6693;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #757575;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 24px;
}

.detail-row {
  margin-bottom: 16px;
}

.detail-row label {
  display: block;
  font-size: 0.85rem;
  color: #757575;
  margin-bottom: 4px;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #212121;
}

.detail-value.highlight {
  font-weight: 600;
  color: #2b6693;
  font-size: 1.1rem;
}

.message-box {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #eee;
  white-space: pre-wrap;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f9f9f9;
  border-radius: 0 0 8px 8px;
}

/* Colors */
.text-red { color: #e91e63; }
.text-green { color: #4caf50; }
.text-blue { color: #2196f3; }

/* Buttons */
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

.dhis2-btn.secondary {
  background: #f5f5f5;
  color: #494949;
  border: 1px solid #d5d5d5;
}

.dhis2-btn.secondary:hover {
  background: #e0e0e0;
}

.dhis2-btn.full-width {
  width: 100%;
}

@media (max-width: 768px) {
  .app-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #d5d5d5;
    display: none; /* Hide sidebar on mobile by default */
  }

  .workspace-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .search-bar {
    width: 100%;
  }

  .notification-card {
    flex-direction: column;
    gap: 1rem;
  }

  .notification-icon-wrapper {
    align-self: flex-start;
  }

  .modal-card {
    width: 95%;
  }
}
</style>
