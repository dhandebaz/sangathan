import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { logger } from '@/lib/logger'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orgId,
      planName,
      planPeriod = 'monthly',
      amount = 1000,
    } = await request.json()

    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_secret) {
      logger.error('razorpay', 'Razorpay secret missing for verification')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      logger.warn('razorpay', 'Invalid payment signature', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      })
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }

    logger.info('razorpay', 'Payment signature verified successfully', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      orgId,
      planName,
    })

    // If orgId is provided, activate subscription / capabilities in database
    if (orgId) {
      try {
        const supabaseAdmin = createServiceClient()

        // 1. Fetch current org capabilities
        const { data: org } = await supabaseAdmin
          .from('organisations')
          .select('capabilities, plan_name, whitelabel_enabled')
          .eq('id', orgId)
          .single()

        const currentCaps = (org?.capabilities as Record<string, boolean>) || {}
        const isYearly = planPeriod === 'yearly'
        const expiresAt = new Date()
        if (isYearly) {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1)
        }

        const isWhiteLabelOnly = planName === 'White-label' || planName === 'whitelabel'
        const isFederation = planName === 'Federation'

        const updatePayload: Record<string, unknown> = {}

        if (isWhiteLabelOnly) {
          updatePayload.whitelabel_enabled = true
        } else if (isFederation) {
          updatePayload.plan_name = 'Federation'
          updatePayload.plan_period = isYearly ? 'yearly' : 'monthly'
          updatePayload.plan_status = 'active'
          updatePayload.plan_expires_at = expiresAt.toISOString()
          updatePayload.whitelabel_enabled = true
          updatePayload.capabilities = {
            ...currentCaps,
            ai_features: true,
            advanced_analytics: true,
            federation_mode: true,
            coalition_tools: true,
          }
        } else {
          // Default: Institution Plan
          updatePayload.plan_name = 'Institution'
          updatePayload.plan_period = isYearly ? 'yearly' : 'monthly'
          updatePayload.plan_status = 'active'
          updatePayload.plan_expires_at = expiresAt.toISOString()
          updatePayload.capabilities = {
            ...currentCaps,
            ai_features: true,
            advanced_analytics: true,
          }
        }

        // Apply update to organisations
        await supabaseAdmin
          .from('organisations')
          .update(updatePayload)
          .eq('id', orgId)

        // 2. Record in billing_transactions table
        await supabaseAdmin.from('billing_transactions').insert({
          organisation_id: orgId,
          amount: Number(amount),
          currency: 'INR',
          plan_name: planName || 'Institution',
          plan_period: isYearly ? 'yearly' : 'monthly',
          razorpay_order_id,
          razorpay_payment_id,
          status: 'completed',
        })

        // 3. Record Audit Log
        await supabaseAdmin.from('audit_logs').insert({
          organisation_id: orgId,
          action: isWhiteLabelOnly ? 'WHITELABEL_ACTIVATED' : 'PLAN_UPGRADED',
          resource_table: 'organisations',
          resource_id: orgId,
          details: {
            plan_name: updatePayload.plan_name || org?.plan_name,
            plan_period: updatePayload.plan_period || 'monthly',
            amount,
            razorpay_payment_id,
          },
          actor_id: '00000000-0000-0000-0000-000000000000',
        })
      } catch (dbError) {
        logger.error('razorpay', 'Failed to update organisation post-payment', {
          error: dbError instanceof Error ? dbError.message : dbError,
        })
      }
    }

    return NextResponse.json({ success: true, message: 'Payment verified and plan activated successfully' })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Verification error'
    logger.error('razorpay', 'Payment verification failed', { error: errorMessage })
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
