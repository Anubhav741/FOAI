import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom ISS icon using divIcon with pulse animation
const issIcon = L.divIcon({
  className: '',
  html: `
    <div class="iss-marker-wrapper">
      <div class="iss-pulse"></div>
      <div style="
        width:36px; height:36px; background:linear-gradient(135deg,#6366f1,#22d3ee);
        border-radius:50%; display:flex; align-items:center; justify-content:center;
        font-size:18px; box-shadow:0 0 12px rgba(99,102,241,0.6); z-index:1; position:relative;
      ">🛰️</div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -24],
});

// Component to smoothly pan/fly map to ISS position
function FlyToISS({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.flyTo([lat, lng], map.getZoom(), {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [lat, lng, map]);
  return null;
}

export default function ISSMap({ position, trail }) {
  // Memoize center to avoid unnecessary re-renders
  const lat = position?.latitude ?? 0;
  const lng = position?.longitude ?? 0;
  const hasPosition = position !== null && position !== undefined;

  // Memoize trail positions to avoid re-creating arrays on each render
  const trailPositions = useMemo(() => {
    if (!trail || trail.length < 2) return [];
    return trail;
  }, [trail]);

  return (
    <div className="glass-card overflow-hidden" style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={3}
        style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Dark tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* ISS trail polyline */}
        {trailPositions.length > 1 && (
          <Polyline
            positions={trailPositions}
            pathOptions={{
              color: '#6366f1',
              weight: 2,
              opacity: 0.7,
              dashArray: '6,4',
            }}
          />
        )}

        {/* ISS marker */}
        {hasPosition && (
          <Marker position={[lat, lng]} icon={issIcon}>
            <Popup>
              <div style={{ color: 'var(--color-text)', minWidth: '180px' }}>
                <p className="font-semibold mb-1">🛰️ ISS Position</p>
                <p className="text-xs">Lat: {position.latitude?.toFixed(4)}°</p>
                <p className="text-xs">Lon: {position.longitude?.toFixed(4)}°</p>
                <p className="text-xs">Alt: {position.altitude?.toFixed(1)} km</p>
                <p className="text-xs">Speed: {Math.round(position.velocity || 0).toLocaleString()} km/h</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Auto fly to ISS position */}
        {hasPosition && <FlyToISS lat={lat} lng={lng} />}
      </MapContainer>
    </div>
  );
}
