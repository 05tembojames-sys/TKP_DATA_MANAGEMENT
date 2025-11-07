import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config.js';

/**
 * Utility to clean up duplicate forms and old drafts
 * This will:
 * 1. Remove drafts that have corresponding submitted versions
 * 2. Keep only the latest version of duplicate submissions
 * 3. Update draft status for completed forms
 */

export async function cleanupDuplicateForms() {
  const formsCollection = 'forms';
  
  try {
    console.log('🔄 Starting duplicate forms cleanup...');
    
    // Get all forms
    const querySnapshot = await getDocs(collection(db, formsCollection));
    console.log(`📋 Found ${querySnapshot.size} total forms`);
    
    const allForms = [];
    querySnapshot.forEach((docSnapshot) => {
      allForms.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      });
    });

    // Group forms by child (using name and DOB)
    const formGroups = {};
    
    allForms.forEach(form => {
      // Create a unique key for each child
      const childKey = getChildKey(form);
      
      if (!formGroups[childKey]) {
        formGroups[childKey] = {};
      }
      
      // Group by form type
      const formType = form.formType || 'unknown';
      if (!formGroups[childKey][formType]) {
        formGroups[childKey][formType] = [];
      }
      
      formGroups[childKey][formType].push(form);
    });

    let deletedCount = 0;
    let updatedCount = 0;
    const formsToDelete = [];

    // Process each child's forms
    for (const childKey in formGroups) {
      for (const formType in formGroups[childKey]) {
        const forms = formGroups[childKey][formType];
        
        if (forms.length > 1) {
          console.log(`\n👥 Found ${forms.length} ${formType} forms for ${childKey}`);
          
          // Sort by creation date (newest first)
          forms.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
          });

          // Separate submitted and draft forms
          const submittedForms = forms.filter(f => f.status === 'submitted' && !f.isDraft);
          const draftForms = forms.filter(f => f.status === 'draft' || f.isDraft === true);

          if (submittedForms.length > 0) {
            // Keep only the latest submitted form
            const latestSubmitted = submittedForms[0];
            console.log(`✅ Keeping submitted form: ${latestSubmitted.id}`);
            
            // Delete all other submitted versions (older duplicates)
            for (let i = 1; i < submittedForms.length; i++) {
              console.log(`🗑️ Marking duplicate submitted form for deletion: ${submittedForms[i].id}`);
              formsToDelete.push(submittedForms[i].id);
            }
            
            // Delete ALL draft versions since we have a submitted version
            draftForms.forEach(draft => {
              console.log(`🗑️ Marking draft form for deletion: ${draft.id}`);
              formsToDelete.push(draft.id);
            });
          } else if (draftForms.length > 1) {
            // No submitted forms, keep only the latest draft
            const latestDraft = draftForms[0];
            console.log(`📝 Keeping latest draft: ${latestDraft.id}`);
            
            // Delete older drafts
            for (let i = 1; i < draftForms.length; i++) {
              console.log(`🗑️ Marking old draft for deletion: ${draftForms[i].id}`);
              formsToDelete.push(draftForms[i].id);
            }
          }
        }
      }
    }

    // Delete marked forms
    console.log(`\n🗑️ Deleting ${formsToDelete.length} duplicate forms...`);
    for (const formId of formsToDelete) {
      try {
        await deleteDoc(doc(db, formsCollection, formId));
        deletedCount++;
        
        if (deletedCount % 10 === 0) {
          console.log(`Progress: ${deletedCount}/${formsToDelete.length} deleted`);
        }
      } catch (error) {
        console.error(`Error deleting form ${formId}:`, error);
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total forms scanned: ${allForms.length}`);
    console.log(`   - Duplicate forms deleted: ${deletedCount}`);
    console.log(`   - Forms remaining: ${allForms.length - deletedCount}`);
    
    return {
      success: true,
      totalScanned: allForms.length,
      deleted: deletedCount,
      remaining: allForms.length - deletedCount,
      message: `Successfully deleted ${deletedCount} duplicate forms`
    };
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get a unique key for a child based on their information
 */
function getChildKey(form) {
  const firstName = (form.childFirstName || '').toLowerCase().trim();
  const lastName = (form.childLastName || form.childSurname || '').toLowerCase().trim();
  const dob = form.dateOfBirth || '';
  
  return `${firstName}_${lastName}_${dob}`;
}

/**
 * Preview duplicates without deleting
 */
export async function previewDuplicates() {
  const formsCollection = 'forms';
  
  try {
    console.log('🔍 Scanning for duplicates...');
    
    // Get all forms
    const querySnapshot = await getDocs(collection(db, formsCollection));
    const allForms = [];
    
    querySnapshot.forEach((docSnapshot) => {
      allForms.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      });
    });

    // Group forms by child
    const formGroups = {};
    
    allForms.forEach(form => {
      const childKey = getChildKey(form);
      
      if (!formGroups[childKey]) {
        formGroups[childKey] = {};
      }
      
      const formType = form.formType || 'unknown';
      if (!formGroups[childKey][formType]) {
        formGroups[childKey][formType] = [];
      }
      
      formGroups[childKey][formType].push(form);
    });

    const duplicateReport = [];
    let totalDuplicates = 0;

    // Find duplicates
    for (const childKey in formGroups) {
      for (const formType in formGroups[childKey]) {
        const forms = formGroups[childKey][formType];
        
        if (forms.length > 1) {
          const submittedCount = forms.filter(f => f.status === 'submitted').length;
          const draftCount = forms.filter(f => f.status === 'draft' || f.isDraft).length;
          
          duplicateReport.push({
            child: childKey,
            formType: formType,
            total: forms.length,
            submitted: submittedCount,
            drafts: draftCount,
            willDelete: forms.length - 1, // Keep only 1
            forms: forms.map(f => ({
              id: f.id,
              status: f.status,
              isDraft: f.isDraft,
              createdAt: f.createdAt?.toDate ? f.createdAt.toDate().toISOString() : f.createdAt
            }))
          });
          
          totalDuplicates += (forms.length - 1);
        }
      }
    }

    console.log('\n📊 Duplicate Forms Report:');
    console.log(`Total forms: ${allForms.length}`);
    console.log(`Forms with duplicates: ${duplicateReport.length}`);
    console.log(`Total duplicates to remove: ${totalDuplicates}`);
    console.log('\nDetails:', duplicateReport);

    return {
      success: true,
      totalForms: allForms.length,
      duplicateGroups: duplicateReport.length,
      totalDuplicates: totalDuplicates,
      details: duplicateReport
    };
    
  } catch (error) {
    console.error('❌ Error scanning duplicates:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Preview keeping only ONE form per child name
 * Shows all forms for each child, allowing selection of which ONE to keep
 */
export async function previewOneFormPerChild() {
  const formsCollection = 'forms';
  
  try {
    console.log('🔍 Scanning for multiple forms per child...');
    
    // Get all forms
    const querySnapshot = await getDocs(collection(db, formsCollection));
    const allForms = [];
    
    querySnapshot.forEach((docSnapshot) => {
      allForms.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      });
    });

    // Group ALL forms by child name only (ignore form type)
    const childGroups = {};
    
    allForms.forEach(form => {
      // Use only name for grouping, not form type
      const firstName = (form.childFirstName || '').toLowerCase().trim();
      const lastName = (form.childLastName || form.childSurname || '').toLowerCase().trim();
      const childKey = `${firstName}_${lastName}`;
      
      if (!childKey || childKey === '_') return; // Skip invalid entries
      
      if (!childGroups[childKey]) {
        childGroups[childKey] = {
          childName: `${form.childFirstName || ''} ${form.childLastName || form.childSurname || ''}`.trim(),
          forms: []
        };
      }
      
      childGroups[childKey].forms.push({
        id: form.id,
        formType: form.formType || 'unknown',
        status: form.status || 'unknown',
        isDraft: form.isDraft || false,
        childId: form.childId || '',
        createdAt: form.createdAt?.toDate ? form.createdAt.toDate() : new Date(form.createdAt || Date.now()),
        dateOfBirth: form.dateOfBirth || '',
        data: form
      });
    });

    // Find children with multiple forms
    const duplicates = [];
    let totalExtraForms = 0;

    for (const childKey in childGroups) {
      const group = childGroups[childKey];
      
      if (group.forms.length > 1) {
        // Sort forms by date (newest first)
        group.forms.sort((a, b) => b.createdAt - a.createdAt);
        
        // Determine which form to keep (prefer submitted over draft, and newest)
        const submittedForms = group.forms.filter(f => f.status === 'submitted');
        const recommendedKeep = submittedForms.length > 0 ? submittedForms[0] : group.forms[0];
        
        // Mark others for deletion
        const formsToDelete = group.forms.filter(f => f.id !== recommendedKeep.id);
        
        duplicates.push({
          childName: group.childName,
          totalForms: group.forms.length,
          formsToDelete: formsToDelete.length,
          recommendedKeep: {
            id: recommendedKeep.id,
            formType: recommendedKeep.formType,
            status: recommendedKeep.status,
            createdAt: recommendedKeep.createdAt.toISOString(),
            reason: 'Most recent ' + (recommendedKeep.status === 'submitted' ? 'submitted' : 'form')
          },
          allForms: group.forms.map(f => ({
            id: f.id,
            formType: f.formType,
            status: f.status,
            isDraft: f.isDraft,
            childId: f.childId,
            createdAt: f.createdAt.toISOString(),
            dateOfBirth: f.dateOfBirth,
            recommended: f.id === recommendedKeep.id
          }))
        });
        
        totalExtraForms += formsToDelete.length;
      }
    }

    console.log('\n📊 One Form Per Child Report:');
    console.log(`Total forms: ${allForms.length}`);
    console.log(`Children with multiple forms: ${duplicates.length}`);
    console.log(`Extra forms to remove: ${totalExtraForms}`);

    return {
      success: true,
      totalForms: allForms.length,
      childrenWithDuplicates: duplicates.length,
      totalExtraForms: totalExtraForms,
      duplicates: duplicates
    };
    
  } catch (error) {
    console.error('❌ Error scanning forms:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete selected forms to keep only one per child
 */
export async function deleteExtraFormsPerChild(formIdsToDelete) {
  const formsCollection = 'forms';
  
  try {
    console.log(`🗑️ Deleting ${formIdsToDelete.length} extra forms...`);
    
    let deletedCount = 0;
    
    for (const formId of formIdsToDelete) {
      try {
        await deleteDoc(doc(db, formsCollection, formId));
        deletedCount++;
        
        if (deletedCount % 10 === 0) {
          console.log(`Progress: ${deletedCount}/${formIdsToDelete.length} deleted`);
        }
      } catch (error) {
        console.error(`Error deleting form ${formId}:`, error);
      }
    }

    console.log(`✅ Deleted ${deletedCount} forms successfully!`);
    
    return {
      success: true,
      deleted: deletedCount,
      message: `Successfully deleted ${deletedCount} extra forms`
    };
    
  } catch (error) {
    console.error('❌ Error deleting forms:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Make functions available globally for console use
if (typeof window !== 'undefined') {
  window.cleanupDuplicateForms = cleanupDuplicateForms;
  window.previewDuplicates = previewDuplicates;
  window.previewOneFormPerChild = previewOneFormPerChild;
  window.deleteExtraFormsPerChild = deleteExtraFormsPerChild;
}
