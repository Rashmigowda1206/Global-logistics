import { LiveAlert } from '../types/logistics';

export const INITIAL_ALERTS: LiveAlert[] = [
  {
    id: 'alt-001',
    timestamp: '2026-09-21T06:52:10Z',
    timeAgo: '4 min ago',
    type: 'DELAY',
    severity: 'CRITICAL',
    title: 'Shipment ORD-45821 Delayed',
    description: 'Berth queue at Shanghai Port exceeded 48h SLA limit. Current delay gap +2.8 days.',
    shipmentId: 'ORD-45821',
    location: 'Port of Shanghai',
    actionRecommended: 'Notify receiving warehouse in Rotterdam to reschedule inland linehaul.'
  },
  {
    id: 'alt-002',
    timestamp: '2026-09-21T06:48:30Z',
    timeAgo: '8 min ago',
    type: 'PORT_CONGESTION',
    severity: 'WARNING',
    title: 'Port Congestion Spike: Singapore PSA',
    description: 'Vessel anchorage dwell climbed to 3.4 days across Pasir Panjang and Jurong basins.',
    routeId: 'route-asia-eu-1',
    location: 'Singapore PSA Terminal',
    actionRecommended: 'Evaluate feeder diversion via Port Klang or Tanjung Pelepas.'
  },
  {
    id: 'alt-003',
    timestamp: '2026-09-21T06:35:15Z',
    timeAgo: '21 min ago',
    type: 'ROUTE_RISK',
    severity: 'WARNING',
    title: 'Route Risk Escalated: Shanghai → Antwerp',
    description: 'Suez transit queuing compounded with Lock congestion in Antwerp elevated lane risk to 84%.',
    routeId: 'route-asia-eu-2',
    location: 'Shanghai → Antwerp Corridor',
    actionRecommended: 'Simulate high-priority cargo diversion to rail or air expedite.'
  },
  {
    id: 'alt-004',
    timestamp: '2026-09-21T06:22:00Z',
    timeAgo: '34 min ago',
    type: 'DELIVERED',
    severity: 'SUCCESS',
    title: 'Shipment SO-44103 Delivered',
    description: 'High-value medical sensor shipment cleared SFO customs and completed final-mile handover.',
    shipmentId: 'SO-44103',
    location: 'San Francisco, USA',
    actionRecommended: 'Log zero-defect on-time fulfillment in customer SLA scorecard.'
  },
  {
    id: 'alt-005',
    timestamp: '2026-09-21T05:59:45Z',
    timeAgo: '56 min ago',
    type: 'DELAY',
    severity: 'CRITICAL',
    title: 'Customs Audit Hold: SO-44321',
    description: 'Special optical sensor shipment tagged for automated declaration review in Hamburg.',
    shipmentId: 'SO-44321',
    location: 'Port of Hamburg',
    actionRecommended: 'Transmit digital dual-use compliance certificates to Zollamt Hamburg.'
  },
  {
    id: 'alt-006',
    timestamp: '2026-09-21T05:30:00Z',
    timeAgo: '1h 26m ago',
    type: 'ROUTE_RISK',
    severity: 'INFO',
    title: 'Weather Advisory: North Atlantic Sector 4',
    description: 'North Atlantic storm system passing; minimal impact on westbound containerships.',
    routeId: 'route-eu-na-1',
    location: 'North Atlantic',
    actionRecommended: 'Continue nominal route telemetry monitoring.'
  }
];
