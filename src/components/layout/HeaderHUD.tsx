import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  SlidersHorizontal,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  X,
  Building2,
  Radio
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useLogisticsFilter } from '../../context/FilterContext';
import { usePlatform } from '../../context/PlatformContext';
import { useNavigate } from 'react-router-dom';

interface HeaderHUDProps {
  onOpenSearch: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  onOpenSearch,
  showFilters,
  onToggleFilters,
}) => {
  const navigate = useNavigate();
  const { mode, setMode } = usePlatform();
  const { alerts, unreadCount, markAsRead, setSelectedAlert } = useNotifications();
  const { activeFilterCount, clearFilters } = useLogisticsFilter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeUtc, setTimeUtc] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-[#070B19]/90 backdrop-blur-md border-b border-command-border/30 px-5 flex items-center justify-between z-20 flex-shrink-0">
      {/* Left: Tagline & Telemetry Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full animate-ping ${mode === 'banking' ? 'bg-blue-400' : 'bg-cyan-400'}`}></div>
          <span className={`font-mono text-xs font-semibold tracking-wider ${mode === 'banking' ? 'text-blue-300' : 'text-cyan-300'}`}>
            {mode === 'banking' ? 'EUROBANK INTELLIGENCE' : 'NETWORK MONITOR'}
          </span>
        </div>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <span className="text-xs text-slate-400 hidden lg:inline font-mono">
          {mode === 'banking'
            ? 'Customer Segmentation & Churn Analytics in European Banking (10,000 Accounts)'
            : 'See the network. Predict the delay. Move smarter.'}
        </span>
      </div>

      {/* Center: Suite Switcher */}
      <div className="flex items-center space-x-2 bg-[#050914] p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setMode('banking')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-mono transition-all ${
            mode === 'banking'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">🏦 EuroBank Churn</span>
        </button>
        <button
          onClick={() => setMode('logistics')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-mono transition-all ${
            mode === 'logistics'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">🌐 TransitIQ Logistics</span>
        </button>
      </div>

      {/* Right: Search, Filter Toggle, Notifications & Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#0A1226] hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 text-xs text-slate-300 transition-all shadow-sm"
          title="Global Search (Cmd + K)"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Search network...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Filter Toggle Button */}
        <button
          onClick={onToggleFilters}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            showFilters
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-hud'
              : 'bg-[#0A1226] text-slate-300 border border-slate-700/60 hover:border-cyan-500/40'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-cyan-500 text-slate-950">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md bg-[#0A1226] hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 transition-all"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#070B19] border border-cyan-500/30 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
              <div className="p-3 border-b border-command-border/40 flex items-center justify-between bg-[#040711]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wide">
                    Live Incident Stream
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                  {unreadCount} UNREAD
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      markAsRead(alert.id);
                      setSelectedAlert(alert);
                      setShowNotifications(false);
                      if (alert.shipmentId) {
                        navigate(`/shipments/${alert.shipmentId}`);
                      }
                    }}
                    className="p-3 hover:bg-slate-800/50 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        {alert.severity === 'CRITICAL' && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        )}
                        {alert.severity === 'WARNING' && (
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        )}
                        {alert.severity === 'SUCCESS' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        )}
                        <span className="font-mono text-xs font-semibold text-slate-200">
                          {alert.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{alert.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{alert.description}</p>
                    {alert.location && (
                      <div className="text-[10px] font-mono text-cyan-400/80 flex items-center space-x-1 pt-0.5">
                        <span>Loc:</span>
                        <span className="underline">{alert.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-2 bg-[#050914] border-t border-command-border/30 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/network');
                  }}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-medium tracking-wide"
                >
                  View Full Live Network Feed →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Simulator CTA */}
        <button
          onClick={() => navigate('/simulator')}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 border border-purple-500/40 text-purple-200 text-xs font-medium transition-all shadow-hud-purple"
        >
          <Zap className="w-3.5 h-3.5 text-purple-300" />
          <span>Simulator</span>
        </button>
      </div>
    </header>
  );
};
