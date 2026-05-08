export default function SkeletonCard({ lines = 3 }) {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-4" style={{ width: `${100 - i * 12}%` }} />
      ))}
      <div className="skeleton h-4 w-1/3" />
    </div>
  );
}
