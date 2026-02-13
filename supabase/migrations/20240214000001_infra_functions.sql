-- Function to increment rate limit atomically
CREATE OR REPLACE FUNCTION increment_rate_limit(key_param TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO rate_limits (key, points, window_start, updated_at)
  VALUES (key_param, 1, NOW(), NOW())
  ON CONFLICT (key)
  DO UPDATE SET
    points = rate_limits.points + 1,
    updated_at = NOW();
END;
$$;

-- Function to lock the next pending job
-- Implements "SELECT FOR UPDATE SKIP LOCKED" which is not exposed via PostgREST API directly
CREATE OR REPLACE FUNCTION lock_next_job()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_job RECORD;
BEGIN
  -- Select next pending job and lock it
  SELECT * INTO v_job
  FROM system_jobs
  WHERE status = 'pending'
    AND (locked_until IS NULL OR locked_until < NOW())
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- If found, update it to processing
  IF v_job.id IS NOT NULL THEN
    UPDATE system_jobs
    SET status = 'processing',
        locked_until = NOW() + INTERVAL '5 minutes', -- Lock for 5 mins
        updated_at = NOW()
    WHERE id = v_job.id;
    
    RETURN row_to_json(v_job);
  END IF;

  RETURN NULL;
END;
$$;
