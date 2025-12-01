import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const reports = new Hono<{ Bindings: Env; Variables: Variables }>();

// Submit a new report (public endpoint - requires authentication)
reports.post('/reports', async (c) => {
  try {
    const prisma = c.get('prisma');
    const body = await c.req.json();

    const {
      type,
      reporterType,
      reporterId,
      reportedUserId,
      reportedUserType,
      bookingId,
      reason,
      description
    } = body;

    // Validate required fields
    if (!type || !reporterType || !reporterId || !reportedUserId || !reportedUserType || !reason) {
      return c.json({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    // Parse IDs as integers
    const parsedReporterId = typeof reporterId === 'string' ? parseInt(reporterId) : reporterId;
    const parsedReportedUserId = typeof reportedUserId === 'string' ? parseInt(reportedUserId) : reportedUserId;
    const parsedBookingId = bookingId ? (typeof bookingId === 'string' ? parseInt(bookingId) : bookingId) : null;

    // Normalize reportedUserType to uppercase
    const normalizedReportedUserType = reportedUserType.toUpperCase() as 'CLIENT' | 'CONTRACTOR';

    // Validate reporter exists
    if (reporterType === 'CLIENT') {
      const client = await prisma.client.findUnique({
        where: { id: parsedReporterId }
      });
      if (!client) {
        return c.json({
          success: false,
          error: 'Reporter not found'
        }, 404);
      }
    } else if (reporterType === 'CONTRACTOR') {
      const contractor = await prisma.contractor.findUnique({
        where: { id: parsedReporterId }
      });
      if (!contractor) {
        return c.json({
          success: false,
          error: 'Reporter not found'
        }, 404);
      }
    }

    // Validate reported user exists
    if (normalizedReportedUserType === 'CLIENT') {
      const client = await prisma.client.findUnique({
        where: { id: parsedReportedUserId }
      });
      if (!client) {
        return c.json({
          success: false,
          error: 'Reported user not found'
        }, 404);
      }
    } else if (normalizedReportedUserType === 'CONTRACTOR') {
      const contractor = await prisma.contractor.findUnique({
        where: { id: parsedReportedUserId }
      });
      if (!contractor) {
        return c.json({
          success: false,
          error: 'Reported user not found'
        }, 404);
      }
    }

    // Validate booking if provided
    if (parsedBookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: parsedBookingId }
      });
      if (!booking) {
        return c.json({
          success: false,
          error: 'Booking not found'
        }, 404);
      }
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        type,
        reporterType,
        reporterId: parsedReporterId,
        reportedUserId: parsedReportedUserId,
        reportedUserType: normalizedReportedUserType,
        bookingId: parsedBookingId,
        reason,
        description: description || null,
        status: 'PENDING',
        priority: 'MEDIUM'
      }
    });

    return c.json({
      success: true,
      report
    }, 201);
  } catch (error) {
    console.error('Error creating report:', error);
    return c.json({
      success: false,
      error: 'Failed to create report'
    }, 500);
  }
});

// Get reports submitted by a user (for viewing their own reports)
reports.get('/reports/my-reports', async (c) => {
  try {
    const prisma = c.get('prisma');
    const reporterId = c.req.query('reporterId');
    const reporterType = c.req.query('reporterType');

    if (!reporterId || !reporterType) {
      return c.json({
        success: false,
        error: 'Reporter ID and type are required'
      }, 400);
    }

    const userReports = await prisma.report.findMany({
      where: {
        reporterId: parseInt(reporterId),
        reporterType: reporterType as 'CLIENT' | 'CONTRACTOR'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return c.json({
      success: true,
      reports: userReports
    });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch reports'
    }, 500);
  }
});

export default reports;
