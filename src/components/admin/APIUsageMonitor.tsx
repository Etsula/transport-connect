
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface UsageMetrics {
  totalRequests: number;
  successfulRequests: number;
  errorRequests: number;
  averageResponseTime: number;
  topEndpoints: Array<{ endpoint: string; requests: number }>;
  revenueGenerated: number;
  activeClients: number;
}

const APIUsageMonitor = () => {
  // Mock data - replace with real data from your API
  const metrics: UsageMetrics = {
    totalRequests: 125430,
    successfulRequests: 122100,
    errorRequests: 3330,
    averageResponseTime: 245,
    topEndpoints: [
      { endpoint: '/deliveries', requests: 45230 },
      { endpoint: '/track', requests: 38920 },
      { endpoint: '/riders/available', requests: 21150 },
      { endpoint: '/payments/mpesa', requests: 15680 },
      { endpoint: '/pricing/calculate', requests: 4450 }
    ],
    revenueGenerated: 2750000,
    activeClients: 47
  };

  const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <Progress value={successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-15ms</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {(metrics.revenueGenerated / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeClients} active clients
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topEndpoints.map((endpoint, index) => {
                const percentage = (endpoint.requests / metrics.totalRequests) * 100;
                return (
                  <div key={endpoint.endpoint}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{endpoint.endpoint}</span>
                      <span className="text-sm">{endpoint.requests.toLocaleString()}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>API Uptime</span>
                <Badge variant="outline" className="text-green-600">99.9%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Database Health</span>
                <Badge variant="outline" className="text-green-600">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Cache Performance</span>
                <Badge variant="outline" className="text-green-600">Optimal</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Error Rate</span>
                <Badge variant="outline" className="text-yellow-600">2.7%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Rate Limit Violations</span>
                <Badge variant="outline" className="text-red-600">12 today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIUsageMonitor;
