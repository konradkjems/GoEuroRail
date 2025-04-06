"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  const activeStyle = 'text-[#06D6A0]';
  const inactiveStyle = 'text-[#264653] hover:text-[#06D6A0]';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Close user menu if open
    if (userMenuOpen) setUserMenuOpen(false);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image
                src="/photos/gur-logo2 icon transparent@2x.svg"
                alt="GoEuroRail Logo"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            
            {/* Main navigation links - desktop */}
            <div className="hidden md:flex items-center space-x-4 ml-6">
              <Link 
                href="/passes" 
                className={`${pathname === "/passes" ? activeStyle : inactiveStyle} px-3 py-2 rounded-md text-sm font-medium`}
              >
                Rail Passes
              </Link>
              <Link 
                href="/rail-maps" 
                className={`${pathname === "/rail-maps" ? activeStyle : inactiveStyle} px-3 py-2 rounded-md text-sm font-medium`}
              >
                Rail Maps
              </Link>
              <Link 
                href="/recommended-trips" 
                className={`${pathname === "/recommended-trips" ? activeStyle : inactiveStyle} px-3 py-2 rounded-md text-sm font-medium`}
              >
                Recommended Trips
              </Link>
              <Link 
                href="/country-guides" 
                className={`${pathname === "/country-guides" ? activeStyle : inactiveStyle} px-3 py-2 rounded-md text-sm font-medium`}
              >
                Country Guides
              </Link>
            </div>
          </div>
          
          {/* Desktop right side links */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/trips" 
                  className={`${pathname === "/trips" ? activeStyle : inactiveStyle} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  My Trips
                </Link>
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center focus:outline-none"
                  >
                    <UserCircleIcon className="h-8 w-8 text-[#264653] hover:text-[#06D6A0]" />
                    <span className="ml-1 text-[#264653]">{user?.email?.split('@')[0]}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
                <Link 
                  href="/trips/new" 
                  className="bg-[#FFD166] text-[#264653] hover:bg-[#FFC233] px-4 py-2 rounded-md text-sm font-medium"
                >
                  Plan New Trip
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-[#264653] hover:text-[#06D6A0] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#06D6A0] text-white hover:bg-[#05c091] px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#264653] hover:text-[#06D6A0] hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/railpasses" 
              className={`${pathname === "/railpasses" ? activeStyle : inactiveStyle} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={toggleMobileMenu}
            >
              Rail Passes
            </Link>
            <Link 
              href="/rail-maps" 
              className={`${pathname === "/rail-maps" ? activeStyle : inactiveStyle} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={toggleMobileMenu}
            >
              Rail Maps
            </Link>
            <Link 
              href="/recommended-trips" 
              className={`${pathname === "/recommended-trips" ? activeStyle : inactiveStyle} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={toggleMobileMenu}
            >
              Recommended Trips
            </Link>
            <Link 
              href="/country-guides" 
              className={`${pathname === "/country-guides" ? activeStyle : inactiveStyle} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={toggleMobileMenu}
            >
              Country Guides
            </Link>

            {/* User related links */}
            {isAuthenticated ? (
              <>
                <Link 
                  href="/trips" 
                  className={`${pathname === "/trips" ? activeStyle : inactiveStyle} block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={toggleMobileMenu}
                >
                  My Trips
                </Link>
                <Link 
                  href="/profile" 
                  className={`${pathname === "/profile" ? activeStyle : inactiveStyle} block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-[#06D6A0]"
                >
                  Log Out
                </button>
                <Link 
                  href="/trips/new" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-[#FFD166] text-[#264653] hover:bg-[#FFC233]"
                  onClick={toggleMobileMenu}
                >
                  Plan New Trip
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#264653] hover:text-[#06D6A0]"
                  onClick={toggleMobileMenu}
                >
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-[#06D6A0] text-white hover:bg-[#05c091]"
                  onClick={toggleMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 