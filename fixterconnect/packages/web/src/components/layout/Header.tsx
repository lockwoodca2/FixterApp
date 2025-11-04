import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'react-feather';

const Header: React.FC = () => {
  const { isAuthenticated, user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            FixterConnect
          </Link>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#334155'
          }}
          className="mobile-menu-button"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link to="/" style={{ textDecoration: 'none', color: '#334155' }}>Home</Link></li>
            <li><Link to="/services" style={{ textDecoration: 'none', color: '#334155' }}>Services</Link></li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to={userType === 'contractor' ? '/contractor-dashboard' : '/client-dashboard'}
                    style={{ textDecoration: 'none', color: '#334155' }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#334155',
                      padding: 0,
                      font: 'inherit'
                    }}
                  >
                    Logout
                  </button>
                </li>
                <li style={{ fontWeight: 'bold', color: '#2563eb' }}>
                  {(() => {
                    if (!user) return 'Hello, User';
                    // Contractor has `name`, Customer has `firstName`/`lastName`
                    if ('name' in user && user.name) {
                      return `Hello, ${user.name.split(' ')[0]}`;
                    }
                    // fallback to firstName for customers
                    // @ts-ignore - Customer type may not have name
                    if ((user as any).firstName) {
                      // @ts-ignore
                      return `Hello, ${(user as any).firstName}`;
                    }
                    return 'Hello, User';
                  })()}
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'none',
                    backgroundColor: '#ff9900',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}
                >
                  Login / Sign Up
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav
          className="mobile-nav"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <li>
              <Link
                to="/"
                style={{ textDecoration: 'none', color: '#334155', display: 'block', padding: '8px 0' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                style={{ textDecoration: 'none', color: '#334155', display: 'block', padding: '8px 0' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to={userType === 'contractor' ? '/contractor-dashboard' : '/client-dashboard'}
                    style={{ textDecoration: 'none', color: '#334155', display: 'block', padding: '8px 0' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li style={{ padding: '8px 0', fontWeight: 'bold', color: '#2563eb' }}>
                  {(() => {
                    if (!user) return 'Hello, User';
                    // Contractor has `name`, Customer has `firstName`/`lastName`
                    if ('name' in user && user.name) {
                      return `Hello, ${user.name.split(' ')[0]}`;
                    }
                    // fallback to firstName for customers
                    // @ts-ignore - Customer type may not have name
                    if ((user as any).firstName) {
                      // @ts-ignore
                      return `Hello, ${(user as any).firstName}`;
                    }
                    return 'Hello, User';
                  })()}
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#334155',
                      padding: '8px 0',
                      font: 'inherit',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'none',
                    backgroundColor: '#ff9900',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    display: 'block',
                    textAlign: 'center'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}

      {/* CSS for responsive behavior */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;