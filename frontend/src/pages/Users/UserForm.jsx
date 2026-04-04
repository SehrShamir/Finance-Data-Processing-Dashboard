import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUser, useUpdateUser } from '../../hooks/useUsers';

const createSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['viewer', 'analyst', 'admin']),
});

const updateSchema = z.object({
  name: z.string().min(2).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
  is_active: z.boolean().optional(),
});

export default function UserForm({ user, onClose }) {
  const isEditing = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEditing ? updateSchema : createSchema),
    defaultValues: user
      ? { name: user.name, email: user.email, role: user.role?.name || user.role, is_active: user.is_active }
      : { role: 'viewer' },
  });

  const onSubmit = async (data) => {
    if (isEditing) {
      const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''));
      await updateUser.mutateAsync({ id: user.id, data: clean });
    } else {
      await createUser.mutateAsync(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Name</label>
        <input {...register('name')} type="text" className={`input ${errors.name ? 'input-error' : ''}`} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="label">Email</label>
        <input {...register('email')} type="email" className={`input ${errors.email ? 'input-error' : ''}`} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {!isEditing && (
        <div>
          <label className="label">Password</label>
          <input {...register('password')} type="password" className={`input ${errors.password ? 'input-error' : ''}`} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
      )}

      <div>
        <label className="label">Role</label>
        <select {...register('role')} className="input">
          <option value="viewer">Viewer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {isEditing && (
        <div className="flex items-center gap-2">
          <input {...register('is_active')} type="checkbox" id="is_active" className="rounded" />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
          {isSubmitting ? 'Saving…' : isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
