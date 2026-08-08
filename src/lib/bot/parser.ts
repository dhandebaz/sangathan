// Bilingual command parser for WhatsApp & Telegram Grassroots Bot

export type BotCommandType =
  | 'GRIEVANCE'
  | 'CHECKIN'
  | 'DUES'
  | 'VOTE'
  | 'SOS'
  | 'STATUS'
  | 'HELP'
  | 'UNKNOWN'

export interface ParsedBotMessage {
  command: BotCommandType
  rawText: string
  args: string[]
  details: string
  isHindi: boolean
}

export function parseBotMessage(text: string): ParsedBotMessage {
  const trimmed = (text || '').trim()
  if (!trimmed) {
    return { command: 'UNKNOWN', rawText: '', args: [], details: '', isHindi: false }
  }

  const parts = trimmed.split(/\s+/)
  const firstWord = parts[0].toUpperCase()

  // Detect Hindi keywords
  const isHindi = /[\u0900-\u097F]/.test(trimmed)

  // 1. Grievance
  if (
    firstWord === 'GRIEVANCE' ||
    firstWord === 'COMPLAINT' ||
    firstWord === 'SHIKAYAT' ||
    trimmed.startsWith('शिकायत') ||
    trimmed.startsWith('समस्या')
  ) {
    const details = parts.slice(1).join(' ')
    return { command: 'GRIEVANCE', rawText: trimmed, args: parts.slice(1), details, isHindi }
  }

  // 2. Check-in
  if (
    firstWord === 'CHECKIN' ||
    firstWord === 'ATTEND' ||
    firstWord === 'HAZIRI' ||
    trimmed.startsWith('हाजिरी') ||
    trimmed.startsWith('उपस्थिति')
  ) {
    return { command: 'CHECKIN', rawText: trimmed, args: parts.slice(1), details: parts.slice(1).join(' '), isHindi }
  }

  // 3. Dues & Contributions
  if (
    firstWord === 'DUES' ||
    firstWord === 'FEE' ||
    firstWord === 'BAKAYA' ||
    trimmed.startsWith('बकाया') ||
    trimmed.startsWith('शुल्क')
  ) {
    return { command: 'DUES', rawText: trimmed, args: parts.slice(1), details: parts.slice(1).join(' '), isHindi }
  }

  // 4. Vote & Strike Ballot
  if (
    firstWord === 'VOTE' ||
    firstWord === 'POLL' ||
    firstWord === 'MATDAN' ||
    trimmed.startsWith('वोट') ||
    trimmed.startsWith('मतदान')
  ) {
    return { command: 'VOTE', rawText: trimmed, args: parts.slice(1), details: parts.slice(1).join(' '), isHindi }
  }

  // 5. Emergency SOS
  if (
    firstWord === 'SOS' ||
    firstWord === 'EMERGENCY' ||
    firstWord === 'MADAD' ||
    trimmed.startsWith('मदद') ||
    trimmed.startsWith('आपातकाल')
  ) {
    const details = parts.slice(1).join(' ')
    return { command: 'SOS', rawText: trimmed, args: parts.slice(1), details, isHindi }
  }

  // 6. Membership Status & ID
  if (
    firstWord === 'STATUS' ||
    firstWord === 'ID' ||
    firstWord === 'MEMBER' ||
    trimmed.startsWith('स्थिति') ||
    trimmed.startsWith('पहचान')
  ) {
    return { command: 'STATUS', rawText: trimmed, args: parts.slice(1), details: parts.slice(1).join(' '), isHindi }
  }

  // 7. Help
  if (
    firstWord === 'HELP' ||
    firstWord === 'MENU' ||
    firstWord === 'START' ||
    trimmed.startsWith('सहायता')
  ) {
    return { command: 'HELP', rawText: trimmed, args: parts.slice(1), details: '', isHindi }
  }

  return { command: 'UNKNOWN', rawText: trimmed, args: parts, details: trimmed, isHindi }
}
