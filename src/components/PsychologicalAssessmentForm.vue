<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3>Psychological Assessment/Treatment Plan</h3>
      <p>
        Complete this comprehensive psychological assessment and treatment
        planning form
      </p>
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

    <div class="psychological-form">
      <!-- Section 1: Basic Information -->
      <div v-show="currentSection === 1" class="form-section">
        <h4>Basic Information</h4>
        <div class="form-grid">
          <div
            class="form-group full-width"
            :class="{ 'has-error': validationErrors.childName }"
          >
            <label>Child Name *</label>
            <input
              v-model="formData.childName"
              type="text"
              required
              @input="clearFieldError('childName')"
            />
            <div v-if="validationErrors.childName" class="error-message">
              {{ validationErrors.childName }}
            </div>
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
          <div class="form-group">
            <label>Date of Admission to TKP</label>
            <input v-model="formData.dateOfAdmission" type="date" />
          </div>
          <div class="form-group">
            <label>Date of Reintegration (if applicable)</label>
            <input v-model="formData.dateOfReintegration" type="date" />
          </div>
        </div>

        <div class="form-group">
          <label>Type of Assessment *</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.assessmentType"
                value="INITIAL ASSESSMENT"
              />
              <span>Initial Assessment</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.assessmentType"
                value="BENCHMARK"
              />
              <span>Benchmark</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.assessmentType"
                value="POST-REINTEGRATION"
              />
              <span>Post-Reintegration</span>
            </label>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Assessments Given (tick all that apply)</label>
          <div class="checkbox-grid">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.assessmentsGiven.adnm" />
              <span>Adjustment Disorder Questionnaire (ADNM)</span>
            </label>
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="formData.assessmentsGiven.mentalStatus"
              />
              <span>Brief Mental Status Exam</span>
            </label>
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="formData.assessmentsGiven.catsPtsd"
              />
              <span>Child and Adolescent (CATS) PTSD Assessment</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.assessmentsGiven.ptgi" />
              <span>Post-Traumatic Growth Inventory</span>
            </label>
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="formData.assessmentsGiven.rosenberg"
              />
              <span>Rosenberg Self-Esteem Assessment</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.assessmentsGiven.sdq" />
              <span>Strengths & Difficulties Questionnaire</span>
            </label>
          </div>
        </div>

        <div class="section-navigation">
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Section 2: Rosenberg Self-Esteem Assessment -->
      <div v-show="currentSection === 2" class="form-section">
        <h4>Rosenberg Self-Esteem Assessment</h4>

        <div class="form-grid">
          <div class="form-group">
            <label>Score</label>
            <input
              v-model="formData.rosenbergSelfEsteem.score"
              type="number"
              min="0"
              max="30"
              placeholder="0-30"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label>Interpretation</label>
          <textarea
            v-model="formData.rosenbergSelfEsteem.interpretation"
            rows="4"
            placeholder="Provide interpretation of the score..."
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

      <!-- Section 3: Adjustment Disorder Questionnaire (ADNM-20) -->
      <div v-show="currentSection === 3" class="form-section">
        <h4>Adjustment Disorder Questionnaire (ADNM-20)</h4>
        <p class="helper-text">
          Measures Symptom Severity (Low / Moderate / High)
        </p>

        <div class="severity-table">
          <div class="table-header">
            <div class="col-measure">Measures</div>
            <div class="col-severity">Low</div>
            <div class="col-severity">Moderate</div>
            <div class="col-severity">High</div>
          </div>

          <div
            v-for="measure in adnmMeasures"
            :key="measure.key"
            class="table-row"
          >
            <div class="col-measure">{{ measure.label }}</div>
            <div class="col-severity">
              <input
                type="radio"
                :name="measure.key"
                v-model="formData.adnm[measure.key]"
                value="Low"
              />
            </div>
            <div class="col-severity">
              <input
                type="radio"
                :name="measure.key"
                v-model="formData.adnm[measure.key]"
                value="Moderate"
              />
            </div>
            <div class="col-severity">
              <input
                type="radio"
                :name="measure.key"
                v-model="formData.adnm[measure.key]"
                value="High"
              />
            </div>
          </div>

          <div class="table-row sum-row">
            <div class="col-measure"><strong>ADNM 20 Sum Score</strong></div>
            <div class="col-severity">
              <input
                type="radio"
                name="sumScore"
                v-model="formData.adnm.sumScore"
                value="Low"
              />
            </div>
            <div class="col-severity">
              <input
                type="radio"
                name="sumScore"
                v-model="formData.adnm.sumScore"
                value="Moderate"
              />
            </div>
            <div class="col-severity">
              <input
                type="radio"
                name="sumScore"
                v-model="formData.adnm.sumScore"
                value="High"
              />
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Interpretation</label>
          <textarea
            v-model="formData.adnm.interpretation"
            rows="4"
            placeholder="Provide interpretation of the ADNM-20 results..."
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

      <!-- Section 4: Strengths and Difficulties Questionnaire -->
      <div v-show="currentSection === 4" class="form-section">
        <h4>Strengths and Difficulties Questionnaire</h4>

        <div class="form-grid">
          <div class="form-group">
            <label>Emotional Problems Scale</label>
            <input
              v-model="formData.sdq.emotionalProblems"
              type="number"
              min="0"
              max="10"
            />
          </div>
          <div class="form-group">
            <label>Conduct Problems Scale</label>
            <input
              v-model="formData.sdq.conductProblems"
              type="number"
              min="0"
              max="10"
            />
          </div>
          <div class="form-group">
            <label>Hyperactivity Scale</label>
            <input
              v-model="formData.sdq.hyperactivity"
              type="number"
              min="0"
              max="10"
            />
          </div>
          <div class="form-group">
            <label>Peer Problems Scale</label>
            <input
              v-model="formData.sdq.peerProblems"
              type="number"
              min="0"
              max="10"
            />
          </div>
          <div class="form-group">
            <label>Prosocial Scale – Externalizing</label>
            <input
              v-model="formData.sdq.prosocialExternalizing"
              type="number"
              min="0"
              max="10"
            />
          </div>
          <div class="form-group">
            <label>Prosocial Scale – Internalizing</label>
            <input
              v-model="formData.sdq.prosocialInternalizing"
              type="number"
              min="0"
              max="10"
            />
          </div>
          <div class="form-group">
            <label>Total Difficulties</label>
            <input
              v-model="sdqTotalDifficulties"
              type="number"
              readonly
              class="readonly-field"
            />
            <small class="helper-text">Auto-calculated</small>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Categories</label>
          <input
            v-model="formData.sdq.categories"
            type="text"
            placeholder="e.g., Normal, Borderline, Abnormal"
          />
        </div>

        <div class="form-group full-width">
          <label>Interpretation</label>
          <textarea
            v-model="formData.sdq.interpretation"
            rows="4"
            placeholder="Provide interpretation of the SDQ results..."
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

      <!-- Section 5: Child and Adolescent PTSD Assessment -->
      <div v-show="currentSection === 5" class="form-section">
        <h4>Child and Adolescent PTSD Assessment</h4>
        <p class="helper-text">
          Indicate child's assessment score by selecting the corresponding
          category:
        </p>

        <div class="ptsd-assessment">
          <div class="assessment-options">
            <label
              class="assessment-card"
              :class="{ selected: formData.catsPtsd.category === 'Normal' }"
            >
              <input
                type="radio"
                v-model="formData.catsPtsd.category"
                value="Normal"
              />
              <div class="card-content">
                <div class="score-range">&lt;15</div>
                <div class="category-name">Normal/Not clinically elevated</div>
              </div>
            </label>

            <label
              class="assessment-card"
              :class="{ selected: formData.catsPtsd.category === 'Moderate' }"
            >
              <input
                type="radio"
                v-model="formData.catsPtsd.category"
                value="Moderate"
              />
              <div class="card-content">
                <div class="score-range">15-20</div>
                <div class="category-name">
                  Moderate trauma-related distress
                </div>
              </div>
            </label>

            <label
              class="assessment-card"
              :class="{
                selected: formData.catsPtsd.category === 'Probable PTSD',
              }"
            >
              <input
                type="radio"
                v-model="formData.catsPtsd.category"
                value="Probable PTSD"
              />
              <div class="card-content">
                <div class="score-range">21+</div>
                <div class="category-name">Probable PTSD</div>
              </div>
            </label>
          </div>

          <div class="form-group">
            <label>Actual Score</label>
            <input
              v-model="formData.catsPtsd.score"
              type="number"
              min="0"
              placeholder="Enter score"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label>Interpretation</label>
          <textarea
            v-model="formData.catsPtsd.interpretation"
            rows="4"
            placeholder="Provide interpretation of the CATS PTSD assessment..."
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

      <!-- Section 6: Post-Traumatic Growth Inventory (PTGI) -->
      <div v-show="currentSection === 6" class="form-section">
        <h4>Post-Traumatic Growth Inventory – PTGI</h4>

        <div class="form-grid">
          <div class="form-group">
            <label>Personal Strength</label>
            <input
              v-model="formData.ptgi.personalStrength"
              type="number"
              min="0"
              max="25"
              placeholder="0-25"
            />
          </div>
          <div class="form-group">
            <label>New Possibilities</label>
            <input
              v-model="formData.ptgi.newPossibilities"
              type="number"
              min="0"
              max="25"
              placeholder="0-25"
            />
          </div>
          <div class="form-group">
            <label>Improved Relationships</label>
            <input
              v-model="formData.ptgi.improvedRelationships"
              type="number"
              min="0"
              max="35"
              placeholder="0-35"
            />
          </div>
          <div class="form-group">
            <label>Spiritual Growth</label>
            <input
              v-model="formData.ptgi.spiritualGrowth"
              type="number"
              min="0"
              max="10"
              placeholder="0-10"
            />
          </div>
          <div class="form-group">
            <label>Appreciation of Life</label>
            <input
              v-model="formData.ptgi.appreciationOfLife"
              type="number"
              min="0"
              max="15"
              placeholder="0-15"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label>Area(s) of celebration</label>
          <textarea
            v-model="formData.ptgi.areasOfCelebration"
            rows="3"
            placeholder="Describe areas where growth is celebrated..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Areas growth has been experienced</label>
          <textarea
            v-model="formData.ptgi.areasOfGrowth"
            rows="3"
            placeholder="Describe areas where growth has been experienced..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>What is contributing to low or moderate scores?</label>
          <textarea
            v-model="formData.ptgi.contributingFactors"
            rows="3"
            placeholder="Describe factors contributing to low or moderate scores..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Areas I would like to make adjustments</label>
          <textarea
            v-model="formData.ptgi.adjustmentAreas"
            rows="3"
            placeholder="Describe areas where adjustments are needed..."
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

      <!-- Section 7: Clinical Observation & Recommendations -->
      <div v-show="currentSection === 7" class="form-section">
        <h4>Clinical Observation & Recommendations</h4>

        <div class="form-group full-width">
          <label>Mental Status Exam Summary</label>
          <textarea
            v-model="formData.clinicalObservation.mentalStatusSummary"
            rows="5"
            placeholder="Provide a summary of the mental status examination..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Treatment Plan/Approach</label>
          <textarea
            v-model="formData.clinicalObservation.treatmentPlan"
            rows="5"
            placeholder="Describe the treatment plan and therapeutic approach..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Report Summary</label>
          <textarea
            v-model="formData.clinicalObservation.reportSummary"
            rows="5"
            placeholder="Provide a comprehensive summary of the assessment..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Reintegration Recommendation</label>
          <textarea
            v-model="formData.clinicalObservation.reintegrationRecommendation"
            rows="5"
            placeholder="Please describe whether or not you believe the child is fit for reintegration from a therapeutic standpoint..."
          ></textarea>
        </div>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.assessorName }"
          >
            <label>Signed (Assessor Name) *</label>
            <input
              v-model="formData.assessorName"
              type="text"
              required
              @input="clearFieldError('assessorName')"
            />
            <div v-if="validationErrors.assessorName" class="error-message">
              {{ validationErrors.assessorName }}
            </div>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.signatureDate }"
          >
            <label>Date *</label>
            <input
              v-model="formData.signatureDate"
              type="date"
              required
              @input="clearFieldError('signatureDate')"
            />
            <div v-if="validationErrors.signatureDate" class="error-message">
              {{ validationErrors.signatureDate }}
            </div>
          </div>
        </div>

        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="submit-btn" @click="submitForm">
            Submit Assessment
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

const totalSections = 7;
const currentSection = ref(1);
const showValidationMessage = ref(false);
const validationErrors = ref({});

// ADNM Measures
const adnmMeasures = [
  { key: "preoccupations", label: "Preoccupations" },
  { key: "failureToAdapt", label: "Failure to adapt" },
  { key: "avoidance", label: "Avoidance" },
  { key: "depressedMood", label: "Depressed mood" },
  { key: "anxiety", label: "Anxiety" },
  { key: "impulseDisturbance", label: "Impulse Disturbance" },
];

const formData = ref({
  // Section 1: Basic Information
  childName: "",
  dateOfAssessment: "",
  dateOfAdmission: "",
  dateOfReintegration: "",
  assessmentType: "",
  assessmentsGiven: {
    adnm: false,
    mentalStatus: false,
    catsPtsd: false,
    ptgi: false,
    rosenberg: false,
    sdq: false,
  },

  // Section 2: Rosenberg Self-Esteem
  rosenbergSelfEsteem: {
    score: null,
    interpretation: "",
  },

  // Section 3: ADNM-20
  adnm: {
    preoccupations: "",
    failureToAdapt: "",
    avoidance: "",
    depressedMood: "",
    anxiety: "",
    impulseDisturbance: "",
    sumScore: "",
    interpretation: "",
  },

  // Section 4: SDQ
  sdq: {
    emotionalProblems: null,
    conductProblems: null,
    hyperactivity: null,
    peerProblems: null,
    prosocialExternalizing: null,
    prosocialInternalizing: null,
    totalDifficulties: null,
    categories: "",
    interpretation: "",
  },

  // Section 5: CATS PTSD
  catsPtsd: {
    category: "",
    score: null,
    interpretation: "",
  },

  // Section 6: PTGI
  ptgi: {
    personalStrength: null,
    newPossibilities: null,
    improvedRelationships: null,
    spiritualGrowth: null,
    appreciationOfLife: null,
    areasOfCelebration: "",
    areasOfGrowth: "",
    contributingFactors: "",
    adjustmentAreas: "",
  },

  // Section 7: Clinical Observation
  clinicalObservation: {
    mentalStatusSummary: "",
    treatmentPlan: "",
    reportSummary: "",
    reintegrationRecommendation: "",
  },

  assessorName: "",
  signatureDate: "",
});

const currentSectionName = computed(() => {
  const names = {
    1: "Basic Information",
    2: "Rosenberg Self-Esteem Assessment",
    3: "Adjustment Disorder Questionnaire",
    4: "Strengths & Difficulties Questionnaire",
    5: "CATS PTSD Assessment",
    6: "Post-Traumatic Growth Inventory",
    7: "Clinical Observation & Recommendations",
  };
  return names[currentSection.value] || "";
});

const progressPercentage = computed(() => {
  return Math.round((currentSection.value / totalSections) * 100);
});

const overallCompletion = computed(() => {
  let completed = 0;
  let total = 0;

  // Count basic required fields
  const requiredFields = [
    "childName",
    "dateOfAssessment",
    "assessorName",
    "signatureDate",
  ];
  requiredFields.forEach((field) => {
    total++;
    if (formData.value[field]) completed++;
  });

  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// Auto-calculate SDQ Total Difficulties
const sdqTotalDifficulties = computed(() => {
  const { emotionalProblems, conductProblems, hyperactivity, peerProblems } =
    formData.value.sdq;
  const sum =
    (Number(emotionalProblems) || 0) +
    (Number(conductProblems) || 0) +
    (Number(hyperactivity) || 0) +
    (Number(peerProblems) || 0);
  formData.value.sdq.totalDifficulties = sum;
  return sum;
});

const validateSection = (section) => {
  validationErrors.value = {};

  if (section === 1) {
    if (!formData.value.childName) {
      validationErrors.value.childName = "Child Name is required";
    }
    if (!formData.value.dateOfAssessment) {
      validationErrors.value.dateOfAssessment =
        "Date of Assessment is required";
    }
  }

  if (section === 7) {
    if (!formData.value.assessorName) {
      validationErrors.value.assessorName = "Assessor Name is required";
    }
    if (!formData.value.signatureDate) {
      validationErrors.value.signatureDate = "Signature Date is required";
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
  if (!validateSection(7)) {
    showValidationMessage.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  try {
    const result = await FormService.savePsychologicalAssessment(
      formData.value
    );

    if (result.success) {
      alert("Psychological Assessment saved successfully!");
      emit("form-saved", result.id);
    } else {
      alert("Error saving assessment: " + result.error);
    }
  } catch (error) {
    console.error("Error submitting assessment:", error);
    alert("Error saving assessment. Please try again.");
  }
};
</script>

<style scoped>
.form-wrapper {
  max-width: 1400px;
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

.psychological-form {
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

.readonly-field {
  background: #f8f9fa;
  cursor: not-allowed;
}

.radio-group,
.checkbox-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.radio-label input[type="radio"],
.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.severity-table {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: #667eea;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.table-header > div {
  padding: 1rem 0.75rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  border-bottom: 1px solid #e0e0e0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.sum-row {
  background: #f8f9fa;
}

.table-row > div {
  padding: 0.75rem;
  border-right: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.col-measure {
  justify-content: flex-start;
  font-weight: 500;
  color: #333;
}

.col-severity input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.ptsd-assessment {
  margin-bottom: 1.5rem;
}

.assessment-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.assessment-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.assessment-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.assessment-card.selected {
  border-color: #667eea;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
}

.assessment-card input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.card-content {
  text-align: center;
}

.score-range {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.category-name {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
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

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    font-size: 0.8rem;
  }

  .table-header > div,
  .table-row > div {
    padding: 0.5rem 0.25rem;
  }

  .assessment-options {
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
