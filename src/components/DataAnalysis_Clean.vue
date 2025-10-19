<template>
  <div class="data-analysis-pro">
    <!-- Header -->
    <div class="analytics-header">
      <div class="header-toolbar">
        <div class="app-title">
          <div class="title-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
          </div>
          <div class="title-text">
            <h1>Data Analytics</h1>
            <p class="subtitle">Professional data analysis and visualization</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="analytics-container">
      <!-- Data Explorer Sidebar -->
      <div class="data-explorer">
        <h3>Data Explorer</h3>
        <div class="dimensions-list">
          <div v-for="dimension in dimensions" :key="dimension.id" class="dimension-group">
            <button @click="toggleDimension(dimension)" class="dimension-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline :points="dimension.expanded ? '6,9 12,15 18,9' : '9,18 15,12 9,6'"/>
              </svg>
              <span>{{ dimension.name }}</span>
              <span class="item-count" v-if="dimension.selectedCount > 0">{{ dimension.selectedCount }}</span>
            </button>
            <div v-show="dimension.expanded" class="dimension-items">
              <label v-for="item in dimension.items" :key="item.id" class="dimension-item">
                <input type="checkbox" v-model="item.selected" @change="updateDimensionCount(dimension)">
                <span>{{ item.name }}</span>
                <span v-if="item.count > 0" class="count">({{ item.count }})</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Tab Navigation -->
        <div class="analysis-tabs">
          <button v-for="tab in analysisTabs" :key="tab.id" 
                  @click="setActiveTab(tab.id)" 
                  class="tab-btn"
                  :class="{ active: activeTab === tab.id }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path :d="tab.icon"/>
            </svg>
            {{ tab.name }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Pivot Table Tab -->
          <div v-if="activeTab === 'pivot'" class="pivot-panel">
            <div class="panel-header">
              <h3>Pivot Table</h3>
              <div class="panel-controls">
                <button @click="configurePivot" class="config-btn">Configure</button>
                <button @click="refreshPivot" class="refresh-btn">Refresh</button>
              </div>
            </div>
            
            <div class="pivot-content">
              <!-- Available Fields -->
              <div class="field-library">
                <h4>Available Fields</h4>
                <div class="field-list">
                  <div v-for="field in availablePivotFields" 
                       :key="field.id" 
                       class="field-item"
                       draggable="true"
                       @dragstart="startDrag($event, field)">
                    <span class="field-name">{{ field.name }}</span>
                    <span class="field-type">{{ field.type }}</span>
                  </div>
                </div>
              </div>

              <!-- Quick Start Templates -->
              <div class="pivot-templates" v-if="showPivotConfig">
                <h4>Quick Start Templates</h4>
                <div class="template-buttons">
                  <button @click="loadPivotTemplate('form-types')" class="template-btn">
                    Form Types Analysis
                  </button>
                  <button @click="clearPivotConfig" class="template-btn clear">
                    Clear All
                  </button>
                </div>
              </div>

              <!-- Configuration Sections -->
              <div class="pivot-config" v-if="showPivotConfig">
                <div class="config-sections">
                  <div class="config-section">
                    <div class="config-header">
                      <h4>Rows</h4>
                    </div>
                    <div class="drag-area rows" 
                         @drop="dropField($event, 'rows')" 
                         @dragover.prevent
                         @dragenter.prevent
                         @dragleave.prevent>
                      <div v-for="field in pivotConfig.rows" :key="field.id" class="pivot-field">
                        <span class="field-name">{{ field.name }}</span>
                        <button @click="removeField('rows', field.id)" class="remove-field">×</button>
                      </div>
                      <div v-if="pivotConfig.rows.length === 0" class="drop-placeholder">
                        <span>Drop fields here for rows</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="config-section">
                    <div class="config-header">
                      <h4>Values</h4>
                    </div>
                    <div class="drag-area values" 
                         @drop="dropField($event, 'values')" 
                         @dragover.prevent
                         @dragenter.prevent
                         @dragleave.prevent>
                      <div v-for="field in pivotConfig.values" :key="field.id" class="pivot-field">
                        <span class="field-name">{{ field.name }}</span>
                        <button @click="removeField('values', field.id)" class="remove-field">×</button>
                      </div>
                      <div v-if="pivotConfig.values.length === 0" class="drop-placeholder">
                        <span>Drop values here</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pivot Table Results -->
              <div class="pivot-results">
                <div v-if="pivotData.length > 0" class="results-content">
                  <div class="results-header">
                    <h4>Pivot Table Results</h4>
                  </div>
                  
                  <div class="pivot-table-wrapper">
                    <table class="pivot-table">
                      <thead>
                        <tr>
                          <th v-for="header in pivotHeaders" :key="header.id">
                            {{ header.name }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in pivotData" :key="row.id">
                          <td v-for="cell in row.cells" :key="cell.id">
                            {{ cell.value }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div v-else class="no-pivot-data">
                  <h4>Create Your Pivot Table</h4>
                  <p>Use the templates above or drag fields from the library to build your analysis</p>
                  <div class="quick-actions">
                    <button @click="loadPivotTemplate('form-types')" class="quick-action-btn">
                      Try Form Types Analysis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive data
const activeTab = ref('pivot')
const showPivotConfig = ref(true)

// Dimensions data
const dimensions = ref([
  {
    id: 'age_groups',
    name: 'Age Groups',
    expanded: false,
    selectedCount: 0,
    items: [
      { id: '0-2', name: '0-2 years', count: 0, selected: false },
      { id: '9-12', name: '9-12 years', count: 2, selected: false }
    ]
  },
  {
    id: 'form_types',
    name: 'Form Types',
    expanded: false,
    selectedCount: 0,
    items: [
      { id: 'initial-referral', name: 'Initial Referrals', count: 1, selected: false },
      { id: 'child-overview', name: 'Child Overviews', count: 1, selected: false }
    ]
  }
])

// Pivot table data
const availablePivotFields = ref([
  { id: 'age_groups', name: 'Age Groups', type: 'dimension' },
  { id: 'form_types', name: 'Form Types', type: 'dimension' },
  { id: 'count', name: 'Count', type: 'value' }
])

const pivotConfig = ref({
  rows: [],
  columns: [],
  values: []
})

const pivotData = ref([])
const pivotHeaders = ref([])

// Analysis tabs
const analysisTabs = ref([
  {
    id: 'pivot',
    name: 'Pivot Table',
    icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'
  }
])

// Methods
const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const toggleDimension = (dimension) => {
  dimension.expanded = !dimension.expanded
}

const updateDimensionCount = (dimension) => {
  dimension.selectedCount = dimension.items.filter(item => item.selected).length
}

const configurePivot = () => {
  showPivotConfig.value = !showPivotConfig.value
}

const refreshPivot = () => {
  generatePivotData()
}

const startDrag = (event, field) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(field))
}

const dropField = (event, area) => {
  event.preventDefault()
  const fieldData = JSON.parse(event.dataTransfer.getData('text/plain'))
  
  if (area === 'values' && fieldData.type === 'dimension') {
    fieldData.type = 'value'
    fieldData.aggregation = 'count'
  }
  
  pivotConfig.value[area].push({ ...fieldData })
  generatePivotData()
}

const removeField = (area, fieldId) => {
  const index = pivotConfig.value[area].findIndex(f => f.id === fieldId)
  if (index > -1) {
    pivotConfig.value[area].splice(index, 1)
    generatePivotData()
  }
}

const loadPivotTemplate = (templateId) => {
  if (templateId === 'form-types') {
    pivotConfig.value = {
      rows: [{ id: 'form_types', name: 'Form Types', type: 'dimension' }],
      columns: [],
      values: [{ id: 'count', name: 'Count', type: 'value', aggregation: 'count' }]
    }
    generatePivotData()
  }
}

const clearPivotConfig = () => {
  pivotConfig.value = {
    rows: [],
    columns: [],
    values: []
  }
  pivotData.value = []
  pivotHeaders.value = []
}

const generatePivotData = () => {
  if (pivotConfig.value.rows.length > 0 && pivotConfig.value.values.length > 0) {
    pivotHeaders.value = [
      { id: 'category', name: 'Category' },
      { id: 'count', name: 'Count' }
    ]
    
    pivotData.value = [
      {
        id: '1',
        cells: [
          { id: '1-1', value: 'Initial Referrals' },
          { id: '1-2', value: '1' }
        ]
      },
      {
        id: '2',
        cells: [
          { id: '2-1', value: 'Child Overviews' },
          { id: '2-2', value: '1' }
        ]
      }
    ]
  } else {
    pivotData.value = []
    pivotHeaders.value = []
  }
}
</script>

<style scoped>
.data-analysis-pro {
  min-height: 100vh;
  background: #f5f6fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.analytics-header {
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  padding: 1rem 2rem;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.title-text h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

.analytics-container {
  display: flex;
  min-height: calc(100vh - 100px);
}

.data-explorer {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e4e7;
  padding: 1rem;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.analysis-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #e0e4e7;
  padding: 0 1rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.tab-btn.active {
  color: #4A148C;
  border-bottom-color: #4A148C;
}

.tab-content {
  flex: 1;
  background: #f8fafc;
}

.pivot-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e0e4e7;
}

.panel-controls {
  display: flex;
  gap: 0.5rem;
}

.config-btn, .refresh-btn {
  padding: 0.5rem 1rem;
  background: #4A148C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.pivot-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-library {
  background: white;
  border: 1px solid #e0e4e7;
  border-radius: 8px;
  padding: 1rem;
}

.field-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e0e4e7;
  border-radius: 4px;
  cursor: move;
}

.pivot-templates {
  background: white;
  border: 1px solid #e0e4e7;
  border-radius: 8px;
  padding: 1rem;
}

.template-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.template-btn {
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 1px solid #e0e4e7;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.template-btn.clear {
  background: #fef2f2;
  color: #dc2626;
}

.pivot-config {
  background: white;
  border: 1px solid #e0e4e7;
  border-radius: 8px;
  padding: 1rem;
}

.config-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.config-section {
  border: 1px solid #e0e4e7;
  border-radius: 4px;
  padding: 1rem;
}

.drag-area {
  min-height: 80px;
  border: 2px dashed #d1d5db;
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.pivot-field {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e0e4e7;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.remove-field {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.drop-placeholder {
  text-align: center;
  color: #9ca3af;
  padding: 1rem;
}

.pivot-results {
  background: white;
  border: 1px solid #e0e4e7;
  border-radius: 8px;
  padding: 1rem;
}

.pivot-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.pivot-table th,
.pivot-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e4e7;
}

.pivot-table th {
  background: #f8fafc;
  font-weight: 600;
}

.no-pivot-data {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.quick-actions {
  margin-top: 1rem;
}

.quick-action-btn {
  padding: 0.75rem 1.5rem;
  background: #4A148C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.dimension-group {
  margin-bottom: 1rem;
}

.dimension-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.dimension-items {
  margin-left: 1rem;
  margin-top: 0.5rem;
}

.dimension-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  cursor: pointer;
}

.item-count {
  background: #4A148C;
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  font-size: 0.75rem;
  margin-left: auto;
}

.count {
  color: #6b7280;
  font-size: 0.75rem;
}
</style>