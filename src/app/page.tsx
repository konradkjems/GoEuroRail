"use client";

import { useState, useEffect } from "react";
import { loadTrips, saveTrips } from "@/lib/utils";
import { Trip, TripStop, FormTrip, FormTripStop, City } from "@/types";
import SplitView from "@/components/SplitView";
import dynamic from "next/dynamic";
import TripItinerary from "@/components/TripItinerary";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { cities } from "@/lib/cities";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, GlobeEuropeAfricaIcon, MapIcon, TicketIcon, StarIcon } from "@heroicons/react/24/outline";

// Dynamically import the map component to avoid server-side rendering issues
const InterrailMap = dynamic(() => import("@/components/InterrailMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[600px] relative overflow-hidden rounded-2xl">
          <Image
            src="/Photos/classic-capitals.jpg"
            alt="European railway scene"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 md:p-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Explore Europe <br />
              <span className="text-[#FFD166]">by Rail</span>
            </h1>
            <p className="text-lg md:text-xl text-white max-w-lg mb-8">
              Plan your perfect European rail adventure with our interactive trip planner, 
              rail pass guides, and expert recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/trips/new"
                className="bg-[#06D6A0] hover:bg-[#05c091] text-white px-6 py-3 rounded-lg font-medium text-center sm:text-left flex items-center justify-center sm:justify-start gap-2 max-w-xs"
              >
                Plan Your Journey
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/recommended-trips"
                className="bg-white hover:bg-gray-100 text-[#264653] px-6 py-3 rounded-lg font-medium text-center sm:text-left max-w-xs"
              >
                See Recommended Routes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-[#264653] mb-12">
          Plan Your European Adventure with Ease
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#FFD166]/20 flex items-center justify-center rounded-lg mb-4">
              <MapIcon className="w-6 h-6 text-[#FFD166]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#264653]">Interactive Map</h3>
            <p className="text-gray-600">
              Visualize your journey on our interactive map. Add stops, view train routes, and optimize your itinerary.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#06D6A0]/20 flex items-center justify-center rounded-lg mb-4">
              <TicketIcon className="w-6 h-6 text-[#06D6A0]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#264653]">Rail Pass Advisor</h3>
            <p className="text-gray-600">
              Find the perfect rail pass for your trip. Our advisor helps you choose between Eurail, Interrail, and point-to-point tickets.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#EF476F]/20 flex items-center justify-center rounded-lg mb-4">
              <GlobeEuropeAfricaIcon className="w-6 h-6 text-[#EF476F]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#264653]">Smart Trip Assistant</h3>
            <p className="text-gray-600">
              Get personalized recommendations for accommodations, activities, and weather advice for each stop on your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-3xl font-bold text-[#264653]">
            Popular Destinations
          </h2>
          <Link 
            href="/country-guides" 
            className="text-[#06D6A0] hover:text-[#05c091] font-medium flex items-center gap-1"
          >
            View All
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { city: "Paris", country: "france" },
            { city: "Barcelona", country: "spain" },
            { city: "Amsterdam", country: "netherlands" },
            { city: "Rome", country: "italy" }
          ].map((item) => (
            <Link 
              key={item.city} 
              href={`/country-guides/${item.country}`}
              className="group relative h-72 overflow-hidden rounded-xl"
            >
              <Image
                src={`/Photos/${item.city.toLowerCase()}.jpg`}
                alt={item.city}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white">{item.city}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Trips */}
      <section className="py-16">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-3xl font-bold text-[#264653]">
            Recommended Trips
          </h2>
          <Link 
            href="/recommended-trips" 
            className="text-[#06D6A0] hover:text-[#05c091] font-medium flex items-center gap-1"
          >
            View All
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Classic European Capitals",
              duration: "14 days",
              cities: ["London", "Paris", "Brussels", "Amsterdam", "Berlin"],
              image: "/Photos/classic-capitals.jpg",
              id: "classic-european-capitals"
            },
            {
              title: "Mediterranean Explorer",
              duration: "12 days",
              cities: ["Barcelona", "Marseille", "Nice", "Florence", "Rome"],
              image: "/Photos/barcelona.jpg",
              id: "mediterranean-explorer"
            },
            {
              title: "Alpine Adventure",
              duration: "10 days",
              cities: ["Zurich", "Lucerne", "Interlaken", "Geneva", "Lyon"],
              image: "/Photos/alpine.jpg",
              id: "alpine-adventure"
            }
          ].map((trip, index) => (
            <Link 
              key={index}
              href={`/recommended-trips/${trip.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#264653]">{trip.title}</h3>
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  <StarIcon className="w-5 h-5 fill-current" />
                  <StarIcon className="w-5 h-5 fill-current" />
                  <StarIcon className="w-5 h-5 fill-current" />
                  <StarIcon className="w-5 h-5 fill-current" />
                  <StarIcon className="w-5 h-5 fill-current text-gray-300" />
                </div>
                <p className="text-gray-700 mb-2">{trip.duration}</p>
                <p className="text-gray-500">
                  {trip.cities.slice(0, 3).join(" • ")} {trip.cities.length > 3 ? "..." : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="bg-[#264653] rounded-2xl p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Create your personalized rail trip itinerary today and experience the best of Europe by train.
          </p>
          <Link
            href="/trips/new"
            className="inline-flex items-center bg-[#FFD166] hover:bg-[#FFC233] text-[#264653] px-8 py-4 rounded-lg font-medium gap-2"
          >
            Plan Your Trip Now
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
