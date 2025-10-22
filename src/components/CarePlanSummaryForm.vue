<!-- Section 2-7 content - continuing in next part due to size -->
<template>
  <div class="care-plan-summary-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2>Care Plan - Individual Summary (Girl)</h2>
      <div class="progress-indicator">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: (currentSection / 7) * 100 + '%' }"
          ></div>
        </div>
        <p class="progress-text">Section {{ currentSection }} of 7</p>
      </div>
    </div>

    <!-- Validation Message -->
    <div v-if="showValidationMessage" class="validation-message">
      ⚠️ Please fill in all required fields before proceeding.
    </div>

    <!-- Section 1: Child Information -->
    <div v-show="currentSection === 1" class="form-section">
      <h3>Section 1: Child Information</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Name of Girl: <span class="required">*</span></label>
          <input
            v-model="formData.nameOfGirl"
            type="text"
            placeholder="Enter girl's name"
            required
          />
        </div>
        <div class="form-group">
          <label>Name of Baby:</label>
          <input
            v-model="formData.nameOfBaby"
            type="text"
            placeholder="Enter baby's name"
          />
        </div>
        <div class="form-group">
          <label>Girl's Current Age: <span class="required">*</span></label>
          <input
            v-model.number="formData.girlCurrentAge"
            type="number"
            min="0"
            placeholder="e.g., 15"
            required
          />
        </div>
        <div class="form-group">
          <label>Current Grade: <span class="required">*</span></label>
          <input
            v-model="formData.currentGrade"
            type="text"
            placeholder="e.g., Grade 9"
            required
          />
        </div>
        <div class="form-group">
          <label>Date of Assessment: <span class="required">*</span></label>
          <input v-model="formData.dateOfAssessment" type="date" required />
        </div>
        <div class="form-group">
          <label>Time in TKP (Years):</label>
          <input
            v-model.number="formData.yearsInTKP"
            type="number"
            min="0"
            placeholder="0"
          />
        </div>
        <div class="form-group">
          <label>Time in TKP (Months):</label>
          <input
            v-model.number="formData.monthsInTKP"
            type="number"
            min="0"
            max="11"
            placeholder="0"
          />
        </div>
        <div class="form-group">
          <label>Type of Assessment: <span class="required">*</span></label>
          <select v-model="formData.assessmentType" required>
            <option value="">Select type</option>
            <option value="INITIAL">Initial Assessment</option>
            <option value="6-MONTH">6-Month Reassessment</option>
            <option value="12-MONTH">12-Month Reassessment</option>
            <option value="18-MONTH">18-Month Reassessment</option>
            <option value="FINAL">Final Assessment</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Section 2: Determinants - Age & Family -->
    <div v-show="currentSection === 2" class="form-section">
      <h3>Section 2: Determinants - Age & Family</h3>

      <div class="subsection">
        <h4>AGE</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>How old will the girl be two years after admission?</label>
            <input
              v-model.number="formData.girlAgeTwoYears"
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
        <h4>FAMILY</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>TKP-recommended guardian (Name):</label>
            <input
              v-model="formData.recommendedGuardianName"
              type="text"
              placeholder="Enter guardian's name"
            />
          </div>
          <div class="form-group">
            <label>Relation to Girl:</label>
            <input
              v-model="formData.recommendedGuardianRelation"
              type="text"
              placeholder="e.g., Grandmother, Aunt"
            />
          </div>
          <div class="form-group full-width">
            <label>Describe rationale:</label>
            <textarea
              v-model="formData.guardianRationale"
              rows="3"
              placeholder="Explain why this guardian is recommended..."
            ></textarea>
          </div>
          <div class="form-group full-width">
            <label
              >Recommended primary caregiver for the baby upon
              reintegration:</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.primaryCaregiver"
                  type="radio"
                  value="GIRL (MOTHER)"
                />
                <span>GIRL (MOTHER)</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.primaryCaregiver"
                  type="radio"
                  value="OTHER"
                />
                <span>OTHER</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.primaryCaregiver"
                  type="radio"
                  value="UNKNOWN"
                />
                <span>UNKNOWN</span>
              </label>
            </div>
          </div>

          <div
            v-if="
              formData.primaryCaregiver === 'OTHER' ||
              formData.primaryCaregiver === 'UNKNOWN'
            "
            class="form-group full-width"
          >
            <label>Describe:</label>
            <textarea
              v-model="formData.primaryCaregiverDescription"
              rows="3"
              placeholder="Explain who will be the primary caregiver..."
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
              >Does the family have enough income to support the girl and the
              baby?</label
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

    <!-- Section 3: Home Environment/Safety Concerns -->
    <div v-show="currentSection === 3" class="form-section">
      <h3>Section 3: Home Environment/Safety Concerns</h3>

      <div class="subsection">
        <h4>PHYSICAL STATE OF THE HOME</h4>
        <div class="form-grid">
          <div class="form-group full-width">
            <label
              >Is the family considering relocating before reintegration?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.familyRelocating"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.familyRelocating"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div v-if="formData.familyRelocating" class="form-group full-width">
            <label>If yes, to where?</label>
            <input
              v-model="formData.relocationDestination"
              type="text"
              placeholder="Enter relocation destination"
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
              >What are potential physical safety concerns for the girl in this
              home environment, if any?</label
            >
            <textarea
              v-model="formData.girlPhysicalSafetyConcerns"
              rows="3"
              placeholder="Describe any physical safety concerns for the girl..."
            ></textarea>
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
          <div class="form-group">
            <label
              >Is/does the perpetrator living in the home/surrounding
              area?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.perpetratorInArea"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.perpetratorInArea"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>Is/does the perpetrator in jail or on bail?</label>
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.perpetratorStatus"
                  type="radio"
                  value="IN JAIL"
                />
                <span>IN JAIL</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.perpetratorStatus"
                  type="radio"
                  value="ON BAIL"
                />
                <span>ON BAIL</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.perpetratorStatus"
                  type="radio"
                  value="N/A"
                />
                <span>N/A</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label
              >Is/does the perpetrator a live threat to the girl's
              reintegration?</label
            >
            <div class="radio-group horizontal-radio">
              <label class="radio-label">
                <input
                  v-model="formData.perpetratorThreat"
                  type="radio"
                  :value="true"
                />
                <span>YES</span>
              </label>
              <label class="radio-label">
                <input
                  v-model="formData.perpetratorThreat"
                  type="radio"
                  :value="false"
                />
                <span>NO</span>
              </label>
            </div>
          </div>
          <div v-if="formData.perpetratorThreat" class="form-group full-width">
            <label>If yes, describe:</label>
            <textarea
              v-model="formData.perpetratorThreatDescription"
              rows="3"
              placeholder="Describe the threat..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4 through 7 continue below -->

    <!-- Section 4: Academic or Trade Skill Pathway -->
    <div v-show="currentSection === 4" class="form-section">
      <h3>Section 4: Academic or Trade Skill Pathway</h3>

      <div class="form-grid">
        <div class="form-group full-width">
          <label
            >Based on the girl's academic history, is it recommended that she
            pursue academics or a trade skill post-TKP residential care?</label
          >
          <div class="radio-group horizontal-radio">
            <label class="radio-label">
              <input
                v-model="formData.pathway"
                type="radio"
                value="ACADEMICS"
              />
              <span>ACADEMICS</span>
            </label>
            <label class="radio-label">
              <input v-model="formData.pathway" type="radio" value="TRADES" />
              <span>TRADES</span>
            </label>
          </div>
        </div>

        <div
          v-if="formData.pathway === 'ACADEMICS'"
          class="subsection full-width"
        >
          <h4>IF ACADEMICS</h4>
          <div class="form-grid">
            <div class="form-group">
              <label
                >How many more years until the girl completes grade 12?</label
              >
              <input
                v-model.number="formData.yearsToGrade12"
                type="number"
                min="0"
                placeholder="e.g., 3"
              />
            </div>
            <div class="form-group">
              <label
                >What grade should the girl be in at the end of her 2-year TKP
                program?</label
              >
              <input
                v-model="formData.gradeAfterTKP"
                type="text"
                placeholder="e.g., Grade 11"
              />
            </div>
            <div class="form-group full-width">
              <label
                >Will the girl's family support her ability to complete her
                education?</label
              >
              <div class="radio-group horizontal-radio">
                <label class="radio-label">
                  <input
                    v-model="formData.familySupportEducation"
                    type="radio"
                    :value="true"
                  />
                  <span>YES</span>
                </label>
                <label class="radio-label">
                  <input
                    v-model="formData.familySupportEducation"
                    type="radio"
                    :value="false"
                  />
                  <span>NO</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-if="formData.pathway === 'TRADES'" class="subsection full-width">
          <h4>IF TRADES</h4>
          <div class="form-grid">
            <div class="form-group full-width">
              <label
                >Which trade skill will the girl pursue after the 2-year TKP
                program?</label
              >
              <input
                v-model="formData.tradeSkill"
                type="text"
                placeholder="e.g., Tailoring, Hairdressing"
              />
            </div>
            <div class="form-group full-width">
              <label
                >What hindrances will there be (if any) to the girl being
                financially successful in this trade upon reintegration?</label
              >
              <textarea
                v-model="formData.tradeHindrances"
                rows="3"
                placeholder="Describe any potential hindrances..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5: Action Plan for Success -->
    <div v-show="currentSection === 5" class="form-section">
      <h3>Section 5: Action Plan for Success</h3>

      <div class="subsection">
        <h4>FAMILY SUPPORT</h4>
        <div class="form-group full-width">
          <label
            >Describe measures that need to be taken to increase family
            capacity, foster family willingness, or otherwise prepare the family
            to receive the girl upon reintegration:</label
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
    </div>

    <!-- Section 6: Program Goals and Emphasis -->
    <div v-show="currentSection === 6" class="form-section">
      <h3>Section 6: Program Goals and Emphasis</h3>

      <div class="info-box">
        <p>
          <strong>Instructions:</strong> Next to each program, write a brief,
          general goal for the girl during her time at TKP, aimed at maximizing
          growth in each area. Goals should be revised and reviewed at each Care
          Plan Summary benchmark.
        </p>
        <p>
          <strong>Note:</strong> If the program is of critical importance
          (directly impacts her reintegration readiness), mark it as critical.
        </p>
      </div>

      <div class="program-goals">
        <div class="goal-item">
          <div class="goal-header">
            <h4>ACADEMICS/LITERACY:</h4>
            <label class="checkbox-label">
              <input
                v-model="formData.programGoals.academicsLiteracy.isCritical"
                type="checkbox"
              />
              <span>⭐ Critical</span>
            </label>
          </div>
          <textarea
            v-model="formData.programGoals.academicsLiteracy.goal"
            rows="3"
            placeholder="Enter goal for academics/literacy program..."
          ></textarea>
        </div>

        <div class="goal-item">
          <div class="goal-header">
            <h4>COUNSELING:</h4>
            <label class="checkbox-label">
              <input
                v-model="formData.programGoals.counseling.isCritical"
                type="checkbox"
              />
              <span>⭐ Critical</span>
            </label>
          </div>
          <textarea
            v-model="formData.programGoals.counseling.goal"
            rows="3"
            placeholder="Enter goal for counseling program..."
          ></textarea>
        </div>

        <div class="goal-item">
          <div class="goal-header">
            <h4>FAMILY EMPOWERMENT:</h4>
            <label class="checkbox-label">
              <input
                v-model="formData.programGoals.familyEmpowerment.isCritical"
                type="checkbox"
              />
              <span>⭐ Critical</span>
            </label>
          </div>
          <textarea
            v-model="formData.programGoals.familyEmpowerment.goal"
            rows="3"
            placeholder="Enter goal for family empowerment program..."
          ></textarea>
        </div>

        <div class="goal-item">
          <div class="goal-header">
            <h4>HOUSEHOLD/PARENTING SKILLS:</h4>
            <label class="checkbox-label">
              <input
                v-model="formData.programGoals.householdParenting.isCritical"
                type="checkbox"
              />
              <span>⭐ Critical</span>
            </label>
          </div>
          <textarea
            v-model="formData.programGoals.householdParenting.goal"
            rows="3"
            placeholder="Enter goal for household/parenting skills program..."
          ></textarea>
        </div>

        <div class="goal-item">
          <div class="goal-header">
            <h4>MEDICAL:</h4>
            <label class="checkbox-label">
              <input
                v-model="formData.programGoals.medical.isCritical"
                type="checkbox"
              />
              <span>⭐ Critical</span>
            </label>
          </div>
          <textarea
            v-model="formData.programGoals.medical.goal"
            rows="3"
            placeholder="Enter goal for medical program..."
          ></textarea>
        </div>

        <div class="goal-item">
          <div class="goal-header">
            <h4>VOCATIONAL TRADE SKILLS:</h4>
            <label class="checkbox-label">
              <input
                v-model="formData.programGoals.vocationalTrade.isCritical"
                type="checkbox"
              />
              <span>⭐ Critical</span>
            </label>
          </div>
          <textarea
            v-model="formData.programGoals.vocationalTrade.goal"
            rows="3"
            placeholder="Enter goal for vocational trade skills program..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Section 7: Reassessment & Acknowledgment -->
    <div v-show="currentSection === 7" class="form-section">
      <h3>Section 7: Reassessment & Acknowledgment</h3>

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
            <label>Girl's Counsellor Name:</label>
            <input
              v-model="formData.counsellorName"
              type="text"
              placeholder="Enter counsellor's name"
            />
          </div>
          <div class="form-group">
            <label>Counsellor Signature:</label>
            <input
              v-model="formData.counsellorSignature"
              type="text"
              placeholder="Type name to sign"
            />
          </div>
          <div class="form-group">
            <label>Girl Name:</label>
            <input
              v-model="formData.girlName"
              type="text"
              placeholder="Enter girl's name"
            />
          </div>
          <div class="form-group">
            <label>Girl's Signature:</label>
            <input
              v-model="formData.girlSignature"
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
        v-if="currentSection < 7"
        @click="nextSection"
        class="nav-btn next-btn"
        type="button"
      >
        Next →
      </button>
      <button
        v-if="currentSection === 7"
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
import { ref } from "vue";
import FormService from "../services/formService.js";

const emit = defineEmits(["form-saved"]);

const currentSection = ref(1);
const showValidationMessage = ref(false);

const formData = ref({
  // Child Information
  nameOfGirl: "",
  nameOfBaby: "",
  girlCurrentAge: null,
  currentGrade: "",
  dateOfAssessment: "",
  yearsInTKP: 0,
  monthsInTKP: 0,
  assessmentType: "",

  // Determinants - Age
  girlAgeTwoYears: null,
  babyAgeTwoYears: null,

  // Family
  recommendedGuardianName: "",
  recommendedGuardianRelation: "",
  guardianRationale: "",
  primaryCaregiver: "",
  primaryCaregiverDescription: "",

  // Family Capacity
  familyCapacity: null,
  familyCapacityDescription: "",

  // Family Financial Status
  familyFinancialSupport: null,
  familyReliantOnTKPTrade: null,

  // Family Willingness
  familyWillingToCare: null,
  familySupportFuture: null,
  familyWillingnessDescription: "",

  // Home Environment - Physical
  familyRelocating: null,
  relocationDestination: "",
  currentLocation: "",
  girlPhysicalSafetyConcerns: "",
  babyPhysicalSafetyConcerns: "",
  homePhysicallySafe: null,

  // Home Environment - Social
  peopleSafetyConcern: null,
  peopleSafetyConcernDescription: "",
  perpetratorInArea: null,
  perpetratorStatus: "",
  perpetratorThreat: null,
  perpetratorThreatDescription: "",

  // Pathway
  pathway: "",
  yearsToGrade12: null,
  gradeAfterTKP: "",
  familySupportEducation: null,
  tradeSkill: "",
  tradeHindrances: "",

  // Action Plan
  familySupportMeasures: "",
  homePhysicalMeasures: "",
  homeSocialMeasures: "",
  needsFamilyTracing: null,
  familyTracingDescription: "",

  // Program Goals
  programGoals: {
    academicsLiteracy: { goal: "", isCritical: false },
    counseling: { goal: "", isCritical: false },
    familyEmpowerment: { goal: "", isCritical: false },
    householdParenting: { goal: "", isCritical: false },
    medical: { goal: "", isCritical: false },
    vocationalTrade: { goal: "", isCritical: false },
  },

  // Reassessment
  reassessmentMonth: "",
  reassessmentYear: null,

  // Acknowledgment
  socialWorkerName: "",
  socialWorkerSignature: "",
  supervisorName: "",
  supervisorSignature: "",
  counsellorName: "",
  counsellorSignature: "",
  girlName: "",
  girlSignature: "",
});

const validateSection = (section) => {
  if (section === 1) {
    return !!(
      formData.value.nameOfGirl &&
      formData.value.girlCurrentAge &&
      formData.value.currentGrade &&
      formData.value.dateOfAssessment &&
      formData.value.assessmentType
    );
  }
  // Other sections optional - can proceed
  return true;
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
  try {
    const result = await FormService.saveCarePlanSummary(formData.value);
    if (result.success) {
      alert("Care Plan Summary saved successfully!");
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
.care-plan-summary-form {
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

.subsection h4 {
  color: #9c27b0;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.subsection.full-width {
  grid-column: 1 / -1;
}

.info-box {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-left: 4px solid #9c27b0;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.info-box p {
  margin: 0.5rem 0;
  color: #4a148c;
  line-height: 1.6;
}

.program-goals {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.goal-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.goal-item:hover {
  border-color: #9c27b0;
  box-shadow: 0 2px 8px rgba(156, 39, 176, 0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.goal-header h4 {
  color: #9c27b0;
  margin: 0;
  font-size: 1.1rem;
}

.checkbox-label {
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

.checkbox-label:hover {
  border-color: #9c27b0;
  background: #f3e5f5;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  width: 20px;
  height: 20px;
  accent-color: #9c27b0;
}

.checkbox-label span {
  font-weight: 600;
  color: #666;
}

.goal-item textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
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
