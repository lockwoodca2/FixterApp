import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import layouts
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Import pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ServicesList from '../pages/ServicesList';
import SearchResults from '../pages/SearchResults';
import ContractorsList from '../pages/ContractorsList';
import ContractorDetails from '../pages/ContractorDetails';
import BookingPage from '../pages/BookingPage';
import NotFound from '../pages/NotFound';

// Import dashboard components
import ContractorDashboard from '../components/dashboard/ContractorDashboard';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

// Import navigation guard
import { NavigationGuard } from '../navigation/NavigationGuard';

// Routes component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<ServicesList />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/contractors/:serviceId" element={<ContractorsList />} />
        <Route path="/contractor/:contractorId" element={<ContractorDetails />} />
      </Route>

      {/* Custom booking page (standalone, no layout - has its own branding) */}
      <Route path="/book/:slug" element={<BookingPage />} />

      {/* Protected dashboard routes with DashboardLayout */}
      <Route element={<DashboardLayout />}>
        <Route
          path="/contractor-dashboard/*"
          element={
            <NavigationGuard requiresAuth={true} allowedUserTypes={['contractor']}>
              <ContractorDashboard />
            </NavigationGuard>
          }
        />
        <Route
          path="/client-dashboard/*"
          element={
            <NavigationGuard requiresAuth={true} allowedUserTypes={['client']}>
              <ClientDashboard />
            </NavigationGuard>
          }
        />
      </Route>

      {/* Admin route - standalone without layout (has its own authentication) */}
      {/* TODO: Add proper backend authentication check for admin access */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Wrap routes in BrowserRouter
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default AppRouter;