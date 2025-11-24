<template>
  <div class="dhis2-app-shell">
    <TopHeader />
    
    <div class="app-content">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Import</h3>
          </div>
          <nav class="sidebar-nav">
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'metadata-import' }"
              @click.prevent="activeModule = 'metadata-import'"
            >
              <i class="fas fa-cube"></i>
              Metadata Import
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'data-import' }"
              @click.prevent="activeModule = 'data-import'"
            >
              <i class="fas fa-database"></i>
              Data Import
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'event-import' }"
              @click.prevent="activeModule = 'event-import'"
            >
              <i class="fas fa-calendar-alt"></i>
              Event Import
            </a>
          </nav>
        </div>

        <div class="sidebar-section">
          <div class="section-header">
            <h3>Export</h3>
          </div>
          <nav class="sidebar-nav">
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'metadata-export' }"
              @click.prevent="activeModule = 'metadata-export'"
            >
              <i class="fas fa-file-export"></i>
              Metadata Export
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'data-export' }"
              @click.prevent="activeModule = 'data-export'"
            >
              <i class="fas fa-table"></i>
              Data Export
            </a>
            <a 
              href="#" 
              class="nav-item" 
              :class="{ active: activeModule === 'event-export' }"
              @click.prevent="activeModule = 'event-export'"
            >
              <i class="fas fa-list-alt"></i>
              Event Export
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="main-workspace">
        <div class="workspace-header">
          <h2 class="module-title">{{ getModuleTitle(activeModule) }}</h2>
        </div>

        <div class="workspace-content">
          <!-- Metadata Import -->
          <div v-if="activeModule === 'metadata-import'" class="module-content">
            <div class="info-box">
              <i class="fas fa-info-circle"></i>
              <p>Import metadata such as programs, data elements, and organisation units using JSON or XML format.</p>
            </div>
            
            <div class="form-group">
              <label>Format</label>
              <select v-model="importSettings.format" class="dhis2-select">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div class="form-group">
              <label>Upload File</label>
              <div class="file-upload-area" @dragover.prevent @drop.prevent="handleFileDrop">
                <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none" />
                <div v-if="!selectedFile" class="upload-placeholder" @click="$refs.fileInput.click()">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Select a file or drag and drop here</p>
                </div>
                <div v-else class="file-selected">
                  <i class="fas fa-file-code"></i>
                  <span>{{ selectedFile.name }}</span>
                  <button @click="selectedFile = null" class="icon-btn"><i class="fas fa-times"></i></button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Import Mode</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" v-model="importSettings.mode" value="commit" /> Commit (Import)
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="importSettings.mode" value="validate" /> Validate (Dry Run)
                </label>
              </div>
            </div>

            <div class="action-bar">
              <button class="dhis2-btn primary" @click="performImport" :disabled="!selectedFile">
                <i class="fas fa-upload"></i> Import
              </button>
            </div>
          </div>

          <!-- Data/Event Import -->
          <div v-if="['data-import', 'event-import'].includes(activeModule)" class="module-content">
             <div class="info-box">
              <i class="fas fa-info-circle"></i>
              <p>Import {{ activeModule === 'data-import' ? 'aggregate data values' : 'event data' }} into the system.</p>
            </div>

            <div class="form-group">
              <label>Target Form Type</label>
              <div class="form-row-actions">
                <select v-model="importSettings.targetFormType" class="dhis2-select">
                  <option value="">-- Auto-detect from file --</option>
                  <option v-for="type in availableFormTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <button class="dhis2-btn secondary" @click="downloadTemplate" :disabled="!importSettings.targetFormType">
                  <i class="fas fa-download"></i> Download Template
                </button>
              </div>
              <small class="help-text">Select a form type to download a template or force import type.</small>
            </div>

            <div class="form-group">
              <label>Format</label>
              <select v-model="importSettings.format" class="dhis2-select">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div class="form-group">
              <label>Upload File</label>
              <div class="file-upload-area" @dragover.prevent @drop.prevent="handleFileDrop">
                <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none" />
                <div v-if="!selectedFile" class="upload-placeholder" @click="$refs.fileInput.click()">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Select a file or drag and drop here</p>
                </div>
                <div v-else class="file-selected">
                  <i class="fas fa-file-alt"></i>
                  <span>{{ selectedFile.name }}</span>
                  <button @click="selectedFile = null" class="icon-btn"><i class="fas fa-times"></i></button>
                </div>
              </div>
            </div>

            <div class="action-bar">
              <button class="dhis2-btn primary" @click="performImport" :disabled="!selectedFile">
                <i class="fas fa-upload"></i> Import
              </button>
            </div>
          </div>

          <!-- Metadata Export -->
          <div v-if="activeModule === 'metadata-export'" class="module-content">
            <div class="info-box">
              <i class="fas fa-info-circle"></i>
              <p>Export metadata schemas for programs, forms, and organization units.</p>
            </div>

            <div class="form-group">
              <label>Format</label>
              <select v-model="exportSettings.format" class="dhis2-select">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
              </select>
            </div>

            <div class="form-group">
              <label>Compression</label>
              <select v-model="exportSettings.compression" class="dhis2-select">
                <option value="none">None</option>
                <option value="zip">ZIP</option>
                <option value="gz">GZIP</option>
              </select>
            </div>

            <div class="form-group">
              <label>Schemas to Export</label>
              <div class="checkbox-list">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="exportSettings.schemas" value="programs" /> Programs
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="exportSettings.schemas" value="dataElements" /> Data Elements
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="exportSettings.schemas" value="orgUnits" /> Organisation Units
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="exportSettings.schemas" value="optionSets" /> Option Sets
                </label>
              </div>
            </div>

            <div class="action-bar">
              <button class="dhis2-btn primary" @click="performExport">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>

          <!-- Data/Event Export -->
          <div v-if="['data-export', 'event-export'].includes(activeModule)" class="module-content">
            <div class="info-box">
              <i class="fas fa-info-circle"></i>
              <p>Export {{ activeModule === 'data-export' ? 'aggregate data' : 'detailed event data' }} for analysis or backup.</p>
            </div>

            <div class="form-group">
              <label>Output Format</label>
              <select v-model="exportSettings.format" class="dhis2-select">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div class="form-group">
              <label>Organisation Unit</label>
              <select v-model="exportSettings.orgUnit" class="dhis2-select">
                <option value="all">All Units</option>
                <option value="Lusaka District">Lusaka District</option>
                <option value="Chongwe Outreach">Chongwe Outreach</option>
                <option value="Kafue Center">Kafue Center</option>
              </select>
            </div>

            <div class="form-group">
              <label>Start Date</label>
              <input type="date" v-model="exportSettings.startDate" class="dhis2-input" />
            </div>

            <div class="form-group">
              <label>End Date</label>
              <input type="date" v-model="exportSettings.endDate" class="dhis2-input" />
            </div>

            <div class="action-bar">
              <button class="dhis2-btn primary" @click="performExport">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>

          <!-- Import Summary / Logs -->
          <div v-if="importSummary" class="import-summary">
            <h3>Import Summary</h3>
            <div class="summary-card" :class="importSummary.status">
              <div class="summary-header">
                <i :class="importSummary.status === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                <span>{{ importSummary.message }}</span>
              </div>
              <div class="summary-details" v-if="importSummary.details">
                <div class="detail-item">
                  <span class="label">Imported:</span>
                  <span class="value">{{ importSummary.details.imported }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Updated:</span>
                  <span class="value">{{ importSummary.details.updated }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Ignored:</span>
                  <span class="value">{{ importSummary.details.ignored }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TopHeader from "./TopHeader.vue";
import EnhancedOutreachService from "../services/enhancedOutreachService.js";
import { useToast } from "../composables/useToast.js";
import * as XLSX from "xlsx";

const { success, error, info } = useToast();

const activeModule = ref('metadata-import');
const selectedFile = ref(null);
const importSummary = ref(null);

const importSettings = ref({
  format: 'json',
  mode: 'commit',
  targetFormType: '' // New: allow selecting target form type
});

const exportSettings = ref({
  format: 'json',
  compression: 'none',
  schemas: ['programs', 'dataElements'],
  orgUnit: 'all',
  startDate: '',
  endDate: ''
});

// Form Schemas for Templates and Mapping
const formSchemas = {
  'initial-referral': {
    name: 'Initial Referral Form',
    fields: [
      'childFirstName', 'childLastName', 'dateOfBirth', 'age', 'dateOfReferral', 
      'referralMethod', 'primaryCaregiverName', 'relationshipToChild', 'areaOfTown', 
      'livingSituation', 'pregnancyLength', 'visitedClinic', 'typeOfAbuse', 
      'abuserRelationship', 'estimatedDateOfAbuse', 'detailsOfAbuse'
    ],
    mapRow: (row) => {
      const data = {};
      Object.keys(row).forEach(key => {
        if (key !== 'formType') data[key] = row[key];
      });
      return data;
    }
  },
  'medical-intake': {
    name: 'Medical Intake Form',
    fields: [
      'childFirstName', 'childMiddleName', 'childSurname', 'otherKnownNames', 'dateOfBirth', 'informationProvider', 'informationProviderOther',
      'biologicalMother.status', 'biologicalMother.firstName', 'biologicalMother.maidenName', 'biologicalMother.dateOfBirth', 'biologicalMother.illnesses',
      'biologicalFather.status', 'biologicalFather.firstName', 'biologicalFather.surname', 'biologicalFather.dateOfBirth', 'biologicalFather.illnesses',
      'parentsStatus',
      'birthHistory.birthPlace', 'birthHistory.pregnancyComplications', 'birthHistory.medicationsDuringPregnancy', 'birthHistory.medicationsList', 'birthHistory.substanceUseDuringPregnancy', 'birthHistory.deliveryType', 'birthHistory.deliveryLocation', 'birthHistory.deliveryComplications', 'birthHistory.deliveryComplicationsList', 'birthHistory.premature', 'birthHistory.prematureWeeks', 'birthHistory.infantAlertResponsive', 'birthHistory.birthWeight', 'birthHistory.birthLength',
      'growthDevelopment.breastFed', 'growthDevelopment.breastFedDuration', 'growthDevelopment.formulaFed',
      'growthDevelopment.milestones.holdHeadUp', 'growthDevelopment.milestones.sitUpAlone', 'growthDevelopment.milestones.crawl', 'growthDevelopment.milestones.walk',
      'medicalHistory.generalHealth', 'medicalHistory.hospitalizations', 'medicalHistory.hospitalizationsExplanation', 'medicalHistory.surgicalOperations', 'medicalHistory.surgicalOperationsExplanation', 'medicalHistory.brokenBones', 'medicalHistory.brokenBonesExplanation', 'medicalHistory.additionalInformation',
      'medications.allergicReactions', 'medications.under5CardAvailable', 'medications.under5CardCopyMade',
      'pregnancyDetails.pregnancyLength', 'pregnancyDetails.trimester', 'pregnancyDetails.morningSickness', 'pregnancyDetails.morningSicknessDetails', 'pregnancyDetails.complications', 'pregnancyDetails.complicationsDetails', 'pregnancyDetails.additionalNotes',
      'completion.completedBy', 'completion.completionDate'
    ],
    mapRow: (row) => {
      const data = {};
      const get = (key, def = '') => row[key] || def;

      ['childFirstName', 'childMiddleName', 'childSurname', 'otherKnownNames', 'dateOfBirth', 'informationProvider', 'informationProviderOther', 'parentsStatus'].forEach(f => {
        if (row[f] !== undefined) data[f] = row[f];
      });

      data.biologicalMother = {};
      ['status', 'firstName', 'maidenName', 'dateOfBirth', 'illnesses'].forEach(k => data.biologicalMother[k] = get(`biologicalMother.${k}`));

      data.biologicalFather = {};
      ['status', 'firstName', 'surname', 'dateOfBirth', 'illnesses'].forEach(k => data.biologicalFather[k] = get(`biologicalFather.${k}`));

      data.birthHistory = {};
      ['birthPlace', 'pregnancyComplications', 'medicationsDuringPregnancy', 'medicationsList', 'substanceUseDuringPregnancy', 'deliveryType', 'deliveryLocation', 'deliveryComplications', 'deliveryComplicationsList', 'premature', 'prematureWeeks', 'infantAlertResponsive', 'birthWeight', 'birthLength'].forEach(k => data.birthHistory[k] = get(`birthHistory.${k}`));

      data.growthDevelopment = {
        breastFed: get('growthDevelopment.breastFed'),
        breastFedDuration: get('growthDevelopment.breastFedDuration'),
        formulaFed: get('growthDevelopment.formulaFed'),
        milestones: {
          holdHeadUp: get('growthDevelopment.milestones.holdHeadUp'),
          sitUpAlone: get('growthDevelopment.milestones.sitUpAlone'),
          crawl: get('growthDevelopment.milestones.crawl'),
          walk: get('growthDevelopment.milestones.walk')
        }
      };

      data.medicalHistory = {};
      ['generalHealth', 'hospitalizations', 'hospitalizationsExplanation', 'surgicalOperations', 'surgicalOperationsExplanation', 'brokenBones', 'brokenBonesExplanation', 'additionalInformation'].forEach(k => data.medicalHistory[k] = get(`medicalHistory.${k}`));
      
      data.medicalHistory.conditions = {}; 

      data.medications = {
        list: [],
        allergicReactions: get('medications.allergicReactions'),
        under5CardAvailable: get('medications.under5CardAvailable'),
        under5CardCopyMade: get('medications.under5CardCopyMade')
      };

      data.pregnancyDetails = {};
      ['pregnancyLength', 'trimester', 'morningSickness', 'morningSicknessDetails', 'complications', 'complicationsDetails', 'additionalNotes'].forEach(k => data.pregnancyDetails[k] = get(`pregnancyDetails.${k}`));

      data.completion = {
        completedBy: get('completion.completedBy'),
        completionDate: get('completion.completionDate')
      };

      return data;
    }
  },
  'child-overview': {
    name: 'Child Overview Form',
    fields: [
      'childFirstName', 'childMiddleName', 'childSurname', 'otherFirstName', 'otherMiddleName', 'otherSurname', 'id', 'dateOfAdmission', 'gender', 'dateOfBirth', 'ageAtIntake', 'placeOfBirth', 'residentArea', 'village', 'chief', 'district', 'tribe', 'denomination', 'nationality',
      'ovcStatus', 'ovcDateEffective', 'parentDeceased', 'parentDeathDate', 'guardianDeceased', 'guardianDeathDate',
      'biologicalFather.name', 'biologicalFather.age', 'biologicalFather.status', 'biologicalFather.deathDate', 'biologicalFather.causeOfDeath', 'biologicalFather.location', 'biologicalFather.profession',
      'biologicalMother.name', 'biologicalMother.age', 'biologicalMother.status', 'biologicalMother.deathDate', 'biologicalMother.causeOfDeath', 'biologicalMother.location', 'biologicalMother.profession',
      'referralMethod',
      'reasons.attemptedAbortion', 'reasons.attemptedSuicide', 'reasons.pregnant', 'reasons.rapeDefilement', 'reasons.survivalProstitution', 'reasons.other',
      'estimatedConceptionDate', 'pregnancyDuration', 'abuseDetails', 'dateCompiled', 'childName', 'childId',
      'primaryCaregiver.name', 'primaryCaregiver.relationship', 'primaryCaregiver.phone1', 'primaryCaregiver.phone2', 'primaryCaregiver.occupation', 'primaryCaregiver.area', 'primaryCaregiver.age', 'primaryCaregiver.nrcNumber', 'primaryCaregiver.notes',
      'secondaryCaregiver.name', 'secondaryCaregiver.relationship', 'secondaryCaregiver.phone1', 'secondaryCaregiver.phone2', 'secondaryCaregiver.occupation', 'secondaryCaregiver.area', 'secondaryCaregiver.age', 'secondaryCaregiver.nrcNumber', 'secondaryCaregiver.notes'
    ],
    mapRow: (row) => {
      const data = {};
      const get = (key, def = '') => row[key] || def;
      const getBool = (key) => row[key] === 'true' || row[key] === true;

      ['childFirstName', 'childMiddleName', 'childSurname', 'otherFirstName', 'otherMiddleName', 'otherSurname', 'id', 'dateOfAdmission', 'gender', 'dateOfBirth', 'ageAtIntake', 'placeOfBirth', 'residentArea', 'village', 'chief', 'district', 'tribe', 'denomination', 'nationality',
      'ovcStatus', 'ovcDateEffective', 'parentDeceased', 'parentDeathDate', 'guardianDeceased', 'guardianDeathDate', 'referralMethod',
      'estimatedConceptionDate', 'pregnancyDuration', 'abuseDetails', 'dateCompiled', 'childName', 'childId'].forEach(f => {
        if (row[f] !== undefined) data[f] = row[f];
      });

      data.biologicalFather = {};
      ['name', 'age', 'status', 'deathDate', 'causeOfDeath', 'location', 'profession'].forEach(k => data.biologicalFather[k] = get(`biologicalFather.${k}`));

      data.biologicalMother = {};
      ['name', 'age', 'status', 'deathDate', 'causeOfDeath', 'location', 'profession'].forEach(k => data.biologicalMother[k] = get(`biologicalMother.${k}`));

      data.reasons = {
        attemptedAbortion: getBool('reasons.attemptedAbortion'),
        attemptedSuicide: getBool('reasons.attemptedSuicide'),
        pregnant: getBool('reasons.pregnant'),
        rapeDefilement: getBool('reasons.rapeDefilement'),
        survivalProstitution: getBool('reasons.survivalProstitution'),
        other: getBool('reasons.other')
      };

      data.primaryCaregiver = {};
      ['name', 'relationship', 'phone1', 'phone2', 'occupation', 'area', 'age', 'nrcNumber', 'notes'].forEach(k => data.primaryCaregiver[k] = get(`primaryCaregiver.${k}`));

      data.secondaryCaregiver = {};
      ['name', 'relationship', 'phone1', 'phone2', 'occupation', 'area', 'age', 'nrcNumber', 'notes'].forEach(k => data.secondaryCaregiver[k] = get(`secondaryCaregiver.${k}`));

      data.siblings = [];

      return data;
    }
  },
  'initial-assessment': {
    name: 'Initial Assessment Form',
    fields: [
      'childName', 'assessmentDate', 'assessorName', 'observations', 
      'recommendations', 'riskLevel', 'immediateNeeds'
    ],
    mapRow: (row) => {
      const data = {};
      Object.keys(row).forEach(key => {
        if (key !== 'formType') data[key] = row[key];
      });
      return data;
    }
  },
  'academics-literacy': {
    name: 'Academics & Literacy Plan',
    fields: [
      'nameOfGirl', 'childId', 'dateOfIntake', 'intakeAge', 'intakeGrade',
      'attendedSchoolPrior', 'secondaryPathway', 'vocationalSpecify'
    ],
    mapRow: (row) => {
      const data = {};
      Object.keys(row).forEach(key => {
        if (key !== 'formType') data[key] = row[key];
      });
      return data;
    }
  },
  'birth-delivery': {
    name: 'Birth & Delivery Plan',
    fields: [
      'childName', 'childId', 'expectedDeliveryDate', 'hospitalPreference',
      'doctorName', 'emergencyContact', 'transportPlan'
    ],
    mapRow: (row) => {
      const data = {};
      Object.keys(row).forEach(key => {
        if (key !== 'formType') data[key] = row[key];
      });
      return data;
    }
  },
  'care-plan-baby': {
    name: 'Care Plan (Baby)',
    fields: [
      'nameOfBaby', 'nameOfMother', 'babyCurrentAge', 'dateOfAssessment', 'assessmentType',
      'motherAgeTwoYears', 'babyAgeTwoYears',
      'reintegrationPlan', 'reintegrationRationale', 'separateReintegrationReason',
      'motherGuardianName', 'motherGuardianRelation', 'sameGuardianForBaby',
      'babyGuardianName', 'babyGuardianRelation', 'babyGuardianRationale',
      'familyCapacity', 'familyCapacityDescription',
      'familyFinancialSupport', 'familyReliantOnTKPTrade',
      'familyWillingToCare', 'familySupportFuture', 'familyWillingnessDescription',
      'familyPlanRelocate', 'planRelocateReason', 'relocationProbability', 'relocationProbabilityReason',
      'familyKnowsNewLocation', 'newLocation', 'currentLocation',
      'babyPhysicalSafetyConcerns', 'homePhysicallySafe',
      'peopleSafetyConcern', 'peopleSafetyConcernDescription',
      'fatherInArea', 'fatherStatus', 'fatherThreat', 'fatherThreatDescription',
      'familySupportMeasures', 'homePhysicalMeasures', 'homeSocialMeasures',
      'needsFamilyTracing', 'familyTracingDescription',
      'reassessmentMonth', 'reassessmentYear',
      'socialWorkerName', 'socialWorkerSignature', 'supervisorName', 'supervisorSignature', 'motherName', 'motherSignature',
      'childFirstName', 'childSurname', 'dateOfBirth'
    ],
    mapRow: (row) => {
      const data = {};
      Object.keys(row).forEach(key => {
        if (key !== 'formType') data[key] = row[key];
      });
      return data;
    }
  },
  'care-plan-ongoing': {
    name: 'Care Plan (Ongoing Life Skills)',
    fields: [
      'girlName', 'girlAge', 'grade', 'dateOfAdmission', 'babyAge', 'dateOfAssessment',
      'personalHygiene.batheClean', 'personalHygiene.washHands', 'personalHygiene.brushTeeth', 'personalHygiene.useToilet', 'personalHygiene.personalGrooming', 'personalHygieneComments',
      'householdChores.washClothes', 'householdChores.ironClothes', 'householdChores.cleanToilet', 'householdChores.cleanFloors', 'householdChores.makeBed', 'householdChores.sew', 'householdChores.garden', 'householdChoresComments',
      'personalHealth.describeSymptoms', 'personalHealth.understandsChronicHealth', 'personalHealth.administerMedication', 'personalHealth.firstAid', 'personalHealth.manageMenstruation', 'chronicHealthNA', 'personalHealthComments',
      'communitySkills.publicTransport', 'communitySkills.makePurchase', 'communitySkills.avoidDanger', 'communitySkills.usePhone', 'communitySkills.chooseClothing', 'communitySkillsComments',
      'foodPrep.cookMeals', 'foodPrep.useBrazier', 'foodPrep.useElectricStove', 'foodPrep.storeFood', 'foodPrep.useKitchenTools', 'foodPrep.cleanDishes', 'foodPrep.cleanKitchen', 'foodPrepComments',
      'motheringSkills.changeDiapers', 'motheringSkills.clotheBaby', 'motheringSkills.playWithBaby', 'motheringSkills.ageAppropriateItems', 'motheringSkills.identifySickness', 'motheringSkills.attentiveToCrying', 'motheringSkills.trySolutions',
      'cprTraining',
      'motheringSkillsAdvanced.batheBaby', 'motheringSkillsAdvanced.swaddleBaby', 'motheringSkillsAdvanced.maintainSchedule', 'motheringSkillsAdvanced.useBreastPump', 'motheringSkillsAdvanced.storeBreastMilk', 'motheringSkillsAdvanced.prepareBabyFood', 'motheringSkillsComments',
      'goals.personalHygiene', 'goals.personalHealth', 'goals.householdChores', 'goals.communitySkills', 'goals.foodPrep', 'goals.motheringSkills',
      'nextAssessmentDate',
      'socialWorkerName', 'socialWorkerSignature', 'houseMotherName', 'houseMotherSignature', 'houseMother2Name', 'houseMother2Signature',
      'childFirstName', 'childSurname', 'dateOfBirth'
    ],
    mapRow: (row) => {
      const data = {};
      const get = (key, def = '') => row[key] || def;

      // Top level fields
      ['girlName', 'girlAge', 'grade', 'dateOfAdmission', 'babyAge', 'dateOfAssessment', 'personalHygieneComments', 'householdChoresComments', 'chronicHealthNA', 'personalHealthComments', 'communitySkillsComments', 'foodPrepComments', 'cprTraining', 'motheringSkillsComments', 'nextAssessmentDate', 'socialWorkerName', 'socialWorkerSignature', 'houseMotherName', 'houseMotherSignature', 'houseMother2Name', 'houseMother2Signature', 'childFirstName', 'childSurname', 'dateOfBirth'].forEach(f => {
        if (row[f] !== undefined) data[f] = row[f];
      });

      data.personalHygiene = {};
      ['batheClean', 'washHands', 'brushTeeth', 'useToilet', 'personalGrooming'].forEach(k => data.personalHygiene[k] = get(`personalHygiene.${k}`));

      data.householdChores = {};
      ['washClothes', 'ironClothes', 'cleanToilet', 'cleanFloors', 'makeBed', 'sew', 'garden'].forEach(k => data.householdChores[k] = get(`householdChores.${k}`));

      data.personalHealth = {};
      ['describeSymptoms', 'understandsChronicHealth', 'administerMedication', 'firstAid', 'manageMenstruation'].forEach(k => data.personalHealth[k] = get(`personalHealth.${k}`));

      data.communitySkills = {};
      ['publicTransport', 'makePurchase', 'avoidDanger', 'usePhone', 'chooseClothing'].forEach(k => data.communitySkills[k] = get(`communitySkills.${k}`));

      data.foodPrep = {};
      ['cookMeals', 'useBrazier', 'useElectricStove', 'storeFood', 'useKitchenTools', 'cleanDishes', 'cleanKitchen'].forEach(k => data.foodPrep[k] = get(`foodPrep.${k}`));

      data.motheringSkills = {};
      ['changeDiapers', 'clotheBaby', 'playWithBaby', 'ageAppropriateItems', 'identifySickness', 'attentiveToCrying', 'trySolutions'].forEach(k => data.motheringSkills[k] = get(`motheringSkills.${k}`));

      data.motheringSkillsAdvanced = {};
      ['batheBaby', 'swaddleBaby', 'maintainSchedule', 'useBreastPump', 'storeBreastMilk', 'prepareBabyFood'].forEach(k => data.motheringSkillsAdvanced[k] = get(`motheringSkillsAdvanced.${k}`));

      data.goals = {};
      ['personalHygiene', 'personalHealth', 'householdChores', 'communitySkills', 'foodPrep', 'motheringSkills'].forEach(k => data.goals[k] = get(`goals.${k}`));

      return data;
    }
  },
  'care-plan-summary': {
    name: 'Care Plan Summary',
    fields: [
      'nameOfGirl', 'girlCurrentAge', 'currentGrade', 'dateOfAssessment', 'yearsInTKP', 'monthsInTKP', 'assessmentType',
      'childFirstName', 'childSurname', 'dateOfBirth',
      'girlAgeTwoYears', 'babyAgeTwoYears',
      'recommendedGuardianName', 'recommendedGuardianRelation', 'guardianRationale', 'primaryCaregiver', 'primaryCaregiverDescription',
      'familyCapacity', 'familyCapacityDescription',
      'familyFinancialSupport', 'familyReliantOnTKPTrade',
      'familyWillingToCare', 'familySupportFuture', 'familyWillingnessDescription',
      'familyRelocating', 'relocationDestination', 'currentLocation', 'girlPhysicalSafetyConcerns', 'babyPhysicalSafetyConcerns', 'homePhysicallySafe',
      'peopleSafetyConcern', 'peopleSafetyConcernDescription', 'perpetratorInArea', 'perpetratorStatus', 'perpetratorThreat', 'perpetratorThreatDescription',
      'pathway', 'yearsToGrade12', 'gradeAfterTKP', 'familySupportEducation', 'tradeSkill', 'tradeHindrances',
      'familySupportMeasures', 'homePhysicalMeasures', 'homeSocialMeasures', 'needsFamilyTracing', 'familyTracingDescription',
      'programGoals.academicsLiteracy.goal', 'programGoals.academicsLiteracy.isCritical',
      'programGoals.counseling.goal', 'programGoals.counseling.isCritical',
      'programGoals.familyEmpowerment.goal', 'programGoals.familyEmpowerment.isCritical',
      'programGoals.householdParenting.goal', 'programGoals.householdParenting.isCritical',
      'programGoals.medical.goal', 'programGoals.medical.isCritical',
      'programGoals.vocationalTrade.goal', 'programGoals.vocationalTrade.isCritical',
      'reassessmentMonth', 'reassessmentYear',
      'socialWorkerName', 'socialWorkerSignature', 'supervisorName', 'supervisorSignature', 'counsellorName', 'counsellorSignature', 'girlName', 'girlSignature'
    ],
    mapRow: (row) => {
      const data = {};
      const get = (key, def = '') => row[key] || def;
      
      const directFields = [
        'nameOfGirl', 'girlCurrentAge', 'currentGrade', 'dateOfAssessment', 'yearsInTKP', 'monthsInTKP', 'assessmentType',
        'childFirstName', 'childSurname', 'dateOfBirth',
        'girlAgeTwoYears', 'babyAgeTwoYears',
        'recommendedGuardianName', 'recommendedGuardianRelation', 'guardianRationale', 'primaryCaregiver', 'primaryCaregiverDescription',
        'familyCapacity', 'familyCapacityDescription',
        'familyFinancialSupport', 'familyReliantOnTKPTrade',
        'familyWillingToCare', 'familySupportFuture', 'familyWillingnessDescription',
        'familyRelocating', 'relocationDestination', 'currentLocation', 'girlPhysicalSafetyConcerns', 'babyPhysicalSafetyConcerns', 'homePhysicallySafe',
        'peopleSafetyConcern', 'peopleSafetyConcernDescription', 'perpetratorInArea', 'perpetratorStatus', 'perpetratorThreat', 'perpetratorThreatDescription',
        'pathway', 'yearsToGrade12', 'gradeAfterTKP', 'familySupportEducation', 'tradeSkill', 'tradeHindrances',
        'familySupportMeasures', 'homePhysicalMeasures', 'homeSocialMeasures', 'needsFamilyTracing', 'familyTracingDescription',
        'reassessmentMonth', 'reassessmentYear',
        'socialWorkerName', 'socialWorkerSignature', 'supervisorName', 'supervisorSignature', 'counsellorName', 'counsellorSignature', 'girlName', 'girlSignature'
      ];

      directFields.forEach(field => {
        if (row[field] !== undefined) data[field] = row[field];
      });

      data.programGoals = {
        academicsLiteracy: { goal: get('programGoals.academicsLiteracy.goal'), isCritical: get('programGoals.academicsLiteracy.isCritical') === 'true' || get('programGoals.academicsLiteracy.isCritical') === true },
        counseling: { goal: get('programGoals.counseling.goal'), isCritical: get('programGoals.counseling.isCritical') === 'true' || get('programGoals.counseling.isCritical') === true },
        familyEmpowerment: { goal: get('programGoals.familyEmpowerment.goal'), isCritical: get('programGoals.familyEmpowerment.isCritical') === 'true' || get('programGoals.familyEmpowerment.isCritical') === true },
        householdParenting: { goal: get('programGoals.householdParenting.goal'), isCritical: get('programGoals.householdParenting.isCritical') === 'true' || get('programGoals.householdParenting.isCritical') === true },
        medical: { goal: get('programGoals.medical.goal'), isCritical: get('programGoals.medical.isCritical') === 'true' || get('programGoals.medical.isCritical') === true },
        vocationalTrade: { goal: get('programGoals.vocationalTrade.goal'), isCritical: get('programGoals.vocationalTrade.isCritical') === 'true' || get('programGoals.vocationalTrade.isCritical') === true },
      };

      return data;
    }
  },
  'life-skills-survey': {
    name: 'Life Skills Survey',
    fields: [
      'nameOfGirl', 'girlAge', 'grade', 'dateOfAdmission', 'babyAge', 'dateOfAssessment',
      'personalHygiene.batheClean', 'personalHygiene.washHands', 'personalHygiene.brushTeeth', 'personalHygiene.useToilet', 'personalHygiene.personalGrooming', 'personalHygiene.comments',
      'householdChores.washClothes', 'householdChores.ironClothes', 'householdChores.cleanToilet', 'householdChores.cleanFloors', 'householdChores.makeBed', 'householdChores.sew', 'householdChores.garden', 'householdChores.comments',
      'personalHealth.describeSymptoms', 'personalHealth.chronicHealthStatus', 'personalHealth.administerMedication', 'personalHealth.firstAid', 'personalHealth.manageMenstruation', 'personalHealth.comments',
      'communitySkills.publicTransport', 'communitySkills.makePurchase', 'communitySkills.avoidDanger', 'communitySkills.usePhone', 'communitySkills.chooseClothing', 'communitySkills.comments',
      'foodPrepSkills.cookMeals', 'foodPrepSkills.useBrazier', 'foodPrepSkills.useElectricStove', 'foodPrepSkills.storeFood', 'foodPrepSkills.useKitchenTools', 'foodPrepSkills.cleanDishes', 'foodPrepSkills.cleanKitchen', 'foodPrepSkills.comments',
      'motheringSkills.changeDiapers', 'motheringSkills.clotheBaby', 'motheringSkills.playWithBaby', 'motheringSkills.ageAppropriateItems', 'motheringSkills.identifySickness', 'motheringSkills.attentiveToCrying', 'motheringSkills.trySolutions', 'motheringSkills.cprFirstAidTraining', 
      'motheringSkills.batheBaby', 'motheringSkills.swaddleBaby', 'motheringSkills.maintainSchedule', 'motheringSkills.useBreastPump', 'motheringSkills.storeBreastMilk', 'motheringSkills.prepareBabyFood', 'motheringSkills.comments',
      'goals.personalHygiene', 'goals.personalHealth', 'goals.householdChores', 'goals.communitySkills', 'goals.foodPrepSkills', 'goals.motheringSkills'
    ],
    mapRow: (row) => {
      const data = {};
      const get = (key, def = '') => row[key] || def;

      ['nameOfGirl', 'girlAge', 'grade', 'dateOfAdmission', 'babyAge', 'dateOfAssessment'].forEach(f => {
        if (row[f] !== undefined) data[f] = row[f];
      });

      data.personalHygiene = {};
      ['batheClean', 'washHands', 'brushTeeth', 'useToilet', 'personalGrooming', 'comments'].forEach(k => data.personalHygiene[k] = get(`personalHygiene.${k}`));

      data.householdChores = {};
      ['washClothes', 'ironClothes', 'cleanToilet', 'cleanFloors', 'makeBed', 'sew', 'garden', 'comments'].forEach(k => data.householdChores[k] = get(`householdChores.${k}`));

      data.personalHealth = {};
      ['describeSymptoms', 'chronicHealthStatus', 'administerMedication', 'firstAid', 'manageMenstruation', 'comments'].forEach(k => data.personalHealth[k] = get(`personalHealth.${k}`));

      data.communitySkills = {};
      ['publicTransport', 'makePurchase', 'avoidDanger', 'usePhone', 'chooseClothing', 'comments'].forEach(k => data.communitySkills[k] = get(`communitySkills.${k}`));

      data.foodPrepSkills = {};
      ['cookMeals', 'useBrazier', 'useElectricStove', 'storeFood', 'useKitchenTools', 'cleanDishes', 'cleanKitchen', 'comments'].forEach(k => data.foodPrepSkills[k] = get(`foodPrepSkills.${k}`));

      data.motheringSkills = {};
      ['changeDiapers', 'clotheBaby', 'playWithBaby', 'ageAppropriateItems', 'identifySickness', 'attentiveToCrying', 'trySolutions', 'cprFirstAidTraining', 'batheBaby', 'swaddleBaby', 'maintainSchedule', 'useBreastPump', 'storeBreastMilk', 'prepareBabyFood', 'comments'].forEach(k => data.motheringSkills[k] = get(`motheringSkills.${k}`));

      data.goals = {};
      ['personalHygiene', 'personalHealth', 'householdChores', 'communitySkills', 'foodPrepSkills', 'motheringSkills'].forEach(k => data.goals[k] = get(`goals.${k}`));

      return data;
    }
  },
  'psychological-assessment': {
    name: 'Psychological Assessment',
    fields: [
      'childName', 'dateOfAssessment', 'dateOfAdmission', 'dateOfReintegration', 'assessmentType',
      'assessmentsGiven.adnm', 'assessmentsGiven.mentalStatus', 'assessmentsGiven.catsPtsd', 'assessmentsGiven.ptgi', 'assessmentsGiven.rosenberg', 'assessmentsGiven.sdq',
      'rosenbergSelfEsteem.score', 'rosenbergSelfEsteem.interpretation',
      'adnm.preoccupations', 'adnm.failureToAdapt', 'adnm.avoidance', 'adnm.depressedMood', 'adnm.anxiety', 'adnm.impulseDisturbance', 'adnm.sumScore', 'adnm.interpretation',
      'sdq.emotionalProblems', 'sdq.conductProblems', 'sdq.hyperactivity', 'sdq.peerProblems', 'sdq.prosocialExternalizing', 'sdq.prosocialInternalizing', 'sdq.totalDifficulties', 'sdq.categories', 'sdq.interpretation',
      'catsPtsd.category', 'catsPtsd.score', 'catsPtsd.interpretation',
      'ptgi.personalStrength', 'ptgi.newPossibilities', 'ptgi.improvedRelationships', 'ptgi.spiritualGrowth', 'ptgi.appreciationOfLife', 'ptgi.areasOfCelebration', 'ptgi.areasOfGrowth', 'ptgi.contributingFactors', 'ptgi.adjustmentAreas',
      'clinicalObservation.mentalStatusSummary', 'clinicalObservation.treatmentPlan', 'clinicalObservation.reportSummary', 'clinicalObservation.reintegrationRecommendation',
      'assessorName', 'signatureDate'
    ],
    mapRow: (row) => {
      const data = {};
      const get = (key, def = '') => row[key] || def;
      const getBool = (key) => row[key] === 'true' || row[key] === true;

      ['childName', 'dateOfAssessment', 'dateOfAdmission', 'dateOfReintegration', 'assessmentType', 'assessorName', 'signatureDate'].forEach(f => {
        if (row[f] !== undefined) data[f] = row[f];
      });

      data.assessmentsGiven = {
        adnm: getBool('assessmentsGiven.adnm'),
        mentalStatus: getBool('assessmentsGiven.mentalStatus'),
        catsPtsd: getBool('assessmentsGiven.catsPtsd'),
        ptgi: getBool('assessmentsGiven.ptgi'),
        rosenberg: getBool('assessmentsGiven.rosenberg'),
        sdq: getBool('assessmentsGiven.sdq')
      };

      data.rosenbergSelfEsteem = {
        score: get('rosenbergSelfEsteem.score'),
        interpretation: get('rosenbergSelfEsteem.interpretation')
      };

      data.adnm = {};
      ['preoccupations', 'failureToAdapt', 'avoidance', 'depressedMood', 'anxiety', 'impulseDisturbance', 'sumScore', 'interpretation'].forEach(k => data.adnm[k] = get(`adnm.${k}`));

      data.sdq = {};
      ['emotionalProblems', 'conductProblems', 'hyperactivity', 'peerProblems', 'prosocialExternalizing', 'prosocialInternalizing', 'totalDifficulties', 'categories', 'interpretation'].forEach(k => data.sdq[k] = get(`sdq.${k}`));

      data.catsPtsd = {
        category: get('catsPtsd.category'),
        score: get('catsPtsd.score'),
        interpretation: get('catsPtsd.interpretation')
      };

      data.ptgi = {};
      ['personalStrength', 'newPossibilities', 'improvedRelationships', 'spiritualGrowth', 'appreciationOfLife', 'areasOfCelebration', 'areasOfGrowth', 'contributingFactors', 'adjustmentAreas'].forEach(k => data.ptgi[k] = get(`ptgi.${k}`));

      data.clinicalObservation = {};
      ['mentalStatusSummary', 'treatmentPlan', 'reportSummary', 'reintegrationRecommendation'].forEach(k => data.clinicalObservation[k] = get(`clinicalObservation.${k}`));

      return data;
    }
  },
  'general': {
    name: 'General Outreach',
    fields: ['childName', 'caseId', 'status', 'date', 'orgUnit', 'notes'],
    mapRow: (row) => {
      const data = {};
      Object.keys(row).forEach(key => {
        if (key !== 'formType') data[key] = row[key];
      });
      return data;
    }
  }
};

const availableFormTypes = computed(() => {
  return Object.keys(formSchemas).map(key => ({
    id: key,
    name: formSchemas[key].name
  }));
});

const getModuleTitle = (module) => {
  const titles = {
    'metadata-import': 'Metadata Import',
    'data-import': 'Data Import',
    'event-import': 'Event Import',
    'metadata-export': 'Metadata Export',
    'data-export': 'Data Export',
    'event-export': 'Event Export'
  };
  return titles[module] || 'Import/Export';
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) selectedFile.value = file;
};

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) selectedFile.value = file;
};

const downloadTemplate = () => {
  const formType = importSettings.value.targetFormType || 'general';
  const schema = formSchemas[formType];
  
  if (!schema) {
    error("Please select a form type to download template");
    return;
  }

  // Create a sample row with empty values
  const headers = schema.fields;
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  
  XLSX.writeFile(wb, `${formType}_template.xlsx`);
  success(`Template for ${schema.name} downloaded`);
};

const performImport = async () => {
  if (!selectedFile.value) return;

  importSummary.value = null;
  
  try {
    const file = selectedFile.value;
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          throw new Error("No data found in the Excel file");
        }

        let importedCount = 0;
        let errorCount = 0;

        for (const row of jsonData) {
          try {
            // Determine form type:
            // 1. From Excel column 'formType'
            // 2. From selected dropdown
            // 3. Default to 'general'
            const rowFormTypeKey = Object.keys(row).find(k => k.toLowerCase().replace(/\s/g, '') === 'formtype');
            let formType = rowFormTypeKey ? row[rowFormTypeKey] : null;
            
            if (!formType) {
               formType = importSettings.value.targetFormType || 'general';
            }

            // Normalize formType to match schema keys if possible
            // (Simple check: if it matches a name, use the key)
            const schemaKey = Object.keys(formSchemas).find(k => 
              k === formType || formSchemas[k].name === formType
            ) || 'general';

            const newForm = EnhancedOutreachService.createFormTemplate(schemaKey);
            const schema = formSchemas[schemaKey];

            // Standard mapping for top-level fields
            const standardFields = ['childname', 'caseid', 'status', 'createdat', 'orgunit'];
            
            // Map standard fields first
            Object.keys(row).forEach(key => {
              const normalizedKey = key.toLowerCase().replace(/\s/g, '');
              const value = row[key];

              if (normalizedKey === 'childname') newForm.childName = value;
              else if (normalizedKey === 'caseid') newForm.caseId = value;
              else if (normalizedKey === 'status') newForm.status = value.toLowerCase();
              else if (normalizedKey === 'createdat' || normalizedKey === 'date') newForm.createdAt = new Date(value).toISOString();
              else if (normalizedKey === 'orgunit') newForm.orgUnit = value;
            });

            // Use schema mapping if available
            if (schema && schema.mapRow) {
              newForm.data = schema.mapRow(row);
            } else {
              // Fallback: dump everything not standard into data
              Object.keys(row).forEach(key => {
                const normalizedKey = key.toLowerCase().replace(/\s/g, '');
                if (!standardFields.includes(normalizedKey) && normalizedKey !== 'formtype') {
                  newForm.data[key] = row[key];
                }
              });
            }

            // Special handling for Initial Referral Form fields if they are at root level in schema but need to be in data
            // (The createFormTemplate puts most things in 'data', so the above loop handles it correctly)

            await EnhancedOutreachService.saveFormLocally(newForm);
            await EnhancedOutreachService.syncForm(newForm);
            
            importedCount++;
          } catch (err) {
            console.error("Error processing row:", err);
            errorCount++;
          }
        }

        importSummary.value = {
          status: 'success',
          message: `Import completed. Processed ${jsonData.length} rows.`,
          details: {
            imported: importedCount,
            updated: 0,
            ignored: errorCount
          }
        };
        
        if (errorCount > 0) {
          info(`Imported ${importedCount} records with ${errorCount} errors.`);
        } else {
          success(`Successfully imported ${importedCount} records.`);
        }

      } catch (err) {
        console.error("Error parsing Excel:", err);
        error("Failed to parse Excel file: " + err.message);
        importSummary.value = {
          status: 'error',
          message: 'Parsing failed: ' + err.message
        };
      }
    };

    reader.readAsArrayBuffer(file);
    
  } catch (err) {
    error("Import failed: " + err.message);
    importSummary.value = {
      status: 'error',
      message: 'Import failed: ' + err.message
    };
  }
};

const performExport = async () => {
  try {
    let dataToExport = null;
    let filename = 'export';

    if (activeModule.value === 'metadata-export') {
      dataToExport = {
        programs: [
          { id: 'child-care', name: 'Child Care Program' },
          { id: 'medical', name: 'Medical Support' }
        ],
        orgUnits: [
          { id: 'lusaka', name: 'Lusaka District' }
        ]
      };
      filename = 'metadata_export';
    } else if (activeModule.value === 'data-export' || activeModule.value === 'event-export') {
      const forms = await EnhancedOutreachService.getAllForms();
      
      let filteredForms = forms;
      if (exportSettings.value.startDate) {
        filteredForms = filteredForms.filter(f => new Date(f.createdAt) >= new Date(exportSettings.value.startDate));
      }
      if (exportSettings.value.endDate) {
        filteredForms = filteredForms.filter(f => new Date(f.createdAt) <= new Date(exportSettings.value.endDate));
      }
      if (exportSettings.value.orgUnit !== 'all') {
        filteredForms = filteredForms.filter(f => f.orgUnit === exportSettings.value.orgUnit);
      }

      // Flatten data for CSV export
      if (exportSettings.value.format === 'csv') {
        dataToExport = filteredForms.map(f => {
          const { data, ...rest } = f;
          return { ...rest, ...data };
        });
      } else {
        dataToExport = filteredForms;
      }
      
      filename = activeModule.value === 'data-export' ? 'data_export' : 'event_export';
    }

    if (!dataToExport || (Array.isArray(dataToExport) && dataToExport.length === 0)) {
      error("No data to export");
      return;
    }

    let content = '';
    let mimeType = '';

    if (exportSettings.value.format === 'json') {
      content = JSON.stringify(dataToExport, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    } else if (exportSettings.value.format === 'csv') {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Export");
      XLSX.writeFile(wb, `${filename}.csv`);
      success("Export started");
      return; // XLSX handles download
    } else {
      content = '<root>XML Export Not Implemented</root>';
      mimeType = 'application/xml';
      filename += '.xml';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    success("Export started");

  } catch (err) {
    error("Export failed: " + err.message);
  }
};
</script>

<style scoped>
.dhis2-app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f5f7;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  color: #212121;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-section {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.section-header {
  padding: 0 16px 8px;
}

.section-header h3 {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #616161;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #494949;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #212121;
}

.nav-item.active {
  background: #e8f4f8;
  color: #2b6693;
  border-left-color: #2b6693;
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  text-align: center;
  font-size: 1rem;
}

/* Main Workspace */
.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f3f5f7;
  overflow-y: auto;
  padding: 24px;
}

.workspace-header {
  margin-bottom: 24px;
}

.module-title {
  margin: 0;
  font-size: 1.5rem;
  color: #2b6693;
  font-weight: 400;
}

.workspace-content {
  max-width: 800px;
}

.module-content {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.info-box {
  display: flex;
  gap: 12px;
  background: #e3f2fd;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 24px;
  color: #0d47a1;
}

.info-box i {
  font-size: 1.2rem;
  margin-top: 2px;
}

.info-box p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #494949;
  font-weight: 500;
}

.dhis2-select,
.dhis2-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  font-size: 0.9rem;
  color: #212121;
  background: white;
}

.dhis2-select:focus,
.dhis2-input:focus {
  border-color: #2b6693;
  outline: none;
  box-shadow: 0 0 0 2px rgba(43, 102, 147, 0.1);
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #d5d5d5;
  border-radius: 4px;
  padding: 32px;
  text-align: center;
  transition: all 0.2s;
  background: #fafafa;
}

.file-upload-area:hover {
  border-color: #2b6693;
  background: #f0f7fc;
}

.upload-placeholder {
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 3rem;
  color: #bdbdbd;
  margin-bottom: 12px;
}

.upload-placeholder p {
  margin: 0;
  color: #757575;
  font-size: 0.9rem;
}

.file-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #2b6693;
  font-weight: 500;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ef4444;
  padding: 4px;
}

/* Radio & Checkbox */
.radio-group,
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #212121;
  cursor: pointer;
}

/* Action Bar */
.action-bar {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.dhis2-btn {
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 3px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.dhis2-btn.primary {
  background: #2b6693;
  color: white;
}

.dhis2-btn.primary:hover {
  background: #1d4260;
}

.dhis2-btn:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

/* Summary */
.import-summary {
  margin-top: 24px;
}

.import-summary h3 {
  font-size: 1.1rem;
  color: #212121;
  margin-bottom: 12px;
}

.summary-card {
  background: white;
  border-radius: 4px;
  padding: 16px;
  border-left: 4px solid transparent;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.summary-card.success {
  border-left-color: #4caf50;
}

.summary-card.error {
  border-left-color: #f44336;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  margin-bottom: 12px;
}

.summary-card.success .summary-header { color: #2e7d32; }
.summary-card.error .summary-header { color: #c62828; }

.summary-details {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 0.8rem;
  color: #757575;
  text-transform: uppercase;
}

.detail-item .value {
  font-size: 1.2rem;
  font-weight: 500;
  color: #212121;
}

.form-row-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.form-row-actions .dhis2-select {
  flex: 1;
}

.help-text {
  display: block;
  margin-top: 6px;
  color: #757575;
  font-size: 0.85rem;
}

.dhis2-btn.secondary {
  background: white;
  border: 1px solid #d5d5d5;
  color: #494949;
}

.dhis2-btn.secondary:hover {
  background: #f5f5f5;
  border-color: #a0a0a0;
}

@media (max-width: 768px) {
  .app-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #d5d5d5;
    display: none; /* Hide sidebar on mobile by default */
  }

  .form-row-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .summary-details {
    flex-direction: column;
    gap: 12px;
  }

  .dhis2-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
