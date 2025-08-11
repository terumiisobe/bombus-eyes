import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');
  const [filteredData, setFilteredData] = useState(null);
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
        ? data.filter(item => item.ColmeiaId && item.ColmeiaId.toString().includes(searchCode))
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

  const handleSearch = () => {
    // Search is handled automatically by the useEffect above
  };

  return (
    <div>
      <h1>Meliponário Colibri</h1>
      
      {/* Search input and button - always visible at top */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Digite o código da colmeia..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            flex: 1,
            maxWidth: '300px'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Buscar
        </button>
      </div>

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
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Carregando...
        </div>
      )}
      {!loading && data && (
        <div>
          {searchCode ? (
            <div>
              <h3>Resultados da busca para: "{searchCode}"</h3>
              {filteredData && filteredData.length > 0 ? (
                <pre>{JSON.stringify(filteredData, null, 2)}</pre>
              ) : (
                <p>Nenhum resultado encontrado para o código "{searchCode}"</p>
              )}
            </div>
          ) : (
            <div>
              <h3>Todos os dados:</h3>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
