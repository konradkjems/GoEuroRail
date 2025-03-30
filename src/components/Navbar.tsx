import Link from "next/link";
import { MapIcon, HomeIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl flex items-center">
          <MapIcon className="h-6 w-6 mr-2" />
          Interrail Planner
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-blue-200 flex items-center">
            <HomeIcon className="h-5 w-5 mr-1" />
            <span>Home</span>
          </Link>
          
          <Link href="/trips/new" className="text-white hover:text-blue-200 flex items-center">
            <PlusIcon className="h-5 w-5 mr-1" />
            <span>New Trip</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 