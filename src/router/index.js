import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase/config.js";
import AuthService from "../services/auth.js";
import AdminLogin from "../components/AdminLogin.vue";
import AdminSetup from "../components/AdminSetup.vue";
import Dashboard from "../components/Dashboard.vue";
import Capture from "../components/Capture.vue";
import CaptureDHIS2 from "../components/Capture_DHIS2.vue";
import TKPDocuments from "../components/TKPDocuments.vue";
import TrackerCapture from "../components/TrackerCapture.vue";
import UserManagement from "../components/UserManagement.vue";
import EventReports from "../components/EventReports.vue";
// Add the new import for OutreachModule
import OutreachModule from "../components/OutreachModule.vue";
import SystemManagement from "../components/SystemManagement.vue";
import DataAnalytics from "../views/DataAnalytics.vue";
// New component imports
import Maps from "../components/Maps.vue";
import ImportExport from "../components/ImportExport.vue";
import DataQuality from "../components/DataQuality.vue";
import DataVisualizer from "../components/DataVisualizer.vue";
import PivotTables from "../components/PivotTables.vue";
import Approval from "../components/Approval.vue";
import Messaging from "../components/Messaging.vue";
import Maintenance from "../components/Maintenance.vue";
import SuccessStories from "../components/SuccessStories.vue";
import Notifications from "../components/Notifications.vue";


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
    component: CaptureDHIS2,
    meta: { requiresAuth: true },
  },
  {
    path: "/capture-old",
    name: "CaptureOld",
    component: Capture,
    meta: { requiresAuth: true },
  },
  {
    path: "/capture-dhis2",
    name: "CaptureDHIS2",
    component: CaptureDHIS2,
    meta: { requiresAuth: true },
  },
  {
    path: "/tkp-documents",
    name: "TKPDocuments",
    component: TKPDocuments,
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
    path: "/system-management",
    name: "SystemManagement",
    component: SystemManagement,
    meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: "/data-analytics",
    name: "DataAnalytics",
    component: DataAnalytics,
    meta: { requiresAuth: true },
  },
  {
    path: "/maps",
    name: "Maps",
    component: Maps,
    meta: { requiresAuth: true },
  },
  {
    path: "/import-export",
    name: "ImportExport",
    component: ImportExport,
    meta: { requiresAuth: true },
  },
  {
    path: "/data-quality",
    name: "DataQuality",
    component: DataQuality,
    meta: { requiresAuth: true },
  },
  {
    path: "/data-visualizer",
    name: "DataVisualizer",
    component: DataVisualizer,
    meta: { requiresAuth: true },
  },
  {
    path: "/pivot-tables",
    name: "PivotTables",
    component: PivotTables,
    meta: { requiresAuth: true },
  },
  {
    path: "/approval",
    name: "Approval",
    component: Approval,
    meta: { requiresAuth: true },
  },
  {
    path: "/messaging",
    name: "Messaging",
    component: Messaging,
    meta: { requiresAuth: true },
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    component: Maintenance,
    meta: { requiresAuth: true },
  },
  {
    path: "/success-stories",
    name: "SuccessStories",
    component: SuccessStories,
    meta: { requiresAuth: true },
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
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

    // Check if user is explicitly inactive
    const isInactive = userDoc && userDoc.status && userDoc.status !== "active";

    if (!isInactive) {
      isAuthenticated = true;
      // Update AuthService state
      AuthService.user = currentUser;
      AuthService.userRole = userDoc?.role || "user";
      AuthService.userPermissions = userDoc?.permissions || [];
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
