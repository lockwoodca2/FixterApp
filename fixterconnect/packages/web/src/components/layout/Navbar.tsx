import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  return (
    <nav style={{
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#334155' }}>
        Home
      </Link>
      <Link to="/services" style={{ textDecoration: 'none', color: '#334155' }}>
        Services
      </Link>
      {isAuthenticated && (
        <Link
          to={userType === 'contractor' ? '/contractor-dashboard' : '/client-dashboard'}
          style={{ textDecoration: 'none', color: '#334155' }}
        >
          Dashboard
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
