
export interface Diagnosis {
  cropType: string;
  name: string;
  symptoms: string;
  cultural: string;
  chemical: string;
  safety: string;
  recommendations: string;
  threatLevel: 'low' | 'medium' | 'high'; // low: non-infectious, medium: moderate spread, high: fast spreading/epidemic
  threatDescription: string; // Brief explanation of why it is this threat level
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Weather {
    temp: number;
    description: string;
    humidity: number;
    windSpeed: number;
    rainChance: number; // Added for UI design
    forecast: { day: string; temp: number; description: string; rainChance: number }[];
}


export interface HistoryItem {
    id: number;
    timestamp: number;
    image: string;
    diagnosis: Diagnosis;
    location: Location | null;
    weather: Weather | null;
}
