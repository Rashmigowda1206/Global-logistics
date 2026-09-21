import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLogisticsFilter } from '../context/FilterContext';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  status: string;
}

export const ReportCenter: React.FC = () => {
  const { shipments, kpis } = useLogisticsFilter();
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const templates: ReportTemplate[] = [
    {
      id: 'rep-daily',
      title: 'Daily Global Operations Briefing',
      description: 'Immediate snapshot of active in-transit volume, port dwell spikes, and critical delays.',
      category: 'Operations',
      frequency: 'Daily (06:00 UTC)',
      status: 'Ready'
    },
    {
      id: 'rep-weekly',
      title: 'Weekly Delivery Performance & SLA Scorecard',
      description: 'Rolling 7-day scheduled vs real shipping days variance, carrier SLA compliance, and delay gap bins.',
      category: 'SLA Analytics',
      frequency: 'Weekly',
      status: 'Ready'
    },
    {
      id: 'rep-regional',
      title: 'Regional Chokepoint & Risk Exposure Index',
      description: 'Geographic terminal dwell, customs audit bottlenecks, and maritime corridor vulnerability.',
      category: 'Risk Management',
      frequency: 'Bi-Weekly',
      status: 'Ready'
    },
    {
      id: 'rep-modes',
      title: 'Multi-Modal Logistics Efficiency Report',
      description: 'Comparative cost per ton-mile, speed velocity, and late risk across Air, Sea, Road, and Rail.',
      category: 'Procurement',
      frequency: 'Monthly',
      status: 'Ready'
    },
    {
      id: 'rep-exec',
      title: 'Executive Supply Chain Summary',
      description: 'High-level C-suite synthesis covering profit impact of logistics friction and recommended capital allocations.',
      category: 'Executive',
      frequency: 'Monthly',
      status: 'Ready'
    }
  ];

  const handleGenerate = (template: ReportTemplate) => {
    setSelectedReport(template);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(true);
      setPreviewOpen(true);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Origin Hub', 'Destination Hub', 'Shipping Mode', 'Real Days', 'Scheduled Days', 'Delay Gap', 'Risk', 'Status'];
    const rows = shipments.map(s => [
      s.orderId,
      s.customerFname,
      s.originHub,
      s.destinationHub,
      s.shippingMode,
      s.daysForShippingReal,
      s.daysForShipmentScheduled,
      s.delayGap,
      s.riskScore,
      s.deliveryClassification
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TRANSITIQ_${selectedReport?.id || 'Report'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(shipments.slice(0, 50), null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `TRANSITIQ_Raw_Telemetry_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              ENTERPRISE COMPLIANCE & EXPORTS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            REPORT CENTER
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compile operational syntheses, export audit-ready CSV datasets, and download PDF executive briefs
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Raw JSON</span>
          </button>
        </div>
      </div>

      {/* Report Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-xl bg-[#070D1E]/95 border border-cyan-500/25 hover:border-cyan-400/60 transition-all shadow-xl space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 uppercase font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                  {tpl.category}
                </span>
                <span className="text-[10px] text-slate-400">{tpl.frequency}</span>
              </div>

              <h3 className="font-bold text-base text-slate-100">{tpl.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedReport(tpl);
                  setPreviewOpen(true);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-[#0A132C] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleGenerate(tpl)}
                className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-hud"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: LIVE REPORT PREVIEW */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-[#070D22] border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-[#050916] border-b border-command-border/40 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">
                    DOCUMENT PREVIEW
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">
                    {selectedReport?.title || 'Daily Operations Briefing'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body (Printable styling) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#080E24] text-slate-200 custom-scrollbar text-xs">
              <div className="border-b border-slate-700/80 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-lg font-bold text-cyan-400">TRANSITIQ LOGISTICS AUDIT</h1>
                  <p className="text-[11px] text-slate-400">Global Logistics Control Tower • Verified Telemetry</p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>Date: {new Date().toUTCString().slice(0, 16)}</div>
                  <div>Security Classification: RESTRICTED</div>
                </div>
              </div>

              {/* KPI Summary Banner */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Active Volume</span>
                  <span className="text-base font-bold text-slate-100">{kpis.totalShipments} units</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">On-Time SLA</span>
                  <span className="text-base font-bold text-emerald-400">{kpis.onTimeRate}%</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Delayed Cohort</span>
                  <span className="text-base font-bold text-rose-400">{kpis.delayedCount} orders</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Avg Delay</span>
                  <span className="text-base font-bold text-amber-400">+{kpis.avgDelayDays} days</span>
                </div>
              </div>

              {/* Textual Narrative */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-100 uppercase tracking-wide">1. Executive Operational Synthesis</h4>
                <p className="text-slate-300 leading-relaxed">
                  During the evaluated reporting interval, the global supply network experienced primary transit drag concentrated in the Pacific Asia and Western European corridors. Port berth dwell at Pasir Panjang (Singapore) and Yangshan (Shanghai) averaged 3.4 days, resulting in a network-wide SLA compliance yield of {kpis.slaCompliance}%.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-100 uppercase tracking-wide">2. Flagged Incident Cohorts</h4>
                <div className="p-3 rounded-lg bg-[#0A132C] border border-slate-800 space-y-1.5 text-[11px]">
                  <div>• Order SO-44321: +3.2 days delay at Port of Hamburg (Customs hold)</div>
                  <div>• Order ORD-45821: +2.8 days delay in Shanghai terminal berth queue</div>
                  <div>• Order ORD-98214: +3.5 days delay in Santos harbor transshipment</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-100 uppercase tracking-wide">3. Strategic Directive</h4>
                <p className="text-slate-300 leading-relaxed">
                  Recommend immediate modal diversification: transfer high-margin electronics cargo to Air freight express slots and implement digital EDI pre-arrival clearance with EU customs authorities.
                </p>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="p-4 bg-[#050916] border-t border-command-border/40 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Ready for distribution
              </span>
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={handlePrintPDF}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all shadow-hud flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print to PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
