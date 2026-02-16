'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, PlayCircle } from 'lucide-react'
import { acceptAssignment, updateTaskStatus, logHours } from '@/actions/tasks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TaskAssignment {
  member_id: string
  accepted: boolean
}

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date?: string
  task_assignments?: TaskAssignment[]
}

export function TaskCard({ task, userId }: { task: Task, userId: string }) {
  const [loading, setLoading] = useState(false)
  const assignment = task.task_assignments?.find((a) => a.member_id === userId)
  const [hours, setHours] = useState('')
  const [note, setNote] = useState('')
  const [logOpen, setLogOpen] = useState(false)

  const handleAccept = async () => {
    setLoading(true)
    await acceptAssignment(task.id)
    setLoading(false)
  }

  const handleStart = async () => {
    setLoading(true)
    await updateTaskStatus(task.id, 'in_progress')
    setLoading(false)
  }

  const handleComplete = async () => {
    setLoading(true)
    await updateTaskStatus(task.id, 'completed')
    setLoading(false)
  }

  const handleLogHours = async () => {
    setLoading(true)
    await logHours({ task_id: task.id, hours: parseFloat(hours), note })
    setLoading(false)
    setLogOpen(false)
  }

  const statusColors = {
    'open': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'archived': 'bg-gray-100 text-gray-800'
  }

  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-50 text-blue-700',
    'high': 'bg-red-50 text-red-700'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{task.title}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className={statusColors[task.status as keyof typeof statusColors]}>
                {task.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                {task.priority}
              </Badge>
            </div>
          </div>
          {task.due_date && (
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              Due {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        
        {assignment && !assignment.accepted && task.status === 'open' && (
          <Button size="sm" onClick={handleAccept} disabled={loading} className="w-full">
            Accept Task
          </Button>
        )}

        {assignment && assignment.accepted && task.status === 'open' && (
          <Button size="sm" onClick={handleStart} disabled={loading} className="w-full">
            <PlayCircle className="w-4 h-4 mr-2" /> Start Working
          </Button>
        )}

        {task.status === 'in_progress' && (
          <div className="flex gap-2">
            <Dialog open={logOpen} onOpenChange={setLogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1">
                  <Clock className="w-4 h-4 mr-2" /> Log Hours
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Volunteer Hours</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Hours Spent</Label>
                    <Input type="number" step="0.5" value={hours} onChange={e => setHours(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Note</Label>
                    <Input value={note} onChange={e => setNote(e.target.value)} placeholder="What did you do?" />
                  </div>
                  <Button onClick={handleLogHours} disabled={loading || !hours} className="w-full">Submit Log</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button size="sm" onClick={handleComplete} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" /> Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
