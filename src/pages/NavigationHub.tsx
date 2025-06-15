
import React from 'react';
import TurnByTurnNavigation from '@/components/navigation/TurnByTurnNavigation';
import OfflineMapManager from '@/components/navigation/OfflineMapManager';

const NavigationHub = () => {
  const shipmentId = 'demo-shipment-id'; // In real app, this would come from route params

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Navigation Hub</h1>
            <p className="text-gray-600 mt-2">
              Turn-by-turn navigation and offline maps management
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TurnByTurnNavigation shipmentId={shipmentId} />
            <OfflineMapManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationHub;
