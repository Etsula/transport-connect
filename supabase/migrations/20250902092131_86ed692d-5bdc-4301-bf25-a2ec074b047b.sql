-- Security Fixes: Step 1 - Create admin check function and lock down RLS policies

-- Create admin check function with proper security
CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin role in profiles table
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _uid AND user_type = 'admin'
  );
END;
$$;

-- Drop dangerous public policies on sensitive tables
DROP POLICY IF EXISTS "System can manage system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "System can manage payments_escrow" ON public.payments_escrow;
DROP POLICY IF EXISTS "System can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "System can manage notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can manage invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "System can manage invoices" ON public.invoices;
DROP POLICY IF EXISTS "System can manage referral_payouts" ON public.referral_payouts;
DROP POLICY IF EXISTS "System can manage shipment_tracking" ON public.shipment_tracking;
DROP POLICY IF EXISTS "System can manage audit_logs" ON public.audit_logs;

-- Replace profiles policy to restrict access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile or admin can view all"
ON public.profiles FOR SELECT
USING (id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile or admin can update all"
ON public.profiles FOR UPDATE
USING (id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- Lock down system_settings - admin only
CREATE POLICY "Admin can read system_settings"
ON public.system_settings FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update system_settings" 
ON public.system_settings FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Lock down payments_escrow - owner access only
CREATE POLICY "Users can view own escrow"
ON public.payments_escrow FOR SELECT
USING (shipper_id = auth.uid() OR transporter_id = auth.uid());

-- Lock down transactions - owner access only  
CREATE POLICY "Users can view own transactions"
ON public.transactions FOR SELECT
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Lock down notifications - owner access only
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- Lock down invoices - owner access only
CREATE POLICY "Users can view own invoices"
ON public.invoices FOR SELECT
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Lock down invoice_items - owner access only
CREATE POLICY "Users can view own invoice items"
ON public.invoice_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND (invoices.user_id = auth.uid() OR public.is_admin(auth.uid()))
));

-- Lock down referral_payouts - owner access only
CREATE POLICY "Users can view own referral payouts"
ON public.referral_payouts FOR SELECT
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Lock down shipment_tracking - shipment participants only
CREATE POLICY "Participants can view shipment tracking"
ON public.shipment_tracking FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.shipments 
  WHERE shipments.id = shipment_tracking.shipment_id 
  AND (shipments.shipper_id = auth.uid() OR shipments.transporter_id = auth.uid())
));

CREATE POLICY "Transporters can insert tracking"
ON public.shipment_tracking FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.shipments 
  WHERE shipments.id = shipment_tracking.shipment_id 
  AND shipments.transporter_id = auth.uid()
));

-- Lock down audit_logs - admin only
CREATE POLICY "Admin can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_admin(auth.uid()));

-- Restrict shipments SELECT to reduce PII exposure
DROP POLICY IF EXISTS "Authenticated users can view shipments" ON public.shipments;
CREATE POLICY "Participants can view full shipment details"
ON public.shipments FOR SELECT
USING (shipper_id = auth.uid() OR transporter_id = auth.uid() OR public.is_admin(auth.uid()));

-- Create a public view for open shipments without PII
CREATE OR REPLACE VIEW public.shipments_public AS
SELECT 
  id,
  title,
  description,
  size,
  weight,
  delivery_deadline,
  status,
  created_at
FROM public.shipments
WHERE status = 'open';

-- Enable RLS on the view (if not already enabled)
ALTER VIEW public.shipments_public ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view public shipment listings
CREATE POLICY "Public can view open shipments"
ON public.shipments_public FOR SELECT
USING (auth.role() = 'authenticated');

-- Update database functions to use proper search_path
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  inv_number TEXT;
BEGIN
  SELECT 'INV-' || to_char(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_sequence')::TEXT, 6, '0') INTO inv_number;
  RETURN inv_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_user_privacy_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_privacy_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;