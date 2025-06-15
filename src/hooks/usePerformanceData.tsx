
import { useState, useEffect } from 'react';
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

export const usePerformanceData = () => {
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

  return {
    metrics,
    loading,
    generateMetrics,
    refreshMetrics: fetchPerformanceMetrics
  };
};
