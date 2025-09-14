import React, { useState } from 'react';
import { Train, Clock, Wrench, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { allTrains, mockDepotBays } from '../data/mockData';
import { Train as TrainType } from '../types';

interface TrainCardProps {
  train: TrainType;
  onHover: (train: TrainType | null) => void;
}

const TrainCard: React.FC<TrainCardProps> = ({ train, onHover }) => {
  const getStatusColor = (status: TrainType['status']) => {
    switch (status) {
      case 'Ready':
        return 'bg-success-100 border-success-300 text-success-700';
      case 'Standby':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'Maintenance':
        return 'bg-warning-100 border-warning-300 text-warning-700';
      case 'Cleaning':
        return 'bg-purple-100 border-purple-300 text-purple-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getStatusIcon = (status: TrainType['status']) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle className="w-3 h-3" />;
      case 'Standby':
        return <Clock className="w-3 h-3" />;
      case 'Maintenance':
        return <Wrench className="w-3 h-3" />;
      case 'Cleaning':
        return <Sparkles className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getBrandingProgress = () => {
    return (train.brandingHoursLeft / train.brandingTarget) * 100;
  };

  return (
    <div
      className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${getStatusColor(train.status)}`}
      onMouseEnter={() => onHover(train)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1">
          {getStatusIcon(train.status)}
          <span className="text-xs font-bold">{train.id}</span>
        </div>
        <Train className="w-3 h-3" />
      </div>
      
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Km:</span>
          <span className="font-medium">{(train.mileage / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex justify-between">
          <span>Brand:</span>
          <span className="font-medium">{train.brandingHoursLeft}h</span>
        </div>
        
        {/* Branding Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-current h-1 rounded-full" 
            style={{ width: `${getBrandingProgress()}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

interface TooltipProps {
  train: TrainType | null;
  position: { x: number; y: number };
}

const TrainTooltip: React.FC<TooltipProps> = ({ train, position }) => {
  if (!train) return null;

  const isExpiringSoon = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div
      className="fixed z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm"
      style={{ left: position.x + 10, top: position.y - 10 }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <Train className="w-5 h-5 text-primary-600" />
        <h3 className="font-bold text-gray-900">{train.id}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          train.status === 'Ready' ? 'bg-success-100 text-success-700' :
          train.status === 'Standby' ? 'bg-blue-100 text-blue-700' :
          train.status === 'Maintenance' ? 'bg-warning-100 text-warning-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {train.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Mileage:</span>
          <span className="font-medium">{train.mileage.toLocaleString()} km</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Fitness Validity:</span>
          <span className={`font-medium ${isExpiringSoon(train.fitnessValidity) ? 'text-danger-600' : 'text-gray-900'}`}>
            {train.fitnessValidity.toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Job Card:</span>
          <span className={`font-medium ${train.jobCardStatus === 'Open' ? 'text-warning-600' : 'text-success-600'}`}>
            {train.jobCardStatus}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Cleaning Slot:</span>
          <span className="font-medium">{train.cleaningSlot || 'Not assigned'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Branding Hours:</span>
          <span className="font-medium">{train.brandingHoursLeft}/{train.brandingTarget}h</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Priority:</span>
          <span className={`font-medium ${
            train.brandingPriority === 'High' ? 'text-danger-600' :
            train.brandingPriority === 'Medium' ? 'text-warning-600' : 'text-gray-600'
          }`}>
            {train.brandingPriority}
          </span>
        </div>
      </div>
    </div>
  );
};

const EnhancedDepotMap: React.FC = () => {
  const [hoveredTrain, setHoveredTrain] = useState<TrainType | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getTrainForBay = (bayNumber: number) => {
    return allTrains.find(train => train.bayPosition === `Bay ${bayNumber}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" onMouseMove={handleMouseMove}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Enhanced Depot Layout</h3>
        <div className="text-sm text-gray-600">
          Occupancy: {mockDepotBays.filter(bay => bay.occupied).length}/40 bays
        </div>
      </div>
      
      <div className="grid grid-cols-10 gap-3 mb-6">
        {mockDepotBays.map((bay) => {
          const train = getTrainForBay(bay.number);
          
          return (
            <div key={bay.id} className="relative">
              {train ? (
                <TrainCard train={train} onHover={setHoveredTrain} />
              ) : (
                <div className="h-20 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-xs text-gray-400">
                    <div>Bay {bay.number}</div>
                    <div>Empty</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-success-100 border border-success-300 rounded flex items-center justify-center">
            <CheckCircle className="w-2 h-2 text-success-600" />
          </div>
          <span>Ready</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
            <Clock className="w-2 h-2 text-blue-600" />
          </div>
          <span>Standby</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-warning-100 border border-warning-300 rounded flex items-center justify-center">
            <Wrench className="w-2 h-2 text-warning-600" />
          </div>
          <span>Maintenance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-purple-600" />
          </div>
          <span>Cleaning</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
          <span>Empty Bay</span>
        </div>
      </div>
      
      <TrainTooltip train={hoveredTrain} position={mousePosition} />
    </div>
  );
};

export default EnhancedDepotMap;