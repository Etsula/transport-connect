
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ShipmentMessaging from "@/components/ShipmentMessaging";

interface ShipmentData {
  id: string;
  title: string;
  pickup_location: string;
  delivery_location: string;
  created_at: string;
  status: string;
  is_international: boolean;
  shipper_id: string;
  transporter_id: string | null;
  profiles: {
    company_name: string | null;
  } | null;
}

const Messaging = () => {
  const navigate = useNavigate();
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [userData, setUserData] = useState<{ userType: string; id: string | null }>({
    userType: "shipper",
    id: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          navigate("/auth");
          return;
        }
        
        const userId = sessionData.session.user.id;
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", userId)
          .single();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }
        
        setUserData({
          userType: profileData.user_type,
          id: userId
        });
        
        // Create query based on user type, but make it simpler to avoid deep types
        const query = profileData.user_type === "shipper" 
          ? supabase
              .from("shipments")
              .select(`
                id, 
                title, 
                pickup_location, 
                delivery_location, 
                created_at, 
                status, 
                is_international, 
                shipper_id,
                transporter_id, 
                profiles (company_name)
              `)
              .eq("shipper_id", userId)
              .order("created_at", { ascending: false })
          : supabase
              .from("shipments")
              .select(`
                id, 
                title, 
                pickup_location, 
                delivery_location, 
                created_at, 
                status, 
                is_international, 
                shipper_id,
                transporter_id, 
                profiles (company_name)
              `)
              .eq("transporter_id", userId)
              .order("created_at", { ascending: false });
        
        const { data: shipmentsData, error: shipmentsError } = await query;
        
        if (shipmentsError) {
          console.error("Error fetching shipments:", shipmentsError);
          return;
        }
        
        // Explicitly cast the data to our ShipmentData type
        const typedShipments = shipmentsData as unknown as ShipmentData[];
        setShipments(typedShipments);
        
        if (shipmentId && typedShipments.length > 0) {
          const shipment = typedShipments.find(s => s.id === shipmentId);
          if (shipment) {
            setSelectedShipment(shipment);
          } else {
            navigate("/messaging");
          }
        } else if (typedShipments.length > 0) {
          setSelectedShipment(typedShipments[0]);
        }
      } catch (error) {
        console.error("Messaging data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, shipmentId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-primary">Messaging Center</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <p>Loading messages...</p>
            </CardContent>
          </Card>
        ) : shipments.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="mb-4">You don't have any shipments to message about yet.</p>
                <Button onClick={() => navigate("/create-shipment")}>
                  Create a Shipment
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                        selectedShipment?.id === shipment.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setSelectedShipment(shipment)}
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
