import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './routes';

interface NavigationGuardProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  allowedUserTypes?: ('client' | 'contractor')[];
  redirectTo?: string;
}

/**
 * Navigation guard component for protecting routes
 */
export const NavigationGuard: React.FC<NavigationGuardProps> = ({
  children,
  requiresAuth = false,
  allowedUserTypes = [],
  redirectTo,
}) => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '18px', margin: 0 }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check user type requirement
  if (allowedUserTypes.length > 0 && userType && !allowedUserTypes.includes(userType)) {
    // Redirect to appropriate dashboard or home
    const defaultRedirect = userType === 'client'
      ? ROUTES.CLIENT_DASHBOARD
      : userType === 'contractor'
      ? ROUTES.CONTRACTOR_DASHBOARD
      : ROUTES.HOME;

    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return <>{children}</>;
};

/**
 * HOC for protecting route components
 */
export function withNavigationGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<NavigationGuardProps, 'children'>
) {
  return function GuardedComponent(props: P) {
    return (
      <NavigationGuard {...guardProps}>
        <Component {...props} />
      </NavigationGuard>
    );
  };
}
