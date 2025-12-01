import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const admin = new Hono<{ Bindings: Env; Variables: Variables }>();

// Get all users (clients and contractors)
admin.get('/admin/users', async (c) => {
  try {
    const prisma = c.get('prisma');

    // Fetch all clients
    const clients = await prisma.client.findMany({
      include: {
        user: true,
        bookings: true
      }
    });

    // Fetch all contractors
    const contractors = await prisma.contractor.findMany({
      include: {
        user: true,
        bookings: true
      }
    });

    // Transform clients
    const clientUsers = clients.map(client => ({
      id: `client-${client.id}`, // Unique composite key
      originalId: client.id, // Keep original ID for operations
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
      phone: client.phone,
      type: 'client' as const,
      status: 'active' as const, // TODO: Add status field to schema
      joinDate: client.createdAt.toISOString().split('T')[0],
      totalJobs: client.bookings.length,
      totalSpent: client.bookings.reduce((sum, booking) => sum + (booking.price || 0), 0)
    }));

    // Transform contractors
    const contractorUsers = contractors.map(contractor => ({
      id: `contractor-${contractor.id}`, // Unique composite key
      originalId: contractor.id, // Keep original ID for operations
      name: contractor.name,
      email: contractor.email || '',
      phone: contractor.phone || '',
      type: 'contractor' as const,
      status: 'active' as const,
      joinDate: contractor.createdAt.toISOString().split('T')[0],
      totalJobs: contractor.bookings.length,
      totalEarned: contractor.bookings.reduce((sum, booking) => sum + (booking.price || 0), 0)
    }));

    return c.json({
      success: true,
      users: [...clientUsers, ...contractorUsers]
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch users'
    }, 500);
  }
});

// Get all services
admin.get('/admin/services', async (c) => {
  try {
    const prisma = c.get('prisma');

    const services = await prisma.service.findMany({
      include: {
        contractors: true
      }
    });

    const transformedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      category: 'General', // TODO: Add category field to schema
      description: service.description || '',
      active: service.isActive,
      contractorCount: service.contractors.length
    }));

    return c.json({
      success: true,
      services: transformedServices
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch services'
    }, 500);
  }
});

// Get all flagged messages
admin.get('/admin/flagged-messages', async (c) => {
  try {
    const prisma = c.get('prisma');

    const flaggedMessages = await prisma.flaggedMessage.findMany({
      include: {
        client: true,
        contractor: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const transformed = flaggedMessages.map(flag => ({
      id: flag.id,
      conversationId: flag.messageId,
      clientName: flag.client ? `${flag.client.firstName} ${flag.client.lastName}` : 'Unknown',
      contractorName: flag.contractor ? flag.contractor.name : 'Unknown',
      sender: flag.flaggedBy === 'CLIENT' ? 'client' : 'contractor',
      message: flag.messageText,
      timestamp: new Date(flag.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      flagged: true,
      reason: flag.reason,
      details: flag.details,
      status: flag.status.toLowerCase()
    }));

    return c.json({
      success: true,
      messages: transformed
    });
  } catch (error) {
    console.error('Error fetching flagged messages:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch flagged messages'
    }, 500);
  }
});

// Create service
admin.post('/admin/services', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { name, description, icon } = await c.req.json();

    if (!name) {
      return c.json({
        success: false,
        error: 'Service name is required'
      }, 400);
    }

    // Check if service already exists
    const existing = await prisma.service.findUnique({
      where: { name }
    });

    if (existing) {
      return c.json({
        success: false,
        error: 'Service already exists'
      }, 400);
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        icon: icon || 'tool' // default icon
      }
    });

    return c.json({
      success: true,
      service
    }, 201);
  } catch (error) {
    console.error('Error creating service:', error);
    return c.json({
      success: false,
      error: 'Failed to create service'
    }, 500);
  }
});

// Update service
admin.put('/admin/services/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { name, description, isActive } = await c.req.json();

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return c.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return c.json({
      success: false,
      error: 'Failed to update service'
    }, 500);
  }
});

// Delete service
admin.delete('/admin/services/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    await prisma.service.delete({
      where: { id: parseInt(id) }
    });

    return c.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return c.json({
      success: false,
      error: 'Failed to delete service'
    }, 500);
  }
});

// Update flagged message status
admin.patch('/admin/flagged-messages/:id/status', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { status } = await c.req.json();

    const flaggedMessage = await prisma.flaggedMessage.update({
      where: { id: parseInt(id) },
      data: {
        status: status.toUpperCase(),
        reviewedAt: new Date()
      }
    });

    return c.json({
      success: true,
      message: flaggedMessage
    });
  } catch (error) {
    console.error('Error updating flagged message status:', error);
    return c.json({
      success: false,
      error: 'Failed to update status'
    }, 500);
  }
});

// Get activity logs
admin.get('/admin/activity-logs', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { limit = '50', severity } = c.req.query();

    const where: any = {};
    if (severity && ['LOW', 'MEDIUM', 'HIGH'].includes(severity as string)) {
      where.severity = severity;
    }

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string)
    });

    // Transform logs to match frontend interface
    const transformedLogs = logs.map(log => ({
      id: log.id,
      user: 'Admin', // TODO: Get actual admin username from userId
      action: log.action,
      details: log.details,
      timestamp: log.createdAt.toISOString(),
      severity: log.severity.toLowerCase() as 'low' | 'medium' | 'high'
    }));

    return c.json({
      success: true,
      logs: transformedLogs
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch activity logs'
    }, 500);
  }
});

// ============================================
// SERVICE AREAS MANAGEMENT (Admin only)
// ============================================

// GET /admin/service-areas - Get all service areas (including inactive)
admin.get('/admin/service-areas', async (c) => {
  try {
    const prisma = c.get('prisma');

    const serviceAreas = await prisma.serviceArea.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return c.json({
      success: true,
      serviceAreas
    });
  } catch (error) {
    console.error('Error fetching service areas:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch service areas'
    }, 500);
  }
});

// POST /admin/service-areas - Create a new service area
admin.post('/admin/service-areas', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { name, state } = await c.req.json();

    if (!name) {
      return c.json({
        success: false,
        error: 'Service area name is required'
      }, 400);
    }

    // Check if area already exists
    const existing = await prisma.serviceArea.findUnique({
      where: { name }
    });

    if (existing) {
      return c.json({
        success: false,
        error: 'Service area already exists'
      }, 400);
    }

    const serviceArea = await prisma.serviceArea.create({
      data: {
        name,
        state: state || null
      }
    });

    return c.json({
      success: true,
      serviceArea
    }, 201);
  } catch (error) {
    console.error('Error creating service area:', error);
    return c.json({
      success: false,
      error: 'Failed to create service area'
    }, 500);
  }
});

// PUT /admin/service-areas/:id - Update a service area
admin.put('/admin/service-areas/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { name, state, isActive } = await c.req.json();

    const serviceArea = await prisma.serviceArea.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(state !== undefined && { state }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return c.json({
      success: true,
      serviceArea
    });
  } catch (error) {
    console.error('Error updating service area:', error);
    return c.json({
      success: false,
      error: 'Failed to update service area'
    }, 500);
  }
});

// DELETE /admin/service-areas/:id - Delete a service area
admin.delete('/admin/service-areas/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    await prisma.serviceArea.delete({
      where: { id: parseInt(id) }
    });

    return c.json({
      success: true,
      message: 'Service area deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service area:', error);
    return c.json({
      success: false,
      error: 'Failed to delete service area'
    }, 500);
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

// DELETE /admin/users/:type/:id - Delete a user (client or contractor)
admin.delete('/admin/users/:type/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { type, id } = c.req.param();
    const userId = parseInt(id);

    if (type === 'client') {
      // Get the client to find the associated user
      const client = await prisma.client.findUnique({
        where: { id: userId },
        include: { user: true }
      });

      if (!client) {
        return c.json({
          success: false,
          error: 'Client not found'
        }, 404);
      }

      // Delete the user (cascades to client due to schema relation)
      await prisma.user.delete({
        where: { id: client.userId }
      });

      return c.json({
        success: true,
        message: 'Client deleted successfully'
      });
    } else if (type === 'contractor') {
      // Get the contractor to find the associated user
      const contractor = await prisma.contractor.findUnique({
        where: { id: userId },
        include: { user: true }
      });

      if (!contractor) {
        return c.json({
          success: false,
          error: 'Contractor not found'
        }, 404);
      }

      // Delete the user (cascades to contractor due to schema relation)
      await prisma.user.delete({
        where: { id: contractor.userId }
      });

      return c.json({
        success: true,
        message: 'Contractor deleted successfully'
      });
    } else {
      return c.json({
        success: false,
        error: 'Invalid user type. Must be "client" or "contractor"'
      }, 400);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({
      success: false,
      error: 'Failed to delete user'
    }, 500);
  }
});

// ============================================
// REPORTS ENDPOINTS
// ============================================

// Get all reports with filtering
admin.get('/admin/reports', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const { type, status, priority } = c.req.query();

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const reports = await prisma.report.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        booking: {
          include: {
            contractor: {
              select: { id: true, name: true }
            },
            client: {
              select: { id: true, firstName: true, lastName: true }
            },
            service: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    // Fetch reporter names for each report
    const reportsWithNames = await Promise.all(reports.map(async (report: any) => {
      let reporterName = 'Unknown';
      let reportedUserName = null;

      // Get reporter name
      if (report.reporterType === 'CLIENT') {
        const client = await prisma.client.findUnique({
          where: { id: report.reporterId },
          select: { firstName: true, lastName: true }
        });
        if (client) reporterName = `${client.firstName} ${client.lastName}`;
      } else if (report.reporterType === 'CONTRACTOR') {
        const contractor = await prisma.contractor.findUnique({
          where: { id: report.reporterId },
          select: { name: true }
        });
        if (contractor) reporterName = contractor.name;
      }

      // Get reported user name if applicable
      if (report.reportedUserId) {
        if (report.reportedUserType === 'CLIENT') {
          const client = await prisma.client.findUnique({
            where: { id: report.reportedUserId },
            select: { firstName: true, lastName: true }
          });
          if (client) reportedUserName = `${client.firstName} ${client.lastName}`;
        } else if (report.reportedUserType === 'CONTRACTOR') {
          const contractor = await prisma.contractor.findUnique({
            where: { id: report.reportedUserId },
            select: { name: true }
          });
          if (contractor) reportedUserName = contractor.name;
        }
      }

      return {
        ...report,
        reporterName,
        reportedUserName
      };
    }));

    return c.json({
      success: true,
      reports: reportsWithNames
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch reports'
    }, 500);
  }
});

// Get single report by ID
admin.get('/admin/reports/:id', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const id = parseInt(c.req.param('id'));

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            contractor: {
              select: { id: true, name: true, email: true, phone: true }
            },
            client: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true }
            },
            service: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!report) {
      return c.json({
        success: false,
        error: 'Report not found'
      }, 404);
    }

    // Get reporter details
    let reporter = null;
    if (report.reporterType === 'CLIENT') {
      reporter = await prisma.client.findUnique({
        where: { id: report.reporterId },
        select: { id: true, firstName: true, lastName: true, email: true, phone: true }
      });
    } else if (report.reporterType === 'CONTRACTOR') {
      reporter = await prisma.contractor.findUnique({
        where: { id: report.reporterId },
        select: { id: true, name: true, email: true, phone: true }
      });
    }

    // Get reported user details if applicable
    let reportedUser = null;
    if (report.reportedUserId) {
      if (report.reportedUserType === 'CLIENT') {
        reportedUser = await prisma.client.findUnique({
          where: { id: report.reportedUserId },
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        });
      } else if (report.reportedUserType === 'CONTRACTOR') {
        reportedUser = await prisma.contractor.findUnique({
          where: { id: report.reportedUserId },
          select: { id: true, name: true, email: true, phone: true }
        });
      }
    }

    return c.json({
      success: true,
      report: {
        ...report,
        reporter,
        reportedUser
      }
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch report'
    }, 500);
  }
});

// Update report status/resolution
admin.patch('/admin/reports/:id', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();

    const { status, priority, resolution, assignedTo } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (resolution !== undefined) updateData.resolution = resolution;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    // If resolving, set resolvedAt
    if (status === 'RESOLVED' || status === 'DISMISSED') {
      updateData.resolvedAt = new Date();
    }

    const report = await prisma.report.update({
      where: { id },
      data: updateData
    });

    return c.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return c.json({
      success: false,
      error: 'Failed to update report'
    }, 500);
  }
});

// Get report statistics
admin.get('/admin/reports/stats', async (c) => {
  try {
    const prisma = c.get('prisma') as any;

    const [
      totalReports,
      pendingCount,
      underReviewCount,
      resolvedCount,
      dismissedCount,
      byType,
      byPriority
    ] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.report.count({ where: { status: 'DISMISSED' } }),
      prisma.report.groupBy({
        by: ['type'],
        _count: { type: true }
      }),
      prisma.report.groupBy({
        by: ['priority'],
        _count: { priority: true }
      })
    ]);

    return c.json({
      success: true,
      stats: {
        total: totalReports,
        byStatus: {
          pending: pendingCount,
          underReview: underReviewCount,
          resolved: resolvedCount,
          dismissed: dismissedCount
        },
        byType: byType.reduce((acc: any, item: any) => {
          acc[item.type] = item._count.type;
          return acc;
        }, {}),
        byPriority: byPriority.reduce((acc: any, item: any) => {
          acc[item.priority] = item._count.priority;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching report stats:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch report statistics'
    }, 500);
  }
});

// Create a new report (for testing or manual admin creation)
admin.post('/admin/reports', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const body = await c.req.json();

    const {
      type,
      reporterType,
      reporterId,
      reportedUserId,
      reportedUserType,
      bookingId,
      reason,
      description,
      evidence,
      priority
    } = body;

    const report = await prisma.report.create({
      data: {
        type,
        reporterType,
        reporterId,
        reportedUserId: reportedUserId || null,
        reportedUserType: reportedUserType || null,
        bookingId: bookingId || null,
        reason,
        description,
        evidence: evidence ? JSON.stringify(evidence) : null,
        priority: priority || 'MEDIUM',
        status: 'PENDING'
      }
    });

    return c.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return c.json({
      success: false,
      error: 'Failed to create report'
    }, 500);
  }
});

// Delete a report
admin.delete('/admin/reports/:id', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const id = parseInt(c.req.param('id'));

    await prisma.report.delete({
      where: { id }
    });

    return c.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return c.json({
      success: false,
      error: 'Failed to delete report'
    }, 500);
  }
});

export default admin;
