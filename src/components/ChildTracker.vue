<template>
  <div class="child-tracker-container">
    <!-- Main Child Tracker View -->
    <div
      v-if="
        !showMedicalIntakeForm &&
        !showAcademicsLiteracyForm &&
        !showPsychologicalAssessmentForm &&
        !showLifeSkillsSurveyForm &&
        !showBirthDeliveryForm &&
        !showCarePlanSummaryForm &&
        !showCarePlanBabyForm &&
        !showCarePlanOngoingLifeSkillsForm &&
        !showEditForm
      "
      class="tracker-main-view"
    >
      <!-- Header -->
      <div class="tracker-header">
        <div class="header-left">
          <button @click="goBack" class="back-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="m19 12H5" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        <div class="header-center">
          <h1 class="tracker-title">
            {{
              showOnlyComplete
                ? "In Housed Girls - Complete Forms Only"
                : "Child Tracker - All Girls"
            }}
          </h1>
        </div>
        <div class="header-right">
          <button @click="handleLogout" class="logout-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats-section">
        <div class="stat-card">
          <div class="stat-number">{{ totalChildren }}</div>
          <div class="stat-label">Children Tracked</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ activeChildren }}</div>
          <div class="stat-label">Active Cases</div>
        </div>
        <!-- Medical Intake Forms Button - Only shows in "In Housed Girls" view -->
        <div v-if="showOnlyComplete" class="stat-card action-card">
          <button @click="goToMedicalIntakeForms" class="medical-intake-btn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <span>Medical Intake Forms</span>
          </button>
        </div>
        <!-- Academics & Literacy Button - Only shows in "In Housed Girls" view -->
        <div
          v-if="showOnlyComplete"
          class="stat-card action-card academics-card"
        >
          <button
            @click="goToAcademicsLiteracyForm"
            class="academics-literacy-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
              />
            </svg>
            <span>Academics & Literacy</span>
          </button>
        </div>
        <!-- Psychological Assessment Button - Only shows in "In Housed Girls" view -->
        <div
          v-if="showOnlyComplete"
          class="stat-card action-card psychological-card"
        >
          <button
            @click="goToPsychologicalAssessmentForm"
            class="psychological-assessment-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>Psychological Assessment</span>
          </button>
        </div>
        <!-- Life Skills Survey Button - Only shows in "In Housed Girls" view -->
        <div
          v-if="showOnlyComplete"
          class="stat-card action-card life-skills-card"
        >
          <button
            @click="goToLifeSkillsSurveyForm"
            class="life-skills-survey-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path
                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
              />
            </svg>
            <span>Life Skills Survey</span>
          </button>
        </div>
        <!-- Birth and Delivery Button - Only shows in "In Housed Girls" view -->
        <div
          v-if="showOnlyComplete"
          class="stat-card action-card birth-delivery-card"
        >
          <button @click="goToBirthDeliveryForm" class="birth-delivery-btn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Birth & Delivery</span>
          </button>
        </div>
        <!-- Care Plan Summary Button - Only shows in "In Housed Girls" view -->
        <div
          v-if="showOnlyComplete"
          class="stat-card action-card care-plan-card"
        >
          <button
            @click="goToCarePlanSummaryForm"
            class="care-plan-summary-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span>Care Plan Summary</span>
          </button>
        </div>
        <!-- Care Plan Baby Button - Only shows in "In Housed Girls" view -->
        <div
          v-if="showOnlyComplete"
          class="stat-card action-card care-plan-baby-card"
        >
          <button @click="goToCarePlanBabyForm" class="care-plan-baby-btn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Care Plan (Baby)</span>
          </button>
        </div>
        <!-- Care Plan Ongoing Life Skills Button - Only shows in "In Housed Girls" view -->
        <div
          v-if="showOnlyComplete"
          class="stat-card action-card care-plan-ongoing-card"
        >
          <button
            @click="goToCarePlanOngoingLifeSkillsForm"
            class="care-plan-ongoing-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path
                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
              />
            </svg>
            <span>Ongoing Life Skills</span>
          </button>
        </div>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <div class="search-header">
          <h3>🔍 Search Child</h3>
          <div class="search-stats">
            <span class="stat-item">
              <strong>{{ totalChildren }}</strong> Children Tracked
            </span>
            <span class="stat-item">
              <strong>{{ activeChildren }}</strong> Active Cases
            </span>
          </div>
        </div>

        <div class="search-form">
          <div class="search-inputs">
            <div class="form-group">
              <label>Search by Child ID</label>
              <input
                v-model="searchId"
                type="text"
                placeholder="e.g., JOHN03252TO001"
                class="search-input"
                @input="searchChildren"
              />
            </div>
            <div class="form-group">
              <label>Search by Name</label>
              <input
                v-model="searchName"
                type="text"
                placeholder="Enter first or last name"
                class="search-input"
                @input="searchChildren"
              />
            </div>
            <div class="form-group">
              <label>Filter by Age Range</label>
              <select
                v-model="ageFilter"
                @change="searchChildren"
                class="search-select"
              >
                <option value="">All Ages</option>
                <option value="0-12">0-12 years</option>
                <option value="13-15">13-15 years</option>
                <option value="16-18">16-18 years</option>
              </select>
            </div>
            <div class="form-group">
              <label>Filter by Location</label>
              <select
                v-model="locationFilter"
                @change="searchChildren"
                class="search-select"
              >
                <option value="">All Locations</option>
                <option value="lusaka">Lusaka</option>
                <option value="chongwe">Chongwe</option>
                <option value="kafue">Kafue</option>
              </select>
            </div>
          </div>
          <div class="search-actions">
            <button @click="clearSearch" class="clear-btn">Clear Search</button>
            <button
              @click="exportData"
              class="export-btn"
              :disabled="filteredChildren.length === 0"
            >
              Export Results
            </button>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="results-section">
        <div class="results-header">
          <h3>Search Results</h3>
          <span class="results-count"
            >{{ filteredChildren.length }} children found</span
          >
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading children data...</p>
        </div>

        <!-- No Results -->
        <div
          v-else-if="filteredChildren.length === 0 && !loading"
          class="no-results"
        >
          <div class="no-results-icon">👥</div>
          <h4>No children found</h4>
          <p v-if="hasSearchCriteria">Try adjusting your search criteria</p>
          <p v-else>No children have been registered yet</p>
        </div>

        <!-- Results List -->
        <div v-else class="children-list">
          <div
            v-for="child in paginatedChildren"
            :key="child.id"
            class="child-card"
            @click="viewChildDetails(child)"
          >
            <div class="child-header">
              <div class="child-id">
                <span class="id-label">ID:</span>
                <span class="id-value">{{ child.uniqueId }}</span>
              </div>
              <div class="child-status" :class="child.status">
                {{ child.status }}
              </div>
            </div>

            <div class="child-info">
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">👤 Name:</span>
                  <span class="info-value">{{ child.fullName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">⚥ Gender:</span>
                  <span class="info-value">{{ child.gender }}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">🎂 Age:</span>
                  <span class="info-value">{{ child.age }} years</span>
                </div>
                <div class="info-item">
                  <span class="info-label">📍 Location:</span>
                  <span class="info-value">{{ child.location }}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">🏛️ Tribe:</span>
                  <span class="info-value">{{
                    child.tribe || "Not specified"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">📅 Date Added:</span>
                  <span class="info-value">{{
                    formatDate(child.createdAt)
                  }}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="info-item full-width">
                  <span class="info-label">📋 Form Type:</span>
                  <span class="info-value form-type">{{ child.formType }}</span>
                </div>
              </div>
            </div>

            <div class="child-actions">
              <button
                @click.stop="viewChildDetails(child)"
                class="action-btn view"
              >
                View Details
              </button>
              <button
                v-if="showOnlyComplete"
                @click.stop="viewChildForms(child)"
                class="action-btn forms"
              >
                Manage Forms
              </button>
              <button @click.stop="editChild(child)" class="action-btn edit">
                Edit
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredChildren.length > pageSize"
          class="pagination-container"
        >
          <Pagination
            :current-page="currentPage"
            :total-items="filteredChildren.length"
            :page-size="pageSize"
            @page-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>

      <!-- Child Forms Management Modal -->
      <div
        v-if="selectedChild?.showFormsManagement"
        class="modal-overlay"
        @click="closeFormsManagement"
      >
        <div class="modal-content forms-management-modal" @click.stop>
          <div class="modal-header">
            <h3>Manage Forms for {{ selectedChild.fullName }}</h3>
            <button @click="closeFormsManagement" class="close-btn">
              &times;
            </button>
          </div>

          <div class="modal-body">
            <div class="child-info-summary">
              <p><strong>Child ID:</strong> {{ selectedChild.uniqueId }}</p>
              <p><strong>Age:</strong> {{ selectedChild.age }} years</p>
              <p>
                <strong>Status:</strong>
                <span :class="['status-badge', selectedChild.status]">{{
                  selectedChild.status
                }}</span>
              </p>
            </div>

            <h4>Assessment Forms Progress</h4>
            <div class="forms-list">
              <div
                class="form-item"
                :class="{
                  completed: selectedChild.formTypes.includes('medical-intake'),
                }"
              >
                <div class="form-info">
                  <span class="form-number">1</span>
                  <div class="form-details">
                    <h5>Medical Intake Assessment</h5>
                    <p>Comprehensive medical assessment for child admission</p>
                  </div>
                </div>
                <div class="form-status">
                  <span
                    v-if="selectedChild.formTypes.includes('medical-intake')"
                    class="status-icon completed"
                    >✓</span
                  >
                  <span v-else class="status-icon pending">○</span>
                  <button
                    @click="goToMedicalIntakeForms(selectedChild)"
                    class="form-btn"
                    :class="{
                      'edit-btn':
                        selectedChild.formTypes.includes('medical-intake'),
                    }"
                  >
                    {{
                      selectedChild.formTypes.includes("medical-intake")
                        ? "View/Edit"
                        : "Start Form"
                    }}
                  </button>
                </div>
              </div>

              <div
                class="form-item"
                :class="{
                  completed:
                    selectedChild.formTypes.includes('academics-literacy'),
                }"
              >
                <div class="form-info">
                  <span class="form-number">2</span>
                  <div class="form-details">
                    <h5>Academics & Literacy Plan</h5>
                    <p>Educational assessment and planning</p>
                  </div>
                </div>
                <div class="form-status">
                  <span
                    v-if="
                      selectedChild.formTypes.includes('academics-literacy')
                    "
                    class="status-icon completed"
                    >✓</span
                  >
                  <span v-else class="status-icon pending">○</span>
                  <button
                    @click="goToAcademicsLiteracyForm(selectedChild)"
                    class="form-btn"
                    :class="{
                      'edit-btn':
                        selectedChild.formTypes.includes('academics-literacy'),
                    }"
                  >
                    {{
                      selectedChild.formTypes.includes("academics-literacy")
                        ? "View/Edit"
                        : "Start Form"
                    }}
                  </button>
                </div>
              </div>

              <div
                class="form-item"
                :class="{
                  completed: selectedChild.formTypes.includes(
                    'psychological-assessment'
                  ),
                }"
              >
                <div class="form-info">
                  <span class="form-number">3</span>
                  <div class="form-details">
                    <h5>Psychological Assessment</h5>
                    <p>Mental health and psychological evaluation</p>
                  </div>
                </div>
                <div class="form-status">
                  <span
                    v-if="
                      selectedChild.formTypes.includes(
                        'psychological-assessment'
                      )
                    "
                    class="status-icon completed"
                    >✓</span
                  >
                  <span v-else class="status-icon pending">○</span>
                  <button
                    @click="goToPsychologicalAssessmentForm(selectedChild)"
                    class="form-btn"
                    :class="{
                      'edit-btn': selectedChild.formTypes.includes(
                        'psychological-assessment'
                      ),
                    }"
                  >
                    {{
                      selectedChild.formTypes.includes(
                        "psychological-assessment"
                      )
                        ? "View/Edit"
                        : "Start Form"
                    }}
                  </button>
                </div>
              </div>

              <div
                class="form-item"
                :class="{
                  completed:
                    selectedChild.formTypes.includes('life-skills-survey'),
                }"
              >
                <div class="form-info">
                  <span class="form-number">4</span>
                  <div class="form-details">
                    <h5>Life Skills Survey</h5>
                    <p>Life skills assessment and development plan</p>
                  </div>
                </div>
                <div class="form-status">
                  <span
                    v-if="
                      selectedChild.formTypes.includes('life-skills-survey')
                    "
                    class="status-icon completed"
                    >✓</span
                  >
                  <span v-else class="status-icon pending">○</span>
                  <button
                    @click="goToLifeSkillsSurveyForm(selectedChild)"
                    class="form-btn"
                    :class="{
                      'edit-btn':
                        selectedChild.formTypes.includes('life-skills-survey'),
                    }"
                  >
                    {{
                      selectedChild.formTypes.includes("life-skills-survey")
                        ? "View/Edit"
                        : "Start Form"
                    }}
                  </button>
                </div>
              </div>

              <div
                class="form-item"
                :class="{
                  completed: selectedChild.formTypes.includes('birth-delivery'),
                }"
              >
                <div class="form-info">
                  <span class="form-number">5</span>
                  <div class="form-details">
                    <h5>Birth & Delivery Report</h5>
                    <p>Birth and delivery information</p>
                  </div>
                </div>
                <div class="form-status">
                  <span
                    v-if="selectedChild.formTypes.includes('birth-delivery')"
                    class="status-icon completed"
                    >✓</span
                  >
                  <span v-else class="status-icon pending">○</span>
                  <button
                    @click="goToBirthDeliveryForm(selectedChild)"
                    class="form-btn"
                    :class="{
                      'edit-btn':
                        selectedChild.formTypes.includes('birth-delivery'),
                    }"
                  >
                    {{
                      selectedChild.formTypes.includes("birth-delivery")
                        ? "View/Edit"
                        : "Start Form"
                    }}
                  </button>
                </div>
              </div>

              <div
                class="form-item"
                :class="{
                  completed:
                    selectedChild.formTypes.includes('care-plan-summary'),
                }"
              >
                <div class="form-info">
                  <span class="form-number">6</span>
                  <div class="form-details">
                    <h5>Care Plan Summary</h5>
                    <p>Individual care plan summary</p>
                  </div>
                </div>
                <div class="form-status">
                  <span
                    v-if="selectedChild.formTypes.includes('care-plan-summary')"
                    class="status-icon completed"
                    >✓</span
                  >
                  <span v-else class="status-icon pending">○</span>
                  <button
                    @click="goToCarePlanSummaryForm(selectedChild)"
                    class="form-btn"
                    :class="{
                      'edit-btn':
                        selectedChild.formTypes.includes('care-plan-summary'),
                    }"
                  >
                    {{
                      selectedChild.formTypes.includes("care-plan-summary")
                        ? "View/Edit"
                        : "Start Form"
                    }}
                  </button>
                </div>
              </div>

              <div
                class="form-item"
                :class="{
                  completed: selectedChild.formTypes.includes('care-plan-baby'),
                }"
              >
                <div class="form-info">
                  <span class="form-number">7</span>
                  <div class="form-details">
                    <h5>Care Plan (Baby)</h5>
                    <p>Baby care plan and tracking</p>
                  </div>
                </div>
                <div class="form-status">
                  <span
                    v-if="selectedChild.formTypes.includes('care-plan-baby')"
                    class="status-icon completed"
                    >✓</span
                  >
                  <span v-else class="status-icon pending">○</span>
                  <button
                    @click="goToCarePlanBabyForm(selectedChild)"
                    class="form-btn"
                    :class="{
                      'edit-btn':
                        selectedChild.formTypes.includes('care-plan-baby'),
                    }"
                  >
                    {{
                      selectedChild.formTypes.includes("care-plan-baby")
                        ? "View/Edit"
                        : "Start Form"
                    }}
                  </button>
                </div>
              </div>

              <div
                class="form-item"
                :class="{
                  completed: selectedChild.formTypes.includes(
                    'care-plan-ongoing-life-skills'
                  ),
                }"
              >
                <div class="form-info">
                  <span class="form-number">8</span>
                  <div class="form-details">
                    <h5>Ongoing Life Skills</h5>
                    <p>Ongoing life skills development tracking</p>
                  </div>
                </div>
                <div class="form-status">
                  <span
                    v-if="
                      selectedChild.formTypes.includes(
                        'care-plan-ongoing-life-skills'
                      )
                    "
                    class="status-icon completed"
                    >✓</span
                  >
                  <span v-else class="status-icon pending">○</span>
                  <button
                    @click="goToCarePlanOngoingLifeSkillsForm(selectedChild)"
                    class="form-btn"
                    :class="{
                      'edit-btn': selectedChild.formTypes.includes(
                        'care-plan-ongoing-life-skills'
                      ),
                    }"
                  >
                    {{
                      selectedChild.formTypes.includes(
                        "care-plan-ongoing-life-skills"
                      )
                        ? "View/Edit"
                        : "Start Form"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeFormsManagement" class="cancel-btn">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Child Details Modal -->
      <div
        v-if="selectedChild && !selectedChild.showFormsManagement"
        class="modal-overlay"
        @click="closeModal"
      >
        <div class="modal-content child-details-modal" @click.stop>
          <div class="modal-header">
            <h3>Child Details</h3>
            <button @click="closeModal" class="close-btn">&times;</button>
          </div>

          <div class="modal-body">
            <div class="child-details">
              <!-- Basic Information -->
              <div class="details-section">
                <h4>Basic Information</h4>
                <div class="details-grid">
                  <div class="detail-item">
                    <label>Unique ID:</label>
                    <span class="unique-id">{{ selectedChild.uniqueId }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Full Name:</label>
                    <span>{{ selectedChild.fullName }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedChild.otherName">
                    <label>Other Names:</label>
                    <span>{{ selectedChild.otherName }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedChild.customId">
                    <label>Custom ID:</label>
                    <span class="custom-id">{{ selectedChild.customId }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Gender:</label>
                    <span>{{ selectedChild.gender }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Age at Intake:</label>
                    <span>{{ selectedChild.age }} years</span>
                  </div>
                  <div class="detail-item">
                    <label>Date of Birth:</label>
                    <span>{{ formatDate(selectedChild.dateOfBirth) }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedChild.dateOfAdmission">
                    <label>Date of Admission:</label>
                    <span>{{ formatDate(selectedChild.dateOfAdmission) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Place of Birth:</label>
                    <span>{{ selectedChild.placeOfBirth }}</span>
                  </div>
                </div>
              </div>

              <!-- Location Information -->
              <div class="details-section">
                <h4>Location Information</h4>
                <div class="details-grid">
                  <div class="detail-item">
                    <label>Current Location:</label>
                    <span>{{ selectedChild.location }}</span>
                  </div>
                  <div class="detail-item">
                    <label>District:</label>
                    <span>{{ selectedChild.district }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Village:</label>
                    <span>{{ selectedChild.village || "Not specified" }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Chief:</label>
                    <span>{{ selectedChild.chief || "Not specified" }}</span>
                  </div>
                </div>
              </div>

              <!-- Cultural Information -->
              <div class="details-section">
                <h4>Cultural Information</h4>
                <div class="details-grid">
                  <div class="detail-item">
                    <label>Tribe:</label>
                    <span>{{ selectedChild.tribe || "Not specified" }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Nationality:</label>
                    <span>{{ selectedChild.nationality }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Religion:</label>
                    <span>{{ selectedChild.religion || "Not specified" }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Denomination:</label>
                    <span>{{
                      selectedChild.denomination || "Not specified"
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Case Information -->
              <div class="details-section">
                <h4>Case Information</h4>
                <div class="details-grid">
                  <div class="detail-item">
                    <label>Form Type:</label>
                    <span class="form-type">{{ selectedChild.formType }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Status:</label>
                    <span :class="['status-badge', selectedChild.status]">{{
                      selectedChild.status
                    }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Date Added:</label>
                    <span>{{ formatDate(selectedChild.createdAt) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Last Updated:</label>
                    <span>{{ formatDate(selectedChild.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="editChild(selectedChild)" class="edit-btn">
              Edit Child
            </button>
            <button @click="closeModal" class="cancel-btn">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Main Child Tracker View -->

    <!-- Medical Intake Form Full Display -->
    <div v-if="showMedicalIntakeForm" class="medical-intake-fullscreen">
      <div class="fullscreen-header">
        <button @click="closeMedicalIntakeForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Medical Intake Assessment Form</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <MedicalIntakeForm
          :child-data="selectedChildForForms"
          @form-saved="handleMedicalIntakeFormSaved"
        />
      </div>
    </div>

    <!-- Academics & Literacy Form Full Display -->
    <div v-if="showAcademicsLiteracyForm" class="academics-literacy-fullscreen">
      <div class="fullscreen-header">
        <button @click="closeAcademicsLiteracyForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Academics & Literacy Plan</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <AcademicsLiteracyForm @form-saved="handleAcademicsLiteracyFormSaved" />
      </div>
    </div>

    <!-- Psychological Assessment Form Full Display -->
    <div
      v-if="showPsychologicalAssessmentForm"
      class="psychological-assessment-fullscreen"
    >
      <div class="fullscreen-header">
        <button @click="closePsychologicalAssessmentForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Psychological Assessment/Treatment Plan</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <PsychologicalAssessmentForm
          @form-saved="handlePsychologicalAssessmentFormSaved"
        />
      </div>
    </div>

    <!-- Life Skills Survey Form Full Display -->
    <div v-if="showLifeSkillsSurveyForm" class="life-skills-survey-fullscreen">
      <div class="fullscreen-header">
        <button @click="closeLifeSkillsSurveyForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Life Skills Survey</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <LifeSkillsSurveyForm @form-saved="handleLifeSkillsSurveyFormSaved" />
      </div>
    </div>

    <!-- Birth and Delivery Form Full Display -->
    <div v-if="showBirthDeliveryForm" class="birth-delivery-fullscreen">
      <div class="fullscreen-header">
        <button @click="closeBirthDeliveryForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Birth and Delivery Report</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <BirthDeliveryForm @form-saved="handleBirthDeliveryFormSaved" />
      </div>
    </div>

    <!-- Care Plan Summary Form Full Display -->
    <div v-if="showCarePlanSummaryForm" class="care-plan-summary-fullscreen">
      <div class="fullscreen-header">
        <button @click="closeCarePlanSummaryForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Care Plan - Individual Summary</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <CarePlanSummaryForm @form-saved="handleCarePlanSummaryFormSaved" />
      </div>
    </div>

    <!-- Care Plan Baby Form Full Display -->
    <div v-if="showCarePlanBabyForm" class="care-plan-baby-fullscreen">
      <div class="fullscreen-header">
        <button @click="closeCarePlanBabyForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Care Plan - Individual Summary (Baby)</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <CarePlanBabyForm @form-saved="handleCarePlanBabyFormSaved" />
      </div>
    </div>

    <!-- Care Plan Ongoing Life Skills Form Full Display -->
    <div
      v-if="showCarePlanOngoingLifeSkillsForm"
      class="care-plan-ongoing-fullscreen"
    >
      <div class="fullscreen-header">
        <button @click="closeCarePlanOngoingLifeSkillsForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Care Plan - Ongoing - Life Skills</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <CarePlanOngoingLifeSkillsForm
          @form-saved="handleCarePlanOngoingLifeSkillsFormSaved"
        />
      </div>
    </div>

    <!-- Edit Child Form Full Display -->
    <div v-if="showEditForm" class="edit-form-fullscreen">
      <div class="fullscreen-header">
        <button @click="closeEditForm" class="back-button">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="m19 12H5" />
          </svg>
          Back to Child Tracker
        </button>
        <h2>Edit Child Information</h2>
        <div class="header-spacer"></div>
      </div>
      <div class="fullscreen-content">
        <!-- Show Child Overview Form for editing -->
        <ChildOverviewForm
          v-if="editingFormType === 'child-overview'"
          :editData="childToEdit?.rawData"
          :isEditMode="true"
          @form-saved="handleEditFormSaved"
        />
        <!-- Show Initial Assessment Form for editing -->
        <InitialAssessmentForm
          v-else-if="editingFormType === 'initial-assessment'"
          :editData="childToEdit?.rawData"
          :isEditMode="true"
          @form-saved="handleEditFormSaved"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import FormService from "../services/formService.js";
import AuthService from "../services/auth.js";
import Pagination from "./Pagination.vue";
import ChildOverviewForm from "./ChildOverviewForm.vue";
import InitialAssessmentForm from "./InitialAssessmentForm.vue";
import MedicalIntakeForm from "./MedicalIntakeForm.vue";
import AcademicsLiteracyForm from "./AcademicsLiteracyForm.vue";
import PsychologicalAssessmentForm from "./PsychologicalAssessmentForm.vue";
import LifeSkillsSurveyForm from "./LifeSkillsSurveyForm.vue";
import BirthDeliveryForm from "./BirthDeliveryForm.vue";
import CarePlanSummaryForm from "./CarePlanSummaryForm.vue";
import CarePlanBabyForm from "./CarePlanBabyForm.vue";
import CarePlanOngoingLifeSkillsForm from "./CarePlanOngoingLifeSkillsForm.vue";

const router = useRouter();

// Props
const props = defineProps({
  showOnlyComplete: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["back-to-dashboard"]);

// Reactive data
const children = ref([]);
const filteredChildren = ref([]);
const loading = ref(false);
const selectedChild = ref(null);
const selectedChildForForms = ref(null); // Child selected for form filling
const childToEdit = ref(null); // Child selected for editing
const editingFormType = ref(null); // Which form to edit (child-overview or initial-assessment)
const showEditForm = ref(false); // Show edit form modal
const showMedicalIntakeForm = ref(false);
const showAcademicsLiteracyForm = ref(false);
const showPsychologicalAssessmentForm = ref(false);
const showLifeSkillsSurveyForm = ref(false);
const showBirthDeliveryForm = ref(false);
const showCarePlanSummaryForm = ref(false);
const showCarePlanBabyForm = ref(false);
const showCarePlanOngoingLifeSkillsForm = ref(false);

// Search and filter
const searchId = ref("");
const searchName = ref("");
const ageFilter = ref("");
const locationFilter = ref("");

// Pagination
const currentPage = ref(1);
const pageSize = ref(12);

// Computed properties
const totalChildren = computed(() => children.value.length);
const activeChildren = computed(
  () => children.value.filter((child) => child.status === "Active").length
);

const hasSearchCriteria = computed(
  () =>
    searchId.value ||
    searchName.value ||
    ageFilter.value ||
    locationFilter.value
);

const paginatedChildren = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredChildren.value.slice(start, end);
});

// Methods
const generateUniqueId = (child) => {
  // Use Child Overview form field names
  const firstName = (child.childFirstName || "").toUpperCase();
  const lastName = (child.childSurname || "").toUpperCase();
  const tribe = (child.tribe || "").toUpperCase();

  // Generate pattern: FirstName(2) + LastName(2) + LocationCode(03) + Year(2) + Tribe(2) + Sequence(001)
  const firstNamePrefix = firstName.substring(0, 2).padEnd(2, "X");
  const lastNamePrefix = lastName.substring(0, 2).padEnd(2, "X");
  const locationCode = "03"; // Lusaka code
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const tribePrefix = tribe.substring(0, 2).padEnd(2, "X");
  const sequence = "001";

  return `${firstNamePrefix}${lastNamePrefix}${locationCode}${currentYear}${tribePrefix}${sequence}`;
};

const processFormData = (formData, formType) => {
  const uniqueId = generateUniqueId(formData);

  return {
    id: formData.id,
    uniqueId,
    // Use specific field names from Child Overview form
    fullName: `${formData.childFirstName || ""} ${
      formData.childMiddleName || ""
    } ${formData.childSurname || ""}`
      .replace(/\s+/g, " ")
      .trim(),
    otherName:
      `${formData.otherFirstName || ""} ${formData.otherMiddleName || ""} ${
        formData.otherSurname || ""
      }`
        .replace(/\s+/g, " ")
        .trim() || null,
    gender: formData.gender || "Not specified",
    age: formData.ageAtIntake || formData.age || 0,
    dateOfBirth: formData.dateOfBirth,
    dateOfAdmission: formData.dateOfAdmission,
    placeOfBirth: formData.placeOfBirth || "Not specified",
    location: formData.residentArea || formData.district || "Not specified",
    district: formData.district || "Not specified",
    village: formData.village,
    chief: formData.chief,
    tribe: formData.tribe,
    nationality: formData.nationality || "Not specified",
    religion: formData.religion,
    denomination: formData.denomination,
    customId: formData.id, // The ID field from the form
    formType: getFormTypeName(formType),
    formTypes: [formType], // Track which forms this child has
    status: determineStatus(formData, formType),
    createdAt: formData.createdAt,
    updatedAt: formData.updatedAt || formData.createdAt,
    rawData: formData,
  };
};

const getFormTypeName = (formType) => {
  const names = {
    "initial-referral": "Initial Child Referral",
    "child-overview": "Child Overview and Background (TKP Care Plan)",
    "initial-assessment": "TKP Initial Assessment",
    "medical-intake": "Medical Intake Assessment",
  };
  return names[formType] || "Unknown Form";
};

const determineStatus = (formData, formType) => {
  // Determine status based on form completion and type
  if (formType === "child-overview") {
    // More comprehensive form, likely active case
    return "Active";
  } else if (formType === "initial-assessment") {
    // Assessment completed, determine based on recommendation
    if (formData.tkpRecommendation === "ADMIT TO TKP HOUSE") {
      return "Admitted";
    } else if (formData.tkpRecommendation === "DO NOT ADMIT") {
      return "Not Admitted";
    }
    return "Under Assessment";
  } else {
    // Initial referral
    return "Referred";
  }
};

const loadChildren = async () => {
  loading.value = true;
  try {
    // Load all forms including all assessment forms
    const [
      overviewResult,
      referralResult,
      assessmentResult,
      medicalIntakeResult,
      academicsLiteracyResult,
      psychologicalAssessmentResult,
      lifeSkillsSurveyResult,
      birthDeliveryResult,
      carePlanSummaryResult,
      carePlanBabyResult,
      carePlanOngoingLifeSkillsResult,
    ] = await Promise.all([
      FormService.getForms("child-overview", 1000),
      FormService.getForms("initial-referral", 1000),
      FormService.getForms("initial-assessment", 1000),
      FormService.getForms("medical-intake", 1000),
      FormService.getForms("academics-literacy", 1000),
      FormService.getForms("psychological-assessment", 1000),
      FormService.getForms("life-skills-survey", 1000),
      FormService.getForms("birth-delivery", 1000),
      FormService.getForms("care-plan-summary", 1000),
      FormService.getForms("care-plan-baby", 1000),
      FormService.getForms("care-plan-ongoing-life-skills", 1000),
    ]);

    // Create a map to track children and their forms
    const childrenMap = new Map();

    // Process all forms
    const allForms = [];

    if (overviewResult.success) {
      overviewResult.forms.forEach((form) => {
        allForms.push({ form, formType: "child-overview" });
      });
    }

    if (referralResult.success) {
      referralResult.forms.forEach((form) => {
        allForms.push({ form, formType: "initial-referral" });
      });
    }

    if (assessmentResult.success) {
      assessmentResult.forms.forEach((form) => {
        allForms.push({ form, formType: "initial-assessment" });
      });
    }

    if (medicalIntakeResult.success) {
      medicalIntakeResult.forms.forEach((form) => {
        allForms.push({ form, formType: "medical-intake" });
      });
    }

    if (academicsLiteracyResult.success) {
      academicsLiteracyResult.forms.forEach((form) => {
        allForms.push({ form, formType: "academics-literacy" });
      });
    }

    if (psychologicalAssessmentResult.success) {
      psychologicalAssessmentResult.forms.forEach((form) => {
        allForms.push({ form, formType: "psychological-assessment" });
      });
    }

    if (lifeSkillsSurveyResult.success) {
      lifeSkillsSurveyResult.forms.forEach((form) => {
        allForms.push({ form, formType: "life-skills-survey" });
      });
    }

    if (birthDeliveryResult.success) {
      birthDeliveryResult.forms.forEach((form) => {
        allForms.push({ form, formType: "birth-delivery" });
      });
    }

    if (carePlanSummaryResult.success) {
      carePlanSummaryResult.forms.forEach((form) => {
        allForms.push({ form, formType: "care-plan-summary" });
      });
    }

    if (carePlanBabyResult.success) {
      carePlanBabyResult.forms.forEach((form) => {
        allForms.push({ form, formType: "care-plan-baby" });
      });
    }

    if (carePlanOngoingLifeSkillsResult.success) {
      carePlanOngoingLifeSkillsResult.forms.forEach((form) => {
        allForms.push({ form, formType: "care-plan-ongoing-life-skills" });
      });
    }

    // Group forms by child (based on name and date of birth)
    allForms.forEach(({ form, formType }) => {
      // Normalize the key for better matching
      const firstName = (form.childFirstName || "").trim().toLowerCase();
      const surname = (form.childSurname || "").trim().toLowerCase();
      const dob = form.dateOfBirth || "";

      // Primary key: name + date of birth (exact match)
      const primaryKey = `${firstName}-${surname}-${dob}`;

      // Fallback key: name only (for cases where DOB might differ)
      const nameOnlyKey = `${firstName}-${surname}`;

      // Debug logging
      if (formType === "initial-assessment" || formType === "child-overview") {
        console.log(`Processing ${formType}:`, {
          firstName,
          surname,
          dob,
          primaryKey,
          nameOnlyKey,
          formData: form,
        });
      }

      // Try exact match first (name + DOB)
      let matchedKey = null;
      if (childrenMap.has(primaryKey)) {
        matchedKey = primaryKey;
        console.log(`✅ Exact match found for: ${firstName} ${surname}`);
      } else if (firstName && surname) {
        // Fallback: Try to find by name only
        console.log(`No exact match for key: ${primaryKey}`);
        console.log(`Trying name-only fallback for: ${nameOnlyKey}`);
        console.log(`Existing keys in map:`, Array.from(childrenMap.keys()));

        for (const [existingKey, existingChild] of childrenMap.entries()) {
          // Extract name part by removing the date portion (YYYY-MM-DD format)
          // Date format is always at the end: "firstname-surname-YYYY-MM-DD"
          // We need to remove the last 3 dash-separated parts (YYYY-MM-DD)
          const parts = existingKey.split("-");
          if (parts.length < 4) {
            // Not enough parts to have a full date, skip
            console.log(`Skipping key with insufficient parts: ${existingKey}`);
            continue;
          }

          // Remove last 3 parts (day, month, year) and rejoin
          const existingNameKey = parts.slice(0, -3).join("-");
          console.log(
            `  Comparing: "${nameOnlyKey}" === "${existingNameKey}" ?`
          );

          if (existingNameKey === nameOnlyKey) {
            matchedKey = existingKey;
            console.warn(
              `⚠️ MATCHED BY NAME ONLY (DOB mismatch): ${firstName} ${surname}`
            );
            console.warn(`  This form (${formType}) DOB: ${dob}`);
            console.warn(`  Existing record DOB: ${parts.slice(-3).join("-")}`);
            console.warn(`  ✅ Linking forms together!`);
            break;
          }
        }

        if (!matchedKey) {
          console.log(`❌ No name-only match found. Creating new child.`);
        }
      }

      if (matchedKey) {
        // Add form type to existing child
        const child = childrenMap.get(matchedKey);
        if (!child.formTypes.includes(formType)) {
          child.formTypes.push(formType);
        }
        // Update with the most recent form data
        if (
          !child.createdAt ||
          new Date(form.createdAt) > new Date(child.createdAt)
        ) {
          const updatedChild = processFormData(form, formType);
          updatedChild.formTypes = child.formTypes;
          childrenMap.set(matchedKey, updatedChild);
        }
      } else {
        // Create new child entry
        const child = processFormData(form, formType);
        childrenMap.set(primaryKey, child);
      }
    });

    // Convert map to array
    let allChildren = Array.from(childrenMap.values());

    // Debug: Log all children and their form types
    console.log("All children loaded:", allChildren.length);
    allChildren.forEach((child) => {
      console.log(`Child: ${child.fullName}, Forms:`, child.formTypes);
    });

    // If showOnlyComplete is true, filter to only children with initial-assessment AND child-overview forms
    if (props.showOnlyComplete) {
      const beforeFilter = allChildren.length;
      allChildren = allChildren.filter(
        (child) =>
          child.formTypes.includes("initial-assessment") &&
          child.formTypes.includes("child-overview")
      );
      console.log(
        `Filtered from ${beforeFilter} to ${allChildren.length} children with both forms`
      );
      console.log(
        "Filtered children:",
        allChildren.map((c) => ({ name: c.fullName, forms: c.formTypes }))
      );
    }

    children.value = allChildren.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    filteredChildren.value = [...children.value];
  } catch (error) {
    console.error("Error loading children:", error);
  } finally {
    loading.value = false;
  }
};

const searchChildren = () => {
  let filtered = [...children.value];

  // Filter by ID
  if (searchId.value.trim()) {
    const searchTerm = searchId.value.toLowerCase().trim();
    filtered = filtered.filter((child) =>
      child.uniqueId.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by name
  if (searchName.value.trim()) {
    const searchTerm = searchName.value.toLowerCase().trim();
    filtered = filtered.filter((child) =>
      child.fullName.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by age range
  if (ageFilter.value) {
    const [minAge, maxAge] = ageFilter.value.split("-").map(Number);
    filtered = filtered.filter((child) => {
      const age = parseInt(child.age);
      return age >= minAge && age <= maxAge;
    });
  }

  // Filter by location
  if (locationFilter.value) {
    const locationTerm = locationFilter.value.toLowerCase();
    filtered = filtered.filter(
      (child) =>
        child.location.toLowerCase().includes(locationTerm) ||
        child.district.toLowerCase().includes(locationTerm)
    );
  }

  filteredChildren.value = filtered;
  currentPage.value = 1; // Reset to first page
};

const clearSearch = () => {
  searchId.value = "";
  searchName.value = "";
  ageFilter.value = "";
  locationFilter.value = "";
  filteredChildren.value = [...children.value];
  currentPage.value = 1;
};

const viewChildDetails = (child) => {
  selectedChild.value = child;
};

const editChild = async (child) => {
  console.log("🔧 EDIT CHILD FUNCTION CALLED - NEW VERSION WITH DEBUGGING");
  console.log("Edit child:", child);
  console.log("Child rawData:", child.rawData);
  console.log("Child formTypes:", child.formTypes);

  // Set the child data for editing
  childToEdit.value = child;

  // Determine which form to edit based on what the child has
  // Prefer child-overview if available, otherwise initial-assessment
  let formTypeToEdit = null;
  if (child.formTypes.includes("child-overview")) {
    formTypeToEdit = "child-overview";
  } else if (child.formTypes.includes("initial-assessment")) {
    formTypeToEdit = "initial-assessment";
  } else {
    // Fallback - shouldn't happen in "In Housed Girls" view
    alert("No editable form found for this child");
    return;
  }

  editingFormType.value = formTypeToEdit;
  console.log("Editing form type:", formTypeToEdit);

  // Fetch the actual form document to get the correct form ID
  try {
    const formResult = await FormService.getForms(formTypeToEdit, 1000);
    console.log("Fetched forms result:", formResult);

    if (formResult.success) {
      // Find the specific form for this child by matching name and DOB
      const matchingForm = formResult.forms.find((form) => {
        const formFirstName = (form.childFirstName || "").trim().toLowerCase();
        const formSurname = (form.childSurname || "").trim().toLowerCase();
        const formDOB = form.dateOfBirth || "";

        const childFirstName = (child.rawData.childFirstName || "")
          .trim()
          .toLowerCase();
        const childSurname = (child.rawData.childSurname || "")
          .trim()
          .toLowerCase();
        const childDOB = child.rawData.dateOfBirth || "";

        console.log("Comparing:", {
          form: {
            firstName: formFirstName,
            surname: formSurname,
            dob: formDOB,
            id: form.id,
          },
          child: {
            firstName: childFirstName,
            surname: childSurname,
            dob: childDOB,
          },
        });

        return (
          formFirstName === childFirstName &&
          formSurname === childSurname &&
          formDOB === childDOB
        );
      });

      if (matchingForm) {
        console.log("✅ Found matching form with ID:", matchingForm.id);
        // Update the child's rawData with the correct form ID
        childToEdit.value = {
          ...child,
          rawData: {
            ...matchingForm, // Use the entire form data from Firestore
            formId: matchingForm.id, // Explicitly set the formId
          },
        };
      } else {
        console.error("❌ Could not find matching form!");
        console.log(
          "Available forms:",
          formResult.forms.map((f) => ({
            id: f.id,
            name: `${f.childFirstName} ${f.childSurname}`,
            dob: f.dateOfBirth,
          }))
        );
        alert(
          "Could not find the form to edit. The child data might be inconsistent."
        );
        return;
      }
    } else {
      console.error("Failed to fetch forms:", formResult.error);
      alert("Failed to load form data. Please try again.");
      return;
    }
  } catch (err) {
    console.error("Error fetching form:", err);
    alert("An error occurred while loading the form. Please try again.");
    return;
  }

  // Show the edit modal/form
  showEditForm.value = true;

  // Close the details modal if open
  if (selectedChild.value) {
    selectedChild.value = null;
  }
};

const closeModal = () => {
  selectedChild.value = null;
};

const formatDate = (date) => {
  if (!date) return "Not specified";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString();
};

const exportData = () => {
  const dataStr = JSON.stringify(filteredChildren.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `child-tracker-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

// Navigation methods
const goBack = () => {
  // Emit event to parent Dashboard component
  emit("back-to-dashboard");
};

const goToMedicalIntakeForms = (child = null) => {
  // Set the selected child for this form
  selectedChildForForms.value = child;
  // Show the Medical Intake Form within ChildTracker
  showMedicalIntakeForm.value = true;
};

const closeMedicalIntakeForm = () => {
  showMedicalIntakeForm.value = false;
  selectedChildForForms.value = null;
};

const handleMedicalIntakeFormSaved = async () => {
  // Close the form
  showMedicalIntakeForm.value = false;
  // Reload children data to include the new medical intake form
  await loadChildren();
};

const goToAcademicsLiteracyForm = (child = null) => {
  // Set the selected child for this form
  selectedChildForForms.value = child;
  // Show the Academics & Literacy Form within ChildTracker
  showAcademicsLiteracyForm.value = true;
};

const closeAcademicsLiteracyForm = () => {
  showAcademicsLiteracyForm.value = false;
  selectedChildForForms.value = null;
};

const handleAcademicsLiteracyFormSaved = async () => {
  // Close the form
  showAcademicsLiteracyForm.value = false;
  // Reload children data to include the new academics & literacy form
  await loadChildren();
};

const goToPsychologicalAssessmentForm = (child = null) => {
  // Set the selected child for this form
  selectedChildForForms.value = child;
  // Show the Psychological Assessment Form within ChildTracker
  showPsychologicalAssessmentForm.value = true;
};

const closePsychologicalAssessmentForm = () => {
  showPsychologicalAssessmentForm.value = false;
  selectedChildForForms.value = null;
};

const handlePsychologicalAssessmentFormSaved = async () => {
  // Close the form
  showPsychologicalAssessmentForm.value = false;
  // Reload children data to include the new psychological assessment form
  await loadChildren();
};

const goToLifeSkillsSurveyForm = (child = null) => {
  // Set the selected child for this form
  selectedChildForForms.value = child;
  // Show the Life Skills Survey Form within ChildTracker
  showLifeSkillsSurveyForm.value = true;
};

const closeLifeSkillsSurveyForm = () => {
  showLifeSkillsSurveyForm.value = false;
  selectedChildForForms.value = null;
};

const handleLifeSkillsSurveyFormSaved = async () => {
  // Close the form
  showLifeSkillsSurveyForm.value = false;
  // Reload children data to include the new life skills survey form
  await loadChildren();
};

const goToBirthDeliveryForm = (child = null) => {
  // Set the selected child for this form
  selectedChildForForms.value = child;
  // Show the Birth and Delivery Form within ChildTracker
  showBirthDeliveryForm.value = true;
};

const closeBirthDeliveryForm = () => {
  showBirthDeliveryForm.value = false;
  selectedChildForForms.value = null;
};

const handleBirthDeliveryFormSaved = async () => {
  // Close the form
  showBirthDeliveryForm.value = false;
  // Reload children data to include the new birth and delivery report
  await loadChildren();
};

const goToCarePlanSummaryForm = (child = null) => {
  // Set the selected child for this form
  selectedChildForForms.value = child;
  // Show the Care Plan Summary Form within ChildTracker
  showCarePlanSummaryForm.value = true;
};

const closeCarePlanSummaryForm = () => {
  showCarePlanSummaryForm.value = false;
  selectedChildForForms.value = null;
};

const handleCarePlanSummaryFormSaved = async () => {
  // Close the form
  showCarePlanSummaryForm.value = false;
  // Reload children data to include the new care plan summary
  await loadChildren();
};

const goToCarePlanBabyForm = (child = null) => {
  // Set the selected child for this form
  selectedChildForForms.value = child;
  // Show the Care Plan Baby Form within ChildTracker
  showCarePlanBabyForm.value = true;
};

const closeCarePlanBabyForm = () => {
  showCarePlanBabyForm.value = false;
  selectedChildForForms.value = null;
};

const handleCarePlanBabyFormSaved = async () => {
  // Close the form
  showCarePlanBabyForm.value = false;
  // Reload children data to include the new care plan baby
  await loadChildren();
};

const goToCarePlanOngoingLifeSkillsForm = (child = null) => {
  // Set the selected child for this form
  selectedChildForForms.value = child;
  // Show the Care Plan Ongoing Life Skills Form within ChildTracker
  showCarePlanOngoingLifeSkillsForm.value = true;
};

const closeCarePlanOngoingLifeSkillsForm = () => {
  showCarePlanOngoingLifeSkillsForm.value = false;
  selectedChildForForms.value = null;
};

const handleCarePlanOngoingLifeSkillsFormSaved = async () => {
  // Close the form
  showCarePlanOngoingLifeSkillsForm.value = false;
  // Reload children data to include the new care plan ongoing life skills
  await loadChildren();
};

const viewChildForms = (child) => {
  // Open a modal or section showing all forms for this specific child
  selectedChild.value = {
    ...child,
    showFormsManagement: true,
  };
};

const closeFormsManagement = () => {
  if (selectedChild.value) {
    selectedChild.value.showFormsManagement = false;
  }
  selectedChild.value = null;
};

const closeEditForm = () => {
  showEditForm.value = false;
  childToEdit.value = null;
  editingFormType.value = null;
};

const handleEditFormSaved = async () => {
  // Close the edit form
  showEditForm.value = false;
  childToEdit.value = null;
  editingFormType.value = null;
  // Reload children data to reflect the updated information
  await loadChildren();
};

const handleLogout = async () => {
  const result = await AuthService.logout();
  if (result.success) {
    router.push("/login");
  }
};

// Lifecycle
onMounted(() => {
  loadChildren();
});
</script>

<style scoped>
.child-tracker-container {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
}

.tracker-header {
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-end;
}

.header-center {
  flex: 2;
  text-align: center;
}

.tracker-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.data-source-indicator {
  margin-top: 0.25rem;
}

.indicator-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 0.35rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.indicator-badge.firebase {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
  }
  50% {
    box-shadow: 0 2px 16px rgba(40, 167, 69, 0.5);
  }
}

.back-button,
.logout-button {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.back-button:hover,
.logout-button:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.logout-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

.logout-button:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.quick-stats-section {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: white;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #dee2e6;
}

.stat-card.action-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.action-card:hover {
  background: linear-gradient(135deg, #5568d3 0%, #653a8e 100%);
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.stat-card.info-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-color: #90caf9;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.medical-intake-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.medical-intake-btn:hover {
  transform: scale(1.05);
}

.medical-intake-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.stat-card.academics-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: #f093fb;
}

.stat-card.academics-card:hover {
  background: linear-gradient(135deg, #e082ea 0%, #e4465b 100%);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

.academics-literacy-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.academics-literacy-btn:hover {
  transform: scale(1.05);
}

.academics-literacy-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.stat-card.psychological-card {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-color: #4facfe;
}

.stat-card.psychological-card:hover {
  background: linear-gradient(135deg, #3e9bed 0%, #00dbed 100%);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.psychological-assessment-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.psychological-assessment-btn:hover {
  transform: scale(1.05);
}

.psychological-assessment-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.stat-card.life-skills-card {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-color: #11998e;
}

.stat-card.life-skills-card:hover {
  background: linear-gradient(135deg, #0e8677 0%, #2dd969 100%);
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
}

.life-skills-survey-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.life-skills-survey-btn:hover {
  transform: scale(1.05);
}

.life-skills-survey-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.stat-card.birth-delivery-card {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%);
  border-color: #ff9a56;
}

.stat-card.birth-delivery-card:hover {
  background: linear-gradient(135deg, #ff8945 0%, #ff5977 100%);
  box-shadow: 0 6px 20px rgba(255, 154, 86, 0.4);
}

.birth-delivery-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.birth-delivery-btn:hover {
  transform: scale(1.05);
}

.birth-delivery-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.stat-card.care-plan-card {
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
  border-color: #9c27b0;
}

.stat-card.care-plan-card:hover {
  background: linear-gradient(135deg, #8b1fa3 0%, #5e35b1 100%);
  box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);
}

.care-plan-summary-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.care-plan-summary-btn:hover {
  transform: scale(1.05);
}

.care-plan-summary-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.stat-card.care-plan-baby-card {
  background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
  border-color: #00bcd4;
}

.stat-card.care-plan-baby-card:hover {
  background: linear-gradient(135deg, #00acc1 0%, #00838f 100%);
  box-shadow: 0 6px 20px rgba(0, 188, 212, 0.4);
}

.care-plan-baby-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.care-plan-baby-btn:hover {
  transform: scale(1.05);
}

.care-plan-baby-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.stat-card.care-plan-ongoing-card {
  background: linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%);
  border-color: #ff6f00;
}

.stat-card.care-plan-ongoing-card:hover {
  background: linear-gradient(135deg, #f57c00 0%, #fb8c00 100%);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.care-plan-ongoing-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.care-plan-ongoing-btn:hover {
  transform: scale(1.05);
}

.care-plan-ongoing-btn svg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.search-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 2rem 2rem;
  padding: 2rem;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.search-header h3 {
  color: #4a148c;
  font-size: 1.4rem;
  margin: 0;
}

.search-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  color: #ff5722;
  font-size: 0.9rem;
}

.stat-item strong {
  display: block;
  font-size: 1.5rem;
  color: #4a148c;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #4a148c;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.search-input,
.search-select {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus,
.search-select:focus {
  outline: none;
  border-color: #4a148c;
  box-shadow: 0 0 0 3px rgba(74, 20, 140, 0.1);
}

.search-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.clear-btn,
.export-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-btn {
  background: #6c757d;
  color: white;
}

.clear-btn:hover {
  background: #5a6268;
}

.export-btn {
  background: #28a745;
  color: white;
}

.export-btn:hover:not(:disabled) {
  background: #218838;
}

.export-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.results-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 0 2rem 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.results-header h3 {
  color: #4a148c;
  font-size: 1.4rem;
  margin: 0;
}

.results-count {
  color: #ff5722;
  font-weight: 600;
  font-size: 1.1rem;
}

.loading-state,
.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a148c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results h4 {
  color: #4a148c;
  margin-bottom: 0.5rem;
}

.children-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.child-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.child-card:hover {
  border-color: #4a148c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 20, 140, 0.15);
}

.child-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.child-id {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.id-label {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.id-value {
  color: #4a148c;
  font-weight: 700;
  font-family: monospace;
  background: rgba(74, 20, 140, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.child-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.child-status.Active {
  background: #d4edda;
  color: #155724;
}

.child-status.Admitted {
  background: #d1ecf1;
  color: #0c5460;
}

.child-status.Referred {
  background: #fff3cd;
  color: #856404;
}

.child-status.Under.Assessment {
  background: #e2e3e5;
  color: #383d41;
}

.child-status.Not.Admitted {
  background: #f8d7da;
  color: #721c24;
}

.child-status.Inactive {
  background: #f8d7da;
  color: #721c24;
}

.child-info {
  margin-bottom: 1rem;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.info-value.form-type {
  color: #ff5722;
  font-weight: 600;
}

.child-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn.view {
  background: #17a2b8;
  color: white;
}

.action-btn.view:hover {
  background: #138496;
}

.action-btn.edit {
  background: #ffc107;
  color: #212529;
}

.action-btn.edit:hover {
  background: #e0a800;
}

.action-btn.forms {
  background: #9c27b0;
  color: white;
}

.action-btn.forms:hover {
  background: #7b1fa2;
}

.pagination-container {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f8f9fa;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 80vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.child-details-modal {
  width: 900px;
  max-width: 90vw;
}

.forms-management-modal {
  width: 800px;
  max-width: 90vw;
}

.child-info-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.child-info-summary p {
  margin: 0;
  font-size: 0.9rem;
}

.child-info-summary strong {
  color: #4a148c;
  margin-right: 0.5rem;
}

.forms-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.form-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.form-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-item.completed {
  background: #d4edda;
  border-color: #28a745;
}

.form-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.form-number {
  background: #4a148c;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.form-item.completed .form-number {
  background: #28a745;
}

.form-details h5 {
  margin: 0 0 0.25rem 0;
  color: #4a148c;
  font-size: 1rem;
}

.form-details p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.form-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-icon {
  font-size: 1.5rem;
  font-weight: bold;
}

.status-icon.completed {
  color: #28a745;
}

.status-icon.pending {
  color: #ccc;
}

.form-btn {
  background: #4a148c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.form-btn:hover {
  background: #2d1b69;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 20, 140, 0.3);
}

.form-btn.edit-btn {
  background: #ffc107;
  color: #212529;
}

.form-btn.edit-btn:hover {
  background: #e0a800;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f8f9fa;
  background: #f8f9fa;
}

.modal-header h3,
.modal-header h4 {
  color: #4a148c;
  margin: 0;
  font-size: 1.4rem;
}

.modal-body h4 {
  color: #4a148c;
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8f9fa;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f8f9fa;
  background: #f8f9fa;
}

.modal-header h3 {
  color: #4a148c;
  margin: 0;
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.child-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.details-section h4 {
  color: #4a148c;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8f9fa;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  color: #666;
  font-weight: 500;
  font-size: 0.85rem;
}

.detail-item span {
  color: #333;
  font-weight: 500;
}

.detail-item .unique-id {
  color: #4a148c;
  font-family: monospace;
  background: rgba(74, 20, 140, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 700;
}

.detail-item .custom-id {
  color: #ff5722;
  font-family: monospace;
  background: rgba(255, 87, 34, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 700;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  width: fit-content;
}

.status-badge.Active {
  background: #d4edda;
  color: #155724;
}

.status-badge.Admitted {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.Referred {
  background: #fff3cd;
  color: #856404;
}

.status-badge.Under.Assessment {
  background: #e2e3e5;
  color: #383d41;
}

.status-badge.Not.Admitted {
  background: #f8d7da;
  color: #721c24;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f8f9fa;
  background: #f8f9fa;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #e0a800;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #5a6268;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .quick-stats-section {
    grid-template-columns: repeat(2, 1fr);
    padding: 1.25rem 1.5rem;
  }

  .stat-card.info-card {
    grid-column: 1 / -1;
  }

  .search-inputs {
    grid-template-columns: repeat(2, 1fr);
  }

  .children-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .child-tracker-container {
    padding: 0;
  }

  .tracker-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    align-items: stretch;
  }

  .header-left,
  .header-center,
  .header-right {
    flex: none;
    width: 100%;
    justify-content: center;
  }

  .header-left {
    order: 1;
  }

  .header-center {
    order: 2;
    text-align: center;
  }

  .header-right {
    order: 3;
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .back-button,
  .logout-button {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    flex: 1;
    justify-content: center;
  }

  .tracker-title {
    font-size: 1.35rem;
  }

  .indicator-badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.75rem;
  }

  .quick-stats-section {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }

  .stat-card.info-card {
    grid-column: auto;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .search-section,
  .results-section {
    margin: 0 1rem 1.5rem;
    padding: 1.5rem;
  }

  .search-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-header h3 {
    font-size: 1.25rem;
  }

  .search-stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat-item {
    font-size: 0.85rem;
  }

  .stat-item strong {
    font-size: 1.25rem;
  }

  .search-inputs {
    grid-template-columns: 1fr;
  }

  .search-actions {
    justify-content: stretch;
    flex-direction: row;
  }

  .clear-btn,
  .export-btn {
    flex: 1;
  }

  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .results-header h3 {
    font-size: 1.25rem;
    text-align: center;
  }

  .results-count {
    text-align: center;
  }

  .children-list {
    grid-template-columns: 1fr;
  }

  .info-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .child-card {
    padding: 1.25rem;
  }

  .child-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }

  .child-details-modal {
    width: 95vw;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .edit-btn,
  .cancel-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .tracker-header {
    padding: 1rem;
  }

  .tracker-title {
    font-size: 1.125rem;
  }

  .indicator-badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.625rem;
  }

  .back-button,
  .logout-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }

  .header-right {
    flex-direction: column;
    gap: 0.5rem;
  }

  .logout-button,
  .back-button {
    width: 100%;
  }

  .quick-stats-section {
    padding: 0.875rem;
    gap: 0.875rem;
    margin-bottom: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .info-badge {
    font-size: 0.75rem;
    padding: 0.5rem 0.875rem;
  }

  .search-section,
  .results-section {
    margin: 0 0.75rem 1rem;
    padding: 1.25rem;
  }

  .search-header h3,
  .results-header h3 {
    font-size: 1.125rem;
  }

  .search-stats {
    gap: 1rem;
  }

  .stat-item {
    font-size: 0.8rem;
  }

  .stat-item strong {
    font-size: 1.125rem;
  }

  .search-input,
  .search-select {
    padding: 0.625rem;
    font-size: 0.9rem;
  }

  .form-group label {
    font-size: 0.85rem;
  }

  .clear-btn,
  .export-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }

  .child-card {
    padding: 1rem;
  }

  .child-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .id-label,
  .id-value {
    font-size: 0.85rem;
  }

  .child-status {
    font-size: 0.75rem;
  }

  .info-label {
    font-size: 0.75rem;
  }

  .info-value {
    font-size: 0.85rem;
  }

  .action-btn {
    padding: 0.625rem;
    font-size: 0.8rem;
  }

  .modal-header,
  .modal-footer {
    padding: 1rem 1.25rem;
  }

  .modal-header h3 {
    font-size: 1.125rem;
  }

  .modal-body {
    padding: 1.25rem;
  }

  .details-section h4 {
    font-size: 1rem;
  }

  .detail-item label {
    font-size: 0.8rem;
  }

  .detail-item span {
    font-size: 0.9rem;
  }

  .edit-btn,
  .cancel-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }

  .no-results {
    padding: 2rem 1rem;
  }

  .no-results-icon {
    font-size: 2.5rem;
  }

  .no-results h4 {
    font-size: 1rem;
  }

  .no-results p {
    font-size: 0.875rem;
  }
}

/* Medical Intake Form Full Display Styles */
.medical-intake-fullscreen,
.academics-literacy-fullscreen,
.psychological-assessment-fullscreen,
.life-skills-survey-fullscreen,
.birth-delivery-fullscreen,
.care-plan-summary-fullscreen,
.care-plan-baby-fullscreen,
.care-plan-ongoing-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f9fa;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.fullscreen-header {
  background: #ffffff;
  border-bottom: 2px solid #e9ecef;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.fullscreen-header h2 {
  color: #4a148c;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  flex: 1;
  text-align: center;
}

.fullscreen-header .back-button {
  flex: 0 0 auto;
}

.header-spacer {
  flex: 0 0 auto;
  width: 180px; /* Match back button width for centering */
}

.fullscreen-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.fullscreen-content :deep(.form-wrapper) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: white;
}

@media (max-width: 768px) {
  .fullscreen-header {
    padding: 1rem 1.5rem;
  }

  .fullscreen-header h2 {
    font-size: 1.25rem;
  }

  .fullscreen-content {
    padding: 1rem;
  }

  .header-spacer {
    display: none;
  }

  .fullscreen-header {
    justify-content: flex-start;
    gap: 1rem;
  }

  .fullscreen-header h2 {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .fullscreen-header {
    padding: 1rem;
  }

  .fullscreen-header h2 {
    font-size: 1.125rem;
  }

  .fullscreen-content {
    padding: 0.75rem;
  }
}
</style>
