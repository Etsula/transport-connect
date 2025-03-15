import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Truck, Clock, MapPin, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ShipmentTracking from "@/components/ShipmentTracking";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ userType: string; id: string | null }>({
    userType: "shipper",
    id: null
  });

  const demoTrackingData = {
    shipmentId: "123456789",
    currentStatus: "In Transit",
    progress: 65,
    trackingPoints: [
      {
        location: "Warehouse, Nairobi",
        timestamp: "Jun 12, 8:30 AM",
        status: "Picked up",
        coordinates: { lat: -1.286389, lng: 36.817223 }
      },
      {
        location: "Sorting Center, Nakuru",
        timestamp: "Jun 12, 2:15 PM",
        status: "In Transit",
        coordinates: { lat: -0.303099, lng: 36.080025 }
      },
      {
        location: "En route to Kisumu",
        timestamp: "Jun 13, 9:45 AM",
        status: "In Transit",
        coordinates: { lat: 0.091517, lng: 34.767906 }
      }
    ]
  };

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
        
        let shipmentsQuery;
        
        if (profileData.user_type === "shipper") {
          shipmentsQuery = supabase
            .from("shipments")
            .select("*, profiles(company_name)")
            .eq("shipper_id", userId)
            .order("created_at", { ascending: false })
            .limit(5);
        } else {
          shipmentsQuery = supabase
            .from("shipments")
            .select("*, profiles(company_name)")
            .eq("status", "open")
            .order("created_at", { ascending: false })
            .limit(5);
        }
        
        const { data: shipmentsData, error: shipmentsError } = await shipmentsQuery;
        
        if (shipmentsError) {
          console.error("Error fetching shipments:", shipmentsError);
          return;
        }
        
        setShipments(shipmentsData);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: "Sign out failed. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold">{loading ? "..." : shipments.filter(s => s.status === "open").length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Available Transporters</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Globe className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-600">International Shipments</p>
                <p className="text-2xl font-bold">{loading ? "..." : shipments.filter(s => s.is_international).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {userData.userType === "shipper" && shipments.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Live Tracking</h2>
            <ShipmentTracking 
              shipmentId={demoTrackingData.shipmentId}
              currentStatus={demoTrackingData.currentStatus}
              trackingPoints={demoTrackingData.trackingPoints}
              progress={demoTrackingData.progress}
            />
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {userData.userType === "shipper" ? "Your Recent Shipments" : "Available Shipments"}
          </h2>
          <Card className="p-6">
            <div className="space-y-4">
              {loading ? (
                <p className="text-center py-4">Loading shipments...</p>
              ) : shipments.length === 0 ? (
                <p className="text-center py-4">No shipments found</p>
              ) : (
                shipments.map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                    <div>
                      <p className="font-medium">{shipment.title}</p>
                      <p className="text-sm text-gray-600">
                        From {shipment.pickup_location} to {shipment.delivery_location}
                        {shipment.is_international && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            International
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/messages/${shipment.id}`)}
                        size="sm"
                      >
                        Message
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/shipments/${shipment.id}`)}
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/create-shipment">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Create New Shipment
              </Button>
            </Link>
            <Link to="/international-shipping">
              <Button variant="outline" className="w-full">
                International Shipping Options
              </Button>
            </Link>
            <Link to="/messaging">
              <Button variant="outline" className="w-full">
                Message Center
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
