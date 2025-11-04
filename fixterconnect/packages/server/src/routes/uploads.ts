import express, { Request, Response } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Configure Cloudflare R2 Client (S3-compatible)
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || '', // e.g., https://[account-id].r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'fixterconnect-uploads';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ''; // Your R2 public domain

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Helper function to generate unique filename
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalName);
  return `${timestamp}-${randomString}${ext}`;
}

// Helper function to upload to R2
async function uploadToR2(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: contentType
  });

  await s3Client.send(command);

  // Return the public URL using your R2 custom domain or public bucket URL
  // Format: https://pub-xxxxx.r2.dev/filename or https://your-custom-domain.com/filename
  return `${R2_PUBLIC_URL}/${fileName}`;
}

// Helper function to delete from R2
async function deleteFromR2(fileName: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName
  });

  await s3Client.send(command);
}

// POST /api/upload/profile-picture - Upload profile picture
router.post('/upload/profile-picture', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { userId, userType } = req.body;

    if (!userId || !userType) {
      return res.status(400).json({
        success: false,
        error: 'userId and userType are required'
      });
    }

    // Resize and optimize image
    const optimizedBuffer = await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate filename and upload to R2
    const fileName = `profile-pictures/${userType}/${userId}/${generateFileName(req.file.originalname)}`;
    const imageUrl = await uploadToR2(optimizedBuffer, fileName, 'image/jpeg');

    // Update database based on user type
    if (userType === 'contractor') {
      await prisma.contractor.update({
        where: { id: parseInt(userId) },
        data: { profilePicture: imageUrl }
      });
    } else if (userType === 'client') {
      await prisma.client.update({
        where: { id: parseInt(userId) },
        data: { profilePicture: imageUrl }
      });
    }

    return res.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload profile picture'
    });
  }
});

// POST /api/upload/job-photos - Upload before/after photos for a job
router.post('/upload/job-photos', upload.array('photos', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const { bookingId, photoType } = req.body; // photoType: 'before' or 'after'

    if (!bookingId || !photoType) {
      return res.status(400).json({
        success: false,
        error: 'bookingId and photoType are required'
      });
    }

    if (!['before', 'after'].includes(photoType)) {
      return res.status(400).json({
        success: false,
        error: 'photoType must be "before" or "after"'
      });
    }

    const uploadedUrls: string[] = [];

    // Process each file
    for (const file of req.files) {
      // Resize and optimize image (larger for job photos)
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Generate filename and upload to R2
      const fileName = `job-photos/${bookingId}/${photoType}/${generateFileName(file.originalname)}`;
      const imageUrl = await uploadToR2(optimizedBuffer, fileName, 'image/jpeg');
      uploadedUrls.push(imageUrl);
    }

    // Store URLs in job_completions table or a new job_photos table
    // For now, we'll return the URLs and let the frontend handle storing them
    // You may want to create a job_photos table to store these

    return res.json({
      success: true,
      imageUrls: uploadedUrls
    });
  } catch (error) {
    console.error('Job photos upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload job photos'
    });
  }
});

// POST /api/upload/contractor-portfolio - Upload portfolio images for contractor
router.post('/upload/contractor-portfolio', upload.array('photos', 20), async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const { contractorId } = req.body;

    if (!contractorId) {
      return res.status(400).json({
        success: false,
        error: 'contractorId is required'
      });
    }

    const uploadedUrls: string[] = [];

    // Process each file
    for (const file of req.files) {
      // Resize and optimize image
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Generate filename and upload to R2
      const fileName = `portfolio/${contractorId}/${generateFileName(file.originalname)}`;
      const imageUrl = await uploadToR2(optimizedBuffer, fileName, 'image/jpeg');
      uploadedUrls.push(imageUrl);
    }

    // TODO: Store portfolio images in a contractor_portfolio table
    // For now, return the URLs

    return res.json({
      success: true,
      imageUrls: uploadedUrls
    });
  } catch (error) {
    console.error('Portfolio upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload portfolio images'
    });
  }
});

// DELETE /api/upload/delete - Delete an image from S3
router.delete('/upload/delete', async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'imageUrl is required'
      });
    }

    // Extract filename from URL
    const url = new URL(imageUrl);
    const fileName = url.pathname.substring(1); // Remove leading slash

    // Delete from R2
    await deleteFromR2(fileName);

    return res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Image deletion error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    });
  }
});

export default router;
