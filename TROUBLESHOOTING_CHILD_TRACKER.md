# Troubleshooting: Girls Not Appearing in "In Housed Girls" View

## Problem

Girls who have completed both `Initial Assessment Form` and `Child Overview Form` are not appearing in the "In Housed Girls - Complete Forms Only" view.

## Debugging Steps

### 1. Check Browser Console

Open your browser's Developer Tools (F12) and go to the **Console** tab. You should see debug messages like:

```
Processing initial-assessment: { firstName: "mary", surname: "banda", dob: "2010-05-15", ... }
Processing child-overview: { firstName: "mary", surname: "banda", dob: "2010-05-15", ... }
All children loaded: 5
Child: Mary Banda, Forms: ["initial-assessment", "child-overview"]
Filtered from 5 to 1 children with both forms
```

### 2. Common Issues and Solutions

#### Issue A: Names Don't Match Exactly

**Problem:** The child's name in one form is "Mary" but in another it's "MARY" or "mary "
**Solution:** ✅ Already fixed - names are now trimmed and lowercased

**How to verify:**

- Look for messages like:
  ```
  Processing initial-assessment: { firstName: "mary", surname: "banda", ... }
  Processing child-overview: { firstName: "mary", surname: "banda", ... }
  ```
- The `firstName` and `surname` should match EXACTLY (both lowercase, trimmed)

#### Issue B: Date of Birth Format Mismatch

**Problem:** One form has date as "2010-05-15" and another as "15/05/2010"
**Solution:** Ensure both forms use the SAME date format

**How to check:**

1. Open browser console
2. Look for the `dob` value in the debug logs
3. Example of GOOD match:
   ```
   initial-assessment: { dob: "2010-05-15", ... }
   child-overview: { dob: "2010-05-15", ... }
   ```
4. Example of BAD match (won't work):
   ```
   initial-assessment: { dob: "2010-05-15", ... }
   child-overview: { dob: "15/05/2010", ... }  ❌ Different format!
   ```

#### Issue C: Missing Required Fields

**Problem:** One of the forms is missing `childFirstName`, `childSurname`, or `dateOfBirth`

**How to check:**
Look in console for messages like:

```
Processing initial-assessment: { firstName: "", surname: "banda", ... }  ❌ Missing first name!
```

### 3. Manual Verification

#### Step 1: Check Initial Assessment Form Data

1. Open Firebase Console
2. Go to Firestore Database
3. Navigate to the collection for `initial-assessment` forms
4. Find your child's record and verify:
   - ✅ `childFirstName` is filled
   - ✅ `childSurname` is filled
   - ✅ `dateOfBirth` is filled (format: YYYY-MM-DD)

#### Step 2: Check Child Overview Form Data

1. In Firestore, navigate to `child-overview` collection
2. Find the SAME child's record
3. Verify the values **EXACTLY match**:
   - ✅ `childFirstName` matches (case-insensitive, but same letters)
   - ✅ `childSurname` matches
   - ✅ `dateOfBirth` matches (EXACT same format)

### 4. Quick Fix Guide

If names/dates don't match:

**Option 1: Re-enter the form**

1. Go to Dashboard
2. Fill out either Initial Assessment or Child Overview form again
3. Make sure to enter the EXACT same name and date of birth

**Option 2: Edit in Firebase (Advanced)**

1. Open Firebase Console
2. Find the mismatched record
3. Edit the fields to match exactly
4. Refresh the Child Tracker page

### 5. Expected Console Output (Success)

When everything works, you should see:

```
Processing initial-assessment: { firstName: "mary", surname: "banda", dob: "2010-05-15", key: "mary-banda-2010-05-15" }
Processing child-overview: { firstName: "mary", surname: "banda", dob: "2010-05-15", key: "mary-banda-2010-05-15" }
All children loaded: 3
Child: Mary Banda, Forms: ["initial-assessment", "child-overview"]
Child: Jane Mwale, Forms: ["initial-referral"]
Child: Grace Phiri, Forms: ["child-overview"]
Filtered from 3 to 1 children with both forms
Filtered children: [{ name: "Mary Banda", forms: ["initial-assessment", "child-overview"] }]
```

## Still Not Working?

If you've checked all of the above and it still doesn't work:

1. **Clear browser cache** and reload
2. **Check the prop value**: Make sure `showOnlyComplete` is actually `true`
3. **Share the console output**: Copy all the debug messages from the console and share them

## Need Help?

Provide these details:

- Screenshot of browser console messages
- Screenshot of the child's data in both forms (from Firebase)
- The exact name and date of birth you entered
