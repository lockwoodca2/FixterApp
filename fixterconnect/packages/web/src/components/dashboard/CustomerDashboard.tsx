import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCustomerDashboard } from 'api/customer';
import DashboardMenu from './DashboardMenu';
import UpcomingServices from './customer/UpcomingServices';
import ServiceHistory from './customer/ServiceHistory';
import QuoteRequests from './customer/QuoteRequests';
import CustomerMessages from './customer/CustomerMessages';
import CustomerProfile from './customer/CustomerProfile';
import FavoriteContractors from './customer/FavoriteContractors';
import styles from './CustomerDashboard.module.css';

// Types for our dashboard data
export interface CustomerDashboardData {
  upcomingServices: ServiceItem[];
  serviceHistory: ServiceItem[];
  quoteRequests: QuoteRequest[];
  messages: MessageItem[];
  profile: CustomerProfile;
  favoriteContractors: FavoriteContractor[];
}

export interface ServiceItem {
  id: number;
  service: string;
  contractor: string;
  contractorId: number;
  date: string;
  time?: string;
  status: string;
  address: string;
  price: string;
  notes?: string;
  photos?: { id: number; type: string; url: string }[];
  invoice?: string;
}

export interface QuoteRequest {
  id: number;
  service: string;
  contractor: string;
  contractorId: number;
  requestDate: string;
  status: string;
  address: string;
  description: string;
  quoteAmount: string | null;
  quoteDetails: string | null;
}

export interface MessageItem {
  id: number;
  contractor: string;
  contractorId: number;
  subject: string;
  lastMessage: string;
  date: string;
  unread: boolean;
}
export interface FavoriteContractor {
  id: number;
  name: string;
  services: string[];
  rating: number;
  photo: string;
}

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('services');
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [dashboardData, setDashboardData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchCustomerDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  const menuItems = [
    { id: 'services', label: '📋 My Services & Requests' },
    { id: 'messages', label: '📧 Messages' },
    { id: 'profile', label: '👤 Profile & Preferences' },
    { id: 'favorites', label: '⭐ Favorite Contractors' }
  ];
  
  const handleMenuItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const renderServicesSection = () => (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>My Services & Requests</h2>
      
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'history' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'quotes' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          Quote Requests
        </button>
      </div>
      
      {activeTab === 'upcoming' && dashboardData && (
        <UpcomingServices services={dashboardData.upcomingServices} />
      )}
      
      {activeTab === 'history' && dashboardData && (
        <ServiceHistory services={dashboardData.serviceHistory} />
      )}
      
      {activeTab === 'quotes' && dashboardData && (
        <QuoteRequests quotes={dashboardData.quoteRequests} />
      )}
    </div>
  );

  const renderActiveSection = () => {
    if (loading) {
      return <div className={styles.loadingContainer}>Loading dashboard...</div>;
    }
    
    if (!dashboardData) {
      return <div className={styles.errorContainer}>Failed to load dashboard data.</div>;
    }
    
    switch (activeSection) {
      case 'services':
        return renderServicesSection();
      case 'messages':
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>My Messages</h2>
            <p className={styles.sectionSubtitle}>Communicate with your service providers</p>
            <CustomerMessages messages={dashboardData.messages} />
          </div>
        );
      case 'profile':
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Profile & Preferences</h2>
            <CustomerProfile profile={dashboardData.profile} />
          </div>
        );
      case 'favorites':
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>My Favorite Contractors</h2>
            <p className={styles.sectionSubtitle}>Quick access to your preferred service providers</p>
            <FavoriteContractors contractors={dashboardData.favoriteContractors} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Customer Dashboard</h1>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          → Back to Home
        </button>
      </div>
      
      <div className={styles.dashboardContent}>
        <DashboardMenu 
          items={menuItems}
          activeItemId={activeSection}
          onItemClick={handleMenuItemClick}
        />
        
        <div className={styles.mainContent}>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;