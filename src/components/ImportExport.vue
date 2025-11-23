<template>
  <div class="dhis2-app-shell">
    <TopHeader />
    
    <div class="app-content">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Import</h3>
          </div>
          <nav class="sidebar-nav">
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'metadata-import' }"
              @click.prevent="activeModule = 'metadata-import'"
            >
              <i class="fas fa-cube"></i>
              Metadata Import
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'data-import' }"
              @click.prevent="activeModule = 'data-import'"
            >
              <i class="fas fa-database"></i>
              Data Import
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'event-import' }"
              @click.prevent="activeModule = 'event-import'"
            >
              <i class="fas fa-calendar-alt"></i>
              Event Import
            </a>
          </nav>
        </div>

        <div class="sidebar-section">
          <div class="section-header">
            <h3>Export</h3>
          </div>
          <nav class="sidebar-nav">
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'metadata-export' }"
              @click.prevent="activeModule = 'metadata-export'"
            >
              <i class="fas fa-file-export"></i>
              Metadata Export
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'data-export' }"
              @click.prevent="activeModule = 'data-export'"
            >
              <i class="fas fa-table"></i>
              Data Export
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'event-export' }"
              @click.prevent="activeModule = 'event-export'"
            >
              <i class="fas fa-list-alt"></i>
              Event Export
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="main-workspace">
        <div class="workspace-header">
          <h2 class="module-title">{{ getModuleTitle(activeModule) }}</h2>
        </div>

        <div class="workspace-content">
          <!-- Metadata Import -->
          <div v-if="activeModule === 'metadata-import'" class="module-content">
            <div class="info-box">
              <i class="fas fa-info-circle"></i>
              <p>Import metadata such as programs, data elements, and organisation units using JSON or XML format.</p>
            </div>
            
            <div class="form-group">
              <label>Format</label>
              <select v-model="importSettings.format" class="dhis2-select">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div class="form-group">
              <label>Upload File</label>
              <div class="file-upload-area" @dragover.prevent @drop.prevent="handleFileDrop">
                <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none" />
                <div v-if="!selectedFile" class="upload-placeholder" @click="$refs.fileInput.click()">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Select a file or drag and drop here</p>
                </div>
                <div v-else class="file-selected">
                  <i class="fas fa-file-code"></i>
                  <span>{{ selectedFile.name }}</span>
                  <button @click="selectedFile = null" class="icon-btn"><i class="fas fa-times"></i></button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Import Mode</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" v-model="importSettings.mode" value="commit" /> Commit (Import)
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="importSettings.mode" value="validate" /> Validate (Dry Run)
                </label>
              </div>
            </div>

            <div class="action-bar">
              <button class="dhis2-btn primary" @click="performImport" :disabled="!selectedFile">
                <i class="fas fa-upload"></i> Import
              </button>
            </div>
          </div>

          <!-- Data/Event Import -->
          <div v-if="['data-import', 'event-import'].includes(activeModule)" class="module-content">
             <div class="info-box">
              <i class="fas fa-info-circle"></i>
              <p>Import {{ activeModule === 'data-import' ? 'aggregate data values' : 'event data' }} into the system.</p>
            </div>

            <div class="form-group">
              <label>Format</label>
              <select v-model="importSettings.format" class="dhis2-select">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div class="form-group">
              <label>Upload File</label>
              <div class="file-upload-area" @dragover.prevent @drop.prevent="handleFileDrop">
                <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none" />
                <div v-if="!selectedFile" class="upload-placeholder" @click="$refs.fileInput.click()">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Select a file or drag and drop here</p>
                </div>
                <div v-else class="file-selected">
                  <i class="fas fa-file-alt"></i>
                  <span>{{ selectedFile.name }}</span>
                  <button @click="selectedFile = null" class="icon-btn"><i class="fas fa-times"></i></button>
                </div>
              </div>
            </div>

            <div class="action-bar">
              <button class="dhis2-btn primary" @click="performImport" :disabled="!selectedFile">
                <i class="fas fa-upload"></i> Import
              </button>
            </div>
          </div>

          <!-- Metadata Export -->
          <div v-if="activeModule === 'metadata-export'" class="module-content">
            <div class="info-box">
              <i class="fas fa-info-circle"></i>
              <p>Export metadata schemas for programs, forms, and organization units.</p>
            </div>

            <div class="form-group">
              <label>Format</label>
              <select v-model="exportSettings.format" class="dhis2-select">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
              </select>
            </div>

            <div class="form-group">
              <label>Compression</label>
              <select v-model="exportSettings.compression" class="dhis2-select">
                <option value="none">None</option>
                <option value="zip">ZIP</option>
                <option value="gz">GZIP</option>
              </select>
            </div>

            <div class="form-group">
              <label>Schemas to Export</label>
              <div class="checkbox-list">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="exportSettings.schemas" value="programs" /> Programs
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="exportSettings.schemas" value="dataElements" /> Data Elements
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="exportSettings.schemas" value="orgUnits" /> Organisation Units
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="exportSettings.schemas" value="optionSets" /> Option Sets
                </label>
              </div>
            </div>

            <div class="action-bar">
              <button class="dhis2-btn primary" @click="performExport">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>

          <!-- Data/Event Export -->
          <div v-if="['data-export', 'event-export'].includes(activeModule)" class="module-content">
            <div class="info-box">
              <i class="fas fa-info-circle"></i>
              <p>Export {{ activeModule === 'data-export' ? 'aggregate data' : 'detailed event data' }} for analysis or backup.</p>
            </div>

            <div class="form-group">
              <label>Output Format</label>
              <select v-model="exportSettings.format" class="dhis2-select">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div class="form-group">
              <label>Organisation Unit</label>
              <select v-model="exportSettings.orgUnit" class="dhis2-select">
                <option value="all">All Units</option>
                <option value="Lusaka District">Lusaka District</option>
                <option value="Chongwe Outreach">Chongwe Outreach</option>
                <option value="Kafue Center">Kafue Center</option>
              </select>
            </div>

            <div class="form-group">
              <label>Start Date</label>
              <input type="date" v-model="exportSettings.startDate" class="dhis2-input" />
            </div>

            <div class="form-group">
              <label>End Date</label>
              <input type="date" v-model="exportSettings.endDate" class="dhis2-input" />
            </div>

            <div class="action-bar">
              <button class="dhis2-btn primary" @click="performExport">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>

          <!-- Import Summary / Logs -->
          <div v-if="importSummary" class="import-summary">
            <h3>Import Summary</h3>
            <div class="summary-card" :class="importSummary.status">
              <div class="summary-header">
                <i :class="importSummary.status === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                <span>{{ importSummary.message }}</span>
              </div>
              <div class="summary-details" v-if="importSummary.details">
                <div class="detail-item">
                  <span class="label">Imported:</span>
                  <span class="value">{{ importSummary.details.imported }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Updated:</span>
                  <span class="value">{{ importSummary.details.updated }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Ignored:</span>
                  <span class="value">{{ importSummary.details.ignored }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TopHeader from "./TopHeader.vue";
import EnhancedOutreachService from "../services/enhancedOutreachService.js";
import { useToast } from "../composables/useToast.js";

const { success, error, info } = useToast();

const activeModule = ref('metadata-import');
const selectedFile = ref(null);
const importSummary = ref(null);

const importSettings = ref({
  format: 'json',
  mode: 'commit'
});

const exportSettings = ref({
  format: 'json',
  compression: 'none',
  schemas: ['programs', 'dataElements'],
  orgUnit: 'all',
  startDate: '',
  endDate: ''
});

const getModuleTitle = (module) => {
  const titles = {
    'metadata-import': 'Metadata Import',
    'data-import': 'Data Import',
    'event-import': 'Event Import',
    'metadata-export': 'Metadata Export',
    'data-export': 'Data Export',
    'event-export': 'Event Export'
  };
  return titles[module] || 'Import/Export';
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) selectedFile.value = file;
};

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) selectedFile.value = file;
};

const performImport = async () => {
  if (!selectedFile.value) return;

  // Mock import process
  importSummary.value = null;
  
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real scenario, we would parse the file and send to backend
    // Here we'll just simulate a successful import of the file content
    
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("File content loaded:", e.target.result.substring(0, 100) + "...");
      
      importSummary.value = {
        status: 'success',
        message: 'Import completed successfully',
        details: {
          imported: Math.floor(Math.random() * 10) + 1,
          updated: 0,
          ignored: 0
        }
      };
      success("Import completed successfully");
    };
    reader.readAsText(selectedFile.value);
    
  } catch (err) {
    error("Import failed: " + err.message);
    importSummary.value = {
      status: 'error',
      message: 'Import failed: ' + err.message
    };
  }
};

const performExport = async () => {
  try {
    let dataToExport = null;
    let filename = 'export';

    if (activeModule.value === 'metadata-export') {
      // Mock metadata export
      dataToExport = {
        programs: [
          { id: 'child-care', name: 'Child Care Program' },
          { id: 'medical', name: 'Medical Support' }
        ],
        orgUnits: [
          { id: 'lusaka', name: 'Lusaka District' }
        ]
      };
      filename = 'metadata_export';
    } else if (activeModule.value === 'data-export' || activeModule.value === 'event-export') {
      // Fetch real data from service
      const forms = await EnhancedOutreachService.getAllForms();
      
      // Filter by date if provided
      let filteredForms = forms;
      if (exportSettings.value.startDate) {
        filteredForms = filteredForms.filter(f => new Date(f.createdAt) >= new Date(exportSettings.value.startDate));
      }
      if (exportSettings.value.endDate) {
        filteredForms = filteredForms.filter(f => new Date(f.createdAt) <= new Date(exportSettings.value.endDate));
      }
      if (exportSettings.value.orgUnit !== 'all') {
        filteredForms = filteredForms.filter(f => f.orgUnit === exportSettings.value.orgUnit);
      }

      dataToExport = filteredForms;
      filename = activeModule.value === 'data-export' ? 'data_export' : 'event_export';
    }

    if (!dataToExport) {
      error("No data to export");
      return;
    }

    // Handle format
    let content = '';
    let mimeType = '';

    if (exportSettings.value.format === 'json') {
      content = JSON.stringify(dataToExport, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    } else if (exportSettings.value.format === 'csv') {
      // Simple CSV flattener for demo
      if (Array.isArray(dataToExport) && dataToExport.length > 0) {
        const headers = Object.keys(dataToExport[0]);
        content = [
          headers.join(','),
          ...dataToExport.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
        ].join('\n');
      } else {
        content = 'No data';
      }
      mimeType = 'text/csv';
      filename += '.csv';
    } else {
      // XML placeholder
      content = '<root>XML Export Not Implemented</root>';
      mimeType = 'application/xml';
      filename += '.xml';
    }

    // Trigger download
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    success("Export started");

  } catch (err) {
    error("Export failed: " + err.message);
  }
};
</script>

<style scoped>
.dhis2-app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f5f7;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  color: #212121;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-section {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.section-header {
  padding: 0 16px 8px;
}

.section-header h3 {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #616161;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #494949;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #212121;
}

.nav-item.active {
  background: #e8f4f8;
  color: #2b6693;
  border-left-color: #2b6693;
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  text-align: center;
  font-size: 1rem;
}

/* Main Workspace */
.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f3f5f7;
  overflow-y: auto;
  padding: 24px;
}

.workspace-header {
  margin-bottom: 24px;
}

.module-title {
  margin: 0;
  font-size: 1.5rem;
  color: #2b6693;
  font-weight: 400;
}

.workspace-content {
  max-width: 800px;
}

.module-content {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.info-box {
  display: flex;
  gap: 12px;
  background: #e3f2fd;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 24px;
  color: #0d47a1;
}

.info-box i {
  font-size: 1.2rem;
  margin-top: 2px;
}

.info-box p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #494949;
  font-weight: 500;
}

.dhis2-select,
.dhis2-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  font-size: 0.9rem;
  color: #212121;
  background: white;
}

.dhis2-select:focus,
.dhis2-input:focus {
  border-color: #2b6693;
  outline: none;
  box-shadow: 0 0 0 2px rgba(43, 102, 147, 0.1);
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #d5d5d5;
  border-radius: 4px;
  padding: 32px;
  text-align: center;
  transition: all 0.2s;
  background: #fafafa;
}

.file-upload-area:hover {
  border-color: #2b6693;
  background: #f0f7fc;
}

.upload-placeholder {
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 3rem;
  color: #bdbdbd;
  margin-bottom: 12px;
}

.upload-placeholder p {
  margin: 0;
  color: #757575;
  font-size: 0.9rem;
}

.file-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #2b6693;
  font-weight: 500;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ef4444;
  padding: 4px;
}

/* Radio & Checkbox */
.radio-group,
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #212121;
  cursor: pointer;
}

/* Action Bar */
.action-bar {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.dhis2-btn {
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 3px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.dhis2-btn.primary {
  background: #2b6693;
  color: white;
}

.dhis2-btn.primary:hover {
  background: #1d4260;
}

.dhis2-btn:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

/* Summary */
.import-summary {
  margin-top: 24px;
}

.import-summary h3 {
  font-size: 1.1rem;
  color: #212121;
  margin-bottom: 12px;
}

.summary-card {
  background: white;
  border-radius: 4px;
  padding: 16px;
  border-left: 4px solid transparent;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.summary-card.success {
  border-left-color: #4caf50;
}

.summary-card.error {
  border-left-color: #f44336;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  margin-bottom: 12px;
}

.summary-card.success .summary-header { color: #2e7d32; }
.summary-card.error .summary-header { color: #c62828; }

.summary-details {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 0.8rem;
  color: #757575;
  text-transform: uppercase;
}

.detail-item .value {
  font-size: 1.2rem;
  font-weight: 500;
  color: #212121;
}
</style>
