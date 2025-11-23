
<template>
    <!-- DHIS2 Top Header -->
    <TopHeader />

    <!-- Dashboard Toolbar -->
    <div class="dhis-toolbar-container" v-if="currentView === 'main'">
       <div class="toolbar-left">
          <button class="dashboards-btn"><i class="fas fa-bars"></i> Dashboards</button>
          <div class="dashboard-title">
             <span>Main Dashboard</span>
             <i class="fas fa-star favorite-icon"></i>
          </div>
       </div>
       <div class="toolbar-right">
          <button class="tool-btn">Edit</button>
          <button class="tool-btn">Share</button>
          <button class="tool-btn">Slideshow</button>
          <button class="tool-btn filter-btn"><i class="fas fa-filter"></i> Filter</button>
       </div>
    </div>

    <div class="dashboard-content">
      <!-- Offline Banner -->
      <div v-if="!isOnline" class="offline-banner">
        <div class="banner-content">
          <i class="fas fa-cloud-offline"></i>
          <span>Working in offline mode. Data will sync when connection is restored.</span>
        </div>
      </div>
      <div v-if="currentView === 'main'" class="dhis-dashboard-grid">
          
          <!-- Welcome/Info Widget (Text) -->
          <div class="dhis-widget text-widget double-height">
             <div class="widget-header">
                <div class="widget-title">Welcome, {{ getFirstName() }}</div>
                <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
             </div>
             <div class="widget-content welcome-content">
                <h3>{{ getGreeting() }}!</h3>
                <p>{{ getWelcomeMessage() }}</p>
                <div class="user-stats">
                   <div class="stat"><strong>{{ totalChildren }}</strong> Children Tracked</div>
                   <div class="stat"><strong>{{ totalReports }}</strong> Reports</div>
                </div>
             </div>
          </div>

          <!-- Tracker Capture Widget -->
          <div class="dhis-widget chart-widget" @click="setCurrentView('tracker-capture')">
             <div class="widget-header">
                <div class="widget-title">Tracker Capture</div>
                <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
             </div>
             <div class="widget-content center-content">
                 <div class="big-icon"><i class="fa-solid fa-search"></i></div>
                 <div class="widget-label">Search & Track</div>
             </div>
          </div>

           <!-- Data Entry Widget (Chart) -->
          <div class="dhis-widget chart-widget" @click="setCurrentView('data-entry')">
             <div class="widget-header">
                <div class="widget-title">Data Entry Progress</div>
                <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
             </div>
             <div class="widget-content">
                 <canvas ref="formsMiniChart"></canvas>
             </div>
          </div>

          <!-- Reports Widget (Chart) -->
          <div class="dhis-widget chart-widget" @click="setCurrentView('reports')">
             <div class="widget-header">
                <div class="widget-title">Reports Generated</div>
                <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
             </div>
             <div class="widget-content">
                 <canvas ref="reportsMiniChart"></canvas>
             </div>
          </div>

          <!-- Events Widget (Chart) -->
          <div class="dhis-widget chart-widget" @click="setCurrentView('event-reports')">
             <div class="widget-header">
                <div class="widget-title">Event Status</div>
                <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
             </div>
             <div class="widget-content">
                 <canvas ref="eventsMiniChart"></canvas>
             </div>
          </div>

           <!-- Analytics Widget (Chart) -->
          <div class="dhis-widget chart-widget" @click="setCurrentView('visualization')">
             <div class="widget-header">
                <div class="widget-title">Demographics</div>
                <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
             </div>
             <div class="widget-content">
                 <canvas ref="analyticsMiniChart"></canvas>
             </div>
          </div>

           <!-- Outreach Widget -->
          <div class="dhis-widget chart-widget" @click="setCurrentView('outreach')">
             <div class="widget-header">
                <div class="widget-title">Outreach</div>
                <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
             </div>
             <div class="widget-content center-content">
                 <div class="big-icon"><i class="fa-solid fa-route"></i></div>
                 <div class="widget-label">Offline Sync</div>
             </div>
          </div>
          
          <!-- User Management Widget -->
          <div class="dhis-widget chart-widget" :class="{ disabled: !canManageUsers }" @click="canManageUsers ? $router.push('/user-management') : null">
             <div class="widget-header">
                <div class="widget-title">User Management</div>
                <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
             </div>
             <div class="widget-content center-content">
                 <div class="big-icon"><i class="fa-solid fa-users-cog"></i></div>
                 <div class="widget-label">{{ users.length }} Users</div>
             </div>
          </div>

          <!-- System Management Widget -->
          <div v-if="isSuperAdmin" class="dhis-widget chart-widget" @click="$router.push('/system-management')">
            <div class="widget-header">
              <div class="widget-title">System Management</div>
              <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
            </div>
            <div class="widget-content center-content">
                <div class="big-icon"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                <div class="widget-label">Admin Tools</div>
            </div>
          </div>

          <!-- Data Analytics Widget -->
          <div class="dhis-widget chart-widget" @click="$router.push('/data-analytics')">
            <div class="widget-header">
              <div class="widget-title">Data Analytics</div>
              <div class="widget-controls"><i class="fas fa-ellipsis-h"></i></div>
            </div>
            <div class="widget-content center-content">
                <div class="big-icon"><i class="fa-solid fa-chart-simple"></i></div>
                <div class="widget-label">Advanced Analytics</div>
            </div>
          </div>

      </div>

      <!-- User Management Section -->
      <div v-if="currentView === 'manage-users'" class="user-management">
        <div class="section-header">
          <h2>Manage Users</h2>
          <div class="header-actions">
            <button class="dashboard-btn" @click="showAddUserForm = true">
              Add New User
            </button>
            <button class="back-btn" @click="setCurrentView('main')">
              Back to Dashboard
            </button>
          </div>
        </div>

        <!-- Add User Form -->
        <div v-if="showAddUserForm" class="user-form">
          <h3>Add New User</h3>
          <form @submit.prevent="handleAddUser">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input v-model="newUser.fullName" type="text" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="newUser.email" type="email" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Password</label>
                <input
                  v-model="newUser.password"
                  type="password"
                  required
                  minlength="6"
                />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input v-model="newUser.phoneNumber" type="tel" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Role</label>
                <select v-model="newUser.role" required>
                  <option value="admin">Administrator</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
                <small
                  style="
                    color: #28a745;
                    font-size: 0.85rem;
                    margin-top: 0.25rem;
                    display: block;
                  "
                >
                  ✓ All roles can log in. Permissions are based on role
                  selection.
                </small>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="dashboard-btn" :disabled="loading">
                {{ loading ? "Creating..." : "Create User" }}
              </button>
              <button type="button" class="cancel-btn" @click="cancelAddUser">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Edit User Form -->
        <div v-if="showEditUserForm" class="user-form">
          <h3>Edit User</h3>
          <form @submit.prevent="handleUpdateUser">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input v-model="editUser.fullName" type="text" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="editUser.email" type="email" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Phone Number</label>
                <input v-model="editUser.phoneNumber" type="tel" required />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="dashboard-btn" :disabled="loading">
                {{ loading ? "Updating..." : "Update User" }}
              </button>
              <button type="button" class="cancel-btn" @click="cancelEditUser">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Users Table -->
        <div class="users-table">
          <div v-if="loadingUsers" class="loading">Loading users...</div>
          <div v-else-if="users.length === 0" class="no-users">
            No users found. Add your first user above.
          </div>
          <table v-else>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.fullName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phoneNumber }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td class="actions">
                  <button class="edit-btn" @click="startEditUser(user)">
                    Edit
                  </button>
                  <button class="delete-btn" @click="confirmDeleteUser(user)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Data Entry Forms Section -->
      <div v-if="currentView === 'data-entry'" class="forms-section" style="padding: 0; height: calc(100vh - 48px);">
        <AggregateDataEntry />
      </div>

      <!-- Child Tracker Section -->
      <div
        v-if="
          currentView === 'child-tracker' || currentView === 'child-tracker-2'
        "
        class="child-tracker-section"
      >
        <ChildTracker
          :show-only-complete="currentView === 'child-tracker-2'"
          @back-to-dashboard="setCurrentView('main')"
          @navigate-to-medical-intake="handleNavigateToMedicalIntake"
          @toggle-in-housed="toggleInHousedMode"
        />
      </div>

      <!-- Data Visualization Section -->
      <div v-if="currentView === 'visualization'" class="visualization-section">
        <DataVisualization @back-to-dashboard="setCurrentView('main')" />
      </div>

      <!-- Data Analysis Section -->
      <div v-if="currentView === 'data-analysis'" class="data-analysis-section">
        <DataAnalysis @back-to-dashboard="setCurrentView('main')" />
      </div>

      <!-- Reports Section -->
      <div v-if="currentView === 'reports'" class="reports-section">
        <Reports
          :can-approve="canApproveReports"
          @back-to-dashboard="setCurrentView('main')"
        />
      </div>

      <!-- Event Reports Section -->
      <div v-if="currentView === 'event-reports'" class="event-reports-section">
        <EventReports />
        <div class="section-actions">
          <button class="back-btn" @click="setCurrentView('main')">
            Back to Dashboard
          </button>
        </div>
      </div>

      <!-- New section for the outreach module -->
      <div v-if="currentView === 'outreach'" class="outreach-section">
        <OutreachModule @back-to-dashboard="setCurrentView('main')" />
      </div>

      <!-- Other Sections Placeholder -->
      <div
        v-if="
          ![
            'main',
            'manage-users',
            'data-entry',
            'child-tracker',
            'child-tracker-2',
            'visualization',
            'data-analysis',
            'reports',
            'event-reports',
          ].includes(currentView)
        "
        class="section-placeholder"
      >
        <h2>{{ getSectionTitle(currentView) }}</h2>
        <p>This section is under development.</p>
        <button class="back-btn" @click="setCurrentView('main')">
          Back to Dashboard
        </button>
      </div>
    </div>
 
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "../composables/useToast.js";
import AuthService from "../services/auth.js";
import UserService from "../services/userService.js";
import KLogo from "./KLogo.vue";
import InitialReferralForm from "./InitialReferralForm.vue";
import ChildOverviewForm from "./ChildOverviewForm.vue";
import InitialAssessmentForm from "./InitialAssessmentForm.vue";
import MedicalIntakeForm from "./MedicalIntakeForm.vue";
import FormsList from "./FormsList.vue";
import ChildTracker from "./ChildTracker.vue";
import DataVisualization from "./DataVisualization.vue";
import DataAnalysis from "./DataAnalysis.vue";
import Reports from "./Reports.vue";
import EventReports from "./EventReports.vue";
import FormService from "../services/formService.js";
import OutreachModule from "./OutreachModule.vue";
import AggregateDataEntry from "./AggregateDataEntry.vue";
import Chart from "chart.js/auto";

// Import custom SVG icon (uncomment when you add the file)
// import DataEntryIcon from '../assets/icons/data-entry.svg?url'

const router = useRouter();
const route = useRoute();
const { success, error, confirm } = useToast();

// View management
const currentView = ref("main");

// User management
const users = ref([]);
const loadingUsers = ref(false);
  const loading = ref(false);
  const showAddUserForm = ref(false);
  const showEditUserForm = ref(false);
  const currentUserName = ref("");
  const isOnline = ref(navigator.onLine); // Track online status
  const selectedDashboard = ref("main");
  const searchQuery = ref("");
  const formsMiniChart = ref(null);
  const reportsMiniChart = ref(null);
  const eventsMiniChart = ref(null);
  const analyticsMiniChart = ref(null);

// Summary statistics
const totalReports = ref(0);
const totalChildren = ref(0);
const totalEvents = ref(0);
const totalDataEntries = ref(0);

// Forms management
const currentForm = ref("initial-referral-list");
const selectedFormType = ref("initial-referral");
const availableForms = ref([
  { id: "initial-referral-list", name: "Initial Child Referral Forms" },
  { id: "child-overview-list", name: "Child Overview Forms" },
  { id: "initial-assessment-list", name: "TKP Initial Assessment Forms" },
  { id: "medical-intake-list", name: "Medical Intake Assessment Forms" },
]);

// Form data
const newUser = ref({
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
});

// Edit form data
const getEditFormData = (formType) => {
  if (currentForm.value === formType + "-new") {
    const editData = sessionStorage.getItem('editFormData');
    if (editData) {
      try {
        return JSON.parse(editData);
      } catch (e) {
        console.error('Error parsing edit data:', e);
        return {};
      }
    }
  }
  return {};
};

const isEditMode = (formType) => {
  return currentForm.value === formType + "-new" && 
         sessionStorage.getItem('editFormData') !== null;
};

const editUser = ref({
  id: "",
  uid: "",
  fullName: "",
  email: "",
  phoneNumber: "",
});

// Permission checking computed properties
const canManageUsers = computed(() => {
  const role = AuthService.getUserRoleInfo();
  return (
    role === "admin" ||
    role === "manager" ||
    AuthService.hasPermission("users_write")
  );
});

const canApproveReports = computed(() => {
  const role = AuthService.getUserRoleInfo();
  return role === "admin" || role === "manager";
});

const isSuperAdmin = computed(() => {
  const currentUser = AuthService.getCurrentUser();
  return currentUser && currentUser.email === 'davidchileshe33@gmail.com';
});

// View management functions
const setCurrentView = async (view) => {
  // Handle navigation to capture page
  if (view === "capture") {
    router.push("/capture");
    return;
  }

  // Handle navigation to tracker capture page
  if (view === "tracker-capture") {
    router.push("/tracker-capture");
    return;
  }

  // Handle navigation to event reports page
  if (view === "event-reports") {
    router.push("/event-reports");
    return;
  }

  // Handle navigation to outreach module
  if (view === "outreach") {
    router.push("/outreach");
    return;
  }

  currentView.value = view;

  if (view === "manage-users") {
    await loadUsers();
  }
};

// Form management functions
const setCurrentForm = (formId) => {
  currentForm.value = formId;
  // Extract form type from the form ID for list views
  if (formId.endsWith("-list")) {
    selectedFormType.value = formId.replace("-list", "");
  } else if (formId.endsWith("-new")) {
    selectedFormType.value = formId.replace("-new", "");
  }
};

const handleFormSaved = (formData) => {
  success("Form saved successfully!");
  // Switch back to the corresponding forms list after saving
  if (currentForm.value === "initial-referral-new") {
    currentForm.value = "initial-referral-list";
  } else if (currentForm.value === "child-overview-new") {
    currentForm.value = "child-overview-list";
  } else if (currentForm.value === "initial-assessment-new") {
    currentForm.value = "initial-assessment-list";
  } else if (currentForm.value === "medical-intake-new") {
    currentForm.value = "medical-intake-list";
  }
  
  // Clear edit data from session storage
  sessionStorage.removeItem('editFormData');
};

const handleFormEdit = (form) => {
  // Switch to the appropriate form and populate with data
  currentForm.value = form.formType + "-new";
  selectedFormType.value = form.formType;
  
  // Store the form data for editing
  sessionStorage.setItem('editFormData', JSON.stringify(form));
  
  success("Form loaded for editing");
};

const handleAddNewForm = (formType) => {
  // Switch to the new form creation view
  currentForm.value = formType + "-new";
  selectedFormType.value = formType;
};

const backToFormsList = (formType) => {
  // Return to the forms list view
  currentForm.value = formType + "-list";
  selectedFormType.value = formType;
  
  // Clear edit data from session storage
  sessionStorage.removeItem('editFormData');
};

// Handle navigation from Child Tracker to Medical Intake Forms
const handleNavigateToMedicalIntake = () => {
  // Switch to data entry view
  currentView.value = "data-entry";
  // Set to medical intake forms list
  currentForm.value = "medical-intake-list";
  selectedFormType.value = "medical-intake";
};

const toggleInHousedMode = () => {
  if (currentView.value === 'child-tracker') {
    currentView.value = 'child-tracker-2';
  } else {
    currentView.value = 'child-tracker';
  }
};

// Load summary data
const loadSummaryData = async () => {
  try {
    // Load users count
    const usersResult = await UserService.getAllUsers();
    if (usersResult.success) {
      users.value = usersResult.users || [];
    }

    // Load form statistics
    const formStatsResult = await FormService.getFormStatistics();
    if (formStatsResult.success) {
      totalReports.value = formStatsResult.statistics.totalReferrals;
      totalChildren.value = formStatsResult.statistics.totalOverviews;
      totalEvents.value = formStatsResult.statistics.totalAssessments;
      totalDataEntries.value = formStatsResult.statistics.totalForms;
    } else {
      // Fallback to mock data if form stats fail
      totalReports.value = 24;
      totalChildren.value = 156;
      totalEvents.value = 89;
      totalDataEntries.value = 1247;
    }
  } catch (error) {
    console.error("Error loading summary data:", error);
    // Fallback to mock data
    totalReports.value = 24;
    totalChildren.value = 156;
    totalEvents.value = 89;
    totalDataEntries.value = 1247;
  }
};

const getSectionTitle = (view) => {
  const titles = {
    "tracker-capture": "Tracker Capture/outreach",
    reports: "Reports - Weekly",
    "data-entry": "Data Entry / Forms",
    "event-reports": "Event Reports",
    "child-tracker": "Child Tracker - In-house/children",
    "child-tracker-2": "In Housed Girls - Complete Forms Only",
    visualization: "Visualization",
    "data-analysis": "Data Analysis",
    capture: "Capture",
  };
  return titles[view] || "Section";
};

// Watch for route query changes to update view
watch(
  () => route.query.view,
  (newView) => {
    if (newView) {
      currentView.value = newView;
    }
  },
  { immediate: true }
);

// User management functions
const loadUsers = async () => {
  loadingUsers.value = true;
  try {
    const result = await UserService.getAllUsers();
    if (result.success) {
      users.value = result.users || [];
    } else {
      error(result.error || "Failed to load users");
    }
  } catch (err) {
    console.error("Error loading users:", err);
    error("An unexpected error occurred while loading users");
  } finally {
    loadingUsers.value = false;
  }
};

const handleAddUser = async () => {
  loading.value = true;
  try {
    // Validate form data
    if (!newUser.value.fullName.trim()) {
      error("Full name is required");
      return;
    }
    if (!newUser.value.email.trim()) {
      error("Email is required");
      return;
    }
    if (!newUser.value.password || newUser.value.password.length < 6) {
      error("Password must be at least 6 characters");
      return;
    }
    if (!newUser.value.phoneNumber.trim()) {
      error("Phone number is required");
      return;
    }

    // Check for duplicate email/username
    const { default: DuplicationService } = await import(
      "../services/duplicationService.js"
    );

    const duplicateCheck = await DuplicationService.checkDuplicateUser({
      email: newUser.value.email,
      username: newUser.value.fullName, // Using fullName as username for now
    });

    if (duplicateCheck.hasDuplicates) {
      const duplicateFields = duplicateCheck.duplicates
        .map((dup) => {
          return `${dup.field}: ${dup.value}`;
        })
        .join(", ");

      error(
        `User already exists with ${duplicateFields}. Please use different credentials.`
      );
      loading.value = false;
      return;
    }

    const result = await UserService.addUser(newUser.value);
    if (result.success) {
      success("User created successfully!");
      resetAddUserForm();
      await loadUsers();
    } else {
      error(result.error || "Failed to create user");
    }
  } catch (err) {
    console.error("Error adding user:", err);
    error("An unexpected error occurred while creating user");
  } finally {
    loading.value = false;
  }
};

const handleUpdateUser = async () => {
  loading.value = true;
  try {
    // Validate form data
    if (!editUser.value.fullName.trim()) {
      error("Full name is required");
      return;
    }
    if (!editUser.value.email.trim()) {
      error("Email is required");
      return;
    }
    if (!editUser.value.phoneNumber.trim()) {
      error("Phone number is required");
      return;
    }

    const result = await UserService.updateUser(
      editUser.value.uid,
      editUser.value
    );
    if (result.success) {
      success("User updated successfully!");
      cancelEditUser();
      await loadUsers();
    } else {
      error(result.error || "Failed to update user");
    }
  } catch (err) {
    console.error("Error updating user:", err);
    error("An unexpected error occurred while updating user");
  } finally {
    loading.value = false;
  }
};

const startEditUser = (user) => {
  editUser.value = {
    id: user.id,
    uid: user.uid,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };
  showEditUserForm.value = true;
  showAddUserForm.value = false;
};

const confirmDeleteUser = async (user) => {
  const confirmed = await confirm(
    `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`,
    "Delete User"
  );

  if (confirmed) {
    try {
      const result = await UserService.deleteUser(user.uid);
      if (result.success) {
        success("User deleted successfully!");
        await loadUsers();
      } else {
        error(result.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      error("An unexpected error occurred while deleting user");
    }
  }
};

const resetAddUserForm = () => {
  newUser.value = {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "admin", // Default to admin role for dashboard users
  };
  showAddUserForm.value = false;
};

const cancelAddUser = () => {
  resetAddUserForm();
};

const cancelEditUser = () => {
  showEditUserForm.value = false;
  editUser.value = {
    id: "",
    uid: "",
    fullName: "",
    email: "",
    phoneNumber: "",
  };
};

// Utility functions
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString();
};

// Get user's first name
const getFirstName = () => {
  if (!currentUserName.value) return "User";
  
  // Try to get first name from full name
  const nameParts = currentUserName.value.split(" ");
  return nameParts[0];
};

const getInitials = () => {
  if (!currentUserName.value) return "U";
  const nameParts = currentUserName.value.split(" ");
  if (nameParts.length >= 2) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
  return nameParts[0][0].toUpperCase();
};

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

// Get greeting icon based on time
const getGreetingIcon = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "fas fa-sun greeting-icon morning";
  } else if (hour >= 12 && hour < 17) {
    return "fas fa-cloud-sun greeting-icon afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "fas fa-moon greeting-icon evening";
  } else {
    return "fas fa-star greeting-icon night";
  }
};

// Get motivational welcome message
const getWelcomeMessage = () => {
  const messages = [
    "Ready to make a difference in children's lives today? ",
    "Let's continue making an impact together! ",
    "Your dedication to helping children is inspiring! ",
    "Every child's story matters. Let's capture them! ",
    "Together, we're building a brighter future for children! ",
    "Thank you for being part of The Kukhoma Project family! ",
    "Let's track progress and celebrate every milestone! ",
    "Your work today will create lasting change! ",
    "Empowering children, one record at a time! ",
    "Making data work for kids who need us most! "
  ];
  
  // Use date to get consistent message for the day
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  return messages[dayOfYear % messages.length];
};

const handleLogout = async () => {
  const result = await AuthService.logout();
  if (result.success) {
    router.push("/login");
  }
};

// Watch for route query changes
watch(() => route.query.view, (newView) => {
  if (newView) {
    setCurrentView(newView);
  }
});

// Load summary data when component mounts
onMounted(() => {
  // Set current user name
  const currentUser = AuthService.getCurrentUser();
  if (currentUser) {
    // Display user's name if available, otherwise fallback to email
    currentUserName.value =
      currentUser.name || currentUser.fullName || currentUser.email;
  } else {
    // Check for offline user data
    const savedUserData = localStorage.getItem("tkp_user_data");
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData);
        currentUserName.value =
          userData.user.name ||
          userData.user.fullName ||
          userData.user.email ||
          "Offline User";
      } catch (error) {
        console.error("Error parsing offline user data:", error);
        currentUserName.value = "Offline User";
      }
    } else {
      currentUserName.value = "User";
    }
  }

  // Update online status
  isOnline.value = navigator.onLine;

  loadSummaryData();

  // Check for query parameters (e.g., from Child Tracker navigation)
  const query = router.currentRoute.value.query;

  // Handle view query parameter from TopHeader navigation
  if (query.view) {
    setCurrentView(query.view);
  }

  // Handle openForm query parameter from TrackerCapture
  if (query.openForm) {
    console.log("📋 Dashboard received openForm query:", query.openForm);

    // Decode child data from query parameter
    if (query.childData) {
      try {
        const decodedChildData = JSON.parse(atob(query.childData));
        console.log("👶 Child data decoded:", decodedChildData);
        // Store in sessionStorage for form access
        sessionStorage.setItem(
          "selectedChildForForm",
          JSON.stringify(decodedChildData)
        );
      } catch (error) {
        console.error("Error decoding child data:", error);
      }
    }

    // Switch to data-entry view and open the specific form
    currentView.value = "data-entry";
    currentForm.value = query.openForm + "-new"; // e.g., 'child-overview-new'
    selectedFormType.value = query.openForm;
  }
});

onMounted(() => {
  setTimeout(async () => {
    await createMiniCharts();
  }, 400);
});

const createMiniCharts = async () => {
  try {
    const [referrals, overviews, assessments] = await Promise.all([
      FormService.getForms('initial-referral', 100),
      FormService.getForms('child-overview', 100),
      FormService.getForms('initial-assessment', 100)
    ]);

    const referralForms = referrals.success ? referrals.forms : [];
    const overviewForms = overviews.success ? overviews.forms : [];
    const assessmentForms = assessments.success ? assessments.forms : [];

    if (formsMiniChart.value) {
      const ctx = formsMiniChart.value.getContext('2d');
      const data = {
        labels: ['Initial Referral', 'Child Overview', 'Assessment'],
        datasets: [{
          data: [referralForms.length, overviewForms.length, assessmentForms.length],
          backgroundColor: ['#2c6693', '#6b7280', '#f59e0b']
        }]
      };
      new Chart(ctx, { type: 'doughnut', data, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } });
    }

    if (reportsMiniChart.value) {
      const ctx = reportsMiniChart.value.getContext('2d');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const count = new Array(12).fill(0);
      [...overviewForms, ...referralForms, ...assessmentForms].forEach(f => {
        const d = f.createdAt || f.submittedAt || f.dateCreated;
        if (!d) return;
        const date = d?.toDate ? d.toDate() : new Date(d);
        const m = date.getMonth();
        count[m]++;
      });
      new Chart(ctx, { type: 'bar', data: { labels: months, datasets: [{ data: count, backgroundColor: '#2c6693' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
    }

    if (eventsMiniChart.value) {
      const ctx = eventsMiniChart.value.getContext('2d');
      const statusCount = {};
      [...overviewForms, ...assessmentForms, ...referralForms].forEach(f => { const s = f.status || f.caseStatus || 'Unknown'; statusCount[s] = (statusCount[s]||0)+1; });
      const labels = Object.keys(statusCount);
      const values = Object.values(statusCount);
      new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ data: values, backgroundColor: '#f59e0b' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
    }

    if (analyticsMiniChart.value) {
      const ctx = analyticsMiniChart.value.getContext('2d');
      const genderCount = { Female: 0, Male: 0 };
      [...overviewForms, ...referralForms, ...assessmentForms].forEach(f => { const g = f.gender; if (g === 'Female') genderCount.Female++; else if (g === 'Male') genderCount.Male++; });
      new Chart(ctx, { type: 'pie', data: { labels: Object.keys(genderCount), datasets: [{ data: Object.values(genderCount), backgroundColor: ['#10b981', '#ef4444'] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } });
    }
  } catch (e) {}
};
</script>

<style scoped>
/* Dashboard Layout */
.dashboard {
  min-height: 100vh;
  background-color: #eeeeee; /* Light gray background */
}

/* DHIS2 Style Implementation */

/* Top Header Styles moved to TopHeader.vue */

/* Toolbar */
.dhis-toolbar-container {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboards-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #d1d5db;
  padding: 6px 12px;
  border-radius: 4px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dashboards-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.favorite-icon {
  color: #fbbf24; /* Amber for star */
  font-size: 1rem;
  cursor: pointer;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.tool-btn {
  background: white;
  border: 1px solid #d1d5db;
  padding: 6px 12px;
  border-radius: 4px;
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

/* Dashboard Content */
.dashboard-content {
  padding: 24px;
  background-color: #f3f4f6;
  min-height: calc(100vh - 110px);
}

.dhis-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

/* Widgets */
.dhis-widget {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: 320px; /* Fixed height for uniformity */
  transition: box-shadow 0.2s;
  overflow: hidden;
}

.dhis-widget:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.dhis-widget.double-height {
  grid-row: span 1; /* Keep it single row for now, or span 2 if needed */
}

.widget-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.widget-title {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.widget-controls {
  color: #9ca3af;
  cursor: pointer;
}

.widget-controls:hover {
  color: #4b5563;
}

.widget-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  position: relative;
}

.widget-content.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  cursor: pointer;
}

.widget-content.center-content:hover .big-icon {
  transform: scale(1.1);
  color: #2c6693;
}

.big-icon {
  font-size: 4rem;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.widget-label {
  font-size: 1.1rem;
  font-weight: 500;
  color: #4b5563;
}

/* Welcome Widget Specifics */
.welcome-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.welcome-content h3 {
  font-size: 1.8rem;
  color: #2c6693;
  margin-bottom: 8px;
}

.welcome-content p {
  color: #6b7280;
  margin-bottom: 24px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.stat {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #6b7280;
}

.stat strong {
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 4px;
}

/* Offline Banner */
.offline-banner {
  background-color: #f59e0b; /* Amber 500 */
  color: white;
  padding: 8px 16px;
  box-shadow: 0 4px 8px rgba(74, 20, 140, 0.4);
}

.back-to-list-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(74, 20, 140, 0.3);
}

.forms-list-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Child Tracker Section */
.child-tracker-section {
  background: transparent;
  padding: 0;
}

/* Data Visualization Section */
.visualization-section {
  background: transparent;
  padding: 0;
  position: relative;
}

/* Data Analysis Section */
.data-analysis-section {
  background: transparent;
  padding: 0;
  position: relative;
}

/* Reports Section */
.reports-section {
  background: transparent;
  padding: 0;
  position: relative;
}

.section-actions {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

/* Section Placeholder */
.section-placeholder {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.section-placeholder h2 {
  color: #4a148c;
  margin-bottom: 1rem;
}

.section-placeholder p {
  color: #666;
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-buttons-grid {
    grid-template-columns: repeat(3, minmax(140px, 1fr));
  }
}

@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .dashboard-buttons-grid {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    justify-items: center;
  }

  .dashboard-btn {
    width: 140px;
    max-width: 140px;
  }
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .dashboard-buttons-grid {
    grid-template-columns: repeat(2, minmax(130px, 1fr));
    justify-items: center;
    max-width: none;
  }

  .dashboard-btn {
    width: 130px;
    max-width: 130px;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1.5rem;
  }

  .form-header h3 {
    font-size: 1.2rem;
    text-align: center;
  }

  .back-to-list-btn {
    width: 100%;
    justify-content: center;
  }

  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }

  .logo-card {
    max-width: none;
    width: 100%;
  }

  .logo-container {
    width: 60px;
    height: 60px;
  }

  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }
}

/* Mobile-specific (max-width: 600px) */
@media (max-width: 600px) {
  .dashboard-buttons-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    justify-items: center;
    gap: 0.5rem;
  }

  .project-title {
    font-size: 1.1rem;
  }

  .section-title h2 {
    font-size: 1.3rem;
  }

  .user-management {
    padding: 1rem;
  }

  table {
    font-size: 0.8rem;
  }

  th,
  td {
    padding: 0.5rem;
  }

  .message {
    right: 10px;
    left: 10px;
    min-width: auto;
  }

  .logo-card {
    padding: 1.5rem;
  }

  .logo-container {
    width: 60px;
    height: 60px;
  }

  .dashboard-btn {
    font-size: 0.8rem;
    padding: 14px 10px;
    min-height: 75px;
    width: 120px;
    max-width: 120px;
    gap: 6px;
  }

  .dashboard-btn span {
    font-size: 0.75rem;
    line-height: 1;
  }

  .btn-icon {
    width: 18px;
    height: 18px;
  }

  .description-text {
    font-size: 0.85rem;
    text-align: left;
    
  }
}

/* Individual button color schemes */
.outreach-btn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
}

.outreach-btn:hover {
  box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
}

/* Welcome Banner */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 2rem 1rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  overflow: hidden;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  color: white;
}

.welcome-text {
  flex: 1;
}

.welcome-greeting {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-message {
  font-size: 1.1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  line-height: 1.5;
}

.welcome-icon {
  font-size: 4rem;
  opacity: 0.9;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.greeting-icon {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.greeting-icon.morning {
  color: #ffd700;
  animation: pulse 2s ease-in-out infinite;
}

.greeting-icon.afternoon {
  color: #ff9500;
}

.greeting-icon.evening {
  color: #f8f9fa;
}

.greeting-icon.night {
  color: #ffe66d;
  animation: twinkle 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive design for welcome banner */
@media (max-width: 768px) {
  .welcome-banner {
    margin: 0 1rem 1rem 1rem;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .welcome-greeting {
    font-size: 1.5rem;
  }
  
  .welcome-message {
    font-size: 1rem;
  }
  
  .welcome-icon {
    font-size: 3rem;
    margin-top: 1rem;
  }
}

/* Offline Banner */
.offline-banner {
  background-color: #ff9800;
  color: white;
  padding: 0.75rem 1rem;
  text-align: center;
  font-weight: 500;
  border-bottom: 1px solid #e68a00;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.offline-banner i {
  font-size: 1.2rem;
}

/* Offline Indicator */
.offline-indicator {
  color: #ff9800;
  font-weight: 600;
}
</style>
