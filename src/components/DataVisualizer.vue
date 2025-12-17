<template>
  <div class="dhis2-app-container">
    <TopHeader v-if="showHeader" />
    
    <div class="app-shell">
      <!-- Left Sidebar - Configuration -->
      <aside class="sidebar" :class="{ collapsed: panelCollapsed }">
        <div class="sidebar-header">
          <h2 class="app-title">Data Visualizer</h2>
          <button @click="updateVisualization" class="update-btn-primary" :disabled="loading">
            {{ loading ? 'Updating...' : 'Update' }}
          </button>
        </div>

        <div class="sidebar-content">
          <!-- Data Selection -->
          <details class="accordion-item" open>
            <summary class="accordion-header">
              <span class="icon">📊</span> Data
              <span class="chevron">▼</span>
            </summary>
            <div class="accordion-content">
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
                      Select All
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
                        {{ element.name }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="info-box">
                Select a program to view data elements.
              </div>
            </div>
          </details>

          <!-- Period Selection -->
          <details class="accordion-item">
            <summary class="accordion-header">
              <span class="icon">📅</span> Periods
              <span class="chevron">▼</span>
            </summary>
            <div class="accordion-content">
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
              
              <div class="period-info">
                <p>Relative periods selected by default.</p>
              </div>
            </div>
          </details>

          <!-- Org Units -->
          <details class="accordion-item">
            <summary class="accordion-header">
              <span class="icon">🏢</span> Organisation Units
              <span class="chevron">▼</span>
            </summary>
            <div class="accordion-content">
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
                      {{ unit.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Top Toolbar -->
        <div class="toolbar">
          <div class="toolbar-left">
            <div class="chart-type-selector">
              <button 
                v-for="type in chartTypes" 
                :key="type.id"
                class="chart-type-btn"
                :class="{ active: chartType === type.id }"
                @click="chartType = type.id"
                :title="type.name"
              >
                <span class="chart-icon">{{ type.icon }}</span>
              </button>
            </div>
          </div>
          <div class="toolbar-right">
            <button class="toolbar-btn" @click="downloadChart">
              <span>⬇️</span> Download
            </button>
            <button class="toolbar-btn" @click="showOptions = !showOptions">
              <span>⚙️</span> Options
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="filter-group">
            <span class="filter-label">Series:</span>
            <div class="filter-chip">Data Elements</div>
          </div>
          <div class="filter-group">
            <span class="filter-label">Category:</span>
            <div class="filter-chip">Period</div>
          </div>
          <div class="filter-group">
            <span class="filter-label">Filter:</span>
            <div class="filter-chip">Org Unit</div>
          </div>
        </div>

        <!-- Visualization Area -->
        <div class="visualization-area">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading visualization...</p>
          </div>
          
          <div v-else-if="!hasData" class="empty-state">
            <div class="placeholder-content">
              <span class="placeholder-icon">📊</span>
              <h2>No data to visualize</h2>
              <p>Select a program and data elements, then click Update.</p>
            </div>
          </div>

          <div v-else class="chart-container">
            <div class="chart-wrapper">
              <Bar
                v-if="chartType === 'column' || chartType === 'bar'"
                :data="chartData"
                :options="chartOptions"
              />
              <Line
                v-else-if="chartType === 'line' || chartType === 'area'"
                :data="chartData"
                :options="chartOptions"
              />
              <Pie
                v-else-if="chartType === 'pie'"
                :data="chartData"
                :options="chartOptions"
              />
              <div v-else-if="chartType === 'pivot'" class="pivot-table-container">
                <table class="dhis2-pivot-table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in reportRows" :key="idx">
                      <td class="row-header">{{ row.cells[0].value }}</td>
                      <td v-for="(cell, cIdx) in row.cells.slice(1)" :key="cIdx">
                        {{ formatNumber(cell.value) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useToast } from "../composables/useToast.js";
import EventReportsService from "../services/eventReportsService.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line, Pie } from 'vue-chartjs'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true
  }
});

const toast = useToast();

// UI State
const panelCollapsed = ref(false);
const loading = ref(false);
const showOptions = ref(false);
const chartType = ref('column');
const hasData = ref(false);

// Configuration
const config = ref({
  program: "",
  selectedElements: [],
  periodType: "monthly",
  selectedOrgUnits: ["lusaka"],
  columnDimensions: ["data"],
  rowDimensions: ["period"],
  aggregationType: "sum"
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

// Chart Types
const chartTypes = [
  { id: 'column', name: 'Column', icon: '📊' },
  { id: 'bar', name: 'Bar', icon: '📶' },
  { id: 'line', name: 'Line', icon: '📈' },
  { id: 'area', name: 'Area', icon: '🗻' },
  { id: 'pie', name: 'Pie', icon: '🥧' },
  { id: 'pivot', name: 'Pivot Table', icon: '▦' }
];

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

const updateVisualization = async () => {
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
      toast.success("Visualization updated");
    } else {
      toast.error("Failed to generate data");
    }
  } catch (error) {
    console.error("Error updating visualization:", error);
    toast.error("Error updating visualization");
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num) => {
  return typeof num === 'number' ? num.toLocaleString() : num;
};

const downloadChart = () => {
  toast.info("Download feature coming soon");
};

// Chart Data Computed Properties
const getChartColor = (index) => {
  const colors = [
    '#2c6693', '#1d4260', '#4a148c', '#6a1b9a', '#7b1fa2', 
    '#8e24aa', '#9c27b0', '#ab47bc', '#ba68c8', '#ce93d8'
  ];
  return colors[index % colors.length];
};

const chartData = computed(() => {
  if (!reportRows.value.length) return { labels: [], datasets: [] };

  // Labels are the first cell of each row (usually Period)
  const labels = reportRows.value.map(row => row.cells[0].value);

  // Datasets correspond to columns (Data Elements)
  const datasets = tableHeaders.value.map((header, idx) => {
    const data = reportRows.value.map(row => row.cells[idx + 1]?.value || 0);
    const color = getChartColor(idx);
    
    return {
      label: header,
      data: data,
      backgroundColor: (chartType.value === 'line' || chartType.value === 'area') ? 'rgba(44, 102, 147, 0.2)' : color,
      borderColor: (chartType.value === 'line' || chartType.value === 'area') ? color : color,
      borderWidth: 1,
      fill: chartType.value === 'area',
      tension: 0.4
    };
  });

  return {
    labels,
    datasets
  };
});

const chartOptions = computed(() => {
  const isHorizontal = chartType.value === 'bar';
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: isHorizontal ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      },
      title: {
        display: true,
        text: config.value.program ? config.value.program.replace(/-/g, ' ').toUpperCase() : 'Chart'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: chartType.value === 'pie' ? {
      x: { display: false },
      y: { display: false }
    } : {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: { size: 11 },
          color: '#666'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
          drawBorder: false
        },
        ticks: {
          font: { size: 11 },
          color: '#666'
        }
      }
    }
  };
});

onMounted(() => {
  // Initial setup if needed
});
</script>

<style scoped>
/* DHIS2 Design System Variables */
.dhis2-app-container {
  --dhis2-blue: #2c6693;
  --dhis2-blue-dark: #1d4260;
  --dhis2-blue-light: #e8f1f8;
  --dhis2-gray-bg: #f3f5f7;
  --dhis2-border: #d5d5d5;
  --dhis2-text: #212121;
  --dhis2-text-secondary: #616161;
  --dhis2-white: #ffffff;
  --dhis2-hover: #f0f2f4;
  
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--dhis2-gray-bg);
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: var(--dhis2-text);
}

.app-shell {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar Styles */
.sidebar {
  width: 300px;
  background: var(--dhis2-white);
  border-right: 1px solid var(--dhis2-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 10;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--dhis2-border);
  background: var(--dhis2-white);
}

.app-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 12px 0;
  color: var(--dhis2-blue);
}

.update-btn-primary {
  width: 100%;
  background-color: var(--dhis2-blue);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.update-btn-primary:hover:not(:disabled) {
  background-color: var(--dhis2-blue-dark);
}

.update-btn-primary:disabled {
  background-color: #a0b8cc;
  cursor: not-allowed;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

/* Accordion Styles */
.accordion-item {
  border-bottom: 1px solid var(--dhis2-border);
}

.accordion-header {
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  background: var(--dhis2-white);
  transition: background 0.2s;
  list-style: none;
}

.accordion-header:hover {
  background: var(--dhis2-hover);
}

.accordion-header::-webkit-details-marker {
  display: none;
}

.accordion-content {
  padding: 16px;
  background: #fcfcfc;
  border-top: 1px solid var(--dhis2-border);
}

.icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

.chevron {
  font-size: 0.8rem;
  color: var(--dhis2-text-secondary);
}

details[open] .chevron {
  transform: rotate(180deg);
}

/* Form Elements */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: var(--dhis2-text-secondary);
}

.dhis2-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.9rem;
  background: white;
}

.info-box {
  padding: 12px;
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 3px;
  font-size: 0.9rem;
  color: #0d47a1;
}

.selection-list {
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
  max-height: 200px;
  overflow-y: auto;
}

.list-control {
  padding: 8px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
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
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
}

.toolbar {
  height: 48px;
  border-bottom: 1px solid var(--dhis2-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  background: var(--dhis2-white);
}

.chart-type-selector {
  display: flex;
  gap: 4px;
}

.chart-type-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.chart-type-btn:hover {
  background: var(--dhis2-hover);
  border-color: #ccc;
}

.chart-type-btn.active {
  background: var(--dhis2-blue-light);
  border-color: var(--dhis2-blue);
}

.toolbar-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--dhis2-text);
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-btn:hover {
  background: var(--dhis2-hover);
}

/* Filter Bar */
.filter-bar {
  height: 40px;
  background: #fcfcfc;
  border-bottom: 1px solid var(--dhis2-border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.filter-label {
  color: var(--dhis2-text-secondary);
}

.filter-chip {
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.8rem;
}

/* Visualization Area */
.visualization-area {
  flex: 1;
  padding: 20px;
  overflow: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.empty-state {
  text-align: center;
  color: var(--dhis2-text-secondary);
}

.placeholder-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
  opacity: 0.5;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--dhis2-text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--dhis2-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Pivot Table */
.pivot-table-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.dhis2-pivot-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.dhis2-pivot-table th {
  background: #f3f5f7;
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
  font-weight: 600;
}

.dhis2-pivot-table td {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: right;
}

.dhis2-pivot-table td.row-header {
  text-align: left;
  background: #fafafa;
  font-weight: 500;
}

.period-info {
  padding: 8px;
  background: #f9f9f9;
  border-radius: 3px;
  margin-top: 8px;
}

.period-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--dhis2-text-secondary);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .dhis2-app-container {
    height: auto;
    min-height: 100vh;
  }

  .app-shell {
    flex-direction: column;
  }

  /* Sidebar */
  .sidebar {
    width: 100%;
    max-height: 60vh;
    border-right: none;
    border-bottom: 1px solid var(--dhis2-border);
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 10px 12px;
  }

  .app-title {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .update-btn-primary {
    padding: 10px 16px;
    font-size: 0.9rem;
    min-height: 44px;
  }

  .sidebar-content {
    padding-bottom: 16px;
  }

  .accordion-header {
    padding: 10px 12px;
    font-size: 0.9rem;
  }

  .accordion-content {
    padding: 12px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group label {
    font-size: 0.85rem;
  }

  .dhis2-select {
    padding: 10px 8px;
    font-size: 16px; /* Prevent iOS zoom */
    min-height: 44px;
  }

  .selection-list {
    max-height: 180px;
  }

  .list-control,
  .list-item {
    padding: 8px;
  }

  .checkbox-label {
    font-size: 0.85rem;
    min-height: 40px;
  }

  .info-box {
    padding: 10px;
    font-size: 0.85rem;
  }

  /* Main content */
  .main-content {
    flex: 1;
  }

  /* Toolbar */
  .toolbar {
    height: auto;
    min-height: 48px;
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
    gap: 8px;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }

  .chart-type-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    width: 100%;
  }

  .chart-type-btn {
    padding: 10px;
    font-size: 1.5rem;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toolbar-right {
    display: flex;
    gap: 8px;
  }

  .toolbar-btn {
    flex: 1;
    padding: 8px 12px;
    font-size: 0.85rem;
    min-height: 40px;
    justify-content: center;
  }

  /* Filter bar */
  .filter-bar {
    height: auto;
    min-height: 40px;
    flex-wrap: wrap;
    padding: 8px 12px;
    gap: 8px;
  }

  .filter-group {
    font-size: 0.8rem;
  }

  .filter-chip {
    font-size: 0.75rem;
    padding: 3px 10px;
  }

  /* Visualization area */
  .visualization-area {
    padding: 12px;
  }

  .chart-container {
    min-height: 300px;
  }

  /* Pivot table */
  .pivot-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dhis2-pivot-table {
    min-width: 600px;
    font-size: 11px;
  }

  .dhis2-pivot-table th,
  .dhis2-pivot-table td {
    padding: 8px 6px;
    font-size: 11px;
  }

  /* Empty/Loading states */
  .placeholder-icon {
    font-size: 3rem;
  }

  .empty-state h2 {
    font-size: 1.2rem;
  }

  .empty-state p {
    font-size: 0.9rem;
    padding: 0 16px;
  }

  .spinner {
    width: 36px;
    height: 36px;
  }

  .period-info p {
    font-size: 0.8rem;
  }
}

/* Very Small Screens */
@media (max-width: 480px) {
  .sidebar {
    max-height: 50vh;
  }

  .sidebar-header {
    padding: 8px 10px;
  }

  .app-title {
    font-size: 0.95rem;
  }

  .update-btn-primary {
    padding: 10px 12px;
    font-size: 0.85rem;
  }

  .accordion-header {
    padding: 8px 10px;
    font-size: 0.85rem;
  }

  .icon {
    font-size: 1rem;
  }

  .accordion-content {
    padding: 10px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .checkbox-label {
    font-size: 0.8rem;
  }

  /* Toolbar */
  .toolbar {
    padding: 6px;
  }

  .chart-type-selector {
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }

  .chart-type-btn {
    padding: 8px;
    font-size: 1.3rem;
    min-height: 44px;
  }

  .toolbar-btn {
    padding: 8px 10px;
    font-size: 0.8rem;
  }

  /* Filter bar */
  .filter-bar {
    padding: 6px 10px;
    gap: 6px;
  }

  .filter-group {
    font-size: 0.75rem;
  }

  .filter-chip {
    font-size: 0.7rem;
    padding: 2px 8px;
  }

  /* Visualization */
  .visualization-area {
    padding: 8px;
  }

  .chart-container {
    min-height: 250px;
  }

  /* Pivot table */
  .dhis2-pivot-table {
    min-width: 500px;
    font-size: 10px;
  }

  .dhis2-pivot-table th,
  .dhis2-pivot-table td {
    padding: 6px 4px;
    font-size: 10px;
  }

  /* Empty/Loading states */
  .placeholder-icon {
    font-size: 2.5rem;
  }

  .empty-state h2 {
    font-size: 1.1rem;
  }

  .empty-state p {
    font-size: 0.85rem;
  }

  .spinner {
    width: 32px;
    height: 32px;
  }

  .loading-state p {
    font-size: 0.85rem;
  }
}

/* Landscape orientation for tablets */
@media (max-width: 1024px) and (orientation: landscape) {
  .sidebar {
    max-height: 40vh;
  }

  .accordion-content {
    max-height: 150px;
    overflow-y: auto;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  /* Enhanced touch targets */
  .accordion-header {
    min-height: 44px;
  }

  .checkbox-label {
    min-height: 44px;
    padding: 8px 0;
  }

  .chart-type-btn {
    min-height: 48px;
    min-width: 48px;
  }

  .toolbar-btn,
  .update-btn-primary {
    min-height: 44px;
  }

  /* Visual feedback */
  .accordion-header:active {
    background: var(--dhis2-blue-light);
  }

  .chart-type-btn:active {
    transform: scale(0.95);
  }

  .toolbar-btn:active {
    background: var(--dhis2-blue-light);
  }
}
</style>
