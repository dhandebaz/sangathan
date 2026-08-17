-- Migration: Add custom SEO-friendly slug support to forms table
-- Allows forms and surveys to be shared via custom memorable URLs (e.g., /f/annual-survey-2026)

ALTER TABLE public.forms 
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug (allowing nulls for forms without custom slugs)
CREATE UNIQUE INDEX IF NOT EXISTS idx_forms_slug 
  ON public.forms(slug) 
  WHERE slug IS NOT NULL;
