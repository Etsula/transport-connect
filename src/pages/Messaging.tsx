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

interface UserData {
  userType: string;
  id: string | null;
}

const Messaging = () => {
  const navigate = useNavigate();
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [userData, setUserData] = useState<UserData>({
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
        
        // Fetch user profile data
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
        
        // Fetch shipments with simplified approach to avoid deep type instantiation
        let shipmentsData: ShipmentData[] = [];
        
        if (profileData.user_type === "shipper") {
          // For shippers, get shipments they created
          const { data, error } = await supabase
            .from("shipments")
            .select("id, title, pickup_location, delivery_location, created_at, status, is_international, shipper_id, transporter_id, profiles:profiles(company_name)")
            .eq("shipper_id", userId)
            .order("created_at", { ascending: false });
            
          if (error) {
            console.error("Error fetching shipments:", error);
            return;
          }
          
          shipmentsData = data as ShipmentData[];
        } else {
          // For transporters, get shipments assigned to them
          const { data, error } = await supabase
            .from("shipments")
            .select("id, title, pickup_location, delivery_location, created_at, status, is_international, shipper_id, transporter_id, profiles:profiles(company_name)")
            .eq("transporter_id", userId)
            .order("created_at", { ascending: false });
            
          if (error) {
            console.error("Error fetching shipments:", error);
            return;
          }
          
          shipmentsData = data as ShipmentData[];
        }
        
        setShipments(shipmentsData || []);
        
        if (shipmentId && shipmentsData && shipmentsData.length > 0) {
          const shipment = shipmentsData.find(s => s.id === shipmentId);
          if (shipment) {
            setSelectedShipment(shipment);
          } else {
            navigate("/messaging");
          }
        } else if (shipmentsData && shipmentsData.length > 0) {
          setSelectedShipment(shipmentsData[0]);
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
