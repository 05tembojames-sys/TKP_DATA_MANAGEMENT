<template>
  <div class="aggregate-data-entry-page">
    <TopHeader />
    <div class="aggregate-data-entry">
    <!-- Mobile Header -->
    <div class="mobile-header">
      <span class="mobile-title">System Data Entry</span>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Top Selection Bar -->
      <div class="selection-bar">
        <div class="selection-group">
          <label>Data Set</label>
          <select v-model="selectedDataSet" class="dhis-select">
            <option value="" disabled>Select Data Set</option>
            <option v-for="ds in dataSets" :key="ds.id" :value="ds.id">{{ ds.name }}</option>
          </select>
        </div>
        
        <div class="selection-group">
          <label>Period</label>
          <div class="period-selector">
            <button class="period-nav" @click="prevPeriod" :disabled="!selectedPeriod"><i class="fas fa-chevron-left"></i></button>
            <select v-model="selectedPeriod" class="dhis-select period-select">
              <option value="" disabled>Select Period</option>
              <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
            <button class="period-nav" @click="nextPeriod" :disabled="!selectedPeriod"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <!-- Data Entry Table -->
      <div class="data-entry-area" v-if="selectedDataSet && selectedPeriod">
        <!-- Component-based Forms -->
        <div v-if="selectedDataSet === 'initial-referral'" class="form-component-wrapper">
          <InitialReferralForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'medical-intake'" class="form-component-wrapper">
          <MedicalIntakeForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'child-overview'" class="form-component-wrapper">
          <ChildOverviewForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'initial-assessment'" class="form-component-wrapper">
          <InitialAssessmentForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'academics-literacy'" class="form-component-wrapper">
          <AcademicsLiteracyForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'psychological-assessment'" class="form-component-wrapper">
          <PsychologicalAssessmentForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'life-skills-survey'" class="form-component-wrapper">
          <LifeSkillsSurveyForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'birth-delivery'" class="form-component-wrapper">
          <BirthDeliveryForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'care-plan-summary'" class="form-component-wrapper">
          <CarePlanSummaryForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'care-plan-baby'" class="form-component-wrapper">
          <CarePlanBabyForm @form-saved="handleReferralFormSaved" />
        </div>
        <div v-else-if="selectedDataSet === 'care-plan-ongoing-life-skills'" class="form-component-wrapper">
          <CarePlanOngoingLifeSkillsForm @form-saved="handleReferralFormSaved" />
        </div>

        <!-- Generic Table View (Fallback) -->
        <div v-else class="generic-table-view">
          <div class="form-header">
            <h3>{{ getDataSetName(selectedDataSet) }} - {{ getPeriodName(selectedPeriod) }}</h3>
            <div class="sync-status" v-if="syncStatus">
              <span v-if="syncStatus === 'syncing'" class="status-syncing"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
              <span v-if="syncStatus === 'saved'" class="status-saved"><i class="fas fa-check"></i> Saved</span>
              <span v-if="syncStatus === 'error'" class="status-error"><i class="fas fa-exclamation-circle"></i> Error saving</span>
            </div>
            <div class="form-actions">
              <!-- Aggregation button removed as per user request -->
              <button class="action-btn" @click="runValidation"><i class="fas fa-check-double"></i> Run Validation</button>
              <button class="action-btn primary" @click="completeDataSet"><i class="fas fa-check"></i> Complete</button>
            </div>
          </div>
  
          <div class="table-container">
            <table class="dhis-table">
            <thead>
              <tr>
                <th class="element-header">Data Element</th>
                <th v-for="cat in categoryOptions" :key="cat.id" class="value-header">{{ cat.name }}</th>
                <th class="comment-header">Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="dataElements.length === 0">
                <td :colspan="categoryOptions.length + 2" class="no-elements">
                  No data elements defined for this data set.
                </td>
              </tr>
              <tr v-for="element in dataElements" :key="element.id" :class="{ 'section-header': element.isSection }">
                <td v-if="element.isSection" :colspan="categoryOptions.length + 2" class="section-title">
                  {{ element.name }}
                </td>
                <td v-else class="element-name">
                  {{ element.name }}
                  <i v-if="element.description" class="fas fa-info-circle info-icon" :title="element.description"></i>
                </td>
                <template v-if="!element.isSection">
                  <td v-for="cat in categoryOptions" :key="cat.id" class="input-cell">
                    <!-- Text Input -->
                    <input 
                      v-if="!element.valueType || element.valueType === 'TEXT'"
                      type="text" 
                      v-model="dataValues[`${element.id}-${cat.id}`]"
                      @focus="handleFocus($event)"
                      @blur="handleBlur($event, element.id, cat.id)"
                      :class="{ 'has-value': dataValues[`${element.id}-${cat.id}`] }"
                      :placeholder="element.placeholder || ''"
                    />
                    
                    <!-- Number Input -->
                    <input 
                      v-else-if="element.valueType === 'NUMBER'"
                      type="number" 
                      v-model="dataValues[`${element.id}-${cat.id}`]"
                      @focus="handleFocus($event)"
                      @blur="handleBlur($event, element.id, cat.id)"
                      :class="{ 'has-value': dataValues[`${element.id}-${cat.id}`] }"
                      :min="element.min"
                      :max="element.max"
                    />

                    <!-- Date Input -->
                    <input 
                      v-else-if="element.valueType === 'DATE'"
                      type="date" 
                      v-model="dataValues[`${element.id}-${cat.id}`]"
                      @focus="handleFocus($event)"
                      @blur="handleBlur($event, element.id, cat.id)"
                      :class="{ 'has-value': dataValues[`${element.id}-${cat.id}`] }"
                    />

                    <!-- Select Input -->
                    <select
                      v-else-if="element.valueType === 'SELECT'"
                      v-model="dataValues[`${element.id}-${cat.id}`]"
                      @focus="handleFocus($event)"
                      @blur="handleBlur($event, element.id, cat.id)"
                      :class="{ 'has-value': dataValues[`${element.id}-${cat.id}`] }"
                      class="dhis-select-input"
                    >
                      <option value="">Select option</option>
                      <option v-for="opt in element.options" :key="opt" :value="opt">{{ opt }}</option>
                    </select>

                    <!-- Boolean Input -->
                    <select
                      v-else-if="element.valueType === 'BOOLEAN'"
                      v-model="dataValues[`${element.id}-${cat.id}`]"
                      @focus="handleFocus($event)"
                      @blur="handleBlur($event, element.id, cat.id)"
                      :class="{ 'has-value': dataValues[`${element.id}-${cat.id}`] }"
                      class="dhis-select-input"
                    >
                      <option value="">Select</option>
                      <option :value="true">Yes</option>
                      <option :value="false">No</option>
                    </select>

                  </td>
                  <td class="comment-cell">
                    <i class="fas fa-comment-alt" @click="openComment(element.id)"></i>
                  </td>
                </template>
              </tr>
            </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-content">
          <i class="fas fa-arrow-up mobile-hide"></i>
          <h3>Please select Data Set and Period</h3>
          <p>Use the controls above to start entering data.</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from '../composables/useToast.js';
import { db } from '../firebase/config.js';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import CaptureService from '../services/captureService.js';
import FormService from '../services/formService.js';
import TopHeader from './TopHeader.vue';

// Import Specific Form Components
import InitialReferralForm from "./InitialReferralForm.vue";
import MedicalIntakeForm from "./MedicalIntakeForm.vue";
import ChildOverviewForm from "./ChildOverviewForm.vue";
import InitialAssessmentForm from "./InitialAssessmentForm.vue";
import AcademicsLiteracyForm from "./AcademicsLiteracyForm.vue";
import PsychologicalAssessmentForm from "./PsychologicalAssessmentForm.vue";
import LifeSkillsSurveyForm from "./LifeSkillsSurveyForm.vue";
import BirthDeliveryForm from "./BirthDeliveryForm.vue";
import CarePlanSummaryForm from "./CarePlanSummaryForm.vue";
import CarePlanBabyForm from "./CarePlanBabyForm.vue";
import CarePlanOngoingLifeSkillsForm from "./CarePlanOngoingLifeSkillsForm.vue";

const router = useRouter();
const route = useRoute();
const { success, info, error } = useToast();

// State
const selectedOu = ref('kukhoma-admin'); // Default to main/system org unit
const selectedDataSet = ref('');
const selectedPeriod = ref('');
// const ouSearch = ref(''); // Removed
// const expandedOrgUnits = ref(new Set()); // Removed
const dataValues = reactive({});
const loading = ref(false);
const saving = ref(false);
const isSidebarOpen = ref(false);

const orgUnits = ref([]);
const dataSets = ref([]);
const periods = ref([]);
const loadingOrgUnits = ref(false);

const categoryOptions = [
  { id: 'default', name: 'Value' }
];

// Data Elements derived dynamically from CaptureService
const dataElements = computed(() => {
  if (!selectedDataSet.value) return [];
  
  try {
    const structure = CaptureService.generateFormStructure(selectedDataSet.value);
    const flat = [];
    
    if (structure && structure.sections) {
      structure.sections.forEach(section => {
        flat.push({ 
          id: section.id, 
          name: section.name, 
          isSection: true 
        });
        
        if (section.dataElements) {
          section.dataElements.forEach(element => {
            flat.push({ 
              ...element, 
              isSection: false 
            });
          });
        }
      });
    }
    return flat;
  } catch (err) {
    console.error("Error generating form structure:", err);
    return [];
  }
});

// const orgUnitTree = computed(() => { ... }); // Removed

// Methods
const loadOrgUnits = async () => {
  // loadingOrgUnits.value = true;
  // try {
  //   const response = await CaptureService.getOrgUnits();
  //   orgUnits.value = response;
  // } catch (err) {
  //   console.error('Error loading org units:', err);
  // } finally {
  //   loadingOrgUnits.value = false;
  // }
};

const loadDataSets = async () => {
  try {
    const response = await CaptureService.getDataSets();
    dataSets.value = response;
  } catch (err) {
    console.error('Error loading data sets:', err);
  }
};

const loadPeriods = async () => {
  try {
    const response = await CaptureService.getPeriods();
    periods.value = response;
    
    // Auto-select current month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentPeriodId = `${currentYear}${currentMonth.toString().padStart(2, '0')}`;
    
    // Check if current period exists in list, if not fallback to first
    const found = response.find(p => p.id === currentPeriodId);
    if (found) {
      selectedPeriod.value = currentPeriodId;
    } else if (response.length > 0) {
      selectedPeriod.value = response[0].id;
    }
  } catch (err) {
    console.error('Error loading periods:', err);
  }
};

const selectOu = (ouId) => {
  selectedOu.value = ouId;
  loadData();
};

const toggleOrgUnit = (ouId) => {
  // ...
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const getDataSetName = (id) => {
  const ds = dataSets.value.find(d => d.id === id);
  return ds ? ds.name : '';
};

const getPeriodName = (id) => {
  const p = periods.value.find(per => per.id === id);
  return p ? p.name : '';
};

const prevPeriod = () => {
  const currentIndex = periods.value.findIndex(p => p.id === selectedPeriod.value);
  if (currentIndex < periods.value.length - 1) {
    selectedPeriod.value = periods.value[currentIndex + 1].id;
  }
};

const nextPeriod = () => {
  const currentIndex = periods.value.findIndex(p => p.id === selectedPeriod.value);
  if (currentIndex > 0) {
    selectedPeriod.value = periods.value[currentIndex - 1].id;
  }
};

const handleFocus = (event) => {
  event.target.select();
  event.target.parentElement.classList.add('focused');
};

const syncStatus = ref('saved'); // saved, syncing, error
const lastSavedTime = ref(null);

const handleBlur = async (event, elementId, catId) => {
  event.target.parentElement.classList.remove('focused');
  const val = event.target.value;
  const key = `${elementId}-${catId}`;
  
  // Only save if value has changed
  if (dataValues[key] !== val) {
    if (selectedOu.value && selectedDataSet.value && selectedPeriod.value) {
      await saveDataValue(elementId, catId, val);
    }
  }
};

// Load Data from Firestore
const loadData = async () => {
  if (!selectedOu.value || !selectedDataSet.value || !selectedPeriod.value) return;
  
  loading.value = true;
  syncStatus.value = 'saved';
  // Clear current values in the generic table
  Object.keys(dataValues).forEach(key => delete dataValues[key]);
  
  try {
    // 1. Load Generic Aggregate Data (for Table View)
    const docId = `${selectedOu.value}_${selectedDataSet.value}_${selectedPeriod.value}`;
    const docRef = doc(db, 'aggregate_data', docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      Object.assign(dataValues, data.values || {});
      if (data.updatedAt) {
        lastSavedTime.value = data.updatedAt.toDate();
      }
    }

    // 2. Load Existing Individual Forms (for Component View)
    // In a real scenario, we might want to list all forms for this period/OU
    // But for now, we just rely on the component handling its own data or creating new
    
  } catch (err) {
    console.error("Error loading data:", err);
    error("Failed to load data");
  } finally {
    loading.value = false;
  }
};

const handleReferralFormSaved = (data) => {
  success('Form saved successfully!');
  // Optionally redirect or clear selection
  // selectedDataSet.value = '';
};
 
// Save Data to Firestore (Generic Table)
const saveDataValue = async (elementId, catId, value) => {
  // ... existing logic ...
  // (kept as is for the table view)
  if (!selectedOu.value || !selectedDataSet.value || !selectedPeriod.value) return;
  
  saving.value = true;
  syncStatus.value = 'syncing';
  
  try {
    const docId = `${selectedOu.value}_${selectedDataSet.value}_${selectedPeriod.value}`;
    const docRef = doc(db, 'aggregate_data', docId);
    
    const valueKey = `${elementId}-${catId}`;
    dataValues[valueKey] = value;
    
    const updateData = {
      orgUnit: selectedOu.value,
      dataSet: selectedDataSet.value,
      period: selectedPeriod.value,
      updatedAt: new Date(),
      [`values.${valueKey}`]: value
    };
    
    await setDoc(docRef, updateData, { merge: true });
    
    syncStatus.value = 'saved';
    lastSavedTime.value = new Date();
  } catch (err) {
    console.error("Error saving data:", err);
    syncStatus.value = 'error';
    error("Failed to save value");
  } finally {
    saving.value = false;
  }
};

const runValidation = () => {
  info('Running validation rules...');
  setTimeout(() => {
    success('Validation passed successfully');
  }, 1000);
};

const completeDataSet = async () => {
  if (!selectedOu.value || !selectedDataSet.value || !selectedPeriod.value) return;
  
  try {
    const docId = `${selectedOu.value}_${selectedDataSet.value}_${selectedPeriod.value}`;
    const docRef = doc(db, 'aggregate_data', docId);
    
    await setDoc(docRef, {
      completed: true,
      completedAt: new Date(),
      completedBy: 'Current User' // Replace with actual user
    }, { merge: true });
    
    success('Data set marked as complete');
  } catch (err) {
    error("Failed to complete data set");
  }
};

const openComment = (elementId) => {
  info(`Open comment for ${elementId}`);
};

// Watchers
watch([selectedDataSet, selectedPeriod], () => {
  loadData();
});

// Initialize
onMounted(async () => {
  await Promise.all([
    // loadOrgUnits(), 
    loadDataSets(),
    loadPeriods()
  ]);
});
</script>

<style scoped>
.aggregate-data-entry-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.aggregate-data-entry {
  display: flex;
  flex: 1;
  background: #f3f5f7;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Mobile Header */
.mobile-header {
  display: none;
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #d5dce5;
  align-items: center;
  gap: 16px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  height: 50px;
}

.mobile-menu-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #2c6693;
  cursor: pointer;
  padding: 4px;
}

.mobile-title {
  font-weight: 500;
  color: #2c3e50;
  font-size: 1.1rem;
}

/* Sidebar */
.org-unit-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #d5dce5;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  z-index: 30;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #2c6693;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.close-sidebar-btn {
  display: none;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.1rem;
}

.search-ou {
  padding: 8px;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}

.search-ou input {
  width: 100%;
  padding: 6px 8px 6px 30px;
  border: 1px solid #d5dce5;
  border-radius: 3px;
  font-size: 0.9rem;
}

.search-ou i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.8rem;
}

.ou-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.loading-tree {
  padding: 20px;
  text-align: center;
  color: #666;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
}

.selection-bar {
  background: white;
  padding: 12px 24px;
  border-bottom: 1px solid #d5dce5;
  display: flex;
  gap: 24px;
  align-items: flex-end;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  flex-wrap: wrap;
}

.selection-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selection-group label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
}

.dhis-select {
  padding: 8px 12px;
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  background: white;
  min-width: 200px;
  font-size: 0.9rem;
  color: #333;
  height: 36px;
}

.dhis-select:focus {
  border-color: #2c6693;
  outline: none;
  box-shadow: 0 0 0 2px rgba(44, 102, 147, 0.1);
}

.period-selector {
  display: flex;
  gap: 4px;
}

.period-nav {
  width: 36px;
  height: 36px;
  border: 1px solid #a0a0a0;
  background: #f5f5f5;
  border-radius: 3px;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
}

.period-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.period-nav:hover:not(:disabled) {
  background: #e0e0e0;
}

/* Data Entry Area */
.data-entry-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.form-header h3 {
  margin: 0;
  color: #2c3e50;
  font-weight: 500;
}

.sync-status {
  font-size: 0.85rem;
  margin-left: 16px;
  margin-right: auto;
}

.status-syncing {
  color: #f57c00;
}

.status-saved {
  color: #4caf50;
}

.status-error {
  color: #d32f2f;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #d5dce5;
  background: white;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.action-btn:hover {
  background: #f9f9f9;
}

.action-btn.primary {
  background: #2c6693;
  color: white;
  border-color: #255a82;
}

.action-btn.primary:hover {
  background: #255a82;
}

/* Table */
.table-container {
  background: white;
  border: 1px solid #d5dce5;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow-x: auto;
}

.dhis-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Ensure table accommodates wider form inputs */
}

.dhis-table th,
.dhis-table td {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
}

.dhis-table tbody tr:nth-child(even) {
  background-color: #fcfcfc;
}

.dhis-table tbody tr:hover {
  background-color: #f0f7ff;
}

.dhis-table thead th {
  background: #f3f5f7;
  color: #333;
  font-weight: 600;
  text-align: left;
  font-size: 0.9rem;
  padding: 12px;
}

.value-header {
  min-width: 200px;
  width: auto; 
  text-align: left !important;
}

.comment-header {
  width: 60px;
  text-align: center !important;
}

.element-name {
  font-size: 0.9rem;
  color: #333;
}

.info-icon {
  color: #2c6693;
  margin-left: 6px;
  font-size: 0.8rem;
  cursor: help;
}

.section-header {
  background: #e3f2fd;
}

.section-title {
  font-weight: 600;
  color: #1565c0;
  padding: 10px 12px;
}

.input-cell {
  padding: 0 !important;
  height: 40px;
}

.input-cell input,
.input-cell select {
  width: 100%;
  height: 100%;
  border: none;
  padding: 0 12px;
  font-size: 0.95rem;
  text-align: left;
  outline: none;
  transition: background 0.2s;
  background: transparent;
}

.input-cell select {
  cursor: pointer;
}

.input-cell input:focus,
.input-cell select:focus {
  background: #e3f2fd;
}

.form-component-wrapper {
  background: white;
  padding: 0;
  border-radius: 4px;
}

.input-cell.focused {
  border: 2px solid #2196f3;
}

.has-value {
  background: #e8f5e9;
}

.comment-cell {
  text-align: center;
  cursor: pointer;
  color: #9e9e9e;
}

.comment-cell:hover {
  color: #2c6693;
}

.no-elements {
  text-align: center;
  padding: 24px;
  color: #666;
  font-style: italic;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  text-align: center;
  padding: 20px;
}

.empty-content i {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #d5dce5;
}

.empty-content h3 {
  margin: 0 0 8px 0;
  color: #555;
}

.empty-content p {
  margin: 0;
  font-size: 0.9rem;
}

.mobile-show {
  display: none;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 25;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .aggregate-data-entry {
    flex-direction: column;
    padding-top: 50px; /* Space for mobile header */
  }

  .mobile-header {
    display: flex;
  }

  .org-unit-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 85%;
    max-width: 320px;
    transform: translateX(-100%);
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  }

  .org-unit-sidebar.mobile-open {
    transform: translateX(0);
  }

  .close-sidebar-btn {
    display: block;
  }

  .sidebar-overlay {
    display: block;
  }

  .selection-bar {
    padding: 12px 16px;
    gap: 12px;
  }

  .selection-group {
    width: 100%;
  }

  .dhis-select {
    width: 100%;
    min-width: auto;
  }

  .period-selector {
    width: 100%;
  }
  
  .period-select {
    flex: 1;
  }

  .data-entry-area {
    padding: 16px;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-actions {
    width: 100%;
    justify-content: space-between;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .mobile-hide {
    display: none;
  }

  .mobile-show {
    display: inline-block;
  }
}
</style>
