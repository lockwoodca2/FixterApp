import React from 'react';
import logo from './logo.svg';
import AppRouter from './routes';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
   <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
