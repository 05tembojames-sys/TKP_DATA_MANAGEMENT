<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3>Medical Intake Assessment</h3>
      <p>Complete this comprehensive medical assessment for child admission</p>
      <div class="form-progress">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="form-info">
          <span class="progress-text"
            >Section {{ currentSection }} of {{ totalSections }} •
            {{ overallCompletion }}% Complete</span
          >
          <span class="section-title">{{ currentSectionName }}</span>
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

    <div class="medical-form">
      <!-- Section 1: Child's Information -->
      <div v-show="currentSection === 1" class="form-section">
        <h4>General History - Child's Information</h4>
        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.childFirstName }"
          >
            <label>First Name *</label>
            <input
              v-model="formData.childFirstName"
              type="text"
              required
              @input="clearFieldError('childFirstName')"
            />
            <div v-if="validationErrors.childFirstName" class="error-message">
              {{ validationErrors.childFirstName }}
            </div>
          </div>
          <div class="form-group">
            <label>Middle Name</label>
            <input v-model="formData.childMiddleName" type="text" />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.childSurname }"
          >
            <label>Surname *</label>
            <input
              v-model="formData.childSurname"
              type="text"
              required
              @input="clearFieldError('childSurname')"
            />
            <div v-if="validationErrors.childSurname" class="error-message">
              {{ validationErrors.childSurname }}
            </div>
          </div>
          <div class="form-group full-width">
            <label>Other Known Names</label>
            <input v-model="formData.otherKnownNames" type="text" />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.dateOfBirth }"
          >
            <label>Date of Birth (DD/MM/YYYY) *</label>
            <input
              v-model="formData.dateOfBirth"
              type="date"
              required
              @input="clearFieldError('dateOfBirth')"
            />
            <div v-if="validationErrors.dateOfBirth" class="error-message">
              {{ validationErrors.dateOfBirth }}
            </div>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.informationProvider }"
          >
            <label>Who is providing the information? *</label>
            <select
              v-model="formData.informationProvider"
              required
              @change="clearFieldError('informationProvider')"
            >
              <option value="">Select Provider</option>
              <option value="Biological Mother">Biological Mother</option>
              <option value="Biological Father">Biological Father</option>
              <option value="Other">Other</option>
            </select>
            <div
              v-if="validationErrors.informationProvider"
              class="error-message"
            >
              {{ validationErrors.informationProvider }}
            </div>
          </div>
          <div
            v-if="formData.informationProvider === 'Other'"
            class="form-group full-width"
          >
            <label>Please explain *</label>
            <input
              v-model="formData.informationProviderOther"
              type="text"
              required
            />
          </div>
        </div>
        <div class="section-navigation">
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Section 2: Biological Parents Information -->
      <div v-show="currentSection === 2" class="form-section">
        <h4>Biological Parents Information</h4>

        <!-- Biological Mother -->
        <h5>Biological Mother</h5>
        <div class="form-grid">
          <div class="form-group">
            <label>Status *</label>
            <select v-model="formData.biologicalMother.status" required>
              <option value="">Select Status</option>
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div class="form-group">
            <label>First Name</label>
            <input v-model="formData.biologicalMother.firstName" type="text" />
          </div>
          <div class="form-group">
            <label>Maiden Name</label>
            <input v-model="formData.biologicalMother.maidenName" type="text" />
          </div>
          <div class="form-group">
            <label>Date of Birth</label>
            <input
              v-model="formData.biologicalMother.dateOfBirth"
              type="date"
            />
          </div>
          <div class="form-group full-width">
            <label>Maternal Illnesses</label>
            <textarea
              v-model="formData.biologicalMother.illnesses"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Biological Father -->
        <h5>Biological Father</h5>
        <div class="form-grid">
          <div class="form-group">
            <label>Status *</label>
            <select v-model="formData.biologicalFather.status" required>
              <option value="">Select Status</option>
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div class="form-group">
            <label>First Name</label>
            <input v-model="formData.biologicalFather.firstName" type="text" />
          </div>
          <div class="form-group">
            <label>Surname</label>
            <input v-model="formData.biologicalFather.surname" type="text" />
          </div>
          <div class="form-group">
            <label>Date of Birth</label>
            <input
              v-model="formData.biologicalFather.dateOfBirth"
              type="date"
            />
          </div>
          <div class="form-group full-width">
            <label>Paternal Illnesses</label>
            <textarea
              v-model="formData.biologicalFather.illnesses"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Parents' Relationship Status -->
        <h5>Parents' Current Status</h5>
        <div class="form-group">
          <label>The child's parents are currently: *</label>
          <select v-model="formData.parentsStatus" required>
            <option value="">Select Status</option>
            <option value="Married to each other">Married to each other</option>
            <option value="Living together but not married">
              Living together but not married
            </option>
            <option value="Divorced">Divorced</option>
            <option value="Married to someone else">
              Married to someone else
            </option>
            <option value="Not Married">Not Married</option>
            <option value="Not Applicable">Not Applicable</option>
          </select>
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

      <!-- Section 3: Other Biological Children -->
      <div v-show="currentSection === 3" class="form-section">
        <h4>Other Biological Children in the Family</h4>

        <div
          v-for="(child, index) in formData.biologicalChildren"
          :key="index"
          class="sibling-section"
        >
          <h6>Child {{ index + 1 }}</h6>
          <div class="form-grid">
            <div class="form-group">
              <label>First Name</label>
              <input v-model="child.firstName" type="text" />
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select v-model="child.gender">
                <option value="">Select</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date of Birth</label>
              <input v-model="child.dateOfBirth" type="date" />
            </div>
            <div class="form-group full-width">
              <label>Any Illnesses?</label>
              <textarea v-model="child.illnesses" rows="2"></textarea>
            </div>
            <div class="form-group">
              <button
                type="button"
                class="remove-btn"
                @click="removeBiologicalChild(index)"
              >
                Remove Child
              </button>
            </div>
          </div>
        </div>

        <button type="button" class="add-btn" @click="addBiologicalChild">
          Add Biological Child
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

      <!-- Section 4: Birth History -->
      <div v-show="currentSection === 4" class="form-section">
        <h4>Birth History</h4>
        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.birthPlace }"
          >
            <label>Where was the child born? *</label>
            <input
              v-model="formData.birthHistory.birthPlace"
              type="text"
              required
              @input="clearFieldError('birthPlace')"
            />
            <div v-if="validationErrors.birthPlace" class="error-message">
              {{ validationErrors.birthPlace }}
            </div>
          </div>
          <div class="form-group full-width">
            <label>Were there any complications during pregnancy?</label>
            <textarea
              v-model="formData.birthHistory.pregnancyComplications"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Medications during pregnancy -->
        <div class="form-grid">
          <div class="form-group">
            <label>Medications during pregnancy? *</label>
            <select
              v-model="formData.birthHistory.medicationsDuringPregnancy"
              required
            >
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div
            v-if="formData.birthHistory.medicationsDuringPregnancy === 'Yes'"
            class="form-group full-width"
          >
            <label>If yes, list medications:</label>
            <textarea
              v-model="formData.birthHistory.medicationsList"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Cigarette/Alcohol use -->
        <div class="form-grid">
          <div class="form-group">
            <label>Cigarette/Alcohol use during pregnancy? *</label>
            <select
              v-model="formData.birthHistory.substanceUseDuringPregnancy"
              required
            >
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <!-- Delivery Information -->
        <div class="form-grid">
          <div class="form-group">
            <label>Delivery by *</label>
            <select v-model="formData.birthHistory.deliveryType" required>
              <option value="">Select</option>
              <option value="Vaginal">Vaginal</option>
              <option value="C-section">C-section</option>
            </select>
          </div>
          <div class="form-group">
            <label>Delivery where? *</label>
            <select v-model="formData.birthHistory.deliveryLocation" required>
              <option value="">Select</option>
              <option value="Home">Home</option>
              <option value="Clinic/Hospital">Clinic/Hospital</option>
            </select>
          </div>
        </div>

        <!-- Delivery Complications -->
        <div class="form-grid">
          <div class="form-group">
            <label>Were there complications during delivery? *</label>
            <select
              v-model="formData.birthHistory.deliveryComplications"
              required
            >
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div
            v-if="formData.birthHistory.deliveryComplications === 'Yes'"
            class="form-group full-width"
          >
            <label>If yes, list complications:</label>
            <textarea
              v-model="formData.birthHistory.deliveryComplicationsList"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Premature Birth -->
        <div class="form-grid">
          <div class="form-group">
            <label>Was your child premature? *</label>
            <select v-model="formData.birthHistory.premature" required>
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div
            v-if="formData.birthHistory.premature === 'Yes'"
            class="form-group"
          >
            <label>If yes, born at (weeks)</label>
            <input
              v-model="formData.birthHistory.prematureWeeks"
              type="number"
              min="20"
              max="42"
            />
          </div>
        </div>

        <!-- Infant Response -->
        <div class="form-grid">
          <div class="form-group">
            <label
              >Was the infant alert and responsive within 12 hours of delivery?
              *</label
            >
            <select
              v-model="formData.birthHistory.infantAlertResponsive"
              required
            >
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <!-- Birth Measurements -->
        <div class="form-grid">
          <div class="form-group">
            <label>Birth weight (kg)</label>
            <input
              v-model="formData.birthHistory.birthWeight"
              type="text"
              placeholder="e.g., 3.5"
            />
          </div>
          <div class="form-group">
            <label>Length at birth (cm)</label>
            <input
              v-model="formData.birthHistory.birthLength"
              type="text"
              placeholder="e.g., 50"
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

      <!-- Section 5: Growth and Development -->
      <div v-show="currentSection === 5" class="form-section">
        <h4>Growth and Development</h4>

        <!-- Feeding -->
        <div class="form-grid">
          <div class="form-group">
            <label>Breast fed?</label>
            <select v-model="formData.growthDevelopment.breastFed">
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div
            v-if="formData.growthDevelopment.breastFed === 'Yes'"
            class="form-group"
          >
            <label>How Long? (months)</label>
            <input
              v-model="formData.growthDevelopment.breastFedDuration"
              type="text"
              placeholder="e.g., 6 months"
            />
          </div>
          <div class="form-group">
            <label>Formula Fed?</label>
            <select v-model="formData.growthDevelopment.formulaFed">
              <option value="">Select</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <!-- Developmental Milestones -->
        <h5>At what age (months) did your child:</h5>
        <div class="form-grid">
          <div class="form-group">
            <label>Hold head up?</label>
            <input
              v-model="formData.growthDevelopment.milestones.holdHeadUp"
              type="number"
              min="0"
              max="24"
              placeholder="months"
            />
          </div>
          <div class="form-group">
            <label>Sit up alone?</label>
            <input
              v-model="formData.growthDevelopment.milestones.sitUpAlone"
              type="number"
              min="0"
              max="24"
              placeholder="months"
            />
          </div>
          <div class="form-group">
            <label>Crawl?</label>
            <input
              v-model="formData.growthDevelopment.milestones.crawl"
              type="number"
              min="0"
              max="24"
              placeholder="months"
            />
          </div>
          <div class="form-group">
            <label>Walk?</label>
            <input
              v-model="formData.growthDevelopment.milestones.walk"
              type="number"
              min="0"
              max="36"
              placeholder="months"
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

      <!-- Section 6: Child's Previous Medical History -->
      <div v-show="currentSection === 6" class="form-section">
        <h4>Child's Previous Medical History</h4>
        <p class="section-description">Please tick ALL that apply:</p>

        <div class="checkbox-grid">
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.drainingNoseAllergies"
            />
            Draining nose, allergies
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="
                formData.medicalHistory.conditions.repeatedThroatInfections
              "
            />
            Repeated throat infections
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.difficultyBreathing"
            />
            Difficulty Breathing
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.chronicCough"
            />
            Chronic cough
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="
                formData.medicalHistory.conditions.frequentNauseaVomiting
              "
            />
            Frequent nausea or vomiting
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.skinConditionRashes"
            />
            Skin condition, rashes
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.feversBodyHotness"
            />
            Fevers, body hotness
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.frequentDiarrhea"
            />
            Frequent diarrhea
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.physicalAbnormalities"
            />
            Physical Abnormalities
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.nightSweats"
            />
            Night sweats
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.frequentStomachaches"
            />
            Frequent stomachaches
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.hadPneumonia"
            />
            Has had pneumonia
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.weightLoss"
            />
            Weight loss
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.frequentHeadaches"
            />
            Frequent headaches
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.hadChickenpox"
            />
            Has had chickenpox
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.dizzySpellsFainting"
            />
            Dizzy spells, fainting
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.visionEyeProblems"
            />
            Vision or eye problems
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.hadMeasles"
            />
            Has had measles
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.seizuresFits"
            />
            Seizures/Fits (epilepsy)
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.hearingEarProblems"
            />
            Hearing or ear problems
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="formData.medicalHistory.conditions.hadMumps"
            />
            Has had mumps
          </label>
        </div>

        <!-- General Health Classification -->
        <div class="form-grid">
          <div class="form-group">
            <label>How would you classify your child's general health? *</label>
            <select v-model="formData.medicalHistory.generalHealth" required>
              <option value="">Select</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>

        <!-- Hospitalizations -->
        <div class="form-grid">
          <div class="form-group">
            <label>Has your child ever had any hospitalizations? *</label>
            <select v-model="formData.medicalHistory.hospitalizations" required>
              <option value="">Select</option>
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>
          <div
            v-if="formData.medicalHistory.hospitalizations === 'YES'"
            class="form-group full-width"
          >
            <label>If yes, explain</label>
            <textarea
              v-model="formData.medicalHistory.hospitalizationsExplanation"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Surgical Operations -->
        <div class="form-grid">
          <div class="form-group">
            <label>Has your child ever had any surgical operations? *</label>
            <select
              v-model="formData.medicalHistory.surgicalOperations"
              required
            >
              <option value="">Select</option>
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>
          <div
            v-if="formData.medicalHistory.surgicalOperations === 'YES'"
            class="form-group full-width"
          >
            <label>If yes, explain</label>
            <textarea
              v-model="formData.medicalHistory.surgicalOperationsExplanation"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Broken Bones -->
        <div class="form-grid">
          <div class="form-group">
            <label>Has your child ever had any broken bones? *</label>
            <select v-model="formData.medicalHistory.brokenBones" required>
              <option value="">Select</option>
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>
          <div
            v-if="formData.medicalHistory.brokenBones === 'YES'"
            class="form-group full-width"
          >
            <label>If yes, explain</label>
            <textarea
              v-model="formData.medicalHistory.brokenBonesExplanation"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Additional Medical Information -->
        <div class="form-group full-width">
          <label
            >Is there any other information regarding your child's medical
            history that we should know about?</label
          >
          <textarea
            v-model="formData.medicalHistory.additionalInformation"
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

      <!-- Section 7: Medications -->
      <div v-show="currentSection === 7" class="form-section">
        <h4>Medications</h4>
        <p class="section-description">
          Please list all medications the child is currently taking (including
          over-the-counter, prescription, herbals and vitamins):
        </p>

        <div class="medication-table">
          <table>
            <thead>
              <tr>
                <th>Medication Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(medication, index) in formData.medications.list"
                :key="index"
              >
                <td>
                  <input
                    v-model="medication.name"
                    type="text"
                    placeholder="e.g., Paracetamol"
                  />
                </td>
                <td>
                  <input
                    v-model="medication.dosage"
                    type="text"
                    placeholder="e.g., 500mg"
                  />
                </td>
                <td>
                  <input
                    v-model="medication.frequency"
                    type="text"
                    placeholder="e.g., Twice daily"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    class="remove-btn"
                    @click="removeMedication(index)"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button" class="add-btn" @click="addMedication">
            Add Medication
          </button>
        </div>

        <!-- Medication Allergies -->
        <div class="form-group full-width">
          <label
            >Has your child ever experienced any allergic reaction to any
            medications? If yes, please list what medications and what the
            reaction consisted of:</label
          >
          <textarea
            v-model="formData.medications.allergicReactions"
            rows="3"
            placeholder="List medications and reactions..."
          ></textarea>
        </div>

        <!-- Under-5 Card -->
        <div class="form-grid">
          <div class="form-group">
            <label>Is Under-5 Card available for the child? *</label>
            <select v-model="formData.medications.under5CardAvailable" required>
              <option value="">Select</option>
              <option value="UNKNOWN">UNKNOWN</option>
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>
          <div
            v-if="formData.medications.under5CardAvailable === 'YES'"
            class="form-group"
          >
            <label>If yes, was copy made?</label>
            <select v-model="formData.medications.under5CardCopyMade">
              <option value="">Select</option>
              <option value="NO">NO</option>
              <option value="YES">YES</option>
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

      <!-- Section 8: Details of Pregnancy (Optional) -->
      <div v-show="currentSection === 8" class="form-section">
        <h4>Details of Pregnancy</h4>
        <p class="section-description">
          Complete this section if the child is currently pregnant
        </p>

        <div class="form-grid">
          <div class="form-group">
            <label>Current length of pregnancy (weeks)</label>
            <input
              v-model="formData.pregnancyDetails.pregnancyLength"
              type="number"
              min="0"
              max="42"
              placeholder="e.g., 12"
            />
          </div>
          <div class="form-group">
            <label>Trimester</label>
            <select v-model="formData.pregnancyDetails.trimester">
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        <!-- Morning Sickness -->
        <div class="form-grid">
          <div class="form-group">
            <label
              >Is the girl experiencing morning sickness or nausea
              regularly?</label
            >
            <select v-model="formData.pregnancyDetails.morningSickness">
              <option value="">Select</option>
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>
          <div
            v-if="formData.pregnancyDetails.morningSickness === 'YES'"
            class="form-group full-width"
          >
            <label
              >If yes, explain, listing particular time and/or food
              sensitivities:</label
            >
            <textarea
              v-model="formData.pregnancyDetails.morningSicknessDetails"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Pregnancy Complications -->
        <div class="form-grid">
          <div class="form-group">
            <label>Are there any complications with the pregnancy?</label>
            <select v-model="formData.pregnancyDetails.complications">
              <option value="">Select</option>
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>
          <div
            v-if="formData.pregnancyDetails.complications === 'YES'"
            class="form-group full-width"
          >
            <label>If yes, explain</label>
            <textarea
              v-model="formData.pregnancyDetails.complicationsDetails"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Additional Pregnancy Information -->
        <div class="form-group full-width">
          <label
            >Anything else the TKP staff should be aware of regarding the
            pregnancy?</label
          >
          <textarea
            v-model="formData.pregnancyDetails.additionalNotes"
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

      <!-- Section 9: Staff Signature and Completion -->
      <div v-show="currentSection === 9" class="form-section">
        <h4>Form Completion</h4>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.completedBy }"
          >
            <label>Completed by (TKP Staff) *</label>
            <input
              v-model="formData.completion.completedBy"
              type="text"
              required
              @input="clearFieldError('completedBy')"
            />
            <div v-if="validationErrors.completedBy" class="error-message">
              {{ validationErrors.completedBy }}
            </div>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.completionDate }"
          >
            <label>Date *</label>
            <input
              v-model="formData.completion.completionDate"
              type="date"
              required
              @input="clearFieldError('completionDate')"
            />
            <div v-if="validationErrors.completionDate" class="error-message">
              {{ validationErrors.completionDate }}
            </div>
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
            {{ loading ? "Saving..." : "Submit Medical Assessment" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useToast } from "../composables/useToast.js";
import formService from "../services/formService.js";

const emit = defineEmits(["form-saved"]);
const { success, error } = useToast();

const loading = ref(false);

// Section navigation
const currentSection = ref(1);
const totalSections = 9;

const progressPercentage = computed(() => {
  return (currentSection.value / totalSections) * 100;
});

const sectionNames = [
  "Child Information",
  "Biological Parents",
  "Other Biological Children",
  "Birth History",
  "Growth and Development",
  "Medical History",
  "Medications",
  "Pregnancy Details",
  "Form Completion",
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
    formData.dateOfBirth &&
    formData.informationProvider;
  status.push(section1Complete);

  // Section 2: Biological Parents
  const section2Complete =
    formData.biologicalMother.status &&
    formData.biologicalFather.status &&
    formData.parentsStatus;
  status.push(section2Complete);

  // Section 3: Other Biological Children (optional)
  status.push(true);

  // Section 4: Birth History
  const section4Complete =
    formData.birthHistory.birthPlace &&
    formData.birthHistory.medicationsDuringPregnancy &&
    formData.birthHistory.substanceUseDuringPregnancy &&
    formData.birthHistory.deliveryType &&
    formData.birthHistory.deliveryLocation &&
    formData.birthHistory.deliveryComplications &&
    formData.birthHistory.premature &&
    formData.birthHistory.infantAlertResponsive;
  status.push(section4Complete);

  // Section 5: Growth and Development (optional)
  status.push(true);

  // Section 6: Medical History
  const section6Complete =
    formData.medicalHistory.generalHealth &&
    formData.medicalHistory.hospitalizations &&
    formData.medicalHistory.surgicalOperations &&
    formData.medicalHistory.brokenBones;
  status.push(section6Complete);

  // Section 7: Medications
  const section7Complete = formData.medications.under5CardAvailable;
  status.push(section7Complete);

  // Section 8: Pregnancy Details (optional)
  status.push(true);

  // Section 9: Form Completion
  const section9Complete =
    formData.completion.completedBy && formData.completion.completionDate;
  status.push(section9Complete);

  return status;
});

const completedSections = computed(() => {
  return sectionCompletionStatus.value.filter((status) => status).length;
});

const overallCompletion = computed(() => {
  const requiredSections = [0, 1, 3, 5, 6, 8]; // Indices of required sections
  const completedRequired = requiredSections.filter(
    (index) => sectionCompletionStatus.value[index]
  ).length;
  return Math.round((completedRequired / requiredSections.length) * 100);
});

// Validation error messages
const validationErrors = ref({});
const showValidationMessage = ref(false);

// Clear validation error for specific field
const clearFieldError = (fieldName) => {
  if (validationErrors.value[fieldName]) {
    delete validationErrors.value[fieldName];
    validationErrors.value = { ...validationErrors.value };
  }
};

// Section validation rules
const sectionValidationRules = {
  1: ["childFirstName", "childSurname", "dateOfBirth", "informationProvider"],
  2: [], // Validated through reactive selects
  3: [], // Optional
  4: ["birthHistory.birthPlace"],
  5: [], // Optional
  6: [], // Validated through reactive selects
  7: [], // Validated through reactive selects
  8: [], // Optional
  9: ["completion.completedBy", "completion.completionDate"],
};

// Validate current section
const validateCurrentSection = () => {
  const requiredFields = sectionValidationRules[currentSection.value] || [];
  const errors = {};
  let isValid = true;

  // Check regular required fields
  requiredFields.forEach((fieldName) => {
    let value;
    if (fieldName.includes(".")) {
      const keys = fieldName.split(".");
      value = formData[keys[0]]?.[keys[1]];
    } else {
      value = formData[fieldName];
    }

    if (!value || (typeof value === "string" && value.trim() === "")) {
      // Use the last part of the field path as the error key for template binding
      const errorKey = fieldName.includes(".")
        ? fieldName.split(".").pop()
        : fieldName;
      errors[errorKey] = getFieldDisplayName(fieldName) + " is required";
      isValid = false;
    }
  });

  validationErrors.value = errors;
  return isValid;
};

// Get user-friendly field names
const getFieldDisplayName = (fieldName) => {
  const fieldNames = {
    childFirstName: "First Name",
    childSurname: "Surname",
    dateOfBirth: "Date of Birth",
    informationProvider: "Information Provider",
    "birthHistory.birthPlace": "Birth Place",
    birthPlace: "Birth Place",
    "completion.completedBy": "Completed By",
    completedBy: "Completed By",
    "completion.completionDate": "Completion Date",
    completionDate: "Completion Date",
  };
  return fieldNames[fieldName] || fieldName;
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
  // Section 1: Child Information
  childFirstName: "",
  childMiddleName: "",
  childSurname: "",
  otherKnownNames: "",
  dateOfBirth: "",
  informationProvider: "",
  informationProviderOther: "",

  // Section 2: Biological Parents
  biologicalMother: {
    status: "",
    firstName: "",
    maidenName: "",
    dateOfBirth: "",
    illnesses: "",
  },

  biologicalFather: {
    status: "",
    firstName: "",
    surname: "",
    dateOfBirth: "",
    illnesses: "",
  },

  parentsStatus: "",

  // Section 3: Other Biological Children
  biologicalChildren: [],

  // Section 4: Birth History
  birthHistory: {
    birthPlace: "",
    pregnancyComplications: "",
    medicationsDuringPregnancy: "",
    medicationsList: "",
    substanceUseDuringPregnancy: "",
    deliveryType: "",
    deliveryLocation: "",
    deliveryComplications: "",
    deliveryComplicationsList: "",
    premature: "",
    prematureWeeks: "",
    infantAlertResponsive: "",
    birthWeight: "",
    birthLength: "",
  },

  // Section 5: Growth and Development
  growthDevelopment: {
    breastFed: "",
    breastFedDuration: "",
    formulaFed: "",
    milestones: {
      holdHeadUp: "",
      sitUpAlone: "",
      crawl: "",
      walk: "",
    },
  },

  // Section 6: Medical History
  medicalHistory: {
    conditions: {
      drainingNoseAllergies: false,
      repeatedThroatInfections: false,
      difficultyBreathing: false,
      chronicCough: false,
      frequentNauseaVomiting: false,
      skinConditionRashes: false,
      feversBodyHotness: false,
      frequentDiarrhea: false,
      physicalAbnormalities: false,
      nightSweats: false,
      frequentStomachaches: false,
      hadPneumonia: false,
      weightLoss: false,
      frequentHeadaches: false,
      hadChickenpox: false,
      dizzySpellsFainting: false,
      visionEyeProblems: false,
      hadMeasles: false,
      seizuresFits: false,
      hearingEarProblems: false,
      hadMumps: false,
    },
    generalHealth: "",
    hospitalizations: "",
    hospitalizationsExplanation: "",
    surgicalOperations: "",
    surgicalOperationsExplanation: "",
    brokenBones: "",
    brokenBonesExplanation: "",
    additionalInformation: "",
  },

  // Section 7: Medications
  medications: {
    list: [],
    allergicReactions: "",
    under5CardAvailable: "",
    under5CardCopyMade: "",
  },

  // Section 8: Pregnancy Details
  pregnancyDetails: {
    pregnancyLength: "",
    trimester: "",
    morningSickness: "",
    morningSicknessDetails: "",
    complications: "",
    complicationsDetails: "",
    additionalNotes: "",
  },

  // Section 9: Form Completion
  completion: {
    completedBy: "",
    completionDate: "",
  },
});

// Add/Remove Biological Children
const addBiologicalChild = () => {
  formData.biologicalChildren.push({
    firstName: "",
    gender: "",
    dateOfBirth: "",
    illnesses: "",
  });
};

const removeBiologicalChild = (index) => {
  formData.biologicalChildren.splice(index, 1);
};

// Add/Remove Medications
const addMedication = () => {
  formData.medications.list.push({
    name: "",
    dosage: "",
    frequency: "",
  });
};

const removeMedication = (index) => {
  formData.medications.list.splice(index, 1);
};

// Form validation
const validateRequiredFields = () => {
  const errors = [];

  // Section 1: Child Information
  if (!formData.childFirstName.trim())
    errors.push("Child First Name is required");
  if (!formData.childSurname.trim()) errors.push("Child Surname is required");
  if (!formData.dateOfBirth) errors.push("Date of Birth is required");
  if (!formData.informationProvider)
    errors.push("Information Provider is required");
  if (
    formData.informationProvider === "Other" &&
    !formData.informationProviderOther.trim()
  ) {
    errors.push("Please explain who is providing the information");
  }

  // Section 2: Biological Parents
  if (!formData.biologicalMother.status)
    errors.push("Biological Mother Status is required");
  if (!formData.biologicalFather.status)
    errors.push("Biological Father Status is required");
  if (!formData.parentsStatus)
    errors.push("Parents Current Status is required");

  // Section 4: Birth History
  if (!formData.birthHistory.birthPlace.trim())
    errors.push("Birth Place is required");
  if (!formData.birthHistory.medicationsDuringPregnancy)
    errors.push("Medications during pregnancy status is required");
  if (!formData.birthHistory.substanceUseDuringPregnancy)
    errors.push("Substance use during pregnancy status is required");
  if (!formData.birthHistory.deliveryType)
    errors.push("Delivery Type is required");
  if (!formData.birthHistory.deliveryLocation)
    errors.push("Delivery Location is required");
  if (!formData.birthHistory.deliveryComplications)
    errors.push("Delivery Complications status is required");
  if (!formData.birthHistory.premature)
    errors.push("Premature birth status is required");
  if (!formData.birthHistory.infantAlertResponsive)
    errors.push("Infant alert/responsive status is required");

  // Section 6: Medical History
  if (!formData.medicalHistory.generalHealth)
    errors.push("General Health classification is required");
  if (!formData.medicalHistory.hospitalizations)
    errors.push("Hospitalizations status is required");
  if (!formData.medicalHistory.surgicalOperations)
    errors.push("Surgical Operations status is required");
  if (!formData.medicalHistory.brokenBones)
    errors.push("Broken Bones status is required");

  // Section 7: Medications
  if (!formData.medications.under5CardAvailable)
    errors.push("Under-5 Card availability status is required");

  // Section 9: Form Completion
  if (!formData.completion.completedBy.trim())
    errors.push("Completed By (Staff Name) is required");
  if (!formData.completion.completionDate)
    errors.push("Completion Date is required");

  return errors;
};

// Submit form
const handleSubmit = async () => {
  const errors = validateRequiredFields();

  if (errors.length > 0) {
    validationErrors.value = {};
    errors.forEach((err, index) => {
      validationErrors.value[`error_${index}`] = err;
    });
    showValidationMessage.value = true;
    error("Please complete all required fields before submitting");
    return;
  }

  loading.value = true;

  try {
    const result = await formService.saveMedicalIntakeAssessment(formData);

    if (result.success) {
      success("Medical Intake Assessment saved successfully!");
      emit("form-saved", result.id);

      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 2000);
    } else {
      error(result.error || "Failed to save Medical Intake Assessment");
    }
  } catch (err) {
    console.error("Error saving form:", err);
    error("An error occurred while saving the form");
  } finally {
    loading.value = false;
  }
};

// Reset form
const resetForm = () => {
  // Reset all form data
  formData.childFirstName = "";
  formData.childMiddleName = "";
  formData.childSurname = "";
  formData.otherKnownNames = "";
  formData.dateOfBirth = "";
  formData.informationProvider = "";
  formData.informationProviderOther = "";

  formData.biologicalMother = {
    status: "",
    firstName: "",
    maidenName: "",
    dateOfBirth: "",
    illnesses: "",
  };

  formData.biologicalFather = {
    status: "",
    firstName: "",
    surname: "",
    dateOfBirth: "",
    illnesses: "",
  };

  formData.parentsStatus = "";
  formData.biologicalChildren = [];

  formData.birthHistory = {
    birthPlace: "",
    pregnancyComplications: "",
    medicationsDuringPregnancy: "",
    medicationsList: "",
    substanceUseDuringPregnancy: "",
    deliveryType: "",
    deliveryLocation: "",
    deliveryComplications: "",
    deliveryComplicationsList: "",
    premature: "",
    prematureWeeks: "",
    infantAlertResponsive: "",
    birthWeight: "",
    birthLength: "",
  };

  formData.growthDevelopment = {
    breastFed: "",
    breastFedDuration: "",
    formulaFed: "",
    milestones: {
      holdHeadUp: "",
      sitUpAlone: "",
      crawl: "",
      walk: "",
    },
  };

  formData.medicalHistory = {
    conditions: {
      drainingNoseAllergies: false,
      repeatedThroatInfections: false,
      difficultyBreathing: false,
      chronicCough: false,
      frequentNauseaVomiting: false,
      skinConditionRashes: false,
      feversBodyHotness: false,
      frequentDiarrhea: false,
      physicalAbnormalities: false,
      nightSweats: false,
      frequentStomachaches: false,
      hadPneumonia: false,
      weightLoss: false,
      frequentHeadaches: false,
      hadChickenpox: false,
      dizzySpellsFainting: false,
      visionEyeProblems: false,
      hadMeasles: false,
      seizuresFits: false,
      hearingEarProblems: false,
      hadMumps: false,
    },
    generalHealth: "",
    hospitalizations: "",
    hospitalizationsExplanation: "",
    surgicalOperations: "",
    surgicalOperationsExplanation: "",
    brokenBones: "",
    brokenBonesExplanation: "",
    additionalInformation: "",
  };

  formData.medications = {
    list: [],
    allergicReactions: "",
    under5CardAvailable: "",
    under5CardCopyMade: "",
  };

  formData.pregnancyDetails = {
    pregnancyLength: "",
    trimester: "",
    morningSickness: "",
    morningSicknessDetails: "",
    complications: "",
    complicationsDetails: "",
    additionalNotes: "",
  };

  formData.completion = {
    completedBy: "",
    completionDate: "",
  };

  // Reset section navigation
  currentSection.value = 1;
  validationErrors.value = {};
  showValidationMessage.value = false;
};
</script>

<style scoped>
.form-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-header h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #6b7280;
  font-size: 0.95rem;
}

.form-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  transition: width 0.3s ease;
}

.form-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.section-title {
  font-size: 0.95rem;
  color: #1f2937;
  font-weight: 600;
}

.validation-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.validation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.validation-list {
  list-style: none;
  padding-left: 1.75rem;
  margin: 0;
}

.validation-item {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.validation-item::before {
  content: "• ";
  margin-right: 0.5rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-section h5 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 1.5rem 0 1rem 0;
}

.form-section h6 {
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
  margin: 1rem 0 0.75rem 0;
}

.section-description {
  color: #6b7280;
  font-size: 0.925rem;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.925rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.925rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group.has-error input,
.form-group.has-error select,
.form-group.has-error textarea {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
}

.checkbox-item:hover {
  background-color: #f9fafb;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.sibling-section {
  background-color: #f9fafb;
  padding: 1.25rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
}

.medication-table {
  margin-bottom: 1.5rem;
}

.medication-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.medication-table thead {
  background-color: #f9fafb;
}

.medication-table th,
.medication-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #e5e7eb;
}

.medication-table th {
  font-weight: 600;
  color: #374151;
  font-size: 0.925rem;
}

.medication-table td input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.section-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.prev-btn,
.next-btn,
.submit-btn,
.add-btn,
.remove-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.925rem;
}

.prev-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.prev-btn:hover {
  background-color: #e5e7eb;
}

.next-btn {
  background-color: #3b82f6;
  color: white;
  margin-left: auto;
}

.next-btn:hover {
  background-color: #2563eb;
}

.submit-btn {
  background-color: #10b981;
  color: white;
  margin-left: auto;
}

.submit-btn:hover:not(:disabled) {
  background-color: #059669;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.add-btn {
  background-color: #3b82f6;
  color: white;
}

.add-btn:hover {
  background-color: #2563eb;
}

.remove-btn {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
}

.remove-btn:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .form-wrapper {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .section-navigation {
    flex-direction: column;
  }

  .next-btn,
  .submit-btn {
    margin-left: 0;
  }
}
</style>
