import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import TopNavigation from './TopNavigation';
import SideNavigation from './SideNavigation';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import Dashboard from '../pages/Dashboard';
import TrainList from '../pages/TrainList';
import Parameters from '../pages/Parameters';
import Alerts from '../pages/Alerts';
import Simulation from '../pages/Simulation';
import Reports from '../pages/Reports';
import LiveMapPage from '../pages/LiveMapPage';
import SupervisorReviews from '../pages/SupervisorReviews';
import FitnessCertificatesManagement from '../pages/FitnessCertificatesManagement';
import JobCardsManagement from '../pages/JobCardsManagement';
import BrandingPrioritiesManagement from '../pages/BrandingPrioritiesManagement';
import MileageLogsManagement from '../pages/MileageLogsManagement';
import CleaningSlotsManagement from '../pages/CleaningSlotsManagement';
import StablingGeometryManagement from '../pages/StablingGeometryManagement';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <TopNavigation />
      <div className="flex flex-1 overflow-hidden">
        <SideNavigation />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Admin-only routes */}
              <Route 
                path="/trains" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <TrainList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/parameters" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Parameters />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Alerts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulation" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Simulation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/live-map" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <LiveMapPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/supervisor-reviews" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <SupervisorReviews />
                  </ProtectedRoute>
                } 
              />
              
              {/* Department-specific routes */}
              <Route 
                path="/fitness-certificates" 
                element={
                  <ProtectedRoute allowedDepartments={['Maintenance']}>
                    <FitnessCertificatesManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job-cards" 
                element={
                  <ProtectedRoute allowedDepartments={['Maintenance']}>
                    <JobCardsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/branding-priorities" 
                element={
                  <ProtectedRoute allowedDepartments={['Marketing']}>
                    <BrandingPrioritiesManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mileage-logs" 
                element={
                  <ProtectedRoute allowedDepartments={['Operations']}>
                    <MileageLogsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cleaning-slots" 
                element={
                  <ProtectedRoute allowedDepartments={['Cleaning']}>
                    <CleaningSlotsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/stabling-geometry" 
                element={
                  <ProtectedRoute allowedDepartments={['Depot Control']}>
                    <StablingGeometryManagement />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const Layout: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
};

export default Layout;