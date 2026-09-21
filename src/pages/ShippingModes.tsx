import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  Ship,
  Plane,
  Truck,
  Train,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLogisticsFilter } from '../context/FilterContext';
import { getModeComparison } from '../services/logisticsService';

export const ShippingModes: React.FC = () => {
  const navigate = useNavigate();
  const { shipments, updateFilter } = useLogisticsFilter();
  const modeStats = getModeComparison(shipments);

  const [selectedModeKey, setSelectedModeKey] = useState<'Air' | 'Sea' | 'Road' | 'Rail'>('Sea');
  const [sliderSplit, setSliderSplit] = useState(30); // 30% Air, 70% Sea

  const selectedMode = modeStats.find(m => m.mode === selectedModeKey) || modeStats[1];

  // Radar comparison data
  const radarData = [
    { metric: 'Speed / Velocity', Air: 95, Sea: 25, Road: 70, Rail: 60 },
    { metric: 'On-Time SLA %', Air: 94, Sea: 58, Road: 82, Rail: 74 },
    { metric: 'Cost Efficiency', Air: 30, Sea: 95, Road: 65, Rail: 85 },
    { metric: 'Capacity / Volume', Air: 40, Sea: 98, Road: 60, Rail: 80 },
    { metric: 'Low Delay Risk', Air: 88, Sea: 26, Road: 68, Rail: 58 },
  ];

  const getIcon = (mode: string) => {
    if (mode === 'Air') return Plane;
    if (mode === 'Sea') return Ship;
    if (mode === 'Road') return Truck;
    return Train;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Ship className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              MULTI-MODAL BENCHMARKING
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            SHIPPING MODE INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Intermodal tradeoffs, velocity benchmarks, and SLA compliance across Air, Sea, Road, and Rail
          </p>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-hud-purple transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Modal Shift</span>
        </button>
      </div>

      {/* Mode Comparison KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modeStats.map((item) => {
          const Icon = getIcon(item.mode);
          const isSelected = item.mode === selectedModeKey;

          return (
            <div
              key={item.mode}
              onClick={() => setSelectedModeKey(item.mode as any)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#0B1736] border-cyan-400 shadow-hud'
                  : 'bg-[#070D1E]/90 border-slate-800 hover:border-slate-700 hover:bg-[#0A132A]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-slate-100">{item.mode} Freight</h2>
                    <span className="text-[10px] text-slate-400">{item.volume} monitored orders</span>
                  </div>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    item.onTimeRate >= 85
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.onTimeRate >= 70
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {item.onTimeRate}% ON-TIME
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 block">Avg Delay</span>
                  <span className={`font-bold ${item.avgDelay > 2 ? 'text-rose-400' : 'text-slate-200'}`}>
                    +{item.avgDelay} days
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Late Risk</span>
                  <span className={`font-bold ${item.riskScore > 60 ? 'text-rose-400' : 'text-amber-300'}`}>
                    {item.riskScore}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Cost Efficiency</span>
                  <span className="font-bold text-cyan-300">{item.costEfficiency}/100</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">SLA Compliance</span>
                  <span className="font-bold text-emerald-400">{item.slaCompliance}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Radar Comparison Chart + Interactive Mode Comparison Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Radar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                MULTI-MODAL CAPABILITY RADAR
              </h2>
              <p className="text-[11px] text-slate-400">
                Balanced score comparison across operational trade-offs
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="text-cyan-400">● Air</span>
              <span className="text-blue-500">● Sea</span>
              <span className="text-amber-400">● Road</span>
              <span className="text-emerald-400">● Rail</span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1E294B" />
                <PolarAngleAxis dataKey="metric" stroke="#94A3B8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={9} />
                <Radar name="Air" dataKey="Air" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.25} />
                <Radar name="Sea" dataKey="Sea" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                <Radar name="Road" dataKey="Road" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} />
                <Radar name="Rail" dataKey="Rail" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                <Tooltip contentStyle={{ backgroundColor: '#070D1E', borderColor: '#06B6D4', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Mode Comparison Slider: AIR vs SEA (6 cols) */}
        <div className="lg:col-span-6 bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                MODAL SPLIT TRADE-OFF SLIDER (AIR vs SEA)
              </h2>
              <p className="text-[11px] text-slate-400">
                Move slider to evaluate transit speed vs freight cost dynamics
              </p>
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
              SIMULATION READY
            </span>
          </div>

          {/* Slider Control */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-300">✈ Air: {sliderSplit}%</span>
              <span className="font-bold text-blue-400">🚢 Sea: {100 - sliderSplit}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderSplit}
              onChange={(e) => setSliderSplit(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="grid grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Projected Delay</span>
                <span className="text-base font-bold text-amber-400">
                  +{(3.4 - (sliderSplit * 0.028)).toFixed(1)} days
                </span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">
                  -{(sliderSplit * 0.028).toFixed(1)}d savings
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">SLA Compliance</span>
                <span className="text-base font-bold text-emerald-400">
                  {(65 + (sliderSplit * 0.32)).toFixed(1)}%
                </span>
                <span className="text-[9px] text-cyan-400 block mt-0.5">
                  +{(sliderSplit * 0.32).toFixed(1)}% boost
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Freight Premium</span>
                <span className="text-base font-bold text-rose-400">
                  +{Math.round(sliderSplit * 0.65)}%
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  Est. carrier cost
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              At a {sliderSplit}% Air / {100 - sliderSplit}% Sea allocation, lead time shrinks by {(sliderSplit * 0.028).toFixed(1)} days, mitigating high-severity terminal congestion at the cost of a {Math.round(sliderSplit * 0.65)}% freight expense expansion.
            </p>

            <button
              onClick={() => {
                navigate('/simulator', {
                  state: {
                    presetMode: sliderSplit > 50 ? 'Air' : 'Sea',
                    presetCongestion: 100 - sliderSplit
                  }
                });
              }}
              className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Launch Detailed Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Selected Mode Drill-Down Details */}
      <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              {selectedMode.mode.toUpperCase()} FREIGHT DETAILED PROFILE
            </span>
          </div>
          <button
            onClick={() => {
              updateFilter('shippingMode', selectedMode.mode);
              navigate('/shipments');
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>View All {selectedMode.mode} Shipments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0A132C] border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Top Corridors for {selectedMode.mode}
            </span>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div>• Singapore PSA → Rotterdam Maasvlakte</div>
              <div>• Shanghai Yangshan → Port of Los Angeles</div>
              <div>• Santos Container Terminal → Le Havre</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0A132C] border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Predominant Product Categories
            </span>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div>• Industrial Heavy Machinery & Fasteners (44%)</div>
              <div>• Consumer Electronics & Sensor Modules (32%)</div>
              <div>• Automotive Precision Transmissions (24%)</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0A132C] border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Delay Mitigation Recommendation
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {selectedMode.mode === 'Sea'
                ? 'High berth wait times dictate early booking on express feeder loops and dual-port discharge alternatives.'
                : selectedMode.mode === 'Air'
                ? 'Maintain direct airport cargo clearance to safeguard premium SLA yields for high-margin electronics.'
                : 'Optimize intermodal railheads to bypass metropolitan highway toll chokepoints.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
