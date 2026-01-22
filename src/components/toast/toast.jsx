// src/providers/ToastProvider.jsx
'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        // Default options
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        // Success/Error/Info/Loading specific styles
        success: {
          duration: 3000,
          style: {
            background: '#10B981', // green-500
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444', // red-500
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
        loading: {
          style: {
            background: '#3B82F6', // blue-500
            color: '#fff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;