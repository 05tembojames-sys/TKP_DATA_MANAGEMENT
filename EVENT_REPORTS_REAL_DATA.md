# Event Reports - Real Data Integration Guide

## Quick Reference

### ✅ What's Now Connected to Real Data

The Event Reports system is **fully integrated with your Firebase database**:

| Feature | Data Source | Status |
|---------|-------------|--------|
| Initial Referral Reports | `forms` collection (`formType: 'initial-referral'`) | ✅ Live |
| Child Assessment Reports | `forms` collection (`formType: 'initial-assessment'`) | ✅ Live |
| Child Overview Reports | `forms` collection (`formType: 'child-overview'`) | ✅ Live |
| Tracker Cases | TrackerService → derived from forms | ✅ Live |
| Combined Reports | All forms merged | ✅ Live |
| Period Filtering | Based on `createdAt` timestamp | ✅ Live |
| Line List View | Individual event records | ✅ Live |
| Statistics | Real counts and aggregations | ✅ Live |

## How It Works

### 1. Data Fetching Flow

```
User Selects Program
       ↓
EventReports.vue → updateReport()
       ↓
EventReportsService.generateReport(config)
       ↓
FormService.getForms(formType, limit)
       ↓
Firebase Firestore Query
       ↓
Filter by Period & Org Unit
       ↓
Aggregate Data (sum/avg/count/min/max)
       ↓
Build Pivot Table
       ↓
Return to UI
```

### 2. Program Mapping

When you select a program, here's what data gets loaded:

```javascript
'child-assessment'    → FormService.getForms('initial-assessment', 1000)
'child-tracking'      → TrackerService.getAllCases() 
'initial-referral'    → FormService.getForms('initial-referral', 1000)
'reports' (All)       → All three collections combined
```

### 3. Data Element Extraction

The service automatically extracts these fields from your forms:

**Age Data**:
```javascript
form.age || form.ageAtIntake
```

**Gender**:
```javascript
form.gender  // 'Male', 'Female', or other
```

**Status**:
```javascript
form.status  // 'draft', 'completed', 'pending'
```

**Referral Type**:
```javascript
form.referralMethod  // From initial-referral forms
```

**Dates**:
```javascript
form.createdAt  // Firestore timestamp
form.updatedAt  // Firestore timestamp
```

## Testing with Real Data

### Before You Have Forms

If your database is empty, the report will show:
- Empty state message
- No data available

**Action**: Create some forms using your existing form components first!

### After Adding Forms

1. Go to **Data Entry** on dashboard
2. Create 2-3 **Initial Referral Forms**
3. Create 2-3 **Child Overview Forms**
4. Create 2-3 **Initial Assessment Forms**
5. Go to **Event Reports**
6. Select program: **`reports`** (to see all)
7. Select data elements: **Age, Gender, Status**
8. Click **Update**
9. You should see your real data!

## Verification Checklist

To verify the integration is working:

- [ ] Open browser console (F12)
- [ ] Navigate to Event Reports
- [ ] Select a program (e.g., `initial-referral`)
- [ ] Select data elements
- [ ] Click Update
- [ ] Check console for log: `"Found X forms for program..."`
- [ ] Check console for log: `"After period filter: X forms"`
- [ ] Verify table shows real data (not mock data)
- [ ] Switch to Line List view
- [ ] Verify child names appear from your forms

## Console Logging

The service includes helpful logs for debugging:

```javascript
// In EventReportsService.generateReport()
console.log('Generating report with config:', config)
console.log(`Found ${forms.length} forms for program ${config.program}`)
console.log(`After period filter: ${forms.length} forms`)
```

**Check these logs to troubleshoot**:
- If "Found 0 forms" → No data in Firebase
- If "After period filter: 0 forms" → Period selection too restrictive
- If errors → Check Firebase connection

## Common Issues & Solutions

### Issue: "No data available"

**Causes**:
1. No forms in database
2. Program selection doesn't match form types
3. Period filter excludes all data
4. Firebase connection issue

**Solutions**:
- Check Firebase console → Firestore → `forms` collection
- Verify forms exist with correct `formType`
- Try selecting "All" periods
- Check browser console for errors

### Issue: "Numbers seem wrong"

**Cause**: Aggregation logic needs adjustment

**Solution**: 
1. Check `aggregateElementData()` in `eventReportsService.js`
2. Verify field mapping for your data elements
3. Adjust aggregation type (sum vs count vs average)

### Issue: "Dates not filtering correctly"

**Cause**: Timestamp format issues

**Solution**:
```javascript
// The service handles both Firestore timestamps and Date objects
const formDate = form.createdAt.toDate 
  ? form.createdAt.toDate() 
  : new Date(form.createdAt)
```

## Data Requirements

For optimal results, ensure your forms include:

**Required Fields**:
- `formType` - Identifies the form type
- `createdAt` - Firestore timestamp for date filtering
- `childFirstName` and/or `childLastName` - For identification

**Recommended Fields**:
- `age` or `ageAtIntake` - Numeric
- `gender` - String ('Male', 'Female', etc.)
- `status` - String ('draft', 'completed', 'pending')
- `referralMethod` - String (for referral forms)
- `orgUnit` - String (for org unit filtering)

## Extending the System

### Add a New Field for Reporting

**Example**: Adding "Education Level" to reports

1. **Ensure field exists in your forms**:
```javascript
// In your form component
educationLevel: 'Primary' // or 'Secondary', 'None', etc.
```

2. **Add to data elements** (`EventReports.vue`):
```javascript
{ id: 'education-level', name: 'Education Level' }
```

3. **Add extraction logic** (`eventReportsService.js`):
```javascript
case 'education-level':
  value = form.educationLevel || 'Unknown'
  // Convert to numeric for aggregation if needed
  value = form.educationLevel === 'Primary' ? 1 
        : form.educationLevel === 'Secondary' ? 2 
        : 0
  break
```

4. **Add display name**:
```javascript
getElementName(elementId) {
  const names = {
    // ... existing
    'education-level': 'Education Level'
  }
}
```

### Add a New Program Type

**Example**: Adding "Family Support" program

1. **Create forms with new formType**:
```javascript
FormService.saveFormWithCustomType({
  formType: 'family-support',
  // ... other data
})
```

2. **Add to program selector** (`EventReports.vue`):
```vue
<option value="family-support">Family Support Program</option>
```

3. **Add data fetching** (`eventReportsService.js`):
```javascript
if (config.program === 'family-support') {
  const result = await FormService.getForms('family-support', 1000)
  if (result.success) {
    forms = result.forms
  }
}
```

## Performance Tips

### For Large Datasets (100+ forms)

1. **Use Period Filtering**: Don't try to load all data at once
   ```
   Select: Last 3 months (not "All time")
   ```

2. **Limit Row Display**: Use the "Limit rows" option
   ```
   Set limit: 100 rows
   ```

3. **Use Specific Programs**: Don't always select "All reports"
   ```
   Select: Specific program instead of combined
   ```

### Firebase Optimization

Consider adding indexes for:
```
Collection: forms
Fields: formType, createdAt
```

This speeds up queries that filter by both type and date.

## Next Steps

1. **Test with Real Data**: Create some forms and generate reports
2. **Customize Elements**: Add fields specific to your program
3. **Create Favorites**: Save commonly used report configurations
4. **Export Data**: Use export functions for Excel/CSV
5. **Share Insights**: Use reports for stakeholder meetings

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify Firebase Firestore has data in `forms` collection
3. Check that form `formType` matches selected program
4. Review `eventReportsService.js` for data mapping logic

---

**Last Updated**: October 2025
**Version**: 1.0 (Real Data Integration)
