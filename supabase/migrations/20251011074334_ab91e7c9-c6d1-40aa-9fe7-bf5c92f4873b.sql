-- Fix remaining function search paths

CREATE OR REPLACE FUNCTION public.get_referral_chain_distance(target_user_id uuid, source_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  distance INTEGER := 0;
  current_user UUID := target_user_id;
  max_depth INTEGER := 5;
BEGIN
  WHILE distance < max_depth AND current_user IS NOT NULL LOOP
    IF current_user = source_user_id THEN
      RETURN distance;
    END IF;
    
    SELECT referrer_id INTO current_user
    FROM public.referral_chains
    WHERE user_id = current_user;
    
    distance := distance + 1;
  END LOOP;
  
  RETURN -1;
END;
$function$;

CREATE OR REPLACE FUNCTION public.can_enable_enhanced_tracking(target_user_id uuid, reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  privacy_settings RECORD;
  tracking_triggers TEXT[] := ARRAY['overdue', 'dispute', 'safety_concern', 'failed_delivery'];
BEGIN
  SELECT * INTO privacy_settings 
  FROM public.user_privacy_settings 
  WHERE user_id = target_user_id;
  
  IF NOT FOUND THEN
    RETURN reason = ANY(tracking_triggers);
  END IF;
  
  IF reason = 'emergency' THEN
    RETURN privacy_settings.emergency_tracking_consent;
  ELSIF reason = ANY(tracking_triggers) THEN
    RETURN privacy_settings.allow_extended_tracking OR privacy_settings.emergency_tracking_consent;
  ELSE
    RETURN privacy_settings.allow_location_tracking;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_referral_qualifications(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  delivery_count INTEGER;
  avg_rating NUMERIC;
  is_qualified BOOLEAN := FALSE;
BEGIN
  SELECT 
    COUNT(DISTINCT r.shipment_id),
    AVG(r.rating)
  INTO delivery_count, avg_rating
  FROM public.reviews r
  WHERE r.reviewed_id = user_id;
  
  IF delivery_count >= 10 AND avg_rating >= 5.0 THEN
    is_qualified := TRUE;
  END IF;
  
  INSERT INTO public.referral_qualifications (
    user_id,
    min_deliveries,
    min_rating,
    is_highly_rated,
    last_qualification_check
  ) VALUES (
    user_id,
    delivery_count,
    COALESCE(avg_rating, 0),
    is_qualified,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    min_deliveries = delivery_count,
    min_rating = COALESCE(avg_rating, 0),
    is_highly_rated = is_qualified,
    last_qualification_check = now();
    
  RETURN is_qualified;
END;
$function$;