import React from 'react';
import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  googleUrl?: string;
  size?: 'small' | 'medium' | 'large';
  compact?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  reviewCount, 
  googleUrl, 
  size = 'medium',
  compact = false 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const renderStars = () => {
    const stars = [];
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className={styles.star}>★</span>);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<span key="half" className={styles.star}>☆</span>);
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className={styles.emptyStar}>☆</span>);
    }
    
    return stars;
  };
  
  if (googleUrl) {
    return (
      <a 
        href={googleUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${styles.ratingContainer} ${styles[size]} ${compact ? styles.compact : ''}`}
      >
        <div className={styles.stars}>{renderStars()}</div>
        {!compact && reviewCount !== undefined && (
          <span className={styles.reviewCount}>{rating.toFixed(1)} ({reviewCount} reviews)</span>
        )}
      </a>
    );
  }
  
  return (
    <div className={`${styles.ratingContainer} ${styles[size]} ${compact ? styles.compact : ''}`}>
      <div className={styles.stars}>{renderStars()}</div>
      {!compact && reviewCount !== undefined && (
        <span className={styles.reviewCount}>{rating.toFixed(1)} ({reviewCount} reviews)</span>
      )}
    </div>
  );
};

export default StarRating;