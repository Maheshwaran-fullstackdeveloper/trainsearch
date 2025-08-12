import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Station } from '../types';

interface StationDropdownProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelect: (station: Station) => void;
  placeholder: string;
  disabled?: boolean;
}

export const StationDropdown: React.FC<StationDropdownProps> = ({
  stations,
  selectedStation,
  onSelect,
  placeholder,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (station: Station) => {
    onSelect(station);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-4 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            {selectedStation ? (
              <div>
                <div className="font-medium text-gray-900">{selectedStation.name}</div>
                <div className="text-sm text-gray-500">{selectedStation.code}</div>
              </div>
            ) : (
              <div className="text-gray-500">{placeholder}</div>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredStations.length > 0 ? (
              filteredStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => handleSelect(station)}
                  className="w-full p-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150"
                >
                  <div className="font-medium text-gray-900">{station.name}</div>
                  <div className="text-sm text-gray-500">{station.code}</div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No stations found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};