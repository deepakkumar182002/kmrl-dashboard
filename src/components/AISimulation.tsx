import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  Database,
  Brain,
  Target,
  Activity,
  X
} from 'lucide-react';

interface SimulationStep {
  id: string;
  department: string;
  task: string;
  status: 'pending' | 'processing' | 'completed';
  progress: number;
  duration: number;
  color: string;
  icon: string;
}

interface AISimulationProps {
  isActive: boolean;
  onComplete: () => void;
  onReset: () => void;
}

const AISimulation: React.FC<AISimulationProps> = ({ isActive, onComplete, onReset }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<SimulationStep[]>([
    {
      id: '1',
      department: 'Data Collection',
      task: 'Gathering department data streams',
      status: 'pending',
      progress: 0,
      duration: 2000,
      color: 'blue',
      icon: 'database'
    },
    {
      id: '2',
      department: 'Fitness Analysis',
      task: 'Processing fitness certificates',
      status: 'pending',
      progress: 0,
      duration: 1500,
      color: 'green',
      icon: 'shield'
    },
    {
      id: '3',
      department: 'Job Card Review',
      task: 'Analyzing maintenance records',
      status: 'pending',
      progress: 0,
      duration: 1800,
      color: 'orange',
      icon: 'wrench'
    },
    {
      id: '4',
      department: 'AI Processing',
      task: 'Neural network decision making',
      status: 'pending',
      progress: 0,
      duration: 2500,
      color: 'purple',
      icon: 'brain'
    },
    {
      id: '5',
      department: 'Schedule Generation',
      task: 'Optimizing induction timeline',
      status: 'pending',
      progress: 0,
      duration: 2000,
      color: 'indigo',
      icon: 'target'
    },
    {
      id: '6',
      department: 'Final Output',
      task: 'Generating recommendations',
      status: 'pending',
      progress: 0,
      duration: 1200,
      color: 'emerald',
      icon: 'check'
    }
  ]);

  useEffect(() => {
    if (isActive && isPlaying) {
      const interval = setInterval(() => {
        setSteps(prevSteps => {
          const newSteps = [...prevSteps];
          
          if (currentStep < newSteps.length) {
            const step = newSteps[currentStep];
            
            if (step.status === 'pending') {
              step.status = 'processing';
            }
            
            if (step.status === 'processing') {
              step.progress = Math.min(100, step.progress + 2);
              
              if (step.progress >= 100) {
                step.status = 'completed';
                setCurrentStep(prev => prev + 1);
              }
            }
          }
          
          // Calculate overall progress
          const totalProgress = newSteps.reduce((acc, step) => acc + step.progress, 0);
          setSimulationProgress(totalProgress / newSteps.length);
          
          // Check if simulation is complete
          if (newSteps.every(step => step.status === 'completed')) {
            setIsPlaying(false);
            setTimeout(() => {
              onComplete();
            }, 1000);
          }
          
          return newSteps;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isActive, isPlaying, currentStep, onComplete]);

  const handlePlayPause = () => {
    if (simulationProgress >= 100) {
      handleReset();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        status: 'pending',
        progress: 0
      }))
    );
    setCurrentStep(0);
    setSimulationProgress(0);
    setIsPlaying(false);
    onReset();
  };

  const getStepIcon = (iconType: string) => {
    switch (iconType) {
      case 'database': return <Database className="w-4 h-4" />;
      case 'brain': return <Brain className="w-4 h-4" />;
      case 'target': return <Target className="w-4 h-4" />;
      case 'check': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (step: SimulationStep) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-300' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-300' }
    };

    return colors[step.color as keyof typeof colors] || colors.blue;
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Induction Simulation
            </h2>
            <p className="text-gray-600">Intelligent decision-making process visualization</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onReset}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close Simulation"
            >
              <X className="w-5 h-5" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isPlaying
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  : simulationProgress >= 100
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : simulationProgress >= 100 ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Simulation Progress</span>
            <span className="text-sm font-bold text-gray-900">{simulationProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${simulationProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Simulation Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const colors = getStatusColor(step);
            const isActive = step.status === 'processing';
            const isCompleted = step.status === 'completed';
            
            return (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                )}
                
                <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                  isActive ? `${colors.bg} ${colors.border} shadow-lg scale-105` :
                  isCompleted ? 'bg-green-50 border-green-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  {/* Step Icon */}
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive ? colors.bg :
                    isCompleted ? 'bg-green-100' :
                    'bg-gray-100'
                  }`}>
                    <div className={`${
                      isActive ? colors.text :
                      isCompleted ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : getStepIcon(step.icon)}
                    </div>
                    
                    {isActive && (
                      <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-30"></div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold ${
                        isActive ? colors.text :
                        isCompleted ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {step.department}
                      </h3>
                      
                      {isActive && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-500">Processing...</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{step.task}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' :
                          isActive ? `bg-gradient-to-r from-${step.color}-400 to-${step.color}-600` :
                          'bg-gray-300'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <ArrowRight className={`w-5 h-5 ${
                      isCompleted ? 'text-green-500' :
                      isActive ? colors.text :
                      'text-gray-300'
                    }`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Neural Network Visualization */}
        {steps.some(step => step.status === 'processing' && step.department === 'AI Processing') && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Brain className="w-16 h-16 text-purple-600" />
                  <div className="absolute inset-0 rounded-full border-4 border-purple-300 animate-ping"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Neural Network Processing</h3>
              <p className="text-purple-600 text-sm">
                Analyzing patterns • Making intelligent decisions • Optimizing outcomes
              </p>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {simulationProgress >= 100 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-center space-x-3">
              <Zap className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">AI Simulation Complete!</h3>
                <p className="text-green-600 text-sm">
                  Intelligent induction plan generated with 89% confidence
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISimulation;