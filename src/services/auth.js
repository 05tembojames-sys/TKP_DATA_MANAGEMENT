import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { auth } from '../firebase/config.js'
import app from '../firebase/config.js'
import UserService from './userService.js'

class AuthService {
  constructor() {
    this.user = null
    this.isAuthenticated = false
    this.db = getFirestore(app)
  }

  // Check if any admin exists in the system
  async checkAdminExists() {
    try {
      const adminQuery = query(
        collection(this.db, 'users'), 
        where('role', '==', 'admin')
      )
      const querySnapshot = await getDocs(adminQuery)
      return !querySnapshot.empty
    } catch (error) {
      console.error('Error checking admin existence:', error)
      // If Firestore is not set up, assume no admin exists
      return false
    }
  }

  // Create the first admin user
  async createFirstAdmin(email, password, fullName, phoneNumber) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Store admin data in Firestore
      await setDoc(doc(this.db, 'users', user.uid), {
        email: email,
        fullName: fullName,
        phoneNumber: phoneNumber,
        role: 'admin',
        createdAt: new Date(),
        isFirstAdmin: true
      })

      this.user = user
      this.isAuthenticated = true
      
      return { success: true, user: user }
    } catch (error) {
      console.error('Error creating first admin:', error)
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) || error.message
      }
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      this.user = userCredential.user
      
      // Check for admin role in Firestore
      const userDoc = await this.getUserRole(this.user.uid)
      
      if (!userDoc || userDoc.role !== 'admin') {
        await this.logout()
        throw new Error('Access denied: Admin privileges required')
      }
      
      // Find user document ID for activity tracking
      const usersQuery = query(
        collection(this.db, 'users'),
        where('uid', '==', this.user.uid)
      )
      const usersSnapshot = await getDocs(usersQuery)
      
      if (!usersSnapshot.empty) {
        const userDocId = usersSnapshot.docs[0].id
        // Record login activity
        await UserService.recordUserLogin(userDocId)
      }
      
      this.isAuthenticated = true
      return { success: true, user: this.user }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) || error.message
      }
    }
  }

  // Logout
  async logout() {
    try {
      // Record logout activity if user is authenticated
      if (this.user && this.isAuthenticated) {
        try {
          // Find user document ID for activity tracking
          const usersQuery = query(
            collection(this.db, 'users'),
            where('uid', '==', this.user.uid)
          )
          const usersSnapshot = await getDocs(usersQuery)
          
          if (!usersSnapshot.empty) {
            const userDocId = usersSnapshot.docs[0].id
            // Record logout activity
            await UserService.recordUserLogout(userDocId)
          }
        } catch (activityError) {
          console.error('Error recording logout activity:', activityError)
          // Don't fail logout if activity recording fails
        }
      }
      
      await signOut(auth)
      this.user = null
      this.isAuthenticated = false
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get user role from Firestore
  async getUserRole(uid) {
    try {
      const userDocRef = doc(this.db, 'users', uid)
      const userDocSnap = await getDoc(userDocRef)
      
      if (userDocSnap.exists()) {
        return userDocSnap.data()
      }
      return null
    } catch (error) {
      console.error('Error getting user role:', error)
      return null
    }
  }

  // Check authentication state
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check admin role in Firestore
        const userDoc = await this.getUserRole(user.uid)
        
        if (userDoc && userDoc.role === 'admin') {
          this.user = user
          this.isAuthenticated = true
        } else {
          await this.logout()
        }
      } else {
        this.user = null
        this.isAuthenticated = false
      }
      callback(this.user, this.isAuthenticated)
    })
  }

  // Get current user
  getCurrentUser() {
    return this.user
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated
  }

  // Convert Firebase error codes to user-friendly messages
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/user-disabled':
        return 'This account has been disabled'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection'
      default:
        return 'Login failed. Please try again'
    }
  }
}

export default new AuthService()