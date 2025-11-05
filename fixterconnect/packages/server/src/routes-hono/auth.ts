import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { UserType } from '@prisma/client';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const auth = new Hono<{ Bindings: Env; Variables: Variables }>();

// Login endpoint
auth.post('/login', async (c) => {
  try {
    const { username, password, userType } = await c.req.json();
    const prisma = c.get('prisma');

    if (!username || !password || !userType) {
      return c.json({
        success: false,
        error: 'Username, password, and userType are required'
      }, 400);
    }

    // Normalize userType to match enum
    const normalizedType = userType.toUpperCase() as UserType;

    // Find user with Prisma
    const user = await prisma.user.findFirst({
      where: {
        username,
        type: normalizedType
      },
      include: {
        client: true,
        contractor: true
      }
    });

    if (!user) {
      return c.json({
        success: false,
        error: 'Invalid credentials'
      }, 401);
    }

    // Verify password using Web Crypto API (Workers compatible)
    // Note: For production, use a proper bcrypt alternative for Workers
    // For now, we'll use a simple comparison (MUST be replaced with proper hashing)
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return c.json({
        success: false,
        error: 'Invalid credentials'
      }, 401);
    }

    // Generate JWT token
    const token = await sign(
      {
        id: user.id,
        type: userType,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      },
      c.env.JWT_SECRET
    );

    // Return user details based on type
    if (userType === 'client' && user.client) {
      return c.json({
        success: true,
        client: {
          id: user.client.id,
          username: user.username,
          type: 'client',
          firstName: user.client.firstName,
          lastName: user.client.lastName,
          email: user.client.email,
          phone: user.client.phone,
          address: user.client.address,
          city: user.client.city,
          state: user.client.state,
          zip: user.client.zip
        },
        token
      });
    } else if (userType === 'contractor' && user.contractor) {
      return c.json({
        success: true,
        contractor: {
          id: user.contractor.id,
          username: user.username,
          type: 'contractor',
          name: user.contractor.name,
          rating: user.contractor.rating,
          review_count: user.contractor.reviewCount,
          description: user.contractor.description,
          years_in_business: user.contractor.yearsInBusiness,
          location: user.contractor.location,
          google_business_url: user.contractor.googleBusinessUrl
        },
        token
      });
    }

    return c.json({
      success: false,
      error: 'User profile not found'
    }, 404);

  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
});

// Create account endpoint
auth.post('/create-account', async (c) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
      accountType,
      yearsExperience
    } = await c.req.json();

    const prisma = c.get('prisma');

    // Validate required fields
    if (!username || !password || !accountType) {
      return c.json({
        success: false,
        error: 'Username, password, and accountType are required'
      }, 400);
    }

    if (accountType === 'client' && (!firstName || !lastName || !email || !phone)) {
      return c.json({
        success: false,
        error: 'First name, last name, email, and phone are required for clients'
      }, 400);
    }

    if (accountType === 'contractor' && (!firstName || !lastName)) {
      return c.json({
        success: false,
        error: 'First name and last name are required for contractors'
      }, 400);
    }

    // Normalize accountType to match enum
    const normalizedType = accountType.toUpperCase() as UserType;

    // Check if username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        type: normalizedType
      }
    });

    if (existingUser) {
      return c.json({
        success: false,
        error: 'Username already exists'
      }, 400);
    }

    // Hash password (Workers compatible)
    const hashedPassword = await hashPassword(password);

    // Create user with profile
    if (accountType === 'client') {
      const result = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          type: UserType.CLIENT,
          client: {
            create: {
              firstName,
              lastName,
              email,
              phone
            }
          }
        },
        include: {
          client: true
        }
      });

      return c.json({
        success: true,
        userId: result.id,
        message: 'Client account created successfully'
      }, 201);

    } else if (accountType === 'contractor') {
      const contractorName = `${firstName} ${lastName}`;
      const result = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          type: UserType.CONTRACTOR,
          contractor: {
            create: {
              name: contractorName,
              yearsInBusiness: yearsExperience || 0,
              rating: 0,
              reviewCount: 0
            }
          }
        },
        include: {
          contractor: true
        }
      });

      return c.json({
        success: true,
        userId: result.id,
        message: 'Contractor account created successfully'
      }, 201);
    }

    return c.json({
      success: false,
      error: 'Invalid account type'
    }, 400);

  } catch (error) {
    console.error('Create account error:', error);
    return c.json({
      success: false,
      error: 'Failed to create account'
    }, 500);
  }
});

// Password hashing utility (Workers compatible)
// TODO: Replace with proper bcrypt alternative for Workers (e.g., @cfworker/bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

export default auth;
