-- Admin infrastructure: system_logs, audit_logs, platform_actions, appeals

-- 1. system_logs table
CREATE TABLE IF NOT EXISTS public.system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL CHECK (level IN ('info', 'warn', 'error', 'security', 'critical')),
  source text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id),
  organisation_id uuid REFERENCES public.organisations(id),
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'system_logs' 
      AND policyname = 'Platform admins can view all logs'
  ) THEN
    CREATE POLICY "Platform admins can view all logs"
      ON public.system_logs
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 
          FROM public.profiles 
          WHERE profiles.id = auth.uid()
            AND profiles.is_platform_admin = true
        )
      );
  END IF;
END $$;

-- 2. audit_logs table (immutable append-only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES public.organisations(id),
  user_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,
  resource_table text NOT NULL,
  resource_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'audit_logs' 
      AND policyname = 'Platform admins can view all audit logs'
  ) THEN
    CREATE POLICY "Platform admins can view all audit logs"
      ON public.audit_logs
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 
          FROM public.profiles 
          WHERE profiles.id = auth.uid()
            AND profiles.is_platform_admin = true
        )
      );
  END IF;
END $$;

-- Prevent updates and deletes on audit_logs (append-only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_rules 
    WHERE schemaname = 'public'
      AND tablename = 'audit_logs'
      AND rulename = 'audit_logs_no_update'
  ) THEN
    CREATE RULE audit_logs_no_update AS
      ON UPDATE TO public.audit_logs
      DO INSTEAD NOTHING;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_rules 
    WHERE schemaname = 'public'
      AND tablename = 'audit_logs'
      AND rulename = 'audit_logs_no_delete'
  ) THEN
    CREATE RULE audit_logs_no_delete AS
      ON DELETE TO public.audit_logs
      DO INSTEAD NOTHING;
  END IF;
END $$;

-- 3. platform_actions table (moderation actions)
CREATE TABLE IF NOT EXISTS public.platform_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL,
  target_org_id uuid REFERENCES public.organisations(id) ON DELETE SET NULL,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  severity text,
  reason text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.platform_actions ENABLE ROW LEVEL SECURITY;

-- Constrain action_type and severity to expected values
ALTER TABLE public.platform_actions
  DROP CONSTRAINT IF EXISTS platform_actions_action_type_check;

ALTER TABLE public.platform_actions
  ADD CONSTRAINT platform_actions_action_type_check
  CHECK (
    action_type IN (
      'warning',
      'restriction',
      'suspension',
      'legal_hold',
      'termination',
      'resolve_appeal',
      'update_capabilities'
    )
  );

ALTER TABLE public.platform_actions
  DROP CONSTRAINT IF EXISTS platform_actions_severity_check;

ALTER TABLE public.platform_actions
  ADD CONSTRAINT platform_actions_severity_check
  CHECK (
    severity IS NULL OR severity IN (
      'level_1',
      'level_2',
      'level_3',
      'level_4',
      'level_5'
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'platform_actions' 
      AND policyname = 'Platform admins manage platform actions'
  ) THEN
    CREATE POLICY "Platform admins manage platform actions"
      ON public.platform_actions
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 
          FROM public.profiles 
          WHERE profiles.id = auth.uid()
            AND profiles.is_platform_admin = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 
          FROM public.profiles 
          WHERE profiles.id = auth.uid()
            AND profiles.is_platform_admin = true
        )
      );
  END IF;
END $$;

-- 4. appeals table (organisation appeals against moderation)
CREATE TABLE IF NOT EXISTS public.appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  type text NOT NULL,
  reason text NOT NULL,
  supporting_docs_url text,
  status text NOT NULL CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')) DEFAULT 'pending',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_appeals_org ON public.appeals(organisation_id);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON public.appeals(status);

DO $$
BEGIN
  -- Org admins manage their own appeals
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'appeals' 
      AND policyname = 'Org admins manage own appeals'
  ) THEN
    CREATE POLICY "Org admins manage own appeals"
      ON public.appeals
      FOR ALL
      USING (organisation_id = public.get_auth_org_id());
  END IF;

  -- Platform admins can view and manage all appeals
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'appeals' 
      AND policyname = 'Platform admins manage appeals'
  ) THEN
    CREATE POLICY "Platform admins manage appeals"
      ON public.appeals
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 
          FROM public.profiles 
          WHERE profiles.id = auth.uid()
            AND profiles.is_platform_admin = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 
          FROM public.profiles 
          WHERE profiles.id = auth.uid()
            AND profiles.is_platform_admin = true
        )
      );
  END IF;
END $$;

