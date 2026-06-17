-- Phase 1: NGO Financials Foundation

-- 1. Unified Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL, -- e.g., 'donation', 'event_fee', 'salary', 'rent', 'equipment'
    amount NUMERIC(15, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    description TEXT,
    reference_id UUID, -- Link to donation_id or expense_id
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS for Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins/Executives manage transactions" ON public.transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organisation_id = transactions.organisation_id
            AND role IN ('admin', 'executive')
        )
    );

CREATE POLICY "Members view transactions (if transparency enabled)" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organisations
            WHERE id = transactions.organisation_id
            AND public_transparency_enabled = true
        ) OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND organisation_id = transactions.organisation_id
        )
    );

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_org_type ON public.transactions(organisation_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
