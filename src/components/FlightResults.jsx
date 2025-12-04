import React from 'react';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import './FlightResults.css';

const FlightResults = ({ results, onBack }) => {
    const getCurrencySymbol = (code) => {
        switch (code) {
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'JPY': return '¥';
            case 'IRR': return '﷼';
            case 'DKK': return 'kr ';
            case 'SEK': return 'kr ';
            case 'NOK': return 'kr ';
            default: return '$';
        }
    };

    const currencySymbol = getCurrencySymbol(results.currency);

    const FlightSegment = ({ segment, type }) => (
        <div className={`flight-info ${type}`}>
            <div className="airline">
                <img
                    src={`https://pics.avs.io/200/200/${segment.airlineCode}.png`}
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${segment.airline}&background=random&color=fff&size=32` }}
                    alt={segment.airline}
                    className="airline-logo"
                />
                <div className="airline-details">
                    <span className="airline-name">{segment.airline}</span>
                    <span className="flight-type-label">{type === 'outbound' ? 'Outbound' : 'Return'}</span>
                </div>
            </div>
            <div className="route-time">
                <div className="time-group">
                    <span className="time">{segment.departure}</span>
                    <span className="airport">{segment.departureCode || results.originCode}</span>
                </div>
                <div className="duration-line">
                    <span className="duration">{segment.duration}</span>
                    <div className="line"></div>
                    <span className="stops">{segment.stops === 0 ? 'Direct' : `${segment.stops} Stop`}</span>
                </div>
                <div className="time-group">
                    <span className="time">{segment.arrival}</span>
                    <span className="airport">{segment.arrivalCode || results.destinationCode}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flight-results-card">
            <div className="results-header">
                <button onClick={onBack} className="back-btn">
                    <ArrowLeft size={20} />
                </button>
                <div className="header-info">
                    <h3>{results.origin} to {results.destination}</h3>
                    <div className="dates-info">
                        <span>{new Date(results.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        {results.returnDate && (
                            <>
                                <span className="date-separator"> - </span>
                                <span>{new Date(results.returnDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flights-list">
                {results.flights.map((flight) => (
                    <div key={flight.id} className="flight-card">
                        <div className="flight-segments">
                            <FlightSegment segment={flight.outbound} type="outbound" />
                            {flight.return && (
                                <>
                                    <div className="segment-divider"></div>
                                    <FlightSegment segment={flight.return} type="return" />
                                </>
                            )}
                        </div>
                        <div className="flight-price">
                            <span className="price">{currencySymbol}{flight.price}</span>
                            <button className="book-btn">Select</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlightResults;
