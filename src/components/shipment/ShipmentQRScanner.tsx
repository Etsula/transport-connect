
import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ShipmentQRScannerProps {
  onConfirm: (shipmentId: string) => void;
}

const previewStyle = {
  width: "100%",
  minHeight: "220px",
  borderRadius: "0.5rem"
};

const ShipmentQRScanner: React.FC<ShipmentQRScannerProps> = ({ onConfirm }) => {
  const [scanError, setScanError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScan = (data: any) => {
    if (!data) return;
    try {
      // The QR scanner returns an object with .text, .data, or .code depending on the format
      const value = typeof data === "string" ? data : data?.text || data?.data || data?.code;
      if (!value) return;
      const parsed = JSON.parse(value);
      if (
        parsed.type === "godsdelivered" &&
        typeof parsed.shipmentId === "string" &&
        parsed.shipmentId
      ) {
        toast({ title: "Success", description: `Shipment ${parsed.shipmentId} scanned!` });
        onConfirm(parsed.shipmentId);
      } else {
        setScanError("Invalid QR code.");
      }
    } catch {
      setScanError("Failed to parse QR code.");
    }
  };

  const handleError = (err: any) => {
    setScanError("Error accessing camera or scanning QR code.");
  };

  return (
    <Card>
      <CardTitle className="text-center mt-4">Scan Delivery QR Code</CardTitle>
      <CardContent>
        <div className="mb-3">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
            facingMode="environment" // prefer back camera on mobile devices
          />
        </div>
        {scanError && <div className="text-red-500 text-sm">{scanError}</div>}
        <div className="text-xs text-gray-500 mt-2">
          Allow camera access on your device to scan the QR code provided by the delivery person.
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentQRScanner;
