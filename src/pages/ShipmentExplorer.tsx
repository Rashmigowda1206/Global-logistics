import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PackageSearch,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Filter,
  ArrowRight,
  ShieldCheck,
  Flame,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLogisticsFilter } from '../context/FilterContext';
import { ShipmentRecord } from '../types/logistics';

export const ShipmentExplorer: React.FC = () => {
  const navigate = useNavigate();
  const {
    shipments,
    allShipments,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount
  } = useLogisticsFilter();

  const [sortField, setSortField] = useState<keyof ShipmentRecord>('orderId');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Sorting logic
  const sortedShipments = [...shipments].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortAsc
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  const totalPages = Math.ceil(sortedShipments.length / pageSize);
  const paginatedShipments = sortedShipments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: keyof ShipmentRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for metrics
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Customer',
      'Origin Hub',
      'Destination Hub',
      'Country',
      'Shipping Mode',
      'Scheduled Days',
      'Real Days',
      'Delay Gap',
      'Risk Score',
      'Delivery Classification',
      'Product Name',
      'Sales Total'
    ];

    const rows = sortedShipments.map((s) => [
      s.orderId,
      s.customerFname,
      s.originHub,
      s.destinationHub,
      s.orderCountry,
      s.shippingMode,
      s.daysForShipmentScheduled,
      s.daysForShippingReal,
      s.delayGap,
      s.riskScore,
      s.deliveryClassification,
      `"${s.productName}"`,
      s.orderItemTotal
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TRANSITIQ_Shipments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <PackageSearch className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              DATACO TELEMETRY RECORD STORE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            SHIPMENT EXPLORER
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Displaying {sortedShipments.length} matching freight orders with full telemetry
          </p>
        </div>

        {/* Search & Export Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Quick Filters Bar */}
      <div className="bg-[#070D1E]/95 border border-cyan-500/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search Order ID, Customer, Country, Product..."
            className="w-full bg-[#0A132C] border border-slate-700/70 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Status Quick Filter */}
          <select
            value={filters.deliveryStatus}
            onChange={(e) => updateFilter('deliveryStatus', e.target.value)}
            className="bg-[#0A132C] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="DELAYED">Delayed Orders</option>
            <option value="ON SCHEDULE">On Schedule</option>
            <option value="EARLY">Early</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={filters.riskLevel}
            onChange={(e) => updateFilter('riskLevel', e.target.value)}
            className="bg-[#0A132C] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="All">All Risks</option>
            <option value="HIGH">High Risk (&gt;60%)</option>
            <option value="MEDIUM">Moderate Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Mode Filter */}
          <select
            value={filters.shippingMode}
            onChange={(e) => updateFilter('shippingMode', e.target.value)}
            className="bg-[#0A132C] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="All">All Modes</option>
            <option value="Sea">Sea</option>
            <option value="Air">Air</option>
            <option value="Road">Road</option>
            <option value="Rail">Rail</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="p-1.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#050916] border-b border-command-border/40 text-slate-400 font-bold uppercase text-[10px]">
                <th
                  onClick={() => handleSort('orderId')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customerFname')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300 select-none"
                >
                  Customer
                </th>
                <th className="p-3.5">Origin / Destination</th>
                <th
                  onClick={() => handleSort('shippingMode')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300 select-none"
                >
                  Mode
                </th>
                <th
                  onClick={() => handleSort('daysForShipmentScheduled')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300 text-center select-none"
                >
                  Sched.
                </th>
                <th
                  onClick={() => handleSort('daysForShippingReal')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300 text-center select-none"
                >
                  Actual
                </th>
                <th
                  onClick={() => handleSort('delayGap')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300 text-center select-none"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Delay Gap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300 text-center select-none"
                >
                  Risk %
                </th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedShipments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    <p className="text-sm font-semibold">No shipments match your current filters.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedShipments.map((s) => {
                  const isDelayed = s.deliveryClassification === 'DELAYED';
                  const isEarly = s.deliveryClassification === 'EARLY';

                  return (
                    <tr
                      key={s.orderId}
                      onClick={() => navigate(`/shipments/${s.orderId}`)}
                      className="hover:bg-[#0B1533] cursor-pointer transition-colors group"
                    >
                      <td className="p-3.5 font-bold text-cyan-300 group-hover:underline">
                        {s.orderId}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-200 block">{s.customerFname}</span>
                        <span className="text-[10px] text-slate-500">{s.customerSegment}</span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <span className="block truncate max-w-[170px] text-slate-200 font-medium">
                          {s.originHub} → {s.destinationHub}
                        </span>
                        <span className="text-[10px] text-slate-500">{s.orderCountry}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-300 font-semibold">{s.shippingMode}</span>
                      </td>
                      <td className="p-3.5 text-center text-slate-400">
                        {s.daysForShipmentScheduled}d
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-200">
                        {s.daysForShippingReal}d
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`font-bold ${
                            isDelayed ? 'text-rose-400' : isEarly ? 'text-cyan-400' : 'text-emerald-400'
                          }`}
                        >
                          {s.delayGap > 0 ? `+${s.delayGap}d` : `${s.delayGap}d`}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`font-bold ${
                            s.riskScore >= 60
                              ? 'text-rose-400'
                              : s.riskScore >= 30
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {s.riskScore}%
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isDelayed
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : isEarly
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {s.deliveryClassification}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="text-cyan-400 group-hover:underline flex items-center justify-end space-x-1">
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3.5 bg-[#050916] border-t border-command-border/30 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedShipments.length)} of {sortedShipments.length} orders
          </span>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-[#0A132C] border border-slate-700 disabled:opacity-40 hover:bg-slate-800"
            >
              Prev
            </button>
            <span className="px-2 font-bold text-slate-200">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded bg-[#0A132C] border border-slate-700 disabled:opacity-40 hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
