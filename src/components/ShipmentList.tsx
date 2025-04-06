
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShipmentData {
  id: string;
  title: string;
  pickup_location: string;
  delivery_location: string;
  created_at: string;
  status: string;
  is_international: boolean;
  shipper_id: string;
  profiles: {
    company_name: string | null;
  } | null;
}

interface ShipmentListProps {
  shipments: ShipmentData[];
  selectedShipmentId?: string;
  onShipmentSelect: (shipment: ShipmentData) => void;
}

const ShipmentList = ({ shipments, selectedShipmentId, onShipmentSelect }: ShipmentListProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Your Shipments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {shipments.map((shipment) => (
            <Button
              key={shipment.id}
              variant="ghost"
              className={`w-full justify-start p-4 h-auto ${
                selectedShipmentId === shipment.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onShipmentSelect(shipment)}
            >
              <Package className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="font-medium text-sm">
                  #{shipment.id.slice(-6)} - {shipment.title}
                </p>
                <p className="text-xs text-gray-500">
                  {shipment.pickup_location} → {shipment.delivery_location}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentList;
