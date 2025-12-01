import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const profiles = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/client/:id - Get client profile
profiles.get('/client/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

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
      return c.json({
        success: false,
        error: 'Client not found'
      }, 404);
    }

    return c.json({
      success: true,
      client
    });
  } catch (error) {
    console.error('Get client profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch client profile'
    }, 500);
  }
});

// PUT /api/client/:id - Update client profile
profiles.put('/client/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
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
    } = await c.req.json();

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

    return c.json({
      success: true,
      client,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update client profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to update profile'
    }, 500);
  }
});

// GET /api/contractor/:id - Get contractor profile
profiles.get('/contractor/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

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
        languages: {
          include: {
            language: true
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
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    // Calculate trust signals
    const contractorId = parseInt(id);
    const now = new Date();
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

    // Get total jobs completed
    const jobsCompleted = await prisma.booking.count({
      where: {
        contractorId,
        status: 'COMPLETED'
      }
    });

    // Get jobs completed in last 45 days for Rising Star badge
    const recentJobsCompleted = await prisma.booking.count({
      where: {
        contractorId,
        status: 'COMPLETED',
        updatedAt: {
          gte: fortyFiveDaysAgo
        }
      }
    });

    // Get last booking date
    const lastBooking = await prisma.booking.findFirst({
      where: {
        contractorId,
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        createdAt: true
      }
    });

    // Calculate average response time (hours) from bookings created to confirmed
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        contractorId,
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']
        }
      },
      select: {
        createdAt: true,
        updatedAt: true
      },
      take: 20 // Last 20 bookings for average
    });

    let avgResponseHours = null;
    if (confirmedBookings.length > 0) {
      const totalHours = confirmedBookings.reduce((sum, booking) => {
        const diffMs = booking.updatedAt.getTime() - booking.createdAt.getTime();
        return sum + (diffMs / (1000 * 60 * 60)); // Convert ms to hours
      }, 0);
      avgResponseHours = Math.round(totalHours / confirmedBookings.length);
    }

    // Calculate badge eligibility
    const accountAge = now.getTime() - contractor.createdAt.getTime();
    const daysSinceJoined = Math.floor(accountAge / (24 * 60 * 60 * 1000));

    const isJustJoined = daysSinceJoined <= 30;
    const isRisingStar = recentJobsCompleted >= 1 && recentJobsCompleted <= 5;

    return c.json({
      success: true,
      contractor: {
        ...contractor,
        trustSignals: {
          jobsCompleted,
          lastBookedAt: lastBooking?.createdAt || null,
          avgResponseHours,
          verified: contractor.verified,
          licensed: contractor.licensed,
          insured: contractor.insured,
          afterHoursAvailable: contractor.afterHoursAvailable,
          languages: contractor.languages?.map((cl: any) => cl.language) || [],
          isJustJoined,
          isRisingStar
        }
      }
    });
  } catch (error) {
    console.error('Get contractor profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch contractor profile'
    }, 500);
  }
});

// PUT /api/contractor/:id - Update contractor profile
profiles.put('/contractor/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const {
      firstName,
      lastName,
      name,
      email,
      phone,
      description,
      yearsInBusiness,
      location,
      googleBusinessUrl,
      verified,
      licensed,
      insured,
      afterHoursAvailable,
      speaksSpanish,
      hourlyRate,
      taxRate
    } = await c.req.json();

    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (description !== undefined) updateData.description = description;
    if (yearsInBusiness !== undefined) updateData.yearsInBusiness = yearsInBusiness;
    if (location !== undefined) updateData.location = location;
    if (googleBusinessUrl !== undefined) updateData.googleBusinessUrl = googleBusinessUrl;
    if (verified !== undefined) updateData.verified = verified;
    if (licensed !== undefined) updateData.licensed = licensed;
    if (insured !== undefined) updateData.insured = insured;
    if (afterHoursAvailable !== undefined) updateData.afterHoursAvailable = afterHoursAvailable;
    if (speaksSpanish !== undefined) updateData.speaksSpanish = speaksSpanish;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (taxRate !== undefined) updateData.taxRate = taxRate;

    const contractor = await prisma.contractor.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return c.json({
      success: true,
      contractor,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update contractor profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to update profile'
    }, 500);
  }
});

// GET /api/contractor/:id/availability - Get contractor availability
profiles.get('/contractor/:id/availability', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { startDate, endDate } = c.req.query();

    const where: any = {
      contractorId: parseInt(id)
    };

    if (startDate || endDate) {
      where.specificDate = {};
      if (startDate) where.specificDate.gte = new Date(startDate);
      if (endDate) where.specificDate.lte = new Date(endDate);
    }

    const availability = await prisma.availability.findMany({
      where,
      orderBy: {
        specificDate: 'asc'
      }
    });

    return c.json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch availability'
    }, 500);
  }
});

// POST /api/contractor/:id/availability - Add availability slot
profiles.post('/contractor/:id/availability', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { date, startTime, endTime, isAvailable, dayOfWeek, isRecurring } = await c.req.json();

    if (!startTime || !endTime) {
      return c.json({
        success: false,
        error: 'Start time and end time are required'
      }, 400);
    }

    const availability = await prisma.availability.create({
      data: {
        contractorId: parseInt(id),
        specificDate: date ? new Date(date) : null,
        dayOfWeek: dayOfWeek !== undefined ? dayOfWeek : null,
        isRecurring: isRecurring !== undefined ? isRecurring : !date,
        startTime,
        endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : true
      }
    });

    return c.json({
      success: true,
      availability,
      message: 'Availability added successfully'
    }, 201);
  } catch (error) {
    console.error('Add availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to add availability'
    }, 500);
  }
});

// DELETE /api/contractor/availability/:availabilityId - Delete availability slot
profiles.delete('/contractor/availability/:availabilityId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { availabilityId } = c.req.param();

    await prisma.availability.delete({
      where: { id: parseInt(availabilityId) }
    });

    return c.json({
      success: true,
      message: 'Availability deleted successfully'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete availability'
    }, 500);
  }
});

// ============================================
// CUSTOM BOOKING PAGE ENDPOINTS (Premium Feature)
// ============================================

// GET /api/contractor/:id/booking-page - Get custom booking page settings
profiles.get('/contractor/:id/booking-page', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    const contractor: any = await prisma.contractor.findUnique({
      where: { id: parseInt(id) },
      include: {
        subscription: true
      }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    // Check if premium
    const isPremium = contractor.subscription?.tier === 'PREMIUM' &&
                      contractor.subscription?.status === 'ACTIVE';

    return c.json({
      success: true,
      isPremium,
      bookingPage: {
        enabled: contractor.bookingPageEnabled || false,
        slug: contractor.bookingPageSlug || null,
        primaryColor: contractor.bookingPagePrimaryColor || null,
        accentColor: contractor.bookingPageAccentColor || null,
        tagline: contractor.bookingPageTagline || null,
        logo: contractor.bookingPageLogo || null,
        showReviews: contractor.bookingPageShowReviews !== false,
        showPrices: contractor.bookingPageShowPrices !== false,
        url: contractor.bookingPageSlug ? `/book/${contractor.bookingPageSlug}` : null
      }
    });
  } catch (error) {
    console.error('Get booking page settings error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch booking page settings'
    }, 500);
  }
});

// PUT /api/contractor/:id/booking-page - Update custom booking page settings (Premium only)
profiles.put('/contractor/:id/booking-page', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const { id } = c.req.param();
    const {
      enabled,
      slug,
      primaryColor,
      accentColor,
      tagline,
      logo,
      showReviews,
      showPrices
    } = await c.req.json();

    // Check if contractor exists and is premium
    const contractor: any = await prisma.contractor.findUnique({
      where: { id: parseInt(id) },
      include: {
        subscription: true
      }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    // Check premium status
    const isPremium = contractor.subscription?.tier === 'PREMIUM' &&
                      contractor.subscription?.status === 'ACTIVE';

    if (!isPremium) {
      return c.json({
        success: false,
        error: 'Custom booking pages are a Premium feature. Please upgrade to access this feature.',
        code: 'PREMIUM_REQUIRED'
      }, 403);
    }

    // Validate and sanitize slug if provided
    if (slug !== undefined && slug !== null && slug !== '') {
      // Slugify: lowercase, replace spaces with hyphens, remove special chars
      const sanitizedSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);

      if (sanitizedSlug.length < 3) {
        return c.json({
          success: false,
          error: 'Slug must be at least 3 characters long'
        }, 400);
      }

      // Check if slug is already taken by another contractor
      const existingContractor = await prisma.contractor.findFirst({
        where: {
          bookingPageSlug: sanitizedSlug,
          id: { not: parseInt(id) }
        }
      });

      if (existingContractor) {
        return c.json({
          success: false,
          error: 'This URL is already taken. Please choose a different one.'
        }, 400);
      }
    }

    // Build update data
    const updateData: any = {};

    if (enabled !== undefined) updateData.bookingPageEnabled = enabled;
    if (slug !== undefined) {
      updateData.bookingPageSlug = slug ? slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50) : null;
    }
    if (primaryColor !== undefined) updateData.bookingPagePrimaryColor = primaryColor;
    if (accentColor !== undefined) updateData.bookingPageAccentColor = accentColor;
    if (tagline !== undefined) updateData.bookingPageTagline = tagline;
    if (logo !== undefined) updateData.bookingPageLogo = logo;
    if (showReviews !== undefined) updateData.bookingPageShowReviews = showReviews;
    if (showPrices !== undefined) updateData.bookingPageShowPrices = showPrices;

    const updatedContractor: any = await prisma.contractor.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return c.json({
      success: true,
      bookingPage: {
        enabled: updatedContractor.bookingPageEnabled || false,
        slug: updatedContractor.bookingPageSlug || null,
        primaryColor: updatedContractor.bookingPagePrimaryColor || null,
        accentColor: updatedContractor.bookingPageAccentColor || null,
        tagline: updatedContractor.bookingPageTagline || null,
        logo: updatedContractor.bookingPageLogo || null,
        showReviews: updatedContractor.bookingPageShowReviews !== false,
        showPrices: updatedContractor.bookingPageShowPrices !== false,
        url: updatedContractor.bookingPageSlug ? `/book/${updatedContractor.bookingPageSlug}` : null
      },
      message: 'Booking page settings updated successfully'
    });
  } catch (error) {
    console.error('Update booking page settings error:', error);
    return c.json({
      success: false,
      error: 'Failed to update booking page settings'
    }, 500);
  }
});

// GET /api/booking-page/:slug - Get public booking page by slug
profiles.get('/booking-page/:slug', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const { slug } = c.req.param();

    // Find contractor by booking page slug
    const contractor: any = await prisma.contractor.findFirst({
      where: {
        bookingPageSlug: slug,
        bookingPageEnabled: true,
        isActive: true,
        isBanned: false
      },
      include: {
        subscription: true,
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
        languages: {
          include: {
            language: true
          }
        },
        reviews: {
          include: {
            client: {
              select: {
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
      return c.json({
        success: false,
        error: 'Booking page not found'
      }, 404);
    }

    // Verify premium status (booking pages require premium)
    const isPremium = contractor.subscription?.tier === 'PREMIUM' &&
                      contractor.subscription?.status === 'ACTIVE';

    if (!isPremium) {
      return c.json({
        success: false,
        error: 'This booking page is no longer available'
      }, 404);
    }

    // Get trust signals
    const contractorId = contractor.id;
    const now = new Date();
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

    const jobsCompleted = await prisma.booking.count({
      where: {
        contractorId,
        status: 'COMPLETED'
      }
    });

    const recentJobsCompleted = await prisma.booking.count({
      where: {
        contractorId,
        status: 'COMPLETED',
        updatedAt: {
          gte: fortyFiveDaysAgo
        }
      }
    });

    const accountAge = now.getTime() - contractor.createdAt.getTime();
    const daysSinceJoined = Math.floor(accountAge / (24 * 60 * 60 * 1000));

    // Build response with custom page settings
    return c.json({
      success: true,
      contractor: {
        id: contractor.id,
        name: contractor.name,
        description: contractor.description,
        location: contractor.location,
        phone: contractor.phone,
        email: contractor.email,
        profilePicture: contractor.profilePicture,
        rating: contractor.rating,
        reviewCount: contractor.reviewCount,
        yearsInBusiness: contractor.yearsInBusiness,
        verified: contractor.verified,
        licensed: contractor.licensed,
        insured: contractor.insured,
        afterHoursAvailable: contractor.afterHoursAvailable,
        services: contractor.bookingPageShowPrices !== false
          ? contractor.services
          : contractor.services.map((s: any) => ({ ...s, basePrice: null })),
        languages: contractor.languages?.map((cl: any) => cl.language) || [],
        reviews: contractor.bookingPageShowReviews !== false ? contractor.reviews : [],
        trustSignals: {
          jobsCompleted,
          isJustJoined: daysSinceJoined <= 30,
          isRisingStar: recentJobsCompleted >= 1 && recentJobsCompleted <= 5
        }
      },
      bookingPage: {
        slug: contractor.bookingPageSlug,
        primaryColor: contractor.bookingPagePrimaryColor || '#3b82f6',
        accentColor: contractor.bookingPageAccentColor || '#8b5cf6',
        tagline: contractor.bookingPageTagline || null,
        logo: contractor.bookingPageLogo || null,
        showReviews: contractor.bookingPageShowReviews !== false,
        showPrices: contractor.bookingPageShowPrices !== false
      }
    });
  } catch (error) {
    console.error('Get public booking page error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch booking page'
    }, 500);
  }
});

// GET /api/booking-page/:slug/availability - Get availability for booking page
profiles.get('/booking-page/:slug/availability', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const { slug } = c.req.param();
    const { startDate, endDate } = c.req.query();

    // Find contractor by slug
    const contractor: any = await prisma.contractor.findFirst({
      where: {
        bookingPageSlug: slug,
        bookingPageEnabled: true,
        isActive: true
      },
      include: {
        subscription: true
      }
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Booking page not found'
      }, 404);
    }

    // Verify premium
    const isPremium = contractor.subscription?.tier === 'PREMIUM' &&
                      contractor.subscription?.status === 'ACTIVE';

    if (!isPremium) {
      return c.json({
        success: false,
        error: 'This booking page is no longer available'
      }, 404);
    }

    // Get availability
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

    const availability = await prisma.availability.findMany({
      where: {
        contractorId: contractor.id,
        OR: [
          { isRecurring: true },
          {
            specificDate: {
              gte: start,
              lte: end
            }
          }
        ]
      }
    });

    return c.json({
      success: true,
      contractorId: contractor.id,
      availability
    });
  } catch (error) {
    console.error('Get booking page availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch availability'
    }, 500);
  }
});

// POST /api/booking-page/check-slug - Check if a slug is available
profiles.post('/booking-page/check-slug', async (c) => {
  try {
    const prisma = c.get('prisma') as any;
    const { slug, contractorId } = await c.req.json();

    if (!slug) {
      return c.json({
        success: false,
        error: 'Slug is required'
      }, 400);
    }

    // Sanitize slug
    const sanitizedSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);

    if (sanitizedSlug.length < 3) {
      return c.json({
        success: true,
        available: false,
        error: 'Slug must be at least 3 characters long',
        sanitizedSlug
      });
    }

    // Check if slug is taken
    const existingContractor = await prisma.contractor.findFirst({
      where: {
        bookingPageSlug: sanitizedSlug,
        ...(contractorId ? { id: { not: parseInt(contractorId) } } : {})
      }
    });

    return c.json({
      success: true,
      available: !existingContractor,
      sanitizedSlug,
      url: `/book/${sanitizedSlug}`
    });
  } catch (error) {
    console.error('Check slug availability error:', error);
    return c.json({
      success: false,
      error: 'Failed to check slug availability'
    }, 500);
  }
});

export default profiles;
