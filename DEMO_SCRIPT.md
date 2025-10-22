# Outreach Module Demonstration Script

## Overview

This script demonstrates the key features of the Outreach Module for the TKP Data Management System.

## Prerequisites

- Application is running
- User is logged in
- Browser with localStorage support

## Demonstration Steps

### 1. Accessing the Outreach Module

1. Navigate to the Dashboard
2. Locate the "Outreach" button (purple gradient)
3. Click the button to enter the Outreach Module

### 2. Creating a New Form

1. In the Outreach Module, click "Add New Form"
2. Select "Initial Child Referral" from the options
3. Fill in sample data:
   - Child First Name: Maria
   - Child Last Name: Santos
   - Date of Birth: 2010-05-15
   - Age: 14
   - Date of Referral: Today's date
   - Referral Method: Department of Social Welfare - Lusaka
   - Type of Abuse: Defilement
   - Abuser Relationship: Uncle
   - Primary Caregiver Name: Ana Santos
   - Relationship to Child: Mother
   - Area of Town: Matero
   - Living Situation: Living with extended family

### 3. Saving as Draft

1. Click "Save Draft" button
2. Observe success message
3. Return to Forms list view
4. Note the form appears with "Draft" status and offline indicator

### 4. Editing a Form

1. Click "Edit" on the draft form
2. Make changes to any field
3. Click "Save Draft" again
4. Return to Forms list view

### 5. Completing a Form

1. Click "Edit" on the draft form
2. Click "Submit" button
3. Observe success message
4. Return to Forms list view
5. Note the form now shows "Completed" status

### 6. Working Offline

1. Open browser developer tools
2. Go to Network tab
3. Disable network connectivity (set to "Offline")
4. Create a new form
5. Save as draft
6. Note that form is saved despite no connectivity

### 7. Synchronizing Data

1. Re-enable network connectivity
2. Click "Sync Data" button
3. Observe sync process
4. View sync results in Sync Status tab
5. Note that previously offline forms are now synced

### 8. Sync Status Monitoring

1. Navigate to Sync Status tab
2. View sync history
3. Note successful sync entries
4. Observe statistics (total forms, pending sync, completed)

## Key Features Demonstrated

### Offline Capability

- Forms saved to localStorage
- Data persists without internet
- No data loss during offline work

### Synchronization

- Manual sync process
- Automatic status updates
- Retry mechanism for failed syncs

### User Experience

- Intuitive tab-based interface
- Clear status indicators
- Responsive design
- Helpful feedback messages

## Troubleshooting

### Common Issues

1. **Forms not syncing**: Check network connectivity
2. **Data not saving**: Verify browser supports localStorage
3. **Sync failures**: Check Firebase configuration

### Reset Procedure

1. Clear browser localStorage for the application
2. Refresh the page
3. Log in again

## Questions and Answers

### Q: How does the system prevent duplicate entries?

A: The system uses validation in the form components and checks for duplicates before saving to the database.

### Q: What happens if a sync fails?

A: Failed syncs are added to a queue and can be retried manually or automatically when connectivity is restored.

### Q: Can multiple users work on the same data?

A: The current implementation is designed for single-user scenarios. Multi-user collaboration would require additional conflict resolution mechanisms.

### Q: How much data can be stored offline?

A: Storage is limited by the browser's localStorage quota (typically 5-10MB). For larger datasets, IndexedDB could be implemented.

## Conclusion

The Outreach Module provides a robust solution for offline data collection with seamless synchronization when connectivity is restored. It maintains data integrity while providing a user-friendly interface for field workers.
