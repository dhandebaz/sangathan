export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Voluntary Contribution Policy</h1>
      
      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
        <p className="text-sm text-gray-500">Last Updated: June 15, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
          <p>
            Sangathan relies on voluntary financial contributions to sustain the platform&apos;s infrastructure (hosting, database, and anonymity tools). This policy outlines the terms regarding voluntary donations. By making a contribution, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Nature of Contributions</h2>
          <p>
            <strong>100% Voluntary:</strong> Supporting Sangathan is a voluntary contribution to support the maintenance and development of the platform. It is <strong>not required</strong> to use any features of the platform.
          </p>
          <p>
            <strong>No Feature Paywalls:</strong> Governance tools, member management, and all advanced features remain free for all Organisations. A contribution does not unlock special features or administrative tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Payment Processing</h2>
          <p>
            All voluntary contributions are processed manually via direct UPI transfers to our stated UPI IDs. Sangathan does not store your banking information, and no auto-recurring subscriptions exist on the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Non-Refundable Policy</h2>
          <p>
            Because all contributions go directly toward paying hard infrastructure costs (servers, databases), <strong>all voluntary contributions are strictly non-refundable</strong> once successfully transferred.
          </p>
          <p>
            If you make a duplicate payment by accident, please contact us immediately, and we will do our best to review the transaction on a discretionary basis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Contact Us</h2>
          <p>
            For any questions regarding contributions, please contact our support team at: <a href="mailto:support@sangathan.space" className="text-blue-600 hover:underline">support@sangathan.space</a>
          </p>
        </section>
      </div>
    </div>
  )
}
