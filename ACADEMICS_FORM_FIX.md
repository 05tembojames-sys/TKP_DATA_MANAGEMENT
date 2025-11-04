# Fix: Academics & Literacy Form Not Showing in TrackerCapture

## Problem
The Academics & Literacy form you added is not appearing in TrackerCapture stages because it was saved **before** the fix was applied.

## Root Cause
The AcademicsLiteracyForm uses `nameOfGirl` field instead of `childFirstName` and `childSurname`. The TrackerService requires these specific fields to match forms to children.

## Fix Applied
The `saveAcademicsLiteracyPlan` function in `formService.js` (lines 258-267) now:
1. Parses `nameOfGirl` into first and last name
2. Adds `childFirstName` and `childSurname` fields
3. Saves with proper fields for matching

## Solution for Existing Form

### Option 1: Re-enter the Form (Recommended)
1. Go to **ChildTracker** → "In Housed Girls"
2. Find the child you entered the Academics form for
3. Click "Manage Forms"
4. Click on "Academics & Literacy" again
5. Re-submit the form (it will now save with correct fields)

### Option 2: Manually Update the Database

If you want to keep the existing data, you need to add the missing fields to the database:

```javascript
// Find the form in Firebase Console:
// 1. Go to https://console.firebase.google.com
// 2. Select your project: tkp-dims
// 3. Navigate to Firestore Database
// 4. Find the 'forms' collection
// 5. Look for the document with formType = 'academics-literacy'
// 6. Add these fields:
//    - childFirstName: [First name from nameOfGirl]
//    - childSurname: [Last name from nameOfGirl]
```

## How to Verify It's Working

### 1. Check Console Logs
Open browser DevTools (F12) → Console tab → Look for:
```
Raw form results: {
  ...
  academicsLiteracy: 1 (or more)
}
```

### 2. Check in TrackerCapture
1. Go to Dashboard → "Tracker Capture"
2. Find the child
3. Click to view their details
4. Look at Program Stages section
5. "Academics & Literacy" should show ✓ if matched correctly

## Preventing Future Issues

### For ALL Other Forms
Make sure each form save function includes childFirstName and childSurname. Check these functions in `formService.js`:

- ✅ `saveAcademicsLiteracyPlan` - FIXED (lines 258-267)
- ⚠️ `savePsychologicalAssessment` - May need similar fix
- ⚠️ `saveLifeSkillsSurvey` - May need similar fix  
- ⚠️ `saveBirthDeliveryReport` - May need similar fix
- ⚠️ `saveCarePlanSummary` - May need similar fix
- ⚠️ `saveCarePlanBaby` - May need similar fix
- ⚠️ `saveCarePlanOngoingLifeSkills` - May need similar fix

## Testing Checklist

After re-entering the form:

- [ ] Form saves without errors
- [ ] Console shows form in academicsLiteracy count
- [ ] Child appears in TrackerCapture (if housed)
- [ ] "Academics & Literacy" stage shows as completed ✓
- [ ] Can view form data when clicking the stage

## Need Help?
If the form still doesn't appear after re-entering:
1. Check browser console for errors
2. Verify the child has BOTH Initial Assessment AND Child Overview forms
3. Verify the name matches exactly (including spelling)
4. Check Firebase to confirm the form was saved with `childFirstName` and `childSurname` fields
