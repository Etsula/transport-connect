
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface ShipmentBidsProps {
  shipmentId: string;
  onBidAccepted?: () => void;
}

const ShipmentBids = ({ shipmentId, onBidAccepted }: ShipmentBidsProps) => {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingBids, setProcessingBids] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchBids();
  }, [shipmentId]);

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from("bids")
        .select(`
          *,
          profiles:transporter_id(company_name)
        `)
        .eq("shipment_id", shipmentId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setBids(data || []);
    } catch (error: any) {
      console.error("Error fetching bids:", error);
      toast({
        title: "Error",
        description: "Failed to load bids",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    setProcessingBids(prev => ({ ...prev, [bidId]: true }));
    
    try {
      // Update the selected bid status
      const { error: bidError } = await supabase
        .from("bids")
        .update({ status: "accepted" })
        .eq("id", bidId);
      
      if (bidError) throw bidError;
      
      // Mark all other bids for this shipment as rejected
      const { error: otherBidsError } = await supabase
        .from("bids")
        .update({ status: "rejected" })
        .eq("shipment_id", shipmentId)
        .neq("id", bidId);
      
      if (otherBidsError) throw otherBidsError;
      
      // Update the shipment status to assigned
      const { error: shipmentError } = await supabase
        .from("shipments")
        .update({ status: "assigned" })
        .eq("id", shipmentId);
      
      if (shipmentError) throw shipmentError;
      
      toast({
        title: "Bid accepted",
        description: "The transporter has been assigned to this shipment",
      });
      
      // Refresh bids list
      fetchBids();
      
      if (onBidAccepted) {
        onBidAccepted();
      }
    } catch (error: any) {
      console.error("Error accepting bid:", error);
      toast({
        title: "Error",
        description: "Failed to accept bid",
        variant: "destructive",
      });
    } finally {
      setProcessingBids(prev => ({ ...prev, [bidId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md bg-gray-50">
        <p className="text-gray-500">No bids have been received for this shipment yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transporter</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell className="font-medium">
                {bid.profiles?.company_name || "Unknown"}
              </TableCell>
              <TableCell>${bid.amount}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}</TableCell>
              <TableCell>
                <Badge className={
                  bid.status === "pending" ? "bg-yellow-500" :
                  bid.status === "accepted" ? "bg-green-500" :
                  bid.status === "rejected" ? "bg-red-500" :
                  "bg-gray-500"
                }>
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {bid.status === "pending" && (
                  <Button 
                    size="sm"
                    onClick={() => handleAcceptBid(bid.id)}
                    disabled={processingBids[bid.id]}
                  >
                    {processingBids[bid.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Accept"
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShipmentBids;
