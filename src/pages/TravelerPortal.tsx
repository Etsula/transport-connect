
import React from 'react';
import TravelerManagement from '@/components/travelers/TravelerManagement';
import MultiLevelReferralManager from '@/components/referral/MultiLevelReferralManager';

const TravelerPortal = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Traveler Portal</h1>
            <p className="text-gray-600 mt-2">
              Manage your traveler profile and referral network
            </p>
          </div>
          
          <TravelerManagement />
          <MultiLevelReferralManager />
        </div>
      </div>
    </div>
  );
};

export default TravelerPortal;
