import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];

const CATEGORY_LABELS = {
  technology: 'Technology',
  'artificial intelligence': 'AI',
  space: 'Space',
  science: 'Science',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm" style={{ color: 'var(--color-text)' }}>
        <p className="font-medium">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill }}>{payload[0].value} articles</p>
      </div>
    );
  }
  return null;
};

export default function NewsPieChart({ categoryData }) {
  const data = Object.entries(categoryData || {}).map(([key, articles], i) => ({
    name: CATEGORY_LABELS[key] || key,
    value: Array.isArray(articles) ? articles.length : 0,
    fill: COLORS[i % COLORS.length],
  })).filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 glass-card" style={{ color: 'var(--color-muted)' }}>
        No category data yet
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text)' }}>
        News by Category
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
