import { UserContext, ActionResponse, Role, SafeActionContext } from '@/types/auth'
import { getSelectedOrganisationId, getUserContext, requireRole } from '@/lib/auth/context'
import { ZodSchema } from 'zod'
import { logger } from '@/lib/logger'
import { checkRateLimitByKey } from '@/lib/ratelimit'
import { requireCapability, type OrgCapability } from '@/lib/capabilities'
import { logAction } from '@/lib/audit/log'
import type { Json } from '@/types/database'

export interface ActionOptions {
  allowedRoles?: Role[]
  allowedCapabilities?: OrgCapability[]
  actionName?: string
  rateLimit?: { points: number; duration: number }
  audit?: {
    action: string
    resourceTable: string
    getResourceId: (input: unknown, context: SafeActionContext) => string
    getDetails?: (input: unknown, context: SafeActionContext) => Json
  }
}

function enrichContext(context: UserContext): SafeActionContext {
  return {
    ...context,
    logAction: (params) =>
      logAction({
        organisation_id: params.organisationId || context.organizationId,
        user_id: context.user.id,
        action: params.action,
        resource_table: params.resourceTable,
        resource_id: params.resourceId,
        details: params.details as Json,
      }),
  }
}

/**
 * Generic Safe Server Action Wrapper.
 *
 * Unified pattern for all server actions:
 * 1. Validates input using Zod.
 * 2. Fetches the authenticated user context (User + Org + Role).
 * 3. Enforces Role requirements if specified.
 * 4. Enforces Capability requirements if specified.
 * 5. Rate limits per-user/per-action using Upstash Redis.
 * 6. Passes the context to the handler (never accepts Org ID from client).
 * 7. Auto-audits the action if `audit` option is provided.
 * 8. Handles errors consistently with structured logging.
 */
export function createSafeAction<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  handler: (input: TInput, context: SafeActionContext) => Promise<TOutput>,
  options: ActionOptions = {}
) {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    let context: UserContext | undefined

    try {
      const validation = schema.safeParse(input)
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.issues[0].message,
        }
      }

      try {
        if (options.allowedRoles) {
          context = await requireRole(options.allowedRoles)
        } else {
          const organisationId = await getSelectedOrganisationId()
          context = await getUserContext(organisationId)
        }
      } catch (authError) {
        return { success: false, error: (authError as Error).message }
      }

      if (!context) {
        return { success: false, error: 'Unauthorized: Context initialization failed' }
      }

      // Capability check
      if (options.allowedCapabilities?.length) {
        for (const cap of options.allowedCapabilities) {
          try {
            await requireCapability(context.organizationId, cap)
          } catch {
            return { success: false, error: `Access Denied: Capability '${cap}' is not enabled for this organisation.` }
          }
        }
      }

      // Rate limiting via centralized Upstash system
      const rlConfig = options.rateLimit || { points: 60, duration: 60 }
      const rlKey = `${options.actionName || 'action'}:${context.user.id}`
      const allowed = await checkRateLimitByKey(rlKey, rlConfig.points, rlConfig.duration)
      if (!allowed) {
        return { success: false, error: 'Too many requests. Please slow down.' }
      }

      const enriched = enrichContext(context)
      const data = await handler(validation.data, enriched)

      // Auto-audit if configured
      if (options.audit) {
        const { action, resourceTable, getResourceId, getDetails } = options.audit
        await logAction({
          organisation_id: enriched.organizationId,
          user_id: enriched.user.id,
          action,
          resource_table: resourceTable,
          resource_id: getResourceId(input, enriched),
          details: getDetails ? getDetails(input, enriched) : undefined,
        })
      }

      return { success: true, data }
    } catch (error) {
      const actionName = options.actionName || 'unknown_action'
      const logContext = context
        ? { userId: context.user.id, orgId: context.organizationId, role: context.role }
        : { note: 'Context not initialized' }

      await logger.error('server_action', `Action failed: ${actionName}`, {
        error: error instanceof Error ? error.stack : String(error),
        action: actionName,
        context: logContext,
      })

      return {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
      }
    }
  }
}
