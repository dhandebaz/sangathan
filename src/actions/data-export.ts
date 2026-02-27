'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { exportOrganisationData } from '@/lib/sovereignty'
import { logger } from '@/lib/logger'

const ExportDataSchema = z.object({})

export const exportData = createSafeAction(
  ExportDataSchema,
  async (input, context) => {
    // Check if user is admin
    if (context.role !== 'admin') {
      throw new Error('Only administrators can export organisation data.')
    }

    try {
      const data = await exportOrganisationData()
      
      if (!data) {
        throw new Error('Export failed: No data returned.')
      }

      // In a real production environment, we might:
      // 1. Upload this JSON to secure storage (S3/R2) and return a signed URL.
      // 2. Stream it directly if small enough.
      // For this implementation, we return the data directly to the client to trigger a download.
      // Ideally, for large datasets, this should be an async job.
      
      await logger.security('sovereignty', `Admin ${context.user.id} triggered data export for org ${context.organizationId}`, {}, context.user.id)

      return { 
        data,
        filename: `sangathan-export-${context.organizationId}-${new Date().toISOString().split('T')[0]}.json`
      }
    } catch (error) {
      console.error('Export Error:', error)
      throw new Error('Failed to generate export package.')
    }
  },
  { allowedRoles: ['admin'] }
)
