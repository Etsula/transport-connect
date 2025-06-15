
import React from "react";
import QRCode from "qrcode.react";

interface ShipmentQRCodeProps {
  shipmentId: string;
}
const ShipmentQRCode: React.FC<ShipmentQRCodeProps> = ({ shipmentId }) => {
  // This can encode the shipment ID and a nonce for extra security if wanted.
  const qrValue = JSON.stringify({ type: "godsdelivered", shipmentId });

  return (
    <div className="flex flex-col items-center p-4">
      <p className="mb-2 font-medium">Show this QR code to the receiver to scan and confirm delivery.</p>
      <QRCode value={qrValue} size={180} />
    </div>
  );
};

export default ShipmentQRCode;
