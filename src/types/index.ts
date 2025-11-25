// Type definitions for the application

/**
 * Enum values for Activity Actions
 * These represent the types of activities that can be performed on a hive
 */
export enum ActivityAction {
  /** Feeding activity - providing food/supplements to the hive */
  ALIMENTACAO = 'ALIMENTACAO',
  /** Inspection activity - checking hive health, population, and conditions */
  INSPECAO = 'INSPECAO',
  /** Harvest activity - collecting honey from the hive */
  COLHEITA = 'COLHEITA',
  /** Multiplication activity - creating new hives from existing ones */
  MULTIPLICACAO = 'MULTIPLICACAO',
  /** Addition activity - adding resources or components to the hive */
  ADICAO = 'ADICAO',
  /** Treatment activity - applying treatments for diseases or pests */
  TRATAMENTO = 'TRATAMENTO',
  /** Relocation activity - moving the hive to a new location */
  RELOCACAO = 'RELOCACAO',
  /** Maintenance activity - general upkeep and repairs */
  MANUTENCAO = 'MANUTENCAO',
  /** Monitoring activity - observing and recording hive metrics */
  MONITORAMENTO = 'MONITORAMENTO',
  /** Cleaning activity - cleaning hive components and surroundings */
  LIMPEZA = 'LIMPEZA',
}

/**
 * Enum values for Activity Motives
 * These represent the reasons why an activity needs to be performed
 */
export enum ActivityMotive {
  /** Recent multiplication - hive was recently multiplied/created */
  MULTIPLICACAO = 'MULTIPLICACAO',
  /** Low activity - hive showing reduced activity levels */
  BAIXA_ATIVIDADE = 'BAIXA_ATIVIDADE',
  /** Lemon bee attack - hive under attack from aggressive lemon bees */
  ATAQUE_ABELHA_LIMAO = 'ATAQUE_ABELHA_LIMAO',
  /** Disease detected - hive showing signs of disease */
  DOENCA_DETECTADA = 'DOENCA_DETECTADA',
  /** Pest infestation - presence of harmful pests */
  PRAGA_INFESTACAO = 'PRAGA_INFESTACAO',
  /** Weather conditions - extreme weather requiring intervention */
  CONDICOES_CLIMATICAS = 'CONDICOES_CLIMATICAS',
  /** Food shortage - insufficient food resources */
  ESCASSEZ_ALIMENTO = 'ESCASSEZ_ALIMENTO',
  /** Population growth - rapid population increase requiring attention */
  CRESCIMENTO_POPULACAO = 'CRESCIMENTO_POPULACAO',
  /** Queen issues - problems with the queen bee */
  PROBLEMAS_RAINHA = 'PROBLEMAS_RAINHA',
  /** Routine check - regular scheduled maintenance */
  VERIFICACAO_ROTINA = 'VERIFICACAO_ROTINA',
  /** Emergency situation - urgent intervention required */
  EMERGENCIA = 'EMERGENCIA',
  /** Seasonal preparation - preparing for seasonal changes */
  PREPARACAO_SAZONAL = 'PREPARACAO_SAZONAL',
}

/**
 * Enum values for Hive Status
 * These represent the current state/condition of a hive
 */
export enum HiveStatusEnum {
  /** Ready for harvest - hive has sufficient honey for collection */
  PRONTA_PARA_COLHEITA = 'PRONTA_PARA_COLHEITA',
  /** Ready for super - hive ready for additional honey super */
  PRONTO_PARA_MELGUEIRA = 'PRONTO_PARA_MELGUEIRA',
  /** In development - hive is growing and developing */
  EM_DESENVOLVIMENTO = 'EM_DESENVOLVIMENTO',
  /** Induced - hive created through artificial induction */
  INDUZIDA = 'INDUZIDA',
  /** Pet bottle - hive housed in a PET bottle container */
  GARRAFA_PET = 'GARRAFA_PET',
  /** Empty - hive is currently empty */
  VAZIA = 'VAZIA',
  /** Moved - hive has been relocated */
  MOVIDA = 'MOVIDA',
  /** Unknown - status is not determined */
  DESCONHECIDO = 'DESCONHECIDO',
  /** Healthy - hive is in good health */
  SAUDAVEL = 'SAUDAVEL',
  /** Weak - hive showing signs of weakness */
  FRACA = 'FRACA',
  /** Strong - hive is thriving and strong */
  FORTE = 'FORTE',
  /** Swarming - hive is preparing to swarm */
  ENXAMEANDO = 'ENXAMEANDO',
  /** Queenless - hive has lost its queen */
  SEM_RAINHA = 'SEM_RAINHA',
  /** Under treatment - hive is receiving medical treatment */
  EM_TRATAMENTO = 'EM_TRATAMENTO',
  /** Quarantined - hive isolated due to health concerns */
  EM_QUARENTENA = 'EM_QUARENTENA',
}

/**
 * Enum values for View Types
 * These represent different views/pages in the application
 */
export enum ViewTypeEnum {
  /** Dashboard view - main overview with statistics */
  DASHBOARD = 'dashboard',
  /** Listing view - list of all hives */
  LISTING = 'listing',
  /** Profile view - user profile and settings */
  PROFILE = 'profile',
  /** Operations view - hive operations and activities */
  OPERATIONS = 'operations',
  /** Statistics view - detailed statistics and analytics */
  STATISTICS = 'statistics',
  /** Reports view - generated reports */
  REPORTS = 'reports',
}

/**
 * Enum values for Request Types
 * These represent types of API requests that can be queued
 */
export enum RequestTypeEnum {
  /** Create hive request - adding a new hive */
  CREATE_HIVE = 'CREATE_HIVE',
  /** Update hive request - modifying existing hive data */
  UPDATE_HIVE = 'UPDATE_HIVE',
  /** Delete hive request - removing a hive */
  DELETE_HIVE = 'DELETE_HIVE',
  /** Create activity request - recording a new activity */
  CREATE_ACTIVITY = 'CREATE_ACTIVITY',
  /** Update activity request - modifying activity data */
  UPDATE_ACTIVITY = 'UPDATE_ACTIVITY',
  /** Delete activity request - removing an activity */
  DELETE_ACTIVITY = 'DELETE_ACTIVITY',
}

/**
 * Enum values for Resource Types
 * These represent types of resources used in hive operations
 */
export enum ResourceTypeEnum {
  /** Brood - developing bee larvae and pupae */
  BROOD = 'BROOD',
  /** Honey - stored honey */
  HONEY = 'HONEY',
  /** Pollen - collected pollen */
  POLLEN = 'POLLEN',
  /** Wax - beeswax comb */
  WAX = 'WAX',
  /** Propolis - bee glue/resin */
  PROPOLIS = 'PROPOLIS',
  /** Workers - worker bees */
  WORKERS = 'WORKERS',
  /** Drones - male bees */
  DRONES = 'DRONES',
  /** Queen - queen bee */
  QUEEN = 'QUEEN',
}

/**
 * Enum values for Operation Methods
 * These represent methods used in multiplication operations
 */
export enum OperationMethodEnum {
  /** Division method - splitting a hive into two */
  DIVISAO = 'DIVISAO',
  /** Swarm capture - capturing a natural swarm */
  CAPTURA_ENXAME = 'CAPTURA_ENXAME',
  /** Artificial swarm - creating swarm artificially */
  ENXAME_ARTIFICIAL = 'ENXAME_ARTIFICIAL',
  /** Nucleus creation - creating a small nucleus hive */
  NUCLEO = 'NUCLEO',
  /** Grafting - transferring queen cells */
  ENXERTIA = 'ENXERTIA',
}

export interface Colmeia {
  ID: string;
  Code?: number;
  Species: SpeciesInfo;
  StartingDate: string;
  Status: string;
  Meliponary?: { id: number };
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

// Focused Activity data
export interface FocusedActivity {
  colmeia: Colmeia;
  action: 'ALIMENTACAO' | 'INSPECAO';
  motive: 'MULTIPLICACAO' | 'BAIXA_ATIVIDADE' | 'ATAQUE_ABELHA_LIMAO';
  date?: string;
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