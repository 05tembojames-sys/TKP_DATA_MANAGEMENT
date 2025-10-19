import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { storage, ID } from '../lib/appwrite.js'

class ReportService {
  constructor() {
    this.collectionName = 'reports'
  }

  // Upload a report file using Appwrite
  async uploadReport(reportData) {
    try {
      const { file, title, description, reportType, uploadedBy } = reportData

      // Validate required fields
      if (!file || !title || !uploadedBy) {
        return {
          success: false,
          error: 'File, title, and uploader information are required'
        }
      }

      // Get bucket ID from environment or use default
      const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'reports'

      // Upload file to Appwrite Storage
      console.log('Uploading file to Appwrite:', file.name)
      const uploadResult = await storage.createFile(
        bucketId,
        ID.unique(), // Auto-generate unique ID
        file
      )

      console.log('File uploaded successfully:', uploadResult.$id)

      // Get file view URL (for download)
      // Appwrite SDK returns URL object, convert to string
      const fileUrl = storage.getFileView(bucketId, uploadResult.$id)
      const downloadURL = storage.getFileDownload(bucketId, uploadResult.$id)
      
      // Convert URLs to strings (handle both URL object and string)
      const fileUrlString = fileUrl?.href || fileUrl?.toString() || String(fileUrl)
      const downloadURLString = downloadURL?.href || downloadURL?.toString() || String(downloadURL)
      
      console.log('Generated URLs:', { fileUrl: fileUrlString, downloadURL: downloadURLString })

      // Create report document in Firestore
      const reportDoc = {
        title: title.trim(),
        description: description ? description.trim() : '',
        reportType: reportType || 'weekly',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: fileUrlString, // View URL
        downloadURL: downloadURLString, // Download URL
        appwriteFileId: uploadResult.$id, // Store Appwrite file ID for deletion
        appwriteBucketId: bucketId,
        uploadedBy: uploadedBy,
        uploadedAt: serverTimestamp(),
        status: 'pending', // pending, approved, rejected
        adminComments: '',
        approvedBy: null,
        approvedAt: null
      }

      const docRef = await addDoc(collection(db, this.collectionName), reportDoc)

      return {
        success: true,
        reportId: docRef.id,
        downloadURL: downloadURLString,
        fileUrl: fileUrlString
      }
    } catch (error) {
      console.error('Error uploading report:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload report'
      }
    }
  }

  // Get all reports with optional filtering
  async getAllReports(filters = {}) {
    try {
      let q = collection(db, this.collectionName)
      
      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status))
      }
      if (filters.reportType) {
        q = query(q, where('reportType', '==', filters.reportType))
      }
      if (filters.uploadedBy) {
        q = query(q, where('uploadedBy', '==', filters.uploadedBy))
      }

      // Order by upload date (newest first)
      q = query(q, orderBy('uploadedAt', 'desc'))

      const querySnapshot = await getDocs(q)
      const reports = []

      querySnapshot.forEach((doc) => {
        reports.push({
          id: doc.id,
          ...doc.data(),
          // Convert timestamps to dates for easier handling
          uploadedAt: doc.data().uploadedAt?.toDate(),
          approvedAt: doc.data().approvedAt?.toDate()
        })
      })

      return {
        success: true,
        reports
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reports',
        reports: []
      }
    }
  }

  // Update report status (approve/reject)
  async updateReportStatus(reportId, status, adminComments = '', adminUser = null) {
    try {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return {
          success: false,
          error: 'Invalid status. Must be pending, approved, or rejected'
        }
      }

      const reportRef = doc(db, this.collectionName, reportId)
      const updateData = {
        status,
        adminComments: adminComments || '',
        approvedBy: adminUser || null,
        approvedAt: status === 'approved' ? serverTimestamp() : null
      }

      await updateDoc(reportRef, updateData)

      return {
        success: true,
        message: `Report ${status} successfully`
      }
    } catch (error) {
      console.error('Error updating report status:', error)
      return {
        success: false,
        error: error.message || 'Failed to update report status'
      }
    }
  }

  // Delete a report (including file from Appwrite storage)
  async deleteReport(reportId, appwriteFileId, appwriteBucketId) {
    try {
      // Delete file from Appwrite storage if file ID provided
      if (appwriteFileId && appwriteBucketId) {
        try {
          console.log('Deleting file from Appwrite:', appwriteFileId)
          await storage.deleteFile(appwriteBucketId, appwriteFileId)
          console.log('File deleted successfully')
        } catch (storageError) {
          console.warn('Warning: Could not delete file from storage:', storageError)
          // Continue with document deletion even if file deletion fails
        }
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, this.collectionName, reportId))

      return {
        success: true,
        message: 'Report deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting report:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete report'
      }
    }
  }

  // Get reports statistics
  async getReportStatistics() {
    try {
      const allReportsResult = await this.getAllReports()
      
      if (!allReportsResult.success) {
        return allReportsResult
      }

      const reports = allReportsResult.reports
      const stats = {
        total: reports.length,
        pending: reports.filter(r => r.status === 'pending').length,
        approved: reports.filter(r => r.status === 'approved').length,
        rejected: reports.filter(r => r.status === 'rejected').length,
        byType: {}
      }

      // Count by report type
      reports.forEach(report => {
        const type = report.reportType || 'unknown'
        stats.byType[type] = (stats.byType[type] || 0) + 1
      })

      return {
        success: true,
        statistics: stats
      }
    } catch (error) {
      console.error('Error getting report statistics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get report statistics'
      }
    }
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file type icon
  getFileTypeIcon(fileType) {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📈'
    return '📎'
  }
}

export default new ReportService()