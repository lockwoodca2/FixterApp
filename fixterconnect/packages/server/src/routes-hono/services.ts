import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const services = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/services - Get all services
services.get('/services', async (c) => {
  try {
    const prisma = c.get('prisma');

    const servicesList = await prisma.service.findMany({
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

    return c.json({
      success: true,
      services: servicesList
    });
  } catch (error) {
    console.error('Get services error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch services'
    }, 500);
  }
});

// GET /api/service-areas - Get all unique service areas (cities)
services.get('/service-areas', async (c) => {
  try {
    const prisma = c.get('prisma');

    // Get all unique service areas from active contractor service areas
    const serviceAreas = await prisma.contractorServiceArea.findMany({
      where: {
        isActive: true
      },
      select: {
        area: true
      },
      distinct: ['area'],
      orderBy: {
        area: 'asc'
      }
    });

    // Transform to match the expected format: { id, name }
    const formattedAreas = serviceAreas.map((sa, index) => ({
      id: index + 1,
      name: sa.area
    }));

    return c.json(formattedAreas);
  } catch (error) {
    console.error('Get service areas error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch service areas'
    }, 500);
  }
});

// GET /api/services/:id - Get service by ID
services.get('/services/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

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
      return c.json({
        success: false,
        error: 'Service not found'
      }, 404);
    }

    return c.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch service'
    }, 500);
  }
});

// GET /api/contractors - Get all contractors
services.get('/contractors', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { minRating, location, verified, area } = c.req.query();

    // Build filter conditions
    const where: any = {};

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating)
      };
    }

    if (location) {
      where.location = {
        contains: location,
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
          area: area,
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

    return c.json({
      success: true,
      contractors,
      count: contractors.length
    });
  } catch (error) {
    console.error('Get all contractors error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch contractors'
    }, 500);
  }
});

// GET /api/contractors/by-service/:id - Get contractors offering a specific service
services.get('/contractors/by-service/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { minRating, location, verified } = c.req.query();

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
        gte: parseFloat(minRating)
      };
    }

    if (location) {
      where.location = {
        contains: location,
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

    return c.json({
      success: true,
      contractors,
      count: contractors.length
    });
  } catch (error) {
    console.error('Get contractors by service error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch contractors'
    }, 500);
  }
});

// GET /api/contractor-services/:contractorId - Get contractor's services
services.get('/contractor-services/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

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
    const servicesList = contractorServices.map(cs => cs.service);

    return c.json(servicesList);
  } catch (error) {
    console.error('Get contractor services error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch contractor services'
    }, 500);
  }
});

// GET /api/contractor-areas/:contractorId - Get contractor's service areas
services.get('/contractor-areas/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

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

    return c.json(uniqueAreas);
  } catch (error) {
    console.error('Get contractor service areas error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch contractor service areas'
    }, 500);
  }
});

// POST /api/contractor/areas - Update contractor's service areas
services.post('/contractor/areas', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, areas } = await c.req.json();

    if (!contractorId || !Array.isArray(areas)) {
      return c.json({
        success: false,
        error: 'Contractor ID and areas array are required'
      }, 400);
    }

    // Verify contractor exists
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
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

    return c.json({
      success: true,
      message: 'Service areas updated successfully',
      count: result.count
    });
  } catch (error) {
    console.error('Update contractor service areas error:', error);
    return c.json({
      success: false,
      error: 'Failed to update service areas'
    }, 500);
  }
});

// POST /api/contractor/services - Update contractor's services
services.post('/contractor/services', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, serviceIds } = await c.req.json();

    if (!contractorId || !Array.isArray(serviceIds)) {
      return c.json({
        success: false,
        error: 'Contractor ID and service IDs array are required'
      }, 400);
    }

    // Verify contractor exists
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
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

    return c.json({
      success: true,
      message: 'Services updated successfully',
      count: contractorServices.count
    });
  } catch (error) {
    console.error('Update contractor services error:', error);
    return c.json({
      success: false,
      error: 'Failed to update services'
    }, 500);
  }
});

export default services;
