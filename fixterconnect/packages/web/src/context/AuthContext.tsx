import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ApiClient, Client, Contractor } from '@fixterconnect/core';
import { API_BASE_URL } from '../config/api';

type ContractorUser = Contractor & { type: 'contractor' };
type ClientUser = Client & { type: 'client' };
type User = ContractorUser | ClientUser;

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userType: 'contractor' | 'client' | null;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'contractor' | 'client' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiClient = new ApiClient(API_BASE_URL);

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have saved auth data in localStorage
        const savedUser = localStorage.getItem('user');
        const savedUserType = localStorage.getItem('userType');

        if (savedUser && savedUserType) {
          setUser(JSON.parse(savedUser));
          setUserType(savedUserType as 'contractor' | 'client');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear potentially corrupted auth data
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);

    try {
      // Try logging in as contractor first
      const contractorResponse = await apiClient.login(username, password, 'contractor');

      if (contractorResponse.success && contractorResponse.contractor) {
        const loggedInUser: User = { ...contractorResponse.contractor, type: 'contractor' as const };
        setUser(loggedInUser);
        setUserType('contractor');
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('userType', 'contractor');
        return loggedInUser;
      }

      // If contractor login fails, try client login
      const clientResponse = await apiClient.login(username, password, 'client');

      if (clientResponse.success && clientResponse.client) {
        const loggedInUser: User = { ...clientResponse.client, type: 'client' as const };
        setUser(loggedInUser);
        setUserType('client');
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('userType', 'client');
        return loggedInUser;
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  // Create the value object
  const value = {
    isAuthenticated: !!user,
    user,
    userType,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};