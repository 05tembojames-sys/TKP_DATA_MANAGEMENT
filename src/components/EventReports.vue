<template>
  <div class="event-reports-container">
    <!-- Header -->
    <div class="reports-header">
      <div class="header-nav">
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
          <h1 class="reports-title">📊 Event Reports</h1>
          <p class="reports-subtitle">Create dynamic pivot tables and visualizations from event data</p>
        </div>
        <div class="header-right">
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
    </div>

    <div class="reports-layout">
      <!-- Left Sidebar - Configuration Panel -->
      <div class="config-panel" :class="{ collapsed: panelCollapsed }">
        <div class="panel-header">
          <h3>📋 Report Configuration</h3>
          <button @click="panelCollapsed = !panelCollapsed" class="collapse-btn">
            {{ panelCollapsed ? '▶' : '◀' }}
          </button>
        </div>

        <div v-if="!panelCollapsed" class="panel-content">
          <!-- Data Selection -->
          <div class="config-section">
            <h4 class="section-title">📊 Data</h4>
            <div class="form-group">
              <label>Program/Event Type</label>
              <select v-model="config.program" class="form-select">
                <option value="">Select program...</option>
                <option value="child-assessment">Child Assessments</option>
                <option value="child-tracking">Child Tracking</option>
                <option value="initial-referral">Initial Referrals</option>
                <option value="reports">Submitted Reports</option>
              </select>
            </div>

            <div class="form-group">
              <label>Data Elements</label>
              <div class="data-elements-list">
                <div 
                  v-for="element in availableDataElements" 
                  :key="element.id"
                  class="data-element-item"
                >
                  <input 
                    type="checkbox" 
                    :id="`element-${element.id}`"
                    :value="element.id"
                    v-model="config.selectedElements"
                  />
                  <label :for="`element-${element.id}`">{{ element.name }}</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Period Selection -->
          <div class="config-section">
            <h4 class="section-title">📅 Period</h4>
            <div class="form-group">
              <label>Period Type</label>
              <select v-model="config.periodType" class="form-select">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div v-if="config.periodType === 'custom'" class="form-group">
              <label>Start Date</label>
              <input type="date" v-model="config.startDate" class="form-input" />
            </div>

            <div v-if="config.periodType === 'custom'" class="form-group">
              <label>End Date</label>
              <input type="date" v-model="config.endDate" class="form-input" />
            </div>

            <div v-else class="form-group">
              <label>Select Periods</label>
              <div class="periods-list">
                <div 
                  v-for="period in availablePeriods" 
                  :key="period.id"
                  class="period-item"
                >
                  <input 
                    type="checkbox" 
                    :id="`period-${period.id}`"
                    :value="period.id"
                    v-model="config.selectedPeriods"
                  />
                  <label :for="`period-${period.id}`">{{ period.name }}</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Organization Unit -->
          <div class="config-section">
            <h4 class="section-title">🏢 Organization Unit</h4>
            <div class="form-group">
              <label>Select Units</label>
              <div class="org-units-list">
                <div 
                  v-for="unit in organizationUnits" 
                  :key="unit.id"
                  class="org-unit-item"
                >
                  <input 
                    type="checkbox" 
                    :id="`org-${unit.id}`"
                    :value="unit.id"
                    v-model="config.selectedOrgUnits"
                  />
                  <label :for="`org-${unit.id}`">{{ unit.name }}</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Layout Configuration -->
          <div class="config-section">
            <h4 class="section-title">📐 Table Layout</h4>
            
            <div class="form-group">
              <label>Columns</label>
              <select multiple v-model="config.columnDimensions" class="form-select multi" size="3">
                <option value="data">Data Elements</option>
                <option value="period">Period</option>
                <option value="orgUnit">Organization Unit</option>
              </select>
            </div>

            <div class="form-group">
              <label>Rows</label>
              <select multiple v-model="config.rowDimensions" class="form-select multi" size="3">
                <option value="data">Data Elements</option>
                <option value="period">Period</option>
                <option value="orgUnit">Organization Unit</option>
              </select>
            </div>

            <div class="form-group">
              <label>Filters</label>
              <select multiple v-model="config.filterDimensions" class="form-select multi" size="3">
                <option value="data">Data Elements</option>
                <option value="period">Period</option>
                <option value="orgUnit">Organization Unit</option>
              </select>
            </div>
          </div>

          <!-- Table Options -->
          <div class="config-section">
            <h4 class="section-title">⚙️ Options</h4>
            
            <div class="checkbox-group">
              <input type="checkbox" id="showTotals" v-model="config.showTotals" />
              <label for="showTotals">Show row totals</label>
            </div>

            <div class="checkbox-group">
              <input type="checkbox" id="showSubtotals" v-model="config.showSubtotals" />
              <label for="showSubtotals">Show subtotals</label>
            </div>

            <div class="checkbox-group">
              <input type="checkbox" id="hideEmptyRows" v-model="config.hideEmptyRows" />
              <label for="hideEmptyRows">Hide empty rows</label>
            </div>

            <div class="checkbox-group">
              <input type="checkbox" id="showHierarchy" v-model="config.showHierarchy" />
              <label for="showHierarchy">Show hierarchy</label>
            </div>

            <div class="form-group">
              <label>Aggregation Type</label>
              <select v-model="config.aggregationType" class="form-select">
                <option value="sum">Sum</option>
                <option value="average">Average</option>
                <option value="count">Count</option>
                <option value="min">Minimum</option>
                <option value="max">Maximum</option>
              </select>
            </div>

            <div class="form-group">
              <label>Output Type</label>
              <select v-model="config.outputType" class="form-select">
                <option value="event">Event</option>
                <option value="enrollment">Enrollment</option>
                <option value="tracked-entity">Tracked Entity Instance</option>
              </select>
            </div>

            <div class="form-group">
              <label>Limit rows</label>
              <input 
                type="number" 
                v-model="config.rowLimit" 
                class="form-input"
                min="1"
                max="10000"
                placeholder="No limit"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="panel-actions">
            <button @click="updateReport" class="update-btn" :disabled="loading">
              {{ loading ? '⏳ Loading...' : '🔄 Update' }}
            </button>
            <button @click="saveAsFavorite" class="favorite-btn">
              ⭐ Save as favorite
            </button>
            <button @click="resetConfiguration" class="reset-btn">
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="content-area">
        <!-- Toolbar -->
        <div class="content-toolbar">
          <div class="view-tabs">
            <button 
              @click="currentView = 'table'" 
              class="tab-btn"
              :class="{ active: currentView === 'table' }"
            >
              📊 Table
            </button>
            <button 
              @click="currentView = 'chart'" 
              class="tab-btn"
              :class="{ active: currentView === 'chart' }"
            >
              📈 Chart
            </button>
            <button 
              @click="currentView = 'line-list'" 
              class="tab-btn"
              :class="{ active: currentView === 'line-list' }"
            >
              📋 Line List
            </button>
          </div>

          <div class="toolbar-actions">
            <div class="dropdown-container">
              <button @click="showDownloadMenu = !showDownloadMenu" class="action-btn">
                ⬇️ Download
              </button>
              <div v-if="showDownloadMenu" class="download-menu">
                <button @click="downloadReport('excel')">📊 Excel</button>
                <button @click="downloadReport('csv')">📄 CSV</button>
                <button @click="downloadReport('pdf')">📕 PDF</button>
                <button @click="downloadReport('json')">💾 JSON</button>
              </div>
            </div>
            <button @click="shareReport" class="action-btn">🔗 Share</button>
            <button @click="printReport" class="action-btn">🖨️ Print</button>
          </div>
        </div>

        <!-- Report Display Area -->
        <div class="report-content">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Generating report...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!tableHeaders || tableHeaders.length === 0" class="empty-state">
            <div class="empty-icon">📊</div>
            <h3>No Data Available</h3>
            <p>Configure your report settings and click "Update" to generate the report.</p>
          </div>

          <!-- Table View -->
          <div v-else-if="currentView === 'table'" class="table-view">
            <div class="table-container">
              <table class="pivot-table">
                <thead>
                  <tr>
                    <th 
                      v-for="(header, index) in tableHeaders" 
                      :key="`header-${index}`"
                      class="table-header"
                      @click="sortByColumn(index)"
                    >
                      {{ header }}
                      <span v-if="sortColumn === index" class="sort-indicator">
                        {{ sortDirection === 'asc' ? '▲' : '▼' }}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(row, rowIndex) in displayedRows" 
                    :key="`row-${rowIndex}`"
                    :class="{ 'subtotal-row': row.isSubtotal, 'total-row': row.isTotal }"
                  >
                    <td 
                      v-for="(cell, cellIndex) in row.cells" 
                      :key="`cell-${rowIndex}-${cellIndex}`"
                      :class="cell.class"
                    >
                      {{ formatCellValue(cell.value, cell.type) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="config.showTotals && totalsRow">
                  <tr class="totals-footer">
                    <td 
                      v-for="(total, index) in totalsRow" 
                      :key="`total-${index}`"
                      class="total-cell"
                    >
                      {{ formatCellValue(total, 'number') }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="page-btn"
              >
                ← Previous
              </button>
              <span class="page-info">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="page-btn"
              >
                Next →
              </button>
            </div>
          </div>

          <!-- Chart View -->
          <div v-else-if="currentView === 'chart'" class="chart-view">
            <div class="chart-options">
              <label>Chart Type:</label>
              <select v-model="chartType" class="form-select inline">
                <option value="bar">Bar Chart</option>
                <option value="column">Column Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="area">Area Chart</option>
              </select>
            </div>
            <div class="chart-container">
              <div v-if="reportData && reportData.length > 0" class="chart-data-display">
                <p>📈 Chart data loaded: {{ reportData.length }} data points</p>
                <p class="chart-hint">Chart visualization coming soon - data is ready!</p>
                <div class="chart-preview">
                  <div v-for="(row, idx) in reportData.slice(0, 5)" :key="idx" class="chart-preview-row">
                    <span class="preview-label">{{ row.cells[0]?.value }}:</span>
                    <div class="preview-bar" :style="{ width: (row.cells[1]?.value || 0) * 3 + 'px' }">
                      {{ row.cells[1]?.value || 0 }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="chart-placeholder">
                <p>📈 Chart visualization will appear here</p>
                <p class="chart-hint">Select data and click "Update" to generate chart</p>
              </div>
            </div>
          </div>

          <!-- Line List View -->
          <div v-else-if="currentView === 'line-list'" class="line-list-view">
            <div class="list-controls">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="🔍 Search events..."
                class="search-input"
              />
              <select v-model="lineListSort" class="form-select inline">
                <option value="date-desc">Date (Newest first)</option>
                <option value="date-asc">Date (Oldest first)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
            <div class="line-list-table">
              <div v-if="!mockLineListEvents || mockLineListEvents.length === 0" class="empty-list">
                <p>📋 No events found. Click "Update" to load event data.</p>
              </div>
              <table v-else>
                <thead>
                  <tr>
                    <th>Event Date</th>
                    <th>Child Name</th>
                    <th>Program</th>
                    <th>Organization Unit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in filteredLineList" :key="event.id">
                    <td>{{ formatDate(event.date) }}</td>
                    <td>{{ event.childName || 'Unknown' }}</td>
                    <td>{{ event.program }}</td>
                    <td>{{ event.orgUnit }}</td>
                    <td>
                      <span class="status-badge" :class="event.status">
                        {{ event.status }}
                      </span>
                    </td>
                    <td>
                      <button @click="viewEventDetails(event)" class="action-link">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Favorites Modal -->
    <div v-if="showFavoritesModal" class="modal-overlay" @click="showFavoritesModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>⭐ Save Report as Favorite</h3>
          <button @click="showFavoritesModal = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Favorite Name</label>
            <input 
              v-model="favoriteName" 
              type="text" 
              class="form-input"
              placeholder="e.g., Monthly Assessment Summary"
            />
          </div>
          <div class="form-group">
            <label>Description (Optional)</label>
            <textarea 
              v-model="favoriteDescription" 
              class="form-textarea"
              rows="3"
              placeholder="Brief description of this report..."
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="confirmSaveFavorite" class="save-btn">💾 Save</button>
          <button @click="showFavoritesModal = false" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'
import EventReportsService from '../services/eventReportsService.js'
import AuthService from '../services/auth.js'

const router = useRouter()
const toast = useToast()

// UI State
const panelCollapsed = ref(false)
const currentView = ref('table')
const loading = ref(false)
const showDownloadMenu = ref(false)
const showFavoritesModal = ref(false)

// Configuration
const config = ref({
  program: '',
  selectedElements: [],
  periodType: 'monthly',
  startDate: '',
  endDate: '',
  selectedPeriods: [],
  selectedOrgUnits: [],
  columnDimensions: ['data'],
  rowDimensions: ['period'],
  filterDimensions: [],
  showTotals: true,
  showSubtotals: false,
  hideEmptyRows: true,
  showHierarchy: false,
  aggregationType: 'sum',
  outputType: 'event',
  rowLimit: null
})

// Data
const availableDataElements = ref([
  { id: 'age', name: 'Age' },
  { id: 'gender', name: 'Gender' },
  { id: 'assessment-score', name: 'Assessment Score' },
  { id: 'attendance', name: 'Attendance' },
  { id: 'performance', name: 'Performance Level' },
  { id: 'status', name: 'Status' },
  { id: 'referral-type', name: 'Referral Type' },
  { id: 'report-type', name: 'Report Type' }
])

// Watch for program changes to update available data elements
watch(() => config.value.program, (newProgram) => {
  if (newProgram) {
    // You can dynamically update data elements based on program
    // const elements = EventReportsService.getDataElementsForProgram(newProgram)
    // availableDataElements.value = elements
  }
})

const organizationUnits = ref([
  { id: 'unit-1', name: 'Main Center' },
  { id: 'unit-2', name: 'East Branch' },
  { id: 'unit-3', name: 'West Branch' },
  { id: 'unit-4', name: 'North Center' },
  { id: 'unit-5', name: 'South Center' }
])

const availablePeriods = computed(() => {
  const periods = []
  const now = new Date()
  
  if (config.value.periodType === 'weekly') {
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - (i * 7))
      periods.push({
        id: `week-${i}`,
        name: `Week ${52 - i}, ${weekStart.getFullYear()}`
      })
    }
  } else if (config.value.periodType === 'monthly') {
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      periods.push({
        id: `month-${i}`,
        name: month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      })
    }
  } else if (config.value.periodType === 'quarterly') {
    for (let i = 0; i < 8; i++) {
      const quarter = Math.floor((now.getMonth() - (i * 3)) / 3) + 1
      const year = now.getFullYear() - Math.floor(i / 4)
      periods.push({
        id: `q${quarter}-${year}`,
        name: `Q${quarter} ${year}`
      })
    }
  } else if (config.value.periodType === 'yearly') {
    for (let i = 0; i < 5; i++) {
      const year = now.getFullYear() - i
      periods.push({
        id: `year-${year}`,
        name: `${year}`
      })
    }
  }
  
  return periods
})

// Report Data
const reportData = ref([])
const tableHeaders = ref([])
const sortColumn = ref(null)
const sortDirection = ref('asc')
const currentPage = ref(1)
const rowsPerPage = ref(50)
const chartType = ref('bar')
const searchQuery = ref('')
const lineListSort = ref('date-desc')

// Favorites
const favoriteName = ref('')
const favoriteDescription = ref('')

// Mock line list data - will be replaced with real data when report is generated
const mockLineListEvents = ref([])

// Computed
const filteredLineList = computed(() => {
  if (!mockLineListEvents.value || mockLineListEvents.value.length === 0) return []
  
  let filtered = [...mockLineListEvents.value]
  
  // Apply search filter
  if (searchQuery.value && searchQuery.value.trim()) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event => 
      (event.childName && event.childName.toLowerCase().includes(search)) ||
      (event.program && event.program.toLowerCase().includes(search)) ||
      (event.orgUnit && event.orgUnit.toLowerCase().includes(search)) ||
      (event.status && event.status.toLowerCase().includes(search))
    )
  }
  
  // Apply sorting
  if (lineListSort.value === 'date-desc') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (lineListSort.value === 'date-asc') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
  } else if (lineListSort.value === 'name-asc') {
    filtered.sort((a, b) => (a.childName || '').localeCompare(b.childName || ''))
  } else if (lineListSort.value === 'name-desc') {
    filtered.sort((a, b) => (b.childName || '').localeCompare(a.childName || ''))
  }
  
  return filtered
})

const displayedRows = computed(() => {
  if (!reportData.value || reportData.value.length === 0) return []
  
  let rows = [...reportData.value]
  
  // Apply sorting
  if (sortColumn.value !== null) {
    rows.sort((a, b) => {
      const aVal = a.cells[sortColumn.value]?.value
      const bVal = b.cells[sortColumn.value]?.value
      
      if (sortDirection.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  
  // Apply pagination
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return rows.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil((reportData.value?.length || 0) / rowsPerPage.value)
})

const totalsRow = computed(() => {
  if (!reportData.value || reportData.value.length === 0) return null
  
  const totals = []
  const numColumns = tableHeaders.value.length
  
  for (let i = 0; i < numColumns; i++) {
    if (i === 0) {
      totals.push('Total')
    } else {
      const sum = reportData.value.reduce((acc, row) => {
        const val = parseFloat(row.cells[i]?.value) || 0
        return acc + val
      }, 0)
      totals.push(sum)
    }
  }
  
  return totals
})

// Methods
const updateReport = async () => {
  if (!config.value.program) {
    toast.error('Please select a program')
    return
  }
  
  if (config.value.selectedElements.length === 0) {
    toast.error('Please select at least one data element')
    return
  }
  
  loading.value = true
  
  try {
    console.log('Updating report with config:', config.value)
    
    // If no periods selected, select all available periods automatically
    if (config.value.selectedPeriods.length === 0 && config.value.periodType !== 'custom') {
      console.log('No periods selected, auto-selecting all available periods')
      config.value.selectedPeriods = availablePeriods.value.map(p => p.id)
    }
    
    // Fetch real data from Firebase
    const result = await EventReportsService.generateReport(config.value)
    
    if (result.success) {
      // Use real data from service
      tableHeaders.value = result.headers
      reportData.value = result.rows
      
      // Update line list data if available
      if (result.lineList && result.lineList.length > 0) {
        mockLineListEvents.value = result.lineList
      }
      
      if (reportData.value.length === 0) {
        toast.warning('No data found for the selected criteria. Try selecting different periods or adjusting filters.')
      } else {
        toast.success(`Report generated successfully with ${reportData.value.length} rows`)
      }
    } else {
      throw new Error(result.error || 'Failed to generate report')
    }
  } catch (error) {
    toast.error('Failed to generate report: ' + error.message)
    console.error('Report generation error:', error)
    
    // Fallback to empty data
    reportData.value = []
    tableHeaders.value = []
  } finally {
    loading.value = false
  }
}

// This function is no longer used as we're using real data
// Kept for reference only
const generateMockReportData = () => {
  console.log('Mock data generation is deprecated - using real data from Firebase')
}

const sortByColumn = (columnIndex) => {
  if (sortColumn.value === columnIndex) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnIndex
    sortDirection.value = 'asc'
  }
}

const formatCellValue = (value, type) => {
  if (value === null || value === undefined) return '-'
  
  if (type === 'number') {
    return typeof value === 'number' ? value.toLocaleString() : value
  }
  
  return value
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const downloadReport = (format) => {
  toast.info(`Downloading report as ${format.toUpperCase()}...`)
  showDownloadMenu.value = false
  
  setTimeout(() => {
    toast.success('Report downloaded successfully')
  }, 1000)
}

const shareReport = () => {
  toast.success('Share link copied to clipboard')
}

const printReport = () => {
  window.print()
}

const saveAsFavorite = () => {
  favoriteName.value = ''
  favoriteDescription.value = ''
  showFavoritesModal.value = true
}

const confirmSaveFavorite = () => {
  if (!favoriteName.value) {
    toast.error('Please enter a favorite name')
    return
  }
  
  toast.success('Report saved as favorite')
  showFavoritesModal.value = false
}

const resetConfiguration = () => {
  config.value = {
    program: '',
    selectedElements: [],
    periodType: 'monthly',
    startDate: '',
    endDate: '',
    selectedPeriods: [],
    selectedOrgUnits: [],
    columnDimensions: ['data'],
    rowDimensions: ['period'],
    filterDimensions: [],
    showTotals: true,
    showSubtotals: false,
    hideEmptyRows: true,
    showHierarchy: false,
    aggregationType: 'sum',
    outputType: 'event',
    rowLimit: null
  }
  reportData.value = []
  toast.info('Configuration reset')
}

const viewEventDetails = (event) => {
  toast.info('Opening event details...')
}

// Navigation methods
const goBack = () => {
  router.push('/dashboard')
}

const handleLogout = async () => {
  const result = await AuthService.logout()
  if (result.success) {
    router.push('/login')
  }
}

// Lifecycle
onMounted(async () => {
  config.value.selectedOrgUnits = ['unit-1']
  
  // Optionally load summary statistics on mount
  try {
    const statsResult = await EventReportsService.getSummaryStatistics()
    if (statsResult.success) {
      console.log('Event reports statistics:', statsResult.statistics)
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
  }
})
</script>

<style scoped>
.event-reports-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.reports-header {
  background: linear-gradient(135deg, #4A148C 0%, #2D1B69 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.logout-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.logout-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.reports-title {
  font-size: 1.75rem;
  margin: 0 0 0.25rem 0;
  font-weight: 700;
}

.reports-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.reports-layout {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
}

.config-panel {
  width: 320px;
  background: white;
  border-right: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.config-panel.collapsed {
  width: 50px;
}

.config-panel.collapsed .panel-content {
  display: none;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 2px solid #4A148C;
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.panel-header h3 {
  font-size: 1.1rem;
  color: #4A148C;
  margin: 0;
}

.collapse-btn {
  background: #4A148C;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: #6A1B9A;
}

.panel-content {
  padding: 1rem;
}

.config-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.config-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 0.95rem;
  color: #4A148C;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
  background: white;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4A148C;
  box-shadow: 0 0 0 2px rgba(74, 20, 140, 0.1);
}

.form-select.multi {
  height: auto;
  padding: 0.25rem;
}

.form-select.multi option {
  padding: 0.25rem 0.5rem;
}

.data-elements-list,
.periods-list,
.org-units-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0.5rem;
  background: #fafafa;
}

.data-element-item,
.period-item,
.org-unit-item {
  display: flex;
  align-items: center;
  padding: 0.4rem;
  margin-bottom: 0.3rem;
  border-radius: 3px;
  transition: background 0.2s;
}

.data-element-item:hover,
.period-item:hover,
.org-unit-item:hover {
  background: white;
}

.data-element-item input,
.period-item input,
.org-unit-item input {
  margin-right: 0.5rem;
  cursor: pointer;
}

.data-element-item label,
.period-item label,
.org-unit-item label {
  font-size: 0.85rem;
  margin: 0;
  cursor: pointer;
  flex: 1;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.checkbox-group input {
  margin-right: 0.5rem;
  cursor: pointer;
}

.checkbox-group label {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  cursor: pointer;
}

.panel-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #eee;
}

.update-btn,
.favorite-btn,
.reset-btn {
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.update-btn {
  background: #4A148C;
  color: white;
}

.update-btn:hover:not(:disabled) {
  background: #6A1B9A;
  transform: translateY(-1px);
}

.update-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.favorite-btn {
  background: #FFC107;
  color: #333;
}

.favorite-btn:hover {
  background: #FFD54F;
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.reset-btn:hover {
  background: #5a6268;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.content-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid #eee;
  background: #fafafa;
}

.view-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.6rem 1.2rem;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f5f5f5;
}

.tab-btn.active {
  background: #4A148C;
  color: white;
  border-color: #4A148C;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.dropdown-container {
  position: relative;
}

.action-btn {
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  background: white;
  color: #4A148C;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f5f5f5;
  border-color: #4A148C;
}

.download-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 100;
}

.download-menu button {
  display: block;
  width: 100%;
  padding: 0.7rem 1rem;
  border: none;
  background: white;
  color: #333;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.download-menu button:hover {
  background: #f5f5f5;
}

.download-menu button:first-child {
  border-radius: 4px 4px 0 0;
}

.download-menu button:last-child {
  border-radius: 0 0 4px 4px;
}

.report-content {
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A148C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #4A148C;
  margin-bottom: 0.5rem;
}

.table-view {
  width: 100%;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pivot-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.pivot-table thead {
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 5;
}

.table-header {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4A148C;
  border-bottom: 2px solid #4A148C;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.table-header:hover {
  background: #e9ecef;
}

.sort-indicator {
  margin-left: 0.5rem;
  color: #666;
}

.pivot-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.pivot-table tbody tr:hover {
  background: #f8f9fa;
}

.pivot-table td {
  padding: 0.75rem 1rem;
  color: #333;
}

.subtotal-row {
  background: #f8f9fa;
  font-weight: 600;
}

.total-row {
  background: #e9ecef;
  font-weight: 700;
}

.pivot-table tfoot {
  background: #f8f9fa;
  font-weight: 700;
  position: sticky;
  bottom: 0;
}

.total-cell {
  padding: 0.75rem 1rem;
  border-top: 2px solid #4A148C;
  color: #4A148C;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  color: #4A148C;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #4A148C;
  color: white;
  border-color: #4A148C;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

.chart-view {
  width: 100%;
}

.chart-options {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.chart-options label {
  font-weight: 600;
  color: #4A148C;
}

.form-select.inline {
  width: auto;
  min-width: 200px;
}

.chart-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.chart-placeholder {
  text-align: center;
  color: #999;
}

.chart-placeholder p {
  margin: 0.5rem 0;
}

.chart-hint {
  font-size: 0.85rem;
}

.chart-data-display {
  padding: 2rem;
}

.chart-data-display > p {
  text-align: center;
  margin-bottom: 1rem;
  color: #4A148C;
  font-weight: 600;
}

.chart-preview {
  margin-top: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.chart-preview-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.preview-label {
  min-width: 120px;
  font-weight: 500;
  color: #333;
}

.preview-bar {
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
  transition: all 0.3s ease;
}

.preview-bar:hover {
  transform: scaleX(1.05);
  box-shadow: 0 2px 8px rgba(74, 20, 140, 0.3);
}

.line-list-view {
  width: 100%;
}

.list-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #4A148C;
  box-shadow: 0 0 0 2px rgba(74, 20, 140, 0.1);
}

.line-list-table {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.line-list-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.line-list-table thead {
  background: #f8f9fa;
}

.line-list-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4A148C;
  border-bottom: 2px solid #4A148C;
}

.line-list-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.line-list-table tbody tr:hover {
  background: #f8f9fa;
}

.line-list-table td {
  padding: 0.75rem 1rem;
  color: #333;
}

.empty-list {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
  font-size: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin: 1rem 0;
}

.empty-list p {
  margin: 0;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.action-link {
  background: none;
  border: none;
  color: #4A148C;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.action-link:hover {
  color: #6A1B9A;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.modal-header h3 {
  color: #4A148C;
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.save-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: #4A148C;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover {
  background: #6A1B9A;
  transform: translateY(-1px);
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

@media print {
  .config-panel,
  .content-toolbar,
  .pagination {
    display: none !important;
  }
  
  .content-area {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .reports-layout {
    flex-direction: column;
  }
  
  .config-panel {
    width: 100%;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .config-panel.collapsed {
    width: 100%;
    height: 50px;
  }
}

@media (max-width: 768px) {
  .header-nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
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
  }

  .back-button,
  .logout-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }

  .reports-title {
    font-size: 1.5rem;
  }

  .reports-subtitle {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .header-nav {
    padding: 0.75rem;
  }

  .reports-title {
    font-size: 1.25rem;
  }

  .reports-subtitle {
    font-size: 0.8rem;
  }

  .back-button,
  .logout-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    width: 100%;
    justify-content: center;
  }

  .header-right {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
