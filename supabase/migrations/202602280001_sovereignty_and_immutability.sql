-- 1. Hardening Platform Actions (Immutability)
-- Ensure platform_actions cannot be modified or deleted, even by admins.
-- Service role can technically bypass RLS, but Postgres RULES enforce this at a lower level.

CREATE RULE platform_actions_no_update AS
  ON UPDATE TO public.platform_actions
  DO INSTEAD NOTHING;

CREATE RULE platform_actions_no_delete AS
  ON DELETE TO public.platform_actions
  DO INSTEAD NOTHING;

-- 2. Hardening System Logs (Immutability)
-- Ensure system_logs cannot be modified or deleted.

CREATE RULE system_logs_no_update AS
  ON UPDATE TO public.system_logs
  DO INSTEAD NOTHING;

CREATE RULE system_logs_no_delete AS
  ON DELETE TO public.system_logs
  DO INSTEAD NOTHING;

-- 3. Sovereignty Helper Functions (Optional, but good for RLS-safe exports)
-- We rely on the TypeScript utility for the actual JSON generation to keep logic in code,
-- but we ensure the user can only select their own data via existing RLS policies.
