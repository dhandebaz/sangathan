import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'ब्रांड दिशानिर्देश | संगठन' : 'Brand Guidelines | Sangathan',
    description: isHindi
      ? 'संगठन ब्रांड का सही तरीके से उपयोग कैसे करें।'
      : 'How to use the Sangathan brand correctly.',
  }
}

export default async function BrandPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'ब्रांड दिशानिर्देश' : 'Brand Guidelines'}
      </h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        {isHindi 
          ? 'संगठन ब्रांड का सही तरीके से उपयोग कैसे करें।'
          : 'How to use the Sangathan brand correctly.'}
      </p>

      <div className="prose prose-slate max-w-none text-gray-700 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'हमारा नाम' : 'Our Name'}</h2>
          <p>
            {isHindi
              ? 'हमारा नाम **संगठन** है। इसे हमेशा कैपिटल "S" के साथ लिखा जाना चाहिए।'
              : 'Our name is **Sangathan**. It should always be written with a capital "S".'}
          </p>
          <p>
            {isHindi
              ? 'कृपया उपयोग न करें: "Sangathan App", "The Sangathan", या "Sangathan.app" (जब तक कि URL का संदर्भ न हो)।'
              : 'Please do not use: "Sangathan App", "The Sangathan", or "Sangathan.app" (unless referring to the URL).'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'लोगो उपयोग' : 'Logo Usage'}</h2>
          <div className="grid md:grid-cols-2 gap-8 not-prose">
             <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 text-green-700 font-bold mb-4">
                   <Check size={20} /> {isHindi ? 'करें' : 'Do'}
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                   <li>{isHindi ? 'हल्की पृष्ठभूमि पर आधिकारिक नारंगी (#ea580c) लोगो का उपयोग करें।' : 'Use the official orange (#ea580c) logo on light backgrounds.'}</li>
                   <li>{isHindi ? 'अंधेरे पृष्ठभूमि पर सफेद लोगो का उपयोग करें।' : 'Use the white logo on dark backgrounds.'}</li>
                   <li>{isHindi ? 'लोगो के चारों ओर स्पष्ट जगह बनाए रखें।' : 'Maintain clear space around the logo.'}</li>
                </ul>
             </div>
             <div className="p-6 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                   <X size={20} /> {isHindi ? 'न करें' : "Don't"}
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                   <li>{isHindi ? 'लोगो को घुमाएं, फैलाएं या विकृत न करें।' : 'Do not rotate, stretch, or distort the logo.'}</li>
                   <li>{isHindi ? 'लोगो का रंग न बदलें।' : 'Do not change the logo color.'}</li>
                   <li>{isHindi ? 'अपने राजनीतिक कारण के समर्थन को इंगित करने के लिए लोगो का उपयोग न करें।' : 'Do not use the logo to imply endorsement of your political cause.'}</li>
                </ul>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'तटस्थता नीति' : 'Neutrality Policy'}</h2>
          <p>
            {isHindi
              ? 'अपनी सामग्री में संगठन ब्रांड का उपयोग करते समय, आपको यह नहीं कहना चाहिए कि संगठन आपके विशिष्ट संगठन या कारण का समर्थन करता है।'
              : 'When using the Sangathan brand in your materials, you must not imply that Sangathan endorses your specific organization or cause.'}
          </p>
          <p className="text-sm bg-gray-100 p-4 rounded-lg border border-gray-200 font-mono">
             "Powered by Sangathan" - <span className="text-green-600">{isHindi ? 'अनुमति है' : 'Allowed'}</span><br/>
             "Partnered with Sangathan" - <span className="text-red-600">{isHindi ? 'अनुमति नहीं है (बिना अनुमति के)' : 'Not Allowed (without permission)'}</span>
          </p>
        </section>
      </div>
    </div>
  )
}
