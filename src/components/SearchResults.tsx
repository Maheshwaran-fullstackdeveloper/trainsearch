import React from 'react';
import { ArrowUpDown, Clock, IndianRupee, AlertCircle } from 'lucide-react';
import { SearchResult } from '../types';
import { TrainCard } from './TrainCard';

interface SearchResultsProps {
  results: SearchResult[];
  onSortByPrice: () => void;
  onSortByDeparture: () => void;
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onSortByPrice,
  onSortByDeparture,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Searching for trains...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No trains available</h3>
        <p className="text-gray-600">No trains found for the selected route. Try different stations or check connecting routes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Found {results.length} train{results.length !== 1 ? 's' : ''}
          </h3>
          
          <div className="flex space-x-2">
            <button
              onClick={onSortByPrice}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              <IndianRupee className="w-4 h-4" />
              <span>Sort by Price</span>
              <ArrowUpDown className="w-4 h-4" />
            </button>
            
            <button
              onClick={onSortByDeparture}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
            >
              <Clock className="w-4 h-4" />
              <span>Sort by Time</span>
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <TrainCard key={index} result={result} />
        ))}
      </div>
    </div>
  );
};