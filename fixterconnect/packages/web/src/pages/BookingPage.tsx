import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  Award,
  Clock,
  User,
  Mail,
  Lock,
  Phone,
  ChevronLeft,
  X
} from 'react-feather';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

// Helper to get local date string in YYYY-MM-DD format
const getLocalDateString = (date: Date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

interface BookingPageData {
  contractor: {
    id: string;
    businessName: string;
    firstName: string;
    lastName: string;
    profilePhoto: string | null;
    bio: string;
    avgRating: number;
    totalReviews: number;
    yearsExperience: number;
    services: Array<{
      id: string;
      name: string;
      description: string;
      basePrice: number;
    }>;
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: string;
      client: {
        firstName: string;
        lastName: string;
      };
    }>;
  };
  settings: {
    primaryColor: string | null;
    accentColor: string | null;
    tagline: string | null;
    logo: string | null;
    showReviews: boolean;
    showPrices: boolean;
  };
}

const BookingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, userType, login } = useAuth();

  const [pageData, setPageData] = useState<BookingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [serviceAddress, setServiceAddress] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [availabilityData, setAvailabilityData] = useState<any[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Inline auth form state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Get colors with fallbacks
  const primaryColor = pageData?.settings.primaryColor || '#3b82f6';
  const accentColor = pageData?.settings.accentColor || '#10b981';

  useEffect(() => {
    loadBookingPage();
  }, [slug]);

  const loadBookingPage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/booking-page/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Booking page not found');
        } else {
          setError('Failed to load booking page');
        }
        return;
      }

      const data = await response.json();
      if (data.success) {
        setPageData(data.data);

        // Load availability
        const contractorId = data.data.contractor.id;
        const startDate = getLocalDateString();
        const endDateObj = new Date();
        endDateObj.setDate(endDateObj.getDate() + 30);
        const endDate = getLocalDateString(endDateObj);

        const availResponse = await fetch(
          `${API_BASE_URL}/booking-page/${slug}/availability?startDate=${startDate}&endDate=${endDate}`
        );

        if (availResponse.ok) {
          const availData = await availResponse.json();
          if (availData.success) {
            setAvailabilityData(availData.availabilities || []);
          }
        }
      } else {
        setError(data.error || 'Failed to load booking page');
      }
    } catch (err) {
      console.error('Error loading booking page:', err);
      setError('An error occurred while loading the booking page');
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
    const availEntry = availabilityData.find((a: any) => {
      const apiDate = typeof a.date === 'string' ? a.date.split('T')[0] : a.date;
      return apiDate === date && a.isAvailable && a.availableSlots > 0;
    });

    if (!availEntry || !pageData) {
      setAvailableTimeSlots([]);
      return;
    }

    const startHour = parseInt(availEntry.startTime?.split(':')[0] || '8');
    const endHour = parseInt(availEntry.endTime?.split(':')[0] || '17');
    const slots: string[] = [];

    for (let hour = startHour; hour < endHour && hour < 17; hour++) {
      const time24 = `${hour.toString().padStart(2, '0')}:00`;
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${time24} (${hour12}:00 ${ampm})`);
    }

    setAvailableTimeSlots(slots);
  };

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowBookingModal(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (authPassword !== authConfirmPassword) {
          setAuthError('Passwords do not match');
          setIsAuthLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authEmail,
            password: authPassword,
            firstName: authFirstName,
            lastName: authLastName,
            phone: authPhone,
            username: authUsername,
            userType: 'client'
          })
        });

        const data = await response.json();
        if (data.success) {
          await login(authEmail, authPassword);
          setAuthSuccess(true);
        } else {
          setAuthError(data.error || 'Registration failed');
        }
      } else {
        await login(authEmail, authPassword);
        setAuthSuccess(true);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      const time = selectedTime.split(' ')[0]; // Extract HH:MM from "HH:MM (12h format)"

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contractorId: pageData.contractor.id,
          serviceId: selectedService,
          scheduledDate: selectedDate,
          scheduledTime: time,
          address: serviceAddress,
          notes: bookingNotes
        })
      });

      const data = await response.json();
      if (data.success) {
        setBookingSuccess(true);
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('An error occurred while creating the booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableDates = () => {
    return availabilityData
      .filter((a: any) => a.isAvailable && a.availableSlots > 0)
      .map((a: any) => {
        const date = typeof a.date === 'string' ? a.date.split('T')[0] : a.date;
        return date;
      })
      .sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking page...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "This booking page doesn't exist or has been disabled."}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const { contractor, settings } = pageData;
  const displayName = contractor.businessName || `${contractor.firstName} ${contractor.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Header */}
      <header
        className="py-6 px-4"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {settings.logo ? (
            <img
              src={settings.logo}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
            />
          ) : contractor.profilePhoto ? (
            <img
              src={contractor.profilePhoto}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="text-white">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {settings.tagline && (
              <p className="text-white/90">{settings.tagline}</p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {settings.showReviews && (
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-xl font-bold text-gray-900">
                  {contractor.avgRating?.toFixed(1) || 'New'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{contractor.totalReviews} reviews</p>
            </div>
          )}
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-5 h-5" style={{ color: primaryColor }} />
              <span className="text-xl font-bold text-gray-900">{contractor.yearsExperience || 0}</span>
            </div>
            <p className="text-sm text-gray-500">Years Experience</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <p className="text-sm text-gray-500">Verified Pro</p>
          </div>
        </div>

        {/* About */}
        {contractor.bio && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600">{contractor.bio}</p>
          </div>
        )}

        {/* Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Services</h2>
          <div className="space-y-4">
            {contractor.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                  )}
                  {settings.showPrices && service.basePrice > 0 && (
                    <p className="text-sm font-medium mt-1" style={{ color: primaryColor }}>
                      Starting at ${service.basePrice}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleBookService(service.id)}
                  className="px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        {settings.showReviews && contractor.reviews.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Reviews ({contractor.totalReviews})
            </h2>
            <div className="space-y-4">
              {contractor.reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.client.firstName} {review.client.lastName.charAt(0)}.
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Book Service</h2>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingSuccess(false);
                    setAuthSuccess(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <CheckCircle className="w-8 h-8" style={{ color: accentColor }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600 mb-6">
                    Your appointment has been scheduled. You'll receive a confirmation soon.
                  </p>
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setBookingSuccess(false);
                      setSelectedService('');
                      setSelectedDate('');
                      setSelectedTime('');
                      setServiceAddress('');
                      setBookingNotes('');
                    }}
                    className="px-6 py-2 text-white rounded-lg font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Done
                  </button>
                </div>
              ) : !user || userType !== 'client' ? (
                // Auth Form
                <div>
                  <p className="text-gray-600 mb-4">
                    Please {authMode === 'login' ? 'sign in' : 'create an account'} to book this service.
                  </p>

                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        authMode === 'login'
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      style={authMode === 'login' ? { backgroundColor: primaryColor } : {}}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        authMode === 'signup'
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      style={authMode === 'signup' ? { backgroundColor: primaryColor } : {}}
                    >
                      Sign Up
                    </button>
                  </div>

                  {authError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === 'signup' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={authFirstName}
                                onChange={(e) => setAuthFirstName(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                              type="text"
                              value={authLastName}
                              onChange={(e) => setAuthLastName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <input
                            type="text"
                            value={authUsername}
                            onChange={(e) => setAuthUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              value={authPhone}
                              onChange={(e) => setAuthPhone(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="password"
                            value={authConfirmPassword}
                            onChange={(e) => setAuthConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {isAuthLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                  </form>
                </div>
              ) : (
                // Booking Form
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a service</option>
                      {contractor.services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} {settings.showPrices && service.basePrice > 0 ? `- $${service.basePrice}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline-block mr-1" />
                      Date
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a date</option>
                      {getAvailableDates().map((date) => {
                        const dateObj = new Date(date + 'T12:00:00');
                        return (
                          <option key={date} value={date}>
                            {dateObj.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock className="w-4 h-4 inline-block mr-1" />
                        Time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a time</option>
                        {availableTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot.split(' ')[1].replace('(', '').replace(')', '')}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="w-4 h-4 inline-block mr-1" />
                      Service Address
                    </label>
                    <input
                      type="text"
                      value={serviceAddress}
                      onChange={(e) => setServiceAddress(e.target.value)}
                      placeholder="Enter your address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Any special instructions or details..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedService || !selectedDate || !selectedTime || !serviceAddress}
                    className="w-full py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-sm text-gray-500 border-t border-gray-200 bg-white mt-8">
        <p>Powered by <a href="/" className="hover:underline" style={{ color: primaryColor }}>FixterConnect</a></p>
      </footer>
    </div>
  );
};

export default BookingPage;
