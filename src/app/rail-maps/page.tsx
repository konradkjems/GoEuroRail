"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Layout from '@/components/Layout';
import LowercaseImage from '@/components/LowercaseImage';

// Rail maps data
const railMaps = [
  {
    id: "france",
    name: "France",
    description: "The French railway network features the high-speed TGV lines connecting major cities and an extensive regional network.",
    image: "/photos/rail-maps/France-map.jpg"
  },
  {
    id: "italy",
    name: "Italy",
    description: "Italy's rail network is well-developed with the high-speed Frecciarossa, Frecciargento, and Frecciabianca services.",
    image: "/photos/rail-maps/Italy-Map.jpg"
  },
  {
    id: "germany",
    name: "Germany",
    description: "Germany has one of Europe's most comprehensive rail networks with ICE high-speed services and excellent regional coverage.",
    image: "/photos/rail-maps/Germany-mainlines-map.jpg"
  },
  {
    id: "spain",
    name: "Spain",
    description: "Spain's AVE high-speed rail network is one of the longest in the world, connecting major cities at speeds up to 310 km/h.",
    image: "/photos/rail-maps/Spain-map.jpg"
  },
  {
    id: "switzerland",
    name: "Switzerland",
    description: "Switzerland's efficient rail system is known for its punctuality and connects even remote alpine villages.",
    image: "/photos/rail-maps/Switzerland-map.jpg"
  },
  {
    id: "netherlands",
    name: "Netherlands",
    description: "The Dutch rail network is one of the busiest in Europe, with frequent service between all major cities.",
    image: "/photos/rail-maps/netherlands-map.png"
  },
  {
    id: "uk",
    name: "United Kingdom",
    description: "The UK's extensive rail network covers the entire country with high-speed services on the main routes.",
    image: "/photos/rail-maps/Uk-map.jpg"
  },
  {
    id: "austria",
    name: "Austria",
    description: "Austria's rail network is renowned for scenic routes through the Alps and efficient connections to neighboring countries.",
    image: "/photos/rail-maps/Austria-map.jpg"
  },
  {
    id: "denmark",
    name: "Denmark",
    description: "Denmark's efficient rail network connects the country's islands and provides regular service to major cities.",
    image: "/photos/rail-maps/Denmark-Map.jpg"
  },
  {
    id: "belgium",
    name: "Belgium & Luxembourg",
    description: "Belgium's dense rail network and Luxembourg's efficient connections make travel through these countries seamless.",
    image: "/photos/rail-maps/Belgium-Lxembourg-map.jpg"
  },
  {
    id: "czech",
    name: "Czech Republic",
    description: "The Czech Republic's rail network offers connections to beautiful cities and scenic countryside locations.",
    image: "/photos/rail-maps/Czech-Republic-Map.jpg"
  },
  {
    id: "poland",
    name: "Poland",
    description: "Poland's expanding rail network connects major cities with improving high-speed services.",
    image: "/photos/rail-maps/Poland-map.jpg"
  },
  {
    id: "norway",
    name: "Norway",
    description: "Norway's dramatic rail routes offer some of Europe's most spectacular railway journeys through fjords and mountains.",
    image: "/photos/rail-maps/Norway-map.jpg"
  },
  {
    id: "sweden",
    name: "Sweden",
    description: "Sweden's rail network provides excellent coverage of the country with comfortable, efficient services.",
    image: "/photos/rail-maps/Sweden-map.jpg"
  },
  {
    id: "finland",
    name: "Finland",
    description: "Finland's rail network connects major cities with comfortable trains through beautiful northern landscapes.",
    image: "/photos/rail-maps/Finland-map.jpg"
  },
  {
    id: "portugal",
    name: "Portugal",
    description: "Portugal's rail system connects coastal cities and inland regions with scenic routes along the Atlantic.",
    image: "/photos/rail-maps/Portugal-map.jpg"
  },
  {
    id: "slovenia",
    name: "Slovenia",
    description: "Slovenia's compact rail network offers beautiful Alpine routes and connections to neighboring countries.",
    image: "/photos/rail-maps/Slovenia-map.jpg"
  },
  {
    id: "slovakia",
    name: "Slovakia",
    description: "Slovakia's rail network provides access to mountain regions and historic cities with improving services.",
    image: "/photos/rail-maps/Slovakia-map.jpg"
  },
  {
    id: "hungary",
    name: "Hungary",
    description: "Hungary's rail system centers around Budapest with good connections to major cities and lake Balaton.",
    image: "/photos/rail-maps/Hungary-map.jpg"
  },
  {
    id: "croatia",
    name: "Croatia",
    description: "Croatia's rail network connects inland cities, though coastal regions are often better served by buses.",
    image: "/photos/rail-maps/Croatia-map.jpg"
  },
  {
    id: "romania",
    name: "Romania",
    description: "Romania's extensive rail network offers scenic mountain routes and connections to historic cities.",
    image: "/photos/rail-maps/Romania-map.jpg"
  },
  {
    id: "bulgaria",
    name: "Bulgaria",
    description: "Bulgaria's rail network provides affordable transportation between major cities and mountain regions.",
    image: "/photos/rail-maps/Bulgaria-map.jpg"
  },
  {
    id: "serbia",
    name: "Serbia",
    description: "Serbia's rail system is centered around Belgrade with connections to neighboring countries.",
    image: "/photos/rail-maps/Serbia-map.jpg"
  },
  {
    id: "bosnia",
    name: "Bosnia and Herzegovina",
    description: "Bosnia's rail network offers stunning mountain routes despite limited coverage.",
    image: "/photos/rail-maps/Bosnia-map.jpg"
  },
  {
    id: "interrail",
    name: "Interrail Premium Map",
    description: "A detailed map of the entire European rail network covered by the Interrail pass.",
    image: "/photos/rail-maps/Interrail_PremiumMap-2020-scaled.jpg"
  },
  {
    id: "spain-international",
    name: "Spain International Routes",
    description: "Map showing international connections from Spain's rail network to neighboring countries.",
    image: "/photos/rail-maps/Renfes-International-Routes-1.jpg"
  },
  {
    id: "europe-high-speed",
    name: "European High-Speed Network",
    description: "A comprehensive map of the high-speed rail corridors connecting major cities across Europe.",
    image: "/photos/rail-maps/high_speed_railroad_map_of_europe.svg.png"
  }
];

export default function RailMaps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  
  // Effect to handle scrolling to map element when page loads with a hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Slight delay to ensure page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a temporary highlight effect
          element.classList.add('ring-4', 'ring-[#06D6A0]', 'ring-opacity-70');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-[#06D6A0]', 'ring-opacity-70');
          }, 2000);
        }, 300);
      }
    }
  }, []);
  
  // Region categorization
  const regions: { [key: string]: string[] } = {
    western: ["france", "germany", "netherlands", "belgium", "switzerland", "austria"],
    southern: ["italy", "spain", "portugal", "spain-international"],
    northern: ["uk", "denmark", "norway", "sweden", "finland"],
    eastern: ["poland", "czech", "slovakia", "hungary"],
    southeastern: ["slovenia", "croatia", "bosnia", "serbia", "romania", "bulgaria"],
    all: ["france", "italy", "germany", "spain", "switzerland", "netherlands", "uk", "austria", 
          "denmark", "belgium", "czech", "poland", "norway", "sweden", "finland", "portugal", 
          "slovenia", "slovakia", "hungary", "croatia", "romania", "bulgaria", "serbia", "bosnia"],
    network: ["europe", "europe-high-speed", "interrail"]
  };
  
  // Filter maps based on search and region
  const filteredMaps = railMaps.filter(map => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return map.name.toLowerCase().includes(query) || 
             map.description.toLowerCase().includes(query);
    }
    
    // Region filter
    if (selectedRegion !== "all" && selectedRegion !== "network") {
      return regions[selectedRegion].includes(map.id);
    } else if (selectedRegion === "network") {
      return regions.network.includes(map.id);
    }
    
    return true;
  });
  
  return (
    <div className="max-w-7xl mx-auto">
      <section className="relative">
        <div className="h-[400px] relative overflow-hidden rounded-2xl">
          <LowercaseImage
            src="/photos/rail-maps/High_Speed_Railroad_Map_of_Europe.svg.png"
            alt="European High-Speed Rail Network"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              European Rail Maps
            </h1>
            <p className="text-lg md:text-xl text-white max-w-lg mb-8">
              Explore detailed railway maps for planning your European train journey.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-[#264653]">
            Rail Network Maps
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search maps..."
                className="px-4 py-2 pl-10 border border-gray-300 rounded-lg w-full"
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
              <option value="southeastern">Southeastern Europe</option>
              <option value="network">Network Maps</option>
            </select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredMaps.map((map) => (
            <div
              key={map.id}
              id={map.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="relative h-60 w-full">
                {map.id === "europe-high-speed" && (
                  <div className="absolute top-3 right-3 z-10 bg-[#EF476F] text-white px-2 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </div>
                )}
                <LowercaseImage
                  src={map.image}
                  alt={`${map.name} Rail Map`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="hover:scale-105 transition-transform duration-300"
                />
                
                <a 
                  href={map.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group"
                >
                  <span className="px-4 py-2 bg-[#06D6A0] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    View Full Map
                  </span>
                </a>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <MapPinIcon className="h-5 w-5 text-[#06D6A0] mr-2" />
                  <h3 className="text-xl font-semibold text-[#264653]">{map.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{map.description}</p>
                
                {map.id !== "europe" && map.id !== "europe-high-speed" && map.id !== "interrail" && map.id !== "spain-international" && (
                  <Link 
                    href={`/country-guides/${map.id}`}
                    className="mt-4 inline-flex items-center text-[#06D6A0] hover:text-[#05c091] text-sm font-medium"
                  >
                    View country guide
                  </Link>
                )}
              </div>
            </div>
          ))}
          
          {filteredMaps.length === 0 && (
            <div className="col-span-full bg-gray-50 p-8 rounded-xl text-center">
              <h3 className="text-xl font-semibold mb-2 text-[#264653]">No maps match your search</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse by a different region.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedRegion("all");}}
                className="bg-[#06D6A0] hover:bg-[#05c091] text-white px-4 py-2 rounded-lg font-medium"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-[#264653] mb-4">About Rail Maps</h3>
          <p className="text-gray-600 mb-3">
            Our comprehensive collection includes 28 detailed railway maps showing the major train lines, stations, and connections across Europe. 
            We now cover almost every European country, making it easier than ever to plan your rail journey from Scandinavia to the Balkans.
          </p>
          <p className="text-gray-600 mb-6">
            <span className="bg-[#EF476F] text-white px-2 py-0.5 rounded-full text-xs font-semibold mr-2">NEW</span>
            We've added maps for the Balkan countries, Eastern Europe, and Scandinavia, along with specialty maps like 
            the Interrail Premium Map and Spain's international connections. Search by region or country name to find exactly what you need!
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-[#264653] mb-2">Reading Rail Maps</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Solid lines typically represent regular train services</li>
                <li>• Thicker or colored lines often indicate high-speed routes</li>
                <li>• Major cities and interchange stations are prominently marked</li>
                <li>• Some maps show frequency of service or journey times</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-[#264653] mb-2">Planning with Rail Maps</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Identify direct routes between your destinations</li>
                <li>• Look for high-speed connections to save time</li>
                <li>• Consider scenic routes for a more enjoyable journey</li>
                <li>• Check for potential interchange stations if no direct routes exist</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 