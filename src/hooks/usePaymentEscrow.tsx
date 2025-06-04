
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EscrowPayment {
  shipmentId: string;
  shipperId: string;
  transporterId: string;
  totalAmount: number;
}

export const usePaymentEscrow = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createEscrowPayment = async (payment: EscrowPayment) => {
    try {
      setLoading(true);

      // Calculate platform commission (15% for local, 10% for international)
      const platformCommissionRate = 0.15; // Default to local rate
      const platformCommission = payment.totalAmount * platformCommissionRate;
      const transporterPayout = payment.totalAmount - platformCommission;

      const { data, error } = await supabase
        .from('payments_escrow')
        .insert({
          shipment_id: payment.shipmentId,
          shipper_id: payment.shipperId,
          transporter_id: payment.transporterId,
          total_amount: payment.totalAmount,
          platform_commission: platformCommission,
          transporter_payout: transporterPayout,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Payment Escrowed",
        description: "Payment has been held in escrow until delivery completion"
      });

      return data;
    } catch (error) {
      console.error('Error creating escrow payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const releaseEscrowPayment = async (escrowId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('payments_escrow')
        .update({
          payment_status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('id', escrowId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Payment Released",
        description: "Payment has been released to the transporter"
      });

      return data;
    } catch (error) {
      console.error('Error releasing escrow payment:', error);
      toast({
        title: "Error",
        description: "Failed to release payment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEscrowPayment,
    releaseEscrowPayment,
    loading
  };
};
