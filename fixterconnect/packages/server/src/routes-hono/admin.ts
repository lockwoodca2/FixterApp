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
      active: true, // All services are active by default
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

// Update service
admin.put('/admin/services/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { name, description } = await c.req.json();

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description
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

export default admin;
