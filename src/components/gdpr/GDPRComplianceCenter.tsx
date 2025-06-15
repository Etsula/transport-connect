
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Trash2, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GDPRRequest {
  id: string;
  request_type: string;
  status: string;
  requested_at: string;
  processed_at?: string;
  download_url?: string;
  expires_at?: string;
}

const GDPRComplianceCenter: React.FC = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<GDPRRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGDPRRequests();
  }, [userData.id]);

  const fetchGDPRRequests = async () => {
    if (!userData.id) return;

    try {
      const { data, error } = await supabase
        .from('gdpr_requests')
        .select('*')
        .eq('user_id', userData.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching GDPR requests:', error);
    }
  };

  const createGDPRRequest = async (requestType: string) => {
    if (!userData.id) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: userData.id,
          request_type: requestType,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Request submitted",
        description: `Your ${requestType.replace('_', ' ')} request has been submitted and will be processed within 30 days.`
      });

      fetchGDPRRequests();
    } catch (error) {
      console.error('Error creating GDPR request:', error);
      toast({
        title: "Request failed",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'data_export': return <Download className="h-4 w-4" />;
      case 'data_deletion': return <Trash2 className="h-4 w-4" />;
      case 'data_portability': return <FileText className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            GDPR Compliance Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage your data privacy rights according to GDPR regulations. You can request data exports, 
            deletion, or portability at any time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => createGDPRRequest('data_export')}
              disabled={loading}
              variant="outline"
              className="h-20 flex-col"
            >
              <Download className="h-6 w-6 mb-2" />
              Export My Data
            </Button>
            
            <Button
              onClick={() => createGDPRRequest('data_portability')}
              disabled={loading}
              variant="outline"
              className="h-20 flex-col"
            >
              <FileText className="h-6 w-6 mb-2" />
              Data Portability
            </Button>
            
            <Button
              onClick={() => createGDPRRequest('data_deletion')}
              disabled={loading}
              variant="outline"
              className="h-20 flex-col text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-6 w-6 mb-2" />
              Delete My Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No GDPR requests found</p>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRequestTypeIcon(request.request_type)}
                    <div>
                      <p className="font-medium">
                        {request.request_type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    
                    {request.status === 'completed' && request.download_url && (
                      <Button size="sm" asChild>
                        <a href={request.download_url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRComplianceCenter;
