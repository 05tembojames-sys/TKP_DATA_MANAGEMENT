<template>
  <div class="reports-container">
    <!-- Header Section -->
    <div class="reports-header">
      <div class="header-nav">
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
          <h1 class="reports-title">📊 Reports - Weekly</h1>
          <p class="reports-subtitle">Upload and manage weekly reports with admin approval workflow</p>
        </div>
        <div class="header-right">
          <button @click="handleLogout" class="logout-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
      <div class="header-content">
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-number">{{ reportStats.total || 0 }}</div>
            <div class="stat-label">Total Reports</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ reportStats.pending || 0 }}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ reportStats.approved || 0 }}</div>
            <div class="stat-label">Approved</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-bar">
      <button @click="showUploadForm = true" class="upload-btn">
        📤 Upload New Report
      </button>
      <div class="filter-controls">
        <select v-model="selectedFilter" @change="loadReports" class="filter-select">
          <option value="">All Reports</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select v-model="selectedTypeFilter" @change="loadReports" class="filter-select">
          <option value="">All Types</option>
          <option value="weekly">Weekly Reports</option>
          <option value="monthly">Monthly Reports</option>
          <option value="quarterly">Quarterly Reports</option>
          <option value="annual">Annual Reports</option>
        </select>
      </div>
    </div>

    <!-- Upload Form Modal -->
    <div v-if="showUploadForm" class="modal-overlay" @click="closeUploadForm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>📤 Upload New Report</h3>
          <button @click="closeUploadForm" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="handleUploadReport" class="upload-form">
          <div class="form-group">
            <label>Report Title *</label>
            <input 
              v-model="uploadForm.title" 
              type="text" 
              required 
              placeholder="e.g., Weekly Report - Week 42"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Report Type</label>
            <select v-model="uploadForm.reportType" class="form-select">
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="quarterly">Quarterly Report</option>
              <option value="annual">Annual Report</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Description (Optional)</label>
            <textarea 
              v-model="uploadForm.description" 
              placeholder="Brief description of the report contents..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Select File *</label>
            <div class="file-upload-area" @click="fileInput.click()">
              <input 
                ref="fileInput"
                type="file"
                @change="handleFileSelect"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                hidden
                required
              />
              <div v-if="!uploadForm.file" class="upload-placeholder">
                <div class="upload-icon">📁</div>
                <div class="upload-text">Click to select a file</div>
                <div class="upload-hint">Supported: PDF, Word, Excel, PowerPoint, Text files</div>
              </div>
              <div v-else class="selected-file">
                <div class="file-info">
                  <span class="file-icon">{{ getFileIcon(uploadForm.file.type) }}</span>
                  <div class="file-details">
                    <div class="file-name">{{ uploadForm.file.name }}</div>
                    <div class="file-size">{{ formatFileSize(uploadForm.file.size) }}</div>
                  </div>
                </div>
                <button type="button" @click.stop="clearFile" class="remove-file-btn">×</button>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" :disabled="uploading || !uploadForm.file" class="submit-btn">
              {{ uploading ? 'Uploading...' : 'Upload Report' }}
            </button>
            <button type="button" @click="closeUploadForm" class="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reports List -->
    <div class="reports-list">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading reports...</p>
      </div>
      
      <div v-else-if="reports.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No Reports Found</h3>
        <p>{{ selectedFilter ? 'No reports match your current filter.' : 'Upload your first report to get started.' }}</p>
      </div>
      
      <div v-else class="reports-grid">
        <div 
          v-for="report in reports" 
          :key="report.id" 
          class="report-card"
          :class="[`status-${report.status}`]"
        >
          <div class="report-header">
            <div class="report-info">
              <span class="file-icon">{{ getFileIcon(report.fileType) }}</span>
              <div class="report-details">
                <h4 class="report-title">{{ report.title }}</h4>
                <p class="report-meta">
                  {{ report.reportType }} • {{ formatFileSize(report.fileSize) }}
                </p>
              </div>
            </div>
            <div class="status-badge" :class="`status-${report.status}`">
              {{ getStatusLabel(report.status) }}
            </div>
          </div>
          
          <div v-if="report.description" class="report-description">
            {{ report.description }}
          </div>
          
          <div class="report-metadata">
            <div class="metadata-item">
              <strong>Uploaded:</strong> {{ formatDate(report.uploadedAt) }}
            </div>
            <div class="metadata-item">
              <strong>Uploaded by:</strong> {{ getUserDisplayName(report.uploadedBy) }}
            </div>
            <div v-if="report.approvedBy" class="metadata-item">
              <strong>{{ report.status === 'approved' ? 'Approved' : 'Reviewed' }} by:</strong> {{ getUserDisplayName(report.approvedBy) }}
            </div>
            <div v-if="report.approvedAt" class="metadata-item">
              <strong>Date:</strong> {{ formatDate(report.approvedAt) }}
            </div>
          </div>
          
          <div v-if="report.adminComments" class="admin-comments">
            <strong>Admin Comments:</strong>
            <p>{{ report.adminComments }}</p>
          </div>
          
          <div class="report-actions">
            <a 
              :href="report.downloadURL" 
              target="_blank" 
              class="action-btn download-btn"
            >
              📥 Download
            </a>
            
            <div v-if="isAdmin" class="admin-actions">
              <button 
                v-if="report.status === 'pending' && canUserApprove"
                @click="showApprovalModal(report)"
                class="action-btn approve-btn"
              >
                ✅ Review
              </button>
              <button 
                v-if="canUserApprove"
                @click="confirmDeleteReport(report)"
                class="action-btn delete-btn"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approval Modal -->
    <div v-if="showApprovalForm" class="modal-overlay" @click="closeApprovalForm">
      <div class="modal-content approval-modal" @click.stop>
        <div class="modal-header">
          <h3>📋 Review Report: {{ selectedReport?.title }}</h3>
          <button @click="closeApprovalForm" class="close-btn">&times;</button>
        </div>
        
        <div class="approval-form">
          <!-- File Preview Section -->
          <div class="file-preview-section">
            <div class="preview-header">
              <div class="preview-info">
                <span class="file-icon large">{{ getFileIcon(selectedReport?.fileType) }}</span>
                <div>
                  <h4>{{ selectedReport?.title }}</h4>
                  <p>{{ selectedReport?.reportType }} • {{ formatFileSize(selectedReport?.fileSize) }}</p>
                  <p class="uploaded-info">Uploaded by {{ getUserDisplayName(selectedReport?.uploadedBy) }} on {{ formatDate(selectedReport?.uploadedAt) }}</p>
                </div>
              </div>
              
              <a :href="selectedReport?.downloadURL" target="_blank" class="download-link-btn">
                📥 Download
              </a>
            </div>
            
            <!-- Embedded Preview -->
            <div class="embedded-preview">
              <!-- PDF Preview -->
              <iframe 
                v-if="selectedReport?.fileType?.includes('pdf')"
                :src="selectedReport?.fileUrl"
                class="preview-iframe"
                frameborder="0"
              >
                Your browser does not support PDF preview.
              </iframe>
              
              <!-- Image Preview -->
              <img 
                v-else-if="selectedReport?.fileType?.includes('image')"
                :src="selectedReport?.fileUrl"
                :alt="selectedReport?.title"
                class="preview-image"
              />
              
              <!-- Text/Code Preview -->
              <iframe 
                v-else-if="selectedReport?.fileType?.includes('text') || selectedReport?.fileType?.includes('json')"
                :src="selectedReport?.fileUrl"
                class="preview-iframe"
                frameborder="0"
              >
              </iframe>
              
              <!-- Office Documents (Word, Excel, PowerPoint) -->
              <iframe 
                v-else-if="isOfficeDocument(selectedReport?.fileType)"
                :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(selectedReport?.downloadURL)}`"
                class="preview-iframe"
                frameborder="0"
              >
                Loading document preview...
              </iframe>
              
              <!-- Fallback for other file types -->
              <div v-else class="preview-fallback">
                <div class="fallback-icon">{{ getFileIcon(selectedReport?.fileType) }}</div>
                <h3>{{ selectedReport?.fileName }}</h3>
                <p>Preview not available for this file type</p>
                <a :href="selectedReport?.downloadURL" target="_blank" class="fallback-download-btn">
                  📥 Download to View
                </a>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Admin Comments (Optional)</label>
            <textarea 
              v-model="approvalForm.comments"
              placeholder="Add any comments or feedback..."
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
          
          <div class="approval-actions">
            <button 
              @click="handleApproveReport"
              :disabled="approving"
              class="approve-btn"
            >
              ✅ {{ approving ? 'Approving...' : 'Approve Report' }}
            </button>
            <button 
              @click="handleRejectReport"
              :disabled="approving"
              class="reject-btn"
            >
              ❌ {{ approving ? 'Rejecting...' : 'Reject Report' }}
            </button>
            <button @click="closeApprovalForm" class="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="message-toast" :class="messageType">
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

// Template ref for file input
const fileInput = ref(null)

// Component state
const reports = ref([])
const reportStats = ref({})
const loading = ref(false)
const uploading = ref(false)
const approving = ref(false)
const userNames = ref({}) // Cache for user names

// UI state
const showUploadForm = ref(false)
const showApprovalForm = ref(false)
const selectedFilter = ref('')
const selectedTypeFilter = ref('')

// Forms
const uploadForm = ref({
  title: '',
  description: '',
  reportType: 'weekly',
  file: null
})

const approvalForm = ref({
  comments: ''
})

const selectedReport = ref(null)

// Messages
const message = ref('')
const messageType = ref('success')

// User permissions
const isAdmin = ref(false)
const currentUser = ref(null)

// Computed property to check if user can approve reports
const canUserApprove = computed(() => {
  return props.canApprove && isAdmin.value
})

// Initialize component
onMounted(async () => {
  await checkUserPermissions()
  await loadReports()
  await loadReportStatistics()
})

// Check if current user is admin
const checkUserPermissions = async () => {
  const user = AuthService.getCurrentUser()
  if (user) {
    currentUser.value = user.email || user.uid
    // For now, assume all authenticated users can upload and admins can approve
    // You might want to implement proper role-based access control
    isAdmin.value = true // Adjust this based on your admin role logic
  }
}

// Load reports with optional filtering
const loadReports = async () => {
  loading.value = true
  try {
    const filters = {}
    if (selectedFilter.value) filters.status = selectedFilter.value
    if (selectedTypeFilter.value) filters.reportType = selectedTypeFilter.value

    const result = await ReportService.getAllReports(filters)
    if (result.success) {
      reports.value = result.reports
      // Fetch user names for all reports
      await fetchUserNamesForReports(result.reports)
    } else {
      showMessage(result.error || 'Failed to load reports', 'error')
    }
  } catch (error) {
    console.error('Error loading reports:', error)
    showMessage('An unexpected error occurred while loading reports', 'error')
  } finally {
    loading.value = false
  }
}

// Fetch user names for reports
const fetchUserNamesForReports = async (reportsList) => {
  try {
    // Get all unique user emails from reports
    const userEmails = [...new Set(
      reportsList.map(r => r.uploadedBy).concat(
        reportsList.map(r => r.approvedBy).filter(Boolean)
      )
    )]
    
    // Fetch all users from Firestore
    const usersResult = await UserService.getAllUsers()
    if (usersResult.success) {
      const usersMap = {}
      usersResult.users.forEach(user => {
        // Map by email
        if (user.email) {
          usersMap[user.email] = user.name || user.fullName || user.username || user.email
        }
        // Also map by uid
        if (user.uid) {
          usersMap[user.uid] = user.name || user.fullName || user.username || user.email
        }
      })
      userNames.value = usersMap
    }
  } catch (error) {
    console.error('Error fetching user names:', error)
  }
}

// Get display name for user
const getUserDisplayName = (emailOrUid) => {
  if (!emailOrUid) return 'Unknown User'
  return userNames.value[emailOrUid] || emailOrUid
}

// Load report statistics
const loadReportStatistics = async () => {
  try {
    const result = await ReportService.getReportStatistics()
    if (result.success) {
      reportStats.value = result.statistics
    }
  } catch (error) {
    console.error('Error loading report statistics:', error)
  }
}

// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size (e.g., max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showMessage('File size must be less than 50MB', 'error')
      return
    }
    uploadForm.value.file = file
  }
}

// Clear selected file
const clearFile = () => {
  uploadForm.value.file = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Handle report upload
const handleUploadReport = async () => {
  if (!uploadForm.value.file || !uploadForm.value.title) {
    showMessage('Please provide a title and select a file', 'error')
    return
  }

  uploading.value = true
  try {
    const reportData = {
      ...uploadForm.value,
      uploadedBy: currentUser.value
    }

    const result = await ReportService.uploadReport(reportData)
    if (result.success) {
      showMessage('Report uploaded successfully! It will be reviewed by an admin.', 'success')
      closeUploadForm()
      await loadReports()
      await loadReportStatistics()
    } else {
      showMessage(result.error || 'Failed to upload report', 'error')
    }
  } catch (error) {
    console.error('Error uploading report:', error)
    showMessage('An unexpected error occurred while uploading', 'error')
  } finally {
    uploading.value = false
  }
}

// Show approval modal
const showApprovalModal = (report) => {
  selectedReport.value = report
  approvalForm.value.comments = ''
  showApprovalForm.value = true
}

// Handle report approval
const handleApproveReport = async () => {
  if (!selectedReport.value) return

  approving.value = true
  try {
    const result = await ReportService.updateReportStatus(
      selectedReport.value.id,
      'approved',
      approvalForm.value.comments,
      currentUser.value
    )

    if (result.success) {
      showMessage('Report approved successfully!', 'success')
      closeApprovalForm()
      await loadReports()
      await loadReportStatistics()
    } else {
      showMessage(result.error || 'Failed to approve report', 'error')
    }
  } catch (error) {
    console.error('Error approving report:', error)
    showMessage('An unexpected error occurred', 'error')
  } finally {
    approving.value = false
  }
}

// Handle report rejection
const handleRejectReport = async () => {
  if (!selectedReport.value) return

  approving.value = true
  try {
    const result = await ReportService.updateReportStatus(
      selectedReport.value.id,
      'rejected',
      approvalForm.value.comments,
      currentUser.value
    )

    if (result.success) {
      showMessage('Report rejected', 'success')
      closeApprovalForm()
      await loadReports()
      await loadReportStatistics()
    } else {
      showMessage(result.error || 'Failed to reject report', 'error')
    }
  } catch (error) {
    console.error('Error rejecting report:', error)
    showMessage('An unexpected error occurred', 'error')
  } finally {
    approving.value = false
  }
}

// Confirm and delete report
const confirmDeleteReport = async (report) => {
  if (!confirm(`Are you sure you want to delete "${report.title}"? This action cannot be undone.`)) {
    return
  }

  try {
    // Pass Appwrite file ID and bucket ID instead of storage path
    const result = await ReportService.deleteReport(
      report.id, 
      report.appwriteFileId, 
      report.appwriteBucketId
    )
    if (result.success) {
      showMessage('Report deleted successfully', 'success')
      await loadReports()
      await loadReportStatistics()
    } else {
      showMessage(result.error || 'Failed to delete report', 'error')
    }
  } catch (error) {
    console.error('Error deleting report:', error)
    showMessage('An unexpected error occurred', 'error')
  }
}

// Close upload form
const closeUploadForm = () => {
  showUploadForm.value = false
  uploadForm.value = {
    title: '',
    description: '',
    reportType: 'weekly',
    file: null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Close approval form
const closeApprovalForm = () => {
  showApprovalForm.value = false
  selectedReport.value = null
  approvalForm.value.comments = ''
}

// Utility functions
const formatFileSize = (bytes) => ReportService.formatFileSize(bytes)
const getFileIcon = (fileType) => ReportService.getFileTypeIcon(fileType)

// Check if file is an Office document
const isOfficeDocument = (fileType) => {
  if (!fileType) return false
  return fileType.includes('word') || 
         fileType.includes('document') ||
         fileType.includes('excel') || 
         fileType.includes('spreadsheet') ||
         fileType.includes('powerpoint') || 
         fileType.includes('presentation') ||
         fileType.includes('officedocument')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected'
  }
  return labels[status] || status
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Navigation methods
const goBack = () => {
  router.push('/dashboard')
}

const handleLogout = async () => {
  const result = await AuthService.logout()
  if (result.success) {
    router.push('/login')
  }
}
</script>

<style scoped>
/* Main Container */
.reports-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}

/* Header */
.reports-header {
  background: linear-gradient(135deg, #4A148C 0%, #2D1B69 100%);
  color: white;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.3);
  overflow: hidden;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-end;
}

.header-center {
  flex: 2;
  text-align: center;
}

.back-button,
.logout-button {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.back-button:hover,
.logout-button:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.logout-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.logout-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.header-content {
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.reports-title {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.reports-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.upload-btn {
  background: linear-gradient(135deg, #4A148C 0%, #2D1B69 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(74, 20, 140, 0.3);
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 20, 140, 0.4);
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #4A148C;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #4A148C;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  color: #4A148C;
  margin: 0;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

/* Upload Form */
.upload-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #4A148C;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #4A148C;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #4A148C;
  box-shadow: 0 0 0 3px rgba(74, 20, 140, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* File Upload Area */
.file-upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.file-upload-area:hover {
  border-color: #4A148C;
  background: #f5f3ff;
}

.upload-placeholder .upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 1.1rem;
  color: #4A148C;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.9rem;
  color: #666;
}

.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 2rem;
}

.file-icon.large {
  font-size: 3rem;
}

.file-details .file-name {
  font-weight: 600;
  color: #4A148C;
}

.file-details .file-size {
  font-size: 0.9rem;
  color: #666;
}

.remove-file-btn {
  background: #dc3545;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background: #c82333;
}

/* Form Actions */
.form-actions, .approval-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.submit-btn, .approve-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover, .approve-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.reject-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reject-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #5a6268;
}

/* Loading and Empty States */
.loading-state {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A148C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #4A148C;
  margin-bottom: 0.5rem;
}

/* Reports Grid */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.report-card.status-pending {
  border-left: 4px solid #ffc107;
}

.report-card.status-approved {
  border-left: 4px solid #28a745;
}

.report-card.status-rejected {
  border-left: 4px solid #dc3545;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.report-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.report-details h4 {
  color: #4A148C;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.report-meta {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.report-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.report-metadata {
  margin-bottom: 1rem;
}

.metadata-item {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.admin-comments {
  background: #e9ecef;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.admin-comments strong {
  color: #4A148C;
}

.admin-comments p {
  margin: 0.5rem 0 0 0;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.admin-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn {
  background: #4A148C;
  color: white;
}

.download-btn:hover {
  background: #2D1B69;
}

.approve-btn {
  background: #28a745;
  color: white;
}

.approve-btn:hover {
  background: #218838;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

/* Approval Modal */
.approval-modal {
  max-width: 1000px;
  max-height: 90vh;
}

.approval-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* File Preview Section */
.file-preview-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-header {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.preview-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.preview-info h4 {
  color: #4A148C;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.preview-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.uploaded-info {
  font-style: italic;
  font-size: 0.85rem;
}

.download-link-btn {
  background: #4A148C;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.download-link-btn:hover {
  background: #2D1B69;
  text-decoration: none;
  color: white;
  transform: translateY(-1px);
}

/* Embedded Preview */
.embedded-preview {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
  max-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-iframe {
  width: 100%;
  height: 600px;
  border: none;
}

.preview-image {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
}

/* Preview Fallback */
.preview-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #666;
}

.fallback-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.preview-fallback h3 {
  color: #4A148C;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.preview-fallback p {
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
}

.fallback-download-btn {
  background: linear-gradient(135deg, #4A148C 0%, #2D1B69 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.fallback-download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.4);
  text-decoration: none;
  color: white;
}

/* Message Toast */
.message-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1100;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.message-toast.success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.message-toast.error {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .reports-container {
    padding: 1rem;
  }

  .header-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .header-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls {
    justify-content: center;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .report-header {
    flex-direction: column;
    gap: 1rem;
  }

  .report-actions {
    flex-direction: column;
  }

  .admin-actions {
    flex-direction: column;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .approval-modal {
    max-width: 95%;
  }

  .preview-header {
    flex-direction: column;
    align-items: stretch;
  }

  .download-link-btn {
    width: 100%;
    text-align: center;
  }

  .embedded-preview {
    min-height: 400px;
    max-height: 500px;
  }

  .preview-iframe {
    height: 400px;
  }

  .report-preview {
    flex-direction: column;
    gap: 1rem;
  }

  .preview-btn {
    align-self: stretch;
    text-align: center;
  }

  .form-actions, .approval-actions {
    flex-direction: column;
  }

  .message-toast {
    left: 20px;
    right: 20px;
    min-width: auto;
  }

  .header-nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .header-left, .header-center, .header-right {
    flex: none;
    width: 100%;
  }

  .header-left {
    order: 1;
  }

  .header-center {
    order: 2;
    text-align: center;
  }

  .header-right {
    order: 3;
    justify-content: center;
  }

  .back-button,
  .logout-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .reports-title {
    font-size: 1.5rem;
  }

  .reports-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .header-nav {
    padding: 0.75rem;
  }

  .reports-title {
    font-size: 1.25rem;
  }

  .reports-subtitle {
    font-size: 0.85rem;
  }

  .back-button,
  .logout-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    width: 100%;
    justify-content: center;
  }

  .header-right {
    flex-direction: row;
    gap: 0.5rem;
  }

  .stat-card {
    padding: 0.75rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .header-stats {
    grid-template-columns: 1fr;
  }
}
</style>