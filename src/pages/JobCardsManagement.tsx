import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Upload, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  Trash2,
  User,
  Calendar
} from 'lucide-react';
import { JobCard } from '../types';

const JobCardsManagement: React.FC = () => {
  // Sample data - in real app, this would come from API
  const [jobCards, setJobCards] = useState<JobCard[]>([
    {
      id: 'JC001',
      jobId: 'JOB-2024-001',
      trainId: 'KMRL-001',
      taskDescription: 'Brake system inspection and maintenance',
      status: 'In Progress',
      expectedCompletionDate: new Date('2024-09-25'),
      assignedTo: 'Team A',
      priority: 'High',
      department: 'Maintenance',
      estimatedHours: 8,
      actualHours: 6,
      remarks: 'Progressing as planned',
      createdAt: new Date('2024-09-18'),
      updatedAt: new Date('2024-09-19')
    },
    {
      id: 'JC002',
      jobId: 'JOB-2024-002',
      trainId: 'KMRL-002',
      taskDescription: 'Electrical system diagnostics',
      status: 'Open',
      expectedCompletionDate: new Date('2024-09-30'),
      assignedTo: 'Team B',
      priority: 'Medium',
      department: 'Electrical',
      estimatedHours: 12,
      remarks: 'Waiting for spare parts',
      createdAt: new Date('2024-09-17'),
      updatedAt: new Date('2024-09-17')
    },
    {
      id: 'JC003',
      jobId: 'JOB-2024-003',
      trainId: 'KMRL-003',
      taskDescription: 'Interior cleaning and sanitization',
      status: 'Closed',
      expectedCompletionDate: new Date('2024-09-20'),
      actualCompletionDate: new Date('2024-09-20'),
      assignedTo: 'Cleaning Team',
      priority: 'Low',
      department: 'Cleaning',
      estimatedHours: 4,
      actualHours: 4,
      remarks: 'Completed successfully',
      createdAt: new Date('2024-09-19'),
      updatedAt: new Date('2024-09-20')
    }
  ]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingJobCard, setEditingJobCard] = useState<JobCard | null>(null);
  const [formData, setFormData] = useState({
    jobId: '',
    trainId: '',
    taskDescription: '',
    status: 'Open' as 'Open' | 'Closed' | 'In Progress',
    expectedCompletionDate: '',
    actualCompletionDate: '',
    assignedTo: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    department: '',
    estimatedHours: '',
    actualHours: '',
    remarks: ''
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // File upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Mock data for dropdowns
  const trainIds = ['KMRL-001', 'KMRL-002', 'KMRL-003', 'KMRL-004', 'KMRL-005'];
  const departments = ['Maintenance', 'Electrical', 'Cleaning', 'Safety', 'Operations'];
  const teams = ['Team A', 'Team B', 'Team C', 'Cleaning Team', 'Safety Team'];

  const filteredJobCards = useMemo(() => {
    return jobCards.filter(jobCard => {
      const matchesSearch = 
        jobCard.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobCard.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobCard.taskDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobCard.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || jobCard.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || jobCard.priority === priorityFilter;
      const matchesDepartment = departmentFilter === 'all' || jobCard.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });
  }, [jobCards, searchTerm, statusFilter, priorityFilter, departmentFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJobCard: JobCard = {
      id: editingJobCard?.id || `JC${Date.now()}`,
      jobId: formData.jobId,
      trainId: formData.trainId,
      taskDescription: formData.taskDescription,
      status: formData.status,
      expectedCompletionDate: new Date(formData.expectedCompletionDate),
      actualCompletionDate: formData.actualCompletionDate ? new Date(formData.actualCompletionDate) : undefined,
      assignedTo: formData.assignedTo,
      priority: formData.priority,
      department: formData.department,
      estimatedHours: parseInt(formData.estimatedHours),
      actualHours: formData.actualHours ? parseInt(formData.actualHours) : undefined,
      remarks: formData.remarks,
      createdAt: editingJobCard?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingJobCard) {
      setJobCards(prev => prev.map(jobCard => 
        jobCard.id === editingJobCard.id ? newJobCard : jobCard
      ));
    } else {
      setJobCards(prev => [...prev, newJobCard]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      jobId: '',
      trainId: '',
      taskDescription: '',
      status: 'Open',
      expectedCompletionDate: '',
      actualCompletionDate: '',
      assignedTo: '',
      priority: 'Medium',
      department: '',
      estimatedHours: '',
      actualHours: '',
      remarks: ''
    });
    setShowForm(false);
    setEditingJobCard(null);
  };

  const handleEdit = (jobCard: JobCard) => {
    setEditingJobCard(jobCard);
    setFormData({
      jobId: jobCard.jobId,
      trainId: jobCard.trainId,
      taskDescription: jobCard.taskDescription,
      status: jobCard.status,
      expectedCompletionDate: jobCard.expectedCompletionDate.toISOString().split('T')[0],
      actualCompletionDate: jobCard.actualCompletionDate?.toISOString().split('T')[0] || '',
      assignedTo: jobCard.assignedTo,
      priority: jobCard.priority,
      department: jobCard.department,
      estimatedHours: jobCard.estimatedHours.toString(),
      actualHours: jobCard.actualHours?.toString() || '',
      remarks: jobCard.remarks || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setJobCards(prev => prev.filter(jobCard => jobCard.id !== id));
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    // Mock parsing result
    const mockParsedData: JobCard[] = [
      {
        id: `JC${Date.now()}`,
        jobId: 'JOB-2024-004',
        trainId: 'KMRL-004',
        taskDescription: 'Door mechanism maintenance',
        status: 'Open',
        expectedCompletionDate: new Date('2024-10-01'),
        assignedTo: 'Team C',
        priority: 'Medium',
        department: 'Maintenance',
        estimatedHours: 6,
        remarks: 'Uploaded via CSV',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setJobCards(prev => [...prev, ...mockParsedData]);
    setUploadFile(null);
    setShowUploadModal(false);
  };

  const getStatusBadge = (status: JobCard['status']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Open':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'In Progress':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case 'Closed':
        return `${baseClasses} bg-green-100 text-green-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getPriorityBadge = (priority: JobCard['priority']) => {
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

  const isOverdue = (date: Date) => {
    const now = new Date();
    return date < now;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Cards Management</h1>
          <p className="text-gray-600">Manage maintenance tasks and job assignments</p>
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
            <span>Add Job Card</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobCards.filter(j => j.status === 'Open').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobCards.filter(j => j.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobCards.filter(j => j.status === 'Closed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {jobCards.filter(j => j.status !== 'Closed' && isOverdue(j.expectedCompletionDate)).length}
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
                placeholder="Search job cards..."
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
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
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

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
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
                  Job Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobCards.map((jobCard) => (
                <tr key={jobCard.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {jobCard.jobId}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {jobCard.taskDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{jobCard.trainId}</div>
                    <div className="text-sm text-gray-500">{jobCard.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{jobCard.assignedTo}</div>
                        <div className="text-sm text-gray-500">
                          {jobCard.estimatedHours}h est.
                          {jobCard.actualHours && ` / ${jobCard.actualHours}h actual`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">
                          Due: {jobCard.expectedCompletionDate.toLocaleDateString()}
                        </div>
                        {jobCard.actualCompletionDate && (
                          <div className="text-sm text-gray-500">
                            Completed: {jobCard.actualCompletionDate.toLocaleDateString()}
                          </div>
                        )}
                        {isOverdue(jobCard.expectedCompletionDate) && jobCard.status !== 'Closed' && (
                          <div className="text-xs text-red-600 font-medium">Overdue</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={getStatusBadge(jobCard.status)}>
                        {jobCard.status}
                      </span>
                      <br />
                      <span className={getPriorityBadge(jobCard.priority)}>
                        {jobCard.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(jobCard)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(jobCard.id)}
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
              {editingJobCard ? 'Edit Job Card' : 'Add New Job Card'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job ID</label>
                  <input
                    type="text"
                    value={formData.jobId}
                    onChange={(e) => setFormData({...formData, jobId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                <textarea
                  value={formData.taskDescription}
                  onChange={(e) => setFormData({...formData, taskDescription: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion Date</label>
                  <input
                    type="date"
                    value={formData.expectedCompletionDate}
                    onChange={(e) => setFormData({...formData, expectedCompletionDate: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Hours</label>
                  <input
                    type="number"
                    value={formData.actualHours}
                    onChange={(e) => setFormData({...formData, actualHours: e.target.value})}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Completion Date</label>
                  <input
                    type="date"
                    value={formData.actualCompletionDate}
                    onChange={(e) => setFormData({...formData, actualCompletionDate: e.target.value})}
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
                  {editingJobCard ? 'Update' : 'Add'} Job Card
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Job Cards</h3>
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
                <p>Expected columns: Job ID, Train ID, Task Description, Status, Expected Completion Date, Assigned To, Priority, Department, Estimated Hours, Remarks</p>
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

export default JobCardsManagement;