import { Metadata } from 'next'
import {
  ShieldCheck,
  HeartHandshake,
  Server,
  Lock,
  Mail,
  Cpu,
  RefreshCw,
  Database,
  DownloadCloud,
  Network,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import { PageHeader } from '@/components/public/page-header'
import { PublicPricingGrid } from '@/components/pricing/public-pricing-grid'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi
      ? 'à¤®à¥‚à¤²à¥à¤¯ à¤¨à¤¿à¤°à¥à¤§à¤¾à¤°à¤£: â‚¹0, â‚¹11, â‚¹999 | à¤¸à¤‚à¤—à¤ à¤¨'
      : 'Pricing: â‚¹0, â‚¹11, â‚¹999 | Sangathan',
    description: isHindi
      ? '5 à¤¸à¤¦à¤¸à¥à¤¯à¥‹à¤‚ à¤¤à¤• à¤®à¥à¤«à¥à¤¤à¥¤ à¤‰à¤¸à¤•à¥‡ à¤¬à¤¾à¤¦ à¤¹à¤° à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¸à¤¾à¤¥à¥€ â‚¹11/à¤®à¤¾à¤¹à¥¤ à¤µà¥à¤¹à¤¾à¤‡à¤Ÿ-à¤²à¥‡à¤¬à¤² â‚¹999 à¤à¤•à¤®à¥à¤¶à¥à¤¤à¥¤ à¤•à¥‹à¤ˆ à¤µà¤¾à¤°à¥à¤·à¤¿à¤• à¤¬à¤‚à¤§à¤¨ à¤¨à¤¹à¥€à¤‚à¥¤'
      : 'Free up to 5 members. Then â‚¹11/month per active member beyond 5. Whitelabel â‚¹999 one-time. No annual lock-in, no slabs.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/pricing`,
      languages: {
        en: 'https://sangathan.space/en/pricing',
        hi: 'https://sangathan.space/hi/pricing',
      },
    },
    openGraph: {
      title: isHindi ? 'à¤®à¥‚à¤²à¥à¤¯ à¤¨à¤¿à¤°à¥à¤§à¤¾à¤°à¤£: â‚¹0, â‚¹11, â‚¹999 | à¤¸à¤‚à¤—à¤ à¤¨' : 'Pricing: â‚¹0, â‚¹11, â‚¹999 | Sangathan',
      description: isHindi
        ? '5 à¤¸à¤¦à¤¸à¥à¤¯à¥‹à¤‚ à¤¤à¤• à¤®à¥à¤«à¥à¤¤à¥¤ à¤‰à¤¸à¤•à¥‡ à¤¬à¤¾à¤¦ à¤¹à¤° à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¸à¤¾à¤¥à¥€ â‚¹11/à¤®à¤¾à¤¹à¥¤ à¤µà¥à¤¹à¤¾à¤‡à¤Ÿ-à¤²à¥‡à¤¬à¤² â‚¹999 à¤à¤•à¤®à¥à¤¶à¥à¤¤à¥¤'
        : 'Free up to 5 members. Then â‚¹11/month per active member beyond 5. Whitelabel â‚¹999 one-time.',
      url: `https://sangathan.space/${lang}/pricing`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'à¤®à¥‚à¤²à¥à¤¯: â‚¹0, â‚¹11, â‚¹999' : 'Pricing: â‚¹0, â‚¹11, â‚¹999')}&desc=${encodeURIComponent(isHindi ? '5 à¤¤à¤• à¤®à¥à¤«à¥à¤¤, à¤‰à¤¸à¤•à¥‡ à¤¬à¤¾à¤¦ â‚¹11/à¤¸à¤¾à¤¥à¥€/à¤®à¤¾à¤¹à¥¤ à¤•à¥‹à¤ˆ à¤µà¤¾à¤°à¥à¤·à¤¿à¤• à¤¬à¤‚à¤§à¤¨ à¤¨à¤¹à¥€à¤‚à¥¤' : 'Free up to 5 members, then â‚¹11/member/month. No annual lock-in.')}&type=ngo&tag=Pricing&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: isHindi ? 'à¤¸à¤‚à¤—à¤ à¤¨ à¤®à¥‚à¤²à¥à¤¯ à¤¨à¤¿à¤°à¥à¤§à¤¾à¤°à¤£' : 'Sangathan Pricing',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'à¤®à¥‚à¤²à¥à¤¯ à¤¨à¤¿à¤°à¥à¤§à¤¾à¤°à¤£: â‚¹0, â‚¹11, â‚¹999 | à¤¸à¤‚à¤—à¤ à¤¨' : 'Pricing: â‚¹0, â‚¹11, â‚¹999 | Sangathan',
      description: isHindi
        ? '5 à¤¸à¤¦à¤¸à¥à¤¯à¥‹à¤‚ à¤¤à¤• à¤®à¥à¤«à¥à¤¤à¥¤ à¤‰à¤¸à¤•à¥‡ à¤¬à¤¾à¤¦ à¤¹à¤° à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¸à¤¾à¤¥à¥€ â‚¹11/à¤®à¤¾à¤¹à¥¤ à¤µà¥à¤¹à¤¾à¤‡à¤Ÿ-à¤²à¥‡à¤¬à¤² â‚¹999 à¤à¤•à¤®à¥à¤¶à¥à¤¤à¥¤'
        : 'Free up to 5 members. Then â‚¹11/month per active member beyond 5. Whitelabel â‚¹999 one-time.',
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'à¤®à¥‚à¤²à¥à¤¯: â‚¹0, â‚¹11, â‚¹999' : 'Pricing: â‚¹0, â‚¹11, â‚¹999')}&desc=${encodeURIComponent(isHindi ? '5 à¤¤à¤• à¤®à¥à¤«à¥à¤¤, à¤‰à¤¸à¤•à¥‡ à¤¬à¤¾à¤¦ â‚¹11/à¤¸à¤¾à¤¥à¥€/à¤®à¤¾à¤¹à¥¤ à¤•à¥‹à¤ˆ à¤µà¤¾à¤°à¥à¤·à¤¿à¤• à¤¬à¤‚à¤§à¤¨ à¤¨à¤¹à¥€à¤‚à¥¤' : 'Free up to 5 members, then â‚¹11/member/month. No annual lock-in.')}&type=ngo&tag=Pricing&lang=${lang}`],
    },
  }
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let orgId = ''
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('organisation_id')
      .eq('id', user.id)
      .maybeSingle()
    if (profile?.organisation_id) {
      orgId = profile.organisation_id
    }
  }

  const faqs = [
    {
      question: isHindi
        ? 'à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¤¿à¤¸ à¤ªà¥à¤°à¤•à¤¾à¤° à¤•à¤¾ à¤¸à¤‚à¤—à¤ à¤¨ à¤¹à¥ˆ?'
        : 'What kind of organization is Sangathan?',
      answer: isHindi
        ? 'à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¥‹à¤ˆ à¤µà¤¾à¤£à¤¿à¤œà¥à¤¯à¤¿à¤• à¤•à¤‚à¤ªà¤¨à¥€ à¤¯à¤¾ à¤¸à¥à¤Ÿà¤¾à¤°à¥à¤Ÿà¤…à¤ª à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤ à¤¯à¤¹ à¤¬à¤¹à¥à¤œà¤¨ à¤•à¥à¤µà¥€à¤° à¤«à¤¾à¤‰à¤‚à¤¡à¥‡à¤¶à¤¨ (à¤¸à¥‡à¤•à¥à¤¶à¤¨ 8 à¤—à¥ˆà¤°-à¤²à¤¾à¤­à¤•à¤¾à¤°à¥€ à¤¸à¤‚à¤¸à¥à¤¥à¤¾) à¤•à¥€ à¤à¤• à¤¡à¤¿à¤œà¤¿à¤Ÿà¤² à¤¨à¤¾à¤—à¤°à¤¿à¤• à¤…à¤µà¤¸à¤‚à¤°à¤šà¤¨à¤¾ à¤ªà¤¹à¤² à¤¹à¥ˆ, à¤œà¥‹ à¤—à¥ˆà¤°-à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¸à¤‚à¤—à¤ à¤¨à¥‹à¤‚ à¤”à¤° à¤¨à¤¾à¤—à¤°à¤¿à¤• à¤¸à¤®à¥‚à¤¹à¥‹à¤‚ à¤•à¥‹ à¤¸à¤¶à¤•à¥à¤¤ à¤¬à¤¨à¤¾à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤®à¤°à¥à¤ªà¤¿à¤¤ à¤¹à¥ˆà¥¤'
        : 'Sangathan is not a commercial SaaS startup or company. It is a digital civic infrastructure initiative of Bahujan Queer Foundation, a Section 8 non-profit organization registered in India.',
    },
    {
      question: isHindi
        ? 'à¤®à¥à¤«à¥à¤¤ à¤¸à¤¾à¤®à¥à¤¦à¤¾à¤¯à¤¿à¤• à¤ªà¤¹à¥à¤‚à¤š (Community Access) à¤®à¥‡à¤‚ à¤•à¥à¤¯à¤¾ à¤®à¤¿à¤²à¤¤à¤¾ à¤¹à¥ˆ?'
        : 'What does free Community Access include?',
      answer: isHindi
        ? '5 à¤¸à¤¦à¤¸à¥à¤¯ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤² (à¤à¤¡à¤®à¤¿à¤¨ à¤¸à¤¹à¤¿à¤¤) à¤¤à¤• à¤¸à¤¬ à¤•à¥à¤› à¤®à¥à¤«à¥à¤¤: à¤®à¤¤à¤¦à¤¾à¤¨, à¤¸à¤°à¥à¤µà¥‡à¤•à¥à¤·à¤£, à¤«à¥€à¤²à¥à¤¡-à¤¡à¥‡à¤Ÿà¤¾, à¤°à¤œà¤¿à¤¸à¥à¤Ÿà¤°, 80G-à¤¤à¥ˆà¤¯à¤¾à¤° à¤°à¤¸à¥€à¤¦à¥‡à¤‚, à¤ªà¤°à¥à¤šà¤¾, à¤¯à¤¾à¤šà¤¿à¤•à¤¾à¤à¤‚ à¤µ à¤ªà¤¾à¤°à¤¦à¤°à¥à¤¶à¤¿à¤¤à¤¾ à¤ªà¥‡à¤œà¥¤ à¤®à¤¤à¤¦à¤¾à¤¤à¤¾ à¤µ à¤¹à¤¸à¥à¤¤à¤¾à¤•à¥à¤·à¤°à¤•à¤°à¥à¤¤à¤¾ à¤—à¤¿à¤¨à¤¤à¥€ à¤®à¥‡à¤‚ à¤¨à¤¹à¥€à¤‚ à¤†à¤¤à¥‡à¥¤ à¤¯à¤¹à¥€ à¤®à¥à¤«à¥à¤¤ à¤Ÿà¥à¤°à¤¾à¤¯à¤² à¤¹à¥ˆ â€” à¤•à¥‹à¤ˆ à¤¸à¤®à¤¯ à¤¸à¥€à¤®à¤¾ à¤¨à¤¹à¥€à¤‚à¥¤'
        : 'Up to 5 member profiles (admin included) with everything: voting, surveys, field-data tools, registers, 80G-ready receipts, parcha, petitions and transparency page. Voters and signers are never counted. This free tier is the trial â€” no time limit.',
    },
    {
      question: isHindi
        ? 'à¤®à¥€à¤Ÿà¤° à¤¬à¤¿à¤²à¤¿à¤‚à¤— (â‚¹11/à¤¸à¤¾à¤¥à¥€) à¤•à¥ˆà¤¸à¥‡ à¤•à¤¾à¤® à¤•à¤°à¤¤à¥€ à¤¹à¥ˆ?'
        : 'How does metered billing (â‚¹11/member) work?',
      answer: isHindi
        ? 'à¤•à¥‹à¤ˆ à¤¬à¥‡à¤¸ à¤«à¥€à¤¸ à¤¨à¤¹à¥€à¤‚, à¤•à¥‹à¤ˆ à¤ªà¥à¤²à¤¾à¤¨ à¤–à¤°à¥€à¤¦à¤¨à¤¾ à¤¨à¤¹à¥€à¤‚à¥¤ UPI à¤‘à¤Ÿà¥‹à¤ªà¥‡ à¤²à¤—à¤¾à¤“ à¤”à¤° à¤®à¥€à¤Ÿà¤° à¤šà¤² à¤ªà¤¡à¤¼à¥‡à¤—à¤¾: (à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¸à¤¦à¤¸à¥à¤¯ âˆ’ 5) Ã— â‚¹11/à¤®à¤¾à¤¹, à¤®à¤¾à¤¹-à¤…à¤‚à¤¤ à¤—à¤£à¤¨à¤¾à¥¤ à¤¸à¤•à¥à¤°à¤¿à¤¯ = 60 à¤¦à¤¿à¤¨ à¤®à¥‡à¤‚ à¤²à¥‰à¤—à¤¿à¤¨à¥¤ à¤œà¥ˆà¤¸à¥‡ 30 à¤¸à¤¦à¤¸à¥à¤¯ = â‚¹275/à¤®à¤¾à¤¹à¥¤ à¤•à¤­à¥€ à¤­à¥€ à¤°à¥‹à¤•à¥‹ â€” à¤¡à¥‡à¤Ÿà¤¾ à¤°à¤¹à¥‡à¤—à¤¾à¥¤ à¤•à¥‹à¤ˆ à¤µà¤¾à¤°à¥à¤·à¤¿à¤• à¤¬à¤‚à¤§à¤¨ à¤¨à¤¹à¥€à¤‚à¥¤'
        : 'No base fee, no plan to buy. Add UPI autopay and the meter runs: (active members âˆ’ 5) Ã— â‚¹11/month, counted month-end. Active = logged in within 60 days. E.g. 30 members = â‚¹275/month. Pause anytime â€” data stays. No annual lock-in.',
    },
    {
      question: isHindi
        ? 'à¤µà¥à¤¹à¤¾à¤‡à¤Ÿ-à¤²à¥‡à¤¬à¤² (â‚¹999) à¤®à¥‡à¤‚ à¤•à¥à¤¯à¤¾ à¤®à¤¿à¤²à¤¤à¤¾ à¤¹à¥ˆ?'
        : 'What does the â‚¹999 whitelabel give?',
      answer: isHindi
        ? 'à¤à¤•à¤®à¥à¤¶à¥à¤¤ â‚¹999 à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤ªà¤° à¤¸à¤¾à¤°à¥à¤µà¤œà¤¨à¤¿à¤• à¤ªà¥‡à¤œà¥‹à¤‚, à¤•à¤¾à¤°à¥à¤¯à¤•à¥à¤°à¤®à¥‹à¤‚, à¤ªà¤¤à¥à¤°à¥‹à¤‚ à¤µ à¤¬à¥ˆà¤œ à¤¸à¥‡ "Powered by Sangathan" à¤¹à¤®à¥‡à¤¶à¤¾ à¤•à¥‡ à¤²à¤¿à¤ à¤¹à¤Ÿà¥‡à¤—à¤¾ à¤”à¤° à¤†à¤ªà¤•à¤¾ à¤ªà¥à¤°à¤¤à¥€à¤• à¤ªà¤¹à¤²à¥‡ à¤†à¤à¤—à¤¾à¥¤ à¤®à¥à¤«à¥à¤¤ à¤µ à¤®à¥€à¤Ÿà¤° à¤µà¤¾à¤²à¥€ à¤¦à¥‹à¤¨à¥‹à¤‚ à¤¶à¥à¤°à¥‡à¤£à¤¿à¤¯à¤¾à¤‚ à¤–à¤°à¥€à¤¦ à¤¸à¤•à¤¤à¥€ à¤¹à¥ˆà¤‚à¥¤'
        : 'A one-time â‚¹999 payment removes "Powered by Sangathan" branding and puts your emblem first across public pages, events, letters and badges â€” forever. Buyable on both Free and Metered.',
    },
    {
      question: isHindi
        ? 'à¤¹à¤®à¤¾à¤°à¤¾ à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤•à¤¹à¤¾à¤‚ à¤–à¤°à¥à¤š à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ?'
        : 'Where does our contribution go?',
      answer: isHindi
        ? '100% à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤¸à¥€à¤§à¥‡ à¤¸à¤°à¥à¤µà¤° à¤¹à¥‹à¤¸à¥à¤Ÿà¤¿à¤‚à¤—, à¤à¤¨à¥à¤•à¥à¤°à¤¿à¤ªà¥à¤Ÿà¥‡à¤¡ à¤¡à¥‡à¤Ÿà¤¾à¤¬à¥‡à¤¸ à¤¸à¥à¤Ÿà¥‹à¤°à¥‡à¤œ, SMS/à¤ˆà¤®à¥‡à¤² à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€, AI à¤•à¤‚à¤ªà¥à¤¯à¥‚à¤Ÿ à¤‡à¤‚à¤«à¥à¤°à¤¾à¤¸à¥à¤Ÿà¥à¤°à¤•à¥à¤šà¤° à¤”à¤° à¤“à¤ªà¤¨-à¤¸à¥‹à¤°à¥à¤¸ à¤¸à¥‰à¤«à¥à¤Ÿà¤µà¥‡à¤¯à¤° à¤°à¤–à¤°à¤–à¤¾à¤µ à¤®à¥‡à¤‚ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤¹à¤® à¤•à¥‹à¤ˆ à¤²à¤¾à¤­ à¤¨à¤¹à¥€à¤‚ à¤•à¤®à¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤'
        : '100% of contributions directly cover secure high-availability servers, encrypted backups, email/SMS delivery, privacy-preserving AI compute, and ongoing non-profit software maintenance.',
    },
    {
      question: isHindi
        ? 'à¤•à¥à¤¯à¤¾ à¤¹à¤®à¤¾à¤°à¤¾ à¤¡à¥‡à¤Ÿà¤¾ à¤•à¤­à¥€ à¤¬à¥‡à¤šà¤¾ à¤¯à¤¾ à¤µà¤¿à¤œà¥à¤žà¤¾à¤ªà¤¨à¥‹à¤‚ à¤®à¥‡à¤‚ à¤‡à¤¸à¥à¤¤à¥‡à¤®à¤¾à¤² à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤à¤—à¤¾?'
        : 'Is our organizational data private and sovereign?',
      answer: isHindi
        ? 'à¤¬à¤¿à¤²à¤•à¥à¤² à¤¨à¤¹à¥€à¤‚à¥¤ à¤¹à¤® à¤¶à¥‚à¤¨à¥à¤¯ à¤¡à¥‡à¤Ÿà¤¾ à¤¸à¤¾à¤à¤¾à¤•à¤°à¤£ à¤¨à¥€à¤¤à¤¿ à¤•à¤¾ à¤ªà¤¾à¤²à¤¨ à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤•à¥‹à¤ˆ à¤µà¤¿à¤œà¥à¤žà¤¾à¤ªà¤¨ à¤¨à¤¹à¥€à¤‚, à¤•à¥‹à¤ˆ à¤Ÿà¥à¤°à¥ˆà¤•à¤° à¤¨à¤¹à¥€à¤‚, à¤”à¤° à¤à¤• à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¤¾ à¤¡à¥‡à¤Ÿà¤¾ à¤•à¤­à¥€ à¤¦à¥‚à¤¸à¤°à¥‡ à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¥‡ AI à¤•à¥‹ à¤ªà¥à¤°à¤¶à¤¿à¤•à¥à¤·à¤¿à¤¤ à¤¨à¤¹à¥€à¤‚ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤†à¤ª à¤•à¤­à¥€ à¤­à¥€ à¤…à¤ªà¤¨à¤¾ à¤ªà¥‚à¤°à¤¾ à¤¡à¥‡à¤Ÿà¤¾ JSON/CSV à¤®à¥‡à¤‚ à¤¨à¤¿à¤°à¥à¤¯à¤¾à¤¤ à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤'
        : 'Strictly zero commercial monetization. We run no ads and sell no telemetry. Organization data is never used to train external models, and you maintain complete sovereignty with 1-click full data export.',
    },
    {
      question: isHindi
        ? 'à¤•à¥à¤¯à¤¾ à¤—à¥ˆà¤°-à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤¨à¤¾à¤—à¤°à¤¿à¤• à¤¸à¤®à¥‚à¤¹ à¤¯à¤¾ à¤œà¤®à¥€à¤¨à¥€ à¤†à¤‚à¤¦à¥‹à¤²à¤¨ à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¤¾ à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚?'
        : 'Can unregistered grassroots movements and civic collectives join?',
      answer: isHindi
        ? 'à¤¹à¤¾à¤, à¤¬à¤¿à¤²à¥à¤•à¥à¤²à¥¤ à¤¸à¤‚à¤—à¤ à¤¨ à¤µà¤¿à¤¶à¥‡à¤· à¤°à¥‚à¤ª à¤¸à¥‡ à¤…à¤¨à¥Œà¤ªà¤šà¤¾à¤°à¤¿à¤• à¤¸à¤®à¥‚à¤¹à¥‹à¤‚, à¤µà¤¿à¤°à¥‹à¤§ à¤®à¤‚à¤šà¥‹à¤‚ à¤”à¤° à¤¨à¤¾à¤—à¤°à¤¿à¤• à¤†à¤‚à¤¦à¥‹à¤²à¤¨à¥‹à¤‚ à¤•à¤¾ à¤¸à¤®à¤°à¥à¤¥à¤¨ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤†à¤ªà¤•à¥‹ à¤¶à¥à¤°à¥‚ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤•à¤¿à¤¸à¥€ à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£ à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤•à¥€ à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤'
        : 'Yes, absolutely. Sangathan is built for informal collectives, mutual-aid groups, and grassroots campaigns without requiring statutory registration numbers.',
    },
    {
      question: isHindi
        ? 'à¤¬à¤¹à¥à¤œà¤¨ à¤•à¥à¤µà¥€à¤° à¤«à¤¾à¤‰à¤‚à¤¡à¥‡à¤¶à¤¨ (BQF) à¤®à¤¾à¤¨à¥à¤¯à¤¤à¤¾ à¤•à¥ˆà¤¸à¥‡ à¤•à¤¾à¤® à¤•à¤°à¤¤à¥€ à¤¹à¥ˆ?'
        : 'How does Bahujan Queer Foundation (BQF) recognition work for collectives?',
      answer: isHindi
        ? 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤œà¤®à¥€à¤¨à¥€ à¤¸à¤®à¥‚à¤¹ à¤¬à¤¹à¥à¤œà¤¨ à¤•à¥à¤µà¥€à¤° à¤«à¤¾à¤‰à¤‚à¤¡à¥‡à¤¶à¤¨ (à¤¦à¤¿à¤²à¥à¤²à¥€ à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤¸à¥‡à¤•à¥à¤¶à¤¨ 8 NGO) à¤¸à¥‡ à¤¸à¤¾à¤®à¥à¤¦à¤¾à¤¯à¤¿à¤• à¤¸à¤‚à¤¬à¤¦à¥à¤§à¤¤à¤¾ à¤®à¤¾à¤‚à¤— à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤œà¤¿à¤¸à¤¸à¥‡ à¤‰à¤¨à¤•à¥€ à¤µà¤¿à¤¶à¥à¤µà¤¸à¤¨à¥€à¤¯à¤¤à¤¾ à¤¬à¤¢à¤¼à¤¤à¥€ à¤¹à¥ˆà¥¤ à¤¯à¤¹ à¤•à¤¿à¤¸à¥€ à¤—à¥ˆà¤°-à¤²à¤¾à¤­à¤•à¤¾à¤°à¥€ à¤•à¥€ à¤®à¤¾à¤¨à¥à¤¯à¤¤à¤¾ à¤¹à¥ˆ â€” à¤•à¤¾à¤¨à¥‚à¤¨à¥€ à¤›à¥‚à¤Ÿ, à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£ à¤¯à¤¾ à¤—à¤¿à¤°à¤«à¥à¤¤à¤¾à¤°à¥€ à¤¸à¥‡ à¤¸à¥à¤°à¤•à¥à¤·à¤¾ à¤¨à¤¹à¥€à¤‚à¥¤ à¤†à¤§à¤¿à¤•à¤¾à¤°à¤¿à¤• à¤ªà¤¤à¥à¤° à¤¹à¤®à¥‡à¤¶à¤¾ à¤…à¤ªà¤¨à¥‡ à¤¨à¤¾à¤® à¤¸à¥‡ à¤­à¥‡à¤œà¥‡à¤‚à¥¤'
        : 'Active grassroots groups can seek community affiliation with Bahujan Queer Foundation (Delhi Reg. Section 8 NGO) for credibility. This is a non-profit recognition â€” not legal immunity, government registration, or protection from arrest. Always send official letters in your own name.',
    },
  ]

  const costBreakdown = [
    {
      icon: Server,
      titleEn: 'Secure Cloud & High-Availability Servers',
      titleHi: 'à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤•à¥à¤²à¤¾à¤‰à¤¡ à¤µ à¤¹à¤¾à¤ˆ-à¤…à¤µà¥‡à¤²à¥‡à¤¬à¤¿à¤²à¤¿à¤Ÿà¥€ à¤¸à¤°à¥à¤µà¤°',
      descEn:
        'Dedicated compute instances and edge nodes ensuring 99.9% uptime for campaigns and continuous voting ballots.',
      descHi:
        'à¤…à¤­à¤¿à¤¯à¤¾à¤¨à¥‹à¤‚ à¤”à¤° à¤¨à¤¿à¤°à¤‚à¤¤à¤° à¤®à¤¤à¤¦à¤¾à¤¨ à¤®à¤¤à¤ªà¤¤à¥à¤°à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ 99.9% à¤…à¤ªà¤Ÿà¤¾à¤‡à¤® à¤¸à¥à¤¨à¤¿à¤¶à¥à¤šà¤¿à¤¤ à¤•à¤°à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤¸à¤®à¤°à¥à¤ªà¤¿à¤¤ à¤•à¤‚à¤ªà¥à¤¯à¥‚à¤Ÿ à¤¨à¥‹à¤¡à¥à¤¸à¥¤',
    },
    {
      icon: Database,
      titleEn: 'Encrypted Storage & Automated Backups',
      titleHi: 'à¤à¤¨à¥à¤•à¥à¤°à¤¿à¤ªà¥à¤Ÿà¥‡à¤¡ à¤¸à¥à¤Ÿà¥‹à¤°à¥‡à¤œ à¤µ à¤¸à¥à¤µà¤šà¤¾à¤²à¤¿à¤¤ à¤¬à¥ˆà¤•à¤…à¤ª',
      descEn:
        'AES-256 encrypted file storage for resolution archives, legal evidence, member rosters, and point-in-time database snapshots.',
      descHi:
        'à¤ªà¥à¤°à¤¸à¥à¤¤à¤¾à¤µ à¤…à¤­à¤¿à¤²à¥‡à¤–à¤¾à¤—à¤¾à¤°, à¤•à¤¾à¤¨à¥‚à¤¨à¥€ à¤¸à¤¾à¤•à¥à¤·à¥à¤¯ à¤”à¤° à¤¸à¤¦à¤¸à¥à¤¯ à¤°à¥‹à¤¸à¥à¤Ÿà¤° à¤•à¥‡ à¤²à¤¿à¤ AES-256 à¤à¤¨à¥à¤•à¥à¤°à¤¿à¤ªà¥à¤Ÿà¥‡à¤¡ à¤«à¤¼à¤¾à¤‡à¤² à¤¸à¤‚à¤—à¥à¤°à¤¹à¤£à¥¤',
    },
    {
      icon: Mail,
      titleEn: 'Transactional Email & SMS Delivery',
      titleHi: 'à¤²à¥‡à¤¨-à¤¦à¥‡à¤¨ à¤ˆà¤®à¥‡à¤² à¤µ SMS à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€',
      descEn:
        'Best-effort delivery for SOS alerts, meeting invites and voting OTPs via email/SMS providers. Delivery depends on telecom networks and cannot be guaranteed.',
      descHi:
        'à¤ˆà¤®à¥‡à¤²/SMS à¤¸à¥‡ à¤…à¤²à¤°à¥à¤Ÿ, à¤¬à¥ˆà¤ à¤• à¤†à¤®à¤‚à¤¤à¥à¤°à¤£ à¤”à¤° OTP à¤­à¥‡à¤œà¤¨à¥‡ à¤•à¥€ à¤­à¤°à¤¸à¤• à¤•à¥‹à¤¶à¤¿à¤¶à¥¤ à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€ à¤Ÿà¥‡à¤²à¥€à¤•à¥‰à¤® à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤ªà¤° à¤¨à¤¿à¤°à¥à¤­à¤° à¤¹à¥ˆ, à¤—à¤¾à¤°à¤‚à¤Ÿà¥€ à¤¨à¤¹à¥€à¤‚à¥¤',
    },
    {
      icon: Cpu,
      titleEn: 'Privacy-First AI Compute Infrastructure',
      titleHi: 'à¤—à¥‹à¤ªà¤¨à¥€à¤¯à¤¤à¤¾-à¤ªà¥à¤°à¤¥à¤® AI à¤•à¤‚à¤ªà¥à¤¯à¥‚à¤Ÿ à¤…à¤µà¤¸à¤‚à¤°à¤šà¤¨à¤¾',
      descEn:
        'Dedicated inference clusters for Sangathan AI (meeting minutes extraction, grant proposal assistance, ticket triage) with zero third-party training retention.',
      descHi:
        'à¤¸à¤‚à¤—à¤ à¤¨ AI (à¤¬à¥ˆà¤ à¤• à¤•à¤¾à¤°à¥à¤¯à¤µà¥ƒà¤¤à¥à¤¤, à¤…à¤¨à¥à¤¦à¤¾à¤¨ à¤®à¤¿à¤²à¤¾à¤¨, à¤Ÿà¥à¤°à¤¾à¤‡à¤à¤œ) à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤®à¤°à¥à¤ªà¤¿à¤¤ à¤•à¤‚à¤ªà¥à¤¯à¥‚à¤Ÿ, à¤œà¤¹à¤¾à¤‚ à¤¡à¥‡à¤Ÿà¤¾ à¤•à¤­à¥€ à¤¸à¤¾à¤à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥‹à¤¤à¤¾à¥¤',
    },
    {
      icon: Network,
      titleEn: 'Network Resilience & Offline PWA Sync',
      titleHi: 'à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤²à¤šà¥€à¤²à¤¾à¤ªà¤¨ à¤µ à¤‘à¤«à¤²à¤¾à¤‡à¤¨ PWA à¤¸à¤¿à¤‚à¤•',
      descEn:
        'Multi-provider router fallback and offline-first PWA sync ensuring uninterrupted collective organizing during connectivity drops.',
      descHi:
        'à¤¬à¤¹à¥-à¤ªà¥à¤°à¤¦à¤¾à¤¤à¤¾ à¤…à¤¤à¤¿à¤°à¥‡à¤• à¤”à¤° à¤‘à¤«à¤¼à¤²à¤¾à¤‡à¤¨ PWA à¤¸à¤¿à¤‚à¤• à¤¤à¤¾à¤•à¤¿ à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤¡à¥à¤°à¥‰à¤ª à¤•à¥‡ à¤¦à¥Œà¤°à¤¾à¤¨ à¤­à¥€ à¤¸à¤‚à¤—à¤ à¤¨ à¤¬à¤¿à¤¨à¤¾ à¤¬à¤¾à¤§à¤¾ à¤•à¤¾à¤°à¥à¤¯ à¤•à¤° à¤¸à¤•à¥‡à¥¤',
    },
    {
      icon: RefreshCw,
      titleEn: 'Open Maintenance & Security Audits',
      titleHi: 'à¤“à¤ªà¤¨ à¤°à¤–à¤°à¤–à¤¾à¤µ à¤µ à¤¸à¥à¤°à¤•à¥à¤·à¤¾ à¤‘à¤¡à¤¿à¤Ÿ',
      descEn:
        'Continuous patching, penetration testing, compliance updates, and dedicated engineering for democratic collective tooling.',
      descHi:
        'à¤¨à¤¿à¤¯à¤®à¤¿à¤¤ à¤¸à¥à¤°à¤•à¥à¤·à¤¾ à¤ªà¥ˆà¤šà¤¿à¤‚à¤—, à¤ªà¥‡à¤¨à¤¿à¤Ÿà¥à¤°à¥‡à¤¶à¤¨ à¤Ÿà¥‡à¤¸à¥à¤Ÿà¤¿à¤‚à¤— à¤”à¤° à¤¨à¤¾à¤—à¤°à¤¿à¤• à¤‰à¤ªà¤•à¤°à¤£à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤®à¤°à¥à¤ªà¤¿à¤¤ à¤‡à¤‚à¤œà¥€à¤¨à¤¿à¤¯à¤°à¤¿à¤‚à¤—à¥¤',
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'à¤¹à¥‹à¤®' : 'Home', url: `https://sangathan.space/${lang}` },
          {
            name: isHindi ? 'à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤”à¤° à¤ªà¤¹à¥à¤‚à¤š' : 'Pay & Price',
            url: `https://sangathan.space/${lang}/pricing`,
          },
        ]}
      />
      <FAQJsonLd
        questions={faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />

      <PageHeader
        title={isHindi ? 'à¤®à¥‚à¤²à¥à¤¯ à¤¨à¤¿à¤°à¥à¤§à¤¾à¤°à¤£: â‚¹0, â‚¹11, â‚¹999' : 'Pricing: â‚¹0, â‚¹11, â‚¹999'}
        description={
          isHindi
            ? '5 à¤¸à¤¦à¤¸à¥à¤¯à¥‹à¤‚ à¤¤à¤• à¤®à¥à¤«à¥à¤¤à¥¤ à¤‰à¤¸à¤•à¥‡ à¤¬à¤¾à¤¦ à¤¹à¤° à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¸à¤¾à¤¥à¥€ â‚¹11/à¤®à¤¾à¤¹à¥¤ à¤µà¥à¤¹à¤¾à¤‡à¤Ÿ-à¤²à¥‡à¤¬à¤² â‚¹999 à¤à¤•à¤®à¥à¤¶à¥à¤¤à¥¤ à¤•à¥‹à¤ˆ à¤µà¤¾à¤°à¥à¤·à¤¿à¤• à¤¬à¤‚à¤§à¤¨, à¤•à¥‹à¤ˆ à¤¸à¥à¤²à¥ˆà¤¬ à¤¨à¤¹à¥€à¤‚à¥¤'
            : 'Free up to 5 members. Then â‚¹11/month per active member beyond 5. Whitelabel â‚¹999 one-time. No annual lock-in, no slabs.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        {/* 1. Interactive Pricing & Contribution Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isHindi ? 'à¤ªà¤¹à¥à¤‚à¤š à¤®à¥‰à¤¡à¤² à¤šà¥à¤¨à¥‡à¤‚' : 'Choose Your Access Model'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {isHindi
                ? 'à¤¸à¥à¤µà¥ˆà¤šà¥à¤›à¤¿à¤• à¤¸à¤¾à¤®à¥à¤¦à¤¾à¤¯à¤¿à¤• à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤¯à¤¾ à¤¸à¤‚à¤¸à¥à¤¥à¤¾à¤—à¤¤ à¤¸à¤‚à¤°à¤•à¥à¤·à¤• à¤¸à¤®à¤°à¥à¤¥à¤¨, à¤¹à¤° à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¥‹ à¤¸à¤®à¤¾à¤¨ à¤¸à¤‚à¤ªà¥à¤°à¤­à¥ à¤¤à¤•à¤¨à¥€à¤• à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆà¥¤'
                : 'Voluntary community contributions or institutional solidarity, every collective gets identical sovereign democratic tools.'}
            </p>
          </div>

          <PublicPricingGrid orgId={orgId} lang={lang} isHindi={isHindi} />
        </div>

        {/* 2. Where Your Contribution Goes (Operational Cost Breakdown) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isHindi ? 'à¤†à¤ªà¤•à¤¾ à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤•à¤¹à¤¾à¤ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ?' : 'Where Your Contribution Goes'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? 'à¤¹à¤® à¤à¤• à¤¸à¥‡à¤•à¥à¤¶à¤¨ 8 à¤—à¥ˆà¤°-à¤²à¤¾à¤­à¤•à¤¾à¤°à¥€ à¤ªà¤¹à¤² à¤¹à¥ˆà¤‚à¥¤ à¤¸à¤­à¥€ à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤¸à¥€à¤§à¥‡ à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• à¤¤à¤•à¤¨à¥€à¤•à¥€ à¤…à¤µà¤¸à¤‚à¤°à¤šà¤¨à¤¾ à¤”à¤° à¤¨à¤¾à¤—à¤°à¤¿à¤• à¤¸à¥à¤°à¤•à¥à¤·à¤¾ à¤•à¥‹ à¤¨à¤¿à¤§à¤¿ à¤¦à¥‡à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤'
                : 'As a Section 8 non-profit initiative, every rupee received directly funds real technical operations, reliability, and security for social organizing.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costBreakdown.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {isHindi ? item.titleHi : item.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isHindi ? item.descHi : item.descEn}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Privacy-First & Mirrored Infrastructure Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {isHindi ? 'à¤¶à¥‚à¤¨à¥à¤¯ à¤¡à¥‡à¤Ÿà¤¾ à¤®à¥à¤¦à¥à¤°à¥€à¤•à¤°à¤£' : 'Zero Commercial Monetization'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? 'à¤•à¥‹à¤ˆ à¤µà¤¿à¤œà¥à¤žà¤¾à¤ªà¤¨ à¤¨à¤¹à¥€à¤‚, à¤•à¥‹à¤ˆ à¤¡à¥‡à¤Ÿà¤¾ à¤¬à¥à¤°à¥‹à¤•à¤° à¤¨à¤¹à¥€à¤‚à¥¤ à¤†à¤ªà¤•à¥€ à¤¸à¤¦à¤¸à¥à¤¯à¤¤à¤¾ à¤¸à¥‚à¤šà¥€ à¤”à¤° à¤†à¤‚à¤¤à¤°à¤¿à¤• à¤šà¤°à¥à¤šà¤¾à¤à¤ à¤ªà¥‚à¤°à¥€ à¤¤à¤°à¤¹ à¤¸à¥‡ à¤—à¥‹à¤ªà¤¨à¥€à¤¯ à¤”à¤° à¤¸à¤‚à¤ªà¥à¤°à¤­à¥ à¤¹à¥ˆà¤‚à¥¤'
                : 'No ad networks, no data brokers. Member rosters, votes, and conversations remain completely confidential to your organization.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {isHindi ? 'à¤²à¤šà¥€à¤²à¤¾ à¤µ à¤ªà¥à¤°à¤¤à¤¿à¤°à¥‚à¤ªà¤¿à¤¤ à¤¬à¥à¤¨à¤¿à¤¯à¤¾à¤¦à¥€ à¤¢à¤¾à¤‚à¤šà¤¾' : 'Resilient Mirrored Infrastructure'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? 'à¤¬à¤¹à¥-à¤ªà¥à¤°à¤¦à¤¾à¤¤à¤¾ à¤…à¤¤à¤¿à¤°à¥‡à¤• (Multi-provider fallback) à¤”à¤° à¤‘à¤«à¤¼à¤²à¤¾à¤‡à¤¨-à¤¸à¤•à¥à¤·à¤® PWA à¤¤à¤¾à¤•à¤¿ à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤†à¤‰à¤Ÿà¥‡à¤œ à¤®à¥‡à¤‚ à¤­à¥€ à¤†à¤ªà¤•à¤¾ à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¤¾à¤°à¥à¤¯ à¤•à¤° à¤¸à¤•à¥‡à¥¤'
                : 'Multi-provider router fallback and offline-first PWA sync ensure uninterrupted organizing even during regional network drops.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {isHindi ? '1-à¤•à¥à¤²à¤¿à¤• à¤ªà¥‚à¤°à¥à¤£ à¤¡à¥‡à¤Ÿà¤¾ à¤¸à¤‚à¤ªà¥à¤°à¤­à¥à¤¤à¤¾' : '1-Click Full Sovereign Export'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? 'à¤¶à¥‚à¤¨à¥à¤¯ à¤µà¥‡à¤‚à¤¡à¤° à¤²à¥‰à¤•-à¤‡à¤¨à¥¤ à¤†à¤ª à¤•à¤¿à¤¸à¥€ à¤­à¥€ à¤¸à¤®à¤¯ à¤…à¤ªà¤¨à¥‡ à¤¸à¤‚à¤ªà¥‚à¤°à¥à¤£ à¤¸à¤‚à¤—à¤ à¤¨ à¤•à¤¾ à¤¡à¥‡à¤Ÿà¤¾, à¤®à¤¤à¤ªà¤¤à¥à¤° à¤”à¤° à¤¦à¤¸à¥à¤¤à¤¾à¤µà¥‡à¤œ JSON/CSV à¤®à¥‡à¤‚ à¤¡à¤¾à¤‰à¤¨à¤²à¥‹à¤¡ à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤'
                : 'Zero vendor lock-in. Download your collectiveâ€™s entire voting records, audit logs, and member data in open formats anytime.'}
            </p>
          </div>
        </div>

        {/* 4. FAQs Section */}
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {isHindi ? 'à¤…à¤•à¥à¤¸à¤° à¤ªà¥‚à¤›à¥‡ à¤œà¤¾à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤ªà¥à¤°à¤¶à¥à¤¨' : 'Frequently Asked Questions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isHindi
                ? 'à¤¨à¤¾à¤—à¤°à¤¿à¤• à¤ªà¤¹à¥à¤‚à¤š, à¤¸à¥à¤µà¥ˆà¤šà¥à¤›à¤¿à¤• à¤¯à¥‹à¤—à¤¦à¤¾à¤¨ à¤”à¤° à¤¤à¤•à¤¨à¥€à¤•à¥€ à¤µà¤¾à¤¸à¥à¤¤à¥à¤•à¤²à¤¾ à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤¸à¥à¤ªà¤·à¥à¤Ÿà¥€à¤•à¤°à¤£à¥¤'
                : 'Clear explanations regarding civic access, voluntary contributions, and non-profit governance.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
