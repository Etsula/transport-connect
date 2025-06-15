
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PrivacySettings {
  id: string;
  user_id: string;
  allow_location_tracking: boolean;
  allow_extended_tracking: boolean;
  emergency_tracking_consent: boolean;
  data_retention_days: number;
  created_at: string;
  updated_at: string;
}

export const usePrivacySettings = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData.id) {
      fetchPrivacySettings();
    }
  }, [userData.id]);

  const fetchPrivacySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSettings(data);
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySettings = async (updates: Partial<PrivacySettings>) => {
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: userData.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      
      // Log consent change
      await supabase.from('tracking_consent_log').insert({
        user_id: userData.id,
        consent_type: 'privacy_update',
        consent_given: true,
        created_at: new Date().toISOString()
      });

      toast({
        title: "Privacy settings updated",
        description: "Your tracking preferences have been saved"
      });

      return data;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    settings,
    loading,
    updatePrivacySettings,
    refreshSettings: fetchPrivacySettings
  };
};
