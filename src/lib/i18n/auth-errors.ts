import { headers } from 'next/headers'

export type AuthLocale = 'en' | 'hi'

/**
 * Resolves the request locale from the Referer header (e.g. /hi/login).
 * Server actions don't receive the lang path segment directly, so we
 * fall back to parsing the referer, defaulting to English.
 */
export async function getAuthLocale(): Promise<AuthLocale> {
  try {
    const headersList = await headers()
    const referer = headersList.get('referer') || ''
    const match = referer.match(/\/(en|hi)\//)
    return (match?.[1] as AuthLocale) || 'en'
  } catch {
    return 'en'
  }
}

const MESSAGES: Record<string, Record<AuthLocale, string>> = {
  invalidEmail: {
    en: 'Invalid email address',
    hi: 'मान्य ईमेल पता दर्ज करें',
  },
  passwordRequired: {
    en: 'Password is required',
    hi: 'पासवर्ड आवश्यक है',
  },
  fullNameRequired: {
    en: 'Full Name is required',
    hi: 'पूरा नाम आवश्यक है',
  },
  confirmPasswordRequired: {
    en: 'Confirm Password is required',
    hi: 'पासवर्ड की पुष्टि आवश्यक है',
  },
  passwordsDoNotMatch: {
    en: 'Passwords do not match',
    hi: 'पासवर्ड मेल नहीं खाते',
  },
  mustAcceptTerms: {
    en: 'You must accept the terms',
    hi: 'आपको नियमों को स्वीकार करना होगा',
  },
  passwordTooShort: {
    en: 'Password must be at least 12 characters',
    hi: 'पासवर्ड कम से कम 12 अक्षरों का होना चाहिए',
  },
  passwordUppercase: {
    en: 'Password must contain at least one uppercase letter',
    hi: 'पासवर्ड में कम से कम एक बड़ा अक्षर होना चाहिए',
  },
  passwordLowercase: {
    en: 'Password must contain at least one lowercase letter',
    hi: 'पासवर्ड में कम से कम एक छोटा अक्षर होना चाहिए',
  },
  passwordNumber: {
    en: 'Password must contain at least one number',
    hi: 'पासवर्ड में कम से कम एक अंक होना चाहिए',
  },
  passwordSpecial: {
    en: 'Password must contain at least one special character',
    hi: 'पासवर्ड में कम से कम एक विशेष वर्ण होना चाहिए',
  },
  accountLocked: {
    en: 'Account temporarily locked. Try again in {minutes} minutes.',
    hi: 'खाता अस्थायी रूप से लॉक है। {minutes} मिनट बाद पुनः प्रयास करें।',
  },
  tooManyAttempts: {
    en: 'Too many attempted logins. Please wait before trying again.',
    hi: 'बहुत अधिक लॉगिन प्रयास। कृपया कुछ देर बाद पुनः प्रयास करें।',
  },
  tooManyAttemptsLater: {
    en: 'Too many login attempts. Please try again later.',
    hi: 'बहुत अधिक लॉगिन प्रयास। कृपया बाद में पुनः प्रयास करें।',
  },
  orgSuspended: {
    en: 'Your organisation has been suspended. Please contact support.',
    hi: 'आपका संगठन निलंबित कर दिया गया है। कृपया सहायता से संपर्क करें।',
  },
  failedLogin: {
    en: 'Failed to login',
    hi: 'लॉगिन विफल रहा',
  },
  tooManySignups: {
    en: 'Too many signup attempts for this email. Please try again later.',
    hi: 'इस ईमेल के लिए बहुत अधिक साइनअप प्रयास। कृपया बाद में पुनः प्रयास करें।',
  },
  userAlreadyRegistered: {
    en: 'User already registered. Please login.',
    hi: 'उपयोगकर्ता पहले से पंजीकृत है। कृपया लॉगिन करें।',
  },
  checkEmailVerify: {
    en: 'Check your email to verify your account.',
    hi: 'अपने खाते की पुष्टि के लिए अपना ईमेल देखें।',
  },
  failedSignup: {
    en: 'Failed to sign up',
    hi: 'साइनअप विफल रहा',
  },
  checkEmailLoginLink: {
    en: 'Check your email for the login link.',
    hi: 'लॉगिन लिंक के लिए अपना ईमेल देखें।',
  },
  failedSendLoginLink: {
    en: 'Failed to send login link',
    hi: 'लॉगिन लिंक भेजने में विफल रहा',
  },
  resetLinkSent: {
    en: 'Password reset link sent to your email.',
    hi: 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।',
  },
  failedSendResetLink: {
    en: 'Failed to send password reset link',
    hi: 'पासवर्ड रीसेट लिंक भेजने में विफल रहा',
  },
  failedReset: {
    en: 'Failed to reset password',
    hi: 'पासवर्ड रीसेट विफल रहा',
  },
  sessionExpired: {
    en: 'Session expired or invalid. Please login again.',
    hi: 'सत्र समाप्त या अमान्य है। कृपया फिर से लॉगिन करें।',
  },
  organisationNameRequired: {
    en: 'Organisation name is required.',
    hi: 'संगठन का नाम आवश्यक है।',
  },
  failedCreateOrg: {
    en: 'Failed to create organisation. Please try again.',
    hi: 'संगठन बनाने में विफल रहा। कृपया पुनः प्रयास करें।',
  },
  unexpectedSetupError: {
    en: 'An unexpected error occurred during setup. Please try again.',
    hi: 'सेटअप के दौरान अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।',
  },
}

/**
 * Translates a known auth/OTP message to the requested locale.
 * Unknown (e.g. provider-originated) messages pass through unchanged so we
 * never degrade clarity with a bad machine translation.
 */
export function translateAuthMessage(message: string, locale: AuthLocale): string {
  if (locale === 'en') return message

  const minutesMatch = message.match(/Account temporarily locked\. Try again in (\d+) minutes\./)
  if (minutesMatch) {
    return MESSAGES.accountLocked.hi.replace('{minutes}', minutesMatch[1])
  }

  for (const entry of Object.values(MESSAGES)) {
    if (entry.en === message) return entry.hi
  }
  return message
}