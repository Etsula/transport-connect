
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemSetting {
  key: string;
  value: any;
  description?: string;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>) || {};

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching system settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue?: any) => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  const getCommissionRate = (isInternational: boolean = false) => {
    const key = isInternational ? 'platform_commission_international' : 'platform_commission_local';
    return parseFloat(getSetting(key, isInternational ? '8' : '12')) / 100;
  };

  const getReferralCommissionRate = () => {
    return parseFloat(getSetting('referral_commission_percentage', '5')) / 100;
  };

  const getMinimumPayoutAmount = () => {
    return parseFloat(getSetting('minimum_payout_amount', '10'));
  };

  return {
    settings,
    loading,
    getSetting,
    getCommissionRate,
    getReferralCommissionRate,
    getMinimumPayoutAmount,
    refreshSettings: fetchSettings
  };
};
