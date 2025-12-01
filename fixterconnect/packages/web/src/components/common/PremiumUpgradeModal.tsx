import React from 'react';
import { X, Award, Check, Zap, Calendar, Users, FileText, Bell, TrendingUp } from 'react-feather';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureTriggered?: string;
  isLoading?: boolean;
}

const premiumFeatures = [
  { icon: Zap, title: 'Unlimited Jobs', description: 'No limit on active bookings' },
  { icon: TrendingUp, title: 'Reduced Fees', description: 'Only 3% platform fee (vs 5%)' },
  { icon: Award, title: 'Priority Listing', description: 'Appear higher in search results' },
  { icon: Calendar, title: 'Advanced Scheduling', description: 'Drag-to-reorder, bulk scheduling' },
  { icon: Bell, title: 'Automated Reminders', description: 'SMS/email reminders to clients' },
  { icon: Users, title: 'Team Management', description: 'Add employees under your account' },
  { icon: FileText, title: 'Accounting Export', description: 'QuickBooks integration & reports' },
];

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  featureTriggered,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            padding: '32px 24px',
            borderRadius: '16px 16px 0 0',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color="white" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <Award size={32} color="white" />
            </div>
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                Upgrade to Premium
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>
                Unlock your full potential
              </p>
            </div>
          </div>

          {featureTriggered && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '16px',
              }}
            >
              <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
                <strong>{featureTriggered}</strong> is a Premium feature
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Price */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '24px',
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
              <span style={{ fontSize: '16px', color: '#64748b' }}>$</span>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#1e293b' }}>39</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>.99</span>
              <span style={{ fontSize: '16px', color: '#64748b' }}>/month</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '8px 0 0 0' }}>
              Cancel anytime
            </p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
              Everything in Premium:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {premiumFeatures.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#ecfdf5',
                      borderRadius: '8px',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <feature.icon size={18} color="#10b981" />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px', margin: 0 }}>
                      {feature.title}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0 0' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={onUpgrade}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  <Award size={20} />
                  Upgrade to Premium
                </>
              )}
            </button>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px 24px',
                backgroundColor: 'white',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Maybe Later
            </button>
          </div>

          {/* Guarantee */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Check size={18} color="#d97706" />
            <p style={{ color: '#92400e', fontSize: '13px', margin: 0 }}>
              <strong>30-day money-back guarantee</strong> - No questions asked
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgradeModal;
