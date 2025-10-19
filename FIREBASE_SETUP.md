# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `kukhoma-project`
4. Follow the setup wizard

## Step 2: Enable Authentication & Firestore

### Authentication
1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

### Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll update rules later)
4. Select your preferred location
5. Click **Done**

## Step 3: Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click **Web** icon (`</>`)
4. Register your app with name: `kukhoma-admin`
5. Copy the configuration object

## Step 4: Update Firebase Config

Replace the placeholder values in `src/firebase/config.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

## Step 5: First-Time Setup

The application will automatically handle the first admin creation through the user interface:

1. When you first visit the application, you'll see the "CREATE MAIN ADMIN" page
2. Fill in the admin details:
   - **Full Name**: Main Admin (pre-filled)
   - **Email**: admin@kukhoma.org (pre-filled)
   - **Phone Number**: +260977123456 (pre-filled)
   - **Password**: Create a strong password
   - **Confirm Password**: Confirm your password
3. Click "Create Admin Account"
4. The system will create the user and store admin data in Firestore
5. You'll be automatically redirected to the dashboard

**Note**: This setup page will only appear when no admin exists in the system. After the first admin is created, users will see the regular login page.

## Step 6: Test the Application

1. Start the development server: `npm run dev`
2. On first visit, you'll see the "CREATE MAIN ADMIN" setup page
3. Create your admin account with the form
4. After creation, you'll be redirected to the dashboard
5. For subsequent visits, you'll see the "LOGIN" page
6. Login with your created credentials

## Security Rules (Optional)

Add these Firestore security rules if you plan to use Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow authenticated admin users
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Troubleshooting

- **"Access denied: Admin privileges required"**: Ensure custom claims are set
- **"No account found"**: Create the user first in Firebase Console
- **Network errors**: Check Firebase configuration values
- **Permission denied**: Verify project permissions in Firebase Console