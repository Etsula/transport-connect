
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plane, MapPin, Calendar, Package, Star, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TravelerProfile {
  id: string;
  travel_routes: any;
  available_capacity_kg: number;
  next_travel_date: string;
  destination_country: string;
  origin_country: string;
  is_verified: boolean;
  total_deliveries: number;
  current_rating: number;
  is_active: boolean;
}

const TravelerManagement: React.FC = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<TravelerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    origin_country: '',
    destination_country: '',
    next_travel_date: '',
    available_capacity_kg: 5,
    travel_routes: ''
  });

  useEffect(() => {
    fetchTravelerProfile();
  }, [userData.id]);

  const fetchTravelerProfile = async () => {
    if (!userData.id) return;

    try {
      const { data, error } = await supabase
        .from('travelers')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setFormData({
          origin_country: data.origin_country || '',
          destination_country: data.destination_country || '',
          next_travel_date: data.next_travel_date ? data.next_travel_date.split('T')[0] : '',
          available_capacity_kg: data.available_capacity_kg || 5,
          travel_routes: data.travel_routes ? JSON.stringify(data.travel_routes) : ''
        });
      }
    } catch (error) {
      console.error('Error fetching traveler profile:', error);
    }
  };

  const saveTravelerProfile = async () => {
    if (!userData.id) return;

    try {
      const profileData = {
        user_id: userData.id,
        origin_country: formData.origin_country,
        destination_country: formData.destination_country,
        next_travel_date: formData.next_travel_date ? new Date(formData.next_travel_date).toISOString() : null,
        available_capacity_kg: formData.available_capacity_kg,
        travel_routes: formData.travel_routes ? JSON.parse(formData.travel_routes) : null,
        is_active: true
      };

      if (profile) {
        const { error } = await supabase
          .from('travelers')
          .update(profileData)
          .eq('id', profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('travelers')
          .insert(profileData);
        if (error) throw error;
      }

      toast({
        title: "Profile saved",
        description: "Your traveler profile has been updated"
      });

      setIsEditing(false);
      fetchTravelerProfile();
    } catch (error) {
      console.error('Error saving traveler profile:', error);
      toast({
        title: "Save failed",
        description: "Failed to save traveler profile",
        variant: "destructive"
      });
    }
  };

  const requestVerification = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('travelers')
        .update({ 
          verification_documents: { status: 'submitted', submitted_at: new Date().toISOString() }
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Verification requested",
        description: "Your verification request has been submitted"
      });

      fetchTravelerProfile();
    } catch (error) {
      console.error('Error requesting verification:', error);
    }
  };

  if (!profile && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Become a Traveler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Earn commissions by delivering packages while you travel. Join our network of verified travelers.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Benefits of being a Traveler:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Earn money while traveling</li>
              <li>• Help others send packages internationally</li>
              <li>• Flexible delivery options</li>
              <li>• Build your reputation and ratings</li>
            </ul>
          </div>

          <Button onClick={() => setIsEditing(true)} className="w-full">
            Create Traveler Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            {profile ? 'Edit' : 'Create'} Traveler Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Origin Country</label>
              <Input
                value={formData.origin_country}
                onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
                placeholder="e.g., United Kingdom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Destination Country</label>
              <Input
                value={formData.destination_country}
                onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                placeholder="e.g., United States"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Next Travel Date</label>
              <Input
                type="date"
                value={formData.next_travel_date}
                onChange={(e) => setFormData({ ...formData, next_travel_date: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Available Capacity (kg)</label>
              <Input
                type="number"
                value={formData.available_capacity_kg}
                onChange={(e) => setFormData({ ...formData, available_capacity_kg: Number(e.target.value) })}
                min="1"
                max="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Travel Routes (JSON format)</label>
            <Textarea
              value={formData.travel_routes}
              onChange={(e) => setFormData({ ...formData, travel_routes: e.target.value })}
              placeholder='{"regular_routes": ["London-NYC", "Manchester-LA"], "frequency": "monthly"}'
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={saveTravelerProfile}>
              {profile ? 'Update' : 'Create'} Profile
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Traveler Profile
            </div>
            <div className="flex items-center gap-2">
              {profile.is_verified && (
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge className={profile.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-medium">
                  {profile.origin_country} → {profile.destination_country}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Next Travel</p>
                <p className="font-medium">
                  {profile.next_travel_date 
                    ? new Date(profile.next_travel_date).toLocaleDateString()
                    : 'Not scheduled'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-medium">{profile.available_capacity_kg} kg</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-medium">
                  {profile.current_rating.toFixed(1)} ({profile.total_deliveries} deliveries)
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
            
            {!profile.is_verified && (
              <Button onClick={requestVerification}>
                Request Verification
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelerManagement;
