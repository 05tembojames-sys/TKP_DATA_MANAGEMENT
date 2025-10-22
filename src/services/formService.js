import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config.js";

class FormService {
  constructor() {
    this.formsCollection = "forms";
  }

  // Save Initial Child Referral Form
  async saveInitialReferral(formData) {
    try {
      const formDoc = {
        formType: "initial-referral",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "draft",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Initial referral form saved successfully",
      };
    } catch (error) {
      console.error("Error saving initial referral form:", error);
      // Check if it's a network error
      if (!navigator.onLine) {
        return {
          success: false,
          error:
            "No internet connection. Please check your network and try again.",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Save Child Overview and Background Form
  async saveChildOverview(formData) {
    try {
      const formDoc = {
        formType: "child-overview",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "draft",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Child overview form saved successfully",
      };
    } catch (error) {
      console.error("Error saving child overview form:", error);
      // Check if it's a network error
      if (!navigator.onLine) {
        return {
          success: false,
          error:
            "No internet connection. Please check your network and try again.",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update Child Overview and Background Form
  async updateChildOverview(formId, formData) {
    try {
      console.log("🔄 Attempting to update form with ID:", formId);

      // First, check if the document exists
      const formRef = doc(db, this.formsCollection, formId);
      const formSnap = await getDoc(formRef);

      if (!formSnap.exists()) {
        console.error("❌ Document does not exist in Firestore:", formId);
        console.log("📋 Checking all available child-overview forms...");

        // Fetch all child-overview forms to help find the right one
        const allForms = await this.getForms("child-overview", 1000);
        if (allForms.success) {
          console.log(
            "Available forms:",
            allForms.forms.map((f) => ({
              id: f.id,
              name: `${f.childFirstName} ${f.childSurname}`,
              dob: f.dateOfBirth,
            }))
          );

          // Try to find a matching form by name and DOB
          const matchingForm = allForms.forms.find((f) => {
            const nameMatch =
              f.childFirstName === formData.childFirstName &&
              f.childSurname === formData.childSurname;
            const dobMatch = f.dateOfBirth === formData.dateOfBirth;
            return nameMatch && dobMatch;
          });

          if (matchingForm) {
            // Use firestoreId if available, otherwise fall back to id
            const correctId = matchingForm.firestoreId || matchingForm.id;
            console.log("✅ Found matching form with correct ID:", correctId);
            console.log("📝 Form data ID was:", matchingForm.formDataId);
            console.log("💡 Using Firestore document ID:", correctId);

            // Use the correct ID and try again
            const correctFormRef = doc(db, this.formsCollection, correctId);
            await updateDoc(correctFormRef, {
              ...formData,
              updatedAt: new Date(),
            });

            return {
              success: true,
              id: correctId,
              message:
                "Child overview form updated successfully (using corrected ID)",
            };
          }
        }

        return {
          success: false,
          error: `Form with ID '${formId}' does not exist in Firestore. The document may have been deleted or the ID is incorrect.`,
        };
      }

      console.log("✅ Document exists, proceeding with update");

      // Document exists, proceed with update
      await updateDoc(formRef, {
        ...formData,
        updatedAt: new Date(),
      });

      return {
        success: true,
        id: formId,
        message: "Child overview form updated successfully",
      };
    } catch (error) {
      console.error("Error updating child overview form:", error);
      // Check if it's a network error
      if (!navigator.onLine) {
        return {
          success: false,
          error:
            "No internet connection. Please check your network and try again.",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Save TKP Initial Assessment Form
  async saveInitialAssessment(formData) {
    try {
      const formDoc = {
        formType: "initial-assessment",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "draft",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Initial assessment form saved successfully",
      };
    } catch (error) {
      console.error("Error saving initial assessment form:", error);
      // Check if it's a network error
      if (!navigator.onLine) {
        return {
          success: false,
          error:
            "No internet connection. Please check your network and try again.",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Save Medical Intake Assessment Form
  async saveMedicalIntakeAssessment(formData) {
    try {
      const formDoc = {
        formType: "medical-intake",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "completed",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Medical intake assessment form saved successfully",
      };
    } catch (error) {
      console.error("Error saving medical intake assessment form:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Save Academics & Literacy Plan Form
  async saveAcademicsLiteracyPlan(formData) {
    try {
      const formDoc = {
        formType: "academics-literacy",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "completed",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Academics & Literacy Plan saved successfully",
      };
    } catch (error) {
      console.error("Error saving academics & literacy plan:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Save Psychological Assessment Form
  async savePsychologicalAssessment(formData) {
    try {
      const formDoc = {
        formType: "psychological-assessment",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "completed",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Psychological Assessment saved successfully",
      };
    } catch (error) {
      console.error("Error saving psychological assessment:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Save Life Skills Survey Form
  async saveLifeSkillsSurvey(formData) {
    try {
      const formDoc = {
        formType: "life-skills-survey",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "completed",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Life Skills Survey saved successfully",
      };
    } catch (error) {
      console.error("Error saving life skills survey:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async saveBirthDeliveryReport(formData) {
    try {
      const formDoc = {
        formType: "birth-delivery",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "completed",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Birth and Delivery Report saved successfully",
      };
    } catch (error) {
      console.error("Error saving birth and delivery report:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async saveCarePlanSummary(formData) {
    try {
      const formDoc = {
        formType: "care-plan-summary",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "completed",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Care Plan Summary saved successfully",
      };
    } catch (error) {
      console.error("Error saving care plan summary:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Save Care Plan Baby Form
  async saveCarePlanBaby(formData) {
    try {
      const formDoc = {
        formType: "care-plan-baby",
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "completed",
      };

      const docRef = await addDoc(
        collection(db, this.formsCollection),
        formDoc
      );
      return {
        success: true,
        id: docRef.id,
        message: "Care Plan (Baby) saved successfully",
      };
    } catch (error) {
      console.error("Error saving care plan (baby):", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get forms with pagination
  async getForms(formType = null, pageSize = 10, lastDoc = null) {
    try {
      let q;

      if (formType) {
        // Simple query with just formType filter for now
        q = query(
          collection(db, this.formsCollection),
          where("formType", "==", formType),
          limit(pageSize)
        );
      } else {
        // Get all forms without complex ordering
        q = query(collection(db, this.formsCollection), limit(pageSize));
      }

      const querySnapshot = await getDocs(q);
      const forms = [];
      let lastVisible = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        forms.push({
          firestoreId: doc.id, // Store the actual Firestore document ID
          id: doc.id, // Also keep it as 'id' for compatibility
          ...data,
          formDataId: data.id, // Preserve the form's internal ID field separately
        });
        lastVisible = doc;
      });

      // Sort forms by createdAt in memory to avoid index requirements
      forms.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      return {
        success: true,
        forms,
        lastVisible,
        hasMore: forms.length === pageSize,
      };
    } catch (error) {
      console.error("Error getting forms:", error);
      return {
        success: false,
        error: error.message,
        forms: [],
        lastVisible: null,
        hasMore: false,
      };
    }
  }

  // Get form by ID
  async getFormById(formId) {
    try {
      const formDoc = doc(db, this.formsCollection, formId);
      const formSnap = await getDoc(formDoc);

      if (formSnap.exists()) {
        return {
          success: true,
          form: {
            id: formSnap.id,
            ...formSnap.data(),
          },
        };
      } else {
        return {
          success: false,
          error: "Form not found",
        };
      }
    } catch (error) {
      console.error("Error getting form:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update form
  async updateForm(formId, formData) {
    try {
      const formRef = doc(db, this.formsCollection, formId);
      await updateDoc(formRef, {
        ...formData,
        updatedAt: new Date(),
      });

      return {
        success: true,
        message: "Form updated successfully",
      };
    } catch (error) {
      console.error("Error updating form:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get forms by case ID
  async getFormsByCaseId(caseId, formType = null) {
    try {
      let q;

      if (formType) {
        q = query(
          collection(db, this.formsCollection),
          where("caseId", "==", caseId),
          where("formType", "==", formType),
          limit(10)
        );
      } else {
        q = query(
          collection(db, this.formsCollection),
          where("caseId", "==", caseId),
          limit(50)
        );
      }

      const querySnapshot = await getDocs(q);
      const forms = [];

      querySnapshot.forEach((doc) => {
        forms.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Sort forms by createdAt in memory
      forms.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      return {
        success: true,
        forms,
      };
    } catch (error) {
      console.error("Error getting forms by case ID:", error);
      return {
        success: false,
        error: error.message,
        forms: [],
      };
    }
  }

  // Delete form
  async deleteForm(formId) {
    try {
      await deleteDoc(doc(db, this.formsCollection, formId));

      return {
        success: true,
        message: "Form deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting form:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get form statistics
  async getFormStatistics() {
    try {
      const [
        referralResult,
        overviewResult,
        assessmentResult,
        medicalIntakeResult,
        academicsLiteracyResult,
        psychologicalAssessmentResult,
        lifeSkillsSurveyResult,
        birthDeliveryResult,
      ] = await Promise.all([
        this.getForms("initial-referral", 1000),
        this.getForms("child-overview", 1000),
        this.getForms("initial-assessment", 1000),
        this.getForms("medical-intake", 1000),
        this.getForms("academics-literacy", 1000),
        this.getForms("psychological-assessment", 1000),
        this.getForms("life-skills-survey", 1000),
        this.getForms("birth-delivery", 1000),
      ]);

      return {
        success: true,
        statistics: {
          totalReferrals: referralResult.forms.length,
          totalOverviews: overviewResult.forms.length,
          totalAssessments: assessmentResult.forms.length,
          totalMedicalIntakes: medicalIntakeResult.forms.length,
          totalAcademicsLiteracy: academicsLiteracyResult.forms.length,
          totalPsychologicalAssessments:
            psychologicalAssessmentResult.forms.length,
          totalLifeSkillsSurveys: lifeSkillsSurveyResult.forms.length,
          totalBirthDeliveryReports: birthDeliveryResult.forms.length,
          totalForms:
            referralResult.forms.length +
            overviewResult.forms.length +
            assessmentResult.forms.length +
            medicalIntakeResult.forms.length +
            academicsLiteracyResult.forms.length +
            psychologicalAssessmentResult.forms.length +
            lifeSkillsSurveyResult.forms.length +
            birthDeliveryResult.forms.length,
        },
      };
    } catch (error) {
      console.error("Error getting form statistics:", error);
      return {
        success: false,
        error: error.message,
        statistics: {
          totalReferrals: 0,
          totalOverviews: 0,
          totalAssessments: 0,
          totalMedicalIntakes: 0,
          totalAcademicsLiteracy: 0,
          totalPsychologicalAssessments: 0,
          totalLifeSkillsSurveys: 0,
          totalForms: 0,
        },
      };
    }
  }

  // Get analytics data for dashboard
  async getAnalyticsData() {
    try {
      const [
        referralResult,
        overviewResult,
        assessmentResult,
        medicalIntakeResult,
        academicsLiteracyResult,
        psychologicalAssessmentResult,
        lifeSkillsSurveyResult,
        birthDeliveryResult,
      ] = await Promise.all([
        this.getForms("initial-referral", 1000),
        this.getForms("child-overview", 1000),
        this.getForms("initial-assessment", 1000),
        this.getForms("medical-intake", 1000),
        this.getForms("academics-literacy", 1000),
        this.getForms("psychological-assessment", 1000),
        this.getForms("life-skills-survey", 1000),
        this.getForms("birth-delivery", 1000),
      ]);

      const allForms = [
        ...referralResult.forms,
        ...overviewResult.forms,
        ...assessmentResult.forms,
        ...medicalIntakeResult.forms,
        ...academicsLiteracyResult.forms,
        ...psychologicalAssessmentResult.forms,
        ...lifeSkillsSurveyResult.forms,
        ...birthDeliveryResult.forms,
      ];

      return {
        success: true,
        analytics: {
          totalForms: allForms.length,
          totalReferrals: referralResult.forms.length,
          totalOverviews: overviewResult.forms.length,
          totalAssessments: assessmentResult.forms.length,
          totalMedicalIntakes: medicalIntakeResult.forms.length,
          totalAcademicsLiteracy: academicsLiteracyResult.forms.length,
          totalPsychologicalAssessments:
            psychologicalAssessmentResult.forms.length,
          totalLifeSkillsSurveys: lifeSkillsSurveyResult.forms.length,
          totalBirthDeliveryReports: birthDeliveryResult.forms.length,
          formsByType: {
            "initial-referral": referralResult.forms.length,
            "child-overview": overviewResult.forms.length,
            "initial-assessment": assessmentResult.forms.length,
            "medical-intake": medicalIntakeResult.forms.length,
            "academics-literacy": academicsLiteracyResult.forms.length,
            "psychological-assessment":
              psychologicalAssessmentResult.forms.length,
            "life-skills-survey": lifeSkillsSurveyResult.forms.length,
            "birth-delivery": birthDeliveryResult.forms.length,
          },
          formsByStatus: this.analyzeFormsByStatus(allForms),
          ageDistribution: this.analyzeAgeDistribution([
            ...referralResult.forms,
            ...overviewResult.forms,
          ]),
          monthlyTrends: this.analyzeMonthlyTrends(allForms),
          referralMethods: this.analyzeReferralMethods([
            ...referralResult.forms,
            ...overviewResult.forms,
          ]),
          abuseTypes: this.analyzeAbuseTypes(referralResult.forms),
          completionRate: this.calculateCompletionRate(allForms),
          recentActivity: this.getRecentActivity(allForms),
        },
      };
    } catch (error) {
      console.error("Error getting analytics data:", error);
      return {
        success: false,
        error: error.message,
        analytics: null,
      };
    }
  }

  // Analyze forms by status
  analyzeFormsByStatus(forms) {
    const statusCounts = {
      draft: 0,
      completed: 0,
      pending: 0,
    };

    forms.forEach((form) => {
      const status = form.status || "draft";
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    });

    return statusCounts;
  }

  // Analyze age distribution
  analyzeAgeDistribution(forms) {
    const ageGroups = {
      "0-2": 0,
      "3-5": 0,
      "6-8": 0,
      "9-12": 0,
      "13-17": 0,
      "18+": 0,
    };

    forms.forEach((form) => {
      const age = form.age || form.ageAtIntake;
      if (age) {
        const ageNum = parseInt(age);
        if (ageNum >= 0 && ageNum <= 2) ageGroups["0-2"]++;
        else if (ageNum >= 3 && ageNum <= 5) ageGroups["3-5"]++;
        else if (ageNum >= 6 && ageNum <= 8) ageGroups["6-8"]++;
        else if (ageNum >= 9 && ageNum <= 12) ageGroups["9-12"]++;
        else if (ageNum >= 13 && ageNum <= 17) ageGroups["13-17"]++;
        else if (ageNum >= 18) ageGroups["18+"]++;
      }
    });

    return ageGroups;
  }

  // Analyze monthly trends
  analyzeMonthlyTrends(forms) {
    const monthlyData = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize all months with zero counts
    months.forEach((month) => {
      monthlyData[month] = {
        referrals: 0,
        overviews: 0,
        assessments: 0,
        total: 0,
      };
    });

    forms.forEach((form) => {
      const createdAt = form.createdAt?.toDate
        ? form.createdAt.toDate()
        : new Date(form.createdAt);
      const monthName = months[createdAt.getMonth()];

      if (monthlyData[monthName]) {
        monthlyData[monthName].total++;

        switch (form.formType) {
          case "initial-referral":
            monthlyData[monthName].referrals++;
            break;
          case "child-overview":
            monthlyData[monthName].overviews++;
            break;
          case "initial-assessment":
            monthlyData[monthName].assessments++;
            break;
        }
      }
    });

    return monthlyData;
  }

  // Analyze referral methods
  analyzeReferralMethods(forms) {
    const methods = {};

    forms.forEach((form) => {
      const method = form.referralMethod;
      if (method) {
        methods[method] = (methods[method] || 0) + 1;
      }
    });

    return methods;
  }

  // Analyze abuse types from referral forms
  analyzeAbuseTypes(referralForms) {
    const abuseTypes = {};

    referralForms.forEach((form) => {
      const abuseType = form.typeOfAbuse;
      if (abuseType) {
        abuseTypes[abuseType] = (abuseTypes[abuseType] || 0) + 1;
      }
    });

    return abuseTypes;
  }

  // Calculate completion rate
  calculateCompletionRate(forms) {
    if (forms.length === 0) return 0;

    const completedForms = forms.filter(
      (form) => form.status === "completed" || form.status === "complete"
    );
    return Math.round((completedForms.length / forms.length) * 100);
  }

  // Get recent activity
  getRecentActivity(forms) {
    return forms
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        return dateB - dateA;
      })
      .slice(0, 10)
      .map((form) => ({
        id: form.id,
        date: form.createdAt?.toDate
          ? form.createdAt.toDate()
          : new Date(form.createdAt),
        type: this.getFormTypeDisplayName(form.formType),
        childName: this.getChildName(form),
        user: "System User", // You can enhance this if you have user data
        status: this.getStatusDisplayName(form.status || "draft"),
      }));
  }

  // Helper method to get form type display name
  getFormTypeDisplayName(formType) {
    switch (formType) {
      case "initial-referral":
        return "Referral";
      case "child-overview":
        return "Overview";
      case "initial-assessment":
        return "Assessment";
      case "medical-intake":
        return "Medical Intake";
      case "academics-literacy":
        return "Academics & Literacy";
      case "psychological-assessment":
        return "Psychological Assessment";
      case "life-skills-survey":
        return "Life Skills Survey";
      case "birth-delivery":
        return "Birth and Delivery Report";
      case "care-plan-summary":
        return "Care Plan Summary";
      case "care-plan-baby":
        return "Care Plan (Baby)";
      default:
        return "Form";
    }
  }

  // Helper method to get child name from form
  getChildName(form) {
    if (form.childFirstName || form.childLastName) {
      const firstName = form.childFirstName || "";
      const lastName = form.childLastName || form.childSurname || "";
      const name = `${firstName} ${lastName}`.trim();
      return name || "Unknown Child";
    }
    return "Unknown Child";
  }

  // Helper method to get status display name
  getStatusDisplayName(status) {
    switch (status) {
      case "draft":
        return "Draft";
      case "completed":
      case "complete":
        return "Completed";
      case "pending":
        return "Pending";
      case "in_progress":
        return "In Progress";
      default:
        return "Draft";
    }
  }

  // Get data for pivot table
  async getPivotData(dimensions) {
    try {
      const analyticsResult = await this.getAnalyticsData();
      if (!analyticsResult.success) {
        throw new Error(analyticsResult.error);
      }

      const { analytics } = analyticsResult;

      // Generate pivot data based on requested dimensions
      const pivotData = [];

      // Age groups data
      if (dimensions.includes("age_groups")) {
        Object.entries(analytics.ageDistribution).forEach(
          ([ageGroup, count]) => {
            pivotData.push({
              dimension: "Age Group",
              category: ageGroup,
              count: count,
              percentage:
                analytics.totalForms > 0
                  ? Math.round((count / analytics.totalForms) * 100)
                  : 0,
            });
          }
        );
      }

      // Form types data
      if (dimensions.includes("form_types")) {
        Object.entries(analytics.formsByType).forEach(([formType, count]) => {
          pivotData.push({
            dimension: "Form Type",
            category: this.getFormTypeDisplayName(formType),
            count: count,
            percentage:
              analytics.totalForms > 0
                ? Math.round((count / analytics.totalForms) * 100)
                : 0,
          });
        });
      }

      // Status data
      if (dimensions.includes("status")) {
        Object.entries(analytics.formsByStatus).forEach(([status, count]) => {
          pivotData.push({
            dimension: "Status",
            category: this.getStatusDisplayName(status),
            count: count,
            percentage:
              analytics.totalForms > 0
                ? Math.round((count / analytics.totalForms) * 100)
                : 0,
          });
        });
      }

      return {
        success: true,
        data: pivotData,
      };
    } catch (error) {
      console.error("Error generating pivot data:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }
}

export default new FormService();
