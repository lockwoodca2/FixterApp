import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRouter from './routes';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Get Google Client ID from environment variable
// You'll need to create a .env file with REACT_APP_GOOGLE_CLIENT_ID=your_client_id
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
