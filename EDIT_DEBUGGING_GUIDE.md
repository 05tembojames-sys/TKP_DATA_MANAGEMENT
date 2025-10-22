# Child Edit Functionality - Debugging Guide

## Current Issue

Getting error: `No document to update: projects/tkp-dims/databases/(default)/documents/forms/67577655`

## Root Cause

The form ID being used doesn't exist in Firestore. This happens when:

1. The child's `rawData.id` is from a different form type (e.g., referral instead of overview)
2. The form was deleted but the child record still references it
3. There's a data inconsistency between the tracker and forms collection

## Enhanced Debugging (Latest Changes)

### What to Check in Console:

When you click "Edit Child", you should see these logs:

```javascript
// 1. Initial child data
Edit child: { id, uniqueId, fullName, formTypes, rawData, ... }
Child rawData: { childFirstName, childSurname, dateOfBirth, id, ... }
Child formTypes: ["child-overview", ...]

// 2. Which form type we're editing
Editing form type: "child-overview"

// 3. All forms fetched from Firestore
Fetched forms result: { success: true, forms: [...] }

// 4. Comparison for each form
Comparing: {
  form: { firstName: "...", surname: "...", dob: "...", id: "actual-firestore-id" },
  child: { firstName: "...", surname: "...", dob: "..." }
}

// 5. Match result
✅ Found matching form with ID: "correct-firestore-id"
// OR
❌ Could not find matching form!
Available forms: [{ id, name, dob }, ...]
```

### What Should Happen:

**Success Path:**

1. System fetches all child-overview forms
2. Finds exact match by name + DOB
3. Uses that form's actual Firestore ID
4. Updates the correct document
5. Shows "updated successfully" message

**Failure Scenarios:**

#### Scenario 1: No Matching Form Found

```
❌ Could not find matching form!
Available forms: [...]
Alert: "Could not find the form to edit..."
```

**Solution**: Check if the child's name/DOB in tracker matches what's in the form

#### Scenario 2: Form ID Still Wrong

```
✅ Found matching form with ID: "xyz123"
Error updating: No document to update
```

**Solution**: The found ID doesn't exist in Firestore - data corruption issue

#### Scenario 3: Multiple Forms Match

```
Multiple forms with same name/DOB
Using first match (might be wrong one)
```

**Solution**: Need to add more unique identifiers

## Testing Steps

### Step 1: Open Browser Console

Press F12 to open DevTools and go to Console tab

### Step 2: Click "Edit Child"

Look for the debug logs in console

### Step 3: Analyze the Logs

**Check 1: Does the child have form types?**

```javascript
Child formTypes: ["child-overview"]  // ✅ Good
Child formTypes: []                   // ❌ Bad - no forms
```

**Check 2: Were forms fetched successfully?**

```javascript
Fetched forms result: { success: true, forms: [10 items] }  // ✅ Good
Fetched forms result: { success: false, error: "..." }      // ❌ Bad
```

**Check 3: Was a match found?**

```javascript
✅ Found matching form with ID: "abc123"  // ✅ Good
❌ Could not find matching form!          // ❌ Bad
```

**Check 4: Does the form ID exist in Firestore?**
Go to Firebase Console → Firestore → forms collection
Search for the ID shown in the logs

- If found: ✅ Good, should work
- If not found: ❌ Data inconsistency

### Step 4: Try to Save

After form opens and is populated:

1. Make a small change
2. Click "Save Care Plan"
3. Check console for:

```javascript
Updating form with ID: "xyz123"
Edit data: { formId: "xyz123", ... }
```

## Common Issues & Solutions

### Issue 1: "Could not find matching form"

**Cause**: Name or DOB mismatch between tracker and form

**Debug**:

```javascript
// In console, check:
console.log(
  "Child name:",
  child.rawData.childFirstName,
  child.rawData.childSurname
);
console.log("Child DOB:", child.rawData.dateOfBirth);
// Compare with available forms list
```

**Fix Options**:

1. Manually update the form to match
2. Manually update the tracker data
3. Use the "Available forms" list to identify correct form

### Issue 2: "No document to update"

**Cause**: Form ID doesn't exist in Firestore

**Debug**:

1. Copy the form ID from error message
2. Go to Firestore console
3. Search in forms collection
4. If not found → data corruption

**Fix Options**:

1. Create new form (don't edit, create new)
2. Manually fix the form ID in the database
3. Delete and recreate the child record

### Issue 3: Form opens but fields are empty

**Cause**: Watch function not triggering or editData not set properly

**Debug**:

```javascript
// Check in console:
Form populated with edit data: Proxy(Object)  // ✅ Good
// Nothing logged → ❌ Watch not triggering
```

**Fix**: Check that `isEditMode` prop is true and `editData` is not null

## Manual Data Verification

### In Firebase Console:

1. Go to Firestore Database
2. Navigate to `forms` collection
3. Filter by `formType` == "child-overview"
4. Find the child by name
5. Note the document ID (top of the page)
6. Compare with ID being used in the app

### In Browser Console:

```javascript
// Get all child-overview forms
const formService = await import("./services/formService.js");
const result = await formService.default.getForms("child-overview", 1000);
console.table(
  result.forms.map((f) => ({
    id: f.id,
    name: `${f.childFirstName} ${f.childSurname}`,
    dob: f.dateOfBirth,
  }))
);
```

## Next Steps Based on Console Output

### If you see: "❌ Could not find matching form!"

**Action**: Send me the "Available forms" list and the child's name/DOB
I'll help identify the mismatch

### If you see: "✅ Found matching form" but still get update error

**Action**: Send me the form ID from the log
We'll verify it exists in Firestore

### If you see nothing (no logs at all)

**Action**: The editChild function might not be running
Check that the Edit button is properly wired up

## Emergency Workaround

If editing continues to fail, temporary workaround:

1. Note down all the child's information
2. Delete the child from the tracker (if possible)
3. Create a new Child Overview form with the information
4. This creates a fresh, clean record

## Contact Points

When reporting the issue, please provide:

1. Full console log output (all the debug messages)
2. Child's name and DOB you're trying to edit
3. Screenshot of the error
4. Screenshot of Firestore showing the forms collection
