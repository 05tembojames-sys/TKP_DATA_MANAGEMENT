<template>
  <div class="aggregate-data-entry">
    <!-- Left Sidebar: Organisation Unit Tree -->
    <div class="org-unit-sidebar">
      <div class="sidebar-header">
        <i class="fas fa-sitemap"></i>
        <span>Organisation Unit</span>
      </div>
      <div class="search-ou">
        <input type="text" placeholder="Search organisation unit" v-model="ouSearch" />
        <i class="fas fa-search"></i>
      </div>
      <div class="ou-tree">
        <div class="tree-item" :class="{ selected: selectedOu === 'Global' }" @click="selectOu('Global')">
          <i class="fas fa-globe-africa"></i>
          <span>Global</span>
        </div>
        <div class="tree-group">
          <div class="tree-item" :class="{ selected: selectedOu === 'Zambia' }" @click="toggleExpand('Zambia')">
            <i :class="expanded['Zambia'] ? 'fas fa-caret-down' : 'fas fa-caret-right'"></i>
            <span @click.stop="selectOu('Zambia')">Zambia</span>
          </div>
          <div class="tree-children" v-if="expanded['Zambia']">
            <div class="tree-item" :class="{ selected: selectedOu === 'Lusaka' }" @click="selectOu('Lusaka')">
              <span class="spacer"></span>
              <i class="fas fa-building"></i>
              <span>Lusaka</span>
            </div>
            <div class="tree-item" :class="{ selected: selectedOu === 'Kabwe' }" @click="selectOu('Kabwe')">
              <span class="spacer"></span>
              <i class="fas fa-building"></i>
              <span>Kabwe</span>
            </div>
            <div class="tree-item" :class="{ selected: selectedOu === 'Ndola' }" @click="selectOu('Ndola')">
              <span class="spacer"></span>
              <i class="fas fa-building"></i>
              <span>Ndola</span>
            </div>
          </div>
        </div>
      </div>
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
            <button class="period-nav" @click="prevPeriod"><i class="fas fa-chevron-left"></i></button>
            <select v-model="selectedPeriod" class="dhis-select period-select">
              <option value="" disabled>Select Period</option>
              <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
            <button class="period-nav" @click="nextPeriod"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <!-- Data Entry Table -->
      <div class="data-entry-area" v-if="selectedOu && selectedDataSet && selectedPeriod">
        <div class="form-header">
          <h3>{{ getDataSetName(selectedDataSet) }} - {{ getPeriodName(selectedPeriod) }}</h3>
          <div class="sync-status" v-if="syncStatus">
            <span v-if="syncStatus === 'syncing'" class="status-syncing"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
            <span v-if="syncStatus === 'saved'" class="status-saved"><i class="fas fa-check"></i> Saved</span>
            <span v-if="syncStatus === 'error'" class="status-error"><i class="fas fa-exclamation-circle"></i> Error saving</span>
          </div>
          <div class="form-actions">
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
                    <input 
                      type="number" 
                      v-model="dataValues[`${element.id}-${cat.id}`]"
                      @focus="handleFocus($event)"
                      @blur="handleBlur($event, element.id, cat.id)"
                      :class="{ 'has-value': dataValues[`${element.id}-${cat.id}`] }"
                    />
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

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-content">
          <i class="fas fa-arrow-up"></i>
          <h3>Please select Organisation Unit, Data Set, and Period</h3>
          <p>Use the controls above to start entering data.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useToast } from '../composables/useToast.js';
import { db } from '../firebase/config.js';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';

const { success, info, error } = useToast();

// State
const selectedOu = ref('');
const selectedDataSet = ref('');
const selectedPeriod = ref('');
const ouSearch = ref('');
const expanded = reactive({ 'Zambia': true });
const dataValues = reactive({});
const loading = ref(false);
const saving = ref(false);

// System Data Sets (Mapped to TKP Forms)
const dataSets = [
  { id: 'initial-referral', name: 'Initial Child Referral Reporting' },
  { id: 'child-overview', name: 'Child Overview & Enrollment Reporting' },
  { id: 'initial-assessment', name: 'Initial Assessment Reporting' },
  { id: 'medical-intake', name: 'Medical Intake Reporting' },
  { id: 'care-plan', name: 'Care Plan Summary Reporting' },
  { id: 'program-summary', name: 'Program Summary (Monthly)' }
];

// Dynamic Periods (Last 12 months)
const periods = computed(() => {
  const months = [];
  const date = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    const id = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
    const name = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    months.push({ id, name });
  }
  return months;
});

const categoryOptions = [
  { id: 'default', name: 'Value' }
];

// Data Elements Definition
const dataElementsMap = {
  'initial-referral': [
    { id: 'sec1', name: 'Referral Statistics', isSection: true },
    { id: 'ref_total', name: 'Total Referrals Received' },
    { id: 'ref_male', name: 'Referrals - Male' },
    { id: 'ref_female', name: 'Referrals - Female' },
    { id: 'ref_urgent', name: 'Urgent Referrals' },
    { id: 'ref_processed', name: 'Referrals Processed/Admitted' }
  ],
  'child-overview': [
    { id: 'sec1', name: 'Enrollment Statistics', isSection: true },
    { id: 'enr_total', name: 'New Enrollments' },
    { id: 'enr_male', name: 'New Enrollments - Male' },
    { id: 'enr_female', name: 'New Enrollments - Female' },
    { id: 'enr_reintegration', name: 'Re-integrations' },
    { id: 'enr_dropout', name: 'Dropouts/Exits' }
  ],
  'initial-assessment': [
    { id: 'sec1', name: 'Assessment Activities', isSection: true },
    { id: 'asm_total', name: 'Initial Assessments Completed' },
    { id: 'asm_pending', name: 'Assessments Pending' },
    { id: 'asm_high_risk', name: 'High Risk Cases Identified' }
  ],
  'medical-intake': [
    { id: 'sec1', name: 'Medical Statistics', isSection: true },
    { id: 'med_screened', name: 'Children Screened' },
    { id: 'med_referrals', name: 'Medical Referrals Made' },
    { id: 'med_chronic', name: 'Chronic Conditions Identified' },
    { id: 'med_treatment', name: 'Children on Treatment' }
  ],
  'care-plan': [
    { id: 'sec1', name: 'Care Planning', isSection: true },
    { id: 'cp_created', name: 'New Care Plans Created' },
    { id: 'cp_reviewed', name: 'Care Plans Reviewed' },
    { id: 'cp_completed', name: 'Care Plan Goals Achieved' }
  ],
  'program-summary': [
    { id: 'sec1', name: 'Overall Program Stats', isSection: true },
    { id: 'prog_active', name: 'Total Active Children' },
    { id: 'prog_activities', name: 'Program Activities Conducted' },
    { id: 'prog_meals', name: 'Meals Served' },
    { id: 'prog_attendance', name: 'Average Attendance' }
  ]
};

const dataElements = computed(() => {
  return dataElementsMap[selectedDataSet.value] || [];
});

// Methods
const selectOu = (ou) => {
  selectedOu.value = ou;
  loadData();
};

const toggleExpand = (ou) => {
  expanded[ou] = !expanded[ou];
};

const getDataSetName = (id) => {
  const ds = dataSets.find(d => d.id === id);
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
  // Clear current values
  Object.keys(dataValues).forEach(key => delete dataValues[key]);
  
  try {
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
  } catch (err) {
    console.error("Error loading data:", err);
    error("Failed to load data");
  } finally {
    loading.value = false;
  }
};

// Save Data to Firestore
const saveDataValue = async (elementId, catId, value) => {
  if (!selectedOu.value || !selectedDataSet.value || !selectedPeriod.value) return;
  
  saving.value = true;
  syncStatus.value = 'syncing';
  
  try {
    const docId = `${selectedOu.value}_${selectedDataSet.value}_${selectedPeriod.value}`;
    const docRef = doc(db, 'aggregate_data', docId);
    
    // Create the key for this value
    const valueKey = `${elementId}-${catId}`;
    
    // Update local state first
    dataValues[valueKey] = value;
    
    // Prepare update object
    const updateData = {
      orgUnit: selectedOu.value,
      dataSet: selectedDataSet.value,
      period: selectedPeriod.value,
      updatedAt: new Date(),
      [`values.${valueKey}`]: value
    };
    
    // Use setDoc with merge to create or update
    await setDoc(docRef, updateData, { merge: true });
    
    syncStatus.value = 'saved';
    lastSavedTime.value = new Date();
    console.log(`Saved ${value} for ${valueKey}`);
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
onMounted(() => {
  // Set default period to current month
  if (periods.value.length > 0) {
    selectedPeriod.value = periods.value[0].id;
  }
  
  // Set default OU
  selectedOu.value = 'Lusaka';
  
  // Set default Data Set
  if (dataSets.length > 0) {
    selectedDataSet.value = dataSets[0].id;
  }
  
  // Load data
  loadData();
});
</script>

<style scoped>
.aggregate-data-entry {
  display: flex;
  height: calc(100vh - 48px); /* Subtract header height */
  background: #f3f5f7;
  font-family: 'Roboto', sans-serif;
}

/* Sidebar */
.org-unit-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #d5dce5;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #2c6693;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
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

.tree-item {
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 0.9rem;
  transition: background 0.1s;
}

.tree-item:hover {
  background: #f0f5f9;
}

.tree-item.selected {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}

.tree-item i {
  color: #757575;
  width: 16px;
  text-align: center;
}

.tree-item.selected i {
  color: #1976d2;
}

.spacer {
  width: 16px;
  display: inline-block;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.selection-bar {
  background: white;
  padding: 12px 24px;
  border-bottom: 1px solid #d5dce5;
  display: flex;
  gap: 24px;
  align-items: flex-end;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
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

.period-nav:hover {
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
}

.dhis-table th,
.dhis-table td {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
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
  width: 150px;
  text-align: center !important;
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

.input-cell input {
  width: 100%;
  height: 100%;
  border: none;
  padding: 0 12px;
  font-size: 0.95rem;
  text-align: center;
  outline: none;
  transition: background 0.2s;
}

.input-cell input:focus {
  background: #e3f2fd;
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

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  text-align: center;
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

@media (max-width: 768px) {
  .aggregate-data-entry {
    flex-direction: column;
  }

  .org-unit-sidebar {
    width: 100%;
    height: auto;
    max-height: 30vh;
    border-right: none;
    border-bottom: 1px solid #d5dce5;
    display: none; /* Hide sidebar on mobile by default */
  }

  .selection-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 12px;
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
    padding: 12px;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    width: 100%;
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    overflow-x: auto;
  }
}
</style>
