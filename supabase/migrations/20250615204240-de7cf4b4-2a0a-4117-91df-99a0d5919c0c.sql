
-- GDPR Compliance Tools
CREATE TABLE public.gdpr_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('data_export', 'data_deletion', 'data_portability')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  download_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Turn-by-turn Navigation and Route Optimization
CREATE TABLE public.route_waypoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES public.shipments NOT NULL,
  transporter_id UUID REFERENCES auth.users NOT NULL,
  sequence_order INTEGER NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  instruction TEXT,
  distance_to_next NUMERIC,
  estimated_time_minutes INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Offline Maps Cache
CREATE TABLE public.offline_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  region_name TEXT NOT NULL,
  bounds_north NUMERIC NOT NULL,
  bounds_south NUMERIC NOT NULL,
  bounds_east NUMERIC NOT NULL,
  bounds_west NUMERIC NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  file_size_mb NUMERIC,
  is_active BOOLEAN DEFAULT TRUE
);

-- Performance Tracking for Agents/Transporters
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  agent_id UUID REFERENCES public.agents,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('delivery_time', 'customer_satisfaction', 'completion_rate', 'punctuality')),
  metric_value NUMERIC NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_deliveries INTEGER DEFAULT 0,
  successful_deliveries INTEGER DEFAULT 0,
  average_rating NUMERIC DEFAULT 0,
  commission_earned NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Commission Management
CREATE TABLE public.commission_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_type TEXT NOT NULL CHECK (user_type IN ('transporter', 'agent', 'traveler')),
  referral_level INTEGER NOT NULL CHECK (referral_level BETWEEN 1 AND 5),
  commission_percentage NUMERIC NOT NULL CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
  base_commission NUMERIC DEFAULT 0,
  min_deliveries_required INTEGER DEFAULT 0,
  min_rating_required NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Traveling Individuals (Travelers who earn commissions)
CREATE TABLE public.travelers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  travel_routes JSONB, -- Store common travel routes
  available_capacity_kg NUMERIC DEFAULT 5,
  next_travel_date TIMESTAMP WITH TIME ZONE,
  destination_country TEXT,
  origin_country TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  total_deliveries INTEGER DEFAULT 0,
  current_rating NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Multi-level Referral Chain (5 levels max)
CREATE TABLE public.referral_chains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_id UUID NOT NULL, -- Links all members of same chain
  user_id UUID REFERENCES auth.users NOT NULL,
  referrer_id UUID REFERENCES auth.users,
  chain_level INTEGER NOT NULL CHECK (chain_level BETWEEN 1 AND 5),
  referred_by_code TEXT,
  is_qualified BOOLEAN DEFAULT FALSE,
  qualification_date TIMESTAMP WITH TIME ZONE,
  total_deliveries INTEGER DEFAULT 0,
  average_rating NUMERIC DEFAULT 0,
  can_refer BOOLEAN DEFAULT FALSE,
  max_referrals INTEGER DEFAULT 1,
  current_referrals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, chain_id)
);

-- Qualified Referrer Requirements
CREATE TABLE public.referral_qualifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  min_deliveries INTEGER NOT NULL DEFAULT 10,
  min_rating NUMERIC NOT NULL DEFAULT 5.0,
  is_highly_rated BOOLEAN DEFAULT FALSE,
  last_qualification_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  qualification_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Regional Access Control (e.g., UK delivery restrictions)
CREATE TABLE public.regional_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  country_code TEXT NOT NULL,
  region TEXT,
  access_level TEXT NOT NULL CHECK (access_level IN ('sender', 'receiver', 'transporter', 'traveler')),
  max_chain_distance INTEGER DEFAULT 5, -- Max people away in referral chain
  is_active BOOLEAN DEFAULT TRUE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  granted_by UUID REFERENCES auth.users
);

-- Enable RLS
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own GDPR requests" ON public.gdpr_requests
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their route waypoints" ON public.route_waypoints
  FOR ALL USING (auth.uid() = transporter_id);

CREATE POLICY "Users can manage their offline maps" ON public.offline_maps
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their performance metrics" ON public.performance_metrics
  FOR SELECT USING (auth.uid() = user_id OR EXISTS(
    SELECT 1 FROM public.agents WHERE user_id = auth.uid() AND id = performance_metrics.agent_id
  ));

CREATE POLICY "Commission structures are publicly readable" ON public.commission_structures
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their traveler profile" ON public.travelers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their referral chain" ON public.referral_chains
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = referrer_id);

CREATE POLICY "Users can manage their qualifications" ON public.referral_qualifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view relevant regional access" ON public.regional_access
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = granted_by);

-- Function to check referral chain distance
CREATE OR REPLACE FUNCTION public.get_referral_chain_distance(
  target_user_id UUID,
  source_user_id UUID
) RETURNS INTEGER AS $$
DECLARE
  distance INTEGER := 0;
  current_user UUID := target_user_id;
  max_depth INTEGER := 5;
BEGIN
  -- Traverse up the referral chain
  WHILE distance < max_depth AND current_user IS NOT NULL LOOP
    IF current_user = source_user_id THEN
      RETURN distance;
    END IF;
    
    SELECT referrer_id INTO current_user
    FROM public.referral_chains
    WHERE user_id = current_user;
    
    distance := distance + 1;
  END LOOP;
  
  RETURN -1; -- Not in chain or too far
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update referral qualifications
CREATE OR REPLACE FUNCTION public.update_referral_qualifications(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  delivery_count INTEGER;
  avg_rating NUMERIC;
  is_qualified BOOLEAN := FALSE;
BEGIN
  -- Get user's delivery count and rating from reviews
  SELECT 
    COUNT(DISTINCT r.shipment_id),
    AVG(r.rating)
  INTO delivery_count, avg_rating
  FROM public.reviews r
  WHERE r.reviewed_id = user_id;
  
  -- Check qualification criteria
  IF delivery_count >= 10 AND avg_rating >= 5.0 THEN
    is_qualified := TRUE;
  END IF;
  
  -- Update or insert qualification record
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
