import { useState } from 'react';
import { useUsers, useDeleteUser, useRestoreUser } from '../../hooks/useUsers';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UserForm from './UserForm';
import { formatDate } from '../../utils/formatDate';

const roleBadge = {
  admin: 'bg-purple-100 text-purple-700',
  analyst: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-700',
};

export default function UserList() {
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useUsers(filters);
  const deleteUser = useDeleteUser();
  const restoreUser = useRestoreUser();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-500 text-sm mt-1">{data?.pagination?.total || 0} total users</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}>
          + New User
        </button>
      </div>

      {/* Filters */}
      <div className="card !p-4 flex flex-wrap gap-3">
        <select className="input w-auto" onChange={(e) => setFilters((f) => ({ ...f, page: 1, role: e.target.value || undefined }))}>
          <option value="">All Roles</option>
          <option value="viewer">Viewer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
        <select className="input w-auto" onChange={(e) => setFilters((f) => ({ ...f, page: 1, is_active: e.target.value || undefined }))}>
          <option value="">All Statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="card !p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner className="h-40" />
        ) : !data?.data?.length ? (
          <div className="flex items-center justify-center h-40 text-gray-400">No users found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.data.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.deletedAt ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${roleBadge[user.role?.name || user.role] || 'bg-gray-100 text-gray-700'}`}>
                          {user.role?.name || user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.deletedAt ? (
                          <span className="badge bg-gray-100 text-gray-500">Deleted</span>
                        ) : user.is_active ? (
                          <span className="badge bg-green-100 text-green-700">Active</span>
                        ) : (
                          <span className="badge bg-red-100 text-red-700">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {!user.deletedAt && (
                          <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(user); setShowModal(true); }}>
                            Edit
                          </button>
                        )}
                        {!user.deletedAt ? (
                          <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Delete user?')) deleteUser.mutate(user.id); }}>
                            Delete
                          </button>
                        ) : (
                          <button className="btn btn-secondary btn-sm" onClick={() => restoreUser.mutate(user.id)}>
                            Restore
                          </button>
                        )}
                      </td>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit User' : 'New User'}>
        <UserForm user={editing} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
