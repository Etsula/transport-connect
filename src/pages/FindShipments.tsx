
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, MapPin, Search, Globe } from "lucide-react";

const FindShipments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [shipments, setShipments] = useState<any[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    location: "",
    packageType: "",
    international: "all",
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
        
        if (profileData.user_type !== "transporter") {
          navigate("/dashboard");
          toast({
            title: "Access denied",
            description: "Only transporters can access this page",
            variant: "destructive",
          });
          return;
        }
        
        fetchShipments();
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
  }, [navigate, toast]);

  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select(`
          *,
          profiles(company_name)
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setShipments(data || []);
      setFilteredShipments(data || []);
    } catch (error: any) {
      console.error("Error fetching shipments:", error);
      toast({
        title: "Error",
        description: "Failed to load available shipments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...shipments];
    
    if (filters.location) {
      const location = filters.location.toLowerCase();
      result = result.filter(
        s => s.pickup_location.toLowerCase().includes(location) || 
             s.delivery_location.toLowerCase().includes(location)
      );
    }
    
    if (filters.packageType) {
      result = result.filter(
        s => s.package_type && s.package_type.toLowerCase().includes(filters.packageType.toLowerCase())
      );
    }
    
    if (filters.international !== "all") {
      const isInternational = filters.international === "yes";
      result = result.filter(s => s.is_international === isInternational);
    }
    
    setFilteredShipments(result);
  }, [filters, shipments]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      location: "",
      packageType: "",
      international: "all",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Find Shipments</h1>
            <p className="text-gray-600">Browse available shipping opportunities</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")} 
            className="mt-2 sm:mt-0"
          >
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Search by location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="packageType">Package Type</Label>
                <Input
                  id="packageType"
                  placeholder="e.g. Fragile, Perishable"
                  value={filters.packageType}
                  onChange={(e) => handleFilterChange("packageType", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="international">International</Label>
                <Select
                  value={filters.international}
                  onValueChange={(value) => handleFilterChange("international", value)}
                >
                  <SelectTrigger id="international">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">International Only</SelectItem>
                    <SelectItem value="no">Domestic Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredShipments.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No shipments found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                className="mt-4"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{shipment.title}</h3>
                    {shipment.is_international && (
                      <Badge className="bg-blue-500">International</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Route</p>
                        <p className="text-sm">
                          {shipment.pickup_location} to {shipment.delivery_location}
                        </p>
                      </div>
                    </div>
                    
                    {shipment.package_type && (
                      <div className="flex items-start">
                        <Package className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Package</p>
                          <p className="text-sm">
                            {shipment.package_type}
                            {shipment.weight && ` · ${shipment.weight} kg`}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {shipment.is_international && (
                      <div className="flex items-start">
                        <Globe className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">International</p>
                          <p className="text-sm">
                            {shipment.origin_country || "Origin"} to {shipment.destination_country || "Destination"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Budget: {shipment.budget ? `$${shipment.budget}` : "Not specified"}
                    </p>
                    <Button
                      onClick={() => navigate(`/shipment/${shipment.id}`)}
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindShipments;
