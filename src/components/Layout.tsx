import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import SideNavigation from './SideNavigation';
import Dashboard from '../pages/Dashboard';
import TrainList from '../pages/TrainList';
import Parameters from '../pages/Parameters';
import Alerts from '../pages/Alerts';
import Simulation from '../pages/Simulation';
import Reports from '../pages/Reports';
import LiveMapPage from '../pages/LiveMapPage';

const Layout: React.FC = () => {
  return (
    <Router>
      <div className="h-screen bg-gray-50 flex flex-col">
        <TopNavigation />
        <div className="flex flex-1 overflow-hidden">
          <SideNavigation />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/trains" element={<TrainList />} />
                <Route path="/parameters" element={<Parameters />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/live-map" element={<LiveMapPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default Layout;