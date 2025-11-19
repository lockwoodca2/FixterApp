import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  CheckCircle,
  Calendar,
  Shield,
  Users,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  ArrowRight
} from 'react-feather';
import { API_BASE_URL } from '../config/api';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('Gutter Cleaning');
  const [selectedCity, setSelectedCity] = useState('Nampa');
  const [cities, setCities] = useState<string[]>(['Nampa', 'Caldwell', 'Boise', 'Meridian', 'Eagle']);

  // Mock data - TODO: Replace with API calls
  const services = [
    'Gutter Cleaning',
    'Sprinkler Blow-out',
    'Holiday Lights',
    'Pressure Washing',
    'Lawn Aerating',
    'Deck Staining',
    'Snow Removal',
    'Tree Trimming'
  ];

  // Fetch cities from database
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/service-areas`);
        if (response.ok) {
          const serviceAreas = await response.json();
          const cityNames = serviceAreas.map((area: any) => area.name);
          if (cityNames.length > 0) {
            setCities(cityNames);
            // Set first city as default if current selection isn't in the list
            if (!cityNames.includes(selectedCity)) {
              setSelectedCity(cityNames[0]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        // Keep using default cities on error
      }
    };

    fetchCities();
  }, []);

  const popularServices = [
    {
      id: 1,
      name: 'Gutter Cleaning',
      price: 89,
      rating: 4.8,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      description: 'Keep your gutters flowing all winter',
      seasonal: true
    },
    {
      id: 2,
      name: 'Sprinkler Blow-out',
      price: 75,
      rating: 4.9,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=300&fit=crop',
      description: 'Winterize your system before freeze',
      seasonal: true
    },
    {
      id: 3,
      name: 'Holiday Lights',
      price: 150,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop',
      description: 'Professional installation & removal',
      seasonal: true
    },
    {
      id: 4,
      name: 'Pressure Washing',
      price: 120,
      rating: 4.9,
      reviews: 421,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      description: 'Driveways, decks, and siding'
    }
  ];

  const topPros = [
    {
      id: 1,
      name: 'Rick Smith',
      rating: 4.9,
      jobsCompleted: 127,
      specialties: ['Gutter Cleaning', 'Sprinkler Blow-out', 'Pressure Washing'],
      verified: true,
      nextAvailable: 'Tomorrow 10:00 AM',
      testimonial: 'Rick was amazing! Fast, professional, and left everything spotless.'
    },
    {
      id: 2,
      name: 'Nathan Fisk',
      rating: 4.8,
      jobsCompleted: 93,
      specialties: ['Lawn Aerating', 'Tree Trimming', 'Landscaping'],
      verified: true,
      nextAvailable: 'Today 2:00 PM',
      testimonial: 'Great work on our lawn. Highly recommend Nathan!'
    },
    {
      id: 3,
      name: 'Tom Wilson',
      rating: 4.7,
      jobsCompleted: 156,
      specialties: ['Deck Staining', 'Pressure Washing', 'Painting'],
      verified: true,
      nextAvailable: 'Thursday 9:00 AM',
      testimonial: 'Tom did an incredible job on our deck. Looks brand new!'
    }
  ];

  const handleSearch = () => {
    // Navigate to search results with query parameters
    const params = new URLSearchParams();
    if (selectedService) params.set('service', selectedService);
    if (selectedCity) params.set('city', selectedCity);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Winter's Coming.
            <br />
            Get Your Home Ready.
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            opacity: 0.95
          }}>
            Find trusted, vetted local handymen for all your seasonal needs
          </p>

          {/* Search Box */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '700px',
            margin: '0 auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}>
                  <Search size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  What do you need?
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
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}>
                  <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Where?
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
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSearch}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Search size={20} />
              FIND PROS
            </button>
          </div>

          {/* Trust Signals */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '40px',
            fontSize: '16px',
            opacity: 0.95
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} />
              4,500+ jobs completed
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={20} fill="white" />
              98% happy customers
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} />
              100% vetted pros
            </div>
          </div>
        </div>
      </div>

      {/* Popular Services Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              Popular Services Right Now
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#64748b'
            }}>
              Seasonal services in high demand
            </p>
          </div>
          <button
            onClick={() => navigate('/services')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            View All
            <ArrowRight size={18} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {popularServices.map(service => (
            <div
              key={service.id}
              onClick={() => handleSearch()}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {/* Image */}
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f1f5f9',
                position: 'relative'
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
                {service.seasonal && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <TrendingUp size={14} />
                    SEASONAL
                  </div>
                )}
              </div>

              {/* Content */}
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
                  marginBottom: '16px'
                }}>
                  {service.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <div>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '4px'
                    }}>
                      Starting at
                    </p>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#10b981'
                    }}>
                      ${service.price}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#f59e0b'
                  }}>
                    <Star size={18} fill="#f59e0b" />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1e293b'
                    }}>
                      {service.rating}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      ({service.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '80px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            How It Works
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            Get the help you need in three simple steps
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px'
          }}>
            {[
              {
                icon: Search,
                title: '1. Tell us what you need',
                description: 'Search for services or browse by category. We have hundreds of vetted pros ready to help.'
              },
              {
                icon: Users,
                title: '2. Browse vetted pros',
                description: 'Compare ratings, reviews, and pricing. All our pros are background-checked and insured.'
              },
              {
                icon: Calendar,
                title: '3. Book & pay securely',
                description: 'Schedule a time that works for you. Pay securely after the job is complete.'
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#ede9fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}>
                    <Icon size={36} color="#667eea" />
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '12px'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#64748b',
                    lineHeight: '1.6'
                  }}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top-Rated Pros Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Top-Rated Pros in {selectedCity}
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b'
          }}>
            Verified professionals with proven track records
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {topPros.map(pro => (
            <div
              key={pro.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '16px'
              }}>
                {/* TODO: Replace with actual profile picture */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Users size={32} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      margin: 0
                    }}>
                      {pro.name}
                    </h3>
                    {pro.verified && (
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
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={16} fill="#f59e0b" color="#f59e0b" />
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}>
                        {pro.rating}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      <Award size={14} />
                      {pro.jobsCompleted} jobs
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#475569',
                fontStyle: 'italic',
                borderLeft: '3px solid #667eea'
              }}>
                "{pro.testimonial}"
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '8px'
                }}>
                  Specializes in:
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {pro.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#ecfdf5',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <Clock size={16} color="#10b981" />
                <span style={{
                  fontSize: '14px',
                  color: '#166534',
                  fontWeight: '600'
                }}>
                  Next available: {pro.nextAvailable}
                </span>
              </div>

              <button
                onClick={() => navigate(`/contractor/${pro.id}`)}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Calendar size={18} />
                BOOK NOW
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 16px',
        textAlign: 'center'
      }}
      className="cta-section"
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '18px',
            marginBottom: '32px',
            opacity: 0.95
          }}>
            Join thousands of happy homeowners who trust FixterConnect
          </p>
          <button
            onClick={handleSearch}
            style={{
              padding: '18px 48px',
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Search size={20} />
            FIND YOUR PRO
          </button>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '48px',
            paddingTop: '48px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            flexWrap: 'wrap'
          }}
          className="trust-badges"
          >
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <Shield size={24} />
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>100%</span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Vetted Professionals</p>
            </div>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <DollarSign size={24} />
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>Secure</span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Payment Protection</p>
            </div>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <Star size={24} fill="white" />
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>4.9</span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .cta-section h2 {
            font-size: 28px !important;
          }
          .cta-section p {
            font-size: 16px !important;
          }
          .trust-badges {
            gap: 16px !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
          .trust-badges > div {
            min-width: 120px;
          }
        }
        @media (max-width: 480px) {
          .cta-section h2 {
            font-size: 24px !important;
          }
          .trust-badges {
            gap: 12px !important;
          }
          .trust-badges > div {
            min-width: 100px;
            font-size: 13px;
          }
          .trust-badges span {
            font-size: 22px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
