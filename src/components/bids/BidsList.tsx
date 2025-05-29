
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading';

interface Bid {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  transporter_id: string;
  profiles?: { company_name: string };
  verification?: { status: string } | null;
  averageRating?: number | null;
}

interface BidsListProps {
  bids: Bid[];
  onAcceptBid: (bidId: string) => void;
  onViewProfile: (transporterId: string) => void;
  processingBids: Record<string, boolean>;
}

const BidsList = ({ bids, onAcceptBid, onViewProfile, processingBids }: BidsListProps) => {
  const renderVerificationBadge = (bid: Bid) => {
    if (!bid.verification?.status) {
      return <Badge className="bg-red-100 text-red-800">Unverified</Badge>;
    }
    
    switch (bid.verification.status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center">
            <Shield className="h-3 w-3 mr-1" /> Verified
          </Badge>
        );
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Unverified</Badge>;
    }
  };

  const renderRating = (rating: number | null) => {
    if (!rating) return "New";
    
    return (
      <div className="flex items-center">
        <span className="mr-1">{rating}</span>
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    );
  };

  if (bids.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md bg-gray-50">
        <p className="text-gray-500">No bids have been received for this shipment yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div key={bid.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <Button 
                variant="link" 
                className="p-0 h-auto font-medium text-left"
                onClick={() => onViewProfile(bid.transporter_id)}
              >
                {bid.profiles?.company_name || "Unknown"}
              </Button>
              <div className="flex items-center gap-2 mt-1">
                {renderVerificationBadge(bid)}
                <span className="text-sm text-gray-600">
                  Rating: {renderRating(bid.averageRating)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">${bid.amount}</div>
              <Badge className={
                bid.status === "pending" ? "bg-yellow-500" :
                bid.status === "accepted" ? "bg-green-500" :
                bid.status === "rejected" ? "bg-red-500" :
                "bg-gray-500"
              }>
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
            </span>
            
            {bid.status === "pending" && (
              <Button 
                size="sm"
                onClick={() => onAcceptBid(bid.id)}
                disabled={processingBids[bid.id]}
              >
                {processingBids[bid.id] ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  "Accept"
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BidsList;
