
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Star, Package, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

const PerformanceTracker: React.FC = () => {
  const { userData } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceMetrics();
  }, [userData.id]);

  const fetchPerformanceMetrics = async () => {
    if (!userData.id) return;

    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', userData.id)
        .order('period_end', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMetrics = async () => {
    if (!userData.id) return;

    try {
      // Generate mock performance data for current month
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      const mockMetrics = [
        {
          user_id: userData.id,
          metric_type: 'delivery_time',
          metric_value: 95.5,
          period_start: startDate.toISOString().split('T')[0],
          period_end: endDate.toISOString().split('T')[0],
          total_deliveries: 45,
          successful_deliveries: 43,
          average_rating: 4.8,
          commission_earned: 850.50
        },
        {
          user_id: userData.id,
          metric_type: 'customer_satisfaction',
          metric_value: 4.8,
          period_start: startDate.toISOString().split('T')[0],
          period_end: endDate.toISOString().split('T')[0],
          total_deliveries: 45,
          successful_deliveries: 43,
          average_rating: 4.8,
          commission_earned: 850.50
        },
        {
          user_id: userData.id,
          metric_type: 'completion_rate',
          metric_value: 95.6,
          period_start: startDate.toISOString().split('T')[0],
          period_end: endDate.toISOString().split('T')[0],
          total_deliveries: 45,
          successful_deliveries: 43,
          average_rating: 4.8,
          commission_earned: 850.50
        }
      ];

      const { error } = await supabase
        .from('performance_metrics')
        .insert(mockMetrics);

      if (error) throw error;
      fetchPerformanceMetrics();
    } catch (error) {
      console.error('Error generating metrics:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (metrics.length === 0) {
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
            onClick={generateMetrics}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate Sample Data
          </button>
        </CardContent>
      </Card>
    );
  }

  const latestMetrics = metrics.slice(0, 3);
  const summary = latestMetrics[0] || {};

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold">{summary.total_deliveries || 0}</p>
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
                <p className="text-2xl font-bold">{(summary.average_rating || 0).toFixed(1)}</p>
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
                <p className="text-2xl font-bold">${(summary.commission_earned || 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
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
    </div>
  );
};

export default PerformanceTracker;
