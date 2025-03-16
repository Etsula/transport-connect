
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserPlus, MapPin, DollarSign, Package, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AgentList from "@/components/AgentList";
import LocationManagement from "@/components/LocationManagement";
import DeliveryCharges from "@/components/DeliveryCharges";
import WebhookManagement from "@/components/WebhookManagement";

const AgentManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<{ userType: string; id: string | null }>({
    userType: "shipper",
    id: null
  });
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Agent management data fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load agent management data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Agent Management</h1>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <p>Loading agent management data...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="agents" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Agents
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Locations
              </TabsTrigger>
              <TabsTrigger value="charges" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Delivery Charges
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Webhooks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agents">
              <AgentList currentUserId={userData.id || ""} />
            </TabsContent>
            
            <TabsContent value="locations">
              <LocationManagement />
            </TabsContent>
            
            <TabsContent value="charges">
              <DeliveryCharges />
            </TabsContent>
            
            <TabsContent value="webhooks">
              <WebhookManagement userId={userData.id || ""} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AgentManagement;
