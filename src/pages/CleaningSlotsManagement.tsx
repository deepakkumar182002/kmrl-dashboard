import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Upload, 
  Plus, 
  Calendar, 
  Clock, 
  Users,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CleaningSlot } from '../types';

const CleaningSlotsManagement: React.FC = () => {
  const [cleaningSlots, setCleaningSlots] = useState<CleaningSlot[]>([
    {
      id: 'CS001',
      bayId: 'BAY-001',
      slotStartTime: '08:00',
      slotEndTime: '10:00',
      assignedTrainId: 'KMRL-001',
      manpowerAvailable: 5,
      manpowerAssigned: 5,
      cleaningType: 'Deep',
      status: 'Occupied',
      supervisor: 'John Smith',
      date: new Date('2024-09-18'),
      completionStatus: 'In Progress',
      remarks: 'Deep cleaning in progress',
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    },
    {
      id: 'CS002',
      bayId: 'BAY-002',
      slotStartTime: '10:30',
      slotEndTime: '12:00',
      manpowerAvailable: 3,
      manpowerAssigned: 0,
      cleaningType: 'Basic',
      status: 'Available',
      supervisor: 'Sarah Johnson',
      date: new Date('2024-09-18'),
      completionStatus: 'Pending',
      remarks: 'Ready for assignment',
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    },
    {
      id: 'CS003',
      bayId: 'BAY-003',
      slotStartTime: '14:00',
      slotEndTime: '16:00',
      assignedTrainId: 'KMRL-002',
      manpowerAvailable: 4,
      manpowerAssigned: 4,
      cleaningType: 'Maintenance',
      status: 'Occupied',
      supervisor: 'Mike Wilson',
      date: new Date('2024-09-18'),
      completionStatus: 'Completed',
      remarks: 'Maintenance cleaning completed',
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<CleaningSlot | null>(null);
  const [formData, setFormData] = useState({
    bayId: '',
    slotStartTime: '',
    slotEndTime: '',
    assignedTrainId: '',
    manpowerAvailable: '',
    manpowerAssigned: '',
    cleaningType: 'Basic' as 'Basic' | 'Deep' | 'Maintenance',
    status: 'Available' as 'Available' | 'Occupied' | 'Maintenance',
    supervisor: '',
    date: '',
    completionStatus: 'Pending' as 'Pending' | 'In Progress' | 'Completed',
    remarks: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cleaningTypeFilter, setCleaningTypeFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const bayIds = ['BAY-001', 'BAY-002', 'BAY-003', 'BAY-004', 'BAY-005'];
  const trainIds = ['KMRL-001', 'KMRL-002', 'KMRL-003', 'KMRL-004', 'KMRL-005'];
  const supervisors = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emma Davis', 'Tom Brown'];

  const filteredSlots = useMemo(() => {
    return cleaningSlots.filter(slot => {
      const matchesSearch = 
        slot.bayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.assignedTrainId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || slot.status === statusFilter;
      const matchesCleaningType = cleaningTypeFilter === 'all' || slot.cleaningType === cleaningTypeFilter;
      
      return matchesSearch && matchesStatus && matchesCleaningType;
    });
  }, [cleaningSlots, searchTerm, statusFilter, cleaningTypeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSlot: CleaningSlot = {
      id: editingSlot?.id || `CS${Date.now()}`,
      bayId: formData.bayId,
      slotStartTime: formData.slotStartTime,
      slotEndTime: formData.slotEndTime,
      assignedTrainId: formData.assignedTrainId || undefined,
      manpowerAvailable: parseInt(formData.manpowerAvailable),
      manpowerAssigned: parseInt(formData.manpowerAssigned),
      cleaningType: formData.cleaningType,
      status: formData.status,
      supervisor: formData.supervisor,
      date: new Date(formData.date),
      completionStatus: formData.completionStatus,
      remarks: formData.remarks,
      createdAt: editingSlot?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingSlot) {
      setCleaningSlots(prev => prev.map(slot => slot.id === editingSlot.id ? newSlot : slot));
    } else {
      setCleaningSlots(prev => [...prev, newSlot]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      bayId: '',
      slotStartTime: '',
      slotEndTime: '',
      assignedTrainId: '',
      manpowerAvailable: '',
      manpowerAssigned: '',
      cleaningType: 'Basic',
      status: 'Available',
      supervisor: '',
      date: '',
      completionStatus: 'Pending',
      remarks: ''
    });
    setShowForm(false);
    setEditingSlot(null);
  };

  const handleEdit = (slot: CleaningSlot) => {
    setEditingSlot(slot);
    setFormData({
      bayId: slot.bayId,
      slotStartTime: slot.slotStartTime,
      slotEndTime: slot.slotEndTime,
      assignedTrainId: slot.assignedTrainId || '',
      manpowerAvailable: slot.manpowerAvailable.toString(),
      manpowerAssigned: slot.manpowerAssigned.toString(),
      cleaningType: slot.cleaningType,
      status: slot.status,
      supervisor: slot.supervisor,
      date: slot.date.toISOString().split('T')[0],
      completionStatus: slot.completionStatus || 'Pending',
      remarks: slot.remarks || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCleaningSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    const mockParsedData: CleaningSlot[] = [
      {
        id: `CS${Date.now()}`,
        bayId: 'BAY-004',
        slotStartTime: '16:30',
        slotEndTime: '18:00',
        manpowerAvailable: 4,
        manpowerAssigned: 0,
        cleaningType: 'Basic',
        status: 'Available',
        supervisor: 'Emma Davis',
        date: new Date('2024-09-19'),
        completionStatus: 'Pending',
        remarks: 'Uploaded via CSV',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setCleaningSlots(prev => [...prev, ...mockParsedData]);
    setUploadFile(null);
    setShowUploadModal(false);
  };

  const getStatusBadge = (status: CleaningSlot['status']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Available':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'Occupied':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'Maintenance':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getCompletionBadge = (status?: CleaningSlot['completionStatus']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Completed':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'In Progress':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'Pending':
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const availableSlots = cleaningSlots.filter(slot => slot.status === 'Available').length;
  const occupiedSlots = cleaningSlots.filter(slot => slot.status === 'Occupied').length;
  const totalManpower = cleaningSlots.reduce((sum, slot) => sum + slot.manpowerAvailable, 0);
  const assignedManpower = cleaningSlots.reduce((sum, slot) => sum + slot.manpowerAssigned, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cleaning & Detailing Slots Management</h1>
          <p className="text-gray-600">Manage cleaning bay schedules and manpower allocation</p>
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
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Slots</p>
              <p className="text-2xl font-bold text-gray-900">{availableSlots}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Occupied Slots</p>
              <p className="text-2xl font-bold text-gray-900">{occupiedSlots}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Manpower</p>
              <p className="text-2xl font-bold text-gray-900">{totalManpower}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{assignedManpower}</p>
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
                placeholder="Search slots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            value={cleaningTypeFilter}
            onChange={(e) => setCleaningTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Basic">Basic</option>
            <option value="Deep">Deep</option>
            <option value="Maintenance">Maintenance</option>
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
                  Bay & Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Train
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manpower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cleaning Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{slot.bayId}</div>
                        <div className="text-sm text-gray-500">
                          {slot.slotStartTime} - {slot.slotEndTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {slot.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {slot.assignedTrainId || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {slot.manpowerAssigned} / {slot.manpowerAvailable}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(slot.manpowerAssigned / slot.manpowerAvailable) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      slot.cleaningType === 'Deep' ? 'bg-purple-100 text-purple-700' :
                      slot.cleaningType === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {slot.cleaningType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={getStatusBadge(slot.status)}>
                        {slot.status}
                      </span>
                      <br />
                      <span className={getCompletionBadge(slot.completionStatus)}>
                        {slot.completionStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{slot.supervisor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(slot)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id)}
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
              {editingSlot ? 'Edit Cleaning Slot' : 'Add New Cleaning Slot'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bay ID</label>
                  <select
                    value={formData.bayId}
                    onChange={(e) => setFormData({...formData, bayId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Bay</option>
                    {bayIds.map(id => (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.slotStartTime}
                    onChange={(e) => setFormData({...formData, slotStartTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.slotEndTime}
                    onChange={(e) => setFormData({...formData, slotEndTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Train (Optional)</label>
                <select
                  value={formData.assignedTrainId}
                  onChange={(e) => setFormData({...formData, assignedTrainId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No assignment</option>
                  {trainIds.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manpower Available</label>
                  <input
                    type="number"
                    value={formData.manpowerAvailable}
                    onChange={(e) => setFormData({...formData, manpowerAvailable: e.target.value})}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manpower Assigned</label>
                  <input
                    type="number"
                    value={formData.manpowerAssigned}
                    onChange={(e) => setFormData({...formData, manpowerAssigned: e.target.value})}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Type</label>
                  <select
                    value={formData.cleaningType}
                    onChange={(e) => setFormData({...formData, cleaningType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Deep">Deep</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Completion Status</label>
                  <select
                    value={formData.completionStatus}
                    onChange={(e) => setFormData({...formData, completionStatus: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                <select
                  value={formData.supervisor}
                  onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Supervisor</option>
                  {supervisors.map(supervisor => (
                    <option key={supervisor} value={supervisor}>{supervisor}</option>
                  ))}
                </select>
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
                  {editingSlot ? 'Update' : 'Add'} Slot
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Cleaning Slots</h3>
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
                <p>Expected columns: Bay ID, Start Time, End Time, Assigned Train, Manpower Available, Manpower Assigned, Cleaning Type, Status, Supervisor, Date, Completion Status, Remarks</p>
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

export default CleaningSlotsManagement;