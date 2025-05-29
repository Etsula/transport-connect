
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Key, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  permissions: string[];
}

const APIKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'bdk_live_1234567890abcdef',
      created: '2024-01-15',
      lastUsed: '2024-01-20',
      permissions: ['read', 'write', 'delete']
    }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const generateAPIKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive"
      });
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `bdk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created: new Date().toISOString().split('T')[0],
      permissions: ['read', 'write']
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    
    toast({
      title: "API Key Generated",
      description: "Your new API key has been created successfully"
    });
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard"
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const deleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    toast({
      title: "API Key Deleted",
      description: "The API key has been permanently deleted"
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '****' + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="keyName">API Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production API, Development"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={generateAPIKey} className="w-full md:w-auto">
                  Generate New Key
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{apiKey.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {apiKey.created}
                      {apiKey.lastUsed && ` • Last used: ${apiKey.lastUsed}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteKey(apiKey.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {apiKeys.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No API keys yet. Generate your first key to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Authentication</h4>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                Authorization: Bearer your_api_key_here
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Base URL</h4>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                https://api.iship.co.ke/v1
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Rate Limits</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Basic Plan: 1,000 requests/hour</li>
                <li>• Professional Plan: 10,000 requests/hour</li>
                <li>• Enterprise Plan: Unlimited</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeyManagement;
