
CREATE OR REPLACE FUNCTION public.prevent_user_type_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.user_type IS DISTINCT FROM OLD.user_type THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_type = 'admin') THEN
      RAISE EXCEPTION 'Changing user_type is not permitted';
    END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_prevent_user_type_change ON public.profiles;
CREATE TRIGGER trg_prevent_user_type_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_user_type_change();

DO $$
DECLARE t text; pol record;
BEGIN
  FOREACH t IN ARRAY ARRAY['system_settings','payments_escrow','transactions','referrals','referral_payouts','audit_logs','invoices','invoice_items','notifications','shipment_tracking'] LOOP
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t AND (qual='true' OR with_check='true') LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
    END LOOP;
    EXECUTE format('DROP POLICY IF EXISTS "service_role_full_access" ON public.%I', t);
    EXECUTE format('CREATE POLICY "service_role_full_access" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can read own transactions" ON public.transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can read own escrow" ON public.payments_escrow FOR SELECT TO authenticated USING (shipper_id = auth.uid() OR transporter_id = auth.uid());
CREATE POLICY "Users can read own referrals" ON public.referrals FOR SELECT TO authenticated USING (referrer_id = auth.uid() OR referred_user_id = auth.uid());
CREATE POLICY "Users can read own referral payouts" ON public.referral_payouts FOR SELECT TO authenticated USING (referrer_id = auth.uid());
CREATE POLICY "Users can read own invoices" ON public.invoices FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can read own invoice items" ON public.invoice_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid()));
CREATE POLICY "Users can read tracking for own shipments" ON public.shipment_tracking FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.shipments s WHERE s.id = shipment_id AND s.shipper_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.bids b WHERE b.shipment_id = shipment_tracking.shipment_id AND b.transporter_id = auth.uid() AND b.status = 'accepted'));
CREATE POLICY "Authenticated can read system_settings" ON public.system_settings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view open capacity listings" ON public.capacity_listings;
CREATE POLICY "Authenticated can view open capacity listings" ON public.capacity_listings FOR SELECT TO authenticated USING (status = 'open');

CREATE OR REPLACE VIEW public.capacity_listings_public WITH (security_invoker = true) AS
SELECT id, provider_type, provider_name, origin_city, origin_country, destination_city, destination_country, is_international, transport_mode, departure_date, arrival_date, available_kg, price_per_kg, currency, min_kg, accepts_documents, accepts_fragile, notes, status, created_at
FROM public.capacity_listings WHERE status = 'open';
GRANT SELECT ON public.capacity_listings_public TO anon, authenticated;

DROP POLICY IF EXISTS "Users can view all agents" ON public.agents;
CREATE POLICY "Users can view own agents" ON public.agents FOR SELECT TO authenticated
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_type = 'admin'));

ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can subscribe to own shipment channels" ON realtime.messages;
CREATE POLICY "Authenticated can subscribe to own shipment channels" ON realtime.messages FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.shipments s WHERE realtime.messages.topic = 'shipment:' || s.id::text AND s.shipper_id = auth.uid()));
