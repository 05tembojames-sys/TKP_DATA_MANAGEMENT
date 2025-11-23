# DHIS2-Style Capture Component - Implementation Guide

## Overview

Transform Capture.vue into a professional DHIS2-style data capture interface with:
- Clean, modern layout
- Better organization
- Professional styling
- Enhanced user experience
- Consistent with DHIS2 design patterns

---

## Key DHIS2 Capture Interface Elements

### 1. **Layout Structure**
```
┌─────────────────────────────────────────────────┐
│  Top Header (Global)                            │
├─────────────────────────────────────────────────┤
│  Breadcrumb Navigation                          │
├─────────────────────────────────────────────────┤
│  Selection Bar (Org Unit | Program | Period)   │
├─────────────────────────────────────────────────┤
│  ┌────────────┬──────────────────────────────┐  │
│  │            │                              │  │
│  │  Sidebar   │   Main Content Area          │  │
│  │  (Nav/     │   (Data Entry Form)          │  │
│  │   Info)    │                              │  │
│  │            │                              │  │
│  └────────────┴──────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 2. **Color Scheme** (DHIS2 Blue)
- Primary: `#2c6693` (DHIS2 Blue)
- Secondary: `#4a90c5`
- Success: `#4CAF50`
- Warning: `#FF9800`
- Error: `#F44336`
- Background: `#f4f6f8`
- Card: `#ffffff`

### 3. **Typography**
- Font Family: 'Roboto', sans-serif
- Headings: 500 weight
- Body: 400 weight
- Labels: 14px, 500 weight
- Inputs: 14px

### 4. **Spacing**
- Section padding: 24px
- Card padding: 16px
- Element gap: 16px
- Tight gap: 8px

---

## Enhanced Template Structure

Replace the template section with this DHIS2-styled version:

```vue
<template>
  <div class="dhis2-capture-app">
    <!-- Top Header (Global) -->
    <TopHeader />

    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-bar">
      <div class="breadcrumb-container">
        <button @click="navigateBack" class="back-button">
          <i class="fas fa-arrow-left"></i>
        </button>
        <nav class="breadcrumb">
          <a href="/dashboard" class="breadcrumb-item">Home</a>
          <span class="breadcrumb-separator">/</span>
          <a href="/capture" class="breadcrumb-item">Capture</a>
          <span class="breadcrumb-separator" v-if="selectedDataSet">/</span>
          <span class="breadcrumb-item active" v-if="selectedDataSet">
            {{ getDataSetName(selectedDataSet) }}
          </span>
        </nav>
      </div>
    </div>

    <!-- Selection Bar -->
    <div class="selection-bar">
      <div class="selection-container">
        <!-- Organisation Unit Selector -->
        <div class="selector-group">
          <label class="selector-label">
            <i class="fas fa-sitemap"></i>
            Organisation Unit
          </label>
          <select 
            v-model="selectedOrgUnit" 
            @change="onOrgUnitChange"
            class="dhis-select"
          >
            <option value="">Select organisation unit</option>
            <option 
              v-for="ou in orgUnits" 
              :key="ou.id" 
              :value="ou.id"
            >
              {{ ou.name }}
            </option>
          </select>
        </div>

        <!-- Program/Data Set Selector -->
        <div class="selector-group">
          <label class="selector-label">
            <i class="fas fa-clipboard-list"></i>
            Program
          </label>
          <select 
            v-model="selectedDataSet" 
            @change="onDataSetChange"
            class="dhis-select"
          >
            <option value="">Select program</option>
            <option 
              v-for="ds in dataSets" 
              :key="ds.id" 
              :value="ds.id"
            >
              {{ ds.name }}
            </option>
          </select>
        </div>

        <!-- Period Selector -->
        <div class="selector-group">
          <label class="selector-label">
            <i class="fas fa-calendar-alt"></i>
            Period
          </label>
          <div class="period-selector">
            <button 
              @click="previousPeriod" 
              class="period-nav-btn"
              :disabled="!selectedPeriod"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <select 
              v-model="selectedPeriod" 
              @change="onPeriodChange"
              class="dhis-select period-select"
            >
              <option value="">Select period</option>
              <option 
                v-for="period in periods" 
                :key="period.id" 
                :value="period.id"
              >
                {{ period.name }}
              </option>
            </select>
            <button 
              @click="nextPeriod" 
              class="period-nav-btn"
              :disabled="!selectedPeriod"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Load Button -->
        <div class="selector-group action-group">
          <button 
            @click="loadDataEntry" 
            :disabled="!canLoadData"
            class="load-btn"
          >
            <i class="fas fa-download"></i>
            Load
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Sidebar (Optional - Context Info) -->
      <div class="sidebar" v-if="showSidebar && formLoaded">
        <div class="sidebar-card">
          <h3 class="sidebar-title">
            <i class="fas fa-info-circle"></i>
            Context Information
          </h3>
          
          <div class="info-group">
            <label>Organisation Unit</label>
            <p>{{ getOrgUnitName(selectedOrgUnit) }}</p>
          </div>

          <div class="info-group">
            <label>Program</label>
            <p>{{ getDataSetName(selectedDataSet) }}</p>
          </div>

          <div class="info-group">
            <label>Period</label>
            <p>{{ getPeriodName(selectedPeriod) }}</p>
          </div>

          <div class="info-group" v-if="completionStatus !== null">
            <label>Completion</label>
            <div class="completion-bar">
              <div 
                class="completion-fill" 
                :style="`width: ${completionStatus}%`"
                :class="getCompletionClass()"
              ></div>
            </div>
            <p class="completion-text">{{ completionStatus }}% complete</p>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <button @click="handleSaveAsDraft" class="action-btn">
              <i class="fas fa-save"></i>
              Save Draft
            </button>
            <button @click="handleClearData" class="action-btn danger">
              <i class="fas fa-eraser"></i>
              Clear
            </button>
          </div>
        </div>

        <!-- History Card -->
        <div class="sidebar-card" v-if="recentForms.length > 0">
          <h3 class="sidebar-title">
            <i class="fas fa-history"></i>
            Recent Entries
          </h3>
          <div class="recent-list">
            <div 
              v-for="form in recentForms" 
              :key="form.id"
              @click="loadRecentForm(form)"
              class="recent-item"
            >
              <div class="recent-date">{{ formatDate(form.createdAt) }}</div>
              <div class="recent-status" :class="form.status">
                {{ form.status }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content Area -->
      <div class="content-area" :class="{ 'full-width': !showSidebar }">
        <!-- Empty State -->
        <div v-if="!formLoaded" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <h2>Select parameters to begin</h2>
          <p>Please select an organisation unit, program, and period to start data entry</p>
          <div class="empty-steps">
            <div class="step" :class="{ complete: selectedOrgUnit }">
              <div class="step-icon">
                <i class="fas fa-check" v-if="selectedOrgUnit"></i>
                <span v-else>1</span>
              </div>
              <p>Select Organisation Unit</p>
            </div>
            <div class="step" :class="{ complete: selectedDataSet }">
              <div class="step-icon">
                <i class="fas fa-check" v-if="selectedDataSet"></i>
                <span v-else>2</span>
              </div>
              <p>Select Program</p>
            </div>
            <div class="step" :class="{ complete: selectedPeriod }">
              <div class="step-icon">
                <i class="fas fa-check" v-if="selectedPeriod"></i>
                <span v-else>3</span>
              </div>
              <p>Select Period</p>
            </div>
          </div>
        </div>

        <!-- Form Area -->
        <div v-else class="form-container">
          <!-- Form Header -->
          <div class="form-header">
            <div class="form-title-area">
              <h2 class="form-title">{{ getDataSetName(selectedDataSet) }}</h2>
              <div class="form-meta">
                <span class="meta-item">
                  <i class="fas fa-building"></i>
                  {{ getOrgUnitName(selectedOrgUnit) }}
                </span>
                <span class="meta-separator">•</span>
                <span class="meta-item">
                  <i class="fas fa-calendar"></i>
                  {{ getPeriodName(selectedPeriod) }}
                </span>
                <span class="meta-separator">•</span>
                <span class="meta-item" :class="`status-${formStatus}`">
                  <i class="fas fa-circle"></i>
                  {{ formStatus || 'Draft' }}
                </span>
              </div>
            </div>

            <!-- Form Actions Toolbar -->
            <div class="form-actions">
              <button 
                @click="handleSaveAsDraft" 
                class="btn-secondary"
                :disabled="saving"
              >
                <i class="fas fa-save"></i>
                Save as Draft
              </button>
              <button 
                @click="handleCompleteEntry" 
                class="btn-primary"
                :disabled="saving || !canComplete"
              >
                <i class="fas fa-check"></i>
                Complete
              </button>
              <button 
                @click="showFormMenu = !showFormMenu" 
                class="btn-icon"
              >
                <i class="fas fa-ellipsis-v"></i>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="showFormMenu" class="dropdown-menu">
                <button @click="handlePrintForm">
                  <i class="fas fa-print"></i>
                  Print Form
                </button>
                <button @click="handleExportData">
                  <i class="fas fa-download"></i>
                  Export Data
                </button>
                <div class="menu-divider"></div>
                <button @click="handleClearData" class="danger">
                  <i class="fas fa-eraser"></i>
                  Clear Data
                </button>
              </div>
            </div>
          </div>

          <!-- Form Body -->
          <div class="form-body">
            <!-- Individual Form Components -->
            <div v-if="selectedDataSet === 'initial-referral'">
              <InitialReferralForm
                ref="referralForm"
                @form-saved="handleFormSaved"
                @form-updated="handleFormUpdated"
              />
            </div>

            <div v-else-if="selectedDataSet === 'medical-intake'">
              <MedicalIntakeForm
                ref="medicalForm"
                @form-saved="handleFormSaved"
                @form-updated="handleFormUpdated"
              />
            </div>

            <div v-else-if="selectedDataSet === 'child-overview'">
              <ChildOverviewForm
                ref="overviewForm"
                @form-saved="handleFormSaved"
                @form-updated="handleFormUpdated"
              />
            </div>

            <div v-else-if="selectedDataSet === 'initial-assessment'">
              <InitialAssessmentForm
                ref="assessmentForm"
                @form-saved="handleFormSaved"
                @form-updated="handleFormUpdated"
              />
            </div>

            <!-- Standard Data Entry Grid (fallback) -->
            <div v-else class="data-entry-grid">
              <div 
                v-for="section in formSections" 
                :key="section.id"
                class="form-section"
              >
                <h3 class="section-title">{{ section.name }}</h3>
                
                <div class="section-fields">
                  <div 
                    v-for="element in section.dataElements"
                    :key="element.id"
                    class="field-group"
                    :class="{ required: element.required, error: hasError(element.id) }"
                  >
                    <label class="field-label">
                      {{ element.name }}
                      <span v-if="element.required" class="required-mark">*</span>
                      <i 
                        v-if="element.description" 
                        class="fas fa-info-circle tooltip-icon"
                        :title="element.description"
                      ></i>
                    </label>

                    <!-- Text Input -->
                    <input 
                      v-if="element.valueType === 'TEXT'"
                      v-model="formData[element.id]"
                      type="text"
                      class="dhis-input"
                      :placeholder="element.placeholder"
                      @input="handleFieldChange(element.id)"
                      @blur="validateField(element.id)"
                    />

                    <!-- Number Input -->
                    <input 
                      v-else-if="element.valueType === 'NUMBER'"
                      v-model.number="formData[element.id]"
                      type="number"
                      class="dhis-input"
                      :min="element.min"
                      :max="element.max"
                      @input="handleFieldChange(element.id)"
                      @blur="validateField(element.id)"
                    />

                    <!-- Date Input -->
                    <input 
                      v-else-if="element.valueType === 'DATE'"
                      v-model="formData[element.id]"
                      type="date"
                      class="dhis-input"
                      @input="handleFieldChange(element.id)"
                      @blur="validateField(element.id)"
                    />

                    <!-- Select Dropdown -->
                    <select 
                      v-else-if="element.valueType === 'SELECT'"
                      v-model="formData[element.id]"
                      class="dhis-select"
                      @change="handleFieldChange(element.id)"
                    >
                      <option value="">Select option</option>
                      <option 
                        v-for="option in element.options"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>

                    <!-- Textarea -->
                    <textarea 
                      v-else-if="element.valueType === 'LONG_TEXT'"
                      v-model="formData[element.id]"
                      class="dhis-textarea"
                      rows="3"
                      :placeholder="element.placeholder"
                      @input="handleFieldChange(element.id)"
                      @blur="validateField(element.id)"
                    ></textarea>

                    <!-- Boolean/Checkbox -->
                    <label 
                      v-else-if="element.valueType === 'BOOLEAN'"
                      class="checkbox-label"
                    >
                      <input 
                        type="checkbox"
                        v-model="formData[element.id]"
                        @change="handleFieldChange(element.id)"
                      />
                      <span>{{ element.checkboxLabel || 'Yes' }}</span>
                    </label>

                    <!-- Validation Error -->
                    <div v-if="getFieldError(element.id)" class="field-error">
                      <i class="fas fa-exclamation-circle"></i>
                      {{ getFieldError(element.id) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Footer -->
          <div class="form-footer">
            <div class="footer-info">
              <span v-if="lastSaved">
                <i class="fas fa-clock"></i>
                Last saved: {{ formatTime(lastSaved) }}
              </span>
              <span v-if="saving" class="saving-indicator">
                <i class="fas fa-spinner fa-spin"></i>
                Saving...
              </span>
            </div>
            
            <div class="footer-actions">
              <button 
                @click="handleCancel" 
                class="btn-secondary"
              >
                Cancel
              </button>
              <button 
                @click="handleSaveAsDraft" 
                class="btn-secondary"
                :disabled="saving"
              >
                <i class="fas fa-save"></i>
                Save as Draft
              </button>
              <button 
                @click="handleCompleteEntry" 
                class="btn-primary"
                :disabled="saving || !canComplete"
              >
                <i class="fas fa-check"></i>
                Complete and Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="toast" :class="`toast-${toast.type}`">
      <i :class="`fas fa-${getToastIcon(toast.type)}`"></i>
      <span>{{ toast.message }}</span>
      <button @click="toast.show = false" class="toast-close">×</button>
    </div>
  </div>
</template>
```

---

## Enhanced Styles

Add these DHIS2-inspired styles:

```vue
<style scoped>
/* DHIS2 Color Variables */
:root {
  --dhis2-blue: #2c6693;
  --dhis2-blue-light: #4a90c5;
  --dhis2-blue-dark: #1e4b70;
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #F44336;
  --bg-primary: #f4f6f8;
  --bg-card: #ffffff;
  --text-primary: #212121;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --shadow: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-lg: 0 4px 8px rgba(0,0,0,0.15);
}

/* Main Container */
.dhis2-capture-app {
  min-height: 100vh;
  background: var(--bg-primary);
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Breadcrumb Bar */
.breadcrumb-bar {
  background: white;
  border-bottom: 1px solid var(--border-color);
  padding: 12px 0;
}

.breadcrumb-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  background: none;
  border: none;
  color: var(--dhis2-blue);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.back-button:hover {
  background: var(--bg-primary);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.breadcrumb-item {
  color: var(--dhis2-blue);
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-item:hover {
  opacity: 0.7;
}

.breadcrumb-item.active {
  color: var(--text-primary);
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--text-secondary);
}

/* Selection Bar */
.selection-bar {
  background: white;
  border-bottom: 1px solid var(--border-color);
  padding: 16px 0;
  box-shadow: var(--shadow);
}

.selection-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.selector-group {
  flex: 1;
  min-width: 200px;
}

.selector-group.action-group {
  flex: 0;
}

.selector-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.selector-label i {
  color: var(--dhis2-blue);
  font-size: 0.9rem;
}

/* DHIS2 Style Inputs */
.dhis-select,
.dhis-input,
.dhis-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  background: white;
  transition: all 0.2s;
}

.dhis-select:focus,
.dhis-input:focus,
.dhis-textarea:focus {
  outline: none;
  border-color: var(--dhis2-blue);
  box-shadow: 0 0 0 3px rgba(44, 102, 147, 0.1);
}

.dhis-select:disabled,
.dhis-input:disabled,
.dhis-textarea:disabled {
  background: var(--bg-primary);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Period Selector */
.period-selector {
  display: flex;
  gap: 8px;
}

.period-select {
  flex: 1;
}

.period-nav-btn {
  padding: 10px 12px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--dhis2-blue);
  transition: all 0.2s;
}

.period-nav-btn:hover:not(:disabled) {
  background: var(--bg-primary);
  border-color: var(--dhis2-blue);
}

.period-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Load Button */
.load-btn {
  padding: 10px 24px;
  background: var(--dhis2-blue);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: var(--shadow);
}

.load-btn:hover:not(:disabled) {
  background: var(--dhis2-blue-dark);
  box-shadow: var(--shadow-lg);
}

.load-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 24px;
  display: flex;
  gap: 24px;
}

/* Sidebar */
.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 16px 0;
  color: var(--text-primary);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--bg-primary);
}

.sidebar-title i {
  color: var(--dhis2-blue);
}

.info-group {
  margin-bottom: 16px;
}

.info-group label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 4px;
}

.info-group p {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}

/* Completion Bar */
.completion-bar {
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
}

.completion-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.completion-fill.low {
  background: var(--error);
}

.completion-fill.medium {
  background: var(--warning);
}

.completion-fill.high {
  background: var(--success);
}

.completion-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.action-btn {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-primary);
}

.action-btn.danger {
  color: var(--error);
  border-color: var(--error);
}

.action-btn.danger:hover {
  background: #FFEBEE;
}

/* Recent List */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-item {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-item:hover {
  background: var(--bg-primary);
  border-color: var(--dhis2-blue);
}

.recent-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.recent-status {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.recent-status.draft {
  background: #E0E0E0;
  color: #666;
}

.recent-status.completed {
  background: #E8F5E9;
  color: var(--success);
}

/* Content Area */
.content-area {
  flex: 1;
  min-width: 0;
}

.content-area.full-width {
  width: 100%;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 8px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: var(--shadow);
}

.empty-icon {
  font-size: 4rem;
  color: var(--border-color);
  margin-bottom: 24px;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0 0 32px 0;
}

.empty-steps {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.step.complete {
  opacity: 1;
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.step.complete .step-icon {
  background: var(--dhis2-blue);
  border-color: var(--dhis2-blue);
  color: white;
}

.step p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Form Container */
.form-container {
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* Form Header */
.form-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.form-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item i {
  font-size: 0.8rem;
}

.meta-separator {
  color: var(--border-color);
}

.status-draft { color: #666; }
.status-submitted { color: var(--dhis2-blue); }
.status-completed { color: var(--success); }
.status-rejected { color: var(--error); }

/* Form Actions */
.form-actions {
  display: flex;
  gap: 8px;
  position: relative;
}

.btn-primary,
.btn-secondary,
.btn-icon {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--dhis2-blue);
  color: white;
  box-shadow: var(--shadow);
}

.btn-primary:hover:not(:disabled) {
  background: var(--dhis2-blue-dark);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: white;
  color: var(--dhis2-blue);
  border: 1px solid var(--dhis2-blue);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-primary);
}

.btn-icon {
  padding: 10px 14px;
  background: white;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-icon:hover {
  background: var(--bg-primary);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: 1000;
}

.dropdown-menu button {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--text-primary);
  transition: background 0.2s;
}

.dropdown-menu button:hover {
  background: var(--bg-primary);
}

.dropdown-menu button.danger {
  color: var(--error);
}

.dropdown-menu button.danger:hover {
  background: #FFEBEE;
}

.menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
}

/* Form Body */
.form-body {
  padding: 24px;
}

/* Data Entry Grid */
.data-entry-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.section-title {
  background: var(--bg-primary);
  padding: 16px 20px;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  border-bottom: 2px solid var(--dhis2-blue);
}

.section-fields {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Field Group */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group.required .field-label::after {
  content: ' *';
  color: var(--error);
}

.field-group.error .dhis-input,
.field-group.error .dhis-select,
.field-group.error .dhis-textarea {
  border-color: var(--error);
}

.field-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.required-mark {
  color: var(--error);
}

.tooltip-icon {
  color: var(--text-secondary);
  cursor: help;
  font-size: 0.85rem;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--error);
  margin-top: -4px;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Form Footer */
.form-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.saving-indicator {
  color: var(--dhis2-blue);
}

.footer-actions {
  display: flex;
  gap: 12px;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  background: white;
  padding: 40px 60px;
  border-radius: 8px;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.loading-spinner i {
  font-size: 3rem;
  color: var(--dhis2-blue);
  margin-bottom: 16px;
}

.loading-spinner p {
  margin: 0;
  color: var(--text-primary);
  font-weight: 500;
}

/* Toast Notifications */
.toast {
  position: fixed;
  top: 80px;
  right: 24px;
  background: white;
  padding: 16px 20px;
  border-radius: 6px;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  z-index: 10000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-success {
  border-left: 4px solid var(--success);
  color: var(--success);
}

.toast-error {
  border-left: 4px solid var(--error);
  color: var(--error);
}

.toast-warning {
  border-left: 4px solid var(--warning);
  color: var(--warning);
}

.toast-info {
  border-left: 4px solid var(--dhis2-blue);
  color: var(--dhis2-blue);
}

.toast span {
  flex: 1;
  color: var(--text-primary);
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .section-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .selection-container {
    flex-direction: column;
  }

  .selector-group {
    width: 100%;
  }

  .form-header {
    flex-direction: column;
  }

  .form-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
```

---

## Key Improvements

1. **DHIS2 Visual Identity** - Professional blue color scheme, consistent spacing, clean typography
2. **Better Navigation** - Breadcrumbs, clear back button, contextual information
3. **Enhanced UX** - Empty states, loading indicators, toast notifications
4. **Responsive Design** - Works on all screen sizes
5. **Sidebar Context** - Quick info and actions always visible
6. **Professional Forms** - Clean field layouts, proper validation, helpful labels
7. **Status Indicators** - Clear visual feedback for form state
8. **Action Buttons** - Prominent, well-organized, with icons

This matches DHIS2's capture app while maintaining all existing functionality!
