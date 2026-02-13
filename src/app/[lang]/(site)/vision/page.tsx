import Link from 'next/link'
import { Network, Layers, Code, Globe } from 'lucide-react'

export default function VisionPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Future Vision</h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        Building the "Governance OS" for the next century of civic engagement.
      </p>

      <div className="prose prose-slate max-w-none text-gray-700 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Beyond Member Management</h2>
          <p>
            Today, Sangathan is a robust tool for managing members and money. Tomorrow, it will be a complete operating system for decentralized governance. We envision a future where any group of citizens can spin up a fully functional, democratic institution in minutes, not years.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Roadmap Ahead</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="bg-orange-100 p-3 rounded-lg h-fit">
                <Layers className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Modular Governance</h3>
                <p className="text-gray-600">
                  We plan to introduce a plugin system where organisations can enable specialized modules—such as election management, volunteer scheduling, or grant reporting—tailored to their specific needs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-orange-100 p-3 rounded-lg h-fit">
                <Network className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Federated Networks</h3>
                <p className="text-gray-600">
                  Future versions will allow independent organisations to form coalitions or federations, sharing data and resources securely while maintaining their individual sovereignty.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-orange-100 p-3 rounded-lg h-fit">
                <Code className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Open API Ecosystem</h3>
                <p className="text-gray-600">
                  We intend to open our API to developers, enabling a civic-tech ecosystem where third-party tools can integrate seamlessly with your Sangathan database.
                </p>
              </div>
            </div>

             <div className="flex gap-4">
              <div className="bg-orange-100 p-3 rounded-lg h-fit">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Public Transparency Portals</h3>
                <p className="text-gray-600">
                  Organisations will be able to publish "Transparency Dashboards" to the public web with one click, showcasing their impact, financials, and membership growth in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">A Commitment to Open Standards</h2>
          <p>
            As we grow, we remain committed to open data standards. We will ensure that Sangathan never becomes a walled garden. Your data will always be portable, interoperable, and yours.
          </p>
        </section>
      </div>
    </div>
  )
}
