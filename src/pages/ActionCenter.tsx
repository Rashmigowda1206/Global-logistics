import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare2,
  AlertTriangle,
  Clock,
  User,
  ArrowRight,
  Plus,
  Flame,
  ShieldCheck,
  ScatterChart,
  Activity,
  X,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useActions } from '../context/ActionContext';
import { ActionTask, PriorityMatrixItem } from '../types/logistics';

export const ActionCenter: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    matrixItems,
    moveTask,
    addTask,
    selectedTask,
    setSelectedTask,
    selectedMatrixItem,
    setSelectedMatrixItem
  } = useActions();

  const [activeTab, setActiveTab] = useState<'KANBAN' | 'MATRIX'>('KANBAN');
  const [showNewModal, setShowNewModal] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newColumn, setNewColumn] = useState<ActionTask['column']>('HIGH_PRIORITY');
  const [newImpact, setNewImpact] = useState<ActionTask['impact']>('HIGH');
  const [newAffected, setNewAffected] = useState(120);
  const [newRecommended, setNewRecommended] = useState('');
  const [newOwner, setNewOwner] = useState('Logistics Incident Lead');
  const [newCategory, setNewCategory] = useState('Trade Lane Optimization');

  const columns: { id: ActionTask['column']; label: string; color: string; bg: string }[] = [
    { id: 'CRITICAL', label: 'CRITICAL', color: 'text-rose-400', bg: 'border-rose-500/30' },
    { id: 'HIGH_PRIORITY', label: 'HIGH PRIORITY', color: 'text-amber-400', bg: 'border-amber-500/30' },
    { id: 'MONITORING', label: 'MONITORING', color: 'text-cyan-400', bg: 'border-cyan-500/30' },
    { id: 'RESOLVED', label: 'RESOLVED', color: 'text-emerald-400', bg: 'border-emerald-500/30' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    addTask({
      title: newTitle,
      column: newColumn,
      impact: newImpact,
      affectedShipments: newAffected,
      recommendedAction: newRecommended || 'Execute operational adjustment and monitor dwell telemetry.',
      deadline: 'In 48 Hours',
      owner: newOwner,
      category: newCategory
    });
    setShowNewModal(false);
    setNewTitle('');
    setNewRecommended('');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <CheckSquare2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              OPERATIONAL EXECUTION BOARD
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            ACTION CENTER
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage operational interventions, assign lane coordinators, and prioritize bottlenecks via the 2D matrix
          </p>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 bg-[#070D1E] p-1 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setActiveTab('KANBAN')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'KANBAN'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab('MATRIX')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'MATRIX'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2D Priority Matrix
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-hud transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeTab === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.column === col.id);

            return (
              <div
                key={col.id}
                className={`bg-[#070D1E]/95 border ${col.bg} rounded-xl p-4 shadow-xl flex flex-col min-h-[500px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'CRITICAL' ? 'bg-rose-500 animate-ping' : col.id === 'HIGH_PRIORITY' ? 'bg-amber-400' : col.id === 'MONITORING' ? 'bg-cyan-400' : 'bg-emerald-400'}`}></span>
                    <h3 className={`font-extrabold text-xs tracking-wider ${col.color}`}>
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded bg-[#0A132C] border border-slate-800">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[11px] text-slate-500 border border-dashed border-slate-800 rounded-lg">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="p-3.5 rounded-lg bg-[#0A132C] hover:bg-[#101F44] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2.5 shadow-sm group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-100 group-hover:text-cyan-300 text-xs line-clamp-2">
                            {task.title}
                          </span>
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase whitespace-nowrap ${
                              task.impact === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : task.impact === 'HIGH'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {task.impact}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {task.recommendedAction}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-800/80 text-slate-400">
                          <div>
                            <span className="text-slate-500 block">Affected:</span>
                            <span className="text-slate-200 font-bold">{task.affectedShipments} orders</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Deadline:</span>
                            <span className="text-amber-400">{task.deadline}</span>
                          </div>
                        </div>

                        {/* Drag / Shift Column Quick Controls */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 truncate max-w-[120px]">{task.owner.split(' ')[0]}</span>
                          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                            {col.id !== 'CRITICAL' && (
                              <button
                                onClick={() => moveTask(task.id, 'CRITICAL')}
                                className="px-1.5 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                title="Escalate to Critical"
                              >
                                !
                              </button>
                            )}
                            {col.id !== 'RESOLVED' && (
                              <button
                                onClick={() => moveTask(task.id, 'RESOLVED')}
                                className="px-1.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                title="Mark Resolved"
                              >
                                ✓
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: 2D ACTION PRIORITY MATRIX */}
      {activeTab === 'MATRIX' && (
        <div className="bg-[#070D1E]/95 border border-purple-500/30 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                ACTION PRIORITY MATRIX (2D OPERATIONAL IMPACT vs URGENCY)
              </h2>
              <p className="text-[11px] text-slate-400">
                Click any issue node to inspect mitigation plan and assign resources
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="text-rose-400">● Top Right: Urgent & High Impact (Act Now)</span>
              <span className="text-amber-400">● Strategic Buffer</span>
            </div>
          </div>

          {/* 2D Grid Visualizer (SVG Canvas) */}
          <div className="relative w-full h-[420px] bg-[#040713] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center select-none">
            {/* Quadrant Backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-r border-b border-slate-800/80 p-3 text-[10px] text-slate-500 font-bold">
                HIGH URGENCY / LOW IMPACT
              </div>
              <div className="border-b border-slate-800/80 p-3 text-[10px] text-rose-400 font-bold bg-rose-950/10 text-right">
                CRITICAL ZONE (HIGH IMPACT & URGENCY)
              </div>
              <div className="border-r border-slate-800/80 p-3 text-[10px] text-slate-500 font-bold flex items-end">
                LOW URGENCY / LOW IMPACT
              </div>
              <div className="p-3 text-[10px] text-cyan-400 font-bold flex items-end justify-end">
                HIGH IMPACT / STRATEGIC
              </div>
            </div>

            {/* Matrix Items Plotted as Interactive Bubbles */}
            {matrixItems.map((item) => {
              // Convert 0-100 to percent coordinates (X: Impact 0-100, Y: Urgency 0-100 inverted for top)
              const leftPct = Math.max(8, Math.min(92, item.impactScore));
              const topPct = Math.max(8, Math.min(92, 100 - item.urgencyScore));

              const isCritical = item.impactScore > 75 && item.urgencyScore > 75;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMatrixItem(item)}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                >
                  <div
                    className={`px-3 py-1.5 rounded-lg border backdrop-blur-md flex items-center space-x-1.5 shadow-xl transition-all duration-200 group-hover:scale-110 ${
                      isCritical
                        ? 'bg-rose-500/25 border-rose-400 text-rose-200 shadow-hud-red'
                        : 'bg-[#0E1A3D] border-cyan-500/40 text-cyan-200 shadow-hud'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="font-bold text-xs truncate max-w-[180px]">
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Axes labels */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>← Low Operational Impact</span>
            <span className="font-bold text-slate-200">X-Axis: Operational Impact Score</span>
            <span>High Operational Impact →</span>
          </div>
        </div>
      )}

      {/* MODAL 1: Task Detail Flyout */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#070D22] border border-cyan-500/40 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-bold">
                  {selectedTask.category} • ACTION TASK
                </span>
                <h3 className="text-base font-bold text-slate-100">{selectedTask.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0A132C] border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Recommended Operational Action
              </span>
              <p className="text-slate-200 leading-relaxed">{selectedTask.recommendedAction}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Affected Volume</span>
                <span className="font-bold text-slate-100 text-sm">{selectedTask.affectedShipments} orders</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Assigned Owner</span>
                <span className="font-bold text-cyan-300 text-sm">{selectedTask.owner}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-amber-400">Deadline: {selectedTask.deadline}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    moveTask(selectedTask.id, 'RESOLVED');
                    setSelectedTask(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30"
                >
                  Mark Resolved ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Priority Matrix Item Detail */}
      {selectedMatrixItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#070D22] border border-purple-500/40 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] text-purple-400 uppercase font-bold">
                  2D MATRIX STRATEGIC NODE
                </span>
                <h3 className="text-base font-bold text-slate-100">{selectedMatrixItem.title}</h3>
              </div>
              <button
                onClick={() => setSelectedMatrixItem(null)}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Operational Impact</span>
                <span className="font-bold text-slate-100 text-base">{selectedMatrixItem.impactScore} / 100</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Urgency Score</span>
                <span className="font-bold text-rose-400 text-base">{selectedMatrixItem.urgencyScore} / 100</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0A132C] border border-slate-800 space-y-1.5 text-xs">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                Integrated Action Plan
              </span>
              <p className="text-slate-200 leading-relaxed">{selectedMatrixItem.actionPlan}</p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedMatrixItem(null)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Create New Action */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-md bg-[#070D22] border border-cyan-500/40 rounded-xl shadow-2xl p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 uppercase">Create New Action Task</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">Action Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Audit Singapore Feeder Berthing Queue"
                className="w-full bg-[#0A132C] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">Priority Column</label>
                <select
                  value={newColumn}
                  onChange={(e) => setNewColumn(e.target.value as any)}
                  className="w-full bg-[#0A132C] border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH_PRIORITY">High Priority</option>
                  <option value="MONITORING">Monitoring</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">Impact Severity</label>
                <select
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value as any)}
                  className="w-full bg-[#0A132C] border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">Recommended Operational Mitigation</label>
              <textarea
                rows={3}
                value={newRecommended}
                onChange={(e) => setNewRecommended(e.target.value)}
                placeholder="Describe operational resolution steps..."
                className="w-full bg-[#0A132C] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">Affected Orders</label>
                <input
                  type="number"
                  value={newAffected}
                  onChange={(e) => setNewAffected(Number(e.target.value))}
                  className="w-full bg-[#0A132C] border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">Owner</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full bg-[#0A132C] border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                Save Action
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
