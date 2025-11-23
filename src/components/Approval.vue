<template>
  <div class="dhis2-app-shell">
    <TopHeader />
    
    <div class="app-content">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Data Approval</h3>
          </div>
          <nav class="sidebar-nav">
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeView === 'approval' }"
              @click.prevent="activeView = 'approval'"
            >
              <i class="fas fa-check-circle"></i>
              Approve Data
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeView === 'status' }"
              @click.prevent="activeView = 'status'"
            >
              <i class="fas fa-list-alt"></i>
              Approval Status
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="main-workspace">
        <div class="workspace-header">
          <h2 class="module-title">{{ activeView === 'approval' ? 'Approve Data' : 'Approval Status' }}</h2>
        </div>

        <div class="workspace-content">
          
          <!-- Filters -->
          <div class="filter-card">
            <div class="filter-row">
              <div class="filter-group">
                <label>Organisation Unit</label>
                <select v-model="filters.orgUnit" class="dhis2-select">
                  <option value="all">All Units</option>
                  <option value="Lusaka District">Lusaka District</option>
                  <option value="Chongwe Outreach">Chongwe Outreach</option>
                  <option value="Kafue Center">Kafue Center</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Program / Data Set</label>
                <select v-model="filters.program" class="dhis2-select">
                  <option value="all">All Programs</option>
                  <option value="child-care">Child Care Program</option>
                  <option value="medical">Medical Support</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Period</label>
                <input type="month" v-model="filters.period" class="dhis2-input" />
              </div>
              <div class="filter-actions">
                <button class="dhis2-btn primary" @click="fetchData" :disabled="loading">
                  <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-search'"></i>
                  Fetch Data
                </button>
              </div>
            </div>
          </div>

          <!-- Approval View -->
          <div v-if="activeView === 'approval'" class="module-container">
            <div class="results-area" v-if="approvalList">
              <div class="results-header">
                <h3>Pending Approvals</h3>
                <div class="action-buttons" v-if="selectedItems.length > 0">
                  <button class="dhis2-btn success" @click="approveSelected">
                    <i class="fas fa-check"></i> Approve ({{ selectedItems.length }})
                  </button>
                  <button class="dhis2-btn danger" @click="rejectSelected">
                    <i class="fas fa-times"></i> Unapprove ({{ selectedItems.length }})
                  </button>
                </div>
              </div>

              <table class="dhis2-table" v-if="approvalList.length > 0">
                <thead>
                  <tr>
                    <th class="checkbox-col">
                      <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" />
                    </th>
                    <th>Date</th>
                    <th>Org Unit</th>
                    <th>Data Set</th>
                    <th>Submitted By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in approvalList" :key="item.id">
                    <td class="checkbox-col">
                      <input type="checkbox" v-model="selectedItems" :value="item.id" />
                    </td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>{{ item.orgUnit }}</td>
                    <td>{{ getProgramName(item.formType) }}</td>
                    <td>{{ item.submittedBy || 'System User' }}</td>
                    <td>
                      <span class="status-badge" :class="item.status">
                        {{ item.status }}
                      </span>
                    </td>
                    <td>
                      <button class="icon-btn" title="View Data" @click="viewData(item)">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="empty-state" v-else-if="!loading">
                <i class="fas fa-check-circle text-green"></i>
                <p>No data pending approval for the selected criteria.</p>
              </div>
            </div>
          </div>

          <!-- Status View -->
          <div v-if="activeView === 'status'" class="module-container">
             <div class="results-area" v-if="statusList">
              <div class="results-header">
                <h3>Approval Status Overview</h3>
              </div>

              <table class="dhis2-table" v-if="statusList.length > 0">
                <thead>
                  <tr>
                    <th>Organisation Unit</th>
                    <th>Data Set</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Approved By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in statusList" :key="item.id">
                    <td>{{ item.orgUnit }}</td>
                    <td>{{ getProgramName(item.formType) }}</td>
                    <td>{{ item.period }}</td>
                    <td>
                      <span class="status-badge" :class="item.status">
                        {{ item.status }}
                      </span>
                    </td>
                    <td>{{ item.approvedBy || '-' }}</td>
                    <td>{{ formatDate(item.approvedAt) }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="empty-state" v-else-if="!loading">
                <i class="fas fa-info-circle text-blue"></i>
                <p>No approval history found.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TopHeader from "./TopHeader.vue";
import EnhancedOutreachService from "../services/enhancedOutreachService.js";
import { useToast } from "../composables/useToast.js";

const { success, error, info } = useToast();

const activeView = ref('approval');
const loading = ref(false);
const selectedItems = ref([]);

const filters = ref({
  orgUnit: 'all',
  program: 'all',
  period: new Date().toISOString().slice(0, 7) // YYYY-MM
});

const rawData = ref([]);

const getProgramName = (type) => {
  const map = {
    'birth-delivery': 'Birth & Delivery',
    'care-plan-baby': 'Care Plan (Baby)',
    'medical-intake': 'Medical Intake',
    'child-care': 'Child Care Program'
  };
  return map[type] || type || 'Unknown Program';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB');
};

const fetchData = async () => {
  loading.value = true;
  selectedItems.value = [];
  try {
    const forms = await EnhancedOutreachService.getAllForms();
    
    // Filter logic
    rawData.value = forms.filter(f => {
      // Filter by Org Unit
      if (filters.value.orgUnit !== 'all' && f.orgUnit !== filters.value.orgUnit) return false;
      
      // Filter by Period (Month match)
      if (f.createdAt && !f.createdAt.startsWith(filters.value.period)) return false;

      // Filter by Program (Mock mapping)
      // In real app, check formType against program
      
      return true;
    });

    success(`Fetched ${rawData.value.length} records`);
  } catch (err) {
    error("Failed to fetch data: " + err.message);
  } finally {
    loading.value = false;
  }
};

const approvalList = computed(() => {
  // Show items that are 'completed' (ready for approval) or 'approved' (if we want to unapprove)
  // For "Approve Data" view, typically we show items ready to be approved.
  // Let's assume 'completed' = Pending Approval, 'approved' = Approved.
  return rawData.value.filter(item => item.status === 'completed' || item.status === 'approved');
});

const statusList = computed(() => {
  return rawData.value.filter(item => item.status === 'approved');
});

const allSelected = computed(() => {
  return approvalList.value.length > 0 && selectedItems.value.length === approvalList.value.length;
});

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = approvalList.value.map(i => i.id);
  }
};

const approveSelected = async () => {
  if (!confirm(`Approve ${selectedItems.value.length} items?`)) return;
  
  loading.value = true;
  try {
    // Mock API call to approve
    for (const id of selectedItems.value) {
      const item = rawData.value.find(i => i.id === id);
      if (item) {
        item.status = 'approved';
        item.approvedBy = 'Current User';
        item.approvedAt = new Date().toISOString();
        // Persist change
        await EnhancedOutreachService.saveFormLocally(item);
      }
    }
    success("Selected items approved successfully");
    selectedItems.value = [];
  } catch (err) {
    error("Approval failed");
  } finally {
    loading.value = false;
  }
};

const rejectSelected = async () => {
  if (!confirm(`Unapprove ${selectedItems.value.length} items?`)) return;

  loading.value = true;
  try {
    for (const id of selectedItems.value) {
      const item = rawData.value.find(i => i.id === id);
      if (item) {
        item.status = 'completed'; // Revert to completed (pending approval)
        item.approvedBy = null;
        item.approvedAt = null;
        await EnhancedOutreachService.saveFormLocally(item);
      }
    }
    success("Selected items unapproved");
    selectedItems.value = [];
  } catch (err) {
    error("Unapproval failed");
  } finally {
    loading.value = false;
  }
};

const viewData = (item) => {
  info("Viewing data details: " + item.id);
  // Implement view modal if needed
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.dhis2-app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f5f7;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  color: #212121;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-section {
  padding: 12px 0;
}

.section-header {
  padding: 0 16px 8px;
}

.section-header h3 {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #616161;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #494949;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #212121;
}

.nav-item.active {
  background: #e8f4f8;
  color: #2b6693;
  border-left-color: #2b6693;
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
}

/* Main Workspace */
.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f3f5f7;
  overflow-y: auto;
  padding: 24px;
}

.workspace-header {
  margin-bottom: 24px;
}

.module-title {
  margin: 0;
  font-size: 1.5rem;
  color: #2b6693;
  font-weight: 400;
}

.module-container {
  max-width: 1200px;
}

/* Filter Card */
.filter-card {
  background: white;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.filter-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  color: #616161;
  font-weight: 500;
}

.dhis2-select,
.dhis2-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  font-size: 0.9rem;
  color: #212121;
  background: white;
}

.filter-actions {
  padding-bottom: 1px;
}

/* Buttons */
.dhis2-btn {
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 3px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.dhis2-btn.primary {
  background: #2b6693;
  color: white;
}

.dhis2-btn.primary:hover {
  background: #1d4260;
}

.dhis2-btn.success {
  background: #4caf50;
  color: white;
}

.dhis2-btn.danger {
  background: #f44336;
  color: white;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #2b6693;
}

/* Results Area */
.results-area {
  background: white;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.results-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #212121;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* Table */
.dhis2-table {
  width: 100%;
  border-collapse: collapse;
}

.dhis2-table th {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #d5d5d5;
  background: #f8f9fa;
  font-weight: 500;
  color: #494949;
  font-size: 0.85rem;
}

.dhis2-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #212121;
  font-size: 0.9rem;
}

.checkbox-col {
  width: 40px;
  text-align: center;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
}

.status-badge.completed { background: #fff3e0; color: #ef6c00; } /* Pending Approval */
.status-badge.approved { background: #e8f5e9; color: #2e7d32; }

.text-green { color: #10b981; }
.text-blue { color: #2b6693; }

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px;
  color: #757575;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  display: block;
}
</style>
