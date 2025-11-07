# Duplicate Forms Cleanup Guide

## Problem Solved
Forms were showing as "draft" status even after being submitted because:
- Auto-save created draft documents
- Form submission created new submitted documents
- Old drafts remained in the database

## Solution Implemented

### 1. Form Submission Fix ✅
Updated form submission to **update existing drafts** instead of creating new documents:
- `saveInitialReferral()` now accepts `draftId` parameter
- `saveChildOverview()` now accepts `draftId` parameter
- `saveInitialAssessment()` now accepts `draftId` parameter
- `saveMedicalIntakeAssessment()` now accepts `draftId` parameter

### 2. Duplicate Removal Tool ✅
Created comprehensive cleanup utility that:
- Scans all forms in the database
- Groups forms by child (name + date of birth)
- Identifies duplicates within each group
- Keeps only the latest submitted version
- Removes all old drafts when submitted version exists
- Removes duplicate submitted versions (keeps newest)

## How to Use

### Option 1: System Management UI (Recommended)

1. **Navigate to System Management**
   - Go to System Management page
   - Click on **Database Management** section

2. **Run Duplicate Cleanup**
   - Click **"Remove Duplicates"** button
   - Review the preview showing:
     - Total forms scanned
     - Number of duplicates found
     - What will be deleted
   - Confirm to proceed with cleanup

3. **Review Results**
   - See how many duplicates were removed
   - Database stats will refresh automatically
   - Action is logged in system logs

### Option 2: Browser Console (Advanced)

1. **Open Browser DevTools** (F12)

2. **Preview Duplicates** (Safe - doesn't delete anything)
   ```javascript
   window.previewDuplicates()
   ```
   This will show you what duplicates exist without deleting anything.

3. **Clean Up Duplicates**
   ```javascript
   window.cleanupDuplicateForms()
   ```
   This will remove the duplicates.

## What Gets Deleted

### Scenario 1: Submitted + Drafts
**Example:** Child has 1 submitted form + 3 draft forms
- ✅ **Keep:** Latest submitted form
- ❌ **Delete:** All 3 draft forms

### Scenario 2: Multiple Submitted Forms
**Example:** Child has 3 submitted forms
- ✅ **Keep:** Newest submitted form
- ❌ **Delete:** 2 older submitted forms

### Scenario 3: Multiple Drafts Only
**Example:** Child has 3 draft forms (no submitted)
- ✅ **Keep:** Latest draft
- ❌ **Delete:** 2 older drafts

## Safety Features

1. **Two-Step Confirmation**
   - First: Confirm you want to scan
   - Second: Review preview and confirm deletion

2. **Preview Before Delete**
   - See exactly what will be deleted
   - Statistics on duplicates found
   - Can cancel at any time

3. **Activity Logging**
   - All cleanup actions logged
   - Shows who performed cleanup
   - Shows number of items deleted

4. **Smart Grouping**
   - Forms grouped by child identity
   - Form types kept separate
   - Only duplicates within same child/type are removed

## Preventing Future Duplicates

The system is now fixed to prevent new duplicates:

### ✅ Auto-Save Behavior
- Creates draft with `isDraft: true`
- Saves progress every 30 seconds
- Updates same document on each save

### ✅ Form Submission Behavior
- Checks if draft exists (via `draftId`)
- Updates existing draft to submitted status
- Changes `status: "draft"` → `status: "submitted"`
- Sets `isDraft: false`
- No new document created

### ✅ Result
- One form document per submission
- No duplicate drafts
- No duplicate submitted forms
- Clean database

## Technical Details

### Files Modified
1. `src/services/formService.js`
   - Updated save methods to accept `draftId`
   - Update existing drafts instead of creating new

2. `src/components/InitialReferralForm.vue`
   - Pass `draftId` to save method
   - No longer deletes draft after submission

3. `src/components/ChildOverviewForm.vue`
   - Pass `draftId` to save method
   - No longer deletes draft after submission

4. `src/components/InitialAssessmentForm.vue`
   - Pass `draftId` to save method

### Files Created
1. `src/utils/cleanupDuplicateForms.js`
   - Main cleanup utility
   - Preview function
   - Smart duplicate detection

2. `src/components/SystemManagement.vue`
   - Added "Remove Duplicates" button
   - Added cleanup function
   - Added loading states

## Recommendations

1. **Run cleanup now** to remove existing duplicates
2. **Monitor form status** to ensure all new submissions show as "submitted"
3. **Check database stats** after cleanup to see improvement
4. **Keep backups** before running cleanup (optional but recommended)

## Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Review system logs in System Management
3. Verify forms have correct status in Forms Dashboard
4. Contact system administrator if problems persist

---

**Last Updated:** Nov 7, 2025
**Version:** 1.0.0
