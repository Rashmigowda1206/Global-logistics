import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  AlertTriangle,
  Clock,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Check
} from 'lucide-react';
import { LiveAlert } from '../../types/logistics';
import { useNotifications } from '../../context/NotificationContext';
import { useActions } from '../../context/ActionContext';

export const IncidentDetailModal: React.FC = () => {
  const { selectedAlert, setSelectedAlert } = useNotifications();
  const { addTask } = useActions();
  const navigate = useNavigate();

  if (!selectedAlert) return null;

  const handleCreateTask = () => {
    addTask({
      title: `Mitigate: ${selectedAlert.title}`,
      column: selectedAlert.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH_PRIORITY',
      impact: selectedAlert.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      affectedShipments: selectedAlert.shipmentId ? 1 : 120,
      recommendedAction: selectedAlert.actionRecommended || 'Deploy local operational intervention and monitor delay telemetry.',
      deadline: 'Today, 22:00 UTC',
      owner: 'Logistics Incident Response',
      category: 'Incident Dispatch'
    });
    setSelectedAlert(null);
    navigate('/actions');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#070D22] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="p-4 bg-[#050916] border-b border-command-border/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div
              className={`p-2 rounded-lg ${
                selectedAlert.severity === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : selectedAlert.severity === 'WARNING'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {selectedAlert.id} • OPERATIONAL INCIDENT
              </span>
              <h3 className="text-sm font-bold text-slate-100">{selectedAlert.title}</h3>
            </div>
          </div>
          <button
            onClick={() => setSelectedAlert(null)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B1530] border border-slate-800">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Timestamp:</span>
              <span className="text-slate-200">{selectedAlert.timestamp.replace('T', ' ').slice(0, 19)} UTC</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                selectedAlert.severity === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-300'
                  : selectedAlert.severity === 'WARNING'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {selectedAlert.severity}
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">
              Telemetry Description
            </label>
            <p className="text-slate-200 bg-[#0A1229] p-3 rounded-lg border border-slate-800 leading-relaxed">
              {selectedAlert.description}
            </p>
          </div>

          {selectedAlert.location && (
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-500">Node Location:</span>
              <span className="text-cyan-300 font-semibold">{selectedAlert.location}</span>
            </div>
          )}

          {selectedAlert.actionRecommended && (
            <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>RECOMMENDED PROTOCOL</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedAlert.actionRecommended}
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-[#050916] border-t border-command-border/40 flex items-center justify-end space-x-2.5">
          {selectedAlert.shipmentId && (
            <button
              onClick={() => {
                const sid = selectedAlert.shipmentId;
                setSelectedAlert(null);
                navigate(`/shipments/${sid}`);
              }}
              className="px-3 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Inspect Shipment ({selectedAlert.shipmentId})</span>
            </button>
          )}

          <button
            onClick={handleCreateTask}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold transition-colors shadow-hud flex items-center space-x-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Create Action Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
