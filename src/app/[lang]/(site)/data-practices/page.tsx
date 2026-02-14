import { Database, HardDrive, RefreshCw, Download } from 'lucide-react'

export default function DataPracticesPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Data Practices</h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        A simplified guide to how your data lives on Sangathan.
      </p>

      <div className="grid gap-8">
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                 <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Storage & Isolation</h2>
           </div>
           <p className="text-gray-600 leading-relaxed">
              Your data is stored in a PostgreSQL database hosted in a secure cloud environment. Every row of data you create is tagged with your Organisation ID. Our database engine enforces strict isolation, meaning it is physically impossible for a query from Organisation A to return data from Organisation B.
           </p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                 <HardDrive className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Retention & Deletion</h2>
           </div>
           <p className="text-gray-600 leading-relaxed mb-4">
              We keep your data only as long as your account is active.
           </p>
           <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li><strong>Active Accounts:</strong> Data is retained indefinitely.</li>
              <li><strong>Deleted Accounts:</strong> Data enters a &quot;Soft Delete&quot; bin for 14 days, allowing you to recover from mistakes.</li>
              <li><strong>Permanent Erase:</strong> After 14 days, data is permanently wiped from our live database.</li>
           </ul>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                 <Download className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Export Rights</h2>
           </div>
           <p className="text-gray-600 leading-relaxed">
              You are never locked in. Admins can export their entire Member Registry, Donation Logs, and Meeting Minutes as CSV or JSON files at any time from the dashboard settings.
           </p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                 <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Legal Compliance</h2>
           </div>
           <p className="text-gray-600 leading-relaxed">
              We comply with the Information Technology Act, 2000. In strict accordance with the law, we may be required to preserve specific records (Legal Hold) if served with a valid court order or investigation notice by Indian authorities.
           </p>
        </div>
      </div>
    </div>
  )
}
