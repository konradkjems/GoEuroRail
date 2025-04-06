'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [preferNightTrains, setPreferNightTrains] = useState(false);
  const [scenicRoutes, setScenicRoutes] = useState(false);
  const [lowBudget, setLowBudget] = useState(false);
  const [language, setLanguage] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);
  
  // Load user data
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPreferNightTrains(user.travelPreferences?.preferNightTrains || false);
      setScenicRoutes(user.travelPreferences?.scenicRoutes || false);
      setLowBudget(user.travelPreferences?.lowBudget || false);
      setLanguage(user.language || 'en');
      setNotificationsEnabled(user.notificationsEnabled || true);
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsSubmitting(true);
    
    try {
      const success = await updateProfile({
        email,
        travelPreferences: {
          preferNightTrains,
          scenicRoutes,
          lowBudget
        },
        language,
        notificationsEnabled
      });
      
      if (success) {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to update profile'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
      console.error('Update profile error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/');
    }
  };
  
  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06D6A0]"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#264653] to-[#2A9D8F] p-6">
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
        </div>
        
        <div className="p-6">
          {message.text && (
            <div className={`p-3 rounded-lg mb-6 ${
              message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[#264653] mb-3">Travel Preferences</h3>
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
            
            <div className="grid md:grid-cols-2 gap-6">
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
              
              <div>
                <div className="flex items-center mt-6">
                  <input
                    id="notificationsEnabled"
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="h-4 w-4 text-[#06D6A0] focus:ring-[#06D6A0] rounded"
                  />
                  <label htmlFor="notificationsEnabled" className="ml-2 text-sm text-gray-700">
                    Enable email notifications
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-6 text-white font-medium rounded-md ${
                  isSubmitting
                    ? 'bg-[#06D6A0]/70 cursor-not-allowed'
                    : 'bg-[#06D6A0] hover:bg-[#05c091]'
                } transition-colors`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={handleLogout}
                className="py-2 px-6 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
              >
                Log Out
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#264653] to-[#2A9D8F] p-6">
          <h2 className="text-2xl font-bold text-white">Saved Trips</h2>
        </div>
        
        <div className="p-6">
          {(user.savedRoutes?.length || 0) > 0 ? (
            <div className="space-y-4">
              {user.savedRoutes?.map((route: any) => (
                <div 
                  key={route._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-[#264653]">{route.trip_name}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(route.start_date).toLocaleDateString()} - {new Date(route.end_date).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <Link 
                      href={`/trips/${route._id}`} 
                      className="text-[#06D6A0] hover:text-[#05c091] text-sm font-medium"
                    >
                      View Trip →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any saved trips yet.</p>
              <Link
                href="/trips/new"
                className="inline-block bg-[#FFD166] hover:bg-[#FFC233] text-[#264653] px-4 py-2 rounded-md font-medium transition-colors"
              >
                Create New Trip
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 