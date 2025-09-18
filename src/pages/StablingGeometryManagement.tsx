import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Upload, 
  Plus, 
  MapPin, 
  Calendar, 
  Package,
  Edit3,
  Trash2,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { StablingGeometry } from '../types';

const StablingGeometryManagement: React.FC = () => {
  const [stablingData, setStablingData] = useState<StablingGeometry[]>([
    {
      id: 'SG001',
      bayId: 'BAY-001',
      trainId: 'KMRL-001',
      position: 1,
      bayType: 'Service',
      capacity: 2,
      currentOccupancy: 1,
      isAvailable: false,
      assignedAt: new Date('2024-09-18T08:00:00'),
      expectedDeparture: new Date('2024-09-18T16:00:00'),
      priority: 'High',
      remarks: 'Service bay - scheduled maintenance',
      coordinateX: 100.5,
      coordinateY: 200.3,
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    },
    {
      id: 'SG002',
      bayId: 'BAY-001',
      position: 2,
      bayType: 'Service',
      capacity: 2,
      currentOccupancy: 1,
      isAvailable: true,
      priority: 'Medium',
      remarks: 'Service bay - available for assignment',
      coordinateX: 100.5,
      coordinateY: 250.8,
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    },
    {
      id: 'SG003',
      bayId: 'BAY-002',
      trainId: 'KMRL-002',
      position: 1,
      bayType: 'Cleaning',
      capacity: 3,
      currentOccupancy: 1,
      isAvailable: false,
      assignedAt: new Date('2024-09-18T10:00:00'),
      expectedDeparture: new Date('2024-09-18T14:00:00'),
      priority: 'Medium',
      remarks: 'Deep cleaning in progress',
      coordinateX: 150.2,
      coordinateY: 200.3,
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    },
    {
      id: 'SG004',
      bayId: 'BAY-003',
      position: 1,
      bayType: 'Storage',
      capacity: 4,
      currentOccupancy: 0,
      isAvailable: true,
      priority: 'Low',
      remarks: 'Long-term storage bay',
      coordinateX: 200.7,
      coordinateY: 200.3,
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-18')
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingGeometry, setEditingGeometry] = useState<StablingGeometry | null>(null);
  const [formData, setFormData] = useState({
    bayId: '',
    trainId: '',
    position: '',
    bayType: 'Service' as 'Service' | 'Maintenance' | 'Cleaning' | 'Storage',
    capacity: '',
    currentOccupancy: '',
    isAvailable: true,
    assignedAt: '',
    expectedDeparture: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    remarks: '',
    coordinateX: '',
    coordinateY: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [bayTypeFilter, setBayTypeFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const bayIds = ['BAY-001', 'BAY-002', 'BAY-003', 'BAY-004', 'BAY-005'];
  const trainIds = ['KMRL-001', 'KMRL-002', 'KMRL-003', 'KMRL-004', 'KMRL-005'];

  const filteredData = useMemo(() => {
    return stablingData.filter(item => {
      const matchesSearch = 
        item.bayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.trainId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.remarks?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBayType = bayTypeFilter === 'all' || item.bayType === bayTypeFilter;
      const matchesAvailability = availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && item.isAvailable) ||
        (availabilityFilter === 'occupied' && !item.isAvailable);
      
      return matchesSearch && matchesBayType && matchesAvailability;
    });
  }, [stablingData, searchTerm, bayTypeFilter, availabilityFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGeometry: StablingGeometry = {
      id: editingGeometry?.id || `SG${Date.now()}`,
      bayId: formData.bayId,
      trainId: formData.trainId || undefined,
      position: parseInt(formData.position),
      bayType: formData.bayType,
      capacity: parseInt(formData.capacity),
      currentOccupancy: parseInt(formData.currentOccupancy),
      isAvailable: formData.isAvailable,
      assignedAt: formData.assignedAt ? new Date(formData.assignedAt) : undefined,
      expectedDeparture: formData.expectedDeparture ? new Date(formData.expectedDeparture) : undefined,
      priority: formData.priority,
      remarks: formData.remarks,
      coordinateX: parseFloat(formData.coordinateX),
      coordinateY: parseFloat(formData.coordinateY),
      createdAt: editingGeometry?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingGeometry) {
      setStablingData(prev => prev.map(item => item.id === editingGeometry.id ? newGeometry : item));
    } else {
      setStablingData(prev => [...prev, newGeometry]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      bayId: '',
      trainId: '',
      position: '',
      bayType: 'Service',
      capacity: '',
      currentOccupancy: '',
      isAvailable: true,
      assignedAt: '',
      expectedDeparture: '',
      priority: 'Medium',
      remarks: '',
      coordinateX: '',
      coordinateY: ''
    });
    setShowForm(false);
    setEditingGeometry(null);
  };

  const handleEdit = (geometry: StablingGeometry) => {
    setEditingGeometry(geometry);
    setFormData({
      bayId: geometry.bayId,
      trainId: geometry.trainId || '',
      position: geometry.position.toString(),
      bayType: geometry.bayType,
      capacity: geometry.capacity.toString(),
      currentOccupancy: geometry.currentOccupancy.toString(),
      isAvailable: geometry.isAvailable,
      assignedAt: geometry.assignedAt?.toISOString().slice(0, 16) || '',
      expectedDeparture: geometry.expectedDeparture?.toISOString().slice(0, 16) || '',
      priority: geometry.priority,
      remarks: geometry.remarks || '',
      coordinateX: geometry.coordinateX.toString(),
      coordinateY: geometry.coordinateY.toString()
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setStablingData(prev => prev.filter(item => item.id !== id));
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    const mockParsedData: StablingGeometry[] = [
      {
        id: `SG${Date.now()}`,
        bayId: 'BAY-004',
        position: 1,
        bayType: 'Maintenance',
        capacity: 2,
        currentOccupancy: 0,
        isAvailable: true,
        priority: 'Medium',
        remarks: 'Uploaded via CSV',
        coordinateX: 250.5,
        coordinateY: 200.3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setStablingData(prev => [...prev, ...mockParsedData]);
    setUploadFile(null);
    setShowUploadModal(false);
  };

  const getBayTypeBadge = (bayType: StablingGeometry['bayType']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (bayType) {
      case 'Service':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'Maintenance':
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case 'Cleaning':
        return `${baseClasses} bg-purple-100 text-purple-700`;
      case 'Storage':
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getPriorityBadge = (priority: StablingGeometry['priority']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (priority) {
      case 'High':
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'Medium':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case 'Low':
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getOccupancyPercentage = (current: number, capacity: number) => {
    return (current / capacity) * 100;
  };

  const totalPositions = stablingData.length;
  const availablePositions = stablingData.filter(item => item.isAvailable).length;
  const occupiedPositions = stablingData.filter(item => !item.isAvailable).length;
  const totalCapacity = stablingData.reduce((sum, item) => sum + item.capacity, 0);
  const currentOccupancy = stablingData.reduce((sum, item) => sum + item.currentOccupancy, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stabling Geometry Management</h1>
          <p className="text-gray-600">Manage depot bay positions and train assignments</p>
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
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Positions</p>
              <p className="text-2xl font-bold text-gray-900">{totalPositions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{availablePositions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-gray-900">{occupiedPositions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCapacity > 0 ? ((currentOccupancy / totalCapacity) * 100).toFixed(1) : 0}%
              </p>
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
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={bayTypeFilter}
            onChange={(e) => setBayTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Bay Types</option>
            <option value="Service">Service</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Storage">Storage</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
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
                  Bay & Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Train
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordinates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => {
                const occupancyPercentage = getOccupancyPercentage(item.currentOccupancy, item.capacity);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.bayId}</div>
                          <div className="text-sm text-gray-500">Position {item.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.trainId || 'Unassigned'}
                      </div>
                      {item.isAvailable ? (
                        <span className="text-xs text-green-600 font-medium">Available</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">Occupied</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={getBayTypeBadge(item.bayType)}>
                          {item.bayType}
                        </span>
                        <div className="text-sm text-gray-900">
                          Capacity: {item.currentOccupancy} / {item.capacity}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              occupancyPercentage === 100 ? 'bg-red-500' : 
                              occupancyPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${occupancyPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        X: {item.coordinateX}
                      </div>
                      <div className="text-sm text-gray-500">
                        Y: {item.coordinateY}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.assignedAt && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              In: {item.assignedAt.toLocaleString()}
                            </div>
                            {item.expectedDeparture && (
                              <div className="text-sm text-gray-500">
                                Out: {item.expectedDeparture.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={getPriorityBadge(item.priority)}>
                          {item.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-2/3 max-w-4xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingGeometry ? 'Edit Stabling Position' : 'Add New Stabling Position'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Train (Optional)</label>
                <select
                  value={formData.trainId}
                  onChange={(e) => setFormData({...formData, trainId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No assignment</option>
                  {trainIds.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bay Type</label>
                  <select
                    value={formData.bayType}
                    onChange={(e) => setFormData({...formData, bayType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Service">Service</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Storage">Storage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Occupancy</label>
                  <input
                    type="number"
                    value={formData.currentOccupancy}
                    onChange={(e) => setFormData({...formData, currentOccupancy: e.target.value})}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coordinate X</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.coordinateX}
                    onChange={(e) => setFormData({...formData, coordinateX: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coordinate Y</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.coordinateY}
                    onChange={(e) => setFormData({...formData, coordinateY: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned At</label>
                  <input
                    type="datetime-local"
                    value={formData.assignedAt}
                    onChange={(e) => setFormData({...formData, assignedAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Departure</label>
                  <input
                    type="datetime-local"
                    value={formData.expectedDeparture}
                    onChange={(e) => setFormData({...formData, expectedDeparture: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Available for Assignment</span>
                  </label>
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
                  {editingGeometry ? 'Update' : 'Add'} Position
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Stabling Geometry</h3>
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
                <p>Expected columns: Bay ID, Train ID, Position, Bay Type, Capacity, Current Occupancy, Available, Assigned At, Expected Departure, Priority, Remarks, Coordinate X, Coordinate Y</p>
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

export default StablingGeometryManagement;