-- Add eligible_count to polls to cache the number of eligible voters at creation time
ALTER TABLE public.polls
ADD COLUMN eligible_count INTEGER;

COMMENT ON COLUMN public.polls.eligible_count IS 'Cached number of active profiles eligible to vote at the time of poll creation.';
