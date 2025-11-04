import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get all users (clients and contractors)
router.get('/admin/users', async (req, res) => {
  try {
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
      id: client.id,
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
      id: contractor.id,
      name: contractor.name,
      email: contractor.email || '',
      phone: contractor.phone || '',
      type: 'contractor' as const,
      status: 'active' as const,
      joinDate: contractor.createdAt.toISOString().split('T')[0],
      totalJobs: contractor.bookings.length,
      totalEarned: contractor.bookings.reduce((sum, booking) => sum + (booking.price || 0), 0)
    }));

    return res.json({
      success: true,
      users: [...clientUsers, ...contractorUsers]
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Get all services
router.get('/admin/services', async (req, res) => {
  try {
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

    return res.json({
      success: true,
      services: transformedServices
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    });
  }
});

// Get all flagged messages
router.get('/admin/flagged-messages', async (req, res) => {
  try {
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

    return res.json({
      success: true,
      messages: transformed
    });
  } catch (error) {
    console.error('Error fetching flagged messages:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch flagged messages'
    });
  }
});

// Update service
router.put('/admin/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description
      }
    });

    return res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update service'
    });
  }
});

// Delete service
router.delete('/admin/services/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id: parseInt(id) }
    });

    return res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete service'
    });
  }
});

// Update flagged message status
router.patch('/admin/flagged-messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const flaggedMessage = await prisma.flaggedMessage.update({
      where: { id: parseInt(id) },
      data: {
        status: status.toUpperCase(),
        reviewedAt: new Date()
      }
    });

    return res.json({
      success: true,
      message: flaggedMessage
    });
  } catch (error) {
    console.error('Error updating flagged message status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update status'
    });
  }
});

export default router;
