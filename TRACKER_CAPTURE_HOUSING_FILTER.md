# TrackerCapture Housing Filter Implementation

## Overview
Modified TrackerCapture to:
1. Only display children who have been **housed** (completed BOTH Initial Assessment and Child Overview forms)
2. Track and display ALL forms completed for each child across all program stages
3. Show real-time completion status for each program stage

## Changes Made

### File: `src/services/trackerService.js`

**Function Modified:** `generateCasesFromForms()` (lines 348-390)

**What Changed:**
Added a filter that checks each child's forms before creating a case in TrackerCapture. The filter ensures that only children with BOTH forms are included:

1. **Initial Assessment Form** (`initial-assessment`) - Completed first
2. **Child Overview Form** (`child-overview`) - Indicates the child has been housed

### Logic Flow

```javascript
// For each child group
const formTypes = forms.map(f => f.sourceType)
const hasInitialAssessment = formTypes.includes('initial-assessment')
const hasChildOverview = formTypes.includes('child-overview')

// Only show if BOTH forms exist
if (!hasInitialAssessment || !hasChildOverview) {
  return // Skip this child - not housed yet
}
```

### How It Works

1. **ChildTracker Component** (`src/components/ChildTracker.vue`):
   - When `showOnlyComplete` prop is `true`, it shows the "In Housed Girls" view
   - Displays children who have completed both forms
   - Provides access to additional assessment forms (Medical Intake, Academics, etc.)

2. **TrackerCapture Component** (`src/components/TrackerCapture.vue`):
   - Now **automatically filters** to show only housed children
   - Displays program stages for each child
   - Allows tracking of progress through different care stages

3. **Data Flow & Form Tracking**:
   ```
   Initial Referral → Initial Assessment → Child Overview → HOUSED
                                              ↓
                                    TrackerCapture Shows Child
                                              ↓
                              ALL Forms Tracked in Real-Time:
                              ✓ Initial Referral (if completed)
                              ✓ Initial Assessment (required)
                              ✓ Child Overview & Background (required)
                              ✓ Medical Intake Assessment
                              ✓ Academics & Literacy
                              ✓ Psychological Assessment
                              ✓ Life Skills Survey
                              ✓ Birth & Delivery Report
                              ✓ Care Plan Summary
                              ✓ Care Plan (Baby)
                              ✓ Care Plan - Ongoing Life Skills
                              
   Each form completion automatically updates the child's stage status!
   ```

## Benefits

1. **Clear Workflow**: TrackerCapture specifically tracks housed children through their care journey
2. **Data Integrity**: Only children with complete intake process appear in tracking stages
3. **Reduced Clutter**: Eliminates partial/incomplete cases from the tracking system
4. **Better Organization**: Separates referral/assessment phase from active care phase
5. **Real-Time Updates**: All forms added in ChildTracker immediately appear as completed stages
6. **Comprehensive Tracking**: Every form type is tracked and displayed
7. **Visual Progress**: Staff can see at a glance which stages each child has completed

## Usage

### For Staff:

1. **Initial Referral/Assessment**: Use regular forms to assess new cases
2. **Housing Decision**: Complete Child Overview form in ChildTracker when admitting a child
3. **Ongoing Tracking**: Child automatically appears in TrackerCapture with all program stages available
4. **Progress Monitoring**: Track child through each care stage in TrackerCapture

### Accessing Housed Children:

**ChildTracker "In Housed Girls" View:**
- Dashboard → "In Housed Girls - Complete Forms Only"
- Shows all housed children with form management capabilities

**TrackerCapture:**
- Dashboard → "Tracker Capture"
- Shows ONLY housed children
- Displays program stages and progress
- Allows adding events/forms for each stage

## Technical Notes

- The filter is applied at the service layer (`trackerService.js`)
- Console logs show which children are included/excluded for debugging
- Both form types must use consistent child identification (name + DOB matching)
- The `sourceType` field on forms tracks which form type each entry represents

## Testing

To verify the filter is working:

1. Check browser console for log messages:
   - "Skipping child [name] - not housed yet..."
   - "Including housed child: [name]"

2. Verify TrackerCapture only shows children who appear in "In Housed Girls" view in ChildTracker

3. Confirm children without both forms do NOT appear in TrackerCapture

## Future Enhancements

Potential improvements:
- Add a status indicator showing "Housed" vs "Pending Housing"
- Create a separate view for children awaiting housing decision
- Add housing date tracking
- Generate reports on housing progression rates
