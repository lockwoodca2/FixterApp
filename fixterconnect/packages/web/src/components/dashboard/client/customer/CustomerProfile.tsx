import React, { useState } from 'react';
import { CustomerProfile as ProfileType } from '../CustomerDashboard';
import styles from './CustomerProfile.module.css';

interface CustomerProfileProps {
  profile: ProfileType;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ profile }) => {
  const [formData, setFormData] = useState<ProfileType>(profile);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile saved successfully!');
    // Here you would save the profile data to your API
  };
  
  return (
    <form className={styles.profileForm} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.formInput}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.formInput}
        />
      </div>
      
      <h3 className={styles.sectionHeader}>Default Service Address</h3>
      
      <div className={styles.formGroup}>
        <label htmlFor="address">Street Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={styles.formInput}
        />
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="zip">ZIP Code</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>
      </div>
      
      <h3 className={styles.sectionHeader}>Notification Preferences</h3>
      
      <div className={styles.checkboxGroup}>
        <div className={styles.checkboxItem}>
          <input
            type="checkbox"
            id="emailNotifications"
            name="emailNotifications"
            checked={formData.emailNotifications}
            onChange={handleChange}
          />
          <label htmlFor="emailNotifications">Email notifications</label>
        </div>
        
        <div className={styles.checkboxItem}>
          <input
            type="checkbox"
            id="smsNotifications"
            name="smsNotifications"
            checked={formData.smsNotifications}
            onChange={handleChange}
          />
          <label htmlFor="smsNotifications">SMS notifications</label>
        </div>
      </div>
      
      <button type="submit" className={styles.saveButton}>
        Save Changes
      </button>
    </form>
  );
};

export default CustomerProfile;