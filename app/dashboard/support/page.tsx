'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { useRole } from '@/hooks/use-role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, CheckCircle, User } from 'lucide-react';
import { useEffect } from 'react';

export default function SupportDashboard() {
  const { user, loading } = useAuth();
  const { isSupport } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isSupport) {
      router.push('/dashboard/user');
    }
  }, [isSupport, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSupport) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-green-700">
                Support Center
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-green-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">12</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">8</div>
              <p className="text-xs text-muted-foreground mt-1">Being resolved</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-teal-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600">15</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully closed</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-600">12 min</div>
              <p className="text-xs text-muted-foreground mt-1">Response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Support Tickets */}
          <Card className="border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>View and manage customer support tickets</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                View Tickets
              </Button>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card className="border-2 border-emerald-200 hover:border-emerald-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>Urgent requests needing immediate attention</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                View Pending
              </Button>
            </CardContent>
          </Card>

          {/* Resolved Cases */}
          <Card className="border-2 border-teal-200 hover:border-teal-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <CardTitle>Resolved Cases</CardTitle>
                  <CardDescription>View completed support cases</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                View Resolved
              </Button>
            </CardContent>
          </Card>

          {/* User Lookup */}
          <Card className="border-2 border-slate-200 hover:border-slate-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <CardTitle>User Lookup</CardTitle>
                  <CardDescription>Search and view customer information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-slate-600 hover:bg-slate-700">
                Search Users
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Support Activity */}
        <Card className="border-2 border-green-200 mt-8">
          <CardHeader>
            <CardTitle>Recent Support Activity</CardTitle>
            <CardDescription>Latest ticket updates and resolutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Ticket #1001: Connection Issue</p>
                  <p className="text-sm text-muted-foreground">customer@example.com - 30 minutes ago</p>
                </div>
                <div className="text-sm text-amber-600 font-medium">In Progress</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Ticket #1000: Billing Question</p>
                  <p className="text-sm text-muted-foreground">user@example.com - 1 hour ago</p>
                </div>
                <div className="text-sm text-green-600 font-medium">Resolved</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Ticket #999: Account Verification</p>
                  <p className="text-sm text-muted-foreground">newuser@example.com - 2 hours ago</p>
                </div>
                <div className="text-sm text-blue-600 font-medium">Awaiting Reply</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
