-- Open capacity board: anyone (traveler, SACCO agent, bus driver, cargo company) can post available capacity
CREATE TABLE public.capacity_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL,
  provider_type text NOT NULL DEFAULT 'traveler', -- traveler | sacco | bus | cargo_agent | airline | company
  provider_name text NOT NULL,
  contact_phone text,
  contact_email text,
  origin_city text NOT NULL,
  origin_country text NOT NULL,
  destination_city text NOT NULL,
  destination_country text NOT NULL,
  is_international boolean NOT NULL DEFAULT false,
  transport_mode text NOT NULL DEFAULT 'road', -- road | air | sea | rail
  departure_date date NOT NULL,
  arrival_date date,
  available_kg numeric NOT NULL,
  price_per_kg numeric NOT NULL,
  currency text NOT NULL DEFAULT 'KES',
  min_kg numeric DEFAULT 1,
  accepts_documents boolean DEFAULT true,
  accepts_fragile boolean DEFAULT false,
  notes text,
  status text NOT NULL DEFAULT 'open', -- open | full | closed | expired
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.capacity_listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.capacity_listings TO authenticated;
GRANT ALL ON public.capacity_listings TO service_role;

ALTER TABLE public.capacity_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open capacity listings"
  ON public.capacity_listings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can publish capacity"
  ON public.capacity_listings FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can update own listings"
  ON public.capacity_listings FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can delete own listings"
  ON public.capacity_listings FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());

-- Bookings against capacity
CREATE TABLE public.capacity_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.capacity_listings(id) ON DELETE CASCADE,
  shipper_id uuid NOT NULL,
  kg_booked numeric NOT NULL,
  total_price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'KES',
  package_description text,
  status text NOT NULL DEFAULT 'requested', -- requested | confirmed | declined | completed | cancelled
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.capacity_bookings TO authenticated;
GRANT ALL ON public.capacity_bookings TO service_role;

ALTER TABLE public.capacity_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shipper and provider can view booking"
  ON public.capacity_bookings FOR SELECT
  TO authenticated
  USING (
    shipper_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.capacity_listings l WHERE l.id = listing_id AND l.provider_id = auth.uid())
  );

CREATE POLICY "Shippers can create bookings"
  ON public.capacity_bookings FOR INSERT
  TO authenticated
  WITH CHECK (shipper_id = auth.uid());

CREATE POLICY "Shipper or provider can update booking"
  ON public.capacity_bookings FOR UPDATE
  TO authenticated
  USING (
    shipper_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.capacity_listings l WHERE l.id = listing_id AND l.provider_id = auth.uid())
  );

CREATE INDEX idx_capacity_listings_route ON public.capacity_listings(origin_country, destination_country, departure_date) WHERE status = 'open';
CREATE INDEX idx_capacity_listings_intl ON public.capacity_listings(is_international, departure_date) WHERE status = 'open';