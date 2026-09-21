import React, { useState } from 'react';
import {
  Globe2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Coins,
  ArrowRight,
  MapPin,
  Building2,
  FileCheck2,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ComposedChart,
  Line
} from 'recharts';
import { bankingData } from '../../data/europeanBankingData';

export const BankingGeography: React.FC = () => {
  const { geography, summary } = bankingData;
  const [selectedCountry, setSelectedCountry] = useState<string>('Germany');

  const selectedCountryData = geography.find(g => g.country === selectedCountry) || geography[1];

  const chartData = geography.map(g => ({
    name: g.country,
    total: g.total,
    churned: g.churned,
    retained: g.retained,
    churnRate: g.churnRate,
    riskIndex: g.riskIndex,
    volumeShare: g.volumeShare,
    churnedCapitalM: +(g.churnedBalance / 1e6).toFixed(1),
    avgBalance: g.avgBalance,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              REGIONAL DISPARITY ANALYSIS • FRANCE, GERMANY, SPAIN
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Geographic Risk Radar & Country Exposure
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Empirical comparative analysis evaluating structural churn rate variances, capital flight risk, and relative risk indices across key European sovereign markets.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#0B132B] p-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          {geography.map(g => (
            <button
              key={g.country}
              onClick={() => setSelectedCountry(g.country)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedCountry === g.country
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {g.country} ({g.churnRate}%)
            </button>
          ))}
        </div>
      </div>

      {/* 3 Country Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {geography.map(g => {
          const isSelected = selectedCountry === g.country;
          const isHighRisk = g.riskIndex > 1.2;
          return (
            <div
              key={g.country}
              onClick={() => setSelectedCountry(g.country)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#0B1533] border-cyan-500 shadow-hud'
                  : 'bg-[#070D1E]/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isHighRisk && (
                <div className="absolute top-0 right-0 bg-rose-500/20 text-rose-300 border-l border-b border-rose-500/40 text-[10px] font-mono px-2 py-0.5 rounded-bl">
                  ACUTE RISK CONCENTRATION
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {g.country === 'Germany' ? '🇩🇪' : g.country === 'France' ? '🇫🇷' : '🇪🇸'}
                  </span>
                  <span className="font-bold text-base text-slate-100">{g.country}</span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isHighRisk ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  Risk Index: {g.riskIndex}x
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 font-mono">CHURN RATE</div>
                  <div className={`text-xl font-mono font-bold ${isHighRisk ? 'text-rose-400' : 'text-slate-200'}`}>
                    {g.churnRate}%
                  </div>
                  <div className="text-[10px] text-slate-500">{g.churned.toLocaleString()} churned</div>
                </div>

                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 font-mono">CAPITAL AT RISK</div>
                  <div className="text-xl font-mono font-bold text-amber-300">
                    €{(g.churnedBalance / 1e6).toFixed(1)}M
                  </div>
                  <div className="text-[10px] text-slate-500">deposit exposure</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Customer Base: <strong>{g.total.toLocaleString()}</strong></span>
                <span>Volume Share: <strong className="text-cyan-400">{g.volumeShare}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Relative Risk Index & Churn Rate Chart */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Relative Risk Index vs Churn Rate (%)</h2>
              <p className="text-[11px] text-slate-400">Germany exhibits more than double the churn intensity of France & Spain</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
              ECB Benchmark (1.00x)
            </span>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#64748B" fontSize={11} unit="%" domain={[0, 40]} />
                <YAxis yAxisId="right" orientation="right" stroke="#06B6D4" fontSize={11} domain={[0, 2.0]} unit="x" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="churnRate" name="Churn Rate (%)" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.name === 'Germany' ? '#F43F5E' : '#3B82F6'}
                    />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="riskIndex" name="Relative Risk Index" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <strong className="text-cyan-300">Statistical Finding:</strong> Germany’s risk index of <strong className="text-rose-400">1.59</strong> indicates German clients are 59% more likely to defect than the pan-European average. In contrast, France (0.79) and Spain (0.82) operate substantially below baseline risk.
          </div>
        </div>

        {/* Churned Capital Distribution */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Capital at Risk per Country (€ Millions)</h2>
                <p className="text-[11px] text-slate-400">Total churned deposits by geographic market</p>
              </div>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} unit="M" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: number) => [`€${val} Million`, 'Deposit Flight']}
                  />
                  <Bar dataKey="churnedCapitalM" name="Churned Capital (€M)" radius={[4, 4, 0, 0]}>
                    <Cell fill="#F43F5E" />
                    <Cell fill="#FB923C" />
                    <Cell fill="#FBBF24" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-slate-300">
            <strong className="text-amber-300">Financial Impact:</strong> Germany accounts for <strong className="text-slate-100">€81.2M</strong> of the €185.6M pan-European capital flight, representing 43.8% of all churned capital despite having only 25% of customers.
          </div>
        </div>
      </div>

      {/* Selected Country Detailed Dossier */}
      <div className="p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Country Strategic Profile: {selectedCountryData.country}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Average Customer Balance: €{selectedCountryData.avgBalance.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-200">1. Market Dynamics & Root Causes</span>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {selectedCountryData.country === 'Germany'
                ? 'High rate of FinTech penetration (N26, Trade Republic) creating competitive pressure on deposit yield and account maintenance fees. High-net-worth customers are hyper-sensitive to negative real yields and clunky legacy interfaces.'
                : selectedCountryData.country === 'France'
                ? 'Relatively stable retail banking landscape with higher switching friction (Livret A government accounts anchor consumer relationships). Churn is primarily concentrated among inactive accounts rather than high-balance defections.'
                : 'Moderately low churn rate (16.67%). Market dynamics reflect consolidated domestic retail banking with strong regional branch loyalty, though digital mobile banking gaps create exposure among younger demographics.'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-200">2. Critical Demographic Vulnerability</span>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {selectedCountryData.country === 'Germany'
                ? 'The 46–60 age cohort displays an astonishing 67.33% churn rate in Germany. These are peak-wealth individuals with multi-product holdings who are actively transferring liquid capital to yield-bearing institutional or digital alternatives.'
                : selectedCountryData.country === 'France'
                ? 'French churn is driven by inactive customers (over 2x churn vs active). Fee fatigue on single-product holders accounts for the majority of customer departures.'
                : 'Spanish churn is highest among multi-product holders (3+ products) where cross-selling bundling fees provoke abrupt account termination.'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-200">3. Recommended Regulatory & Retention Action</span>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {selectedCountryData.country === 'Germany'
                ? 'Deploy a dedicated German VIP Concierge team for balances > €100k; introduce dynamic tiered interest bonuses (+0.50% - +0.75%) on deposit tiers to eliminate yield flight to neo-brokers.'
                : selectedCountryData.country === 'France'
                ? 'Execute an automated digital reactivation program for accounts with >6 months dormancy; offer fee waivers on secondary debit cards to restore daily transactional stickiness.'
                : 'Simplify fee structures on multi-product accounts; audit insurance/mortgage cross-sell terms to avoid punitive bundling penalties.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
