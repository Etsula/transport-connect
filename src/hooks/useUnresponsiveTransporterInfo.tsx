
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TransporterInfo {
  id: string;
  company_name: string;
  phone: string;
  last_seen?: string;
  current_shipments: any[];
  referred_by?: string;
}

export interface LastKnownLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  shipment_id?: string;
}

export const useUnresponsiveTransporterInfo = (transporterId?: string) => {
  const [transporterInfo, setTransporterInfo] = useState<TransporterInfo | null>(null);
  const [lastKnownLocation, setLastKnownLocation] = useState<LastKnownLocation | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTransporterInfo = useCallback(async () => {
    if (!transporterId) return;

    try {
      setLoading(true);
      // Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, company_name, phone')
        .eq('id', transporterId)
        .single();

      if (profileError) throw profileError;

      // Referral
      let referredByCompany: string | undefined = undefined;
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('referred_user_id', transporterId)
        .limit(1)
        .maybeSingle();
      if (!referralError && referralData?.referrer_id) {
        const { data: referrerProfile } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', referralData.referrer_id)
          .single();
        referredByCompany = referrerProfile?.company_name;
      }

      // Shipments
      const { data: shipments } = await supabase
        .from('shipments')
        .select('id, title, status, created_at')
        .eq('assigned_transporter_id', transporterId)
        .in('status', ['assigned', 'in_transit', 'picked_up']);

      setTransporterInfo({
        ...profile,
        current_shipments: shipments || [],
        referred_by: referredByCompany,
      });

    } catch (err){
      setTransporterInfo(null);
      console.error("Failed fetching transporter info", err);
    } finally {
      setLoading(false);
    }
  }, [transporterId]);

  const fetchLastKnownLocation = useCallback(async () => {
    if (!transporterId) return;
    try {
      const { data: location } = await supabase
        .from('transporter_locations')
        .select('latitude, longitude, timestamp, shipment_id')
        .eq('transporter_id', transporterId)
        .order('timestamp', { ascending: false })
        .limit(1);
      if (location && location[0]) setLastKnownLocation(location[0]);
      else setLastKnownLocation(null);
    } catch (err) {
      setLastKnownLocation(null);
      console.error("Failed fetching last known location", err);
    }
  }, [transporterId]);

  return {
    transporterInfo,
    lastKnownLocation,
    loading,
    fetchTransporterInfo,
    fetchLastKnownLocation,
  };
};
