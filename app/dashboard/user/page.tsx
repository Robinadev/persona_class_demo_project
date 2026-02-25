'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Send, History, Settings } from 'lucide-react';
import { useEffect } from 'react';

export default function UserDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Welcome, {user?.full_name || user?.email}
              </h1>
              <p className="text-muted-foreground mt-1">Your personal communication hub</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-2"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Account Balance */}
        <div className="mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Account Balance</CardTitle>
                  <CardDescription>Available credit</CardDescription>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-primary">
                  ETB 2,450.00
                </div>
                <p className="text-sm text-muted-foreground">
                  Last updated: Today at 10:30 AM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Send Money */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Send Money</CardTitle>
                  <CardDescription>Transfer funds internationally</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Start Transfer
              </Button>
            </CardContent>
          </Card>

          {/* Top Up */}
          <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Top Up Balance</CardTitle>
                  <CardDescription>Add credit to your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Add Credit
              </Button>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <History className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Transaction History</CardTitle>
                  <CardDescription>View your past transactions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                View History
              </Button>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="border-2 border-slate-200 hover:border-slate-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Settings className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-slate-600 hover:bg-slate-700">
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Transfer to Addis Ababa</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-ETB 500.00</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Credit Received</p>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+ETB 1,000.00</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Phone Bill Payment</p>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-ETB 250.00</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="border-2 border-primary/20 mt-8 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">💡 Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Keep your account balance topped up to avoid service interruptions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Use our mobile app for instant transfers on the go</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Enable two-factor authentication for enhanced security</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
