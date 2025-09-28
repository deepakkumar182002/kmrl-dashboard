import React, { useState } from 'react';
import { Train, Clock, Wrench, Sparkles, Shield, ClipboardList, Tag, Gauge, Grid3X3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { allTrains } from '../data/mockData';
import EnhancedDepotMap from '../components/EnhancedDepotMap';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AIEngine from '../components/AIEngine';
import AISimulation from '../components/AISimulation';

const Dashboard: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Calculate statistics
  const trainCounts = {
    total: allTrains.length,
    ready: allTrains.filter(t => t.status === 'Ready').length,
    standby: allTrains.filter(t => t.status === 'Standby').length,
    maintenance: allTrains.filter(t => t.status === 'Maintenance').length,
    cleaning: allTrains.filter(t => t.status === 'Cleaning').length,
  };

  // Synchronized management panel data - matches AI Engine simulation
  const managementStats = {
    fitnessCertificates: {
      total: 28,
      expiringSoon: 5,
      fit: 23,
      notFit: 5
    },
    jobCards: {
      total: 52,
      open: 14,
      inProgress: 12,
      closed: 26,
      overdue: 6
    },
    brandingPriorities: {
      total: 22,
      active: 16,
      completed: 5,
      pending: 1,
      totalValue: 3200000
    },
    mileageLogs: {
      total: 184,
      verified: 168,
      pending: 16,
      avgDailyKm: 312
    },
    cleaningSlots: {
      total: 28,
      occupied: 22,
      available: 6,
      maintenance: 4
    },
    stablingGeometry: {
      total: 36,
      occupied: 32,
      available: 4,
      capacity: 38
    }
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


      {/* AI Engine Panel */}
      <AIEngine 
        onSimulationStart={() => setIsSimulating(true)}
        isSimulating={isSimulating}
      />
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

      {/* Management Panel Summary Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Management Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fitness Certificates */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Fitness Certificates</h3>
                  <p className="text-xs text-gray-500">Train compliance status</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Certificates</span>
                <span className="text-sm font-medium">{managementStats.fitnessCertificates.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fit Trains</span>
                <span className="text-sm font-medium text-green-600">{managementStats.fitnessCertificates.fit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expiring Soon</span>
                <span className="text-sm font-medium text-orange-600">{managementStats.fitnessCertificates.expiringSoon}</span>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Job Cards</h3>
                  <p className="text-xs text-gray-500">Maintenance tasks</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Jobs</span>
                <span className="text-sm font-medium">{managementStats.jobCards.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="text-sm font-medium text-blue-600">{managementStats.jobCards.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overdue</span>
                <span className="text-sm font-medium text-red-600">{managementStats.jobCards.overdue}</span>
              </div>
            </div>
          </div>

          {/* Branding Priorities */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Branding Priorities</h3>
                  <p className="text-xs text-gray-500">Advertisement contracts</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Contracts</span>
                <span className="text-sm font-medium">{managementStats.brandingPriorities.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Value</span>
                <span className="text-sm font-medium text-green-600">₹{(managementStats.brandingPriorities.totalValue / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-medium text-orange-600">{managementStats.brandingPriorities.pending}</span>
              </div>
            </div>
          </div>

          {/* Mileage Logs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Mileage Logs</h3>
                  <p className="text-xs text-gray-500">Daily tracking</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Logs</span>
                <span className="text-sm font-medium">{managementStats.mileageLogs.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verified</span>
                <span className="text-sm font-medium text-green-600">{managementStats.mileageLogs.verified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Daily KM</span>
                <span className="text-sm font-medium text-blue-600">{managementStats.mileageLogs.avgDailyKm}</span>
              </div>
            </div>
          </div>

          {/* Cleaning Slots */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-pink-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Cleaning Slots</h3>
                  <p className="text-xs text-gray-500">Bay scheduling</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Slots</span>
                <span className="text-sm font-medium">{managementStats.cleaningSlots.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Occupied</span>
                <span className="text-sm font-medium text-blue-600">{managementStats.cleaningSlots.occupied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Available</span>
                <span className="text-sm font-medium text-green-600">{managementStats.cleaningSlots.available}</span>
              </div>
            </div>
          </div>

          {/* Stabling Geometry */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Stabling Geometry</h3>
                  <p className="text-xs text-gray-500">Depot positioning</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Bays</span>
                <span className="text-sm font-medium">{managementStats.stablingGeometry.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Occupied</span>
                <span className="text-sm font-medium text-blue-600">{managementStats.stablingGeometry.occupied}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Utilization</span>
                <span className="text-sm font-medium text-green-600">{Math.round((managementStats.stablingGeometry.occupied / managementStats.stablingGeometry.capacity) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      Quick Actions for Management Panels
      {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {hasPermission('fitness_certificates:write') && (
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Shield className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Certificate</span>
            </button>
          )}
          {hasPermission('job_cards:write') && (
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <ClipboardList className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Create Job Card</span>
            </button>
          )}
          {hasPermission('branding_priorities:write') && (
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Tag className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Branding</span>
            </button>
          )}
          {hasPermission('mileage_logs:write') && (
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Gauge className="w-6 h-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Log Mileage</span>
            </button>
          )}
          {hasPermission('cleaning_slots:write') && (
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Sparkles className="w-6 h-6 text-pink-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Schedule Clean</span>
            </button>
          )}
          {hasPermission('stabling_geometry:write') && (
            <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Grid3X3 className="w-6 h-6 text-cyan-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Assign Bay</span>
              </button>
            )}
          </div>
        </div> */}

        {/* Charts Row */}
        

    

      {/* Enhanced Depot Map */}
      <EnhancedDepotMap />
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
      {/* Advanced Analytics */}
      <AnalyticsDashboard />

      {/* AI Simulation Modal */}
      <AISimulation 
        isActive={isSimulating}
        onComplete={() => setIsSimulating(false)}
        onReset={() => setIsSimulating(false)}
      />
    </div>
  );
};

export default Dashboard;