export default function ReportsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Reports & Disclosures</h1>
      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
        <p className="text-sm text-gray-500">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Purpose of This Page</h2>
          <p>
            This page explains how you can report issues related to Organisations using Sangathan, including abuse,
            misuse of data, security incidents, and other concerns that affect the integrity of the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Reporting Misuse by an Organisation</h2>
          <p>
            Sangathan provides infrastructure for Organisations but does not control their internal decisions. If you
            believe an Organisation is using the Platform in a way that violates our Terms of Service, applicable law,
            or your rights, you can report it to us with the following details:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Name of the Organisation.</li>
            <li>Description of the issue or suspected violation.</li>
            <li>Any relevant links or screenshots.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Security & Vulnerability Reports</h2>
          <p>
            If you discover a potential security vulnerability affecting the Sangathan Platform, we request that you
            report it responsibly and give us reasonable time to investigate and remediate before any public
            disclosure.
          </p>
          <p>
            Please include enough detail for us to reproduce the issue, such as the affected endpoint, request pattern,
            and impact.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. How We Handle Reports</h2>
          <p>
            We review all reports in good faith and prioritize those involving safety, security, or systemic misuse.
            Our possible actions may include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Contacting the Organisation to seek clarification or remediation.</li>
            <li>Restricting or suspending access for serious or repeated violations.</li>
            <li>Making technical changes to protect users or data where necessary.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Contact</h2>
          <p>
            To file a report related to misuse, safety, or security, please contact us at{' '}
            <a href="mailto:reports@sangathan.app" className="text-blue-600 hover:underline">
              reports@sangathan.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}

