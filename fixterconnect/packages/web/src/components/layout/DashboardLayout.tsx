import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import Footer from './Footer';

const DashboardLayout: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <DashboardHeader />
      <main style={{
        flex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '20px'
      }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
