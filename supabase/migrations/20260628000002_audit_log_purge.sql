CREATE OR REPLACE FUNCTION public.purge_old_audit_logs(retention_days integer DEFAULT 90)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
  rule_exists boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM pg_rules
    WHERE tablename = 'audit_logs'
    AND rulename = 'audit_logs_no_delete'
  ) INTO rule_exists;

  IF rule_exists THEN
    ALTER TABLE public.audit_logs DISABLE RULE audit_logs_no_delete;
  END IF;

  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  IF rule_exists THEN
    ALTER TABLE public.audit_logs ENABLE RULE audit_logs_no_delete;
  END IF;

  RETURN deleted_count;
END;
$$;
