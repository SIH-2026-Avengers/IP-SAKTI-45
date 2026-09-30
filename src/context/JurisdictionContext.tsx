import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { JurisdictionType } from '../types';

interface JurisdictionContextType {
  jurisdiction: JurisdictionType;
  setJurisdiction: (j: JurisdictionType) => void;
  toggleJurisdiction: () => void;
}

const JurisdictionContext = createContext<JurisdictionContextType | undefined>(undefined);

export const JurisdictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jurisdiction, setJurisdiction] = useState<JurisdictionType>('INDIA');

  const toggleJurisdiction = () => {
    setJurisdiction((prev) => (prev === 'INDIA' ? 'INTERNATIONAL' : 'INDIA'));
  };

  return (
    <JurisdictionContext.Provider value={{ jurisdiction, setJurisdiction, toggleJurisdiction }}>
      {children}
    </JurisdictionContext.Provider>
  );
};

export const useJurisdiction = (): JurisdictionContextType => {
  const context = useContext(JurisdictionContext);
  if (!context) {
    throw new Error('useJurisdiction must be used within a JurisdictionProvider');
  }
  return context;
};
