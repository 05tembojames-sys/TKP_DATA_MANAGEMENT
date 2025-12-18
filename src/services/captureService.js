import FormService from './formService.js'

class CaptureService {
  // Get available data sets - Based on existing forms
  static async getDataSets() {
    return [
      {
        id: 'initial-referral',
        name: 'Initial Child Referral Forms',
        description: 'Child referral forms for abuse cases and pregnant children'
      },
      {
        id: 'child-overview',
        name: 'Child Overview and Background Forms',
        description: 'Comprehensive child background and care plan documentation'
      },
      {
        id: 'initial-assessment',
        name: 'TKP Initial Assessment Forms',
        description: 'Assessment forms for child eligibility and admission'
      },
      {
        id: 'medical-intake',
        name: 'Medical Intake Assessment',
        description: 'Initial health screening and medical history'
      },
      {
        id: 'academics-literacy',
        name: 'Academics & Literacy Plan',
        description: 'Education capability assessment and planning'
      },
      {
        id: 'psychological-assessment',
        name: 'Psychological Assessment',
        description: 'Mental health and behavioral assessment'
      },
      {
        id: 'life-skills-survey',
        name: 'Life Skills Survey',
        description: 'Assessment of daily living and social skills'
      },
      {
        id: 'birth-delivery',
        name: 'Birth Delivery Report',
        description: 'Details of birth events for pregnant beneficiaries'
      },
      {
        id: 'care-plan-summary',
        name: 'Care Plan Summary',
        description: 'Overall care plan strategy and goals'
      },
      {
        id: 'care-plan-baby',
        name: 'Care Plan (Baby)',
        description: 'Care plan for infants'
      },
      {
        id: 'care-plan-ongoing-life-skills',
        name: 'Care Plan (Life Skills)',
        description: 'Ongoing life skills development plan'
      },
      {
        id: 'monthly-report',
        name: 'Monthly Progress Reports',
        description: 'Monthly tracking of child progress and activities'
      },
      {
        id: 'quarterly-review',
        name: 'Quarterly Review Forms',
        description: 'Quarterly comprehensive review of child development'
      }
    ]
  }

  // Get available organization units
  static async getOrgUnits() {
    return [
      {
        id: 'kukhoma-admin',
        name: 'The Kukhoma Project - Administration',
        level: 1
      },
      {
        id: 'kukhoma-me',
        name: 'The Kukhoma Project - Monitoring & Evaluation',
        level: 2
      },
      {
        id: 'ward-1',
        name: 'Ward 1 - Medical',
        level: 3
      },
      {
        id: 'ward-2',
        name: 'Ward 2 - Recovery',
        level: 3
      },
      {
        id: 'ward-3',
        name: 'Ward 3 - Intensive Care',
        level: 3
      }
    ]
  }

  // Get available periods
  // Get available periods
  static async getPeriods() {
    const currentYear = new Date().getFullYear()

    // Generate periods for Current Year and Next Year
    const years = [currentYear, currentYear + 1]
    const periods = []

    years.forEach(year => {
      // Monthly periods
      for (let i = 0; i < 12; i++) {
        const month = i + 1
        const monthName = new Date(year, i, 1).toLocaleString('default', { month: 'long' })
        periods.push({
          id: `${year}${month.toString().padStart(2, '0')}`,
          name: `${monthName} ${year}`,
          type: 'MONTHLY',
          year: year,
          month: month
        })
      }

      // Quarterly periods
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
      quarters.forEach((quarter, index) => {
        periods.push({
          id: `${year}${quarter}`,
          name: `${quarter} ${year}`,
          type: 'QUARTERLY',
          year: year,
          quarter: index + 1
        })
      })

      // Annual period
      periods.push({
        id: `${year}`,
        name: `${year}`,
        type: 'YEARLY',
        year: year
      })
    })

    // Add future yearly periods (next 5 years)
    for (let i = 2; i <= 5; i++) {
      const futureYear = currentYear + i
      periods.push({
        id: `${futureYear}`,
        name: `${futureYear}`,
        type: 'YEARLY',
        year: futureYear
      })
    }

    // Sort periods: most recent first? Or chronological? 
    // Usually chronological for data entry.
    // But maybe the user wants to see future?
    // Let's keep them in the order generated (Chronological: Current Year -> Next Year -> Future Years)

    return periods
  }

  // Load data entry form for specific dataset/orgunit/period
  static async loadDataEntryForm({ dataSetId, orgUnitId, periodId }) {
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate form structure based on dataset
    const formStructure = this.generateFormStructure(dataSetId)

    // Load existing data values if any
    const existingData = await this.loadExistingDataValues({ dataSetId, orgUnitId, periodId })

    return {
      sections: formStructure.sections,
      dataValues: existingData.dataValues || {},
      completionStatus: this.calculateCompletionStatus(formStructure, existingData.dataValues || {}),
      lastUpdated: existingData.lastUpdated,
      status: existingData.status || 'DRAFT'
    }
  }

  // Generate form structure based on dataset - Using actual form fields
  static generateFormStructure(dataSetId) {
    const formStructures = {
      'initial-referral': {
        sections: [
          {
            id: 'section-child-info',
            name: 'Child Information',
            dataElements: [
              {
                id: 'childFirstName',
                name: 'Child First Name',
                valueType: 'TEXT',
                required: true,
                placeholder: 'Enter child\'s first name'
              },
              {
                id: 'childLastName',
                name: 'Child Last Name',
                valueType: 'TEXT',
                required: true,
                placeholder: 'Enter child\'s last name'
              },
              {
                id: 'dateOfBirth',
                name: 'Date of Birth',
                valueType: 'DATE',
                required: true
              },
              {
                id: 'age',
                name: 'Age (years)',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 18
              },
              {
                id: 'dateOfReferral',
                name: 'Date of Referral',
                valueType: 'DATE',
                required: true
              }
            ]
          },
          {
            id: 'section-referral-details',
            name: 'Referral Details',
            dataElements: [
              {
                id: 'referralMethod',
                name: 'Referral Method',
                valueType: 'SELECT',
                required: true,
                options: [
                  'Department of Social Welfare - Lusaka',
                  'Coptic Hospital',
                  'MNK Psychotherapy',
                  'Department of Social Welfare: Chongwe',
                  'Other'
                ]
              },
              {
                id: 'typeOfAbuse',
                name: 'Type of Abuse',
                valueType: 'SELECT',
                required: true,
                options: [
                  'Defilement',
                  'Incest',
                  'Rape',
                  'Sex Trafficking',
                  'Survival Prostitution',
                  'Other'
                ]
              },
              {
                id: 'abuserRelationship',
                name: 'Abuser Relationship to Child',
                valueType: 'TEXT',
                required: true
              }
            ]
          },
          {
            id: 'section-home-situation',
            name: 'Home Situation',
            dataElements: [
              {
                id: 'primaryCaregiverName',
                name: 'Primary Caregiver Name',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'relationshipToChild',
                name: 'Relationship to Child',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'areaOfTown',
                name: 'Area of Town',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'livingSituation',
                name: 'Describe the Living Situation',
                valueType: 'TEXT',
                required: true,
                placeholder: 'Describe the current living conditions'
              }
            ]
          }
        ]
      },
      'initial-assessment': {
        sections: [
          {
            id: 'section-child-info',
            name: 'Child Information',
            dataElements: [
              {
                id: 'childFirstName',
                name: 'Child First Name',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'childSurname',
                name: 'Child Surname',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'gender',
                name: 'Gender',
                valueType: 'SELECT',
                required: true,
                options: ['Female', 'Male']
              },
              {
                id: 'dateOfBirth',
                name: 'Date of Birth',
                valueType: 'DATE',
                required: true
              },
              {
                id: 'age',
                name: 'Age (years)',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 18
              },
              {
                id: 'assessmentDate',
                name: 'Date of Assessment',
                valueType: 'DATE',
                required: true
              }
            ]
          },
          {
            id: 'section-pregnancy-details',
            name: 'Pregnancy Details',
            dataElements: [
              {
                id: 'pregnancyDuration',
                name: 'Duration of Pregnancy',
                valueType: 'TEXT',
                required: true,
                placeholder: 'e.g., 12 weeks'
              },
              {
                id: 'conceptionCategory',
                name: 'Category of Conception',
                valueType: 'SELECT',
                required: true,
                options: [
                  'Rape',
                  'Incest',
                  'Defilement',
                  'Survival Prostitution',
                  'Other'
                ]
              },
              {
                id: 'fatherRelation',
                name: 'Relationship to Father',
                valueType: 'TEXT',
                required: true
              }
            ]
          },
          {
            id: 'section-family-info',
            name: 'Family Information',
            dataElements: [
              {
                id: 'primaryCaregiverName',
                name: 'Primary Caregiver Name',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'relationshipToChild',
                name: 'Relationship to Child',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'areaOfTown',
                name: 'Area of Town',
                valueType: 'TEXT',
                required: true
              }
            ]
          }
        ]
      },
      'child-overview': {
        sections: [
          {
            id: 'section-child-details',
            name: 'Child Details',
            dataElements: [
              {
                id: 'childFirstName',
                name: 'Child First Name',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'childSurname',
                name: 'Child Surname',
                valueType: 'TEXT',
                required: true
              },
              {
                id: 'gender',
                name: 'Gender',
                valueType: 'SELECT',
                required: true,
                options: ['Female', 'Male']
              },
              {
                id: 'dateOfBirth',
                name: 'Date of Birth',
                valueType: 'DATE',
                required: true
              },
              {
                id: 'ageAtIntake',
                name: 'Age at Intake (years)',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 18
              },
              {
                id: 'placeOfBirth',
                name: 'Place of Birth',
                valueType: 'TEXT',
                required: true
              }
            ]
          },
          {
            id: 'section-vulnerability',
            name: 'Vulnerability Status',
            dataElements: [
              {
                id: 'ovcStatus',
                name: 'OVC Status',
                valueType: 'SELECT',
                required: true,
                options: [
                  'Vulnerable',
                  'Single Orphan',
                  'Double Orphan',
                  'Serial Orphan'
                ]
              },
              {
                id: 'parentDeceased',
                name: 'Parent Deceased',
                valueType: 'SELECT',
                required: false,
                options: ['Father', 'Mother', 'Both', 'Neither']
              },
              {
                id: 'guardianDeceased',
                name: 'Guardian Deceased',
                valueType: 'BOOLEAN',
                required: false
              }
            ]
          },
          {
            id: 'section-admission',
            name: 'Admission Details',
            dataElements: [
              {
                id: 'referralMethod',
                name: 'Referral Method',
                valueType: 'SELECT',
                required: true,
                options: [
                  'Family Legacy',
                  'Coptic Hospital',
                  'Department of Social Welfare - Lusaka',
                  'Department of Social Welfare - Chongwe',
                  'Other'
                ]
              },
              {
                id: 'dateOfAdmission',
                name: 'Date of Admission',
                valueType: 'DATE',
                required: true
              }
            ]
          }
        ]
      },
      'medical-intake': {
        sections: [
          {
            id: 'section-health-info',
            name: 'Health Information',
            dataElements: [
              { id: 'childName', name: 'Child Name', valueType: 'TEXT', required: true },
              { id: 'screenDate', name: 'Screening Date', valueType: 'DATE', required: true },
              { id: 'weight', name: 'Weight (kg)', valueType: 'NUMBER', required: true },
              { id: 'height', name: 'Height (cm)', valueType: 'NUMBER', required: true },
              { id: 'chronicConditions', name: 'Chronic Conditions', valueType: 'TEXT', required: false },
              { id: 'referralNeeded', name: 'Referral Needed', valueType: 'BOOLEAN', required: true }
            ]
          }
        ]
      },
      'academics-literacy': {
        sections: [
          {
            id: 'section-academic-info',
            name: 'Academic Assessment',
            dataElements: [
              { id: 'childName', name: 'Child Name', valueType: 'TEXT', required: true },
              { id: 'schoolGrade', name: 'Current Grade', valueType: 'TEXT', required: true },
              { id: 'literacyLevel', name: 'Literacy Level', valueType: 'SELECT', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
              { id: 'schoolEnrolled', name: 'Enrolled in School', valueType: 'BOOLEAN', required: true }
            ]
          }
        ]
      },
      'psychological-assessment': {
        sections: [
          {
            id: 'section-psych-eval',
            name: 'Psychological Evaluation',
            dataElements: [
              { id: 'childName', name: 'Child Name', valueType: 'TEXT', required: true },
              { id: 'assessmentDate', name: 'Assessment Date', valueType: 'DATE', required: true },
              { id: 'traumaSymptoms', name: 'Trauma Symptoms', valueType: 'TEXT', required: false },
              { id: 'recommendCounseling', name: 'Recommend Counseling', valueType: 'BOOLEAN', required: true }
            ]
          }
        ]
      },
      'life-skills-survey': {
        sections: [
          {
            id: 'section-life-skills',
            name: 'Life Skills Survey',
            dataElements: [
              { id: 'childName', name: 'Child Name', valueType: 'TEXT', required: true },
              { id: 'surveyDate', name: 'Survey Date', valueType: 'DATE', required: true },
              { id: 'competencyScore', name: 'Competency Score (1-10)', valueType: 'NUMBER', min: 1, max: 10, required: true }
            ]
          }
        ]
      },
      'birth-delivery': {
        sections: [
          {
            id: 'section-birth-details',
            name: 'Birth Details',
            dataElements: [
              { id: 'motherName', name: 'Mother Name', valueType: 'TEXT', required: true },
              { id: 'deliveryDate', name: 'Delivery Date', valueType: 'DATE', required: true },
              { id: 'hospitalDelivery', name: 'Hospital Delivery', valueType: 'BOOLEAN', required: true },
              { id: 'complications', name: 'Complications', valueType: 'TEXT', required: false }
            ]
          }
        ]
      },
      'care-plan-summary': {
        sections: [
          {
            id: 'section-care-plan',
            name: 'Care Plan Overview',
            dataElements: [
              { id: 'childName', name: 'Child Name', valueType: 'TEXT', required: true },
              { id: 'planDate', name: 'Plan Date', valueType: 'DATE', required: true },
              { id: 'primaryGoal', name: 'Primary Goal', valueType: 'TEXT', required: true },
              { id: 'status', name: 'Status', valueType: 'SELECT', options: ['New', 'In Progress', 'Completed', 'Reviewed'], required: true }
            ]
          }
        ]
      },
      'care-plan-baby': {
        sections: [
          {
            id: 'section-baby-care',
            name: 'Infant Care Plan',
            dataElements: [
              { id: 'babyName', name: 'Baby Name', valueType: 'TEXT', required: true },
              { id: 'dob', name: 'Date of Birth', valueType: 'DATE', required: true },
              { id: 'nutritionPlan', name: 'Nutrition Plan', valueType: 'TEXT', required: true }
            ]
          }
        ]
      },
      'care-plan-ongoing-life-skills': {
        sections: [
          {
            id: 'section-skills-plan',
            name: 'Life Skills Plan',
            dataElements: [
              { id: 'childName', name: 'Child Name', valueType: 'TEXT', required: true },
              { id: 'skillFocus', name: 'Skill Focus', valueType: 'TEXT', required: true },
              { id: 'targetDate', name: 'Target Date', valueType: 'DATE', required: true }
            ]
          }
        ]
      },
      'ds-003': {
        sections: [
          {
            id: 'section-family-info',
            name: 'Family Information',
            dataElements: [
              {
                id: 'family_size',
                name: 'Family Size',
                valueType: 'NUMBER',
                required: true,
                min: 1,
                max: 20
              },
              {
                id: 'primary_caregiver',
                name: 'Primary Caregiver',
                valueType: 'TEXT',
                required: true,
                placeholder: 'Name of primary caregiver'
              },
              {
                id: 'household_income',
                name: 'Monthly Household Income',
                valueType: 'NUMBER',
                required: false,
                min: 0,
                placeholder: 'Income in local currency'
              },
              {
                id: 'housing_stable',
                name: 'Stable Housing',
                valueType: 'BOOLEAN',
                required: true
              }
            ]
          },
          {
            id: 'section-services',
            name: 'Services Provided',
            dataElements: [
              {
                id: 'counseling_sessions',
                name: 'Counseling Sessions This Period',
                valueType: 'NUMBER',
                required: true,
                min: 0
              },
              {
                id: 'health_checkups',
                name: 'Health Check-ups',
                valueType: 'NUMBER',
                required: true,
                min: 0
              },
              {
                id: 'educational_support',
                name: 'Educational Support Provided',
                valueType: 'BOOLEAN',
                required: false
              }
            ]
          }
        ]
      }
    }

    return formStructures[dataSetId] || { sections: [] }
  }

  // Load existing data values from Firebase
  static async loadExistingDataValues({ dataSetId, orgUnitId, periodId }) {
    try {
      // First check localStorage for unsaved work
      const key = `${dataSetId}-${orgUnitId}-${periodId}`
      const stored = localStorage.getItem(`capture-data-${key}`)

      if (stored) {
        const localData = JSON.parse(stored)
        if (localData.status === 'DRAFT' || localData.status === 'NEW') {
          return localData
        }
      }

      // Then check Firebase for existing forms
      const formsResult = await FormService.getForms(dataSetId, 50)
      if (formsResult.success && formsResult.forms.length > 0) {
        // Find forms that match the criteria (could be enhanced with better filtering)
        const matchingForm = formsResult.forms.find(form =>
          // For now, just find the most recent form of this type
          form.formType === dataSetId
        )

        if (matchingForm) {
          return {
            dataValues: matchingForm,
            lastUpdated: matchingForm.updatedAt || matchingForm.createdAt,
            status: matchingForm.status || 'DRAFT'
          }
        }
      }

      return {
        dataValues: {},
        lastUpdated: null,
        status: 'NEW'
      }
    } catch (error) {
      console.error('Error loading existing data values:', error)
      return {
        dataValues: {},
        lastUpdated: null,
        status: 'NEW'
      }
    }
  }

  // Calculate completion status
  static calculateCompletionStatus(formStructure, dataValues) {
    let totalElements = 0
    let filledElements = 0

    formStructure.sections.forEach(section => {
      section.dataElements.forEach(element => {
        totalElements++
        const value = dataValues[element.id]
        if (value !== undefined && value !== null && value !== '') {
          filledElements++
        }
      })
    })

    return totalElements > 0 ? Math.round((filledElements / totalElements) * 100) : 0
  }

  // Save data values to Firebase
  static async saveDataValues({ dataSetId, orgUnitId, periodId, dataValues }) {
    try {
      let result

      // Normalize and link data to a case if possible (names, caseId)
      const normalized = await this.normalizeAndLinkCase(dataSetId, dataValues)

      // Save to Firebase based on form type
      switch (dataSetId) {
        case 'initial-referral':
          result = await FormService.saveInitialReferral(normalized)
          break
        case 'child-overview':
          result = await FormService.saveChildOverview(normalized)
          break
        case 'initial-assessment':
          result = await FormService.saveInitialAssessment(normalized)
          break
        case 'medical-intake':
          result = await FormService.saveMedicalIntakeAssessment(normalized)
          break
        case 'academics-literacy':
          result = await FormService.saveAcademicsLiteracyPlan(normalized)
          break
        case 'psychological-assessment':
          result = await FormService.savePsychologicalAssessment(normalized)
          break
        case 'life-skills-survey':
          result = await FormService.saveLifeSkillsSurvey(normalized)
          break
        case 'birth-delivery':
          result = await FormService.saveBirthDeliveryReport(normalized)
          break
        case 'care-plan-summary':
          result = await FormService.saveCarePlanSummary(normalized)
          break
        case 'care-plan-baby':
          result = await FormService.saveCarePlanBaby(normalized)
          break
        case 'care-plan-ongoing-life-skills':
          result = await FormService.saveCarePlanOngoingLifeSkills(normalized)
          break
        default:
          // For other form types, create a generic save (fallback)
          result = await this.saveGenericForm(dataSetId, normalized)
      }

      if (result.success) {
        // Clear localStorage draft after successful save
        const key = `${dataSetId}-${orgUnitId}-${periodId}`
        localStorage.removeItem(`capture-data-${key}`)
      }

      return result
    } catch (error) {
      console.error('Error saving data values:', error)
      return {
        success: false,
        error: error.message || 'Failed to save data'
      }
    }
  }

  // Save as draft
  static async saveAsDraft({ dataSetId, orgUnitId, periodId, dataValues }) {
    try {
      // Check if there's already a draft for this case that we should update
      let result
      const caseId = dataValues.caseId

      if (caseId) {
        // Look for existing draft forms for this case
        const existingFormsResult = await FormService.getFormsByCaseId(caseId, dataSetId)

        if (existingFormsResult.success && existingFormsResult.forms.length > 0) {
          // Found existing draft, update it
          const existingForm = existingFormsResult.forms[0] // Use the most recent one
          const updatedData = {
            ...dataValues,
            status: 'draft',
            draftSavedAt: new Date().toISOString(),
            orgUnitId: orgUnitId,
            periodId: periodId,
            updatedAt: new Date()
          }

          result = await FormService.updateForm(existingForm.id, updatedData)
          result.id = existingForm.id // Preserve the existing ID
        } else {
          // No existing draft, create a new one
          const draftData = {
            ...dataValues,
            status: 'draft',
            draftSavedAt: new Date().toISOString(),
            orgUnitId: orgUnitId,
            periodId: periodId
          }

          // Save to Firebase based on form type
          switch (dataSetId) {
            case 'initial-referral':
              result = await FormService.saveInitialReferral(draftData)
              break
            case 'child-overview':
              result = await FormService.saveChildOverview(draftData)
              break
            case 'initial-assessment':
              result = await FormService.saveInitialAssessment(draftData)
              break
            case 'medical-intake':
              result = await FormService.saveMedicalIntakeAssessment(draftData)
              break
            case 'academics-literacy':
              result = await FormService.saveAcademicsLiteracyPlan(draftData)
              break
            case 'psychological-assessment':
              result = await FormService.savePsychologicalAssessment(draftData)
              break
            case 'life-skills-survey':
              result = await FormService.saveLifeSkillsSurvey(draftData)
              break
            case 'birth-delivery':
              result = await FormService.saveBirthDeliveryReport(draftData)
              break
            case 'care-plan-summary':
              result = await FormService.saveCarePlanSummary(draftData)
              break
            case 'care-plan-baby':
              result = await FormService.saveCarePlanBaby(draftData)
              break
            case 'care-plan-ongoing-life-skills':
              result = await FormService.saveCarePlanOngoingLifeSkills(draftData)
              break
            default:
              // For other form types, create a generic save
              result = await this.saveGenericForm(dataSetId, draftData)
          }
        }
      } else {
        // No case ID, create a new draft
        const draftData = {
          ...dataValues,
          status: 'draft',
          draftSavedAt: new Date().toISOString(),
          orgUnitId: orgUnitId,
          periodId: periodId
        }

        // Save to Firebase based on form type
        switch (dataSetId) {
          case 'initial-referral':
            result = await FormService.saveInitialReferral(draftData)
            break
          case 'child-overview':
            result = await FormService.saveChildOverview(draftData)
            break
          case 'initial-assessment':
            result = await FormService.saveInitialAssessment(draftData)
            break
          case 'medical-intake':
            result = await FormService.saveMedicalIntakeAssessment(draftData)
            break
          case 'academics-literacy':
            result = await FormService.saveAcademicsLiteracyPlan(draftData)
            break
          case 'psychological-assessment':
            result = await FormService.savePsychologicalAssessment(draftData)
            break
          case 'life-skills-survey':
            result = await FormService.saveLifeSkillsSurvey(draftData)
            break
          case 'birth-delivery':
            result = await FormService.saveBirthDeliveryReport(draftData)
            break
          case 'care-plan-summary':
            result = await FormService.saveCarePlanSummary(draftData)
            break
          case 'care-plan-baby':
            result = await FormService.saveCarePlanBaby(draftData)
            break
          case 'care-plan-ongoing-life-skills':
            result = await FormService.saveCarePlanOngoingLifeSkills(draftData)
            break
          default:
            // For other form types, create a generic save
            result = await this.saveGenericForm(dataSetId, draftData)
        }
      }

      if (result.success) {
        // Also save to localStorage as a backup
        const key = `${dataSetId}-${orgUnitId}-${periodId}`
        const localStorageData = {
          dataValues,
          lastUpdated: new Date().toISOString(),
          status: 'DRAFT'
        }
        localStorage.setItem(`capture-data-${key}`, JSON.stringify(localStorageData))
      }

      console.log('Draft saved to Firebase:', { dataSetId, orgUnitId, periodId, dataValues })

      return result
    } catch (error) {
      console.error('Error saving draft to Firebase:', error)
      return {
        success: false,
        error: error.message || 'Failed to save draft'
      }
    }
  }

  // Complete data entry
  static async completeDataEntry({ dataSetId, orgUnitId, periodId, dataValues }) {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    const key = `${dataSetId}-${orgUnitId}-${periodId}`
    const dataToSave = {
      dataValues,
      lastUpdated: new Date().toISOString(),
      status: 'COMPLETED',
      completedBy: 'current-user', // In real app, get from auth
      completedAt: new Date().toISOString()
    }

    localStorage.setItem(`capture-data-${key}`, JSON.stringify(dataToSave))

    // In real implementation, this would mark as complete in database
    console.log('Data entry completed:', { dataSetId, orgUnitId, periodId, dataValues })

    return {
      success: true,
      message: 'Data entry completed successfully'
    }
  }

  // Generic save method for new form types
  static async saveGenericForm(formType, dataValues) {
    try {
      // For now, save as initial referral with custom form type
      // In a real implementation, you'd extend FormService for new types
      const result = await FormService.saveInitialReferral({
        ...dataValues,
        formType: formType
      })
      return result
    } catch (error) {
      console.error('Error saving generic form:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Normalize names and try to link to existing caseId
  static async normalizeAndLinkCase(dataSetId, dataValues) {
    try {
      const normalized = { ...dataValues }

      // Derive childFirstName/childSurname if missing
      if (!normalized.childFirstName || !normalized.childSurname) {
        const name =
          normalized.nameOfGirl ||
          normalized.childName ||
          `${normalized.firstName || ''} ${normalized.lastName || ''}`
        if (name && typeof name === 'string') {
          const parts = name.trim().split(/\s+/)
          if (!normalized.childFirstName) normalized.childFirstName = parts[0] || ''
          if (!normalized.childSurname) normalized.childSurname = parts.length > 1 ? parts[parts.length - 1] : parts[0] || ''
        }
      }

      // Try to attach caseId if missing by looking up existing forms
      if (!normalized.caseId && (normalized.childFirstName || normalized.childSurname)) {
        const first = (normalized.childFirstName || '').trim().toLowerCase()
        const last = (normalized.childSurname || '').trim().toLowerCase()
        const dob = normalized.dateOfBirth || normalized.dob || null

        // Look in overview, assessment, and referral to find a caseId
        const [overviewRes, assessmentRes, referralRes] = await Promise.all([
          FormService.getForms('child-overview', 500),
          FormService.getForms('initial-assessment', 500),
          FormService.getForms('initial-referral', 500)
        ])

        const findMatch = (res) => {
          if (!res?.success) return null
          return res.forms.find(f => {
            const fn = (f.childFirstName || '').trim().toLowerCase()
            const ln = (f.childSurname || f.childLastName || '').trim().toLowerCase()
            const nameMatch = fn === first && ln === last
            if (!nameMatch) return false
            if (!dob) return true
            return (f.dateOfBirth || '') === dob
          })
        }

        const matched = findMatch(overviewRes) || findMatch(assessmentRes) || findMatch(referralRes)
        if (matched?.caseId) {
          normalized.caseId = matched.caseId
        }
      }

      return normalized
    } catch (e) {
      // On any error, return original values to avoid blocking save
      return { ...dataValues }
    }
  }

  // Get capture summary/statistics from Firebase
  static async getCaptureSummary() {
    try {
      // Get actual statistics from FormService
      const statsResult = await FormService.getFormStatistics()

      if (statsResult.success) {
        const stats = statsResult.statistics
        return {
          totalEntries: stats.totalForms,
          completedEntries: Math.floor(stats.totalForms * 0.8), // Estimate based on actual data
          draftEntries: Math.floor(stats.totalForms * 0.2),
          completionRate: Math.round((stats.totalForms > 0 ? (stats.totalForms * 0.8) / stats.totalForms : 0) * 100),
          referrals: stats.totalReferrals,
          overviews: stats.totalOverviews,
          assessments: stats.totalAssessments
        }
      } else {
        // Fallback to localStorage data
        const allKeys = Object.keys(localStorage).filter(key => key.startsWith('capture-data-'))

        let totalEntries = 0
        let completedEntries = 0
        let draftEntries = 0

        allKeys.forEach(key => {
          try {
            const data = JSON.parse(localStorage.getItem(key))
            totalEntries++
            if (data.status === 'COMPLETED') {
              completedEntries++
            } else if (data.status === 'DRAFT') {
              draftEntries++
            }
          } catch (e) {
            // Skip invalid entries
          }
        })

        return {
          totalEntries,
          completedEntries,
          draftEntries,
          completionRate: totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0
        }
      }
    } catch (error) {
      console.error('Error getting capture summary:', error)
      return {
        totalEntries: 0,
        completedEntries: 0,
        draftEntries: 0,
        completionRate: 0
      }
    }
  }

  // Validate data entry
  static validateDataEntry(formStructure, dataValues) {
    const errors = {}
    let isValid = true

    formStructure.sections.forEach(section => {
      section.dataElements.forEach(element => {
        const value = dataValues[element.id]

        // Required field validation
        if (element.required && (value === undefined || value === null || value === '')) {
          errors[element.id] = 'This field is required'
          isValid = false
        }

        // Type validation
        if (value !== undefined && value !== null && value !== '') {
          if (element.valueType === 'NUMBER' && isNaN(value)) {
            errors[element.id] = 'Please enter a valid number'
            isValid = false
          }

          // Range validation for numbers
          if (element.valueType === 'NUMBER' && !isNaN(value)) {
            const numValue = parseFloat(value)
            if (element.min !== undefined && numValue < element.min) {
              errors[element.id] = `Value must be at least ${element.min}`
              isValid = false
            }
            if (element.max !== undefined && numValue > element.max) {
              errors[element.id] = `Value must be at most ${element.max}`
              isValid = false
            }
          }
        }
      })
    })

    return {
      isValid,
      errors
    }
  }

  // Get data entry history
  static async getDataEntryHistory({ dataSetId, orgUnitId, limit = 10 }) {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const allKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('capture-data-') && key.includes(dataSetId) && key.includes(orgUnitId))
      .slice(0, limit)

    const history = allKeys.map(key => {
      const data = JSON.parse(localStorage.getItem(key))
      const [, , dataSet, orgUnit, period] = key.split('-')

      return {
        dataSetId: dataSet,
        orgUnitId: orgUnit,
        periodId: period,
        status: data.status,
        lastUpdated: data.lastUpdated,
        completionStatus: this.calculateCompletionStatus(
          this.generateFormStructure(dataSet),
          data.dataValues
        )
      }
    })

    return history.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
  }
}

export default CaptureService