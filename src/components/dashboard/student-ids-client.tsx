'use client'

import { useState } from 'react'
import { Badge as BadgeIcon, Printer, Search, User, BadgeCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface Student {
  id: string
  full_name: string
  membership_number: string | null
  created_at: string
  status: string
}

interface StudentIdsClientProps {
  initialStudents: Student[]
  lang: string
  orgName: string
}

export function StudentIdCard({ student, orgName }: { student: Student; orgName: string }) {
  const membershipId = student.membership_number || `STU-${student.id.split('-')[0].toUpperCase()}`
  const issueDate = new Date(student.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="w-[380px] h-[240px] border border-border rounded-sm overflow-hidden shadow-md bg-card relative flex flex-col font-sans text-foreground select-none print:shadow-none print:border-black mx-auto">
      {/* Card Header */}
      <div className="bg-indigo-700 text-white px-4 py-2 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold opacity-95 line-clamp-1">{orgName}</h3>
          <h2 className="text-xs font-black tracking-wide">STUDENT IDENTITY CARD</h2>
        </div>
        <BadgeCheck className="w-5 h-5 text-indigo-200" />
      </div>

      {/* Card Body */}
      <div className="p-4 flex gap-4 flex-1">
        {/* Photo Box */}
        <div className="w-20 h-24 bg-muted border border-border rounded-sm flex flex-col items-center justify-center text-muted-foreground shrink-0">
          <User className="w-10 h-10" />
          <span className="text-[8px] mt-1 font-semibold text-muted-foreground">Photo</span>
        </div>

        {/* Details Box */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-1">
            <div>
              <span className="text-[9px] text-muted-foreground block font-semibold">Name</span>
              <p className="text-xs font-bold text-foreground leading-tight truncate">{student.full_name}</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground block font-semibold">Membership ID</span>
              <p className="text-xs font-mono font-bold text-indigo-600">{membershipId}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] text-muted-foreground block font-semibold">Status</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold bg-green-100 text-green-800">
                  ACTIVE
                </span>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground block font-semibold">Issue Date</span>
                <p className="text-[9px] text-foreground font-semibold">{issueDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-3 flex justify-between items-end text-[8px] text-muted-foreground font-medium">
        <div className="flex flex-col items-center">
          <div className="w-20 border-b border-border h-5"></div>
          <span className="mt-1">Holder&apos;s Signature</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 border-b border-border h-5 flex items-end justify-center font-serif italic text-indigo-800 text-[9px] select-none font-bold">
            {orgName.substring(0, 3).toUpperCase()} Union
          </div>
          <span className="mt-1">Authorized Authority</span>
        </div>
      </div>
    </div>
  )
}

export function StudentIdsClient({ initialStudents, lang, orgName }: StudentIdsClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredStudents = initialStudents.filter((student) => {
    const term = searchTerm.toLowerCase()
    const nameMatch = student.full_name?.toLowerCase().includes(term)
    const membershipId = student.membership_number || `STU-${student.id.split('-')[0].toUpperCase()}`
    const idMatch = membershipId.toLowerCase().includes(term)
    return nameMatch || idMatch
  })

  const handlePrintBatch = () => {
    window.open('/' + lang + '/dashboard/student-ids/print', '_blank')
  }

  const handleViewId = (student: Student) => {
    setSelectedStudent(student)
    setIsDialogOpen(true)
  }

  const handlePrintSingle = () => {
    if (selectedStudent) {
      window.open('/' + lang + '/dashboard/student-ids/print?id=' + selectedStudent.id, '_blank')
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Union IDs</h1>
          <p className="text-muted-foreground mt-1">Issue, manage, and print verifiable digital identity cards.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={handlePrintBatch}>
            <Printer size={16} />
            Print Batch
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-sm border border-border overflow-hidden shadow-sm mb-6">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search students by name or ID..."
              className="pl-9 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Membership ID</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => {
                const membershipId = student.membership_number || `STU-${student.id.split('-')[0].toUpperCase()}`
                return (
                  <tr key={student.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                          <BadgeIcon size={18} />
                        </div>
                        <div className="font-medium text-foreground">{student.full_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {membershipId}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-sm">Active</span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        onClick={() => handleViewId(student)}
                      >
                        <Printer size={14} /> View ID
                      </Button>
                    </td>
                  </tr>
                )
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No students found. Add members to issue IDs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Student Identity Card Preview</DialogTitle>
            <DialogDescription>
              Verify the details on the student card. Click Print Card to open printable view.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex justify-center bg-muted border border-dashed border-border rounded-lg">
            {selectedStudent && (
              <StudentIdCard student={selectedStudent} orgName={orgName} />
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button className="gap-2" onClick={handlePrintSingle}>
              <Printer size={16} />
              Print Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
