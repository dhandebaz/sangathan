import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Metadata } from 'next'
import { PageHeader } from '@/components/public/page-header'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'अक्सर पूछे जाने वाले प्रश्न | संगठन' : 'FAQ | Sangathan',
    description: isHindi
      ? 'हमारे मिशन, सुरक्षा, डेटा संप्रभुता और संचालन के बारे में स्पष्ट उत्तर।'
      : 'Common questions about our mission, security, data sovereignty, and operations.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/faq`,
      languages: {
        en: 'https://sangathan.space/en/faq',
        hi: 'https://sangathan.space/hi/faq',
      },
    },
  }
}

export default async function FAQPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const faqItems = [
    {
      q: isHindi ? 'क्या संगठन पूरी तरह से मुफ़्त है?' : 'Is Sangathan completely free?',
      a: isHindi
        ? 'हाँ। मुख्य बुनियादी ढांचा—सदस्यों, फॉर्म, बैठकों का प्रबंधन और दान लॉगिंग—जमीनी नागरिक समूहों के लिए ₹0 हमेशा निःशुल्क है। हम प्रति उपयोगकर्ता कोई शुल्क नहीं लेते हैं।'
        : 'Yes. The core infrastructure—managing members, forms, meetings, and logging donations—is 100% free forever for grassroots civic collectives. We never charge per user.',
    },
    {
      q: isHindi ? 'क्या संगठन राजनीतिक रूप से तटस्थ है?' : 'Is Sangathan politically neutral?',
      a: isHindi
        ? 'संगठन राजनीतिक रूप से तटस्थ नागरिक अवसंरचना है। हम लोकतांत्रिक शासन के लिए उपकरण प्रदान करते हैं, लेकिन हम किसी विशिष्ट राजनीतिक दल या विचारधारा का समर्थन नहीं करते हैं।'
        : 'Sangathan is politically neutral infrastructure. We provide tools for democratic self-governance, but we do not endorse any specific political party or ideology.',
    },
    {
      q: isHindi ? 'क्या हमारा डेटा सरकार या विज्ञापनदाताओं से सुरक्षित है?' : 'Is our data secure from advertisers and surveillance?',
      a: isHindi
        ? 'हम शून्य डेटा मुद्रीकरण नीति का पालन करते हैं। कोई विज्ञापन नहीं, कोई ट्रैकिंग पिक्सेल नहीं, और कोई डेटा ब्रोकर नहीं। सभी डेटा एन्क्रिप्टेड है और आप कभी भी पूरा डेटा निर्यात कर सकते हैं।'
        : 'Strictly zero commercial monetization. We run zero ads, employ no tracking pixels, and sell no telemetry. All organization records are encrypted with 1-click full export rights.',
    },
    {
      q: isHindi ? 'व्यवस्थापकों के लिए फोन सत्यापन क्यों आवश्यक है?' : 'Why do you require phone verification for admins?',
      a: isHindi
        ? 'स्पैम और नकली खातों को रोकने के लिए व्यवस्थापक सत्यापन आवश्यक है। हम आपके फोन नंबर को किसी तीसरे पक्ष के साथ साझा या मुद्रीकृत नहीं करते हैं।'
        : 'Phone verification prevents malicious spam bots from squatting organizational namespaces. Your phone number is strictly used for authentication and never sold.',
    },
    {
      q: isHindi ? 'क्या गैर-पंजीकृत नागरिक समूह संगठन का उपयोग कर सकते हैं?' : 'Can unregistered grassroots movements use Sangathan?',
      a: isHindi
        ? 'हाँ, बिल्कुल। संगठन विशेष रूप से अनौपचारिक नागरिक समूहों, पर्यावरण शोधकर्ताओं और युवा पहलों के लिए बनाया गया है, जिन्हें किसी सरकारी पंजीकरण संख्या की आवश्यकता नहीं है।'
        : 'Yes, absolutely. Sangathan is purposely built for informal collectives, neighborhood groups, youth initiatives, and mutual-aid networks without requiring statutory registration.',
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
        { name: isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQ', url: `https://sangathan.space/${lang}/faq` },
      ]} />
      <FAQJsonLd questions={faqItems.map(f => ({ question: f.q, answer: f.a }))} />

      <PageHeader 
        title={isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
        description={isHindi 
          ? 'हमारे मिशन, डेटा संप्रभुता और संचालन के बारे में स्पष्ट उत्तर।'
          : 'Clear explanations regarding civic access, privacy, data sovereignty, and non-profit governance.'}
      />

      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border border-slate-200 rounded-xl px-5 py-2 bg-white shadow-2xs">
              <AccordionTrigger className="text-base font-bold text-slate-900 hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pt-2">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
