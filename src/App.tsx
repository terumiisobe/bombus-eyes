// import logo from './logo.svg'; // Unused import
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
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
import { apiService } from "./services/apiService";
import './styles/globals.css';
import {
  developmentModeStyle,
  offlineWarningStyle,
  
} from './styles';
import { toast } from 'sonner';

function App() {
  const [hives, setHives] = useState<Colmeia[]>([]);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [searchCode, setSearchCode] = useState<string>('');
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
            const newData = await response.json();
            setHives(newData);
            // Save to localStorage for offline persistence
            localStorage.setItem('bombus-data', JSON.stringify(newData));
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
        // If we're offline and have cached data, keep showing it
        if (!isOnline && hives.length > 0) {
          console.log('Offline - using cached data');
        } else if (hives.length === 0) {
          // No cached data and offline, show error
          setHives([]);
        }
      } finally {
      }
    };

    fetchData();
  }, [isOnline, API_URL, hives]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="flex items-center justify-center gap-3">
              <Hexagon className="w-8 h-8 text-amber-700" />
              B O M B U S  |  Meliponário Isobe
            </h1>
            <p className="text-amber-700 mt-1">
              Sistema de gerenciamento de colmeias
            </p>
            <div className="mt-3 flex justify-center gap-4">
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

      {isLocalhost && (
        <div style={developmentModeStyle}>
          🧪 Modo de Desenvolvimento
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
                      (hive.Code && hive.Code.toString().includes(searchLower)) ||
                      hive.Species.CommonName.toLowerCase().includes(searchLower) ||
                      hive.Species.ScientificName.toLowerCase().includes(searchLower) ||
                      hive.Status.toLowerCase().includes(searchLower)
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
      <Toaster />
    </div>
  );
}

export default App;
