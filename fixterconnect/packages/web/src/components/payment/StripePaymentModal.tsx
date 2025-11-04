import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { X, CreditCard, Lock } from 'react-feather';

// TODO: Replace with your actual Stripe publishable key (test mode)
// Get this from: https://dashboard.stripe.com/test/apikeys
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

interface PaymentFormProps {
  invoice: {
    id: number;
    invoiceNumber: string;
    service: string;
    provider: string;
    amount: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ invoice, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // TODO: Call your backend to create a PaymentIntent
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     invoiceId: invoice.id,
      //     amount: invoice.amount * 100 // Stripe uses cents
      //   })
      // });
      // const { clientSecret } = await response.json();

      // For now, we'll simulate the payment
      // In production, you would use the clientSecret from your backend
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // TODO: Send paymentMethod.id to your backend to complete the payment
      // const confirmResponse = await fetch('/api/confirm-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     paymentMethodId: paymentMethod.id,
      //     invoiceId: invoice.id
      //   })
      // });

      // Simulate successful payment for now
      console.log('Payment Method Created:', paymentMethod);

      // Show success and close modal
      alert(`Payment of $${invoice.amount} processed successfully!\n\nThis is test mode. In production, the payment would be processed through Stripe.`);
      setIsProcessing(false);
      onSuccess();
      onClose();

    } catch (err) {
      setErrorMessage('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1e293b',
        '::placeholder': {
          color: '#94a3b8',
        },
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Payment Details
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: 0
        }}>
          Invoice #{invoice.invoiceNumber} - {invoice.service}
        </p>
      </div>

      {/* Amount Display */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: 0,
          marginBottom: '4px'
        }}>
          Amount to Pay
        </p>
        <p style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1e293b',
          margin: 0
        }}>
          ${invoice.amount}
        </p>
      </div>

      {/* Card Element */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          <CreditCard size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Card Information
        </label>
        <div style={{
          padding: '14px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #fca5a5'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#991b1b',
            margin: 0
          }}>
            {errorMessage}
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#f0fdf4',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #bbf7d0'
      }}>
        <Lock size={16} color="#16a34a" />
        <p style={{
          fontSize: '13px',
          color: '#166534',
          margin: 0
        }}>
          Payments are securely processed by Stripe. Your card information is never stored on our servers.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          style={{
            padding: '14px 24px',
            backgroundColor: 'white',
            color: '#1e293b',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.5 : 1
          }}
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          style={{
            padding: '14px 32px',
            backgroundColor: isProcessing ? '#94a3b8' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: (!stripe || isProcessing) ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
          }}
        >
          {isProcessing ? 'PROCESSING...' : `PAY $${invoice.amount}`}
        </button>
      </div>

      {/* Test Card Info */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        border: '1px solid #fbbf24'
      }}>
        <p style={{
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#92400e',
          margin: 0,
          marginBottom: '8px'
        }}>
          🧪 TEST MODE - Use test card:
        </p>
        <p style={{
          fontSize: '13px',
          color: '#92400e',
          margin: 0,
          fontFamily: 'monospace'
        }}>
          Card: 4242 4242 4242 4242<br />
          Exp: Any future date (e.g., 12/25)<br />
          CVC: Any 3 digits (e.g., 123)<br />
          ZIP: Any 5 digits (e.g., 12345)
        </p>
      </div>
    </form>
  );
};

interface StripePaymentModalProps {
  invoice: {
    id: number;
    invoiceNumber: string;
    service: string;
    provider: string;
    amount: number;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ invoice, onClose, onSuccess }) => {
  if (!invoice) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: 0
          }}>
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={24} color="#64748b" />
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm
            invoice={invoice}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};

export default StripePaymentModal;
