<template>
  <div class="tkp-documents-container">
    <!-- Header -->
    <!-- Top Header -->
    <TopHeader />

    <!-- App Sub-Header -->
    <div class="capture-sub-header">
      <div class="header-left">
        <h1 class="capture-title">TKP Documents</h1>
      </div>
      <div class="header-right">
        <button
          @click="showInitialReferral"
          class="header-action-btn"
          :class="{ active: activeTab === 'referral' }"
        >
          <i class="fas fa-plus-circle"></i>
          New Referral
        </button>
        
        <button
          @click="showCustomReportsTab"
          class="header-action-btn"
          :class="{ active: activeTab === 'reports' }"
        >
          <i class="fas fa-file-alt"></i>
          Documents For TKP
        </button>

        <button
          @click="activeTab = 'management'"
          class="header-action-btn"
          :class="{ active: activeTab === 'management' }"
        >
          <i class="fas fa-folder-open"></i>
          Document Management
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="capture-content">
      <!-- Selection Panel -->
      <div class="selection-panel" v-if="activeTab === 'data-entry'">
        <div class="selection-grid">
          <!-- Data Set Selection -->
          <div class="selection-item">
            <label class="selection-label">Data Set</label>
            <select
              v-model="selectedDataSet"
              @change="onDataSetChange"
              class="selection-dropdown"
            >
              <option value="">Select Data Set</option>
              <option
                v-for="dataSet in dataSets"
                :key="dataSet.id"
                :value="dataSet.id"
              >
                {{ dataSet.name }}
              </option>
            </select>
          </div>

          <!-- Organisation Unit Selection -->
          <div class="selection-item">
            <label class="selection-label">Organisation Unit</label>
            <select
              v-model="selectedOrgUnit"
              @change="onOrgUnitChange"
              class="selection-dropdown"
            >
              <option value="">Select Organisation Unit</option>
              <option
                v-for="orgUnit in orgUnits"
                :key="orgUnit.id"
                :value="orgUnit.id"
              >
                {{ orgUnit.name }}
              </option>
            </select>
          </div>

          <!-- Period Selection -->
          <div class="selection-item">
            <label class="selection-label">Period</label>
            <select
              v-model="selectedPeriod"
              @change="onPeriodChange"
              class="selection-dropdown"
            >
              <option value="">Select Period</option>
              <option
                v-for="period in periods"
                :key="period.id"
                :value="period.id"
              >
                {{ period.name }}
              </option>
            </select>
          </div>

          <!-- Form Selection (from saved forms) -->
          <div class="selection-item" v-if="forms.length > 0">
            <label class="selection-label">
              📋 Load Existing Form
              <span class="form-count">({{ forms.length }} available)</span>
            </label>
            <select v-model="selectedFormId" class="selection-dropdown">
              <option value="">-- New Form --</option>
              <option v-for="form in forms" :key="form.id" :value="form.id">
                {{ formatFormOption(form) }}
              </option>
            </select>
            <p class="selection-hint">Select an existing form to edit, or choose "New Form" to start fresh</p>
          </div>

          <!-- Load Data Button -->
          <div class="selection-item">
            <button
              @click="loadDataEntry"
              :disabled="!canLoadData"
              class="load-button"
            >
              Load
            </button>
          </div>
        </div>

        <!-- Status Bar -->
        <div
          class="status-bar"
          v-if="selectedDataSet && selectedOrgUnit && selectedPeriod"
        >
          <div class="status-info">
            <span class="status-label">Selected:</span>
            <span class="status-value"
              >{{ getSelectedDataSetName() }} - {{ getSelectedOrgUnitName() }} -
              {{ getSelectedPeriodName() }}</span
            >
          </div>
          <div class="status-completion" v-if="completionStatus">
            <span class="completion-label">Completion:</span>
            <span class="completion-percentage" :class="getCompletionClass()"
              >{{ completionStatus }}%</span
            >
          </div>
        </div>
      </div>

      <!-- Data Entry Section -->
      <div
        class="data-entry-section"
        v-if="activeTab === 'referral' && showDataEntry"
      >
        <!-- Initial Referral Form -->
        <div v-if="selectedDataSet === 'initial-referral'">
          <InitialReferralForm
            ref="referralForm"
            @form-saved="handleReferralFormSaved"
          />
        </div>

        <!-- Medical Intake Form -->
        <div v-else-if="selectedDataSet === 'medical-intake'">
          <MedicalIntakeForm
            @form-saved="handleReferralFormSaved"
          />
        </div>

        <!-- Child Overview Form -->
        <div v-else-if="selectedDataSet === 'child-overview'">
          <ChildOverviewForm
            @form-saved="handleReferralFormSaved"
          />
        </div>

        <!-- Initial Assessment Form -->
        <div v-else-if="selectedDataSet === 'initial-assessment'">
          <InitialAssessmentForm
            @form-saved="handleReferralFormSaved"
          />
        </div>

        <!-- Standard Data Entry Form -->
        <div v-else>
          <div class="data-entry-header">
            <h2>{{ getSelectedDataSetName() }} - Data Entry</h2>
            <div class="entry-actions">
              <button @click="validateData" class="validate-button">
                Validate
              </button>
              <button @click="clearData" class="clear-button">Clear</button>
            </div>
          </div>

          <!-- Data Entry Form -->
          <div class="data-entry-form">
            <div class="form-sections">
              <div
                v-for="section in formSections"
                :key="section.id"
                class="form-section"
              >
                <h3 class="section-title">{{ section.name }}</h3>

                <div class="data-elements-grid">
                  <div
                    v-for="element in section.dataElements"
                    :key="element.id"
                    class="data-element"
                  >
                    <label class="element-label">{{ element.name }}</label>

                    <!-- Number Input -->
                    <input
                      v-if="element.valueType === 'NUMBER'"
                      type="number"
                      v-model="dataValues[element.id]"
                      @input="
                        onDataValueChange(element.id, $event.target.value)
                      "
                      class="element-input"
                      :placeholder="element.placeholder || '0'"
                      :min="element.min"
                      :max="element.max"
                    />

                    <!-- Text Input -->
                    <input
                      v-else-if="element.valueType === 'TEXT'"
                      type="text"
                      v-model="dataValues[element.id]"
                      @input="
                        onDataValueChange(element.id, $event.target.value)
                      "
                      class="element-input"
                      :placeholder="element.placeholder || 'Enter text'"
                    />

                    <!-- Date Input -->
                    <input
                      v-else-if="element.valueType === 'DATE'"
                      type="date"
                      v-model="dataValues[element.id]"
                      @change="
                        onDataValueChange(element.id, $event.target.value)
                      "
                      class="element-input"
                    />

                    <!-- Select/Dropdown -->
                    <select
                      v-else-if="element.valueType === 'SELECT'"
                      v-model="dataValues[element.id]"
                      @change="
                        onDataValueChange(element.id, $event.target.value)
                      "
                      class="element-input"
                    >
                      <option value="">Select {{ element.name }}</option>
                      <option
                        v-for="option in element.options"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>

                    <!-- Boolean/Checkbox -->
                    <div
                      v-else-if="element.valueType === 'BOOLEAN'"
                      class="checkbox-container"
                    >
                      <input
                        type="checkbox"
                        v-model="dataValues[element.id]"
                        @change="
                          onDataValueChange(element.id, $event.target.checked)
                        "
                        class="element-checkbox"
                        :id="element.id"
                      />
                      <label :for="element.id" class="checkbox-label"
                        >Yes</label
                      >
                    </div>

                    <!-- Validation Error -->
                    <div
                      v-if="validationErrors[element.id]"
                      class="validation-error"
                    >
                      {{ validationErrors[element.id] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Entry Footer -->
          <div class="data-entry-footer">
            <div class="footer-left">
              <span class="last-updated" v-if="lastSaved">
                Last saved: {{ formatDate(lastSaved) }}
              </span>
              <span
                class="save-status"
                v-if="saveStatusMessage"
                :class="saveStatusClass"
              >
                {{ saveStatusMessage }}
              </span>
            </div>
            <div class="footer-right">
              <button
                @click="saveAsDraft"
                class="draft-button"
                :disabled="isSaving"
              >
                {{ isSaving ? "Saving..." : "Save as Draft" }}
              </button>
              <button
                @click="completeEntry"
                class="complete-button"
                :disabled="!isValid || isSaving"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div
        v-if="activeTab === 'referral' && !showDataEntry"
        class="no-data-message"
      >
        <div class="no-data-content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
          <h3>No Data Entry Form Available</h3>
          <p>
            Click "Load" to load the data entry form for the selected criteria.
          </p>
        </div>
      </div>

      <!-- Custom Reports Component -->
      <div v-if="activeTab === 'reports'" class="custom-reports-section">
        <CustomReports
          :can-approve="true"
          @back-to-dashboard="showCustomReports = false"
        />
      </div>

      <!-- Document Management Section -->
      <div v-if="activeTab === 'management'" class="document-management-section">
        <div class="dm-header">
          <div class="dm-title">
            <h2>Document Management</h2>
            <p>Manage and track all system documents and uploads</p>
          </div>
          <button class="upload-btn">
            <i class="fas fa-cloud-upload-alt"></i> Upload Document
          </button>
        </div>

        <div class="dm-filters">
          <div class="search-wrapper">
            <i class="fas fa-search"></i>
            <input type="text" v-model="documentSearchQuery" placeholder="Search documents..." />
          </div>
          <select v-model="documentTypeFilter" class="dm-select">
            <option>All Types</option>
            <option value="tkp-parent-guardian">TKP Parent/Guardian</option>
            <option value="parental-consent">Parental Consent</option>
            <option value="child-admission">Child Admission</option>
            <option value="medical-care">Medical Care</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
          </select>
          <select v-model="documentStatusFilter" class="dm-select">
            <option>All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div class="dm-table-wrapper">
          <table class="dm-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredDocuments.length === 0">
                <td colspan="6" class="empty-table-message" style="text-align: center; padding: 2rem; color: #6c757d;">
                  No documents found matching your criteria.
                </td>
              </tr>
              <tr v-for="doc in filteredDocuments" :key="doc.id">
                <td>
                  <div class="doc-name">
                    <i :class="getFileIcon(doc.fileType)"></i>
                    <span>{{ doc.title }}</span>
                  </div>
                </td>
                <td>{{ doc.reportType }}</td>
                <td>{{ formatDocDate(doc.uploadedAt) }}</td>
                <td>{{ doc.uploadedBy }}</td>
                <td><span class="status-badge" :class="doc.status">{{ doc.status }}</span></td>
                <td>
                  <div class="action-buttons">
                    <a :href="doc.fileUrl" target="_blank" class="icon-btn" title="View"><i class="fas fa-eye"></i></a>
                    <a :href="doc.downloadURL" download class="icon-btn" title="Download"><i class="fas fa-download"></i></a>
                    <!-- Delete functionality would go here -->
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="dm-pagination">
          <span>Showing 1-3 of 3 documents</span>
          <div class="pagination-controls">
            <button disabled>Previous</button>
            <button class="active">1</button>
            <button disabled>Next</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import CaptureService from "../services/captureService.js";
import FormService from "../services/formService.js";
import AuthService from "../services/auth.js";
import TrackerService from "../services/trackerService.js";
import InitialReferralForm from "./InitialReferralForm.vue";
import MedicalIntakeForm from "./MedicalIntakeForm.vue";
import ChildOverviewForm from "./ChildOverviewForm.vue";
import InitialAssessmentForm from "./InitialAssessmentForm.vue";
import CustomReports from "./CustomReports.vue";
import ReportService from "../services/reportService.js";

const router = useRouter();
const route = useRoute();

// Ref for accessing the InitialReferralForm component
const referralForm = ref(null);

// Reactive data
const selectedDataSet = ref("");
const selectedOrgUnit = ref("");
const selectedPeriod = ref("");
const showDataEntry = ref(false);
const showCustomReports = ref(false);
const loading = ref(false);
const loadingMessage = ref("");
const hasUnsavedChanges = ref(false);
const lastSaved = ref(null);
const completionStatus = ref(0);
const isValid = ref(false);
const isSaving = ref(false);
const saveStatusMessage = ref("");
const saveStatusClass = ref("");
const activeTab = ref("data-entry"); // 'data-entry', 'referral', or 'reports'

// Data arrays
const dataSets = ref([]);
const orgUnits = ref([]);
const periods = ref([]);
const formSections = ref([]);
const dataValues = ref({});
const validationErrors = ref({});
const forms = ref([]);
const selectedFormId = ref("");
const documents = ref([]);
const documentSearchQuery = ref("");
const documentTypeFilter = ref("All Types");
const documentStatusFilter = ref("All Statuses");

const fetchDocuments = async () => {
  loading.value = true;
  try {
    const result = await ReportService.getAllReports();
    if (result.success) {
      documents.value = result.reports;
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
  } finally {
    loading.value = false;
  }
};

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(documentSearchQuery.value.toLowerCase());
    // Map filter values to report types if needed, or use exact match
    // Assuming reportType in doc matches values in dropdown or we need to adjust
    const matchesType = documentTypeFilter.value === "All Types" || doc.reportType === documentTypeFilter.value;
    const matchesStatus = documentStatusFilter.value === "All Statuses" || doc.status === documentStatusFilter.value;
    return matchesSearch && matchesType && matchesStatus;
  });
});

watch(activeTab, (newTab) => {
  if (newTab === 'management') {
    fetchDocuments();
  }
});

// Computed properties
const selectedDataSetName = computed(() => {
  const dataSet = dataSets.value.find((ds) => ds.id === selectedDataSet.value);
  return dataSet ? dataSet.name : "";
});

const canLoadData = computed(() => {
  return selectedDataSet.value && selectedOrgUnit.value && selectedPeriod.value;
});

// Helper functions
const getFileIcon = (fileType) => {
  if (!fileType) return 'fas fa-file';
  if (fileType.includes('pdf')) return 'fas fa-file-pdf pdf-icon';
  if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word word-icon';
  if (fileType.includes('image')) return 'fas fa-file-image image-icon';
  if (fileType.includes('excel') || fileType.includes('sheet')) return 'fas fa-file-excel excel-icon';
  return 'fas fa-file';
};

const formatDocDate = (date) => {
  if (!date) return '';
  // Handle Firestore timestamp or Date object
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Methods
const goBack = () => {
  // Check if we should return to TrackerCapture
  const shouldReturnToTracker =
    route.query.returnTo === "tracker-capture" ||
    (sessionStorage.getItem("selectedChildForForm") &&
      JSON.parse(sessionStorage.getItem("selectedChildForForm") || "{}")
        .returnTo === "tracker-capture");

  if (hasUnsavedChanges.value) {
    if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
      if (shouldReturnToTracker) {
        router.push("/tracker-capture");
      } else {
        router.push("/dashboard");
      }
    }
  } else {
    if (shouldReturnToTracker) {
      router.push("/tracker-capture");
    } else {
      router.push("/dashboard");
    }
  }
};

const handleLogout = async () => {
  if (hasUnsavedChanges.value) {
    if (
      !confirm("You have unsaved changes. Are you sure you want to logout?")
    ) {
      return;
    }
  }
  const result = await AuthService.logout();
  if (result.success) {
    router.push("/login");
  }
};

const onDataSetChange = async () => {
  showDataEntry.value = false;
  clearDataValues();
  selectedFormId.value = "";
  await loadFormsForSelectedDataSet();
};

const onOrgUnitChange = () => {
  showDataEntry.value = false;
  clearDataValues();
};

const onPeriodChange = () => {
  showDataEntry.value = false;
  clearDataValues();
};

const loadDataEntry = async () => {
  console.log('🚀 loadDataEntry() called');
  console.log('   selectedDataSet:', selectedDataSet.value);
  console.log('   selectedFormId:', selectedFormId.value);
  console.log('   selectedOrgUnit:', selectedOrgUnit.value);
  console.log('   selectedPeriod:', selectedPeriod.value);
  
  loading.value = true;
  loadingMessage.value = "Loading data entry form...";

  try {
    // Special handling for Initial Referral Form
    if (selectedDataSet.value === "initial-referral") {
      console.log('📄 Loading Initial Referral Form (special handling)');
      // For Initial Referral Form, we directly show the form component
      showDataEntry.value = true;
      activeTab.value = "referral";
      // Pre-populate with case data if available
      if (route.query.caseId) {
        const caseResult = await TrackerService.getCaseDetails(
          route.query.caseId
        );
        if (caseResult.success && referralForm.value) {
          // Pass case data to the referral form if needed
          // This would require exposing a method in InitialReferralForm to accept pre-populated data
        }
      }
    } else {
      console.log('📝 Loading standard data entry form');
      // Standard handling for other form types
      const formData = await CaptureService.loadDataEntryForm({
        dataSetId: selectedDataSet.value,
        orgUnitId: selectedOrgUnit.value,
        periodId: selectedPeriod.value,
      });

      formSections.value = formData.sections;
      console.log('📐 Form structure loaded:', formSections.value.length, 'sections');
      
      // Log all form field IDs for debugging
      const allFieldIds = formSections.value.flatMap(s => s.dataElements.map(e => e.id));
      console.log('🔑 Form field IDs:', allFieldIds);

      // If a specific saved form is selected, load its values from Forms collection
      if (selectedFormId.value) {
        console.log('📋 Loading form with ID:', selectedFormId.value);
        const result = await FormService.getFormById(selectedFormId.value);
        if (result.success) {
          console.log('✅ Form loaded successfully:', result.form);
          
          // Exclude metadata fields not part of data elements
          const { id, formType, createdAt, updatedAt, status, firestoreId, formDataId, ...formData } =
            result.form;
          
          console.log('📝 Form data to populate:', formData);
          console.log('📊 Number of fields:', Object.keys(formData).length);
          console.log('🔑 Data keys:', Object.keys(formData));
          
          // Check which fields match
          const matchingFields = allFieldIds.filter(id => formData.hasOwnProperty(id));
          const missingFields = allFieldIds.filter(id => !formData.hasOwnProperty(id));
          console.log('✅ Matching fields:', matchingFields.length, '/', allFieldIds.length);
          console.log('⚠️ Missing fields:', missingFields);
          
          dataValues.value = formData || {};
          
          // Store the form ID for updates
          dataValues.value.formId = id;
          
          // Show success message
          saveStatusMessage.value = `Form data loaded successfully (${Object.keys(formData).length} fields)`;
          saveStatusClass.value = "success";
          setTimeout(() => {
            saveStatusMessage.value = "";
            saveStatusClass.value = "";
          }, 2000);
        } else {
          console.error('❌ Failed to load form:', result.error);
          dataValues.value = formData.dataValues || {};
          saveStatusMessage.value = "Using default form data";
          saveStatusClass.value = "info";
          setTimeout(() => {
            saveStatusMessage.value = "";
            saveStatusClass.value = "";
          }, 2000);
        }
      } else {
        // Load default/empty form data
        console.log('📄 Loading new form with default data');
        dataValues.value = formData.dataValues || {};
      }

      updateCompletionStatus();
      completionStatus.value =
        formData.completionStatus || completionStatus.value;
      showDataEntry.value = true;
      activeTab.value = "referral";
      hasUnsavedChanges.value = false;
    }
  } catch (error) {
    console.error("❌❌❌ ERROR in loadDataEntry:", error);
    console.error("Error details:", error.message, error.stack);
    alert("Failed to load data entry form: " + error.message);
  } finally {
    console.log('🏁 loadDataEntry() complete');
    loading.value = false;
  }
};

// Handle route query parameters
const handleRouteQuery = async () => {
  // Handle preset parameter
  if (route.query.preset) {
    selectedDataSet.value = route.query.preset;
    // Set default org unit and period for preset forms
    selectedOrgUnit.value = "kukhoma-main";
    selectedPeriod.value = "202510"; // Default to current period

    // Auto-load the form if all required parameters are present
    if (
      selectedDataSet.value &&
      selectedOrgUnit.value &&
      selectedPeriod.value
    ) {
      await loadDataEntry();

      // Pre-populate form data if caseId is provided
      if (route.query.caseId) {
        const caseResult = await TrackerService.getCaseDetails(
          route.query.caseId
        );
        if (caseResult.success) {
          const caseData = caseResult.details;

          // Pre-populate child information
          if (caseData.childFirstName) {
            dataValues.value.childFirstName = caseData.childFirstName;
          }
          if (caseData.childLastName) {
            dataValues.value.childLastName = caseData.childLastName;
          }
          if (caseData.childSurname) {
            dataValues.value.childSurname = caseData.childSurname;
          }
          if (caseData.dateOfBirth) {
            dataValues.value.dateOfBirth = formatDateForInput(
              caseData.dateOfBirth
            );
          }
          if (caseData.gender) {
            dataValues.value.gender = caseData.gender;
          }
          if (caseData.age) {
            dataValues.value.age = caseData.age;
          }

          // Set default dates based on form type
          const today = new Date().toISOString().split("T")[0];
          if (
            selectedDataSet.value === "initial-referral" &&
            !dataValues.value.dateOfReferral
          ) {
            dataValues.value.dateOfReferral = today;
          }

          if (
            selectedDataSet.value === "initial-assessment" &&
            !dataValues.value.assessmentDate
          ) {
            dataValues.value.assessmentDate = today;
          }

          if (
            selectedDataSet.value === "child-overview" &&
            !dataValues.value.dateOfAdmission
          ) {
            dataValues.value.dateOfAdmission = today;
          }
        }
      }
    }
  }

  // Handle view parameter
  if (route.query.view) {
    // Load specific form for viewing
    const result = await FormService.getFormById(route.query.view);
    if (result.success) {
      selectedDataSet.value = result.form.formType;
      selectedOrgUnit.value = "kukhoma-main";
      selectedPeriod.value = "202510";

      if (
        selectedDataSet.value &&
        selectedOrgUnit.value &&
        selectedPeriod.value
      ) {
        await loadDataEntry();
        // Load the form data for viewing
        const { id, formType, createdAt, updatedAt, status, ...rest } =
          result.form;
        dataValues.value = rest || {};
        // Store the form ID for updates
        dataValues.value.formId = id;
      }
    }
  }

  // Handle edit parameter (similar to view but for editing)
  if (route.query.edit) {
    // Load specific form for editing
    const result = await FormService.getFormById(route.query.edit);
    if (result.success) {
      selectedDataSet.value = result.form.formType;
      selectedOrgUnit.value = "kukhoma-main";
      selectedPeriod.value = "202510";

      if (
        selectedDataSet.value &&
        selectedOrgUnit.value &&
        selectedPeriod.value
      ) {
        await loadDataEntry();
        // Load the form data for editing
        const { id, formType, createdAt, updatedAt, status, ...rest } =
          result.form;
        dataValues.value = rest || {};
        // Store the form ID for updates
        dataValues.value.formId = id;
      }
    }
  }
};

// Handle when the Initial Referral Form is saved
const handleReferralFormSaved = (data) => {
  // Show success message
  alert("Initial Referral Form saved successfully!");

  // Reset the form selection
  showDataEntry.value = false;
  selectedDataSet.value = "";
  selectedOrgUnit.value = "";
  selectedPeriod.value = "";
  activeTab.value = "data-entry";

  // Check if we should return to TrackerCapture
  const shouldReturnToTracker =
    route.query.returnTo === "tracker-capture" ||
    (sessionStorage.getItem("selectedChildForForm") &&
      JSON.parse(sessionStorage.getItem("selectedChildForForm") || "{}")
        .returnTo === "tracker-capture");

  // Go back to dashboard or tracker capture
  if (shouldReturnToTracker) {
    router.push("/tracker-capture");
  } else {
    router.push("/dashboard");
  }
};

// Show Initial Referral Form
const showInitialReferral = () => {
  selectedDataSet.value = "initial-referral";
  selectedOrgUnit.value = "kukhoma-main";
  selectedPeriod.value = "202510"; // Default to current period
  showDataEntry.value = true;
  activeTab.value = "referral";
};

// Show Custom Reports tab
const showCustomReportsTab = () => {
  activeTab.value = "reports";
};

// Helper function to format date for input fields
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

const onDataValueChange = (elementId, value) => {
  dataValues.value[elementId] = value;
  hasUnsavedChanges.value = true;

  // Clear validation error for this element
  if (validationErrors.value[elementId]) {
    delete validationErrors.value[elementId];
  }

  updateCompletionStatus();
};

const updateCompletionStatus = () => {
  const allElementIds = formSections.value.flatMap((section) =>
    section.dataElements.map((de) => de.id)
  );
  const totalElements = allElementIds.length;
  const filledElements = allElementIds.filter((id) => {
    const v = dataValues.value[id];
    return v !== "" && v !== null && v !== undefined;
  }).length;
  completionStatus.value =
    totalElements > 0 ? Math.round((filledElements / totalElements) * 100) : 0;
};

const validateData = () => {
  validationErrors.value = {};
  let valid = true;

  formSections.value.forEach((section) => {
    section.dataElements.forEach((element) => {
      const value = dataValues.value[element.id];

      // Required field validation
      if (element.required && (!value || value === "")) {
        validationErrors.value[element.id] = "This field is required";
        valid = false;
      }

      // Number validation
      if (element.valueType === "NUMBER" && value && isNaN(value)) {
        validationErrors.value[element.id] = "Please enter a valid number";
        valid = false;
      }

      // Range validation
      if (element.valueType === "NUMBER" && value) {
        if (element.min !== undefined && value < element.min) {
          validationErrors.value[
            element.id
          ] = `Value must be at least ${element.min}`;
          valid = false;
        }
        if (element.max !== undefined && value > element.max) {
          validationErrors.value[
            element.id
          ] = `Value must be at most ${element.max}`;
          valid = false;
        }
      }
    });
  });

  isValid.value = valid;

  if (valid) {
    alert("Data validation passed!");
  } else {
    alert("Please fix the validation errors before proceeding");
  }
};

const saveData = async () => {
  // Special handling for Initial Referral Form
  if (selectedDataSet.value === "initial-referral" && referralForm.value) {
    // Trigger the save method of the InitialReferralForm component
    // This would require exposing a save method in InitialReferralForm
    alert("Please use the Save button in the Initial Referral Form");
    return;
  }

  loading.value = true;
  loadingMessage.value = "Saving data...";

  try {
    // Include caseId in the data if present in route
    const saveData = { ...dataValues.value };

    // Only include caseId if it exists
    if (route.query.caseId) {
      saveData.caseId = route.query.caseId;
    }

    await CaptureService.saveDataValues({
      dataSetId: selectedDataSet.value,
      orgUnitId: selectedOrgUnit.value,
      periodId: selectedPeriod.value,
      dataValues: saveData,
    });

    hasUnsavedChanges.value = false;
    lastSaved.value = new Date();
    saveStatusMessage.value = "Data saved successfully!";
    saveStatusClass.value = "success";

    // Clear status message after 3 seconds
    setTimeout(() => {
      saveStatusMessage.value = "";
      saveStatusClass.value = "";
    }, 3000);
  } catch (error) {
    console.error("Error saving data:", error);
    saveStatusMessage.value = "Failed to save data";
    saveStatusClass.value = "error";

    // Clear error message after 5 seconds
    setTimeout(() => {
      saveStatusMessage.value = "";
      saveStatusClass.value = "";
    }, 5000);
  } finally {
    loading.value = false;
  }
};

const saveAsDraft = async () => {
  // Special handling for Initial Referral Form
  if (selectedDataSet.value === "initial-referral" && referralForm.value) {
    // Trigger the save draft method of the InitialReferralForm component
    // This would require exposing a save draft method in InitialReferralForm
    alert("Please use the Save as Draft button in the Initial Referral Form");
    return;
  }

  isSaving.value = true;
  saveStatusMessage.value = "Saving draft...";
  saveStatusClass.value = "saving";

  try {
    // Include caseId in the data if present in route
    const saveData = { ...dataValues.value };

    // Only include caseId if it exists
    if (route.query.caseId) {
      saveData.caseId = route.query.caseId;
    }

    const result = await CaptureService.saveAsDraft({
      dataSetId: selectedDataSet.value,
      orgUnitId: selectedOrgUnit.value,
      periodId: selectedPeriod.value,
      dataValues: saveData,
    });

    if (result.success) {
      hasUnsavedChanges.value = false;
      lastSaved.value = new Date();
      saveStatusMessage.value = "Draft saved successfully!";
      saveStatusClass.value = "success";

      // Auto-refresh the form list to show the new draft
      await loadFormsForSelectedDataSet();

      // Clear status message after 3 seconds
      setTimeout(() => {
        saveStatusMessage.value = "";
        saveStatusClass.value = "";
      }, 3000);
    } else {
      saveStatusMessage.value = "Failed to save draft: " + result.error;
      saveStatusClass.value = "error";

      // Clear error message after 5 seconds
      setTimeout(() => {
        saveStatusMessage.value = "";
        saveStatusClass.value = "";
      }, 5000);
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    saveStatusMessage.value = "Failed to save draft";
    saveStatusClass.value = "error";

    // Clear error message after 5 seconds
    setTimeout(() => {
      saveStatusMessage.value = "";
      saveStatusClass.value = "";
    }, 5000);
  } finally {
    isSaving.value = false;
  }
};

const completeEntry = async () => {
  // Special handling for Initial Referral Form
  if (selectedDataSet.value === "initial-referral" && referralForm.value) {
    // Trigger the complete method of the InitialReferralForm component
    // This would require exposing a complete method in InitialReferralForm
    alert("Please use the Complete button in the Initial Referral Form");
    return;
  }

  validateData();

  if (!isValid.value) {
    return;
  }

  loading.value = true;
  loadingMessage.value = "Completing data entry...";

  try {
    // Include caseId in the data if present in route
    const saveData = { ...dataValues.value };

    // Only include caseId if it exists
    if (route.query.caseId) {
      saveData.caseId = route.query.caseId;
    }

    await CaptureService.completeDataEntry({
      dataSetId: selectedDataSet.value,
      orgUnitId: selectedOrgUnit.value,
      periodId: selectedPeriod.value,
      dataValues: saveData,
    });

    hasUnsavedChanges.value = false;
    lastSaved.value = new Date();
    completionStatus.value = 100;
    saveStatusMessage.value = "Data entry completed successfully!";
    saveStatusClass.value = "success";

    // Clear status message after 3 seconds
    setTimeout(() => {
      saveStatusMessage.value = "";
      saveStatusClass.value = "";
    }, 3000);

    // If this was opened from TrackerCapture, go back to the case details
    if (route.query.caseId) {
      router.push(`/tracker-capture`);
    } else {
      router.push("/dashboard");
    }
  } catch (error) {
    console.error("Error completing data entry:", error);
    saveStatusMessage.value = "Failed to complete data entry";
    saveStatusClass.value = "error";

    // Clear error message after 5 seconds
    setTimeout(() => {
      saveStatusMessage.value = "";
      saveStatusClass.value = "";
    }, 5000);
  } finally {
    loading.value = false;
  }
};

const clearData = () => {
  // Special handling for Initial Referral Form
  if (selectedDataSet.value === "initial-referral" && referralForm.value) {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      // Reset the InitialReferralForm component
      // This would require exposing a reset method in InitialReferralForm
      alert("Form cleared");
    }
    return;
  }

  if (
    confirm(
      "Are you sure you want to clear all data? This action cannot be undone."
    )
  ) {
    clearDataValues();
    hasUnsavedChanges.value = false;
    completionStatus.value = 0;
  }
};

const clearDataValues = () => {
  dataValues.value = {};
  validationErrors.value = {};
  updateCompletionStatus();
};

const getSelectedDataSetName = () => {
  const dataSet = dataSets.value.find((ds) => ds.id === selectedDataSet.value);
  return dataSet ? dataSet.name : "";
};

const getSelectedOrgUnitName = () => {
  const orgUnit = orgUnits.value.find((ou) => ou.id === selectedOrgUnit.value);
  return orgUnit ? orgUnit.name : "";
};

const getSelectedPeriodName = () => {
  const period = periods.value.find((p) => p.id === selectedPeriod.value);
  return period ? period.name : "";
};

const getCompletionClass = () => {
  if (completionStatus.value === 100) return "completion-complete";
  if (completionStatus.value >= 50) return "completion-partial";
  return "completion-low";
};

const formatDate = (date) => {
  return date.toLocaleString();
};

const formatFormOption = (form) => {
  const d = form.createdAt?.toDate
    ? form.createdAt.toDate()
    : form.createdAt
    ? new Date(form.createdAt)
    : null;
  const dateStr = d ? d.toLocaleDateString() : "Unknown date";
  const name =
    form.childFirstName || form.childSurname || form.childLastName || "Unnamed";
  return `${name} • ${dateStr}`;
};

// Initialize component
onMounted(async () => {
  loading.value = true;
  loadingMessage.value = "Loading capture interface...";

  try {
    const [dataSetsData, orgUnitsData, periodsData] = await Promise.all([
      CaptureService.getDataSets(),
      CaptureService.getOrgUnits(),
      CaptureService.getPeriods(),
    ]);

    dataSets.value = dataSetsData;
    orgUnits.value = orgUnitsData;
    periods.value = periodsData;

    // Handle route query parameters
    await handleRouteQuery();

    if (selectedDataSet.value) {
      await loadFormsForSelectedDataSet();
    }
  } catch (error) {
    console.error("Error initializing capture interface:", error);
    alert("Failed to load capture interface");
  } finally {
    loading.value = false;
  }
});

// Load forms for the selected dataset from Forms collection
const loadFormsForSelectedDataSet = async () => {
  if (!selectedDataSet.value) {
    forms.value = [];
    return;
  }
  try {
    const result = await FormService.getForms(selectedDataSet.value, 50);
    forms.value = result.success ? result.forms : [];
  } catch (e) {
    forms.value = [];
  }
};

// Watch for unsaved changes
watch(
  dataValues,
  () => {
    hasUnsavedChanges.value = true;
  },
  { deep: true }
);

// Watch for route changes
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
      await handleRouteQuery();
    }
  }
);

// Watch for form selection changes
watch(selectedFormId, async (newFormId) => {
  console.log('👀 Form selection changed:', newFormId);
  console.log('   showDataEntry:', showDataEntry.value);
  console.log('   canLoadData:', canLoadData.value);
  
  if (newFormId) {
    // Auto-load the form when a form is selected
    // This will load the form structure and then populate it with data
    if (!showDataEntry.value && canLoadData.value) {
      // If form isn't loaded yet, load it first
      console.log('🔄 Auto-loading form structure...');
      await loadDataEntry();
      console.log('✅ Auto-load complete. showDataEntry:', showDataEntry.value);
      console.log('   dataValues:', Object.keys(dataValues.value).length, 'fields');
    } else if (showDataEntry.value) {
      // If form is already loaded, just populate the data
      console.log('📝 Form already loaded, populating data...');
      loading.value = true;
      loadingMessage.value = "Loading form data...";
      
      try {
        const result = await FormService.getFormById(newFormId);
        if (result.success) {
          console.log('✅ Form data retrieved:', result.form);
          
          // Extract form data, excluding metadata
          const { id, formType, createdAt, updatedAt, status, firestoreId, formDataId, ...formData } = result.form;
          
          console.log('📊 Populating', Object.keys(formData).length, 'fields');
          
          // Populate the form
          dataValues.value = formData;
          
          // Update completion status
          updateCompletionStatus();
          
          // Store the form ID for updates
          dataValues.value.formId = id;
          
          hasUnsavedChanges.value = false;
          saveStatusMessage.value = `Form loaded successfully (${Object.keys(formData).length} fields)`;
          saveStatusClass.value = "success";
          
          // Clear status message after 2 seconds
          setTimeout(() => {
            saveStatusMessage.value = "";
            saveStatusClass.value = "";
          }, 2000);
        } else {
          console.error('❌ Failed to load form:', result.error);
          saveStatusMessage.value = "Failed to load form";
          saveStatusClass.value = "error";
          
          setTimeout(() => {
            saveStatusMessage.value = "";
            saveStatusClass.value = "";
          }, 3000);
        }
      } catch (error) {
        console.error("❌ Error loading form:", error);
        saveStatusMessage.value = "Error loading form";
        saveStatusClass.value = "error";
        
        setTimeout(() => {
          saveStatusMessage.value = "";
          saveStatusClass.value = "";
        }, 3000);
      } finally {
        loading.value = false;
      }
    } else {
      console.log('⚠️ Cannot load: showDataEntry=false, canLoadData=false');
    }
  } else if (!newFormId && showDataEntry.value) {
    // Clear the form when "-- New Form --" is chosen
    console.log('🗑️ Clearing form data');
    clearDataValues();
    hasUnsavedChanges.value = false;
  }
});
</script>

<style scoped>
/* Main Container */
.tkp-documents-container {
  min-height: 100vh;
  background-color: #f4f6f8; /* DHIS2 Gray Background */
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Sub-Header */
.capture-sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #d5dde5;
  background: white;
  color: #494949;
  height: 36px;
}

.header-action-btn i {
  font-size: 14px;
  color: #6c757d;
  transition: color 0.2s;
}

.header-action-btn:hover {
  background-color: #f4f6f8;
  color: #147cd7;
  border-color: #147cd7;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.header-action-btn:hover i {
  color: #147cd7;
}

.header-action-btn.active {
  background-color: #e8f3fa;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: flex-end;
}

.selection-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selection-label {
  font-size: 14px;
  font-weight: 500;
  color: #494949;
}

.selection-dropdown {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  font-size: 14px;
  color: #212934;
  background-color: white;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23494949' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.selection-dropdown:focus {
  outline: none;
  border-color: #147cd7;
  box-shadow: 0 0 0 3px rgba(20, 124, 215, 0.1);
}

.form-count {
  font-size: 12px;
  color: #6c757d;
  font-weight: normal;
  margin-left: 4px;
}

.selection-hint {
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
  font-style: italic;
}

/* Load Button */
.load-button {
  padding: 10px 24px;
  background-color: #147cd7;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.load-button:hover:not(:disabled) {
  background-color: #1169ba;
}

.load-button:disabled {
  background-color: #a0c5e8;
  cursor: not-allowed;
}

/* Status Bar */
.status-bar {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f4f6f8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  font-size: 14px;
  color: #494949;
}

.status-value {
  font-weight: 500;
  color: #212934;
  margin-left: 8px;
}

.completion-percentage {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
}

.completion-percentage.low { background: #ffebee; color: #c62828; }
.completion-percentage.medium { background: #fff3e0; color: #ef6c00; }
.completion-percentage.high { background: #e8f5e9; color: #2e7d32; }

/* Data Entry Section */
.data-entry-section {
  background: white;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.data-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f4f6f8;
}

.data-entry-header h2 {
  font-size: 18px;
  font-weight: 500;
  color: #212934;
  margin: 0;
}

.entry-actions {
  display: flex;
  gap: 12px;
}

.validate-button, .clear-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d5dde5;
  background: white;
  color: #494949;
}

.validate-button:hover {
  background: #f4f6f8;
  color: #147cd7;
  border-color: #147cd7;
}

.clear-button:hover {
  background: #ffebee;
  color: #c62828;
  border-color: #ef5350;
}

/* Form Sections */
.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #212934;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8f3fa;
}

.data-elements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.data-element {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.element-label {
  font-size: 14px;
  color: #494949;
}

.element-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
}

.element-input:focus {
  outline: none;
  border-color: #147cd7;
  box-shadow: 0 0 0 3px rgba(20, 124, 215, 0.1);
}

/* Custom Reports Section */
.custom-reports-section {
  background: white;
  border-radius: 4px;
  padding: 24px;
}

.custom-reports-section :deep(.filter-panel h3) {
  font-size: 18px;
  font-weight: 500;
  color: #212934;
  margin-bottom: 16px;
}

.custom-reports-section :deep(.filter-row) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.custom-reports-section :deep(.form-group label) {
  font-weight: 500;
  color: #494949;
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
}

.custom-reports-section :deep(.search-input-wrapper input),
.custom-reports-section :deep(.form-group select) {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  font-size: 14px;
}

.custom-reports-section :deep(.primary-button) {
  background: #147cd7;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.custom-reports-section :deep(.primary-button:hover) {
  background: #1169ba;
}

.custom-reports-section :deep(.secondary-button) {
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

/* Document Management Styles */
.document-management-section {
  background: white;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.dm-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.dm-title h2 {
  font-size: 20px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 4px 0;
}

.dm-title p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.upload-btn {
  background: #147cd7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.upload-btn:hover {
  background: #1169ba;
}

.dm-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-wrapper i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-wrapper input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  font-size: 14px;
}

.dm-select {
  padding: 10px 32px 10px 12px;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  font-size: 14px;
  color: #494949;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23494949' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  min-width: 150px;
}

.dm-table-wrapper {
  border: 1px solid #d5dde5;
  border-radius: 4px;
  overflow-x: auto;
}

.dm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.dm-table th {
  background: #f4f6f8;
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: #494949;
  border-bottom: 1px solid #d5dde5;
}

.dm-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #d5dde5;
  color: #212934;
}

.dm-table tr:last-child td {
  border-bottom: none;
}

.doc-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.pdf-icon { color: #e53935; font-size: 20px; }
.word-icon { color: #1976d2; font-size: 20px; }
.image-icon { color: #43a047; font-size: 20px; }

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.approved { background: #e8f5e9; color: #2e7d32; }
.status-badge.pending { background: #fff3e0; color: #ef6c00; }
.status-badge.draft { background: #f3f4f6; color: #4b5563; }

.action-buttons {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px;
  border: 1px solid #d5dde5;
  background: white;
  border-radius: 4px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f4f6f8;
  color: #147cd7;
  border-color: #147cd7;
}

.icon-btn.delete:hover {
  background: #ffebee;
  color: #c62828;
  border-color: #ef5350;
}

.dm-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #f4f6f8;
  color: #6c757d;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-controls button {
  padding: 6px 12px;
  border: 1px solid #d5dde5;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #494949;
}

.pagination-controls button.active {
  background: #147cd7;
  color: white;
  border-color: #147cd7;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }
  
  .header-right {
    flex-direction: column;
    width: 100%;
  }
  
  .header-action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .capture-sub-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .dm-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .upload-btn {
    width: 100%;
    justify-content: center;
  }

  .dm-filters {
    flex-direction: column;
    gap: 12px;
  }

  .search-wrapper {
    width: 100%;
  }

  .dm-select {
    width: 100%;
  }

  .dm-pagination {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
}
</style>
