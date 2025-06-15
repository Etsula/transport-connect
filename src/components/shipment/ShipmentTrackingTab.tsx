
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavigationMap from "@/components/NavigationMap";

const ShipmentTrackingTab = () => {
  return (
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
  );
};

export default ShipmentTrackingTab;
