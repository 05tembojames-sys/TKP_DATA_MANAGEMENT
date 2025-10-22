/**
 * Unit tests for OutreachService
 */

import OutreachService from "../outreachService.js";

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock FormService
jest.mock("../formService.js", () => ({
  saveInitialReferral: jest.fn(),
  saveInitialAssessment: jest.fn(),
  saveChildOverview: jest.fn(),
}));

describe("OutreachService", () => {
  beforeEach(() => {
    // Reset mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });
    window.localStorage.clear();

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("createFormTemplate", () => {
    test("should create a form template with correct structure", () => {
      const formType = "initial-referral";
      const template = OutreachService.createFormTemplate(formType);

      expect(template).toHaveProperty("id");
      expect(template).toHaveProperty("formType", formType);
      expect(template).toHaveProperty("status", "draft");
      expect(template).toHaveProperty("synced", false);
      expect(template).toHaveProperty("data");
      expect(template).toHaveProperty("createdAt");
    });
  });

  describe("saveFormLocally", () => {
    test("should save a new form to localStorage", async () => {
      const form = OutreachService.createFormTemplate("initial-referral");
      const result = await OutreachService.saveFormLocally(form);

      expect(result.success).toBe(true);
      expect(result.form).toEqual(form);

      // Verify it's in localStorage
      const forms = OutreachService.getAllFormsFromLocalStorage();
      expect(forms).toHaveLength(1);
      expect(forms[0]).toEqual(form);
    });

    test("should update an existing form in localStorage", async () => {
      // Save initial form
      const form = OutreachService.createFormTemplate("initial-referral");
      await OutreachService.saveFormLocally(form);

      // Update the form
      const updatedForm = { ...form, status: "completed" };
      const result = await OutreachService.saveFormLocally(updatedForm);

      expect(result.success).toBe(true);
      expect(result.form).toEqual(updatedForm);

      // Verify update in localStorage
      const forms = OutreachService.getAllFormsFromLocalStorage();
      expect(forms).toHaveLength(1);
      expect(forms[0]).toEqual(updatedForm);
    });
  });

  describe("getAllFormsFromLocalStorage", () => {
    test("should return empty array when no forms exist", () => {
      const forms = OutreachService.getAllFormsFromLocalStorage();
      expect(forms).toEqual([]);
    });

    test("should return all forms from localStorage", async () => {
      const form1 = OutreachService.createFormTemplate("initial-referral");
      const form2 = OutreachService.createFormTemplate("child-overview");

      await OutreachService.saveFormLocally(form1);
      await OutreachService.saveFormLocally(form2);

      const forms = OutreachService.getAllFormsFromLocalStorage();
      expect(forms).toHaveLength(2);
      expect(forms).toContainEqual(form1);
      expect(forms).toContainEqual(form2);
    });
  });

  describe("getFormById", () => {
    test("should return null when form does not exist", () => {
      const form = OutreachService.getFormById("non-existent-id");
      expect(form).toBeNull();
    });

    test("should return form when it exists", async () => {
      const form = OutreachService.createFormTemplate("initial-referral");
      await OutreachService.saveFormLocally(form);

      const retrievedForm = OutreachService.getFormById(form.id);
      expect(retrievedForm).toEqual(form);
    });
  });

  describe("deleteFormLocally", () => {
    test("should remove form from localStorage", async () => {
      const form = OutreachService.createFormTemplate("initial-referral");
      await OutreachService.saveFormLocally(form);

      // Verify form exists
      let forms = OutreachService.getAllFormsFromLocalStorage();
      expect(forms).toHaveLength(1);

      // Delete form
      const result = await OutreachService.deleteFormLocally(form.id);
      expect(result.success).toBe(true);

      // Verify form is deleted
      forms = OutreachService.getAllFormsFromLocalStorage();
      expect(forms).toHaveLength(0);
    });
  });

  describe("saveSyncHistory", () => {
    test("should save sync history entry", () => {
      const entry = {
        formId: "test-form-id",
        formType: "initial-referral",
        success: true,
        message: "Test sync",
      };

      OutreachService.saveSyncHistory(entry);

      const history = OutreachService.getSyncHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject(entry);
      expect(history[0]).toHaveProperty("timestamp");
    });
  });
});
