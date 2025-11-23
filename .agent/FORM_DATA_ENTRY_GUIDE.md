# TKP Data Entry Forms - User Guide

## Overview
This guide explains how to access and use the individual data entry forms in the TKP Data Management Application.

## Available Forms

The application includes the following forms:
1. **Initial Referral Form** (`initial-referral`)
2. **Medical Intake Form** (`medical-intake`)
3. **Child Overview Form** (`child-overview`)
4. **Initial Assessment Form** (`initial-assessment`)

---

## How to Access Forms

There are **three main ways** to access and enter data into these forms:

### Method 1: From the Capture App (Direct Data Entry)

1. Navigate to **Capture** from the top navigation menu
2. Select your **Organisation Unit** (e.g., "The Kukhoma Project - Main Center")
3. Select a **Data Set** from the dropdown:
   - Initial Child Referral Forms
   - Child Overview and Background Forms
   - TKP Initial Assessment Forms
   - Medical Intake Assessment
4. Select a **Period** (month/quarter/year)
5. The form will load automatically
6. Fill in the required fields
7. Click **Save** to save changes

### Method 2: From Tracker Capture (Child-Specific Entry)

This is the recommended method when you want to enter data for a specific child:

1. Navigate to **Tracker Capture** from the top navigation menu
2. Search for or select a child from the list
3. Click on "**Enter Data**" button for the specific child
4. Select which form you want to fill from the available options:
   - Initial Referral Form
   - Medical Intake Form  
   - Child Overview Form
   - Initial Assessment Form
5. The form will auto-populate with the child's information
6. Complete the remaining required fields
7. Click **Save** or **Complete Entry**

### Method 3: From Child Tracker (Quick Access)

1. Navigate to **Child Tracker** from the apps menu
2. Find the child you want to enter data for
3. Click on the child's card to view their details
4. In the child details modal, you'll see buttons for different forms
5. Click the appropriate form button (e.g., "Medical Intake", "Child Overview")
6. The form will open with the child's basic information pre-filled
7. Complete the form and save

---

## Form Details

### 1. Initial Referral Form

**Purpose**: Captures initial referral information for children coming into the program

**Key Sections**:
- Child Information (name, DOB, age)
- Referral Details (method, date, type of abuse)
- Home Situation (caregiver info, living conditions)
- Abuse Information

**Required Fields**:
- Child First Name
- Child Last Name
- Date of Birth
- Age
- Date of Referral
- Referral Method
- Type of Abuse
- Abuser Relationship

**How Data is Saved**:
- FormType: `initial-referral`
- Collection: `forms`
- Method: `FormService.saveInitialReferral()`

---

### 2. Medical Intake Form

**Purpose**: Comprehensive medical assessment for child admission

**Key Sections**:
- Child Information
- Biological Parents Information
- Birth History
- Growth & Development
- Medical History
- Current Medications
- Pregnancy Details (if applicable)

**Features**:
- Multi-step form with progress indicator
- Section navigation
- Add/remove medications dynamically
- Add/remove biological children
- Form validation per section

**How Data is Saved**:
- FormType: `medical-intake`
- Collection: `forms`
- Method: `FormService.saveMedicalIntakeAssessment()`

---

### 3. Child Overview Form

**Purpose**: Comprehensive child background and care plan documentation

**Key Sections**:
1. Child Information
2. Vulnerability Status
3. Referral Method
4. Reason for Admission
5. Caregiver Information (Primary & Secondary)
6. General Family Information (Biological Parents)
7. Additional Family Members
8. Documents Included

**Features**:
- 8-section multi-step form
- Progress tracking
- Dynamic family member addition
- Document checklist
- Comprehensive validation

**Required Fields** (Sections 1-5 are required):
- Child First Name, Surname, ID
- Date of Admission, DOB, Gender
- Place of Birth, Area, District, Nationality
- OVC Status
- Referral Method
- At least one reason for admission
- Date Compiled, Child Name, Child ID

**How Data is Saved**:
- FormType: `child-overview`
- Collection: `forms`
- Methods: 
  - `FormService.saveChildOverview()` (new)
  - `FormService.updateChildOverview()` (edit)

---

### 4. Initial Assessment Form

**Purpose**: Assessment forms for child eligibility and admission

**Key Sections**:
- Child Information
- Pregnancy Details (duration, conception category)
- Family Information
- Assessment Details

**How Data is Saved**:
- FormType: `initial-assessment`
- Collection: `forms`
- Method: `FormService.saveInitialAssessment()`

---

## Data Flow

### When Entering Data From Tracker Capture:

```
TrackerCapture → Select Child → Click "Enter Data" → Select Form
    ↓
Capture.vue receives query params:
  - preset: child-{childId}
  - dataSet: {form-type}
  - caseId: {childId}
    ↓
Form loads with pre-populated child info from:
  - sessionStorage: 'selectedChildForForm'
    ↓
User completes form → Clicks Save
    ↓
Data saved to Firestore 'forms' collection with:
  - formType: {form-type}
  - childFirstName, childSurname, dateOfBirth (for matching)
  - All form-specific fields
  - status: "submitted"
  - createdAt, updatedAt timestamps
```

### Data Matching:

Forms are matched to children using:
- `childFirstName`
- `childSurname` (or `childLastName`)
- `dateOfBirth`

This ensures that all forms for a specific child can be retrieved and linked together.

---

## Form Validation

Each form has built-in validation:

1. **Required Field Validation**: Fields marked with `*` must be filled
2. **Section Validation**: Some forms validate per section before allowing navigation
3. **Data Type Validation**: Ensures correct data types (dates, numbers, etc.)
4. **Custom Validation**: Form-specific rules (e.g., "at least one reason must be selected")

### Viewing Validation Errors:

- Errors appear in red below the field
- A validation summary appears at the top of the form
- Form cannot be saved/submitted until all required fields are complete

---

## Saving Options

### Save as Draft
- Available in some forms
- Data is saved but marked as incomplete
- Can be edited later
- Status: `draft`

### Complete Entry / Submit
- Final submission
- Marks form as complete
- Status: `submitted`
- Cannot be edited (depending on permissions)

---

## Tips for Data Entry

1. **Start with Tracker Capture** when entering data for a specific child - it auto-populates child information
2. **Use the progress indicator** in multi-step forms to track completion
3. **Save frequently** to avoid losing data
4. **Check validation errors** before attempting to submit
5. **Complete required sections first** (usually sections 1-5)
6. **Use the section navigation** buttons to move through the form efficiently

---

## Troubleshooting

### Form doesn't load:
- Check your internet connection
- Refresh the page
- Clear browser cache and try again

### Data not saving:
- Check for validation errors (red text below fields)
- Ensure all required fields are filled
- Check console for error messages
- Verify you have&#39; internet connection

### Child information not auto-populating:
- Ensure you accessed the form through Tracker Capture or Child Tracker
- Check that the child exists in the system
- Try selecting the child again

### Can't find form data after saving:
- Data is stored in Firebase Firestore under the `forms` collection
- Forms are matched by child name and DOB
- Check the Tracker Capture "Events" tab for the child

---

## Firebase Data Structure

All forms are saved to the `forms` collection with this structure:

```javascript
{
  formType: "initial-referral" | "medical-intake" | "child-overview" | "initial-assessment",
  childFirstName: "Jane",
  childSurname: "Doe",
  dateOfBirth: "2010-01-15",
  // ... form-specific fields ...
  status: "draft" | "submitted",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isDraft: boolean
}
```

---

## Next Steps

After completing the forms:
1. Data is automatically linked to the child record
2. View submitted forms in Tracker Capture under the child's "Events" tab
3. Generate reports using the saved data
4. Track child progress over time

For technical support or questions, refer to the system administrator.
