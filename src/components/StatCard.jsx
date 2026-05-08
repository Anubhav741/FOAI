export default function StatCard({ icon: Icon, label, value, sub, color = '#6366f1', loading }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${color}22`, color }}>
            <Icon size={16} />
          </div>
        )}
      </div>

      {loading ? (
        <div>
          <div className="skeleton h-7 w-32 mb-1" />
          <div className="skeleton h-4 w-20" />
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {value ?? '--'}
          </div>
          {sub && (
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {sub}
            </div>
          )}
        </>
      )}
    </div>
  );
}
