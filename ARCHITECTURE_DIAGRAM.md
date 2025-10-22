# TKP Data Management System - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TKP DATA MANAGEMENT SYSTEM                           │
│                              Main Dashboard                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
         ┌──────────▼──────────┐           ┌───────────▼────────────┐
         │   Data Entry View   │           │ In Housed Girls View   │
         │  (All Girls/Forms)  │           │ (Complete Forms Only)  │
         └─────────────────────┘           └────────────────────────┘
                                                       │
                          ┌────────────────────────────┴────────────────────────────┐
                          │                  Child Tracker                          │
                          │                  (ChildTracker.vue)                     │
                          └────────────────────────────────────────────────────────-┘
                                                       │
                    ┌──────────────────────────────────┴──────────────────────────────────┐
                    │                        Quick Stats Section                          │
                    │                      (6-Column Grid Layout)                         │
                    └─────────────────────────────────────────────────────────────────────┘
                                                       │
        ┌──────────────┬──────────────┬──────────────┼──────────────┬──────────────┬──────────────┐
        │              │              │              │              │              │              │
   ┌────▼────┐    ┌───▼────┐    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │ Total   │    │ Active │    │ Medical │    │Academics│    │Psycho-  │    │  Life   │
   │Children │    │ Cases  │    │ Intake  │    │Literacy │    │logical  │    │ Skills  │
   │         │    │        │    │ (Purple)│    │ (Pink)  │    │ (Cyan)  │    │ (Green) │
   └─────────┘    └────────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
                                      │              │              │              │
                                      │              │              │              │
        ┌─────────────────────────────┴──────────────┴──────────────┴──────────────┴─────────────┐
        │                                                                                          │
        │                            FULL-SCREEN FORM DISPLAY                                     │
        │                                                                                          │
        └──────────────────────────────────────────────────────────────────────────────────────-─┘
                    │                    │                    │                    │
        ┌───────────▼───────────┐ ┌─────▼──────┐ ┌──────────▼─────────┐ ┌─────────▼────────────┐
        │ MedicalIntakeForm.vue │ │ Academics  │ │ Psychological      │ │LifeSkillsSurvey      │
        │                       │ │ LiteracyF. │ │ AssessmentForm.vue │ │Form.vue              │
        │  10 Sections          │ │            │ │                    │ │                      │
        │  - Medical History    │ │  9 Sections│ │  7 Sections        │ │  9 Sections          │
        │  - Physical Exam      │ │  - Academic│ │  - Self-Esteem     │ │  - Girl Info         │
        │  - Immunizations      │ │    History │ │  - ADNM-20         │ │  - 6 Skill           │
        │  - Medications        │ │  - Exam    │ │  - SDQ             │ │    Categories        │
        │  - Mental Health      │ │    Scores  │ │  - CATS PTSD       │ │  - Goals             │
        │  - SDQ Assessment     │ │  - Literacy│ │  - PTGI            │ │  - Signatures        │
        │  - HIV Status         │ │    Tests   │ │  - Observations    │ │                      │
        │  - TB Screening       │ │  - Language│ │  - Treatment Plan  │ │  42 Total Skills     │
        │  - Emergency Contact  │ │    Skills  │ │                    │ │  5-Level Rating      │
        │  - Consent            │ │  - Programs│ │  Auto-Calculated   │ │                      │
        └───────────┬───────────┘ └─────┬──────┘ └──────────┬─────────┘ └─────────┬────────────┘
                    │                   │                    │                     │
                    └───────────────────┴────────────────────┴─────────────────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │   formService.js      │
                                    │                       │
                                    │  Save Methods:        │
                                    │  - saveMedicalIntake  │
                                    │  - saveAcademics      │
                                    │  - savePsychological  │
                                    │  - saveLifeSkills     │
                                    │                       │
                                    │  Query Methods:       │
                                    │  - getForms()         │
                                    │  - getStatistics()    │
                                    │  - getAnalytics()     │
                                    └───────────┬───────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │   Firebase Firestore  │
                                    │                       │
                                    │   Collection: forms   │
                                    │                       │
                                    │   Documents:          │
                                    │   ├─ initial-referral │
                                    │   ├─ child-overview   │
                                    │   ├─ initial-assess.  │
                                    │   ├─ medical-intake   │
                                    │   ├─ academics-lit.   │
                                    │   ├─ psychological    │
                                    │   └─ life-skills      │
                                    └───────────────────────┘
```

## Component Hierarchy

```
App.vue
 │
 ├─ Router
 │   │
 │   ├─ Login.vue
 │   │
 │   └─ Dashboard.vue
 │       │
 │       ├─ Data Entry View
 │       │   └─ ChildTracker.vue (showOnlyComplete=false)
 │       │
 │       └─ In Housed Girls View
 │           └─ ChildTracker.vue (showOnlyComplete=true)
 │               │
 │               ├─ Quick Stats Section
 │               │   ├─ Total Children Card
 │               │   ├─ Active Cases Card
 │               │   ├─ Medical Intake Button (Purple)
 │               │   ├─ Academics & Literacy Button (Pink)
 │               │   ├─ Psychological Assessment Button (Cyan)
 │               │   └─ Life Skills Survey Button (Green)
 │               │
 │               ├─ Search Section
 │               │
 │               ├─ Results Section
 │               │   └─ Child Cards (with form type indicators)
 │               │
 │               └─ Full-Screen Form Display
 │                   ├─ MedicalIntakeForm.vue
 │                   ├─ AcademicsLiteracyForm.vue
 │                   ├─ PsychologicalAssessmentForm.vue
 │                   └─ LifeSkillsSurveyForm.vue
 │
 └─ Pagination.vue (shared component)
```

## Data Flow Diagram

```
┌─────────────┐
│    User     │
│   Action    │
└──────┬──────┘
       │
       │ 1. Clicks Form Button
       │
┌──────▼───────────────────┐
│  ChildTracker.vue        │
│  - goToFormMethod()      │
│  - showForm = true       │
└──────┬───────────────────┘
       │
       │ 2. Renders Full-Screen Form
       │
┌──────▼───────────────────┐
│  FormComponent.vue       │
│  - User fills sections   │
│  - Validation checks     │
│  - submitForm()          │
└──────┬───────────────────┘
       │
       │ 3. Calls formService
       │
┌──────▼───────────────────┐
│  formService.js          │
│  - saveFormMethod()      │
│  - Creates document      │
└──────┬───────────────────┘
       │
       │ 4. Saves to Firestore
       │
┌──────▼───────────────────┐
│  Firebase Firestore      │
│  - forms collection      │
│  - New document created  │
└──────┬───────────────────┘
       │
       │ 5. Returns success
       │
┌──────▼───────────────────┐
│  FormComponent.vue       │
│  - emit('form-saved')    │
└──────┬───────────────────┘
       │
       │ 6. Event handler
       │
┌──────▼───────────────────┐
│  ChildTracker.vue        │
│  - handleFormSaved()     │
│  - showForm = false      │
│  - loadChildren()        │
└──────┬───────────────────┘
       │
       │ 7. Fetches updated data
       │
┌──────▼───────────────────┐
│  Firebase Firestore      │
│  - Query all 7 forms     │
│  - Group by child        │
└──────┬───────────────────┘
       │
       │ 8. Returns data
       │
┌──────▼───────────────────┐
│  ChildTracker.vue        │
│  - Updates children list │
│  - Applies filters       │
│  - Renders updated view  │
└──────────────────────────┘
```

## Form Validation Flow

```
┌──────────────────────────┐
│  User on Section N       │
└───────────┬──────────────┘
            │
            │ Clicks "Next"
            │
┌───────────▼──────────────┐
│  validateSection(N)      │
│  - Check required fields │
│  - Validate data types   │
│  - Check constraints     │
└───────────┬──────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───▼────┐    ┌─────▼─────┐
│ Valid  │    │  Invalid  │
└───┬────┘    └─────┬─────┘
    │               │
    │               │ Show error message
    │               │ Scroll to top
    │               │ Stay on section
    │               │
    │         ┌─────▼─────┐
    │         │   User    │
    │         │   Fixes   │
    │         └─────┬─────┘
    │               │
    │               │ Clicks "Next" again
    │               │
    │         ┌─────▼─────┐
    │         │ Validate  │
    │         │   Again   │
    │         └─────┬─────┘
    │               │
    │               │ (loop until valid)
    │               │
    └───────────────┘
            │
    ┌───────▼────────┐
    │ Move to Next   │
    │ Section (N+1)  │
    └────────────────┘
```

## Complete Forms Filter Logic

```
┌──────────────────────────┐
│  loadChildren() called   │
└───────────┬──────────────┘
            │
    ┌───────▼──────────┐
    │ Fetch all forms  │
    │ from Firestore   │
    │ (7 form types)   │
    └───────┬──────────┘
            │
    ┌───────▼──────────────────┐
    │ Group forms by child     │
    │ Key: name + DOB          │
    │ Value: Array of forms    │
    └───────┬──────────────────┘
            │
    ┌───────▼──────────────────┐
    │ Build children array     │
    │ Each child has:          │
    │ - formTypes: []          │
    │ - Complete data          │
    └───────┬──────────────────┘
            │
    ┌───────▼──────────────────┐
    │ showOnlyComplete?        │
    └───────┬──────────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───▼────┐    ┌─────▼──────┐
│  No    │    │    Yes     │
│ (All)  │    │            │
└───┬────┘    └─────┬──────┘
    │               │
    │         ┌─────▼──────────────┐
    │         │ Filter children    │
    │         │ Must have ALL 7:   │
    │         │ ✓ initial-referral │
    │         │ ✓ child-overview   │
    │         │ ✓ initial-assess.  │
    │         │ ✓ medical-intake   │
    │         │ ✓ academics-lit.   │
    │         │ ✓ psychological    │
    │         │ ✓ life-skills      │
    │         └─────┬──────────────┘
    │               │
    └───────────────┘
            │
    ┌───────▼──────────────────┐
    │ Display children list    │
    │ (filtered or complete)   │
    └──────────────────────────┘
```

## Button Click Flow

```
User clicks "Life Skills Survey" button
            │
    ┌───────▼──────────────────────┐
    │ goToLifeSkillsSurveyForm()   │
    │ showLifeSkillsSurveyForm.value = true │
    └───────┬──────────────────────┘
            │
    ┌───────▼──────────────────────────────────────────┐
    │ Vue Reactivity System                            │
    │ Detects state change                             │
    │ Triggers re-render                               │
    └───────┬──────────────────────────────────────────┘
            │
    ┌───────▼──────────────────────────────────────────┐
    │ Template Re-evaluation                           │
    │                                                   │
    │ v-if="!showMedicalIntakeForm &&                  │
    │      !showAcademicsLiteracyForm &&               │
    │      !showPsychologicalAssessmentForm &&         │
    │      !showLifeSkillsSurveyForm"                  │
    │ → FALSE (hide main tracker)                      │
    │                                                   │
    │ v-if="showLifeSkillsSurveyForm"                  │
    │ → TRUE (show life skills form)                   │
    └───────┬──────────────────────────────────────────┘
            │
    ┌───────▼──────────────────────────────────────────┐
    │ DOM Update                                        │
    │ - Hide ChildTracker main view                    │
    │ - Show LifeSkillsSurveyForm component            │
    │ - Render full-screen overlay                     │
    └───────┬──────────────────────────────────────────┘
            │
    ┌───────▼──────────────────────────────────────────┐
    │ User sees Life Skills Survey Form                │
    │ Can complete assessment                          │
    │ Can click "Back" to return                       │
    └──────────────────────────────────────────────────┘
```

## Color Coding System

```
┌────────────────────────────────────────────────────────────────┐
│                      FORM BUTTON COLORS                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Medical Intake Assessment                                     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Purple Gradient                   │
│  #667eea → #764ba2                                             │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Academics & Literacy Plan                                     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Pink Gradient                     │
│  #f093fb → #f5576c                                             │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Psychological Assessment/Treatment Plan                       │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Cyan Gradient                     │
│  #4facfe → #00f2fe                                             │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Life Skills Survey                                            │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Green Gradient                    │
│  #11998e → #38ef7d                                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
Firestore Database: tkp-data-management
 │
 └─ Collection: forms
     │
     ├─ Document: [auto-generated-id]
     │   ├─ formType: "medical-intake"
     │   ├─ createdAt: Timestamp
     │   ├─ updatedAt: Timestamp
     │   ├─ status: "completed"
     │   └─ [form-specific fields...]
     │
     ├─ Document: [auto-generated-id]
     │   ├─ formType: "academics-literacy"
     │   ├─ createdAt: Timestamp
     │   ├─ updatedAt: Timestamp
     │   ├─ status: "completed"
     │   └─ [form-specific fields...]
     │
     ├─ Document: [auto-generated-id]
     │   ├─ formType: "psychological-assessment"
     │   ├─ createdAt: Timestamp
     │   ├─ updatedAt: Timestamp
     │   ├─ status: "completed"
     │   └─ [form-specific fields...]
     │
     └─ Document: [auto-generated-id]
         ├─ formType: "life-skills-survey"
         ├─ createdAt: Timestamp
         ├─ updatedAt: Timestamp
         ├─ status: "completed"
         ├─ nameOfGirl: String
         ├─ girlAge: Number
         ├─ personalHygiene: Object
         ├─ householdChores: Object
         ├─ personalHealth: Object
         ├─ communitySkills: Object
         ├─ foodPrepSkills: Object
         ├─ motheringSkills: Object
         ├─ goals: Object
         └─ completedBy: Object
```

---

**Last Updated**: 2025-10-21
**Version**: 1.0
**Status**: ✅ Complete Integration
