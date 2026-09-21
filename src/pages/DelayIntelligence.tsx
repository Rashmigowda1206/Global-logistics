import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  AlertTriangle,
  Flame,
  ShieldAlert,
  GitBranch,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  Anchor,
  FileCheck,
  Truck,
  CloudRain,
  Layers
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLogisticsFilter } from '../context/FilterContext';
import { useActions } from '../context/ActionContext';

interface RootCauseItem {
  id: string;
  name: string;
  sharePercent: number;
  icon: any;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  affectedShipments: number;
  avgDelay: number;
  affectedRegions: string[];
  affectedModes: string[];
  topImpactedCustomers: string[];
  recommendedAction: string;
}

export const DelayIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const { kpis, updateFilter } = useLogisticsFilter();
  const { addTask } = useActions();

  // Root cause explorer data
  const rootCauses: RootCauseItem[] = [
    {
      id: 'rc-port',
      name: 'Port Congestion & Terminal Dwell',
      sharePercent: 41,
      icon: Anchor,
      riskLevel: 'CRITICAL',
      affectedShipments: 1284,
      avgDelay: 3.4,
      affectedRegions: ['Pacific Asia (Singapore, Shanghai)', 'Western Europe (Rotterdam, Antwerp)'],
      affectedModes: ['Sea Freight', 'Inland Drayage'],
      topImpactedCustomers: ['Elena Rostova (Corporate)', 'Marcus Thorne (Consumer)'],
      recommendedAction: 'Implement secondary berth reservations and shift urgent cargo to feeder diversion via Tanjung Pelepas.'
    },
    {
      id: 'rc-customs',
      name: 'Customs Clearance & Regulatory Audits',
      sharePercent: 23,
      icon: FileCheck,
      riskLevel: 'HIGH',
      affectedShipments: 512,
      avgDelay: 2.1,
      affectedRegions: ['Europe (Hamburg, Le Havre)', 'South America (Santos)'],
      affectedModes: ['Sea Freight', 'Air Cargo'],
      topImpactedCustomers: ['Jean Dupont (Corporate)', 'Alexander Meyer (Corporate)'],
      recommendedAction: 'Deploy pre-arrival electronic commercial invoice verification to clear audits prior to vessel discharge.'
    },
    {
      id: 'rc-carrier',
      name: 'Carrier Capacity & Vessel Blank Sailings',
      sharePercent: 18,
      icon: Truck,
      riskLevel: 'HIGH',
      affectedShipments: 420,
      avgDelay: 1.9,
      affectedRegions: ['North America (Los Angeles)', 'Middle East (Dubai)'],
      affectedModes: ['Sea Freight', 'Road Linehaul'],
      topImpactedCustomers: ['David Miller (Corporate)', 'Sarah Jenkins (Consumer)'],
      recommendedAction: 'Activate SLA contingency clauses with backup ocean alliances and lock in guaranteed slot allocations.'
    },
    {
      id: 'rc-warehouse',
      name: 'Warehouse Sorting & Cross-Dock Bottlenecks',
      sharePercent: 11,
      icon: Layers,
      riskLevel: 'MEDIUM',
      affectedShipments: 195,
      avgDelay: 1.2,
      affectedRegions: ['USCA (Chicago)', 'Western Europe (Frankfurt)'],
      affectedModes: ['Air Cargo', 'Road Linehaul'],
      topImpactedCustomers: ['Hans Gruber (Consumer)', 'Claire Dubois (Industrial)'],
      recommendedAction: 'Rebalance shift scheduling on high-speed sortation conveyors during peak arrival hours.'
    },
    {
      id: 'rc-weather',
      name: 'Weather Disruption & Channel Deviations',
      sharePercent: 7,
      icon: CloudRain,
      riskLevel: 'MEDIUM',
      affectedShipments: 85,
      avgDelay: 1.5,
      affectedRegions: ['North Atlantic Corridor', 'South Pacific Sector'],
      affectedModes: ['Sea Freight', 'Air Cargo'],
      topImpactedCustomers: ['Jessica Alba (Sports)', 'Oliver Smith (Consumer)'],
      recommendedAction: 'Utilize automated meteorological routing to minimize typhoon and winter storm dwell.'
    }
  ];

  const [selectedCause, setSelectedCause] = useState<RootCauseItem>(rootCauses[0]);

  // Heatmap Matrix Data (Shipping Modes × Regions)
  const heatmapModes = ['Air', 'Sea', 'Road', 'Rail'];
  const heatmapRegions = [
    { name: 'Europe', key: 'Europe' },
    { name: 'Pacific Asia', key: 'Pacific Asia' },
    { name: 'North America', key: 'USCA' },
    { name: 'Latin America', key: 'LATAM' },
    { name: 'Africa / M.East', key: 'Africa' },
  ];

  // Matrix cell data: [regionIndex][modeIndex] -> { riskPercent, shipments, avgDelay }
  const heatmapData: Record<string, Record<string, { risk: number; shipments: number; avgDelay: number }>> = {
    'Europe': {
      'Air': { risk: 14, shipments: 340, avgDelay: 0.4 },
      'Sea': { risk: 78, shipments: 1280, avgDelay: 3.1 },
      'Road': { risk: 32, shipments: 650, avgDelay: 0.8 },
      'Rail': { risk: 42, shipments: 410, avgDelay: 1.2 },
    },
    'Pacific Asia': {
      'Air': { risk: 18, shipments: 490, avgDelay: 0.6 },
      'Sea': { risk: 86, shipments: 2341, avgDelay: 3.9 },
      'Road': { risk: 44, shipments: 520, avgDelay: 1.1 },
      'Rail': { risk: 65, shipments: 380, avgDelay: 2.2 },
    },
    'USCA': {
      'Air': { risk: 12, shipments: 620, avgDelay: 0.3 },
      'Sea': { risk: 64, shipments: 1420, avgDelay: 2.4 },
      'Road': { risk: 28, shipments: 980, avgDelay: 0.7 },
      'Rail': { risk: 38, shipments: 710, avgDelay: 1.0 },
    },
    'LATAM': {
      'Air': { risk: 22, shipments: 210, avgDelay: 0.8 },
      'Sea': { risk: 79, shipments: 860, avgDelay: 3.5 },
      'Road': { risk: 52, shipments: 430, avgDelay: 1.8 },
      'Rail': { risk: 48, shipments: 140, avgDelay: 1.6 },
    },
    'Africa': {
      'Air': { risk: 26, shipments: 180, avgDelay: 0.9 },
      'Sea': { risk: 89, shipments: 590, avgDelay: 4.8 },
      'Road': { risk: 60, shipments: 310, avgDelay: 2.1 },
      'Rail': { risk: 72, shipments: 190, avgDelay: 2.9 },
    },
  };

  const [selectedCell, setSelectedCell] = useState<{
    region: string;
    mode: string;
    data: { risk: number; shipments: number; avgDelay: number };
  } | null>(null);

  const handleCreateActionFromCause = () => {
    addTask({
      title: `Mitigate ${selectedCause.name}`,
      column: selectedCause.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH_PRIORITY',
      impact: selectedCause.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      affectedShipments: selectedCause.affectedShipments,
      recommendedAction: selectedCause.recommendedAction,
      deadline: 'In 48 Hours',
      owner: 'Delay Intelligence Core',
      category: 'Root Cause Mitigation'
    });
    navigate('/actions');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              AI DIAGNOSTIC SUITE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            DELAY INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Root cause hierarchy, chokepoint signal diagnostics, and multi-modal risk intensity matrix
          </p>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-hud-purple transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Mitigation Scenarios</span>
        </button>
      </div>

      {/* Row 1: Delay Signals (Left 5 cols) + Root Cause Tree (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: DELAY SIGNALS */}
        <div className="lg:col-span-5 bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Active Delay Signals
              </h2>
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              7 VECTORS MONITORED
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { signal: 'Port Congestion', risk: 'CRITICAL', score: 86, affected: 1284, avgDelay: '+3.4d', icon: Anchor },
              { signal: 'Customs Clearance', risk: 'HIGH', score: 72, affected: 512, avgDelay: '+2.1d', icon: FileCheck },
              { signal: 'Carrier Capacity Deficit', risk: 'HIGH', score: 68, affected: 420, avgDelay: '+1.9d', icon: Truck },
              { signal: 'Warehouse Sortation', risk: 'MODERATE', score: 48, affected: 195, avgDelay: '+1.2d', icon: Layers },
              { signal: 'Adverse Weather Fronts', risk: 'MODERATE', score: 39, affected: 85, avgDelay: '+1.5d', icon: CloudRain },
              { signal: 'Shipping Mode Mismatch', risk: 'LOW', score: 24, affected: 60, avgDelay: '+0.8d', icon: Activity },
              { signal: 'Transit Route Geometry', risk: 'LOW', score: 18, affected: 45, avgDelay: '+0.5d', icon: GitBranch },
            ].map((sig, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#0A132C] hover:bg-[#101F44] border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded bg-slate-800 text-cyan-400">
                    <sig.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">{sig.signal}</span>
                    <span className="text-[10px] text-slate-500">
                      {sig.affected} affected orders • Avg {sig.avgDelay}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold block ${
                      sig.risk === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : sig.risk === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : sig.risk === 'MODERATE'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {sig.risk}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                    {sig.score}% index
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: ROOT CAUSE EXPLORER TREE */}
        <div className="lg:col-span-7 bg-[#070D1E]/95 border border-purple-500/25 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                WHY ARE SHIPMENTS DELAYED? (ROOT CAUSE EXPLORER)
              </h2>
            </div>
            <span className="text-[10px] text-purple-300 font-mono">
              Click a cause to drill down
            </span>
          </div>

          {/* Causes List with percentages */}
          <div className="grid grid-cols-5 gap-2 text-xs">
            {rootCauses.map((cause) => {
              const isSelected = selectedCause.id === cause.id;
              return (
                <button
                  key={cause.id}
                  onClick={() => setSelectedCause(cause)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-600/25 border-purple-400 text-purple-200 shadow-hud-purple'
                      : 'bg-[#0A132C] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg font-bold block text-slate-100">{cause.sharePercent}%</span>
                  <span className="text-[10px] font-medium line-clamp-2">{cause.name.split('&')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Cause Card */}
          <div className="p-4 rounded-xl bg-[#0B1535] border border-purple-500/30 space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <selectedCause.icon className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">{selectedCause.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {selectedCause.sharePercent}% OF ALL DELAYS
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
              <div className="p-2.5 rounded bg-[#070D1E] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Affected Orders</span>
                <span className="text-slate-100 font-bold">{selectedCause.affectedShipments}</span>
              </div>
              <div className="p-2.5 rounded bg-[#070D1E] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Average Delay</span>
                <span className="text-amber-400 font-bold">+{selectedCause.avgDelay} days</span>
              </div>
              <div className="p-2.5 rounded bg-[#070D1E] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Risk Severity</span>
                <span className="text-rose-400 font-bold">{selectedCause.riskLevel}</span>
              </div>
              <div className="p-2.5 rounded bg-[#070D1E] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Primary Mode</span>
                <span className="text-cyan-400 font-bold">{selectedCause.affectedModes[0]}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start space-x-2">
                <span className="text-slate-500 min-w-[120px]">Affected Corridors:</span>
                <span className="text-slate-300">{selectedCause.affectedRegions.join(' • ')}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-slate-500 min-w-[120px]">Impacted Clients:</span>
                <span className="text-slate-300">{selectedCause.topImpactedCustomers.join(' • ')}</span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-3 rounded-lg bg-[#070D1E] border border-cyan-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase text-cyan-400 block">
                Recommended Mitigation Protocol
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedCause.recommendedAction}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-1">
              <button
                onClick={() => {
                  updateFilter('deliveryStatus', 'DELAYED');
                  navigate('/shipments');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
              >
                Inspect Affected Shipments
              </button>
              <button
                onClick={handleCreateActionFromCause}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-hud-purple transition-colors flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Create Action Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: DELAY RISK HEATMAP (Mode × Region Matrix) */}
      <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              DELAY RISK HEATMAP (SHIPPING MODE × REGION)
            </h2>
            <p className="text-[11px] text-slate-400">
              Color intensity indicates late delivery probability. Click any cell to inspect cohort parameters.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[10px]">
            <span className="text-slate-400">Risk Gradient:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">&lt;20% Low</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">20-60% Moderate</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">&gt;60% Critical</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-3 text-slate-400 font-bold uppercase text-[10px]">Region \ Mode</th>
                {heatmapModes.map((mode) => (
                  <th key={mode} className="p-3 text-center text-slate-300 font-bold uppercase text-[10px]">
                    {mode === 'Air' ? '✈ Air' : mode === 'Sea' ? '🚢 Sea' : mode === 'Road' ? '🚛 Road' : '🚆 Rail'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapRegions.map((reg) => (
                <tr key={reg.key} className="border-b border-slate-800/60">
                  <td className="p-3 font-bold text-slate-200 bg-[#060B1A]">
                    {reg.name}
                  </td>
                  {heatmapModes.map((mode) => {
                    const cell = heatmapData[reg.key]?.[mode] || { risk: 20, shipments: 100, avgDelay: 0.5 };
                    const risk = cell.risk;

                    // Compute cell styling based on risk percentage
                    let bgStyle = 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border-emerald-500/30';
                    if (risk >= 60) {
                      bgStyle = 'bg-rose-500/20 text-rose-200 hover:bg-rose-500/35 border-rose-500/40 font-bold';
                    } else if (risk >= 30) {
                      bgStyle = 'bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 border-amber-500/40 font-semibold';
                    }

                    return (
                      <td key={mode} className="p-2 text-center">
                        <button
                          onClick={() => setSelectedCell({ region: reg.name, mode, data: cell })}
                          className={`w-full py-3 px-2 rounded-lg border transition-all ${bgStyle} cursor-pointer group`}
                        >
                          <span className="block text-sm font-extrabold">{risk}%</span>
                          <span className="block text-[10px] text-slate-400 group-hover:text-slate-200">
                            {cell.shipments} orders • +{cell.avgDelay}d
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Clicked Heatmap Cell */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#070D22] border border-cyan-500/40 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-bold">
                  HEATMAP INTERACTIVE DRILL-DOWN
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  {selectedCell.mode.toUpperCase()} × {selectedCell.region.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Total Orders</span>
                <span className="text-base font-bold text-slate-100">
                  {selectedCell.data.shipments.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Late Risk %</span>
                <span className="text-base font-bold text-rose-400">
                  {selectedCell.data.risk}%
                </span>
              </div>
              <div className="p-3 rounded bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Avg Delay</span>
                <span className="text-base font-bold text-amber-400">
                  +{selectedCell.data.avgDelay}d
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              Shipments in the {selectedCell.region} sector utilizing {selectedCell.mode} freight exhibit a {selectedCell.data.risk}% late delivery risk score, averaging a +{selectedCell.data.avgDelay} day schedule overrun.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  updateFilter('shippingMode', selectedCell.mode);
                  navigate('/shipments');
                  setSelectedCell(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors flex items-center space-x-1.5"
              >
                <span>Filter Shipment Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
