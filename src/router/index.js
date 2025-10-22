import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase/config.js";
import AuthService from "../services/auth.js";
import AdminLogin from "../components/AdminLogin.vue";
import AdminSetup from "../components/AdminSetup.vue";
import Dashboard from "../components/Dashboard.vue";
import Capture from "../components/Capture.vue";
import TrackerCapture from "../components/TrackerCapture.vue";
import UserManagement from "../components/UserManagement.vue";
import EventReports from "../components/EventReports.vue";
// Add the new import for OutreachModule
import OutreachModule from "../components/OutreachModule.vue";

const routes = [
  {
    path: "/",
    redirect: "/setup",
  },
  {
    path: "/setup",
    name: "Setup",
    component: AdminSetup,
    meta: { requiresSetup: true },
  },
  {
    path: "/login",
    name: "Login",
    component: AdminLogin,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/capture",
    name: "Capture",
    component: Capture,
    meta: { requiresAuth: true },
  },
  {
    path: "/tracker-capture",
    name: "TrackerCapture",
    component: TrackerCapture,
    meta: { requiresAuth: true },
  },
  {
    path: "/user-management",
    name: "UserManagement",
    component: UserManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/event-reports",
    name: "EventReports",
    component: EventReports,
    meta: { requiresAuth: true },
  },
  // Add the new route for OutreachModule
  {
    path: "/outreach",
    name: "OutreachModule",
    component: OutreachModule,
    meta: { requiresAuth: true },
  },
  {
    // Catch-all route - redirect to setup
    path: "/:pathMatch(.*)*",
    redirect: "/setup",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Wait for Firebase Auth to initialize
let isAuthInitialized = false;
let authInitPromise = null;

const waitForAuthInit = () => {
  if (isAuthInitialized) {
    return Promise.resolve();
  }

  if (!authInitPromise) {
    authInitPromise = new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        isAuthInitialized = true;
        unsubscribe();
        resolve();
      });
    });
  }

  return authInitPromise;
};

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Wait for Firebase auth to initialize
  await waitForAuthInit();

  const currentUser = auth.currentUser;
  let isAuthenticated = false;

  // Check if user is authenticated (all roles allowed)
  if (currentUser) {
    const userDoc = await AuthService.getUserRole(currentUser.uid);
    // Allow any user with valid user data and active status
    if (userDoc && (!userDoc.status || userDoc.status === "active")) {
      isAuthenticated = true;
      // Update AuthService state
      AuthService.user = currentUser;
      AuthService.userRole = userDoc.role;
      AuthService.userPermissions = userDoc.permissions || [];
      AuthService.isAuthenticated = true;
    }
  }

  // Check if admin exists for setup flow
  const adminExists = await AuthService.checkAdminExists();

  if (!adminExists && to.path !== "/setup") {
    // No admin exists and not on setup page - redirect to setup
    next("/setup");
  } else if (adminExists && to.path === "/setup") {
    // Admin exists but trying to access setup - redirect to login
    next("/login");
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // Route requires authentication but user is not authenticated
    next("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Route is for guests only but user is authenticated
    next("/dashboard");
  } else {
    // Allow navigation
    next();
  }
});

export default router;
