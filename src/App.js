import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

  const [data, setData] = useState(null);
  const API_URL = '/colmeias'; // This will be proxied to https://bombus.onrender.com/colmeias

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        console.error('Fetch failed, possibly offline:', err);
      });
  }, []);

    return (
    <div>
      <h1>Bombus Eyes</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
