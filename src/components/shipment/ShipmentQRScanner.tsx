
import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDeliveryConfirmation } from "@/hooks/useDeliveryConfirmation";

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
  const [isScanning, setIsScanning] = useState(true);
  const [lastScannedData, setLastScannedData] = useState<string | null>(null);
  const { toast } = useToast();
  const { confirmDelivery, loading } = useDeliveryConfirmation();

  const handleScan = async (data: any) => {
    if (!data || !isScanning) return;
    
    try {
      // The QR scanner returns an object with .text, .data, or .code depending on the format
      const value = typeof data === "string" ? data : data?.text || data?.data || data?.code;
      if (!value || value === lastScannedData) return;
      
      setLastScannedData(value);
      const parsed = JSON.parse(value);
      
      if (
        parsed.type === "godsdelivered" &&
        typeof parsed.shipmentId === "string" &&
        parsed.shipmentId
      ) {
        setIsScanning(false);
        setScanError(null);
        
        toast({ 
          title: "QR Code Scanned", 
          description: `Processing delivery confirmation for shipment ${parsed.shipmentId}...` 
        });

        // Automatically confirm delivery
        const result = await confirmDelivery(parsed.shipmentId);
        
        if (result.success) {
          onConfirm(parsed.shipmentId);
        } else {
          // Reset scanning if confirmation failed
          setIsScanning(true);
          setLastScannedData(null);
        }
      } else {
        setScanError("Invalid QR code. Please scan a valid delivery QR code.");
        setTimeout(() => setScanError(null), 3000);
      }
    } catch (error) {
      setScanError("Failed to parse QR code. Please try again.");
      setTimeout(() => setScanError(null), 3000);
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scanner error:", err);
    setScanError("Error accessing camera. Please check camera permissions.");
  };

  const resetScanner = () => {
    setIsScanning(true);
    setScanError(null);
    setLastScannedData(null);
  };

  return (
    <Card>
      <CardTitle className="text-center mt-4">Scan Delivery QR Code</CardTitle>
      <CardContent>
        <div className="mb-3">
          {isScanning ? (
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={previewStyle}
              facingMode="environment"
            />
          ) : (
            <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={previewStyle}>
              <div className="text-center">
                <p className="text-lg font-medium text-green-600 mb-2">
                  {loading ? "Confirming Delivery..." : "QR Code Scanned Successfully"}
                </p>
                <Button onClick={resetScanner} variant="outline" disabled={loading}>
                  Scan Another QR Code
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {scanError && (
          <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded">
            {scanError}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          Allow camera access on your device to scan the QR code provided by the delivery person.
          The QR code will automatically confirm delivery when scanned.
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentQRScanner;
