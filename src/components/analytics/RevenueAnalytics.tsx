
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Package, Users } from 'lucide-react';

interface RevenueMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  totalDeliveries: number;
  activeUsers: number;
  averageOrderValue: number;
  commissionEarned: number;
}

interface RevenueAnalyticsProps {
  metrics: RevenueMetrics;
}

const RevenueAnalytics = ({ metrics }: RevenueAnalyticsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{metrics.monthlyGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.commissionEarned)}</div>
            <p className="text-xs text-muted-foreground">
              Platform earnings this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDeliveries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Successful deliveries completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Monthly active users
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Subscription Revenue</span>
              <span className="text-sm">{formatCurrency(metrics.totalRevenue * 0.3)}</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Commission Revenue</span>
              <span className="text-sm">{formatCurrency(metrics.commissionEarned)}</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="font-medium">Average Order Value</span>
              <span className="font-medium">{formatCurrency(metrics.averageOrderValue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;
