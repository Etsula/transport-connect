
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingCard } from "@/components/ui/loading";
import BidsList from "./BidsList";
import TransporterProfile from "@/components/TransporterProfile";
import { Button } from "@/components/ui/button";

interface BidsContainerProps {
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
  profiles?: { company_name: string; id: string };
  verification?: { status: string } | null;
  averageRating?: number | null;
}

const BidsContainer = ({ shipmentId, onBidAccepted }: BidsContainerProps) => {
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
          profiles:transporter_id(company_name, id)
        `)
        .eq("shipment_id", shipmentId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const transporterIds = data.map(bid => bid.transporter_id);
        
        const { data: verificationData } = await supabase
          .from("verification")
          .select("user_id, status")
          .in("user_id", transporterIds);
        
        const { data: ratingsData } = await supabase
          .from("reviews")
          .select("reviewed_id, rating")
          .in("reviewed_id", transporterIds);
          
        const verificationByTransporter: Record<string, { status: string }> = {};
        verificationData?.forEach(verification => {
          verificationByTransporter[verification.user_id] = { status: verification.status };
        });
        
        const ratingsByTransporter: Record<string, { total: number, count: number }> = {};
        ratingsData?.forEach(rating => {
          if (!ratingsByTransporter[rating.reviewed_id]) {
            ratingsByTransporter[rating.reviewed_id] = { total: 0, count: 0 };
          }
          ratingsByTransporter[rating.reviewed_id].total += rating.rating;
          ratingsByTransporter[rating.reviewed_id].count += 1;
        });
        
        const enhancedBids: Bid[] = data.map(bid => ({
          ...bid,
          verification: verificationByTransporter[bid.transporter_id] || null,
          averageRating: ratingsByTransporter[bid.transporter_id] 
            ? +(ratingsByTransporter[bid.transporter_id].total / ratingsByTransporter[bid.transporter_id].count).toFixed(1)
            : null
        }));
        
        setBids(enhancedBids);
      } else {
        setBids(data || []);
      }
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
      const bidToAccept = bids.find(bid => bid.id === bidId);
      if (!bidToAccept) throw new Error("Bid not found");
      
      const { error: bidError } = await supabase
        .from("bids")
        .update({ status: "accepted" })
        .eq("id", bidId);
      
      if (bidError) throw bidError;
      
      const { error: otherBidsError } = await supabase
        .from("bids")
        .update({ status: "rejected" })
        .eq("shipment_id", shipmentId)
        .neq("id", bidId);
      
      if (otherBidsError) throw otherBidsError;
      
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
    return <LoadingCard title="Loading bids..." />;
  }

  if (selectedTransporter) {
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Transporter Profile</h3>
          <Button variant="outline" size="sm" onClick={() => setSelectedTransporter(null)}>
            Back to Bids
          </Button>
        </div>
        <TransporterProfile transporterId={selectedTransporter} />
      </div>
    );
  }

  return (
    <BidsList 
      bids={bids}
      onAcceptBid={handleAcceptBid}
      onViewProfile={setSelectedTransporter}
      processingBids={processingBids}
    />
  );
};

export default BidsContainer;
