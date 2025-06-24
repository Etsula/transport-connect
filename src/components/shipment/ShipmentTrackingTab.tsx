
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Truck } from "lucide-react";
import ShipmentQRCode from "./ShipmentQRCode";
import ShipmentQRScanner from "./ShipmentQRScanner";
import DeliveryConfirmationStatus from "./DeliveryConfirmationStatus";
import { useAuth } from "@/hooks/useAuth";

interface ShipmentTrackingTabProps {
  shipment: any;
}

const ShipmentTrackingTab: React.FC<ShipmentTrackingTabProps> = ({ shipment }) => {
  const { userData } = useAuth();

  const handleDeliveryConfirmed = (shipmentId: string) => {
    console.log(`Delivery confirmed for shipment: ${shipmentId}`);
    // Force a page refresh to update the shipment status
    window.location.reload();
  };

  const canShowQRCode = userData.userType === "shipper" || userData.userType === "transporter";
  const canScanQR = userData.userType === "shipper" || userData.userType === "transporter";

  return (
    <div className="space-y-6">
      {/* Shipment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Shipment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Status:</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {shipment.status === "open" ? "Open" : 
                 shipment.status === "in_transit" ? "In Transit" :
                 shipment.status === "delivered" ? "Delivered" : 
                 shipment.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Pickup Location:</span>
              <span className="text-gray-600">{shipment.pickup_location}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Delivery Location:</span>
              <span className="text-gray-600">{shipment.delivery_location}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Confirmation Status */}
      <DeliveryConfirmationStatus shipmentId={shipment.id} />

      {/* QR Code for Delivery (for shipper/transporter) */}
      {canShowQRCode && shipment.status !== "delivered" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Delivery QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentQRCode shipmentId={shipment.id} />
          </CardContent>
        </Card>
      )}

      {/* QR Scanner for Confirmation (for authenticated users) */}
      {canScanQR && shipment.status !== "delivered" && (
        <ShipmentQRScanner onConfirm={handleDeliveryConfirmed} />
      )}

      {/* Route Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Route Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-sm text-gray-600">{shipment.pickup_location}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-gray-600">{shipment.delivery_location}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTrackingTab;
