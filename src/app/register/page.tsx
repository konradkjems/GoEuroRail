'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

// Client component that safely uses useSearchParams
function RegisterForm({ onRedirectPathChange }: { onRedirectPathChange: (path: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferNightTrains, setPreferNightTrains] = useState(false);
  const [scenicRoutes, setScenicRoutes] = useState(false);
  const [lowBudget, setLowBudget] = useState(false);
  const [language, setLanguage] = useState('en');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, login, isAuthenticated } = useAuth();
  const redirectPath = searchParams.get('redirect') || '/trips';

  // Check for redirect parameter
  useEffect(() => {
    onRedirectPathChange(redirectPath);
    
    // If already authenticated, redirect to trips
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [searchParams, isAuthenticated, router, redirectPath, onRedirectPathChange]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    // Validate password strength (at least 8 characters)
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register({
        email,
        password,
        preferences: {
          preferNightTrains,
          scenicRoutes,
          lowBudget,
          language,
          notificationsEnabled: true
        }
      });
      
      if (success) {
        // Auto login after registration
        const loginSuccess = await login(email, password);
        
        if (loginSuccess) {
          router.push(redirectPath);
        } else {
          // Registration successful but login failed
          router.push(`/login?registered=true&redirect=${encodeURIComponent(redirectPath)}`);
        }
      } else {
        // Try to determine if this is a known error (like email in use)
        if (email.includes('@')) {
          // Check if email domain is valid
          const domain = email.split('@')[1];
          if (!domain.includes('.')) {
            setErrorMessage('Please enter a valid email address with a proper domain');
          } else if (domain === 'gmail.com' || domain === 'yahoo.com' || domain === 'hotmail.com' || domain === 'outlook.com') {
            setErrorMessage('Registration failed. This email might already be in use or there was a problem connecting to our service. Please try again in a moment.');
          } else {
            setErrorMessage('Registration failed. Please check your email address or try again later.');
          }
        } else {
          setErrorMessage('Registration failed. Please try again later or contact support if the problem persists.');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
          setErrorMessage('Our service is taking longer than expected to respond. Please try again in a moment.');
        } else if (error.message.includes('already exists')) {
          setErrorMessage('An account with this email already exists. Please log in instead.');
        } else {
          setErrorMessage(`Error: ${error.message}`);
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      {errorMessage ? (
        <div suppressHydrationWarning className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {errorMessage}
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06D6A0]"
            placeholder="your@email.com"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06D6A0]"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06D6A0]"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Travel Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="preferNightTrains"
                type="checkbox"
                checked={preferNightTrains}
                onChange={(e) => setPreferNightTrains(e.target.checked)}
                className="h-4 w-4 text-[#06D6A0] focus:ring-[#06D6A0] rounded"
              />
              <label htmlFor="preferNightTrains" className="ml-2 text-sm text-gray-700">
                Prefer night trains for long journeys
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="scenicRoutes"
                type="checkbox"
                checked={scenicRoutes}
                onChange={(e) => setScenicRoutes(e.target.checked)}
                className="h-4 w-4 text-[#06D6A0] focus:ring-[#06D6A0] rounded"
              />
              <label htmlFor="scenicRoutes" className="ml-2 text-sm text-gray-700">
                Prefer scenic routes over faster connections
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="lowBudget"
                type="checkbox"
                checked={lowBudget}
                onChange={(e) => setLowBudget(e.target.checked)}
                className="h-4 w-4 text-[#06D6A0] focus:ring-[#06D6A0] rounded"
              />
              <label htmlFor="lowBudget" className="ml-2 text-sm text-gray-700">
                Prioritize budget-friendly options
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06D6A0]"
          >
            <option value="en">English</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="it">Italian</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white font-medium rounded-md ${
            isSubmitting
              ? 'bg-[#06D6A0]/70 cursor-not-allowed'
              : 'bg-[#06D6A0] hover:bg-[#05c091]'
          } transition-colors`}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="text-[#06D6A0] hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </>
  );
}

// Loading fallback for Suspense
function RegisterFormLoading() {
  return <div className="text-center py-4">Loading registration form...</div>;
}

export default function RegisterPage() {
  const [redirectPath, setRedirectPath] = useState('/trips');

  const handleRedirectPathChange = (path: string) => {
    setRedirectPath(path);
  };
  
  return (
    <Layout>
      <div className="max-w-lg mx-auto my-12 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-[#264653] mb-6 text-center">Create an Account</h1>
        
        <Suspense fallback={<RegisterFormLoading />}>
          <RegisterForm onRedirectPathChange={handleRedirectPathChange} />
        </Suspense>
      </div>
    </Layout>
  );
} 