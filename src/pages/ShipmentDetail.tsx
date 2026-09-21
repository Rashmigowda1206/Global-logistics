import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Ship,
  MapPin,
  ExternalLink,
  Zap,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Building,
  DollarSign,
  User,
  ArrowLeft
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLogisticsFilter } from '../context/FilterContext';
import { MOCK_SHIPMENTS } from '../data/mockLogisticsData';

export const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allShipments } = useLogisticsFilter();

  const shipment =
    allShipments.find((s) => s.orderId.toLowerCase() === id?.toLowerCase()) ||
    allShipments[0]; // fallback to first flagship order

  const isDelayed = shipment.deliveryClassification === 'DELAYED';
  const isEarly = shipment.deliveryClassification === 'EARLY';

  // Checkpoint journey definition
  const checkpoints = [
    {
      title: 'ORDER PLACED',
      location: 'Central Order Desk',
      timestamp: `${shipment.orderDate} 08:30 UTC`,
      status: 'COMPLETED',
      notes: `Order registered via EDI. Scheduled SLA: ${shipment.daysForShipmentScheduled} days.`
    },
    {
      title: 'WAREHOUSE PROCESSING',
      location: shipment.originHub,
      timestamp: `${shipment.orderDate} 15:45 UTC`,
      status: 'COMPLETED',
      notes: 'Cargo packed, customs manifest barcoded, palletized.'
    },
    {
      title: 'ORIGIN PORT DISPATCH',
      location: shipment.originHub,
      timestamp: `${shipment.orderDate} 22:10 UTC`,
      status: 'COMPLETED',
      notes: 'Loaded on carrier container vessel. Verified gross mass compliant.'
    },
    {
      title: 'MARITIME / AIR TRANSIT',
      location: `${shipment.originHub} → ${shipment.destinationHub}`,
      timestamp: 'In Transit',
      status: isDelayed ? 'DELAYED' : 'COMPLETED',
      notes: isDelayed
        ? shipment.rootCause || 'Vessel traffic separation queue and berth bottleneck at destination.'
        : 'Transit proceeding smoothly along nominal trade corridor.'
    },
    {
      title: 'DESTINATION PORT / HUB',
      location: shipment.destinationHub,
      timestamp: 'Pending Discharge',
      status: isDelayed ? 'DELAYED' : 'IN_PROGRESS',
      notes: 'Berth allocation queue dwell active.'
    },
    {
      title: 'FINAL DELIVERY HANDOVER',
      location: `${shipment.customerCity}, ${shipment.customerCountry}`,
      timestamp: 'Estimated Delivery',
      status: isDelayed ? 'DELAYED' : 'SCHEDULED',
      notes: `Consignee: ${shipment.customerFname} (${shipment.customerSegment}).`
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1400px] mx-auto font-mono">
      <Breadcrumbs
        customItems={[
          { label: 'Shipment Explorer', to: '/shipments' },
          { label: `Shipment ${shipment.orderId}` }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-command-border/30 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/shipments')}
            className="p-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            title="Back to Explorer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                SINGLE SHIPMENT AUDIT TRAIL
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{shipment.carrier}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center space-x-3">
              <span>SHIPMENT {shipment.orderId}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                  isDelayed
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : isEarly
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {shipment.deliveryClassification}
              </span>
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              navigate('/simulator', {
                state: {
                  presetMode: shipment.shippingMode,
                  presetCongestion: 85,
                  presetCustoms: 4.5
                }
              });
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-hud-purple transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Reroute</span>
          </button>

          <button
            onClick={() => navigate('/customers-products')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>View Customer</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#0E1B38] hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View Route</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Telemetry Pods */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#070D1E]/95 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Scheduled Transit</span>
          <span className="text-2xl font-bold text-slate-200">{shipment.daysForShipmentScheduled} days</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Committed contract SLA</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/95 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Actual Transit</span>
          <span className={`text-2xl font-bold ${isDelayed ? 'text-rose-400' : 'text-emerald-400'}`}>
            {shipment.daysForShippingReal} days
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Recorded telemetric duration</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/95 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Delay Gap</span>
          <span className={`text-2xl font-bold ${isDelayed ? 'text-rose-400' : 'text-cyan-400'}`}>
            {shipment.delayGap > 0 ? `+${shipment.delayGap} days` : `${shipment.delayGap} days`}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Variance vs threshold</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/95 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Late Delivery Risk</span>
          <span className="text-2xl font-bold text-amber-400">{shipment.riskScore}%</span>
          <span className="text-[10px] text-amber-500/80 block mt-0.5">
            {shipment.riskScore > 60 ? 'HIGH RISK COHORT' : 'MODERATE RISK'}
          </span>
        </div>
      </div>

      {/* Shipment Journey Timeline */}
      <div className="bg-[#070D1E]/95 border border-cyan-500/25 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              SHIPMENT JOURNEY TIMELINE & CHECKPOINTS
            </h2>
          </div>
          <span className="text-xs text-slate-400">Chronological Milestones</span>
        </div>

        {/* Milestone Steps */}
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {checkpoints.map((cp, idx) => (
            <div key={idx} className="relative group">
              {/* Node Dot */}
              <div
                className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  cp.status === 'COMPLETED'
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : cp.status === 'DELAYED'
                    ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                    : 'bg-cyan-500 border-cyan-400 text-slate-950'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>

              {/* Milestone Details */}
              <div className="p-3.5 rounded-lg bg-[#0A132C] border border-slate-800 space-y-1 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-bold text-slate-100">{cp.title}</span>
                  <span className="text-[10px] text-slate-500">{cp.timestamp}</span>
                </div>
                <div className="text-[11px] text-cyan-400">{cp.location}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed pt-0.5">{cp.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostic: Why is this shipment delayed? */}
      {isDelayed && (
        <div className="bg-[#070D1E]/95 border border-rose-500/30 rounded-xl p-5 shadow-hud-red space-y-4">
          <div className="flex items-center space-x-2 border-b border-rose-500/20 pb-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wide">
              WHY IS THIS SHIPMENT DELAYED?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[#0A132C] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Primary Root Cause Detected
              </span>
              <p className="text-slate-200 text-sm font-semibold">
                {shipment.rootCause || 'Port congestion and berthing bottleneck at origin terminal'}
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Telemetry indicates container vessel experienced a 48h anchorage hold in Singapore/Shanghai waters due to high swell and berth saturation.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0A132C] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Secondary Contributor
              </span>
              <p className="text-slate-200 text-sm font-semibold">
                Customs Pre-Clearance Audit Review
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Automated declaration flagged for dual-use electronic module valuation check, adding +1.2 days to port dwell.
              </p>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>RECOMMENDED ACTION</span>
              </div>
              <p className="text-slate-300">
                Reroute through alternative feeder terminal or activate urgent Air expediting for remaining cargo segments.
              </p>
            </div>

            <button
              onClick={() => {
                navigate('/simulator', {
                  state: {
                    presetMode: 'Air',
                    presetCongestion: 30,
                    presetCustoms: 1.0
                  }
                });
              }}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5"
            >
              <span>Simulate Alternative Reroute</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Cargo & Client Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#070D1E]/95 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Cargo & Product Manifest</span>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Product Name:</span>
              <span className="text-slate-100 font-semibold">{shipment.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span>{shipment.categoryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Declared Value:</span>
              <span className="text-cyan-400 font-bold">${shipment.orderItemTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Quantity:</span>
              <span>{shipment.orderItemQuantity} units</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070D1E]/95 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Customer & Destination Profile</span>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Recipient Name:</span>
              <span className="text-slate-100 font-semibold">{shipment.customerFname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Segment:</span>
              <span>{shipment.customerSegment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">City / Country:</span>
              <span>{shipment.customerCity}, {shipment.customerCountry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer ID:</span>
              <span className="text-cyan-400">{shipment.orderCustomerId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
