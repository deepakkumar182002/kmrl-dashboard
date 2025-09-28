import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Train, ActiveTrain } from '../types';
import { mockTrains } from '../data/mockData';
import { kochiMetroStations, metroDepots } from '../data/metroData';
import { 
  MapPin, 
  Maximize2, 
  Minimize2, 
  Search, 
  Filter,
  RefreshCw,
  Layers,
  Train as TrainIcon,
  Navigation
} from 'lucide-react';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on train status
const createStatusIcon = (status: Train['status']) => {
  const colors = {
    'Ready': '#10b981', // green
    'Standby': '#f59e0b', // yellow
    'Maintenance': '#ef4444', // red
    'Cleaning': '#3b82f6' // blue
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${colors[status]};
        border: 3px solid white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background-color: white;
          border-radius: 50%;
          width: 8px;
          height: 8px;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

// Metro station marker icons
const createStationIcon = (stationType: 'terminal' | 'interchange' | 'regular') => {
  const colors = {
    'terminal': '#dc2626', // red for terminals
    'interchange': '#7c3aed', // purple for interchanges
    'regular': '#2563eb' // blue for regular stations
  };
  
  const sizes = {
    'terminal': 14,
    'interchange': 12,
    'regular': 10
  };

  return L.divIcon({
    className: 'metro-station-marker',
    html: `
      <div style="
        background-color: ${colors[stationType]};
        border: 2px solid white;
        border-radius: 4px;
        width: ${sizes[stationType]}px;
        height: ${sizes[stationType]}px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background-color: white;
          border-radius: 2px;
          width: 4px;
          height: 4px;
        "></div>
      </div>
    `,
    iconSize: [sizes[stationType], sizes[stationType]],
    iconAnchor: [sizes[stationType] / 2, sizes[stationType] / 2],
    popupAnchor: [0, -sizes[stationType] / 2]
  });
};

// Depot marker icon
const createDepotIcon = () => {
  return L.divIcon({
    className: 'depot-marker',
    html: `
      <div style="
        background-color: #059669;
        border: 3px solid white;
        border-radius: 8px;
        width: 24px;
        height: 16px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background-color: white;
          border-radius: 2px;
          width: 12px;
          height: 6px;
        "></div>
      </div>
    `,
    iconSize: [24, 16],
    iconAnchor: [12, 8],
    popupAnchor: [0, -8]
  });
};

// Live Train Icon with proper direction and animation
const createLiveTrainIcon = (train: { status: string; direction: string; [key: string]: any }) => {
  const statusColors = {
    'Active': '#10b981', // green
    'Scheduled': '#3b82f6', // blue
    'Delayed': '#ef4444', // red
    'At Station': '#f59e0b' // yellow
  };

  // Calculate rotation based on direction
  const rotation = train.direction === 'Southbound' ? 180 : 0;

  return L.divIcon({
    className: 'live-train-marker',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(${rotation}deg);
      ">
        <div style="
          font-size: 24px;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.6));
          animation: ${train.status === 'Active' ? 'trainMove 2s infinite ease-in-out' : 'none'};
          z-index: 10;
          transition: all 0.3s ease;
        ">🚊</div>
        <div style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background-color: ${statusColors[train.status as keyof typeof statusColors] || '#6b7280'};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ${train.status === 'Active' ? 'animation: pulse 1.5s infinite;' : ''}
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Complete Track Coordinate System for Precise Train Movement
class TrackPositionCalculator {
  private static instance: TrackPositionCalculator;
  private trackSegments: Array<{
    from: string;
    to: string;
    coordinates: [number, number][];
    distance: number;
  }> = [];

  private constructor() {
    this.initializeTrackSegments();
  }

  static getInstance(): TrackPositionCalculator {
    if (!TrackPositionCalculator.instance) {
      TrackPositionCalculator.instance = new TrackPositionCalculator();
    }
    return TrackPositionCalculator.instance;
  }

  private initializeTrackSegments() {
    // Create detailed track segments between each consecutive station pair
    for (let i = 0; i < kochiMetroStations.length - 1; i++) {
      const fromStation = kochiMetroStations[i];
      const toStation = kochiMetroStations[i + 1];
      
      // Generate intermediate points for smoother track movement
      const segmentCoords = this.generateTrackPoints(
        fromStation.coordinates,
        toStation.coordinates,
        20 // 20 intermediate points for smooth movement
      );
      
      const distance = this.calculateDistance(
        fromStation.coordinates,
        toStation.coordinates
      );

      this.trackSegments.push({
        from: fromStation.name,
        to: toStation.name,
        coordinates: segmentCoords,
        distance: distance
      });
    }
  }

  private generateTrackPoints(
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    numPoints: number
  ): [number, number][] {
    const points: [number, number][] = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const ratio = i / numPoints;
      // Use smooth bezier-like curve for more realistic track shape
      const smoothRatio = this.smoothStep(ratio);
      
      const lat = start.lat + (end.lat - start.lat) * smoothRatio;
      const lng = start.lng + (end.lng - start.lng) * smoothRatio;
      
      points.push([lat, lng]);
    }
    
    return points;
  }

  private smoothStep(t: number): number {
    // Smooth step function for natural acceleration/deceleration
    return t * t * (3.0 - 2.0 * t);
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  getTrackPosition(fromStation: string, toStation: string, progress: number): [number, number] | null {
    const segment = this.trackSegments.find(s => 
      s.from === fromStation && s.to === toStation
    );
    
    if (!segment) {
      console.warn(`Track segment not found: ${fromStation} -> ${toStation}`);
      return null;
    }

    // Clamp progress between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // Calculate position along the track segment
    const totalPoints = segment.coordinates.length - 1;
    const exactIndex = clampedProgress * totalPoints;
    const baseIndex = Math.floor(exactIndex);
    const fraction = exactIndex - baseIndex;
    
    if (baseIndex >= totalPoints) {
      return segment.coordinates[totalPoints];
    }
    
    const currentPoint = segment.coordinates[baseIndex];
    const nextPoint = segment.coordinates[baseIndex + 1];
    
    if (!nextPoint) {
      return currentPoint;
    }
    
    // Interpolate between two track points
    const lat = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * fraction;
    const lng = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * fraction;
    
    return [lat, lng];
  }

  getAllTrackCoordinates(): [number, number][] {
    // Return complete track as continuous line
    const allCoords: [number, number][] = [];
    
    this.trackSegments.forEach(segment => {
      allCoords.push(...segment.coordinates);
    });
    
    return allCoords;
  }

  getTrackSegmentInfo(fromStation: string, toStation: string) {
    return this.trackSegments.find(s => 
      s.from === fromStation && s.to === toStation
    );
  }
}

// Initialize track calculator
const trackCalculator = TrackPositionCalculator.getInstance();

// Calculate train position using advanced track-based positioning
const calculateTrainPosition = (
  currentStation: string, 
  nextStation: string, 
  progress: number
): [number, number] | null => {
  // Use advanced track calculator for precise positioning
  const trackPosition = trackCalculator.getTrackPosition(currentStation, nextStation, progress);
  
  if (trackPosition) {
    return trackPosition;
  }
  
  // Fallback to basic calculation if track segment not found
  const current = kochiMetroStations.find(s => s.name === currentStation);
  const next = kochiMetroStations.find(s => s.name === nextStation);
  
  if (!current || !next) {
    console.warn(`Station not found: ${currentStation} or ${nextStation}`);
    return null;
  }
  
  // Use smooth interpolation with realistic easing for train movement
  const easedProgress = progress < 0.5 
    ? 2 * progress * progress 
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  
  // Calculate position along the straight line between stations
  const lat = current.coordinates.lat + (next.coordinates.lat - current.coordinates.lat) * easedProgress;
  const lng = current.coordinates.lng + (next.coordinates.lng - current.coordinates.lng) * easedProgress;
  
  return [lat, lng];
};

// Generate mock live trains data with exact station coordinates
const generateLiveTrains = () => {
  // Use exact station names from kochiMetroStations data
  const stationNames = kochiMetroStations.map(station => station.name);
  
  const actualRoutes = [
    // Southbound: Aluva to Pettah
    stationNames,
    // Northbound: Pettah to Aluva  
    [...stationNames].reverse()
  ];

  // Generate trains with proper coordinates calculated from actual track positions
  const trains = [];
  
  // Train 1: Aluva to Pulinchode (southbound)
  const train1CurrentStation = 'Aluva';
  const train1NextStation = 'Pulinchode';
  const train1Progress = 0.35;
  const train1Position = calculateTrainPosition(train1CurrentStation, train1NextStation, train1Progress);
  
  trains.push({
    id: 'LT001',
    trainNumber: 'KMRL-101',
    currentStation: train1CurrentStation,
    nextStation: train1NextStation,
    direction: 'Southbound',
    status: 'Active',
    speed: 45,
    eta: '3 min',
    route: actualRoutes[0],
    progress: train1Progress,
    lastUpdated: new Date(),
    coordinates: train1Position ? { lat: train1Position[0], lng: train1Position[1] } : { lat: 10.1102, lng: 76.3530 }
  });

  // Train 2: CUSAT to Pathadipalam (southbound) 
  const train2CurrentStation = 'CUSAT';
  const train2NextStation = 'Pathadipalam';
  const train2Progress = 0.65;
  const train2Position = calculateTrainPosition(train2CurrentStation, train2NextStation, train2Progress);
  
  trains.push({
    id: 'LT002',
    trainNumber: 'KMRL-102',
    currentStation: train2CurrentStation,
    nextStation: train2NextStation,
    direction: 'Southbound',
    status: 'Active',
    speed: 42,
    eta: '2 min',
    route: actualRoutes[0],
    progress: train2Progress,
    lastUpdated: new Date(),
    coordinates: train2Position ? { lat: train2Position[0], lng: train2Position[1] } : { lat: 10.0456, lng: 76.3098 }
  });

  // Train 3: JLN Stadium to Kaloor (southbound)
  const train3CurrentStation = 'JLN Stadium';
  const train3NextStation = 'Kaloor';  
  const train3Progress = 0.25;
  const train3Position = calculateTrainPosition(train3CurrentStation, train3NextStation, train3Progress);
  
  trains.push({
    id: 'LT003',
    trainNumber: 'KMRL-103',
    currentStation: train3CurrentStation,
    nextStation: train3NextStation,
    direction: 'Southbound',
    status: 'At Station',
    speed: 0,
    eta: 'Boarding',
    route: actualRoutes[0],
    progress: train3Progress,
    lastUpdated: new Date(),
    coordinates: train3Position ? { lat: train3Position[0], lng: train3Position[1] } : { lat: 9.9934, lng: 76.2891 }
  });

  // Train 4: Return Journey - Lissie to Kaloor (northbound)
  const train4CurrentStation = 'Lissie';
  const train4NextStation = 'Kaloor';
  const train4Progress = 0.45;
  const train4Position = calculateTrainPosition(train4CurrentStation, train4NextStation, train4Progress);
  
  trains.push({
    id: 'LT004',
    trainNumber: 'KMRL-104',
    currentStation: train4CurrentStation,
    nextStation: train4NextStation,
    direction: 'Northbound',
    status: 'Delayed',
    speed: 35,
    eta: '5 min',
    route: actualRoutes[1],
    progress: train4Progress,
    lastUpdated: new Date(),
    coordinates: train4Position ? { lat: train4Position[0], lng: train4Position[1] } : { lat: 9.9816, lng: 76.2999 }
  });

  // Train 5: Palarivattom to Changampuzha Park (northbound) 
  const train5CurrentStation = 'Palarivattom';
  const train5NextStation = 'Changampuzha Park';
  const train5Progress = 0.75;
  const train5Position = calculateTrainPosition(train5CurrentStation, train5NextStation, train5Progress);
  
  trains.push({
    id: 'LT005',
    trainNumber: 'KMRL-105',
    currentStation: train5CurrentStation,
    nextStation: train5NextStation,
    direction: 'Northbound',
    status: 'Active',
    speed: 48,
    eta: '1 min',
    route: actualRoutes[1],
    progress: train5Progress,
    lastUpdated: new Date(),
    coordinates: train5Position ? { lat: train5Position[0], lng: train5Position[1] } : { lat: 10.0072, lng: 76.2947 }
  });

  // Train 6: At Vyttila Station (scheduled departure)
  const train6CurrentStation = 'Vyttila';
  const train6NextStation = 'Thaikoodam';
  const train6Progress = 0.0;
  const train6Position = calculateTrainPosition(train6CurrentStation, train6NextStation, train6Progress);
  
  trains.push({
    id: 'LT006',
    trainNumber: 'KMRL-106',
    currentStation: train6CurrentStation,
    nextStation: train6NextStation,
    direction: 'Southbound',
    status: 'Scheduled',
    speed: 0,
    eta: 'Scheduled 14:30',
    route: actualRoutes[0],
    progress: train6Progress,
    lastUpdated: new Date(),
    coordinates: train6Position ? { lat: train6Position[0], lng: train6Position[1] } : { lat: 10.0526, lng: 76.3207 }
  });

  return trains;
};

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

interface LiveMapProps {
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  showHeader?: boolean;
  selectedRoute?: string[];
  fromStation?: string;
  toStation?: string;
}

const LiveMap: React.FC<LiveMapProps> = ({ 
  isFullScreen = false, 
  onToggleFullScreen,
  showHeader = true,
  selectedRoute = [],
  fromStation = '',
  toStation = ''
}) => {
  const [trains, setTrains] = useState<Train[]>(mockTrains);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>(mockTrains);
  const [liveTrains, setLiveTrains] = useState(generateLiveTrains());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Train['status'] | 'All'>('All');
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.0256, 76.3012]); // Edapally - Center of metro line
  const [mapZoom, setMapZoom] = useState(12);
  const [showLegend, setShowLegend] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showTracks, setShowTracks] = useState(true);
  const [showDepots, setShowDepots] = useState(true);
  const [showLiveTrains, setShowLiveTrains] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const liveTrainIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-refresh data
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        setTrains([...mockTrains]);
      }, 30000); // Refresh every 30 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh]);

  // Live train animation and position updates with proper track coordinates
  useEffect(() => {
    if (showLiveTrains) {
      liveTrainIntervalRef.current = setInterval(() => {
        setLiveTrains(prevTrains => 
          prevTrains.map(train => {
            // Only animate active trains
            if (train.status === 'Active') {
              let newProgress = train.progress + 0.015; // Slower, more realistic speed
              
              // If reached next station, update stations
              if (newProgress >= 1) {
                const currentIndex = train.route.findIndex(station => station === train.nextStation);
                const nextIndex = (currentIndex + 1) % train.route.length;
                
                return {
                  ...train,
                  currentStation: train.nextStation,
                  nextStation: train.route[nextIndex],
                  progress: 0,
                  lastUpdated: new Date()
                };
              }
              
              // Calculate new position
              const newPosition = calculateTrainPosition(
                train.currentStation, 
                train.nextStation, 
                newProgress
              );
              
              return {
                ...train,
                progress: newProgress,
                coordinates: newPosition ? 
                  { lat: newPosition[0], lng: newPosition[1] } : 
                  train.coordinates,
                lastUpdated: new Date()
              };
            }
            return train;
          })
        );
      }, 2000); // Update every 2 seconds for smooth animation

      return () => {
        if (liveTrainIntervalRef.current) {
          clearInterval(liveTrainIntervalRef.current);
        }
      };
    }
  }, [showLiveTrains]);

  // Filter trains based on search and status
  useEffect(() => {
    let filtered = trains;

    if (searchTerm) {
      filtered = filtered.filter(train => 
        train.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.rakeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.depotName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(train => train.status === statusFilter);
    }

    setFilteredTrains(filtered);
  }, [trains, searchTerm, statusFilter]);

  const handleRefresh = () => {
    setTrains([...mockTrains]);
  };

  const centerOnDepot = () => {
    setMapCenter([10.0598, 76.3203]); // Muttom Depot coordinates
    setMapZoom(14);
  };

  const statusCounts = trains.reduce((acc, train) => {
    acc[train.status] = (acc[train.status] || 0) + 1;
    return acc;
  }, {} as Record<Train['status'], number>);

  return (
    <div className={`flex flex-col h-full bg-white ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header Controls */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6" />
            <h2 className="text-xl font-bold">Live Train Map</h2>
            <div className="flex space-x-2">
              <span className="bg-blue-800 text-blue-100 px-2 py-1 rounded-full text-sm">
                {filteredTrains.length} depot
              </span>
              {showLiveTrains && (
                <span className="bg-green-600 text-green-100 px-2 py-1 rounded-full text-sm flex items-center">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse mr-1"></div>
                  {liveTrains.filter(t => t.status === 'Active' || t.status === 'At Station').length} live
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
              title="Toggle Legend"
            >
              <Layers className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowStations(!showStations)}
              className={`p-2 hover:bg-blue-800 rounded-lg transition-colors ${showStations ? 'bg-blue-800' : 'bg-blue-600'}`}
              title="Toggle Metro Stations"
            >
              <Navigation className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowTracks(!showTracks)}
              className={`p-2 hover:bg-blue-800 rounded-lg transition-colors ${showTracks ? 'bg-blue-800' : 'bg-blue-600'}`}
              title="Toggle Metro Tracks"
            >
              <TrainIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowDepots(!showDepots)}
              className={`p-2 hover:bg-blue-800 rounded-lg transition-colors ${showDepots ? 'bg-blue-800' : 'bg-blue-600'}`}
              title="Toggle Depots"
            >
              <MapPin className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowLiveTrains(!showLiveTrains)}
              className={`p-2 hover:bg-blue-800 rounded-lg transition-colors ${showLiveTrains ? 'bg-blue-800' : 'bg-blue-600'}`}
              title="Toggle Live Trains"
            >
              <div className="relative">
                <TrainIcon className="w-5 h-5" />
                {showLiveTrains && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </button>

            {onToggleFullScreen && (
              <button
                onClick={onToggleFullScreen}
                className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
              >
                {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex items-center space-x-4 p-4 border-b bg-gray-50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Train ID, Rake Number, or Depot..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Train['status'] | 'All')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Ready">Ready ({statusCounts.Ready || 0})</option>
            <option value="Standby">Standby ({statusCounts.Standby || 0})</option>
            <option value="Maintenance">Maintenance ({statusCounts.Maintenance || 0})</option>
            <option value="Cleaning">Cleaning ({statusCounts.Cleaning || 0})</option>
          </select>
        </div>

        <button
          onClick={centerOnDepot}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Center on Depot
        </button>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Auto-refresh</span>
        </label>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Enhanced Metro Track Line */}
          {showTracks && (
            <Polyline
              positions={trackCalculator.getAllTrackCoordinates()}
              color="#2563eb"
              weight={5}
              opacity={0.9}
              smoothFactor={2}
              className="metro-line-glow"
            />
          )}

          {/* Metro Stations */}
          {showStations && kochiMetroStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.coordinates.lat, station.coordinates.lng]}
              icon={createStationIcon(station.type)}
            >
              <Popup>
                <div className="p-2 min-w-64">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{station.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      station.type === 'terminal' ? 'bg-red-100 text-red-800' :
                      station.type === 'interchange' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {station.type}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div><strong>Code:</strong> {station.stationCode}</div>
                    <div><strong>Line:</strong> {station.line}</div>
                    <div><strong>Opened:</strong> {station.opened}</div>
                    <div><strong>Coordinates:</strong> {station.coordinates.lat.toFixed(4)}, {station.coordinates.lng.toFixed(4)}</div>
                    {station.facilities.length > 0 && (
                      <div><strong>Facilities:</strong> {station.facilities.join(', ')}</div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Metro Depots */}
          {showDepots && metroDepots.map((depot) => (
            <Marker
              key={depot.id}
              position={[depot.coordinates.lat, depot.coordinates.lng]}
              icon={createDepotIcon()}
            >
              <Popup>
                <div className="p-2 min-w-64">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{depot.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {depot.type}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div><strong>Capacity:</strong> {depot.capacity}</div>
                    <div><strong>Coordinates:</strong> {depot.coordinates.lat.toFixed(4)}, {depot.coordinates.lng.toFixed(4)}</div>
                    <div><strong>Facilities:</strong> {depot.facilities.join(', ')}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Live Trains on Tracks */}
          {showLiveTrains && liveTrains.map((train) => {
            // Filter trains based on selected route if any
            const shouldShowTrain = selectedRoute.length === 0 || 
              train.route.some(station => selectedRoute.includes(station));
            
            if (!shouldShowTrain) return null;

            return (
              <Marker
                key={train.id}
                position={[train.coordinates.lat, train.coordinates.lng]}
                icon={createLiveTrainIcon(train)}
              >
                <Popup>
                  <div className="p-3 min-w-80">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🚊</div>
                        <div>
                          <h3 className="font-bold text-lg text-blue-600">{train.trainNumber}</h3>
                          <div className="text-sm text-gray-500">Live Tracking</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          train.status === 'Active' ? 'bg-green-100 text-green-800' :
                          train.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          train.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                          train.status === 'At Station' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {train.status}
                        </span>
                        <div className={`text-xs mt-1 font-medium ${
                          train.direction === 'Northbound' ? 'text-purple-600' : 'text-orange-600'
                        }`}>
                          {train.direction}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Station:</span>
                        <span className="font-semibold text-blue-600">{train.currentStation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Station:</span>
                        <span className="font-semibold">{train.nextStation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-semibold text-green-600">{train.eta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <span className="font-semibold">{train.speed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Progress:</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${train.progress * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t bg-gray-50 -mx-3 -mb-3 px-3 pb-3 rounded-b">
                      <div className="text-xs text-gray-600 flex items-center justify-between">
                        <span>🔴 Live Tracking</span>
                        <span>{train.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Selected Route Highlighting */}
          {selectedRoute.length > 0 && (
            (() => {
              const routeCoordinates = selectedRoute
                .map(stationName => {
                  const station = kochiMetroStations.find(s => s.name === stationName);
                  return station ? [station.coordinates.lat, station.coordinates.lng] : null;
                })
                .filter(coord => coord !== null) as [number, number][];
              
              return routeCoordinates.length > 1 ? (
                <Polyline
                  positions={routeCoordinates}
                  color="#dc2626"
                  weight={6}
                  opacity={0.9}
                  smoothFactor={1}
                  dashArray="10, 5"
                />
              ) : null;
            })()
          )}

          {/* From Station Marker */}
          {fromStation && (
            (() => {
              const station = kochiMetroStations.find(s => s.name === fromStation);
              if (!station) return null;
              
              const fromIcon = L.divIcon({
                className: 'from-station-marker',
                html: `
                  <div style="
                    background-color: #10b981;
                    border: 3px solid white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <div style="
                      background-color: white;
                      border-radius: 50%;
                      width: 8px;
                      height: 8px;
                    "></div>
                  </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              });

              return (
                <Marker
                  position={[station.coordinates.lat, station.coordinates.lng]}
                  icon={fromIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-bold text-green-700">FROM: {station.name}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })()
          )}

          {/* To Station Marker */}
          {toStation && (
            (() => {
              const station = kochiMetroStations.find(s => s.name === toStation);
              if (!station) return null;
              
              const toIcon = L.divIcon({
                className: 'to-station-marker',
                html: `
                  <div style="
                    background-color: #dc2626;
                    border: 3px solid white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <div style="
                      background-color: white;
                      border-radius: 50%;
                      width: 8px;
                      height: 8px;
                    "></div>
                  </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              });

              return (
                <Marker
                  position={[station.coordinates.lat, station.coordinates.lng]}
                  icon={toIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-bold text-red-700">TO: {station.name}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })()
          )}

          {/* Depot Trains */}
          {filteredTrains.map((train) => (
            <Marker
              key={train.id}
              position={[train.coordinates.lat, train.coordinates.lng]}
              icon={createStatusIcon(train.status)}
            >
              <Popup>
                <div className="p-2 min-w-64">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{train.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      train.status === 'Ready' ? 'bg-green-100 text-green-800' :
                      train.status === 'Standby' ? 'bg-yellow-100 text-yellow-800' :
                      train.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {train.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div><strong>Rake:</strong> {train.rakeNumber}</div>
                    <div><strong>Depot:</strong> {train.depotName}</div>
                    <div><strong>Bay:</strong> {train.bayPosition}</div>
                    <div><strong>Mileage:</strong> {train.mileage.toLocaleString()} km</div>
                    <div><strong>Coordinates:</strong> {train.coordinates.lat.toFixed(4)}, {train.coordinates.lng.toFixed(4)}</div>
                    {train.cleaningSlot && (
                      <div><strong>Cleaning:</strong> {train.cleaningSlot}</div>
                    )}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-gray-600">
                      Last Service: {train.lastService.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Enhanced Legend */}
        {showLegend && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 z-10 max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-gray-900 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                Live Train Map
              </h4>
              <button
                onClick={() => setShowLegend(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                ×
              </button>
            </div>
            
            {/* Live Trains Status */}
            {showLiveTrains && (
              <div className="mb-4">
                <h5 className="font-medium text-xs text-gray-700 mb-2 border-b border-gray-200 pb-1">
                  Live Trains ({liveTrains.filter(t => t.status === 'Active' || t.status === 'At Station').length} active)
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="text-lg">🚊</div>
                    <span>Moving Trains</span>
                  </div>
                  {[
                    { status: 'Active', color: '#10b981', count: liveTrains.filter(t => t.status === 'Active').length },
                    { status: 'Scheduled', color: '#3b82f6', count: liveTrains.filter(t => t.status === 'Scheduled').length },
                    { status: 'Delayed', color: '#ef4444', count: liveTrains.filter(t => t.status === 'Delayed').length },
                    { status: 'At Station', color: '#f59e0b', count: liveTrains.filter(t => t.status === 'At Station').length }
                  ].map(({ status, color, count }) => (
                    <div key={status} className="flex items-center space-x-2 text-xs">
                      <div 
                        className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                          status === 'Active' ? 'animate-pulse' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      ></div>
                      <span>{status} ({count})</span>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 text-xs pt-1 border-t border-gray-100">
                    <div className="flex space-x-1">
                      <div className="text-purple-600">↑</div>
                      <span>Northbound</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="text-orange-600">↓</div>
                      <span>Southbound</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Route & Journey */}
            {(selectedRoute.length > 0 || fromStation || toStation) && (
              <div className="mb-4">
                <h5 className="font-medium text-xs text-gray-700 mb-2 border-b border-gray-200 pb-1">Journey Planning</h5>
                <div className="space-y-2">
                  {selectedRoute.length > 0 && (
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-4 h-1 bg-red-600 rounded" style={{ borderStyle: 'dashed' }}></div>
                      <span>Selected Route</span>
                    </div>
                  )}
                  {fromStation && (
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      <span>From: {fromStation}</span>
                    </div>
                  )}
                  {toStation && (
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                      <span>To: {toStation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Depot Train Status */}
            <div className="mb-3">
              <h5 className="font-medium text-xs text-gray-700 mb-2 border-b border-gray-200 pb-1">Depot Status</h5>
              <div className="space-y-1">
                {[
                  { status: 'Ready' as const, color: '#10b981', count: statusCounts.Ready || 0 },
                  { status: 'Standby' as const, color: '#f59e0b', count: statusCounts.Standby || 0 },
                  { status: 'Maintenance' as const, color: '#ef4444', count: statusCounts.Maintenance || 0 },
                  { status: 'Cleaning' as const, color: '#3b82f6', count: statusCounts.Cleaning || 0 }
                ].map(({ status, color, count }) => (
                  <div key={status} className="flex items-center space-x-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span>{status} ({count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metro Stations */}
            {showStations && (
              <div className="mb-3">
                <h5 className="font-medium text-xs text-gray-700 mb-2">Metro Stations</h5>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-red-600 border border-white"></div>
                    <span>Terminal ({kochiMetroStations.filter(s => s.type === 'terminal').length})</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-purple-600 border border-white"></div>
                    <span>Interchange ({kochiMetroStations.filter(s => s.type === 'interchange').length})</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-blue-600 border border-white"></div>
                    <span>Regular ({kochiMetroStations.filter(s => s.type === 'regular').length})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Metro Infrastructure */}
            <div className="mb-2">
              <h5 className="font-medium text-xs text-gray-700 mb-2">Infrastructure</h5>
              <div className="space-y-1">
                {showTracks && (
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-4 h-1 bg-blue-600"></div>
                    <span>Metro Line 1</span>
                  </div>
                )}
                {showDepots && (
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-4 h-2 bg-green-600 rounded-sm border border-white"></div>
                    <span>Depot ({metroDepots.length})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-600 space-y-1">
                <div>📍 Stations: {showStations ? 'ON' : 'OFF'}</div>
                <div>🚊 Tracks: {showTracks ? 'ON' : 'OFF'}</div>
                <div>🔧 Depots: {showDepots ? 'ON' : 'OFF'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Coordinates Display */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm z-10">
          Center: {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)} | Zoom: {mapZoom}
        </div>
      </div>
    </div>
  );
};

export default LiveMap;