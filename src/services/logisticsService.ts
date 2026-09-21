import { 
  ShipmentRecord, 
  GlobalFilterState, 
  SimulationScenario, 
  SimulationResult 
} from '../types/logistics';
import { MOCK_SHIPMENTS } from '../data/mockLogisticsData';

export const filterShipments = (
  shipments: ShipmentRecord[],
  filters: GlobalFilterState
): ShipmentRecord[] => {
  return shipments.filter((item) => {
    // Shipping Mode filter
    if (filters.shippingMode && filters.shippingMode !== 'All' && item.shippingMode !== filters.shippingMode) {
      return false;
    }
    // Market filter
    if (filters.market && filters.market !== 'All' && item.market !== filters.market) {
      return false;
    }
    // Order Region filter
    if (filters.orderRegion && filters.orderRegion !== 'All' && item.orderRegion !== filters.orderRegion) {
      return false;
    }
    // Delivery Status filter
    if (filters.deliveryStatus && filters.deliveryStatus !== 'All') {
      if (filters.deliveryStatus === 'EARLY' && item.deliveryClassification !== 'EARLY') return false;
      if (filters.deliveryStatus === 'ON SCHEDULE' && item.deliveryClassification !== 'ON SCHEDULE') return false;
      if (filters.deliveryStatus === 'DELAYED' && item.deliveryClassification !== 'DELAYED') return false;
    }
    // Risk Level filter
    if (filters.riskLevel && filters.riskLevel !== 'All') {
      if (filters.riskLevel === 'HIGH' && item.riskScore < 60) return false;
      if (filters.riskLevel === 'MEDIUM' && (item.riskScore < 30 || item.riskScore >= 60)) return false;
      if (filters.riskLevel === 'LOW' && item.riskScore >= 30) return false;
    }
    // Customer Segment filter
    if (filters.customerSegment && filters.customerSegment !== 'All' && item.customerSegment !== filters.customerSegment) {
      return false;
    }
    // Search Query (Order ID, Customer, Country, Product, Carrier)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const match = 
        item.orderId.toLowerCase().includes(q) ||
        item.customerFname.toLowerCase().includes(q) ||
        item.orderCountry.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        item.carrier.toLowerCase().includes(q) ||
        item.orderCity.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
};

export const calculateKPIs = (shipments: ShipmentRecord[]) => {
  const total = shipments.length;
  if (total === 0) {
    return {
      totalShipments: 0,
      atRiskCount: 0,
      delayedCount: 0,
      onTimeRate: 100,
      avgDelayDays: 0,
      slaCompliance: 100,
      totalSales: 0,
      totalProfit: 0,
      earlyCount: 0,
      onScheduleCount: 0
    };
  }

  const atRiskCount = shipments.filter(s => s.lateDeliveryRisk === 1).length;
  const delayedCount = shipments.filter(s => s.deliveryClassification === 'DELAYED').length;
  const earlyCount = shipments.filter(s => s.deliveryClassification === 'EARLY').length;
  const onScheduleCount = shipments.filter(s => s.deliveryClassification === 'ON SCHEDULE').length;

  const onTimeRate = Number((((earlyCount + onScheduleCount) / total) * 100).toFixed(1));
  
  const totalDelayDays = shipments.reduce((acc, s) => acc + Math.max(0, s.delayGap), 0);
  const avgDelayDays = Number((totalDelayDays / total).toFixed(1));

  const slaCompliantCount = shipments.filter(s => s.delayGap <= 0.5).length;
  const slaCompliance = Number(((slaCompliantCount / total) * 100).toFixed(1));

  const totalSales = shipments.reduce((acc, s) => acc + s.orderItemTotal, 0);
  const totalProfit = shipments.reduce((acc, s) => acc + s.orderProfitPerOrder, 0);

  return {
    totalShipments: total,
    atRiskCount,
    delayedCount,
    earlyCount,
    onScheduleCount,
    onTimeRate,
    avgDelayDays,
    slaCompliance,
    totalSales: Math.round(totalSales),
    totalProfit: Math.round(totalProfit)
  };
};

export const getDelayGapHistogram = (shipments: ShipmentRecord[]) => {
  const bins: Record<string, { bin: string; count: number; category: string }> = {
    '-3d or earlier': { bin: '-3d or earlier', count: 0, category: 'EARLY' },
    '-2d early': { bin: '-2d early', count: 0, category: 'EARLY' },
    '-1d early': { bin: '-1d early', count: 0, category: 'EARLY' },
    '0d (On Time)': { bin: '0d (On Time)', count: 0, category: 'ON SCHEDULE' },
    '+1d delay': { bin: '+1d delay', count: 0, category: 'DELAYED' },
    '+2d delay': { bin: '+2d delay', count: 0, category: 'DELAYED' },
    '+3d delay': { bin: '+3d delay', count: 0, category: 'DELAYED' },
    '+4d+ critical': { bin: '+4d+ critical', count: 0, category: 'DELAYED' },
  };

  shipments.forEach((s) => {
    const gap = s.delayGap;
    if (gap <= -3) bins['-3d or earlier'].count++;
    else if (gap <= -2) bins['-2d early'].count++;
    else if (gap < 0) bins['-1d early'].count++;
    else if (gap === 0) bins['0d (On Time)'].count++;
    else if (gap <= 1) bins['+1d delay'].count++;
    else if (gap <= 2) bins['+2d delay'].count++;
    else if (gap <= 3) bins['+3d delay'].count++;
    else bins['+4d+ critical'].count++;
  });

  return Object.values(bins);
};

export const getModeComparison = (shipments: ShipmentRecord[]) => {
  const modes = ['Air', 'Sea', 'Road', 'Rail'] as const;
  
  return modes.map((mode) => {
    const modeShipments = shipments.filter(s => s.shippingMode === mode);
    const count = modeShipments.length;
    if (count === 0) {
      return {
        mode,
        onTimeRate: 100,
        avgDelay: 0,
        riskScore: 0,
        volume: 0,
        costEfficiency: 80,
        slaCompliance: 100,
        speedScore: mode === 'Air' ? 95 : mode === 'Road' ? 75 : mode === 'Rail' ? 65 : 40,
        costIndex: mode === 'Air' ? 90 : mode === 'Sea' ? 25 : mode === 'Road' ? 55 : 45
      };
    }

    const onTimeCount = modeShipments.filter(s => s.deliveryClassification !== 'DELAYED').length;
    const onTimeRate = Number(((onTimeCount / count) * 100).toFixed(1));
    const avgDelay = Number((modeShipments.reduce((acc, s) => acc + Math.max(0, s.delayGap), 0) / count).toFixed(1));
    const avgRisk = Math.round(modeShipments.reduce((acc, s) => acc + s.riskScore, 0) / count);
    const slaCompliance = Number(((modeShipments.filter(s => s.delayGap <= 0.5).length / count) * 100).toFixed(1));

    // Efficiency metrics
    const costEfficiency = mode === 'Sea' ? 92 : mode === 'Rail' ? 84 : mode === 'Road' ? 72 : 55;
    const speedScore = mode === 'Air' ? 96 : mode === 'Road' ? 78 : mode === 'Rail' ? 68 : 42;
    const costIndex = mode === 'Air' ? 92 : mode === 'Road' ? 58 : mode === 'Rail' ? 44 : 24;

    return {
      mode,
      onTimeRate,
      avgDelay,
      riskScore: avgRisk,
      volume: count,
      costEfficiency,
      slaCompliance,
      speedScore,
      costIndex
    };
  });
};

export const getRegionalBreakdown = (shipments: ShipmentRecord[]) => {
  const regions = [
    { id: 'europe', name: 'Europe', key: 'Europe', desc: 'European Union & Schengen Hubs' },
    { id: 'asia', name: 'Asia', key: 'Pacific Asia', desc: 'East Asia, Southeast Asia & Indo-Pacific' },
    { id: 'north-america', name: 'North America', key: 'USCA', desc: 'USMCA North American Logistics Corridor' },
    { id: 'south-america', name: 'South America', key: 'LATAM', desc: 'Mercosur & Pacific Alliance Ports' },
    { id: 'africa-middle-east', name: 'Africa & Middle East', key: 'Africa', desc: 'Trans-Sahara & Persian Gulf Hubs' }
  ];

  return regions.map(reg => {
    const regShipments = shipments.filter(s => s.market === reg.key);
    const count = regShipments.length;
    const onTimeCount = regShipments.filter(s => s.deliveryClassification !== 'DELAYED').length;
    const onTimeRate = count > 0 ? Number(((onTimeCount / count) * 100).toFixed(1)) : 100;
    const avgDelay = count > 0 ? Number((regShipments.reduce((acc, s) => acc + Math.max(0, s.delayGap), 0) / count).toFixed(1)) : 0;
    const riskScore = count > 0 ? Math.round(regShipments.reduce((acc, s) => acc + s.riskScore, 0) / count) : 0;

    return {
      ...reg,
      shipmentsCount: count,
      onTimeRate,
      avgDelayDays: avgDelay,
      riskScore,
      status: riskScore > 65 ? 'CRITICAL' : riskScore > 40 ? 'WARNING' : 'NORMAL'
    };
  });
};

export const runSimulationCalculation = (
  shipments: ShipmentRecord[],
  scenario: SimulationScenario
): SimulationResult => {
  // Baseline metrics
  let targetCohort = shipments;
  if (scenario.shippingMode !== 'All') {
    targetCohort = targetCohort.filter(s => s.shippingMode === scenario.shippingMode);
  }
  if (scenario.region !== 'All') {
    targetCohort = targetCohort.filter(s => s.orderRegion === scenario.region || s.market === scenario.region);
  }
  if (targetCohort.length === 0) {
    targetCohort = shipments;
  }

  const baselineKpis = calculateKPIs(targetCohort);

  // Simulation physics
  // Higher port congestion -> increases delay, decreases on-time
  // Higher customs delay -> increases delay directly
  // Volume multiplier > 1.0 creates exponential queue stress
  // Warehouse processing reduces delays if optimized
  const congestionImpact = (scenario.portCongestion - 50) * 0.035; // +/- 1.75 days
  const customsImpact = (scenario.customsDelayDays - 2.0) * 0.6; // +/- days
  const volumeStrain = Math.max(0, (scenario.volumeMultiplier - 1.0) * 1.8);
  const warehouseImpact = (scenario.warehouseProcessingDays - 2.0) * 0.4;

  const netDelayDelta = Number((congestionImpact + customsImpact + volumeStrain + warehouseImpact).toFixed(1));
  const newAvgDelay = Math.max(0.2, Number((baselineKpis.avgDelayDays + netDelayDelta).toFixed(1)));

  // SLA & On-time elasticity
  const deltaOnTime = -netDelayDelta * 7.5;
  const newOnTime = Math.min(99.5, Math.max(35.0, Number((baselineKpis.onTimeRate + deltaOnTime).toFixed(1))));

  const deltaRisk = netDelayDelta * 11;
  const newLateRisk = Math.min(95.0, Math.max(5.0, Number((((baselineKpis.atRiskCount / (baselineKpis.totalShipments || 1)) * 100) + deltaRisk).toFixed(1))));

  const slaDelta = -netDelayDelta * 8.2;
  const newSla = Math.min(99.0, Math.max(30.0, Number((baselineKpis.slaCompliance + slaDelta).toFixed(1))));

  const costDeltaPercent = ((scenario.volumeMultiplier - 1) * 0.7 + (scenario.portCongestion > 70 ? 0.15 : 0)) * 100;
  const newCost = Math.round(baselineKpis.totalSales * scenario.volumeMultiplier * (1 + (netDelayDelta > 1 ? 0.08 : 0)));

  return {
    current: {
      avgDelayDays: baselineKpis.avgDelayDays,
      onTimeRate: baselineKpis.onTimeRate,
      lateRiskRate: Number(((baselineKpis.atRiskCount / (baselineKpis.totalShipments || 1)) * 100).toFixed(1)),
      totalEstimatedCost: baselineKpis.totalSales,
      slaCompliance: baselineKpis.slaCompliance
    },
    simulated: {
      avgDelayDays: newAvgDelay,
      onTimeRate: newOnTime,
      lateRiskRate: newLateRisk,
      totalEstimatedCost: newCost,
      slaCompliance: newSla
    },
    delta: {
      delayReductionDays: Number((baselineKpis.avgDelayDays - newAvgDelay).toFixed(1)),
      slaImprovementPercent: Number((newSla - baselineKpis.slaCompliance).toFixed(1)),
      riskReductionPercent: Number((((baselineKpis.atRiskCount / (baselineKpis.totalShipments || 1)) * 100) - newLateRisk).toFixed(1)),
      costImpactPercent: Number(costDeltaPercent.toFixed(1))
    },
    affectedShipmentsCount: targetCohort.length
  };
};
