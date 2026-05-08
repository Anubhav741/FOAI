import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSPosition, fetchAstronauts, reverseGeocode, FALLBACK_ISS_DATA } from '../services/issService';
import toast from 'react-hot-toast';

const ISSContext = createContext(null);

const POLL_INTERVAL = 10000;   // 10 seconds between requests
const MAX_TRAIL = 50;
const MAX_SPEED_HISTORY = 20;
const MAX_CONSECUTIVE_FAILS = 3;   // after 3 fails, switch to 30s polling
const BACKOFF_INTERVAL = 30000;    // 30s when rate-limited
const GEOCODE_INTERVAL = 30000;    // only geocode every 30s

export function ISSProvider({ children }) {
  const [position, setPosition] = useState(null);
  const [trail, setTrail] = useState([]);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [location, setLocation] = useState('');
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Refs — survive re-renders, no deps needed
  const intervalRef = useRef(null);
  const isFetchingRef = useRef(false);       // REQUEST LOCK
  const failCountRef = useRef(0);            // consecutive fail counter
  const lastGeoRef = useRef(0);              // last geocode timestamp
  const lastToastRef = useRef(0);            // toast spam prevention
  const mountedRef = useRef(true);

  // ---- SINGLE fetch function with request lock ----
  const fetchData = useCallback(async () => {
    // REQUEST LOCK — prevent overlapping requests
    if (isFetchingRef.current) {
      console.log('[ISS] Skipping — previous request still in progress');
      return;
    }
    if (!mountedRef.current) return;

    isFetchingRef.current = true;
    console.log('[ISS] Fetching position...');

    try {
      const data = await fetchISSPosition();
      if (!mountedRef.current) return;

      // SUCCESS — reset fail counter
      failCountRef.current = 0;
      setPosition(data);
      setError(null);
      setLastUpdated(new Date());

      // If we were on backoff interval, switch back to normal
      if (intervalRef.current?._backoff) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
        intervalRef.current._backoff = false;
        console.log('[ISS] Resumed normal 10s polling');
      }

      // Trail
      setTrail(prev => [...prev, [data.latitude, data.longitude]].slice(-MAX_TRAIL));

      // Speed history for chart
      setSpeedHistory(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        speed: Math.round(data.velocity),
      }].slice(-MAX_SPEED_HISTORY));

      // Geocode — throttled to once per 30s
      const now = Date.now();
      if (now - lastGeoRef.current > GEOCODE_INTERVAL) {
        lastGeoRef.current = now;
        const loc = await reverseGeocode(data.latitude, data.longitude);
        if (mountedRef.current) setLocation(loc);
      }

    } catch (err) {
      if (!mountedRef.current) return;
      failCountRef.current += 1;
      console.error('[ISS] API error (fail #' + failCountRef.current + '):', err?.response?.status || err?.message);

      // Set error state but KEEP previous position data visible
      const isRateLimit = err?.response?.status === 429;
      setError(isRateLimit ? 'Rate limited. Backing off...' : 'ISS API error. Retrying...');

      // Toast at most once per 60s
      const now = Date.now();
      if (now - lastToastRef.current > 60000) {
        lastToastRef.current = now;
        toast.error(isRateLimit ? 'ISS API rate limited — backing off to 30s' : 'ISS API error — retrying');
      }

      // After MAX_CONSECUTIVE_FAILS, slow down to 30s polling
      if (failCountRef.current >= MAX_CONSECUTIVE_FAILS && !intervalRef.current?._backoff) {
        console.log('[ISS] Too many fails — switching to 30s backoff polling');
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchData, BACKOFF_INTERVAL);
        intervalRef.current._backoff = true;
      }

      // If we have NO data at all, use fallback so UI never breaks
      if (!position) {
        console.log('[ISS] Using fallback data');
        setPosition(FALLBACK_ISS_DATA);
        setSpeedHistory([{
          time: new Date().toLocaleTimeString(),
          speed: FALLBACK_ISS_DATA.velocity,
        }]);
      }

    } finally {
      isFetchingRef.current = false;
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    failCountRef.current = 0;
    setLoading(true);
    // Reset to normal polling if on backoff
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    intervalRef.current._backoff = false;
    fetchData();
    fetchAstronauts().then(data => {
      if (mountedRef.current) setAstronauts(Array.isArray(data) ? data : []);
    });
  }, [fetchData]);

  // ===== SINGLE useEffect — the ONLY polling loop in the entire app =====
  useEffect(() => {
    mountedRef.current = true;
    console.log('[ISS] Provider mounted — starting single polling loop (10s)');

    // Initial fetch
    fetchData();
    fetchAstronauts().then(data => {
      if (mountedRef.current) setAstronauts(Array.isArray(data) ? data : []);
    });

    // ONE interval — the only setInterval in the entire app
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      console.log('[ISS] Provider unmounting — clearing interval');
      mountedRef.current = false;
      clearInterval(intervalRef.current);
    };
  // Empty deps — runs EXACTLY once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ISSContext.Provider value={{
      position, trail, speedHistory, location, astronauts,
      loading, error, lastUpdated, refresh,
    }}>
      {children}
    </ISSContext.Provider>
  );
}

/**
 * useISS — reads shared ISS data. Zero API calls. Safe to use anywhere.
 */
export function useISS() {
  const ctx = useContext(ISSContext);
  if (!ctx) throw new Error('useISS must be used inside <ISSProvider>');
  return ctx;
}
