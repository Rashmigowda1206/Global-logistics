import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Globe2,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Clock,
  Package,
  TrendingDown,
  Building,
  Anchor,
  X,
  ExternalLink,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLogisticsFilter } from '../context/FilterContext';

interface CountryProfile {
  id: string;
  name: string;
  code: string;
  capital: string;
  majorHubs: string[];
  onTimeRate: number;
  avgDelay: number;
  riskScore: number;
  shipmentVolume: number;
  shippingModes: { mode: string; share: string }[];
  delayCauses: { cause: string; pct: number }[];
  topRoutes: string[];
  topDelayedProducts: string[];
  customerSegments: { segment: string; share: string }[];
}

interface RegionData {
  id: string;
  name: string;
  marketKey: string;
  description: string;
  onTimeRate: number;
  avgDelay: number;
  riskScore: number;
  volume: number;
  countries: CountryProfile[];
}

const REGIONAL_DATABASE: Record<string, RegionData> = {
  europe: {
    id: 'europe',
    name: 'Europe Operations',
    marketKey: 'Europe',
    description: 'European Union, Schengen Trade Lanes & North Sea Hubs',
    onTimeRate: 78.4,
    avgDelay: 2.1,
    riskScore: 68,
    volume: 3840,
    countries: [
      {
        id: 'germany',
        name: 'Germany',
        code: 'DE',
        capital: 'Berlin',
        majorHubs: ['Hamburg Container Terminal', 'Frankfurt CargoCity', 'Bremen'],
        onTimeRate: 74.2,
        avgDelay: 2.4,
        riskScore: 72,
        shipmentVolume: 1420,
        shippingModes: [
          { mode: 'Sea (Hamburg)', share: '48%' },
          { mode: 'Rail (DB Cargo)', share: '24%' },
          { mode: 'Road Linehaul', share: '18%' },
          { mode: 'Air (Frankfurt)', share: '10%' },
        ],
        delayCauses: [
          { cause: 'Customs declaration review backlog', pct: 38 },
          { cause: 'Elbe river draft & locks congestion', pct: 32 },
          { cause: 'Inland rail gauge coordination', pct: 18 },
          { cause: 'Other dwell factors', pct: 12 },
        ],
        topRoutes: [
          'Singapore → Hamburg',
          'Shanghai → Hamburg',
          'Frankfurt → Chicago',
          'Hamburg → Prague Intermodal'
        ],
        topDelayedProducts: [
          'Industrial Optical Sensors',
          'Lithium Battery Modules',
          'CNC Spindle Assemblies'
        ],
        customerSegments: [
          { segment: 'Corporate', share: '52%' },
          { segment: 'Industrial', share: '28%' },
          { segment: 'Consumer', share: '20%' },
        ]
      },
      {
        id: 'netherlands',
        name: 'Netherlands',
        code: 'NL',
        capital: 'Amsterdam',
        majorHubs: ['Port of Rotterdam Maasvlakte', 'Amsterdam Schiphol'],
        onTimeRate: 81.0,
        avgDelay: 1.8,
        riskScore: 64,
        shipmentVolume: 1180,
        shippingModes: [
          { mode: 'Sea (Rotterdam)', share: '62%' },
          { mode: 'Barge / Inland River', share: '20%' },
          { mode: 'Road Freight', share: '12%' },
          { mode: 'Air (Schiphol)', share: '6%' },
        ],
        delayCauses: [
          { cause: 'Feeder vessel berth queuing', pct: 44 },
          { cause: 'Rhine waterway water level alerts', pct: 28 },
          { cause: 'Automated crane maintenance', pct: 16 },
          { cause: 'Other', pct: 12 },
        ],
        topRoutes: [
          'Singapore → Rotterdam',
          'Shenzhen → Rotterdam',
          'Rotterdam → New York'
        ],
        topDelayedProducts: [
          'Server Rack Power Supplies',
          'Consumer Electronics',
          'Specialty Chemicals'
        ],
        customerSegments: [
          { segment: 'Corporate', share: '58%' },
          { segment: 'Consumer', share: '30%' },
          { segment: 'Industrial', share: '12%' },
        ]
      },
      {
        id: 'france',
        name: 'France',
        code: 'FR',
        capital: 'Paris',
        majorHubs: ['Port of Le Havre', 'Marseille Fos', 'Paris CDG'],
        onTimeRate: 76.5,
        avgDelay: 2.2,
        riskScore: 66,
        shipmentVolume: 740,
        shippingModes: [
          { mode: 'Sea Freight', share: '50%' },
          { mode: 'Road Linehaul', share: '32%' },
          { mode: 'Air Cargo', share: '18%' },
        ],
        delayCauses: [
          { cause: 'Port terminal labor slowdowns', pct: 40 },
          { cause: 'Customs phytosanitary checks', pct: 30 },
          { cause: 'Highway toll strikes', pct: 20 },
          { cause: 'Other', pct: 10 },
        ],
        topRoutes: [
          'Santos → Le Havre',
          'Marseille → Barcelona',
          'CDG → Tokyo Narita'
        ],
        topDelayedProducts: [
          'Automotive Parts',
          'Fast-Fashion Apparel',
          'Cosmetics & Fragrances'
        ],
        customerSegments: [
          { segment: 'Corporate', share: '45%' },
          { segment: 'Consumer', share: '40%' },
          { segment: 'Home Office', share: '15%' },
        ]
      }
    ]
  },
  asia: {
    id: 'asia',
    name: 'Asia Pacific Operations',
    marketKey: 'Pacific Asia',
    description: 'East Asia, Southeast Asia & Transpacific Corridors',
    onTimeRate: 71.2,
    avgDelay: 2.8,
    riskScore: 82,
    volume: 5420,
    countries: [
      {
        id: 'singapore',
        name: 'Singapore',
        code: 'SG',
        capital: 'Singapore',
        majorHubs: ['Singapore PSA Port', 'Changi Air Cargo Center'],
        onTimeRate: 72.8,
        avgDelay: 2.7,
        riskScore: 78,
        shipmentVolume: 2150,
        shippingModes: [
          { mode: 'Sea Transshipment', share: '74%' },
          { mode: 'Air Cargo', share: '26%' },
        ],
        delayCauses: [
          { cause: 'Anchorage berth waiting dwell', pct: 48 },
          { cause: 'Feeder vessel schedule unreliability', pct: 32 },
          { cause: 'Storm monsoon diversions', pct: 12 },
          { cause: 'Other', pct: 8 },
        ],
        topRoutes: [
          'Singapore → Rotterdam',
          'Dubai → Singapore',
          'Tokyo → Singapore'
        ],
        topDelayedProducts: [
          'Optical Sensors',
          'Avionics Spares',
          'Consumer Wearables'
        ],
        customerSegments: [
          { segment: 'Corporate', share: '60%' },
          { segment: 'Industrial', share: '25%' },
          { segment: 'Consumer', share: '15%' },
        ]
      },
      {
        id: 'china',
        name: 'China',
        code: 'CN',
        capital: 'Beijing',
        majorHubs: ['Shanghai Yangshan', 'Shenzhen Yantian', 'Ningbo'],
        onTimeRate: 69.4,
        avgDelay: 3.2,
        riskScore: 86,
        shipmentVolume: 2840,
        shippingModes: [
          { mode: 'Sea Container', share: '68%' },
          { mode: 'Rail (Eurasia)', share: '18%' },
          { mode: 'Air Cargo', share: '14%' },
        ],
        delayCauses: [
          { cause: 'Terminal container stack saturation', pct: 45 },
          { cause: 'Export customs audit inspections', pct: 26 },
          { cause: 'Vessel blank sailings', pct: 20 },
          { cause: 'Other', pct: 9 },
        ],
        topRoutes: [
          'Shanghai → Los Angeles',
          'Shanghai → Antwerp',
          'Shenzhen → Rotterdam'
        ],
        topDelayedProducts: [
          'Lithium Batteries',
          'Server Hardware',
          'Drone Assemblies'
        ],
        customerSegments: [
          { segment: 'Corporate', share: '50%' },
          { segment: 'Consumer', share: '35%' },
          { segment: 'Industrial', share: '15%' },
        ]
      }
    ]
  },
  'north-america': {
    id: 'north-america',
    name: 'North America Operations',
    marketKey: 'USCA',
    description: 'United States, Canada & USMCA Cross-Border Logistics',
    onTimeRate: 84.1,
    avgDelay: 1.4,
    riskScore: 42,
    volume: 3210,
    countries: [
      {
        id: 'united-states',
        name: 'United States',
        code: 'US',
        capital: 'Washington, D.C.',
        majorHubs: ['Port of Los Angeles', 'Port of New York / Newark', 'Chicago Gateway'],
        onTimeRate: 83.5,
        avgDelay: 1.5,
        riskScore: 45,
        shipmentVolume: 2750,
        shippingModes: [
          { mode: 'Road Freight', share: '46%' },
          { mode: 'Sea Freight', share: '32%' },
          { mode: 'Rail Intermodal', share: '14%' },
          { mode: 'Air Cargo', share: '8%' },
        ],
        delayCauses: [
          { cause: 'Inland drayage chassis shortage', pct: 40 },
          { cause: 'Terminal gate dwell time', pct: 30 },
          { cause: 'Customs FDA / PGA holds', pct: 18 },
          { cause: 'Other', pct: 12 },
        ],
        topRoutes: [
          'Yokohama → Los Angeles',
          'Rotterdam → New York',
          'Chicago → Frankfurt'
        ],
        topDelayedProducts: [
          'EV Drive Inverters',
          'Pharmaceutical Kits',
          'Drone Gimbals'
        ],
        customerSegments: [
          { segment: 'Consumer', share: '48%' },
          { segment: 'Corporate', share: '36%' },
          { segment: 'Industrial', share: '16%' },
        ]
      }
    ]
  }
};

export const RegionalOperations: React.FC = () => {
  const navigate = useNavigate();
  const { updateFilter } = useLogisticsFilter();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('europe');
  const [selectedCountry, setSelectedCountry] = useState<CountryProfile | null>(null);

  const currentRegion = REGIONAL_DATABASE[selectedRegionId] || REGIONAL_DATABASE['europe'];

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto font-mono">
      <Breadcrumbs
        customItems={
          selectedCountry
            ? [
                { label: 'Regional Operations', to: '/regions' },
                { label: currentRegion.name, to: '/regions' },
                { label: `${selectedCountry.name} Logistics Profile` }
              ]
            : [
                { label: 'Regional Operations', to: '/regions' },
                { label: currentRegion.name }
              ]
        }
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              GEOGRAPHIC COMMAND & DRILL-DOWN
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            REGIONAL OPERATIONS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Macro-zone trade lanes, country logistics profiles, terminal bottlenecks, and localized delay causes
          </p>
        </div>

        {/* Global Region Switcher */}
        <div className="flex items-center space-x-1.5 bg-[#070D1E] p-1 rounded-lg border border-slate-700/60 text-xs">
          {Object.values(REGIONAL_DATABASE).map((reg) => (
            <button
              key={reg.id}
              onClick={() => {
                setSelectedRegionId(reg.id);
                setSelectedCountry(null);
              }}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                selectedRegionId === reg.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {reg.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Region KPI Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-slate-800">
          <span className="text-slate-500 text-xs block">Monitored Volume</span>
          <span className="text-2xl font-bold text-slate-100">
            {currentRegion.volume.toLocaleString()}
          </span>
          <span className="text-[10px] text-cyan-400 block mt-0.5">active lane units</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-slate-800">
          <span className="text-slate-500 text-xs block">Regional On-Time Rate</span>
          <span className="text-2xl font-bold text-emerald-400">
            {currentRegion.onTimeRate}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">SLA threshold: 85%</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-slate-800">
          <span className="text-slate-500 text-xs block">Average Lead Variance</span>
          <span className="text-2xl font-bold text-amber-400">
            +{currentRegion.avgDelay} days
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">vs standard transit</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/90 border border-slate-800">
          <span className="text-slate-500 text-xs block">Regional Delay Risk</span>
          <span className="text-2xl font-bold text-rose-400">
            {currentRegion.riskScore}%
          </span>
          <span className="text-[10px] text-rose-400/80 block mt-0.5">Chokepoint exposure</span>
        </div>
      </div>

      {/* Countries Section in Current Region */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              {currentRegion.name} • MEMBER COUNTRIES & LOGISTICS PROFILES
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any country to open detailed profile (e.g. Germany)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRegion.countries.map((country) => (
            <div
              key={country.id}
              onClick={() => setSelectedCountry(country)}
              className="p-5 rounded-xl bg-[#070D1E]/95 hover:bg-[#0B1533] border border-cyan-500/25 hover:border-cyan-400/60 cursor-pointer transition-all shadow-lg space-y-3.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-sm">
                    {country.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {country.name}
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      Capital: {country.capital} • {country.majorHubs.length} Primary Terminals
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    country.riskScore > 70
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : country.riskScore > 50
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {country.riskScore}% RISK
                </span>
              </div>

              {/* Major Hubs Pills */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {country.majorHubs.map((hub, hIdx) => (
                  <span
                    key={hIdx}
                    className="px-2 py-0.5 rounded bg-[#0A132C] text-slate-300 border border-slate-700/60"
                  >
                    ⚓ {hub}
                  </span>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">On-Time SLA</span>
                  <span className="font-bold text-emerald-400">{country.onTimeRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Avg Delay</span>
                  <span className="font-bold text-amber-400">+{country.avgDelay}d</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Volume</span>
                  <span className="font-bold text-slate-200">{country.shipmentVolume}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-cyan-400 group-hover:underline">
                <span>View Full Logistics Profile</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED COUNTRY LOGISTICS PROFILE MODAL (e.g. Germany) */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-[#070D22] border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 bg-[#050916] border-b border-command-border/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300">
                  {selectedCountry.code}
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wide">
                    COUNTRY LOGISTICS PROFILE
                  </span>
                  <h3 className="text-base font-extrabold text-slate-100">
                    {selectedCountry.name.toUpperCase()} LOGISTICS PROFILE
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCountry(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
              {/* Top Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#0A132C] border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">On-Time Delivery</span>
                  <span className="text-lg font-bold text-emerald-400">{selectedCountry.onTimeRate}%</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0A132C] border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Average Delay</span>
                  <span className="text-lg font-bold text-amber-400">+{selectedCountry.avgDelay} days</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0A132C] border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Delay Risk Score</span>
                  <span className="text-lg font-bold text-rose-400">{selectedCountry.riskScore}%</span>
                </div>
              </div>

              {/* Shipping Modes in Germany/Country */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  Shipping Mode Distribution
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedCountry.shippingModes.map((sm, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-lg bg-[#0A132C] border border-slate-800">
                      <span className="text-slate-400 text-[10px] block truncate">{sm.mode}</span>
                      <span className="text-sm font-bold text-cyan-300">{sm.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delay Causes */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  Primary Delay Causes
                </h4>
                <div className="space-y-1.5">
                  {selectedCountry.delayCauses.map((dc, dIdx) => (
                    <div key={dIdx} className="p-2.5 rounded-lg bg-[#0A132C] border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300 text-[11px]">{dc.cause}</span>
                      <span className="text-amber-400 font-bold">{dc.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Trade Routes & Delayed Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                    Top Connected Trade Routes
                  </h4>
                  <div className="p-3 rounded-xl bg-[#0A132C] border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                    {selectedCountry.topRoutes.map((tr, tIdx) => (
                      <div key={tIdx}>• {tr}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                    Top Delayed Product Categories
                  </h4>
                  <div className="p-3 rounded-xl bg-[#0A132C] border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                    {selectedCountry.topDelayedProducts.map((tp, pIdx) => (
                      <div key={pIdx}>• {tp}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#050916] border-t border-command-border/40 flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">
                Active dataset: {selectedCountry.shipmentVolume} orders
              </span>
              <button
                onClick={() => {
                  updateFilter('searchQuery', selectedCountry.name);
                  navigate('/shipments');
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors flex items-center space-x-1.5"
              >
                <span>Filter Shipments in {selectedCountry.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
