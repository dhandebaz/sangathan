import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'धनवापसी नीति | संगठन' : 'Refund Policy | Sangathan',
    description: isHindi ? 'संगठन के लिए धनवापसी नीति और स्वैच्छिक योगदान की शर्तें।' : 'Refund policy and voluntary contribution terms for Sangathan.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/refund-policy`,
      languages: {
        en: 'https://sangathan.space/en/refund-policy',
        hi: 'https://sangathan.space/hi/refund-policy',
      },
    },
  }
}

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Subscription & Voluntary Contribution Policy</h1>

      <div className="prose prose-slate max-w-none text-slate-700 space-y-8">
        <p className="text-sm text-slate-500">Last Updated: August 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Introduction & Public-Good Ethos</h2>
          <p>
            Sangathan operates as digital public infrastructure for grassroots collectives, student bodies, worker unions, resident associations, and non-profits. We rely on institutional solidarity patronage and voluntary contributions to sustain server hosting, database storage, and AI GPU compute for the civic sector.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Plans & Patronage Tiers</h2>
          <p>
            <strong>Community Plan (₹0 / Free Forever):</strong> Free civic infrastructure for grassroots collectives (up to 20 users). Full access to all democratic governance tools, voting engines, meetings, tasks, and coalition federation features without fees or advertisements.
          </p>
          <p>
            <strong>Institution Plan (₹1,000/mo or ₹10,000/yr):</strong> Solidarity patronage by funded NGOs and registered unions requiring unlimited members, advanced analytics, and AI intelligence tools (Llama 3.3 70B inference).
          </p>
          <p>
            <strong>White-Label Addon (₹10,000 One-time):</strong> Optional emblem identity customization for established institutions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Payment Processing</h2>
          <p>
            All subscription payments and voluntary contributions are processed securely in INR via Razorpay (supporting UPI, Credit/Debit cards, and Net Banking). Sangathan does not store your payment card numbers or banking credentials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">4. 14-Day Refund Guarantee for Paid Subscriptions</h2>
          <p>
            We offer a <strong>14-day full refund guarantee</strong> on all paid plan subscriptions if you are unsatisfied for any reason. To request a refund within 14 days of purchase, email us at <a href="mailto:support@sangathan.space" className="text-indigo-600 hover:underline">support@sangathan.space</a> with your registered organisation details and Razorpay transaction ID.
          </p>
          <p>
            Refunds will be processed back to the original payment source within 5 to 7 business days following verification.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Contact & Entity Information</h2>
          <p className="mb-4">
            For questions regarding billing, invoices, or subscriptions, please contact us at: <a href="mailto:support@sangathan.space" className="text-indigo-600 hover:underline">support@sangathan.space</a>
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2">Registered Entity Information</h3>
            <ul className="space-y-1 text-slate-700 text-sm">
              <li><strong>Entity:</strong> Sangathan (Civic Infrastructure)</li>
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
