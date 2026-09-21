import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type PlatformMode = 'banking' | 'logistics';

interface PlatformContextType {
  mode: PlatformMode;
  setMode: (mode: PlatformMode) => void;
  toggleMode: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize mode: prioritize localStorage, then URL
  const [mode, setModeState] = useState<PlatformMode>(() => {
    const saved = localStorage.getItem('transitiq_active_platform') as PlatformMode;
    if (saved === 'banking' || saved === 'logistics') return saved;
    return location.pathname.startsWith('/banking') ? 'banking' : 'banking'; // Default to banking per user request!
  });

  useEffect(() => {
    if (location.pathname.startsWith('/banking')) {
      setModeState('banking');
      localStorage.setItem('transitiq_active_platform', 'banking');
    } else if (
      location.pathname.startsWith('/network') ||
      location.pathname.startsWith('/performance') ||
      location.pathname.startsWith('/delay-intelligence') ||
      location.pathname.startsWith('/shipping-modes') ||
      location.pathname.startsWith('/regions') ||
      location.pathname.startsWith('/shipments') ||
      location.pathname.startsWith('/customers-products') ||
      location.pathname.startsWith('/simulator') ||
      location.pathname.startsWith('/actions') ||
      location.pathname.startsWith('/reports') ||
      location.pathname === '/command-center'
    ) {
      setModeState('logistics');
      localStorage.setItem('transitiq_active_platform', 'logistics');
    }
  }, [location.pathname]);

  const setMode = (newMode: PlatformMode) => {
    setModeState(newMode);
    localStorage.setItem('transitiq_active_platform', newMode);
    if (newMode === 'banking') {
      navigate('/banking');
    } else {
      navigate('/command-center');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'banking' ? 'logistics' : 'banking');
  };

  return (
    <PlatformContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
