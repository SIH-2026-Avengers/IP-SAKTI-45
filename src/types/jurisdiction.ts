export type JurisdictionType = 'INDIA' | 'INTERNATIONAL';

export interface JurisdictionContextState {
  jurisdiction: JurisdictionType;
  setJurisdiction: (j: JurisdictionType) => void;
  targetExportMarkets?: string[];
}
