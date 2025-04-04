import { useState, useEffect } from 'react';
import { getTrainConnections, TrainConnection } from '@/lib/api/trainSchedule';
import { ClockIcon, ArrowLongRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TrainScheduleProps {
  fromCity: string;
  toCity: string;
  date: string;
  onSelectTrain: (train: TrainConnection) => void;
  onClose: () => void;
}

export default function TrainSchedule({ fromCity, toCity, date, onSelectTrain, onClose }: TrainScheduleProps) {
  const [connections, setConnections] = useState<TrainConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConnections() {
      try {
        setLoading(true);
        setError(null);

        const trainConnections = await getTrainConnections(fromCity, toCity, date);
        setConnections(trainConnections);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch train connections');
      } finally {
        setLoading(false);
      }
    }

    fetchConnections();
  }, [fromCity, toCity, date]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06D6A0]"></div>
          </div>
          <p className="text-center mt-4">Loading train schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#264653]">Train Schedules</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4 text-lg">
            <span className="font-medium text-[#264653]">{fromCity}</span>
            <ArrowLongRightIcon className="h-6 w-6 text-[#06D6A0]" />
            <span className="font-medium text-[#264653]">{toCity}</span>
          </div>
          <div className="text-center text-sm text-gray-500 mt-1">
            {date}
          </div>
        </div>

        {error ? (
          <div className="text-red-500 mb-4 text-center">
            {error}
          </div>
        ) : connections.length === 0 ? (
          <div className="text-gray-500 mb-4 text-center">
            No train connections found for this route on the selected date.
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  onSelectTrain(connection);
                  onClose();
                }}
              >
                <div className="flex justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-lg text-[#264653]">{connection.departureTime}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className="font-medium text-lg text-[#264653]">{connection.arrivalTime}</span>
                      </div>
                      <div className="flex items-center text-[#06D6A0]">
                        <ClockIcon className="h-5 w-5 mr-1" />
                        <span className="font-medium">{connection.duration}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {connection.changes === 0 ? (
                        'Direct train'
                      ) : (
                        `${connection.changes} ${connection.changes === 1 ? 'change' : 'changes'}`
                      )}
                    </div>
                  </div>
                  
                  {connection.price && (
                    <div className="ml-4 text-right">
                      <div className="font-medium text-lg text-[#06D6A0]">
                        {connection.price.amount} {connection.price.currency}
                      </div>
                      <div className="text-xs text-gray-500">
                        {connection.price.fareClass}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {connection.trains.map((train, index) => (
                    <div key={index} className="bg-gray-50 rounded p-2 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-[#264653]">
                          {train.type} {train.number}
                        </span>
                        <span className="text-gray-600">{train.operator}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <div>
                          {train.departureTime} • {train.departureStation}
                        </div>
                        <div>
                          {train.arrivalTime} • {train.arrivalStation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 