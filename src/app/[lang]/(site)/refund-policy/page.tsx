export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Refund & Subscription Policy</h1>
      
      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
        <p className="text-sm text-gray-500">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
          <p>
            Sangathan offers an optional &quot;Supporter Subscription&quot; to help sustain the platform&apos;s infrastructure. This policy outlines the terms regarding billing, cancellations, and refunds for this subscription. By subscribing, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Nature of Subscription</h2>
          <p>
            <strong>Voluntary Support:</strong> The Supporter Subscription is a voluntary contribution to support the maintenance and development of Sangathan. It is <strong>not required</strong> to use the core features of the platform.
          </p>
          <p>
            <strong>Core Features Remain Free:</strong> Governance tools, member management, and basic reporting remain free for all Organisations. The subscription does not unlock essential functionality required to run your collective.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Subscription Benefits</h2>
          <p>The Supporter Subscription (₹99/month) includes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A &quot;Supporter&quot; badge on your Organisation profile.</li>
            <li>The option to remove &quot;Powered by Sangathan&quot; branding from public forms.</li>
            <li>Recognition on our public supporters page (optional).</li>
          </ul>
          <p className="mt-2">
            It explicitly <strong>does not</strong> include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Additional data storage limits.</li>
            <li>Priority support.</li>
            <li>Access to restricted administrative tools.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Billing & Payment Processing</h2>
          <p>
            <strong>Billing Cycle:</strong> The subscription is billed on a monthly basis, starting from the date of activation.
          </p>
          <p>
            <strong>Payment Processor:</strong> All payments are processed securely via <strong>Razorpay</strong>. Sangathan does not store your credit card, debit card, or banking information.
          </p>
          <p>
            <strong>Third-Party Terms:</strong> By making a payment, you are also subject to Razorpay&apos;s terms of service and privacy policy. We are not responsible for payment failures caused by the banking network or payment gateway.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Refund Policy</h2>
          <p>
            <strong>7-Day Money-Back Guarantee:</strong> If you are not satisfied with your Supporter Subscription, you may request a full refund within <strong>7 days</strong> of your initial payment.
          </p>
          <p>
            <strong>Refund Eligibility:</strong>
            <ul className="list-disc pl-5 mt-2">
              <li>The request must be made within 7 days of the transaction date.</li>
              <li>Refunds are only applicable to the current billing cycle.</li>
              <li>Refunds are not available for past months of a subscription.</li>
            </ul>
          </p>
          <p>
            <strong>Discretionary Refunds:</strong> Requests made after the 7-day window will be considered on a case-by-case basis but are generally non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Cancellation Process</h2>
          <p>
            You may cancel your subscription at any time via the &quot;Billing&quot; section of your Organisation dashboard.
          </p>
          <p>
            <strong>Effect of Cancellation:</strong>
            <ul className="list-disc pl-5 mt-2">
              <li>Your subscription will remain active until the end of the current billing period.</li>
              <li>You will not be charged for the next cycle.</li>
              <li>After the period ends, you will lose the Supporter badge and branding removal options.</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">7. Failed Payments</h2>
          <p>
            If a scheduled payment fails (e.g., due to card expiry or insufficient funds), Razorpay may attempt to retry the transaction. If payment cannot be collected, your subscription will be automatically paused or cancelled, and Supporter benefits will be revoked.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">8. Subscription Termination by Platform</h2>
          <p>
            We reserve the right to terminate your subscription immediately if you violate our Terms of Service or Acceptable Use Policy. In such cases of termination for cause (e.g., fraud, abuse, illegal activity), no refund will be issued for the remaining subscription period.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">9. Changes to Subscription</h2>
          <p>
            We reserve the right to modify the price or benefits of the Supporter Subscription. Any price changes will be communicated to you at least 30 days in advance via email. Continued use of the subscription after the change constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">10. Contact Us</h2>
          <p>
            For any billing questions, refund requests, or payment issues, please contact our support team at: <a href="mailto:billing@sangathan.space" className="text-blue-600 hover:underline">billing@sangathan.space</a>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please include your Organisation ID and Transaction Reference Number in all correspondence to speed up the process.
          </p>
        </section>
      </div>
    </div>
  )
}
