# 🔐 Role-Based Access Control (RBAC) System

## ✅ **ALL USERS CAN NOW LOG IN!**

The system has been updated to allow **all user roles** to log in. Access to features is now controlled by **role-based permissions**.

---

## 🎯 System Changes

### **Before (Old System)**
```
✅ Administrator → CAN LOG IN
❌ Manager      → CANNOT LOG IN
❌ User         → CANNOT LOG IN
❌ Viewer       → CANNOT LOG IN
```

### **After (New System - Current)**
```
✅ Administrator → CAN LOG IN → Full Access
✅ Manager       → CAN LOG IN → Manage team & reports
✅ User          → CAN LOG IN → Data entry & forms
✅ Viewer        → CAN LOG IN → Read-only access
```

---

## 👥 User Roles & Permissions

### 1. **Administrator** 👑

**Login:** ✅ Yes  
**Access Level:** Full System Access

**Default Permissions:**
- ✅ View Users
- ✅ Manage Users (Create, Edit, Delete)
- ✅ View Forms
- ✅ Manage Forms (Create, Edit, Delete)
- ✅ View Reports
- ✅ Manage Reports (Create, Edit, Delete)
- ✅ View Analytics
- ✅ System Administration

**Can Do:**
- Manage all users and roles
- Configure system settings
- Access all modules
- View and export all data
- Manage permissions for other users

**Best For:**
- System administrators
- IT staff
- Senior management

---

### 2. **Manager** 📊

**Login:** ✅ Yes  
**Access Level:** Supervisory Access

**Typical Permissions:**
- ✅ View Users
- ❌ Manage Users (limited - can view only)
- ✅ View Forms
- ✅ Manage Forms (Edit existing, approve)
- ✅ View Reports
- ✅ Manage Reports (Create, edit team reports)
- ✅ View Analytics
- ❌ System Administration

**Can Do:**
- Supervise team activities
- Create and manage reports
- View analytics and dashboards
- Approve submitted forms
- Manage team data

**Best For:**
- Team leaders
- Department heads
- Program managers
- Supervisors

---

### 3. **User** 👤

**Login:** ✅ Yes  
**Access Level:** Standard User Access

**Typical Permissions:**
- ❌ View Users
- ❌ Manage Users
- ✅ View Forms (own forms only)
- ✅ Manage Forms (Create, edit own forms)
- ✅ View Reports (own reports only)
- ❌ Manage Reports (limited - can create only)
- ❌ View Analytics
- ❌ System Administration

**Can Do:**
- Enter data and create forms
- View and edit their own submissions
- Generate basic reports
- Update personal information

**Best For:**
- Data entry staff
- Field workers
- Case workers
- General staff members

---

### 4. **Viewer** 👁️

**Login:** ✅ Yes  
**Access Level:** Read-Only Access

**Typical Permissions:**
- ❌ View Users (limited - can see list only)
- ❌ Manage Users
- ✅ View Forms (read-only)
- ❌ Manage Forms
- ✅ View Reports (read-only)
- ❌ Manage Reports
- ✅ View Analytics (read-only)
- ❌ System Administration

**Can Do:**
- View forms and data (no editing)
- View reports and analytics
- Generate read-only exports
- Monitor system activity

**Best For:**
- Auditors
- External partners
- Monitoring & Evaluation staff
- Stakeholders needing oversight

---

## 🔑 Permission System

### **Available Permissions:**

| Permission ID | Name | Description |
|--------------|------|-------------|
| `users_read` | View Users | Can view user information |
| `users_write` | Manage Users | Can create, edit, and delete users |
| `forms_read` | View Forms | Can view form data |
| `forms_write` | Manage Forms | Can create and edit forms |
| `reports_read` | View Reports | Can view reports |
| `reports_write` | Manage Reports | Can create and manage reports |
| `analytics_read` | View Analytics | Can view analytics and dashboards |
| `system_admin` | System Administration | Full system administration access |

### **How Permissions Work:**

1. **Role-Based:** Each role has default permissions
2. **Customizable:** Admins can add/remove specific permissions
3. **Hierarchical:** Admins have all permissions by default
4. **Granular:** Fine-grained control over features

---

## 🚀 How to Use the System

### **Creating Users with Different Roles**

#### **Method 1: Dashboard Quick Create**

1. Dashboard → User Management section
2. Click "Add New User"
3. Fill in details:
   ```
   Full Name: John Doe
   Email: john@example.com
   Password: SecurePass123
   Phone: +260977123456
   Role: User  ← Select appropriate role
   ```
4. Click "Create User"
5. ✅ User can now log in!

---

#### **Method 2: UserManagement Advanced Create**

1. Dashboard → "User Management" button
2. Click "+ Add User"
3. Fill comprehensive form:
   
   **Personal Information:**
   ```
   Full Name: Jane Smith
   Username: janesmith
   Email: jane@example.com
   Phone: +260977123456
   ```

   **System Access:**
   ```
   Role: Manager  ← Select role
   Organization Unit: Main Center
   Status: Active
   Password: TempPassword123
   ```

   **Permissions:** (Check boxes based on role)
   - ☑ View Users
   - ☑ View Forms
   - ☑ Manage Forms
   - ☑ View Reports
   - ☑ Manage Reports
   - ☑ View Analytics

4. Click "Create User"
5. ✅ User can log in with assigned permissions!

---

## 🧪 Testing Different Roles

### **Test Scenario 1: Admin User**

1. Create user with **Administrator** role
2. Log out and log in with new credentials
3. **Expected:** 
   - ✅ Full access to all features
   - ✅ Can manage users
   - ✅ Can access all modules

---

### **Test Scenario 2: Manager User**

1. Create user with **Manager** role
2. Assign permissions:
   - ✅ View Users
   - ✅ Manage Forms
   - ✅ View Reports
   - ✅ View Analytics
3. Log out and log in
4. **Expected:**
   - ✅ Can view users (read-only)
   - ✅ Can manage forms
   - ✅ Can view analytics
   - ❌ Cannot create/delete users

---

### **Test Scenario 3: Regular User**

1. Create user with **User** role
2. Assign permissions:
   - ✅ View Forms
   - ✅ Manage Forms (own only)
3. Log out and log in
4. **Expected:**
   - ✅ Can create forms
   - ✅ Can edit own forms
   - ❌ Cannot access user management
   - ❌ Cannot access system settings

---

### **Test Scenario 4: Viewer User**

1. Create user with **Viewer** role
2. Assign permissions:
   - ✅ View Forms
   - ✅ View Reports
3. Log out and log in
4. **Expected:**
   - ✅ Can view all forms (read-only)
   - ✅ Can view reports (read-only)
   - ❌ Cannot edit anything
   - ❌ Cannot create new entries

---

## 🔒 Account Status Control

Users can have different statuses that affect login:

### **Status Types:**

| Status | Can Log In? | Description |
|--------|------------|-------------|
| **Active** | ✅ Yes | Normal active user |
| **Inactive** | ❌ No | Temporarily disabled |
| **Suspended** | ❌ No | Account suspended |

**Admin Actions:**
- Activate/Deactivate users
- Suspend accounts
- Reactivate suspended accounts

---

## 📋 Default Permission Sets

### **Recommended Permission Sets by Role:**

#### **Administrator**
```javascript
{
  role: 'admin',
  permissions: [
    'users_read',
    'users_write',
    'forms_read',
    'forms_write',
    'reports_read',
    'reports_write',
    'analytics_read',
    'system_admin'
  ]
}
```

#### **Manager**
```javascript
{
  role: 'manager',
  permissions: [
    'users_read',
    'forms_read',
    'forms_write',
    'reports_read',
    'reports_write',
    'analytics_read'
  ]
}
```

#### **User**
```javascript
{
  role: 'user',
  permissions: [
    'forms_read',
    'forms_write',
    'reports_read'
  ]
}
```

#### **Viewer**
```javascript
{
  role: 'viewer',
  permissions: [
    'forms_read',
    'reports_read',
    'analytics_read'
  ]
}
```

---

## 🔧 Technical Implementation

### **Authentication Changes**

**File:** `src/services/auth.js`

**Key Changes:**
1. ✅ Removed admin-only login restriction
2. ✅ Added role and permission storage
3. ✅ Added status checking (active/inactive/suspended)
4. ✅ Added permission checking methods

**New Methods:**
```javascript
// Get current user role
AuthService.getUserRoleInfo()

// Get user permissions
AuthService.getUserPermissions()

// Check specific permission
AuthService.hasPermission('users_write')
```

---

### **UI Updates**

**Files Updated:**
1. `src/components/Dashboard.vue` - Updated warning message
2. `src/components/UserManagement.vue` - Updated warning message

**Changes:**
- ❌ Old: "Only administrators can log in"
- ✅ New: "All roles can log in. Permissions controlled via role & permissions."

---

## 🎯 Best Practices

### **1. Assigning Roles**

✅ **Do:**
- Assign **minimum required permissions**
- Use **Manager** for supervisory staff
- Use **User** for data entry personnel
- Use **Viewer** for auditors/stakeholders

❌ **Don't:**
- Give everyone admin access
- Create users without reviewing permissions
- Leave default passwords unchanged

---

### **2. Managing Permissions**

✅ **Do:**
- Review permissions regularly
- Use granular permissions
- Document permission changes
- Test role access before deployment

❌ **Don't:**
- Give all permissions to everyone
- Skip permission configuration
- Forget to update permissions when roles change

---

### **3. Security**

✅ **Do:**
- Enforce strong passwords
- Deactivate users who leave
- Monitor login activities
- Regular permission audits

❌ **Don't:**
- Share admin accounts
- Leave inactive accounts active
- Ignore security alerts

---

## 📊 Migration from Old System

### **Updating Existing Users**

If you have existing users from the old system:

1. **Admin users:** Already work ✅
2. **Non-admin users:** Now can log in ✅
3. **No action needed:** System auto-updates

### **Recommended Actions:**

1. **Review all user accounts**
   - Check roles are appropriate
   - Verify permissions match job functions
   - Update organization units

2. **Communicate changes to users**
   - Send email about new capabilities
   - Provide login instructions
   - Explain permission system

3. **Test each role**
   - Verify login works for all roles
   - Check permission restrictions work
   - Ensure features are accessible

---

## 🆘 Troubleshooting

### **Issue 1: User can't log in**

**Possible Causes:**
- Account status is not "active"
- Password is incorrect
- User doesn't exist in Firestore

**Solution:**
1. Check Firebase Console → Users collection
2. Verify `status: "active"`
3. Check Firebase Auth for user account
4. Reset password if needed

---

### **Issue 2: User logs in but can't access features**

**Possible Causes:**
- Missing permissions
- Role not configured correctly

**Solution:**
1. Open UserManagement
2. Find the user
3. Click "Edit"
4. Check "Permissions" section
5. Add required permissions
6. Save changes

---

### **Issue 3: "Account is inactive" error**

**Cause:**
- User status set to "inactive" or "suspended"

**Solution:**
1. Admin opens UserManagement
2. Find the user
3. Click toggle status button
4. Change to "Active"
5. User can now log in

---

## 📚 Related Documentation

- [`auth.js`](file://c:\Users\james\Desktop\khukoma-project\src\services\auth.js) - Authentication service
- [`userService.js`](file://c:\Users\james\Desktop\khukoma-project\src\services\userService.js) - User management
- [`Dashboard.vue`](file://c:\Users\james\Desktop\khukoma-project\src\components\Dashboard.vue) - Main dashboard
- [`UserManagement.vue`](file://c:\Users\james\Desktop\khukoma-project\src\components\UserManagement.vue) - User management UI
- [`USER_ROLES_EXPLAINED.md`](file://c:\Users\james\Desktop\khukoma-project\USER_ROLES_EXPLAINED.md) - Previous documentation

---

## ✅ Summary

**System Updates:**
- ✅ All roles can now log in
- ✅ Permission-based access control
- ✅ Account status enforcement
- ✅ Granular permission system
- ✅ Updated UI messages

**User Experience:**
- ✅ Clear role descriptions
- ✅ Customizable permissions
- ✅ Better access control
- ✅ Improved security

**Next Steps:**
1. Create users with appropriate roles
2. Assign permissions as needed
3. Test login for each role
4. Monitor system usage

---

**Last Updated:** 2024-10-19  
**Status:** ✅ All roles can log in - RBAC active
