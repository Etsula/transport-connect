
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ReferralChainMember {
  id: string;
  user_id: string;
  referrer_id: string;
  chain_level: number;
  is_qualified: boolean;
  total_deliveries: number;
  average_rating: number;
  can_refer: boolean;
  max_referrals: number;
  current_referrals: number;
}

interface ChainDistance {
  distance: number;
  can_access: boolean;
  reason?: string;
}

export const useReferralChain = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [chainMembers, setChainMembers] = useState<ReferralChainMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData.id) {
      fetchReferralChain();
    }
  }, [userData.id]);

  const fetchReferralChain = async () => {
    if (!userData.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('referral_chains')
        .select('*')
        .eq('user_id', userData.id);

      if (error) throw error;
      setChainMembers(data || []);
    } catch (error) {
      console.error('Error fetching referral chain:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkChainDistance = async (targetUserId: string): Promise<ChainDistance> => {
    try {
      const { data, error } = await supabase.rpc('get_referral_chain_distance', {
        target_user_id: targetUserId,
        source_user_id: userData.id
      });

      if (error) throw error;

      const distance = data as number;
      
      if (distance === -1) {
        return { distance: -1, can_access: false, reason: 'Not in referral chain' };
      }
      
      if (distance > 5) {
        return { distance, can_access: false, reason: 'Too far in referral chain (max 5 levels)' };
      }

      return { distance, can_access: true };
    } catch (error) {
      console.error('Error checking chain distance:', error);
      return { distance: -1, can_access: false, reason: 'Error checking distance' };
    }
  };

  const canSendToRegion = async (targetUserId: string, countryCode: string): Promise<boolean> => {
    try {
      // Check if user has regional access
      const { data: access, error: accessError } = await supabase
        .from('regional_access')
        .select('*')
        .eq('user_id', userData.id)
        .eq('country_code', countryCode)
        .eq('is_active', true)
        .single();

      if (accessError && accessError.code !== 'PGRST116') throw accessError;

      if (!access) {
        return false; // No access to this region
      }

      // Check chain distance
      const chainCheck = await checkChainDistance(targetUserId);
      
      if (!chainCheck.can_access) {
        return false;
      }

      // Check if distance is within allowed limit for this region
      return chainCheck.distance <= (access.max_chain_distance || 5);
    } catch (error) {
      console.error('Error checking regional access:', error);
      return false;
    }
  };

  const addToReferralChain = async (referredUserId: string, referralCode: string) => {
    try {
      // Check if user is qualified to refer
      const { data: qualifications, error: qualError } = await supabase
        .from('referral_qualifications')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (qualError || !qualifications?.is_highly_rated) {
        toast({
          title: "Cannot refer",
          description: "You need 10+ deliveries and 5.0 rating to refer others",
          variant: "destructive"
        });
        return false;
      }

      // Get referrer's chain info
      const { data: referrerChain, error: chainError } = await supabase
        .from('referral_chains')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (chainError && chainError.code !== 'PGRST116') throw chainError;

      const newLevel = referrerChain ? referrerChain.chain_level + 1 : 1;
      
      if (newLevel > 5) {
        toast({
          title: "Chain limit reached",
          description: "Maximum referral chain depth is 5 levels",
          variant: "destructive"
        });
        return false;
      }

      // Create chain entry for referred user
      const chainId = referrerChain?.chain_id || crypto.randomUUID();
      
      const { error: insertError } = await supabase
        .from('referral_chains')
        .insert({
          chain_id: chainId,
          user_id: referredUserId,
          referrer_id: userData.id,
          chain_level: newLevel,
          referred_by_code: referralCode,
          is_qualified: false, // Will be updated when they complete 10 deliveries
          total_deliveries: 0,
          average_rating: 0,
          can_refer: false
        });

      if (insertError) throw insertError;

      toast({
        title: "User added to chain",
        description: "Successfully added to your referral chain"
      });

      fetchReferralChain();
      return true;
    } catch (error) {
      console.error('Error adding to referral chain:', error);
      toast({
        title: "Failed to add user",
        description: "Could not add user to referral chain",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateQualifications = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('update_referral_qualifications', {
        user_id: userId
      });

      if (error) throw error;
      return data as boolean;
    } catch (error) {
      console.error('Error updating qualifications:', error);
      return false;
    }
  };

  return {
    chainMembers,
    loading,
    checkChainDistance,
    canSendToRegion,
    addToReferralChain,
    updateQualifications,
    refreshChain: fetchReferralChain
  };
};
