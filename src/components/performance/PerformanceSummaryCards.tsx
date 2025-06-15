
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Star, Clock, DollarSign } from 'lucide-react';

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

interface PerformanceSummaryCardsProps {
  metrics: PerformanceMetric[];
}

const PerformanceSummaryCards: React.FC<PerformanceSummaryCardsProps> = ({ metrics }) => {
  const summary = metrics[0] || {
    total_deliveries: 0,
    successful_deliveries: 0,
    average_rating: 0,
    commission_earned: 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Deliveries</p>
              <p className="text-2xl font-bold">{summary.total_deliveries}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold">{summary.average_rating.toFixed(1)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold">
                {summary.total_deliveries ? 
                  Math.round((summary.successful_deliveries / summary.total_deliveries) * 100) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Commission Earned</p>
              <p className="text-2xl font-bold">${summary.commission_earned.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSummaryCards;
