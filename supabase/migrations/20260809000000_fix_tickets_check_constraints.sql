-- Extend tickets.type CHECK constraint to include 'ai_activation'
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_type_check;
ALTER TABLE public.tickets ADD CONSTRAINT tickets_type_check 
  CHECK (type IN ('grievance', 'complaint', 'maintenance', 'ai_activation'));

-- Extend tickets.priority CHECK constraint to include 'critical'
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_priority_check;
ALTER TABLE public.tickets ADD CONSTRAINT tickets_priority_check 
  CHECK (priority IN ('low', 'medium', 'high', 'critical'));
