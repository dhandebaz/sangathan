import { ImageResponse } from 'next/og'

export const alt = 'Sangathan - Civic Digital Infrastructure for Movements & Collectives'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '26px',
                fontWeight: 900,
              }}
            >
              सं
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                Sangathan
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                Civic Operating System
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
              backgroundColor: '#fff1f2',
              border: '1.5px solid #fecdd3',
              fontSize: '13px',
              fontWeight: 800,
              color: '#be123c',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Ground Movement Standard
          </div>
        </div>

        {/* Center Hero Message */}
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
            Digital Public Infrastructure
          </div>

          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
            }}
          >
            Digital Operating System for Indian Civic Movements, NGOs &amp; Unions
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
            1-tap spot sensor audits, ₹1 printable Parchas, 15-day RTI countdowns, secret cryptographic ballots, and BQF Section 8 legal protection.
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              <span style={{ color: '#e11d48' }}>●</span> ₹1 Photostat Parchas
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              <span style={{ color: '#d97706' }}>●</span> 15-Day RTI Guard
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>
              <span style={{ color: '#4f46e5' }}>●</span> BQF Sec 8 Protection
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#059669' }}>
              <span style={{ color: '#059669' }}>●</span> 100% Sovereign &amp; PWA
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', color: '#0f172a', fontWeight: 800 }}>
              sangathan.space
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
