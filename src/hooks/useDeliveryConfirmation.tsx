
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeliveryConfirmation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const confirmDelivery = async (shipmentId: string, deviceInfo?: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to confirm delivery");
      }

      // Insert delivery confirmation
      const { error: confirmError } = await supabase
        .from("delivery_confirmations")
        .insert({
          shipment_id: shipmentId,
          confirmed_by: user.id,
          device_info: deviceInfo || navigator.userAgent,
          status: "confirmed"
        });

      if (confirmError) throw confirmError;

      // Update shipment status to delivered
      const { error: updateError } = await supabase
        .from("shipments")
        .update({ status: "delivered" })
        .eq("id", shipmentId);

      if (updateError) throw updateError;

      toast({
        title: "Delivery Confirmed",
        description: "The shipment has been successfully marked as delivered.",
      });

      return { success: true };
    } catch (error: any) {
      console.error("Delivery confirmation error:", error);
      toast({
        title: "Confirmation Failed",
        description: error.message || "Failed to confirm delivery. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryConfirmation = async (shipmentId: string) => {
    try {
      const { data, error } = await supabase
        .from("delivery_confirmations")
        .select(`
          *,
          profiles(company_name, phone)
        `)
        .eq("shipment_id", shipmentId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { data, error };
    } catch (error: any) {
      console.error("Error fetching delivery confirmation:", error);
      return { data: null, error: error.message };
    }
  };

  return {
    confirmDelivery,
    getDeliveryConfirmation,
    loading
  };
};
