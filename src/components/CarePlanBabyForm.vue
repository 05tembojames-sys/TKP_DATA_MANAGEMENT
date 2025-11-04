<template>
  <div class="care-plan-baby-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2>Care Plan - Individual Summary (Baby)</h2>
      <div class="progress-indicator">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: (currentSection / 5) * 100 + '%' }"
          ></div>
        </div>
        <p class="progress-text">Section {{ currentSection }} of 5</p>
      </div>
    </div>

    <!-- Validation Message -->
    <div v-if="showValidationMessage" class="validation-message">
      ⚠️ Please fill in all required fields before proceeding.
    </div>

    <!-- Section 1: Baby Information -->
    <div v-show="currentSection === 1" class="form-section">
      <h3>Section 1: Baby Information</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Name of Baby: <span class="required">*</span></label>
          <input
            v-model="formData.nameOfBaby"
            type="text"
            placeholder="Enter baby's name"
            required
          />
        </div>
        <div class="form-group">
          <label>Name of Mother: <span class="required">*</span></label>
          <input
            v-model="formData.nameOfMother"
            type="text"
            placeholder="Enter mother's name"
            required
          />
        </div>
        <div class="form-group">
          <label
            >Baby's Current Age (months): <span class="required">*</span></label
          >
          <input
            v-model.number="formData.babyCurrentAge"
            type="number"
            min="0"
            placeholder="e.g., 12"
            required
          />
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
        <div class="form-group full-width">
          <label>Type of Assessment: <span class="required">*</span></label>
          <div class="radio-group horizontal-radio">
            <label class="radio-label">
              <input
                v-model="formData.assessmentType"
                type="radio"
                value="INITIAL"
              />
              <span
                >This is an INITIAL assessment, completed upon mother's
                admission</span
              >
            </label>
            <label class="radio-label">
              <input
                v-model="formData.assessmentType"
                type="radio"
                value="BENCHMARK"
              />
              <span>This is a BENCHMARK assessment</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Determinants -->
    <div v-show="currentSection === 2" class="form-section">
      <h3>Section 2: Determinants</h3>
      <div class="subsection">
        <h4>AGE</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>How old will the mother be two years after admission?</label>
            <input
              v-model.number="formData.motherAgeTwoYears"
              type="number"
              min="0"
              placeholder="e.g., 17"
            />
          </div>
          <div class="form-group">
            <label>How old will the baby be (in months)?</label>
            <input
              v-model.number="formData.babyAgeTwoYears"
              type="number"
              min="0"
              placeholder="e.g., 24"
            />
          </div>
        </div>
      </div>
      <div class="subsection">
        <h4>CURRENT RECOMMENDED REINTEGRATION PLAN FOR BABY</h4>
        <p class="info-text">
          Please tick the current recommended reintegration plan for the baby:
        </p>
        <div class="form-group full-width">
          <div class="radio-group">
            <label class="radio-label"
              ><input
                v-model="formData.reintegrationPlan"
                type="radio"
                value="WITH_MOTHER_TO_FAMILY"
              /><span
                >Return to family of baby's mother, WITH baby's mother</span
              ></label
            >
            <label class="radio-label"
              ><input
                v-model="formData.reintegrationPlan"
                type="radio"
                value="WITHOUT_MOTHER_TO_FAMILY"
              /><span
                >Return to family of baby's mother, WITHOUT baby's mother</span
              ></label
            >
            <label class="radio-label"
              ><input
                v-model="formData.reintegrationPlan"
                type="radio"
                value="MOTHER_INDEPENDENT"
              /><span
                >Baby's mother as primary caregiver, independent living</span
              ></label
            >
            <label class="radio-label"
              ><input
                v-model="formData.reintegrationPlan"
                type="radio"
                value="ALTERNATIVE_WITH_MOTHER"
              /><span
                >Alternative care facility, WITH baby's mother</span
              ></label
            >
            <label class="radio-label"
              ><input
                v-model="formData.reintegrationPlan"
                type="radio"
                value="ALTERNATIVE_WITHOUT_MOTHER"
              /><span
                >Alternative care facility, WITHOUT baby's mother</span
              ></label
            >
            <label class="radio-label"
              ><input
                v-model="formData.reintegrationPlan"
                type="radio"
                value="FOSTER_ADOPTION"
              /><span>Foster care and/or adoption</span></label
            >
          </div>
        </div>
        <div class="form-group full-width">
          <label>Describe rationale:</label>
          <textarea
            v-model="formData.reintegrationRationale"
            rows="4"
            placeholder="Explain the rationale for this reintegration plan..."
          ></textarea>
        </div>
        <div
          v-if="
            formData.reintegrationPlan === 'WITHOUT_MOTHER_TO_FAMILY' ||
            formData.reintegrationPlan === 'ALTERNATIVE_WITHOUT_MOTHER'
          "
          class="form-group full-width"
        >
          <label
            >If TKP is recommending the baby and baby's mother are reintegrated
            separately, please explain why:</label
          >
          <textarea
            v-model="formData.separateReintegrationReason"
            rows="4"
            placeholder="Explain why baby and mother will be separated..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Section 3: Family Details -->
    <div v-show="currentSection === 3" class="form-section">
      <h3>Section 3: Family Details</h3>

      <div class="subsection">
        <h4>FAMILY</h4>
        <p class="info-text">
          *to be completed if "return to family of baby's mother" was chosen as
          recommended plan
        </p>

        <div class="form-grid">
          <div class="form-group full-width">
            <label
              >Who is the TKP-recommended guardian to receive the baby's mother
              upon reintegration?</label
            >
          </div>
          <div class="form-group">
            <label>Guardian Name:</label>
            <input
              v-model="formData.motherGuardianName"
              type="text"
              placeholder="Enter guardian's name"
            />
          </div>
          <div class="form-group">
            <label>Relation to Baby's Mother:</label>
            <input
              v-model="formData.motherGuardianRelation"
              type="text"
              placeholder="e.g., Grandmother, Aunt"
            />
          </div>
          <div class="form-group full-width">
            <label
              >Is this the recommended guardian for the baby as well?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.sameGuardianForBaby"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.sameGuardianForBaby"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div
            v-if="formData.sameGuardianForBaby === false"
            class="form-group full-width"
          >
            <h5>
              If "NO," who is the TKP-recommended guardian to receive the baby
              upon reintegration?
            </h5>
            <div class="form-grid">
              <div class="form-group">
                <label>Guardian Name:</label>
                <input
                  v-model="formData.babyGuardianName"
                  type="text"
                  placeholder="Enter guardian's name"
                />
              </div>
              <div class="form-group">
                <label>Relation to Baby's Mother:</label>
                <input
                  v-model="formData.babyGuardianRelation"
                  type="text"
                  placeholder="e.g., Grandmother, Aunt"
                />
              </div>
            </div>
          </div>
          <div class="form-group full-width">
            <label>Why was this guardian chosen to receive the baby?</label>
            <textarea
              v-model="formData.babyGuardianRationale"
              rows="3"
              placeholder="Explain why this guardian is recommended for the baby..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="subsection">
        <h4>FAMILY CAPACITY</h4>
        <div class="form-grid">
          <div class="form-group full-width">
            <label
              >Do the adults in the family have ample capacity to help care for
              the baby?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.familyCapacity"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.familyCapacity"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label>Describe:</label>
            <textarea
              v-model="formData.familyCapacityDescription"
              rows="3"
              placeholder="Describe family's capacity to care for the baby..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="subsection">
        <h4>FAMILY FINANCIAL STATUS</h4>
        <div class="form-grid">
          <div class="form-group">
            <label
              >Does the family have enough income to support the baby?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.familyFinancialSupport"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.familyFinancialSupport"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label
              >Is the family reliant upon a trade skill learned through
              TKP?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.familyReliantOnTKPTrade"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.familyReliantOnTKPTrade"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="subsection">
        <h4>FAMILY WILLINGNESS</h4>
        <div class="form-grid">
          <div class="form-group">
            <label
              >Is the family willing to help care for both the mother and the
              baby?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.familyWillingToCare"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.familyWillingToCare"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label
              >Will the family support the best interests of the girl's
              future?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.familySupportFuture"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.familySupportFuture"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label>Describe:</label>
            <textarea
              v-model="formData.familyWillingnessDescription"
              rows="3"
              placeholder="Describe family's willingness and support..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: Home Environment/Safety Concerns -->
    <div v-show="currentSection === 4" class="form-section">
      <h3>Section 4: Home Environment/Safety Concerns</h3>

      <div class="subsection">
        <h4>PHYSICAL STATE OF THE HOME</h4>
        <div class="form-grid">
          <div class="form-group">
            <label
              >Does the family plan/desire to relocate before
              reintegration?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.familyPlanRelocate"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.familyPlanRelocate"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div v-if="formData.familyPlanRelocate" class="form-group">
            <label>If yes, why?</label>
            <input
              v-model="formData.planRelocateReason"
              type="text"
              placeholder="Explain why..."
            />
          </div>
          <div class="form-group">
            <label>Is relocation a probability before reintegration?</label>
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.relocationProbability"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.relocationProbability"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div v-if="formData.relocationProbability" class="form-group">
            <label>If yes, why?</label>
            <input
              v-model="formData.relocationProbabilityReason"
              type="text"
              placeholder="Explain why..."
            />
          </div>
          <div class="form-group">
            <label>If relocating, does the family know the new location?</label>
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.familyKnowsNewLocation"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.familyKnowsNewLocation"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div v-if="formData.familyKnowsNewLocation" class="form-group">
            <label>If yes, where?</label>
            <input
              v-model="formData.newLocation"
              type="text"
              placeholder="Enter new location"
            />
          </div>
          <div class="form-group full-width">
            <label>Current Location:</label>
            <input
              v-model="formData.currentLocation"
              type="text"
              placeholder="Enter current location"
            />
          </div>
          <div class="form-group full-width">
            <label
              >What are potential physical safety concerns for the baby in this
              home environment, if any?</label
            >
            <textarea
              v-model="formData.babyPhysicalSafetyConcerns"
              rows="3"
              placeholder="Describe any physical safety concerns for the baby..."
            ></textarea>
          </div>
          <div class="form-group full-width">
            <label
              >Is this home environment a physically safe option for
              reintegration?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.homePhysicallySafe"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.homePhysicallySafe"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="subsection">
        <h4>SOCIAL ENVIRONMENT OF THE HOME</h4>
        <div class="form-grid">
          <div class="form-group full-width">
            <label
              >Are there any people in the home or surrounding areas that
              present a safety concern?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.peopleSafetyConcern"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.peopleSafetyConcern"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div
            v-if="formData.peopleSafetyConcern"
            class="form-group full-width"
          >
            <label>If yes, describe:</label>
            <textarea
              v-model="formData.peopleSafetyConcernDescription"
              rows="3"
              placeholder="Describe the safety concerns..."
            ></textarea>
          </div>
          <div class="form-group full-width">
            <h5>Is/does the baby's father...</h5>
          </div>
          <div class="form-group">
            <label>living in the home/surrounding area?</label>
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.fatherInArea"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.fatherInArea"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>in jail or on bail?</label>
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.fatherStatus"
                  type="radio"
                  value="IN JAIL"
                />
                <span>IN JAIL</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.fatherStatus"
                  type="radio"
                  value="ON BAIL"
                />
                <span>ON BAIL</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.fatherStatus"
                  type="radio"
                  value="N/A"
                />
                <span>N/A</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label>a live threat to the baby's reintegration?</label>
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.fatherThreat"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.fatherThreat"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div v-if="formData.fatherThreat" class="form-group full-width">
            <label>If yes, describe:</label>
            <textarea
              v-model="formData.fatherThreatDescription"
              rows="3"
              placeholder="Describe the threat..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5: Action Plan & Acknowledgment -->
    <div v-show="currentSection === 5" class="form-section">
      <h3>Section 5: Action Plan for Success</h3>

      <div class="subsection">
        <h4>FAMILY SUPPORT</h4>
        <div class="form-group full-width">
          <label
            >Describe measures that need to be taken to increase family
            capacity, foster family willingness, or otherwise prepare the family
            to receive the baby upon reintegration:</label
          >
          <textarea
            v-model="formData.familySupportMeasures"
            rows="4"
            placeholder="Describe measures needed for family support..."
          ></textarea>
        </div>
      </div>

      <div class="subsection">
        <h4>HOME ENVIRONMENT</h4>
        <div class="form-grid">
          <div class="form-group full-width">
            <label
              >What measures, if any, need to be taken to improve the physical
              state of the home prior to reintegration?</label
            >
            <textarea
              v-model="formData.homePhysicalMeasures"
              rows="3"
              placeholder="Describe physical improvements needed..."
            ></textarea>
          </div>
          <div class="form-group full-width">
            <label
              >What measures, if any, need to be taken to improve the social
              environment of the home prior to reintegration?</label
            >
            <textarea
              v-model="formData.homeSocialMeasures"
              rows="3"
              placeholder="Describe social environment improvements needed..."
            ></textarea>
          </div>
          <div class="form-group full-width">
            <label
              >Does additional family tracing need to be done to find a suitable
              home environment?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.needsFamilyTracing"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.needsFamilyTracing"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label>Describe:</label>
            <textarea
              v-model="formData.familyTracingDescription"
              rows="3"
              placeholder="Describe family tracing needs..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="subsection">
        <h4>REASSESSMENT OF CARE PLAN</h4>
        <p>This care plan will be re-assessed in 6 months.</p>
        <div class="form-grid">
          <div class="form-group">
            <label>Month:</label>
            <select v-model="formData.reassessmentMonth">
              <option value="">Select month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div class="form-group">
            <label>Year:</label>
            <input
              v-model.number="formData.reassessmentYear"
              type="number"
              min="2024"
              placeholder="e.g., 2025"
            />
          </div>
        </div>
      </div>

      <div class="subsection">
        <h4>ACKNOWLEDGMENT OF CARE PLAN</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>TKP Social Worker Name:</label>
            <input
              v-model="formData.socialWorkerName"
              type="text"
              placeholder="Enter social worker's name"
            />
          </div>
          <div class="form-group">
            <label>Social Worker Signature:</label>
            <input
              v-model="formData.socialWorkerSignature"
              type="text"
              placeholder="Type name to sign"
            />
          </div>
          <div class="form-group">
            <label>TKP Supervisor Name:</label>
            <input
              v-model="formData.supervisorName"
              type="text"
              placeholder="Enter supervisor's name"
            />
          </div>
          <div class="form-group">
            <label>Supervisor Signature:</label>
            <input
              v-model="formData.supervisorSignature"
              type="text"
              placeholder="Type name to sign"
            />
          </div>
          <div class="form-group">
            <label>Baby's Mother's Name:</label>
            <input
              v-model="formData.motherName"
              type="text"
              placeholder="Enter mother's name"
            />
          </div>
          <div class="form-group">
            <label>Mother's Signature:</label>
            <input
              v-model="formData.motherSignature"
              type="text"
              placeholder="Type name to sign"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="form-navigation">
      <button
        v-if="currentSection > 1"
        @click="previousSection"
        class="nav-btn prev-btn"
        type="button"
      >
        ← Previous
      </button>
      <button
        v-if="currentSection < 5"
        @click="nextSection"
        class="nav-btn next-btn"
        type="button"
      >
        Next →
      </button>
      <button
        v-if="currentSection === 5"
        @click="submitForm"
        class="nav-btn submit-btn"
        type="button"
      >
        ✔ Submit Care Plan
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FormService from "../services/formService.js";

const emit = defineEmits(["form-saved"]);
const currentSection = ref(1);
const showValidationMessage = ref(false);

const formData = ref({
  nameOfBaby: "",
  nameOfMother: "",
  babyCurrentAge: null,
  dateOfAssessment: "",
  assessmentType: "",
  motherAgeTwoYears: null,
  babyAgeTwoYears: null,
  reintegrationPlan: "",
  reintegrationRationale: "",
  separateReintegrationReason: "",
  motherGuardianName: "",
  motherGuardianRelation: "",
  sameGuardianForBaby: null,
  babyGuardianName: "",
  babyGuardianRelation: "",
  babyGuardianRationale: "",
  familyCapacity: null,
  familyCapacityDescription: "",
  familyFinancialSupport: null,
  familyReliantOnTKPTrade: null,
  familyWillingToCare: null,
  familySupportFuture: null,
  familyWillingnessDescription: "",
  familyPlanRelocate: null,
  planRelocateReason: "",
  relocationProbability: null,
  relocationProbabilityReason: "",
  familyKnowsNewLocation: null,
  newLocation: "",
  currentLocation: "",
  babyPhysicalSafetyConcerns: "",
  homePhysicallySafe: null,
  peopleSafetyConcern: null,
  peopleSafetyConcernDescription: "",
  fatherInArea: null,
  fatherStatus: "",
  fatherThreat: null,
  fatherThreatDescription: "",
  familySupportMeasures: "",
  homePhysicalMeasures: "",
  homeSocialMeasures: "",
  needsFamilyTracing: null,
  familyTracingDescription: "",
  reassessmentMonth: "",
  reassessmentYear: null,
  socialWorkerName: "",
  socialWorkerSignature: "",
  supervisorName: "",
  supervisorSignature: "",
  motherName: "",
  motherSignature: "",
  
  // Child identification fields (needed for form service)
  childFirstName: "",
  childSurname: "",
  dateOfBirth: "",
});

// Check for child data from sessionStorage when form loads
onMounted(() => {
  console.log("📋 CarePlanBabyForm mounted, checking for child data...");

  const storedChildData = sessionStorage.getItem("selectedChildForForm");

  if (storedChildData) {
    try {
      const childData = JSON.parse(storedChildData);
      console.log("👶 Found child data in sessionStorage:", childData);

      // Pre-populate child identification fields
      if (childData.childFirstName) {
        formData.value.childFirstName = childData.childFirstName;
      }
      if (childData.childSurname) {
        formData.value.childSurname = childData.childSurname;
      }
      if (childData.dateOfBirth) {
        formData.value.dateOfBirth = childData.dateOfBirth;
      }

      // Pre-populate nameOfMother field if not already set
      if (!formData.value.nameOfMother && childData.childFirstName) {
        formData.value.nameOfMother = childData.childFirstName;
      }

      console.log("✅ Form pre-populated with child data");
    } catch (error) {
      console.error("Error parsing child data from sessionStorage:", error);
    }
  }
});

const validateSection = (section) => {
  if (section === 1) {
    // Check if date is in DD-MM-YYYY format
    const datePattern = /^\d{2}-\d{2}-\d{4}$/;
    const isDateValid = formData.value.dateOfAssessment && datePattern.test(formData.value.dateOfAssessment);
    
    return !!(
      formData.value.nameOfBaby &&
      formData.value.nameOfMother &&
      formData.value.babyCurrentAge !== null &&
      isDateValid &&
      formData.value.assessmentType
    );
  }
  return true;
};

const formatDate = (fieldName) => {
  const date = formData.value[fieldName];
  if (date) {
    const parts = date.split("-");
    if (parts.length === 3) {
      formData.value[fieldName] = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
};

const validateDate = (dateString) => {
  // Check if date is in DD-MM-YYYY format
  if (!dateString) return false;
  
  const datePattern = /^\d{2}-\d{2}-\d{4}$/;
  if (!datePattern.test(dateString)) return false;
  
  const parts = dateString.split("-");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  return date.getDate() === day && 
         date.getMonth() === month && 
         date.getFullYear() === year;
};

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

const submitForm = async () => {
  // Validate date format before submitting
  if (!validateDate(formData.value.dateOfAssessment)) {
    alert("Date of Assessment must be in DD-MM-YYYY format");
    return;
  }
  
  try {
    // Convert date to YYYY-MM-DD format for backend
    const formDataToSend = { ...formData.value };
    if (formDataToSend.dateOfAssessment) {
      const parts = formDataToSend.dateOfAssessment.split("-");
      if (parts.length === 3) {
        formDataToSend.dateOfAssessment = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    const result = await FormService.saveCarePlanBaby(formDataToSend);
    if (result.success) {
      alert("Care Plan (Baby) saved successfully!");
      emit("form-saved", result.id);
    } else {
      alert("Error saving care plan: " + result.error);
    }
  } catch (error) {
    console.error("Error submitting care plan:", error);
    alert("Error saving care plan. Please try again.");
  }
};
</script>

<style scoped>
/* Styles imported from CarePlanSummaryForm.vue - same purple theme */
.care-plan-baby-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #fafafa;
  min-height: 100vh;
}
.form-header {
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
}
.form-header h2 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: 700;
}
.progress-indicator {
  margin-top: 1rem;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
  border-radius: 4px;
}
.progress-text {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}
.validation-message {
  background: linear-gradient(135deg, #ff5252 0%, #f44336 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 82, 82, 0.3);
}
.form-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}
.form-section h3 {
  color: #4a148c;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
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
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.95rem;
}
.required {
  color: #f44336;
  margin-left: 0.25rem;
}
.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #9c27b0;
  box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.1);
}
.form-group textarea {
  min-height: 100px;
  resize: vertical;
}
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}
.radio-label:hover {
  border-color: #9c27b0;
  background: #f3e5f5;
}
.radio-label input[type="radio"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #9c27b0;
}
.radio-group.horizontal-radio {
  flex-direction: row;
  gap: 1.5rem;
}
.subsection {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}
.subsection h4,
.subsection h5 {
  color: #9c27b0;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}
.info-text {
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
}
.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}
.nav-btn {
  padding: 1rem 2rem;
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
  .form-grid {
    grid-template-columns: 1fr;
  }
  .radio-group.horizontal-radio {
    flex-direction: column;
  }
  .form-navigation {
    flex-direction: column;
  }
  .next-btn,
  .submit-btn {
    margin-left: 0;
  }
}
</style>
