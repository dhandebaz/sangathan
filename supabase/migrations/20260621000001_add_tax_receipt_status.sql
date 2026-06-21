-- Add tax_receipt_issued to donations table if it doesn't exist
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS tax_receipt_issued BOOLEAN DEFAULT FALSE;
