
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useShipmentMessages } from "@/hooks/useShipmentMessages";
import ShipmentMessaging from "@/components/ShipmentMessaging";
import ShipmentList from "@/components/ShipmentList";
import MessagingHeader from "@/components/MessagingHeader";
import MessagingStateDisplay from "@/components/MessagingStateDisplay";

const Messaging = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const { 
    loading,
    shipments,
    selectedShipment,
    userData,
    setSelectedShipment
  } = useShipmentMessages(shipmentId);

  return (
    <div className="min-h-screen bg-gray-50">
      <MessagingHeader />

      <main className="container mx-auto px-4 py-8">
        <MessagingStateDisplay loading={loading} hasShipments={shipments.length > 0} />
        
        {!loading && shipments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ShipmentList 
              shipments={shipments} 
              selectedShipmentId={selectedShipment?.id}
              onShipmentSelect={setSelectedShipment}
            />

            <div className="lg:col-span-3">
              {selectedShipment ? (
                <ShipmentMessaging
                  shipmentId={selectedShipment.id}
                  shipmentTitle={selectedShipment.title}
                  currentUserId={userData.id || ""}
                  currentUserType={userData.userType as "shipper" | "transporter"}
                />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p>Select a shipment to view messages</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messaging;
