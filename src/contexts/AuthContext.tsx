import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContext as AuthContextType } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication - replace with real auth logic
  useEffect(() => {
    // Simulate loading user from localStorage or API - Default Admin User
    const mockUser: User = {
      id: 'admin-001',
      username: 'admin',
      email: 'admin@kmrl.kerala.gov.in',
      department: 'Maintenance',
      role: 'Admin',
      permissions: [
        'fitness_certificates:read',
        'fitness_certificates:write',
        'job_cards:read',
        'job_cards:write',
        'branding_priorities:read',
        'branding_priorities:write',
        'mileage_logs:read',
        'mileage_logs:write',
        'cleaning_slots:read',
        'cleaning_slots:write',
        'stabling_geometry:read',
        'stabling_geometry:write',
        'train_management:read',
        'train_management:write',
        'supervisor_reviews:read',
        'supervisor_reviews:write',
        'all_access:admin'
      ],
      isActive: true,
      createdAt: new Date(),
    };

    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock login logic - replace with real authentication
    if (email && password) {
      const isAdmin = email.includes('admin');
      
      const mockUser: User = {
        id: isAdmin ? 'admin-001' : 'user-' + Date.now(),
        username: email.split('@')[0],
        email,
        department: getDepartmentFromEmail(email),
        role: isAdmin ? 'Admin' : 'Supervisor',
        permissions: getDepartmentPermissions(email),
        isActive: true,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasDepartmentAccess = (department: string): boolean => {
    if (!user) return false;
    return user.department === department || user.role === 'Admin';
  };

  const isAdmin = (): boolean => {
    return user?.role === 'Admin';
  };

  const getDepartmentFromEmail = (email: string): 'Rolling Stock' | 'Signalling' | 'Telecom' | 'Maintenance' | 'Marketing' | 'Operations' | 'Cleaning' | 'Depot Control' => {
    if (email.includes('branding') || email.includes('marketing')) return 'Marketing';
    if (email.includes('operations')) return 'Operations';
    if (email.includes('cleaning')) return 'Cleaning';
    if (email.includes('depot')) return 'Depot Control';
    if (email.includes('maintenance')) return 'Maintenance';
    return 'Maintenance'; // default
  };

  const getDepartmentPermissions = (email: string): string[] => {
    const basePermissions = [];
    
    if (email.includes('fitness') || email.includes('maintenance')) {
      basePermissions.push(
        'fitness_certificates:read',
        'fitness_certificates:write',
        'job_cards:read',
        'job_cards:write'
      );
    }
    
    if (email.includes('branding') || email.includes('marketing')) {
      basePermissions.push(
        'branding_priorities:read',
        'branding_priorities:write'
      );
    }
    
    if (email.includes('operations')) {
      basePermissions.push(
        'mileage_logs:read',
        'mileage_logs:write'
      );
    }
    
    if (email.includes('cleaning')) {
      basePermissions.push(
        'cleaning_slots:read',
        'cleaning_slots:write'
      );
    }
    
    if (email.includes('depot')) {
      basePermissions.push(
        'stabling_geometry:read',
        'stabling_geometry:write'
      );
    }
    
    // Admin gets all permissions
    if (email.includes('admin')) {
      return [
        'fitness_certificates:read',
        'fitness_certificates:write',
        'job_cards:read',
        'job_cards:write',
        'branding_priorities:read',
        'branding_priorities:write',
        'mileage_logs:read',
        'mileage_logs:write',
        'cleaning_slots:read',
        'cleaning_slots:write',
        'stabling_geometry:read',
        'stabling_geometry:write',
        'train_management:read',
        'train_management:write',
        'supervisor_reviews:read',
        'supervisor_reviews:write',
        'parameters:read',
        'parameters:write',
        'alerts:read',
        'alerts:write',
        'simulation:read',
        'simulation:write',
        'reports:read',
        'reports:write',
        'live_map:read',
        'all_access:admin'
      ];
    }
    
    return basePermissions;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasDepartmentAccess,
    isAdmin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;