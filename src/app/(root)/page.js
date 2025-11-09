'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserNurse, FaEnvelope, FaLock, FaArrowRight, FaHospital } from 'react-icons/fa';
import { Login_Server } from '@/server/login';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get form data manually
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    console.log('Form submitted with:', { email, password });

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      console.log('Calling Login_Server...');
      const result = await Login_Server(formData);
      console.log('Login_Server response:', result);
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      if (result.redirectTo) {
        // Store temporary user data for verification
        localStorage.setItem('tempUser', JSON.stringify({
          email: result.user.email,
          name: result.user.name
        }));
        
        // Store the temporary token if provided
        if (result.tempToken) {
          localStorage.setItem('tempToken', result.tempToken);
        }
        
        console.log('Redirecting to verification page...');
        router.push(result.redirectTo);
      } else if (result.token) {
        // If no redirect but has token, it's a direct login
        console.log('Storing token and user data...');
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log('Reset password for:', forgotEmail);
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowForgotPassword(false);
      setForgotEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 text-xs">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full text-white shadow-lg">
              <FaUserNurse size={40} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaHospital className="text-blue-700" size={24} />
            <h1 className="text-3xl font-bold text-blue-900">MedShelf</h1>
          </div>
          <p className="text-blue-800 mt-2">Nurse Login - Secure Access to Patient Records</p>
        </div>

        {!showForgotPassword ? (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-amber-900 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-blue-900 placeholder-blue-400"
                      placeholder="your.email@library.com"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-amber-900">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-medium text-blue-700 hover:text-blue-900 focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-blue-900 placeholder-blue-400"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    'Signing in...'
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
            <div className="bg-blue-50 px-8 py-4 border-t border-blue-100 text-center">
              <p className="text-xs text-blue-700">
                For security reasons, please log out and close your browser when you're done accessing patient records.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-700 hover:text-blue-900 mb-6 flex items-center text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to login
              </button>
              
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Reset Password</h2>
              <p className="text-blue-700 mb-6">Enter your work email address and we'll send you a secure link to reset your password.</p>
              
              <form onSubmit={handleForgotPassword}>
                <div className="mb-6">
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-amber-900 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-blue-900 placeholder-blue-400"
                      placeholder="your.email@library.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending reset link...' : 'Send Reset Link'}
                </button>
              </form>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-700">
            &copy; {new Date().getFullYear()} MedShelf - Healthcare System. For authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
