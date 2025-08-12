import { Train, RouteSegment, SearchResult } from '../types';
import { calculatePrice } from '../data/trainData';

const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const calculateDuration = (startTime: string, endTime: string): string => {
  const start = parseTime(startTime);
  let end = parseTime(endTime);
  
  // Handle overnight journeys
  if (end < start) {
    end += 24 * 60; // Add 24 hours
  }
  
  const durationMinutes = end - start;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

const findDirectRoutes = (trains: Train[], fromStationId: string, toStationId: string): SearchResult[] => {
  const results: SearchResult[] = [];

  for (const train of trains) {
    const fromStopIndex = train.stops.findIndex(stop => stop.stationId === fromStationId);
    const toStopIndex = train.stops.findIndex(stop => stop.stationId === toStationId);

    if (fromStopIndex !== -1 && toStopIndex !== -1 && fromStopIndex < toStopIndex) {
      const fromStop = train.stops[fromStopIndex];
      const toStop = train.stops[toStopIndex];
      const distance = toStop.cumulativeDistance - fromStop.cumulativeDistance;
      const price = calculatePrice(distance);

      const segment: RouteSegment = {
        train,
        fromStation: fromStop.stationName,
        toStation: toStop.stationName,
        departureTime: fromStop.departureTime,
        arrivalTime: toStop.departureTime,
        distance,
        price,
        fromStopIndex,
        toStopIndex
      };

      results.push({
        segments: [segment],
        totalDistance: distance,
        totalPrice: price,
        totalDuration: calculateDuration(fromStop.departureTime, toStop.departureTime),
        departureTime: fromStop.departureTime,
        arrivalTime: toStop.departureTime,
        type: 'direct'
      });
    }
  }

  return results;
};

const findConnectingRoutes = (trains: Train[], fromStationId: string, toStationId: string): SearchResult[] => {
  const results: SearchResult[] = [];
  const maxConnections = 1; // Limit to single connection for simplicity

  // Find intermediate stations
  const intermediateStations = new Set<string>();
  trains.forEach(train => {
    const hasFrom = train.stops.some(stop => stop.stationId === fromStationId);
    const hasTo = train.stops.some(stop => stop.stationId === toStationId);
    
    if (hasFrom || hasTo) {
      train.stops.forEach(stop => {
        if (stop.stationId !== fromStationId && stop.stationId !== toStationId) {
          intermediateStations.add(stop.stationId);
        }
      });
    }
  });

  // Find connecting routes through each intermediate station
  for (const intermediateId of intermediateStations) {
    const firstLeg = findDirectRoutes(trains, fromStationId, intermediateId);
    const secondLeg = findDirectRoutes(trains, intermediateId, toStationId);

    for (const first of firstLeg) {
      for (const second of secondLeg) {
        // Check if there's enough time for connection (minimum 30 minutes)
        const arrivalTime = parseTime(first.arrivalTime);
        const departureTime = parseTime(second.departureTime);
        
        let connectionTime = departureTime - arrivalTime;
        if (connectionTime < 0) {
          connectionTime += 24 * 60; // Handle overnight connection
        }

        if (connectionTime >= 30 && connectionTime <= 12 * 60) { // Max 12 hours layover
          const totalDistance = first.totalDistance + second.totalDistance;
          const totalPrice = first.totalPrice + second.totalPrice;

          results.push({
            segments: [...first.segments, ...second.segments],
            totalDistance,
            totalPrice,
            totalDuration: calculateDuration(first.departureTime, second.arrivalTime),
            departureTime: first.departureTime,
            arrivalTime: second.arrivalTime,
            type: 'connecting'
          });
        }
      }
    }
  }

  return results;
};

export const searchTrains = (trains: Train[], fromStationId: string, toStationId: string): SearchResult[] => {
  if (!fromStationId || !toStationId || fromStationId === toStationId) {
    return [];
  }

  const directRoutes = findDirectRoutes(trains, fromStationId, toStationId);
  const connectingRoutes = findConnectingRoutes(trains, fromStationId, toStationId);

  return [...directRoutes, ...connectingRoutes];
};

export const sortByPrice = (results: SearchResult[]): SearchResult[] => {
  return [...results].sort((a, b) => a.totalPrice - b.totalPrice);
};

export const sortByDeparture = (results: SearchResult[]): SearchResult[] => {
  return [...results].sort((a, b) => parseTime(a.departureTime) - parseTime(b.departureTime));
};