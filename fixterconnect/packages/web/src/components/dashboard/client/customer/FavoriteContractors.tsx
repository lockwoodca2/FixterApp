import React from 'react';
import { FavoriteContractor } from '../CustomerDashboard';
import styles from './FavoriteContractors.module.css';

interface FavoriteContractorsProps {
  contractors: FavoriteContractor[];
}

const FavoriteContractors: React.FC<FavoriteContractorsProps> = ({ contractors }) => {
  if (contractors.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>You haven't added any favorite contractors yet.</p>
        <button className={styles.actionButton}>Browse Contractors</button>
      </div>
    );
  }

  return (
    <div className={styles.contractorsGrid}>
      {contractors.map((contractor) => (
        <div key={contractor.id} className={styles.contractorCard}>
          <div className={styles.contractorHeader}>
            <div className={styles.contractorAvatar}>
              {contractor.photo}
            </div>
            <div className={styles.contractorInfo}>
              <h3 className={styles.contractorName}>{contractor.name}</h3>
              <div className={styles.contractorRating}>
                <span className={styles.star}>★</span>
                <span>{contractor.rating}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.contractorServices}>
            <strong>Services:</strong>
            <div className={styles.serviceTags}>
              {contractor.services.map((service, index) => (
                <span key={index} className={styles.serviceTag}>{service}</span>
              ))}
            </div>
          </div>
          
          <div className={styles.contractorActions}>
            <button 
              className={styles.requestButton}
              onClick={() => alert(`Request service from ${contractor.name}`)}
            >
              Request Service
            </button>
            <button 
              className={styles.messageButton}
              onClick={() => alert(`Message ${contractor.name}`)}
            >
              💬 Message
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoriteContractors;