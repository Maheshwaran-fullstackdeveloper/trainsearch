import React from 'react';
import { Clock, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { SearchResult } from '../types';

interface TrainCardProps {
  result: SearchResult;
}

export const TrainCard: React.FC<TrainCardProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">
                {result.segments.length === 1 ? result.segments[0].train.name : 'Multi-Train Journey'}
              </h3>
              <p className="text-sm text-gray-600">
                {result.segments.length === 1 
                  ? `Train ${result.segments[0].train.number}`
                  : `${result.segments.length} trains required`
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 flex items-center">
                <IndianRupee className="w-5 h-5" />
                {result.totalPrice.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">{result.totalDistance} km</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-800">{result.departureTime}</div>
                <div className="text-sm text-gray-600">{result.segments[0].fromStation}</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <div className="text-center">
                <div className="text-sm text-gray-500">{result.totalDuration}</div>
                <div className="flex items-center text-xs text-gray-400">
                  <ArrowRight className="w-3 h-3 mx-1" />
                  {result.type === 'connecting' ? 'Via Connection' : 'Direct'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <div className="text-right">
                <div className="font-semibold text-gray-800">{result.arrivalTime}</div>
                <div className="text-sm text-gray-600">
                  {result.segments[result.segments.length - 1].toStation}
                </div>
              </div>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {result.type === 'connecting' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-800 mb-2">Journey Details:</h4>
              <div className="space-y-2">
                {result.segments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-yellow-600" />
                      <span>
                        {segment.train.name} ({segment.train.number})
                      </span>
                    </div>
                    <div className="text-right">
                      <div>{segment.fromStation} → {segment.toStation}</div>
                      <div className="text-yellow-700">
                        {segment.departureTime} - {segment.arrivalTime} • ₹{segment.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};