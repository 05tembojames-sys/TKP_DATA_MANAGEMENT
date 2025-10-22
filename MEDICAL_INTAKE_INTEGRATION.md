# Medical Intake Form Integration Guide

## Overview

This document describes the integration of the Medical Intake Assessment Form into the TKP Data Management System, specifically for the "In Housed Girls - Complete Forms Only" section.

## Changes Made

### 1. Backend Service Updates (`src/services/formService.js`)

#### Added New Method: `saveMedicalIntakeAssessment()`

```javascript
async saveMedicalIntakeAssessment(formData) {
  // Saves medical intake assessment forms to Firebase Firestore
  // Form type: 'medical-intake'
  // Status: 'completed' (auto-set on submission)
}
```

#### Updated Form Statistics

- Modified `getFormStatistics()` to include medical intake forms count
- Added `totalMedicalIntakes` to statistics object
- Now fetches data from 4 form types instead of 3

#### Updated Analytics Data

- Modified `getAnalyticsData()` to include medical intake forms
- Added `totalMedicalIntakes` to analytics object
- Updated `formsByType` to include 'medical-intake' category

#### Updated Helper Methods

- Modified `getFormTypeDisplayName()` to return "Medical Intake" for 'medical-intake' form type

### 2. Child Tracker Updates (`src/components/ChildTracker.vue`)

#### Updated Form Type Names

- Added 'medical-intake': 'Medical Intake Assessment' to form type mapping

#### Modified Data Loading

- Updated `loadChildren()` function to fetch medical intake forms
- Now loads 4 form types: initial-referral, child-overview, initial-assessment, and medical-intake

#### Updated Complete Forms Filter

- Modified the `showOnlyComplete` filter to require ALL FOUR forms:
  - Initial Child Referral
  - Child Overview and Background
  - TKP Initial Assessment
  - **Medical Intake Assessment** (NEW)

### 3. Dashboard Updates (`src/components/Dashboard.vue`)

#### Added Medical Intake Form Import

```javascript
import MedicalIntakeForm from "./MedicalIntakeForm.vue";
```

#### Added to Available Forms List

- Added 'Medical Intake Assessment Forms' to the forms navigation tabs

#### Added Form Display Sections

1. **Medical Intake Forms List**: Displays all medical intake assessment forms
2. **New Medical Intake Form**: Allows creation of new medical intake assessments

#### Updated Form Saved Handler

- Modified `handleFormSaved()` to handle medical-intake form type
- Redirects to medical-intake-list after successful save

## How to Use the Medical Intake Form

### For "In Housed Girls - Complete Forms Only"

1. **Navigate to Dashboard**

   - Click on "In Housed Girls" button (child-tracker-2 view)

2. **Filter Requirements**

   - Only girls with ALL FOUR forms will be displayed:
     - ✓ Initial Child Referral Form
     - ✓ Child Overview and Background Form
     - ✓ TKP Initial Assessment Form
     - ✓ Medical Intake Assessment Form (NEW)

3. **Adding a Medical Intake Form**
   - Go to Dashboard
   - Click "Data Entry / Forms"
   - Select "Medical Intake Assessment Forms" tab
   - Click "Add New Medical Intake Assessment"
   - Complete all 9 sections of the form
   - Submit the form

### Form Sections

The Medical Intake Assessment Form includes:

1. **Child's Information** - Basic identification
2. **Biological Parents Information** - Mother, father, and relationship status
3. **Other Biological Children** - Siblings information
4. **Birth History** - Pregnancy, delivery, and birth details
5. **Growth and Development** - Feeding and milestones
6. **Medical History** - Conditions, hospitalizations, surgeries
7. **Medications** - Current medications and allergies
8. **Pregnancy Details** - If child is currently pregnant (optional)
9. **Form Completion** - Staff signature and date

### Required Fields

Key required fields include:

- Child First Name, Surname, Date of Birth
- Information Provider
- Biological Parents Status
- Birth Place
- Delivery type and location
- General health classification
- Hospitalizations, surgical operations, broken bones status
- Under-5 Card availability
- Completed by (staff name) and completion date

## Data Flow

### Saving a Medical Intake Form

```
MedicalIntakeForm.vue
  ↓ (form submission)
formService.saveMedicalIntakeAssessment()
  ↓ (save to Firebase)
Firestore Collection: 'forms'
  ↓ (with formType: 'medical-intake')
Success → Redirect to forms list
```

### Loading Forms for "In Housed Girls"

```
ChildTracker.vue (showOnlyComplete=true)
  ↓
loadChildren() fetches all 4 form types
  ↓
Groups forms by child (name + DOB)
  ↓
Filters for children with all 4 forms
  ↓
Displays in "In Housed Girls - Complete Forms Only"
```

## Database Structure

### Firestore Document Structure

```javascript
{
  formType: 'medical-intake',
  childFirstName: 'Jane',
  childSurname: 'Doe',
  dateOfBirth: '2010-05-15',
  // ... all form fields
  createdAt: Timestamp,
  updatedAt: Timestamp,
  status: 'completed'
}
```

## Testing the Integration

### Test Checklist

1. **Form Submission**

   - [ ] Can create new medical intake form
   - [ ] Form validation works correctly
   - [ ] Required fields are enforced
   - [ ] Form saves to Firebase successfully
   - [ ] Success message displays
   - [ ] Redirects to forms list

2. **Forms List**

   - [ ] Medical intake forms appear in list
   - [ ] Can view form details
   - [ ] Pagination works
   - [ ] Search/filter works

3. **Child Tracker Integration**

   - [ ] Medical intake forms load in Child Tracker
   - [ ] Forms are correctly associated with children
   - [ ] "In Housed Girls" filter works correctly
   - [ ] Only shows children with all 4 forms

4. **Analytics**
   - [ ] Medical intake count appears in statistics
   - [ ] Form type breakdown includes medical intake
   - [ ] Analytics charts update correctly

## Common Issues and Solutions

### Issue: Child not appearing in "In Housed Girls"

**Solution**: Ensure the child has all 4 forms with matching:

- childFirstName
- childSurname
- dateOfBirth

### Issue: Medical intake form not saving

**Solution**: Check that all required fields are filled:

- Child information (name, surname, DOB)
- Biological parents status
- Birth history details
- Medical history classifications
- Medications (Under-5 card status)
- Completion details (staff name, date)

### Issue: Form validation errors not clearing

**Solution**: The form has a `clearFieldError()` function that automatically clears errors when you type in a field.

## Future Enhancements

Potential improvements:

1. Add form editing capability
2. Add form deletion with confirmation
3. Add PDF export for medical intake forms
4. Add form versioning/history
5. Add medical history charts/visualizations
6. Add medication tracking over time
7. Add medical alerts/notifications

## Notes

- Medical intake forms are automatically set to 'completed' status upon submission
- The form has comprehensive validation with user-friendly error messages
- Progress tracking shows current section and overall completion percentage
- The form is fully responsive and mobile-friendly
- All form data is stored in Firebase Firestore for reliability and scalability

## Support

For questions or issues, please contact the development team or refer to:

- `src/components/MedicalIntakeForm.vue` - Form component
- `src/services/formService.js` - Backend service
- `src/components/ChildTracker.vue` - Child tracking logic
