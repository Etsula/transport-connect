
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Clock, CreditCard, Smartphone } from 'lucide-react';
import { useTransactionData } from '@/hooks/useTransactionData';
import { useReferralData } from '@/hooks/useReferralData';
import { useReferralPayouts } from '@/hooks/useReferralPayouts';

interface PayoutMethod {
  id: string;
  type: 'paypal' | 'bank';
  details: string;
  isDefault: boolean;
}

const EarningsDashboard = () => {
  const { stats: transactionStats, loading: transactionLoading } = useTransactionData();
  const { stats: referralStats } = useReferralData();
  const { processPendingPayouts, loading: payoutLoading } = useReferralPayouts();

  const [payoutMethods] = useState<PayoutMethod[]>([
    {
      id: '1',
      type: 'paypal',
      details: 'PayPal Account',
      isDefault: true
    }
  ]);

  const requestPayout = async () => {
    try {
      await processPendingPayouts();
    } catch (error) {
      console.error('Error requesting payout:', error);
    }
  };

  if (transactionLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold">
                  ${transactionStats.availableBalance.toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold">
                  ${transactionStats.todayEarnings.toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold">
                  ${transactionStats.monthlyEarnings.toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold">
                  ${transactionStats.pendingPayouts.toLocaleString()}
                </p>
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
                {transactionStats.transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.transaction_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        +${transaction.net_amount.toFixed(2)}
                      </p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
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
                    <p className="text-2xl font-bold text-green-600">
                      ${transactionStats.availableBalance.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Payout Method</p>
                    {payoutMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <span>{method.details}</span>
                        </div>
                        {method.isDefault && <Badge>Default</Badge>}
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={requestPayout} 
                    className="w-full" 
                    size="lg"
                    disabled={payoutLoading || transactionStats.availableBalance < 10}
                  >
                    {payoutLoading ? 'Processing...' : 'Request PayPal Payout'}
                  </Button>
                  
                  {transactionStats.availableBalance < 10 && (
                    <p className="text-sm text-muted-foreground">
                      Minimum payout amount is $10
                    </p>
                  )}
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
                    <p className="text-2xl font-bold">{referralStats.activeReferrals}</p>
                    <p className="text-sm text-muted-foreground">Active Referrals</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">${referralStats.totalEarnings.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Referral Earnings</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">${referralStats.pendingEarnings.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Pending Commission</p>
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
