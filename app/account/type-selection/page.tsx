'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { UserRole } from '@/lib/rbac';
import { Building2, Users, Crown } from 'lucide-react';

const accountTypes: Array<{
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  gradient: string;
}> = [
  {
    id: 'user',
    title: 'Individual User',
    description: 'For personal use and individual services',
    icon: <Users className="w-8 h-8" />,
    features: [
      'Personal dashboard',
      'Call services',
      'Money transfers',
      'Top-up management',
      'Transaction history',
    ],
    color: 'border-blue-500',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'admin',
    title: 'Business Account',
    description: 'For businesses and organizations',
    icon: <Building2 className="w-8 h-8" />,
    features: [
      'Business dashboard',
      'Team management',
      'Bulk operations',
      'Advanced analytics',
      'API access',
      'Priority support',
    ],
    color: 'border-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'super_admin',
    title: 'Enterprise',
    description: 'For large-scale operations',
    icon: <Crown className="w-8 h-8" />,
    features: [
      'Full platform access',
      'Custom integrations',
      'Dedicated account manager',
      'Custom billing',
      'White-label options',
      '24/7 support',
    ],
    color: 'border-purple-500',
    gradient: 'from-purple-500 to-purple-600',
  },
];

interface AccountSelectionProps {
  onSelect?: (type: UserRole) => void;
  userEmail?: string;
}

export default function AccountTypeSelectionPage({
  onSelect,
  userEmail,
}: AccountSelectionProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (type: UserRole) => {
    setSelectedType(type);
    toast.success(`Selected ${accountTypes.find(a => a.id === type)?.title}`);
  };

  const handleConfirm = async () => {
    if (!selectedType) {
      toast.error('Please select an account type');
      return;
    }

    setIsLoading(true);

    try {
      // If there's a callback, use it
      if (onSelect) {
        onSelect(selectedType);
      } else {
        // Otherwise, store selection and redirect
        sessionStorage.setItem('selectedAccountType', selectedType);
        router.push('/create-account');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to select account type');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-4000" />

      <div className="relative w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent mb-3">
            Choose Your Account Type
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the account type that best fits your needs. You can upgrade or change your account type later.
          </p>
          {userEmail && (
            <p className="text-sm text-muted-foreground mt-2">
              Account for: <span className="font-semibold text-foreground">{userEmail}</span>
            </p>
          )}
        </div>

        {/* Account Type Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {accountTypes.map((type) => (
            <Card
              key={type.id}
              className={`relative cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                selectedType === type.id
                  ? `${type.color} shadow-2xl scale-105 bg-gradient-to-br ${type.gradient} bg-opacity-5`
                  : 'border-muted-foreground/30 hover:border-primary/50 hover:shadow-lg'
              }`}
              onClick={() => handleSelect(type.id)}
            >
              {selectedType === type.id && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-bl-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.gradient} text-white flex items-center justify-center mb-3`}>
                  {type.icon}
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription className="text-base">{type.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${type.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-6 transition-all ${
                    selectedType === type.id
                      ? `bg-gradient-to-r ${type.gradient} hover:opacity-90 text-white`
                      : 'bg-muted/80 hover:bg-muted text-foreground'
                  }`}
                  onClick={() => handleSelect(type.id)}
                  variant={selectedType === type.id ? 'default' : 'outline'}
                >
                  {selectedType === type.id ? 'Selected' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            className="px-8 border-2"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            className="px-8 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white font-semibold"
            onClick={handleConfirm}
            disabled={!selectedType || isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </Button>
        </div>

        {/* Ethiopian pattern decoration */}
        <div className="mt-12 flex justify-center gap-2">
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
