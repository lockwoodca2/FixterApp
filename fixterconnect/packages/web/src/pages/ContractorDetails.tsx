import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  Award,
  Clock,
  Image as ImageIcon,
  Users,
  Briefcase,
  Shield,
  ExternalLink,
  ChevronLeft,
  X
} from 'react-feather';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

// Helper to get local date string in YYYY-MM-DD format (avoids UTC conversion)
const getLocalDateString = (date: Date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const ContractorDetails: React.FC = () => {
  const { contractorId } = useParams<{ contractorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [contractor, setContractor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [serviceAddress, setServiceAddress] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [availabilityData, setAvailabilityData] = useState<any[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobPhotos, setJobPhotos] = useState<any[]>([]);

  useEffect(() => {
    loadContractor();
  }, [contractorId]);

  const loadContractor = async () => {
    try {
      setLoading(true);

      // Fetch contractor profile
      const response = await fetch(`${API_BASE_URL}/contractor/${contractorId}`);
      if (!response.ok) {
        throw new Error('Contractor not found');
      }

      const data = await response.json();
      if (data.success) {
        setContractor(data.contractor);

        // Load availability for next 30 days
        const startDate = getLocalDateString();
        const endDateObj = new Date();
        endDateObj.setDate(endDateObj.getDate() + 30);
        const endDate = getLocalDateString(endDateObj);

        const availResponse = await fetch(
          `${API_BASE_URL}/availability/contractor/${contractorId}/range?startDate=${startDate}&endDate=${endDate}`
        );

        if (availResponse.ok) {
          const availData = await availResponse.json();
          if (availData.success) {
            setAvailabilityData(availData.availabilities || []);
          }
        } else {
          console.error('Availability API error:', availResponse.status, await availResponse.text());
        }

        // Load job photos
        const photosResponse = await fetch(`${API_BASE_URL}/bookings/contractor/${contractorId}/photos`);
        if (photosResponse.ok) {
          const photosData = await photosResponse.json();
          if (photosData.success) {
            setJobPhotos(photosData.photos || []);
          }
        }
      } else {
        throw new Error(data.error || 'Failed to load contractor');
      }
    } catch (error) {
      console.error('Error loading contractor:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load available time slots when date is selected
  useEffect(() => {
    if (selectedDate && availabilityData.length > 0) {
      loadAvailableTimeSlots(selectedDate);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate, availabilityData]);

  const loadAvailableTimeSlots = async (date: string) => {
    // Find availability entry for selected date
    // The API returns dates as ISO strings, so we need to normalize for comparison
    const availEntry = availabilityData.find(
      (a: any) => {
        const apiDate = typeof a.date === 'string' ? a.date.split('T')[0] : a.date;
        return apiDate === date && a.isAvailable && a.availableSlots > 0;
      }
    );

    if (!availEntry || !contractor) {
      setAvailableTimeSlots([]);
      return;
    }

    // Generate hourly time slots based on start and end time
    const startHour = parseInt(availEntry.startTime?.split(':')[0] || '8');
    const endHour = parseInt(availEntry.endTime?.split(':')[0] || '17');
    const potentialSlots: Array<{ time24: string; time12: string }> = [];

    for (let hour = startHour; hour < endHour && hour < 17; hour++) {
      potentialSlots.push({
        time24: `${hour.toString().padStart(2, '0')}:00`,
        time12: hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`
      });
    }

    // Check all time slots in a single batch request
    try {
      const response = await fetch(`${API_BASE_URL}/time-slots/check-availability-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: contractor.id,
          date: date,
          timeSlots: potentialSlots.map(s => s.time24),
          durationMinutes: 90 // Default duration for checking availability
        })
      });

      const data = await response.json();

      if (data.success && data.results) {
        // Filter available slots and convert to 12-hour format
        const availableSlots = data.results
          .filter((result: any) => result.isAvailable)
          .map((result: any) => {
            const slot = potentialSlots.find(s => s.time24 === result.startTime);
            return slot?.time12;
          })
          .filter(Boolean);

        setAvailableTimeSlots(availableSlots);
      } else {
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      setAvailableTimeSlots([]);
    }
  };

  const convertTo24Hour = (time12: string): string => {
    const [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
      const service = contractor.services?.find((s: any) => s.service.name === selectedService);
      if (!service) {
        throw new Error('Service not found');
      }

      // Convert time to 24-hour format for backend
      const time24 = convertTo24Hour(selectedTime);

      // Submit booking to backend
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractorId: contractor.id,
          clientId: user.id,
          serviceId: service.service.id,
          serviceAddress: serviceAddress,
          scheduledDate: selectedDate,
          scheduledTime: time24,
          price: null
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Booking request submitted successfully!\n\nService: ${selectedService}\nDate: ${selectedDate}\nTime: ${selectedTime}\n\nThe contractor will confirm your booking soon.`);

        // Refresh available time slots for this date to reflect the new booking
        await loadAvailableTimeSlots(selectedDate);

        // Reset form
        setShowBookingModal(false);
        setSelectedService('');
        setSelectedDate('');
        setSelectedTime('');
        setServiceAddress('');
        setBookingNotes('');
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
    let times = availableTimeSlots.length > 0 ? availableTimeSlots : [
      '8:00 AM',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM'
    ];

    // If selected date is today, filter out past times
    if (selectedDate === getLocalDateString()) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      times = times.filter(timeStr => {
        // Parse time like "8:00 AM" or "1:00 PM"
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return true;

        let hour = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();

        // Convert to 24-hour format
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        // Compare with current time (allow booking if at least in the current hour)
        if (hour < currentHour) return false;
        if (hour === currentHour && minutes <= currentMinutes) return false;
        return true;
      });
    }

    return times;
  };

  // Check if a specific date has availability
  const isDateAvailable = (dateString: string) => {
    const availEntry = availabilityData.find(
      (a: any) => {
        const apiDate = typeof a.date === 'string' ? a.date.split('T')[0] : a.date;
        const matches = apiDate === dateString && a.isAvailable && a.availableSlots > 0;
        return matches;
      }
    );
    return !!availEntry;
  };

  // Get next 30 days for calendar display with proper day-of-week alignment
  const getNext30Days = () => {
    const days = [];
    const today = new Date();

    // Use local date components to avoid timezone issues
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    // Get the first date
    const firstDate = new Date(year, month, day);
    const firstDayOfWeek = firstDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Add empty padding cells for days before the first date to align with correct day of week
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        date: '',
        dayName: '',
        dayNumber: null,
        available: false,
        isEmpty: true
      });
    }

    // Add actual dates
    for (let i = 0; i < 30; i++) {
      const date = new Date(year, month, day + i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      days.push({
        date: dateString,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        available: isDateAvailable(dateString),
        isEmpty: false
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
              {contractor.services?.map((cs: any) => (
                <option key={cs.service.id} value={cs.service.name}>
                  {cs.service.name}
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
              min={getLocalDateString()}
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

              </div>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}>
                {/* Jobs Completed */}
                {contractor.trustSignals?.jobsCompleted > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={20} color="#10b981" />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1e293b'
                    }}>
                      {contractor.trustSignals.jobsCompleted} jobs completed
                    </span>
                  </div>
                )}

                {/* Years in Business */}
                {contractor.yearsInBusiness && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b'
                  }}>
                    <Shield size={18} />
                    <span style={{ fontSize: '16px' }}>
                      {contractor.yearsInBusiness} years in business
                    </span>
                  </div>
                )}

                {/* Response Time */}
                {contractor.trustSignals?.avgResponseHours !== null && contractor.trustSignals?.avgResponseHours !== undefined && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b'
                  }}>
                    <Clock size={18} />
                    <span style={{ fontSize: '16px' }}>
                      Responds in {contractor.trustSignals.avgResponseHours < 1 ? '<1 hour' : `${contractor.trustSignals.avgResponseHours} hours`}
                    </span>
                  </div>
                )}

                {/* Last Booked */}
                {contractor.trustSignals?.lastBookedAt && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#64748b'
                  }}>
                    <Calendar size={18} />
                    <span style={{ fontSize: '16px' }}>
                      Last booked {new Date(contractor.trustSignals.lastBookedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}>
                {contractor.trustSignals?.licensed && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <CheckCircle size={16} />
                    Licensed
                  </div>
                )}
                {contractor.trustSignals?.insured && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <Shield size={16} />
                    Insured
                  </div>
                )}
                {contractor.trustSignals?.afterHoursAvailable && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <Clock size={16} />
                    After-Hours
                  </div>
                )}
                {contractor.trustSignals?.isJustJoined && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <Star size={16} />
                    Just Joined
                  </div>
                )}
                {contractor.trustSignals?.isRisingStar && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#fce7f3',
                    color: '#9f1239',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <Award size={16} />
                    Rising Star
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

                <button
                  onClick={() => contractor.googleBusinessUrl && window.open(contractor.googleBusinessUrl, '_blank')}
                  disabled={!contractor.googleBusinessUrl}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: contractor.googleBusinessUrl ? 'white' : '#f8fafc',
                    color: contractor.googleBusinessUrl ? '#1e293b' : '#94a3b8',
                    border: `2px solid ${contractor.googleBusinessUrl ? '#e2e8f0' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: contractor.googleBusinessUrl ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: contractor.googleBusinessUrl ? 1 : 0.6
                  }}
                  title={contractor.googleBusinessUrl ? 'View Google Reviews' : 'Google Reviews not available'}
                >
                  <ExternalLink size={18} />
                  Google Reviews
                </button>
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
                {contractor.description || 'No description provided.'}
              </p>
            </div>

            {/* Services Offered */}
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
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Briefcase size={24} color="#667eea" />
                Services Offered
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {contractor.services?.map((cs: any) => (
                  <div
                    key={cs.service.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1e293b',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {cs.service.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Job Photos Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <ImageIcon size={24} color="#667eea" />
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Previous Work
                </h2>
              </div>

              {jobPhotos.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {jobPhotos.map((photo: any) => (
                    <div
                      key={photo.id}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.originalName || 'Job photo'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: '#94a3b8'
                }}>
                  <ImageIcon size={48} style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    No photos available yet
                  </p>
                </div>
              )}
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
                {(() => {
                  const allDays = getNext30Days();
                  // Count empty padding cells at the start
                  const paddingCount = allDays.filter(d => d.isEmpty).length;
                  // Show 14 actual dates plus the padding
                  return allDays.slice(0, 14 + paddingCount).map((day, index) => {
                    if (day.isEmpty) {
                      return <div key={`empty-${index}`} />;
                    }

                    const isToday = day.date === getLocalDateString();

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
                  });
                })()}
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
                {contractor.trustSignals && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <CheckCircle size={20} color="#64748b" />
                    <div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}>
                        {contractor.trustSignals.jobsCompleted || 0}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        Jobs Completed
                      </div>
                    </div>
                  </div>
                )}

                {contractor.trustSignals?.avgResponseHours !== null && contractor.trustSignals?.avgResponseHours !== undefined && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Clock size={20} color="#64748b" />
                    <div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}>
                        {contractor.trustSignals.avgResponseHours < 1 ? '<1' : contractor.trustSignals.avgResponseHours}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        Hour Response
                      </div>
                    </div>
                  </div>
                )}

                {contractor.yearsInBusiness && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Shield size={20} color="#64748b" />
                    <div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}>
                        {contractor.yearsInBusiness}
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
