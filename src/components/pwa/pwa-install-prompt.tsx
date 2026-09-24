'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import Image from 'next/image'
import {
  Download, Share, PlusSquare, X, CheckCircle2,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PwaContextType {
  isInstalled: boolean
  isInstallable: boolean
  isIos: boolean
  isAndroid: boolean
  triggerInstall: () => void
  openIosGuide: () => void
}

const PwaContext = createContext<PwaContextType>({
  isInstalled: false,
  isInstallable: false,
  isIos: false,
  isAndroid: false,
  triggerInstall: () => {},
  openIosGuide: () => {},
})

export function usePwa() {
  return useContext(PwaContext)
}

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone)
  )
}

function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream
}

function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /android/.test(window.navigator.userAgent.toLowerCase())
}

export function PwaProvider({ children, lang = 'en' }: { children: React.ReactNode; lang?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  // Initialized false so server HTML and first client render match (no hydration
  // mismatch); browser values sync in a microtask below, before paint.
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [showIosModal, setShowIosModal] = useState(false)
  const [showPromptBanner, setShowPromptBanner] = useState(false)

  const isHindi = lang === 'hi'

  useEffect(() => {
    // Deferred (not synchronous effect body): same timing, lint-clean.
    queueMicrotask(() => {
      if (isStandaloneDisplay()) {
        setIsInstalled(true)
        return
      }
      setIsIos(isIosDevice())
      setIsAndroid(isAndroidDevice())
    })

    // Check localStorage dismissal
    const dismissedAt = localStorage.getItem('sangathan_pwa_dismissed')
    const now = Date.now()
    const isDismissed = dismissedAt && now - parseInt(dismissedAt, 10) < 7 * 24 * 60 * 60 * 1000 // 7 days

    // Listen for beforeinstallprompt on Chromium browsers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      if (!isDismissed) {
        setShowPromptBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setShowPromptBanner(false)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    // On iOS Safari, show prompt after a short delay if not dismissed
    // (reads the device directly — effect closure must not use the state value)
    let iosTimer: ReturnType<typeof setTimeout> | undefined
    if (isIosDevice() && !isDismissed) {
      iosTimer = setTimeout(() => {
        setShowPromptBanner(true)
      }, 4000)
    }

    return () => {
      if (iosTimer) clearTimeout(iosTimer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const triggerInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowPromptBanner(false)
      }
      setDeferredPrompt(null)
    } else if (isIos) {
      setShowIosModal(true)
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      alert(
        isHindi
          ? 'कृपया अपने ब्राउज़र मेन्यू में जाकर "Install App" या "Add to Home screen" चुनें।'
          : 'Please tap your browser menu and select "Install App" or "Add to Home screen".'
      )
    }
  }

  const dismissBanner = () => {
    setShowPromptBanner(false)
    localStorage.setItem('sangathan_pwa_dismissed', Date.now().toString())
  }

  return (
    <PwaContext.Provider
      value={{
        isInstalled,
        isInstallable: !!deferredPrompt || isIos,
        isIos,
        isAndroid,
        triggerInstall,
        openIosGuide: () => setShowIosModal(true),
      }}
    >
      {children}

      {/* Floating Bottom Installation Banner (Mobile & Tablet) - lower z-index than modals (modals are z-[70]) */}
      {showPromptBanner && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white border border-slate-300 shadow-xl rounded-xl p-3.5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 p-1.5 shadow-xs">
              <Image
                src="/logo/logo.png"
                alt="Sangathan Logo"
                width={36}
                height={36}
                className="object-contain invert"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">Sangathan OS</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                  {isHindi ? 'ऐप' : 'App'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? '1-क्लिक होमस्क्रीन इंस्टॉलेशन' : 'Add to home screen for instant access'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="sm"
                onClick={triggerInstall}
                className="h-8 px-3 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                {isHindi ? 'इंस्टॉल' : 'Install'}
              </Button>
              <button
                type="button"
                onClick={dismissBanner}
                className="h-7 w-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Step-by-Step Installation Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full sm:max-w-md bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 p-1">
                  <Image
                    src="/logo/logo.png"
                    alt="Sangathan Logo"
                    width={28}
                    height={28}
                    className="object-contain invert"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isHindi ? 'iPhone / iPad पर ऐप इंस्टॉल करें' : 'Install Sangathan on iOS'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? 'सफारी ब्राउज़र से होमस्क्रीन पर जोड़ें' : 'Add to Home Screen via Safari'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {isHindi ? (
                    <>
                      सफारी ब्राउज़र के नीचे स्थित <strong>Share (शेयर)</strong> बटन{' '}
                      <Share className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" /> पर टैप करें।
                    </>
                  ) : (
                    <>
                      Tap the <strong>Share</strong> button{' '}
                      <Share className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" /> in your Safari toolbar.
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {isHindi ? (
                    <>
                      नीचे स्क्रॉल करें और <strong>Add to Home Screen (होम स्क्रीन में जोड़ें)</strong>{' '}
                      <PlusSquare className="w-3.5 h-3.5 inline text-slate-900 mx-0.5" /> चुनें।
                    </>
                  ) : (
                    <>
                      Scroll down and tap <strong>Add to Home Screen</strong>{' '}
                      <PlusSquare className="w-3.5 h-3.5 inline text-slate-900 mx-0.5" />.
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {isHindi ? (
                    <>
                      ऊपरी दाएं कोने में <strong>Add (जोड़ें)</strong> पर टैप करें। ऐप आपके होमस्क्रीन पर आइकन के साथ उपलब्ध होगा!
                    </>
                  ) : (
                    <>
                      Tap <strong>Add</strong> in the top-right corner. Sangathan will now appear as a native app icon on your home screen!
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold h-10 rounded-lg"
              onClick={() => setShowIosModal(false)}
            >
              {isHindi ? 'समझ गया (Done)' : 'Got it'}
            </Button>
          </div>
        </div>
      )}
    </PwaContext.Provider>
  )
}

export function PwaInstallButton({
  lang = 'en',
  className = '',
  variant = 'outline',
  size = 'sm',
}: {
  lang?: string
  className?: string
  variant?: 'outline' | 'default' | 'ghost' | 'secondary'
  size?: 'sm' | 'default' | 'lg'
}) {
  const { isInstalled, triggerInstall, isIos, openIosGuide } = usePwa()
  const isHindi = lang === 'hi'

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        {isHindi ? 'ऐप सक्रिय है' : 'App Installed'}
      </span>
    )
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={isIos ? openIosGuide : triggerInstall}
      className={`gap-1.5 font-bold transition-all active:scale-95 ${className}`}
      title={isHindi ? 'फोन पर ऐप इंस्टॉल करें' : 'Install App on Device'}
    >
      <Smartphone className="w-3.5 h-3.5" />
      <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
    </Button>
  )
}
