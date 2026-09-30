import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy',
    description: isHindi ? 'संगठन नागरिक बुनियादी ढांचे के लिए गोपनीयता नीति और डेटा सुरक्षा प्रतिबद्धताएं।' : 'Privacy policy and data protection commitments for Sangathan civic infrastructure.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/privacy`,
      languages: {
        en: 'https://sangathan.space/en/privacy',
        hi: 'https://sangathan.space/hi/privacy',
      },
    },
    openGraph: {
      title: isHindi ? 'गोपनीयता नीति | संगठन' : 'Privacy Policy | Sangathan',
      description: isHindi ? 'संगठन नागरिक बुनियादी ढांचे के लिए गोपनीयता नीति और डेटा सुरक्षा प्रतिबद्धताएं।' : 'Privacy policy and data protection commitments for Sangathan civic infrastructure.',
      url: `https://sangathan.space/${lang}/privacy`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'गोपनीयता नीति एवं डेटा सुरक्षा' : 'Privacy Policy & Sovereign Data Protection')}&desc=${encodeURIComponent(isHindi ? 'नागरिक संप्रभुता, RLS अलगाव, और Google API Limited Use अनुपालन।' : 'Civil society sovereignty, PostgreSQL Row-Level Security, and Google API Limited Use compliance.')}&type=policy&tag=Privacy+Standard&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: isHindi ? 'संगठन गोपनीयता नीति' : 'Sangathan Privacy Policy',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'गोपनीयता नीति | संगठन' : 'Privacy Policy | Sangathan',
      description: isHindi ? 'संगठन नागरिक बुनियादी ढांचे के लिए गोपनीयता नीति और डेटा सुरक्षा प्रतिबद्धताएं।' : 'Privacy policy and data protection commitments for Sangathan civic infrastructure.',
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'गोपनीयता नीति एवं डेटा सुरक्षा' : 'Privacy Policy & Sovereign Data Protection')}&desc=${encodeURIComponent(isHindi ? 'नागरिक संप्रभुता, RLS अलगाव, और Google API Limited Use अनुपालन।' : 'Civil society sovereignty, PostgreSQL Row-Level Security, and Google API Limited Use compliance.')}&type=policy&tag=Privacy+Standard&lang=${lang}`],
    },
  }
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
        <p className="text-sm text-gray-500">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
          <p>
            Sangathan (&quot;Platform,&quot; &quot;We,&quot; &quot;Us&quot;) is a governance infrastructure provider for collectives, NGOs, and community organisations. We respect your privacy and are committed to protecting the personal data you entrust to our infrastructure. This Privacy Policy explains how we collect, use, store, and share your information in compliance with the Information Technology Act, 2000, and other applicable laws in India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Scope & Role</h2>
          <p>
            <strong>Our Role:</strong> Sangathan acts primarily as a <strong>Data Processor</strong> (Infrastructure Provider). The Organisation (your NGO, trust, society, or collective) acts as the <strong>Data Controller</strong>.
          </p>
          <p>
            <strong>Your Role:</strong> If you are an Organisation Admin, you control the data entered into your workspace. If you are a Member, your data is controlled by the Organisation you belong to.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Information We Collect</h2>
          
          <h3 className="text-lg font-medium text-black mt-4 mb-2">A. Information You Provide</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Information:</strong> Name, Email Address, and Password for all users.</li>
            <li><strong>Phone Verification (Admins):</strong> We collect and verify mobile numbers for Organisation Admins to ensure accountability and prevent platform abuse.</li>
            <li><strong>Organisation Data:</strong> Name, Slug, Description, and structural details of the collective.</li>
            <li><strong>Member Records:</strong> Names, contact details, designations, and status of members added by the Organisation.</li>
            <li><strong>Form Submissions:</strong> Data collected via public or private forms created by an Organisation.</li>
            <li><strong>Donation Logs:</strong> Records of financial contributions (Amount, Donor Name, Date) logged by the Organisation. <em>Note: We do not process the actual funds.</em></li>
          </ul>

          <h3 className="text-lg font-medium text-black mt-4 mb-2">B. Information Automatically Collected</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Audit Logs:</strong> We record critical actions (creation, deletion, updates) performed within the Platform for security and accountability.</li>
            <li><strong>System Logs:</strong> IP addresses, browser type, and timestamps are logged for security monitoring, rate limiting, and abuse prevention.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. How We Use Information</h2>
          <p>We use your information strictly for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, maintain, and improve the Platform&apos;s infrastructure.</li>
            <li>To verify the identity of Organisation Admins.</li>
            <li>To enforce our Terms of Service and prevent abuse (spam, fraud, illegal activities).</li>
            <li>To comply with legal obligations and law enforcement requests under Indian law.</li>
            <li>To communicate with you regarding security updates, technical issues, or policy changes.</li>
          </ul>
          <p className="mt-2">
            <strong>No Political Profiling:</strong> We do not use your data to build political profiles, target advertising, or influence your Organisation&apos;s objectives.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Data Storage & Security</h2>
          <p>
            <strong>Infrastructure:</strong> Your data is hosted on encrypted cloud PostgreSQL database clusters, utilizing industry-standard TLS 1.3 encryption in transit and AES-256 encryption at rest.
          </p>
          <p>
            <strong>Isolation:</strong> We employ strict Row-Level Security (RLS) policies at the database layer to ensure that data belonging to one Organisation is completely isolated from all other workspaces.
          </p>
          <p>
            <strong>Access Controls:</strong> Access to the underlying database is restricted to authorized System Administrators for maintenance, security investigation, or legal compliance purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Google API Services User Data Policy & Limited Use Disclosure</h2>
          <p>
            Sangathan integrates optional Google Workspace tools (such as Google Contacts, Google Sheets, Google Forms, and Google Calendar) to help grassroots organizers and administrators efficiently onboard members, migrate past survey data, and coordinate community assemblies.
          </p>
          
          <h3 className="text-lg font-medium text-black mt-4 mb-2">A. Google Data Accessed & Purpose of Use</h3>
          <p>When you explicitly authorize Sangathan to access your Google account, our application accesses only the specific scopes you have granted for the following explicit functionalities:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>Google Contacts (<code>https://www.googleapis.com/auth/contacts.readonly</code>):</strong> Accessed strictly when an administrator chooses to import contacts to invite members to their collective workspace or populate their member directory. Sangathan reads only the contact names, email addresses, phone numbers, and organization tags selected by the user.
            </li>
            <li>
              <strong>Google Sheets (<code>https://www.googleapis.com/auth/spreadsheets.readonly</code>):</strong> Accessed when an administrator connects a Google Sheet to import existing member spreadsheets or response rows directly into Sangathan with automated column matching and deduplication.
            </li>
            <li>
              <strong>Google Forms (<code>https://www.googleapis.com/auth/forms.body.readonly</code> and <code>https://www.googleapis.com/auth/forms.responses.readonly</code>):</strong> Accessed when an administrator imports a Google Form to migrate the form questions, field types, and historical survey submissions into Sangathan&apos;s Form &amp; Survey Studio.
            </li>
            <li>
              <strong>Google Calendar (<code>https://www.googleapis.com/auth/calendar.events</code> and <code>https://www.googleapis.com/auth/calendar</code>):</strong> Accessed when an organizer opts to synchronize collective meetings, townhalls, or field survey rosters to their personal or organization calendar.
            </li>
          </ul>

          <h3 className="text-lg font-medium text-black mt-4 mb-2">B. Google API Limited Use Compliance</h3>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 my-3">
            <p className="font-semibold text-slate-900 mb-2">Limited Use Declaration:</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Sangathan&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
              <a 
                href="https://developers.google.com/terms/api-services-user-data-policy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 font-semibold underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </div>

          <h3 className="text-lg font-medium text-black mt-4 mb-2">C. Privacy Commitments Regarding Google User Data</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>No Data Selling:</strong> We do not sell, rent, or monetize Google user data to any third party under any circumstances.</li>
            <li><strong>No Advertising or Profiling:</strong> We do not use Google user data for serving advertisements, retargeting, personalized advertising, or building consumer profiles.</li>
            <li><strong>No AI Model Training:</strong> Google user data is not used to train generalized artificial intelligence or machine learning models.</li>
            <li><strong>Strict Human Access Restrictions:</strong> No human at Sangathan is allowed to read your Google user data unless: (1) we have obtained your prior explicit consent for specific troubleshooting; (2) it is necessary for security purposes, such as investigating security abuse or incidents; or (3) as required by law.</li>
          </ul>

          <h3 className="text-lg font-medium text-black mt-4 mb-2">D. User Control & Revocation</h3>
          <p>
            You can revoke Sangathan&apos;s access to your Google account at any time through your Google Security Settings at{' '}
            <a 
              href="https://myaccount.google.com/permissions" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 font-semibold underline"
            >
              https://myaccount.google.com/permissions
            </a>{' '}
            or from your Sangathan Workspace Settings. Once revoked, Sangathan will immediately lose all access to your Google API tokens.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">7. Data Sharing & Third Parties</h2>
          <p>We do not sell your data. We share data only with the following infrastructure sub-processors required to operate the Platform:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Enterprise Database & Authentication Providers:</strong> Managed database hosting, session authentication, and SMS delivery for administrator verification.</li>
            <li><strong>Global Edge Networks:</strong> Encrypted web hosting and edge content delivery networks.</li>
          </ul>
          <p className="mt-2">
            We may disclose data if required by law, such as in response to a court order or valid subpoena from Indian law enforcement agencies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">8. Data Retention & Deletion</h2>
          <p>
            <strong>Retention:</strong> We retain your data only for as long as your account and collective workspace remain active.
          </p>
          <p>
            <strong>Soft Deletion:</strong> When you delete an account or Organisation, data enters a &quot;soft-delete&quot; state for a grace period (e.g., 7-14 days) to allow for recovery from accidental deletion. After this period, data is permanently removed from our active database.
          </p>
          <p>
            <strong>Legal Hold:</strong> We may retain specific data (including Audit Logs and Admin contact info) beyond deletion if required for ongoing legal investigations or compliance with Indian data retention laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">9. Your Rights</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Access &amp; Export:</strong> Organisation Admins can export their Organisation&apos;s data (members, logs, submissions) at any time via the dashboard.</li>
            <li><strong>Correction:</strong> You may update your account information directly through the settings.</li>
            <li><strong>Deletion:</strong> You may request the deletion of your account or Organisation via the platform settings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">10. Contact Us</h2>
          <p className="mb-4">
            If you have questions regarding this Privacy Policy, Google user data practices, or our data security architecture, please contact our Data Protection Officer at: <a href="mailto:privacy@sangathan.space" className="text-blue-600 hover:underline">privacy@sangathan.space</a>
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Registered Entity Information</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Proprietor:</strong> Sheikh Arsalan Ullah Chishti</li>
              <li><strong>Registered Address:</strong> Sangathan, Street 8, Ghaffar Manzil, Jamia Nagar, 110025, Delhi, Okhla</li>
              <li><strong>Support Phone:</strong> +918527976791</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
