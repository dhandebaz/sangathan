'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'

interface MemberFiltersProps {
  initialQuery: string
  initialStatus: string
}

export function MemberFilters({ initialQuery, initialStatus }: MemberFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const lang = params.lang as string

  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState(initialStatus)
  const debouncedQuery = useDebounce(query, 500)

  // Update URL when debounced query or status changes
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    if (debouncedQuery) {
      current.set('q', debouncedQuery)
    } else {
      current.delete('q')
    }

    if (status !== 'all') {
      current.set('status', status)
    } else {
      current.delete('status')
    }

    // Reset to page 1 on filter change
    current.set('page', '1')

    const search = current.toString()
    const queryStr = search ? `?${search}` : ''
    
    router.push(`/${lang}/members${queryStr}`)
  }, [debouncedQuery, status, router, lang, searchParams])

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or phone..."
          className="pl-10"
        />
      </div>

      <div className="w-full md:w-48">
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
