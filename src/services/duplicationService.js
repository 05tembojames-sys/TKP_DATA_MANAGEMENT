import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config.js'

/**
 * Duplication Prevention Service
 * Checks for duplicate records across all data types
 */
class DuplicationService {
  
  // Check for duplicate child records
  async checkDuplicateChild(childData) {
    try {
      const duplicates = []
      const formsCollection = collection(db, 'forms')
      
      // Check 1: Exact name + DOB match (most strict)
      if (childData.childFirstName && childData.childSurname && childData.dateOfBirth) {
        const exactMatchQuery = query(
          formsCollection,
          where('formType', '==', 'child-overview'),
          where('childFirstName', '==', childData.childFirstName),
          where('childSurname', '==', childData.childSurname),
          where('dateOfBirth', '==', childData.dateOfBirth)
        )
        
        const exactMatches = await getDocs(exactMatchQuery)
        
        if (!exactMatches.empty) {
          exactMatches.forEach(doc => {
            duplicates.push({
              id: doc.id,
              type: 'exact_match',
              confidence: 100,
              reason: 'Exact name and date of birth match',
              data: doc.data()
            })
          })
        }
      }
      
      // Check 2: Name match with similar age
      if (childData.childFirstName && childData.childSurname && childData.ageAtIntake) {
        const nameQuery = query(
          formsCollection,
          where('formType', '==', 'child-overview'),
          where('childFirstName', '==', childData.childFirstName),
          where('childSurname', '==', childData.childSurname)
        )
        
        const nameMatches = await getDocs(nameQuery)
        
        nameMatches.forEach(doc => {
          const existingData = doc.data()
          const ageDiff = Math.abs(existingData.ageAtIntake - childData.ageAtIntake)
          
          // If age difference is 2 years or less, flag as potential duplicate
          if (ageDiff <= 2) {
            // Check if not already added as exact match
            if (!duplicates.find(d => d.id === doc.id)) {
              duplicates.push({
                id: doc.id,
                type: 'similar_match',
                confidence: 85,
                reason: `Similar name with age difference of ${ageDiff} year(s)`,
                data: existingData
              })
            }
          }
        })
      }
      
      // Check 3: Unique ID match
      if (childData.id) {
        const idQuery = query(
          formsCollection,
          where('formType', '==', 'child-overview'),
          where('id', '==', childData.id)
        )
        
        const idMatches = await getDocs(idQuery)
        
        if (!idMatches.empty) {
          idMatches.forEach(doc => {
            if (!duplicates.find(d => d.id === doc.id)) {
              duplicates.push({
                id: doc.id,
                type: 'id_match',
                confidence: 95,
                reason: 'Child ID already exists',
                data: doc.data()
              })
            }
          })
        }
      }
      
      return {
        success: true,
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates
      }
      
    } catch (error) {
      console.error('Error checking for duplicate child:', error)
      return {
        success: false,
        error: error.message,
        hasDuplicates: false,
        duplicates: []
      }
    }
  }
  
  // Check for duplicate users (email/username)
  async checkDuplicateUser(userData, excludeUserId = null) {
    try {
      const duplicates = []
      const usersCollection = collection(db, 'users')
      
      // Check email duplication
      if (userData.email) {
        const emailQuery = query(
          usersCollection,
          where('email', '==', userData.email.toLowerCase())
        )
        
        const emailMatches = await getDocs(emailQuery)
        
        emailMatches.forEach(doc => {
          // Exclude current user if updating
          if (doc.id !== excludeUserId) {
            duplicates.push({
              id: doc.id,
              field: 'email',
              value: userData.email,
              type: 'exact_match',
              confidence: 100,
              reason: 'Email address already registered',
              data: doc.data()
            })
          }
        })
      }
      
      // Check username duplication
      if (userData.username) {
        const usernameQuery = query(
          usersCollection,
          where('username', '==', userData.username.toLowerCase())
        )
        
        const usernameMatches = await getDocs(usernameQuery)
        
        usernameMatches.forEach(doc => {
          // Exclude current user if updating
          if (doc.id !== excludeUserId) {
            duplicates.push({
              id: doc.id,
              field: 'username',
              value: userData.username,
              type: 'exact_match',
              confidence: 100,
              reason: 'Username already taken',
              data: doc.data()
            })
          }
        })
      }
      
      return {
        success: true,
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates
      }
      
    } catch (error) {
      console.error('Error checking for duplicate user:', error)
      return {
        success: false,
        error: error.message,
        hasDuplicates: false,
        duplicates: []
      }
    }
  }
  
  // Check for duplicate tracker cases
  // Note: Tracker cases are derived from forms, so we check the forms collection instead
  async checkDuplicateTrackerCase(caseData) {
    try {
      const duplicates = []
      const formsCollection = collection(db, 'forms')
      
      // Check all form types for this child
      if (caseData.childFirstName && caseData.childLastName && caseData.dateOfBirth) {
        const nameQuery = query(
          formsCollection,
          where('childFirstName', '==', caseData.childFirstName),
          where('childSurname', '==', caseData.childLastName),
          where('dateOfBirth', '==', caseData.dateOfBirth)
        )
        
        const matches = await getDocs(nameQuery)
        
        matches.forEach(doc => {
          duplicates.push({
            id: doc.id,
            type: 'exact_match',
            confidence: 100,
            reason: 'Child with same name and DOB already exists in system',
            data: doc.data()
          })
        })
      }
      
      // Check by case ID if provided (stored in forms)
      if (caseData.caseId) {
        const idQuery = query(
          formsCollection,
          where('caseId', '==', caseData.caseId)
        )
        
        const idMatches = await getDocs(idQuery)
        
        idMatches.forEach(doc => {
          if (!duplicates.find(d => d.id === doc.id)) {
            duplicates.push({
              id: doc.id,
              type: 'id_match',
              confidence: 100,
              reason: 'Case ID already exists',
              data: doc.data()
            })
          }
        })
      }
      
      return {
        success: true,
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates
      }
      
    } catch (error) {
      console.error('Error checking for duplicate tracker case:', error)
      return {
        success: false,
        error: error.message,
        hasDuplicates: false,
        duplicates: []
      }
    }
  }
  
  // Check for duplicate initial referral forms
  async checkDuplicateReferral(referralData) {
    try {
      const duplicates = []
      const formsCollection = collection(db, 'forms')
      
      // Check by child name and referral date
      if (referralData.childFirstName && referralData.childLastName && referralData.dateOfReferral) {
        const referralQuery = query(
          formsCollection,
          where('formType', '==', 'initial-referral'),
          where('childFirstName', '==', referralData.childFirstName),
          where('childLastName', '==', referralData.childLastName),
          where('dateOfReferral', '==', referralData.dateOfReferral)
        )
        
        const matches = await getDocs(referralQuery)
        
        matches.forEach(doc => {
          duplicates.push({
            id: doc.id,
            type: 'exact_match',
            confidence: 95,
            reason: 'Referral for same child on same date already exists',
            data: doc.data()
          })
        })
      }
      
      return {
        success: true,
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates
      }
      
    } catch (error) {
      console.error('Error checking for duplicate referral:', error)
      return {
        success: false,
        error: error.message,
        hasDuplicates: false,
        duplicates: []
      }
    }
  }
  
  // Generic fuzzy matching for text fields (helper function)
  calculateStringSimilarity(str1, str2) {
    if (!str1 || !str2) return 0
    
    str1 = str1.toLowerCase().trim()
    str2 = str2.toLowerCase().trim()
    
    if (str1 === str2) return 100
    
    // Simple Levenshtein distance algorithm
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) track[0][i] = i
    for (let j = 0; j <= str2.length; j++) track[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        )
      }
    }
    
    const maxLength = Math.max(str1.length, str2.length)
    const distance = track[str2.length][str1.length]
    const similarity = ((maxLength - distance) / maxLength) * 100
    
    return Math.round(similarity)
  }
  
  // Format duplicate warning message
  formatDuplicateWarning(duplicates) {
    if (duplicates.length === 0) return ''
    
    const messages = duplicates.map(dup => {
      const childName = dup.data.childFirstName && dup.data.childSurname 
        ? `${dup.data.childFirstName} ${dup.data.childSurname}`
        : 'Unknown Child'
      
      return `• ${childName} - ${dup.reason} (${dup.confidence}% match)`
    })
    
    return `⚠️ Potential duplicate records found:\n\n${messages.join('\n')}`
  }
}

export default new DuplicationService()
