import type { EvidenceSource, JurisdictionType } from '../types';

export async function fetchEvidenceSources(
  _query?: string,
  _jurisdiction?: JurisdictionType
): Promise<EvidenceSource[]> {
  return [];
}

export async function getEvidenceSourceById(_id: string): Promise<EvidenceSource | null> {
  return null;
}
