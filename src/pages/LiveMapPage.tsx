import React from 'react';
import LiveMap from '../components/LiveMap';

const LiveMapPage: React.FC = () => {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Train Map</h1>
        <p className="text-gray-600">Real-time GPS tracking and visualization of all trains</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border h-96 lg:h-[600px]">
        <LiveMap showHeader={false} />
      </div>
    </div>
  );
};

export default LiveMapPage;