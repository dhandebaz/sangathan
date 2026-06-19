import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Lock, EyeOff } from 'lucide-react'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main id="main-content" tabIndex={-1} className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[minmax(24rem,0.8fr)_minmax(0,1.2fr)]">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-200 bg-slate-950 p-12 text-white lg:flex">
        <div>
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
             <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight">
               Access your
               <br />
               <span className="text-orange-300">organisation securely</span>
             </h1>
             <p className="max-w-lg text-lg text-slate-300">
               Enterprise-grade controls, governance, and privacy for community groups.
             </p>
          </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-start gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                 <ShieldCheck size={24} />
              </div>
              <div>
                 <h3 className="font-semibold text-lg text-white">Multi-tenant isolation</h3>
                 <p className="text-sm leading-6 text-slate-300">Each organisation is segmented with dedicated security controls and data separation.</p>
              </div>
           </div>
           <div className="flex items-start gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                 <Lock size={24} />
              </div>
              <div>
                 <h3 className="font-semibold text-lg text-white">Role-based access</h3>
                 <p className="text-sm leading-6 text-slate-300">Control who can create, edit, approve, and manage governance workflows.</p>
              </div>
           </div>
           <div className="flex items-start gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                 <EyeOff size={24} />
              </div>
              <div>
                 <h3 className="font-semibold text-lg text-white">No data selling</h3>
                 <p className="text-sm leading-6 text-slate-300">We never track or sell your organisation's data.</p>
              </div>
           </div>
        </div>

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[48px] border-orange-200/20 opacity-60" aria-hidden="true" />
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-10 shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
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
              By continuing, you agree to our <Link href="/terms" className="underline decoration-slate-300 hover:text-slate-900">Terms</Link> and <Link href="/privacy" className="underline decoration-slate-300 hover:text-slate-900">Privacy Policy</Link>.
           </div>
        </div>
      </div>
    </main>
  )
}
