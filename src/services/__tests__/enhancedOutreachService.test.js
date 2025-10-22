import EnhancedOutreachService from '../enhancedOutreachService.js';

describe('EnhancedOutreachService', () => {
  beforeEach(async () => {
    // Clear all data before each test
    const forms = await EnhancedOutreachService.getAllForms();
    for (const form of forms) {
      await EnhancedOutreachService.deleteFormLocally(form.id);
    }
    
    const queue = await EnhancedOutreachService.getOfflineQueue();
    for (const item of queue) {
      await EnhancedOutreachService.removeFromOfflineQueue(item.id);
    }
  });

  test('should create form template', () => {
    const form = EnhancedOutreachService.createFormTemplate('initial-referral');
    expect(form).toHaveProperty('id');
    expect(form.formType).toBe('initial-referral');
    expect(form.status).toBe('draft');
    expect(form.synced).toBe(false);
  });

  test('should save and retrieve form locally', async () => {
    const form = EnhancedOutreachService.createFormTemplate('initial-referral');
    form.childName = 'Test Child';
    
    // Save form
    const saveResult = await EnhancedOutreachService.saveFormLocally(form);
    expect(saveResult.success).toBe(true);
    
    // Retrieve form
    const retrievedForm = await EnhancedOutreachService.getFormById(form.id);
    expect(retrievedForm).toEqual(form);
  });

  test('should get all forms', async () => {
    const form1 = EnhancedOutreachService.createFormTemplate('initial-referral');
    const form2 = EnhancedOutreachService.createFormTemplate('child-overview');
    
    await EnhancedOutreachService.saveFormLocally(form1);
    await EnhancedOutreachService.saveFormLocally(form2);
    
    const forms = await EnhancedOutreachService.getAllForms();
    expect(forms).toHaveLength(2);
    expect(forms.map(f => f.id)).toEqual(expect.arrayContaining([form1.id, form2.id]));
  });

  test('should add and remove from offline queue', async () => {
    const form = EnhancedOutreachService.createFormTemplate('initial-referral');
    
    // Add to queue
    await EnhancedOutreachService.addToOfflineQueue(form);
    
    // Check queue
    const queue = await EnhancedOutreachService.getOfflineQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].id).toBe(form.id);
    
    // Remove from queue
    await EnhancedOutreachService.removeFromOfflineQueue(form.id);
    
    // Check queue is empty
    const updatedQueue = await EnhancedOutreachService.getOfflineQueue();
    expect(updatedQueue).toHaveLength(0);
  });
});