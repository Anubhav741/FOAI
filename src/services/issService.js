import axios from 'axios';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// Fallback data if API is completely unreachable
export const FALLBACK_ISS_DATA = {
  latitude: 20.5937,
  longitude: 78.9629,
  altitude: 420,
  velocity: 27600,
  visibility: 'daylight',
  timestamp: Math.floor(Date.now() / 1000),
  _isFallback: true,
};

/**
 * Fetch current ISS position — single endpoint, no retries here
 */
export async function fetchISSPosition() {
  const response = await axios.get(
    'https://api.wheretheiss.at/v1/satellites/25544',
    { timeout: 8000 }
  );
  console.log('[ISS] Position fetched:', response.data.latitude?.toFixed(2), response.data.longitude?.toFixed(2));
  return response.data;
}

/**
 * Fetch astronauts currently in space
 * Open Notify API returns { people: [{ name, craft }], number }
 */
export async function fetchAstronauts() {
  try {
    const response = await axios.get(
      'https://api.open-notify.org/astros.json',
      { timeout: 8000 }
    );
    const people = response.data?.people || [];
    console.log('[ISS] Astronauts fetched:', people.length);
    return people;
  } catch (err) {
    console.error('[ISS] Astronaut API error:', err?.message);
    return [];
  }
}

/**
 * Reverse geocode — throttled externally, not called directly
 */
export async function reverseGeocode(lat, lon) {
  try {
    const response = await axios.get(`${NOMINATIM_BASE}/reverse`, {
      params: { lat, lon, format: 'json', 'accept-language': 'en', zoom: 5 },
      headers: { 'User-Agent': 'ISS-Dashboard/1.0 (educational)' },
      timeout: 5000,
    });
    const addr = response.data?.address;
    if (addr) {
      return addr.country || addr.ocean || addr.sea || addr.body_of_water || 'Open Ocean';
    }
    return 'Open Ocean';
  } catch {
    return 'Unknown';
  }
}
