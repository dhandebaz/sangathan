-- 1. Risk Events Table
CREATE TABLE public.risk_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text CHECK (entity_type IN ('org', 'user', 'member', 'event')),
  entity_id uuid NOT NULL,
  risk_type text CHECK (risk_type IN ('spam_signup', 'otp_abuse', 'broadcast_spam', 'bot_forms', 'donation_spike', 'unusual_growth', 'suspicious_collaboration')),
  severity text CHECK (severity IN ('low', 'medium', 'high')),
  detected_at timestamptz DEFAULT now(),
  resolved boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- 2. Add Risk Score to Organisations
ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS risk_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('active', 'warning', 'suspended', 'under_review')) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS broadcast_restricted boolean DEFAULT false;

-- 3. OTP Attempts Tracking (Short-lived, can be cleaned up)
CREATE TABLE public.otp_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  ip_address text,
  attempted_at timestamptz DEFAULT now()
);

-- 4. Indexes
CREATE INDEX idx_risk_events_entity ON public.risk_events(entity_id);
CREATE INDEX idx_risk_events_type ON public.risk_events(risk_type);
CREATE INDEX idx_otp_attempts_phone ON public.otp_attempts(phone);
CREATE INDEX idx_otp_attempts_ip ON public.otp_attempts(ip_address);
CREATE INDEX idx_otp_attempts_time ON public.otp_attempts(attempted_at);

-- 5. RLS Policies
ALTER TABLE public.risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_attempts ENABLE ROW LEVEL SECURITY;

-- Only System Admins (Service Role or specific Super Admin role) can view/manage risk
-- For now, we assume 'admin' of 'system' org or just service role.
-- Let's stick to Service Role for detection logic.
-- Regular org admins can only see if they are flagged (via organisation status), not raw risk events.

CREATE POLICY "System admins view all risk"
  ON public.risk_events FOR SELECT
  USING (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and organisation_id = '00000000-0000-0000-0000-000000000000') -- Hypothetical system org
  );
  
-- Allow service role full access (implicit)
