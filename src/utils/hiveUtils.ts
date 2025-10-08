import { Colmeia } from '../types';

/**
 * Filters hives based on a search term
 * Searches in: Code, Species CommonName, Species ScientificName, and Status
 */
export const filterHives = (hives: Colmeia[], searchTerm: string): Colmeia[] => {
  if (!searchTerm) return hives;
  
  const searchLower = searchTerm.toLowerCase();
  return hives.filter(hive => 
    (hive.Code && hive.Code.toString().includes(searchLower)) ||
    hive.Species.CommonName.toLowerCase().includes(searchLower) ||
    hive.Species.ScientificName.toLowerCase().includes(searchLower) ||
    hive.Status.toLowerCase().includes(searchLower)
  );
};

/**
 * Counts hives by status
 */
export const countHivesByStatus = (hives: Colmeia[], status: string): number => {
  return hives.filter(h => h.Status === status).length;
};

