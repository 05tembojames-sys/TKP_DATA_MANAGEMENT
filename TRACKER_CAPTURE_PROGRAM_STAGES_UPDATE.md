# Tracker Capture - Program Stages Logic Update

## Overview

Updated the TrackerCapture.vue component to use the correct program stages that align with the actual form types in the system, and made the timeline dynamic based on completed forms from Firebase.

## Key Changes

### 1. Updated Program Stages (11 Total Stages)

Replaced the generic 5-stage workflow with the actual 11 form types:

**Old Stages:**

- Referral
- Assessment
- Enrollment
- Care Plan
- Follow-up

**New Stages (In Order):**

1. **Initial Referral** (`initial-referral`)
2. **Child Overview & Background** (`child-overview`)
3. **TKP Initial Assessment** (`initial-assessment`)
4. **Medical Intake Assessment** (`medical-intake`)
5. **Academics & Literacy** (`academics-literacy`)
6. **Psychological Assessment** (`psychological-assessment`)
7. **Life Skills Survey** (`life-skills-survey`)
8. **Birth & Delivery Report** (`birth-delivery`)
9. **Care Plan Summary** (`care-plan-summary`)
10. **Care Plan (Baby)** (`care-plan-baby`)
11. **Care Plan - Ongoing Life Skills** (`care-plan-ongoing-life-skills`)

### 2. Dynamic Stage Updates Based on Firebase Data

#### Updated `updateProgramStages()` Function

Now dynamically fetches and checks all forms from Firebase:

```javascript
const updateProgramStages = async () => {
  // 1. Reset all stages
  // 2. Load child's name from selected case
  // 3. Check each form type in Firebase
  // 4. Match forms by child's name (firstName + lastName)
  // 5. Mark stages as completed if form exists
  // 6. Set first incomplete stage as active
  // 7. Create events for completed forms
};
```

**Features:**

- ✅ Automatically detects which forms have been completed
- ✅ Matches forms by child's first name and last name
- ✅ Marks completed stages with visual indicators
- ✅ Sets the next incomplete stage as active
- ✅ Creates timeline events for each completed form
- ✅ Console logging for debugging

### 3. Simplified Form Type Mapping

#### Before:

```javascript
const stageFormMap = {
  referral: "initial-referral",
  assessment: "initial-assessment",
  // ... complex mapping
};
```

#### After:

```javascript
const getFormTypeForStage = (stageId) => {
  const stage = programStages.value.find((s) => s.id === stageId);
  return stage ? stage.formType : "initial-referral";
};
```

**Benefits:**

- Stage ID and form type are the same
- No need for manual mapping
- Easier to maintain

### 4. Updated Modal Options

#### New Enrollment Modal

Added all 11 form types as options:

- Users can now start with any form type
- Each form has proper labels matching the actual forms

#### Event Type Selection Modal

All 11 event types available:

- Users can add any type of event/form
- Consistent naming across the application

### 5. Integration with Child Tracker

The program stages now sync with data from Child Tracker:

**When a girl from "In Housed Girls" view has a form added:**

1. TrackerCapture detects the form by matching name
2. Automatically marks that stage as completed
3. Moves the active indicator to the next incomplete stage
4. Updates the timeline with the new event

**Example Flow:**

```
Girl: Sarah Mwansa
Forms completed: initial-referral, child-overview

Timeline Display:
✅ Initial Referral (Completed)
✅ Child Overview & Background (Completed)
🔵 TKP Initial Assessment (Active - Next)
⭕ Medical Intake Assessment (Upcoming)
⭕ Academics & Literacy (Upcoming)
... (remaining stages)
```

## Technical Implementation

### Stage Object Structure

```javascript
{
  id: 'form-type-id',          // Unique identifier
  formType: 'form-type-id',    // Same as ID for simplicity
  name: 'Display Name',         // User-friendly name
  description: 'Description',   // Stage purpose
  completed: false,             // Updated from Firebase
  active: false                 // Next stage to complete
}
```

### Event Object Structure

```javascript
{
  id: 'unique-event-id',
  stageId: 'form-type-id',
  formType: 'Display Name',
  date: Date,
  status: 'completed'
}
```

## Benefits

### For Users

1. **Clear Progress Tracking** - See exactly which forms are completed
2. **Guided Workflow** - Active stage shows what to do next
3. **Complete Timeline** - All 11 stages visible in logical order
4. **Real Data** - Stages update based on actual Firebase forms

### For Developers

1. **Maintainable** - Form types are centralized in programStages
2. **Consistent** - Stage IDs match form types exactly
3. **Debuggable** - Console logs show stage updates
4. **Scalable** - Easy to add new form types

## Testing Checklist

- [ ] View a child's case in Tracker Capture
- [ ] Verify timeline shows all 11 stages
- [ ] Add a form (e.g., Medical Intake) from ChildTracker
- [ ] Return to Tracker Capture and refresh
- [ ] Verify the Medical Intake stage is marked as completed
- [ ] Verify the next stage (Academics & Literacy) is marked as active
- [ ] Click "Add Event" and verify all 11 form types are available
- [ ] Test New Enrollment with different form types
- [ ] Verify navigation to correct form

## Known Limitations

1. **Name Matching** - Relies on exact first name and last name match

   - Case-insensitive matching implemented
   - Trimming whitespace implemented
   - Date of Birth matching could be added for better accuracy

2. **Performance** - Fetches all forms for each type

   - Currently acceptable for moderate data
   - Could be optimized with indexed queries

3. **Real-time Updates** - Requires page refresh to see new forms
   - Could be enhanced with Firebase real-time listeners

## Future Enhancements

1. **Add Date of Birth Matching** - More accurate child identification
2. **Real-time Sync** - Auto-update timeline when forms are added
3. **Progress Percentage** - Show % completion for each child
4. **Stage Dependencies** - Require previous stages before allowing next
5. **Form Validation** - Ensure required forms are completed in order
6. **Batch Updates** - Update multiple children's stages at once
7. **Export Timeline** - Download progress report for each child

## Related Files

- `src/components/TrackerCapture.vue` - Main component
- `src/services/trackerService.js` - Case management service
- `src/services/formService.js` - Form data retrieval
- `src/components/ChildTracker.vue` - Source of form completion data

## Migration Notes

**No breaking changes** - The update is backward compatible:

- Old case data will still work
- Existing forms are automatically detected
- No database migration required

## Console Debug Messages

When viewing a case, you'll see:

```
Updating program stages for case: <caseId>
✅ Found initial-referral for Sarah Mwansa
✅ Found child-overview for Sarah Mwansa
Stage Initial Referral marked as completed
Stage Child Overview & Background marked as completed
Stage TKP Initial Assessment marked as active
```

## Conclusion

The updated program stages logic provides:

- ✅ Accurate representation of all 11 form types
- ✅ Dynamic updates based on real Firebase data
- ✅ Clear visual progress tracking
- ✅ Seamless integration with Child Tracker
- ✅ Maintainable and scalable architecture

This ensures the Tracker Capture component stays in sync with the actual forms completed for each child in the system.
