import { motion } from 'framer-motion';
import { Satellite, Newspaper, Bot, BarChart2, Activity, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useISS } from '../hooks/useISS';
import { formatSpeed, formatAltitude, formatDegrees } from '../utils/formatters';
import StatCard from '../components/StatCard';
import SpeedChart from '../charts/SpeedChart';

const features = [
  { icon: Satellite, title: 'ISS Live Tracker', desc: 'Real-time ISS position on an interactive map with trail and speed data.', to: '/iss', color: '#6366f1' },
  { icon: Newspaper, title: 'News Dashboard', desc: 'Latest AI, space, science and technology news with search and filters.', to: '/news', color: '#22d3ee' },
  { icon: BarChart2, title: 'Analytics', desc: 'Live speed charts and news category distributions.', to: '/charts', color: '#f59e0b' },
  { icon: Bot, title: 'AI Chatbot', desc: 'Mistral-7B powered assistant for space, AI and news questions.', to: null, color: '#10b981' },
];

export default function DashboardPage() {
  const { position, speedHistory, loading, astronauts } = useISS();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-8"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2) 0%,rgba(34,211,238,0.1) 100%)', border: '1px solid var(--color-border)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', borderRadius: '50%', transform: 'translate(30%,-30%)' }} />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)' }}>
            <Satellite size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>
              ISS + AI News Dashboard
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              Real-time space tracking · Live news · AI assistant
            </p>
          </div>
        </div>
        <p className="text-sm max-w-xl" style={{ color: 'var(--color-muted)' }}>
          Track the International Space Station live, explore the latest AI and space news, and chat with an AI assistant — all in one place.
        </p>
      </motion.div>

      {/* ISS Quick Stats */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted)' }}>
          ISS Live Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Globe} label="Latitude" value={position ? formatDegrees(position.latitude, true) : '--'} color="#6366f1" loading={loading} />
          <StatCard icon={Globe} label="Longitude" value={position ? formatDegrees(position.longitude, false) : '--'} color="#22d3ee" loading={loading} />
          <StatCard icon={Activity} label="Speed" value={position ? formatSpeed(position.velocity) : '--'} color="#f59e0b" loading={loading} />
          <StatCard icon={Satellite} label="Altitude" value={position ? formatAltitude(position.altitude) : '--'} color="#10b981" loading={loading} />
        </div>
      </div>

      {/* Speed chart preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpeedChart data={speedHistory} />
        </div>

        {/* People in space */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} style={{ color: '#f59e0b' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>People in Space</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              {astronauts.length}
            </span>
          </div>
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '160px' }}>
            {astronauts.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-7 w-full rounded-lg" />
              ))
            ) : astronauts.map((a, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--color-surface-2)' }}>
                <span className="text-sm">👨‍🚀</span>
                <span className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>
                  {a.name || a}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted)' }}>
          Explore Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc, to, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${color}22`, color }}>
                <Icon size={20} />
              </div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{title}</h4>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--color-muted)' }}>{desc}</p>
              {to ? (
                <Link to={to} className="text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color }}>
                  Explore →
                </Link>
              ) : (
                <span className="text-xs font-medium" style={{ color }}>
                  Use the 🤖 button →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
