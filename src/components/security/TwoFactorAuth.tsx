
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, Smartphone, Key } from 'lucide-react';

const TwoFactorAuth = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [setupStep, setSetupStep] = useState(0);
  const { toast } = useToast();

  const handleEnable2FA = async () => {
    try {
      // This would integrate with your 2FA provider
      setIsEnabled(true);
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable 2FA",
        variant: "destructive"
      });
    }
  };

  const handleDisable2FA = async () => {
    try {
      setIsEnabled(false);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable 2FA",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-gray-500">
                  Use an authenticator app to generate verification codes
                </p>
              </div>
            </div>
            <Button
              onClick={isEnabled ? handleDisable2FA : handleEnable2FA}
              variant={isEnabled ? "destructive" : "default"}
            >
              {isEnabled ? "Disable" : "Enable"}
            </Button>
          </div>

          {!isEnabled && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Setup Instructions
                </h4>
                <ol className="mt-2 text-sm space-y-1 list-decimal list-inside">
                  <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                  <li>Scan the QR code with your app</li>
                  <li>Enter the 6-digit code from your app</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <Input
                  placeholder="Enter 6-digit verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
                <Button onClick={handleEnable2FA} className="w-full">
                  Verify and Enable 2FA
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuth;
