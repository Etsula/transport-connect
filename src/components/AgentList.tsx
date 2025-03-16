
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
import { UserPlus, Edit, Trash, Star } from "lucide-react";

interface AgentLocation {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  country: string;
}

interface Agent {
  id: string;
  agent_name: string;
  agent_type: string;
  contact_phone: string;
  contact_email: string;
  status: string;
  rating: number;
  created_at: string;
  location_id: string;
  agent_location?: AgentLocation;
}

interface AgentListProps {
  currentUserId: string;
}

export default function AgentList({ currentUserId }: AgentListProps) {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [locations, setLocations] = useState<AgentLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  
  const [formData, setFormData] = useState({
    agent_name: "",
    agent_type: "pickup",
    contact_phone: "",
    contact_email: "",
    location_id: ""
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Fetch locations first
        const { data: locationsData, error: locationsError } = await supabase
          .from("agent_locations")
          .select("*")
          .eq("is_active", true);
          
        if (locationsError) {
          console.error("Error fetching locations:", locationsError);
          throw locationsError;
        }
        
        setLocations(locationsData);
        
        // Now fetch agents with location details
        const { data: agentsData, error: agentsError } = await supabase
          .from("agents")
          .select(`
            *,
            agent_location:agent_locations(*)
          `)
          .eq("user_id", currentUserId);
          
        if (agentsError) {
          console.error("Error fetching agents:", agentsError);
          throw agentsError;
        }
        
        setAgents(agentsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load agents data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, [currentUserId, toast]);

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
    
    try {
      setLoading(true);
      
      if (editingAgent) {
        // Update existing agent
        const { error } = await supabase
          .from("agents")
          .update({
            agent_name: formData.agent_name,
            agent_type: formData.agent_type,
            contact_phone: formData.contact_phone,
            contact_email: formData.contact_email,
            location_id: formData.location_id,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingAgent.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Agent updated successfully",
        });
      } else {
        // Create new agent
        const { error } = await supabase
          .from("agents")
          .insert({
            user_id: currentUserId,
            agent_name: formData.agent_name,
            agent_type: formData.agent_type,
            contact_phone: formData.contact_phone,
            contact_email: formData.contact_email,
            location_id: formData.location_id
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Agent created successfully",
        });
      }
      
      // Refresh agent list
      const { data, error } = await supabase
        .from("agents")
        .select(`
          *,
          agent_location:agent_locations(*)
        `)
        .eq("user_id", currentUserId);
        
      if (error) throw error;
      
      setAgents(data);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving agent:", error);
      toast({
        title: "Error",
        description: "Failed to save agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      agent_name: agent.agent_name,
      agent_type: agent.agent_type,
      contact_phone: agent.contact_phone || "",
      contact_email: agent.contact_email || "",
      location_id: agent.location_id || ""
    });
    setOpen(true);
  };

  const handleDelete = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", agentId);
        
      if (error) throw error;
      
      setAgents(agents.filter(agent => agent.id !== agentId));
      
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      agent_name: "",
      agent_type: "pickup",
      contact_phone: "",
      contact_email: "",
      location_id: ""
    });
    setEditingAgent(null);
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Agents</CardTitle>
          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
                <DialogDescription>
                  {editingAgent 
                    ? "Update the agent details below." 
                    : "Fill in the details to create a new agent."}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="agent_name">Agent Name</Label>
                    <Input
                      id="agent_name"
                      name="agent_name"
                      value={formData.agent_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="agent_type">Agent Type</Label>
                    <Select 
                      value={formData.agent_type} 
                      onValueChange={(value) => handleSelectChange("agent_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="location_id">Location</Label>
                    <Select 
                      value={formData.location_id} 
                      onValueChange={(value) => handleSelectChange("location_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name} ({location.area}, {location.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {editingAgent ? "Update Agent" : "Add Agent"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading agents...</p>
          ) : agents.length === 0 ? (
            <p className="text-center py-4">No agents found. Add your first agent.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.agent_name}</TableCell>
                    <TableCell className="capitalize">{agent.agent_type}</TableCell>
                    <TableCell>
                      {agent.agent_location ? (
                        <span>{agent.agent_location.name}, {agent.agent_location.area}</span>
                      ) : (
                        <span className="text-gray-400">No location</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {agent.contact_phone ? agent.contact_phone : 
                        (agent.contact_email ? agent.contact_email : "N/A")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {agent.rating || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(agent)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(agent.id)}>
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
