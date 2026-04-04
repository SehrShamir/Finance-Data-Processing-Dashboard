import { useState } from 'react';
import { useTransactions, useDeleteTransaction } from '../../hooks/useTransactions';
import { useAuth } from '../../auth/AuthContext';
import { ROLES, TRANSACTION_TYPES, ALL_CATEGORIES } from '../../utils/constants';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TransactionForm from './TransactionForm';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function TransactionList() {
  const { role } = useAuth();
  const canWrite = role === ROLES.ANALYST || role === ROLES.ADMIN;

  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useTransactions(filters);
  const deleteTransaction = useDeleteTransaction();

  const setFilter = (key, value) => setFilters((f) => ({ ...f, page: 1, [key]: value || undefined }));

  const handleDelete = (tx) => {
    if (confirm(`Delete this ${tx.type} transaction of ${formatCurrency(tx.amount)}?`)) {
      deleteTransaction.mutate(tx.id);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="text-gray-500 text-sm mt-1">
            {data?.pagination?.total || 0} total records
          </p>
        </div>
        {canWrite && (
          <button className="btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}>
            + New Transaction
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card !p-4 flex flex-wrap gap-3">
        <select
          className="input w-auto"
          onChange={(e) => setFilter('type', e.target.value)}
        >
          <option value="">All Types</option>
          {TRANSACTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select
          className="input w-auto"
          onChange={(e) => setFilter('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <input
          type="date"
          className="input w-auto"
          onChange={(e) => setFilter('start_date', e.target.value)}
          placeholder="From"
        />
        <input
          type="date"
          className="input w-auto"
          onChange={(e) => setFilter('end_date', e.target.value)}
          placeholder="To"
        />
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner className="h-40" />
        ) : !data?.data?.length ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p>No transactions found</p>
            {canWrite && (
              <button className="btn-primary mt-3" onClick={() => setShowModal(true)}>
                Create first transaction
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    {canWrite && <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.data.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{formatDate(tx.transaction_date)}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{tx.category.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{tx.description || '—'}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      {canWrite && (
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => { setEditing(tx); setShowModal(true); }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(tx)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              pagination={data.pagination}
              onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Transaction' : 'New Transaction'}
      >
        <TransactionForm transaction={editing} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
