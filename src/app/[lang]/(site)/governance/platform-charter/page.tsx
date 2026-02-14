import React from 'react'

export default function PlatformCharterPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-8">Platform Governance Charter</h1>
      
      <div className="prose prose-lg text-gray-700">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Purpose & Neutrality</h2>
          <p>
            Sangathan is a neutral digital infrastructure provider. Our mission is to empower organisations 
            to govern themselves effectively. We do not endorse, support, or align with the ideological 
            positions of any organisation using our platform, provided they adhere to structural legality.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Minimisation & Privacy</h2>
          <p>
            We adhere to a strict data minimisation principle. We only collect data necessary for the 
            structural operation of the platform. We do not sell user data, nor do we perform invasive 
            surveillance on private organisational communications unless legally compelled by a valid court order.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Suspension Protocol</h2>
          <p>
            Platform intervention is limited to structural abuse prevention. Organisations may face suspension 
            only under the following tiered protocol:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Level 1 (Warning):</strong> Detected spam patterns or minor policy breaches.</li>
            <li><strong>Level 2 (Restriction):</strong> Temporary disablement of broadcast or invite features.</li>
            <li><strong>Level 3 (Suspension):</strong> Full access block pending review.</li>
            <li><strong>Level 4 (Legal Hold):</strong> Data preservation order due to legal investigation.</li>
            <li><strong>Level 5 (Termination):</strong> Permanent removal for gross violations (e.g., illegal content, severe fraud).</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Right to Appeal</h2>
          <p>
            Every organisation has the right to appeal administrative actions. Appeals are reviewed by a 
            designated governance officer, distinct from the automated systems that may have flagged the risk. 
            All administrative actions are logged for accountability.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. System Admin Limitations</h2>
          <p>
            System administrators are structurally prevented from:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Altering the outcome of any organisational vote.</li>
            <li>Modifying financial logs or audit trails.</li>
            <li>Accessing private member data without an auditable reason code.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
