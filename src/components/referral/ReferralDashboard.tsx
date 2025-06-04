
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Share2, Users, DollarSign, Copy, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useReferralData } from '@/hooks/useReferralData';
import { useAuth } from '@/hooks/useAuth';

const ReferralDashboard = () => {
  const { toast } = useToast();
  const { authenticated } = useAuth();
  const { stats, loading } = useReferralData();

  // Updated referral types with lower, more sustainable amounts
  const referralTypes = [
    {
      type: 'New Boda Rider',
      commission: 'KSh 100 per signup + 1% of their earnings for 2 months',
      description: 'Refer new motorcycle riders to join the platform'
    },
    {
      type: 'New Shipper',
      commission: 'KSh 50 per signup + 0.5% of their first 5 shipments',
      description: 'Refer businesses or individuals who need shipping services'
    },
    {
      type: 'Truck Driver',
      commission: 'KSh 200 per signup + 1.5% of their earnings for 3 months',
      description: 'Refer truck drivers for larger shipments'
    },
    {
      type: 'Agent Location',
      commission: 'KSh 300 per approved location + 0.5% of all transactions',
      description: 'Refer pickup/drop-off points (shops, offices, etc.)'
    }
  ];

  const copyReferralLink = () => {
    if (!stats.referralCode) {
      toast({
        title: "No Referral Code",
        description: "Please log in to get your referral code",
        variant: "destructive"
      });
      return;
    }

    const link = `https://iship.co.ke/join?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Referral Link Copied!",
      description: "Share this link to start earning commissions"
    });
  };

  const shareWhatsApp = () => {
    if (!stats.referralCode) {
      toast({
        title: "No Referral Code",
        description: "Please log in to get your referral code",
        variant: "destructive"
      });
      return;
    }

    const message = `Join iShip and start earning! Use my referral code: ${stats.referralCode}. Download: https://iship.co.ke/join?ref=${stats.referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  if (!authenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to view your referral dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
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
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Referrals</p>
                <p className="text-2xl font-bold">{stats.activeReferrals}</p>
              </div>
              <Gift className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">KSh {stats.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">KSh {stats.pendingEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input 
              value={stats.referralCode || 'Loading...'} 
              readOnly 
              className="font-mono text-lg"
            />
            <Button onClick={copyReferralLink} variant="outline" disabled={!stats.referralCode}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={shareWhatsApp} className="bg-green-600 hover:bg-green-700" disabled={!stats.referralCode}>
              <Share2 className="h-4 w-4 mr-2" />
              Share WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referralTypes.map((referral, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{referral.type}</h3>
                  <Badge variant="secondary">{referral.commission}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{referral.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
