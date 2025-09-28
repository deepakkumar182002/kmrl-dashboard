import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Activity,
  Cpu,
  Network,
  BarChart3,
  Loader
} from 'lucide-react';
import { AIEngineData, AIInsight, AIInductionPlan } from '../types';
import NeuralNetwork from './NeuralNetwork';

interface AIEngineProps {
  onSimulationStart: () => void;
  isSimulating: boolean;
}

const AIEngine: React.FC<AIEngineProps> = ({ onSimulationStart, isSimulating }) => {
  const [aiData, setAIData] = useState<AIEngineData>({
    confidence: 97.5,
    processingActive: true,
    suggestions: [],
    predictions: [],
    anomalies: [],
    smartSchedule: [],
    lastUpdate: new Date(),
    dataFlow: {
      fitness: { status: 'active', lastSync: new Date(), dataPoints: 28 }, // Total fitness certificates
      jobCards: { status: 'active', lastSync: new Date(), dataPoints: 52 }, // Total job cards
      branding: { status: 'active', lastSync: new Date(), dataPoints: 22 }, // Total branding priorities
      mileage: { status: 'active', lastSync: new Date(), dataPoints: 184 }, // Total mileage logs
      cleaning: { status: 'active', lastSync: new Date(), dataPoints: 28 }, // Total cleaning slots
      stabling: { status: 'active', lastSync: new Date(), dataPoints: 36 } // Total stabling geometry
    }
  });

  // Mock AI insights and predictions
  useEffect(() => {
    const mockSuggestions: AIInsight[] = [
      {
        id: '1',
        type: 'suggestion',
        title: 'Address 5 Expiring Fitness Certificates',
        description: '5 fitness certificates expiring soon need immediate attention to maintain 23/28 active ratio.',
        confidence: 98,
        priority: 'high',
        action: 'Schedule fitness renewals',
        trainId: 'Multiple',
        department: 'Fitness',
        timestamp: new Date(),
        data: { impact: '5 trains at risk' }
      },
      {
        id: '2',
        type: 'suggestion',
        title: 'Optimize 16 Pending Mileage Verifications',
        description: 'Process 16 pending mileage logs to improve verification efficiency from 91% to 95%.',
        confidence: 96,
        priority: 'medium',
        action: 'Verify pending logs',
        department: 'Mileage',
        timestamp: new Date(),
        data: { efficiency: '+4% improvement' }
      }
    ];

    const mockPredictions: AIInductionPlan[] = [
      {
        id: '1',
        trainId: 'T102',
        predictedInductionTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        confidence: 97,
        steps: [
          {
            id: '1',
            department: 'Fitness',
            task: 'Certificate Verification',
            estimatedDuration: 15,
            dependencies: [],
            status: 'completed',
            confidence: 99
          },
          {
            id: '2',
            department: 'Cleaning',
            task: 'Deep Clean & Sanitization',
            estimatedDuration: 45,
            dependencies: ['1'],
            status: 'in-progress',
            confidence: 95
          }
        ],
        totalDuration: 120,
        status: 'processing',
        generatedAt: new Date()
      }
    ];

    const mockAnomalies: AIInsight[] = [
      {
        id: '1',
        type: 'anomaly',
        title: 'Stabling Capacity Near Maximum',
        description: 'Current stabling occupancy at 32/36 (89%) - approaching full capacity threshold.',
        confidence: 94,
        priority: 'high',
        action: 'Plan capacity expansion',
        trainId: 'System-wide',
        department: 'Stabling',
        timestamp: new Date(),
        data: { occupancy: '89%' }
      }
    ];

    setAIData(prev => ({
      ...prev,
      suggestions: mockSuggestions,
      predictions: mockPredictions,
      anomalies: mockAnomalies,
      smartSchedule: mockPredictions
    }));

    // Simulate real-time confidence updates (95-100% range)
    const interval = setInterval(() => {
      setAIData(prev => ({
        ...prev,
        confidence: Math.max(95, Math.min(100, 95 + Math.random() * 5)), // Random between 95-100%
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 98) return 'text-emerald-600 bg-emerald-100';
    if (confidence >= 95) return 'text-green-600 bg-green-100';
    if (confidence >= 90) return 'text-blue-600 bg-blue-100';
    if (confidence >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-6 border border-indigo-200 shadow-lg">
      {/* AI Engine Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            {aiData.processingActive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Induction Engine
            </h2>
            <p className="text-sm text-gray-600">Intelligent Train Induction Planning</p>
          </div>
        </div>
        
        <button
          onClick={onSimulationStart}
          disabled={isSimulating}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            isSimulating
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'ai-glow text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-2 hover:scale-105 neural-pulse'
          }`}
        >
          {isSimulating ? (
            <span className="flex items-center space-x-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Simulating...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Run AI Simulation</span>
            </span>
          )}
        </button>
      </div>

      {/* Neural Network Visualization */}
      <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <Network className="w-4 h-4 mr-2 text-purple-600" />
          Neural Network Processing
        </h3>
        <div className="h-32 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200/50">
          <NeuralNetwork isActive={aiData.processingActive} className="w-full h-full" />
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-indigo-600" />
          Live Data Streams
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(aiData.dataFlow).map(([dept, data]) => (
            <div key={dept} className="flex items-center space-x-2 p-2 bg-white/80 rounded-lg data-flow">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(data.status)} neural-pulse`}></div>
              <span className="text-xs font-medium text-gray-700 capitalize">{dept}</span>
              <span className="text-xs text-gray-500">{data.dataPoints}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Outputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* AI Suggestions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
            AI Suggestions ({aiData.suggestions.length})
          </h3>
          <div className="space-y-3">
            {aiData.suggestions.slice(0, 2).map(suggestion => (
              <div key={suggestion.id} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {suggestion.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predicted Induction Time */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            Next Induction Prediction
          </h3>
          {aiData.predictions.length > 0 && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Train {aiData.predictions[0].trainId}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {aiData.predictions[0].confidence}% confidence
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {aiData.predictions[0].predictedInductionTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-xs text-gray-600">
                  Est. Duration: {aiData.predictions[0].totalDuration} minutes
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Anomaly Alerts */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
            Anomaly Alerts ({aiData.anomalies.length})
          </h3>
          <div className="space-y-3">
            {aiData.anomalies.slice(0, 2).map(anomaly => (
              <div key={anomaly.id} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{anomaly.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{anomaly.description}</p>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    {anomaly.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
            Optimized Schedule
          </h3>
          <div className="space-y-2">
            {aiData.smartSchedule.slice(0, 3).map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="text-sm font-medium text-gray-900">Train {plan.trainId}</span>
                <div className="text-right">
                  <div className="text-xs text-purple-600 font-medium">
                    {plan.predictedInductionTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-xs text-gray-500">{plan.totalDuration}min</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Confidence Meter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-indigo-600" />
            AI Confidence Level
          </h3>
          <span className="text-xs text-gray-500">
            Last updated: {aiData.lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4 ai-border-glow">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 confidence-pulse ${
                aiData.confidence >= 98 ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 shadow-lg shadow-emerald-400/60' :
                aiData.confidence >= 95 ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-lg shadow-green-400/50' :
                aiData.confidence >= 90 ? 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-400/50' :
                aiData.confidence >= 80 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-400/50' :
                'bg-gradient-to-r from-red-400 to-red-600 shadow-lg shadow-red-400/50'
              }`}
              style={{ width: `${aiData.confidence}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xl font-bold ${getConfidenceColor(aiData.confidence)} neural-pulse`}>
              AI Confidence: {aiData.confidence.toFixed(1)}%
            </span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Cpu className="w-4 h-4 animate-pulse" />
              <span className="data-flow">Neural Network Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEngine;