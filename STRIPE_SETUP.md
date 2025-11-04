# Stripe Integration Setup Guide

This guide will help you set up Stripe for payment processing in FixterConnect.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Node.js backend server for handling payment intents

## Step 1: Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

⚠️ **IMPORTANT**: Never commit your Secret key to version control!

## Step 2: Update Frontend with Publishable Key

1. Open `/packages/web/src/components/payment/StripePaymentModal.tsx`
2. Find line 10:
   ```typescript
   const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');
   ```
3. Replace `pk_test_YOUR_PUBLISHABLE_KEY_HERE` with your actual publishable key

## Step 3: Set Up Backend Payment Intent Endpoint

Your backend needs to create Payment Intents for secure payment processing.

### Example Backend Endpoint (Node.js/Express):

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  const { invoiceId, amount } = req.body;

  try {
    // Optional: Fetch invoice from database to verify amount
    const invoice = await db.getInvoice(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (e.g., $10.00 = 1000)
      currency: 'usd',
      metadata: {
        invoiceId: invoiceId.toString(),
        customerId: req.user.id, // From your auth system
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Example Payment Confirmation Endpoint:

```javascript
app.post('/api/confirm-payment', async (req, res) => {
  const { paymentMethodId, invoiceId } = req.body;

  try {
    const invoice = await db.getInvoice(invoiceId);

    // Confirm the payment with the payment method
    const paymentIntent = await stripe.paymentIntents.confirm({
      payment_method: paymentMethodId,
    });

    if (paymentIntent.status === 'succeeded') {
      // Update invoice status in database
      await db.updateInvoice(invoiceId, { status: 'paid' });

      res.json({ success: true });
    } else {
      res.json({ success: false, status: paymentIntent.status });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Step 4: Set Up Webhooks (Recommended)

Webhooks ensure you're notified when payments succeed or fail, even if the user closes their browser.

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

### Example Webhook Handler:

```javascript
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const invoiceId = paymentIntent.metadata.invoiceId;

      // Update database
      await db.updateInvoice(invoiceId, {
        status: 'paid',
        paidDate: new Date(),
        stripePaymentId: paymentIntent.id
      });

      // Send receipt email
      await sendReceiptEmail(invoiceId);
      break;

    case 'payment_intent.payment_failed':
      // Handle failed payment
      console.log('Payment failed:', event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});
```

## Step 5: Environment Variables

Create a `.env` file in your backend:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

⚠️ **Add `.env` to your `.gitignore` file!**

## Testing

### Test Card Numbers

Stripe provides test cards that simulate different scenarios:

| Card Number         | Description                |
|---------------------|----------------------------|
| 4242 4242 4242 4242 | Success                    |
| 4000 0000 0000 9995 | Declined (insufficient funds) |
| 4000 0000 0000 9987 | Declined (lost card)       |
| 4000 0000 0000 0069 | Expired card               |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |

**Other fields:**
- Expiration: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### Test the Flow

1. Navigate to the Invoices & Payments section in the client dashboard
2. Click **PAY NOW** on an unpaid invoice
3. Enter test card: `4242 4242 4242 4242`
4. Enter any future expiration date
5. Enter any 3-digit CVC
6. Click **PAY $XXX**
7. Verify success message appears

## Going Live

### Before launching to production:

1. **Switch to Live Keys**:
   - Go to https://dashboard.stripe.com/apikeys (note: no "test" in URL)
   - Copy your live publishable key and secret key
   - Update environment variables
   - Update `StripePaymentModal.tsx` with live publishable key

2. **Activate Your Account**:
   - Complete business verification in Stripe dashboard
   - Add bank account for payouts
   - Review pricing and fees

3. **Remove Test Mode Warnings**:
   - Remove the yellow "TEST MODE" box from `StripePaymentModal.tsx` (lines 260-277)

4. **Security Checklist**:
   - ✅ Secret key stored in environment variable (never in code)
   - ✅ Webhook endpoint validates Stripe signature
   - ✅ Invoice amounts verified server-side before creating PaymentIntent
   - ✅ HTTPS enabled on your domain
   - ✅ User authentication verified before processing payments

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Accept a Payment Guide](https://stripe.com/docs/payments/accept-a-payment)
- [Testing Stripe](https://stripe.com/docs/testing)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)

## Support

For Stripe-specific issues, contact Stripe Support:
- Email: support@stripe.com
- Chat: Available in Stripe Dashboard

For FixterConnect integration issues, check the TODO comments in:
- `/packages/web/src/components/payment/StripePaymentModal.tsx`
- `/packages/web/src/components/dashboard/ClientDashboard.tsx`
