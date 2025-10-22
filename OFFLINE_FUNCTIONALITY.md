# Offline Functionality Implementation

This document explains how the offline functionality has been implemented in the Outreach Module.

## Overview

The Outreach Module now supports full offline functionality, allowing field workers to:
- Create and edit forms while offline
- Save data locally using IndexedDB
- Automatically sync data when connectivity is restored
- See clear indicators of network status

## Technical Implementation

### 1. Storage Layer

We use `localForage` for robust offline storage:
- **IndexedDB** as the primary storage mechanism (more reliable than localStorage)
- **localStorage** as a fallback for older browsers
- Data is automatically migrated from localStorage to IndexedDB on initialization

### 2. Network Detection

The `useNetworkStatus` composable provides:
- Real-time network status detection
- Connection quality checking
- Automatic event handling for online/offline transitions

### 3. Sync Mechanism

The enhanced outreach service handles:
- Queueing unsynced forms
- Automatic sync when connectivity is restored
- Conflict resolution and error handling
- Sync history tracking

### 4. PWA Support

The application is configured as a Progressive Web App:
- Works offline after initial load
- Can be installed on devices
- Cached assets for fast loading

## Key Features

### Offline Data Creation
- Forms are saved locally immediately when created
- No data loss even if the app is closed

### Visual Indicators
- Clear "Offline Mode" banner when disconnected
- Individual form cards show offline status
- Sync status page shows network information

### Auto-Sync
- When connectivity is restored, pending forms are automatically synced
- Users don't need to manually trigger sync in most cases

### Data Integrity
- All data is timestamped
- Conflict resolution prevents data loss
- Sync history helps track what was synced when

## Testing Offline Functionality

To test the offline functionality:

1. Open the Outreach Module in your browser
2. Go to the browser's developer tools
3. Switch to the Network tab
4. Set the network to "Offline"
5. Create a new form and save it
6. Notice the "Offline Mode" banner appears
7. Switch back to "Online"
8. The form should automatically sync to Firebase

## File Structure

```
src/
├── components/
│   └── OutreachModule.vue          # Main component with network UI
├── composables/
│   ├── useNetworkStatus.js         # Network detection
│   └── useToast.js                 # Notifications (existing)
├── services/
│   ├── enhancedOutreachService.js  # Enhanced offline service
│   ├── formService.js              # Firebase integration (existing)
│   └── __tests__/
│       └── enhancedOutreachService.test.js  # Unit tests
└── firebase/
    └── config.js                   # Firebase config (existing)
```

## Dependencies

- `localforage`: For IndexedDB wrapper
- `vite-plugin-pwa`: For PWA functionality (already installed)
- `vue`: For reactivity (existing)

## Future Enhancements

1. **Organisation Unit Support**: Add filtering by location/organisation unit
2. **Case Search**: Implement offline search functionality
3. **Event Forms**: Extend to support different event types
4. **Data Validation**: Add offline form validation
5. **Progressive Enhancement**: Improve UI for offline scenarios

## Troubleshooting

If offline functionality isn't working:

1. Check that `localforage` is properly installed
2. Verify IndexedDB is supported in the browser
3. Ensure the PWA is properly configured in `vite.config.js`
4. Check browser console for errors