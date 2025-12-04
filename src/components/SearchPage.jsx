import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import FlightSearch from './FlightSearch';
import FlightResults from './FlightResults';
import { searchFlights as searchMockFlights } from '../services/mockFlights';
import { searchFlights as searchRealFlights } from '../services/amadeusService';
import '../index.css';
import '../App.css';

// Set this to true after adding your API keys in services/amadeusService.js
const USE_REAL_API = true;

function SearchPage() {
    const navigate = useNavigate();
    const [view, setView] = useState('search'); // 'search' | 'loading' | 'results'
    const [results, setResults] = useState(null);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

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
        <div className="container" style={{ position: 'relative' }}>
            {user && (
                <div className="user-header">
                    <div className="user-profile" onClick={() => setMenuOpen(!menuOpen)}>
                        <div className="user-avatar">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className="user-name">{user.firstName} {user.lastName}</span>
                        <ChevronDown size={16} style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </div>

                    {menuOpen && (
                        <div className="user-menu">
                            <div className="menu-item" onClick={() => alert('Dashboard feature coming soon!')}>
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </div>
                            <div className="menu-item danger" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

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

export default SearchPage;
