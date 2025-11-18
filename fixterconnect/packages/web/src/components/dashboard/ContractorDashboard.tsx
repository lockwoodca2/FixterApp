import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import {
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  DollarSign,
  Star,
  Settings,
  LogOut,
  MapPin,
  X,
  Flag,
  AlertTriangle
} from 'react-feather';

type ActiveSection = 'today' | 'messages' | 'invoices' | 'history' | 'calendar' | 'quotes' | 'reviews' | 'settings';

const ContractorDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('today');
  const [loading, setLoading] = useState(true);

  // Data states
  const [todaysJobs, setTodaysJobs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  // Edit mode states
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Schedule changes modal
  const [showScheduleChanges, setShowScheduleChanges] = useState(false);
  const [affectedAppointments, setAffectedAppointments] = useState<any[]>([]);
  const [pendingReorder, setPendingReorder] = useState<any[] | null>(null);

  // Calendar states
  const [calendarTab, setCalendarTab] = useState<'bookings' | 'schedule'>('bookings');
  const [calendarView, setCalendarView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyBookings, setMonthlyBookings] = useState<any[]>([]);
  const [selectedDateJobs, setSelectedDateJobs] = useState<any[]>([]);
  const [draggedCalendarIndex, setDraggedCalendarIndex] = useState<number | null>(null);

  // Schedule Manager states
  const [scheduleView, setScheduleView] = useState<'recurring' | 'calendar'>('calendar');
  const [weeklySchedule, setWeeklySchedule] = useState<any>({
    monday: { available: true, startTime: '08:00', startPeriod: 'AM', endTime: '05:00', endPeriod: 'PM', maxJobs: 6, serviceAreas: ['Nampa', 'Caldwell'] },
    tuesday: { available: true, startTime: '08:00', startPeriod: 'AM', endTime: '05:00', endPeriod: 'PM', maxJobs: 6, serviceAreas: ['Meridian', 'Kuna'] },
    wednesday: { available: true, startTime: '08:00', startPeriod: 'AM', endTime: '05:00', endPeriod: 'PM', maxJobs: 6, serviceAreas: [] },
    thursday: { available: true, startTime: '08:00', startPeriod: 'AM', endTime: '05:00', endPeriod: 'PM', maxJobs: 6, serviceAreas: [] },
    friday: { available: true, startTime: '08:00', startPeriod: 'AM', endTime: '05:00', endPeriod: 'PM', maxJobs: 6, serviceAreas: [] },
    saturday: { available: true, startTime: '08:00', startPeriod: 'AM', endTime: '05:00', endPeriod: 'PM', maxJobs: 4, serviceAreas: [] },
    sunday: { available: false, startTime: '08:00', startPeriod: 'AM', endTime: '05:00', endPeriod: 'PM', maxJobs: 0, serviceAreas: [] }
  });
  const serviceAreasList = ['Boise', 'Meridian', 'Nampa', 'Caldwell', 'Eagle', 'Kuna', 'Star', 'Garden City'];

  // Date Override states
  const [dateOverrides, setDateOverrides] = useState<any[]>([]);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideForm, setOverrideForm] = useState<any>({
    isDateRange: false,
    specificDate: '',
    startDate: '',
    endDate: '',
    isAvailable: true,
    startTime: '08:00',
    startPeriod: 'AM',
    endTime: '05:00',
    endPeriod: 'PM',
    maxJobs: 6,
    reason: ''
  });
  const [editingOverrideId, setEditingOverrideId] = useState<number | null>(null);

  // Calendar View states
  const [calendarViewMonth, setCalendarViewMonth] = useState(new Date());

  // Chat Modal states
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  // Flag Message states
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [messageToFlag, setMessageToFlag] = useState<any>(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagDetails, setFlagDetails] = useState('');

  // Settings states
  const [settingsTab, setSettingsTab] = useState<'profile' | 'services' | 'areas' | 'materials'>('profile');
  const [materials, setMaterials] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [contractorServices, setContractorServices] = useState<number[]>([]);
  const [contractorAreas, setContractorAreas] = useState<string[]>([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [materialForm, setMaterialForm] = useState({
    name: '',
    price: '',
    unit: 'each',
    description: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    yearsInBusiness: '',
    location: ''
  });
  const [newArea, setNewArea] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchContractorData();
    }
  }, [user]);

  const fetchContractorData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch today's jobs (bookings for today)
      const today = new Date().toISOString().split('T')[0];
      const todayJobsResponse = await fetch(`${API_BASE_URL}/bookings/contractor/${user.id}?date=${today}`);
      const todayJobsData = await todayJobsResponse.json();
      if (todayJobsData.success) {
        setTodaysJobs(todayJobsData.bookings);
      }

      // Fetch all bookings for history
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/contractor/${user.id}`);
      const bookingsData = await bookingsResponse.json();
      if (bookingsData.success) {
        // Filter for completed/past jobs
        const history = bookingsData.bookings.filter((b: any) =>
          b.status === 'COMPLETED' || b.status === 'CANCELLED'
        );
        setJobHistory(history);

        // Filter for pending quotes
        const pendingQuotes = bookingsData.bookings.filter((b: any) =>
          b.status === 'PENDING' && b.price === null
        );
        setQuotes(pendingQuotes);
      }

      // Fetch existing schedule
      try {
        const scheduleResponse = await fetch(`${API_BASE_URL}/availability/contractor/${user.id}/schedule`);
        const scheduleData = await scheduleResponse.json();

        if (scheduleData.success && scheduleData.schedule && scheduleData.schedule.length > 0) {
          // Convert API format to weeklySchedule state format
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const loadedSchedule: any = {};

          // Initialize all days with default unavailable state
          dayNames.forEach(day => {
            loadedSchedule[day] = {
              available: false,
              startTime: '08:00',
              startPeriod: 'AM',
              endTime: '05:00',
              endPeriod: 'PM',
              maxJobs: 6,
              serviceAreas: []
            };
          });

          // Load saved schedule data
          scheduleData.schedule.forEach((entry: any) => {
            const dayName = dayNames[entry.dayOfWeek];

            // Convert 24-hour time to 12-hour format
            const startHour = parseInt(entry.startTime.split(':')[0]);
            const startMin = entry.startTime.split(':')[1];
            let startHour12 = startHour;
            let startPeriod = 'AM';
            if (startHour === 0) {
              startHour12 = 12;
              startPeriod = 'AM';
            } else if (startHour === 12) {
              startHour12 = 12;
              startPeriod = 'PM';
            } else if (startHour > 12) {
              startHour12 = startHour - 12;
              startPeriod = 'PM';
            }

            const endHour = parseInt(entry.endTime.split(':')[0]);
            const endMin = entry.endTime.split(':')[1];
            let endHour12 = endHour;
            let endPeriod = 'AM';
            if (endHour === 0) {
              endHour12 = 12;
              endPeriod = 'AM';
            } else if (endHour === 12) {
              endHour12 = 12;
              endPeriod = 'PM';
            } else if (endHour > 12) {
              endHour12 = endHour - 12;
              endPeriod = 'PM';
            }

            loadedSchedule[dayName] = {
              available: entry.isAvailable,
              startTime: `${String(startHour12).padStart(2, '0')}:${startMin}`,
              startPeriod: startPeriod,
              endTime: `${String(endHour12).padStart(2, '0')}:${endMin}`,
              endPeriod: endPeriod,
              maxJobs: entry.maxBookings,
              serviceAreas: entry.serviceAreas || []
            };
          });

          setWeeklySchedule(loadedSchedule);
        }
      } catch (error) {
        console.error('Error loading schedule:', error);
        // Keep default schedule if loading fails
      }

      // Fetch date overrides (next 6 months)
      try {
        const today = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

        const overridesResponse = await fetch(
          `${API_BASE_URL}/availability/contractor/${user.id}/overrides?startDate=${today.toISOString().split('T')[0]}&endDate=${sixMonthsLater.toISOString().split('T')[0]}`
        );
        const overridesData = await overridesResponse.json();

        if (overridesData.success) {
          setDateOverrides(overridesData.overrides || []);
        }
      } catch (error) {
        console.error('Error loading date overrides:', error);
      }

      // Fetch messages
      const messagesResponse = await fetch(`${API_BASE_URL}/messages/contractor/${user.id}`);
      const messagesData = await messagesResponse.json();
      if (messagesData.success) {
        setMessages(messagesData.messages);
      }

      // Fetch invoices
      const invoicesResponse = await fetch(`${API_BASE_URL}/invoices/contractor/${user.id}`);
      const invoicesData = await invoicesResponse.json();
      if (invoicesData.success) {
        setInvoices(invoicesData.invoices);
      }

      // Fetch contractor profile
      const profileResponse = await fetch(`${API_BASE_URL}/contractor/${user.id}`);
      const profileData = await profileResponse.json();
      if (profileData.success) {
        setProfile(profileData.contractor);
      }

    } catch (error) {
      console.error('Error fetching contractor data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newJobs = [...todaysJobs];
    const draggedJob = newJobs[draggedIndex];
    newJobs.splice(draggedIndex, 1);
    newJobs.splice(dropIndex, 0, draggedJob);

    // Calculate affected appointments (those that will have time changes)
    const affected = calculateAffectedAppointments(todaysJobs, newJobs);

    if (affected.length > 0) {
      // Show confirmation modal
      setAffectedAppointments(affected);
      setPendingReorder(newJobs);
      setShowScheduleChanges(true);
    } else {
      // No changes, apply directly
      setTodaysJobs(newJobs);
    }

    setDraggedIndex(null);
  };

  const calculateAffectedAppointments = (oldJobs: any[], newJobs: any[]) => {
    const affected: any[] = [];
    const travelTime = 15; // 15 minutes travel time between appointments

    newJobs.forEach((job, index) => {
      if (index === 0) return; // First job time stays the same

      const prevJob = newJobs[index - 1];
      const oldJob = oldJobs.find(j => j.id === job.id);

      // Calculate new time based on previous job
      const prevEndTime = calculateJobEndTime(prevJob);
      const newStartTime = addMinutes(prevEndTime, travelTime);
      const newEndTime = addMinutes(newStartTime, parseInt(job.duration?.replace(' min', '') || '90'));

      // Check if time changed
      const oldStartTime = oldJob?.scheduledTime?.split(' - ')[0];
      if (oldStartTime !== formatTimeString(newStartTime)) {
        affected.push({
          ...job,
          previousTime: job.scheduledTime,
          newTime: `${formatTimeString(newStartTime)} - ${formatTimeString(newEndTime)}`
        });
      }
    });

    return affected;
  };

  const calculateJobEndTime = (job: any) => {
    const startTime = job.scheduledTime?.split(' - ')[0] || '9:00 AM';
    const duration = parseInt(job.duration?.replace(' min', '') || '90');
    return parseTimeString(startTime, duration);
  };

  const parseTimeString = (timeStr: string, addMinutes: number = 0) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = (period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours) * 60 + minutes + addMinutes;
    return totalMinutes;
  };

  const addMinutes = (totalMinutes: number, mins: number) => {
    return totalMinutes + mins;
  };

  const formatTimeString = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleAcceptScheduleChanges = (notifyCustomers: boolean) => {
    if (pendingReorder) {
      // Apply the new schedule with calculated times
      const updatedJobs = pendingReorder.map((job, index) => {
        if (index === 0) return job;

        const prevJob = pendingReorder[index - 1];
        const prevEndTime = calculateJobEndTime(prevJob);
        const newStartTime = addMinutes(prevEndTime, 15);
        const duration = parseInt(job.duration?.replace(' min', '') || '90');
        const newEndTime = addMinutes(newStartTime, duration);

        return {
          ...job,
          scheduledTime: `${formatTimeString(newStartTime)} - ${formatTimeString(newEndTime)}`
        };
      });

      setTodaysJobs(updatedJobs);

      if (notifyCustomers) {
        // TODO: Send notifications to affected customers
        console.log('Sending notifications to customers...');
      }
    }

    setShowScheduleChanges(false);
    setPendingReorder(null);
    setAffectedAppointments([]);
  };

  const handleCancelScheduleChanges = () => {
    setShowScheduleChanges(false);
    setPendingReorder(null);
    setAffectedAppointments([]);
  };

  // Calendar drag and drop handlers
  const handleCalendarDragStart = (index: number) => {
    setDraggedCalendarIndex(index);
  };

  const handleCalendarDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleCalendarDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedCalendarIndex === null || draggedCalendarIndex === dropIndex) return;

    const newJobs = [...selectedDateJobs];
    const draggedJob = newJobs[draggedCalendarIndex];
    newJobs.splice(draggedCalendarIndex, 1);
    newJobs.splice(dropIndex, 0, draggedJob);

    // Calculate affected appointments (those that will have time changes)
    const affected = calculateAffectedAppointments(selectedDateJobs, newJobs);

    if (affected.length > 0) {
      // Show confirmation modal
      setAffectedAppointments(affected);
      setPendingReorder(newJobs);
      setShowScheduleChanges(true);
    } else {
      // No changes, apply directly
      setSelectedDateJobs(newJobs);
      // Also update in monthlyBookings
      const updatedMonthly = monthlyBookings.map(job => {
        const updated = newJobs.find(j => j.id === job.id);
        return updated || job;
      });
      setMonthlyBookings(updatedMonthly);
    }

    setDraggedCalendarIndex(null);
  };

  const handleAcceptCalendarScheduleChanges = (notifyCustomers: boolean) => {
    if (pendingReorder) {
      // Apply the new schedule with calculated times
      const updatedJobs = pendingReorder.map((job, index) => {
        if (index === 0) return job;

        const prevJob = pendingReorder[index - 1];
        const prevEndTime = calculateJobEndTime(prevJob);
        const newStartTime = addMinutes(prevEndTime, 15);
        const duration = parseInt(job.duration?.replace(' min', '') || '90');
        const newEndTime = addMinutes(newStartTime, duration);

        return {
          ...job,
          scheduledTime: `${formatTimeString(newStartTime)} - ${formatTimeString(newEndTime)}`
        };
      });

      setSelectedDateJobs(updatedJobs);

      // Also update in monthlyBookings
      const updatedMonthly = monthlyBookings.map(job => {
        const updated = updatedJobs.find(j => j.id === job.id);
        return updated || job;
      });
      setMonthlyBookings(updatedMonthly);

      if (notifyCustomers) {
        // TODO: Send notifications to affected customers
        console.log('Sending notifications to customers...');
      }
    }

    setShowScheduleChanges(false);
    setPendingReorder(null);
    setAffectedAppointments([]);
  };

  // Edit handlers
  const handleEditJob = (job: any) => {
    setEditingJobId(job.id);
    setEditFormData({
      startTime: job.scheduledTime?.split(' - ')[0] || '',
      duration: job.duration || '90'
    });
  };

  const handleSaveEdit = async (jobId: number) => {
    try {
      // Here you would make an API call to update the job
      // For now, just update locally
      const updatedJobs = todaysJobs.map(job =>
        job.id === jobId
          ? {
              ...job,
              scheduledTime: `${editFormData.startTime} - ${calculateEndTime(editFormData.startTime, editFormData.duration)}`,
              duration: `${editFormData.duration} min`
            }
          : job
      );
      setTodaysJobs(updatedJobs);
      setEditingJobId(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error saving job edit:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setEditFormData({});
  };

  const calculateEndTime = (startTime: string, durationMin: string) => {
    // Simple time calculation helper
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(durationMin);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const period = endHours >= 12 ? 'PM' : 'AM';
    const displayHours = endHours > 12 ? endHours - 12 : endHours === 0 ? 12 : endHours;
    return `${displayHours}:${endMinutes.toString().padStart(2, '0')} ${period}`;
  };

  const menuItems = [
    { id: 'today' as ActiveSection, label: "Today's Jobs", icon: Calendar },
    { id: 'messages' as ActiveSection, label: 'Messages', icon: MessageSquare },
    { id: 'invoices' as ActiveSection, label: 'Invoices', icon: FileText },
    { id: 'history' as ActiveSection, label: 'Job History', icon: Clock },
    { id: 'calendar' as ActiveSection, label: 'Calendar', icon: Calendar },
    { id: 'quotes' as ActiveSection, label: 'Quotes', icon: DollarSign },
    { id: 'reviews' as ActiveSection, label: 'Reviews', icon: Star },
    { id: 'settings' as ActiveSection, label: 'Settings', icon: Settings }
  ];

  const renderTodaysJobs = () => (
    <div style={{ padding: '32px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', margin: 0 }}>
            Today's Jobs
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
            Complete and process today's appointments
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            LIST VIEW
          </button>
          <button style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            MAP VIEW
          </button>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            + ADD JOB
          </button>
          <button
            onClick={fetchContractorData}
            style={{
            padding: '10px 20px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            REFRESH
          </button>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : todaysJobs.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {todaysJobs.map((job, index) => {
            const isEditing = editingJobId === job.id;

            return (
              <div
                key={job.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  cursor: 'move'
                }}
              >
                {/* Number Circle - Draggable handle */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  position: 'relative',
                  cursor: 'grab'
                }}>
                  {index + 1}
                  <div
                    onClick={() => handleEditJob(job)}
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: '2px solid #4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#4f46e5',
                      cursor: 'pointer'
                    }}>
                    +
                  </div>
                </div>

                {/* Job Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', margin: 0 }}>
                    {job.client.firstName} {job.client.lastName}
                  </h3>

                  {isEditing ? (
                    // Edit Mode
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: '#64748b' }}>Start:</label>
                        <input
                          type="time"
                          value={editFormData.startTime}
                          onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                          style={{
                            padding: '6px 12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: '#64748b' }}>Duration (min):</label>
                        <input
                          type="number"
                          value={editFormData.duration}
                          onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                          style={{
                            padding: '6px 12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            width: '80px'
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleSaveEdit(job.id)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // View Mode
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '15px', marginBottom: '12px' }}>
                      <span>{job.service.name}</span>
                      <span>•</span>
                      <span>{job.scheduledTime}</span>
                      <span style={{ marginLeft: '4px' }}>({job.duration || '90 min'})</span>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} />
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(job.serviceAddress)}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         style={{ color: '#4f46e5', textDecoration: 'none' }}>
                        {job.serviceAddress}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📞</span>
                        <span>{job.client.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>✉️</span>
                        <span>{job.client.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                  <button style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}>
                    COMPLETE
                  </button>
                  <button
                    onClick={() => window.location.href = `tel:${job.client.phone}`}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}>
                    CALL
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <Calendar size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>No jobs scheduled for today</p>
        </div>
      )}
    </div>
  );

  // Chat Modal handlers
  const handleOpenChat = async (conversation: any) => {
    try {
      // Fetch full conversation with all messages
      const response = await fetch(`${API_BASE_URL}/messages/${conversation.id}`);
      const data = await response.json();

      if (data.success) {
        // Transform chat messages to match UI format
        const transformedMessages = data.message.chatMessages.map((msg: any) => ({
          sender: msg.sender === 'CONTRACTOR' ? 'contractor' : 'client',
          text: msg.messageText,
          time: new Date(msg.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          })
        }));

        const newConv = {
          ...conversation,
          clientName: `${conversation.client.firstName} ${conversation.client.lastName}`,
          messages: transformedMessages
        };

        setSelectedConversation(newConv);
        setShowChatModal(true);

        // Mark conversation as read
        await fetch(`${API_BASE_URL}/messages/${conversation.id}/read`, {
          method: 'PATCH'
        });

        // Update the messages list to mark this one as read
        setMessages(messages.map(msg =>
          msg.id === conversation.id
            ? { ...msg, status: 'READ' }
            : msg
        ));
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
          sender: 'CONTRACTOR',
          messageText: messageText.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add message to conversation
        const newMessage = {
          sender: 'contractor',
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

  const handleFlagMessage = (msg: any) => {
    setMessageToFlag(msg);
    setShowFlagModal(true);
  };

  const handleSubmitFlag = async () => {
    if (!flagReason || !messageToFlag || !user) {
      alert('Please select a reason for flagging this message.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/flag-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageText: messageToFlag.text,
          flaggedBy: 'CONTRACTOR',
          flaggedById: user.id,
          contractorId: user.id,
          clientId: selectedConversation?.client?.id || null,
          reason: flagReason,
          details: flagDetails
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Message flagged successfully. Our admin team will review it.');
        setShowFlagModal(false);
        setMessageToFlag(null);
        setFlagReason('');
        setFlagDetails('');
      } else {
        alert('Failed to flag message. Please try again.');
      }
    } catch (error) {
      console.error('Error flagging message:', error);
      alert('Failed to flag message. Please try again.');
    }
  };

  const renderMessages = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
        Messages
      </h2>
      {messages.length > 0 ? (
        <div style={{ display: 'grid', gap: '12px' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => handleOpenChat(msg)}
              style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '12px',
                border: msg.status === 'UNREAD' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#1e293b' }}>
                  {msg.client.firstName} {msg.client.lastName}
                </strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {new Date(msg.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                {msg.chatMessages[0]?.messageText || 'No messages yet'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#94a3b8' }}>No messages</p>
      )}
    </div>
  );

  const renderInvoices = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
        Invoices
      </h2>
      {invoices.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {invoices.map(invoice => (
            <div
              key={invoice.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
                    Invoice #{invoice.invoiceNumber}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '14px' }}>
                    {invoice.service} - {invoice.provider}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
                    ${invoice.amount}
                  </p>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: invoice.status === 'paid' ? '#dcfce7' : '#fef3c7',
                    color: invoice.status === 'paid' ? '#166534' : '#92400e',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {invoice.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#94a3b8' }}>No invoices</p>
      )}
    </div>
  );

  const renderJobHistory = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
        Job History
      </h2>
      {jobHistory.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {jobHistory.map(job => (
            <div
              key={job.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                  {job.service.name}
                </h3>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: job.status === 'COMPLETED' ? '#dcfce7' : '#fee2e2',
                  color: job.status === 'COMPLETED' ? '#166534' : '#991b1b',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {job.status}
                </span>
              </div>
              <p style={{ color: '#64748b', marginBottom: '4px' }}>
                <strong>Client:</strong> {job.client.firstName} {job.client.lastName}
              </p>
              <p style={{ color: '#64748b', marginBottom: '4px' }}>
                <strong>Date:</strong> {new Date(job.scheduledDate).toLocaleDateString()}
              </p>
              <p style={{ color: '#64748b' }}>
                <strong>Amount:</strong> ${job.price || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#94a3b8' }}>No job history</p>
      )}
    </div>
  );

  // Fetch bookings for the current month
  useEffect(() => {
    const fetchMonthlyBookings = async () => {
      if (!user?.id || activeSection !== 'calendar') return;

      try {
        const response = await fetch(`${API_BASE_URL}/bookings/contractor/${user.id}`);
        const result = await response.json();
        const data = result.bookings || result; // Handle both {bookings: []} and [] formats

        // Filter confirmed bookings for current month
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        const filtered = data.filter((booking: any) => {
          if (booking.status?.toUpperCase() !== 'CONFIRMED') return false;
          const bookingDate = new Date(booking.scheduledDate);
          return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
        });

        console.log('Fetched monthly bookings:', filtered);
        setMonthlyBookings(filtered);
      } catch (error) {
        console.error('Error fetching monthly bookings:', error);
      }
    };

    fetchMonthlyBookings();
  }, [user?.id, currentMonth, activeSection]);

  const renderCalendar = () => {
    // Get bookings count for a specific date
    const getBookingsForDate = (date: Date) => {
      return monthlyBookings.filter(booking => {
        const bookingDate = new Date(booking.scheduledDate);
        return bookingDate.toDateString() === date.toDateString();
      });
    };

    // Generate calendar days
    const generateCalendarDays = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];

      // Add empty cells for days before the month starts
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }

      return days;
    };

    const handleDateClick = (date: Date) => {
      setSelectedDate(date);
      const jobsForDate = getBookingsForDate(date);
      console.log('Clicked date:', date);
      console.log('Jobs for date:', jobsForDate);
      console.log('Total monthly bookings:', monthlyBookings);
      setSelectedDateJobs(jobsForDate);
      setCalendarView('list');
    };

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarDays = generateCalendarDays();

    return (
      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', margin: 0 }}>
            Calendar
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>
            Manage your bookings and schedule
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button
            onClick={() => setCalendarTab('bookings')}
            style={{
              padding: '12px 24px',
              backgroundColor: calendarTab === 'bookings' ? '#4f46e5' : 'white',
              color: calendarTab === 'bookings' ? 'white' : '#64748b',
              border: calendarTab === 'bookings' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            BOOKINGS
          </button>
          <button
            onClick={() => setCalendarTab('schedule')}
            style={{
              padding: '12px 24px',
              backgroundColor: calendarTab === 'schedule' ? '#4f46e5' : 'white',
              color: calendarTab === 'schedule' ? 'white' : '#64748b',
              border: calendarTab === 'schedule' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            SCHEDULE
          </button>
        </div>

        {calendarTab === 'bookings' ? (
          <div>
            {/* Bookings Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                  {calendarView === 'calendar' ? 'Review Bookings' : `Jobs for ${selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
                  {calendarView === 'calendar' ? 'View and manage your upcoming appointments' : `${selectedDateJobs.length} Job(s)`}
                </p>
              </div>

              {calendarView === 'list' ? (
                <button
                  onClick={() => {
                    setCalendarView('calendar');
                    setSelectedDate(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#4f46e5',
                    border: '2px solid #4f46e5',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  ← Back to Calendar
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      // Find first date with jobs and show it in list view
                      const firstDateWithJobs = calendarDays.find(day => {
                        if (!day) return false;
                        return getBookingsForDate(day).length > 0;
                      });

                      if (firstDateWithJobs) {
                        const jobs = getBookingsForDate(firstDateWithJobs);
                        setSelectedDate(firstDateWithJobs);
                        setSelectedDateJobs(jobs);
                        setCalendarView('list');
                      }
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    LIST VIEW
                  </button>
                  <button style={{
                    padding: '10px 20px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    CALENDAR VIEW
                  </button>
                </div>
              )}
            </div>

            {calendarView === 'calendar' ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                {/* Calendar Header with Month Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    ← Prev
                  </button>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Next →
                  </button>
                </div>

                {/* Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {/* Day headers */}
                  {daysOfWeek.map(day => (
                    <div key={day} style={{ textAlign: 'center', fontWeight: '600', color: '#64748b', fontSize: '14px', padding: '12px 0' }}>
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} />;
                    }

                    const bookings = getBookingsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                      <div
                        key={index}
                        onClick={() => bookings.length > 0 && handleDateClick(date)}
                        style={{
                          minHeight: '100px',
                          padding: '12px',
                          backgroundColor: bookings.length > 0 ? '#dbeafe' : 'white',
                          border: isToday ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          cursor: bookings.length > 0 ? 'pointer' : 'default',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: isToday ? 'bold' : 'normal', color: '#1e293b', marginBottom: '8px' }}>
                          {date.getDate()}
                        </div>
                        {bookings.length > 0 && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#4f46e5',
                            color: 'white',
                            borderRadius: '50%',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {bookings.length}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upcoming Appointments List */}
                <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
                    Upcoming Appointments
                  </h4>
                  {monthlyBookings.slice(0, 5).map(booking => (
                    <div
                      key={booking.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>
                          {new Date(booking.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {booking.client?.firstName} {booking.client?.lastName}
                        </p>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                          {booking.service?.name} ({booking.scheduledTime})
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                        color: booking.status === 'confirmed' ? '#15803d' : '#a16207',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // List View for selected date
              <div>
                {selectedDateJobs.map((job, index) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={() => handleCalendarDragStart(index)}
                    onDragOver={(e) => handleCalendarDragOver(e, index)}
                    onDrop={(e) => handleCalendarDrop(e, index)}
                    style={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: '2px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      cursor: 'move'
                    }}
                  >
                    {/* Number circle */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>

                    {/* Job Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>
                            {job.client?.firstName} {job.client?.lastName}
                          </h3>
                          <p style={{ color: '#4f46e5', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                            {job.service?.name} • {job.scheduledTime} ({job.duration || '90 min'})
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={16} />
                          {job.serviceAddress || 'Address not available'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '16px' }}>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                          📞 {job.client?.phone || 'N/A'}
                        </p>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                          ✉️ {job.client?.email || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                      <button style={{
                        padding: '12px 24px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        COMPLETE
                      </button>
                      <button style={{
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        CALL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Schedule Tab
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                Schedule Manager
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Manage your availability and working hours
              </p>
            </div>

            {/* Schedule View Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <button
                onClick={() => setScheduleView('recurring')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: scheduleView === 'recurring' ? '#4f46e5' : 'white',
                  color: scheduleView === 'recurring' ? 'white' : '#64748b',
                  border: scheduleView === 'recurring' ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔁 Recurring Schedule
              </button>
              <button
                onClick={() => setScheduleView('calendar')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: scheduleView === 'calendar' ? '#4f46e5' : 'white',
                  color: scheduleView === 'calendar' ? 'white' : '#64748b',
                  border: scheduleView === 'calendar' ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📅 Calendar View
              </button>
            </div>

            {scheduleView === 'recurring' ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                    Default Weekly Schedule (Recurring)
                  </h4>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                    Set your typical weekly availability. This schedule will repeat every week going forward.
                  </p>

                  {/* Info Box */}
                  <div style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px'
                  }}>
                    <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                      <strong>How it works:</strong> When you set "Monday 8am-5pm", it applies to <em>every</em> Monday. For vacations or specific dates, you'll be able to add overrides in the Calendar view (coming soon).
                    </p>
                  </div>
                </div>

                {/* Days of the Week */}
                {Object.entries(weeklySchedule).map(([day, schedule]: [string, any]) => {
                  const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                  const hasServiceAreasWarning = schedule.available && schedule.serviceAreas.length === 0;

                  return (
                    <div
                      key={day}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '16px'
                      }}
                    >
                      {/* Day Header with Checkbox */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <input
                          type="checkbox"
                          checked={schedule.available}
                          onChange={(e) => {
                            setWeeklySchedule({
                              ...weeklySchedule,
                              [day]: { ...schedule, available: e.target.checked }
                            });
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            accentColor: '#4f46e5'
                          }}
                        />
                        <h5 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                          {dayName}
                        </h5>
                        <span style={{
                          fontSize: '14px',
                          color: schedule.available ? '#10b981' : '#94a3b8',
                          fontWeight: '600'
                        }}>
                          {schedule.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>

                      {schedule.available ? (
                        <div>
                          {/* Time Range */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <input
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) => {
                                setWeeklySchedule({
                                  ...weeklySchedule,
                                  [day]: { ...schedule, startTime: e.target.value }
                                });
                              }}
                              style={{
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                              }}
                            />
                            <select
                              value={schedule.startPeriod}
                              onChange={(e) => {
                                setWeeklySchedule({
                                  ...weeklySchedule,
                                  [day]: { ...schedule, startPeriod: e.target.value }
                                });
                              }}
                              style={{
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                backgroundColor: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>

                            <span style={{ color: '#64748b', fontWeight: '600' }}>to</span>

                            <input
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) => {
                                setWeeklySchedule({
                                  ...weeklySchedule,
                                  [day]: { ...schedule, endTime: e.target.value }
                                });
                              }}
                              style={{
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                              }}
                            />
                            <select
                              value={schedule.endPeriod}
                              onChange={(e) => {
                                setWeeklySchedule({
                                  ...weeklySchedule,
                                  [day]: { ...schedule, endPeriod: e.target.value }
                                });
                              }}
                              style={{
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                backgroundColor: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>

                          {/* Max Jobs */}
                          <div style={{ marginBottom: '20px' }}>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1e293b',
                              marginBottom: '8px'
                            }}>
                              Max Jobs Per Day:
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={schedule.maxJobs}
                              onChange={(e) => {
                                setWeeklySchedule({
                                  ...weeklySchedule,
                                  [day]: { ...schedule, maxJobs: parseInt(e.target.value) || 0 }
                                });
                              }}
                              style={{
                                width: '100px',
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                              }}
                            />
                            <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '12px' }}>
                              (How many jobs you can complete every {dayName})
                            </span>
                          </div>

                          {/* Service Areas */}
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1e293b',
                              marginBottom: '8px'
                            }}>
                              Service Areas (every {dayName}):
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {serviceAreasList.map(area => (
                                <button
                                  key={area}
                                  onClick={() => {
                                    const isSelected = schedule.serviceAreas.includes(area);
                                    setWeeklySchedule({
                                      ...weeklySchedule,
                                      [day]: {
                                        ...schedule,
                                        serviceAreas: isSelected
                                          ? schedule.serviceAreas.filter((a: string) => a !== area)
                                          : [...schedule.serviceAreas, area]
                                      }
                                    });
                                  }}
                                  style={{
                                    padding: '8px 16px',
                                    backgroundColor: schedule.serviceAreas.includes(area) ? '#4f46e5' : 'white',
                                    color: schedule.serviceAreas.includes(area) ? 'white' : '#64748b',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {area}
                                </button>
                              ))}
                            </div>
                            {hasServiceAreasWarning && (
                              <p style={{
                                fontSize: '13px',
                                color: '#dc2626',
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                ⚠️ No service areas selected for this day
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                          Unavailable
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Save Button */}
                <button
                  onClick={async () => {
                    if (!user?.id) return;

                    try {
                      // Convert weeklySchedule to API format
                      const dayMapping: { [key: string]: number } = {
                        sunday: 0,
                        monday: 1,
                        tuesday: 2,
                        wednesday: 3,
                        thursday: 4,
                        friday: 5,
                        saturday: 6
                      };

                      const scheduleData = Object.entries(weeklySchedule)
                        .filter(([_, schedule]: [string, any]) => schedule.available)
                        .map(([day, schedule]: [string, any]) => {
                          // Convert 12-hour format to 24-hour format
                          let startHour = parseInt(schedule.startTime.split(':')[0]);
                          const startMin = schedule.startTime.split(':')[1];
                          if (schedule.startPeriod === 'PM' && startHour !== 12) {
                            startHour += 12;
                          } else if (schedule.startPeriod === 'AM' && startHour === 12) {
                            startHour = 0;
                          }

                          let endHour = parseInt(schedule.endTime.split(':')[0]);
                          const endMin = schedule.endTime.split(':')[1];
                          if (schedule.endPeriod === 'PM' && endHour !== 12) {
                            endHour += 12;
                          } else if (schedule.endPeriod === 'AM' && endHour === 12) {
                            endHour = 0;
                          }

                          return {
                            dayOfWeek: dayMapping[day],
                            startTime: `${String(startHour).padStart(2, '0')}:${startMin}`,
                            endTime: `${String(endHour).padStart(2, '0')}:${endMin}`,
                            maxBookings: schedule.maxJobs,
                            isAvailable: true,
                            serviceAreas: schedule.serviceAreas
                          };
                        });

                      const response = await fetch(`${API_BASE_URL}/availability/contractor/${user.id}/schedule`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ schedule: scheduleData })
                      });

                      const result = await response.json();

                      if (result.success) {
                        alert(`Schedule saved successfully!\n${result.scheduleCount} days configured\n${result.serviceAreasCount} service areas saved`);
                      } else {
                        alert(`Failed to save schedule: ${result.error}`);
                      }
                    } catch (error) {
                      console.error('Error saving schedule:', error);
                      alert('Failed to save schedule. Please try again.');
                    }
                  }}
                  style={{
                    padding: '14px 32px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '24px',
                    textTransform: 'uppercase'
                  }}
                >
                  Save Schedule
                </button>

                {/* Specific Date Overrides Section */}
                <div style={{
                  marginTop: '48px',
                  paddingTop: '32px',
                  borderTop: '2px solid #e2e8f0'
                }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                    Specific Date Overrides
                  </h4>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                    Override your recurring schedule for specific dates (vacations, holidays, busy days, etc.)
                  </p>

                  <button
                    onClick={() => {
                      setOverrideForm({
                        isDateRange: false,
                        specificDate: '',
                        startDate: '',
                        endDate: '',
                        isAvailable: true,
                        startTime: '08:00',
                        startPeriod: 'AM',
                        endTime: '05:00',
                        endPeriod: 'PM',
                        maxJobs: 6,
                        reason: ''
                      });
                      setEditingOverrideId(null);
                      setShowOverrideModal(true);
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    + ADD DATE OVERRIDE
                  </button>

                  {/* List of existing overrides */}
                  {dateOverrides.length > 0 && (
                    <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
                      {dateOverrides.map((override) => {
                        const date = new Date(override.specificDate);
                        const formattedDate = date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });

                        return (
                          <div
                            key={override.id}
                            style={{
                              backgroundColor: override.isAvailable ? '#f0fdf4' : '#fef2f2',
                              border: override.isAvailable ? '1px solid #86efac' : '1px solid #fca5a5',
                              borderRadius: '8px',
                              padding: '16px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <span style={{
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                  color: '#1e293b'
                                }}>
                                  {formattedDate}
                                </span>
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: override.isAvailable ? '#10b981' : '#ef4444',
                                  color: 'white'
                                }}>
                                  {override.isAvailable ? 'Available' : 'Blocked'}
                                </span>
                              </div>
                              {override.isAvailable ? (
                                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
                                  {override.startTime} - {override.endTime} • Max {override.maxBookings} jobs
                                </p>
                              ) : (
                                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
                                  No bookings accepted
                                </p>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={async () => {
                                  if (!user?.id) return;

                                  if (window.confirm(`Delete override for ${formattedDate}?`)) {
                                    try {
                                      // Since there's no delete endpoint, we can set isAvailable to match the recurring schedule
                                      // Or we could add a delete endpoint to the backend
                                      const response = await fetch(
                                        `${API_BASE_URL}/availability/contractor/${user.id}/override`,
                                        {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            specificDate: override.specificDate,
                                            isAvailable: false,
                                            startTime: '00:00',
                                            endTime: '00:00',
                                            maxBookings: 0
                                          })
                                        }
                                      );

                                      if (response.ok) {
                                        // Refresh overrides
                                        const today = new Date();
                                        const sixMonthsLater = new Date();
                                        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

                                        const overridesResponse = await fetch(
                                          `${API_BASE_URL}/availability/contractor/${user.id}/overrides?startDate=${today.toISOString().split('T')[0]}&endDate=${sixMonthsLater.toISOString().split('T')[0]}`
                                        );
                                        const overridesData = await overridesResponse.json();

                                        if (overridesData.success) {
                                          setDateOverrides(overridesData.overrides || []);
                                        }

                                        alert('Override deleted successfully!');
                                      }
                                    } catch (error) {
                                      console.error('Error deleting override:', error);
                                      alert('Failed to delete override');
                                    }
                                  }
                                }}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Calendar View
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
                {/* Calendar Header with Month Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                    {calendarViewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => {
                        const newMonth = new Date(calendarViewMonth);
                        newMonth.setMonth(newMonth.getMonth() - 1);
                        setCalendarViewMonth(newMonth);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => {
                        const newMonth = new Date(calendarViewMonth);
                        newMonth.setMonth(newMonth.getMonth() + 1);
                        setCalendarViewMonth(newMonth);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e2e8f0', border: '1px solid #e2e8f0' }}>
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      style={{
                        backgroundColor: '#f8fafc',
                        padding: '16px',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: '#475569'
                      }}
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {(() => {
                    const year = calendarViewMonth.getFullYear();
                    const month = calendarViewMonth.getMonth();
                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);
                    const daysInMonth = lastDay.getDate();
                    const startingDayOfWeek = firstDay.getDay();

                    const days = [];

                    // Empty cells for days before month starts
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(
                        <div
                          key={`empty-${i}`}
                          style={{
                            backgroundColor: '#f8fafc',
                            minHeight: '120px'
                          }}
                        />
                      );
                    }

                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const currentDate = new Date(year, month, day);
                      const dateString = currentDate.toISOString().split('T')[0];
                      const dayOfWeek = currentDate.getDay();
                      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                      const dayName = dayNames[dayOfWeek];

                      // Check if there's a date override for this date
                      const override = dateOverrides.find(o => o.specificDate === dateString);

                      // Get the default schedule for this day of week
                      const defaultSchedule = weeklySchedule[dayName];

                      // Determine what to display (override takes precedence)
                      const isAvailable = override ? override.isAvailable : defaultSchedule.available;
                      const displayTime = override
                        ? `${override.startTime} - ${override.endTime}`
                        : defaultSchedule.available
                          ? `${defaultSchedule.startTime} - ${defaultSchedule.endTime}`
                          : '';
                      const maxJobs = override ? override.maxBookings : defaultSchedule.maxJobs;
                      const bookedJobs = 0; // TODO: Get actual booked jobs from bookings data

                      const isPastDate = currentDate < new Date(new Date().setHours(0, 0, 0, 0));

                      days.push(
                        <div
                          key={day}
                          style={{
                            backgroundColor: isAvailable ? (isPastDate ? '#f8fafc' : '#f0fdf4') : '#fef2f2',
                            padding: '12px',
                            minHeight: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            cursor: isPastDate ? 'default' : 'pointer',
                            opacity: isPastDate ? 0.6 : 1,
                            border: currentDate.toDateString() === new Date().toDateString() ? '2px solid #3b82f6' : 'none'
                          }}
                          onClick={() => {
                            if (!isPastDate) {
                              // Open override modal pre-filled with this date
                              setOverrideForm({
                                isDateRange: false,
                                specificDate: dateString,
                                startDate: '',
                                endDate: '',
                                isAvailable: isAvailable,
                                startTime: defaultSchedule.startTime,
                                startPeriod: defaultSchedule.startPeriod,
                                endTime: defaultSchedule.endTime,
                                endPeriod: defaultSchedule.endPeriod,
                                maxJobs: maxJobs,
                                reason: ''
                              });
                              setEditingOverrideId(override?.id || null);
                              setShowOverrideModal(true);
                            }
                          }}
                        >
                          <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#1e293b',
                            marginBottom: '4px'
                          }}>
                            {day}
                          </div>

                          {isAvailable ? (
                            <>
                              <div style={{
                                fontSize: '12px',
                                color: '#475569',
                                lineHeight: '1.4'
                              }}>
                                {displayTime}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#059669',
                                fontWeight: '600'
                              }}>
                                {bookedJobs}/{maxJobs} jobs
                              </div>
                            </>
                          ) : (
                            <div style={{
                              fontSize: '12px',
                              color: '#dc2626',
                              fontWeight: '600'
                            }}>
                              Unavailable
                            </div>
                          )}
                        </div>
                      );
                    }

                    return days;
                  })()}
                </div>

                {/* Legend */}
                <div style={{ marginTop: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px' }} />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Available</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '4px' }} />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Blocked/Unavailable</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: 'white', border: '2px solid #3b82f6', borderRadius: '4px' }} />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Today</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>Click any future date to edit availability</span>
                  </div>
                </div>
              </div>
            )}

            {/* Date Override Modal - Available in both tabs */}
            {showOverrideModal && (
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
                  borderRadius: '16px',
                  padding: '32px',
                  maxWidth: '600px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
                    {editingOverrideId ? 'Edit Date Override' : 'Add Date Override'}
                  </h3>

                  <div style={{ display: 'grid', gap: '20px' }}>
                    {/* Date Range Toggle */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={overrideForm.isDateRange}
                          onChange={(e) => setOverrideForm({ ...overrideForm, isDateRange: e.target.checked })}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                          Apply to date range (multiple days)
                        </span>
                      </label>
                    </div>

                    {/* Date Picker - Single or Range */}
                    {overrideForm.isDateRange ? (
                      <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={overrideForm.startDate}
                            onChange={(e) => setOverrideForm({ ...overrideForm, startDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                            End Date *
                          </label>
                          <input
                            type="date"
                            value={overrideForm.endDate}
                            onChange={(e) => setOverrideForm({ ...overrideForm, endDate: e.target.value })}
                            min={overrideForm.startDate || new Date().toISOString().split('T')[0]}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                          Date *
                        </label>
                        <input
                          type="date"
                          value={overrideForm.specificDate}
                          onChange={(e) => setOverrideForm({ ...overrideForm, specificDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    )}

                    {/* Availability Toggle */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={!overrideForm.isAvailable}
                          onChange={(e) => setOverrideForm({ ...overrideForm, isAvailable: !e.target.checked })}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                          Block {overrideForm.isDateRange ? 'these dates' : 'this date'} (no bookings accepted)
                        </span>
                      </label>
                    </div>

                    {/* Show time/jobs fields only if available */}
                    {overrideForm.isAvailable && (
                      <>
                        {/* Time Range */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                            Working Hours
                          </label>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                              type="time"
                              value={overrideForm.startTime}
                              onChange={(e) => setOverrideForm({ ...overrideForm, startTime: e.target.value })}
                              style={{
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            />
                            <select
                              value={overrideForm.startPeriod}
                              onChange={(e) => setOverrideForm({ ...overrideForm, startPeriod: e.target.value })}
                              style={{
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                            <span style={{ color: '#64748b' }}>to</span>
                            <input
                              type="time"
                              value={overrideForm.endTime}
                              onChange={(e) => setOverrideForm({ ...overrideForm, endTime: e.target.value })}
                              style={{
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            />
                            <select
                              value={overrideForm.endPeriod}
                              onChange={(e) => setOverrideForm({ ...overrideForm, endPeriod: e.target.value })}
                              style={{
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>

                        {/* Max Jobs */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                            Maximum Jobs
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={overrideForm.maxJobs}
                            onChange={(e) => setOverrideForm({ ...overrideForm, maxJobs: parseInt(e.target.value) || 1 })}
                            style={{
                              width: '100px',
                              padding: '10px 12px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </>
                    )}

                    {/* Reason/Note */}
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                        Reason (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Vacation, Holiday, Family event"
                        value={overrideForm.reason}
                        onChange={(e) => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowOverrideModal(false)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!user?.id) return;

                        // Validate dates
                        if (overrideForm.isDateRange) {
                          if (!overrideForm.startDate || !overrideForm.endDate) {
                            alert('Please select both start and end dates');
                            return;
                          }
                          if (new Date(overrideForm.endDate) < new Date(overrideForm.startDate)) {
                            alert('End date must be after start date');
                            return;
                          }
                        } else {
                          if (!overrideForm.specificDate) {
                            alert('Please select a date');
                            return;
                          }
                        }

                        try {
                          // Convert 12-hour time to 24-hour format
                          let startHour = parseInt(overrideForm.startTime.split(':')[0]);
                          const startMin = overrideForm.startTime.split(':')[1];
                          if (overrideForm.startPeriod === 'PM' && startHour !== 12) {
                            startHour += 12;
                          } else if (overrideForm.startPeriod === 'AM' && startHour === 12) {
                            startHour = 0;
                          }

                          let endHour = parseInt(overrideForm.endTime.split(':')[0]);
                          const endMin = overrideForm.endTime.split(':')[1];
                          if (overrideForm.endPeriod === 'PM' && endHour !== 12) {
                            endHour += 12;
                          } else if (overrideForm.endPeriod === 'AM' && endHour === 12) {
                            endHour = 0;
                          }

                          const startTimeFormatted = overrideForm.isAvailable ? `${String(startHour).padStart(2, '0')}:${startMin}` : '00:00';
                          const endTimeFormatted = overrideForm.isAvailable ? `${String(endHour).padStart(2, '0')}:${endMin}` : '00:00';
                          const maxBookings = overrideForm.isAvailable ? overrideForm.maxJobs : 0;

                          // Handle date range
                          if (overrideForm.isDateRange) {
                            const startDate = new Date(overrideForm.startDate);
                            const endDate = new Date(overrideForm.endDate);
                            const dates: string[] = [];

                            // Generate all dates in range
                            const currentDate = new Date(startDate);
                            while (currentDate <= endDate) {
                              dates.push(currentDate.toISOString().split('T')[0]);
                              currentDate.setDate(currentDate.getDate() + 1);
                            }

                            // Save each date
                            let successCount = 0;
                            for (const date of dates) {
                              const requestBody = {
                                specificDate: date,
                                isAvailable: overrideForm.isAvailable,
                                startTime: startTimeFormatted,
                                endTime: endTimeFormatted,
                                maxBookings: maxBookings
                              };

                              const response = await fetch(
                                `${API_BASE_URL}/availability/contractor/${user.id}/override`,
                                {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(requestBody)
                                }
                              );

                              const result = await response.json();
                              if (result.success) {
                                successCount++;
                              }
                            }

                            // Refresh overrides list
                            const today = new Date();
                            const sixMonthsLater = new Date();
                            sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

                            const overridesResponse = await fetch(
                              `${API_BASE_URL}/availability/contractor/${user.id}/overrides?startDate=${today.toISOString().split('T')[0]}&endDate=${sixMonthsLater.toISOString().split('T')[0]}`
                            );
                            const overridesData = await overridesResponse.json();

                            if (overridesData.success) {
                              setDateOverrides(overridesData.overrides || []);
                            }

                            setShowOverrideModal(false);
                            alert(`Successfully created overrides for ${successCount} of ${dates.length} days`);
                          } else {
                            // Single date
                            const requestBody = {
                              specificDate: overrideForm.specificDate,
                              isAvailable: overrideForm.isAvailable,
                              startTime: startTimeFormatted,
                              endTime: endTimeFormatted,
                              maxBookings: maxBookings
                            };

                            const response = await fetch(
                              `${API_BASE_URL}/availability/contractor/${user.id}/override`,
                              {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(requestBody)
                              }
                            );

                            const result = await response.json();

                            if (result.success) {
                              // Refresh overrides list
                              const today = new Date();
                              const sixMonthsLater = new Date();
                              sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

                              const overridesResponse = await fetch(
                                `${API_BASE_URL}/availability/contractor/${user.id}/overrides?startDate=${today.toISOString().split('T')[0]}&endDate=${sixMonthsLater.toISOString().split('T')[0]}`
                              );
                              const overridesData = await overridesResponse.json();

                              if (overridesData.success) {
                                setDateOverrides(overridesData.overrides || []);
                              }

                              setShowOverrideModal(false);
                              alert(result.message || 'Date override saved successfully!');
                            } else {
                              alert(`Failed to save: ${result.error}`);
                            }
                          }
                        } catch (error) {
                          console.error('Error saving override:', error);
                          alert('Failed to save date override');
                        }
                      }}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Save Override
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderQuotes = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
        Quote Requests
      </h2>
      {quotes.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {quotes.map(quote => (
            <div
              key={quote.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #fbbf24'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
                {quote.service.name}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '4px' }}>
                <strong>Client:</strong> {quote.client.firstName} {quote.client.lastName}
              </p>
              <p style={{ color: '#64748b', marginBottom: '4px' }}>
                <strong>Date:</strong> {new Date(quote.scheduledDate).toLocaleDateString()}
              </p>
              <p style={{ color: '#64748b', marginBottom: '16px' }}>
                <strong>Address:</strong> {quote.serviceAddress}
              </p>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Send Quote
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#94a3b8' }}>No pending quote requests</p>
      )}
    </div>
  );

  const renderReviews = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
        Reviews
      </h2>
      {profile && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Star size={32} fill="#fbbf24" color="#fbbf24" />
            <div>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                {profile.rating.toFixed(1)}
              </p>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                {profile.reviewCount} reviews
              </p>
            </div>
          </div>
        </div>
      )}
      <p style={{ color: '#94a3b8' }}>Individual reviews coming soon</p>
    </div>
  );

  // Load settings data when settings tab is active
  useEffect(() => {
    if (activeSection === 'settings' && user?.id) {
      loadSettingsData();
    }
  }, [activeSection, user?.id]);

  const loadSettingsData = async () => {
    if (!user?.id) return;

    try {
      // Load all services
      const servicesResponse = await fetch(`${API_BASE_URL}/services`);
      const servicesData = await servicesResponse.json();
      if (servicesData.success) {
        setAllServices(servicesData.services);
      }

      // Load contractor's services
      const contractorServicesResponse = await fetch(`${API_BASE_URL}/contractor-services/${user.id}`);
      const contractorServicesData = await contractorServicesResponse.json();
      if (Array.isArray(contractorServicesData)) {
        setContractorServices(contractorServicesData.map((s: any) => s.id));
      }

      // Load contractor's service areas
      const areasResponse = await fetch(`${API_BASE_URL}/contractor-areas/${user.id}`);
      const areasData = await areasResponse.json();
      if (Array.isArray(areasData)) {
        setContractorAreas(areasData);
      }

      // Load materials
      const materialsResponse = await fetch(`${API_BASE_URL}/materials/${user.id}`);
      const materialsData = await materialsResponse.json();
      if (materialsData.success) {
        setMaterials(materialsData.materials);
      }

      // Initialize profile form with current profile data
      if (profile) {
        setProfileForm({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          description: profile.description || '',
          yearsInBusiness: profile.yearsInBusiness?.toString() || '',
          location: profile.location || ''
        });
      }
    } catch (error) {
      console.error('Error loading settings data:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/contractors/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          description: profileForm.description,
          yearsInBusiness: profileForm.yearsInBusiness ? parseInt(profileForm.yearsInBusiness) : null,
          location: profileForm.location
        })
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.contractor);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleToggleService = async (serviceId: number) => {
    if (!user?.id) return;

    const isSelected = contractorServices.includes(serviceId);
    const newServices = isSelected
      ? contractorServices.filter(id => id !== serviceId)
      : [...contractorServices, serviceId];

    try {
      const response = await fetch(`${API_BASE_URL}/contractor/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user.id,
          serviceIds: newServices
        })
      });

      const data = await response.json();
      if (data.success) {
        setContractorServices(newServices);
      }
    } catch (error) {
      console.error('Error updating services:', error);
    }
  };

  const handleAddArea = async () => {
    if (!newArea.trim() || !user?.id) return;

    const updatedAreas = [...contractorAreas, newArea.trim()];

    try {
      const response = await fetch(`${API_BASE_URL}/contractor/areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user.id,
          areas: updatedAreas
        })
      });

      const data = await response.json();
      if (data.success) {
        setContractorAreas(updatedAreas);
        setNewArea('');
      }
    } catch (error) {
      console.error('Error adding area:', error);
    }
  };

  const handleRemoveArea = async (areaToRemove: string) => {
    if (!user?.id) return;

    const updatedAreas = contractorAreas.filter(area => area !== areaToRemove);

    try {
      const response = await fetch(`${API_BASE_URL}/contractor/areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user.id,
          areas: updatedAreas
        })
      });

      const data = await response.json();
      if (data.success) {
        setContractorAreas(updatedAreas);
      }
    } catch (error) {
      console.error('Error removing area:', error);
    }
  };

  const handleSaveMaterial = async () => {
    if (!user?.id || !materialForm.name || !materialForm.price || !materialForm.unit) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const url = editingMaterial
        ? `${API_BASE_URL}/materials/${editingMaterial.id}`
        : `${API_BASE_URL}/materials`;

      const response = await fetch(url, {
        method: editingMaterial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user.id,
          name: materialForm.name,
          price: parseFloat(materialForm.price),
          unit: materialForm.unit,
          description: materialForm.description
        })
      });

      const data = await response.json();
      if (data.success) {
        await loadSettingsData(); // Reload materials
        setShowMaterialModal(false);
        setEditingMaterial(null);
        setMaterialForm({ name: '', price: '', unit: 'each', description: '' });
      }
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Failed to save material');
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/materials/${materialId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setMaterials(materials.filter(m => m.id !== materialId));
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material');
    }
  };

  const openEditMaterial = (material: any) => {
    setEditingMaterial(material);
    setMaterialForm({
      name: material.name,
      price: material.price.toString(),
      unit: material.unit,
      description: material.description || ''
    });
    setShowMaterialModal(true);
  };

  const renderSettings = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
        Settings
      </h2>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
        Manage your profile, services, and business settings
      </p>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '32px' }}>
        {[
          { id: 'profile' as const, label: 'Profile' },
          { id: 'services' as const, label: 'Services' },
          { id: 'areas' as const, label: 'Service Areas' },
          { id: 'materials' as const, label: 'Materials Library' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSettingsTab(tab.id)}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              color: settingsTab === tab.id ? '#6366f1' : '#64748b',
              borderBottom: settingsTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
              marginBottom: '-2px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        {settingsTab === 'profile' && renderProfileTab()}
        {settingsTab === 'services' && renderServicesTab()}
        {settingsTab === 'areas' && renderAreasTab()}
        {settingsTab === 'materials' && renderMaterialsTab()}
      </div>

      {/* Material Modal */}
      {showMaterialModal && (
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
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              {editingMaterial ? 'Edit Material' : 'Add Material'}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                Material Name *
              </label>
              <input
                type="text"
                value={materialForm.name}
                onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder="e.g., Paint, Screws, etc."
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={materialForm.price}
                onChange={(e) => setMaterialForm({ ...materialForm, price: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder="0.00"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                Unit *
              </label>
              <select
                value={materialForm.unit}
                onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                <option value="each">each</option>
                <option value="gallon">gallon</option>
                <option value="box">box</option>
                <option value="sheet">sheet</option>
                <option value="tube">tube</option>
                <option value="lb">lb</option>
                <option value="ft">ft</option>
                <option value="sqft">sqft</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                Description
              </label>
              <textarea
                value={materialForm.description}
                onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Optional description"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowMaterialModal(false);
                  setEditingMaterial(null);
                  setMaterialForm({ name: '', price: '', unit: 'each', description: '' });
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMaterial}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {editingMaterial ? 'Update' : 'Add'} Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfileTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Profile Information</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
          Business Name
        </label>
        <input
          type="text"
          value={profileForm.name}
          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
          Email
        </label>
        <input
          type="email"
          value={profileForm.email}
          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
          Phone
        </label>
        <input
          type="tel"
          value={profileForm.phone}
          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
          Location
        </label>
        <input
          type="text"
          value={profileForm.location}
          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          placeholder="e.g., Boise, ID"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
          Years in Business
        </label>
        <input
          type="number"
          value={profileForm.yearsInBusiness}
          onChange={(e) => setProfileForm({ ...profileForm, yearsInBusiness: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
          Description
        </label>
        <textarea
          value={profileForm.description}
          onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px',
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder="Tell clients about your business..."
        />
      </div>

      <button
        onClick={handleSaveProfile}
        style={{
          padding: '12px 32px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#6366f1',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Save Profile
      </button>
    </div>
  );

  const renderServicesTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Services Offered</h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
        Select the services you offer to clients
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
        {allServices.map((service) => (
          <label
            key={service.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              border: `2px solid ${contractorServices.includes(service.id) ? '#6366f1' : '#e2e8f0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: contractorServices.includes(service.id) ? '#eef2ff' : 'white',
              transition: 'all 0.2s'
            }}
          >
            <input
              type="checkbox"
              checked={contractorServices.includes(service.id)}
              onChange={() => handleToggleService(service.id)}
              style={{ marginRight: '12px', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '16px', fontWeight: '500' }}>{service.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderAreasTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Service Areas</h3>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
        Manage the cities and areas where you provide services
      </p>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={newArea}
          onChange={(e) => setNewArea(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddArea()}
          placeholder="Enter city or zip code"
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={handleAddArea}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#10b981',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Add Area
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {contractorAreas.map((area, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#f1f5f9',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <MapPin size={16} style={{ color: '#64748b' }} />
            <span>{area}</span>
            <button
              onClick={() => handleRemoveArea(area)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                marginLeft: '4px'
              }}
            >
              <X size={16} style={{ color: '#ef4444' }} />
            </button>
          </div>
        ))}
      </div>

      {contractorAreas.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', padding: '32px' }}>
          No service areas added yet. Add areas where you provide services.
        </p>
      )}
    </div>
  );

  const renderMaterialsTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Materials Library</h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Manage common materials for job completion and expense tracking
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMaterial(null);
            setMaterialForm({ name: '', price: '', unit: 'each', description: '' });
            setShowMaterialModal(true);
          }}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#10b981',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          + Add Material
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {materials.map((material) => (
          <div
            key={material.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                {material.name}
              </h4>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                ${material.price.toFixed(2)} per {material.unit}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => openEditMaterial(material)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteMaterial(material.id)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {materials.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
            No materials in your library yet
          </p>
          <button
            onClick={() => {
              setEditingMaterial(null);
              setMaterialForm({ name: '', price: '', unit: 'each', description: '' });
              setShowMaterialModal(true);
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Add Your First Material
          </button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'today':
        return renderTodaysJobs();
      case 'messages':
        return renderMessages();
      case 'invoices':
        return renderInvoices();
      case 'history':
        return renderJobHistory();
      case 'calendar':
        return renderCalendar();
      case 'quotes':
        return renderQuotes();
      case 'reviews':
        return renderReviews();
      case 'settings':
        return renderSettings();
      default:
        return renderTodaysJobs();
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
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '4px'
          }}>
            Contractor Dashboard
          </h1>
          {profile && (
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {profile.name}
            </p>
          )}
        </div>

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
                  fontWeight: '500',
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

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: '#ef4444',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px'
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '280px',
        minHeight: '100vh'
      }}>
        {renderContent()}
      </div>

      {/* Schedule Changes Modal */}
      {showScheduleChanges && (
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
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px'
            }}>
              Schedule Changes Detected
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#64748b',
              marginBottom: '24px'
            }}>
              Reordering jobs will change {affectedAppointments.length} appointment time{affectedAppointments.length !== 1 ? 's' : ''}. Review the changes and notify affected customers.
            </p>

            {/* Affected Appointments */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <Clock size={20} color="#f59e0b" />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Affected Appointments
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {affectedAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '8px'
                    }}>
                      {appointment.client.firstName} {appointment.client.lastName}
                    </h4>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>
                          Previous Time
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: '#ef4444',
                          fontWeight: '600',
                          textDecoration: 'line-through'
                        }}>
                          {appointment.previousTime}
                        </span>
                      </div>

                      <span style={{ color: '#94a3b8' }}>→</span>

                      <div>
                        <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>
                          New Time
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: '#10b981',
                          fontWeight: '600'
                        }}>
                          {appointment.newTime}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: '#64748b',
                      display: 'flex',
                      gap: '12px'
                    }}>
                      <span>📞 {appointment.client.phone}</span>
                      <span>•</span>
                      <span>✉️ {appointment.client.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#1e40af',
                margin: 0
              }}>
                <strong>Note:</strong> The first job time ({(activeSection === 'calendar' ? selectedDateJobs[0] : todaysJobs[0])?.scheduledTime?.split(' - ')[0]}) remains unchanged. Subsequent jobs are automatically scheduled with 15 minutes travel time between appointments.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => activeSection === 'calendar' ? handleAcceptCalendarScheduleChanges(true) : handleAcceptScheduleChanges(true)}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>✈️</span>
                ACCEPT & NOTIFY CUSTOMERS
              </button>

              <button
                onClick={() => activeSection === 'calendar' ? handleAcceptCalendarScheduleChanges(false) : handleAcceptScheduleChanges(false)}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>✓</span>
                ACCEPT SILENTLY (No Notifications)
              </button>

              <button
                onClick={handleCancelScheduleChanges}
                style={{
                  padding: '14px 24px',
                  backgroundColor: 'white',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                CANCEL (Keep Original Order)
              </button>
            </div>
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
                  {selectedConversation.clientName}
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
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((msg: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'contractor' ? 'flex-end' : 'flex-start',
                      gap: '8px',
                      alignItems: 'flex-start'
                    }}
                  >
                    {msg.sender === 'client' && (
                      <button
                        onClick={() => handleFlagMessage(msg)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94a3b8',
                          padding: '4px',
                          marginTop: '8px'
                        }}
                        title="Flag message"
                      >
                        <Flag size={16} />
                      </button>
                    )}
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: msg.sender === 'contractor' ? '#3b82f6' : '#f1f5f9',
                      color: msg.sender === 'contractor' ? 'white' : '#1e293b'
                    }}>
                      <p style={{ marginBottom: '4px' }}>{msg.text}</p>
                      <p style={{
                        fontSize: '12px',
                        opacity: 0.7
                      }}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#64748b' }}>
                  No messages yet. Start the conversation!
                </p>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '12px'
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
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: messageText.trim() ? '#3b82f6' : '#cbd5e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
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
                Message from {selectedConversation?.clientName}:
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
    </div>
  );
};

export default ContractorDashboard;
