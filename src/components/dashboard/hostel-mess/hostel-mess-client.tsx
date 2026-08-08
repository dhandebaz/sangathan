'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Home, Utensils, Star, AlertTriangle, Moon, CheckCircle2, Plus, Sparkles, Loader2 } from 'lucide-react'
import { submitMessRatingAction, reportHostelIssueAction } from '@/actions/hostel-mess'
import { toast } from 'sonner'

interface HostelMessClientProps {
  organisationId: string
  initialLogs: any[]
}

export default function HostelMessClient({ initialLogs }: HostelMessClientProps) {
  const [logs, setLogs] = useState<any[]>(initialLogs)
  const [activeTab, setActiveTab] = useState<'mess' | 'hostel' | 'night'>('mess')
  const [loading, setLoading] = useState(false)

  // Mess rating state
  const [hostelName, setHostelName] = useState('')
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snacks' | 'dinner'>('lunch')
  const [rating, setRating] = useState(4)
  const [messComments, setMessComments] = useState('')

  // Hostel issue state
  const [issueHostel, setIssueHostel] = useState('')
  const [studentName, setStudentName] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [issueType, setIssueType] = useState<'delayed_allotment' | 'illegal_occupancy' | 'sanitation_failure' | 'water_electricity'>('delayed_allotment')
  const [issueDesc, setIssueDesc] = useState('')

  const handleMessRating = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hostelName) return
    setLoading(true)

    try {
      const res = await submitMessRatingAction({
        hostelName,
        mealType,
        rating,
        comments: messComments
      })

      if (res.success && res.data) {
        toast.success('Mess Rating submitted & saved to database!')
        setLogs([res.data, ...logs])
        setHostelName('')
        setMessComments('')
      } else {
        toast.error(res.error || 'Failed to submit rating')
      }
    } catch {
      toast.error('An error occurred while submitting rating')
    } finally {
      setLoading(false)
    }
  }

  const handleHostelReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueHostel || !studentName) return
    setLoading(true)

    try {
      const res = await reportHostelIssueAction({
        hostelName: issueHostel,
        studentName,
        rollNumber,
        issueType,
        description: issueDesc
      })

      if (res.success && res.data) {
        toast.success('Hostel Issue reported & saved to database!')
        setLogs([res.data, ...logs])
        setIssueHostel('')
        setStudentName('')
        setRollNumber('')
        setIssueDesc('')
      } else {
        toast.error(res.error || 'Failed to submit report')
      }
    } catch {
      toast.error('An error occurred while reporting issue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white text-slate-900 p-6 rounded-sm border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hostel &amp; Mess Quality Audit Portal</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Hostel room allotment tracking, mess food quality reviews, and 24x7 study hall status.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('mess')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'mess' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Mess Quality Rating
          </button>
          <button
            onClick={() => setActiveTab('hostel')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'hostel' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Hostel Allotment Grievances
          </button>
          <button
            onClick={() => setActiveTab('night')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'night' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            24x7 Campus Facilities
          </button>
        </div>
      </div>

      {/* Tab 1: Mess Quality Rating */}
      {activeTab === 'mess' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border shadow-md bg-white">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-slate-900 flex items-center gap-2 text-lg">
                <Utensils className="w-5 h-5 text-teal-600" />
                Submit Mess Meal Audit (मेस गुणवत्ता समीक्षा)
              </CardTitle>
              <CardDescription>
                Rate daily hostel meals and record food hygiene issues for Mess Committee review.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleMessRating}>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Hostel Name / Mess No. *</label>
                    <input
                      type="text"
                      required
                      value={hostelName}
                      onChange={e => setHostelName(e.target.value)}
                      placeholder="e.g. Jhelum Hostel Mess #2"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Meal Type</label>
                    <select
                      value={mealType}
                      onChange={e => setMealType(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="snacks">Evening Snacks</option>
                      <option value="dinner">Dinner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-lg border transition ${rating >= star ? 'bg-amber-100 border-amber-400 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Comments / Hygiene Report</label>
                  <textarea
                    rows={3}
                    value={messComments}
                    onChange={e => setMessComments(e.target.value)}
                    placeholder="e.g. Quality of chapati was poor, insufficient drinking water facility."
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Audit to Supabase
                </button>
              </CardFooter>
            </form>
          </Card>

          {/* Quick Metrics */}
          <Card className="border shadow-md bg-gradient-to-b from-slate-900 to-teal-950 text-white p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                Mess Quality Index
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-sm text-slate-300">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <p className="text-xs uppercase font-bold text-teal-300">Average Mess Rating</p>
                <p className="text-3xl font-black text-white mt-1">3.8 / 5.0 ★</p>
              </div>
              <p className="text-xs leading-relaxed">
                All 1-star and 2-star reviews automatically alert the Student Union Executive and Hostel Mess Committee.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Hostel Allotment Grievances */}
      {activeTab === 'hostel' && (
        <Card className="border shadow-md bg-white">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Report Hostel Room Allotment Issue (छात्रावास समस्या रिपोर्ट)
            </CardTitle>
            <CardDescription>
              Report delayed allotments, unauthorized room occupancy, or infrastructure breakdowns.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleHostelReport}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hostel Name *</label>
                  <input
                    type="text"
                    required
                    value={issueHostel}
                    onChange={e => setIssueHostel(e.target.value)}
                    placeholder="e.g. Godavari Hostel"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="e.g. Ananya Roy"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Enrollment / Roll No.</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    placeholder="e.g. 24/MA/POL/019"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={issueType}
                    onChange={e => setIssueType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="delayed_allotment">Delayed Room Allotment for 1st Year / PG</option>
                    <option value="illegal_occupancy">Unauthorized / Illegal Occupancy</option>
                    <option value="sanitation_failure">Washroom Sanitation & Cleanliness Failure</option>
                    <option value="water_electricity">Water Supply / Electricity Breakdown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Details</label>
                  <input
                    type="text"
                    required
                    value={issueDesc}
                    onChange={e => setIssueDesc(e.target.value)}
                    placeholder="Describe room condition or allotment delay..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                File Hostel Grievance in DB
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tab 3: 24x7 Night Facilities */}
      {activeTab === 'night' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Moon className="w-6 h-6 text-indigo-600" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Central Reading Hall</h4>
                  <p className="text-xs text-emerald-600 font-bold">24x7 Open • 140 Seats Free</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Air-conditioned study hall with high-speed campus Wi-Fi.</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Utensils className="w-6 h-6 text-amber-600" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Campus Night Canteen</h4>
                  <p className="text-xs text-emerald-600 font-bold">Open till 3:30 AM</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Located near Library Gate. Subsidized tea and snacks available.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Logs from Supabase */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-base">
            Database Hostel & Mess Grievance Log ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {logs.map((item: any) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50">
              <div>
                <span className="font-extrabold text-slate-900 text-base">{item.title}</span>
                <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{item.description}</p>
                <p className="text-[11px] text-teal-700 font-medium mt-1">
                  Logged: {new Date(item.created_at).toLocaleDateString()} • Priority: <span className="uppercase font-bold">{item.priority}</span>
                </p>
              </div>
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                {item.status}
              </span>
            </div>
          ))}

          {logs.length === 0 && (
            <p className="text-xs text-slate-500 p-6 text-center">No hostel or mess records logged in database yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
