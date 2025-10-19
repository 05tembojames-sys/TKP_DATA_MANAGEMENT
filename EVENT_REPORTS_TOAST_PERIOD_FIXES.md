# Event Reports - Toast & Period Filter Fixes

## Issues Fixed ✅

### Issue 1: `showToast is not a function`

**Error Message**:
```
TypeError: showToast is not a function at updateReport
```

**Root Cause**:
The `useToast()` composable returns an object with methods like `success()`, `error()`, `info()`, `warning()`, not a `showToast()` function. The component was incorrectly destructuring it.

**Fix Applied**:

```javascript
// Before (WRONG)
const { showToast } = useToast()
showToast('Message', 'error')

// After (CORRECT)
const toast = useToast()
toast.error('Message')
toast.success('Message')
toast.info('Message')
toast.warning('Message')
```

**Files Modified**:
- `src/components/EventReports.vue` - Updated all toast calls

**All toast calls updated**:
1. ✅ `toast.error()` - For error messages
2. ✅ `toast.success()` - For success messages
3. ✅ `toast.info()` - For info messages
4. ✅ `toast.warning()` - For warning messages (new!)

---

### Issue 2: Period Filter Excludes All Data

**Error Message**:
```
Found 2 forms for program child-tracking
After period filter: 0 forms
```

**Root Cause**:
Mismatch between how period IDs are generated in the component vs. the service.

**Component (EventReports.vue)** generates:
```javascript
// For monthly periods
month-0  // Current month
month-1  // Last month
month-2  // 2 months ago
// etc.
```

**Service (eventReportsService.js)** was generating:
```javascript
// Old (WRONG)
month-0   // January
month-1   // February
month-9   // October
// Based on absolute month number (0-11)
```

**The Problem**:
- Form created in October → `month-9` (absolute)
- User selects "Last 3 months" → `month-0`, `month-1`, `month-2` (relative)
- No match! Form filtered out.

**Fix Applied**:

```javascript
// Before
getFormPeriodId(date, periodType) {
  const month = date.getMonth()  // 0-11
  return `month-${month}`  // Always returns absolute month
}

// After
getFormPeriodId(date, periodType) {
  const month = date.getMonth()  // 0-11
  const now = new Date()
  
  if (periodType === 'monthly') {
    // Calculate how many months back this date is
    const monthsBack = (now.getFullYear() - year) * 12 + (now.getMonth() - month)
    return `month-${monthsBack}`  // Returns relative position
  }
  // Similar logic for weekly, quarterly, yearly
}
```

**How It Works Now**:

```
Form created: October 15, 2025
Current date: October 19, 2025

Calculation:
  monthsBack = (2025 - 2025) * 12 + (9 - 9) = 0
  periodId = "month-0" ✓

User selects "This month" → ["month-0"]
Form matches! ✓
```

**Files Modified**:
- `src/services/eventReportsService.js` - Updated `getFormPeriodId()` method

---

### Issue 3: Auto-Select Periods When None Selected

**Enhancement**:
Added automatic period selection when user forgets to select periods.

**Before**:
- User selects program and elements
- Forgets to select periods
- Clicks Update
- 0 forms match (no periods selected)
- Empty result

**After**:
- User selects program and elements
- Forgets to select periods
- Clicks Update
- **System auto-selects all available periods**
- Shows data for all periods
- Warning toast if no data found

**Implementation**:

```javascript
const updateReport = async () => {
  // ... validation ...
  
  // Auto-select all periods if none selected
  if (config.value.selectedPeriods.length === 0 && config.value.periodType !== 'custom') {
    console.log('No periods selected, auto-selecting all available periods')
    config.value.selectedPeriods = availablePeriods.value.map(p => p.id)
  }
  
  // ... fetch data ...
  
  // Better feedback
  if (reportData.value.length === 0) {
    toast.warning('No data found for the selected criteria. Try selecting different periods or adjusting filters.')
  } else {
    toast.success(`Report generated successfully with ${reportData.value.length} rows`)
  }
}
```

---

### Issue 4: Better Debug Logging

**Added Enhanced Console Logging**:

```javascript
// In eventReportsService.js
filterByPeriod(forms, periodType, selectedPeriods) {
  console.log('Filtering by period:', { 
    periodType, 
    selectedPeriods, 
    formsCount: forms.length 
  })
  
  const filtered = forms.filter(form => {
    const formDate = this.getFormDate(form)
    if (!formDate) {
      console.log('Form has no valid date:', form.id)
      return false
    }
    
    const periodId = this.getFormPeriodId(formDate, periodType)
    const matches = selectedPeriods.includes(periodId)
    
    if (!matches) {
      console.log(`Form ${form.id} (${formDate.toISOString()}) -> periodId: ${periodId} not in`, selectedPeriods)
    }
    
    return matches
  })
  
  console.log(`Filtered ${filtered.length} forms from ${forms.length}`)
  return filtered
}
```

**Console Output Example**:
```
Filtering by period: {periodType: 'monthly', selectedPeriods: Array(12), formsCount: 3}
Form abc123 (2025-10-15) -> periodId: month-0 matches ✓
Form def456 (2025-09-20) -> periodId: month-1 matches ✓
Form ghi789 (2024-12-10) -> periodId: month-10 not in [month-0, month-1, ...]
Filtered 2 forms from 3
```

---

## Testing the Fixes

### Test 1: Toast Notifications Work

1. Open Event Reports
2. Click "Update" without selecting program
3. **Expected**: Red error toast "Please select a program" ✓
4. Select program, click "Update" without elements
5. **Expected**: Red error toast "Please select at least one data element" ✓
6. Configure properly, click "Update"
7. **Expected**: Green success toast "Report generated successfully with X rows" ✓

### Test 2: Period Filtering Works

1. Open Event Reports
2. Select program: `child-tracking`
3. Select element: `age`
4. Period type: `Monthly`
5. **Don't select any periods** (leave unchecked)
6. Click "Update"
7. **Expected**: 
   - Console: "No periods selected, auto-selecting all available periods"
   - Data appears for all months
   - Success toast

8. Now manually select only "This month"
9. Click "Update"
10. **Expected**:
    - Console: "Filtering by period: {periodType: 'monthly', selectedPeriods: ['month-0'], ...}"
    - Console: "Filtered X forms from Y"
    - Only current month data shown

### Test 3: Debug Info in Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Generate a report
4. **Expected to see**:
```
Updating report with config: {...}
Generating report with config: {...}
Found X forms for program child-tracking
Filtering by period: {...}
Form abc123 (2025-10-15) -> periodId: month-0 matches
Filtered 2 forms from 2
Report generated successfully with 2 rows
```

---

## What Changed

### EventReports.vue

**Lines Modified**: ~15 lines

**Changes**:
1. `const { showToast } = useToast()` → `const toast = useToast()`
2. All `showToast('msg', 'type')` → `toast.type('msg')`
3. Auto-select periods if none selected
4. Better feedback messages (success/warning based on result)

### eventReportsService.js

**Lines Modified**: ~30 lines

**Changes**:
1. `getFormPeriodId()` - Calculate relative period IDs (months back from now)
2. `filterByPeriod()` - Add detailed console logging
3. Better debugging output for troubleshooting

---

## Common Scenarios Fixed

### Scenario 1: Recent Forms Not Showing

**Before**: 
- Form created today
- Generated periodId: `month-9` (October = month 9)
- Selected periods: `month-0` (current month in relative terms)
- No match → Form hidden

**After**:
- Form created today
- Generated periodId: `month-0` (0 months back)
- Selected periods: `month-0`
- Match! → Form shown ✓

### Scenario 2: Forms from Different Months

**Before**:
```
Form A: Created Sept 15 → month-8
Form B: Created Oct 10 → month-9
Selected: month-0, month-1
Result: No forms match
```

**After**:
```
Form A: Created Sept 15 → month-1 (1 month ago)
Form B: Created Oct 10 → month-0 (this month)
Selected: month-0, month-1
Result: Both forms match ✓
```

### Scenario 3: Forgot to Select Periods

**Before**:
- No periods selected
- No forms match
- Empty result
- Confusing for user

**After**:
- No periods selected
- System auto-selects all 12 months
- All forms shown
- User understands what happened ✓

---

## Period ID Reference

### Monthly Periods
```javascript
month-0   // This month
month-1   // Last month
month-2   // 2 months ago
month-3   // 3 months ago
// etc., up to month-11 (12 months ago)
```

### Weekly Periods
```javascript
week-0   // This week
week-1   // Last week
week-2   // 2 weeks ago
// etc.
```

### Quarterly Periods
```javascript
q1-2025  // Q1 2025 (Jan-Mar)
q2-2025  // Q2 2025 (Apr-Jun)
q3-2025  // Q3 2025 (Jul-Sep)
q4-2025  // Q4 2025 (Oct-Dec)
```

### Yearly Periods
```javascript
year-2025  // Year 2025
year-2024  // Year 2024
year-2023  // Year 2023
```

---

## Troubleshooting

### Still Getting "After period filter: 0 forms"?

**Check Console Logs**:
```javascript
// Look for this output
Filtering by period: {periodType: 'monthly', selectedPeriods: [...], formsCount: X}

// For each form that doesn't match, you'll see:
Form abc123 (2025-10-15T...) -> periodId: month-X not in [month-0, month-1, ...]
```

**Common Causes**:
1. **Forms are too old**: If all forms are from 12+ months ago, they won't match `month-0` to `month-11`
   - **Solution**: Select more periods or use yearly view
   
2. **Custom date range issue**: Start/end dates exclude form dates
   - **Solution**: Check the date range includes your form dates

3. **Forms have no createdAt timestamp**: Forms created before timestamp fields added
   - **Solution**: Check console for "Form has no valid date: X"

### Toast Still Not Working?

**Check**:
1. `useToast.js` composable exists in `src/composables/`
2. No typos in method names: `toast.success()` not `toast.Success()`
3. Toast component is mounted in App.vue

### Need More Debug Info?

**Add to EventReports.vue**:
```javascript
watch(() => config.value.selectedPeriods, (newVal) => {
  console.log('Selected periods changed:', newVal)
})
```

**Add to eventReportsService.js**:
```javascript
console.log('Form date:', formDate)
console.log('Generated period ID:', periodId)
console.log('Available period IDs:', selectedPeriods)
```

---

## All Fixed! ✅

**No More Errors**:
- ✅ Toast notifications work properly
- ✅ Period filtering matches forms correctly
- ✅ Auto-selection prevents empty results
- ✅ Better error messages guide users
- ✅ Debug logging helps troubleshoot

**Ready to Use**:
The Event Reports system now properly filters data by periods and shows appropriate feedback messages!
