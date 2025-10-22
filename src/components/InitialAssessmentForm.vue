<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3>TKP Initial Assessment Form</h3>
      <p>
        Complete this form to assess child eligibility for The Kukhoma Project
      </p>
      <div class="form-progress">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="progress-info">
          <span class="progress-text"
            >Section {{ currentSection }} of {{ totalSections }}</span
          >
          <span class="section-title">{{ currentSectionName }}</span>
        </div>
      </div>
    </div>

    <div class="assessment-form">
      <!-- Child Information Section -->
      <div v-show="currentSection === 1" class="form-section">
        <h4>Child Information</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Child First Name *</label>
            <input v-model="formData.childFirstName" type="text" required />
          </div>
          <div class="form-group">
            <label>Child Middle Name</label>
            <input v-model="formData.childMiddleName" type="text" />
          </div>
          <div class="form-group">
            <label>Child Surname *</label>
            <input v-model="formData.childSurname" type="text" required />
          </div>
          <div class="form-group">
            <label>Other First Name</label>
            <input v-model="formData.otherFirstName" type="text" />
          </div>
          <div class="form-group">
            <label>Other Middle Name</label>
            <input v-model="formData.otherMiddleName" type="text" />
          </div>
          <div class="form-group">
            <label>Other Surname</label>
            <input v-model="formData.otherSurname" type="text" />
          </div>
          <div class="form-group">
            <label>Resident Area at Intake *</label>
            <input v-model="formData.residentArea" type="text" required />
          </div>
          <div class="form-group">
            <label>Nickname</label>
            <input v-model="formData.nickname" type="text" />
          </div>
          <div class="form-group">
            <label>Gender *</label>
            <select v-model="formData.gender" required>
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div class="form-group">
            <label>Date of Birth *</label>
            <input v-model="formData.dateOfBirth" type="date" required />
          </div>
          <div class="form-group">
            <label>Age *</label>
            <input
              v-model="formData.age"
              type="number"
              min="0"
              max="18"
              required
            />
          </div>
          <div class="form-group">
            <label>Place of Birth *</label>
            <input v-model="formData.placeOfBirth" type="text" required />
          </div>
          <div class="form-group">
            <label>Village</label>
            <input v-model="formData.village" type="text" />
          </div>
          <div class="form-group">
            <label>Chief</label>
            <input v-model="formData.chief" type="text" />
          </div>
          <div class="form-group">
            <label>District *</label>
            <input v-model="formData.district" type="text" required />
          </div>
          <div class="form-group">
            <label>Tribe</label>
            <input v-model="formData.tribe" type="text" />
          </div>
          <div class="form-group">
            <label>Denomination</label>
            <input v-model="formData.denomination" type="text" />
          </div>
          <div class="form-group">
            <label>Nationality *</label>
            <input v-model="formData.nationality" type="text" required />
          </div>
          <div class="form-group">
            <label>Religion</label>
            <input v-model="formData.religion" type="text" />
          </div>
          <div class="form-group">
            <label
              >Does the child qualify according to TKP's age criteria? *</label
            >
            <select v-model="formData.qualifiesAgeCriteria" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div class="section-navigation">
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Details of Pregnancy Section -->
      <div v-show="currentSection === 2" class="form-section">
        <h4>Details of Pregnancy</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Estimated Date of Conception *</label>
            <input
              v-model="formData.estimatedConceptionDate"
              type="date"
              required
            />
          </div>
          <div class="form-group">
            <label>Duration of Pregnancy (weeks) *</label>
            <input
              v-model="formData.pregnancyDuration"
              type="number"
              min="0"
              max="40"
              required
            />
          </div>
          <div class="form-group">
            <label>Baby's Father Relation to Baby's Mother *</label>
            <select v-model="formData.fatherRelation" required>
              <option value="">Select Relation</option>
              <option value="Family member">Family member</option>
              <option value="Friend">Friend</option>
              <option value="Unknown stranger">Unknown stranger</option>
              <option value="Other">Other (describe)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Conception Category *</label>
            <select v-model="formData.conceptionCategory" required>
              <option value="">Select Category</option>
              <option value="Defilement">Defilement</option>
              <option value="Rape">Rape</option>
              <option value="Incest">Incest</option>
              <option value="Sex Trafficking">Sex Trafficking</option>
              <option value="Survival Prostitution">
                Survival Prostitution
              </option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Has any legal action been taken? *</label>
            <select v-model="formData.legalActionTaken" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div class="form-group full-width">
          <label
            >Describe how the baby's conception occurred (i.e., location, time
            of day, reason, etc) *</label
          >
          <textarea
            v-model="formData.conceptionDescription"
            rows="4"
            required
          ></textarea>
        </div>
        <div class="form-group full-width">
          <label>Legal Action Description</label>
          <textarea
            v-model="formData.legalActionDescription"
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

      <!-- Medical Follow-Up Section -->
      <div v-show="currentSection === 3" class="form-section">
        <h4>Medical Follow-Up</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>What medical follow-up has been taken?</label>
            <input v-model="formData.medicalFollowUp" type="text" />
          </div>
          <div class="form-group">
            <label>Has there been a confirmed pregnancy test? *</label>
            <select v-model="formData.confirmedPregnancyTest" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Clinic</label>
            <input v-model="formData.clinic" type="text" />
          </div>
          <div class="form-group">
            <label>Documentation?</label>
            <select v-model="formData.documentation">
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label
              >Has there been consideration/attempts of abortion by the child or
              the family? *</label
            >
            <select v-model="formData.abortionConsideration" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label
              >Has the child expressed a desire to commit suicide/attempted to
              commit suicide? *</label
            >
            <select v-model="formData.suicideDesire" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div class="form-group full-width">
          <label>Abortion Consideration Description</label>
          <textarea v-model="formData.abortionDescription" rows="3"></textarea>
        </div>
        <div class="form-group full-width">
          <label>Suicide Desire Description</label>
          <textarea v-model="formData.suicideDescription" rows="3"></textarea>
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

      <!-- Family Composition Section -->
      <div v-show="currentSection === 4" class="form-section">
        <h4>Family Composition</h4>
        <div class="family-table">
          <table>
            <thead>
              <tr>
                <th>Relation</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Occupation</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(member, index) in formData.familyMembers"
                :key="index"
              >
                <td><input v-model="member.relation" type="text" /></td>
                <td><input v-model="member.name" type="text" /></td>
                <td><input v-model="member.age" type="number" min="0" /></td>
                <td>
                  <select v-model="member.gender">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </td>
                <td><input v-model="member.occupation" type="text" /></td>
                <td><input v-model="member.location" type="text" /></td>
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
        <div class="form-group full-width">
          <label>Additional Notes</label>
          <textarea v-model="formData.familyNotes" rows="3"></textarea>
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

      <!-- Home and Economic Condition Section -->
      <div v-show="currentSection === 5" class="form-section">
        <h4>Home and Economic Condition</h4>
        <div class="form-group full-width">
          <label>Describe the condition of the physical home *</label>
          <textarea
            v-model="formData.homeCondition"
            rows="4"
            required
          ></textarea>
        </div>
        <div class="form-group full-width">
          <label>Describe the economic situation of the family *</label>
          <textarea
            v-model="formData.economicSituation"
            rows="4"
            required
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

      <!-- Education Background Section -->
      <div v-show="currentSection === 6" class="form-section">
        <h4>Education Background</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Is the child currently attending school? *</label>
            <select v-model="formData.currentlyAttendingSchool" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Which School?</label>
            <input v-model="formData.schoolName" type="text" />
          </div>
          <div class="form-group">
            <label>Location</label>
            <input v-model="formData.schoolLocation" type="text" />
          </div>
          <div class="form-group">
            <label>Current Grade Level</label>
            <input v-model="formData.currentGradeLevel" type="text" />
          </div>
          <div class="form-group">
            <label>If NO, has the child ever attended school?</label>
            <select v-model="formData.everAttendedSchool">
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Highest Completed Grade Level</label>
            <input v-model="formData.highestGradeLevel" type="text" />
          </div>
          <div class="form-group">
            <label>Most recent year in school</label>
            <input
              v-model="formData.mostRecentYear"
              type="number"
              min="1900"
              max="2030"
            />
          </div>
          <div class="form-group">
            <label>Most recent school attended</label>
            <input v-model="formData.mostRecentSchool" type="text" />
          </div>
          <div class="form-group">
            <label>Location</label>
            <input v-model="formData.mostRecentSchoolLocation" type="text" />
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

      <!-- Health Record Section -->
      <div v-show="currentSection === 7" class="form-section">
        <h4>Health Record</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Any non-pregnancy related health issues? *</label>
            <select v-model="formData.nonPregnancyHealthIssues" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Is the child HIV+? *</label>
            <select v-model="formData.hivStatus" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
              <option value="UNSURE">UNSURE</option>
            </select>
          </div>
          <div class="form-group">
            <label>Any pregnancy-related health issues? *</label>
            <select v-model="formData.pregnancyHealthIssues" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div class="form-group full-width">
          <label>If yes, please describe non-pregnancy health issues</label>
          <textarea
            v-model="formData.healthIssuesDescription"
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

      <!-- Adoption Section -->
      <div v-show="currentSection === 8" class="form-section">
        <h4>Adoption</h4>
        <div class="form-grid">
          <div class="form-group">
            <label
              >Has the family considered placing the baby for adoption? *</label
            >
            <select v-model="formData.consideredAdoption" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label
              >Would the family be open to placing the baby for adoption?
              *</label
            >
            <select v-model="formData.openToAdoption" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
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

      <!-- Final Recommendation Section -->
      <div v-show="currentSection === 9" class="form-section">
        <h4>Final Recommendation</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Does the girl meet the TKP criteria of admission?</label>
            <select v-model="formData.meetsTkpCriteria">
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Age Range (<15) *</label>
            <select v-model="formData.ageRange" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Attempted Abortion/Suicidal Intent *</label>
            <select v-model="formData.abortionSuicidalIntent" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label
              >Conception from Sexual Abuse/Rape/Survival Prostitution *</label
            >
            <select v-model="formData.abuseConception" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Confirmed Pregnant *</label>
            <select v-model="formData.confirmedPregnant" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>Family Commitment to Program *</label>
            <select v-model="formData.familyCommitment" required>
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
          <div class="form-group">
            <label>TKP Recommendation *</label>
            <select v-model="formData.tkpRecommendation" required>
              <option value="">Select</option>
              <option value="ADMIT TO TKP HOUSE">ADMIT TO TKP HOUSE</option>
              <option value="DO NOT ADMIT">DO NOT ADMIT</option>
            </select>
          </div>
          <div class="form-group">
            <label>Date of Assessment *</label>
            <input v-model="formData.assessmentDate" type="date" required />
          </div>
          <div class="form-group">
            <label>Referring Organization</label>
            <input v-model="formData.referringOrganization" type="text" />
          </div>
          <div class="form-group">
            <label>Name of TKP Social Worker</label>
            <input v-model="formData.tkpSocialWorker" type="text" />
          </div>
          <div class="form-group">
            <label>Name of DSW Officer</label>
            <input v-model="formData.dswOfficer" type="text" />
          </div>
        </div>
        <div class="form-group full-width">
          <label>Describe recommendation *</label>
          <textarea
            v-model="formData.recommendationDescription"
            rows="4"
            required
          ></textarea>
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
            {{ loading ? "Saving..." : "Submit Assessment" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useToast } from "../composables/useToast.js";

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
  "Details of Pregnancy",
  "Medical Follow-Up",
  "Family Composition",
  "Home and Economic Condition",
  "Education Background",
  "Health Record",
  "Adoption",
  "Final Recommendation",
];

const currentSectionName = computed(() => {
  return sectionNames[currentSection.value - 1] || "Unknown Section";
});

// Section validation rules
const sectionValidationRules = {
  1: [
    // Child Information
    "childFirstName",
    "childSurname",
    "residentArea",
    "gender",
    "dateOfBirth",
    "age",
    "placeOfBirth",
    "district",
    "nationality",
    "qualifiesAgeCriteria",
  ],
  2: [
    // Details of Pregnancy
    "estimatedConceptionDate",
    "pregnancyDuration",
    "fatherRelation",
    "conceptionCategory",
    "conceptionDescription",
    "legalActionTaken",
  ],
  3: [
    // Medical Follow-Up
    "confirmedPregnancyTest",
  ],
  4: [], // Family Composition - optional
  5: [], // Home and Economic Condition - optional
  6: [], // Education Background - optional
  7: [], // Health Record - optional
  8: [
    // Adoption
    "openToAdoption",
  ],
  9: [
    // Final Recommendation
    "ageRange",
    "abortionSuicidalIntent",
    "abuseConception",
    "confirmedPregnant",
    "familyCommitment",
    "tkpRecommendation",
    "assessmentDate",
    "recommendationDescription",
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

  // Check required fields
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
    residentArea: "Resident Area at Intake",
    gender: "Gender",
    dateOfBirth: "Date of Birth",
    age: "Age",
    placeOfBirth: "Place of Birth",
    district: "District",
    nationality: "Nationality",
    qualifiesAgeCriteria: "Age Criteria Qualification",
    estimatedConceptionDate: "Estimated Date of Conception",
    pregnancyDuration: "Duration of Pregnancy",
    fatherRelation: "Father Relation to Mother",
    conceptionCategory: "Conception Category",
    conceptionDescription: "Conception Description",
    legalActionTaken: "Legal Action Status",
    confirmedPregnancyTest: "Confirmed Pregnancy Test",
    openToAdoption: "Open to Adoption",
    ageRange: "Age Range",
    abortionSuicidalIntent: "Abortion/Suicidal Intent",
    abuseConception: "Abuse Conception",
    confirmedPregnant: "Confirmed Pregnant",
    familyCommitment: "Family Commitment",
    tkpRecommendation: "TKP Recommendation",
    assessmentDate: "Assessment Date",
    recommendationDescription: "Recommendation Description",
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
  residentArea: "",
  nickname: "",
  gender: "",
  dateOfBirth: "",
  age: "",
  placeOfBirth: "",
  village: "",
  chief: "",
  district: "",
  tribe: "",
  denomination: "",
  nationality: "",
  religion: "",
  qualifiesAgeCriteria: "",

  // Details of Pregnancy
  estimatedConceptionDate: "",
  pregnancyDuration: "",
  fatherRelation: "",
  conceptionCategory: "",
  conceptionDescription: "",
  legalActionTaken: "",
  legalActionDescription: "",

  // Medical Follow-Up
  medicalFollowUp: "",
  confirmedPregnancyTest: "",
  clinic: "",
  documentation: "",
  abortionConsideration: "",
  abortionDescription: "",
  suicideDesire: "",
  suicideDescription: "",

  // Family Composition
  familyMembers: [],
  familyNotes: "",

  // Home and Economic Condition
  homeCondition: "",
  economicSituation: "",

  // Education Background
  currentlyAttendingSchool: "",
  schoolName: "",
  schoolLocation: "",
  currentGradeLevel: "",
  everAttendedSchool: "",
  highestGradeLevel: "",
  mostRecentYear: "",
  mostRecentSchool: "",
  mostRecentSchoolLocation: "",

  // Health Record
  nonPregnancyHealthIssues: "",
  healthIssuesDescription: "",
  hivStatus: "",
  pregnancyHealthIssues: "",

  // Adoption
  consideredAdoption: "",
  openToAdoption: "",

  // Final Recommendation
  meetsTkpCriteria: "",
  ageRange: "",
  abortionSuicidalIntent: "",
  abuseConception: "",
  confirmedPregnant: "",
  familyCommitment: "",
  tkpRecommendation: "",
  assessmentDate: "",
  referringOrganization: "",
  tkpSocialWorker: "",
  dswOfficer: "",
  recommendationDescription: "",
});

const addFamilyMember = () => {
  formData.familyMembers.push({
    relation: "",
    name: "",
    age: "",
    gender: "",
    occupation: "",
    location: "",
  });
};

const removeFamilyMember = (index) => {
  formData.familyMembers.splice(index, 1);
};

const handleSubmit = async (event) => {
  // Prevent default form submission
  if (event) {
    event.preventDefault();
  }

  loading.value = true;
  try {
    // Only check for duplicates if not in outreach mode
    if (!props.isOutreachMode) {
      // Check for duplicate child records before saving
      const { default: DuplicationService } = await import(
        "../services/duplicationService.js"
      );

      const duplicateCheck = await DuplicationService.checkDuplicateChild({
        childFirstName: formData.childFirstName,
        childSurname: formData.childSurname,
        dateOfBirth: formData.dateOfBirth,
        ageAtIntake: formData.age,
      });

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

Do you want to continue and create this assessment anyway?`
          );

          if (!userConfirmed) {
            loading.value = false;
            error("Form submission cancelled to prevent duplicate entry");
            return;
          } else {
            console.warn(
              "User confirmed duplicate child override:",
              duplicateInfo
            );
          }
        } else {
          // Medium confidence duplicates - just warn
          const warningInfo = duplicateCheck.duplicates
            .map((dup) => {
              const childName = `${dup.data.childFirstName} ${dup.data.childSurname}`;
              return `${childName} - ${dup.reason}`;
            })
            .join(", ");
          console.warn("Potential duplicates found:", warningInfo);
        }
      }
    }

    // Use EnhancedOutreachService when in outreach mode, otherwise use FormService
    if (props.isOutreachMode) {
      // Import EnhancedOutreachService dynamically
      const { default: EnhancedOutreachService } = await import("../services/enhancedOutreachService.js");
      
      // Create form data structure for outreach service
      const outreachFormData = {
        formType: "initial-assessment",
        childName: `${formData.childFirstName} ${formData.childSurname}`,
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
        success("Assessment form saved successfully!");
        resetForm();
      } else {
        error("Error saving form: " + result.error);
      }
    } else {
      // Import FormService dynamically to avoid circular imports
      const { default: FormService } = await import("../services/formService.js");

      const result = await FormService.saveInitialAssessment(formData);

      if (result.success) {
        // Emit success event to parent component with form data
        emit("form-saved", {
          formType: "initial-assessment",
          id: result.id,
          childName: `${formData.childFirstName} ${formData.childSurname}`,
          data: { ...formData },
        });
        success("Assessment form saved successfully!");
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
    if (key === "familyMembers") {
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

.assessment-form {
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

  .assessment-form {
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

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
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

  .form-group label {
    font-size: 0.75rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.4rem;
    font-size: 0.8rem;
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