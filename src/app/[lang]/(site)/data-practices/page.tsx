import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'डेटा प्रथाएं और सुरक्षा वास्तुकला' : 'Data Practices & Security Architecture',
    description: isHindi ? 'एन्क्रिप्शन, शून्य-ज्ञान सिद्धांतों और संप्रभु डेटा प्रबंधन का अवलोकन।' : 'Overview of encryption, zero-knowledge principles, and sovereign data handling.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/data-practices`,
      languages: {
        en: 'https://sangathan.space/en/data-practices',
        hi: 'https://sangathan.space/hi/data-practices',
      },
    },
    openGraph: {
      title: isHindi ? 'डेटा प्रथाएं और सुरक्षा वास्तुकला | संगठन' : 'Data Practices & Security Architecture | Sangathan',
      description: isHindi ? 'एन्क्रिप्शन, शून्य-ज्ञान सिद्धांतों और संप्रभु डेटा प्रबंधन का अवलोकन।' : 'Overview of encryption, zero-knowledge principles, and sovereign data handling.',
      url: `https://sangathan.space/${lang}/data-practices`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'डेटा प्रथाएं व सुरक्षा वास्तुकला' : 'Data Practices & Security Architecture')}&desc=${encodeURIComponent(isHindi ? 'एन्क्रिप्शन, RLS संप्रभुता, और Google Workspace एकीकरण सुरक्षा।' : 'Multi-tenant PostgreSQL RLS isolation, zero-profiling guarantees, and Google Workspace security.')}&type=policy&tag=Data+Sovereignty&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: isHindi ? 'संगठन डेटा प्रथाएं' : 'Sangathan Data Practices',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'डेटा प्रथाएं और सुरक्षा वास्तुकला | संगठन' : 'Data Practices & Security Architecture | Sangathan',
      description: isHindi ? 'एन्क्रिप्शन, शून्य-ज्ञान सिद्धांतों और संप्रभु डेटा प्रबंधन का अवलोकन।' : 'Overview of encryption, zero-knowledge principles, and sovereign data handling.',
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'डेटा प्रथाएं व सुरक्षा वास्तुकला' : 'Data Practices & Security Architecture')}&desc=${encodeURIComponent(isHindi ? 'एन्क्रिप्शन, RLS संप्रभुता, और Google Workspace एकीकरण सुरक्षा।' : 'Multi-tenant PostgreSQL RLS isolation, zero-profiling guarantees, and Google Workspace security.')}&type=policy&tag=Data+Sovereignty&lang=${lang}`],
    },
  }
}

import { Database, HardDrive, RefreshCw, Download, ShieldCheck, Link2 } from 'lucide-react'

export default function DataPracticesPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Data Practices</h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        A transparent guide to how your data and external integrations are handled on Sangathan.
      </p>

      <div className="grid gap-8">
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                 <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Storage & Isolation</h2>
           </div>
           <p className="text-gray-600 leading-relaxed">
              Your data is stored in encrypted PostgreSQL database clusters. Every row of data created is tagged with your Organisation ID. Our database engine enforces strict Row-Level Security (RLS), meaning it is technically impossible for a query from Organisation A to return data from Organisation B.
           </p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                 <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Google API Integrations & Limited Use</h2>
           </div>
           <p className="text-gray-600 leading-relaxed mb-3">
              Sangathan offers optional integrations with Google Contacts, Sheets, Forms, and Calendar solely to streamline member invitations, survey migration, and meeting coordination.
           </p>
           <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li><strong>Explicit Consent &amp; On-Demand:</strong> We only access Google data when you explicitly trigger an import or calendar sync action.</li>
              <li><strong>Strict Limited Use:</strong> Our use of Google user data adheres strictly to the Google API Services User Data Policy.</li>
              <li><strong>Zero Advertising &amp; No Data Sales:</strong> Google user data is never sold, shared with data brokers, or used for advertising/profiling.</li>
              <li><strong>1-Click Revocation:</strong> You can disconnect your Google account anytime via Google Account Permissions or Sangathan settings.</li>
           </ul>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                 <HardDrive className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Retention & Deletion</h2>
           </div>
           <p className="text-gray-600 leading-relaxed mb-4">
              We keep your data only as long as your account and collective workspace remain active.
           </p>
           <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li><strong>Active Workspaces:</strong> Data is retained for ongoing operations.</li>
              <li><strong>Deleted Workspaces:</strong> Data enters a &quot;Soft Delete&quot; recovery state for 14 days, allowing accidental deletions to be restored.</li>
              <li><strong>Permanent Erase:</strong> After 14 days, data is permanently wiped from active database storage.</li>
           </ul>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                 <Download className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Export Rights & Data Portability</h2>
           </div>
           <p className="text-gray-600 leading-relaxed">
              You are never locked in. Admins can export their entire Member Registry, Donation Logs, and Meeting Minutes as CSV or JSON files at any time from the dashboard settings.
           </p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                 <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Legal Compliance</h2>
           </div>
           <p className="text-gray-600 leading-relaxed">
              We comply with the Information Technology Act, 2000. In strict accordance with the law, we may be required to preserve specific records (Legal Hold) if served with a valid court order or investigation notice by Indian authorities.
           </p>
        </div>
      </div>
    </div>
  )
}
