"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon, XMarkIcon, ArrowRightIcon, CalculatorIcon } from "@heroicons/react/24/outline";

export default function Passes() {
  const [ageGroup, setAgeGroup] = useState<'adult' | 'youth' | 'senior'>('adult');
  const [travelDuration, setTravelDuration] = useState<'short' | 'medium' | 'long'>('medium');
  const [countries, setCountries] = useState<'few' | 'many'>('many');
  const [eu, setEu] = useState<'inside' | 'outside'>('inside');
  
  // Calculate recommended pass type
  const getRecommendedPass = () => {
    if (eu === 'outside') {
      return 'Eurail Pass';
    }
    
    if (countries === 'few' && travelDuration === 'short') {
      return 'Point-to-Point Tickets';
    }
    
    if (travelDuration === 'long' || countries === 'many') {
      return 'Interrail Global Pass';
    }
    
    return 'Interrail One Country Pass';
  };
  
  const recommendedPass = getRecommendedPass();
  
  return (
    <div className="max-w-7xl mx-auto">
      <section className="relative">
        <div className="h-[400px] relative overflow-hidden rounded-2xl">
          <Image
            src="/photos/rail-pass.jpg"
            alt="European rail pass"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              European Rail Passes
            </h1>
            <p className="text-lg md:text-xl text-white max-w-lg mb-8">
              Compare different rail passes to find the best option for your European adventure.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <h2 className="text-3xl font-bold text-[#264653] mb-8">Types of Rail Passes</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 relative flex-shrink-0">
                <Image
                  src="/photos/interrail-logo.png"
                  alt="Interrail Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Interrail Pass</h3>
                <p className="text-gray-600 mb-4">
                  For European residents. Travel through up to 33 countries with flexible options.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    European Residents
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Global Pass
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    One Country Pass
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 relative flex-shrink-0">
                <Image
                  src="/photos/eurail-logo.png"
                  alt="Eurail Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">Eurail Pass</h3>
                <p className="text-gray-600 mb-4">
                  For non-European residents. Explore up to 33 countries with flexible travel options.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Non-European Residents
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Global Pass
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    Select Pass
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold text-[#264653] mb-6">Pass Comparison</h3>
        
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm mb-16">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Feature</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Interrail Global Pass</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Interrail One Country</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Eurail Global Pass</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Point-to-Point Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">Eligibility</td>
                <td className="py-4 px-6 text-sm text-gray-600">European residents</td>
                <td className="py-4 px-6 text-sm text-gray-600">European residents</td>
                <td className="py-4 px-6 text-sm text-gray-600">Non-European residents</td>
                <td className="py-4 px-6 text-sm text-gray-600">Everyone</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">Coverage</td>
                <td className="py-4 px-6 text-sm text-gray-600">33 countries</td>
                <td className="py-4 px-6 text-sm text-gray-600">Single country</td>
                <td className="py-4 px-6 text-sm text-gray-600">33 countries</td>
                <td className="py-4 px-6 text-sm text-gray-600">Specific routes only</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">Flexibility</td>
                <td className="py-4 px-6 text-sm text-gray-600">High</td>
                <td className="py-4 px-6 text-sm text-gray-600">Medium</td>
                <td className="py-4 px-6 text-sm text-gray-600">High</td>
                <td className="py-4 px-6 text-sm text-gray-600">Low</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">Cost Effectiveness</td>
                <td className="py-4 px-6 text-sm text-gray-600">High for multiple countries</td>
                <td className="py-4 px-6 text-sm text-gray-600">High for single country</td>
                <td className="py-4 px-6 text-sm text-gray-600">High for multiple countries</td>
                <td className="py-4 px-6 text-sm text-gray-600">Best for few journeys</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">Reservations Required</td>
                <td className="py-4 px-6 text-sm text-gray-600">Some trains</td>
                <td className="py-4 px-6 text-sm text-gray-600">Some trains</td>
                <td className="py-4 px-6 text-sm text-gray-600">Some trains</td>
                <td className="py-4 px-6 text-sm text-gray-600">Included</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">Best For</td>
                <td className="py-4 px-6 text-sm text-gray-600">Multi-country trips</td>
                <td className="py-4 px-6 text-sm text-gray-600">Exploring one country</td>
                <td className="py-4 px-6 text-sm text-gray-600">Multi-country trips</td>
                <td className="py-4 px-6 text-sm text-gray-600">Simple itineraries</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className="text-2xl font-semibold text-[#264653] mb-6">Pass Calculator</h3>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-16">
          <p className="text-gray-600 mb-6">
            Answer a few questions to find out which pass is right for you:
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Where do you live?</label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setEu('inside')}
                  className={`flex-1 py-2 text-sm font-medium ${eu === 'inside' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  EU/UK
                </button>
                <button 
                  onClick={() => setEu('outside')}
                  className={`flex-1 py-2 text-sm font-medium ${eu === 'outside' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Outside EU
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setAgeGroup('youth')}
                  className={`flex-1 py-2 text-sm font-medium ${ageGroup === 'youth' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Youth
                </button>
                <button 
                  onClick={() => setAgeGroup('adult')}
                  className={`flex-1 py-2 text-sm font-medium ${ageGroup === 'adult' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Adult
                </button>
                <button 
                  onClick={() => setAgeGroup('senior')}
                  className={`flex-1 py-2 text-sm font-medium ${ageGroup === 'senior' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Senior
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Duration</label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setTravelDuration('short')}
                  className={`flex-1 py-2 text-sm font-medium ${travelDuration === 'short' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  1-7 Days
                </button>
                <button 
                  onClick={() => setTravelDuration('medium')}
                  className={`flex-1 py-2 text-sm font-medium ${travelDuration === 'medium' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  8-14 Days
                </button>
                <button 
                  onClick={() => setTravelDuration('long')}
                  className={`flex-1 py-2 text-sm font-medium ${travelDuration === 'long' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  15+ Days
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Countries to Visit</label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setCountries('few')}
                  className={`flex-1 py-2 text-sm font-medium ${countries === 'few' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  1-2
                </button>
                <button 
                  onClick={() => setCountries('many')}
                  className={`flex-1 py-2 text-sm font-medium ${countries === 'many' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  3+
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CalculatorIcon className="h-6 w-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-[#264653]">Recommended Pass:</h4>
            </div>
            <p className="text-xl font-bold text-blue-600 mb-3">{recommendedPass}</p>
            <p className="text-gray-600 mb-4">
              {recommendedPass === 'Eurail Pass' && 'Best for non-European residents planning to explore multiple countries.'}
              {recommendedPass === 'Interrail Global Pass' && 'Ideal for European residents visiting multiple countries over a longer period.'}
              {recommendedPass === 'Interrail One Country Pass' && 'Perfect for European residents focusing on exploring a single country in depth.'}
              {recommendedPass === 'Point-to-Point Tickets' && 'Most economical for short trips with few train journeys between specific cities.'}
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium gap-1"
            >
              Plan your trip with this pass
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-8">
        <h2 className="text-3xl font-bold text-[#264653] mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-[#264653]">What's the difference between Interrail and Eurail?</h3>
            <p className="text-gray-600">
              Interrail passes are for European residents, while Eurail passes are for non-European residents. 
              Both offer similar benefits and coverage across the same countries.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-[#264653]">Do I need to book seat reservations?</h3>
            <p className="text-gray-600">
              While rail passes give you access to the train network, some high-speed and overnight trains require 
              an additional seat reservation, which comes with an extra fee. This is common in France, Italy, and Spain.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-[#264653]">How do travel days work?</h3>
            <p className="text-gray-600">
              A travel day is a 24-hour period during which you can take as many trains as you want. For example, 
              with a "5 days within 1 month" pass, you can choose any 5 days within a 1-month period to travel unlimited times.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-[#264653]">Are there age discounts?</h3>
            <p className="text-gray-600">
              Yes! Both Interrail and Eurail offer Youth (up to 27 years), Adult (28-59 years), and Senior (60+ years) rates. 
              Youth travelers receive up to 25% off the standard adult fare.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-[#264653]">When should I buy point-to-point tickets instead?</h3>
            <p className="text-gray-600">
              If you're only making a few train journeys or focusing on a specific region, point-to-point tickets might be more 
              economical. They're also good for trips where you need fixed times and guaranteed seats.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-8">
        <div className="bg-[#264653] rounded-2xl p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Rail Adventure?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Create your personalized itinerary and we'll help you choose the best rail pass option.
          </p>
          <Link
            href="/trips/new"
            className="inline-flex items-center bg-[#FFD166] hover:bg-[#FFC233] text-[#264653] px-8 py-4 rounded-lg font-medium gap-2"
          >
            Plan Your Trip
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      {/* Adding new purchase section */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#264653] mb-6 text-center">Purchase Your Rail Pass</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Ready to start your European rail adventure? Purchase your rail pass directly from the official providers.
            Our recommendation: {recommendedPass}.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Interrail Card */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col">
              <div className="w-36 h-36 relative mx-auto mb-6">
                <Image
                  src="/photos/interrail-logo.png"
                  alt="Interrail Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center text-[#264653]">Interrail Pass</h3>
              <p className="text-gray-600 mb-4 text-center">
                For European residents. Travel through up to 33 countries with flexible options.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Benefits:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access to trains in up to 33 European countries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Flexible travel options: 4, 5, 7, 10 or 15 days within 1 or 2 months</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Discounts on ferries, museums, and attractions</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <a 
                  href="https://www.interrail.eu/en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#06D6A0] hover:bg-[#05C090] text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center"
                >
                  Buy Interrail Pass
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You will be redirected to the official Interrail website
                </p>
              </div>
            </div>
            
            {/* Eurail Card */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col">
              <div className="w-36 h-36 relative mx-auto mb-6">
                <Image
                  src="/photos/eurail-logo.png"
                  alt="Eurail Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center text-[#264653]">Eurail Pass</h3>
              <p className="text-gray-600 mb-4 text-center">
                For non-European residents. Explore up to 33 countries with flexible travel options.
              </p>
              <div className="bg-red-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-red-800 mb-2">Benefits:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-red-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access to trains in up to 33 European countries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-red-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Flexible travel options: 4, 5, 7, 10, 15 days or continuous travel</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-red-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Discounts on ferries, museums, and attractions</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <a 
                  href="https://www.eurail.com/en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#EF476F] hover:bg-[#e13a62] text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center"
                >
                  Buy Eurail Pass
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You will be redirected to the official Eurail website
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#264653] mb-4 flex items-center">
              <CalculatorIcon className="h-5 w-5 mr-2 text-[#FFD166]" />
              Which Pass Do I Need?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <span className="text-blue-800 font-bold">EU</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Interrail:</span> For citizens or residents of the European Union or other participating European countries.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <span className="text-red-800 font-bold">Non-EU</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Eurail:</span> For non-European residents visiting Europe for tourism purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 