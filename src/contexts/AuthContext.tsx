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
    // Simulate loading user from localStorage or API
    const mockUser: User = {
      id: '1',
      username: 'john.doe',
      email: 'john.doe@kmrl.kerala.gov.in',
      department: 'Maintenance',
      role: 'Supervisor',
      permissions: [
        'fitness_certificates:read',
        'fitness_certificates:write',
        'job_cards:read',
        'job_cards:write',
        'mileage_logs:read',
        'cleaning_slots:read',
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
      const mockUser: User = {
        id: '1',
        username: email.split('@')[0],
        email,
        department: email.includes('marketing') ? 'Marketing' : 
                   email.includes('operations') ? 'Operations' :
                   email.includes('cleaning') ? 'Cleaning' :
                   email.includes('depot') ? 'Depot Control' : 'Maintenance',
        role: 'Supervisor',
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
    
    if (email.includes('marketing')) {
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
      basePermissions.push(
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
        'stabling_geometry:write'
      );
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
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;