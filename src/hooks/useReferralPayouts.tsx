
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useReferralPayouts = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const processPendingPayouts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions
        .invoke('process-referral-payouts');

      if (error) throw error;

      toast({
        title: "Payouts Processed",
        description: `${data.processed} referral payouts have been processed`
      });

      return data;
    } catch (error) {
      console.error('Error processing payouts:', error);
      toast({
        title: "Payout Error",
        description: "Failed to process referral payouts",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserPayouts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('referral_payouts')
        .select(`
          *,
          referrals (
            referral_type,
            referred_user_id
          )
        `)
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user payouts:', error);
      throw error;
    }
  };

  return {
    processPendingPayouts,
    getUserPayouts,
    loading
  };
};
