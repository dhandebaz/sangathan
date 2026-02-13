import Link from 'next/link'
import { Phone, FileText, UserCheck } from 'lucide-react'

export default function AdminAccountabilityPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Admin Accountability</h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        Why we enforce strict standards for Organisation Administrators.
      </p>

      <div className="prose prose-slate max-w-none text-gray-700 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Responsibility of Governance</h2>
          <p>
            An Organisation Admin on Sangathan holds significant power. They manage member data, record financial logs, and set the rules for their collective. With this power comes the responsibility to be identifiable and accountable.
          </p>
        </section>

        <section>
          <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
             <Phone className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
             <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mandatory Phone Verification</h3>
                <p className="text-gray-700 mb-2">
                   We require every Organisation Admin to verify their mobile phone number via OTP.
                </p>
                <p className="text-sm text-gray-600">
                   <strong>Why?</strong> To prevent anonymous abuse. If an organisation is used for fraud or harassment, we need to know there is a real human being responsible for it. This discourages "burner" accounts and builds trust in the ecosystem.
                </p>
             </div>
          </div>
        </section>

        <section>
          <div className="flex items-start gap-4 p-6 bg-orange-50 rounded-xl border border-orange-100">
             <FileText className="w-8 h-8 text-orange-600 shrink-0 mt-1" />
             <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Immutable Audit Logs</h3>
                <p className="text-gray-700 mb-2">
                   Every critical action taken by an Admin—adding a member, deleting a record, changing a setting—is permanently recorded in the Audit Log.
                </p>
                <p className="text-sm text-gray-600">
                   <strong>Why?</strong> To protect the organisation from internal bad actors. If data goes missing or is altered, the organisation can trace exactly who did it and when.
                </p>
             </div>
          </div>
        </section>

        <section>
          <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-100">
             <UserCheck className="w-8 h-8 text-green-600 shrink-0 mt-1" />
             <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Data Integrity Commitment</h3>
                <p className="text-gray-700 mb-2">
                   Admins agree to our Acceptable Use Policy, which strictly prohibits falsifying financial records or misrepresenting the organisation's mission.
                </p>
                <p className="text-sm text-gray-600">
                   <strong>Why?</strong> Sangathan is infrastructure for <em>serious</em> collectives. Maintaining the integrity of the data is essential for the platform's reputation and utility.
                </p>
             </div>
          </div>
        </section>
      </div>
    </div>
  )
}
