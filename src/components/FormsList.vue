<template>
  <div class="forms-list-container">
    <div class="forms-header">
      <h3>{{ formTypeName }} Forms</h3>
      <div class="forms-actions">
        <button @click="refreshForms" class="refresh-btn" :disabled="loading">
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
        <button @click="exportForms" class="export-btn" :disabled="loading || forms.length === 0">
          Export
        </button>
        <button @click="addNewForm" class="add-form-btn">
          Add New {{ formTypeName }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && forms.length === 0" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading forms...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && forms.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <h4>No forms found</h4>
      <p>No {{ formTypeName.toLowerCase() }} forms have been submitted yet.</p>
    </div>

    <!-- Forms List -->
    <div v-else class="forms-list">
      <div class="forms-table-container">
        <table class="forms-table">
          <thead>
            <tr>
              <th>Form ID</th>
              <th>Child Name</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="form in forms" :key="form.id" class="form-row">
              <td class="form-id">{{ form.id.substring(0, 8) }}...</td>
              <td class="child-name">
                {{ getChildName(form) }}
              </td>
              <td class="date-created">
                {{ formatDate(form.createdAt) }}
              </td>
              <td class="status">
                <span :class="['status-badge', form.status]">
                  {{ form.status }}
                </span>
              </td>
              <td class="actions">
                <button @click="viewForm(form)" class="action-btn view">
                  View
                </button>
                <button @click="editForm(form)" class="action-btn edit">
                  Edit
                </button>
                <button @click="deleteForm(form)" class="action-btn delete">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="currentPage"
        :total-items="totalItems"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </div>

    <!-- Form Modal -->
    <div v-if="selectedForm" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>Form Details</h4>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <pre class="form-data">{{ JSON.stringify(selectedForm, null, 2) }}</pre>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="cancel-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '../composables/useToast.js'
import FormService from '../services/formService.js'
import Pagination from './Pagination.vue'

const props = defineProps({
  formType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['form-selected', 'form-edit', 'add-new-form'])
const { success, error, confirm } = useToast()

// Reactive data
const forms = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const lastVisible = ref(null)
const selectedForm = ref(null)

// Computed properties
const formTypeName = computed(() => {
  const names = {
    'initial-referral': 'Initial Child Referral',
    'child-overview': 'Child Overview and Background',
    'initial-assessment': 'TKP Initial Assessment'
  }
  return names[props.formType] || 'Form'
})

// Methods
const loadForms = async () => {
  loading.value = true
  try {
    const result = await FormService.getForms(props.formType, pageSize.value, lastVisible.value)
    
    if (result.success) {
      if (currentPage.value === 1) {
        forms.value = result.forms
      } else {
        forms.value = [...forms.value, ...result.forms]
      }
      
      lastVisible.value = result.lastVisible
      totalItems.value = result.forms.length + (currentPage.value - 1) * pageSize.value
      
      if (!result.hasMore) {
        totalItems.value = forms.value.length
      }
    } else {
      console.error('Error loading forms:', result.error)
      forms.value = []
    }
  } catch (error) {
    console.error('Error loading forms:', error)
    forms.value = []
  } finally {
    loading.value = false
  }
}

const refreshForms = () => {
  currentPage.value = 1
  lastVisible.value = null
  forms.value = []
  loadForms()
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadForms()
}

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  lastVisible.value = null
  forms.value = []
  loadForms()
}

const getChildName = (form) => {
  if (form.childFirstName && form.childLastName) {
    return `${form.childFirstName} ${form.childLastName}`
  } else if (form.childFirstName) {
    return form.childFirstName
  } else {
    return 'N/A'
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}

const viewForm = (form) => {
  selectedForm.value = form
}

const editForm = (form) => {
  emit('form-edit', form)
}

const deleteForm = async (form) => {
  const confirmed = await confirm(
    `Are you sure you want to delete this form? This action cannot be undone.`,
    'Delete Form'
  )
  
  if (confirmed) {
    try {
      const result = await FormService.deleteForm(form.id)
      if (result.success) {
        // Remove from local list
        const index = forms.value.findIndex(f => f.id === form.id)
        if (index > -1) {
          forms.value.splice(index, 1)
        }
        success('Form deleted successfully!')
      } else {
        error('Error deleting form: ' + result.error)
      }
    } catch (err) {
      console.error('Error deleting form:', err)
      error('Error deleting form. Please try again.')
    }
  }
}

const closeModal = () => {
  selectedForm.value = null
}

const exportForms = () => {
  const dataStr = JSON.stringify(forms.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${props.formType}-forms-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const addNewForm = () => {
  emit('add-new-form', props.formType)
}

// Lifecycle
onMounted(() => {
  loadForms()
})

// Watch for form type changes
watch(() => props.formType, () => {
  currentPage.value = 1
  lastVisible.value = null
  forms.value = []
  loadForms()
})
</script>

<style scoped>
.forms-list-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.forms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f8f9fa;
  background: #f8f9fa;
}

.forms-header h3 {
  color: #4A148C;
  margin: 0;
  font-size: 1.5rem;
}

.forms-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.refresh-btn,
.export-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.refresh-btn:hover:not(:disabled),
.export-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.refresh-btn {
  background: #4A148C;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #2D1B69;
}

.export-btn {
  background: #28a745;
  color: white;
}

.export-btn:hover:not(:disabled) {
  background: #218838;
}

.add-form-btn {
  background: #FF5722;
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(255, 87, 34, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.add-form-btn::before {
  content: '+';
  font-size: 1.2rem;
  font-weight: bold;
}

.add-form-btn:hover {
  background: #FF8A50;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 87, 34, 0.4);
}

.add-form-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 87, 34, 0.3);
}

.refresh-btn:disabled,
.export-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A148C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  color: #4A148C;
  margin-bottom: 0.5rem;
}

.forms-table-container {
  overflow-x: auto;
}

.forms-table {
  width: 100%;
  border-collapse: collapse;
}

.forms-table th {
  background: #4A148C;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.forms-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.9rem;
}

.form-row:hover {
  background: #f8f9fa;
}

.form-id {
  font-family: monospace;
  color: #666;
}

.child-name {
  font-weight: 500;
  color: #333;
}

.date-created {
  color: #666;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.status-badge.submitted {
  background: #d4edda;
  color: #155724;
}

.status-badge.completed {
  background: #d1ecf1;
  color: #0c5460;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s;
}

.action-btn.view {
  background: #17a2b8;
  color: white;
}

.action-btn.view:hover {
  background: #138496;
}

.action-btn.edit {
  background: #ffc107;
  color: #212529;
}

.action-btn.edit:hover {
  background: #e0a800;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.action-btn.delete:hover {
  background: #c82333;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 80vw;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.modal-header h4 {
  margin: 0;
  color: #4A148C;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.form-data {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-all;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #5a6268;
}

/* Responsive Design */
@media (max-width: 768px) {
  .forms-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .forms-actions {
    justify-content: center;
    gap: 0.5rem;
  }
  
  .add-form-btn {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    flex: 1;
    justify-content: center;
  }
  
  .forms-table th,
  .forms-table td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .action-btn {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
