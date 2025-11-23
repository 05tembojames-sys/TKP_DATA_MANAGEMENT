# Data Entry App - Aggregate Data Entry

## Overview
The **Data Entry** app in the TKP Data Management System provides a DHIS2-like aggregate data entry interface for collecting aggregated data across different organization units and time periods.

## Location & Access

### How to Access:
1. **From Top Navigation**: 
   - Click the **Apps Menu** (grid icon) in the top header
   - Select **"Data Entry"** from the apps dropdown
   
2. **Direct URL**: 
   - Navigate to `/dashboard?view=data-entry`

### Apps Menu Location:
- **Icon**: <kbd>fa-keyboard</kbd> (Green keyboard icon)
- **Name**: Data Entry
- **ID**: `data-entry`
- **Color**: Green wrapper

---

## Component Structure

### Main Component:
**File**: `src/components/AggregateDataEntry.vue`

### Integration:
```vue
<!-- Dashboard.vue (lines 299-301) -->
<div v-if="currentView === 'data-entry'" class="forms-section" 
     style="padding: 0; height: calc(100vh - 48px);">
  <AggregateDataEntry />
</div>
```

### Navigation Handler:
```javascript
// TopHeader.vue - navigateToApp function
case 'data-entry':
  router.push({ path: '/dashboard', query: { view: 'data-entry' } });
  break;
```

---

## Features

### 1. **Organization Unit Tree**
- Hierarchical structure mimicking DHIS2
- Shows:
  - The Kukhoma Project (root)
  - Community Outreach - Lusaka
  - Community Outreach - Chongwe  
  - Educational Support Unit
  - Health Services Unit
  - Family Support Services
- Expandable/collapsible nodes
- Visual indicators for selection

### 2. **Data Set Selection**
Available datasets pulled from actual system forms:
- **Initial Child Referral Forms** - Child referral forms for abuse cases and pregnant children
- **Child Overview and Background Forms** - Comprehensive child background documentation
- **TKP Initial Assessment Forms** - Assessment forms for eligibility and admission
- **Monthly Progress Reports** - Monthly tracking of child progress
- **Quarterly Review Forms** - Quarterly comprehensive review

### 3. **Period Selection**
- Monthly periods (January 2024 - December 2024)
- Quarterly periods (Q1 2024 - Q4 2024)
- Annual period (2024)

### 4. **Data Entry Interface**

#### Structure:
Each data set contains sections with data elements:

**Example: Initial Referral Form**
- **Section**: Child Information
  - Child First Name (Text)
  - Child Last Name (Text)
  - Date of Birth (Date)
  - Age (Number, 0-18)
  - Date of Referral (Date)
  
- **Section**: Referral Details
  - Referral Method (Select)
  - Type of Abuse (Select)
  - Abuser Relationship (Text)
  
- **Section**: Home Situation
  - Primary Caregiver Name (Text)
  - Relationship to Child (Text)
  - Area of Town (Text)
  - Living Situation (Text)

#### Data Element Types:
- **TEXT**: Text input fields
- **NUMBER**: Numeric input with min/max validation
- **DATE**: Date picker
- **SELECT**: Dropdown with predefined options
- **BOOLEAN**: Yes/No selection

### 5. **Data Saving**

#### Real-time Firestore Integration:
```javascript
// Saves on input blur
const saveCell = async (elementId, value) => {
  if (!selectedOrgUnit.value || !selectedDataSet.value || !selectedPeriod.value) return;
  
  const dataKey = `${selectedOrgUnit.value}-${selectedDataSet.value}-${selectedPeriod.value}`;
  
  await setDoc(doc(db, 'aggregateData', dataKey), {
    orgUnit: selectedOrgUnit.value,
    dataSet: selectedDataSet.value,
    period: selectedPeriod.value,
    values: { [elementId]: value },
    lastUpdated: new Date(),
    updatedBy: 'current-user'
  }, { merge: true });
}
```

#### Firestore Collection:
- **Collection**: `aggregateData`
- **Document ID**: `{orgUnit}-{dataSet}-{period}`
- **Structure**:
  ```javascript
  {
    orgUnit: "kukhoma-main",
    dataSet: "initial-referral",
    period: "202401",
    values: {
      childFirstName: "Jane",
      childLastName: "Doe",
      dateOfBirth: "2010-01-15",
      // ... other data elements
    },
    completionStatus: 65,
    isComplete: false,
    completedBy: null,
    completedAt: null,
    lastUpdated: Timestamp,
    updatedBy: "user@example.com"
  }
  ```

### 6. **Sync Status Indicator**

Shows current save status in the header:
- 🔄 **Saving...** - Data is being saved to Firestore
- ✅ **Saved** - Data successfully saved
- ❌ **Error: [message]** - Save failed with error details

### 7. **Complete Dataset**

Marks the entire dataset as complete:
- Button: "Complete" (disabled until form has data)
- Sets `isComplete: true`
- Records `completedBy` and `completedAt`
- Prevents further editing (in production)

---

## Data Flow

```
User selects:
  1. Organization Unit (e.g., "Kukhoma Main")
  2. Data Set (e.g., "Initial Referral Form")
  3. Period (e.g., "January 2024")
     ↓
Form loads with structure from CaptureService.generateFormStructure()
     ↓
Existing data loaded from Firestore (if any)
     ↓
User enters/updates values
     ↓
Auto-saves to Firestore on blur (only if value changed)
     ↓
Sync status updates
     ↓
Click "Complete" to mark as finalized
```

---

## Service Integration

### CaptureService Methods Used:

```javascript
// Get available datasets
CaptureService.getDataSets()

// Get organization units
CaptureService.getOrgUnits()

// Get time periods
CaptureService.getPeriods()

// Generate form structure
CaptureService.generateFormStructure(dataSetId)

// Load existing data
CaptureService.loadExistingDataValues({ dataSetId, orgUnitId, periodId })

// Save data
CaptureService.saveDataValues({ dataSetId, orgUnitId, periodId, dataValues })

// Complete dataset
CaptureService.completeDataEntry({ dataSetId, orgUnitId, periodId, dataValues })
```

---

## UI/UX Features

### DHIS2-Style Interface:
- Left sidebar with org unit tree
- Top section for data set and period selection
- Center area for data entry table
- Settings panel for display options
- Professional color scheme matching DHIS2

### Responsive Design:
- Three-column layout on desktop
- Collapsible sections
- Scrollable data entry area
- Fixed header and navigation

### Visual Indicators:
- Selected org units highlighted
- Expandable tree nodes
- Input field validation
- Loading states
- Error messages
- Completion status badge

---

## Default Selections

For better UX, the form pre-selects:
1. **Organization Unit**: "kukhoma-main" (The Kukhoma Project - Main Center)
2. **Data Set**: "initial-referral" (Initial Child Referral Forms)
3. **Period**: Current month (automatically generated)

This allows users to start entering data immediately without making all selections first.

---

## Key Differences: Aggregate vs Individual Forms

| Aspect | Aggregate Data Entry | Individual Forms (Capture) |
|--------|---------------------|---------------------------|
| **Purpose** | Collect summarized data | Collect detailed individual records |
| **Entry Point** | Data Entry app | Capture app / Tracker Capture |
| **Structure** | Sections with data elements | Multi-step forms with validation |
| **Saves to** | `aggregateData` collection | `forms` collection |
| **Linked to** | Org Unit + Period | Specific child record |
| **Use Case** | Monthly reports, aggregates | Child enrollment, assessments |

---

## Usage Workflow

### Typical Data Entry Session:

1. **Navigate to Data Entry**
   - Click Apps menu → Data Entry

2. **Select Context** (if not using defaults)
   - Select organization unit from tree
   - Choose data set from dropdown
   - Pick time period

3. **Enter Data**
   - Fill in fields one by one
   - Data auto-saves on blur
   - Watch for "Saved" confirmation

4. **Review Progress**
   - Check completion status (e.g., "65% complete")
   - Ensure all required fields filled

5. **Complete Dataset**
   - Click "Complete" button
   - Confirms submission
   - Marks dataset as finalized

---

##Troubleshooting

### Form doesn't load:
- Check that all three selections are made (Org Unit, Dataset, Period)
- Refresh the page
- Check browser console for errors

### Data not saving:
- Ensure you have internet connection
- Check Firebase connection
- Verify authentication status
- Look for error messages in sync status

### Can't select organization unit:
- Click the expand arrow (▶) to show child units
- Click the radio button or unit name to select

### Missing data sets:
- Data sets are loaded from `CaptureService.getDataSets()`
- Check service file if datasets are missing

---

## Development Notes

### Adding New Data Sets:

1. **Update CaptureService** (`src/services/captureService.js`):
   ```javascript
   static async getDataSets() {
     return [
       // ... existing datasets
       {
         id: 'new-dataset-id',
         name: 'New Dataset Name',
         description: 'Description of the dataset'
       }
     ]
   }
   ```

2. **Define Form Structure**:
   ```javascript
   static generateFormStructure(dataSetId) {
     const formStructures = {
       // ... existing structures
       'new-dataset-id': {
         sections: [
           {
             id: 'section-1',
             name: 'Section Name',
             dataElements: [
               {
                 id: 'element_id',
                 name: 'Element Name',
                 valueType: 'TEXT',
                 required: true
               }
             ]
           }
         ]
       }
     }
   }
   ```

### Customizing Organization Units:

Edit `CaptureService.getOrgUnits()` to modify the org unit tree structure.

### Modifying Periods:

Edit `CaptureService.getPeriods()` to change available time periods or add new period types.

---

## Related Files

- **Component**: `src/components/AggregateDataEntry.vue`
- **Service**: `src/services/captureService.js`
- **Firebase Config**: `src/firebase/config.js`
- **Dashboard Integration**: `src/components/Dashboard.vue` (lines 299-301)
- **Navigation**: `src/components/TopHeader.vue` (lines 260, 460-462)
- **Router**: `src/router/index.js`

---

## Summary

The **Data Entry** app provides a professional, DHIS2-style interface for entering aggregate data. It integrates seamlessly with Firebase for real-time data persistence and offers an intuitive user experience with auto-save functionality, visual feedback, and proper validation.

**Access**: Apps Menu → Data Entry → Select Org Unit + Dataset + Period → Enter Data → Complete

For individual child-specific data entry, use the **Capture** app or **Tracker Capture** instead.
