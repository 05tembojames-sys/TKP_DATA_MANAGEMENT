# Dashboard Form Integration Fix

## Problem

When clicking "View or Update" from TrackerCapture, the system was navigating to Dashboard but **not opening the actual form**. Users were seeing the Dashboard main view instead of the form they wanted to edit/complete.

## Root Cause

The Dashboard component was not handling the `openForm` query parameter that TrackerCapture was sending. The navigation logic was there in TrackerCapture, but Dashboard wasn't listening for it.

## Solution Implemented

### 1. Dashboard.vue Updates

**Added query parameter handling in `onMounted()`:**

```javascript
// Check for openForm query parameter from TrackerCapture
if (query.openForm) {
  console.log("📋 Dashboard received openForm query:", query.openForm);

  // Decode child data from query parameter
  if (query.childData) {
    try {
      const decodedChildData = JSON.parse(atob(query.childData));
      console.log("👶 Child data decoded:", decodedChildData);
      // Store in sessionStorage for form access
      sessionStorage.setItem(
        "selectedChildForForm",
        JSON.stringify(decodedChildData)
      );
    } catch (error) {
      console.error("Error decoding child data:", error);
    }
  }

  // Switch to data-entry view and open the specific form
  currentView.value = "data-entry";
  currentForm.value = query.openForm + "-new"; // e.g., 'child-overview-new'
  selectedFormType.value = query.openForm;

  console.log("✅ Switched to form:", currentForm.value);
}
```

**What this does:**

- Detects when Dashboard receives `openForm` query parameter
- Decodes the base64-encoded child data
- Stores child data in sessionStorage for form pre-population
- Switches to data-entry view
- Opens the specific form (e.g., 'child-overview-new')

### 2. ChildOverviewForm.vue Updates

**Added imports:**

```javascript
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
```

**Added router instance:**

```javascript
const router = useRouter();
```

**Added onMounted hook for pre-population:**

```javascript
onMounted(() => {
  console.log("📋 ChildOverviewForm mounted, checking for child data...");

  // Only pre-populate if NOT in edit mode
  if (!props.isEditMode) {
    const storedChildData = sessionStorage.getItem("selectedChildForForm");

    if (storedChildData) {
      try {
        const childData = JSON.parse(storedChildData);
        console.log("👶 Found child data in sessionStorage:", childData);

        // Only populate if this is a child-overview form
        if (childData.formType === "child-overview") {
          // Pre-populate basic child information
          if (childData.childFirstName) {
            formData.childFirstName = childData.childFirstName;
            formData.childName =
              childData.childName || childData.childFirstName;
          }
          if (childData.childSurname) {
            formData.childSurname = childData.childSurname;
          }
          if (childData.dateOfBirth) {
            formData.dateOfBirth = childData.dateOfBirth;
          }
          if (childData.age) {
            formData.ageAtIntake = childData.age;
          }
          if (childData.gender) {
            formData.gender = childData.gender;
          }
          if (childData.caseId) {
            formData.id = childData.caseId;
            formData.childId = childData.caseId;
          }

          // Set current date as admission date if not already set
          if (!formData.dateOfAdmission) {
            formData.dateOfAdmission = new Date().toISOString().split("T")[0];
          }

          console.log("✅ Form pre-populated with child data");
          success(`Form pre-populated for ${childData.childName}`);
        }
      } catch (error) {
        console.error("Error parsing child data from sessionStorage:", error);
      }
    }
  }
});
```

**What this does:**

- Checks sessionStorage for child data when form loads
- Pre-populates form fields with child information (name, DOB, gender, etc.)
- Only pre-populates if NOT in edit mode (to avoid conflicts)
- Shows success message to user

**Added navigation back to TrackerCapture after save:**

```javascript
// Check if we should navigate back to TrackerCapture
const storedChildData = sessionStorage.getItem("selectedChildForForm");
if (storedChildData) {
  try {
    const childData = JSON.parse(storedChildData);
    if (childData.returnTo === "tracker-capture") {
      console.log("🔙 Returning to TrackerCapture...");
      // Clear sessionStorage
      sessionStorage.removeItem("selectedChildForForm");
      // Navigate back to tracker capture
      router.push("/tracker-capture");
      return; // Exit early, don't reset form
    }
  } catch (error) {
    console.error("Error checking return destination:", error);
  }
}
```

**What this does:**

- After form submission, checks if we came from TrackerCapture
- If yes, navigates back to TrackerCapture
- Clears sessionStorage to avoid conflicts
- Provides seamless workflow: TrackerCapture → Form → TrackerCapture

## Complete Flow

1. **User clicks "Complete [Form] Form" or "View/Update [Form] Form" in TrackerCapture**

   - TrackerCapture stores child data in sessionStorage
   - Navigates to `/dashboard?openForm=child-overview&childData=[base64]`

2. **Dashboard receives navigation**

   - onMounted detects `openForm` query parameter
   - Decodes and stores child data in sessionStorage
   - Switches to data-entry view
   - Opens the specific form (e.g., 'child-overview-new')

3. **Form component loads**

   - onMounted checks sessionStorage for child data
   - Pre-populates form fields with child information
   - User sees form ready to complete/edit

4. **User submits form**
   - Form saves to Firebase
   - Checks if returnTo === 'tracker-capture'
   - Navigates back to TrackerCapture
   - User sees updated program stages

## Data Flow Diagram

```
TrackerCapture
    │
    ├─ Child Data → sessionStorage
    │
    ├─ Navigate → /dashboard?openForm=child-overview&childData=[base64]
    │
    ▼
Dashboard
    │
    ├─ Detect openForm query
    │
    ├─ Decode & store child data
    │
    ├─ Switch to data-entry view
    │
    ├─ Open form component
    │
    ▼
ChildOverviewForm
    │
    ├─ onMounted → Check sessionStorage
    │
    ├─ Pre-populate form fields
    │
    ├─ User completes/edits form
    │
    ├─ Submit → Save to Firebase
    │
    ├─ Check returnTo
    │
    ├─ Navigate back to TrackerCapture
    │
    ▼
TrackerCapture
    │
    └─ Refresh program stages
```

## Testing

To test the fix:

1. Go to TrackerCapture (`/tracker-capture`)
2. Click on any child case
3. In Program Timeline, click "Complete Child Overview Form" (or "View/Update" if already completed)
4. **Expected:** Dashboard opens with Child Overview Form showing, pre-populated with child's name, DOB, etc.
5. Complete and submit the form
6. **Expected:** Navigate back to TrackerCapture with updated program stages

## Next Steps

The same pattern should be applied to ALL other form components:

- InitialReferralForm.vue
- InitialAssessmentForm.vue
- MedicalIntakeForm.vue
- AcademicsLiteracyForm.vue (if exists)
- PsychologicalAssessmentForm.vue (if exists)
- LifeSkillsSurveyForm.vue (if exists)
- BirthDeliveryForm.vue (if exists)
- CarePlanSummaryForm.vue (if exists)
- CarePlanBabyForm.vue (if exists)
- CarePlanOngoingLifeSkillsForm.vue (if exists)

Each form needs:

1. Import `onMounted` and `useRouter`
2. Create router instance
3. Add onMounted hook to check sessionStorage and pre-populate
4. Add navigation back to TrackerCapture after save

## Files Modified

1. `src/components/Dashboard.vue`

   - Updated onMounted to handle openForm query parameter
   - Added child data decoding and storage
   - Added automatic form opening logic

2. `src/components/ChildOverviewForm.vue`
   - Added onMounted import
   - Added useRouter import
   - Created router instance
   - Added onMounted hook for pre-population
   - Added navigation back to TrackerCapture after save
