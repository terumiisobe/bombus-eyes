import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);
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
          setData({ error: 'Unable to load data. Please check your connection.' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOnline]);

  return (
    <div>
      <h1>Bombus Eyes</h1>
      {!isOnline && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          padding: '10px', 
          margin: '10px 0',
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          ⚠️ You are currently offline. Showing cached data.
        </div>
      )}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading...
        </div>
      )}
      {!loading && data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
