import { ref, watch, onMounted, onUnmounted } from 'vue';
import FormService from '../services/formService.js';

/**
 * Composable for auto-saving form data to Firebase
 * Saves drafts periodically and allows all users to access the data
 * 
 * @param {Object} formData - Reactive form data object
 * @param {String} formType - Type of form (e.g., 'child-overview', 'initial-referral')
 * @param {String} formId - Existing form ID (for editing existing forms)
 * @param {Number} saveInterval - Auto-save interval in milliseconds (default: 30000 = 30 seconds)
 */
export function useFormAutoSave(formData, formType, formId = null, saveInterval = 30000) {
  const isSaving = ref(false);
  const lastSaved = ref(null);
  const autoSaveEnabled = ref(true);
  const draftId = ref(formId);
  const hasUnsavedChanges = ref(false);
  let saveTimer = null;
  let watcherStopHandle = null;

  /**
   * Save draft to Firebase
   */
  const saveDraft = async () => {
    if (!autoSaveEnabled.value || isSaving.value) {
      return { success: false, message: 'Auto-save disabled or already saving' };
    }

    // Don't save if form is essentially empty
    const hasData = Object.values(formData).some(value => {
      return value && value !== '' && value !== null && value !== undefined;
    });

    if (!hasData) {
      return { success: false, message: 'No data to save' };
    }

    isSaving.value = true;
    try {
      let result;
      
      if (draftId.value) {
        // Update existing draft
        result = await FormService.updateDraft(draftId.value, formData, formType);
      } else {
        // Create new draft
        result = await FormService.saveDraft(formData, formType);
        if (result.success && result.id) {
          draftId.value = result.id;
        }
      }

      if (result.success) {
        lastSaved.value = new Date();
        hasUnsavedChanges.value = false;
        console.log(`✅ Draft auto-saved at ${lastSaved.value.toLocaleTimeString()}`);
      }

      return result;
    } catch (error) {
      console.error('Error auto-saving draft:', error);
      return { success: false, error: error.message };
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Load existing draft from Firebase
   */
  const loadDraft = async (loadFormId = null) => {
    const idToLoad = loadFormId || draftId.value;
    if (!idToLoad) return { success: false, message: 'No draft ID provided' };

    try {
      const result = await FormService.getFormById(idToLoad);
      if (result.success && result.form) {
        // Populate form data
        Object.keys(formData).forEach(key => {
          if (result.form[key] !== undefined) {
            formData[key] = result.form[key];
          }
        });
        
        draftId.value = idToLoad;
        lastSaved.value = result.form.updatedAt?.toDate() || result.form.createdAt?.toDate();
        hasUnsavedChanges.value = false;
        console.log('✅ Draft loaded successfully');
        return { success: true, form: result.form };
      }
      return result;
    } catch (error) {
      console.error('Error loading draft:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Delete draft from Firebase
   */
  const deleteDraft = async () => {
    if (!draftId.value) return { success: false, message: 'No draft to delete' };

    try {
      const result = await FormService.deleteForm(draftId.value);
      if (result.success) {
        draftId.value = null;
        lastSaved.value = null;
        hasUnsavedChanges.value = false;
        console.log('✅ Draft deleted successfully');
      }
      return result;
    } catch (error) {
      console.error('Error deleting draft:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Manually trigger save
   */
  const saveNow = async () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    return await saveDraft();
  };

  /**
   * Start auto-save timer
   */
  const startAutoSave = () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    // Watch for changes in form data
    if (!watcherStopHandle) {
      watcherStopHandle = watch(
        formData,
        () => {
          hasUnsavedChanges.value = true;
          
          // Debounce: restart timer on each change
          if (saveTimer) {
            clearTimeout(saveTimer);
          }
          
          saveTimer = setTimeout(() => {
            saveDraft();
          }, saveInterval);
        },
        { deep: true }
      );
    }

    autoSaveEnabled.value = true;
    console.log(`🔄 Auto-save enabled (interval: ${saveInterval / 1000}s)`);
  };

  /**
   * Stop auto-save timer
   */
  const stopAutoSave = () => {
    autoSaveEnabled.value = false;
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    if (watcherStopHandle) {
      watcherStopHandle();
      watcherStopHandle = null;
    }
    console.log('⏸️ Auto-save disabled');
  };

  /**
   * Initialize auto-save
   */
  onMounted(() => {
    startAutoSave();
  });

  /**
   * Cleanup on unmount
   */
  onUnmounted(() => {
    stopAutoSave();
  });

  return {
    // State
    isSaving,
    lastSaved,
    autoSaveEnabled,
    draftId,
    hasUnsavedChanges,
    
    // Methods
    saveDraft,
    loadDraft,
    deleteDraft,
    saveNow,
    startAutoSave,
    stopAutoSave,
  };
}
