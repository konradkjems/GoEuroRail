"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  LanguageIcon,
  TicketIcon,
  StarIcon,
  GlobeEuropeAfricaIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  RocketLaunchIcon
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
    image: "/Photos/paris.jpg",
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
    image: "/Photos/rome.jpg",
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
    image: "/Photos/city walking tour.jpg",
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
    image: "/Photos/barcelona.jpg",
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
    image: "/Photos/alpine.jpg",
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
    image: "/Photos/amsterdam.jpg",
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
    image: "/Photos/classic-capitals.jpg",
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
    image: "/Photos/bike tour.jpg",
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

export default function CountryDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [country, setCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find the country with the matching ID
    const foundCountry = countries.find(c => c.id === params.id);
    
    if (foundCountry) {
      setCountry(foundCountry);
    }
    
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06D6A0]"></div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#264653] mb-4">Country Not Found</h1>
          <p className="text-gray-600 mb-6">The country guide you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/country-guides" 
            className="inline-flex items-center text-[#06D6A0] hover:text-[#05c091] font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to country guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/country-guides" 
          className="inline-flex items-center text-[#264653] hover:text-[#06D6A0] transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to all countries
        </Link>
      </div>

      {/* Hero section */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8">
        <Image
          src={country.image}
          alt={country.name}
          fill
          priority
          style={{ objectFit: "cover" }}
          className="brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{country.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white mb-2">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-1" />
              <span>Capital: {country.capital}</span>
            </div>
            <div className="flex items-center">
              <LanguageIcon className="h-5 w-5 mr-1" />
              <span>Language: {country.language}</span>
            </div>
            <div className="flex items-center">
              <CurrencyEuroIcon className="h-5 w-5 mr-1" />
              <span>Currency: {country.currency}</span>
            </div>
          </div>
          <p className="text-white/90 max-w-2xl">{country.description}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Country details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Rail Network */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-[#06D6A0]/20 p-2 rounded-lg mr-3">
                <RocketLaunchIcon className="h-6 w-6 text-[#06D6A0]" />
              </div>
              <h2 className="text-2xl font-bold text-[#264653]">Rail Network</h2>
            </div>
            <p className="text-gray-700 mb-4">{country.railNetwork}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#264653] mb-2">Rail Pass Options:</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>{country.name === "UK" ? "BritRail Pass" : (country.name === "Italy" ? "Trenitalia Pass" : "Eurail/Interrail One Country Pass")}</li>
                <li>Eurail Global Pass (for non-European residents)</li>
                <li>Interrail Global Pass (for European residents)</li>
                <li>Point-to-point tickets</li>
              </ul>
            </div>
          </section>

          {/* Major Cities */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-6">
              <div className="bg-[#FFD166]/20 p-2 rounded-lg mr-3">
                <MapPinIcon className="h-6 w-6 text-[#FFD166]" />
              </div>
              <h2 className="text-2xl font-bold text-[#264653]">Major Cities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {country.majorCities.map((city: string, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div className="bg-[#264653] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#264653]">{city}</h3>
                    {city === country.capital && (
                      <span className="text-xs text-[#06D6A0] font-medium">Capital City</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Must-Visit Places */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-6">
              <div className="bg-[#EF476F]/20 p-2 rounded-lg mr-3">
                <StarIcon className="h-6 w-6 text-[#EF476F]" />
              </div>
              <h2 className="text-2xl font-bold text-[#264653]">Must-Visit Places</h2>
            </div>
            <div className="space-y-4">
              {country.mustVisit.map((place: string, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-[#264653] flex items-center">
                    <span className="bg-[#EF476F] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">{index + 1}</span>
                    {place}
                  </h3>
                  <p className="text-gray-600 mt-1 pl-8">
                    Accessible by {index % 2 === 0 ? "direct train" : "train and short local transport"}.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column - Travel Tips and Related */}
        <div className="lg:col-span-1">
          {/* Travel Tips */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-[#264653]/10 p-2 rounded-lg mr-3">
                <InformationCircleIcon className="h-6 w-6 text-[#264653]" />
              </div>
              <h3 className="text-xl font-bold text-[#264653]">Rail Travel Tips</h3>
            </div>
            
            <ul className="space-y-3">
              {country.travelTips.map((tip: string, index: number) => (
                <li key={index} className="flex">
                  <span className="text-[#06D6A0] mr-2">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Plan a Trip */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-[#264653] mb-4">Plan a Trip to {country.name}</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-[#264653] mb-1">Best Time to Visit</h4>
                <p className="text-gray-600 text-sm">
                  {country.id === "spain" || country.id === "italy" ? 
                    "Spring (April-May) and Fall (September-October) for pleasant weather and fewer tourists." :
                    country.id === "switzerland" || country.id === "austria" ?
                    "Summer (June-August) for hiking, Winter (December-March) for skiing." :
                    "Summer (June-August) for the best weather, Spring (April-May) for fewer crowds."
                  }
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-[#264653] mb-1">Average Trip Duration</h4>
                <p className="text-gray-600 text-sm">
                  7-10 days recommended to explore major cities and attractions.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/trips/new"
                className="w-full bg-[#06D6A0] hover:bg-[#05C090] text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center"
              >
                Create a Custom Trip
              </Link>
              <a
                href="#"
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-[#264653] font-medium py-3 px-4 rounded-lg flex justify-center items-center"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`${country.name} Rail Map has been downloaded.`);
                }}
              >
                Download Rail Map
              </a>
            </div>
          </div>
          
          {/* Related Countries */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#264653] mb-4">Nearby Countries</h3>
            
            <div className="space-y-3">
              {countries
                .filter(c => c.id !== country.id)
                .slice(0, 3)
                .map(relatedCountry => (
                  <Link
                    key={relatedCountry.id}
                    href={`/country-guides/${relatedCountry.id}`}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 relative rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={relatedCountry.image}
                        alt={relatedCountry.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#264653]">{relatedCountry.name}</h4>
                      <p className="text-gray-500 text-sm">{relatedCountry.capital}</p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                  </Link>
                ))
              }
              
              <Link 
                href="/country-guides" 
                className="text-[#06D6A0] hover:text-[#05c091] font-medium flex items-center justify-center mt-4"
              >
                View All Countries
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular train routes */}
      <section className="mt-12 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-[#264653] mb-6">Popular Train Routes in {country.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {generatePopularRoutes(country.majorCities).map((route, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#264653]">{route.from} to {route.to}</h3>
                <span className="text-[#06D6A0] font-medium">{route.duration}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <RocketLaunchIcon className="h-4 w-4 mr-1" />
                <span>{route.trainType}</span>
                <span className="mx-2">•</span>
                <span>{route.frequency}</span>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                {route.note}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Helper function to generate popular routes between cities
function generatePopularRoutes(cities: string[]) {
  const routes = [];
  
  // Generate routes between the first 3-4 most important cities
  const mainCities = cities.slice(0, Math.min(4, cities.length));
  
  for (let i = 0; i < mainCities.length; i++) {
    for (let j = i + 1; j < mainCities.length; j++) {
      const hours = Math.floor(Math.random() * 4) + 1; // 1-5 hours
      const minutes = Math.floor(Math.random() * 60); // 0-59 minutes
      
      routes.push({
        from: mainCities[i],
        to: mainCities[j],
        duration: `${hours}h ${minutes < 10 ? '0' + minutes : minutes}m`,
        trainType: ["High-speed", "Regional", "InterCity"][Math.floor(Math.random() * 3)],
        frequency: ["Hourly", "Every 2 hours", "4-5 times daily"][Math.floor(Math.random() * 3)],
        note: ["Reservation required", "Scenic route", "No reservation needed", "Popular route - book early"][Math.floor(Math.random() * 4)]
      });
      
      // Don't generate too many routes
      if (routes.length >= 4) break;
    }
    if (routes.length >= 4) break;
  }
  
  return routes;
} 