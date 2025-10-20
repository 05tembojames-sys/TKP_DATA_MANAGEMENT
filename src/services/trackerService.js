import FormService from './formService.js'

class TrackerService {
  
  // Create new enrollment/case - Now saves to Firebase via FormService
  static async createEnrollment(enrollmentData) {
    try {
      // Generate a unique case ID
      const caseId = this.generateCaseId()
      
      // Create the form data for the initial form type
      const formData = {
        childFirstName: enrollmentData.childFirstName,
        childLastName: enrollmentData.childLastName,
        dateOfBirth: enrollmentData.dateOfBirth,
        age: this.calculateAge(enrollmentData.dateOfBirth),
        gender: enrollmentData.gender,
        dateOfReferral: enrollmentData.enrollmentDate,
        caseId: caseId,
        program: enrollmentData.program,
        status: 'draft'
      }
      
      // Save the form using FormService based on initial form type
      let result
      switch (enrollmentData.initialFormType) {
        case 'initial-referral':
          result = await FormService.saveInitialReferral(formData)
          break
        case 'initial-assessment':
          result = await FormService.saveInitialAssessment(formData)
          break
        default:
          result = await FormService.saveChildOverview(formData)
      }
      
      if (result.success) {
        return {
          success: true,
          caseId: caseId,
          formId: result.id,
          enrollment: {
            id: result.id,
            caseId: caseId,
            childId: `CH${caseId.slice(-6)}`,
            childName: `${enrollmentData.childFirstName} ${enrollmentData.childLastName}`,
            ...formData
          }
        }
      } else {
        throw new Error(result.error)
      }
      
    } catch (error) {
      console.error('Error creating enrollment:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Get all cases - Now gets real data from Firebase forms
  static async getAllCases() {
    try {
      console.log('Loading cases from Firebase forms...')
      
      // Get all forms from Firebase
      const [referralResult, overviewResult, assessmentResult] = await Promise.all([
        FormService.getForms('initial-referral', 1000),
        FormService.getForms('child-overview', 1000),
        FormService.getForms('initial-assessment', 1000)
      ])
      
      console.log('Form results:', { 
        referrals: referralResult.forms?.length || 0, 
        overviews: overviewResult.forms?.length || 0, 
        assessments: assessmentResult.forms?.length || 0 
      })
      
      const generatedCases = await this.generateCasesFromForms()
      
      return {
        success: true,
        cases: generatedCases
      }
      
    } catch (error) {
      console.error('Error getting all cases:', error)
      return {
        success: false,
        error: error.message,
        cases: []
      }
    }
  }
  
  // Get specific case details - Now works with Firebase data
  static async getCaseDetails(caseId) {
    try {
      // First try to get the specific form by ID
      const formResult = await FormService.getFormById(caseId)
      
      let case_ = null
      
      if (formResult.success) {
        // Build case from the form data
        const form = formResult.form
        case_ = {
          id: form.id,
          caseId: form.caseId || this.generateCaseId(),
          childId: `CH${form.id.slice(-6)}`,
          childName: this.getChildNameFromForm(form),
          childFirstName: form.childFirstName || 'Unknown',
          childLastName: form.childLastName || form.childSurname || 'Child',
          dateOfBirth: this.formatFirestoreDate(form.dateOfBirth),
          gender: form.gender || 'Unknown',
          program: this.determineProgramFromForm({ ...form, sourceType: form.formType }),
          enrollmentDate: this.formatFirestoreDate(form.createdAt),
          status: form.status || 'active',
          currentStage: this.determineCurrentStage([form]),
          assignedWorker: 'System User',
          lastActivity: this.formatFirestoreDate(form.updatedAt || form.createdAt),
          age: this.getAgeFromForm(form),
          createdAt: this.formatFirestoreDate(form.createdAt),
          updatedAt: this.formatFirestoreDate(form.updatedAt || form.createdAt)
        }
      } else {
        // Fallback: generate all cases and find the one we need
        const allCases = await this.getAllCases()
        if (allCases.success) {
          case_ = allCases.cases.find(c => c.id === caseId || c.caseId === caseId)
        }
      }
      
      if (!case_) {
        // Check if there's a draft in localStorage for this case
        const draftEvents = this.loadDraftEventsFromLocalStorage(caseId)
        if (draftEvents.length > 0) {
          // Create a case from the draft data
          const latestDraft = draftEvents[0]
          const draftData = latestDraft.data
          
          case_ = {
            id: caseId,
            caseId: caseId,
            childId: `CH${caseId.slice(-6)}`,
            childName: `${draftData.childFirstName || 'Unknown'} ${draftData.childLastName || 'Child'}`,
            childFirstName: draftData.childFirstName || 'Unknown',
            childLastName: draftData.childLastName || draftData.childSurname || 'Child',
            dateOfBirth: draftData.dateOfBirth || '',
            gender: draftData.gender || 'Unknown',
            program: draftData.program || 'Unknown Program',
            enrollmentDate: latestDraft.date,
            status: 'draft',
            currentStage: latestDraft.stageId,
            assignedWorker: 'System User',
            lastActivity: latestDraft.date,
            age: draftData.age || 0,
            createdAt: latestDraft.date,
            updatedAt: latestDraft.date
          }
        } else {
          return {
            success: false,
            error: 'Case not found'
          }
        }
      }
      
      // Load events/forms for this case
      const events = await this.loadCaseEvents(caseId)
      
      return {
        success: true,
        details: {
          ...case_,
          events: events
        }
      }
      
    } catch (error) {
      console.error('Error getting case details:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Load events/forms for a specific case
  static async loadCaseEvents(caseId) {
    try {
      // Try to get forms from FormService that might be related to this case
      const [referralResult, overviewResult, assessmentResult] = await Promise.all([
        FormService.getForms('initial-referral', 50),
        FormService.getForms('child-overview', 50),
        FormService.getForms('initial-assessment', 50)
      ])
      
      const allEvents = []
      
      // Process referral forms
      if (referralResult.success) {
        referralResult.forms.forEach(form => {
          // Check if this form is for the requested case
          if (form.caseId === caseId) {
            allEvents.push({
              id: form.id,
              formType: form.status === 'draft' ? 'Initial Referral (Draft)' : 'Initial Referral',
              stageId: 'referral',
              date: form.createdAt,
              status: form.status || 'completed',
              data: form
            })
          }
        })
      }
      
      // Process overview forms
      if (overviewResult.success) {
        overviewResult.forms.forEach(form => {
          // Check if this form is for the requested case
          if (form.caseId === caseId) {
            allEvents.push({
              id: form.id,
              formType: form.status === 'draft' ? 'Child Overview (Draft)' : 'Child Overview',
              stageId: 'enrollment',
              date: form.createdAt,
              status: form.status || 'completed',
              data: form
            })
          }
        })
      }
      
      // Process assessment forms
      if (assessmentResult.success) {
        assessmentResult.forms.forEach(form => {
          // Check if this form is for the requested case
          if (form.caseId === caseId) {
            allEvents.push({
              id: form.id,
              formType: form.status === 'draft' ? 'Initial Assessment (Draft)' : 'Initial Assessment',
              stageId: 'assessment',
              date: form.createdAt,
              status: form.status || 'completed',
              data: form
            })
          }
        })
      }
      
      // Sort events by date
      allEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
      
      return allEvents
      
    } catch (error) {
      console.error('Error loading case events:', error)
      return []
    }
  }
  
  // Load draft events from localStorage
  static loadDraftEventsFromLocalStorage(caseId) {
    const events = []
    const localStorageKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('capture-data-')
    )
    
    localStorageKeys.forEach(key => {
      try {
        const storedData = JSON.parse(localStorage.getItem(key))
        if (storedData && storedData.status === 'DRAFT' && storedData.dataValues) {
          // Check if this draft is for the requested case
          if (storedData.dataValues.caseId === caseId) {
            // Extract form type from key (format: capture-data-{formType}-{orgUnit}-{period})
            const parts = key.split('-')
            const formType = parts[2]
            
            // Map form type to display name and stage
            const formTypeMap = {
              'initial-referral': { name: 'Initial Referral', stage: 'referral' },
              'initial-assessment': { name: 'Initial Assessment', stage: 'assessment' },
              'program-enrollment': { name: 'Program Enrollment', stage: 'enrollment' },
              'care-plan': { name: 'Care Plan Development', stage: 'care-plan' },
              'regular-follow-up': { name: 'Regular Follow-up', stage: 'follow-up' },
              'child-overview': { name: 'Child Overview', stage: 'enrollment' }
            }
            
            const formInfo = formTypeMap[formType] || { name: formType, stage: 'other' }
            
            events.push({
              id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              formType: `${formInfo.name} (Draft)`,
              stageId: formInfo.stage,
              date: storedData.lastUpdated || new Date().toISOString(),
              status: 'draft',
              data: storedData.dataValues
            })
          }
        }
      } catch (e) {
        console.error('Error parsing localStorage data:', e)
      }
    })
    
    return events
  }
  
  // Generate cases from existing forms - Enhanced for real Firebase data
  static async generateCasesFromForms() {
    try {
      const cases = []
      
      // Get all forms from FormService with larger limits for real data
      const [referralResult, overviewResult, assessmentResult] = await Promise.all([
        FormService.getForms('initial-referral', 1000),
        FormService.getForms('child-overview', 1000),
        FormService.getForms('initial-assessment', 1000)
      ])
      
      console.log('Raw form results:', {
        referrals: referralResult,
        overviews: overviewResult,
        assessments: assessmentResult
      })
      
      const allForms = [
        ...(referralResult.success ? referralResult.forms.map(f => ({ ...f, sourceType: 'initial-referral' })) : []),
        ...(overviewResult.success ? overviewResult.forms.map(f => ({ ...f, sourceType: 'child-overview' })) : []),
        ...(assessmentResult.success ? assessmentResult.forms.map(f => ({ ...f, sourceType: 'initial-assessment' })) : [])
      ]
      
      console.log('Total forms found:', allForms.length)
      
      if (allForms.length === 0) {
        console.log('No forms found, creating sample cases')
        return this.createSampleCases()
      }
      
      // Group forms by child (based on name and date of birth similarity)
      const childGroups = this.groupFormsByChild(allForms)
      
      console.log('Child groups created:', Object.keys(childGroups).length)
      
      // Create cases from grouped forms
      Object.keys(childGroups).forEach((childKey, index) => {
        const forms = childGroups[childKey]
        const primaryForm = forms[0] // Use first form as primary data source
        
        // Use existing caseId if available, otherwise generate new one
        const caseId = primaryForm.caseId || this.generateCaseId()
        
        const case_ = {
          id: primaryForm.id, // Use form ID as case ID for linking
          caseId: caseId,
          childId: `CH${String(index + 1).padStart(6, '0')}`,
          childName: this.getChildNameFromForm(primaryForm),
          childFirstName: primaryForm.childFirstName || 'Unknown',
          childLastName: primaryForm.childLastName || primaryForm.childSurname || 'Child',
          dateOfBirth: primaryForm.dateOfBirth ? this.formatFirestoreDate(primaryForm.dateOfBirth) : null,
          gender: primaryForm.gender || 'Unknown',
          program: this.determineProgramFromForm(primaryForm),
          enrollmentDate: this.formatFirestoreDate(primaryForm.createdAt || primaryForm.dateOfReferral),
          status: this.determineStatus(forms),
          currentStage: this.determineCurrentStage(forms),
          assignedWorker: 'System User',
          lastActivity: this.formatFirestoreDate(this.getLastActivity(forms)),
          age: this.getAgeFromForm(primaryForm),
          events: this.createEventsFromForms(forms),
          createdAt: this.formatFirestoreDate(primaryForm.createdAt),
          updatedAt: this.formatFirestoreDate(primaryForm.updatedAt || primaryForm.createdAt)
        }
        
        cases.push(case_)
      })
      
      console.log('Generated cases:', cases.length)
      
      // Sort by creation date (most recent first)
      cases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      return cases
      
    } catch (error) {
      console.error('Error generating cases from forms:', error)
      return this.createSampleCases()
    }
  }
  
  // Group forms by child - Enhanced matching logic
  static groupFormsByChild(forms) {
    const groups = {}
    
    forms.forEach(form => {
      const childName = this.getChildNameFromForm(form)
      const normalizedName = childName.toLowerCase().trim().replace(/\s+/g, ' ')
      const dateOfBirth = this.formatFirestoreDate(form.dateOfBirth)
      
      // Create a more unique key using name and date of birth
      let groupKey = normalizedName || `unknown_${form.id}`
      
      // If we have date of birth, use it to make grouping more accurate
      if (dateOfBirth) {
        groupKey = `${normalizedName}_${dateOfBirth}`
      }
      
      // Check if a similar group already exists (in case of slight name variations)
      let existingGroupKey = groupKey
      if (!groups[groupKey]) {
        // Look for similar names in existing groups
        const existingKeys = Object.keys(groups)
        const similarKey = existingKeys.find(key => {
          const keyName = key.split('_')[0] // Get name part before date
          return this.isSimilarName(keyName, normalizedName)
        })
        
        if (similarKey) {
          existingGroupKey = similarKey
        }
      }
      
      if (!groups[existingGroupKey]) {
        groups[existingGroupKey] = []
      }
      
      groups[existingGroupKey].push(form)
    })
    
    return groups
  }
  
  // Check if two names are similar (simple string similarity)
  static isSimilarName(name1, name2) {
    if (!name1 || !name2) return false
    
    // Check for exact match
    if (name1 === name2) return true
    
    // Check if one name contains the other (for partial matches)
    if (name1.length > 3 && name2.length > 3) {
      return name1.includes(name2) || name2.includes(name1)
    }
    
    return false
  }
  
  // Get child name from form data
  static getChildNameFromForm(form) {
    if (form.childFirstName && form.childLastName) {
      return `${form.childFirstName} ${form.childLastName}`
    } else if (form.childFirstName && form.childSurname) {
      return `${form.childFirstName} ${form.childSurname}`
    } else if (form.childFirstName) {
      return form.childFirstName
    } else if (form.childLastName) {
      return form.childLastName
    } else if (form.childSurname) {
      return form.childSurname
    }
    return 'Unknown Child'
  }
  
  // Determine case status from forms
  static determineStatus(forms) {
    // Check if any forms are marked as complete
    const hasCompleted = forms.some(form => form.status === 'completed' || form.status === 'complete')
    const hasDrafts = forms.some(form => form.status === 'draft')
    
    if (hasCompleted && !hasDrafts) {
      return 'completed'
    } else if (hasDrafts) {
      return 'pending'
    } else {
      return 'active'
    }
  }
  
  // Determine current stage from forms
  static determineCurrentStage(forms) {
    const formTypes = forms.map(f => f.formType)
    
    if (formTypes.includes('child-overview')) {
      return 'enrollment'
    } else if (formTypes.includes('initial-assessment')) {
      return 'assessment'
    } else if (formTypes.includes('initial-referral')) {
      return 'referral'
    }
    
    return 'referral'
  }
  
  // Get last activity date from forms
  static getLastActivity(forms) {
    const dates = forms.map(form => {
      return form.updatedAt || form.createdAt || new Date().toISOString()
    })
    
    dates.sort((a, b) => new Date(b) - new Date(a))
    return dates[0] || new Date().toISOString()
  }
  
  // Create events from forms
  static createEventsFromForms(forms) {
    return forms.map(form => ({
      id: form.id,
      formType: this.getFormTypeDisplayName(form.formType),
      stageId: this.getStageIdFromFormType(form.formType),
      date: form.createdAt || new Date().toISOString(),
      status: form.status || 'completed',
      data: form
    }))
  }
  
  // Get stage ID from form type
  static getStageIdFromFormType(formType) {
    const stageMap = {
      'initial-referral': 'referral',
      'initial-assessment': 'assessment',
      'child-overview': 'enrollment'
    }
    return stageMap[formType] || 'referral'
  }
  
  // Get display name for form type
  static getFormTypeDisplayName(formType) {
    const displayNames = {
      'initial-referral': 'Initial Referral',
      'initial-assessment': 'Initial Assessment',
      'child-overview': 'Child Overview'
    }
    return displayNames[formType] || formType
  }
  
  // Create sample cases for demo
  static createSampleCases() {
    const sampleCases = [
      {
        id: 'case-001',
        caseId: 'TKP-2024-001',
        childId: 'CH000001',
        childName: 'Maria Santos',
        childFirstName: 'Maria',
        childLastName: 'Santos',
        dateOfBirth: '2010-05-15',
        gender: 'Female',
        program: 'child-protection',
        enrollmentDate: '2024-08-15T10:00:00Z',
        status: 'active',
        currentStage: 'enrollment',
        assignedWorker: 'Sarah Johnson',
        lastActivity: '2024-10-15T14:30:00Z',
        age: 14,
        events: [],
        createdAt: '2024-08-15T10:00:00Z',
        updatedAt: '2024-10-15T14:30:00Z'
      },
      {
        id: 'case-002',
        caseId: 'TKP-2024-002',
        childId: 'CH000002',
        childName: 'John Mwansa',
        childFirstName: 'John',
        childLastName: 'Mwansa',
        dateOfBirth: '2012-02-20',
        gender: 'Male',
        program: 'family-support',
        enrollmentDate: '2024-09-01T09:15:00Z',
        status: 'active',
        currentStage: 'care-plan',
        assignedWorker: 'Michael Brown',
        lastActivity: '2024-10-18T11:45:00Z',
        age: 12,
        events: [],
        createdAt: '2024-09-01T09:15:00Z',
        updatedAt: '2024-10-18T11:45:00Z'
      },
      {
        id: 'case-003',
        caseId: 'TKP-2024-003',
        childId: 'CH000003',
        childName: 'Grace Phiri',
        childFirstName: 'Grace',
        childLastName: 'Phiri',
        dateOfBirth: '2008-11-30',
        gender: 'Female',
        program: 'pregnancy-support',
        enrollmentDate: '2024-07-10T16:20:00Z',
        status: 'completed',
        currentStage: 'follow-up',
        assignedWorker: 'Linda Thompson',
        lastActivity: '2024-10-12T13:00:00Z',
        age: 15,
        events: [],
        createdAt: '2024-07-10T16:20:00Z',
        updatedAt: '2024-10-12T13:00:00Z'
      }
    ]
    
    return sampleCases
  }
  
  // Update case information - Now updates Firebase form
  static async updateCase(caseId, updateData) {
    try {
      // Update the form in Firebase
      const updateResult = await FormService.updateForm(caseId, {
        ...updateData,
        updatedAt: new Date()
      })
      
      if (updateResult.success) {
        // Get the updated case details
        const caseDetails = await this.getCaseDetails(caseId)
        return {
          success: true,
          case: caseDetails.success ? caseDetails.details : null
        }
      } else {
        return {
          success: false,
          error: updateResult.error
        }
      }
      
    } catch (error) {
      console.error('Error updating case:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Add event to case - Now creates a new form in Firebase
  static async addEventToCase(caseId, eventData) {
    try {
      // Get the existing case to get child information
      const caseDetails = await this.getCaseDetails(caseId)
      if (!caseDetails.success) {
        return {
          success: false,
          error: 'Case not found'
        }
      }
      
      const case_ = caseDetails.details
      
      // Create form data for the new event
      const formData = {
        ...eventData,
        childFirstName: case_.childFirstName,
        childLastName: case_.childLastName,
        caseId: case_.caseId,
        linkedCaseId: caseId,
        eventDate: eventData.date || new Date().toISOString()
      }
      
      // Save as appropriate form type based on event
      let result
      const formType = eventData.formType || 'child-overview'
      
      switch (formType) {
        case 'initial-referral':
          result = await FormService.saveInitialReferral(formData)
          break
        case 'initial-assessment':
          result = await FormService.saveInitialAssessment(formData)
          break
        default:
          result = await FormService.saveChildOverview(formData)
      }
      
      if (result.success) {
        return {
          success: true,
          event: {
            id: result.id,
            ...eventData,
            date: eventData.date || new Date().toISOString()
          },
          case: case_
        }
      } else {
        return {
          success: false,
          error: result.error
        }
      }
      
    } catch (error) {
      console.error('Error adding event to case:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Get cases statistics - Now uses Firebase data
  static async getCaseStatistics() {
    try {
      const allCasesResult = await this.getAllCases()
      
      if (!allCasesResult.success) {
        throw new Error(allCasesResult.error)
      }
      
      const cases = allCasesResult.cases
      
      const stats = {
        totalCases: cases.length,
        activeCases: cases.filter(c => c.status === 'active').length,
        completedCases: cases.filter(c => c.status === 'completed').length,
        pendingCases: cases.filter(c => c.status === 'pending' || c.status === 'draft').length,
        transferredCases: cases.filter(c => c.status === 'transferred').length,
        
        // Age distribution
        ageGroups: {
          '0-5': cases.filter(c => c.age <= 5).length,
          '6-12': cases.filter(c => c.age >= 6 && c.age <= 12).length,
          '13-17': cases.filter(c => c.age >= 13 && c.age <= 17).length,
          '18+': cases.filter(c => c.age >= 18).length
        },
        
        // Stage distribution
        stages: {
          referral: cases.filter(c => c.currentStage === 'referral').length,
          assessment: cases.filter(c => c.currentStage === 'assessment').length,
          enrollment: cases.filter(c => c.currentStage === 'enrollment').length,
          'care-plan': cases.filter(c => c.currentStage === 'care-plan').length,
          'follow-up': cases.filter(c => c.currentStage === 'follow-up').length
        },
        
        // New cases this month
        newThisMonth: cases.filter(c => {
          const enrollmentDate = new Date(c.enrollmentDate)
          const thisMonth = new Date()
          thisMonth.setDate(1) // First day of current month
          return enrollmentDate >= thisMonth
        }).length
      }
      
      return {
        success: true,
        statistics: stats
      }
      
    } catch (error) {
      console.error('Error getting case statistics:', error)
      return {
        success: false,
        error: error.message,
        statistics: null
      }
    }
  }
  
  // Helper methods
  
  static generateCaseId() {
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    return `TKP-${year}-${timestamp}`
  }
  
  static generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  }
  
  static calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 0
    
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return Math.max(0, age)
  }
  
  // Format Firestore date objects to ISO string
  static formatFirestoreDate(date) {
    if (!date) return new Date().toISOString()
    
    // If it's a Firestore timestamp with toDate() method
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toISOString()
    }
    
    // If it's already a Date object or string
    return new Date(date).toISOString()
  }
  
  // Determine program from form data
  static determineProgramFromForm(form) {
    // Check form type and content to determine program
    if (form.sourceType === 'initial-referral') {
      return 'child-protection'
    } else if (form.sourceType === 'initial-assessment') {
      return 'child-protection'
    } else if (form.sourceType === 'child-overview') {
      return 'family-support'
    }
    
    return 'child-protection' // default
  }
  
  // Get age from form with fallbacks
  static getAgeFromForm(form) {
    // Try different age fields that might exist in the forms
    if (form.age && !isNaN(form.age)) {
      return parseInt(form.age)
    }
    
    if (form.ageAtIntake && !isNaN(form.ageAtIntake)) {
      return parseInt(form.ageAtIntake)
    }
    
    // Calculate from date of birth if available
    if (form.dateOfBirth) {
      return this.calculateAge(form.dateOfBirth)
    }
    
    return 0
  }
  
  // Search cases - Now uses Firebase data
  static async searchCases(query, filters = {}) {
    try {
      const allCasesResult = await this.getAllCases()
      
      if (!allCasesResult.success) {
        throw new Error(allCasesResult.error)
      }
      
      let filtered = allCasesResult.cases
      
      // Apply text search
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim()
        filtered = filtered.filter(case_ => 
          case_.childName.toLowerCase().includes(searchTerm) ||
          case_.caseId.toLowerCase().includes(searchTerm) ||
          case_.childId.toLowerCase().includes(searchTerm)
        )
      }
      
      // Apply filters
      if (filters.status) {
        filtered = filtered.filter(case_ => case_.status === filters.status)
      }
      
      if (filters.ageGroup) {
        filtered = filtered.filter(case_ => {
          const age = case_.age
          switch (filters.ageGroup) {
            case '0-5': return age <= 5
            case '6-12': return age >= 6 && age <= 12
            case '13-17': return age >= 13 && age <= 17
            case '18+': return age >= 18
            default: return true
          }
        })
      }
      
      if (filters.stage) {
        filtered = filtered.filter(case_ => case_.currentStage === filters.stage)
      }
      
      return {
        success: true,
        cases: filtered,
        count: filtered.length
      }
      
    } catch (error) {
      console.error('Error searching cases:', error)
      return {
        success: false,
        error: error.message,
        cases: [],
        count: 0
      }
    }
  }
}

export default TrackerService