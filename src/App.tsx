// import logo from './logo.svg'; // Unused import
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { mockColmeiasData, simulateApiDelay } from './mockData';
import { Colmeia, SpeciesInfo, ViewType } from './types';
import { Hexagon } from 'lucide-react';
import './styles/globals.css';
import {
  containerStyle,
  headingStyle,
  developmentModeStyle,
  offlineWarningStyle,
  searchContainerStyle,
  inputStyle,
  cameraButtonStyle,
  qrContainerStyle,
  qrInstructionsStyle,
  loadingStyle,
  resultContainerStyle,
  resultBoxStyle,
  resultItemStyle,
  resultLabelStyle,
  resultValueStyle,
  noResultsStyle
} from './styles';

function App() {
  const [data, setData] = useState<Colmeia[] | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchCode, setSearchCode] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Colmeia[] | null>(null);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [qrScanner, setQrScanner] = useState<Html5QrcodeScanner | null>(null);
  // const qrScannerRef = useRef<HTMLDivElement>(null); // Unused ref

  
  // Determine if we're running locally
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';
  
  const API_URL = isLocalhost ? null : 'https://bombus.onrender.com/colmeias';

  // Species mapping function
  const getSpeciesDisplayName = (scientificName: string): SpeciesInfo => {
    const speciesMap: Record<string, string> = {
      'Melipona Quadrifasciata': 'Mandaçaia',
      'Plebeia Gigantea': 'Mirim-guaçu',
      'Melipona Bicolor': 'Guaraipo',
      'Scaptotrigona Bipunctata': 'Tubuna',
      'Tetragosnisca Angustula': 'Jataí',
      'Scaptotrigona Depilis': 'Canudo',
      'Plebeia Emerina': 'Mirim-emerina',
      'Melipona Marginata': 'Manduri'
    };
    
    const commonName = speciesMap[scientificName];
    if (commonName) {
      return { commonName, scientificName };
    }
    return { commonName: scientificName || 'N/A', scientificName: null };
  };

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

  // Initialize QR Scanner
  useEffect(() => {
    if (showQRScanner && !qrScanner) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scanner.render((decodedText) => {
        // QR code scanned successfully
        setSearchCode(decodedText);
        setShowQRScanner(false);
        scanner.clear();
        setQrScanner(null);
      }, (error) => {
        // QR code scan error (ignore)
      });

      setQrScanner(scanner);
    }

    return () => {
      if (qrScanner) {
        qrScanner.clear();
        setQrScanner(null);
      }
    };
  }, [showQRScanner, qrScanner]);

  // const handleSearch = (): void => {
  //   // Search is handled automatically by the useEffect above
  // };

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


      {isLocalhost && (
        <div style={developmentModeStyle}>
          🧪 Modo de Desenvolvimento - Usando dados mock
        </div>
      )}
      
      {!isOnline && (
        <div style={offlineWarningStyle}>
          ⚠️ Você está offline no momento.
        </div>
      )}

      {/* Search input and button - always visible at top */}
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Digitar código da colmeia"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={() => setShowQRScanner(!showQRScanner)}
          style={cameraButtonStyle}
          title="Escanear QR Code"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* QR Scanner Container */}
      {showQRScanner && (
        <div style={qrContainerStyle}>
          <div id="qr-reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
          <p style={qrInstructionsStyle}>
            Posicione o QR code dentro da área de leitura
          </p>
        </div>
      )}

      {loading && (
        <div style={loadingStyle}>
          Carregando...
        </div>
      )}
      {!loading && data && (
        <div style={resultContainerStyle}>
          {searchCode && (
            <div>
              {filteredData && filteredData.length > 0 ? (
                <div style={resultContainerStyle}>
                  {filteredData.map((item, index) => (
                    <div key={index} style={resultBoxStyle}>
                      <div style={resultItemStyle}>
                        <strong style={resultLabelStyle}>Código:</strong> <span style={resultValueStyle}>{item.colmeia_id}</span>
                      </div>
                      <div style={resultItemStyle}>
                        <strong style={resultLabelStyle}>Espécie:</strong> <span style={resultValueStyle}>{(() => {
                          const speciesInfo = getSpeciesDisplayName(item.species);
                          if (speciesInfo.scientificName) {
                            return (
                              <span>
                                {speciesInfo.commonName} (<em>{speciesInfo.scientificName}</em>)
                              </span>
                            );
                          }
                          return speciesInfo.commonName;
                        })()}</span>
                      </div>
                      <div style={resultItemStyle}>
                        <strong style={resultLabelStyle}>Data de Início:</strong> <span style={resultValueStyle}>{item.starting_date ? new Date(item.starting_date).toLocaleDateString('pt-BR') : 'N/A'}</span>
                      </div>
                      <div style={resultItemStyle}>
                        <strong style={resultLabelStyle}>Status:</strong> <span style={resultValueStyle}>{item.status || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={noResultsStyle}>Nenhum resultado encontrado para o código "{searchCode}"</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
