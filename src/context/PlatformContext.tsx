import React, { createContext, useContext, useState } from 'react';

export type PlatformMode = 'logistics';

interface PlatformContextType {
  mode: PlatformMode;
  setMode: (mode: PlatformMode) => void;
  toggleMode: () => void;
}

const PlatformContext = createContext<PlatformContextType>({
  mode: 'logistics',
  setMode: () => {},
  toggleMode: () => {}
});

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode] = useState<PlatformMode>('logistics');

  return (
    <PlatformContext.Provider
      value={{
        mode,
        setMode: () => {},
        toggleMode: () => {}
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);
