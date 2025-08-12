import React, { useState, useEffect } from 'react';
import { Train as Train2, Github, ExternalLink } from 'lucide-react';
import { Station, SearchResult } from './types';
import { stations } from './data/stations';
import { getStoredTrains, initializeDatabase } from './data/trainData';
import { searchTrains, sortByPrice, sortByDeparture } from './utils/routeFinder';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { TestDataGenerator } from './components/TestDataGenerator';

function App() {
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trains, setTrains] = useState<any[]>([]);

  // Initialize database and load trains on component mount
  useEffect(() => {
    initializeDatabase();
    setTrains(getStoredTrains());
  }, []);

  const handleSearch = async () => {
    if (!fromStation || !toStation) return;

    setIsLoading(true);
    
    // Simulate search delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = searchTrains(trains, fromStation.id, toStation.id);
    setSearchResults(results);
    setIsLoading(false);
  };

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSortByPrice = () => {
    setSearchResults(sortByPrice(searchResults));
  };

  const handleSortByDeparture = () => {
    setSearchResults(sortByDeparture(searchResults));
  };

  const handleDataGenerated = () => {
    setTrains(getStoredTrains());
    // Clear search results to encourage new search with updated data
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Train2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TrainSearch Pro</h1>
                <p className="text-sm text-gray-600">Find the perfect train for your journey</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Perfect Train Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search through thousands of trains, find the best routes, and get the most competitive prices for your travel needs.
            </p>
          </div>

          {/* Test Data Generator */}
          <TestDataGenerator onDataGenerated={handleDataGenerated} />

          {/* Search Form */}
          <SearchForm
            stations={stations}
            fromStation={fromStation}
            toStation={toStation}
            onFromStationChange={setFromStation}
            onToStationChange={setToStation}
            onSwapStations={handleSwapStations}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          {/* Search Results */}
          {(searchResults.length > 0 || isLoading) && (
            <SearchResults
              results={searchResults}
              onSortByPrice={handleSortByPrice}
              onSortByDeparture={handleSortByDeparture}
              isLoading={isLoading}
            />
          )}

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{trains.length}</div>
                <div className="text-gray-600">Available Trains</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{stations.length}</div>
                <div className="text-gray-600">Railway Stations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">₹1.25</div>
                <div className="text-gray-600">Price per KM</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 TrainSearch Pro. Built with modern web technologies for optimal performance.</p>
            <p className="mt-2 text-sm flex items-center justify-center space-x-1">
              <span>Made with</span>
              <span className="text-red-500">💗</span>
              <span>by mahesh</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;