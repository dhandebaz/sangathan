'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { UserCheck, QrCode, Smartphone, Users, Printer, Loader2, FileSpreadsheet } from 'lucide-react'
import { inductMemberAction, batchInductMembersAction } from '@/actions/induction'
import { toast } from 'sonner'

interface InductionClientProps {
  organisationId: string
  initialMembers: any[]
}

export default function InductionClient({ initialMembers }: InductionClientProps) {
  const [inductions, setInductions] = useState<any[]>(initialMembers)
  const [activeTab, setActiveTab] = useState<'desk' | 'qr' | 'batch'>('desk')
  const [loading, setLoading] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('1st Year')
  const [hostel, setHostel] = useState('')
  const [inductedBy, setInductedBy] = useState('')

  const [lastPass, setLastPass] = useState<any | null>(null)

  // Batch State
  const [batchData, setBatchData] = useState('')

  const handleInduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return
    setLoading(true)

    try {
      const res = await inductMemberAction({
        fullName: name,
        phone,
        course,
        year,
        hostel,
        inductedBy
      })

      if (res.success && res.member) {
        toast.success('Member inducted and saved to Supabase!')
        setInductions([res.member, ...inductions])
        setLastPass({
          id: res.member.id,
          name: res.member.full_name,
          phone: res.member.phone,
          course: res.member.area || course || 'General Student',
          hostel,
          inductedBy: inductedBy || 'Campus Drive Volunteer'
        })
        setName('')
        setPhone('')
        setCourse('')
        setHostel('')
      } else {
        toast.error(res.error || 'Failed to induct member')
      }
    } catch {
      toast.error('An error occurred during member induction')
    } finally {
      setLoading(false)
    }
  }

  const handleBatchImport = async () => {
    if (!batchData.trim()) return
    setLoading(true)

    try {
      const lines = batchData.split('\n').filter(l => l.trim())
      const list = lines.map(line => {
        const parts = line.split(',')
        return {
          fullName: parts[0]?.trim() || 'New Student',
          phone: parts[1]?.trim() || '+91 90000 00000',
          course: parts[2]?.trim() || 'General'
        }
      })

      const res = await batchInductMembersAction(list)
      if (res.success) {
        toast.success(`Successfully batch imported ${res.count} members into Supabase!`)
        setBatchData('')
        window.location.reload()
      } else {
        toast.error(res.error || 'Batch import failed')
      }
    } catch {
      toast.error('An error occurred during batch import')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Navigation Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-xl">
        <div className="flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="text-xl font-bold">On-Ground Membership Induction Drive</h2>
            <p className="text-slate-300 text-sm mt-1">
              Rapid membership desk registration for canteen/gate booths, scannable QR posters, and batch slip entry connected to Supabase.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/10 p-1 rounded-xl border border-white/20">
          <button
            onClick={() => setActiveTab('desk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'desk' ? 'bg-emerald-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            Kiosk Entry
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'qr' ? 'bg-emerald-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            Booth QR Poster
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'batch' ? 'bg-emerald-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            Batch Slip Intake
          </button>
        </div>
      </div>

      {/* Tab 1: Kiosk / Desk Entry Mode */}
      {activeTab === 'desk' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-2 border-emerald-100 shadow-md bg-white">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-slate-900 flex items-center gap-2 text-lg">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                Quick Member Induction Form (सदस्यता फॉर्म)
              </CardTitle>
              <CardDescription>
                Optimized for fast mobile entry at registration desks & campus booths.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleInduct}>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Priyanshu Tyagi"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Course & Department</label>
                    <input
                      type="text"
                      value={course}
                      onChange={e => setCourse(e.target.value)}
                      placeholder="e.g. B.Tech CS / BA History"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Year of Study</label>
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                    >
                      <option value="1st Year">1st Year (Fresher)</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year / PG">4th Year / PG</option>
                      <option value="Research Scholar">Research Scholar (PhD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Hostel / Campus Residence</label>
                    <input
                      type="text"
                      value={hostel}
                      onChange={e => setHostel(e.target.value)}
                      placeholder="e.g. Shastri Hostel / Day Scholar"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Referred / Inducted By Cadre</label>
                    <input
                      type="text"
                      value={inductedBy}
                      onChange={e => setInductedBy(e.target.value)}
                      placeholder="e.g. Rahul Sharma (Secretary)"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50 flex justify-end gap-3 py-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm & Save Member to DB
                </button>
              </CardFooter>
            </form>
          </Card>

          {/* Instant Digital Pass Preview */}
          <div>
            {lastPass ? (
              <Card className="border-2 border-emerald-400 bg-gradient-to-b from-emerald-900 to-slate-900 text-white shadow-xl">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest w-max mb-2">
                    OFFICIAL MEMBER PASS
                  </div>
                  <CardTitle className="text-xl text-white font-black">{lastPass.name}</CardTitle>
                  <CardDescription className="text-emerald-300 text-xs font-semibold">{lastPass.course}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center py-4">
                  <div className="p-3 bg-white rounded-xl w-32 h-32 mx-auto flex items-center justify-center border-2 border-emerald-200">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 border-t border-white/10 pt-3">
                    <p>Phone: <strong className="text-white">{lastPass.phone}</strong></p>
                    <p>Hostel: <strong className="text-white">{lastPass.hostel || 'Day Scholar'}</strong></p>
                    <p>Inducted By: <strong className="text-emerald-300">{lastPass.inductedBy}</strong></p>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 p-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs py-2 rounded-lg transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Pass Receipt
                  </button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="border-dashed border-2 p-8 text-center bg-slate-50/50 text-slate-400 flex flex-col items-center justify-center min-h-[340px]">
                <QrCode className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">No Member Pass Generated Yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">Fill the desk induction form to save a real member & generate a QR pass.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Scannable Poster View */}
      {activeTab === 'qr' && (
        <Card className="border-2 shadow-lg bg-gradient-to-b from-slate-900 to-indigo-950 text-white text-center p-8 max-w-xl mx-auto">
          <CardHeader>
            <div className="mx-auto bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              CAMPUS MEMBERSHIP BOOTH POSTER
            </div>
            <CardTitle className="text-3xl font-extrabold text-white">Join the Student Union</CardTitle>
            <CardDescription className="text-slate-300 text-sm mt-1">
              Scan below to register as an active member in 30 seconds!
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 space-y-4">
            <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center border-4 border-amber-400 shadow-2xl">
              <QrCode className="w-40 h-40 text-slate-900" />
            </div>
            <p className="text-xs text-slate-400 font-mono">https://sangathan.org/join/student-union</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-3">
            <button 
              onClick={() => window.print()} 
              className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 hover:bg-amber-300 font-extrabold text-xs px-4 py-2.5 rounded-xl transition"
            >
              <Printer className="w-4 h-4" />
              Print Booth Poster
            </button>
          </CardFooter>
        </Card>
      )}

      {/* Tab 3: Batch Slip Intake */}
      {activeTab === 'batch' && (
        <Card className="border shadow-md bg-white">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Batch Paper Slip Intake (रैली पर्ची प्रविष्टि)
            </CardTitle>
            <CardDescription>
              Paste line-by-line student entries collected physically on paper slips during campaign rallies (Format: Name, Phone, Course).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <textarea
              rows={8}
              value={batchData}
              onChange={e => setBatchData(e.target.value)}
              placeholder={`Example:\nPriyanshu Kumar, 9876543210, B.Tech CS\nAman Verma, 9812345678, BA History\nSunita Devi, 9898989898, MSc Chemistry`}
              className="w-full rounded-xl border border-slate-300 p-4 font-mono text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </CardContent>
          <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
            <button
              onClick={handleBatchImport}
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Import Batch Student Records into DB
            </button>
          </CardFooter>
        </Card>
      )}

      {/* Database Inducted Members Log */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Database Inducted Members Log ({inductions.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {inductions.map(item => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50">
              <div>
                <span className="font-extrabold text-slate-900 text-base">{item.full_name || item.name}</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.area || 'General Student'} • Phone: <strong className="text-slate-800">{item.phone}</strong>
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  Status: {item.status || 'Active'} • {new Date(item.created_at || item.registeredAt).toLocaleDateString()}
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                Supabase Inductee
              </span>
            </div>
          ))}

          {inductions.length === 0 && (
            <p className="text-xs text-slate-500 p-6 text-center">No inducted members in database yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
