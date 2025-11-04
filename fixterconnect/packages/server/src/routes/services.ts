import express, { Request, Response, Router } from 'express';
import prisma from '../lib/prisma.js';

const router: Router = express.Router();

// GET /api/services - Get all services
router.get('/services', async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        icon: true,
        description: true
      }
    });

    return res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    });
  }
});

// GET /api/services/:id - Get service by ID
router.get('/services/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
      include: {
        contractors: {
          include: {
            contractor: {
              select: {
                id: true,
                name: true,
                rating: true,
                reviewCount: true,
                location: true,
                verified: true,
                licensed: true
              }
            }
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    return res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch service'
    });
  }
});

// GET /api/contractors - Get all contractors
router.get('/contractors', async (req: Request, res: Response) => {
  try {
    const { minRating, location, verified, area } = req.query;

    // Build filter conditions
    const where: any = {};

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating as string)
      };
    }

    if (location) {
      where.location = {
        contains: location as string,
        mode: 'insensitive'
      };
    }

    if (verified === 'true') {
      where.verified = true;
    }

    // Filter by service area
    if (area) {
      where.serviceAreas = {
        some: {
          area: area as string,
          isActive: true
        }
      };
    }

    const contractors = await prisma.contractor.findMany({
      where,
      select: {
        id: true,
        name: true,
        rating: true,
        reviewCount: true,
        description: true,
        yearsInBusiness: true,
        location: true,
        verified: true,
        licensed: true,
        services: {
          select: {
            basePrice: true,
            service: {
              select: {
                id: true,
                name: true,
                icon: true
              }
            }
          }
        },
        serviceAreas: {
          where: {
            isActive: true
          },
          select: {
            area: true,
            dayOfWeek: true
          }
        }
      },
      orderBy: [
        { verified: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ]
    });

    return res.json({
      success: true,
      contractors,
      count: contractors.length
    });
  } catch (error) {
    console.error('Get all contractors error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contractors'
    });
  }
});

// GET /api/contractors/by-service/:id - Get contractors offering a specific service
router.get('/contractors/by-service/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { minRating, location, verified } = req.query;

    // Build filter conditions
    const where: any = {
      services: {
        some: {
          serviceId: parseInt(id)
        }
      }
    };

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating as string)
      };
    }

    if (location) {
      where.location = {
        contains: location as string,
        mode: 'insensitive'
      };
    }

    if (verified === 'true') {
      where.verified = true;
    }

    const contractors = await prisma.contractor.findMany({
      where,
      select: {
        id: true,
        name: true,
        rating: true,
        reviewCount: true,
        description: true,
        yearsInBusiness: true,
        location: true,
        verified: true,
        licensed: true,
        services: {
          where: {
            serviceId: parseInt(id)
          },
          select: {
            basePrice: true,
            service: {
              select: {
                id: true,
                name: true,
                icon: true
              }
            }
          }
        },
        serviceAreas: {
          where: {
            isActive: true
          },
          select: {
            area: true,
            dayOfWeek: true
          }
        }
      },
      orderBy: [
        { verified: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ]
    });

    return res.json({
      success: true,
      contractors,
      count: contractors.length
    });
  } catch (error) {
    console.error('Get contractors by service error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contractors'
    });
  }
});

// GET /api/contractor-services/:contractorId - Get contractor's services
router.get('/contractor-services/:contractorId', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;

    const contractorServices = await prisma.contractorService.findMany({
      where: { contractorId: parseInt(contractorId) },
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
    });

    // Return just the service objects
    const services = contractorServices.map(cs => cs.service);

    return res.json(services);
  } catch (error) {
    console.error('Get contractor services error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contractor services'
    });
  }
});

// GET /api/contractor-areas/:contractorId - Get contractor's service areas
router.get('/contractor-areas/:contractorId', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.params;

    const serviceAreas = await prisma.contractorServiceArea.findMany({
      where: {
        contractorId: parseInt(contractorId),
        isActive: true
      },
      select: {
        id: true,
        area: true,
        dayOfWeek: true
      }
    });

    // Extract unique area names
    const uniqueAreas = Array.from(new Set(serviceAreas.map(sa => sa.area)));

    return res.json(uniqueAreas);
  } catch (error) {
    console.error('Get contractor service areas error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contractor service areas'
    });
  }
});

// POST /api/contractor/areas - Update contractor's service areas
router.post('/contractor/areas', async (req: Request, res: Response) => {
  try {
    const { contractorId, areas } = req.body;

    if (!contractorId || !Array.isArray(areas)) {
      return res.status(400).json({
        success: false,
        error: 'Contractor ID and areas array are required'
      });
    }

    // Verify contractor exists
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    // Delete existing service areas
    await prisma.contractorServiceArea.deleteMany({
      where: { contractorId }
    });

    // Create new service areas (each area available all days)
    const serviceAreaRecords = areas.flatMap((area: string) =>
      // Create entries for Monday-Friday (1-5)
      [1, 2, 3, 4, 5].map(dayOfWeek => ({
        contractorId,
        area,
        dayOfWeek,
        isActive: true
      }))
    );

    const result = await prisma.contractorServiceArea.createMany({
      data: serviceAreaRecords
    });

    return res.json({
      success: true,
      message: 'Service areas updated successfully',
      count: result.count
    });
  } catch (error) {
    console.error('Update contractor service areas error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update service areas'
    });
  }
});

// POST /api/contractor/services - Update contractor's services
router.post('/contractor/services', async (req: Request, res: Response) => {
  try {
    const { contractorId, serviceIds } = req.body;

    if (!contractorId || !Array.isArray(serviceIds)) {
      return res.status(400).json({
        success: false,
        error: 'Contractor ID and service IDs array are required'
      });
    }

    // Verify contractor exists
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    // Delete existing services and create new ones
    await prisma.contractorService.deleteMany({
      where: { contractorId }
    });

    const contractorServices = await prisma.contractorService.createMany({
      data: serviceIds.map((serviceId: number) => ({
        contractorId,
        serviceId
      }))
    });

    return res.json({
      success: true,
      message: 'Services updated successfully',
      count: contractorServices.count
    });
  } catch (error) {
    console.error('Update contractor services error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update services'
    });
  }
});

export default router;
