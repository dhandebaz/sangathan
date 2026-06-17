-- NGO Enterprise OS: Phase 1 Foundations
-- Adds Donors, Donations, and Broadcasts tracking

-- 1. Donors (CRM)
CREATE TABLE IF NOT EXISTS public.donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    pan_number TEXT, -- Indian Tax ID for 80G
    address TEXT,
    lifetime_value NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Only admins/executives of the organisation can see donors
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can manage donors" ON public.donors
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = donors.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive', 'editor')
        )
    );

-- 2. Donations (Financial Ledger)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'completed', -- pending, completed, failed, refunded
    payment_method TEXT, -- upi, bank_transfer, card, cash
    transaction_id TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    tax_receipt_issued BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Only admins/executives of the organisation can manage financials
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can manage donations" ON public.donations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = donations.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive', 'editor')
        )
    );

-- 3. Broadcasts (Omnichannel Comms)
CREATE TABLE IF NOT EXISTS public.broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    channel TEXT NOT NULL, -- email, push, sms, whatsapp
    target_audience TEXT NOT NULL, -- all_members, volunteers, donors, specific_roles
    status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, sending, completed, failed
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Only admins/executives of the organisation can send broadcasts
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can manage broadcasts" ON public.broadcasts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = broadcasts.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive', 'editor')
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_donors_org_id ON public.donors(organisation_id);
CREATE INDEX IF NOT EXISTS idx_donations_org_id ON public.donations(organisation_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_broadcasts_org_id ON public.broadcasts(organisation_id);
