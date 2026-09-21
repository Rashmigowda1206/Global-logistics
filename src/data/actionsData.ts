import { ActionTask, PriorityMatrixItem } from '../types/logistics';

export const INITIAL_TASKS: ActionTask[] = [
  {
    id: 'act-001',
    title: 'Investigate West Africa Port Congestion',
    column: 'CRITICAL',
    impact: 'CRITICAL',
    affectedShipments: 380,
    recommendedAction: 'Engage local feeder operators at Tema & Lagos; implement off-dock container staging.',
    deadline: 'Today, 18:00 UTC',
    owner: 'Marcus Vance (Regional Director)',
    category: 'Port Operations',
    createdAt: '2026-09-21'
  },
  {
    id: 'act-002',
    title: 'Review Sea Route Asia → Europe Transshipment Plan',
    column: 'CRITICAL',
    impact: 'HIGH',
    affectedShipments: 1284,
    recommendedAction: 'Shift 15% high-SLA cargo from Singapore transshipment to direct Express or Rail Express.',
    deadline: 'Tomorrow, 12:00 UTC',
    owner: 'Elena Rostova (Lanes Lead)',
    category: 'Route Optimization',
    createdAt: '2026-09-20'
  },
  {
    id: 'act-003',
    title: 'Review Customs Digital Documentation Pipeline',
    column: 'HIGH_PRIORITY',
    impact: 'HIGH',
    affectedShipments: 420,
    recommendedAction: 'Deploy automated pre-clearance EDI filing for EU inbound shipments to eliminate 2.1-day dwell.',
    deadline: 'In 2 days',
    owner: 'Dr. Aris Thorne (Compliance)',
    category: 'Customs',
    createdAt: '2026-09-20'
  },
  {
    id: 'act-004',
    title: 'Negotiate Carrier Capacity Cushion for Pacific Asia',
    column: 'HIGH_PRIORITY',
    impact: 'MEDIUM',
    affectedShipments: 610,
    recommendedAction: 'Contract 250 TEU block allocation with secondary carriers to hedge spot shortages.',
    deadline: 'In 3 days',
    owner: 'Sophia Chen (Procurement)',
    category: 'Carrier Relations',
    createdAt: '2026-09-19'
  },
  {
    id: 'act-005',
    title: 'Monitor San Pedro Bay Drayage Truck Availability',
    column: 'MONITORING',
    impact: 'MEDIUM',
    affectedShipments: 320,
    recommendedAction: 'Track turn times at Pier 400; maintain secondary chassis pool in reserve.',
    deadline: 'Next Week',
    owner: 'David Miller (West Coast Ops)',
    category: 'Inland Transport',
    createdAt: '2026-09-18'
  },
  {
    id: 'act-006',
    title: 'Resolved: SFO Cold-Chain Vaccine Transfer Protocol',
    column: 'RESOLVED',
    impact: 'HIGH',
    affectedShipments: 48,
    recommendedAction: 'Completed direct airside ramp transfer with zero temperature excursion.',
    deadline: 'Completed',
    owner: 'Logistics Rapid Response',
    category: 'Air Freight',
    createdAt: '2026-09-17'
  }
];

export const PRIORITY_MATRIX_ITEMS: PriorityMatrixItem[] = [
  {
    id: 'mat-001',
    title: 'Asia → Europe Sea Delays',
    impactScore: 92,
    urgencyScore: 88,
    category: 'Trade Lanes',
    status: 'In Progress',
    affectedShipments: 1284,
    actionPlan: 'Enforce alternative feeder routing through Port Klang and trigger rail diversion for tier-1 orders.'
  },
  {
    id: 'mat-002',
    title: 'West Africa Port Congestion',
    impactScore: 84,
    urgencyScore: 92,
    category: 'Port Terminals',
    status: 'Escalated',
    affectedShipments: 380,
    actionPlan: 'Deploy rapid-response berthing liaison to coordinate with port authority in Tema.'
  },
  {
    id: 'mat-003',
    title: 'Customs Clearance Backlog (Hamburg/Rotterdam)',
    impactScore: 78,
    urgencyScore: 74,
    category: 'Regulatory',
    status: 'Action Required',
    affectedShipments: 512,
    actionPlan: 'Switch to pre-arrival electronic customs submission protocol across all Tier-1 brokers.'
  },
  {
    id: 'mat-004',
    title: 'Warehouse Cross-Dock Sorting Bottleneck',
    impactScore: 58,
    urgencyScore: 48,
    category: 'Warehousing',
    status: 'Monitoring',
    affectedShipments: 190,
    actionPlan: 'Reallocate night shift staffing to high-throughput sortation lines in Chicago hub.'
  },
  {
    id: 'mat-005',
    title: 'Air Cargo Spot Rate Surges in Eastern Asia',
    impactScore: 72,
    urgencyScore: 62,
    category: 'Procurement',
    status: 'Evaluating',
    affectedShipments: 245,
    actionPlan: 'Lock in 30-day fixed charter block space for critical semiconductor shipments.'
  },
  {
    id: 'mat-006',
    title: 'Ocean Feeder Disconnect in Santos',
    impactScore: 64,
    urgencyScore: 80,
    category: 'Port Terminals',
    status: 'Critical',
    affectedShipments: 160,
    actionPlan: 'Reroute feeder vessels to Paranaguá auxiliary terminal.'
  }
];
