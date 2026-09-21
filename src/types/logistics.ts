export type DeliveryClassification = 'EARLY' | 'ON SCHEDULE' | 'DELAYED';

export type DeliveryStatus = 
  | 'Advance shipping' 
  | 'Late delivery' 
  | 'Shipping on time' 
  | 'Shipping canceled';

export type ShippingMode = 
  | 'Standard Class' 
  | 'First Class' 
  | 'Second Class' 
  | 'Same Day'
  | 'Air'
  | 'Sea'
  | 'Road'
  | 'Rail';

export type Market = 
  | 'Pacific Asia' 
  | 'USCA' 
  | 'Africa' 
  | 'Europe' 
  | 'LATAM';

export type CustomerSegment = 
  | 'Consumer' 
  | 'Corporate' 
  | 'Home Office' 
  | 'Sports & Fitness' 
  | 'Industrial';

export type OrderStatus = 
  | 'COMPLETE' 
  | 'PENDING' 
  | 'CLOSED' 
  | 'PROCESSING' 
  | 'ON_HOLD' 
  | 'CANCELED' 
  | 'SUSPECTED_FRAUD';

export interface ShipmentRecord {
  // Primary Identifiers
  orderId: string;
  orderCustomerId: string;
  customerId: string;
  customerFname: string;
  customerCity: string;
  customerCountry: string;
  customerState: string;
  customerStreet: string;
  customerZipcode: string;
  customerSegment: CustomerSegment;

  // Order Details
  orderCity: string;
  orderCountry: string;
  orderRegion: string;
  orderState: string;
  market: Market;
  orderStatus: OrderStatus;
  orderDate: string;

  // Shipping & Telemetry
  shippingMode: ShippingMode;
  daysForShippingReal: number;
  daysForShipmentScheduled: number;
  deliveryStatus: DeliveryStatus;
  lateDeliveryRisk: 0 | 1;
  latitude: number;
  longitude: number;
  originHub: string;
  destinationHub: string;
  carrier: string;

  // Product & Financials
  categoryId: number;
  categoryName: string;
  departmentId: number;
  departmentName: string;
  productName: string;
  productPrice: number;
  orderItemQuantity: number;
  sales: number;
  orderItemTotal: number;
  orderItemDiscount: number;
  orderItemDiscountRate: number;
  orderItemProfitRatio: number;
  orderProfitPerOrder: number;
  benefitPerOrder: number;
  salesPerCustomer: number;

  // Derived Fields
  delayGap: number; // daysForShippingReal - daysForShipmentScheduled
  deliveryClassification: DeliveryClassification;
  riskScore: number; // 0 - 100
  rootCause?: string;
  currentMilestone?: 'ORDER_PLACED' | 'WAREHOUSE' | 'ORIGIN_PORT' | 'IN_TRANSIT' | 'DESTINATION_PORT' | 'DELIVERED';
}

export interface TradeRoute {
  id: string;
  code: string;
  name: string;
  origin: string;
  destination: string;
  originCoords: [number, number]; // [lat, lng]
  destCoords: [number, number];
  status: 'NORMAL' | 'AT_RISK' | 'DELAYED';
  shipmentsCount: number;
  avgDelayDays: number;
  riskScore: number;
  topIssue: string;
  mode: ShippingMode;
  distanceKm: number;
  congestionLevel: number; // 0-100%
  alternateRouteDescription?: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'PORT' | 'WAREHOUSE' | 'DC';
  country: string;
  region: string;
  coords: [number, number];
  congestionScore: number; // 0 - 100
  throughputTeu: number;
  status: 'NORMAL' | 'CONGESTED' | 'CRITICAL';
  activeVesselsOrFlights: number;
  avgDwellDays: number;
}

export interface LiveAlert {
  id: string;
  timestamp: string;
  timeAgo: string;
  type: 'DELAY' | 'PORT_CONGESTION' | 'ROUTE_RISK' | 'DELIVERED';
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  description: string;
  shipmentId?: string;
  routeId?: string;
  location?: string;
  actionRecommended?: string;
}

export interface ActionTask {
  id: string;
  title: string;
  column: 'CRITICAL' | 'HIGH_PRIORITY' | 'MONITORING' | 'RESOLVED';
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affectedShipments: number;
  recommendedAction: string;
  deadline: string;
  owner: string;
  category: string;
  createdAt: string;
}

export interface PriorityMatrixItem {
  id: string;
  title: string;
  impactScore: number; // 0 - 100 (x-axis)
  urgencyScore: number; // 0 - 100 (y-axis)
  category: string;
  status: string;
  affectedShipments: number;
  actionPlan: string;
}

export interface GlobalFilterState {
  dateRange: string;
  shippingMode: string;
  market: string;
  orderRegion: string;
  deliveryStatus: string;
  riskLevel: string;
  customerSegment: string;
  searchQuery: string;
}

export interface SimulationScenario {
  shippingMode: 'All' | 'Air' | 'Sea' | 'Road' | 'Rail';
  region: string;
  portCongestion: number; // 0 - 100%
  customsDelayDays: number; // 0 - 10 days
  volumeMultiplier: number; // 0.5 - 2.0x
  warehouseProcessingDays: number; // 0 - 10 days
}

export interface SimulationMetrics {
  avgDelayDays: number;
  onTimeRate: number;
  lateRiskRate: number;
  totalEstimatedCost: number;
  slaCompliance: number;
}

export interface SimulationResult {
  current: SimulationMetrics;
  simulated: SimulationMetrics;
  delta: {
    delayReductionDays: number;
    slaImprovementPercent: number;
    riskReductionPercent: number;
    costImpactPercent: number;
  };
  affectedShipmentsCount: number;
}
