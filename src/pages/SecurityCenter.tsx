
import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoadingCard } from '@/components/ui/loading';
import SecuritySettings from '@/components/security/SecuritySettings';

const SecurityCenter = () => {
  const { authenticated, loading } = useAuthGuard();

  if (loading) {
    return <LoadingCard title="Loading security settings..." />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Security Center</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SecuritySettings />
      </main>
    </div>
  );
};

export default SecurityCenter;
