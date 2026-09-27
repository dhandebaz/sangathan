import { notFound } from 'next/navigation'
import { getOrgPetitions } from '@/actions/petitions'
import Link from 'next/link'
import { FileText, ArrowRight, Target, Users, Sparkles, Megaphone } from 'lucide-react'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    lang: string
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params
  const data = await getOrgPetitions(slug)
  if (!data) return { title: 'Campaigns Not Found | Sangathan' }

  return {
    title: `Active Petitions & Campaigns | ${data.org.name} | Sangathan`,
    description: `Browse and sign official public petitions launched by ${data.org.name}.`,
    alternates: {
      canonical: `https://sangathan.space/${lang}/org/${slug}/petitions`,
      languages: {
        en: `https://sangathan.space/en/org/${slug}/petitions`,
        hi: `https://sangathan.space/hi/org/${slug}/petitions`,
      },
    },
  }
}

export default async function OrgPetitionsListingPage({ params }: PageProps) {
  const { lang, slug } = await params
  const data = await getOrgPetitions(slug)

  if (!data) {
    notFound()
  }

  const { org, petitions } = data

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Breadcrumb & Profile */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {org.logo_url ? (
              <img src={org.logo_url} alt={org.name} className="w-12 h-12 rounded-sm object-cover border border-slate-200" />
            ) : (
              <div className="w-12 h-12 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                {org.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/${lang}/org/${org.slug}`} className="text-xs text-slate-500 hover:text-indigo-600 font-medium">
                  ← Back to {org.name}
                </Link>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-0.5">Petitions &amp; Public Campaigns</h1>
              <p className="text-xs text-slate-500">Official democratic drives &amp; open letters from {org.name}</p>
            </div>
          </div>

          <Link
            href={`/${lang}/org/${org.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-sm transition self-start sm:self-center"
          >
            <Users className="w-3.5 h-3.5" />
            View Org Profile
          </Link>
        </div>

        {/* Petitions Grid */}
        {petitions.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 p-12 text-center rounded-sm">
            <Megaphone className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No active public campaigns right now</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {org.name} has not published any public petitions yet. Check back soon or visit their main profile.
            </p>
            <Link
              href={`/${lang}/org/${org.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-sm hover:bg-indigo-700 transition"
            >
              Go to Organisation Profile
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {petitions.map((petition) => {
              const current = petition.current_signatures || 0
              const goal = petition.signature_goal
              const progressPct = goal ? Math.min(100, Math.round((current / goal) * 100)) : 0

              return (
                <div
                  key={petition.id}
                  className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xs">
                        Active Campaign
                      </span>
                      {petition.target_decision_maker && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <Target className="w-3 h-3 text-slate-400" />
                          Target: {petition.target_decision_maker}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      <Link href={`/${lang}/org/${org.slug}/petitions/${petition.slug || petition.id}`} className="hover:text-indigo-600">
                        {petition.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {petition.description}
                    </p>

                    {/* Signature Progress Bar */}
                    <div className="pt-2 max-w-md">
                      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                        <span className="font-bold text-slate-900">{current.toLocaleString()} signed</span>
                        {goal && <span>Goal: {goal.toLocaleString()}</span>}
                      </div>
                      {goal && (
                        <div className="w-full bg-slate-100 rounded-xs h-2 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-xs transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Link
                      href={`/${lang}/org/${org.slug}/petitions/${petition.slug || petition.id}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-sm shadow-xs transition"
                    >
                      Sign Petition <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
