import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  Clock,
  Calendar,
  FileText,
  DollarSign,
  Train,
  Route,
  Filter
} from 'lucide-react';
import { OperationalPlan, SupervisorReview } from '../types';
import { mockOperationalPlans, mockSupervisorReviews } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const SupervisorReviews: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<OperationalPlan[]>(mockOperationalPlans);
  const [reviews, setReviews] = useState<SupervisorReview[]>(mockSupervisorReviews);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Modal states
  const [selectedPlan, setSelectedPlan] = useState<OperationalPlan | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    decision: 'Pending' as 'Pending' | 'Approved' | 'Rejected' | 'Override',
    comments: '',
    suggestedChanges: '',
    overrideReason: ''
  });

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch = 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.proposedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || plan.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || plan.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [plans, searchTerm, statusFilter, priorityFilter, typeFilter]);

  const getStatusBadge = (status: OperationalPlan['status']) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Pending Review':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case 'Under Review':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'Approved':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'Override Applied':
        return `${baseClasses} bg-purple-100 text-purple-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getPriorityBadge = (priority: OperationalPlan['priority']) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
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

  const getRiskBadge = (risk: OperationalPlan['riskAssessment']) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (risk) {
      case 'High':
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'Medium':
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case 'Low':
        return `${baseClasses} bg-green-100 text-green-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const handleReviewSubmit = () => {
    if (!selectedPlan || !user) return;

    const newReview: SupervisorReview = {
      id: `REV-${Date.now()}`,
      planId: selectedPlan.id,
      reviewerId: user.id,
      reviewerName: user.username,
      reviewDate: new Date(),
      decision: reviewFormData.decision,
      comments: reviewFormData.comments,
      suggestedChanges: reviewFormData.suggestedChanges || undefined,
      overrideReason: reviewFormData.overrideReason || undefined,
      reviewDuration: Math.floor(Math.random() * 60) + 15, // Mock duration
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update plan status based on decision
    const updatedStatus: OperationalPlan['status'] = 
      reviewFormData.decision === 'Approved' ? 'Approved' :
      reviewFormData.decision === 'Rejected' ? 'Rejected' :
      reviewFormData.decision === 'Override' ? 'Override Applied' :
      'Under Review';

    setPlans(prev => prev.map(plan => 
      plan.id === selectedPlan.id 
        ? { ...plan, status: updatedStatus, updatedAt: new Date() }
        : plan
    ));

    setReviews(prev => [...prev, newReview]);
    setShowReviewModal(false);
    setSelectedPlan(null);
    setReviewFormData({
      decision: 'Pending',
      comments: '',
      suggestedChanges: '',
      overrideReason: ''
    });
  };

  const getExistingReview = (planId: string) => {
    return reviews.find(review => review.planId === planId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supervisor Reviews</h1>
          <p className="text-gray-600">Review and approve operational plans</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Pending Reviews: {plans.filter(p => p.status === 'Pending Review').length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Override Applied">Override Applied</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Maintenance Schedule">Maintenance Schedule</option>
            <option value="Train Assignment">Train Assignment</option>
            <option value="Route Optimization">Route Optimization</option>
            <option value="Resource Allocation">Resource Allocation</option>
            <option value="Emergency Protocol">Emergency Protocol</option>
          </select>

          <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => {
                const existingReview = getExistingReview(plan.id);
                return (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">{plan.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">{plan.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Proposed by: {plan.proposedBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {plan.type}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={getPriorityBadge(plan.priority)}>{plan.priority}</span>
                          <span className={getRiskBadge(plan.riskAssessment)}>Risk: {plan.riskAssessment}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Proposed: {plan.proposedDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          Implementation: {plan.expectedImplementation.toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Train className="w-4 h-4 mr-1" />
                          {plan.affectedTrains.length} trains
                        </div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Route className="w-4 h-4 mr-1" />
                          {plan.affectedRoutes.length} routes
                        </div>
                        {plan.estimatedCost && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ₹{plan.estimatedCost.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(plan.status)}>
                        {plan.status}
                      </span>
                      {existingReview && (
                        <div className="text-xs text-gray-500 mt-1">
                          Reviewed by: {existingReview.reviewerName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedPlan(plan)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        {(plan.status === 'Pending Review' || plan.status === 'Under Review') && !existingReview && (
                          <button
                            onClick={() => {
                              setSelectedPlan(plan);
                              setShowReviewModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Review</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Details Modal */}
      {selectedPlan && !showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Plan Details - {selectedPlan.id}</h3>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                  <p className="text-gray-900 font-medium">{selectedPlan.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <p className="text-gray-900">{selectedPlan.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Proposed By</label>
                  <p className="text-gray-900">{selectedPlan.proposedBy}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type & Priority</label>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {selectedPlan.type}
                    </span>
                    <span className={getPriorityBadge(selectedPlan.priority)}>
                      {selectedPlan.priority}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Timeline</label>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">Proposed: {selectedPlan.proposedDate.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-900">Implementation: {selectedPlan.expectedImplementation.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Impact</label>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">Affected Trains: {selectedPlan.affectedTrains.join(', ')}</p>
                    <p className="text-sm text-gray-900">Affected Routes: {selectedPlan.affectedRoutes.join(', ')}</p>
                    {selectedPlan.estimatedCost && (
                      <p className="text-sm text-gray-900">Estimated Cost: ₹{selectedPlan.estimatedCost.toLocaleString()}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Resource Requirements</label>
                  <ul className="text-sm text-gray-900 list-disc list-inside">
                    {selectedPlan.resourceRequirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Risk Assessment</label>
                  <span className={getRiskBadge(selectedPlan.riskAssessment)}>
                    {selectedPlan.riskAssessment} Risk
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              {(selectedPlan.status === 'Pending Review' || selectedPlan.status === 'Under Review') && !getExistingReview(selectedPlan.id) && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start Review</span>
                </button>
              )}
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Plan: {selectedPlan.title}</h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewFormData({
                    decision: 'Pending',
                    comments: '',
                    suggestedChanges: '',
                    overrideReason: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                <select
                  value={reviewFormData.decision}
                  onChange={(e) => setReviewFormData({
                    ...reviewFormData,
                    decision: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                  <option value="Override">Apply Override</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments *</label>
                <textarea
                  value={reviewFormData.comments}
                  onChange={(e) => setReviewFormData({
                    ...reviewFormData,
                    comments: e.target.value
                  })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your review comments..."
                />
              </div>
              
              {reviewFormData.decision === 'Rejected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Changes</label>
                  <textarea
                    value={reviewFormData.suggestedChanges}
                    onChange={(e) => setReviewFormData({
                      ...reviewFormData,
                      suggestedChanges: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Suggest improvements or changes..."
                  />
                </div>
              )}
              
              {reviewFormData.decision === 'Override' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Override Reason *</label>
                  <textarea
                    value={reviewFormData.overrideReason}
                    onChange={(e) => setReviewFormData({
                      ...reviewFormData,
                      overrideReason: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Explain the reason for override..."
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewFormData({
                    decision: 'Pending',
                    comments: '',
                    suggestedChanges: '',
                    overrideReason: ''
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={!reviewFormData.comments || (reviewFormData.decision === 'Override' && !reviewFormData.overrideReason)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorReviews;