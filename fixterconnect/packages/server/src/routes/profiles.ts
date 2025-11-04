import express, { Request, Response, Router } from 'express';
import prisma from '../lib/prisma.js';

const router: Router = express.Router();

// GET /api/client/:id - Get client profile
router.get('/client/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true
          }
        }
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    return res.json({
      success: true,
      client
    });
  } catch (error) {
    console.error('Get client profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch client profile'
    });
  }
});

// PUT /api/client/:id - Update client profile
router.put('/client/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      notificationEmail,
      notificationSms
    } = req.body;

    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zip !== undefined) updateData.zip = zip;
    if (notificationEmail !== undefined) updateData.notificationEmail = notificationEmail;
    if (notificationSms !== undefined) updateData.notificationSms = notificationSms;

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return res.json({
      success: true,
      client,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update client profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// GET /api/contractor/:id - Get contractor profile
router.get('/contractor/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true
          }
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                icon: true,
                description: true
              }
            }
          }
        },
        reviews: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    return res.json({
      success: true,
      contractor
    });
  } catch (error) {
    console.error('Get contractor profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contractor profile'
    });
  }
});

// PUT /api/contractor/:id - Update contractor profile
router.put('/contractor/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      description,
      yearsInBusiness,
      location,
      googleBusinessUrl,
      verified,
      licensed
    } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (description !== undefined) updateData.description = description;
    if (yearsInBusiness !== undefined) updateData.yearsInBusiness = yearsInBusiness;
    if (location !== undefined) updateData.location = location;
    if (googleBusinessUrl !== undefined) updateData.googleBusinessUrl = googleBusinessUrl;
    if (verified !== undefined) updateData.verified = verified;
    if (licensed !== undefined) updateData.licensed = licensed;

    const contractor = await prisma.contractor.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return res.json({
      success: true,
      contractor,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update contractor profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// GET /api/contractor/:id/availability - Get contractor availability
router.get('/contractor/:id/availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const where: any = {
      contractorId: parseInt(id)
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const availability = await prisma.availability.findMany({
      where,
      orderBy: {
        date: 'asc'
      }
    });

    return res.json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch availability'
    });
  }
});

// POST /api/contractor/:id/availability - Add availability slot
router.post('/contractor/:id/availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, isAvailable } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Date, start time, and end time are required'
      });
    }

    const availability = await prisma.availability.create({
      data: {
        contractorId: parseInt(id),
        date: new Date(date),
        startTime,
        endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : true
      }
    });

    return res.status(201).json({
      success: true,
      availability,
      message: 'Availability added successfully'
    });
  } catch (error) {
    console.error('Add availability error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add availability'
    });
  }
});

// DELETE /api/contractor/availability/:availabilityId - Delete availability slot
router.delete('/contractor/availability/:availabilityId', async (req: Request, res: Response) => {
  try {
    const { availabilityId } = req.params;

    await prisma.availability.delete({
      where: { id: parseInt(availabilityId) }
    });

    return res.json({
      success: true,
      message: 'Availability deleted successfully'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete availability'
    });
  }
});

export default router;
