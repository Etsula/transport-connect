
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSystemSettings } from '@/hooks/useSystemSettings';

interface PayPalPayment {
  amount: number;
  currency?: string;
  shipmentId?: string;
  description?: string;
  isInternational?: boolean;
}

export const usePayPal = () => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const { getCommissionRate, getReferralCommissionRate } = useSystemSettings();
  const [loading, setLoading] = useState(false);

  const createPayment = async (payment: PayPalPayment) => {
    try {
      setLoading(true);

      // Calculate commissions using system settings
      const platformCommissionRate = getCommissionRate(payment.isInternational);
      const platformCommission = payment.amount * platformCommissionRate;
      
      // Calculate referral commission if user was referred
      const { data: referralData } = await supabase
        .from('referrals')
        .select('commission_percentage, referrer_id')
        .eq('referred_user_id', userData.id)
        .eq('status', 'active')
        .single();

      const referralCommissionRate = referralData 
        ? (referralData.commission_percentage / 100)
        : getReferralCommissionRate();

      const referralCommission = referralData 
        ? payment.amount * referralCommissionRate
        : 0;

      const netAmount = payment.amount - platformCommission - referralCommission;

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userData.id,
          shipment_id: payment.shipmentId,
          amount: payment.amount,
          currency: payment.currency || 'USD',
          platform_commission: platformCommission,
          referral_commission: referralCommission,
          net_amount: netAmount,
          transaction_type: 'payment',
          status: 'pending'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Call edge function to create PayPal order
      const { data: orderData, error: orderError } = await supabase.functions
        .invoke('create-paypal-order', {
          body: {
            amount: payment.amount,
            currency: payment.currency || 'USD',
            transactionId: transaction.id,
            description: payment.description || 'iShip Payment'
          }
        });

      if (orderError) throw orderError;

      // Update transaction with PayPal order ID
      await supabase
        .from('transactions')
        .update({ paypal_order_id: orderData.id })
        .eq('id', transaction.id);

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userData.id,
          title: 'Payment Initiated',
          message: `Payment of $${payment.amount} has been initiated`,
          type: 'info',
          related_id: transaction.id
        });

      // Redirect to PayPal approval URL
      const approvalUrl = orderData.links.find((link: any) => link.rel === 'approve')?.href;
      if (approvalUrl) {
        window.location.href = approvalUrl;
      }

      return orderData;
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const capturePayment = async (orderId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions
        .invoke('capture-paypal-payment', {
          body: { orderId }
        });

      if (error) throw error;

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully"
      });

      // Create success notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userData.id,
          title: 'Payment Completed',
          message: 'Your payment has been successfully processed',
          type: 'success'
        });

      return data;
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please contact support.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    capturePayment,
    loading
  };
};
