import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useISS } from '../hooks/useISS';
import { fetchNewsByCategories } from '../services/newsDataService';
import SpeedChart from '../charts/SpeedChart';
import NewsPieChart from '../charts/NewsPieChart';
import ISSMap from '../map/ISSMap';
import ErrorBoundary from '../components/ErrorBoundary';
import { BarChart2, Activity, Globe } from 'lucide-react';

export default function ChartsPage() {
  const { position, trail, speedHistory, loading } = useISS();
  const [categoryData, setCategoryData] = useState({});
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNewsByCategories(['technology', 'artificial intelligence', 'space', 'science']);
        setCategoryData(data);
      } catch {
        // ignore
      } finally {
        setCatLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>
          Analytics & Charts
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
          Real-time ISS data visualizations and news insights
        </p>
      </div>

      {/* Speed + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <SpeedChart data={speedHistory} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          {catLoading ? (
            <div className="glass-card p-5 h-64 flex items-center justify-center" style={{ color: 'var(--color-muted)' }}>
              <Activity size={24} className="animate-spin mr-2" /> Loading category data...
            </div>
          ) : (
            <NewsPieChart categoryData={categoryData} />
          )}
        </motion.div>
      </div>

      {/* ISS Map */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-3">
          <Globe size={16} style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>ISS World Map</h3>
          <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: '#10b981' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>
        <ErrorBoundary>
          <ISSMap position={position} trail={trail} />
        </ErrorBoundary>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <BarChart2 size={24} className="mx-auto mb-2" style={{ color: '#6366f1' }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk,sans-serif' }}>
            {speedHistory.length}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Speed data points</div>
        </div>
        <div className="glass-card p-5 text-center">
          <Globe size={24} className="mx-auto mb-2" style={{ color: '#22d3ee' }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk,sans-serif' }}>
            {trail.length}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Trail points tracked</div>
        </div>
        <div className="glass-card p-5 text-center">
          <Activity size={24} className="mx-auto mb-2" style={{ color: '#f59e0b' }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk,sans-serif' }}>
            {position ? `${Math.round(position.velocity).toLocaleString()}` : '--'}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Current speed km/h</div>
        </div>
      </div>
    </div>
  );
}
