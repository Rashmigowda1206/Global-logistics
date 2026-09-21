import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  CreditCard,
  Building2,
  X,
  Info,
  Sparkles
} from 'lucide-react';
import { bankingData } from '../../data/europeanBankingData';

export interface CustomerRecord {
  Year: number;
  CustomerId: number;
  Surname: string;
  CreditScore: number;
  Geography: string;
  Gender: string;
  Age: number;
  Tenure: number;
  Balance: number;
  NumOfProducts: number;
  HasCrCard: number;
  IsActiveMember: number;
  EstimatedSalary: number;
  Exited: number;
}

export const BankingCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>(bankingData.sampleCustomers as CustomerRecord[]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeo, setSelectedGeo] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedProducts, setSelectedProducts] = useState('ALL');
  const [selectedActive, setSelectedActive] = useState('ALL');

  const [sortField, setSortField] = useState<keyof CustomerRecord>('Balance');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [activeDossier, setActiveDossier] = useState<CustomerRecord | null>(null);

  // Fetch full 10,000 customer list from public/customers.json
  useEffect(() => {
    setLoading(true);
    fetch('/customers.json')
      .then(res => res.json())
      .then((data: CustomerRecord[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        }
      })
      .catch(err => {
        console.warn('Could not fetch full customers.json, using fallback sample', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const idMatch = String(c.CustomerId).includes(query);
        const nameMatch = c.Surname.toLowerCase().includes(query);
        if (!idMatch && !nameMatch) return false;
      }

      // Geo
      if (selectedGeo !== 'ALL' && c.Geography !== selectedGeo) return false;

      // Gender
      if (selectedGender !== 'ALL' && c.Gender !== selectedGender) return false;

      // Status
      if (selectedStatus === 'CHURNED' && c.Exited !== 1) return false;
      if (selectedStatus === 'RETAINED' && c.Exited !== 0) return false;

      // Products
      if (selectedProducts !== 'ALL' && c.NumOfProducts !== Number(selectedProducts)) return false;

      // Active
      if (selectedActive === 'ACTIVE' && c.IsActiveMember !== 1) return false;
      if (selectedActive === 'INACTIVE' && c.IsActiveMember !== 0) return false;

      return true;
    });
  }, [customers, searchTerm, selectedGeo, selectedGender, selectedStatus, selectedProducts, selectedActive]);

  // Sorted customers
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredCustomers, sortField, sortAsc]);

  // Paginated customers
  const totalPages = Math.ceil(sortedCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  const handleSort = (field: keyof CustomerRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportFilteredCSV = () => {
    if (filteredCustomers.length === 0) return;
    const headers = Object.keys(filteredCustomers[0]).join(',');
    const rows = filteredCustomers.map(c => Object.values(c).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EuroBank_Customers_Filtered_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              RETAIL CUSTOMER REGISTRY & DRILLDOWN EXPLORER
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Customer Cohort & Risk Profile Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time search, multi-factor filtering, and customer dossier inspection across 10,000 empirical European banking records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportFilteredCSV}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Filtered CSV ({filteredCustomers.length.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Customer ID or Surname (e.g. Hargrave, 15634602)..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B132B] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 self-center">
            <span>Showing</span>
            <strong className="text-cyan-400">{filteredCustomers.length.toLocaleString()}</strong>
            <span>of</span>
            <strong className="text-slate-200">{customers.length.toLocaleString()}</strong>
            <span>customers</span>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase">Country</label>
            <select
              value={selectedGeo}
              onChange={e => { setSelectedGeo(e.target.value); setCurrentPage(1); }}
              className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#0B132B] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Countries</option>
              <option value="France">France (16.15% Churn)</option>
              <option value="Germany">Germany (32.44% Churn)</option>
              <option value="Spain">Spain (16.67% Churn)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase">Status</label>
            <select
              value={selectedStatus}
              onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#0B132B] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="CHURNED">Churned / Exited</option>
              <option value="RETAINED">Retained / Active</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase">Products</label>
            <select
              value={selectedProducts}
              onChange={e => { setSelectedProducts(e.target.value); setCurrentPage(1); }}
              className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#0B132B] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Products (1–4)</option>
              <option value="1">1 Product (27.7% Churn)</option>
              <option value="2">2 Products (7.6% Churn)</option>
              <option value="3">3 Products (82.7% Churn)</option>
              <option value="4">4 Products (100% Churn)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase">Gender</label>
            <select
              value={selectedGender}
              onChange={e => { setSelectedGender(e.target.value); setCurrentPage(1); }}
              className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#0B132B] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Genders</option>
              <option value="Female">Female (25.1% Churn)</option>
              <option value="Male">Male (16.5% Churn)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase">Member Activity</label>
            <select
              value={selectedActive}
              onChange={e => { setSelectedActive(e.target.value); setCurrentPage(1); }}
              className="w-full mt-1 px-2.5 py-1.5 rounded bg-[#0B132B] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Activity</option>
              <option value="ACTIVE">Active (14.3% Churn)</option>
              <option value="INACTIVE">Inactive (26.9% Churn)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-5 rounded-xl bg-[#070D1E]/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase bg-slate-900/50">
                <th onClick={() => handleSort('CustomerId')} className="p-3 cursor-pointer hover:text-cyan-400">Customer ID</th>
                <th onClick={() => handleSort('Surname')} className="p-3 cursor-pointer hover:text-cyan-400">Surname</th>
                <th onClick={() => handleSort('Geography')} className="p-3 cursor-pointer hover:text-cyan-400">Country</th>
                <th onClick={() => handleSort('Gender')} className="p-3 cursor-pointer hover:text-cyan-400">Gender</th>
                <th onClick={() => handleSort('Age')} className="p-3 cursor-pointer hover:text-cyan-400">Age</th>
                <th onClick={() => handleSort('CreditScore')} className="p-3 cursor-pointer hover:text-cyan-400">Credit Score</th>
                <th onClick={() => handleSort('Balance')} className="p-3 cursor-pointer hover:text-cyan-400">Balance</th>
                <th onClick={() => handleSort('NumOfProducts')} className="p-3 cursor-pointer hover:text-cyan-400 text-center">Products</th>
                <th className="p-3 text-center">Active</th>
                <th onClick={() => handleSort('Exited')} className="p-3 cursor-pointer hover:text-cyan-400 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {paginatedCustomers.map((c) => {
                const isChurned = c.Exited === 1;
                const isHighRiskCohort = c.Geography === 'Germany' && c.Age >= 46 && c.Age <= 60;
                return (
                  <tr
                    key={c.CustomerId}
                    onClick={() => setActiveDossier(c)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="p-3 font-bold text-cyan-400">{c.CustomerId}</td>
                    <td className="p-3 font-sans font-medium text-slate-200">{c.Surname}</td>
                    <td className="p-3 font-sans">
                      <span className="flex items-center gap-1.5">
                        <span>{c.Geography === 'Germany' ? '🇩🇪' : c.Geography === 'France' ? '🇫🇷' : '🇪🇸'}</span>
                        <span>{c.Geography}</span>
                      </span>
                    </td>
                    <td className="p-3 font-sans text-slate-400">{c.Gender}</td>
                    <td className="p-3">
                      <span className={isHighRiskCohort ? 'text-rose-400 font-bold' : ''}>
                        {c.Age}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={c.CreditScore < 580 ? 'text-rose-400' : 'text-slate-300'}>
                        {c.CreditScore}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-100">
                      €{c.Balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        c.NumOfProducts >= 3 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {c.NumOfProducts}
                      </span>
                    </td>
                    <td className="p-3 text-center font-sans">
                      {c.IsActiveMember === 1 ? (
                        <span className="text-emerald-400 text-[11px]">Active</span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Inactive</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isChurned ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 text-[10px]">
                          CHURNED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                          RETAINED
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDossier(c);
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-800 font-mono text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span>Page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages}</strong></span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 rounded bg-[#0B132B] border border-slate-700 text-slate-300 text-xs focus:outline-none"
            >
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded bg-[#0B132B] border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded bg-[#0B132B] border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Dossier Modal / Slide-over */}
      {activeDossier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A1226] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-cyan-400">CUSTOMER DOSSIER #{activeDossier.CustomerId}</span>
                  {activeDossier.Exited === 1 ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 text-[10px]">
                      CHURNED / EXITED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                      RETAINED / ACTIVE
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mt-1">{activeDossier.Surname}</h2>
              </div>
              <button
                onClick={() => setActiveDossier(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">GEOGRAPHY</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{activeDossier.Geography}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">AGE / GENDER</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{activeDossier.Age} yrs • {activeDossier.Gender}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">CREDIT SCORE</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{activeDossier.CreditScore}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">TENURE</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{activeDossier.Tenure} years</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400">ACCOUNT BALANCE</span>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                  €{activeDossier.Balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Estimated Salary: €{activeDossier.EstimatedSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400">PRODUCT ENGAGEMENT</span>
                <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                  {activeDossier.NumOfProducts} Product{activeDossier.NumOfProducts > 1 ? 's' : ''}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Credit Card: {activeDossier.HasCrCard === 1 ? 'Yes' : 'No'} • Status: {activeDossier.IsActiveMember === 1 ? 'Active Member' : 'Inactive'}
                </div>
              </div>
            </div>

            {/* Retention Risk Assessment & Recommended Action */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2 text-xs">
              <div className="font-bold text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Automated Retention Intelligence Recommendation:</span>
              </div>
              <p className="text-slate-300">
                {activeDossier.NumOfProducts >= 3
                  ? 'CRITICAL ALERT: Multi-product account holding (3+ products). Immediate fee restructuring and bundling discount recommended to resolve the 82.7% churn cliff.'
                  : activeDossier.Geography === 'Germany' && activeDossier.Age >= 46 && activeDossier.Age <= 60
                  ? 'HIGH PRIORITY: Account falls within the acute Germany 46–60 age bracket (67.33% historical exit risk). Dispatch dedicated wealth relationship manager.'
                  : activeDossier.IsActiveMember === 0
                  ? 'MODERATE RISK: Inactive member status increases churn likelihood by 1.88x. Enroll in digital mobile banking reactivation campaign.'
                  : 'STABLE PROFILE: Account maintains healthy transactional profile. Offer loyalty deposit yield bonus.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveDossier(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
