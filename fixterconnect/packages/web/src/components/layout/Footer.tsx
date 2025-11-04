import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      padding: '20px',
      backgroundColor: '#1e293b',
      color: 'white',
      marginTop: '40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <p>© {new Date().getFullYear()} FixterConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
