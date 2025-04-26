'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  FaInstagram, 
  FaFacebook, 
  FaTwitter 
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/gur-logo2.svg" 
                alt="GoEurorail Logo" 
                width={40} 
                height={40} 
                className="bg-white rounded-full p-1"
              />
              <span className="font-bold text-xl">GoEurorail</span>
            </div>
            <p className="text-gray-300 text-sm max-w-xs">
              Plan your dream interrail trip across Europe with ease. Discover the best routes, destinations and experiences.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:mx-auto">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
              <li><Link href="/trips" className="text-gray-300 hover:text-white transition">Planner</Link></li>
              <li><Link href="/destinations" className="text-gray-300 hover:text-white transition">Destinations</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition">
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center sm:text-left text-sm text-gray-400">
          © GoEurorail 2025. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 