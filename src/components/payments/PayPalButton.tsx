
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePayPal } from '@/hooks/usePayPal';
import { CreditCard } from 'lucide-react';

interface PayPalButtonProps {
  amount: number;
  shipmentId?: string;
  description?: string;
  currency?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  shipmentId,
  description,
  currency = 'USD',
  onSuccess,
  onError
}) => {
  const { createPayment, loading } = usePayPal();

  const handlePayment = async () => {
    try {
      const result = await createPayment({
        amount,
        currency,
        shipmentId,
        description
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || amount <= 0}
      className="w-full bg-blue-600 hover:bg-blue-700"
      size="lg"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      {loading ? 'Processing...' : `Pay $${amount.toFixed(2)} with PayPal`}
    </Button>
  );
};

export default PayPalButton;
