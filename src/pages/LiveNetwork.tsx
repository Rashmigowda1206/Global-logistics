import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Play,
  Pause,
  Clock,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Ship,
  Plane,
  Truck,
  Train,
  ArrowRight,
  ExternalLink,
  Flame,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { NETWORK_NODES } from '../data/networkNodes';
import { TRADE_ROUTES } from '../data/routesData';
import { useNotifications } from '../context/NotificationContext';
import { LiveAlert } from '../types/logistics';
import { IncidentDetailModal } from '../components/common/IncidentDetailModal';

const TIME_STEPS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

export const LiveNetwork: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, setSelectedAlert } = useNotifications();
  const [activeTimeIndex, setActiveTimeIndex] = useState(3); // 11:00 default
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNodeFilter, setSelectedNodeFilter] = useState<'ALL' | 'PORT' | 'WAREHOUSE' | 'DC'>('ALL');

  // Auto-play interval for timeline scrubber
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveTimeIndex((prev) => (prev + 1) % TIME_STEPS.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentTime = TIME_STEPS[activeTimeIndex];

  // Dynamically compute node traffic multipliers based on timeline hour
  const trafficMultiplier = 0.8 + (activeTimeIndex * 0.12);

  const filteredNodes = NETWORK_NODES.filter((node) => {
    if (selectedNodeFilter === 'ALL') return true;
    return node.type === selectedNodeFilter;
  });

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              REAL-TIME TELEMETRY ENGINE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            LIVE NETWORK
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active container vessels, cargo air corridors, and hub dwell status at {currentTime} UTC
          </p>
        </div>

        {/* Node Category Filters */}
        <div className="flex items-center space-x-1.5 bg-[#070D1E] p-1 rounded-lg border border-slate-700/60 text-xs">
          {(['ALL', 'PORT', 'WAREHOUSE', 'DC'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedNodeFilter(cat)}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                selectedNodeFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Hubs' : cat === 'PORT' ? 'Ports (12)' : cat === 'WAREHOUSE' ? 'Warehouses' : 'Dist. Centers'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visual Network Monitor (Left 8 cols) + Live Alert Feed (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Active Hubs and Moving Corridor Telemetry */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-slate-200">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-wide">
                  Active Terminal Throughput & Vessel Queue ({currentTime} UTC)
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                LIVE DWELL INDEX
              </span>
            </div>

            {/* Node Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {filteredNodes.map((node) => {
                const liveCongestion = Math.min(99, Math.round(node.congestionScore * trafficMultiplier));
                const liveVessels = Math.round(node.activeVesselsOrFlights * trafficMultiplier);

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      // Navigate to regions or open modal
                      navigate(`/regions`);
                    }}
                    className="p-3.5 rounded-lg bg-[#0A132C] hover:bg-[#101D40] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">
                          {node.type === 'PORT' ? '⚓' : node.type === 'WAREHOUSE' ? '🏭' : '📦'}
                        </span>
                        <div>
                          <span className="font-bold text-slate-200 group-hover:text-cyan-300 block">
                            {node.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {node.country} • {node.region}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                          liveCongestion > 75
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : liveCongestion > 50
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {liveCongestion > 75 ? 'CONGESTED' : liveCongestion > 50 ? 'HEAVY' : 'FLUID'}
                      </span>
                    </div>

                    {/* Telemetry metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px]">Congestion</span>
                        <span className={`font-bold ${liveCongestion > 70 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {liveCongestion}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Active Craft</span>
                        <span className="text-cyan-300 font-bold">{liveVessels} units</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Avg Dwell</span>
                        <span className="text-amber-400 font-bold">{node.avgDwellDays}d</span>
                      </div>
                    </div>

                    {/* Congestion Level Bar */}
                    <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                      <div
                        className={`h-full rounded transition-all duration-500 ${
                          liveCongestion > 75 ? 'bg-rose-500' : liveCongestion > 50 ? 'bg-amber-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${liveCongestion}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Timeline Scrubber at Bottom */}
          <div className="bg-[#070D1E]/95 border border-cyan-500/30 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-200 uppercase tracking-wide">
                  NETWORK TIMELINE SCRUBBER
                </span>
                <span className="text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  {currentTime} UTC
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    isPlaying
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-hud'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'PAUSE' : 'SIMULATE REALTIME'}</span>
                </button>
                <button
                  onClick={() => setActiveTimeIndex(0)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  title="Reset Timeline to 08:00"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Timeline hour buttons */}
            <div className="grid grid-cols-6 gap-2">
              {TIME_STEPS.map((hour, idx) => {
                const isCurrent = idx === activeTimeIndex;
                return (
                  <button
                    key={hour}
                    onClick={() => setActiveTimeIndex(idx)}
                    className={`py-2 px-1 rounded-lg border text-center transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-hud font-bold'
                        : 'bg-[#0A132C] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs">{hour}</span>
                    <span className="text-[9px] opacity-70 block font-normal">
                      {idx < 2 ? 'Morning' : idx < 4 ? 'Peak Midday' : 'Shift Change'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: LIVE ALERT FEED (Dedicated operations incident ticker) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs uppercase tracking-wide text-slate-200">
                  LIVE ALERT FEED
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Auto-streaming</span>
            </div>

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto custom-scrollbar pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="p-3 rounded-lg bg-[#0A132C] hover:bg-[#101F44] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-500 animate-ping'
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      ></span>
                      <span className="font-bold text-xs text-slate-200 group-hover:text-cyan-300">
                        {alert.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">{alert.timeAgo}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    {alert.shipmentId ? (
                      <span className="text-cyan-400 font-bold underline">
                        Order: {alert.shipmentId}
                      </span>
                    ) : (
                      <span className="text-slate-500">{alert.location}</span>
                    )}

                    <span className="text-slate-400 group-hover:text-cyan-300 flex items-center space-x-0.5">
                      <span>Investigate</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <IncidentDetailModal />
    </div>
  );
};
