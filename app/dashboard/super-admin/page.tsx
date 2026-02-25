'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { useRole } from '@/hooks/use-role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, ActivitySquare, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function SuperAdminDashboard() {
  const { user, loading } = useAuth();
  const { isSuperAdmin } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      router.push('/dashboard/user');
    }
  }, [isSuperAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">
                Super Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user?.full_name}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                // Sign out logic
                router.push('/login');
              }}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">15</div>
              <p className="text-xs text-muted-foreground mt-1">System administrators</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Support Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">28</div>
              <p className="text-xs text-muted-foreground mt-1">Active support agents</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-semibold text-green-600">Operational</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">All systems running</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Admins */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>Manage Admins</CardTitle>
                  <CardDescription>Create, edit, and manage administrator accounts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Manage Admin Users
              </Button>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Settings className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide settings and policies</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                System Configuration
              </Button>
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ActivitySquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Activity Logs</CardTitle>
                  <CardDescription>View all system activity and audit trails</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                View Activity
              </Button>
            </CardContent>
          </Card>

          {/* Security Alerts */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>Monitor and manage security events</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-slate-600 hover:bg-slate-700">
                Security Center
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-2 border-primary/20 mt-8">
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest actions performed in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">User Account Created</p>
                  <p className="text-sm text-muted-foreground">user@example.com - 2 hours ago</p>
                </div>
                <div className="text-sm text-green-600 font-medium">Success</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Role Changed</p>
                  <p className="text-sm text-muted-foreground">admin@example.com to Admin - 5 hours ago</p>
                </div>
                <div className="text-sm text-blue-600 font-medium">Modified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
