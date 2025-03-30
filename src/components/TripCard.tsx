import { formatDate } from "@/lib/utils";
import { Trip } from "@/types";
import Link from "next/link";
import { CalendarIcon, MapPinIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TripCardProps {
  trip: Trip;
  onDelete: (id: string) => void;
}

export default function TripCard({ trip, onDelete }: TripCardProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this trip?")) {
      onDelete(trip.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{trip.name}</h3>
          <div className="flex space-x-2">
            <Link 
              href={`/trips/${trip.id}/edit`}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit trip"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button 
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
              aria-label="Delete trip"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
          </span>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            Destinations:
          </h4>
          <div className="flex flex-wrap gap-1">
            {trip.stops.map((stop, index) => (
              <span 
                key={index} 
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {stop.city.name}
              </span>
            ))}
          </div>
        </div>
        
        {trip.notes && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{trip.notes}</p>
        )}
        
        <Link
          href={`/trips/${trip.id}`}
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 