# Outreach Module Documentation

## Overview

The Outreach Module is a component of the TKP Data Management System that allows users to collect and manage data in the field, even when offline. It provides functionality similar to DHIS2 for offline data collection and synchronization.

## Features

1. **Offline Data Collection**: Users can create and edit forms without an internet connection
2. **Three Core Forms**:
   - Initial Child Referral Form
   - TKP Initial Assessment Form
   - Child Overview and Background Form
3. **Automatic Synchronization**: When connectivity is restored, data is automatically synced to the central database
4. **Data Integrity**: Prevents duplicate entries through validation
5. **User-Friendly Interface**: Intuitive dashboard with clear navigation

## Architecture

### Components

- `OutreachModule.vue`: Main module component
- `OutreachService.js`: Service layer for offline storage and synchronization
- Form components:
  - `InitialReferralForm.vue`
  - `InitialAssessmentForm.vue`
  - `ChildOverviewForm.vue`

### Data Flow

1. User creates/edits forms offline
2. Data is stored in browser's localStorage
3. When online, user initiates sync
4. Data is sent to Firebase backend
5. Local storage is updated with server IDs

## Implementation Details

### Offline Storage

- Uses localStorage for persistent offline storage
- Each form is saved with a unique local ID
- Forms track their sync status

### Synchronization

- Implements a queue system for failed sync attempts
- Maintains sync history for troubleshooting
- Handles network failures gracefully

### Form Management

- Supports draft saving
- Allows form completion marking
- Provides form editing capabilities

## Usage

### Accessing the Module

1. Navigate to the Dashboard
2. Click the "Outreach" button
3. The Outreach Module interface will load

### Creating Forms

1. Click "Add New Form"
2. Select the form type
3. Fill in the form data
4. Save as draft or submit

### Working Offline

1. All data is automatically saved to localStorage
2. Forms can be edited while offline
3. No internet connection is required for data entry

### Synchronizing Data

1. Ensure internet connectivity
2. Click the "Sync Data" button
3. View sync results in the Sync Status tab

## Technical Details

### Storage Structure

```javascript
// Forms storage
{
  id: 'local-123456789',
  formType: 'initial-referral',
  status: 'draft|completed',
  synced: true|false,
  data: { /* form data */ },
  createdAt: 'ISO timestamp',
  updatedAt: 'ISO timestamp',
  syncedAt: 'ISO timestamp'
}

// Sync history
{
  formId: 'local-123456789',
  formType: 'initial-referral',
  success: true|false,
  message: 'Sync result message',
  timestamp: 'ISO timestamp'
}
```

### Service Methods

- `saveFormLocally(form)`: Save form to localStorage
- `syncForm(form)`: Sync single form to server
- `syncAllForms()`: Sync all pending forms
- `getAllFormsFromLocalStorage()`: Retrieve all forms
- `getSyncHistory()`: Retrieve sync history

## Error Handling

- Network failures are handled by queuing failed syncs
- Data validation prevents corrupt entries
- User-friendly error messages guide recovery

## Future Enhancements

1. Conflict resolution for offline edits
2. Real-time sync when connectivity is restored
3. Enhanced offline search capabilities
4. Data export functionality
5. Multi-user collaboration features
