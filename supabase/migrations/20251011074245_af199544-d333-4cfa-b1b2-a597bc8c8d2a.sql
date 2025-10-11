-- Fix security definer view and function search paths

-- Drop and recreate view without security definer
DROP VIEW IF EXISTS public.shipments_public CASCADE;
CREATE VIEW public.shipments_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  description,
  package_type,
  weight,
  delivery_urgency,
  status,
  created_at,
  pickup_location,
  delivery_location
FROM public.shipments
WHERE status = 'open';

GRANT SELECT ON public.shipments_public TO authenticated, anon;

-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    referral_code text;
BEGIN
    referral_code := 'REF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-' || floor(random() * 10000)::text;
    RETURN referral_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  inv_number TEXT;
BEGIN
  SELECT 'INV-' || to_char(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_sequence')::TEXT, 6, '0') INTO inv_number;
  RETURN inv_number;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_user_privacy_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_privacy_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_user_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.referral_codes (user_id, code)
  VALUES (NEW.id, generate_referral_code());
  RETURN NEW;
END;
$function$;