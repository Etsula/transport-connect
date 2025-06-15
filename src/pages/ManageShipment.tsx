import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Truck, MapPin, Users } from "lucide-react";
import ShipmentBids from "@/components/ShipmentBids";
import ShipmentHeader from "@/components/shipment/ShipmentHeader";
import ShipmentDetailsTab from "@/components/shipment/ShipmentDetailsTab";
import ShipmentTrackingTab from "@/components/shipment/ShipmentTrackingTab";
import ShipmentActions from "@/components/shipment/ShipmentActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManageShipment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<{ userType: string; id: string | null }>({
    userType: "",
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
        
        if (profileData.user_type !== "shipper") {
          navigate("/dashboard");
          toast({
            title: "Access denied",
            description: "Only shippers can manage shipments",
            variant: "destructive",
          });
          return;
        }
        
        fetchShipmentDetails(userId);
      } catch (error) {
        console.error("User data fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      }
    };
    
    fetchUserData();
  }, [navigate, toast, id]);

  const fetchShipmentDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select(`
          *,
          profiles(company_name, phone)
        `)
        .eq("id", id)
        .eq("shipper_id", userId)
        .single();
      
      if (error) throw error;
      
      setShipment(data);
    } catch (error: any) {
      console.error("Error fetching shipment details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load shipment details",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleBidAccepted = () => {
    fetchShipmentDetails(userData.id || "");
    toast({
      title: "Bid accepted",
      description: "The shipment status has been updated",
    });
  };

  const handleStatusUpdate = () => {
    fetchShipmentDetails(userData.id || "");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Shipment Not Found</h2>
              <p className="text-gray-500 mb-4">The requested shipment does not exist or you don't have permission to view it.</p>
              <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/dashboard")} 
          className="mb-4"
        >
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ShipmentHeader shipment={shipment} />

            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="details" className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Details</span>
                </TabsTrigger>
                <TabsTrigger value="bids" className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Bids</span>
                </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Tracking</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <ShipmentDetailsTab shipment={shipment} />
              </TabsContent>
              
              <TabsContent value="bids">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Transport Bids
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ShipmentBids 
                      shipmentId={id || ""} 
                      onBidAccepted={handleBidAccepted}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tracking">
                <ShipmentTrackingTab shipment={shipment} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <ShipmentActions 
              shipment={shipment} 
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageShipment;
