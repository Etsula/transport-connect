
import React from 'react';
import { usePerformanceData } from '@/hooks/usePerformanceData';
import PerformanceSummaryCards from './PerformanceSummaryCards';
import PerformanceMetricsList from './PerformanceMetricsList';
import PerformanceEmptyState from './PerformanceEmptyState';
import PerformanceLoadingState from './PerformanceLoadingState';

const PerformanceTracker: React.FC = () => {
  const { metrics, loading, generateMetrics } = usePerformanceData();

  if (loading) {
    return <PerformanceLoadingState />;
  }

  if (metrics.length === 0) {
    return <PerformanceEmptyState onGenerateMetrics={generateMetrics} />;
  }

  return (
    <div className="space-y-6">
      <PerformanceSummaryCards metrics={metrics} />
      <PerformanceMetricsList metrics={metrics} />
    </div>
  );
};

export default PerformanceTracker;
