
-- Create enhanced tracking audit table
CREATE TABLE public.tracking_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  shipment_id UUID,
  access_type TEXT NOT NULL, -- 'location_access', 'data_request', 'emergency_override'
  accessed_by UUID,
  access_reason TEXT,
  data_accessed JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create privacy settings table
CREATE TABLE public.user_privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  allow_location_tracking BOOLEAN DEFAULT true,
  allow_extended_tracking BOOLEAN DEFAULT false,
  emergency_tracking_consent BOOLEAN DEFAULT true,
  data_retention_days INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create conditional tracking table
CREATE TABLE public.conditional_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  shipment_id UUID,
  tracking_level TEXT NOT NULL DEFAULT 'minimal', -- 'minimal', 'enhanced', 'emergency'
  trigger_reason TEXT, -- 'overdue', 'dispute', 'safety_concern', 'failed_delivery'
  activated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deactivated_at TIMESTAMP WITH TIME ZONE,
  activated_by UUID,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB
);

-- Create tracking consent log
CREATE TABLE public.tracking_consent_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL, -- 'location', 'enhanced', 'emergency'
  consent_given BOOLEAN NOT NULL,
  shipment_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.tracking_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditional_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_consent_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own privacy settings
CREATE POLICY "Users can view own privacy settings" 
  ON public.user_privacy_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can update their own privacy settings
CREATE POLICY "Users can update own privacy settings" 
  ON public.user_privacy_settings 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Users can view their own tracking audit
CREATE POLICY "Users can view own tracking audit" 
  ON public.tracking_audit 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = accessed_by);

-- Users can view conditional tracking related to them
CREATE POLICY "Users can view related conditional tracking" 
  ON public.conditional_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can view their own consent log
CREATE POLICY "Users can view own consent log" 
  ON public.tracking_consent_log 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Function to automatically create privacy settings for new users
CREATE OR REPLACE FUNCTION public.create_user_privacy_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_privacy_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create privacy settings when user profile is created
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_user_privacy_settings();

-- Function to check if enhanced tracking is allowed
CREATE OR REPLACE FUNCTION public.can_enable_enhanced_tracking(target_user_id UUID, reason TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  privacy_settings RECORD;
  tracking_triggers TEXT[] := ARRAY['overdue', 'dispute', 'safety_concern', 'failed_delivery'];
BEGIN
  -- Get user's privacy settings
  SELECT * INTO privacy_settings 
  FROM public.user_privacy_settings 
  WHERE user_id = target_user_id;
  
  -- If no settings found, use defaults (conservative approach)
  IF NOT FOUND THEN
    RETURN reason = ANY(tracking_triggers);
  END IF;
  
  -- Check if user has consented to the type of tracking needed
  IF reason = 'emergency' THEN
    RETURN privacy_settings.emergency_tracking_consent;
  ELSIF reason = ANY(tracking_triggers) THEN
    RETURN privacy_settings.allow_extended_tracking OR privacy_settings.emergency_tracking_consent;
  ELSE
    RETURN privacy_settings.allow_location_tracking;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for tracking tables
ALTER TABLE public.conditional_tracking REPLICA IDENTITY FULL;
ALTER TABLE public.transporter_locations REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.conditional_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transporter_locations;
