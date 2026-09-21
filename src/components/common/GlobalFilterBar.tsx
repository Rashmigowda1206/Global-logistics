import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { useLogisticsFilter } from '../../context/FilterContext';

export const GlobalFilterBar: React.FC = () => {
  const { filters, updateFilter, clearFilters, activeFilterCount, shipments, allShipments } = useLogisticsFilter();

  return (
    <div className="bg-[#070D1E]/95 border-b border-cyan-500/20 px-5 py-3 backdrop-blur-md transition-all duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-mono text-xs font-semibold uppercase pr-2 border-r border-slate-700/60">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Global Filters</span>
          </div>

          {/* Shipping Mode Filter */}
          <div className="flex items-center space-x-1">
            <label className="text-[11px] text-slate-400 font-mono">Mode:</label>
            <select
              value={filters.shippingMode}
              onChange={(e) => updateFilter('shippingMode', e.target.value)}
              className="bg-[#0B142B] border border-slate-700/70 hover:border-cyan-500/50 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="All">All Modes</option>
              <option value="Sea">🚢 Sea Freight</option>
              <option value="Air">✈ Air Cargo</option>
              <option value="Road">🚛 Road Linehaul</option>
              <option value="Rail">🚆 Intermodal Rail</option>
            </select>
          </div>

          {/* Market Filter */}
          <div className="flex items-center space-x-1">
            <label className="text-[11px] text-slate-400 font-mono">Market:</label>
            <select
              value={filters.market}
              onChange={(e) => updateFilter('market', e.target.value)}
              className="bg-[#0B142B] border border-slate-700/70 hover:border-cyan-500/50 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="All">All Markets</option>
              <option value="Pacific Asia">Pacific Asia</option>
              <option value="Europe">Europe</option>
              <option value="USCA">North America (USCA)</option>
              <option value="LATAM">Latin America (LATAM)</option>
              <option value="Africa">Africa & Middle East</option>
            </select>
          </div>

          {/* Delivery Status Filter */}
          <div className="flex items-center space-x-1">
            <label className="text-[11px] text-slate-400 font-mono">Status:</label>
            <select
              value={filters.deliveryStatus}
              onChange={(e) => updateFilter('deliveryStatus', e.target.value)}
              className="bg-[#0B142B] border border-slate-700/70 hover:border-cyan-500/50 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="All">All Statuses</option>
              <option value="ON SCHEDULE">🟢 On Schedule (0d gap)</option>
              <option value="EARLY">🔵 Early (&lt;0d gap)</option>
              <option value="DELAYED">🔴 Delayed (&gt;0d gap)</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center space-x-1">
            <label className="text-[11px] text-slate-400 font-mono">Risk Level:</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => updateFilter('riskLevel', e.target.value)}
              className="bg-[#0B142B] border border-slate-700/70 hover:border-cyan-500/50 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="All">All Risk Levels</option>
              <option value="HIGH">🔴 High Risk (&gt;60%)</option>
              <option value="MEDIUM">🟡 Moderate (30–60%)</option>
              <option value="LOW">🟢 Low Risk (&lt;30%)</option>
            </select>
          </div>

          {/* Customer Segment */}
          <div className="flex items-center space-x-1">
            <label className="text-[11px] text-slate-400 font-mono">Segment:</label>
            <select
              value={filters.customerSegment}
              onChange={(e) => updateFilter('customerSegment', e.target.value)}
              className="bg-[#0B142B] border border-slate-700/70 hover:border-cyan-500/50 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="All">All Segments</option>
              <option value="Consumer">Consumer</option>
              <option value="Corporate">Corporate</option>
              <option value="Industrial">Industrial</option>
              <option value="Home Office">Home Office</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
            </select>
          </div>
        </div>

        {/* Right: Active counter & Reset */}
        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono text-slate-400">
            Matching: <span className="text-cyan-300 font-bold">{shipments.length}</span> of {allShipments.length} shipments
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
