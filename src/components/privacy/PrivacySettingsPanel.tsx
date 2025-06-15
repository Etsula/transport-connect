
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';
import { Shield, MapPin, AlertTriangle, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const PrivacySettingsPanel = () => {
  const { settings, loading, updatePrivacySettings } = usePrivacySettings();

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  const handleSettingChange = async (key: string, value: boolean | number) => {
    await updatePrivacySettings({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Privacy & Tracking Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Basic Location Tracking */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <Label htmlFor="location-tracking">Basic Location Tracking</Label>
            </div>
            <Switch
              id="location-tracking"
              checked={settings?.allow_location_tracking ?? true}
              onCheckedChange={(checked) => handleSettingChange('allow_location_tracking', checked)}
            />
          </div>
          <p className="text-sm text-gray-500 ml-6">
            Allow location sharing during active deliveries. Required for shipment tracking.
          </p>
        </div>

        <Separator />

        {/* Extended Tracking */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <Label htmlFor="extended-tracking">Extended Tracking</Label>
            </div>
            <Switch
              id="extended-tracking"
              checked={settings?.allow_extended_tracking ?? false}
              onCheckedChange={(checked) => handleSettingChange('allow_extended_tracking', checked)}
            />
          </div>
          <p className="text-sm text-gray-500 ml-6">
            Allow enhanced tracking when shipments are overdue or disputes arise.
          </p>
        </div>

        <Separator />

        {/* Emergency Tracking */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <Label htmlFor="emergency-tracking">Emergency Tracking</Label>
            </div>
            <Switch
              id="emergency-tracking"
              checked={settings?.emergency_tracking_consent ?? true}
              onCheckedChange={(checked) => handleSettingChange('emergency_tracking_consent', checked)}
            />
          </div>
          <p className="text-sm text-gray-500 ml-6">
            Allow emergency tracking for safety concerns or serious violations.
          </p>
        </div>

        <Separator />

        {/* Data Retention */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <Label>Data Retention Period</Label>
          </div>
          <div className="ml-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">7 days</span>
              <Slider
                value={[settings?.data_retention_days ?? 30]}
                onValueChange={([value]) => handleSettingChange('data_retention_days', value)}
                max={90}
                min={7}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">90 days</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Current setting: {settings?.data_retention_days ?? 30} days
            </p>
          </div>
        </div>

        <Separator />

        {/* Information Box */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">How Your Privacy is Protected</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Location data is only shared during active deliveries</li>
            <li>• Enhanced tracking requires your consent and valid reasons</li>
            <li>• All tracking access is logged and auditable</li>
            <li>• Data is automatically deleted after your retention period</li>
            <li>• You can withdraw consent at any time</li>
          </ul>
        </div>

        {/* Save Button */}
        <Button 
          className="w-full" 
          onClick={() => window.location.reload()}
        >
          Refresh Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrivacySettingsPanel;
