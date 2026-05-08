/**
 * Format a Unix timestamp to readable date/time
 */
export function formatTimestamp(unixTs) {
  if (!unixTs) return '--';
  return new Date(unixTs * 1000).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

/**
 * Format degrees to DMS notation
 */
export function formatDegrees(deg, isLat) {
  if (deg === undefined || deg === null) return '--';
  const abs = Math.abs(deg);
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return `${abs.toFixed(4)}° ${dir}`;
}

/**
 * Format km/h speed
 */
export function formatSpeed(kmh) {
  if (!kmh) return '--';
  return `${Math.round(kmh).toLocaleString()} km/h`;
}

/**
 * Format altitude in km
 */
export function formatAltitude(km) {
  if (!km) return '--';
  return `${km.toFixed(1)} km`;
}

/**
 * Format a date string to readable
 */
export function formatDate(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/**
 * Truncate text to given length
 */
export function truncate(text, maxLen = 120) {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

/**
 * Get relative time (e.g. "2 hours ago")
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
