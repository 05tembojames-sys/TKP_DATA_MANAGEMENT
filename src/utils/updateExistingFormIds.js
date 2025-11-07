import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { generateChildId } from './childIdGenerator.js';

/**
 * Update existing forms in database to add child IDs
 * This script will:
 * 1. Fetch all forms
 * 2. Group forms by child (name + DOB)
 * 3. Generate consistent child ID for each unique child
 * 4. Update all forms with the appropriate child ID
 */

export async function updateExistingFormIds() {
  const formsCollection = 'forms';
  
  try {
    console.log('🔄 Starting child ID update for existing forms...');
    
    // Get all forms
    const querySnapshot = await getDocs(collection(db, formsCollection));
    console.log(`📋 Found ${querySnapshot.size} total forms`);
    
    const allForms = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      allForms.push({
        id: docSnapshot.id,
        ...data
      });
    });

    // Group forms by child identity
    const childGroups = {};
    
    allForms.forEach(form => {
      // Skip if already has childId (unless it's invalid)
      if (form.childId && form.childId.length === 13) {
        console.log(`✓ Form ${form.id} already has valid child ID: ${form.childId}`);
        return;
      }

      // Extract child information from various form types
      const childInfo = extractChildInfo(form);
      
      if (!childInfo.firstName || !childInfo.lastName) {
        console.warn(`⚠️ Form ${form.id} missing child name, skipping`);
        return;
      }

      // Create unique key for this child
      const childKey = getChildKey(childInfo);
      
      if (!childGroups[childKey]) {
        childGroups[childKey] = {
          childInfo: childInfo,
          forms: []
        };
      }
      
      childGroups[childKey].forms.push(form);
    });

    console.log(`\n👥 Found ${Object.keys(childGroups).length} unique children`);
    
    let updatedCount = 0;
    const updates = [];

    // Generate child ID for each unique child and prepare updates
    for (const childKey in childGroups) {
      const group = childGroups[childKey];
      const childInfo = group.childInfo;
      
      // Generate child ID
      const childId = generateChildId({
        childFirstName: childInfo.firstName,
        childLastName: childInfo.lastName,
        dateOfBirth: childInfo.dateOfBirth,
        tribe: childInfo.tribe || ''
      });

      console.log(`\n🆔 Generated ID for ${childInfo.firstName} ${childInfo.lastName}: ${childId}`);
      console.log(`   📄 Will update ${group.forms.length} form(s)`);

      // Add all forms to update list
      group.forms.forEach(form => {
        updates.push({
          formId: form.id,
          childId: childId,
          childName: `${childInfo.firstName} ${childInfo.lastName}`
        });
      });
    }

    // Confirm before updating
    console.log(`\n⚠️ About to update ${updates.length} forms with child IDs`);
    console.log(`   This will add/update the childId field in your database`);
    
    // Perform updates
    for (const update of updates) {
      try {
        const formRef = doc(db, formsCollection, update.formId);
        await updateDoc(formRef, {
          childId: update.childId,
          updatedAt: new Date()
        });
        
        updatedCount++;
        
        if (updatedCount % 10 === 0) {
          console.log(`   Progress: ${updatedCount}/${updates.length} forms updated`);
        }
      } catch (error) {
        console.error(`   ❌ Failed to update form ${update.formId}:`, error.message);
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total forms processed: ${allForms.length}`);
    console.log(`   - Unique children found: ${Object.keys(childGroups).length}`);
    console.log(`   - Forms updated: ${updatedCount}`);
    console.log(`   - Forms skipped (already had ID): ${allForms.length - updates.length}`);
    
    return {
      success: true,
      totalForms: allForms.length,
      uniqueChildren: Object.keys(childGroups).length,
      formsUpdated: updatedCount,
      formsSkipped: allForms.length - updates.length,
      message: `Successfully updated ${updatedCount} forms with child IDs`
    };
    
  } catch (error) {
    console.error('❌ Error updating form IDs:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract child information from different form types
 */
function extractChildInfo(form) {
  // Try to extract from different possible field names
  const firstName = form.childFirstName || form.firstName || '';
  const lastName = form.childLastName || form.childSurname || form.surname || form.lastName || '';
  const dateOfBirth = form.dateOfBirth || form.dob || '';
  const tribe = form.tribe || '';

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    dateOfBirth: dateOfBirth,
    tribe: tribe.trim()
  };
}

/**
 * Get a unique key for a child
 */
function getChildKey(childInfo) {
  const firstName = childInfo.firstName.toLowerCase();
  const lastName = childInfo.lastName.toLowerCase();
  const dob = childInfo.dateOfBirth || 'no-dob';
  
  return `${firstName}_${lastName}_${dob}`;
}

/**
 * Preview what will be updated without making changes
 */
export async function previewIdUpdates() {
  const formsCollection = 'forms';
  
  try {
    console.log('🔍 Previewing child ID updates...');
    
    const querySnapshot = await getDocs(collection(db, formsCollection));
    const allForms = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      allForms.push({
        id: docSnapshot.id,
        ...data
      });
    });

    const childGroups = {};
    let alreadyHaveId = 0;
    let needUpdate = 0;
    
    allForms.forEach(form => {
      if (form.childId && form.childId.length === 13) {
        alreadyHaveId++;
        return;
      }

      const childInfo = extractChildInfo(form);
      
      if (!childInfo.firstName || !childInfo.lastName) {
        return;
      }

      const childKey = getChildKey(childInfo);
      
      if (!childGroups[childKey]) {
        childGroups[childKey] = {
          childInfo: childInfo,
          formCount: 0,
          formTypes: []
        };
      }
      
      childGroups[childKey].formCount++;
      childGroups[childKey].formTypes.push(form.formType || 'unknown');
      needUpdate++;
    });

    const preview = [];
    for (const childKey in childGroups) {
      const group = childGroups[childKey];
      const childInfo = group.childInfo;
      
      const childId = generateChildId({
        childFirstName: childInfo.firstName,
        childLastName: childInfo.lastName,
        dateOfBirth: childInfo.dateOfBirth,
        tribe: childInfo.tribe || ''
      });

      preview.push({
        childName: `${childInfo.firstName} ${childInfo.lastName}`,
        dateOfBirth: childInfo.dateOfBirth || 'Unknown',
        generatedId: childId,
        formCount: group.formCount,
        formTypes: [...new Set(group.formTypes)]
      });
    }

    console.log('\n📊 Preview Summary:');
    console.log(`   Total forms: ${allForms.length}`);
    console.log(`   Already have child ID: ${alreadyHaveId}`);
    console.log(`   Need update: ${needUpdate}`);
    console.log(`   Unique children: ${Object.keys(childGroups).length}`);
    console.log('\n👥 Children to be updated:');
    
    preview.forEach((item, index) => {
      console.log(`\n   ${index + 1}. ${item.childName}`);
      console.log(`      DOB: ${item.dateOfBirth}`);
      console.log(`      Generated ID: ${item.generatedId}`);
      console.log(`      Forms: ${item.formCount} (${item.formTypes.join(', ')})`);
    });

    return {
      success: true,
      totalForms: allForms.length,
      alreadyHaveId: alreadyHaveId,
      needUpdate: needUpdate,
      uniqueChildren: Object.keys(childGroups).length,
      preview: preview
    };
    
  } catch (error) {
    console.error('❌ Error previewing updates:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Make functions available globally for console use
if (typeof window !== 'undefined') {
  window.updateExistingFormIds = updateExistingFormIds;
  window.previewIdUpdates = previewIdUpdates;
}
