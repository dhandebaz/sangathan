'use client'

import { useState } from 'react'
import { DomesticStaff } from '@/types/dashboard'
import { registerDomesticStaff, updateDomesticStaffStatus } from '@/actions/domestic-staff'
import { UserCheck, ShieldCheck, Plus, QrCode, Phone, Home, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface DomesticStaffManagerProps {
  initialStaff: DomesticStaff[]
  isHindi: boolean
  orgId: string
}

const ROLE_LABELS: Record<string, { en: string; hi: string; color: string }> = {
  maid: { en: 'House Maid / Help', hi: 'घरेलू सहायिका (Maid)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cook: { en: 'Cook / Chef', hi: 'रसोइया (Cook)', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  driver: { en: 'Personal Driver', hi: 'ड्राइवर (Driver)', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  gardener: { en: 'Gardener (Mali)', hi: 'माली (Gardener)', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  car_cleaner: { en: 'Car Cleaner', hi: 'कार क्लीनर', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  electrician: { en: 'Society Electrician', hi: 'इलेक्ट्रीशियन', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  plumber: { en: 'Society Plumber', hi: 'प्लंबर', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  security_guard: { en: 'Security Guard', hi: 'सुरक्षा गार्ड', color: 'bg-slate-100 text-slate-700 border-slate-300' },
}

export function DomesticStaffManager({ initialStaff, isHindi }: DomesticStaffManagerProps) {
  const [staffList, setStaffList] = useState<DomesticStaff[]>(initialStaff)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form State
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<DomesticStaff['role']>('maid')
  const [flatUnits, setFlatUnits] = useState('')
  const [aadharLast4, setAadharLast4] = useState('')
  const [policeVerified, setPoliceVerified] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await registerDomesticStaff({
        full_name: fullName,
        phone,
        role,
        flat_units: flatUnits,
        aadhar_last4: aadharLast4 || undefined,
        police_verified: policeVerified,
      })

      if (!res.error && res.data?.staff) {
        setStaffList([res.data.staff, ...staffList])
        setIsModalOpen(false)
        setFullName('')
        setPhone('')
        setFlatUnits('')
        setAadharLast4('')
        setPoliceVerified(false)
        toast.success(isHindi ? 'सहायक सफलतापूर्वक पंजीकृत हुआ एवं पास कोड जारी किया गया।' : 'Staff registered and gate pass code issued successfully.')
      } else {
        toast.error(res.error || 'Failed to register staff')
      }
    } catch {
      toast.error('An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (staffId: string, currentStatus: DomesticStaff['status']) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      const res = await updateDomesticStaffStatus({
        staff_id: staffId,
        status: nextStatus,
      })

      if (!res.error && res.data?.success) {
        setStaffList(
          staffList.map((s) => (s.id === staffId ? { ...s, status: nextStatus } : s))
        )
        toast.success(isHindi ? `स्थिति बदलकर ${nextStatus} कर दी गई।` : `Status updated to ${nextStatus}.`)
      }
    } catch {
      toast.error('Failed to update status.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          {isHindi ? 'सोसायटी कर्मचारी एवं गेट पास डायरेक्टरी' : 'Staff Directory & Pass Codes'}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition shadow-2xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {isHindi ? 'नया सहायक पंजीकृत करें' : 'Register New Staff'}
        </button>
      </div>

      {/* Staff Grid */}
      {staffList.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-slate-200/80 p-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isHindi ? 'कोई सहायक पंजीकृत नहीं है' : 'No Domestic Staff Registered'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            {isHindi
              ? 'सोसायटी के सभी घरेलू सहायकों, ड्राइवरों और सुरक्षा गार्ड्स को पंजीकृत कर डिजिटल गेट पास जारी करें।'
              : 'Add domestic help, drivers, and maintenance personnel to generate digital gate passcodes.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map((staff) => {
            const roleConfig = ROLE_LABELS[staff.role] || { en: staff.role, hi: staff.role, color: 'bg-slate-100 text-slate-700 border-slate-200' }

            return (
              <div
                key={staff.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{staff.full_name}</h3>
                      <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${roleConfig.color}`}>
                        {isHindi ? roleConfig.hi : roleConfig.en}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                        staff.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : staff.status === 'barred'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isHindi ? 'संबद्ध फ्लैट: ' : 'Flats: '}</span>
                      <span className="font-semibold text-slate-800">
                        {staff.flat_units && staff.flat_units.length > 0 ? staff.flat_units.join(', ') : 'None'}
                      </span>
                    </div>
                    {staff.aadhar_last4 && (
                      <div className="text-[11px] text-slate-400">
                        Aadhaar: ****-****-{staff.aadhar_last4}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {staff.police_verified ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {isHindi ? 'सत्यापित' : 'Verified'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        {isHindi ? 'सत्यापन लंबित' : 'Unverified'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-1 rounded-md">
                      {staff.pass_code}
                    </span>
                    <button
                      onClick={() => handleStatusToggle(staff.id, staff.status)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        staff.status === 'active'
                          ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {staff.status === 'active' ? (isHindi ? 'रोकें' : 'Suspend') : (isHindi ? 'सक्रिय करें' : 'Activate')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Register Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'नया घरेलू सहायक पंजीकृत करें' : 'Register Domestic Staff'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'पूरा नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'मोबाइल नंबर' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'पद / भूमिका' : 'Role / Designation'}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="maid">{isHindi ? 'घरेलू सहायिका (Maid)' : 'House Maid'}</option>
                    <option value="cook">{isHindi ? 'रसोइया (Cook)' : 'Cook / Chef'}</option>
                    <option value="driver">{isHindi ? 'ड्राइवर (Driver)' : 'Personal Driver'}</option>
                    <option value="gardener">{isHindi ? 'माली (Gardener)' : 'Gardener'}</option>
                    <option value="car_cleaner">{isHindi ? 'कार क्लीनर' : 'Car Cleaner'}</option>
                    <option value="electrician">{isHindi ? 'इलेक्ट्रीशियन' : 'Electrician'}</option>
                    <option value="plumber">{isHindi ? 'प्लंबर' : 'Plumber'}</option>
                    <option value="security_guard">{isHindi ? 'सुरक्षा गार्ड' : 'Security Guard'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'संबद्ध फ्लैट नंबर (अल्पविराम से अलग करें)' : 'Associated Flat Units (comma-separated)'}
                </label>
                <input
                  type="text"
                  required
                  value={flatUnits}
                  onChange={(e) => setFlatUnits(e.target.value)}
                  placeholder="e.g. A-102, B-404, C-201"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'आधार के अंतिम 4 अंक' : 'Aadhaar Last 4 Digits'}
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={aadharLast4}
                    onChange={(e) => setAadharLast4(e.target.value)}
                    placeholder="1234"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policeVerified}
                      onChange={(e) => setPoliceVerified(e.target.checked)}
                      className="rounded-sm border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {isHindi ? 'पुलिस सत्यापन पूर्ण है' : 'Police Verified'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition shadow-2xs"
                >
                  {loading ? (isHindi ? 'पंजीकृत कर रहे हैं...' : 'Registering...') : (isHindi ? 'पास कोड जारी करें' : 'Issue Pass Code')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
