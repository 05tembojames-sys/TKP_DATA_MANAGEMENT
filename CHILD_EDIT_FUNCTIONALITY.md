# Child Edit Functionality Implementation

## Overview

Implemented the ability to edit child records from the Child Tracker interface. When a user clicks "Edit Child", the system now opens the appropriate form (Child Overview or Initial Assessment) pre-populated with the child's existing data.

## Key Changes

### 1. ChildTracker.vue

- Added reactive references for edit mode:

  - `showEditForm` - Controls visibility of the edit form
  - `childToEdit` - Stores the child data being edited
  - `editingFormType` - Tracks which form type is being edited ('child-overview' or 'initial-assessment')

- **Enhanced `editChild()` function**:

  - Now an async function that fetches the actual form document from Firestore
  - Matches the form by child's name and date of birth
  - Ensures the correct form ID is used for updating
  - Prevents the "No document to update" error by using the proper Firestore document ID

- **Added edit form handlers**:

  - `closeEditForm()` - Closes the edit form and resets state
  - `handleEditFormSaved()` - Handles successful save and reloads children data

- **Template updates**:
  - Added fullscreen edit form components for both ChildOverviewForm and InitialAssessmentForm
  - Conditionally renders forms based on `editingFormType`
  - Passes `isEditMode` and `editData` props to form components

### 2. ChildOverviewForm.vue

- **Added props support**:

  - `editData` - Object containing the existing form data to populate
  - `isEditMode` - Boolean flag indicating if the form is in edit mode

- **Implemented watch function**:

  - Watches for changes in `editData` prop
  - Automatically populates all form fields when edit data is provided
  - Handles nested objects (reasons, caregivers, biological parents, documents)
  - Handles arrays (siblings, additionalFamily)
  - Runs immediately when component mounts

- **Updated `handleSubmit()` function**:
  - Skips duplicate check when in edit mode (only checks for new records)
  - Calls `FormService.updateChildOverview()` for updates
  - Calls `FormService.saveChildOverview()` for new records
  - Emits `isEdit` flag in the form-saved event
  - Shows appropriate success message ("updated" vs "saved")
  - Only resets form after creating new records, not when editing

### 3. formService.js

- **Added `updateChildOverview()` method**:
  - Accepts formId and formData parameters
  - Uses Firestore's `updateDoc()` to update existing documents
  - Updates the `updatedAt` timestamp
  - Returns success status with the form ID

## How It Works

### Edit Flow:

1. User clicks "Edit Child" button in the Child Tracker
2. `editChild()` is called with the child's data
3. Function determines which form type to edit (child-overview or initial-assessment)
4. Fetches all forms of that type from Firestore
5. Finds the matching form by comparing child's name and date of birth
6. Updates the child data with the correct Firestore document ID
7. Sets `showEditForm` to true and passes data to the form component
8. Form component's watch function populates all fields with existing data
9. User makes changes and clicks "Save Care Plan"
10. Form validates and calls `updateChildOverview()` with the correct form ID
11. Firestore updates the document
12. Success message shows and child list refreshes

### Data Matching:

The system matches children to forms using:

- **Primary match**: First name + Surname + Date of Birth (exact match)
- **Fallback**: First name + Surname only (if DOB differs)
- Names are normalized (trimmed, lowercase) for better matching

## Benefits

### For Users:

- **Easy editing**: Click edit button to modify existing child records
- **No duplication**: System updates existing record instead of creating duplicates
- **Data preservation**: All existing data is preserved and pre-filled
- **Validation**: Same validation rules apply as when creating new records

### For Data Integrity:

- **Correct document IDs**: System fetches and uses actual Firestore document IDs
- **Proper updates**: Uses Firestore's `updateDoc()` for atomic updates
- **Timestamp tracking**: Automatically updates `updatedAt` field
- **No duplicate checks**: Skips duplication validation when editing existing records

## Technical Details

### Props Pattern:

```javascript
const props = defineProps({
  editData: {
    type: Object,
    default: null,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});
```

### Watch Implementation:

```javascript
watch(
  () => props.editData,
  (newEditData) => {
    if (newEditData && props.isEditMode) {
      // Populate all form fields
      Object.keys(formData).forEach((key) => {
        // Handle different data types appropriately
      });
    }
  },
  { immediate: true }
);
```

### Update vs Save Logic:

```javascript
if (props.isEditMode && props.editData?.id) {
  // Update existing record
  result = await FormService.updateChildOverview(
    props.editData.id,
    submissionData
  );
} else {
  // Create new record
  result = await FormService.saveChildOverview(submissionData);
}
```

## Testing Checklist

- [ ] Edit button appears for children with child-overview or initial-assessment forms
- [ ] Clicking edit opens the correct form type
- [ ] All form fields are pre-populated with existing data
- [ ] Changes can be saved successfully
- [ ] Updated data appears in the child tracker after saving
- [ ] No duplicate records are created
- [ ] Success message shows "updated" instead of "saved"
- [ ] Form closes automatically after successful update
- [ ] Child list refreshes to show updated information

## Future Enhancements

1. **Edit other form types**: Extend edit functionality to medical intake, assessments, etc.
2. **Version history**: Track changes and show revision history
3. **Field-level changes**: Highlight which fields were modified
4. **Audit trail**: Log who made changes and when
5. **Conflict resolution**: Handle concurrent edits by multiple users
6. **Partial updates**: Allow editing specific sections without full form validation

## Notes

- The edit functionality currently only works for child-overview and initial-assessment forms
- Other form types can be added using the same pattern
- The system uses the child's name and DOB to match forms, so accurate data entry is important
- Form validation is the same for both create and edit modes
