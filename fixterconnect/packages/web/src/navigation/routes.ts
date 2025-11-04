// Route path constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SERVICES: '/services',
  CONTRACTORS: '/contractors/:serviceId',
  CONTRACTOR_DETAILS: '/contractor/:contractorId',

  // Protected routes - Client
  CLIENT_DASHBOARD: '/client-dashboard',
  CLIENT_PROFILE: '/client-dashboard/profile',
  CLIENT_MESSAGES: '/client-dashboard/messages',
  CLIENT_BOOKINGS: '/client-dashboard/bookings',

  // Protected routes - Contractor
  CONTRACTOR_DASHBOARD: '/contractor-dashboard',
  CONTRACTOR_PROFILE: '/contractor-dashboard/profile',
  CONTRACTOR_JOBS: '/contractor-dashboard/jobs',
  CONTRACTOR_SCHEDULE: '/contractor-dashboard/schedule',
  CONTRACTOR_MESSAGES: '/contractor-dashboard/messages',
} as const;

// Helper functions to generate dynamic routes
export const getContractorsRoute = (serviceId: number | string) =>
  `/contractors/${serviceId}`;

export const getContractorDetailsRoute = (contractorId: number | string) =>
  `/contractor/${contractorId}`;

// Route metadata for navigation menus
export interface RouteMetadata {
  path: string;
  title: string;
  icon?: string;
  requiresAuth?: boolean;
  allowedUserTypes?: ('client' | 'contractor')[];
}

export const publicRoutes: RouteMetadata[] = [
  {
    path: ROUTES.HOME,
    title: 'Home',
    icon: '🏠',
  },
  {
    path: ROUTES.SERVICES,
    title: 'Services',
    icon: '🔧',
  },
];

export const clientRoutes: RouteMetadata[] = [
  {
    path: ROUTES.CLIENT_DASHBOARD,
    title: 'Dashboard',
    icon: '📊',
    requiresAuth: true,
    allowedUserTypes: ['client'],
  },
  {
    path: ROUTES.CLIENT_BOOKINGS,
    title: 'My Bookings',
    icon: '📅',
    requiresAuth: true,
    allowedUserTypes: ['client'],
  },
  {
    path: ROUTES.CLIENT_MESSAGES,
    title: 'Messages',
    icon: '💬',
    requiresAuth: true,
    allowedUserTypes: ['client'],
  },
  {
    path: ROUTES.CLIENT_PROFILE,
    title: 'Profile',
    icon: '👤',
    requiresAuth: true,
    allowedUserTypes: ['client'],
  },
];

export const contractorRoutes: RouteMetadata[] = [
  {
    path: ROUTES.CONTRACTOR_DASHBOARD,
    title: 'Dashboard',
    icon: '📊',
    requiresAuth: true,
    allowedUserTypes: ['contractor'],
  },
  {
    path: ROUTES.CONTRACTOR_JOBS,
    title: 'My Jobs',
    icon: '🔨',
    requiresAuth: true,
    allowedUserTypes: ['contractor'],
  },
  {
    path: ROUTES.CONTRACTOR_SCHEDULE,
    title: 'Schedule',
    icon: '📅',
    requiresAuth: true,
    allowedUserTypes: ['contractor'],
  },
  {
    path: ROUTES.CONTRACTOR_MESSAGES,
    title: 'Messages',
    icon: '💬',
    requiresAuth: true,
    allowedUserTypes: ['contractor'],
  },
  {
    path: ROUTES.CONTRACTOR_PROFILE,
    title: 'Profile',
    icon: '👤',
    requiresAuth: true,
    allowedUserTypes: ['contractor'],
  },
];
