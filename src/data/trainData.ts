import { Train } from '../types';
import { stations } from './stations';

const PRICE_PER_KM = 1.25;

export const calculatePrice = (distance: number): number => {
  return distance * PRICE_PER_KM;
};

export const sampleTrains: Train[] = [
  {
    id: 'T001',
    name: 'Chennai Express',
    number: '12639',
    stops: [
      { stationId: '1', stationName: 'Chennai Central', departureTime: '09:00', distanceFromPrevious: 0, cumulativeDistance: 0 },
      { stationId: '5', stationName: 'Vellore Cantonment', departureTime: '11:00', distanceFromPrevious: 170, cumulativeDistance: 170 },
      { stationId: '2', stationName: 'Bangalore City', departureTime: '15:30', distanceFromPrevious: 200, cumulativeDistance: 370 },
      { stationId: '3', stationName: 'Mysuru Junction', departureTime: '17:30', distanceFromPrevious: 120, cumulativeDistance: 490 },
      { stationId: '4', stationName: 'Mangalore Central', departureTime: '21:45', distanceFromPrevious: 300, cumulativeDistance: 790 }
    ]
  },
  {
    id: 'T002',
    name: 'Mangalore Express',
    number: '16517',
    stops: [
      { stationId: '2', stationName: 'Bangalore City', departureTime: '09:00', distanceFromPrevious: 0, cumulativeDistance: 0 },
      { stationId: '6', stationName: 'Shimoga Town', departureTime: '12:00', distanceFromPrevious: 180, cumulativeDistance: 180 },
      { stationId: '4', stationName: 'Mangalore Central', departureTime: '17:30', distanceFromPrevious: 250, cumulativeDistance: 430 }
    ]
  },
  {
    id: 'T003',
    name: 'West Coast Express',
    number: '16589',
    stops: [
      { stationId: '2', stationName: 'Bangalore City', departureTime: '16:00', distanceFromPrevious: 0, cumulativeDistance: 0 },
      { stationId: '6', stationName: 'Shimoga Town', departureTime: '19:00', distanceFromPrevious: 180, cumulativeDistance: 180 },
      { stationId: '4', stationName: 'Mangalore Central', departureTime: '23:45', distanceFromPrevious: 250, cumulativeDistance: 430 }
    ]
  }
];

// Store trains in localStorage
export const getStoredTrains = (): Train[] => {
  const stored = localStorage.getItem('trainData');
  if (stored) {
    try {
      const parsedData = JSON.parse(stored);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        return parsedData;
      }
    } catch (error) {
      console.error('Error parsing stored train data:', error);
    }
  }
  // If no valid data exists, initialize with sample data
  localStorage.setItem('trainData', JSON.stringify(sampleTrains));
  return sampleTrains;
};

export const storeTrains = (trains: Train[]): void => {
  try {
    localStorage.setItem('trainData', JSON.stringify(trains));
  } catch (error) {
    console.error('Error storing train data:', error);
  }
};

// Initialize database on first load
export const initializeDatabase = (): void => {
  const existing = localStorage.getItem('trainData');
  if (!existing) {
    localStorage.setItem('trainData', JSON.stringify(sampleTrains));
  }
};