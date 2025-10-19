# Event Reports - Quick Start Guide

## ✅ Real Data Integration Complete!

Your Event Reports system is now connected to real Firebase data. Follow these steps to start using it.

## 5-Minute Setup

### Step 1: Verify You Have Data (2 min)

1. Open Firebase Console: https://console.firebase.google.com
2. Navigate to your project → Firestore Database
3. Check the `forms` collection
4. Verify you have documents with `formType` field

**If you have data**: ✅ Continue to Step 2
**If NO data**: Create some forms first (see below)

### Step 2: Access Event Reports (1 min)

1. Run dev server: `npm run dev`
2. Navigate to: http://localhost:5173
3. Log in to the system
4. Click **"Events"** button on dashboard

### Step 3: Generate Your First Report (2 min)

1. **Select Program**: Choose `reports` (to see all data)
2. **Select Data Elements**: Check ✓ Age, ✓ Gender, ✓ Status
3. **Period Type**: Select `Monthly`
4. **Select Periods**: Check the last 3 months
5. **Click**: **🔄 Update** button
6. **Wait**: System fetches and processes your data
7. **View**: Results appear in pivot table!

## If You Don't Have Data Yet

### Quick Data Creation (5 min)

1. **Go to Dashboard** → Click **"Data Entry"**
2. **Select**: Initial Child Referral Forms
3. **Click**: "Add New Form" button
4. **Fill in** required fields:
   - Child First Name: e.g., "Maria"
   - Child Last Name: e.g., "Santos"
   - Date of Birth: e.g., "2010-05-15"
   - Age: e.g., "14"
   - Gender: Select "Female" or "Male"
   - Referral Method: Select any option
   - Date of Referral: Today's date
5. **Save** the form
6. **Repeat** 5-10 times with different data
7. **Now** go to Event Reports!

## What You'll See

### Table View
```
Period          | Age | Gender | Status
────────────────────────────────────────
October 2025    | 13  | 5      | 3
September 2025  | 14  | 3      | 2
August 2025     | 12  | 4      | 4
```

### Line List View
```
Date       | Child Name    | Program          | Status
─────────────────────────────────────────────────────
2025-10-15 | Maria Santos  | Initial Referral | completed
2025-10-14 | John Mwansa   | Child Overview   | completed
2025-10-12 | Grace Phiri   | Initial Referral | draft
```

### Console Output (F12)
```
✓ Generating report with config: {...}
✓ Found 8 forms for program initial-referral
✓ After period filter: 8 forms
✓ Generated cases: 8
✓ Report updated successfully with 3 rows
```

## Quick Tips

### Tip 1: Start with "All Reports"
- Program: Select **`reports`**
- This shows data from ALL form types combined

### Tip 2: Use Monthly Periods
- Period Type: **Monthly**
- Select: Last 3 months
- Easier to see trends

### Tip 3: Watch the Console
- Press **F12** to open DevTools
- Go to **Console** tab
- See what data is being loaded

### Tip 4: Try Different Views
- **📊 Table**: See aggregated data
- **📈 Chart**: Visual representation (placeholder currently)
- **📋 Line List**: Individual records with details

### Tip 5: Experiment with Aggregation
- **Count**: How many forms
- **Average**: Mean value (good for age)
- **Sum**: Total (good for counts)
- **Min/Max**: Range of values

## Common Questions

### Q: "Why does it say 'No Data Available'?"
**A**: Either:
1. No forms in your Firebase database
2. Selected period excludes all your data
3. Selected program doesn't match your form types

**Fix**: 
- Check Firebase has forms
- Try selecting "All" for periods
- Select `reports` program to see everything

### Q: "Numbers don't look right"
**A**: Check your aggregation type:
- **Count** = number of forms (not sum of values)
- **Sum** = adds up all values
- **Average** = mean value

### Q: "Can I see individual records?"
**A**: Yes! Click **📋 Line List** tab to see each form individually

### Q: "How do I export?"
**A**: Click **⬇️ Download** button. Currently shows notification (actual file export coming soon)

### Q: "Where is the data stored?"
**A**: Firebase Firestore → `forms` collection

## Next Steps

### Explore More Programs
Try each program type:
- `child-assessment` - Assessment forms only
- `child-tracking` - Tracker cases
- `initial-referral` - Referral forms only
- `reports` - Everything combined

### Try Different Elements
Select different data combinations:
- Age + Gender → Demographics
- Status + Report Type → Progress tracking
- Referral Type + Age → Referral patterns

### Use Date Ranges
Try custom date ranges:
- Period Type: **Custom**
- Start Date: 3 months ago
- End Date: Today
- Click Update

### Save Favorites
For reports you use often:
- Configure the report
- Click **⭐ Save as favorite**
- Give it a name
- Reuse later!

## Troubleshooting

### "Nothing happens when I click Update"
1. Open Console (F12)
2. Look for error messages
3. Check: Did you select a program?
4. Check: Did you select data elements?

### "Loading forever"
1. Check internet connection
2. Check Firebase console for issues
3. Try refreshing the page
4. Check Console for errors

### "Data looks weird"
1. Verify your forms have correct data
2. Check aggregation type is appropriate
3. Try different data elements
4. Check period selection

## Getting Help

### Check These First
1. **Console logs** (F12 → Console)
2. **Firebase console** (verify data exists)
3. **Documentation** (EVENT_REPORTS_REAL_DATA.md)

### What to Check
- ✓ Firebase is connected
- ✓ Forms exist in database
- ✓ Forms have `formType`, `createdAt` fields
- ✓ Dev server is running
- ✓ No errors in console

## Success Checklist

After following this guide, you should be able to:

- [ ] Access Event Reports page
- [ ] See available programs in dropdown
- [ ] Select data elements (checkboxes work)
- [ ] Choose periods (options appear)
- [ ] Click Update (button works)
- [ ] See loading indicator
- [ ] View data in table (real data appears)
- [ ] Switch to Line List view
- [ ] See child names from your forms
- [ ] No errors in console
- [ ] Data matches what's in Firebase

## Congratulations! 🎉

You've successfully:
- ✅ Connected Event Reports to real Firebase data
- ✅ Generated your first report
- ✅ Viewed aggregated data
- ✅ Seen individual event records

**You're ready to use Event Reports for real data analysis!**

---

**Need more details?** Check:
- `EVENT_REPORTS.md` - Complete feature guide
- `EVENT_REPORTS_REAL_DATA.md` - Technical details
- `EVENT_REPORTS_DATAFLOW.md` - System architecture

**Last Updated**: October 2025
