
import React from 'react';
import PerformanceTracker from '@/components/performance/PerformanceTracker';

const PerformanceDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Performance Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Track your delivery performance and commission metrics
            </p>
          </div>
          <PerformanceTracker />
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
