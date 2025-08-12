import React from 'react';
import { ArrowRightLeft, Search } from 'lucide-react';
import { Station } from '../types';
import { StationDropdown } from './StationDropdown';

interface SearchFormProps {
  stations: Station[];
  fromStation: Station | null;
  toStation: Station | null;
  onFromStationChange: (station: Station) => void;
  onToStationChange: (station: Station) => void;
  onSwapStations: () => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  stations,
  fromStation,
  toStation,
  onFromStationChange,
  onToStationChange,
  onSwapStations,
  onSearch,
  isLoading
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Search Trains</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">From Station</label>
          <StationDropdown
            stations={stations}
            selectedStation={fromStation}
            onSelect={onFromStationChange}
            placeholder="Select departure station"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">To Station</label>
          <StationDropdown
            stations={stations}
            selectedStation={toStation}
            onSelect={onToStationChange}
            placeholder="Select destination station"
            disabled={!fromStation}
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onSwapStations}
          disabled={!fromStation || !toStation}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Swap stations"
        >
          <ArrowRightLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={onSearch}
          disabled={!fromStation || !toStation || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>{isLoading ? 'Searching...' : 'Search Trains'}</span>
        </button>
      </div>
    </div>
  );
};