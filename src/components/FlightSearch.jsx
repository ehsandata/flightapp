import React, { useState, useEffect, useRef } from 'react';
import { Plane, Calendar, MapPin, Search, Users, DollarSign } from 'lucide-react';
import { airports } from '../services/airports';
import './FlightSearch.css';

const FlightSearch = ({ onSearch }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [tripType, setTripType] = useState('one-way'); // 'one-way' | 'return'
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [currency, setCurrency] = useState('DKK');

    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null); // 'origin' | 'destination' | null
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSuggestions([]);
                setActiveField(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        if (field === 'origin') setOrigin(value);
        else setDestination(value);

        setActiveField(field);

        if (value.length > 0) {
            const filtered = airports.filter(airport =>
                airport.city.toLowerCase().includes(value.toLowerCase()) ||
                airport.code.toLowerCase().includes(value.toLowerCase()) ||
                airport.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (airport) => {
        const value = `${airport.city} (${airport.code})`;
        if (activeField === 'origin') setOrigin(value);
        else setDestination(value);

        setSuggestions([]);
        setActiveField(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (destination && date) {
            const searchData = {
                origin,
                destination,
                date,
                adults,
                children,
                currency,
                tripType
            };

            if (tripType === 'return') {
                searchData.returnDate = returnDate;
            }

            onSearch(searchData);
        }
    };

    return (
        <div className="flight-search-card" ref={wrapperRef}>
            <div className="header">
                <Plane className="icon-logo" size={24} />
                <h2>Find your flight</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="trip-type-selector">
                    <label className={`trip-type-option ${tripType === 'one-way' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="tripType"
                            value="one-way"
                            checked={tripType === 'one-way'}
                            onChange={() => setTripType('one-way')}
                        />
                        One Way
                    </label>
                    <label className={`trip-type-option ${tripType === 'return' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="tripType"
                            value="return"
                            checked={tripType === 'return'}
                            onChange={() => setTripType('return')}
                        />
                        Return
                    </label>
                </div>

                <div className="input-group">
                    <label>From</label>
                    <div className="input-wrapper">
                        <MapPin size={18} className="input-icon" />
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => handleInputChange(e, 'origin')}
                            onFocus={() => setActiveField('origin')}
                            placeholder="Origin City"
                        />
                        {activeField === 'origin' && suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((airport) => (
                                    <li key={airport.code} onClick={() => handleSelectSuggestion(airport)}>
                                        <div className="suggestion-code">{airport.code}</div>
                                        <div className="suggestion-info">
                                            <span className="suggestion-city">{airport.city}</span>
                                            <span className="suggestion-name">{airport.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="input-group">
                    <label>To</label>
                    <div className="input-wrapper">
                        <MapPin size={18} className="input-icon" />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => handleInputChange(e, 'destination')}
                            onFocus={() => setActiveField('destination')}
                            placeholder="Where to?"
                            required
                        />
                        {activeField === 'destination' && suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((airport) => (
                                    <li key={airport.code} onClick={() => handleSelectSuggestion(airport)}>
                                        <div className="suggestion-code">{airport.code}</div>
                                        <div className="suggestion-info">
                                            <span className="suggestion-city">{airport.city}</span>
                                            <span className="suggestion-name">{airport.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="row-group">
                    <div className="input-group">
                        <label>Depart</label>
                        <div className="input-wrapper">
                            <Calendar size={18} className="input-icon" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {tripType === 'return' && (
                        <div className="input-group">
                            <label>Return</label>
                            <div className="input-wrapper">
                                <Calendar size={18} className="input-icon" />
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    required={tripType === 'return'}
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>Currency</label>
                        <div className="input-wrapper">
                            <DollarSign size={18} className="input-icon" />
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="select-input"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="IRR">IRR (﷼)</option>
                                <option value="DKK">DKK (kr)</option>
                                <option value="SEK">SEK (kr)</option>
                                <option value="NOK">NOK (kr)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row-group">
                    <div className="input-group">
                        <label>Adults (12+)</label>
                        <div className="input-wrapper">
                            <Users size={18} className="input-icon" />
                            <input
                                type="number"
                                min="1"
                                max="9"
                                value={adults}
                                onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Children (&lt;12)</label>
                        <div className="input-wrapper">
                            <Users size={18} className="input-icon" />
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={children}
                                onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="search-btn">
                    <Search size={20} />
                    Search Flights
                </button>
            </form>
        </div>
    );
};

export default FlightSearch;
