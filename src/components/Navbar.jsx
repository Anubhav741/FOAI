import { Menu, Sun, Moon, RefreshCw, Satellite } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function Navbar({ onMenuClick, title = 'Dashboard' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 border-b"
      style={{
        background: 'rgba(var(--color-bg-rgb, 10,10,15), 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-muted)' }}
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Satellite size={18} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text)' }}>
            {title}
          </h1>
        </div>
      </div>

      {/* Right: theme toggle */}
      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-all hover:opacity-80"
          style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
      </div>
    </header>
  );
}
