
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
import { Loader2, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import TransporterProfile from "@/components/TransporterProfile";

interface ShipmentBidsProps {
  shipmentId: string;
  onBidAccepted?: () => void;
}

interface Bid {
  id: string;
  shipment_id: string;
  transporter_id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    company_name: string;
    id: string;
  };
  verification?: {
    status: string;
  };
  averageRating?: number | null;
}

const ShipmentBids = ({ shipmentId, onBidAccepted }: ShipmentBidsProps) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingBids, setProcessingBids] = useState<Record<string, boolean>>({});
  const [selectedTransporter, setSelectedTransporter] = useState<string | null>(null);
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
          profiles:transporter_id(
            company_name,
            id
          ),
          verification:transporter_id(
            status
          )
        `)
        .eq("shipment_id", shipmentId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Fetch transporter ratings
      if (data && data.length > 0) {
        const transporterIds = data.map(bid => bid.transporter_id);
        
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("reviews")
          .select("reviewed_id, rating")
          .in("reviewed_id", transporterIds);
          
        if (!ratingsError && ratingsData) {
          // Calculate average rating for each transporter
          const ratingsByTransporter: Record<string, { total: number, count: number }> = {};
          
          ratingsData.forEach(rating => {
            if (!ratingsByTransporter[rating.reviewed_id]) {
              ratingsByTransporter[rating.reviewed_id] = { total: 0, count: 0 };
            }
            
            ratingsByTransporter[rating.reviewed_id].total += rating.rating;
            ratingsByTransporter[rating.reviewed_id].count += 1;
          });
          
          // Add ratings to bid data
          data.forEach(bid => {
            const transporterRating = ratingsByTransporter[bid.transporter_id];
            
            bid.averageRating = transporterRating 
              ? +(transporterRating.total / transporterRating.count).toFixed(1) 
              : null;
          });
        }
      }
      
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
      // Find the bid to get the transporter ID
      const bidToAccept = bids.find(bid => bid.id === bidId);
      if (!bidToAccept) throw new Error("Bid not found");
      
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
      
      // Update the shipment status to assigned and set the assigned transporter
      const { error: shipmentError } = await supabase
        .from("shipments")
        .update({ 
          status: "assigned",
          assigned_transporter_id: bidToAccept.transporter_id
        })
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

  const renderVerificationBadge = (bid: any) => {
    if (!bid.verification || !bid.verification.status) {
      return (
        <Badge className="bg-red-100 text-red-800">Unverified</Badge>
      );
    }
    
    switch (bid.verification.status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center">
            <Shield className="h-3 w-3 mr-1" /> Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        );
      default:
        return (
          <Badge className="bg-red-100 text-red-800">Unverified</Badge>
        );
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
    <div>
      {selectedTransporter ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Transporter Profile</h3>
            <Button variant="outline" size="sm" onClick={() => setSelectedTransporter(null)}>
              Back to Bids
            </Button>
          </div>
          <TransporterProfile transporterId={selectedTransporter} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transporter</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell className="font-medium">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-medium"
                      onClick={() => setSelectedTransporter(bid.transporter_id)}
                    >
                      {bid.profiles?.company_name || "Unknown"}
                    </Button>
                  </TableCell>
                  <TableCell>${bid.amount}</TableCell>
                  <TableCell>
                    {bid.averageRating ? (
                      <div className="flex items-center">
                        <span className="mr-1">{bid.averageRating}</span>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    ) : (
                      "New"
                    )}
                  </TableCell>
                  <TableCell>{renderVerificationBadge(bid)}</TableCell>
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
      )}
    </div>
  );
};

export default ShipmentBids;
