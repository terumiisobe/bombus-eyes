import { Colmeia } from '../types';

/**
 * Transform API response from snake_case to camelCase
 */
export const transformApiHive = (apiHive: any): Colmeia | null => {
  try {
    // Handle missing or invalid data
    if (!apiHive || !apiHive.species) {
      console.warn('Invalid API hive data:', apiHive);
      return null;
    }

    const transformed: Colmeia = {
      ID: apiHive.id || apiHive.ID,
      Code: apiHive.code || apiHive.Code,
      Species: {
        ID: apiHive.species.id || apiHive.species.ID,
        CommonName: apiHive.species.common_name || apiHive.species.CommonName,
        ScientificName: apiHive.species.scientific_name || apiHive.species.ScientificName
      },
      StartingDate: apiHive.starting_date || apiHive.StartingDate,
      Status: apiHive.status || apiHive.Status
    };

    // Handle meliponary attribute
    if (apiHive.meliponary) {
      transformed.Meliponary = {
        id: apiHive.meliponary.id || apiHive.meliponary_id
      };
    } else if (apiHive.meliponary_id) {
      transformed.Meliponary = {
        id: apiHive.meliponary_id
      };
    }

    return transformed;
  } catch (error) {
    console.error('Error transforming API hive data:', error, apiHive);
    return null;
  }
};

/**
 * Transform array of API hives
 */
export const transformApiHives = (apiHives: any[]): Colmeia[] => {
  if (!Array.isArray(apiHives)) {
    console.warn('Invalid API hives data - not an array:', apiHives);
    return [];
  }

  return apiHives
    .map(transformApiHive)
    .filter((hive): hive is Colmeia => hive !== null);
};

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

