import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  List,
  Settings,
  AlertTriangle,
  Play,
  FileText,
  Train,
  Map,
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', name: 'Dashboard', path: '/', icon: Home },
  { id: 'trains', name: 'Train Induction List', path: '/trains', icon: List },
  { id: 'parameters', name: 'Parameters', path: '/parameters', icon: Settings },
  { id: 'alerts', name: 'Conflict Alerts', path: '/alerts', icon: AlertTriangle },
  { id: 'simulation', name: 'Simulation', path: '/simulation', icon: Play },
  { id: 'reports', name: 'Reports', path: '/reports', icon: FileText },
  { id: 'live-map', name: 'Live Train Map', path: '/live-map', icon: Map },
];

const SideNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <Train className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Control Center</h2>
            <p className="text-sm text-gray-500">25 Trains Active</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Ready</span>
              <span className="font-medium text-success-600">18</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Standby</span>
              <span className="font-medium text-blue-600">4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Maintenance</span>
              <span className="font-medium text-warning-600">2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cleaning</span>
              <span className="font-medium text-purple-600">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;