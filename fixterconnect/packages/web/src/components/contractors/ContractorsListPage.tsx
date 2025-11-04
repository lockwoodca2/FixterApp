import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiClient, Contractor } from '@fixterconnect/core';
import { API_BASE_URL } from '../../config/api';
import Layout from '../layout/Layout';
import ContractorCard from './ContractorCard';

const ContractorsListPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiClient = new ApiClient(API_BASE_URL);

  useEffect(() => {
    const fetchContractors = async () => {
      if (!serviceId) {
        setError('Service ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getContractorsByService(Number(serviceId));
        setContractors(data);
      } catch (err) {
        console.error('Error fetching contractors:', err);
        setError('Failed to load contractors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, [serviceId]);

  const handleContractorSelect = (contractor: Contractor) => {
    navigate(`/contractor/${contractor.id}`, { 
      state: { serviceId, serviceName } 
    });
  };

  const toggleContractorSelection = (contractorId: number) => {
    if (selectedContractors.includes(contractorId)) {
      setSelectedContractors(selectedContractors.filter(id => id !== contractorId));
    } else {
      setSelectedContractors([...selectedContractors, contractorId]);
    }
  };

  const handleCompareQuote = () => {
    if (selectedContractors.length === 0) return;
    
    navigate('/request-quote', {
      state: {
        serviceId,
        serviceName,
        contractorIds: selectedContractors
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back to Services
        </button>
        
        <div>
          <h2 className={styles.title}>{serviceName || 'Service'} - Service Providers</h2>
          <p className={styles.subtitle}>Select contractors to compare quotes</p>
        </div>
        
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          
          <button
            className={`${styles.toggleBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar View
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Loading contractors...</p>
        </div>
      ) : contractors.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>No contractors found for this service.</p>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {viewMode === 'list' ? (
            <div className={styles.contractorsList}>
              {contractors.map(contractor => (
                <ContractorCard 
                  key={contractor.id}
                  contractor={contractor}
                  onPress={() => handleContractorSelect(contractor)}
                  onSelect={() => toggleContractorSelection(contractor.id)}
                  isSelected={selectedContractors.includes(contractor.id)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.calendarView}>
              <p className={styles.calendarPlaceholder}>Calendar view will be implemented soon</p>
              {/* Calendar view implementation will go here */}
            </div>
          )}
        </div>
      )}

      {selectedContractors.length > 0 && (
        <div className={styles.floatingActionBar}>
          <p className={styles.selectedText}>
            {selectedContractors.length} contractors selected
          </p>
          <button
            className={styles.actionButton}
            onClick={handleCompareQuote}
          >
            Request Quote
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractorsListPage;