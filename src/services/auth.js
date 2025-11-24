// AuthService.js
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
  limit,
} from "firebase/firestore";
import { auth } from "../firebase/config.js";
import app from "../firebase/config.js";
import UserService from "./userService.js";

class AuthService {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.db = getFirestore(app);

    // Simplified to only admin or normal user
    this.userRole = null;

    // Option A flag
    this.ADMIN_FLAG_KEY = "tkp_admin_created";

    // Load offline user
    this.loadOfflineUserData();
  }

  // -------------------------
  // Offline caching
  // -------------------------
  loadOfflineUserData() {
    try {
      const savedUserData = localStorage.getItem("tkp_user_data");
      const savedAuthState = localStorage.getItem("tkp_auth_state");

      if (savedUserData && savedAuthState === "authenticated") {
        const userData = JSON.parse(savedUserData);
        this.user = userData.user;
        this.userRole = userData.role || "user";
        this.isAuthenticated = true;
        console.log("Loaded offline user data");
      }
    } catch (error) {
      console.error("Error loading offline data:", error);
    }
  }

  saveOfflineUserData() {
    try {
      if (this.user && this.isAuthenticated) {
        const userData = {
          user: this.user,
          role: this.userRole,
        };
        localStorage.setItem("tkp_user_data", JSON.stringify(userData));
        localStorage.setItem("tkp_auth_state", "authenticated");
      } else {
        localStorage.removeItem("tkp_user_data");
        localStorage.removeItem("tkp_auth_state");
      }
    } catch (error) {
      console.error("Error saving offline data:", error);
    }
  }

  // -------------------------
  // Admin detection
  // -------------------------
  async checkAdminExists() {
    try {
      // First check localStorage flag
      const flag = localStorage.getItem(this.ADMIN_FLAG_KEY);
      if (flag === "true") return true;

      // Check if we have a cached admin check result
      const cachedAdminCheck = localStorage.getItem('cached_admin_check');
      const lastCheckTime = localStorage.getItem('last_admin_check_time');

      // If we have a recent cached result (within 1 hour), use it
      if (cachedAdminCheck && lastCheckTime) {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        if (parseInt(lastCheckTime) > oneHourAgo) {
          return cachedAdminCheck === 'true';
        }
      }

      try {
        // If no flag, check Firestore for admin users
        const usersRef = collection(this.db, 'users');
        const q = query(usersRef, where('role', '==', 'admin'), limit(1));
        const querySnapshot = await getDocs(q);

        // If admin found in Firestore, update the flag
        if (!querySnapshot.empty) {
          localStorage.setItem(this.ADMIN_FLAG_KEY, "true");
          localStorage.setItem('cached_admin_check', 'true');
          localStorage.setItem('last_admin_check_time', Date.now().toString());
          return true;
        }

        // Cache the negative result
        localStorage.setItem('cached_admin_check', 'false');
        localStorage.setItem('last_admin_check_time', Date.now().toString());
        return false;
      } catch (firestoreError) {
        console.warn('Firestore error when checking admin, using cached value if available:', firestoreError);
        // If we have a cached value, use it
        if (cachedAdminCheck) {
          return cachedAdminCheck === 'true';
        }
        // Default to true to prevent lockout if we can't check
        return true;
      }
    } catch (error) {
      console.error('Error in checkAdminExists:', error);
      // Default to true to prevent lockout if there's an error
      return true;
    }
  }

  // -------------------------
  // Create First Admin
  // -------------------------
  async createFirstAdmin(email, password, fullName, phoneNumber) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      try {
        await setDoc(doc(this.db, "users", user.uid), {
          email,
          fullName,
          phoneNumber,
          role: "admin",
          createdAt: new Date(),
          isFirstAdmin: true,
          uid: user.uid,
        });
      } catch (e) {
        console.error("Firestore write failed:", e);
      }

      // Mark admin as created
      localStorage.setItem(this.ADMIN_FLAG_KEY, "true");

      this.user = user;
      this.userRole = "admin";
      this.isAuthenticated = true;

      this.saveOfflineUserData();

      return { success: true, user };
    } catch (error) {
      console.error("Error creating admin:", error);

      if (error.code === "auth/email-already-in-use") {
        localStorage.setItem(this.ADMIN_FLAG_KEY, "true");
        return {
          success: false,
          error: "Admin already created.",
          adminExists: true,
        };
      }

      return {
        success: false,
        error: this.getErrorMessage(error.code) || error.message,
      };
    }
  }

  // -------------------------
  // Login (simplified)
  // -------------------------
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      this.user = userCredential.user;

      // Get user role (if exists)
      const userDoc = await this.getUserRole(this.user.uid);

      // If not found → assign default "user"
      this.userRole = userDoc?.role || "user";

      // If they are admin in Firestore, enforce admin flag.
      if (this.userRole === "admin") {
        try {
          localStorage.setItem(this.ADMIN_FLAG_KEY, "true");
        } catch { }
      }

      this.isAuthenticated = true;
      this.saveOfflineUserData();

      return {
        success: true,
        user: this.user,
        role: this.userRole,
      };
    } catch (error) {
      console.error("Login error:", error);

      // Offline fallback
      if (!navigator.onLine) {
        this.loadOfflineUserData();
        if (this.isAuthenticated) {
          return {
            success: true,
            user: this.user,
            role: this.userRole,
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

  async logout() {
    try {
      await signOut(auth);

      this.user = null;
      this.isAuthenticated = false;
      this.userRole = null;

      this.saveOfflineUserData();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // -------------------------
  // Firestore user lookup
  // -------------------------
  async getUserRole(uid) {
    try {
      const ref = doc(this.db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) return snap.data();

      return null;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  }

  // -------------------------
  // Auth state
  // -------------------------
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await this.getUserRole(user.uid);
        this.user = user;
        this.userRole = userDoc?.role || "user";
        this.isAuthenticated = true;

        // If admin → set flag
        if (this.userRole === "admin") {
          try {
            localStorage.setItem(this.ADMIN_FLAG_KEY, "true");
          } catch { }
        }

        this.saveOfflineUserData();
      } else {
        this.user = null;
        this.isAuthenticated = false;
        this.userRole = null;
        this.saveOfflineUserData();
      }

      callback(this.user, this.isAuthenticated);
    });
  }

  // -------------------------
  // Helpers
  // -------------------------
  getCurrentUser() {
    return this.user;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  getUserRoleInfo() {
    return this.userRole;
  }

  hasPermission(permission) {
    if (this.userRole === 'admin') return true;
    return this.userPermissions && this.userPermissions.includes(permission);
  }

  getErrorMessage(errorCode) {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-email":
        return "Invalid email";
      default:
        return "Login failed";
    }
  }
}

export default new AuthService();
