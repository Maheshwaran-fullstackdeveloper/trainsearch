import { Train, TrainStop } from '../types';
import { stations } from '../data/stations';

const trainNames = [
  'Express', 'Mail', 'Superfast', 'Intercity', 'Passenger', 'Rajdhani', 'Shatabdi', 
  'Duronto', 'Garib Rath', 'Jan Shatabdi', 'Humsafar', 'Tejas', 'Vande Bharat',
  'Double Decker', 'AC Express', 'Fast Passenger', 'MEMU', 'DEMU', 'Special'
];

const trainPrefixes = [
  'Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Kolkata', 'Hyderabad', 'Pune', 
  'Coimbatore', 'Mysore', 'Mangalore', 'Kochi', 'Madurai', 'Salem', 'Vellore',
  'Shimoga', 'Hubli', 'Belgaum', 'Goa', 'Vijayawada', 'Visakhapatnam'
];

const generateRandomTime = (): string => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const generateRandomDistance = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateTestTrains = (count: number = 1000): Train[] => {
  const trains: Train[] = [];

  for (let i = 0; i < count; i++) {
    const trainNumber = (12000 + i).toString();
    const prefix = trainPrefixes[Math.floor(Math.random() * trainPrefixes.length)];
    const suffix = trainNames[Math.floor(Math.random() * trainNames.length)];
    const trainName = `${prefix} ${suffix}`;

    // Generate random number of stops (3-8 stops per train)
    const numStops = Math.floor(Math.random() * 6) + 3;
    const selectedStations = shuffleArray(stations).slice(0, numStops);
    
    // Sort stations to maintain a logical route order
    selectedStations.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    const stops: TrainStop[] = [];
    let cumulativeDistance = 0;
    let currentTimeMinutes = Math.floor(Math.random() * 24 * 60); // Random start time in minutes

    for (let j = 0; j < selectedStations.length; j++) {
      const station = selectedStations[j];
      const distanceFromPrevious = j === 0 ? 0 : generateRandomDistance(50, 400);
      cumulativeDistance += distanceFromPrevious;

      // Add travel time (roughly 1 hour per 60km)
      if (j > 0) {
        const travelMinutes = Math.floor(distanceFromPrevious / 60) * 60 + generateRandomDistance(0, 60);
        currentTimeMinutes += travelMinutes;
      }

      const currentTime = formatTime(currentTimeMinutes);

      stops.push({
        stationId: station.id,
        stationName: station.name,
        departureTime: currentTime,
        distanceFromPrevious,
        cumulativeDistance
      });

      // Add 2-5 minutes halt at each station (except the last one)
      if (j < selectedStations.length - 1) {
        const haltMinutes = generateRandomDistance(2, 5);
        currentTimeMinutes += haltMinutes;
      }
    }

    trains.push({
      id: `T${(i + 1).toString().padStart(4, '0')}`,
      name: trainName,
      number: trainNumber,
      stops
    });
  }

  return trains;
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};