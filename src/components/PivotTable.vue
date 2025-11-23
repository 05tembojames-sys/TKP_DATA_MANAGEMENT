<template>
  <div class="dhis2-pivot-builder">
    <!-- Available Fields Sidebar -->
    <div class="builder-sidebar">
      <div class="sidebar-header">
        <h4>Available Dimensions</h4>
        <div class="search-box">
          <input type="text" placeholder="Search dimensions..." v-model="searchQuery" />
        </div>
      </div>
      
      <div class="fields-list">
        <div class="field-section">
          <h5 class="section-title">Dimensions</h5>
          <div 
            v-for="field in filteredDimensions" 
            :key="field.id"
            class="draggable-item"
            draggable="true"
            @dragstart="startDrag($event, field)"
          >
            <span class="drag-icon">⋮⋮</span>
            <span class="item-icon">📊</span>
            <span class="item-label">{{ field.name }}</span>
          </div>
        </div>
        
        <div class="field-section">
          <h5 class="section-title">Values</h5>
          <div 
            v-for="field in filteredValues" 
            :key="field.id"
            class="draggable-item value-item"
            draggable="true"
            @dragstart="startDrag($event, field)"
          >
            <span class="drag-icon">⋮⋮</span>
            <span class="item-icon">123</span>
            <span class="item-label">{{ field.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Configuration Area -->
    <div class="builder-main">
      <div class="layout-container">
        <!-- Columns -->
        <div class="layout-section columns-section">
          <div class="section-header">
            <span class="section-icon">➡️</span>
            <h4>Columns</h4>
          </div>
          <div 
            class="drop-zone"
            @drop="dropField($event, 'columns')" 
            @dragover.prevent="addDragOverClass($event)"
            @dragleave="removeDragOverClass($event)"
          >
            <div v-if="config.columns.length === 0" class="empty-placeholder">
              Drag dimensions here
            </div>
            <div 
              v-for="field in config.columns" 
              :key="'col-' + field.id" 
              class="dropped-item"
            >
              <span class="item-label">{{ field.name }}</span>
              <button @click="removeField('columns', field.id)" class="remove-btn">×</button>
            </div>
          </div>
        </div>

        <!-- Rows -->
        <div class="layout-section rows-section">
          <div class="section-header">
            <span class="section-icon">⬇️</span>
            <h4>Rows</h4>
          </div>
          <div 
            class="drop-zone"
            @drop="dropField($event, 'rows')" 
            @dragover.prevent="addDragOverClass($event)"
            @dragleave="removeDragOverClass($event)"
          >
            <div v-if="config.rows.length === 0" class="empty-placeholder">
              Drag dimensions here
            </div>
            <div 
              v-for="field in config.rows" 
              :key="'row-' + field.id" 
              class="dropped-item"
            >
              <span class="item-label">{{ field.name }}</span>
              <button @click="removeField('rows', field.id)" class="remove-btn">×</button>
            </div>
          </div>
        </div>

        <!-- Filter -->
        <div class="layout-section filter-section">
          <div class="section-header">
            <span class="section-icon">🔍</span>
            <h4>Filter</h4>
          </div>
          <div 
            class="drop-zone"
            @drop="dropField($event, 'filters')" 
            @dragover.prevent="addDragOverClass($event)"
            @dragleave="removeDragOverClass($event)"
          >
            <div v-if="config.filters && config.filters.length === 0" class="empty-placeholder">
              Drag dimensions here
            </div>
            <div 
              v-for="field in config.filters || []" 
              :key="'filter-' + field.id" 
              class="dropped-item"
            >
              <span class="item-label">{{ field.name }}</span>
              <button @click="removeField('filters', field.id)" class="remove-btn">×</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview / Results -->
      <div class="preview-area">
        <div class="preview-header">
          <h4>Preview</h4>
          <div class="actions">
            <button class="action-btn" @click="$emit('update')">Update</button>
          </div>
        </div>
        <div class="preview-content">
          <div v-if="!hasData" class="no-data">
            <div class="icon">▦</div>
            <p>Configure the layout and click Update to generate the table.</p>
          </div>
          <div v-else class="table-responsive">
            <table class="dhis2-table">
              <thead>
                <tr>
                  <th v-for="header in headers" :key="header.id">{{ header.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data" :key="row.id">
                  <td v-for="(cell, idx) in row.cells" :key="idx" :class="{ 'row-header': idx === 0 }">
                    {{ cell.value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => ({ rows: [], columns: [], filters: [] })
  },
  availableFields: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['drop-field', 'remove-field', 'update']);

const searchQuery = ref('');

const filteredDimensions = computed(() => {
  return props.availableFields
    .filter(f => f.type === 'dimension')
    .filter(f => f.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const filteredValues = computed(() => {
  return props.availableFields
    .filter(f => f.type === 'value')
    .filter(f => f.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const hasData = computed(() => props.data && props.data.length > 0);

const startDrag = (event, field) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(field));
  event.dataTransfer.effectAllowed = 'copy';
};

const dropField = (event, area) => {
  event.preventDefault();
  removeDragOverClass(event);
  emit('drop-field', event, area);
};

const removeField = (area, fieldId) => {
  emit('remove-field', area, fieldId);
};

const addDragOverClass = (event) => {
  event.currentTarget.classList.add('dragover');
};

const removeDragOverClass = (event) => {
  event.currentTarget.classList.remove('dragover');
};
</script>

<style scoped>
.dhis2-pivot-builder {
  display: flex;
  height: 100%;
  background: #f3f5f7;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  overflow: hidden;
}

/* Sidebar */
.builder-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.sidebar-header h4 {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: #212121;
}

.search-box input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-size: 0.85rem;
}

.fields-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #616161;
  margin: 12px 0 8px 0;
  font-weight: 600;
}

.draggable-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  margin-bottom: 4px;
  cursor: grab;
  font-size: 0.85rem;
  color: #212121;
  transition: all 0.2s;
}

.draggable-item:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.drag-icon {
  color: #bdbdbd;
  margin-right: 6px;
  cursor: grab;
}

.item-icon {
  margin-right: 8px;
  font-size: 1rem;
}

.value-item .item-icon {
  color: #2b6693;
}

/* Main Area */
.builder-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.layout-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.layout-section {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.section-header {
  padding: 8px 12px;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header h4 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #494949;
}

.drop-zone {
  padding: 8px;
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  transition: background 0.2s;
}

.drop-zone.dragover {
  background: #e8f1f8;
  border: 1px dashed #2b6693;
}

.empty-placeholder {
  color: #bdbdbd;
  font-size: 0.8rem;
  text-align: center;
  padding: 20px 0;
  font-style: italic;
}

.dropped-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 12px;
  margin-bottom: 4px;
  font-size: 0.8rem;
  color: #0d47a1;
}

.remove-btn {
  background: none;
  border: none;
  color: #0d47a1;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0 4px;
}

.remove-btn:hover {
  color: #d32f2f;
}

/* Preview Area */
.preview-area {
  flex: 1;
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #212121;
}

.action-btn {
  background: #2b6693;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.85rem;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #757575;
}

.no-data .icon {
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.3;
}

/* Table Styles */
.dhis2-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.dhis2-table th {
  background: #f3f5f7;
  padding: 10px;
  border: 1px solid #d5d5d5;
  text-align: left;
  font-weight: 600;
  color: #212121;
}

.dhis2-table td {
  padding: 8px;
  border: 1px solid #e0e0e0;
  color: #212121;
}

.dhis2-table td.row-header {
  background: #fafafa;
  font-weight: 500;
}
</style>
