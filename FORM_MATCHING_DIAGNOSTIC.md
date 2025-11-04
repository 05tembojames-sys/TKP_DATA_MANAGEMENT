# Form Matching Diagnostic Guide

## Issue: Academics & Literacy Form Not Showing in TrackerCapture

### How Form Matching Works

TrackerService groups forms by child using:
1. **Child's First Name** (`childFirstName`)
2. **Child's Surname** (`childSurname`) 
3. **Date of Birth** (`dateOfBirth`) - for precise matching

### What Was Fixed

The `saveAcademicsLiteracyPlan` function (lines 258-267) now:
- Parses `nameOfGirl` field (e.g., "Maria Santos")
- Extracts `childFirstName` = "Maria"
- Extracts `childSurname` = "Santos"
- Adds these fields to the saved form

### Troubleshooting Steps

#### 1. Check Console Logs

Open browser DevTools (F12) and look for:

```
Raw form results: {
  ...
  academicsLiteracy: X  // Should be > 0 if form was saved
}
```

#### 2. Verify Name Matching

The child's name in **ALL forms must match exactly**:

**Child Overview Form:**
- `childFirstName`: "Maria"
- `childSurname`: "Santos"

**Academics & Literacy Form:**
- `nameOfGirl`: "Maria Santos"
- Auto-generated: `childFirstName`: "Maria", `childSurname`: "Santos"

**Common Issues:**
- ❌ Different spelling: "Maria" vs "Mary"
- ❌ Extra spaces: "Maria Santos" vs "Maria  Santos"
- ❌ Missing last name: "Maria" (no surname)
- ❌ Different name order: "Santos Maria" vs "Maria Santos"

#### 3. Check Firebase Data

Go to Firebase Console → Firestore → `forms` collection:

Find the Academics & Literacy form and verify:
```json
{
  "formType": "academics-literacy",
  "nameOfGirl": "Maria Santos",
  "childFirstName": "Maria",     ← Should be present
  "childSurname": "Santos",       ← Should be present
  "dateOfBirth": "2010-05-15",    ← Should match Child Overview
  "createdAt": "...",
  "status": "completed"
}
```

#### 4. Manual Fix for Existing Forms

If you submitted the form BEFORE this fix, the old form won't have `childFirstName` and `childSurname`. 

**Options:**
1. **Re-submit the form** - The new submission will include the fields
2. **Manually add fields in Firebase**:
   - Go to Firebase Console
   - Find the form document
   - Click "Add field"
   - Add `childFirstName` and `childSurname`

#### 5. Test with Console Commands

In browser console:

```javascript
// Check what forms are being loaded
const formService = new FormService();
formService.getForms('academics-literacy', 100).then(result => {
  console.log('Academics forms:', result.forms);
  result.forms.forEach(form => {
    console.log({
      id: form.id,
      nameOfGirl: form.nameOfGirl,
      childFirstName: form.childFirstName,
      childSurname: form.childSurname,
      dateOfBirth: form.dateOfBirth
    });
  });
});
```

### Solution Summary

**For NEW forms** (submitted after fix):
✅ Should work automatically

**For OLD forms** (submitted before fix):
You need to either:
1. Re-submit the form, OR
2. Manually add `childFirstName` and `childSurname` fields in Firebase

### Expected Result

After fix, when you:
1. Submit Academics & Literacy form with "Maria Santos"
2. Refresh TrackerCapture
3. Select Maria Santos
4. View Program Stages

You should see:
```
✓ Initial Referral - Completed
✓ Child Overview & Background - Completed
✓ TKP Initial Assessment - Completed
✓ Academics & Literacy - Completed  ← Now shows!
○ Psychological Assessment - Pending
...
```

### Still Not Working?

Check:
1. Child's name matches EXACTLY in Child Overview
2. Form has `formType: "academics-literacy"`
3. Form has `childFirstName` and `childSurname` fields
4. Console shows form being loaded
5. TrackerService log shows child being included (not skipped)
