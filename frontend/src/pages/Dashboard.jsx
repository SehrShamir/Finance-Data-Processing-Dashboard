import { useSummary, useTrends, useCategories, useRecent } from '../hooks/useDashboard';
import SummaryCard from '../components/common/SummaryCard';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

export default function Dashboard() {
  const { data: summary, isLoading: sumLoading } = useSummary();
  const { data: trends, isLoading: trendsLoading } = useTrends({ months: 6 });
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: recent, isLoading: recentLoading } = useRecent();

  const isLoading = sumLoading || trendsLoading || catLoading || recentLoading;

  if (isLoading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Income"
          value={formatCurrency(summary?.totalIncome || 0)}
          icon="💰"
          color="green"
          subtitle={`${summary?.incomeCount || 0} transactions`}
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary?.totalExpense || 0)}
          icon="💸"
          color="red"
          subtitle={`${summary?.expenseCount || 0} transactions`}
        />
        <SummaryCard
          title="Net Balance"
          value={formatCurrency(summary?.netBalance || 0)}
          icon={summary?.netBalance >= 0 ? '📈' : '📉'}
          color={summary?.netBalance >= 0 ? 'blue' : 'red'}
        />
        <SummaryCard
          title="Transactions"
          value={summary?.transactionCount || 0}
          icon="📋"
          color="purple"
          subtitle="Total recorded"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendChart data={trends || []} />
        <IncomeExpenseBarChart data={trends || []} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={categories || []} type="expense" />
        <CategoryPieChart data={categories || []} type="income" />
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        {!recent?.length ? (
          <p className="text-gray-400 text-sm">No transactions yet</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{tx.type === 'income' ? '⬆' : '⬇'}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{tx.category.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-400">{formatDate(tx.transaction_date)}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
