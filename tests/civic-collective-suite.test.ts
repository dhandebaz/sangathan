import { describe, it, expect } from 'vitest'
import { z } from 'zod'

describe('Civic Collectives & Citizen Science Field Suite', () => {
  it('validates field spot audit sensor parsing and severity logic', () => {
    const AuditSchema = z.object({
      auditType: z.enum(['air_quality', 'water_quality', 'waste_burning', 'industrial_emissions', 'construction_dust', 'tree_felling', 'civic_infrastructure']),
      locationName: z.string().min(2),
      severity: z.enum(['moderate', 'high', 'severe', 'hazardous']),
      sensorReadings: z.object({
        pm2_5: z.number().optional(),
        pm10: z.number().optional(),
        tds_ppm: z.number().optional(),
        ph_level: z.number().optional(),
      }).optional(),
    })

    const sampleAudit = {
      auditType: 'air_quality' as const,
      locationName: 'Anand Vihar ISBT Hotspot',
      severity: 'hazardous' as const,
      sensorReadings: {
        pm2_5: 485,
        pm10: 620,
        tds_ppm: 820,
        ph_level: 6.4,
      },
    }

    const parsed = AuditSchema.safeParse(sampleAudit)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.sensorReadings?.pm2_5).toBe(485)
      expect(parsed.data.severity).toBe('hazardous')
    }
  })

  it('validates press release structure and spokesperson constraints', () => {
    const PressReleaseSchema = z.object({
      titleEn: z.string().min(5),
      titleHi: z.string().optional(),
      locationHeader: z.string(),
      embargoType: z.enum(['immediate', 'timed']),
      spokespersonName: z.string().min(2),
      spokespersonPhone: z.string().min(8),
    })

    const samplePR = {
      titleEn: 'Delhi Saans Releases Ground Air Audit Exposing 8x PM2.5 Violations in Anand Vihar',
      titleHi: 'आनंद विहार में 8 गुना अधिक PM2.5 प्रदूषण: दिल्ली सांस ने डीपीसीसी को भेजा कानूनी नोटिस',
      locationHeader: 'NEW DELHI',
      embargoType: 'immediate' as const,
      spokespersonName: 'Adv. Amit Kumar',
      spokespersonPhone: '+91 98765 43210',
    }

    const parsed = PressReleaseSchema.safeParse(samplePR)
    expect(parsed.success).toBe(true)
  })

  it('computes 15-day statutory deadline and overdue status correctly', () => {
    const submissionDate = '2026-08-01'
    const deadlineDays = 15
    const now = new Date('2026-08-15T00:00:00Z').getTime()
    const subTime = new Date('2026-08-01T00:00:00Z').getTime()

    const elapsedDays = Math.floor((now - subTime) / (1000 * 60 * 60 * 24))
    const remainingDays = deadlineDays - elapsedDays
    const isOverdue = remainingDays <= 0

    expect(elapsedDays).toBe(14)
    expect(remainingDays).toBe(1)
    expect(isOverdue).toBe(false)

    // Test overdue
    const overdueNow = new Date('2026-08-20T00:00:00Z').getTime()
    const overdueElapsed = Math.floor((overdueNow - subTime) / (1000 * 60 * 60 * 24))
    const overdueRemaining = deadlineDays - overdueElapsed
    expect(overdueElapsed).toBe(19)
    expect(overdueRemaining).toBe(-4)
    expect(overdueRemaining <= 0).toBe(true)
  })

  it('validates Parcha and physical signature sheet schema', () => {
    const ParchaSchema = z.object({
      mainBannerHeadingHi: z.string(),
      mainBannerHeadingEn: z.string(),
      bulletedDemandsHi: z.array(z.string()).min(1),
      callToActionHi: z.string(),
      signatureSheetPreambleHi: z.string(),
    })

    const sampleParcha = {
      mainBannerHeadingHi: 'गंदे पानी व टूटी सड़कों के खिलाफ जन आंदोलन',
      mainBannerHeadingEn: 'Citizen Action Against Contaminated Water & Broken Roads',
      bulletedDemandsHi: [
        '1. पानी की पाइपलाइन की तत्काल मरम्मत',
        '2. नियमित निःशुल्क पानी के टैंकर',
      ],
      callToActionHi: 'रविवार शाम 5 बजे पार्क में पहुंचें',
      signatureSheetPreambleHi: 'हम समस्त निवासीगण प्रशासन से मांग करते हैं...',
    }

    const parsed = ParchaSchema.safeParse(sampleParcha)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.bulletedDemandsHi.length).toBe(2)
    }
  })
})
