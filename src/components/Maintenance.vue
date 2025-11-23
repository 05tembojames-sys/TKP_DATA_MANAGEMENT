<template>
  <div class="maintenance-container">
    <!-- Top Header -->
    <TopHeader />

    <!-- Maintenance Sub-Header -->
    <div class="maintenance-sub-header">
      <div class="header-left">
        <h1 class="page-title">System Maintenance</h1>
      </div>
      <div class="header-right">
        <button @click="runMaintenance" class="run-button">
          <i class="fas fa-play-circle"></i>
          Run Selected Tasks
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="maintenance-content">
      <!-- System Status -->
      <div class="system-status">
        <h2>System Status</h2>
        <div class="status-grid">
          <div class="status-card">
            <div class="status-icon healthy">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="status-info">
              <div class="status-label">Database</div>
              <div class="status-value">Healthy</div>
            </div>
          </div>
          <div class="status-card">
            <div class="status-icon healthy">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="status-info">
              <div class="status-label">Storage</div>
              <div class="status-value">75% Used</div>
            </div>
          </div>
          <div class="status-card">
            <div class="status-icon warning">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="status-info">
              <div class="status-label">Cache</div>
              <div class="status-value">Needs Clearing</div>
            </div>
          </div>
          <div class="status-card">
            <div class="status-icon healthy">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="status-info">
              <div class="status-label">Backup</div>
              <div class="status-value">Last: 2 hours ago</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Tasks -->
      <div class="maintenance-tasks">
        <h2>Maintenance Tasks</h2>
        <div class="tasks-list">
          <div 
            v-for="task in tasks" 
            :key="task.id"
            class="task-item"
          >
            <input 
              type="checkbox" 
              :id="'task-' + task.id"
              :value="task.id"
              v-model="selectedTasks"
            />
            <div class="task-info">
              <label :for="'task-' + task.id">
                <strong>{{ task.name }}</strong>
              </label>
              <p>{{ task.description }}</p>
              <div class="task-meta">
                <span class="task-frequency">{{ task.frequency }}</span>
                <span class="task-last-run">Last run: {{ task.lastRun }}</span>
              </div>
            </div>
            <div class="task-status">
              <span class="status-badge" :class="task.status">{{ task.status }}</span>
            </div>
            <button @click="runSingleTask(task)" class="run-single-btn">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Maintenance History -->
      <div class="maintenance-history">
        <h2>Recent Activity</h2>
        <div class="history-list">
          <div v-for="item in history" :key="item.id" class="history-item">
            <div class="history-icon" :class="item.status">
              <i :class="getHistoryIcon(item.status)"></i>
            </div>
            <div class="history-info">
              <strong>{{ item.task }}</strong>
              <p>{{ item.message }}</p>
              <span class="history-time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Resources -->
      <div class="system-resources">
        <h2>System Resources</h2>
        <div class="resources-grid">
          <div class="resource-card">
            <h4>Disk Space</h4>
            <div class="resource-bar">
              <div class="resource-fill" :style="{ width: '75%', backgroundColor: '#f59e0b' }"></div>
            </div>
            <div class="resource-stats">
              <span>32GB used</span>
              <span>15GB free</span>
            </div>
          </div>
          <div class="resource-card">
            <h4>Memory Usage</h4>
            <div class="resource-bar">
              <div class="resource-fill" :style="{ width: '60%', backgroundColor: '#10b981' }"></div>
            </div>
            <div class="resource-stats">
              <span>4.8GB used</span>
              <span>3.2GB free</span>
            </div>
          </div>
          <div class="resource-card">
            <h4>Database Size</h4>
            <div class="resource-bar">
              <div class="resource-fill" :style="{ width: '45%', backgroundColor: '#3b82f6' }"></div>
            </div>
            <div class="resource-stats">
              <span>2.3GB</span>
              <span>55% capacity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import { ref } from "vue";

const selectedTasks = ref([]);

const tasks = ref([
  {
    id: 1,
    name: 'Clear Application Cache',
    description: 'Clear cached data to improve performance',
    frequency: 'Weekly',
    lastRun: '3 days ago',
    status: 'ready'
  },
  {
    id: 2,
    name: 'Database Optimization',
    description: 'Optimize database tables and indexes',
    frequency: 'Monthly',
    lastRun: '2 weeks ago',
    status: 'ready'
  },
  {
    id: 3,
    name: 'Backup System Data',
    description: 'Create full system backup',
    frequency: 'Daily',
    lastRun: '2 hours ago',
    status: 'completed'
  },
  {
    id: 4,
    name: 'Clean Temporary Files',
    description: 'Remove temporary and orphaned files',
    frequency: 'Weekly',
    lastRun: '5 days ago',
    status: 'ready'
  },
  {
    id: 5,
    name: 'Update System Indexes',
    description: 'Rebuild search and data indexes',
    frequency: 'Monthly',
    lastRun: '1 week ago',
    status: 'ready'
  },
  {
    id: 6,
    name: 'Archive Old Records',
    description: 'Move records older than 2 years to archive',
    frequency: 'Quarterly',
    lastRun: '1 month ago',
    status: 'ready'
  }
]);

const history = ref([
  {
    id: 1,
    task: 'Backup System Data',
    message: 'Successfully completed backup (2.3GB)',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: 2,
    task: 'Clear Application Cache',
    message: 'Cache cleared (450MB freed)',
    time: '3 days ago',
    status: 'success'
  },
  {
    id: 3,
    task: 'Database Optimization',
    message: 'Failed: Table lock timeout',
    time: '1 week ago',
    status: 'error'
  }
]);

const getHistoryIcon = (status) => {
  return status === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle';
};

const runSingleTask = (task) => {
  console.log('Running task:', task.name);
  task.status = 'running';
  setTimeout(() => {
    task.status = 'completed';
    task.lastRun = 'Just now';
  }, 2000);
};

const runMaintenance = () => {
  console.log('Running selected tasks:', selectedTasks.value);
  selectedTasks.value = [];
};
</script>

<style scoped>
.maintenance-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.maintenance-sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.run-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.run-button:hover {
  background-color: #059669;
}

.maintenance-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  grid-template-areas:
    "status status"
    "tasks history"
    "resources resources";
}

.system-status {
  grid-area: status;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.system-status h2,
.maintenance-tasks h2,
.maintenance-history h2,
.system-resources h2 {
  font-size: 1.25rem;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.status-icon.healthy {
  background: #d1fae5;
  color: #10b981;
}

.status-icon.warning {
  background: #fef3c7;
  color: #f59e0b;
}

.status-icon.error {
  background: #fee2e2;
  color: #ef4444;
}

.status-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.status-value {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.maintenance-tasks {
  grid-area: tasks;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.task-item:has(input:checked) {
  border-color: #3b82f6;
  background: #eff6ff;
}

.task-item input[type="checkbox"] {
  margin-top: 0.25rem;
  cursor: pointer;
}

.task-info {
  flex: 1;
}

.task-info label {
  cursor: pointer;
}

.task-info strong {
  display: block;
  color: #111827;
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
}

.task-info p {
  margin: 0 0 0.75rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.task-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.ready {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.running {
  background: #fef3c7;
  color: #92400e;
}

.run-single-btn {
  background: #3b82f6;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.run-single-btn:hover {
  background: #2563eb;
}

.maintenance-history {
  grid-area: history;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.history-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.history-icon.success {
  background: #d1fae5;
  color: #10b981;
}

.history-icon.error {
  background: #fee2e2;
  color: #ef4444;
}

.history-info {
  flex: 1;
}

.history-info strong {
  display: block;
  color: #111827;
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
}

.history-info p {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.history-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.system-resources {
  grid-area: resources;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.resource-card h4 {
  font-size: 0.9375rem;
  color: #111827;
  margin: 0 0 1rem 0;
}

.resource-bar {
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.resource-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.resource-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
