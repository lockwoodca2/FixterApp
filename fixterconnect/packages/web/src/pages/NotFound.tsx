import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '96px', fontWeight: 'bold', color: '#334155', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '32px', color: '#64748b', marginTop: '16px' }}>Page Not Found</h2>
      <p style={{ fontSize: '18px', color: '#94a3b8', marginTop: '16px', marginBottom: '32px' }}>
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          backgroundColor: '#ff9900',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
