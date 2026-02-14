export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
        <p className="text-sm text-gray-500">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
          <p>
            Welcome to Sangathan (&quot;Platform&quot;). These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;Organisation Admin,&quot; or &quot;Member&quot;) and Sangathan regarding your access to and use of the Sangathan platform, website, and associated services.
          </p>
          <p>
            By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Definitions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>&quot;Platform&quot;</strong> refers to the Sangathan digital infrastructure, including its website, database, and associated services.</li>
            <li><strong>&quot;Organisation&quot;</strong> refers to any collective, NGO, student group, union, or community entity created on the Platform.</li>
            <li><strong>&quot;Admin&quot;</strong> refers to the User who creates an Organisation or is granted administrative privileges within an Organisation.</li>
            <li><strong>&quot;Member&quot;</strong> refers to an individual whose data is recorded within an Organisation&apos;s database on the Platform.</li>
            <li><strong>&quot;User Data&quot;</strong> refers to all information, data, and content uploaded, entered, or managed by an Organisation on the Platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Infrastructure Neutrality</h2>
          <p>
            Sangathan acts solely as a neutral technical infrastructure provider. We provide the tools for governance, membership management, and operational tracking. We do not direct, control, or supervise the activities, objectives, or financial decisions of any Organisation using the Platform. The existence of an Organisation on the Platform does not constitute an endorsement by Sangathan of that Organisation&apos;s views, mission, or actions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Eligibility &amp; Registration</h2>
          <p>
            To use the Platform, you must be at least 18 years old and capable of entering into a binding contract under Indian law. By registering, you represent that all information provided is accurate and current.
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Verification Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email verification is required for all User accounts.</li>
              <li>Phone number verification is mandatory for all Organisation Admins to ensure accountability.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Organisation Responsibilities</h2>
          <p>
            The Organisation Admin is solely responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensuring that the Organisation&apos;s activities comply with all applicable laws, including the Information Technology Act, 2000, and relevant local regulations.</li>
            <li>Obtaining necessary consent from Members before collecting or processing their personal data on the Platform.</li>
            <li>Managing access controls and roles within their Organisation environment.</li>
            <li>The accuracy, legality, and integrity of all User Data entered into the Platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Financial Disclaimer</h2>
          <p>
            <strong>No Financial Intermediation:</strong> Sangathan does not process, hold, or transfer donations or funds on behalf of Organisations. The Platform provides tools to <em>log</em> and <em>track</em> financial records, but the actual movement of money occurs outside the Platform.
          </p>
          <p>
            <strong>Responsibility for Funds:</strong> Any dispute regarding funds, donations, or financial mismanagement is strictly between the Organisation and its donors or members. Sangathan bears no liability for financial fraud, misuse of funds, or accounting errors committed by an Organisation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">7. Data Ownership &amp; Privacy</h2>
          <p>
            <strong>Ownership:</strong> You retain full ownership of all User Data you upload to the Platform. Sangathan claims no intellectual property rights over your Organisation&apos;s data.
          </p>
          <p>
            <strong>Data Export:</strong> Organisations maintain the right to export their data (members, logs, records) at any time in a standard, machine-readable format.
          </p>
          <p>
            <strong>Data Isolation:</strong> The Platform utilizes a multi-tenant architecture with Row-Level Security (RLS) to ensure strict isolation of data between different Organisations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">8. Supporter Subscription &amp; Payments</h2>
          <p>
            <strong>Optional Subscription:</strong> The core functionality of Sangathan is free. Users may optionally purchase a &quot;Supporter Subscription&quot; to support the Platform&apos;s maintenance.
          </p>
          <p>
            <strong>Payment Processing:</strong> All subscription payments are processed by third-party payment gateways (e.g., Razorpay). Sangathan does not store your credit card or banking information. By subscribing, you agree to the terms and conditions of the respective payment processor.
          </p>
          <p>
            <strong>Refunds:</strong> Subscriptions are non-refundable except where required by law or explicitly stated in our Refund Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">9. Acceptable Use Policy</h2>
          <p>You agree not to use the Platform to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violate any local, state, national, or international law.</li>
            <li>Organize or promote violence, terrorism, hate speech, or illegal activities.</li>
            <li>Attempt to gain unauthorized access to the Platform&apos;s infrastructure or other Organisations&apos; data.</li>
            <li>Use the Platform for spamming, phishing, or distributing malware.</li>
          </ul>
          <p className="mt-2">
            Violation of this policy may result in immediate suspension or termination of your account and Organisation workspace.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">10. Termination &amp; Data Retention</h2>
          <p>
            <strong>Termination by User:</strong> You may delete your account or Organisation at any time. Upon deletion request, data enters a &quot;soft-delete&quot; grace period (e.g., 7-14 days) before permanent removal, subject to legal retention requirements.
          </p>
          <p>
            <strong>Termination by Platform:</strong> We reserve the right to suspend or terminate access if we determine, in our sole discretion, that an account is being used for illegal purposes or in violation of these Terms.
          </p>
          <p>
            <strong>Legal Hold:</strong> In the event of a valid legal order or investigation, we may preserve (place a &quot;legal hold&quot; on) relevant data and audit logs, preventing deletion until the matter is resolved.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">11. Limitation of Liability</h2>
          <p className="uppercase text-sm font-bold text-gray-600 mb-2">Please read this section carefully.</p>
          <p>
            To the maximum extent permitted by applicable law, Sangathan shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Your access to or use of (or inability to access or use) the Platform;</li>
            <li>Any conduct or content of any third party on the Platform;</li>
            <li>Any unauthorized access, use, or alteration of your transmissions or content.</li>
          </ul>
          <p className="mt-2">
            The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Sangathan and its operators from any claims, damages, liabilities, costs, or expenses (including legal fees) arising out of or related to your Organisation&apos;s activities, your use of the Platform, or your violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">13. Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or relating to these Terms or the Platform shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">14. Contact Information</h2>
          <p>
            For legal notices or questions regarding these Terms, please contact us at: <a href="mailto:legal@sangathan.app" className="text-blue-600 hover:underline">legal@sangathan.app</a>
          </p>
        </section>
      </div>
    </div>
  )
}
