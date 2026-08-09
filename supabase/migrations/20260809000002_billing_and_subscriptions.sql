-- Migration: Add billing and subscription management tables and columns

ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS plan_period TEXT DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS billing_email TEXT;

-- Comments for documentation
COMMENT ON COLUMN public.organisations.plan_period IS 'Billing frequency: monthly, yearly, or lifetime';
COMMENT ON COLUMN public.organisations.plan_expires_at IS 'When current subscription period expires';
COMMENT ON COLUMN public.organisations.plan_status IS 'Subscription status: active, past_due, canceled, or trialing';
COMMENT ON COLUMN public.organisations.billing_email IS 'Email address for invoices and payment notifications';

-- Create billing_transactions table for recording payment receipts
CREATE TABLE IF NOT EXISTS public.billing_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    plan_name TEXT NOT NULL,
    plan_period TEXT NOT NULL DEFAULT 'monthly',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on billing_transactions
ALTER TABLE public.billing_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Organisation admins can view their billing transactions
CREATE POLICY "Admins can view org billing transactions"
ON public.billing_transactions
FOR SELECT
USING (
    organisation_id IN (
        SELECT organisation_id FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'owner', 'super_admin')
    )
);

-- Policy: Service role can do all operations
CREATE POLICY "Service role full access on billing_transactions"
ON public.billing_transactions
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_billing_transactions_org_id 
ON public.billing_transactions(organisation_id);
