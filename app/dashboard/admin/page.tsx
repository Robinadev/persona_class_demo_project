'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { useRole } from '@/hooks/use-role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, BarChart3, Bell } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { isAdmin } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard/user');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-amber-700">
                Administrator Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Welcome, {user?.full_name}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/login')}
              className="border-2"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">892</div>
              <p className="text-xs text-muted-foreground mt-1">Currently online</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">3,456</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reports Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">23</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Users */}
          <Card className="border-2 border-amber-200 hover:border-amber-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle>Manage Users</CardTitle>
                  <CardDescription>View, edit, and manage user accounts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                User Management
              </Button>
            </CardContent>
          </Card>

          {/* Generate Reports */}
          <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create system and transaction reports</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Reports & Analytics
              </Button>
            </CardContent>
          </Card>

          {/* View Analytics */}
          <Card className="border-2 border-red-200 hover:border-red-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View system analytics and statistics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-2 border-slate-200 hover:border-slate-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Bell className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>System alerts and notifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-slate-600 hover:bg-slate-700">
                View Notifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-2 border-amber-200 mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user and system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div>
                  <p className="font-medium">New User Registration</p>
                  <p className="text-sm text-muted-foreground">newuser@example.com - 1 hour ago</p>
                </div>
                <div className="text-sm text-green-600 font-medium">New</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div>
                  <p className="font-medium">Transaction Completed</p>
                  <p className="text-sm text-muted-foreground">Transaction #12345 - 2 hours ago</p>
                </div>
                <div className="text-sm text-blue-600 font-medium">Completed</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div>
                  <p className="font-medium">User Updated Profile</p>
                  <p className="text-sm text-muted-foreground">user@example.com - 3 hours ago</p>
                </div>
                <div className="text-sm text-slate-600 font-medium">Modified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
