# Life Skills Survey Integration

## Overview

This document describes the integration of the Life Skills Survey form into the TKP Data Management System. The survey assesses girls' independence across 6 skill categories with comprehensive goal-setting capabilities.

## Integration Date

2025-10-21

## Components Modified

### 1. LifeSkillsSurveyForm.vue

**Location**: `src/components/LifeSkillsSurveyForm.vue`

**Description**: Complete 9-section life skills assessment form component.

**Form Sections**:

1. **Girl Information** (Section 1)

   - Name, age, grade
   - Date of admission
   - Baby age (if applicable)
   - Date of assessment

2. **Personal Hygiene** (Section 2)

   - 5 skills assessed
   - Rating scale: Does Not Do → Does Independently

3. **Household Chores** (Section 3)

   - 7 skills assessed
   - Same 5-level rating scale

4. **Personal Health** (Section 4)

   - 5 skills assessed
   - Chronic health N/A option

5. **Community Skills** (Section 5)

   - 5 skills assessed
   - Includes transportation and social skills

6. **Food Preparation** (Section 6)

   - 7 skills assessed
   - From basic to advanced cooking

7. **Mothering Skills** (Section 7)

   - 7 basic mothering skills
   - 6 primary caregiving skills
   - CPR/First Aid training status

8. **Life Skills Goals** (Section 8)

   - Goal setting for each skill category
   - Next assessment date planning

9. **Assessment Completed By** (Section 9)
   - Social Worker signature
   - House Mother 1 signature
   - House Mother 2 signature

**Rating Scale**:

- 1 = Does Not Do
- 2 = Does With Constant Prompting
- 3 = Does With Occasional Prompting
- 4 = Does With Little To No Prompting
- 5 = Does Independently

**Key Features**:

- Progressive navigation with Previous/Next buttons
- Section-by-section validation
- Visual progress tracking
- Auto-scroll on section change
- Comprehensive skill assessment tables
- Multi-assessor signature capture

**Form Data Structure**:

```javascript
{
  // Girl Information
  nameOfGirl: String,
  girlAge: Number,
  grade: String,
  dateOfAdmission: Date,
  babyAge: Number,
  dateOfAssessment: Date,

  // Skill Assessments (6 categories)
  personalHygiene: { skillName: Number },
  householdChores: { skillName: Number },
  personalHealth: { skillName: Number, chronicHealthNA: Boolean },
  communitySkills: { skillName: Number },
  foodPrepSkills: { skillName: Number },
  motheringSkills: {
    skillName: Number,
    cprFirstAidTraining: String
  },

  // Goals
  goals: {
    personalHygiene: String,
    personalHealth: String,
    householdChores: String,
    communitySkills: String,
    foodPrepSkills: String,
    motheringSkills: String
  },

  // Next Assessment
  nextAssessmentDate: Date,

  // Signatures
  completedBy: {
    socialWorkerName: String,
    socialWorkerSignature: String,
    houseMotherName: String,
    houseMotherSignature: String,
    houseMother2Name: String,
    houseMother2Signature: String
  }
}
```

### 2. formService.js

**Location**: `src/services/formService.js`

**Changes**:

#### Added saveLifeSkillsSurvey() Method

```javascript
async saveLifeSkillsSurvey(formData) {
  try {
    const formDoc = {
      formType: "life-skills-survey",
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "completed",
    };

    const docRef = await addDoc(
      collection(db, this.formsCollection),
      formDoc
    );
    return {
      success: true,
      id: docRef.id,
      message: "Life Skills Survey saved successfully",
    };
  } catch (error) {
    console.error("Error saving life skills survey:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
```

#### Updated getFormStatistics()

Added life-skills-survey to statistics collection:

```javascript
const [
  referralResult,
  overviewResult,
  assessmentResult,
  medicalIntakeResult,
  academicsLiteracyResult,
  psychologicalAssessmentResult,
  lifeSkillsSurveyResult, // ADDED
] = await Promise.all([
  this.getForms("initial-referral", 1000),
  this.getForms("child-overview", 1000),
  this.getForms("initial-assessment", 1000),
  this.getForms("medical-intake", 1000),
  this.getForms("academics-literacy", 1000),
  this.getForms("psychological-assessment", 1000),
  this.getForms("life-skills-survey", 1000), // ADDED
]);
```

#### Updated getAnalyticsData()

Included life-skills-survey in monthly analytics:

```javascript
const formTypes = [
  "initial-referral",
  "child-overview",
  "initial-assessment",
  "medical-intake",
  "academics-literacy",
  "psychological-assessment",
  "life-skills-survey", // ADDED
];
```

#### Updated getFormTypeDisplayName()

Added display name mapping:

```javascript
case "life-skills-survey":
  return "Life Skills Survey";
```

### 3. ChildTracker.vue

**Location**: `src/components/ChildTracker.vue`

**Changes**:

#### Imported Component

```javascript
import LifeSkillsSurveyForm from "./LifeSkillsSurveyForm.vue";
```

#### Added State Variable

```javascript
const showLifeSkillsSurveyForm = ref(false);
```

#### Added Navigation Handlers

```javascript
const goToLifeSkillsSurveyForm = () => {
  showLifeSkillsSurveyForm.value = true;
};

const closeLifeSkillsSurveyForm = () => {
  showLifeSkillsSurveyForm.value = false;
};

const handleLifeSkillsSurveyFormSaved = async () => {
  showLifeSkillsSurveyForm.value = false;
  await loadChildren();
};
```

#### Updated Quick Stats Grid

Changed from 5 to 6 columns:

```css
.quick-stats-section {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  /* ... */
}
```

#### Added Button to Quick Stats

```vue
<!-- Life Skills Survey Button - Only shows in "In Housed Girls" view -->
<div v-if="showOnlyComplete" class="stat-card action-card life-skills-card">
  <button
    @click="goToLifeSkillsSurveyForm"
    class="life-skills-survey-btn"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
    <span>Life Skills Survey</span>
  </button>
</div>
```

#### Added Button Styling

```css
.stat-card.life-skills-card {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-color: #11998e;
}

.stat-card.life-skills-card:hover {
  background: linear-gradient(135deg, #0e8677 0%, #2dd969 100%);
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
}

.life-skills-survey-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.life-skills-survey-btn:hover {
  transform: scale(1.05);
}

.life-skills-survey-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}
```

#### Added Full-Screen Display Section

```vue
<!-- Life Skills Survey Form Full Display -->
<div
  v-if="showLifeSkillsSurveyForm"
  class="life-skills-survey-fullscreen"
>
  <div class="fullscreen-header">
    <button @click="closeLifeSkillsSurveyForm" class="back-button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m12 19-7-7 7-7" />
        <path d="m19 12H5" />
      </svg>
      Back to Child Tracker
    </button>
    <h2>Life Skills Survey</h2>
    <div class="header-spacer"></div>
  </div>
  <div class="fullscreen-content">
    <LifeSkillsSurveyForm
      @form-saved="handleLifeSkillsSurveyFormSaved"
    />
  </div>
</div>
```

#### Updated Main View Conditional

```vue
<div
  v-if="
    !showMedicalIntakeForm &&
    !showAcademicsLiteracyForm &&
    !showPsychologicalAssessmentForm &&
    !showLifeSkillsSurveyForm
  "
  class="tracker-main-view"
>
```

#### Updated loadChildren() Function

Now loads life-skills-survey forms:

```javascript
const [
  overviewResult,
  referralResult,
  assessmentResult,
  medicalIntakeResult,
  academicsLiteracyResult,
  psychologicalAssessmentResult,
  lifeSkillsSurveyResult, // ADDED
] = await Promise.all([
  FormService.getForms("child-overview", 1000),
  FormService.getForms("initial-referral", 1000),
  FormService.getForms("initial-assessment", 1000),
  FormService.getForms("medical-intake", 1000),
  FormService.getForms("academics-literacy", 1000),
  FormService.getForms("psychological-assessment", 1000),
  FormService.getForms("life-skills-survey", 1000), // ADDED
]);
```

#### Updated Complete Forms Filter

Now requires all 7 forms:

```javascript
if (props.showOnlyComplete) {
  allChildren = allChildren.filter(
    (child) =>
      child.formTypes.includes("initial-referral") &&
      child.formTypes.includes("child-overview") &&
      child.formTypes.includes("initial-assessment") &&
      child.formTypes.includes("medical-intake") &&
      child.formTypes.includes("academics-literacy") &&
      child.formTypes.includes("psychological-assessment") &&
      child.formTypes.includes("life-skills-survey") // ADDED
  );
}
```

#### Added Fullscreen CSS

```css
.life-skills-survey-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f9fa;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
```

## Button Color Scheme

All form access buttons now have distinct gradient colors:

1. **Medical Intake**: Purple (`#667eea` → `#764ba2`)
2. **Academics & Literacy**: Pink (`#f093fb` → `#f5576c`)
3. **Psychological Assessment**: Cyan (`#4facfe` → `#00f2fe`)
4. **Life Skills Survey**: Green (`#11998e` → `#38ef7d`) ✨ NEW

## User Flow

1. User navigates to "In Housed Girls - Complete Forms Only" section
2. Quick Stats section displays 6 action buttons in grid layout
3. User clicks "Life Skills Survey" button (green gradient)
4. ChildTracker main view is hidden
5. Life Skills Survey form displays in full-screen mode
6. User completes the 9-section assessment:
   - Section 1: Enter girl's basic information
   - Sections 2-7: Rate skills across 6 categories
   - Section 8: Set goals for each skill area
   - Section 9: Capture assessor signatures
7. User clicks "Submit Survey"
8. Form data is saved to Firestore with formType: "life-skills-survey"
9. Success message is displayed
10. User returns to ChildTracker
11. Children data is reloaded to reflect the new survey

## Validation

The form includes comprehensive validation:

- All required fields must be filled
- Skill ratings must be selected (1-5)
- At least one goal must be set
- All assessor signatures required
- Validation messages appear at the top of the form
- Cannot proceed to next section until current section is valid
- Cannot submit until all 9 sections are complete

## Database Structure

Forms are stored in Firestore with the following structure:

```javascript
{
  formType: "life-skills-survey",
  nameOfGirl: "Jane Doe",
  girlAge: 15,
  grade: "9",
  dateOfAdmission: Timestamp,
  babyAge: null,
  dateOfAssessment: Timestamp,

  personalHygiene: {
    "Baths or showers regularly": 4,
    "Brushes teeth regularly": 5,
    // ... other skills
  },

  householdChores: {
    "Makes own bed": 5,
    "Cleans room": 4,
    // ... other skills
  },

  // ... other skill categories

  goals: {
    personalHygiene: "Improve consistency with hair care",
    personalHealth: "Learn more about nutrition",
    // ... other goals
  },

  nextAssessmentDate: Timestamp,

  completedBy: {
    socialWorkerName: "Mary Johnson",
    socialWorkerSignature: "Mary Johnson",
    houseMotherName: "Grace Mwale",
    houseMotherSignature: "Grace Mwale",
    houseMother2Name: "Ruth Banda",
    houseMother2Signature: "Ruth Banda"
  },

  createdAt: Timestamp,
  updatedAt: Timestamp,
  status: "completed"
}
```

## Testing Checklist

- [✓] Form component created with all 9 sections
- [✓] formService.js updated with save method
- [✓] Statistics collection includes life-skills-survey
- [✓] Analytics includes life-skills-survey
- [✓] Display name mapping added
- [✓] Button added to ChildTracker Quick Stats
- [✓] Grid updated to 6 columns
- [✓] State management added
- [✓] Navigation handlers implemented
- [✓] Full-screen display added
- [✓] Main view conditional updated
- [✓] loadChildren() function updated
- [✓] Complete forms filter updated
- [✓] CSS styling added (green gradient)
- [ ] Form submission tested
- [ ] Data saved to Firestore verified
- [ ] Form appears in child tracker after save
- [ ] Complete forms filter works correctly
- [ ] All validation working properly

## Assessment Categories Detail

### Personal Hygiene (5 skills)

1. Baths or showers regularly
2. Brushes teeth regularly
3. Keeps finger and toe nails clean and trimmed
4. Takes care of hair (washes and styles)
5. Uses deodorant

### Household Chores (7 skills)

1. Makes own bed
2. Cleans room
3. Does assigned chores
4. Does own laundry
5. Sweeps and mops floors
6. Keeps personal items organized
7. Helps with general house cleaning

### Personal Health (5 skills)

1. Takes medication as prescribed
2. Follows medical treatment plans
3. Reports health concerns promptly
4. Manages chronic health condition (if applicable)
5. Practices healthy habits (sleep, exercise)

### Community Skills (5 skills)

1. Uses public transportation appropriately
2. Asks for help when needed
3. Follows community rules
4. Manages money responsibly
5. Interacts appropriately with others

### Food Preparation (7 skills)

1. Makes simple snacks
2. Makes simple meals
3. Plans balanced meals
4. Grocery shops with list
5. Stores food properly
6. Practices food safety
7. Cleans up after cooking

### Mothering Skills (13 skills)

**Basic Mothering:**

1. Feeds baby appropriately
2. Changes diapers/keeps baby clean
3. Dresses baby appropriately
4. Responds to baby's needs
5. Plays with and stimulates baby
6. Follows baby's schedule
7. Shows affection to baby

**Primary Caregiving:** 8. Recognizes illness signs 9. Knows when to seek medical help 10. Administers medication properly 11. Baby-proofs environment 12. Uses car seat correctly 13. Has CPR/First Aid training

## Notes

- The Life Skills Survey is designed for comprehensive assessment of girls' independence
- The 5-level rating scale provides nuanced evaluation
- Goal-setting section enables targeted intervention planning
- Multiple assessors provide collaborative evaluation
- Form follows TKP's established assessment framework
- Green color scheme distinguishes it from other forms
- Now part of the required forms for "Complete Forms Only" view
- All 7 forms must be completed for a child to appear in "In Housed Girls - Complete Forms Only"

## Future Enhancements

Potential improvements:

1. Add progress tracking over time (compare assessments)
2. Generate visual charts of skill development
3. Export individual or group skill reports
4. Add skill development recommendations
5. Link goals to action plans
6. Track goal achievement over assessments
7. Add comments section for each skill category
8. Include photo documentation option
9. Add skill benchmarks by age group
10. Generate automated training recommendations
