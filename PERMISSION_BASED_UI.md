# Permission-Based UI Controls

## Overview
The system now implements permission-based UI controls that hide or disable features based on user roles and permissions. This ensures users only see and can interact with features they're authorized to use.

## Implementation Details

### 1. User Management Button

**Location:** Dashboard.vue - Dashboard buttons grid

**Behavior:**
- **Enabled for:** Admin, Manager roles, or users with `users_write` permission
- **Disabled for:** Regular users without user management permissions

**Visual Feedback:**
- Disabled buttons appear grayed out with reduced opacity (50%)
- Cursor changes to "not-allowed" when hovering over disabled buttons
- Button background changes to gray gradient
- No hover effects on disabled buttons

**Code:**
```vue
<button 
  class="dashboard-btn users-btn" 
  @click="canManageUsers ? $router.push('/user-management') : null"
  :disabled="!canManageUsers"
  :class="{ 'btn-disabled': !canManageUsers }"
>
  <i class="fas fa-users-cog btn-icon"></i>
  <span>Users</span>
</button>
```

**Permission Check:**
```javascript
const canManageUsers = computed(() => {
  const role = AuthService.getUserRoleInfo()
  return role === 'admin' || role === 'manager' || AuthService.hasPermission('users_write')
})
```

### 2. Reports Approval Functionality

**Location:** Reports.vue - Report cards and approval modal

**Behavior:**
- **Can Approve:** Admin and Manager roles
- **Upload Only:** Regular users and viewers

**Features Restricted:**
- ✅ Review button (only visible to admins/managers)
- 🗑️ Delete button (only visible to admins/managers)
- Approval modal and workflow (only accessible by admins/managers)

**Code:**
```vue
<!-- Reports component receives canApprove prop from Dashboard -->
<Reports :can-approve="canApproveReports" />

<!-- In Reports.vue -->
<button 
  v-if="report.status === 'pending' && canUserApprove"
  @click="showApprovalModal(report)"
  class="action-btn approve-btn"
>
  ✅ Review
</button>
```

**Permission Check:**
```javascript
const canApproveReports = computed(() => {
  const role = AuthService.getUserRoleInfo()
  return role === 'admin' || role === 'manager'
})

// In Reports.vue
const canUserApprove = computed(() => {
  return props.canApprove && isAdmin.value
})
```

## Role-Based Access Summary

| Feature | Admin | Manager | User | Viewer |
|---------|-------|---------|------|--------|
| **User Management Button** | ✅ Enabled | ✅ Enabled | ❌ Disabled | ❌ Disabled |
| **Upload Reports** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Approve Reports** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Delete Reports** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **View Reports** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Download Reports** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

## Visual Design

### Disabled Button Style
```css
.dashboard-btn:disabled,
.dashboard-btn.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
  box-shadow: 0 2px 8px rgba(158, 158, 158, 0.2);
}

.dashboard-btn:disabled:hover,
.dashboard-btn.btn-disabled:hover {
  transform: none; /* No lift effect */
  box-shadow: 0 2px 8px rgba(158, 158, 158, 0.2);
}
```

## User Experience

### For Regular Users:
1. **User Management Button:**
   - Appears grayed out and disabled
   - Clicking has no effect
   - Clear visual indication that feature is not accessible

2. **Reports Section:**
   - Can upload new reports
   - Can view and download all reports
   - Cannot see "Review" or "Delete" buttons
   - Cannot access approval workflow

### For Admins/Managers:
1. **User Management Button:**
   - Fully functional and clickable
   - Normal hover effects and styling

2. **Reports Section:**
   - Full access to upload, view, approve, and delete
   - Can access approval modal
   - Can review pending reports and approve/reject them

## Testing

### Test User Permissions:

1. **Login as Regular User (role: "user"):**
   - ✓ User Management button should be disabled
   - ✓ Can upload reports
   - ✓ Cannot approve or delete reports

2. **Login as Admin (role: "admin"):**
   - ✓ User Management button should be enabled
   - ✓ Can upload reports
   - ✓ Can approve and delete reports

3. **Login as Manager (role: "manager"):**
   - ✓ User Management button should be enabled
   - ✓ Can upload reports
   - ✓ Can approve and delete reports

## Future Enhancements

Potential areas for expansion:
- Add permission checks to other dashboard buttons (Analytics, Data Entry, etc.)
- Implement field-level permissions within forms
- Add audit logging for permission-based actions
- Create a permissions management UI for admins
- Implement custom role creation with granular permission selection

## Related Files

- **Dashboard.vue** - Main dashboard with permission-based button controls
- **Reports.vue** - Reports component with conditional approval features
- **auth.js** - Authentication service with role and permission checking
- **ROLE_BASED_ACCESS_CONTROL.md** - Complete RBAC documentation
- **RBAC_MIGRATION_GUIDE.md** - Migration guide for RBAC system

## Notes

- Permission checks happen at both UI level (hiding/disabling) and service level (enforcement)
- Disabled buttons remain visible to provide clear indication of available features
- Users see consistent experience across all permission-controlled features
- System gracefully handles missing permissions without errors
