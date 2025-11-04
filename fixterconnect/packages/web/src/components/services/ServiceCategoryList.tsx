// src/components/services/ServiceCategoryList.tsx
import React from 'react';
import { Service } from '../../types/api';

interface ServiceIcons {
  [key: string]: string;
}

const serviceIcons: ServiceIcons = {
  'Sprinkler Blow-out': '💧',
  'Lawn Aerating': '🌱',
  'Holiday Lights': '🎄',
  'Gutter Cleaning': '🏠',
  'Pressure Washing': '🚿',
  'Snow Removal': '❄️',
  'Fence Repair': '🔨',
  'Deck Staining': '🎨'
};

interface ServiceCategoryListProps {
  categories: Service[];
  onSelectCategory: (service: Service) => void;
  loading: boolean;
}

const ServiceCategoryList: React.FC<ServiceCategoryListProps> = ({ 
  categories, 
  onSelectCategory, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="category-section">
      <h2 className="section-title">BROWSE BY CATEGORY</h2>
      
      <div className="categories-container">
        <button className="arrow-btn" onClick={() => scrollCategories('left')}>
          ‹
        </button>
        
        <div className="categories-scroll" id="categoriesContainer">
          {categories.map(category => (
            <div 
              key={category.id}
              className="category-card" 
              onClick={() => onSelectCategory(category)}
            >
              <div className="category-icon">
                {serviceIcons[category.name] || '🔧'}
              </div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
        
        <button className="arrow-btn" onClick={() => scrollCategories('right')}>
          ›
        </button>
      </div>
    </div>
  );
};

// Add this function to handle horizontal scrolling
const scrollCategories = (direction: 'left' | 'right') => {
  const container = document.getElementById('categoriesContainer');
  if (container) {
    const scrollAmount = 220; // Width of card + gap
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }
};

export default ServiceCategoryList;