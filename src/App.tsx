import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { GlobalFilterBar } from './components/common/GlobalFilterBar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { TransitAIAssistant } from './components/common/TransitAIAssistant';
import { BootSequence } from './pages/BootSequence';
import { usePlatform } from './context/PlatformContext';

// Logistics Pages
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

// European Banking Churn Pages
import { BankingCommandCenter } from './pages/banking/BankingCommandCenter';
import { BankingGeography } from './pages/banking/BankingGeography';
import { BankingDemographics } from './pages/banking/BankingDemographics';
import { BankingFinancialExposure } from './pages/banking/BankingFinancialExposure';
import { BankingCustomers } from './pages/banking/BankingCustomers';
import { BankingSimulator } from './pages/banking/BankingSimulator';
import { BankingSubmissionHub } from './pages/banking/BankingSubmissionHub';

export const App: React.FC = () => {
  const [hasBooted, setHasBooted] = useState(true); // Fast load directly into dashboard
  const [searchOpen, setSearchOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { mode } = usePlatform();

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Initial Landing Boot-up Sequence (if triggered) */}
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

          {/* Collapsible Global Filter Bar (Logistics mode only) */}
          {mode === 'logistics' && showFilters && <GlobalFilterBar />}

          {/* Dynamic Page Router */}
          <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#040711]/60">
            <Routes>
              {/* Default Root Route: Loads Banking if banking mode, or CommandCenter if logistics */}
              <Route path="/" element={mode === 'banking' ? <BankingCommandCenter /> : <CommandCenter />} />

              {/* European Banking Churn & Segmentation Routes */}
              <Route path="/banking" element={<BankingCommandCenter />} />
              <Route path="/banking/geography" element={<BankingGeography />} />
              <Route path="/banking/demographics" element={<BankingDemographics />} />
              <Route path="/banking/financial-exposure" element={<BankingFinancialExposure />} />
              <Route path="/banking/customers" element={<BankingCustomers />} />
              <Route path="/banking/simulator" element={<BankingSimulator />} />
              <Route path="/banking/submission" element={<BankingSubmissionHub />} />

              {/* TRANSITIQ Logistics Routes */}
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
