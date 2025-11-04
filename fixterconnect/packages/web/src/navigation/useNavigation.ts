import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, getContractorsRoute, getContractorDetailsRoute } from './routes';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for navigation with type-safe routes
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, isAuthenticated } = useAuth();

  return {
    // Navigation functions
    goToHome: () => navigate(ROUTES.HOME),
    goToLogin: () => navigate(ROUTES.LOGIN),
    goToServices: () => navigate(ROUTES.SERVICES),
    goToContractors: (serviceId: number | string) => navigate(getContractorsRoute(serviceId)),
    goToContractorDetails: (contractorId: number | string) => navigate(getContractorDetailsRoute(contractorId)),

    // Client navigation
    goToClientDashboard: () => navigate(ROUTES.CLIENT_DASHBOARD),
    goToClientProfile: () => navigate(ROUTES.CLIENT_PROFILE),
    goToClientMessages: () => navigate(ROUTES.CLIENT_MESSAGES),
    goToClientBookings: () => navigate(ROUTES.CLIENT_BOOKINGS),

    // Contractor navigation
    goToContractorDashboard: () => navigate(ROUTES.CONTRACTOR_DASHBOARD),
    goToContractorProfile: () => navigate(ROUTES.CONTRACTOR_PROFILE),
    goToContractorJobs: () => navigate(ROUTES.CONTRACTOR_JOBS),
    goToContractorSchedule: () => navigate(ROUTES.CONTRACTOR_SCHEDULE),
    goToContractorMessages: () => navigate(ROUTES.CONTRACTOR_MESSAGES),

    // Generic navigation
    goTo: (path: string) => navigate(path),
    goBack: () => navigate(-1),

    // Current location
    currentPath: location.pathname,
    isCurrentPath: (path: string) => location.pathname === path,

    // User context
    userType,
    isAuthenticated,

    // Dashboard redirect based on user type
    goToDashboard: () => {
      if (userType === 'client') {
        navigate(ROUTES.CLIENT_DASHBOARD);
      } else if (userType === 'contractor') {
        navigate(ROUTES.CONTRACTOR_DASHBOARD);
      } else {
        navigate(ROUTES.HOME);
      }
    },
  };
};

/**
 * Hook to check if a route is active
 */
export const useIsActiveRoute = (path: string): boolean => {
  const location = useLocation();
  return location.pathname === path || location.pathname.startsWith(path);
};
