import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import {
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  DollarSign,
  Settings,
  LogOut,
  MapPin,
  X,
  Flag,
  AlertTriangle,
  Edit2,
  CheckCircle,
  Trash2,
  Phone,
  Navigation,
  ExternalLink,
  CreditCard
} from 'react-feather';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type ActiveSection = 'today' | 'messages' | 'invoices' | 'history' | 'calendar' | 'quotes' | 'earnings' | 'settings';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Create numbered marker icon for map
const createNumberedIcon = (number: number) => {
  return L.divIcon({
    className: 'custom-numbered-marker',
    html: `<div style="
      background-color: #3b82f6;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const ContractorDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('today');
  const [loading, setLoading] = useState(true);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Data states
  const [todaysJobs, setTodaysJobs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  // Today's Jobs view mode
  const [todaysJobsViewMode, setTodaysJobsViewMode] = useState<'list' | 'map'>('list');
  const [jobCoordinates, setJobCoordinates] = useState<{[key: number]: {lat: number, lng: number}}>({});
  const [geocodingComplete, setGeocodingComplete] = useState(false);

  // Edit mode states
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [timeSlotConflicts, setTimeSlotConflicts] = useState<any[]>([]);
  const [nextAvailableTime, setNextAvailableTime] = useState<string | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Schedule changes modal
  const [showScheduleChanges, setShowScheduleChanges] = useState(false);
  const [affectedAppointments, setAffectedAppointments] = useState<any[]>([]);
  const [pendingReorder, setPendingReorder] = useState<any[] | null>(null);
  const [modalAction, setModalAction] = useState<'change' | 'delete'>('change');

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
    monday: { available: true, startTime: '08:00', endTime: '17:00', maxJobs: 6, serviceAreas: ['Nampa', 'Caldwell'] },
    tuesday: { available: true, startTime: '08:00', endTime: '17:00', maxJobs: 6, serviceAreas: ['Meridian', 'Kuna'] },
    wednesday: { available: true, startTime: '08:00', endTime: '17:00', maxJobs: 6, serviceAreas: [] },
    thursday: { available: true, startTime: '08:00', endTime: '17:00', maxJobs: 6, serviceAreas: [] },
    friday: { available: true, startTime: '08:00', endTime: '17:00', maxJobs: 6, serviceAreas: [] },
    saturday: { available: true, startTime: '08:00', endTime: '17:00', maxJobs: 4, serviceAreas: [] },
    sunday: { available: false, startTime: '08:00', endTime: '17:00', maxJobs: 0, serviceAreas: [] }
  });
  const serviceAreasList = ['Boise', 'Meridian', 'Nampa', 'Caldwell', 'Eagle', 'Kuna', 'Star', 'Garden City'];

  // Add Job modal states
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [addJobForm, setAddJobForm] = useState<any>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    address: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: '90',
    price: '',
    notes: '',
    beforePhotos: [] as File[],
    afterPhotos: [] as File[]
  });
  const [beforePhotoPreview, setBeforePhotoPreview] = useState<string[]>([]);
  const [afterPhotoPreview, setAfterPhotoPreview] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

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
    endTime: '17:00',
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

  // Job Completion Modal states
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [jobToComplete, setJobToComplete] = useState<any>(null);
  const [completionForm, setCompletionForm] = useState({
    startTime: '',
    endTime: '',
    notes: '',
    beforePhotos: [] as File[],
    afterPhotos: [] as File[]
  });
  const [completionBeforePreview, setCompletionBeforePreview] = useState<string[]>([]);
  const [completionAfterPreview, setCompletionAfterPreview] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Array<{ materialId: number; quantity: number }>>([]);
  const [customLineItems, setCustomLineItems] = useState<Array<{ description: string; amount: string }>>([]);
  const [isCompletionRecording, setIsCompletionRecording] = useState(false);
  const [completionSpeechRecognition, setCompletionSpeechRecognition] = useState<any>(null);

  // Quote Modal states
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);

  // Settings states
  const [settingsTab, setSettingsTab] = useState<'profile' | 'services' | 'areas' | 'materials'>('profile');
  const [materials, setMaterials] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [contractorServices, setContractorServices] = useState<number[]>([]);
  const [allServiceAreas, setAllServiceAreas] = useState<any[]>([]); // Master list from admin
  const [contractorAreas, setContractorAreas] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<any[]>([]); // Master list of languages from admin
  const [contractorLanguages, setContractorLanguages] = useState<number[]>([]); // Language IDs contractor speaks
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [materialForm, setMaterialForm] = useState({
    name: '',
    price: '',
    unit: 'each',
    description: ''
  });
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    phone: '',
    description: '',
    yearsInBusiness: '',
    location: '',
    googleBusinessUrl: '',
    licensed: false,
    insured: false,
    afterHoursAvailable: false,
    hourlyRate: '',
    taxRate: ''
  });

  // Stripe Connect states
  const [stripeStatus, setStripeStatus] = useState<{
    hasAccount: boolean;
    onboardingComplete: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    stripeAccountId?: string;
  } | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Earnings states
  const [earnings, setEarnings] = useState<{
    summary: {
      totalEarnings: number;
      platformFees: number;
      paymentCount: number;
      pendingAmount: number;
    };
    payments: Array<{
      id: number;
      amount: number;
      platformFee: number;
      contractorPayout: number;
      status: string;
      createdAt: string;
      invoice: {
        id: number;
        totalAmount: number;
        booking: {
          service: { name: string };
          client: { firstName: string; lastName: string };
        };
      };
    }>;
    monthlyBreakdown: Array<{
      month: string;
      earnings: number;
      fees: number;
      count: number;
    }>;
  } | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(false);

  // Toast notification helper
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

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
      // Use local date to avoid timezone issues
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const todayJobsResponse = await fetch(`${API_BASE_URL}/bookings/contractor/${user.id}?date=${today}`);
      const todayJobsData = await todayJobsResponse.json();
      if (todayJobsData.success) {
        // Filter out cancelled bookings on the frontend as well (safety check)
        const activeJobs = todayJobsData.bookings.filter((job: any) => job.status !== 'CANCELLED');
        setTodaysJobs(activeJobs);
      }

      // Fetch all bookings for history
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/contractor/${user.id}`);
      const bookingsData = await bookingsResponse.json();
      if (bookingsData.success) {
        // Show all bookings in history, sorted by date (most recent first)
        const history = bookingsData.bookings.sort((a: any, b: any) =>
          new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
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
              endTime: '17:00',
              maxJobs: 6,
              serviceAreas: []
            };
          });

          // Load saved schedule data (times already in 24-hour format from API)
          scheduleData.schedule.forEach((entry: any) => {
            const dayName = dayNames[entry.dayOfWeek];

            loadedSchedule[dayName] = {
              available: entry.isAvailable,
              startTime: entry.startTime,
              endTime: entry.endTime,
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

  const handleAcceptScheduleChanges = async (notifyCustomers: boolean) => {
    if (editingJobId) {
      // Check if this is a delete action
      if (modalAction === 'delete') {
        try {
          const response = await fetch(`${API_BASE_URL}/bookings/${editingJobId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            console.error('Failed to delete booking');
            showToast('Failed to delete job. Please try again.', 'error');
            setShowScheduleChanges(false);
            setPendingReorder(null);
            setAffectedAppointments([]);
            return;
          }

          // Remove from local state
          setTodaysJobs(todaysJobs.filter(job => job.id !== editingJobId));

          if (notifyCustomers) {
            // TODO: Send notification to the customer about cancellation
          }

          setEditingJobId(null);
          setEditFormData({});
          showToast('Job deleted successfully', 'success');
        } catch (error) {
          console.error('Error deleting job:', error);
          showToast('Failed to delete job. Please try again.', 'error');
        }
      } else {
        // Handle time change - update via API
        try {
          const newScheduledTime = `${editFormData.startTime} - ${calculateEndTime(editFormData.startTime, editFormData.duration)}`;

          // Find the job to get scheduledDate
          const job = todaysJobs.find(j => j.id === editingJobId);
          if (!job) {
            setShowScheduleChanges(false);
            setPendingReorder(null);
            setAffectedAppointments([]);
            return;
          }

          const response = await fetch(`${API_BASE_URL}/bookings/${editingJobId}/schedule`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scheduledDate: job.scheduledDate,
              scheduledTime: newScheduledTime,
              estimatedDuration: parseInt(editFormData.duration)
            })
          });

          if (!response.ok) {
            console.error('Failed to update booking schedule');
            setShowScheduleChanges(false);
            setPendingReorder(null);
            setAffectedAppointments([]);
            return;
          }

          // Update local state
          const updatedJobs = todaysJobs.map(j =>
            j.id === editingJobId
              ? {
                  ...j,
                  scheduledTime: newScheduledTime,
                  duration: `${editFormData.duration} min`
                }
              : j
          );
          setTodaysJobs(updatedJobs);

          if (notifyCustomers) {
            // TODO: Send notification to the customer
          }

          setEditingJobId(null);
          setEditFormData({});
          setTimeSlotConflicts([]);
          setNextAvailableTime(null);
        } catch (error) {
          console.error('Error updating booking schedule:', error);
        }
      }
    } else if (pendingReorder) {
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
    setEditingJobId(null);
    setEditFormData({});
    setModalAction('change');
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
      }
    }

    setShowScheduleChanges(false);
    setPendingReorder(null);
    setAffectedAppointments([]);
  };

  // Edit handlers
  const handleEditJob = (job: any) => {
    // Create an affected appointment entry for the single job being edited
    const affectedAppointment = {
      ...job,
      previousTime: job.scheduledTime,
      newTime: job.scheduledTime, // Will be updated by user in modal
      client: job.client
    };

    setAffectedAppointments([affectedAppointment]);
    setEditingJobId(job.id);
    setEditFormData({
      startTime: job.scheduledTime?.split(' - ')[0] || '',
      duration: job.duration?.replace(' min', '') || '90'
    });
    setTimeSlotConflicts([]);
    setNextAvailableTime(null);
    setModalAction('change'); // Reset to change mode
    setShowScheduleChanges(true);
  };

  // Check time slot availability
  const checkTimeSlotAvailability = async (job: any, startTime: string, durationMinutes: number) => {
    if (!user?.id || !startTime || !durationMinutes) return;

    setCheckingAvailability(true);
    try {
      const response = await fetch(`${API_BASE_URL}/time-slots/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractorId: user.id,
          date: job.scheduledDate,
          startTime,
          durationMinutes,
          excludeBookingId: job.id // Exclude current booking from conflict check
        })
      });

      const data = await response.json();

      if (data.success) {
        setTimeSlotConflicts(data.conflicts || []);
        setNextAvailableTime(data.nextAvailable);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const formatTo12Hour = (time24: string) => {
    // Convert 24-hour time (HH:MM) to 12-hour format (H:MM AM/PM)
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Get local date string in YYYY-MM-DD format (avoids UTC conversion)
  const getLocalDateString = (date: Date = new Date()) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Format date without timezone shift (parse ISO date string as local)
  const formatDateLocal = (dateString: string) => {
    // Extract just the date part (YYYY-MM-DD) from ISO string
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    // Create date using local timezone
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  // Geocode address to coordinates using OpenStreetMap Nominatim
  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        { headers: { 'User-Agent': 'FixterConnect/1.0' } }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Geocode all jobs when switching to map view
  useEffect(() => {
    const geocodeJobs = async () => {
      if (todaysJobsViewMode === 'map' && todaysJobs.length > 0) {
        setGeocodingComplete(false);
        const newCoords: {[key: number]: {lat: number, lng: number}} = {};
        for (const job of todaysJobs) {
          if (!jobCoordinates[job.id] && job.serviceAddress) {
            const coords = await geocodeAddress(job.serviceAddress);
            if (coords) {
              newCoords[job.id] = coords;
            }
            // Rate limit to avoid hitting Nominatim too fast
            await new Promise(resolve => setTimeout(resolve, 300));
          } else if (jobCoordinates[job.id]) {
            newCoords[job.id] = jobCoordinates[job.id];
          }
        }
        setJobCoordinates(prev => ({ ...prev, ...newCoords }));
        setGeocodingComplete(true);
      } else if (todaysJobsViewMode === 'map' && todaysJobs.length === 0) {
        setGeocodingComplete(true);
      }
    };
    geocodeJobs();
  }, [todaysJobsViewMode, todaysJobs]);

  // Resize image to max 800px width
  const resizeImage = (file: File, maxWidth: number = 800): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          }, 'image/jpeg', 0.85);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle photo selection for job
  const handleJobPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const files = e.target.files;
    if (!files) return;

    const resizedFiles: File[] = [];
    const previews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const resized = await resizeImage(files[i]);
        resizedFiles.push(resized);
        previews.push(URL.createObjectURL(resized));
      } catch (error) {
        console.error('Error resizing image:', error);
      }
    }

    if (type === 'before') {
      setAddJobForm({ ...addJobForm, beforePhotos: [...addJobForm.beforePhotos, ...resizedFiles] });
      setBeforePhotoPreview([...beforePhotoPreview, ...previews]);
    } else {
      setAddJobForm({ ...addJobForm, afterPhotos: [...addJobForm.afterPhotos, ...resizedFiles] });
      setAfterPhotoPreview([...afterPhotoPreview, ...previews]);
    }
  };

  // Remove photo from job form
  const handleRemoveJobPhoto = (index: number, type: 'before' | 'after') => {
    if (type === 'before') {
      const newPhotos = [...addJobForm.beforePhotos];
      newPhotos.splice(index, 1);
      setAddJobForm({ ...addJobForm, beforePhotos: newPhotos });
      const newPreviews = [...beforePhotoPreview];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      setBeforePhotoPreview(newPreviews);
    } else {
      const newPhotos = [...addJobForm.afterPhotos];
      newPhotos.splice(index, 1);
      setAddJobForm({ ...addJobForm, afterPhotos: newPhotos });
      const newPreviews = [...afterPhotoPreview];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      setAfterPhotoPreview(newPreviews);
    }
  };

  // Upload photos to server
  const uploadJobPhotos = async (bookingId: number, photos: File[], photoType: 'before' | 'after'): Promise<string[]> => {
    if (photos.length === 0) return [];

    const formData = new FormData();
    formData.append('bookingId', bookingId.toString());
    formData.append('photoType', photoType);
    photos.forEach(photo => formData.append('photos', photo));

    const response = await fetch(`${API_BASE_URL}/upload/job-photos`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.success ? data.imageUrls : [];
  };

  // Voice-to-text for notes
  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice recognition is not supported in your browser', 'error');
      return;
    }

    if (isRecording && speechRecognition) {
      speechRecognition.stop();
      setIsRecording(false);
      setSpeechRecognition(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setAddJobForm((prev: any) => ({
          ...prev,
          notes: prev.notes + (prev.notes ? ' ' : '') + finalTranscript
        }));
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setSpeechRecognition(null);
      if (event.error === 'not-allowed') {
        showToast('Microphone access denied. Please enable it in your browser settings.', 'error');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      setSpeechRecognition(null);
    };

    recognition.start();
    setSpeechRecognition(recognition);
  };

  const handleAddJob = async () => {
    try {
      // Validate required fields
      if (!addJobForm.clientName || !addJobForm.service || !addJobForm.address || !addJobForm.scheduledDate || !addJobForm.scheduledTime) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      setUploadingPhotos(true);

      // Create a manual booking
      const response = await fetch(`${API_BASE_URL}/bookings/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: user?.id,
          clientName: addJobForm.clientName,
          clientEmail: addJobForm.clientEmail,
          clientPhone: addJobForm.clientPhone,
          serviceName: addJobForm.service,
          serviceAddress: addJobForm.address,
          scheduledDate: addJobForm.scheduledDate,
          scheduledTime: addJobForm.scheduledTime,
          estimatedDuration: parseInt(addJobForm.duration),
          price: addJobForm.price ? parseFloat(addJobForm.price) : null,
          notes: addJobForm.notes
        })
      });

      const data = await response.json();

      if (data.success) {
        // Upload photos if any
        const bookingId = data.booking.id;
        if (addJobForm.beforePhotos.length > 0) {
          await uploadJobPhotos(bookingId, addJobForm.beforePhotos, 'before');
        }
        if (addJobForm.afterPhotos.length > 0) {
          await uploadJobPhotos(bookingId, addJobForm.afterPhotos, 'after');
        }

        showToast('Job added successfully!', 'success');
        setShowAddJobModal(false);
        // Reset form and previews
        setAddJobForm({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          service: '',
          address: '',
          scheduledDate: '',
          scheduledTime: '',
          duration: '90',
          price: '',
          notes: '',
          beforePhotos: [],
          afterPhotos: []
        });
        beforePhotoPreview.forEach(url => URL.revokeObjectURL(url));
        afterPhotoPreview.forEach(url => URL.revokeObjectURL(url));
        setBeforePhotoPreview([]);
        setAfterPhotoPreview([]);
        // Refresh data to show the new job
        fetchContractorData();
      } else {
        showToast(data.error || 'Failed to add job', 'error');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      showToast('Failed to add job. Please try again.', 'error');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleCompleteJob = (job: any) => {
    setJobToComplete(job);

    // Check for saved draft
    const savedDraft = localStorage.getItem(`completion-draft-${job.id}`);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setCompletionForm({
          startTime: draft.startTime || '',
          endTime: draft.endTime || '',
          notes: draft.notes || job.notes || '',
          beforePhotos: [],
          afterPhotos: []
        });
        setSelectedMaterials(draft.selectedMaterials || []);
        setCustomLineItems(draft.customLineItems || []);
      } catch (e) {
        // If parsing fails, use defaults
        setCompletionForm({
          startTime: '',
          endTime: '',
          notes: job.notes || '',
          beforePhotos: [],
          afterPhotos: []
        });
        setSelectedMaterials([]);
        setCustomLineItems([]);
      }
    } else {
      // Pre-fill notes if the job already has notes
      setCompletionForm({
        startTime: '',
        endTime: '',
        notes: job.notes || '',
        beforePhotos: [],
        afterPhotos: []
      });
      setSelectedMaterials([]);
      setCustomLineItems([]);
    }
    setCompletionBeforePreview([]);
    setCompletionAfterPreview([]);
    setShowCompleteModal(true);
  };

  // Save completion draft to localStorage
  const saveCompletionDraft = () => {
    if (!jobToComplete) return;

    const draft = {
      startTime: completionForm.startTime,
      endTime: completionForm.endTime,
      notes: completionForm.notes,
      selectedMaterials: selectedMaterials,
      customLineItems: customLineItems,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(`completion-draft-${jobToComplete.id}`, JSON.stringify(draft));
    showToast('Draft saved! You can return to complete this job later.', 'success');
    setShowCompleteModal(false);
    setJobToComplete(null);
  };

  // Clear completion draft from localStorage
  const clearCompletionDraft = (jobId: number) => {
    localStorage.removeItem(`completion-draft-${jobId}`);
  };

  // Calculate labor cost based on start/end time and hourly rate
  const calculateLaborCost = () => {
    if (!completionForm.startTime || !completionForm.endTime || !profile?.hourlyRate) {
      return 0;
    }
    const [startH, startM] = completionForm.startTime.split(':').map(Number);
    const [endH, endM] = completionForm.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const hoursWorked = (endMinutes - startMinutes) / 60;
    return Math.max(0, hoursWorked * profile.hourlyRate);
  };

  // Calculate materials cost from selected materials
  const calculateMaterialsCost = () => {
    return selectedMaterials.reduce((total, item) => {
      const material = materials.find(m => m.id === item.materialId);
      if (material) {
        return total + (material.price * item.quantity);
      }
      return total;
    }, 0);
  };

  // Calculate custom line items total
  const calculateCustomItemsTotal = () => {
    return customLineItems.reduce((total, item) => {
      return total + (parseFloat(item.amount) || 0);
    }, 0);
  };

  // Calculate invoice totals
  const calculateInvoiceTotals = () => {
    const laborCost = calculateLaborCost();
    const materialsCost = calculateMaterialsCost();
    const customItemsCost = calculateCustomItemsTotal();
    const subtotal = laborCost + materialsCost + customItemsCost;
    const taxRate = profile?.taxRate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    return { laborCost, materialsCost, customItemsCost, subtotal, taxRate, taxAmount, total };
  };

  // Handle adding a material to the completion
  const handleAddMaterial = (materialId: number) => {
    if (selectedMaterials.some(m => m.materialId === materialId)) {
      return; // Already added
    }
    setSelectedMaterials([...selectedMaterials, { materialId, quantity: 1 }]);
  };

  // Handle updating material quantity
  const handleUpdateMaterialQuantity = (materialId: number, quantity: number) => {
    setSelectedMaterials(selectedMaterials.map(m =>
      m.materialId === materialId ? { ...m, quantity: Math.max(1, quantity) } : m
    ));
  };

  // Handle removing a material
  const handleRemoveMaterial = (materialId: number) => {
    setSelectedMaterials(selectedMaterials.filter(m => m.materialId !== materialId));
  };

  // Handle adding a custom line item
  const handleAddCustomItem = () => {
    setCustomLineItems([...customLineItems, { description: '', amount: '' }]);
  };

  // Handle updating custom item
  const handleUpdateCustomItem = (index: number, field: 'description' | 'amount', value: string) => {
    setCustomLineItems(customLineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // Handle removing custom item
  const handleRemoveCustomItem = (index: number) => {
    setCustomLineItems(customLineItems.filter((_, i) => i !== index));
  };

  // Voice-to-text for completion notes
  const toggleCompletionVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice recognition is not supported in your browser', 'error');
      return;
    }

    if (isCompletionRecording && completionSpeechRecognition) {
      completionSpeechRecognition.stop();
      setIsCompletionRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setCompletionForm(prev => ({
          ...prev,
          notes: prev.notes + (prev.notes ? ' ' : '') + finalTranscript
        }));
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsCompletionRecording(false);
      showToast('Voice recognition error. Please try again.', 'error');
    };

    recognition.onend = () => {
      setIsCompletionRecording(false);
    };

    recognition.start();
    setCompletionSpeechRecognition(recognition);
    setIsCompletionRecording(true);
  };

  // Handle completion photo uploads
  const handleCompletionPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const resizedFiles: File[] = [];
    const previews: string[] = [];

    for (const file of files) {
      const resized = await resizeImage(file, 800);
      resizedFiles.push(resized);
      previews.push(URL.createObjectURL(resized));
    }

    if (type === 'before') {
      setCompletionForm(prev => ({ ...prev, beforePhotos: [...prev.beforePhotos, ...resizedFiles] }));
      setCompletionBeforePreview(prev => [...prev, ...previews]);
    } else {
      setCompletionForm(prev => ({ ...prev, afterPhotos: [...prev.afterPhotos, ...resizedFiles] }));
      setCompletionAfterPreview(prev => [...prev, ...previews]);
    }
  };

  const submitJobCompletion = async () => {
    if (!jobToComplete) return;

    const totals = calculateInvoiceTotals();

    // Build materials description from selected materials
    const materialsDescription = selectedMaterials.map(item => {
      const material = materials.find(m => m.id === item.materialId);
      return material ? `${item.quantity}x ${material.name}` : '';
    }).filter(Boolean).join(', ');

    // Build custom items description
    const customItemsDescription = customLineItems
      .filter(item => item.description && item.amount)
      .map(item => `${item.description}: $${item.amount}`)
      .join(', ');

    const allMaterials = [materialsDescription, customItemsDescription].filter(Boolean).join('; ');

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${jobToComplete.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startTime: completionForm.startTime ? new Date(`${getLocalDateString()}T${completionForm.startTime}:00`).toISOString() : null,
          endTime: completionForm.endTime ? new Date(`${getLocalDateString()}T${completionForm.endTime}:00`).toISOString() : null,
          laborCost: totals.laborCost,
          materialsCost: totals.materialsCost + totals.customItemsCost,
          taxRate: totals.taxRate,
          notes: completionForm.notes,
          materials: allMaterials
        })
      });

      const data = await response.json();

      if (data.success) {
        // Upload photos if any
        if (completionForm.beforePhotos.length > 0 || completionForm.afterPhotos.length > 0) {
          const formData = new FormData();
          formData.append('bookingId', String(jobToComplete.id));

          if (completionForm.beforePhotos.length > 0) {
            formData.set('photoType', 'before');
            completionForm.beforePhotos.forEach(photo => formData.append('photos', photo));
            await fetch(`${API_BASE_URL}/upload/job-photos`, { method: 'POST', body: formData });
          }

          if (completionForm.afterPhotos.length > 0) {
            const afterFormData = new FormData();
            afterFormData.append('bookingId', String(jobToComplete.id));
            afterFormData.set('photoType', 'after');
            completionForm.afterPhotos.forEach(photo => afterFormData.append('photos', photo));
            await fetch(`${API_BASE_URL}/upload/job-photos`, { method: 'POST', body: afterFormData });
          }
        }

        // Clear any saved draft for this job
        clearCompletionDraft(jobToComplete.id);

        showToast('Job marked as complete! Invoice generated.', 'success');
        setShowCompleteModal(false);
        setJobToComplete(null);
        setCompletionForm({
          startTime: '',
          endTime: '',
          notes: '',
          beforePhotos: [],
          afterPhotos: []
        });
        setCompletionBeforePreview([]);
        setCompletionAfterPreview([]);
        setSelectedMaterials([]);
        setCustomLineItems([]);
        fetchContractorData();
      } else {
        showToast(data.error || 'Failed to complete job', 'error');
      }
    } catch (error) {
      console.error('Error completing job:', error);
      showToast('Failed to complete job. Please try again.', 'error');
    }
  };

  const handleCancelJob = async (jobId: number, jobName: string) => {
    const confirmed = window.confirm(`Are you sure you want to cancel "${jobName}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${jobId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        showToast('Job cancelled successfully', 'success');
        fetchContractorData();
      } else {
        showToast(data.error || 'Failed to cancel job', 'error');
      }
    } catch (error) {
      console.error('Error cancelling job:', error);
      showToast('Failed to cancel job. Please try again.', 'error');
    }
  };

  // Quote handlers
  const handleOpenQuoteModal = (quote: any) => {
    setSelectedQuote(quote);
    setQuotePrice('');
    setQuoteNotes('');
    setShowQuoteModal(true);
  };

  const handleSendQuote = async () => {
    if (!selectedQuote || !quotePrice) {
      showToast('Please enter a price for the quote', 'error');
      return;
    }

    const price = parseFloat(quotePrice);
    if (isNaN(price) || price <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    try {
      setSendingQuote(true);

      // Update the booking with the price and change status to CONFIRMED
      const response = await fetch(`${API_BASE_URL}/bookings/${selectedQuote.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CONFIRMED',
          price: price
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast('Quote sent successfully! The client has been notified.', 'success');
        setShowQuoteModal(false);
        setSelectedQuote(null);
        setQuotePrice('');
        setQuoteNotes('');
        fetchContractorData();
      } else {
        showToast(data.error || 'Failed to send quote', 'error');
      }
    } catch (error) {
      console.error('Error sending quote:', error);
      showToast('Failed to send quote. Please try again.', 'error');
    } finally {
      setSendingQuote(false);
    }
  };

  const handleDeclineQuote = async (quote: any) => {
    const confirmed = window.confirm(
      `Are you sure you want to decline this quote request from ${quote.client.firstName} ${quote.client.lastName} for ${quote.service.name}?`
    );
    if (!confirmed) return;

    try {
      // Update status to CANCELLED to decline the quote
      const response = await fetch(`${API_BASE_URL}/bookings/${quote.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED'
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast('Quote request declined', 'info');
        fetchContractorData();
      } else {
        showToast(data.error || 'Failed to decline quote', 'error');
      }
    } catch (error) {
      console.error('Error declining quote:', error);
      showToast('Failed to decline quote. Please try again.', 'error');
    }
  };

  const handleDeleteJob = async (jobId: number, jobName: string) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${jobName}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${jobId}/permanent`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        showToast('Job deleted successfully', 'success');
        fetchContractorData();
      } else {
        showToast(data.error || 'Failed to delete job', 'error');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showToast('Failed to delete job. Please try again.', 'error');
    }
  };

  // Check if a job's scheduled date is today (using local timezone)
  const isJobToday = (scheduledDate: string) => {
    const datePart = scheduledDate.split('T')[0];
    const today = getLocalDateString();
    return datePart === today;
  };

  const menuItems = [
    { id: 'today' as ActiveSection, label: "Today's Jobs", icon: Calendar },
    { id: 'messages' as ActiveSection, label: 'Messages', icon: MessageSquare },
    { id: 'invoices' as ActiveSection, label: 'Invoices', icon: FileText },
    { id: 'history' as ActiveSection, label: 'Job History', icon: Clock },
    { id: 'calendar' as ActiveSection, label: 'Calendar', icon: Calendar },
    { id: 'quotes' as ActiveSection, label: 'Quotes', icon: DollarSign },
    { id: 'earnings' as ActiveSection, label: 'Earnings', icon: CreditCard },
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
          <button
            onClick={() => setTodaysJobsViewMode('list')}
            style={{
              padding: '10px 20px',
              backgroundColor: todaysJobsViewMode === 'list' ? '#f1f5f9' : 'transparent',
              color: todaysJobsViewMode === 'list' ? '#1e293b' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
            LIST VIEW
          </button>
          <button
            onClick={() => setTodaysJobsViewMode('map')}
            style={{
              padding: '10px 20px',
              backgroundColor: todaysJobsViewMode === 'map' ? '#3b82f6' : 'transparent',
              color: todaysJobsViewMode === 'map' ? 'white' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
            MAP VIEW
          </button>
          <button
            onClick={fetchContractorData}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
            REFRESH
          </button>
          <button
            onClick={() => setShowAddJobModal(true)}
            style={{
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
        </div>
      </div>

      {/* Jobs Content - List or Map View */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : todaysJobsViewMode === 'map' ? (
        /* Map View */
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Today's Jobs - Map View</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', marginBottom: 0 }}>Click on markers to view job details and get directions</p>
          </div>

          {todaysJobs.length > 0 ? (
            <>
              <div style={{ height: '500px', position: 'relative' }}>
                {geocodingComplete ? (
                  <MapContainer
                    center={
                      Object.keys(jobCoordinates).length > 0
                        ? [
                            Object.values(jobCoordinates).reduce((sum, c) => sum + c.lat, 0) / Object.values(jobCoordinates).length,
                            Object.values(jobCoordinates).reduce((sum, c) => sum + c.lng, 0) / Object.values(jobCoordinates).length
                          ]
                        : [43.6150, -116.2023] // Default to Boise, ID if no coordinates found
                    }
                    zoom={Object.keys(jobCoordinates).length > 0 ? 11 : 10}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {todaysJobs.map((job, index) => {
                      const coords = jobCoordinates[job.id];
                      if (!coords) return null;
                      return (
                        <Marker
                          key={job.id}
                          position={[coords.lat, coords.lng]}
                          icon={createNumberedIcon(index + 1)}
                        >
                          <Popup>
                            <div style={{ minWidth: '250px' }}>
                              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
                                Job #{index + 1}: {job.client.firstName} {job.client.lastName}
                              </h4>
                              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                                <strong>Service:</strong> {job.service.name}
                              </p>
                              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                                <strong>Time:</strong> {formatScheduledTime(job.scheduledTime)}
                              </p>
                              {job.client.phone && (
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                                  <strong>Phone:</strong> {job.client.phone}
                                </p>
                              )}
                              <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                                <a
                                  href={`https://maps.google.com/?q=${encodeURIComponent(job.serviceAddress)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                                >
                                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                  <strong>Address:</strong> {job.serviceAddress}
                                </a>
                              </p>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <a
                                  href={`https://maps.google.com/maps?daddr=${encodeURIComponent(job.serviceAddress)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <Navigation size={14} />
                                  GET DIRECTIONS
                                </a>
                                {job.client.phone && (
                                  <a
                                    href={`tel:${job.client.phone}`}
                                    style={{
                                      flex: 1,
                                      padding: '8px 12px',
                                      backgroundColor: '#3b82f6',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      textAlign: 'center',
                                      textDecoration: 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <Phone size={14} />
                                    CALL
                                  </a>
                                )}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    Loading map coordinates...
                  </div>
                )}
              </div>

              {/* Warning if some addresses couldn't be geocoded */}
              {geocodingComplete && Object.keys(jobCoordinates).length < todaysJobs.length && (
                <div style={{
                  padding: '12px 20px',
                  backgroundColor: '#fef3c7',
                  borderTop: '1px solid #fcd34d',
                  color: '#92400e',
                  fontSize: '14px'
                }}>
                  <strong>Note:</strong> {todaysJobs.length - Object.keys(jobCoordinates).length} job address(es) couldn't be found on the map. Please verify the addresses are correct.
                </div>
              )}

              {/* Route Summary */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>
                  Today's Route ({todaysJobs.length} jobs): <span style={{ fontWeight: 'normal', color: '#64748b', fontSize: '13px' }}>Drag to reorder</span>
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {todaysJobs.map((job, index) => (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: draggedIndex === index ? '#e0e7ff' : 'white',
                        borderRadius: '20px',
                        border: draggedIndex === index ? '1px solid #818cf8' : '1px solid #e2e8f0',
                        fontSize: '13px',
                        cursor: 'grab',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ color: '#1e293b' }}>{job.client.firstName} {job.client.lastName}</span>
                      <span style={{ color: '#64748b' }}>- {formatScheduledTime(job.scheduledTime)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Calendar size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>No jobs scheduled for today</p>
            </div>
          )}
        </div>
      ) : todaysJobs.length > 0 ? (
        /* List View */
        <div style={{ display: 'grid', gap: '20px' }}>
          {todaysJobs.map((job, index) => (
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

                  {/* View Mode */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '15px', marginBottom: '12px' }}>
                    <span>{job.service.name}</span>
                    <span>•</span>
                    <span>{formatScheduledTime(job.scheduledTime)}</span>
                    <span style={{ marginLeft: '4px' }}>({job.duration || '90 min'})</span>
                    <Edit2
                      size={16}
                      onClick={() => handleEditJob(job)}
                      style={{
                        cursor: 'pointer',
                        color: '#4f46e5',
                        marginLeft: '4px'
                      }}
                    />
                  </div>

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
                        {job.client.phone ? (
                          <a href={`tel:${job.client.phone}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>
                            {job.client.phone}
                          </a>
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>✉️</span>
                        <span>{job.client.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'center' }}>
                  {job.status === 'COMPLETED' ? (
                    <span style={{
                      padding: '8px 16px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      Complete
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleCompleteJob(job)}
                        disabled={!isJobToday(job.scheduledDate)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: isJobToday(job.scheduledDate) ? '#10b981' : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: isJobToday(job.scheduledDate) ? 'pointer' : 'not-allowed',
                          textTransform: 'uppercase'
                        }}>
                        COMPLETE
                      </button>
                      <button
                        onClick={() => handleCancelJob(job.id, `${job.client.firstName} ${job.client.lastName} - ${job.service.name}`)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textTransform: 'uppercase'
                        }}>
                        CANCEL
                      </button>
                    </>
                  )}
                </div>
              </div>
          ))}
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
      showToast('Failed to send message', 'error');
    }
  };

  const handleFlagMessage = (msg: any) => {
    setMessageToFlag(msg);
    setShowFlagModal(true);
  };

  const handleSubmitFlag = async () => {
    if (!flagReason || !messageToFlag || !user) {
      showToast('Please select a reason for flagging', 'error');
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
        showToast('Message flagged for review', 'success');
        setShowFlagModal(false);
        setMessageToFlag(null);
        setFlagReason('');
        setFlagDetails('');
      } else {
        showToast('Failed to flag message', 'error');
      }
    } catch (error) {
      console.error('Error flagging message:', error);
      showToast('Failed to flag message', 'error');
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

  const handleMarkInvoicePaid = async (invoiceId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'PAID' })
      });

      const data = await response.json();

      if (data.success) {
        showToast('Invoice marked as paid', 'success');
        fetchContractorData();
      } else {
        showToast(data.error || 'Failed to update invoice', 'error');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      showToast('Failed to update invoice', 'error');
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return { bg: '#dcfce7', text: '#166534' };
      case 'PENDING':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'OVERDUE':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'CANCELLED':
        return { bg: '#f1f5f9', text: '#64748b' };
      default:
        return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const renderInvoices = () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
        Invoices
      </h2>
      {invoices.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {invoices.map((invoice: any) => {
            const statusColors = getInvoiceStatusColor(invoice.status);
            return (
              <div
                key={invoice.id}
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
                      Invoice #{invoice.id}
                    </h3>
                    <p style={{ color: '#1e293b', fontSize: '14px', margin: '0 0 4px 0', fontWeight: '500' }}>
                      {invoice.booking?.service?.name || 'Service'}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>
                      {invoice.booking?.client?.firstName} {invoice.booking?.client?.lastName}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                      Created: {new Date(invoice.createdAt).toLocaleDateString()}
                      {invoice.dueDate && ` • Due: ${new Date(invoice.dueDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
                      ${invoice.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>
                      {invoice.status}
                    </span>
                  </div>
                </div>

                {/* Invoice details breakdown */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#64748b' }}>
                    <span>Subtotal: ${invoice.amount?.toFixed(2) || '0.00'}</span>
                    {invoice.taxAmount && <span>Tax: ${invoice.taxAmount.toFixed(2)}</span>}
                  </div>

                  {invoice.status === 'PENDING' && (
                    <button
                      onClick={() => handleMarkInvoicePaid(invoice.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Mark as Paid
                    </button>
                  )}

                  {invoice.status === 'PAID' && invoice.paidAt && (
                    <span style={{ fontSize: '12px', color: '#10b981' }}>
                      Paid on {new Date(invoice.paidAt).toLocaleDateString()}
                    </span>
                  )}
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
          <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>No invoices yet</p>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '8px' }}>
            Invoices will appear here when you complete jobs
          </p>
        </div>
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
                  backgroundColor: job.status === 'COMPLETED' ? '#dcfce7' :
                                   job.status === 'CONFIRMED' ? '#dbeafe' :
                                   job.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                  color: job.status === 'COMPLETED' ? '#166534' :
                         job.status === 'CONFIRMED' ? '#1e40af' :
                         job.status === 'PENDING' ? '#92400e' : '#991b1b',
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
                <strong>Date:</strong> {formatDateLocal(job.scheduledDate)}
              </p>
              <p style={{ color: '#64748b', marginBottom: '12px' }}>
                <strong>Amount:</strong> ${job.price || 'N/A'}
              </p>
              <button
                onClick={() => handleDeleteJob(job.id, `${job.client.firstName} ${job.client.lastName} - ${job.service.name}`)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                Delete
              </button>
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
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const startOfMonthStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month + 1, 0).getDate();
        const endOfMonthStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        const filtered = data.filter((booking: any) => {
          if (booking.status?.toUpperCase() !== 'CONFIRMED') return false;
          // Extract just the date part to avoid timezone issues
          const bookingDateStr = booking.scheduledDate.split('T')[0];
          return bookingDateStr >= startOfMonthStr && bookingDateStr <= endOfMonthStr;
        });

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
      const dateStr = getLocalDateString(date);
      return monthlyBookings.filter(booking => {
        // Extract just the date part from the ISO string to avoid timezone issues
        const bookingDateStr = booking.scheduledDate.split('T')[0];
        return bookingDateStr === dateStr;
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
                          {formatDateLocal(booking.scheduledDate)} - {booking.client?.firstName} {booking.client?.lastName}
                        </p>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                          {booking.service?.name} ({formatScheduledTime(booking.scheduledTime)})
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
                          <p style={{ color: '#4f46e5', fontSize: '14px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {job.service?.name} • {formatScheduledTime(job.scheduledTime)} ({job.duration || '90 min'})
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditJob(job);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                color: '#64748b'
                              }}
                              title="Edit booking"
                            >
                              <Edit2 size={14} />
                            </button>
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
                          📞 {job.client?.phone ? (
                            <a href={`tel:${job.client.phone}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>
                              {job.client.phone}
                            </a>
                          ) : 'N/A'}
                        </p>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                          ✉️ {job.client?.email || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleCompleteJob(job)}
                        disabled={!isJobToday(job.scheduledDate)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: isJobToday(job.scheduledDate) ? '#10b981' : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: isJobToday(job.scheduledDate) ? 'pointer' : 'not-allowed'
                        }}>
                        COMPLETE
                      </button>
                      <button
                        onClick={() => {
                          handleCancelJob(job.id, `${job.client?.firstName} ${job.client?.lastName} - ${job.service?.name}`);
                        }}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                        CANCEL
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
                          // Times are already in 24-hour format
                          return {
                            dayOfWeek: dayMapping[day],
                            startTime: schedule.startTime,
                            endTime: schedule.endTime,
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
                        showToast('Schedule saved successfully!', 'success');
                      } else {
                        showToast(result.error || 'Failed to save schedule', 'error');
                      }
                    } catch (error) {
                      console.error('Error saving schedule:', error);
                      showToast('Failed to save schedule', 'error');
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
                        endTime: '17:00',
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

                                        showToast('Override deleted', 'success');
                                      }
                                    } catch (error) {
                                      console.error('Error deleting override:', error);
                                      showToast('Failed to delete override', 'error');
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
                      const dateString = getLocalDateString(currentDate);
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
                                endTime: defaultSchedule.endTime,
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
                            showToast('Please select both start and end dates', 'error');
                            return;
                          }
                          if (new Date(overrideForm.endDate) < new Date(overrideForm.startDate)) {
                            showToast('End date must be after start date', 'error');
                            return;
                          }
                        } else {
                          if (!overrideForm.specificDate) {
                            showToast('Please select a date', 'error');
                            return;
                          }
                        }

                        try {
                          // Times are already in 24-hour format from the input
                          const startTimeFormatted = overrideForm.isAvailable ? overrideForm.startTime : '00:00';
                          const endTimeFormatted = overrideForm.isAvailable ? overrideForm.endTime : '00:00';
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
                            showToast(`Successfully created overrides for ${successCount} of ${dates.length} days`, 'success');
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
                              showToast(result.message || 'Date override saved successfully!', 'success');
                            } else {
                              showToast(`Failed to save: ${result.error}`, 'error');
                            }
                          }
                        } catch (error) {
                          console.error('Error saving override:', error);
                          showToast('Failed to save date override', 'error');
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
                <strong>Date:</strong> {formatDateLocal(quote.scheduledDate)}
              </p>
              <p style={{ color: '#64748b', marginBottom: '4px' }}>
                <strong>Time:</strong> {quote.scheduledTime}
              </p>
              <p style={{ color: '#64748b', marginBottom: '16px' }}>
                <strong>Address:</strong> {quote.serviceAddress}
              </p>
              {quote.notes && (
                <p style={{ color: '#64748b', marginBottom: '16px', fontStyle: 'italic' }}>
                  <strong>Notes:</strong> {quote.notes}
                </p>
              )}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleOpenQuoteModal(quote)}
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
                <button
                  onClick={() => handleDeclineQuote(quote)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#94a3b8' }}>No pending quote requests</p>
      )}

      {/* Send Quote Modal */}
      {showQuoteModal && selectedQuote && (
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
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
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
                Send Quote
              </h2>
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  setSelectedQuote(null);
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={24} color="#64748b" />
              </button>
            </div>

            {/* Quote Details */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                {selectedQuote.service.name}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                <strong>Client:</strong> {selectedQuote.client.firstName} {selectedQuote.client.lastName}
              </p>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                <strong>Date:</strong> {formatDateLocal(selectedQuote.scheduledDate)}
              </p>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                <strong>Time:</strong> {selectedQuote.scheduledTime}
              </p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                <strong>Address:</strong> {selectedQuote.serviceAddress}
              </p>
            </div>

            {/* Price Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Quote Price *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 30px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Notes Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Notes (optional)
              </label>
              <textarea
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                placeholder="Add any details about the quote..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  setSelectedQuote(null);
                }}
                disabled={sendingQuote}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: sendingQuote ? 'not-allowed' : 'pointer',
                  opacity: sendingQuote ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendQuote}
                disabled={sendingQuote || !quotePrice}
                style={{
                  padding: '12px 24px',
                  backgroundColor: sendingQuote || !quotePrice ? '#94a3b8' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: sendingQuote || !quotePrice ? 'not-allowed' : 'pointer'
                }}
              >
                {sendingQuote ? 'Sending...' : 'Send Quote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEarnings = () => {
    if (earningsLoading) {
      return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '40px auto'
          }} />
          <p style={{ color: '#64748b' }}>Loading earnings...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    if (!earnings) {
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
            Earnings
          </h2>
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #fbbf24',
            textAlign: 'center'
          }}>
            <CreditCard size={48} color="#f59e0b" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
              Set Up Payment Account
            </h3>
            <p style={{ color: '#a16207', marginBottom: '16px' }}>
              Complete your Stripe Connect setup in Settings to receive payments and view earnings.
            </p>
            <button
              onClick={() => setActiveSection('settings')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Go to Settings
            </button>
          </div>
        </div>
      );
    }

    const { summary, payments, monthlyBreakdown } = earnings;

    return (
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
          Earnings
        </h2>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Total Earnings */}
          <div style={{
            backgroundColor: '#ecfdf5',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #a7f3d0'
          }}>
            <p style={{ fontSize: '14px', color: '#059669', marginBottom: '4px', fontWeight: '600' }}>
              Total Earnings
            </p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#047857' }}>
              ${summary.totalEarnings.toFixed(2)}
            </p>
          </div>

          {/* Platform Fees */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
              Platform Fees (5%)
            </p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>
              ${summary.platformFees.toFixed(2)}
            </p>
          </div>

          {/* Payment Count */}
          <div style={{
            backgroundColor: '#eff6ff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #bfdbfe'
          }}>
            <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '4px', fontWeight: '600' }}>
              Payments Received
            </p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1d4ed8' }}>
              {summary.paymentCount}
            </p>
          </div>

          {/* Pending Amount */}
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #fcd34d'
          }}>
            <p style={{ fontSize: '14px', color: '#d97706', marginBottom: '4px', fontWeight: '600' }}>
              Pending
            </p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#b45309' }}>
              ${summary.pendingAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        {monthlyBreakdown.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
              Monthly Breakdown
            </h3>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Month</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Earnings</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Fees</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Payments</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyBreakdown.map((month, index) => (
                    <tr key={month.month} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>{month.month}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', color: '#059669', fontWeight: '600' }}>${month.earnings.toFixed(2)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', color: '#64748b' }}>${month.fees.toFixed(2)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', color: '#1e293b' }}>{month.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Payments */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
            Recent Payments
          </h3>
          {payments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {payments.map(payment => (
                <div
                  key={payment.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                      {payment.invoice?.booking?.service?.name || 'Service'}
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>
                      {payment.invoice?.booking?.client
                        ? `${payment.invoice.booking.client.firstName} ${payment.invoice.booking.client.lastName}`
                        : 'Client'} • {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                      ${payment.contractorPayout.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Fee: ${payment.platformFee.toFixed(2)}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: payment.status === 'SUCCEEDED' ? '#dcfce7' : '#fef3c7',
                      color: payment.status === 'SUCCEEDED' ? '#166534' : '#92400e'
                    }}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <CreditCard size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#64748b', fontSize: '15px' }}>
                No payments received yet. Once clients pay their invoices, they'll appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Load settings data when settings tab is active
  useEffect(() => {
    if (activeSection === 'settings' && user?.id) {
      loadSettingsData();
    }
  }, [activeSection, user?.id]);

  // Load earnings data when earnings tab is active
  useEffect(() => {
    if (activeSection === 'earnings' && user?.id) {
      fetchEarnings();
    }
  }, [activeSection, user?.id]);

  const fetchEarnings = async () => {
    if (!user?.id) return;

    try {
      setEarningsLoading(true);
      const response = await fetch(`${API_BASE_URL}/stripe/earnings/${user.id}`);
      const data = await response.json();

      if (data.success) {
        setEarnings(data);
      } else {
        console.error('Error fetching earnings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setEarningsLoading(false);
    }
  };

  // Check for Stripe onboarding return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stripeOnboarding = urlParams.get('stripe_onboarding');
    const stripeRefresh = urlParams.get('stripe_refresh');

    if (stripeOnboarding === 'complete') {
      showToast('Stripe account setup complete!', 'success');
      setActiveSection('settings');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh Stripe status
      if (user?.id) {
        fetch(`${API_BASE_URL}/stripe/connect/status/${user.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setStripeStatus(data.status);
            }
          });
      }
    } else if (stripeRefresh === 'true') {
      showToast('Please complete your Stripe setup', 'info');
      setActiveSection('settings');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user?.id]);

  // Populate profile form when navigating to settings (only on initial load or section change)
  const [settingsInitialized, setSettingsInitialized] = useState(false);
  useEffect(() => {
    if (profile && activeSection === 'settings' && !settingsInitialized) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        description: profile.description || '',
        yearsInBusiness: profile.yearsInBusiness?.toString() || '',
        location: profile.location || '',
        googleBusinessUrl: profile.googleBusinessUrl || '',
        licensed: profile.licensed || false,
        insured: profile.insured || false,
        afterHoursAvailable: profile.afterHoursAvailable || false,
        hourlyRate: profile.hourlyRate?.toString() || '',
        taxRate: profile.taxRate?.toString() || ''
      });
      setSettingsInitialized(true);
    }
    // Reset initialized flag when leaving settings
    if (activeSection !== 'settings') {
      setSettingsInitialized(false);
    }
  }, [profile, activeSection, settingsInitialized]);

  const loadSettingsData = async () => {
    if (!user?.id) return;

    try {
      // Load all services
      const servicesResponse = await fetch(`${API_BASE_URL}/services`);
      const servicesData = await servicesResponse.json();
      if (servicesData.success) {
        setAllServices(servicesData.services);
      }

      // Load all available service areas (master list from admin)
      const allAreasResponse = await fetch(`${API_BASE_URL}/service-areas`);
      const allAreasData = await allAreasResponse.json();
      if (Array.isArray(allAreasData)) {
        setAllServiceAreas(allAreasData);
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

      // Load all available languages (master list from admin)
      const languagesResponse = await fetch(`${API_BASE_URL}/languages`);
      const languagesData = await languagesResponse.json();
      if (languagesData.success) {
        setAllLanguages(languagesData.languages);
      }

      // Load contractor's languages
      const contractorLanguagesResponse = await fetch(`${API_BASE_URL}/contractor/${user.id}/languages`);
      const contractorLanguagesData = await contractorLanguagesResponse.json();
      if (contractorLanguagesData.success) {
        setContractorLanguages(contractorLanguagesData.languages.map((l: any) => l.id));
      }

      // Load Stripe Connect status
      try {
        const stripeResponse = await fetch(`${API_BASE_URL}/stripe/connect/status/${user.id}`);
        const stripeData = await stripeResponse.json();
        if (stripeData.success) {
          setStripeStatus(stripeData.status);
        }
      } catch (stripeError) {
        console.error('Error loading Stripe status:', stripeError);
      }
    } catch (error) {
      console.error('Error loading settings data:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/contractor/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          description: profileForm.description,
          yearsInBusiness: profileForm.yearsInBusiness ? parseInt(profileForm.yearsInBusiness) : null,
          location: profileForm.location,
          googleBusinessUrl: profileForm.googleBusinessUrl,
          licensed: profileForm.licensed,
          insured: profileForm.insured,
          afterHoursAvailable: profileForm.afterHoursAvailable,
          hourlyRate: profileForm.hourlyRate ? parseFloat(profileForm.hourlyRate) : null,
          taxRate: profileForm.taxRate ? parseFloat(profileForm.taxRate) : null
        })
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.contractor);
        setProfileForm(prev => ({
          ...prev,
          hourlyRate: data.contractor.hourlyRate?.toString() || '',
          taxRate: data.contractor.taxRate?.toString() || ''
        }));
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to save profile', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to save profile', 'error');
    }
  };

  // Stripe Connect handlers
  const handleStripeOnboard = async () => {
    if (!user?.id) return;

    setStripeLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stripe/connect/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractorId: user.id })
      });

      const data = await response.json();
      if (data.success && data.url) {
        // Redirect to Stripe onboarding
        window.location.href = data.url;
      } else {
        showToast(data.error || 'Failed to start Stripe onboarding', 'error');
      }
    } catch (error) {
      console.error('Error starting Stripe onboarding:', error);
      showToast('Failed to connect to Stripe', 'error');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleStripeDashboard = async () => {
    if (!user?.id) return;

    setStripeLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stripe/connect/dashboard/${user.id}`);
      const data = await response.json();

      if (data.success && data.url) {
        // Open Stripe dashboard in new tab
        window.open(data.url, '_blank');
      } else {
        showToast(data.error || 'Failed to open Stripe dashboard', 'error');
      }
    } catch (error) {
      console.error('Error opening Stripe dashboard:', error);
      showToast('Failed to open Stripe dashboard', 'error');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleToggleLanguage = async (languageId: number) => {
    if (!user?.id) return;

    const isSelected = contractorLanguages.includes(languageId);
    const newLanguages = isSelected
      ? contractorLanguages.filter(id => id !== languageId)
      : [...contractorLanguages, languageId];

    try {
      const response = await fetch(`${API_BASE_URL}/contractor/${user.id}/languages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languageIds: newLanguages })
      });

      const data = await response.json();
      if (data.success) {
        setContractorLanguages(newLanguages);
      }
    } catch (error) {
      console.error('Error updating languages:', error);
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

  const handleToggleArea = async (areaName: string) => {
    if (!user?.id) return;

    const isSelected = contractorAreas.includes(areaName);
    const updatedAreas = isSelected
      ? contractorAreas.filter(area => area !== areaName)
      : [...contractorAreas, areaName];

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
      console.error('Error updating service areas:', error);
    }
  };

  const handleSaveMaterial = async () => {
    if (!user?.id || !materialForm.name || !materialForm.price || !materialForm.unit) {
      showToast('Please fill in all required fields', 'error');
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
      showToast('Failed to save material', 'error');
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
      showToast('Failed to delete material', 'error');
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

      {/* Name Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
            First Name
          </label>
          <input
            type="text"
            value={profileForm.firstName}
            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
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
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
            Last Name
          </label>
          <input
            type="text"
            value={profileForm.lastName}
            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
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
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
          This is the name displayed to clients
        </p>
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

      <div style={{ marginBottom: '20px' }}>
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

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
          Google Business Profile URL
        </label>
        <input
          type="url"
          value={profileForm.googleBusinessUrl || ''}
          onChange={(e) => setProfileForm({ ...profileForm, googleBusinessUrl: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          placeholder="https://g.page/your-business or https://maps.app.goo.gl/..."
        />
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', lineHeight: '1.5' }}>
          Add your Google Business Profile link so clients can read your reviews and find your business on Google Maps
        </p>
      </div>

      {/* Billing & Rates Section */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
          Billing & Rates
        </label>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          Set your default labor rate and tax rate. These will be used when completing jobs.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '8px' }}>
              Hourly Labor Rate ($)
            </label>
            <input
              type="number"
              value={profileForm.hourlyRate}
              onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: e.target.value })}
              placeholder="75.00"
              step="0.01"
              min="0"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '8px' }}>
              Default Tax Rate (%)
            </label>
            <input
              type="number"
              value={profileForm.taxRate}
              onChange={(e) => setProfileForm({ ...profileForm, taxRate: e.target.value })}
              placeholder="6.0"
              step="0.01"
              min="0"
              max="100"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Payment Setup (Stripe Connect) Section */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
          <CreditCard size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          Payment Setup
        </label>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          Connect your bank account to receive payments from clients. A 5% platform fee applies to all transactions.
        </p>

        <div style={{
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          {stripeStatus === null ? (
            <div style={{ color: '#64748b', fontSize: '14px' }}>Loading payment status...</div>
          ) : !stripeStatus.hasAccount ? (
            // No Stripe account - show setup button
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CreditCard size={20} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}>Set up payments</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Connect with Stripe to receive payouts</div>
                </div>
              </div>
              <button
                onClick={handleStripeOnboard}
                disabled={stripeLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: stripeLoading ? 'not-allowed' : 'pointer',
                  opacity: stripeLoading ? 0.7 : 1
                }}
              >
                {stripeLoading ? 'Connecting...' : 'Connect Bank Account'}
                <ExternalLink size={16} />
              </button>
            </div>
          ) : !stripeStatus.onboardingComplete ? (
            // Onboarding started but not complete
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}>Complete your setup</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Finish setting up your Stripe account</div>
                </div>
              </div>
              <button
                onClick={handleStripeOnboard}
                disabled={stripeLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: stripeLoading ? 'not-allowed' : 'pointer',
                  opacity: stripeLoading ? 0.7 : 1
                }}
              >
                {stripeLoading ? 'Loading...' : 'Continue Setup'}
                <ExternalLink size={16} />
              </button>
            </div>
          ) : (
            // Fully connected
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={20} style={{ color: '#22c55e' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}>Payments connected</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {stripeStatus.chargesEnabled && stripeStatus.payoutsEnabled
                      ? 'Your account is fully set up to receive payments'
                      : 'Account connected, some features may be pending verification'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleStripeDashboard}
                  disabled={stripeLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: 'white',
                    color: '#6366f1',
                    border: '2px solid #6366f1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: stripeLoading ? 'not-allowed' : 'pointer',
                    opacity: stripeLoading ? 0.7 : 1
                  }}
                >
                  View Stripe Dashboard
                  <ExternalLink size={14} />
                </button>
              </div>
              {(!stripeStatus.chargesEnabled || !stripeStatus.payoutsEnabled) && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#92400e'
                }}>
                  Note: {!stripeStatus.chargesEnabled && 'Charges'}{!stripeStatus.chargesEnabled && !stripeStatus.payoutsEnabled && ' and '}{!stripeStatus.payoutsEnabled && 'Payouts'} are pending.
                  Stripe may require additional verification.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
          Trust Signals
        </label>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          These badges help build trust with potential clients. Check the boxes that apply to your business.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={profileForm.licensed}
              onChange={(e) => setProfileForm({ ...profileForm, licensed: e.target.checked })}
              style={{ width: '18px', height: '18px', marginRight: '12px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '15px', color: '#1e293b' }}>
              <strong>Licensed</strong> - I hold required state/local licenses for my services
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={profileForm.insured}
              onChange={(e) => setProfileForm({ ...profileForm, insured: e.target.checked })}
              style={{ width: '18px', height: '18px', marginRight: '12px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '15px', color: '#1e293b' }}>
              <strong>Insured</strong> - I carry liability insurance for my business
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={profileForm.afterHoursAvailable}
              onChange={(e) => setProfileForm({ ...profileForm, afterHoursAvailable: e.target.checked })}
              style={{ width: '18px', height: '18px', marginRight: '12px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '15px', color: '#1e293b' }}>
              <strong>After-Hours Available</strong> - I offer services outside regular business hours
            </span>
          </label>
        </div>
      </div>

      {/* Languages Section */}
      {allLanguages.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            Languages Spoken
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
            Select all languages you can communicate in with clients
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allLanguages.map(language => (
              <label key={language.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={contractorLanguages.includes(language.id)}
                  onChange={() => handleToggleLanguage(language.id)}
                  style={{ width: '18px', height: '18px', marginRight: '12px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '15px', color: '#1e293b' }}>
                  <strong>{language.flag} {language.name}</strong>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

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
        Select the cities and areas where you provide services
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {allServiceAreas.map((area) => (
          <label
            key={area.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              border: `2px solid ${contractorAreas.includes(area.name) ? '#6366f1' : '#e2e8f0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: contractorAreas.includes(area.name) ? '#eef2ff' : 'white',
              transition: 'all 0.2s'
            }}
          >
            <input
              type="checkbox"
              checked={contractorAreas.includes(area.name)}
              onChange={() => handleToggleArea(area.name)}
              style={{ marginRight: '12px', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                {area.name}{area.state ? `, ${area.state}` : ''}
              </span>
            </div>
          </label>
        ))}
      </div>

      {allServiceAreas.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', padding: '32px' }}>
          No service areas available. Contact admin to add service areas.
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
      case 'earnings':
        return renderEarnings();
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
      {/* Toast Notifications */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              backgroundColor: toast.type === 'success' ? '#10b981' :
                              toast.type === 'error' ? '#ef4444' : '#3b82f6',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '250px',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'error' && <AlertTriangle size={18} />}
            {toast.type === 'info' && <MessageSquare size={18} />}
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                display: 'flex'
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '85px',
        left: 0,
        height: 'calc(100vh - 85px)',
        overflowY: 'auto',
        zIndex: 100
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
            {/* Header with Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1e293b',
                margin: 0
              }}>
                {editingJobId ? 'Manage Appointment' : 'Schedule Changes Detected'}
              </h2>
              <button
                onClick={handleCancelScheduleChanges}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >
                <X size={24} />
              </button>
            </div>

            {/* Toggle for Change Time vs Delete - only show for single job edit */}
            {editingJobId && (
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                padding: '4px',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px'
              }}>
                <button
                  onClick={() => setModalAction('change')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: modalAction === 'change' ? 'white' : 'transparent',
                    color: modalAction === 'change' ? '#4f46e5' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: modalAction === 'change' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Change Time
                </button>
                <button
                  onClick={() => setModalAction('delete')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: modalAction === 'delete' ? 'white' : 'transparent',
                    color: modalAction === 'delete' ? '#ef4444' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: modalAction === 'delete' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Delete Job
                </button>
              </div>
            )}

            {!editingJobId && (
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                marginBottom: '24px'
              }}>
                Reordering jobs will change {affectedAppointments.length} appointment time{affectedAppointments.length !== 1 ? 's' : ''}. Review the changes and notify affected customers.
              </p>
            )}

            {/* Delete Confirmation Message */}
            {editingJobId && modalAction === 'delete' && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <p style={{
                  fontSize: '16px',
                  color: '#dc2626',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Are you sure you want to delete this job?
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#7f1d1d',
                  margin: 0
                }}>
                  This action cannot be undone. The time slot will be freed and the customer will be notified if you choose to send notifications.
                </p>
              </div>
            )}

            {/* Affected Appointments - only show if not deleting or if reordering */}
            {(!editingJobId || modalAction === 'change') && (
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

                    {editingJobId ? (
                      // Edit Mode - Show input fields
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <label style={{
                            fontSize: '12px',
                            color: '#64748b',
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '600'
                          }}>
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={editFormData.startTime}
                            onChange={(e) => {
                              setEditFormData({ ...editFormData, startTime: e.target.value });
                              // Update the new time display
                              const updatedAppointments = [...affectedAppointments];
                              updatedAppointments[0] = {
                                ...updatedAppointments[0],
                                newTime: `${e.target.value} - ${calculateEndTime(e.target.value, editFormData.duration)}`
                              };
                              setAffectedAppointments(updatedAppointments);
                              // Check availability
                              if (e.target.value && editFormData.duration) {
                                checkTimeSlotAvailability(affectedAppointments[0], e.target.value, parseInt(editFormData.duration));
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '2px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '16px',
                              fontWeight: '600'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{
                            fontSize: '12px',
                            color: '#64748b',
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '600'
                          }}>
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            value={editFormData.duration}
                            onChange={(e) => {
                              setEditFormData({ ...editFormData, duration: e.target.value });
                              // Update the new time display
                              const updatedAppointments = [...affectedAppointments];
                              updatedAppointments[0] = {
                                ...updatedAppointments[0],
                                newTime: `${editFormData.startTime} - ${calculateEndTime(editFormData.startTime, e.target.value)}`
                              };
                              setAffectedAppointments(updatedAppointments);
                              // Check availability
                              if (editFormData.startTime && e.target.value) {
                                checkTimeSlotAvailability(affectedAppointments[0], editFormData.startTime, parseInt(e.target.value));
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '2px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '16px',
                              fontWeight: '600'
                            }}
                          />
                        </div>
                        <div style={{
                          backgroundColor: '#f1f5f9',
                          padding: '12px',
                          borderRadius: '6px',
                          marginTop: '8px'
                        }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b',
                            marginBottom: '4px'
                          }}>
                            Preview:
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#10b981'
                          }}>
                            {editFormData.startTime && editFormData.duration
                              ? `${formatTo12Hour(editFormData.startTime)} - ${calculateEndTime(editFormData.startTime, editFormData.duration)} (${editFormData.duration} min)`
                              : 'Enter time and duration'}
                          </div>
                        </div>

                        {/* Availability Check Results */}
                        {checkingAvailability && (
                          <div style={{
                            backgroundColor: '#f1f5f9',
                            padding: '12px',
                            borderRadius: '6px',
                            marginTop: '12px',
                            textAlign: 'center',
                            color: '#64748b',
                            fontSize: '14px'
                          }}>
                            Checking availability...
                          </div>
                        )}

                        {!checkingAvailability && timeSlotConflicts.length > 0 && (
                          <div style={{
                            backgroundColor: '#fee',
                            border: '1px solid #fca5a5',
                            padding: '12px',
                            borderRadius: '6px',
                            marginTop: '12px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '8px'
                            }}>
                              <AlertTriangle size={18} color="#ef4444" />
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#dc2626'
                              }}>
                                Time Slot Conflicts Detected
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#7f1d1d' }}>
                              This time overlaps with {timeSlotConflicts.length} existing {timeSlotConflicts.length === 1 ? 'booking' : 'bookings'}:
                            </div>
                            <ul style={{
                              margin: '8px 0 0 0',
                              paddingLeft: '20px',
                              fontSize: '12px',
                              color: '#991b1b'
                            }}>
                              {timeSlotConflicts.map((conflict, idx) => (
                                <li key={idx}>
                                  {conflict.startTime} - {conflict.endTime} ({conflict.slotType})
                                  {conflict.bookingId && ` - Booking #${conflict.bookingId}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {!checkingAvailability && timeSlotConflicts.length === 0 && editFormData.startTime && editFormData.duration && (
                          <div style={{
                            backgroundColor: '#dcfce7',
                            border: '1px solid #86efac',
                            padding: '12px',
                            borderRadius: '6px',
                            marginTop: '12px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <CheckCircle size={18} color="#16a34a" />
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#15803d'
                              }}>
                                Time slot is available
                              </span>
                            </div>
                          </div>
                        )}

                        {!checkingAvailability && nextAvailableTime && timeSlotConflicts.length > 0 && (
                          <div style={{
                            backgroundColor: '#dbeafe',
                            border: '1px solid #93c5fd',
                            padding: '12px',
                            borderRadius: '6px',
                            marginTop: '8px'
                          }}>
                            <div style={{
                              fontSize: '13px',
                              color: '#1e40af',
                              marginBottom: '6px'
                            }}>
                              Next available time:
                            </div>
                            <button
                              onClick={() => {
                                setEditFormData({ ...editFormData, startTime: nextAvailableTime });
                                const updatedAppointments = [...affectedAppointments];
                                updatedAppointments[0] = {
                                  ...updatedAppointments[0],
                                  newTime: `${nextAvailableTime} - ${calculateEndTime(nextAvailableTime, editFormData.duration)}`
                                };
                                setAffectedAppointments(updatedAppointments);
                                checkTimeSlotAvailability(affectedAppointments[0], nextAvailableTime, parseInt(editFormData.duration));
                              }}
                              style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Use {formatTo12Hour(nextAvailableTime)}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      // View Mode - Show time comparison
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
                    )}

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
            )}

            {/* Note */}
            {!editingJobId && (
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
                  <strong>Note:</strong> The first job time ({formatTo12Hour((activeSection === 'calendar' ? selectedDateJobs[0] : todaysJobs[0])?.scheduledTime?.split(' - ')[0])}) remains unchanged. Subsequent jobs are automatically scheduled with 15 minutes travel time between appointments.
                </p>
              </div>
            )}

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
                  cursor: 'pointer'
                }}
              >
                {editingJobId && modalAction === 'delete' ? 'DELETE & NOTIFY CUSTOMER' : 'ACCEPT & NOTIFY CUSTOMERS'}
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
                  cursor: 'pointer'
                }}
              >
                {editingJobId && modalAction === 'delete' ? 'DELETE SILENTLY (No Notifications)' : 'ACCEPT SILENTLY (No Notifications)'}
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
                {editingJobId ? 'CANCEL' : 'CANCEL (Keep Original Order)'}
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
                      justifyContent: msg.sender === 'contractor' ? 'flex-end' : 'flex-start',
                      gap: '6px',
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
                      backgroundColor: msg.sender === 'contractor' ? '#3b82f6' : '#f1f5f9',
                      color: msg.sender === 'contractor' ? 'white' : '#1e293b'
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

      {/* Job Completion Modal */}
      {showCompleteModal && jobToComplete && (
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
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '32px'
          }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                Complete Job
              </h2>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setJobToComplete(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748b'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Job Info */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1e293b' }}>
                {jobToComplete.service?.name}
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                {jobToComplete.client?.firstName} {jobToComplete.client?.lastName}
              </p>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Time Worked */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  Time Worked {profile?.hourlyRate && <span style={{ fontWeight: 'normal', color: '#64748b' }}>(${profile.hourlyRate}/hr)</span>}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Start Time</label>
                    <input
                      type="time"
                      value={completionForm.startTime}
                      onChange={(e) => setCompletionForm({ ...completionForm, startTime: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>End Time</label>
                    <input
                      type="time"
                      value={completionForm.endTime}
                      onChange={(e) => setCompletionForm({ ...completionForm, endTime: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                {completionForm.startTime && completionForm.endTime && (
                  <p style={{ fontSize: '13px', color: '#10b981', marginTop: '8px', margin: '8px 0 0 0' }}>
                    Labor: ${calculateLaborCost().toFixed(2)}
                  </p>
                )}
                {!profile?.hourlyRate && (
                  <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '8px', margin: '8px 0 0 0' }}>
                    Set your hourly rate in Settings → Profile to auto-calculate labor costs
                  </p>
                )}
              </div>

              {/* Materials from Library */}
              {materials.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Materials Used
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddMaterial(parseInt(e.target.value));
                        e.target.value = '';
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      marginBottom: '12px'
                    }}
                  >
                    <option value="">Add material from library...</option>
                    {materials.filter(m => !selectedMaterials.some(sm => sm.materialId === m.id)).map(material => (
                      <option key={material.id} value={material.id}>
                        {material.name} - ${material.price}/{material.unit}
                      </option>
                    ))}
                  </select>

                  {/* Selected Materials */}
                  {selectedMaterials.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedMaterials.map(item => {
                        const material = materials.find(m => m.id === item.materialId);
                        if (!material) return null;
                        return (
                          <div key={item.materialId} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '6px'
                          }}>
                            <span style={{ flex: 1, fontSize: '14px' }}>{material.name}</span>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>${material.price}/{material.unit}</span>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateMaterialQuantity(item.materialId, parseInt(e.target.value) || 1)}
                              min="1"
                              style={{
                                width: '60px',
                                padding: '4px 8px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                fontSize: '14px',
                                textAlign: 'center'
                              }}
                            />
                            <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px', textAlign: 'right' }}>
                              ${(material.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemoveMaterial(item.materialId)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Custom Line Items */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    Additional Charges
                  </label>
                  <button
                    onClick={handleAddCustomItem}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Item
                  </button>
                </div>
                {customLineItems.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '8px',
                    alignItems: 'center'
                  }}>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateCustomItem(index, 'description', e.target.value)}
                      placeholder="Description"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    <div style={{ position: 'relative', width: '100px' }}>
                      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>$</span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleUpdateCustomItem(index, 'amount', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        style={{
                          width: '100%',
                          padding: '8px 12px 8px 24px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveCustomItem(index)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Before/After Photos */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                  Photos
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Before Photos */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Before Photos</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleCompletionPhotoChange(e, 'before')}
                      style={{ display: 'none' }}
                      id="completion-before-photos"
                    />
                    <label
                      htmlFor="completion-before-photos"
                      style={{
                        display: 'block',
                        padding: '16px',
                        border: '2px dashed #e2e8f0',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Click to add photos</span>
                    </label>
                    {completionBeforePreview.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {completionBeforePreview.map((url, i) => (
                          <img key={i} src={url} alt="Before" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* After Photos */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>After Photos</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleCompletionPhotoChange(e, 'after')}
                      style={{ display: 'none' }}
                      id="completion-after-photos"
                    />
                    <label
                      htmlFor="completion-after-photos"
                      style={{
                        display: 'block',
                        padding: '16px',
                        border: '2px dashed #e2e8f0',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Click to add photos</span>
                    </label>
                    {completionAfterPreview.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {completionAfterPreview.map((url, i) => (
                          <img key={i} src={url} alt="After" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes with Voice-to-Text */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    Completion Notes
                  </label>
                  <button
                    onClick={toggleCompletionVoiceRecording}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: isCompletionRecording ? '#ef4444' : '#f1f5f9',
                      color: isCompletionRecording ? 'white' : '#475569',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {isCompletionRecording ? '⏹ Stop' : '🎤 Voice'}
                  </button>
                </div>
                {isCompletionRecording && (
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                    <span style={{ fontSize: '13px', color: '#991b1b' }}>Recording... speak now</span>
                  </div>
                )}
                <textarea
                  value={completionForm.notes}
                  onChange={(e) => setCompletionForm({ ...completionForm, notes: e.target.value })}
                  placeholder="Any notes about the completed job..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Invoice Preview */}
              {(() => {
                const totals = calculateInvoiceTotals();
                return (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#166534', fontSize: '14px' }}>
                      Invoice Preview
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#15803d', marginBottom: '4px' }}>
                      <span>Labor:</span>
                      <span>${totals.laborCost.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#15803d', marginBottom: '4px' }}>
                      <span>Materials:</span>
                      <span>${totals.materialsCost.toFixed(2)}</span>
                    </div>
                    {totals.customItemsCost > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#15803d', marginBottom: '4px' }}>
                        <span>Additional:</span>
                        <span>${totals.customItemsCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#15803d', marginBottom: '4px' }}>
                      <span>Tax ({totals.taxRate}%):</span>
                      <span>${totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', color: '#166534', borderTop: '1px solid #bbf7d0', paddingTop: '8px', marginTop: '8px' }}>
                      <span>Total:</span>
                      <span>${totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px'
            }}>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setJobToComplete(null);
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
                onClick={saveCompletionDraft}
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
                Save Draft
              </button>
              <button
                onClick={submitJobCompletion}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Complete & Generate Invoice
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

      {/* Add Job Modal */}
      {showAddJobModal && (
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
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '32px'
          }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                Add New Job
              </h2>
              <button
                onClick={() => setShowAddJobModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748b'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Client Name */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  Client Name *
                </label>
                <input
                  type="text"
                  value={addJobForm.clientName}
                  onChange={(e) => setAddJobForm({ ...addJobForm, clientName: e.target.value })}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Client Email */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  Client Email
                </label>
                <input
                  type="email"
                  value={addJobForm.clientEmail}
                  onChange={(e) => setAddJobForm({ ...addJobForm, clientEmail: e.target.value })}
                  placeholder="john@example.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Client Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  Client Phone
                </label>
                <input
                  type="tel"
                  value={addJobForm.clientPhone}
                  onChange={(e) => setAddJobForm({ ...addJobForm, clientPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Service */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  Service *
                </label>
                <select
                  value={addJobForm.service}
                  onChange={(e) => setAddJobForm({ ...addJobForm, service: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select a service...</option>
                  {allServices.map((service: any) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Address */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  Service Address *
                </label>
                <input
                  type="text"
                  value={addJobForm.address}
                  onChange={(e) => setAddJobForm({ ...addJobForm, address: e.target.value })}
                  placeholder="1234 Main St, Boise, ID"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Date and Time Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={addJobForm.scheduledDate}
                    onChange={(e) => setAddJobForm({ ...addJobForm, scheduledDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Time *
                  </label>
                  <input
                    type="time"
                    value={addJobForm.scheduledTime}
                    onChange={(e) => setAddJobForm({ ...addJobForm, scheduledTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Duration and Price Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={addJobForm.duration}
                    onChange={(e) => setAddJobForm({ ...addJobForm, duration: e.target.value })}
                    placeholder="90"
                    min="15"
                    step="15"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={addJobForm.price}
                    onChange={(e) => setAddJobForm({ ...addJobForm, price: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                    Notes
                  </label>
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: isRecording ? '#ef4444' : '#f1f5f9',
                      color: isRecording ? 'white' : '#64748b',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    {isRecording ? 'Stop Recording' : 'Voice to Text'}
                  </button>
                </div>
                {isRecording && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      animation: 'pulse 1s infinite'
                    }} />
                    <span style={{ fontSize: '13px', color: '#dc2626' }}>
                      Listening... Speak now
                    </span>
                  </div>
                )}
                <textarea
                  value={addJobForm.notes}
                  onChange={(e) => setAddJobForm({ ...addJobForm, notes: e.target.value })}
                  placeholder="Any special instructions or notes... (or use voice-to-text)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: isRecording ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Before Photos */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  Before Photos (optional)
                </label>
                <div style={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f8fafc'
                }}
                onClick={() => document.getElementById('before-photo-input')?.click()}
                >
                  <input
                    id="before-photo-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleJobPhotoSelect(e, 'before')}
                    style={{ display: 'none' }}
                  />
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                    Click to upload before photos (resized to 800px)
                  </p>
                </div>
                {beforePhotoPreview.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {beforePhotoPreview.map((url, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={url}
                          alt={`Before ${index + 1}`}
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <button
                          onClick={() => handleRemoveJobPhoto(index, 'before')}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* After Photos */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                  After Photos (optional)
                </label>
                <div style={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f8fafc'
                }}
                onClick={() => document.getElementById('after-photo-input')?.click()}
                >
                  <input
                    id="after-photo-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleJobPhotoSelect(e, 'after')}
                    style={{ display: 'none' }}
                  />
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                    Click to upload after photos (resized to 800px)
                  </p>
                </div>
                {afterPhotoPreview.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {afterPhotoPreview.map((url, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={url}
                          alt={`After ${index + 1}`}
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <button
                          onClick={() => handleRemoveJobPhoto(index, 'after')}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddJobModal(false)}
                disabled={uploadingPhotos}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: uploadingPhotos ? 'not-allowed' : 'pointer',
                  opacity: uploadingPhotos ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddJob}
                disabled={uploadingPhotos}
                style={{
                  padding: '12px 24px',
                  backgroundColor: uploadingPhotos ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: uploadingPhotos ? 'not-allowed' : 'pointer'
                }}
              >
                {uploadingPhotos ? 'Adding Job...' : 'Add Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorDashboard;
