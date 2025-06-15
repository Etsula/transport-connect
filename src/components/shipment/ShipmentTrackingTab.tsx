
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavigationMap from "@/components/NavigationMap";
import PrivacyAwareLocationTracker from "@/components/tracking/PrivacyAwareLocationTracker";
import EnhancedTrackingControl from "@/components/tracking/EnhancedTrackingControl";
import { useAuth } from "@/hooks/useAuth";

interface ShipmentTrackingTabProps {
  shipment?: any;
}

const ShipmentTrackingTab = ({ shipment }: ShipmentTrackingTabProps) => {
  const { userData } = useAuth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  );
};

export default ShipmentTrackingTab;
