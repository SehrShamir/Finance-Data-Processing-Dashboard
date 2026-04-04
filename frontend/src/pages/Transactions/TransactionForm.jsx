import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { ALL_CATEGORIES, TRANSACTION_TYPES, getCategoriesForType } from '../../utils/constants';
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/useTransactions';

const schema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  transaction_date: z.string().min(1, 'Date is required'),
  description: z.string().max(500).optional(),
});

export default function TransactionForm({ transaction, onClose }) {
  const isEditing = !!transaction;
  const create = useCreateTransaction();
  const update = useUpdateTransaction();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: transaction
      ? {
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          transaction_date: transaction.transaction_date,
          description: transaction.description || '',
        }
      : { type: 'expense', transaction_date: new Date().toISOString().slice(0, 10) },
  });

  const selectedType = watch('type');
  const categories = getCategoriesForType(selectedType);

  const onSubmit = async (data) => {
    if (isEditing) {
      await update.mutateAsync({ id: transaction.id, data });
    } else {
      await create.mutateAsync(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Amount</label>
          <input {...register('amount')} type="number" step="0.01" className={`input ${errors.amount ? 'input-error' : ''}`} placeholder="0.00" />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
        </div>
        <div>
          <label className="label">Type</label>
          <select {...register('type')} className={`input ${errors.type ? 'input-error' : ''}`}>
            {TRANSACTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Category</label>
        <select {...register('category')} className={`input ${errors.category ? 'input-error' : ''}`}>
          <option value="">Select category…</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <label className="label">Date</label>
        <input {...register('transaction_date')} type="date" className={`input ${errors.transaction_date ? 'input-error' : ''}`} />
        {errors.transaction_date && <p className="text-red-500 text-xs mt-1">{errors.transaction_date.message}</p>}
      </div>

      <div>
        <label className="label">Description (optional)</label>
        <textarea {...register('description')} rows={2} className="input" placeholder="Notes…" />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={isSubmitting || create.isPending || update.isPending} className="btn-primary flex-1">
          {isSubmitting ? 'Saving…' : isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
