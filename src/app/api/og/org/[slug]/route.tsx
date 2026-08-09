import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const supabaseAdmin = createServiceClient()

    const { data: org } = await supabaseAdmin
      .from('organisations')
      .select('name, org_type, registration_status, description, logo_url')
      .eq('slug', slug)
      .single()

    const orgName = org?.name || 'Organisation Profile'
    const orgType = org?.org_type
      ? org.org_type === 'ngo'
        ? 'Non-Governmental Organisation'
        : org.org_type === 'student_union'
          ? 'Student Union & Council'
          : org.org_type === 'workers_union'
            ? 'Workers & Labor Union'
            : 'Resident Welfare Association'
      : 'Civic Collective'

    const isRegistered = org?.registration_status === 'registered'
    const desc = org?.description
      ? org.description.slice(0, 140) + (org.description.length > 140 ? '...' : '')
      : 'Verified civic collective powered by Sangathan digital public infrastructure.'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Subtle Grid pattern overlay background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25px 25px, #e2e8f0 2%, transparent 0%)',
              backgroundSize: '40px 40px',
              opacity: 0.6,
            }}
          />

          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '22px',
                  fontWeight: 900,
                }}
              >
                सं
              </div>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
                Sangathan
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 700,
                color: '#475569',
              }}
            >
              Public Civic Record
            </div>
          </div>

          {/* Center Main Org Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontSize: '15px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {orgType}
              </div>

              {isRegistered && (
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontSize: '15px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ✓ Registered Body
                </div>
              )}
            </div>

            <div
              style={{
                fontSize: '52px',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                maxWidth: '950px',
              }}
            >
              {orgName}
            </div>

            <div
              style={{
                fontSize: '20px',
                color: '#64748b',
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {desc}
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '24px',
              borderTop: '2px solid #f1f5f9',
              width: '100%',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 600 }}>
                sangathan.space/org/{slug}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 700 }}>
                Digital Public Infrastructure for Collective Governance
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG Image Generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
