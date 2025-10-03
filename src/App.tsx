// import logo from './logo.svg'; // Unused import
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { mockColmeiasData, simulateApiDelay } from './mockData';
import { Colmeia, SpeciesInfo, ViewType } from './types';
import { Navigation } from "./components/Navigation";
import { Hexagon } from 'lucide-react';
import { Dashboard } from "./components/Dashboard";
import { SearchBar } from "./components/SearchBar";
import { Badge } from "./components/ui/badge";
import { HiveList } from "./components/HiveList";
import './styles/globals.css';
import {
  containerStyle,
  headingStyle,
  developmentModeStyle,
  offlineWarningStyle,
  
} from './styles';
import { toast } from 'sonner';

function App() {
  const [data, setData] = useState<Colmeia[] | null>(null);
  const [hives, setHives] = useState<Colmeia[]>(mockColmeiasData);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchCode, setSearchCode] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Colmeia[] | null>(null);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [qrScanner, setQrScanner] = useState<Html5QrcodeScanner | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'listing'>('dashboard');

  // const qrScannerRef = useRef<HTMLDivElement>(null); // Unused ref

  
  // Determine if we're running locally
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';
  
  const API_URL = isLocalhost ? null : 'https://bombus.onrender.com/colmeias';

  // Load data from localStorage on component mount (only for production)
  useEffect(() => {
    if (!isLocalhost) {
      const savedData = localStorage.getItem('bombus-data');
      if (savedData) {
        try {
          setData(JSON.parse(savedData));
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

  // Filter data when search code changes
  useEffect(() => {
    if (data && searchCode) {
      const filtered = Array.isArray(data) 
        ? data.filter(item => item.colmeia_id && item.colmeia_id.toString() === searchCode)
        : [];
      setFilteredData(filtered);
    } else {
      setFilteredData(null);
    }
  }, [data, searchCode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (API_URL) {
          const response = await fetch(API_URL);
          if (response.ok) {
            const newData = await response.json();
            setData(newData);
            // Save to localStorage for offline persistence
            localStorage.setItem('bombus-data', JSON.stringify(newData));
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          // Use mock data for localhost
          await simulateApiDelay(1000); // Simulate 1 second delay
          setData(mockColmeiasData);
          console.log('Using mock data for local development');
        }
      } catch (err) {
        console.error('Fetch failed:', err);
        // If we're offline and have cached data, keep showing it
        if (!isOnline && data) {
          console.log('Offline - using cached data');
        } else if (!data) {
          // No cached data and offline, show error
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOnline, API_URL, data]);

  // // Initialize QR Scanner
  // useEffect(() => {
  //   if (showQRScanner && !qrScanner) {
  //     const scanner = new Html5QrcodeScanner(
  //       "qr-reader",
  //       { 
  //         fps: 10, 
  //         qrbox: { width: 250, height: 250 },
  //         aspectRatio: 1.0
  //       },
  //       false
  //     );

  //     scanner.render((decodedText) => {
  //       // QR code scanned successfully
  //       setSearchCode(decodedText);
  //       setShowQRScanner(false);
  //       scanner.clear();
  //       setQrScanner(null);
  //     }, (error) => {
  //       // QR code scan error (ignore)
  //     });

  //     setQrScanner(scanner);
  //   }

  //   return () => {
  //     if (qrScanner) {
  //       qrScanner.clear();
  //       setQrScanner(null);
  //     }
  //   };
  // }, [showQRScanner, qrScanner]);

  // const handleSearch = (): void => {
  //   // Search is handled automatically by the useEffect above
  // };

  const handleAddHive = (newHive: {
    code?: string;
    species: SpeciesInfo;
    status: 'EM_DESENVOLVIMENTO' | 'VAZIA' | 'PRONTA_PARA_COLHEITA';
  }) => {
    const hive: Colmeia = {
      colmeia_id: Date.now().toString(),
      code: newHive.code,
      species: {
        id: newHive.species.id,
        commonName: newHive.species.commonName,
        scientificName: newHive.species.scientificName
      },
      status: newHive.status,
      starting_date: new Date().toLocaleDateString('pt-BR'),
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="flex items-center justify-center gap-3">
              <Hexagon className="w-8 h-8 text-amber-700" />
              Meliponário Isobe
            </h1>
            <p className="text-amber-700 mt-1">
              Sistema de gerenciamento de colmeias
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {isLocalhost && (
        <div style={developmentModeStyle}>
          🧪 Modo de Desenvolvimento
        </div>
      )}
      
      {!isOnline && (
        <div style={offlineWarningStyle}>
          ⚠️ Você está offline no momento.
        </div>
      )}

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
                  {hives.filter(hive => {
                    const searchLower = searchCode.toLowerCase();
                    return (
                      (hive.code && hive.code.toLowerCase().includes(searchLower)) ||
                      hive.species.commonName.toLowerCase().includes(searchLower) ||
                      hive.species.scientificName.toLowerCase().includes(searchLower) ||
                      hive.status.toLowerCase().includes(searchLower)
                    );
                  }).length} resultados para "{searchCode}"
                </Badge>
              </div>
            )}

            {/* Hive List */}
            <HiveList hives={hives} searchTerm={searchCode} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
