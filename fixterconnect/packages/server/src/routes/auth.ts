import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { UserType } from '@prisma/client';

const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password, userType } = req.body;

    if (!username || !password || !userType) {
      return res.status(400).json({
        success: false,
        error: 'Username, password, and userType are required'
      });
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
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, type: userType }, JWT_SECRET, { expiresIn: '7d' });

    // Return user details based on type
    if (userType === 'client' && user.client) {
      return res.json({
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
      return res.json({
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

    return res.status(404).json({
      success: false,
      error: 'User profile not found'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create account endpoint
router.post('/create-account', async (req: Request, res: Response) => {
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
    } = req.body;

    // Validate required fields
    if (!username || !password || !accountType) {
      return res.status(400).json({
        success: false,
        error: 'Username, password, and accountType are required'
      });
    }

    if (accountType === 'client' && (!firstName || !lastName || !email || !phone)) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, email, and phone are required for clients'
      });
    }

    if (accountType === 'contractor' && (!firstName || !lastName)) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required for contractors'
      });
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
      return res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile in a transaction
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

      return res.status(201).json({
        success: true,
        userId: result.id,
        message: 'Client account created successfully'
      });

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

      return res.status(201).json({
        success: true,
        userId: result.id,
        message: 'Contractor account created successfully'
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid account type'
    });

  } catch (error) {
    console.error('Create account error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create account'
    });
  }
});

export default router;
