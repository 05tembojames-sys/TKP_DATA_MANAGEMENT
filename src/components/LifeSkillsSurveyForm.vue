<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3>Life Skills Survey</h3>
      <p>Assessment of girl's independence in daily living skills</p>
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

    <div class="life-skills-form">
      <!-- Section 1: Girl Information -->
      <div v-show="currentSection === 1" class="form-section">
        <h4>Girl Information</h4>
        <div class="form-grid">
          <div
            class="form-group full-width"
            :class="{ 'has-error': validationErrors.nameOfGirl }"
          >
            <label>Name of Girl *</label>
            <input
              v-model="formData.nameOfGirl"
              type="text"
              required
              @input="clearFieldError('nameOfGirl')"
            />
            <div v-if="validationErrors.nameOfGirl" class="error-message">
              {{ validationErrors.nameOfGirl }}
            </div>
          </div>
          <div class="form-group">
            <label>Girl's Age (years)</label>
            <input v-model="formData.girlAge" type="number" min="0" max="25" />
          </div>
          <div class="form-group">
            <label>Grade</label>
            <input
              v-model="formData.grade"
              type="text"
              placeholder="e.g., Grade 7"
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.dateOfAdmission }"
          >
            <label>Date of Admission *</label>
            <input
              v-model="formData.dateOfAdmission"
              type="date"
              required
              @input="clearFieldError('dateOfAdmission')"
            />
            <div v-if="validationErrors.dateOfAdmission" class="error-message">
              {{ validationErrors.dateOfAdmission }}
            </div>
          </div>
          <div class="form-group">
            <label>Baby's Age (months)</label>
            <input v-model="formData.babyAge" type="number" min="0" max="60" />
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.dateOfAssessment }"
          >
            <label>Date of Assessment *</label>
            <input
              v-model="formData.dateOfAssessment"
              type="date"
              required
              @input="clearFieldError('dateOfAssessment')"
            />
            <div v-if="validationErrors.dateOfAssessment" class="error-message">
              {{ validationErrors.dateOfAssessment }}
            </div>
          </div>
        </div>

        <div class="section-navigation">
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Section 2: Personal Hygiene -->
      <div v-show="currentSection === 2" class="form-section">
        <h4>Personal Hygiene</h4>
        <p class="helper-text">
          Rate the level of independence with which the girl is able to carry
          out tasks
        </p>

        <div class="skills-table">
          <div class="table-header">
            <div class="col-skill">Skill</div>
            <div class="col-rating">Does Not Do</div>
            <div class="col-rating">Does with Lots of Help</div>
            <div class="col-rating">Does with Some Help</div>
            <div class="col-rating">Does with Minimal Help</div>
            <div class="col-rating">Does Independently</div>
          </div>

          <div
            v-for="skill in personalHygieneSkills"
            :key="skill.key"
            class="table-row"
          >
            <div class="col-skill">{{ skill.label }}</div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHygiene[skill.key]"
                value="Does Not Do"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHygiene[skill.key]"
                value="Does with Lots of Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHygiene[skill.key]"
                value="Does with Some Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHygiene[skill.key]"
                value="Does with Minimal Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHygiene[skill.key]"
                value="Does Independently"
              />
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Additional Comments</label>
          <textarea
            v-model="formData.personalHygiene.comments"
            rows="3"
            placeholder="Add any additional comments..."
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

      <!-- Section 3: Household Chores and Tasks -->
      <div v-show="currentSection === 3" class="form-section">
        <h4>Household Chores and Tasks</h4>

        <div class="skills-table">
          <div class="table-header">
            <div class="col-skill">Skill</div>
            <div class="col-rating">Does Not Do</div>
            <div class="col-rating">Does with Lots of Help</div>
            <div class="col-rating">Does with Some Help</div>
            <div class="col-rating">Does with Minimal Help</div>
            <div class="col-rating">Does Independently</div>
          </div>

          <div
            v-for="skill in householdChoresSkills"
            :key="skill.key"
            class="table-row"
          >
            <div class="col-skill">{{ skill.label }}</div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.householdChores[skill.key]"
                value="Does Not Do"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.householdChores[skill.key]"
                value="Does with Lots of Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.householdChores[skill.key]"
                value="Does with Some Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.householdChores[skill.key]"
                value="Does with Minimal Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.householdChores[skill.key]"
                value="Does Independently"
              />
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Additional Comments</label>
          <textarea
            v-model="formData.householdChores.comments"
            rows="3"
            placeholder="Add any additional comments..."
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

      <!-- Section 4: Personal Health and Medical Care -->
      <div v-show="currentSection === 4" class="form-section">
        <h4>Personal Health and Medical Care</h4>

        <div class="skills-table">
          <div class="table-header">
            <div class="col-skill">Skill</div>
            <div class="col-rating">Does Not Do</div>
            <div class="col-rating">Does with Lots of Help</div>
            <div class="col-rating">Does with Some Help</div>
            <div class="col-rating">Does with Minimal Help</div>
            <div class="col-rating">Does Independently</div>
          </div>

          <div
            v-for="skill in personalHealthSkills"
            :key="skill.key"
            class="table-row"
          >
            <div class="col-skill">
              {{ skill.label }}
              <span v-if="skill.key === 'chronicHealthStatus'">
                <label class="inline-checkbox">
                  <input
                    type="checkbox"
                    v-model="formData.personalHealth.chronicHealthNA"
                  />
                  <span>N/A</span>
                </label>
              </span>
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHealth[skill.key]"
                value="Does Not Do"
                :disabled="
                  skill.key === 'chronicHealthStatus' &&
                  formData.personalHealth.chronicHealthNA
                "
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHealth[skill.key]"
                value="Does with Lots of Help"
                :disabled="
                  skill.key === 'chronicHealthStatus' &&
                  formData.personalHealth.chronicHealthNA
                "
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHealth[skill.key]"
                value="Does with Some Help"
                :disabled="
                  skill.key === 'chronicHealthStatus' &&
                  formData.personalHealth.chronicHealthNA
                "
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHealth[skill.key]"
                value="Does with Minimal Help"
                :disabled="
                  skill.key === 'chronicHealthStatus' &&
                  formData.personalHealth.chronicHealthNA
                "
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.personalHealth[skill.key]"
                value="Does Independently"
                :disabled="
                  skill.key === 'chronicHealthStatus' &&
                  formData.personalHealth.chronicHealthNA
                "
              />
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Additional Comments</label>
          <textarea
            v-model="formData.personalHealth.comments"
            rows="3"
            placeholder="Add any additional comments..."
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

      <!-- Section 5: Community and Society Skills -->
      <div v-show="currentSection === 5" class="form-section">
        <h4>Community and Society Skills</h4>

        <div class="skills-table">
          <div class="table-header">
            <div class="col-skill">Skill</div>
            <div class="col-rating">Does Not Do</div>
            <div class="col-rating">Does with Lots of Help</div>
            <div class="col-rating">Does with Some Help</div>
            <div class="col-rating">Does with Minimal Help</div>
            <div class="col-rating">Does Independently</div>
          </div>

          <div
            v-for="skill in communitySkills"
            :key="skill.key"
            class="table-row"
          >
            <div class="col-skill">{{ skill.label }}</div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.communitySkills[skill.key]"
                value="Does Not Do"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.communitySkills[skill.key]"
                value="Does with Lots of Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.communitySkills[skill.key]"
                value="Does with Some Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.communitySkills[skill.key]"
                value="Does with Minimal Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.communitySkills[skill.key]"
                value="Does Independently"
              />
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Additional Comments</label>
          <textarea
            v-model="formData.communitySkills.comments"
            rows="3"
            placeholder="Add any additional comments..."
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

      <!-- Section 6: Food Preparation and Safety Skills -->
      <div v-show="currentSection === 6" class="form-section">
        <h4>Food Preparation and Safety Skills</h4>

        <div class="skills-table">
          <div class="table-header">
            <div class="col-skill">Skill</div>
            <div class="col-rating">Does Not Do</div>
            <div class="col-rating">Does with Lots of Help</div>
            <div class="col-rating">Does with Some Help</div>
            <div class="col-rating">Does with Minimal Help</div>
            <div class="col-rating">Does Independently</div>
          </div>

          <div
            v-for="skill in foodPrepSkills"
            :key="skill.key"
            class="table-row"
          >
            <div class="col-skill">{{ skill.label }}</div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.foodPrepSkills[skill.key]"
                value="Does Not Do"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.foodPrepSkills[skill.key]"
                value="Does with Lots of Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.foodPrepSkills[skill.key]"
                value="Does with Some Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.foodPrepSkills[skill.key]"
                value="Does with Minimal Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.foodPrepSkills[skill.key]"
                value="Does Independently"
              />
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Nutrition and Additional Comments</label>
          <textarea
            v-model="formData.foodPrepSkills.comments"
            rows="3"
            placeholder="Add any comments about nutrition and food preparation..."
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

      <!-- Section 7: Mothering Skills -->
      <div v-show="currentSection === 7" class="form-section">
        <h4>Mothering Skills</h4>

        <div class="skills-table">
          <div class="table-header">
            <div class="col-skill">Skill</div>
            <div class="col-rating">Does Not Do</div>
            <div class="col-rating">Does with Lots of Help</div>
            <div class="col-rating">Does with Some Help</div>
            <div class="col-rating">Does with Minimal Help</div>
            <div class="col-rating">Does Independently</div>
          </div>

          <div
            v-for="skill in motheringSkills"
            :key="skill.key"
            class="table-row"
          >
            <div class="col-skill">{{ skill.label }}</div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does Not Do"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does with Lots of Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does with Some Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does with Minimal Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does Independently"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Has the girl received any CPR/First Aid training?</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.motheringSkills.cprFirstAidTraining"
                value="NO"
              />
              <span>NO</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.motheringSkills.cprFirstAidTraining"
                value="YES"
              />
              <span>YES</span>
            </label>
          </div>
        </div>

        <div class="info-box">
          <p>
            <strong>Note:</strong> Continue filling out the questions below if
            the girl is assuming the primary caregiving responsibility for the
            baby. If not, you may skip to goals section.
          </p>
        </div>

        <div class="skills-table">
          <div class="table-header">
            <div class="col-skill">Primary Caregiving Skills</div>
            <div class="col-rating">Does Not Do</div>
            <div class="col-rating">Does with Lots of Help</div>
            <div class="col-rating">Does with Some Help</div>
            <div class="col-rating">Does with Minimal Help</div>
            <div class="col-rating">Does Independently</div>
          </div>

          <div
            v-for="skill in primaryCaregivingSkills"
            :key="skill.key"
            class="table-row"
          >
            <div class="col-skill">{{ skill.label }}</div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does Not Do"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does with Lots of Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does with Some Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does with Minimal Help"
              />
            </div>
            <div class="col-rating">
              <input
                type="radio"
                :name="skill.key"
                v-model="formData.motheringSkills[skill.key]"
                value="Does Independently"
              />
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Nutrition and Additional Comments</label>
          <textarea
            v-model="formData.motheringSkills.comments"
            rows="3"
            placeholder="Add any comments about mothering skills..."
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

      <!-- Section 8: Life Skills Goals -->
      <div v-show="currentSection === 8" class="form-section">
        <h4>Life Skills Goals for Improvement</h4>
        <p class="helper-text">
          Describe a brief goal for life skill development in each category.
          Goals should be specific to areas of improvement needed for the
          individual girl.
        </p>

        <div class="goals-grid">
          <div class="goal-item">
            <label>Personal Hygiene</label>
            <textarea
              v-model="formData.goals.personalHygiene"
              rows="3"
              placeholder="Describe goals for personal hygiene improvement..."
            ></textarea>
          </div>

          <div class="goal-item">
            <label>Personal Health and Medical Care</label>
            <textarea
              v-model="formData.goals.personalHealth"
              rows="3"
              placeholder="Describe goals for personal health improvement..."
            ></textarea>
          </div>

          <div class="goal-item">
            <label>Household Chores and Tasks</label>
            <textarea
              v-model="formData.goals.householdChores"
              rows="3"
              placeholder="Describe goals for household tasks improvement..."
            ></textarea>
          </div>

          <div class="goal-item">
            <label>Community and Society Skills</label>
            <textarea
              v-model="formData.goals.communitySkills"
              rows="3"
              placeholder="Describe goals for community skills improvement..."
            ></textarea>
          </div>

          <div class="goal-item">
            <label>Food Preparation Skills</label>
            <textarea
              v-model="formData.goals.foodPrepSkills"
              rows="3"
              placeholder="Describe goals for food preparation improvement..."
            ></textarea>
          </div>

          <div class="goal-item">
            <label>Mothering Skills</label>
            <textarea
              v-model="formData.goals.motheringSkills"
              rows="3"
              placeholder="Describe goals for mothering skills improvement..."
            ></textarea>
          </div>
        </div>

        <div class="form-group">
          <label>Date of Next Assessment (3 months from now)</label>
          <input v-model="formData.nextAssessmentDate" type="date" />
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

      <!-- Section 9: Assessment Completed By -->
      <div v-show="currentSection === 9" class="form-section">
        <h4>Assessment Completed By</h4>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.socialWorkerName }"
          >
            <label>Social Worker Name *</label>
            <input
              v-model="formData.completedBy.socialWorkerName"
              type="text"
              required
              @input="clearFieldError('socialWorkerName')"
            />
            <div v-if="validationErrors.socialWorkerName" class="error-message">
              {{ validationErrors.socialWorkerName }}
            </div>
          </div>
          <div class="form-group">
            <label>Social Worker Signature</label>
            <input
              v-model="formData.completedBy.socialWorkerSignature"
              type="text"
              placeholder="Type name for signature"
            />
          </div>

          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.houseMotherName }"
          >
            <label>House Mother Name *</label>
            <input
              v-model="formData.completedBy.houseMotherName"
              type="text"
              required
              @input="clearFieldError('houseMotherName')"
            />
            <div v-if="validationErrors.houseMotherName" class="error-message">
              {{ validationErrors.houseMotherName }}
            </div>
          </div>
          <div class="form-group">
            <label>House Mother Signature</label>
            <input
              v-model="formData.completedBy.houseMotherSignature"
              type="text"
              placeholder="Type name for signature"
            />
          </div>

          <div class="form-group">
            <label>House Mother 2 Name (optional)</label>
            <input
              v-model="formData.completedBy.houseMother2Name"
              type="text"
            />
          </div>
          <div class="form-group">
            <label>House Mother 2 Signature</label>
            <input
              v-model="formData.completedBy.houseMother2Signature"
              type="text"
              placeholder="Type name for signature"
            />
          </div>
        </div>

        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="submit-btn" @click="submitForm">
            Submit Survey
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import FormService from "../services/formService.js";

const emit = defineEmits(["form-saved"]);

const totalSections = 9;
const currentSection = ref(1);
const showValidationMessage = ref(false);
const validationErrors = ref({});

// Skills definitions
const personalHygieneSkills = [
  {
    key: "batheClean",
    label: "Does the girl know how to bathe and clean herself properly?",
  },
  { key: "washHands", label: "Does the girl know how to wash her hands?" },
  { key: "brushTeeth", label: "Can the girl brush her teeth independently?" },
  { key: "useToilet", label: "Does the girl know how to use the toilet?" },
  {
    key: "personalGrooming",
    label:
      "Does the girl seem to manage her own personal grooming (fixing hair, lotion, regularly showers)?",
  },
];

const householdChoresSkills = [
  { key: "washClothes", label: "Can the girl wash clothes independently?" },
  { key: "ironClothes", label: "Does the girl know how to iron clothes?" },
  { key: "cleanToilet", label: "Does the girl know how to clean the toilet?" },
  { key: "cleanFloors", label: "Does the girl know how to clean floors?" },
  { key: "makeBed", label: "Does the girl know how to make the bed?" },
  { key: "sew", label: "Does the girl know how to sew clothes with a needle?" },
  { key: "garden", label: "Does the girl know how to garden?" },
];

const personalHealthSkills = [
  {
    key: "describeSymptoms",
    label: "Does the girl understand how to describe her symptoms when ill?",
  },
  {
    key: "chronicHealthStatus",
    label: "Does the girl understand her chronic health status?",
  },
  {
    key: "administerMedication",
    label:
      "If taking routine medication, does the girl administer medications independently?",
  },
  {
    key: "firstAid",
    label:
      "Does the girl know basic first aid skills? (i.e. cleaning open wounds, applying bandage, etc)",
  },
  {
    key: "manageMenstrual",
    label:
      "Does the girl know how to manage her menstrual periods (hygiene, etc.)?",
  },
];

const communitySkills = [
  {
    key: "publicTransport",
    label: "Does the girl know how to use public transport?",
  },
  {
    key: "makePurchase",
    label: "Does the girl know how to make a purchase in a store?",
  },
  {
    key: "peopleSmarts",
    label:
      'Does the girl have "people smarts" and know how to avoid danger in the community?',
  },
  {
    key: "usePhone",
    label: "Does the girl know how to use the phone/make a phone call?",
  },
  {
    key: "appropriateClothing",
    label:
      "Does the girl know how to choose appropriate clothing depending on the situation?",
  },
];

const foodPrepSkills = [
  {
    key: "cookMeals",
    label: "Does the girl know how to prepare and cook meals?",
  },
  {
    key: "useBrazier",
    label: "Does the girl know how to safely use a brazier?",
  },
  {
    key: "useElectricStove",
    label: "Does the girl know how to safely use an electric stove/cooker?",
  },
  {
    key: "storeFood",
    label: "Does the girl know how to safely store leftover food?",
  },
  {
    key: "useKitchenTools",
    label:
      "Does the girl know how to use common kitchen tools? (not including electrical appliances)",
  },
  { key: "cleanDishes", label: "Does the girl know how to clean dishes?" },
  {
    key: "cleanKitchen",
    label:
      "Does the girl know how to properly clean the kitchen after cooking?",
  },
];

const motheringSkills = [
  {
    key: "changeDiapers",
    label:
      "Does the girl know how to properly change, clean, and put on the reusable diapers?",
  },
  {
    key: "clotheBaby",
    label:
      "Does the girl independently clothe her baby in correctly sized, weather-appropriate clothing?",
  },
  {
    key: "playWithBaby",
    label:
      "Does the girl interactively play with baby? (i.e. reading books, walking around outside, using developmental toys, etc)",
  },
  {
    key: "ageAppropriateItems",
    label:
      "Does the girl know how to determine which items and toys are age-appropriate for baby?",
  },
  {
    key: "identifyIllness",
    label:
      "Is the girl able to identify signs that her baby is not feeling well, running a fever, etc?",
  },
  {
    key: "attendToCrying",
    label:
      "When crying, is the girl quick and attentive in caring for baby and addressing baby's need?",
  },
  {
    key: "trySolutions",
    label:
      "When crying, does the girl try various solutions before using the pacifier/breast to quiet baby? (i.e. check diaper, assess if ill/in pain, too hot/cold)",
  },
];

const primaryCaregivingSkills = [
  {
    key: "batheBaby",
    label: "Does the girl know how to properly bathe her baby?",
  },
  {
    key: "swaddleBaby",
    label: "Does the girl know how to properly swaddle her baby?",
  },
  {
    key: "maintainSchedule",
    label:
      "Does the girl independently maintain her baby's schedule (eat/wake/sleep)?",
  },
  {
    key: "useBreastPump",
    label:
      "Does the girl know how to use, clean, and maintain the breast pump?",
  },
  {
    key: "storeBreastMilk",
    label: "Does the girl know how to properly store breast milk/formula?",
  },
  {
    key: "prepareBabyFood",
    label:
      "Does the girl know how to independently prepare breast milk/baby food?",
  },
];

// Initialize form data
const initSkillsObject = (skills) => {
  const obj = { comments: "" };
  skills.forEach((skill) => {
    obj[skill.key] = "";
  });
  return obj;
};

const formData = ref({
  // Section 1
  nameOfGirl: "",
  girlAge: null,
  grade: "",
  dateOfAdmission: "",
  babyAge: null,
  dateOfAssessment: "",

  // Section 2-7: Skills assessments
  personalHygiene: initSkillsObject(personalHygieneSkills),
  householdChores: initSkillsObject(householdChoresSkills),
  personalHealth: {
    ...initSkillsObject(personalHealthSkills),
    chronicHealthNA: false,
  },
  communitySkills: initSkillsObject(communitySkills),
  foodPrepSkills: initSkillsObject(foodPrepSkills),
  motheringSkills: {
    ...initSkillsObject([...motheringSkills, ...primaryCaregivingSkills]),
    cprFirstAidTraining: "",
  },

  // Section 8: Goals
  goals: {
    personalHygiene: "",
    personalHealth: "",
    householdChores: "",
    communitySkills: "",
    foodPrepSkills: "",
    motheringSkills: "",
  },

  nextAssessmentDate: "",

  // Section 9: Completed By
  completedBy: {
    socialWorkerName: "",
    socialWorkerSignature: "",
    houseMotherName: "",
    houseMotherSignature: "",
    houseMother2Name: "",
    houseMother2Signature: "",
  },
});

const currentSectionName = computed(() => {
  const names = {
    1: "Girl Information",
    2: "Personal Hygiene",
    3: "Household Chores and Tasks",
    4: "Personal Health and Medical Care",
    5: "Community and Society Skills",
    6: "Food Preparation and Safety Skills",
    7: "Mothering Skills",
    8: "Life Skills Goals for Improvement",
    9: "Assessment Completed By",
  };
  return names[currentSection.value] || "";
});

const progressPercentage = computed(() => {
  return Math.round((currentSection.value / totalSections) * 100);
});

const overallCompletion = computed(() => {
  let completed = 0;
  let total = 0;

  const requiredFields = ["nameOfGirl", "dateOfAdmission", "dateOfAssessment"];
  requiredFields.forEach((field) => {
    total++;
    if (formData.value[field]) completed++;
  });

  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

const validateSection = (section) => {
  validationErrors.value = {};

  if (section === 1) {
    if (!formData.value.nameOfGirl) {
      validationErrors.value.nameOfGirl = "Name of Girl is required";
    }
    if (!formData.value.dateOfAdmission) {
      validationErrors.value.dateOfAdmission = "Date of Admission is required";
    }
    if (!formData.value.dateOfAssessment) {
      validationErrors.value.dateOfAssessment =
        "Date of Assessment is required";
    }
  }

  if (section === 9) {
    if (!formData.value.completedBy.socialWorkerName) {
      validationErrors.value.socialWorkerName =
        "Social Worker Name is required";
    }
    if (!formData.value.completedBy.houseMotherName) {
      validationErrors.value.houseMotherName = "House Mother Name is required";
    }
  }

  return Object.keys(validationErrors.value).length === 0;
};

const nextSection = () => {
  if (validateSection(currentSection.value)) {
    showValidationMessage.value = false;
    if (currentSection.value < totalSections) {
      currentSection.value++;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    showValidationMessage.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const prevSection = () => {
  if (currentSection.value > 1) {
    currentSection.value--;
    showValidationMessage.value = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const clearFieldError = (field) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field];
  }
};

const submitForm = async () => {
  if (!validateSection(9)) {
    showValidationMessage.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  try {
    const result = await FormService.saveLifeSkillsSurvey(formData.value);

    if (result.success) {
      alert("Life Skills Survey saved successfully!");
      emit("form-saved", result.id);
    } else {
      alert("Error saving survey: " + result.error);
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
    alert("Error saving survey. Please try again.");
  }
};
</script>

<style scoped>
.form-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px 12px 0 0;
}

.form-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
}

.form-header p {
  margin: 0 0 1.5rem 0;
  opacity: 0.95;
}

.form-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
}

.progress-fill {
  background: white;
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 10px;
}

.form-info {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.validation-message {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 2rem;
}

.validation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #856404;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.validation-list {
  margin: 0;
  padding-left: 1.5rem;
  color: #856404;
}

.validation-item {
  margin: 0.25rem 0;
}

.life-skills-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  color: #667eea;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.helper-text {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.info-box {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 4px;
}

.info-box p {
  margin: 0;
  color: #1565c0;
  font-weight: 500;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
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
  color: #333;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group.has-error input,
.form-group.has-error select,
.form-group.has-error textarea {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.inline-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.inline-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.skills-table {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
  background: #667eea;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.table-header > div {
  padding: 1rem 0.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
  border-bottom: 1px solid #e0e0e0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row > div {
  padding: 0.75rem 0.5rem;
  border-right: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.col-skill {
  justify-content: flex-start;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.col-rating input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.col-rating input[type="radio"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.goal-item {
  display: flex;
  flex-direction: column;
}

.goal-item label {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.goal-item textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.3s ease;
}

.goal-item textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.section-navigation {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.prev-btn,
.next-btn,
.submit-btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.prev-btn {
  background: #6c757d;
  color: white;
}

.prev-btn:hover {
  background: #5a6268;
}

.next-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
}

.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  margin-left: auto;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 1.5fr repeat(5, 1fr);
  }

  .table-header > div,
  .table-row > div {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .form-grid,
  .goals-grid {
    grid-template-columns: 1fr;
  }

  .skills-table {
    font-size: 0.7rem;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr repeat(5, 0.7fr);
  }

  .col-rating input[type="radio"] {
    width: 16px;
    height: 16px;
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
