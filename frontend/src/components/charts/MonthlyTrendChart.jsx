import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatMonth } from '../../utils/formatDate';

export default function MonthlyTrendChart({ data = [] }) {
  const formatted = data.map((d) => ({
    ...d,
    name: formatMonth(d.month),
  }));

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Trends</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={formatted} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={false} name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
