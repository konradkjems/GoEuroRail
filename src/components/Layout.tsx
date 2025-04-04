import Link from "next/link";
import { useState } from "react";
import { MapIcon, UserIcon, PlusIcon, HomeIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow relative z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#264653] flex items-center">
            <img src="/gur-logo2 wide.svg" alt="GoEuroRail Logo" className="h-10 w-auto" />
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link 
              href="/" 
              className={`nav-link flex items-center text-[#264653] hover:text-[#06D6A0] ${isActive('/') ? 'text-[#06D6A0]' : ''}`}
            >
              <HomeIcon className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
            <Link 
              href="/trips" 
              className={`nav-link flex items-center text-[#264653] hover:text-[#06D6A0] ${isActive('/trips') ? 'text-[#06D6A0]' : ''}`}
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#264653] hover:text-[#06D6A0] transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
            <div className="container mx-auto px-4 py-2 space-y-2">
              <Link 
                href="/" 
                className={`block py-2 text-[#264653] hover:text-[#06D6A0] ${isActive('/') ? 'text-[#06D6A0]' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <HomeIcon className="h-4 w-4 mr-2" />
                  <span>Home</span>
                </div>
              </Link>
              <Link 
                href="/trips" 
                className={`block py-2 text-[#264653] hover:text-[#06D6A0] ${isActive('/trips') ? 'text-[#06D6A0]' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <MapIcon className="h-4 w-4 mr-2" />
                  <span>My Trips</span>
                </div>
              </Link>
              <Link 
                href="/trips/new" 
                className="block py-2 px-3 bg-[#FFD166] text-[#264653] rounded hover:bg-[#FFC233]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  <span>New Trip</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 