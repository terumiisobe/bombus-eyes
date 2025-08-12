import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function App() {
  const [data, setData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanner, setQrScanner] = useState(null);
  const qrScannerRef = useRef(null);
  const API_URL = 'https://bombus.onrender.com/colmeias';

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('bombus-data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

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
        ? data.filter(item => item.ColmeiaID && item.ColmeiaID.toString() === searchCode)
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
        const response = await fetch(API_URL);
        if (response.ok) {
          const newData = await response.json();
          setData(newData);
          // Save to localStorage for offline persistence
          localStorage.setItem('bombus-data', JSON.stringify(newData));
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
        // If we're offline and have cached data, keep showing it
        if (!isOnline && data) {
          console.log('Offline - using cached data');
        } else if (!data) {
          // No cached data and offline, show error
          setData({ error: 'Não foi possível carregar os dados. Verifique sua conexão.' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOnline]);

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

  const handleSearch = () => {
    // Search is handled automatically by the useEffect above
  };

  return (
    <div>
      <h1>Meliponário Colibri</h1>
      
      {!isOnline && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          padding: '10px', 
          margin: '10px 0',
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          ⚠️ Você está offline no momento.
        </div>
      )}

      {/* Search input and button - always visible at top */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '10px', 
        marginBottom: '20px',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <input
          type="text"
          placeholder="Digitar código da colmeia"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '400px',
            boxSizing: 'border-box',
            textAlign: 'center'
          }}
        />
        <button
          onClick={() => setShowQRScanner(!showQRScanner)}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '400px',
            boxSizing: 'border-box'
          }}
        >
          {showQRScanner ? 'Cancelar QR' : 'Escanear QR Code'}
        </button>
      </div>

      {/* QR Scanner Container */}
      {showQRScanner && (
        <div style={{ 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div id="qr-reader" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}></div>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Posicione o QR code dentro da área de leitura
          </p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Carregando...
        </div>
      )}
      {!loading && data && (
        <div>
          {searchCode && (
            <div>
              {filteredData && filteredData.length > 0 ? (
                <div style={{ padding: '0 20px' }}>
                  {filteredData.map((item, index) => (
                    <div key={index} style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '15px',
                      backgroundColor: '#f9f9f9',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Código:</strong> {item.ColmeiaID}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Espécie:</strong> {item.Species || 'N/A'}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Data de Início:</strong> {item.StartingDate ? new Date(item.StartingDate).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                      <div>
                        <strong>Status:</strong> {item.Status || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum resultado encontrado para o código "{searchCode}"</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
