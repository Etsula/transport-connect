
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, InfoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BidFormProps {
  shipmentId: string;
  transporterId: string;
  onBidSubmitted?: () => void;
}

const BidForm = ({ shipmentId, transporterId, onBidSubmitted }: BidFormProps) => {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const { toast } = useToast();

  // Check verification status
  React.useEffect(() => {
    const checkVerification = async () => {
      try {
        const { data, error } = await supabase
          .from("verification")
          .select("status")
          .eq("user_id", transporterId)
          .single();
        
        if (error) {
          console.error("Error checking verification status:", error);
          setVerificationStatus("unverified");
          return;
        }
        
        setVerificationStatus(data?.status || "unverified");
      } catch (error) {
        console.error("Error checking verification:", error);
        setVerificationStatus("unverified");
      }
    };
    
    checkVerification();
  }, [transporterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationStatus !== "verified") {
      toast({
        title: "Verification required",
        description: "You must verify your account before submitting bids",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bid amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if this transporter already has a bid for this shipment
      const { data: existingBids, error: checkError } = await supabase
        .from("bids")
        .select("id")
        .eq("shipment_id", shipmentId)
        .eq("transporter_id", transporterId);
        
      if (checkError) throw checkError;
      
      if (existingBids && existingBids.length > 0) {
        toast({
          title: "Bid already exists",
          description: "You have already submitted a bid for this shipment. Please edit your existing bid.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const { data, error } = await supabase.from("bids").insert([
        {
          shipment_id: shipmentId,
          transporter_id: transporterId,
          amount: parseFloat(amount),
          description,
          status: "pending"
        }
      ]);

      if (error) throw error;

      toast({
        title: "Bid submitted successfully",
        description: "The shipper will be notified of your bid",
      });
      
      if (onBidSubmitted) onBidSubmitted();
      
      // Reset form
      setAmount("");
      setDescription("");
    } catch (error: any) {
      console.error("Error submitting bid:", error);
      toast({
        title: "Failed to submit bid",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationStatus === "unverified" || verificationStatus === "pending") {
    return (
      <div className="border-2 border-dashed border-orange-200 rounded-md p-4 bg-orange-50">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium text-orange-700">Verification Required</h3>
        </div>
        <p className="text-sm text-orange-600 mb-3">
          You must verify your account before you can submit bids. 
          {verificationStatus === "pending" ? 
            " Your verification is pending approval." : 
            " Please complete the verification process from your profile."}
        </p>
        <Button 
          variant="outline" 
          className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
          onClick={() => window.location.href = "/dashboard"}
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Bid Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="Enter your bid amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add any additional information about your bid"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="rounded-md bg-blue-50 p-3 flex items-start">
        <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p>Your bid is private and will only be visible to the shipper. Other transporters cannot see your bid amount.</p>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Bid...
          </>
        ) : (
          "Submit Bid"
        )}
      </Button>
    </form>
  );
};

export default BidForm;
