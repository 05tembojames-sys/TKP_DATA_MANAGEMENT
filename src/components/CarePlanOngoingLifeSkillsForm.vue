<template>
  <div class="care-plan-ongoing-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2>Care Plan - Ongoing - Life Skills</h2>
      <div class="progress-indicator">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: (currentSection / 8) * 100 + '%' }"
          ></div>
        </div>
        <p class="progress-text">Section {{ currentSection }} of 8</p>
      </div>
    </div>

    <!-- Validation Message -->
    <div v-if="showValidationMessage" class="validation-message">
      ⚠️ Please fill in all required fields before proceeding.
    </div>

    <!-- Section 1: Girl Information -->
    <div v-show="currentSection === 1" class="form-section">
      <h3>Section 1: Girl Information</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Name of Girl: <span class="required">*</span></label>
          <input v-model="formData.girlName" type="text" required />
        </div>
        <div class="form-group">
          <label>Girl's Age (years): <span class="required">*</span></label>
          <input
            v-model.number="formData.girlAge"
            type="number"
            min="0"
            required
          />
        </div>
        <div class="form-group">
          <label>Grade: <span class="required">*</span></label>
          <input v-model="formData.grade" type="text" required />
        </div>
        <div class="form-group">
          <label>Date of Admission: <span class="required">*</span></label>
          <input 
            v-model="formData.dateOfAdmission" 
            type="text" 
            placeholder="DD-MM-YYYY"
            required
            @blur="formatDate('dateOfAdmission')"
          />
        </div>
        <div class="form-group">
          <label>Baby's Age (months):</label>
          <input v-model.number="formData.babyAge" type="number" min="0" />
        </div>
        <div class="form-group">
          <label>Date of Assessment: <span class="required">*</span></label>
          <input 
            v-model="formData.dateOfAssessment" 
            type="text" 
            placeholder="DD-MM-YYYY"
            required
            @blur="formatDate('dateOfAssessment')"
          />
        </div>
      </div>
    </div>

    <!-- Section 2: Personal Hygiene -->
    <div v-show="currentSection === 2" class="form-section">
      <h3>Section 2: Life Skills Survey - Personal Hygiene</h3>
      <p class="section-instruction">
        Rate the level of independence with which the girl can carry out tasks
        (indicate with selection).
      </p>

      <div class="skills-table">
        <div class="table-header">
          <div class="skill-name">Skill</div>
          <div class="rating-options">
            <span>Does Not Do</span>
            <span>Lots of Help</span>
            <span>Some Help</span>
            <span>Minimal Help</span>
            <span>Independently</span>
          </div>
        </div>

        <div
          v-for="(skill, index) in personalHygieneSkills"
          :key="index"
          class="table-row"
        >
          <div class="skill-name">{{ skill.question }}</div>
          <div class="rating-options">
            <label v-for="rating in ratingScale" :key="rating.value">
              <input
                v-model="formData.personalHygiene[skill.key]"
                type="radio"
                :value="rating.value"
              />
              <span class="radio-custom"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group full-width">
        <label>Additional Comments:</label>
        <textarea
          v-model="formData.personalHygieneComments"
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- Section 3: Household Chores -->
    <div v-show="currentSection === 3" class="form-section">
      <h3>Section 3: Household Chores and Tasks</h3>

      <div class="skills-table">
        <div class="table-header">
          <div class="skill-name">Skill</div>
          <div class="rating-options">
            <span>Does Not Do</span>
            <span>Lots of Help</span>
            <span>Some Help</span>
            <span>Minimal Help</span>
            <span>Independently</span>
          </div>
        </div>

        <div
          v-for="(skill, index) in householdChoresSkills"
          :key="index"
          class="table-row"
        >
          <div class="skill-name">{{ skill.question }}</div>
          <div class="rating-options">
            <label v-for="rating in ratingScale" :key="rating.value">
              <input
                v-model="formData.householdChores[skill.key]"
                type="radio"
                :value="rating.value"
              />
              <span class="radio-custom"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group full-width">
        <label>Additional Comments:</label>
        <textarea
          v-model="formData.householdChoresComments"
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- Section 4: Personal Health -->
    <div v-show="currentSection === 4" class="form-section">
      <h3>Section 4: Personal Health and Medical Care</h3>

      <div class="skills-table">
        <div class="table-header">
          <div class="skill-name">Skill</div>
          <div class="rating-options">
            <span>Does Not Do</span>
            <span>Lots of Help</span>
            <span>Some Help</span>
            <span>Minimal Help</span>
            <span>Independently</span>
          </div>
        </div>

        <div
          v-for="(skill, index) in personalHealthSkills"
          :key="index"
          class="table-row"
        >
          <div class="skill-name">
            {{ skill.question }}
            <span v-if="skill.key === 'understandsChronicHealth'" class="note">
              (If N/A:
              <input
                v-model="formData.chronicHealthNA"
                type="checkbox"
                style="display: inline; width: auto"
              />)
            </span>
          </div>
          <div class="rating-options">
            <label v-for="rating in ratingScale" :key="rating.value">
              <input
                v-model="formData.personalHealth[skill.key]"
                type="radio"
                :value="rating.value"
                :disabled="
                  skill.key === 'understandsChronicHealth' &&
                  formData.chronicHealthNA
                "
              />
              <span class="radio-custom"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group full-width">
        <label>Additional Comments:</label>
        <textarea v-model="formData.personalHealthComments" rows="3"></textarea>
      </div>
    </div>

    <!-- Section 5: Community Skills -->
    <div v-show="currentSection === 5" class="form-section">
      <h3>Section 5: Community and Society Skills</h3>

      <div class="skills-table">
        <div class="table-header">
          <div class="skill-name">Skill</div>
          <div class="rating-options">
            <span>Does Not Do</span>
            <span>Lots of Help</span>
            <span>Some Help</span>
            <span>Minimal Help</span>
            <span>Independently</span>
          </div>
        </div>

        <div
          v-for="(skill, index) in communitySkills"
          :key="index"
          class="table-row"
        >
          <div class="skill-name">{{ skill.question }}</div>
          <div class="rating-options">
            <label v-for="rating in ratingScale" :key="rating.value">
              <input
                v-model="formData.communitySkills[skill.key]"
                type="radio"
                :value="rating.value"
              />
              <span class="radio-custom"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group full-width">
        <label>Additional Comments:</label>
        <textarea
          v-model="formData.communitySkillsComments"
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- Section 6: Food Preparation -->
    <div v-show="currentSection === 6" class="form-section">
      <h3>Section 6: Food Preparation and Safety Skills</h3>

      <div class="skills-table">
        <div class="table-header">
          <div class="skill-name">Skill</div>
          <div class="rating-options">
            <span>Does Not Do</span>
            <span>Lots of Help</span>
            <span>Some Help</span>
            <span>Minimal Help</span>
            <span>Independently</span>
          </div>
        </div>

        <div
          v-for="(skill, index) in foodPrepSkills"
          :key="index"
          class="table-row"
        >
          <div class="skill-name">{{ skill.question }}</div>
          <div class="rating-options">
            <label v-for="rating in ratingScale" :key="rating.value">
              <input
                v-model="formData.foodPrep[skill.key]"
                type="radio"
                :value="rating.value"
              />
              <span class="radio-custom"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group full-width">
        <label>Nutrition and Additional Comments:</label>
        <textarea v-model="formData.foodPrepComments" rows="3"></textarea>
      </div>
    </div>

    <!-- Section 7: Mothering Skills -->
    <div v-show="currentSection === 7" class="form-section">
      <h3>Section 7: Mothering Skills</h3>

      <div class="skills-table">
        <div class="table-header">
          <div class="skill-name">Skill</div>
          <div class="rating-options">
            <span>Does Not Do</span>
            <span>Lots of Help</span>
            <span>Some Help</span>
            <span>Minimal Help</span>
            <span>Independently</span>
          </div>
        </div>

        <div
          v-for="(skill, index) in motheringSkillsBasic"
          :key="index"
          class="table-row"
        >
          <div class="skill-name">{{ skill.question }}</div>
          <div class="rating-options">
            <label v-for="rating in ratingScale" :key="rating.value">
              <input
                v-model="formData.motheringSkills[skill.key]"
                type="radio"
                :value="rating.value"
              />
              <span class="radio-custom"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group full-width">
        <label>Has the girl received any CPR/First Aid training?</label>
        <div class="radio-group horizontal-radio">
          <label class="radio-label">
            <input v-model="formData.cprTraining" type="radio" value="NO" />
            <span>NO</span>
          </label>
          <label class="radio-label">
            <input v-model="formData.cprTraining" type="radio" value="YES" />
            <span>YES</span>
          </label>
        </div>
      </div>

      <div class="alert-box">
        <p>
          <strong
            >Continue filling out the questions below if the girl is assuming
            primary caregiving responsibility for the baby. If not, skip to next
            section.</strong
          >
        </p>
      </div>

      <div class="skills-table">
        <div
          v-for="(skill, index) in motheringSkillsAdvanced"
          :key="index"
          class="table-row"
        >
          <div class="skill-name">{{ skill.question }}</div>
          <div class="rating-options">
            <label v-for="rating in ratingScale" :key="rating.value">
              <input
                v-model="formData.motheringSkillsAdvanced[skill.key]"
                type="radio"
                :value="rating.value"
              />
              <span class="radio-custom"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group full-width">
        <label>Nutrition and Additional Comments:</label>
        <textarea
          v-model="formData.motheringSkillsComments"
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- Section 8: Goals and Signatures -->
    <div v-show="currentSection === 8" class="form-section">
      <h3>Section 8: Life Skills Goals for Improvement</h3>
      <p class="section-instruction">
        Describe a brief goal for life skill development in each category. Goals
        should be specific to areas of improvement needed for the individual
        girl.
      </p>

      <div class="goals-section">
        <div class="form-group full-width">
          <label>Personal Hygiene Goal:</label>
          <textarea
            v-model="formData.goals.personalHygiene"
            rows="2"
            placeholder="Specific goal for personal hygiene improvement..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Personal Health and Medical Care Goal:</label>
          <textarea
            v-model="formData.goals.personalHealth"
            rows="2"
            placeholder="Specific goal for health/medical care improvement..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Household Chores and Tasks Goal:</label>
          <textarea
            v-model="formData.goals.householdChores"
            rows="2"
            placeholder="Specific goal for household tasks improvement..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Community and Society Skills Goal:</label>
          <textarea
            v-model="formData.goals.communitySkills"
            rows="2"
            placeholder="Specific goal for community skills improvement..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Food Preparation Skills Goal:</label>
          <textarea
            v-model="formData.goals.foodPrep"
            rows="2"
            placeholder="Specific goal for food preparation improvement..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Mothering Skills Goal:</label>
          <textarea
            v-model="formData.goals.motheringSkills"
            rows="2"
            placeholder="Specific goal for mothering skills improvement..."
          ></textarea>
        </div>
      </div>

      <div class="form-group">
        <label>Date of Next Assessment (3 months from now):</label>
        <input v-model="formData.nextAssessmentDate" type="date" />
      </div>

      <h4>Assessment Completed By:</h4>
      <div class="form-grid">
        <div class="form-group">
          <label>Social Worker Name:</label>
          <input v-model="formData.socialWorkerName" type="text" />
        </div>
        <div class="form-group">
          <label>Social Worker Signature:</label>
          <input
            v-model="formData.socialWorkerSignature"
            type="text"
            placeholder="Type name as signature"
          />
        </div>
        <div class="form-group">
          <label>House Mother Name:</label>
          <input v-model="formData.houseMotherName" type="text" />
        </div>
        <div class="form-group">
          <label>House Mother Signature:</label>
          <input
            v-model="formData.houseMotherSignature"
            type="text"
            placeholder="Type name as signature"
          />
        </div>
        <div class="form-group">
          <label>House Mother 2 Name (optional):</label>
          <input v-model="formData.houseMother2Name" type="text" />
        </div>
        <div class="form-group">
          <label>House Mother 2 Signature (optional):</label>
          <input
            v-model="formData.houseMother2Signature"
            type="text"
            placeholder="Type name as signature"
          />
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="form-navigation">
      <button
        v-if="currentSection > 1"
        @click="previousSection"
        class="nav-btn prev-btn"
      >
        Previous
      </button>
      <button
        v-if="currentSection < 8"
        @click="nextSection"
        class="nav-btn next-btn"
      >
        Next
      </button>
      <button
        v-if="currentSection === 8"
        @click="submitForm"
        class="nav-btn submit-btn"
      >
        Submit Form
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import FormService from "../services/formService.js";

const emit = defineEmits(["form-saved"]);

const currentSection = ref(1);
const showValidationMessage = ref(false);

const ratingScale = [
  { value: "DOES_NOT_DO", label: "Does Not Do" },
  { value: "LOTS_OF_HELP", label: "Does with Lots of Help" },
  { value: "SOME_HELP", label: "Does with Some Help" },
  { value: "MINIMAL_HELP", label: "Does with Minimal Help" },
  { value: "INDEPENDENTLY", label: "Does Independently" },
];

const personalHygieneSkills = [
  {
    key: "batheClean",
    question: "Does the girl know how to bathe and clean herself properly?",
  },
  { key: "washHands", question: "Does the girl know how to wash her hands?" },
  {
    key: "brushTeeth",
    question: "Can the girl brush her teeth independently?",
  },
  { key: "useToilet", question: "Does the girl know how to use the toilet?" },
  {
    key: "personalGrooming",
    question:
      "Does the girl seem to manage her own personal grooming (fixing hair, lotion, regularly showers)?",
  },
];

const householdChoresSkills = [
  { key: "washClothes", question: "Can the girl wash clothes independently?" },
  { key: "ironClothes", question: "Does the girl know how to iron clothes?" },
  {
    key: "cleanToilet",
    question: "Does the girl know how to clean the toilet?",
  },
  { key: "cleanFloors", question: "Does the girl know how to clean floors?" },
  { key: "makeBed", question: "Does the girl know how to make the bed?" },
  {
    key: "sew",
    question: "Does the girl know how to sew clothes with a needle?",
  },
  { key: "garden", question: "Does the girl know how to garden?" },
];

const personalHealthSkills = [
  {
    key: "describeSymptoms",
    question: "Does the girl understand how to describe her symptoms when ill?",
  },
  {
    key: "understandsChronicHealth",
    question: "Does the girl understand her chronic health status?",
  },
  {
    key: "administerMedication",
    question:
      "If taking routine medication, does the girl administer medications independently?",
  },
  {
    key: "firstAid",
    question:
      "Does the girl know basic first aid skills? (i.e. cleaning open wounds, applying bandage, etc)",
  },
  {
    key: "manageMenstruation",
    question:
      "Does the girl know how to manage her menstrual periods (hygiene, etc.)?",
  },
];

const communitySkills = [
  {
    key: "publicTransport",
    question: "Does the girl know how to use public transport?",
  },
  {
    key: "makePurchase",
    question: "Does the girl know how to make a purchase in a store?",
  },
  {
    key: "avoidDanger",
    question:
      'Does the girl have "people smarts" and know how to avoid danger in the community?',
  },
  {
    key: "usePhone",
    question: "Does the girl know how to use the phone/make a phone call?",
  },
  {
    key: "chooseClothing",
    question:
      "Does the girl know how to choose appropriate clothing depending on the situation?",
  },
];

const foodPrepSkills = [
  {
    key: "cookMeals",
    question: "Does the girl know how to prepare and cook meals?",
  },
  {
    key: "useBrazier",
    question: "Does the girl know how to safely use a brazier?",
  },
  {
    key: "useElectricStove",
    question: "Does the girl know how to safely use an electric stove/cooker?",
  },
  {
    key: "storeFood",
    question: "Does the girl know how to safely store leftover food?",
  },
  {
    key: "useKitchenTools",
    question:
      "Does the girl know how to use common kitchen tools? (not including electrical appliances)",
  },
  { key: "cleanDishes", question: "Does the girl know how to clean dishes?" },
  {
    key: "cleanKitchen",
    question:
      "Does the girl know how to properly clean the kitchen after cooking?",
  },
];

const motheringSkillsBasic = [
  {
    key: "changeDiapers",
    question:
      "Does the girl know how to properly change, clean, and put on the reusable diapers?",
  },
  {
    key: "clotheBaby",
    question:
      "Does the girl independently clothe her baby in correctly sized, weather-appropriate clothing?",
  },
  {
    key: "playWithBaby",
    question:
      "Does the girl interactively play with baby? (i.e. reading books, walking around outside, using developmental toys, etc)",
  },
  {
    key: "ageAppropriateItems",
    question:
      "Does the girl know how to determine which items and toys are age-appropriate for baby?",
  },
  {
    key: "identifySickness",
    question:
      "Is the girl able to identify signs that her baby is not feeling well, running a fever, etc?",
  },
  {
    key: "attentiveToCrying",
    question:
      "When crying, is the girl quick and attentive in caring for baby and addressing baby's need?",
  },
  {
    key: "trySolutions",
    question:
      "When crying, does the girl try various solutions before using the pacifier/breast to quiet baby? (i.e. check diaper, assess if ill/in pain, too hot/cold)",
  },
];

const motheringSkillsAdvanced = [
  {
    key: "batheBaby",
    question: "Does the girl know how to properly bathe her baby?",
  },
  {
    key: "swaddleBaby",
    question: "Does the girl know how to properly swaddle her baby?",
  },
  {
    key: "maintainSchedule",
    question:
      "Does the girl independently maintain her baby's schedule (eat/wake/sleep)?",
  },
  {
    key: "useBreastPump",
    question:
      "Does the girl know how to use, clean, and maintain the breast pump?",
  },
  {
    key: "storeBreastMilk",
    question: "Does the girl know how to properly store breast milk/formula?",
  },
  {
    key: "prepareBabyFood",
    question:
      "Does the girl know how to independently prepare breast milk/baby food?",
  },
];

const formData = reactive({
  girlName: "",
  girlAge: null,
  grade: "",
  dateOfAdmission: "",
  babyAge: null,
  dateOfAssessment: "",
  personalHygiene: {},
  personalHygieneComments: "",
  householdChores: {},
  householdChoresComments: "",
  personalHealth: {},
  chronicHealthNA: false,
  personalHealthComments: "",
  communitySkills: {},
  communitySkillsComments: "",
  foodPrep: {},
  foodPrepComments: "",
  motheringSkills: {},
  cprTraining: "",
  motheringSkillsAdvanced: {},
  motheringSkillsComments: "",
  goals: {
    personalHygiene: "",
    personalHealth: "",
    householdChores: "",
    communitySkills: "",
    foodPrep: "",
    motheringSkills: "",
  },
  nextAssessmentDate: "",
  socialWorkerName: "",
  socialWorkerSignature: "",
  houseMotherName: "",
  houseMotherSignature: "",
  houseMother2Name: "",
  houseMother2Signature: "",
  
  // Child identification fields (needed for form service)
  childFirstName: "",
  childSurname: "",
  dateOfBirth: "",
});

// Check for child data from sessionStorage when form loads
onMounted(() => {
  console.log("📋 CarePlanOngoingLifeSkillsForm mounted, checking for child data...");

  const storedChildData = sessionStorage.getItem("selectedChildForForm");

  if (storedChildData) {
    try {
      const childData = JSON.parse(storedChildData);
      console.log("👶 Found child data in sessionStorage:", childData);

      // Pre-populate child identification fields
      if (childData.childFirstName) {
        formData.childFirstName = childData.childFirstName;
      }
      if (childData.childSurname) {
        formData.childSurname = childData.childSurname;
      }
      if (childData.dateOfBirth) {
        formData.dateOfBirth = childData.dateOfBirth;
      }

      // Pre-populate girlName field if not already set
      if (!formData.girlName && childData.childFirstName) {
        formData.girlName = childData.childFirstName;
      }

      console.log("✅ Form pre-populated with child data");
    } catch (error) {
      console.error("Error parsing child data from sessionStorage:", error);
    }
  }
});

const validateSection = () => {
  if (currentSection.value === 1) {
    return (
      formData.girlName &&
      formData.girlAge &&
      formData.grade &&
      formData.dateOfAdmission &&
      formData.dateOfAssessment
    );
  }
  return true;
};

const nextSection = () => {
  if (validateSection()) {
    showValidationMessage.value = false;
    currentSection.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showValidationMessage.value = true;
  }
};

const previousSection = () => {
  showValidationMessage.value = false;
  currentSection.value--;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const submitForm = async () => {
  if (!validateSection()) {
    showValidationMessage.value = true;
    return;
  }

  try {
    // Use the correct method for this form type
    const result = await FormService.saveCarePlanOngoingLifeSkills(formData);
    if (result.success) {
      alert("Care Plan - Ongoing - Life Skills form submitted successfully!");
      emit("form-saved", result.id);
      resetForm();
    } else {
      alert("Error submitting form: " + result.error);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error submitting form. Please try again.");
  }
};

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === "object" && !Array.isArray(formData[key])) {
      formData[key] = {};
    } else {
      formData[key] = typeof formData[key] === "number" ? null : "";
    }
  });
  formData.goals = {
    personalHygiene: "",
    personalHealth: "",
    householdChores: "",
    communitySkills: "",
    foodPrep: "",
    motheringSkills: "",
  };
  currentSection.value = 1;
  showValidationMessage.value = false;
};

const formatDate = (fieldName) => {
  const date = formData[fieldName];
  if (date) {
    const parts = date.split("-");
    if (parts.length === 3) {
      const year = parts[2];
      const month = parts[1];
      const day = parts[0];
      formData[fieldName] = `${year}-${month}-${day}`;
    }
  }
};
</script>

<style scoped>
.care-plan-ongoing-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 3px solid #9c27b0;
}

.form-header h2 {
  color: #9c27b0;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.progress-indicator {
  max-width: 500px;
  margin: 0 auto;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
  transition: width 0.3s ease;
}

.progress-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.validation-message {
  background: #fff3cd;
  border: 2px solid #ffc107;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #856404;
  text-align: center;
  font-weight: 500;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  color: #9c27b0;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.form-section h4 {
  color: #673ab7;
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem;
}

.section-instruction {
  background: #f3e5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #4a148c;
  font-style: italic;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.required {
  color: #d32f2f;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="date"],
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
  border-color: #9c27b0;
  box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.1);
}

.skills-table {
  margin-bottom: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 3fr;
  border-bottom: 1px solid #e0e0e0;
}

.table-header {
  background: #9c27b0;
  color: white;
  font-weight: 600;
  padding: 1rem;
}

.table-row {
  padding: 1rem;
  transition: background 0.2s ease;
}

.table-row:hover {
  background: #f8f8f8;
}

.table-row:last-child {
  border-bottom: none;
}

.skill-name {
  display: flex;
  align-items: center;
  padding-right: 1rem;
  color: #333;
}

.rating-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  align-items: center;
}

.table-header .rating-options span {
  text-align: center;
  font-size: 0.85rem;
  padding: 0.25rem;
}

.table-row .rating-options label {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.table-row .rating-options input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.note {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.alert-box {
  background: #fff9e6;
  border: 2px solid #ff9800;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.alert-box p {
  margin: 0;
  color: #e65100;
  font-weight: 500;
}

.radio-group.horizontal-radio {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.goals-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.nav-btn {
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

.prev-btn {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
}

.prev-btn:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.next-btn {
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
  color: white;
  margin-left: auto;
}

.next-btn:hover {
  background: linear-gradient(135deg, #8b1fa3 0%, #5e35b1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
}

.submit-btn {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  margin-left: auto;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

@media (max-width: 768px) {
  .care-plan-ongoing-form {
    padding: 1rem;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }

  .rating-options {
    grid-template-columns: repeat(5, 1fr);
    margin-top: 0.5rem;
  }

  .table-header .rating-options {
    display: none;
  }

  .form-navigation {
    flex-direction: column;
  }

  .nav-btn {
    width: 100%;
  }

  .next-btn,
  .submit-btn {
    margin-left: 0;
  }
}
</style>
