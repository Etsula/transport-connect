
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TrackingUpdate {
  id: string;
  shipment_id: string;
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  created_at: string;
}

export const useShipmentTracking = (shipmentId?: string) => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [trackingHistory, setTrackingHistory] = useState<TrackingUpdate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shipmentId) {
      fetchTrackingHistory();
      setupRealtimeTracking();
    }
  }, [shipmentId]);

  const fetchTrackingHistory = async () => {
    if (!shipmentId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shipment_tracking')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrackingHistory(data || []);
    } catch (error) {
      console.error('Error fetching tracking history:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeTracking = () => {
    if (!shipmentId) return;

    const channel = supabase
      .channel(`tracking-${shipmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shipment_tracking',
          filter: `shipment_id=eq.${shipmentId}`
        },
        (payload) => {
          const newUpdate = payload.new as TrackingUpdate;
          setTrackingHistory(prev => [newUpdate, ...prev]);
          
          toast({
            title: "Shipment Update",
            description: `Status: ${newUpdate.status}${newUpdate.location ? ` at ${newUpdate.location}` : ''}`
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addTrackingUpdate = async (update: {
    status: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
  }) => {
    if (!shipmentId) return;

    try {
      const { data, error } = await supabase
        .from('shipment_tracking')
        .insert({
          shipment_id: shipmentId,
          updated_by: userData.id,
          ...update
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Tracking Updated",
        description: "Shipment tracking has been updated successfully"
      });

      return data;
    } catch (error) {
      console.error('Error adding tracking update:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update shipment tracking",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    trackingHistory,
    loading,
    addTrackingUpdate,
    refreshTracking: fetchTrackingHistory
  };
};
