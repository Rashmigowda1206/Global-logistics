import React, { useState } from 'react';
import {
  Users2,
  AlertTriangle,
  Flame,
  Activity,
  UserCheck,
  UserX,
  TrendingUp,
  Award,
  Clock,
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
  LineChart,
  Line
} from 'recharts';
import { bankingData } from '../../data/europeanBankingData';

export const BankingDemographics: React.FC = () => {
  const { ageCohorts, gender, activity } = bankingData;
  const [activeTab, setActiveTab] = useState<'age' | 'gender' | 'activity'>('age');

  const ageChartData = ageCohorts.map(ac => ({
    name: ac.ageGroup,
    overallRate: ac.churnRate,
    germanyRate: ac.germanyRate,
    franceRate: ac.franceRate,
    spainRate: ac.spainRate,
    total: ac.total,
    churned: ac.churned,
  }));

  const genderChartData = gender.map(g => ({
    name: g.gender,
    churnRate: g.churnRate,
    total: g.total,
    churned: g.churned,
    avgBalance: g.avgBalance,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users2 className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-mono text-purple-400 tracking-wider uppercase">
              DEMOGRAPHIC RISK & COHORT ANALYSIS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Age, Gender & Activity Vulnerability Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Granular empirical segmentation identifying acute demographic churn clusters, cross-generational risk trajectories, and behavioral activity attrition.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#0B132B] p-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('age')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'age' ? 'bg-purple-600 text-white font-bold shadow-hud' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Age Cohorts
          </button>
          <button
            onClick={() => setActiveTab('gender')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'gender' ? 'bg-purple-600 text-white font-bold shadow-hud' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gender Dynamics
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'activity' ? 'bg-purple-600 text-white font-bold shadow-hud' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Member Activity
          </button>
        </div>
      </div>

      {/* Hero Age Cohort Insight Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-slate-900 border border-rose-500/40 flex items-start space-x-4">
        <Flame className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-rose-200 uppercase tracking-wide">
              CRITICAL COHORT VULNERABILITY: AGE 46–60 SURGE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-900/80 rounded border border-rose-500/50 text-rose-300">
              67.33% GERMANY PEAK
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            While younger customers (&lt; 30) exhibit an ultra-low <strong className="text-emerald-400">7.5%</strong> churn rate, customers in the mid-to-senior wealth-accumulation bracket (46–60) defect at an alarming <strong className="text-rose-400">54.2%</strong> overall rate. In Germany, this reaches an unprecedented <strong className="text-rose-400 font-mono">67.33%</strong> — representing the single largest vulnerability in the European banking portfolio.
          </p>
        </div>
      </div>

      {/* Age Cohorts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ageCohorts.map(ac => {
          const isExtreme = ac.churnRate > 50;
          return (
            <div
              key={ac.ageGroup}
              className={`p-4 rounded-xl border ${
                isExtreme
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-hud'
                  : 'bg-[#070D1E]/90 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-300">{ac.ageGroup}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isExtreme ? 'bg-rose-500/30 text-rose-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {ac.total.toLocaleString()} clients
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className={`text-2xl font-mono font-bold ${isExtreme ? 'text-rose-400' : 'text-slate-100'}`}>
                  {ac.churnRate}%
                </span>
                <span className="text-xs text-slate-500">{ac.churned.toLocaleString()} exited</span>
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full ${isExtreme ? 'bg-rose-500' : 'bg-blue-500'}`}
                  style={{ width: `${(ac.churnRate / 70) * 100}%` }}
                ></div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono space-y-0.5">
                <div className="flex justify-between text-slate-400">
                  <span>Germany Rate:</span>
                  <span className={`font-bold ${ac.germanyRate > 50 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {ac.germanyRate}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>France / Spain:</span>
                  <span className="text-slate-300">{ac.franceRate}% / {ac.spainRate}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Age Chart: Overall vs Country Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Age Cohort Churn Rate by Sovereign Jurisdiction (%)</h2>
              <p className="text-[11px] text-slate-400">Multi-country trajectory showing the 46–60 age spike</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
              Cohort Risk Curves
            </span>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageChartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" domain={[0, 75]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="overallRate" name="Pan-European Avg" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="germanyRate" name="Germany" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="franceRate" name="France" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spainRate" name="Spain" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender & Activity Disparity Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Gender Card */}
          <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-xs font-semibold text-slate-200">Gender Disparity Dynamics</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded">
                1.52x Ratio
              </span>
            </div>
            <div className="mt-3 space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Female Customers</span>
                  <span className="font-mono font-bold text-rose-400">25.07% Churn</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  1,139 churned out of 4,543 accounts. Higher wealth sensitivity.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Male Customers</span>
                  <span className="font-mono font-bold text-blue-400">16.46% Churn</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  898 churned out of 5,457 accounts. 8.61 percentage points lower.
                </div>
              </div>
            </div>
          </div>

          {/* Activity Status Card */}
          <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-xs font-semibold text-slate-200">Member Activity Status Effect</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded">
                1.88x Multiplier
              </span>
            </div>
            <div className="mt-3 space-y-3">
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-200 font-medium">Inactive Members</span>
                  <span className="font-mono font-bold text-rose-400">26.85% Churn</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  1,302 churned out of 4,849 accounts. Inactivity is an early warning trigger.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-200 font-medium">Active Members</span>
                  <span className="font-mono font-bold text-emerald-400">14.27% Churn</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  735 churned out of 5,151 accounts. High transactional stickiness.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
