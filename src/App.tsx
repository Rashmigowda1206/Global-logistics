import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { GlobalFilterBar } from './components/common/GlobalFilterBar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { TransitAIAssistant } from './components/common/TransitAIAssistant';
import { BootSequence } from './pages/BootSequence';

// Logistics Control Tower Pages
import { CommandCenter } from './pages/CommandCenter';
import { LiveNetwork } from './pages/LiveNetwork';
import { DeliveryPerformance } from './pages/DeliveryPerformance';
import { DelayIntelligence } from './pages/DelayIntelligence';
import { ShippingModes } from './pages/ShippingModes';
import { RegionalOperations } from './pages/RegionalOperations';
import { ShipmentExplorer } from './pages/ShipmentExplorer';
import { ShipmentDetail } from './pages/ShipmentDetail';
import { CustomerProductIntelligence } from './pages/CustomerProductIntelligence';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { ActionCenter } from './pages/ActionCenter';
import { ReportCenter } from './pages/ReportCenter';

export const App: React.FC = () => {
  const [hasBooted, setHasBooted] = useState(true); // Direct load into command dashboard
  const [searchOpen, setSearchOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Optional Boot Sequence */}
      {!hasBooted && (
        <BootSequence onComplete={() => setHasBooted(true)} />
      )}

      {/* Main Operational Dashboard Frame */}
      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Persistent Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-radial-vignette overflow-hidden">
          {/* Header HUD */}
          <HeaderHUD
            onOpenSearch={() => setSearchOpen(true)}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          {/* Collapsible Global Filter Bar */}
          {showFilters && <GlobalFilterBar />}

          {/* Dynamic Page Router */}
          <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#040711]/60">
            <Routes>
              {/* Default Root: Loads Command Center */}
              <Route path="/" element={<CommandCenter />} />

              {/* TRANSITIQ Global Logistics Control Tower Routes */}
              <Route path="/command-center" element={<CommandCenter />} />
              <Route path="/network" element={<LiveNetwork />} />
              <Route path="/performance" element={<DeliveryPerformance />} />
              <Route path="/delay-intelligence" element={<DelayIntelligence />} />
              <Route path="/shipping-modes" element={<ShippingModes />} />
              <Route path="/regions" element={<RegionalOperations />} />
              <Route path="/regions/:regionId" element={<RegionalOperations />} />
              <Route path="/regions/:regionId/:countryId" element={<RegionalOperations />} />
              <Route path="/shipments" element={<ShipmentExplorer />} />
              <Route path="/shipments/:id" element={<ShipmentDetail />} />
              <Route path="/customers-products" element={<CustomerProductIntelligence />} />
              <Route path="/simulator" element={<WhatIfSimulator />} />
              <Route path="/actions" element={<ActionCenter />} />
              <Route path="/reports" element={<ReportCenter />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Global Modals & Overlays */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <TransitAIAssistant />
    </div>
  );
};
