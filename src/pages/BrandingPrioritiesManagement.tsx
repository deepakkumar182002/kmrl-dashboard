import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Upload, 
  Plus, 
  Tag, 
  Calendar, 
  DollarSign,
  Edit3,
  Trash2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { BrandingPriority } from '../types';

const BrandingPrioritiesManagement: React.FC = () => {
  // Sample data - in real app, this would come from API
  const [brandingPriorities, setBrandingPriorities] = useState<BrandingPriority[]>([
    {
      id: 'BP001',
      trainId: 'KMRL-001',
      brandingContractId: 'BRC-2024-001',
      advertiserName: 'Coca-Cola India',
      requiredExposureHours: 2000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      currentExposureHours: 1200,
      priority: 'High',
      status: 'Active',
      contractValue: 500000,
      remarks: 'Premium positioning contract',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-09-18')
    },
    {
      id: 'BP002',
      trainId: 'KMRL-002',
      brandingContractId: 'BRC-2024-002',
      advertiserName: 'Samsung Electronics',
      requiredExposureHours: 1500,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-11-30'),
      currentExposureHours: 800,
      priority: 'Medium',
      status: 'Active',
      contractValue: 350000,
      remarks: 'Technology brand partnership',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-09-15')
    },
    {
      id: 'BP003',
      trainId: 'KMRL-003',
      brandingContractId: 'BRC-2024-003',
      advertiserName: 'Amazon India',
      requiredExposureHours: 1800,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      currentExposureHours: 1800,
      priority: 'High',
      status: 'Completed',
      contractValue: 420000,
      remarks: 'Contract completed successfully',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-08-31')
    }
  ]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingBrandingPriority, setEditingBrandingPriority] = useState<BrandingPriority | null>(null);
  const [formData, setFormData] = useState({
    trainId: '',
    brandingContractId: '',
    advertiserName: '',
    requiredExposureHours: '',
    startDate: '',
    endDate: '',
    currentExposureHours: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    status: 'Pending' as 'Active' | 'Completed' | 'Pending' | 'Cancelled',
    contractValue: '',
    remarks: ''
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // File upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Mock train IDs for dropdown
  const trainIds = ['KMRL-001', 'KMRL-002', 'KMRL-003', 'KMRL-004', 'KMRL-005'];

  const filteredBrandingPriorities = useMemo(() => {
    return brandingPriorities.filter(bp => {
      const matchesSearch = 
        bp.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bp.brandingContractId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bp.advertiserName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bp.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || bp.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [brandingPriorities, searchTerm, statusFilter, priorityFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBrandingPriority: BrandingPriority = {
      id: editingBrandingPriority?.id || `BP${Date.now()}`,
      trainId: formData.trainId,
      brandingContractId: formData.brandingContractId,
      advertiserName: formData.advertiserName,
      requiredExposureHours: parseInt(formData.requiredExposureHours),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      currentExposureHours: parseInt(formData.currentExposureHours) || 0,
      priority: formData.priority,
      status: formData.status,
      contractValue: parseInt(formData.contractValue),
      remarks: formData.remarks,
      createdAt: editingBrandingPriority?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingBrandingPriority) {
      setBrandingPriorities(prev => prev.map(bp => 
        bp.id === editingBrandingPriority.id ? newBrandingPriority : bp
      ));
    } else {
      setBrandingPriorities(prev => [...prev, newBrandingPriority]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      trainId: '',
      brandingContractId: '',
      advertiserName: '',
      requiredExposureHours: '',
      startDate: '',
      endDate: '',
      currentExposureHours: '',
      priority: 'Medium',
      status: 'Pending',
      contractValue: '',
      remarks: ''
    });
    setShowForm(false);
    setEditingBrandingPriority(null);
  };

  const handleEdit = (brandingPriority: BrandingPriority) => {
    setEditingBrandingPriority(brandingPriority);
    setFormData({
      trainId: brandingPriority.trainId,
      brandingContractId: brandingPriority.brandingContractId,
      advertiserName: brandingPriority.advertiserName,
      requiredExposureHours: brandingPriority.requiredExposureHours.toString(),
      startDate: brandingPriority.startDate.toISOString().split('T')[0],
      endDate: brandingPriority.endDate.toISOString().split('T')[0],
      currentExposureHours: brandingPriority.currentExposureHours.toString(),
      priority: brandingPriority.priority,
      status: brandingPriority.status,
      contractValue: brandingPriority.contractValue.toString(),
      remarks: brandingPriority.remarks || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setBrandingPriorities(prev => prev.filter(bp => bp.id !== id));
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    // Mock parsing result
    const mockParsedData: BrandingPriority[] = [
      {
        id: `BP${Date.now()}`,
        trainId: 'KMRL-004',
        brandingContractId: 'BRC-2024-004',
        advertiserName: 'Nike India',
        requiredExposureHours: 1200,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-31'),
        currentExposureHours: 0,
        priority: 'Medium',
        status: 'Pending',
        contractValue: 280000,
        remarks: 'Uploaded via CSV',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setBrandingPriorities(prev => [...prev, ...mockParsedData]);
    setUploadFile(null);
    setShowUploadModal(false);
  };

  const getStatusBadge = (status: BrandingPriority['status']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'Completed':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case 'Cancelled':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getPriorityBadge = (priority: BrandingPriority['priority']) => {
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

  const getProgressPercentage = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100);
  };

  const isUnderPerforming = (current: number, required: number, startDate: Date, endDate: Date) => {
    const now = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const expectedProgress = (elapsed / totalDuration) * 100;
    const actualProgress = (current / required) * 100;
    
    return actualProgress < expectedProgress - 10; // 10% tolerance
  };

  const totalContractValue = brandingPriorities.reduce((sum, bp) => sum + bp.contractValue, 0);
  const activeContracts = brandingPriorities.filter(bp => bp.status === 'Active').length;
  const completedContracts = brandingPriorities.filter(bp => bp.status === 'Completed').length;
  const underPerformingContracts = brandingPriorities.filter(bp => 
    bp.status === 'Active' && isUnderPerforming(bp.currentExposureHours, bp.requiredExposureHours, bp.startDate, bp.endDate)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding Priorities Management</h1>
          <p className="text-gray-600">Manage advertising contracts and exposure tracking</p>
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
            <span>Add Contract</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{activeContracts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedContracts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{(totalContractValue / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Target</p>
              <p className="text-2xl font-bold text-gray-900">{underPerformingContracts}</p>
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
                placeholder="Search contracts..."
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
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
                  Contract Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train & Advertiser
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exposure Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBrandingPriorities.map((bp) => {
                const progressPercentage = getProgressPercentage(bp.currentExposureHours, bp.requiredExposureHours);
                const isUnderTarget = isUnderPerforming(bp.currentExposureHours, bp.requiredExposureHours, bp.startDate, bp.endDate);
                
                return (
                  <tr key={bp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {bp.brandingContractId}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {bp.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bp.trainId}</div>
                      <div className="text-sm text-gray-500">{bp.advertiserName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bp.currentExposureHours} / {bp.requiredExposureHours} hours
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            isUnderTarget ? 'bg-red-500' : progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {progressPercentage.toFixed(1)}% complete
                        {isUnderTarget && bp.status === 'Active' && (
                          <span className="text-red-600 font-medium"> • Behind target</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {bp.startDate.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            to {bp.endDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={getStatusBadge(bp.status)}>
                          {bp.status}
                        </span>
                        <br />
                        <span className={getPriorityBadge(bp.priority)}>
                          {bp.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(bp.contractValue / 100000).toFixed(1)}L
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(bp)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bp.id)}
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
              {editingBrandingPriority ? 'Edit Branding Contract' : 'Add New Branding Contract'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract ID</label>
                  <input
                    type="text"
                    value={formData.brandingContractId}
                    onChange={(e) => setFormData({...formData, brandingContractId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advertiser Name</label>
                <input
                  type="text"
                  value={formData.advertiserName}
                  onChange={(e) => setFormData({...formData, advertiserName: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Exposure Hours</label>
                  <input
                    type="number"
                    value={formData.requiredExposureHours}
                    onChange={(e) => setFormData({...formData, requiredExposureHours: e.target.value})}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Exposure Hours</label>
                  <input
                    type="number"
                    value={formData.currentExposureHours}
                    onChange={(e) => setFormData({...formData, currentExposureHours: e.target.value})}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value (₹)</label>
                  <input
                    type="number"
                    value={formData.contractValue}
                    onChange={(e) => setFormData({...formData, contractValue: e.target.value})}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  {editingBrandingPriority ? 'Update' : 'Add'} Contract
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Branding Contracts</h3>
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
                <p>Expected columns: Train ID, Contract ID, Advertiser Name, Required Exposure Hours, Start Date, End Date, Priority, Status, Contract Value, Remarks</p>
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

export default BrandingPrioritiesManagement;