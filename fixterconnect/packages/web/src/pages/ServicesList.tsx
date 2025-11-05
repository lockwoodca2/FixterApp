import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Users,
  DollarSign,
  ChevronRight,
  Droplet,
  Wind,
  Sun,
  Home,
  Scissors,
  Zap
} from 'react-feather';
import { ApiClient } from '@fixterconnect/core';
import type { Service } from '@fixterconnect/core';
import { API_BASE_URL } from '../config/api';

const apiClient = new ApiClient(API_BASE_URL);

// Mock services data organized by category
const MOCK_SERVICES_BY_CATEGORY = {
  'Seasonal Services': [
    {
      id: 1,
      name: 'Gutter Cleaning',
      description: 'Professional gutter cleaning and debris removal to prevent water damage',
      category: 'Seasonal Services',
      avgPrice: 89,
      contractorCount: 24,
      avgRating: 4.8,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Sprinkler Blow-out',
      description: 'Winterize your irrigation system to prevent freeze damage',
      category: 'Seasonal Services',
      avgPrice: 75,
      contractorCount: 18,
      avgRating: 4.9,
      image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Holiday Lights Installation',
      description: 'Professional holiday lighting installation and removal',
      category: 'Seasonal Services',
      avgPrice: 150,
      contractorCount: 12,
      avgRating: 4.7,
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Snow Removal',
      description: 'Driveway and walkway snow clearing services',
      category: 'Seasonal Services',
      avgPrice: 65,
      contractorCount: 15,
      avgRating: 4.6,
      image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&h=300&fit=crop'
    }
  ],
  'Home Maintenance': [
    {
      id: 5,
      name: 'Pressure Washing',
      description: 'Exterior cleaning for driveways, decks, siding, and patios',
      category: 'Home Maintenance',
      avgPrice: 120,
      contractorCount: 32,
      avgRating: 4.9,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Window Cleaning',
      description: 'Professional window cleaning for residential and commercial properties',
      category: 'Home Maintenance',
      avgPrice: 95,
      contractorCount: 21,
      avgRating: 4.8,
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Painting',
      description: 'Interior and exterior painting services',
      category: 'Home Maintenance',
      avgPrice: 250,
      contractorCount: 28,
      avgRating: 4.7,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Plumbing Repairs',
      description: 'Basic plumbing repairs and maintenance',
      category: 'Home Maintenance',
      avgPrice: 125,
      contractorCount: 19,
      avgRating: 4.8,
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop'
    }
  ],
  'Lawn Care': [
    {
      id: 9,
      name: 'Lawn Mowing',
      description: 'Regular lawn mowing and edging services',
      category: 'Lawn Care',
      avgPrice: 45,
      contractorCount: 42,
      avgRating: 4.6,
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=300&fit=crop'
    },
    {
      id: 10,
      name: 'Lawn Aerating',
      description: 'Core aeration to improve lawn health and drainage',
      category: 'Lawn Care',
      avgPrice: 85,
      contractorCount: 16,
      avgRating: 4.7,
      image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop'
    },
    {
      id: 11,
      name: 'Tree Trimming',
      description: 'Professional tree and shrub trimming services',
      category: 'Lawn Care',
      avgPrice: 175,
      contractorCount: 14,
      avgRating: 4.9,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'
    },
    {
      id: 12,
      name: 'Yard Cleanup',
      description: 'Seasonal yard cleanup and debris removal',
      category: 'Lawn Care',
      avgPrice: 95,
      contractorCount: 25,
      avgRating: 4.5,
      image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&h=300&fit=crop'
    }
  ]
};

const ServicesList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [services, setServices] = useState<any>(MOCK_SERVICES_BY_CATEGORY);

  const cities = ['All Cities', 'Nampa', 'Boise', 'Caldwell', 'Meridian', 'Eagle'];

  const handleServiceClick = (serviceName: string) => {
    const params = new URLSearchParams();
    params.set('service', serviceName);
    if (selectedCity && selectedCity !== 'All Cities') {
      params.set('city', selectedCity);
    }
    navigate(`/search?${params.toString()}`);
  };

  const handleSearch = () => {
    if (!searchQuery) return;

    const params = new URLSearchParams();
    params.set('service', searchQuery);
    if (selectedCity && selectedCity !== 'All Cities') {
      params.set('city', selectedCity);
    }
    navigate(`/search?${params.toString()}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Seasonal Services':
        return <Sun size={24} color="#f59e0b" />;
      case 'Home Maintenance':
        return <Home size={24} color="#3b82f6" />;
      case 'Lawn Care':
        return <Scissors size={24} color="#10b981" />;
      default:
        return <Zap size={24} color="#667eea" />;
    }
  };

  const renderServiceCard = (service: any) => (
    <div
      key={service.id}
      onClick={() => handleServiceClick(service.name)}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      {/* Service Image */}
      <div style={{
        height: '200px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f1f5f9'
      }}>
        <img
          src={service.image}
          alt={service.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Price Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.95)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <DollarSign size={14} />
          {service.avgPrice}
        </div>
      </div>

      {/* Service Info */}
      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          {service.name}
        </h3>

        <p style={{
          fontSize: '14px',
          color: '#64748b',
          lineHeight: '1.6',
          marginBottom: '16px',
          minHeight: '42px'
        }}>
          {service.description}
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              {service.avgRating}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#64748b'
          }}>
            <Users size={16} />
            <span style={{ fontSize: '14px' }}>
              {service.contractorCount} pros
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#667eea',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            View
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 24px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Professional Home Services
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            opacity: 0.95
          }}>
            Find trusted contractors for all your home maintenance needs
          </p>

          {/* Search Bar */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '8px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr auto',
            gap: '12px',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                type="text"
                placeholder="What service do you need?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <MapPin
                size={20}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  pointerEvents: 'none'
                }}
              />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All Cities</option>
                {cities.slice(1).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSearch}
              style={{
                padding: '14px 28px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Services by Category */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 24px'
      }}>
        {Object.entries(services).map(([category, categoryServices]) => (
          <div key={category} style={{ marginBottom: '64px' }}>
            {/* Category Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px'
            }}>
              {getCategoryIcon(category)}
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '4px'
                }}>
                  {category}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b'
                }}>
                  {(categoryServices as any[]).length} services available
                </p>
              </div>
            </div>

            {/* Services Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {(categoryServices as any[]).map(service => renderServiceCard(service))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div style={{
        backgroundColor: '#1e293b',
        padding: '64px 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            Are you a service professional?
          </h2>
          <p style={{
            fontSize: '18px',
            marginBottom: '32px',
            opacity: 0.9
          }}>
            Join our network of trusted contractors and grow your business
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '16px 32px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Join as a Contractor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesList;
