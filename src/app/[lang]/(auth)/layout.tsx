import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Lock, EyeOff } from 'lucide-react'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main id="main-content" tabIndex={-1} className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-200 bg-slate-50 p-12 text-slate-900 lg:flex">
        {/* Crisp Geometric Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-block" aria-label="Sangathan Home">
            <Image
              src="/logo/logo.png"
              alt="Sangathan"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="mt-20">
             <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight text-slate-900">
               Access your
               <br />
               <span className="text-brand-600">organisation securely</span>
             </h1>
             <p className="max-w-lg text-lg text-slate-600">
               Enterprise-grade controls, governance, and privacy for community groups.
             </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
           <div className="flex items-start gap-4 border border-slate-200 bg-white p-5 shadow-sm">
              <div className="bg-brand-50 p-2 text-brand-600 border border-brand-100">
                 <ShieldCheck size={20} strokeWidth={2} />
              </div>
              <div>
                 <h3 className="font-semibold text-base text-slate-900">Multi-tenant isolation</h3>
                 <p className="text-sm leading-6 text-slate-500 mt-1">Each organisation is segmented with dedicated security controls and data separation.</p>
              </div>
           </div>
           <div className="flex items-start gap-4 border border-slate-200 bg-white p-5 shadow-sm">
              <div className="bg-brand-50 p-2 text-brand-600 border border-brand-100">
                 <Lock size={20} strokeWidth={2} />
              </div>
              <div>
                 <h3 className="font-semibold text-base text-slate-900">Role-based access</h3>
                 <p className="text-sm leading-6 text-slate-500 mt-1">Control who can create, edit, approve, and manage governance workflows.</p>
              </div>
           </div>
           <div className="flex items-start gap-4 border border-slate-200 bg-white p-5 shadow-sm">
              <div className="bg-brand-50 p-2 text-brand-600 border border-brand-100">
                 <EyeOff size={20} strokeWidth={2} />
              </div>
              <div>
                 <h3 className="font-semibold text-base text-slate-900">No data selling</h3>
                  <p className="text-sm leading-6 text-slate-500 mt-1">We never track or sell your organisation&apos;s data.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-16 bg-white">
        <div className="w-full max-w-md bg-white">
           <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-block mb-3" aria-label="Sangathan Home">
                <Image
                  src="/logo/logo.png"
                  alt="Sangathan"
                  width={140}
                  height={40}
                  className="h-10 w-auto mx-auto"
                  priority
                />
              </Link>
              <p className="text-sm text-slate-500">Secure infrastructure for organised community work.</p>
           </div>

           {children}

           <div className="mt-8 text-center text-sm text-slate-500">
              By continuing, you agree to our <Link href="/terms" className="underline decoration-slate-300 hover:text-slate-900 transition-colors">Terms</Link> and <Link href="/privacy" className="underline decoration-slate-300 hover:text-slate-900 transition-colors">Privacy Policy</Link>.
           </div>
        </div>
      </div>
    </main>
  )
}
