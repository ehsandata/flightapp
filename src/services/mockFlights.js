export const searchFlights = async ({ origin, destination, date, returnDate, tripType, adults = 1, children = 0, currency = 'USD' }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const airlines = [
        { name: 'Emirates', code: 'EK' },
        { name: 'Lufthansa', code: 'LH' },
        { name: 'British Airways', code: 'BA' },
        { name: 'Air France', code: 'AF' },
        { name: 'Delta Air Lines', code: 'DL' },
        { name: 'United Airlines', code: 'UA' },
        { name: 'Qatar Airways', code: 'QR' },
        { name: 'Singapore Airlines', code: 'SQ' },
        { name: 'Turkish Airlines', code: 'TK' },
        { name: 'KLM Royal Dutch Airlines', code: 'KL' },
        { name: 'Scandinavian Airlines', code: 'SK' },
        { name: 'American Airlines', code: 'AA' },
        { name: 'Etihad Airways', code: 'EY' },
        { name: 'Cathay Pacific', code: 'CX' }
    ];
    const times = ['06:30', '09:15', '13:45', '17:20', '21:00'];

    // Currency multipliers relative to USD
    const multipliers = {
        'USD': 1,
        'EUR': 0.92,
        'GBP': 0.79,
        'JPY': 150,
        'IRR': 42000, // Official rate approx, market rate is much higher but keeping simple
        'DKK': 6.9,
        'SEK': 10.4,
        'NOK': 10.6
    };
    const rate = multipliers[currency] || 1;

    // Generate 3-5 random flight results
    const numFlights = Math.floor(Math.random() * 3) + 3;

    const flights = Array.from({ length: numFlights }).map((_, index) => {
        const airlineData = airlines[Math.floor(Math.random() * airlines.length)];
        const airlineCodeIATA = airlineData.code;
        const airline = `${airlineData.name} - ${airlineCodeIATA}`;

        // Base price in USD
        let basePrice = Math.floor(Math.random() * 300) + 150;

        // Add cost for passengers
        basePrice = basePrice * adults + (basePrice * 0.7 * children);

        // If return trip, increase price
        if (tripType === 'return') {
            basePrice = basePrice * 1.8; // Slightly cheaper than 2x
        }

        // Convert to selected currency
        const price = Math.ceil(basePrice * rate);

        const generateFlightDetails = (depTime, originCode, destCode) => {
            const [hours, minutes] = depTime.split(':').map(Number);
            const durationHours = Math.floor(Math.random() * 3) + 2;
            const arrivalHours = (hours + durationHours) % 24;
            const arrival = `${arrivalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            return {
                airline,
                airlineCode: airlineCodeIATA,
                departure: depTime,
                arrival,
                duration: `${durationHours}h 00m`,
                stops: Math.random() > 0.7 ? 1 : 0,
                departureCode: originCode,
                arrivalCode: destCode
            };
        };

        const departureTime = times[Math.floor(Math.random() * times.length)];
        const originCode = origin.substring(0, 3).toUpperCase();
        const destCode = destination.substring(0, 3).toUpperCase();

        const outboundFlight = generateFlightDetails(departureTime, originCode, destCode);

        let returnFlight = null;
        if (tripType === 'return') {
            const returnDepTime = times[Math.floor(Math.random() * times.length)];
            returnFlight = generateFlightDetails(returnDepTime, destCode, originCode);
        }

        return {
            id: index,
            price,
            outbound: outboundFlight,
            return: returnFlight,
            ...outboundFlight // Spread outbound for backward compatibility
        };
    });

    // Sort by price ascending (cheapest first)
    flights.sort((a, b) => a.price - b.price);

    return {
        origin,
        destination,
        date,
        returnDate: tripType === 'return' ? returnDate : null,
        currency,
        originCode: origin.substring(0, 3).toUpperCase(), // Mock code
        destinationCode: destination.substring(0, 3).toUpperCase(), // Mock code
        flights
    };
};
