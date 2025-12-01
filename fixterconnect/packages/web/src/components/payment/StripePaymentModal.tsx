import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { X, CreditCard, Lock, AlertTriangle } from 'react-feather';
import { API_BASE_URL } from '../../config/api';

// Stripe publishable key
const stripePromise = loadStripe('pk_test_51SZHxyIhKqHeFpJABY3rLS8sobWVvChg8cYDuEdXu811zlE8m2REEoo20Nj4NM0UHsUCIv9S1PYojLOUELI7G0Pe00WKskwycL');

interface PaymentFormProps {
  invoice: {
    id: number;
    invoiceNumber: string;
    service: string;
    provider: string;
    amount: number;
    totalAmount?: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ invoice, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [platformFee, setPlatformFee] = useState<number>(0);
  const [cannotPay, setCannotPay] = useState<string | null>(null);

  const displayAmount = invoice.totalAmount || invoice.amount;

  // Create PaymentIntent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        setCannotPay(null);

        const response = await fetch(`${API_BASE_URL}/stripe/payment/create-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId: invoice.id })
        });

        const data = await response.json();

        if (data.success) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setPlatformFee(data.platformFee || 0);
        } else {
          // Check if this is a "cannot pay" situation (contractor not set up)
          if (data.error?.includes('not connected') || data.error?.includes('not fully verified')) {
            setCannotPay(data.error);
          } else {
            setErrorMessage(data.error || 'Failed to initialize payment');
          }
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setErrorMessage('Failed to connect to payment service');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [invoice.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
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
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Call our backend to confirm and record the payment
        const confirmResponse = await fetch(`${API_BASE_URL}/stripe/payment/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            invoiceId: invoice.id
          })
        });

        const confirmData = await confirmResponse.json();

        if (confirmData.success) {
          onSuccess();
          onClose();
        } else {
          // Payment went through but backend confirmation failed
          setErrorMessage('Payment processed but confirmation failed. Please contact support.');
        }
      } else {
        setErrorMessage(`Payment status: ${paymentIntent?.status}. Please try again.`);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred');
    } finally {
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

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#64748b', fontSize: '15px' }}>Preparing payment...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show cannot pay message
  if (cannotPay) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fef3c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <AlertTriangle size={32} color="#f59e0b" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
          Payment Not Available
        </h3>
        <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
          {cannotPay}
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    );
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>Amount</span>
          <span style={{ fontSize: '14px', color: '#1e293b' }}>${displayAmount.toFixed(2)}</span>
        </div>
        {platformFee > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Platform fee (included)</span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>${platformFee.toFixed(2)}</span>
          </div>
        )}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>Total</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
              ${displayAmount.toFixed(2)}
            </span>
          </div>
        </div>
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
          disabled={!stripe || isProcessing || !clientSecret}
          style={{
            padding: '14px 32px',
            backgroundColor: isProcessing ? '#94a3b8' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: (!stripe || isProcessing || !clientSecret) ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
          }}
        >
          {isProcessing ? 'PROCESSING...' : `PAY $${displayAmount.toFixed(2)}`}
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
          Test Mode - Use test card:
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
    totalAmount?: number;
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
