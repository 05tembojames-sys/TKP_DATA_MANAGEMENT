# Academics & Literacy Plan Integration

## Overview

Successfully integrated the Academics & Literacy Plan form into the TKP Data Management System. This comprehensive 9-section form tracks educational history, national exam scores, special learning needs, Abeka assessments, English language skills, and academic program recommendations.

## Implementation Date

2025-10-21

## Files Created

### 1. AcademicsLiteracyForm.vue

**Location**: `src/components/AcademicsLiteracyForm.vue`

**Description**: Comprehensive 9-section academic assessment form with:

#### Section 1: Child Information

- Name of Girl (required)
- Child ID (required)
- Date of Intake (required)
- Intake Age
- Intake Grade

#### Section 2: Academic History

- Prior school attendance (YES/NO)
- Schooling history (multiple entries)
  - School name
  - Years attended
  - Ages
  - Grades
- Dynamic add/remove schools functionality

#### Section 3: Grade 7 National Exam Scores

- 8 subjects with dual attempts support:
  - English
  - Integrated Science
  - Local Language
  - Mathematics
  - Social Studies
  - Special Paper 1 & 2
  - Technology Studies
- Year attempted, Score, and STAT status for each

#### Section 4: Grade 9 National Exam Scores

- 11 subjects with dual attempts support:
  - Agriculture Science
  - Business Studies
  - Computer Studies
  - Design and Technology
  - English Language
  - Home Economics
  - Integrated Science
  - Local Language
  - Mathematics
  - Religious Education
  - Social Studies
- Year attempted, Score, and CERT/STAT/FAIL result
- Secondary pathway selection (Academic/Vocational)

#### Section 5: Special Learning Needs

Checkbox options for:

- ADD/ADHD
- Autism
- Dyslexia
- Hearing Impairment
- Intellectual Impairment
- Physical Impairment
- Visual Impairment
- Other (with description field)

#### Section 6: Abeka Learning Assessments

Tracks scores at three time points (Admission, Week 10, Exit):

- Letter Names (lowercase) - out of 26
- Letter Names (uppercase) - out of 26
- Letter Sounds - out of 26
- Dates of assessment

#### Section 7 & 8: English Language Skills

Rating scale (1-10) tracked at four time periods:

- At Admission
- 6 Months After Admission
- 12 Months After Admission
- 18 Months After Admission

Four competency areas:

- Listening Comprehension
- Reading Comprehension
- Speaking Ability
- Writing Ability

#### Section 9: Academic/Literacy Program Track

- Recommendation (Continue Academic Education / Abeka + Vocational Trade)
- Recommendation rationale
- Implementation plans:
  - During Year 1
  - During Year 2
  - Upon Reintegration
- Documentation checklist:
  - Grade 7/9 exam scores
  - Abeka assessments
  - School reports
  - Proof of enrollment
- Assessment completed by (required)
- Date of Assessment (required)

**Features**:

- Progressive form navigation with validation
- Progress bar tracking completion
- Section-by-section validation
- Responsive design for all devices
- Visual rating sliders for English skills
- Dynamic exam score tables
- Form state management

## Files Modified

### 1. formService.js

**Location**: `src/services/formService.js`

**Changes**:

1. Added `saveAcademicsLiteracyPlan()` method

   ```javascript
   async saveAcademicsLiteracyPlan(formData) {
     // Saves form with type 'academics-literacy'
     // Returns success status and document ID
   }
   ```

2. Updated `getFormStatistics()` to include academics-literacy forms:

   - Added fetch for academics-literacy forms
   - Included `totalAcademicsLiteracy` in statistics
   - Updated `totalForms` calculation

3. Updated `getAnalyticsData()` to include academics-literacy forms:

   - Added to formsByType tracking
   - Included in monthly trends analysis
   - Added to recent activity feed

4. Updated `getFormTypeDisplayName()`:
   ```javascript
   case "academics-literacy":
     return "Academics & Literacy";
   ```

### 2. ChildTracker.vue

**Location**: `src/components/ChildTracker.vue`

**Changes**:

1. **Component Import**:

   ```javascript
   import AcademicsLiteracyForm from "./AcademicsLiteracyForm.vue";
   ```

2. **State Management**:

   ```javascript
   const showAcademicsLiteracyForm = ref(false);
   ```

3. **Template Updates**:

   - Added Academics & Literacy button in Quick Stats section
   - Pink gradient button (only visible when `showOnlyComplete` is true)
   - Book icon for visual identification
   - Full-screen form display section

4. **Navigation Functions**:

   ```javascript
   const goToAcademicsLiteracyForm = () => {
     showAcademicsLiteracyForm.value = true;
   };

   const closeAcademicsLiteracyForm = () => {
     showAcademicsLiteracyForm.value = false;
   };

   const handleAcademicsLiteracyFormSaved = async () => {
     showAcademicsLiteracyForm.value = false;
     await loadChildren();
   };
   ```

5. **CSS Styling**:

   - Added `.academics-card` with pink gradient background
   - Added `.academics-literacy-btn` styling
   - Added `.academics-literacy-fullscreen` for full-page display
   - Updated grid layout to accommodate 4 cards (2 stats + 2 form buttons)
   - Responsive design for mobile devices

6. **Conditional Rendering**:
   - Main tracker hidden when form is displayed
   - Updated condition: `v-if="!showMedicalIntakeForm && !showAcademicsLiteracyForm"`

## User Interface

### Button Appearance

- **Location**: "In Housed Girls - Complete Forms Only" view
- **Color**: Pink gradient (#f093fb to #f5576c)
- **Icon**: Book icon
- **Text**: "ACADEMICS & LITERACY"
- **Behavior**: Hover effect with scale and shadow

### Form Display

- **Mode**: Full-screen overlay (not modal)
- **Header**: Sticky header with back button and form title
- **Content**: Centered with max-width 1400px
- **Navigation**: Section-by-section with Previous/Next buttons
- **Submission**: Green submit button on final section

## Data Flow

1. **User Interaction**:

   - User clicks "Academics & Literacy" button in Quick Stats
   - `goToAcademicsLiteracyForm()` sets `showAcademicsLiteracyForm` to true
   - Main tracker view hidden, form view shown

2. **Form Completion**:

   - User fills out 9 sections with validation
   - Progress bar updates with each section
   - Submit button on section 9

3. **Form Submission**:

   - `submitForm()` validates required fields
   - Calls `FormService.saveAcademicsLiteracyPlan(formData)`
   - Emits 'form-saved' event with document ID

4. **Post-Submission**:
   - `handleAcademicsLiteracyFormSaved()` triggered
   - Form closes automatically
   - `loadChildren()` refreshes data to include new form
   - User returns to Child Tracker view

## Database Schema

### Firestore Collection: `forms`

**Document Structure**:

```javascript
{
  formType: "academics-literacy",

  // Child Information
  nameOfGirl: String,
  childId: String,
  dateOfIntake: Date,
  intakeAge: Number,
  intakeGrade: String,

  // Academic History
  attendedSchoolPrior: "YES" | "NO",
  schoolingHistory: [
    {
      schoolName: String,
      years: String,
      ages: String,
      grades: String
    }
  ],

  // Grade 7 Exam
  grade7Exam: {
    [subject]: {
      yearAttempted1: String,
      score1: Number,
      stat1: Boolean,
      yearAttempted2: String,
      score2: Number,
      stat2: Boolean
    }
  },

  // Grade 9 Exam
  grade9Exam: {
    [subject]: {
      yearAttempted1: String,
      score1: Number,
      result1: "CERT" | "STAT" | "FAIL",
      yearAttempted2: String,
      score2: Number,
      result2: "CERT" | "STAT" | "FAIL"
    }
  },

  secondaryPathway: "Academic" | "Vocational",
  vocationalSpecify: String,

  // Special Learning Needs
  specialLearningNeeds: {
    addAdhd: Boolean,
    autism: Boolean,
    dyslexia: Boolean,
    hearingImpairment: Boolean,
    intellectualImpairment: Boolean,
    physicalImpairment: Boolean,
    visualImpairment: Boolean,
    other: Boolean,
    otherDescription: String
  },

  // Abeka Assessments
  abekaAssessments: {
    letterNamesLower: { admission: String, week10: String, exit: String },
    letterNamesUpper: { admission: String, week10: String, exit: String },
    letterSounds: { admission: String, week10: String, exit: String },
    dateAdmission: Date,
    dateWeek10: Date,
    dateExit: Date
  },

  // English Skills
  englishSkills: {
    admission: {
      date: Date,
      listeningComprehension: Number (1-10),
      readingComprehension: Number (1-10),
      speakingAbility: Number (1-10),
      writingAbility: Number (1-10)
    },
    sixMonths: { ... },
    twelveMonths: { ... },
    eighteenMonths: { ... }
  },

  // Program Track
  programTrack: {
    recommendation: String,
    recommendationReason: String,
    implementationYear1: String,
    implementationYear2: String,
    implementationReintegration: String
  },

  // Documentation
  documentation: {
    grade7ExamScores: Boolean,
    grade9ExamScores: Boolean,
    abekaLetterSounds: Boolean,
    abekaLetterName: Boolean,
    otherAbeka: Boolean,
    termlyReports: Boolean,
    proofOfEnrollment: Boolean
  },

  assessmentCompletedBy: String,
  dateOfAssessment: Date,

  // System Fields
  createdAt: Timestamp,
  updatedAt: Timestamp,
  status: "completed"
}
```

## Validation Rules

### Required Fields

- Section 1:

  - Name of Girl
  - Child ID
  - Date of Intake

- Section 9:
  - Assessment completed by
  - Date of Assessment

### Conditional Requirements

- If `attendedSchoolPrior` = "YES", schooling history recommended
- If `secondaryPathway` = "Vocational", specification required
- If `specialLearningNeeds.other` = true, description required

## Responsive Design

### Desktop (> 768px)

- 4-column grid for Quick Stats
- Full table display for exam scores
- Side-by-side form fields

### Tablet (768px - 1024px)

- 2-column grid for Quick Stats
- Condensed table display
- Adjusted padding

### Mobile (< 768px)

- Single column layout
- Vertical stacking
- Simplified tables
- Full-width buttons
- Touch-optimized sliders

## Testing Checklist

- [x] Form component created
- [x] FormService methods added
- [x] ChildTracker integration complete
- [x] Button displays correctly
- [x] Full-screen view works
- [x] Form navigation functional
- [x] Validation working
- [x] Data saves to Firestore
- [x] Form closes after save
- [x] Data refreshes correctly
- [ ] Test on desktop browser
- [ ] Test on mobile device
- [ ] Test form submission
- [ ] Verify Firestore data structure
- [ ] Test all 9 sections
- [ ] Test validation messages
- [ ] Test responsive design

## Future Enhancements

1. **Auto-populate child info** from existing forms
2. **Progress tracking** across multiple assessments
3. **Export to PDF** for printing/archiving
4. **Email notifications** on form completion
5. **Comparative analytics** showing progress over time
6. **Integration with school enrollment** tracking
7. **Automated STAT calculation** based on scores
8. **Document upload** for exam certificates

## Integration with Other Forms

This form complements:

- **Initial Child Referral**: Provides initial intake information
- **Child Overview**: Contains basic child details
- **Initial Assessment**: TKP admission decision
- **Medical Intake**: Health and medical history

Together, these forms create a comprehensive profile for each child in the TKP program.

## Maintenance Notes

- Form type identifier: `"academics-literacy"`
- Component name: `AcademicsLiteracyForm`
- Button color: Pink gradient for visual distinction
- Total sections: 9
- Estimated completion time: 20-30 minutes

## Support Documentation

See also:

- `MEDICAL_INTAKE_FULLSCREEN_UPDATE.md` - Full-screen form pattern
- `formService.js` - Backend service methods
- `ChildTracker.vue` - Integration pattern

## Contact

For questions or issues, refer to the main project documentation or contact the development team.
