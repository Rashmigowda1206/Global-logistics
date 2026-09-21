import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  BrainCircuit,
  Ship,
  Globe2,
  PackageSearch,
  Users2,
  Cpu,
  CheckSquare2,
  FileText,
  Radio,
  Clock,
  ShieldCheck,
  Building2,
  Coins,
  Award,
  Sliders,
  Sparkles,
  RefreshCw,
  TrendingDown
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useActions } from '../../context/ActionContext';
import { usePlatform } from '../../context/PlatformContext';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const { mode, setMode } = usePlatform();
  const { unreadCount } = useNotifications();
  const { tasks } = useActions();

  const criticalTasksCount = tasks.filter(t => t.column === 'CRITICAL').length;

  // Logistics nav items
  const logisticsNavItems = [
    { to: '/command-center', label: 'Command Center', icon: LayoutDashboard, badge: null },
    { to: '/network', label: 'Live Network', icon: Activity, badge: 'LIVE', badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    { to: '/performance', label: 'Delivery Performance', icon: BarChart3, badge: null },
    { to: '/delay-intelligence', label: 'Delay Intelligence', icon: BrainCircuit, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
    { to: '/shipping-modes', label: 'Shipping Modes', icon: Ship, badge: null },
    { to: '/regions', label: 'Regional Operations', icon: Globe2, badge: null },
    { to: '/shipments', label: 'Shipment Explorer', icon: PackageSearch, badge: null },
    { to: '/customers-products', label: 'Customer & Product', icon: Users2, badge: null },
    { to: '/simulator', label: 'What-If Simulator', icon: Cpu, badge: 'SIM', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
    { to: '/actions', label: 'Action Center', icon: CheckSquare2, badge: criticalTasksCount > 0 ? String(criticalTasksCount) : null, badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
    { to: '/reports', label: 'Reports', icon: FileText, badge: null },
  ];

  // Banking Churn nav items
  const bankingNavItems = [
    { to: '/banking', label: 'Churn Command Center', icon: LayoutDashboard, badge: '20.37%', badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
    { to: '/banking/geography', label: 'Regional Risk Radar', icon: Globe2, badge: '1.59x DE', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
    { to: '/banking/demographics', label: 'Demographic Cohorts', icon: Users2, badge: '67.3%', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
    { to: '/banking/financial-exposure', label: 'Deposit Flight & Wealth', icon: Coins, badge: '€110.8M', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
    { to: '/banking/customers', label: 'Customer Registry (10k)', icon: PackageSearch, badge: '10K', badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
    { to: '/banking/simulator', label: 'What-If Simulator', icon: Sliders, badge: 'SIM', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
    { to: '/banking/submission', label: 'Research & Submission Hub', icon: Award, badge: 'DOCX', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
  ];

  const currentNavItems = mode === 'banking' ? bankingNavItems : logisticsNavItems;

  return (
    <aside className="w-64 h-screen bg-[#070B19]/95 backdrop-blur-md border-r border-command-border/40 flex flex-col flex-shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 pb-3 border-b border-command-border/30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-purple-600/30 border border-blue-500/40 flex items-center justify-center shadow-hud">
            {mode === 'banking' ? (
              <Building2 className="w-5 h-5 text-blue-400" />
            ) : (
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse-glow" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-lg tracking-wider text-slate-100">
                {mode === 'banking' ? (
                  <>EURO<span className="text-blue-400">BANK</span></>
                ) : (
                  <>TRANSIT<span className="text-cyan-400">IQ</span></>
                )}
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30">
                {mode === 'banking' ? 'ECB v1.0' : 'v2.4'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
              {mode === 'banking' ? 'Churn & Segmentation Analytics' : 'Global Logistics Control Tower'}
            </p>
          </div>
        </div>

        {/* Dual Suite Platform Switcher */}
        <div className="mt-3 p-1 rounded-lg bg-[#040817] border border-slate-800 grid grid-cols-2 gap-1 font-mono text-[10px]">
          <button
            onClick={() => setMode('banking')}
            className={`py-1.5 px-2 rounded flex items-center justify-center space-x-1 transition-all ${
              mode === 'banking'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>🏦 Banking</span>
          </button>
          <button
            onClick={() => setMode('logistics')}
            className={`py-1.5 px-2 rounded flex items-center justify-center space-x-1 transition-all ${
              mode === 'logistics'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>🌐 Logistics</span>
          </button>
        </div>

        {/* Operational Status Pill */}
        <div className="mt-2.5 px-2.5 py-1 rounded bg-[#0A1226] border border-emerald-500/25 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono tracking-wide text-emerald-300 font-semibold">
              {mode === 'banking' ? '10K RECORDS LOADED' : 'SYSTEM OPERATIONAL'}
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-500">
            {mode === 'banking' ? 'ECB/UM' : '99.98%'}
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 custom-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
          {mode === 'banking' ? 'Banking Churn Modules' : 'Operations Core'}
        </div>
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === '/banking'
              ? location.pathname === '/banking'
              : item.to === '/command-center'
              ? location.pathname === '/command-center' || location.pathname === '/'
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`group flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 relative ${
                isActive
                  ? mode === 'banking'
                    ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40 shadow-sm'
                    : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-hud'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? mode === 'banking' ? 'text-blue-400' : 'text-cyan-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div className={`absolute right-1 w-1 h-3 rounded-full ${mode === 'banking' ? 'bg-blue-400' : 'bg-cyan-400'}`}></div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Telemetry Pod */}
      <div className="p-3 border-t border-command-border/30 bg-[#050914] space-y-2 text-[11px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span className="font-mono text-[10px]">
              {mode === 'banking' ? 'Empirical Sample' : 'Active Datafeed'}
            </span>
          </span>
          <span className="font-mono text-[10px] text-cyan-400 font-semibold">
            {mode === 'banking' ? '10,000 Accounts' : '128 Nodes'}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="font-mono text-[10px]">Baseline Churn</span>
          </span>
          <span className="font-mono text-[10px] text-rose-400 font-semibold">
            {mode === 'banking' ? '20.37% (Loss)' : '4.2s (Realtime)'}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono ${
              mode === 'banking' ? 'bg-blue-900/60 border-blue-500/40 text-blue-200' : 'bg-cyan-900/60 border-cyan-500/40 text-cyan-200'
            }`}>
              {mode === 'banking' ? 'EB' : 'LT'}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-200 leading-tight">
                {mode === 'banking' ? 'ECB Research Team' : 'Logistics Ops'}
              </span>
              <span className="text-[9px] text-slate-400">
                {mode === 'banking' ? 'Unified Mentor Study' : 'Control Room Alpha'}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 flex items-center">
            <ShieldCheck className="w-3 h-3 text-emerald-400 mr-0.5" /> SECURE
          </span>
        </div>
      </div>
    </aside>
  );
};
