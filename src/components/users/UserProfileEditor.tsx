
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { User, Building, Phone, Mail, MapPin } from 'lucide-react';

const UserProfileEditor = () => {
  const { userData, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    company_name: userData.profile?.company_name || '',
    phone: userData.profile?.phone || '',
    user_type: userData.userType || 'shipper',
    address: '',
    bio: '',
    website: ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: profile.company_name,
          phone: profile.phone,
          user_type: profile.user_type
        })
        .eq('id', userData.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });

      refreshProfile();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              <Building className="h-4 w-4 inline mr-2" />
              Company Name
            </label>
            <Input
              value={profile.company_name}
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone Number
            </label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            <Mail className="h-4 w-4 inline mr-2" />
            Email Address
          </label>
          <Input
            value={userData.email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">User Type</label>
          <Select value={profile.user_type} onValueChange={(value) => setProfile({ ...profile, user_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shipper">Shipper</SelectItem>
              <SelectItem value="transporter">Transporter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            <MapPin className="h-4 w-4 inline mr-2" />
            Address
          </label>
          <Input
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            placeholder="Your business address"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Website</label>
          <Input
            value={profile.website}
            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Bio</label>
          <Textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell us about your business..."
            rows={4}
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfileEditor;
