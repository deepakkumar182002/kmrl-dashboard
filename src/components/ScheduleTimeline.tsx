import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { mockScheduleActivities } from '../data/mockData';
import { ScheduleActivity } from '../types';

interface TimeMarker {
  hour: number;
  displayTime: string;
  position: number;
}

interface ActivityBarProps {
  activity: ScheduleActivity;
  onActivityClick: (activity: ScheduleActivity) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activity, onActivityClick }) => {
  const getActivityColor = (type: ScheduleActivity['type']) => {
    switch (type) {
      case 'cleaning':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'maintenance':
        return 'bg-red-500 hover:bg-red-600';
      case 'induction':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const timeToPosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;
    
    // Handle overnight schedule (21:00 to 06:00)
    if (hours >= 21) {
      totalMinutes = totalMinutes - 21 * 60; // Start from 21:00 (9 PM)
    } else if (hours <= 6) {
      totalMinutes = totalMinutes + (24 - 21) * 60; // After midnight
    }
    
    // Convert to percentage (9 hours total: 21:00 to 06:00)
    return (totalMinutes / (9 * 60)) * 100;
  };

  const getBarWidth = () => {
    const startPos = timeToPosition(activity.startTime);
    const endPos = timeToPosition(activity.endTime);
    return Math.abs(endPos - startPos);
  };

  return (
    <div
      className={`absolute h-6 ${getActivityColor(activity.type)} rounded cursor-pointer transition-colors text-white text-xs flex items-center px-2`}
      style={{
        left: `${timeToPosition(activity.startTime)}%`,
        width: `${getBarWidth()}%`,
      }}
      onClick={() => onActivityClick(activity)}
      title={`${activity.type} - ${activity.startTime} to ${activity.endTime}`}
    >
      <span className="truncate">{activity.type}</span>
    </div>
  );
};

interface ActivityModalProps {
  activity: ScheduleActivity | null;
  onClose: () => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Activity Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Train ID:</span>
            <span className="font-medium">{activity.trainId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Activity Type:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              activity.type === 'cleaning' ? 'bg-blue-100 text-blue-700' :
              activity.type === 'maintenance' ? 'bg-red-100 text-red-700' :
              'bg-green-100 text-green-700'
            }`}>
              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{activity.startTime} - {activity.endTime}</span>
          </div>
          
          {activity.staffAssigned && (
            <div className="flex justify-between">
              <span className="text-gray-600">Staff:</span>
              <span className="font-medium">{activity.staffAssigned}</span>
            </div>
          )}
          
          <div className="pt-2">
            <span className="text-gray-600">Description:</span>
            <p className="text-gray-900 mt-1">{activity.description}</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ScheduleTimeline: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<ScheduleActivity | null>(null);

  // Generate time markers for the timeline (9 PM to 6 AM)
  const timeMarkers: TimeMarker[] = [];
  for (let hour = 21; hour <= 30; hour++) { // 21-23 (9PM-11PM), 24-30 (12AM-6AM)
    const displayHour = hour > 23 ? hour - 24 : hour;
    const ampm = hour >= 24 ? 'AM' : 'PM';
    const displayTime = `${displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour}:00 ${ampm}`;
    timeMarkers.push({
      hour,
      displayTime,
      position: ((hour - 21) / 9) * 100,
    });
  }

  // Get unique trains that have activities
  const trainsWithActivities = Array.from(
    new Set(mockScheduleActivities.map(activity => activity.trainId))
  ).sort();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Night Schedule Timeline</h3>
          <p className="text-sm text-gray-600">9:00 PM to 6:00 AM operational schedule</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Cleaning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Ready for Induction</span>
          </div>
        </div>
      </div>

      {/* Timeline Header */}
      <div className="relative mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          {timeMarkers.map((marker) => (
            <div key={marker.hour} style={{ position: 'absolute', left: `${marker.position}%` }}>
              {marker.displayTime}
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-300 mt-6"></div>
      </div>

      {/* Timeline Content */}
      <div className="space-y-4">
        {trainsWithActivities.map((trainId) => {
          const trainActivities = mockScheduleActivities.filter(
            activity => activity.trainId === trainId
          );
          
          return (
            <div key={trainId} className="relative">
              <div className="flex items-center mb-2">
                <div className="w-20 text-sm font-medium text-gray-900">{trainId}</div>
                <div className="flex-1 relative h-8 bg-gray-100 rounded">
                  {/* Time grid lines */}
                  {timeMarkers.map((marker) => (
                    <div
                      key={marker.hour}
                      className="absolute top-0 bottom-0 w-px bg-gray-200"
                      style={{ left: `${marker.position}%` }}
                    ></div>
                  ))}
                  
                  {/* Activity bars */}
                  {trainActivities.map((activity) => (
                    <ActivityBar
                      key={activity.id}
                      activity={activity}
                      onActivityClick={setSelectedActivity}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Interactive Timeline</p>
            <p>Click on any activity bar to view detailed information including staff assignments and task descriptions. The timeline shows overnight operations from 9:00 PM to 6:00 AM.</p>
          </div>
        </div>
      </div>

      {/* Activity Details Modal */}
      <ActivityModal 
        activity={selectedActivity} 
        onClose={() => setSelectedActivity(null)} 
      />
    </div>
  );
};

export default ScheduleTimeline;