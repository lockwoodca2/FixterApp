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

const PLATFORM_FEE_PERCENT = 5; // 5% platform fee

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

    // Get invoice with booking and contractor details
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceId) },
      include: {
        booking: {
          include: {
            contractor: true,
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

      // Return existing PaymentIntent client secret
      return c.json({
        success: true,
        clientSecret: existingIntent.client_secret,
        paymentIntentId: existingIntent.id,
        amount: invoice.totalAmount,
        platformFee: Math.round(invoice.totalAmount * PLATFORM_FEE_PERCENT) / 100,
      });
    }

    // Calculate amounts in cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(invoice.totalAmount * 100);
    const platformFeeInCents = Math.round(amountInCents * PLATFORM_FEE_PERCENT / 100);

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

export default stripe;
