-- ==============================================================================
-- REAL PRODUCTION BOT CHANNELS & QR PAIRING SCHEMA
-- Supports Telegram (grammY), WhatsApp QR Linked Device Sessions, and Meta Cloud API
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.bot_channel_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('telegram', 'whatsapp_qr', 'whatsapp_cloud')),
    is_enabled BOOLEAN DEFAULT true,
    credentials JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'pending_qr', 'error', 'pairing')),
    last_synced_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_org_channel UNIQUE (organisation_id, channel)
);

CREATE TABLE IF NOT EXISTS public.bot_outbound_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('telegram', 'whatsapp_qr', 'whatsapp_cloud')),
    recipient_id TEXT NOT NULL,
    recipient_name TEXT,
    message_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
    provider_message_id TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    sent_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.bot_qr_pairing_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL UNIQUE,
    qr_code_data TEXT NOT NULL,
    pairing_numeric_code TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scanned', 'authenticated', 'expired')),
    device_info JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_bot_channel_configs_org ON public.bot_channel_configs(organisation_id);
CREATE INDEX IF NOT EXISTS idx_bot_outbound_messages_org ON public.bot_outbound_messages(organisation_id);
CREATE INDEX IF NOT EXISTS idx_bot_qr_pairing_sessions_sess ON public.bot_qr_pairing_sessions(session_id);

-- RLS
ALTER TABLE public.bot_channel_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_outbound_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_qr_pairing_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for Organisation Admins & Members
CREATE POLICY "Admins can view bot channel configs" ON public.bot_channel_configs
    FOR SELECT USING (
        organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can modify bot channel configs" ON public.bot_channel_configs
    FOR ALL USING (
        organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner', 'convenor', 'president', 'general_secretary')
        )
    );

CREATE POLICY "Users can view outbound messages for org" ON public.bot_outbound_messages
    FOR SELECT USING (
        organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage outbound messages" ON public.bot_outbound_messages
    FOR ALL USING (
        organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage QR pairing sessions" ON public.bot_qr_pairing_sessions
    FOR ALL USING (
        organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
        )
    );
