import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'अक्सर पूछे जाने वाले प्रश्न | संगठन' : 'FAQ | Sangathan',
    description: isHindi
      ? 'हमारे मिशन, सुरक्षा और संचालन के बारे में सामान्य प्रश्न।'
      : 'Common questions about our mission, security, and operations.',
  }
}

export default async function FAQPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
      </h1>
      <p className="text-xl text-gray-500 mb-12">
        {isHindi 
          ? 'हमारे मिशन, सुरक्षा और संचालन के बारे में सामान्य प्रश्न।'
          : 'Common questions about our mission, security, and operations.'}
      </p>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1">
           <AccordionTrigger className="text-lg font-medium">{isHindi ? 'क्या संगठन पूरी तरह से मुफ़्त है?' : 'Is Sangathan completely free?'}</AccordionTrigger>
           <AccordionContent className="text-gray-600 leading-relaxed">
              {isHindi
                ? 'हाँ। मुख्य बुनियादी ढांचा- सदस्यों, फॉर्म, बैठकों का प्रबंधन और दान लॉगिंग- सभी संगठनों के लिए मुफ़्त है। हम प्रति उपयोगकर्ता शुल्क नहीं लेते हैं। हम उन संगठनों से वैकल्पिक "समर्थक सदस्यता" के माध्यम से प्लेटफ़ॉर्म को बनाए रखते हैं जो योगदान दे सकते हैं।'
                : 'Yes. The core infrastructure—managing members, forms, meetings, and logging donations—is free for all organisations. We do not charge per user. We sustain the platform through optional "Supporter Subscriptions" from organisations that can afford to contribute.'}
           </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
           <AccordionTrigger className="text-lg font-medium">{isHindi ? 'क्या संगठन राजनीतिक है?' : 'Is Sangathan political?'}</AccordionTrigger>
           <AccordionContent className="text-gray-600 leading-relaxed">
              {isHindi
                ? 'संगठन राजनीतिक रूप से तटस्थ बुनियादी ढांचा है। हम शासन के लिए उपकरण प्रदान करते हैं, लेकिन हम किसी विशिष्ट राजनीतिक दल या विचारधारा का समर्थन नहीं करते हैं। हमारे मंच का उपयोग विविध प्रकार के छात्र संघों, एनजीओ और सामुदायिक समूहों द्वारा किया जाता है।'
                : 'Sangathan is politically neutral infrastructure. We provide the tools for governance, but we do not endorse any specific political party or ideology. Our platform is used by a diverse range of student unions, NGOs, and community collectives.'}
           </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
           <AccordionTrigger className="text-lg font-medium">{isHindi ? 'क्या मेरा डेटा सरकार से सुरक्षित है?' : 'Is my data safe from the government?'}</AccordionTrigger>
           <AccordionContent className="text-gray-600 leading-relaxed">
              {isHindi
                ? 'हम उद्योग-मानक एन्क्रिप्शन और एक्सेस नियंत्रण का उपयोग करते हैं। हालाँकि, भारत में कार्यरत एक इकाई के रूप में, हमें सूचना प्रौद्योगिकी अधिनियम, 2000 के तहत वैध कानूनी आदेशों का पालन करना आवश्यक है। हम ऐसे किसी भी अनुरोध के संबंध में पारदर्शिता रिपोर्ट प्रकाशित करते हैं। हम किसी भी एजेंसी को "बैकडोर" पहुंच प्रदान नहीं करते हैं।'
                : 'We use industry-standard encryption and access controls. However, as an entity operating in India, we are required to comply with valid legal orders under the Information Technology Act, 2000. We publish a Transparency Report regarding any such requests. We do not provide "backdoor" access to any agency.'}
           </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
           <AccordionTrigger className="text-lg font-medium">{isHindi ? 'आपको व्यवस्थापकों के लिए फोन सत्यापन की आवश्यकता क्यों है?' : 'Why do you require phone verification for admins?'}</AccordionTrigger>
           <AccordionContent className="text-gray-600 leading-relaxed">
              {isHindi
                ? 'दुरुपयोग को रोकने के लिए। संगठन बनाने वाले व्यक्ति की पहचान सत्यापित करके, हम स्पैमर्स, स्कैमर्स और बुरे अभिनेताओं को रोकते हैं। यह सभी के लिए एक सुरक्षित पारिस्थितिकी तंत्र बनाता है। हम इस फोन नंबर का उपयोग मार्केटिंग के लिए नहीं करते हैं।'
                : 'To prevent abuse. By verifying the identity of the person creating an organisation, we deter spammers, scammers, and bad actors. This creates a safer ecosystem for everyone. We do not use this phone number for marketing.'}
           </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
           <AccordionTrigger className="text-lg font-medium">{isHindi ? 'यदि प्लेटफ़ॉर्म बंद हो जाता है तो क्या होगा?' : 'What happens if the platform shuts down?'}</AccordionTrigger>
           <AccordionContent className="text-gray-600 leading-relaxed">
              {isHindi
                ? 'हम लंबी उम्र के लिए बने हैं। हालाँकि, बंद होने की संभावना नहीं होने पर, हम कम से कम 90 दिनों का नोटिस और पूर्ण डेटा निर्यात उपकरण प्रदान करने के लिए प्रतिबद्ध हैं ताकि आप अपने रिकॉर्ड को किसी अन्य सिस्टम में माइग्रेट कर सकें।'
                : 'We are built for longevity. However, in the unlikely event of a shutdown, we are committed to providing at least 90 days notice and full data export tools so you can migrate your records to another system.'}
           </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
           <AccordionTrigger className="text-lg font-medium">{isHindi ? 'क्या मैं अपना डेटा स्थायी रूप से हटा सकता हूँ?' : 'Can I delete my data permanently?'}</AccordionTrigger>
           <AccordionContent className="text-gray-600 leading-relaxed">
              {isHindi
                ? 'हाँ। आप किसी भी समय अपना खाता या संगठन हटाने का अनुरोध कर सकते हैं। 14-दिवसीय सुरक्षा छूट अवधि (आकस्मिक हानि को रोकने के लिए) के बाद, आपका डेटा हमारे सक्रिय सर्वर से स्थायी रूप से मिटा दिया जाता है।'
                : 'Yes. You can request deletion of your account or organisation at any time. After a 14-day safety grace period (to prevent accidental loss), your data is permanently wiped from our active servers.'}
           </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
