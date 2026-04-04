import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser, restoreUser } from '../api/users.api';
import toast from 'react-hot-toast';

export const useUsers = (params) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create user'),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update user'),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete user'),
  });
};

export const useRestoreUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: restoreUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User restored');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to restore user'),
  });
};
