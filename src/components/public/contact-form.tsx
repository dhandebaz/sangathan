'use client'

import { useState } from 'react'
import { submitPublicContact } from '@/actions/public/contact'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ContactFormProps {
  isHindi: boolean
}

export function ContactForm({ isHindi }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await submitPublicContact(email, message)
      if (!res.success) {
        throw new Error(res.error)
      }
      
      toast.success(
        isHindi ? 'संदेश भेजा गया!' : 'Message Sent!', 
        {
          description: isHindi 
            ? 'हम जल्द ही आपसे संपर्क करेंगे।' 
            : 'We will get back to you shortly.'
        }
      )
      setEmail('')
      setMessage('')
    } catch (err) {
      console.error(err)
      toast.error(isHindi ? 'संदेश भेजने में विफल' : 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-left">
        <Label htmlFor="email" className="text-slate-900 font-medium">
          {isHindi ? 'आपका ईमेल' : 'Your Email'}
        </Label>
        <Input 
          id="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
          className="bg-white border-slate-200"
        />
      </div>
      
      <div className="space-y-2 text-left">
        <Label htmlFor="message" className="text-slate-900 font-medium">
          {isHindi ? 'आपकी पूछताछ' : 'How can we help?'}
        </Label>
        <Textarea 
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isHindi ? 'हमें बताएं कि हम कैसे मदद कर सकते हैं...' : 'Tell us how we can help...'}
          required
          className="min-h-[150px] bg-white border-slate-200"
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading || !email || !message}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white"
      >
        {loading 
          ? (isHindi ? 'भेजा जा रहा है...' : 'Sending...') 
          : (isHindi ? 'संदेश भेजें' : 'Send Message')}
      </Button>
    </form>
  )
}
