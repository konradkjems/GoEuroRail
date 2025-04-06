"use client";

import { useState } from "react";
import Link from "next/link";
import LowercaseImage from "@/components/LowercaseImage";
import { 
  MapPinIcon, 
  MapIcon, 
  MagnifyingGlassIcon, 
  ArrowRightIcon,
  GlobeEuropeAfricaIcon 
} from "@heroicons/react/24/outline";

// Country data
const countries = [
  {
    id: "france",
    name: "France",
    description: "Home to world-class cuisine, iconic landmarks, and diverse landscapes - from the lavender fields of Provence to the beaches of the French Riviera.",
    capital: "Paris",
    language: "French",
    currency: "Euro (€)",
    image: "/photos/paris.jpg",
    railNetwork: "Extensive high-speed TGV network",
    majorCities: ["Paris", "Lyon", "Marseille", "Bordeaux", "Nice"],
    mustVisit: ["Eiffel Tower", "Louvre Museum", "Mont Saint-Michel", "French Riviera", "Loire Valley Châteaux"],
    travelTips: [
      "Make seat reservations for high-speed TGV trains in advance",
      "Consider the France Rail Pass for extensive travel within the country",
      "Paris has an excellent metro system for city exploration",
      "Regional trains (TER) don't usually require reservations"
    ]
  },
  {
    id: "italy",
    name: "Italy",
    description: "A treasure trove of art, history, and cuisine. From Roman ruins to Renaissance masterpieces, Italy offers an unmatched cultural experience.",
    capital: "Rome",
    language: "Italian",
    currency: "Euro (€)",
    image: "/photos/rome.jpg",
    railNetwork: "Well-connected with high-speed Frecciarossa trains",
    majorCities: ["Rome", "Florence", "Venice", "Milan", "Naples"],
    mustVisit: ["Colosseum", "Vatican City", "Venice Canals", "Florence Cathedral", "Amalfi Coast"],
    travelTips: [
      "Book high-speed trains in advance for the best prices",
      "Validate your ticket before boarding regional trains",
      "Major cities are well-connected by high-speed rail",
      "Consider point-to-point tickets for limited travel"
    ]
  },
  {
    id: "germany",
    name: "Germany",
    description: "Efficiency meets beauty in Germany, with its fairy-tale castles, vibrant cities, and stunning Black Forest. A rail traveler's paradise with punctual trains.",
    capital: "Berlin",
    language: "German",
    currency: "Euro (€)",
    image: "/photos/berlin.jpg",
    railNetwork: "Comprehensive ICE high-speed network",
    majorCities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    mustVisit: ["Brandenburg Gate", "Neuschwanstein Castle", "Cologne Cathedral", "Black Forest", "Bavarian Alps"],
    travelTips: [
      "German trains are known for punctuality",
      "The ICE high-speed network connects major cities",
      "Seat reservations are recommended but not mandatory",
      "Regional day tickets offer unlimited travel within regions"
    ]
  },
  {
    id: "spain",
    name: "Spain",
    description: "A vibrant blend of passionate culture, stunning architecture, and beautiful coastlines. From flamenco to modernist masterpieces, Spain captivates all visitors.",
    capital: "Madrid",
    language: "Spanish",
    currency: "Euro (€)",
    image: "/photos/barcelona.jpg",
    railNetwork: "Modern AVE high-speed trains",
    majorCities: ["Madrid", "Barcelona", "Seville", "Valencia", "Malaga"],
    mustVisit: ["Sagrada Familia", "Alhambra", "Plaza Mayor", "Park Güell", "Guggenheim Museum Bilbao"],
    travelTips: [
      "AVE high-speed trains require reservations",
      "Significant discounts available when booking early",
      "Consider the Spain Rail Pass for multiple journeys",
      "Cercanías trains provide service around major cities"
    ]
  },
  {
    id: "switzerland",
    name: "Switzerland",
    description: "A picturesque alpine paradise with pristine lakes, snow-capped mountains, and charming villages. The Swiss rail system is a marvel of engineering and efficiency.",
    capital: "Bern",
    language: "German, French, Italian, Romansh",
    currency: "Swiss Franc (CHF)",
    image: "/photos/alpine.jpg",
    railNetwork: "Comprehensive and punctual SBB network",
    majorCities: ["Zurich", "Geneva", "Bern", "Basel", "Lucerne"],
    mustVisit: ["Matterhorn", "Lake Geneva", "Swiss Alps", "Interlaken", "Rhine Falls"],
    travelTips: [
      "Consider the Swiss Travel Pass for extensive travel",
      "Most scenic routes don't require reservations",
      "Trains are extremely punctual - don't be late!",
      "The GoldenPass, Bernina Express, and Glacier Express offer spectacular views"
    ]
  },
  {
    id: "netherlands",
    name: "Netherlands",
    description: "A flat country known for its tulips, windmills, and cycling culture. The Netherlands combines historic charm with progressive urban planning.",
    capital: "Amsterdam",
    language: "Dutch",
    currency: "Euro (€)",
    image: "/photos/amsterdam.jpg",
    railNetwork: "Dense NS network covering the entire country",
    majorCities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    mustVisit: ["Amsterdam Canals", "Keukenhof Gardens", "Rijksmuseum", "Kinderdijk Windmills", "Rotterdam Architecture"],
    travelTips: [
      "No reservations needed for domestic trains",
      "Trains run frequently between major cities",
      "Consider the Holland Travel Ticket for unlimited daily travel",
      "Bikes can be taken on trains outside rush hours"
    ]
  },
  {
    id: "uk",
    name: "United Kingdom",
    description: "From the rolling hills of the countryside to the bustling streets of London, the UK offers rich history, cultural diversity, and stunning landscapes.",
    capital: "London",
    language: "English",
    currency: "Pound Sterling (£)",
    image: "/photos/london.jpg",
    railNetwork: "Extensive network with high-speed services",
    majorCities: ["London", "Edinburgh", "Manchester", "Birmingham", "Glasgow"],
    mustVisit: ["Tower of London", "Edinburgh Castle", "Stonehenge", "Lake District", "Scottish Highlands"],
    travelTips: [
      "Book tickets well in advance for the best prices",
      "Consider the BritRail Pass for extensive travel",
      "Off-peak tickets offer significant savings",
      "The Eurostar connects London with continental Europe"
    ]
  },
  {
    id: "austria",
    name: "Austria",
    description: "A land of alpine beauty, classical music, and imperial grandeur. Austria combines stunning natural landscapes with rich cultural heritage.",
    capital: "Vienna",
    language: "German",
    currency: "Euro (€)",
    image: "/photos/vienna.png",
    railNetwork: "Modern ÖBB network with efficient services",
    majorCities: ["Vienna", "Salzburg", "Innsbruck", "Graz", "Linz"],
    mustVisit: ["Schönbrunn Palace", "Historic Center of Vienna", "Salzburg Old Town", "Austrian Alps", "Hallstatt"],
    travelTips: [
      "ÖBB Railjet trains connect major cities efficiently",
      "Seat reservations recommended for long journeys",
      "Regional trains offer great views of the countryside",
      "Consider the Austria Rail Pass for extensive travel"
    ]
  }
];

export default function CountryGuides() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  
  // Filter countries based on search and region
  const filteredCountries = countries.filter(country => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const inName = country.name.toLowerCase().includes(query);
      const inDescription = country.description.toLowerCase().includes(query);
      const inCities = country.majorCities.some(city => city.toLowerCase().includes(query));
      
      if (!(inName || inDescription || inCities)) return false;
    }
    
    // Region filter
    if (selectedRegion !== "all") {
      const westernEurope = ["France", "Germany", "Netherlands", "Belgium", "Luxembourg", "Switzerland", "Austria"];
      const southernEurope = ["Italy", "Spain", "Portugal", "Greece", "Malta", "Cyprus"];
      const northernEurope = ["UK", "Ireland", "Denmark", "Sweden", "Norway", "Finland", "Iceland"];
      const easternEurope = ["Poland", "Czech Republic", "Slovakia", "Hungary", "Romania", "Bulgaria"];
      
      if (selectedRegion === "western" && !westernEurope.includes(country.name)) return false;
      if (selectedRegion === "southern" && !southernEurope.includes(country.name)) return false;
      if (selectedRegion === "northern" && !northernEurope.includes(country.name)) return false;
      if (selectedRegion === "eastern" && !easternEurope.includes(country.name)) return false;
    }
    
    return true;
  });
  
  return (
    <div className="max-w-7xl mx-auto">
      <section className="relative">
        <div className="h-[400px] relative overflow-hidden rounded-2xl">
          <LowercaseImage
            src="/photos/classic-european-capitals.jpg"
            alt="Map of Europe"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              European Country Guides
            </h1>
            <p className="text-lg md:text-xl text-white max-w-lg mb-8">
              Essential information and rail travel tips for exploring Europe by train.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-[#264653]">
            Country Information
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search countries..."
                className="px-4 py-2 pl-10 border border-gray-300 rounded-lg w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">All Regions</option>
              <option value="western">Western Europe</option>
              <option value="southern">Southern Europe</option>
              <option value="northern">Northern Europe</option>
              <option value="eastern">Eastern Europe</option>
            </select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCountries.map((country) => (
            <Link
              href={`/country-guides/${country.id}`}
              key={country.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
            >
              <div className="relative h-48 w-full">
                <LowercaseImage
                  src={country.image}
                  alt={country.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#264653] mb-1">{country.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>Capital: {country.capital}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{country.description}</p>
                <div className="flex flex-wrap gap-2">
                  {country.majorCities.slice(0, 3).map((city, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {city}
                    </span>
                  ))}
                  {country.majorCities.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      +{country.majorCities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredCountries.length === 0 && (
          <div className="bg-gray-50 p-8 rounded-xl text-center mb-16">
            <h3 className="text-xl font-semibold mb-2 text-[#264653]">No countries match your search</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all countries.</p>
            <button 
              onClick={() => {setSearchQuery(""); setSelectedRegion("all");}}
              className="bg-[#06D6A0] hover:bg-[#05c091] text-white px-4 py-2 rounded-lg font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
      
      {/* Rail Maps Promo Section */}
      <section className="py-8 mb-16">
        <div className="bg-[#06D6A0]/10 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 md:w-2/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#06D6A0]/10 z-10"></div>
            <LowercaseImage 
              src="/photos/rail-maps/High_Speed_Railroad_Map_of_Europe.svg.png"
              alt="European High-Speed Rail Network"
              fill
              style={{ objectFit: "cover", objectPosition: "left" }}
              className="opacity-40"
            />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center mb-4">
              <MapIcon className="h-6 w-6 text-[#06D6A0] mr-2" />
              <h2 className="text-2xl font-bold text-[#264653]">Rail Maps Now Available</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Explore detailed rail maps for each country to help plan your train journey. 
              View major routes, high-speed lines, and connections between cities to optimize your travel itinerary.
              Our expanded collection now includes 28 maps covering almost every European country!
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {countries.slice(0, 5).map(country => (
                <Link 
                  key={country.id}
                  href={`/rail-maps#${country.id}`}
                  className="bg-white py-1 px-3 rounded-full text-sm font-medium text-[#264653] hover:bg-[#06D6A0] hover:text-white transition-colors shadow-sm"
                >
                  {country.name} Rail Map
                </Link>
              ))}
              <Link 
                href="/rail-maps"
                className="bg-white py-1 px-3 rounded-full text-sm font-medium text-[#264653] hover:bg-[#06D6A0] hover:text-white transition-colors shadow-sm"
              >
                View All Maps →
              </Link>
            </div>
            <Link
              href="/rail-maps"
              className="inline-flex items-center bg-[#06D6A0] hover:bg-[#05c091] text-white px-5 py-2 rounded-lg font-medium text-sm"
            >
              Explore All Rail Maps
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-8 mb-16">
        <h2 className="text-3xl font-bold text-[#264653] mb-8">Rail Travel in Europe</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#264653]">European Rail Networks</h3>
            <p className="text-gray-600 mb-4">
              Europe's rail network is one of the most developed in the world, making train travel an efficient and enjoyable way to explore the continent:
            </p>
            <ul className="space-y-2 text-gray-600 list-disc pl-6">
              <li><strong>High-Speed Rail:</strong> Networks like TGV (France), ICE (Germany), AVE (Spain), and Eurostar connect major cities quickly</li>
              <li><strong>Regional Services:</strong> Comprehensive local networks reach smaller towns and rural areas</li>
              <li><strong>Scenic Routes:</strong> Famous journeys like the Glacier Express (Switzerland) and Bergen Railway (Norway) offer spectacular views</li>
              <li><strong>Night Trains:</strong> Services like the NightJet network allow you to travel overnight and save on accommodation</li>
              <li><strong>Cross-Border Connections:</strong> International services make it easy to travel between countries</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#264653]">General Rail Travel Tips</h3>
            <p className="text-gray-600 mb-4">
              Make the most of your European rail adventure with these helpful tips:
            </p>
            <ul className="space-y-2 text-gray-600 list-disc pl-6">
              <li><strong>Book in Advance:</strong> Many high-speed and long-distance trains offer discounts for early booking</li>
              <li><strong>Consider Rail Passes:</strong> If visiting multiple countries, Eurail or Interrail passes may save money</li>
              <li><strong>Reservations:</strong> Some trains require seat reservations, especially in France, Italy, and Spain</li>
              <li><strong>Platform Information:</strong> Check the departure boards regularly as platform numbers may change</li>
              <li><strong>Light Packing:</strong> Travel with luggage you can easily carry up and down stairs</li>
              <li><strong>Off-Peak Travel:</strong> Enjoy less crowded trains and sometimes lower prices by traveling mid-week</li>
              <li><strong>Mobile Tickets:</strong> Most rail operators offer e-tickets through their apps for convenient travel</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="py-8">
        <div className="bg-gradient-to-r from-[#264653] to-[#2A9D8F] text-white p-8 rounded-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Planning a Rail Trip Across Europe?</h2>
              <p className="text-lg mb-6">
                Get personalized recommendations based on your interests, budget, and travel style.
                Our rail pass comparison tool will help you choose the best option for your journey.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/passes"
                  className="bg-[#FFD166] hover:bg-[#FFC233] text-[#264653] px-6 py-3 rounded-lg font-medium"
                >
                  Compare Rail Passes
                </Link>
                <Link
                  href="/trips/new"
                  className="bg-white hover:bg-gray-100 text-[#264653] px-6 py-3 rounded-lg font-medium"
                >
                  Plan a Custom Trip
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <GlobeEuropeAfricaIcon className="h-56 w-56 text-white/20" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 