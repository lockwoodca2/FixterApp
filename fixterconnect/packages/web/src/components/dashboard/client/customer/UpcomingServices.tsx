import React from 'react';
import { ServiceItem } from '../CustomerDashboard';
import styles from './Services.module.css';

interface UpcomingServicesProps {
  services: ServiceItem[];
}

const UpcomingServices: React.FC<UpcomingServicesProps> = ({ services }) => {
  if (services.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>You have no upcoming services scheduled.</p>
        <button className={styles.actionButton}>Book a Service</button>
      </div>
    );
  }

  return (
    <div className={styles.servicesList}>
      {services.map((service) => {
        const statusClass = service.status === 'confirmed' ? styles.confirmed : styles.pending;
        
        return (
          <div key={service.id} className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <div>
                <h3 className={styles.serviceTitle}>{service.service}</h3>
                <p className={styles.serviceProvider}>
                  <strong>🧑‍🔧 Provider:</strong> {service.contractor}
                </p>
                <p className={styles.serviceDetail}>
                  <strong>📅 Date:</strong> {service.date} {service.time && `at ${service.time}`}
                </p>
                <p className={styles.serviceDetail}>
                  <strong>📍 Address:</strong> {service.address}
                </p>
              </div>
              <div className={`${styles.statusBadge} ${statusClass}`}>
                {service.status.toUpperCase()}
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <button 
                className={styles.detailButton}
                onClick={() => alert(`View details for service #${service.id}`)}
              >
                View Details
              </button>
              <button 
                className={styles.messageButton}
                onClick={() => alert(`Open chat with ${service.contractor}`)}
              >
                Message Provider
              </button>
              <button 
                className={styles.calendarButton}
                onClick={() => alert(`Add service #${service.id} to calendar`)}
              >
                📅 Add to Calendar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingServices;