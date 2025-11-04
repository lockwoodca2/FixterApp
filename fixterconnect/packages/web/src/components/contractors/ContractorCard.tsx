import React from 'react';
import { Contractor } from './ContractorsListPage';
import StarRating from '../common/StarRating';
import styles from './ContractorCard.module.css';

interface ContractorCardProps {
  contractor: Contractor;
  onPress: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

const ContractorCard: React.FC<ContractorCardProps> = ({
  contractor,
  onPress,
  onSelect,
  isSelected
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.checkboxContainer}>
        <input 
          type="checkbox"
          className={styles.checkbox}
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div 
        className={styles.content}
        onClick={onPress}
      >
        <div className={styles.header}>
          <h3 className={styles.name}>{contractor.name}</h3>
          
          <div className={styles.rating}>
            <StarRating 
              rating={contractor.rating} 
              reviewCount={contractor.review_count}
              googleUrl={contractor.google_business_url}
            />
          </div>
        </div>
        
        <p className={styles.description}>
          {contractor.description || 'Professional contractor services'}
        </p>
      </div>
    </div>
  );
};

export default ContractorCard;