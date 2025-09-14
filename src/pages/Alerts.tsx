import React, { useState } from 'react';
import { AlertTriangle, Shield, FileText, Star, BarChart3, Clock, CheckCircle, X, Eye } from 'lucide-react';
import { mockAlerts } from '../data/mockData';
import { Alert } from '../types';

const Alerts: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    return matchesSeverity && matchesType;
  });

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'fitness_expired':
        return <Shield className="w-5 h-5" />;
      case 'job_card_pending':
        return <FileText className="w-5 h-5" />;
      case 'branding_sla':
        return <Star className="w-5 h-5" />;
      case 'mileage_uneven':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'border-danger-200 bg-danger-50 text-danger-700';
      case 'medium':
        return 'border-warning-200 bg-warning-50 text-warning-700';
      case 'low':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (severity) {
      case 'high':
        return `${baseClasses} bg-danger-100 text-danger-700`;
      case 'medium':
        return `${baseClasses} bg-warning-100 text-warning-700`;
      case 'low':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'fitness_expired':
        return 'Fitness Certificate';
      case 'job_card_pending':
        return 'Job Card Pending';
      case 'branding_sla':
        return 'Branding SLA';
      case 'mileage_uneven':
        return 'Mileage Imbalance';
      default:
        return 'Unknown';
    }
  };

  const alertCounts = {
    total: mockAlerts.length,
    high: mockAlerts.filter(a => a.severity === 'high').length,
    medium: mockAlerts.filter(a => a.severity === 'medium').length,
    low: mockAlerts.filter(a => a.severity === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conflict Alerts</h1>
          <p className="text-gray-600">Monitor and resolve system conflicts and issues</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors">
            <CheckCircle className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alertCounts.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{alertCounts.high}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-gray-900">{alertCounts.medium}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Priority</p>
              <p className="text-2xl font-bold text-gray-900">{alertCounts.low}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="fitness_expired">Fitness Certificate</option>
              <option value="job_card_pending">Job Card Pending</option>
              <option value="branding_sla">Branding SLA</option>
              <option value="mileage_uneven">Mileage Imbalance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-2 rounded-xl p-6 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  alert.severity === 'high' ? 'bg-danger-100' :
                  alert.severity === 'medium' ? 'bg-warning-100' : 'bg-blue-100'
                }`}>
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                    <span className={getSeverityBadge(alert.severity)}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {getTypeLabel(alert.type)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{alert.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{alert.timestamp.toLocaleString()}</span>
                    </div>
                    {alert.trainId && (
                      <div className="flex items-center space-x-1">
                        <span>Train:</span>
                        <span className="font-medium text-gray-900">{alert.trainId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-600">All systems are operating normally with no conflicts detected.</p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alert Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-success-400 rounded-full"></div>
              <span className="text-gray-600">12:45 PM</span>
              <span>Resolved: Job card JC-2024-0156 completed for Train TRN007</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
              <span className="text-gray-600">11:30 AM</span>
              <span>New alert: Branding SLA warning for Train TRN001</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-danger-400 rounded-full"></div>
              <span className="text-gray-600">09:15 AM</span>
              <span>Critical: Fitness certificate expired for Train TRN004</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;