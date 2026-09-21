import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TradeRoute, NetworkNode } from '../../types/logistics';
import { TRADE_ROUTES } from '../../data/routesData';
import { NETWORK_NODES } from '../../data/networkNodes';
import { Radio, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Ship, Anchor } from 'lucide-react';

interface OperationalMapProps {
  onSelectRoute: (route: TradeRoute) => void;
  selectedRouteId?: string;
}

// Realistic maritime waypoints that navigate real waterways (Malacca, Red Sea/Suez, Gibraltar, Great Circle)
const ROUTE_WAYPOINTS: Record<string, [number, number][]> = {
  'route-asia-eu-1': [
    [1.2903, 103.852], // Singapore
    [5.8, 95.0],       // North of Sumatra
    [10.0, 75.0],      // South of India
    [12.5, 52.0],      // Arabian Sea
    [12.5, 43.5],      // Bab-el-Mandeb
    [22.0, 38.0],      // Red Sea
    [29.9, 32.5],      // Suez Canal
    [34.5, 25.0],      // Mediterranean
    [36.5, -4.5],      // Strait of Gibraltar
    [48.5, -5.5],      // Bay of Biscay entrance
    [50.0, -1.0],      // English Channel
    [51.9244, 4.4777]  // Rotterdam
  ],
  'route-asia-eu-2': [
    [31.2304, 121.4737], // Shanghai
    [22.0, 118.0],       // Taiwan Strait
    [12.0, 111.0],       // South China Sea
    [1.3, 104.0],        // Malacca approach
    [5.8, 95.0],         // North of Sumatra
    [12.5, 52.0],        // Arabian Sea
    [12.5, 43.5],        // Bab-el-Mandeb
    [29.9, 32.5],        // Suez Canal
    [36.5, -4.5],        // Gibraltar
    [50.0, -1.0],        // English Channel
    [51.2194, 4.4025]    // Antwerp
  ],
  'route-eu-na-1': [
    [51.9244, 4.4777],   // Rotterdam
    [50.0, -1.0],        // English Channel
    [47.0, -20.0],       // Mid North Atlantic
    [42.0, -50.0],       // Grand Banks approach
    [40.7128, -74.0060]  // New York
  ],
  'route-asia-na-1': [
    [31.2304, 121.4737], // Shanghai
    [34.0, 138.0],       // South of Japan
    [42.0, 175.0],       // North Pacific Great Circle
    [44.0, -165.0],      // Mid Pacific
    [38.0, -135.0],      // Approaching California
    [33.7431, -118.2673] // Los Angeles
  ],
  'route-sa-eu-1': [
    [-23.9618, -46.3322],// Santos
    [-15.0, -35.0],      // Off Brazil coast
    [0.0, -28.0],        // Equator Atlantic
    [20.0, -22.0],       // Mid Atlantic
    [38.0, -12.0],       // Off Portugal
    [48.0, -5.0],        // Brittany
    [49.4944, 0.1079]    // Le Havre
  ],
  'route-na-asia-1': [
    [33.7701, -118.1937],// Long Beach
    [37.0, -140.0],      // Pacific West
    [41.0, -170.0],      // Mid Pacific
    [38.0, 160.0],       // Approaching Japan
    [35.4437, 139.6380]  // Yokohama
  ],
  'route-af-eu-1': [
    [5.6698, -0.0166],   // Tema, Ghana
    [10.0, -16.0],       // West Africa coast
    [22.0, -18.0],       // Off Mauritania
    [36.0, -10.0],       // Off Portugal
    [49.0, -4.0],        // English Channel
    [51.9244, 4.4777]    // Rotterdam
  ],
  'route-me-asia-1': [
    [24.9857, 55.0272],  // Dubai
    [23.0, 60.0],        // Gulf of Oman
    [12.0, 72.0],        // Arabian Sea
    [6.0, 85.0],         // South of Sri Lanka
    [3.0, 98.0],         // Malacca entrance
    [1.2903, 103.852]    // Singapore
  ]
};

export const OperationalMap: React.FC<OperationalMapProps> = ({
  onSelectRoute,
  selectedRouteId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesRef = useRef<Record<string, L.Polyline>>({});
  const markersRef = useRef<L.Marker[]>([]);

  const [activeLaneCount] = useState(TRADE_ROUTES.length);
  const [selectedRoute, setSelectedRoute] = useState<TradeRoute | null>(null);

  // Initialize Leaflet Map with 100% Free, Unrestricted Esri ArcGIS Dark Canvas (No API key, No watermark)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent re-initialization if already mounted
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Create Leaflet Map centered on global trade corridors
    const map = L.map(mapContainerRef.current, {
      center: [22.0, 18.0],
      zoom: 2.2,
      minZoom: 1.8,
      maxZoom: 9,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [
        [-85, -180],
        [85, 180]
      ],
      maxBoundsViscosity: 0.8
    });

    mapInstanceRef.current = map;

    // Official Esri ArcGIS World Dark Gray Base (No API key, pristine dark military/aerospace basemap)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Esri, HERE, Garmin, &copy; OpenStreetMap'
    }).addTo(map);

    // Official Esri ArcGIS Dark Gray Reference Labels Layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      opacity: 0.75
    }).addTo(map);

    // Draw realistic maritime trade routes with curves along navigable waters
    TRADE_ROUTES.forEach((route) => {
      const waypoints = ROUTE_WAYPOINTS[route.id] || [route.originCoords, route.destCoords];

      const isDelayed = route.status === 'DELAYED';
      const isAtRisk = route.status === 'AT_RISK';
      const strokeColor = isDelayed ? '#EF4444' : isAtRisk ? '#F59E0B' : '#10B981';

      // Outer glow line
      const glowPolyline = L.polyline(waypoints, {
        color: strokeColor,
        weight: 6,
        opacity: 0.22,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Main dashed corridor line
      const mainPolyline = L.polyline(waypoints, {
        color: strokeColor,
        weight: 2.8,
        opacity: 0.9,
        dashArray: isDelayed ? '6, 6' : isAtRisk ? '8, 6' : '10, 5',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      polylinesRef.current[route.id] = mainPolyline;

      // Click event
      mainPolyline.on('click', () => {
        onSelectRoute(route);
        setSelectedRoute(route);
      });

      glowPolyline.on('click', () => {
        onSelectRoute(route);
        setSelectedRoute(route);
      });

      // Hover Tooltip
      const tooltipContent = `
        <div style="padding: 8px 10px; font-family: monospace; font-size: 11px; background: #070D22; border: 1px solid rgba(6,182,212,0.4); border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #38BDF8;">${route.name}</strong>
            <span style="padding: 1px 5px; font-size: 9px; font-weight: bold; border-radius: 3px; background: ${
              isDelayed ? 'rgba(239,68,68,0.2)' : isAtRisk ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'
            }; color: ${strokeColor};">${route.status}</span>
          </div>
          <div style="color: #94A3B8; font-size: 10px;">Volume: <strong style="color: #F1F5F9;">${route.shipmentsCount}</strong> units</div>
          <div style="color: #94A3B8; font-size: 10px;">Avg Delay: <strong style="color: #F59E0B;">+${route.avgDelayDays}d</strong> | Risk: <strong style="color: ${strokeColor};">${route.riskScore}%</strong></div>
          <div style="color: #94A3B8; font-size: 10px; margin-top: 2px;">Issue: <span style="color: #E2E8F0;">${route.topIssue}</span></div>
          <div style="margin-top: 4px; font-size: 9px; color: #38BDF8;">Click to inspect & simulate reroute →</div>
        </div>
      `;

      mainPolyline.bindTooltip(tooltipContent, {
        sticky: true,
        className: 'transitiq-map-tooltip'
      });
    });

    // Plot major global ports with high-tech glowing radar beacons
    NETWORK_NODES.forEach((node) => {
      const isCritical = node.status === 'CRITICAL';
      const isCongested = node.status === 'CONGESTED';
      const color = isCritical ? '#EF4444' : isCongested ? '#F59E0B' : '#06B6D4';

      const customIcon = L.divIcon({
        className: 'custom-port-beacon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        html: `
          <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 14px; height: 14px; border-radius: 50%; border: 1px solid ${color}; opacity: 0.75; animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 10px ${color}; border: 1.5px solid #040714;"></div>
          </div>
        `
      });

      const marker = L.marker(node.coords, { icon: customIcon }).addTo(map);
      markersRef.current.push(marker);

      const nodeTooltip = `
        <div style="padding: 8px 10px; font-family: monospace; font-size: 11px; background: #070D22; border: 1px solid rgba(6,182,212,0.4); border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #38BDF8;">${node.name}</strong>
            <span style="font-size: 9px; color: ${color}; font-weight: bold;">${node.status}</span>
          </div>
          <div style="color: #94A3B8; font-size: 10px;">Country: <span style="color: #F1F5F9;">${node.country}</span> (${node.region})</div>
          <div style="color: #94A3B8; font-size: 10px;">Congestion Index: <strong style="color: #F59E0B;">${node.congestionScore}%</strong></div>
          <div style="color: #94A3B8; font-size: 10px;">Avg Terminal Dwell: <strong style="color: #F1F5F9;">${node.avgDwellDays}d</strong></div>
          <div style="color: #94A3B8; font-size: 10px;">Throughput: <span style="color: #38BDF8;">${node.throughputTeu.toLocaleString()} TEU</span></div>
        </div>
      `;

      marker.bindTooltip(nodeTooltip, {
        direction: 'top',
        className: 'transitiq-map-tooltip'
      });
    });

    // Cleanup on component unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onSelectRoute]);

  // Handle selected route styling updates
  useEffect(() => {
    if (!selectedRouteId) return;
    Object.entries(polylinesRef.current).forEach(([routeId, polyline]) => {
      if (routeId === selectedRouteId) {
        polyline.setStyle({ weight: 4.5, opacity: 1 });
      } else {
        polyline.setStyle({ weight: 2.2, opacity: 0.7 });
      }
    });
  }, [selectedRouteId]);

  // Zoom helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.setView([22.0, 18.0], 2.2);
  };

  return (
    <div className="relative w-full h-[540px] bg-[#040714] border border-cyan-500/25 rounded-xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* HUD Header overlay */}
      <div className="absolute top-3 left-4 z-20 flex items-center space-x-3 pointer-events-none">
        <div className="px-2.5 py-1 rounded bg-[#070D1E]/95 border border-cyan-500/40 backdrop-blur-md flex items-center space-x-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-slate-100 tracking-wider">
            REALISTIC GLOBAL TRADE CORRIDORS
          </span>
          <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30">
            {activeLaneCount} LANES ACTIVE
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-3 px-3 py-1 rounded bg-[#070D1E]/90 border border-slate-700/50 text-[11px] font-mono text-slate-300 backdrop-blur-md">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Normal</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>At Risk</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Delayed</span>
          </span>
        </div>
      </div>

      {/* Floating Map Zoom & Reset Controls */}
      <div className="absolute top-3 right-4 z-20 flex items-center space-x-1 bg-[#070D1E]/95 border border-slate-700/60 rounded-lg p-1 backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-slate-800 text-slate-300 rounded hover:text-cyan-400 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-slate-800 text-slate-300 rounded hover:text-cyan-400 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-1.5 hover:bg-slate-800 text-slate-300 rounded hover:text-cyan-400 transition-colors"
          title="Reset Global View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Actual Realistic Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-full z-10"
        style={{ background: '#040714' }}
      />
    </div>
  );
};
