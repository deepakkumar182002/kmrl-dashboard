import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredDepartment?: string;
  adminOnly?: boolean;
  allowedDepartments?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredDepartment,
  adminOnly = false,
  allowedDepartments = [],
  fallback
}) => {
  const { user, isLoading, isAuthenticated, hasPermission, hasDepartmentAccess, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to access this resource.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Check admin-only access
  if (adminOnly && !isAdmin()) {
    return fallback || (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-4">
            This feature is only available to administrators.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Your Role:</strong> {user?.role}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Your Department:</strong> {user?.department}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check department-specific access (if not admin)
  if (allowedDepartments.length > 0 && !isAdmin() && user && !allowedDepartments.includes(user.department)) {
    return fallback || (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Department Access Required</h2>
          <p className="text-gray-600 mb-4">
            This feature is restricted to specific departments.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Allowed Departments:</strong> {allowedDepartments.join(', ')}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Your Department:</strong> {user?.department}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this feature.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Required Permission:</strong> {requiredPermission}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Your Department:</strong> {user?.department}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check department-based access
  if (requiredDepartment && !hasDepartmentAccess(requiredDepartment)) {
    return fallback || (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Department Access Required</h2>
          <p className="text-gray-600 mb-4">
            This feature is restricted to specific departments.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Required Department:</strong> {requiredDepartment}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Your Department:</strong> {user?.department}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;