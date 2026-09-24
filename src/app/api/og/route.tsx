import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'Sangathan - Civic Digital Infrastructure'
    const desc = searchParams.get('desc') || 'The zero-tech, mobile-first operating system for civic collectives and NGOs.'
    const type = searchParams.get('type') || 'collective'
    const tag = searchParams.get('tag') || 'Ground Movement Standard'

    // Movement Archetype Color Themes
    const archetypeColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
      collective: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3', accent: '#e11d48' },
      civic_collective: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3', accent: '#e11d48' },
      ngo: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', accent: '#059669' },
      feature: { bg: '#f8fafc', text: '#334155', border: '#cbd5e1', accent: '#475569' },
      petition: { bg: '#fff1f2', text: '#9f1239', border: '#fecdd3', accent: '#e11d48' },
      survey: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', accent: '#16a34a' },
      compare: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe', accent: '#7c3aed' },
      policy: { bg: '#f8fafc', text: '#0f172a', border: '#e2e8f0', accent: '#334155' },
      guide: { bg: '#eef2ff', text: '#3730a9', border: '#c7d2fe', accent: '#4f46eb' },
    }

    const currentTheme = archetypeColors[type] || archetypeColors.collective

    const typeLabels: Record<string, string> = {
      collective: 'Civic Collectives & Movements',
      civic_collective: 'Civic Collectives & Movements',
      ngo: 'Registered NGOs & Trusts (80G)',
      feature: 'Civic Infrastructure Tools',
      petition: 'Public Campaign & Open Letter',
      survey: 'Official Civic Survey & Townhall',
      compare: 'Platform Comparison',
      policy: 'Governance & Privacy Standard',
      guide: 'How-To Guide',
    }

    const typeLabel = typeLabels[type] || 'Digital Public Infrastructure'

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

          {/* Top Brand Bar */}
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
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  Sangathan
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                  Civic Operating System
                </span>
              </div>
            </div>

            {/* Tag Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: currentTheme.bg,
                border: `1.5px solid ${currentTheme.border}`,
                fontSize: '13px',
                fontWeight: 800,
                color: currentTheme.text,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {tag}
            </div>
          </div>

          {/* Center Main Headline & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1020px' }}>
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
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
              {typeLabel}
            </div>

            <div
              style={{
                fontSize: title.length > 55 ? '44px' : '52px',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
              }}
            >
              {title}
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
              {desc.length > 180 ? `${desc.slice(0, 180)}...` : desc}
            </div>
          </div>

          {/* Bottom Proof Strip & Domain Signature */}
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
            {/* 4 Ground Proof Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                <span style={{ color: '#e11d48' }}>●</span> ₹1 Photostat Parchas
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                <span style={{ color: '#d97706' }}>●</span> 30-Day RTI Reminder
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>
                <span style={{ color: '#4f46e5' }}>●</span> BQF Recognition
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                <span style={{ color: '#059669' }}>●</span> 100% Sovereign &amp; PWA
              </div>
            </div>

            {/* URL Signature */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 800 }}>
                sangathan.space
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
    console.error('Dynamic OG image generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
