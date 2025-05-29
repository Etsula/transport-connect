
import React from "react";
import BidsContainer from "./bids/BidsContainer";

interface ShipmentBidsProps {
  shipmentId: string;
  onBidAccepted?: () => void;
}

const ShipmentBids = ({ shipmentId, onBidAccepted }: ShipmentBidsProps) => {
  return <BidsContainer shipmentId={shipmentId} onBidAccepted={onBidAccepted} />;
};

export default ShipmentBids;
