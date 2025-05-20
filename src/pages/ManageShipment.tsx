
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Info, MapPin, MessageSquare, Package, Truck, Users } from "lucide-react";
import NavigationMap from "@/components/NavigationMap";
import ShipmentBids from "@/components/ShipmentBids";
import ShipmentMessaging from "@/components/ShipmentMessaging";
import { Separator } from "@/components/ui/separator";

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
    // Refresh shipment data
    fetchShipmentDetails(userData.id || "");
    toast({
      title: "Bid accepted",
      description: "The shipment status has been updated",
    });
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

            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid grid-cols-4 w-full">
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
                <TabsTrigger value="messages" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
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
              </TabsContent>
              
              <TabsContent value="messages">
                <Card>
                  <CardContent className="pt-6">
                    {userData.id && (
                      <ShipmentMessaging
                        shipmentId={shipment.id}
                        shipmentTitle={shipment.title}
                        currentUserId={userData.id}
                        currentUserType="shipper"
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipment Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/messages/${shipment.id}`)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View All Messages
                </Button>
                
                {shipment.status === "open" && (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from("shipments")
                          .update({ status: "cancelled" })
                          .eq("id", shipment.id);
                          
                        if (error) throw error;
                        
                        toast({
                          title: "Shipment cancelled",
                          description: "The shipment has been cancelled successfully",
                        });
                        
                        navigate("/dashboard");
                      } catch (error: any) {
                        console.error("Error cancelling shipment:", error);
                        toast({
                          title: "Error",
                          description: "Failed to cancel shipment",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Cancel Shipment
                  </Button>
                )}
              </CardContent>
            </Card>

            {shipment.status === "assigned" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from("shipments")
                          .update({ status: "in_transit" })
                          .eq("id", shipment.id);
                          
                        if (error) throw error;
                        
                        toast({
                          title: "Status updated",
                          description: "The shipment is now in transit",
                        });
                        
                        setShipment({...shipment, status: "in_transit"});
                      } catch (error: any) {
                        console.error("Error updating shipment status:", error);
                        toast({
                          title: "Error",
                          description: "Failed to update status",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Mark as In Transit
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {shipment.status === "in_transit" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from("shipments")
                          .update({ status: "delivered" })
                          .eq("id", shipment.id);
                          
                        if (error) throw error;
                        
                        toast({
                          title: "Status updated",
                          description: "The shipment has been marked as delivered",
                        });
                        
                        setShipment({...shipment, status: "delivered"});
                      } catch (error: any) {
                        console.error("Error updating shipment status:", error);
                        toast({
                          title: "Error",
                          description: "Failed to update status",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Mark as Delivered
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageShipment;
