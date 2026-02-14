// --- Configuration ---
const SENDER_API_URL = 'https://api.sender.net/v2'
const API_KEY = process.env.SENDER_API_KEY
const FROM_EMAIL = process.env.SENDER_FROM_EMAIL || 'talk@sangathan.space'
const FROM_NAME = process.env.SENDER_FROM_NAME || 'Sangathan'

if (!API_KEY) {
  console.warn('⚠️ SENDER_API_KEY is missing. Email sending will fail.')
}

// --- Types ---
export type EmailPayload = {
  to: string
  subject: string
  html: string
  text?: string // Fallback text
  tags?: string[] // For analytics
}

export type EmailResult = 
  | { success: true; id: string }
  | { success: false; error: string; code?: string }

// --- Service ---

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  // 1. Validate Payload
  if (!payload.to || !payload.subject || !payload.html) {
    return { success: false, error: 'Missing required email fields (to, subject, html)' }
  }

  // 2. Prepare Request
  const body = {
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    to: [
      {
        email: payload.to,
      },
    ],
    subject: payload.subject,
    html: payload.html,
    text: payload.text || payload.html.replace(/<[^>]*>?/gm, ''), // Basic strip tags fallback
    tags: payload.tags,
  }

  try {
    // 3. Call Sender API
    const response = await fetch(`${SENDER_API_URL}/im/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // 4. Handle Response
    if (!response.ok) {
      console.error('❌ Sender API Error:', {
        status: response.status,
        data,
        recipient: payload.to,
      })
      return { 
        success: false, 
        error: data.message || 'Failed to send email via Sender.net',
        code: data.code 
      }
    }

    console.log(`✅ Email sent to ${payload.to} (ID: ${data.data?.id || 'unknown'})`)
    return { success: true, id: data.data?.id }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network request failed'
    console.error('❌ Network Error sending email:', error)
    return { success: false, error: errorMessage }
  }
}
