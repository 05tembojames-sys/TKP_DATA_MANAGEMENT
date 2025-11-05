import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config.js';

/**
 * Utility to fix form status from "draft" to "submitted" for completed forms
 * Run this once to update existing forms in the database
 * 
 * USAGE IN BROWSER CONSOLE:
 * 1. Open DevTools (F12)
 * 2. Go to Console tab
 * 3. Type: window.fixFormStatus()
 * 4. Press Enter
 */
export async function fixFormStatus() {
  const formsCollection = 'forms';
  
  try {
    console.log('🔄 Starting form status fix...');
    
    // Query all forms with status "draft"
    const q = query(
      collection(db, formsCollection),
      where('status', '==', 'draft')
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`📋 Found ${querySnapshot.size} forms with "draft" status`);
    
    let updatedCount = 0;
    const batch = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const formData = docSnapshot.data();
      
      // Only update if the form appears to be completed (has submittedAt or all required fields)
      // Skip actual drafts (those with isDraft: true)
      if (!formData.isDraft && (formData.submittedAt || formData.completedSections)) {
        batch.push({
          id: docSnapshot.id,
          data: formData
        });
      }
    });
    
    console.log(`✅ Will update ${batch.length} completed forms to "submitted" status`);
    
    // Update in batches
    for (const item of batch) {
      const formRef = doc(db, formsCollection, item.id);
      await updateDoc(formRef, {
        status: 'submitted',
        updatedAt: new Date()
      });
      updatedCount++;
      
      if (updatedCount % 10 === 0) {
        console.log(`Progress: ${updatedCount}/${batch.length} updated`);
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} forms to "submitted" status`);
    
    return {
      success: true,
      updatedCount,
      message: `Updated ${updatedCount} forms from "draft" to "submitted"`
    };
    
  } catch (error) {
    console.error('❌ Error fixing form status:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check how many forms need status fixing
 */
export async function checkFormStatus() {
  const formsCollection = 'forms';
  
  try {
    const q = query(
      collection(db, formsCollection),
      where('status', '==', 'draft')
    );
    
    const querySnapshot = await getDocs(q);
    const draftForms = [];
    const actualDrafts = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const formData = docSnapshot.data();
      const formInfo = {
        id: docSnapshot.id,
        formType: formData.formType,
        childName: `${formData.childFirstName || ''} ${formData.childSurname || ''}`.trim(),
        isDraft: formData.isDraft || false,
        hasSubmittedAt: !!formData.submittedAt,
        createdAt: formData.createdAt?.toDate?.() || formData.createdAt
      };
      
      if (formData.isDraft) {
        actualDrafts.push(formInfo);
      } else {
        draftForms.push(formInfo);
      }
    });
    
    console.log('📊 Status Report:');
    console.log(`   - ${draftForms.length} completed forms incorrectly marked as "draft"`);
    console.log(`   - ${actualDrafts.length} actual drafts (auto-saved)`);
    
    return {
      success: true,
      completedFormsWithDraftStatus: draftForms,
      actualDrafts: actualDrafts,
      totalDrafts: querySnapshot.size
    };
    
  } catch (error) {
    console.error('❌ Error checking form status:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
