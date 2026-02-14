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
            <strong>Our Role:</strong> Sangathan acts primarily as a <strong>Data Processor</strong> (Infrastructure Provider). The Organisation (your NGO, union, or collective) acts as the <strong>Data Controller</strong>.
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
            <li>To verify the identity of Organisation Admins (via phone OTP).</li>
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
            <strong>Infrastructure:</strong> Your data is hosted on Supabase (PostgreSQL), utilizing industry-standard encryption at rest and in transit.
          </p>
          <p>
            <strong>Isolation:</strong> We employ strict Row-Level Security (RLS) policies to ensure that data belonging to one Organisation is technically isolated from others.
          </p>
          <p>
            <strong>Access Controls:</strong> Access to the underlying database is restricted to authorized System Administrators for maintenance, security investigation, or legal compliance purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Data Sharing & Third Parties</h2>
          <p>We do not sell your data. We share data only with the following infrastructure sub-processors required to operate the Platform:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Supabase:</strong> Database hosting and authentication services.</li>
            <li><strong>Firebase (Google):</strong> SMS delivery and phone number verification.</li>
            <li><strong>Razorpay:</strong> Processing optional &quot;Supporter Subscription&quot; payments. (We do not store card details).</li>
            <li><strong>Vercel:</strong> Web hosting and edge network services.</li>
          </ul>
          <p className="mt-2">
            We may disclose data if required by law, such as in response to a court order or valid subpoena from Indian law enforcement agencies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">7. Data Retention & Deletion</h2>
          <p>
            <strong>Retention:</strong> We retain your data for as long as your account is active.
          </p>
          <p>
            <strong>Soft Deletion:</strong> When you delete an account or Organisation, data enters a &quot;soft-delete&quot; state for a grace period (e.g., 7-14 days) to allow for recovery from accidental deletion. After this period, data is permanently removed from our active database.
          </p>
          <p>
            <strong>Legal Hold:</strong> We may retain specific data (including Audit Logs and Admin contact info) beyond deletion if required for ongoing legal investigations or compliance with Indian data retention laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">8. Your Rights</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Access &amp; Export:</strong> Organisation Admins can export their Organisation&apos;s data (members, logs, submissions) at any time via the dashboard.</li>
            <li><strong>Correction:</strong> You may update your account information directly through the settings.</li>
            <li><strong>Deletion:</strong> You may request the deletion of your account or Organisation via the platform settings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">9. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at: <a href="mailto:privacy@sangathan.space" className="text-blue-600 hover:underline">privacy@sangathan.space</a>
          </p>
        </section>
      </div>
    </div>
  )
}
