'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

// Client component that safely uses useSearchParams
function LoginForm({ onRedirectPathChange }: { onRedirectPathChange: (path: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
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
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        router.push(redirectPath); // Redirect to the specified path after login
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Login error:', error);
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link href={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="text-[#06D6A0] hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </>
  );
}

// Loading fallback for Suspense
function LoginFormLoading() {
  return <div className="text-center py-4">Loading login form...</div>;
}

export default function LoginPage() {
  const [redirectPath, setRedirectPath] = useState('/trips');

  const handleRedirectPathChange = (path: string) => {
    setRedirectPath(path);
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-[#264653] mb-6 text-center">Log In</h1>
        
        <Suspense fallback={<LoginFormLoading />}>
          <LoginForm onRedirectPathChange={handleRedirectPathChange} />
        </Suspense>
      </div>
    </Layout>
  );
} 