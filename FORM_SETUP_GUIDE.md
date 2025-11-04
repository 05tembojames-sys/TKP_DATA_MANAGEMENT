# Form Data Management Setup Guide

## Overview

This guide explains how to use the new form saving and viewing functionality in your TKP Data Management application.

## New Components Created

### 1. **FormDataDisplay.vue**
A reusable component that displays form data in a formatted, human-readable layout instead of JSON.

**Features:**
- Organized sections (Child Info, Pregnancy Info, Medical Info, etc.)
- Beautiful styling with gradient headers
- Status badges showing form status (Draft, Completed, Pending)
- Table view for complex data like family members
- Responsive design for mobile devices
- Auto-formats dates and displays data intelligently

**Usage:**
```vue
<template>
  <FormDataDisplay :form="formData" @close="handleClose" />
</template>

<script setup>
import FormDataDisplay from '@/components/FormDataDisplay.vue';

const formData = ref({
  formType: 'initial-assessment',
  childFirstName: 'John',
  childSurname: 'Doe',
  dateOfBirth: '2010-05-15',
  age: 14,
  // ... other form fields
});

const handleClose = () => {
  // Handle close event
};
</script>
```

### 2. **SavedFormsList.vue**
A component that lists all saved forms with search and filter capabilities.

**Features:**
- Search forms by child name or form type
- Filter by form type
- View form details in a modal
- Edit saved forms
- Delete forms with confirmation
- Shows form status, creation date, and key details
- Responsive grid layout

**Usage:**
```vue
<template>
  <SavedFormsList 
    :formType="specificFormType"
    @edit-form="handleEditForm"
  />
</template>

<script setup>
import SavedFormsList from '@/components/SavedFormsList.vue';

const handleEditForm = (form) => {
  console.log('Editing form:', form);
  // Navigate to edit form or load form data
};
</script>
```

## Integration Steps

### Step 1: Import Components in Your Page/View

```vue
<script setup>
import FormDataDisplay from '@/components/FormDataDisplay.vue';
import SavedFormsList from '@/components/SavedFormsList.vue';
</script>
```

### Step 2: Add to Your Dashboard or Forms Management Page

```vue
<template>
  <div class="forms-management">
    <!-- Forms List Section -->
    <SavedFormsList 
      @edit-form="selectFormForEdit"
    />
    
    <!-- View Form Modal -->
    <div v-if="showFormView" class="modal">
      <FormDataDisplay 
        :form="selectedForm"
        @close="showFormView = false"
      />
    </div>
  </div>
</template>
```

## Form Service Methods

The existing `formService.js` already has all necessary methods:

### Saving Forms
```javascript
// Save Initial Assessment
await FormService.saveInitialAssessment(formData);

// Save Medical Intake
await FormService.saveMedicalIntakeAssessment(formData);

// Save Child Overview
await FormService.saveChildOverview(formData);

// Save Initial Referral
await FormService.saveInitialReferral(formData);

// Save Academics & Literacy Plan
await FormService.saveAcademicsLiteracyPlan(formData);

// Save Psychological Assessment
await FormService.savePsychologicalAssessment(formData);

// Save Life Skills Survey
await FormService.saveLifeSkillsSurvey(formData);

// Save Birth & Delivery Report
await FormService.saveBirthDeliveryReport(formData);

// Save Care Plans
await FormService.saveCarePlanSummary(formData);
await FormService.saveCarePlanBaby(formData);
```

### Retrieving Forms
```javascript
// Get all forms of a specific type
const result = await FormService.getForms('initial-assessment', 100);
// result = { success: true, forms: [...], hasMore: boolean }

// Get form by ID
const result = await FormService.getFormById(formId);
// result = { success: true, form: {...} }

// Get forms by case ID
const result = await FormService.getFormsByCaseId(caseId, formType);
// result = { success: true, forms: [...] }
```

### Updating and Deleting
```javascript
// Update a form
await FormService.updateForm(formId, updatedData);

// Delete a form
await FormService.deleteForm(formId);
```

### Analytics
```javascript
// Get form statistics
const stats = await FormService.getFormStatistics();

// Get analytics data
const analytics = await FormService.getAnalyticsData();

// Get pivot table data
const pivotData = await FormService.getPivotData(['age_groups', 'form_types', 'status']);
```

## Database Schema

All forms are saved in Firestore under the `forms` collection with the following structure:

```javascript
{
  formType: 'initial-assessment',           // Type of form
  childFirstName: 'John',
  childSurname: 'Doe',
  dateOfBirth: '2010-05-15',
  age: 14,
  gender: 'Male',
  // ... form-specific fields
  createdAt: Timestamp,                     // Auto-set by service
  updatedAt: Timestamp,                     // Auto-set by service
  status: 'draft',                          // draft, completed, pending
  id: 'document-id'                         // Firestore document ID
}
```

## Data Formatting in FormDataDisplay

The component automatically formats data:

| Data Type | Format |
|-----------|--------|
| Dates | `January 15, 2010` format |
| Boolean | `Yes` or `No` |
| Arrays | Comma-separated list |
| Objects | Formatted JSON |
| Text blocks | Multi-line with left border |
| Numbers | With unit suffix (e.g., "14 years") |

## Sections Automatically Displayed

The FormDataDisplay component intelligently shows:

1. **Child Information** - Basic child details
2. **Pregnancy Information** - Conception and pregnancy details
3. **Medical Information** - Health and clinical data
4. **Family Composition** - Family members in a table
5. **Education** - School and academic info
6. **Assessment Results** - Assessment findings and recommendations
7. **Additional Information** - Any other fields not in above sections

## Styling Customization

Both components use Tailwind CSS and include scoped styles. Key classes:

**FormDataDisplay:**
- `.form-data-display` - Main container
- `.display-header` - Header with form title
- `.data-section` - Each section
- `.data-grid` - Field grid layout
- `.status-badge` - Status indicator

**SavedFormsList:**
- `.saved-forms-container` - Main container
- `.form-card` - Individual form card
- `.card-header` - Card header
- `.card-details` - Card details
- `.modal-overlay` - Modal backdrop

## Example: Complete Integration

```vue
<template>
  <div class="forms-dashboard">
    <header>
      <h1>Forms Management</h1>
      <router-link to="/forms/create" class="btn btn-primary">
        Create New Form
      </router-link>
    </header>

    <!-- Forms List with Search and Filter -->
    <SavedFormsList 
      @edit-form="startEditingForm"
    />

    <!-- View Modal -->
    <div v-if="viewModal.show" class="modal-overlay">
      <div class="modal-content">
        <FormDataDisplay 
          :form="viewModal.form"
          @close="closeViewModal"
        >
          <template #actions>
            <button @click="downloadPDF" class="btn btn-secondary">
              Download PDF
            </button>
            <button @click="closeViewModal" class="btn btn-secondary">
              Close
            </button>
          </template>
        </FormDataDisplay>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SavedFormsList from '@/components/SavedFormsList.vue';
import FormDataDisplay from '@/components/FormDataDisplay.vue';

const router = useRouter();
const viewModal = ref({ show: false, form: null });

const startEditingForm = (form) => {
  // Navigate to edit form page with form data
  router.push({
    name: 'edit-form',
    params: { formId: form.id }
  });
};

const closeViewModal = () => {
  viewModal.show = false;
  viewModal.form = null;
};

const downloadPDF = () => {
  // Implement PDF download if needed
  console.log('Download PDF for:', viewModal.form);
};
</script>

<style scoped>
.forms-dashboard {
  padding: 2rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
```

## Form Data Flow

### Saving a Form
1. User fills out form in component
2. User clicks "Submit"
3. `formService.saveXxxxForm(formData)` is called
4. Data is saved to Firebase Firestore
5. Success/error toast notification shown
6. Form is reset and user can create another

### Viewing Saved Forms
1. Navigate to Forms Management page
2. `SavedFormsList` component loads all forms
3. User can search or filter forms
4. Click "View" to open `FormDataDisplay` in modal
5. Form data is displayed in formatted sections
6. Click "Close" to return to list

### Editing Saved Forms
1. Click "Edit" on form card
2. Form data is loaded into edit form
3. User can modify and save changes
4. Updated data is saved to Firestore
5. List refreshes automatically

## Important Notes

- **Offline Support**: All forms are saved locally first, then synced to Firestore when online
- **Duplicate Detection**: Forms check for duplicate children before saving
- **Network Error Handling**: The service handles network errors gracefully
- **Validation**: Forms validate required fields before submission
- **Status Tracking**: Forms track their status (draft, completed, pending)

## Troubleshooting

### Forms not saving
- Check Firebase credentials in `.env`
- Verify Firestore database is set up
- Check browser console for errors
- Ensure you have write permissions

### Data not displaying
- Check if form data is properly structured
- Verify all required fields are populated
- Check console for JavaScript errors

### Slow loading
- This is normal for large datasets
- Consider implementing pagination
- Check Firestore read quota

## Next Steps

1. **Integrate components** into your dashboard/management page
2. **Test form creation** with various data
3. **Verify Firestore** shows saved data
4. **Test search/filter** functionality
5. **Customize styling** if needed to match your branding

For more help, refer to the existing `formService.js` and component implementations.
