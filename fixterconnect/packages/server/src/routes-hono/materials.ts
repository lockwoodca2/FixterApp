import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const materials = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/materials/:contractorId - Get all materials for a contractor
materials.get('/materials/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

    const materialsList = await prisma.material.findMany({
      where: {
        contractorId: parseInt(contractorId)
      },
      orderBy: {
        name: 'asc'
      }
    });

    return c.json({
      success: true,
      materials: materialsList
    });
  } catch (error) {
    console.error('Get materials error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch materials'
    }, 500);
  }
});

// POST /api/materials - Create a new material
materials.post('/materials', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, name, price, unit, description } = await c.req.json();

    if (!contractorId || !name || price === undefined || !unit) {
      return c.json({
        success: false,
        error: 'Contractor ID, name, price, and unit are required'
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

    const material = await prisma.material.create({
      data: {
        contractorId,
        name,
        price: parseFloat(price),
        unit,
        description: description || null
      }
    });

    return c.json({
      success: true,
      material
    }, 201);
  } catch (error) {
    console.error('Create material error:', error);
    return c.json({
      success: false,
      error: 'Failed to create material'
    }, 500);
  }
});

// PUT /api/materials/:id - Update a material
materials.put('/materials/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { name, price, unit, description } = await c.req.json();

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingMaterial) {
      return c.json({
        success: false,
        error: 'Material not found'
      }, 404);
    }

    const material = await prisma.material.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(unit && { unit }),
        ...(description !== undefined && { description })
      }
    });

    return c.json({
      success: true,
      material
    });
  } catch (error) {
    console.error('Update material error:', error);
    return c.json({
      success: false,
      error: 'Failed to update material'
    }, 500);
  }
});

// DELETE /api/materials/:id - Delete a material
materials.delete('/materials/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingMaterial) {
      return c.json({
        success: false,
        error: 'Material not found'
      }, 404);
    }

    await prisma.material.delete({
      where: { id: parseInt(id) }
    });

    return c.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Delete material error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete material'
    }, 500);
  }
});

export default materials;
