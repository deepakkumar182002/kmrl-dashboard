import React, { useState } from 'react';
import { Download, Calendar, FileText, BarChart3, Plus, Search, Filter, Eye } from 'lucide-react';
import { mockReports } from '../data/mockData';

const Reports: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = mockReports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'daily_plan':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'weekly_summary':
        return <BarChart3 className="w-5 h-5 text-green-600" />;
      case 'monthly_report':
        return <FileText className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getReportTypeBadge = (type: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (type) {
      case 'daily_plan':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'weekly_summary':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'monthly_report':
        return `${baseClasses} bg-purple-100 text-purple-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'daily_plan':
        return 'Daily Plan';
      case 'weekly_summary':
        return 'Weekly Summary';
      case 'monthly_report':
        return 'Monthly Report';
      default:
        return 'Unknown';
    }
  };

  const generateNewReport = () => {
    alert('Report generation initiated. You will be notified when ready.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and download operational reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={generateNewReport}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Daily Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockReports.filter(r => r.type === 'daily_plan').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekly Summaries</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockReports.filter(r => r.type === 'weekly_summary').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockReports.filter(r => r.type === 'monthly_report').length}
              </p>
            </div>
          </div>
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
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Reports</option>
              <option value="daily_plan">Daily Plans</option>
              <option value="weekly_summary">Weekly Summaries</option>
              <option value="monthly_report">Monthly Reports</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Today's Induction Plan</h3>
              <p className="text-blue-100 text-sm mb-4">Generate current operational status</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Generate Now
              </button>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
              <p className="text-green-100 text-sm mb-4">Weekly operational metrics</p>
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                Generate Now
              </button>
            </div>
            <BarChart3 className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Audit Report</h3>
              <p className="text-purple-100 text-sm mb-4">Compliance and audit trail</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                Generate Now
              </button>
            </div>
            <FileText className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredReports.length} of {mockReports.length} reports
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getReportIcon(report.type)}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{report.title}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={getReportTypeBadge(report.type)}>
                        {getReportTypeLabel(report.type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Generated: {report.generatedDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or generate a new report.</p>
        </div>
      )}

      {/* Report History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Report Generation History</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-success-400 rounded-full"></div>
              <span className="text-gray-600">2:30 PM</span>
              <span>Daily Induction Plan generated successfully</span>
              <span className="text-success-600 font-medium">Completed</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-gray-600">2:25 PM</span>
              <span>Weekly Performance Summary in progress</span>
              <span className="text-blue-600 font-medium">Processing</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-success-400 rounded-full"></div>
              <span className="text-gray-600">11:45 AM</span>
              <span>Monthly Audit Report generated successfully</span>
              <span className="text-success-600 font-medium">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;