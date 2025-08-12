import React, { useState } from 'react';
import { Database, RefreshCw, Check } from 'lucide-react';
import { generateTestTrains } from '../utils/testDataGenerator';
import { storeTrains } from '../data/trainData';

interface TestDataGeneratorProps {
  onDataGenerated: () => void;
}

export const TestDataGenerator: React.FC<TestDataGeneratorProps> = ({ onDataGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateData = async () => {
    setIsGenerating(true);
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const trains = generateTestTrains(1000);
      storeTrains(trains);
      setIsGenerated(true);
      onDataGenerated();
      
      setTimeout(() => setIsGenerated(false), 3000);
    } catch (error) {
      console.error('Error generating test data:', error);
      alert('Error generating test data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Test Data Generator</h3>
          <p className="text-sm text-gray-600">Generate 1000 random trains with routes for testing</p>
        </div>
        
        <button
          onClick={handleGenerateData}
          disabled={isGenerating}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isGenerated
              ? 'bg-green-100 text-green-700'
              : isGenerating
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isGenerated ? (
            <>
              <Check className="w-5 h-5" />
              <span>Data Generated!</span>
            </>
          ) : isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>Generate Test Data</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};