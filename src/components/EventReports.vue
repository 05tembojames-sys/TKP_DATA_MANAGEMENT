<template>
  <div class="dhis2-app-container">
    <TopHeader />
    
    <div class="app-shell">
      <!-- Left Sidebar - Report Configuration -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2 class="app-title">Event Reports</h2>
          <button 
            @click="updateReport" 
            class="update-btn-primary"
            :disabled="loading"
          >
            {{ loading ? "Loading..." : "Update" }}
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
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div v-if="config.periodType === 'custom'" class="custom-dates">
                <div class="form-group">
                  <label>Start Date</label>
                  <input type="date" v-model="config.startDate" class="dhis2-input" />
                </div>
                <div class="form-group">
                  <label>End Date</label>
                  <input type="date" v-model="config.endDate" class="dhis2-input" />
                </div>
              </div>

              <div v-else class="selection-list">
                <div class="list-control">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      :checked="availablePeriods.length > 0 && config.selectedPeriods.length === availablePeriods.length"
                      @change="toggleSelectAllPeriods"
                    />
                    Select All
                  </label>
                </div>
                <div class="list-items">
                  <div
                    v-for="period in availablePeriods"
                    :key="period.id"
                    class="list-item"
                  >
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        :value="period.id"
                        v-model="config.selectedPeriods"
                      />
                      {{ period.name }}
                    </label>
                  </div>
                </div>
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

          <!-- Layout -->
          <details class="accordion-item">
            <summary class="accordion-header">
              <span class="icon">📐</span> Layout
              <span class="chevron">▼</span>
            </summary>
            <div class="accordion-content">
              <div class="form-group">
                <label>Columns</label>
                <select multiple v-model="config.columnDimensions" class="dhis2-select multiple">
                  <option value="data">Data Elements</option>
                  <option value="period">Period</option>
                  <option value="orgUnit">Organization Unit</option>
                </select>
              </div>
              <div class="form-group">
                <label>Rows</label>
                <select multiple v-model="config.rowDimensions" class="dhis2-select multiple">
                  <option value="data">Data Elements</option>
                  <option value="period">Period</option>
                  <option value="orgUnit">Organization Unit</option>
                </select>
              </div>
            </div>
          </details>
          
          <!-- Options -->
          <details class="accordion-item">
            <summary class="accordion-header">
              <span class="icon">⚙️</span> Options
              <span class="chevron">▼</span>
            </summary>
            <div class="accordion-content">
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="config.showTotals" /> Show row totals
                </label>
              </div>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="config.showSubtotals" /> Show subtotals
                </label>
              </div>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="config.hideEmptyRows" /> Hide empty rows
                </label>
              </div>
              <div class="form-group">
                <label>Row Limit</label>
                <input type="number" v-model="config.rowLimit" class="dhis2-input" placeholder="No limit" />
              </div>
            </div>
          </details>
          
          <div class="sidebar-actions">
             <button @click="resetConfiguration" class="btn-text">Reset all</button>
             <button @click="fixDatabaseStatus" class="btn-text danger">Fix Status</button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Toolbar -->
        <div class="toolbar">
          <div class="toolbar-left">
            <div class="btn-group">
              <button 
                @click="currentView = 'table'" 
                class="toolbar-btn" 
                :class="{ active: currentView === 'table' }"
              >
                Table
              </button>
              <button 
                @click="currentView = 'chart'" 
                class="toolbar-btn" 
                :class="{ active: currentView === 'chart' }"
              >
                Chart
              </button>
              <button 
                @click="currentView = 'line-list'" 
                class="toolbar-btn" 
                :class="{ active: currentView === 'line-list' }"
              >
                Line List
              </button>
            </div>
          </div>
          <div class="toolbar-right">
            <button @click="saveAsFavorite" class="toolbar-btn icon-btn" title="Favorites">
              ⭐ Favorites
            </button>
            <div class="dropdown-container">
              <button @click="showDownloadMenu = !showDownloadMenu" class="toolbar-btn icon-btn">
                ⬇️ Download
              </button>
              <div v-if="showDownloadMenu" class="dropdown-menu">
                <button @click="downloadReport('excel')">Excel</button>
                <button @click="downloadReport('csv')">CSV</button>
                <button @click="downloadReport('pdf')">PDF</button>
                <button @click="downloadReport('json')">JSON</button>
              </div>
            </div>
            <button @click="shareReport" class="toolbar-btn icon-btn">🔗 Share</button>
          </div>
        </div>

        <!-- Visualization Area -->
        <div class="visualization-area">
          <!-- Loading -->
          <div v-if="loading" class="loading-overlay">
            <div class="spinner"></div>
            <p>Loading report data...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!tableHeaders || tableHeaders.length === 0" class="empty-placeholder">
            <div class="placeholder-content">
              <span class="placeholder-icon">📊</span>
              <h3>No data generated</h3>
              <p>Select items from the left menu and click Update.</p>
            </div>
          </div>

          <!-- Table View -->
          <div v-else-if="currentView === 'table'" class="view-container table-view">
            <div class="table-scroll">
              <table class="dhis2-table">
                <thead>
                  <tr>
                    <th v-for="(header, index) in tableHeaders" :key="index" @click="sortByColumn(index)">
                      {{ header }}
                      <span v-if="sortColumn === index" class="sort-arrow">
                        {{ sortDirection === "asc" ? "▲" : "▼" }}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in displayedRows" :key="rowIndex" :class="{ 'total-row': row.isTotal }">
                    <td v-for="(cell, cellIndex) in row.cells" :key="cellIndex" :class="cell.class">
                      {{ formatCellValue(cell.value, cell.type) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="config.showTotals && totalsRow">
                  <tr>
                    <td v-for="(total, index) in totalsRow" :key="index" class="total-cell">
                      {{ formatCellValue(total, "number") }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination-bar">
              <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">Previous</button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">Next</button>
            </div>
          </div>

          <!-- Chart View -->
          <div v-else-if="currentView === 'chart'" class="view-container chart-view">
            <div class="chart-controls">
               <select v-model="chartType" class="dhis2-select inline">
                 <option value="bar">Bar Chart</option>
                 <option value="column">Column Chart</option>
                 <option value="line">Line Chart</option>
                 <option value="area">Area Chart</option>
                 <option value="pie">Pie Chart</option>
               </select>
               <button @click="downloadChart" class="btn-small">Download Image</button>
            </div>
            <div class="chart-canvas">
               <div v-if="reportData && reportData.length > 0" class="chart-wrapper">
                  <h4 class="chart-title">{{ chartTitle }}</h4>
                  
                  <!-- Chart.js Visualization -->
                  <div class="chart-container" style="position: relative; height: 100%; width: 100%; min-height: 400px;">
                    <Bar
                      v-if="chartType === 'bar' || chartType === 'column'"
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
                  </div>
               </div>
               <div v-else class="empty-placeholder">
                  <div class="placeholder-content">
                    <span class="placeholder-icon">📊</span>
                    <p>No data to visualize</p>
                  </div>
               </div>
            </div>
          </div>

          <!-- Line List View -->
          <div v-else-if="currentView === 'line-list'" class="view-container line-list-view">
            <div class="list-toolbar">
              <input type="text" v-model="searchQuery" placeholder="Search events..." class="dhis2-input search-box" />
              <select v-model="lineListStatusFilter" class="dhis2-select inline">
                <option value="">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="pending">Pending</option>
              </select>
              <button @click="exportLineList" class="btn-small">Export PDF</button>
            </div>
            
            <div class="table-scroll">
              <table class="dhis2-table striped">
                <thead>
                  <tr>
                    <th><input type="checkbox" v-model="selectAllEvents" @change="toggleSelectAll" /></th>
                    <th>Date</th>
                    <th>Child Name</th>
                    <th>Program</th>
                    <th>Org Unit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in paginatedLineList" :key="event.id">
                    <td><input type="checkbox" :value="event.id" v-model="selectedEvents" /></td>
                    <td>{{ formatDate(event.date) }}</td>
                    <td>{{ event.childName }}</td>
                    <td>{{ formatProgramName(event.program) }}</td>
                    <td>{{ event.orgUnit }}</td>
                    <td><span class="status-tag" :class="event.status">{{ event.status }}</span></td>
                    <td>
                      <button @click="viewEventDetails(event)" class="btn-link">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="pagination-bar">
               <span>Showing {{ lineListStartIndex + 1 }}-{{ Math.min(lineListEndIndex, filteredLineList.length) }} of {{ filteredLineList.length }}</span>
               <div class="btn-group">
                 <button @click="lineListCurrentPage--" :disabled="lineListCurrentPage === 1" class="page-btn">Prev</button>
                 <button @click="lineListCurrentPage++" :disabled="lineListCurrentPage === lineListTotalPages" class="page-btn">Next</button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Favorites Modal (Preserved) -->
    <div v-if="showFavoritesModal" class="modal-overlay" @click="showFavoritesModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Save Favorite</h3>
          <button @click="showFavoritesModal = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <input v-model="favoriteName" class="dhis2-input" placeholder="Name" />
          <textarea v-model="favoriteDescription" class="dhis2-input" placeholder="Description"></textarea>
        </div>
        <div class="modal-footer">
          <button @click="confirmSaveFavorite" class="btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "../composables/useToast.js";
import EventReportsService from "../services/eventReportsService.js";
import AuthService from "../services/auth.js";
import { fixFormStatus } from "../utils/fixFormStatus.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
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

const router = useRouter();
const toast = useToast();

// UI State
const panelCollapsed = ref(false);
const currentView = ref("table");
const loading = ref(false);
const showDownloadMenu = ref(false);
const showFavoritesModal = ref(false);

// Configuration
const config = ref({
  program: "",
  selectedElements: [],
  periodType: "monthly",
  startDate: "",
  endDate: "",
  selectedPeriods: [],
  selectedOrgUnits: [],
  columnDimensions: ["data"],
  rowDimensions: ["period"],
  filterDimensions: [],
  showTotals: true,
  showSubtotals: false,
  hideEmptyRows: true,
  showHierarchy: false,
  aggregationType: "sum",
  outputType: "event",
  rowLimit: null,
});

// Data
// Initialize with empty array, will be populated based on selected program
const availableDataElements = ref([]);

// Watch for program changes to update available data elements
watch(
  () => config.value.program,
  (newProgram) => {
    if (newProgram) {
      // Dynamically update data elements based on program
      const elements =
        EventReportsService.getDataElementsForProgram(newProgram);
      availableDataElements.value = elements;
      
      // Clear previously selected elements when program changes
      config.value.selectedElements = [];
    } else {
      // Reset to empty when no program selected
      availableDataElements.value = [];
      config.value.selectedElements = [];
    }
  }
);

const organizationUnits = ref([
  { id: "lusaka", name: "Lusaka" },
  { id: "chongwe", name: "Chongwe" },
  { id: "kafue", name: "Kafue" },
]);

const availablePeriods = computed(() => {
  const periods = [];
  const now = new Date();

  if (config.value.periodType === "weekly") {
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7);
      periods.push({
        id: `week-${i}`,
        name: `Week ${52 - i}, ${weekStart.getFullYear()}`,
      });
    }
  } else if (config.value.periodType === "monthly") {
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      periods.push({
        id: `month-${i}`,
        name: month.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      });
    }
  } else if (config.value.periodType === "quarterly") {
    for (let i = 0; i < 8; i++) {
      const quarter = Math.floor((now.getMonth() - i * 3) / 3) + 1;
      const year = now.getFullYear() - Math.floor(i / 4);
      periods.push({
        id: `q${quarter}-${year}`,
        name: `Q${quarter} ${year}`,
      });
    }
  } else if (config.value.periodType === "yearly") {
    for (let i = 0; i < 5; i++) {
      const year = now.getFullYear() - i;
      periods.push({
        id: `year-${year}`,
        name: `${year}`,
      });
    }
  }

  return periods;
});

// Report Data
const reportData = ref([]);
const tableHeaders = ref([]);
const sortColumn = ref(null);
const sortDirection = ref("asc");
const currentPage = ref(1);
const rowsPerPage = ref(50);
const chartType = ref("bar");
const chartMaxItems = ref(10);
const searchQuery = ref("");
const lineListSort = ref("date-desc");
const lineListStatusFilter = ref("");
const lineListCurrentPage = ref(1);
const lineListPageSize = ref(25);
const selectedEvents = ref([]);
const selectAllEvents = ref(false);

// Favorites
const favoriteName = ref("");
const favoriteDescription = ref("");

// Mock line list data - will be replaced with real data when report is generated
const mockLineListEvents = ref([]);

// Computed
const filteredLineList = computed(() => {
  if (!mockLineListEvents.value || mockLineListEvents.value.length === 0)
    return [];

  let filtered = [...mockLineListEvents.value];

  // Apply search filter
  if (searchQuery.value && searchQuery.value.trim()) {
    const search = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        (event.childName && event.childName.toLowerCase().includes(search)) ||
        (event.program && event.program.toLowerCase().includes(search)) ||
        (event.orgUnit && event.orgUnit.toLowerCase().includes(search)) ||
        (event.status && event.status.toLowerCase().includes(search))
    );
  }

  // Apply status filter
  if (lineListStatusFilter.value) {
    filtered = filtered.filter(
      (event) => event.status && event.status.toLowerCase() === lineListStatusFilter.value.toLowerCase()
    );
  }

  // Apply sorting
  if (lineListSort.value === "date-desc") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (lineListSort.value === "date-asc") {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (lineListSort.value === "name-asc") {
    filtered.sort((a, b) =>
      (a.childName || "").localeCompare(b.childName || "")
    );
  } else if (lineListSort.value === "name-desc") {
    filtered.sort((a, b) =>
      (b.childName || "").localeCompare(a.childName || "")
    );
  }

  return filtered;
});

const paginatedLineList = computed(() => {
  const start = (lineListCurrentPage.value - 1) * parseInt(lineListPageSize.value);
  const end = start + parseInt(lineListPageSize.value);
  return filteredLineList.value.slice(start, end);
});

const lineListTotalPages = computed(() => {
  return Math.ceil(filteredLineList.value.length / parseInt(lineListPageSize.value));
});

const lineListStartIndex = computed(() => {
  return (lineListCurrentPage.value - 1) * parseInt(lineListPageSize.value);
});

const lineListEndIndex = computed(() => {
  return lineListStartIndex.value + parseInt(lineListPageSize.value);
});

const visiblePages = computed(() => {
  const total = lineListTotalPages.value;
  const current = lineListCurrentPage.value;
  const pages = [];
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages.filter(p => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p));
});

const uniqueChildrenCount = computed(() => {
  const uniqueNames = new Set(filteredLineList.value.map(e => e.childName).filter(n => n));
  return uniqueNames.size;
});

const chartTitle = computed(() => {
  if (!config.value.program) return 'Event Report';
  const programNames = {
    'initial-referral': 'Initial Referrals',
    'child-overview': 'Child Overview',
    'initial-assessment': 'Initial Assessments',
    'medical-intake': 'Medical Intake',
  };
  return programNames[config.value.program] || 'Event Report';
});

// Chart Helpers
const getChartColor = (index) => {
  const colors = [
    '#2c6693', '#1d4260', '#4a148c', '#6a1b9a', '#7b1fa2', 
    '#8e24aa', '#9c27b0', '#ab47bc', '#ba68c8', '#ce93d8'
  ];
  return colors[index % colors.length];
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const chartData = computed(() => {
  if (!reportData.value || reportData.value.length === 0) {
    return { labels: [], datasets: [] };
  }

  const data = reportData.value.slice(0, chartMaxItems.value);
  const labels = data.map(row => truncateText(row.cells[0]?.value || 'Unknown', 20));
  const values = data.map(row => row.cells[1]?.value || 0);
  
  const backgroundColors = data.map((_, idx) => getChartColor(idx));

  return {
    labels,
    datasets: [
      {
        label: tableHeaders.value[1] || 'Value',
        data: values,
        backgroundColor: (chartType.value === 'line' || chartType.value === 'area') ? 'rgba(44, 102, 147, 0.2)' : backgroundColors,
        borderColor: (chartType.value === 'line' || chartType.value === 'area') ? '#2c6693' : backgroundColors,
        borderWidth: 1,
        fill: chartType.value === 'area',
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#2c6693',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
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
        display: chartType.value === 'pie',
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            } else if (context.parsed !== null) {
               label += context.parsed;
            }
            return label;
          }
        }
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
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    }
  };
});

const displayedRows = computed(() => {
  if (!reportData.value || reportData.value.length === 0) return [];

  let rows = [...reportData.value];

  // Apply sorting
  if (sortColumn.value !== null) {
    rows.sort((a, b) => {
      const aVal = a.cells[sortColumn.value]?.value;
      const bVal = b.cells[sortColumn.value]?.value;

      if (sortDirection.value === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  // Apply pagination
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return rows.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil((reportData.value?.length || 0) / rowsPerPage.value);
});

const totalsRow = computed(() => {
  if (!reportData.value || reportData.value.length === 0) return null;

  const totals = [];
  const numColumns = tableHeaders.value.length;

  for (let i = 0; i < numColumns; i++) {
    if (i === 0) {
      totals.push("Total");
    } else {
      const sum = reportData.value.reduce((acc, row) => {
        const val = parseFloat(row.cells[i]?.value) || 0;
        return acc + val;
      }, 0);
      totals.push(sum);
    }
  }

  return totals;
});

// Methods
const toggleSelectAllElements = () => {
  if (config.value.selectedElements.length === availableDataElements.value.length) {
    // If all are selected, deselect all
    config.value.selectedElements = [];
  } else {
    // If not all are selected, select all
    config.value.selectedElements = availableDataElements.value.map(el => el.id);
  }
};

const toggleSelectAllPeriods = () => {
  if (config.value.selectedPeriods.length === availablePeriods.value.length) {
    // If all are selected, deselect all
    config.value.selectedPeriods = [];
  } else {
    // If not all are selected, select all
    config.value.selectedPeriods = availablePeriods.value.map(p => p.id);
  }
};

const updateReport = async () => {
  // Validation
  if (!config.value.program) {
    toast.error("Please select a program/event type first");
    return;
  }

  if (config.value.selectedElements.length === 0) {
    toast.error("Please select at least one data element");
    return;
  }

  // Validate period selection
  if (config.value.periodType === "custom") {
    if (!config.value.startDate || !config.value.endDate) {
      toast.error("Please select both start and end dates for custom range");
      return;
    }
    if (new Date(config.value.startDate) > new Date(config.value.endDate)) {
      toast.error("Start date must be before end date");
      return;
    }
  }

  loading.value = true;

  try {
    console.log("Updating report with config:", config.value);

    // If no periods selected (and not custom), select all available periods automatically
    if (
      config.value.selectedPeriods.length === 0 &&
      config.value.periodType !== "custom"
    ) {
      console.log("No periods selected, auto-selecting all available periods");
      config.value.selectedPeriods = availablePeriods.value.map((p) => p.id);
      toast.info("Auto-selected all available periods");
    }

    // Fetch real data from Firebase
    const result = await EventReportsService.generateReport(config.value);

    if (result.success) {
      // Use real data from service
      tableHeaders.value = result.headers;
      reportData.value = result.rows;

      // Update line list data if available
      if (result.lineList && result.lineList.length > 0) {
        mockLineListEvents.value = result.lineList;
      } else {
        mockLineListEvents.value = [];
      }

      // Reset to first page when new data loads
      currentPage.value = 1;

      if (reportData.value.length === 0) {
        toast.warning(
          "No data found for the selected criteria. Try selecting different periods or adjusting filters."
        );
      } else {
        toast.success(
          `Report generated successfully with ${reportData.value.length} row(s)`
        );
      }
    } else {
      throw new Error(result.error || "Failed to generate report");
    }
  } catch (error) {
    console.error("Report generation error:", error);
    toast.error("Failed to generate report: " + error.message);

    // Fallback to empty data
    reportData.value = [];
    tableHeaders.value = [];
    mockLineListEvents.value = [];
  } finally {
    loading.value = false;
  }
};

// This function is no longer used as we're using real data
// Kept for reference only
const generateMockReportData = () => {
  console.log(
    "Mock data generation is deprecated - using real data from Firebase"
  );
};

const sortByColumn = (columnIndex) => {
  if (sortColumn.value === columnIndex) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = columnIndex;
    sortDirection.value = "asc";
  }
};

const formatCellValue = (value, type) => {
  if (value === null || value === undefined) return "-";

  if (type === "number") {
    return typeof value === "number" ? value.toLocaleString() : value;
  }

  return value;
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const downloadReport = (format) => {
  toast.info(`Downloading report as ${format.toUpperCase()}...`);
  showDownloadMenu.value = false;

  setTimeout(() => {
    toast.success("Report downloaded successfully");
  }, 1000);
};

const shareReport = () => {
  toast.success("Share link copied to clipboard");
};

const printReport = () => {
  window.print();
};

const saveAsFavorite = () => {
  favoriteName.value = "";
  favoriteDescription.value = "";
  showFavoritesModal.value = true;
};

const confirmSaveFavorite = () => {
  if (!favoriteName.value) {
    toast.error("Please enter a favorite name");
    return;
  }

  toast.success("Report saved as favorite");
  showFavoritesModal.value = false;
};

const resetConfiguration = () => {
  config.value = {
    program: "",
    selectedElements: [],
    periodType: "monthly",
    startDate: "",
    endDate: "",
    selectedPeriods: [],
    selectedOrgUnits: ["lusaka"],
    columnDimensions: ["data"],
    rowDimensions: ["period"],
    filterDimensions: [],
    showTotals: true,
    showSubtotals: false,
    hideEmptyRows: true,
    showHierarchy: false,
    aggregationType: "sum",
    outputType: "event",
    rowLimit: null,
  };
  reportData.value = [];
  tableHeaders.value = [];
  mockLineListEvents.value = [];
  availableDataElements.value = [];
  currentPage.value = 1;
  toast.info("Configuration reset to defaults");
};

const viewEventDetails = (event) => {
  toast.info(`Opening event details for ${event.childName || 'Unknown'}...`);
  // TODO: Navigate to event details page or open modal
};

const editEvent = (event) => {
  toast.info(`Editing event for ${event.childName || 'Unknown'}...`);
  // TODO: Navigate to edit form
};



const downloadChart = () => {
  toast.info('Downloading chart...');
  setTimeout(() => toast.success('Chart downloaded successfully'), 500);
};







const formatProgramName = (program) => {
  const names = {
    'initial-referral': 'Initial Referral',
    'child-overview': 'Child Overview',
    'initial-assessment': 'Initial Assessment',
    'medical-intake': 'Medical Intake',
  };
  return names[program] || program;
};

const getStatusCount = (status) => {
  return filteredLineList.value.filter(e => e.status && e.status.toLowerCase() === status.toLowerCase()).length;
};

const toggleSelectAll = () => {
  if (selectAllEvents.value) {
    selectedEvents.value = paginatedLineList.value.map(e => e.id);
  } else {
    selectedEvents.value = [];
  }
};

const clearSelection = () => {
  selectedEvents.value = [];
  selectAllEvents.value = false;
};

const exportLineList = () => {
  generatePDF(filteredLineList.value, 'Event Report - Full List');
};

const bulkExport = () => {
  const selectedData = filteredLineList.value.filter(e => selectedEvents.value.includes(e.id));
  generatePDF(selectedData, `Event Report - ${selectedEvents.value.length} Selected Events`);
};

const generatePDF = (data, title) => {
  if (!data || data.length === 0) {
    toast.error('No data to export');
    return;
  }

  try {
    // Create PDF content
    const content = [];
    
    // Header
    content.push(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { color: #4a148c; border-bottom: 3px solid #4a148c; padding-bottom: 10px; }
      .meta { color: #666; margin: 10px 0 20px 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th { background: #4a148c; color: white; padding: 12px; text-align: left; font-weight: 600; }
      td { padding: 10px; border-bottom: 1px solid #ddd; }
      tr:nth-child(even) { background: #f8f9fa; }
      .status { padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: 600; }
      .status.submitted { background: #d1ecf1; color: #0c5460; }
      .status.completed { background: #d4edda; color: #155724; }
      .status.pending { background: #fff3cd; color: #856404; }
      .status.draft { background: #e2e3e5; color: #383d41; }
      .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; text-align: center; }
    </style></head><body>`);
    
    // Title and metadata
    content.push(`<h1>${title}</h1>`);
    content.push(`<div class="meta">`);
    content.push(`Generated: ${new Date().toLocaleString()}<br>`);
    content.push(`Total Records: ${data.length}<br>`);
    if (config.value.program) {
      content.push(`Program: ${formatProgramName(config.value.program)}<br>`);
    }
    content.push(`</div>`);
    
    // Table
    content.push('<table>');
    content.push('<thead><tr>');
    content.push('<th>#</th>');
    content.push('<th>Date</th>');
    content.push('<th>Child Name</th>');
    content.push('<th>Program</th>');
    content.push('<th>Status</th>');
    content.push('<th>Age</th>');
    content.push('<th>Gender</th>');
    content.push('</tr></thead>');
    content.push('<tbody>');
    
    data.forEach((event, index) => {
      content.push('<tr>');
      content.push(`<td>${index + 1}</td>`);
      content.push(`<td>${formatDate(event.date)}</td>`);
      content.push(`<td><strong>${event.childName || 'Unknown'}</strong></td>`);
      content.push(`<td>${formatProgramName(event.program)}</td>`);
      content.push(`<td><span class="status ${event.status}">${event.status}</span></td>`);
      content.push(`<td>${event.data?.age || event.data?.ageAtIntake || '-'}</td>`);
      content.push(`<td>${event.data?.gender || '-'}</td>`);
      content.push('</tr>');
    });
    
    content.push('</tbody></table>');
    
    // Footer
    content.push(`<div class="footer">The Kukhoma Project - Event Reports<br> ${new Date().getFullYear()}</div>`);
    content.push('</body></html>');
    
    // Create blob and trigger download as HTML (can be saved as PDF by browser)
    const htmlContent = content.join('');
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${data.length} events as PDF-ready HTML. Open in browser and Print to PDF (Ctrl+P)`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate export file');
  }
};



// Navigation methods
const goBack = () => {
  router.push("/dashboard");
};

const fixDatabaseStatus = async () => {
  const confirmed = window.confirm(
    'This will update all completed forms with "draft" status to "submitted" status. Continue?'
  );
  
  if (!confirmed) return;
  
  try {
    loading.value = true;
    toast.info('Fixing form status in database...');
    
    const result = await fixFormStatus();
    
    if (result.success) {
      toast.success(`✅ Updated ${result.updatedCount} forms to "submitted" status`);
      
      // Reload the report to show updated statuses
      if (config.value.program) {
        await updateReport();
      }
    } else {
      toast.error('Failed to fix form status: ' + result.error);
    }
  } catch (error) {
    console.error('Error fixing form status:', error);
    toast.error('Error fixing form status: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  const result = await AuthService.logout();
  if (result.success) {
    router.push("/login");
  }
};

// Lifecycle
onMounted(async () => {
  // Initialize with correct org unit ID (lusaka is the first one)
  config.value.selectedOrgUnits = ["lusaka"];

  // Initialize with empty data elements until program is selected
  availableDataElements.value = [];

  // Optionally load summary statistics on mount
  try {
    const statsResult = await EventReportsService.getSummaryStatistics();
    if (statsResult.success) {
      console.log("Event reports statistics:", statsResult.statistics);
    }
  } catch (error) {
    console.error("Error loading statistics:", error);
    // Don't show error toast on mount, just log it
  }
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

.accordion-header .icon {
  margin-right: 8px;
  opacity: 0.7;
}

.accordion-header .chevron {
  font-size: 0.7rem;
  color: var(--dhis2-text-secondary);
  transition: transform 0.2s;
}

.accordion-item[open] .accordion-header .chevron {
  transform: rotate(180deg);
}

.accordion-content {
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
  font-size: 0.85rem;
  color: var(--dhis2-text-secondary);
  margin-bottom: 4px;
}

.dhis2-select,
.dhis2-input,
.dhis2-textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #a0a0a0;
  border-radius: 2px;
  font-size: 0.9rem;
  background: white;
}

.dhis2-select:focus,
.dhis2-input:focus {
  border-color: var(--dhis2-blue);
  outline: none;
}

.dhis2-select.multiple {
  height: 100px;
}

.selection-list {
  border: 1px solid #ccc;
  border-radius: 2px;
  background: white;
  max-height: 200px;
  overflow-y: auto;
}

.list-control {
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
  background: #f5f5f5;
}

.list-item {
  padding: 4px 8px;
  border-bottom: 1px solid #f5f5f5;
}

.list-item:hover {
  background: var(--dhis2-blue-light);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
}

.checkbox-group {
  margin-bottom: 8px;
}

.sidebar-actions {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-text {
  background: none;
  border: none;
  color: var(--dhis2-text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
  text-align: left;
  padding: 4px 0;
}

.btn-text:hover {
  text-decoration: underline;
}

.btn-text.danger {
  color: #d32f2f;
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
  padding: 0 16px;
  background: var(--dhis2-white);
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-group {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 3px;
  overflow: hidden;
}

.toolbar-btn {
  background: white;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  color: var(--dhis2-text);
  border-right: 1px solid #ccc;
}

.toolbar-btn:last-child {
  border-right: none;
}

.toolbar-btn:hover {
  background: var(--dhis2-hover);
}

.toolbar-btn.active {
  background: var(--dhis2-blue);
  color: white;
}

.toolbar-btn.icon-btn {
  border: 1px solid transparent;
  border-radius: 3px;
}

.toolbar-btn.icon-btn:hover {
  background: var(--dhis2-hover);
  border-color: #ccc;
}

/* Visualization Area */
.visualization-area {
  flex: 1;
  overflow: auto;
  padding: 16px;
  position: relative;
  background: #fcfcfc;
}

.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-scroll {
  flex: 1;
  overflow: auto;
  border: 1px solid var(--dhis2-border);
  background: white;
}

/* DHIS2 Table Styles */
.dhis2-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  white-space: nowrap;
}

.dhis2-table th {
  background: #f3f5f7;
  color: var(--dhis2-text);
  font-weight: 600;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
  position: sticky;
  top: 0;
  z-index: 2;
  cursor: pointer;
}

.dhis2-table th:hover {
  background: #e0e0e0;
}

.dhis2-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #f0f0f0;
}

.dhis2-table.striped tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.dhis2-table tbody tr:hover {
  background-color: var(--dhis2-blue-light) !important;
}

.total-row td {
  font-weight: bold;
  background-color: #f5f5f5;
  border-top: 2px solid #ccc;
}

.status-tag {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: bold;
}

.status-tag.submitted { background: #e8f5e9; color: #2e7d32; }
.status-tag.pending { background: #fff3e0; color: #ef6c00; }
.status-tag.draft { background: #eceff1; color: #546e7a; }

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 8px 0;
  margin-top: 8px;
  font-size: 0.9rem;
}

.page-btn {
  padding: 4px 12px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 3px;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Loading & Empty States */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--dhis2-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.placeholder-content {
  text-align: center;
}

.placeholder-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
  opacity: 0.3;
}

/* Chart Styles */
.chart-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.chart-canvas {
  flex: 1;
  border: 1px solid #eee;
  background: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  text-align: center;
  margin-bottom: 20px;
  color: var(--dhis2-text);
}

.visual-chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: 20px;
}

.bar-chart {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 12px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 150px;
  text-align: right;
  font-size: 12px;
  color: #666;
}

.bar-track {
  flex: 1;
  background: #f5f5f5;
  height: 24px;
  border-radius: 0 3px 3px 0;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 0 3px 3px 0;
  transition: width 0.5s ease;
}

.bar-value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: bold;
  color: #333;
}

.col-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  max-width: 60px;
}

.col-track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.col-fill {
  width: 80%;
  border-radius: 3px 3px 0 0;
  transition: height 0.5s ease;
}

.col-label {
  margin-top: 8px;
  font-size: 11px;
  text-align: center;
  transform: rotate(-45deg);
  transform-origin: top left;
  white-space: nowrap;
  width: 100%;
}

/* Line List Toolbar */
.list-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.dhis2-select.inline {
  width: auto;
  min-width: 150px;
}

/* Dropdown Menu */
.dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 3px;
  z-index: 100;
  min-width: 120px;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-menu button:hover {
  background: #f5f5f5;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 400px;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--dhis2-blue);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 16px;
}

.modal-body input, .modal-body textarea {
  margin-bottom: 12px;
}

.modal-footer {
  padding: 12px 16px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
  text-align: right;
}

.btn-primary {
  background: var(--dhis2-blue);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--dhis2-blue-dark);
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
}

.btn-link {
  background: none;
  border: none;
  color: var(--dhis2-blue);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .app-shell {
    flex-direction: column;
    height: calc(100vh - 48px); /* Account for TopHeader */
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    max-height: 70vh;
    border-right: none;
    border-bottom: 1px solid #d5d5d5;
    overflow-y: auto;
    position: relative;
    z-index: 10;
  }
  
  .sidebar.mobile-hidden {
    display: none;
  }
  
  .sidebar-header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 5;
    padding: 12px;
  }
  
  .sidebar-header h2 {
    font-size: 1rem;
  }
  
  .update-btn-primary {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .sidebar-content {
    padding-bottom: 60px; /* Space for mobile actions */
  }
  
  .accordion-header {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  .accordion-content {
    padding: 8px 12px;
  }
  
  .selection-list {
    max-height: 150px;
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    overflow: hidden;
  }
  
  /* Toolbar - Make it responsive */
  .toolbar {
    height: auto;
    min-height: 48px;
    flex-wrap: wrap;
    padding: 8px;
    gap: 8px;
  }
  
  .toolbar-left, .toolbar-right {
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .toolbar-left {
    width: 100%;
    justify-content: center;
    order: 2;
  }
  
  .toolbar-right {
    width: 100%;
    justify-content: center;
    order: 3;
    margin-top: 4px;
  }
  
  .btn-group {
    width: 100%;
    justify-content: stretch;
  }
  
  .toolbar-btn {
    padding: 8px 10px;
    font-size: 0.85rem;
    flex: 1;
  }
  
  .toolbar-btn.icon-btn {
    flex: auto;
    white-space: nowrap;
  }
  
  /* Visualization Area */
  .visualization-area {
    padding: 8px;
    overflow-x: hidden;
  }
  
  /* Table View - Enable horizontal scroll */
  .table-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .dhis2-table {
    font-size: 12px;
    min-width: 600px; /* Force horizontal scroll for wide tables */
  }
  
  .dhis2-table th,
  .dhis2-table td {
    padding: 6px 8px;
    font-size: 11px;
  }
  
  .dhis2-table th {
    white-space: nowrap;
  }
  
  /* Chart View */
  .chart-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .chart-controls select,
  .chart-controls button {
    width: 100%;
  }
  
  .chart-canvas {
    padding: 12px;
    min-height: 300px;
  }
  
  .chart-container {
    min-height: 300px !important;
  }
  
  .chart-title {
    font-size: 1rem;
    margin-bottom: 12px;
  }
  
  /* Line List View */
  .list-toolbar {
    flex-direction: column;
    gap: 8px;
  }
  
  .list-toolbar input,
  .list-toolbar select,
  .list-toolbar button {
    width: 100%;
  }
  
  /* Pagination */
  .pagination-bar {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    font-size: 0.85rem;
  }
  
  .pagination-bar span {
    width: 100%;
    text-align: center;
    order: -1;
  }
  
  .page-btn {
    padding: 6px 16px;
    font-size: 0.85rem;
  }
  
  /* Modal on Mobile */
  .modal-content {
    width: 90%;
    max-width: 400px;
    margin: 0 16px;
  }
  
  .modal-header h3 {
    font-size: 1rem;
  }
  
  .modal-body {
    padding: 12px;
  }
  
  /* Dropdown Menu */
  .dropdown-menu {
    position: fixed;
    top: auto;
    right: 8px;
    left: 8px;
    width: auto;
  }
  
  /* Chart Types - Specific adjustments */
  .pie-chart-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .pie-chart-svg {
    width: 240px;
    height: 240px;
  }
  
  .pie-legend {
    max-height: 200px;
    width: 100%;
  }
  
  /* Bar chart adjustments */
  .bar-label {
    width: 100px;
    font-size: 10px;
  }
  
  .bar-track {
    height: 20px;
  }
  
  .bar-value {
    font-size: 10px;
    right: 4px;
  }
  
  /* Empty state */
  .placeholder-icon {
    font-size: 32px;
  }
  
  .placeholder-content h3 {
    font-size: 1rem;
  }
  
  .placeholder-content p {
    font-size: 0.9rem;
  }
  
  /* Status tags */
  .status-tag {
    font-size: 10px;
    padding: 2px 4px;
  }
  
  /* Form elements in modals */
  .dhis2-input,
  .dhis2-select,
  .dhis2-textarea {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

/* Very small screens */
@media (max-width: 480px) {
  .sidebar-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .app-title {
    font-size: 0.9rem;
  }
  
  .update-btn-primary {
    width: 100%;
  }
  
  .toolbar {
    padding: 6px;
  }
  
  .toolbar-btn {
    font-size: 0.8rem;
    padding: 6px 8px;
  }
  
  .dhis2-table {
    font-size: 10px;
  }
  
  .dhis2-table th,
  .dhis2-table td {
    padding: 4px 6px;
    font-size: 10px;
  }
  
  .chart-canvas {
    padding: 8px;
  }
  
  .chart-container {
    min-height: 250px !important;
  }
  
  .modal-content {
    width: 95%;
    margin: 0 8px;
  }
  
  .btn-group {
    flex-direction: column;
  }
  
  .toolbar-btn {
    border-right: none;
    border-bottom: 1px solid #ccc;
  }
  
  .toolbar-btn:last-child {
    border-bottom: none;
  }
}

.chart-point {
  transition: r 0.2s;
  cursor: pointer;
}

.chart-point:hover {
  r: 6;
  stroke-width: 3;
}

.chart-line {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-area {
  stroke-linejoin: round;
}

.pie-chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  height: 100%;
}

.pie-chart-svg {
  width: 320px;
  height: 320px;
  overflow: visible;
}

.pie-slice {
  transition: transform 0.2s;
  cursor: pointer;
}

.pie-slice:hover {
  transform: scale(1.05);
  z-index: 10;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-value {
  font-weight: bold;
  margin-left: auto;
}
</style>
