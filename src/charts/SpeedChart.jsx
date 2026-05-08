import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm" style={{ color: 'var(--color-text)' }}>
        <p style={{ color: 'var(--color-muted)' }} className="text-xs mb-1">{label}</p>
        <p className="font-semibold" style={{ color: '#6366f1' }}>
          {payload[0].value?.toLocaleString()} km/h
        </p>
      </div>
    );
  }
  return null;
};

export default function SpeedChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 glass-card"
        style={{ color: 'var(--color-muted)' }}>
        Collecting speed data...
      </div>
    );
  }

  const avg = data.length ? Math.round(data.reduce((s, d) => s + d.speed, 0) / data.length) : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
          Real-Time Speed (km/h)
        </h3>
        <span className="text-xs px-2 py-1 rounded-full"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
          Avg: {avg.toLocaleString()} km/h
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
            interval="preserveStartEnd"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avg} stroke="rgba(99,102,241,0.4)" strokeDasharray="4 2" />
          <Line
            type="monotone"
            dataKey="speed"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
