import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get all favorite contractors for a client
router.get('/favorites/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const favorites = await prisma.favoriteContractor.findMany({
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
    const transformedFavorites = favorites.map(fav => ({
      id: fav.contractor.id,
      name: fav.contractor.name,
      rating: fav.contractor.rating,
      reviewCount: fav.contractor.reviewCount,
      verified: fav.contractor.verified,
      services: fav.contractor.services.map(s => s.service.name),
      favoritedAt: fav.createdAt
    }));

    return res.json({
      success: true,
      favorites: transformedFavorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites'
    });
  }
});

// Add a contractor to favorites
router.post('/favorites', async (req, res) => {
  try {
    const { clientId, contractorId } = req.body;

    if (!clientId || !contractorId) {
      return res.status(400).json({
        success: false,
        error: 'clientId and contractorId are required'
      });
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
      return res.status(400).json({
        success: false,
        error: 'Contractor already in favorites'
      });
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

    return res.json({
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
    return res.status(500).json({
      success: false,
      error: 'Failed to add favorite'
    });
  }
});

// Remove a contractor from favorites
router.delete('/favorites/:clientId/:contractorId', async (req, res) => {
  try {
    const { clientId, contractorId } = req.params;

    await prisma.favoriteContractor.delete({
      where: {
        clientId_contractorId: {
          clientId: parseInt(clientId),
          contractorId: parseInt(contractorId)
        }
      }
    });

    return res.json({
      success: true,
      message: 'Contractor removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove favorite'
    });
  }
});

// Check if a contractor is favorited by a client
router.get('/favorites/check/:clientId/:contractorId', async (req, res) => {
  try {
    const { clientId, contractorId } = req.params;

    const favorite = await prisma.favoriteContractor.findUnique({
      where: {
        clientId_contractorId: {
          clientId: parseInt(clientId),
          contractorId: parseInt(contractorId)
        }
      }
    });

    return res.json({
      success: true,
      isFavorite: !!favorite
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check favorite status'
    });
  }
});

export default router;
