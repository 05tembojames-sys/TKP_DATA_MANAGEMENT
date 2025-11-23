# Applying DHIS2 Redesign to Capture.vue - Quick Guide

## 🎯 Quick Application Steps

Since Capture.vue is a large file (2735 lines), here's the most efficient way to apply the DHIS2 redesign:

---

## Option A: Targeted Updates (Recommended - 15 minutes)

### Step 1: Update Main Container Class
**Line 2**: Change from:
```vue
<div class="capture-container">
```
To:
```vue
<div class="dhis2-capture-app">
```

### Step 2: Add Breadcrumb Bar (After TopHeader)
**After line 5**, add:
```vue
<!-- Breadcrumb Navigation -->
<div class="breadcrumb-bar">
  <div class="breadcrumb-container">
    <button @click="$router.back()" class="back-button">
      <i class="fas fa-arrow-left"></i>
    </button>
    <nav class="breadcrumb">
      <router-link to="/dashboard" class="breadcrumb-item">Home</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item">Capture</span>
      <span class="breadcrumb-separator" v-if="selectedDataSet">/</span>
      <span class="breadcrumb-item active" v-if="selectedDataSet">
        {{ getDataSetName(selectedDataSet) }}
      </span>
    </nav>
  </div>
</div>
```

### Step 3: Replace Sub-Header with Selection Bar
**Replace lines 8-60** with:
```vue
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
```

### Step 4: Wrap Content in New Layout
**Replace lines 63-end of capture-content** with:
```vue
<!-- Main Content Area -->
<div class="main-content">
  <!-- Form Content Area -->
  <div class="content-area full-width">
    <!-- Empty State -->
    <div v-if="!showDataEntry" class="empty-state">
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

    <!-- Form Container -->
    <div v-else class="form-container">
      <!-- Your existing form components here -->
      <div class="form-body">
        <!-- Initial Referral Form -->
        <div v-if="selectedDataSet === 'initial-referral'">
          <InitialReferralForm
            ref="referralForm"
            @form-saved="handleReferralFormSaved"
          />
        </div>

        <!-- Medical Intake Form -->
        <div v-else-if="selectedDataSet === 'medical-intake'">
          <MedicalIntakeForm
            @form-saved="handleReferralFormSaved"
          />
        </div>

        <!-- Child Overview Form -->
        <div v-else-if="selectedDataSet === 'child-overview'">
          <ChildOverviewForm
            @form-saved="handleReferralFormSaved"
          />
        </div>

        <!-- Initial Assessment Form -->
        <div v-else-if="selectedDataSet === 'initial-assessment'">
          <InitialAssessmentForm
            @form-saved="handleReferralFormSaved"
          />
        </div>

        <!-- Add other forms as needed -->
      </div>
    </div>
  </div>
</div>
```

### Step 5: Replace All Styles
**Replace the entire `<style scoped>` section** with the DHIS2 styles from `.agent/DHIS2_CAPTURE_REDESIGN.md` (starting from line with `/* DHIS2 Color Variables */`)

---

## Option B: Complete File Replacement (5 minutes, but verify carefully)

I can create a complete new Capture.vue file with:
- All DHIS2 styling applied
- All your existing form components preserved
- All functionality maintained
- Ready to use immediately

Would you like me to:
1. ✅ **Create the complete new file** (recommended - fastest)
2. ⚠️ **Make targeted edits** (safer but slower)

---

## Quick CSS-Only Update (2 minutes)

If you want to keep everything else the same and just update the styling:

### Replace entire `<style scoped>` section

1. Scroll to bottom of Capture.vue
2. Find `<style scoped>`
3. Delete everything between `<style scoped>` and `</style>`
4. Copy all CSS from `.agent/DHIS2_CAPTURE_REDESIGN.md`
5. Paste it in

This will give you 80% of the visual improvements with minimal risk!

---

## What Would You Like?

**Type:**
- **`full`** - I'll create a complete new Capture.vue with DHIS2 design
- **`css`** - I'll just update the styles (quick & safe)
- **`guide`** - I'll create a more detailed step-by-step guide

Let me know which approach you prefer!
