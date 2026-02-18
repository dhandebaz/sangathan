export default function DataRightsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Data Rights</h1>
      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
        <p className="text-sm text-gray-500">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Your Rights Over Your Data</h2>
          <p>
            As a user or member recorded on Sangathan, you have important rights regarding your personal data. These
            rights are inspired by global data protection standards and local best practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Right to Access</h2>
          <p>
            You have the right to know what personal data about you is stored on the Platform by Organisations that you
            are part of. You can request a copy of your data from the relevant Organisation&apos;s administrators.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Right to Rectification</h2>
          <p>
            If your data is inaccurate or incomplete, you have the right to request corrections. In most cases, this can
            be done by contacting the Organisation Admin responsible for managing your records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Right to Erasure</h2>
          <p>
            In certain circumstances, you may request that your personal data be deleted from an Organisation&apos;s
            workspace. Some data may need to be retained for legal, audit, or safety reasons, but the Organisation
            should explain this clearly if deletion is not possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Right to Restrict Processing</h2>
          <p>
            You can request that your data be restricted from certain uses, such as mass communications or analytics,
            while still allowing an Organisation to retain it for compliance or membership records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Right to Data Portability</h2>
          <p>
            Organisations using Sangathan can export member data in standard formats. You can request that your data be
            provided or transferred, where technically feasible, in a structured, commonly used, and machine-readable
            format.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">7. How to Exercise Your Rights</h2>
          <p>
            Most rights should be exercised directly with the Organisation that manages your data, since they control
            the purposes and means of processing. If you believe an Organisation is misusing your data on Sangathan, you
            can also reach out to us so we can review and, where appropriate, take action at an infrastructure level.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">8. Contact</h2>
          <p>
            For questions or concerns about your data rights in relation to the Sangathan Platform, you can contact us
            at{' '}
            <a href="mailto:privacy@sangathan.app" className="text-blue-600 hover:underline">
              privacy@sangathan.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}

