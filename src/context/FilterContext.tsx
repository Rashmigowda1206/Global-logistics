import React, { createContext, useContext, useState, useMemo } from 'react';
import { ShipmentRecord, GlobalFilterState } from '../types/logistics';
import { MOCK_SHIPMENTS } from '../data/mockLogisticsData';
import { filterShipments, calculateKPIs } from '../services/logisticsService';

interface FilterContextType {
  filters: GlobalFilterState;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilterState>>;
  updateFilter: (key: keyof GlobalFilterState, value: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  shipments: ShipmentRecord[];
  allShipments: ShipmentRecord[];
  kpis: ReturnType<typeof calculateKPIs>;
}

const initialFilters: GlobalFilterState = {
  dateRange: 'Last 30 Days',
  shippingMode: 'All',
  market: 'All',
  orderRegion: 'All',
  deliveryStatus: 'All',
  riskLevel: 'All',
  customerSegment: 'All',
  searchQuery: '',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalFilterState>(initialFilters);
  const [allShipments] = useState<ShipmentRecord[]>(MOCK_SHIPMENTS);

  const updateFilter = (key: keyof GlobalFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.shippingMode !== 'All') count++;
    if (filters.market !== 'All') count++;
    if (filters.orderRegion !== 'All') count++;
    if (filters.deliveryStatus !== 'All') count++;
    if (filters.riskLevel !== 'All') count++;
    if (filters.customerSegment !== 'All') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  const shipments = useMemo(() => {
    return filterShipments(allShipments, filters);
  }, [allShipments, filters]);

  const kpis = useMemo(() => {
    return calculateKPIs(shipments);
  }, [shipments]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
        activeFilterCount,
        shipments,
        allShipments,
        kpis,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useLogisticsFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useLogisticsFilter must be used within a FilterProvider');
  }
  return context;
};
