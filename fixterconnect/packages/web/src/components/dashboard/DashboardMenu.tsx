import React from 'react';
import styles from './DashboardMenu.module.css';

interface MenuItem {
  id: string;
  label: string;
}

interface DashboardMenuProps {
  items: MenuItem[];
  activeItemId: string;
  onItemClick: (id: string) => void;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({ 
  items, 
  activeItemId, 
  onItemClick 
}) => {
  return (
    <div className={styles.menuContainer}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`${styles.menuItem} ${activeItemId === item.id ? styles.active : ''}`}
          onClick={() => onItemClick(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardMenu;