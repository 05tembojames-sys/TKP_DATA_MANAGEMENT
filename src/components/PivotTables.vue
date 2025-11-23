<template>
  <div class="dhis2-app-container">
    <TopHeader />
    
    <div class="app-shell">
      <!-- Left Sidebar - Configuration -->
      <aside class="sidebar" :class="{ collapsed: panelCollapsed }">
        <div class="sidebar-header">
          <span class="sidebar-title">Configuration</span>
          <button class="icon-btn" @click="panelCollapsed = !panelCollapsed">
            <span v-if="!panelCollapsed">«</span>
            <span v-else>»</span>
          </button>
        </div>

        <div class="sidebar-content" v-show="!panelCollapsed">
          <!-- Data Selection -->
          <div class="dimension-group">
            <div class="dimension-header" @click="toggleSection('data')">
              <span class="icon">📊</span>
              <span class="label">Data</span>
              <span class="chevron" :class="{ expanded: sections.data }">▼</span>
            </div>
            <div class="dimension-body" v-show="sections.data">
              <div class="form-group">
                <label>Program</label>
                <select v-model="config.program" class="dhis2-select">
                  <option value="">Select program...</option>
                  <option value="initial-referral">Initial Referrals</option>
                  <option value="child-overview">Child Overview</option>
                  <option value="initial-assessment">Initial Assessments</option>
                  <option value="medical-intake">Medical Intake Assessments</option>
                  <option value="academics-literacy">Academics & Literacy Plans</option>
                  <option value="psychological-assessment">Psychological Assessments</option>
                  <option value="life-skills-survey">Life Skills Surveys</option>
                  <option value="birth-delivery">Birth & Delivery Reports</option>
                  <option value="care-plan-summary">Care Plan Summaries</option>
                  <option value="care-plan-baby">Care Plan (Baby)</option>
                  <option value="care-plan-ongoing-life-skills">Ongoing Life Skills</option>
                </select>
              </div>

              <div class="form-group" v-if="config.program">
                <label>Data Elements</label>
                <div class="selection-list">
                  <div class="list-control">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        :checked="availableDataElements.length > 0 && config.selectedElements.length === availableDataElements.length"
                        @change="toggleSelectAllElements"
                      />
                      <span class="label-text">Select All</span>
                    </label>
                  </div>
                  <div class="list-items">
                    <div
                      v-for="element in availableDataElements"
                      :key="element.id"
                      class="list-item"
                    >
                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          :value="element.id"
                          v-model="config.selectedElements"
                        />
                        <span class="label-text">{{ element.name }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="info-message">
                Select a program to view data elements.
              </div>
            </div>
          </div>

          <!-- Period Selection -->
          <div class="dimension-group">
            <div class="dimension-header" @click="toggleSection('periods')">
              <span class="icon">📅</span>
              <span class="label">Periods</span>
              <span class="chevron" :class="{ expanded: sections.periods }">▼</span>
            </div>
            <div class="dimension-body" v-show="sections.periods">
              <div class="form-group">
                <label>Period Type</label>
                <select v-model="config.periodType" class="dhis2-select">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Org Units -->
          <div class="dimension-group">
            <div class="dimension-header" @click="toggleSection('orgUnits')">
              <span class="icon">🏢</span>
              <span class="label">Organisation Units</span>
              <span class="chevron" :class="{ expanded: sections.orgUnits }">▼</span>
            </div>
            <div class="dimension-body" v-show="sections.orgUnits">
              <div class="selection-list">
                <div class="list-items">
                  <div
                    v-for="unit in organizationUnits"
                    :key="unit.id"
                    class="list-item"
                  >
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        :value="unit.id"
                        v-model="config.selectedOrgUnits"
                      />
                      <span class="label-text">{{ unit.name }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Layout -->
          <div class="dimension-group">
            <div class="dimension-header" @click="toggleSection('layout')">
              <span class="icon">📐</span>
              <span class="label">Layout & Options</span>
              <span class="chevron" :class="{ expanded: sections.layout }">▼</span>
            </div>
            <div class="dimension-body" v-show="sections.layout">
               <div class="form-group">
                <label>Aggregation Type</label>
                <select v-model="config.aggregationType" class="dhis2-select">
                  <option value="count">Count</option>
                  <option value="sum">Sum</option>
                  <option value="average">Average</option>
                  <option value="min">Min</option>
                  <option value="max">Max</option>
                </select>
              </div>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="config.showTotals" /> 
                  <span class="label-text">Show row totals</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Top Toolbar -->
        <div class="toolbar">
          <div class="toolbar-left">
            <button @click="updateTable" class="update-btn" :disabled="loading">
              {{ loading ? 'Updating...' : 'Update' }}
            </button>
            <div class="divider"></div>
            <button class="toolbar-btn" @click="showLayoutModal = true">
              <span>Layout</span>
            </button>
            <button class="toolbar-btn" @click="showOptions = !showOptions">
              <span>Options</span>
            </button>
          </div>
          <div class="toolbar-right">
            <button class="toolbar-btn primary-text" @click="downloadTable">
              <span>Download</span>
              <span class="icon-sm">⬇️</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar (Chips) -->
        <div class="filter-bar" v-if="hasData">
          <div class="filter-chip">
            <span class="chip-label">Data:</span>
            <span class="chip-value">{{ config.selectedElements.length }} selected</span>
          </div>
          <div class="filter-chip">
            <span class="chip-label">Period:</span>
            <span class="chip-value">{{ config.periodType }}</span>
          </div>
          <div class="filter-chip">
            <span class="chip-label">Org Unit:</span>
            <span class="chip-value">{{ config.selectedOrgUnits.length }} selected</span>
          </div>
        </div>

        <!-- Table Area -->
        <div class="table-area">
          <div v-if="loading" class="loading-overlay">
            <div class="spinner"></div>
            <p>Loading data...</p>
          </div>
          
          <div v-else-if="!hasData" class="empty-state">
            <div class="empty-content">
              <div class="empty-icon">📊</div>
              <h2>No pivot table generated</h2>
              <p>Select a program, data elements, and periods from the sidebar, then click <strong>Update</strong>.</p>
            </div>
          </div>

          <div v-else class="pivot-container">
            <div class="table-wrapper">
              <table class="dhis2-pivot-table">
                <thead>
                  <tr>
                    <th class="corner-header">
                      <div class="corner-content">
                        <span>Data / Period</span>
                      </div>
                    </th>
                    <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in reportRows" :key="idx">
                    <td class="row-header">{{ row.cells[0].value }}</td>
                    <td v-for="(cell, cIdx) in row.cells.slice(1)" :key="cIdx" class="value-cell">
                      {{ formatNumber(cell.value) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="config.showTotals && totalsRow">
                  <tr class="total-row">
                    <td class="row-header">Total</td>
                    <td v-for="(total, tIdx) in totalsRow" :key="tIdx" class="value-cell">
                      {{ formatNumber(total) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import { ref, computed, watch, onMounted, reactive } from "vue";
import { useToast } from "../composables/useToast.js";
import EventReportsService from "../services/eventReportsService.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

const toast = useToast();

// UI State
const panelCollapsed = ref(false);
const loading = ref(false);
const showOptions = ref(false);
const showLayoutModal = ref(false);
const hasData = ref(false);

const sections = reactive({
  data: true,
  periods: false,
  orgUnits: false,
  layout: false
});

const toggleSection = (section) => {
  sections[section] = !sections[section];
};

// Configuration
const config = ref({
  program: "",
  selectedElements: [],
  periodType: "monthly",
  selectedOrgUnits: ["lusaka"],
  columnDimensions: ["data"],
  rowDimensions: ["period"],
  aggregationType: "count",
  showTotals: true,
  selectedPeriods: []
});

// Data
const availableDataElements = ref([]);
const organizationUnits = ref([
  { id: "lusaka", name: "Lusaka" },
  { id: "chongwe", name: "Chongwe" },
  { id: "kafue", name: "Kafue" },
]);

const reportRows = ref([]);
const tableHeaders = ref([]);

// Watchers
watch(() => config.value.program, async (newProgram) => {
  if (newProgram) {
    const elements = EventReportsService.getDataElementsForProgram(newProgram);
    availableDataElements.value = elements;
    config.value.selectedElements = []; // Reset selection
  } else {
    availableDataElements.value = [];
  }
});

// Methods
const toggleSelectAllElements = () => {
  if (config.value.selectedElements.length === availableDataElements.value.length) {
    config.value.selectedElements = [];
  } else {
    config.value.selectedElements = availableDataElements.value.map(el => el.id);
  }
};

const updateTable = async () => {
  if (!config.value.program) {
    toast.error("Please select a program");
    return;
  }
  if (config.value.selectedElements.length === 0) {
    toast.error("Please select at least one data element");
    return;
  }

  loading.value = true;
  try {
    const result = await EventReportsService.generateReport(config.value);
    if (result.success) {
      reportRows.value = result.rows;
      // Extract headers excluding the first one (which is usually period/category)
      tableHeaders.value = result.headers.slice(1);
      hasData.value = result.rows.length > 0;
      toast.success("Pivot table updated");
    } else {
      toast.error("Failed to generate data");
    }
  } catch (error) {
    console.error("Error updating pivot table:", error);
    toast.error("Error updating pivot table");
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num) => {
  return typeof num === 'number' ? num.toLocaleString() : num;
};

const totalsRow = computed(() => {
  if (!reportRows.value.length || !tableHeaders.value.length) return null;
  
  const totals = [];
  const numColumns = tableHeaders.value.length;
  
  for (let i = 0; i < numColumns; i++) {
    const sum = reportRows.value.reduce((acc, row) => {
      const val = parseFloat(row.cells[i + 1]?.value) || 0;
      return acc + val;
    }, 0);
    totals.push(sum);
  }
  
  return totals;
});

const downloadTable = () => {
  if (!hasData.value) {
    toast.error("No data to download");
    return;
  }
  
  const doc = new jsPDF();
  
  const head = [['Period', ...tableHeaders.value]];
  const body = reportRows.value.map(row => [
    row.cells[0].value,
    ...row.cells.slice(1).map(c => c.value)
  ]);
  
  if (config.value.showTotals && totalsRow.value) {
    body.push(['Total', ...totalsRow.value]);
  }
  
  doc.text(`Pivot Table - ${config.value.program}`, 14, 15);
  
  doc.autoTable({
    head: head,
    body: body,
    startY: 20,
    theme: 'grid',
    headStyles: { fillColor: [44, 102, 147] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
  });
  
  doc.save(`pivot-table-${new Date().toISOString().split('T')[0]}.pdf`);
  toast.success("Table downloaded as PDF");
};

onMounted(() => {
  // Initial setup if needed
});
</script>

<style scoped>
/* DHIS2 Design System Variables */
.dhis2-app-container {
  --dhis2-blue: #2b6693;
  --dhis2-blue-dark: #1d4260;
  --dhis2-blue-light: #e8f1f8;
  --dhis2-gray-bg: #f3f5f7;
  --dhis2-border: #d5d5d5;
  --dhis2-text: #212121;
  --dhis2-text-secondary: #616161;
  --dhis2-white: #ffffff;
  --dhis2-hover: #f0f2f4;
  --dhis2-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--dhis2-gray-bg);
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  color: var(--dhis2-text);
}

.app-shell {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: var(--dhis2-white);
  border-right: 1px solid var(--dhis2-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
  z-index: 10;
}

.sidebar.collapsed {
  width: 48px;
}

.sidebar-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--dhis2-border);
}

.sidebar-title {
  font-weight: 500;
  color: var(--dhis2-text);
  font-size: 0.9rem;
  text-transform: uppercase;
}

.sidebar.collapsed .sidebar-title {
  display: none;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--dhis2-text-secondary);
  padding: 4px;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

/* Dimension Groups */
.dimension-group {
  border-bottom: 1px solid var(--dhis2-border);
}

.dimension-header {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--dhis2-text);
  transition: background 0.2s;
}

.dimension-header:hover {
  background: var(--dhis2-hover);
}

.dimension-header .icon {
  margin-right: 10px;
  font-size: 1.1rem;
  color: var(--dhis2-text-secondary);
}

.dimension-header .label {
  flex: 1;
}

.dimension-header .chevron {
  font-size: 0.7rem;
  color: var(--dhis2-text-secondary);
  transition: transform 0.2s;
}

.dimension-header .chevron.expanded {
  transform: rotate(180deg);
}

.dimension-body {
  padding: 12px 16px;
  background: #fafafa;
  border-top: 1px solid #eee;
}

/* Form Elements */
.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  color: var(--dhis2-text-secondary);
}

.dhis2-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-size: 0.9rem;
  background: white;
  height: 36px;
}

.dhis2-select:focus {
  border-color: var(--dhis2-blue);
  outline: none;
}

.info-message {
  font-size: 0.85rem;
  color: var(--dhis2-text-secondary);
  font-style: italic;
  padding: 8px;
  background: #eee;
  border-radius: 2px;
}

.selection-list {
  border: 1px solid #ccc;
  border-radius: 2px;
  background: white;
  max-height: 200px;
  overflow-y: auto;
}

.list-control {
  padding: 8px;
  border-bottom: 1px solid #eee;
  background: #f5f5f5;
}

.list-item {
  padding: 6px 8px;
  border-bottom: 1px solid #f5f5f5;
}

.list-item:hover {
  background: var(--dhis2-hover);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  margin: 0;
}

.label-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Toolbar */
.toolbar {
  height: 48px;
  background: var(--dhis2-white);
  border-bottom: 1px solid var(--dhis2-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  z-index: 5;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.update-btn {
  background-color: var(--dhis2-blue);
  color: white;
  border: none;
  padding: 0 16px;
  height: 32px;
  border-radius: 2px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.2s;
}

.update-btn:hover:not(:disabled) {
  background-color: var(--dhis2-blue-dark);
}

.update-btn:disabled {
  background-color: #a0b8cc;
  cursor: not-allowed;
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--dhis2-border);
  margin: 0 8px;
}

.toolbar-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 2px;
  padding: 0 12px;
  height: 32px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--dhis2-text);
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.toolbar-btn:hover {
  background: var(--dhis2-hover);
}

.toolbar-btn.primary-text {
  color: var(--dhis2-blue);
}

.icon-sm {
  font-size: 0.8rem;
}

/* Filter Bar */
.filter-bar {
  padding: 8px 16px;
  background: white;
  border-bottom: 1px solid var(--dhis2-border);
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-chip {
  background: #e8f1f8;
  border: 1px solid #b3d4f0;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 0.85rem;
  display: flex;
  gap: 6px;
  color: var(--dhis2-text);
}

.chip-label {
  color: var(--dhis2-text-secondary);
  font-weight: 500;
}

.chip-value {
  font-weight: 500;
  color: var(--dhis2-blue);
}

/* Table Area */
.table-area {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.pivot-container {
  flex: 1;
  background: white;
  border: 1px solid var(--dhis2-border);
  box-shadow: var(--dhis2-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
}

.dhis2-pivot-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  white-space: nowrap;
}

.dhis2-pivot-table th {
  background: #f3f5f7;
  color: var(--dhis2-text);
  font-weight: 600;
  padding: 10px 12px;
  border: 1px solid #d5d5d5;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 2;
}

.dhis2-pivot-table td {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  color: var(--dhis2-text);
}

.dhis2-pivot-table td.row-header {
  background: #fafafa;
  font-weight: 500;
  position: sticky;
  left: 0;
  z-index: 1;
  border-right: 1px solid #d5d5d5;
}

.dhis2-pivot-table td.value-cell {
  text-align: right;
}

.total-row td {
  background: #f5f5f5;
  font-weight: bold;
  border-top: 2px solid #bbb;
}

.corner-header {
  z-index: 3 !important;
  left: 0;
  top: 0;
  background: #e8f1f8 !important;
}

/* Empty & Loading States */
.empty-state, .loading-overlay {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px dashed var(--dhis2-border);
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.2;
}

.empty-content h2 {
  font-size: 1.2rem;
  color: var(--dhis2-text);
  margin-bottom: 8px;
}

.empty-content p {
  color: var(--dhis2-text-secondary);
  line-height: 1.5;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 100;
  flex-direction: column;
  gap: 16px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--dhis2-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
