import * as Sentry from '@sentry/nextjs'

export interface SentryContext {
  tags?: Record<string, string | number | boolean | undefined>
  extra?: Record<string, unknown>
  user?: {
    id?: string
    email?: string
    role?: string
  }
  organisationId?: string
  source?: string
  level?: Sentry.SeverityLevel
}

/**
 * Safely captures an exception in Sentry with contextual metadata and tags
 */
export function captureException(error: unknown, context?: SentryContext) {
  try {
    Sentry.withScope((scope) => {
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, val]) => {
          if (val !== undefined) {
            scope.setTag(key, String(val))
          }
        })
      }

      if (context?.source) {
        scope.setTag('source', context.source)
      }

      if (context?.organisationId) {
        scope.setTag('organisation_id', context.organisationId)
      }

      if (context?.user?.id) {
        scope.setUser({
          id: context.user.id,
          email: context.user.email,
          role: context.user.role,
        })
      }

      if (context?.extra) {
        scope.setExtras(context.extra)
      }

      if (context?.level) {
        scope.setLevel(context.level)
      }

      Sentry.captureException(error)
    })
  } catch (err) {
    console.error('Failed to capture exception in Sentry:', err, error)
  }
}

/**
 * Safely captures an informational, warning, or security message in Sentry
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: SentryContext) {
  try {
    Sentry.withScope((scope) => {
      scope.setLevel(level)

      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, val]) => {
          if (val !== undefined) {
            scope.setTag(key, String(val))
          }
        })
      }

      if (context?.source) {
        scope.setTag('source', context.source)
      }

      if (context?.organisationId) {
        scope.setTag('organisation_id', context.organisationId)
      }

      if (context?.user?.id) {
        scope.setUser({
          id: context.user.id,
          email: context.user.email,
          role: context.user.role,
        })
      }

      if (context?.extra) {
        scope.setExtras(context.extra)
      }

      Sentry.captureMessage(message, level)
    })
  } catch (err) {
    console.error('Failed to capture message in Sentry:', err, message)
  }
}

/**
 * Sets current user scope for Sentry
 */
export function setUserContext(user: { id: string; email?: string; role?: string; username?: string }) {
  try {
    Sentry.setUser(user)
  } catch {
    // Silently ignore if Sentry is uninitialized
  }
}

/**
 * Clears current user scope (e.g. on logout)
 */
export function clearUserContext() {
  try {
    Sentry.setUser(null)
  } catch {
    // Silently ignore
  }
}
