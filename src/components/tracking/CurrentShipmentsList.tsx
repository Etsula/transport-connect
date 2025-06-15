
import React from "react";
import { Badge } from "@/components/ui/badge";

const CurrentShipmentsList = ({ shipments }: { shipments: any[] }) => {
  if (!shipments || shipments.length === 0) return null;
  return (
    <div>
      <h4 className="font-medium mb-2">Current Shipments</h4>
      <div className="space-y-2">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm">{shipment.title}</span>
            <Badge variant="outline">{shipment.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CurrentShipmentsList;
