'use client'

import { useEffect, useState } from 'react'

interface JitsiEmbedProps {
  roomName: string
  displayName?: string
  height?: string | number
  width?: string | number
}

export function JitsiEmbed({
  roomName,
  displayName = 'Sangathan Member',
  height = '600px',
  width = '100%',
}: JitsiEmbedProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Standard pattern to handle hydration mismatch
    // Using setTimeout to avoid immediate setState during commit phase if linter is strict
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div 
        style={{ width, height }} 
        className="bg-gray-100 animate-pulse flex items-center justify-center rounded-lg border border-gray-200"
      >
        <p className="text-gray-500 font-medium">Loading Secure Video Conference...</p>
      </div>
    )
  }

  // Construct the Jitsi URL with user info pre-filled via hash parameters
  const domain = 'meet.jit.si'
  const url = `https://${domain}/${encodeURIComponent(roomName)}#userInfo.displayName="${encodeURIComponent(displayName)}"`

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-black relative" style={{ width, height }}>
      <iframe
        src={url}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Sangathan Secure Video Conference"
      />
    </div>
  )
}
