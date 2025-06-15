
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShipmentHeaderProps {
  shipment: {
    id: string;
    title: string;
    status: string;
  };
}

const ShipmentHeader = ({ shipment }: ShipmentHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{shipment.title}</CardTitle>
            <p className="text-gray-500 mt-1">Manage your shipment</p>
          </div>
          <Badge className={
            shipment.status === "open" ? "bg-green-500" :
            shipment.status === "assigned" ? "bg-blue-500" :
            shipment.status === "in_transit" ? "bg-purple-500" :
            shipment.status === "delivered" ? "bg-teal-500" :
            "bg-gray-500"
          }>
            {shipment.status === "open" ? "Open" : 
             shipment.status === "assigned" ? "Assigned" :
             shipment.status === "in_transit" ? "In Transit" :
             shipment.status === "delivered" ? "Delivered" : 
             shipment.status}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ShipmentHeader;
