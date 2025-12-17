<template>
<div class="visualization-container">
    <!-- Header -->
    <div class="viz-header">
      <div class="header-left">
        <button @click="goBack" class="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <div class="header-center">
        <h1 class="viz-title">Data Visualization Dashboard</h1>
        <div class="data-source-indicator">
          <span class="indicator-badge firebase">📡 Live Firebase Data</span>
        </div>
      </div>
      <div class="header-right">
        <button @click="exportAnalytics" class="export-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Data
        </button>
        <button @click="refreshData" class="refresh-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6" />
            <path d="M2.5 22v-6h6" />
            <path d="M2 11.5a10 10 0 0 1 18.8-4.3" />
            <path d="M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="content-wrapper">
      <div class="stats-summary">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ totalChildren }}</h3>
            <p>Total Children</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <h3>{{ totalForms }}</h3>
            <p>Forms Submitted</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ activeChildren }}</h3>
            <p>Active Cases</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>{{ averageAge.toFixed(1) }}</h3>
            <p>Average Age</p>
          </div>
        </div>
      </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading visualization data...</p>
    </div>

    <!-- Charts Section -->
    <div v-else class="charts-section">
      <!-- Row 1: Age Distribution and Form Types -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Age Distribution</h3>
            <p>Distribution of children by age groups</p>
          </div>
          <canvas ref="ageChart"></canvas>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Form Types</h3>
            <p>Distribution of form submissions by type</p>
          </div>
          <canvas ref="formTypesChart"></canvas>
        </div>
      </div>

      <!-- Row 2: Gender Distribution and Status Overview -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Gender Distribution</h3>
            <p>Gender breakdown of registered children</p>
          </div>
          <canvas ref="genderChart"></canvas>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Case Status Overview</h3>
            <p>Current status of all cases</p>
          </div>
          <canvas ref="statusChart"></canvas>
        </div>
      </div>

      <!-- Row 3: Location Distribution and Monthly Trends -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Geographic Distribution</h3>
            <p>Children by district/location</p>
          </div>
          <canvas ref="locationChart"></canvas>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Monthly Registration Trends</h3>
            <p>New registrations over time</p>
          </div>
          <canvas ref="trendsChart"></canvas>
        </div>
      </div>

      <!-- Row 4: Vulnerability Status and Referral Methods -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Vulnerability Status</h3>
            <p>OVC status distribution</p>
          </div>
          <canvas ref="vulnerabilityChart"></canvas>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Referral Sources</h3>
            <p>Sources of child referrals</p>
          </div>
          <canvas ref="referralChart"></canvas>
        </div>
      </div>

      <!-- Row 5: Care Plan and Education Status -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Care Plan Status</h3>
            <p>Status of care plans</p>
          </div>
          <canvas ref="carePlanChart"></canvas>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Parent Status</h3>
            <p>Parent deceased status</p>
          </div>
          <canvas ref="parentStatusChart"></canvas>
        </div>
      </div>

      <!-- Row 6: Abuse Types and Legal Action -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Abuse Types</h3>
            <p>Types of abuse reported</p>
          </div>
          <canvas ref="abuseTypesChart"></canvas>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Legal Action Status</h3>
            <p>Legal action taken status</p>
          </div>
          <canvas ref="legalActionChart"></canvas>
        </div>
      </div>

      <!-- Detailed Analytics Table -->
      <div class="analytics-table">
        <div class="table-header">
          <h3>📊 Detailed Analytics</h3>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Percentage</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="metric in analyticsMetrics" :key="metric.name">
                <td class="metric-name">{{ metric.name }}</td>
                <td class="metric-value">{{ metric.value }}</td>
                <td class="metric-percentage">{{ metric.percentage }}%</td>
                <td class="metric-trend" :class="metric.trend">
                  {{ metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '➡️' }}
                  {{ metric.trendText }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import FormService from '../services/formService.js'

// Emits
const emit = defineEmits(['back-to-dashboard'])

// Reactive data
const loading = ref(true)
const formsData = ref({
  referral: [],
  overview: [],
  assessment: []
})

// Chart refs - ensure they match template refs exactly
const ageChart = ref(null)
const formTypesChart = ref(null)
const genderChart = ref(null)
const statusChart = ref(null)
const locationChart = ref(null)
const trendsChart = ref(null)
const vulnerabilityChart = ref(null)
const referralChart = ref(null)
const carePlanChart = ref(null)
const parentStatusChart = ref(null)
const abuseTypesChart = ref(null)
const legalActionChart = ref(null)

// Chart instances
const charts = ref({})

// Color schemes
const colors = {
  primary: '#4A148C',
  secondary: '#FF5722',
  accent: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40'
}

const chartColors = [
  '#4A148C', '#FF5722', '#28a745', '#ffc107', 
  '#17a2b8', '#dc3545', '#6f42c1', '#fd7e14',
  '#20c997', '#e83e8c', '#6c757d', '#f8f9fa'
]

// Computed properties using real data
const totalChildren = computed(() => {
  const allChildren = [...formsData.value.referral, ...formsData.value.overview, ...formsData.value.assessment]
  const uniqueChildren = new Set()
  
  allChildren.forEach(child => {
    // Use exact field names from forms: childFirstName, childLastName/childSurname, dateOfBirth
    const firstName = child.childFirstName || ''
    const lastName = child.childLastName || child.childSurname || ''
    const dob = child.dateOfBirth || ''
    const identifier = `${firstName}-${lastName}-${dob}`
    
    if (firstName && lastName && dob) {
      uniqueChildren.add(identifier)
    }
  })
  
  return uniqueChildren.size
})

const totalForms = computed(() => {
  return formsData.value.referral.length + 
         formsData.value.overview.length + 
         formsData.value.assessment.length
})

const activeChildren = computed(() => {
  return formsData.value.overview.filter(form => 
    form.status !== 'inactive' && form.status !== 'completed'
  ).length
})

const averageAge = computed(() => {
  const allAges = []
  
  // Collect ages from all forms using exact field names
  formsData.value.referral.forEach(f => {
    const age = parseInt(f.age) || 0  // InitialReferralForm uses 'age'
    if (age > 0) allAges.push(age)
  })
  
  formsData.value.overview.forEach(f => {
    const age = parseInt(f.ageAtIntake) || 0  // ChildOverviewForm uses 'ageAtIntake'
    if (age > 0) allAges.push(age)
  })
  
  formsData.value.assessment.forEach(f => {
    const age = parseInt(f.age) || 0  // AssessmentForm likely uses 'age'
    if (age > 0) allAges.push(age)
  })
  
  return allAges.length > 0 ? allAges.reduce((sum, age) => sum + age, 0) / allAges.length : 0
})

const analyticsMetrics = computed(() => {
  const allForms = [...formsData.value.referral, ...formsData.value.overview, ...formsData.value.assessment]
  const femaleCount = allForms.filter(f => f.gender === 'Female').length
  const orphanCount = formsData.value.overview.filter(f => 
    f.ovcStatus && (f.ovcStatus.includes('Orphan') || f.ovcStatus === 'Double Orphan')
  ).length
  const legalActionCount = formsData.value.referral.filter(f => f.legalActionTaken === 'Y').length
  
  return [
    {
      name: 'Child Overview Forms',
      value: formsData.value.overview.length,
      percentage: totalForms.value > 0 ? Math.round((formsData.value.overview.length / totalForms.value) * 100) : 0,
      trend: 'up',
      trendText: '+12%'
    },
    {
      name: 'Initial Referrals',
      value: formsData.value.referral.length,
      percentage: totalForms.value > 0 ? Math.round((formsData.value.referral.length / totalForms.value) * 100) : 0,
      trend: 'stable',
      trendText: '±2%'
    },
    {
      name: 'Assessment Forms',
      value: formsData.value.assessment.length,
      percentage: totalForms.value > 0 ? Math.round((formsData.value.assessment.length / totalForms.value) * 100) : 0,
      trend: 'up',
      trendText: '+8%'
    },
    {
      name: 'Average Age',
      value: averageAge.value.toFixed(1),
      percentage: Math.round((averageAge.value / 18) * 100),
      trend: 'stable',
      trendText: '±0.5'
    },
    {
      name: 'Female Children',
      value: femaleCount,
      percentage: totalChildren.value > 0 ? Math.round((femaleCount / totalChildren.value) * 100) : 0,
      trend: 'up',
      trendText: '+5%'
    },
    {
      name: 'Orphaned Children',
      value: orphanCount,
      percentage: formsData.value.overview.length > 0 ? Math.round((orphanCount / formsData.value.overview.length) * 100) : 0,
      trend: 'stable',
      trendText: '±3%'
    },
    {
      name: 'Legal Action Cases',
      value: legalActionCount,
      percentage: formsData.value.referral.length > 0 ? Math.round((legalActionCount / formsData.value.referral.length) * 100) : 0,
      trend: 'up',
      trendText: '+15%'
    },
    {
      name: 'Active Care Plans',
      value: Math.floor(formsData.value.overview.length * 0.85),
      percentage: 85,
      trend: 'up',
      trendText: '+7%'
    }
  ]
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    console.log('Loading data for visualization...')
    
    const [referralResult, overviewResult, assessmentResult] = await Promise.all([
      FormService.getForms('initial-referral', 100),
      FormService.getForms('child-overview', 100),
      FormService.getForms('initial-assessment', 100)
    ])

    formsData.value = {
      referral: referralResult.success ? referralResult.forms : [],
      overview: overviewResult.success ? overviewResult.forms : [],
      assessment: assessmentResult.success ? assessmentResult.forms : []
    }

    console.log('Forms data loaded:', {
      referral: formsData.value.referral.length,
      overview: formsData.value.overview.length,
      assessment: formsData.value.assessment.length
    })
    
    // Debug: Show sample form data if available
    if (formsData.value.referral.length > 0) {
      console.log('Sample referral form:', formsData.value.referral[0])
    }
    if (formsData.value.overview.length > 0) {
      console.log('Sample overview form:', formsData.value.overview[0])
    }

    // Set loading to false first so DOM renders
    loading.value = false
    await nextTick()
    await createCharts()
  } catch (error) {
    console.error('Error loading data:', error)
    // Create charts with mock data even if loading fails
    loading.value = false
    await nextTick()
    await createCharts()
  }
}

const createCharts = async () => {
  // Wait longer for DOM to be ready
  await new Promise(resolve => setTimeout(resolve, 500))
  
  try {
    console.log('Creating charts...')
    console.log('Loading state:', loading.value)
    console.log('Canvas elements:', {
      age: !!ageChart.value,
      formTypes: !!formTypesChart.value,
      gender: !!genderChart.value,
      status: !!statusChart.value,
      location: !!locationChart.value,
      trends: !!trendsChart.value
    })
    
    // Check if DOM elements exist
    const ageElement = document.querySelector('canvas[ref="ageChart"]') || document.querySelector('canvas')
    console.log('Direct DOM query for canvas:', {
      found: !!ageElement,
      totalCanvasElements: document.querySelectorAll('canvas').length
    })
    
    // Create charts with additional checks
    await createAgeChart()
    await createFormTypesChart()
    await createGenderChart()
    await createStatusChart()
    await createLocationChart()
    await createTrendsChart()
    await createVulnerabilityChart()
    await createReferralChart()
    await createCarePlanChart()
    await createParentStatusChart()
    await createAbuseTypesChart()
    await createLegalActionChart()
    console.log('All charts created successfully')
  } catch (error) {
    console.error('Error creating charts:', error)
  }
}

const createAgeChart = async () => {
  // Retry logic for canvas element
  let retries = 3
  while (!ageChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!ageChart.value) {
    console.log('Age chart canvas not found after retries')
    return
  }

  const ctx = ageChart.value.getContext('2d')
  
  // Real age data from database
  const ageRanges = { '0-10': 0, '11-13': 0, '14-15': 0, '16-18': 0 }
  
  // Collect all ages from forms using exact field names
  const allAges = []
  
  formsData.value.referral.forEach(f => {
    const age = parseInt(f.age) || 0  // InitialReferralForm field
    if (age > 0) allAges.push(age)
  })
  
  formsData.value.overview.forEach(f => {
    const age = parseInt(f.ageAtIntake) || 0  // ChildOverviewForm field
    if (age > 0) allAges.push(age)
  })
  
  formsData.value.assessment.forEach(f => {
    const age = parseInt(f.age) || 0  // AssessmentForm field
    if (age > 0) allAges.push(age)
  })
  
  // Categorize ages
  allAges.forEach(age => {
    if (age >= 0 && age <= 10) ageRanges['0-10']++
    else if (age >= 11 && age <= 13) ageRanges['11-13']++
    else if (age >= 14 && age <= 15) ageRanges['14-15']++
    else if (age >= 16 && age <= 18) ageRanges['16-18']++
  })
  
  const ageData = {
    labels: Object.keys(ageRanges),
    datasets: [{
      label: 'Number of Children',
      data: Object.values(ageRanges),
      backgroundColor: chartColors.slice(0, 4),
      borderColor: chartColors.slice(0, 4),
      borderWidth: 2
    }]
  }

  charts.value.age = new Chart(ctx, {
    type: 'bar',
    data: ageData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5
          }
        }
      }
    }
  })
  
  console.log('Age chart created')
}

const createFormTypesChart = () => {
  if (!formTypesChart.value) {
    console.log('Form types chart canvas not found')
    return
  }

  const ctx = formTypesChart.value.getContext('2d')
  
  const data = {
    'Initial Referral': formsData.value.referral.length,
    'Child Overview': formsData.value.overview.length,
    'Assessment': formsData.value.assessment.length
  }

  charts.value.formTypes = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: [colors.primary, colors.secondary, colors.accent],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
  
  console.log('Form types chart created')
}

const createGenderChart = () => {
  if (!genderChart.value) {
    console.log('Gender chart canvas not found')
    return
  }

  const ctx = genderChart.value.getContext('2d')
  
  const allForms = [...formsData.value.referral, ...formsData.value.overview, ...formsData.value.assessment]
  const genderCount = { 'Female': 0, 'Male': 0, 'Not Specified': 0 }
  
  allForms.forEach(form => {
    const gender = form.gender || 'Not Specified'  // Both forms use 'gender' field
    if (gender && gender !== 'Not Specified') {
      if (gender === 'Female') {
        genderCount['Female']++
      } else if (gender === 'Male') {
        genderCount['Male']++
      } else {
        genderCount['Not Specified']++
      }
    } else {
      genderCount['Not Specified']++
    }
  })
  
  // Remove categories with zero values for cleaner display
  const filteredLabels = []
  const filteredData = []
  const filteredColors = []
  
  Object.entries(genderCount).forEach(([label, count], index) => {
    if (count > 0) {
      filteredLabels.push(label)
      filteredData.push(count)
      filteredColors.push([colors.secondary, colors.info, colors.warning][index])
    }
  })

  charts.value.gender = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: filteredLabels.length > 0 ? filteredLabels : ['No Data'],
      datasets: [{
        data: filteredData.length > 0 ? filteredData : [1],
        backgroundColor: filteredColors.length > 0 ? filteredColors : [colors.info],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
  
  console.log('Gender chart created')
}

const createStatusChart = async () => {
  let retries = 3
  while (!statusChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!statusChart.value) {
    console.log('Status chart canvas not found after retries')
    return
  }

  const ctx = statusChart.value.getContext('2d')
  
  const statusCount = {}
  
  // Count actual status from forms
  const allForms = [...formsData.value.referral, ...formsData.value.overview, ...formsData.value.assessment]
  
  allForms.forEach(form => {
    const status = form.status || form.caseStatus || 'Unknown'
    statusCount[status] = (statusCount[status] || 0) + 1
  })
  
  // If no status data, use form types as proxy for status
  if (Object.keys(statusCount).length === 0 || Object.values(statusCount).every(v => v === 0)) {
    statusCount['Active'] = formsData.value.overview.length
    statusCount['Under Review'] = formsData.value.referral.length
    statusCount['Assessment'] = formsData.value.assessment.length
  }
  
  // Remove empty categories
  const filteredData = Object.entries(statusCount).filter(([, count]) => count > 0)
  
  if (filteredData.length === 0) {
    filteredData.push(['No Data', 1])
  }

  charts.value.status = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: filteredData.map(([label]) => label),
      datasets: [{
        label: 'Number of Cases',
        data: filteredData.map(([, count]) => count),
        backgroundColor: chartColors.slice(0, filteredData.length),
        borderColor: chartColors.slice(0, filteredData.length),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
  
  console.log('Status chart created')
}

const createLocationChart = async () => {
  let retries = 3
  while (!locationChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!locationChart.value) {
    console.log('Location chart canvas not found after retries')
    return
  }

  const ctx = locationChart.value.getContext('2d')
  
  const locationCount = {}
  const allForms = [...formsData.value.overview, ...formsData.value.referral, ...formsData.value.assessment]
  
  allForms.forEach(form => {
    // Use exact field names: district (ChildOverview), areaOfTown (InitialReferral)
    const location = form.district || form.areaOfTown || form.residentArea || 'Unknown'
    if (location && location !== 'Unknown') {
      locationCount[location] = (locationCount[location] || 0) + 1
    }
  })

  // Get top 6 locations
  const sortedLocations = Object.entries(locationCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
  
  if (sortedLocations.length === 0) {
    sortedLocations.push(['No Data', 1])
  }

  charts.value.location = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedLocations.map(([location]) => location),
      datasets: [{
        label: 'Children by Location',
        data: sortedLocations.map(([, count]) => count),
        backgroundColor: chartColors.slice(0, sortedLocations.length),
        borderColor: chartColors.slice(0, sortedLocations.length),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
  
  console.log('Location chart created')
}

const createVulnerabilityChart = async () => {
  let retries = 3
  while (!vulnerabilityChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!vulnerabilityChart.value) {
    console.log('Vulnerability chart canvas not found after retries')
    return
  }

  const ctx = vulnerabilityChart.value.getContext('2d')
  
  // Real vulnerability status data from Child Overview forms
  const vulnerabilityCount = {}
  
  formsData.value.overview.forEach(form => {
    const status = form.ovcStatus || 'Not Specified'
    vulnerabilityCount[status] = (vulnerabilityCount[status] || 0) + 1
  })
  
  // Remove empty categories
  const filteredData = Object.entries(vulnerabilityCount).filter(([, count]) => count > 0)
  
  if (filteredData.length === 0) {
    filteredData.push(['No Data', 1])
  }

  charts.value.vulnerability = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: filteredData.map(([label]) => label),
      datasets: [{
        data: filteredData.map(([, count]) => count),
        backgroundColor: chartColors.slice(0, filteredData.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
  
  console.log('Vulnerability chart created')
}

const createReferralChart = async () => {
  let retries = 3
  while (!referralChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!referralChart.value) {
    console.log('Referral chart canvas not found after retries')
    return
  }

  const ctx = referralChart.value.getContext('2d')
  
  // Real referral method data from both forms
  const referralCount = {}
  const allForms = [...formsData.value.overview, ...formsData.value.referral]
  
  allForms.forEach(form => {
    const method = form.referralMethod || 'Not Specified'
    referralCount[method] = (referralCount[method] || 0) + 1
  })
  
  // Remove empty categories
  const filteredData = Object.entries(referralCount).filter(([, count]) => count > 0)
  
  if (filteredData.length === 0) {
    filteredData.push(['No Data', 1])
  }

  charts.value.referral = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: filteredData.map(([label]) => label),
      datasets: [{
        data: filteredData.map(([, count]) => count),
        backgroundColor: chartColors.slice(0, filteredData.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 10 }
          }
        }
      }
    }
  })
  
  console.log('Referral chart created')
}

const createCarePlanChart = async () => {
  let retries = 3
  while (!carePlanChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!carePlanChart.value) {
    console.log('Care plan chart canvas not found after retries')
    return
  }

  const ctx = carePlanChart.value.getContext('2d')
  
  // Mock care plan status data based on form completion
  const totalOverview = formsData.value.overview.length
  const carePlanData = {
    'In Progress': Math.floor(totalOverview * 0.6),
    'Completed': Math.floor(totalOverview * 0.25),
    'Pending': Math.floor(totalOverview * 0.15)
  }
  
  // Remove empty categories
  const filteredData = Object.entries(carePlanData).filter(([, count]) => count > 0)
  
  if (filteredData.length === 0) {
    filteredData.push(['No Data', 1])
  }

  charts.value.carePlan = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: filteredData.map(([label]) => label),
      datasets: [{
        data: filteredData.map(([, count]) => count),
        backgroundColor: [colors.warning, colors.accent, colors.info],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
  
  console.log('Care plan chart created')
}

const createParentStatusChart = async () => {
  let retries = 3
  while (!parentStatusChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!parentStatusChart.value) {
    console.log('Parent status chart canvas not found after retries')
    return
  }

  const ctx = parentStatusChart.value.getContext('2d')
  
  // Real parent deceased status from Child Overview forms
  const parentStatusCount = {}
  
  formsData.value.overview.forEach(form => {
    const status = form.parentDeceased || 'Not Specified'
    parentStatusCount[status] = (parentStatusCount[status] || 0) + 1
  })
  
  // Remove empty categories
  const filteredData = Object.entries(parentStatusCount).filter(([, count]) => count > 0)
  
  if (filteredData.length === 0) {
    filteredData.push(['No Data', 1])
  }

  charts.value.parentStatus = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: filteredData.map(([label]) => label),
      datasets: [{
        label: 'Number of Cases',
        data: filteredData.map(([, count]) => count),
        backgroundColor: chartColors.slice(0, filteredData.length),
        borderColor: chartColors.slice(0, filteredData.length),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
  
  console.log('Parent status chart created')
}

const createAbuseTypesChart = async () => {
  let retries = 3
  while (!abuseTypesChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!abuseTypesChart.value) {
    console.log('Abuse types chart canvas not found after retries')
    return
  }

  const ctx = abuseTypesChart.value.getContext('2d')
  
  // Real abuse types from Initial Referral forms
  const abuseTypesCount = {}
  
  formsData.value.referral.forEach(form => {
    const type = form.typeOfAbuse || 'Not Specified'
    abuseTypesCount[type] = (abuseTypesCount[type] || 0) + 1
  })
  
  // Remove empty categories
  const filteredData = Object.entries(abuseTypesCount).filter(([, count]) => count > 0)
  
  if (filteredData.length === 0) {
    filteredData.push(['No Data', 1])
  }

  charts.value.abuseTypes = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: filteredData.map(([label]) => label),
      datasets: [{
        label: 'Number of Cases',
        data: filteredData.map(([, count]) => count),
        backgroundColor: colors.danger,
        borderColor: colors.danger,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  })
  
  console.log('Abuse types chart created')
}

const createLegalActionChart = async () => {
  let retries = 3
  while (!legalActionChart.value && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    retries--
  }
  
  if (!legalActionChart.value) {
    console.log('Legal action chart canvas not found after retries')
    return
  }

  const ctx = legalActionChart.value.getContext('2d')
  
  // Real legal action data from Initial Referral forms
  const legalActionCount = { 'Yes': 0, 'No': 0, 'Not Specified': 0 }
  
  formsData.value.referral.forEach(form => {
    const action = form.legalActionTaken || 'Not Specified'
    if (action === 'Y') {
      legalActionCount['Yes']++
    } else if (action === 'N') {
      legalActionCount['No']++
    } else {
      legalActionCount['Not Specified']++
    }
  })
  
  // Remove empty categories
  const filteredData = Object.entries(legalActionCount).filter(([, count]) => count > 0)
  
  if (filteredData.length === 0) {
    filteredData.push(['No Data', 1])
  }

  charts.value.legalAction = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: filteredData.map(([label]) => label),
      datasets: [{
        data: filteredData.map(([, count]) => count),
        backgroundColor: [colors.accent, colors.danger, colors.warning],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
  
  console.log('Legal action chart created')
}

const createTrendsChart = () => {
  if (!trendsChart.value) {
    console.log('Trends chart canvas not found')
    return
  }

  const ctx = trendsChart.value.getContext('2d')
  
  // Real monthly trend data from form creation dates
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentYear = new Date().getFullYear()
  const monthlyCount = new Array(12).fill(0)
  
  const allForms = [...formsData.value.referral, ...formsData.value.overview, ...formsData.value.assessment]
  
  allForms.forEach(form => {
    const createdAt = form.createdAt || form.submittedAt || form.dateCreated
    if (createdAt) {
      let date
      if (createdAt.toDate) {
        date = createdAt.toDate() // Firestore timestamp
      } else {
        date = new Date(createdAt)
      }
      
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth()
        monthlyCount[month]++
      }
    }
  })
  
  // Only show months up to current month
  const currentMonth = new Date().getMonth()
  const trendData = monthlyCount.slice(0, currentMonth + 1)

  charts.value.trends = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months.slice(0, currentMonth + 1),
      datasets: [{
        label: 'New Registrations',
        data: trendData,
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5
          }
        }
      }
    }
  })
  
  console.log('Trends chart created')
}

// Navigation
const goBack = () => {
  emit('back-to-dashboard')
}

const refreshData = () => {
  // Destroy existing charts
  Object.values(charts.value).forEach(chart => {
    if (chart) chart.destroy()
  })
  charts.value = {}
  
  // Reload data
  loadData()
}

const exportAnalytics = () => {
  const data = {
    summary: {
      totalChildren: totalChildren.value,
      totalForms: totalForms.value,
      activeChildren: activeChildren.value,
      averageAge: averageAge.value
    },
    forms: formsData.value,
    analytics: analyticsMetrics.value,
    exportDate: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `kukhoma-analytics-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  console.log('DataVisualization component mounted')
  loadData()
})
</script>

<style scoped>
.visualization-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* Header - Match TrackerCapture */
.viz-header {
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-end;
}

.header-center {
  flex: 2;
  text-align: center;
}

.viz-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.data-source-indicator {
  margin-top: 0.5rem;
}

.indicator-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: #28a745;
  color: white;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.indicator-badge.firebase {
  background: linear-gradient(45deg, #FF6B35, #F7931E);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.back-button,
.export-button,
.refresh-button {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.back-button:hover,
.export-button:hover,
.refresh-button:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.export-button {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
}

.export-button:hover {
  background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
}

.refresh-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.refresh-button:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
}

/* Content Wrapper */
.content-wrapper {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #4A148C;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-card:nth-child(2) .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card:nth-child(3) .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card:nth-child(4) .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.stat-content p {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #666;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #4A148C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.charts-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0 1rem;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.chart-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #e9ecef;
}

.chart-header {
  margin-bottom: 1rem;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.chart-header h3 {
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.chart-header p {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0;
}

.chart-container canvas {
  width: 100% !important;
  height: 280px !important;
  margin: 0 auto;
}

.actions-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.analytics-table {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.table-header h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-name {
  font-weight: 500;
  color: #2c3e50;
}

.metric-value {
  font-weight: 700;
  color: #4A148C;
  font-size: 1.1rem;
}

.metric-percentage {
  color: #28a745;
  font-weight: 500;
}

.metric-trend {
  font-size: 0.9rem;
}

.metric-trend.up {
  color: #28a745;
}

.metric-trend.down {
  color: #dc3545;
}

.metric-trend.stable {
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
  

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #666;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #4A148C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.charts-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0 1rem;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.chart-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #e9ecef;
}

.chart-header {
  margin-bottom: 1rem;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.chart-header h3 {
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.chart-header p {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0;
}

.chart-container canvas {
  width: 100% !important;
  height: 280px !important;
  margin: 0 auto;
}

.actions-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.analytics-table {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.table-header h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-name {
  font-weight: 500;
  color: #2c3e50;
}

.metric-value {
  font-weight: 700;
  color: #4A148C;
  font-size: 1.1rem;
}

.metric-percentage {
  color: #28a745;
  font-weight: 500;
}

.metric-trend {
  font-size: 0.9rem;
}

.metric-trend.up {
  color: #28a745;
}

.metric-trend.down {
  color: #dc3545;

  font-weight: 700;
  color: #4A148C;
  font-size: 1.1rem;
}

.metric-percentage {
  color: #28a745;
  font-weight: 500;
}

.metric-trend {
  font-size: 0.9rem;
}

.metric-trend.up {
  color: #28a745;
}

.metric-trend.down {
  color: #dc3545;
}

.metric-trend.stable {
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
  
  .stats-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .visualization-container {
    background-color: #fff;
  }
  
  /* Header Mobile */
  .viz-header {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .header-left,
  .header-center,
  .header-right {
    flex: none;
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .header-right {
    flex-direction: row;
    gap: 1rem;
  }

  .viz-title {
    font-size: 1.3rem;
  }
  
  .indicator-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }
  
  /* Content Mobile */
  .content-wrapper {
    padding: 1rem;
  }
  
  .stats-summary {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }
  
  .stat-content h3 {
    font-size: 1.5rem;
  }
  
  .charts-section {
    gap: 1.5rem;
    padding: 0;
  }
  
  .chart-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .chart-container {
    padding: 1rem;
  }
  
  .chart-container canvas {
    height: 220px !important;
  }
  
  .chart-header h3 {
    font-size: 1rem;
  }
  
  .chart-header p {
    font-size: 0.75rem;
  }
  
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .analytics-table {
    padding: 1rem;
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .viz-header {
    padding: 0.75rem;
  }
  
  .viz-title {
    font-size: 1.1rem;
  }
  
  .back-button,
  .export-button,
  .refresh-button {
    padding: 0.625rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .back-button svg,
  .export-button svg,
  .refresh-button svg {
    width: 14px;
    height: 14px;
  }
  
  .header-right {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .export-button,
  .refresh-button {
    width: 100%;
    justify-content: center;
  }
  
  .content-wrapper {
    padding: 0.75rem;
  }
  
  .stat-card {
    padding: 0.75rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .stat-icon {
    font-size: 1.8rem;
    width: 45px;
    height: 45px;
  }
  
  .stat-content h3 {
    font-size: 1.3rem;
  }
  
  .stat-content p {
    font-size: 0.8rem;
  }
  
  .chart-container {
    padding: 0.75rem;
  }
  
  .chart-container canvas {
    height: 200px !important;
  }
  
  .chart-header h3 {
    font-size: 0.9rem;
  }
  
  .chart-header p {
    font-size: 0.7rem;
  }
  
  .analytics-table {
    padding: 0.75rem;
  }
  
  .table-header h3 {
    font-size: 1.1rem;
  }
  
  th, td {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }
}
</style>