
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Truck, Shield, MapPin, Settings, Plus, Trash } from "lucide-react";
import LiveLocationTracker from "@/components/LiveLocationTracker";
import VerificationSystem from "@/components/VerificationSystem";

const TransporterSettings = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: "",
    max_weight: "",
    max_length: "",
    max_width: "",
    max_height: "",
    refrigerated: false,
    hazardous_materials: false,
    vehicle_registration: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (data?.user) {
          setUserId(data.user.id);
          fetchVehicles(data.user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchVehicles = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("transporter_vehicles")
        .select("*")
        .eq("transporter_id", id);
        
      if (error) throw error;
      
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to load your vehicles",
        variant: "destructive",
      });
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !newVehicle.vehicle_type || !newVehicle.vehicle_registration) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.from("transporter_vehicles").insert([
        {
          transporter_id: userId,
          vehicle_type: newVehicle.vehicle_type,
          max_weight: newVehicle.max_weight ? parseFloat(newVehicle.max_weight) : null,
          max_length: newVehicle.max_length ? parseFloat(newVehicle.max_length) : null,
          max_width: newVehicle.max_width ? parseFloat(newVehicle.max_width) : null,
          max_height: newVehicle.max_height ? parseFloat(newVehicle.max_height) : null,
          refrigerated: newVehicle.refrigerated,
          hazardous_materials: newVehicle.hazardous_materials,
          vehicle_registration: newVehicle.vehicle_registration,
        }
      ]);
      
      if (error) throw error;
      
      toast({
        title: "Vehicle added",
        description: "Your vehicle has been added successfully",
      });
      
      // Reset form and refresh vehicles list
      setNewVehicle({
        vehicle_type: "",
        max_weight: "",
        max_length: "",
        max_width: "",
        max_height: "",
        refrigerated: false,
        hazardous_materials: false,
        vehicle_registration: ""
      });
      
      if (userId) fetchVehicles(userId);
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add vehicle",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from("transporter_vehicles")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Vehicle removed",
        description: "Vehicle has been removed successfully",
      });
      
      if (userId) fetchVehicles(userId);
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-10 text-center">
            <p>You need to log in to access transporter settings</p>
            <Button className="mt-4" onClick={() => window.location.href = "/login"}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Transporter Settings</h1>
        
        <Tabs defaultValue="verification">
          <TabsList className="mb-6">
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Verification
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Vehicles
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Location
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Account
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="verification">
            <VerificationSystem userId={userId} userType="transporter" />
          </TabsContent>
          
          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>Your Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {vehicles.length > 0 ? (
                    <div className="space-y-4">
                      {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{vehicle.vehicle_type}</h3>
                              <p className="text-sm text-gray-500">Registration: {vehicle.vehicle_registration}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 h-8 w-8 p-0"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                            {vehicle.max_weight && (
                              <div>
                                <p className="text-xs text-gray-500">Max weight</p>
                                <p className="text-sm">{vehicle.max_weight} kg</p>
                              </div>
                            )}
                            {vehicle.max_length && (
                              <div>
                                <p className="text-xs text-gray-500">Length</p>
                                <p className="text-sm">{vehicle.max_length} m</p>
                              </div>
                            )}
                            {vehicle.max_width && (
                              <div>
                                <p className="text-xs text-gray-500">Width</p>
                                <p className="text-sm">{vehicle.max_width} m</p>
                              </div>
                            )}
                            {vehicle.max_height && (
                              <div>
                                <p className="text-xs text-gray-500">Height</p>
                                <p className="text-sm">{vehicle.max_height} m</p>
                              </div>
                            )}
                          </div>
                          
                          {(vehicle.refrigerated || vehicle.hazardous_materials) && (
                            <div className="flex gap-2 mt-2">
                              {vehicle.refrigerated && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  Refrigerated
                                </span>
                              )}
                              {vehicle.hazardous_materials && (
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                  Hazardous Materials
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      <Truck className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">You haven't added any vehicles yet</p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <form onSubmit={handleAddVehicle} className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add New Vehicle
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                        <Input
                          id="vehicle_type"
                          placeholder="e.g. Truck, Van, Motorcycle"
                          value={newVehicle.vehicle_type}
                          onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vehicle_registration">Registration Number *</Label>
                        <Input
                          id="vehicle_registration"
                          placeholder="Registration/License Plate"
                          value={newVehicle.vehicle_registration}
                          onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_registration: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max_weight">Max Weight (kg)</Label>
                        <Input
                          id="max_weight"
                          type="number"
                          step="0.1"
                          placeholder="Maximum weight capacity"
                          value={newVehicle.max_weight}
                          onChange={(e) => setNewVehicle({ ...newVehicle, max_weight: e.target.value })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="max_length">Length (m)</Label>
                          <Input
                            id="max_length"
                            type="number"
                            step="0.1"
                            placeholder="Length"
                            value={newVehicle.max_length}
                            onChange={(e) => setNewVehicle({ ...newVehicle, max_length: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max_width">Width (m)</Label>
                          <Input
                            id="max_width"
                            type="number"
                            step="0.1"
                            placeholder="Width"
                            value={newVehicle.max_width}
                            onChange={(e) => setNewVehicle({ ...newVehicle, max_width: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max_height">Height (m)</Label>
                          <Input
                            id="max_height"
                            type="number"
                            step="0.1"
                            placeholder="Height"
                            value={newVehicle.max_height}
                            onChange={(e) => setNewVehicle({ ...newVehicle, max_height: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="refrigerated"
                          checked={newVehicle.refrigerated}
                          onCheckedChange={(checked) => setNewVehicle({ ...newVehicle, refrigerated: checked })}
                        />
                        <Label htmlFor="refrigerated">Refrigerated</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hazardous"
                          checked={newVehicle.hazardous_materials}
                          onCheckedChange={(checked) => setNewVehicle({ ...newVehicle, hazardous_materials: checked })}
                        />
                        <Label htmlFor="hazardous">Hazardous Materials</Label>
                      </div>
                    </div>
                    
                    <Button type="submit">Add Vehicle</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="location">
            <LiveLocationTracker transporterId={userId} />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Account settings can be managed from your profile page.
                </p>
                <Button className="mt-4" onClick={() => window.location.href = "/dashboard"}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransporterSettings;
