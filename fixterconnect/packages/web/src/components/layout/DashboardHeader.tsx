import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BREAKPOINTS } from '../../constants/breakpoints';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.tablet}px)`);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      padding: isMobile ? '12px 16px' : '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: isMobile ? '12px' : '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', flexShrink: 0 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            FixterConnect
          </Link>
        </div>

        <nav style={{ overflow: 'hidden' }}>
          <ul style={{
            display: 'flex',
            gap: isMobile ? '8px' : '20px',
            listStyle: 'none',
            alignItems: 'center',
            margin: 0,
            padding: 0
          }}>
            {!isMobile && (
              <li>
                <Link to="/" style={{ textDecoration: 'none', color: '#334155', fontSize: '15px' }}>Home</Link>
              </li>
            )}
            <li style={{
              fontWeight: 'bold',
              color: '#2563eb',
              fontSize: isMobile ? '13px' : '15px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: isMobile ? '120px' : 'none'
            }}>
              {(() => {
                if (!user) return 'Dashboard';
                if ('name' in user && user.name) {
                  return `${user.name.split(' ')[0]}'s Dashboard`;
                }
                if ((user as any).firstName) {
                  return `${(user as any).firstName}'s Dashboard`;
                }
                return 'Dashboard';
              })()}
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: '#dc2626',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '13px' : '14px',
                  minHeight: '44px',
                  minWidth: isMobile ? '70px' : 'auto'
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
