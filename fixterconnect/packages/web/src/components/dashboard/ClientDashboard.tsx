import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiClient } from '@fixterconnect/core';
import { API_BASE_URL } from '../../config/api';
import {
  Calendar,
  MessageSquare,
  User,
  Star,
  MapPin,
  DollarSign,
  Clock,
  X,
  Mail,
  Phone,
  Home,
  CreditCard,
  Flag,
  AlertTriangle
} from 'react-feather';
import StripePaymentModal from '../payment/StripePaymentModal';

type ActiveSection = 'services' | 'messages' | 'profile' | 'favorites' | 'invoices';
type ServicesTab = 'upcoming' | 'history' | 'quotes';

const ClientDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('services');
  const [servicesTab, setServicesTab] = useState<ServicesTab>('upcoming');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Flag Message state
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [messageToFlag, setMessageToFlag] = useState<any>(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagDetails, setFlagDetails] = useState('');

  // Messages state
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  // API client
  const apiClient = new ApiClient(API_BASE_URL);

  // Real data from API
  const [conversations, setConversations] = useState<any[]>([]);
  const [upcomingServices, setUpcomingServices] = useState<any[]>([]);
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [favoriteContractors, setFavoriteContractors] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchClientData();
    }
  }, [user]);


  const fetchClientData = async () => {
    try {
      setLoading(true);

      // Fetch conversations
      const messagesResponse = await fetch(`${API_BASE_URL}/messages/client/${user.id}`);
      const messagesData = await messagesResponse.json();

      if (messagesData.success) {
        // Transform messages to match the UI format
        const transformedConversations = messagesData.messages.map((msg: any) => ({
          id: msg.id,
          contractorId: msg.contractor.id,
          contractorName: msg.contractor.name,
          lastMessage: msg.chatMessages[0]?.messageText || 'No messages yet',
          timestamp: formatTimestamp(msg.updatedAt),
          unread: msg.status === 'UNREAD',
          messages: [] // Will be loaded when conversation is opened
        }));
        setConversations(transformedConversations);
      }

      // Fetch bookings
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/client/${user.id}`);
      const bookingsData = await bookingsResponse.json();

      if (bookingsData.success) {
        // Separate quotes (PENDING with price), upcoming, and history
        const now = new Date();

        // Quotes are PENDING bookings with a price set by contractor
        const quotes = bookingsData.bookings.filter((b: any) =>
          b.status === 'PENDING' && b.price !== null
        ).map(transformBooking);

        // Upcoming are confirmed future bookings (not quotes)
        const upcoming = bookingsData.bookings.filter((b: any) =>
          parseScheduledDate(b.scheduledDate) >= now &&
          b.status !== 'COMPLETED' &&
          b.status !== 'CANCELLED' &&
          !(b.status === 'PENDING' && b.price !== null) // Exclude quotes
        ).map(transformBooking);

        // History includes completed and past bookings
        const history = bookingsData.bookings.filter((b: any) =>
          parseScheduledDate(b.scheduledDate) < now ||
          b.status === 'COMPLETED' ||
          b.status === 'CANCELLED'
        ).map(transformBooking);

        setPendingQuotes(quotes);
        setUpcomingServices(upcoming);
        setServiceHistory(history);
      }

      // Fetch favorites
      const favoritesResponse = await fetch(`${API_BASE_URL}/favorites/client/${user.id}`);
      const favoritesData = await favoritesResponse.json();

      if (favoritesData.success) {
        setFavoriteContractors(favoritesData.favorites);
      }

      // Fetch profile
      const profileResponse = await fetch(`${API_BASE_URL}/client/${user.id}`);
      const profileData = await profileResponse.json();

      if (profileData.success) {
        setProfile({
          firstName: profileData.client.firstName,
          lastName: profileData.client.lastName,
          email: profileData.client.email,
          phone: profileData.client.phone,
          address: {
            street: profileData.client.address || '',
            city: profileData.client.city || '',
            state: profileData.client.state || '',
            zip: profileData.client.zip || ''
          },
          notifications: {
            email: profileData.client.notificationEmail,
            sms: profileData.client.notificationSms
          }
        });
      }

      // Fetch invoices
      const invoicesResponse = await fetch(`${API_BASE_URL}/invoices/client/${user.id}`);
      const invoicesData = await invoicesResponse.json();

      if (invoicesData.success) {
        setInvoices(invoicesData.invoices);
      }

    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse date without timezone shift
  const parseScheduledDate = (scheduledDate: any): Date => {
    const dateStr = typeof scheduledDate === 'string'
      ? scheduledDate.split('T')[0]
      : scheduledDate;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper to format time to 12-hour format
  const formatTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Format scheduled time (handles both single time and time range)
  const formatScheduledTime = (scheduledTime: string) => {
    if (!scheduledTime) return '';

    // Check if it's a time range (e.g., "13:00 - 14:30")
    if (scheduledTime.includes(' - ')) {
      const [start, end] = scheduledTime.split(' - ');
      return `${formatTo12Hour(start)} - ${formatTo12Hour(end)}`;
    }

    // Single time
    return formatTo12Hour(scheduledTime);
  };

  const transformBooking = (booking: any) => {
    const date = parseScheduledDate(booking.scheduledDate);

    return {
      id: booking.id,
      service: booking.service.name,
      provider: booking.contractor.name,
      providerId: booking.contractor.id,
      date: date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      }),
      time: formatScheduledTime(booking.scheduledTime),
      address: booking.serviceAddress,
      price: booking.price || 0,
      status: booking.status,
      rating: 0, // Will be from reviews when implemented
      paymentStatus: booking.paymentReceived ? 'paid' : 'pending'
    };
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleAddToFavorites = async (contractorId: number, contractorName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: user.id,
          contractorId
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Added ${contractorName} to your favorites!`);
        // Refresh favorites list
        const favoritesResponse = await fetch(`${API_BASE_URL}/favorites/client/${user.id}`);
        const favoritesData = await favoritesResponse.json();
        if (favoritesData.success) {
          setFavoriteContractors(favoritesData.favorites);
        }
      } else {
        alert(data.error || 'Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      const response = await fetch(`${API_BASE_URL}/client/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          address: profile.address.street,
          city: profile.address.city,
          state: profile.address.state,
          zip: profile.address.zip,
          notificationEmail: profile.notifications.email,
          notificationSms: profile.notifications.sms
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Profile updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const menuItems = [
    { id: 'services' as ActiveSection, label: 'My Services & Requests', icon: Calendar },
    { id: 'invoices' as ActiveSection, label: 'Invoices & Payments', icon: CreditCard },
    { id: 'messages' as ActiveSection, label: 'Messages', icon: MessageSquare },
    { id: 'profile' as ActiveSection, label: 'Profile & Preferences', icon: User },
    { id: 'favorites' as ActiveSection, label: 'Favorite Contractors', icon: Star }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'COMPLETED':
        return '#3b82f6';
      default:
        return '#94a3b8';
    }
  };

  const renderServiceCard = (service: any, showActions: 'upcoming' | 'history') => (
    <div
      key={service.id}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1e293b',
          margin: 0
        }}>
          {service.service}
        </h3>
        <div style={{
          padding: '6px 12px',
          backgroundColor: `${getStatusColor(service.status)}15`,
          color: getStatusColor(service.status),
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          {service.status}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
          <User size={16} />
          <span style={{ fontSize: '15px' }}>
            <strong style={{ color: '#1e293b' }}>Provider:</strong> {service.provider}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
          <Calendar size={16} />
          <span style={{ fontSize: '15px' }}>
            <strong style={{ color: '#1e293b' }}>Date:</strong> {service.date}{service.time ? ` at ${service.time}` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
          <MapPin size={16} />
          <span style={{ fontSize: '15px' }}>
            <strong style={{ color: '#1e293b' }}>Address:</strong> {service.address}
          </span>
        </div>
        {service.price && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
            <DollarSign size={16} />
            <span style={{ fontSize: '15px' }}>
              <strong style={{ color: '#1e293b' }}>Price:</strong> ${service.price}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => {
            setSelectedService(service);
            setShowDetailsModal(true);
          }}
          style={{
            padding: '12px 20px',
            backgroundColor: 'white',
            color: '#1e293b',
            border: '2px solid #1e293b',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          VIEW DETAILS
        </button>
        {showActions === 'upcoming' && (
          <button
            style={{
              padding: '12px 20px',
              backgroundColor: 'white',
              color: '#1e293b',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Calendar size={16} />
            ADD TO CALENDAR
          </button>
        )}
        {showActions === 'history' && (
          <>
            <button
              onClick={() => handleAddToFavorites(service.providerId, service.provider)}
              style={{
                padding: '12px 20px',
                backgroundColor: 'white',
                color: '#1e293b',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Star size={16} />
              ADD TO FAVORITES
            </button>
            {service.invoice && (
              <button
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                DOWNLOAD INVOICE
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderServicesSection = () => (
    <div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '24px'
      }}>
        My Services & Requests
      </h2>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0',
        marginBottom: '32px',
        borderBottom: '2px solid #e2e8f0'
      }}>
        {[
          { id: 'upcoming' as ServicesTab, label: 'Upcoming' },
          { id: 'history' as ServicesTab, label: 'History' },
          { id: 'quotes' as ServicesTab, label: 'Quote Requests' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setServicesTab(tab.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: servicesTab === tab.id ? '#3b82f6' : '#64748b',
              border: 'none',
              borderBottom: servicesTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <Clock size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', color: '#94a3b8' }}>
            Loading your services...
          </p>
        </div>
      )}

      {/* Tab Content */}
      {!loading && servicesTab === 'upcoming' && (
        <div>
          {upcomingServices.length > 0 ? (
            upcomingServices.map(service => renderServiceCard(service, 'upcoming'))
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <Calendar size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', color: '#94a3b8' }}>
                No upcoming services scheduled
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && servicesTab === 'history' && (
        <div>
          {serviceHistory.length > 0 ? (
            serviceHistory.map(service => renderServiceCard(service, 'history'))
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <Calendar size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', color: '#94a3b8' }}>
                No service history yet
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && servicesTab === 'quotes' && (
        <div>
          {pendingQuotes.length > 0 ? (
            pendingQuotes.map(quote => (
              <div
                key={quote.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '16px',
                  border: '2px solid #fbbf24',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                      {quote.service}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                      <strong>Contractor:</strong> {quote.contractor}
                    </p>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                      <strong>Scheduled:</strong> {quote.date} at {quote.time}
                    </p>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>
                      <strong>Location:</strong> {quote.location}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    QUOTE RECEIVED
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Quoted Price:</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      ${quote.price?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleAcceptQuote(quote)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Accept Quote
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(quote);
                      setShowDetailsModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <Calendar size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', color: '#94a3b8' }}>
                No pending quotes yet
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '8px'
      }}>
        My Favorite Contractors
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#64748b',
        marginBottom: '32px'
      }}>
        Quick access to your preferred service providers
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {favoriteContractors.map(contractor => (
          <div
            key={contractor.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {/* TODO: Replace with actual profile picture when contractor uploads one */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* TODO: Uncomment when contractor.profilePicture is available from API */}
                {/* {contractor.profilePicture ? (
                  <img
                    src={contractor.profilePicture}
                    alt={contractor.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : ( */}
                  <User size={32} color="white" />
                {/* )} */}
              </div>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {contractor.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#f59e0b',
                  marginTop: '4px'
                }}>
                  <Star size={16} fill="#f59e0b" />
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>
                    {contractor.rating}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Services:
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {contractor.services.map((service, idx) => (
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
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                REQUEST SERVICE
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '2px solid #1e293b',
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
                <MessageSquare size={16} />
                MESSAGE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!profile) {
      return (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <Clock size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', color: '#94a3b8' }}>
            Loading profile...
          </p>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: '800px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '32px'
        }}>
          Profile & Preferences
        </h2>

        {/* Name Fields */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '8px'
            }}>
              First Name
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#64748b',
          marginBottom: '8px'
        }}>
          Email Address
        </label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#64748b',
          marginBottom: '8px'
        }}>
          Phone Number
        </label>
        <input
          type="tel"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Default Service Address */}
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '16px'
      }}>
        Default Service Address
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#64748b',
          marginBottom: '8px'
        }}>
          Street Address
        </label>
        <input
          type="text"
          value={profile.address.street}
          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 1fr',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            City
          </label>
          <input
            type="text"
            value={profile.address.city}
            onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            State
          </label>
          <input
            type="text"
            value={profile.address.state}
            onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            ZIP Code
          </label>
          <input
            type="text"
            value={profile.address.zip}
            onChange={(e) => setProfile({ ...profile, address: { ...profile.address, zip: e.target.value } })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
      </div>

      {/* Notification Preferences */}
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '16px'
      }}>
        Notification Preferences
      </h3>

      <div style={{
        display: 'flex',
        gap: '48px',
        marginBottom: '32px'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={profile.notifications.email}
            onChange={(e) => setProfile({ ...profile, notifications: { ...profile.notifications, email: e.target.checked } })}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer'
            }}
          />
          <span style={{
            fontSize: '16px',
            color: '#1e293b',
            fontWeight: '500'
          }}>
            Email notifications
          </span>
        </label>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={profile.notifications.sms}
            onChange={(e) => setProfile({ ...profile, notifications: { ...profile.notifications, sms: e.target.checked } })}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer'
            }}
          />
          <span style={{
            fontSize: '16px',
            color: '#1e293b',
            fontWeight: '500'
          }}>
            SMS notifications
          </span>
        </label>
      </div>

      <button
        onClick={handleSaveProfile}
        style={{
          padding: '14px 32px',
          backgroundColor: '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        SAVE CHANGES
      </button>
    </div>
  );
  };

  const handleAcceptQuote = async (quote: any) => {
    if (!quote) return;

    try {
      // Update booking status to CONFIRMED
      const response = await fetch(`${API_BASE_URL}/bookings/${quote.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'CONFIRMED' })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Quote accepted! Booking confirmed with ${quote.contractor} for $${quote.price}.`);

        // Refresh data to update the UI
        await fetchClientData();
      } else {
        alert('Failed to accept quote. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert('An error occurred while accepting the quote.');
    }
  };

  const handleFlagMessage = (message: any) => {
    setMessageToFlag(message);
    setShowFlagModal(true);
  };

  const handleSubmitFlag = async () => {
    if (!flagReason || !messageToFlag || !user) {
      alert('Please select a reason for flagging this message');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/flag-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: null, // We could add message ID tracking if needed
          messageText: messageToFlag.text,
          flaggedBy: 'CLIENT',
          flaggedById: user.id,
          contractorId: selectedConversation?.contractorId || null,
          clientId: user.id,
          reason: flagReason,
          details: flagDetails || null
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Message flagged successfully!\n\nReason: ${flagReason}\n\nAn admin will review this message.`);

        // Reset state
        setShowFlagModal(false);
        setMessageToFlag(null);
        setFlagReason('');
        setFlagDetails('');
      } else {
        throw new Error(data.error || 'Failed to flag message');
      }
    } catch (error) {
      console.error('Error flagging message:', error);
      alert('Failed to flag message. Please try again.');
    }
  };

  const handleMessageProvider = async (service: any) => {
    try {
      // Check if there's already a conversation with this contractor
      const existingConversation = conversations.find(
        conv => conv.contractorId === service.providerId
      );

      if (existingConversation) {
        // Open existing conversation
        await handleOpenChat(existingConversation);
      } else {
        // Create new message thread
        const response = await fetch(`${API_BASE_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contractorId: service.providerId,
            clientId: user?.id,
            subject: `Inquiry about ${service.service}`
          })
        });

        const data = await response.json();

        if (data.success) {
          // Open the newly created conversation
          const newConversation = {
            id: data.message.id,
            contractorId: service.providerId,
            contractorName: service.provider,
            lastMessage: '',
            timestamp: 'Just now',
            unread: false,
            messages: []
          };

          setConversations([...conversations, newConversation]);
          setSelectedConversation(newConversation);
          setShowChatModal(true);
        } else {
          console.error('Failed to create conversation:', data);
          alert('Failed to start conversation. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error messaging provider:', error);
      alert('An error occurred while trying to message the provider.');
    }
  };

  const handleOpenChat = async (conversation: any) => {
    try {
      // Fetch full conversation with all messages
      const response = await fetch(`${API_BASE_URL}/messages/${conversation.id}`);
      const data = await response.json();

      if (data.success) {
        // Transform chat messages to match UI format
        const transformedMessages = data.message.chatMessages.map((msg: any) => ({
          sender: msg.sender === 'CLIENT' ? 'client' : 'contractor',
          text: msg.messageText,
          time: new Date(msg.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          })
        }));

        const newConv = {
          ...conversation,
          messages: transformedMessages
        };

        // Use setTimeout to ensure state updates trigger re-render
        setTimeout(() => {
          setSelectedConversation(newConv);
          setShowChatModal(true);
        }, 0);

        // Mark conversation as read
        await fetch(`${API_BASE_URL}/messages/${conversation.id}/read`, {
          method: 'PATCH'
        });

        // Update the conversations list to mark this one as read
        setConversations(conversations.map(conv =>
          conv.id === conversation.id
            ? { ...conv, unread: false }
            : conv
        ));
      } else {
        console.error('API returned success: false', data);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const response = await fetch(`${API_BASE_URL}/messages/${selectedConversation.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: 'CLIENT',
          messageText: messageText.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add message to conversation
        const newMessage = {
          sender: 'client',
          text: messageText,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };

        setSelectedConversation({
          ...selectedConversation,
          messages: [...selectedConversation.messages, newMessage]
        });
        setMessageText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const renderMessages = () => (
    <div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '8px'
      }}>
        Messages
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#64748b',
        marginBottom: '32px'
      }}>
        Communicate with your service providers
      </p>

      <div style={{ display: 'grid', gap: '16px' }}>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleOpenChat(conversation)}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: conversation.unread ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {conversation.contractorName}
                  </h3>
                  {conversation.unread && (
                    <span style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%'
                    }}></span>
                  )}
                </div>
                <p style={{
                  fontSize: '15px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {conversation.lastMessage}
                </p>
              </div>
              <span style={{
                fontSize: '13px',
                color: '#94a3b8',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}>
                {conversation.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => {
    const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid');
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');

    return (
      <div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Invoices & Payments
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          marginBottom: '32px'
        }}>
          Manage your payments and view invoice history
        </p>

        {/* Unpaid Invoices */}
        {unpaidInvoices.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px'
            }}>
              Unpaid Invoices
            </h3>
            {unpaidInvoices.map(invoice => (
              <div
                key={invoice.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '16px',
                  border: '2px solid #fbbf24',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      {invoice.service}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      Invoice #{invoice.invoiceNumber}
                    </p>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    UNPAID
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '6px' }}>
                    <User size={16} />
                    <span style={{ fontSize: '15px' }}>
                      <strong style={{ color: '#1e293b' }}>Provider:</strong> {invoice.provider}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '6px' }}>
                    <Calendar size={16} />
                    <span style={{ fontSize: '15px' }}>
                      <strong style={{ color: '#1e293b' }}>Service Date:</strong> {invoice.date}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '6px' }}>
                    <Clock size={16} />
                    <span style={{ fontSize: '15px' }}>
                      <strong style={{ color: '#1e293b' }}>Due Date:</strong> {invoice.dueDate}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '15px',
                    color: '#475569',
                    marginTop: '12px',
                    marginBottom: 0
                  }}>
                    {invoice.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      Amount Due
                    </p>
                    <p style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      margin: 0
                    }}>
                      ${invoice.amount}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowPaymentModal(true);
                    }}
                    style={{
                      padding: '14px 32px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
                    }}
                  >
                    PAY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paid Invoices */}
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            Payment History
          </h3>
          {paidInvoices.length > 0 ? (
            paidInvoices.map(invoice => (
              <div
                key={invoice.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      {invoice.service}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0,
                      marginBottom: '8px'
                    }}>
                      Invoice #{invoice.invoiceNumber} • {invoice.provider}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#64748b' }}>
                      <span>Service: {invoice.date}</span>
                      <span>Paid: {invoice.paidDate}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        Amount Paid
                      </p>
                      <p style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#10b981',
                        margin: 0
                      }}>
                        ${invoice.amount}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        // TODO: Implement download invoice
                        alert(`Download invoice ${invoice.invoiceNumber}`);
                      }}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'white',
                        color: '#1e293b',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      DOWNLOAD
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <CreditCard size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', color: '#94a3b8' }}>
                No payment history yet
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'services':
        return renderServicesSection();
      case 'invoices':
        return renderInvoices();
      case 'favorites':
        return renderFavorites();
      case 'profile':
        return renderProfile();
      case 'messages':
        return renderMessages();
      default:
        return renderServicesSection();
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo/Title */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '32px'
        }}>
          Customer Dashboard
        </h1>

        {/* Menu Items */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  marginBottom: '8px',
                  backgroundColor: isActive ? '#6366f1' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Back to Home */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          ↑ Back to Home
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '40px',
        overflowY: 'auto'
      }}>
        {renderContent()}
      </div>

      {/* Service Details Modal */}
      {showDetailsModal && selectedService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowDetailsModal(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '4px'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              {selectedService.service}
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              marginBottom: '24px'
            }}>
              {selectedService.provider} - {selectedService.date}
            </p>

            <div style={{ marginBottom: '24px' }}>
              {selectedService.status && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Status: </span>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: `${getStatusColor(selectedService.status)}15`,
                    color: getStatusColor(selectedService.status),
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    {selectedService.status}
                  </span>
                </div>
              )}
              {selectedService.time && (
                <p style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Date & Time: </span>
                  {selectedService.date} at {selectedService.time}
                </p>
              )}
              <p style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Address: </span>
                {selectedService.address}
              </p>
              {selectedService.price && (
                <p style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Price: </span>
                  ${selectedService.price}
                </p>
              )}
            </div>

            {selectedService.notes && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  Notes
                </h4>
                <p style={{ color: '#64748b', fontSize: '15px' }}>
                  {selectedService.notes}
                </p>
              </div>
            )}

            {selectedService.workPerformed && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  Work Performed
                </h4>
                <p style={{ color: '#64748b', fontSize: '15px' }}>
                  {selectedService.workPerformed}
                </p>
              </div>
            )}

            {selectedService.status === 'COMPLETED' && (
              <>
                {(selectedService.beforePhotos || selectedService.afterPhotos) && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '12px'
                    }}>
                      Service Photos
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                          Before:
                        </p>
                        <div style={{
                          padding: '32px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          textAlign: 'center',
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}>
                          Photo placeholder
                        </div>
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                          After:
                        </p>
                        <div style={{
                          padding: '32px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          textAlign: 'center',
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}>
                          Photo placeholder
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => handleAddToFavorites(selectedService.providerId, selectedService.provider)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'white',
                      color: '#1e293b',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Star size={16} />
                    ADD TO FAVORITES
                  </button>
                  {selectedService.invoice && (
                    <button
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      DOWNLOAD INVOICE
                    </button>
                  )}
                  <button
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'white',
                      color: '#1e293b',
                      border: '2px solid #1e293b',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    LEAVE GOOGLE REVIEW
                  </button>
                </div>
              </>
            )}

            {selectedService.status !== 'COMPLETED' && (
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: '#1e293b',
                    border: '2px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  RESCHEDULE
                </button>
                <button
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: '#ef4444',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL SERVICE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedConversation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '600px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '4px'
                }}>
                  {selectedConversation.contractorName}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Conversation
                </p>
              </div>
              <button
                onClick={() => {
                  setShowChatModal(false);
                  setSelectedConversation(null);
                  setMessageText('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((msg: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'client' ? 'flex-end' : 'flex-start',
                      gap: '6px',
                      alignItems: 'flex-start'
                    }}
                  >
                    {msg.sender === 'contractor' && (
                      <button
                        onClick={() => handleFlagMessage(msg)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94a3b8',
                          padding: '2px',
                          marginTop: '4px'
                        }}
                        title="Flag message"
                      >
                        <Flag size={14} />
                      </button>
                    )}
                    <div style={{
                      maxWidth: '75%',
                      padding: '8px 12px',
                      borderRadius: '16px',
                      backgroundColor: msg.sender === 'client' ? '#3b82f6' : '#f1f5f9',
                      color: msg.sender === 'client' ? 'white' : '#1e293b'
                    }}>
                      <p style={{ fontSize: '14px', lineHeight: '1.4', margin: 0 }}>{msg.text}</p>
                      <p style={{
                        fontSize: '11px',
                        opacity: 0.6,
                        marginTop: '2px',
                        marginBottom: 0
                      }}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                  No messages yet. Start the conversation!
                </p>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: messageText.trim() ? '#3b82f6' : '#cbd5e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: messageText.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Message Modal */}
      {showFlagModal && messageToFlag && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '600px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <AlertTriangle size={24} color="#ef4444" />
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '4px'
                }}>
                  Flag Message
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setMessageToFlag(null);
                  setFlagReason('');
                  setFlagDetails('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Message Preview */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                Message from {selectedConversation?.contractorName}:
              </p>
              <p style={{
                fontSize: '14px',
                color: '#1e293b',
                fontStyle: 'italic',
                marginBottom: '4px'
              }}>
                "{messageToFlag.text}"
              </p>
              <p style={{
                fontSize: '12px',
                color: '#94a3b8'
              }}>
                {messageToFlag.time}
              </p>
            </div>

            {/* Reason Dropdown */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Reason for flagging <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select a reason...</option>
                <option value="Spam">Spam</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Harassment">Harassment</option>
                <option value="Scam/Fraud">Scam/Fraud</option>
                <option value="Offensive Language">Offensive Language</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Additional Details */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Additional details (optional)
              </label>
              <textarea
                value={flagDetails}
                onChange={(e) => setFlagDetails(e.target.value)}
                placeholder="Please provide any additional context that would help our team review this message..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '100px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Warning */}
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                fontSize: '13px',
                color: '#92400e',
                margin: 0
              }}>
                This message will be reviewed by our admin team. False reports may result in account restrictions.
              </p>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setMessageToFlag(null);
                  setFlagReason('');
                  setFlagDetails('');
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFlag}
                disabled={!flagReason}
                style={{
                  padding: '12px 24px',
                  backgroundColor: flagReason ? '#ef4444' : '#cbd5e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: flagReason ? 'pointer' : 'not-allowed'
                }}
              >
                Flag Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Payment Modal */}
      {showPaymentModal && (
        <StripePaymentModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          onSuccess={() => {
            // Refresh invoices and other data after successful payment
            fetchClientData();
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
