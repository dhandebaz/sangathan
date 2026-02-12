import Link from 'next/link'
import { ShieldCheck, Lock, EyeOff } from 'lucide-react'

export default function AuthLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
      {/* Left Panel - Trust & Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            Sangathan
          </Link>
          <div className="mt-20">
             <h1 className="text-5xl font-bold mb-6 leading-tight">
               Access Your <br />
               <span className="text-orange-500">Organisation</span>
             </h1>
             <p className="text-xl text-gray-400 max-w-md">
               Secure, isolated infrastructure for community work.
             </p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
           <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                 <ShieldCheck className="text-orange-500" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-lg">Multi-Tenant Isolation</h3>
                 <p className="text-gray-400 text-sm">Your data is physically separated via Row Level Security.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                 <Lock className="text-orange-500" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-lg">Role-Based Access</h3>
                 <p className="text-gray-400 text-sm">Granular permissions for Admins, Editors, and Members.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                 <EyeOff className="text-orange-500" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-lg">No Data Selling</h3>
                 <p className="text-gray-400 text-sm">We never track, sell, or trade your community data.</p>
              </div>
           </div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">
           {/* Mobile Header */}
           <div className="lg:hidden text-center mb-8">
              <Link href="/" className="text-3xl font-bold tracking-tight mb-2 block">
                Sangathan
              </Link>
              <p className="text-gray-500">Secure infrastructure for community work.</p>
           </div>
           
           {children}
           
           <div className="text-center text-sm text-gray-500 mt-8">
              By continuing, you agree to our <Link href="/terms" className="underline hover:text-black">Terms</Link> and <Link href="/privacy" className="underline hover:text-black">Privacy Policy</Link>.
           </div>
        </div>
      </div>
    </div>
  )
}
