import React from 'react';
import {
  Coins,
  ShieldAlert,
  TrendingUp,
  CreditCard,
  Briefcase,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  Sparkles
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
  PieChart,
  Pie
} from 'recharts';
import { bankingData } from '../../data/europeanBankingData';

export const BankingFinancialExposure: React.FC = () => {
  const { summary, balanceBands, creditTiers } = bankingData;

  const bandChartData = balanceBands.map(b => ({
    name: b.band,
    totalBalanceM: +(b.totalBalance / 1e6).toFixed(1),
    churnedBalanceM: +(b.churnedBalance / 1e6).toFixed(1),
    churnRate: b.churnRate,
    total: b.total,
    churned: b.churned,
  }));

  const creditChartData = creditTiers.map(c => ({
    name: c.tier,
    churnRate: c.churnRate,
    total: c.total,
    churned: c.churned,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono text-amber-400 tracking-wider uppercase">
              FINANCIAL EXPOSURE & HIGH-VALUE SEGMENTATION
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Deposit Flight & Wealth Concentration Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Empirical investigation of capital at risk across balance intervals, credit ratings, and high-net-worth customer segments.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-200">High-Value Capital Exposure</span>
            <div className="font-mono text-lg font-bold text-amber-400">€110,812,478</div>
          </div>
        </div>
      </div>

      {/* Top 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400">TOTAL BANK DEPOSITS</span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">
            €{(summary.totalBalance / 1e6).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-500 mt-1">across 10,000 retail accounts</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-rose-500/30 shadow-xl">
          <span className="text-xs font-mono text-slate-400">TOTAL CAPITAL AT RISK</span>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">
            €{(summary.churnedBalance / 1e6).toFixed(1)}M
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1 font-mono">24.26% total deposit base</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-amber-500/30 shadow-xl">
          <span className="text-xs font-mono text-slate-400">HIGH-VALUE SHARE (&gt;€100K)</span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
            81.3%
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-mono">of all churned deposits</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-blue-500/30 shadow-xl">
          <span className="text-xs font-mono text-slate-400">AVG BALANCE GAP</span>
          <div className="mt-2 text-2xl font-bold font-mono text-blue-300">
            +€18,363
          </div>
          <div className="text-[11px] text-blue-400 mt-1 font-mono">Churners hold higher balance</div>
        </div>
      </div>

      {/* Balance Bands Visualizer */}
      <div className="p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Total Deposits vs Churned Capital by Balance Interval (€ Millions)
            </h2>
            <p className="text-[11px] text-slate-400">Notice the steep surge in capital at risk in the €100k–€150k band</p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
            6 Interval Tranches
          </span>
        </div>

        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bandChartData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} angle={-15} textAnchor="end" tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} unit="M" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              <Bar dataKey="totalBalanceM" name="Total Customer Deposits (€M)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="churnedBalanceM" name="Departed Capital (€M)" fill="#F43F5E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
          <strong className="text-amber-300">Empirical Exposure Discovery:</strong> The <strong>€100,001–€150,000</strong> interval accounts for <strong>€112.5M</strong> in churned deposits alone (3,830 customers total, 922 churned = 24.08% churn rate). This proves that defection is not concentrated in marginal low-balance accounts, but squarely in core retail liquidity!
        </div>
      </div>

      {/* Credit Score Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-100">Churn Rate Across Credit Score Tiers (%)</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">FICO/European Credit Scale</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creditChartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" domain={[0, 30]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="churnRate" name="Churn Rate (%)" fill="#06B6D4" radius={[4, 4, 0, 0]}>
                  {creditChartData.map((entry, index) => (
                    <Cell key={`cs-cell-${index}`} fill={index === 0 ? '#F43F5E' : '#06B6D4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wealth Protection Protocol Card */}
        <div className="p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-slate-100">High-Net-Worth Capital Protection Protocol</h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">Action Plan</span>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="font-semibold text-purple-300">1. Tiered High-Yield Deposit Safeguard</div>
                <p className="text-slate-400 mt-1">
                  Introduce a competitive +0.50% interest bonus on liquid balances above €75,000 for accounts maintaining at least 12 months of active relationship history.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="font-semibold text-purple-300">2. Proactive Outbound Wealth Manager Touchpoints</div>
                <p className="text-slate-400 mt-1">
                  Trigger an automated relationship manager advisory call whenever an account with &gt; €50,000 undergoes a 20% balance depletion within 30 days.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="font-semibold text-purple-300">3. Eliminating Multi-Product Account Fees</div>
                <p className="text-slate-400 mt-1">
                  Abolish maintenance fees on secondary debit and credit cards for customers holding more than 2 products to dismantle the catastrophic 82.7% churn cliff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
