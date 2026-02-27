'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data: usersData, mutate } = useSWR(
    [`/users`, search, roleFilter, page],
    async () => {
      const response = await adminApi.getUsers(pageSize, page * pageSize, roleFilter || undefined, search || undefined);
      return response.data;
    }
  );

  const users = usersData?.data || [];
  const total = usersData?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      mutate();
      toast.success('User role updated');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDeactivate = async (userId: string) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await adminApi.deactivateUser(userId);
      mutate();
      toast.success('User deactivated');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to deactivate user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Users Management</h1>
        
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg flex-1"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="support">Support</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-slate-900">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-900">Full Name</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-900">Role</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{user.full_name}</td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-3 py-1 border border-slate-300 rounded text-sm"
                  >
                    <option value="user">User</option>
                    <option value="support">Support</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.is_active ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDeactivate(user.id)}
                    disabled={!user.is_active}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {Math.min(page * pageSize + 1, total)} to {Math.min((page + 1) * pageSize, total)} of {total} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 bg-slate-200 text-slate-900 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 bg-slate-200 text-slate-900 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
