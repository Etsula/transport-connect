
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface PerformanceMetric {
  id: string;
  metric_type: string;
  metric_value: number;
  period_start: string;
  period_end: string;
  total_deliveries: number;
  successful_deliveries: number;
  average_rating: number;
  commission_earned: number;
}

interface PerformanceMetricsListProps {
  metrics: PerformanceMetric[];
}

const PerformanceMetricsList: React.FC<PerformanceMetricsListProps> = ({ metrics }) => {
  const latestMetrics = metrics.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {latestMetrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">
                  {metric.metric_type.replace('_', ' ')}
                </span>
                <Badge variant="outline">
                  {metric.metric_type === 'customer_satisfaction' 
                    ? `${metric.metric_value}/5.0`
                    : `${metric.metric_value.toFixed(1)}%`
                  }
                </Badge>
              </div>
              
              <Progress 
                value={metric.metric_type === 'customer_satisfaction' 
                  ? (metric.metric_value / 5) * 100
                  : metric.metric_value
                } 
                className="h-2"
              />
              
              <p className="text-sm text-gray-500">
                Period: {new Date(metric.period_start).toLocaleDateString()} - {new Date(metric.period_end).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsList;
