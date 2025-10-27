<template>
  <div class="reports-container">

    <!-- Main Content -->
    <div class="reports-content">
      <!-- Upload Button -->
      <div class="upload-button-section" v-if="!showUploadForm">
        <div class="section-header">
          <h2>📋 Uploaded Documents</h2>
          <p>View and manage your uploaded Documents</p>
        </div>
        <div class="upload-button-container">
          <button @click="showUploadForm = true" class="show-upload-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14" />
              <path d="m5 12 14 0" />
            </svg>
            Upload New Document
          </button>
        </div>
      </div>

      <!-- Upload Form -->
      <div class="upload-section" v-if="showUploadForm">
        <div class="section-header">
          <h2>📤 Upload New Document</h2>
          <p>Upload document with specific types</p>
        </div>
        
        <form @submit.prevent="handleUploadReport" class="upload-form">
          <div class="form-group">
            <label>Document Title *</label>
            <input 
              v-model="uploadForm.title" 
              type="text" 
              required 
              placeholder="Girl child name"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Document Type *</label>
            <select v-model="uploadForm.reportType" class="form-select" required>
              <option value="">Select Document Type</option>
              <option value="tkp-parent-guardian">TKP-parent/Guardian program agreement</option>
              <option value="parental-consent">Parental Consent and liability release</option>
              <option value="child-admission">Consent of Child Admission</option>
              <option value="medical-care">Medical of care Consent</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Description (Optional)</label>
            <textarea 
              v-model="uploadForm.description" 
              placeholder="Brief description of the Document contents..."
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
              {{ uploading ? 'Uploading...' : 'Upload Document' }}
            </button>
            <button type="button" @click="cancelUpload" class="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Reports List Section -->
      <div class="reports-list-section">
        <!-- Search and Filter Panel -->
        <div class="search-panel">
          <div class="search-controls">
            <div class="search-input-group">
              <label class="search-label">Search Document</label>
              <div class="search-input-container">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  @input="performSearch"
                  placeholder="Search by title or description..."
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

            <div class="filter-group">
              <div class="filter-item">
                <label class="filter-label">Document Type</label>
                <select v-model="selectedTypeFilter" @change="loadReports" class="filter-select">
                  <option value="">All Types</option>
                  <option value="tkp-parent-guardian">TKP-parent/Guardian program agreement</option>
                  <option value="parental-consent">Parental Consent and liability release</option>
                  <option value="child-admission">Consent of Child Admission</option>
                  <option value="medical-care">Medical of care Consent</option>
                </select>
              </div>
            </div>

            <div class="search-actions">
              <button @click="performSearch" class="search-button">
                Search
              </button>
              <button @click="resetFilters" class="reset-button">
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Reports List -->
        <div class="reports-main">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading Documents...</p>
          </div>
        
        <div v-else-if="reports.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No Documents Found</h3>
          <p>{{ searchQuery || selectedTypeFilter ? 'No documents match your current filter.' : 'Upload your first report to get started.' }}</p>
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
                    {{ getReportTypeLabel(report.reportType) }} • {{ formatFileSize(report.fileSize) }}
                  </p>
                </div>
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
                <strong>Uploaded by:</strong> {{ report.uploadedBy }}
              </div>
            </div>
            
            <div class="report-actions">
              <a 
                :href="report.downloadURL" 
                target="_blank" 
                class="action-btn download-btn"
              >
                📥 Download
              </a>
              
              <button 
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

      <!-- Success/Error Messages -->
      <div v-if="message" class="message-toast" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ReportService from '../services/reportService.js'
import AuthService from '../services/auth.js'

const router = useRouter()

// Emits
const emit = defineEmits(['back-to-capture'])

// Template ref for file input
const fileInput = ref(null)

// Component state
const uploading = ref(false)
const loading = ref(false)
const reports = ref([])
const searchQuery = ref('')
const selectedTypeFilter = ref('')
const showUploadForm = ref(false)

// Forms
const uploadForm = ref({
  title: '',
  description: '',
  reportType: '',
  file: null
})

// Messages
const message = ref('')
const messageType = ref('success')

// User permissions
const currentUser = ref(null)

// Initialize component
// Check user permissions and get full name
const checkUserPermissions = async () => {
  const user = AuthService.getCurrentUser()
  if (user) {
    currentUser.value = user.email || user.uid
    
    // Try to get the user's full name from UserService
    try {
      const userDoc = await AuthService.getUserRole(user.uid)
      if (userDoc && userDoc.fullName) {
        currentUser.value = userDoc.fullName
      } else if (userDoc && userDoc.name) {
        currentUser.value = userDoc.name
      }
    } catch (error) {
      console.warn('Could not fetch user full name, using email instead:', error)
    }
  }
}

// Load reports for current user - only custom documents
const loadReports = async () => {
  // Don't load reports if currentUser is not set
  if (!currentUser.value) {
    console.warn('User not authenticated, skipping report load')
    return
  }
  
  loading.value = true
  try {
    const filters = {
      uploadedBy: currentUser.value,
      category: 'custom-document' // Only show custom documents
    }
    
    if (selectedTypeFilter.value) {
      filters.reportType = selectedTypeFilter.value
    }
    
    if (searchQuery.value) {
      filters.searchQuery = searchQuery.value
    }

    const result = await ReportService.getAllReports(filters)
    if (result.success) {
      reports.value = result.reports
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

// Search and filter methods
const performSearch = () => {
  loadReports()
}

const clearSearch = () => {
  searchQuery.value = ''
  loadReports()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedTypeFilter.value = ''
  loadReports()
}

// Cancel upload and hide form
const cancelUpload = () => {
  showUploadForm.value = false
  resetForm()
}

// Get display label for report type
const getReportTypeLabel = (type) => {
  const labels = {
    'tkp-parent-guardian': 'TKP-parent/Guardian program agreement',
    'parental-consent': 'Parental Consent and liability release',
    'child-admission': 'Consent of Child Admission',
    'medical-care': 'Medical of care Consent'
  }
  return labels[type] || type
}

// Get display label for status
const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected'
  }
  return labels[status] || status
}

// Format date for display
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

checkUserPermissions()

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

// Reset form
const resetForm = () => {
  uploadForm.value = {
    title: '',
    description: '',
    reportType: '',
    file: null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Handle report upload - set category for custom documents
const handleUploadReport = async () => {
  if (!uploadForm.value.file || !uploadForm.value.title || !uploadForm.value.reportType) {
    showMessage('Please provide a title, select a document type, and select a file', 'error')
    return
  }

  // Check for duplicates before uploading
  const isDuplicate = reports.value.some(report => 
    report.title === uploadForm.value.title && 
    report.fileName === uploadForm.value.file.name
  )

  if (isDuplicate) {
    showMessage('A report with the same title and file name already exists', 'error')
    return
  }

  uploading.value = true
  try {
    const reportData = {
      ...uploadForm.value,
      uploadedBy: currentUser.value,
      category: 'custom-document' // Set category for custom documents
    }

    const result = await ReportService.uploadReport(reportData)
    if (result.success) {
      showMessage('Report uploaded successfully!', 'success')
      resetForm()
      showUploadForm.value = false
      // Reload reports after successful upload
      await loadReports()
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
    } else {
      showMessage(result.error || 'Failed to delete report', 'error')
    }
  } catch (error) {
    console.error('Error deleting report:', error)
    showMessage('An unexpected error occurred', 'error')
  }
}

// Utility functions
const formatFileSize = (bytes) => ReportService.formatFileSize(bytes)
const getFileIcon = (fileType) => ReportService.getFileTypeIcon(fileType)

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Navigation methods
const goBack = () => {
  // Emit event to parent Capture component
  emit('back-to-capture')
}

// Load reports when component is mounted
onMounted(async () => {
  await checkUserPermissions()
  // Only load reports if user is authenticated
  if (currentUser.value) {
    await loadReports()
  }
})
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
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.reports-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.data-source-indicator {
  margin-top: 0.5rem;
}

.indicator-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: #28a745;
  color: white;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.indicator-badge.firebase {
  background: linear-gradient(45deg, #FF6B35, #F7931E);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-name {
  font-weight: 600;
  color: #4A148C;
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.back-button {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
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

.back-button:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.reports-content {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

/* Upload Button Section */
.upload-button-section {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 800px;
  margin: 0 auto 2rem auto;
  text-align: center;
}

.upload-button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.show-upload-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.show-upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

/* Upload Section */
.upload-section {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 800px;
  margin: 0 auto 2rem auto;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #4A148C;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.section-header p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

/* Upload Form */
.upload-form {
  padding: 1rem 0;
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
.form-actions {
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
  flex: 1;
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
  flex: 1;
}

.cancel-btn:hover {
  background: #5a6268;
}

/* Reports List Section */
.reports-list-section {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 2rem;
}

/* Search Panel */
.search-panel {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.search-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: end;
  margin-bottom: 1.5rem;
}

.search-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
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

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-item {
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
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.search-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.search-button,
.reset-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.search-button {
  background: #007bff;
  color: white;
}

.search-button:hover {
  background: #0056b3;
}

.reset-button {
  background: #6c757d;
  color: white;
}

.reset-button:hover {
  background: #5a6268;
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

.report-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-top: 1px solid #eee;
  padding-top: 1rem;
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

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
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
@media (max-width: 1024px) {
  .reports-content {
    padding: 1.5rem;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .reports-container {
    padding: 0;
  }

  /* Header Mobile Styles */
  .reports-header {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .header-left,
  .header-center,
  .header-right {
    flex: none;
    width: 100%;
  }

  .header-left {
    order: 1;
  }

  .header-center {
    order: 2;
  }

  .header-right {
    order: 3;
    justify-content: space-between;
  }

  .back-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .reports-title {
    font-size: 1.3rem;
  }

  .data-source-indicator {
    margin-top: 0.25rem;
  }

  .indicator-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }

  /* Content Mobile Styles */
  .reports-content {
    padding: 1rem;
  }

  .upload-button-section,
  .upload-section,
  .reports-list-section {
    padding: 1rem;
  }

  .search-controls {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filter-group {
    flex-direction: column;
  }

  .search-actions {
    width: 100%;
  }

  .search-button,
  .reset-button {
    flex: 1;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .report-card {
    padding: 1rem;
  }

  .report-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .report-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .report-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  /* Extra Small Devices */
  .reports-header {
    padding: 0.75rem;
  }

  .reports-title {
    font-size: 1.1rem;
  }

  .back-button {
    padding: 0.625rem 0.75rem;
    font-size: 0.8rem;
  }

  .back-button svg {
    width: 14px;
    height: 14px;
  }

  .header-right {
    flex-direction: column;
    gap: 0.5rem;
  }



  .reports-content {
    padding: 0.75rem;
  }

  .upload-button-section,
  .upload-section,
  .reports-list-section {
    padding: 0.75rem;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    font-size: 0.9rem;
  }

  .report-card {
    padding: 0.75rem;
  }

  .report-title {
    font-size: 1rem;
  }

  .report-meta,
  .metadata-item {
    font-size: 0.8rem;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}
</style>