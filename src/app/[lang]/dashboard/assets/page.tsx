import { Metadata } from 'next'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { getSocietyAssets } from '@/actions/society-assets'
import { Wrench, ShieldCheck, AlertTriangle, Clock, Plus } from 'lucide-react'
import { SocietyAssetsManager } from '@/components/rwa/society-assets-manager'

export const metadata: Metadata = {
  title: 'Society Assets, AMC & Statutory NOCs | Sangathan',
  description: 'Manage passenger lifts, DG sets, fire safety NOCs, water tank cleaning and AMC countdowns for RWAs.',
}

export default async function SocietyAssetsPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const isHindi = lang === 'hi'
  const orgId = await getSelectedOrganisationId()

  let assets: any[] = []
  if (orgId) {
    const res = await getSocietyAssets(orgId)
    if (res.success) assets = res.assets
  }

  const operationalCount = assets.filter(a => a.status === 'operational').length
  const serviceDueCount = assets.filter(a => a.status === 'service_due' || a.status === 'noc_pending').length
  const totalCost = assets.reduce((sum, a) => sum + Number(a.annual_amc_cost || 0), 0)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs">
                <Wrench className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {isHindi ? 'सोसायटी संपत्ति, AMC व सांविधिक NOC (Asset AMC)' : 'Society Assets, AMC & NOC Tracker'}
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              {isHindi
                ? 'लिफ्ट लाइसेंस, फायर सेफ्टी NOC, डीजी जनरेटर व वाटर पंप्स के वार्षिक रखरखाव अनुबंध (AMC) और सर्विस काउंटडाउन को ट्रैक करें।'
                : 'Track passenger lifts, DG generators, fire safety NOCs, water pumps, preventive servicing schedules, and AMC renewal alerts.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'सक्रिय उपकरण (Operational)' : 'Operational Assets'}
            </span>
            <ShieldCheck className="w-4 h-4 text-teal-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{operationalCount}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'पूर्णतः कार्यरत स्थिति' : 'In good operational standing'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'सर्विस / NOC देय (Due)' : 'Service / NOC Due'}
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{serviceDueCount}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'तत्काल ध्यान अपेक्षित' : 'Action or renewal required'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'वार्षिक AMC बजट' : 'Annual AMC Budget'}
            </span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">₹{totalCost.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'कुल अनुबंधित लागत' : 'Total annual contract commitments'}</p>
        </div>
      </div>

      {/* Main Interactive Manager */}
      <SocietyAssetsManager initialAssets={assets} isHindi={isHindi} orgId={orgId || ''} />
    </div>
  )
}
