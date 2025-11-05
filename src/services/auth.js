import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "../firebase/config.js";
import app from "../firebase/config.js";
import UserService from "./userService.js";

class AuthService {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.db = getFirestore(app);
    this.userRole = null;
    this.userPermissions = [];
    this.permissionStructure = {
      users: ["users_read", "users_write"],
      forms: ["forms_read", "forms_write"],
      reports: ["reports_read", "reports_write"],
      analytics: ["analytics_read"],
      system: ["system_admin"],
    };
    // Load user data from localStorage if available (for offline access)
    this.loadOfflineUserData();
  }

  // Load user data from localStorage for offline access
  loadOfflineUserData() {
    try {
      const savedUserData = localStorage.getItem("tkp_user_data");
      const savedAuthState = localStorage.getItem("tkp_auth_state");

      if (savedUserData && savedAuthState === "authenticated") {
        const userData = JSON.parse(savedUserData);
        this.user = userData.user;
        this.userRole = userData.role;
        this.userPermissions = userData.permissions || [];
        this.isAuthenticated = true;
        console.log("Loaded user data from localStorage for offline access");
      }
    } catch (error) {
      console.error("Error loading offline user data:", error);
    }
  }

  // Save user data to localStorage for offline access
  saveOfflineUserData() {
    try {
      if (this.user && this.isAuthenticated) {
        const userData = {
          user: this.user,
          role: this.userRole,
          permissions: this.userPermissions,
        };
        localStorage.setItem("tkp_user_data", JSON.stringify(userData));
        localStorage.setItem("tkp_auth_state", "authenticated");
      } else {
        // Clear offline data when user logs out
        localStorage.removeItem("tkp_user_data");
        localStorage.removeItem("tkp_auth_state");
      }
    } catch (error) {
      console.error("Error saving offline user data:", error);
    }
  }

  // Check if any admin exists in the system
  async checkAdminExists() {
    try {
      const adminQuery = query(
        collection(this.db, "users"),
        where("role", "==", "admin")
      );
      const querySnapshot = await getDocs(adminQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking admin existence:", error);
      // If Firestore is not set up, assume no admin exists
      return false;
    }
  }

  // Create the first admin user
  async createFirstAdmin(email, password, fullName, phoneNumber) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store admin data in Firestore
      await setDoc(doc(this.db, "users", user.uid), {
        email: email,
        fullName: fullName,
        phoneNumber: phoneNumber,
        role: "admin",
        createdAt: new Date(),
        isFirstAdmin: true,
      });

      this.user = user;
      this.isAuthenticated = true;

      // Save user data for offline access
      this.saveOfflineUserData();

      return { success: true, user: user };
    } catch (error) {
      console.error("Error creating first admin:", error);
      return {
        success: false,
        error: this.getErrorMessage(error.code) || error.message,
      };
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      this.user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await this.getUserRole(this.user.uid);

      // Check if user exists and is active
      if (!userDoc) {
        await this.logout();
        throw new Error("User data not found. Please contact administrator.");
      }

      // Check if user status is active
      if (userDoc.status && userDoc.status !== "active") {
        await this.logout();
        throw new Error(
          `Account is ${userDoc.status}. Please contact administrator.`
        );
      }

      // Store user role and permissions
      this.userRole = userDoc.role;
      this.userPermissions = this.validatePermissions(
        userDoc.role,
        userDoc.permissions || []
      );

      // Add user's name to the user object for display
      if (userDoc.fullName) {
        this.user.displayName = userDoc.fullName;
        this.user.name = userDoc.fullName;
      } else if (userDoc.name) {
        this.user.displayName = userDoc.name;
        this.user.name = userDoc.name;
      } else if (userDoc.firstName && userDoc.lastName) {
        this.user.displayName = `${userDoc.firstName} ${userDoc.lastName}`;
        this.user.name = `${userDoc.firstName} ${userDoc.lastName}`;
      }

      // Find user document ID for activity tracking
      const usersQuery = query(
        collection(this.db, "users"),
        where("uid", "==", this.user.uid)
      );
      const usersSnapshot = await getDocs(usersQuery);

      if (!usersSnapshot.empty) {
        const userDocId = usersSnapshot.docs[0].id;
        // Record login activity
        await UserService.recordUserLogin(userDocId);
      }

      this.isAuthenticated = true;

      // Save user data for offline access
      this.saveOfflineUserData();

      return {
        success: true,
        user: this.user,
        role: this.userRole,
        permissions: this.userPermissions,
      };
    } catch (error) {
      console.error("Login error:", error);
      // Check if we have offline user data we can use
      if (!navigator.onLine) {
        // Try to load offline user data
        this.loadOfflineUserData();
        if (this.isAuthenticated) {
          return {
            success: true,
            user: this.user,
            role: this.userRole,
            permissions: this.userPermissions,
            offline: true,
          };
        }
      }
      return {
        success: false,
        error: this.getErrorMessage(error.code) || error.message,
      };
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
            collection(this.db, "users"),
            where("uid", "==", this.user.uid)
          );
          const usersSnapshot = await getDocs(usersQuery);

          if (!usersSnapshot.empty) {
            const userDocId = usersSnapshot.docs[0].id;
            // Record logout activity
            await UserService.recordUserLogout(userDocId);
          }
        } catch (activityError) {
          console.error("Error recording logout activity:", activityError);
          // Don't fail logout if activity recording fails
        }
      }

      await signOut(auth);
      this.user = null;
      this.isAuthenticated = false;
      this.userRole = null;
      this.userPermissions = [];

      // Clear offline user data
      this.saveOfflineUserData();

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  }

  // Get user role from Firestore
  async getUserRole(uid) {
    try {
      // First, try to find user by UID as document ID (for first admin)
      const userDocRef = doc(this.db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data();
      }

      // If not found, search for user by uid field (for regular users)
      const usersQuery = query(
        collection(this.db, "users"),
        where("uid", "==", uid)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }

      // If still not found, search by email (for legacy users)
      const user = auth.currentUser || this.user;
      if (user && user.email) {
        const emailQuery = query(
          collection(this.db, "users"),
          where("email", "==", user.email.toLowerCase())
        );
        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
          return emailSnapshot.docs[0].data();
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  }

  // Check authentication state
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await this.getUserRole(user.uid);

        // Allow any valid user with active status
        if (userDoc && (!userDoc.status || userDoc.status === "active")) {
          this.user = user;
          this.userRole = userDoc.role;
          this.userPermissions = userDoc.permissions || [];
          this.isAuthenticated = true;

          // Add user's name to the user object for display
          if (userDoc.fullName) {
            this.user.displayName = userDoc.fullName;
            this.user.name = userDoc.fullName;
          } else if (userDoc.name) {
            this.user.displayName = userDoc.name;
            this.user.name = userDoc.name;
          } else if (userDoc.firstName && userDoc.lastName) {
            this.user.displayName = `${userDoc.firstName} ${userDoc.lastName}`;
            this.user.name = `${userDoc.firstName} ${userDoc.lastName}`;
          }

          // Save user data for offline access
          this.saveOfflineUserData();
        } else {
          await this.logout();
        }
      } else {
        this.user = null;
        this.userRole = null;
        this.userPermissions = [];
        this.isAuthenticated = false;

        // Clear offline user data
        this.saveOfflineUserData();
      }
      callback(this.user, this.isAuthenticated);
    });
  }

  // Get current user role
  getUserRoleInfo() {
    return this.userRole;
  }

  // Get user permissions
  getUserPermissions() {
    return this.userPermissions || [];
  }

  // Check if user has specific permission
  hasPermission(permission) {
    if (this.userRole === "admin") return true; // Admin has all permissions
    return this.userPermissions.includes(permission);
  }

  // Check if user has any permission in a category
  hasCategoryPermission(category) {
    if (this.userRole === "admin") return true; // Admin has all permissions

    if (this.permissionStructure[category]) {
      return this.permissionStructure[category].some((permission) =>
        this.userPermissions.includes(permission)
      );
    }

    return false;
  }

  // Get all user permissions
  getAllPermissions() {
    if (this.userRole === "admin") {
      // Admins have all permissions
      return [
        "users_read",
        "users_write",
        "forms_read",
        "forms_write",
        "reports_read",
        "reports_write",
        "analytics_read",
        "system_admin",
      ];
    }

    return this.userPermissions;
  }

  // Validate permissions based on role hierarchy
  validatePermissions(role, permissions) {
    // Admins get all permissions automatically
    if (role === "admin") {
      return [
        "users_read",
        "users_write",
        "forms_read",
        "forms_write",
        "reports_read",
        "reports_write",
        "analytics_read",
        "system_admin",
      ];
    }

    // For other roles, validate that permissions are valid
    const validPermissions = [];
    const allValidPermissions = Object.values(this.permissionStructure).flat();

    if (Array.isArray(permissions)) {
      permissions.forEach((permission) => {
        if (allValidPermissions.includes(permission)) {
          validPermissions.push(permission);
        }
      });
    }

    // Remove duplicates
    return [...new Set(validPermissions)];
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  // Convert Firebase error codes to user-friendly messages
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      default:
        return "Login failed. Please try again";
    }
  }
}

export default new AuthService();
