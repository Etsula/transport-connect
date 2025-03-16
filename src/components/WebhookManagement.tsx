
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Edit, Trash, Check, X, Timer, Copy } from "lucide-react";

interface Webhook {
  id: string;
  business_id: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  created_at: string;
  last_triggered_at: string | null;
}

interface WebhookManagementProps {
  userId: string;
}

export default function WebhookManagement({ userId }: WebhookManagementProps) {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  
  const [formData, setFormData] = useState({
    url: "",
    secret: "",
    events: [] as string[]
  });

  const availableEvents = [
    { id: "shipment.created", name: "Shipment Created" },
    { id: "shipment.updated", name: "Shipment Updated" },
    { id: "shipment.completed", name: "Shipment Completed" },
    { id: "payment.received", name: "Payment Received" },
    { id: "agent.assigned", name: "Agent Assigned" }
  ];

  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const { data, error } = await supabase
          .from("webhooks")
          .select("*")
          .eq("business_id", userId)
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching webhooks:", error);
          throw error;
        }
        
        setWebhooks(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load webhook data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWebhooks();
  }, [userId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEventToggle = (eventId: string) => {
    setFormData({
      ...formData,
      events: formData.events.includes(eventId)
        ? formData.events.filter(id => id !== eventId)
        : [...formData.events, eventId]
    });
  };

  const generateSecret = () => {
    // Generate a random string for the webhook secret
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    const secret = Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    
    setFormData({
      ...formData,
      secret
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.events.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one event to trigger the webhook",
        variant: "destructive",
      });
      return;
    }

    // Ensure we have a secret, generate one if missing
    const webhookSecret = formData.secret || generateRandomSecret();
    
    try {
      setLoading(true);
      
      const webhookData = {
        business_id: userId,
        url: formData.url,
        events: formData.events,
        secret: webhookSecret
      };
      
      if (editingWebhook) {
        // Update existing webhook
        const { error } = await supabase
          .from("webhooks")
          .update(webhookData)
          .eq("id", editingWebhook.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Webhook updated successfully",
        });
      } else {
        // Create new webhook
        const { error } = await supabase
          .from("webhooks")
          .insert(webhookData);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Webhook created successfully",
        });
      }
      
      // Refresh webhook list
      const { data, error } = await supabase
        .from("webhooks")
        .select("*")
        .eq("business_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setWebhooks(data);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving webhook:", error);
      toast({
        title: "Error",
        description: "Failed to save webhook",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to ensure we always have a valid string secret
  const generateRandomSecret = (): string => {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleEdit = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setFormData({
      url: webhook.url,
      secret: webhook.secret,
      events: webhook.events
    });
    setOpen(true);
  };

  const handleDelete = async (webhookId: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("webhooks")
        .delete()
        .eq("id", webhookId);
        
      if (error) throw error;
      
      setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId));
      
      toast({
        title: "Success",
        description: "Webhook deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting webhook:", error);
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWebhookStatus = async (webhook: Webhook) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("webhooks")
        .update({ is_active: !webhook.is_active })
        .eq("id", webhook.id);
        
      if (error) throw error;
      
      setWebhooks(webhooks.map(wh => 
        wh.id === webhook.id 
          ? { ...wh, is_active: !wh.is_active } 
          : wh
      ));
      
      toast({
        title: "Success",
        description: `Webhook ${webhook.is_active ? "deactivated" : "activated"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling webhook status:", error);
      toast({
        title: "Error",
        description: "Failed to update webhook status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copySecretToClipboard = (secret: string) => {
    navigator.clipboard.writeText(secret).then(() => {
      toast({
        title: "Copied",
        description: "Webhook secret copied to clipboard",
      });
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const resetForm = () => {
    setFormData({
      url: "",
      secret: "",
      events: []
    });
    setEditingWebhook(null);
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Webhooks</CardTitle>
          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingWebhook ? "Edit Webhook" : "Add New Webhook"}</DialogTitle>
                <DialogDescription>
                  {editingWebhook 
                    ? "Update the webhook configuration below." 
                    : "Configure a new webhook to receive notifications about events."}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="url">Webhook URL</Label>
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      placeholder="https://example.com/webhook"
                      value={formData.url}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Events</Label>
                    <div className="grid gap-2">
                      {availableEvents.map(event => (
                        <div key={event.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`event-${event.id}`}
                            checked={formData.events.includes(event.id)}
                            onCheckedChange={() => handleEventToggle(event.id)}
                          />
                          <Label 
                            htmlFor={`event-${event.id}`}
                            className="cursor-pointer"
                          >
                            {event.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="secret">Webhook Secret</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={generateSecret}
                      >
                        Generate
                      </Button>
                    </div>
                    <Input
                      id="secret"
                      name="secret"
                      value={formData.secret}
                      onChange={handleInputChange}
                      placeholder="Secret used to verify webhook requests"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      This secret will be used to sign webhook payloads so you can verify they come from us.
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {editingWebhook ? "Update Webhook" : "Add Webhook"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading webhooks...</p>
          ) : webhooks.length === 0 ? (
            <p className="text-center py-4">No webhooks found. Add your first webhook.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead>Secret</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {webhook.url}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map(event => (
                          <span 
                            key={event} 
                            className="px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            {event.split('.')[1]}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {webhook.is_active ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          <X className="h-3 w-3 mr-1" /> Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <Timer className="h-3 w-3 mr-1" />
                        {formatDate(webhook.last_triggered_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copySecretToClipboard(webhook.secret)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Secret
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleWebhookStatus(webhook)}>
                          {webhook.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(webhook)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(webhook.id)}>
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
