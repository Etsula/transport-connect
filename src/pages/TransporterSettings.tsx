
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import LiveLocationTracker from "@/components/LiveLocationTracker";
import VerificationSystem from "@/components/VerificationSystem";
import { Settings, Truck, Shield, MapPin, Clock, FileCog } from "lucide-react";

const TransporterSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    phone: "",
    email: "",
    vehicle_type: "",
    license_number: "",
    max_load_capacity: "",
    specialties: "",
    insurance_policy: ""
  });
  const [availabilitySettings, setAvailabilitySettings] = useState({
    is_available: true,
    accept_international: false,
    accept_fragile: true,
    accept_express: true,
    working_hours_start: "08:00",
    working_hours_end: "18:00"
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
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Error",
            description: "Could not load your profile",
            variant: "destructive",
          });
          return;
        }
        
        // Check if user is a transporter
        if (profileData.user_type !== "transporter") {
          navigate("/dashboard");
          toast({
            title: "Access denied",
            description: "This page is for transporters only",
            variant: "destructive",
          });
          return;
        }
        
        setUserData({
          id: userId,
          ...profileData,
          email: sessionData.session.user.email
        });
        
        // Set form data from profile
        setFormData({
          company_name: profileData.company_name || "",
          phone: profileData.phone || "",
          email: sessionData.session.user.email || "",
          vehicle_type: profileData.vehicle_type || "",
          license_number: profileData.license_number || "",
          max_load_capacity: profileData.max_load_capacity || "",
          specialties: profileData.specialties || "",
          insurance_policy: profileData.insurance_policy || ""
        });
        
        // Fetch transporter settings
        const { data: settingsData, error: settingsError } = await supabase
          .from("transporter_settings")
          .select("*")
          .eq("transporter_id", userId)
          .single();
          
        if (!settingsError && settingsData) {
          setAvailabilitySettings({
            is_available: settingsData.is_available ?? true,
            accept_international: settingsData.accept_international ?? false,
            accept_fragile: settingsData.accept_fragile ?? true,
            accept_express: settingsData.accept_express ?? true,
            working_hours_start: settingsData.working_hours_start || "08:00",
            working_hours_end: settingsData.working_hours_end || "18:00"
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (name: string, value: boolean | string) => {
    setAvailabilitySettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!userData?.id) return;
      
      // Update profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          company_name: formData.company_name,
          phone: formData.phone,
          vehicle_type: formData.vehicle_type,
          license_number: formData.license_number,
          max_load_capacity: formData.max_load_capacity,
          specialties: formData.specialties,
          insurance_policy: formData.insurance_policy
        })
        .eq("id", userData.id);
      
      if (profileError) throw profileError;
      
      // Insert or update transporter settings
      const { error: settingsError } = await supabase
        .from("transporter_settings")
        .upsert({
          transporter_id: userData.id,
          is_available: availabilitySettings.is_available,
          accept_international: availabilitySettings.accept_international,
          accept_fragile: availabilitySettings.accept_fragile,
          accept_express: availabilitySettings.accept_express,
          working_hours_start: availabilitySettings.working_hours_start,
          working_hours_end: availabilitySettings.working_hours_end,
        });
      
      if (settingsError) throw settingsError;
      
      toast({
        title: "Profile updated",
        description: "Your settings have been saved successfully"
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile settings",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error loading user data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Transporter Settings
            </h1>
            <p className="text-gray-600">Manage your profile, verification and availability</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")} 
            className="mt-2 sm:mt-0"
          >
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profile" className="flex items-center">
              <Truck className="h-4 w-4 mr-2" /> Profile
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" /> Verification
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> Location
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" /> Availability
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company/Business Name</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="Your business name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your contact number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Contact support to change your email address</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <Input
                      id="vehicle_type"
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleInputChange}
                      placeholder="e.g. Truck, Van, Motorcycle"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="license_number">License/Registration Number</Label>
                    <Input
                      id="license_number"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleInputChange}
                      placeholder="Your business/vehicle license"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_load_capacity">Maximum Load Capacity (kg)</Label>
                    <Input
                      id="max_load_capacity"
                      name="max_load_capacity"
                      value={formData.max_load_capacity}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="e.g. 1000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input
                      id="specialties"
                      name="specialties"
                      value={formData.specialties}
                      onChange={handleInputChange}
                      placeholder="e.g. Fragile items, Same-day delivery"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="insurance_policy">Insurance Policy Number</Label>
                    <Input
                      id="insurance_policy"
                      name="insurance_policy"
                      value={formData.insurance_policy}
                      onChange={handleInputChange}
                      placeholder="Your insurance policy number"
                    />
                  </div>
                </div>
                
                <Button className="mt-6" onClick={handleSaveProfile}>
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verification">
            <VerificationSystem userId={userData.id} userType="transporter" />
          </TabsContent>
          
          <TabsContent value="location">
            <LiveLocationTracker transporterId={userData.id} />
          </TabsContent>
          
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Availability Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Available for New Shipments</Label>
                      <p className="text-sm text-gray-500">
                        Turn off when you're not accepting new work
                      </p>
                    </div>
                    <Switch
                      checked={availabilitySettings.is_available}
                      onCheckedChange={(value) => handleAvailabilityChange("is_available", value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Shipment Types</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label>Accept International Shipments</Label>
                      <Switch
                        checked={availabilitySettings.accept_international}
                        onCheckedChange={(value) => handleAvailabilityChange("accept_international", value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Accept Fragile Items</Label>
                      <Switch
                        checked={availabilitySettings.accept_fragile}
                        onCheckedChange={(value) => handleAvailabilityChange("accept_fragile", value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Accept Express Delivery</Label>
                      <Switch
                        checked={availabilitySettings.accept_express}
                        onCheckedChange={(value) => handleAvailabilityChange("accept_express", value)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Working Hours</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="working_hours_start">Start Time</Label>
                        <Input
                          id="working_hours_start"
                          type="time"
                          value={availabilitySettings.working_hours_start}
                          onChange={(e) => handleAvailabilityChange("working_hours_start", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="working_hours_end">End Time</Label>
                        <Input
                          id="working_hours_end"
                          type="time"
                          value={availabilitySettings.working_hours_end}
                          onChange={(e) => handleAvailabilityChange("working_hours_end", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveProfile}>
                    Save Availability Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransporterSettings;
