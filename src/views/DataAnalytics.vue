<template>
  <div class="data-analytics">
    <!-- Header -->
    <div class="analytics-header">
      <div>
        <h1><i class="fas fa-chart-bar"></i> Data Analytics</h1>
        <p>Explore and visualize your data</p>
      </div>
      <div class="header-actions">
        <button @click="refreshData" class="btn-secondary" :disabled="isLoading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i> Refresh
        </button>
        <button @click="exportData" class="btn-primary">
          <i class="fas fa-file-export"></i> Export
        </button>
      </div>
    </div>

    <div class="analytics-layout">
      <!-- Sidebar Filters -->
      <aside class="filters-sidebar">
        <div class="sidebar-header">
          <h3>Data Explorer</h3>
          <span class="badge">{{ selectedCount }} selected</span>
        </div>
        <button @click="resetFilters" class="btn-reset">
          <i class="fas fa-undo"></i> Reset
        </button>

        <!-- Age Groups Filter -->
        <div class="filter-group">
          <h4 @click="toggleGroup('age')">
            <i class="fas fa-users"></i> Age Groups ({{ selectedAge.length }})
            <i class="fas fa-chevron-down"></i>
          </h4>
          <div class="filter-options" v-show="expanded.age">
            <label v-for="opt in ageOptions" :key="opt.value">
              <input type="checkbox" :value="opt.value" v-model="selectedAge">
              <span>{{ opt.label }}</span>
              <span class="count">({{ opt.count }})</span>
            </label>
          </div>
        </div>

        <!-- Form Types -->
        <div class="filter-group">
          <h4 @click="toggleGroup('formType')">
            <i class="fas fa-file-alt"></i> Form Types ({{ selectedFormType.length }})
          </h4>
          <div class="filter-options" v-show="expanded.formType">
            <label v-for="opt in formTypeOptions" :key="opt.value">
              <input type="checkbox" :value="opt.value" v-model="selectedFormType">
              <span>{{ opt.label }}</span>
              <span class="count">({{ opt.count }})</span>
            </label>
          </div>
        </div>

        <!-- Status -->
        <div class="filter-group">
          <h4 @click="toggleGroup('status')">
            <i class="fas fa-check-circle"></i> Status ({{ selectedStatus.length }})
          </h4>
          <div class="filter-options" v-show="expanded.status">
            <label v-for="opt in statusOptions" :key="opt.value">
              <input type="checkbox" :value="opt.value" v-model="selectedStatus">
              <span>{{ opt.label }}</span>
              <span class="count">({{ opt.count }})</span>
            </label>
          </div>
        </div>

        <!-- Date Range -->
        <div class="filter-group">
          <h4><i class="fas fa-calendar"></i> Date Range</h4>
          <div class="date-tabs">
            <button :class="{ active: dateRange === 'monthly' }" @click="dateRange = 'monthly'">Monthly</button>
            <button :class="{ active: dateRange === 'quarterly' }" @click="dateRange = 'quarterly'">Quarterly</button>
          </div>
          <select v-model="selectedMonth" class="form-select">
            <option value="oct">October 2025</option>
            <option value="sep">September 2025</option>
            <option value="aug">August 2025</option>
          </select>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="analytics-main">
        <!-- Summary Cards -->
        <div class="summary-grid">
          <div class="summary-card blue">
            <i class="fas fa-file-alt"></i>
            <div>
              <h3>{{ stats.totalForms }}</h3>
              <p>Total Forms</p>
            </div>
          </div>
          <div class="summary-card green">
            <i class="fas fa-user-plus"></i>
            <div>
              <h3>{{ stats.referrals }}</h3>
              <p>Referrals</p>
            </div>
          </div>
          <div class="summary-card purple">
            <i class="fas fa-eye"></i>
            <div>
              <h3>{{ stats.overviews }}</h3>
              <p>Overviews</p>
            </div>
          </div>
          <div class="summary-card orange">
            <i class="fas fa-clipboard-check"></i>
            <div>
              <h3>{{ stats.assessments }}</h3>
              <p>Assessments</p>
            </div>
          </div>
          <div class="summary-card teal">
            <i class="fas fa-percentage"></i>
            <div>
              <h3>{{ stats.completionRate }}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-section">
          <h3><i class="fas fa-history"></i> Recent Activity</h3>
          <div class="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Child Name</th>
                  <th>User</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recentActivity" :key="item.id">
                  <td>{{ item.date }}</td>
                  <td><span class="badge-type">{{ item.type }}</span></td>
                  <td><strong>{{ item.childName }}</strong></td>
                  <td>{{ item.user }}</td>
                  <td><span :class="'badge-' + item.status.toLowerCase()">{{ item.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const isLoading = ref(false);
const dateRange = ref('monthly');
const selectedMonth = ref('oct');
const selectedAge = ref([]);
const selectedFormType = ref([]);
const selectedStatus = ref([]);
const expanded = ref({ age: true, formType: true, status: true });

const ageOptions = [
  { label: '0-2 years', value: '0-2', count: 0 },
  { label: '9-12 years', value: '9-12', count: 4 },
  { label: '13-17 years', value: '13-17', count: 8 }
];

const formTypeOptions = [
  { label: 'Referral', value: 'referral', count: 5 },
  { label: 'Overview', value: 'overview', count: 7 },
  { label: 'Assessment', value: 'assessment', count: 4 }
];

const statusOptions = [
  { label: 'Submitted', value: 'submitted', count: 12 },
  { label: 'Draft', value: 'draft', count: 18 }
];

const stats = ref({
  totalForms: 30,
  referrals: 5,
  overviews: 7,
  assessments: 4,
  completionRate: 60
});

const recentActivity = ref([
  { id: 1, date: 'Nov 7, 2025', type: 'Overview', childName: 'Alice Mukobela', user: 'System User', status: 'Draft' },
  { id: 2, date: 'Nov 5, 2025', type: 'Assessment', childName: 'Cecillia Longa', user: 'System User', status: 'Draft' },
  { id: 3, date: 'Nov 5, 2025', type: 'Referral', childName: 'Bridget Longa', user: 'System User', status: 'Draft' }
]);

const selectedCount = computed(() => 
  selectedAge.value.length + selectedFormType.value.length + selectedStatus.value.length
);

const toggleGroup = (group) => {
  expanded.value[group] = !expanded.value[group];
};

const resetFilters = () => {
  selectedAge.value = [];
  selectedFormType.value = [];
  selectedStatus.value = [];
};

const refreshData = () => {
  isLoading.value = true;
  setTimeout(() => isLoading.value = false, 1000);
};

const exportData = () => {
  alert('Exporting data...');
};
</script>

<style scoped>
.data-analytics {
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
}

.analytics-header h1 {
  color: #4a148c;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.analytics-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.filters-sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  height: fit-content;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sidebar-header h3 {
  color: #4a148c;
  margin: 0;
}

.badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.btn-reset {
  width: 100%;
  padding: 0.75rem;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group h4 {
  padding: 0.75rem;
  background: #f9f9f9;
  margin: 0 0 0.5rem 0;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-options label {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
  cursor: pointer;
}

.filter-options .count {
  margin-left: auto;
  color: #999;
  font-size: 0.85rem;
}

.date-tabs {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.date-tabs button {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.date-tabs button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-card i {
  font-size: 2.5rem;
  opacity: 0.9;
}

.summary-card.blue { color: #2196f3; }
.summary-card.green { color: #4caf50; }
.summary-card.purple { color: #9c27b0; }
.summary-card.orange { color: #ff9800; }
.summary-card.teal { color: #009688; }

.summary-card h3 {
  margin: 0;
  font-size: 2rem;
}

.summary-card p {
  margin: 0;
  color: #666;
}

.activity-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
}

.activity-section h3 {
  margin: 0 0 1.5rem 0;
  color: #4a148c;
}

.activity-table table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th {
  text-align: left;
  padding: 1rem;
  background: #f9f9f9;
  color: #4a148c;
  font-weight: 600;
}

.activity-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.badge-type {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.badge-draft {
  background: #fff3e0;
  color: #ef6c00;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.btn-secondary, .btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-primary {
  background: #4a148c;
  color: white;
}
</style>
