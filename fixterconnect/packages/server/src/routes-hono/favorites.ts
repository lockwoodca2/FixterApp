import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const favorites = new Hono<{ Bindings: Env; Variables: Variables }>();

// Get all favorite contractors for a client
favorites.get('/favorites/client/:clientId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { clientId } = c.req.param();

    const favoritesList = await prisma.favoriteContractor.findMany({
      where: {
        clientId: parseInt(clientId)
      },
      include: {
        contractor: {
          include: {
            services: {
              include: {
                service: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the UI format
    const transformedFavorites = favoritesList.map(fav => ({
      id: fav.contractor.id,
      name: fav.contractor.name,
      rating: fav.contractor.rating,
      reviewCount: fav.contractor.reviewCount,
      verified: fav.contractor.verified,
      services: fav.contractor.services.map(s => s.service.name),
      favoritedAt: fav.createdAt
    }));

    return c.json({
      success: true,
      favorites: transformedFavorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch favorites'
    }, 500);
  }
});

// Add a contractor to favorites
favorites.post('/favorites', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { clientId, contractorId } = await c.req.json();

    if (!clientId || !contractorId) {
      return c.json({
        success: false,
        error: 'clientId and contractorId are required'
      }, 400);
    }

    // Check if already favorited
    const existing = await prisma.favoriteContractor.findUnique({
      where: {
        clientId_contractorId: {
          clientId: parseInt(clientId),
          contractorId: parseInt(contractorId)
        }
      }
    });

    if (existing) {
      return c.json({
        success: false,
        error: 'Contractor already in favorites'
      }, 400);
    }

    const favorite = await prisma.favoriteContractor.create({
      data: {
        clientId: parseInt(clientId),
        contractorId: parseInt(contractorId)
      },
      include: {
        contractor: {
          include: {
            services: {
              include: {
                service: true
              }
            }
          }
        }
      }
    });

    return c.json({
      success: true,
      favorite: {
        id: favorite.contractor.id,
        name: favorite.contractor.name,
        rating: favorite.contractor.rating,
        reviewCount: favorite.contractor.reviewCount,
        verified: favorite.contractor.verified,
        services: favorite.contractor.services.map(s => s.service.name),
        favoritedAt: favorite.createdAt
      }
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return c.json({
      success: false,
      error: 'Failed to add favorite'
    }, 500);
  }
});

// Remove a contractor from favorites
favorites.delete('/favorites/:clientId/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { clientId, contractorId } = c.req.param();

    await prisma.favoriteContractor.delete({
      where: {
        clientId_contractorId: {
          clientId: parseInt(clientId),
          contractorId: parseInt(contractorId)
        }
      }
    });

    return c.json({
      success: true,
      message: 'Contractor removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return c.json({
      success: false,
      error: 'Failed to remove favorite'
    }, 500);
  }
});

// Check if a contractor is favorited by a client
favorites.get('/favorites/check/:clientId/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { clientId, contractorId } = c.req.param();

    const favorite = await prisma.favoriteContractor.findUnique({
      where: {
        clientId_contractorId: {
          clientId: parseInt(clientId),
          contractorId: parseInt(contractorId)
        }
      }
    });

    return c.json({
      success: true,
      isFavorite: !!favorite
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return c.json({
      success: false,
      error: 'Failed to check favorite status'
    }, 500);
  }
});

export default favorites;
