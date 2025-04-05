"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  GlobeEuropeAfricaIcon,
  SunIcon,
  TagIcon,
  StarIcon,
  RocketLaunchIcon as TrainIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

// Import the trip data from the main page
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
    image: "/Photos/classic-capitals.jpg",
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
    image: "/Photos/barcelona.jpg",
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
    image: "/Photos/alpine.jpg",
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
    image: "/Photos/eastern-europe.jpg",
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
    image: "/Photos/iberian.jpg",
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
    image: "/Photos/scandinavian.jpg",
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

export default function TripDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [departureDate, setDepartureDate] = useState<string>('');
  const [travelers, setTravelers] = useState<number>(1);

  useEffect(() => {
    // Find the trip with the matching ID
    const foundTrip = recommendedTrips.find(t => t.id === params.id);
    
    if (foundTrip) {
      setTrip(foundTrip);
      
      // Set default departure date to 2 months from now
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 2);
      setDepartureDate(defaultDate.toISOString().split('T')[0]);
    }
    
    setLoading(false);
  }, [params.id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalNights = () => {
    if (!trip) return 0;
    return trip.stops.reduce((total: number, stop: any) => total + stop.nights, 0);
  };

  const createTrip = () => {
    // Here we would typically save this to the user's trip list
    // For now, just navigate back to trips page
    alert("Trip plan saved! You can now find it in your trips.");
    router.push("/trips");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06D6A0]"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#264653] mb-4">Trip Not Found</h1>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/recommended-trips" 
            className="inline-flex items-center text-[#06D6A0] hover:text-[#05c091] font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to recommended trips
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
          href="/recommended-trips" 
          className="inline-flex items-center text-[#264653] hover:text-[#06D6A0] transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to all trips
        </Link>
      </div>

      {/* Hero section */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          priority
          style={{ objectFit: "cover" }}
          className="brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {trip.tags.map((tag: string, index: number) => (
              <span 
                key={index} 
                className="bg-white/90 text-[#264653] px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-1" />
              <span>{trip.duration}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-1" />
              <span>{trip.countries.join(', ')}</span>
            </div>
            <div className="flex items-center">
              <SunIcon className="h-5 w-5 mr-1" />
              <span>{trip.bestSeason}</span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-0.5 rounded-full text-sm ${getDifficultyColor(trip.difficulty)}`}>
                {trip.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Trip details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-[#264653] mb-4">Trip Overview</h2>
            <p className="text-gray-700 leading-relaxed">{trip.description}</p>
          </section>

          {/* Itinerary */}
          <section>
            <h2 className="text-2xl font-bold text-[#264653] mb-4">Trip Itinerary</h2>
            <div className="space-y-6">
              {trip.stops.map((stop: any, index: number) => (
                <div key={index} className="flex">
                  {/* Day indicator */}
                  <div className="mr-4 flex flex-col items-center">
                    <div className="bg-[#06D6A0] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    {index < trip.stops.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  
                  {/* Stop details */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex-1 mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#264653] text-lg">{stop.city}</h3>
                        <p className="text-[#06D6A0] font-medium">{stop.nights} {stop.nights === 1 ? 'night' : 'nights'}</p>
                      </div>
                      {index > 0 && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <TrainIcon className="h-4 w-4 mr-1" />
                          <span>From {trip.stops[index - 1].city}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{stop.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Highlights */}
          <section>
            <h2 className="text-2xl font-bold text-[#264653] mb-4">Trip Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trip.highlights.map((highlight: string, index: number) => (
                <div key={index} className="bg-[#FAF3E0] p-4 rounded-lg flex items-start">
                  <div className="bg-[#FFD166] rounded-full w-8 h-8 flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <span>{index + 1}</span>
                  </div>
                  <p className="text-[#264653]">{highlight}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column - Booking panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-8">
            <h3 className="text-xl font-bold text-[#264653] mb-4">Plan This Trip</h3>
            
            <div className="space-y-4 mb-6">
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(trip.rating) ? 'fill-current' : 'stroke-current'}`}
                    />
                  ))}
                </div>
                <span className="text-[#264653] font-medium">{trip.rating}</span>
                <span className="text-gray-500 ml-1">({trip.reviews} reviews)</span>
              </div>
              
              {/* Trip stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-[#264653]">{trip.duration.split(' ')[0]}</div>
                  <div className="text-sm text-gray-500">Days</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-[#264653]">{getTotalNights()}</div>
                  <div className="text-sm text-gray-500">Nights</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-[#264653]">{trip.countries.length}</div>
                  <div className="text-sm text-gray-500">Countries</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-[#264653]">{trip.cities.length}</div>
                  <div className="text-sm text-gray-500">Cities</div>
                </div>
              </div>
              
              {/* Date selection */}
              <div>
                <label htmlFor="departureDate" className="block text-sm font-medium text-[#264653] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="departureDate"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              {/* Travelers */}
              <div>
                <label htmlFor="travelers" className="block text-sm font-medium text-[#264653] mb-1">
                  Number of Travelers
                </label>
                <select
                  id="travelers"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={createTrip}
                className="w-full bg-[#06D6A0] hover:bg-[#05C090] text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center"
              >
                Create This Trip Plan
              </button>
              <Link
                href={`/trips/new?template=${trip.id}&date=${departureDate}&travelers=${travelers}`}
                className="w-full bg-[#FFD166] hover:bg-[#FFC233] text-[#264653] font-medium py-3 px-4 rounded-lg flex justify-center items-center"
              >
                Customize This Trip
              </Link>
              <a
                href="#"
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-[#264653] font-medium py-3 px-4 rounded-lg flex justify-center items-center"
                onClick={(e) => {
                  e.preventDefault();
                  alert("This itinerary has been downloaded as a PDF.");
                }}
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download Itinerary
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related trips */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-[#264653] mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedTrips
            .filter(t => t.id !== trip.id)
            .slice(0, 3)
            .map((relatedTrip) => (
              <Link
                key={relatedTrip.id}
                href={`/recommended-trips/${relatedTrip.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={relatedTrip.image}
                    alt={relatedTrip.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 text-[#264653] px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                    {relatedTrip.rating} ★ ({relatedTrip.reviews})
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#264653] mb-2">{relatedTrip.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{relatedTrip.duration}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedTrip.description}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
} 