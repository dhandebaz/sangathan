-- Migration: 20260810000000_org_documents_vault.sql
-- Description: Sovereign Institutional Document & Asset Cloud Vault Table & RLS Policies

CREATE TABLE IF NOT EXISTS public.org_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('statutory', 'agreements', 'agm_circulars', 'property_deeds', 'media', 'general')),
    access_level TEXT NOT NULL DEFAULT 'members_only' CHECK (access_level IN ('public', 'members_only', 'executives_only')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    uploader_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_org_documents_org_id ON public.org_documents(organisation_id);
CREATE INDEX IF NOT EXISTS idx_org_documents_category ON public.org_documents(category);
CREATE INDEX IF NOT EXISTS idx_org_documents_access_level ON public.org_documents(access_level);
CREATE INDEX IF NOT EXISTS idx_org_documents_created_at ON public.org_documents(created_at DESC);

-- Enable RLS
ALTER TABLE public.org_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public documents viewable by anyone
CREATE POLICY "Public org documents are viewable by everyone"
ON public.org_documents FOR SELECT
USING (access_level = 'public');

-- RLS Policy: Members can view members_only and public documents of their org
CREATE POLICY "Members can view org documents"
ON public.org_documents FOR SELECT
TO authenticated
USING (
    organisation_id IN (
        SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
    )
    AND access_level IN ('public', 'members_only')
);

-- RLS Policy: Org admins can view and manage all documents
CREATE POLICY "Admins can manage all org documents"
ON public.org_documents FOR ALL
TO authenticated
USING (
    organisation_id IN (
        SELECT organisation_id FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner', 'superadmin')
    )
);
