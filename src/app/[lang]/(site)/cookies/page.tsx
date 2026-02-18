export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Cookies Policy</h1>
      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
        <p className="text-sm text-gray-500">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website. They help websites
            remember information about your visit, such as your language preference, login status, or usage patterns.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. How Sangathan Uses Cookies</h2>
          <p>
            Sangathan uses cookies only for essential platform functionality and basic analytics. We do not sell your
            data or use cookies for invasive cross-site tracking.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Authentication cookies to keep you signed in securely.</li>
            <li>Security cookies to help detect suspicious or abusive activity.</li>
            <li>Preference cookies to remember language and basic UI settings.</li>
            <li>Analytics cookies to understand aggregate usage and improve the Platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Strictly Necessary Cookies:</strong> Required for core functionality such as logging in and
              navigating between pages.
            </li>
            <li>
              <strong>Performance and Analytics Cookies:</strong> Help us understand how the Platform is used so we can
              improve reliability and usability.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Third-Party Cookies</h2>
          <p>
            Some cookies may be set by third-party services integrated into the Platform, such as authentication
            providers or analytics tools. These providers have their own privacy and cookie policies, which we
            encourage you to review.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Managing Cookies</h2>
          <p>
            Most browsers allow you to control cookies through their settings, including blocking or deleting cookies.
            If you disable certain cookies, some features of Sangathan may not work correctly, including secure login
            and organisation management.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Updates to This Policy</h2>
          <p>
            We may update this Cookies Policy from time to time to reflect changes in technology, legal requirements, or
            our practices. When we make material changes, we will update the &quot;Last Updated&quot; date at the top of
            this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">7. Contact</h2>
          <p>
            If you have questions about our use of cookies, you can contact us at{' '}
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

