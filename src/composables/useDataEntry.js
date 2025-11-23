import { ref, computed, watch } from 'vue';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, orderBy, limit as fbLimit } from 'firebase/firestore';
import * as XLSX from 'xlsx';

/**
 * Advanced Data Entry Composable
 * Provides comprehensive functionality for aggregate data entry
 */
export function useDataEntry() {
    // State
    const isOnline = ref(navigator.onLine);
    const pendingChanges = ref([]);
    const offlineStorage = ref(new Map());
    const validationErrors = ref([]);
    const auditLog = ref([]);
    const comments = ref(new Map());
    const dataHistory = ref([]);
    const templates = ref([]);

    // Offline Mode Detection
    const setupOfflineMode = () => {
        window.addEventListener('online', () => {
            isOnline.value = true;
            syncPendingChanges();
        });

        window.addEventListener('offline', () => {
            isOnline.value = false;
        });
    };

    // 1. EXPORT TO EXCEL/CSV
    const exportToExcel = (data, metadata, filename = 'data-entry-export') => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Add metadata header
            XLSX.utils.sheet_add_aoa(worksheet, [
                [`Organisation Unit: ${metadata.orgUnit}`],
                [`Data Set: ${metadata.dataSet}`],
                [`Period: ${metadata.period}`],
                [`Exported: ${new Date().toISOString()}`],
                [] // Empty row
            ], { origin: 'A1' });

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Entry');

            XLSX.writeFile(workbook, `${filename}.xlsx`);
            return { success: true, message: 'Data exported successfully' };
        } catch (error) {
            console.error('Export error:', error);
            return { success: false, error: error.message };
        }
    };

    const exportToCSV = (data, filename = 'data-entry-export') => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const csv = XLSX.utils.sheet_to_csv(worksheet);

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.csv`;
            link.click();

            return { success: true, message: 'Data exported successfully' };
        } catch (error) {
            console.error('Export error:', error);
            return { success: false, error: error.message };
        }
    };

    // 2. IMPORT FROM EXCEL/CSV
    const importFromExcel = async (file) => {
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Skip metadata rows and parse data
            const dataRows = jsonData.slice(5); // Skip first 5 rows (metadata + header)
            const headers = dataRows[0];
            const rows = dataRows.slice(1);

            const parsedData = rows.map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                return obj;
            });

            return { success: true, data: parsedData };
        } catch (error) {
            console.error('Import error:', error);
            return { success: false, error: error.message };
        }
    };

    // 3. COPY PREVIOUS PERIOD DATA
    const copyPreviousPeriodData = async (currentKey, previousPeriodKey) => {
        try {
            const previousDoc = await getDoc(doc(db, 'aggregateData', previousPeriodKey));

            if (!previousDoc.exists()) {
                return { success: false, error: 'No data found for previous period' };
            }

            const previousData = previousDoc.data();

            // Create audit entry
            await addAuditEntry({
                action: 'COPY_PERIOD',
                source: previousPeriodKey,
                target: currentKey,
                timestamp: new Date()
            });

            return { success: true, data: previousData.values };
        } catch (error) {
            console.error('Copy period error:', error);
            return { success: false, error: error.message };
        }
    };

    // 4. CLEAR DATA
    const clearAllData = async (dataKey) => {
        try {
            await setDoc(doc(db, 'aggregateData', dataKey), {
                values: {},
                lastUpdated: new Date(),
                clearedBy: 'current-user',
                clearedAt: new Date()
            }, { merge: true });

            await addAuditEntry({
                action: 'CLEAR_DATA',
                dataKey,
                timestamp: new Date()
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // 5. DATA TEMPLATES
    const saveTemplate = async (templateName, data, metadata) => {
        try {
            await addDoc(collection(db, 'dataTemplates'), {
                name: templateName,
                data,
                metadata,
                createdBy: 'current-user',
                createdAt: new Date()
            });

            return { success: true, message: 'Template saved successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const loadTemplate = async (templateId) => {
        try {
            const templateDoc = await getDoc(doc(db, 'dataTemplates', templateId));
            if (!templateDoc.exists()) {
                return { success: false, error: 'Template not found' };
            }

            return { success: true, data: templateDoc.data() };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const listTemplates = async () => {
        try {
            const q = query(collection(db, 'dataTemplates'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const templates = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return { success: true, templates };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // 6. ADVANCED VALIDATION
    const validateData = (data, rules) => {
        const errors = [];

        Object.entries(rules).forEach(([field, rule]) => {
            const value = data[field];

            // Required validation
            if (rule.required && (!value || value === '')) {
                errors.push({ field, message: `${field} is required`, type: 'required' });
            }

            // Min/Max validation for numbers
            if (rule.min !== undefined && value < rule.min) {
                errors.push({ field, message: `${field} must be at least ${rule.min}`, type: 'min' });
            }

            if (rule.max !== undefined && value > rule.max) {
                errors.push({ field, message: `${field} must be at most ${rule.max}`, type: 'max' });
            }

            // Pattern validation
            if (rule.pattern && !rule.pattern.test(value)) {
                errors.push({ field, message: `${field} has invalid format`, type: 'pattern' });
            }

            // Custom validation function
            if (rule.custom && !rule.custom(value, data)) {
                errors.push({ field, message: rule.customMessage || `${field} validation failed`, type: 'custom' });
            }

            // Conditional validation
            if (rule.requiredIf && rule.requiredIf(data) && (!value || value === '')) {
                errors.push({ field, message: `${field} is required based on other fields`, type: 'conditional' });
            }
        });

        validationErrors.value = errors;
        return errors;
    };

    // 7. DATA QUALITY CHECKS
    const runQualityChecks = (data, metadata) => {
        const checks = {
            completeness: calculateCompleteness(data),
            consistency: checkConsistency(data),
            outliers: detectOutliers(data),
            duplicates: findDuplicates(data),
            timeliness: checkTimeliness(metadata)
        };

        return checks;
    };

    const calculateCompleteness = (data) => {
        const totalFields = Object.keys(data).length;
        const filledFields = Object.values(data).filter(v => v !== null && v !== '').length;
        return {
            percentage: totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0,
            filled: filledFields,
            total: totalFields
        };
    };

    const checkConsistency = (data) => {
        const issues = [];

        // Example: Check if totals match sums
        if (data.total && data.male && data.female) {
            const sum = (parseInt(data.male) || 0) + (parseInt(data.female) || 0);
            if (sum !== parseInt(data.total)) {
                issues.push('Total does not match sum of male and female');
            }
        }

        return issues;
    };

    const detectOutliers = (data) => {
        const outliers = [];
        const numericValues = Object.entries(data)
            .filter(([k, v]) => typeof v === 'number')
            .map(([k, v]) => v);

        if (numericValues.length > 0) {
            const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
            const stdDev = Math.sqrt(
                numericValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericValues.length
            );

            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    const zScore = Math.abs((value - mean) / stdDev);
                    if (zScore > 3) { // 3 standard deviations
                        outliers.push({ field: key, value, zScore });
                    }
                }
            });
        }

        return outliers;
    };

    const findDuplicates = (data) => {
        const duplicates = [];
        const seen = new Map();

        Object.entries(data).forEach(([key, value]) => {
            if (seen.has(value)) {
                duplicates.push({ field: key, value, duplicateOf: seen.get(value) });
            }
            seen.set(value, key);
        });

        return duplicates;
    };

    const checkTimeliness = (metadata) => {
        const now = new Date();
        const periodEnd = new Date(metadata.periodEnd);
        const daysSinceEnd = Math.floor((now - periodEnd) / (1000 * 60 * 60 * 24));

        return {
            onTime: daysSinceEnd <= 7,
            daysLate: Math.max(0, daysSinceEnd - 7)
        };
    };

    // 8. COMMENTS SYSTEM
    const addComment = async (dataKey, elementId, comment) => {
        try {
            const commentData = {
                dataKey,
                elementId,
                comment,
                author: 'current-user',
                timestamp: new Date()
            };

            await addDoc(collection(db, 'dataComments'), commentData);

            // Update local state
            const key = `${dataKey}-${elementId}`;
            if (!comments.value.has(key)) {
                comments.value.set(key, []);
            }
            comments.value.get(key).push(commentData);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const getComments = async (dataKey, elementId) => {
        try {
            const q = query(
                collection(db, 'dataComments'),
                where('dataKey', '==', dataKey),
                where('elementId', '==', elementId),
                orderBy('timestamp', 'desc')
            );

            const snapshot = await getDocs(q);
            const commentsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return { success: true, comments: commentsList };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // 9. AUDIT TRAIL
    const addAuditEntry = async (entry) => {
        try {
            const auditData = {
                ...entry,
                user: 'current-user',
                timestamp: new Date()
            };

            await addDoc(collection(db, 'auditLog'), auditData);
            auditLog.value.unshift(auditData);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const getAuditTrail = async (dataKey, limit = 50) => {
        try {
            const q = query(
                collection(db, 'auditLog'),
                where('dataKey', '==', dataKey),
                orderBy('timestamp', 'desc'),
                fbLimit(limit)
            );

            const snapshot = await getDocs(q);
            const trail = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return { success: true, trail };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // 10. HISTORY/VERSIONING
    const saveVersion = async (dataKey, data, metadata) => {
        try {
            await addDoc(collection(db, 'dataHistory'), {
                dataKey,
                data,
                metadata,
                savedBy: 'current-user',
                savedAt: new Date()
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const getHistory = async (dataKey) => {
        try {
            const q = query(
                collection(db, 'dataHistory'),
                where('dataKey', '==', dataKey),
                orderBy('savedAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const history = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            dataHistory.value = history;
            return { success: true, history };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // 11. AUTO-CALCULATIONS
    const setupAutoCalculations = (data, calculations) => {
        const calculated = { ...data };

        Object.entries(calculations).forEach(([field, formula]) => {
            try {
                calculated[field] = formula(calculated);
            } catch (error) {
                console.error(`Error calculating ${field}:`, error);
            }
        });

        return calculated;
    };

    // 12. BATCH OPERATIONS
    const fillDown = (data, startField, endField, value) => {
        const updated = { ...data };
        let filling = false;

        Object.keys(updated).forEach(key => {
            if (key === startField) filling = true;
            if (filling) updated[key] = value;
            if (key === endField) filling = false;
        });

        return updated;
    };

    const bulkEdit = (data, fields, value) => {
        const updated = { ...data };
        fields.forEach(field => {
            updated[field] = value;
        });
        return updated;
    };

    // 13. OFFLINE SUPPORT
    const saveOffline = (key, data) => {
        offlineStorage.value.set(key, data);
        localStorage.setItem(`offline_${key}`, JSON.stringify(data));
        pendingChanges.value.push({ key, data, timestamp: new Date() });
    };

    const loadOfflineData = (key) => {
        const stored = localStorage.getItem(`offline_${key}`);
        return stored ? JSON.parse(stored) : null;
    };

    const syncPendingChanges = async () => {
        const results = [];

        for (const change of pendingChanges.value) {
            try {
                await setDoc(doc(db, 'aggregateData', change.key), change.data, { merge: true });
                localStorage.removeItem(`offline_${change.key}`);
                results.push({ success: true, key: change.key });
            } catch (error) {
                results.push({ success: false, key: change.key, error: error.message });
            }
        }

        // Remove successfully synced changes
        pendingChanges.value = pendingChanges.value.filter(
            (_, index) => !results[index].success
        );

        return results;
    };

    // 14. PRINT/PDF EXPORT
    const generatePrintView = (data, metadata) => {
        const printWindow = window.open('', '_blank');

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Data Entry Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>TKP Data Management - Data Entry Report</h2>
          <p><strong>Organisation Unit:</strong> ${metadata.orgUnit}</p>
          <p><strong>Data Set:</strong> ${metadata.dataSet}</p>
          <p><strong>Period:</strong> ${metadata.period}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <table>
          <thead>
            <tr><th>Data Element</th><th>Value</th></tr>
          </thead>
          <tbody>
            ${Object.entries(data).map(([key, value]) => `
              <tr><td>${key}</td><td>${value || '-'}</td></tr>
            `).join('')}
          </tbody>
        </table>
        <div class="no-print" style="margin-top: 20px;">
          <button onclick="window.print()">Print</button>
          <button onclick="window.close()">Close</button>
        </div>
      </body>
      </html>
    `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    return {
        // State
        isOnline,
        pendingChanges,
        validationErrors,
        auditLog,
        comments,
        dataHistory,
        templates,

        // Methods
        setupOfflineMode,
        exportToExcel,
        exportToCSV,
        importFromExcel,
        copyPreviousPeriodData,
        clearAllData,
        saveTemplate,
        loadTemplate,
        listTemplates,
        validateData,
        runQualityChecks,
        addComment,
        getComments,
        addAuditEntry,
        getAuditTrail,
        saveVersion,
        getHistory,
        setupAutoCalculations,
        fillDown,
        bulkEdit,
        saveOffline,
        loadOfflineData,
        syncPendingChanges,
        generatePrintView
    };
}
