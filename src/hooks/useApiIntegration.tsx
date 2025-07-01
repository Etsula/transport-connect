
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
}

export const useApiIntegration = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userData } = useAuth();

  const generateApiKey = async (name: string, permissions: string[]) => {
    if (!userData?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate API keys",
        variant: "destructive"
      });
      return { success: false, key: null };
    }

    setLoading(true);
    try {
      const fullKey = `gd_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      const keyHash = await hashApiKey(fullKey);
      const keyPrefix = fullKey.substring(0, 8) + '...';

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          permissions: permissions,
          is_active: true,
          user_id: userData.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "API Key Generated",
        description: "Please copy this key as it won't be shown again",
      });

      await fetchApiKeys();
      return { success: true, key: fullKey };
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, key: null };
    } finally {
      setLoading(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;

      toast({
        title: "API Key Revoked",
        description: "The API key has been deactivated"
      });

      await fetchApiKeys();
    } catch (error: any) {
      toast({
        title: "Revocation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchApiKeys = async () => {
    if (!userData?.id) return;

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        key_prefix: item.key_prefix,
        permissions: Array.isArray(item.permissions) ? item.permissions : [],
        created_at: item.created_at,
        last_used_at: item.last_used_at,
        is_active: item.is_active
      }));
      
      setApiKeys(transformedData);
    } catch (error: any) {
      toast({
        title: "Fetch Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const hashApiKey = async (key: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const makeApiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('api_key')}`
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      toast({
        title: "API Call Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    apiKeys,
    loading,
    generateApiKey,
    revokeApiKey,
    fetchApiKeys,
    makeApiCall
  };
};
