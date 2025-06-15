
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavigationMap from "@/components/NavigationMap";
import PrivacyAwareLocationTracker from "@/components/tracking/PrivacyAwareLocationTracker";
import EnhancedTrackingControl from "@/components/tracking/EnhancedTrackingControl";
import UnresponsiveTransporterTracker from "@/components/tracking/UnresponsiveTransporterTracker";
import { useAuth } from "@/hooks/useAuth";

interface ShipmentTrackingTabProps {
  shipment?: any;
}

const ShipmentTrackingTab = ({ shipment }: ShipmentTrackingTabProps) => {
  const { userData } = useAuth();

  return (
    <div className="space-y-6">
      {/* Route Map */}
      <Card>
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-md overflow-hidden">
            <NavigationMap 
              className="h-full w-full" 
              showTraffic={true}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Privacy-Aware Location Tracking */}
        {shipment?.transporter_id && (
          <PrivacyAwareLocationTracker
            transporterId={shipment.transporter_id}
            shipmentId={shipment.id}
          />
        )}

        {/* Enhanced Tracking Control (for shippers and admins) */}
        {shipment?.transporter_id && userData.userType === 'shipper' && (
          <EnhancedTrackingControl
            targetUserId={shipment.transporter_id}
            shipmentId={shipment.id}
            userRole={userData.userType}
          />
        )}
      </div>

      {/* Unresponsive Transporter Tracker - Show when there are delivery issues */}
      {shipment?.transporter_id && userData.userType === 'shipper' && (
        shipment.status === 'overdue' || shipment.status === 'dispute'
      ) && (
        <UnresponsiveTransporterTracker
          transporterId={shipment.transporter_id}
          shipmentId={shipment.id}
        />
      )}
    </div>
  );
};

export default ShipmentTrackingTab;
