
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
