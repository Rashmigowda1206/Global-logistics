import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Package,
  User,
  Globe,
  Tag,
  Route,
  Bell,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MOCK_SHIPMENTS } from '../../data/mockLogisticsData';
import { TRADE_ROUTES } from '../../data/routesData';
import { INITIAL_ALERTS } from '../../data/alertsData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        shipments: MOCK_SHIPMENTS.slice(0, 3),
        routes: TRADE_ROUTES.slice(0, 2),
        regions: [
          { name: 'Europe Operations', path: '/regions/europe' },
          { name: 'Germany Profile', path: '/regions/europe/germany' },
          { name: 'Asia Pacific Lane', path: '/regions/asia' }
        ],
        alerts: INITIAL_ALERTS.slice(0, 2)
      };
    }

    const shipments = MOCK_SHIPMENTS.filter(
      s =>
        s.orderId.toLowerCase().includes(q) ||
        s.customerFname.toLowerCase().includes(q) ||
        s.productName.toLowerCase().includes(q) ||
        s.orderCountry.toLowerCase().includes(q)
    ).slice(0, 4);

    const routes = TRADE_ROUTES.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q)
    ).slice(0, 3);

    const regions = [
      { name: 'Europe Operations', path: '/regions/europe', keywords: 'europe eu germany france' },
      { name: 'Germany Logistics Profile', path: '/regions/europe/germany', keywords: 'germany de hamburg berlin' },
      { name: 'Asia Pacific Operations', path: '/regions/asia', keywords: 'asia pacific china singapore tokyo' },
      { name: 'North America Operations', path: '/regions/north-america', keywords: 'usca north america usa canada' },
      { name: 'Latin America Operations', path: '/regions/south-america', keywords: 'latam south america brazil santos' }
    ].filter(r => r.name.toLowerCase().includes(q) || r.keywords.includes(q));

    const alerts = INITIAL_ALERTS.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.shipmentId && a.shipmentId.toLowerCase().includes(q))
    ).slice(0, 3);

    return { shipments, routes, regions, alerts };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#080E24] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-command-border/40 flex items-center space-x-3 bg-[#050916]">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shipments (SO-44321), customers, routes, regions, products..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:text-cyan-400 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
          {/* Shipments Section */}
          {searchResults.shipments.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <Package className="w-3.5 h-3.5" />
                <span>Shipments</span>
              </div>
              <div className="space-y-1.5">
                {searchResults.shipments.map((s) => (
                  <div
                    key={s.orderId}
                    onClick={() => {
                      onClose();
                      navigate(`/shipments/${s.orderId}`);
                    }}
                    className="p-2.5 rounded-lg bg-[#0B1530] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-cyan-300 group-hover:text-cyan-200">
                        {s.orderId}
                      </span>
                      <span className="text-slate-400">{s.customerFname} ({s.customerCity})</span>
                      <span className="text-slate-500">• {s.productName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          s.deliveryClassification === 'DELAYED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : s.deliveryClassification === 'EARLY'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {s.deliveryClassification}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trade Routes Section */}
          {searchResults.routes.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <Route className="w-3.5 h-3.5" />
                <span>Trade Corridors</span>
              </div>
              <div className="space-y-1.5">
                {searchResults.routes.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onClose();
                      navigate(`/?route=${r.id}`);
                    }}
                    className="p-2.5 rounded-lg bg-[#0B1530] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-200 group-hover:text-cyan-300">
                        {r.name}
                      </span>
                      <p className="text-[11px] text-slate-400">Issue: {r.topIssue}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          r.status === 'DELAYED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : r.status === 'AT_RISK'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regions Section */}
          {searchResults.regions.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Regional Operations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchResults.regions.map((reg, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onClose();
                      navigate(reg.path);
                    }}
                    className="p-2.5 rounded-lg bg-[#0B1530] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <span className="font-mono text-slate-300 group-hover:text-cyan-300 font-medium">
                      {reg.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Section */}
          {searchResults.alerts.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <Bell className="w-3.5 h-3.5" />
                <span>Active Alerts & Incidents</span>
              </div>
              <div className="space-y-1.5">
                {searchResults.alerts.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onClose();
                      if (a.shipmentId) navigate(`/shipments/${a.shipmentId}`);
                      else navigate('/network');
                    }}
                    className="p-2.5 rounded-lg bg-[#0B1530] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-200 group-hover:text-cyan-300">
                        {a.title}
                      </span>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{a.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#040712] border-t border-command-border/40 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with ↵ or click • Close with ESC</span>
          <span className="flex items-center text-cyan-400/80">
            <Sparkles className="w-3 h-3 mr-1 text-cyan-400" /> TRANSITIQ Index v2.4
          </span>
        </div>
      </div>
    </div>
  );
};
