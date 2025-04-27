"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon, CalendarIcon, MapPinIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

// Trip data
const recommendedTrips = [
  {
    id: "classic-european-capitals",
    title: "Classic European Capitals",
    duration: "14 days",
    countries: ["UK", "France", "Belgium", "Netherlands", "Germany"],
    cities: ["London", "Paris", "Brussels", "Amsterdam", "Berlin"],
    description: "Experience the charm and history of Europe's most iconic capital cities. From the royal heritage of London to the romantic streets of Paris, the EU center of Brussels, the canals of Amsterdam, and the vibrant culture of Berlin.",
    difficulty: "Easy",
    bestSeason: "Year-round",
    highlights: ["Eiffel Tower in Paris", "Amsterdam canals", "Brandenburg Gate in Berlin", "Big Ben in London"],
    image: "/photos/classic-capitals.jpg",
    rating: 4.8,
    reviews: 324,
    tags: ["Capitals", "Urban", "History", "Culture"],
    stops: [
      { city: "London", nights: 3, description: "Start your journey in the UK's vibrant capital" },
      { city: "Paris", nights: 3, description: "Take the Eurostar to the City of Light" },
      { city: "Brussels", nights: 2, description: "Explore the heart of the European Union" },
      { city: "Amsterdam", nights: 3, description: "Discover the famous canal network" },
      { city: "Berlin", nights: 3, description: "End your trip in Germany's historic capital" }
    ]
  },
  {
    id: "mediterranean-explorer",
    title: "Mediterranean Explorer",
    duration: "12 days",
    countries: ["Spain", "France", "Italy"],
    cities: ["Barcelona", "Marseille", "Nice", "Florence", "Rome"],
    description: "Soak up the sun and culture along the stunning Mediterranean coast. From the architectural wonders of Barcelona to the historic treasures of Rome, with picturesque French Riviera stops in between.",
    difficulty: "Moderate",
    bestSeason: "Spring/Fall",
    highlights: ["Sagrada Familia in Barcelona", "French Riviera beaches", "Renaissance art in Florence", "Colosseum in Rome"],
    image: "/photos/barcelona.jpg",
    rating: 4.7,
    reviews: 286,
    tags: ["Beach", "Food", "Art", "Culture"],
    stops: [
      { city: "Barcelona", nights: 3, description: "Experience Gaudí's architectural masterpieces" },
      { city: "Marseille", nights: 1, description: "Explore France's oldest city and major port" },
      { city: "Nice", nights: 2, description: "Relax on the beaches of the French Riviera" },
      { city: "Florence", nights: 2, description: "Immerse yourself in Renaissance art and culture" },
      { city: "Rome", nights: 3, description: "End your journey in the Eternal City" }
    ]
  },
  {
    id: "alpine-adventure",
    title: "Alpine Adventure",
    duration: "10 days",
    countries: ["Switzerland", "Austria", "Germany"],
    cities: ["Zurich", "Lucerne", "Innsbruck", "Salzburg", "Munich"],
    description: "Journey through the breathtaking Alpine region with its stunning mountain landscapes, crystal-clear lakes, and charming towns. Perfect for outdoor enthusiasts and nature lovers.",
    difficulty: "Moderate",
    bestSeason: "Summer/Winter",
    highlights: ["Swiss Alps", "Lake Lucerne", "Austrian Tyrol", "Salzburg Mozart sites", "Munich Oktoberfest grounds"],
    image: "/photos/alpine.jpg",
    rating: 4.9,
    reviews: 215,
    tags: ["Mountains", "Nature", "Hiking", "Scenic"],
    stops: [
      { city: "Zurich", nights: 2, description: "Start in Switzerland's largest city" },
      { city: "Lucerne", nights: 2, description: "Enjoy the picturesque lake and mountain views" },
      { city: "Innsbruck", nights: 1, description: "Cross into Austria's alpine sports hub" },
      { city: "Salzburg", nights: 2, description: "Visit Mozart's birthplace" },
      { city: "Munich", nights: 2, description: "Finish in Bavaria's capital" }
    ]
  },
  {
    id: "eastern-europe-discovery",
    title: "Eastern Europe Discovery",
    duration: "15 days",
    countries: ["Czech Republic", "Poland", "Hungary", "Austria", "Croatia"],
    cities: ["Prague", "Krakow", "Budapest", "Vienna", "Zagreb"],
    description: "Discover the rich history and cultural heritage of Eastern Europe. From the fairytale streets of Prague to the thermal baths of Budapest, with visits to hidden gems along the way.",
    difficulty: "Moderate",
    bestSeason: "Spring/Fall",
    highlights: ["Prague Castle", "Auschwitz Memorial", "Hungarian Parliament", "Vienna Opera House", "Zagreb Cathedral"],
    image: "/photos/eastern-europe.jpg",
    rating: 4.6,
    reviews: 178,
    tags: ["History", "Culture", "Architecture", "Value"],
    stops: [
      { city: "Prague", nights: 3, description: "Begin in the heart of Bohemia" },
      { city: "Krakow", nights: 3, description: "Explore Poland's cultural capital" },
      { city: "Budapest", nights: 3, description: "Relax in the city of thermal spas" },
      { city: "Vienna", nights: 3, description: "Experience the Imperial city's elegance" },
      { city: "Zagreb", nights: 2, description: "Finish in Croatia's capital" }
    ]
  },
  {
    id: "iberian-adventure",
    title: "Iberian Adventure",
    duration: "11 days",
    countries: ["Portugal", "Spain"],
    cities: ["Lisbon", "Porto", "Madrid", "Seville", "Barcelona"],
    description: "Experience the vibrant cultures, beautiful coastlines, and historic cities of the Iberian Peninsula. From Portugal's melancholic fado to Spain's passionate flamenco.",
    difficulty: "Easy",
    bestSeason: "Spring/Fall",
    highlights: ["Lisbon's historical trams", "Porto wine cellars", "Madrid's Prado Museum", "Seville's Alcázar", "Barcelona's La Rambla"],
    image: "/photos/iberian.jpg",
    rating: 4.8,
    reviews: 205,
    tags: ["Food", "Culture", "Beaches", "Architecture"],
    stops: [
      { city: "Lisbon", nights: 2, description: "Start in Portugal's hilly coastal capital" },
      { city: "Porto", nights: 2, description: "Taste the famous port wine" },
      { city: "Madrid", nights: 2, description: "Visit Spain's central capital" },
      { city: "Seville", nights: 2, description: "Experience authentic Andalusian culture" },
      { city: "Barcelona", nights: 2, description: "Conclude in the Catalan coastal city" }
    ]
  },
  {
    id: "scandinavian-journey",
    title: "Scandinavian Journey",
    duration: "12 days",
    countries: ["Denmark", "Sweden", "Norway"],
    cities: ["Copenhagen", "Malmö", "Stockholm", "Oslo", "Bergen"],
    description: "Explore the stunning landscapes and progressive cities of Scandinavia. From Copenhagen's colorful harbors to the Norwegian fjords, this trip offers natural beauty and Nordic design.",
    difficulty: "Moderate",
    bestSeason: "Summer",
    highlights: ["Copenhagen's Nyhavn", "Stockholm Archipelago", "Oslo Opera House", "Bergen Fjords", "Scandinavian design"],
    image: "/photos/scandinavian.jpg",
    rating: 4.7,
    reviews: 142,
    tags: ["Nature", "Design", "Fjords", "Modern"],
    stops: [
      { city: "Copenhagen", nights: 3, description: "Begin in Denmark's bike-friendly capital" },
      { city: "Malmö", nights: 1, description: "Cross the Øresund Bridge to Sweden" },
      { city: "Stockholm", nights: 3, description: "Explore the city built on 14 islands" },
      { city: "Oslo", nights: 2, description: "Visit Norway's modern capital" },
      { city: "Bergen", nights: 2, description: "End your journey at the gateway to the fjords" }
    ]
  }
];

export default function RecommendedTrips() {
  const [filter, setFilter] = useState({
    duration: 'all',
    difficulty: 'all',
    season: 'all',
    searchQuery: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter the trips based on user selections
  const filteredTrips = recommendedTrips.filter(trip => {
    // Duration filter
    if (filter.duration !== 'all') {
      const days = parseInt(trip.duration);
      if (filter.duration === 'short' && days > 10) return false;
      if (filter.duration === 'medium' && (days <= 10 || days > 14)) return false;
      if (filter.duration === 'long' && days <= 14) return false;
    }
    
    // Difficulty filter
    if (filter.difficulty !== 'all' && trip.difficulty.toLowerCase() !== filter.difficulty) return false;
    
    // Season filter
    if (filter.season !== 'all' && !trip.bestSeason.toLowerCase().includes(filter.season.toLowerCase())) return false;
    
    // Search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const inTitle = trip.title.toLowerCase().includes(query);
      const inCountries = trip.countries.some(country => country.toLowerCase().includes(query));
      const inCities = trip.cities.some(city => city.toLowerCase().includes(query));
      const inTags = trip.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!(inTitle || inCountries || inCities || inTags)) return false;
    }
    
    return true;
  });
  
  return (
    <div className="max-w-7xl mx-auto">
      <section className="relative">
        <div className="h-[400px] relative overflow-hidden rounded-2xl">
          <Image
            src="/photos/classic-capitals.jpg"
            alt="European rail journey"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Recommended Rail Trips
            </h1>
            <p className="text-lg md:text-xl text-white max-w-lg mb-8">
              Discover our hand-picked itineraries for the perfect European rail adventure.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-[#264653]">
            Popular Itineraries
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trips..."
                className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
                value={filter.searchQuery}
                onChange={(e) => setFilter({...filter, searchQuery: e.target.value})}
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2"
                value={filter.duration}
                onChange={(e) => setFilter({...filter, duration: e.target.value})}
              >
                <option value="all">All Durations</option>
                <option value="short">Short (10 days or less)</option>
                <option value="medium">Medium (11-14 days)</option>
                <option value="long">Long (15+ days)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2"
                value={filter.difficulty}
                onChange={(e) => setFilter({...filter, difficulty: e.target.value})}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Best Season</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2"
                value={filter.season}
                onChange={(e) => setFilter({...filter, season: e.target.value})}
              >
                <option value="all">All Seasons</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
                <option value="year-round">Year-Round</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <Link 
              key={trip.id}
              href={`/recommended-trips/${trip.id}`}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 text-[#264653] px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                  {trip.rating} ★ ({trip.reviews})
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  {trip.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">{trip.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>{trip.duration}</span>
                  <span className="mx-1">•</span>
                  <MapPinIcon className="h-4 w-4" />
                  <span>{trip.countries.length} countries</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {trip.cities.map((city, index) => (
                    <span key={index} className="text-gray-500 text-sm">
                      {city}{index < trip.cities.length - 1 ? ' → ' : ''}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#06D6A0]">View Trip</span>
                  <ArrowRightIcon className="h-5 w-5 text-[#06D6A0]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredTrips.length === 0 && (
          <div className="bg-gray-50 p-8 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-2 text-[#264653]">No trips match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all our trips.</p>
            <button 
              onClick={() => setFilter({duration: 'all', difficulty: 'all', season: 'all', searchQuery: ''})}
              className="bg-[#06D6A0] hover:bg-[#05c091] text-white px-4 py-2 rounded-lg font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
      
      <section className="py-12">
        <h2 className="text-3xl font-bold text-[#264653] mb-8">Plan Your Own Trip</h2>
        
        <div className="bg-white p-8 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4 text-[#264653]">Custom Itinerary Builder</h3>
            <p className="text-gray-600 mb-6">
              Not finding exactly what you're looking for? Use our interactive trip planner to create a 
              personalized rail journey across Europe, tailored to your interests and schedule.
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center bg-[#FFD166] hover:bg-[#FFC233] text-[#264653] px-6 py-3 rounded-lg font-medium gap-2"
            >
              Create Custom Trip
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-80 w-full rounded-lg overflow-hidden">
            <Image
              src="/photos/custom-trip.jpg"
              alt="Custom trip planning"
              fill
              style={{ objectFit: "cover" }}
              className="brightness-[0.85]"
            />
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <h2 className="text-3xl font-bold text-[#264653] mb-8">Planning Tips</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#264653]">Best Time to Travel</h3>
            <p className="text-gray-600 mb-4">
              The ideal time for European rail travel depends on your destinations and preferences:
            </p>
            <ul className="space-y-2 text-gray-600 list-disc pl-6">
              <li><strong>Spring (April-May):</strong> Mild weather, fewer crowds, blooming landscapes</li>
              <li><strong>Summer (June-August):</strong> Warm weather, longer daylight hours, peak season</li>
              <li><strong>Fall (September-October):</strong> Pleasant temperatures, autumn colors, less crowded</li>
              <li><strong>Winter (November-March):</strong> Christmas markets, winter sports in Alpine regions</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#264653]">Packing Essentials</h3>
            <p className="text-gray-600 mb-4">
              Keep your luggage light and manageable for easy train travel:
            </p>
            <ul className="space-y-2 text-gray-600 list-disc pl-6">
              <li>Wheeled carry-on luggage (easy to maneuver on/off trains)</li>
              <li>Universal travel adapter for European outlets</li>
              <li>Comfortable walking shoes for exploring cities</li>
              <li>Weather-appropriate clothing (layers are key)</li>
              <li>Power bank for mobile devices</li>
              <li>Water bottle and snacks for long journeys</li>
              <li>Rail pass and travel documents in one secure place</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 