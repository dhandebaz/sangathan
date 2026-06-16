-- Migration: Optimize Database with B-Tree and GIN indexes
-- Description: Adds indexes to highly queried columns for scale

-- 1. Members Table Optimization
-- Frequent queries filter by organisation_id and status
CREATE INDEX IF NOT EXISTS idx_members_org_status ON public.members (organisation_id, status);

-- 2. Tickets Table Optimization
-- Frequent queries filter by type (grievance, complaint) and status
CREATE INDEX IF NOT EXISTS idx_tickets_org_type_status ON public.tickets (organisation_id, type, status);

-- 3. Campaigns Table Optimization
-- Frequent queries filter by active status
CREATE INDEX IF NOT EXISTS idx_campaigns_org_status ON public.campaigns (organisation_id, status);

-- 4. Text Search optimization for tickets
-- Allows fast fuzzy searching on ticket titles and descriptions
CREATE INDEX IF NOT EXISTS idx_tickets_title_desc_gin 
ON public.tickets 
USING GIN (to_tsvector('english', title || ' ' || description));

-- 5. Rate Limits Optimization
-- Speeds up the cleanup of old fixed window rate limits
CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at ON public.rate_limits (updated_at);
