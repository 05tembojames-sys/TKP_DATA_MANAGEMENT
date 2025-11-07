/**
 * Child ID Generator Utility
 * Generates consistent unique IDs for children across all forms
 * Format: AABB0325XX001
 * - AA: First 2 letters of first name
 * - BB: First 2 letters of last name
 * - 03: Location code (Lusaka)
 * - 25: Year (last 2 digits)
 * - XX: First 2 letters of tribe
 * - 001: Sequence number
 */

/**
 * Generate a unique child ID based on child information
 * @param {Object} childData - Child information object
 * @param {string} childData.childFirstName - Child's first name
 * @param {string} childData.childLastName or childData.childSurname - Child's last name
 * @param {string} childData.tribe - Child's tribe
 * @param {string} childData.dateOfBirth - Child's date of birth (optional, for uniqueness)
 * @returns {string} Unique child ID
 */
export function generateChildId(childData) {
  const firstName = (childData.childFirstName || "").toUpperCase().trim();
  const lastName = (childData.childLastName || childData.childSurname || "").toUpperCase().trim();
  const tribe = (childData.tribe || "").toUpperCase().trim();

  const firstNamePrefix = firstName.substring(0, 2).padEnd(2, "X");
  const lastNamePrefix = lastName.substring(0, 2).padEnd(2, "X");
  const locationCode = "03"; // Lusaka code
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const tribePrefix = tribe.substring(0, 2).padEnd(2, "X");
  
  // Generate sequence from date of birth if available, otherwise use 001
  let sequence = "001";
  if (childData.dateOfBirth) {
    try {
      const dob = new Date(childData.dateOfBirth);
      const month = (dob.getMonth() + 1).toString().padStart(2, "0");
      const day = dob.getDate().toString().padStart(2, "0");
      // Use month + day % 1000 to create a 3-digit sequence
      sequence = ((parseInt(month) * 31 + parseInt(day)) % 1000).toString().padStart(3, "0");
    } catch (e) {
      console.warn("Could not parse date of birth for sequence generation");
    }
  }

  return `${firstNamePrefix}${lastNamePrefix}${locationCode}${currentYear}${tribePrefix}${sequence}`;
}

/**
 * Store child ID in session storage for cross-form access
 * @param {string} childId - The child ID to store
 * @param {Object} childData - Additional child data to store
 */
export function storeChildId(childId, childData) {
  const childInfo = {
    childId,
    childFirstName: childData.childFirstName || "",
    childLastName: childData.childLastName || childData.childSurname || "",
    dateOfBirth: childData.dateOfBirth || "",
    tribe: childData.tribe || "",
    createdAt: new Date().toISOString()
  };
  
  sessionStorage.setItem('currentChildId', childId);
  sessionStorage.setItem('currentChildData', JSON.stringify(childInfo));
}

/**
 * Retrieve stored child ID from session storage
 * @returns {string|null} The stored child ID or null if not found
 */
export function getStoredChildId() {
  return sessionStorage.getItem('currentChildId');
}

/**
 * Retrieve stored child data from session storage
 * @returns {Object|null} The stored child data or null if not found
 */
export function getStoredChildData() {
  const data = sessionStorage.getItem('currentChildData');
  return data ? JSON.parse(data) : null;
}

/**
 * Clear stored child ID from session storage
 */
export function clearStoredChildId() {
  sessionStorage.removeItem('currentChildId');
  sessionStorage.removeItem('currentChildData');
}

/**
 * Check if a child ID already exists for the given child data
 * Useful for preventing duplicate IDs
 * @param {Object} childData - Child information object
 * @returns {string|null} Existing child ID or null
 */
export function checkExistingChildId(childData) {
  const storedData = getStoredChildData();
  
  if (!storedData) return null;
  
  // Check if the stored data matches the current child
  const firstNameMatch = storedData.childFirstName.toLowerCase() === (childData.childFirstName || "").toLowerCase();
  const lastNameMatch = storedData.childLastName.toLowerCase() === (childData.childLastName || childData.childSurname || "").toLowerCase();
  const dobMatch = !childData.dateOfBirth || storedData.dateOfBirth === childData.dateOfBirth;
  
  if (firstNameMatch && lastNameMatch && dobMatch) {
    return storedData.childId;
  }
  
  return null;
}

/**
 * Get or generate child ID - returns existing ID if found, generates new one if not
 * @param {Object} childData - Child information object
 * @returns {string} Child ID
 */
export function getOrGenerateChildId(childData) {
  // First check if we have a stored ID for this child
  const existingId = checkExistingChildId(childData);
  
  if (existingId) {
    console.log('✅ Using existing child ID:', existingId);
    return existingId;
  }
  
  // Generate new ID
  const newId = generateChildId(childData);
  console.log('🆕 Generated new child ID:', newId);
  
  // Store it for future use
  storeChildId(newId, childData);
  
  return newId;
}

/**
 * Validate child ID format
 * @param {string} childId - The child ID to validate
 * @returns {boolean} True if valid format
 */
export function validateChildId(childId) {
  // Format: AABB0325XX001 (13 characters)
  const pattern = /^[A-Z]{2}[A-Z]{2}\d{2}\d{2}[A-Z]{2}\d{3}$/;
  return pattern.test(childId);
}

/**
 * Parse child ID into components
 * @param {string} childId - The child ID to parse
 * @returns {Object} Parsed components
 */
export function parseChildId(childId) {
  if (!validateChildId(childId)) {
    return null;
  }
  
  return {
    firstNamePrefix: childId.substring(0, 2),
    lastNamePrefix: childId.substring(2, 4),
    locationCode: childId.substring(4, 6),
    year: childId.substring(6, 8),
    tribePrefix: childId.substring(8, 10),
    sequence: childId.substring(10, 13),
    fullId: childId
  };
}
