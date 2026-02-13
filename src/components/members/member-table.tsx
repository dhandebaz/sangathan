'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal } from 'lucide-react'
import { changeMemberStatus } from '@/actions/members/actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Member {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  designation: string | null
  area: string | null
  status: 'active' | 'inactive' | null
  joining_date: string | null
  role: string | null
}

export function MemberTable({ members }: { members: Member[] }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusToggle = async (member: Member) => {
    // Optimistic UI could be implemented here
    if (confirm(`Are you sure you want to ${member.status === 'active' ? 'deactivate' : 'activate'} this member?`)) {
        setIsUpdating(true)
        const newStatus = member.status === 'active' ? 'inactive' : 'active'
        await changeMemberStatus({ memberId: member.id, status: newStatus })
        router.refresh()
        setIsUpdating(false)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="hidden md:table-cell">Designation</TableHead>
            <TableHead className="hidden md:table-cell">Area</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id} className="group">
                <TableCell className="font-medium">{member.full_name}</TableCell>
                <TableCell className="text-muted-foreground">{member.phone || '-'}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{member.designation || '-'}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{member.area || '-'}</TableCell>
                <TableCell>
                  <Badge variant={member.status === 'active' ? 'success' : 'secondary'}>
                    {member.status || 'active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => handleStatusToggle(member)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {member.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
