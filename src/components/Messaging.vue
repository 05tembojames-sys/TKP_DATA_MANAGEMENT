<template>
  <div class="dhis2-app-shell">
    <TopHeader />
    
    <div class="app-content">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Messaging</h3>
          </div>
          <nav class="sidebar-nav">
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeFolder === 'inbox' }"
              @click.prevent="activeFolder = 'inbox'"
            >
              <i class="fas fa-inbox"></i>
              Inbox
              <span class="count-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeFolder === 'sent' }"
              @click.prevent="activeFolder = 'sent'"
            >
              <i class="fas fa-paper-plane"></i>
              Sent
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeFolder === 'notifications' }"
              @click.prevent="activeFolder = 'notifications'"
            >
              <i class="fas fa-bell"></i>
              Notifications
            </a>
          </nav>
        </div>
        
        <div class="sidebar-action">
          <button class="dhis2-btn primary full-width" @click="showComposeModal = true">
            <i class="fas fa-plus"></i> New Message
          </button>
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="main-workspace">
        <div class="workspace-header">
          <h2 class="module-title">{{ getFolderTitle(activeFolder) }}</h2>
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Search messages..." />
          </div>
        </div>

        <div class="workspace-content">
          <div class="messages-list">
            <div 
              v-for="message in filteredMessages" 
              :key="message.id"
              class="message-item"
              :class="{ unread: !message.read, selected: selectedMessage?.id === message.id }"
              @click="selectMessage(message)"
            >
              <div class="message-avatar" :style="{ backgroundColor: getAvatarColor(message.sender) }">
                {{ message.sender.charAt(0).toUpperCase() }}
              </div>
              <div class="message-content">
                <div class="message-top">
                  <span class="sender-name">{{ message.sender }}</span>
                  <span class="message-date">{{ formatDate(message.date) }}</span>
                </div>
                <div class="message-subject">{{ message.subject }}</div>
                <div class="message-preview">{{ message.body }}</div>
              </div>
              <div class="message-status" v-if="message.priority === 'high'">
                <i class="fas fa-exclamation-circle text-red"></i>
              </div>
            </div>
            
            <div class="empty-state" v-if="filteredMessages.length === 0">
              <i class="fas fa-envelope-open-text"></i>
              <p>No messages found in {{ activeFolder }}</p>
            </div>
          </div>

          <!-- Message Detail View (Right Pane) -->
          <div class="message-detail-pane" v-if="selectedMessage">
            <div class="detail-header">
              <h3>{{ selectedMessage.subject }}</h3>
              <div class="detail-actions">
                <button class="icon-btn" title="Reply" @click="replyToMessage">
                  <i class="fas fa-reply"></i>
                </button>
                <button class="icon-btn danger" title="Delete" @click="deleteMessage">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="icon-btn" title="Close" @click="selectedMessage = null">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div class="detail-meta">
              <div class="meta-avatar" :style="{ backgroundColor: getAvatarColor(selectedMessage.sender) }">
                {{ selectedMessage.sender.charAt(0).toUpperCase() }}
              </div>
              <div class="meta-info">
                <span class="meta-sender">{{ selectedMessage.sender }}</span>
                <span class="meta-recipients">To: Me</span>
              </div>
              <span class="meta-date">{{ formatFullDate(selectedMessage.date) }}</span>
            </div>

            <div class="detail-body">
              {{ selectedMessage.body }}
            </div>

            <div class="detail-footer" v-if="activeFolder === 'inbox'">
              <button class="dhis2-btn secondary" @click="replyToMessage">
                <i class="fas fa-reply"></i> Reply
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Compose Modal -->
    <div class="modal-overlay" v-if="showComposeModal" @click.self="showComposeModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>New Message</h3>
          <button class="close-btn" @click="showComposeModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Recipients</label>
            <select v-model="newMessage.recipient" class="dhis2-select">
              <option value="">Select User</option>
              <option v-for="user in users" :key="user.id" :value="user.name">
                {{ user.name }} ({{ user.role }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Subject</label>
            <input type="text" v-model="newMessage.subject" class="dhis2-input" placeholder="Enter subject..." />
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea v-model="newMessage.body" class="dhis2-textarea" rows="6" placeholder="Type your message..."></textarea>
          </div>
          <div class="form-group checkbox">
            <label>
              <input type="checkbox" v-model="newMessage.highPriority" />
              High Priority
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="dhis2-btn secondary" @click="showComposeModal = false">Cancel</button>
          <button class="dhis2-btn primary" @click="sendMessage" :disabled="!isValidMessage">
            <i class="fas fa-paper-plane"></i> Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TopHeader from "./TopHeader.vue";
import { useToast } from "../composables/useToast.js";
import UserService from "../services/userService.js";

const { success, error, info } = useToast();

const activeFolder = ref('inbox');
const showComposeModal = ref(false);
const searchQuery = ref('');
const selectedMessage = ref(null);
const users = ref([]);

const newMessage = ref({
  recipient: '',
  subject: '',
  body: '',
  highPriority: false
});

// Mock Data
const messages = ref([
  {
    id: 1,
    folder: 'inbox',
    sender: 'System Administrator',
    subject: 'System Maintenance Scheduled',
    body: 'Please be advised that system maintenance is scheduled for this weekend. The system will be unavailable from 22:00 to 02:00.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    folder: 'inbox',
    sender: 'Program Manager',
    subject: 'Q3 Report Submission',
    body: 'Hi Team, just a reminder that the Q3 outreach reports are due by Friday. Please ensure all data is synced.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    priority: 'normal'
  },
  {
    id: 3,
    folder: 'notifications',
    sender: 'System',
    subject: 'Data Sync Complete',
    body: 'Your recent data synchronization completed successfully. 15 records were uploaded.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
    priority: 'normal'
  },
  {
    id: 4,
    folder: 'sent',
    sender: 'Me',
    subject: 'Re: Q3 Report Submission',
    body: 'Thanks for the reminder. I will have it ready by Thursday.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    read: true,
    priority: 'normal'
  }
]);

const fetchUsers = async () => {
  try {
    const result = await UserService.getAllUsers();
    if (result.success) {
      users.value = result.users;
    } else {
      console.error("Failed to fetch users:", result.error);
    }
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

onMounted(() => {
  fetchUsers();
});

const filteredMessages = computed(() => {
  return messages.value
    .filter(m => m.folder === activeFolder.value)
    .filter(m => {
      if (!searchQuery.value) return true;
      const q = searchQuery.value.toLowerCase();
      return m.subject.toLowerCase().includes(q) || m.body.toLowerCase().includes(q) || m.sender.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const unreadCount = computed(() => {
  return messages.value.filter(m => m.folder === 'inbox' && !m.read).length;
});

const isValidMessage = computed(() => {
  return newMessage.value.recipient && newMessage.value.subject && newMessage.value.body;
});

const getFolderTitle = (folder) => {
  return folder.charAt(0).toUpperCase() + folder.slice(1);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
};

const formatFullDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const getAvatarColor = (name) => {
  const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#ff9800', '#ff5722'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const selectMessage = (message) => {
  selectedMessage.value = message;
  if (!message.read) {
    message.read = true;
  }
};

const sendMessage = () => {
  const recipient = newMessage.value.recipient;
  const subject = newMessage.value.subject;
  
  // Add sent message
  messages.value.unshift({
    id: Date.now(),
    folder: 'sent',
    sender: 'Me', // In real app, current user
    subject: subject,
    body: newMessage.value.body,
    date: new Date().toISOString(),
    read: true,
    priority: newMessage.value.highPriority ? 'high' : 'normal',
    recipient: recipient
  });
  
  success(`Message sent to ${recipient}`);
  showComposeModal.value = false;
  newMessage.value = { recipient: '', subject: '', body: '', highPriority: false };

  // Simulate auto-reply for demonstration
  setTimeout(() => {
    const replyId = Date.now() + 1;
    messages.value.unshift({
      id: replyId,
      folder: 'inbox',
      sender: recipient,
      subject: `Re: ${subject}`,
      body: `This is an automated reply to your message: "${subject}".\n\nI have received your message and will get back to you shortly.`,
      date: new Date().toISOString(),
      read: false,
      priority: 'normal'
    });
    
    info(`New message from ${recipient}`);
  }, 3000);
};

const replyToMessage = () => {
  if (!selectedMessage.value) return;
  newMessage.value.recipient = selectedMessage.value.sender; // Pre-fill with sender
  newMessage.value.subject = `Re: ${selectedMessage.value.subject}`;
  showComposeModal.value = true;
};

const deleteMessage = () => {
  if (!selectedMessage.value) return;
  if (confirm("Are you sure you want to delete this message?")) {
    const index = messages.value.findIndex(m => m.id === selectedMessage.value.id);
    if (index !== -1) {
      messages.value.splice(index, 1);
      selectedMessage.value = null;
      success("Message deleted");
    }
  }
};

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
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Messages List */
.messages-list {
  flex: 1;
  overflow-y: auto;
  border-right: 1px solid #d5d5d5;
  background: white;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.message-item:hover {
  background: #f5f5f5;
}

.message-item.selected {
  background: #e3f2fd;
  border-left: 3px solid #2b6693;
}

.message-item.unread {
  background: #fafafa;
  font-weight: 500;
}

.message-item.unread .message-subject {
  color: #212121;
  font-weight: 600;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.sender-name {
  font-size: 0.9rem;
  color: #212121;
}

.message-date {
  font-size: 0.8rem;
  color: #757575;
}

.message-subject {
  font-size: 0.95rem;
  color: #424242;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-preview {
  font-size: 0.85rem;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-red { color: #f44336; }

/* Message Detail Pane */
.message-detail-pane {
  flex: 1.5;
  background: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.detail-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #212121;
  font-weight: 400;
}

.detail-actions {
  display: flex;
  gap: 8px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.meta-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.meta-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.meta-sender {
  font-weight: 500;
  color: #212121;
}

.meta-recipients {
  font-size: 0.85rem;
  color: #757575;
}

.meta-date {
  font-size: 0.85rem;
  color: #757575;
}

.detail-body {
  font-size: 1rem;
  line-height: 1.6;
  color: #212121;
  white-space: pre-wrap;
}

.detail-footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

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

.dhis2-btn.full-width {
  width: 100%;
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
  transition: background 0.2s;
}

.icon-btn:hover {
  background: #f0f0f0;
  color: #212121;
}

.icon-btn.danger:hover {
  background: #ffebee;
  color: #f44336;
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
  width: 500px;
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

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #494949;
  font-weight: 500;
}

.dhis2-select,
.dhis2-input,
.dhis2-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  font-size: 0.9rem;
  outline: none;
}

.dhis2-textarea {
  resize: vertical;
}

.dhis2-select:focus,
.dhis2-input:focus,
.dhis2-textarea:focus {
  border-color: #2b6693;
  box-shadow: 0 0 0 2px rgba(43, 102, 147, 0.1);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #9e9e9e;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  display: block;
}
</style>
