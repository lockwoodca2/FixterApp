import { Hono } from 'hono';
import Stripe from 'stripe';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const stripe = new Hono<{ Bindings: Env; Variables: Variables }>();

// Helper to get Stripe instance
function getStripe(secretKey: string): Stripe {
  return new Stripe(secretKey);
}

// POST /api/stripe/connect/onboard - Create Stripe Express account and return onboarding link
stripe.post('/stripe/connect/onboard', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = await c.req.json();

    if (!contractorId) {
      return c.json({
        success: false,
        error: 'Contractor ID is required'
      }, 400);
    }

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Get contractor details
    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(contractorId) },
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    let stripeAccountId = contractor.stripeAccountId;

    // Create Stripe Express account if one doesn't exist
    if (!stripeAccountId) {
      const account = await stripeClient.accounts.create({
        type: 'express',
        country: 'US',
        email: contractor.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          contractorId: contractorId.toString(),
        },
      });

      stripeAccountId = account.id;

      // Save the Stripe account ID to the contractor
      await prisma.contractor.update({
        where: { id: parseInt(contractorId) },
        data: {
          stripeAccountId: account.id,
        },
      });
    }

    // Determine the return URL based on environment
    const baseUrl = c.req.header('origin') || 'http://localhost:3000';

    // Create an account link for onboarding
    const accountLink = await stripeClient.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/contractor/dashboard?stripe_refresh=true`,
      return_url: `${baseUrl}/contractor/dashboard?stripe_onboarding=complete`,
      type: 'account_onboarding',
    });

    return c.json({
      success: true,
      url: accountLink.url,
      stripeAccountId,
    });
  } catch (error) {
    console.error('Stripe onboarding error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create onboarding link'
    }, 500);
  }
});

// GET /api/stripe/connect/status/:contractorId - Check contractor's onboarding status
stripe.get('/stripe/connect/status/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(contractorId) },
      select: {
        stripeAccountId: true,
        stripeOnboardingComplete: true,
        stripeChargesEnabled: true,
        stripePayoutsEnabled: true,
      },
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    if (!contractor.stripeAccountId) {
      return c.json({
        success: true,
        status: {
          hasAccount: false,
          onboardingComplete: false,
          chargesEnabled: false,
          payoutsEnabled: false,
        },
      });
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Fetch the latest account status from Stripe
    const account = await stripeClient.accounts.retrieve(contractor.stripeAccountId);

    const onboardingComplete = account.details_submitted ?? false;
    const chargesEnabled = account.charges_enabled ?? false;
    const payoutsEnabled = account.payouts_enabled ?? false;

    // Update the contractor record if status has changed
    if (
      onboardingComplete !== contractor.stripeOnboardingComplete ||
      chargesEnabled !== contractor.stripeChargesEnabled ||
      payoutsEnabled !== contractor.stripePayoutsEnabled
    ) {
      await prisma.contractor.update({
        where: { id: parseInt(contractorId) },
        data: {
          stripeOnboardingComplete: onboardingComplete,
          stripeChargesEnabled: chargesEnabled,
          stripePayoutsEnabled: payoutsEnabled,
        },
      });
    }

    return c.json({
      success: true,
      status: {
        hasAccount: true,
        stripeAccountId: contractor.stripeAccountId,
        onboardingComplete,
        chargesEnabled,
        payoutsEnabled,
        requirements: account.requirements,
      },
    });
  } catch (error) {
    console.error('Stripe status check error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check status'
    }, 500);
  }
});

// GET /api/stripe/connect/dashboard/:contractorId - Get link to Stripe Express Dashboard
stripe.get('/stripe/connect/dashboard/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(contractorId) },
      select: {
        stripeAccountId: true,
      },
    });

    if (!contractor) {
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    if (!contractor.stripeAccountId) {
      return c.json({
        success: false,
        error: 'Contractor has not connected a Stripe account'
      }, 400);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Create a login link for the Express dashboard
    const loginLink = await stripeClient.accounts.createLoginLink(contractor.stripeAccountId);

    return c.json({
      success: true,
      url: loginLink.url,
    });
  } catch (error) {
    console.error('Stripe dashboard link error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create dashboard link'
    }, 500);
  }
});

// ============================================
// PAYMENT PROCESSING ENDPOINTS
// ============================================

const PLATFORM_FEE_FREE = 5; // 5% platform fee for free tier
const PLATFORM_FEE_PREMIUM = 3; // 3% platform fee for premium tier

// POST /api/stripe/payment/create-intent - Create a PaymentIntent for an invoice
stripe.post('/stripe/payment/create-intent', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { invoiceId } = await c.req.json();

    if (!invoiceId) {
      return c.json({
        success: false,
        error: 'Invoice ID is required'
      }, 400);
    }

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    // Get invoice with booking and contractor details (including subscription)
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceId) },
      include: {
        booking: {
          include: {
            contractor: {
              include: {
                subscription: true
              }
            },
            client: true,
            service: true
          }
        }
      }
    });

    if (!invoice) {
      return c.json({
        success: false,
        error: 'Invoice not found'
      }, 404);
    }

    if (invoice.status === 'PAID') {
      return c.json({
        success: false,
        error: 'Invoice is already paid'
      }, 400);
    }

    // Check if contractor has Stripe connected
    const contractor = invoice.booking.contractor;
    if (!contractor.stripeAccountId) {
      return c.json({
        success: false,
        error: 'Contractor has not connected a payment account. Please contact them to set up payments.'
      }, 400);
    }

    if (!contractor.stripeChargesEnabled) {
      return c.json({
        success: false,
        error: 'Contractor payment account is not fully verified yet. Please try again later.'
      }, 400);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Check if we already have a PaymentIntent for this invoice
    if (invoice.stripePaymentIntentId) {
      // Retrieve existing PaymentIntent
      const existingIntent = await stripeClient.paymentIntents.retrieve(invoice.stripePaymentIntentId);

      if (existingIntent.status === 'succeeded') {
        return c.json({
          success: false,
          error: 'This invoice has already been paid'
        }, 400);
      }

      // Determine fee rate based on subscription
      const isPremium = contractor.subscription?.tier === 'PREMIUM' && contractor.subscription?.status === 'ACTIVE';
      const feePercent = isPremium ? PLATFORM_FEE_PREMIUM : PLATFORM_FEE_FREE;

      // Return existing PaymentIntent client secret
      return c.json({
        success: true,
        clientSecret: existingIntent.client_secret,
        paymentIntentId: existingIntent.id,
        amount: invoice.totalAmount,
        platformFee: Math.round(invoice.totalAmount * feePercent) / 100,
        isPremium,
        feePercent,
      });
    }

    // Determine fee rate based on subscription
    const isPremium = contractor.subscription?.tier === 'PREMIUM' && contractor.subscription?.status === 'ACTIVE';
    const feePercent = isPremium ? PLATFORM_FEE_PREMIUM : PLATFORM_FEE_FREE;

    // Calculate amounts in cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(invoice.totalAmount * 100);
    const platformFeeInCents = Math.round(amountInCents * feePercent / 100);

    // Create PaymentIntent with transfer to connected account
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      // Automatically transfer to contractor after successful payment, minus platform fee
      application_fee_amount: platformFeeInCents,
      transfer_data: {
        destination: contractor.stripeAccountId,
      },
      metadata: {
        invoiceId: invoiceId.toString(),
        bookingId: invoice.bookingId.toString(),
        contractorId: contractor.id.toString(),
        clientId: invoice.booking.client.id.toString(),
      },
      description: `Payment for ${invoice.booking.service.name} - Invoice #${invoice.id}`,
    });

    // Save PaymentIntent ID to invoice
    await prisma.invoice.update({
      where: { id: parseInt(invoiceId) },
      data: {
        stripePaymentIntentId: paymentIntent.id
      }
    });

    return c.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: invoice.totalAmount,
      platformFee: platformFeeInCents / 100,
      isPremium,
      feePercent,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    }, 500);
  }
});

// POST /api/stripe/payment/confirm - Confirm payment was successful (called after frontend payment)
stripe.post('/stripe/payment/confirm', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { paymentIntentId, invoiceId } = await c.req.json();

    if (!paymentIntentId || !invoiceId) {
      return c.json({
        success: false,
        error: 'Payment intent ID and invoice ID are required'
      }, 400);
    }

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Verify the payment intent status
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return c.json({
        success: false,
        error: `Payment not completed. Status: ${paymentIntent.status}`
      }, 400);
    }

    // Get invoice details
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceId) },
      include: {
        booking: {
          include: {
            contractor: true
          }
        }
      }
    });

    if (!invoice) {
      return c.json({
        success: false,
        error: 'Invoice not found'
      }, 404);
    }

    // Calculate fee breakdown
    const totalAmount = paymentIntent.amount / 100; // Convert from cents
    const platformFee = (paymentIntent.application_fee_amount || 0) / 100;
    const contractorPayout = totalAmount - platformFee;

    // Get the transfer ID from the payment intent (if available)
    let stripeTransferId = null;
    if (paymentIntent.transfer_data?.destination) {
      // The transfer is created automatically by Stripe when using transfer_data
      const transfers = await stripeClient.transfers.list({
        destination: paymentIntent.transfer_data.destination as string,
        limit: 1,
      });
      if (transfers.data.length > 0) {
        stripeTransferId = transfers.data[0].id;
      }
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: invoice.bookingId,
        invoiceId: invoice.id,
        amount: totalAmount,
        paymentMethod: 'card',
        stripePaymentId: paymentIntent.id,
        stripePaymentIntent: paymentIntentId,
        platformFee,
        contractorPayout,
        stripeTransferId,
        status: 'SUCCEEDED',
        paidAt: new Date(),
      }
    });

    // Update invoice status
    await prisma.invoice.update({
      where: { id: parseInt(invoiceId) },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      }
    });

    // Update booking payment status
    await prisma.booking.update({
      where: { id: invoice.bookingId },
      data: {
        paymentReceived: true
      }
    });

    return c.json({
      success: true,
      payment: {
        id: payment.id,
        amount: totalAmount,
        platformFee,
        contractorPayout,
        status: 'SUCCEEDED'
      },
      message: 'Payment completed successfully'
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to confirm payment'
    }, 500);
  }
});

// GET /api/stripe/payment/status/:invoiceId - Get payment status for an invoice
stripe.get('/stripe/payment/status/:invoiceId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { invoiceId } = c.req.param();

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceId) },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        booking: {
          include: {
            contractor: {
              select: {
                stripeAccountId: true,
                stripeChargesEnabled: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!invoice) {
      return c.json({
        success: false,
        error: 'Invoice not found'
      }, 404);
    }

    const contractor = invoice.booking.contractor;
    const canAcceptPayments = contractor.stripeAccountId && contractor.stripeChargesEnabled;

    return c.json({
      success: true,
      status: {
        invoiceStatus: invoice.status,
        isPaid: invoice.status === 'PAID',
        hasPaymentIntent: !!invoice.stripePaymentIntentId,
        canAcceptPayments,
        contractorName: contractor.name,
        lastPayment: invoice.payments[0] || null
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get payment status'
    }, 500);
  }
});

// GET /api/stripe/config - Get Stripe publishable key for frontend
stripe.get('/stripe/config', async (c) => {
  // This would ideally come from an environment variable exposed to the frontend
  // For now, we'll return a placeholder that the frontend should already have
  return c.json({
    success: true,
    publishableKey: 'pk_test_51SZHxyIhKqHeFpJABY3rLS8sobWVvChg8cYDuEdXu811zlE8m2REEoo20Nj4NM0UHsUCIv9S1PYojLOUELI7G0Pe00WKskwycL'
  });
});

// ============================================
// EARNINGS ENDPOINTS
// ============================================

// GET /api/stripe/earnings/:contractorId - Get contractor earnings summary and payment history
stripe.get('/stripe/earnings/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();
    const { period } = c.req.query(); // 'week', 'month', 'year', 'all'

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date | null = null;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = null; // All time
    }

    // Build where clause
    const whereClause: any = {
      booking: {
        contractorId: parseInt(contractorId)
      },
      status: 'SUCCEEDED'
    };

    if (startDate) {
      whereClause.paidAt = { gte: startDate };
    }

    // Get all successful payments for this contractor
    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        booking: {
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            service: {
              select: {
                name: true
              }
            }
          }
        },
        invoice: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        paidAt: 'desc'
      }
    });

    // Calculate totals
    const totalEarnings = payments.reduce((sum, p) => sum + (p.contractorPayout || 0), 0);
    const totalPlatformFees = payments.reduce((sum, p) => sum + (p.platformFee || 0), 0);
    const totalGross = payments.reduce((sum, p) => sum + p.amount, 0);
    const paymentCount = payments.length;

    // Get pending payments (invoices not yet paid)
    const pendingInvoices = await prisma.invoice.findMany({
      where: {
        booking: {
          contractorId: parseInt(contractorId)
        },
        status: 'PENDING'
      },
      select: {
        totalAmount: true
      }
    });

    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingCount = pendingInvoices.length;

    // Transform payments for response
    const paymentHistory = payments.map(p => ({
      id: p.id,
      date: p.paidAt?.toISOString() || p.createdAt.toISOString(),
      clientName: `${p.booking.client.firstName} ${p.booking.client.lastName}`,
      serviceName: p.booking.service.name,
      grossAmount: p.amount,
      platformFee: p.platformFee || 0,
      netAmount: p.contractorPayout || p.amount,
      invoiceId: p.invoice?.id || null,
      bookingId: p.bookingId
    }));

    // Calculate monthly breakdown for the current year
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const monthlyPayments = await prisma.payment.findMany({
      where: {
        booking: {
          contractorId: parseInt(contractorId)
        },
        status: 'SUCCEEDED',
        paidAt: { gte: yearStart }
      },
      select: {
        contractorPayout: true,
        paidAt: true
      }
    });

    const monthlyBreakdown: { [key: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    monthlyPayments.forEach(p => {
      if (p.paidAt) {
        const monthKey = months[p.paidAt.getMonth()];
        monthlyBreakdown[monthKey] = (monthlyBreakdown[monthKey] || 0) + (p.contractorPayout || 0);
      }
    });

    return c.json({
      success: true,
      earnings: {
        summary: {
          totalEarnings: Math.round(totalEarnings * 100) / 100,
          totalPlatformFees: Math.round(totalPlatformFees * 100) / 100,
          totalGross: Math.round(totalGross * 100) / 100,
          paymentCount,
          pendingAmount: Math.round(pendingAmount * 100) / 100,
          pendingCount,
          period: period || 'all'
        },
        payments: paymentHistory,
        monthlyBreakdown
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get earnings'
    }, 500);
  }
});

// ============================================
// SUBSCRIPTION ENDPOINTS
// ============================================

const PREMIUM_PRICE_MONTHLY = 3999; // $39.99 in cents

// POST /api/stripe/subscription/create-checkout - Create Stripe Checkout session for premium subscription
stripe.post('/stripe/subscription/create-checkout', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = await c.req.json();

    if (!contractorId) {
      return c.json({
        success: false,
        error: 'Contractor ID is required'
      }, 400);
    }

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Get contractor details
    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(contractorId) },
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

    // Check if already premium
    if (contractor.subscription?.tier === 'PREMIUM' && contractor.subscription?.status === 'ACTIVE') {
      return c.json({
        success: false,
        error: 'You already have an active premium subscription'
      }, 400);
    }

    // Get or create Stripe customer
    let customerId = contractor.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripeClient.customers.create({
        email: contractor.email || undefined,
        name: contractor.name,
        metadata: {
          contractorId: contractorId.toString(),
        },
      });
      customerId = customer.id;

      // Create or update subscription record with customer ID
      await prisma.subscription.upsert({
        where: { contractorId: parseInt(contractorId) },
        create: {
          contractorId: parseInt(contractorId),
          tier: 'FREE',
          status: 'ACTIVE',
          stripeCustomerId: customerId,
        },
        update: {
          stripeCustomerId: customerId,
        },
      });
    }

    // Get or create the price for premium subscription
    // In production, you'd have a fixed price ID from Stripe dashboard
    let priceId = c.env.STRIPE_PREMIUM_PRICE_ID;

    if (!priceId) {
      // Create a price dynamically (in production, use a pre-created price)
      const price = await stripeClient.prices.create({
        unit_amount: PREMIUM_PRICE_MONTHLY,
        currency: 'usd',
        recurring: { interval: 'month' },
        product_data: {
          name: 'FixterConnect Premium',
        },
      });
      priceId = price.id;
    }

    const baseUrl = c.req.header('origin') || 'http://localhost:3000';

    // Create Checkout Session
    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/contractor/dashboard?subscription=success`,
      cancel_url: `${baseUrl}/contractor/dashboard?subscription=cancelled`,
      metadata: {
        contractorId: contractorId.toString(),
      },
      subscription_data: {
        metadata: {
          contractorId: contractorId.toString(),
        },
      },
    });

    return c.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Create subscription checkout error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    }, 500);
  }
});

// GET /api/stripe/subscription/status/:contractorId - Get subscription status
stripe.get('/stripe/subscription/status/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(contractorId) },
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
      return c.json({
        success: false,
        error: 'Contractor not found'
      }, 404);
    }

    const subscription = contractor.subscription;
    const isPremium = subscription?.tier === 'PREMIUM' && subscription?.status === 'ACTIVE';
    const activeJobCount = contractor._count.bookings;

    // Free tier limits
    const FREE_JOB_LIMIT = 5;
    const canCreateJob = isPremium || activeJobCount < FREE_JOB_LIMIT;

    return c.json({
      success: true,
      subscription: {
        tier: subscription?.tier || 'FREE',
        status: subscription?.status || 'ACTIVE',
        isPremium,
        currentPeriodEnd: subscription?.currentPeriodEnd,
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
      },
      limits: {
        activeJobs: activeJobCount,
        maxActiveJobs: isPremium ? null : FREE_JOB_LIMIT, // null = unlimited
        canCreateJob,
        platformFeePercent: isPremium ? 3 : 5, // 3% for premium, 5% for free
      },
      features: {
        unlimitedJobs: isPremium,
        priorityListing: isPremium,
        advancedScheduling: isPremium,
        reducedFees: isPremium,
        customBookingPage: isPremium,
        automatedReminders: isPremium,
        teamManagement: isPremium,
        accountingExport: isPremium,
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get subscription status'
    }, 500);
  }
});

// POST /api/stripe/subscription/portal - Create customer portal session for managing subscription
stripe.post('/stripe/subscription/portal', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = await c.req.json();

    if (!contractorId) {
      return c.json({
        success: false,
        error: 'Contractor ID is required'
      }, 400);
    }

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const subscription = await prisma.subscription.findUnique({
      where: { contractorId: parseInt(contractorId) },
    });

    if (!subscription?.stripeCustomerId) {
      return c.json({
        success: false,
        error: 'No billing account found. Please subscribe first.'
      }, 400);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);
    const baseUrl = c.req.header('origin') || 'http://localhost:3000';

    const session = await stripeClient.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${baseUrl}/contractor/dashboard?section=settings`,
    });

    return c.json({
      success: true,
      portalUrl: session.url,
    });
  } catch (error) {
    console.error('Create portal session error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create portal session'
    }, 500);
  }
});

// POST /api/stripe/subscription/cancel - Cancel subscription at period end
stripe.post('/stripe/subscription/cancel', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = await c.req.json();

    if (!contractorId) {
      return c.json({
        success: false,
        error: 'Contractor ID is required'
      }, 400);
    }

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const subscription = await prisma.subscription.findUnique({
      where: { contractorId: parseInt(contractorId) },
    });

    if (!subscription?.stripeSubscriptionId) {
      return c.json({
        success: false,
        error: 'No active subscription found'
      }, 400);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Cancel at period end (user keeps access until billing period ends)
    await stripeClient.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update local record
    await prisma.subscription.update({
      where: { contractorId: parseInt(contractorId) },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });

    return c.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription'
    }, 500);
  }
});

// POST /api/stripe/subscription/reactivate - Reactivate a subscription that was set to cancel
stripe.post('/stripe/subscription/reactivate', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = await c.req.json();

    if (!contractorId) {
      return c.json({
        success: false,
        error: 'Contractor ID is required'
      }, 400);
    }

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const subscription = await prisma.subscription.findUnique({
      where: { contractorId: parseInt(contractorId) },
    });

    if (!subscription?.stripeSubscriptionId) {
      return c.json({
        success: false,
        error: 'No subscription found'
      }, 400);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Reactivate by removing cancel_at_period_end
    await stripeClient.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update local record
    await prisma.subscription.update({
      where: { contractorId: parseInt(contractorId) },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    });

    return c.json({
      success: true,
      message: 'Subscription reactivated successfully',
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reactivate subscription'
    }, 500);
  }
});

// ============================================
// WEBHOOK ENDPOINT
// ============================================

// POST /api/stripe/webhook - Handle Stripe webhook events
stripe.post('/stripe/webhook', async (c) => {
  console.log('=== WEBHOOK RECEIVED ===');

  try {
    const prisma = c.get('prisma');

    if (!c.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured');
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);
    const signature = c.req.header('stripe-signature');

    console.log('Webhook signature present:', !!signature);
    console.log('Webhook secret configured:', !!c.env.STRIPE_WEBHOOK_SECRET);

    if (!signature) {
      console.error('No Stripe signature found');
      return c.json({ error: 'No signature' }, 400);
    }

    // Get raw body for signature verification
    const rawBody = await c.req.text();
    console.log('Raw body length:', rawBody.length);

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (c.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripeClient.webhooks.constructEvent(
          rawBody,
          signature,
          c.env.STRIPE_WEBHOOK_SECRET
        );
        console.log('Webhook signature verified successfully');
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return c.json({ error: 'Invalid signature' }, 400);
      }
    } else {
      // In development, parse without verification (not recommended for production)
      console.warn('STRIPE_WEBHOOK_SECRET not set - skipping signature verification');
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    console.log(`Received Stripe webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(prisma, stripeClient, paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(prisma, paymentIntent);
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(prisma, account);
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        console.log(`Transfer created: ${transfer.id} for $${transfer.amount / 100}`);
        break;
      }

      // Subscription events
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(prisma, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(prisma, subscription);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          await handleCheckoutCompleted(prisma, session);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          await handleSubscriptionPaymentFailed(prisma, invoice);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Webhook processing failed'
    }, 500);
  }
});

// Helper function to handle successful payment
async function handlePaymentIntentSucceeded(
  prisma: any,
  stripeClient: Stripe,
  paymentIntent: Stripe.PaymentIntent
) {
  const invoiceId = paymentIntent.metadata?.invoiceId;

  if (!invoiceId) {
    console.log('PaymentIntent has no invoiceId in metadata, skipping');
    return;
  }

  // Check if we already processed this payment
  const existingPayment = await prisma.payment.findFirst({
    where: { stripePaymentIntent: paymentIntent.id }
  });

  if (existingPayment) {
    console.log(`Payment already recorded for PaymentIntent ${paymentIntent.id}`);
    return;
  }

  // Get invoice details
  const invoice = await prisma.invoice.findUnique({
    where: { id: parseInt(invoiceId) },
    include: {
      booking: {
        include: {
          contractor: true
        }
      }
    }
  });

  if (!invoice) {
    console.error(`Invoice ${invoiceId} not found for PaymentIntent ${paymentIntent.id}`);
    return;
  }

  if (invoice.status === 'PAID') {
    console.log(`Invoice ${invoiceId} already marked as paid`);
    return;
  }

  // Calculate fee breakdown
  const totalAmount = paymentIntent.amount / 100;
  const platformFee = (paymentIntent.application_fee_amount || 0) / 100;
  const contractorPayout = totalAmount - platformFee;

  // Get the transfer ID
  let stripeTransferId = null;
  if (paymentIntent.transfer_data?.destination) {
    try {
      const transfers = await stripeClient.transfers.list({
        destination: paymentIntent.transfer_data.destination as string,
        limit: 5,
      });
      // Find transfer for this payment
      const matchingTransfer = transfers.data.find(
        t => t.source_transaction === paymentIntent.latest_charge
      );
      if (matchingTransfer) {
        stripeTransferId = matchingTransfer.id;
      }
    } catch (err) {
      console.error('Error fetching transfer:', err);
    }
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      bookingId: invoice.bookingId,
      invoiceId: invoice.id,
      amount: totalAmount,
      paymentMethod: 'card',
      stripePaymentId: paymentIntent.id,
      stripePaymentIntent: paymentIntent.id,
      platformFee,
      contractorPayout,
      stripeTransferId,
      status: 'SUCCEEDED',
      paidAt: new Date(),
    }
  });

  // Update invoice status
  await prisma.invoice.update({
    where: { id: parseInt(invoiceId) },
    data: {
      status: 'PAID',
      paidAt: new Date(),
    }
  });

  // Update booking payment status
  await prisma.booking.update({
    where: { id: invoice.bookingId },
    data: {
      paymentReceived: true
    }
  });

  console.log(`Successfully processed payment for invoice ${invoiceId}`);
}

// Helper function to handle failed payment
async function handlePaymentIntentFailed(
  prisma: any,
  paymentIntent: Stripe.PaymentIntent
) {
  const invoiceId = paymentIntent.metadata?.invoiceId;

  if (!invoiceId) {
    return;
  }

  console.log(`Payment failed for invoice ${invoiceId}: ${paymentIntent.last_payment_error?.message}`);

  // Optionally create a failed payment record for tracking
  const existingPayment = await prisma.payment.findFirst({
    where: { stripePaymentIntent: paymentIntent.id }
  });

  if (!existingPayment) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceId) }
    });

    if (invoice) {
      await prisma.payment.create({
        data: {
          bookingId: invoice.bookingId,
          invoiceId: invoice.id,
          amount: paymentIntent.amount / 100,
          paymentMethod: 'card',
          stripePaymentId: paymentIntent.id,
          stripePaymentIntent: paymentIntent.id,
          status: 'FAILED',
        }
      });
    }
  }
}

// Helper function to handle Connect account updates
async function handleAccountUpdated(
  prisma: any,
  account: Stripe.Account
) {
  const contractorId = account.metadata?.contractorId;

  // Find contractor by Stripe account ID
  const contractor = await prisma.contractor.findFirst({
    where: {
      OR: [
        { stripeAccountId: account.id },
        ...(contractorId ? [{ id: parseInt(contractorId) }] : [])
      ]
    }
  });

  if (!contractor) {
    console.log(`No contractor found for Stripe account ${account.id}`);
    return;
  }

  // Update contractor's Stripe status
  const updates: any = {};

  if (account.details_submitted !== undefined) {
    updates.stripeOnboardingComplete = account.details_submitted;
  }
  if (account.charges_enabled !== undefined) {
    updates.stripeChargesEnabled = account.charges_enabled;
  }
  if (account.payouts_enabled !== undefined) {
    updates.stripePayoutsEnabled = account.payouts_enabled;
  }

  if (Object.keys(updates).length > 0) {
    await prisma.contractor.update({
      where: { id: contractor.id },
      data: updates
    });

    console.log(`Updated Stripe status for contractor ${contractor.id}:`, updates);
  }
}

// Helper function to handle subscription updates
async function handleSubscriptionUpdated(
  prisma: any,
  subscription: Stripe.Subscription
) {
  const contractorId = subscription.metadata?.contractorId;
  const customerId = subscription.customer as string;

  // Find subscription record by customer ID or contractor ID
  let dbSubscription = await prisma.subscription.findFirst({
    where: {
      OR: [
        { stripeCustomerId: customerId },
        { stripeSubscriptionId: subscription.id },
        ...(contractorId ? [{ contractorId: parseInt(contractorId) }] : [])
      ]
    }
  });

  if (!dbSubscription && contractorId) {
    // Create subscription record if it doesn't exist
    dbSubscription = await prisma.subscription.create({
      data: {
        contractorId: parseInt(contractorId),
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        tier: 'FREE',
        status: 'ACTIVE',
      }
    });
  }

  if (!dbSubscription) {
    console.log(`No subscription record found for Stripe subscription ${subscription.id}`);
    return;
  }

  // Map Stripe status to our status
  let status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING' | 'INCOMPLETE' = 'ACTIVE';
  switch (subscription.status) {
    case 'active':
      status = 'ACTIVE';
      break;
    case 'past_due':
      status = 'PAST_DUE';
      break;
    case 'canceled':
      status = 'CANCELED';
      break;
    case 'trialing':
      status = 'TRIALING';
      break;
    case 'incomplete':
    case 'incomplete_expired':
      status = 'INCOMPLETE';
      break;
    default:
      status = 'ACTIVE';
  }

  // Update subscription record
  const subAny = subscription as any;
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      tier: subscription.status === 'active' || subscription.status === 'trialing' ? 'PREMIUM' : dbSubscription.tier,
      status,
      currentPeriodStart: subAny.current_period_start ? new Date(subAny.current_period_start * 1000) : null,
      currentPeriodEnd: subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : null,
      cancelAtPeriodEnd: subAny.cancel_at_period_end || false,
      canceledAt: subAny.canceled_at ? new Date(subAny.canceled_at * 1000) : null,
    }
  });

  console.log(`Updated subscription for contractor ${dbSubscription.contractorId}: tier=${status === 'ACTIVE' ? 'PREMIUM' : dbSubscription.tier}, status=${status}`);
}

// Helper function to handle subscription deletion
async function handleSubscriptionDeleted(
  prisma: any,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  // Find subscription record
  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      OR: [
        { stripeCustomerId: customerId },
        { stripeSubscriptionId: subscription.id }
      ]
    }
  });

  if (!dbSubscription) {
    console.log(`No subscription record found for deleted subscription ${subscription.id}`);
    return;
  }

  // Downgrade to free tier
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      tier: 'FREE',
      status: 'CANCELED',
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      canceledAt: new Date(),
    }
  });

  console.log(`Subscription deleted for contractor ${dbSubscription.contractorId}, downgraded to FREE tier`);
}

// Helper function to handle checkout completion
async function handleCheckoutCompleted(
  prisma: any,
  session: Stripe.Checkout.Session
) {
  console.log('=== HANDLING CHECKOUT COMPLETED ===');
  console.log('Session ID:', session.id);
  console.log('Session metadata:', JSON.stringify(session.metadata));

  const contractorId = session.metadata?.contractorId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  console.log('Extracted values:', { contractorId, customerId, subscriptionId });

  if (!contractorId) {
    console.log('Checkout session has no contractorId in metadata');
    return;
  }

  try {
    // Update or create subscription record
    const result = await prisma.subscription.upsert({
      where: { contractorId: parseInt(contractorId) },
      create: {
        contractorId: parseInt(contractorId),
        tier: 'PREMIUM',
        status: 'ACTIVE',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
      },
      update: {
        tier: 'PREMIUM',
        status: 'ACTIVE',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
      }
    });

    console.log(`Checkout completed for contractor ${contractorId}, upgraded to PREMIUM`);
    console.log('Upsert result:', JSON.stringify(result));
  } catch (error) {
    console.error('Error in handleCheckoutCompleted:', error);
    throw error;
  }
}

// Helper function to handle subscription payment failure
async function handleSubscriptionPaymentFailed(
  prisma: any,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;

  // Find subscription record
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId }
  });

  if (!dbSubscription) {
    console.log(`No subscription record found for customer ${customerId}`);
    return;
  }

  // Update status to past_due
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'PAST_DUE',
    }
  });

  console.log(`Payment failed for contractor ${dbSubscription.contractorId}, status set to PAST_DUE`);
}

// POST /api/stripe/subscription/sync/:contractorId - Manually sync subscription from Stripe
stripe.post('/stripe/subscription/sync/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

    if (!c.env.STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: 'Stripe is not configured'
      }, 500);
    }

    const stripeClient = getStripe(c.env.STRIPE_SECRET_KEY);

    // Get contractor's subscription record
    const subscription = await prisma.subscription.findUnique({
      where: { contractorId: parseInt(contractorId) },
    });

    if (!subscription?.stripeCustomerId) {
      return c.json({
        success: false,
        error: 'No Stripe customer found for this contractor'
      }, 400);
    }

    // Fetch subscriptions from Stripe for this customer
    const stripeSubscriptions = await stripeClient.subscriptions.list({
      customer: subscription.stripeCustomerId,
      status: 'all',
      limit: 1,
    });

    if (stripeSubscriptions.data.length === 0) {
      return c.json({
        success: false,
        error: 'No subscriptions found in Stripe for this customer',
        customerId: subscription.stripeCustomerId,
      }, 404);
    }

    const stripeSub = stripeSubscriptions.data[0];

    // Map Stripe status to our status
    let status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING' | 'INCOMPLETE' = 'ACTIVE';
    switch (stripeSub.status) {
      case 'active':
        status = 'ACTIVE';
        break;
      case 'past_due':
        status = 'PAST_DUE';
        break;
      case 'canceled':
        status = 'CANCELED';
        break;
      case 'trialing':
        status = 'TRIALING';
        break;
      case 'incomplete':
      case 'incomplete_expired':
        status = 'INCOMPLETE';
        break;
      default:
        status = 'ACTIVE';
    }

    // Update subscription record
    const tier = (stripeSub.status === 'active' || stripeSub.status === 'trialing') ? 'PREMIUM' : 'FREE';
    const subAny = stripeSub as any;

    const updatedSubscription = await prisma.subscription.update({
      where: { contractorId: parseInt(contractorId) },
      data: {
        stripeSubscriptionId: stripeSub.id,
        stripePriceId: stripeSub.items.data[0]?.price.id,
        tier,
        status,
        currentPeriodStart: subAny.current_period_start ? new Date(subAny.current_period_start * 1000) : null,
        currentPeriodEnd: subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : null,
        cancelAtPeriodEnd: subAny.cancel_at_period_end || false,
        canceledAt: subAny.canceled_at ? new Date(subAny.canceled_at * 1000) : null,
      }
    });

    return c.json({
      success: true,
      message: `Subscription synced successfully. Tier: ${tier}, Status: ${status}`,
      subscription: updatedSubscription,
      stripeSubscription: {
        id: stripeSub.id,
        status: stripeSub.status,
        currentPeriodEnd: subAny.current_period_end,
      }
    });
  } catch (error) {
    console.error('Sync subscription error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync subscription'
    }, 500);
  }
});

export default stripe;
