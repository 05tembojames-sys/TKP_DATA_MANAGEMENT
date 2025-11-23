# Implementation Plan: Advanced Data Entry Features

## 📋 Overview

This document outlines the step-by-step implementation of all 22 advanced features into the AggregateDataEntry component.

---

## Phase 1: Foundation (Completed ✅)

### Step 1.1: Create Composable
- ✅ Created `/src/composables/useDataEntry.js`
- ✅ Implemented all 22 feature functions
- ✅ Added Excel/CSV library (xlsx)

### Step 1.2: Install Dependencies
- ✅ Installed xlsx package
- Required: None others

---

## Phase 2: UI Components (Next Steps)

### Step 2.1: Enhanced Toolbar
**File**: `AggregateDataEntry.vue` (lines 70-85)

**Add Features**:
```vue
<div class="enhanced-toolbar">
  <!-- Export Buttons -->
  <div class="toolbar-group">
    <button @click="showExportMenu = !showExportMenu" class="toolbar-btn">
      <i class="fas fa-download"></i> Export
    </button>
    <div v-if="showExportMenu" class="dropdown-menu">
      <button @click="handleExportExcel">
        <i class="fas fa-file-excel"></i> Export to Excel
      </button>
      <button @click="handleExportCSV">
        <i class="fas fa-file-csv"></i> Export to CSV
      </button>
      <button @click="handlePrint">
        <i class="fas fa-print"></i> Print/PDF
      </button>
    </div>
  </div>

  <!-- Import Button -->
  <div class="toolbar-group">
    <input type="file" ref="fileInput" @change="handleImport" accept=".xlsx,.csv" style="display: none" />
    <button @click="$refs.fileInput.click()" class="toolbar-btn">
      <i class="fas fa-upload"></i> Import
    </button>
  </div>

  <!-- Data Management -->
  <div class="toolbar-group">
    <button @click="showDataMenu = !showDataMenu" class="toolbar-btn">
      <i class="fas fa-database"></i> Data
    </button>
    <div v-if="showDataMenu" class="dropdown-menu">
      <button @click="handleCopyPrevious">
        <i class="fas fa-copy"></i> Copy Previous Period
      </button>
      <button @click="handleClearData">
        <i class="fas fa-eraser"></i> Clear Data
      </button>
      <button @click="showTemplateDialog = true">
        <i class="fas fa-save"></i> Save as Template
      </button>
    </div>
  </div>

  <!-- Quality Tools -->
  <div class="toolbar-group">
    <button @click="handleRunValidation" class="toolbar-btn">
      <i class="fas fa-check-double"></i> Validate
    </button>
    <button @click="handleQualityCheck" class="toolbar-btn">
      <i class="fas fa-shield-alt"></i> Quality Check
    </button>
  </div>

  <!-- History & Audit -->
  <div class="toolbar-group">
    <button @click="showHistoryPanel = true" class="toolbar-btn">
      <i class="fas fa-history"></i> History
    </button>
    <button @click="showAuditPanel = true" class="toolbar-btn">
      <i class="fas fa-clipboard-list"></i> Audit Log
    </button>
  </div>

  <!-- Offline Status Indicator -->
  <div class="toolbar-status">
    <span v-if="!isOnline" class="offline-indicator">
      <i class="fas fa-plug"></i> Offline Mode
      <span class="pending-count" v-if="pendingChanges.length">{{ pendingChanges.length }}</span>
    </span>
  </div>
</div>
```

### Step 2.2: Progress Dashboard Widget
**Add to top of main content area**:

```vue
<div class="progress-dashboard" v-if="showProgress">
  <div class="progress-card">
    <h4>Overall Progress</h4>
    <div class="progress-bar-container">
      <div class="progress-bar" :style="`width: ${completionPercentage}%`"></div>
    </div>
    <p>{{ completedFields }}/{{ totalFields }} fields ({{ completionPercentage }}%)</p>
  </div>

  <div class="quality-card">
    <h4>Quality Score</h4>
    <div class="quality-score" :class="qualityClass">
      {{ qualityScore }}/100
    </div>
    <div class="quality-breakdown">
      <span>Completeness: {{ qualityMetrics.completeness }}%</span>
      <span>Consistency: {{ qualityMetrics.consistency }}%</span>
      <span>Accuracy: {{ qualityMetrics.accuracy }}%</span>
    </div>
  </div>

  <div class="status-card">
    <h4>Status</h4>
    <div class="status-badge" :class="approvalStatus">
      {{ approvalStatus }}
    </div>
    <p class="last-updated">Last updated: {{ formatTime(lastUpdated) }}</p>
  </div>
</div>
```

### Step 2.3: Enhanced Data Entry Table
**Modifications to existing table**:

```vue
<td v-else class="data-cell">
  <!-- Input with validation -->
  <div class="cell-wrapper" :class="{
    'has-error': getValidationError(element.id),
    'has-warning': getWarning(element.id),
    'has-comment': hasComment(element.id),
    'is-calculated': element.calculated,
    'is-locked': isFieldLocked(element.id)
  }">
    <!-- Input field -->
    <input
      :type="getInputType(element)"
      :value="getCellValue(element.id)"
      @input="handleCellInput($event, element.id)"
      @blur="handleCellBlur(element.id)"
      @focus="handleCellFocus(element.id)"
      :disabled="element.calculated || isFieldLocked(element.id)"
      :class="{ 'calculated': element.calculated }"
      :title="getTooltip(element.id)"
    />
    
    <!-- Field Icons -->
    <div class="cell-icons">
      <!-- Error indicator -->
      <i v-if="getValidationError(element.id)" 
         class="fas fa-exclamation-circle error-icon"
         :title="getValidationError(element.id).message"
      ></i>
      
      <!-- Warning indicator -->
      <i v-if="getWarning(element.id)"
         class="fas fa-exclamation-triangle warning-icon"
         :title="getWarning(element.id).message"
      ></i>
      
      <!-- Comment indicator -->
      <button v-if="hasComment(element.id)"
              @click="showComments(element.id)"
              class="comment-icon">
        <i class="fas fa-comment"></i>
        <span class="comment-count">{{ getCommentCount(element.id) }}</span>
      </button>
      
      <button v-else
              @click="addNewComment(element.id)"
              class="add-comment-icon">
        <i class="fas fa-comment-plus"></i>
      </button>
      
      <!-- Multi-user indicator -->
      <span v-if="isBeingEdited(element.id)" class="user-editing">
        <i class="fas fa-user-edit"></i>
        {{ getEditingUser(element.id) }}
      </span>
      
      <!-- History indicator -->
      <button @click="showFieldHistory(element.id)" class="history-icon">
        <i class="fas fa-history"></i>
      </button>
    </div>
  </div>
</td>
```

### Step 2.4: Sidebar Panels

**Comments Panel**:
```vue
<div v-if="showCommentsPanel" class="side-panel comments-panel">
  <div class="panel-header">
    <h3>Comments</h3>
    <button @click="showCommentsPanel = false" class="close-btn">×</button>
  </div>
  
  <div class="panel-body">
    <div v-for="comment in currentComments" :key="comment.id" class="comment-item">
      <div class="comment-header">
        <span class="comment-author">{{ comment.author }}</span>
        <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
      </div>
      <div class="comment-body">{{ comment.text }}</div>
    </div>
    
    <div class="comment-form">
      <textarea v-model="newComment" placeholder="Add a comment..."></textarea>
      <button @click="submitComment" class="submit-btn">Post Comment</button>
    </div>
  </div>
</div>
```

**History Panel**:
```vue
<div v-if="showHistoryPanel" class="side-panel history-panel">
  <div class="panel-header">
    <h3>Version History</h3>
    <button @click="showHistoryPanel = false" class="close-btn">×</button>
  </div>
  
  <div class="panel-body">
    <div v-for="version in dataHistory" :key="version.id" class="history-item">
      <div class="version-header">
        <span class="version-number">Version {{ version.version }}</span>
        <span class="version-time">{{ formatTime(version.savedAt) }}</span>
      </div>
      <div class="version-info">
        <span class="version-author">by {{ version.savedBy }}</span>
        <button @click="compareVersions(version)" class="compare-btn">Compare</button>
        <button @click="restoreVersion(version)" class="restore-btn">Restore</button>
      </div>
    </div>
  </div>
</div>
```

**Audit Log Panel**:
```vue
<div v-if="showAuditPanel" class="side-panel audit-panel">
  <div class="panel-header">
    <h3>Audit Trail</h3>
    <button @click="showAuditPanel = false" class="close-btn">×</button>
  </div>
  
  <div class="panel-body">
    <div class="audit-filters">
      <select v-model="auditFilter.action">
        <option value="">All Actions</option>
        <option value="CREATE">Created</option>
        <option value="UPDATE">Updated</option>
        <option value="DELETE">Deleted</option>
        <option value="EXPORT">Exported</option>
        <option value="IMPORT">Imported</option>
      </select>
      
      <input type="date" v-model="auditFilter.date" placeholder="Filter by date" />
    </div>
    
    <div v-for="entry in filteredAuditLog" :key="entry.id" class="audit-entry">
      <div class="audit-icon" :class="entry.action">
        <i :class="getAuditIcon(entry.action)"></i>
      </div>
      <div class="audit-details">
        <div class="audit-action">{{ entry.action }}</div>
        <div class="audit-field" v-if="entry.field">{{ entry.field }}</div>
        <div class="audit-change" v-if="entry.oldValue">
          <span class="old-value">{{ entry.oldValue }}</span>
          <i class="fas fa-arrow-right"></i>
          <span class="new-value">{{ entry.newValue }}</span>
        </div>
        <div class="audit-meta">
          <span class="audit-user">{{ entry.user }}</span>
          <span class="audit-time">{{ formatTime(entry.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Step 2.5: Modal Dialogs

**Quality Check Results Modal**:
```vue
<div v-if="showQualityModal" class="modal-overlay" @click="showQualityModal = false">
  <div class="modal-content quality-modal" @click.stop>
    <div class="modal-header">
      <h3>Data Quality Report</h3>
      <button @click="showQualityModal = false" class="close-btn">×</button>
    </div>
    
    <div class="modal-body">
      <!-- Overall Score -->
      <div class="quality-score-section">
        <div class="score-circle" :class="getScoreClass(qualityResults.overall)">
          <span class="score-value">{{ qualityResults.overall }}</span>
          <span class="score-label">/100</span>
        </div>
        <h4>{{ getScoreLabel(qualityResults.overall) }}</h4>
      </div>
      
      <!-- Metrics Breakdown -->
      <div class="metrics-grid">
        <div class="metric-card">
          <h5>Completeness</h5>
          <div class="metric-value">{{ qualityResults.completeness }}%</div>
          <p>{{ qualityResults.filled }}/{{ qualityResults.total }} fields</p>
        </div>
        
        <div class="metric-card">
          <h5>Consistency</h5>
          <div class="metric-value">
            {{ qualityResults.consistency.issues.length === 0 ? '100%' : '0%' }}
          </div>
          <ul v-if="qualityResults.consistency.issues.length > 0">
            <li v-for="issue in qualityResults.consistency.issues" :key="issue">
              {{ issue }}
            </li>
          </ul>
        </div>
        
        <div class="metric-card">
          <h5>Outliers</h5>
          <div class="metric-value">{{ qualityResults.outliers.length }}</div>
          <ul v-if="qualityResults.outliers.length > 0">
            <li v-for="outlier in qualityResults.outliers" :key="outlier.field">
              {{ outlier.field }}: {{ outlier.value }} (Z-score: {{ outlier.zScore.toFixed(2) }})
            </li>
          </ul>
          <p v-else>No outliers detected</p>
        </div>
        
        <div class="metric-card">
          <h5>Timeliness</h5>
          <div class="metric-value" :class="{ 'late': qualityResults.timeliness.daysLate > 0 }">
            {{ qualityResults.timeliness.onTime ? 'On Time' : `${qualityResults.timeliness.daysLate} days late` }}
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="quality-actions">
        <button @click="exportQualityReport" class="btn-secondary">Export Report</button>
        <button @click="fixIssues" class="btn-primary">Fix Issues</button>
      </div>
    </div>
  </div>
</div>
```

**Template Save Modal**:
```vue
<div v-if="showTemplateDialog" class="modal-overlay" @click="showTemplateDialog = false">
  <div class="modal-content template-modal" @click.stop>
    <div class="modal-header">
      <h3>Save as Template</h3>
      <button @click="showTemplateDialog = false" class="close-btn">×</button>
    </div>
    
    <div class="modal-body">
      <div class="form-group">
        <label>Template Name</label>
        <input v-model="templateName" type="text" placeholder="Enter template name" />
      </div>
      
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="templateDescription" placeholder="Optional description"></textarea>
      </div>
      
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="templateIncludeValues" />
          Include current values
        </label>
      </div>
      
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="templateShareWithTeam" />
          Share with team
        </label>
      </div>
    </div>
    
    <div class="modal-footer">
      <button @click="showTemplateDialog = false" class="btn-secondary">Cancel</button>
      <button @click="saveAsTemplate" class="btn-primary">Save Template</button>
    </div>
  </div>
</div>
```

**Comparison View Modal**:
```vue
<div v-if="showComparisonModal" class="modal-overlay modal-large" @click="showComparisonModal = false">
  <div class="modal-content comparison-modal" @click.stop>
    <div class="modal-header">
      <h3>Period Comparison</h3>
      <button @click="showComparisonModal = false" class="close-btn">×</button>
    </div>
    
    <div class="modal-body">
      <!-- Period Selector -->
      <div class="comparison-controls">
        <select v-model="comparisonPeriod1">
          <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        <span>vs</span>
        <select v-model="comparisonPeriod2">
          <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        <button @click="loadComparison" class="btn-primary">Compare</button>
      </div>
      
      <!-- Comparison Table -->
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Data Element</th>
            <th>{{ getPeriodName(comparisonPeriod1) }}</th>
            <th>{{ getPeriodName(comparisonPeriod2) }}</th>
            <th>Change</th>
            <th>% Change</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in comparisonData" :key="element.id">
            <td>{{ element.name }}</td>
            <td>{{ element.value1 || '-' }}</td>
            <td>{{ element.value2 || '-' }}</td>
            <td :class="{
              'positive': element.change > 0,
              'negative': element.change < 0
            }">
              {{ element.change > 0 ? '+' : '' }}{{ element.change }}
              <i v-if="element.change > 0" class="fas fa-arrow-up"></i>
              <i v-if="element.change < 0" class="fas fa-arrow-down"></i>
            </td>
            <td>{{ element.percentChange }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="modal-footer">
      <button @click="exportComparison" class="btn-secondary">
        <i class="fas fa-download"></i> Export
      </button>
    </div>
  </div>
</div>
```

---

## Phase 3: Script Implementation

### Step 3.1: Import Composable
**Add to script setup section**:

```javascript
import { useDataEntry } from '../composables/useDataEntry';

const {
  exportToExcel,
  exportToCSV,
  importFromExcel,
  copyPreviousPeriodData,
  clearAllData,
  saveTemplate,
  loadTemplate,
  listTemplates,
  validateData,
  runQualityChecks,
  addComment,
  getComments,
  addAuditEntry,
  getAuditTrail,
  saveVersion,
  getHistory,
  setupAutoCalculations,
  fillDown,
  bulkEdit,
  generatePrintView,
  isOnline,
  pendingChanges,
  validationErrors,
  setupOfflineMode
} = useDataEntry();
```

### Step 3.2: Add State Variables
```javascript
// UI State
const showExportMenu = ref(false);
const showDataMenu = ref(false);
const showCommentsPanel = ref(false);
const showHistoryPanel = ref(false);
const showAuditPanel = ref(false);
const showQualityModal = ref(false);
const showTemplateDialog = ref(false);
const showComparisonModal = ref(false);

// Data State
const currentComments = ref([]);
const dataHistory = ref([]);
const qualityResults = ref(null);
const comparisonData = ref([]);
const templates = ref([]);

// Template Form
const templateName = ref('');
const templateDescription = ref('');
const templateIncludeValues = ref(true);
const templateShareWithTeam = ref(false);

// Progress Metrics
const completionPercentage = ref(0);
const completedFields = ref(0);
const totalFields = ref(0);
const qualityScore = ref(0);
const qualityMetrics = ref({});

// Comparison
const comparisonPeriod1 = ref('');
const comparisonPeriod2 = ref('');
```

### Step 3.3: Implement Handler Methods
```javascript
// Export Handlers
const handleExportExcel = async () => {
  const data = prepareExportData();
  const metadata = {
    orgUnit: selectedOrgUnit.value,
    dataSet: selectedDataSet.value,
    period: selectedPeriod.value
  };
  
  const result = await exportToExcel(data, metadata, `data-entry-${selectedPeriod.value}`);
  if (result.success) {
    showToast('Data exported successfully', 'success');
  } else {
    showToast(result.error, 'error');
  }
};

const handleExportCSV = async () => {
  const data = prepareExportData();
  const result = await exportToCSV(data, `data-entry-${selectedPeriod.value}`);
  if (result.success) {
    showToast('Data exported successfully', 'success');
  } else {
    showToast(result.error, 'error');
  }
};

// Import Handler
const handleImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const result = await importFromExcel(file);
  if (result.success) {
    // Apply imported data
    applyImportedData(result.data);
    showToast('Data imported successfully', 'success');
    
    // Add audit entry
    await addAuditEntry({
      action: 'IMPORT',
      dataKey: getCurrentDataKey(),
      recordCount: result.data.length
    });
  } else {
    showToast(result.error, 'error');
  }
};

// Copy Previous Period
const handleCopyPrevious = async () => {
  const confirmed = await confirm('Copy data from previous period? This will overwrite current values.');
  if (!confirmed) return;
  
  const currentKey = getCurrentDataKey();
  const previousKey = getPreviousDataKey();
  
  const result = await copyPreviousPeriodData(currentKey, previousKey);
  if (result.success) {
    applyData(result.data);
    showToast('Data copied successfully', 'success');
  } else {
    showToast(result.error, 'error');
  }
};

// Clear Data
const handleClearData = async () => {
  const confirmed = await confirm('Clear all data? This action cannot be undone.');
  if (!confirmed) return;
  
  const result = await clearAllData(getCurrentDataKey());
  if (result.success) {
    clearFormData();
    showToast('Data cleared successfully', 'success');
  } else {
    showToast(result.error, 'error');
  }
};

// Validation
const handleRunValidation = async () => {
  const rules = getValidationRules();
  const errors = validateData(formData.value, rules);
  
  if (errors.length === 0) {
    showToast('All validations passed!', 'success');
  } else {
    validationErrors.value = errors;
    showToast(`${errors.length} validation error(s) found`, 'warning');
  }
};

// Quality Check
const handleQualityCheck = async () => {
  const metadata = {
    orgUnit: selectedOrgUnit.value,
    dataSet: selectedDataSet.value,
    period: selectedPeriod.value,
    periodEnd: getPeriodEndDate()
  };
  
  qualityResults.value = runQualityChecks(formData.value, metadata);
  showQualityModal.value = true;
};

// Comments
const showComments = async (elementId) => {
  const result = await getComments(getCurrentDataKey(), elementId);
  if (result.success) {
    currentComments.value = result.comments;
    showCommentsPanel.value = true;
  }
};

const addNewComment = async (elementId) => {
  const comment = await prompt('Enter your comment:');
  if (!comment) return;
  
  const result = await addComment(getCurrentDataKey(), elementId, comment);
  if (result.success) {
    showToast('Comment added', 'success');
  }
};

// History
const showFieldHistory = async (elementId) => {
  const result = await getHistory(getCurrentDataKey());
  if (result.success) {
    dataHistory.value = result.history.filter(h => 
      h.data[elementId] !== undefined
    );
    showHistoryPanel.value = true;
  }
};

// Print
const handlePrint = () => {
  const metadata = {
    orgUnit: getOrgUnitName(selectedOrgUnit.value),
    dataSet: getDataSetName(selectedDataSet.value),
    period: getPeriodName(selectedPeriod.value)
  };
  
  generatePrintView(formData.value, metadata);
};

// Template
const saveAsTemplate = async () => {
  const data = templateIncludeValues.value ? formData.value : getStructure();
  const metadata = {
    dataSet: selectedDataSet.value,
    description: templateDescription.value,
    shared: templateShareWithTeam.value
  };
  
  const result = await saveTemplate(templateName.value, data, metadata);
  if (result.success) {
    showToast('Template saved successfully', 'success');
    showTemplateDialog.value = false;
  } else {
    showToast(result.error, 'error');
  }
};

// Helper Methods
const getCurrentDataKey = () => {
  return `${selectedOrgUnit.value}-${selectedDataSet.value}-${selectedPeriod.value}`;
};

const prepareExportData = () => {
  return Object.entries(formData.value).map(([key, value]) => ({
    'Data Element': getElementName(key),
    'Value': value,
    'Category': getElementCategory(key),
    'Last Updated': getLastUpdated(key)
  }));
};

const applyImportedData = (data) => {
  data.forEach(row => {
    const elementId = getElementId(row['Data Element']);
    if (elementId) {
      formData.value[elementId] = row['Value'];
    }
  });
};
```

### Step 3.4: Add Lifecycle Hooks
```javascript
onMounted(() => {
  // Setup offline mode
  setupOfflineMode();
  
  // Load templates
  loadAvailableTemplates();
  
  // Setup autosave
  setupAutosave();
  
  // Load pending changes if offline
  if (!isOnline.value) {
    loadPendingChanges();
  }
});

onBeforeUnmount(() => {
  // Save any pending changes
  if (hasUnsavedChanges.value) {
    saveCurrentState();
  }
});
```

---

## Phase 4: Styling

### Step 4.1: Enhanced Toolbar Styles
```css
.enhanced-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  flex-wrap: wrap;
}

.toolbar-group {
  position: relative;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f0f0f0;
  border-color: #999;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
 left: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
}

.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.dropdown-menu button:hover {
  background: #f5f5f5;
}

.offline-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #ff9800;
  color: white;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.pending-count {
  background: white;
  color: #ff9800;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: bold;
}
```

### Step 4.2: Progress Dashboard Styles
```css
.progress-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

.progress-card,
.quality-card,
.status-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.progress-bar-container {
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #81C784);
  transition: width 0.3s ease;
}

.quality-score {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin: 16px 0;
}

.quality-score.high { color: #4CAF50; }
.quality-score.medium { color: #FF9800; }
.quality-score.low { color: #F44336; }

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.status-badge.draft { background: #E0E0E0; color: #666; }
.status-badge.submitted { background: #2196F3; color: white; }
.status-badge.approved { background: #4CAF50; color: white; }
.status-badge.rejected { background: #F44336; color: white; }
```

### Step 4.3: Enhanced Table Cell Styles
```css
.cell-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cell-wrapper.has-error input {
  border-color: #F44336;
  background: #FFEBEE;
}

.cell-wrapper.has-warning input {
  border-color: #FF9800;
  background: #FFF3E0;
}

.cell-wrapper.has-comment {
  background: #E3F2FD;
}

.cell-wrapper.is-calculated input {
  background: #F5F5F5;
  font-weight: bold;
  cursor: not-allowed;
}

.cell-wrapper.is-locked input {
  background: #FAFAFA;
  cursor: not-allowed;
}

.cell-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-icon {
  color: #F44336;
  cursor: help;
}

.warning-icon {
  color: #FF9800;
  cursor: help;
}

.comment-icon,
.add-comment-icon,
.history-icon {
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: #666;
  transition: color 0.2s;
}

.comment-icon:hover,
.add-comment-icon:hover,
.history-icon:hover {
  color: #2196F3;
}

.comment-count {
  background: #2196F3;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  margin-left: 4px;
}

.user-editing {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #FF9800;
  font-weight: 500;
}
```

### Step 4.4: Side Panel Styles
```css
.side-panel {
  position: fixed;
  top: 48px;
  right: 0;
  width: 400px;
  height: calc(100vh - 48px);
  background: white;
  box-shadow: -4px 0 8px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.comment-item,
.history-item,
.audit-entry {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.comment-form {
  margin-top: 16px;
}

.comment-form textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.submit-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

### Step 4.5: Modal Styles
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #ddd;
}

.close-btn {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #666;
}
```

---

## Phase 5: Testing & Deployment

### Step 5.1: Unit Tests
- Test each composable function
- Test data validation rules
- Test export/import functionality
- Test offline mode

### Step 5.2: Integration Tests
- Test full data entry workflow
- Test multi-user scenarios
- Test approval workflow
- Test sync after offline

### Step 5.3: Performance Testing
- Large dataset handling
- Export large files
- Import validation
- Concurrent users

### Step 5.4: User Acceptance Testing
- Real-world usage scenarios
- Feedback collection
- UI/UX improvements
- Accessibility testing

---

## Phase 6: Documentation & Training

### Step 6.1: User Documentation
- ✅ Created ADVANCED_DATA_ENTRY_FEATURES.md
- Create video tutorials
- Create quick reference guides
- Create troubleshooting guide

### Step 6.2: Admin Documentation
- Configuration guide
- Permission setup
- Workflow customization
- Performance tuning

### Step 6.3: Developer Documentation
- API reference
- Extension guide
- Custom validation rules
- Custom calculations

---

## Timeline

**Phase 2-3 (UI + Script)**: 3-4 hours  
**Phase 4 (Styling)**: 2 hours  
**Phase 5 (Testing)**: 2-3 hours  
**Phase 6 (Documentation)**: 1-2 hours

**Total Estimated Time**: 8-11 hours

---

## Next Immediate Steps

1. ✅ Composable created
2. ✅ Dependencies installed
3. ✅ Documentation created
4. **NEXT**: Integrate enhanced toolbar into AggregateDataEntry.vue
5. **THEN**: Add progress dashboard
6. **THEN**: Enhance data entry table
7. **THEN**: Add side panels
8. **THEN**: Add modal dialogs
9. **THEN**: Implement all handlers
10. **THEN**: Add styling
11. **THEN**: Test everything

Would you like me to proceed with Step 4 (integrate the enhanced toolbar)?
