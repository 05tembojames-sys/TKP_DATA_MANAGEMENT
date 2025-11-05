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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="form in forms" :key="form.id" class="form-row">
              <td class="form-id">{{ form.formDataId || form.childId || form.id.substring(0, 8) + '...' }}</td>
              <td class="child-name">
                {{ getChildName(form) }}
              </td>
              <td class="date-created">
                {{ formatDate(form.createdAt) }}
              </td>
              <td class="actions">
                <button @click="viewForm(form)" class="action-btn view" :disabled="loading" :class="{ loading: loading }">
                  <span>View</span>
                </button>
                <button @click="editForm(form)" class="action-btn edit" :disabled="loading" :class="{ loading: loading }">
                  <span>Edit</span>
                </button>
                <button @click="deleteForm(form)" class="action-btn delete" :disabled="loading" :class="{ loading: loading }">
                  <span>Delete</span>
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
        <FormDataDisplay :form="selectedForm" @close="closeModal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '../composables/useToast.js'
import FormService from '../services/formService.js'
import Pagination from './Pagination.vue'
import FormDataDisplay from './FormDataDisplay.vue'

const props = defineProps({
  formType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['form-selected', 'form-edit', 'add-new-form'])
const { success, error } = useToast()

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
  // Add a check to ensure form has an ID
  if (!form || !form.id) {
    error('Cannot view form: Invalid form data')
    return
  }
  
  selectedForm.value = form
  console.log('Viewing form:', form.id)
}

const editForm = async (form) => {
  // Add a check to ensure form has an ID
  if (!form || !form.id) {
    error('Cannot edit form: Invalid form data')
    return
  }
  
  // Check if form is in draft status - only drafts should be editable
  if (form.status && form.status.toLowerCase() !== 'draft') {
    const confirmed = window.confirm(
      `This form is already ${form.status}. Editing completed forms may affect data integrity. Do you want to continue?`
    )
    
    if (!confirmed) {
      return
    }
  }
  
  // Provide user feedback that edit is being initiated
  console.log('Editing form:', form.id)
  
  // Show loading indicator
  loading.value = true
  
  try {
    // Emit the form-edit event with the form data
    emit('form-edit', form)
    success('Opening form for editing...')
  } catch (err) {
    console.error('Error initiating form edit:', err)
    error('Failed to open form for editing. Please try again.')
  } finally {
    loading.value = false
  }
}

const deleteForm = async (form) => {
  // Validate form data
  if (!form || !form.id) {
    error('Cannot delete form: Invalid form data')
    return
  }
  
  // Show more detailed confirmation with form information
  const childName = getChildName(form)
  
  // Use native browser confirm as fallback
  const confirmMessage = `Are you sure you want to delete the form for ${childName}?\n\nThis action cannot be undone.\n\nForm ID: ${form.id}\nDate Created: ${formatDate(form.createdAt)}`
  const confirmed = window.confirm(confirmMessage)
  
  if (!confirmed) {
    return
  }
  
  // Show loading state
  loading.value = true
  
  try {
    console.log('Attempting to delete form with ID:', form.id)
    const result = await FormService.deleteForm(form.id)
    console.log('Delete result:', result)
    
    if (result.success) {
      // Remove from local list - create new array to ensure reactivity
      forms.value = forms.value.filter(f => f.id !== form.id)
      
      // Update total items count
      totalItems.value = forms.value.length
      
      console.log('Form removed from list. Remaining forms:', forms.value.length)
      success(`Form for ${childName} deleted successfully!`)
    } else {
      console.error('Delete failed:', result.error)
      error('Error deleting form: ' + result.error)
    }
  } catch (err) {
    console.error('Error deleting form:', err)
    error('Error deleting form. Please try again.')
  } finally {
    loading.value = false
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
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(74, 20, 140, 0.12);
  overflow: hidden;
  border: 1px solid rgba(74, 20, 140, 0.08);
}

.forms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  position: relative;
  overflow: hidden;
}

.forms-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.forms-header h3 {
  color: #ffffff;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.forms-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  z-index: 1;
}

.refresh-btn,
.export-btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.refresh-btn::before,
.export-btn::before,
.add-form-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.refresh-btn:hover::before,
.export-btn:hover::before,
.add-form-btn:hover::after {
  width: 300px;
  height: 300px;
}

.refresh-btn:hover:not(:disabled),
.export-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.refresh-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  color: #4A148C;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-color: rgba(255, 255, 255, 0.5);
}

.export-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.export-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1abc9c 100%);
  border-color: rgba(255, 255, 255, 0.5);
}

.add-form-btn {
  background: linear-gradient(135deg, #FF5722 0%, #FF6F3C 100%);
  color: white;
  padding: 0.625rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-form-btn::before {
  content: '+';
  font-size: 1.3rem;
  font-weight: bold;
  position: relative;
  z-index: 1;
}

.add-form-btn span {
  position: relative;
  z-index: 1;
}

.add-form-btn:hover {
  background: linear-gradient(135deg, #FF6F3C 0%, #FF8A65 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(255, 87, 34, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}

.add-form-btn:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
}

.refresh-btn:disabled,
.export-btn:disabled {
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
  cursor: not-allowed;
  opacity: 0.6;
  border-color: transparent;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  margin: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(74, 20, 140, 0.1);
  border-top: 5px solid #4A148C;
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 12px rgba(74, 20, 140, 0.2);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-state h4 {
  color: #4A148C;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.forms-table-container {
  overflow-x: auto;
  margin: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.forms-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.forms-table th {
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  color: white;
  padding: 1.25rem 1rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.forms-table th:first-child {
  border-top-left-radius: 12px;
}

.forms-table th:last-child {
  border-top-right-radius: 12px;
}

.forms-table td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  background: white;
  transition: all 0.3s ease;
}

.form-row {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-row:hover {
  background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);
  box-shadow: 0 2px 8px rgba(74, 20, 140, 0.08);
  transform: scale(1.01);
}

.form-row:hover td {
  background: transparent;
}

.form-id {
  font-family: 'Courier New', monospace;
  color: #6c757d;
  font-size: 0.85rem;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.child-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.date-created {
  color: #6c757d;
  font-size: 0.9rem;
}

.status {
  text-align: center;
  padding: 1rem;
  vertical-align: middle;
}

.status .status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  padding: 0.5rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.status .status-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.status-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.status-badge.draft {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: #212529;
  border: 2px solid rgba(255, 193, 7, 0.5);
  font-weight: 800;
  animation: pulse 2s infinite;
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.edit-indicator {
  margin-left: 5px;
  font-size: 1rem;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.status-badge.submitted,
.status-badge.completed {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: #ffffff;
  border: 2px solid rgba(40, 167, 69, 0.3);
  animation: none; /* Remove animation for submitted status */
}

.actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.action-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.action-btn:hover::before {
  width: 200px;
  height: 200px;
}

.action-btn.view {
  background: linear-gradient(135deg, #17a2b8 0%, #3498db 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(23, 162, 184, 0.3);
}

.action-btn.view:hover {
  background: linear-gradient(135deg, #138496 0%, #2980b9 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.action-btn.edit {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: #212529;
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.4);
  font-weight: 700;
  letter-spacing: 0.7px;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.action-btn.edit:hover {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.5);
  border-color: rgba(255, 255, 255, 0.6);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.action-btn.edit:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 4px rgba(255, 193, 7, 0.3);
}

.action-btn.delete {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

.action-btn.delete:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.action-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.action-btn.loading {
  position: relative;
  pointer-events: none;
}

.action-btn.loading::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  top: 50%;
  left: 50%;
  margin-top: -6px;
  margin-left: -6px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: button-spin 1s linear infinite;
}

@keyframes button-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(74, 20, 140, 0.1);
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid rgba(74, 20, 140, 0.1);
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
}

.modal-header h4 {
  margin: 0;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%);
}

.form-data {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: pre-wrap;
  word-break: break-all;
  border: 2px solid rgba(74, 20, 140, 0.1);
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 2px solid rgba(74, 20, 140, 0.1);
  background: #f8f9fa;
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  padding: 0.625rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .forms-header {
    padding: 1.5rem;
  }
  
  .forms-header h3 {
    font-size: 1.5rem;
  }
  
  .forms-table-container {
    margin: 1rem;
  }
}

@media (max-width: 768px) {
  .forms-header {
    flex-direction: column;
    gap: 1.25rem;
    align-items: stretch;
    padding: 1.5rem 1rem;
  }
  
  .forms-header h3 {
    font-size: 1.25rem;
    text-align: center;
  }
  
  .forms-actions {
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .refresh-btn,
  .export-btn {
    flex: 1;
    min-width: 100px;
  }
  
  .add-form-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
    width: 100%;
    justify-content: center;
  }
  
  .forms-table-container {
    margin: 1rem 0.5rem;
  }
  
  .forms-table th,
  .forms-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .forms-table th {
    font-size: 0.75rem;
  }
  
  .form-id {
    font-size: 0.75rem;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  
  .action-btn {
    padding: 0.625rem;
    font-size: 0.75rem;
    width: 100%;
  }
  
  .status-badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.75rem;
  }
  
  .modal-content {
    max-width: 95vw;
    max-height: 90vh;
    border-radius: 12px;
  }
  
  .modal-header,
  .modal-footer {
    padding: 1rem 1.25rem;
  }
  
  .modal-body {
    padding: 1.25rem;
  }
  
  .loading-state,
  .empty-state {
    padding: 3rem 1rem;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .forms-header h3 {
    font-size: 1.1rem;
  }
  
  .forms-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .refresh-btn,
  .export-btn {
    width: 100%;
  }
  
  .forms-table th,
  .forms-table td {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .empty-state h4 {
    font-size: 1.25rem;
  }
}
</style>
