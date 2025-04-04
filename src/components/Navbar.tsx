import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image
                src="/gur-logo2 wide.svg"
                alt="GoEuroRail Logo"
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/trips" 
              className="text-[#264653] hover:text-[#06D6A0] px-3 py-2 rounded-md text-sm font-medium"
            >
              My Trips
            </Link>
            <Link 
              href="/trips/new" 
              className="bg-[#FFD166] text-[#264653] hover:bg-[#FFC233] px-4 py-2 rounded-md text-sm font-medium"
            >
              Plan New Trip
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 