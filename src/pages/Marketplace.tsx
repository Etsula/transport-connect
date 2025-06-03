
import React from 'react';
import ShipmentMarketplace from '@/components/marketplace/ShipmentMarketplace';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <ShipmentMarketplace />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
