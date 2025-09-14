import React, { useState } from 'react';
import { Play, RotateCcw, Download, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { allTrains } from '../data/mockData';
import ScheduleTimeline from '../components/ScheduleTimeline';

const Simulation: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const readyTrains = allTrains.filter(train => train.status === 'Ready' || train.status === 'Standby');

  const runSimulation = async () => {
    if (!selectedTrain) return;

    setIsSimulating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock simulation results
    const remainingTrains = allTrains.filter(train => train.id !== selectedTrain);
    const removedTrain = allTrains.find(train => train.id === selectedTrain);
    
    const currentMetrics = {
      totalTrains: allTrains.length,
      readyTrains: allTrains.filter(t => t.status === 'Ready').length,
      avgMileage: allTrains.reduce((sum, t) => sum + t.mileage, 0) / allTrains.length,
      occupancy: 25,
    };

    const simulatedMetrics = {
      totalTrains: remainingTrains.length,
      readyTrains: remainingTrains.filter(t => t.status === 'Ready').length,
      avgMileage: remainingTrains.reduce((sum, t) => sum + t.mileage, 0) / remainingTrains.length,
      occupancy: 24,
    };

    const impactData = [
      { name: 'Total Trains', current: currentMetrics.totalTrains, simulated: simulatedMetrics.totalTrains },
      { name: 'Ready Trains', current: currentMetrics.readyTrains, simulated: simulatedMetrics.readyTrains },
      { name: 'Avg Mileage', current: Math.round(currentMetrics.avgMileage), simulated: Math.round(simulatedMetrics.avgMileage) },
      { name: 'Bay Occupancy', current: currentMetrics.occupancy, simulated: simulatedMetrics.occupancy },
    ];

    const timelineData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      current: Math.max(0, currentMetrics.readyTrains - Math.floor(Math.random() * 3)),
      simulated: Math.max(0, simulatedMetrics.readyTrains - Math.floor(Math.random() * 3)),
    }));

    setSimulationResult({
      removedTrain,
      currentMetrics,
      simulatedMetrics,
      impactData,
      timelineData,
      recommendations: [
        `Train ${selectedTrain} removal would reduce ready fleet by ${currentMetrics.readyTrains - simulatedMetrics.readyTrains} units`,
        `Average mileage would ${simulatedMetrics.avgMileage > currentMetrics.avgMileage ? 'increase' : 'decrease'} by ${Math.abs(Math.round(simulatedMetrics.avgMileage - currentMetrics.avgMileage))} km`,
        'Consider redistributing cleaning schedules to optimize remaining fleet',
        'Monitor branding priorities for affected routes',
      ],
    });

    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setSelectedTrain('');
    setSimulationResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Train Operations & Simulation</h1>
          <p className="text-gray-600">View operational schedule and analyze train induction scenarios</p>
        </div>
        {simulationResult && (
          <button
            onClick={resetSimulation}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Night Operations Timeline */}
      <ScheduleTimeline />

      {/* Divider */}
      <div className="border-t border-gray-200 my-8"></div>

      {/* Simulation Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Train Induction Simulation</h2>
        <p className="text-gray-600">Analyze "what-if" scenarios for train removal and scheduling impact</p>
      </div>

      {/* Simulation Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Train to Remove
            </label>
            <select
              value={selectedTrain}
              onChange={(e) => setSelectedTrain(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isSimulating}
            >
              <option value="">Choose a train...</option>
              {readyTrains.map((train) => (
                <option key={train.id} value={train.id}>
                  {train.id} - {train.status} - {train.mileage.toLocaleString()} km
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={runSimulation}
              disabled={!selectedTrain || isSimulating}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>{isSimulating ? 'Running Simulation...' : 'Run Simulation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isSimulating && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Running Simulation</h3>
          <p className="text-gray-600">Analyzing impact of removing {selectedTrain}...</p>
        </div>
      )}

      {/* Simulation Results */}
      {simulationResult && !isSimulating && (
        <div className="space-y-6">
          {/* Impact Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Simulation Results</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export Results</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {simulationResult.impactData.map((metric: any, index: number) => {
                const isIncrease = metric.simulated > metric.current;
                const difference = Math.abs(metric.simulated - metric.current);
                
                return (
                  <div key={index} className="text-center">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{metric.name}</h4>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-2xl font-bold text-gray-900">{metric.current}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl font-bold text-gray-900">{metric.simulated}</span>
                    </div>
                    <div className={`flex items-center justify-center space-x-1 text-sm ${
                      isIncrease ? 'text-warning-600' : 'text-success-600'
                    }`}>
                      {isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{difference} {isIncrease ? 'increase' : 'decrease'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metric Comparison */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Before vs After Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simulationResult.impactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="current" fill="#3b82f6" name="Current" />
                    <Bar dataKey="simulated" fill="#ef4444" name="Simulated" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Timeline Impact */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Operational Impact</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationResult.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="current" stroke="#3b82f6" name="Current" strokeWidth={2} />
                    <Line type="monotone" dataKey="simulated" stroke="#ef4444" name="Simulated" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              {simulationResult.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Plans */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Induction Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Plan A: Redistribute Load</h4>
                <p className="text-sm text-gray-600 mb-3">Increase service frequency for remaining trains</p>
                <div className="text-xs text-gray-500">
                  <div>• 4 trains take additional routes</div>
                  <div>• Cleaning intervals adjusted</div>
                  <div>• 95% capacity maintained</div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Plan B: Standby Activation</h4>
                <p className="text-sm text-gray-600 mb-3">Activate standby trains to fill gap</p>
                <div className="text-xs text-gray-500">
                  <div>• 2 standby trains activated</div>
                  <div>• Normal service maintained</div>
                  <div>• Higher operational cost</div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Plan C: Route Optimization</h4>
                <p className="text-sm text-gray-600 mb-3">Optimize routes to reduce train requirement</p>
                <div className="text-xs text-gray-500">
                  <div>• Peak hour adjustments</div>
                  <div>• 3 routes combined</div>
                  <div>• 90% coverage maintained</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;