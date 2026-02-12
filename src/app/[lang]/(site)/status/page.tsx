import { CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'System Status - Sangathan',
}

export default function StatusPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-8">
         <CheckCircle size={40} />
      </div>
      <h1 className="text-3xl font-bold mb-4">All Systems Operational</h1>
      <p className="text-gray-500 mb-12">Sangathan platform is running normally.</p>

      <div className="space-y-4 text-left">
         <div className="p-4 border rounded-lg flex justify-between items-center">
            <span className="font-medium">Core Application</span>
            <span className="text-green-600 text-sm font-bold">Operational</span>
         </div>
         <div className="p-4 border rounded-lg flex justify-between items-center">
            <span className="font-medium">Database (Supabase)</span>
            <span className="text-green-600 text-sm font-bold">Operational</span>
         </div>
         <div className="p-4 border rounded-lg flex justify-between items-center">
            <span className="font-medium">Video Meetings (Jitsi)</span>
            <span className="text-green-600 text-sm font-bold">Operational</span>
         </div>
      </div>
    </div>
  )
}
