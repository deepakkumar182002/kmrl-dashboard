import React, { useState } from 'react';
import { Train, Shield, Users, Settings, BarChart3, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@kmrl.kerala.gov.in', department: 'All Access', icon: Settings, color: 'bg-purple-100 text-purple-600' },
    { role: 'Maintenance', email: 'maintenance@kmrl.kerala.gov.in', department: 'Fitness & Job Cards', icon: Shield, color: 'bg-green-100 text-green-600' },
    { role: 'Marketing', email: 'marketing@kmrl.kerala.gov.in', department: 'Branding Priorities', icon: BarChart3, color: 'bg-blue-100 text-blue-600' },
    { role: 'Operations', email: 'operations@kmrl.kerala.gov.in', department: 'Mileage Logs', icon: Train, color: 'bg-indigo-100 text-indigo-600' },
    { role: 'Cleaning', email: 'cleaning@kmrl.kerala.gov.in', department: 'Cleaning Slots', icon: Users, color: 'bg-pink-100 text-pink-600' },
    { role: 'Depot Control', email: 'depot@kmrl.kerala.gov.in', department: 'Stabling Geometry', icon: AlertTriangle, color: 'bg-cyan-100 text-cyan-600' }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-start min-h-full py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="w-full max-w-md mb-8 flex-shrink-0">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                  <Train className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">KMRL Control Center</h1>
              <p className="text-lg text-gray-600 mb-1">Metro Rail Management System</p>
            <p className="text-sm text-gray-500">AI-Driven Train Induction Planning & Scheduling</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">Sign in to your account</h2>
              <p className="text-sm text-gray-600 text-center mt-2">Access the train management dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>

        {/* Demo Accounts Section */}
        <div className="w-full max-w-4xl mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Existing Accounts</h3>
              <p className="text-sm text-gray-600">Use these existing accounts to explore different department features</p>
              <p className="text-xs text-gray-500 mt-1">Password for all accounts: <span className="font-mono bg-gray-100 px-2 py-1 rounded">demo123</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoAccounts.map((account, index) => {
                const IconComponent = account.icon;
                return (
                  <div 
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword('demo123');
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${account.color} group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{account.role}</h4>
                        <p className="text-xs text-gray-600 mt-1">{account.department}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{account.email}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">i</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">How to use existing accounts:</h4>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Click on any existing account card to auto-fill the login form</li>
                    <li>• Each account has specific department permissions</li>
                    <li>• Admin account has access to all features and management panels</li>
                    <li>• Other accounts can only access their department-specific features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Features Overview */}
        {/* <div className="w-full max-w-4xl mt-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Features</h3>
              <p className="text-sm text-gray-600">Comprehensive train management and scheduling platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Train className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Train Management</h4>
                <p className="text-xs text-gray-600">Real-time monitoring of 25+ trains with expansion to 40</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Safety & Compliance</h4>
                <p className="text-xs text-gray-600">Fitness certificates and safety protocol management</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Analytics & Reports</h4>
                <p className="text-xs text-gray-600">Comprehensive analytics with AI-driven insights</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Operations Control</h4>
                <p className="text-xs text-gray-600">Depot management and train positioning</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Staff Management</h4>
                <p className="text-xs text-gray-600">Role-based access and department coordination</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Alert System</h4>
                <p className="text-xs text-gray-600">Real-time conflict detection and notifications</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Footer */}
        <div className="w-full max-w-4xl text-center text-xs text-gray-500 mt-8 pb-8">
          <p>© 2024 Kochi Metro Rail Limited (KMRL) - AI-Driven Train Management System</p>
          <p className="mt-1">Developed for Smart India Hackathon 2024</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;