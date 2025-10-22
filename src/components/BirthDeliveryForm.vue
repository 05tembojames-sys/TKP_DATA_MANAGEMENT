<template>
  <div class="birth-delivery-form">
    <div class="form-wrapper">
      <!-- Form Header -->
      <div class="form-header">
        <h2>Birth and Delivery Report</h2>
        <div class="progress-indicator">
          <span class="current-section">Section {{ currentSection }}</span>
          <span class="total-sections">of 3</span>
        </div>
      </div>

      <!-- Validation Message -->
      <div v-if="showValidationMessage" class="validation-message">
        <p>⚠️ Please fill in all required fields before proceeding.</p>
      </div>

      <!-- Section 1: Baby's Information -->
      <div v-show="currentSection === 1" class="form-section">
        <h3>Section 1: Baby's Information</h3>

        <div class="form-grid">
          <div class="form-group">
            <label>First Name: <span class="required">*</span></label>
            <input
              v-model="formData.babyFirstName"
              type="text"
              placeholder="Enter baby's first name"
              required
            />
          </div>

          <div class="form-group">
            <label>Middle Name:</label>
            <input
              v-model="formData.babyMiddleName"
              type="text"
              placeholder="Enter baby's middle name"
            />
          </div>

          <div class="form-group">
            <label>Last Name: <span class="required">*</span></label>
            <input
              v-model="formData.babyLastName"
              type="text"
              placeholder="Enter baby's last name"
              required
            />
          </div>

          <div class="form-group">
            <label>Mother's Name: <span class="required">*</span></label>
            <input
              v-model="formData.motherName"
              type="text"
              placeholder="Enter mother's name"
              required
            />
          </div>

          <div class="form-group">
            <label>Date of Birth: <span class="required">*</span></label>
            <input v-model="formData.dateOfBirth" type="date" required />
          </div>

          <div class="form-group">
            <label>Weight at Birth (kg): <span class="required">*</span></label>
            <input
              v-model.number="formData.weightAtBirth"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 3.2"
              required
            />
          </div>

          <div class="form-group">
            <label>Length at Birth (cm): <span class="required">*</span></label>
            <input
              v-model.number="formData.lengthAtBirth"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 50.5"
              required
            />
          </div>

          <div class="form-group">
            <label>Gender: <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  v-model="formData.gender"
                  type="radio"
                  value="MALE"
                  required
                />
                <span>Male</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.gender"
                  type="radio"
                  value="FEMALE"
                  required
                />
                <span>Female</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Labor and Delivery -->
      <div v-show="currentSection === 2" class="form-section">
        <h3>Section 2: Labor and Delivery</h3>

        <div class="form-grid">
          <div class="form-group">
            <label>Date Labor Began: <span class="required">*</span></label>
            <input v-model="formData.dateLaborBegan" type="date" required />
          </div>

          <div class="form-group">
            <label
              >Duration of Labor (hours - approx.):
              <span class="required">*</span></label
            >
            <input
              v-model.number="formData.durationOfLabor"
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g., 12.5"
              required
            />
          </div>

          <div class="form-group">
            <label
              >Baby's Gestation Period at Birth (weeks):
              <span class="required">*</span></label
            >
            <input
              v-model.number="formData.gestationPeriod"
              type="number"
              min="0"
              max="50"
              placeholder="e.g., 40"
              required
            />
            <small>How far along was the pregnancy?</small>
          </div>

          <div class="form-group">
            <label>Location of Delivery: <span class="required">*</span></label>
            <input
              v-model="formData.locationOfDelivery"
              type="text"
              placeholder="e.g., Lusaka Central Hospital"
              required
            />
          </div>

          <div class="form-group">
            <label>Type of Delivery: <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  v-model="formData.typeOfDelivery"
                  type="radio"
                  value="Natural"
                  required
                />
                <span>Natural</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.typeOfDelivery"
                  type="radio"
                  value="C-Section"
                  required
                />
                <span>C-Section</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Time of Birth: <span class="required">*</span></label>
            <input v-model="formData.timeOfBirth" type="time" required />
          </div>

          <div class="form-group full-width">
            <label>Any complications with delivery?</label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  v-model="formData.hasComplications"
                  type="radio"
                  :value="false"
                />
                <span>No</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.hasComplications"
                  type="radio"
                  :value="true"
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          <div v-if="formData.hasComplications" class="form-group full-width">
            <label
              >Describe Complications: <span class="required">*</span></label
            >
            <textarea
              v-model="formData.complicationsDescription"
              rows="4"
              placeholder="Please describe any complications during delivery..."
              :required="formData.hasComplications"
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label>Who else was present for the delivery?</label>
            <textarea
              v-model="formData.presentForDelivery"
              rows="3"
              placeholder="List names and relationships (e.g., Partner, Mother, Friend...)"
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label
              >Did the baby require additional support after delivery?</label
            >
            <div class="radio-group">
              <label class="radio-label">
                <input
                  v-model="formData.requiresAdditionalSupport"
                  type="radio"
                  :value="false"
                />
                <span>No</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.requiresAdditionalSupport"
                  type="radio"
                  :value="true"
                />
                <span>Yes</span>
              </label>
            </div>
          </div>

          <div
            v-if="formData.requiresAdditionalSupport"
            class="form-group full-width"
          >
            <label
              >Describe Additional Support:
              <span class="required">*</span></label
            >
            <textarea
              v-model="formData.additionalSupportDescription"
              rows="4"
              placeholder="Please describe what additional support the baby required..."
              :required="formData.requiresAdditionalSupport"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Section 3: Hospital Stay -->
      <div v-show="currentSection === 3" class="form-section">
        <h3>Section 3: Hospital Stay</h3>

        <div class="form-grid">
          <div class="form-group">
            <label
              >Number of Nights Spent in Hospital:
              <span class="required">*</span></label
            >
            <input
              v-model.number="formData.nightsInHospital"
              type="number"
              min="0"
              placeholder="e.g., 2"
              required
            />
          </div>

          <div class="form-group">
            <label
              >Date of Discharge from Hospital:
              <span class="required">*</span></label
            >
            <input v-model="formData.dateOfDischarge" type="date" required />
          </div>
        </div>

        <div class="info-box">
          <p>
            <strong>Note:</strong> This form captures essential information
            about the baby's birth and delivery. Please ensure all details are
            accurate and complete.
          </p>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="form-navigation">
        <button
          v-if="currentSection > 1"
          @click="previousSection"
          type="button"
          class="btn-secondary"
        >
          Previous
        </button>
        <button
          v-if="currentSection < 3"
          @click="nextSection"
          type="button"
          class="btn-primary"
        >
          Next
        </button>
        <button
          v-if="currentSection === 3"
          @click="submitForm"
          type="button"
          class="btn-submit"
        >
          Submit Report
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FormService from "../services/formService.js";

// Emit events
const emit = defineEmits(["form-saved"]);

// Form state
const currentSection = ref(1);
const showValidationMessage = ref(false);

// Form data
const formData = ref({
  // Baby's Information
  babyFirstName: "",
  babyMiddleName: "",
  babyLastName: "",
  motherName: "",
  dateOfBirth: "",
  weightAtBirth: null,
  lengthAtBirth: null,
  gender: "",

  // Labor and Delivery
  dateLaborBegan: "",
  durationOfLabor: null,
  gestationPeriod: null,
  locationOfDelivery: "",
  typeOfDelivery: "",
  timeOfBirth: "",
  hasComplications: false,
  complicationsDescription: "",
  presentForDelivery: "",
  requiresAdditionalSupport: false,
  additionalSupportDescription: "",

  // Hospital Stay
  nightsInHospital: null,
  dateOfDischarge: "",
});

// Validation function
const validateSection = (section) => {
  switch (section) {
    case 1:
      return !!(
        formData.value.babyFirstName &&
        formData.value.babyLastName &&
        formData.value.motherName &&
        formData.value.dateOfBirth &&
        formData.value.weightAtBirth !== null &&
        formData.value.weightAtBirth > 0 &&
        formData.value.lengthAtBirth !== null &&
        formData.value.lengthAtBirth > 0 &&
        formData.value.gender
      );

    case 2:
      const basicFields = !!(
        formData.value.dateLaborBegan &&
        formData.value.durationOfLabor !== null &&
        formData.value.gestationPeriod !== null &&
        formData.value.locationOfDelivery &&
        formData.value.typeOfDelivery &&
        formData.value.timeOfBirth
      );

      const complicationsValid =
        !formData.value.hasComplications ||
        (formData.value.hasComplications &&
          formData.value.complicationsDescription);

      const supportValid =
        !formData.value.requiresAdditionalSupport ||
        (formData.value.requiresAdditionalSupport &&
          formData.value.additionalSupportDescription);

      return basicFields && complicationsValid && supportValid;

    case 3:
      return !!(
        formData.value.nightsInHospital !== null &&
        formData.value.nightsInHospital >= 0 &&
        formData.value.dateOfDischarge
      );

    default:
      return false;
  }
};

// Navigation functions
const nextSection = () => {
  if (validateSection(currentSection.value)) {
    showValidationMessage.value = false;
    currentSection.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showValidationMessage.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const previousSection = () => {
  showValidationMessage.value = false;
  currentSection.value--;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Submit form
const submitForm = async () => {
  if (!validateSection(3)) {
    showValidationMessage.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  try {
    const result = await FormService.saveBirthDeliveryReport(formData.value);

    if (result.success) {
      alert("Birth and Delivery Report saved successfully!");
      emit("form-saved", result.id);
    } else {
      alert("Error saving report: " + result.error);
    }
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Error saving report. Please try again.");
  }
};
</script>

<style scoped>
.birth-delivery-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.form-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.form-header h2 {
  color: #4a148c;
  font-size: 1.75rem;
  margin: 0;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
}

.current-section {
  font-size: 1.25rem;
}

.total-sections {
  font-size: 0.9rem;
  opacity: 0.9;
}

.validation-message {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.validation-message p {
  margin: 0;
  font-weight: 500;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  color: #4a148c;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
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

.form-group small {
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-style: italic;
}

.required {
  color: #dc3545;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="time"],
.form-group input[type="number"],
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff9a56;
  box-shadow: 0 0 0 3px rgba(255, 154, 86, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.radio-label:hover {
  border-color: #ff9a56;
  background: #fff8f3;
}

.radio-label input[type="radio"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #ff9a56;
}

.radio-label span {
  font-weight: 500;
  color: #333;
}

.info-box {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 4px solid #4a148c;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.info-box p {
  margin: 0;
  color: #4a148c;
  line-height: 1.6;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.btn-secondary,
.btn-primary,
.btn-submit {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%);
  color: white;
  margin-left: auto;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff8945 0%, #ff5977 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 154, 86, 0.4);
}

.btn-submit {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  margin-left: auto;
}

.btn-submit:hover {
  background: linear-gradient(135deg, #218838 0%, #1ab386 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .birth-delivery-form {
    padding: 1rem;
  }

  .form-wrapper {
    padding: 1.5rem;
  }

  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-navigation {
    flex-direction: column;
  }

  .btn-secondary,
  .btn-primary,
  .btn-submit {
    width: 100%;
    margin-left: 0 !important;
  }

  .radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .radio-label {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .form-header h2 {
    font-size: 1.25rem;
  }

  .progress-indicator {
    font-size: 0.9rem;
    padding: 0.4rem 0.875rem;
  }

  .current-section {
    font-size: 1.1rem;
  }

  .form-section h3 {
    font-size: 1.2rem;
  }

  .btn-secondary,
  .btn-primary,
  .btn-submit {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
