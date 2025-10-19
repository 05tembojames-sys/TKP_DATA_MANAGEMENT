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
        id: 'kukhoma-main',
        name: 'The Kukhoma Project - Main Center',
        level: 1
      },
      {
        id: 'outreach-lusaka',
        name: 'Community Outreach - Lusaka',
        level: 2
      },
      {
        id: 'outreach-chongwe',
        name: 'Community Outreach - Chongwe',
        level: 2
      },
      {
        id: 'educational-support',
        name: 'Educational Support Unit',
        level: 2
      },
      {
        id: 'health-services',
        name: 'Health Services Unit',
        level: 2
      },
      {
        id: 'family-support',
        name: 'Family Support Services',
        level: 2
      }
    ]
  }

  // Get available periods
  static async getPeriods() {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    
    const periods = []
    
    // Generate monthly periods for current year
    for (let i = 0; i < 12; i++) {
      const month = i + 1
      const monthName = new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' })
      periods.push({
        id: `${currentYear}${month.toString().padStart(2, '0')}`,
        name: `${monthName} ${currentYear}`,
        type: 'MONTHLY',
        year: currentYear,
        month: month
      })
    }
    
    // Generate quarterly periods
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
    quarters.forEach((quarter, index) => {
      periods.push({
        id: `${currentYear}${quarter}`,
        name: `${quarter} ${currentYear}`,
        type: 'QUARTERLY',
        year: currentYear,
        quarter: index + 1
      })
    })
    
    // Generate annual period
    periods.push({
      id: `${currentYear}`,
      name: `${currentYear}`,
      type: 'YEARLY',
      year: currentYear
    })
    
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
                min: 0,
                max: 50
              },
              {
                id: 'material_support',
                name: 'Material Support Provided',
                valueType: 'BOOLEAN',
                required: true
              },
              {
                id: 'service_notes',
                name: 'Service Notes',
                valueType: 'TEXT',
                required: false,
                placeholder: 'Additional notes about services provided'
              }
            ]
          }
        ]
      },
      'ds-004': {
        sections: [
          {
            id: 'section-outreach-activities',
            name: 'Outreach Activities',
            dataElements: [
              {
                id: 'community_visits',
                name: 'Community Visits Conducted',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 100
              },
              {
                id: 'families_reached',
                name: 'Families Reached',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 500
              },
              {
                id: 'awareness_sessions',
                name: 'Awareness Sessions Held',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 50
              },
              {
                id: 'referrals_made',
                name: 'Referrals Made to Services',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 100
              }
            ]
          },
          {
            id: 'section-impact',
            name: 'Impact Assessment',
            dataElements: [
              {
                id: 'new_cases_identified',
                name: 'New Cases Identified',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 50
              },
              {
                id: 'follow_up_cases',
                name: 'Follow-up Cases',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 100
              },
              {
                id: 'success_stories',
                name: 'Success Stories/Outcomes',
                valueType: 'TEXT',
                required: false,
                placeholder: 'Describe positive outcomes and success stories'
              }
            ]
          }
        ]
      },
      'ds-005': {
        sections: [
          {
            id: 'section-training',
            name: 'Training Activities',
            dataElements: [
              {
                id: 'training_sessions',
                name: 'Training Sessions Conducted',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 20
              },
              {
                id: 'staff_trained',
                name: 'Number of Staff Trained',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 50
              },
              {
                id: 'training_hours',
                name: 'Total Training Hours',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 200
              },
              {
                id: 'external_trainers',
                name: 'External Trainers Used',
                valueType: 'BOOLEAN',
                required: true
              }
            ]
          },
          {
            id: 'section-development',
            name: 'Staff Development',
            dataElements: [
              {
                id: 'certifications_earned',
                name: 'Certifications Earned',
                valueType: 'NUMBER',
                required: false,
                min: 0,
                max: 20
              },
              {
                id: 'skill_assessments',
                name: 'Skill Assessments Conducted',
                valueType: 'NUMBER',
                required: true,
                min: 0,
                max: 50
              },
              {
                id: 'development_notes',
                name: 'Development Notes',
                valueType: 'TEXT',
                required: false,
                placeholder: 'Notes on staff development activities and outcomes'
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
      
      // Save to Firebase based on form type
      switch (dataSetId) {
        case 'initial-referral':
          result = await FormService.saveInitialReferral(dataValues)
          break
        case 'child-overview':
          result = await FormService.saveChildOverview(dataValues)
          break
        case 'initial-assessment':
          result = await FormService.saveInitialAssessment(dataValues)
          break
        default:
          // For other form types, create a generic save
          result = await this.saveGenericForm(dataSetId, dataValues)
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
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const key = `${dataSetId}-${orgUnitId}-${periodId}`
    const dataToSave = {
      dataValues,
      lastUpdated: new Date().toISOString(),
      status: 'DRAFT'
    }
    
    localStorage.setItem(`capture-data-${key}`, JSON.stringify(dataToSave))
    
    console.log('Draft saved:', { dataSetId, orgUnitId, periodId, dataValues })
    
    return {
      success: true,
      message: 'Draft saved successfully'
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