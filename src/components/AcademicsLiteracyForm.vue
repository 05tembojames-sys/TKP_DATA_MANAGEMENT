<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h3>Academics & Literacy Plan</h3>
      <p>
        Complete this comprehensive academic assessment and literacy planning
        form
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

    <div class="academics-form">
      <!-- Section 1: Child Information -->
      <div v-show="currentSection === 1" class="form-section">
        <h4>Child Information</h4>
        <div class="form-grid">
          <div
            class="form-group"
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
            />
            <div v-if="validationErrors.childId" class="error-message">
              {{ validationErrors.childId }}
            </div>
          </div>
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.dateOfIntake }"
          >
            <label>Date of Intake *</label>
            <input
              v-model="formData.dateOfIntake"
              type="date"
              required
              @input="clearFieldError('dateOfIntake')"
            />
            <div v-if="validationErrors.dateOfIntake" class="error-message">
              {{ validationErrors.dateOfIntake }}
            </div>
          </div>
          <div class="form-group">
            <label>Intake Age</label>
            <input
              v-model="formData.intakeAge"
              type="number"
              min="0"
              max="20"
            />
          </div>
          <div class="form-group">
            <label>Intake Grade</label>
            <input
              v-model="formData.intakeGrade"
              type="text"
              placeholder="e.g., Grade 7"
            />
          </div>
        </div>
        <div class="section-navigation">
          <button type="button" class="next-btn" @click="nextSection">
            Next Section ›
          </button>
        </div>
      </div>

      <!-- Section 2: Academic History -->
      <div v-show="currentSection === 2" class="form-section">
        <h4>Academic History</h4>

        <div class="form-group">
          <label
            >Did the girl attend any formal schooling prior to admission to TKP?
            *</label
          >
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.attendedSchoolPrior"
                value="YES"
              />
              <span>YES</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.attendedSchoolPrior"
                value="NO"
              />
              <span>NO</span>
            </label>
          </div>
        </div>

        <div
          v-if="formData.attendedSchoolPrior === 'YES'"
          class="schooling-history"
        >
          <h5>Schooling History</h5>
          <p class="helper-text">
            Upon admission to a school during her time at TKP, indicate that
            enrollment as well.
          </p>

          <div
            v-for="(school, index) in formData.schoolingHistory"
            :key="index"
            class="school-entry"
          >
            <h6>School {{ index + 1 }}</h6>
            <div class="form-grid">
              <div class="form-group">
                <label>School Attended</label>
                <input
                  v-model="school.schoolName"
                  type="text"
                  placeholder="School name"
                />
              </div>
              <div class="form-group">
                <label>Year(s)</label>
                <input
                  v-model="school.years"
                  type="text"
                  placeholder="e.g., 2018-2020"
                />
              </div>
              <div class="form-group">
                <label>Age(s)</label>
                <input
                  v-model="school.ages"
                  type="text"
                  placeholder="e.g., 10-12"
                />
              </div>
              <div class="form-group">
                <label>Grade(s)</label>
                <input
                  v-model="school.grades"
                  type="text"
                  placeholder="e.g., 5-7"
                />
              </div>
              <div class="form-group">
                <button
                  type="button"
                  class="remove-btn"
                  @click="removeSchool(index)"
                >
                  Remove School
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="add-btn" @click="addSchool">
            Add School
          </button>
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

      <!-- Section 3: National Exam Scores - Grade 7 -->
      <div v-show="currentSection === 3" class="form-section">
        <h4>National Exam Scores - Grade 7 Examination</h4>
        <p class="helper-text">
          If the girl has attended school and has taken national examinations,
          please indicate scores. If a girl sits for a national exam during her
          time at TKP, indicate those scores when she completes.
        </p>

        <div class="exam-table">
          <div class="table-header">
            <div class="col-subject">Subject</div>
            <div class="col-year">Year Attempted</div>
            <div class="col-score">Score</div>
            <div class="col-stat">STAT?</div>
            <div class="col-year">Year Attempted (Retake)</div>
            <div class="col-score">Score (Retake)</div>
            <div class="col-stat">STAT? (Retake)</div>
          </div>

          <div
            v-for="subject in grade7Subjects"
            :key="subject"
            class="table-row"
          >
            <div class="col-subject">{{ subject }}</div>
            <div class="col-year">
              <input
                v-model="formData.grade7Exam[subject].yearAttempted1"
                type="text"
                placeholder="Year"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.grade7Exam[subject].score1"
                type="number"
                min="0"
                max="100"
              />
            </div>
            <div class="col-stat">
              <input
                type="checkbox"
                v-model="formData.grade7Exam[subject].stat1"
              />
            </div>
            <div class="col-year">
              <input
                v-model="formData.grade7Exam[subject].yearAttempted2"
                type="text"
                placeholder="Year"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.grade7Exam[subject].score2"
                type="number"
                min="0"
                max="100"
              />
            </div>
            <div class="col-stat">
              <input
                type="checkbox"
                v-model="formData.grade7Exam[subject].stat2"
              />
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

      <!-- Section 4: National Exam Scores - Grade 9 -->
      <div v-show="currentSection === 4" class="form-section">
        <h4>National Exam Scores - Grade 9 Examination</h4>

        <div class="exam-table">
          <div class="table-header">
            <div class="col-subject">Subject</div>
            <div class="col-year">Year Attempted</div>
            <div class="col-score">Score</div>
            <div class="col-result">CERT/STAT/FAIL</div>
            <div class="col-year">Year Attempted (Retake)</div>
            <div class="col-score">Score (Retake)</div>
            <div class="col-result">CERT/STAT/FAIL (Retake)</div>
          </div>

          <div
            v-for="subject in grade9Subjects"
            :key="subject"
            class="table-row"
          >
            <div class="col-subject">{{ subject }}</div>
            <div class="col-year">
              <input
                v-model="formData.grade9Exam[subject].yearAttempted1"
                type="text"
                placeholder="Year"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.grade9Exam[subject].score1"
                type="number"
                min="0"
                max="100"
              />
            </div>
            <div class="col-result">
              <select v-model="formData.grade9Exam[subject].result1">
                <option value="">-</option>
                <option value="CERT">CERT</option>
                <option value="STAT">STAT</option>
                <option value="FAIL">FAIL</option>
              </select>
            </div>
            <div class="col-year">
              <input
                v-model="formData.grade9Exam[subject].yearAttempted2"
                type="text"
                placeholder="Year"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.grade9Exam[subject].score2"
                type="number"
                min="0"
                max="100"
              />
            </div>
            <div class="col-result">
              <select v-model="formData.grade9Exam[subject].result2">
                <option value="">-</option>
                <option value="CERT">CERT</option>
                <option value="STAT">STAT</option>
                <option value="FAIL">FAIL</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Secondary Pathway</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.secondaryPathway"
                value="Academic"
              />
              <span>Academic</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.secondaryPathway"
                value="Vocational"
              />
              <span>Vocational</span>
            </label>
          </div>
        </div>

        <div
          v-if="formData.secondaryPathway === 'Vocational'"
          class="form-group"
        >
          <label>Specify Vocational Track</label>
          <input
            v-model="formData.vocationalSpecify"
            type="text"
            placeholder="Specify vocational program"
          />
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

      <!-- Section 5: Special Learning Needs -->
      <div v-show="currentSection === 5" class="form-section">
        <h4>Special Learning Needs</h4>
        <p class="helper-text">
          Does the girl have any preexisting disabilities or other special
          learning needs? Check all that apply:
        </p>

        <div class="checkbox-grid">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.specialLearningNeeds.addAdhd"
            />
            <span>ADD/ADHD</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.specialLearningNeeds.autism"
            />
            <span>Autism</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.specialLearningNeeds.dyslexia"
            />
            <span>Dyslexia</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.specialLearningNeeds.hearingImpairment"
            />
            <span>Hearing Impairment</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.specialLearningNeeds.intellectualImpairment"
            />
            <span>Intellectual Impairment</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.specialLearningNeeds.physicalImpairment"
            />
            <span>Physical Impairment</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.specialLearningNeeds.visualImpairment"
            />
            <span>Visual Impairment</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.specialLearningNeeds.other"
            />
            <span>Other</span>
          </label>
        </div>

        <div v-if="formData.specialLearningNeeds.other" class="form-group">
          <label>Describe Other Special Learning Needs</label>
          <textarea
            v-model="formData.specialLearningNeeds.otherDescription"
            rows="3"
            placeholder="Please describe..."
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

      <!-- Section 6: Abeka Learning Assessments -->
      <div v-show="currentSection === 6" class="form-section">
        <h4>Abeka Learning Assessments</h4>
        <p class="helper-text">
          Record the scores of each Abeka literacy assessment here, and file
          assessments in the child's appropriate file.
        </p>

        <div class="assessment-table">
          <div class="table-header">
            <div class="col-assessment">Literacy Assessment</div>
            <div class="col-score">Score at Admission</div>
            <div class="col-score">Score at Week 10</div>
            <div class="col-score">Score Upon Exit</div>
          </div>

          <div class="table-row">
            <div class="col-assessment">Letter Names (lowercase letters)</div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterNamesLower.admission"
                type="text"
                placeholder="_____/26"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterNamesLower.week10"
                type="text"
                placeholder="_____/26"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterNamesLower.exit"
                type="text"
                placeholder="_____/26"
              />
            </div>
          </div>

          <div class="table-row">
            <div class="col-assessment">Letter Names (uppercase letters)</div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterNamesUpper.admission"
                type="text"
                placeholder="_____/26"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterNamesUpper.week10"
                type="text"
                placeholder="_____/26"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterNamesUpper.exit"
                type="text"
                placeholder="_____/26"
              />
            </div>
          </div>

          <div class="table-row">
            <div class="col-assessment">Letter Sounds</div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterSounds.admission"
                type="text"
                placeholder="_____/26"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterSounds.week10"
                type="text"
                placeholder="_____/26"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.letterSounds.exit"
                type="text"
                placeholder="_____/26"
              />
            </div>
          </div>

          <div class="table-row">
            <div class="col-assessment">Date of Assessment</div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.dateAdmission"
                type="date"
              />
            </div>
            <div class="col-score">
              <input
                v-model="formData.abekaAssessments.dateWeek10"
                type="date"
              />
            </div>
            <div class="col-score">
              <input v-model="formData.abekaAssessments.dateExit" type="date" />
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

      <!-- Section 7: English Language Skills -->
      <div v-show="currentSection === 7" class="form-section">
        <h4>English Language Skills</h4>
        <p class="helper-text">
          Please rate the girl's level of English competency at the following
          time benchmarks (1-10 scale):
        </p>

        <div class="english-competency-section">
          <h5>At Admission</h5>
          <div class="form-group">
            <label>Date of Assessment</label>
            <input
              v-model="formData.englishSkills.admission.date"
              type="date"
            />
          </div>
          <div class="competency-ratings">
            <div class="rating-row">
              <label>Listening Comprehension</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.admission.listeningComprehension
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.admission.listeningComprehension
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Reading Comprehension</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.admission.readingComprehension
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.admission.readingComprehension
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Speaking Ability</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="formData.englishSkills.admission.speakingAbility"
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.admission.speakingAbility
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Writing Ability</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="formData.englishSkills.admission.writingAbility"
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.admission.writingAbility
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="english-competency-section">
          <h5>6 Months After Admission</h5>
          <div class="form-group">
            <label>Date of Assessment</label>
            <input
              v-model="formData.englishSkills.sixMonths.date"
              type="date"
            />
          </div>
          <div class="competency-ratings">
            <div class="rating-row">
              <label>Listening Comprehension</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.sixMonths.listeningComprehension
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.sixMonths.listeningComprehension
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Reading Comprehension</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.sixMonths.readingComprehension
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.sixMonths.readingComprehension
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Speaking Ability</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="formData.englishSkills.sixMonths.speakingAbility"
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.sixMonths.speakingAbility
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Writing Ability</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="formData.englishSkills.sixMonths.writingAbility"
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.sixMonths.writingAbility
                }}</span>
              </div>
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

      <!-- Section 8: English Language Skills (Continued) -->
      <div v-show="currentSection === 8" class="form-section">
        <h4>English Language Skills (Continued)</h4>

        <div class="english-competency-section">
          <h5>12 Months After Admission</h5>
          <div class="form-group">
            <label>Date of Assessment</label>
            <input
              v-model="formData.englishSkills.twelveMonths.date"
              type="date"
            />
          </div>
          <div class="competency-ratings">
            <div class="rating-row">
              <label>Listening Comprehension</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.twelveMonths.listeningComprehension
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.twelveMonths.listeningComprehension
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Reading Comprehension</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.twelveMonths.readingComprehension
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.twelveMonths.readingComprehension
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Speaking Ability</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="formData.englishSkills.twelveMonths.speakingAbility"
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.twelveMonths.speakingAbility
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Writing Ability</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="formData.englishSkills.twelveMonths.writingAbility"
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.twelveMonths.writingAbility
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="english-competency-section">
          <h5>18 Months After Admission</h5>
          <div class="form-group">
            <label>Date of Assessment</label>
            <input
              v-model="formData.englishSkills.eighteenMonths.date"
              type="date"
            />
          </div>
          <div class="competency-ratings">
            <div class="rating-row">
              <label>Listening Comprehension</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.eighteenMonths.listeningComprehension
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.eighteenMonths.listeningComprehension
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Reading Comprehension</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.eighteenMonths.readingComprehension
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.eighteenMonths.readingComprehension
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Speaking Ability</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="
                    formData.englishSkills.eighteenMonths.speakingAbility
                  "
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.eighteenMonths.speakingAbility
                }}</span>
              </div>
            </div>
            <div class="rating-row">
              <label>Writing Ability</label>
              <div class="rating-scale">
                <input
                  type="range"
                  v-model="formData.englishSkills.eighteenMonths.writingAbility"
                  min="1"
                  max="10"
                />
                <span class="rating-value">{{
                  formData.englishSkills.eighteenMonths.writingAbility
                }}</span>
              </div>
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

      <!-- Section 9: Academic/Literacy Program Track & Documentation -->
      <div v-show="currentSection === 9" class="form-section">
        <h4>Academic/Literacy Program Track</h4>
        <p class="helper-text">
          Based on the above sections, please make your recommendation for the
          girl's TKP Academic/Literacy Program Track:
        </p>

        <div class="form-group">
          <label>Recommended Track *</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.programTrack.recommendation"
                value="Continue Academic Education"
              />
              <span>Continue Academic Education</span>
            </label>
            <label class="radio-label">
              <input
                type="radio"
                v-model="formData.programTrack.recommendation"
                value="Abeka + Vocational Trade"
              />
              <span>Abeka + Vocational Trade</span>
            </label>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Describe why you made this recommendation</label>
          <textarea
            v-model="formData.programTrack.recommendationReason"
            rows="4"
            placeholder="Explain the rationale for this recommendation..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label>Describe how this track will be implemented</label>

          <div class="implementation-group">
            <label>During Year 1:</label>
            <textarea
              v-model="formData.programTrack.implementationYear1"
              rows="3"
              placeholder="Describe implementation plan for year 1..."
            ></textarea>
          </div>

          <div class="implementation-group">
            <label>During Year 2:</label>
            <textarea
              v-model="formData.programTrack.implementationYear2"
              rows="3"
              placeholder="Describe implementation plan for year 2..."
            ></textarea>
          </div>

          <div class="implementation-group">
            <label>Upon Reintegration:</label>
            <textarea
              v-model="formData.programTrack.implementationReintegration"
              rows="3"
              placeholder="Describe implementation plan upon reintegration..."
            ></textarea>
          </div>
        </div>

        <h4>Documentation To Be Included</h4>
        <p class="helper-text">
          To support this document, please ensure that the following documents
          are present and included in the girl's file, as available. Tick if
          document is present, in file; write "N/A" if document is not available
          or lost; leave blank if document has not yet been earned/achieved.
        </p>

        <div class="documentation-checklist">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.documentation.grade7ExamScores"
            />
            <span>Copy of Grade 7 exam scores</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.documentation.grade9ExamScores"
            />
            <span>Copy of Grade 9 exam scores</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.documentation.abekaLetterSounds"
            />
            <span>Abeka Literacy assessments – Letter Sounds</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.documentation.abekaLetterName"
            />
            <span>Abeka Literacy assessments – Letter Name</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.documentation.otherAbeka"
            />
            <span>Other Abeka Literacy documents</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.documentation.termlyReports"
            />
            <span
              >Termly school report forms (if enrolled in school by TKP)</span
            >
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.documentation.proofOfEnrollment"
            />
            <span
              >Proof of enrollment in current school (if enrolled by TKP)</span
            >
          </label>
        </div>

        <div class="form-grid">
          <div
            class="form-group"
            :class="{ 'has-error': validationErrors.assessmentCompletedBy }"
          >
            <label>Assessment completed by *</label>
            <input
              v-model="formData.assessmentCompletedBy"
              type="text"
              required
              @input="clearFieldError('assessmentCompletedBy')"
            />
            <div
              v-if="validationErrors.assessmentCompletedBy"
              class="error-message"
            >
              {{ validationErrors.assessmentCompletedBy }}
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
        </div>

        <div class="section-navigation">
          <button type="button" class="prev-btn" @click="prevSection">
            ‹ Previous Section
          </button>
          <button type="button" class="submit-btn" @click="submitForm">
            Submit Form
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

// Grade 7 subjects
const grade7Subjects = [
  "English",
  "Integrated Science",
  "Local Language",
  "Mathematics",
  "Social Studies",
  "Special Paper 1",
  "Special Paper 2",
  "Technology Studies",
];

// Grade 9 subjects
const grade9Subjects = [
  "Agriculture Science",
  "Business Studies",
  "Computer Studies",
  "Design and Technology",
  "English Language",
  "Home Economics",
  "Integrated Science",
  "Local Language",
  "Mathematics",
  "Religious Education",
  "Social Studies",
];

// Initialize Grade 7 exam data
const initGrade7Exam = () => {
  const exam = {};
  grade7Subjects.forEach((subject) => {
    exam[subject] = {
      yearAttempted1: "",
      score1: null,
      stat1: false,
      yearAttempted2: "",
      score2: null,
      stat2: false,
    };
  });
  return exam;
};

// Initialize Grade 9 exam data
const initGrade9Exam = () => {
  const exam = {};
  grade9Subjects.forEach((subject) => {
    exam[subject] = {
      yearAttempted1: "",
      score1: null,
      result1: "",
      yearAttempted2: "",
      score2: null,
      result2: "",
    };
  });
  return exam;
};

const formData = ref({
  // Section 1: Child Information
  nameOfGirl: "",
  childId: "",
  dateOfIntake: "",
  intakeAge: null,
  intakeGrade: "",

  // Section 2: Academic History
  attendedSchoolPrior: "",
  schoolingHistory: [],

  // Section 3 & 4: National Exam Scores
  grade7Exam: initGrade7Exam(),
  grade9Exam: initGrade9Exam(),
  secondaryPathway: "",
  vocationalSpecify: "",

  // Section 5: Special Learning Needs
  specialLearningNeeds: {
    addAdhd: false,
    autism: false,
    dyslexia: false,
    hearingImpairment: false,
    intellectualImpairment: false,
    physicalImpairment: false,
    visualImpairment: false,
    other: false,
    otherDescription: "",
  },

  // Section 6: Abeka Assessments
  abekaAssessments: {
    letterNamesLower: { admission: "", week10: "", exit: "" },
    letterNamesUpper: { admission: "", week10: "", exit: "" },
    letterSounds: { admission: "", week10: "", exit: "" },
    dateAdmission: "",
    dateWeek10: "",
    dateExit: "",
  },

  // Section 7 & 8: English Language Skills
  englishSkills: {
    admission: {
      date: "",
      listeningComprehension: 5,
      readingComprehension: 5,
      speakingAbility: 5,
      writingAbility: 5,
    },
    sixMonths: {
      date: "",
      listeningComprehension: 5,
      readingComprehension: 5,
      speakingAbility: 5,
      writingAbility: 5,
    },
    twelveMonths: {
      date: "",
      listeningComprehension: 5,
      readingComprehension: 5,
      speakingAbility: 5,
      writingAbility: 5,
    },
    eighteenMonths: {
      date: "",
      listeningComprehension: 5,
      readingComprehension: 5,
      speakingAbility: 5,
      writingAbility: 5,
    },
  },

  // Section 9: Program Track & Documentation
  programTrack: {
    recommendation: "",
    recommendationReason: "",
    implementationYear1: "",
    implementationYear2: "",
    implementationReintegration: "",
  },

  documentation: {
    grade7ExamScores: false,
    grade9ExamScores: false,
    abekaLetterSounds: false,
    abekaLetterName: false,
    otherAbeka: false,
    termlyReports: false,
    proofOfEnrollment: false,
  },

  assessmentCompletedBy: "",
  dateOfAssessment: "",
});

const currentSectionName = computed(() => {
  const names = {
    1: "Child Information",
    2: "Academic History",
    3: "Grade 7 Exam Scores",
    4: "Grade 9 Exam Scores",
    5: "Special Learning Needs",
    6: "Abeka Assessments",
    7: "English Language Skills (Part 1)",
    8: "English Language Skills (Part 2)",
    9: "Program Track & Documentation",
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
  const requiredFields = ["nameOfGirl", "childId", "dateOfIntake"];
  requiredFields.forEach((field) => {
    total++;
    if (formData.value[field]) completed++;
  });

  return total > 0 ? Math.round((completed / total) * 100) : 0;
});

const addSchool = () => {
  formData.value.schoolingHistory.push({
    schoolName: "",
    years: "",
    ages: "",
    grades: "",
  });
};

const removeSchool = (index) => {
  formData.value.schoolingHistory.splice(index, 1);
};

const validateSection = (section) => {
  validationErrors.value = {};

  if (section === 1) {
    if (!formData.value.nameOfGirl) {
      validationErrors.value.nameOfGirl = "Name of Girl is required";
    }
    if (!formData.value.childId) {
      validationErrors.value.childId = "Child ID is required";
    }
    if (!formData.value.dateOfIntake) {
      validationErrors.value.dateOfIntake = "Date of Intake is required";
    }
  }

  if (section === 9) {
    if (!formData.value.assessmentCompletedBy) {
      validationErrors.value.assessmentCompletedBy =
        "Assessment completed by is required";
    }
    if (!formData.value.dateOfAssessment) {
      validationErrors.value.dateOfAssessment =
        "Date of Assessment is required";
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
    const result = await FormService.saveAcademicsLiteracyPlan(formData.value);

    if (result.success) {
      alert("Academics & Literacy Plan saved successfully!");
      emit("form-saved", result.id);
    } else {
      alert("Error saving form: " + result.error);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error saving form. Please try again.");
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

.academics-form {
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

.form-section h5 {
  color: #764ba2;
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem 0;
}

.form-section h6 {
  color: #333;
  font-size: 1rem;
  margin: 1rem 0 0.75rem 0;
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

.radio-group,
.checkbox-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

.school-entry,
.sibling-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.exam-table,
.assessment-table {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr repeat(6, 1fr);
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
  grid-template-columns: 2fr repeat(6, 1fr);
  border-bottom: 1px solid #e0e0e0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row > div {
  padding: 0.75rem;
  border-right: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.col-subject {
  font-weight: 500;
  color: #333;
}

.col-year input,
.col-score input,
.col-result select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.col-stat {
  justify-content: center;
}

.col-stat input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.assessment-table .table-header {
  grid-template-columns: 2fr 1fr 1fr 1fr;
}

.assessment-table .table-row {
  grid-template-columns: 2fr 1fr 1fr 1fr;
}

.col-assessment {
  font-weight: 500;
  color: #333;
}

.english-competency-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.competency-ratings {
  margin-top: 1rem;
}

.rating-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
}

.rating-row label {
  flex: 0 0 200px;
  margin: 0;
  font-weight: 500;
}

.rating-scale {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-scale input[type="range"] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  outline: none;
}

.rating-scale input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.rating-scale input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
}

.rating-value {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1rem;
  min-width: 30px;
  text-align: center;
}

.implementation-group {
  margin-bottom: 1rem;
}

.implementation-group label {
  display: block;
  font-weight: 600;
  color: #764ba2;
  margin-bottom: 0.5rem;
}

.documentation-checklist {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.add-btn,
.remove-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn {
  background: #28a745;
  color: white;
  margin-top: 1rem;
}

.add-btn:hover {
  background: #218838;
}

.remove-btn {
  background: #dc3545;
  color: white;
}

.remove-btn:hover {
  background: #c82333;
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

  .rating-row {
    flex-direction: column;
    align-items: stretch;
  }

  .rating-row label {
    flex: none;
    margin-bottom: 0.5rem;
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
