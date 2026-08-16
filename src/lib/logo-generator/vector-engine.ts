import { LogoOptions } from './types'
import { COLOR_PALETTES, HERALDIC_SYMBOLS } from './symbols-and-palettes'

/**
 * Escapes XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

/**
 * Generates an ultra-crisp SVG string based on LogoOptions
 */
export function generateLogoSvg(options: LogoOptions): string {
  const {
    orgName = 'SANGATHAN',
    orgType = 'civic_collective',
    tagline = 'DEMOCRATIC SOVEREIGNTY',
    establishedYear = '2026',
    stateOrCity = 'INDIA',
    style = 'circular_seal',
    colorTheme = 'sovereign_navy',
    symbolId,
  } = options

  const palette = COLOR_PALETTES[colorTheme] || COLOR_PALETTES.sovereign_navy
  const symbol = HERALDIC_SYMBOLS.find((s) => s.id === symbolId) || HERALDIC_SYMBOLS[0]

  const cleanName = escapeXml(orgName.toUpperCase())
  const cleanTagline = escapeXml(tagline.toUpperCase())
  const cleanYear = escapeXml(establishedYear)
  const cleanLocation = escapeXml(stateOrCity.toUpperCase())
  const initials = orgName.split(' ').map(w => w[0]).filter(Boolean).slice(0, 3).join('').toUpperCase() || 'S'

  switch (style) {
    case 'circular_seal':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <!-- Top Arc for Name -->
    <path id="top-arc" d="M 75 250 A 175 175 0 0 1 425 250" fill="none" />
    <!-- Bottom Arc for Estd & Motto -->
    <path id="bottom-arc" d="M 425 250 A 175 175 0 0 1 75 250" fill="none" />
    
    <radialGradient id="seal-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${palette.secondary}" />
      <stop offset="100%" stop-color="${palette.primary}" />
    </radialGradient>
    
    <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Background Base -->
  <circle cx="250" cy="250" r="240" fill="${palette.primary}" />
  <circle cx="250" cy="250" r="230" fill="none" stroke="${palette.accent}" stroke-width="4" />
  <circle cx="250" cy="250" r="222" fill="none" stroke="${palette.textLight}" stroke-width="1.5" stroke-dasharray="4 4" />
  <circle cx="250" cy="250" r="150" fill="${palette.secondary}" stroke="${palette.accent}" stroke-width="3" />
  <circle cx="250" cy="250" r="142" fill="none" stroke="${palette.textLight}" stroke-width="1" />

  <!-- Stars on Left and Right -->
  <g fill="${palette.accent}">
    <polygon points="65,250 69,258 78,258 71,264 73,272 65,267 57,272 59,264 52,258 61,258" />
    <polygon points="435,250 439,258 448,258 441,264 443,272 435,267 427,272 429,264 422,258 431,258" />
  </g>

  <!-- Arched Organization Name (Top) -->
  <text fill="${palette.textLight}" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="3">
    <textPath href="#top-arc" startOffset="50%" text-anchor="middle">
      ${cleanName}
    </textPath>
  </text>

  <!-- Arched Bottom Info -->
  <text fill="${palette.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="4">
    <textPath href="#bottom-arc" startOffset="50%" text-anchor="middle">
      ESTD ${cleanYear} • ${cleanLocation}
    </textPath>
  </text>

  <!-- Central Emblem Symbol -->
  <g transform="translate(175, 175) scale(6.25)" fill="${palette.accent}" stroke="${palette.accent}" stroke-width="0.3">
    <path d="${symbol.svgPath}" />
  </g>

  <!-- Central Tagline or Monogram -->
  <text x="250" y="340" fill="${palette.textLight}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="2">
    ${cleanTagline}
  </text>
</svg>
`

    case 'modern_crest':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="crest-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.primary}" />
      <stop offset="100%" stop-color="${palette.secondary}" />
    </linearGradient>
  </defs>

  <!-- Modern Octagon / Shield Body -->
  <rect x="50" y="50" width="400" height="400" rx="48" fill="url(#crest-grad)" />
  <rect x="62" y="62" width="376" height="376" rx="40" fill="none" stroke="${palette.accent}" stroke-width="3" />
  <rect x="74" y="74" width="352" height="352" rx="32" fill="none" stroke="${palette.textLight}" stroke-width="1.5" stroke-opacity="0.3" />

  <!-- Monogram Header -->
  <text x="250" y="150" fill="${palette.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" text-anchor="middle" letter-spacing="6">
    ${initials}
  </text>

  <!-- Central Symbol -->
  <g transform="translate(185, 170) scale(5.4)" fill="${palette.textLight}">
    <path d="${symbol.svgPath}" />
  </g>

  <!-- Horizontal Divider -->
  <line x1="120" y1="330" x2="380" y2="330" stroke="${palette.accent}" stroke-width="2" />
  <circle cx="250" cy="330" r="5" fill="${palette.accent}" />

  <!-- Organization Name & Year -->
  <text x="250" y="370" fill="${palette.textLight}" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="900" text-anchor="middle" letter-spacing="2">
    ${cleanName}
  </text>
  <text x="250" y="405" fill="${palette.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="3">
    ESTD ${cleanYear} • ${cleanLocation}
  </text>
</svg>
`

    case 'movement_shield':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <!-- Classic Movement Shield -->
  <path d="M 250 30 L 430 80 C 430 280 250 440 250 470 C 250 440 70 280 70 80 Z" fill="${palette.primary}" />
  <path d="M 250 45 L 415 90 C 415 270 250 425 250 450 C 250 425 85 270 85 90 Z" fill="none" stroke="${palette.accent}" stroke-width="4" />
  <path d="M 250 55 L 400 98 C 400 260 250 410 250 435 C 250 410 100 260 100 98 Z" fill="${palette.secondary}" />

  <!-- Central Symbol -->
  <g transform="translate(170, 140) scale(6.6)" fill="${palette.accent}">
    <path d="${symbol.svgPath}" />
  </g>

  <!-- Shield Ribbon Banner -->
  <path d="M 60 370 L 440 370 L 410 415 L 90 415 Z" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="2" />
  
  <text x="250" y="400" fill="${palette.textLight}" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="3">
    ${cleanName}
  </text>

  <text x="250" y="110" fill="${palette.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="4">
    ★ ESTD ${cleanYear} ★
  </text>
</svg>
`

    case 'official_stamp':
    default:
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <path id="stamp-top" d="M 85 250 A 165 165 0 0 1 415 250" fill="none" />
    <path id="stamp-bottom" d="M 415 250 A 165 165 0 0 1 85 250" fill="none" />
  </defs>

  <!-- Letterhead Ink Stamp Style -->
  <circle cx="250" cy="250" r="235" fill="none" stroke="${palette.primary}" stroke-width="6" />
  <circle cx="250" cy="250" r="225" fill="none" stroke="${palette.primary}" stroke-width="1.5" />
  <circle cx="250" cy="250" r="145" fill="none" stroke="${palette.primary}" stroke-width="3" stroke-dasharray="8 6" />

  <!-- Arched Name -->
  <text fill="${palette.primary}" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" letter-spacing="3">
    <textPath href="#stamp-top" startOffset="50%" text-anchor="middle">
      ${cleanName}
    </textPath>
  </text>

  <!-- Arched Subtext -->
  <text fill="${palette.primary}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="4">
    <textPath href="#stamp-bottom" startOffset="50%" text-anchor="middle">
      ★ ${cleanLocation} • ESTD ${cleanYear} ★
    </textPath>
  </text>

  <!-- Center Motif -->
  <g transform="translate(180, 180) scale(5.8)" fill="${palette.primary}">
    <path d="${symbol.svgPath}" />
  </g>
</svg>
`
  }
}

/**
 * Renders SVG to a high-resolution Canvas Blob / Data URL (2048x2048)
 */
export async function rasterizeSvgToPng(svgString: string, size = 2048): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    const img = new Image()
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(url)

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to generate PNG blob'))
          return
        }
        const dataUrl = canvas.toDataURL('image/png')
        resolve({ blob, dataUrl })
      }, 'image/png')
    }

    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }

    img.src = url
  })
}
