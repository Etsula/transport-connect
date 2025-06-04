
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  referralCode: string;
}

export const useReferralData = () => {
  const { userData, authenticated } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    referralCode: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authenticated && userData.id) {
      fetchReferralData();
    }
  }, [authenticated, userData.id]);

  const fetchReferralData = async () => {
    try {
      setLoading(true);

      // Fetch user's referral code
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', userData.id)
        .eq('is_active', true)
        .single();

      if (codeError && codeError.code !== 'PGRST116') {
        console.error('Error fetching referral code:', codeError);
      }

      // Fetch referral statistics
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('status, total_earnings, commission_amount')
        .eq('referrer_id', userData.id);

      if (referralsError) {
        console.error('Error fetching referrals:', referralsError);
      }

      // Calculate stats
      const totalReferrals = referralsData?.length || 0;
      const activeReferrals = referralsData?.filter(r => r.status === 'active').length || 0;
      const totalEarnings = referralsData?.reduce((sum, r) => sum + (r.total_earnings || 0), 0) || 0;
      const pendingEarnings = referralsData?.filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + (r.commission_amount || 0), 0) || 0;

      setStats({
        totalReferrals,
        activeReferrals,
        totalEarnings,
        pendingEarnings,
        referralCode: codeData?.code || ''
      });

    } catch (error) {
      console.error('Error in fetchReferralData:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refreshData: fetchReferralData };
};
