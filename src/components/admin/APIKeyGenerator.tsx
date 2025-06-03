
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, Key, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIKeyManager } from '@/services/APIKeyManager';

const APIKeyGenerator = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [environment, setEnvironment] = useState<'prod' | 'test' | 'dev'>('prod');
  const [tier, setTier] = useState<'starter' | 'business' | 'enterprise'>('starter');
  const [generatedKey, setGeneratedKey] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateKey = async () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const newKey = APIKeyManager.generateAPIKey(environment);
      setGeneratedKey(newKey);
      
      toast({
        title: "API Key Generated",
        description: "New API key has been created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard"
    });
  };

  const tierInfo = APIKeyManager.getTierLimits(tier);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            Generate New API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="Company or Developer Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="contact@company.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="environment">Environment</Label>
              <Select value={environment} onValueChange={(value: 'prod' | 'test' | 'dev') => setEnvironment(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prod">Production</SelectItem>
                  <SelectItem value="test">Testing</SelectItem>
                  <SelectItem value="dev">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tier">Subscription Tier</Label>
              <Select value={tier} onValueChange={(value: 'starter' | 'business' | 'enterprise') => setTier(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter (KSh 10,000/month)</SelectItem>
                  <SelectItem value="business">Business (KSh 50,000/month)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (KSh 200,000/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Selected Tier Benefits:</h4>
            <div className="space-y-1 text-sm">
              <div>Rate Limit: {tierInfo.rateLimit.toLocaleString()} requests/hour</div>
              <div>Monthly Quota: {tierInfo.monthlyQuota === -1 ? 'Unlimited' : tierInfo.monthlyQuota.toLocaleString()}</div>
              <div>Price: KSh {tierInfo.price.toLocaleString()}/month</div>
            </div>
          </div>

          <Button onClick={handleGenerateKey} disabled={isGenerating} className="w-full">
            {isGenerating ? 'Generating...' : 'Generate API Key'}
          </Button>

          {generatedKey && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600">
                  Save this key securely. It won't be shown again.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={generatedKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{environment}</Badge>
                <Badge variant="outline">{tier}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeyGenerator;
