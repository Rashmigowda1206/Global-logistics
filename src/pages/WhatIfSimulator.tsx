import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Zap,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLogisticsFilter } from '../context/FilterContext';
import { useActions } from '../context/ActionContext';
import { SimulationScenario } from '../types/logistics';
import { runSimulationCalculation } from '../services/logisticsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';

export const WhatIfSimulator: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shipments } = useLogisticsFilter();
  const { addTask } = useActions();

  // Parse preset values if opened from a route or alert
  const state = (location.state || {}) as any;

  const defaultScenario: SimulationScenario = {
    shippingMode: state.presetMode || 'All',
    region: state.presetRoute ? 'Pacific Asia' : 'All',
    portCongestion: state.presetCongestion || 45,
    customsDelayDays: state.presetCustoms || 2.0,
    volumeMultiplier: 1.0,
    warehouseProcessingDays: 2.0,
  };

  const [scenario, setScenario] = useState<SimulationScenario>(defaultScenario);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  // Compute live simulation result
  const simResult = runSimulationCalculation(shipments, scenario);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 700);
  };

  const handleReset = () => {
    setScenario(defaultScenario);
    setHasRun(false);
  };

  const handleCreateActionFromSimulation = () => {
    addTask({
      title: `Implement Simulation Plan: ${scenario.shippingMode} (${scenario.region})`,
      column: 'HIGH_PRIORITY',
      impact: 'HIGH',
      affectedShipments: simResult.affectedShipmentsCount,
      recommendedAction: `Apply parameters: Port congestion buffer ${scenario.portCongestion}%, Customs SLA ${scenario.customsDelayDays}d. Expected delay drop of ${simResult.delta.delayReductionDays}d.`,
      deadline: 'Next Cycle',
      owner: 'Operational Strategy Lead',
      category: 'Simulated Scenario'
    });
    navigate('/actions');
  };

  // Chart comparison data
  const comparisonData = [
    {
      metric: 'On-Time Rate %',
      Current: simResult.current.onTimeRate,
      Simulated: simResult.simulated.onTimeRate,
    },
    {
      metric: 'SLA Compliance %',
      Current: simResult.current.slaCompliance,
      Simulated: simResult.simulated.slaCompliance,
    },
    {
      metric: 'Late Risk %',
      Current: simResult.current.lateRiskRate,
      Simulated: simResult.simulated.lateRiskRate,
    },
    {
      metric: 'Avg Delay (Days)',
      Current: simResult.current.avgDelayDays,
      Simulated: simResult.simulated.avgDelayDays,
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              OPERATIONAL SANDBOX
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            LOGISTICS SIMULATOR
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test operational decisions before implementing them. Model chokepoint shifts, mode migration, and queue physics.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET SCENARIO</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-hud-purple transition-all disabled:opacity-50"
          >
            {isSimulating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            <span>{isSimulating ? 'SIMULATING...' : 'RUN SIMULATION'}</span>
          </button>
        </div>
      </div>

      {/* Simulation Complete Celebration / Delta Banner */}
      {hasRun && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 shadow-hud-purple flex flex-col md:flex-row items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-400">Simulation Complete ✓</span>
                <span className="text-[10px] text-slate-400">• Dynamic Network Equilibrium Reached</span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Potential delay change: <strong className={simResult.delta.delayReductionDays >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{simResult.delta.delayReductionDays > 0 ? `-${simResult.delta.delayReductionDays} days` : `+${Math.abs(simResult.delta.delayReductionDays)} days`}</strong> | SLA change: <strong className="text-cyan-300">+{simResult.delta.slaImprovementPercent}%</strong> | Affected orders: <strong>{simResult.affectedShipmentsCount}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateActionFromSimulation}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-hud transition-all flex items-center space-x-1.5 whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Create Action from Scenario</span>
          </button>
        </div>
      )}

      {/* Main Grid: Inputs (Left 5 cols) + Comparison (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Scenario Builder Inputs */}
        <div className="lg:col-span-5 bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                SCENARIO BUILDER LEVERS
              </h2>
            </div>
            <span className="text-[10px] text-slate-500">Physics Engine v2.4</span>
          </div>

          {/* Controls */}
          <div className="space-y-4 text-xs">
            {/* Shipping Mode */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold block">Shipping Mode Target</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['All', 'Air', 'Sea', 'Road', 'Rail'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setScenario({ ...scenario, shippingMode: mode })}
                    className={`py-1.5 rounded-md border text-center font-semibold transition-all ${
                      scenario.shippingMode === mode
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-hud'
                        : 'bg-[#0A132C] text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Target */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold block">Region Focus</label>
              <select
                value={scenario.region}
                onChange={(e) => setScenario({ ...scenario, region: e.target.value })}
                className="w-full bg-[#0A132C] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="All">Global Network (All Regions)</option>
                <option value="Europe">Europe Corridor</option>
                <option value="Pacific Asia">Pacific Asia Trade Lanes</option>
                <option value="USCA">North America (USCA)</option>
                <option value="LATAM">Latin America</option>
                <option value="Africa">Africa & Middle East</option>
              </select>
            </div>

            {/* Port Congestion slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Terminal & Port Congestion:</span>
                <span className="font-bold text-amber-400">{scenario.portCongestion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scenario.portCongestion}
                onChange={(e) => setScenario({ ...scenario, portCongestion: Number(e.target.value) })}
                className="w-full accent-amber-400 h-2 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% Fluid</span>
                <span>50% Nominal</span>
                <span>100% Saturated</span>
              </div>
            </div>

            {/* Customs Delay slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Customs Clearance Delay:</span>
                <span className="font-bold text-purple-300">{scenario.customsDelayDays} days</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={scenario.customsDelayDays}
                onChange={(e) => setScenario({ ...scenario, customsDelayDays: Number(e.target.value) })}
                className="w-full accent-purple-400 h-2 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0d Instant</span>
                <span>2d Standard</span>
                <span>10d Critical Audit</span>
              </div>
            </div>

            {/* Shipment Volume slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Shipment Volume Scale:</span>
                <span className="font-bold text-cyan-400">{scenario.volumeMultiplier}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={scenario.volumeMultiplier}
                onChange={(e) => setScenario({ ...scenario, volumeMultiplier: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.5x Light</span>
                <span>1.0x Baseline</span>
                <span>2.0x Surge (Peak)</span>
              </div>
            </div>

            {/* Warehouse Processing Delay */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Warehouse Cross-Dock Dwell:</span>
                <span className="font-bold text-slate-200">{scenario.warehouseProcessingDays} days</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={scenario.warehouseProcessingDays}
                onChange={(e) => setScenario({ ...scenario, warehouseProcessingDays: Number(e.target.value) })}
                className="w-full accent-blue-400 h-2 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0d Cross-dock</span>
                <span>2d Normal</span>
                <span>10d Heavy Sort</span>
              </div>
            </div>
          </div>
        </div>

        {/* CURRENT SCENARIO vs SIMULATED SCENARIO (7 cols) */}
        <div className="lg:col-span-7 bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              CURRENT SCENARIO vs SIMULATED SCENARIO
            </h2>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center space-x-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600"></span>
                <span>Current</span>
              </span>
              <span className="flex items-center space-x-1 text-purple-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
                <span>Simulated</span>
              </span>
            </div>
          </div>

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Average Delay</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-slate-400 line-through">+{simResult.current.avgDelayDays}d</span>
                <span className={`text-base font-bold ${simResult.simulated.avgDelayDays < simResult.current.avgDelayDays ? 'text-emerald-400' : 'text-rose-400'}`}>
                  +{simResult.simulated.avgDelayDays}d
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">On-Time Delivery</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-slate-400 line-through">{simResult.current.onTimeRate}%</span>
                <span className={`text-base font-bold ${simResult.simulated.onTimeRate >= simResult.current.onTimeRate ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simResult.simulated.onTimeRate}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Late Delivery Risk</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-slate-400 line-through">{simResult.current.lateRiskRate}%</span>
                <span className={`text-base font-bold ${simResult.simulated.lateRiskRate <= simResult.current.lateRiskRate ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simResult.simulated.lateRiskRate}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SLA Compliance</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-slate-400 line-through">{simResult.current.slaCompliance}%</span>
                <span className={`text-base font-bold ${simResult.simulated.slaCompliance >= simResult.current.slaCompliance ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simResult.simulated.slaCompliance}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Estimated Freight Cost</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-slate-400 line-through">${(simResult.current.totalEstimatedCost / 1000).toFixed(0)}k</span>
                <span className="text-base font-bold text-cyan-300">
                  ${(simResult.simulated.totalEstimatedCost / 1000).toFixed(0)}k
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Affected Shipments</span>
              <span className="text-base font-bold text-slate-100 block mt-0.5">
                {simResult.affectedShipmentsCount} orders
              </span>
            </div>
          </div>

          {/* Side-by-Side Recharts Visual Comparison */}
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E294B" opacity={0.4} />
                <XAxis dataKey="metric" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#070D1E', borderColor: '#8B5CF6', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Current" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Simulated" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
