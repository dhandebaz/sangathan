import { UserContext, ActionResponse, Role } from '@/types/auth'
import { getSelectedOrganisationId, getUserContext, requireRole } from '@/lib/auth/context'
import { ZodSchema } from 'zod'
import { logger } from '@/lib/logger'

/**
 * Generic Safe Server Action Wrapper.
 *
 * This utility:
 * 1. Validates input using Zod.
 * 2. Fetches the authenticated user context (User + Org + Role).
 * 3. Enforces Role requirements if specified.
 * 4. Passes the context to the handler, ensuring no Org ID is ever accepted from the client.
 * 5. Handles errors consistently with observability.
 */
export function createSafeAction<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  handler: (input: TInput, context: UserContext) => Promise<TOutput>,
  options: { allowedRoles?: Role[], actionName?: string } = {}
) {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    let context: UserContext | undefined;

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
        // Auth errors are expected flow control, not system errors
        return { success: false, error: (authError as Error).message }
      }
      
      if (!context) {
          return { success: false, error: 'Unauthorized: Context initialization failed' }
      }

      const data = await handler(validation.data, context)

      return { success: true, data }
    } catch (error) {
      const actionName = options.actionName || 'unknown_action'
      
      // Extract safe context for logging (exclude PII)
      const logContext = context ? {
        userId: context.user.id,
        orgId: context.organizationId,
        role: context.role
      } : { note: 'Context not initialized' }

      // Log error with stack trace
      await logger.error('server_action', `Action failed: ${actionName}`, {
        error: error instanceof Error ? error.stack : String(error),
        action: actionName,
        context: logContext
      })

      return {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
      }
    }
  }
}
