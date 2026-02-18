import { UserContext, ActionResponse, Role } from '@/types/auth'
import { getSelectedOrganisationId, getUserContext, requireRole } from '@/lib/auth/context'
import { ZodSchema } from 'zod'

/**
 * Generic Safe Server Action Wrapper.
 *
 * This utility:
 * 1. Validates input using Zod.
 * 2. Fetches the authenticated user context (User + Org + Role).
 * 3. Enforces Role requirements if specified.
 * 4. Passes the context to the handler, ensuring no Org ID is ever accepted from the client.
 * 5. Handles errors consistently.
 */
export function createSafeAction<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  handler: (input: TInput, context: UserContext) => Promise<TOutput>,
  options: { allowedRoles?: Role[] } = {}
) {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    try {
      const validation = schema.safeParse(input)
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.issues[0].message,
        }
      }

      let context: UserContext
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

      const data = await handler(validation.data, context)

      return { success: true, data }
    } catch (error) {
      // Log error internally (e.g. Sentry) but return generic message
      // console.error('Action Error:', error) // Removed for production logic per requirement
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      }
    }
  }
}
