import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await context.params
    const supabase = createServiceClient()
    const isUuid = UUID_REGEX.test(formId)

    let query = supabase
      .from('forms')
      .select('id, title, description, slug, fields, organisation_id')

    if (isUuid) {
      query = query.or(`id.eq.${formId},slug.eq.${formId.toLowerCase()}`)
    } else {
      query = query.eq('slug', formId.toLowerCase())
    }

    const { data: form } = await query.maybeSingle()

    const formTitle = form?.title || 'Civic Survey & Feedback Form'
    const formDesc = form?.description || 'Submit your response securely to your collective.'
    const fieldCount = Array.isArray(form?.fields) ? form.fields.length : 0

    let orgName = 'Sangathan Collective'
    let orgType = 'Civic Collective'

    if (form?.organisation_id) {
      const { data: org } = await supabase
        .from('organisations')
        .select('name, org_type')
        .eq('id', form.organisation_id)
        .maybeSingle()

      if (org?.name) orgName = org.name
      if (org?.org_type) {
        orgType = org.org_type === 'ngo'
          ? 'Registered NGO'
          : org.org_type === 'student_union'
            ? 'Student Union'
            : org.org_type === 'workers_union'
              ? 'Workers Union'
              : org.org_type === 'rwa'
                ? 'Resident Welfare'
                : 'Civic Collective'
      }
    }

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
            padding: '56px 64px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Subtle Geometric Background Dot Matrix */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 20px 20px, #e2e8f0 1.5px, transparent 0%)',
              backgroundSize: '32px 32px',
              opacity: 0.7,
            }}
          />

          {/* Top Brand & Survey Badge Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 900,
                }}
              >
                सं
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  Sangathan
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                  {orgName}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                fontSize: '13px',
                fontWeight: 800,
                color: '#047857',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Official Civic Survey
            </div>
          </div>

          {/* Center Main Form Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1020px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {orgType}
              </div>

              {fieldCount > 0 && (
                <div
                  style={{
                    display: 'flex',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {fieldCount} Questions
                </div>
              )}
            </div>

            <div
              style={{
                fontSize: formTitle.length > 50 ? '42px' : '50px',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
              }}
            >
              {formTitle}
            </div>

            <div
              style={{
                fontSize: '19px',
                color: '#475569',
                lineHeight: 1.45,
                fontWeight: 500,
                maxWidth: '960px',
              }}
            >
              {formDesc.length > 170 ? `${formDesc.slice(0, 170)}...` : formDesc}
            </div>
          </div>

          {/* Bottom Footer & Action Callout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1.5px solid #e2e8f0',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#047857' }}>
                <span>✓</span> 1-Click Direct Participation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                <span>🔒</span> 100% Confidential &amp; Sovereign
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 800 }}>
                sangathan.space/f/{formId}
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
    console.error('Form OG image generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
