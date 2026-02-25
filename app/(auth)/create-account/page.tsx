'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/auth-service';
import { createUserProfile } from '@/lib/auth-service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { UserRole } from '@/lib/rbac';

export default function CreateAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'role' | 'complete'>('info');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    accountType: 'user' as UserRole,
  });
  const [loading, setLoading] = useState(false);

  const handleInfoChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    if (!formData.email || !formData.fullName) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setStep('role');
  };

  const handleCreateAccount = async () => {
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        toast.error(authError.message || 'Failed to create account');
        return;
      }

      if (authData?.user?.id) {
        // Create profile with role
        const success = await createUserProfile(
          authData.user.id,
          formData.email,
          formData.fullName,
          formData.accountType
        );

        if (success) {
          toast.success('Account created successfully! Redirecting...');
          setStep('complete');

          // Redirect after delay
          setTimeout(() => {
            const roleRoutes: Record<string, string> = {
              super_admin: '/dashboard/super-admin',
              admin: '/dashboard/admin',
              support: '/dashboard/support',
              user: '/dashboard/user',
            };
            router.push(roleRoutes[formData.accountType] || '/dashboard/user');
          }, 1500);
        } else {
          toast.error('Failed to create user profile');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during account creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-4000" />

      <div className="relative w-full max-w-md">
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <div>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                {step === 'info' && 'Step 1 of 2: Your Information'}
                {step === 'role' && 'Step 2 of 2: Account Type'}
                {step === 'complete' && 'Welcome to Talaritel!'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {step === 'info' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    type="text"
                    placeholder="ስም (Name)"
                    value={formData.fullName}
                    onChange={(e) => handleInfoChange('fullName', e.target.value)}
                    required
                    disabled={loading}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInfoChange('email', e.target.value)}
                    required
                    disabled={loading}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInfoChange('password', e.target.value)}
                    required
                    disabled={loading}
                    className="border-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInfoChange('confirmPassword', e.target.value)}
                    required
                    disabled={loading}
                    className="border-2"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white font-semibold h-11"
                >
                  Next Step
                </Button>
              </form>
            )}

            {step === 'role' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  What type of account would you like to create?
                </p>

                <RadioGroup value={formData.accountType} onValueChange={(value) => handleInfoChange('accountType', value)}>
                  <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-primary/50 cursor-pointer">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="flex-1 cursor-pointer">
                      <div className="font-medium">Regular User</div>
                      <p className="text-xs text-muted-foreground">Access your personal dashboard and services</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-primary/50 cursor-pointer">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex-1 cursor-pointer">
                      <div className="font-medium">Administrator</div>
                      <p className="text-xs text-muted-foreground">Manage users and system operations</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border-2 rounded-lg hover:border-primary/50 cursor-pointer">
                    <RadioGroupItem value="support" id="support" />
                    <Label htmlFor="support" className="flex-1 cursor-pointer">
                      <div className="font-medium">Support Staff</div>
                      <p className="text-xs text-muted-foreground">Provide customer support services</p>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('info')}
                    disabled={loading}
                    className="flex-1 border-2"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateAccount}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Account Created!</h3>
                <p className="text-sm text-muted-foreground">
                  Welcome to Talaritel. Redirecting to your dashboard...
                </p>
              </div>
            )}

            {step !== 'complete' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ethiopian pattern decoration */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-600" />
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
