
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Webhook, Plus, Trash2, TestTube, Globe } from 'lucide-react';

interface WebhookData {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  last_triggered_at?: string;
}

const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[]
  });
  const { toast } = useToast();

  const availableEvents = [
    'shipment.created',
    'shipment.updated',
    'shipment.delivered',
    'bid.created',
    'bid.accepted',
    'payment.completed',
    'user.registered'
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error: any) {
      toast({
        title: "Fetch Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async () => {
    if (!newWebhook.url || newWebhook.events.length === 0) {
      toast({
        title: "Validation Error",
        description: "URL and at least one event are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('webhooks')
        .insert({
          url: newWebhook.url,
          events: newWebhook.events,
          business_id: user.id,
          secret: generateWebhookSecret(),
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Webhook Created",
        description: "Webhook has been created successfully"
      });

      setNewWebhook({ url: '', events: [] });
      setShowNewWebhookDialog(false);
      await fetchWebhooks();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', webhookId);

      if (error) throw error;

      toast({
        title: "Webhook Deleted",
        description: "Webhook has been removed successfully"
      });

      await fetchWebhooks();
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const testWebhook = async (webhook: WebhookData) => {
    try {
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: { message: 'This is a test webhook' }
      };

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': 'test-signature'
        },
        body: JSON.stringify(testPayload)
      });

      if (response.ok) {
        toast({
          title: "Test Successful",
          description: "Webhook endpoint responded successfully"
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const generateWebhookSecret = () => {
    return `whsec_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
  };

  const toggleWebhookStatus = async (webhookId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .update({ is_active: !currentStatus })
        .eq('id', webhookId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Webhook ${!currentStatus ? 'activated' : 'deactivated'}`
      });

      await fetchWebhooks();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Webhook className="h-5 w-5 mr-2" />
            Webhooks
          </span>
          <Dialog open={showNewWebhookDialog} onOpenChange={setShowNewWebhookDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Endpoint URL</label>
                  <Input
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://your-site.com/webhooks"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Events to Subscribe</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableEvents.map((event) => (
                      <div key={event} className="flex items-center space-x-2">
                        <Checkbox
                          checked={newWebhook.events.includes(event)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewWebhook(prev => ({
                                ...prev,
                                events: [...prev.events, event]
                              }));
                            } else {
                              setNewWebhook(prev => ({
                                ...prev,
                                events: prev.events.filter(e => e !== event)
                              }));
                            }
                          }}
                        />
                        <label className="text-sm">{event}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={createWebhook} className="w-full">
                  Create Webhook
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : webhooks.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No webhooks configured yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{webhook.url}</h4>
                    <Badge variant={webhook.is_active ? "default" : "secondary"}>
                      {webhook.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(webhook.created_at).toLocaleDateString()}
                    {webhook.last_triggered_at && (
                      <span className="ml-4">
                        Last triggered: {new Date(webhook.last_triggered_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testWebhook(webhook)}
                  >
                    <TestTube className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleWebhookStatus(webhook.id, webhook.is_active)}
                  >
                    {webhook.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteWebhook(webhook.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebhookManager;
