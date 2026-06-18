import { describe, it, expect, vi, type Mock } from 'vitest'
import { applyCursorPagination, processPaginatedResult, type SupabaseQuery } from './pagination'

describe('pagination utils', () => {
  describe('applyCursorPagination', () => {
    interface MockQuery extends SupabaseQuery {
      order: Mock<(column: string, options: { ascending: boolean }) => MockQuery>
      gt: Mock<(column: string, value: string) => MockQuery>
      lt: Mock<(column: string, value: string) => MockQuery>
      limit: Mock<(value: number) => MockQuery>
    }

    const createMockQuery = () => {
      const mock = {
        order: vi.fn().mockReturnThis(),
        gt: vi.fn().mockReturnThis(),
        lt: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
      }
      return mock as unknown as MockQuery
    }

    it('should apply default order and limit when no cursor is provided', () => {
      const query = createMockQuery()
      const result = applyCursorPagination(query, { limit: 10 })

      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(query.limit).toHaveBeenCalledWith(11) // limit + 1
      expect(result).toBe(query)
    })

    it('should apply lt filter for next pagination', () => {
      const query = createMockQuery()
      applyCursorPagination(query, { cursor: '2023-01-01', direction: 'next', limit: 10 })

      expect(query.lt).toHaveBeenCalledWith('created_at', '2023-01-01')
      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false })
    })

    it('should apply gt filter and reversed order for prev pagination', () => {
      const query = createMockQuery()
      applyCursorPagination(query, { cursor: '2023-01-01', direction: 'prev', limit: 10 })

      expect(query.gt).toHaveBeenCalledWith('created_at', '2023-01-01')
      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: true })
    })

    it('should use default limit of 20 if not provided', () => {
        const query = createMockQuery()
        applyCursorPagination(query, {})
        expect(query.limit).toHaveBeenCalledWith(21)
    })
  })

  describe('processPaginatedResult', () => {
    it('should handle null data', () => {
      const result = processPaginatedResult(null, 10)
      expect(result).toEqual({ data: [], nextCursor: null, prevCursor: null })
    })

    it('should return items up to limit and set nextCursor if more items available', () => {
      const data = [
        { created_at: '3' },
        { created_at: '2' },
        { created_at: '1' },
      ]
      const result = processPaginatedResult(data, 2)

      expect(result.data).toEqual([{ created_at: '3' }, { created_at: '2' }])
      expect(result.nextCursor).toBe('2')
    })

    it('should return all items and null nextCursor if fewer than limit + 1 items', () => {
      const data = [
        { created_at: '2' },
        { created_at: '1' },
      ]
      const result = processPaginatedResult(data, 2)

      expect(result.data).toEqual([{ created_at: '2' }, { created_at: '1' }])
      expect(result.nextCursor).toBeNull()
    })

    it('should reverse items back when direction is prev', () => {
      const data = [
        { created_at: '3' },
        { created_at: '4' },
        { created_at: '5' },
      ]
      const result = processPaginatedResult(data, 2, 'prev')

      expect(result.data).toEqual([{ created_at: '4' }, { created_at: '3' }])
      expect(result.nextCursor).toBe('3')
    })
  })
})
