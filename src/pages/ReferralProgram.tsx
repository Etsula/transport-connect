
import React from 'react';
import ReferralDashboard from '@/components/referral/ReferralDashboard';
import Disclaimers from '@/components/disclaimers/Disclaimers';

const ReferralProgram = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Referral Program</h1>
            <p className="text-muted-foreground mt-2">
              Earn money by referring new users to iShip platform
            </p>
          </div>
          <ReferralDashboard />
          <div className="mt-8">
            <Disclaimers type="availability" compact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
