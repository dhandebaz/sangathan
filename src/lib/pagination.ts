import { PostgrestFilterBuilder } from '@supabase/postgrest-js'

export type PaginationParams = {
  cursor?: string // Typically created_at timestamp
  limit?: number
  direction?: 'next' | 'prev'
}

export type PaginatedResult<T> = {
  data: T[]
  nextCursor: string | null
  prevCursor: string | null
}

/**
 * Applies cursor-based pagination to a Supabase query.
 * Designed for large tables (Members, Submissions) to avoid OFFSET drift.
 * 
 * Strategy:
 * - Sort by created_at DESC (Newest first)
 * - Next Page: WHERE created_at < cursor
 * - Prev Page: WHERE created_at > cursor (and reverse order, then flip back)
 */
export function applyCursorPagination<T>(
  query: any, // Typed as any because Supabase types are complex generic chains
  params: PaginationParams
) {
  const limit = params.limit || 20
  // Fetch one extra to check if there's a next page
  const fetchLimit = limit + 1
  
  let modifiedQuery = query.order('created_at', { ascending: false })

  if (params.cursor) {
    if (params.direction === 'prev') {
       // Fetch newer records
       modifiedQuery = modifiedQuery
         .gt('created_at', params.cursor)
         // We need to invert sort to get the ones immediately preceding the cursor
         .order('created_at', { ascending: true })
    } else {
       // Fetch older records (default 'next')
       modifiedQuery = modifiedQuery.lt('created_at', params.cursor)
    }
  }

  return modifiedQuery.limit(fetchLimit)
}

export function processPaginatedResult<T extends { created_at: string }>(
  data: T[] | null,
  limit: number,
  direction: 'next' | 'prev' = 'next'
): PaginatedResult<T> {
  if (!data) return { data: [], nextCursor: null, prevCursor: null }

  const hasMore = data.length > limit
  // If we fetched more than limit, pop the extra one
  const items = hasMore ? data.slice(0, limit) : data
  
  // If 'prev' direction, we sorted ASC to get nearest neighbors, so reverse back to DESC
  if (direction === 'prev') {
    items.reverse()
  }

  const nextCursor = hasMore || direction === 'prev' ? items[items.length - 1]?.created_at : null
  const prevCursor = (direction === 'next' && data.length > 0) ? items[0]?.created_at : null 
  
  // Note: True bidirectional cursor pagination usually requires passing both start/end cursors 
  // or maintaining state. This is a simplified version for "Load More" style or basic prev/next.
  
  return {
    data: items,
    nextCursor: hasMore ? items[items.length - 1].created_at : null,
    prevCursor: null // Simplified for infinite scroll use case mostly
  }
}
