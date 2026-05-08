import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Globe } from 'lucide-react';
import { truncate, timeAgo } from '../utils/formatters';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';

export default function NewsCard({ article, index = 0 }) {
  const {
    title,
    description,
    link,
    source_id,
    pubDate,
    image_url,
  } = article;

  const imgSrc = image_url && image_url.startsWith('http') ? image_url : FALLBACK_IMG;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card overflow-hidden flex flex-col h-full group"
    >
      {/* Image */}
      <div className="news-img-container h-44 bg-gray-800 relative overflow-hidden flex-shrink-0">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = FALLBACK_IMG; }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {source_id && (
          <span className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(99,102,241,0.85)', color: '#fff' }}>
            {source_id}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: 'var(--color-text)' }}>
          {title || 'Untitled Article'}
        </h3>

        {description && (
          <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--color-muted)' }}>
            {truncate(description, 110)}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted)' }}>
            <Calendar size={11} />
            <span>{timeAgo(pubDate)}</span>
          </div>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Read More <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
