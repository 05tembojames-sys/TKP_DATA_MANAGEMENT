<template>
  <div class="dhis2-reports-app">
    <div class="app-body">
      <!-- Left Sidebar -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <div class="nav-group">
            <div class="nav-header">Report Types</div>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'all' }"
              @click.prevent="switchSection('all', 'All Reports')"
            >
              <span class="nav-icon">📊</span>
              All Reports
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'weekly' }"
              @click.prevent="switchSection('weekly', 'Weekly Reports')"
            >
              <span class="nav-icon">📅</span>
              Weekly Reports
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'monthly' }"
              @click.prevent="switchSection('monthly', 'Monthly Reports')"
            >
              <span class="nav-icon">🗓️</span>
              Monthly Reports
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'quarterly' }"
              @click.prevent="switchSection('quarterly', 'Quarterly Reports')"
            >
              <span class="nav-icon">📈</span>
              Quarterly Reports
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'annual' }"
              @click.prevent="switchSection('annual', 'Annual Reports')"
            >
              <span class="nav-icon">📚</span>
              Annual Reports
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'financial' }"
              @click.prevent="switchSection('financial', 'Financial Reports')"
            >
              <span class="nav-icon">💰</span>
              Financial Reports
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'other' }"
              @click.prevent="switchSection('other', 'Other Documents')"
            >
              <span class="nav-icon">📁</span>
              Other Documents
            </a>
          </div>

          <div class="nav-group">
            <div class="nav-header">Status</div>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'pending' }"
              @click.prevent="switchSection('pending', 'Pending Approval')"
            >
              <span class="nav-icon">⏳</span>
              Pending Approval
              <span v-if="reportStats.pending" class="badge">{{ reportStats.pending }}</span>
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'approved' }"
              @click.prevent="switchSection('approved', 'Approved Reports')"
            >
              <span class="nav-icon">✅</span>
              Approved
            </a>
             <a 
              href="#" 
              class="nav-item" 
              :class="{ active: currentSection === 'rejected' }"
              @click.prevent="switchSection('rejected', 'Rejected Reports')"
            >
              <span class="nav-icon">❌</span>
              Rejected
            </a>
          </div>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <div class="content-header">
          <h1 class="section-title">{{ currentSectionTitle }}</h1>
          <div class="header-controls">
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchQuery" 
                @input="performSearch"
                placeholder="Filter reports..."
                class="dhis2-input"
              />
            </div>
            <button @click="showUploadForm = true" class="dhis2-btn primary">
              <span class="btn-icon">+</span>
              Upload Report
            </button>
          </div>
        </div>

        <div class="content-body">
          <div v-if="loading" class="loading-overlay">
            <div class="spinner"></div>
          </div>

          <div v-else-if="reports.length === 0" class="empty-state-table">
            <p>No reports found.</p>
          </div>

          <table v-else class="dhis2-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Status</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td class="name-cell">
                  <div class="file-icon-small">{{ getFileIcon(report.fileType) }}</div>
                  <div class="report-name-wrapper">
                    <span class="report-name">{{ report.title }}</span>
                    <span class="report-desc">
                      {{ report.description }}
                      <span v-if="report.fileSize" class="file-size-tag">• {{ formatFileSize(report.fileSize) }}</span>
                    </span>
                  </div>
                </td>
                <td>{{ capitalize(report.reportType) }}</td>
                <td>{{ getUserDisplayName(report.uploadedBy) }}</td>
                <td>{{ formatDate(report.uploadedAt) }}</td>
                <td>
                  <span class="status-pill" :class="report.status">
                    {{ getStatusLabel(report.status) }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button @click="viewReport(report)" class="icon-btn" title="View">
                    👁️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Upload Form Modal -->
    <div v-if="showUploadForm" class="modal-overlay" @click="closeUploadForm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ previousReport ? 'Update Document' : 'Reports and Other Documents' }}</h3>
          <button @click="closeUploadForm" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="handleUploadReport" class="dhis2-form">
          <div class="form-row">
            <label>Name</label>
            <input 
              v-model="uploadForm.title" 
              type="text" 
              required 
              class="dhis2-input"
            />
          </div>
          
          <div class="form-row">
            <label>Type</label>
            <select v-model="uploadForm.reportType" class="dhis2-select">
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="quarterly">Quarterly Report</option>
              <option value="annual">Annual Report</option>
              <option value="financial">Financial Report</option>
              <option value="other">Other Document</option>
            </select>
          </div>
          
          <div class="form-row">
            <label>Description</label>
            <textarea 
              v-model="uploadForm.description" 
              class="dhis2-textarea"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <label>File</label>
            <input 
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              class="dhis2-file-input"
              required
            />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeUploadForm" class="dhis2-btn secondary">Cancel</button>
            <button type="submit" :disabled="uploading || !uploadForm.file" class="dhis2-btn primary">
              {{ uploading ? 'Uploading...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Approval/View Modal -->
    <div v-if="showApprovalForm" class="modal-overlay" @click="closeApprovalForm">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedReport?.title }}</h3>
          <button @click="closeApprovalForm" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="preview-container">
             <!-- Embedded Preview Logic -->
              <iframe 
                v-if="selectedReport?.fileType?.includes('pdf')"
                :src="selectedReport?.fileUrl"
                class="preview-frame"
              ></iframe>
              
              <img 
                v-else-if="selectedReport?.fileType?.includes('image')"
                :src="selectedReport?.fileUrl"
                class="preview-img"
              />
              
              <!-- Office Documents Preview -->
              <iframe 
                v-else-if="isOfficeDocument(selectedReport?.fileType)"
                :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedReport?.downloadURL)}`"
                class="preview-frame"
              ></iframe>

              <div v-else class="no-preview">
                <div class="file-icon-large">{{ getFileIcon(selectedReport?.fileType) }}</div>
                <p>Preview not available for this file type.</p>
                <a :href="selectedReport?.downloadURL" class="dhis2-btn primary">Download to View</a>
              </div>
          </div>
          
          <div class="approval-controls" v-if="isAdmin && selectedReport?.status === 'pending'">
            <div class="approval-header">Review Action</div>
            <textarea v-model="approvalForm.comments" placeholder="Add comments (optional)..." class="dhis2-textarea"></textarea>
            <div class="action-buttons">
               <button @click="handleApproveReport" class="dhis2-btn success">Approve Report</button>
               <button @click="handleRejectReport" class="dhis2-btn danger">Reject Report</button>
            </div>
          </div>
          
          <div class="approval-controls" v-else-if="selectedReport?.adminComments">
             <div class="approval-header">Admin Comments</div>
             <p class="comments-text">{{ selectedReport.adminComments }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="message" class="toast" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ReportService from '../services/reportService.js'
import AuthService from '../services/auth.js'
import UserService from '../services/userService.js'

const router = useRouter()

// Props
const props = defineProps({
  canApprove: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['back-to-dashboard'])

// State
const reports = ref([])
const reportStats = ref({})
const loading = ref(false)
const uploading = ref(false)
const approving = ref(false)
const userNames = ref({})
const searchQuery = ref('')
const currentSection = ref('all')
const currentSectionTitle = ref('All Reports')

// UI State
const showUploadForm = ref(false)
const showApprovalForm = ref(false)
const uploadForm = ref({ title: '', description: '', reportType: 'weekly', file: null })
const approvalForm = ref({ comments: '' })
const selectedReport = ref(null)
const previousReport = ref(null)
const message = ref('')
const messageType = ref('success')
const fileInput = ref(null)

// Permissions
const isAdmin = ref(false)
const currentUser = ref(null)

const canUserApprove = computed(() => props.canApprove && isAdmin.value)

// Methods
const switchSection = (section, title) => {
  currentSection.value = section
  currentSectionTitle.value = title
  loadReports()
}

const handleLogout = async () => {
  await AuthService.logout()
  router.push('/login')
}

const getUserInitials = (uid) => {
  const name = getUserDisplayName(uid)
  return name ? name.substring(0, 2).toUpperCase() : 'U'
}

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

// --- Existing Logic Preserved & Adapted ---

onMounted(async () => {
  await checkUserPermissions()
  await Promise.all([loadReportsAndStats(), fetchUserNames()])
})

const checkUserPermissions = async () => {
  const user = AuthService.getCurrentUser()
  if (user) {
    currentUser.value = user.email || user.uid
    isAdmin.value = true // Simplified for demo
  }
}

const loadReportsAndStats = async () => {
  loading.value = true
  try {
    const filters = { category: 'general-report' }
    
    // Apply filters based on currentSection
    if (['weekly', 'monthly', 'quarterly', 'annual', 'financial', 'other'].includes(currentSection.value)) {
      filters.reportType = currentSection.value
    } else if (['pending', 'approved', 'rejected'].includes(currentSection.value)) {
      filters.status = currentSection.value
    }

    const result = await ReportService.getAllReports(filters)
    if (result.success) {
      let allReports = result.reports
      // Client-side search filtering
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        allReports = allReports.filter(r => 
          r.title.toLowerCase().includes(q) || 
          (r.description && r.description.toLowerCase().includes(q))
        )
      }
      reports.value = allReports
      
      // Update stats (global, not filtered)
      if (currentSection.value === 'all' && !searchQuery.value) {
         reportStats.value = {
          total: allReports.length,
          pending: allReports.filter(r => r.status === 'pending').length,
          approved: allReports.filter(r => r.status === 'approved').length,
          rejected: allReports.filter(r => r.status === 'rejected').length
        }
      }
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    console.error(error)
    showMessage('Error loading reports', 'error')
  } finally {
    loading.value = false
  }
}

const loadReports = loadReportsAndStats

const fetchUserNames = async () => {
  try {
    const res = await UserService.getAllUsers()
    if (res.success) {
      res.users.forEach(u => {
        const key = u.email || u.uid
        userNames.value[key] = u.name || u.fullName || u.username || u.email
      })
    }
  } catch (e) { console.error(e) }
}

const performSearch = () => {
  loadReports()
}

const getUserDisplayName = (id) => userNames.value[id] || id || 'Unknown'

const getFileIcon = (type) => {
  if (!type) return '📄'
  type = type.toLowerCase()
  if (type.includes('pdf')) return '📕'
  if (type.includes('word') || type.includes('doc')) return '📘'
  if (type.includes('excel') || type.includes('sheet') || type.includes('spreadsheet')) return '📗'
  if (type.includes('powerpoint') || type.includes('presentation')) return '📙'
  if (type.includes('image')) return '🖼️'
  return '📄'
}

const isOfficeDocument = (type) => {
  if (!type) return false
  type = type.toLowerCase()
  return type.includes('word') || 
         type.includes('doc') || 
         type.includes('excel') || 
         type.includes('sheet') || 
         type.includes('spreadsheet') ||
         type.includes('powerpoint') || 
         type.includes('presentation')
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

const getStatusLabel = (status) => {
  const map = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }
  return map[status] || status
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => message.value = '', 3000)
}

// Upload & Actions
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file && file.size > 50 * 1024 * 1024) {
    showMessage('File too large (>50MB)', 'error')
    return
  }
  uploadForm.value.file = file
}

const handleUploadReport = async () => {
  if (!uploadForm.value.file || !uploadForm.value.title) return
  uploading.value = true
  try {
    const data = { ...uploadForm.value, uploadedBy: currentUser.value, category: 'general-report' }
    const res = await ReportService.uploadReport(data)
    if (res.success) {
      showMessage('Uploaded successfully')
      closeUploadForm()
      loadReports()
    } else {
      showMessage(res.error, 'error')
    }
  } catch (e) {
    showMessage('Upload failed', 'error')
  } finally {
    uploading.value = false
  }
}

const closeUploadForm = () => {
  showUploadForm.value = false
  uploadForm.value = { title: '', description: '', reportType: 'weekly', file: null }
  previousReport.value = null
}

const viewReport = (r) => {
  selectedReport.value = r
  approvalForm.value.comments = ''
  showApprovalForm.value = true
}

const closeApprovalForm = () => {
  showApprovalForm.value = false
  selectedReport.value = null
}

const uploadUpdatedVersion = (r) => {
  previousReport.value = r
  uploadForm.value = { 
    title: r.title, 
    description: r.description, 
    reportType: r.reportType, 
    file: null 
  }
  showUploadForm.value = true
}

const handleApproveReport = async () => {
  await updateStatus(selectedReport.value.id, 'approved', approvalForm.value.comments)
  closeApprovalForm()
}

const handleRejectReport = async () => {
  await updateStatus(selectedReport.value.id, 'rejected', approvalForm.value.comments)
  closeApprovalForm()
}

const updateStatus = async (id, status, comments = '') => {
  const res = await ReportService.updateReportStatus(id, status, comments, currentUser.value)
  if (res.success) {
    showMessage(`Report ${status}`)
    loadReports()
  } else {
    showMessage(res.error, 'error')
  }
}

const confirmDeleteReport = async (r) => {
  if(!confirm('Delete report?')) return
  const res = await ReportService.deleteReport(r.id, r.appwriteFileId, r.appwriteBucketId)
  if (res.success) {
    showMessage('Deleted')
    loadReports()
  } else {
    showMessage(res.error, 'error')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.dhis2-reports-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Roboto', sans-serif;
  background-color: #f3f5f7;
  color: #212934;
}

/* App Body */
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #d5dde5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-group {
  margin-bottom: 24px;
}

.nav-header {
  padding: 0 16px 8px;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #6e7a8a;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #404b5a;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: #f3f5f7;
}

.nav-item.active {
  background-color: #e8f5ff;
  color: #147cd7;
  border-left-color: #147cd7;
  font-weight: 500;
}

.nav-icon {
  margin-right: 12px;
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
}

.badge {
  margin-left: auto;
  background: #e0e0e0;
  color: #494949;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
}

.nav-item.active .badge {
  background: #147cd7;
  color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  overflow: hidden;
}

.content-header {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d5dde5;
  background: white;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  color: #212934;
}

.header-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box input {
  width: 240px;
}

.content-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* DHIS2 Components */
.dhis2-input, .dhis2-select, .dhis2-textarea {
  padding: 8px 12px;
  border: 1px solid #a0adba;
  border-radius: 3px;
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.dhis2-input:focus, .dhis2-select:focus, .dhis2-textarea:focus {
  outline: none;
  border-color: #147cd7;
  box-shadow: 0 0 0 2px rgba(20, 124, 215, 0.2);
}

.dhis2-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid transparent;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  text-decoration: none;
}

.dhis2-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dhis2-btn.primary {
  background: linear-gradient(135deg, #147cd7 0%, #0d63b5 100%);
  color: white;
  border-color: #147cd7;
  box-shadow: 0 2px 8px rgba(20, 124, 215, 0.3);
}

.dhis2-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0d63b5 0%, #0a4f92 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(20, 124, 215, 0.4);
}

.dhis2-btn.secondary {
  background: white;
  border-color: #d5dde5;
  color: #404b5a;
}

.dhis2-btn.secondary:hover {
  background: #f3f5f7;
  border-color: #a0adba;
}

.dhis2-btn.success { 
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white; 
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.dhis2-btn.success:hover {
  background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.dhis2-btn.danger { 
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white; 
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.dhis2-btn.danger:hover {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

/* Table */
.dhis2-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #d5dde5;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.dhis2-table th {
  text-align: left;
  padding: 12px 16px;
  background: #f3f5f7;
  border-bottom: 1px solid #d5dde5;
  color: #404b5a;
  font-weight: 500;
  font-size: 0.85rem;
}

.dhis2-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e8edf2;
  font-size: 0.9rem;
  color: #212934;
  vertical-align: middle;
}

.dhis2-table tr:last-child td {
  border-bottom: none;
}

.dhis2-table tr:hover {
  background-color: #f8f9fa;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.report-name-wrapper {
  display: flex;
  flex-direction: column;
}

.report-name {
  font-weight: 500;
}

.report-desc {
  font-size: 0.8rem;
  color: #6e7a8a;
}

.file-size-tag {
  color: #a0adba;
}

.status-pill {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-pill.pending { background: #fff8e1; color: #f57f17; }
.status-pill.approved { background: #e8f5e9; color: #2e7d32; }
.status-pill.rejected { background: #ffebee; color: #c62828; }

.actions-cell {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 1.1rem;
  color: #6e7a8a;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #e8edf2;
  color: #147cd7;
}

/* Dropdown */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 4px;
  z-index: 1;
  border: 1px solid #d5dde5;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  color: #212934;
  padding: 10px 16px;
  text-decoration: none;
  display: block;
  font-size: 0.9rem;
  cursor: pointer;
}

.dropdown-content a:hover {
  background-color: #f3f5f7;
}

.text-danger { color: #d32f2f !important; }

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(33, 41, 52, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 550px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.large-modal { width: 900px; }

.modal-header {
  padding: 24px 28px;
  border-bottom: 2px solid #e8edf2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
}

.modal-header h3 { 
  margin: 0; 
  font-size: 1.3rem; 
  color: #147cd7;
  font-weight: 600;
}

.modal-body {
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #a0adba;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

.dhis2-form { 
  padding: 28px; 
}

.form-row { 
  margin-bottom: 20px; 
}

.form-row label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #212934;
  font-size: 0.95rem;
}

.dhis2-file-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px dashed #a0adba;
  border-radius: 6px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.dhis2-file-input:hover {
  border-color: #147cd7;
  background: #e8f5ff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e8edf2;
}

/* Preview */
.preview-container {
  padding: 24px;
  background: #f3f5f7;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d5dde5;
}

.preview-frame { width: 100%; height: 600px; border: none; background: white; }
.preview-img { max-width: 100%; max-height: 600px; }

.no-preview { text-align: center; }
.file-icon-large { font-size: 4rem; margin-bottom: 16px; }

.approval-controls {
  padding: 24px;
  background: white;
}

.approval-header {
  font-weight: 500;
  margin-bottom: 12px;
  color: #212934;
}

.comments-text {
  color: #404b5a;
  font-style: italic;
  background: #f3f5f7;
  padding: 12px;
  border-radius: 4px;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

/* Loading & Empty */
.loading-overlay {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e8edf2;
  border-top: 3px solid #147cd7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.empty-state-table {
  text-align: center;
  padding: 40px;
  color: #6e7a8a;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 550px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.large-modal { width: 900px; }

.modal-header {
  padding: 24px 28px;
  border-bottom: 2px solid #e8edf2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
}

.modal-header h3 { 
  margin: 0; 
  font-size: 1.3rem; 
  color: #147cd7;
  font-weight: 600;
}

.modal-body {
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #a0adba;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

.dhis2-form { 
  padding: 28px; 
}

.form-row { 
  margin-bottom: 20px; 
}

.form-row label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #212934;
  font-size: 0.95rem;
}

.dhis2-file-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px dashed #a0adba;
  border-radius: 6px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.dhis2-file-input:hover {
  border-color: #147cd7;
  background: #e8f5ff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e8edf2;
}

/* Preview */
.preview-container {
  padding: 24px;
  background: #f3f5f7;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d5dde5;
}

.preview-frame { width: 100%; height: 600px; border: none; background: white; }
.preview-img { max-width: 100%; max-height: 600px; }

.no-preview { text-align: center; }
.file-icon-large { font-size: 4rem; margin-bottom: 16px; }

.approval-controls {
  padding: 24px;
  background: white;
}

.approval-header {
  font-weight: 500;
  margin-bottom: 12px;
  color: #212934;
}

.comments-text {
  color: #404b5a;
  font-style: italic;
  background: #f3f5f7;
  padding: 12px;
  border-radius: 4px;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

/* Loading & Empty */
.loading-overlay {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e8edf2;
  border-top: 3px solid #147cd7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.empty-state-table {
  text-align: center;
  padding: 40px;
  color: #6e7a8a;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 2000;
}

.toast.success { background: #2e7d32; }
.toast.error { background: #d32f2f; }

@media (max-width: 768px) {
  .app-body {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #d5dde5;
    display: none; /* Hide sidebar on mobile by default, or toggle it */
  }

  /* If you want a toggle for the sidebar, you'd need to add a button and state */
  /* For now, let's just stack it if visible or hide it */
  
  .content-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  font-weight: 600;
}

.modal-body {
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #a0adba;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

.dhis2-form { 
  padding: 28px; 
}

.form-row { 
  margin-bottom: 20px; 
}

.form-row label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #212934;
  font-size: 0.95rem;
}

.dhis2-file-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px dashed #a0adba;
  border-radius: 6px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.dhis2-file-input:hover {
  border-color: #147cd7;
  background: #e8f5ff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e8edf2;
}

/* Preview */
.preview-container {
  padding: 24px;
  background: #f3f5f7;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d5dde5;
}

.preview-frame { width: 100%; height: 600px; border: none; background: white; }
.preview-img { max-width: 100%; max-height: 600px; }

.no-preview { text-align: center; }
.file-icon-large { font-size: 4rem; margin-bottom: 16px; }

.approval-controls {
  padding: 24px;
  background: white;
}

.approval-header {
  font-weight: 500;
  margin-bottom: 12px;
  color: #212934;
}

.comments-text {
  color: #404b5a;
  font-style: italic;
  background: #f3f5f7;
  padding: 12px;
  border-radius: 4px;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

/* Loading & Empty */
.loading-overlay {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e8edf2;
  border-top: 3px solid #147cd7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.empty-state-table {
  text-align: center;
  padding: 40px;
  color: #6e7a8a;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 2000;
}

.toast.success { background: #2e7d32; }
.toast.error { background: #d32f2f; }

@media (max-width: 768px) {
  .app-body {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #d5dde5;
    display: none; /* Hide sidebar on mobile by default, or toggle it */
  }

  /* If you want a toggle for the sidebar, you'd need to add a button and state */
  /* For now, let's just stack it if visible or hide it */
  
  .content-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .header-controls {
    flex-direction: column;
    width: 100%;
  }

  .search-box input {
    width: 100%;
  }

  .dhis2-table {
    display: block;
    overflow-x: auto;
  }
  
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
}
</style>