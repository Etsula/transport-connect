
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Globe, MapPin, Package, Truck } from "lucide-react";
import NavigationMap from "@/components/NavigationMap";
import BidForm from "@/components/BidForm";
import { Separator } from "@/components/ui/separator";

const ShipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<{ userType: string; id: string | null }>({
    userType: "",
    id: null
  });
  const [showBidForm, setShowBidForm] = useState<boolean>(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmitted = () => {
    setShowBidForm(false);
    toast({
      title: "Bid submitted",
      description: "Your bid has been sent to the shipper"
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
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{shipment.title}</CardTitle>
                    <p className="text-gray-500 mt-1">Posted by {shipment.profiles?.company_name || "Unknown Shipper"}</p>
                  </div>
                  <Badge className={
                    shipment.status === "open" ? "bg-green-500" :
                    shipment.status === "in_transit" ? "bg-blue-500" :
                    shipment.status === "delivered" ? "bg-purple-500" :
                    "bg-gray-500"
                  }>
                    {shipment.status === "open" ? "Open" : 
                     shipment.status === "in_transit" ? "In Transit" :
                     shipment.status === "delivered" ? "Delivered" : 
                     shipment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
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

            <Card className="mt-6">
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
          </div>

          <div>
            {userData.userType === "transporter" && shipment.status === "open" && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Submit a Bid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showBidForm ? (
                    <BidForm 
                      shipmentId={id || ""}
                      transporterId={userData.id || ""}
                      onBidSubmitted={handleBidSubmitted}
                    />
                  ) : (
                    <Button 
                      onClick={() => setShowBidForm(true)} 
                      className="w-full"
                    >
                      Place a Bid
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm">Company</p>
                    <p className="font-medium">{shipment.profiles?.company_name || "Not specified"}</p>
                  </div>
                  {shipment.profiles?.phone && (
                    <div>
                      <p className="text-gray-500 text-sm">Phone</p>
                      <p className="font-medium">{shipment.profiles.phone}</p>
                    </div>
                  )}
                  <Button 
                    onClick={() => navigate(`/messages/${shipment.id}`)}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
