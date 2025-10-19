# Firebase Indexes Setup

## Required Firestore Indexes

The user management system requires specific indexes to function optimally. Follow these steps:

### 1. Create Required Indexes

#### Index for userSessions Collection
**Collection:** `userSessions`  
**Fields:**
- `userId` (Ascending)
- `loginTime` (Descending)

**How to create:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `khukomaproject`
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Set:
   - Collection ID: `userSessions`
   - Field 1: `userId` (Ascending)
   - Field 2: `loginTime` (Descending)
6. Click **Create**

**Or use this direct link:**
https://console.firebase.google.com/v1/r/project/khukomaproject/firestore/indexes?create_composite=ClNwcm9qZWN0cy9raHVrb21hcHJvamVjdC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdXNlclNlc3Npb25zL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWxvZ2luVGltZRACGgwKCF9fbmFtZV9fEAI

#### Index for userActivities Collection (Optional)
**Collection:** `userActivities`  
**Fields:**
- `userId` (Ascending)
- `timestamp` (Descending)

### 2. Additional Indexes (Recommended for Performance)

#### Users Collection Indexes
- `role` (Ascending) - For role-based queries
- `status` (Ascending) - For status filtering
- `orgUnit` (Ascending) - For organization filtering
- `createdAt` (Descending) - For sorting

## Alternative Solution: Use Firebase CLI

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login to Firebase
```bash
firebase login
```

### Initialize Firestore in your project
```bash
firebase init firestore
```

### Create firestore.indexes.json
Create a file called `firestore.indexes.json` in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "userSessions",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "loginTime",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "userActivities",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "role",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

## Verification

After creating the indexes:

1. Wait 5-10 minutes for indexes to build
2. Refresh your application
3. Navigate to User Management
4. Verify no console errors about missing indexes
5. Check that user data loads correctly with login times

## Troubleshooting

### If you still see index errors:
1. Check the exact error message
2. Copy the provided index creation URL
3. Create the specific index manually
4. Wait for completion before testing

### If some features don't work:
- The system has fallback mechanisms
- Users will still load without activity data
- Core functionality remains available
- Indexes improve performance but aren't critical

## Index Build Time
- Small collections: 1-2 minutes
- Medium collections: 5-10 minutes  
- Large collections: 30+ minutes

The system will work with degraded performance until indexes are ready.