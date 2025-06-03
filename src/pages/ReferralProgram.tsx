
import React from 'react';
import ReferralDashboard from '@/components/referral/ReferralDashboard';

const ReferralProgram = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Referral Program</h1>
            <p className="text-gray-600 mt-2">
              Earn money by referring new users to iShip platform
            </p>
          </div>
          <ReferralDashboard />
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
