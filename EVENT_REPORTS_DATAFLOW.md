# Event Reports Data Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (EventReports.vue)                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Program    │  │ Data Elements│  │   Period     │          │
│  │   Selector   │  │  Checkboxes  │  │  Selection   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│          ┌─────────────────────────────┐                        │
│          │   🔄 Update Button         │                        │
│          └─────────────────────────────┘                        │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         │ config.value (program, elements, periods)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│              (eventReportsService.js)                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │  generateReport(config)                            │         │
│  │                                                      │         │
│  │  1. Determine which forms to fetch                 │         │
│  │  2. Call FormService or TrackerService             │         │
│  │  3. Apply period filters                           │         │
│  │  4. Apply org unit filters                         │         │
│  │  5. Build pivot table data                         │         │
│  │  6. Create line list                               │         │
│  └────────────────────────────────────────────────────┘         │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         │ Query based on program type
                         │
        ┌────────────────┼────────────────┐
        │                │                 │
        ▼                ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ FormService  │ │ FormService  │ │TrackerService│
│   .getForms  │ │   .getForms  │ │  .getAllCases│
│ ('initial-   │ │ ('initial-   │ │              │
│  referral')  │ │ assessment') │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                 │
       │                │                 │
       └────────────────┼─────────────────┘
                        │
                        │ Firebase queries
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE FIRESTORE                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Collection: "forms"                             │           │
│  │                                                   │           │
│  │  Documents:                                       │           │
│  │  ┌────────────────────────────────────────┐     │           │
│  │  │ { id: "abc123",                        │     │           │
│  │  │   formType: "initial-referral",        │     │           │
│  │  │   childFirstName: "Maria",             │     │           │
│  │  │   age: 14,                             │     │           │
│  │  │   gender: "Female",                    │     │           │
│  │  │   status: "completed",                 │     │           │
│  │  │   referralMethod: "Coptic Hospital",   │     │           │
│  │  │   createdAt: Timestamp,                │     │           │
│  │  │   ... }                                │     │           │
│  │  └────────────────────────────────────────┘     │           │
│  │  ┌────────────────────────────────────────┐     │           │
│  │  │ { id: "def456",                        │     │           │
│  │  │   formType: "initial-assessment",      │     │           │
│  │  │   childFirstName: "John",              │     │           │
│  │  │   ... }                                │     │           │
│  │  └────────────────────────────────────────┘     │           │
│  │  ... (more documents)                            │           │
│  └──────────────────────────────────────────────────┘           │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         │ Returns array of documents
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATA PROCESSING                                │
│              (eventReportsService.js)                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │  Filter & Transform:                               │         │
│  │                                                      │         │
│  │  1. filterByPeriod(forms, type, periods)          │         │
│  │     ├─ Extract createdAt timestamp                │         │
│  │     ├─ Compare with selected periods              │         │
│  │     └─ Return matching forms                      │         │
│  │                                                      │         │
│  │  2. buildPivotTable(forms, config)                │         │
│  │     ├─ Group forms by dimension (period/orgUnit)  │         │
│  │     ├─ Extract data elements from each form       │         │
│  │     ├─ Aggregate (sum/avg/count/min/max)         │         │
│  │     └─ Build rows with cells                      │         │
│  │                                                      │         │
│  │  3. buildLineList(forms)                          │         │
│  │     ├─ Convert each form to event record          │         │
│  │     ├─ Extract child name, date, program          │         │
│  │     └─ Sort by date                               │         │
│  └────────────────────────────────────────────────────┘         │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         │ Structured report data
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RETURN TO UI                                  │
│                                                                   │
│  {                                                                │
│    success: true,                                                │
│    headers: ['Period', 'Age', 'Gender', 'Status'],             │
│    rows: [                                                       │
│      { cells: [                                                  │
│          { value: 'October 2025', type: 'text' },              │
│          { value: 12, type: 'number' },                        │
│          { value: 2, type: 'number' },                         │
│          { value: 5, type: 'number' }                          │
│        ] },                                                      │
│      ...                                                         │
│    ],                                                            │
│    lineList: [                                                   │
│      { id, date, program, childName, status, ... },            │
│      ...                                                         │
│    ]                                                             │
│  }                                                                │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         │ Display results
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DISPLAY LAYER                                 │
│                  (EventReports.vue)                              │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │  📊 Table View  │  │  📈 Chart View  │  │ 📋 Line List  │ │
│  │                 │  │                 │  │                │ │
│  │  Period  | Age  │  │   [Chart]       │  │  Maria Santos  │ │
│  │  ────────────   │  │                 │  │  John Mwansa   │ │
│  │  Oct 2025 | 12  │  │                 │  │  Grace Phiri   │ │
│  │  Sep 2025 | 13  │  │                 │  │  ...           │ │
│  │  ...            │  │                 │  │                │ │
│  └─────────────────┘  └─────────────────┘  └────────────────┘ │
│                                                                   │
│  ⬇️ Download   🔗 Share   🖨️ Print   ⭐ Save Favorite          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Element Mapping

```
Firebase Form Field    →    Report Data Element
─────────────────────────────────────────────────
age                    →    Age (numeric)
ageAtIntake            →    Age (fallback)
gender                 →    Gender (Male=2, Female=1)
status                 →    Status (completed/draft/pending)
referralMethod         →    Referral Type
formType               →    Report Type
createdAt              →    Event Date (for filtering & grouping)
childFirstName         →    Child Name (display)
childLastName          →    Child Name (display)
```

## Aggregation Logic

```
User Selects          Service Performs
─────────────────────────────────────────
Sum                   → Add all values
                         Example: ages 12,14,13 → 39

Average               → Sum / Count
                         Example: ages 12,14,13 → 13

Count                 → Number of records
                         Example: 3 forms → 3

Min                   → Smallest value
                         Example: ages 12,14,13 → 12

Max                   → Largest value
                         Example: ages 12,14,13 → 14
```

## Period Filtering Flow

```
1. Get form date
   form.createdAt → Date object

2. Determine period ID
   Monthly:    Oct 2025  → "month-9"
   Quarterly:  Q4 2025   → "q4-2025"
   Yearly:     2025      → "year-2025"

3. Check if period ID in selectedPeriods
   If YES → Include form
   If NO  → Exclude form

4. Return filtered forms
```

## Example Query Execution

**User Configuration**:
- Program: `initial-referral`
- Elements: `age`, `gender`
- Period: Last 3 months
- Aggregation: `average`

**Execution**:
```
1. EventReportsService.generateReport(config)

2. FormService.getForms('initial-referral', 1000)
   → Returns 50 referral forms

3. filterByPeriod(forms, 'monthly', ['month-7', 'month-8', 'month-9'])
   → Returns 15 forms from last 3 months

4. Group by period:
   August 2025: [form1, form2, form3, form4, form5]
   September 2025: [form6, form7, form8, form9]
   October 2025: [form10, form11, form12, form13, form14, form15]

5. Aggregate:
   August - Age: (12+14+13+15+12)/5 = 13.2 → 13
   August - Gender: 3 Female, 2 Male → 5
   September - Age: (14+13+12+11)/4 = 12.5 → 13
   September - Gender: 2 Female, 2 Male → 4
   October - Age: (15+14+13+12+11+10)/6 = 12.5 → 13
   October - Gender: 4 Female, 2 Male → 6

6. Build table:
   Period       | Age | Gender
   ─────────────────────────
   August 2025  | 13  | 5
   September 25 | 13  | 4
   October 2025 | 13  | 6

7. Return to UI for display
```

## Key Files

```
src/
├── components/
│   └── EventReports.vue              # UI Component
├── services/
│   ├── eventReportsService.js        # Data Processing ⭐ NEW
│   ├── formService.js                # Firebase Forms Access
│   └── trackerService.js             # Tracker Cases
└── router/
    └── index.js                       # Route Definition
```

---

**Legend**:
- `▼` Data flow direction
- `┌─┐` Component/layer boundaries
- `→` Data transformation
- `⭐` New file for real data integration
