<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3>Initial Child Referral Form</h3>
      <p>Complete this form to refer a child to The Kukhoma Project</p>
      
      <!-- Auto-save status indicator -->
      <div v-if="!isOutreachMode" class="auto-save-status">
        <span v-if="isSaving" class="saving">💾 Saving draft...</span>
        <span v-else-if="lastSaved" class="saved">
          ✓ Draft auto-saved at {{ new Date(lastSaved).toLocaleTimeString() }}
        </span>
        <span v-else-if="hasUnsavedChanges" class="unsaved">● Unsaved changes</span>
      </div>
      
      <div class="form-progress">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <span class="progress-text"
          >Section {{ currentSection }} of {{ totalSections }}</span
        >
      </div>
    </div>

    <div class="referral-form">
      <!-- Child Information Section -->
      <div v-show="currentSection === 1" class="form-section">
        <h4>Child Information</h4>
        <!-- Validation Message -->
        <div
          v-if="
            showValidationMessage && Object.keys(validationErrors).length > 0
          "
          class="validation-message"
        >
          <div class="validation-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li
              v-for="(error, field) in validationErrors"
              :key="field"
              class="validation-item"
            >
              {{ error }}
            </li>
          </ul>
        </div>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.childFirstName }"
          >
            <label>Child First Name *</label>
            <input
              v-model="formData.childFirstName"
              type="text"
              required
              @input="clearFieldError('childFirstName')"
              :class="{ error: validationErrors.childFirstName }"
            />
            <span v-if="validationErrors.childFirstName" class="error-message">
              {{ validationErrors.childFirstName }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.childLastName }"
          >
            <label>Child Last Name *</label>
            <input
              v-model="formData.childLastName"
              type="text"
              required
              @input="clearFieldError('childLastName')"
              :class="{ error: validationErrors.childLastName }"
            />
            <span v-if="validationErrors.childLastName" class="error-message">
              {{ validationErrors.childLastName }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.dateOfBirth }"
          >
            <label>Date of Birth *</label>
            <input
              v-model="formData.dateOfBirth"
              type="date"
              required
              @change="clearFieldError('dateOfBirth')"
              :class="{ error: validationErrors.dateOfBirth }"
            />
            <span v-if="validationErrors.dateOfBirth" class="error-message">
              {{ validationErrors.dateOfBirth }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.age }"
          >
            <label>Age (years) *</label>
            <input
              v-model="formData.age"
              type="number"
              min="0"
              max="18"
              required
              @input="clearFieldError('age')"
              :class="{ error: validationErrors.age }"
            />
            <span v-if="validationErrors.age" class="error-message">
              {{ validationErrors.age }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.dateOfReferral }"
          >
            <label>Date of Referral *</label>
            <input
              v-model="formData.dateOfReferral"
              type="date"
              required
              @change="clearFieldError('dateOfReferral')"
              :class="{ error: validationErrors.dateOfReferral }"
            />
            <span v-if="validationErrors.dateOfReferral" class="error-message">
              {{ validationErrors.dateOfReferral }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.referralMethod }"
          >
            <label>Referral Method *</label>
            <select
              v-model="formData.referralMethod"
              required
              @change="clearFieldError('referralMethod')"
              :class="{ error: validationErrors.referralMethod }"
            >
              <option value="">Select Method</option>
              <option value="Department of Social Welfare - Lusaka">
                Department of Social Welfare - Lusaka
              </option>
              <option value="Coptic Hospital">Coptic Hospital</option>
              <option value="MNK Psychotherapy">MNK Psychotherapy</option>
              <option value="Department of Social Welfare: Chongwe">
                Department of Social Welfare: Chongwe
              </option>
              <option value="Other">Other</option>
            </select>
            <span v-if="validationErrors.referralMethod" class="error-message">
              {{ validationErrors.referralMethod }}
            </span>
          </div>
        </div>
        <div class="section-navigation">
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Home Situation Section -->
      <div v-show="currentSection === 2" class="form-section">
        <h4>Home Situation</h4>
        <!-- Validation Message for Section 2 -->
        <div
          v-if="
            showValidationMessage &&
            currentSection === 2 &&
            Object.keys(validationErrors).length > 0
          "
          class="validation-message"
        >
          <div class="validation-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li
              v-for="(error, field) in validationErrors"
              :key="field"
              class="validation-item"
            >
              {{ error }}
            </li>
          </ul>
        </div>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.primaryCaregiverName }"
          >
            <label>Primary Caregiver Name *</label>
            <input
              v-model="formData.primaryCaregiverName"
              type="text"
              required
              @input="clearFieldError('primaryCaregiverName')"
              :class="{ error: validationErrors.primaryCaregiverName }"
            />
            <span
              v-if="validationErrors.primaryCaregiverName"
              class="error-message"
            >
              {{ validationErrors.primaryCaregiverName }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.relationshipToChild }"
          >
            <label>Relationship to Child *</label>
            <input
              v-model="formData.relationshipToChild"
              type="text"
              required
              @input="clearFieldError('relationshipToChild')"
              :class="{ error: validationErrors.relationshipToChild }"
            />
            <span
              v-if="validationErrors.relationshipToChild"
              class="error-message"
            >
              {{ validationErrors.relationshipToChild }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.areaOfTown }"
          >
            <label>Area of Town *</label>
            <input
              v-model="formData.areaOfTown"
              type="text"
              required
              @input="clearFieldError('areaOfTown')"
              :class="{ error: validationErrors.areaOfTown }"
            />
            <span v-if="validationErrors.areaOfTown" class="error-message">
              {{ validationErrors.areaOfTown }}
            </span>
          </div>
        </div>
        <div
          class="form-group full-width"
          :class="{ 'has-error': validationErrors.livingSituation }"
        >
          <label>Describe the Living Situation *</label>
          <textarea
            v-model="formData.livingSituation"
            rows="4"
            required
            @input="clearFieldError('livingSituation')"
            :class="{ error: validationErrors.livingSituation }"
          ></textarea>
          <span v-if="validationErrors.livingSituation" class="error-message">
            {{ validationErrors.livingSituation }}
          </span>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Pregnancy Details Section -->
      <div v-show="currentSection === 3" class="form-section">
        <h4>Pregnancy Details</h4>

        <!-- Validation Message for Section 3 -->
        <div
          v-if="
            showValidationMessage &&
            currentSection === 3 &&
            Object.keys(validationErrors).length > 0
          "
          class="validation-message"
        >
          <div class="validation-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li
              v-for="(error, field) in validationErrors"
              :key="field"
              class="validation-item"
            >
              {{ error }}
            </li>
          </ul>
        </div>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.pregnancyLength }"
          >
            <label>Current Length of Pregnancy (weeks/months) *</label>
            <input
              v-model="formData.pregnancyLength"
              type="text"
              placeholder="e.g., 12 weeks"
              required
              @input="clearFieldError('pregnancyLength')"
              :class="{ error: validationErrors.pregnancyLength }"
            />
            <span v-if="validationErrors.pregnancyLength" class="error-message">
              {{ validationErrors.pregnancyLength }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.visitedClinic }"
          >
            <label>Has the Girl Visited the Clinic? *</label>
            <select
              v-model="formData.visitedClinic"
              required
              @change="clearFieldError('visitedClinic')"
              :class="{ error: validationErrors.visitedClinic }"
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
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Details of Abuse Section -->
      <div v-show="currentSection === 4" class="form-section">
        <h4>Details of Abuse</h4>

        <!-- Validation Message for Section 4 -->
        <div
          v-if="
            showValidationMessage &&
            currentSection === 4 &&
            Object.keys(validationErrors).length > 0
          "
          class="validation-message"
        >
          <div class="validation-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li
              v-for="(error, field) in validationErrors"
              :key="field"
              class="validation-item"
            >
              {{ error }}
            </li>
          </ul>
        </div>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.typeOfAbuse }"
          >
            <label>Type of Abuse *</label>
            <select
              v-model="formData.typeOfAbuse"
              required
              @change="clearFieldError('typeOfAbuse')"
              :class="{ error: validationErrors.typeOfAbuse }"
            >
              <option value="">Select Type</option>
              <option value="Defilement">Defilement</option>
              <option value="Incest">Incest</option>
              <option value="Rape">Rape</option>
              <option value="Sex Trafficking">Sex Trafficking</option>
              <option value="Survival Prostitution">
                Survival Prostitution
              </option>
              <option value="Other">Other</option>
            </select>
            <span v-if="validationErrors.typeOfAbuse" class="error-message">
              {{ validationErrors.typeOfAbuse }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.abuserRelationship }"
          >
            <label>Abuser Relationship to Child *</label>
            <input
              v-model="formData.abuserRelationship"
              type="text"
              required
              @input="clearFieldError('abuserRelationship')"
              :class="{ error: validationErrors.abuserRelationship }"
            />
            <span
              v-if="validationErrors.abuserRelationship"
              class="error-message"
            >
              {{ validationErrors.abuserRelationship }}
            </span>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.estimatedDateOfAbuse }"
          >
            <label>Estimated Date of Abuse *</label>
            <input
              v-model="formData.estimatedDateOfAbuse"
              type="date"
              required
              @change="clearFieldError('estimatedDateOfAbuse')"
              :class="{ error: validationErrors.estimatedDateOfAbuse }"
            />
            <span
              v-if="validationErrors.estimatedDateOfAbuse"
              class="error-message"
            >
              {{ validationErrors.estimatedDateOfAbuse }}
            </span>
          </div>
        </div>
        <div
          class="form-group full-width"
          :class="{ 'has-error': validationErrors.detailsOfAbuse }"
        >
          <label>Details of Abuse *</label>
          <textarea
            v-model="formData.detailsOfAbuse"
            rows="4"
            required
            @input="clearFieldError('detailsOfAbuse')"
            :class="{ error: validationErrors.detailsOfAbuse }"
          ></textarea>
          <span v-if="validationErrors.detailsOfAbuse" class="error-message">
            {{ validationErrors.detailsOfAbuse }}
          </span>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Legal Action Section -->
      <div v-show="currentSection === 5" class="form-section">
        <h4>Legal Action</h4>

        <!-- Validation Message for Section 5 -->
        <div
          v-if="
            showValidationMessage &&
            currentSection === 5 &&
            Object.keys(validationErrors).length > 0
          "
          class="validation-message"
        >
          <div class="validation-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Please complete the following required fields:</span>
          </div>
          <ul class="validation-list">
            <li
              v-for="(error, field) in validationErrors"
              :key="field"
              class="validation-item"
            >
              {{ error }}
            </li>
          </ul>
        </div>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.legalActionTaken }"
          >
            <label>Has Any Legal Action Been Taken? *</label>
            <select
              v-model="formData.legalActionTaken"
              required
              @change="clearFieldError('legalActionTaken')"
              :class="{ error: validationErrors.legalActionTaken }"
            >
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
            <span
              v-if="validationErrors.legalActionTaken"
              class="error-message"
            >
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
          <textarea
            v-model="formData.legalActionDescription"
            rows="3"
          ></textarea>
        </div>
        <div class="form-group full-width">
          <label
            >If admitted, what additional legal action would be needed?</label
          >
          <textarea
            v-model="formData.additionalLegalAction"
            rows="3"
          ></textarea>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Mental Health Section -->
      <div v-show="currentSection === 6" class="form-section">
        <h4>Mental Health</h4>
        <div class="form-grid">
          <div class="form-group">
            <label
              >Have there been any signs of suicidal thinking or attempts?
              *</label
            >
            <select v-model="formData.suicidalThinking" required>
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div class="form-group">
            <label
              >Has the girl expressed a desire or attempted to have an abortion?
              *</label
            >
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
          <textarea
            v-model="formData.mentalHealthDescription"
            rows="3"
          ></textarea>
        </div>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Follow-Up Action Section -->
      <div v-show="currentSection === 7" class="form-section">
        <h4>Follow-Up Action (To Be Completed by TKP Staff Only)</h4>
        <div class="form-grid">
          <div class="form-group">
            <label
              >Does the referred child seem to meet TKP admission
              criteria?</label
            >
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
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button
            type="button"
            class="submit-btn"
            :disabled="loading"
            @click="handleSubmit"
          >
            {{ loading ? "Saving..." : "Save Referral" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useToast } from "../composables/useToast.js";
import { useFormAutoSave } from "../composables/useFormAutoSave.js";
import { useRoute } from "vue-router";
import { getOrGenerateChildId } from "../utils/childIdGenerator.js";

const emit = defineEmits(["form-saved"]);
const { success, error } = useToast();
const route = useRoute();

const props = defineProps({
  editData: {
    type: Object,
    default: () => ({}),
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  isOutreachMode: {
    type: Boolean,
    default: false,
  },
});

const loading = ref(false);

// Section navigation
const currentSection = ref(1);
const totalSections = 7;

const progressPercentage = computed(() => {
  return (currentSection.value / totalSections) * 100;
});

// Section validation rules
const sectionValidationRules = {
  1: [
    // Child Information
    "childFirstName",
    "childLastName",
    "dateOfBirth",
    "age",
    "dateOfReferral",
    "referralMethod",
  ],
  2: [
    // Home Situation
    "primaryCaregiverName",
    "relationshipToChild",
    "areaOfTown",
    "livingSituation",
  ],
  3: [
    // Pregnancy Details
    "pregnancyLength",
    "visitedClinic",
  ],
  4: [
    // Details of Abuse
    "typeOfAbuse",
    "abuserRelationship",
    "estimatedDateOfAbuse",
    "detailsOfAbuse",
  ],
  5: [
    // Legal Action
    "legalActionTaken",
  ],
  6: [
    // Mental Health - all optional fields
  ],
  7: [
    // Follow-Up Action - all optional fields
  ],
};

// Validation error messages
const validationErrors = ref({});
const showValidationMessage = ref(false);

// Validate current section
const validateCurrentSection = () => {
  const requiredFields = sectionValidationRules[currentSection.value] || [];
  const errors = {};
  let isValid = true;

  // Check each required field
  requiredFields.forEach((fieldName) => {
    const value = formData[fieldName];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      errors[fieldName] = getFieldDisplayName(fieldName) + " is required";
      isValid = false;
    }
  });

  validationErrors.value = errors;
  return isValid;
};

// Get user-friendly field names
const getFieldDisplayName = (fieldName) => {
  const fieldNames = {
    childFirstName: "Child First Name",
    childLastName: "Child Last Name",
    dateOfBirth: "Date of Birth",
    age: "Age",
    dateOfReferral: "Date of Referral",
    referralMethod: "Referral Method",
    primaryCaregiverName: "Primary Caregiver Name",
    relationshipToChild: "Relationship to Child",
    areaOfTown: "Area of Town",
    livingSituation: "Living Situation Description",
    pregnancyLength: "Current Length of Pregnancy",
    visitedClinic: "Has the Girl Visited the Clinic",
    typeOfAbuse: "Type of Abuse",
    abuserRelationship: "Abuser Relationship to Child",
    estimatedDateOfAbuse: "Estimated Date of Abuse",
    detailsOfAbuse: "Details of Abuse",
    legalActionTaken: "Has Any Legal Action Been Taken",
  };
  return fieldNames[fieldName] || fieldName;
};

// Clear validation error for specific field
const clearFieldError = (fieldName) => {
  if (validationErrors.value[fieldName]) {
    delete validationErrors.value[fieldName];
    validationErrors.value = { ...validationErrors.value };
  }
};

// Enhanced nextSection with validation
const nextSection = () => {
  // Validate current section before proceeding
  if (!validateCurrentSection()) {
    showValidationMessage.value = true;

    // Hide validation message after 5 seconds
    setTimeout(() => {
      showValidationMessage.value = false;
    }, 5000);

    return;
  }

  // Clear any existing validation errors
  validationErrors.value = {};
  showValidationMessage.value = false;

  if (currentSection.value < totalSections) {
    currentSection.value++;
  }
};

const prevSection = () => {
  // Clear validation errors when going back
  validationErrors.value = {};
  showValidationMessage.value = false;

  if (currentSection.value > 1) {
    currentSection.value--;
  }
};

// Form data
const formData = reactive({
  // Child Information
  childFirstName: "",
  childLastName: "",
  dateOfBirth: "",
  age: "",
  dateOfReferral: "",
  referralMethod: "",

  // Home Situation
  primaryCaregiverName: "",
  relationshipToChild: "",
  areaOfTown: "",
  livingSituation: "",

  // Pregnancy Details
  pregnancyLength: "",
  visitedClinic: "",
  clinicVisitDate: "",
  clinic: "",
  clinicDocumentation: "",
  pregnancyTestDocumentation: "",

  // Details of Abuse
  typeOfAbuse: "",
  abuserRelationship: "",
  estimatedDateOfAbuse: "",
  detailsOfAbuse: "",

  // Legal Action
  legalActionTaken: "",
  legalActionDescription: "",
  caseActive: "",
  additionalLegalAction: "",

  // Mental Health
  suicidalThinking: "",
  suicidalDescription: "",
  abortionDesire: "",
  abortionDescription: "",
  additionalMentalHealth: "",
  mentalHealthDescription: "",

  // Follow-Up Action
  meetsAdmissionCriteria: "",
  pregnant: "",
  ageRange: "",
  abuseCause: "",
  suicideAbortionPotential: "",
  familyCommitment: "",
  homeAssessmentDate: "",
  tkpStaffReceived: "",
  referrerName: "",
  contactInfo: "",
});

const handleSubmit = async (event) => {
  // Prevent default form submission
  if (event) {
    event.preventDefault();
  }

  loading.value = true;
  try {
    // Only check for duplicates if not in outreach mode
    if (!props.isOutreachMode) {
      // Check for duplicate referrals before saving
      const { default: DuplicationService } = await import(
        "../services/duplicationService.js"
      );

      const duplicateCheck = await DuplicationService.checkDuplicateReferral({
        childFirstName: formData.childFirstName,
        childLastName: formData.childLastName,
        dateOfReferral: formData.dateOfReferral,
      });

      if (duplicateCheck.hasDuplicates) {
        const highConfidenceDuplicates = duplicateCheck.duplicates.filter(
          (d) => d.confidence >= 95
        );

        if (highConfidenceDuplicates.length > 0) {
          // Show exact matches - require confirmation
          const duplicateInfo = highConfidenceDuplicates
            .map((dup) => {
              const childName = `${dup.data.childFirstName} ${dup.data.childLastName}`;
              const refDate = dup.data.dateOfReferral || "Unknown Date";
              return `• ${childName} (Referral Date: ${refDate}) - ${dup.reason}`;
            })
            .join("\n");

          const userConfirmed = confirm(
            `⚠️ DUPLICATE WARNING

A referral with similar information already exists:

${duplicateInfo}

Do you want to continue and create this referral anyway?`
          );

          if (!userConfirmed) {
            loading.value = false;
            error("Form submission cancelled to prevent duplicate referral");
            return;
          } else {
            console.warn(
              "User confirmed duplicate referral override:",
              duplicateInfo
            );
          }
        }
      }
    }

    // Use EnhancedOutreachService when in outreach mode, otherwise use FormService
    if (props.isOutreachMode) {
      // Import EnhancedOutreachService dynamically
      const { default: EnhancedOutreachService } = await import("../services/enhancedOutreachService.js");
      
      // Create form data structure for outreach service
      const outreachFormData = {
        formType: "initial-referral",
        childName: `${formData.childFirstName} ${formData.childLastName}`,
        caseId: "", // Will be generated by the service
        status: "completed",
        synced: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: { ...formData }
      };
      
      // Save to local storage via EnhancedOutreachService
      const result = await EnhancedOutreachService.saveFormLocally(outreachFormData);
      
      if (result.success) {
        // Emit success event to parent component with form data
        emit("form-saved", {
          ...outreachFormData,
          id: outreachFormData.id || Date.now().toString(), // Use existing ID or generate new one
        });
        success("Referral form saved successfully!");
        resetForm();
      } else {
        error("Error saving form: " + result.error);
      }
    } else {
      // Generate or retrieve consistent child ID
      const childId = getOrGenerateChildId({
        childFirstName: formData.childFirstName,
        childLastName: formData.childLastName,
        dateOfBirth: formData.dateOfBirth,
        tribe: formData.tribe || ''
      });
      
      console.log('📝 Saving referral with child ID:', childId);
      
      // Import FormService dynamically to avoid circular imports
      const { default: FormService } = await import("../services/formService.js");

      // Add child ID to form data
      const formDataWithId = {
        ...formData,
        childId: childId
      };

      // Pass draftId to update existing draft instead of creating new document
      const result = await FormService.saveInitialReferral(formDataWithId, draftId.value);

      if (result.success) {
        // No need to delete draft - we updated it to submitted status
        
        // Emit success event to parent component with form data
        emit("form-saved", {
          formType: "initial-referral",
          id: result.id,
          childId: childId,
          childName: `${formData.childFirstName} ${formData.childLastName}`,
          data: { ...formDataWithId },
        });
        success(`Referral saved! Child ID: ${childId}`);
        resetForm();
      } else {
        error("Error saving form: " + result.error);
      }
    }
  } catch (err) {
    console.error("Error saving form:", err);
    error("Error saving form. Please try again.");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = "";
  });
};

// Initialize auto-save functionality
const {
  isSaving,
  lastSaved,
  draftId,
  hasUnsavedChanges,
  loadDraft,
  saveNow,
  deleteDraft,
} = useFormAutoSave(formData, "initial-referral", null, 30000);

// Load existing draft if editing
onMounted(async () => {
  // Check if we're editing an existing form
  if (route.query.edit) {
    await loadDraft(route.query.edit);
  }
  
  // Load draft data if passed via props
  if (props.editData && Object.keys(props.editData).length > 0) {
    Object.keys(formData).forEach((key) => {
      if (props.editData[key] !== undefined) {
        formData[key] = props.editData[key];
      }
    });
  }
});
</script>

<style scoped>
/* Form Wrapper */
.form-wrapper {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  padding: 24px;
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
}

/* Header */
.form-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f4f6f8;
}

.form-header h3 {
  font-size: 20px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 8px 0;
}

.form-header p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

/* Auto Save Status */
.auto-save-status {
  margin-top: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.saving { color: #147cd7; }
.saved { color: #2e7d32; }
.unsaved { color: #ef6c00; }

/* Progress Bar */
.form-progress {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e8f3fa;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #147cd7;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #6c757d;
}

/* Form Section */
.form-section {
  margin-bottom: 24px;
}

.form-section h4 {
  font-size: 16px;
  font-weight: 500;
  color: #212934;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8f3fa;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 0;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #494949;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d5dde5;
  border-radius: 4px;
  font-size: 14px;
  color: #212934;
  background: white;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #147cd7;
  box-shadow: 0 0 0 3px rgba(20, 124, 215, 0.1);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

/* Validation */
.validation-message {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 24px;
}

.validation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c62828;
  font-weight: 500;
  margin-bottom: 8px;
}

.validation-list {
  margin: 0;
  padding-left: 24px;
  color: #c62828;
  font-size: 13px;
}

.has-error input,
.has-error select,
.has-error textarea {
  border-color: #ef5350;
}

.error-message {
  color: #c62828;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

/* Navigation Buttons */
.section-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f4f6f8;
}

.prev-btn,
.next-btn,
.submit-btn {
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.prev-btn {
  background: white;
  border: 1px solid #d5dde5;
  color: #494949;
}

.prev-btn:hover {
  background: #f4f6f8;
  color: #147cd7;
  border-color: #147cd7;
}

.next-btn {
  background: #147cd7;
  color: white;
}

.next-btn:hover {
  background: #1169ba;
}

.submit-btn {
  background: #2e7d32;
  color: white;
}

.submit-btn:hover {
  background: #1b5e20;
}

.submit-btn:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .section-navigation {
    flex-direction: column;
    gap: 12px;
  }
  
  .prev-btn, .next-btn, .submit-btn {
    width: 100%;
  }
}
</style>

