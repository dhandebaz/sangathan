-- Incident Logging
CREATE TABLE IF NOT EXISTS incident_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'monitoring')),
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Degraded Mode Configuration (extends system_settings)
-- We insert a default config for granular degradation
INSERT INTO system_settings (key, value, description)
VALUES (
  'degraded_mode', 
  '{"enabled": false, "features": {"subscriptions": true, "video_calls": true, "exports": true}}'::jsonb, 
  'Granular feature flags for degraded mode'
) ON CONFLICT (key) DO NOTHING;
