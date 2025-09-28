import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Train } from '../types';
import { mockTrains } from '../data/mockData';
import { kochiMetroStations, metroLineCoordinates, metroDepots } from '../data/metroData';
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

// Highlighted metro station marker icons for selected route
const createHighlightedStationIcon = (stationType: 'terminal' | 'interchange' | 'regular') => {
  const colors = {
    'terminal': '#dc2626', // red for terminals
    'interchange': '#7c3aed', // purple for interchanges
    'regular': '#2563eb' // blue for regular stations
  };
  
  const sizes = {
    'terminal': 16,
    'interchange': 14,
    'regular': 12
  };

  return L.divIcon({
    className: 'metro-station-marker-highlighted',
    html: `
      <div style="
        background-color: ${colors[stationType]};
        border: 3px solid #fbbf24;
        border-radius: 4px;
        width: ${sizes[stationType]}px;
        height: ${sizes[stationType]}px;
        box-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
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

// Live train marker icon with animation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createLiveTrainIcon = (direction: 'Northbound' | 'Southbound', status: string) => {
  const directionColor = direction === 'Northbound' ? '#8b5cf6' : '#f97316'; // purple for north, orange for south
  const statusColor = status === 'On Time' ? '#10b981' : status === 'Delayed' ? '#ef4444' : '#3b82f6';
  
  return L.divIcon({
    className: 'live-train-marker',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 20px;
      ">
        <div style="
          background: linear-gradient(45deg, ${directionColor}, ${statusColor});
          border: 2px solid white;
          border-radius: 12px;
          width: 32px;
          height: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: trainPulse 2s infinite;
        ">
          <div style="
            background-color: white;
            border-radius: 8px;
            width: 20px;
            height: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            font-weight: bold;
            color: ${directionColor};
          ">🚇</div>
        </div>
        <div style="
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background-color: ${directionColor};
          color: white;
          padding: 1px 4px;
          border-radius: 8px;
          font-size: 8px;
          font-weight: bold;
          white-space: nowrap;
        ">${direction.charAt(0)}</div>
      </div>
    `,
    iconSize: [32, 20],
    iconAnchor: [16, 10],
    popupAnchor: [0, -10]
  });
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

interface ActiveTrain {
  id: string;
  trainNumber: string;
  currentStation: string;
  nextStation: string;
  direction: 'Northbound' | 'Southbound';
  status: 'On Time' | 'Delayed' | 'At Station' | 'Departed';
}

interface LiveMapProps {
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  showHeader?: boolean;
  selectedRoute?: string[];
  fromStation?: string;
  toStation?: string;
  activeTrains?: ActiveTrain[];
}

const LiveMap: React.FC<LiveMapProps> = ({ 
  isFullScreen = false, 
  onToggleFullScreen,
  showHeader = true,
  selectedRoute = [],
  fromStation = '',
  toStation = '',
  activeTrains = []
}) => {
  const [trains, setTrains] = useState<Train[]>(mockTrains);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>(mockTrains);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Train['status'] | 'All'>('All');
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.0256, 76.3012]); // Edapally - Center of metro line
  const [mapZoom, setMapZoom] = useState(12);
  const [showLegend, setShowLegend] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showTracks, setShowTracks] = useState(true);
  const [showDepots, setShowDepots] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
            <span className="bg-blue-800 text-blue-100 px-2 py-1 rounded-full text-sm">
              {filteredTrains.length} trains
            </span>
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
          
          {/* Metro Track Line */}
          {showTracks && (
            <Polyline
              positions={metroLineCoordinates}
              color="#2563eb"
              weight={4}
              opacity={0.8}
              smoothFactor={1}
            />
          )}

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

          {/* Metro Stations */}
          {showStations && kochiMetroStations.map((station) => {
            // Skip rendering regular station marker if it's selected as from/to
            if (station.name === fromStation || station.name === toStation) {
              return null;
            }
            
            // Highlight stations that are part of the selected route
            const isInRoute = selectedRoute.includes(station.name);
            const stationIcon = isInRoute ? 
              createHighlightedStationIcon(station.type) : 
              createStationIcon(station.type);

            return (
              <Marker
                key={station.id}
                position={[station.coordinates.lat, station.coordinates.lng]}
                icon={stationIcon}
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
          );
          })}
          

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

          {/* Live Active Trains on Track */}
          {activeTrains.map((train) => {
            const station = kochiMetroStations.find(s => s.name === train.currentStation);
            if (!station) return null;
            
            return (
              <Marker
                key={`live-${train.id}`}
                position={[station.coordinates.lat, station.coordinates.lng]}
                icon={createLiveTrainIcon(train.direction, train.status)}
              >
                <Popup>
                  <div className="p-3 min-w-72">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="text-2xl">🚇</div>
                        <div>
                          <h3 className="font-bold text-lg text-blue-600">{train.trainNumber}</h3>
                          <div className="text-sm text-gray-500">Live Train</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          train.status === 'On Time' ? 'bg-green-100 text-green-800' :
                          train.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                          train.status === 'At Station' ? 'bg-blue-100 text-blue-800' :
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
                        <span className="text-gray-600">Direction:</span>
                        <span className={`font-semibold ${
                          train.direction === 'Northbound' ? 'text-purple-600' : 'text-orange-600'
                        }`}>
                          {train.direction}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t bg-gray-50 -mx-3 -mb-3 px-3 pb-3 rounded-b">
                      <div className="text-xs text-gray-600 flex items-center justify-between">
                        <span>🔴 Live Tracking Active</span>
                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

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

        {/* Legend */}
        {showLegend && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-10 max-w-xs">
            <h4 className="font-semibold mb-3 text-sm">Map Legend</h4>
            
            {/* Train Status */}
            <div className="mb-3">
              <h5 className="font-medium text-xs text-gray-700 mb-2">Train Status</h5>
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