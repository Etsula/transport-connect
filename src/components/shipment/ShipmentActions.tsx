
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Package } from "lucide-react";

interface ShipmentActionsProps {
  shipment: any;
  onStatusUpdate: () => void;
}

const ShipmentActions = ({ shipment, onStatusUpdate }: ShipmentActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCancelShipment = async () => {
    try {
      const { error } = await supabase
        .from("shipments")
        .update({ status: "cancelled" })
        .eq("id", shipment.id);
        
      if (error) throw error;
      
      toast({
        title: "Shipment cancelled",
        description: "The shipment has been cancelled successfully",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error cancelling shipment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel shipment",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("shipments")
        .update({ status: newStatus })
        .eq("id", shipment.id);
        
      if (error) throw error;
      
      const statusMessages = {
        in_transit: "The shipment is now in transit",
        delivered: "The shipment has been marked as delivered"
      };
      
      toast({
        title: "Status updated",
        description: statusMessages[newStatus as keyof typeof statusMessages],
      });
      
      onStatusUpdate();
    } catch (error: any) {
      console.error("Error updating shipment status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipment Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shipment.status === "open" && (
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleCancelShipment}
            >
              Cancel Shipment
            </Button>
          )}
        </CardContent>
      </Card>

      {shipment.status === "assigned" && (
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full"
              onClick={() => handleStatusUpdate("in_transit")}
            >
              <Truck className="mr-2 h-4 w-4" />
              Mark as In Transit
            </Button>
          </CardContent>
        </Card>
      )}
      
      {shipment.status === "in_transit" && (
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full"
              onClick={() => handleStatusUpdate("delivered")}
            >
              <Package className="mr-2 h-4 w-4" />
              Mark as Delivered
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentActions;
