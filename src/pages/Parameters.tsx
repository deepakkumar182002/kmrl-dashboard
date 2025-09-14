import React, { useState } from 'react';
import { Shield, FileText, Star, BarChart3, Sparkles, Building2, AlertTriangle, CheckCircle, Clock, Settings, Save, Upload } from 'lucide-react';
import { mockParameters } from '../data/mockData';

const Parameters: React.FC = () => {
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [editingParameter, setEditingParameter] = useState<string | null>(null);
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({});

  const handleParameterEdit = (paramId: string, value: string) => {
    setParameterValues(prev => ({ ...prev, [paramId]: value }));
  };

  const saveParameter = (paramId: string) => {
    // Simulate API call
    console.log(`Saving parameter ${paramId} with value:`, parameterValues[paramId]);
    alert(`Parameter ${paramId} updated successfully!`);
    setEditingParameter(null);
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-danger-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'normal':
        return `${baseClasses} bg-success-100 text-success-700`;
      case 'warning':
        return `${baseClasses} bg-warning-100 text-warning-700`;
      case 'critical':
        return `${baseClasses} bg-danger-100 text-danger-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness':
        return <Shield className="w-6 h-6" />;
      case 'job_card':
        return <FileText className="w-6 h-6" />;
      case 'branding':
        return <Star className="w-6 h-6" />;
      case 'mileage':
        return <BarChart3 className="w-6 h-6" />;
      case 'cleaning':
        return <Sparkles className="w-6 h-6" />;
      case 'stabling':
        return <Building2 className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness':
        return 'text-blue-600 bg-blue-100';
      case 'job_card':
        return 'text-purple-600 bg-purple-100';
      case 'branding':
        return 'text-yellow-600 bg-yellow-100';
      case 'mileage':
        return 'text-green-600 bg-green-100';
      case 'cleaning':
        return 'text-pink-600 bg-pink-100';
      case 'stabling':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const categorizedParameters = mockParameters.reduce((acc, param) => {
    if (!acc[param.category]) {
      acc[param.category] = [];
    }
    acc[param.category].push(param);
    return acc;
  }, {} as Record<string, typeof mockParameters>);

  const categoryNames = {
    fitness: 'Fitness Certificates',
    job_card: 'Job Card Status',
    branding: 'Branding Priorities',
    mileage: 'Mileage Balancing',
    cleaning: 'Cleaning Slots',
    stabling: 'Stabling Geometry',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Parameters</h1>
          <p className="text-gray-600">Monitor key operational parameters and their status</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowAdminControls(!showAdminControls)}
            className={`flex items-center space-x-2 px-4 py-2 ${showAdminControls ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-lg transition-colors`}
          >
            <Settings className="w-4 h-4" />
            <span>{showAdminControls ? 'Exit Admin Mode' : 'Admin Settings'}</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Auto-refresh: 30s</span>
          </div>
        </div>
      </div>

      {/* Summary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Normal Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockParameters.filter(p => p.status === 'normal').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockParameters.filter(p => p.status === 'warning').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockParameters.filter(p => p.status === 'critical').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(categorizedParameters).map(([category, parameters]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(category)}`}>
                  {getCategoryIcon(category)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {categoryNames[category as keyof typeof categoryNames]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {parameters.length} parameter{parameters.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {parameters.map((param) => (
                  <div key={param.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(param.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{param.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-bold text-gray-900">{param.value}</span>
                          <span className={getStatusBadge(param.status)}>
                            {param.status.charAt(0).toUpperCase() + param.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {param.lastUpdated.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Parameter Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Parameters Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                {showAdminControls && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Admin Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockParameters.map((param) => (
                <tr key={param.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(param.status)}
                      <div>
                        <div className="font-medium text-gray-900">{param.name}</div>
                        <div className="text-sm text-gray-500">{param.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${getCategoryColor(param.category)}`}>
                        {getCategoryIcon(param.category)}
                      </div>
                      <span className="text-sm text-gray-900">
                        {categoryNames[param.category as keyof typeof categoryNames]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingParameter === param.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          defaultValue={param.value}
                          onChange={(e) => handleParameterEdit(param.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                        />
                        <button
                          onClick={() => saveParameter(param.id)}
                          className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingParameter(null)}
                          className="p-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900">{param.value}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(param.status)}>
                      {param.status.charAt(0).toUpperCase() + param.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {param.lastUpdated.toLocaleString()}
                  </td>
                  {showAdminControls && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingParameter(param.id)}
                          disabled={editingParameter === param.id}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => alert(`Uploading new config for ${param.name}`)}
                          className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Parameters;