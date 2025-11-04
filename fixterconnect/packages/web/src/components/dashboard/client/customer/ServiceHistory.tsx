import React from 'react';
import { ServiceItem } from '../CustomerDashboard';
import styles from './Services.module.css';

interface ServiceHistoryProps {
  services: ServiceItem[];
}

const ServiceHistory: React.FC<ServiceHistoryProps> = ({ services }) => {
  if (services.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>You have no service history yet.</p>
        <button className={styles.actionButton}>Book Your First Service</button>
      </div>
    );
  }

  return (
    <div className={styles.servicesList}>
      {services.map((service) => (
        <div key={service.id} className={styles.serviceCard}>
          <div className={styles.serviceHeader}>
            <div>
              <h3 className={styles.serviceTitle}>{service.service}</h3>
              <p className={styles.serviceProvider}>
                <strong>🧑‍🔧 Provider:</strong> {service.contractor}
              </p>
              <p className={styles.serviceDetail}>
                <strong>📅 Date:</strong> {service.date}
              </p>
              <p className={styles.serviceDetail}>
                <strong>💰 Price:</strong> {service.price}
              </p>
            </div>
            <div className={`${styles.statusBadge} ${styles.completed}`}>
              COMPLETED
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
              className={styles.downloadButton}
              onClick={() => alert(`Download invoice ${service.invoice}`)}
            >
              Download Invoice
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceHistory;