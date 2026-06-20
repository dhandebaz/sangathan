'use client'

import Image from 'next/image'
import { Server, Database, Shield, Heart, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { AiActivationForm } from './ai-activation-form'

export function SupportSangathan({ lang, isPublic = false }: { lang: string, isPublic?: boolean }) {
  const isHi = lang === 'hi'
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const costs = [
    {
      icon: Server,
      title: isHi ? 'होस्टिंग और सर्वर' : 'Hosting & Servers',
      amount: '$100',
      period: isHi ? 'प्रति माह' : '/ month',
      description: isHi ? 'उच्च-उपलब्धता सर्वर जो सुनिश्चित करते हैं कि संगठन कभी डाउन न हो।' : 'High-availability servers ensuring Sangathan never goes down.',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-500'
    },
    {
      icon: Database,
      title: isHi ? 'डेटाबेस और बैकएंड' : 'Database & Backend',
      amount: '$70',
      period: isHi ? 'प्रति माह' : '/ month',
      description: isHi ? 'सभी उपयोगकर्ता डेटा के लिए सुरक्षित और तेज़ क्लाउड स्टोरेज।' : 'Secure and extremely fast cloud storage for all organizational data.',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-500'
    },
    {
      icon: Shield,
      title: isHi ? 'गुमनामी और सुरक्षा' : 'Anonymity & Security',
      amount: '$150',
      period: isHi ? 'प्रति माह' : '/ month',
      description: isHi ? 'शिकायतों और मतदान के लिए कड़े सुरक्षा और गुमनामी उपकरण।' : 'Strict security maintenance and anonymity tools for grievances and polls.',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-500'
    }
  ]

  const upiIds = ['areynetaji@ybl', 'areynetaji@ibl', 'areynetaji@axl']

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-sm border border-slate-200 bg-slate-50 px-6 py-12 shadow-sm sm:px-12 sm:py-16">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-sm bg-white border border-slate-200 shadow-sm">
            <Heart className="h-8 w-8 text-brand-600" />
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {isHi ? 'हमारा आंदोलन शक्तिहीन नहीं है' : 'Empower the Movement'}
          </h2>
          <p className="max-w-2xl text-lg text-slate-600">
            {isHi 
              ? 'संगठन हमेशा मुफ़्त और विज्ञापन-मुक्त रहेगा। हालाँकि, हमारे कड़े सुरक्षा मानकों को बनाए रखने में वास्तविक धन खर्च होता है। अपनी स्वेच्छा से योगदान करें।' 
              : 'Sangathan is completely free and ad-free. However, maintaining our strict security and high-speed infrastructure costs real money. Support us if you can.'}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Costs Infographic */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-foreground">
              {isHi ? 'हमारा मासिक खर्च' : 'Where Your Money Goes'}
            </h3>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-4">
            {costs.map((cost, idx) => (
              <div key={idx} className={`relative overflow-hidden rounded-sm border p-5 sm:p-6 transition-all hover:shadow-md ${cost.color}`}>
                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-white/60 backdrop-blur-sm shadow-sm ${cost.iconColor}`}>
                    <cost.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg leading-none mb-1.5">{cost.title}</h4>
                    <p className="text-sm opacity-90 leading-relaxed max-w-sm">{cost.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl sm:text-3xl font-black tracking-tight">{cost.amount}</div>
                    <div className="text-sm font-medium opacity-80">{cost.period}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-sm border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                {isHi ? 'स्कैन करें और भुगतान करें' : 'Scan & Support'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {isHi ? 'किसी भी UPI ऐप का उपयोग करें' : 'Use any UPI app to contribute securely'}
              </p>
            </div>

            <div className="mx-auto w-full max-w-[240px] aspect-square rounded-sm border border-border bg-muted p-2 mb-8 relative group overflow-hidden">
              <Image
                src="/UPIqrBQP.jpg"
                alt="Support Sangathan UPI QR Code"
                fill
                className="object-contain p-2"
                priority
              />
              <div className="absolute inset-0 bg-foreground/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-card/90 text-foreground font-semibold px-3 py-1.5 rounded-sm text-sm shadow-sm">
                  {isHi ? 'स्कैन करें' : 'Scan Me'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-sm bg-muted p-4 border border-border">
                <div className="text-sm font-semibold text-muted-foreground mb-1">
                  {isHi ? 'खाता नाम' : 'Account Name'}
                </div>
                <div className="font-bold text-foreground">Sheikh Arsalan Ullah Chishti</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground ml-1">
                  {isHi ? 'उपलब्ध UPI आईडी' : 'Supported UPI IDs'}
                </div>
                {upiIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => copyToClipboard(id)}
                    className="flex w-full items-center justify-between rounded-sm border border-border bg-card p-3 hover:border-brand-300 hover:bg-brand-50 transition-colors group"
                  >
                    <span className="font-medium text-foreground font-mono text-sm">{id}</span>
                    {copiedId === id ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <p className="mt-6 text-center text-xs text-muted-foreground">
              {isHi ? 'आपका समर्थन 100% संगठनों को सुरक्षित और ऑनलाइन रखने में जाता है।' : '100% of your support goes directly to keeping Sangathan organizations secure and online.'}
            </p>
          </div>

          {!isPublic && (
            <div className="mt-8">
              <AiActivationForm lang={lang} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
