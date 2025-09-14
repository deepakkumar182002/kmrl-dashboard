import React from 'react';
import { Train, Clock, Wrench, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { allTrains } from '../data/mockData';
import EnhancedDepotMap from '../components/EnhancedDepotMap';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Dashboard: React.FC = () => {
  // Calculate statistics
  const trainCounts = {
    total: allTrains.length,
    ready: allTrains.filter(t => t.status === 'Ready').length,
    standby: allTrains.filter(t => t.status === 'Standby').length,
    maintenance: allTrains.filter(t => t.status === 'Maintenance').length,
    cleaning: allTrains.filter(t => t.status === 'Cleaning').length,
  };

  // Mileage distribution data
  const mileageData = allTrains.map(train => ({
    name: train.id,
    mileage: train.mileage,
  })).sort((a, b) => b.mileage - a.mileage);

  // Status distribution for pie chart
  const statusData = [
    { name: 'Ready', value: trainCounts.ready, color: '#22c55e' },
    { name: 'Standby', value: trainCounts.standby, color: '#3b82f6' },
    { name: 'Maintenance', value: trainCounts.maintenance, color: '#f59e0b' },
    { name: 'Cleaning', value: trainCounts.cleaning, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Real-time monitoring of KMRL train operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live System Active</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Train className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Service Ready</p>
              <p className="text-2xl font-bold text-gray-900">{trainCounts.ready}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-success-600">
              <span>Active and operational</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Standby</p>
              <p className="text-2xl font-bold text-gray-900">{trainCounts.standby}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-blue-600">
              <span>Ready for deployment</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{trainCounts.maintenance}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-warning-600">
              <span>Under repair/service</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cleaning</p>
              <p className="text-2xl font-bold text-gray-900">{trainCounts.cleaning}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-purple-600">
              <span>Being cleaned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Train Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Train Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }: any) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mileage Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Trains by Mileage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mileageData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} km`, 'Mileage']} />
                <Bar dataKey="mileage" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Depot Map */}
      <EnhancedDepotMap />

      {/* Advanced Analytics */}
      <AnalyticsDashboard />
    </div>
  );
};

export default Dashboard;