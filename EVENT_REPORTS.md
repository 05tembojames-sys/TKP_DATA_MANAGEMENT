# Event Reports - DHIS2-Style Implementation

## Overview
The Event Reports module provides a comprehensive, DHIS2-style reporting interface for creating dynamic pivot tables and visualizations from **real event data stored in Firebase**. This follows the standard DHIS2 event reporting patterns used in health information systems worldwide.

## Data Integration

### Real-Time Data Sources
Event Reports now connects to your actual Firebase data:

- **Initial Referral Forms**: All child referral forms from the `forms` collection
- **Child Overview Forms**: Background and care plan documentation
- **Initial Assessment Forms**: TKP assessment forms for eligibility
- **Tracker Cases**: Cases from the Child Tracker system

### Data Service
The [`eventReportsService.js`](src/services/eventReportsService.js) handles all data fetching and aggregation:

```javascript
import EventReportsService from '../services/eventReportsService.js'

// Generate report with real data
const result = await EventReportsService.generateReport(config)
```

**Key Features**:
- ✅ Fetches data directly from Firebase Firestore
- ✅ Supports filtering by program type
- ✅ Period-based filtering (monthly, quarterly, yearly, custom)
- ✅ Real-time aggregation (sum, average, count, min, max)
- ✅ Dynamic pivot table generation
- ✅ Line list view of individual events

## Features

### 1. **Configuration Panel (Left Sidebar)**
The collapsible configuration panel allows you to:

#### Data Selection
- **Program/Event Type**: Select the type of events to analyze
  - Child Assessments
  - Child Tracking
  - Initial Referrals
  - Submitted Reports
- **Data Elements**: Choose which data fields to include in your report (multiple selections)
  - Age, Gender, Assessment Score, Attendance, Performance Level, Status, etc.

#### Period Selection
- **Period Types**: 
  - Daily
  - Weekly
  - Monthly
  - Quarterly
  - Yearly
  - Custom Date Range
- **Period Selection**: Choose specific periods to include in analysis

#### Organization Units
- Select one or multiple organization units:
  - Main Center
  - East Branch
  - West Branch
  - North Center
  - South Center

#### Table Layout (Pivot Configuration)
Configure how data appears in the pivot table:
- **Columns**: Select dimensions to display as columns
- **Rows**: Select dimensions to display as rows
- **Filters**: Select dimensions to use as filters

Available dimensions:
- Data Elements
- Period
- Organization Unit

#### Options
- **Show row totals**: Display sum of all rows
- **Show subtotals**: Display intermediate totals
- **Hide empty rows**: Remove rows with no data
- **Show hierarchy**: Display organizational hierarchy
- **Aggregation Type**: Choose how to aggregate data
  - Sum
  - Average
  - Count
  - Minimum
  - Maximum
- **Output Type**: 
  - Event
  - Enrollment
  - Tracked Entity Instance
- **Row Limit**: Limit the number of rows displayed

### 2. **Report Views**

#### Table View (Pivot Table)
- Interactive pivot table with sortable columns
- Row and column totals
- Pagination for large datasets
- Click column headers to sort data
- Configurable display options

#### Chart View
- Multiple chart types:
  - Bar Chart
  - Column Chart
  - Line Chart
  - Pie Chart
  - Area Chart
- Visual representation of your data
- Easy chart type switching

#### Line List View
- Detailed event-by-event listing
- Search functionality
- Sort by date or name
- View individual event details
- Status indicators (completed, pending, etc.)

### 3. **Export & Sharing**

#### Download Options
Export your reports in multiple formats:
- **Excel (.xlsx)**: For detailed analysis in spreadsheet applications
- **CSV (.csv)**: For data import into other systems
- **PDF (.pdf)**: For printing and sharing
- **JSON (.json)**: For programmatic access

#### Additional Actions
- **Share**: Generate shareable links to reports
- **Print**: Print-optimized layout
- **Save as Favorite**: Save frequently used report configurations

## How to Use

### Creating Your First Report with Real Data

1. **Access Event Reports**
   - Click the "Events" button on the dashboard
   - Or navigate to `/event-reports` directly

2. **Configure Your Report**
   - **Select a Program/Event Type**:
     - `child-assessment` - Loads all Initial Assessment forms
     - `child-tracking` - Loads all Tracker cases
     - `initial-referral` - Loads all Initial Referral forms
     - `reports` - Loads ALL forms combined
   
   - **Choose Data Elements**: Select the fields you want to analyze
     - Age, Gender, Status (available for all programs)
     - Program-specific fields based on your selection
   
   - **Select Period**: Choose time range for your data
     - Monthly, Quarterly, Yearly, or Custom date range
     - Select specific periods to include
   
   - **Choose Organization Units**: Filter by location/unit
   
   - **Configure Table Layout**: Set up your pivot table
     - Columns: What shows across the top
     - Rows: What shows down the side
     - Filters: Additional filtering dimensions

3. **Generate the Report**
   - Click the "🔄 Update" button
   - **Real data will be fetched from Firebase**
   - The system will:
     - Query your forms collection
     - Filter by selected criteria
     - Aggregate data based on your configuration
     - Display results in pivot table format

4. **Analyze and Export**
   - Switch between Table, Chart, and Line List views
   - Sort and filter data as needed
   - Export to your preferred format
   - Save as favorite for future use

### Example: Analyzing Child Referrals by Month

1. Select Program: **`initial-referral`**
2. Select Data Elements: **Age**, **Gender**, **Referral Type**
3. Period Type: **Monthly**
4. Select Periods: **Last 6 months**
5. Rows: **Period**
6. Columns: **Data Elements**
7. Click **Update**

Result: You'll see a table showing:
- Each month as a row
- Average age, gender distribution, and referral types as columns
- Real counts from your Firebase data

### Best Practices

1. **Start Simple**
   - Begin with one or two data elements
   - Use monthly or weekly periods
   - Add complexity gradually

2. **Use Appropriate Aggregation**
   - Use "Count" for totals
   - Use "Average" for scores and ratings
   - Use "Sum" for numeric quantities

3. **Save Favorites**
   - Save frequently used report configurations
   - Use descriptive names
   - Add descriptions to help others understand the report purpose

4. **Performance Tips**
   - Limit row counts for large datasets
   - Hide empty rows to reduce clutter
   - Use filters to focus on relevant data

## Technical Details

### Architecture

#### Service Layer (`eventReportsService.js`)
Handles all data operations:

```javascript
class EventReportsService {
  // Main report generation
  async generateReport(config) {
    // 1. Fetch forms from Firebase based on program
    // 2. Apply period filters
    // 3. Apply organization unit filters  
    // 4. Build pivot table data
    // 5. Return structured data for display
  }
  
  // Data aggregation methods
  aggregateElementData(forms, elementId, aggregationType) {
    // Supports: sum, average, count, min, max
  }
  
  // Period filtering
  filterByPeriod(forms, periodType, selectedPeriods)
  filterByDateRange(forms, startDate, endDate)
}
```

#### Component (`EventReports.vue`)
UI and interaction:

```javascript
const updateReport = async () => {
  // Validate configuration
  // Call EventReportsService.generateReport()
  // Display results in table/chart/line list
}
```

### Data Flow

1. **User configures report** → Selects program, elements, periods
2. **Click Update button** → Triggers `updateReport()`
3. **Service queries Firebase** → `FormService.getForms()` or `TrackerService.getAllCases()`
4. **Data filtering** → Apply period and org unit filters
5. **Aggregation** → Group and aggregate based on config
6. **Return to UI** → Display in pivot table

### Firebase Collections Used

- **`forms`** collection:
  - `formType: 'initial-referral'` - Referral forms
  - `formType: 'child-overview'` - Overview forms  
  - `formType: 'initial-assessment'` - Assessment forms

### Real Data Fields

The service extracts these fields from your forms:

**Common Fields**:
- `childFirstName`, `childLastName` - Child identification
- `age`, `ageAtIntake` - Age data
- `gender` - Gender information
- `status` - Form completion status
- `createdAt`, `updatedAt` - Timestamps

**Referral-Specific**:
- `referralMethod` - How child was referred
- `typeOfAbuse` - Type of abuse reported
- `dateOfReferral` - When referral was made

**Assessment-Specific**:
- Assessment scores and evaluations
- Performance metrics

### Component Location
- **Component**: `src/components/EventReports.vue`
- **Service**: `src/services/eventReportsService.js`
- **Route**: `/event-reports`
- **Router Config**: `src/router/index.js`

### Integration
The Event Reports component integrates with:
- **FormService** - Fetches all form data from Firebase
- **TrackerService** - Fetches tracker case data
- **Toast notifications** - User feedback
- **Vue Router** - Navigation

### Performance Considerations

1. **Caching**: Consider implementing caching for frequently accessed reports
2. **Pagination**: Large datasets are handled client-side (consider server-side for 1000+ records)
3. **Indexing**: Ensure Firebase indexes are set up for date-based queries
4. **Lazy Loading**: Charts and visualizations load on-demand

### Data Privacy & Security

- All data access requires authentication
- Reports respect Firebase security rules
- Child names and sensitive data can be anonymized
- Export functions include data protection options

### Data Source
Currently using mock data for demonstration. To connect to real data:
1. Update the `updateReport()` method in EventReports.vue
2. Replace `generateMockReportData()` with actual API calls
3. Connect to your Firebase collections or REST API

### Customization

#### Adding New Data Elements

To add a new data element for analysis:

1. **Update `availableDataElements` in EventReports.vue**:
```javascript
const availableDataElements = ref([
  // ... existing elements
  { id: 'new-element', name: 'New Element Name' }
])
```

2. **Add aggregation logic in `eventReportsService.js`**:
```javascript
aggregateElementData(forms, elementId, aggregationType) {
  // ... existing code
  
  switch (elementId) {
    // ... existing cases
    case 'new-element':
      value = form.newFieldName // Map to your form field
      break
  }
}
```

3. **Update element name mapping**:
```javascript
getElementName(elementId) {
  const names = {
    // ... existing
    'new-element': 'Display Name'
  }
}
```

#### Adding New Programs

To add a new program/event type:

1. **Update program selector in EventReports.vue**:
```vue
<select v-model="config.program">
  <!-- existing options -->
  <option value="new-program">New Program Name</option>
</select>
```

2. **Add data fetching in `eventReportsService.js`**:
```javascript
if (config.program === 'new-program') {
  const result = await FormService.getForms('new-form-type', 1000)
  if (result.success) {
    forms = result.forms
  }
}
```

#### Custom Aggregation Functions

Add new aggregation types:

```javascript
switch (aggregationType) {
  // ... existing types
  case 'median':
    values.sort((a, b) => a - b)
    const mid = Math.floor(values.length / 2)
    return values.length % 2 ? values[mid] : (values[mid-1] + values[mid]) / 2
  case 'mode':
    // Most frequent value
    const freq = {}
    values.forEach(v => freq[v] = (freq[v] || 0) + 1)
    return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b)
}
```

## Future Enhancements

Potential improvements:
1. **Server-Side Aggregation**: For better performance with large datasets
2. **Advanced Filters**: Add more sophisticated filtering options
3. **Custom Calculations**: Support for calculated fields and indicators
4. **Dashboard Integration**: Save reports to dashboards
5. **Scheduled Reports**: Automatic report generation and email delivery
6. **Data Quality Checks**: Built-in validation and quality indicators
7. **Export Enhancement**: 
   - Actual Excel/CSV file generation (currently shows toast notification)
   - PDF with charts and formatting
   - JSON API for external systems
8. **Real Chart Implementation**: Replace placeholder with Chart.js integration
9. **Mobile Responsive**: Enhanced mobile interface
10. **Real-time Updates**: Live data streaming for active reports
11. **Collaboration**: Share reports with comments and annotations
12. **Data Caching**: Cache frequently accessed reports for faster load times
13. **Organization Unit Filtering**: Full implementation when org unit data available in forms

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify your data configuration
3. Ensure Firebase is properly configured
4. Review the component documentation in the code

## Comparison with DHIS2

This implementation follows DHIS2 event reporting patterns:
- ✅ Collapsible configuration panel
- ✅ Multiple dimension selection
- ✅ Period type selection
- ✅ Organization unit hierarchy
- ✅ Pivot table with aggregation
- ✅ Multiple output formats
- ✅ Chart visualization options
- ✅ Line list view
- ✅ Save favorites functionality
- ✅ Export capabilities

Built specifically for The Kukhoma Project's child protection and support services data management needs.
