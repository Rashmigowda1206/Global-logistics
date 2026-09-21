import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Filter,
  BarChart2
} from 'lucide-react';
import { useLogisticsFilter } from '../context/FilterContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { getDelayGapHistogram } from '../services/logisticsService';

export const DeliveryPerformance: React.FC = () => {
  const navigate = useNavigate();
  const { shipments, kpis, updateFilter } = useLogisticsFilter();

  const histogramData = getDelayGapHistogram(shipments);

  // Status pie breakdown data
  const statusPieData = [
    { name: 'On Schedule (0d)', value: kpis.onScheduleCount, color: '#10B981', filter: 'ON SCHEDULE' },
    { name: 'Early (<0d)', value: kpis.earlyCount, color: '#06B6D4', filter: 'EARLY' },
    { name: 'Delayed (>0d)', value: kpis.delayedCount, color: '#EF4444', filter: 'DELAYED' },
  ];

  // Rolling performance trend data
  const trendData = [
    { date: 'Sep 01', onTimeRate: 88.2, avgDelay: 0.9 },
    { date: 'Sep 05', onTimeRate: 85.4, avgDelay: 1.2 },
    { date: 'Sep 09', onTimeRate: 79.1, avgDelay: 1.8 },
    { date: 'Sep 13', onTimeRate: 74.0, avgDelay: 2.3 },
    { date: 'Sep 17', onTimeRate: 71.5, avgDelay: 2.5 },
    { date: 'Sep 21 (Today)', onTimeRate: kpis.onTimeRate, avgDelay: kpis.avgDelayDays },
  ];

  // Representative cohort of 6 shipments for the horizontal scheduled vs actual bar timeline
  const timelineShipments = shipments.slice(0, 7);

  const handleStatusClick = (statusKey: string) => {
    updateFilter('deliveryStatus', statusKey);
    navigate('/shipments');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              SLA & FULFILLMENT ANALYTICS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            DELIVERY PERFORMANCE
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real vs scheduled shipping days variance, fulfillment gap histograms, and SLA compliance
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center space-x-3 bg-[#070D1E] p-2 rounded-xl border border-cyan-500/30 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Net SLA Compliance</span>
            <span className="text-base font-bold text-emerald-400">{kpis.slaCompliance}%</span>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <span className="text-slate-400 block text-[10px]">Avg Delivery Delay</span>
            <span className="text-base font-bold text-amber-400">+{kpis.avgDelayDays} days</span>
          </div>
        </div>
      </div>

      {/* Top Main Visualization: Horizontal Scheduled vs Actual Delivery Timeline */}
      <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Scheduled vs Actual Delivery Timeline (Sample Cohort)
            </h2>
            <p className="text-xs text-slate-400">
              Horizontal visual comparison of committed contract SLA days vs real transit days
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-2 rounded-sm bg-cyan-500/50 border border-cyan-400"></span>
              <span className="text-slate-300">Scheduled SLA</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-2 rounded-sm bg-rose-500"></span>
              <span className="text-slate-300">Actual (Delayed)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-2 rounded-sm bg-emerald-500"></span>
              <span className="text-slate-300">Actual (On-Time)</span>
            </span>
          </div>
        </div>

        {/* Horizontal Timeline Bars */}
        <div className="space-y-3.5 pt-1">
          {timelineShipments.map((s) => {
            const isDelayed = s.deliveryClassification === 'DELAYED';
            const scheduledWidth = Math.min(100, (s.daysForShipmentScheduled / 10) * 100);
            const actualWidth = Math.min(100, (s.daysForShippingReal / 10) * 100);

            return (
              <div
                key={s.orderId}
                onClick={() => navigate(`/shipments/${s.orderId}`)}
                className="p-3 rounded-lg bg-[#0A132C] hover:bg-[#101D40] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-cyan-300 group-hover:underline">
                      {s.orderId}
                    </span>
                    <span className="text-slate-400">{s.customerFname} ({s.customerCity})</span>
                    <span className="text-slate-500">• {s.shippingMode}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400">
                      Scheduled: <strong className="text-slate-200">{s.daysForShipmentScheduled}d</strong> | Real: <strong className={isDelayed ? 'text-rose-400' : 'text-emerald-400'}>{s.daysForShippingReal}d</strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isDelayed
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isDelayed ? `+${s.delayGap}d DELAY` : 'ON TIME'}
                    </span>
                  </div>
                </div>

                {/* Progress bar tracks */}
                <div className="space-y-1">
                  {/* Scheduled Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex items-center">
                    <div
                      className="bg-cyan-600/60 h-full rounded-full"
                      style={{ width: `${scheduledWidth}%` }}
                    ></div>
                  </div>
                  {/* Actual Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex items-center">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isDelayed ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${actualWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Delivery Status Donut + Delay Gap Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Delivery Status Breakdown Donut (4 cols) */}
        <div className="lg:col-span-4 bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              Delivery Status Breakdown
            </h2>
            <p className="text-[11px] text-slate-400">
              Click any status segment to filter Shipment Explorer
            </p>
          </div>

          <div className="h-56 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  className="cursor-pointer"
                  onClick={(entry) => handleStatusClick(entry.filter)}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#070D1E" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#070D1E', borderColor: '#06B6D4', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-100">{kpis.totalShipments}</span>
              <span className="text-[10px] text-slate-400 uppercase">Total Orders</span>
            </div>
          </div>

          {/* Interactive Legend with click triggers */}
          <div className="space-y-2 pt-1 text-xs">
            {statusPieData.map((item) => (
              <button
                key={item.name}
                onClick={() => handleStatusClick(item.filter)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0A132C] hover:bg-[#101F44] border border-slate-800 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300 font-semibold">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-100 font-bold">{item.value}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Delay Gap Histogram (8 cols) */}
        <div className="lg:col-span-8 bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Delay Gap Distribution (Real − Scheduled Days)
              </h2>
              <p className="text-[11px] text-slate-400">
                Variance distribution across all active orders
              </p>
            </div>
            <button
              onClick={() => {
                updateFilter('deliveryStatus', 'DELAYED');
                navigate('/shipments');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <span>Explore Delayed Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E294B" opacity={0.5} />
                <XAxis
                  dataKey="bin"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070D1E', borderColor: '#06B6D4', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar
                  dataKey="count"
                  name="Shipments"
                  cursor="pointer"
                  onClick={(data) => {
                    if (data.category === 'DELAYED') {
                      updateFilter('deliveryStatus', 'DELAYED');
                      navigate('/shipments');
                    } else if (data.category === 'EARLY') {
                      updateFilter('deliveryStatus', 'EARLY');
                      navigate('/shipments');
                    } else {
                      updateFilter('deliveryStatus', 'ON SCHEDULE');
                      navigate('/shipments');
                    }
                  }}
                >
                  {histogramData.map((entry, index) => {
                    const barColor =
                      entry.category === 'DELAYED'
                        ? '#EF4444'
                        : entry.category === 'EARLY'
                        ? '#06B6D4'
                        : '#10B981';
                    return <Cell key={`cell-${index}`} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            Click any bar to filter Shipment Explorer directly to that performance cohort
          </div>
        </div>
      </div>

      {/* Row 3: 30-Day Performance Trend */}
      <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              On-Time SLA Delivery Trend Over Time
            </h2>
          </div>
          <span className="text-[10px] text-slate-400">Past 30 Days Rolling Telemetry</span>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E294B" opacity={0.4} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#070D1E', borderColor: '#06B6D4', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="onTimeRate"
                name="On-Time Rate (%)"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="avgDelay"
                name="Avg Delay (days)"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 3, fill: '#F59E0B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
