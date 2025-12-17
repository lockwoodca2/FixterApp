import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to home
  const from = location.state?.from?.pathname || '/';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);

      if (user) {
        if (from !== '/') {
          navigate(from);
        } else {
          navigate(user.type === 'contractor' ? '/contractor-dashboard' : '/client-dashboard');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    alert('Google login coming soon! For now, use email/password.');
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    alert('Facebook login coming soon! For now, use email/password.');
  };

  const handleSendCode = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    // TODO: Implement Firebase phone auth
    setTimeout(() => {
      setCodeSent(true);
      setIsLoading(false);
      alert('Phone authentication coming soon! For now, use email/password.');
    }, 1000);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Verify code with Firebase
    alert('Phone verification coming soon!');
  };

  const resetToMethodSelection = () => {
    setLoginMethod(null);
    setEmail('');
    setPhone('');
    setPassword('');
    setVerificationCode('');
    setCodeSent(false);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: 0
          }}>
            <span style={{ color: '#ff9900' }}>Fixter</span>Connect
          </h1>
        </div>

        {/* Main Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0 0 8px 0'
          }}>
            Login or Sign Up
          </h2>
          <p style={{
            color: '#64748b',
            textAlign: 'center',
            margin: '0 0 28px 0',
            fontSize: '15px'
          }}>
            Continue with your preferred method
          </p>

          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          {!loginMethod ? (
            <>
              {/* Social Login Buttons */}
              <button
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleFacebookLogin}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>

              <button
                onClick={() => setLoginMethod('phone')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Continue with Phone
              </button>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '28px 0',
                gap: '16px'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Or continue with</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#1e293b',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <button
                onClick={() => email && setLoginMethod('email')}
                disabled={!email}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: email ? '#1e293b' : '#e2e8f0',
                  color: email ? 'white' : '#94a3b8',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: email ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                Continue with Email
              </button>
            </>
          ) : loginMethod === 'email' ? (
            <>
              {/* Email Login Form */}
              <button
                onClick={resetToMethodSelection}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>

              <form onSubmit={handleEmailLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#1e293b',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#1e293b',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    backgroundColor: '#ff9900',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Phone Login Form */}
              <button
                onClick={resetToMethodSelection}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>

              <form onSubmit={handlePhoneLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    disabled={codeSent}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#1e293b',
                      backgroundColor: codeSent ? '#f1f5f9' : '#f8fafc'
                    }}
                  />
                </div>

                {!codeSent ? (
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isLoading || !phone}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      backgroundColor: phone ? '#ff9900' : '#e2e8f0',
                      color: phone ? 'white' : '#94a3b8',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: phone ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isLoading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                ) : (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '20px',
                          color: '#1e293b',
                          backgroundColor: '#f8fafc',
                          letterSpacing: '8px',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={verificationCode.length !== 6}
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        backgroundColor: verificationCode.length === 6 ? '#ff9900' : '#e2e8f0',
                        color: verificationCode.length === 6 ? 'white' : '#94a3b8',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: verificationCode.length === 6 ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Verify & Login
                    </button>
                  </>
                )}
              </form>
            </>
          )}
        </div>

        {/* Terms & Privacy */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '13px',
          color: '#64748b',
          lineHeight: '1.6'
        }}>
          By clicking continue, you agree to our<br />
          <Link to="/terms" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Privacy Policy</Link>
        </p>

        {/* Sign Up Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>

        {/* Demo credentials - can be removed in production */}
        <div style={{
          marginTop: '24px',
          padding: '12px',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            Demo: Client (testuser/password123) or Contractor (johnsmith/contractor123)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
