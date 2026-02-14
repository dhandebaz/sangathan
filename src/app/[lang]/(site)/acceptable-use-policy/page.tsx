export default function AUPPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Acceptable Use Policy</h1>
      
      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
        <p className="text-sm text-gray-500">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Purpose &amp; Scope</h2>
          <p>
            This Acceptable Use Policy (&quot;AUP&quot;) defines the boundaries of acceptable behavior on the Sangathan platform. It applies to all users, organisations, administrators, and members who access or use our infrastructure. By using Sangathan, you agree to comply with this AUP.
          </p>
          <p>
            Sangathan is a neutral governance infrastructure provider. While we do not police the ideological content of our users, we strictly prohibit activities that threaten the safety of our community, the integrity of our infrastructure, or violate the laws of India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Prohibited Activities</h2>
          
          <h3 className="text-lg font-medium text-black mt-4 mb-2">A. Illegal Use</h3>
          <p>You may not use the Platform to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Violate any local, state, national, or international law, including the Information Technology Act, 2000.</li>
            <li>Facilitate the sale or distribution of illegal goods, services, or substances.</li>
            <li>Promote, organize, or incite criminal activity.</li>
          </ul>

          <h3 className="text-lg font-medium text-black mt-4 mb-2">B. Fraud &amp; Financial Misrepresentation</h3>
          <p>Since Sangathan provides donation logging tools, trust is paramount. You prohibited from:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Falsifying financial records or donation logs.</li>
            <li>Using the Platform to facilitate money laundering or pyramid schemes.</li>
            <li>Misrepresenting the destination or purpose of funds collected offline.</li>
            <li>Impersonating another charity, organisation, or individual for financial gain.</li>
          </ul>

          <h3 className="text-lg font-medium text-black mt-4 mb-2">C. Hate Speech, Harassment &amp; Extremism</h3>
          <p>We strictly prohibit content or conduct that:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Promotes violence, incites hatred, or dehumanizes individuals or groups based on race, religion, caste, gender, sexual orientation, or disability.</li>
            <li>Constitutes harassment, bullying, or targeted abuse of any individual.</li>
            <li>Supports or glorifies terrorist organizations or violent extremist groups.</li>
          </ul>

          <h3 className="text-lg font-medium text-black mt-4 mb-2">D. Misinformation &amp; Manipulation</h3>
          <p>You may not use the Platform to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Disseminate verifiably false information intended to cause public harm or manipulate democratic processes.</li>
            <li>Create inauthentic accounts or organisations to artificially inflate support or membership numbers.</li>
            <li>Engage in &quot;astroturfing&quot; or coordinated inauthentic behavior.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Security &amp; Infrastructure Abuse</h2>
          <p>To protect the integrity of the Platform for all users, you must not:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Automated Abuse:</strong> Use bots, scripts, or automated tools to access the Platform, create accounts, or submit forms (except via approved APIs).</li>
            <li><strong>Security Circumvention:</strong> Attempt to bypass authentication measures, exploit vulnerabilities, or circumvent Row-Level Security (RLS) isolation.</li>
            <li><strong>OTP Abuse:</strong> Intentionally trigger excessive SMS/OTP verification requests (&quot;SMS bombing&quot;) against any number.</li>
            <li><strong>Scraping:</strong> Harvest or scrape data from the Platform without authorization.</li>
            <li><strong>Load Testing:</strong> Conduct unauthorized load testing or stress testing that degrades performance for other users.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Child Exploitation Zero-Tolerance</h2>
          <p>
            We have a zero-tolerance policy towards any content or activity that exploits or harms children. Any evidence of Child Sexual Abuse Material (CSAM) or grooming will result in immediate termination, data preservation, and reporting to the National Center for Missing &amp; Exploited Children (NCMEC) and relevant Indian law enforcement agencies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Enforcement &amp; Investigation</h2>
          <p>
            <strong>Right to Investigate:</strong> We reserve the right to investigate any reported violation of this AUP. This may involve reviewing Organisation data, audit logs, and system traffic.
          </p>
          <p>
            <strong>Suspension &amp; Termination:</strong> Violations may result in:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Removal of specific content or forms.</li>
            <li>Temporary suspension of the Organisation account.</li>
            <li>Permanent termination of access without prior notice.</li>
            <li>A ban on creating future accounts.</li>
          </ul>
          <p className="mt-2">
            <strong>Legal Hold:</strong> In cases of illegal activity or investigation, we may place a &quot;Legal Hold&quot; on your data, preventing deletion and preserving records for law enforcement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Neutral Infrastructure Clause</h2>
          <p>
            Sangathan is a tool, not a publisher. The presence of an Organisation on our Platform does not imply our endorsement of their views, mission, or activities. We remain neutral infrastructure providers unless a clear violation of this AUP or the law occurs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">7. Reporting &amp; Appeals</h2>
          <p>
            <strong>Reporting Violations:</strong> If you identify a violation of this policy, please report it to <a href="mailto:abuse@sangathan.space" className="text-blue-600 hover:underline">abuse@sangathan.space</a>. Please provide specific evidence and context.
          </p>
          <p>
            <strong>Appeals:</strong> If you believe your account was suspended in error, you may appeal by contacting <a href="mailto:appeals@sangathan.space" className="text-blue-600 hover:underline">appeals@sangathan.space</a>. We will review appeals in good faith but our decision remains final.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">8. Contact Us</h2>
          <p>
            For questions regarding this Acceptable Use Policy, please contact: <a href="mailto:legal@sangathan.space" className="text-blue-600 hover:underline">legal@sangathan.space</a>
          </p>
        </section>
      </div>
    </div>
  )
}
