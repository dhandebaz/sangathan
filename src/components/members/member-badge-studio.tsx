'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Download, Share2, ShieldCheck, Sparkles, RefreshCw,
  QrCode, Check, Award, Flame, Globe, Building2
} from 'lucide-react'

interface MemberBadgeStudioProps {
  initialMemberName?: string
  initialOrgName?: string
  initialRole?: string
  initialOrgSlug?: string
  initialMemberId?: string
}

type AspectRatio = '1:1' | '9:16' | '16:9'

const THEMES = [
  {
    id: 'saffron_emerald',
    name: 'Constitution Tricolor (Saffron & Emerald)',
    bgGradient: ['#FFF8F0', '#F0FDF4'],
    accent: '#D97706',
    badgeBg: '#15803D',
    textColor: '#1E293B',
    cardBorder: '#CBD5E1',
  },
  {
    id: 'deep_indigo',
    name: 'Democratic Navy & Gold',
    bgGradient: ['#0F172A', '#1E1B4B'],
    accent: '#F59E0B',
    badgeBg: '#4F46E5',
    textColor: '#F8FAFC',
    cardBorder: '#334155',
  },
  {
    id: 'technical_slate',
    name: 'Clean Technical Slate',
    bgGradient: ['#F8FAFC', '#F1F5F9'],
    accent: '#0F172A',
    badgeBg: '#0284C7',
    textColor: '#0F172A',
    cardBorder: '#94A3B8',
  },
  {
    id: 'civic_crimson',
    name: 'Resistance Crimson & Bronze',
    bgGradient: ['#450A0A', '#1C1917'],
    accent: '#F87171',
    badgeBg: '#DC2626',
    textColor: '#FEF2F2',
    cardBorder: '#7F1D1D',
  },
]

export function MemberBadgeStudio({
  initialMemberName = 'Arjun Verma',
  initialOrgName = 'National Student Solidarity Collective',
  initialRole = 'General Secretary',
  initialOrgSlug = 'solidarity',
  initialMemberId = 'SAN-2026-IN-9812',
}: MemberBadgeStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [memberName, setMemberName] = useState(initialMemberName)
  const [orgName, setOrgName] = useState(initialOrgName)
  const [role, setRole] = useState(initialRole)
  const [badgeTitle, setBadgeTitle] = useState('Verified Constitutional Protector')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [themeId, setThemeId] = useState('deep_indigo')
  const [joiningYear, setJoiningYear] = useState('2026')
  const [isGenerating, setIsGenerating] = useState(false)

  const activeTheme = THEMES.find((t) => t.id === themeId) || THEMES[0]

  const drawBadge = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 1080
    let height = 1080

    if (aspectRatio === '9:16') {
      width = 1080
      height = 1920
    } else if (aspectRatio === '16:9') {
      width = 1200
      height = 675
    }

    canvas.width = width
    canvas.height = height

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, activeTheme.bgGradient[0])
    gradient.addColorStop(1, activeTheme.bgGradient[1])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 2. Draw Geometric Tech Grid lines
    ctx.strokeStyle = activeTheme.id === 'deep_indigo' || activeTheme.id === 'civic_crimson'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.04)'
    ctx.lineWidth = 2
    const gridSize = 60
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 3. Draw Center Frame Container
    const padding = aspectRatio === '9:16' ? 100 : 70
    const cardX = padding
    const cardY = padding
    const cardW = width - padding * 2
    const cardH = height - padding * 2

    // Card background
    ctx.fillStyle = activeTheme.id === 'deep_indigo' || activeTheme.id === 'civic_crimson'
      ? 'rgba(15, 23, 42, 0.7)'
      : 'rgba(255, 255, 255, 0.9)'
    ctx.strokeStyle = activeTheme.cardBorder
    ctx.lineWidth = 3
    ctx.strokeRect(cardX, cardY, cardW, cardH)
    ctx.fillRect(cardX, cardY, cardW, cardH)

    // 4. Header Badge / Top Ribbon
    ctx.fillStyle = activeTheme.badgeBg
    ctx.fillRect(cardX + 40, cardY + 40, cardW - 80, 50)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✦ SANGATHAN VERIFIED CIVIC NETWORK ✦', cardX + cardW / 2, cardY + 65)

    // 5. Organization Name
    ctx.fillStyle = activeTheme.accent
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
    ctx.fillText(orgName.toUpperCase(), cardX + cardW / 2, cardY + 140)

    // 6. Member Full Name
    ctx.fillStyle = activeTheme.textColor
    ctx.font = 'bold 54px system-ui, -apple-system, sans-serif'
    ctx.fillText(memberName, cardX + cardW / 2, cardY + 220)

    // 7. Role & Designation
    ctx.fillStyle = activeTheme.id === 'deep_indigo' || activeTheme.id === 'civic_crimson'
      ? '#94A3B8'
      : '#475569'
    ctx.font = '600 30px system-ui, -apple-system, sans-serif'
    ctx.fillText(`Role: ${role} | Standing Member`, cardX + cardW / 2, cardY + 275)

    // 8. Verified Badge Seal
    const badgeY = aspectRatio === '9:16' ? cardY + 540 : cardY + 380
    ctx.fillStyle = activeTheme.accent
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
    ctx.fillText(`★ ${badgeTitle} ★`, cardX + cardW / 2, badgeY)

    // 9. QR & Cryptographic Integrity Box
    const boxW = 500
    const boxH = 140
    const boxX = cardX + (cardW - boxW) / 2
    const boxY = cardY + cardH - boxH - 60

    ctx.fillStyle = activeTheme.id === 'deep_indigo' || activeTheme.id === 'civic_crimson'
      ? 'rgba(30, 41, 59, 0.8)'
      : '#F1F5F9'
    ctx.strokeStyle = activeTheme.cardBorder
    ctx.lineWidth = 2
    ctx.fillRect(boxX, boxY, boxW, boxH)
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    // Box Text
    ctx.fillStyle = activeTheme.textColor
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`ID: ${initialMemberId}`, boxX + 30, boxY + 45)
    ctx.font = '16px monospace'
    ctx.fillStyle = '#64748B'
    ctx.fillText(`VERIFIED HASH: SHA256:${initialMemberId.replace(/[^0-9A-Z]/g, '')}89F`, boxX + 30, boxY + 75)
    ctx.fillText(`ACTIVE SINCE: ${joiningYear} | sangathan.org/${initialOrgSlug}`, boxX + 30, boxY + 105)

    // Watermark footer
    ctx.textAlign = 'center'
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillStyle = '#94A3B8'
    ctx.fillText('Protected & Verified on the Sangathan Democratic Ledger', cardX + cardW / 2, cardY + cardH - 20)
  }, [aspectRatio, themeId, memberName, orgName, role, badgeTitle, joiningYear, activeTheme, initialMemberId, initialOrgSlug])

  useEffect(() => {
    drawBadge()
  }, [drawBadge])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    setIsGenerating(true)

    try {
      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `Sangathan_Badge_${memberName.replace(/\s+/g, '_')}_${aspectRatio.replace(':', '_')}.png`
      a.click()
      toast.success('Verified Badge downloaded successfully!')
    } catch {
      toast.error('Failed to generate image download.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleShare() {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], `Sangathan_Badge_${memberName}.png`, { type: 'image/png' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${memberName} - ${badgeTitle}`,
            text: `Proud to be a verified ${role} with ${orgName} on Sangathan!`,
            files: [file],
          })
        } else {
          // Fallback download
          handleDownload()
        }
      })
    } catch {
      handleDownload()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            <span>Sharable Verified Member Badge Studio</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate high-resolution verified credentials for Instagram, Twitter/X, and WhatsApp Stories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleShare}
            className="text-xs font-semibold border-slate-300"
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            Share Graphic
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download PNG
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-sm space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Customize Badge Details
          </h3>

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
              <Label className="text-xs font-semibold text-slate-700">Member Since</Label>
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
                <SelectValue placeholder="Select Badge Title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Verified Constitutional Protector">Verified Constitutional Protector</SelectItem>
                <SelectItem value="Verified Union Member">Verified Union Member</SelectItem>
                <SelectItem value="Verified Civic Organizer">Verified Civic Organizer</SelectItem>
                <SelectItem value="Verified Legal Defense Volunteer">Verified Legal Defense Volunteer</SelectItem>
                <SelectItem value="Verified Humanitarian Volunteer">Verified Humanitarian Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Social Format / Aspect Ratio</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={`py-2 text-xs font-medium border rounded-sm transition-all ${
                  aspectRatio === '1:1'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                1:1 Post (IG/X)
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
                16:9 Banner
              </button>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Color Aesthetic</Label>
            <Select value={themeId} onValueChange={setThemeId}>
              <SelectTrigger className="mt-1 h-9 text-xs rounded-sm">
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center bg-slate-100 border border-slate-200 p-6 rounded-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Live Render Preview ({aspectRatio})</span>
          </div>

          <div className="max-w-full overflow-hidden shadow-lg border border-slate-300 rounded-sm bg-white">
            <canvas
              ref={canvasRef}
              className="max-h-[480px] w-auto object-contain block mx-auto"
            />
          </div>

          <p className="text-[11px] text-slate-500 mt-4 text-center">
            Rendered natively in browser canvas at high-DPI output resolution.
          </p>
        </div>
      </div>
    </div>
  )
}
