import { Hono } from 'hono';
import type { Env } from '../types/env.js';
import prisma from '../lib/prisma.js';

const app = new Hono<{ Bindings: Env }>();

// Helper function to generate unique filename
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomUUID().split('-')[0];
  const ext = originalName.split('.').pop() || 'jpg';
  return `${timestamp}-${randomString}.${ext}`;
}

// Helper function to validate file type
function isValidImageType(contentType: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return allowedTypes.includes(contentType);
}

// Helper function to get file extension from content type
function getExtensionFromContentType(contentType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };
  return map[contentType] || 'jpg';
}

// Helper function to resize image using browser APIs
async function resizeImage(
  buffer: ArrayBuffer,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.85
): Promise<ArrayBuffer> {
  // Note: In Cloudflare Workers, we don't have access to sharp or Canvas API
  // For now, we'll just return the original buffer
  // You could use Cloudflare Images or an external image processing service
  // Or implement a separate image processing worker
  return buffer;
}

// POST /upload/profile-picture - Upload profile picture
app.post('/upload/profile-picture', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('photo') as File;
    const userId = formData.get('userId') as string;
    const userType = formData.get('userType') as string;

    if (!file) {
      return c.json({
        success: false,
        error: 'No file uploaded'
      }, 400);
    }

    if (!userId || !userType) {
      return c.json({
        success: false,
        error: 'userId and userType are required'
      }, 400);
    }

    // Validate file type
    if (!isValidImageType(file.type)) {
      return c.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
      }, 400);
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({
        success: false,
        error: 'File size exceeds 10MB limit'
      }, 400);
    }

    // Get file buffer
    const buffer = await file.arrayBuffer();

    // Resize image (in a real implementation, use an image processing service)
    const processedBuffer = await resizeImage(buffer, 400, 400, 0.85);

    // Generate filename
    const ext = getExtensionFromContentType(file.type);
    const fileName = `profile-pictures/${userType}/${userId}/${Date.now()}-${crypto.randomUUID().split('-')[0]}.${ext}`;

    // Upload to R2
    const bucket = c.env.R2_BUCKET;
    await bucket.put(fileName, processedBuffer, {
      httpMetadata: {
        contentType: file.type
      }
    });

    // Construct public URL
    const publicUrl = c.env.R2_PUBLIC_URL || '';
    const imageUrl = `${publicUrl}/${fileName}`;

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

    return c.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return c.json({
      success: false,
      error: 'Failed to upload profile picture'
    }, 500);
  }
});

// POST /upload/job-photos - Upload before/after photos for a job
app.post('/upload/job-photos', async (c) => {
  try {
    const formData = await c.req.formData();
    const bookingId = formData.get('bookingId') as string;
    const photoType = formData.get('photoType') as string;

    if (!bookingId || !photoType) {
      return c.json({
        success: false,
        error: 'bookingId and photoType are required'
      }, 400);
    }

    if (!['before', 'after', 'additional'].includes(photoType)) {
      return c.json({
        success: false,
        error: 'photoType must be "before", "after", or "additional"'
      }, 400);
    }

    // Collect all photo files from form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'photos' && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return c.json({
        success: false,
        error: 'No files uploaded'
      }, 400);
    }

    if (files.length > 10) {
      return c.json({
        success: false,
        error: 'Maximum 10 files allowed'
      }, 400);
    }

    const uploadedUrls: string[] = [];
    const bucket = c.env.R2_BUCKET;
    const publicUrl = c.env.R2_PUBLIC_URL || '';

    // Process each file
    for (const file of files) {
      // Validate file type
      if (!isValidImageType(file.type)) {
        continue; // Skip invalid files
      }

      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        continue; // Skip files over 10MB
      }

      // Get file buffer
      const buffer = await file.arrayBuffer();

      // Resize image (in production, use Cloudflare Images or similar)
      const processedBuffer = await resizeImage(buffer, 1200, 1200, 0.90);

      // Generate filename
      const ext = getExtensionFromContentType(file.type);
      const fileName = `job-photos/${bookingId}/${photoType}/${Date.now()}-${crypto.randomUUID().split('-')[0]}.${ext}`;

      // Upload to R2
      await bucket.put(fileName, processedBuffer, {
        httpMetadata: {
          contentType: file.type
        }
      });

      const imageUrl = `${publicUrl}/${fileName}`;
      uploadedUrls.push(imageUrl);
    }

    return c.json({
      success: true,
      imageUrls: uploadedUrls
    });
  } catch (error) {
    console.error('Job photos upload error:', error);
    return c.json({
      success: false,
      error: 'Failed to upload job photos'
    }, 500);
  }
});

// POST /upload/contractor-portfolio - Upload portfolio images for contractor
app.post('/upload/contractor-portfolio', async (c) => {
  try {
    const formData = await c.req.formData();
    const contractorId = formData.get('contractorId') as string;

    if (!contractorId) {
      return c.json({
        success: false,
        error: 'contractorId is required'
      }, 400);
    }

    // Collect all photo files from form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'photos' && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return c.json({
        success: false,
        error: 'No files uploaded'
      }, 400);
    }

    if (files.length > 20) {
      return c.json({
        success: false,
        error: 'Maximum 20 files allowed'
      }, 400);
    }

    const uploadedUrls: string[] = [];
    const bucket = c.env.R2_BUCKET;
    const publicUrl = c.env.R2_PUBLIC_URL || '';

    // Process each file
    for (const file of files) {
      // Validate file type
      if (!isValidImageType(file.type)) {
        continue; // Skip invalid files
      }

      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        continue; // Skip files over 10MB
      }

      // Get file buffer
      const buffer = await file.arrayBuffer();

      // Resize image (in production, use Cloudflare Images or similar)
      const processedBuffer = await resizeImage(buffer, 1200, 1200, 0.90);

      // Generate filename
      const ext = getExtensionFromContentType(file.type);
      const fileName = `portfolio/${contractorId}/${Date.now()}-${crypto.randomUUID().split('-')[0]}.${ext}`;

      // Upload to R2
      await bucket.put(fileName, processedBuffer, {
        httpMetadata: {
          contentType: file.type
        }
      });

      const imageUrl = `${publicUrl}/${fileName}`;
      uploadedUrls.push(imageUrl);
    }

    return c.json({
      success: true,
      imageUrls: uploadedUrls
    });
  } catch (error) {
    console.error('Portfolio upload error:', error);
    return c.json({
      success: false,
      error: 'Failed to upload portfolio images'
    }, 500);
  }
});

// DELETE /upload/delete - Delete an image from R2
app.delete('/upload/delete', async (c) => {
  try {
    const body = await c.req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return c.json({
        success: false,
        error: 'imageUrl is required'
      }, 400);
    }

    // Extract filename from URL
    const url = new URL(imageUrl);
    const fileName = url.pathname.substring(1); // Remove leading slash

    // Delete from R2
    const bucket = c.env.R2_BUCKET;
    await bucket.delete(fileName);

    return c.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Image deletion error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete image'
    }, 500);
  }
});

export default app;
