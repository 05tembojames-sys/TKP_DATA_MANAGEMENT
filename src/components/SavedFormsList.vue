<template>
  <div class="saved-forms-container">
    <div class="list-header">
      <h2>Saved Forms</h2>
      <div class="header-controls">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by child name or form type..."
            class="search-input"
          />
        </div>
        <select v-model="filterFormType" class="filter-select">
          <option value="">All Forms</option>
          <option value="initial-referral">Initial Referral</option>
          <option value="child-overview">Child Overview</option>
          <option value="initial-assessment">Initial Assessment</option>
          <option value="medical-intake">Medical Intake</option>
          <option value="academics-literacy">Academics & Literacy</option>
          <option value="psychological-assessment">Psychological Assessment</option>
          <option value="life-skills-survey">Life Skills Survey</option>
          <option value="birth-delivery">Birth & Delivery</option>
          <option value="care-plan-summary">Care Plan Summary</option>
          <option value="care-plan-baby">Care Plan Baby</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading forms...</p>
    </div>

    <div v-else-if="filteredForms.length === 0" class="empty-state">
      <p>No forms found. Start by creating a new form.</p>
    </div>

    <div v-else class="forms-list">
      <div
        v-for="form in filteredForms"
        :key="form.id"
        class="form-card"
        :class="{ [form.status]: true }"
      >
        <div class="card-header">
          <div class="form-info">
            <h3>{{ getChildName(form) }}</h3>
            <p class="form-type">{{ getFormTypeTitle(form.formType) }}</p>
          </div>
          <span :class="['status-badge', form.status]">
            {{ form.status || 'Draft' }}
          </span>
        </div>

        <div class="card-details">
          <div class="detail-item">
            <span class="detail-label">Created:</span>
            <span class="detail-value">{{ formatDate(form.createdAt) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Last Updated:</span>
            <span class="detail-value">{{ formatDate(form.updatedAt) }}</span>
          </div>
          <div v-if="form.age" class="detail-item">
            <span class="detail-label">Age:</span>
            <span class="detail-value">{{ form.age }} years</span>
          </div>
          <div v-if="form.gender" class="detail-item">
            <span class="detail-label">Gender:</span>
            <span class="detail-value">{{ form.gender }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button
            class="btn btn-primary"
            @click="viewForm(form)"
            title="View form details"
          >
            View
          </button>
          <button
            class="btn btn-secondary"
            @click="editForm(form)"
            title="Edit form"
          >
            Edit
          </button>
          <button
            class="btn btn-danger"
            @click="deleteForm(form.id)"
            title="Delete form"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- View Form Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>View Form</h2>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        <div class="modal-body">
          <FormDataDisplay :form="selectedForm" @close="closeViewModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from '../composables/useToast.js';
import FormDataDisplay from './FormDataDisplay.vue';

const props = defineProps({
  formType: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['edit-form']);

const { success, error } = useToast();

const forms = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const filterFormType = ref(props.formType || '');
const showViewModal = ref(false);
const selectedForm = ref(null);

// Load forms on component mount
onMounted(() => {
  loadForms();
});

const loadForms = async () => {
  loading.value = true;
  try {
    const { default: FormService } = await import('../services/formService.js');
    
    let result;
    if (filterFormType.value) {
      result = await FormService.getForms(filterFormType.value, 1000);
    } else {
      result = await FormService.getForms(null, 1000);
    }

    if (result.success) {
      forms.value = result.forms;
    } else {
      error('Failed to load forms: ' + result.error);
    }
  } catch (err) {
    console.error('Error loading forms:', err);
    error('Error loading forms. Please try again.');
  } finally {
    loading.value = false;
  }
};

const filteredForms = computed(() => {
  return forms.value.filter((form) => {
    const matchesSearch =
      searchQuery.value === '' ||
      getChildName(form).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      getFormTypeTitle(form.formType)
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    const matchesFormType =
      filterFormType.value === '' || form.formType === filterFormType.value;

    return matchesSearch && matchesFormType;
  });
});

const getFormTypeTitle = (formType) => {
  const titles = {
    'initial-referral': 'Initial Referral',
    'child-overview': 'Child Overview',
    'initial-assessment': 'Initial Assessment',
    'medical-intake': 'Medical Intake',
    'academics-literacy': 'Academics & Literacy',
    'psychological-assessment': 'Psychological Assessment',
    'life-skills-survey': 'Life Skills Survey',
    'birth-delivery': 'Birth & Delivery',
    'care-plan-summary': 'Care Plan Summary',
    'care-plan-baby': 'Care Plan Baby',
  };
  return titles[formType] || 'Unknown Form';
};

const getChildName = (form) => {
  if (form.childFirstName || form.childLastName || form.childSurname) {
    const firstName = form.childFirstName || '';
    const lastName = form.childLastName || form.childSurname || '';
    const name = `${firstName} ${lastName}`.trim();
    return name || 'Unknown Child';
  }
  return 'Unknown Child';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const viewForm = (form) => {
  selectedForm.value = form;
  showViewModal.value = true;
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedForm.value = null;
};

const editForm = (form) => {
  emit('edit-form', form);
};

const deleteForm = async (formId) => {
  if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
    return;
  }

  try {
    const { default: FormService } = await import('../services/formService.js');
    const result = await FormService.deleteForm(formId);

    if (result.success) {
      success('Form deleted successfully');
      forms.value = forms.value.filter((f) => f.id !== formId);
    } else {
      error('Failed to delete form: ' + result.error);
    }
  } catch (err) {
    console.error('Error deleting form:', err);
    error('Error deleting form. Please try again.');
  }
};
</script>

<style scoped>
.saved-forms-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-header {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  color: white;
  padding: 2rem;
  border-bottom: 3px solid #134e4a;
}

.list-header h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
}

.header-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
}

.filter-select {
  flex: 0 1 250px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #0d9488;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.forms-list {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.form-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-card:hover {
  border-color: #0d9488;
  box-shadow: 0 8px 16px rgba(13, 148, 136, 0.15);
  transform: translateY(-2px);
}

.form-card.completed {
  border-left: 4px solid #10b981;
}

.form-card.draft {
  border-left: 4px solid #f59e0b;
}

.form-card.pending {
  border-left: 4px solid #8b5cf6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.form-info h3 {
  margin: 0 0 0.35rem 0;
  color: #1f2937;
  font-size: 1.1rem;
}

.form-info .form-type {
  margin: 0;
  color: #6b7280;
  font-size: 0.85rem;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  white-space: nowrap;
  background-color: #e5e7eb;
  color: #374151;
}

.status-badge.completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.draft {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.pending {
  background-color: #ede9fe;
  color: #5b21b6;
}

.card-details {
  flex: 1;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 0.25rem;
}

.detail-value {
  color: #1f2937;
  font-size: 0.9rem;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #0d9488;
  color: white;
}

.btn-primary:hover {
  background-color: #0f766e;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.modal-body {
  padding: 2rem;
}

@media (max-width: 768px) {
  .forms-list {
    grid-template-columns: 1fr;
  }

  .header-controls {
    flex-direction: column;
  }

  .card-details {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
