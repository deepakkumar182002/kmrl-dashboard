import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  ArrowRight, 
  Navigation,
  RefreshCw
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import { kochiMetroStations } from '../data/metroData';

interface TrainSchedule {
  id: string;
  trainNumber: string;
  currentStation: string;
  nextStation: string;
  departureTime: string;
  arrivalTime: string;
  delay: number;
  direction: 'Northbound' | 'Southbound';
  status: 'On Time' | 'Delayed' | 'At Station' | 'Departed';
}

const LiveMapPage: React.FC = () => {
  const [fromStation, setFromStation] = useState<string>('');
  const [toStation, setToStation] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTrains] = useState<TrainSchedule[]>([]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate route between stations with validation
  const calculateRoute = (from: string, to: string) => {
    if (!from || !to) {
      setSelectedRoute([]);
      return;
    }

    if (from === to) {
      alert('From and To stations cannot be the same!');
      return;
    }

    const stations = kochiMetroStations.map(station => station.name);
    const fromIndex = stations.indexOf(from);
    const toIndex = stations.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) {
      setSelectedRoute([]);
      alert('Invalid station selection!');
      return;
    }

    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    let route = stations.slice(start, end + 1);
    
    // Maintain correct direction based on selection
    if (fromIndex > toIndex) {
      route.reverse();
    }
    
    setSelectedRoute(route);
    
    // Auto-focus map on selected route
    if (route.length > 0) {
      const fromStation = kochiMetroStations.find(s => s.name === route[0]);
      const toStation = kochiMetroStations.find(s => s.name === route[route.length - 1]);
      
      if (fromStation && toStation) {
        // Calculate center point for better view
        const centerLat = (fromStation.coordinates.lat + toStation.coordinates.lat) / 2;
        const centerLng = (fromStation.coordinates.lng + toStation.coordinates.lng) / 2;
        
        console.log(`Route planned: ${route.join(' → ')}`);
        console.log(`Map will center on: ${centerLat}, ${centerLng}`);
      }
    }
  };

  useEffect(() => {
    calculateRoute(fromStation, toStation);
  }, [fromStation, toStation]);

  // Live train movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Live Train Map
            </h1>
            <p className="text-gray-600">Real-time metro tracking and journey planning</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Live Tracking Active</span>
            </div>
          </div>
        </div>

        {/* Station Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              From Station
            </label>
            <select
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select departure station</option>
              {kochiMetroStations.map((station) => (
                <option key={station.id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-red-600" />
              To Station
            </label>
            <select
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select destination station</option>
              {kochiMetroStations.map((station) => (
                <option key={station.id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={() => calculateRoute(fromStation, toStation)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Plan Route</span>
            </button>
            <button
              onClick={() => {
                setFromStation('');
                setToStation('');
                setSelectedRoute([]);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Clear Selection"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Route Display */}
        {selectedRoute.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <ArrowRight className="w-4 h-4 mr-2 text-blue-600" />
                Selected Route ({selectedRoute.length} stations)
              </h3>
              <span className="text-sm text-gray-600">
                Est. Journey: {(selectedRoute.length - 1) * 2} minutes
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedRoute.map((station, index) => (
                <div key={station} className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    index === 0 ? 'bg-green-100 text-green-700' :
                    index === selectedRoute.length - 1 ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {station}
                  </span>
                  {index < selectedRoute.length - 1 && (
                    <ArrowRight className="w-3 h-3 mx-1 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Width Map */}
      <div className="h-[calc(100vh-300px)]">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-full">
          <div className="h-full relative">
            <LiveMap 
              showHeader={false} 
              selectedRoute={selectedRoute}
              fromStation={fromStation}
              toStation={toStation}
              activeTrains={activeTrains}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMapPage;