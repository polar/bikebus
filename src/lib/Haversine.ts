export default function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radius of Earth in kilometers

    // Convert latitudes and longitudes from degrees to radians
    const toRadians = (deg: number): number => deg * (Math.PI / 180);
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    // Apply the Haversine formula
    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

     // Distance in kilometers
    return R * c;
}


// Example Usage:
// const latA = 34.0522; // Los Angeles
// const lonA = -118.2437;
// const latB = 40.7128; // New York
// const lonB = -74.0060;

// const distance = haversineDistance(latA, lonA, latB, lonB);
// console.log(`The distance between Los Angeles and New York is approximately ${distance.toFixed(2)} km.`);

// Example 2: Close points
// const latC = 51.5074; // London
// const lonC = 0.1278;
// const latD = 51.4998; // Nearby point in London
// const lonD = 0.1246;

// const distance2 = haversineDistance(latC, lonC, latD, lonD);
// console.log(`The distance between two points in London is approximately ${distance2.toFixed(2)} km.`);
