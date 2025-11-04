# Academics & Literacy Form Tracking - Complete Fix

## Date: 2025-11-03

## Problem
Academics & Literacy forms were not showing up in TrackerCapture because the form was missing required matching fields:
- `childFirstName`
- `childSurname`
- `dateOfBirth`

## Solution Implemented

### 1. **formService.js** - Lines 255-290
Added logic to `saveAcademicsLiteracyPlan`:

```javascript
// Parse nameOfGirl field
const nameParts = (formData.nameOfGirl || '').trim().split(' ');
const childFirstName = nameParts[0] || '';
const childSurname = nameParts[nameParts.length - 1] || nameParts[0] || '';

// Get dateOfBirth from sessionStorage if not in form
let dateOfBirth = formData.dateOfBirth;
if (!dateOfBirth) {
  const storedChildData = sessionStorage.getItem('selectedChildForForm');
  if (storedChildData) {
    const childData = JSON.parse(storedChildData);
    dateOfBirth = childData.dateOfBirth;
  }
}

// Add fields to saved document
formDoc = {
  formType: "academics-literacy",
  ...formData,
  childFirstName: childFirstName,  // ← Added
  childSurname: childSurname,      // ← Added
  dateOfBirth: dateOfBirth,         // ← Added
  createdAt: new Date(),
  updatedAt: new Date(),
  status: "completed",
};
```

### 2. **ChildTracker.vue** - Lines 1853-1874
Updated `goToAcademicsLiteracyForm` to store child data in sessionStorage:

```javascript
const goToAcademicsLiteracyForm = (child = null) => {
  selectedChildForForms.value = child;
  
  // Store child data for form matching
  if (child) {
    const childData = {
      childFirstName: child.rawData?.childFirstName || child.fullName?.split(' ')[0] || '',
      childSurname: child.rawData?.childSurname || child.fullName?.split(' ').slice(-1)[0] || '',
      dateOfBirth: child.rawData?.dateOfBirth || child.dateOfBirth,
      childName: child.fullName,
      age: child.age,
      gender: child.gender,
      caseId: child.customId || child.uniqueId,
      formType: 'academics-literacy'
    };
    sessionStorage.setItem('selectedChildForForm', JSON.stringify(childData));
    console.log('📚 Stored child data for Academics & Literacy form:', childData);
  }
  
  showAcademicsLiteracyForm.value = true;
};
```

## How It Works Now

### Workflow:

1. **User clicks "Academics & Literacy" button** in ChildTracker
2. **Child data stored in sessionStorage** with name and DOB
3. **Form opens** and user fills it out
4. **On submit**, formService:
   - Parses `nameOfGirl` into `childFirstName` and `childSurname`
   - Retrieves `dateOfBirth` from sessionStorage
   - Saves form with all three matching fields
5. **TrackerService** can now match the form to the child
6. **TrackerCapture** displays the form as completed ✓

### Data Flow:

```
ChildTracker (child object)
  ↓
goToAcademicsLiteracyForm()
  ↓
sessionStorage.setItem('selectedChildForForm', ...)
  ↓
AcademicsLiteracyForm (user fills nameOfGirl)
  ↓
submitForm()
  ↓
FormService.saveAcademicsLiteracyPlan()
  ├── Parse nameOfGirl → childFirstName, childSurname
  ├── Get dateOfBirth from sessionStorage
  └── Save with all matching fields
  ↓
TrackerService.generateCasesFromForms()
  ├── Loads all forms including academics-literacy
  ├── Groups by childFirstName + childSurname + dateOfBirth
  └── Matches form to child ✓
  ↓
TrackerCapture displays: ✓ Academics & Literacy - Completed
```

## Testing

### Test New Form Submission:

1. Open ChildTracker → "In Housed Girls"
2. Select a housed child
3. Click "Manage Forms" → "Academics & Literacy"
4. Check browser console for: `📚 Stored child data for Academics & Literacy form:`
5. Fill out form with child's name (e.g., "Maria Santos")
6. Submit form
7. Check console for successful save
8. Refresh TrackerCapture
9. Select the child
10. **Result**: Should see ✓ next to "Academics & Literacy" stage

### Verify Console Logs:

```
📚 Stored child data for Academics & Literacy form: 
{
  childFirstName: "Maria",
  childSurname: "Santos",
  dateOfBirth: "2010-05-15",
  ...
}

Raw form results: {
  ...
  academicsLiteracy: 1  // Should increment
}

Including housed child: Maria Santos
```

## Old Forms Already Submitted

**For forms submitted BEFORE this fix:**

The old form won't have the matching fields. You need to either:

### Option 1: Re-submit (Recommended)
1. Go to ChildTracker
2. Select the child
3. Click "Academics & Literacy" → "View/Edit"
4. Re-submit the form

### Option 2: Manual Fix in Firebase
1. Go to Firebase Console → Firestore
2. Find the `forms` collection
3. Locate the academics-literacy document
4. Add three fields manually:
   - `childFirstName`: (first name)
   - `childSurname`: (last name)
   - `dateOfBirth`: (in YYYY-MM-DD format)

## Success Criteria

✅ When you submit a NEW Academics & Literacy form:
- Console shows "📚 Stored child data..."
- Form saves successfully
- TrackerCapture refresh shows the form as completed
- Program stages show ✓ next to "Academics & Literacy"

✅ Console logs show:
- Form count increases in "academicsLiteracy: X"
- Child is "Including housed child: [name]" (not skipped)
- No matching errors

## Notes

- This fix applies to ALL new Academics & Literacy form submissions
- The same pattern should be applied to other forms that use different field names
- Always ensure child data is stored in sessionStorage before opening forms
- Matching requires exact name match (case-insensitive) and same date of birth
