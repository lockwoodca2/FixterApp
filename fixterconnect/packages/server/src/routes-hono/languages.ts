import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const languages = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/languages - Get all languages
languages.get('/languages', async (c) => {
  try {
    const prisma = c.get('prisma');

    const allLanguages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return c.json({
      success: true,
      languages: allLanguages
    });
  } catch (error) {
    console.error('Get languages error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch languages'
    }, 500);
  }
});

// GET /api/languages/all - Get all languages including inactive (admin)
languages.get('/languages/all', async (c) => {
  try {
    const prisma = c.get('prisma');

    const allLanguages = await prisma.language.findMany({
      orderBy: { name: 'asc' }
    });

    return c.json({
      success: true,
      languages: allLanguages
    });
  } catch (error) {
    console.error('Get all languages error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch languages'
    }, 500);
  }
});

// POST /api/languages - Create a new language (admin)
languages.post('/languages', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { name, code, flag } = await c.req.json();

    if (!name || !code || !flag) {
      return c.json({
        success: false,
        error: 'Name, code, and flag are required'
      }, 400);
    }

    const language = await prisma.language.create({
      data: {
        name,
        code,
        flag,
        isActive: true
      }
    });

    return c.json({
      success: true,
      language,
      message: 'Language created successfully'
    });
  } catch (error: any) {
    console.error('Create language error:', error);
    if (error.code === 'P2002') {
      return c.json({
        success: false,
        error: 'Language with this name or code already exists'
      }, 400);
    }
    return c.json({
      success: false,
      error: 'Failed to create language'
    }, 500);
  }
});

// PUT /api/languages/:id - Update a language (admin)
languages.put('/languages/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { name, code, flag, isActive } = await c.req.json();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (code !== undefined) updateData.code = code;
    if (flag !== undefined) updateData.flag = flag;
    if (isActive !== undefined) updateData.isActive = isActive;

    const language = await prisma.language.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return c.json({
      success: true,
      language,
      message: 'Language updated successfully'
    });
  } catch (error) {
    console.error('Update language error:', error);
    return c.json({
      success: false,
      error: 'Failed to update language'
    }, 500);
  }
});

// DELETE /api/languages/:id - Delete a language (admin)
languages.delete('/languages/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    await prisma.language.delete({
      where: { id: parseInt(id) }
    });

    return c.json({
      success: true,
      message: 'Language deleted successfully'
    });
  } catch (error) {
    console.error('Delete language error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete language'
    }, 500);
  }
});

// GET /api/contractor/:id/languages - Get languages for a contractor
languages.get('/contractor/:id/languages', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    const contractorLanguages = await prisma.contractorLanguage.findMany({
      where: { contractorId: parseInt(id) },
      include: {
        language: true
      }
    });

    return c.json({
      success: true,
      languages: contractorLanguages.map(cl => cl.language)
    });
  } catch (error) {
    console.error('Get contractor languages error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch contractor languages'
    }, 500);
  }
});

// POST /api/contractor/:id/languages - Update contractor languages
languages.post('/contractor/:id/languages', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { languageIds } = await c.req.json();

    // Delete existing languages for this contractor
    await prisma.contractorLanguage.deleteMany({
      where: { contractorId: parseInt(id) }
    });

    // Add new languages
    if (languageIds && languageIds.length > 0) {
      await prisma.contractorLanguage.createMany({
        data: languageIds.map((languageId: number) => ({
          contractorId: parseInt(id),
          languageId
        }))
      });
    }

    // Fetch updated languages
    const contractorLanguages = await prisma.contractorLanguage.findMany({
      where: { contractorId: parseInt(id) },
      include: {
        language: true
      }
    });

    return c.json({
      success: true,
      languages: contractorLanguages.map(cl => cl.language),
      message: 'Languages updated successfully'
    });
  } catch (error) {
    console.error('Update contractor languages error:', error);
    return c.json({
      success: false,
      error: 'Failed to update contractor languages'
    }, 500);
  }
});

export default languages;
