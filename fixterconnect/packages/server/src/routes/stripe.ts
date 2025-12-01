import express, { Request, Response, Router } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma.js';

const router: Router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia' as any,
});

// Platform fee percentages
const PLATFORM_FEE_FREE = 5;
const PLATFORM_FEE_PREMIUM = 3;
const FREE_JOB_LIMIT = 5;

// POST /api/stripe/subscription/create-checkout - Create Stripe Checkout session for premium subscription
router.post('/stripe/subscription/create-checkout', async (req: Request, res: Response) => {
  try {
    const { contractorId, successUrl, cancelUrl } = req.body;

    if (!contractorId) {
      return res.status(400).json({
        success: false,
        error: 'Contractor ID is required'
      });
    }

    // Get contractor with existing subscription
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        subscription: true
      }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    // Check if already premium
    if (contractor.subscription?.tier === 'PREMIUM' && contractor.subscription?.status === 'ACTIVE') {
      return res.status(400).json({
        success: false,
        error: 'You already have an active premium subscription'
      });
    }

    // Get or create Stripe customer
    let customerId = contractor.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: contractor.email || undefined,
        name: contractor.name || undefined,
        metadata: {
          contractorId: contractor.id.toString()
        }
      });
      customerId = customer.id;

      // Create or update subscription record with customer ID
      await prisma.subscription.upsert({
        where: { contractorId: contractor.id },
        create: {
          contractorId: contractor.id,
          stripeCustomerId: customerId,
          tier: 'FREE',
          status: 'ACTIVE'
        },
        update: {
          stripeCustomerId: customerId
        }
      });
    }

    // Get premium price ID from environment or look up from product
    let priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
    const productId = process.env.STRIPE_PREMIUM_PRODUCT_ID;

    // If no price ID but we have a product ID, look up the price
    if (!priceId && productId) {
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        type: 'recurring',
        limit: 1
      });

      if (prices.data.length > 0) {
        priceId = prices.data[0].id;
      }
    }

    if (!priceId) {
      return res.status(500).json({
        success: false,
        error: 'Stripe premium price not configured. Please set STRIPE_PREMIUM_PRICE_ID or STRIPE_PREMIUM_PRODUCT_ID in environment variables.'
      });
    }

    // Create checkout session
    const baseUrl = successUrl?.split('/contractor')[0] || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${baseUrl}/contractor-dashboard?subscription=success`,
      cancel_url: cancelUrl || `${baseUrl}/contractor-dashboard?subscription=cancelled`,
      metadata: {
        contractorId: contractor.id.toString()
      },
      subscription_data: {
        metadata: {
          contractorId: contractor.id.toString()
        }
      }
    });

    return res.json({
      success: true,
      checkoutUrl: session.url
    });
  } catch (error) {
    console.error('Create subscription checkout error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    });
  }
});

// GET /api/stripe/subscription/status/:contractorId - Get subscription status
router.get('/stripe/subscription/status/:contractorId', async (req: Request, res: Response) => {
  try {
    const contractorId = parseInt(req.params.contractorId);

    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        subscription: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
                }
              }
            }
          }
        }
      }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    const subscription = contractor.subscription;
    const isPremium = subscription?.tier === 'PREMIUM' && subscription?.status === 'ACTIVE';
    const activeJobs = contractor._count.bookings;

    return res.json({
      success: true,
      tier: subscription?.tier || 'FREE',
      status: subscription?.status || 'ACTIVE',
      isPremium,
      currentPeriodEnd: subscription?.currentPeriodEnd,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
      activeJobs,
      maxActiveJobs: isPremium ? null : FREE_JOB_LIMIT,
      canCreateJob: isPremium || activeJobs < FREE_JOB_LIMIT,
      platformFeePercent: isPremium ? PLATFORM_FEE_PREMIUM : PLATFORM_FEE_FREE,
      features: {
        unlimitedJobs: isPremium,
        reducedFees: isPremium,
        priorityListing: isPremium,
        advancedScheduling: isPremium,
        automatedReminders: isPremium,
        teamManagement: isPremium,
        accountingExport: isPremium
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get subscription status'
    });
  }
});

// POST /api/stripe/subscription/portal - Create customer portal session for managing subscription
router.post('/stripe/subscription/portal', async (req: Request, res: Response) => {
  try {
    const { contractorId, returnUrl } = req.body;

    if (!contractorId) {
      return res.status(400).json({
        success: false,
        error: 'Contractor ID is required'
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { contractorId }
    });

    if (!subscription?.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        error: 'No Stripe customer found for this contractor'
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl || 'http://localhost:3000/contractor-dashboard?tab=settings'
    });

    return res.json({
      success: true,
      portalUrl: session.url
    });
  } catch (error) {
    console.error('Create portal session error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create portal session'
    });
  }
});

// POST /api/stripe/subscription/cancel - Cancel subscription at period end
router.post('/stripe/subscription/cancel', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.body;

    if (!contractorId) {
      return res.status(400).json({
        success: false,
        error: 'Contractor ID is required'
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { contractorId }
    });

    if (!subscription?.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'No active subscription found'
      });
    }

    // Cancel at period end (don't cancel immediately)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Update local record
    await prisma.subscription.update({
      where: { contractorId },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date()
      }
    });

    return res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription'
    });
  }
});

// POST /api/stripe/subscription/reactivate - Reactivate a subscription that was set to cancel
router.post('/stripe/subscription/reactivate', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.body;

    if (!contractorId) {
      return res.status(400).json({
        success: false,
        error: 'Contractor ID is required'
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { contractorId }
    });

    if (!subscription?.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'No subscription found'
      });
    }

    // Reactivate the subscription
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false
    });

    // Update local record
    await prisma.subscription.update({
      where: { contractorId },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null
      }
    });

    return res.json({
      success: true,
      message: 'Subscription reactivated successfully'
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reactivate subscription'
    });
  }
});

// GET /api/stripe/earnings/:contractorId - Get contractor earnings
router.get('/stripe/earnings/:contractorId', async (req: Request, res: Response) => {
  try {
    const contractorId = parseInt(req.params.contractorId);

    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        subscription: true
      }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    // Get all completed payments for this contractor
    const payments = await prisma.payment.findMany({
      where: {
        booking: {
          contractorId: contractorId
        },
        status: 'SUCCEEDED'
      },
      include: {
        booking: {
          include: {
            service: true,
            client: true
          }
        },
        invoice: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Determine fee rate based on subscription
    const isPremium = contractor.subscription?.tier === 'PREMIUM' && contractor.subscription?.status === 'ACTIVE';
    const feeRate = isPremium ? PLATFORM_FEE_PREMIUM : PLATFORM_FEE_FREE;

    // Calculate totals
    let totalEarnings = 0;
    let totalPlatformFees = 0;
    let pendingAmount = 0;
    const monthlyBreakdown: { [key: string]: number } = {};

    const formattedPayments = payments.map((payment) => {
      const grossAmount = payment.amount;
      const platformFee = (grossAmount * feeRate) / 100;
      const netAmount = grossAmount - platformFee;

      totalEarnings += netAmount;
      totalPlatformFees += platformFee;

      // Monthly breakdown
      const monthKey = new Date(payment.createdAt).toISOString().slice(0, 7);
      monthlyBreakdown[monthKey] = (monthlyBreakdown[monthKey] || 0) + netAmount;

      const client = payment.booking?.client;
      const clientName = client ? `${client.firstName} ${client.lastName}`.trim() : 'Unknown';

      return {
        id: payment.id,
        date: payment.createdAt,
        clientName,
        serviceName: payment.booking?.service?.name || 'Service',
        grossAmount,
        platformFee,
        netAmount,
        invoiceId: payment.invoiceId,
        bookingId: payment.bookingId
      };
    });

    // Calculate this month's earnings
    const now = new Date();
    const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthEarnings = monthlyBreakdown[thisMonthKey] || 0;

    return res.json({
      success: true,
      earnings: {
        summary: {
          totalEarnings,
          totalPlatformFees,
          thisMonthEarnings,
          paymentCount: payments.length,
          pendingAmount,
          platformFeeRate: feeRate,
          isPremium
        },
        payments: formattedPayments,
        monthlyBreakdown
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get earnings'
    });
  }
});

// GET /api/stripe/connect/status/:contractorId - Get Stripe Connect status
router.get('/stripe/connect/status/:contractorId', async (req: Request, res: Response) => {
  try {
    const contractorId = parseInt(req.params.contractorId);

    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      select: {
        stripeAccountId: true
      }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    if (!contractor.stripeAccountId) {
      return res.json({
        success: true,
        status: {
          hasAccount: false,
          onboardingComplete: false,
          chargesEnabled: false,
          payoutsEnabled: false
        }
      });
    }

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(contractor.stripeAccountId);

    return res.json({
      success: true,
      status: {
        hasAccount: true,
        onboardingComplete: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        stripeAccountId: contractor.stripeAccountId
      }
    });
  } catch (error) {
    console.error('Get Stripe status error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get Stripe status'
    });
  }
});

// POST /api/stripe/connect/create - Create Stripe Connect account
router.post('/stripe/connect/create', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.body;

    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: 'Contractor not found'
      });
    }

    // Check if account already exists
    if (contractor.stripeAccountId) {
      return res.status(400).json({
        success: false,
        error: 'Stripe account already exists'
      });
    }

    // Create connected account
    const account = await stripe.accounts.create({
      type: 'express',
      email: contractor.email || undefined,
      metadata: {
        contractorId: contractor.id.toString()
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      }
    });

    // Update contractor with Stripe account ID
    await prisma.contractor.update({
      where: { id: contractorId },
      data: { stripeAccountId: account.id }
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.origin || 'http://localhost:3000'}/contractor-dashboard?stripe_refresh=true`,
      return_url: `${req.headers.origin || 'http://localhost:3000'}/contractor-dashboard?stripe_onboarding=complete`,
      type: 'account_onboarding'
    });

    return res.json({
      success: true,
      onboardingUrl: accountLink.url
    });
  } catch (error) {
    console.error('Create Stripe account error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create Stripe account'
    });
  }
});

// POST /api/stripe/connect/onboarding-link - Get onboarding link for existing account
router.post('/stripe/connect/onboarding-link', async (req: Request, res: Response) => {
  try {
    const { contractorId } = req.body;

    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });

    if (!contractor?.stripeAccountId) {
      return res.status(400).json({
        success: false,
        error: 'No Stripe account found'
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: contractor.stripeAccountId,
      refresh_url: `${req.headers.origin || 'http://localhost:3000'}/contractor-dashboard?stripe_refresh=true`,
      return_url: `${req.headers.origin || 'http://localhost:3000'}/contractor-dashboard?stripe_onboarding=complete`,
      type: 'account_onboarding'
    });

    return res.json({
      success: true,
      onboardingUrl: accountLink.url
    });
  } catch (error) {
    console.error('Get onboarding link error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get onboarding link'
    });
  }
});

export default router;
