
import React from 'react';
import GDPRComplianceCenter from '@/components/gdpr/GDPRComplianceCenter';

const GDPRCompliance = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">GDPR Compliance</h1>
            <p className="text-gray-600 mt-2">
              Manage your data privacy rights and requests
            </p>
          </div>
          <GDPRComplianceCenter />
        </div>
      </div>
    </div>
  );
};

export default GDPRCompliance;
