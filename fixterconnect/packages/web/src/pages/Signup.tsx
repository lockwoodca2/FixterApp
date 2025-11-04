import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ApiClient } from '@fixterconnect/core';
import { API_BASE_URL } from '../config/api';

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'client' | 'contractor'>('client');
  const [yearsExperience, setYearsExperience] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const availableServiceAreas = ['Nampa', 'Boise', 'Meridian', 'Caldwell', 'Eagle', 'Kuna'];

  const toggleServiceArea = (area: string) => {
    setServiceAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const navigate = useNavigate();
  const apiClient = new ApiClient(API_BASE_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (userType === 'contractor' && yearsExperience && Number(yearsExperience) < 0) {
      setError('Years of experience cannot be negative');
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        username,
        password,
        accountType: userType,
        ...(userType === 'contractor' && {
          ...(yearsExperience && { yearsExperience: Number(yearsExperience) }),
          ...(businessName && { businessName }),
          ...(serviceAreas.length > 0 && { serviceAreas })
        })
      };

      const response = await apiClient.createAccount(userData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Account created successfully! Please log in.' }
          });
        }, 2000);
      } else {
        setError(response.error || 'Failed to create account');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
          Create Account
        </h1>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '16px', color: '#64748b' }}>
              Account Type
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setUserType('client')}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: userType === 'client' ? '#3b82f6' : '#f8fafc',
                  color: userType === 'client' ? 'white' : '#64748b',
                  border: userType === 'client' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setUserType('contractor')}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: userType === 'contractor' ? '#3b82f6' : '#f8fafc',
                  color: userType === 'contractor' ? 'white' : '#64748b',
                  border: userType === 'contractor' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Contractor
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              First Name *
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Last Name *
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Phone {userType === 'client' && '*'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={userType === 'client'}
              placeholder="(555) 123-4567"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          {userType === 'contractor' && (
            <>
              <div style={{
                borderTop: '1px solid #e2e8f0',
                marginTop: '32px',
                marginBottom: '24px',
                paddingTop: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '24px'
                }}>
                  Contractor Information
                </h2>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#64748b' }}>
                    Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name"
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      color: '#1e293b'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#64748b' }}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    min="0"
                    placeholder="Years in business"
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      color: '#1e293b'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '14px', color: '#64748b' }}>
                    Service Areas
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {availableServiceAreas.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleServiceArea(area)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: serviceAreas.includes(area) ? '#3b82f6' : '#f1f5f9',
                          color: serviceAreas.includes(area) ? 'white' : '#64748b',
                          border: serviceAreas.includes(area) ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                          borderRadius: '24px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Confirm Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Re-enter your password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px', marginTop: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '2px solid #e2e8f0'
            }}>
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
                style={{
                  width: '20px',
                  height: '20px',
                  marginTop: '2px',
                  cursor: 'pointer',
                  accentColor: '#3b82f6'
                }}
              />
              <span style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
                I agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: '500' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </a>
                {' '}and{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: '500' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || success || !agreeToTerms}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: success ? '#10b981' : '#ff9900',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: (isLoading || success || !agreeToTerms) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || success || !agreeToTerms) ? 0.6 : 1
            }}
          >
            {isLoading ? 'Creating Account...' : success ? 'Account Created!' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
