import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { 
  createUserWithEmailAndPassword, 
  updatePassword,
  deleteUser as deleteAuthUser,
  sendPasswordResetEmail
} from 'firebase/auth'
import { db, auth } from '../firebase/config.js'

class UserService {
  constructor() {
    this.usersCollection = 'users'
    this.userSessionsCollection = 'userSessions'
    this.userActivitiesCollection = 'userActivities'
  }

  // Get all users with comprehensive data
  async getAllUsers() {
    try {
      const q = query(
        collection(db, this.usersCollection),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const users = []
      
      for (const docSnapshot of querySnapshot.docs) {
        try {
          const userData = docSnapshot.data()
          
          // Ensure required fields have default values
          const safeUserData = {
            name: userData.name || 'Unknown User',
            username: userData.username || 'unknown',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role || 'user',
            orgUnit: userData.orgUnit || '',
            status: userData.status || 'inactive',
            permissions: userData.permissions || [],
            avatar: userData.avatar || null,
            ...userData
          }
          
          // Check if user is currently online (with fallback)
          let isOnline = false
          try {
            isOnline = await this.checkUserOnlineStatus(docSnapshot.id)
          } catch (error) {
            console.warn('Failed to check online status for user:', docSnapshot.id)
          }
          
          // Get user's last login (with fallback)
          let lastLogin = null
          try {
            lastLogin = await this.getUserLastLogin(docSnapshot.id)
          } catch (error) {
            console.warn('Failed to get last login for user:', docSnapshot.id)
          }
          
          // Get login count (with fallback)
          let loginCount = 0
          try {
            loginCount = await this.getUserLoginCount(docSnapshot.id)
          } catch (error) {
            console.warn('Failed to get login count for user:', docSnapshot.id)
          }
          
          users.push({
            id: docSnapshot.id,
            ...safeUserData,
            isOnline,
            lastLogin,
            loginCount,
            // Convert Firestore timestamps to ISO strings
            createdAt: safeUserData.createdAt?.toDate?.()?.toISOString() || safeUserData.createdAt || new Date().toISOString(),
            updatedAt: safeUserData.updatedAt?.toDate?.()?.toISOString() || safeUserData.updatedAt || new Date().toISOString()
          })
        } catch (userError) {
          console.error('Error processing user:', docSnapshot.id, userError)
          // Skip this user but continue with others
          continue
        }
      }
      
      return { success: true, users }
    } catch (error) {
      console.error('Error getting users:', error)
      return { success: false, error: error.message }
    }
  }

  // Add a new user with comprehensive data structure
  async addUser(userData) {
    try {
      const { 
        name, 
        username, 
        email, 
        phone, 
        password, 
        role, 
        orgUnit, 
        status,
        permissions
      } = userData
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const authUser = userCredential.user
      
      // Store comprehensive user data in Firestore
      const userDoc = {
        uid: authUser.uid,
        name: name || '',
        username: username || '',
        email: email,
        phone: phone || '',
        role: role || 'user',
        orgUnit: orgUnit || '',
        status: status || 'active',
        permissions: permissions || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        loginCount: 0,
        lastLogin: null,
        isOnline: false,
        avatar: null
      }
      
      const docRef = await addDoc(collection(db, this.usersCollection), userDoc)
      
      // Log user creation activity
      await this.logUserActivity(docRef.id, 'user_created', {
        createdBy: auth.currentUser?.uid,
        userRole: role
      })
      
      return { 
        success: true, 
        id: docRef.id,
        message: 'User created successfully'
      }
    } catch (error) {
      console.error('Error adding user:', error)
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) || error.message 
      }
    }
  }

  // Update user information with comprehensive support
  async updateUser(userId, userData) {
    try {
      const userDocRef = doc(db, this.usersCollection, userId)
      
      // Prepare update data
      const updateData = {
        ...userData,
        updatedAt: serverTimestamp()
      }
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key]
        }
      })
      
      // Update user data in Firestore
      await updateDoc(userDocRef, updateData)
      
      // Log user update activity
      await this.logUserActivity(userId, 'user_updated', {
        updatedBy: auth.currentUser?.uid,
        updatedFields: Object.keys(userData)
      })
      
      return { 
        success: true, 
        message: 'User updated successfully' 
      }
    } catch (error) {
      console.error('Error updating user:', error)
      return { success: false, error: error.message }
    }
  }

  // Delete user with cleanup
  async deleteUser(userId) {
    try {
      const userDocRef = doc(db, this.usersCollection, userId)
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' }
      }
      
      const userData = userDoc.data()
      
      // Log user deletion activity before deletion
      await this.logUserActivity(userId, 'user_deleted', {
        deletedBy: auth.currentUser?.uid,
        userRole: userData.role,
        userName: userData.name
      })
      
      // Delete user sessions
      await this.cleanupUserSessions(userId)
      
      // Delete user activities
      await this.cleanupUserActivities(userId)
      
      // Delete from Firestore
      await deleteDoc(userDocRef)
      
      return { 
        success: true, 
        message: 'User deleted successfully' 
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      return { success: false, error: error.message }
    }
  }

  // Get user by ID with full details
  async getUserById(userId) {
    try {
      const userDocRef = doc(db, this.usersCollection, userId)
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' }
      }
      
      const userData = userDoc.data()
      
      // Get additional user data
      const isOnline = await this.checkUserOnlineStatus(userId)
      const lastLogin = await this.getUserLastLogin(userId)
      const loginCount = await this.getUserLoginCount(userId)
      
      return { 
        success: true, 
        user: { 
          id: userDoc.id,
          ...userData,
          isOnline,
          lastLogin,
          loginCount,
          createdAt: userData.createdAt?.toDate?.()?.toISOString() || userData.createdAt,
          updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || userData.updatedAt
        } 
      }
    } catch (error) {
      console.error('Error getting user:', error)
      return { success: false, error: error.message }
    }
  }

  // Update user status (active/inactive/suspended)
  async updateUserStatus(userId, status) {
    try {
      const userDocRef = doc(db, this.usersCollection, userId)
      
      await updateDoc(userDocRef, {
        status: status,
        updatedAt: serverTimestamp()
      })
      
      // Log status change
      await this.logUserActivity(userId, 'status_changed', {
        changedBy: auth.currentUser?.uid,
        newStatus: status
      })
      
      return { 
        success: true, 
        message: `User ${status === 'active' ? 'activated' : status} successfully` 
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      return { success: false, error: error.message }
    }
  }

  // Send password reset email
  async resetUserPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      
      return { 
        success: true, 
        message: 'Password reset email sent successfully' 
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) || error.message 
      }
    }
  }

  // Check if user is currently online
  async checkUserOnlineStatus(userId) {
    try {
      const sessionQuery = query(
        collection(db, this.userSessionsCollection),
        where('userId', '==', userId),
        where('isActive', '==', true)
      )
      
      const querySnapshot = await getDocs(sessionQuery)
      return !querySnapshot.empty
    } catch (error) {
      console.error('Error checking online status:', error)
      return false
    }
  }

  // Get user's last login time
  async getUserLastLogin(userId) {
    try {
      // Try with index first, fall back to simple query if index doesn't exist
      let sessionQuery
      
      try {
        sessionQuery = query(
          collection(db, this.userSessionsCollection),
          where('userId', '==', userId),
          orderBy('loginTime', 'desc')
        )
        const querySnapshot = await getDocs(sessionQuery)
        if (!querySnapshot.empty) {
          const lastSession = querySnapshot.docs[0].data()
          return lastSession.loginTime?.toDate?.()?.toISOString() || lastSession.loginTime
        }
      } catch (indexError) {
        // If index doesn't exist, fall back to getting all user sessions and sorting manually
        console.warn('Index not found for userSessions, using fallback method')
        const fallbackQuery = query(
          collection(db, this.userSessionsCollection),
          where('userId', '==', userId)
        )
        const fallbackSnapshot = await getDocs(fallbackQuery)
        
        if (!fallbackSnapshot.empty) {
          // Sort manually by loginTime
          const sessions = fallbackSnapshot.docs
            .map(doc => doc.data())
            .filter(session => session.loginTime)
            .sort((a, b) => {
              const aTime = a.loginTime?.toDate?.() || new Date(a.loginTime)
              const bTime = b.loginTime?.toDate?.() || new Date(b.loginTime)
              return bTime - aTime
            })
          
          if (sessions.length > 0) {
            return sessions[0].loginTime?.toDate?.()?.toISOString() || sessions[0].loginTime
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting last login:', error)
      return null
    }
  }

  // Get user's total login count
  async getUserLoginCount(userId) {
    try {
      const userDocRef = doc(db, this.usersCollection, userId)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        return userDoc.data().loginCount || 0
      }
      
      return 0
    } catch (error) {
      console.error('Error getting login count:', error)
      return 0
    }
  }

  // Record user login
  async recordUserLogin(userId) {
    try {
      // Update login count and last login time
      const userDocRef = doc(db, this.usersCollection, userId)
      await updateDoc(userDocRef, {
        loginCount: increment(1),
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // Create user session
      await addDoc(collection(db, this.userSessionsCollection), {
        userId: userId,
        loginTime: serverTimestamp(),
        isActive: true,
        userAgent: navigator.userAgent || 'Unknown',
        ipAddress: 'Unknown' // Would need additional service to get real IP
      })
      
      // Log login activity
      await this.logUserActivity(userId, 'user_login', {})
      
      return { success: true }
    } catch (error) {
      console.error('Error recording login:', error)
      return { success: false, error: error.message }
    }
  }

  // Record user logout
  async recordUserLogout(userId) {
    try {
      // Update active sessions to inactive
      const sessionQuery = query(
        collection(db, this.userSessionsCollection),
        where('userId', '==', userId),
        where('isActive', '==', true)
      )
      
      const querySnapshot = await getDocs(sessionQuery)
      const updatePromises = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          isActive: false,
          logoutTime: serverTimestamp()
        })
      )
      
      await Promise.all(updatePromises)
      
      // Log logout activity
      await this.logUserActivity(userId, 'user_logout', {})
      
      return { success: true }
    } catch (error) {
      console.error('Error recording logout:', error)
      return { success: false, error: error.message }
    }
  }

  // Log user activity
  async logUserActivity(userId, activityType, details = {}) {
    try {
      await addDoc(collection(db, this.userActivitiesCollection), {
        userId: userId,
        activityType: activityType,
        details: details,
        timestamp: serverTimestamp(),
        performedBy: auth.currentUser?.uid || userId
      })
    } catch (error) {
      console.error('Error logging user activity:', error)
      // Don't throw error as this is non-critical
    }
  }

  // Cleanup user sessions on deletion
  async cleanupUserSessions(userId) {
    try {
      const sessionQuery = query(
        collection(db, this.userSessionsCollection),
        where('userId', '==', userId)
      )
      
      const querySnapshot = await getDocs(sessionQuery)
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
      
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Error cleaning up user sessions:', error)
    }
  }

  // Cleanup user activities on deletion
  async cleanupUserActivities(userId) {
    try {
      const activityQuery = query(
        collection(db, this.userActivitiesCollection),
        where('userId', '==', userId)
      )
      
      const querySnapshot = await getDocs(activityQuery)
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
      
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Error cleaning up user activities:', error)
    }
  }

  // Get user statistics
  async getUserStatistics() {
    try {
      const users = await this.getAllUsers()
      
      if (!users.success) {
        return users
      }
      
      const stats = {
        total: users.users.length,
        active: users.users.filter(u => u.status === 'active').length,
        inactive: users.users.filter(u => u.status === 'inactive').length,
        suspended: users.users.filter(u => u.status === 'suspended').length,
        online: users.users.filter(u => u.isOnline).length,
        roles: {
          admin: users.users.filter(u => u.role === 'admin').length,
          manager: users.users.filter(u => u.role === 'manager').length,
          user: users.users.filter(u => u.role === 'user').length,
          viewer: users.users.filter(u => u.role === 'viewer').length
        }
      }
      
      return { success: true, stats }
    } catch (error) {
      console.error('Error getting user statistics:', error)
      return { success: false, error: error.message }
    }
  }

  // Export users data
  async exportUsers(format = 'json') {
    try {
      const result = await this.getAllUsers()
      
      if (!result.success) {
        return result
      }
      
      const exportData = result.users.map(user => ({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        orgUnit: user.orgUnit,
        status: user.status,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount
      }))
      
      if (format === 'csv') {
        const csvContent = this.convertToCSV(exportData)
        return { success: true, data: csvContent, format: 'csv' }
      }
      
      return { success: true, data: exportData, format: 'json' }
    } catch (error) {
      console.error('Error exporting users:', error)
      return { success: false, error: error.message }
    }
  }

  // Convert data to CSV format
  convertToCSV(data) {
    if (!data.length) return ''
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(','))
    ].join('\n')
    
    return csvContent
  }

  // Convert Firebase error codes to user-friendly messages
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email address is already registered'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long'
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later'
      case 'auth/operation-not-allowed':
        return 'Operation not allowed. Please contact administrator'
      case 'auth/user-disabled':
        return 'User account has been disabled'
      case 'auth/user-not-found':
        return 'User not found'
      case 'auth/wrong-password':
        return 'Invalid password'
      case 'permission-denied':
        return 'Permission denied. You do not have access to this resource'
      case 'unavailable':
        return 'Service temporarily unavailable. Please try again later'
      default:
        return 'An unexpected error occurred. Please try again'
    }
  }
}

export default new UserService()