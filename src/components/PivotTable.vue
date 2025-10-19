<template>
  <div class="pivot-table-component">
    <!-- Available Fields Sidebar -->
    <div class="available-fields-sidebar">
      <div class="fields-header">
        <h4>📋 Available Fields</h4>
        <p class="fields-hint">Drag to configure</p>
      </div>
      
      <!-- Dimensions -->
      <div class="fields-group">
        <h5 class="group-title">Dimensions</h5>
        <div class="field-list">
          <div 
            v-for="field in dimensionFields" 
            :key="field.id"
            class="draggable-field"
            draggable="true"
            @dragstart="startDrag($event, field)">
            <div class="field-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              </svg>
            </div>
            <span class="field-label">{{ field.name }}</span>
            <div class="drag-handle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="5" r="1"/>
                <circle cx="9" cy="12" r="1"/>
                <circle cx="9" cy="19" r="1"/>
                <circle cx="15" cy="5" r="1"/>
                <circle cx="15" cy="12" r="1"/>
                <circle cx="15" cy="19" r="1"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Values -->
      <div class="fields-group">
        <h5 class="group-title">Values</h5>
        <div class="field-list">
          <div 
            v-for="field in valueFields" 
            :key="field.id"
            class="draggable-field value-field"
            draggable="true"
            @dragstart="startDrag($event, field)">
            <div class="field-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="22"/>
                <line x1="17" y1="5" x2="9" y2="19"/>
              </svg>
            </div>
            <span class="field-label">{{ field.name }}</span>
            <div class="drag-handle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="5" r="1"/>
                <circle cx="9" cy="12" r="1"/>
                <circle cx="9" cy="19" r="1"/>
                <circle cx="15" cy="5" r="1"/>
                <circle cx="15" cy="12" r="1"/>
                <circle cx="15" cy="19" r="1"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="pivot-main-content">
      <!-- Configuration Panel -->
      <div class="pivot-config-panel">
      <div class="config-sections">
        <!-- Rows Section -->
        <div class="config-section">
          <div class="config-header">
            <h4>📊 Rows</h4>
            <span class="config-hint">Drag fields here</span>
          </div>
          <div 
            class="drag-area rows"
            @drop="dropField($event, 'rows')" 
            @dragover.prevent="addDragOverClass($event)"
            @dragenter.prevent="addDragOverClass($event)"
            @dragleave="removeDragOverClass($event)">
            <div 
              v-for="field in config.rows" 
              :key="'row-' + field.id" 
              class="pivot-field">
              <div class="field-content">
                <div class="field-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                </div>
                <span class="field-name">{{ field.name }}</span>
              </div>
              <button @click="removeField('rows', field.id)" class="remove-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div v-if="config.rows.length === 0" class="drop-placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 5v14m7-7H5"/>
              </svg>
              <span>Drop fields here</span>
            </div>
          </div>
        </div>

        <!-- Columns Section -->
        <div class="config-section">
          <div class="config-header">
            <h4>📈 Columns</h4>
            <span class="config-hint">Drag fields here</span>
          </div>
          <div 
            class="drag-area columns"
            @drop="dropField($event, 'columns')" 
            @dragover.prevent="addDragOverClass($event)"
            @dragenter.prevent="addDragOverClass($event)"
            @dragleave="removeDragOverClass($event)">
            <div 
              v-for="field in config.columns" 
              :key="'col-' + field.id" 
              class="pivot-field">
              <div class="field-content">
                <div class="field-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                </div>
                <span class="field-name">{{ field.name }}</span>
              </div>
              <button @click="removeField('columns', field.id)" class="remove-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div v-if="config.columns.length === 0" class="drop-placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 5v14m7-7H5"/>
              </svg>
              <span>Drop fields here</span>
            </div>
          </div>
        </div>

        <!-- Values Section -->
        <div class="config-section">
          <div class="config-header">
            <h4>📊 Values</h4>
            <span class="config-hint">Drag values here</span>
          </div>
          <div 
            class="drag-area values"
            @drop="dropField($event, 'values')" 
            @dragover.prevent="addDragOverClass($event)"
            @dragenter.prevent="addDragOverClass($event)"
            @dragleave="removeDragOverClass($event)">
            <div 
              v-for="field in config.values" 
              :key="'val-' + field.id" 
              class="pivot-field">
              <div class="field-content">
                <div class="field-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="2" x2="12" y2="22"/>
                    <line x1="17" y1="5" x2="9" y2="19"/>
                  </svg>
                </div>
                <span class="field-name">{{ field.name }}</span>
                <select v-model="field.aggregation" class="aggregation-select" @change="$emit('update')">
                  <option value="sum">Sum</option>
                  <option value="count">Count</option>
                  <option value="avg">Average</option>
                  <option value="min">Min</option>
                  <option value="max">Max</option>
                </select>
              </div>
              <button @click="removeField('values', field.id)" class="remove-field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div v-if="config.values.length === 0" class="drop-placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 5v14m7-7H5"/>
              </svg>
              <span>Drop values here</span>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- Results Table -->
      <div v-if="data.length > 0" class="pivot-results">
      <div class="results-header">
        <h4>📊 Pivot Table Results</h4>
        <div class="results-actions">
          <button @click="$emit('export')" class="export-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>
      <div class="pivot-table-wrapper">
        <table class="pivot-table">
          <thead>
            <tr>
              <th v-for="header in headers" :key="header.id">
                {{ header.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data" :key="row.id">
              <td v-for="(cell, index) in row.cells" :key="cell.id" :class="getCellClass(index)">
                {{ cell.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>

      <!-- Empty State -->
      <div v-else class="no-pivot-data">
      <div class="welcome-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="12" y1="3" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
        </svg>
      </div>
      <h4>Create Your Pivot Table</h4>
      <p>Drag fields to the configuration areas above to build your analysis.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

// Props
const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => ({
      rows: [],
      columns: [],
      values: []
    })
  },
  data: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  },
  availableFields: {
    type: Array,
    default: () => []
  }
})

// Computed - separate dimension and value fields
const dimensionFields = computed(() => {
  return props.availableFields.filter(field => field.type === 'dimension')
})

const valueFields = computed(() => {
  return props.availableFields.filter(field => field.type === 'value')
})

// Emits
const emit = defineEmits(['drop-field', 'remove-field', 'update', 'export'])

// Methods
const startDrag = (event, field) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(field))
  event.dataTransfer.effectAllowed = 'copy'
}

const dropField = (event, area) => {
  event.preventDefault()
  removeDragOverClass(event)
  emit('drop-field', event, area)
}

const removeField = (area, fieldId) => {
  emit('remove-field', area, fieldId)
}

const removeDragOverClass = (event) => {
  event.target.classList.remove('dragover')
}

const addDragOverClass = (event) => {
  event.target.classList.add('dragover')
}

const getCellClass = (index) => {
  if (index === 0) return 'dimension'
  if (index === props.headers.length - 1) return 'percentage'
  return 'value'
}
</script>

<style scoped>
.pivot-table-component {
  display: flex;
  gap: 1rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

/* Available Fields Sidebar */
.available-fields-sidebar {
  width: 240px;
  background: #f8f9fa;
  border-right: 1px solid #e5e7eb;
  padding: 1rem;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  flex-shrink: 0;
}

.fields-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.fields-header h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fields-hint {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.fields-group {
  margin-bottom: 1.5rem;
}

.group-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.draggable-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
}

.draggable-field:hover {
  border-color: #d1d5db;
  background: #f9fafb;
  transform: translateX(2px);
}

.draggable-field:active {
  cursor: grabbing;
}

.draggable-field .field-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #6c757d;
  color: white;
  border-radius: 4px;
  flex-shrink: 0;
}

.draggable-field.value-field .field-icon {
  background: #28a745;
}

.draggable-field .field-label {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

.draggable-field .drag-handle {
  opacity: 0.3;
  transition: opacity 0.2s ease;
}

.draggable-field:hover .drag-handle {
  opacity: 0.6;
}

/* Configuration Panel */
.pivot-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pivot-config-panel {
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
}

.config-sections {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.config-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.config-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.config-hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

.drag-area {
  min-height: 100px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  padding: 0.75rem;
  background: #f9fafb;
  overflow-y: auto;
  max-height: 250px;
}

.drag-area.dragover {
  border-color: #6c757d;
  background: #f3f4f6;
}

.pivot-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.pivot-field:hover {
  border-color: #d1d5db;
}

.field-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.field-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #6c757d;
  color: white;
  border-radius: 4px;
  flex-shrink: 0;
}

.field-name {
  font-weight: 500;
  color: #2c3e50;
  flex: 1;
}

.remove-field {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: background 0.2s ease;
}

.remove-field:hover {
  background: #c82333;
}

.drop-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 0.8125rem;
  text-align: center;
  min-height: 70px;
  gap: 0.5rem;
}

.drop-placeholder svg {
  opacity: 0.4;
}

.aggregation-select {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.75rem;
  background: white;
  color: #2c3e50;
  font-weight: 500;
}

.aggregation-select:focus {
  outline: none;
  border-color: #6c757d;
}

/* Results */
.pivot-results {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin: 1.5rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
}

.results-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-actions {
  display: flex;
  gap: 0.5rem;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
}

.pivot-table-wrapper {
  overflow: auto;
  max-height: 500px;
  background: white;
}

.pivot-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.pivot-table th,
.pivot-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.pivot-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  position: sticky;
  top: 0;
  z-index: 10;
}

.pivot-table tbody tr:hover {
  background: #f8f9fa;
}

.pivot-table tbody tr:last-child td {
  border-bottom: none;
}

.pivot-table td.dimension {
  font-weight: 500;
  color: #2c3e50;
}

.pivot-table td.value {
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.pivot-table td.percentage {
  font-weight: 600;
  color: #28a745;
  text-align: center;
}

/* Empty State */
.no-pivot-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #6b7280;
  text-align: center;
  background: #f9fafb;
  border-radius: 8px;
  gap: 1rem;
  margin: 1.5rem;
}

.welcome-icon {
  padding: 1.5rem;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-icon svg {
  opacity: 0.5;
  color: #6c757d;
}

.no-pivot-data h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.no-pivot-data p {
  margin: 0;
  line-height: 1.6;
  max-width: 450px;
  font-size: 0.9375rem;
  color: #6b7280;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .pivot-table-component {
    flex-direction: column;
  }

  .available-fields-sidebar {
    width: 100%;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .pivot-main-content {
    width: 100%;
  }

  .config-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .pivot-config-panel {
    padding: 1rem;
  }

  .config-section {
    padding: 0.875rem;
  }

  .config-header h4 {
    font-size: 0.8125rem;
  }

  .config-hint {
    display: none;
  }

  .drag-area {
    min-height: 80px;
    padding: 0.625rem;
    max-height: 200px;
  }

  .pivot-field {
    padding: 0.5rem 0.625rem;
    font-size: 0.8125rem;
  }

  .field-icon {
    width: 18px;
    height: 18px;
  }

  .results-header {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    align-items: stretch;
  }

  .export-btn {
    width: 100%;
    justify-content: center;
  }

  .pivot-table th,
  .pivot-table td {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .config-section {
    padding: 0.75rem;
  }

  .config-header h4 {
    font-size: 0.75rem;
  }

  .drag-area {
    min-height: 70px;
    padding: 0.5rem;
  }

  .pivot-field {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }

  .field-icon {
    width: 16px;
    height: 16px;
  }

  .remove-field {
    width: 20px;
    height: 20px;
  }

  .results-header h4 {
    font-size: 0.875rem;
  }

  .export-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.6875rem;
  }

  .pivot-table th,
  .pivot-table td {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
  }

  .no-pivot-data {
    padding: 1.5rem 0.75rem;
  }

  .no-pivot-data h4 {
    font-size: 1rem;
  }

  .no-pivot-data p {
    font-size: 0.8125rem;
  }
}
</style>
