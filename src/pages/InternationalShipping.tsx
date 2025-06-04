
import React from 'react';
import InternationalVerification from '@/components/international/InternationalVerification';

const InternationalShipping = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">International Shipping</h1>
            <p className="text-gray-600 mt-2">
              Get verified to handle international shipments and increase your earning potential
            </p>
          </div>
          <InternationalVerification />
        </div>
      </div>
    </div>
  );
};

export default InternationalShipping;
