import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Sangathan',
  description: 'How we collect, use, and protect your data.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function PrivacyPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  if (isHindi) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-orange">
        <h1>गोपनीयता नीति</h1>
        <p className="text-gray-500 font-medium">अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN')}</p>
        
        <p>
          संगठन में, हम मानते हैं कि गोपनीयता एक मौलिक अधिकार है। हम पारदर्शिता और डेटा न्यूनीकरण के लिए प्रतिबद्ध हैं।
          यह गोपनीयता नीति बताती है कि हम आपकी जानकारी को कैसे संभालते हैं।
        </p>

        <h2>1. जानकारी जो हम एकत्र करते हैं</h2>
        <p>हम अपनी सेवाएं प्रदान करने के लिए केवल न्यूनतम आवश्यक डेटा एकत्र करते हैं:</p>
        <ul>
          <li><strong>खाता जानकारी:</strong> नाम, ईमेल पता, फोन नंबर (वैकल्पिक)।</li>
          <li><strong>संगठन डेटा:</strong> संगठन का नाम, स्लग, और सदस्य रिकॉर्ड जो आप अपलोड करते हैं।</li>
          <li><strong>उपयोग लॉग:</strong> डैशबोर्ड के भीतर की गई कार्रवाइयों के ऑडिट लॉग (जैसे, "उपयोगकर्ता X ने एक फॉर्म बनाया")।</li>
          <li><strong>तकनीकी डेटा:</strong> आईपी पता, ब्राउज़र प्रकार, और भाषा वरीयता कुकीज़।</li>
        </ul>

        <h2>2. हम क्या एकत्र नहीं करते हैं</h2>
        <ul>
          <li>हम आपके क्रेडिट कार्ड या बैंकिंग जानकारी को एकत्र या संग्रहीत <strong>नहीं</strong> करते हैं। सभी भुगतान रेज़रपे द्वारा संभाले जाते हैं।</li>
          <li>हम आपके निजी बैठक के नोट्स की सामग्री को <strong>नहीं</strong> पढ़ते हैं, जब तक कि कानून द्वारा आवश्यक न हो या आपकी स्पष्ट अनुमति के साथ डिबगिंग के लिए न हो।</li>
        </ul>

        <h2>3. हम आपके डेटा का उपयोग कैसे करते हैं</h2>
        <ul>
          <li>प्लेटफ़ॉर्म प्रदान करने और बनाए रखने के लिए।</li>
          <li>आपकी पहचान सत्यापित करने और धोखाधड़ी को रोकने के लिए।</li>
          <li>अपडेट, सुरक्षा अलर्ट और समर्थन के संबंध में आपसे संवाद करने के लिए।</li>
          <li>हमारी सेवा की शर्तों को लागू करने के लिए।</li>
        </ul>
        <p><strong>हम विज्ञापनदाताओं या तृतीय पक्षों को आपका डेटा नहीं बेचते हैं।</strong></p>

        <h2>4. डेटा भंडारण और सुरक्षा</h2>
        <p>
          आपका डेटा <strong>सुपाबेस</strong>, एक उद्यम-ग्रेड डेटाबेस प्रदाता का उपयोग करके सुरक्षित रूप से संग्रहीत किया जाता है।
        </p>
        <ul>
          <li><strong>एन्क्रिप्शन:</strong> डेटा ट्रांजिट (SSL/TLS) और आराम पर एन्क्रिप्ट किया गया है।</li>
          <li><strong>अलगाव:</strong> हम यह सुनिश्चित करने के लिए पंक्ति स्तर की सुरक्षा (RLS) का उपयोग करते हैं कि आपके संगठन का डेटा अन्य किरायेदारों से सख्ती से अलग है।</li>
          <li><strong>एक्सेस कंट्रोल:</strong> केवल अधिकृत कर्मियों को ही आंतरिक प्रणालियों तक पहुंच की आवश्यकता है।</li>
        </ul>

        <h2>5. कुकीज़ और ट्रैकिंग</h2>
        <p>
          हम केवल आवश्यक कुकीज़ का उपयोग करते हैं:
        </p>
        <ul>
          <li><strong>सत्र कुकीज़:</strong> आपको लॉग इन रखने के लिए।</li>
          <li><strong>वरीयता कुकीज़:</strong> आपकी भाषा चयन (अंग्रेजी/हिंदी) को संग्रहीत करने के लिए।</li>
        </ul>
        <p>हम तृतीय-पक्ष ट्रैकिंग पिक्सेल या आक्रामक विज्ञापन-तकनीक कुकीज़ का उपयोग नहीं करते हैं।</p>

        <h2>6. तृतीय-पक्ष सेवाएं</h2>
        <p>हम विश्वसनीय तृतीय-पक्ष प्रदाताओं पर भरोसा करते हैं:</p>
        <ul>
          <li><strong>सुपाबेस:</strong> डेटाबेस और प्रमाणीकरण।</li>
          <li><strong>रेज़रपे:</strong> समर्थक योजना के लिए भुगतान प्रसंस्करण।</li>
          <li><strong>वरसेल:</strong> होस्टिंग और बुनियादी ढांचा।</li>
        </ul>

        <h2>7. डेटा प्रतिधारण</h2>
        <p>
          जब तक आपका खाता सक्रिय है, हम आपके डेटा को बनाए रखते हैं। 
          यदि आप अपना खाता हटाते हैं, तो कानूनी अनुपालन के लिए बनाए गए ऑडिट लॉग को छोड़कर, 30 दिनों के भीतर आपके डेटा को हमारे सक्रिय डेटाबेस से स्थायी रूप से हटा दिया जाएगा।
        </p>

        <h2>8. आपके अधिकार</h2>
        <p>
          डिजिटल पर्सनल डेटा प्रोटेक्शन एक्ट, 2023 (भारत) के तहत, आपको निम्नलिखित अधिकार हैं:
        </p>
        <ul>
          <li>आपके बारे में हमारे पास मौजूद व्यक्तिगत डेटा तक पहुंचना।</li>
          <li>अपने डेटा में अशुद्धियों को सुधारना।</li>
          <li>अपने डेटा को मिटाने का अनुरोध करना (भूल जाने का अधिकार)।</li>
          <li>डेटा प्रोसेसिंग के लिए सहमति वापस लेना।</li>
        </ul>

        <h2>9. हमसे संपर्क करें</h2>
        <p>
          यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न हैं या अपने अधिकारों का उपयोग करना चाहते हैं, तो कृपया हमारे डेटा सुरक्षा अधिकारी से संपर्क करें:
        </p>
        <p>
          <strong>ईमेल:</strong> privacy@sangathan.app<br />
          <strong>पता:</strong> बहुजन क्वीर फाउंडेशन, नई दिल्ली, भारत।
        </p>

        <hr className="my-8" />
        <p className="text-sm text-gray-500 italic">
          <strong>Note:</strong> In case of any inconsistency between the Hindi and English versions, the English version shall prevail.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-orange">
      <h1>Privacy Policy</h1>
      <p className="text-gray-500 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <p>
        At Sangathan, we believe privacy is a fundamental right. We are committed to transparency and data minimization.
        This Privacy Policy explains how we handle your information.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect only the minimum data necessary to provide our services:</p>
      <ul>
        <li><strong>Account Information:</strong> Name, Email address, Phone number (optional).</li>
        <li><strong>Organisation Data:</strong> Organisation name, slug, and member records you upload.</li>
        <li><strong>Usage Logs:</strong> Audit logs of actions taken within the dashboard (e.g., "User X created a form").</li>
        <li><strong>Technical Data:</strong> IP address, browser type, and language preference cookies.</li>
      </ul>

      <h2>2. What We Do NOT Collect</h2>
      <ul>
        <li>We do <strong>not</strong> collect or store your credit card or banking information. All payments are handled by Razorpay.</li>
        <li>We do <strong>not</strong> read the content of your private meeting notes unless required by law or for debugging with your explicit permission.</li>
      </ul>

      <h2>3. How We Use Your Data</h2>
      <ul>
        <li>To provide and maintain the Platform.</li>
        <li>To verify your identity and prevent fraud.</li>
        <li>To communicate with you regarding updates, security alerts, and support.</li>
        <li>To enforce our Terms of Service.</li>
      </ul>
      <p><strong>We do NOT sell your data to advertisers or third parties.</strong></p>

      <h2>4. Data Storage & Security</h2>
      <p>
        Your data is stored securely using <strong>Supabase</strong>, an enterprise-grade database provider.
      </p>
      <ul>
        <li><strong>Encryption:</strong> Data is encrypted in transit (SSL/TLS) and at rest.</li>
        <li><strong>Isolation:</strong> We use Row Level Security (RLS) to ensure that your Organisation's data is strictly isolated from other tenants.</li>
        <li><strong>Access Control:</strong> Only authorized personnel with a need-to-know basis have access to internal systems.</li>
      </ul>

      <h2>5. Cookies & Tracking</h2>
      <p>
        We use essential cookies only:
      </p>
      <ul>
        <li><strong>Session Cookies:</strong> To keep you logged in.</li>
        <li><strong>Preference Cookies:</strong> To store your language selection (English/Hindi).</li>
      </ul>
      <p>We do not use third-party tracking pixels or invasive ad-tech cookies.</p>

      <h2>6. Third-Party Services</h2>
      <p>We rely on trusted third-party providers:</p>
      <ul>
        <li><strong>Supabase:</strong> Database and Authentication.</li>
        <li><strong>Razorpay:</strong> Payment processing for the Supporter Plan.</li>
        <li><strong>Vercel:</strong> Hosting and infrastructure.</li>
      </ul>

      <h2>7. Data Retention</h2>
      <p>
        We retain your data as long as your account is active. 
        If you delete your account, your data will be permanently deleted from our active database within 30 days, 
        except for audit logs retained for legal compliance.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Under the Digital Personal Data Protection Act, 2023 (India), you have the right to:
      </p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Correct inaccuracies in your data.</li>
        <li>Request erasure of your data (Right to be Forgotten).</li>
        <li>Withdraw consent for data processing.</li>
      </ul>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or wish to exercise your rights, please contact our Data Protection Officer at:
      </p>
      <p>
        <strong>Email:</strong> privacy@sangathan.app<br />
        <strong>Address:</strong> Bahujan Queer Foundation, New Delhi, India.
      </p>
    </div>
  )
}
