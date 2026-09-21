import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserX,
  TrendingDown,
  Coins,
  ShieldAlert,
  ArrowUpRight,
  Download,
  Sliders,
  ChevronRight,
  Globe2,
  PieChart as PieChartIcon,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { bankingData } from '../../data/europeanBankingData';

export const BankingCommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const { summary, geography, products, balanceBands } = bankingData;

  const donutData = [
    { name: 'Retained Customers', value: summary.retainedCustomers, color: '#10B981' },
    { name: 'Churned Customers', value: summary.churnedCustomers, color: '#F43F5E' },
  ];

  const productChartData = products.map(p => ({
    name: `${p.products} Product${p.products > 1 ? 's' : ''}`,
    churnRate: p.churnRate,
    total: p.total,
    churned: p.churned,
    retained: p.retained,
  }));

  const balanceDisparityData = [
    { name: 'Retained Customers', balance: summary.avgBalanceRetained, fill: '#10B981' },
    { name: 'Churned Customers', balance: summary.avgBalanceChurned, fill: '#F43F5E' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Welcome & Mission Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-purple-950/50 border border-blue-500/30 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded">
              EUROPEAN CENTRAL BANK • UNIFIED MENTOR RESEARCH STUDY
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[11px] font-mono text-rose-300 font-medium">LIVE EMPIRICAL DATASET (10,000 CUSTOMERS)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1 flex items-center gap-2">
            Customer Segmentation & Churn Analytics Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-country quantitative investigation across France, Germany, and Spain. Uncovering behavioral triggers, high-value deposit flight risk, demographic vulnerability cohorts, and actionable retention mitigation frameworks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/Customer_Segmentation_Churn_Analytics_European_Banking_Research_Paper.docx"
            download
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-200 text-xs font-semibold transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Research Paper (.docx)</span>
          </a>
          <button
            onClick={() => navigate('/banking/simulator')}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-hud"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Launch Simulator</span>
          </button>
        </div>
      </div>

      {/* Critical Anomaly Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-rose-200 flex items-center gap-2">
              <span>GERMANY REGIONAL ALERT: 32.44% CHURN RATE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-900/60 rounded border border-rose-500/50 text-rose-300">1.59x RISK INDEX</span>
            </div>
            <p className="text-slate-300 mt-1">
              German accounts contribute 39.96% of all churn volume despite representing only 25.09% of the customer base. Customers aged 46–60 in Germany experience an extreme <strong className="text-rose-300">67.33%</strong> churn rate.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3">
          <Coins className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-amber-200 flex items-center gap-2">
              <span>WEALTH PARADOX: €110.8M HIGH-BALANCE EXPOSURE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-900/60 rounded border border-amber-500/50 text-amber-300">81.3% OF CHURN CAPITAL</span>
            </div>
            <p className="text-slate-300 mt-1">
              Departing customers hold higher average balances (€91,108 vs €72,745 retained). Premium depositors (&gt; €100k balance) represent over €110.8M in capital at risk.
            </p>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Customers */}
        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL CUSTOMERS</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">
            {summary.totalCustomers.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-400 font-mono">
            <span>100% verified dataset</span>
          </div>
        </div>

        {/* Overall Churn Rate */}
        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-rose-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CHURN RATE</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">
            {summary.churnRate}%
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-400 font-mono">
            <span>{summary.churnedCustomers.toLocaleString()} exited accounts</span>
          </div>
        </div>

        {/* Capital At Risk */}
        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL CHURN CAPITAL</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
            €{(summary.churnedBalance / 1e6).toFixed(1)}M
          </div>
          <div className="mt-1 flex items-center text-[11px] text-amber-400 font-mono">
            <span>24.3% of total bank deposits</span>
          </div>
        </div>

        {/* High-Value Exposure */}
        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-purple-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>HIGH-VALUE CHURN RISK</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-300">
            €110.8M
          </div>
          <div className="mt-1 flex items-center text-[11px] text-purple-400 font-mono">
            <span>81.3% of churned capital</span>
          </div>
        </div>

        {/* Germany Risk Multiplier */}
        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>GERMANY RISK INDEX</span>
            <Globe2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">
            1.59x
          </div>
          <div className="mt-1 flex items-center text-[11px] text-cyan-400 font-mono">
            <span>32.44% regional churn</span>
          </div>
        </div>
      </div>

      {/* Middle Section: 2 Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Churn Distribution Donut */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-cyan-400" />
                Customer Retention vs Churn Breakdown
              </h2>
              <p className="text-[11px] text-slate-400">Baseline distribution across 10,000 retail accounts</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 rounded text-slate-300">ECB Metric</span>
          </div>

          <div className="h-64 mt-4 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`${val.toLocaleString()} accounts (${((val / 10000) * 100).toFixed(2)}%)`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-slate-100">{summary.churnRate}%</span>
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">Exited</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/80">
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-slate-300 font-medium">Retained</span>
              </div>
              <div className="mt-1 text-lg font-bold font-mono text-emerald-400">{summary.retainedCustomers.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 font-mono">79.63% loyalty rate</div>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-xs text-slate-300 font-medium">Churned</span>
              </div>
              <div className="mt-1 text-lg font-bold font-mono text-rose-400">{summary.churnedCustomers.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 font-mono">20.37% loss rate</div>
            </div>
          </div>
        </div>

        {/* Right: The Multi-Product Holding Paradox */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                The Product Holdings Paradox (1 to 4 Products)
              </h2>
              <p className="text-[11px] text-slate-400">Churn rate surges catastrophically beyond 2 product holdings</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
              High Priority Anomaly
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productChartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" domain={[0, 105]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number, name: string) => [
                    name === 'churnRate' ? `${val}% Churn Rate` : val,
                    name === 'churnRate' ? 'Risk' : name
                  ]}
                />
                <Bar dataKey="churnRate" name="Churn Rate (%)" radius={[4, 4, 0, 0]}>
                  {productChartData.map((entry, index) => (
                    <Cell
                      key={`prod-cell-${index}`}
                      fill={
                        entry.churnRate > 80
                          ? '#F43F5E'
                          : entry.churnRate > 25
                          ? '#FB923C'
                          : '#10B981'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <strong className="text-amber-300">Empirical Finding:</strong> While holding 2 products represents the safest cohort (<strong className="text-emerald-400">7.58% churn</strong>), customers with 3 products experience <strong className="text-rose-400">82.71% churn</strong>, and 4 products experience a fatal <strong className="text-rose-400">100.0% churn</strong>. This proves severe bundle friction or aggressive hidden cross-sell fees.
          </div>
        </div>
      </div>

      {/* Bottom Grid: Geography Risk & Average Balance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Disparity Comparison */}
        <div className="p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-100">Regional Exposure & Risk Index</h2>
            </div>
            <button
              onClick={() => navigate('/banking/geography')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center font-mono"
            >
              <span>Drilldown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 mt-4">
            {geography.map((geo) => (
              <div key={geo.country} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-slate-200">{geo.country}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded text-slate-400">
                      {geo.total.toLocaleString()} accounts
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="text-slate-400">Risk Index:</span>
                    <span className={`font-bold ${geo.riskIndex > 1.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {geo.riskIndex}x
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      geo.churnRate > 30 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(geo.churnRate / 40) * 100}%` }}
                  ></div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Churn Rate: <strong className="text-slate-200">{geo.churnRate}%</strong> ({geo.churned.toLocaleString()} churned)</span>
                  <span>Capital at Risk: <strong className="text-amber-300">€{(geo.churnedBalance / 1e6).toFixed(1)}M</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wealth Disparity Bar Chart */}
        <div className="p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-100">Average Balance: Retained vs Churned</h2>
              </div>
              <span className="text-xs font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                +€18,363 Disparity
              </span>
            </div>

            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={balanceDisparityData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: number) => [`€${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Avg Balance']}
                  />
                  <Bar dataKey="balance" radius={[0, 6, 6, 0]}>
                    {balanceDisparityData.map((entry, index) => (
                      <Cell key={`bal-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300">
            <span className="font-semibold text-blue-300">Key Policy Takeaway:</span> Churned customers hold <strong className="text-rose-300">25.2% higher balances</strong> on average than retained customers. This confirms that churn is heavily concentrated among wealth-accumulating customers searching for yield or fleeing maintenance fees.
          </div>
        </div>
      </div>
    </div>
  );
};
