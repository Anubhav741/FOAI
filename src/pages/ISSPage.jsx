import { motion } from 'framer-motion';
import { RefreshCw, Satellite, Activity, Globe, Eye, Clock, Users, AlertTriangle } from 'lucide-react';
import { useISS } from '../hooks/useISS';
import { formatSpeed, formatAltitude, formatDegrees, formatTimestamp } from '../utils/formatters';
import StatCard from '../components/StatCard';
import ISSMap from '../map/ISSMap';
import SpeedChart from '../charts/SpeedChart';
import ErrorBoundary from '../components/ErrorBoundary';

export default function ISSPage() {
  const { position, trail, speedHistory, location, astronauts, loading, error, lastUpdated, refresh } = useISS();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>
            ISS Live Tracker
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Updates every 10 seconds · {lastUpdated ? `Last: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </motion.button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Globe} label="Latitude" value={position ? formatDegrees(position.latitude, true) : '--'} color="#6366f1" loading={loading} />
        <StatCard icon={Globe} label="Longitude" value={position ? formatDegrees(position.longitude, false) : '--'} color="#22d3ee" loading={loading} />
        <StatCard icon={Activity} label="Velocity" value={position ? formatSpeed(position.velocity) : '--'} sub="Orbital speed" color="#f59e0b" loading={loading} />
        <StatCard icon={Satellite} label="Altitude" value={position ? formatAltitude(position.altitude) : '--'} sub="Above Earth" color="#10b981" loading={loading} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Visibility" value={position?.visibility ?? '--'} color="#8b5cf6" loading={loading} />
        <StatCard icon={Globe} label="Over" value={location || 'Detecting...'} color="#f43f5e" loading={loading} />
        <StatCard icon={Clock} label="Timestamp" value={position ? new Date(position.timestamp * 1000).toLocaleTimeString() : '--'} color="#06b6d4" loading={loading} />
        <StatCard icon={Users} label="Crew" value={`${astronauts.length} astronauts`} color="#f59e0b" loading={loading} />
      </div>

      {/* Map */}
      <ErrorBoundary>
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            Live World Map
          </h3>
          <ISSMap position={position} trail={trail} />
        </div>
      </ErrorBoundary>

      {/* Speed Chart */}
      <SpeedChart data={speedHistory} />

      {/* People in Space */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} style={{ color: '#f59e0b' }} />
          <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
            People in Space Right Now
          </h3>
          <span className="ml-auto px-3 py-1 rounded-full text-sm font-bold"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            {astronauts.length} Total
          </span>
        </div>

        {astronauts.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {astronauts.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--color-surface-2)' }}
              >
                <span className="text-xl">👨‍🚀</span>
                <div>
                  <p className="text-sm font-medium leading-tight" style={{ color: 'var(--color-text)' }}>
                    {a.name || a}
                  </p>
                  {a.craft && (
                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{a.craft}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
