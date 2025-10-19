# Appwrite Reports Storage Setup

## Overview
The Reports module now uses **Appwrite Storage** instead of Firebase Storage for file uploads. This provides better file management, built-in security, and easier access control.

## What Changed

### Files Modified

1. **`src/services/reportService.js`**
   - ✅ Replaced Firebase Storage with Appwrite Storage
   - ✅ Uses `storage.createFile()` for uploads
   - ✅ Uses `storage.deleteFile()` for deletions
   - ✅ Stores `appwriteFileId` and `appwriteBucketId` in Firestore
   - ✅ Generates both view URL and download URL

2. **`src/components/Reports.vue`**
   - ✅ Updated delete function to pass Appwrite file ID
   - ✅ Compatible with new service methods

3. **`src/lib/appwrite.js`** (Already configured)
   - ✅ Appwrite client initialized
   - ✅ Storage service exported

## Setup Instructions

### Step 1: Create Appwrite Bucket

1. **Login to Appwrite Console**: https://cloud.appwrite.io/console
   
2. **Navigate to Storage**:
   - Click on "Storage" in the left sidebar
   - Click "Create Bucket"

3. **Configure Bucket**:
   ```
   Bucket Name: Reports
   Bucket ID: reports (or custom ID)
   Maximum File Size: 50 MB (or your preference)
   Allowed File Extensions: pdf, doc, docx, xls, xlsx, ppt, pptx, txt
   Encryption: Enabled (recommended)
   Antivirus: Enabled (recommended)
   ```

4. **Set Permissions**:
   - **Create**: Role: Any (or specific user roles)
   - **Read**: Role: Any (for downloading reports)
   - **Update**: Role: Admins only
   - **Delete**: Role: Admins only

   Or using Appwrite permissions:
   ```javascript
   Permissions:
   - create('any')           // Anyone can upload
   - read('any')             // Anyone can download
   - update('role:admin')    // Only admins can update
   - delete('role:admin')    // Only admins can delete
   ```

### Step 2: Add Environment Variables

Add to your `.env` file (or `.env.local`):

```env
# Appwrite Configuration (if not already present)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here

# Appwrite Storage Bucket ID
VITE_APPWRITE_BUCKET_ID=reports
```

**Get Your Project ID**:
1. Go to Appwrite Console
2. Click on your project
3. Go to "Settings"
4. Copy "Project ID"

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Test Upload

1. Navigate to Reports page
2. Click "📤 Upload New Report"
3. Fill in details and select a file
4. Click "Upload Report"
5. Check Appwrite Console → Storage → reports bucket
6. Verify file appears

## How It Works

### Upload Flow

```
User selects file
      ↓
Reports.vue → handleUploadReport()
      ↓
ReportService.uploadReport(reportData)
      ↓
Appwrite: storage.createFile(bucketId, ID.unique(), file)
      ↓
Returns: { $id, name, size, ... }
      ↓
Generate URLs:
  - storage.getFileView(bucketId, fileId)     → View in browser
  - storage.getFileDownload(bucketId, fileId) → Download file
      ↓
Save to Firestore:
  {
    title, description, reportType,
    fileName, fileSize, fileType,
    fileUrl: view URL,
    downloadURL: download URL,
    appwriteFileId: $id,
    appwriteBucketId: bucketId,
    uploadedBy, uploadedAt, status, ...
  }
      ↓
Success! File stored in Appwrite, metadata in Firestore
```

### Download Flow

```
User clicks "📥 Download" button
      ↓
Opens report.downloadURL (from Firestore)
      ↓
Appwrite serves file directly
      ↓
File downloads to user's device
```

### Delete Flow

```
Admin clicks "🗑️ Delete"
      ↓
confirmDeleteReport(report)
      ↓
ReportService.deleteReport(reportId, appwriteFileId, bucketId)
      ↓
Appwrite: storage.deleteFile(bucketId, fileId)
      ↓
Firestore: deleteDoc(reportId)
      ↓
Both file and metadata removed
```

## Data Structure

### Firestore Document (reports collection)

```javascript
{
  // Report metadata
  title: "Weekly Report - Week 42",
  description: "Summary of activities...",
  reportType: "weekly",
  
  // File information
  fileName: "report.pdf",
  fileSize: 1234567,  // bytes
  fileType: "application/pdf",
  
  // Appwrite URLs
  fileUrl: "https://cloud.appwrite.io/v1/storage/buckets/reports/files/abc123/view",
  downloadURL: "https://cloud.appwrite.io/v1/storage/buckets/reports/files/abc123/download",
  
  // Appwrite identifiers (for deletion)
  appwriteFileId: "abc123",
  appwriteBucketId: "reports",
  
  // Upload tracking
  uploadedBy: "user@example.com",
  uploadedAt: Timestamp,
  
  // Approval workflow
  status: "pending",  // pending, approved, rejected
  adminComments: "",
  approvedBy: null,
  approvedAt: null
}
```

## File Types Supported

The Reports component accepts:
- **PDF**: `.pdf`
- **Word**: `.doc`, `.docx`
- **Excel**: `.xls`, `.xlsx`
- **PowerPoint**: `.ppt`, `.pptx`
- **Text**: `.txt`

**Maximum file size**: 50 MB (configurable in Appwrite bucket settings)

## Security Considerations

### File Upload Security

1. **File Size Limit**: 50 MB max (prevents abuse)
2. **File Type Validation**: Client-side and server-side
3. **Unique IDs**: `ID.unique()` prevents conflicts
4. **Appwrite Permissions**: Control who can upload/download

### Access Control

**Current Setup**:
- Anyone authenticated can upload reports
- All users can download reports (via download URL)
- Only admins can approve/reject reports
- Only admins can delete reports

**To Restrict Downloads to Admins Only**:

Update Appwrite bucket permissions:
```javascript
Permissions:
- create('any')
- read('role:admin')      // Only admins can read
- update('role:admin')
- delete('role:admin')
```

Then update Reports.vue to check admin status before showing download button.

## Troubleshooting

### Error: "Bucket not found"

**Cause**: `VITE_APPWRITE_BUCKET_ID` not set or bucket doesn't exist

**Solution**:
1. Create bucket in Appwrite Console
2. Add `VITE_APPWRITE_BUCKET_ID=reports` to `.env`
3. Restart dev server

### Error: "Unauthorized"

**Cause**: Missing permissions on Appwrite bucket

**Solution**:
1. Go to Appwrite Console → Storage → Your Bucket
2. Click "Settings" → "Permissions"
3. Add permissions:
   - `create('any')`
   - `read('any')`
   - `delete('role:admin')`

### Error: "File too large"

**Cause**: File exceeds bucket's maximum file size

**Solution**:
1. Go to Appwrite Console → Storage → Your Bucket
2. Click "Settings"
3. Increase "Maximum File Size"
4. Or reduce file size before upload

### Upload Works But Download Fails

**Cause**: Incorrect URL generation or CORS issues

**Check**:
1. Verify `fileUrl` and `downloadURL` in Firestore document
2. Check browser console for CORS errors
3. Verify Appwrite endpoint is accessible
4. Check network tab for failed requests

### Files Not Appearing in Appwrite

**Cause**: Upload may be failing silently

**Debug**:
1. Open browser console
2. Look for errors after clicking "Upload"
3. Check Network tab for failed requests
4. Verify environment variables are set correctly

## Migration from Firebase Storage

If you have existing reports in Firebase Storage:

### Option 1: Keep Old Reports, New Reports Use Appwrite
- Old reports continue to work with Firebase URLs
- New reports use Appwrite
- No migration needed
- Eventually delete old reports manually

### Option 2: Migrate All Reports to Appwrite
1. Download all files from Firebase Storage
2. Upload to Appwrite using the UI or API
3. Update Firestore documents with new URLs
4. Delete old files from Firebase

**Migration Script** (example):
```javascript
// Not included - manual migration recommended
// Or contact for assistance
```

## Advantages of Appwrite Storage

✅ **Better File Management**: Built-in file browser, preview, metadata
✅ **Easier Permissions**: Role-based access control
✅ **Built-in Features**: Compression, image transformations (future use)
✅ **Better Performance**: CDN-ready, optimized delivery
✅ **Simpler API**: Less code than Firebase Storage
✅ **Cost Effective**: Generous free tier

## Testing Checklist

- [ ] Environment variables configured
- [ ] Appwrite bucket created with correct permissions
- [ ] Dev server restarted after .env changes
- [ ] Upload a PDF file successfully
- [ ] Upload a Word document successfully
- [ ] Upload an Excel file successfully
- [ ] Download uploaded file works
- [ ] File appears in Appwrite Console
- [ ] Metadata saved correctly in Firestore
- [ ] Delete report removes both file and document
- [ ] File size validation works (try >50MB file)
- [ ] File type validation works (try .exe or .zip)

## Next Steps

### Recommended Enhancements

1. **Progress Indicator**: Show upload progress
   ```javascript
   storage.createFile(
     bucketId, 
     ID.unique(), 
     file,
     [], // permissions
     (progress) => {
       console.log('Upload progress:', progress)
       // Update UI with progress
     }
   )
   ```

2. **File Preview**: Show thumbnails for images/PDFs
   ```javascript
   const thumbnail = storage.getFilePreview(bucketId, fileId, 200, 200)
   ```

3. **Virus Scanning**: Enable antivirus in bucket settings

4. **File Compression**: Enable compression in bucket settings

5. **Access Logs**: Track who downloads what

## Support

For issues or questions:
1. Check Appwrite Console for errors
2. Check browser console for JavaScript errors
3. Verify all environment variables are set
4. Check Appwrite status: https://status.appwrite.io/

---

**Setup Complete!** 🎉

Your Reports module now uses Appwrite Storage for secure, efficient file management!
