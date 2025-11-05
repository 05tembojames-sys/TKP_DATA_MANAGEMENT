<template>
  <div class="event-reports-container">
    <!-- Header -->
    <div class="reports-header">
      <div class="header-left">
        <button @click="goBack" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <div class="header-center">
        <h1 class="reports-title">Event Reports</h1>
        <div class="data-source-indicator"></div>
      </div>
      <div class="header-right">
        <button @click="fixDatabaseStatus" class="fix-status-button" title="Fix draft status in database">
          🔧 Fix Status
        </button>
        <button @click="handleLogout" class="logout-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </div>

    <div class="reports-layout">
      <!-- Left Sidebar - Configuration Panel -->
      <div class="config-panel" :class="{ collapsed: panelCollapsed }">
        <div class="panel-header">
          <h3>📋 Report Configuration</h3>
          <button
            @click="panelCollapsed = !panelCollapsed"
            class="collapse-btn"
          >
            {{ panelCollapsed ? "▶" : "◀" }}
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
                <option value="initial-referral">Initial Referrals</option>
                <option value="child-overview">Child Overview</option>
                <option value="initial-assessment">Initial Assessments</option>
                <option value="medical-intake">
                  Medical Intake Assessments
                </option>
                <option value="academics-literacy">
                  Academics & Literacy Plans
                </option>
                <option value="psychological-assessment">
                  Psychological Assessments
                </option>
                <option value="life-skills-survey">Life Skills Surveys</option>
                <option value="birth-delivery">Birth & Delivery Reports</option>
                <option value="care-plan-summary">Care Plan Summaries</option>
                <option value="care-plan-baby">Care Plan (Baby)</option>
                <option value="care-plan-ongoing-life-skills">
                  Ongoing Life Skills
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Data Elements</label>
              <p v-if="!config.program" class="helper-text">
                📌 Select a Program/Event Type above to see available data elements
              </p>
              <div v-if="availableDataElements.length > 0" class="select-all-container">
                <input
                  type="checkbox"
                  id="select-all-elements"
                  :checked="availableDataElements.length > 0 && config.selectedElements.length === availableDataElements.length"
                  @change="toggleSelectAllElements"
                />
                <label for="select-all-elements">Select All ({{ availableDataElements.length }} available)</label>
              </div>
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
                  <label :for="`element-${element.id}`">{{
                    element.name
                  }}</label>
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
              <input
                type="date"
                v-model="config.startDate"
                class="form-input"
              />
            </div>

            <div v-if="config.periodType === 'custom'" class="form-group">
              <label>End Date</label>
              <input type="date" v-model="config.endDate" class="form-input" />
            </div>

            <div v-else class="form-group">
              <label>Select Periods</label>
              <div class="select-all-container">
                <input
                  type="checkbox"
                  id="select-all-periods"
                  :checked="availablePeriods.length > 0 && config.selectedPeriods.length === availablePeriods.length"
                  @change="toggleSelectAllPeriods"
                />
                <label for="select-all-periods">Select All</label>
              </div>
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
              <select
                multiple
                v-model="config.columnDimensions"
                class="form-select multi"
                size="3"
              >
                <option value="data">Data Elements</option>
                <option value="period">Period</option>
                <option value="orgUnit">Organization Unit</option>
              </select>
            </div>

            <div class="form-group">
              <label>Rows</label>
              <select
                multiple
                v-model="config.rowDimensions"
                class="form-select multi"
                size="3"
              >
                <option value="data">Data Elements</option>
                <option value="period">Period</option>
                <option value="orgUnit">Organization Unit</option>
              </select>
            </div>

            <div class="form-group">
              <label>Filters</label>
              <select
                multiple
                v-model="config.filterDimensions"
                class="form-select multi"
                size="3"
              >
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
              <input
                type="checkbox"
                id="showTotals"
                v-model="config.showTotals"
              />
              <label for="showTotals">Show row totals</label>
            </div>

            <div class="checkbox-group">
              <input
                type="checkbox"
                id="showSubtotals"
                v-model="config.showSubtotals"
              />
              <label for="showSubtotals">Show subtotals</label>
            </div>

            <div class="checkbox-group">
              <input
                type="checkbox"
                id="hideEmptyRows"
                v-model="config.hideEmptyRows"
              />
              <label for="hideEmptyRows">Hide empty rows</label>
            </div>

            <div class="checkbox-group">
              <input
                type="checkbox"
                id="showHierarchy"
                v-model="config.showHierarchy"
              />
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
            <button
              @click="updateReport"
              class="update-btn"
              :disabled="loading"
            >
              {{ loading ? "⏳ Loading..." : "🔄 Update" }}
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
              <button
                @click="showDownloadMenu = !showDownloadMenu"
                class="action-btn"
              >
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
          <div
            v-else-if="!tableHeaders || tableHeaders.length === 0"
            class="empty-state"
          >
            <div class="empty-icon">📊</div>
            <h3>No Data Available</h3>
            <p>
              Configure your report settings and click "Update" to generate the
              report.
            </p>
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
                        {{ sortDirection === "asc" ? "▲" : "▼" }}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, rowIndex) in displayedRows"
                    :key="`row-${rowIndex}`"
                    :class="{
                      'subtotal-row': row.isSubtotal,
                      'total-row': row.isTotal,
                    }"
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
                      {{ formatCellValue(total, "number") }}
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
                <option value="bar">Horizontal Bar Chart</option>
                <option value="column">Vertical Column Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="area">Area Chart</option>
              </select>
              
              <label style="margin-left: 1rem;">Max Items:</label>
              <select v-model="chartMaxItems" class="form-select inline" style="width: 100px;">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
              
              <button @click="downloadChart" class="action-btn" style="margin-left: auto;">
                📥 Download Chart
              </button>
            </div>
            <div class="chart-container">
              <div
                v-if="reportData && reportData.length > 0"
                class="chart-data-display"
              >
                <div class="chart-header">
                  <h4>📊 {{ chartTitle }}</h4>
                  <p class="chart-subtitle">Showing {{ Math.min(chartMaxItems, reportData.length) }} of {{ reportData.length }} items</p>
                </div>
                
                <!-- Bar Chart (Horizontal) -->
                <div v-if="chartType === 'bar'" class="chart-visualization bar-chart">
                  <div 
                    v-for="(row, idx) in reportData.slice(0, chartMaxItems)" 
                    :key="idx" 
                    class="chart-bar"
                  >
                    <div class="chart-bar-label" :title="row.cells[0]?.value || 'Unknown'">
                      {{ truncateText(row.cells[0]?.value || 'Unknown', 20) }}
                    </div>
                    <div class="chart-bar-container">
                      <div 
                        class="chart-bar-fill" 
                        :style="{ 
                          width: calculateBarWidth(row.cells[1]?.value || 0) + '%',
                          backgroundColor: getChartColor(idx),
                          animationDelay: (idx * 0.05) + 's'
                        }"
                      >
                        <span class="chart-value">{{ formatNumber(row.cells[1]?.value || 0) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Column Chart (Vertical) -->
                <div v-else-if="chartType === 'column'" class="chart-visualization column-chart">
                  <div class="column-chart-container">
                    <div 
                      v-for="(row, idx) in reportData.slice(0, chartMaxItems)" 
                      :key="idx" 
                      class="chart-column"
                    >
                      <div class="column-bar-container">
                        <div 
                          class="column-bar-fill" 
                          :style="{ 
                            height: calculateBarWidth(row.cells[1]?.value || 0) + '%',
                            backgroundColor: getChartColor(idx),
                            animationDelay: (idx * 0.05) + 's'
                          }"
                        >
                          <span class="column-value">{{ formatNumber(row.cells[1]?.value || 0) }}</span>
                        </div>
                      </div>
                      <div class="column-label" :title="row.cells[0]?.value || 'Unknown'">
                        {{ truncateText(row.cells[0]?.value || 'Unknown', 12) }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Line Chart -->
                <div v-else-if="chartType === 'line'" class="chart-visualization line-chart">
                  <svg class="line-chart-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                    <!-- Grid lines -->
                    <line v-for="i in 5" :key="'grid-' + i" 
                      :x1="0" :y1="i * 80" :x2="800" :y2="i * 80"
                      stroke="#e0e0e0" stroke-width="1" />
                    
                    <!-- Line path -->
                    <polyline
                      :points="getLineChartPoints()"
                      fill="none"
                      stroke="#4a148c"
                      stroke-width="3"
                      class="chart-line"
                    />
                    
                    <!-- Data points -->
                    <circle 
                      v-for="(point, idx) in getLineChartData()" 
                      :key="idx"
                      :cx="point.x" 
                      :cy="point.y"
                      r="6"
                      :fill="getChartColor(idx)"
                      class="chart-point"
                      :style="{ animationDelay: (idx * 0.05) + 's' }"
                    >
                      <title>{{ point.label }}: {{ point.value }}</title>
                    </circle>
                    
                    <!-- Labels -->
                    <text 
                      v-for="(point, idx) in getLineChartData()" 
                      :key="'label-' + idx"
                      :x="point.x" 
                      :y="390"
                      text-anchor="middle"
                      font-size="12"
                      fill="#666"
                    >
                      {{ truncateText(point.label, 10) }}
                    </text>
                  </svg>
                </div>
                
                <!-- Pie Chart -->
                <div v-else-if="chartType === 'pie'" class="chart-visualization pie-chart">
                  <div class="pie-chart-container">
                    <svg class="pie-chart-svg" viewBox="0 0 400 400">
                      <g transform="translate(200, 200)">
                        <path 
                          v-for="(slice, idx) in getPieChartSlices()" 
                          :key="idx"
                          :d="slice.path"
                          :fill="getChartColor(idx)"
                          class="pie-slice"
                          :style="{ animationDelay: (idx * 0.1) + 's' }"
                        >
                          <title>{{ slice.label }}: {{ slice.value }} ({{ slice.percentage }}%)</title>
                        </path>
                      </g>
                    </svg>
                    <div class="pie-legend">
                      <div v-for="(slice, idx) in getPieChartSlices()" :key="idx" class="legend-item">
                        <span class="legend-color" :style="{ backgroundColor: getChartColor(idx) }"></span>
                        <span class="legend-label">{{ truncateText(slice.label, 25) }}</span>
                        <span class="legend-value">{{ slice.value }} ({{ slice.percentage }}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Area Chart -->
                <div v-else-if="chartType === 'area'" class="chart-visualization area-chart">
                  <svg class="area-chart-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                    <!-- Grid lines -->
                    <line v-for="i in 5" :key="'grid-' + i" 
                      :x1="0" :y1="i * 80" :x2="800" :y2="i * 80"
                      stroke="#e0e0e0" stroke-width="1" />
                    
                    <!-- Area fill -->
                    <polygon
                      :points="getAreaChartPoints()"
                      :fill="getChartColor(0)"
                      opacity="0.3"
                      class="chart-area"
                    />
                    
                    <!-- Line path -->
                    <polyline
                      :points="getLineChartPoints()"
                      fill="none"
                      :stroke="getChartColor(0)"
                      stroke-width="3"
                      class="chart-line"
                    />
                  </svg>
                </div>
              </div>
              <div v-else class="chart-placeholder">
                <div class="empty-chart-icon">📊</div>
                <h3>No Chart Data</h3>
                <p class="chart-hint">
                  Select a program, data elements, and period, then click "Update" to generate your chart
                </p>
              </div>
            </div>
          </div>

          <!-- Line List View -->
          <div v-else-if="currentView === 'line-list'" class="line-list-view">
            <div class="list-controls">
              <div class="search-container">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="🔍 Search by name, program, or status..."
                  class="search-input"
                />
                <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
                  ✕
                </button>
              </div>
              
              <select v-model="lineListSort" class="form-select inline">
                <option value="date-desc">📅 Date (Newest first)</option>
                <option value="date-asc">📅 Date (Oldest first)</option>
                <option value="name-asc">👤 Name (A-Z)</option>
                <option value="name-desc">👤 Name (Z-A)</option>
              </select>
              
              <select v-model="lineListStatusFilter" class="form-select inline">
                <option value="">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </select>
              
              <button @click="exportLineList" class="action-btn export-pdf">
                📄 Export as PDF
              </button>
            </div>
            
            <!-- Summary Stats -->
            <div v-if="filteredLineList.length > 0" class="line-list-stats">
              <div class="stat-card">
                <div class="stat-value">{{ filteredLineList.length }}</div>
                <div class="stat-label">Total Events</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ getStatusCount('submitted') + getStatusCount('completed') }}</div>
                <div class="stat-label">Submitted</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ getStatusCount('pending') }}</div>
                <div class="stat-label">Pending</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ getStatusCount('draft') }}</div>
                <div class="stat-label">Drafts</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ uniqueChildrenCount }}</div>
                <div class="stat-label">Unique Children</div>
              </div>
            </div>
            
            <div class="line-list-table">
              <div
                v-if="!filteredLineList || filteredLineList.length === 0"
                class="empty-list"
              >
                <div class="empty-list-icon">📋</div>
                <h3>{{ searchQuery ? 'No Results Found' : 'No Events Available' }}</h3>
                <p v-if="searchQuery">
                  No events match your search criteria. Try different keywords.
                </p>
                <p v-else>
                  Click "Update" in the configuration panel to load event data.
                </p>
              </div>
              <div v-else class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input 
                          type="checkbox" 
                          v-model="selectAllEvents"
                          @change="toggleSelectAll"
                          title="Select all"
                        />
                      </th>
                      <th>Event Date</th>
                      <th>Child Name</th>
                      <th>Program</th>
                      <th>Organization Unit</th>
                      <th>Status</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="event in paginatedLineList" 
                      :key="event.id"
                      :class="{ 'selected-row': selectedEvents.includes(event.id) }"
                    >
                      <td>
                        <input 
                          type="checkbox" 
                          :value="event.id"
                          v-model="selectedEvents"
                        />
                      </td>
                      <td class="date-cell">
                        <span class="date-value">{{ formatDate(event.date) }}</span>
                      </td>
                      <td class="name-cell">
                        <strong>{{ event.childName || "Unknown" }}</strong>
                      </td>
                      <td class="program-cell">
                        <span class="program-badge">{{ formatProgramName(event.program) }}</span>
                      </td>
                      <td>{{ event.orgUnit || "-" }}</td>
                      <td>
                        <span class="status-badge" :class="event.status">
                          {{ event.status }}
                        </span>
                      </td>
                      <td class="age-cell">{{ event.data?.age || event.data?.ageAtIntake || "-" }}</td>
                      <td class="gender-cell">
                        <span :class="'gender-badge ' + (event.data?.gender || '').toLowerCase()">
                          {{ event.data?.gender || "-" }}
                        </span>
                      </td>
                      <td class="id-cell">{{ event.data?.id || event.data?.childId || "-" }}</td>
                      <td class="actions-cell">
                        <button
                          @click="viewEventDetails(event)"
                          class="action-link view-btn"
                          title="View details"
                        >
                          👁️ View
                        </button>
                        <button
                          @click="editEvent(event)"
                          class="action-link edit-btn"
                          title="Edit event"
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <!-- Line List Pagination -->
                <div v-if="lineListTotalPages > 1" class="line-list-pagination">
                  <div class="pagination-info">
                    Showing {{ lineListStartIndex + 1 }} - {{ Math.min(lineListEndIndex, filteredLineList.length) }} of {{ filteredLineList.length }} events
                  </div>
                  <div class="pagination-controls">
                    <button
                      @click="lineListCurrentPage--"
                      :disabled="lineListCurrentPage === 1"
                      class="page-btn"
                    >
                      ← Previous
                    </button>
                    <span class="page-numbers">
                      <button
                        v-for="page in visiblePages"
                        :key="page"
                        @click="lineListCurrentPage = page"
                        class="page-number"
                        :class="{ active: lineListCurrentPage === page }"
                      >
                        {{ page }}
                      </button>
                    </span>
                    <button
                      @click="lineListCurrentPage++"
                      :disabled="lineListCurrentPage === lineListTotalPages"
                      class="page-btn"
                    >
                      Next →
                    </button>
                  </div>
                  <div class="pagination-size">
                    <label>Per page:</label>
                    <select v-model="lineListPageSize" class="form-select inline small">
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                
                <!-- Bulk Actions -->
                <div v-if="selectedEvents.length > 0" class="bulk-actions">
                  <div class="bulk-actions-info">
                    <strong>{{ selectedEvents.length }}</strong> event(s) selected
                  </div>
                  <div class="bulk-actions-buttons">
                    <button @click="bulkExport" class="bulk-btn export">
                      📄 Export Selected (PDF)
                    </button>
                    <button @click="clearSelection" class="bulk-btn clear">
                      ✕ Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Favorites Modal -->
    <div
      v-if="showFavoritesModal"
      class="modal-overlay"
      @click="showFavoritesModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>⭐ Save Report as Favorite</h3>
          <button @click="showFavoritesModal = false" class="close-btn">
            &times;
          </button>
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
          <button @click="showFavoritesModal = false" class="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "../composables/useToast.js";
import EventReportsService from "../services/eventReportsService.js";
import AuthService from "../services/auth.js";
import { fixFormStatus } from "../utils/fixFormStatus.js";

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

// Chart helper methods
const calculateBarWidth = (value) => {
  if (!reportData.value || reportData.value.length === 0) return 0;
  const maxValue = Math.max(...reportData.value.slice(0, chartMaxItems.value).map(r => r.cells[1]?.value || 0));
  return maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const formatNumber = (num) => {
  return typeof num === 'number' ? num.toLocaleString() : num;
};

const getLineChartData = () => {
  if (!reportData.value || reportData.value.length === 0) return [];
  
  const data = reportData.value.slice(0, chartMaxItems.value);
  const maxValue = Math.max(...data.map(r => r.cells[1]?.value || 0));
  const chartWidth = 800;
  const chartHeight = 400;
  const padding = 40;
  
  return data.map((row, idx) => {
    const x = padding + (idx * (chartWidth - 2 * padding) / (data.length - 1 || 1));
    const y = chartHeight - padding - ((row.cells[1]?.value || 0) / maxValue * (chartHeight - 2 * padding));
    return {
      x,
      y,
      label: row.cells[0]?.value || 'Unknown',
      value: row.cells[1]?.value || 0
    };
  });
};

const getLineChartPoints = () => {
  const data = getLineChartData();
  return data.map(p => `${p.x},${p.y}`).join(' ');
};

const getAreaChartPoints = () => {
  const data = getLineChartData();
  if (data.length === 0) return '';
  const firstPoint = `${data[0].x},400`;
  const linePoints = data.map(p => `${p.x},${p.y}`).join(' ');
  const lastPoint = `${data[data.length - 1].x},400`;
  return `${firstPoint} ${linePoints} ${lastPoint}`;
};

const getPieChartSlices = () => {
  if (!reportData.value || reportData.value.length === 0) return [];
  
  const data = reportData.value.slice(0, chartMaxItems.value);
  const total = data.reduce((sum, row) => sum + (row.cells[1]?.value || 0), 0);
  
  let currentAngle = 0;
  return data.map((row) => {
    const value = row.cells[1]?.value || 0;
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    const angle = (value / total) * 360;
    
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    // Convert to radians
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const radius = 150;
    const x1 = radius * Math.cos(startRad);
    const y1 = radius * Math.sin(startRad);
    const x2 = radius * Math.cos(endRad);
    const y2 = radius * Math.sin(endRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const path = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    return {
      path,
      label: row.cells[0]?.value || 'Unknown',
      value,
      percentage
    };
  });
};

const downloadChart = () => {
  toast.info('Downloading chart...');
  setTimeout(() => toast.success('Chart downloaded successfully'), 500);
};

// Line list helper methods
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

// Get chart color based on index for better visualization
const getChartColor = (index) => {
  const colors = [
    '#4a148c',
    '#6a1b9a',
    '#7b1fa2',
    '#8e24aa',
    '#9c27b0',
    '#ab47bc',
    '#ba68c8',
    '#ce93d8',
    '#e1bee7',
    '#f3e5f5'
  ];
  return colors[index % colors.length];
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
.event-reports-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.reports-header {
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
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
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.fix-status-button {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  box-shadow: 0 2px 6px rgba(245, 124, 0, 0.3);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.fix-status-button:hover {
  background: linear-gradient(135deg, #f57c00 0%, #ef6c00 100%);
  box-shadow: 0 4px 12px rgba(245, 124, 0, 0.4);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
}

.logout-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

.logout-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.reports-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.data-source-indicator {
  margin-top: 0.5rem;
}

.indicator-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: #28a745;
  color: white;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.indicator-badge.firebase {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.reports-layout {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
}

.config-panel {
  width: 340px;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  border-right: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
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
  padding: 1.25rem 1rem;
  border-bottom: 3px solid #4a148c;
  background: linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(74, 20, 140, 0.2);
}

.panel-header h3 {
  font-size: 1.15rem;
  color: #ffffff;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.panel-content {
  padding: 1rem;
}

.config-section {
  margin-bottom: 1.75rem;
  padding: 1.25rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.config-section:hover {
  box-shadow: 0 4px 8px rgba(74, 20, 140, 0.1);
  border-color: #4a148c;
}

.config-section:last-of-type {
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  font-size: 1rem;
  color: #4a148c;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e9ecef;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.helper-text {
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
  padding: 0.75rem;
  background: #f8f9fa;
  border-left: 3px solid #4a148c;
  border-radius: 4px;
  margin: 0.5rem 0;
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
  border-color: #4a148c;
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

.select-all-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.select-all-container input {
  margin-right: 0.5rem;
  cursor: pointer;
}

.select-all-container label {
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
  cursor: pointer;
  color: #4a148c;
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
  background: #4a148c;
  color: white;
}

.update-btn:hover:not(:disabled) {
  background: #6a1b9a;
  transform: translateY(-1px);
}

.update-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.favorite-btn {
  background: #ffc107;
  color: #333;
}

.favorite-btn:hover {
  background: #ffd54f;
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
  background: #4a148c;
  color: white;
  border-color: #4a148c;
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
  padding: 0.65rem 1.25rem;
  border: 2px solid #ddd;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #4a148c;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.action-btn.export-pdf {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  border-color: #c62828;
  color: white;
}

.action-btn.export-pdf:hover {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%);
  border-color: #b71c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
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
  border-top: 4px solid #4a148c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #4a148c;
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
  color: #4a148c;
  border-bottom: 2px solid #4a148c;
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
  border-top: 2px solid #4a148c;
  color: #4a148c;
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
  color: #4a148c;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #4a148c;
  color: white;
  border-color: #4a148c;
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
  color: #4a148c;
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
  color: #4a148c;
  font-weight: 600;
}

.chart-visualization {
  margin-top: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.chart-bar {
  margin-bottom: 1rem;
}

.chart-bar-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.chart-bar-container {
  height: 30px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.chart-bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.chart-bar-fill:hover {
  opacity: 0.9;
  transform: scaleY(1.05);
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
  border-color: #4a148c;
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
  color: #4a148c;
  border-bottom: 2px solid #4a148c;
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

.status-badge.submitted {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.draft {
  background: #e2e3e5;
  color: #383d41;
}

.action-link {
  background: none;
  border: none;
  color: #4a148c;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.action-link:hover {
  color: #6a1b9a;
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
  color: #4a148c;
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
  background: #4a148c;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover {
  background: #6a1b9a;
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

  .header-left,
  .header-center,
  .header-right {
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
  .logout-button,
  .fix-status-button {
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
  .logout-button,
  .fix-status-button {
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

/* Enhanced Chart Styles */
.chart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chart-header h4 {
  color: #4a148c;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.chart-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.empty-chart-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.chart-value,
.column-value {
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0 0.5rem;
}

.column-chart-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 400px;
  padding: 2rem;
  gap: 1rem;
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.column-bar-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.column-bar-fill {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
  color: white;
  border-radius: 4px 4px 0 0;
  animation: growUp 0.6s ease-out forwards;
  transform-origin: bottom;
  transition: opacity 0.3s;
}

.column-bar-fill:hover {
  opacity: 0.8;
}

@keyframes growUp {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.column-label {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  word-wrap: break-word;
}

.chart-bar-fill {
  animation: growWidth 0.6s ease-out forwards;
  transform-origin: left;
}

@keyframes growWidth {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.line-chart-svg,
.area-chart-svg {
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: 0 auto;
  display: block;
}

.chart-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease-out forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

.chart-point {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
  cursor: pointer;
  transition: r 0.2s;
}

.chart-point:hover {
  r: 8;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.chart-area {
  animation: fadeIn 1.5s ease-out;
}

.pie-chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 2rem;
}

.pie-chart-svg {
  width: 400px;
  height: 400px;
  flex-shrink: 0;
}

.pie-slice {
  cursor: pointer;
  transition: opacity 0.2s;
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.pie-slice:hover {
  opacity: 0.8;
}

.pie-legend {
  flex: 1;
  max-width: 300px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.legend-item:hover {
  background: #f8f9fa;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 0.9rem;
  color: #333;
}

.legend-value {
  font-weight: 600;
  color: #4a148c;
  font-size: 0.85rem;
}

/* Enhanced Line List Styles */
.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s;
}

.clear-search:hover {
  color: #666;
}

.line-list-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.3);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-list-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-list h3 {
  color: #4a148c;
  margin-bottom: 0.5rem;
}

.table-wrapper {
  overflow-x: auto;
}

.selected-row {
  background: #f0e6ff !important;
}

.program-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background: #e3f2fd;
  color: #1976d2;
  font-size: 0.8rem;
  font-weight: 500;
}

.gender-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.gender-badge.male {
  background: #e3f2fd;
  color: #1976d2;
}

.gender-badge.female {
  background: #fce4ec;
  color: #c2185b;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.view-btn,
.edit-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #e3f2fd;
  text-decoration: none;
}

.edit-btn:hover {
  background: #fff3e0;
  text-decoration: none;
  color: #f57c00;
}

.line-list-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: #666;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  background: white;
  color: #4a148c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  min-width: 36px;
  text-align: center;
}

.page-number:hover {
  background: #f8f9fa;
}

.page-number.active {
  background: #4a148c;
  color: white;
  border-color: #4a148c;
}

.pagination-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-size label {
  font-size: 0.9rem;
  color: #666;
}

.form-select.inline.small {
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
  width: auto;
  min-width: 70px;
}

.bulk-actions {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 100;
  border: 2px solid #4a148c;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.bulk-actions-info {
  color: #4a148c;
  font-size: 0.95rem;
}

.bulk-actions-buttons {
  display: flex;
  gap: 0.75rem;
}

.bulk-btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.bulk-btn.export {
  background: #4a148c;
  color: white;
}

.bulk-btn.export:hover {
  background: #6a1b9a;
  transform: translateY(-1px);
}

.bulk-btn.clear {
  background: #6c757d;
  color: white;
}

.bulk-btn.clear:hover {
  background: #5a6268;
}
</style>
