<template>
  <div class="capture-container">
    <!-- Header -->
    <!-- Top Header -->
    <TopHeader />

    <!-- App Sub-Header -->
    <div class="capture-sub-header">
      <div class="header-left">
        <h1 class="capture-title">Data Capture</h1>
        <span class="module-badge">Data Entry Module</span>
      </div>
      <div class="header-right">
        <button
          @click="showInitialReferral"
          class="action-button referral-button"
          :class="{ active: activeTab === 'referral' }"
        >
          <i class="fas fa-file-medical"></i>
          New Referral
        </button>
        <button
          @click="showCustomReportsTab"
          class="action-button reports-button"
          :class="{ active: activeTab === 'reports' }"
        >
          <i class="fas fa-file-alt"></i>
          Documents For TKP
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
import { useToast } from "../composables/useToast.js";
import CaptureService from "../services/captureService.js";
import FormService from "../services/formService.js";
import AuthService from "../services/auth.js";
import TrackerService from "../services/trackerService.js";
import InitialReferralForm from "./InitialReferralForm.vue";
import MedicalIntakeForm from "./MedicalIntakeForm.vue";
import ChildOverviewForm from "./ChildOverviewForm.vue";
import InitialAssessmentForm from "./InitialAssessmentForm.vue";
import CustomReports from "./CustomReports.vue";

const router = useRouter();
const route = useRoute();
const { addToast } = useToast();

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

// Computed properties
const selectedDataSetName = computed(() => {
  const dataSet = dataSets.value.find((ds) => ds.id === selectedDataSet.value);
  return dataSet ? dataSet.name : "";
});

const canLoadData = computed(() => {
  return selectedDataSet.value && selectedOrgUnit.value && selectedPeriod.value;
});

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
    addToast("Failed to load data entry form: " + error.message, 'error');
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
  addToast("Initial Referral Form saved successfully!", 'success');

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
    addToast("Data validation passed!", 'success');
  } else {
    addToast("Please fix the validation errors before proceeding", 'error');
  }
};

const saveData = async () => {
  // Special handling for Initial Referral Form
  if (selectedDataSet.value === "initial-referral" && referralForm.value) {
    // Trigger the save method of the InitialReferralForm component
    // This would require exposing a save method in InitialReferralForm
    addToast("Please use the Save button in the Initial Referral Form", 'info');
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
.capture-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* Capture Sub-Header */
.capture-sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.capture-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.referral-button,
.reports-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2c6693;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 0.75rem;
}

.referral-button:hover,
.reports-button:hover {
  background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.reports-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
}

.reports-button:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

/* Active tab styles */
.referral-button.active,
.reports-button.active {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #212529;
  box-shadow: 0 2px 6px rgba(255, 193, 7, 0.4);
}

.referral-button.active:hover,
.reports-button.active:hover {
  background: linear-gradient(135deg, #e0a800 0%, #d39e00 100%);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.5);
}

.capture-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.save-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-left: auto;
  display: block;
}

.save-button:hover:not(:disabled) {
  background: #218838;
}

.save-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.capture-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.selection-panel {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 1.5rem;
  align-items: end;
}

.selection-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selection-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.selection-dropdown {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  background: white;
  min-width: 200px;
  min-height: 44px;
}

.selection-dropdown:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  min-height: 44px;
}

.load-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  min-height: 44px;
  min-width: 44px;
}

.load-button:hover:not(:disabled) {
  background: #0056b3;
}

.load-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.status-bar {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.status-label,
.completion-label {
  font-weight: 600;
  color: #6c757d;
}

.status-value {
  color: #495057;
}

.completion-percentage {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.completion-complete {
  background: #d4edda;
  color: #155724;
}

.completion-partial {
  background: #fff3cd;
  color: #856404;
}

.completion-low {
  background: #f8d7da;
  color: #721c24;
}

.data-entry-section {
  background: white;
  border-radius: 0.5rem;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-entry-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 0.5rem 0.5rem 0 0;
}

.data-entry-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.entry-actions {
  display: flex;
  gap: 0.5rem;
}

.validate-button {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  min-height: 40px;
  min-width: 40px;
}

.validate-button:hover {
  background: #138496;
}

.clear-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  min-height: 40px;
  min-width: 40px;
}

.clear-button:hover {
  background: #c82333;
}

.data-entry-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  background: #e9ecef;
  padding: 0.75rem 1rem;
  margin: 0 0 1rem 0;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.data-elements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.data-element {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.element-label {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .capture-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .referral-button,
  .reports-button,
  .save-button {
    width: 100%;
    margin: 0;
    justify-content: center;
  }

  .capture-content {
    padding: 1rem;
  }

  .selection-panel {
    padding: 1rem;
  }

  .selection-grid {
    grid-template-columns: 1fr;
  }

  .data-entry-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem;
  }

  .entry-actions {
    justify-content: stretch;
  }

  .validate-button,
  .clear-button {
    flex: 1;
  }

  .data-entry-form {
    padding: 1rem;
  }

  .data-elements-grid {
    grid-template-columns: 1fr;
  }
}

.element-input {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.element-input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.element-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  min-height: 20px;
  min-width: 20px;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #495057;
}

@media (max-width: 768px) {
  .checkbox-container {
    gap: 0.75rem;
  }

  .element-checkbox {
    width: 1.5rem;
    height: 1.5rem;
  }

  .checkbox-label {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .checkbox-container {
    gap: 0.5rem;
  }

  .element-checkbox {
    width: 1.25rem;
    height: 1.25rem;
  }

  .checkbox-label {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .checkbox-container {
    gap: 0.4rem;
  }

  .element-checkbox {
    width: 1.1rem;
    height: 1.1rem;
  }

  .checkbox-label {
    font-size: 0.85rem;
  }
}

.validation-error {
  color: #dc3545;
  font-size: 0.8rem;
  font-style: italic;
}

.data-entry-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 0.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-updated {
  color: #6c757d;
  font-size: 0.9rem;
}

.footer-right {
  display: flex;
  gap: 0.5rem;
}

.draft-button {
  background: #ffc107;
  color: #212529;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  min-height: 40px;
  min-width: 40px;
}

.draft-button:hover {
  background: #e0a800;
}

.complete-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  min-height: 40px;
  min-width: 40px;
}

.complete-button:hover:not(:disabled) {
  background: #218838;
}

.complete-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.no-data-message {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-data-content {
  text-align: center;
  color: #6c757d;
}

.no-data-content svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-data-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.no-data-content p {
  margin: 0;
  font-size: 0.9rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  width: 300px;
  margin: 0 auto;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner p {
  margin: 0;
  color: #495057;
  font-weight: 500;
}

@media (max-width: 768px) {
  .loading-spinner {
    padding: 1.5rem;
    width: auto;
    max-width: 95%;
  }

  .spinner {
    width: 36px;
    height: 36px;
  }

  .loading-spinner p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .loading-spinner {
    padding: 1rem;
  }

  .spinner {
    width: 32px;
    height: 32px;
  }

  .loading-spinner p {
    font-size: 0.85rem;
  }
}

@media (max-width: 360px) {
  .loading-spinner {
    padding: 0.75rem;
  }

  .spinner {
    width: 28px;
    height: 28px;
  }

  .loading-spinner p {
    font-size: 0.8rem;
  }
}

.save-status {
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.save-status.saving {
  color: #007bff;
  background-color: #e3f2fd;
}

.save-status.success {
  color: #155724;
  background-color: #d4edda;
}

.save-status.error {
  color: #721c24;
  background-color: #f8d7da;
}

.custom-reports-section {
  margin-top: 2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Hide all emoji file icons */
.custom-reports-section :deep(.file-icon) {
  display: none !important;
}

/* Header improvements */
.custom-reports-section :deep(.header-section) {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
}

.custom-reports-section :deep(.header-section h1) {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.custom-reports-section :deep(.header-section p) {
  color: #6c757d;
  margin: 0;
  font-size: 1rem;
}

/* Filter panel styling */
.custom-reports-section :deep(.filter-panel) {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
}

.custom-reports-section :deep(.filter-panel h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1.25rem 0;
}

.custom-reports-section :deep(.filter-row) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.custom-reports-section :deep(.form-group) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.custom-reports-section :deep(.form-group label) {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.custom-reports-section :deep(.search-input-wrapper) {
  position: relative;
  display: flex;
  align-items: center;
}

.custom-reports-section :deep(.search-input-wrapper input) {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.custom-reports-section :deep(.search-input-wrapper input:focus) {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.custom-reports-section :deep(.search-icon) {
  position: absolute;
  left: 0.75rem;
  width: 18px;
  height: 18px;
  color: #6c757d;
  pointer-events: none;
}

.custom-reports-section :deep(.clear-search-btn) {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.custom-reports-section :deep(.clear-search-btn:hover) {
  color: #dc3545;
}

.custom-reports-section :deep(.form-group select) {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-reports-section :deep(.form-group select:focus) {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.custom-reports-section :deep(.filter-actions) {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.custom-reports-section :deep(.primary-button),
.custom-reports-section :deep(.secondary-button) {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-reports-section :deep(.primary-button) {
  background: #007bff;
  color: white;
}

.custom-reports-section :deep(.primary-button:hover) {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
}

.custom-reports-section :deep(.secondary-button) {
  background: #6c757d;
  color: white;
}

.custom-reports-section :deep(.secondary-button:hover) {
  background: #5a6268;
  transform: translateY(-1px);
}

/* Reports grid styling */
.custom-reports-section :deep(.reports-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.custom-reports-section :deep(.report-card) {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.custom-reports-section :deep(.report-card:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.custom-reports-section :deep(.report-header) {
  margin-bottom: 1rem;
}

.custom-reports-section :deep(.report-main) {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.custom-reports-section :deep(.report-info) {
  flex: 1;
}

.custom-reports-section :deep(.report-info h4) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.custom-reports-section :deep(.report-info p) {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 0.75rem 0;
}

.custom-reports-section :deep(.status-badge) {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-reports-section :deep(.report-card[data-status="pending_review"] .status-badge) {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
}

.custom-reports-section :deep(.report-card[data-status="approved"] .status-badge) {
  background: #d4edda;
  color: #155724;
  border: 1px solid #28a745;
}

.custom-reports-section :deep(.report-card[data-status="rejected"] .status-badge) {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #dc3545;
}

.custom-reports-section :deep(.report-description) {
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.custom-reports-section :deep(.report-meta) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.custom-reports-section :deep(.meta-item) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.custom-reports-section :deep(.meta-item svg) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #6c757d;
}

.custom-reports-section :deep(.meta-item strong) {
  font-weight: 600;
  color: #495057;
  margin-right: 0.25rem;
}

.custom-reports-section :deep(.report-actions) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.custom-reports-section :deep(.action-btn) {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-reports-section :deep(.view-btn) {
  background: #e3f2fd;
  color: #1976d2;
  border-color: #90caf9;
}

.custom-reports-section :deep(.view-btn:hover) {
  background: #bbdefb;
  color: #1565c0;
}

.custom-reports-section :deep(.download-btn) {
  background: #e8f5e9;
  color: #388e3c;
  border-color: #81c784;
}

.custom-reports-section :deep(.download-btn:hover) {
  background: #c8e6c9;
  color: #2e7d32;
}

.custom-reports-section :deep(.delete-btn) {
  background: #ffebee;
  color: #d32f2f;
  border-color: #ef5350;
}

.custom-reports-section :deep(.delete-btn:hover) {
  background: #ffcdd2;
  color: #c62828;
}

.custom-reports-section :deep(.approve-btn) {
  background: #e8f5e9;
  color: #2e7d32;
  border-color: #66bb6a;
}

.custom-reports-section :deep(.approve-btn:hover) {
  background: #c8e6c9;
  color: #1b5e20;
}

.custom-reports-section :deep(.reject-btn) {
  background: #fff3e0;
  color: #f57c00;
  border-color: #ffb74d;
}

.custom-reports-section :deep(.reject-btn:hover) {
  background: #ffe0b2;
  color: #e65100;
}

.custom-reports-section :deep(.action-btn svg) {
  width: 16px;
  height: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .custom-reports-section {
    padding: 1rem;
  }

  .custom-reports-section :deep(.reports-grid) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .custom-reports-section :deep(.filter-row) {
    grid-template-columns: 1fr;
  }

  .custom-reports-section :deep(.filter-actions) {
    flex-direction: column;
  }

  .custom-reports-section :deep(.filter-actions button) {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .custom-reports-section {
    padding: 1rem;
  }
}

/* Responsive Design */
/* Medium devices (tablets, less than 1024px) */
@media (max-width: 1024px) {
  .selection-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .data-elements-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .data-element {
    margin-bottom: 1rem;
  }

  .element-label {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }

  .element-input {
    padding: 0.75rem;
    font-size: 1rem;
  }

  .validation-error {
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .form-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .data-entry-header h2 {
    font-size: 1.3rem;
  }

  .status-info,
  .status-completion {
    font-size: 0.95rem;
  }

  .completion-percentage {
    font-size: 0.95rem;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-width: 768px) {
  .capture-header {
    padding: 1rem;
    flex-direction: column;
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
    justify-content: center;
    flex-wrap: wrap;
  }

  .back-button,
  .logout-button,
  .referral-button,
  .reports-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    min-width: 120px;
    justify-content: center;
    min-height: 44px;
  }

  .capture-content {
    padding: 1rem;
  }

  .selection-panel {
    padding: 1rem;
  }

  .selection-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .selection-item {
    margin-bottom: 0.5rem;
  }

  .selection-label {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .selection-dropdown {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .load-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    min-height: 44px;
  }

  .data-elements-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .data-element {
    margin-bottom: 0.75rem;
  }

  .data-entry-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
  }

  .data-entry-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
  }

  .footer-right {
    width: 100%;
    justify-content: flex-start;
  }

  .status-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
  }

  .section-title {
    font-size: 0.95rem;
    padding: 0.75rem;
  }

  .element-label {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }

  .element-input {
    padding: 0.625rem;
    font-size: 0.9rem;
  }

  .validation-error {
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .no-data-content h3 {
    font-size: 1.1rem;
  }

  .no-data-content p {
    font-size: 0.85rem;
  }

  .custom-reports-section {
    margin-top: 1.5rem;
  }
}

@media (max-width: 480px) {
  .capture-header {
    padding: 0.75rem;
  }

  .capture-title {
    font-size: 1.25rem;
  }

  .back-button,
  .logout-button,
  .referral-button,
  .reports-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    width: 100%;
    justify-content: center;
    min-width: auto;
    min-height: 42px;
  }

  .header-right {
    flex-direction: column;
    gap: 0.5rem;
  }

  .selection-panel {
    padding: 0.75rem;
  }

  .selection-label {
    font-size: 0.85rem;
  }

  .selection-dropdown,
  .element-input {
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  .selection-item {
    margin-bottom: 0.75rem;
  }

  .load-button,
  .validate-button,
  .clear-button,
  .draft-button,
  .complete-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
    min-height: 42px;
  }

  .data-entry-header h2 {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 0.9rem;
  }

  .element-label {
    font-size: 0.8rem;
  }

  .validation-error {
    font-size: 0.7rem;
  }

  .last-updated {
    font-size: 0.8rem;
  }

  .save-status {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
  }

  .status-info,
  .status-completion {
    font-size: 0.85rem;
  }

  .completion-percentage {
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
  }

  .no-data-content svg {
    width: 36px;
    height: 36px;
  }

  .no-data-content h3 {
    font-size: 1rem;
  }

  .no-data-content p {
    font-size: 0.8rem;
  }

  .custom-reports-section {
    margin-top: 1.25rem;
  }
}

/* Extra small devices (phones, less than 360px) */
@media (max-width: 360px) {
  .capture-header {
    padding: 0.5rem;
  }

  .capture-title {
    font-size: 1.1rem;
  }

  .back-button,
  .logout-button,
  .referral-button,
  .reports-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 40px;
  }

  .selection-label {
    font-size: 0.8rem;
  }

  .selection-dropdown,
  .element-input {
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  .selection-item {
    margin-bottom: 0.75rem;
  }

  .load-button,
  .validate-button,
  .clear-button,
  .draft-button,
  .complete-button {
    padding: 0.625rem;
    font-size: 0.8rem;
    min-height: 40px;
  }

  .data-entry-header h2 {
    font-size: 1rem;
  }

  .section-title {
    font-size: 0.85rem;
  }

  .element-label {
    font-size: 0.75rem;
  }

  .validation-error {
    font-size: 0.65rem;
  }

  .last-updated {
    font-size: 0.75rem;
  }

  .save-status {
    font-size: 0.75rem;
    padding: 0.15rem 0.3rem;
  }

  .status-info,
  .status-completion {
    font-size: 0.8rem;
  }

  .completion-percentage {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
  }

  .no-data-content svg {
    width: 32px;
    height: 32px;
  }

  .no-data-content h3 {
    font-size: 0.95rem;
  }

  .no-data-content p {
    font-size: 0.75rem;
  }

  .custom-reports-section {
    margin-top: 1rem;
  }
}

.save-status {
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.save-status.saving {
  color: #007bff;
  background-color: #e3f2fd;
}

.save-status.success {
  color: #155724;
  background-color: #d4edda;
}

.save-status.error {
  color: #721c24;
  background-color: #f8d7da;
}

.save-status.info {
  color: #004085;
  background-color: #cce5ff;
}

.form-count {
  font-size: 0.85em;
  color: #6c757d;
  font-weight: normal;
  margin-left: 0.5rem;
}

.selection-hint {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0.5rem 0 0 0;
  font-style: italic;
}
</style>
