'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { adminApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const { data: statsData, error: statsError } = useSWR(
    '/analytics/dashboard',
    async () => {
      const response = await adminApi.getDashboardStats();
      return response.data;
    }
  );

  const { data: trendsData } = useSWR(
    '/analytics/transaction-trends',
    async () => {
      const response = await adminApi.getTransactionTrends(30);
      return response.data;
    }
  );

  const { data: rolesData } = useSWR(
    '/analytics/users-by-role',
    async () => {
      const response = await adminApi.getUsersByRole();
      return response.data;
    }
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const stats = statsData?.stats || {};
  const trends = trendsData?.data || [];
  const roles = rolesData?.data || [];

  const COLORS = ['#CE1126', '#F4D03F', '#078930', '#3B82F6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back, {user?.full_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.total_users} icon="👥" />
        <StatCard title="Active Users" value={stats.active_users} icon="✅" />
        <StatCard title="Total Transactions" value={stats.total_transactions} icon="💳" />
        <StatCard title="Total Volume" value={`$${(stats.total_volume || 0).toLocaleString()}`} icon="💰" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Trends */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Transaction Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#CE1126" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Users by Role</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roles}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {roles.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/users" className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">
            Manage Users
          </a>
          <a href="/transactions" className="px-4 py-2 bg-secondary text-black rounded-lg hover:opacity-90">
            View Transactions
          </a>
          <a href="/reports" className="px-4 py-2 bg-tertiary text-white rounded-lg hover:opacity-90">
            Generate Reports
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: any; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
