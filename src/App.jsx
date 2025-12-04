import React, { useState } from 'react';
import FlightSearch from './components/FlightSearch';
import FlightResults from './components/FlightResults';
import { searchFlights as searchMockFlights } from './services/mockFlights';
import { searchFlights as searchRealFlights } from './services/amadeusService';
import './index.css';

// Set this to true after adding your API keys in services/amadeusService.js
const USE_REAL_API = true;

function App() {
  const [view, setView] = useState('search'); // 'search' | 'loading' | 'results'
  const [results, setResults] = useState(null);

  const handleSearch = async (searchParams) => {
    setView('loading');
    try {
      const searchFn = USE_REAL_API ? searchRealFlights : searchMockFlights;
      const data = await searchFn(searchParams);
      setResults(data);
      setView('results');
    } catch (error) {
      console.error("Search failed", error);
      alert("Search failed. If using real API, check console for details.");
      setView('search');
    }
  };

  const handleBack = () => {
    setView('search');
    setResults(null);
  };

  return (
    <div className="container">
      {view === 'search' && (
        <FlightSearch onSearch={handleSearch} />
      )}

      {view === 'loading' && (
        <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Finding best flights...</p>
        </div>
      )}

      {view === 'results' && results && (
        <FlightResults results={results} onBack={handleBack} />
      )}

      <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontWeight: '500' }}>
        Made By <span style={{ color: '#ef4444' }}>❤️</span> - Mojtaba
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
