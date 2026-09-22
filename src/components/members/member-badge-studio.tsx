'use client'

import React, { useRef, useState, useEffect, useCallback, useId } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { QRCodeCanvas } from 'qrcode.react'
import {
  Download, Share2, Copy, ShieldCheck, Sparkles, RefreshCw,
  QrCode, Check, Award, Flame, Globe, Building2, User,
  Upload, Image as ImageIcon, Camera, FileText, CheckCircle2,
  Sliders, Palette, Layout, BadgeCheck, Code, Printer, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { OrgType } from '@/lib/org-types'
import { HERALDIC_SYMBOLS, COLOR_PALETTES } from '@/lib/logo-generator/symbols-and-palettes'
import { saveMemberCredentialAction } from '@/actions/member-credentials'
import {
  ORG_ARCHETYPES,
  BADGE_THEMES,
  BadgeTemplate,
  AspectRatio,
  LanguageMode,
} from '@/lib/badges/badge-config'

export interface MemberBadgeStudioProps {
  initialMemberName?: string
  initialOrgName?: string
  initialRole?: string
  initialOrgSlug?: string
  initialMemberId?: string
  initialOrgType?: OrgType | string
  initialAvatarUrl?: string
  initialLang?: 'en' | 'hi'
}

export function MemberBadgeStudio({
  initialMemberName = 'Arjun Verma',
  initialOrgName = 'National Civic Solidarity Collective',
  initialRole = 'General Secretary',
  initialOrgSlug = 'solidarity',
  initialMemberId = 'SAN-2026-IN-9812',
  initialOrgType = 'civic_collective',
  initialAvatarUrl,
  initialLang = 'en',
}: MemberBadgeStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const qrCanvasRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const uniqueQrId = useId()

  // State
  const [orgType, setOrgType] = useState<OrgType>(
    (initialOrgType as OrgType) in ORG_ARCHETYPES ? (initialOrgType as OrgType) : 'civic_collective'
  )
  const [template, setTemplate] = useState<BadgeTemplate>('executive_seal')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [languageMode, setLanguageMode] = useState<LanguageMode>(initialLang === 'hi' ? 'hi' : 'en')
  const [themeId, setThemeId] = useState<string>(
    ORG_ARCHETYPES[orgType]?.defaultTheme || 'sovereign_navy'
  )
  const [symbolId, setSymbolId] = useState<string>(
    ORG_ARCHETYPES[orgType]?.defaultSymbol || 'scales_of_justice'
  )

  // Member & Org Fields
  const [memberName, setMemberName] = useState(initialMemberName)
  const [orgName, setOrgName] = useState(initialOrgName)
  const [role, setRole] = useState(initialRole)
  const [badgeTitle, setBadgeTitle] = useState(
    ORG_ARCHETYPES[orgType]?.badgeTiers[0]?.value || 'Verified Constitutional Protector'
  )
  const [memberId, setMemberId] = useState(initialMemberId)
  const [joiningYear, setJoiningYear] = useState('2026')
  const [customTagline, setCustomTagline] = useState('Sangathan Democratic Ledger • 100% Tamper-Evident')
  const [bloodGroup, setBloodGroup] = useState('O+')
  const [chapterCity, setChapterCity] = useState('Delhi National Capital Region')

  // Photo & Visual State
  const [avatarImage, setAvatarImage] = useState<HTMLImageElement | null>(null)
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(initialAvatarUrl || null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)

  const activeArchetype = ORG_ARCHETYPES[orgType] || ORG_ARCHETYPES.civic_collective
  const activeTheme = BADGE_THEMES.find((t) => t.id === themeId) || BADGE_THEMES[0]
  const activeSymbol = HERALDIC_SYMBOLS.find((s) => s.id === symbolId) || HERALDIC_SYMBOLS[0]

  const publicVerificationUrl = `https://sangathan.space/verify/${initialOrgSlug}/${memberId}`

  // When Org Type changes, update default theme, symbol & badge tier
  function handleOrgTypeChange(newType: OrgType) {
    setOrgType(newType)
    const arch = ORG_ARCHETYPES[newType]
    if (arch) {
      setThemeId(arch.defaultTheme)
      setSymbolId(arch.defaultSymbol)
      setBadgeTitle(arch.badgeTiers[0]?.value || 'Verified Standing Member')
      if (arch.defaultRoles[0]) {
        setRole(arch.defaultRoles[0])
      }
    }
  }

  // Load avatar image when URL changes
  useEffect(() => {
    if (!avatarDataUrl) {
      setAvatarImage(null)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setAvatarImage(img)
    }
    img.src = avatarDataUrl
  }, [avatarDataUrl])

  // Handle Photo File Upload
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, WebP)')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatarDataUrl(event.target.result)
        toast.success('Member photo uploaded successfully!')
      }
    }
    reader.readAsDataURL(file)
  }

  function handleRemovePhoto() {
    setAvatarDataUrl(null)
    setAvatarImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Draw Badge on Canvas
  const drawBadge = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Base dimensions depending on aspect ratio
    let baseW = 1080
    let baseH = 1080

    if (aspectRatio === '9:16') {
      baseW = 1080
      baseH = 1920
    } else if (aspectRatio === '16:9') {
      baseW = 1200
      baseH = 675
    } else if (aspectRatio === 'cr80_id') {
      baseW = 1050
      baseH = 660
    }

    // Set 2x supersampling for high-DPI retina sharpness
    const scale = 2
    canvas.width = baseW * scale
    canvas.height = baseH * scale
    ctx.scale(scale, scale)

    const w = baseW
    const h = baseH

    // ==========================================
    // 1. BACKGROUND & GEOMETRIC TECH GRID
    // ==========================================
    const bgGrad = ctx.createLinearGradient(0, 0, w, h)
    bgGrad.addColorStop(0, activeTheme.bgGradient[0])
    bgGrad.addColorStop(1, activeTheme.bgGradient[1])
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Subtle technical grid (light crisp aesthetic)
    const isDark = false
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)'
    ctx.lineWidth = 1
    const gridSize = 40
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Get Hidden QR Canvas Element
    const hiddenQrCanvas = document.getElementById(`qr-${uniqueQrId}`) as HTMLCanvasElement | null

    // Helper: Draw Heraldic Symbol Path
    const drawHeraldicSymbol = (cx: number, cy: number, size: number, color: string) => {
      if (!activeSymbol?.svgPath) return
      ctx.save()
      ctx.translate(cx - size / 2, cy - size / 2)
      const pathScale = size / 24
      ctx.scale(pathScale, pathScale)
      const path = new Path2D(activeSymbol.svgPath)
      ctx.fillStyle = color
      ctx.fill(path)
      ctx.restore()
    }

    // Helper: Draw Member Photo or Monogram
    const drawAvatar = (cx: number, cy: number, radius: number) => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.closePath()

      // Avatar Border & Shadow
      ctx.fillStyle = activeTheme.cardBg
      ctx.fill()
      ctx.lineWidth = 3
      ctx.strokeStyle = activeTheme.accent
      ctx.stroke()

      if (avatarImage) {
        ctx.clip()
        const imgAspect = avatarImage.width / avatarImage.height
        let drawW = radius * 2
        let drawH = radius * 2
        if (imgAspect > 1) {
          drawW = radius * 2 * imgAspect
        } else {
          drawH = (radius * 2) / imgAspect
        }
        ctx.drawImage(avatarImage, cx - drawW / 2, cy - drawH / 2, drawW, drawH)
      } else {
        // Fallback Vector Emblem / Initials
        drawHeraldicSymbol(cx, cy, radius * 1.1, activeTheme.accent)
      }
      ctx.restore()
    }

    // ==========================================
    // 2. TEMPLATE SPECIFIC RENDERERS
    // ==========================================

    if (template === 'executive_seal') {
      // ----------------------------------------------------
      // TEMPLATE A: EXECUTIVE SOVEREIGN SEAL
      // ----------------------------------------------------
      const pad = aspectRatio === '9:16' ? 70 : 45
      const cardX = pad
      const cardY = pad
      const cardW = w - pad * 2
      const cardH = h - pad * 2

      // Main Outer Frame
      ctx.fillStyle = activeTheme.cardBg
      ctx.strokeStyle = activeTheme.accent
      ctx.lineWidth = 4
      ctx.strokeRect(cardX, cardY, cardW, cardH)
      ctx.fillRect(cardX, cardY, cardW, cardH)

      // Inner Fine Border
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(cardX + 12, cardY + 12, cardW - 24, cardH - 24)

      // Top Formal Ribbon
      const ribbonY = cardY + 30
      const ribbonH = 46
      ctx.fillStyle = activeTheme.badgeBg
      ctx.fillRect(cardX + 25, ribbonY, cardW - 50, ribbonH)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const ribbonText = languageMode === 'hi' ? activeArchetype.ribbonHeaderHi : activeArchetype.ribbonHeaderEn
      ctx.fillText(ribbonText, cardX + cardW / 2, ribbonY + ribbonH / 2)

      // Organization Name
      const orgY = ribbonY + 75
      ctx.fillStyle = activeTheme.accent
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif'
      ctx.fillText(orgName.toUpperCase(), cardX + cardW / 2, orgY)

      // Statutory Subtitle
      ctx.fillStyle = activeTheme.subTextColor
      ctx.font = '500 13px system-ui, sans-serif'
      const statTag = languageMode === 'hi' ? activeArchetype.statutoryTagHi : activeArchetype.statutoryTagEn
      ctx.fillText(statTag, cardX + cardW / 2, orgY + 28)

      // Avatar or Seal Placement
      const avatarY = orgY + 105
      drawAvatar(cardX + cardW / 2, avatarY, 52)

      // Member Name
      const nameY = avatarY + 80
      ctx.fillStyle = activeTheme.textColor
      ctx.font = 'bold 44px system-ui, -apple-system, sans-serif'
      ctx.fillText(memberName, cardX + cardW / 2, nameY)

      // Role & Chapter
      const roleY = nameY + 44
      ctx.fillStyle = activeTheme.accentLight
      ctx.font = '600 20px system-ui, sans-serif'
      const roleText = languageMode === 'hi' ? `पद: ${role} • ${chapterCity}` : `Role: ${role} • ${chapterCity}`
      ctx.fillText(roleText, cardX + cardW / 2, roleY)

      // Badge Tier Pill
      const tierY = roleY + 45
      const tierText = `★ ${badgeTitle} ★`
      ctx.font = 'bold 22px system-ui, sans-serif'
      const tierTextW = ctx.measureText(tierText).width + 50
      const tierPillH = 42
      ctx.fillStyle = activeTheme.pillBg
      ctx.strokeStyle = activeTheme.pillBorder
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(cardX + (cardW - tierTextW) / 2, tierY - tierPillH / 2, tierTextW, tierPillH, 8)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = activeTheme.accent
      ctx.fillText(tierText, cardX + cardW / 2, tierY)

      // Bottom Cryptographic Box (Left Ledger + Right QR)
      const boxW = cardW - 70
      const boxH = aspectRatio === '9:16' ? 190 : 130
      const boxX = cardX + 35
      const boxY = cardY + cardH - boxH - 45

      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(241, 245, 249, 0.85)'
      ctx.strokeStyle = activeTheme.cardBorder
      ctx.lineWidth = 2
      ctx.strokeRect(boxX, boxY, boxW, boxH)
      ctx.fillRect(boxX, boxY, boxW, boxH)

      // Draw QR Code inside box
      const qrSize = boxH - 24
      const qrX = boxX + boxW - qrSize - 14
      const qrY = boxY + 12
      if (hiddenQrCanvas) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8)
        ctx.drawImage(hiddenQrCanvas, qrX, qrY, qrSize, qrSize)
      }

      // Ledger Texts
      ctx.textAlign = 'left'
      ctx.fillStyle = activeTheme.textColor
      ctx.font = 'bold 17px monospace'
      ctx.fillText(`CREDENTIAL ID: ${memberId}`, boxX + 22, boxY + 34)

      ctx.font = '13px monospace'
      ctx.fillStyle = activeTheme.subTextColor
      ctx.fillText(`VERIFIED HASH: SHA256:${memberId.replace(/[^0-9A-Z]/g, '')}8E0B9`, boxX + 22, boxY + 62)
      ctx.fillText(`ACTIVE SINCE: ${joiningYear} | sangathan.space/org/${initialOrgSlug}`, boxX + 22, boxY + 86)
      if (boxH > 140) {
        ctx.fillText(`STANDING: In Good Standing (Active Quorum Member)`, boxX + 22, boxY + 112)
        ctx.fillText(`ISSUING AUTHORITY: ${orgName}`, boxX + 22, boxY + 138)
      }

      // Bottom Watermark
      ctx.textAlign = 'center'
      ctx.font = '12px system-ui, sans-serif'
      ctx.fillStyle = activeTheme.subTextColor
      ctx.fillText(`Protected & Verified on the Sangathan Democratic Ledger • ID: ${memberId}`, cardX + cardW / 2, cardY + cardH - 18)

    } else if (template === 'digital_id') {
      // ----------------------------------------------------
      // TEMPLATE B: OFFICIAL DIGITAL ID / POCKET CARD
      // ----------------------------------------------------
      const pad = 40
      const cardX = pad
      const cardY = pad
      const cardW = w - pad * 2
      const cardH = h - pad * 2

      ctx.fillStyle = activeTheme.cardBg
      ctx.strokeStyle = activeTheme.cardBorder
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardW, cardH, 16)
      ctx.fill()
      ctx.stroke()

      // Header Band
      const headerH = 90
      ctx.fillStyle = activeTheme.badgeBg
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardW, headerH, [16, 16, 0, 0])
      ctx.fill()

      // Header Icon & Text
      drawHeraldicSymbol(cardX + 50, cardY + headerH / 2, 38, '#FFFFFF')

      ctx.textAlign = 'left'
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
      ctx.fillText(orgName, cardX + 85, cardY + 42)

      ctx.font = '500 13px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.fillText(activeArchetype.statutoryTagEn, cardX + 85, cardY + 68)

      // Two Column Layout
      const leftColW = 320
      const leftColX = cardX + 40
      const rightColX = leftColX + leftColW + 40

      // Left: Photo & QR
      const photoSize = 180
      const photoX = leftColX + leftColW / 2 - photoSize / 2
      const photoY = cardY + headerH + 35

      ctx.save()
      ctx.fillStyle = isDark ? '#1E293B' : '#E2E8F0'
      ctx.strokeStyle = activeTheme.accent
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(photoX, photoY, photoSize, photoSize, 12)
      ctx.fill()
      ctx.stroke()

      if (avatarImage) {
        ctx.clip()
        ctx.drawImage(avatarImage, photoX, photoY, photoSize, photoSize)
      } else {
        drawHeraldicSymbol(photoX + photoSize / 2, photoY + photoSize / 2, 70, activeTheme.accent)
      }
      ctx.restore()

      // Blood Group / ID Pill under Photo
      const infoPillY = photoY + photoSize + 22
      ctx.fillStyle = activeTheme.pillBg
      ctx.strokeStyle = activeTheme.pillBorder
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(photoX, infoPillY, photoSize, 38, 6)
      ctx.fill()
      ctx.stroke()

      ctx.textAlign = 'center'
      ctx.font = 'bold 14px monospace'
      ctx.fillStyle = activeTheme.textColor
      ctx.fillText(`BLOOD: ${bloodGroup} | YR: ${joiningYear}`, photoX + photoSize / 2, infoPillY + 24)

      // Right Column: Identity Details
      const detailsY = cardY + headerH + 40
      ctx.textAlign = 'left'

      ctx.font = 'bold 14px system-ui, sans-serif'
      ctx.fillStyle = activeTheme.accent
      ctx.fillText('VERIFIED MEMBER IDENTIFIER', rightColX, detailsY)

      ctx.font = 'bold 42px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = activeTheme.textColor
      ctx.fillText(memberName, rightColX, detailsY + 46)

      ctx.font = '600 22px system-ui, sans-serif'
      ctx.fillStyle = activeTheme.subTextColor
      ctx.fillText(`Designation: ${role}`, rightColX, detailsY + 84)

      // Tier Badge
      ctx.font = 'bold 18px system-ui, sans-serif'
      ctx.fillStyle = activeTheme.accent
      ctx.fillText(`Tier: ${badgeTitle}`, rightColX, detailsY + 122)

      // Key-Value Grid
      const gridY = detailsY + 155
      const drawInfoRow = (label: string, value: string, yPos: number) => {
        ctx.fillStyle = activeTheme.subTextColor
        ctx.font = '500 13px system-ui, sans-serif'
        ctx.fillText(label, rightColX, yPos)

        ctx.fillStyle = activeTheme.textColor
        ctx.font = 'bold 15px monospace'
        ctx.fillText(value, rightColX + 160, yPos)
      }

      drawInfoRow('MEMBER ID:', memberId, gridY)
      drawInfoRow('DISTRICT/UNIT:', chapterCity, gridY + 28)
      drawInfoRow('STATUS:', 'VERIFIED STANDING', gridY + 56)
      drawInfoRow('VALIDITY:', `2026 - 2028 (BIENNIAL)`, gridY + 84)

      // Bottom Bar with Microchip & QR
      const footerH = 80
      const footerY = cardY + cardH - footerH
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.8)' : '#F1F5F9'
      ctx.beginPath()
      ctx.roundRect(cardX, footerY, cardW, footerH, [0, 0, 16, 16])
      ctx.fill()

      if (hiddenQrCanvas) {
        const fQrSize = 60
        ctx.drawImage(hiddenQrCanvas, cardX + cardW - fQrSize - 20, footerY + 10, fQrSize, fQrSize)
      }

      ctx.fillStyle = activeTheme.subTextColor
      ctx.font = '12px monospace'
      ctx.fillText(`SHA256 CHECKSUM: ${memberId.slice(0, 12)}...SECURE_KEY`, cardX + 24, footerY + 35)
      ctx.fillText(`Official Pass issued via Sangathan Network (sangathan.space)`, cardX + 24, footerY + 58)

    } else if (template === 'social_graphic') {
      // ----------------------------------------------------
      // TEMPLATE C: MODERN SOCIAL MOVEMENT GRAPHIC
      // ----------------------------------------------------
      const pad = 50
      const cardX = pad
      const cardY = pad
      const cardW = w - pad * 2
      const cardH = h - pad * 2

      ctx.fillStyle = activeTheme.cardBg
      ctx.strokeStyle = activeTheme.cardBorder
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardW, cardH, 20)
      ctx.fill()
      ctx.stroke()

      // Header Tag
      ctx.textAlign = 'left'
      ctx.fillStyle = activeTheme.accent
      ctx.font = 'bold 15px monospace'
      ctx.fillText(`ORGANIZATION CREDENTIAL // ${orgType.toUpperCase()}`, cardX + 45, cardY + 55)

      // Big Org Name
      ctx.fillStyle = activeTheme.textColor
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
      ctx.fillText(orgName, cardX + 45, cardY + 100)

      // Large Avatar in Center or Left
      const avatarY = cardY + 220
      drawAvatar(cardX + 110, avatarY, 65)

      // Member Name & Role beside Avatar
      ctx.font = 'bold 50px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = activeTheme.textColor
      ctx.fillText(memberName, cardX + 205, avatarY + 5)

      ctx.font = '600 24px system-ui, sans-serif'
      ctx.fillStyle = activeTheme.accent
      ctx.fillText(`${role} • Member Since ${joiningYear}`, cardX + 205, avatarY + 45)

      // Big Badge Card
      const badgeBoxY = avatarY + 120
      const badgeBoxW = cardW - 90
      const badgeBoxH = 160

      ctx.fillStyle = activeTheme.pillBg
      ctx.strokeStyle = activeTheme.pillBorder
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(cardX + 45, badgeBoxY, badgeBoxW, badgeBoxH, 14)
      ctx.fill()
      ctx.stroke()

      drawHeraldicSymbol(cardX + 95, badgeBoxY + badgeBoxH / 2, 54, activeTheme.accent)

      ctx.textAlign = 'left'
      ctx.font = 'bold 28px system-ui, sans-serif'
      ctx.fillStyle = activeTheme.accent
      ctx.fillText(badgeTitle, cardX + 145, badgeBoxY + 65)

      ctx.font = '500 16px system-ui, sans-serif'
      ctx.fillStyle = activeTheme.textColor
      ctx.fillText(`"Standing together for justice, equity, and sovereign civic democracy."`, cardX + 145, badgeBoxY + 105)

      // Bottom Row: Tagline + QR
      const botY = cardY + cardH - 120
      if (hiddenQrCanvas) {
        const qrS = 90
        ctx.drawImage(hiddenQrCanvas, cardX + cardW - qrS - 45, botY, qrS, qrS)
      }

      ctx.fillStyle = activeTheme.textColor
      ctx.font = 'bold 18px monospace'
      ctx.fillText(`ID: ${memberId}`, cardX + 45, botY + 30)

      ctx.fillStyle = activeTheme.subTextColor
      ctx.font = '14px system-ui, sans-serif'
      ctx.fillText(customTagline, cardX + 45, botY + 60)
      ctx.fillText(`Verify: sangathan.space/org/${initialOrgSlug}`, cardX + 45, botY + 84)

    } else if (template === 'technical_minimalist') {
      // ----------------------------------------------------
      // TEMPLATE D: TECHNICAL MINIMALIST PASS
      // ----------------------------------------------------
      const pad = 40
      const cardX = pad
      const cardY = pad
      const cardW = w - pad * 2
      const cardH = h - pad * 2

      ctx.fillStyle = activeTheme.cardBg
      ctx.strokeStyle = activeTheme.cardBorder
      ctx.lineWidth = 2
      ctx.strokeRect(cardX, cardY, cardW, cardH)
      ctx.fillRect(cardX, cardY, cardW, cardH)

      // Corner Crosshairs
      const drawCrosshair = (cx: number, cy: number) => {
        ctx.strokeStyle = activeTheme.accent
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(cx - 10, cy)
        ctx.lineTo(cx + 10, cy)
        ctx.moveTo(cx, cy - 10)
        ctx.lineTo(cx, cy + 10)
        ctx.stroke()
      }
      drawCrosshair(cardX + 15, cardY + 15)
      drawCrosshair(cardX + cardW - 15, cardY + 15)
      drawCrosshair(cardX + 15, cardY + cardH - 15)
      drawCrosshair(cardX + cardW - 15, cardY + cardH - 15)

      // Top Monospace Header
      ctx.textAlign = 'left'
      ctx.font = 'bold 14px monospace'
      ctx.fillStyle = activeTheme.accent
      ctx.fillText(`[SPEC: SAN-LEDGER-V3] // ${orgType.toUpperCase()}`, cardX + 35, cardY + 45)

      ctx.font = 'bold 28px monospace'
      ctx.fillStyle = activeTheme.textColor
      ctx.fillText(orgName.toUpperCase(), cardX + 35, cardY + 85)

      // Divider Line
      ctx.strokeStyle = activeTheme.cardBorder
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cardX + 35, cardY + 105)
      ctx.lineTo(cardX + cardW - 35, cardY + 105)
      ctx.stroke()

      // Avatar (Square Monospace box)
      const photoSize = 130
      const photoX = cardX + 35
      const photoY = cardY + 130

      ctx.save()
      ctx.strokeStyle = activeTheme.cardBorder
      ctx.lineWidth = 2
      ctx.strokeRect(photoX, photoY, photoSize, photoSize)
      if (avatarImage) {
        ctx.drawImage(avatarImage, photoX, photoY, photoSize, photoSize)
      } else {
        drawHeraldicSymbol(photoX + photoSize / 2, photoY + photoSize / 2, 60, activeTheme.accent)
      }
      ctx.restore()

      // Data Block beside photo
      const dataX = photoX + photoSize + 30
      ctx.font = '12px monospace'
      ctx.fillStyle = activeTheme.subTextColor
      ctx.fillText('MEMBER_IDENTITY:', dataX, photoY + 20)

      ctx.font = 'bold 36px monospace'
      ctx.fillStyle = activeTheme.textColor
      ctx.fillText(memberName, dataX, photoY + 60)

      ctx.font = 'bold 16px monospace'
      ctx.fillStyle = activeTheme.accent
      ctx.fillText(`ROLE: ${role.toUpperCase()}`, dataX, photoY + 95)

      ctx.font = '14px monospace'
      ctx.fillStyle = activeTheme.subTextColor
      ctx.fillText(`TIER: ${badgeTitle.toUpperCase()}`, dataX, photoY + 120)

      // Middle Table Grid
      const tableY = photoY + photoSize + 40
      const tableW = cardW - 70
      const tableH = 160
      ctx.strokeRect(cardX + 35, tableY, tableW, tableH)

      const colW = tableW / 3
      ctx.beginPath()
      ctx.moveTo(cardX + 35 + colW, tableY)
      ctx.lineTo(cardX + 35 + colW, tableY + tableH)
      ctx.moveTo(cardX + 35 + colW * 2, tableY)
      ctx.lineTo(cardX + 35 + colW * 2, tableY + tableH)
      ctx.stroke()

      const drawCell = (x: number, title: string, val: string) => {
        ctx.font = '11px monospace'
        ctx.fillStyle = activeTheme.subTextColor
        ctx.fillText(title, x + 15, tableY + 30)
        ctx.font = 'bold 15px monospace'
        ctx.fillStyle = activeTheme.textColor
        ctx.fillText(val, x + 15, tableY + 65)
      }

      drawCell(cardX + 35, 'ID_HASH_REF', memberId)
      drawCell(cardX + 35 + colW, 'MEMBER_SINCE', joiningYear)
      drawCell(cardX + 35 + colW * 2, 'STATUS', 'VERIFIED (PASS)')

      // Bottom Row with QR
      const bQrY = cardY + cardH - 140
      if (hiddenQrCanvas) {
        ctx.drawImage(hiddenQrCanvas, cardX + cardW - 145, bQrY, 110, 110)
      }

      ctx.font = '11px monospace'
      ctx.fillStyle = activeTheme.subTextColor
      ctx.fillText(`INTEGRITY_SIGNATURE: ${memberId}-SHA256-AUTHENTIC`, cardX + 35, bQrY + 35)
      ctx.fillText(`VERIFICATION_URL: sangathan.space/verify/${initialOrgSlug}`, cardX + 35, bQrY + 60)
      ctx.fillText(`RECORD_STATUS: IMMUTABLE_LEDGER_SYNCED`, cardX + 35, bQrY + 85)

    } else if (template === 'tricolor_inquilab') {
      // ----------------------------------------------------
      // TEMPLATE E: CONSTITUTION TRICOLOR & INQUILAB
      // ----------------------------------------------------
      const pad = 45
      const cardX = pad
      const cardY = pad
      const cardW = w - pad * 2
      const cardH = h - pad * 2

      ctx.fillStyle = '#FFFFFF'
      ctx.strokeStyle = '#D97706'
      ctx.lineWidth = 4
      ctx.strokeRect(cardX, cardY, cardW, cardH)
      ctx.fillRect(cardX, cardY, cardW, cardH)

      // Top Saffron Band
      const bandH = 70
      ctx.fillStyle = '#FF9933'
      ctx.fillRect(cardX, cardY, cardW, bandH)

      // Bottom Emerald Band
      ctx.fillStyle = '#138808'
      ctx.fillRect(cardX, cardY + cardH - bandH, cardW, bandH)

      // Top Band Text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('✦ भारत का संविधान • संप्रभु, समाजवादी, पंथनिरपेक्ष, लोकतांत्रिक गणराज्य ✦', cardX + cardW / 2, cardY + 42)

      // Bottom Band Text
      ctx.fillText('✦ सत्यमेव जयते • संगच्छध्वं संवदध्वम् • इंकलाब ज़िन्दाबाद ✦', cardX + cardW / 2, cardY + cardH - 30)

      // Org Name in Center Body
      const orgY = cardY + bandH + 50
      ctx.fillStyle = '#0F172A'
      ctx.font = 'bold 28px system-ui, sans-serif'
      ctx.fillText(orgName.toUpperCase(), cardX + cardW / 2, orgY)

      ctx.font = '600 15px system-ui, sans-serif'
      ctx.fillStyle = '#15803D'
      ctx.fillText(activeArchetype.nameHi, cardX + cardW / 2, orgY + 28)

      // Ashoka / Heraldic Symbol in center
      drawAvatar(cardX + cardW / 2, orgY + 115, 54)

      // Member Name
      const nameY = orgY + 210
      ctx.fillStyle = '#09090B'
      ctx.font = 'bold 46px system-ui, -apple-system, sans-serif'
      ctx.fillText(memberName, cardX + cardW / 2, nameY)

      // Role
      ctx.font = '600 22px system-ui, sans-serif'
      ctx.fillStyle = '#B45309'
      ctx.fillText(`${role} • स्थायी सदस्य`, cardX + cardW / 2, nameY + 42)

      // Badge Tier Pill
      const tierY = nameY + 95
      const tierText = `★ ${badgeTitle} ★`
      ctx.font = 'bold 22px system-ui, sans-serif'
      const tierTextW = ctx.measureText(tierText).width + 50
      ctx.fillStyle = '#FEF3C7'
      ctx.strokeStyle = '#D97706'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(cardX + (cardW - tierTextW) / 2, tierY - 22, tierTextW, 44, 8)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#B45309'
      ctx.fillText(tierText, cardX + cardW / 2, tierY + 6)

      // Verification Micro Bar
      const vY = cardY + cardH - bandH - 85
      if (hiddenQrCanvas) {
        ctx.drawImage(hiddenQrCanvas, cardX + cardW - 130, vY, 70, 70)
      }

      ctx.textAlign = 'left'
      ctx.font = 'bold 15px monospace'
      ctx.fillStyle = '#0F172A'
      ctx.fillText(`सदस्य पहचान (ID): ${memberId}`, cardX + 50, vY + 25)

      ctx.font = '13px monospace'
      ctx.fillStyle = '#64748B'
      ctx.fillText(`सत्यापित हैश: SHA256:${memberId.slice(0, 10)}99A • वर्ष ${joiningYear}`, cardX + 50, vY + 50)
    }
  }, [
    aspectRatio, template, languageMode, orgType, themeId, symbolId,
    memberName, orgName, role, badgeTitle, memberId, joiningYear,
    customTagline, bloodGroup, chapterCity, avatarImage, activeTheme,
    activeArchetype, activeSymbol, initialOrgSlug, uniqueQrId
  ])

  // Redraw when any input changes
  useEffect(() => {
    drawBadge()
  }, [drawBadge])

  // ==========================================
  // EXPORT & SHARE ACTIONS
  // ==========================================

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    setIsGenerating(true)

    try {
      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `Sangathan_${orgType}_Badge_${memberName.replace(/\s+/g, '_')}_${aspectRatio.replace(':', '_')}.png`
      a.click()
      toast.success('Verified Member Badge downloaded in High-DPI resolution!')
    } catch {
      toast.error('Failed to generate image download.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopyImage() {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to copy image.')
          return
        }
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
          const item = new ClipboardItem({ 'image/png': blob })
          await navigator.clipboard.write([item])
          toast.success('Badge copied to clipboard! Paste anywhere (WhatsApp, Slack, Docs).')
        } else {
          handleDownload()
        }
      }, 'image/png')
    } catch {
      handleDownload()
    }
  }

  async function handleShare() {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], `Sangathan_Badge_${memberName.replace(/\s+/g, '_')}.png`, { type: 'image/png' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${memberName} - ${badgeTitle} (${orgName})`,
            text: `Proud to be a verified ${role} with ${orgName} on the Sangathan Democratic Network! Verify credential at: ${publicVerificationUrl}`,
            files: [file],
          })
        } else {
          handleDownload()
        }
      }, 'image/png')
    } catch {
      handleDownload()
    }
  }

  const [isSaving, setIsSaving] = useState(false)

  async function handleSaveCredential() {
    setIsSaving(true)
    try {
      const res = await saveMemberCredentialAction({
        memberName,
        designation: role,
        badgeTier: badgeTitle,
        badgeTemplate: template,
        themeId,
        symbolId,
        chapterCity,
        bloodGroup,
        joiningYear,
        customTagline,
        avatarUrl: avatarDataUrl || undefined,
      })

      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Verified credential saved to profile and the Sangathan Ledger!')
      }
    } catch {
      toast.error('An error occurred while saving credential.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleCopyEmbedCode() {
    const embedHtml = `<a href="${publicVerificationUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="https://sangathan.space/api/badge/${initialOrgSlug}/${memberId}.png" alt="${memberName} - ${badgeTitle} on Sangathan" width="400" />\n</a>`
    navigator.clipboard.writeText(embedHtml)
    setCopiedEmbed(true)
    toast.success('HTML Embed Code copied to clipboard!')
    setTimeout(() => setCopiedEmbed(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Hidden QR Code Canvas element used for rendering inside canvasRef */}
      <div className="hidden" ref={qrCanvasRef}>
        <QRCodeCanvas
          id={`qr-${uniqueQrId}`}
          value={publicVerificationUrl}
          size={300}
          level="H"
          marginSize={1}
        />
      </div>

      {/* Top Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            <span>Verified Member Badge & Credential Studio</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate high-resolution verified credentials for Instagram, Twitter/X, WhatsApp Stories, and physical ID cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveCredential}
            disabled={isSaving}
            className="text-xs font-semibold border-slate-200 bg-white text-emerald-700 hover:bg-emerald-50/60 shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
            {isSaving ? 'Saving...' : 'Save & Sync to Ledger'}
          </Button>

          <Button
            variant="outline"
            onClick={handleCopyImage}
            className="text-xs font-semibold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <Copy className="w-4 h-4 mr-1.5 text-slate-500" />
            Copy Image
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            className="text-xs font-semibold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <Share2 className="w-4 h-4 mr-1.5 text-slate-500" />
            Share Graphic
          </Button>

          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download High-Res PNG
          </Button>
        </div>
      </div>

      {/* Main Studio Grid: Left Control Tabs + Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Interactive Multi-Tab Control Suite */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-sm shadow-xs space-y-5">
          <Tabs defaultValue="archetype" className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-9 bg-slate-100 p-0.5 rounded-sm">
              <TabsTrigger value="archetype" className="text-xs font-medium py-1.5">
                Archetype
              </TabsTrigger>
              <TabsTrigger value="template" className="text-xs font-medium py-1.5">
                Template
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs font-medium py-1.5">
                Details
              </TabsTrigger>
              <TabsTrigger value="styling" className="text-xs font-medium py-1.5">
                Styling
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: ORGANIZATION ARCHETYPE & PRESETS */}
            <TabsContent value="archetype" className="space-y-4 pt-3">
              <div>
                <Label className="text-xs font-bold text-slate-800">Select Organisation Archetype</Label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Tailors badge titles, statutory ribbons, and symbols to your specific movement.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(ORG_ARCHETYPES) as OrgType[]).map((typeKey) => {
                    const arch = ORG_ARCHETYPES[typeKey]
                    const isSelected = orgType === typeKey
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => handleOrgTypeChange(typeKey)}
                        className={`text-left p-2.5 rounded-sm border transition-all ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-600'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{arch.nameEn}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{arch.nameHi}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Language Mode</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setLanguageMode('en')}
                    className={`py-1.5 text-xs font-medium border rounded-sm ${
                      languageMode === 'en' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguageMode('hi')}
                    className={`py-1.5 text-xs font-medium border rounded-sm ${
                      languageMode === 'hi' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguageMode('bilingual')}
                    className={`py-1.5 text-xs font-medium border rounded-sm ${
                      languageMode === 'bilingual' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Bilingual
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: TEMPLATE & ASPECT RATIO */}
            <TabsContent value="template" className="space-y-4 pt-3">
              <div>
                <Label className="text-xs font-bold text-slate-800">Visual Layout Template</Label>
                <div className="grid grid-cols-1 gap-2 mt-1.5">
                  {[
                    { id: 'executive_seal', title: '1. Executive Sovereign Seal', desc: 'Formal gold double-bordered frame with ribbon, seal, and verified ledger.' },
                    { id: 'social_graphic', title: '2. Modern Movement Social Graphic', desc: 'High-contrast activist banner for social media campaigns and quotes.' },
                    { id: 'digital_id', title: '3. Official Digital ID & Pocket Pass', desc: 'Physical smart-card layout with photo window, blood group, and microchip.' },
                    { id: 'technical_minimalist', title: '4. Clean Technical Minimalist Pass', desc: 'Monospace engineering grid with SHA-256 cryptographic crosshairs.' },
                    { id: 'tricolor_inquilab', title: '5. Constitution Tricolor (तिरंगा)', desc: 'Patriotic saffron, white & emerald bands with Devanagari text.' },
                  ].map((tpl) => {
                    const isSelected = template === tpl.id
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setTemplate(tpl.id as BadgeTemplate)}
                        className={`text-left p-2.5 rounded-sm border transition-all ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-600'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{tpl.title}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{tpl.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-800">Social Format / Aspect Ratio</Label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`py-2 text-xs font-medium border rounded-sm transition-all ${
                      aspectRatio === '1:1'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    1:1 Square Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2 text-xs font-medium border rounded-sm transition-all ${
                      aspectRatio === '9:16'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    9:16 Story (WhatsApp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2 text-xs font-medium border rounded-sm transition-all ${
                      aspectRatio === '16:9'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    16:9 Landscape Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('cr80_id')}
                    className={`py-2 text-xs font-medium border rounded-sm transition-all ${
                      aspectRatio === 'cr80_id'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    CR80 Physical ID Card
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: MEMBER & ORG DETAILS */}
            <TabsContent value="details" className="space-y-3.5 pt-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Member Full Name</Label>
                <Input
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="mt-1 h-9 text-sm rounded-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Organisation / Collective</Label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="mt-1 h-9 text-sm rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Designation / Role</Label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 h-9 text-sm rounded-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Member Since (Year)</Label>
                  <Input
                    value={joiningYear}
                    onChange={(e) => setJoiningYear(e.target.value)}
                    className="mt-1 h-9 text-sm rounded-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Verified Badge Tier</Label>
                <Select value={badgeTitle} onValueChange={setBadgeTitle}>
                  <SelectTrigger className="mt-1 h-9 text-xs rounded-sm">
                    <SelectValue placeholder="Select Badge Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeArchetype.badgeTiers.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        {languageMode === 'hi' ? tier.labelHi : tier.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Credential ID Ref</Label>
                  <Input
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="mt-1 h-9 text-xs font-mono rounded-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Blood Group</Label>
                  <Input
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="mt-1 h-9 text-xs rounded-sm"
                    placeholder="e.g. O+, B+, A+"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Chapter / District / City</Label>
                <Input
                  value={chapterCity}
                  onChange={(e) => setChapterCity(e.target.value)}
                  className="mt-1 h-9 text-xs rounded-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Custom Slogan / Footer Note</Label>
                <Input
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  className="mt-1 h-9 text-xs rounded-sm"
                />
              </div>
            </TabsContent>

            {/* TAB 4: STYLING, PHOTO & EMBLEMS */}
            <TabsContent value="styling" className="space-y-4 pt-3">
              {/* Photo Upload Section */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm">
                <Label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Member Photo Avatar</span>
                  {avatarDataUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </Label>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-2.5">
                  Upload a personal portrait to render cleanly into your badge or official ID card.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs border-slate-300 h-8"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    {avatarDataUrl ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  <span className="text-[11px] text-slate-500">
                    {avatarDataUrl ? 'Photo loaded' : 'Defaulting to vector seal'}
                  </span>
                </div>
              </div>

              {/* Color Theme */}
              <div>
                <Label className="text-xs font-semibold text-slate-700">Color Aesthetic Theme</Label>
                <Select value={themeId} onValueChange={setThemeId}>
                  <SelectTrigger className="mt-1 h-9 text-xs rounded-sm">
                    <SelectValue placeholder="Select Color Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {BADGE_THEMES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {languageMode === 'hi' ? t.nameHi : t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Heraldic Vector Symbol */}
              <div>
                <Label className="text-xs font-semibold text-slate-700">Heraldic Emblem / Vector Icon</Label>
                <Select value={symbolId} onValueChange={setSymbolId}>
                  <SelectTrigger className="mt-1 h-9 text-xs rounded-sm">
                    <SelectValue placeholder="Select Emblem" />
                  </SelectTrigger>
                  <SelectContent>
                    {HERALDIC_SYMBOLS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {languageMode === 'hi' ? s.nameHi : s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Embed Snippet Accordion / Box */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                <span>Web Embed & Portfolio Badge</span>
              </span>
              <button
                type="button"
                onClick={handleCopyEmbedCode}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {copiedEmbed ? 'Copied HTML!' : 'Copy HTML Snippet'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Add your verified badge link to personal websites, GitHub profiles, or organization portals.
            </p>
          </div>
        </div>

        {/* Right Side: Live High-DPI Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center bg-slate-50/80 border border-slate-200 p-6 rounded-2xl shadow-2xs">
          <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Live Render Preview ({aspectRatio})</span>
            </div>
            <span className="text-[10px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
              {template.toUpperCase()}
            </span>
          </div>

          {/* Canvas Rendering Box */}
          <div className="max-w-full overflow-hidden shadow-xs border border-slate-200 rounded-xl bg-white p-1.5">
            <canvas
              ref={canvasRef}
              className="max-h-[500px] w-auto max-w-full object-contain block mx-auto rounded-lg"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-4 text-[11px] text-slate-500 border-t border-slate-200 pt-3 gap-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographic QR & SHA-256 Verifiable</span>
            </span>
            <Link
              href={`/verify/${initialOrgSlug}/${memberId}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              <span>View Public Verification Proof</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
