# File Upload System Setup Guide

## Overview
FixterConnect uses Cloudflare R2 for secure, scalable file storage with automatic image optimization. R2 is S3-compatible with **zero egress fees** and faster global delivery!

## Features
- ✅ Profile picture uploads (contractors & clients)
- ✅ Before/after job photos
- ✅ Contractor portfolio images
- ✅ Automatic image resizing and optimization
- ✅ 10MB file size limit
- ✅ Supports JPEG, PNG, WebP formats

## Prerequisites
1. Cloudflare Account (free tier available!)
2. R2 bucket created
3. R2 API tokens

## Cloudflare R2 Setup

### Step 1: Create R2 Bucket
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage** in the sidebar
3. Click "Create bucket"
4. Bucket name: `fixterconnect-uploads` (or your choice)
5. Location: Choose closest to your users (auto is fine)
6. Click "Create bucket"

### Step 2: Enable Public Access
You have two options for public access:

#### Option A: R2.dev Subdomain (Easiest - Free)
1. Go to your bucket settings
2. Under "Public access", click "Allow Access"
3. Enable the R2.dev subdomain
4. Your public URL will be: `https://pub-xxxxx.r2.dev`
5. Copy this URL for your `.env` file

#### Option B: Custom Domain (Professional)
1. Go to your bucket → Settings → Custom Domains
2. Click "Connect Domain"
3. Enter your domain (e.g., `cdn.fixterconnect.com`)
4. Add the CNAME record to your DNS
5. Wait for DNS propagation (~5 minutes)
6. Your public URL will be: `https://cdn.fixterconnect.com`

### Step 3: Create API Tokens
1. In R2 dashboard, go to **Manage R2 API Tokens**
2. Click "Create API Token"
3. Token name: `FixterConnect Uploads`
4. Permissions:
   - **Object Read & Write** (required)
5. Optionally restrict to specific bucket: `fixterconnect-uploads`
6. Click "Create API Token"
7. **IMPORTANT**: Save these credentials immediately (you can't see them again):
   - **Access Key ID**
   - **Secret Access Key**
   - **Jurisdiction-specific endpoint** (e.g., `https://[account-id].r2.cloudflarestorage.com`)

### Step 4: Update Environment Variables
Add to `/packages/server/.env`:

```env
# Cloudflare R2 Configuration
R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id-here
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key-here
R2_BUCKET_NAME=fixterconnect-uploads
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
# OR if using custom domain:
# R2_PUBLIC_URL=https://cdn.fixterconnect.com
```

Replace:
- `[account-id]` with your Cloudflare Account ID (found in the endpoint URL)
- Access keys with the credentials from Step 3
- Public URL with your R2.dev subdomain or custom domain

### Step 5: Run Database Migration
Execute this SQL in your Supabase SQL Editor:

```sql
-- Add profile_picture column to contractors table
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Add profile_picture column to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS profile_picture TEXT;
```

Or run the migration file:
```bash
cd /Users/codylockwood/FixterConnect/fixterconnect/packages/server
# Execute migrations/add_profile_pictures.sql in Supabase
```

## API Endpoints

### 1. Upload Profile Picture
**POST** `/api/upload/profile-picture`

**Form Data:**
- `photo` (file): The image file
- `userId` (string): User ID (contractor or client ID)
- `userType` (string): Either "contractor" or "client"

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://pub-xxxxx.r2.dev/profile-pictures/contractor/1/1234567890-abc123.jpg"
}
```

**Image Processing:**
- Resized to 400x400px
- Cropped to center
- Optimized as JPEG at 85% quality

---

### 2. Upload Job Photos
**POST** `/api/upload/job-photos`

**Form Data:**
- `photos` (file[]): Array of image files (max 10)
- `bookingId` (string): The booking ID
- `photoType` (string): Either "before" or "after"

**Response:**
```json
{
  "success": true,
  "imageUrls": [
    "https://pub-xxxxx.r2.dev/job-photos/123/before/1234567890-abc123.jpg",
    "https://pub-xxxxx.r2.dev/job-photos/123/before/1234567890-def456.jpg"
  ]
}
```

**Image Processing:**
- Max size: 1200x1200px (maintains aspect ratio)
- Optimized as JPEG at 90% quality

---

### 3. Upload Portfolio Images
**POST** `/api/upload/contractor-portfolio`

**Form Data:**
- `photos` (file[]): Array of image files (max 20)
- `contractorId` (string): The contractor ID

**Response:**
```json
{
  "success": true,
  "imageUrls": [
    "https://pub-xxxxx.r2.dev/portfolio/1/1234567890-abc123.jpg",
    "https://pub-xxxxx.r2.dev/portfolio/1/1234567890-def456.jpg"
  ]
}
```

**Image Processing:**
- Max size: 1200x1200px (maintains aspect ratio)
- Optimized as JPEG at 90% quality

---

### 4. Delete Image
**DELETE** `/api/upload/delete`

**Request Body:**
```json
{
  "imageUrl": "https://pub-xxxxx.r2.dev/profile-pictures/contractor/1/..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Frontend Integration Example

### Profile Picture Upload
```typescript
const handleProfilePictureUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('userId', user.id.toString());
  formData.append('userType', 'contractor'); // or 'client'

  const response = await fetch('http://localhost:3001/api/upload/profile-picture', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (data.success) {
    console.log('Uploaded:', data.imageUrl);
    // Update UI with new profile picture
  }
};
```

### Job Photos Upload
```typescript
const handleJobPhotosUpload = async (files: File[], bookingId: number, type: 'before' | 'after') => {
  const formData = new FormData();
  files.forEach(file => formData.append('photos', file));
  formData.append('bookingId', bookingId.toString());
  formData.append('photoType', type);

  const response = await fetch('http://localhost:3001/api/upload/job-photos', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (data.success) {
    console.log('Uploaded:', data.imageUrls);
  }
};
```

## Security Considerations

1. **File Size Limit**: 10MB per file (prevents abuse)
2. **File Type Validation**: Only JPEG, PNG, WebP allowed
3. **Image Optimization**: Automatic resizing prevents large file uploads
4. **Unique Filenames**: Timestamp + random hash prevents overwrites and collisions
5. **Public Access**: Images are publicly accessible via URL (required for display)
6. **No ACL Required**: R2 doesn't use ACLs like S3 - simpler configuration

## Cost Estimation

**Cloudflare R2 Pricing**:
- Storage: **$0.015 per GB/month** (cheaper than S3!)
- Class A Operations (writes): **$4.50 per million requests**
- Class B Operations (reads): **$0.36 per million requests**
- **EGRESS: $0** (This is the big win - S3 charges for downloads!)

**Example for 1,000 users**:
- Storage: 1,000 profile pictures (400KB each) = 400MB = **$0.006/month**
- Uploads: 1,000 images = **$0.0045**
- Downloads: 10,000 image views/month = **$0.0036**
- **Total: ~$0.01/month** (practically free!)

**Comparison to S3**:
- S3 would charge $0.90 per GB of egress (downloads)
- With 10,000 downloads of 400KB images = 4GB egress = **$3.60/month on S3**
- R2 saves you **$3.59/month** on this workload! 💰

## Troubleshooting

### Error: "Failed to upload"
- ✅ Check R2 credentials in `.env` are correct
- ✅ Verify R2 bucket exists and name matches
- ✅ Check API token has Read & Write permissions
- ✅ Verify endpoint URL is correct (must include account ID)

### Error: "Invalid file type"
- ✅ Only JPEG, PNG, WebP are supported
- ✅ Check file extension matches actual file type

### Images not displaying
- ✅ Verify bucket has public access enabled
- ✅ Check R2_PUBLIC_URL is correctly set in `.env`
- ✅ If using custom domain, verify CNAME record is configured
- ✅ Test URL directly in browser

### Error: "Cannot reach R2"
- ✅ Check endpoint URL format: `https://[account-id].r2.cloudflarestorage.com`
- ✅ Verify your account ID is correct
- ✅ Check firewall/network isn't blocking Cloudflare

## Why Cloudflare R2 vs AWS S3?

| Feature | Cloudflare R2 | AWS S3 |
|---------|---------------|--------|
| Storage Cost | $0.015/GB | $0.023/GB |
| Egress (Downloads) | **FREE** 🎉 | $0.09/GB |
| Operations | Cheaper | More expensive |
| Global Performance | Fast (CF network) | Fast (AWS network) |
| Setup Complexity | Simpler | More complex (IAM, policies) |
| Best For | Public files, images, CDN | Private files, backups |

**Bottom line**: R2 is better for file uploads that will be frequently downloaded (like profile pictures and job photos).

## Next Steps

1. ✅ Run database migration to add `profile_picture` columns
2. ✅ Set up Cloudflare R2 bucket and API tokens
3. ✅ Add R2 credentials to `.env`
4. ⬜ Update frontend upload handlers to use new API endpoints
5. ⬜ Test uploads in development
6. ⬜ Configure custom domain for production (optional)

## Production Recommendations

1. **Use Custom Domain** for professional URLs (`cdn.fixterconnect.com` instead of `pub-xxxxx.r2.dev`)
2. **Enable Cloudflare Cache** for even faster delivery
3. **Set up Object Lifecycle Rules** to archive/delete old images
4. **Monitor R2 Analytics** in Cloudflare Dashboard
5. **Consider Image Transformations** with Cloudflare Images (paid add-on)
6. **Implement Image Versioning** to prevent accidental deletions

---

**File Upload System Status**: ✅ Backend Complete (R2) | ⬜ Frontend Integration Needed | ⬜ R2 Configuration Needed
