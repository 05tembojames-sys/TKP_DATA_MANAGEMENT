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

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .dhis2-pivot-builder {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  /* Sidebar becomes horizontal accordion on tablet */
  .builder-sidebar {
    width: 100%;
    max-height: 400px;
    border-right: none;
    border-bottom: 1px solid #d5d5d5;
  }

  .sidebar-header {
    padding: 10px;
  }

  .sidebar-header h4 {
    font-size: 0.85rem;
  }

  .search-box input {
    padding: 8px;
    font-size: 16px; /* Prevent iOS zoom */
  }

  .fields-list {
    padding: 10px;
    max-height: 300px;
  }

  .draggable-item {
    padding: 10px 8px;
    margin-bottom: 6px;
    font-size: 0.9rem;
    /* Larger touch targets */
    min-height: 44px;
  }

  .section-title {
    font-size: 0.8rem;
    margin: 10px 0 6px 0;
  }

  /* Main area adjustments */
  .builder-main {
    padding: 12px;
  }

  .layout-container {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .layout-section {
    min-height: auto;
  }

  .section-header {
    padding: 10px 12px;
  }

  .section-header h4 {
    font-size: 0.9rem;
  }

  .drop-zone {
    min-height: 80px;
    max-height: 150px;
    padding: 10px;
  }

  .empty-placeholder {
    padding: 15px 0;
    font-size: 0.85rem;
  }

  .dropped-item {
    padding: 8px 10px;
    margin-bottom: 6px;
    font-size: 0.85rem;
    /* Larger touch targets */
    min-height: 40px;
  }

  .remove-btn {
    font-size: 1.2rem;
    padding: 0 8px;
    /* Larger touch target */
    min-width: 32px;
    min-height: 32px;
  }

  /* Preview area */
  .preview-area {
    min-height: 400px;
  }

  .preview-header {
    padding: 10px 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .preview-header h4 {
    font-size: 0.85rem;
  }

  .action-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-height: 40px;
  }

  .preview-content {
    padding: 12px;
  }

  /* Table responsive wrapper */
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dhis2-table {
    min-width: 600px;
    font-size: 0.8rem;
  }

  .dhis2-table th,
  .dhis2-table td {
    padding: 8px 6px;
    font-size: 0.8rem;
  }

  .no-data .icon {
    font-size: 2.5rem;
  }

  .no-data p {
    font-size: 0.9rem;
    padding: 0 16px;
    text-align: center;
  }
}

/* Very Small Screens */
@media (max-width: 480px) {
  .dhis2-pivot-builder {
    border-radius: 0;
  }

  .builder-sidebar {
    max-height: 300px;
  }

  .sidebar-header {
    padding: 8px;
  }

  .sidebar-header h4 {
    font-size: 0.8rem;
  }

  .fields-list {
    padding: 8px;
    max-height: 250px;
  }

  .draggable-item {
    padding: 10px 6px;
    font-size: 0.85rem;
  }

  .drag-icon {
    font-size: 0.9rem;
  }

  .item-icon {
    font-size: 0.9rem;
    margin-right: 6px;
  }

  .item-label {
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 0.75rem;
  }

  /* Main area */
  .builder-main {
    padding: 8px;
  }

  .layout-container {
    gap: 8px;
    margin-bottom: 12px;
  }

  .section-header {
    padding: 8px 10px;
  }

  .section-header h4 {
    font-size: 0.85rem;
  }

  .section-icon {
    font-size: 0.9rem;
  }

  .drop-zone {
    min-height: 70px;
    max-height: 120px;
    padding: 8px;
  }

  .empty-placeholder {
    padding: 12px 0;
    font-size: 0.8rem;
  }

  .dropped-item {
    padding: 6px 8px;
    margin-bottom: 4px;
    font-size: 0.8rem;
  }

  .remove-btn {
    font-size: 1.1rem;
  }

  /* Preview */
  .preview-area {
    min-height: 350px;
  }

  .preview-header {
    padding: 8px 10px;
    flex-direction: column;
    align-items: stretch;
  }

  .preview-header h4 {
    font-size: 0.8rem;
    margin-bottom: 8px;
  }

  .actions {
    width: 100%;
  }

  .action-btn {
    width: 100%;
    padding: 10px 16px;
  }

  .preview-content {
    padding: 8px;
  }

  .dhis2-table {
    font-size: 0.75rem;
    min-width: 500px;
  }

  .dhis2-table th,
  .dhis2-table td {
    padding: 6px 4px;
    font-size: 0.75rem;
  }

  .no-data .icon {
    font-size: 2rem;
  }

  .no-data p {
    font-size: 0.85rem;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  /* Enhance touch targets for drag items */
  .draggable-item {
    min-height: 48px;
    padding: 12px 10px;
  }

  .dropped-item {
    min-height: 44px;
    padding: 10px 12px;
  }

  .remove-btn {
    min-width: 36px;
    min-height: 36px;
  }

  .action-btn {
    min-height: 44px;
    padding: 10px 20px;
  }

  /* Provide visual feedback for touch */
  .draggable-item:active {
    background: #e3f2fd;
    transform: scale(0.98);
  }

  .drop-zone {
    /* Easier to hit on touch devices */
    min-height: 100px;
  }
}
</style>
