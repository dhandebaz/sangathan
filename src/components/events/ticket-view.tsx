'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Event, RSVP } from '@/types/events'

export function TicketView({ event, rsvp, qrToken }: { event: Event, rsvp: RSVP, qrToken: string }) {
  return (
    <Card className="max-w-sm mx-auto border-2 border-dashed border-gray-300 bg-gray-50">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg uppercase tracking-widest text-gray-500">Event Ticket</CardTitle>
        <h2 className="text-xl font-bold">{event.title}</h2>
        <p className="text-sm text-gray-600">
          {new Date(event.start_time).toLocaleDateString()} • {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <QRCodeSVG value={qrToken} size={180} level="H" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-mono text-sm text-gray-500">{rsvp.id.split('-')[0].toUpperCase()}</p>
          <p className="font-semibold">{rsvp.guest_name || rsvp.user?.full_name || 'Attendee'}</p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {rsvp.status.toUpperCase()}
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center">
          Show this QR code at the entrance for check-in.
        </p>
      </CardContent>
    </Card>
  )
}
