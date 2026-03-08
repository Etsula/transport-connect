
import React from 'react';
import EarningsDashboard from '@/components/earnings/EarningsDashboard';
import Disclaimers from '@/components/disclaimers/Disclaimers';

const TransporterEarnings = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Earnings Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your earnings, request payouts, and manage your income
            </p>
          </div>
          <EarningsDashboard />
          <div className="mt-8">
            <Disclaimers type="liability" compact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterEarnings;
