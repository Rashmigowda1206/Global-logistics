import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingDown,
  Navigation,
  ArrowRight,
  ExternalLink,
  Activity,
  Flame,
  Radio,
  Zap,
  Globe2
} from 'lucide-react';
import { useLogisticsFilter } from '../context/FilterContext';
import { OperationalMap } from '../components/map/OperationalMap';
import { RouteDetailDrawer } from '../components/common/RouteDetailDrawer';
import { TradeRoute } from '../types/logistics';
import { TRADE_ROUTES } from '../data/routesData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const { kpis, updateFilter } = useLogisticsFilter();
  const [selectedRoute, setSelectedRoute] = useState<TradeRoute | null>(null);

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1600px] mx-auto">
      <Breadcrumbs />

      {/* Top Area: Operational Greeting & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase font-bold tracking-wider">
              Control Tower HUD
            </span>
            <span className="text-slate-500 text-xs font-mono">• Sector 01</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-mono font-extrabold text-slate-100 tracking-tight">
            GOOD MORNING, LOGISTICS TEAM
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-mono mt-0.5">
            Your global shipment network is being monitored in real-time across 128 active terminals.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate('/network')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-colors shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Network</span>
          </button>
          <button
            onClick={() => navigate('/actions')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-rose-600/30 to-amber-600/30 hover:from-rose-600/50 hover:to-amber-600/50 border border-rose-500/40 text-rose-200 text-xs font-mono font-semibold transition-colors shadow-hud"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
            <span>Action Center</span>
          </button>
        </div>
      </div>

      {/* Compact Operational Indicators (Dense Control-Tower Layout) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono select-none">
        {/* Metric 1: Current Shipments */}
        <div
          onClick={() => navigate('/shipments')}
          className="p-3.5 rounded-xl bg-[#070D1E]/90 border border-cyan-500/20 hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-[#0B1530] group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-semibold text-slate-400">Current Shipments</span>
            <Package className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100 group-hover:text-cyan-300">
              {kpis.totalShipments}
            </span>
            <span className="text-[10px] text-cyan-400">active</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">
            Across 5 global markets
          </div>
        </div>

        {/* Metric 2: Shipments at Risk */}
        <div
          onClick={() => {
            updateFilter('riskLevel', 'HIGH');
            navigate('/shipments');
          }}
          className="p-3.5 rounded-xl bg-[#070D1E]/90 border border-amber-500/25 hover:border-amber-500/50 cursor-pointer transition-all hover:bg-[#0B1530] group shadow-hud-amber"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-semibold text-amber-300">Shipments at Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-300">
              {kpis.atRiskCount}
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">
              ({kpis.totalShipments > 0 ? Math.round((kpis.atRiskCount / kpis.totalShipments) * 100) : 0}%)
            </span>
          </div>
          <div className="text-[10px] text-amber-400/80 mt-1 truncate">
            Elevated chokepoint probability
          </div>
        </div>

        {/* Metric 3: Delayed Shipments */}
        <div
          onClick={() => {
            updateFilter('deliveryStatus', 'DELAYED');
            navigate('/shipments');
          }}
          className="p-3.5 rounded-xl bg-[#070D1E]/90 border border-rose-500/25 hover:border-rose-500/50 cursor-pointer transition-all hover:bg-[#0B1530] group shadow-hud-red"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-semibold text-rose-300">Delayed Shipments</span>
            <Flame className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-400">
              {kpis.delayedCount}
            </span>
            <span className="text-[10px] text-rose-300 font-semibold">
              ({kpis.totalShipments > 0 ? Math.round((kpis.delayedCount / kpis.totalShipments) * 100) : 0}%)
            </span>
          </div>
          <div className="text-[10px] text-rose-400/80 mt-1 truncate">
            Delay gap &gt; 0 days
          </div>
        </div>

        {/* Metric 4: On-Time Percentage */}
        <div
          onClick={() => navigate('/performance')}
          className="p-3.5 rounded-xl bg-[#070D1E]/90 border border-emerald-500/25 hover:border-emerald-500/50 cursor-pointer transition-all hover:bg-[#0B1530] group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-semibold text-emerald-300">On-Time Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400">
              {kpis.onTimeRate}%
            </span>
            <span className="text-[10px] text-emerald-500">SLA standard</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">
            {kpis.earlyCount} early + {kpis.onScheduleCount} on schedule
          </div>
        </div>

        {/* Metric 5: Average Delay */}
        <div
          onClick={() => navigate('/delay-intelligence')}
          className="p-3.5 rounded-xl bg-[#070D1E]/90 border border-purple-500/25 hover:border-purple-500/50 cursor-pointer transition-all hover:bg-[#0B1530] group shadow-hud-purple"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="text-[11px] font-semibold text-purple-300">Average Delay</span>
            <Clock className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-purple-300">
              +{kpis.avgDelayDays}d
            </span>
            <span className="text-[10px] text-purple-400">variance</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 truncate">
            SLA target: &le; 0.5 days
          </div>
        </div>
      </div>

      {/* Main Command Center Area: Operational World Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
              Network World Overview • Trade Lanes & Port Density
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click any trade corridor to inspect terminal bottlenecks or simulate rerouting
          </span>
        </div>

        <OperationalMap
          onSelectRoute={(route) => setSelectedRoute(route)}
          selectedRouteId={selectedRoute?.id}
        />
      </div>

      {/* Active Corridors Status Bar */}
      <div className="bg-[#070D1E]/90 border border-cyan-500/20 rounded-xl p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200 uppercase tracking-wide">
              Major Global Corridors Status
            </span>
          </div>
          <button
            onClick={() => navigate('/regions')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
          >
            <span>Regional Ops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {TRADE_ROUTES.map((route) => (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className="p-2.5 rounded-lg bg-[#0A132C] hover:bg-[#101D40] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-200 block truncate">{route.name}</span>
                <span className="text-[10px] text-slate-400">
                  {route.shipmentsCount} units • +{route.avgDelayDays}d avg
                </span>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                  route.status === 'DELAYED'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : route.status === 'AT_RISK'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {route.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Flyout Route Details Drawer */}
      <RouteDetailDrawer
        route={selectedRoute}
        onClose={() => setSelectedRoute(null)}
      />
    </div>
  );
};
