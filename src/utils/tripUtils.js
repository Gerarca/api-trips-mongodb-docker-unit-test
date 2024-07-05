const axios = require('axios');

async function getAddressFromCoords(lat, lon) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json'
      }
    });
    return response.data.display_name;
  } catch (err) {
    console.error('Error fetching address from coordinates', err);
    return 'Unknown';
  }
}

function haversineDistance(coord1, coord2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = coord1.lat * Math.PI / 180;
  const φ2 = coord2.lat * Math.PI / 180;
  const Δφ = (coord2.lat - coord1.lat) * Math.PI / 180;
  const Δλ = (coord2.lon - coord1.lon) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // Distance in meters
  return d / 1000; // Convert to kilometers
}

function calculateTripMetrics(readings) {
  readings.sort((a, b) => new Date(a.time) - new Date(b.time));

  const start = readings[0];
  const end = readings[readings.length - 1];
  const duration = new Date(end.time) - new Date(start.time);
  let distance = 0;
  let overspeedsCount = 0;
  let inOverspeedSegment = false;
  const boundingBox = [
    [Infinity, Infinity],
    [-Infinity, -Infinity]
  ];

  for (let i = 1; i < readings.length; i++) {
    const prev = readings[i - 1];
    const curr = readings[i];
    distance += haversineDistance(prev.location, curr.location);

    if (curr.speed > curr.speedLimit) {
      if (!inOverspeedSegment) {
        inOverspeedSegment = true;
        overspeedsCount++;
      }
    } else {
      inOverspeedSegment = false;
    }

    boundingBox[0][0] = Math.min(boundingBox[0][0], curr.location.lat);
    boundingBox[0][1] = Math.min(boundingBox[0][1], curr.location.lon);
    boundingBox[1][0] = Math.max(boundingBox[1][0], curr.location.lat);
    boundingBox[1][1] = Math.max(boundingBox[1][1], curr.location.lon);
  }

  return {
    start,
    end,
    duration,
    distance,
    overspeedsCount,
    boundingBox
  };
}

module.exports = {
  getAddressFromCoords,
  calculateTripMetrics
};
