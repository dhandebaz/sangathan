import { LogoOptions, CenterType } from './types'
import { COLOR_PALETTES, HERALDIC_SYMBOLS } from './symbols-and-palettes'

/**
 * Escapes XML special characters for safe SVG insertion
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
 * Generates an ultra-crisp, high-contrast SVG insignia based on LogoOptions
 */
export function generateLogoSvg(options: LogoOptions): string {
  const {
    orgName = 'SANGATHAN',
    orgType = 'civic_collective',
    tagline = 'DEMOCRATIC SOVEREIGNTY',
    establishedYear = new Date().getFullYear().toString(),
    stateOrCity = 'INDIA',
    style = 'circular_seal',
    colorTheme = 'sovereign_navy',
    symbolId,
    centerType = 'symbol',
    customInitials,
    fontStyle = 'sans',
  } = options

  const palette = COLOR_PALETTES[colorTheme] || COLOR_PALETTES.sovereign_navy
  const symbol = HERALDIC_SYMBOLS.find((s) => s.id === symbolId) || HERALDIC_SYMBOLS[0]

  const cleanName = escapeXml(orgName.toUpperCase().trim())
  const cleanTagline = escapeXml(tagline.toUpperCase().trim())
  const cleanYear = escapeXml(establishedYear.trim())
  const cleanLocation = escapeXml(stateOrCity.toUpperCase().trim())

  // Compute initials
  const initials = customInitials
    ? escapeXml(customInitials.toUpperCase().slice(0, 4))
    : escapeXml(
        orgName
          .split(' ')
          .map((w) => w[0])
          .filter(Boolean)
          .slice(0, 3)
          .join('')
          .toUpperCase() || 'S'
      )

  const fontFamily =
    fontStyle === 'serif'
      ? 'Georgia, Cambria, serif'
      : fontStyle === 'slab'
      ? 'Rockwell, Impact, sans-serif'
      : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

  // Helper for rendering central motif (Symbol or Monogram)
  const renderCenterMotif = (
    cx: number,
    cy: number,
    scale: number,
    fillColor: string,
    strokeColor?: string
  ) => {
    if (centerType === 'monogram') {
      const fontSize = initials.length > 2 ? 38 : initials.length === 2 ? 46 : 56
      return `
        <g transform="translate(${cx}, ${cy})">
          <text x="0" y="14" fill="${fillColor}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="4">
            ${initials}
          </text>
        </g>
      `
    }

    const offset = scale * 12
    return `
      <g transform="translate(${cx - offset}, ${cy - offset}) scale(${scale})" fill="${fillColor}" ${
      strokeColor ? `stroke="${strokeColor}" stroke-width="0.3"` : ''
    }>
        <path d="${symbol.svgPath}" />
      </g>
    `
  }

  switch (style) {
    // 1. OFFICIAL CIRCULAR SEAL
    case 'circular_seal':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <path id="seal-top-arc" d="M 75 250 A 175 175 0 0 1 425 250" fill="none" />
    <path id="seal-bottom-arc" d="M 425 250 A 175 175 0 0 1 75 250" fill="none" />
    <radialGradient id="seal-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${palette.secondary}" />
      <stop offset="100%" stop-color="${palette.primary}" />
    </radialGradient>
  </defs>

  <!-- Outer Ring Base -->
  <circle cx="250" cy="250" r="240" fill="${palette.primary}" />
  <circle cx="250" cy="250" r="230" fill="none" stroke="${palette.accent}" stroke-width="3.5" />
  <circle cx="250" cy="250" r="222" fill="none" stroke="${palette.textLight}" stroke-width="1.5" stroke-dasharray="5 5" />

  <!-- Inner Medallion -->
  <circle cx="250" cy="250" r="150" fill="${palette.secondary}" stroke="${palette.accent}" stroke-width="3" />
  <circle cx="250" cy="250" r="142" fill="none" stroke="${palette.textLight}" stroke-width="1" stroke-opacity="0.4" />

  <!-- Left & Right Stars -->
  <g fill="${palette.accent}">
    <polygon points="62,250 66,258 75,258 68,264 70,272 62,267 54,272 56,264 49,258 58,258" />
    <polygon points="438,250 442,258 451,258 444,264 446,272 438,267 430,272 432,264 425,258 434,258" />
  </g>

  <!-- Arched Organization Name (Top) -->
  <text fill="${palette.textLight}" font-family="${fontFamily}" font-size="19" font-weight="900" letter-spacing="3.5">
    <textPath href="#seal-top-arc" startOffset="50%" text-anchor="middle">
      ${cleanName}
    </textPath>
  </text>

  <!-- Arched Info (Bottom) -->
  <text fill="${palette.accent}" font-family="${fontFamily}" font-size="13" font-weight="800" letter-spacing="4">
    <textPath href="#seal-bottom-arc" startOffset="50%" text-anchor="middle">
      ★ ESTD ${cleanYear} • ${cleanLocation} ★
    </textPath>
  </text>

  <!-- Central Motif -->
  ${renderCenterMotif(250, 240, 6.4, palette.accent, palette.accent)}

  <!-- Tagline under Central Motif -->
  <text x="250" y="342" fill="${palette.textLight}" font-family="${fontFamily}" font-size="10.5" font-weight="800" text-anchor="middle" letter-spacing="2.5">
    ${cleanTagline}
  </text>
</svg>
`

    // 2. MOVEMENT SHIELD (Heraldic Defender)
    case 'movement_shield':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <!-- Shield Geometry -->
  <path d="M 250 25 L 435 75 C 435 285 250 450 250 475 C 250 450 65 285 65 75 Z" fill="${palette.primary}" />
  <path d="M 250 40 L 418 85 C 418 272 250 432 250 455 C 250 432 82 272 82 85 Z" fill="none" stroke="${palette.accent}" stroke-width="3.5" />
  <path d="M 250 50 L 402 92 C 402 260 250 415 250 438 C 250 415 98 260 98 92 Z" fill="${palette.secondary}" />

  <!-- Shield Top Stars Header -->
  <text x="250" y="105" fill="${palette.accent}" font-family="${fontFamily}" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="4">
    ★ ESTD ${cleanYear} • ${cleanLocation} ★
  </text>

  <!-- Central Motif -->
  ${renderCenterMotif(250, 220, 6.8, palette.accent, palette.textLight)}

  <!-- Shield Ribbon Banner -->
  <path d="M 45 365 L 455 365 L 425 415 L 75 415 Z" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="2" />
  <text x="250" y="398" fill="${palette.textLight}" font-family="${fontFamily}" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="3">
    ${cleanName}
  </text>
  <text x="250" y="445" fill="${palette.accent}" font-family="${fontFamily}" font-size="10.5" font-weight="700" text-anchor="middle" letter-spacing="2">
    ${cleanTagline}
  </text>
</svg>
`

    // 3. VINTAGE LAUREL EMBLEM (Honor & Prestige)
    case 'vintage_laurel':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <path id="laurel-top" d="M 80 250 A 170 170 0 0 1 420 250" fill="none" />
    <path id="laurel-bottom" d="M 420 250 A 170 170 0 0 1 80 250" fill="none" />
  </defs>

  <!-- Outer Base -->
  <circle cx="250" cy="250" r="240" fill="${palette.primary}" />
  <circle cx="250" cy="250" r="230" fill="none" stroke="${palette.accent}" stroke-width="2.5" />
  <circle cx="250" cy="250" r="160" fill="${palette.secondary}" stroke="${palette.accent}" stroke-width="2" />

  <!-- Laurel Wreath Leaves (Left & Right) -->
  <g fill="${palette.accent}" opacity="0.9">
    <!-- Left Laurel -->
    <path d="M 120 180 C 100 210 100 280 120 310 C 125 300 125 285 122 270 C 115 240 115 210 120 180 Z" />
    <path d="M 110 210 C 95 215 90 230 105 240 C 108 230 110 220 110 210 Z" />
    <path d="M 110 260 C 95 265 90 280 105 290 C 108 280 110 270 110 260 Z" />
    <!-- Right Laurel -->
    <path d="M 380 180 C 400 210 400 280 380 310 C 375 300 375 285 378 270 C 385 240 385 210 380 180 Z" />
    <path d="M 390 210 C 405 215 410 230 395 240 C 392 230 390 220 390 210 Z" />
    <path d="M 390 260 C 405 265 410 280 395 290 C 392 280 390 270 390 260 Z" />
  </g>

  <!-- Arched Organization Name -->
  <text fill="${palette.textLight}" font-family="${fontFamily}" font-size="20" font-weight="900" letter-spacing="3.5">
    <textPath href="#laurel-top" startOffset="50%" text-anchor="middle">
      ${cleanName}
    </textPath>
  </text>

  <!-- Arched Subtext -->
  <text fill="${palette.accent}" font-family="${fontFamily}" font-size="13" font-weight="800" letter-spacing="4">
    <textPath href="#laurel-bottom" startOffset="50%" text-anchor="middle">
      ★ ${cleanLocation} • ESTD ${cleanYear} ★
    </textPath>
  </text>

  <!-- Central Motif -->
  ${renderCenterMotif(250, 240, 6.2, palette.textLight, palette.accent)}

  <!-- Inner Motto -->
  <text x="250" y="340" fill="${palette.accent}" font-family="${fontFamily}" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="2">
    ${cleanTagline}
  </text>
</svg>
`

    // 4. MODERN OCTAGON / CREST
    case 'modern_crest':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="crest-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.primary}" />
      <stop offset="100%" stop-color="${palette.secondary}" />
    </linearGradient>
  </defs>

  <!-- Octagon Body -->
  <rect x="45" y="45" width="410" height="410" rx="44" fill="url(#crest-grad)" />
  <rect x="58" y="58" width="384" height="384" rx="36" fill="none" stroke="${palette.accent}" stroke-width="3" />
  <rect x="70" y="70" width="360" height="360" rx="28" fill="none" stroke="${palette.textLight}" stroke-width="1.5" stroke-opacity="0.25" />

  <!-- Monogram or Subtitle Header -->
  <text x="250" y="125" fill="${palette.accent}" font-family="${fontFamily}" font-size="13" font-weight="800" text-anchor="middle" letter-spacing="5">
    ESTD ${cleanYear} • ${cleanLocation}
  </text>

  <!-- Central Motif -->
  ${renderCenterMotif(250, 230, 6.5, palette.textLight, palette.accent)}

  <!-- Divider Line -->
  <line x1="110" y1="335" x2="390" y2="335" stroke="${palette.accent}" stroke-width="2" />
  <circle cx="250" cy="335" r="4.5" fill="${palette.accent}" />

  <!-- Organization Name & Motto -->
  <text x="250" y="375" fill="${palette.textLight}" font-family="${fontFamily}" font-size="18" font-weight="900" text-anchor="middle" letter-spacing="2.5">
    ${cleanName}
  </text>
  <text x="250" y="408" fill="${palette.accent}" font-family="${fontFamily}" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="3">
    ${cleanTagline}
  </text>
</svg>
`

    // 5. HEXAGON INSIGNIA (Constitutional Geometry)
    case 'hexagon_insignia':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <!-- Outer Hexagon -->
  <polygon points="250,20 450,135 450,365 250,480 50,365 50,135" fill="${palette.primary}" />
  <polygon points="250,35 435,142 435,358 250,465 65,358 65,142" fill="none" stroke="${palette.accent}" stroke-width="3.5" />
  <polygon points="250,50 420,150 420,350 250,450 80,350 80,150" fill="${palette.secondary}" />

  <!-- Top Title Info -->
  <text x="250" y="115" fill="${palette.accent}" font-family="${fontFamily}" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="4">
    ★ ESTD ${cleanYear} ★
  </text>

  <!-- Central Motif -->
  ${renderCenterMotif(250, 230, 6.6, palette.accent, palette.textLight)}

  <!-- Bottom Details -->
  <text x="250" y="365" fill="${palette.textLight}" font-family="${fontFamily}" font-size="17" font-weight="900" text-anchor="middle" letter-spacing="3">
    ${cleanName}
  </text>
  <text x="250" y="398" fill="${palette.accent}" font-family="${fontFamily}" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="2.5">
    ${cleanLocation} • ${cleanTagline}
  </text>
</svg>
`

    // 6. MINIMALIST MONOGRAM BADGE
    case 'minimal_monogram':
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <!-- Clean Circle Base -->
  <circle cx="250" cy="250" r="235" fill="${palette.primary}" />
  <circle cx="250" cy="250" r="225" fill="none" stroke="${palette.accent}" stroke-width="4" />
  <circle cx="250" cy="250" r="215" fill="none" stroke="${palette.textLight}" stroke-width="1.5" stroke-opacity="0.3" />

  <!-- Huge Sharp Monogram -->
  <text x="250" y="240" fill="${palette.textLight}" font-family="${fontFamily}" font-size="76" font-weight="900" text-anchor="middle" letter-spacing="8">
    ${initials}
  </text>

  <!-- Accent Underline -->
  <rect x="175" y="260" width="150" height="4" rx="2" fill="${palette.accent}" />

  <!-- Full Name -->
  <text x="250" y="315" fill="${palette.textLight}" font-family="${fontFamily}" font-size="17" font-weight="900" text-anchor="middle" letter-spacing="3">
    ${cleanName}
  </text>
  <text x="250" y="350" fill="${palette.accent}" font-family="${fontFamily}" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="4">
    ESTD ${cleanYear} • ${cleanLocation}
  </text>
  <text x="250" y="380" fill="${palette.textLight}" font-family="${fontFamily}" font-size="9.5" font-weight="600" text-anchor="middle" letter-spacing="2" opacity="0.8">
    ${cleanTagline}
  </text>
</svg>
`

    // 7. OFFICIAL INK STAMP (Letterhead & Gyapan Ready)
    case 'official_stamp':
    default:
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <path id="stamp-top" d="M 85 250 A 165 165 0 0 1 415 250" fill="none" />
    <path id="stamp-bottom" d="M 415 250 A 165 165 0 0 1 85 250" fill="none" />
  </defs>

  <!-- Letterhead Rubber Ink Stamp -->
  <circle cx="250" cy="250" r="235" fill="none" stroke="${palette.primary}" stroke-width="5.5" />
  <circle cx="250" cy="250" r="225" fill="none" stroke="${palette.primary}" stroke-width="1.5" />
  <circle cx="250" cy="250" r="148" fill="none" stroke="${palette.primary}" stroke-width="2.5" stroke-dasharray="8 6" />

  <!-- Arched Name (Top) -->
  <text fill="${palette.primary}" font-family="${fontFamily}" font-size="21" font-weight="900" letter-spacing="3">
    <textPath href="#stamp-top" startOffset="50%" text-anchor="middle">
      ${cleanName}
    </textPath>
  </text>

  <!-- Arched Subtext (Bottom) -->
  <text fill="${palette.primary}" font-family="${fontFamily}" font-size="13.5" font-weight="800" letter-spacing="4">
    <textPath href="#stamp-bottom" startOffset="50%" text-anchor="middle">
      ★ ${cleanLocation} • ESTD ${cleanYear} ★
    </textPath>
  </text>

  <!-- Center Motif -->
  ${renderCenterMotif(250, 245, 5.8, palette.primary)}

  <!-- Stamp Tagline -->
  <text x="250" y="340" fill="${palette.primary}" font-family="${fontFamily}" font-size="10.5" font-weight="800" text-anchor="middle" letter-spacing="2">
    ${cleanTagline}
  </text>
</svg>
`
  }
}

/**
 * Renders SVG to a high-resolution Canvas Blob / Data URL (up to 2048x2048)
 */
export async function rasterizeSvgToPng(
  svgString: string,
  size = 2048
): Promise<{ blob: Blob; dataUrl: string }> {
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
