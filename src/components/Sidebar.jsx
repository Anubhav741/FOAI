import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Satellite, Newspaper, Bot, BarChart2, X, Home } from 'lucide-react';

const navItems = [
  { to: '/',        label: 'Dashboard',  icon: Home      },
  { to: '/iss',     label: 'ISS Tracker',icon: Satellite  },
  { to: '/news',    label: 'News Feed',  icon: Newspaper  },
  { to: '/charts',  label: 'Charts',     icon: BarChart2  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 z-50 lg:relative lg:translate-x-0 lg:z-auto flex flex-col"
        style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>
              <Satellite size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm gradient-text font-['Space_Grotesk']">ISS Dashboard</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:opacity-70" style={{ color: 'var(--color-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? 'nav-link-active' : 'hover:opacity-80'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
                background: isActive ? 'var(--color-primary-glow)' : 'transparent',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-xs" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
          <div className="flex items-center gap-2">
            <Bot size={14} />
            AI Assistant available via floating button
          </div>
        </div>
      </motion.aside>
    </>
  );
}
