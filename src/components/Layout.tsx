import Link from "next/link";
import { useState } from "react";
import { MapIcon, UserIcon, PlusIcon, HomeIcon } from "@heroicons/react/24/outline";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#264653] flex items-center">
            <img src="/logo.svg" alt="GoEuroRail Logo" className="w-8 h-8 mr-2" />
            <span>
              <span className="text-[#264653]">Go</span>
              <span className="text-[#06D6A0]">Euro</span>
              <span className="text-[#FFD166]">Rail</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link 
              href="/" 
              className="nav-link flex items-center"
            >
              <HomeIcon className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
            <Link 
              href="/trips" 
              className="nav-link flex items-center"
            >
              <MapIcon className="h-4 w-4 mr-1" />
              <span>My Trips</span>
            </Link>
            <Link 
              href="/trips/new" 
              className="px-3 py-1 bg-[#FFD166] text-[#264653] rounded hover:bg-[#FFC233] flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>New Trip</span>
            </Link>
          </nav>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#264653]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
} 