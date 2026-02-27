import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export const dynamic = 'force-static'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
       <div className="bg-white p-8 rounded-2xl shadow-sm max-w-lg w-full border border-gray-100">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <AlertTriangle className="text-orange-600 w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
          <p className="text-gray-600 mb-8">
             We are currently upgrading the Sangathan platform to serve you better. 
             Please check back in a few minutes.
          </p>
          
          <div className="text-sm text-gray-400">
             Expected downtime: &lt; 15 minutes
          </div>
       </div>
       
       <div className="mt-8 text-xs text-gray-400">
          Admin Access? Use your bypass key or cookie.
       </div>
    </div>
  )
}
