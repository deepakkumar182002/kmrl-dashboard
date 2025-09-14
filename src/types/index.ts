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