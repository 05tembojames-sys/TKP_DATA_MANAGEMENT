<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3>Initial Child Referral Form</h3>
      <p>Complete this form to refer a child to The Kukhoma Project</p>
      <div class="form-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <span class="progress-text">Section {{ currentSection }} of {{ totalSections }}</span>
      </div>
    </div>

    <div class="referral-form">
      <!-- Child Information Section -->
      <div v-show="currentSection === 1" class="form-section">
        <h4>Child Information</h4>
        <!-- Validation Message -->
        <div v-if="showValidationMessage && Object.keys(validationErrors).length > 0" class="validation-message">
          <div class="validation-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li v-for="(error, field) in validationErrors" :key="field" class="validation-item">
              {{ error }}
            </li>
          </ul>
        </div>

        <div class="form-grid">
          <div class="form-group" :class="{ 'has-error': validationErrors.childFirstName }">
            <label>Child First Name *</label>
            <input 
              v-model="formData.childFirstName" 
              type="text" 
              required 
              @input="clearFieldError('childFirstName')"
              :class="{ 'error': validationErrors.childFirstName }"
            />
            <span v-if="validationErrors.childFirstName" class="error-message">
              {{ validationErrors.childFirstName }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.childLastName }">
            <label>Child Last Name *</label>
            <input 
              v-model="formData.childLastName" 
              type="text" 
              required 
              @input="clearFieldError('childLastName')"
              :class="{ 'error': validationErrors.childLastName }"
            />
            <span v-if="validationErrors.childLastName" class="error-message">
              {{ validationErrors.childLastName }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.dateOfBirth }">
            <label>Date of Birth *</label>
            <input 
              v-model="formData.dateOfBirth" 
              type="date" 
              required 
              @change="clearFieldError('dateOfBirth')"
              :class="{ 'error': validationErrors.dateOfBirth }"
            />
            <span v-if="validationErrors.dateOfBirth" class="error-message">
              {{ validationErrors.dateOfBirth }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.age }">
            <label>Age (years) *</label>
            <input 
              v-model="formData.age" 
              type="number" 
              min="0" 
              max="18" 
              required 
              @input="clearFieldError('age')"
              :class="{ 'error': validationErrors.age }"
            />
            <span v-if="validationErrors.age" class="error-message">
              {{ validationErrors.age }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.dateOfReferral }">
            <label>Date of Referral *</label>
            <input 
              v-model="formData.dateOfReferral" 
              type="date" 
              required 
              @change="clearFieldError('dateOfReferral')"
              :class="{ 'error': validationErrors.dateOfReferral }"
            />
            <span v-if="validationErrors.dateOfReferral" class="error-message">
              {{ validationErrors.dateOfReferral }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.referralMethod }">
            <label>Referral Method *</label>
            <select 
              v-model="formData.referralMethod" 
              required 
              @change="clearFieldError('referralMethod')"
              :class="{ 'error': validationErrors.referralMethod }"
            >
              <option value="">Select Method</option>
              <option value="Department of Social Welfare - Lusaka">Department of Social Welfare - Lusaka</option>
              <option value="Coptic Hospital">Coptic Hospital</option>
              <option value="MNK Psychotherapy">MNK Psychotherapy</option>
              <option value="Department of Social Welfare: Chongwe">Department of Social Welfare: Chongwe</option>
              <option value="Other">Other</option>
            </select>
            <span v-if="validationErrors.referralMethod" class="error-message">
              {{ validationErrors.referralMethod }}
            </span>
          </div>
        </div>
        <div class="section-navigation">
          <button type="button" class="next-btn" @click="nextSection">Next Section ›</button>
        </div>
      </div>

      <!-- Home Situation Section -->
      <div v-show="currentSection === 2" class="form-section">
        <h4>Home Situation</h4>
        <!-- Validation Message for Section 2 -->
        <div v-if="showValidationMessage && currentSection === 2 && Object.keys(validationErrors).length > 0" class="validation-message">
          <div class="validation-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li v-for="(error, field) in validationErrors" :key="field" class="validation-item">
              {{ error }}
            </li>
          </ul>
        </div>

        <div class="form-grid">
          <div class="form-group" :class="{ 'has-error': validationErrors.primaryCaregiverName }">
            <label>Primary Caregiver Name *</label>
            <input 
              v-model="formData.primaryCaregiverName" 
              type="text" 
              required 
              @input="clearFieldError('primaryCaregiverName')"
              :class="{ 'error': validationErrors.primaryCaregiverName }"
            />
            <span v-if="validationErrors.primaryCaregiverName" class="error-message">
              {{ validationErrors.primaryCaregiverName }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.relationshipToChild }">
            <label>Relationship to Child *</label>
            <input 
              v-model="formData.relationshipToChild" 
              type="text" 
              required 
              @input="clearFieldError('relationshipToChild')"
              :class="{ 'error': validationErrors.relationshipToChild }"
            />
            <span v-if="validationErrors.relationshipToChild" class="error-message">
              {{ validationErrors.relationshipToChild }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.areaOfTown }">
            <label>Area of Town *</label>
            <input 
              v-model="formData.areaOfTown" 
              type="text" 
              required 
              @input="clearFieldError('areaOfTown')"
              :class="{ 'error': validationErrors.areaOfTown }"
            />
            <span v-if="validationErrors.areaOfTown" class="error-message">
              {{ validationErrors.areaOfTown }}
            </span>
          </div>
        </div>
        <div class="form-group full-width" :class="{ 'has-error': validationErrors.livingSituation }">
          <label>Describe the Living Situation *</label>
          <textarea 
            v-model="formData.livingSituation" 
            rows="4" 
            required 
            @input="clearFieldError('livingSituation')"
            :class="{ 'error': validationErrors.livingSituation }"
          ></textarea>
          <span v-if="validationErrors.livingSituation" class="error-message">
            {{ validationErrors.livingSituation }}
          </span>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">‹ Previous Section</button>
          <button type="button" class="next-btn" @click="nextSection">Next Section ›</button>
        </div>
      </div>

      <!-- Pregnancy Details Section -->
      <div v-show="currentSection === 3" class="form-section">
        <h4>Pregnancy Details</h4>
        
        <!-- Validation Message for Section 3 -->
        <div v-if="showValidationMessage && currentSection === 3 && Object.keys(validationErrors).length > 0" class="validation-message">
          <div class="validation-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li v-for="(error, field) in validationErrors" :key="field" class="validation-item">
              {{ error }}
            </li>
          </ul>
        </div>
        
        <div class="form-grid">
          <div class="form-group" :class="{ 'has-error': validationErrors.pregnancyLength }">
            <label>Current Length of Pregnancy (weeks/months) *</label>
            <input 
              v-model="formData.pregnancyLength" 
              type="text" 
              placeholder="e.g., 12 weeks" 
              required 
              @input="clearFieldError('pregnancyLength')"
              :class="{ 'error': validationErrors.pregnancyLength }"
            />
            <span v-if="validationErrors.pregnancyLength" class="error-message">
              {{ validationErrors.pregnancyLength }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.visitedClinic }">
            <label>Has the Girl Visited the Clinic? *</label>
            <select 
              v-model="formData.visitedClinic" 
              required 
              @change="clearFieldError('visitedClinic')"
              :class="{ 'error': validationErrors.visitedClinic }"
            >
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
            <span v-if="validationErrors.visitedClinic" class="error-message">
              {{ validationErrors.visitedClinic }}
            </span>
          </div>
          <div class="form-group">
            <label>Date of Clinic Visit</label>
            <input v-model="formData.clinicVisitDate" type="date" />
          </div>
          <div class="form-group">
            <label>Clinic</label>
            <input v-model="formData.clinic" type="text" />
          </div>
          <div class="form-group">
            <label>Documentation of Clinic Visit?</label>
            <select v-model="formData.clinicDocumentation">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div class="form-group">
            <label>Documentation of Pregnancy Test?</label>
            <select v-model="formData.pregnancyTestDocumentation">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">‹ Previous Section</button>
          <button type="button" class="next-btn" @click="nextSection">Next Section ›</button>
        </div>
      </div>

      <!-- Details of Abuse Section -->
      <div v-show="currentSection === 4" class="form-section">
        <h4>Details of Abuse</h4>
        
        <!-- Validation Message for Section 4 -->
        <div v-if="showValidationMessage && currentSection === 4 && Object.keys(validationErrors).length > 0" class="validation-message">
          <div class="validation-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li v-for="(error, field) in validationErrors" :key="field" class="validation-item">
              {{ error }}
            </li>
          </ul>
        </div>
        
        <div class="form-grid">
          <div class="form-group" :class="{ 'has-error': validationErrors.typeOfAbuse }">
            <label>Type of Abuse *</label>
            <select 
              v-model="formData.typeOfAbuse" 
              required 
              @change="clearFieldError('typeOfAbuse')"
              :class="{ 'error': validationErrors.typeOfAbuse }"
            >
              <option value="">Select Type</option>
              <option value="Defilement">Defilement</option>
              <option value="Incest">Incest</option>
              <option value="Rape">Rape</option>
              <option value="Sex Trafficking">Sex Trafficking</option>
              <option value="Survival Prostitution">Survival Prostitution</option>
              <option value="Other">Other</option>
            </select>
            <span v-if="validationErrors.typeOfAbuse" class="error-message">
              {{ validationErrors.typeOfAbuse }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.abuserRelationship }">
            <label>Abuser Relationship to Child *</label>
            <input 
              v-model="formData.abuserRelationship" 
              type="text" 
              required 
              @input="clearFieldError('abuserRelationship')"
              :class="{ 'error': validationErrors.abuserRelationship }"
            />
            <span v-if="validationErrors.abuserRelationship" class="error-message">
              {{ validationErrors.abuserRelationship }}
            </span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.estimatedDateOfAbuse }">
            <label>Estimated Date of Abuse *</label>
            <input 
              v-model="formData.estimatedDateOfAbuse" 
              type="date" 
              required 
              @change="clearFieldError('estimatedDateOfAbuse')"
              :class="{ 'error': validationErrors.estimatedDateOfAbuse }"
            />
            <span v-if="validationErrors.estimatedDateOfAbuse" class="error-message">
              {{ validationErrors.estimatedDateOfAbuse }}
            </span>
          </div>
        </div>
        <div class="form-group full-width" :class="{ 'has-error': validationErrors.detailsOfAbuse }">
          <label>Details of Abuse *</label>
          <textarea 
            v-model="formData.detailsOfAbuse" 
            rows="4" 
            required 
            @input="clearFieldError('detailsOfAbuse')"
            :class="{ 'error': validationErrors.detailsOfAbuse }"
          ></textarea>
          <span v-if="validationErrors.detailsOfAbuse" class="error-message">
            {{ validationErrors.detailsOfAbuse }}
          </span>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">‹ Previous Section</button>
          <button type="button" class="next-btn" @click="nextSection">Next Section ›</button>
        </div>
      </div>

      <!-- Legal Action Section -->
      <div v-show="currentSection === 5" class="form-section">
        <h4>Legal Action</h4>
        
        <!-- Validation Message for Section 5 -->
        <div v-if="showValidationMessage && currentSection === 5 && Object.keys(validationErrors).length > 0" class="validation-message">
          <div class="validation-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li v-for="(error, field) in validationErrors" :key="field" class="validation-item">
              {{ error }}
            </li>
          </ul>
        </div>
        
        <div class="form-grid">
          <div class="form-group" :class="{ 'has-error': validationErrors.legalActionTaken }">
            <label>Has Any Legal Action Been Taken? *</label>
            <select 
              v-model="formData.legalActionTaken" 
              required 
              @change="clearFieldError('legalActionTaken')"
              :class="{ 'error': validationErrors.legalActionTaken }"
            >
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
            <span v-if="validationErrors.legalActionTaken" class="error-message">
              {{ validationErrors.legalActionTaken }}
            </span>
          </div>
          <div class="form-group">
            <label>Is the Case Still Active?</label>
            <select v-model="formData.caseActive">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
        </div>
        <div class="form-group full-width">
          <label>Description</label>
          <textarea v-model="formData.legalActionDescription" rows="3"></textarea>
        </div>
        <div class="form-group full-width">
          <label>If admitted, what additional legal action would be needed?</label>
          <textarea v-model="formData.additionalLegalAction" rows="3"></textarea>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">‹ Previous Section</button>
          <button type="button" class="next-btn" @click="nextSection">Next Section ›</button>
        </div>
      </div>

      <!-- Mental Health Section -->
      <div v-show="currentSection === 6" class="form-section">
        <h4>Mental Health</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Have there been any signs of suicidal thinking or attempts? *</label>
            <select v-model="formData.suicidalThinking" required>
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div class="form-group">
            <label>Has the girl expressed a desire or attempted to have an abortion? *</label>
            <select v-model="formData.abortionDesire" required>
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div class="form-group">
            <label>Any additional mental health concerns?</label>
            <select v-model="formData.additionalMentalHealth">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
        </div>
        <div class="form-group full-width">
          <label>Description of suicidal thinking/attempts</label>
          <textarea v-model="formData.suicidalDescription" rows="3"></textarea>
        </div>
        <div class="form-group full-width">
          <label>Description of abortion desire/attempts</label>
          <textarea v-model="formData.abortionDescription" rows="3"></textarea>
        </div>
        <div class="form-group full-width">
          <label>Description of additional mental health concerns</label>
          <textarea v-model="formData.mentalHealthDescription" rows="3"></textarea>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">‹ Previous Section</button>
          <button type="button" class="next-btn" @click="nextSection">Next Section ›</button>
        </div>
      </div>

      <!-- Follow-Up Action Section -->
      <div v-show="currentSection === 7" class="form-section">
        <h4>Follow-Up Action (To Be Completed by TKP Staff Only)</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Does the referred child seem to meet TKP admission criteria?</label>
            <select v-model="formData.meetsAdmissionCriteria">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div class="form-group">
            <label>Pregnant</label>
            <select v-model="formData.pregnant">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div class="form-group">
            <label>Age (11-15)</label>
            <select v-model="formData.ageRange">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div class="form-group">
            <label>Cause of Pregnancy - abuse/prostitution</label>
            <select v-model="formData.abuseCause">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div class="form-group">
            <label>Potential of Suicide or Abortion</label>
            <select v-model="formData.suicideAbortionPotential">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div class="form-group">
            <label>Family Commitment to Program</label>
            <select v-model="formData.familyCommitment">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div class="form-group">
            <label>If yes, scheduled date of home assessment</label>
            <input v-model="formData.homeAssessmentDate" type="date" />
          </div>
          <div class="form-group">
            <label>TKP Staff Received</label>
            <input v-model="formData.tkpStaffReceived" type="text" />
          </div>
          <div class="form-group">
            <label>Name of Referrer</label>
            <input v-model="formData.referrerName" type="text" />
          </div>
          <div class="form-group">
            <label>Contact Info</label>
            <input v-model="formData.contactInfo" type="text" />
          </div>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">‹ Previous Section</button>
          <button type="button" class="submit-btn" :disabled="loading" @click="handleSubmit">
            {{ loading ? 'Saving...' : 'Save Referral' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from '../composables/useToast.js'

const emit = defineEmits(['form-saved'])
const { success, error } = useToast()

const loading = ref(false)

// Section navigation
const currentSection = ref(1)
const totalSections = 7

const progressPercentage = computed(() => {
  return (currentSection.value / totalSections) * 100
})

// Section validation rules
const sectionValidationRules = {
  1: [ // Child Information
    'childFirstName',
    'childLastName', 
    'dateOfBirth',
    'age',
    'dateOfReferral',
    'referralMethod'
  ],
  2: [ // Home Situation
    'primaryCaregiverName',
    'relationshipToChild',
    'areaOfTown',
    'livingSituation'
  ],
  3: [ // Pregnancy Details
    'pregnancyLength',
    'visitedClinic'
  ],
  4: [ // Details of Abuse
    'typeOfAbuse',
    'abuserRelationship',
    'estimatedDateOfAbuse',
    'detailsOfAbuse'
  ],
  5: [ // Legal Action
    'legalActionTaken'
  ],
  6: [ // Mental Health - all optional fields
  ],
  7: [ // Follow-Up Action - all optional fields
  ]
}

// Validation error messages
const validationErrors = ref({})
const showValidationMessage = ref(false)

// Validate current section
const validateCurrentSection = () => {
  const requiredFields = sectionValidationRules[currentSection.value] || []
  const errors = {}
  let isValid = true

  // Check each required field
  requiredFields.forEach(fieldName => {
    const value = formData[fieldName]
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[fieldName] = getFieldDisplayName(fieldName) + ' is required'
      isValid = false
    }
  })

  validationErrors.value = errors
  return isValid
}

// Get user-friendly field names
const getFieldDisplayName = (fieldName) => {
  const fieldNames = {
    childFirstName: 'Child First Name',
    childLastName: 'Child Last Name',
    dateOfBirth: 'Date of Birth',
    age: 'Age',
    dateOfReferral: 'Date of Referral',
    referralMethod: 'Referral Method',
    primaryCaregiverName: 'Primary Caregiver Name',
    relationshipToChild: 'Relationship to Child',
    areaOfTown: 'Area of Town',
    livingSituation: 'Living Situation Description',
    pregnancyLength: 'Current Length of Pregnancy',
    visitedClinic: 'Has the Girl Visited the Clinic',
    typeOfAbuse: 'Type of Abuse',
    abuserRelationship: 'Abuser Relationship to Child',
    estimatedDateOfAbuse: 'Estimated Date of Abuse',
    detailsOfAbuse: 'Details of Abuse',
    legalActionTaken: 'Has Any Legal Action Been Taken'
  }
  return fieldNames[fieldName] || fieldName
}

// Clear validation error for specific field
const clearFieldError = (fieldName) => {
  if (validationErrors.value[fieldName]) {
    delete validationErrors.value[fieldName]
    validationErrors.value = { ...validationErrors.value }
  }
}

// Enhanced nextSection with validation
const nextSection = () => {
  // Validate current section before proceeding
  if (!validateCurrentSection()) {
    showValidationMessage.value = true
    
    // Hide validation message after 5 seconds
    setTimeout(() => {
      showValidationMessage.value = false
    }, 5000)
    
    return
  }
  
  // Clear any existing validation errors
  validationErrors.value = {}
  showValidationMessage.value = false
  
  if (currentSection.value < totalSections) {
    currentSection.value++
  }
}

const prevSection = () => {
  // Clear validation errors when going back
  validationErrors.value = {}
  showValidationMessage.value = false
  
  if (currentSection.value > 1) {
    currentSection.value--
  }
}

// Form data
const formData = reactive({
  // Child Information
  childFirstName: '',
  childLastName: '',
  dateOfBirth: '',
  age: '',
  dateOfReferral: '',
  referralMethod: '',
  
  // Home Situation
  primaryCaregiverName: '',
  relationshipToChild: '',
  areaOfTown: '',
  livingSituation: '',
  
  // Pregnancy Details
  pregnancyLength: '',
  visitedClinic: '',
  clinicVisitDate: '',
  clinic: '',
  clinicDocumentation: '',
  pregnancyTestDocumentation: '',
  
  // Details of Abuse
  typeOfAbuse: '',
  abuserRelationship: '',
  estimatedDateOfAbuse: '',
  detailsOfAbuse: '',
  
  // Legal Action
  legalActionTaken: '',
  legalActionDescription: '',
  caseActive: '',
  additionalLegalAction: '',
  
  // Mental Health
  suicidalThinking: '',
  suicidalDescription: '',
  abortionDesire: '',
  abortionDescription: '',
  additionalMentalHealth: '',
  mentalHealthDescription: '',
  
  // Follow-Up Action
  meetsAdmissionCriteria: '',
  pregnant: '',
  ageRange: '',
  abuseCause: '',
  suicideAbortionPotential: '',
  familyCommitment: '',
  homeAssessmentDate: '',
  tkpStaffReceived: '',
  referrerName: '',
  contactInfo: ''
})

const handleSubmit = async (event) => {
  // Prevent default form submission
  if (event) {
    event.preventDefault()
  }
  
  loading.value = true
  try {
    // Import FormService dynamically to avoid circular imports
    const { default: FormService } = await import('../services/formService.js')
    
    const result = await FormService.saveInitialReferral(formData)
    
    if (result.success) {
      // Emit success event to parent component
      emit('form-saved', { formType: 'initial-referral', id: result.id })
      success('Referral form saved successfully!')
      resetForm()
    } else {
      error('Error saving form: ' + result.error)
    }
  } catch (err) {
    console.error('Error saving form:', err)
    error('Error saving form. Please try again.')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
}
</script>

<style scoped>
.form-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #4A148C;
}

.form-header h3 {
  color: #4A148C;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
  font-size: 1rem;
}

.form-progress {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A148C, #2D1B69);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #4A148C;
  font-weight: 500;
  text-align: center;
}

.referral-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4A148C;
}

.form-section h4 {
  color: #4A148C;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  color: #4A148C;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4A148C;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.section-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}

.prev-btn,
.next-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;
}

.prev-btn {
  background: #6c757d;
  color: white;
}

.prev-btn:hover {
  background: #5a6268;
}

.next-btn {
  background: #4A148C;
  color: white;
}

.next-btn:hover {
  background: #2D1B69;
}

.submit-btn {
  background: #28a745;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;
}

.submit-btn:hover:not(:disabled) {
  background: #218838;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.submit-btn {
  background-color: #4A148C;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2D1B69;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

/* Validation Styles */
.validation-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #721c24;
}

.validation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.validation-header svg {
  color: #dc3545;
}

.validation-list {
  margin: 0;
  padding-left: 1.5rem;
}

.validation-item {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.form-group.has-error label {
  color: #dc3545;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #dc3545;
  background-color: #f8d7da;
}

.form-group input.error:focus,
.form-group select.error:focus,
.form-group textarea.error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-section {
    padding: 1rem;
  }
}
</style>
