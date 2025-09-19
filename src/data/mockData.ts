import { Train, DepotBay, Alert, Parameter, Report, ScheduleActivity, AuditLog, OperationalPlan, SupervisorReview, ReviewWorkflow } from '../types';

export const mockTrains: Train[] = [
  {
    id: 'TRN001',
    status: 'Ready',
    fitnessValidity: new Date('2024-12-15'),
    jobCardStatus: 'Closed',
    brandingPriority: 'High',
    mileage: 15420,
    cleaningSlot: 'Slot A - 06:00',
    bayPosition: 'Bay 1',
    lastService: new Date('2024-01-10'),
    nextMaintenance: new Date('2024-02-15'),
    brandingHoursLeft: 48,
    brandingTarget: 120,
    mileageHistory: [
      { date: new Date('2024-01-08'), mileage: 15200 },
      { date: new Date('2024-01-09'), mileage: 15310 },
      { date: new Date('2024-01-10'), mileage: 15420 },
    ],
    coordinates: {
      lat: 10.0600,
      lng: 76.3200
    },
    depotName: 'Muttom Depot',
    rakeNumber: 'RAKE-001'
  },
  {
    id: 'TRN002',
    status: 'Maintenance',
    fitnessValidity: new Date('2024-11-20'),
    jobCardStatus: 'Open',
    brandingPriority: 'Medium',
    mileage: 18950,
    cleaningSlot: null,
    bayPosition: 'Bay 15',
    lastService: new Date('2024-01-05'),
    nextMaintenance: new Date('2024-01-25'),
    brandingHoursLeft: 85,
    brandingTarget: 100,
    mileageHistory: [
      { date: new Date('2024-01-05'), mileage: 18720 },
      { date: new Date('2024-01-06'), mileage: 18835 },
      { date: new Date('2024-01-07'), mileage: 18950 },
    ],
    coordinates: {
      lat: 10.0595,
      lng: 76.3205
    },
    depotName: 'Muttom Depot',
    rakeNumber: 'RAKE-002'
  },
  {
    id: 'TRN003',
    status: 'Standby',
    fitnessValidity: new Date('2025-03-10'),
    jobCardStatus: 'Closed',
    brandingPriority: 'Low',
    mileage: 12300,
    cleaningSlot: 'Slot B - 14:00',
    bayPosition: 'Bay 3',
    lastService: new Date('2024-01-12'),
    nextMaintenance: new Date('2024-03-12'),
    brandingHoursLeft: 15,
    brandingTarget: 80,
    mileageHistory: [
      { date: new Date('2024-01-10'), mileage: 12080 },
      { date: new Date('2024-01-11'), mileage: 12190 },
      { date: new Date('2024-01-12'), mileage: 12300 },
    ],
    coordinates: {
      lat: 10.0525,
      lng: 76.3146
    },
    depotName: 'Muttom Depot',
    rakeNumber: 'RAKE-003'
  },
  {
    id: 'TRN004',
    status: 'Cleaning',
    fitnessValidity: new Date('2024-10-30'),
    jobCardStatus: 'Closed',
    brandingPriority: 'High',
    mileage: 21500,
    cleaningSlot: 'Slot C - 10:00',
    bayPosition: 'Bay 8',
    lastService: new Date('2024-01-08'),
    nextMaintenance: new Date('2024-02-08'),
    brandingHoursLeft: 95,
    brandingTarget: 150,
    mileageHistory: [
      { date: new Date('2024-01-06'), mileage: 21260 },
      { date: new Date('2024-01-07'), mileage: 21380 },
      { date: new Date('2024-01-08'), mileage: 21500 },
    ],
    coordinates: {
      lat: 10.0456,
      lng: 76.3098
    },
    depotName: 'Muttom Depot',
    rakeNumber: 'RAKE-004'
  },
  {
    id: 'TRN005',
    status: 'Ready',
    fitnessValidity: new Date('2025-01-15'),
    jobCardStatus: 'Closed',
    brandingPriority: 'Medium',
    mileage: 14750,
    cleaningSlot: 'Slot A - 18:00',
    bayPosition: 'Bay 2',
    lastService: new Date('2024-01-15'),
    nextMaintenance: new Date('2024-04-15'),
    brandingHoursLeft: 60,
    brandingTarget: 110,
    mileageHistory: [
      { date: new Date('2024-01-13'), mileage: 14520 },
      { date: new Date('2024-01-14'), mileage: 14635 },
      { date: new Date('2024-01-15'), mileage: 14750 },
    ],
    coordinates: {
      lat: 10.0256,
      lng: 76.3012
    },
    depotName: 'Muttom Depot',
    rakeNumber: 'RAKE-005'
  },
];

// Generate more trains to reach 25 total
const generateAdditionalTrains = (): Train[] => {
  const statuses: Train['status'][] = ['Ready', 'Standby', 'Maintenance', 'Cleaning'];
  const priorities: Train['brandingPriority'][] = ['High', 'Medium', 'Low'];
  const jobStatuses: Train['jobCardStatus'][] = ['Open', 'Closed'];
  
  // Metro stations coordinates for realistic train positioning
  const metroStations = [
    { lat: 10.1102, lng: 76.3530 }, // Aluva
    { lat: 10.0987, lng: 76.3445 }, // Pulinchode
    { lat: 10.0856, lng: 76.3365 }, // Companypady
    { lat: 10.0721, lng: 76.3281 }, // Ambattukavu
    { lat: 10.0598, lng: 76.3203 }, // Muttom (Depot)
    { lat: 10.0525, lng: 76.3146 }, // Kalamassery
    { lat: 10.0456, lng: 76.3098 }, // CUSAT
    { lat: 10.0389, lng: 76.3043 }, // Pathadipalam
    { lat: 10.0256, lng: 76.3012 }, // Edapally
    { lat: 10.0156, lng: 76.2987 }, // Changampuzha Park
    { lat: 10.0045, lng: 76.2945 }, // Palarivattom
    { lat: 9.9934, lng: 76.2891 },  // JLN Stadium
    { lat: 9.9823, lng: 76.2834 },  // Kaloor
    { lat: 9.9712, lng: 76.2789 },  // Lissie
    { lat: 9.9612, lng: 76.2743 },  // MG Road
    { lat: 9.9534, lng: 76.2701 },  // Maharajas
    { lat: 9.9456, lng: 76.2658 },  // Ernakulam South
    { lat: 9.9378, lng: 76.2612 },  // Kadavanthra
    { lat: 9.9298, lng: 76.2567 },  // Elamkulam
    { lat: 9.9218, lng: 76.2523 },  // Vyttila
  ];
  
  const additionalTrains: Train[] = [];
  
  for (let i = 6; i <= 25; i++) {
    const trainId = `TRN${i.toString().padStart(3, '0')}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const jobStatus = jobStatuses[Math.floor(Math.random() * jobStatuses.length)];
    const mileage = Math.floor(Math.random() * 15000) + 10000;
    const brandingTarget = Math.floor(Math.random() * 100) + 80;
    const brandingHoursLeft = Math.floor(Math.random() * brandingTarget);
    
    // Pick a random metro station and add small offset
    const baseStation = metroStations[Math.floor(Math.random() * metroStations.length)];
    const latOffset = (Math.random() - 0.5) * 0.01; // ±0.005° (~550m)
    const lngOffset = (Math.random() - 0.5) * 0.01; // ±0.005° (~550m)
    
    additionalTrains.push({
      id: trainId,
      status,
      fitnessValidity: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
      jobCardStatus: jobStatus,
      brandingPriority: priority,
      mileage,
      cleaningSlot: Math.random() > 0.3 ? `Slot ${String.fromCharCode(65 + Math.floor(Math.random() * 3))} - ${Math.floor(Math.random() * 12) + 6}:00` : null,
      bayPosition: `Bay ${i}`,
      lastService: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
      brandingHoursLeft,
      brandingTarget,
      coordinates: {
        lat: baseStation.lat + latOffset,
        lng: baseStation.lng + lngOffset
      },
      depotName: 'Muttom Depot',
      rakeNumber: `RAKE-${(i + 120).toString()}`,
      mileageHistory: [
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), mileage: mileage - 220 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), mileage: mileage - 110 },
        { date: new Date(), mileage },
      ],
    });
  }
  
  return additionalTrains;
};

export const allTrains: Train[] = [...mockTrains, ...generateAdditionalTrains()];

export const mockDepotBays: DepotBay[] = Array.from({ length: 40 }, (_, i) => ({
  id: `bay-${i + 1}`,
  number: i + 1,
  occupied: i < 25,
  trainId: i < 25 ? allTrains[i]?.id : undefined,
  type: i < 10 ? 'Service' : i < 20 ? 'Maintenance' : i < 30 ? 'Cleaning' : 'Storage',
}));

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'fitness_expired',
    severity: 'high',
    title: 'Fitness Certificate Expired',
    description: 'Train TRN004 fitness certificate expired yesterday',
    trainId: 'TRN004',
    timestamp: new Date('2024-01-13'),
  },
  {
    id: 'alert-2',
    type: 'job_card_pending',
    severity: 'medium',
    title: 'Job Card Pending',
    description: 'Train TRN002 has open job card for brake inspection',
    trainId: 'TRN002',
    timestamp: new Date('2024-01-14'),
  },
  {
    id: 'alert-3',
    type: 'branding_sla',
    severity: 'medium',
    title: 'Branding SLA Risk',
    description: 'High priority branding train not in service for 8 hours',
    trainId: 'TRN001',
    timestamp: new Date('2024-01-14'),
  },
  {
    id: 'alert-4',
    type: 'mileage_uneven',
    severity: 'low',
    title: 'Mileage Imbalance',
    description: 'Mileage difference between trains exceeds 5000 km threshold',
    timestamp: new Date('2024-01-14'),
  },
];

export const mockParameters: Parameter[] = [
  {
    id: 'param-1',
    name: 'Valid Fitness Certificates',
    category: 'fitness',
    status: 'warning',
    value: '22/25',
    description: '3 trains have expired or expiring fitness certificates',
    lastUpdated: new Date('2024-01-14'),
  },
  {
    id: 'param-2',
    name: 'Open Job Cards',
    category: 'job_card',
    status: 'normal',
    value: 3,
    description: '3 active job cards pending completion',
    lastUpdated: new Date('2024-01-14'),
  },
  {
    id: 'param-3',
    name: 'High Priority Branding',
    category: 'branding',
    status: 'critical',
    value: '4 hours remaining',
    description: 'Critical branding SLA deadline approaching',
    lastUpdated: new Date('2024-01-14'),
  },
  {
    id: 'param-4',
    name: 'Mileage Balance',
    category: 'mileage',
    status: 'warning',
    value: '8,200 km spread',
    description: 'Large mileage variation between highest and lowest',
    lastUpdated: new Date('2024-01-14'),
  },
  {
    id: 'param-5',
    name: 'Available Cleaning Slots',
    category: 'cleaning',
    status: 'normal',
    value: '12/16',
    description: '4 cleaning slots still available today',
    lastUpdated: new Date('2024-01-14'),
  },
  {
    id: 'param-6',
    name: 'Depot Bay Occupancy',
    category: 'stabling',
    status: 'normal',
    value: '25/40',
    description: '15 bays available for expansion',
    lastUpdated: new Date('2024-01-14'),
  },
];

export const mockReports: Report[] = [
  {
    id: 'report-1',
    title: 'Daily Induction Plan - January 14, 2024',
    type: 'daily_plan',
    generatedDate: new Date('2024-01-14'),
    downloadUrl: '/reports/daily-plan-2024-01-14.pdf',
  },
  {
    id: 'report-2',
    title: 'Weekly Summary - Week 2, January 2024',
    type: 'weekly_summary',
    generatedDate: new Date('2024-01-13'),
    downloadUrl: '/reports/weekly-summary-2024-w2.pdf',
  },
  {
    id: 'report-3',
    title: 'Monthly Report - December 2023',
    type: 'monthly_report',
    generatedDate: new Date('2024-01-01'),
    downloadUrl: '/reports/monthly-report-2023-12.pdf',
  },
];

export const mockScheduleActivities: ScheduleActivity[] = [
  {
    id: 'schedule-1',
    trainId: 'TRN001',
    type: 'cleaning',
    startTime: '22:00',
    endTime: '01:00',
    staffAssigned: 'Team A - Ramesh Kumar',
    description: 'Deep cleaning and sanitization',
  },
  {
    id: 'schedule-2',
    trainId: 'TRN002',
    type: 'maintenance',
    startTime: '23:30',
    endTime: '04:30',
    staffAssigned: 'Tech Team B - Suresh Nair',
    description: 'Brake system inspection and repair',
  },
  {
    id: 'schedule-3',
    trainId: 'TRN003',
    type: 'induction',
    startTime: '06:00',
    endTime: '06:00',
    description: 'Ready for morning service',
  },
  {
    id: 'schedule-4',
    trainId: 'TRN004',
    type: 'cleaning',
    startTime: '21:15',
    endTime: '23:45',
    staffAssigned: 'Team C - Vineeth Jose',
    description: 'Interior and exterior cleaning',
  },
  {
    id: 'schedule-5',
    trainId: 'TRN005',
    type: 'maintenance',
    startTime: '00:00',
    endTime: '03:00',
    staffAssigned: 'Tech Team A - Arun Pillai',
    description: 'Routine maintenance check',
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: new Date('2024-01-14T14:30:00'),
    userId: 'admin@kmrl.com',
    action: 'Status Override',
    target: 'TRN007',
    previousValue: 'Maintenance',
    newValue: 'Ready',
    reason: 'Emergency deployment required',
  },
  {
    id: 'audit-2',
    timestamp: new Date('2024-01-14T13:45:00'),
    userId: 'operator@kmrl.com',
    action: 'Data Upload',
    target: 'Train Fleet Data',
    description: 'Updated mileage data from Excel import',
  },
  {
    id: 'audit-3',
    timestamp: new Date('2024-01-14T12:15:00'),
    userId: 'supervisor@kmrl.com',
    action: 'Manual Override',
    target: 'TRN012',
    previousValue: 'Standby',
    newValue: 'Maintenance',
    reason: 'Unusual noise reported by operator',
  },
];

// Supervisor Review Mock Data
export const mockOperationalPlans: OperationalPlan[] = [
  {
    id: 'PLAN-001',
    title: 'Weekly Maintenance Schedule Optimization',
    type: 'Maintenance Schedule',
    description: 'Optimize maintenance schedule to reduce downtime and improve train availability during peak hours',
    proposedBy: 'maintenance@kmrl.kerala.gov.in',
    proposedDate: new Date('2024-09-18'),
    expectedImplementation: new Date('2024-09-25'),
    priority: 'High',
    estimatedCost: 50000,
    affectedTrains: ['TRN001', 'TRN005', 'TRN012'],
    affectedRoutes: ['Aluva-Pettah', 'Kalamassery-Edappally'],
    resourceRequirements: ['3 Maintenance Teams', 'Spare Parts', '2 Days Downtime'],
    riskAssessment: 'Low',
    status: 'Pending Review',
    createdAt: new Date('2024-09-18T09:00:00'),
    updatedAt: new Date('2024-09-18T09:00:00'),
  },
  {
    id: 'PLAN-002',
    title: 'Emergency Route Diversion Protocol',
    type: 'Emergency Protocol',
    description: 'Implement new route diversion protocol for emergency situations to minimize passenger disruption',
    proposedBy: 'operations@kmrl.kerala.gov.in',
    proposedDate: new Date('2024-09-17'),
    expectedImplementation: new Date('2024-09-22'),
    priority: 'High',
    estimatedCost: 25000,
    affectedTrains: ['TRN003', 'TRN008', 'TRN015'],
    affectedRoutes: ['All Main Routes'],
    resourceRequirements: ['Control Room Upgrade', 'Staff Training', 'Communication Systems'],
    riskAssessment: 'Medium',
    status: 'Under Review',
    createdAt: new Date('2024-09-17T14:30:00'),
    updatedAt: new Date('2024-09-19T10:15:00'),
  },
  {
    id: 'PLAN-003',
    title: 'Peak Hour Train Assignment Rebalancing',
    type: 'Train Assignment',
    description: 'Reassign trains during peak hours to improve passenger capacity and reduce waiting times',
    proposedBy: 'operations@kmrl.kerala.gov.in',
    proposedDate: new Date('2024-09-16'),
    expectedImplementation: new Date('2024-09-30'),
    priority: 'Medium',
    estimatedCost: 15000,
    affectedTrains: ['TRN002', 'TRN007', 'TRN011', 'TRN018'],
    affectedRoutes: ['Aluva-Pettah', 'Kakkanad-Palarivattom'],
    resourceRequirements: ['Schedule Coordination', 'Driver Reassignment'],
    riskAssessment: 'Low',
    status: 'Approved',
    createdAt: new Date('2024-09-16T11:20:00'),
    updatedAt: new Date('2024-09-18T16:45:00'),
  },
  {
    id: 'PLAN-004',
    title: 'Cleaning Crew Resource Optimization',
    type: 'Resource Allocation',
    description: 'Optimize cleaning crew allocation to improve efficiency and reduce operational costs',
    proposedBy: 'cleaning@kmrl.kerala.gov.in',
    proposedDate: new Date('2024-09-15'),
    expectedImplementation: new Date('2024-09-28'),
    priority: 'Low',
    estimatedCost: 8000,
    affectedTrains: ['All Active Trains'],
    affectedRoutes: ['All Depots'],
    resourceRequirements: ['Staff Reallocation', 'Equipment Redistribution'],
    riskAssessment: 'Low',
    status: 'Rejected',
    createdAt: new Date('2024-09-15T13:10:00'),
    updatedAt: new Date('2024-09-17T09:30:00'),
  },
  {
    id: 'PLAN-005',
    title: 'Critical Infrastructure Upgrade Override',
    type: 'Emergency Protocol',
    description: 'Emergency override for infrastructure upgrade that cannot wait for standard approval process',
    proposedBy: 'admin@kmrl.kerala.gov.in',
    proposedDate: new Date('2024-09-19'),
    expectedImplementation: new Date('2024-09-20'),
    priority: 'High',
    estimatedCost: 150000,
    affectedTrains: ['TRN010', 'TRN014', 'TRN020'],
    affectedRoutes: ['Edappally-Palarivattom'],
    resourceRequirements: ['Emergency Contractors', 'Safety Equipment', 'Service Suspension'],
    riskAssessment: 'High',
    status: 'Override Applied',
    createdAt: new Date('2024-09-19T08:00:00'),
    updatedAt: new Date('2024-09-19T08:30:00'),
  },
];

export const mockSupervisorReviews: SupervisorReview[] = [
  {
    id: 'REV-001',
    planId: 'PLAN-002',
    reviewerId: 'supervisor-001',
    reviewerName: 'Rajesh Kumar',
    reviewDate: new Date('2024-09-19T10:15:00'),
    decision: 'Pending',
    comments: 'Protocol looks comprehensive, reviewing technical feasibility',
    reviewDuration: 25,
    createdAt: new Date('2024-09-19T09:50:00'),
    updatedAt: new Date('2024-09-19T10:15:00'),
  },
  {
    id: 'REV-002',
    planId: 'PLAN-003',
    reviewerId: 'supervisor-002',
    reviewerName: 'Priya Menon',
    reviewDate: new Date('2024-09-18T16:45:00'),
    decision: 'Approved',
    comments: 'Excellent proposal. The rebalancing will significantly improve passenger experience during peak hours.',
    reviewDuration: 45,
    createdAt: new Date('2024-09-18T16:00:00'),
    updatedAt: new Date('2024-09-18T16:45:00'),
  },
  {
    id: 'REV-003',
    planId: 'PLAN-004',
    reviewerId: 'supervisor-003',
    reviewerName: 'Arun Nair',
    reviewDate: new Date('2024-09-17T09:30:00'),
    decision: 'Rejected',
    comments: 'Cost-benefit analysis does not justify the proposed changes. Current system is adequate.',
    suggestedChanges: 'Consider smaller scale pilot program first',
    reviewDuration: 30,
    createdAt: new Date('2024-09-17T09:00:00'),
    updatedAt: new Date('2024-09-17T09:30:00'),
  },
  {
    id: 'REV-004',
    planId: 'PLAN-005',
    reviewerId: 'supervisor-001',
    reviewerName: 'Rajesh Kumar',
    reviewDate: new Date('2024-09-19T08:30:00'),
    decision: 'Override',
    comments: 'Emergency situation requires immediate action despite standard protocol concerns.',
    overrideReason: 'Safety critical infrastructure failure detected. Immediate intervention required to prevent service disruption.',
    reviewDuration: 15,
    createdAt: new Date('2024-09-19T08:15:00'),
    updatedAt: new Date('2024-09-19T08:30:00'),
  },
];

export const mockReviewWorkflows: ReviewWorkflow[] = [
  {
    planId: 'PLAN-001',
    currentStage: 'Initial Review',
    reviewHistory: [],
    nextReviewers: ['supervisor-001', 'supervisor-002'],
    escalationRequired: false,
    deadlineDate: new Date('2024-09-22'),
  },
  {
    planId: 'PLAN-002',
    currentStage: 'Technical Assessment',
    reviewHistory: [mockSupervisorReviews[0]],
    nextReviewers: ['technical-lead-001'],
    escalationRequired: false,
    deadlineDate: new Date('2024-09-21'),
  },
  {
    planId: 'PLAN-003',
    currentStage: 'Implementation',
    reviewHistory: [mockSupervisorReviews[1]],
    nextReviewers: [],
    escalationRequired: false,
    deadlineDate: new Date('2024-09-30'),
  },
];