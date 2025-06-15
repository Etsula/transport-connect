
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ConditionalTracking {
  id: string;
  user_id: string;
  shipment_id?: string | null;
  tracking_level: 'minimal' | 'enhanced' | 'emergency';
  trigger_reason?: string | null;
  activated_at: string;
  deactivated_at?: string | null;
  activated_by?: string | null;
  is_active: boolean;
  metadata?: Record<string, any> | null;
}

export const useConditionalTracking = (shipmentId?: string) => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [trackingStates, setTrackingStates] = useState<ConditionalTracking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData.id) {
      fetchTrackingStates();
      setupRealtimeSubscription();
    }
  }, [userData.id, shipmentId]);

  const fetchTrackingStates = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('conditional_tracking')
        .select('*')
        .eq('user_id', userData.id)
        .eq('is_active', true);

      if (shipmentId) {
        query = query.eq('shipment_id', shipmentId);
      }

      const { data, error } = await query.order('activated_at', { ascending: false });
      if (error) throw error;
      
      // Adjust typing to prevent TypeScript error regarding 'metadata'.
      const typedData: ConditionalTracking[] = (data || []).map((item: any) => ({
        ...item,
        tracking_level: item.tracking_level as 'minimal' | 'enhanced' | 'emergency',
        metadata: (typeof item.metadata === "object" && item.metadata !== null)
          ? item.metadata
          : null
      }));
      
      setTrackingStates(typedData);
    } catch (error) {
      console.error('Error fetching tracking states:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`conditional-tracking-${userData.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conditional_tracking',
          filter: `user_id=eq.${userData.id}`
        },
        () => {
          fetchTrackingStates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const activateEnhancedTracking = async (
    targetUserId: string,
    reason: string,
    shipmentId?: string,
    level: 'enhanced' | 'emergency' = 'enhanced'
  ) => {
    try {
      // Check if enhanced tracking is allowed
      const { data: canTrack, error: checkError } = await supabase
        .rpc('can_enable_enhanced_tracking', {
          target_user_id: targetUserId,
          reason: reason
        });

      if (checkError) throw checkError;

      if (!canTrack) {
        toast({
          title: "Tracking not permitted",
          description: "Enhanced tracking is not allowed for this user",
          variant: "destructive"
        });
        return false;
      }

      // Activate conditional tracking
      const { data, error } = await supabase
        .from('conditional_tracking')
        .insert({
          user_id: targetUserId,
          shipment_id: shipmentId,
          tracking_level: level,
          trigger_reason: reason,
          activated_by: userData.id,
          metadata: {
            activation_context: 'manual',
            ip_address: await getUserIP()
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Log the tracking activation
      await logTrackingAccess('enhanced_tracking_activated', targetUserId, {
        tracking_level: level,
        reason: reason,
        shipment_id: shipmentId
      });

      toast({
        title: "Enhanced tracking activated",
        description: `${level} tracking is now active for this user`
      });

      return data;
    } catch (error) {
      console.error('Error activating enhanced tracking:', error);
      toast({
        title: "Error",
        description: "Failed to activate enhanced tracking",
        variant: "destructive"
      });
      return false;
    }
  };

  const deactivateTracking = async (trackingId: string) => {
    try {
      const { error } = await supabase
        .from('conditional_tracking')
        .update({
          is_active: false,
          deactivated_at: new Date().toISOString()
        })
        .eq('id', trackingId);

      if (error) throw error;

      toast({
        title: "Tracking deactivated",
        description: "Enhanced tracking has been disabled"
      });

      fetchTrackingStates();
    } catch (error) {
      console.error('Error deactivating tracking:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate tracking",
        variant: "destructive"
      });
    }
  };

  const logTrackingAccess = async (
    accessType: string,
    targetUserId: string,
    data: Record<string, any>
  ) => {
    try {
      await supabase.from('tracking_audit').insert({
        user_id: targetUserId,
        shipment_id: shipmentId,
        access_type: accessType,
        accessed_by: userData.id,
        access_reason: data.reason || 'Manual access',
        data_accessed: data,
        ip_address: await getUserIP()
      });
    } catch (error) {
      console.error('Error logging tracking access:', error);
    }
  };

  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  };

  return {
    trackingStates,
    loading,
    activateEnhancedTracking,
    deactivateTracking,
    refreshTrackingStates: fetchTrackingStates
  };
};
