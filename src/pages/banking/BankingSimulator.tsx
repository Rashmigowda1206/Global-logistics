import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingDown,
  Coins,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Calculator,
  Building2,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { bankingData } from '../../data/europeanBankingData';

export const BankingSimulator: React.FC = () => {
  const { summary } = bankingData;

  // Simulation Sliders
  const [interestBonus, setInterestBonus] = useState<number>(0.5); // 0 to 1.5%
  const [germanyCoverage, setGermanyCoverage] = useState<number>(75); // 0 to 100%
  const [multiProductDiscount, setMultiProductDiscount] = useState<number>(80); // 0 to 100%
  const [reactivationBudget, setReactivationBudget] = useState<number>(250); // €k

  // Dynamic simulation engine
  const simulationResults = useMemo(() => {
    // Baseline numbers
    const baseChurn = summary.churnRate; // 20.37%
    const baseChurned = summary.churnedCustomers; // 2,037
    const baseCapitalRisk = summary.churnedBalance; // ~€185.6M

    // Impact calculation
    // 1. Interest bonus reduces high-balance deposit flight (up to -2.8% churn)
    const interestImpact = (interestBonus / 1.5) * 2.8;

    // 2. Germany coverage addresses 46-60 cohort (up to -3.2% churn)
    const germanyImpact = (germanyCoverage / 100) * 3.2;

    // 3. Multi-product fee restructuring fixes the 3 & 4 product penalty (up to -1.9% churn)
    const bundleImpact = (multiProductDiscount / 100) * 1.9;

    // 4. Inactive reactivation (up to -1.2% churn)
    const reactivationImpact = (reactivationBudget / 500) * 1.2;

    const totalReduction = +(interestImpact + germanyImpact + bundleImpact + reactivationImpact).toFixed(2);
    const simulatedChurn = Math.max(7.5, +(baseChurn - totalReduction).toFixed(2));
    const accountsSaved = Math.round((totalReduction / 100) * summary.totalCustomers);
    const capitalSavedM = +((accountsSaved * summary.avgBalanceChurned) / 1e6).toFixed(1);

    // Program cost estimation
    const interestCost = ((interestBonus / 100) * (summary.totalBalance * 0.15)) / 1e6; // e.g. 0.5% on 15% of deposits
    const totalCostM = +(interestCost + (germanyCoverage * 0.008) + (reactivationBudget / 1000)).toFixed(2);
    const netBenefitM = +(capitalSavedM - totalCostM).toFixed(1);
    const roi = totalCostM > 0 ? ((capitalSavedM / totalCostM) * 100).toFixed(0) : '0';

    return {
      totalReduction,
      simulatedChurn,
      accountsSaved,
      capitalSavedM,
      totalCostM,
      netBenefitM,
      roi,
    };
  }, [interestBonus, germanyCoverage, multiProductDiscount, reactivationBudget, summary]);

  const comparisonData = [
    { name: 'Baseline (Current)', churnRate: summary.churnRate, capitalRiskM: +(summary.churnedBalance / 1e6).toFixed(1), fill: '#F43F5E' },
    { name: 'Simulated (Protected)', churnRate: simulationResults.simulatedChurn, capitalRiskM: +( (summary.churnedBalance / 1e6) - simulationResults.capitalSavedM ).toFixed(1), fill: '#10B981' },
  ];

  const resetDefaults = () => {
    setInterestBonus(0.5);
    setGermanyCoverage(75);
    setMultiProductDiscount(80);
    setReactivationBudget(250);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              STRATEGIC RETENTION ENGINE • WHAT-IF SCENARIO MODELER
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Capital Protection & Churn Mitigation Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate policy interventions, pricing adjustments, and dedicated relationship manager deployments to quantify churn reduction, capital saved, and return on investment.
          </p>
        </div>

        <button
          onClick={resetDefaults}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono transition-all self-start md:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Grid: Controls on Left, Live Impact on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Policy Sliders */}
        <div className="lg:col-span-6 space-y-5 p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              Intervention Parameter Controls
            </h2>
            <p className="text-[11px] text-slate-400">Adjust the levers below to simulate empirical impact on the 10,000 customer base</p>
          </div>

          {/* Slider 1: Tiered Interest Bonus */}
          <div className="space-y-2 p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">1. Tiered High-Yield Deposit Bonus</span>
              <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                +{interestBonus}% APY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Incentive yield on balances &gt; €50,000 to halt deposit flight to Neo-brokers and money-market funds.
            </p>
            <input
              type="range"
              min={0}
              max={1.5}
              step={0.05}
              value={interestBonus}
              onChange={e => setInterestBonus(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.00% (No bonus)</span>
              <span>+0.75%</span>
              <span>+1.50% (Max yield)</span>
            </div>
          </div>

          {/* Slider 2: Germany 46-60 Concierge Coverage */}
          <div className="space-y-2 p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">2. Germany 46–60 Dedicated Concierge Coverage</span>
              <span className="font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                {germanyCoverage}% Coverage
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Proactive relationship management outreach targeting the 67.33% churn risk peak cohort in Germany.
            </p>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={germanyCoverage}
              onChange={e => setGermanyCoverage(parseInt(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Standard)</span>
              <span>50%</span>
              <span>100% (Full VIP Outbound)</span>
            </div>
          </div>

          {/* Slider 3: Multi-Product Fee Restructuring */}
          <div className="space-y-2 p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">3. Multi-Product Fee Restructuring</span>
              <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                {multiProductDiscount}% Fee Waiver
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Eliminate punitive maintenance fees on 3rd & 4th products to resolve the 82.7%–100% bundle cliff.
            </p>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={multiProductDiscount}
              onChange={e => setMultiProductDiscount(parseInt(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Current fees)</span>
              <span>50%</span>
              <span>100% (Zero Bundle Fees)</span>
            </div>
          </div>

          {/* Slider 4: Inactive Reactivation Campaign */}
          <div className="space-y-2 p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">4. Digital Inactivity Reactivation Budget</span>
              <span className="font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                €{reactivationBudget}k Budget
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Mobile app automated notifications, cashback incentives, and daily banking engagement hooks.
            </p>
            <input
              type="range"
              min={0}
              max={500}
              step={25}
              value={reactivationBudget}
              onChange={e => setReactivationBudget(parseInt(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>€0</span>
              <span>€250k</span>
              <span>€500k (Aggressive push)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Projected Impact & ROI */}
        <div className="lg:col-span-6 space-y-5 flex flex-col">
          {/* Headline Results Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-[#070D1E] to-blue-950/30 border border-emerald-500/40 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                SIMULATED PORTFOLIO OUTCOME
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                -{simulationResults.totalReduction}% CHURN DROP
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">PROJECTED CHURN RATE</span>
                <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                  {simulationResults.simulatedChurn}%
                </div>
                <div className="text-[10px] text-slate-500 line-through">down from 20.37%</div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400">ACCOUNTS SAVED</span>
                <div className="text-2xl font-mono font-bold text-slate-100 mt-1">
                  +{simulationResults.accountsSaved.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">retained customers</div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400">CAPITAL PROTECTED</span>
                <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                  €{simulationResults.capitalSavedM}M
                </div>
                <div className="text-[10px] text-amber-400 font-mono">deposits shielded</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px]">PROGRAM IMPLEMENTATION COST</span>
                <div className="text-base font-bold text-slate-200 mt-0.5">€{simulationResults.totalCostM}M</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px]">ESTIMATED PROGRAM ROI</span>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{simulationResults.roi}%</div>
              </div>
            </div>
          </div>

          {/* Comparative Bar Chart */}
          <div className="p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-semibold text-slate-200">Baseline vs Simulated Churn Rate Comparison</span>
                <span className="text-xs font-mono text-slate-400">Target Benchmark: &lt; 15%</span>
              </div>

              <div className="h-44 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" stroke="#64748B" fontSize={11} unit="%" domain={[0, 25]} />
                    <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={130} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: number) => [`${val}%`, 'Churn Rate']}
                    />
                    <Bar dataKey="churnRate" radius={[0, 6, 6, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`sim-bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 mt-3">
              <strong className="text-blue-300">Executive Summary:</strong> By addressing the German 46–60 age group and restructuring multi-product bundle fees, the bank can successfully save <strong className="text-slate-100">€{simulationResults.capitalSavedM} Million</strong> in liquid deposit capital with an estimated ROI of <strong className="text-emerald-400">{simulationResults.roi}%</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
