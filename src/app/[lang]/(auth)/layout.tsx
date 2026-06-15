import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Lock, EyeOff } from 'lucide-react'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main id="main-content" tabIndex={-1} className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[minmax(22rem,0.85fr)_minmax(0,1.15fr)]">
      {/* Left Panel - Trust & Branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-orange-200 bg-orange-50 p-12 text-slate-900 lg:flex">
        <div>
          <Link href="/" className="inline-block" aria-label="Sangathan Home">
            <Image
              src="/logo/blacksangathanlogo.png"
              alt="Sangathan"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="mt-20">
             <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight">
               Access Your <br />
               <span className="text-orange-700">Organisation</span>
             </h1>
             <p className="max-w-md text-xl text-slate-600">
               Secure, isolated infrastructure for community work.
             </p>
          </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-start gap-4">
              <div className="rounded-lg border border-orange-200 bg-white p-2">
                 <ShieldCheck className="text-orange-700" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-lg">Multi-Tenant Isolation</h3>
                 <p className="text-sm text-slate-600">Your data is physically separated via Row Level Security.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="rounded-lg border border-orange-200 bg-white p-2">
                 <Lock className="text-orange-700" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-lg">Role-Based Access</h3>
                 <p className="text-sm text-slate-600">Granular permissions for Admins, Editors, and Members.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="rounded-lg border border-orange-200 bg-white p-2">
                 <EyeOff className="text-orange-700" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-lg">No Data Selling</h3>
                 <p className="text-sm text-slate-600">We never track, sell, or trade your community data.</p>
              </div>
           </div>
        </div>

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[48px] border-orange-100" aria-hidden="true" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col items-center justify-center bg-white px-4 py-10 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
           <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-block mb-2" aria-label="Sangathan Home">
                <Image
                  src="/logo/blacksangathanlogo.png"
                  alt="Sangathan"
                  width={140}
                  height={40}
                  className="h-10 w-auto mx-auto"
                  priority
                />
              </Link>
              <p className="text-gray-500">Secure infrastructure for community work.</p>
           </div>
           
           {children}
           
           <div className="mt-8 text-center text-sm text-slate-600">
              By continuing, you agree to our <Link href="/terms" className="underline hover:text-black">Terms</Link> and <Link href="/privacy" className="underline hover:text-black">Privacy Policy</Link>.
           </div>
        </div>
      </div>
    </main>
  )
}
