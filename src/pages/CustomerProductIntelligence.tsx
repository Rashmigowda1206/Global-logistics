import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users2,
  Package,
  Layers,
  TrendingDown,
  Clock,
  ShieldCheck,
  ArrowRight,
  Filter,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLogisticsFilter } from '../context/FilterContext';
import { CustomerSegment } from '../types/logistics';

export const CustomerProductIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const { shipments, updateFilter } = useLogisticsFilter();
  const [activeTab, setActiveTab] = useState<'CUSTOMERS' | 'PRODUCTS'>('CUSTOMERS');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Customer segment statistics
  const customerSegmentsList: CustomerSegment[] = [
    'Consumer',
    'Corporate',
    'Home Office',
    'Sports & Fitness',
    'Industrial'
  ];

  const customerStats = useMemo(() => {
    return customerSegmentsList.map((seg) => {
      const segOrders = shipments.filter((s) => s.customerSegment === seg);
      const count = segOrders.length;
      if (count === 0) {
        return {
          segment: seg,
          totalOrders: 0,
          onTimeRate: 100,
          delayExposureRate: 0,
          avgDelay: 0,
          totalSales: 0
        };
      }
      const onTimeCount = segOrders.filter((s) => s.deliveryClassification !== 'DELAYED').length;
      const delayedCount = segOrders.filter((s) => s.deliveryClassification === 'DELAYED').length;
      const onTimeRate = Number(((onTimeCount / count) * 100).toFixed(1));
      const delayExposureRate = Number(((delayedCount / count) * 100).toFixed(1));
      const totalDelay = segOrders.reduce((acc, s) => acc + Math.max(0, s.delayGap), 0);
      const avgDelay = Number((totalDelay / count).toFixed(1));
      const totalSales = segOrders.reduce((acc, s) => acc + s.orderItemTotal, 0);

      return {
        segment: seg,
        totalOrders: count,
        onTimeRate,
        delayExposureRate,
        avgDelay,
        totalSales: Math.round(totalSales)
      };
    });
  }, [shipments]);

  // Product categories statistics
  const categoriesList = ['Electronics', 'Consumer Tech', 'Industrial', 'Heavy Machinery', 'Automotive', 'Apparel', 'Sports & Fitness'];

  const productStats = useMemo(() => {
    return categoriesList.map((cat) => {
      const catOrders = shipments.filter((s) => s.categoryName.toLowerCase().includes(cat.toLowerCase()));
      const count = catOrders.length;
      if (count === 0) {
        return {
          category: cat,
          shipmentsCount: 0,
          delayRate: 0,
          avgDelay: 0,
          profitImpact: 0,
          topProduct: 'Nominal Item'
        };
      }
      const delayedCount = catOrders.filter((s) => s.deliveryClassification === 'DELAYED').length;
      const delayRate = Number(((delayedCount / count) * 100).toFixed(1));
      const totalDelay = catOrders.reduce((acc, s) => acc + Math.max(0, s.delayGap), 0);
      const avgDelay = Number((totalDelay / count).toFixed(1));
      const profitLostEstimate = catOrders
        .filter((s) => s.deliveryClassification === 'DELAYED')
        .reduce((acc, s) => acc + s.orderProfitPerOrder * 0.25, 0);

      const topProduct = catOrders[0]?.productName || 'General Goods';

      return {
        category: cat,
        shipmentsCount: count,
        delayRate,
        avgDelay,
        profitImpact: Math.round(profitLostEstimate),
        topProduct
      };
    });
  }, [shipments]);

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Users2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              PORTFOLIO & SKU EXPOSURE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            CUSTOMER & PRODUCT INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            SLA exposure by client tier, category vulnerability, and financial profit impact of logistics friction
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1.5 bg-[#070D1E] p-1 rounded-lg border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveTab('CUSTOMERS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'CUSTOMERS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-hud'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users2 className="w-4 h-4" />
            <span>CUSTOMERS</span>
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'PRODUCTS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-hud'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>PRODUCTS</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CUSTOMERS */}
      {activeTab === 'CUSTOMERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Customer Segments Breakdown
            </span>
            <span className="text-xs text-slate-500">
              Click any segment to filter Shipment Explorer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerStats.map((item) => (
              <div
                key={item.segment}
                onClick={() => {
                  updateFilter('customerSegment', item.segment);
                  navigate('/shipments');
                }}
                className="p-5 rounded-xl bg-[#070D1E]/95 hover:bg-[#0B1533] border border-cyan-500/25 hover:border-cyan-400/60 cursor-pointer transition-all shadow-xl space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300">
                    {item.segment}
                  </h3>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      item.delayExposureRate > 40
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {item.delayExposureRate}% DELAY EXPOSURE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">On-Time SLA</span>
                    <span className="font-bold text-emerald-400">{item.onTimeRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Average Delay</span>
                    <span className="font-bold text-amber-400">+{item.avgDelay}d</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Order Volume</span>
                    <span className="font-bold text-slate-200">{item.totalOrders} units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Revenue Volume</span>
                    <span className="font-bold text-cyan-300">${item.totalSales.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-cyan-400 group-hover:underline">
                  <span>Filter Orders for {item.segment}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'PRODUCTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Product Category Vulnerability & Profit Impact
            </span>
            <span className="text-xs text-slate-500">
              Estimated SLA penalty and inventory holding friction
            </span>
          </div>

          <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl shadow-2xl overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#050916] border-b border-command-border/40 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Key Product Sample</th>
                  <th className="p-3.5 text-center">Shipments</th>
                  <th className="p-3.5 text-center">Delay Rate %</th>
                  <th className="p-3.5 text-center">Avg Delay</th>
                  <th className="p-3.5 text-center">Est. Profit Impact</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {productStats.map((item, pIdx) => (
                  <tr
                    key={pIdx}
                    onClick={() => {
                      updateFilter('searchQuery', item.category);
                      navigate('/shipments');
                    }}
                    className="hover:bg-[#0B1533] cursor-pointer transition-colors group"
                  >
                    <td className="p-3.5 font-bold text-slate-100 group-hover:text-cyan-300">
                      {item.category}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {item.topProduct}
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-200">
                      {item.shipmentsCount}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`font-bold ${
                          item.delayRate > 50 ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        {item.delayRate}%
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-bold text-amber-400">
                      +{item.avgDelay}d
                    </td>
                    <td className="p-3.5 text-center font-bold text-rose-400">
                      -${item.profitImpact.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right text-cyan-400 group-hover:underline">
                      Inspect Category →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
