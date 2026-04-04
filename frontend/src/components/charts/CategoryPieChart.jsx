import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#10b981', '#6366f1',
];

export default function CategoryPieChart({ data = [], type = 'expense' }) {
  const filtered = data.filter((d) => d.type === type);

  if (!filtered.length) {
    return (
      <div className="card flex items-center justify-center h-64 text-gray-400 text-sm">
        No {type} data available
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-gray-900 mb-4 capitalize">{type} by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={filtered}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="total"
            nameKey="category"
            label={({ category, percentage }) => `${category} ${percentage}%`}
            labelLine={false}
          >
            {filtered.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
