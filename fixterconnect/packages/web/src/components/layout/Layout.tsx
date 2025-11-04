import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;