import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Navigation,
  AlertTriangle,
  Ship,
  Clock,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Zap,
  TrendingDown
} from 'lucide-react';
import { TradeRoute } from '../../types/logistics';
import { useLogisticsFilter } from '../../context/FilterContext';

interface RouteDetailDrawerProps {
  route: TradeRoute | null;
  onClose: () => void;
}

export const RouteDetailDrawer: React.FC<RouteDetailDrawerProps> = ({ route, onClose }) => {
  const navigate = useNavigate();
  const { updateFilter } = useLogisticsFilter();

  if (!route) return null;

  const handleInspectRoute = () => {
    // Filter shipments by destination country or origin city
    updateFilter('searchQuery', route.destination.split(' ')[0] || route.name.split('→')[0].trim());
    navigate('/shipments');
    onClose();
  };

  const handleSimulateReroute = () => {
    navigate('/simulator', {
      state: {
        presetMode: route.mode,
        presetRoute: route.name,
        presetCongestion: route.congestionLevel
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 md:w-[420px] bg-[#070B19]/95 backdrop-blur-2xl border-l border-cyan-500/30 z-40 shadow-2xl flex flex-col animate-slide-left">
      {/* Header */}
      <div className="p-4 bg-[#050914] border-b border-command-border/40 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {route.code} • TRADE CORRIDOR
            </span>
            <h3 className="font-mono text-base font-bold text-slate-100">
              {route.name}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-xs">
        {/* Status Badge */}
        <div className="p-3 rounded-lg bg-[#0B1533] border border-cyan-500/20 flex items-center justify-between">
          <span className="text-slate-400 font-mono text-[11px]">Corridor Status:</span>
          <span
            className={`px-2.5 py-0.5 rounded font-mono font-bold text-[11px] ${
              route.status === 'DELAYED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : route.status === 'AT_RISK'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {route.status}
          </span>
        </div>

        {/* Operational Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="p-3 rounded-lg bg-[#0A1229] border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Active Shipments</span>
            <span className="text-lg font-bold text-cyan-300">
              {route.shipmentsCount.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-500 block">in-transit units</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0A1229] border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Average Delay</span>
            <span className="text-lg font-bold text-amber-400">
              +{route.avgDelayDays} days
            </span>
            <span className="text-[9px] text-slate-500 block">vs schedule</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0A1229] border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Delay Risk Index</span>
            <span className="text-lg font-bold text-rose-400">
              {route.riskScore}%
            </span>
            <div className="w-full bg-slate-800 h-1 rounded mt-1.5 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded"
                style={{ width: `${route.riskScore}%` }}
              ></div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0A1229] border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Chokepoint Density</span>
            <span className="text-lg font-bold text-cyan-400">
              {route.congestionLevel}%
            </span>
            <span className="text-[9px] text-slate-500 block">terminal queue</span>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Terminal Endpoints
          </span>
          <div className="p-3 rounded-lg bg-[#0A1229] border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Origin Terminal:</span>
              <span className="text-slate-200 font-semibold">{route.origin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Destination:</span>
              <span className="text-slate-200 font-semibold">{route.destination}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Est. Nautical Distance:</span>
              <span className="text-cyan-400">{route.distanceKm.toLocaleString()} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Primary Mode:</span>
              <span className="text-slate-200">{route.mode} Freight</span>
            </div>
          </div>
        </div>

        {/* Primary Bottleneck / Top Issue */}
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-amber-300 font-mono text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>PRIMARY BOTTLENECK</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed font-mono">
            {route.topIssue}
          </p>
          {route.alternateRouteDescription && (
            <div className="pt-2 border-t border-amber-500/20 text-[11px] text-slate-300 font-mono">
              <span className="text-cyan-400 font-semibold">Bypass Strategy: </span>
              {route.alternateRouteDescription}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="p-4 bg-[#050914] border-t border-command-border/40 grid grid-cols-2 gap-3">
        <button
          onClick={handleInspectRoute}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Inspect Route</span>
        </button>

        <button
          onClick={handleSimulateReroute}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-mono font-semibold transition-colors shadow-hud-purple"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Reroute</span>
        </button>
      </div>
    </div>
  );
};
