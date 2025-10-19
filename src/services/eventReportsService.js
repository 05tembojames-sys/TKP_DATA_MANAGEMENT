import FormService from './formService.js'
import TrackerService from './trackerService.js'

class EventReportsService {
  // Generate event report based on configuration
  async generateReport(config) {
    try {
      console.log('Generating report with config:', config)
      
      // Get all forms based on selected program
      let forms = []
      
      if (config.program === 'child-assessment') {
        const result = await FormService.getForms('initial-assessment', 1000)
        if (result.success) {
          forms = result.forms
        }
      } else if (config.program === 'child-tracking') {
        // Get cases from tracker service
        const result = await TrackerService.getAllCases()
        if (result.success) {
          forms = result.cases.map(c => this.convertCaseToForm(c))
        }
      } else if (config.program === 'initial-referral') {
        const result = await FormService.getForms('initial-referral', 1000)
        if (result.success) {
          forms = result.forms
        }
      } else if (config.program === 'reports') {
        // Get all forms combined
        const [referralResult, overviewResult, assessmentResult] = await Promise.all([
          FormService.getForms('initial-referral', 1000),
          FormService.getForms('child-overview', 1000),
          FormService.getForms('initial-assessment', 1000)
        ])
        
        forms = [
          ...(referralResult.success ? referralResult.forms : []),
          ...(overviewResult.success ? overviewResult.forms : []),
          ...(assessmentResult.success ? assessmentResult.forms : [])
        ]
      }
      
      console.log(`Found ${forms.length} forms for program ${config.program}`)
      
      // Apply period filter
      if (config.periodType && config.selectedPeriods.length > 0) {
        forms = this.filterByPeriod(forms, config.periodType, config.selectedPeriods)
      } else if (config.periodType === 'custom' && config.startDate && config.endDate) {
        forms = this.filterByDateRange(forms, config.startDate, config.endDate)
      }
      
      console.log(`After period filter: ${forms.length} forms`)
      
      // Apply organization unit filter (if your forms have this data)
      if (config.selectedOrgUnits.length > 0) {
        // For now, we'll include all forms as org unit data might not be in all forms
        // You can enhance this when you add org unit fields to your forms
      }
      
      // Build pivot table data
      const pivotData = this.buildPivotTable(forms, config)
      
      return {
        success: true,
        ...pivotData
      }
      
    } catch (error) {
      console.error('Error generating report:', error)
      return {
        success: false,
        error: error.message,
        headers: [],
        rows: [],
        lineList: []
      }
    }
  }
  
  // Convert case to form format
  convertCaseToForm(case_) {
    return {
      id: case_.id,
      formType: 'tracker-case',
      childFirstName: case_.childFirstName,
      childLastName: case_.childLastName,
      age: case_.age,
      gender: case_.gender,
      status: case_.status,
      createdAt: case_.createdAt,
      updatedAt: case_.updatedAt
    }
  }
  
  // Filter forms by period
  filterByPeriod(forms, periodType, selectedPeriods) {
    console.log('Filtering by period:', { periodType, selectedPeriods, formsCount: forms.length })
    
    const filtered = forms.filter(form => {
      const formDate = this.getFormDate(form)
      if (!formDate) {
        console.log('Form has no valid date:', form.id)
        return false
      }
      
      const periodId = this.getFormPeriodId(formDate, periodType)
      const matches = selectedPeriods.includes(periodId)
      
      if (!matches) {
        console.log(`Form ${form.id} (${formDate.toISOString()}) -> periodId: ${periodId} not in`, selectedPeriods)
      }
      
      return matches
    })
    
    console.log(`Filtered ${filtered.length} forms from ${forms.length}`)
    return filtered
  }
  
  // Filter forms by date range
  filterByDateRange(forms, startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return forms.filter(form => {
      const formDate = this.getFormDate(form)
      if (!formDate) return false
      
      return formDate >= start && formDate <= end
    })
  }
  
  // Get date from form
  getFormDate(form) {
    if (form.createdAt) {
      return form.createdAt.toDate ? form.createdAt.toDate() : new Date(form.createdAt)
    }
    return null
  }
  
  // Get period ID from date
  getFormPeriodId(date, periodType) {
    const year = date.getFullYear()
    const month = date.getMonth() // 0-11
    const now = new Date()
    
    if (periodType === 'weekly') {
      const weekNum = this.getWeekNumber(date)
      // Calculate weeks back from current week
      const currentWeek = this.getWeekNumber(now)
      const weeksBack = currentWeek - weekNum
      return `week-${Math.abs(weeksBack)}`
    } else if (periodType === 'monthly') {
      // Calculate months back from current month
      const monthsBack = (now.getFullYear() - year) * 12 + (now.getMonth() - month)
      return `month-${monthsBack}`
    } else if (periodType === 'quarterly') {
      const quarter = Math.floor(month / 3) + 1
      return `q${quarter}-${year}`
    } else if (periodType === 'yearly') {
      return `year-${year}`
    }
    
    // Default to monthly
    const monthsBack = (now.getFullYear() - year) * 12 + (now.getMonth() - month)
    return `month-${monthsBack}`
  }
  
  // Get week number
  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }
  
  // Build pivot table from forms
  buildPivotTable(forms, config) {
    const { selectedElements, rowDimensions, columnDimensions, aggregationType } = config
    
    // Build headers
    const headers = this.buildHeaders(selectedElements, columnDimensions)
    
    // Build rows grouped by period or other dimensions
    const rows = this.buildRows(forms, selectedElements, rowDimensions, aggregationType)
    
    // Build line list
    const lineList = this.buildLineList(forms)
    
    return {
      headers,
      rows,
      lineList
    }
  }
  
  // Build table headers
  buildHeaders(selectedElements, columnDimensions) {
    const headers = []
    
    // First column is usually the row dimension (e.g., Period)
    if (columnDimensions.includes('period')) {
      headers.push('Period')
    } else if (columnDimensions.includes('orgUnit')) {
      headers.push('Organization Unit')
    } else {
      headers.push('Category')
    }
    
    // Add data element columns
    selectedElements.forEach(elementId => {
      headers.push(this.getElementName(elementId))
    })
    
    return headers
  }
  
  // Get element display name
  getElementName(elementId) {
    const names = {
      'age': 'Age',
      'gender': 'Gender',
      'assessment-score': 'Assessment Score',
      'attendance': 'Attendance',
      'performance': 'Performance Level',
      'status': 'Status',
      'referral-type': 'Referral Type',
      'report-type': 'Report Type'
    }
    return names[elementId] || elementId
  }
  
  // Build table rows
  buildRows(forms, selectedElements, rowDimensions, aggregationType) {
    // Group forms by period (or other dimension)
    const grouped = this.groupForms(forms, rowDimensions)
    
    const rows = []
    
    Object.keys(grouped).forEach(groupKey => {
      const groupForms = grouped[groupKey]
      const cells = []
      
      // First cell is the group label (e.g., period name)
      cells.push({
        value: this.formatGroupLabel(groupKey, rowDimensions),
        type: 'text'
      })
      
      // Add data element values
      selectedElements.forEach(elementId => {
        const value = this.aggregateElementData(groupForms, elementId, aggregationType)
        cells.push({
          value: value,
          type: 'number'
        })
      })
      
      rows.push({
        cells,
        isSubtotal: false,
        isTotal: false
      })
    })
    
    return rows
  }
  
  // Group forms by dimension
  groupForms(forms, dimensions) {
    const groups = {}
    
    forms.forEach(form => {
      let groupKey
      
      if (dimensions.includes('period')) {
        const formDate = this.getFormDate(form)
        if (formDate) {
          const monthName = formDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          groupKey = monthName
        } else {
          groupKey = 'Unknown Period'
        }
      } else if (dimensions.includes('orgUnit')) {
        groupKey = form.orgUnit || 'Unknown Unit'
      } else {
        groupKey = form.formType || 'Unknown'
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      
      groups[groupKey].push(form)
    })
    
    return groups
  }
  
  // Format group label
  formatGroupLabel(groupKey, dimensions) {
    return groupKey
  }
  
  // Aggregate element data
  aggregateElementData(forms, elementId, aggregationType) {
    const values = []
    
    forms.forEach(form => {
      let value = null
      
      switch (elementId) {
        case 'age':
          value = form.age || form.ageAtIntake
          break
        case 'gender':
          value = form.gender === 'Female' ? 1 : form.gender === 'Male' ? 2 : 0
          break
        case 'status':
          value = form.status === 'completed' ? 1 : form.status === 'draft' ? 0 : 0.5
          break
        case 'attendance':
          // Random value for demo - replace with actual data field
          value = Math.random() * 100
          break
        case 'performance':
          // Random value for demo - replace with actual data field
          value = Math.random() * 5
          break
        case 'assessment-score':
          // Random value for demo - replace with actual data field
          value = Math.random() * 100
          break
        case 'referral-type':
          value = form.referralMethod ? 1 : 0
          break
        case 'report-type':
          value = form.formType === 'initial-referral' ? 1 : form.formType === 'initial-assessment' ? 2 : 3
          break
        default:
          value = 1 // Count
      }
      
      if (value !== null && value !== undefined) {
        values.push(value)
      }
    })
    
    if (values.length === 0) return 0
    
    switch (aggregationType) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0)
      case 'average':
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      case 'count':
        return values.length
      case 'min':
        return Math.min(...values)
      case 'max':
        return Math.max(...values)
      default:
        return values.length
    }
  }
  
  // Build line list
  buildLineList(forms) {
    return forms.map(form => {
      const formDate = this.getFormDate(form)
      
      return {
        id: form.id,
        date: formDate ? formDate.toISOString() : new Date().toISOString(),
        program: this.getFormTypeDisplay(form.formType),
        orgUnit: form.orgUnit || 'Main Center',
        status: form.status || 'completed',
        childName: this.getChildName(form),
        data: form
      }
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  // Get form type display name
  getFormTypeDisplay(formType) {
    const types = {
      'initial-referral': 'Initial Referral',
      'child-overview': 'Child Overview',
      'initial-assessment': 'Initial Assessment',
      'tracker-case': 'Tracker Case'
    }
    return types[formType] || formType
  }
  
  // Get child name from form
  getChildName(form) {
    if (form.childFirstName || form.childLastName) {
      const firstName = form.childFirstName || ''
      const lastName = form.childLastName || form.childSurname || ''
      return `${firstName} ${lastName}`.trim() || 'Unknown Child'
    }
    return form.childName || 'Unknown Child'
  }
  
  // Get available data elements based on program
  getDataElementsForProgram(program) {
    const baseElements = [
      { id: 'age', name: 'Age' },
      { id: 'gender', name: 'Gender' },
      { id: 'status', name: 'Status' }
    ]
    
    if (program === 'child-assessment') {
      return [
        ...baseElements,
        { id: 'assessment-score', name: 'Assessment Score' },
        { id: 'performance', name: 'Performance Level' }
      ]
    } else if (program === 'initial-referral') {
      return [
        ...baseElements,
        { id: 'referral-type', name: 'Referral Type' },
        { id: 'report-type', name: 'Report Type' }
      ]
    }
    
    return baseElements
  }
  
  // Get summary statistics
  async getSummaryStatistics() {
    try {
      const statsResult = await FormService.getFormStatistics()
      
      if (statsResult.success) {
        const stats = statsResult.statistics
        return {
          success: true,
          statistics: {
            totalEvents: stats.totalForms,
            totalReferrals: stats.totalReferrals,
            totalOverviews: stats.totalOverviews,
            totalAssessments: stats.totalAssessments
          }
        }
      }
      
      return {
        success: false,
        error: 'Failed to load statistics'
      }
    } catch (error) {
      console.error('Error getting summary statistics:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default new EventReportsService()
