export interface Train {
  id: string;
  status: 'Ready' | 'Standby' | 'Maintenance' | 'Cleaning';
  fitnessValidity: Date;
  jobCardStatus: 'Open' | 'Closed';
  brandingPriority: 'High' | 'Medium' | 'Low';
  mileage: number;
  cleaningSlot: string | null;
  bayPosition: string;
  lastService: Date;
  nextMaintenance: Date;
  brandingHoursLeft: number;
  brandingTarget: number;
  mileageHistory: Array<{ date: Date; mileage: number }>;
  coordinates: {
    lat: number;
    lng: number;
  };
  depotName: string;
  rakeNumber: string;
}

export interface DepotBay {
  id: string;
  number: number;
  occupied: boolean;
  trainId?: string;
  type: 'Service' | 'Maintenance' | 'Cleaning' | 'Storage';
}

export interface Alert {
  id: string;
  type: 'fitness_expired' | 'job_card_pending' | 'branding_sla' | 'mileage_uneven';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  trainId?: string;
  timestamp: Date;
}

export interface Parameter {
  id: string;
  name: string;
  category: 'fitness' | 'job_card' | 'branding' | 'mileage' | 'cleaning' | 'stabling';
  status: 'normal' | 'warning' | 'critical';
  value: string | number;
  description: string;
  lastUpdated: Date;
}

export interface Report {
  id: string;
  title: string;
  type: 'daily_plan' | 'weekly_summary' | 'monthly_report';
  generatedDate: Date;
  downloadUrl: string;
}

export interface ScheduleActivity {
  id: string;
  trainId: string;
  type: 'cleaning' | 'maintenance' | 'induction';
  startTime: string; // HH:mm format
  endTime: string;
  staffAssigned?: string;
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  target: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  description?: string;
}

// Management Panel Interfaces
export interface FitnessCertificate {
  id: string;
  trainId: string;
  department: 'Rolling Stock' | 'Signalling' | 'Telecom';
  validFrom: Date;
  validUntil: Date;
  status: 'Fit' | 'Not Fit';
  issuedBy: string;
  certificateNumber: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobCard {
  id: string;
  jobId: string;
  trainId: string;
  taskDescription: string;
  status: 'Open' | 'Closed' | 'In Progress';
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  department: string;
  estimatedHours: number;
  actualHours?: number;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandingPriority {
  id: string;
  trainId: string;
  brandingContractId: string;
  advertiserName: string;
  requiredExposureHours: number;
  startDate: Date;
  endDate: Date;
  currentExposureHours: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Completed' | 'Pending' | 'Cancelled';
  contractValue: number;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MileageLog {
  id: string;
  trainId: string;
  date: Date;
  cumulativeKmReading: number;
  dailyKm: number;
  route: string;
  recordedBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CleaningSlot {
  id: string;
  bayId: string;
  slotStartTime: string; // HH:mm format
  slotEndTime: string; // HH:mm format
  assignedTrainId?: string;
  manpowerAvailable: number;
  manpowerAssigned: number;
  cleaningType: 'Basic' | 'Deep' | 'Maintenance';
  status: 'Available' | 'Occupied' | 'Maintenance';
  supervisor: string;
  date: Date;
  completionStatus?: 'Pending' | 'In Progress' | 'Completed';
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StablingGeometry {
  id: string;
  bayId: string;
  trainId?: string;
  position: number; // 1, 2, 3... order in the bay
  bayType: 'Service' | 'Maintenance' | 'Cleaning' | 'Storage';
  capacity: number;
  currentOccupancy: number;
  isAvailable: boolean;
  assignedAt?: Date;
  expectedDeparture?: Date;
  priority: 'High' | 'Medium' | 'Low';
  remarks?: string;
  coordinateX: number;
  coordinateY: number;
  createdAt: Date;
  updatedAt: Date;
}

// Supervisor Review Interfaces
export interface OperationalPlan {
  id: string;
  title: string;
  type: 'Maintenance Schedule' | 'Train Assignment' | 'Route Optimization' | 'Resource Allocation' | 'Emergency Protocol';
  description: string;
  proposedBy: string;
  proposedDate: Date;
  expectedImplementation: Date;
  priority: 'High' | 'Medium' | 'Low';
  estimatedCost?: number;
  affectedTrains: string[];
  affectedRoutes: string[];
  resourceRequirements: string[];
  riskAssessment: 'Low' | 'Medium' | 'High';
  status: 'Pending Review' | 'Under Review' | 'Approved' | 'Rejected' | 'Override Applied';
  createdAt: Date;
  updatedAt: Date;
}

export interface SupervisorReview {
  id: string;
  planId: string;
  reviewerId: string;
  reviewerName: string;
  reviewDate: Date;
  decision: 'Pending' | 'Approved' | 'Rejected' | 'Override';
  comments: string;
  suggestedChanges?: string;
  overrideReason?: string;
  reviewDuration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWorkflow {
  planId: string;
  currentStage: 'Initial Review' | 'Technical Assessment' | 'Final Approval' | 'Implementation';
  reviewHistory: SupervisorReview[];
  nextReviewers: string[];
  escalationRequired: boolean;
  deadlineDate: Date;
}

// User and Authentication Interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Operator';
  department: 'Rolling Stock' | 'Signalling' | 'Telecom' | 'Maintenance' | 'Marketing' | 'Operations' | 'Cleaning' | 'Depot Control';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasDepartmentAccess: (department: string) => boolean;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
}