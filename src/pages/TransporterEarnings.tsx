
import React from 'react';
import EarningsDashboard from '@/components/earnings/EarningsDashboard';

const TransporterEarnings = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Earnings Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Track your earnings, request payouts, and manage your income
            </p>
          </div>
          <EarningsDashboard />
        </div>
      </div>
    </div>
  );
};

export default TransporterEarnings;
