'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Megaphone, Home, Calendar, MapPin, CheckCircle2, Plus, Sparkles, Loader2 } from 'lucide-react'
import { logH2HCanvassingAction, scheduleC2CClassAction } from '@/actions/campus-campaigning'
import { toast } from 'sonner'

interface CampaigningClientProps {
  organisationId: string
  initialTasks: any[]
  initialEvents: any[]
}

export default function CampaigningClient({ initialTasks, initialEvents }: CampaigningClientProps) {
  const [tasks, setTasks] = useState<any[]>(initialTasks)
  const [events, setEvents] = useState<any[]>(initialEvents)

  const [activeTab, setActiveTab] = useState<'h2h' | 'c2c' | 'posters'>('h2h')
  const [loading, setLoading] = useState(false)

  // H2H state
  const [hostelBlock, setHostelBlock] = useState('')
  const [cadreLead, setCadreLead] = useState('')
  const [floorsCovered, setFloorsCovered] = useState('')
  const [studentResponses, setStudentResponses] = useState('')

  // C2C state
  const [department, setDepartment] = useState('')
  const [courseYear, setCourseYear] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  const handleH2HCanvass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hostelBlock || !cadreLead) return
    setLoading(true)

    try {
      const res = await logH2HCanvassingAction({
        hostelBlock,
        cadreLead,
        floorsCovered,
        studentResponses
      })

      if (res.success && res.data) {
        toast.success('H2H Canvassing drive logged in Supabase!')
        setTasks([res.data, ...tasks])
        setHostelBlock('')
        setCadreLead('')
        setFloorsCovered('')
        setStudentResponses('')
      } else {
        toast.error(res.error || 'Failed to log H2H drive')
      }
    } catch {
      toast.error('An error occurred while logging H2H drive')
    } finally {
      setLoading(false)
    }
  }

  const handleC2CSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!department || !scheduledTime) return
    setLoading(true)

    try {
      const res = await scheduleC2CClassAction({
        department,
        courseYear: courseYear || '1st Year',
        scheduledTime
      })

      if (res.success && res.data) {
        toast.success('C2C Class Campaign scheduled in Supabase!')
        setEvents([res.data, ...events])
        setDepartment('')
        setCourseYear('')
        setScheduledTime('')
      } else {
        toast.error(res.error || 'Failed to schedule C2C campaign')
      }
    } catch {
      toast.error('An error occurred while scheduling C2C campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white text-slate-900 p-6 rounded-sm border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Campus Campaigning &amp; Mobilization Suite</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Hostel-to-Hostel (H2H) canvassing tracker, Class-to-Class (C2C) lecture campaign scheduler, and poster wall allocation.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('h2h')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'h2h' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            H2H Hostel Canvassing
          </button>
          <button
            onClick={() => setActiveTab('c2c')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'c2c' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            C2C Class Campaigning
          </button>
          <button
            onClick={() => setActiveTab('posters')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'posters' ? 'bg-white text-orange-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Handmade Poster Wall Map
          </button>
        </div>
      </div>

      {/* Tab 1: H2H Canvassing */}
      {activeTab === 'h2h' && (
        <Card className="border shadow-md bg-white">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-orange-600" />
              Log Hostel-to-Hostel (H2H) Canvassing Drive
            </CardTitle>
            <CardDescription>
              Record night canvassing coverage across hostels and assign floor leads.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleH2HCanvass}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hostel Block / Name *</label>
                  <input
                    type="text"
                    required
                    value={hostelBlock}
                    onChange={e => setHostelBlock(e.target.value)}
                    placeholder="e.g. Periyar Hostel (Block A & B)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Cadre Lead / Coordinator *</label>
                  <input
                    type="text"
                    required
                    value={cadreLead}
                    onChange={e => setCadreLead(e.target.value)}
                    placeholder="e.g. Rahul Sharma (2nd Year)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Floors / Rooms Covered</label>
                  <input
                    type="text"
                    value={floorsCovered}
                    onChange={e => setFloorsCovered(e.target.value)}
                    placeholder="e.g. 1st & 2nd Floor (Rooms 101-140)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Student Feedback / Responses</label>
                <textarea
                  rows={3}
                  value={studentResponses}
                  onChange={e => setStudentResponses(e.target.value)}
                  placeholder="Key demands raised by hostellers during door-to-door interaction..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Log Canvassing Drive to Supabase
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tab 2: C2C Class Campaigning */}
      {activeTab === 'c2c' && (
        <Card className="border shadow-md bg-white">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Schedule Class-to-Class (C2C) Campaigning
            </CardTitle>
            <CardDescription>
              Plan 5-minute lecture interventions across academic departments.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleC2CSchedule}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Academic Department *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Dept of History / Law Faculty"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Course & Year</label>
                  <input
                    type="text"
                    value={courseYear}
                    onChange={e => setCourseYear(e.target.value)}
                    placeholder="e.g. MA History 1st Year (Section A)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Scheduled Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Schedule Class Intervention in DB
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tab 3: Handmade Poster Wall Map */}
      {activeTab === 'posters' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-600" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Arts Faculty Wall Spot #4</h4>
                  <p className="text-xs text-emerald-600 font-bold">Lyngdoh Handmade Poster Reserved</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Allocated for presidential manifesto handmade chart series.</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-600" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Central Library Gate Spot</h4>
                  <p className="text-xs text-emerald-600 font-bold">Handmade Banner Approved</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Allocated for joint front election banner (hand-painted cloth).</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Database Canvassing & Campaign Logs */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-base">
            Database Campaigning Log ({tasks.length + events.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {tasks.map((item: any) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50">
              <div>
                <span className="font-extrabold text-slate-900 text-base">{item.title}</span>
                <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{item.description}</p>
                <p className="text-[11px] text-orange-700 font-medium mt-1">
                  Completed: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                H2H Logged
              </span>
            </div>
          ))}

          {events.map((item: any) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50">
              <div>
                <span className="font-extrabold text-slate-900 text-base">{item.title}</span>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                <p className="text-[11px] text-orange-700 font-medium mt-1">
                  Scheduled Time: {new Date(item.start_time).toLocaleString()}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                C2C Planned
              </span>
            </div>
          ))}

          {tasks.length === 0 && events.length === 0 && (
            <p className="text-xs text-slate-500 p-6 text-center">No canvassing drives or class campaigns logged in database yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
