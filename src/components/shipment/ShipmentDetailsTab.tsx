
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Globe } from "lucide-react";

interface ShipmentDetailsTabProps {
  shipment: any;
}

const ShipmentDetailsTab = ({ shipment }: ShipmentDetailsTabProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Shipment Details
            </h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Package Type</p>
                <p>{shipment.package_type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Weight</p>
                <p>{shipment.weight ? `${shipment.weight} kg` : "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Dimensions</p>
                <p>{shipment.dimensions || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Budget</p>
                <p>{shipment.budget ? `$${shipment.budget}` : "Not specified"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </h3>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-gray-500 text-sm">Pickup Location</p>
                <p>{shipment.pickup_location}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Delivery Location</p>
                <p>{shipment.delivery_location}</p>
              </div>
            </div>
          </div>

          {shipment.is_international && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  International Shipping Details
                </h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Origin Country</p>
                    <p>{shipment.origin_country || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Destination Country</p>
                    <p>{shipment.destination_country || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Customs Value</p>
                    <p>{shipment.customs_value ? `$${shipment.customs_value}` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Requires Documents</p>
                    <p>{shipment.requires_documents ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="mt-2 text-gray-700">{shipment.description || "No description provided."}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentDetailsTab;
