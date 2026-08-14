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
      planName = 'Community',
      planPeriod = 'one_time',
      amount = 50,
    } = await request.json()

    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_secret) {
      logger.error('razorpay', 'Razorpay secret missing for verification')
      return NextResponse.json({ error: 'Gateway configuration error' }, { status: 500 })
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment parameters' }, { status: 400 })
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

    const supabaseAdmin = createServiceClient()

    // 1. Duplicate transaction protection
    const { data: existingTx } = await supabaseAdmin
      .from('billing_transactions')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle()

    if (existingTx) {
      logger.warn('razorpay', 'Duplicate payment verification attempt ignored', {
        paymentId: razorpay_payment_id,
      })
      return NextResponse.json({ success: true, message: 'Contribution already processed and recorded.' })
    }

    // 2. If orgId is provided, update organisation status and tier
    if (orgId) {
      try {
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
        const isCommunity = planName === 'Community'
        const isSustainer = planName === 'Institution' || planName === 'Sustainer'

        const updatePayload: Record<string, unknown> = {}

        if (isWhiteLabelOnly) {
          updatePayload.whitelabel_enabled = true
        } else if (isCommunity) {
          updatePayload.plan_name = 'Community'
          updatePayload.plan_period = 'one_time'
          updatePayload.plan_status = 'active'
        } else if (isSustainer) {
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

        if (Object.keys(updatePayload).length > 0) {
          await supabaseAdmin
            .from('organisations')
            .update(updatePayload)
            .eq('id', orgId)
        }

        // 3. Record in billing_transactions table
        await supabaseAdmin.from('billing_transactions').insert({
          organisation_id: orgId,
          amount: Number(amount),
          currency: 'INR',
          plan_name: isCommunity ? 'Community Access' : isSustainer ? 'Sustainer Access' : planName,
          plan_period: isCommunity ? 'one_time' : isYearly ? 'yearly' : 'monthly',
          razorpay_order_id,
          razorpay_payment_id,
          status: 'completed',
        })

        // 4. Record Audit Log
        await supabaseAdmin.from('audit_logs').insert({
          organisation_id: orgId,
          action: isCommunity ? 'COMMUNITY_ACCESS_CONTRIBUTION' : isWhiteLabelOnly ? 'WHITELABEL_ACTIVATED' : 'SUSTAINER_ACCESS_ACTIVATED',
          resource_table: 'organisations',
          resource_id: orgId,
          details: {
            plan_name: updatePayload.plan_name || org?.plan_name,
            plan_period: updatePayload.plan_period || planPeriod,
            amount: Number(amount),
            razorpay_payment_id,
            initiative: 'Bahujan Queer Foundation',
          },
        })
      } catch (dbError) {
        logger.error('razorpay', 'Failed to update organisation post-contribution', {
          error: dbError instanceof Error ? dbError.message : dbError,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contribution verified and access activated successfully.',
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Verification error'
    logger.error('razorpay', 'Payment verification failed', { error: errorMessage })
    return NextResponse.json({ success: false, error: 'Payment verification could not be completed.' }, { status: 500 })
  }
}
