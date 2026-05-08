import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, Filter, ChevronDown, AlertTriangle, Newspaper } from 'lucide-react';
import { useNews } from '../hooks/useNews';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORY_LABELS = {
  technology: '💻 Technology',
  'artificial intelligence': '🤖 Artificial Intelligence',
  space: '🚀 Space',
  science: '🔬 Science',
};

export default function NewsPage() {
  const {
    articles, category, categories, loading, loadingMore,
    error, searchQuery, setSearchQuery, sortBy, setSortBy,
    changeCategory, loadMore, hasMore, refresh,
  } = useNews();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk,sans-serif' }}>
            News Feed
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Latest stories · {articles.length} articles loaded
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

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search news..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-colors"
          style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
          }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => changeCategory(cat)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
            style={category === cat
              ? { background: 'var(--color-primary)', color: '#fff' }
              : { background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }
            }
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
        {/* Sort */}
        <div className="ml-auto flex items-center gap-2">
          <Filter size={14} style={{ color: 'var(--color-muted)' }} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs rounded-xl px-3 py-2 outline-none border"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
          >
            <option value="latest">Latest</option>
          </select>
        </div>
      </div>

      {/* Featured article */}
      {!loading && articles.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={articles[0].image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=300&fit=crop'}
              alt={articles[0].title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=300&fit=crop'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="text-xs px-2 py-1 rounded-full font-medium mb-2 inline-block"
                style={{ background: 'var(--color-primary)', color: '#fff' }}>
                ⭐ Featured
              </span>
              <h2 className="text-white text-lg font-bold leading-tight max-w-2xl line-clamp-2 mt-1">
                {articles[0].title}
              </h2>
              {articles[0].link && (
                <a href={articles[0].link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm font-medium px-4 py-1.5 rounded-lg transition-all hover:opacity-80"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}>
                  Read Article →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Articles grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 glass-card">
          <Newspaper size={40} style={{ color: 'var(--color-muted)' }} />
          <p className="font-medium" style={{ color: 'var(--color-text)' }}>No articles found</p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Try a different search or category</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {articles.slice(1).map((article, i) => (
              <NewsCard key={article.article_id || i} article={article} index={i} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div className="flex justify-center pt-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          >
            {loadingMore ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <ChevronDown size={14} />
            )}
            {loadingMore ? 'Loading...' : 'Load More'}
          </motion.button>
        </div>
      )}
    </div>
  );
}
