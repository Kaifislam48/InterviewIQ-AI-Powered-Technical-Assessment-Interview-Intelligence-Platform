import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#151D30',
              color: '#F3F4F6',
              border: '1px solid #1F2A45',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
