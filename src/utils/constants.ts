import { HiveStatus } from '../types';

// Status display configuration
export const STATUS_CONFIG: Record<HiveStatus, { 
  color: string; 
  label: string; 
}> = {
  PRONTA_PARA_COLHEITA: {
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Pronta para Colheita'
  },
  INDUZIDA: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Induzida'
  },
  EM_DESENVOLVIMENTO: {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    label: 'Em Desenvolvimento'
  },
  PRONTO_PARA_MELGUEIRA: {
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Pronto para Melgueira'
  },
  GARRAFA_PET: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Garrafa Pet'
  },
  VAZIA: {
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'Vazia'
  },
  MOVIDA: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'Movida'
  },
  DESCONHECIDO: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'Desconhecido'
  }
};

// Environment configuration
export const getApiUrl = (): string | null => {
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';
  
  return isLocalhost ? null : 'https://bombus.onrender.com/colmeias';
};

export const isLocalEnvironment = (): boolean => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
};

// Storage keys
export const STORAGE_KEYS = {
  HIVES_DATA: 'bombus-data',
  REQUEST_QUEUE: 'bombus-request-queue'
} as const;

