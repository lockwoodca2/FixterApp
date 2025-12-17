import { Hono } from 'hono';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const oauth = new Hono<{ Bindings: Env; Variables: Variables }>();

// Google OAuth - verify token and login/register user
oauth.post('/auth/google', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { credential, accountType } = await c.req.json();

    if (!credential) {
      return c.json({
        success: false,
        error: 'No credential provided'
      }, 400);
    }

    // Decode the JWT token from Google (base64 encoded)
    // The credential is a JWT token, we need to decode the payload
    const parts = credential.split('.');
    if (parts.length !== 3) {
      return c.json({
        success: false,
        error: 'Invalid credential format'
      }, 400);
    }

    // Decode the payload (second part of JWT)
    // Handle base64url encoding
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const payload = JSON.parse(atob(base64));

    const { email, given_name, family_name, picture, sub: googleId } = payload;

    if (!email) {
      return c.json({
        success: false,
        error: 'Email not provided by Google'
      }, 400);
    }

    // Check if user already exists by googleId
    const existingUserByGoogleId = await prisma.user.findFirst({
      where: { googleId },
      include: {
        client: true,
        contractor: true
      }
    });

    if (existingUserByGoogleId) {
      // User exists with this Google account
      if (existingUserByGoogleId.client) {
        return c.json({
          success: true,
          user: existingUserByGoogleId.client,
          userType: 'client',
          isNewUser: false
        });
      }
      if (existingUserByGoogleId.contractor) {
        return c.json({
          success: true,
          user: existingUserByGoogleId.contractor,
          userType: 'contractor',
          isNewUser: false
        });
      }
    }

    // Check if user exists by email (might have registered with email/password before)
    const existingClient = await prisma.client.findFirst({
      where: { email },
      include: { user: true }
    });

    if (existingClient) {
      // Link Google account to existing client
      await prisma.user.update({
        where: { id: existingClient.userId },
        data: { googleId }
      });
      return c.json({
        success: true,
        user: existingClient,
        userType: 'client',
        isNewUser: false
      });
    }

    const existingContractor = await prisma.contractor.findFirst({
      where: { email },
      include: { user: true }
    });

    if (existingContractor) {
      // Link Google account to existing contractor
      await prisma.user.update({
        where: { id: existingContractor.userId },
        data: { googleId }
      });
      return c.json({
        success: true,
        user: existingContractor,
        userType: 'contractor',
        isNewUser: false
      });
    }

    // User doesn't exist - create new account
    // Default to client if no accountType specified
    const type = accountType || 'client';

    if (type === 'client') {
      // Create user first, then client
      const newUser = await prisma.user.create({
        data: {
          username: email,
          password: '', // No password for OAuth users
          type: 'CLIENT',
          authProvider: 'GOOGLE',
          googleId
        }
      });

      const newClient = await prisma.client.create({
        data: {
          userId: newUser.id,
          firstName: given_name || 'User',
          lastName: family_name || '',
          email,
          phone: '',
          profilePicture: picture || null
        }
      });

      return c.json({
        success: true,
        user: newClient,
        userType: 'client',
        isNewUser: true
      });
    } else {
      // Create contractor
      const newUser = await prisma.user.create({
        data: {
          username: email,
          password: '',
          type: 'CONTRACTOR',
          authProvider: 'GOOGLE',
          googleId
        }
      });

      const newContractor = await prisma.contractor.create({
        data: {
          userId: newUser.id,
          name: `${given_name || ''} ${family_name || ''}`.trim() || 'Contractor',
          firstName: given_name || null,
          lastName: family_name || null,
          email,
          phone: '',
          description: '',
          profileImage: picture || null
        }
      });

      return c.json({
        success: true,
        user: newContractor,
        userType: 'contractor',
        isNewUser: true
      });
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
    return c.json({
      success: false,
      error: 'Failed to authenticate with Google'
    }, 500);
  }
});

export default oauth;
