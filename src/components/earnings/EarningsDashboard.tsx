
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Clock, CreditCard, Smartphone } from 'lucide-react';

interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  pendingPayouts: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
}

interface PayoutMethod {
  id: string;
  type: 'mpesa' | 'bank';
  details: string;
  isDefault: boolean;
}

const EarningsDashboard = () => {
  const [earnings] = useState<EarningsData>({
    totalEarnings: 45230,
    availableBalance: 12500,
    pendingPayouts: 3200,
    todayEarnings: 850,
    weeklyEarnings: 5600,
    monthlyEarnings: 18900
  });

  const [payoutMethods] = useState<PayoutMethod[]>([
    {
      id: '1',
      type: 'mpesa',
      details: '+254712345678',
      isDefault: true
    },
    {
      id: '2',
      type: 'bank',
      details: 'KCB Bank - ****1234',
      isDefault: false
    }
  ]);

  const recentTransactions = [
    { id: '1', date: '2024-01-15', amount: 450, type: 'delivery', description: 'Delivery to Karen' },
    { id: '2', date: '2024-01-15', amount: 200, type: 'referral', description: 'Referral bonus - John K.' },
    { id: '3', date: '2024-01-14', amount: 680, type: 'delivery', description: 'International pickup' },
    { id: '4', date: '2024-01-14', amount: 320, type: 'delivery', description: 'Multiple stops' },
  ];

  const requestPayout = () => {
    // Implementation for payout request
    console.log('Requesting payout...');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold">KSh {earnings.availableBalance.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Earnings</p>
                <p className="text-2xl font-bold">KSh {earnings.todayEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">KSh {earnings.monthlyEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">KSh {earnings.pendingPayouts.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+KSh {transaction.amount}</p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Request Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-medium">Available for withdrawal</p>
                    <p className="text-2xl font-bold text-green-600">KSh {earnings.availableBalance.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Payout Method</p>
                    {payoutMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {method.type === 'mpesa' ? (
                            <Smartphone className="h-5 w-5 text-green-600" />
                          ) : (
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          )}
                          <span>{method.details}</span>
                        </div>
                        {method.isDefault && <Badge>Default</Badge>}
                      </div>
                    ))}
                  </div>

                  <Button onClick={requestPayout} className="w-full" size="lg">
                    Request Payout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Referral Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Active Referrals</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">KSh 3,200</p>
                    <p className="text-sm text-muted-foreground">Referral Earnings</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">12%</p>
                    <p className="text-sm text-muted-foreground">Of Total Income</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarningsDashboard;
