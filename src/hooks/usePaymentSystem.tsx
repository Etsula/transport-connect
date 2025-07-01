
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const usePaymentSystem = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userData } = useAuth();

  const createEscrowPayment = async (shipmentId: string, amount: number, platformCommission: number) => {
    setLoading(true);
    try {
      const transporterPayout = amount - platformCommission;
      
      const { data, error } = await supabase
        .from('payments_escrow')
        .insert({
          shipment_id: shipmentId,
          shipper_id: userData.id,
          total_amount: amount,
          platform_commission: platformCommission,
          transporter_payout: transporterPayout,
          payment_status: 'escrowed',
          escrowed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Payment Escrowed",
        description: "Payment has been secured in escrow"
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const releaseEscrowPayment = async (escrowId: string, transporterId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('payments_escrow')
        .update({
          transporter_id: transporterId,
          payment_status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('id', escrowId);

      if (error) throw error;

      toast({
        title: "Payment Released",
        description: "Payment has been released to the transporter"
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Release Failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('payments_escrow')
        .select(`
          *,
          shipments(title, pickup_location, delivery_location)
        `)
        .or(`shipper_id.eq.${userData.id},transporter_id.eq.${userData.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message, data: [] };
    }
  };

  return {
    createEscrowPayment,
    releaseEscrowPayment,
    getPaymentHistory,
    loading
  };
};
