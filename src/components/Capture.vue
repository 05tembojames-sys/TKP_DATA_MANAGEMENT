<template>
  <div class="capture-container">
    <!-- Header -->
    <div class="capture-header">
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
        <h1 class="capture-title">Data Capture</h1>
      </div>
      <div class="header-right">
        <button @click="saveData" class="save-button" :disabled="!hasUnsavedChanges">
          Save
        </button>
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

    <!-- Main Content -->
    <div class="capture-content">
      <!-- Selection Panel -->
      <div class="selection-panel">
        <div class="selection-grid">
          <!-- Data Set Selection -->
          <div class="selection-item">
            <label class="selection-label">Data Set</label>
            <select v-model="selectedDataSet" @change="onDataSetChange" class="selection-dropdown">
              <option value="">Select Data Set</option>
              <option v-for="dataSet in dataSets" :key="dataSet.id" :value="dataSet.id">
                {{ dataSet.name }}
              </option>
            </select>
          </div>

          <!-- Organisation Unit Selection -->
          <div class="selection-item">
            <label class="selection-label">Organisation Unit</label>
            <select v-model="selectedOrgUnit" @change="onOrgUnitChange" class="selection-dropdown">
              <option value="">Select Organisation Unit</option>
              <option v-for="orgUnit in orgUnits" :key="orgUnit.id" :value="orgUnit.id">
                {{ orgUnit.name }}
              </option>
            </select>
          </div>

          <!-- Period Selection -->
          <div class="selection-item">
            <label class="selection-label">Period</label>
            <select v-model="selectedPeriod" @change="onPeriodChange" class="selection-dropdown">
              <option value="">Select Period</option>
              <option v-for="period in periods" :key="period.id" :value="period.id">
                {{ period.name }}
              </option>
            </select>
          </div>

          <!-- Form Selection (from saved forms) -->
          <div class="selection-item" v-if="forms.length > 0">
            <label class="selection-label">Form</label>
            <select v-model="selectedFormId" class="selection-dropdown">
              <option value="">Select Form</option>
              <option v-for="form in forms" :key="form.id" :value="form.id">
                {{ formatFormOption(form) }}
              </option>
            </select>
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
        <div class="status-bar" v-if="selectedDataSet && selectedOrgUnit && selectedPeriod">
          <div class="status-info">
            <span class="status-label">Selected:</span>
            <span class="status-value">{{ getSelectedDataSetName() }} - {{ getSelectedOrgUnitName() }} - {{ getSelectedPeriodName() }}</span>
          </div>
          <div class="status-completion" v-if="completionStatus">
            <span class="completion-label">Completion:</span>
            <span class="completion-percentage" :class="getCompletionClass()">{{ completionStatus }}%</span>
          </div>
        </div>
      </div>

      <!-- Data Entry Section -->
      <div class="data-entry-section" v-if="showDataEntry">
        <div class="data-entry-header">
          <h2>{{ selectedDataSetName }} - Data Entry</h2>
          <div class="entry-actions">
            <button @click="validateData" class="validate-button">Validate</button>
            <button @click="clearData" class="clear-button">Clear</button>
          </div>
        </div>

        <!-- Data Entry Form -->
        <div class="data-entry-form">
          <div class="form-sections">
            <div v-for="section in formSections" :key="section.id" class="form-section">
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
                    @input="onDataValueChange(element.id, $event.target.value)"
                    class="element-input"
                    :placeholder="element.placeholder || '0'"
                  />
                  
                  <!-- Text Input -->
                  <input 
                    v-else-if="element.valueType === 'TEXT'"
                    type="text" 
                    v-model="dataValues[element.id]"
                    @input="onDataValueChange(element.id, $event.target.value)"
                    class="element-input"
                    :placeholder="element.placeholder || 'Enter text'"
                  />
                  
                  <!-- Date Input -->
                  <input 
                    v-else-if="element.valueType === 'DATE'"
                    type="date" 
                    v-model="dataValues[element.id]"
                    @change="onDataValueChange(element.id, $event.target.value)"
                    class="element-input"
                  />
                  
                  <!-- Select/Dropdown -->
                  <select 
                    v-else-if="element.valueType === 'SELECT'"
                    v-model="dataValues[element.id]"
                    @change="onDataValueChange(element.id, $event.target.value)"
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
                  <div v-else-if="element.valueType === 'BOOLEAN'" class="checkbox-container">
                    <input 
                      type="checkbox" 
                      v-model="dataValues[element.id]"
                      @change="onDataValueChange(element.id, $event.target.checked)"
                      class="element-checkbox"
                      :id="element.id"
                    />
                    <label :for="element.id" class="checkbox-label">Yes</label>
                  </div>

                  <!-- Validation Error -->
                  <div v-if="validationErrors[element.id]" class="validation-error">
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
          </div>
          <div class="footer-right">
            <button @click="saveAsDraft" class="draft-button">Save as Draft</button>
            <button @click="completeEntry" class="complete-button" :disabled="!isValid">
              Complete
            </button>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-if="!showDataEntry && (selectedDataSet && selectedOrgUnit && selectedPeriod)" class="no-data-message">
        <div class="no-data-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
          <h3>No Data Entry Form Available</h3>
          <p>Click "Load" to load the data entry form for the selected criteria.</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import CaptureService from '../services/captureService.js'
import FormService from '../services/formService.js'
import AuthService from '../services/auth.js'

const router = useRouter()

// Reactive data
const selectedDataSet = ref('')
const selectedOrgUnit = ref('')
const selectedPeriod = ref('')
const showDataEntry = ref(false)
const loading = ref(false)
const loadingMessage = ref('')
const hasUnsavedChanges = ref(false)
const lastSaved = ref(null)
const completionStatus = ref(0)
const isValid = ref(false)

// Data arrays
const dataSets = ref([])
const orgUnits = ref([])
const periods = ref([])
const formSections = ref([])
const dataValues = ref({})
const validationErrors = ref({})
const forms = ref([])
const selectedFormId = ref('')

// Computed properties
const selectedDataSetName = computed(() => {
  const dataSet = dataSets.value.find(ds => ds.id === selectedDataSet.value)
  return dataSet ? dataSet.name : ''
})

const canLoadData = computed(() => {
  return selectedDataSet.value && selectedOrgUnit.value && selectedPeriod.value
})

// Methods
const goBack = () => {
  if (hasUnsavedChanges.value) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      router.push('/dashboard')
    }
  } else {
    router.push('/dashboard')
  }
}

const handleLogout = async () => {
  if (hasUnsavedChanges.value) {
    if (!confirm('You have unsaved changes. Are you sure you want to logout?')) {
      return
    }
  }
  const result = await AuthService.logout()
  if (result.success) {
    router.push('/login')
  }
}

const onDataSetChange = async () => {
  showDataEntry.value = false
  clearDataValues()
  selectedFormId.value = ''
  await loadFormsForSelectedDataSet()
}

const onOrgUnitChange = () => {
  showDataEntry.value = false
  clearDataValues()
}

const onPeriodChange = () => {
  showDataEntry.value = false
  clearDataValues()
}

const loadDataEntry = async () => {
  loading.value = true
  loadingMessage.value = 'Loading data entry form...'
  
  try {
    const formData = await CaptureService.loadDataEntryForm({
      dataSetId: selectedDataSet.value,
      orgUnitId: selectedOrgUnit.value,
      periodId: selectedPeriod.value
    })
    
    formSections.value = formData.sections

    // If a specific saved form is selected, load its values from Forms collection
    if (selectedFormId.value) {
      const result = await FormService.getFormById(selectedFormId.value)
      if (result.success) {
        // Exclude metadata fields not part of data elements
        const { id, formType, createdAt, updatedAt, status, ...rest } = result.form
        dataValues.value = rest || {}
      } else {
        dataValues.value = formData.dataValues || {}
      }
    } else {
      dataValues.value = formData.dataValues || {}
    }

    updateCompletionStatus()
    completionStatus.value = formData.completionStatus || completionStatus.value
    showDataEntry.value = true
    
  } catch (error) {
    console.error('Error loading data entry form:', error)
    alert('Failed to load data entry form')
  } finally {
    loading.value = false
  }
}

const onDataValueChange = (elementId, value) => {
  dataValues.value[elementId] = value
  hasUnsavedChanges.value = true
  
  // Clear validation error for this element
  if (validationErrors.value[elementId]) {
    delete validationErrors.value[elementId]
  }
  
  updateCompletionStatus()
}

const updateCompletionStatus = () => {
  const allElementIds = formSections.value.flatMap(section => section.dataElements.map(de => de.id))
  const totalElements = allElementIds.length
  const filledElements = allElementIds.filter(id => {
    const v = dataValues.value[id]
    return v !== '' && v !== null && v !== undefined
  }).length
  completionStatus.value = totalElements > 0 ? Math.round((filledElements / totalElements) * 100) : 0
}

const validateData = () => {
  validationErrors.value = {}
  let valid = true
  
  formSections.value.forEach(section => {
    section.dataElements.forEach(element => {
      const value = dataValues.value[element.id]
      
      // Required field validation
      if (element.required && (!value || value === '')) {
        validationErrors.value[element.id] = 'This field is required'
        valid = false
      }
      
      // Number validation
      if (element.valueType === 'NUMBER' && value && isNaN(value)) {
        validationErrors.value[element.id] = 'Please enter a valid number'
        valid = false
      }
      
      // Range validation
      if (element.valueType === 'NUMBER' && value) {
        if (element.min !== undefined && value < element.min) {
          validationErrors.value[element.id] = `Value must be at least ${element.min}`
          valid = false
        }
        if (element.max !== undefined && value > element.max) {
          validationErrors.value[element.id] = `Value must be at most ${element.max}`
          valid = false
        }
      }
    })
  })
  
  isValid.value = valid
  
  if (valid) {
    alert('Data validation passed!')
  } else {
    alert('Please fix the validation errors before proceeding')
  }
}

const saveData = async () => {
  loading.value = true
  loadingMessage.value = 'Saving data...'
  
  try {
    await CaptureService.saveDataValues({
      dataSetId: selectedDataSet.value,
      orgUnitId: selectedOrgUnit.value,
      periodId: selectedPeriod.value,
      dataValues: dataValues.value
    })
    
    hasUnsavedChanges.value = false
    lastSaved.value = new Date()
    alert('Data saved successfully!')
    
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Failed to save data')
  } finally {
    loading.value = false
  }
}

const saveAsDraft = async () => {
  loading.value = true
  loadingMessage.value = 'Saving as draft...'
  
  try {
    await CaptureService.saveAsDraft({
      dataSetId: selectedDataSet.value,
      orgUnitId: selectedOrgUnit.value,
      periodId: selectedPeriod.value,
      dataValues: dataValues.value
    })
    
    hasUnsavedChanges.value = false
    lastSaved.value = new Date()
    alert('Draft saved successfully!')
    
  } catch (error) {
    console.error('Error saving draft:', error)
    alert('Failed to save draft')
  } finally {
    loading.value = false
  }
}

const completeEntry = async () => {
  validateData()
  
  if (!isValid.value) {
    return
  }
  
  loading.value = true
  loadingMessage.value = 'Completing data entry...'
  
  try {
    await CaptureService.completeDataEntry({
      dataSetId: selectedDataSet.value,
      orgUnitId: selectedOrgUnit.value,
      periodId: selectedPeriod.value,
      dataValues: dataValues.value
    })
    
    hasUnsavedChanges.value = false
    lastSaved.value = new Date()
    completionStatus.value = 100
    alert('Data entry completed successfully!')
    
  } catch (error) {
    console.error('Error completing data entry:', error)
    alert('Failed to complete data entry')
  } finally {
    loading.value = false
  }
}

const clearData = () => {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    clearDataValues()
    hasUnsavedChanges.value = false
    completionStatus.value = 0
  }
}

const clearDataValues = () => {
  dataValues.value = {}
  validationErrors.value = {}
  updateCompletionStatus()
}

const getSelectedDataSetName = () => {
  const dataSet = dataSets.value.find(ds => ds.id === selectedDataSet.value)
  return dataSet ? dataSet.name : ''
}

const getSelectedOrgUnitName = () => {
  const orgUnit = orgUnits.value.find(ou => ou.id === selectedOrgUnit.value)
  return orgUnit ? orgUnit.name : ''
}

const getSelectedPeriodName = () => {
  const period = periods.value.find(p => p.id === selectedPeriod.value)
  return period ? period.name : ''
}

const getCompletionClass = () => {
  if (completionStatus.value === 100) return 'completion-complete'
  if (completionStatus.value >= 50) return 'completion-partial'
  return 'completion-low'
}

const formatDate = (date) => {
  return date.toLocaleString()
}

const formatFormOption = (form) => {
  const d = form.createdAt?.toDate ? form.createdAt.toDate() : (form.createdAt ? new Date(form.createdAt) : null)
  const dateStr = d ? d.toLocaleDateString() : 'Unknown date'
  const name = form.childFirstName || form.childSurname || form.childLastName || 'Unnamed'
  return `${name} • ${dateStr}`
}

// Initialize component
onMounted(async () => {
  loading.value = true
  loadingMessage.value = 'Loading capture interface...'
  
  try {
    const [dataSetsData, orgUnitsData, periodsData] = await Promise.all([
      CaptureService.getDataSets(),
      CaptureService.getOrgUnits(),
      CaptureService.getPeriods()
    ])
    
    dataSets.value = dataSetsData
    orgUnits.value = orgUnitsData
    periods.value = periodsData
    
    if (selectedDataSet.value) {
      await loadFormsForSelectedDataSet()
    }
  } catch (error) {
    console.error('Error initializing capture interface:', error)
    alert('Failed to load capture interface')
  } finally {
    loading.value = false
  }
})

// Load forms for the selected dataset from Forms collection
const loadFormsForSelectedDataSet = async () => {
  if (!selectedDataSet.value) {
    forms.value = []
    return
  }
  try {
    const result = await FormService.getForms(selectedDataSet.value, 50)
    forms.value = result.success ? result.forms : []
  } catch (e) {
    forms.value = []
  }
}

// Watch for unsaved changes
watch(dataValues, () => {
  hasUnsavedChanges.value = true
}, { deep: true })
</script>

<style scoped>
.capture-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.capture-header {
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

.back-button,
.logout-button {
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

.back-button:hover,
.logout-button:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.logout-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

.logout-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
}

.selection-dropdown:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
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

.status-label, .completion-label {
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.element-input {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.element-input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.element-checkbox {
  width: 1rem;
  height: 1rem;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #495057;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  background: rgba(0,0,0,0.5);
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
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  margin: 0;
  color: #495057;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .capture-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
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
    flex-wrap: wrap;
  }

  .back-button,
  .logout-button,
  .save-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .capture-content {
    padding: 1rem;
  }

  .selection-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .data-elements-grid {
    grid-template-columns: 1fr;
  }

  .data-entry-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .data-entry-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .footer-right {
    width: 100%;
    justify-content: flex-start;
  }

  .status-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
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
  .save-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    width: 100%;
    justify-content: center;
  }

  .header-right {
    flex-direction: column;
  }

  .selection-dropdown,
  .element-input {
    font-size: 0.875rem;
  }

  .load-button,
  .validate-button,
  .clear-button,
  .draft-button,
  .complete-button {
    width: 100%;
    padding: 0.75rem;
  }
}
</style>