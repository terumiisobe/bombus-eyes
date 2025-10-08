// Type definitions for the application

export interface Colmeia {
  ID: string;
  Code?: number;
  Species: SpeciesInfo;
  StartingDate: string;
  Status: string;
}

export interface SpeciesInfo {
  ID: number;
  CommonName: string;
  ScientificName: string;
}

export type ViewType = 'dashboard' | 'listing';

// Extract status values from STATUS_LIST
export type HiveStatus = typeof STATUS_LIST[number]['value'];

// API Service types
export interface QueuedRequest {
  id: string;
  type: 'CREATE_HIVE' | 'UPDATE_HIVE' | 'DELETE_HIVE';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

// Species data
export interface Species {
  id: number;
  scientificName: string;
  commonName: string;
}

// Status data
export interface Status {
  value: string;
  label: string;
}

//TODO: get list from backend API
export const SPECIES_LIST: Species[] = [
  {
    id: 1,
    scientificName: 'Tetragosnisca angustula',
    commonName: 'Jataí',
  },
  {
    id: 2,
    scientificName: 'Plebeia emerina',
    commonName: 'Mirim emerina',
  },
  {
    id: 3,
    scientificName: 'Plebeia gigantea',
    commonName: 'Mirim',
  },
  {
    id: 4,
    scientificName: 'Melipona quadrifasciata',
    commonName: 'Mandaçaia',
  },
  {
    id: 5,
    scientificName: 'Melipona bicolor',
    commonName: 'Guaraipo',
  },
  {
    id: 6,
    scientificName: 'Melipona marginata',
    commonName: 'Manduri',
  },
  {
    id: 7,
    scientificName: 'Melipona torrida',
    commonName: 'Manduri',
  },
  {
    id: 8,
    scientificName: 'Scaptotrigona bipunctata',
    commonName: 'Tubuna',
  },
  {
    id: 9,
    scientificName: 'Scaptotrigona depilis',
    commonName: 'Canudo',
  },
  {
    id: 10,
    scientificName: 'Plebeia droryana',
    commonName: 'Mirim mosquito',
  }
];

//TODO: get list from backend API
export const STATUS_LIST: Status[] = [
  {
    value: 'PRONTA_PARA_COLHEITA',
    label: 'Pronta para Colheita'
  },
  {
    value: 'INDUZIDA',
    label: 'Induzida'
  },
  {
    value: 'EM_DESENVOLVIMENTO',
    label: 'Em Desenvolvimento'
  },
  {
    value: 'PRONTO_PARA_MELGUEIRA',
    label: 'Pronto para Melgueira'
  },
  {
    value: 'GARRAFA_PET',
    label: 'Garrafa Pet'
  },
  {
    value: 'VAZIA',
    label: 'Vazia'
  },
  {
    value: 'MOVIDA',
    label: 'Movida'
  },
  {
    value: 'DESCONHECIDO',
    label: 'Desconhecido'
  }
];