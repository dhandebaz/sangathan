'use client'

import { useState } from 'react'
import { SocietyAsset } from '@/types/dashboard'
import { registerSocietyAsset, logAssetServiceRecord } from '@/actions/society-assets'
import { Wrench, ShieldCheck, AlertTriangle, Plus, Phone, Calendar, Building, CheckCircle2, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface SocietyAssetsManagerProps {
  initialAssets: SocietyAsset[]
  isHindi: boolean
  orgId: string
}

const CATEGORY_LABELS: Record<string, { en: string; hi: string }> = {
  lift_elevator: { en: 'Passenger & Service Lift', hi: 'लिफ्ट (Passenger Lift)' },
  dg_generator: { en: 'Diesel Generator (DG Set)', hi: 'डीजी सेट (Generator)' },
  fire_fighting: { en: 'Fire Hydrant & Alarms', hi: 'अग्निशमन प्रणाली (Fire Safety)' },
  water_pumps: { en: 'Water Supply & STP Pumps', hi: 'वाटर पम्प्स व STP' },
  cctv_security: { en: 'CCTV & Perimeter Security', hi: 'सीसीटीवी नेटवर्क (CCTV)' },
  swimming_pool: { en: 'Swimming Pool Filtration', hi: 'स्विमिंग पूल फिल्टरेशन' },
  gym_equipment: { en: 'Clubhouse Gym Equipment', hi: 'जिम उपकरण' },
  transformer: { en: 'Substation Transformer', hi: 'विद्युत सबस्टेशन' },
}

export function SocietyAssetsManager({ initialAssets, isHindi }: SocietyAssetsManagerProps) {
  const [assets, setAssets] = useState<SocietyAsset[]>(initialAssets)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Register Form State
  const [assetName, setAssetName] = useState('')
  const [category, setCategory] = useState<SocietyAsset['category']>('lift_elevator')
  const [locationBlock, setLocationBlock] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [vendorPhone, setVendorPhone] = useState('')
  const [amcExpiryDate, setAmcExpiryDate] = useState('')
  const [statutoryNocExpiry, setStatutoryNocExpiry] = useState('')
  const [nextServiceDue, setNextServiceDue] = useState('')
  const [annualCost, setAnnualCost] = useState('')

  // Service Log Form State
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0])
  const [newNextServiceDue, setNewNextServiceDue] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await registerSocietyAsset({
        asset_name: assetName,
        category,
        location_block: locationBlock || undefined,
        vendor_name: vendorName,
        vendor_phone: vendorPhone || undefined,
        amc_expiry_date: amcExpiryDate,
        statutory_noc_expiry: statutoryNocExpiry || undefined,
        next_service_due: nextServiceDue,
        annual_amc_cost: annualCost ? Number(annualCost) : undefined,
      })

      if (!res.error && res.data?.asset) {
        setAssets([...assets, res.data.asset])
        setIsModalOpen(false)
        setAssetName('')
        setVendorName('')
        setVendorPhone('')
        setAmcExpiryDate('')
        setNextServiceDue('')
        setAnnualCost('')
        toast.success(isHindi ? 'उपकरण एवं AMC विवरण सफलतापूर्वक पंजीकृत हुआ।' : 'Society asset and AMC registered successfully.')
      } else {
        toast.error(res.error || 'Failed to register asset')
      }
    } catch {
      toast.error('An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogService = async (assetId: string) => {
    setLoading(true)
    try {
      const res = await logAssetServiceRecord({
        asset_id: assetId,
        last_service_date: serviceDate,
        next_service_due: newNextServiceDue || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        status: 'operational',
      })

      if (!res.error && res.data?.success) {
        setAssets(
          assets.map((a) =>
            a.id === assetId
              ? {
                  ...a,
                  last_service_date: serviceDate,
                  next_service_due: newNextServiceDue || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
                  status: 'operational',
                }
              : a
          )
        )
        setIsServiceModalOpen(null)
        toast.success(isHindi ? 'सर्विस रिकॉर्ड अपडेट किया गया।' : 'Service record logged successfully.')
      } else {
        toast.error(res.error || 'Failed to log service')
      }
    } catch {
      toast.error('Failed to update service record.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          {isHindi ? 'सोसायटी उपकरण व AMC अनुबंध सूची' : 'Asset Inventory & AMC Schedule'}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition shadow-2xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {isHindi ? 'नया उपकरण / AMC जोड़ें' : 'Add New Asset'}
        </button>
      </div>

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-slate-200/80 p-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isHindi ? 'कोई उपकरण पंजीकृत नहीं है' : 'No Assets Registered'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            {isHindi
              ? 'सोसायटी की लिफ्ट्स, डीजी सेट और फायर सेफ्टी उपकरणों का AMC विवरण दर्ज करें।'
              : 'Add lifts, generator sets, fire fighting equipment, and vendor contracts here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const catConfig = CATEGORY_LABELS[asset.category] || { en: asset.category, hi: asset.category }
            const isDue = new Date(asset.next_service_due) <= new Date(Date.now() + 7 * 86400000)

            return (
              <div
                key={asset.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{asset.asset_name}</h3>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-slate-500">
                        {isHindi ? catConfig.hi : catConfig.en}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                        isDue
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isDue ? (isHindi ? 'सर्विस देय' : 'Service Due') : (isHindi ? 'सक्रिय' : 'Operational')}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isHindi ? 'वेंडर: ' : 'Vendor: '}</span>
                      <span className="font-semibold text-slate-800">{asset.vendor_name}</span>
                      {asset.vendor_phone && <span className="text-slate-400">({asset.vendor_phone})</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isHindi ? 'AMC समाप्ति: ' : 'AMC Expiry: '}</span>
                      <span className="font-mono font-medium">{asset.amc_expiry_date}</span>
                    </div>

                    {asset.statutory_noc_expiry && (
                      <div className="flex items-center gap-2 text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'सांविधिक NOC वैधता: ' : 'NOC Expiry: '}</span>
                        <span className="font-mono font-bold">{asset.statutory_noc_expiry}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isHindi ? 'अगली सर्विस तारीख: ' : 'Next Service: '}</span>
                      <span className={`font-mono font-bold ${isDue ? 'text-amber-700' : 'text-slate-900'}`}>
                        {asset.next_service_due}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-500 font-medium">
                    {asset.annual_amc_cost ? `₹${Number(asset.annual_amc_cost).toLocaleString('en-IN')}/yr` : ''}
                  </div>

                  <button
                    onClick={() => setIsServiceModalOpen(asset.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-50 transition"
                  >
                    {isHindi ? 'सर्विस दर्ज करें' : 'Log Servicing'}
                  </button>
                </div>

                {/* Inline Service Modal */}
                {isServiceModalOpen === asset.id && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">
                      {isHindi ? 'रखरखाव सर्विस पूर्णता दर्ज करें' : 'Log Completed Servicing'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {isHindi ? 'सर्विस की तारीख' : 'Service Date'}
                        </label>
                        <input
                          type="date"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {isHindi ? 'अगली सर्विस देय' : 'Next Due Date'}
                        </label>
                        <input
                          type="date"
                          value={newNextServiceDue}
                          onChange={(e) => setNewNextServiceDue(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsServiceModalOpen(null)}
                        className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition"
                      >
                        {isHindi ? 'रद्द करें' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleLogService(asset.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition"
                      >
                        {isHindi ? 'सहेजें' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'नया उपकरण / AMC अनुबंध जोड़ें' : 'Add Society Asset & AMC'}
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
                  {isHindi ? 'उपकरण का नाम' : 'Asset Name'}
                </label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. Tower-A Passenger Lift #1"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'उपकरण श्रेणी' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="lift_elevator">{isHindi ? 'लिफ्ट (Elevator)' : 'Passenger Lift'}</option>
                    <option value="dg_generator">{isHindi ? 'डीजी सेट (DG Generator)' : 'DG Generator'}</option>
                    <option value="fire_fighting">{isHindi ? 'फायर सेफ्टी (Fire System)' : 'Fire Safety System'}</option>
                    <option value="water_pumps">{isHindi ? 'वाटर पंप्स (Water Pumps)' : 'Water Pumps'}</option>
                    <option value="cctv_security">{isHindi ? 'सीसीटीवी (CCTV Network)' : 'CCTV System'}</option>
                    <option value="swimming_pool">{isHindi ? 'स्विमिंग पूल' : 'Swimming Pool'}</option>
                    <option value="gym_equipment">{isHindi ? 'जिम उपकरण' : 'Gym Equipment'}</option>
                    <option value="transformer">{isHindi ? 'विद्युत सबस्टेशन' : 'Substation'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'ब्लॉक / स्थान' : 'Location / Block'}
                  </label>
                  <input
                    type="text"
                    value={locationBlock}
                    onChange={(e) => setLocationBlock(e.target.value)}
                    placeholder="e.g. Tower A, Basement 1"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'वेंडर / कांट्रेक्टर नाम' : 'Vendor / Contractor Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="e.g. Otis Elevators India"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'वेंडर संपर्क नंबर' : 'Vendor Phone'}
                  </label>
                  <input
                    type="tel"
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'AMC समाप्ति तारीख' : 'AMC Expiry Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={amcExpiryDate}
                    onChange={(e) => setAmcExpiryDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'अगली सर्विस देय तारीख' : 'Next Service Due Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={nextServiceDue}
                    onChange={(e) => setNextServiceDue(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'सांविधिक NOC वैधता (वैकल्पिक)' : 'Statutory NOC Expiry (Optional)'}
                  </label>
                  <input
                    type="date"
                    value={statutoryNocExpiry}
                    onChange={(e) => setStatutoryNocExpiry(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'वार्षिक AMC लागत (₹)' : 'Annual AMC Cost (₹)'}
                  </label>
                  <input
                    type="number"
                    value={annualCost}
                    onChange={(e) => setAnnualCost(e.target.value)}
                    placeholder="75000"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition shadow-2xs"
                >
                  {loading ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...') : (isHindi ? 'उपकरण जोड़ें' : 'Save Asset')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
