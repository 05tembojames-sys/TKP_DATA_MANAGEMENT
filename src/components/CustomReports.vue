<template>
  <div class="app-container">
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <header class="header-section">
        <h1>Document Management</h1>
        <p>
          Upload, manage, and review important documents for the TKP program
        </p>
      </header>

      <!-- Upload Button Section -->
      <section v-if="!showUploadForm" class="upload-hero-section">
        <div class="upload-hero-content">
          <div class="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h2>Uploaded Documents</h2>
          <p>View and manage your uploaded documents</p>
          <button
            @click="showUploadForm = true"
            class="primary-button upload-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Upload New Document
          </button>
        </div>
      </section>

      <!-- Upload Form -->
      <section v-if="showUploadForm" class="upload-form-section">
        <div class="upload-form-header">
          <div>
            <h2>Upload New Document</h2>
            <p>Upload documents with specific types</p>
          </div>
          <button @click="cancelUpload" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleUploadReport" class="upload-form">
          <div class="form-row">
            <div class="form-group">
              <label>Document Title <span class="required">*</span></label>
              <input
                v-model="uploadForm.title"
                type="text"
                required
                placeholder="Enter document title"
              />
            </div>
            <div class="form-group">
              <label>Document Type <span class="required">*</span></label>
              <select v-model="uploadForm.reportType" required>
                <option value="">Select Document Type</option>
                <option value="tkp-parent-guardian">
                  TKP-parent/Guardian program agreement
                </option>
                <option value="parental-consent">
                  Parental Consent and liability release
                </option>
                <option value="child-admission">
                  Consent of Child Admission
                </option>
                <option value="medical-care">Medical of care Consent</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Description (Optional)</label>
            <textarea
              v-model="uploadForm.description"
              placeholder="Brief description of the document contents..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Select File <span class="required">*</span></label>
            <div class="file-upload-area" @click="fileInput.click()">
              <input
                ref="fileInput"
                type="file"
                @change="handleFileSelect"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                hidden
                required
              />
              <div v-if="!uploadForm.file" class="file-upload-placeholder">
                <div class="file-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                </div>
                <div class="file-text">Click to select a file</div>
                <div class="file-supported">
                  Supported: PDF, Word, Excel, PowerPoint, Text files
                </div>
                <div class="file-size">Maximum file size: 50MB</div>
              </div>
              <div v-else class="file-upload-preview">
                <div class="file-preview-content">
                  <span class="file-icon-large">{{
                    getFileIcon(uploadForm.file.type)
                  }}</span>
                  <div>
                    <div class="file-name">{{ uploadForm.file.name }}</div>
                    <div class="file-size-text">
                      {{ formatFileSize(uploadForm.file.size) }}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  @click.stop="clearFile"
                  class="clear-file-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              :disabled="uploading || !uploadForm.file"
              class="primary-button submit-btn"
            >
              {{ uploading ? "Uploading..." : "Upload Document" }}
            </button>
            <button
              type="button"
              @click="cancelUpload"
              class="secondary-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      <!-- Reports List Section -->
      <section class="reports-section">
        <!-- Filter Panel -->
        <div class="filter-panel">
          <h3>Filter Documents</h3>
          <div class="filter-row">
            <div class="form-group">
              <label>Search Document</label>
              <div class="search-input-wrapper">
                <svg
                  class="search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <input
                  type="text"
                  v-model="searchQuery"
                  @input="performSearch"
                  placeholder="Search by title or description..."
                />
                <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="clear-search-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>Document Type</label>
              <select v-model="selectedTypeFilter" @change="loadReports">
                <option value="">All Types</option>
                <option value="tkp-parent-guardian">
                  TKP-parent/Guardian program agreement
                </option>
                <option value="parental-consent">
                  Parental Consent and liability release
                </option>
                <option value="child-admission">
                  Consent of Child Admission
                </option>
                <option value="medical-care">Medical of care Consent</option>
              </select>
            </div>
          </div>
          <div class="filter-actions">
            <button @click="performSearch" class="primary-button small">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              Search
            </button>
            <button @click="resetFilters" class="secondary-button small">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Reset
            </button>
          </div>
        </div>

        <!-- Reports Content -->
        <div class="reports-content">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading Documents...</p>
          </div>

          <div v-else-if="reports.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <h3>No Documents Found</h3>
            <p>
              {{
                searchQuery || selectedTypeFilter || selectedStatusFilter
                  ? "No documents match your current filter."
                  : "Upload your first document to get started."
              }}
            </p>
          </div>

          <div v-else class="reports-grid">
            <article
              v-for="report in reports"
              :key="report.id"
              class="report-card"
              :data-status="report.status"
            >
              <div class="report-header">
                <div class="report-main">
                  <span class="file-icon">{{
                    getFileIcon(report.fileType)
                  }}</span>
                  <div class="report-info">
                    <h4>{{ report.title }}</h4>
                    <p>
                      {{ getReportTypeLabel(report.reportType) }} •
                      {{ formatFileSize(report.fileSize) }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="report.description" class="report-description">
                {{ report.description }}
              </div>

              <div class="report-meta">
                <div class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span
                    ><strong>Uploaded:</strong>
                    {{ formatDate(report.uploadedAt) }}</span
                  >
                </div>
                <div class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span
                    ><strong>Uploaded by:</strong> {{ report.uploadedBy }}</span
                  >
                </div>
                <div v-if="report.reviewedBy" class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span
                    ><strong>Reviewed by:</strong> {{ report.reviewedBy }}</span
                  >
                </div>
                <div v-if="report.reviewedAt" class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span
                    ><strong>Reviewed on:</strong>
                    {{ formatDate(report.reviewedAt) }}</span
                  >
                </div>
              </div>

              <div class="report-actions">
                <button
                  @click="openPreview(report)"
                  class="action-btn view-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  View
                </button>
                <a
                  :href="report.downloadURL"
                  download
                  class="action-btn download-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  Download
                </a>
                <button
                  @click="confirmDeleteReport(report)"
                  class="action-btn delete-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Delete
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Document Preview Modal -->
      <div v-if="showPreview" class="modal-overlay" @click="closePreview">
        <div class="modal-content preview-modal" @click.stop>
          <div class="modal-header">
            <h3>{{ previewReport?.title || 'Document Preview' }}</h3>
            <button @click="closePreview" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <template v-if="previewReport && previewUrl">
              <template v-if="(previewReport.fileType || '').toLowerCase().startsWith('image/')">
                <img :src="previewUrl" alt="Document" class="doc-image" />
              </template>
              <template v-else-if="isOfficeDocument(previewReport.fileType)">
                <iframe
                  :src="getOfficeViewerUrl(previewReport)"
                  class="doc-frame"
                  title="Document Preview"
                ></iframe>
              </template>
              <template v-else>
                <iframe
                  :src="previewUrl"
                  class="doc-frame"
                  title="Document Preview"
                ></iframe>
              </template>
            </template>
            <div v-else-if="previewReport && !previewUrl" style="padding: 2rem; text-align: center;">
              <p>Loading preview...</p>
            </div>
          </div>
          <div class="modal-footer">
            <a :href="previewReport?.downloadURL" download class="action-btn download-btn">Download</a>
            <button @click="closePreview" class="action-btn secondary">Close</button>
          </div>
        </div>
      </div>

      <!-- Toast Messages -->
      <div v-if="message" class="toast" :class="messageType">
        <div class="toast-content">
          <svg
            v-if="messageType === 'success'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <svg
            v-if="messageType === 'error'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{{ message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ReportService from "../services/reportService.js";
import AuthService from "../services/auth.js";

// ... (keep all the existing script setup code exactly the same - no changes needed)
const fileInput = ref(null);
const uploading = ref(false);
const loading = ref(false);
const reports = ref([]);
const searchQuery = ref("");
const selectedTypeFilter = ref("");
const selectedStatusFilter = ref("");
const showUploadForm = ref(false);
const isAdmin = ref(false);
const currentUser = ref(null);
const message = ref("");
const messageType = ref("success");

const uploadForm = ref({
  title: "",
  description: "",
  reportType: "",
  file: null,
});

// ... (all other script functions remain exactly the same)
// Preview modal state
const showPreview = ref(false);
const previewReport = ref(null);
const previewUrl = ref(null);

const openPreview = async (report) => {
  previewReport.value = report;
  showPreview.value = true;
  
  // Fetch the file as blob to create an object URL for viewing
  try {
    const url = report.fileUrl || report.downloadURL;
    console.log('Fetching file for preview:', url);
    
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the blob with proper MIME type
    let blob = await response.blob();
    
    // Ensure proper MIME type for preview
    const fileType = report.fileType || blob.type;
    if (fileType && blob.type !== fileType) {
      blob = new Blob([blob], { type: fileType });
    }
    
    console.log('Blob created with type:', blob.type);
    
    // Create an object URL from the blob
    previewUrl.value = URL.createObjectURL(blob);
    console.log('Preview URL created:', previewUrl.value);
  } catch (error) {
    console.error('Error loading file for preview:', error);
    showMessage('Failed to load document preview', 'error');
    // Close modal on error
    closePreview();
  }
};

const closePreview = () => {
  // Revoke the object URL to free memory
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }
  showPreview.value = false;
  previewReport.value = null;
  previewUrl.value = null;
};

const isOfficeDocument = (fileType) => {
  if (!fileType) return false;
  const type = fileType.toLowerCase();
  return (
    type.includes('word') ||
    type.includes('document') ||
    type.includes('excel') ||
    type.includes('spreadsheet') ||
    type.includes('powerpoint') ||
    type.includes('presentation') ||
    type.includes('.doc') ||
    type.includes('officedocument')
  );
};

const getOfficeViewerUrl = (report) => {
  // Use Microsoft Office Online Viewer
  const fileUrl = encodeURIComponent(report.fileUrl || report.downloadURL);
  return `https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`;
};

const checkUserPermissions = async () => {
  const user = AuthService.getCurrentUser();
  if (user) {
    currentUser.value = user.email || user.uid;
    try {
      const userDoc = await AuthService.getUserRole(user.uid);
      if (userDoc && userDoc.fullName) {
        currentUser.value = userDoc.fullName;
      } else if (userDoc && userDoc.name) {
        currentUser.value = userDoc.name;
      }
      isAdmin.value = userDoc && userDoc.role === "admin";
    } catch (error) {
      console.warn("Could not fetch user details:", error);
    }
  } else {
    console.warn("User not authenticated, skipping report load");
  }
};

const loadReports = async () => {
  if (!currentUser.value) {
    console.warn("User not authenticated, skipping report load");
    return;
  }

  loading.value = true;
  try {
    const filters = {
      uploadedBy: isAdmin.value ? undefined : currentUser.value,
      category: "custom-document",
    };

    if (selectedTypeFilter.value) {
      filters.reportType = selectedTypeFilter.value;
    }

    if (selectedStatusFilter.value) {
      filters.status = selectedStatusFilter.value;
    }

    if (searchQuery.value) {
      filters.searchQuery = searchQuery.value;
    }

    const result = await ReportService.getAllReports(filters);
    if (result.success) {
      reports.value = result.reports;
    } else {
      showMessage(result.error || "Failed to load reports", "error");
    }
  } catch (error) {
    console.error("Error loading reports:", error);
    showMessage("An unexpected error occurred while loading reports", "error");
  } finally {
    loading.value = false;
  }
};

const performSearch = () => {
  loadReports();
};

const clearSearch = () => {
  searchQuery.value = "";
  loadReports();
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedTypeFilter.value = "";
  selectedStatusFilter.value = "";
  loadReports();
};

const cancelUpload = () => {
  showUploadForm.value = false;
  resetForm();
};

const getReportTypeLabel = (type) => {
  const labels = {
    "tkp-parent-guardian": "TKP-parent/Guardian program agreement",
    "parental-consent": "Parental Consent and liability release",
    "child-admission": "Consent of Child Admission",
    "medical-care": "Medical of care Consent",
  };
  return labels[type] || type;
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };
  return labels[status] || status;
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 50 * 1024 * 1024) {
      showMessage("File size must be less than 50MB", "error");
      return;
    }
    uploadForm.value.file = file;
  }
};

const clearFile = () => {
  uploadForm.value.file = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const resetForm = () => {
  uploadForm.value = {
    title: "",
    description: "",
    reportType: "",
    file: null,
  };
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleUploadReport = async () => {
  if (
    !uploadForm.value.file ||
    !uploadForm.value.title ||
    !uploadForm.value.reportType
  ) {
    showMessage(
      "Please provide a title, select a document type, and select a file",
      "error"
    );
    return;
  }

  const isDuplicate = reports.value.some(
    (report) =>
      report.title === uploadForm.value.title &&
      report.fileName === uploadForm.value.file.name
  );

  if (isDuplicate) {
    showMessage(
      "A report with the same title and file name already exists",
      "error"
    );
    return;
  }

  uploading.value = true;
  try {
    const reportData = {
      ...uploadForm.value,
      uploadedBy: currentUser.value,
      category: "custom-document",
      status: "pending",
    };

    const result = await ReportService.uploadReport(reportData);
    if (result.success) {
      showMessage("Report uploaded successfully!", "success");
      resetForm();
      showUploadForm.value = false;
      await loadReports();
    } else {
      showMessage(result.error || "Failed to upload report", "error");
    }
  } catch (error) {
    console.error("Error uploading report:", error);
    showMessage("An unexpected error occurred while uploading", "error");
  } finally {
    uploading.value = false;
  }
};

const approveReport = async (report) => {
  if (!confirm(`Are you sure you want to approve "${report.title}"?`)) return;
  try {
    const result = await ReportService.updateReportStatus(
      report.id,
      "approved",
      currentUser.value
    );
    if (result.success) {
      showMessage("Report approved successfully", "success");
      await loadReports();
    } else {
      showMessage(result.error || "Failed to approve report", "error");
    }
  } catch (error) {
    console.error("Error approving report:", error);
    showMessage("An unexpected error occurred", "error");
  }
};

const rejectReport = async (report) => {
  if (!confirm(`Are you sure you want to reject "${report.title}"?`)) return;
  try {
    const result = await ReportService.updateReportStatus(
      report.id,
      "rejected",
      currentUser.value
    );
    if (result.success) {
      showMessage("Report rejected successfully", "success");
      await loadReports();
    } else {
      showMessage(result.error || "Failed to reject report", "error");
    }
  } catch (error) {
    console.error("Error rejecting report:", error);
    showMessage("An unexpected error occurred", "error");
  }
};

const confirmDeleteReport = async (report) => {
  if (
    !confirm(
      `Are you sure you want to delete "${report.title}"? This action cannot be undone.`
    )
  ) {
    return;
  }

  try {
    const result = await ReportService.deleteReport(
      report.id,
      report.appwriteFileId,
      report.appwriteBucketId
    );
    if (result.success) {
      showMessage("Report deleted successfully", "success");
      await loadReports();
    } else {
      showMessage(result.error || "Failed to delete report", "error");
    }
  } catch (error) {
    console.error("Error deleting report:", error);
    showMessage("An unexpected error occurred", "error");
  }
};

const formatFileSize = (bytes) => ReportService.formatFileSize(bytes);
const getFileIcon = (fileType) => ReportService.getFileTypeIcon(fileType);

const showMessage = (msg, type = "success") => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

onMounted(async () => {
  await checkUserPermissions();
  if (currentUser.value) {
    await loadReports();
  }
});
</script>

<style scoped>
/* Main Container */
.app-container {
  min-height: 100vh;
  background-color: #f4f6f8;
  padding: 24px;
  font-family: 'Roboto', sans-serif;
}

.main-content {
  max-width: 100%;
  margin: 0 auto;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
  text-align: left;
}

.header-section h1 {
  font-size: 24px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 8px 0;
}

.header-section p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

/* Upload Hero Section */
.upload-hero-section {
  background: white;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  padding: 40px;
  margin-bottom: 32px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.upload-hero-content {
  max-width: 500px;
  margin: 0 auto;
}

.upload-icon {
  width: 80px;
  height: 80px;
  background: #e8f3fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #147cd7;
}

.upload-icon svg {
  width: 40px;
  height: 40px;
}

.upload-hero-content h2 {
  font-size: 20px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 8px 0;
}

.upload-hero-content p {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 24px 0;
}

/* Buttons */
.primary-button {
  background: #147cd7;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.primary-button svg {
  width: 20px;
  height: 20px;
}

.primary-button:hover {
  background: #1169ba;
}

.secondary-button {
  background: white;
  color: #494949;
  border: 1px solid #d5dde5;
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: #f4f6f8;
  border-color: #147cd7;
  color: #147cd7;
}

/* Upload Form */
.upload-form-section {
  background: white;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.upload-form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f4f6f8;
}

.upload-form-header h2 {
  font-size: 18px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 4px 0;
}

.upload-form-header p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover {
  color: #212934;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #494949;
  margin-bottom: 8px;
}

.required {
  color: #d32f2f;
}

.form-group input[type="text"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  font-size: 14px;
  color: #212934;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #147cd7;
  box-shadow: 0 0 0 3px rgba(20, 124, 215, 0.1);
}

/* File Upload Area */
.file-upload-area {
  border: 2px dashed #d5dde5;
  border-radius: 4px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  background: #f8f9fa;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.file-upload-area:hover {
  border-color: #147cd7;
  background: #e8f3fa;
}

.file-icon {
  color: #147cd7;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-icon svg {
  width: 48px;
  height: 48px;
}

.file-text {
  font-size: 16px;
  font-weight: 500;
  color: #212934;
  margin-bottom: 8px;
}

.file-supported, .file-size {
  font-size: 12px;
  color: #6c757d;
}

.file-upload-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #d5dde5;
}

.file-preview-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-icon-large {
  font-size: 24px;
}

.file-name {
  font-weight: 500;
  color: #212934;
}

.file-size-text {
  font-size: 12px;
  color: #6c757d;
}

.clear-file-btn {
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  padding: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #f4f6f8;
}

/* Filter Panel */
.filter-panel {
  background: white;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
}

.filter-panel h3 {
  font-size: 16px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 16px 0;
}

.filter-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 16px;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6c757d;
}

.search-input-wrapper input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  font-size: 14px;
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  gap: 12px;
}

.primary-button.small, .secondary-button.small {
  padding: 8px 16px;
  font-size: 13px;
}

/* Reports Grid */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.report-card {
  background: white;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  padding: 20px;
  transition: all 0.2s;
}

.report-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  transform: translateY(-2px);
  border-color: #147cd7;
}

.report-header {
  margin-bottom: 16px;
}

.report-main {
  display: flex;
  gap: 12px;
}

.report-info h4 {
  font-size: 16px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 4px 0;
}

.report-info p {
  font-size: 12px;
  color: #6c757d;
  margin: 0;
}

.report-description {
  font-size: 13px;
  color: #494949;
  margin-bottom: 16px;
  line-height: 1.5;
}

.report-meta {
  border-top: 1px solid #f4f6f8;
  padding-top: 12px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
}

.meta-item svg {
  width: 14px;
  height: 14px;
}

.report-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
}

.view-btn {
  background: #e8f3fa;
  color: #147cd7;
}

.view-btn:hover {
  background: #d0e4f5;
}

.download-btn {
  background: #e8f5e9;
  color: #2e7d32;
}

.download-btn:hover {
  background: #c8e6c9;
}

.delete-btn {
  background: #ffebee;
  color: #c62828;
}

.delete-btn:hover {
  background: #ffcdd2;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 4px;
  border: 1px solid #d5dde5;
}

.empty-icon {
  color: #d5dde5;
  margin-bottom: 16px;
}

.empty-icon svg {
  width: 48px;
  height: 48px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #6c757d;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-modal {
  background: white;
  border-radius: 4px;
  width: 90vw;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #d5dde5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #212934;
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 0;
  background: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doc-frame {
  width: 100%;
  height: 70vh;
  border: none;
  background: white;
}

.doc-image {
  max-width: 100%;
  max-height: 70vh;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #d5dde5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row, .filter-row {
    grid-template-columns: 1fr;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
}
</style>

.preview-modal {
  background: #fff;
  border-radius: 12px;
  width: 90vw;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 0;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doc-frame {
  width: 100%;
  height: 70vh;
  border: none;
  background: #fff;
}

.doc-image {
  max-width: 100%;
  max-height: 70vh;
  display: block;
}

.unsupported {
  background: #fff;
  width: 100%;
  padding: 2rem;
  text-align: center;
}

.modal-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  background: #f8f9fa;
}

.action-btn.secondary {
  background: #e9ecef;
  color: #2c3e50;
  border-color: #d1d5da;
}

* {
}

:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-gradient-hover: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  --success-gradient: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  --danger-gradient: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  --warning-gradient: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --border-radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 2rem;
  position: relative;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 4rem;
}

.header-section h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  letter-spacing: -0.025em;
}

.header-section p {
  font-size: 1.25rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Upload Hero Section */
.upload-hero-section {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 4rem 2rem;
  margin-bottom: 4rem;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.upload-hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
}

.upload-hero-section:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.upload-hero-content {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.upload-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
}

.upload-icon svg {
  width: 24px;
  height: 24px;
  color: #319795;
}

.upload-hero-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.upload-hero-content p {
  color: #718096;
  font-size: 1.125rem;
  margin: 0 0 2.5rem 0;
}

/* Upload Form */
.upload-form-section {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 3rem;
  margin-bottom: 3rem;
  border: 1px solid #e2e8f0;
  position: relative;
}

.upload-form-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
}

.upload-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.upload-form-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.upload-form-header p {
  color: #718096;
  margin: 0.25rem 0 0 0;
}

.close-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  cursor: pointer;
  transition: var(--transition);
}

.close-btn:hover {
  background: #f7fafc;
  color: #718096;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* Form Styles */
.upload-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #e53e3e;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  transition: var(--transition);
  font-family: inherit;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a0aec0;
}

/* File Upload */
.file-upload-area {
  border: 3px dashed #cbd5e0;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  background: #f7fafc;
  position: relative;
  overflow: hidden;
}

.file-upload-area:hover {
  border-color: #4299e1;
  background: #ebf8ff;
}

.file-upload-area::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.file-upload-area:hover::before {
  transform: scaleX(1);
}

.file-upload-placeholder {
  pointer-events: none;
}

.file-icon {
  width: 64px;
  height: 64px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.file-icon svg {
  width: 28px;
  height: 28px;
  color: #718096;
}

.file-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.75rem;
}

.file-supported {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.file-size {
  color: #a0aec0;
  font-size: 0.75rem;
}

.file-upload-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.file-preview-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon-large {
  font-size: 1.25rem;
}

.file-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.file-size-text {
  color: #718096;
  font-size: 0.8rem;
}

.clear-file-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #e53e3e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.clear-file-btn:hover {
  background: #fed7d7;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.primary-button {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
  min-height: 52px;
  position: relative;
  overflow: hidden;
}

.primary-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.primary-button:hover:not(:disabled)::before {
  left: 100%;
}

.primary-button:hover:not(:disabled) {
  background: var(--primary-gradient-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.primary-button:disabled {
  opacity: 0.6;
