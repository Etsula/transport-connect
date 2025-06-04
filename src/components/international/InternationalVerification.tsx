
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const InternationalVerification = () => {
  const { userData, authenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [capability, setCapability] = useState({
    supports_international: false,
    verified_countries: [] as string[],
    customs_license_number: '',
    customs_license_expiry: '',
    verification_status: 'pending'
  });

  const countries = [
    'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'South Sudan', 'Ethiopia', 'Somalia',
    'UAE', 'Saudi Arabia', 'Qatar', 'India', 'China', 'United Kingdom', 'United States'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  useEffect(() => {
    if (authenticated && userData.id) {
      fetchCapability();
    }
  }, [authenticated, userData.id]);

  const fetchCapability = async () => {
    try {
      const { data, error } = await supabase
        .from('international_capabilities')
        .select('*')
        .eq('transporter_id', userData.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching capability:', error);
        return;
      }

      if (data) {
        setCapability({
          supports_international: data.supports_international || false,
          verified_countries: data.verified_countries || [],
          customs_license_number: data.customs_license_number || '',
          customs_license_expiry: data.customs_license_expiry ? 
            new Date(data.customs_license_expiry).toISOString().split('T')[0] : '',
          verification_status: data.verification_status || 'pending'
        });
      }
    } catch (error) {
      console.error('Error in fetchCapability:', error);
    }
  };

  const submitForVerification = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('international_capabilities')
        .upsert({
          transporter_id: userData.id,
          supports_international: capability.supports_international,
          verified_countries: capability.verified_countries,
          customs_license_number: capability.customs_license_number,
          customs_license_expiry: capability.customs_license_expiry || null,
          verification_status: 'pending',
          verification_documents: {
            submitted_at: new Date().toISOString(),
            license_provided: !!capability.customs_license_number
          }
        });

      if (error) throw error;

      toast({
        title: "Verification Submitted",
        description: "Your international shipping capabilities have been submitted for review"
      });

      await fetchCapability();
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Error",
        description: "Failed to submit verification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country: string, checked: boolean) => {
    setCapability(prev => ({
      ...prev,
      verified_countries: checked 
        ? [...prev.verified_countries, country]
        : prev.verified_countries.filter(c => c !== country)
    }));
  };

  if (!authenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to manage international shipping verification.</p>
        </CardContent>
      </Card>
    );
  }

  if (userData.userType !== 'transporter') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">International verification is only available for transporters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            International Shipping Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            {getStatusIcon(capability.verification_status)}
            <div>
              <p className="font-medium">Verification Status</p>
              <Badge className={getStatusColor(capability.verification_status)}>
                {capability.verification_status}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="supports_international"
                checked={capability.supports_international}
                onCheckedChange={(checked) => 
                  setCapability(prev => ({ ...prev, supports_international: !!checked }))
                }
              />
              <Label htmlFor="supports_international">
                I want to provide international shipping services
              </Label>
            </div>

            {capability.supports_international && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="customs_license">Customs License Number</Label>
                  <Input
                    id="customs_license"
                    value={capability.customs_license_number}
                    onChange={(e) => setCapability(prev => ({ 
                      ...prev, 
                      customs_license_number: e.target.value 
                    }))}
                    placeholder="Enter your customs license number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_expiry">License Expiry Date</Label>
                  <Input
                    id="license_expiry"
                    type="date"
                    value={capability.customs_license_expiry}
                    onChange={(e) => setCapability(prev => ({ 
                      ...prev, 
                      customs_license_expiry: e.target.value 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Countries you can ship to/from:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {countries.map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={country}
                          checked={capability.verified_countries.includes(country)}
                          onCheckedChange={(checked) => handleCountryChange(country, !!checked)}
                        />
                        <Label htmlFor={country} className="text-sm">{country}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={submitForVerification} 
                  disabled={loading || capability.verification_status === 'verified'}
                  className="w-full"
                >
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Valid customs license for international shipping</li>
            <li>• Proven track record of successful domestic deliveries</li>
            <li>• Insurance coverage for international shipments</li>
            <li>• Knowledge of customs procedures for selected countries</li>
            <li>• Ability to handle required documentation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternationalVerification;
