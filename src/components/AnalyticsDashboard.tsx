import React, { useState } from 'react';
import { TrendingUp, Clock, Wrench, Sparkles, Download, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { allTrains } from '../data/mockData';

// Generate mock analytics data
const generateMileageTrends = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    avgMileage: Math.floor(Math.random() * 5000) + 15000,
    targetMileage: 18000,
    efficiency: Math.floor(Math.random() * 15) + 85,
  }));
};

const generateBrandingExposure = () => {
  const brands = ['Coca-Cola', 'Samsung', 'Nike', 'Apple', 'Amazon'];
  return brands.map(brand => ({
    brand,
    exposureHours: Math.floor(Math.random() * 200) + 100,
    revenue: Math.floor(Math.random() * 50000) + 25000,
    trains: Math.floor(Math.random() * 8) + 2,
  }));
};

const generateMaintenanceBacklog = () => {
  const types = ['Routine', 'Electrical', 'Mechanical', 'Safety', 'Cleaning'];
  return types.map(type => ({
    type,
    pending: Math.floor(Math.random() * 15) + 5,
    completed: Math.floor(Math.random() * 25) + 15,
    priority: Math.floor(Math.random() * 5) + 1,
  }));
};

const generateCleaningEfficiency = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    scheduled: Math.floor(Math.random() * 10) + 20,
    completed: Math.floor(Math.random() * 8) + 18,
    efficiency: Math.floor(Math.random() * 10) + 85,
  }));
};

const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const mileageTrends = generateMileageTrends();
  const brandingExposure = generateBrandingExposure();
  const maintenanceBacklog = generateMaintenanceBacklog();
  const cleaningEfficiency = generateCleaningEfficiency();

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const analytics = {
    totalRevenue: 3200000, // Matches dashboard branding total value
    avgEfficiency: 91, // Matches (168/184 * 100) mileage verification rate
    pendingMaintenance: 34, // Matches total pending items (16 + 14 + 4)
    activeTrains: allTrains.filter(train => train.status === 'Ready' || train.status === 'Standby').length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Comprehensive operational insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Branding Revenue</p>
              <p className="text-xl font-bold text-gray-900">₹{(analytics.totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-600">+12% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Cleaning Efficiency</p>
              <p className="text-xl font-bold text-gray-900">{analytics.avgEfficiency}%</p>
              <p className="text-xs text-blue-600">+3% vs last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending Maintenance</p>
              <p className="text-xl font-bold text-gray-900">{analytics.pendingMaintenance}</p>
              <p className="text-xs text-orange-600">-2 vs yesterday</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Trains</p>
              <p className="text-xl font-bold text-gray-900">{analytics.activeTrains}</p>
              <p className="text-xs text-purple-600">100% operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mileage Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mileage Trends</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Actual</span>
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>Target</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mileageTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${value.toLocaleString()} km`,
                  name === 'avgMileage' ? 'Average Mileage' : 'Target Mileage'
                ]} />
                <Area type="monotone" dataKey="avgMileage" stroke="#3b82f6" fill="#93c5fd" strokeWidth={2} />
                <Line type="monotone" dataKey="targetMileage" stroke="#6b7280" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branding Exposure Analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Branding Exposure</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">View Details</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandingExposure}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'exposureHours' ? `${value} hours` : `₹${value.toLocaleString()}`,
                  name === 'exposureHours' ? 'Exposure Hours' : 'Revenue'
                ]} />
                <Bar dataKey="exposureHours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Backlog */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Backlog</h3>
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maintenanceBacklog}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="pending"
                  label={(entry: any) => `${entry.type}: ${entry.pending}`}
                >
                  {maintenanceBacklog.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Pending']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cleaning Efficiency */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Cleaning Efficiency</h3>
            <span className="text-sm text-gray-600">This Week</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cleaningEfficiency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'efficiency' ? `${value}%` : `${value} trains`,
                  name === 'efficiency' ? 'Efficiency' : name === 'scheduled' ? 'Scheduled' : 'Completed'
                ]} />
                <Line type="monotone" dataKey="scheduled" stroke="#6b7280" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Optimization Opportunities</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 16 pending mileage verifications need attention</li>
                <li>• 6 overdue job cards require immediate action</li>
                <li>• 4 cleaning slots need maintenance scheduling</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Performance Highlights</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 23/28 trains with valid fitness certificates</li>
                <li>• 312 km average daily mileage performance</li>
                <li>• ₹32L active branding revenue generated</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Alerts & Recommendations</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• 5 fitness certificates expiring soon</li>
                <li>• 14 open job cards need prioritization</li>
                <li>• 32/36 stabling capacity near maximum</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Trend Analysis</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 168/184 mileage logs verified (91% efficiency)</li>
                <li>• 22/28 cleaning slots optimally utilized</li>
                <li>• 16 active branding campaigns performing well</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;