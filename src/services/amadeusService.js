// src/services/amadeusService.js

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
// 1. Go to https://developers.amadeus.com/
// 2. Sign up and create a new app to get your API Key and Secret.
// 3. Paste them below.
const CLIENT_ID = 'DIC56vUJzDkme2b2d8NiLH78lT3TpLxl';
const CLIENT_SECRET = 'Jw3cHHf7xdTZPDt1';
// ------------------------------------------------------------------

let accessToken = null;
let tokenExpiry = 0;

/**
 * Authenticates with Amadeus to get an access token.
 * Tokens are cached until they expire.
 */
const getAccessToken = async () => {
    const now = Date.now();
    if (accessToken && now < tokenExpiry) {
        return accessToken;
    }

    try {
        const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
        });

        if (!response.ok) {
            throw new Error('Failed to get access token. Check your API keys.');
        }

        const data = await response.json();
        accessToken = data.access_token;
        // Set expiry slightly before actual expiry (expires_in is in seconds)
        tokenExpiry = now + (data.expires_in * 1000) - 60000;
        return accessToken;
    } catch (error) {
        console.error("Amadeus Auth Error:", error);
        throw error;
    }
};

/**
 * Searches for flights using the Amadeus Flight Offers Search API.
 */
export const searchFlights = async ({ origin, destination, date, returnDate, tripType, adults = 1, children = 0, currency = 'USD' }) => {
    // Helper to extract 3-letter code from "City (ABC)" format
    const extractCode = (str) => {
        const match = str.match(/\(([^)]+)\)/);
        return match ? match[1] : str; // Fallback to full string if no match
    };

    const originCode = extractCode(origin);
    const destinationCode = extractCode(destination);

    try {
        const token = await getAccessToken();

        // Construct URL parameters
        const params = new URLSearchParams({
            originLocationCode: originCode,
            destinationLocationCode: destinationCode,
            departureDate: date,
            adults: adults.toString(),
            children: children.toString(),
            max: '10', // Limit results
            currencyCode: currency
        });

        if (tripType === 'return' && returnDate) {
            params.append('returnDate', returnDate);
        }

        const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("Amadeus API Error:", err);
            throw new Error('Failed to fetch flights from Amadeus.');
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            return {
                origin,
                destination,
                date,
                returnDate: tripType === 'return' ? returnDate : null,
                originCode,
                destinationCode,
                currency,
                flights: []
            };
        }

        // Map the complex Amadeus response to our simple FlightResults format
        const carrierNames = data.dictionaries?.carriers || {};

        const parseItinerary = (itinerary) => {
            const firstSegment = itinerary.segments[0];
            const lastSegment = itinerary.segments[itinerary.segments.length - 1];
            const carrierCode = firstSegment.carrierCode;

            // Format duration (PT2H30M -> 2h 30m)
            const duration = itinerary.duration
                .replace('PT', '')
                .replace('H', 'h ')
                .replace('M', 'm')
                .toLowerCase();

            // Use the dictionary from the API response, or fallback to code
            // Title case the name (AMADEUS returns UPPERCASE)
            let airlineName = carrierNames[carrierCode] || carrierCode;
            if (airlineName !== carrierCode) {
                airlineName = airlineName
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            // Add the short code (ICAO preferred)
            const displayCodeOverrides = {
                'AA': 'AAL', 'DL': 'DAL', 'UA': 'UAL', 'BA': 'BAW', 'AF': 'AFR',
                'LH': 'DLH', 'EK': 'UAE', 'QR': 'QTR', 'SQ': 'SIA', 'CX': 'CPA',
                'JL': 'JAL', 'NH': 'ANA', 'VS': 'VIR', 'KL': 'KLM', 'QF': 'QFA',
                'NZ': 'ANZ', 'ET': 'ETH', 'TK': 'THY', 'IB': 'IBE', 'AY': 'FIN',
                'SK': 'SAS', 'DY': 'NAX', 'LX': 'SWR', 'OS': 'AUA', 'FR': 'RYR',
                'U2': 'EZY', 'W6': 'WZZ', 'NK': 'NKS', 'B6': 'JBU', 'WN': 'SWA',
                'AS': 'ASA', 'AC': 'ACA', 'WS': 'WJA'
            };
            const displayCode = displayCodeOverrides[carrierCode] || carrierCode;
            airlineName = `${airlineName} - ${displayCode}`;

            return {
                airline: airlineName,
                airlineCode: carrierCode, // IATA code for logo
                departure: firstSegment.departure.at.split('T')[1].substring(0, 5),
                arrival: lastSegment.arrival.at.split('T')[1].substring(0, 5),
                duration: duration,
                stops: itinerary.segments.length - 1,
                departureCode: firstSegment.departure.iataCode,
                arrivalCode: lastSegment.arrival.iataCode
            };
        };

        const flights = data.data.map((offer, index) => {
            const outboundItinerary = offer.itineraries[0];
            const returnItinerary = offer.itineraries[1];

            const outboundFlight = parseItinerary(outboundItinerary);
            const returnFlight = returnItinerary ? parseItinerary(returnItinerary) : null;

            return {
                id: offer.id,
                price: Math.ceil(parseFloat(offer.price.total)),
                outbound: outboundFlight,
                return: returnFlight,
                // Flatten outbound properties for backward compatibility if needed, 
                // but we will update FlightResults to use 'outbound' and 'return'
                ...outboundFlight // Spread outbound for easier access if we only care about the first leg
            };
        });

        // Sort by price ascending (cheapest first)
        flights.sort((a, b) => a.price - b.price);

        return {
            origin,
            destination,
            date,
            returnDate: tripType === 'return' ? returnDate : null,
            originCode,
            destinationCode,
            currency,
            flights
        };

    } catch (error) {
        console.error("Search Flight Error:", error);
        throw error;
    }
};
