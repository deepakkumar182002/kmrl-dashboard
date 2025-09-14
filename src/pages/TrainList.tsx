import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, AlertCircle, CheckCircle, Clock, Wrench, Upload, Settings, Shield, AlertTriangle } from 'lucide-react';
import { allTrains, mockAuditLogs } from '../data/mockData';
import { Train, AuditLog } from '../types';

const TrainList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Admin Controls State
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: string; trainId: string } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const filteredTrains = useMemo(() => {
    return allTrains.filter(train => {
      const matchesSearch = train.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || train.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || train.brandingPriority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter]);

  const getStatusIcon = (status: Train['status']) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'Standby':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Maintenance':
        return <Wrench className="w-4 h-4 text-warning-500" />;
      case 'Cleaning':
        return <div className="w-4 h-4 bg-purple-500 rounded-full"></div>;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Train['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Ready':
        return `${baseClasses} bg-success-100 text-success-700`;
      case 'Standby':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'Maintenance':
        return `${baseClasses} bg-warning-100 text-warning-700`;
      case 'Cleaning':
        return `${baseClasses} bg-purple-100 text-purple-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getPriorityBadge = (priority: Train['brandingPriority']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'High':
        return `${baseClasses} bg-danger-100 text-danger-700`;
      case 'Medium':
        return `${baseClasses} bg-warning-100 text-warning-700`;
      case 'Low':
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const isExpiringSoon = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Within 30 days
  };

  // Admin Control Handlers
  const handleAdminAction = (type: string, trainId: string) => {
    setPendingAction({ type, trainId });
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (pendingAction) {
      // Simulate API call
      console.log(`Admin action: ${pendingAction.type} for train ${pendingAction.trainId}`);
      
      // Add to audit log (in real app, this would be an API call)
      const newAuditEntry = {
        id: `audit-${Date.now()}`,
        timestamp: new Date(),
        userId: 'admin-user',
        action: pendingAction.type,
        target: pendingAction.trainId,
        description: `Manual ${pendingAction.type.toLowerCase()} action performed on train ${pendingAction.trainId}`
      };
      
      // In real app, you would update the train status here
      alert(`${pendingAction.type} action completed for train ${pendingAction.trainId}`);
    }
    
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const handleFileUpload = () => {
    if (uploadFile) {
      // Simulate file processing
      console.log('Processing file:', uploadFile.name);
      alert(`File "${uploadFile.name}" uploaded successfully!`);
      setUploadFile(null);
      setShowUploadModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Train Induction List</h1>
          <p className="text-gray-600">Manage and monitor all train operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAdminControls(!showAdminControls)}
            className={`flex items-center space-x-2 px-4 py-2 ${showAdminControls ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-lg transition-colors`}
          >
            <Shield className="w-4 h-4" />
            <span>{showAdminControls ? 'Exit Admin Mode' : 'Admin Controls'}</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export List</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-72">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search trains by ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Ready">Ready</option>
              <option value="Standby">Standby</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Cleaning">Cleaning</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredTrains.length} of {allTrains.length} trains
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fitness Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Card</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branding Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage (km)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cleaning Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bay Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                {showAdminControls && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Admin Controls</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrains.map((train) => (
                <tr key={train.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(train.status)}
                      <span className="ml-2 font-medium text-gray-900">{train.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(train.status)}>
                      {train.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className={`font-medium ${isExpiringSoon(train.fitnessValidity) ? 'text-danger-600' : 'text-gray-900'}`}>
                        {train.fitnessValidity.toLocaleDateString()}
                      </div>
                      {isExpiringSoon(train.fitnessValidity) && (
                        <div className="text-xs text-danger-500">Expiring soon</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      train.jobCardStatus === 'Open' 
                        ? 'bg-warning-100 text-warning-700' 
                        : 'bg-success-100 text-success-700'
                    }`}>
                      {train.jobCardStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getPriorityBadge(train.brandingPriority)}>
                      {train.brandingPriority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {train.mileage.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {train.cleaningSlot || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {train.bayPosition}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedTrain(train)}
                      className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                  {showAdminControls && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAdminAction('Mark for Maintenance', train.id)}
                          className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs hover:bg-orange-200 transition-colors"
                        >
                          Maintenance
                        </button>
                        <button
                          onClick={() => handleAdminAction('Override Status', train.id)}
                          className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                        >
                          Override
                        </button>
                        <button
                          onClick={() => handleAdminAction('Priority Boost', train.id)}
                          className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs hover:bg-purple-200 transition-colors"
                        >
                          Priority+
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

      {/* Confirmation Modal */}
      {showConfirmModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Admin Action</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Are you sure you want to perform this action?
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Action: <span className="font-medium">{pendingAction.type}</span><br />
                    Train: <span className="font-medium">{pendingAction.trainId}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Train Data</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel or CSV file
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {uploadFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {uploadFile.name}
                </p>
              )}
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-700">
                <strong>Supported formats:</strong> Excel (.xlsx, .xls) and CSV files<br />
                <strong>Expected columns:</strong> Train ID, Status, Mileage, Bay Position
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                disabled={!uploadFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Train Details Modal */}
      {selectedTrain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Train Details - {selectedTrain.id}</h3>
              <button
                onClick={() => setSelectedTrain(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <span className={getStatusBadge(selectedTrain.status)}>
                  {selectedTrain.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Mileage</label>
                <p className="text-gray-900">{selectedTrain.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Bay Position</label>
                <p className="text-gray-900">{selectedTrain.bayPosition}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Branding Priority</label>
                <span className={getPriorityBadge(selectedTrain.brandingPriority)}>
                  {selectedTrain.brandingPriority}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Fitness Validity</label>
                <p className={`${isExpiringSoon(selectedTrain.fitnessValidity) ? 'text-red-600' : 'text-gray-900'}`}>
                  {selectedTrain.fitnessValidity.toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Cleaning Slot</label>
                <p className="text-gray-900">{selectedTrain.cleaningSlot || 'Not assigned'}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedTrain(null)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainList;