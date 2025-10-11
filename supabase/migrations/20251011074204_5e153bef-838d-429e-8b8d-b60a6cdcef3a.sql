-- Security Fixes: Step 2 - Fix remaining policies and secure edge functions preparation

-- First check which policies exist and drop duplicates
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create the correct profile policies 
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- Ensure shipments view is created properly for marketplace
DROP VIEW IF EXISTS public.shipments_public CASCADE;
CREATE VIEW public.shipments_public AS
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

-- Set up proper permissions for the view
GRANT SELECT ON public.shipments_public TO authenticated, anon;