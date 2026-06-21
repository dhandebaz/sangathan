'use client'

import Image from 'next/image'
import { Server, Database, Shield, Heart, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { AiActivationForm } from './ai-activation-form'

export function SupportSangathan({ lang, isPublic = false }: { lang: string, isPublic?: boolean }) {
  const isHi = lang === 'hi'
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const upiIds = ['sheikh.arsalan@okaxis', 'sheikh.arsalan@ybl', '8527976791@fam']

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-12 px-4">
      <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 sm:p-8 shadow-sm">
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
    </div>
  )
}
