import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  Award,
  Clock,
  DollarSign,
  Users,
  Phone,
  Mail,
  Briefcase,
  Shield,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X
} from 'react-feather';
import { ApiClient } from '@fixterconnect/core';
import type { Contractor } from '@fixterconnect/core';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const apiClient = new ApiClient();

// Mock contractor data (matching SearchResults mock data)
const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: 1,
    username: 'contractor1',
    name: 'Mike Johnson',
    rating: 4.9,
    review_count: 156,
    description: 'Expert in gutter cleaning and exterior maintenance with over 10 years of experience. I take pride in providing high-quality service and ensuring customer satisfaction on every job. My team and I are fully insured and committed to delivering exceptional results.',
    years_in_business: 10,
    location: 'Nampa, ID',
    verified: true,
    licensed: true,
    services: [
      { id: 1, name: 'Gutter Cleaning', description: 'Professional gutter cleaning services' },
      { id: 3, name: 'Pressure Washing', description: 'Exterior cleaning services' }
    ],
    google_business_url: 'https://maps.google.com'
  },
  {
    id: 2,
    username: 'contractor2',
    name: 'Sarah Williams',
    rating: 4.8,
    review_count: 203,
    description: 'Professional lawn care and landscaping services for residential and commercial properties.',
    years_in_business: 8,
    location: 'Boise, ID',
    verified: true,
    licensed: false,
    services: [
      { id: 2, name: 'Lawn Care', description: 'Lawn mowing and maintenance' },
      { id: 3, name: 'Pressure Washing', description: 'Exterior cleaning services' }
    ],
    google_business_url: 'https://maps.google.com'
  },
  {
    id: 3,
    username: 'contractor3',
    name: 'David Brown',
    rating: 4.7,
    review_count: 89,
    description: 'Specialized in window cleaning and pressure washing for homes and businesses.',
    years_in_business: 5,
    location: 'Nampa, ID',
    verified: false,
    licensed: false,
    services: [
      { id: 4, name: 'Window Cleaning', description: 'Residential and commercial window cleaning' },
      { id: 3, name: 'Pressure Washing', description: 'Exterior cleaning services' }
    ],
    google_business_url: 'https://maps.google.com'
  },
  {
    id: 4,
    username: 'contractor4',
    name: 'Jennifer Martinez',
    rating: 5.0,
    review_count: 74,
    description: 'Quality painting services with attention to detail. Interior and exterior projects welcome.',
    years_in_business: 12,
    location: 'Meridian, ID',
    verified: true,
    licensed: true,
    services: [
      { id: 5, name: 'Painting', description: 'Interior and exterior painting' }
    ],
    google_business_url: 'https://maps.google.com'
  },
  {
    id: 5,
    username: 'contractor5',
    name: 'Tom Anderson',
    rating: 4.6,
    review_count: 112,
    description: 'Licensed plumber serving the Treasure Valley. Quick response times and fair pricing.',
    years_in_business: 15,
    location: 'Boise, ID',
    verified: true,
    licensed: true,
    services: [
      { id: 6, name: 'Plumbing', description: 'Basic plumbing repairs' }
    ]
  },
  {
    id: 6,
    username: 'contractor6',
    name: 'Lisa Garcia',
    rating: 4.9,
    review_count: 187,
    description: 'Full-service gutter specialist. Cleaning, repairs, and installation available.',
    years_in_business: 7,
    location: 'Nampa, ID',
    verified: false,
    licensed: true,
    services: [
      { id: 1, name: 'Gutter Cleaning', description: 'Professional gutter cleaning services' }
    ],
    google_business_url: 'https://maps.google.com'
  }
];

// Mock reviews
const MOCK_REVIEWS = [
  {
    id: 1,
    clientName: 'John Smith',
    rating: 5,
    date: '2024-10-15',
    comment: 'Excellent work! Very professional and thorough. The gutters look great and the cleanup was impeccable.',
    service: 'Gutter Cleaning'
  },
  {
    id: 2,
    clientName: 'Emily Davis',
    rating: 5,
    date: '2024-10-10',
    comment: 'Highly recommend! Arrived on time, fair pricing, and quality work. Will definitely use again.',
    service: 'Gutter Cleaning'
  },
  {
    id: 3,
    clientName: 'Michael Brown',
    rating: 4,
    date: '2024-10-05',
    comment: 'Great service overall. Very responsive to messages and completed the job as scheduled.',
    service: 'Pressure Washing'
  },
  {
    id: 4,
    clientName: 'Sarah Johnson',
    rating: 5,
    date: '2024-09-28',
    comment: 'Best contractor I\'ve worked with! Professional, friendly, and the results exceeded my expectations.',
    service: 'Gutter Cleaning'
  }
];

const ContractorDetails: React.FC = () => {
  const { contractorId } = useParams<{ contractorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [serviceAddress, setServiceAddress] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [contractorSchedule, setContractorSchedule] = useState<any[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadContractor();
  }, [contractorId]);

  const loadContractor = async () => {
    try {
      setLoading(true);

      // Try API first
      try {
        const contractorData = await apiClient.getContractor(Number(contractorId));
        setContractor(contractorData);

        // Load contractor schedule for next 30 days
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const schedule = await apiClient.getContractorSchedule(Number(contractorId), startDate, endDate);
        setContractorSchedule(schedule);
      } catch (apiError) {
        // Fall back to mock data
        console.log('Using mock contractor data');
        const mockContractor = MOCK_CONTRACTORS.find(c => c.id === Number(contractorId));
        if (mockContractor) {
          setContractor(mockContractor);
        }

        // Mock schedule data - generate availability for next 2 weeks
        const mockSchedule = generateMockSchedule();
        setContractorSchedule(mockSchedule);
      }
    } catch (error) {
      console.error('Error loading contractor:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock schedule for development
  const generateMockSchedule = () => {
    const schedule = [];
    const today = new Date();

    // Generate 14 days of availability
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();

      // Skip Sundays (0)
      if (dayOfWeek === 0) continue;

      // Add availability for weekdays with different time slots
      schedule.push({
        date: date.toISOString().split('T')[0],
        day_of_week: dayOfWeek,
        available: true,
        start_time: '08:00',
        end_time: '17:00',
        max_slots: 4,
        booked_slots: Math.floor(Math.random() * 2), // Random bookings (0-1)
        available_slots: 4 - Math.floor(Math.random() * 2)
      });
    }

    return schedule;
  };

  // Load available time slots when date is selected
  useEffect(() => {
    if (selectedDate && contractorSchedule.length > 0) {
      loadAvailableTimeSlots(selectedDate);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate, contractorSchedule]);

  const loadAvailableTimeSlots = (date: string) => {
    // Find schedule entry for selected date
    const scheduleEntry = contractorSchedule.find(
      s => s.date === date && s.available && s.available_slots > 0
    );

    if (!scheduleEntry) {
      setAvailableTimeSlots([]);
      return;
    }

    // Generate time slots based on start and end time
    const startHour = parseInt(scheduleEntry.start_time.split(':')[0]);
    const endHour = parseInt(scheduleEntry.end_time.split(':')[0]);
    const slots = [];

    for (let hour = startHour; hour < endHour && hour < 17; hour++) {
      // Generate slots every hour
      const time12hr = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
      slots.push(time12hr);
    }

    setAvailableTimeSlots(slots);
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Please select a service, date, and time');
      return;
    }

    if (!serviceAddress) {
      alert('Please enter a service address');
      return;
    }

    if (!user || !contractor) {
      alert('Please log in to book a service');
      return;
    }

    try {
      setIsSubmitting(true);

      // Find the selected service details
      const service = contractor.services?.find(s => s.name === selectedService);
      if (!service) {
        throw new Error('Service not found');
      }

      // Submit booking to backend
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractorId: contractor.id,
          clientId: user.id,
          serviceId: service.id,
          serviceAddress: serviceAddress,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          price: null // Price can be determined later
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Booking request submitted successfully!\n\nService: ${selectedService}\nDate: ${selectedDate}\nTime: ${selectedTime}\n\nThe contractor will confirm your booking soon.`);

        // Reset form
        setShowBookingModal(false);
        setSelectedService('');
        setSelectedDate('');
        setSelectedTime('');
        setServiceAddress('');
        setBookingNotes('');

        // Optionally navigate to dashboard
        // navigate('/client-dashboard');
      } else {
        throw new Error(data.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            fill={star <= rating ? '#f59e0b' : 'none'}
            color={star <= rating ? '#f59e0b' : '#cbd5e1'}
          />
        ))}
      </div>
    );
  };

  const getAvailableTimes = () => {
    // If a date is selected, return the available slots for that date
    if (selectedDate && availableTimeSlots.length > 0) {
      return availableTimeSlots;
    }

    // Default time slots if no date selected yet
    return [
      '8:00 AM',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM'
    ];
  };

  // Check if a specific date has availability
  const isDateAvailable = (dateString: string) => {
    const scheduleEntry = contractorSchedule.find(
      s => s.date === dateString && s.available && s.available_slots > 0
    );
    return !!scheduleEntry;
  };

  // Get next 30 days for calendar display
  const getNext30Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        available: isDateAvailable(date.toISOString().split('T')[0])
      });
    }

    return days;
  };

  const renderBookingModal = () => {
    if (!showBookingModal || !contractor) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0
            }}>
              Book with {contractor.name}
            </h2>
            <button
              onClick={() => setShowBookingModal(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <X size={24} color="#64748b" />
            </button>
          </div>

          {/* Select Service */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              <Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Select Service *
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
              <option value="">Choose a service...</option>
              {contractor.services?.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Address */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Service Address *
            </label>
            <input
              type="text"
              value={serviceAddress}
              onChange={(e) => setServiceAddress(e.target.value)}
              placeholder="Enter the address where service is needed"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Select Date */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Select Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Select Time */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Select Time *
            </label>

            {selectedDate && availableTimeSlots.length === 0 ? (
              <div style={{
                padding: '16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#991b1b',
                  margin: 0
                }}>
                  No available time slots for this date. Please select a different date.
                </p>
              </div>
            ) : !selectedDate ? (
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  Please select a date first to see available times
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px'
              }}>
                {getAvailableTimes().map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '12px 8px',
                      backgroundColor: selectedTime === time ? '#667eea' : 'white',
                      color: selectedTime === time ? 'white' : '#1e293b',
                      border: `2px solid ${selectedTime === time ? '#667eea' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: selectedTime === time ? 'bold' : 'normal',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              Additional Notes (Optional)
            </label>
            <textarea
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              placeholder="Any specific instructions or details about the job..."
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '100px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setShowBookingModal(false)}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'white',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: isSubmitting ? '#94a3b8' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Request Booking'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <Clock size={48} style={{ color: '#cbd5e1' }} />
      </div>
    );
  }

  if (!contractor) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '24px'
      }}>
        <Users size={64} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
          Contractor Not Found
        </h2>
        <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '24px' }}>
          The contractor you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/search')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '64px' }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px'
        }}>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#667eea',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
          >
            <ChevronLeft size={18} />
            Back to Search
          </button>

          {/* Contractor Header */}
          <div style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start'
          }}>
            {/* Profile Picture */}
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '4px solid white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <Users size={60} color="white" />
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {contractor.name}
                </h1>

                {/* Badges */}
                {contractor.verified && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '6px'
                  }}>
                    <CheckCircle size={18} color="#3b82f6" />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: '#3b82f6'
                    }}>
                      VERIFIED
                    </span>
                  </div>
                )}

                {contractor.licensed && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#d1fae5',
                    borderRadius: '6px'
                  }}>
                    <Award size={18} color="#10b981" />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: '#10b981'
                    }}>
                      LICENSED
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={24} fill="#f59e0b" color="#f59e0b" />
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1e293b'
                  }}>
                    {(contractor.rating || 0).toFixed(1)}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    color: '#64748b'
                  }}>
                    ({contractor.reviewCount || contractor.review_count || 0} reviews)
                  </span>
                </div>

                {(contractor.yearsInBusiness || contractor.years_in_business) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b'
                  }}>
                    <Shield size={18} />
                    <span style={{ fontSize: '16px' }}>
                      {contractor.yearsInBusiness || contractor.years_in_business} years in business
                    </span>
                  </div>
                )}
              </div>

              {/* Location */}
              {contractor.location && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#64748b',
                  fontSize: '16px',
                  marginBottom: '20px'
                }}>
                  <MapPin size={18} />
                  {contractor.location}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px'
              }}>
                <button
                  onClick={() => setShowBookingModal(true)}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Calendar size={20} />
                  Book Now
                </button>

                {contractor.google_business_url && (
                  <button
                    onClick={() => window.open(contractor.google_business_url, '_blank')}
                    style={{
                      padding: '14px 28px',
                      backgroundColor: 'white',
                      color: '#1e293b',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <ExternalLink size={18} />
                    Google Reviews
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px'
        }}>
          {/* Left Column */}
          <div>
            {/* About Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                About
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.8',
                margin: 0
              }}>
                {contractor.description}
              </p>
            </div>

            {/* Reviews Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Reviews
                </h2>
                <span style={{
                  fontSize: '16px',
                  color: '#64748b'
                }}>
                  {contractor.reviewCount || contractor.review_count || 0} total reviews
                </span>
              </div>

              {/* Review List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                {MOCK_REVIEWS.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      paddingBottom: '24px',
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: '#1e293b',
                          marginBottom: '4px'
                        }}>
                          {review.clientName}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          {new Date(review.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#667eea',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      {review.service}
                    </div>
                    <p style={{
                      fontSize: '15px',
                      color: '#475569',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Availability Calendar */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Calendar size={20} color="#667eea" />
                Availability
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                marginBottom: '16px'
              }}>
                Next 2 weeks
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '6px',
                marginBottom: '12px'
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div
                    key={day}
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#64748b',
                      textAlign: 'center',
                      padding: '4px 0'
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '6px'
              }}>
                {getNext30Days().slice(0, 14).map((day) => {
                  const isToday = day.date === new Date().toISOString().split('T')[0];

                  return (
                    <div
                      key={day.date}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '6px',
                        backgroundColor: day.available ? '#dcfce7' : '#f8fafc',
                        border: `1px solid ${day.available ? '#86efac' : '#e2e8f0'}`,
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: day.available ? '#166534' : '#94a3b8',
                        position: 'relative'
                      }}
                    >
                      {day.dayNumber}
                      {isToday && (
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#667eea',
                          position: 'absolute',
                          bottom: '4px',
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: '#dcfce7',
                    border: '1px solid #86efac'
                  }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Unavailable</span>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Briefcase size={20} color="#667eea" />
                Services Offered
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {contractor.services?.map((service) => (
                  <div
                    key={service.id}
                    style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b'
                    }}
                  >
                    {service.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Quick Stats
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Star size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#1e293b'
                    }}>
                      {(contractor.rating || 0).toFixed(1)}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b'
                    }}>
                      Average Rating
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#1e293b'
                    }}>
                      {contractor.reviewCount || contractor.review_count || 0}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b'
                    }}>
                      Total Reviews
                    </div>
                  </div>
                </div>

                {(contractor.yearsInBusiness || contractor.years_in_business) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Shield size={20} color="#10b981" />
                    </div>
                    <div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}>
                        {contractor.yearsInBusiness || contractor.years_in_business}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        Years Experience
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {renderBookingModal()}
    </div>
  );
};

export default ContractorDetails;
