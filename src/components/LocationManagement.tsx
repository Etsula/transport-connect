
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Edit, Trash } from "lucide-react";

interface AgentLocation {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
}

export default function LocationManagement() {
  const { toast } = useToast();
  const [locations, setLocations] = useState<AgentLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<AgentLocation | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    area: "",
    city: "",
    country: "",
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from("agent_locations")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching locations:", error);
          throw error;
        }
        
        setLocations(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load locations data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const locationData = {
        name: formData.name,
        address: formData.address,
        area: formData.area,
        city: formData.city,
        country: formData.country,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };
      
      if (editingLocation) {
        // Update existing location
        const { error } = await supabase
          .from("agent_locations")
          .update(locationData)
          .eq("id", editingLocation.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
      } else {
        // Create new location
        const { error } = await supabase
          .from("agent_locations")
          .insert(locationData);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Location created successfully",
        });
      }
      
      // Refresh location list
      const { data, error } = await supabase
        .from("agent_locations")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setLocations(data);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving location:", error);
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location: AgentLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      area: location.area,
      city: location.city,
      country: location.country,
      latitude: location.latitude ? location.latitude.toString() : "",
      longitude: location.longitude ? location.longitude.toString() : ""
    });
    setOpen(true);
  };

  const handleDelete = async (locationId: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    
    try {
      setLoading(true);
      
      // Check if location is used by any agents
      const { data: agentsUsingLocation, error: checkError } = await supabase
        .from("agents")
        .select("id")
        .eq("location_id", locationId);
        
      if (checkError) throw checkError;
      
      if (agentsUsingLocation.length > 0) {
        toast({
          title: "Cannot Delete",
          description: "This location is being used by one or more agents",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from("agent_locations")
        .delete()
        .eq("id", locationId);
        
      if (error) throw error;
      
      setLocations(locations.filter(location => location.id !== locationId));
      
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting location:", error);
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLocationStatus = async (location: AgentLocation) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("agent_locations")
        .update({ is_active: !location.is_active })
        .eq("id", location.id);
        
      if (error) throw error;
      
      setLocations(locations.map(loc => 
        loc.id === location.id 
          ? { ...loc, is_active: !loc.is_active } 
          : loc
      ));
      
      toast({
        title: "Success",
        description: `Location ${location.is_active ? "deactivated" : "activated"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling location status:", error);
      toast({
        title: "Error",
        description: "Failed to update location status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      area: "",
      city: "",
      country: "",
      latitude: "",
      longitude: ""
    });
    setEditingLocation(null);
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Locations</CardTitle>
          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <MapPin className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLocation ? "Edit Location" : "Add New Location"}</DialogTitle>
                <DialogDescription>
                  {editingLocation 
                    ? "Update the location details below." 
                    : "Fill in the details to create a new location."}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Location Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="area">Area/Zone</Label>
                      <Input
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude">Latitude (optional)</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="longitude">Longitude (optional)</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {editingLocation ? "Update Location" : "Add Location"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading locations...</p>
          ) : locations.length === 0 ? (
            <p className="text-center py-4">No locations found. Add your first location.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{location.area}</TableCell>
                    <TableCell>{location.city}</TableCell>
                    <TableCell>{location.country}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        location.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {location.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleLocationStatus(location)}>
                          {location.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(location)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(location.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
