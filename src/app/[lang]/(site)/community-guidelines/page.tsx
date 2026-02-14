import { Heart, AlertTriangle, MessageSquare } from 'lucide-react'

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Community Guidelines</h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        Our expectations for how you use this shared infrastructure.
      </p>

      <div className="prose prose-slate max-w-none text-gray-700 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Spirit of Sangathan</h2>
          <p>
            Sangathan means &quot;Organisation&quot; or &quot;Union.&quot; It implies coming together for a shared purpose. We expect all users to act with integrity and respect for the platform and other communities.
          </p>
        </section>

        <section>
          <div className="flex gap-4 mb-6">
             <Heart className="w-6 h-6 text-orange-600 shrink-0" />
             <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Respectful Use</h3>
                <p>
                   Do not use our forms or communication tools to harass, bully, or intimidate individuals. Political disagreement is fine; targeted abuse is not.
                </p>
             </div>
          </div>

          <div className="flex gap-4 mb-6">
             <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
             <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Tolerance</h3>
                <p>
                   We have zero tolerance for:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                   <li>Hate speech or incitement to violence.</li>
                   <li>Financial fraud or scams.</li>
                   <li>Child exploitation or sexual abuse material.</li>
                   <li>Terrorism or violent extremism.</li>
                </ul>
                <p className="mt-2 text-sm text-gray-500">Violations will result in immediate termination.</p>
             </div>
          </div>

          <div className="flex gap-4 mb-6">
             <MessageSquare className="w-6 h-6 text-blue-600 shrink-0" />
             <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Reporting Mechanisms</h3>
                <p>
                   If you see something that violates these guidelines, please report it to <a href="mailto:abuse@sangathan.app" className="text-blue-600 hover:underline">abuse@sangathan.app</a>. We investigate all reports.
                </p>
             </div>
          </div>
        </section>
      </div>
    </div>
  )
}
