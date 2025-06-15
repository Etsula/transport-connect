
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PerformanceEmptyStateProps {
  onGenerateMetrics: () => void;
}

const PerformanceEmptyState: React.FC<PerformanceEmptyStateProps> = ({ onGenerateMetrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-gray-500 mb-4">No performance data available</p>
        <button 
          onClick={onGenerateMetrics}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Sample Data
        </button>
      </CardContent>
    </Card>
  );
};

export default PerformanceEmptyState;
