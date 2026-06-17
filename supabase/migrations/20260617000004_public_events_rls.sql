-- Restore public viewing of public events
DROP POLICY IF EXISTS "Public view public events" ON public.events;
CREATE POLICY "Public view public events" ON public.events FOR SELECT USING (event_type = 'public');
