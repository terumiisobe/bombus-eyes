// Type definitions for the application

export interface Colmeia {
  colmeia_id: string;
  species: string;
  starting_date: string;
  status: string;
}

export interface SpeciesInfo {
  commonName: string;
  scientificName: string | null;
}

export type ViewType = 'dashboard' | 'listing';

export interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export interface AppState {
  data: Colmeia[] | null;
  isOnline: boolean;
  loading: boolean;
  searchCode: string;
  filteredData: Colmeia[] | null;
  showQRScanner: boolean;
  qrScanner: any; // Html5QrcodeScanner type
  currentView: ViewType;
}

export interface ApiResponse {
  data?: Colmeia[];
  error?: string;
}

