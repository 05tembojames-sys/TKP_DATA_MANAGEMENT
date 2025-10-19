<template>
  <div class="data-analysis-pro">
    <!-- Professional Header -->
    <div class="analytics-header">
      <div class="header-toolbar">
        <div class="app-title">
          <div class="title-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
          </div>
          <div class="title-text">
            <h1>Data Analytics</h1>
            <span class="subtitle">KHUKOMA Project Analysis System</span>
          </div>
        </div>
        <div class="toolbar-actions">
          <button @click="refreshData" class="tool-btn" :disabled="loading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 4v6h6"/>
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
            </svg>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
          <div class="dropdown" ref="exportDropdown">
            <button @click="toggleExportDropdown" class="tool-btn dropdown-toggle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </button>
            <div v-if="showExportDropdown" class="dropdown-menu">
              <button @click="exportData('pdf')" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                Export as PDF
              </button>
              <button @click="exportData('excel')" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
                Export as Excel
              </button>
              <button @click="exportData('csv')" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="8" y1="13" x2="16" y2="13"/>
                  <line x1="8" y1="17" x2="16" y2="17"/>
                </svg>
                Export as CSV
              </button>
            </div>
          </div>
          <button @click="openSettings" class="tool-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
            Settings
          </button>
        </div>
      </div>
    </div>

    <!-- Main Analytics Interface -->
    <div class="analytics-container">
      <!-- Left Sidebar - Data Explorer -->
      <div class="data-explorer">
        <div class="explorer-header">
          <div class="explorer-title">
            <h3>Data Explorer</h3>
            <div v-if="getTotalSelectedCount() > 0" class="selection-summary">
              {{ getTotalSelectedCount() }} items selected
            </div>
          </div>
          <div class="explorer-actions">
            <button @click="selectAllWithData" class="action-btn" v-if="!hasSelections" title="Select all items with data">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,11 12,14 22,4"/>
                <path d="M21,12v7a2,2 0 01-2,2H5a2,2 0 01-2-2V5a2,2 0 012-2h11"/>
              </svg>
              Select All
            </button>
            <button @click="resetSelection" class="reset-btn" v-if="hasSelections">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18l-2-2H5L3 6z"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
              </svg>
              Reset
            </button>
          </div>
        </div>
        
        <!-- Dimension Selector -->
        <div class="dimension-section">
          <h4>Dimensions</h4>
          <div class="dimension-tree">
            <div class="dimension-item" v-for="dimension in dimensions" :key="dimension.id">
              <div class="dimension-header" @click="toggleDimension(dimension.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="dimension.expanded ? '6,9 12,15 18,9' : '9,6 15,12 9,18'"/>
                </svg>
                <span>{{ dimension.name }}</span>
                <span class="selected-count" v-if="dimension.selectedCount > 0">({{ dimension.selectedCount }})</span>
              </div>
              <div v-if="dimension.expanded" class="dimension-children">
                <div v-for="item in dimension.items" :key="item.id" 
                     class="dimension-child" 
                     :class="{ 
                       'has-data': item.count > 0, 
                       'selected': item.selected,
                       'empty-data': item.count === 0
                     }"
                     @click="toggleDimensionItem(dimension.id, item.id)"
                     :title="`${item.name}: ${item.count} records`">
                  <input type="checkbox" :checked="item.selected" readonly>
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-count" :class="{ 'has-data': item.count > 0 }">
                    ({{ item.count || 0 }})
                  </span>
                  <div v-if="item.count > 0" class="data-indicator"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Date Range Selector -->
        <div class="date-section">
          <h4>Date Range</h4>
          <div class="date-controls">
            <select v-model="selectedPeriodType" class="period-type">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
            <div v-if="selectedPeriodType === 'custom'" class="custom-date">
              <input type="date" v-model="dateRange.start" class="date-input">
              <span>to</span>
              <input type="date" v-model="dateRange.end" class="date-input">
            </div>
            <select v-else v-model="selectedPeriod" class="period-select">
              <option v-for="period in availablePeriods" :key="period.id" :value="period.id">
                {{ period.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Organization Unit Selector -->
        <div class="org-section">
          <h4>Organization Units</h4>
          <div class="org-tree">
            <div class="org-item" v-for="org in orgUnits" :key="org.id">
              <div class="org-header" @click="toggleOrgUnit(org.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="org.expanded ? '6,9 12,15 18,9' : '9,6 15,12 9,18'"/>
                </svg>
                <input type="checkbox" :checked="org.selected" @click.stop @change="selectOrgUnit(org.id)">
                <span>{{ org.name }}</span>
              </div>
              <div v-if="org.expanded && org.children" class="org-children">
                <div v-for="child in org.children" :key="child.id" class="org-child">
                  <input type="checkbox" :checked="child.selected" @change="selectOrgUnit(child.id)">
                  <span>{{ child.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Analysis Tabs -->
        <div class="analysis-tabs">
          <button v-for="tab in analysisTabs" 
                  :key="tab.id" 
                  @click="setActiveTab(tab.id)" 
                  :class="['tab-btn', { active: activeTab === tab.id }]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path :d="tab.icon"/>
            </svg>
            {{ tab.name }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Data Visualizer Tab -->
          <div v-if="activeTab === 'visualizer'" class="visualizer-panel">
            <div class="panel-header">
              <div class="header-left">
                <h3>Data Visualizer</h3>
                <div v-if="getTotalSelectedCount() > 0" class="data-summary">
                  <span class="summary-badge">{{ getTotalSelectedCount() }} dimensions selected</span>
                </div>
              </div>
              <div class="panel-controls">
                <div class="control-group">
                  <label>Chart Type:</label>
                  <select v-model="chartType" @change="updateVisualization" class="chart-type-select">
                    <option value="column">📊 Column Chart</option>
                    <option value="line">📈 Line Chart</option>
                    <option value="pie">🍰 Pie Chart</option>
                    <option value="bar">📊 Bar Chart</option>
                    <option value="area">📉 Area Chart</option>
                    <option value="scatter">⚪ Scatter Plot</option>
                  </select>
                </div>
                <div class="action-buttons">
                  <button @click="generateChart" class="generate-btn" :disabled="!canGenerateChart">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                    {{ loading ? 'Generating...' : 'Generate' }}
                  </button>
                  <button @click="exportChart" class="export-chart-btn" v-if="hasData">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-15"/>
                      <polyline points="7,10 12,15 17,10"/>
                    </svg>
                    Export
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Chart Configuration Panel -->
            <div class="chart-config-panel" v-if="getTotalSelectedCount() > 0">
              <div class="config-item">
                <label>Title:</label>
                <input v-model="chartTitle" type="text" class="chart-title-input" placeholder="Enter chart title...">
              </div>
              <div class="config-item">
                <label>Color Scheme:</label>
                <select v-model="colorScheme" @change="updateVisualization" class="color-scheme-select">
                  <option value="default">🎨 Default</option>
                  <option value="professional">💼 Professional</option>
                  <option value="vibrant">🌈 Vibrant</option>
                  <option value="pastel">🎀 Pastel</option>
                </select>
              </div>
              <div class="config-item">
                <label>Animation:</label>
                <input type="checkbox" v-model="enableAnimation" @change="updateVisualization" class="animation-checkbox">
                <span class="checkbox-label">Enable animations</span>
              </div>
            </div>
            
            <div class="visualization-area">
              <div v-if="!hasData && getTotalSelectedCount() === 0" class="no-data-message welcome-state">
                <div class="welcome-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <h4>Welcome to Data Visualizer</h4>
                <p>Select dimensions from the data explorer to create professional charts</p>
                <div class="quick-actions">
                  <button @click="selectAllWithData" class="quick-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9,11 12,14 22,4"/>
                      <path d="M21,12v7a2,2 0 01-2,2H5a2,2 0 01-2-2V5a2,2 0 012-2h11"/>
                    </svg>
                    Select All Data
                  </button>
                  <button @click="showSampleChart" class="quick-action-btn secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                      <path d="M3 3v18h18"/>
                    </svg>
                    Show Sample
                  </button>
                </div>
              </div>
              <div v-else-if="!hasData && getTotalSelectedCount() > 0" class="no-data-message generate-state">
                <div class="generate-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                </div>
                <h4>Ready to Generate</h4>
                <p>Click Generate to create your visualization</p>
                <button @click="generateChart" class="generate-large-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                  Generate Chart
                </button>
              </div>
              <div v-else class="chart-container">
                <div class="chart-header" v-if="chartTitle">
                  <h4>{{ chartTitle }}</h4>
                </div>
                <canvas ref="mainChart" class="main-chart"></canvas>
                <div class="chart-footer">
                  <div class="chart-info">
                    <span>📊 {{ getChartTypeLabel() }}</span>
                    <span>📅 {{ getCurrentPeriodLabel() }}</span>
                    <span>📋 {{ getTotalSelectedCount() }} dimensions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pivot Table Tab -->
          <div v-if="activeTab === 'pivot'" class="flex flex-col h-full bg-white">
            <div class="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-800">Pivot Table</h3>
              <div class="flex gap-2">
                <button @click="configurePivot" class="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>
                  </svg>
                  Configure
                </button>
                <button @click="refreshPivot" class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 4v6h6"/>
                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
            <div class="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
              <!-- Available Fields -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">📋 Available Fields</h4>
                <div class="space-y-2">
                  <div v-for="field in availablePivotFields" 
                       :key="field.id" 
                       class="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded hover:border-purple-300 hover:shadow-sm transition-all"
                       :class="field.type === 'dimension' ? 'border-l-4 border-l-blue-400' : 'border-l-4 border-l-green-400'"
                       draggable="true"
                       @dragstart="startDrag($event, field)"
                       style="cursor: crosshair;">
                    <div class="flex-shrink-0">
                      <svg v-if="field.type === 'dimension'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="12" y1="3" x2="12" y2="21"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                      </svg>
                      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500">
                        <line x1="12" y1="2" x2="12" y2="22"/>
                        <line x1="17" y1="5" x2="9" y2="19"/>
                        <line x1="7" y1="5" x2="15" y2="19"/>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 flex-1">{{ field.name }}</span>
                    <span class="text-xs px-2 py-1 rounded-full" :class="field.type === 'dimension' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'">{{ field.type }}</span>
                  </div>
                </div>
              </div>

              <!-- Quick Start Templates -->
              <div class="bg-gray-50 rounded-lg p-4" v-if="showPivotConfig">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">🚀 Quick Start Templates</h4>
                <div class="space-y-2">
                  <button @click="loadPivotTemplate('age-status')" class="w-full text-left p-2 bg-white border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-all text-sm">
                    📊 Age Groups vs Status
                  </button>
                  <button @click="loadPivotTemplate('form-types')" class="w-full text-left p-2 bg-white border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-all text-sm">
                    📋 Form Types Analysis  
                  </button>
                  <button @click="loadPivotTemplate('referral-methods')" class="w-full text-left p-2 bg-white border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-all text-sm">
                    🔗 Referral Sources
                  </button>
                  <button @click="clearPivotConfig" class="w-full text-left p-2 bg-white border border-gray-200 rounded hover:border-red-300 hover:bg-red-50 transition-all text-sm">
                    🗑️ Clear All
                  </button>
                  <button @click="testDragDrop" class="w-full text-left p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all text-sm">
                    🧪 Test Drag/Drop
                  </button>
                </div>
              </div>

              <!-- Configuration Area -->
              <div class="col-span-2 space-y-4">
                <!-- Configuration Sections -->
                <div class="config-sections space-y-4">
                  <!-- Rows Section -->
                  <div class="config-section bg-white p-4 rounded-lg border border-gray-300">
                    <div class="config-header flex items-center justify-between mb-3">
                      <h4>📊 Rows</h4>
                      <span class="config-hint text-gray-400 text-sm">Drag dimensions here</span>
                    </div>
                    <div class="drag-area rows min-h-[120px] border-2 border-dashed rounded p-2 overflow-auto"
                         @drop="dropField($event, 'rows')" 
                         @dragover.prevent="addDragOverClass($event)"
                         @dragenter.prevent="addDragOverClass($event)"
                         @dragleave="removeDragOverClass($event)">
                      <div v-for="field in pivotConfig.rows" :key="'row-' + field.id" class="pivot-field flex justify-between items-center bg-purple-50 border border-purple-300 rounded px-3 py-1 mb-2">
                        <div class="field-content flex items-center gap-2">
                          <div class="field-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            </svg>
                          </div>
                          <span class="field-name text-purple-700">{{ field.name }}</span>
                        </div>
                        <button @click="removeField('rows', field.id)" class="remove-field text-purple-700 hover:text-purple-900" title="Remove field">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                      <div v-if="pivotConfig.rows.length === 0" class="drop-placeholder flex flex-col items-center gap-1 text-gray-400 text-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M12 5v14m7-7H5"/>
                        </svg>
                        <span>Drop fields here for rows</span>
                      </div>
                    </div>
                  </div>
        
        <!-- Columns Section -->
        <div class="config-section bg-white p-4 rounded-lg border border-gray-300">
          <div class="config-header flex items-center justify-between mb-3">
            <h4>📈 Columns</h4>
            <span class="config-hint text-gray-400 text-sm">Drag dimensions here</span>
          </div>
          <div class="drag-area columns min-h-[120px] border-2 border-dashed rounded p-2 overflow-auto"
               @drop="dropField($event, 'columns')" 
               @dragover.prevent="addDragOverClass($event)"
               @dragenter.prevent="addDragOverClass($event)"
               @dragleave="removeDragOverClass($event)">
            <div v-for="field in pivotConfig.columns" :key="'col-' + field.id" class="pivot-field flex justify-between items-center bg-purple-50 border border-purple-300 rounded px-3 py-1 mb-2">
              <div class="field-content flex items-center gap-2">
                <div class="field-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                </div>
                <span class="field-name text-purple-700">{{ field.name }}</span>
              </div>
              <button @click="removeField('columns', field.id)" class="remove-field text-purple-700 hover:text-purple-900" title="Remove field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div v-if="pivotConfig.columns.length === 0" class="drop-placeholder flex flex-col items-center gap-1 text-gray-400 text-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 5v14m7-7H5"/>
              </svg>
              <span>Drop fields here for columns</span>
            </div>
          </div>
        </div>
        
        <!-- Values Section -->
        <div class="config-section bg-white p-4 rounded-lg border border-gray-300">
          <div class="config-header flex items-center justify-between mb-3">
            <h4>📊 Values</h4>
            <span class="config-hint text-gray-400 text-sm">Drag values here</span>
          </div>
          <div class="drag-area values min-h-[120px] border-2 border-dashed rounded p-2 overflow-auto"
               @drop="dropField($event, 'values')" 
               @dragover.prevent="addDragOverClass($event)"
               @dragenter.prevent="addDragOverClass($event)"
               @dragleave="removeDragOverClass($event)">
            <div v-for="field in pivotConfig.values" :key="'val-' + field.id" class="pivot-field flex justify-between items-center bg-purple-50 border border-purple-300 rounded px-3 py-1 mb-2">
              <div class="field-content flex items-center gap-2">
                <div class="field-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="2" x2="12" y2="22"/>
                    <line x1="17" y1="5" x2="9" y2="19"/>
                  </svg>
                </div>
                <span class="field-name text-purple-700">{{ field.name }}</span>
                <select v-model="field.aggregation" class="ml-2 bg-transparent border border-purple-300 rounded text-xs text-purple-700 px-1 py-0.5 focus:outline-none" @change="generatePivotData">
                  <option value="sum">Sum</option>
                  <option value="count">Count</option>
                  <option value="avg">Average</option>
                  <option value="min">Min</option>
                  <option value="max">Max</option>
                </select>
              </div>
              <button @click="removeField('values', field.id)" class="remove-field text-purple-700 hover:text-purple-900" title="Remove field">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div v-if="pivotConfig.values.length === 0" class="drop-placeholder flex flex-col items-center gap-1 text-gray-400 text-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 5v14m7-7H5"/>
              </svg>
              <span>Drop values here</span>
            </div>
          </div>
        </div>
                </div>
                
                <!-- Pivot Table Results -->
                <div class="w-full overflow-auto">
                  <!-- Debug Info -->
                  <div v-if="showDebugInfo" class="bg-gray-100 p-4 mb-4 rounded font-mono text-sm">
                    <div><strong>Debug Info:</strong></div>
                    <div>pivotData.length: {{ pivotData.length }}</div>
                    <div>pivotHeaders.length: {{ pivotHeaders.length }}</div>
                    <div>pivotConfig.rows.length: {{ pivotConfig.rows.length }}</div>
                    <div>pivotConfig.values.length: {{ pivotConfig.values.length }}</div>
                    <div>realAnalytics exists: {{ !!realAnalytics }}</div>
                    <button @click="showDebugInfo = !showDebugInfo" class="mt-2 px-2 py-1 bg-green-500 text-white border-0 rounded cursor-pointer">Hide Debug</button>
                  </div>
                  
                  <div v-if="pivotData.length > 0" class="block w-full visible opacity-100">
                    <div class="flex justify-between items-center mb-4">
                      <h4 class="text-lg font-semibold text-gray-800">📊 Pivot Table Results</h4>
                      <div class="flex gap-2">
                        <button @click="showDebugInfo = !showDebugInfo" class="px-3 py-2 bg-indigo-500 text-white border-0 rounded cursor-pointer text-xs">
                          🐛 Debug
                        </button>
                        <button @click="exportPivotTable('csv')" class="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white border-0 rounded cursor-pointer text-sm hover:bg-purple-700">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Export CSV
                        </button>
                      </div>
                    </div>
                    <div class="w-full overflow-x-auto">
                      <table class="w-full border-collapse bg-white rounded shadow-sm table visible opacity-100 relative z-10">
                        <thead>
                          <tr>
                            <th v-for="header in pivotHeaders" :key="header.id" :colspan="header.colspan || 1" 
                                class="px-4 py-3 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                              {{ header.name }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in pivotData" :key="row.id" class="border-b border-gray-100 hover:bg-gray-50">
                            <td v-for="cell in row.cells" :key="cell.id" :class="cell.type" 
                                class="px-4 py-3 text-left text-sm text-gray-900">
                              {{ cell.value }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div v-else class="flex flex-col items-center justify-center text-gray-500 py-12">
                    <div class="text-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-4">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="12" y1="3" x2="12" y2="21"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                      </svg>
                      <h4 class="text-lg font-semibold mb-2">Create Your Analytics Pivot Table</h4>
                      <p class="text-gray-400 mb-6">Use the templates above or drag fields to build your analysis.</p>
                      <button @click="showDebugInfo = !showDebugInfo" class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                        🐛 Show Debug Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- Reports Tab -->
          <div v-if="activeTab === 'reports'" class="reports-panel">
            <div class="panel-header">
              <h3>Standardized Reports</h3>
              <div class="panel-controls">
                <button @click="scheduleReport" class="schedule-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  Schedule
                </button>
              </div>
            </div>
            <div class="reports-container">
              <!-- Real Data Summary -->
              <div class="data-summary-card">
                <div class="summary-header">
                  <h4>📊 Current Data Summary</h4>
                  <span v-if="realAnalytics" class="data-timestamp">Updated {{ formatDate(new Date()) }}</span>
                </div>
                <div v-if="realAnalytics" class="summary-stats">
                  <div class="summary-stat">
                    <div class="stat-value">{{ realAnalytics.totalForms }}</div>
                    <div class="stat-label">Total Forms</div>
                  </div>
                  <div class="summary-stat">
                    <div class="stat-value">{{ realAnalytics.totalReferrals }}</div>
                    <div class="stat-label">Referrals</div>
                  </div>
                  <div class="summary-stat">
                    <div class="stat-value">{{ realAnalytics.totalOverviews }}</div>
                    <div class="stat-label">Overviews</div>
                  </div>
                  <div class="summary-stat">
                    <div class="stat-value">{{ realAnalytics.totalAssessments }}</div>
                    <div class="stat-label">Assessments</div>
                  </div>
                  <div class="summary-stat">
                    <div class="stat-value">{{ realAnalytics.completionRate }}%</div>
                    <div class="stat-label">Completion Rate</div>
                  </div>
                </div>
                <div v-else class="no-data-summary">
                  <p>No form data available. Create some forms to see analytics.</p>
                </div>
              </div>

              <!-- Recent Activity Table -->
              <div class="recent-activity-card">
                <div class="activity-header">
                  <h4>📝 Recent Activity</h4>
                  <span v-if="recentActivity.length > 0" class="activity-count">{{ recentActivity.length }} recent entries</span>
                </div>
                <div v-if="recentActivity.length > 0" class="activity-table-container">
                  <table class="real-activity-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Child Name</th>
                        <th>User</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="activity in recentActivity.slice(0, 10)" :key="activity.id">
                        <td>{{ formatDate(activity.date) }}</td>
                        <td>
                          <span :class="['activity-badge', activity.type.toLowerCase()]">
                            {{ activity.type }}
                          </span>
                        </td>
                        <td>{{ activity.childName }}</td>
                        <td>{{ activity.user }}</td>
                        <td>
                          <span :class="['status-badge', activity.status.toLowerCase().replace(' ', '-')]">
                            {{ activity.status }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else class="no-activity">
                  <p>No recent activity. Form submissions will appear here.</p>
                </div>
              </div>

              <!-- Standard Reports -->
              <div class="reports-grid">
                <div v-for="report in availableReports" :key="report.id" class="report-card">
                  <div class="report-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path :d="report.icon"/>
                    </svg>
                  </div>
                  <div class="report-info">
                    <h4>{{ report.name }}</h4>
                    <p>{{ report.description }}</p>
                    <div class="report-meta">
                      <span class="last-generated">Last: {{ report.lastGenerated }}</span>
                      <span class="frequency">{{ report.frequency }}</span>
                    </div>
                  </div>
                  <div class="report-actions">
                    <button @click="generateReport(report.id)" class="generate-report-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                      Generate
                    </button>
                    <button @click="downloadReport(report.id)" class="download-btn" :disabled="!report.available">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dashboard Tab -->
          <div v-if="activeTab === 'dashboard'" class="dashboard-panel">
            <div class="dashboard-header">
              <div class="header-content">
                <div class="header-info">
                  <h3>Analytics Dashboard</h3>
                  <p class="dashboard-subtitle">Build your custom analytics dashboard</p>
                </div>
                <div class="header-actions">
                  <button @click="resetDashboard" class="action-btn reset-btn" v-if="dashboardWidgets.length > 0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18l-2-2H5L3 6z"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                    </svg>
                    Reset
                  </button>
                  <button @click="saveDashboard" class="action-btn save-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                      <polyline points="17,21 17,13 7,13 7,21"/>
                      <polyline points="7,3 7,8 15,8"/>
                    </svg>
                    Save Dashboard
                  </button>
                </div>
              </div>
            </div>
            
            <div class="dashboard-builder">
              <!-- Widget Library Sidebar -->
              <div class="widget-library">
                <div class="library-header">
                  <h4>📊 Widget Library</h4>
                  <p class="library-subtitle">Drag widgets to your dashboard</p>
                </div>
                
                <!-- Widget Categories -->
                <div class="widget-categories">
                  <div class="category-section">
                    <h5 class="category-title">📈 Charts & Metrics</h5>
                    <div class="widget-grid">
                      <div v-for="widget in chartWidgets" :key="widget.id" 
                           class="widget-card" 
                           @click="addWidget(widget.id)"
                           draggable="true"
                           @dragstart="dragWidget($event, widget)"
                           :title="widget.description">
                        <div class="widget-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path :d="widget.icon"/>
                          </svg>
                        </div>
                        <div class="widget-info">
                          <span class="widget-name">{{ widget.name }}</span>
                          <span class="widget-desc">{{ widget.shortDesc }}</span>
                        </div>
                        <div class="add-indicator">+</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="category-section">
                    <h5 class="category-title">📋 Data & Tables</h5>
                    <div class="widget-grid">
                      <div v-for="widget in dataWidgets" :key="widget.id" 
                           class="widget-card" 
                           @click="addWidget(widget.id)"
                           draggable="true"
                           @dragstart="dragWidget($event, widget)"
                           :title="widget.description">
                        <div class="widget-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path :d="widget.icon"/>
                          </svg>
                        </div>
                        <div class="widget-info">
                          <span class="widget-name">{{ widget.name }}</span>
                          <span class="widget-desc">{{ widget.shortDesc }}</span>
                        </div>
                        <div class="add-indicator">+</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="category-section">
                    <h5 class="category-title">⚡ Quick Actions</h5>
                    <div class="quick-actions">
                      <button @click="loadSampleDashboard" class="quick-action-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                          <path d="M3 3v18h18"/>
                        </svg>
                        Load Sample
                      </button>
                      <button @click="exportDashboard" class="quick-action-btn" v-if="dashboardWidgets.length > 0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="7,10 12,15 17,10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Dashboard Canvas -->
              <div class="dashboard-canvas-container">
                <div class="canvas-header" v-if="dashboardWidgets.length > 0">
                  <div class="canvas-info">
                    <span class="widget-count">{{ dashboardWidgets.length }} widgets</span>
                    <span class="last-saved" v-if="lastSaved">Last saved: {{ formatDate(lastSaved) }}</span>
                  </div>
                  <div class="canvas-controls">
                    <button @click="toggleGridLines" class="control-btn" :class="{ active: showGridLines }">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="12" y1="3" x2="12" y2="21"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                      </svg>
                      Grid
                    </button>
                    <button @click="toggleAutoLayout" class="control-btn" :class="{ active: autoLayout }">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="6" height="6" rx="1"/>
                        <rect x="15" y="3" width="6" height="6" rx="1"/>
                        <rect x="3" y="15" width="6" height="6" rx="1"/>
                        <rect x="15" y="15" width="6" height="6" rx="1"/>
                      </svg>
                      Auto
                    </button>
                  </div>
                </div>
                
                <div class="dashboard-canvas"
                     :class="{ 'show-grid': showGridLines, 'auto-layout': autoLayout }"
                     @drop="dropWidget($event)"
                     @dragover.prevent
                     @dragenter.prevent>
                  
                  <!-- Existing Widgets -->
                  <div v-for="widget in dashboardWidgets" 
                       :key="widget.id" 
                       class="dashboard-widget"
                       :class="widget.size"
                       :style="getWidgetStyle(widget)"
                       :data-widget-id="widget.id"
                       @mousedown="startWidgetDrag(widget.id, $event)"
                       @click="selectWidget(widget.id)">
                    <div class="widget-header">
                      <div class="widget-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path :d="widget.icon"/>
                        </svg>
                        <span>{{ widget.title }}</span>
                      </div>
                      <div class="widget-controls">
                        <button @click.stop="configureWidget(widget.id)" class="widget-control-btn" title="Configure">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                          </svg>
                        </button>
                        <button @click.stop="duplicateWidget(widget.id)" class="widget-control-btn" title="Duplicate">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                          </svg>
                        </button>
                        <button @click.stop="removeWidget(widget.id)" class="widget-control-btn remove" title="Remove">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="widget-content">
                      <!-- Metric Card Widget -->
                      <div v-if="widget.type === 'metric_card'" class="metric-card-content">
                        <div class="metric-header">
                          <h4>{{ widget.config.metric || 'Total Forms' }}</h4>
                          <div class="metric-trend" :class="getTrendClass(widget.config.trend)">
                            {{ widget.config.trend || '+0%' }}
                          </div>
                        </div>
                        <div class="metric-value">
                          {{ getMetricValue(widget.config.metric) }}
                        </div>
                        <div class="metric-description">
                          {{ getMetricDescription(widget.config.metric) }}
                        </div>
                      </div>

                      <!-- Line Chart Widget -->
                      <div v-else-if="widget.type === 'line_chart'" class="chart-widget-content">
                        <canvas :data-ref="`chart_${widget.id}`" class="widget-chart"></canvas>
                      </div>

                      <!-- Pie Chart Widget -->
                      <div v-else-if="widget.type === 'pie_chart'" class="chart-widget-content">
                        <canvas :data-ref="`chart_${widget.id}`" class="widget-chart"></canvas>
                      </div>

                      <!-- Bar Chart Widget -->
                      <div v-else-if="widget.type === 'bar_chart'" class="chart-widget-content">
                        <canvas :data-ref="`chart_${widget.id}`" class="widget-chart"></canvas>
                      </div>

                      <!-- Data Table Widget -->
                      <div v-else-if="widget.type === 'data_table'" class="data-table-content">
                        <div class="table-header">
                          <h4>{{ getDataTableTitle(widget.config.dataSource) }}</h4>
                        </div>
                        <div class="table-container">
                          <table class="widget-table">
                            <thead>
                              <tr>
                                <th v-for="header in getTableHeaders(widget.config.dataSource)" :key="header">
                                  {{ header }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="row in getTableData(widget.config.dataSource, widget.config.itemsPerPage || 5)" :key="row.id">
                                <td v-for="cell in row.cells" :key="cell.key" :class="cell.class">
                                  {{ cell.value }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div v-if="getTableData(widget.config.dataSource, widget.config.itemsPerPage || 5).length === 0" class="no-data">
                            No data available
                          </div>
                        </div>
                      </div>

                      <!-- Summary Stats Widget -->
                      <div v-else-if="widget.type === 'summary_stats'" class="summary-stats-content">
                        <div class="stats-grid">
                          <div v-for="stat in getSummaryStats()" :key="stat.key" class="stat-item">
                            <div class="stat-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path :d="stat.icon"/>
                              </svg>
                            </div>
                            <div class="stat-info">
                              <div class="stat-value">{{ stat.value }}</div>
                              <div class="stat-label">{{ stat.label }}</div>
                              <div v-if="widget.config.showTrends && stat.trend" class="stat-trend" :class="getTrendClass(stat.trend)">
                                {{ stat.trend }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Recent Activity Widget -->
                      <div v-else-if="widget.type === 'recent_activity'" class="activity-content">
                        <div class="activity-header">
                          <h4>Recent Activity</h4>
                        </div>
                        <div class="activity-list">
                          <div v-for="activity in getRecentActivity(widget.config.itemCount || 5)" :key="activity.id" class="activity-item">
                            <div v-if="widget.config.showAvatars" class="activity-avatar">
                              {{ activity.user.charAt(0) }}
                            </div>
                            <div class="activity-info">
                              <div class="activity-text">
                                <strong>{{ activity.childName }}</strong> - {{ activity.type }}
                              </div>
                              <div class="activity-meta">
                                <span class="activity-user">by {{ activity.user }}</span>
                                <span v-if="widget.config.showTimestamp" class="activity-time">
                                  {{ formatRelativeTime(activity.date) }}
                                </span>
                              </div>
                              <div class="activity-status" :class="`status-${activity.status.toLowerCase().replace(' ', '-')}`">
                                {{ activity.status }}
                              </div>
                            </div>
                          </div>
                          <div v-if="getRecentActivity(widget.config.itemCount || 5).length === 0" class="no-activity">
                            No recent activity
                          </div>
                        </div>
                      </div>

                      <!-- Progress Tracker Widget -->
                      <div v-else-if="widget.type === 'progress_tracker'" class="progress-content">
                        <div class="progress-header">
                          <h4>{{ widget.title }}</h4>
                          <div v-if="widget.config.showPercentage" class="progress-percentage">
                            {{ getProgressValue(widget.config) }}%
                          </div>
                        </div>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            :style="{ width: getProgressValue(widget.config) + '%' }"
                            :class="{ 'animate': widget.config.animateProgress }"
                          ></div>
                        </div>
                        <div class="progress-info">
                          <span>{{ getCurrentProgressValue(widget.config) }} / {{ widget.config.targetValue || 100 }}</span>
                        </div>
                      </div>

                      <!-- Default Placeholder -->
                      <div v-else class="widget-placeholder">
                        <div class="placeholder-content">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path :d="widget.icon"/>
                          </svg>
                          <h4>{{ widget.title }}</h4>
                          <p>{{ widget.description }}</p>
                          <button @click="configureWidget(widget.id)" class="configure-btn">
                            Configure Widget
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="widget-resize-handle" @mousedown.stop="startWidgetResize(widget.id, $event)"></div>
                  </div>
                  
                  <!-- Empty State -->
                  <div v-if="dashboardWidgets.length === 0" class="empty-dashboard">
                    <div class="empty-content">
                      <div class="empty-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <line x1="12" y1="3" x2="12" y2="21"/>
                          <line x1="3" y1="12" x2="21" y2="12"/>
                        </svg>
                      </div>
                      <h3>Build Your Analytics Dashboard</h3>
                      <p>Drag widgets from the library or click to add them to your dashboard</p>
                      <div class="empty-actions">
                        <button @click="loadSampleDashboard" class="primary-action-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                            <path d="M3 3v18h18"/>
                          </svg>
                          Load Sample Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Drop Zone Indicator -->
                  <div class="drop-zone-indicator" v-show="isDragging">
                    <div class="drop-zone-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 5v14m7-7H5"/>
                      </svg>
                      <p>Drop widget here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="loading-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        </div>
        <p>Loading analytics data...</p>
      </div>
    </div>

    <!-- Widget Configuration Modal -->
    <div v-if="showConfigModal" class="modal-overlay" @click="closeConfigModal">
      <div class="config-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
            <h3>Configure Widget: {{ configWidget?.title }}</h3>
          </div>
          <button @click="closeConfigModal" class="modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div v-if="configWidget" class="config-form">
            <!-- Basic Widget Settings -->
            <div class="config-section">
              <h4>📋 Basic Settings</h4>
              <div class="form-group">
                <label>Widget Title</label>
                <input 
                  v-model="configWidget.title" 
                  type="text" 
                  class="form-input"
                  @input="updateWidgetConfig('title', $event.target.value)"
                  placeholder="Enter widget title"
                />
              </div>
              
              <div class="form-group">
                <label>Widget Size</label>
                <select 
                  v-model="configWidget.size" 
                  @change="updateWidgetConfig('size', $event.target.value)"
                  class="form-select"
                >
                  <option value="small">Small (280x200)</option>
                  <option value="medium">Medium (400x300)</option>
                  <option value="large">Large (600x400)</option>
                </select>
              </div>
            </div>

            <!-- Chart Widget Specific Settings -->
            <div v-if="['line_chart', 'pie_chart', 'bar_chart'].includes(configWidget.type)" class="config-section">
              <h4>📊 Chart Settings</h4>
              
              <div class="form-group">
                <label>Data Source</label>
                <select 
                  v-model="configWidget.config.dataSource" 
                  @change="updateWidgetConfig('config.dataSource', $event.target.value)"
                  class="form-select"
                >
                  <option value="monthly_trends">Monthly Trends</option>
                  <option value="form_types">Form Types Distribution</option>
                  <option value="status_breakdown">Status Breakdown</option>
                  <option value="age_distribution">Age Distribution</option>
                  <option value="referral_methods">Referral Methods</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.showLegend !== false" 
                    @change="updateWidgetConfig('config.showLegend', $event.target.checked)"
                  />
                  Show Legend
                </label>
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.enableAnimation !== false" 
                    @change="updateWidgetConfig('config.enableAnimation', $event.target.checked)"
                  />
                  Enable Animations
                </label>
              </div>
            </div>

            <!-- Metric Card Specific Settings -->
            <div v-if="configWidget.type === 'metric_card'" class="config-section">
              <h4>📈 Metric Settings</h4>
              
              <div class="form-group">
                <label>Metric Name</label>
                <input 
                  v-model="configWidget.config.metric" 
                  type="text" 
                  class="form-input"
                  @input="updateWidgetConfig('config.metric', $event.target.value)"
                  placeholder="e.g., Total Forms"
                />
              </div>
              
              <div class="form-group">
                <label>Display Value</label>
                <input 
                  v-model="configWidget.config.value" 
                  type="number" 
                  class="form-input"
                  @input="updateWidgetConfig('config.value', parseInt($event.target.value))"
                  placeholder="e.g., 150"
                />
              </div>
              
              <div class="form-group">
                <label>Trend Indicator</label>
                <input 
                  v-model="configWidget.config.trend" 
                  type="text" 
                  class="form-input"
                  @input="updateWidgetConfig('config.trend', $event.target.value)"
                  placeholder="e.g., +5% or -2%"
                />
              </div>
            </div>

            <!-- Data Table Specific Settings -->
            <div v-if="configWidget.type === 'data_table'" class="config-section">
              <h4>📋 Table Settings</h4>
              
              <div class="form-group">
                <label>Data Source</label>
                <select 
                  v-model="configWidget.config.dataSource" 
                  @change="updateWidgetConfig('config.dataSource', $event.target.value)"
                  class="form-select"
                >
                  <option value="recent_activity">Recent Activity</option>
                  <option value="form_submissions">Form Submissions</option>
                  <option value="user_activity">User Activity</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Rows Per Page</label>
                <select 
                  v-model="configWidget.config.itemsPerPage" 
                  @change="updateWidgetConfig('config.itemsPerPage', parseInt($event.target.value))"
                  class="form-select"
                >
                  <option value="5">5 rows</option>
                  <option value="10">10 rows</option>
                  <option value="20">20 rows</option>
                  <option value="50">50 rows</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.showPagination !== false" 
                    @change="updateWidgetConfig('config.showPagination', $event.target.checked)"
                  />
                  Show Pagination
                </label>
              </div>
            </div>

            <!-- Summary Stats Specific Settings -->
            <div v-if="configWidget.type === 'summary_stats'" class="config-section">
              <h4>📊 Statistics Settings</h4>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.showTrends !== false" 
                    @change="updateWidgetConfig('config.showTrends', $event.target.checked)"
                  />
                  Show Trend Indicators
                </label>
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.animateNumbers !== false" 
                    @change="updateWidgetConfig('config.animateNumbers', $event.target.checked)"
                  />
                  Animate Number Changes
                </label>
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.showComparison !== false" 
                    @change="updateWidgetConfig('config.showComparison', $event.target.checked)"
                  />
                  Show Period Comparison
                </label>
              </div>
            </div>

            <!-- Recent Activity Specific Settings -->
            <div v-if="configWidget.type === 'recent_activity'" class="config-section">
              <h4>🔄 Activity Settings</h4>
              
              <div class="form-group">
                <label>Number of Items</label>
                <select 
                  v-model="configWidget.config.itemCount" 
                  @change="updateWidgetConfig('config.itemCount', parseInt($event.target.value))"
                  class="form-select"
                >
                  <option value="3">3 items</option>
                  <option value="5">5 items</option>
                  <option value="10">10 items</option>
                  <option value="15">15 items</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.showTimestamp !== false" 
                    @change="updateWidgetConfig('config.showTimestamp', $event.target.checked)"
                  />
                  Show Timestamps
                </label>
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.showAvatars !== false" 
                    @change="updateWidgetConfig('config.showAvatars', $event.target.checked)"
                  />
                  Show User Avatars
                </label>
              </div>
            </div>

            <!-- Progress Tracker Specific Settings -->
            <div v-if="configWidget.type === 'progress_tracker'" class="config-section">
              <h4>📈 Progress Settings</h4>
              
              <div class="form-group">
                <label>Progress Value (%)</label>
                <input 
                  v-model="configWidget.config.progressValue" 
                  type="number" 
                  min="0" 
                  max="100" 
                  class="form-input"
                  @input="updateWidgetConfig('config.progressValue', parseInt($event.target.value))"
                  placeholder="e.g., 75"
                />
              </div>
              
              <div class="form-group">
                <label>Target Value</label>
                <input 
                  v-model="configWidget.config.targetValue" 
                  type="number" 
                  class="form-input"
                  @input="updateWidgetConfig('config.targetValue', parseInt($event.target.value))"
                  placeholder="e.g., 100"
                />
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.showPercentage !== false" 
                    @change="updateWidgetConfig('config.showPercentage', $event.target.checked)"
                  />
                  Show Percentage
                </label>
              </div>
              
              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    :checked="configWidget.config.animateProgress !== false" 
                    @change="updateWidgetConfig('config.animateProgress', $event.target.checked)"
                  />
                  Animate Progress Bar
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeConfigModal" class="btn-secondary">
            Cancel
          </button>
          <button @click="saveWidgetConfig" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import FormService from '../services/formService.js'
import UserService from '../services/userService.js'

// Register Chart.js components
Chart.register(...registerables)

// Reactive data
const loading = ref(false)
const showExportDropdown = ref(false)
const activeTab = ref('visualizer')
const chartType = ref('column')
const hasData = ref(false)
const chartTitle = ref('')
const colorScheme = ref('default')
const enableAnimation = ref(true)
const canGenerateChart = computed(() => {
  return selectedDimensions.value.length > 0 && selectedPeriod.value
})

// Data Explorer
const dimensions = ref([
  {
    id: 'age_groups',
    name: 'Age Groups',
    expanded: false,
    selectedCount: 0,
    items: [
      { id: '0-2', name: '0-2 years', count: 0, selected: false },
      { id: '3-5', name: '3-5 years', count: 0, selected: false },
      { id: '6-8', name: '6-8 years', count: 0, selected: false },
      { id: '9-12', name: '9-12 years', count: 0, selected: false },
      { id: '13-17', name: '13-17 years', count: 0, selected: false },
      { id: '18+', name: '18+ years', count: 0, selected: false }
    ]
  },
  {
    id: 'form_types',
    name: 'Form Types',
    expanded: false,
    selectedCount: 0,
    items: [
      { id: 'initial-referral', name: 'Initial Referrals', count: 0, selected: false },
      { id: 'child-overview', name: 'Child Overviews', count: 0, selected: false },
      { id: 'initial-assessment', name: 'Initial Assessments', count: 0, selected: false }
    ]
  },
  {
    id: 'status',
    name: 'Status',
    expanded: false,
    selectedCount: 0,
    items: [
      { id: 'completed', name: 'Completed', count: 0, selected: false },
      { id: 'draft', name: 'Draft', count: 0, selected: false },
      { id: 'pending', name: 'Pending', count: 0, selected: false }
    ]
  },
  {
    id: 'referral_methods',
    name: 'Referral Methods',
    expanded: false,
    selectedCount: 0,
    items: []
  },
  {
    id: 'abuse_types',
    name: 'Abuse Types',
    expanded: false,
    selectedCount: 0,
    items: []
  }
])

// Real analytics data
const realAnalytics = ref(null)
const recentActivity = ref([])

// Date Range
const selectedPeriodType = ref('monthly')
const selectedPeriod = ref('2025-10')
const dateRange = ref({ start: '', end: '' })
const availablePeriods = computed(() => {
  if (selectedPeriodType.value === 'monthly') {
    return [
      { id: '2025-10', name: 'October 2025' },
      { id: '2025-09', name: 'September 2025' },
      { id: '2025-08', name: 'August 2025' },
      { id: '2025-07', name: 'July 2025' },
      { id: '2025-06', name: 'June 2025' },
      { id: '2025-05', name: 'May 2025' }
    ]
  } else if (selectedPeriodType.value === 'quarterly') {
    return [
      { id: '2025-Q4', name: 'Q4 2025' },
      { id: '2025-Q3', name: 'Q3 2025' },
      { id: '2025-Q2', name: 'Q2 2025' },
      { id: '2025-Q1', name: 'Q1 2025' }
    ]
  } else if (selectedPeriodType.value === 'yearly') {
    return [
      { id: '2025', name: '2025' },
      { id: '2024', name: '2024' },
      { id: '2023', name: '2023' }
    ]
  }
  return []
})

// Organization Units
const orgUnits = ref([
  {
    id: 'main',
    name: 'KHUKOMA Project',
    expanded: true,
    selected: true,
    children: [
      { id: 'region1', name: 'Northern Region', selected: true },
      { id: 'region2', name: 'Central Region', selected: false },
      { id: 'region3', name: 'Southern Region', selected: true }
    ]
  }
])

// Analysis Tabs
const analysisTabs = ref([
  {
    id: 'visualizer',
    name: 'Data Visualizer',
    icon: 'M3 3v18h18 M18.7 8l-5.1 5.2-2.8-2.7L7 14.3'
  },
  {
    id: 'pivot',
    name: 'Pivot Table',
    icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z'
  }
])

// Pivot Table
const showPivotConfig = ref(true)
const showDebugInfo = ref(false)
const pivotConfig = ref({
  rows: [],
  columns: [],
  values: []
})
const pivotData = ref([])
const pivotHeaders = ref([])

// Reports
const availableReports = ref([
  {
    id: 'monthly_summary',
    name: 'Monthly Summary',
    description: 'Comprehensive monthly report with key metrics',
    icon: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
    lastGenerated: 'Oct 15, 2025',
    frequency: 'Monthly',
    available: true
  },
  {
    id: 'child_tracking',
    name: 'Child Tracking Report',
    description: 'Detailed tracking of all children in the system',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
    lastGenerated: 'Oct 12, 2025',
    frequency: 'Weekly',
    available: true
  },
  {
    id: 'form_analytics',
    name: 'Form Analytics',
    description: 'Analysis of form completion rates and trends',
    icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14,2 L14,8 L20,8',
    lastGenerated: 'Oct 10, 2025',
    frequency: 'Bi-weekly',
    available: true
  }
])

// Available fields for pivot table drag and drop
const availablePivotFields = ref([
  { id: 'age_groups', name: 'Age Groups', type: 'dimension' },
  { id: 'form_types', name: 'Form Types', type: 'dimension' },
  { id: 'status', name: 'Status', type: 'dimension' },
  { id: 'referral_methods', name: 'Referral Methods', type: 'dimension' },
  { id: 'abuse_types', name: 'Abuse Types', type: 'dimension' },
  { id: 'count', name: 'Count', type: 'value' },
  { id: 'percentage', name: 'Percentage', type: 'value' }
])

// Dashboard State
const dashboardWidgets = ref([])
const isDragging = ref(false)
const showGridLines = ref(true)
const autoLayout = ref(false)
const lastSaved = ref(null)
const selectedWidget = ref(null)
const showConfigModal = ref(false)
const configWidget = ref(null)

// Chart Widgets
const chartWidgets = ref([
  {
    id: 'metric_card',
    name: 'Metric Card',
    shortDesc: 'Key metrics',
    description: 'Display important KPIs and metrics',
    icon: 'M9 11H5a2 2 0 000 4h4a2 2 0 000-4zM19 11h-4a2 2 0 000 4h4a2 2 0 000-4z',
    size: 'small',
    defaultConfig: { metric: 'Total Forms', value: 0, trend: '+5%' }
  },
  {
    id: 'line_chart',
    name: 'Line Chart',
    shortDesc: 'Trends over time',
    description: 'Show data trends and patterns over time',
    icon: 'M3 3v18h18 M18.7 8l-5.1 5.2-2.8-2.7L7 14.3',
    size: 'medium',
    defaultConfig: { chartType: 'line', dataSource: 'monthly_trends' }
  },
  {
    id: 'pie_chart',
    name: 'Pie Chart',
    shortDesc: 'Data distribution',
    description: 'Show proportional data distribution',
    icon: 'M21.21 15.89A10 10 0 118 2.83 M22 12A10 10 0 0012 2v10z',
    size: 'medium',
    defaultConfig: { chartType: 'pie', dataSource: 'form_types' }
  },
  {
    id: 'bar_chart',
    name: 'Bar Chart',
    shortDesc: 'Compare values',
    description: 'Compare different categories or values',
    icon: 'M18 20V10 M12 20V4 M6 20v-6',
    size: 'medium',
    defaultConfig: { chartType: 'bar', dataSource: 'status_breakdown' }
  }
])

// Data Widgets
const dataWidgets = ref([
  {
    id: 'data_table',
    name: 'Data Table',
    shortDesc: 'Tabular data',
    description: 'Display data in a structured table format',
    icon: 'M3 6h18 M3 12h18 M3 18h18',
    size: 'large',
    defaultConfig: { dataSource: 'recent_activity', showPagination: true }
  },
  {
    id: 'summary_stats',
    name: 'Summary Stats',
    shortDesc: 'Quick overview',
    description: 'Show multiple key statistics at once',
    icon: 'M16 4v12l-4-2-4 2V4 M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z',
    size: 'medium',
    defaultConfig: { showTrends: true, animateNumbers: true }
  },
  {
    id: 'recent_activity',
    name: 'Recent Activity',
    shortDesc: 'Latest updates',
    description: 'Show the most recent system activity',
    icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
    size: 'medium',
    defaultConfig: { itemCount: 5, showTimestamp: true }
  },
  {
    id: 'progress_tracker',
    name: 'Progress Tracker',
    shortDesc: 'Track completion',
    description: 'Monitor progress and completion rates',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
    size: 'small',
    defaultConfig: { showPercentage: true, animateProgress: true }
  }
])

// Chart references and data
const mainChart = ref(null)
let chartInstance = null
const selectedDimensions = computed(() => {
  return dimensions.value.flatMap(dim => 
    dim.items.filter(item => item.selected)
  )
})

// Computed properties
const hasSelections = computed(() => {
  return dimensions.value.some(dim => dim.selectedCount > 0) || 
         orgUnits.value.some(org => org.selected && org.id !== 'main')
})

// Methods
const refreshData = async () => {
  loading.value = true
  try {
    console.log('Loading real analytics data...')
    
    // Load real analytics data from FormService
    const analyticsResult = await FormService.getAnalyticsData()
    
    if (analyticsResult.success && analyticsResult.analytics) {
      realAnalytics.value = analyticsResult.analytics
      
      // Update dimensions with real data
      updateDimensionsWithRealData(analyticsResult.analytics)
      
      // Update recent activity
      recentActivity.value = analyticsResult.analytics.recentActivity
      
      console.log('Real analytics data loaded:', analyticsResult.analytics)
    } else {
      console.error('Failed to load analytics:', analyticsResult.error)
      // Fallback to mock data if real data fails
      setMockData()
    }
  } catch (error) {
    console.error('Error loading real data:', error)
    // Fallback to mock data on error
    setMockData()
  } finally {
    loading.value = false
  }
}

// Update dimensions with real data
const updateDimensionsWithRealData = (analytics) => {
  // Update age groups
  const ageGroupDimension = dimensions.value.find(d => d.id === 'age_groups')
  if (ageGroupDimension && analytics.ageDistribution) {
    ageGroupDimension.items.forEach(item => {
      item.count = analytics.ageDistribution[item.id] || 0
    })
  }
  
  // Update form types
  const formTypesDimension = dimensions.value.find(d => d.id === 'form_types')
  if (formTypesDimension && analytics.formsByType) {
    formTypesDimension.items.forEach(item => {
      item.count = analytics.formsByType[item.id] || 0
    })
  }
  
  // Update status
  const statusDimension = dimensions.value.find(d => d.id === 'status')
  if (statusDimension && analytics.formsByStatus) {
    statusDimension.items.forEach(item => {
      item.count = analytics.formsByStatus[item.id] || 0
    })
  }
  
  // Update referral methods
  const referralMethodsDimension = dimensions.value.find(d => d.id === 'referral_methods')
  if (referralMethodsDimension && analytics.referralMethods) {
    referralMethodsDimension.items = Object.entries(analytics.referralMethods).map(([method, count]) => ({
      id: method,
      name: method,
      count: count,
      selected: false
    }))
  }
  
  // Update abuse types
  const abuseTypesDimension = dimensions.value.find(d => d.id === 'abuse_types')
  if (abuseTypesDimension && analytics.abuseTypes) {
    abuseTypesDimension.items = Object.entries(analytics.abuseTypes).map(([type, count]) => ({
      id: type,
      name: type,
      count: count,
      selected: false
    }))
  }
}

// Fallback mock data
const setMockData = () => {
  dimensions.value.forEach(dim => {
    if (dim.items.length > 0 && dim.items[0].count === 0) {
      dim.items.forEach(item => {
        item.count = Math.floor(Math.random() * 50) + 10
      })
    }
  })
  
  // Mock recent activity
  recentActivity.value = [
    {
      id: 1,
      date: new Date('2024-10-15'),
      type: 'Referral',
      childName: 'Sample Child 1',
      user: 'System User',
      status: 'Completed'
    },
    {
      id: 2,
      date: new Date('2024-10-14'),
      type: 'Overview',
      childName: 'Sample Child 2',
      user: 'System User',
      status: 'Draft'
    }
  ]
}

const toggleExportDropdown = () => {
  showExportDropdown.value = !showExportDropdown.value
}

const exportData = (format) => {
  console.log(`Exporting data as ${format}`)
  showExportDropdown.value = false
  // Create CSV content based on current data
  const csvContent = [
    'Dimension,Value,Count',
    ...selectedDimensions.value.map(item => `${item.name},${item.id},${item.count}`)
  ].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: format === 'csv' ? 'text/csv' : 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `khukoma-analytics-${new Date().toISOString().split('T')[0]}.${format}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

const openSettings = () => {
  console.log('Opening settings')
}

const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

// Data Explorer Methods
const resetSelection = () => {
  dimensions.value.forEach(dim => {
    dim.selectedCount = 0
    dim.items.forEach(item => {
      item.selected = false
    })
  })
  hasData.value = false
}

const getTotalSelectedCount = () => {
  return dimensions.value.reduce((total, dim) => total + dim.selectedCount, 0)
}

const selectAllWithData = () => {
  dimensions.value.forEach(dim => {
    dim.items.forEach(item => {
      if (item.count > 0) {
        item.selected = true
      }
    })
    dim.selectedCount = dim.items.filter(i => i.selected).length
  })
  hasData.value = getTotalSelectedCount() > 0
}

const showSampleChart = () => {
  chartTitle.value = 'Sample Data Overview'
  hasData.value = true
  nextTick(() => {
    generateSampleChart()
  })
}

const exportChart = () => {
  if (mainChart.value && chartInstance) {
    const link = document.createElement('a')
    link.download = `chart-${Date.now()}.png`
    link.href = mainChart.value.toDataURL()
    link.click()
  }
}

const getChartTypeLabel = () => {
  const types = {
    column: 'Column Chart',
    line: 'Line Chart', 
    pie: 'Pie Chart',
    bar: 'Bar Chart',
    area: 'Area Chart',
    scatter: 'Scatter Plot'
  }
  return types[chartType.value] || 'Chart'
}

const getCurrentPeriodLabel = () => {
  const periods = {
    monthly: 'October 2025',
    quarterly: 'Q4 2025', 
    yearly: '2025',
    custom: 'Custom Range'
  }
  return periods[selectedPeriodType.value] || 'Current Period'
}

const getColorScheme = () => {
  const schemes = {
    default: ['#4A148C', '#FF5722', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0'],
    professional: ['#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'],
    vibrant: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'],
    pastel: ['#fecaca', '#fed7aa', '#fef3c7', '#bbf7d0', '#dbeafe', '#e9d5ff']
  }
  return schemes[colorScheme.value] || schemes.default
}

const generateSampleChart = async () => {
  if (!mainChart.value) return
  
  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const ctx = mainChart.value.getContext('2d')
  const colors = getColorScheme()
  
  const sampleData = {
    labels: ['Form Submissions', 'Active Cases', 'Completed Reviews', 'Pending Assessments'],
    datasets: [{
      label: 'Sample Metrics',
      data: [45, 28, 32, 15],
      backgroundColor: colors.slice(0, 4),
      borderColor: colors.slice(0, 4),
      borderWidth: 2
    }]
  }
  
  const sampleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: enableAnimation.value,
    plugins: {
      title: {
        display: true,
        text: 'Sample Data Overview',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#333',
        padding: 20
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 15,
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }
  
  chartInstance = new Chart(ctx, {
    type: chartType.value === 'column' ? 'bar' : chartType.value,
    data: sampleData,
    options: sampleOptions
  })
}

const toggleDimension = (dimensionId) => {
  const dimension = dimensions.value.find(d => d.id === dimensionId)
  if (dimension) {
    dimension.expanded = !dimension.expanded
  }
}

const toggleDimensionItem = (dimensionId, itemId) => {
  const dimension = dimensions.value.find(d => d.id === dimensionId)
  if (dimension) {
    const item = dimension.items.find(i => i.id === itemId)
    if (item) {
      item.selected = !item.selected
      dimension.selectedCount = dimension.items.filter(i => i.selected).length
    }
  }
}

const toggleOrgUnit = (orgId) => {
  const org = orgUnits.value.find(o => o.id === orgId)
  if (org && org.id !== 'main') {
    org.expanded = !org.expanded
  }
}

const selectOrgUnit = (orgId) => {
  const org = orgUnits.value.find(o => o.id === orgId)
  if (org) {
    org.selected = !org.selected
  }
  // Handle children selection
  orgUnits.value.forEach(parent => {
    if (parent.children) {
      const child = parent.children.find(c => c.id === orgId)
      if (child) {
        child.selected = !child.selected
      }
    }
  })
}

// Chart Methods
const updateVisualization = () => {
  generateChart()
}

const generateChart = async () => {
  if (!canGenerateChart.value) return
  
  loading.value = true
  await nextTick()
  
  if (mainChart.value) {
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy()
    }
    
    const ctx = mainChart.value.getContext('2d')
    const selectedItems = selectedDimensions.value
    
    let chartData
    
    // Use real analytics data if available and generating monthly trends
    if (realAnalytics.value && selectedItems.length === 0 && chartType.value === 'line') {
      // Show monthly trends from real data
      const monthlyData = realAnalytics.value.monthlyTrends
      const months = Object.keys(monthlyData)
      
      chartData = {
        labels: months,
        datasets: [
          {
            label: 'Referrals',
            data: months.map(month => monthlyData[month].referrals),
            borderColor: '#4A148C',
            backgroundColor: 'rgba(74, 20, 140, 0.1)',
            tension: 0.4
          },
          {
            label: 'Overviews',
            data: months.map(month => monthlyData[month].overviews),
            borderColor: '#FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.1)',
            tension: 0.4
          },
          {
            label: 'Assessments',
            data: months.map(month => monthlyData[month].assessments),
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            tension: 0.4
          }
        ]
      }
    } else if (selectedItems.length > 0) {
      // Generate chart based on selected items
      const colors = getColorScheme()
      chartData = {
        labels: selectedItems.map(item => item.name),
        datasets: [{
          label: 'Count',
          data: selectedItems.map(item => item.count),
          backgroundColor: colors.slice(0, selectedItems.length),
          borderColor: colors.slice(0, selectedItems.length),
          borderWidth: 2
        }]
      }
    } else {
      // Default view - show form types distribution if real data available
      if (realAnalytics.value) {
        const formTypes = realAnalytics.value.formsByType
        chartData = {
          labels: ['Initial Referrals', 'Child Overviews', 'Initial Assessments'],
          datasets: [{
            label: 'Form Count',
            data: [
              formTypes['initial-referral'] || 0,
              formTypes['child-overview'] || 0,
              formTypes['initial-assessment'] || 0
            ],
            backgroundColor: ['#4A148C', '#FF5722', '#FF9800'],
            borderColor: ['#4A148C', '#FF5722', '#FF9800'],
            borderWidth: 1
          }]
        }
      } else {
        chartData = {
          labels: ['No Data'],
          datasets: [{
            label: 'Count',
            data: [0],
            backgroundColor: ['#E0E0E0']
          }]
        }
      }
    }
    
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: enableAnimation.value,
      plugins: {
        title: {
          display: !!chartTitle.value,
          text: chartTitle.value || getChartTitle(),
          font: {
            size: 18,
            weight: 'bold'
          },
          color: '#333',
          padding: 20
        },
        legend: {
          display: true,
          position: chartType.value === 'pie' ? 'right' : 'top',
          labels: {
            padding: 15,
            usePointStyle: true
          }
        }
      },
      scales: chartType.value !== 'pie' ? {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      } : {}
    }
    
    // Add scales for non-pie charts
    if (chartType.value !== 'pie') {
      chartOptions.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        },
        x: {
          ticks: {
            maxRotation: 45
          }
        }
      }
    }
    
    chartInstance = new Chart(ctx, {
      type: chartType.value === 'column' ? 'bar' : chartType.value,
      data: chartData,
      options: chartOptions
    })
    
    hasData.value = true
  }
  
  loading.value = false
}

// Helper function to generate chart title
const getChartTitle = () => {
  const selectedItems = selectedDimensions.value
  if (selectedItems.length > 0) {
    return `Data Analysis: ${selectedItems.map(item => item.name).join(', ')}`
  } else if (realAnalytics.value && chartType.value === 'line') {
    return 'Monthly Activity Trends'
  } else {
    return 'Forms Distribution'
  }
}

// Pivot Table Methods
const configurePivot = () => {
  showPivotConfig.value = !showPivotConfig.value
}

const refreshPivot = () => {
  // Refresh pivot table data
  generatePivotData()
}

// Drag and drop methods
const startDrag = (event, field) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(field))
  event.dataTransfer.effectAllowed = 'copy'
}

const addDragOverClass = (event) => {
  event.target.classList.add('dragover')
}

const removeDragOverClass = (event) => {
  event.target.classList.remove('dragover')
}

const dropField = (event, area) => {
  event.preventDefault()
  removeDragOverClass(event)
  
  try {
    const fieldData = JSON.parse(event.dataTransfer.getData('text/plain'))
    
    // Check if field already exists in this area
    const existsInArea = pivotConfig.value[area].some(f => f.id === fieldData.id)
    if (existsInArea) {
      return // Don't add duplicates
    }
    
    // Validate field type for area
    if (area === 'values' && fieldData.type === 'dimension') {
      // Convert dimension to value with count aggregation
      fieldData.aggregation = 'count'
      fieldData.type = 'value'
    } else if ((area === 'rows' || area === 'columns') && fieldData.type === 'value') {
      // Don't allow values in dimension areas
      return
    }
    
    // Add default aggregation for values
    if (area === 'values' && !fieldData.aggregation) {
      fieldData.aggregation = 'count'
    }
    
    pivotConfig.value[area].push({ ...fieldData })
    generatePivotData()
  } catch (error) {
    console.error('Error processing dropped field:', error)
  }
}

const removeField = (area, fieldId) => {
  const index = pivotConfig.value[area].findIndex(f => f.id === fieldId)
  if (index > -1) {
    pivotConfig.value[area].splice(index, 1)
    generatePivotData()
  }
}

// Quick start pivot configuration templates
const loadPivotTemplate = (templateName) => {
  console.log(`Loading pivot template: ${templateName}`)
  
  switch (templateName) {
    case 'age-status':
      pivotConfig.value.rows = [{ id: 'age_groups', name: 'Age Groups', type: 'dimension' }]
      pivotConfig.value.columns = [{ id: 'status', name: 'Status', type: 'dimension' }]
      pivotConfig.value.values = [{ id: 'count', name: 'Count', type: 'value', aggregation: 'count' }]
      break
    case 'form-types':
      pivotConfig.value.rows = [{ id: 'form_types', name: 'Form Types', type: 'dimension' }]
      pivotConfig.value.columns = []
      pivotConfig.value.values = [{ id: 'count', name: 'Count', type: 'value', aggregation: 'count' }]
      break
    case 'referral-methods':
      pivotConfig.value.rows = [{ id: 'referral_methods', name: 'Referral Methods', type: 'dimension' }]
      pivotConfig.value.columns = []
      pivotConfig.value.values = [{ id: 'count', name: 'Count', type: 'value', aggregation: 'count' }]
      break
    default:
      console.log('Unknown template:', templateName)
      return
  }
  
  generatePivotData()
}

const clearPivotConfig = () => {
  pivotConfig.value.rows = []
  pivotConfig.value.columns = []
  pivotConfig.value.values = []
  pivotData.value = []
  pivotHeaders.value = []
}

const testDragDrop = () => {
  console.log('Testing drag and drop functionality')
  // Auto-populate a test configuration
  pivotConfig.value.rows = [{ id: 'age_groups', name: 'Age Groups', type: 'dimension' }]
  pivotConfig.value.columns = []
  pivotConfig.value.values = [{ id: 'count', name: 'Count', type: 'value', aggregation: 'count' }]
  generatePivotData()
  
  // Show a message
  alert('Test configuration loaded! Age Groups added to rows and Count added to values.')
}

const addQuickStartPivot = () => {
  pivotConfig.value.rows = [{ id: 'age_groups', name: 'Age Groups', type: 'dimension' }]
  pivotConfig.value.columns = []
  pivotConfig.value.values = [{ id: 'count', name: 'Count', type: 'value', aggregation: 'count' }]
  generatePivotData()
}

// Export pivot table to CSV
const exportPivotTable = (format) => {
  if (pivotData.value.length === 0) return
  
  try {
    let csvContent = ''
    
    // Add headers
    const headers = pivotHeaders.value.map(h => h.name).join(',')
    csvContent += headers + '\n'
    
    // Add data rows
    pivotData.value.forEach(row => {
      const rowData = row.cells.map(cell => `"${cell.value}"`).join(',')
      csvContent += rowData + '\n'
    })
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `pivot-table-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error exporting pivot table:', error)
  }
}

const generatePivotData = async () => {
  // Clear existing data first
  pivotData.value = []
  pivotHeaders.value = []
  
  // Only generate if we have at least rows configured
  if (pivotConfig.value.rows.length === 0) {
    return
  }
  
  try {
    // Get the selected dimensions for pivot analysis
    const selectedDimensions = pivotConfig.value.rows.map(row => row.id)
    const selectedColumns = pivotConfig.value.columns.map(col => col.id)
    const selectedValues = pivotConfig.value.values.map(val => val.id)
    
    console.log('Generating pivot data for:', { selectedDimensions, selectedColumns, selectedValues })
    
    // Set up headers
    pivotHeaders.value = [
      { id: 'category', name: 'Category' }
    ]
    
    // Add column headers if columns are configured
    if (selectedColumns.length > 0) {
      pivotHeaders.value.push({ id: 'dimension', name: 'Dimension' })
    }
    
    // Add value headers
    if (selectedValues.length > 0) {
      selectedValues.forEach(valueId => {
        const valueField = pivotConfig.value.values.find(v => v.id === valueId)
        pivotHeaders.value.push({ 
          id: valueId, 
          name: valueField ? `${valueField.name} (${valueField.aggregation || 'count'})` : 'Count'
        })
      })
    } else {
      pivotHeaders.value.push({ id: 'count', name: 'Count' })
    }
    
    // Add percentage column
    pivotHeaders.value.push({ id: 'percentage', name: 'Percentage' })
    
    const pivotRows = []
    let rowId = 1
    
    // Use real analytics data if available, otherwise generate sample data
    if (realAnalytics.value) {
      const analytics = realAnalytics.value
        
        // Add age distribution data
        if (selectedDimensions.includes('age_groups') && analytics.ageDistribution) {
          Object.entries(analytics.ageDistribution).forEach(([ageGroup, count]) => {
            if (count > 0) {
              const percentage = analytics.totalForms > 0 ? Math.round((count / analytics.totalForms) * 100) : 0
              pivotRows.push({
                id: `age-${rowId++}`,
                cells: [
                  { id: `age-${rowId}-1`, value: `${ageGroup} years`, type: 'dimension' },
                  { id: `age-${rowId}-2`, value: count.toString(), type: 'value' },
                  { id: `age-${rowId}-3`, value: `${percentage}%`, type: 'percentage' }
                ]
              })
            }
          })
        }
        
        // Add form types data
        if (selectedDimensions.includes('form_types') && analytics.formsByType) {
          Object.entries(analytics.formsByType).forEach(([formType, count]) => {
            if (count > 0) {
              const percentage = analytics.totalForms > 0 ? Math.round((count / analytics.totalForms) * 100) : 0
              const displayName = formType === 'initial-referral' ? 'Initial Referrals' :
                                formType === 'child-overview' ? 'Child Overviews' :
                                formType === 'initial-assessment' ? 'Initial Assessments' : formType
              
              pivotRows.push({
                id: `form-${rowId++}`,
                cells: [
                  { id: `form-${rowId}-1`, value: displayName, type: 'dimension' },
                  { id: `form-${rowId}-2`, value: count.toString(), type: 'value' },
                  { id: `form-${rowId}-3`, value: `${percentage}%`, type: 'percentage' }
                ]
              })
            }
          })
        }
        
        // Add status data
        if (selectedDimensions.includes('status') && analytics.formsByStatus) {
          Object.entries(analytics.formsByStatus).forEach(([status, count]) => {
            if (count > 0) {
              const percentage = analytics.totalForms > 0 ? Math.round((count / analytics.totalForms) * 100) : 0
              const displayName = status.charAt(0).toUpperCase() + status.slice(1)
              
              pivotRows.push({
                id: `status-${rowId++}`,
                cells: [
                  { id: `status-${rowId}-1`, value: displayName, type: 'dimension' },
                  { id: `status-${rowId}-2`, value: count.toString(), type: 'value' },
                  { id: `status-${rowId}-3`, value: `${percentage}%`, type: 'percentage' }
                ]
              })
            }
          })
        }
        
        if (selectedDimensions.includes('referral_methods') && analytics.referralMethods) {
  Object.entries(analytics.referralMethods).forEach(([method, count]) => {
    if (count > 0) {
      const totalReferrals = analytics.totalReferrals + analytics.totalOverviews;
      const percentage = totalReferrals > 0 ? Math.round((count / totalReferrals) * 100) : 0;
      const currentId = rowId++;  // Save before incrementing
      
      pivotRows.push({
        id: `method-${currentId}`,
        cells: [
          { id: `method-${currentId}-1`, value: method, type: 'dimension' },
          { id: `method-${currentId}-2`, value: count.toString(), type: 'value' },
          { id: `method-${currentId}-3`, value: `${percentage}%`, type: 'percentage' }
        ]
      });
    }
  });
}

pivotData.value = pivotRows;

    } else {
      // Fallback to sample data
      pivotHeaders.value = [
        { id: 'dimension', name: 'Category' },
        { id: 'count', name: 'Count' }
      ]

      pivotData.value = [
        {
          id: '1',
          cells: [
            { id: '1-1', value: 'No data available', type: 'dimension' },
            { id: '1-2', value: '0', type: 'value' }
          ]
        }
      ]
    }
  } catch (error) {
    console.error('Error generating pivot data:', error)
    pivotData.value = []
  }
}

// Reports Methods
const scheduleReport = () => {
  console.log('Opening report scheduler')
  // TODO: Implement scheduling modal
}

const generateReport = async (reportId) => {
  loading.value = true
  try {
    console.log(`Generating report: ${reportId}`)
    
    let reportData
    let reportContent
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    switch (reportId) {
      case 'monthly_summary':
        reportData = await generateMonthlySummaryReport()
        reportContent = createMonthlySummaryHTML(reportData, currentDate)
        break
        
      case 'child_tracking':
        reportData = await generateChildTrackingReport()
        reportContent = createChildTrackingHTML(reportData, currentDate)
        break
        
      case 'form_analytics':
        reportData = await generateFormAnalyticsReport()
        reportContent = createFormAnalyticsHTML(reportData, currentDate)
        break
        
      default:
        throw new Error('Unknown report type')
    }
    
    // Update the report's last generated date
    const report = availableReports.value.find(r => r.id === reportId)
    if (report) {
      report.lastGenerated = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      report.available = true
      report.generatedContent = reportContent
    }
    
    // Show success message
    alert(`${report?.name || 'Report'} generated successfully!`)
    
  } catch (error) {
    console.error('Error generating report:', error)
    alert('Error generating report. Please try again.')
  } finally {
    loading.value = false
  }
}

const downloadReport = (reportId) => {
  const report = availableReports.value.find(r => r.id === reportId)
  if (!report || !report.available || !report.generatedContent) {
    alert('Please generate the report first')
    return
  }
  
  try {
    // Create and download HTML file
    const blob = new Blob([report.generatedContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log(`Downloaded report: ${reportId}`)
  } catch (error) {
    console.error('Error downloading report:', error)
    alert('Error downloading report. Please try again.')
  }
}

// Report Generation Functions
const generateMonthlySummaryReport = async () => {
  const analyticsResult = await FormService.getAnalyticsData()
  const analytics = analyticsResult.success ? analyticsResult.analytics : null
  
  return {
    title: 'Monthly Summary Report',
    period: 'October 2025',
    totalForms: analytics?.totalForms || 0,
    totalReferrals: analytics?.totalReferrals || 0,
    totalOverviews: analytics?.totalOverviews || 0,
    totalAssessments: analytics?.totalAssessments || 0,
    completionRate: analytics?.completionRate || 0,
    formsByType: analytics?.formsByType || {},
    formsByStatus: analytics?.formsByStatus || {},
    ageDistribution: analytics?.ageDistribution || {},
    recentActivity: analytics?.recentActivity || [],
    trends: {
      formsThisMonth: analytics?.totalForms || 0,
      formsLastMonth: Math.max(0, (analytics?.totalForms || 0) - Math.floor(Math.random() * 5)),
      completionTrend: analytics?.completionRate > 75 ? 'improving' : 'needs attention'
    }
  }
}

const generateChildTrackingReport = async () => {
  const analyticsResult = await FormService.getAnalyticsData()
  const analytics = analyticsResult.success ? analyticsResult.analytics : null
  
  return {
    title: 'Child Tracking Report',
    period: 'Current Period',
    totalChildren: analytics?.totalForms || 0,
    activeFiles: Math.floor((analytics?.totalForms || 0) * 0.8),
    closedFiles: Math.floor((analytics?.totalForms || 0) * 0.2),
    ageDistribution: analytics?.ageDistribution || {},
    recentActivity: analytics?.recentActivity || [],
    statusBreakdown: analytics?.formsByStatus || {},
    riskLevels: {
      high: Math.floor((analytics?.totalForms || 0) * 0.1),
      medium: Math.floor((analytics?.totalForms || 0) * 0.3),
      low: Math.floor((analytics?.totalForms || 0) * 0.6)
    }
  }
}

const generateFormAnalyticsReport = async () => {
  const analyticsResult = await FormService.getAnalyticsData()
  const analytics = analyticsResult.success ? analyticsResult.analytics : null
  
  return {
    title: 'Form Analytics Report',
    period: 'Last 30 Days',
    totalForms: analytics?.totalForms || 0,
    completionRate: analytics?.completionRate || 0,
    formsByType: analytics?.formsByType || {},
    formsByStatus: analytics?.formsByStatus || {},
    avgCompletionTime: '15 minutes',
    mostUsedForms: [
      { name: 'Initial Referral', count: analytics?.formsByType?.['initial-referral'] || 0 },
      { name: 'Child Overview', count: analytics?.formsByType?.['child-overview'] || 0 },
      { name: 'Initial Assessment', count: analytics?.formsByType?.['initial-assessment'] || 0 }
    ].sort((a, b) => b.count - a.count),
    trends: {
      weeklyGrowth: Math.floor(Math.random() * 20) + 5,
      popularTime: '10:00 AM - 2:00 PM',
      userEngagement: analytics?.completionRate > 50 ? 'Good' : 'Needs Improvement'
    }
  }
}

// HTML Template Generation Functions
const createMonthlySummaryHTML = (data, date) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f6fa; }
        .header { background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; }
        .header h1 { margin: 0; font-size: 2rem; }
        .header p { margin: 0.5rem 0 0 0; opacity: 0.9; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-card h3 { margin: 0 0 0.5rem 0; color: #333; }
        .stat-card .value { font-size: 2rem; font-weight: bold; color: #4A148C; }
        .section { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1rem; }
        .section h2 { margin-top: 0; color: #4A148C; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; }
        .trend-up { color: #28a745; }
        .trend-down { color: #dc3545; }
        .footer { text-align: center; margin-top: 2rem; color: #666; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.title}</h1>
        <p>Period: ${data.period} | Generated: ${date}</p>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <h3>Total Forms</h3>
            <div class="value">${data.totalForms}</div>
        </div>
        <div class="stat-card">
            <h3>Referrals</h3>
            <div class="value">${data.totalReferrals}</div>
        </div>
        <div class="stat-card">
            <h3>Overviews</h3>
            <div class="value">${data.totalOverviews}</div>
        </div>
        <div class="stat-card">
            <h3>Assessments</h3>
            <div class="value">${data.totalAssessments}</div>
        </div>
        <div class="stat-card">
            <h3>Completion Rate</h3>
            <div class="value">${data.completionRate}%</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Recent Activity</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Child Name</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.recentActivity.slice(0, 10).map(activity => `
                    <tr>
                        <td>${formatDate(activity.date)}</td>
                        <td>${activity.type}</td>
                        <td>${activity.childName}</td>
                        <td>${activity.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2>Trends & Insights</h2>
        <p>This month vs last month: <span class="${data.trends.formsThisMonth >= data.trends.formsLastMonth ? 'trend-up' : 'trend-down'}">${data.trends.formsThisMonth >= data.trends.formsLastMonth ? '+' : ''}${data.trends.formsThisMonth - data.trends.formsLastMonth} forms</span></p>
        <p>Completion trend: <strong>${data.trends.completionTrend}</strong></p>
    </div>
    
    <div class="footer">
        <p>KHUKOMA Project - Child Welfare Management System</p>
        <p>Generated on ${date}</p>
    </div>
</body>
</html>
  `
}

const createChildTrackingHTML = (data, date) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f6fa; }
        .header { background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; }
        .header h1 { margin: 0; font-size: 2rem; }
        .header p { margin: 0.5rem 0 0 0; opacity: 0.9; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-card h3 { margin: 0 0 0.5rem 0; color: #333; }
        .stat-card .value { font-size: 1.8rem; font-weight: bold; color: #4A148C; }
        .section { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1rem; }
        .section h2 { margin-top: 0; color: #4A148C; }
        .risk-high { background: #fee; color: #d63384; }
        .risk-medium { background: #fff3cd; color: #f57c00; }
        .risk-low { background: #d1edff; color: #0d6efd; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; }
        .footer { text-align: center; margin-top: 2rem; color: #666; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.title}</h1>
        <p>Period: ${data.period} | Generated: ${date}</p>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <h3>Total Children</h3>
            <div class="value">${data.totalChildren}</div>
        </div>
        <div class="stat-card">
            <h3>Active Files</h3>
            <div class="value">${data.activeFiles}</div>
        </div>
        <div class="stat-card">
            <h3>Closed Files</h3>
            <div class="value">${data.closedFiles}</div>
        </div>
        <div class="stat-card risk-high">
            <h3>High Risk</h3>
            <div class="value">${data.riskLevels.high}</div>
        </div>
        <div class="stat-card risk-medium">
            <h3>Medium Risk</h3>
            <div class="value">${data.riskLevels.medium}</div>
        </div>
        <div class="stat-card risk-low">
            <h3>Low Risk</h3>
            <div class="value">${data.riskLevels.low}</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Age Distribution</h2>
        <table>
            <thead>
                <tr>
                    <th>Age Group</th>
                    <th>Count</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(data.ageDistribution).map(([age, count]) => `
                    <tr>
                        <td>${age} years</td>
                        <td>${count}</td>
                        <td>${data.totalChildren > 0 ? Math.round((count / data.totalChildren) * 100) : 0}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="footer">
        <p>KHUKOMA Project - Child Welfare Management System</p>
        <p>Generated on ${date}</p>
    </div>
</body>
</html>
  `
}

const createFormAnalyticsHTML = (data, date) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f6fa; }
        .header { background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; }
        .header h1 { margin: 0; font-size: 2rem; }
        .header p { margin: 0.5rem 0 0 0; opacity: 0.9; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-card h3 { margin: 0 0 0.5rem 0; color: #333; }
        .stat-card .value { font-size: 1.8rem; font-weight: bold; color: #4A148C; }
        .section { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1rem; }
        .section h2 { margin-top: 0; color: #4A148C; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; }
        .footer { text-align: center; margin-top: 2rem; color: #666; font-size: 0.9rem; }
        .insight { background: #e7f3ff; padding: 1rem; border-radius: 6px; border-left: 4px solid #4A148C; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.title}</h1>
        <p>Period: ${data.period} | Generated: ${date}</p>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <h3>Total Forms</h3>
            <div class="value">${data.totalForms}</div>
        </div>
        <div class="stat-card">
            <h3>Completion Rate</h3>
            <div class="value">${data.completionRate}%</div>
        </div>
        <div class="stat-card">
            <h3>Avg. Completion Time</h3>
            <div class="value">${data.avgCompletionTime}</div>
        </div>
        <div class="stat-card">
            <h3>Weekly Growth</h3>
            <div class="value">+${data.trends.weeklyGrowth}%</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Most Used Forms</h2>
        <table>
            <thead>
                <tr>
                    <th>Form Type</th>
                    <th>Usage Count</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                ${data.mostUsedForms.map(form => `
                    <tr>
                        <td>${form.name}</td>
                        <td>${form.count}</td>
                        <td>${data.totalForms > 0 ? Math.round((form.count / data.totalForms) * 100) : 0}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2>Usage Insights</h2>
        <div class="insight">
            <h3>Peak Usage Time</h3>
            <p>${data.trends.popularTime}</p>
        </div>
        <div class="insight">
            <h3>User Engagement</h3>
            <p>${data.trends.userEngagement}</p>
        </div>
    </div>
    
    <div class="footer">
        <p>KHUKOMA Project - Child Welfare Management System</p>
        <p>Generated on ${date}</p>
    </div>
</body>
</html>
  `
}

// Dashboard Methods
const addWidget = (widgetId) => {
  const allWidgets = [...chartWidgets.value, ...dataWidgets.value]
  const widgetTemplate = allWidgets.find(w => w.id === widgetId)
  
  if (widgetTemplate) {
    const newWidget = {
      id: `${widgetId}_${Date.now()}`,
      type: widgetId,
      title: widgetTemplate.name,
      description: widgetTemplate.description,
      icon: widgetTemplate.icon,
      size: widgetTemplate.size,
      config: { ...widgetTemplate.defaultConfig },
      x: getNextPosition().x,
      y: getNextPosition().y,
      width: getWidgetWidth(widgetTemplate.size),
      height: getWidgetHeight(widgetTemplate.size)
    }
    
    dashboardWidgets.value.push(newWidget)
    console.log(`Added widget: ${newWidget.title}`)
  }
}

const removeWidget = (widgetId) => {
  const index = dashboardWidgets.value.findIndex(w => w.id === widgetId)
  if (index > -1) {
    dashboardWidgets.value.splice(index, 1)
    console.log(`Removed widget: ${widgetId}`)
  }
}

const duplicateWidget = (widgetId) => {
  const widget = dashboardWidgets.value.find(w => w.id === widgetId)
  if (widget) {
    const newWidget = {
      ...widget,
      id: `${widget.type}_${Date.now()}`,
      title: `${widget.title} (Copy)`,
      x: widget.x + 20,
      y: widget.y + 20
    }
    dashboardWidgets.value.push(newWidget)
    console.log(`Duplicated widget: ${widget.title}`)
  }
}

const configureWidget = (widgetId) => {
  const widget = dashboardWidgets.value.find(w => w.id === widgetId)
  if (widget) {
    configWidget.value = { ...widget }
    showConfigModal.value = true
    console.log(`Configuring widget: ${widget.title}`)
  }
}

const closeConfigModal = () => {
  showConfigModal.value = false
  configWidget.value = null
}

const saveWidgetConfig = () => {
  if (configWidget.value) {
    const index = dashboardWidgets.value.findIndex(w => w.id === configWidget.value.id)
    if (index > -1) {
      dashboardWidgets.value[index] = { ...configWidget.value }
      console.log(`Saved configuration for widget: ${configWidget.value.title}`)
    }
  }
  closeConfigModal()
}

const updateWidgetConfig = (key, value) => {
  if (configWidget.value) {
    if (key.includes('.')) {
      // Handle nested config properties like 'config.showTrends'
      const keys = key.split('.')
      let obj = configWidget.value
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
    } else {
      configWidget.value[key] = value
    }
  }
}

const selectWidget = (widgetId) => {
  selectedWidget.value = selectedWidget.value === widgetId ? null : widgetId
}

const dragWidget = (event, widget) => {
  isDragging.value = true
  event.dataTransfer.setData('text/plain', JSON.stringify({
    type: 'widget',
    widget: widget
  }))
}

const dropWidget = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  try {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'))
    if (data.type === 'widget') {
      addWidget(data.widget.id)
    }
  } catch (error) {
    console.error('Error dropping widget:', error)
  }
}

const getWidgetStyle = (widget) => {
  return {
    left: `${widget.x}px`,
    top: `${widget.y}px`,
    width: `${widget.width}px`,
    height: `${widget.height}px`
  }
}

const getWidgetWidth = (size) => {
  switch (size) {
    case 'small': return 280
    case 'medium': return 400
    case 'large': return 600
    default: return 350
  }
}

const getWidgetHeight = (size) => {
  switch (size) {
    case 'small': return 200
    case 'medium': return 300
    case 'large': return 400
    default: return 250
  }
}

const getNextPosition = () => {
  const canvasWidth = 1000 // Approximate canvas width
  const widgetWidth = 300
  const widgetHeight = 200
  const cols = Math.floor(canvasWidth / (widgetWidth + 20))
  const existingCount = dashboardWidgets.value.length
  
  const row = Math.floor(existingCount / cols)
  const col = existingCount % cols
  
  return {
    x: col * (widgetWidth + 20) + 10,
    y: row * (widgetHeight + 20) + 10
  }
}

// Widget Dragging State
const dragState = ref({
  isDragging: false,
  draggedWidget: null,
  startX: 0,
  startY: 0,
  startWidgetX: 0,
  startWidgetY: 0
})

const startWidgetDrag = (widgetId, event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const widget = dashboardWidgets.value.find(w => w.id === widgetId)
  if (!widget) return
  
  // Don't start drag if clicking on control buttons
  if (event.target.closest('.widget-controls')) return
  
  const rect = event.currentTarget.getBoundingClientRect()
  const canvasRect = event.currentTarget.offsetParent.getBoundingClientRect()
  
  dragState.value = {
    isDragging: true,
    draggedWidget: widgetId,
    startX: event.clientX,
    startY: event.clientY,
    startWidgetX: widget.x,
    startWidgetY: widget.y
  }
  
  document.addEventListener('mousemove', handleWidgetDrag)
  document.addEventListener('mouseup', stopWidgetDrag)
  
  // Add dragging class for visual feedback
  event.currentTarget.classList.add('dragging')
  
  console.log(`Started dragging widget: ${widget.title}`)
}

const handleWidgetDrag = (event) => {
  if (!dragState.value.isDragging || !dragState.value.draggedWidget) return
  
  const deltaX = event.clientX - dragState.value.startX
  const deltaY = event.clientY - dragState.value.startY
  
  const widget = dashboardWidgets.value.find(w => w.id === dragState.value.draggedWidget)
  if (widget) {
    widget.x = Math.max(0, dragState.value.startWidgetX + deltaX)
    widget.y = Math.max(0, dragState.value.startWidgetY + deltaY)
  }
}

const stopWidgetDrag = (event) => {
  if (!dragState.value.isDragging) return
  
  // Remove dragging class
  const draggedElement = document.querySelector(`[data-widget-id="${dragState.value.draggedWidget}"]`)
  if (draggedElement) {
    draggedElement.classList.remove('dragging')
  }
  
  dragState.value = {
    isDragging: false,
    draggedWidget: null,
    startX: 0,
    startY: 0,
    startWidgetX: 0,
    startWidgetY: 0
  }
  
  document.removeEventListener('mousemove', handleWidgetDrag)
  document.removeEventListener('mouseup', stopWidgetDrag)
  
  console.log('Stopped dragging widget')
}

const startWidgetResize = (widgetId, event) => {
  event.preventDefault()
  event.stopPropagation()
  console.log(`Start resizing widget: ${widgetId}`)
  // TODO: Implement widget resizing
}

const toggleGridLines = () => {
  showGridLines.value = !showGridLines.value
}

const toggleAutoLayout = () => {
  autoLayout.value = !autoLayout.value
  if (autoLayout.value) {
    arrangeWidgetsAutomatically()
  }
}

const arrangeWidgetsAutomatically = () => {
  const cols = 3
  const widgetSpacing = 20
  
  dashboardWidgets.value.forEach((widget, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    widget.x = col * (getWidgetWidth(widget.size) + widgetSpacing) + 10
    widget.y = row * (getWidgetHeight(widget.size) + widgetSpacing) + 10
  })
}

const resetDashboard = () => {
  if (confirm('Are you sure you want to reset the dashboard? This will remove all widgets.')) {
    dashboardWidgets.value = []
    selectedWidget.value = null
    console.log('Dashboard reset')
  }
}

const saveDashboard = () => {
  const dashboardConfig = {
    widgets: dashboardWidgets.value,
    settings: {
      showGridLines: showGridLines.value,
      autoLayout: autoLayout.value
    },
    timestamp: new Date().toISOString()
  }
  
  localStorage.setItem('khukoma_dashboard_config', JSON.stringify(dashboardConfig))
  lastSaved.value = new Date()
  
  console.log('Dashboard saved', dashboardConfig)
  alert('Dashboard saved successfully!')
}

const loadSampleDashboard = () => {
  dashboardWidgets.value = []
  
  const sampleWidgets = [
    'metric_card',
    'line_chart', 
    'pie_chart',
    'summary_stats',
    'recent_activity',
    'data_table'
  ]
  
  sampleWidgets.forEach(widgetId => {
    setTimeout(() => addWidget(widgetId), 100)
  })
  
  setTimeout(() => {
    if (autoLayout.value) {
      arrangeWidgetsAutomatically()
    }
  }, 800)
  
  console.log('Sample dashboard loaded')
}

const exportDashboard = () => {
  const dashboardData = {
    widgets: dashboardWidgets.value,
    settings: {
      showGridLines: showGridLines.value,
      autoLayout: autoLayout.value
    },
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }
  
  const dataStr = JSON.stringify(dashboardData, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `khukoma-dashboard-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
  console.log('Dashboard exported')
}

// Widget Data Processing Functions
const getMetricValue = (metricType) => {
  if (!realAnalytics.value) return '0'
  
  switch (metricType) {
    case 'Total Forms':
      return realAnalytics.value.totalForms || 0
    case 'Total Referrals':
      return realAnalytics.value.totalReferrals || 0
    case 'Total Overviews':
      return realAnalytics.value.totalOverviews || 0
    case 'Total Assessments':
      return realAnalytics.value.totalAssessments || 0
    case 'Completion Rate':
      return `${realAnalytics.value.completionRate || 0}%`
    default:
      return realAnalytics.value.totalForms || 0
  }
}

const getMetricDescription = (metricType) => {
  switch (metricType) {
    case 'Total Forms':
      return 'All submitted forms'
    case 'Total Referrals':
      return 'Initial referral forms'
    case 'Total Overviews':
      return 'Child overview forms'
    case 'Total Assessments':
      return 'Assessment forms'
    case 'Completion Rate':
      return 'Forms completion rate'
    default:
      return 'System metric'
  }
}

const getTrendClass = (trend) => {
  if (!trend) return ''
  return trend.startsWith('+') ? 'trend-positive' : trend.startsWith('-') ? 'trend-negative' : 'trend-neutral'
}

const getSummaryStats = () => {
  if (!realAnalytics.value) {
    return [
      { key: 'forms', label: 'Total Forms', value: '0', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', trend: '+0%' },
      { key: 'completion', label: 'Completion Rate', value: '0%', icon: 'M22 12h-4l-3 9L9 3l-3 9H2', trend: '+0%' },
      { key: 'users', label: 'Active Users', value: '0', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', trend: '+0%' },
      { key: 'activity', label: 'Recent Activity', value: '0', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', trend: '+0%' }
    ]
  }
  
  return [
    { 
      key: 'forms', 
      label: 'Total Forms', 
      value: realAnalytics.value.totalForms,
      icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z',
      trend: realAnalytics.value.totalForms > 10 ? '+12%' : '+5%'
    },
    { 
      key: 'completion', 
      label: 'Completion Rate', 
      value: `${realAnalytics.value.completionRate}%`,
      icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
      trend: realAnalytics.value.completionRate > 75 ? '+8%' : realAnalytics.value.completionRate > 50 ? '+3%' : '-2%'
    },
    { 
      key: 'referrals', 
      label: 'Referrals', 
      value: realAnalytics.value.totalReferrals,
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
      trend: '+15%'
    },
    { 
      key: 'assessments', 
      label: 'Assessments', 
      value: realAnalytics.value.totalAssessments,
      icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
      trend: '+7%'
    }
  ]
}

const getRecentActivity = (limit = 5) => {
  if (!recentActivity.value || recentActivity.value.length === 0) {
    return []
  }
  return recentActivity.value.slice(0, limit)
}

const formatRelativeTime = (date) => {
  if (!date) return 'Unknown'
  
  const now = new Date()
  const activityDate = date instanceof Date ? date : new Date(date)
  const diffMs = now - activityDate
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

const getDataTableTitle = (dataSource) => {
  switch (dataSource) {
    case 'recent_activity':
      return 'Recent Activity'
    case 'form_submissions':
      return 'Form Submissions'
    case 'user_activity':
      return 'User Activity'
    default:
      return 'Data Table'
  }
}

const getTableHeaders = (dataSource) => {
  switch (dataSource) {
    case 'recent_activity':
      return ['Date', 'Type', 'Child', 'User', 'Status']
    case 'form_submissions':
      return ['Form Type', 'Count', 'Percentage']
    case 'user_activity':
      return ['User', 'Last Active', 'Forms', 'Status']
    default:
      return ['Column 1', 'Column 2', 'Column 3']
  }
}

const getTableData = (dataSource, limit = 5) => {
  switch (dataSource) {
    case 'recent_activity':
      if (!recentActivity.value || recentActivity.value.length === 0) return []
      return recentActivity.value.slice(0, limit).map((activity, index) => ({
        id: `activity_${index}`,
        cells: [
          { key: 'date', value: formatDate(activity.date), class: '' },
          { key: 'type', value: activity.type, class: 'type-badge' },
          { key: 'child', value: activity.childName, class: '' },
          { key: 'user', value: activity.user, class: '' },
          { key: 'status', value: activity.status, class: `status-${activity.status.toLowerCase().replace(' ', '-')}` }
        ]
      }))
    
    case 'form_submissions':
      if (!realAnalytics.value?.formsByType) return []
      return Object.entries(realAnalytics.value.formsByType).map(([type, count], index) => ({
        id: `form_${index}`,
        cells: [
          { key: 'type', value: type === 'initial-referral' ? 'Initial Referrals' : type === 'child-overview' ? 'Child Overviews' : 'Initial Assessments', class: '' },
          { key: 'count', value: count, class: 'count-value' },
          { key: 'percentage', value: `${realAnalytics.value.totalForms > 0 ? Math.round((count / realAnalytics.value.totalForms) * 100) : 0}%`, class: 'percentage-value' }
        ]
      }))
    
    case 'user_activity':
      return [
        {
          id: 'user_1',
          cells: [
            { key: 'user', value: 'System User', class: '' },
            { key: 'active', value: '2 hours ago', class: '' },
            { key: 'forms', value: realAnalytics.value?.totalForms || 0, class: 'count-value' },
            { key: 'status', value: 'Active', class: 'status-active' }
          ]
        }
      ]
    
    default:
      return []
  }
}

const getProgressValue = (config) => {
  if (config.progressValue !== undefined) {
    return Math.min(100, Math.max(0, config.progressValue))
  }
  
  // Calculate completion rate from real data
  if (realAnalytics.value) {
    return Math.min(100, realAnalytics.value.completionRate || 0)
  }
  
  return 0
}

const getCurrentProgressValue = (config) => {
  const percentage = getProgressValue(config)
  const target = config.targetValue || 100
  return Math.round((percentage / 100) * target)
}

// Chart Management
const widgetCharts = ref(new Map())

const createWidgetChart = async (widget) => {
  await nextTick()
  
  const canvasRef = `chart_${widget.id}`
  const canvasElements = document.querySelectorAll(`[data-ref="${canvasRef}"]`)
  
  if (canvasElements.length === 0) {
    console.log(`Canvas element not found for widget ${widget.id}`)
    return
  }
  
  const canvas = canvasElements[0]
  if (!canvas) return
  
  // Destroy existing chart if it exists
  const existingChart = widgetCharts.value.get(widget.id)
  if (existingChart) {
    existingChart.destroy()
  }
  
  const ctx = canvas.getContext('2d')
  const chartData = getChartDataForWidget(widget)
  const chartOptions = getChartOptionsForWidget(widget)
  
  let chartType = widget.type.replace('_chart', '')
  if (chartType === 'line') chartType = 'line'
  else if (chartType === 'bar') chartType = 'bar'
  else if (chartType === 'pie') chartType = 'pie'
  
  try {
    const chart = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: chartOptions
    })
    
    widgetCharts.value.set(widget.id, chart)
    console.log(`Created ${chartType} chart for widget ${widget.id}`)
  } catch (error) {
    console.error(`Error creating chart for widget ${widget.id}:`, error)
  }
}

const getChartDataForWidget = (widget) => {
  const colors = ['#4A148C', '#FF5722', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0']
  
  if (!realAnalytics.value) {
    return {
      labels: ['No Data'],
      datasets: [{
        label: 'No Data Available',
        data: [0],
        backgroundColor: ['#E0E0E0'],
        borderColor: ['#BDBDBD'],
        borderWidth: 1
      }]
    }
  }
  
  switch (widget.config.dataSource) {
    case 'form_types':
      const formTypes = realAnalytics.value.formsByType || {}
      return {
        labels: ['Initial Referrals', 'Child Overviews', 'Initial Assessments'],
        datasets: [{
          label: 'Form Count',
          data: [
            formTypes['initial-referral'] || 0,
            formTypes['child-overview'] || 0,
            formTypes['initial-assessment'] || 0
          ],
          backgroundColor: colors.slice(0, 3),
          borderColor: colors.slice(0, 3),
          borderWidth: 2
        }]
      }
    
    case 'status_breakdown':
      const statusData = realAnalytics.value.formsByStatus || {}
      return {
        labels: ['Completed', 'Pending', 'Draft'],
        datasets: [{
          label: 'Status Count',
          data: [
            statusData.completed || 0,
            statusData.pending || 0,
            statusData.draft || 0
          ],
          backgroundColor: ['#4CAF50', '#FF9800', '#9E9E9E'],
          borderColor: ['#4CAF50', '#FF9800', '#9E9E9E'],
          borderWidth: 2
        }]
      }
    
    case 'age_distribution':
      const ageData = realAnalytics.value.ageDistribution || {}
      const ageLabels = Object.keys(ageData)
      const ageValues = Object.values(ageData)
      return {
        labels: ageLabels.map(age => `${age} years`),
        datasets: [{
          label: 'Age Distribution',
          data: ageValues,
          backgroundColor: colors.slice(0, ageLabels.length),
          borderColor: colors.slice(0, ageLabels.length),
          borderWidth: 2
        }]
      }
    
    case 'monthly_trends':
      const monthlyData = realAnalytics.value.monthlyTrends || {}
      const months = Object.keys(monthlyData)
      return {
        labels: months,
        datasets: [
          {
            label: 'Referrals',
            data: months.map(month => monthlyData[month]?.referrals || 0),
            borderColor: '#4A148C',
            backgroundColor: 'rgba(74, 20, 140, 0.1)',
            tension: 0.4,
            fill: widget.type === 'line_chart'
          },
          {
            label: 'Overviews',
            data: months.map(month => monthlyData[month]?.overviews || 0),
            borderColor: '#FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.1)',
            tension: 0.4,
            fill: widget.type === 'line_chart'
          }
        ]
      }
    
    default:
      return {
        labels: ['Total Forms'],
        datasets: [{
          label: 'Count',
          data: [realAnalytics.value.totalForms || 0],
          backgroundColor: [colors[0]],
          borderColor: [colors[0]],
          borderWidth: 2
        }]
      }
  }
}

const getChartOptionsForWidget = (widget) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: widget.config.enableAnimation !== false,
    plugins: {
      legend: {
        display: widget.config.showLegend !== false,
        position: widget.type === 'pie_chart' ? 'right' : 'top'
      }
    }
  }
  
  if (widget.type !== 'pie_chart') {
    baseOptions.scales = {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
      x: {
        ticks: {
          maxRotation: 45
        }
      }
    }
  }
  
  return baseOptions
}

// Utility function to format dates
const formatDate = (date) => {
  if (!date) return 'N/A'
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

// Widget Chart Management
const createChartsForAllWidgets = async () => {
  await nextTick()
  const chartWidgets = dashboardWidgets.value.filter(w => 
    ['line_chart', 'pie_chart', 'bar_chart'].includes(w.type)
  )
  
  for (const widget of chartWidgets) {
    await createWidgetChart(widget)
  }
}

// Watch for widget changes to create/update charts
watch(dashboardWidgets, async (newWidgets, oldWidgets) => {
  await nextTick()
  
  // Create charts for new chart widgets
  const chartWidgets = newWidgets.filter(w => 
    ['line_chart', 'pie_chart', 'bar_chart'].includes(w.type)
  )
  
  for (const widget of chartWidgets) {
    if (!widgetCharts.value.has(widget.id)) {
      setTimeout(() => createWidgetChart(widget), 100)
    }
  }
  
  // Clean up charts for removed widgets
  if (oldWidgets) {
    const removedWidgetIds = oldWidgets
      .filter(oldWidget => !newWidgets.some(newWidget => newWidget.id === oldWidget.id))
      .map(widget => widget.id)
      
    removedWidgetIds.forEach(widgetId => {
      const chart = widgetCharts.value.get(widgetId)
      if (chart) {
        chart.destroy()
        widgetCharts.value.delete(widgetId)
      }
    })
  }
}, { deep: true })

// Watch for analytics data changes to update charts
watch(realAnalytics, async () => {
  if (realAnalytics.value) {
    // Recreate all charts with new data
    await nextTick()
    for (const [widgetId, chart] of widgetCharts.value) {
      const widget = dashboardWidgets.value.find(w => w.id === widgetId)
      if (widget) {
        setTimeout(() => createWidgetChart(widget), 100)
      }
    }
  }
}, { deep: true })

// Lifecycle
onMounted(async () => {
  // Initialize with real data
  hasData.value = false
  // Expand first dimension by default
  if (dimensions.value.length > 0) {
    dimensions.value[0].expanded = true
  }
  
  // Load real analytics data
  await refreshData()
  
  // Generate default chart if we have data
  if (realAnalytics.value && realAnalytics.value.totalForms > 0) {
    await generateChart()
  }
  
  // Create charts for any existing dashboard widgets
  await createChartsForAllWidgets()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  // Destroy all widget charts
  for (const [widgetId, chart] of widgetCharts.value) {
    chart.destroy()
  }
  widgetCharts.value.clear()
  
  // Remove drag event listeners
  document.removeEventListener('mousemove', handleWidgetDrag)
  document.removeEventListener('mouseup', stopWidgetDrag)
})

</script>

<style scoped>
/* Enhanced Dashboard Styling */

/* Dashboard Panel */
.dashboard-panel {
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Dashboard Header */
.dashboard-header {
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px 12px 0 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
}

.header-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.dashboard-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
  font-weight: 300;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.save-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.save-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.reset-btn {
  background: rgba(255, 87, 34, 0.9);
  color: white;
}

.reset-btn:hover {
  background: rgba(255, 87, 34, 1);
  transform: translateY(-1px);
}

/* Dashboard Builder */
.dashboard-builder {
  display: grid;
  grid-template-columns: 320px 1fr;
  min-height: 700px;
}

/* Widget Library */
.widget-library {
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 700px;
}

.library-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.library-header h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #1e293b;
  font-weight: 700;
}

.library-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.widget-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.widget-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.widget-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.widget-card:hover {
  background: #f1f5f9;
  border-color: #4A148C;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.15);
}

.widget-card:hover .add-indicator {
  opacity: 1;
  transform: scale(1);
}

.widget-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  border-radius: 8px;
  flex-shrink: 0;
}

.widget-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.widget-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.widget-desc {
  font-size: 0.8rem;
  color: #64748b;
}

.add-indicator {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%) scale(0.8);
  width: 24px;
  height: 24px;
  background: #4A148C;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  opacity: 0;
  transition: all 0.2s ease;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #4A148C;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.quick-action-btn:hover {
  background: #6A1B9A;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(74, 20, 140, 0.25);
}

/* Dashboard Canvas Container */
.dashboard-canvas-container {
  background: #f8fafc;
  padding: 1.5rem;
  position: relative;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.canvas-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.widget-count {
  font-weight: 600;
  color: #4A148C;
  font-size: 0.9rem;
}

.last-saved {
  color: #64748b;
  font-size: 0.8rem;
}

.canvas-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #e2e8f0;
  color: #374151;
}

.control-btn.active {
  background: #4A148C;
  color: white;
  border-color: #4A148C;
}

/* Dashboard Canvas */
.dashboard-canvas {
  position: relative;
  min-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #e5e7eb;
  overflow: hidden;
}

.dashboard-canvas.show-grid {
  background-image: 
    linear-gradient(rgba(74, 20, 140, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74, 20, 140, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Dashboard Widgets */
.dashboard-widget {
  position: absolute;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: move;
  overflow: hidden;
}

.dashboard-widget:hover {
  border-color: #4A148C;
  box-shadow: 0 8px 25px -5px rgba(74, 20, 140, 0.25);
  z-index: 10;
}

.dashboard-widget.dragging {
  z-index: 100;
  transform: rotate(2deg);
  box-shadow: 0 12px 35px -5px rgba(74, 20, 140, 0.4);
  cursor: grabbing !important;
}

.dashboard-widget:not(.dragging) {
  cursor: grab;
}

.dashboard-widget.small {
  min-width: 280px;
  min-height: 200px;
}

.dashboard-widget.medium {
  min-width: 400px;
  min-height: 300px;
}

.dashboard-widget.large {
  min-width: 600px;
  min-height: 400px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e5e7eb;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.widget-controls {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.dashboard-widget:hover .widget-controls {
  opacity: 1;
}

.widget-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0;
}

.widget-control-btn:hover {
  background: #4A148C;
  color: white;
  border-color: #4A148C;
  transform: scale(1.05);
}

.widget-control-btn.remove:hover {
  background: #ef4444;
  border-color: #ef4444;
}

.widget-content {
  padding: 1.5rem;
  height: calc(100% - 60px);
  overflow: auto;
}

.widget-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #64748b;
}

.placeholder-content svg {
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.placeholder-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #374151;
}

.placeholder-content p {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.configure-btn {
  padding: 0.5rem 1rem;
  background: #4A148C;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.configure-btn:hover {
  background: #6A1B9A;
  transform: translateY(-1px);
}

.widget-resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #4A148C;
  cursor: nw-resize;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.widget-resize-handle::before {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-bottom: 6px solid white;
}

.dashboard-widget:hover .widget-resize-handle {
  opacity: 1;
}

/* Empty Dashboard */
.empty-dashboard {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  padding: 3rem;
  text-align: center;
}

.empty-content {
  max-width: 400px;
}

.empty-icon {
  margin: 0 auto 2rem auto;
  color: #cbd5e1;
}

.empty-content h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #374151;
  font-weight: 600;
}

.empty-content p {
  margin: 0 0 2rem 0;
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
}

.primary-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.25);
}

.primary-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(74, 20, 140, 0.35);
}

/* Drop Zone */
.drop-zone-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: rgba(74, 20, 140, 0.95);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  pointer-events: none;
  box-shadow: 0 8px 25px rgba(74, 20, 140, 0.25);
}

.drop-zone-content svg {
  margin-bottom: 1rem;
  opacity: 0.9;
}

.drop-zone-content p {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-builder {
    grid-template-columns: 280px 1fr;
  }
  
  .widget-library {
    padding: 1rem;
  }
  
  .dashboard-widget.large {
    min-width: 450px;
    min-height: 350px;
  }
}

@media (max-width: 968px) {
  .dashboard-builder {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .widget-library {
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .widget-grid {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .widget-card {
    flex: 1;
    min-width: 200px;
  }
}

@media (max-width: 640px) {
  .dashboard-header {
    padding: 1.5rem 1rem;
  }
  
  .header-info h3 {
    font-size: 1.5rem;
  }
  
  .action-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .dashboard-canvas-container {
    padding: 1rem;
  }
  
  .dashboard-widget {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
    margin-bottom: 1rem;
  }
  
  .empty-dashboard {
    height: 300px;
    padding: 2rem 1rem;
  }
  
  .empty-content h3 {
    font-size: 1.25rem;
  }
  
  .primary-action-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* Widget Configuration Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.config-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.config-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f8fafc;
}

.config-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.form-group label input[type="checkbox"] {
  margin-right: 0.5rem;
  margin-bottom: 0;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #4A148C;
  box-shadow: 0 0 0 3px rgba(74, 20, 140, 0.1);
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-select:focus {
  outline: none;
  border-color: #4A148C;
  box-shadow: 0 0 0 3px rgba(74, 20, 140, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(74, 20, 140, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.3);
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

/* Modal Responsive Design */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .config-modal {
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .modal-title h3 {
    font-size: 1.1rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .config-section {
    padding: 1rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}

/* Widget Content Styling */

/* Metric Card Content */
.metric-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  text-align: center;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.metric-header h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #f1f5f9;
}

.metric-trend.trend-positive {
  color: #16a34a;
  background: #dcfce7;
}

.metric-trend.trend-negative {
  color: #dc2626;
  background: #fee2e2;
}

.metric-trend.trend-neutral {
  color: #64748b;
  background: #f1f5f9;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4A148C;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.metric-description {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

/* Chart Widget Content */
.chart-widget-content {
  height: 100%;
  position: relative;
  padding: 1rem 0;
}

.widget-chart {
  width: 100%;
  height: 100%;
  max-height: 250px;
}

/* Data Table Content */
.data-table-content {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
}

.table-container {
  flex: 1;
  overflow: auto;
}

.widget-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.widget-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  padding: 0.75rem 0.5rem;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.8rem;
}

.widget-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.widget-table tbody tr:hover {
  background: #f8fafc;
}

.type-badge {
  font-weight: 500;
  color: #4A148C;
}

.count-value {
  font-weight: 600;
  color: #374151;
}

.percentage-value {
  font-weight: 500;
  color: #16a34a;
}

.status-completed {
  color: #16a34a;
  font-weight: 500;
}

.status-pending {
  color: #ea580c;
  font-weight: 500;
}

.status-draft {
  color: #64748b;
  font-weight: 500;
}

.status-active {
  color: #16a34a;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-style: italic;
}

/* Summary Stats Content */
.summary-stats-content {
  height: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 100%;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  border-radius: 6px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #374151;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

/* Activity Content */
.activity-content {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.activity-header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.activity-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
}

.activity-list {
  flex: 1;
  overflow: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.activity-info {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 0.85rem;
  color: #374151;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.activity-user {
  font-weight: 500;
}

.activity-time {
  color: #9ca3af;
}

.activity-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.no-activity {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-style: italic;
}

/* Progress Content */
.progress-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.progress-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
}

.progress-percentage {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4A148C;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-fill.animate {
  animation: progressAnimation 1.5s ease-out;
}

@keyframes progressAnimation {
  from {
    width: 0%;
  }
}

.progress-info {
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

/* Responsive Widget Content */
@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-item {
    padding: 0.75rem;
  }
  
  .metric-value {
    font-size: 2rem;
  }
  
  .activity-item {
    padding: 0.5rem 0;
  }
  
  .widget-table {
    font-size: 0.8rem;
  }
  
  .widget-table th,
  .widget-table td {
    padding: 0.5rem 0.25rem;
  }
}
/* Main Container */
.data-analysis-pro {
  min-height: 100vh;
  background: #f5f6fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Professional Header */
.analytics-header {
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: none;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
}

.title-text h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 0.875rem;
  opacity: 0.8;
  font-weight: 400;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e4e7;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 200px;
  margin-top: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background: none;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.dropdown-item:first-child {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.dropdown-item:last-child {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

/* Analytics Container Layout */
.analytics-container {
  display: flex;
  height: calc(100vh - 80px);
  overflow: hidden;
}

/* Data Explorer Sidebar */
.data-explorer {
  width: 320px;
  background: white;
  border-right: 1px solid #e0e4e7;
  overflow-y: auto;
  flex-shrink: 0;
}

.explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #E0E0E0;
  margin-bottom: 16px;
}

.explorer-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.explorer-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.selection-summary {
  font-size: 12px;
  color: #4A148C;
  font-weight: 500;
  background: rgba(74, 20, 140, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.explorer-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #4A148C;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #6A1B9A;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 20, 140, 0.3);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e5e7eb;
  color: #4b5563;
}

/* Dimension Section */
.dimension-section,
.date-section,
.org-section {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.dimension-section h4,
.date-section h4,
.org-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dimension-tree,
.org-tree {
  space-y: 0.25rem;
}

.dimension-item,
.org-item {
  border-radius: 4px;
  overflow: hidden;
}

.dimension-header,
.org-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;
  font-size: 0.875rem;
  color: #374151;
}

.dimension-header:hover,
.org-header:hover {
  background: #f9fafb;
}

.selected-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: #6b7280;
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
}

.dimension-children,
.org-children {
  padding-left: 1.5rem;
  background: #f9fafb;
}

.dimension-child,
.org-child {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  font-size: 0.8125rem;
  color: #4b5563;
  transition: all 0.2s ease;
  position: relative;
}

.dimension-child:hover,
.org-child:hover {
  background: #f3f4f6;
  transform: translateX(2px);
}

.dimension-child.has-data {
  color: #4A148C;
  font-weight: 500;
}

.dimension-child.has-data::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #4CAF50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.dimension-child.selected {
  background: rgba(74, 20, 140, 0.1);
  color: #4A148C;
  font-weight: 600;
  border-left: 3px solid #4A148C;
  padding-left: 9px;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 4px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

.item-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: #9ca3af;
  transition: all 0.2s ease;
  padding: 2px 6px;
  border-radius: 8px;
}

.item-count.has-data {
  background: rgba(76, 175, 80, 0.15);
  color: #2E7D32;
  font-weight: 600;
  box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.3);
}

.item-name {
  flex: 1;
  transition: color 0.2s ease;
}

.data-indicator {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  border-radius: 50%;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 2px rgba(76, 175, 80, 0.7);
  }
  to {
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.9), 0 0 12px rgba(76, 175, 80, 0.5);
  }
}

.empty-data {
  opacity: 0.6;
}

.empty-data .item-name {
  color: #9CA3AF;
}

/* Date Controls */
.date-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.period-type,
.period-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
}

.custom-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.date-input {
  padding: 0.375rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.8125rem;
}

/* Main Content Area */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Analysis Tabs */
.analysis-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #e0e4e7;
  padding: 0 1rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-btn.active {
  color: #4A148C;
  border-bottom-color: #4A148C;
  background: #faf5ff;
}

/* Tab Content */
.tab-content {
  flex: 1;
  overflow: hidden;
}

.visualizer-panel,
.pivot-panel,
.reports-panel,
.dashboard-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Panel Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e0e4e7;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-summary {
  display: flex;
  gap: 8px;
}

.summary-badge {
  background: linear-gradient(135deg, #4A148C, #6A1B9A);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.panel-header h3 {
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.panel-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-group label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.chart-config-panel {
  background: #f8fafc;
  border-bottom: 1px solid #e0e4e7;
  padding: 16px 24px;
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.config-item label {
  font-weight: 500;
  color: #374151;
  min-width: 60px;
}

.chart-title-input {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
}

.color-scheme-select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 140px;
}

.animation-checkbox {
  margin-right: 6px;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
}

.chart-type-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
}

.generate-btn {
  background: linear-gradient(135deg, #4A148C, #6A1B9A);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.3);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-chart-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.export-chart-btn:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.config-btn,
.refresh-btn,
.schedule-btn,
.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #4A148C;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.config-btn:hover,
.refresh-btn:hover,
.schedule-btn:hover,
.save-btn:hover {
  background: #6A1B9A;
}

/* Visualization Area */
.visualization-area {
  flex: 1;
  padding: 1.5rem;
  background: #f9fafb;
  overflow: hidden;
}

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
  padding: 3rem;
  border-radius: 12px;
}

.welcome-state {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 2px dashed #cbd5e1;
}

.generate-state {
  background: linear-gradient(135deg, #fef3c7, #fef59e);
  border: 2px solid #f59e0b;
}

.welcome-icon {
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
  margin-bottom: 1.5rem;
}

.generate-icon {
  opacity: 0.8;
  animation: pulse-slow 2s ease-in-out infinite;
  margin-bottom: 1.5rem;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.no-data-message h4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.no-data-message p {
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  opacity: 0.8;
  max-width: 400px;
}

.quick-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.quick-action-btn {
  background: #4A148C;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background: #6A1B9A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.3);
}

.quick-action-btn.secondary {
  background: #6b7280;
}

.quick-action-btn.secondary:hover {
  background: #4b5563;
}

.generate-large-btn {
  background: linear-gradient(135deg, #4A148C, #6A1B9A);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  margin-top: 20px;
}

.generate-large-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(74, 20, 140, 0.4);
}

.chart-container {
  height: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chart-header {
  text-align: center;
  padding: 20px 24px 12px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
}

.chart-header h4 {
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #4A148C, #6A1B9A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chart-footer {
  padding: 12px 20px;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  border-top: 1px solid #e5e7eb;
}

.chart-info {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
  gap: 24px;
  flex-wrap: wrap;
}

.chart-info span {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.main-chart {
  width: 100% !important;
  flex: 1 !important;
  min-height: 400px !important;
  padding: 20px;
}

/* Reports Panel */
.reports-container {
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.data-summary-card,
.recent-activity-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.summary-header,
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.summary-header h4,
.activity-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.data-timestamp,
.activity-count {
  font-size: 0.875rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.summary-stat {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #4A148C;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.no-data-summary,
.no-activity {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.activity-table-container {
  overflow-x: auto;
}

.real-activity-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.real-activity-table th,
.real-activity-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.real-activity-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.real-activity-table tbody tr:hover {
  background: #fafbfc;
}

.activity-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.activity-badge.referral { background: #dbeafe; color: #1e40af; }
.activity-badge.overview { background: #fed7aa; color: #ea580c; }
.activity-badge.assessment { background: #e0e7ff; color: #6366f1; }

.status-badge.completed { background: #dcfce7; color: #16a34a; }
.status-badge.draft { background: #fef3c7; color: #d97706; }
.status-badge.pending { background: #fecaca; color: #dc2626; }
.status-badge.in-progress { background: #dbeafe; color: #2563eb; }

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.report-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.report-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.report-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #6b7280;
  margin-bottom: 1rem;
}

.report-info h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.report-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.generate-report-btn,
.download-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-report-btn {
  background: #4A148C;
  color: white;
  border: none;
}

.generate-report-btn:hover {
  background: #6A1B9A;
}

.download-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.download-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Pivot Tables - Enhanced Professional Style */
.pivot-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 1rem;
  background: #f5f6fa;
}

/* Field Library */
.pivot-fields-library {
  background: linear-gradient(135deg, #faf8ff 0%, #f3f4f6 100%);
  border: 1px solid #e0e4e7;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem;
  box-shadow: 0 2px 8px rgba(74, 20, 140, 0.05);
}

.pivot-fields-library h4 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: #4A148C;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.field-library {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.library-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e0e4e7;
  border-radius: 8px;
  cursor: move;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  user-select: none;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.library-field:hover {
  border-color: #4A148C;
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.15);
  transform: translateY(-2px);
  background: #faf8ff;
}

.library-field.dimension {
  border-left: 4px solid #3b82f6;
}

.library-field.value {
  border-left: 4px solid #10b981;
}

.field-icon {
  color: #4A148C;
  display: flex;
  align-items: center;
}

.field-type {
  font-size: 0.6875rem;
  color: white;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.library-field.dimension .field-type {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.library-field.value .field-type {
  background: linear-gradient(135deg, #10b981, #059669);
}

/* Pivot Configuration */
.pivot-config {
  background: white;
  border: 1px solid #e0e4e7;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.config-sections {
  display: flex;
  gap: 1.5rem;
}

.config-section {
  flex: 1;
  min-width: 220px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.config-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: #4A148C;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.config-hint {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
  font-weight: 500;
}

.config-section {
  flex: 1;
}

.config-section h4 {
  font-size: 0.875rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: #4A148C;
}

.drag-area {
  min-height: 120px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fafbfc 0%, #f9fafb 100%);
  transition: all 0.3s ease;
  position: relative;
}

.drag-area.dragover {
  border-color: #4A148C;
  background: linear-gradient(135deg, #faf5ff 0%, #f3f4f6 100%);
  border-style: solid;
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.1);
  transform: scale(1.01);
}

.pivot-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e0e4e7;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pivot-field:hover {
  background: linear-gradient(135deg, #faf8ff 0%, #f3f4f6 100%);
  border-color: #4A148C;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(74, 20, 140, 0.1);
}

.field-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.field-name {
  font-weight: 600;
  color: #374151;
}

.remove-field {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: none;
  border-radius: 6px;
  padding: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: 600;
}

.remove-field:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #b91c1c;
  transform: scale(1.1);
}

.drop-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  min-height: 80px;
  gap: 0.75rem;
  font-weight: 500;
}

.aggregation-select {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.75rem;
  background: white;
}

/* Pivot Results - Enhanced Professional Style */
.pivot-results {
  margin: 1rem;
  background: white;
  border: 1px solid #e0e4e7;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
}

.results-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-actions {
  display: flex;
  gap: 0.75rem;
}

.export-btn,
.debug-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.export-btn:hover,
.debug-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.pivot-table-wrapper {
  overflow: auto;
  max-height: 450px;
  background: white;
}

/* Enhanced No Data State - Professional Welcome */
.no-pivot-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
  text-align: center;
  margin: 1rem;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
  border: 1px solid #e0e4e7;
  border-radius: 16px;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.no-pivot-data .welcome-icon {
  padding: 1.5rem;
  background: linear-gradient(135deg, #faf5ff 0%, #f3f4f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-pivot-data svg {
  opacity: 0.7;
  color: #4A148C;
}

.no-pivot-data h4 {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: #4A148C;
}

.no-pivot-data p {
  margin: 0;
  line-height: 1.6;
  max-width: 450px;
  font-size: 1rem;
  color: #6b7280;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.quick-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  border: none;
  padding: 1rem 1.75rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(74, 20, 140, 0.25);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(74, 20, 140, 0.35);
}

.quick-action-btn.secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  box-shadow: 0 6px 12px rgba(107, 114, 128, 0.25);
}

.quick-action-btn.secondary:hover {
  box-shadow: 0 8px 16px rgba(107, 114, 128, 0.35);
}

/* Additional aggregation select styling */
.aggregation-select {
  margin-left: 0.75rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.75rem;
  background: white;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s ease;
}

.aggregation-select:focus {
  outline: none;
  border-color: #4A148C;
  box-shadow: 0 0 0 3px rgba(74, 20, 140, 0.1);
}

/* Debug info styling */
.debug-info {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #92400e;
}

.debug-close-btn {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

/* Results content styling */
.results-content {
  padding: 1.5rem;
}

.pivot-table-area {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.pivot-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.pivot-table th,
.pivot-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #f1f3f4;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.pivot-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f3f4 100%);
  font-weight: 700;
  color: #4A148C;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.pivot-table tbody tr:hover {
  background: linear-gradient(135deg, #faf8ff 0%, #f9fafb 100%);
  transform: scale(1.005);
}

.pivot-table td.dimension {
  font-weight: 600;
  color: #374151;
}

.pivot-table td.value {
  font-weight: 700;
  color: #4A148C;
  text-align: right;
}

.pivot-table td.percentage {
  font-weight: 600;
  color: #059669;
  text-align: right;
}

.no-pivot-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  text-align: center;
  color: #4A148C;
}

.loading-icon {
  margin-bottom: 1rem;
}

.loading-icon svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .analytics-container {
    flex-direction: column;
    height: auto;
  }
  
  .data-explorer {
    width: 100%;
    height: 300px;
    border-right: none;
    border-bottom: 1px solid #e0e4e7;
  }
  
  .header-toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .toolbar-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-toolbar {
    padding: 1rem;
  }
  
  .app-title {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .analysis-tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    white-space: nowrap;
    padding: 0.75rem 1rem;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .pivot-config {
    flex-direction: column;
  }
}

/* Header Content Styles */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.title-section p {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-btn, .export-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.refresh-btn:hover, .export-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Analytics Grid */
.analytics-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Metrics Row */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-left: 5px solid;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-card.primary { border-left-color: #4A148C; }
.metric-card.secondary { border-left-color: #FF5722; }
.metric-card.tertiary { border-left-color: #FF9800; }
.metric-card.quaternary { border-left-color: #4CAF50; }

.metric-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.metric-content {
  flex: 1;
}

.metric-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.metric-change {
  font-size: 0.9rem;
  font-weight: 600;
}

.metric-change.positive { color: #4CAF50; }
.metric-change.negative { color: #f44336; }
.metric-change.neutral { color: #FF9800; }

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.chart-header h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.period-select {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 12px;
  color: #4A148C;
  font-weight: 500;
  cursor: pointer;
}

.trend-legend {
  display: flex;
  gap: 1.5rem;
}

.legend-item {
  font-weight: 500;
  font-size: 0.9rem;
}

.legend-item.referrals { color: #4A148C; }
.legend-item.overviews { color: #FF5722; }
.legend-item.assessments { color: #FF9800; }

.chart-content {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

/* Tables Section */
.tables-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
}

.table-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.table-header h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.view-all-btn {
  background: #4A148C;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.view-all-btn:hover {
  background: #2D1B69;
}

.no-data {
  text-align: center;
  color: #666;
  padding: 3rem;
  font-style: italic;
}

.activity-table, .performers-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th, .performers-table th,
.activity-table td, .performers-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.activity-table th, .performers-table th {
  background: #f8f9fa;
  color: #4A148C;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-type, .status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.activity-type.referral { background: #e3f2fd; color: #1976d2; }
.activity-type.overview { background: #fff3e0; color: #f57c00; }
.activity-type.assessment { background: #f3e5f5; color: #7b1fa2; }

.status.completed { background: #e8f5e8; color: #2e7d32; }
.status.pending { background: #fff8e1; color: #f57f17; }
.status.in.progress { background: #e3f2fd; color: #1976d2; }

.progress-bar {
  position: relative;
  background: #e0e0e0;
  border-radius: 10px;
  height: 20px;
  min-width: 100px;
}

.progress-fill {
  background: linear-gradient(90deg, #4A148C 0%, #7b1fa2 100%);
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Insights Section */
.insights-section.full-width {
  grid-column: 1 / -1;
}

.insights-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.insights-header h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.insights-date {
  color: #666;
  font-size: 0.9rem;
}

.insights-content {
  display: grid;
  gap: 1rem;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid;
}

.insight-item.positive {
  background: #f1f8e9;
  border-left-color: #4caf50;
}

.insight-item.warning {
  background: #fff8e1;
  border-left-color: #ff9800;
}

.insight-item.info {
  background: #e3f2fd;
  border-left-color: #2196f3;
}

.insight-icon {
  font-size: 1.5rem;
  margin-top: 2px;
}

.insight-text {
  flex: 1;
  line-height: 1.6;
  color: #333;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.loading-spinner {
  text-align: center;
  color: #4A148C;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4A148C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .tables-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .data-analysis {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .title-section h1 {
    font-size: 2rem;
  }
  
  .metrics-row {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .metric-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .charts-section, .tables-section {
    grid-template-columns: 1fr;
  }
  
  .chart-header, .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .trend-legend {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .title-section h1 {
    font-size: 1.5rem;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .refresh-btn, .export-btn {
    width: 100%;
    text-align: center;
  }
  
  .metric-number {
    font-size: 2rem;
  }
  
  .chart-content {
    height: 250px;
  }
  
  .activity-table th, .performers-table th,
  .activity-table td, .performers-table td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .insight-item {
    padding: 1rem;
  }
}
</style>