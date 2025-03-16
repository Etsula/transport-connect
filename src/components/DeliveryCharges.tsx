
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Edit, Trash } from "lucide-react";

interface DeliveryCharge {
  id: string;
  origin_area: string;
  destination_area: string;
  package_type: string;
  base_price: number;
  distance_price: number;
  weight_price: number;
  urgent_fee: number;
}

export default function DeliveryCharges() {
  const { toast } = useToast();
  const [charges, setCharges] = useState<DeliveryCharge[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<DeliveryCharge | null>(null);
  
  const [formData, setFormData] = useState({
    origin_area: "",
    destination_area: "",
    package_type: "standard",
    base_price: "",
    distance_price: "",
    weight_price: "",
    urgent_fee: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch areas (from agent_locations)
        const { data: locationsData, error: locationsError } = await supabase
          .from("agent_locations")
          .select("area")
          .order("area");
          
        if (locationsError) {
          console.error("Error fetching areas:", locationsError);
          throw locationsError;
        }
        
        // Extract unique areas
        const uniqueAreas = [...new Set(locationsData.map(location => location.area))];
        setAreas(uniqueAreas);
        
        // Fetch delivery charges
        const { data: chargesData, error: chargesError } = await supabase
          .from("delivery_charges")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (chargesError) {
          console.error("Error fetching delivery charges:", chargesError);
          throw chargesError;
        }
        
        setCharges(chargesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load delivery charges data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.origin_area === formData.destination_area) {
      toast({
        title: "Invalid Input",
        description: "Origin and destination areas cannot be the same",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const chargeData = {
        origin_area: formData.origin_area,
        destination_area: formData.destination_area,
        package_type: formData.package_type,
        base_price: parseFloat(formData.base_price) || 0,
        distance_price: parseFloat(formData.distance_price) || 0,
        weight_price: parseFloat(formData.weight_price) || 0,
        urgent_fee: parseFloat(formData.urgent_fee) || 0
      };
      
      if (editingCharge) {
        // Update existing charge
        const { error } = await supabase
          .from("delivery_charges")
          .update(chargeData)
          .eq("id", editingCharge.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Delivery charge updated successfully",
        });
      } else {
        // Check if charge with same origin/destination/package_type already exists
        const { data: existingData, error: checkError } = await supabase
          .from("delivery_charges")
          .select("id")
          .eq("origin_area", formData.origin_area)
          .eq("destination_area", formData.destination_area)
          .eq("package_type", formData.package_type);
          
        if (checkError) throw checkError;
        
        if (existingData.length > 0) {
          toast({
            title: "Error",
            description: "A delivery charge with these parameters already exists",
            variant: "destructive",
          });
          return;
        }
        
        // Create new charge
        const { error } = await supabase
          .from("delivery_charges")
          .insert(chargeData);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Delivery charge created successfully",
        });
      }
      
      // Refresh charges list
      const { data, error } = await supabase
        .from("delivery_charges")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setCharges(data);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving delivery charge:", error);
      toast({
        title: "Error",
        description: "Failed to save delivery charge",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (charge: DeliveryCharge) => {
    setEditingCharge(charge);
    setFormData({
      origin_area: charge.origin_area,
      destination_area: charge.destination_area,
      package_type: charge.package_type,
      base_price: charge.base_price.toString(),
      distance_price: charge.distance_price.toString(),
      weight_price: charge.weight_price.toString(),
      urgent_fee: charge.urgent_fee.toString()
    });
    setOpen(true);
  };

  const handleDelete = async (chargeId: string) => {
    if (!confirm("Are you sure you want to delete this delivery charge?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("delivery_charges")
        .delete()
        .eq("id", chargeId);
        
      if (error) throw error;
      
      setCharges(charges.filter(charge => charge.id !== chargeId));
      
      toast({
        title: "Success",
        description: "Delivery charge deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting delivery charge:", error);
      toast({
        title: "Error",
        description: "Failed to delete delivery charge",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      origin_area: "",
      destination_area: "",
      package_type: "standard",
      base_price: "",
      distance_price: "",
      weight_price: "",
      urgent_fee: ""
    });
    setEditingCharge(null);
  };

  const packageTypeLabel = (type: string) => {
    switch (type) {
      case "standard":
        return "Standard";
      case "express":
        return "Express";
      case "overnight":
        return "Overnight";
      case "heavy":
        return "Heavy Freight";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delivery Charges</CardTitle>
          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <DollarSign className="h-4 w-4 mr-2" />
                Add Delivery Charge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCharge ? "Edit Delivery Charge" : "Add New Delivery Charge"}
                </DialogTitle>
                <DialogDescription>
                  {editingCharge 
                    ? "Update the delivery charge details below." 
                    : "Fill in the details to create a new delivery charge."}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="origin_area">Origin Area</Label>
                      <Select 
                        value={formData.origin_area} 
                        onValueChange={(value) => handleSelectChange("origin_area", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin area" />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="destination_area">Destination Area</Label>
                      <Select 
                        value={formData.destination_area} 
                        onValueChange={(value) => handleSelectChange("destination_area", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination area" />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="package_type">Package Type</Label>
                    <Select 
                      value={formData.package_type} 
                      onValueChange={(value) => handleSelectChange("package_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select package type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="overnight">Overnight</SelectItem>
                        <SelectItem value="heavy">Heavy Freight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="base_price">Base Price</Label>
                    <Input
                      id="base_price"
                      name="base_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.base_price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="distance_price">Distance Price</Label>
                      <Input
                        id="distance_price"
                        name="distance_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.distance_price}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="weight_price">Weight Price</Label>
                      <Input
                        id="weight_price"
                        name="weight_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.weight_price}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="urgent_fee">Urgent Fee</Label>
                      <Input
                        id="urgent_fee"
                        name="urgent_fee"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.urgent_fee}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {editingCharge ? "Update Charge" : "Add Charge"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading delivery charges...</p>
          ) : charges.length === 0 ? (
            <p className="text-center py-4">No delivery charges found. Add your first charge.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Package Type</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Additional Fees</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charges.map((charge) => (
                  <TableRow key={charge.id}>
                    <TableCell>{charge.origin_area}</TableCell>
                    <TableCell>{charge.destination_area}</TableCell>
                    <TableCell>{packageTypeLabel(charge.package_type)}</TableCell>
                    <TableCell>${charge.base_price.toFixed(2)}</TableCell>
                    <TableCell>
                      {charge.distance_price > 0 && <div>Distance: ${charge.distance_price.toFixed(2)}</div>}
                      {charge.weight_price > 0 && <div>Weight: ${charge.weight_price.toFixed(2)}</div>}
                      {charge.urgent_fee > 0 && <div>Urgent: ${charge.urgent_fee.toFixed(2)}</div>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(charge)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(charge.id)}>
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
