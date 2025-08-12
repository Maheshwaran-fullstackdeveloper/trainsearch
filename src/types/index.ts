export interface Station {
  id: string;
  name: string;
  code: string;
}

export interface TrainStop {
  stationId: string;
  stationName: string;
  departureTime: string;
  distanceFromPrevious: number;
  cumulativeDistance: number;
}

export interface Train {
  id: string;
  name: string;
  number: string;
  stops: TrainStop[];
}

export interface RouteSegment {
  train: Train;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  distance: number;
  price: number;
  fromStopIndex: number;
  toStopIndex: number;
}

export interface SearchResult {
  segments: RouteSegment[];
  totalDistance: number;
  totalPrice: number;
  totalDuration: string;
  departureTime: string;
  arrivalTime: string;
  type: 'direct' | 'connecting';
}