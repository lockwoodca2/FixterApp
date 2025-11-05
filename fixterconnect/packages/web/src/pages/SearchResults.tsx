import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Calendar,
  Filter,
  CheckCircle,
  Award,
  Sliders,
  Users,
  Clock
} from 'react-feather';
import { ApiClient } from '@fixterconnect/core';
import type { Contractor, ServiceArea } from '@fixterconnect/core';
import type { Service } from '@fixterconnect/core';
import { API_BASE_URL } from '../config/api';

const apiClient = new ApiClient();

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get search parameters from URL
  const serviceParam = searchParams.get('service');
  const cityParam = searchParams.get('city');
  const dateParam = searchParams.get('date');

  // State
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [selectedService, setSelectedService] = useState<string>(serviceParam || '');
  const [selectedCity, setSelectedCity] = useState<string>(cityParam || '');
  const [selectedDate, setSelectedDate] = useState<string>(dateParam || '');
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [licensedOnly, setLicensedOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Apply filters when data or filter values change
  useEffect(() => {
    applyFilters();
  }, [contractors, selectedService, selectedCity, minRating, verifiedOnly, licensedOnly, selectedDate]);


  const loadData = async () => {
    try {
      setLoading(true);

      // Try to load from API
      try {
        const servicesData = await apiClient.getServices();
        setServices(servicesData);

        // Extract unique service areas from contractors (no dedicated endpoint yet)
        const uniqueAreas = new Set<string>();
        const areasData: ServiceArea[] = [];

        // Load contractors - either filtered by service or all contractors
        let contractorsData;
        if (serviceParam) {
          const serviceId = servicesData.find(s => s.name === serviceParam)?.id;
          if (serviceId) {
            contractorsData = await apiClient.getContractorsByService(serviceId);
          }
        } else {
          // Load all contractors when no specific service is selected
          const response = await fetch(`${API_BASE_URL}/contractors`);
          const data = await response.json();
          if (data.success) {
            contractorsData = data.contractors;
          } else {
            // API might return data directly as an array
            contractorsData = data;
          }
        }

        // Handle API response which might be { success: true, contractors: [...] } or just an array
        if (contractorsData) {
          let contractors: Contractor[] = [];
          if (Array.isArray(contractorsData)) {
            contractors = contractorsData;
          } else if (contractorsData && Array.isArray(contractorsData.contractors)) {
            contractors = contractorsData.contractors;
          }

          // Normalize contractor data to handle both API formats
          const normalizedContractors = contractors.map(c => ({
            ...c,
            review_count: c.reviewCount || c.review_count || 0,
            years_in_business: c.yearsInBusiness || c.years_in_business,
            services: Array.isArray(c.services)
              ? c.services.map(s => 'service' in s ? s.service : s)
              : []
          }));

          // Extract unique service areas from contractors
          contractors.forEach(contractor => {
            if (contractor.serviceAreas && Array.isArray(contractor.serviceAreas)) {
              contractor.serviceAreas.forEach((sa: any) => {
                if (sa.area) {
                  uniqueAreas.add(sa.area);
                }
              });
            }
          });

          // Convert to ServiceArea array
          let id = 1;
          uniqueAreas.forEach(areaName => {
            areasData.push({ id: id++, name: areaName });
          });

          setServiceAreas(areasData);
          setContractors(normalizedContractors);
        }
      } catch (apiError) {
        console.error('API not available:', apiError);
        // Set empty arrays if API is not available
        setServices([]);
        setServiceAreas([]);
        setContractors([]);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(async () => {
    // Guard against contractors being undefined or not an array
    if (!contractors || !Array.isArray(contractors)) {
      setFilteredContractors([]);
      return;
    }

    let filtered = [...contractors];

    // Filter by selected service
    if (selectedService) {
      filtered = filtered.filter(contractor => {
        const hasService = contractor.services?.some(s => {
          const serviceName = 'service' in s ? s.service.name : s.name;
          return serviceName === selectedService;
        });
        return hasService;
      });
    }

    // Filter by selected city (check service areas, not just location)
    if (selectedCity && selectedCity !== 'All cities') {
      filtered = filtered.filter(contractor => {
        // Check if contractor serves this area
        if (contractor.serviceAreas && Array.isArray(contractor.serviceAreas)) {
          return contractor.serviceAreas.some((sa: any) => sa.area === selectedCity);
        }
        // Fallback to checking location if no serviceAreas
        return contractor.location?.includes(selectedCity);
      });
    }

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(c => c.rating >= minRating);
    }

    // Filter by verified
    if (verifiedOnly) {
      filtered = filtered.filter(c => c.verified === true);
    }

    // Filter by licensed
    if (licensedOnly) {
      filtered = filtered.filter(c => c.licensed === true);
    }

    // Filter by availability (date)
    if (selectedDate) {
      try {
        // Check availability for each contractor
        const availabilityChecks = await Promise.all(
          filtered.map(async (contractor) => {
            try {
              const schedule = await apiClient.getContractorSchedule(
                contractor.id,
                selectedDate,
                selectedDate
              );

              // Check if contractor has availability on the selected date
              // Schedule should have entries with available slots
              const hasAvailability = schedule.some((slot: any) => {
                const slotDate = new Date(slot.date).toISOString().split('T')[0];
                const searchDate = new Date(selectedDate).toISOString().split('T')[0];

                // Check if dates match and there are available slots
                return slotDate === searchDate &&
                       (slot.available_slots > 0 || slot.max_slots > (slot.booked_slots || 0));
              });

              return { contractor, hasAvailability };
            } catch (error) {
              console.error(`Error checking availability for contractor ${contractor.id}:`, error);
              // If there's an error checking availability, exclude the contractor
              return { contractor, hasAvailability: false };
            }
          })
        );

        // Filter to only contractors with availability
        filtered = availabilityChecks
          .filter(check => check.hasAvailability)
          .map(check => check.contractor);

      } catch (error) {
        console.error('Error filtering by availability:', error);
        // If there's a general error, continue without date filtering
      }
    }

    // Sort by rating (highest first)
    filtered.sort((a, b) => b.rating - a.rating);

    console.log('FINAL filtered contractors:', filtered.length);
    console.log('=== APPLY FILTERS END ===');
    setFilteredContractors(filtered);
  }, [contractors, selectedService, selectedCity, minRating, verifiedOnly, licensedOnly, selectedDate]);

  const handleSearch = async () => {
    if (!selectedService) return;

    setLoading(true);
    try {
      const service = services.find(s => s.name === selectedService);
      if (service) {
        // Fetch contractors by service from API
        const contractorsData = await apiClient.getContractorsByService(service.id);
        setContractors(contractorsData);

        // Update URL parameters
        const params = new URLSearchParams();
        if (selectedService) params.set('service', selectedService);
        if (selectedCity) params.set('city', selectedCity);
        if (selectedDate) params.set('date', selectedDate);
        window.history.pushState({}, '', `?${params.toString()}`);
      }
    } catch (error) {
      console.error('Error searching contractors:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFilters = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      position: 'sticky',
      top: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px'
      }}>
        <Sliders size={20} color="#667eea" />
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1e293b',
          margin: 0
        }}>
          Filters
        </h3>
      </div>

      {/* Rating Filter */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '12px'
        }}>
          <Star size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Minimum Rating
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[4.5, 4.0, 3.5, 3.0].map(rating => (
            <label
              key={rating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: minRating === rating ? '#ede9fe' : 'transparent'
              }}
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
                style={{ cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontSize: '14px', color: '#1e293b' }}>
                  {rating}+ stars
                </span>
              </div>
            </label>
          ))}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: minRating === 0 ? '#ede9fe' : 'transparent'
            }}
          >
            <input
              type="radio"
              name="rating"
              checked={minRating === 0}
              onChange={() => setMinRating(0)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', color: '#1e293b' }}>Any rating</span>
          </label>
        </div>
      </div>

      {/* Verified Only */}
      <div style={{
        marginBottom: '24px',
        padding: '12px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <CheckCircle size={16} color="#3b82f6" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            Verified Pros Only
          </span>
        </label>
      </div>

      {/* Licensed Only */}
      <div style={{
        marginBottom: '24px',
        padding: '12px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={licensedOnly}
            onChange={(e) => setLicensedOnly(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <Award size={16} color="#10b981" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            Licensed Contractors Only
          </span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedService('');
          setSelectedCity('');
          setMinRating(0);
          setVerifiedOnly(false);
          setLicensedOnly(false);
          setSelectedDate('');
        }}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'white',
          color: '#64748b',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Clear All Filters
      </button>
    </div>
  );

  const renderContractorCard = (contractor: Contractor) => (
    <div
      key={contractor.id}
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
      onClick={() => navigate(`/contractor/${contractor.id}`)}
    >
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {/* Profile Picture */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#667eea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Users size={40} color="white" />
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            flexWrap: 'wrap'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0
            }}>
              {contractor.name}
            </h3>

            {/* Verified Badge */}
            {contractor.verified === true && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: '#dbeafe',
                borderRadius: '4px'
              }}>
                <CheckCircle size={14} color="#3b82f6" />
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#3b82f6'
                }}>
                  VERIFIED
                </span>
              </div>
            )}

            {/* Licensed Badge */}
            {contractor.licensed === true && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: '#d1fae5',
                borderRadius: '4px'
              }}>
                <Award size={14} color="#10b981" />
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#10b981'
                }}>
                  LICENSED
                </span>
              </div>
            )}
          </div>

          {/* Rating & Reviews */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <span style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                {contractor.rating.toFixed(1)}
              </span>
              <span style={{
                fontSize: '14px',
                color: '#64748b'
              }}>
                ({contractor.review_count} reviews)
              </span>
            </div>

            {contractor.years_in_business && (
              <div style={{
                fontSize: '14px',
                color: '#64748b'
              }}>
                {contractor.years_in_business} years in business
              </div>
            )}
          </div>

          {/* Location */}
          {contractor.location && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#64748b',
              fontSize: '14px'
            }}>
              <MapPin size={14} />
              {contractor.location}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {contractor.description && (
        <p style={{
          fontSize: '14px',
          color: '#475569',
          lineHeight: '1.6',
          marginBottom: '16px'
        }}>
          {contractor.description}
        </p>
      )}

      {/* Services */}
      {contractor.services && contractor.services.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            Services Offered:
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {contractor.services.map((service, idx) => {
              const serviceName = 'service' in service ? service.service.name : service.name;
              return (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                >
                  {serviceName}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/contractor/${contractor.id}`);
          }}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Calendar size={16} />
          VIEW PROFILE & BOOK
        </button>
        {contractor.google_business_url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(contractor.google_business_url, '_blank');
            }}
            style={{
              padding: '12px 16px',
              backgroundColor: 'white',
              color: '#1e293b',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Google Reviews
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Search Bar */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      className="search-bar-container"
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gap: '12px',
            alignItems: 'end'
          }}
          className="search-grid"
          >
            {/* Service Selector */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '6px'
              }}>
                <Search size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select a service...</option>
                {services.map(service => (
                  <option key={service.id} value={service.name}>{service.name}</option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '6px'
              }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                <option value="">All cities</option>
                {serviceAreas.map(area => (
                  <option key={area.id} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>

            {/* Date Selector */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '6px'
              }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Date (Optional)
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              style={{
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Search size={18} />
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Results Header */}
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0,
              marginBottom: '4px'
            }}>
              {selectedService || 'All Services'}
              {selectedCity && ` in ${selectedCity}`}
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              margin: 0
            }}>
              {filteredContractors.length} professional{filteredContractors.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            style={{
              padding: '12px 20px',
              backgroundColor: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Filter size={18} />
            FILTERS
          </button>
        </div>

        {/* Layout: Filters + Results */}
        <div style={{
          display: 'grid',
          gap: '32px'
        }}
        className="results-layout"
        >
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            {renderFilters()}
          </div>

          {/* Results Grid */}
          <div>
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '64px',
                color: '#64748b'
              }}>
                <Clock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '18px' }}>Loading contractors...</p>
              </div>
            ) : filteredContractors.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '64px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <Users size={64} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  No contractors found
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  marginBottom: '24px'
                }}>
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => {
                    setSelectedService('');
                    setSelectedCity('');
                    setMinRating(0);
                    setVerifiedOnly(false);
                    setLicensedOnly(false);
                    setSelectedDate('');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                {filteredContractors.map(contractor => renderContractorCard(contractor))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        /* Desktop - 4 column search bar */
        .search-grid {
          grid-template-columns: 2fr 1fr 1fr auto;
        }

        /* Desktop - sidebar + results */
        .results-layout {
          grid-template-columns: 280px 1fr;
        }

        /* Tablet and below - hide sidebar, show mobile filter button */
        @media (max-width: 1024px) {
          .filters-sidebar {
            display: none;
          }
          .results-layout {
            grid-template-columns: 1fr;
          }
        }

        /* Tablet - 2 column search bar */
        @media (max-width: 768px) {
          .search-grid {
            grid-template-columns: 1fr 1fr;
          }
          .search-grid > div:nth-child(3) {
            grid-column: 1 / -1;
          }
          .search-grid > button {
            grid-column: 1 / -1;
          }
        }

        /* Mobile - stack everything */
        @media (max-width: 480px) {
          .search-bar-container {
            padding: 12px !important;
          }
          .search-grid {
            grid-template-columns: 1fr !important;
          }
          .search-grid > div,
          .search-grid > button {
            grid-column: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
