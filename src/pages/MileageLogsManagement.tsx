import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Upload, 
  Plus, 
  BarChart3, 
  Calendar, 
  CheckCircle,
  Edit3,
  Trash2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { MileageLog } from '../types';

const MileageLogsManagement: React.FC = () => {
  const [mileageLogs, setMileageLogs] = useState<MileageLog[]>([
    {
      id: 'ML001',
      trainId: 'KMRL-001',
      date: new Date('2024-09-18'),
      cumulativeKmReading: 15420,
      dailyKm: 120,
      route: 'Aluva - Pettah',
      recordedBy: 'Driver A',
      verified: true,
      verifiedBy: 'Supervisor 1',
      verifiedAt: new Date('2024-09-18'),
      remarks: 'Normal operations',
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    },
    {
      id: 'ML002',
      trainId: 'KMRL-002',
      date: new Date('2024-09-18'),
      cumulativeKmReading: 12890,
      dailyKm: 95,
      route: 'Pettah - Aluva',
      recordedBy: 'Driver B',
      verified: false,
      remarks: 'Pending verification',
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState<MileageLog | null>(null);
  const [formData, setFormData] = useState({
    trainId: '',
    date: '',
    cumulativeKmReading: '',
    dailyKm: '',
    route: '',
    recordedBy: '',
    verified: false,
    verifiedBy: '',
    remarks: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const trainIds = ['KMRL-001', 'KMRL-002', 'KMRL-003', 'KMRL-004', 'KMRL-005'];
  const routes = ['Aluva - Pettah', 'Pettah - Aluva', 'Full Circuit', 'Partial Route'];

  const filteredLogs = useMemo(() => {
    return mileageLogs.filter(log => {
      const matchesSearch = 
        log.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVerification = verificationFilter === 'all' || 
        (verificationFilter === 'verified' && log.verified) ||
        (verificationFilter === 'unverified' && !log.verified);
      
      return matchesSearch && matchesVerification;
    });
  }, [mileageLogs, searchTerm, verificationFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLog: MileageLog = {
      id: editingLog?.id || `ML${Date.now()}`,
      trainId: formData.trainId,
      date: new Date(formData.date),
      cumulativeKmReading: parseInt(formData.cumulativeKmReading),
      dailyKm: parseInt(formData.dailyKm),
      route: formData.route,
      recordedBy: formData.recordedBy,
      verified: formData.verified,
      verifiedBy: formData.verifiedBy || undefined,
      verifiedAt: formData.verified && formData.verifiedBy ? new Date() : undefined,
      remarks: formData.remarks,
      createdAt: editingLog?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingLog) {
      setMileageLogs(prev => prev.map(log => log.id === editingLog.id ? newLog : log));
    } else {
      setMileageLogs(prev => [...prev, newLog]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      trainId: '',
      date: '',
      cumulativeKmReading: '',
      dailyKm: '',
      route: '',
      recordedBy: '',
      verified: false,
      verifiedBy: '',
      remarks: ''
    });
    setShowForm(false);
    setEditingLog(null);
  };

  const handleEdit = (log: MileageLog) => {
    setEditingLog(log);
    setFormData({
      trainId: log.trainId,
      date: log.date.toISOString().split('T')[0],
      cumulativeKmReading: log.cumulativeKmReading.toString(),
      dailyKm: log.dailyKm.toString(),
      route: log.route,
      recordedBy: log.recordedBy,
      verified: log.verified,
      verifiedBy: log.verifiedBy || '',
      remarks: log.remarks || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setMileageLogs(prev => prev.filter(log => log.id !== id));
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    const mockParsedData: MileageLog[] = [
      {
        id: `ML${Date.now()}`,
        trainId: 'KMRL-003',
        date: new Date('2024-09-19'),
        cumulativeKmReading: 8950,
        dailyKm: 110,
        route: 'Full Circuit',
        recordedBy: 'Driver C',
        verified: false,
        remarks: 'Uploaded via CSV',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setMileageLogs(prev => [...prev, ...mockParsedData]);
    setUploadFile(null);
    setShowUploadModal(false);
  };

  const totalKm = mileageLogs.reduce((sum, log) => sum + log.dailyKm, 0);
  const avgDailyKm = mileageLogs.length > 0 ? totalKm / mileageLogs.length : 0;
  const verifiedLogs = mileageLogs.filter(log => log.verified).length;
  const unverifiedLogs = mileageLogs.filter(log => !log.verified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mileage Logs Management</h1>
          <p className="text-gray-600">Track daily train mileage and cumulative readings</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Log Entry</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{mileageLogs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Daily KM</p>
              <p className="text-2xl font-bold text-gray-900">{avgDailyKm.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">{verifiedLogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{unverifiedLogs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train & Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recorded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.trainId}</div>
                        <div className="text-sm text-gray-500">{log.date.toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Cumulative: {log.cumulativeKmReading.toLocaleString()} km
                    </div>
                    <div className="text-sm text-gray-500">Daily: {log.dailyKm} km</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.route}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.recordedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.verified ? (
                      <div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Verified
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          by {log.verifiedBy}
                        </div>
                      </div>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(log)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-2/3 max-w-4xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingLog ? 'Edit Mileage Log' : 'Add New Mileage Log'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Train ID</label>
                  <select
                    value={formData.trainId}
                    onChange={(e) => setFormData({...formData, trainId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Train</option>
                    {trainIds.map(id => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cumulative KM Reading</label>
                  <input
                    type="number"
                    value={formData.cumulativeKmReading}
                    onChange={(e) => setFormData({...formData, cumulativeKmReading: e.target.value})}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily KM</label>
                  <input
                    type="number"
                    value={formData.dailyKm}
                    onChange={(e) => setFormData({...formData, dailyKm: e.target.value})}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                  <select
                    value={formData.route}
                    onChange={(e) => setFormData({...formData, route: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Route</option>
                    {routes.map(route => (
                      <option key={route} value={route}>{route}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recorded By</label>
                  <input
                    type="text"
                    value={formData.recordedBy}
                    onChange={(e) => setFormData({...formData, recordedBy: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Verified</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verified By</label>
                  <input
                    type="text"
                    value={formData.verifiedBy}
                    onChange={(e) => setFormData({...formData, verifiedBy: e.target.value})}
                    disabled={!formData.verified}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingLog ? 'Update' : 'Add'} Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Mileage Logs</h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select CSV/Excel/TXT File
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Expected columns: Train ID, Date, Cumulative KM Reading, Daily KM, Route, Recorded By, Verified, Verified By, Remarks</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MileageLogsManagement;