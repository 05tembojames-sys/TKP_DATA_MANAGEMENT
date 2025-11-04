<template>
  <div class="form-data-display">
    <div class="display-header">
      <h2>{{ getFormTypeTitle(form.formType) }}</h2>
      <div class="header-info">
        <span class="created-date">
          Created: {{ formatDate(form.createdAt) }}
        </span>
        <span :class="['status-badge', form.status]">
          {{ form.status || 'Draft' }}
        </span>
      </div>
    </div>

    <div class="display-content">
      <!-- Child Information Section -->
      <div v-if="hasChildInfo" class="data-section">
        <h3>Child Information</h3>
        <div class="data-grid">
          <div v-if="form.childFirstName" class="data-item">
            <span class="label">First Name:</span>
            <span class="value">{{ form.childFirstName }}</span>
          </div>
          <div v-if="form.childMiddleName" class="data-item">
            <span class="label">Middle Name:</span>
            <span class="value">{{ form.childMiddleName }}</span>
          </div>
          <div v-if="form.childSurname" class="data-item">
            <span class="label">Surname:</span>
            <span class="value">{{ form.childSurname }}</span>
          </div>
          <div v-if="form.otherFirstName" class="data-item">
            <span class="label">Other First Name:</span>
            <span class="value">{{ form.otherFirstName }}</span>
          </div>
          <div v-if="form.otherMiddleName" class="data-item">
            <span class="label">Other Middle Name:</span>
            <span class="value">{{ form.otherMiddleName }}</span>
          </div>
          <div v-if="form.otherSurname" class="data-item">
            <span class="label">Other Surname:</span>
            <span class="value">{{ form.otherSurname }}</span>
          </div>
          <div v-if="form.dateOfBirth" class="data-item">
            <span class="label">Date of Birth:</span>
            <span class="value">{{ formatDate(form.dateOfBirth) }}</span>
          </div>
          <div v-if="form.age" class="data-item">
            <span class="label">Age:</span>
            <span class="value">{{ form.age }} years</span>
          </div>
          <div v-if="form.gender" class="data-item">
            <span class="label">Gender:</span>
            <span class="value">{{ form.gender }}</span>
          </div>
          <div v-if="form.residentArea" class="data-item">
            <span class="label">Resident Area:</span>
            <span class="value">{{ form.residentArea }}</span>
          </div>
          <div v-if="form.placeOfBirth" class="data-item">
            <span class="label">Place of Birth:</span>
            <span class="value">{{ form.placeOfBirth }}</span>
          </div>
          <div v-if="form.district" class="data-item">
            <span class="label">District:</span>
            <span class="value">{{ form.district }}</span>
          </div>
          <div v-if="form.village" class="data-item">
            <span class="label">Village:</span>
            <span class="value">{{ form.village }}</span>
          </div>
          <div v-if="form.chief" class="data-item">
            <span class="label">Chief:</span>
            <span class="value">{{ form.chief }}</span>
          </div>
          <div v-if="form.tribe" class="data-item">
            <span class="label">Tribe:</span>
            <span class="value">{{ form.tribe }}</span>
          </div>
          <div v-if="form.nationality" class="data-item">
            <span class="label">Nationality:</span>
            <span class="value">{{ form.nationality }}</span>
          </div>
          <div v-if="form.religion" class="data-item">
            <span class="label">Religion:</span>
            <span class="value">{{ form.religion }}</span>
          </div>
        </div>
      </div>

      <!-- Pregnancy Information Section -->
      <div v-if="hasPregnancyInfo" class="data-section">
        <h3>Pregnancy Information</h3>
        <div class="data-grid">
          <div v-if="form.estimatedConceptionDate" class="data-item">
            <span class="label">Estimated Conception Date:</span>
            <span class="value">{{ formatDate(form.estimatedConceptionDate) }}</span>
          </div>
          <div v-if="form.pregnancyDuration" class="data-item">
            <span class="label">Pregnancy Duration:</span>
            <span class="value">{{ form.pregnancyDuration }} weeks</span>
          </div>
          <div v-if="form.conceptionCategory" class="data-item">
            <span class="label">Conception Category:</span>
            <span class="value">{{ form.conceptionCategory }}</span>
          </div>
          <div v-if="form.fatherRelation" class="data-item">
            <span class="label">Father's Relation to Mother:</span>
            <span class="value">{{ form.fatherRelation }}</span>
          </div>
          <div v-if="form.legalActionTaken" class="data-item">
            <span class="label">Legal Action Taken:</span>
            <span class="value">{{ form.legalActionTaken }}</span>
          </div>
          <div v-if="form.confirmedPregnancyTest" class="data-item">
            <span class="label">Confirmed Pregnancy Test:</span>
            <span class="value">{{ form.confirmedPregnancyTest }}</span>
          </div>
        </div>
        <div v-if="form.conceptionDescription" class="data-item full-width">
          <span class="label">Conception Description:</span>
          <p class="value text-block">{{ form.conceptionDescription }}</p>
        </div>
      </div>

      <!-- Medical Information Section -->
      <div v-if="hasMedicalInfo" class="data-section">
        <h3>Medical Information</h3>
        <div class="data-grid">
          <div v-if="form.hivStatus" class="data-item">
            <span class="label">HIV Status:</span>
            <span class="value">{{ form.hivStatus }}</span>
          </div>
          <div v-if="form.nonPregnancyHealthIssues" class="data-item">
            <span class="label">Non-Pregnancy Health Issues:</span>
            <span class="value">{{ form.nonPregnancyHealthIssues }}</span>
          </div>
          <div v-if="form.pregnancyHealthIssues" class="data-item">
            <span class="label">Pregnancy-Related Health Issues:</span>
            <span class="value">{{ form.pregnancyHealthIssues }}</span>
          </div>
          <div v-if="form.clinic" class="data-item">
            <span class="label">Clinic:</span>
            <span class="value">{{ form.clinic }}</span>
          </div>
        </div>
        <div v-if="form.healthIssuesDescription" class="data-item full-width">
          <span class="label">Health Issues Description:</span>
          <p class="value text-block">{{ form.healthIssuesDescription }}</p>
        </div>
      </div>

      <!-- Family Composition Section -->
      <div v-if="form.familyMembers && form.familyMembers.length > 0" class="data-section">
        <h3>Family Composition</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Relation</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Occupation</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in form.familyMembers" :key="index">
              <td>{{ member.relation || '-' }}</td>
              <td>{{ member.name || '-' }}</td>
              <td>{{ member.age || '-' }}</td>
              <td>{{ member.gender || '-' }}</td>
              <td>{{ member.occupation || '-' }}</td>
              <td>{{ member.location || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Education Section -->
      <div v-if="hasEducationInfo" class="data-section">
        <h3>Education</h3>
        <div class="data-grid">
          <div v-if="form.currentlyAttendingSchool" class="data-item">
            <span class="label">Currently Attending School:</span>
            <span class="value">{{ form.currentlyAttendingSchool }}</span>
          </div>
          <div v-if="form.schoolName" class="data-item">
            <span class="label">School Name:</span>
            <span class="value">{{ form.schoolName }}</span>
          </div>
          <div v-if="form.currentGradeLevel" class="data-item">
            <span class="label">Current Grade Level:</span>
            <span class="value">{{ form.currentGradeLevel }}</span>
          </div>
          <div v-if="form.highestGradeLevel" class="data-item">
            <span class="label">Highest Completed Grade:</span>
            <span class="value">{{ form.highestGradeLevel }}</span>
          </div>
        </div>
      </div>

      <!-- Assessment Results Section -->
      <div v-if="hasAssessmentResults" class="data-section">
        <h3>Assessment Results</h3>
        <div class="data-grid">
          <div v-if="form.meetsTkpCriteria" class="data-item">
            <span class="label">Meets TKP Criteria:</span>
            <span class="value">{{ form.meetsTkpCriteria }}</span>
          </div>
          <div v-if="form.ageRange" class="data-item">
            <span class="label">Age Range (<15):</span>
            <span class="value">{{ form.ageRange }}</span>
          </div>
          <div v-if="form.confirmedPregnant" class="data-item">
            <span class="label">Confirmed Pregnant:</span>
            <span class="value">{{ form.confirmedPregnant }}</span>
          </div>
          <div v-if="form.tkpRecommendation" class="data-item">
            <span class="label">TKP Recommendation:</span>
            <span class="value">{{ form.tkpRecommendation }}</span>
          </div>
          <div v-if="form.assessmentDate" class="data-item">
            <span class="label">Assessment Date:</span>
            <span class="value">{{ formatDate(form.assessmentDate) }}</span>
          </div>
          <div v-if="form.tkpSocialWorker" class="data-item">
            <span class="label">TKP Social Worker:</span>
            <span class="value">{{ form.tkpSocialWorker }}</span>
          </div>
        </div>
        <div v-if="form.recommendationDescription" class="data-item full-width">
          <span class="label">Recommendation Description:</span>
          <p class="value text-block">{{ form.recommendationDescription }}</p>
        </div>
      </div>

      <!-- Referral Information Section -->
      <div v-if="hasReferralInfo" class="data-section">
        <h3>Referral Information</h3>
        <div class="data-grid">
          <div v-if="form.dateOfReferral" class="data-item">
            <span class="label">Date of Referral:</span>
            <span class="value">{{ formatDate(form.dateOfReferral) }}</span>
          </div>
          <div v-if="form.referralMethod" class="data-item">
            <span class="label">Referral Method:</span>
            <span class="value">{{ form.referralMethod }}</span>
          </div>
          <div v-if="form.referrerName" class="data-item">
            <span class="label">Referrer Name:</span>
            <span class="value">{{ form.referrerName }}</span>
          </div>
          <div v-if="form.contactInfo" class="data-item">
            <span class="label">Contact Info:</span>
            <span class="value">{{ form.contactInfo }}</span>
          </div>
        </div>
      </div>

      <!-- Caregiver Information Section -->
      <div v-if="hasCaregiverInfo" class="data-section">
        <h3>Caregiver Information</h3>
        <div class="data-grid">
          <div v-if="form.primaryCaregiverName || form.primaryCaregiver?.name" class="data-item">
            <span class="label">Primary Caregiver:</span>
            <span class="value">{{ form.primaryCaregiverName || form.primaryCaregiver?.name }}</span>
          </div>
          <div v-if="form.relationshipToChild || form.primaryCaregiver?.relationship" class="data-item">
            <span class="label">Relationship:</span>
            <span class="value">{{ form.relationshipToChild || form.primaryCaregiver?.relationship }}</span>
          </div>
          <div v-if="form.primaryCaregiver?.phone1" class="data-item">
            <span class="label">Phone:</span>
            <span class="value">{{ form.primaryCaregiver.phone1 }}</span>
          </div>
          <div v-if="form.primaryCaregiver?.occupation" class="data-item">
            <span class="label">Occupation:</span>
            <span class="value">{{ form.primaryCaregiver.occupation }}</span>
          </div>
          <div v-if="form.areaOfTown || form.primaryCaregiver?.area" class="data-item">
            <span class="label">Area:</span>
            <span class="value">{{ form.areaOfTown || form.primaryCaregiver?.area }}</span>
          </div>
        </div>
      </div>

      <!-- Abuse Details Section -->
      <div v-if="hasAbuseInfo" class="data-section">
        <h3>Abuse Details</h3>
        <div class="data-grid">
          <div v-if="form.typeOfAbuse" class="data-item">
            <span class="label">Type of Abuse:</span>
            <span class="value">{{ form.typeOfAbuse }}</span>
          </div>
          <div v-if="form.abuserRelationship" class="data-item">
            <span class="label">Abuser Relationship:</span>
            <span class="value">{{ form.abuserRelationship }}</span>
          </div>
          <div v-if="form.estimatedDateOfAbuse" class="data-item">
            <span class="label">Estimated Date:</span>
            <span class="value">{{ formatDate(form.estimatedDateOfAbuse) }}</span>
          </div>
        </div>
        <div v-if="form.detailsOfAbuse || form.abuseDetails" class="data-item full-width">
          <span class="label">Details:</span>
          <p class="value text-block">{{ form.detailsOfAbuse || form.abuseDetails }}</p>
        </div>
      </div>

      <!-- Living Situation Section -->
      <div v-if="form.livingSituation" class="data-section">
        <h3>Living Situation</h3>
        <div class="data-item full-width">
          <span class="label">Description:</span>
          <p class="value text-block">{{ form.livingSituation }}</p>
        </div>
      </div>

      <!-- Reasons for Admission Section -->
      <div v-if="hasReasonsForAdmission" class="data-section">
        <h3>Reasons for Admission</h3>
        <div class="data-grid">
          <div v-if="form.reasons?.attemptedAbortion" class="data-item">
            <span class="label">Attempted Abortion:</span>
            <span class="value">Yes</span>
          </div>
          <div v-if="form.reasons?.attemptedSuicide" class="data-item">
            <span class="label">Attempted Suicide:</span>
            <span class="value">Yes</span>
          </div>
          <div v-if="form.reasons?.pregnant" class="data-item">
            <span class="label">Pregnant:</span>
            <span class="value">Yes</span>
          </div>
          <div v-if="form.reasons?.rapeDefilement" class="data-item">
            <span class="label">Rape/Defilement:</span>
            <span class="value">Yes</span>
          </div>
          <div v-if="form.reasons?.survivalProstitution" class="data-item">
            <span class="label">Survival Prostitution:</span>
            <span class="value">Yes</span>
          </div>
          <div v-if="form.reasons?.other" class="data-item">
            <span class="label">Other:</span>
            <span class="value">Yes</span>
          </div>
        </div>
      </div>

      <!-- OVC Status Section -->
      <div v-if="form.ovcStatus" class="data-section">
        <h3>Vulnerability Status</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="label">OVC Status:</span>
            <span class="value">{{ form.ovcStatus }}</span>
          </div>
          <div v-if="form.ovcDateEffective" class="data-item">
            <span class="label">OVC Date Effective:</span>
            <span class="value">{{ formatDate(form.ovcDateEffective) }}</span>
          </div>
        </div>
      </div>

      <!-- Admission Details Section -->
      <div v-if="hasAdmissionDetails" class="data-section">
        <h3>Admission Details</h3>
        <div class="data-grid">
          <div v-if="form.dateOfAdmission" class="data-item">
            <span class="label">Date of Admission:</span>
            <span class="value">{{ formatDate(form.dateOfAdmission) }}</span>
          </div>
          <div v-if="form.ageAtIntake" class="data-item">
            <span class="label">Age at Intake:</span>
            <span class="value">{{ form.ageAtIntake }} years</span>
          </div>
          <div v-if="form.dateCompiled" class="data-item">
            <span class="label">Date Compiled:</span>
            <span class="value">{{ formatDate(form.dateCompiled) }}</span>
          </div>
        </div>
      </div>

      <!-- Pregnancy Details Section (for Initial Referral) -->
      <div v-if="hasInitialReferralPregnancyInfo" class="data-section">
        <h3>Pregnancy Details</h3>
        <div class="data-grid">
          <div v-if="form.pregnancyLength" class="data-item">
            <span class="label">Pregnancy Length:</span>
            <span class="value">{{ form.pregnancyLength }} weeks/months</span>
          </div>
          <div v-if="form.visitedClinic" class="data-item">
            <span class="label">Visited Clinic:</span>
            <span class="value">{{ form.visitedClinic === 'Y' ? 'Yes' : form.visitedClinic === 'N' ? 'No' : form.visitedClinic }}</span>
          </div>
          <div v-if="form.clinicVisitDate" class="data-item">
            <span class="label">Clinic Visit Date:</span>
            <span class="value">{{ formatDate(form.clinicVisitDate) }}</span>
          </div>
          <div v-if="form.clinic" class="data-item">
            <span class="label">Clinic Name:</span>
            <span class="value">{{ form.clinic }}</span>
          </div>
          <div v-if="form.clinicDocumentation" class="data-item">
            <span class="label">Clinic Documentation:</span>
            <span class="value">{{ form.clinicDocumentation === 'Y' ? 'Yes' : form.clinicDocumentation === 'N' ? 'No' : form.clinicDocumentation }}</span>
          </div>
          <div v-if="form.pregnancyTestDocumentation" class="data-item">
            <span class="label">Pregnancy Test Documentation:</span>
            <span class="value">{{ form.pregnancyTestDocumentation === 'Y' ? 'Yes' : form.pregnancyTestDocumentation === 'N' ? 'No' : form.pregnancyTestDocumentation }}</span>
          </div>
        </div>
      </div>

      <!-- Legal Action Section -->
      <div v-if="hasLegalActionInfo" class="data-section">
        <h3>Legal Action</h3>
        <div class="data-grid">
          <div v-if="form.legalActionTaken" class="data-item">
            <span class="label">Legal Action Taken:</span>
            <span class="value">{{ form.legalActionTaken === 'Y' ? 'Yes' : form.legalActionTaken === 'N' ? 'No' : form.legalActionTaken }}</span>
          </div>
          <div v-if="form.caseActive" class="data-item">
            <span class="label">Case Active:</span>
            <span class="value">{{ form.caseActive === 'Y' ? 'Yes' : form.caseActive === 'N' ? 'No' : form.caseActive }}</span>
          </div>
        </div>
        <div v-if="form.legalActionDescription" class="data-item full-width">
          <span class="label">Legal Action Description:</span>
          <p class="value text-block">{{ form.legalActionDescription }}</p>
        </div>
        <div v-if="form.additionalLegalAction" class="data-item full-width">
          <span class="label">Additional Legal Action:</span>
          <p class="value text-block">{{ form.additionalLegalAction }}</p>
        </div>
      </div>

      <!-- Mental Health Section -->
      <div v-if="hasMentalHealthInfo" class="data-section">
        <h3>Mental Health</h3>
        <div class="data-grid">
          <div v-if="form.suicidalThinking" class="data-item">
            <span class="label">Suicidal Thinking:</span>
            <span class="value">{{ form.suicidalThinking === 'Y' ? 'Yes' : form.suicidalThinking === 'N' ? 'No' : form.suicidalThinking }}</span>
          </div>
          <div v-if="form.abortionDesire" class="data-item">
            <span class="label">Abortion Desire:</span>
            <span class="value">{{ form.abortionDesire === 'Y' ? 'Yes' : form.abortionDesire === 'N' ? 'No' : form.abortionDesire }}</span>
          </div>
          <div v-if="form.additionalMentalHealth" class="data-item">
            <span class="label">Additional Mental Health Issues:</span>
            <span class="value">{{ form.additionalMentalHealth === 'Y' ? 'Yes' : form.additionalMentalHealth === 'N' ? 'No' : form.additionalMentalHealth }}</span>
          </div>
        </div>
        <div v-if="form.suicidalDescription" class="data-item full-width">
          <span class="label">Suicidal Description:</span>
          <p class="value text-block">{{ form.suicidalDescription }}</p>
        </div>
        <div v-if="form.abortionDescription" class="data-item full-width">
          <span class="label">Abortion Description:</span>
          <p class="value text-block">{{ form.abortionDescription }}</p>
        </div>
        <div v-if="form.mentalHealthDescription" class="data-item full-width">
          <span class="label">Mental Health Description:</span>
          <p class="value text-block">{{ form.mentalHealthDescription }}</p>
        </div>
      </div>

      <!-- Follow-Up Action Section -->
      <div v-if="hasFollowUpInfo" class="data-section">
        <h3>Follow-Up Action</h3>
        <div class="data-grid">
          <div v-if="form.meetsAdmissionCriteria" class="data-item">
            <span class="label">Meets Admission Criteria:</span>
            <span class="value">{{ form.meetsAdmissionCriteria === 'Y' ? 'Yes' : form.meetsAdmissionCriteria === 'N' ? 'No' : form.meetsAdmissionCriteria }}</span>
          </div>
          <div v-if="form.pregnant" class="data-item">
            <span class="label">Pregnant:</span>
            <span class="value">{{ form.pregnant === 'Y' ? 'Yes' : form.pregnant === 'N' ? 'No' : form.pregnant }}</span>
          </div>
          <div v-if="form.ageRange" class="data-item">
            <span class="label">Age Range (<15):</span>
            <span class="value">{{ form.ageRange === 'Y' ? 'Yes' : form.ageRange === 'N' ? 'No' : form.ageRange }}</span>
          </div>
          <div v-if="form.abuseCause" class="data-item">
            <span class="label">Abuse Cause:</span>
            <span class="value">{{ form.abuseCause === 'Y' ? 'Yes' : form.abuseCause === 'N' ? 'No' : form.abuseCause }}</span>
          </div>
          <div v-if="form.suicideAbortionPotential" class="data-item">
            <span class="label">Suicide/Abortion Potential:</span>
            <span class="value">{{ form.suicideAbortionPotential === 'Y' ? 'Yes' : form.suicideAbortionPotential === 'N' ? 'No' : form.suicideAbortionPotential }}</span>
          </div>
          <div v-if="form.familyCommitment" class="data-item">
            <span class="label">Family Commitment:</span>
            <span class="value">{{ form.familyCommitment === 'Y' ? 'Yes' : form.familyCommitment === 'N' ? 'No' : form.familyCommitment }}</span>
          </div>
          <div v-if="form.homeAssessmentDate" class="data-item">
            <span class="label">Home Assessment Date:</span>
            <span class="value">{{ formatDate(form.homeAssessmentDate) }}</span>
          </div>
          <div v-if="form.tkpStaffReceived" class="data-item">
            <span class="label">TKP Staff Received:</span>
            <span class="value">{{ form.tkpStaffReceived }}</span>
          </div>
        </div>
      </div>

      <!-- Information Provider Section -->
      <div v-if="form.informationProvider" class="data-section">
        <h3>Information Provider</h3>
        <div class="data-item">
          <span class="value">{{ form.informationProvider }}</span>
        </div>
      </div>

      <!-- Birth History Section -->
      <div v-if="hasBirthHistory" class="data-section">
        <h3>Birth History</h3>
        <div class="data-grid">
          <div v-if="form.birthHistory?.birthPlace || form.birthHistory?.deliveryLocation" class="data-item">
            <span class="label">Birth Place:</span>
            <span class="value">{{ form.birthHistory?.birthPlace || form.birthHistory?.deliveryLocation }}</span>
          </div>
          <div v-if="form.birthHistory?.deliveryType" class="data-item">
            <span class="label">Delivery Type:</span>
            <span class="value">{{ form.birthHistory?.deliveryType }}</span>
          </div>
          <div v-if="form.birthHistory?.birthWeight" class="data-item">
            <span class="label">Birth Weight:</span>
            <span class="value">{{ form.birthHistory?.birthWeight }} kg</span>
          </div>
          <div v-if="form.birthHistory?.birthLength" class="data-item">
            <span class="label">Birth Length:</span>
            <span class="value">{{ form.birthHistory?.birthLength }} cm</span>
          </div>
          <div v-if="form.birthHistory?.premature" class="data-item">
            <span class="label">Premature Birth:</span>
            <span class="value">{{ form.birthHistory?.premature === 'Yes' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.birthHistory?.prematureWeeks" class="data-item">
            <span class="label">Premature (Weeks):</span>
            <span class="value">{{ form.birthHistory?.prematureWeeks }} weeks</span>
          </div>
          <div v-if="form.birthHistory?.pregnancyComplications" class="data-item">
            <span class="label">Pregnancy Complications:</span>
            <span class="value">{{ form.birthHistory?.pregnancyComplications === 'Yes' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.birthHistory?.deliveryComplications" class="data-item">
            <span class="label">Delivery Complications:</span>
            <span class="value">{{ form.birthHistory?.deliveryComplications === 'Yes' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.birthHistory?.deliveryComplicationsList" class="data-item full-width">
            <span class="label">Delivery Complications Details:</span>
            <p class="value text-block">{{ form.birthHistory?.deliveryComplicationsList }}</p>
          </div>
          <div v-if="form.birthHistory?.medicationsDuringPregnancy" class="data-item">
            <span class="label">Medications During Pregnancy:</span>
            <span class="value">{{ form.birthHistory?.medicationsDuringPregnancy === 'Yes' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.birthHistory?.medicationsList" class="data-item full-width">
            <span class="label">Medications List:</span>
            <p class="value text-block">{{ form.birthHistory?.medicationsList }}</p>
          </div>
          <div v-if="form.birthHistory?.substanceUseDuringPregnancy" class="data-item">
            <span class="label">Substance Use During Pregnancy:</span>
            <span class="value">{{ form.birthHistory?.substanceUseDuringPregnancy === 'Yes' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.birthHistory?.infantAlertResponsive" class="data-item">
            <span class="label">Infant Alert & Responsive:</span>
            <span class="value">{{ form.birthHistory?.infantAlertResponsive === 'Yes' ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>

      <!-- Pregnancy Details Section (Medical) -->
      <div v-if="hasMedicalPregnancyDetails" class="data-section">
        <h3>Pregnancy Details</h3>
        <div class="data-grid">
          <div v-if="form.pregnancyDetails?.pregnancyLength" class="data-item">
            <span class="label">Pregnancy Length:</span>
            <span class="value">{{ form.pregnancyDetails?.pregnancyLength }} weeks</span>
          </div>
          <div v-if="form.pregnancyDetails?.trimester" class="data-item">
            <span class="label">Trimester:</span>
            <span class="value">{{ form.pregnancyDetails?.trimester }}</span>
          </div>
          <div v-if="form.pregnancyDetails?.morningSickness" class="data-item">
            <span class="label">Morning Sickness:</span>
            <span class="value">{{ form.pregnancyDetails?.morningSickness === 'YES' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.pregnancyDetails?.morningSicknessDetails" class="data-item full-width">
            <span class="label">Morning Sickness Details:</span>
            <p class="value text-block">{{ form.pregnancyDetails?.morningSicknessDetails }}</p>
          </div>
          <div v-if="form.pregnancyDetails?.complications" class="data-item">
            <span class="label">Complications:</span>
            <span class="value">{{ form.pregnancyDetails?.complications === 'YES' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.pregnancyDetails?.complicationsDetails" class="data-item full-width">
            <span class="label">Complications Details:</span>
            <p class="value text-block">{{ form.pregnancyDetails?.complicationsDetails }}</p>
          </div>
          <div v-if="form.pregnancyDetails?.additionalNotes" class="data-item full-width">
            <span class="label">Additional Notes:</span>
            <p class="value text-block">{{ form.pregnancyDetails?.additionalNotes }}</p>
          </div>
        </div>
      </div>

      <!-- Growth & Development Section -->
      <div v-if="hasGrowthDevelopment" class="data-section">
        <h3>Growth & Development</h3>
        <div class="data-grid">
          <div v-if="form.growthDevelopment?.breastFed" class="data-item">
            <span class="label">Breast Fed:</span>
            <span class="value">{{ form.growthDevelopment?.breastFed === 'Yes' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.growthDevelopment?.breastFedDuration" class="data-item">
            <span class="label">Breast Fed Duration:</span>
            <span class="value">{{ form.growthDevelopment?.breastFedDuration }}</span>
          </div>
          <div v-if="form.growthDevelopment?.formulaFed" class="data-item">
            <span class="label">Formula Fed:</span>
            <span class="value">{{ form.growthDevelopment?.formulaFed === 'Yes' ? 'Yes' : 'No' }}</span>
          </div>
        </div>
        <div v-if="form.growthDevelopment?.milestones" class="data-grid">
          <h5>Developmental Milestones</h5>
          <div v-if="form.growthDevelopment?.milestones?.holdHeadUp" class="data-item">
            <span class="label">Hold Head Up:</span>
            <span class="value">{{ form.growthDevelopment?.milestones?.holdHeadUp }} months</span>
          </div>
          <div v-if="form.growthDevelopment?.milestones?.sitUpAlone" class="data-item">
            <span class="label">Sit Up Alone:</span>
            <span class="value">{{ form.growthDevelopment?.milestones?.sitUpAlone }} months</span>
          </div>
          <div v-if="form.growthDevelopment?.milestones?.crawl" class="data-item">
            <span class="label">Crawl:</span>
            <span class="value">{{ form.growthDevelopment?.milestones?.crawl }} months</span>
          </div>
          <div v-if="form.growthDevelopment?.milestones?.walk" class="data-item">
            <span class="label">Walk:</span>
            <span class="value">{{ form.growthDevelopment?.milestones?.walk }} months</span>
          </div>
        </div>
      </div>

      <!-- Medical History Section (Enhanced) -->
      <div v-if="hasDetailedMedicalHistory" class="data-section">
        <h3>Medical History</h3>
        <div class="data-grid">
          <div v-if="form.medicalHistory?.generalHealth" class="data-item">
            <span class="label">General Health:</span>
            <span class="value">{{ form.medicalHistory?.generalHealth }}</span>
          </div>
          <div v-if="form.medicalHistory?.hospitalizations" class="data-item">
            <span class="label">Previous Hospitalizations:</span>
            <span class="value">{{ form.medicalHistory?.hospitalizations === 'YES' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.medicalHistory?.hospitalizationsExplanation" class="data-item full-width">
            <span class="label">Hospitalization Details:</span>
            <p class="value text-block">{{ form.medicalHistory?.hospitalizationsExplanation }}</p>
          </div>
          <div v-if="form.medicalHistory?.surgicalOperations" class="data-item">
            <span class="label">Surgical Operations:</span>
            <span class="value">{{ form.medicalHistory?.surgicalOperations === 'YES' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.medicalHistory?.surgicalOperationsExplanation" class="data-item full-width">
            <span class="label">Surgery Details:</span>
            <p class="value text-block">{{ form.medicalHistory?.surgicalOperationsExplanation }}</p>
          </div>
          <div v-if="form.medicalHistory?.brokenBones" class="data-item">
            <span class="label">Broken Bones:</span>
            <span class="value">{{ form.medicalHistory?.brokenBones === 'YES' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.medicalHistory?.brokenBonesExplanation" class="data-item full-width">
            <span class="label">Broken Bones Details:</span>
            <p class="value text-block">{{ form.medicalHistory?.brokenBonesExplanation }}</p>
          </div>
          <div v-if="form.medicalHistory?.additionalInformation" class="data-item full-width">
            <span class="label">Additional Information:</span>
            <p class="value text-block">{{ form.medicalHistory?.additionalInformation }}</p>
          </div>
        </div>
        
        <div v-if="form.medicalHistory?.conditions && hasMedicalConditions" class="data-grid">
          <h5>Medical Conditions</h5>
          <div v-for="(value, key) in form.medicalHistory?.conditions" :key="key" class="data-item">
            <span v-if="value" class="label">{{ formatConditionKey(key) }}:</span>
            <span v-if="value" class="value">Yes</span>
          </div>
        </div>
      </div>

      <!-- Medications Section -->
      <div v-if="hasMedicationsInfo" class="data-section">
        <h3>Medications</h3>
        <div class="data-grid">
          <div v-if="form.medications?.under5CardAvailable" class="data-item">
            <span class="label">Under-5 Card Available:</span>
            <span class="value">{{ form.medications?.under5CardAvailable === 'YES' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.medications?.under5CardCopyMade" class="data-item">
            <span class="label">Under-5 Card Copy Made:</span>
            <span class="value">{{ form.medications?.under5CardCopyMade === 'YES' ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="form.medications?.allergicReactions" class="data-item full-width">
            <span class="label">Allergic Reactions:</span>
            <p class="value text-block">{{ form.medications?.allergicReactions }}</p>
          </div>
        </div>
        <div v-if="form.medications?.list && form.medications.list.length > 0" class="data-item full-width">
          <span class="label">Current Medications:</span>
          <ul class="value">
            <li v-for="(med, index) in form.medications.list" :key="index">{{ med }}</li>
          </ul>
        </div>
      </div>

      <!-- Parents Status Section -->
      <div v-if="form.parentsStatus" class="data-section">
        <h3>Parents Status</h3>
        <div class="data-item">
          <span class="value">{{ form.parentsStatus }}</span>
        </div>
      </div>

      <!-- Completion Info Section -->
      <div v-if="hasCompletionInfo" class="data-section">
        <h3>Form Completion</h3>
        <div class="data-grid">
          <div v-if="form.completion?.completionDate" class="data-item">
            <span class="label">Completion Date:</span>
            <span class="value">{{ formatDate(form.completion?.completionDate) }}</span>
          </div>
          <div v-if="form.completion?.completedBy" class="data-item">
            <span class="label">Completed By:</span>
            <span class="value">{{ form.completion?.completedBy }}</span>
          </div>
        </div>
      </div>

      <!-- Biological Children Section -->
      <div v-if="hasBiologicalChildren" class="data-section">
        <h3>Biological Children</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(child, index) in form.biologicalChildren" :key="index">
              <td>{{ child.name || '-' }}</td>
              <td>{{ child.age || '-' }}</td>
              <td>{{ child.gender || '-' }}</td>
              <td>{{ child.status || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Generic Data Section (for any remaining fields) -->
      <div v-if="otherFields.length > 0" class="data-section">
        <h3>Additional Information</h3>
        <div class="data-grid">
          <div v-for="field in otherFields" :key="field.key" class="data-item">
            <span class="label">{{ formatFieldName(field.key) }}:</span>
            <span class="value">{{ formatValue(field.value) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="display-footer">
      <slot name="actions">
        <button class="btn btn-secondary" @click="$emit('close')">Close</button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close']);

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatValue = (value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const getFormTypeTitle = (formType) => {
  const titles = {
    'initial-referral': 'Initial Referral Form',
    'child-overview': 'Child Overview & Background',
    'initial-assessment': 'TKP Initial Assessment',
    'medical-intake': 'Medical Intake Assessment',
    'academics-literacy': 'Academics & Literacy Plan',
    'psychological-assessment': 'Psychological Assessment',
    'life-skills-survey': 'Life Skills Survey',
    'birth-delivery': 'Birth and Delivery Report',
    'care-plan-summary': 'Care Plan Summary',
    'care-plan-baby': 'Care Plan (Baby)',
  };
  return titles[formType] || 'Form';
};

// Computed properties to check if sections have data
const hasChildInfo = computed(() => {
  return !!(
    props.form.childFirstName ||
    props.form.childSurname ||
    props.form.dateOfBirth ||
    props.form.age ||
    props.form.gender
  );
});

const hasPregnancyInfo = computed(() => {
  return !!(
    props.form.estimatedConceptionDate ||
    props.form.pregnancyDuration ||
    props.form.conceptionCategory ||
    props.form.conceptionDescription
  );
});

const hasMedicalInfo = computed(() => {
  return !!(
    props.form.hivStatus ||
    props.form.nonPregnancyHealthIssues ||
    props.form.pregnancyHealthIssues ||
    props.form.healthIssuesDescription
  );
});

const hasEducationInfo = computed(() => {
  return !!(
    props.form.currentlyAttendingSchool ||
    props.form.schoolName ||
    props.form.currentGradeLevel
  );
});

const hasAssessmentResults = computed(() => {
  return !!(
    props.form.meetsTkpCriteria ||
    props.form.tkpRecommendation ||
    props.form.assessmentDate ||
    props.form.recommendationDescription
  );
});

const hasReferralInfo = computed(() => {
  return !!(
    props.form.dateOfReferral ||
    props.form.referralMethod ||
    props.form.referrerName ||
    props.form.contactInfo
  );
});

const hasCaregiverInfo = computed(() => {
  return !!(
    props.form.primaryCaregiverName ||
    props.form.primaryCaregiver?.name ||
    props.form.relationshipToChild ||
    props.form.primaryCaregiver?.relationship ||
    props.form.areaOfTown
  );
});

const hasAbuseInfo = computed(() => {
  return !!(
    props.form.typeOfAbuse ||
    props.form.abuserRelationship ||
    props.form.estimatedDateOfAbuse ||
    props.form.detailsOfAbuse ||
    props.form.abuseDetails
  );
});

const hasReasonsForAdmission = computed(() => {
  return props.form.reasons && Object.values(props.form.reasons || {}).some(v => v === true);
});

const hasAdmissionDetails = computed(() => {
  return !!(
    props.form.dateOfAdmission ||
    props.form.ageAtIntake ||
    props.form.dateCompiled
  );
});

const hasInitialReferralPregnancyInfo = computed(() => {
  return !!(
    props.form.pregnancyLength ||
    props.form.visitedClinic ||
    props.form.clinicVisitDate ||
    props.form.clinic ||
    props.form.clinicDocumentation ||
    props.form.pregnancyTestDocumentation
  );
});

const hasLegalActionInfo = computed(() => {
  return !!(
    props.form.legalActionTaken ||
    props.form.caseActive ||
    props.form.legalActionDescription ||
    props.form.additionalLegalAction
  );
});

const hasMentalHealthInfo = computed(() => {
  return !!(
    props.form.suicidalThinking ||
    props.form.abortionDesire ||
    props.form.additionalMentalHealth ||
    props.form.suicidalDescription ||
    props.form.abortionDescription ||
    props.form.mentalHealthDescription
  );
});

const hasFollowUpInfo = computed(() => {
  return !!(
    props.form.meetsAdmissionCriteria ||
    props.form.pregnant ||
    props.form.ageRange ||
    props.form.abuseCause ||
    props.form.suicideAbortionPotential ||
    props.form.familyCommitment ||
    props.form.homeAssessmentDate ||
    props.form.tkpStaffReceived
  );
});

const hasBirthHistory = computed(() => {
  return !!props.form.birthHistory && Object.keys(props.form.birthHistory).length > 0;
});

const hasMedicalPregnancyDetails = computed(() => {
  return !!props.form.pregnancyDetails && Object.keys(props.form.pregnancyDetails).length > 0;
});

const hasGrowthDevelopment = computed(() => {
  return !!props.form.growthDevelopment && Object.keys(props.form.growthDevelopment).length > 0;
});

const hasDetailedMedicalHistory = computed(() => {
  return !!props.form.medicalHistory && Object.keys(props.form.medicalHistory).length > 0;
});

const hasMedicationsInfo = computed(() => {
  return !!props.form.medications && Object.keys(props.form.medications).length > 0;
});

const hasCompletionInfo = computed(() => {
  return !!props.form.completion && Object.keys(props.form.completion).length > 0;
});

const hasBiologicalChildren = computed(() => {
  return Array.isArray(props.form.biologicalChildren) && props.form.biologicalChildren.length > 0;
});

const hasMedicalConditions = computed(() => {
  if (!props.form.medicalHistory?.conditions) return false;
  return Object.values(props.form.medicalHistory.conditions).some(v => v === true);
});

const formatConditionKey = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Get other fields not shown in specific sections
const otherFields = computed(() => {
  const standardFields = [
    'formType',
    'createdAt',
    'updatedAt',
    'status',
    'id',
    'isDraft',
    'childFirstName',
    'childMiddleName',
    'childSurname',
    'childLastName',
    'dateOfBirth',
    'age',
    'gender',
    'residentArea',
    'placeOfBirth',
    'district',
    'village',
    'chief',
    'tribe',
    'nationality',
    'religion',
    'denomination',
    'estimatedConceptionDate',
    'pregnancyDuration',
    'conceptionCategory',
    'conceptionDescription',
    'fatherRelation',
    'legalActionTaken',
    'confirmedPregnancyTest',
    'hivStatus',
    'nonPregnancyHealthIssues',
    'pregnancyHealthIssues',
    'healthIssuesDescription',
    'clinic',
    'familyMembers',
    'familyNotes',
    'currentlyAttendingSchool',
    'schoolName',
    'currentGradeLevel',
    'highestGradeLevel',
    'meetsTkpCriteria',
    'tkpRecommendation',
    'assessmentDate',
    'recommendationDescription',
    'tkpSocialWorker',
    'dateOfReferral',
    'referralMethod',
    'referrerName',
    'contactInfo',
    'primaryCaregiverName',
    'primaryCaregiver',
    'secondaryCaregiver',
    'relationshipToChild',
    'areaOfTown',
    'typeOfAbuse',
    'abuserRelationship',
    'estimatedDateOfAbuse',
    'detailsOfAbuse',
    'abuseDetails',
    'livingSituation',
    'reasons',
    'ovcStatus',
    'ovcDateEffective',
    'dateOfAdmission',
    'ageAtIntake',
    'dateCompiled',
    'childName',
    'childId',
    'biologicalFather',
    'biologicalMother',
    'siblings',
    'additionalFamily',
    'documents',
    'parentDeceased',
    'parentDeathDate',
    'guardianDeceased',
    'guardianDeathDate',
    'potentialGuardiansAvailable',
    'pregnancyLength',
    'visitedClinic',
    'clinicVisitDate',
    'clinicDocumentation',
    'pregnancyTestDocumentation',
    'caseActive',
    'suicidalThinking',
    'suicidalDescription',
    'abortionDesire',
    'abortionDescription',
    'additionalMentalHealth',
    'mentalHealthDescription',
    'meetsAdmissionCriteria',
    'pregnant',
    'ageRange',
    'abuseCause',
    'suicideAbortionPotential',
    'familyCommitment',
    'homeAssessmentDate',
    'tkpStaffReceived',
    'additionalLegalAction',
    'legalActionDescription',
    'firestoreId',
    'submittedAt',
    'formVersion',
    'completedSections',
    'otherFirstName',
    'otherMiddleName',
    'otherSurname',
    'childMiddleName',
    'formId',
    'submittedBy',
    'lastModifiedBy',
    'version',
    'informationProvider',
    'birthHistory',
    'pregnancyDetails',
    'growthDevelopment',
    'medicalHistory',
    'medications',
    'parentsStatus',
    'completion',
    'biologicalChildren',
  ];

  return Object.entries(props.form)
    .filter(([key, value]) => {
      // Skip standard fields
      if (standardFields.includes(key)) return false;
      // Skip null/undefined/empty values
      if (value === null || value === undefined || value === '') return false;
      // Skip Firestore timestamp objects
      if (typeof value === 'object' && value?.type === 'firestore/timestamp/1.0') return false;
      // Skip empty objects
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      // Skip empty arrays
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
    .map(([key, value]) => ({ key, value }));
});
</script>

<style scoped>
.form-data-display {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.display-header {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  color: white;
  padding: 2rem;
  border-bottom: 3px solid #134e4a;
}

.display-header h2 {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
}

.header-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  font-size: 0.95rem;
}

.created-date {
  opacity: 0.9;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.status-badge.completed {
  background-color: #10b981;
  border-color: #059669;
}

.status-badge.draft {
  background-color: #f59e0b;
  border-color: #d97706;
}

.status-badge.pending {
  background-color: #8b5cf6;
  border-color: #7c3aed;
}

.display-content {
  padding: 2rem;
}

.data-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.data-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.data-section h3 {
  font-size: 1.2rem;
  color: #0d9488;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #d1fae5;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.data-item {
  display: flex;
  flex-direction: column;
}

.data-item.full-width {
  grid-column: 1 / -1;
}

.data-item .label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-item .value {
  color: #1f2937;
  font-size: 0.95rem;
  line-height: 1.5;
  word-break: break-word;
}

.data-item .value.text-block {
  background-color: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border-left: 3px solid #0d9488;
  white-space: pre-wrap;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.data-table thead {
  background-color: #f3f4f6;
  border-bottom: 2px solid #d1d5db;
}

.data-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
}

.data-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

.data-table tbody tr:hover {
  background-color: #f3f4f6;
}

.display-footer {
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

@media (max-width: 768px) {
  .data-grid {
    grid-template-columns: 1fr;
  }

  .display-header {
    padding: 1.5rem;
  }

  .display-content {
    padding: 1.5rem;
  }

  .header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .data-table {
    font-size: 0.8rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }
}
</style>
