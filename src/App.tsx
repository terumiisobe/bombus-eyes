import { useEffect, useState } from 'react';
import { mockColmeiasData, simulateApiDelay } from './mockData';
import { Colmeia, SpeciesInfo, HiveStatus } from './types';
import { Navigation } from "./components/Navigation";
import { Hexagon } from 'lucide-react';
import { Dashboard } from "./components/Dashboard";
import { SearchBar } from "./components/SearchBar";
import { Badge } from "./components/ui/badge";
import { HiveList } from "./components/HiveList";
import { OfflineStatus } from "./components/OfflineStatus";
import { Toaster } from "./components/ui/sonner";
import { toast } from 'sonner';
import { getApiUrl, isLocalEnvironment, STORAGE_KEYS } from './utils/constants';
import { filterHives, transformApiHives } from './utils/hiveUtils';
import './styles/globals.css';

function App() {
  const [hives, setHives] = useState<Colmeia[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [searchCode, setSearchCode] = useState<string>('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'listing'>('dashboard');
  
  const isLocalhost = isLocalEnvironment();
  const API_URL = getApiUrl();

  // Load data from localStorage on component mount (only for production)
  useEffect(() => {
    if (!isLocalhost) {
      const savedData = localStorage.getItem(STORAGE_KEYS.HIVES_DATA);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setHives(parsedData);
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
    }
  }, [isLocalhost]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (API_URL) {
          const response = await fetch(API_URL);
          if (response.ok) {
            const apiData = await response.json();
            // Transform API data from snake_case to camelCase
            const transformedData = transformApiHives(apiData);
            console.log('Transformed API data:', transformedData);
            setHives(transformedData);
            // Save to localStorage for offline persistence
            localStorage.setItem(STORAGE_KEYS.HIVES_DATA, JSON.stringify(transformedData));
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          // Use mock data for localhost
          await simulateApiDelay(1000); // Simulate 1 second delay
          setHives(mockColmeiasData);
          console.log('Using mock data for local development');
        }
      } catch (err) {
        console.error('Fetch failed:', err);
        // Don't clear hives on fetch error - keep cached data
        if (!isOnline) {
          console.log('Offline - using cached data');
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, API_URL]);

  const handleAddHive = (newHive: {
    code?: number;
    species: SpeciesInfo;
    status: HiveStatus;
  }) => {
    const hive: Colmeia = {
      ID: Date.now().toString(),
      Code: newHive.code,
      Species: {
        ID: newHive.species.ID,
        CommonName: newHive.species.CommonName,
        ScientificName: newHive.species.ScientificName
      },
      Status: newHive.status,
      StartingDate: new Date().toLocaleDateString('pt-BR'),
    };
    
    setHives(prev => [hive, ...prev]);
  };

  const handleQRScan = () => {
    toast.info("Funcionalidade de QR Code em desenvolvimento");
  };

  return (
    <div className="min-h-screen bg-background">
    
    {/* Header */}
    <div className="bg-amber-50 border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-center">
            <h1 className="flex items-center justify-center gap-3 text-lg">
              <Hexagon className="w-8 h-8 text-amber-700" />
              B O M B U S  |  Meliponário Isobe
            </h1>
            <p className="text-amber-700 mt-1 text-sm">
              Sistema de gerenciamento de colmeias
            </p>
            <div className="mt-2 flex justify-center gap-4">
              <OfflineStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? (
          <Dashboard hives={hives} onAddHive={handleAddHive} />
        ) : (
          <div className="space-y-6">
            {/* Search and Filters */}
            <SearchBar
              searchTerm={searchCode}
              onSearchChange={setSearchCode}
              onQRScan={handleQRScan}
            />

            {/* Results Summary */}
            {searchCode && (
              <div className="mb-4">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {filterHives(hives, searchCode).length} resultados para "{searchCode}"
                </Badge>
              </div>
            )}

            {/* Hive List */}
            <HiveList hives={hives} searchTerm={searchCode} />
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;
