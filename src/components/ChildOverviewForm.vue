<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3>Child Overview and Background (TKP Care Plan)</h3>
      <p>
        Complete this form to document child information and background details
      </p>
      
      <!-- Auto-save status indicator -->
      <div v-if="!isOutreachMode && !isViewMode" class="auto-save-status">
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
        <div class="progress-info">
          <span class="progress-text"
            >Section {{ currentSection }} of {{ totalSections }} •
            {{ overallCompletion }}% Complete</span
          >
          <span class="section-title">{{ currentSectionName }}</span>
          <div class="section-status">
            <span
              class="status-indicator"
              :class="{ complete: sectionCompletionStatus[currentSection - 1] }"
            >
              {{ sectionCompletionStatus[currentSection - 1] ? "✓" : "○" }}
              {{ currentSection <= 5 ? "Required" : "Optional" }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Message -->
    <div
      v-if="showValidationMessage && Object.keys(validationErrors).length > 0"
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

    <div class="overview-form">
      <!-- Child Information Section -->
      <div v-show="currentSection === 1" class="form-section">
        <h4>Child Information</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Child First Name *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.childFirstName) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.childFirstName"
              type="text"
              required
              @input="clearFieldError('childFirstName')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.childFirstName"
              class="error-message"
            >
              {{ validationErrors.childFirstName }}
            </div>
          </div>
          <div class="form-group">
            <label>Child Middle Name</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.childMiddleName) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.childMiddleName"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Child Surname *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.childSurname) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.childSurname"
              type="text"
              required
              @input="clearFieldError('childSurname')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.childSurname"
              class="error-message"
            >
              {{ validationErrors.childSurname }}
            </div>
          </div>
          <div class="form-group">
            <label>Other First Name</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.otherFirstName) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.otherFirstName"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Other Middle Name</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.otherMiddleName) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.otherMiddleName"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Other Surname</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.otherSurname) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.otherSurname"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>ID *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.id) }}</div>
            </template>
            <input
              v-else
              v-model="formData.id"
              type="text"
              required
              @input="clearFieldError('id')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.id"
              class="error-message"
            >
              {{ validationErrors.id }}
            </div>
          </div>
          <div class="form-group">
            <label>Date of Admission *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ formatDate(formData.dateOfAdmission) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.dateOfAdmission"
              type="date"
              required
              @input="clearFieldError('dateOfAdmission')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.dateOfAdmission"
              class="error-message"
            >
              {{ validationErrors.dateOfAdmission }}
            </div>
          </div>
          <div class="form-group">
            <label>Gender *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.gender) }}
              </div>
            </template>
            <select
              v-else
              v-model="formData.gender"
              required
              @change="clearFieldError('gender')"
              :disabled="isViewMode"
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
            <div
              v-if="!isViewMode && validationErrors.gender"
              class="error-message"
            >
              {{ validationErrors.gender }}
            </div>
          </div>
          <div class="form-group">
            <label>Date of Birth *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ formatDate(formData.dateOfBirth) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.dateOfBirth"
              type="date"
              required
              @input="clearFieldError('dateOfBirth')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.dateOfBirth"
              class="error-message"
            >
              {{ validationErrors.dateOfBirth }}
            </div>
          </div>
          <div class="form-group">
            <label>Age at Intake (years) *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.ageAtIntake) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.ageAtIntake"
              type="number"
              min="0"
              max="18"
              required
              @input="clearFieldError('ageAtIntake')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.ageAtIntake"
              class="error-message"
            >
              {{ validationErrors.ageAtIntake }}
            </div>
          </div>
          <div class="form-group">
            <label>Place of Birth *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.placeOfBirth) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.placeOfBirth"
              type="text"
              required
              @input="clearFieldError('placeOfBirth')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.placeOfBirth"
              class="error-message"
            >
              {{ validationErrors.placeOfBirth }}
            </div>
          </div>
          <div class="form-group">
            <label>Resident Area at Intake *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.residentArea) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.residentArea"
              type="text"
              required
              @input="clearFieldError('residentArea')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.residentArea"
              class="error-message"
            >
              {{ validationErrors.residentArea }}
            </div>
          </div>
          <div class="form-group">
            <label>Village</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.village) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.village"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Chief</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.chief) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.chief"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>District *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.district) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.district"
              type="text"
              required
              @input="clearFieldError('district')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.district"
              class="error-message"
            >
              {{ validationErrors.district }}
            </div>
          </div>
          <div class="form-group">
            <label>Tribe</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.tribe) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.tribe"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Denomination</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.denomination) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.denomination"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Nationality *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.nationality) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.nationality"
              type="text"
              required
              @input="clearFieldError('nationality')"
              :disabled="isViewMode"
            />
            <div
              v-if="!isViewMode && validationErrors.nationality"
              class="error-message"
            >
              {{ validationErrors.nationality }}
            </div>
          </div>
        </div>
        <div class="section-navigation">
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Vulnerability Status Section -->
      <div v-show="currentSection === 2" class="form-section">
        <h4>Vulnerability Status</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>OVC Status *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.ovcStatus) }}
              </div>
            </template>
            <select
              v-else
              v-model="formData.ovcStatus"
              required
              @change="clearFieldError('ovcStatus')"
              :disabled="isViewMode"
            >
              <option value="">Select Status</option>
              <option value="Vulnerable">Vulnerable</option>
              <option value="Single Orphan">Single Orphan</option>
              <option value="Double Orphan">Double Orphan</option>
              <option value="Serial Orphan">Serial Orphan</option>
            </select>
            <div
              v-if="!isViewMode && validationErrors.ovcStatus"
              class="error-message"
            >
              {{ validationErrors.ovcStatus }}
            </div>
          </div>
          <div class="form-group">
            <label>Date Effective</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ formatDate(formData.ovcDateEffective) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.ovcDateEffective"
              type="date"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Parent Deceased</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.parentDeceased) }}
              </div>
            </template>
            <select
              v-else
              v-model="formData.parentDeceased"
              :disabled="isViewMode"
            >
              <option value="">Select</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Both">Both</option>
              <option value="Neither">Neither</option>
            </select>
          </div>
          <div class="form-group">
            <label>Date of Death</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ formatDate(formData.parentDeathDate) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.parentDeathDate"
              type="date"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Guardian Deceased</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.guardianDeceased) }}
              </div>
            </template>
            <select
              v-else
              v-model="formData.guardianDeceased"
              :disabled="isViewMode"
            >
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div class="form-group">
            <label>Guardian Date of Death</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ formatDate(formData.guardianDeathDate) }}
              </div>
            </template>
            <input
              v-else
              v-model="formData.guardianDeathDate"
              type="date"
              :disabled="isViewMode"
            />
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

      <!-- Biological Parents Section -->
      <div v-show="currentSection === 3" class="form-section">
        <!-- Biological Father -->
        <h5>Biological Father</h5>
        <div class="form-grid">
          <div class="form-group">
            <label>Name</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalFather.name) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalFather.name"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Age</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalFather.age) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalFather.age"
              type="number"
              min="0"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Alive / Deceased</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalFather.status) }}</div>
            </template>
            <select
              v-else
              v-model="formData.biologicalFather.status"
              :disabled="isViewMode"
            >
              <option value="">Select</option>
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div class="form-group">
            <label>If deceased, date of death</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ formatDate(formData.biologicalFather.deathDate) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalFather.deathDate"
              type="date"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Cause of death</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalFather.causeOfDeath) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalFather.causeOfDeath"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Location</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalFather.location) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalFather.location"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Profession</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalFather.profession) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalFather.profession"
              type="text"
              :disabled="isViewMode"
            />
          </div>
        </div>

        <!-- Biological Mother -->
        <h5>Biological Mother</h5>
        <div class="form-grid">
          <div class="form-group">
            <label>Name</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalMother.name) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalMother.name"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Age</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalMother.age) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalMother.age"
              type="number"
              min="0"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Alive / Deceased</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalMother.status) }}</div>
            </template>
            <select
              v-else
              v-model="formData.biologicalMother.status"
              :disabled="isViewMode"
            >
              <option value="">Select</option>
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div class="form-group">
            <label>If deceased, date of death</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ formatDate(formData.biologicalMother.deathDate) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalMother.deathDate"
              type="date"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Cause of death</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalMother.causeOfDeath) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalMother.causeOfDeath"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Location</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalMother.location) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalMother.location"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Profession</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.biologicalMother.profession) }}</div>
            </template>
            <input
              v-else
              v-model="formData.biologicalMother.profession"
              type="text"
              :disabled="isViewMode"
            />
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

      <!-- Biological Siblings -->
      <div v-show="currentSection === 3" class="form-section">
        <h5>Biological Siblings</h5>
        <div
          v-for="(sibling, index) in formData.siblings"
          :key="index"
          class="sibling-section"
        >
          <h6>Sibling {{ index + 1 }}</h6>
          <div class="form-grid">
            <div class="form-group">
              <label>Name</label>
              <template v-if="isViewMode">
                <div class="readonly-field">{{ displayValue(sibling.name) }}</div>
              </template>
              <input
                v-else
                v-model="sibling.name"
                type="text"
                :disabled="isViewMode"
              />
            </div>
            <div class="form-group">
              <label>Age</label>
              <template v-if="isViewMode">
                <div class="readonly-field">{{ displayValue(sibling.age) }}</div>
              </template>
              <input
                v-else
                v-model="sibling.age"
                type="number"
                min="0"
                :disabled="isViewMode"
              />
            </div>
            <div class="form-group">
              <label>Older / Younger</label>
              <template v-if="isViewMode">
                <div class="readonly-field">{{ displayValue(sibling.ageRelation) }}</div>
              </template>
              <select v-else v-model="sibling.ageRelation" :disabled="isViewMode">
                <option value="">Select</option>
                <option value="Older">Older</option>
                <option value="Younger">Younger</option>
              </select>
            </div>
            <div class="form-group">
              <label>Alive / Deceased</label>
              <template v-if="isViewMode">
                <div class="readonly-field">{{ displayValue(sibling.status) }}</div>
              </template>
              <select v-else v-model="sibling.status" :disabled="isViewMode">
                <option value="">Select</option>
                <option value="Alive">Alive</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>
            <div class="form-group">
              <label>If deceased, date of death</label>
              <template v-if="isViewMode">
                <div class="readonly-field">{{ formatDate(sibling.deathDate) }}</div>
              </template>
              <input
                v-else
                v-model="sibling.deathDate"
                type="date"
                :disabled="isViewMode"
              />
            </div>
            <div class="form-group">
              <label>Profession</label>
              <template v-if="isViewMode">
                <div class="readonly-field">{{ displayValue(sibling.profession) }}</div>
              </template>
              <input
                v-else
                v-model="sibling.profession"
                type="text"
                :disabled="isViewMode"
              />
            </div>
            <div class="form-group">
              <label>Potential Guardian for Program</label>
              <template v-if="isViewMode">
                <div class="readonly-field">{{ displayValue(sibling.potentialGuardian) }}</div>
              </template>
              <select
                v-else
                v-model="sibling.potentialGuardian"
                :disabled="isViewMode"
              >
                <option value="">Select</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div class="form-group" v-if="!isViewMode">
              <button
                type="button"
                class="remove-btn"
                @click="removeSibling(index)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <button v-if="!isViewMode" type="button" class="add-btn" @click="addSibling">
          Add Sibling
        </button>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Referral Method Section -->
      <div v-show="currentSection === 3" class="form-section">
        <h4>Referral Method</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Select One *</label>
            <template v-if="isViewMode">
              <div class="readonly-field">
                {{ displayValue(formData.referralMethod) }}
              </div>
            </template>
            <select
              v-else
              v-model="formData.referralMethod"
              required
              @change="clearFieldError('referralMethod')"
              :disabled="isViewMode"
            >
              <option value="">Select Method</option>
              <option value="Family Legacy">Family Legacy</option>
              <option value="Coptic Hospital">Coptic Hospital</option>
              <option value="Department of Social Welfare - Lusaka">
                Department of Social Welfare - Lusaka
              </option>
              <option value="Department of Social Welfare - Chongwe">
                Department of Social Welfare - Chongwe
              </option>
              <option value="Other">Other</option>
            </select>
            <div
              v-if="!isViewMode && validationErrors.referralMethod"
              class="error-message"
            >
              {{ validationErrors.referralMethod }}
            </div>
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

      <!-- Reason for Admission Section -->
      <div v-show="currentSection === 4" class="form-section">
        <h4>Reason(s) for Admission</h4>
        <div class="form-group">
          <label>Select All That Apply *</label>
          <template v-if="isViewMode">
            <div class="readonly-field">
              <div v-if="formData.reasons.attemptedAbortion">Attempted/Considered Abortion</div>
              <div v-if="formData.reasons.attemptedSuicide">Attempted/Considered Suicide</div>
              <div v-if="formData.reasons.pregnant">Pregnant</div>
              <div v-if="formData.reasons.rapeDefilement">Rape/Defilement</div>
              <div v-if="formData.reasons.survivalProstitution">Survival Prostitution</div>
              <div v-if="formData.reasons.other">Other</div>
              <div v-if="!Object.values(formData.reasons).some(r => r)">-</div>
            </div>
          </template>
          <div v-else class="checkbox-group">
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="formData.reasons.attemptedAbortion"
                :disabled="isViewMode"
              />
              <span>Attempted/Considered Abortion</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="formData.reasons.attemptedSuicide"
                :disabled="isViewMode"
              />
              <span>Attempted/Considered Suicide</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="formData.reasons.pregnant"
                :disabled="isViewMode"
              />
              <span>Pregnant</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="formData.reasons.rapeDefilement"
                :disabled="isViewMode"
              />
              <span>Rape/Defilement</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="formData.reasons.survivalProstitution"
                :disabled="isViewMode"
              />
              <span>Survival Prostitution</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="formData.reasons.other"
                :disabled="isViewMode"
              />
              <span>Other</span>
            </label>
          </div>
          <div v-if="!isViewMode && validationErrors.reasons" class="error-message">
            {{ validationErrors.reasons }}
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Estimated Date of Conception</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ formatDate(formData.estimatedConceptionDate) }}</div>
            </template>
            <input
              v-else
              v-model="formData.estimatedConceptionDate"
              type="date"
              :disabled="isViewMode"
            />
          </div>
          <div class="form-group">
            <label>Current Duration of Pregnancy (Months/weeks)</label>
            <template v-if="isViewMode">
              <div class="readonly-field">{{ displayValue(formData.pregnancyDuration) }}</div>
            </template>
            <input
              v-else
              v-model="formData.pregnancyDuration"
              type="text"
              placeholder="e.g., 12 weeks"
              :disabled="isViewMode"
            />
          </div>
        </div>
        <div class="form-group full-width">
          <label>Additional Details of Abuse Situation</label>
          <template v-if="isViewMode">
            <div class="readonly-field">{{ displayValue(formData.abuseDetails) }}</div>
          </template>
          <textarea
            v-else
            v-model="formData.abuseDetails"
            rows="4"
            :disabled="isViewMode"
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

      <!-- Caregiver/Guardian Information Section -->
      <div v-show="currentSection === 5" class="form-section">
        <h4>Caregiver/Guardian Information</h4>
        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.dateCompiled }"
          >
            <label>Date Compiled *</label>
            <input
              v-model="formData.dateCompiled"
              type="date"
              required
              @input="clearFieldError('dateCompiled')"
              :disabled="isViewMode"
            />
            <div v-if="validationErrors.dateCompiled" class="error-message">
              {{ validationErrors.dateCompiled }}
            </div>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.childName }"
          >
            <label>Child Name *</label>
            <input
              v-model="formData.childName"
              type="text"
              required
              @input="clearFieldError('childName')"
              :disabled="isViewMode"
            />
            <div v-if="validationErrors.childName" class="error-message">
              {{ validationErrors.childName }}
            </div>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.childId }"
          >
            <label>Child ID *</label>
            <input
              v-model="formData.childId"
              type="text"
              required
              @input="clearFieldError('childId')"
              :disabled="isViewMode"
            />
            <div v-if="validationErrors.childId" class="error-message">
              {{ validationErrors.childId }}
            </div>
          </div>
        </div>

        <!-- Primary Caregiver -->
        <h5>Primary Caregiver/Guardian</h5>
        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors['primaryCaregiver.name'] }"
          >
            <label>Name *</label>
            <input
              v-model="formData.primaryCaregiver.name"
              type="text"
              required
              @input="clearFieldError('primaryCaregiver.name')"
              :disabled="isViewMode"
            />
            <div
              v-if="validationErrors['primaryCaregiver.name']"
              class="error-message"
            >
              {{ validationErrors["primaryCaregiver.name"] }}
            </div>
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['primaryCaregiver.relationship'],
            }"
          >
            <label>Relationship to Child *</label>
            <input
              v-model="formData.primaryCaregiver.relationship"
              type="text"
              required
              @input="clearFieldError('primaryCaregiver.relationship')"
              :disabled="isViewMode"
            />
            <div
              v-if="validationErrors['primaryCaregiver.relationship']"
              class="error-message"
            >
              {{ validationErrors["primaryCaregiver.relationship"] }}
            </div>
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['primaryCaregiver.phone1'],
            }"
          >
            <label>Phone #1</label>
            <input
              v-model="formData.primaryCaregiver.phone1"
              type="tel"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['primaryCaregiver.phone2'],
            }"
          >
            <label>Phone #2</label>
            <input
              v-model="formData.primaryCaregiver.phone2"
              type="tel"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['primaryCaregiver.occupation'],
            }"
          >
            <label>Occupation</label>
            <input
              v-model="formData.primaryCaregiver.occupation"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors['primaryCaregiver.area'] }"
          >
            <label>Area of Town</label>
            <input
              v-model="formData.primaryCaregiver.area"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors['primaryCaregiver.age'] }"
          >
            <label>Age</label>
            <input
              v-model="formData.primaryCaregiver.age"
              type="number"
              min="0"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['primaryCaregiver.nrcNumber'],
            }"
          >
            <label>NRC Number</label>
            <input
              v-model="formData.primaryCaregiver.nrcNumber"
              type="text"
              :disabled="isViewMode"
            />
          </div>
        </div>
        <div
          class="form-group full-width"
          :class="{ 'has-error': validationErrors['primaryCaregiver.notes'] }"
        >
          <label>Additional Notes</label>
          <textarea
            v-model="formData.primaryCaregiver.notes"
            rows="3"
            :disabled="isViewMode"
          ></textarea>
        </div>

        <!-- Secondary Caregiver -->
        <h5>Secondary Caregiver/Guardian</h5>
        <div class="form-grid">
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['secondaryCaregiver.name'],
            }"
          >
            <label>Name</label>
            <input
              v-model="formData.secondaryCaregiver.name"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['secondaryCaregiver.relationship'],
            }"
          >
            <label>Relationship to Child</label>
            <input
              v-model="formData.secondaryCaregiver.relationship"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['secondaryCaregiver.phone1'],
            }"
          >
            <label>Phone #1</label>
            <input
              v-model="formData.secondaryCaregiver.phone1"
              type="tel"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['secondaryCaregiver.phone2'],
            }"
          >
            <label>Phone #2</label>
            <input
              v-model="formData.secondaryCaregiver.phone2"
              type="tel"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['secondaryCaregiver.occupation'],
            }"
          >
            <label>Occupation</label>
            <input
              v-model="formData.secondaryCaregiver.occupation"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['secondaryCaregiver.area'],
            }"
          >
            <label>Area of Town</label>
            <input
              v-model="formData.secondaryCaregiver.area"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors['secondaryCaregiver.age'] }"
          >
            <label>Age</label>
            <input
              v-model="formData.secondaryCaregiver.age"
              type="number"
              min="0"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['secondaryCaregiver.nrcNumber'],
            }"
          >
            <label>NRC Number</label>
            <input
              v-model="formData.secondaryCaregiver.nrcNumber"
              type="text"
              :disabled="isViewMode"
            />
          </div>
        </div>
        <div
          class="form-group full-width"
          :class="{ 'has-error': validationErrors['secondaryCaregiver.notes'] }"
        >
          <label>Additional Notes</label>
          <textarea
            v-model="formData.secondaryCaregiver.notes"
            rows="3"
            :disabled="isViewMode"
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

      <!-- General Family Information Section -->
      <div v-show="currentSection === 6" class="form-section">
        <h4>General Family Information</h4>

        <!-- Biological Father -->
        <h5>Biological Father</h5>
        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors['biologicalFather.name'] }"
          >
            <label>Name</label>
            <input
              v-model="formData.biologicalFather.name"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors['biologicalFather.age'] }"
          >
            <label>Age</label>
            <input
              v-model="formData.biologicalFather.age"
              type="number"
              min="0"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalFather.status'],
            }"
          >
            <label>Alive / Deceased</label>
            <select
              v-model="formData.biologicalFather.status"
              :disabled="isViewMode"
            >
              <option value="">Select</option>
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalFather.deathDate'],
            }"
          >
            <label>If deceased, date of death</label>
            <input
              v-model="formData.biologicalFather.deathDate"
              type="date"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalFather.causeOfDeath'],
            }"
          >
            <label>Cause of death</label>
            <input
              v-model="formData.biologicalFather.causeOfDeath"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalFather.location'],
            }"
          >
            <label>Location</label>
            <input
              v-model="formData.biologicalFather.location"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalFather.profession'],
            }"
          >
            <label>Profession</label>
            <input
              v-model="formData.biologicalFather.profession"
              type="text"
              :disabled="isViewMode"
            />
          </div>
        </div>

        <!-- Biological Mother -->
        <h5>Biological Mother</h5>
        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors['biologicalMother.name'] }"
          >
            <label>Name</label>
            <input
              v-model="formData.biologicalMother.name"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors['biologicalMother.age'] }"
          >
            <label>Age</label>
            <input
              v-model="formData.biologicalMother.age"
              type="number"
              min="0"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalMother.status'],
            }"
          >
            <label>Alive / Deceased</label>
            <select
              v-model="formData.biologicalMother.status"
              :disabled="isViewMode"
            >
              <option value="">Select</option>
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalMother.deathDate'],
            }"
          >
            <label>If deceased, date of death</label>
            <input
              v-model="formData.biologicalMother.deathDate"
              type="date"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalMother.causeOfDeath'],
            }"
          >
            <label>Cause of death</label>
            <input
              v-model="formData.biologicalMother.causeOfDeath"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalMother.location'],
            }"
          >
            <label>Location</label>
            <input
              v-model="formData.biologicalMother.location"
              type="text"
              :disabled="isViewMode"
            />
          </div>
          <div
            class="form-group"
            :class="{
              'has-error': validationErrors['biologicalMother.profession'],
            }"
          >
            <label>Profession</label>
            <input
              v-model="formData.biologicalMother.profession"
              type="text"
              :disabled="isViewMode"
            />
          </div>
        </div>

        <!-- Biological Siblings -->
        <h5>Biological Siblings</h5>
        <div
          v-for="(sibling, index) in formData.siblings"
          :key="index"
          class="sibling-section"
        >
          <h6>Sibling {{ index + 1 }}</h6>
          <div class="form-grid">
            <div
              class="form-group"
              :class="{
                'has-error': validationErrors[`siblings[${index}].name`],
              }"
            >
              <label>Name</label>
              <input
                v-model="sibling.name"
                type="text"
                :disabled="isViewMode"
              />
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': validationErrors[`siblings[${index}].age`],
              }"
            >
              <label>Age</label>
              <input
                v-model="sibling.age"
                type="number"
                min="0"
                :disabled="isViewMode"
              />
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': validationErrors[`siblings[${index}].ageRelation`],
              }"
            >
              <label>Older / Younger</label>
              <select v-model="sibling.ageRelation" :disabled="isViewMode">
                <option value="">Select</option>
                <option value="Older">Older</option>
                <option value="Younger">Younger</option>
              </select>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': validationErrors[`siblings[${index}].status`],
              }"
            >
              <label>Alive / Deceased</label>
              <select v-model="sibling.status" :disabled="isViewMode">
                <option value="">Select</option>
                <option value="Alive">Alive</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': validationErrors[`siblings[${index}].deathDate`],
              }"
            >
              <label>If deceased, date of death</label>
              <input
                v-model="sibling.deathDate"
                type="date"
                :disabled="isViewMode"
              />
            </div>
            <div
              class="form-group"
              :class="{
                'has-error': validationErrors[`siblings[${index}].profession`],
              }"
            >
              <label>Profession</label>
              <input
                v-model="sibling.profession"
                type="text"
                :disabled="isViewMode"
              />
            </div>
            <div
              class="form-group"
              :class="{
                'has-error':
                  validationErrors[`siblings[${index}].potentialGuardian`],
              }"
            >
              <label>Potential Guardian for Program</label>
              <select
                v-model="sibling.potentialGuardian"
                :disabled="isViewMode"
              >
                <option value="">Select</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div class="form-group">
              <button
                type="button"
                class="remove-btn"
                @click="removeSibling(index)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <button type="button" class="add-btn" @click="addSibling">
          Add Sibling
        </button>
        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Additional Family Members Section -->
      <div v-show="currentSection === 7" class="form-section">
        <h4>Additional Family Members</h4>
        <div class="family-table">
          <table>
            <thead>
              <tr>
                <th>Relation to Child</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Profession</th>
                <th>Location</th>
                <th>Potential Guardian (Y/N)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(member, index) in formData.additionalFamily"
                :key="index"
              >
                <td
                  :class="{
                    'has-error':
                      validationErrors[`additionalFamily[${index}].relation`],
                  }"
                >
                  <input
                    v-model="member.relation"
                    type="text"
                    :disabled="isViewMode"
                  />
                  <div
                    v-if="
                      validationErrors[`additionalFamily[${index}].relation`]
                    "
                    class="error-message"
                  >
                    {{
                      validationErrors[`additionalFamily[${index}].relation`]
                    }}
                  </div>
                </td>
                <td
                  :class="{
                    'has-error':
                      validationErrors[`additionalFamily[${index}].fullName`],
                  }"
                >
                  <input
                    v-model="member.fullName"
                    type="text"
                    :disabled="isViewMode"
                  />
                  <div
                    v-if="
                      validationErrors[`additionalFamily[${index}].fullName`]
                    "
                    class="error-message"
                  >
                    {{
                      validationErrors[`additionalFamily[${index}].fullName`]
                    }}
                  </div>
                </td>
                <td
                  :class="{
                    'has-error':
                      validationErrors[`additionalFamily[${index}].age`],
                  }"
                >
                  <input
                    v-model="member.age"
                    type="number"
                    min="0"
                    :disabled="isViewMode"
                  />
                  <div
                    v-if="validationErrors[`additionalFamily[${index}].age`]"
                    class="error-message"
                  >
                    {{ validationErrors[`additionalFamily[${index}].age`] }}
                  </div>
                </td>
                <td
                  :class="{
                    'has-error':
                      validationErrors[`additionalFamily[${index}].profession`],
                  }"
                >
                  <input
                    v-model="member.profession"
                    type="text"
                    :disabled="isViewMode"
                  />
                  <div
                    v-if="
                      validationErrors[`additionalFamily[${index}].profession`]
                    "
                    class="error-message"
                  >
                    {{
                      validationErrors[`additionalFamily[${index}].profession`]
                    }}
                  </div>
                </td>
                <td
                  :class="{
                    'has-error':
                      validationErrors[`additionalFamily[${index}].location`],
                  }"
                >
                  <input
                    v-model="member.location"
                    type="text"
                    :disabled="isViewMode"
                  />
                  <div
                    v-if="
                      validationErrors[`additionalFamily[${index}].location`]
                    "
                    class="error-message"
                  >
                    {{
                      validationErrors[`additionalFamily[${index}].location`]
                    }}
                  </div>
                </td>
                <td
                  :class="{
                    'has-error':
                      validationErrors[
                        `additionalFamily[${index}].potentialGuardian`
                      ],
                  }"
                >
                  <select
                    v-model="member.potentialGuardian"
                    :disabled="isViewMode"
                  >
                    <option value="">Select</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                  <div
                    v-if="
                      validationErrors[
                        `additionalFamily[${index}].potentialGuardian`
                      ]
                    "
                    class="error-message"
                  >
                    {{
                      validationErrors[
                        `additionalFamily[${index}].potentialGuardian`
                      ]
                    }}
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    class="remove-btn"
                    @click="removeFamilyMember(index)"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button" class="add-btn" @click="addFamilyMember">
            Add Family Member
          </button>
        </div>
        <div
          class="form-group"
          :class="{ 'has-error': validationErrors.potentialGuardiansAvailable }"
        >
          <label
            >Are there 2-3 potential guardians/caretakers who would be willing
            and able to participate in the program?</label
          >
          <select
            v-model="formData.potentialGuardiansAvailable"
            :disabled="isViewMode"
          >
            <option value="">Select</option>
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
          <div
            v-if="validationErrors.potentialGuardiansAvailable"
            class="error-message"
          >
            {{ validationErrors.potentialGuardiansAvailable }}
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

      <!-- Documents Included Section -->
      <div v-show="currentSection === 8" class="form-section">
        <h4>Documents Included</h4>
        <div class="checkbox-group">
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.documents.tkpReferralForm"
              :disabled="isViewMode"
            />
            TKP Referral Form
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.documents.carePlanAssessment"
              :disabled="isViewMode"
            />
            Care Plan Assessment Form
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.documents.birthRecord"
              :disabled="isViewMode"
            />
            Copy of Birth Record
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.documents.policeRecord"
              :disabled="isViewMode"
            />
            Copy of Police Record
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.documents.dswAdmissionLetter"
              :disabled="isViewMode"
            />
            DSW Admission Letter
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.documents.medicalRecords"
              :disabled="isViewMode"
            />
            Medical Records
          </label>
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
            {{ loading ? "Saving..." : "Save Care Plan" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "../composables/useToast.js";
import { useFormAutoSave } from "../composables/useFormAutoSave.js";
import { getOrGenerateChildId } from "../utils/childIdGenerator.js";

const props = defineProps({
  editData: {
    type: Object,
    default: () => ({}),
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  isViewMode: {
    type: Boolean,
    default: false,
  },
  isOutreachMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["form-saved"]);
const { success, error } = useToast();
const router = useRouter();
const route = useRoute();

// Computed property to determine if form is in view-only mode
const isViewMode = computed(() => {
  // Check if explicitly in view mode via props
  if (props.viewMode) return true;

  // Check if in view mode via sessionStorage
  const storedChildData = sessionStorage.getItem("selectedChildForForm");
  if (storedChildData) {
    try {
      const childData = JSON.parse(storedChildData);
      if (childData.viewMode === true) return true;
    } catch (error) {
      console.error("Error parsing child data from sessionStorage:", error);
    }
  }

  // Check if view mode is set in sessionStorage
  return sessionStorage.getItem("formViewMode") === "true";
});

const loading = ref(false);

// Section navigation
const currentSection = ref(1);
const totalSections = 8;

const progressPercentage = computed(() => {
  return (currentSection.value / totalSections) * 100;
});

const sectionNames = [
  "Child Information",
  "Vulnerability Status",
  "Referral Method",
  "Reason for Admission",
  "Caregiver Information",
  "General Family Information",
  "Additional Family Members",
  "Documents Included",
];

const currentSectionName = computed(() => {
  return sectionNames[currentSection.value - 1] || "Unknown Section";
});

const sectionCompletionStatus = computed(() => {
  const status = [];

  // Section 1: Child Information
  const section1Complete =
    formData.childFirstName &&
    formData.childSurname &&
    formData.id &&
    formData.dateOfAdmission &&
    formData.gender &&
    formData.dateOfBirth &&
    formData.ageAtIntake &&
    formData.placeOfBirth &&
    formData.residentArea &&
    formData.district &&
    formData.nationality;
  status.push(section1Complete);

  // Section 2: Vulnerability Status
  const section2Complete = formData.ovcStatus;
  status.push(section2Complete);

  // Section 3: Referral Method
  const section3Complete = formData.referralMethod;
  status.push(section3Complete);

  // Section 4: Reasons for Admission
  const section4Complete = Object.values(formData.reasons).some(
    (reason) => reason === true
  );
  status.push(section4Complete);

  // Section 5: Caregiver Information
  const section5Complete =
    formData.dateCompiled &&
    formData.childName &&
    formData.childId &&
    formData.primaryCaregiver.name &&
    formData.primaryCaregiver.relationship;
  status.push(section5Complete);

  // Sections 6-8 are optional
  status.push(true); // General Family Information
  status.push(true); // Additional Family Members
  status.push(true); // Documents

  return status;
});

const completedSections = computed(() => {
  return sectionCompletionStatus.value.filter((status) => status).length;
});

const overallCompletion = computed(() => {
  const requiredSections = 5; // Only first 5 sections are required
  const completedRequired = sectionCompletionStatus.value
    .slice(0, 5)
    .filter((status) => status).length;
  return Math.round((completedRequired / requiredSections) * 100);
});

// Section validation rules
const sectionValidationRules = {
  1: [
    // Child Information - required fields
    "childFirstName",
    "childSurname",
    "id",
    "dateOfAdmission",
    "gender",
    "dateOfBirth",
    "ageAtIntake",
    "placeOfBirth",
    "residentArea",
    "district",
    "nationality",
  ],
  2: [
    // Vulnerability Status
    "ovcStatus",
  ],
  3: [
    // Referral Method
    "referralMethod",
  ],
  4: [
    // Reasons for Admission - at least one reason must be selected
  ],
  5: [
    // Caregiver Information
    "dateCompiled",
    "childName",
    "childId",
  ],
  6: [], // General Family Information - optional
  7: [], // Additional Family Members - optional
  8: [], // Documents - optional
};

// Validation error messages
const validationErrors = ref({});
const showValidationMessage = ref(false);

// Validate current section
const validateCurrentSection = () => {
  const requiredFields = sectionValidationRules[currentSection.value] || [];
  const errors = {};
  let isValid = true;

  // Special validation for section 4 (Reasons for Admission)
  if (currentSection.value === 4) {
    const hasSelectedReason = Object.values(formData.reasons).some(
      (reason) => reason === true
    );
    if (!hasSelectedReason) {
      errors.reasons = "Please select at least one reason for admission";
      isValid = false;
    }
  }

  // Validate primary caregiver fields for section 5
  if (currentSection.value === 5) {
    if (
      !formData.primaryCaregiver.name ||
      formData.primaryCaregiver.name.trim() === ""
    ) {
      errors["primaryCaregiver.name"] = "Primary Caregiver Name is required";
      isValid = false;
    }
    if (
      !formData.primaryCaregiver.relationship ||
      formData.primaryCaregiver.relationship.trim() === ""
    ) {
      errors["primaryCaregiver.relationship"] =
        "Relationship to Child is required";
      isValid = false;
    }
  }

  // Check regular required fields
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
    childSurname: "Child Surname",
    id: "Child ID",
    dateOfAdmission: "Date of Admission",
    gender: "Gender",
    dateOfBirth: "Date of Birth",
    ageAtIntake: "Age at Intake",
    placeOfBirth: "Place of Birth",
    residentArea: "Resident Area at Intake",
    district: "District",
    nationality: "Nationality",
    ovcStatus: "OVC Status",
    referralMethod: "Referral Method",
    dateCompiled: "Date Compiled",
    childName: "Child Name",
    childId: "Child ID",
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
  childMiddleName: "",
  childSurname: "",
  otherFirstName: "",
  otherMiddleName: "",
  otherSurname: "",
  id: "",
  dateOfAdmission: "",
  gender: "",
  dateOfBirth: "",
  ageAtIntake: "",
  placeOfBirth: "",
  residentArea: "",
  village: "",
  chief: "",
  district: "",
  tribe: "",
  denomination: "",
  nationality: "",

  // Vulnerability Status
  ovcStatus: "",
  ovcDateEffective: "",
  parentDeceased: "",
  parentDeathDate: "",
  guardianDeceased: "",
  guardianDeathDate: "",

  // Referral Method
  referralMethod: "",

  // Reasons for Admission
  reasons: {
    attemptedAbortion: false,
    attemptedSuicide: false,
    pregnant: false,
    rapeDefilement: false,
    survivalProstitution: false,
    other: false,
  },
  estimatedConceptionDate: "",
  pregnancyDuration: "",
  abuseDetails: "",

  // Caregiver Information
  dateCompiled: "",
  childName: "",
  childId: "",

  primaryCaregiver: {
    name: "",
    relationship: "",
    phone1: "",
    phone2: "",
    occupation: "",
    area: "",
    age: "",
    nrcNumber: "",
    notes: "",
  },

  secondaryCaregiver: {
    name: "",
    relationship: "",
    phone1: "",
    phone2: "",
    occupation: "",
    area: "",
    age: "",
    nrcNumber: "",
    notes: "",
  },

  // Biological Parents
  biologicalFather: {
    name: "",
    age: "",
    status: "",
    deathDate: "",
    causeOfDeath: "",
    location: "",
    profession: "",
  },

  biologicalMother: {
    name: "",
    age: "",
    status: "",
    deathDate: "",
    causeOfDeath: "",
    location: "",
    profession: "",
  },

  // Siblings
  siblings: [],

  // Additional Family Members
  additionalFamily: [],
  potentialGuardiansAvailable: "",

  // Documents
  documents: {
    tkpReferralForm: false,
    carePlanAssessment: false,
    birthRecord: false,
    policeRecord: false,
    dswAdmissionLetter: false,
    medicalRecords: false,
  },
});

// Watch for editData changes and populate formData
watch(
  () => props.editData,
  (newEditData) => {
    if (newEditData && props.isEditMode) {
      // Populate all form fields from editData
      Object.keys(formData).forEach((key) => {
        if (newEditData[key] !== undefined) {
          // Handle nested objects separately
          if (
            key === "reasons" ||
            key === "primaryCaregiver" ||
            key === "secondaryCaregiver" ||
            key === "biologicalFather" ||
            key === "biologicalMother" ||
            key === "documents"
          ) {
            formData[key] = { ...newEditData[key] };
          } else if (key === "siblings" || key === "additionalFamily") {
            // Handle arrays
            formData[key] = [...newEditData[key]];
          } else {
            formData[key] = newEditData[key];
          }
        }
      });
      console.log("Form populated with edit data:", newEditData);
    }
  },
  { immediate: true }
);

// Initialize auto-save functionality
const {
  isSaving,
  lastSaved,
  draftId,
  hasUnsavedChanges,
  loadDraft,
  saveNow,
  deleteDraft,
} = useFormAutoSave(formData, "child-overview", null, 30000);

// Check for child data from sessionStorage when form loads
onMounted(async () => {
  console.log("📋 ChildOverviewForm mounted, checking for child data...");

  // Check if we're editing an existing form
  if (route.query.edit) {
    await loadDraft(route.query.edit);
  }

  // Only pre-populate if NOT in edit mode
  if (!props.isEditMode && !route.query.edit) {
    const storedChildData = sessionStorage.getItem("selectedChildForForm");

    if (storedChildData) {
      try {
        const childData = JSON.parse(storedChildData);
        console.log("👶 Found child data in sessionStorage:", childData);

        // Check if we're in view mode
        const viewMode =
          sessionStorage.getItem("formViewMode") === "true" ||
          childData.viewMode === true;
        if (viewMode) {
          console.log("👀 Form is in view-only mode");
        }

        // Only populate if this is a child-overview form
        if (childData.formType === "child-overview") {
          // Pre-populate basic child information
          if (childData.childFirstName) {
            formData.childFirstName = childData.childFirstName;
            formData.childName =
              childData.childName || childData.childFirstName;
          }
          if (childData.childSurname) {
            formData.childSurname = childData.childSurname;
          }
          if (childData.dateOfBirth) {
            formData.dateOfBirth = childData.dateOfBirth;
          }
          if (childData.age) {
            formData.ageAtIntake = childData.age;
          }
          if (childData.gender) {
            formData.gender = childData.gender;
          }
          if (childData.caseId) {
            formData.id = childData.caseId;
            formData.childId = childData.caseId;
          }

          // Set current date as admission date if not already set
          if (!formData.dateOfAdmission) {
            formData.dateOfAdmission = new Date().toISOString().split("T")[0];
          }

          console.log("✅ Form pre-populated with child data");
          success(`Form pre-populated for ${childData.childName}`);
        }
      } catch (error) {
        console.error("Error parsing child data from sessionStorage:", error);
      }
    }
  }
});

const addSibling = () => {
  formData.siblings.push({
    name: "",
    age: "",
    ageRelation: "",
    status: "",
    deathDate: "",
    profession: "",
    potentialGuardian: "",
  });
};

const removeSibling = (index) => {
  formData.siblings.splice(index, 1);
};

const addFamilyMember = () => {
  formData.additionalFamily.push({
    relation: "",
    fullName: "",
    age: "",
    profession: "",
    location: "",
    potentialGuardian: "",
  });
};

const removeFamilyMember = (index) => {
  formData.additionalFamily.splice(index, 1);
};

const validateRequiredFields = () => {
  const errors = [];

  // Section 1: Child Information - Required fields
  if (!formData.childFirstName.trim())
    errors.push("Child First Name is required");
  if (!formData.childSurname.trim()) errors.push("Child Surname is required");
  if (!formData.id.trim()) errors.push("ID is required");
  if (!formData.dateOfAdmission) errors.push("Date of Admission is required");
  if (!formData.gender) errors.push("Gender is required");
  if (!formData.dateOfBirth) errors.push("Date of Birth is required");
  if (!formData.ageAtIntake) errors.push("Age at Intake is required");
  if (!formData.placeOfBirth.trim()) errors.push("Place of Birth is required");
  if (!formData.residentArea.trim())
    errors.push("Resident Area at Intake is required");
  if (!formData.district.trim()) errors.push("District is required");
  if (!formData.nationality.trim()) errors.push("Nationality is required");

  // Section 2: Vulnerability Status - Required fields
  if (!formData.ovcStatus) errors.push("OVC Status is required");

  // Section 3: Referral Method - Required field
  if (!formData.referralMethod) errors.push("Referral Method is required");

  // Section 4: Reasons for Admission - At least one reason must be selected
  const hasReason = Object.values(formData.reasons).some(
    (reason) => reason === true
  );
  if (!hasReason)
    errors.push("At least one reason for admission must be selected");

  // Section 5: Caregiver Information - Required fields
  if (!formData.dateCompiled) errors.push("Date Compiled is required");
  if (!formData.childName.trim()) errors.push("Child Name is required");
  if (!formData.childId.trim()) errors.push("Child ID is required");
  if (!formData.primaryCaregiver.name.trim())
    errors.push("Primary Caregiver Name is required");
  if (!formData.primaryCaregiver.relationship.trim())
    errors.push("Primary Caregiver Relationship is required");

  return errors;
};

const handleSubmit = async (event) => {
  // Prevent default form submission
  if (event) {
    event.preventDefault();
  }

  // Validate required fields before submission
  const validationErrors = validateRequiredFields();
  if (validationErrors.length > 0) {
    error(
      "Please complete the following required fields: " +
        validationErrors.join(", ")
    );
    return;
  }

  loading.value = true;
  try {
    // Skip duplicate check if we're in edit mode or outreach mode
    if (!props.isEditMode && !props.isOutreachMode) {
      // Check for duplicate children before saving
      const { default: DuplicationService } = await import(
        "../services/duplicationService.js"
      );

      const duplicateCheck = await DuplicationService.checkDuplicateChild(
        formData
      );

      if (duplicateCheck.hasDuplicates) {
        const highConfidenceDuplicates = duplicateCheck.duplicates.filter(
          (d) => d.confidence >= 95
        );

        if (highConfidenceDuplicates.length > 0) {
          // Show exact matches - require confirmation
          const duplicateInfo = highConfidenceDuplicates
            .map((dup) => {
              const childName = `${dup.data.childFirstName} ${dup.data.childSurname}`;
              const dob = dup.data.dateOfBirth || "Unknown DOB";
              return `• ${childName} (DOB: ${dob}) - ${dup.reason}`;
            })
            .join("\n");

          const userConfirmed = confirm(
            `⚠️ DUPLICATE WARNING

A child with similar information already exists in the system:

${duplicateInfo}

Are you sure you want to create a new record?`
          );

          if (!userConfirmed) {
            loading.value = false;
            error("Form submission cancelled to prevent duplicate entry");
            return;
          }
        } else {
          // Show potential duplicates as warning
          const warningInfo = duplicateCheck.duplicates
            .map((dup) => {
              const childName = `${dup.data.childFirstName} ${dup.data.childSurname}`;
              return `• ${childName} - ${dup.reason}`;
            })
            .join("\n");

          console.warn("Potential duplicates found:", warningInfo);
          // Allow submission to continue with warning logged
        }
      }
    }

    // Prepare form data with additional metadata
    // Generate or retrieve consistent child ID
    const childId = generateChildId(formData);
    console.log('📝 Saving child overview with child ID:', childId);
    
    const submissionData = {
      ...formData,
      childId: childId,
      submittedAt: new Date(),
      formVersion: "1.0",
      completedSections: totalSections,
      status: "submitted",
    };

    // Use EnhancedOutreachService when in outreach mode, otherwise use FormService
    if (props.isOutreachMode) {
      // Import EnhancedOutreachService dynamically
      const { default: EnhancedOutreachService } = await import(
        "../services/enhancedOutreachService.js"
      );

      // Create form data structure for outreach service
      const outreachFormData = {
        formType: "child-overview",
        childName: `${formData.childFirstName} ${formData.childSurname}`,
        caseId: formData.id || "", // Use existing ID or empty
        status: "completed",
        synced: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: { ...submissionData },
      };

      // If in edit mode, preserve the existing ID
      if (props.isEditMode && props.editData) {
        outreachFormData.id = props.editData.id;
      }

      // Save to local storage via EnhancedOutreachService
      const result = await EnhancedOutreachService.saveFormLocally(
        outreachFormData
      );

      if (result.success) {
        // Emit success event to parent component with form data
        emit("form-saved", {
          ...outreachFormData,
          id: outreachFormData.id || Date.now().toString(), // Use existing ID or generate new one
        });
        success("Child Overview Form saved successfully!");
        resetForm();
      } else {
        error("Error saving form: " + result.error);
      }
    } else {
      // Import FormService dynamically to avoid circular imports
      const { default: FormService } = await import(
        "../services/formService.js"
      );

      let result;
      if (props.isEditMode && props.editData) {
        // Get the form ID - prefer formId if it exists, otherwise use id
        const formIdToUpdate = props.editData.formId || props.editData.id;
        console.log("Updating form with ID:", formIdToUpdate);
        console.log("Edit data:", props.editData);

        if (!formIdToUpdate) {
          error("Cannot update: Form ID is missing");
          loading.value = false;
          return;
        }

        // Update existing record
        result = await FormService.updateChildOverview(
          formIdToUpdate,
          submissionData
        );
      } else {
        // Create new record - pass draftId to update existing draft
        result = await FormService.saveChildOverview(submissionData, draftId.value);
      }

      if (result.success) {
        // No need to delete draft - we updated it to submitted status
        
        // Emit success event to parent component with form data
        emit("form-saved", {
          formType: "child-overview",
          id: result.id,
          childId: childId,
          childName: `${formData.childFirstName} ${formData.childSurname}`,
          uniqueId: childId,
          isEdit: props.isEditMode,
          data: { ...submissionData },
        });

        success(`Child Overview saved! Child ID: ${childId}`);
        const actionText = props.isEditMode ? "updated" : "saved";
        success(
          `Child Overview Form ${actionText} successfully! Child: ${
            formData.childFirstName
          } ${formData.childSurname} (ID: ${result.id}) has been ${
            props.isEditMode ? "updated in" : "added to"
          } the tracking system.`
        );

        // Check if we should navigate back to TrackerCapture
        const storedChildData = sessionStorage.getItem("selectedChildForForm");
        if (storedChildData) {
          // Clear the session storage
          sessionStorage.removeItem("selectedChildForForm");
          // Navigate back to TrackerCapture
          router.push("/tracker-capture");
        } else {
          // Reset form for new entry
          resetForm();
        }
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

const generateChildId = (data) => {
  // Use the shared utility to generate or retrieve existing child ID
  return getOrGenerateChildId(data);
};

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (
      key === "reasons" ||
      key === "primaryCaregiver" ||
      key === "secondaryCaregiver" ||
      key === "biologicalFather" ||
      key === "biologicalMother" ||
      key === "documents"
    ) {
      Object.keys(formData[key]).forEach((subKey) => {
        if (typeof formData[key][subKey] === "boolean") {
          formData[key][subKey] = false;
        } else {
          formData[key][subKey] = "";
        }
      });
    } else if (key === "siblings" || key === "additionalFamily") {
      formData[key] = [];
    } else {
      formData[key] = "";
    }
  });
};
</script>

<style scoped>
.form-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #4a148c;
}

.form-header h3 {
  color: #4a148c;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
  font-size: 1rem;
}

.auto-save-status {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  min-height: 20px;
}

.auto-save-status .saving {
  color: #007bff;
  font-weight: 500;
}

.auto-save-status .saved {
  color: #28a745;
  font-weight: 500;
}

.auto-save-status .unsaved {
  color: #ffc107;
  font-weight: 500;
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
  background: linear-gradient(90deg, #4a148c, #2d1b69);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.progress-text {
  font-size: 0.9rem;
  color: #4a148c;
  font-weight: 500;
}

.section-title {
  font-size: 1.1rem;
  color: #ff5722;
  font-weight: 600;
}

.section-status {
  margin-top: 0.5rem;
}

.status-indicator {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
  background: #e9ecef;
  color: #6c757d;
  transition: all 0.3s ease;
}

.status-indicator.complete {
  background: #d4edda;
  color: #155724;
}

.overview-form {
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
  border-left: 4px solid #4a148c;
}

.form-section h4 {
  color: #4a148c;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-section h5 {
  color: #4a148c;
  font-size: 1.1rem;
  margin: 1.5rem 0 1rem 0;
  font-weight: 500;
}

.form-section h6 {
  color: #666;
  font-size: 1rem;
  margin: 1rem 0 0.5rem 0;
  font-weight: 500;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  color: #4a148c;
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
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4a148c;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #333;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: white;
}

.checkbox-item:hover {
  border-color: #4a148c;
  background-color: #f8f9fa;
}

.checkbox-item input:checked + span {
  font-weight: 600;
  color: #4a148c;
}

.checkbox-item input:checked {
  accent-color: #4a148c;
}

.checkbox-item:has(input:checked) {
  border-color: #4a148c;
  background-color: #e6f0ff;
  box-shadow: 0 0 0 2px rgba(74, 20, 140, 0.2);
}



.checkbox-item input[type="checkbox"] {
  width: auto;
  margin: 0;
  transform: scale(1.3);
  accent-color: #4a148c;
  border-radius: 4px;
  border: 2px solid #4a148c;
}

.sibling-section {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
}

.family-table {
  margin-bottom: 1rem;
}

.family-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.family-table th,
.family-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.family-table th {
  background-color: #4a148c;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.family-table input,
.family-table select {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 0.8rem;
}

.add-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.add-btn:before {
  content: "+";
  font-size: 1.2rem;
  font-weight: bold;
}

.add-btn:hover {
  background: linear-gradient(135deg, #218838 0%, #1aa179 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.remove-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(220, 53, 69, 0.2);
}

.remove-btn:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.section-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.prev-btn,
.next-btn {
  background-color: #4a148c;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
  justify-content: center;
}

.prev-btn:hover,
.next-btn:hover {
  background-color: #2d1b69;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(74, 20, 140, 0.3);
}

.submit-btn {
  background-color: #ff5722;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(255, 87, 34, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background-color: #2d1b69;
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
  background: #4a148c;
  color: white;
}

.next-btn:hover {
  background: #2d1b69;
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

/* Responsive Design */
@media (max-width: 768px) {
  .form-wrapper {
    max-width: 100%;
    padding: 0 0.5rem;
  }

  .form-header {
    padding: 0.75rem 0.5rem;
    margin-bottom: 0.75rem;
  }

  .form-header h3 {
    font-size: 1.2rem;
    line-height: 1.3;
  }

  .form-header p {
    font-size: 0.85rem;
  }

  .overview-form {
    padding: 0.75rem;
    border-radius: 0;
  }

  .form-section {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    border-radius: 6px;
  }

  .form-section h4 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .form-section h5 {
    font-size: 0.95rem;
    margin: 1rem 0 0.5rem 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }

  .checkbox-item {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .form-group {
    margin-bottom: 0;
  }

  .form-group label {
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
    font-weight: 600;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.5rem;
    font-size: 0.875rem;
    border-width: 1px;
    min-height: 40px;
  }

  .form-group textarea {
    min-height: 70px;
  }

  .family-table {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0.5rem -0.75rem;
    padding: 0 0.75rem;
  }

  .family-table table {
    min-width: 700px;
    font-size: 0.75rem;
  }

  .family-table th,
  .family-table td {
    padding: 0.4rem 0.3rem;
  }

  .family-table input,
  .family-table select {
    padding: 0.3rem;
    font-size: 0.75rem;
  }

  .add-btn {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    justify-content: center;
  }

  .remove-btn {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
  }

  .section-navigation {
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.75rem;
    margin-top: 0.75rem;
  }

  .prev-btn,
  .next-btn,
  .submit-btn {
    width: 100%;
    min-width: auto;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    min-height: 44px;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    min-height: 44px;
  }

  .progress-info {
    font-size: 0.8rem;
  }

  .section-title {
    font-size: 0.85rem;
  }

  .status-indicator {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }

  .progress-bar {
    height: 6px;
  }
}

@media (max-width: 480px) {
  .form-wrapper {
    padding: 0 0.25rem;
  }

  .form-header {
    padding: 0.5rem 0.25rem;
  }

  .form-header h3 {
    font-size: 1rem;
  }

  .form-header p {
    font-size: 0.8rem;
  }

  .form-section {
    padding: 0.5rem;
  }

  .form-section h4 {
    font-size: 0.95rem;
  }

  .form-section h5 {
    font-size: 0.9rem;
  }

  .form-group label {
    font-size: 0.75rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.4rem;
    font-size: 0.8rem;
  }

  .checkbox-item {
    padding: 0.4rem;
    font-size: 0.75rem;
  }

  .progress-text {
    font-size: 0.7rem;
  }

  .section-title {
    font-size: 0.8rem;
  }

  .family-table table {
    min-width: 650px;
    font-size: 0.7rem;
  }

  .add-btn {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>
