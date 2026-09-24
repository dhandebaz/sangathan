'use client'

import { useEffect, useState, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { verifyAndCheckIn } from '@/actions/events'

export function QRScanner({ userId }: { eventId: string, userId: string }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const isProcessingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    )

    scanner.render(onScanSuccess, onScanFailure)

    async function onScanSuccess(decodedText: string) {
      if (isProcessingRef.current) return // Debounce using ref (not stale state)
      
      if (!navigator.onLine) {
        setStatus('error')
        setMessage('No internet connection. Please try again when online.')
        isProcessingRef.current = false
        return
      }
      
      isProcessingRef.current = true
      setStatus('idle')
      setMessage('Verifying...')
      
      try {
        const res = await verifyAndCheckIn({ qrData: decodedText })
        
        if (res.success) {
          setStatus('success')
          setMessage('Check-in Successful!')
        } else {
          setStatus('error')
          setMessage(res.error || 'Check-in Failed')
        }
      } catch {
        setStatus('error')
        setMessage('System Error')
      }

      // Reset after 3 seconds
      timerRef.current = setTimeout(() => {
        setStatus('idle')
        setMessage('')
        isProcessingRef.current = false
      }, 3000)
    }

    function onScanFailure() {
      // handle scan failure, usually better to ignore and keep scanning.
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      scanner.clear().catch(error => {
        console.error('Failed to clear html5QrcodeScanner. ', error)
      })
    }
  }, [userId])

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div id="reader" className="overflow-hidden rounded-lg border shadow-sm"></div>
      
      {message && (
        <div className={`p-4 rounded-lg text-center font-bold ${
          status === 'success' ? 'bg-green-100 text-green-700' : 
          status === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {message}
        </div>
      )}
      
      <div className="text-center text-sm text-gray-500">
        Point camera at attendee&apos;s QR code ticket.
      </div>
    </div>
  )
}
