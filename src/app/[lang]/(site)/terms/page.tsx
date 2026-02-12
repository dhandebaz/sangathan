import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Sangathan',
  description: 'Rules governing the use of the Sangathan platform.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function TermsPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  if (isHindi) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-orange">
        <h1>सेवा की शर्तें</h1>
        <p className="text-gray-500 font-medium">अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN')}</p>
        
        <p>
          संगठन ("प्लेटफ़ॉर्म") में आपका स्वागत है। ये सेवा की शर्तें ("शर्तें") हमारी वेबसाइट, एप्लिकेशन और सेवाओं के आपके उपयोग को नियंत्रित करती हैं। 
          संगठन तक पहुंच कर या उसका उपयोग करके, आप इन शर्तों से बंधे होने के लिए सहमत हैं।
        </p>

        <h2>1. परिचय</h2>
        <p>
          संगठन <strong>बहुजन क्वीर फाउंडेशन</strong> ("हम", "हमें", या "हमारा") की एक पहल है, जो भारत में स्थित एक गैर-लाभकारी संस्था है। 
          यह प्लेटफ़ॉर्म जमीनी संगठनों को सदस्यों, बैठकों और रिकॉर्ड के प्रबंधन के लिए डिजिटल बुनियादी ढांचा प्रदान करता है।
        </p>

        <h2>2. परिभाषाएँ</h2>
        <ul>
          <li><strong>"उपयोगकर्ता"</strong> का अर्थ है कोई भी व्यक्ति जो खाता बनाता है या प्लेटफ़ॉर्म तक पहुंचता है।</li>
          <li><strong>"संगठन"</strong> का अर्थ है प्लेटफ़ॉर्म पर उपयोगकर्ता द्वारा बनाई गई सामूहिक इकाई।</li>
          <li><strong>"सदस्य डेटा"</strong> का अर्थ है किसी संगठन द्वारा अपने सदस्यों के बारे में अपलोड की गई जानकारी।</li>
          <li><strong>"समर्थक योजना"</strong> का अर्थ है वैकल्पिक सशुल्क सदस्यता सेवा।</li>
        </ul>

        <h2>3. पात्रता और खाता निर्माण</h2>
        <p>
          इस प्लेटफ़ॉर्म का उपयोग करने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए। आप पंजीकरण के दौरान सटीक, वर्तमान और पूर्ण जानकारी प्रदान करने के लिए सहमत हैं। 
          आप अपने खाते के क्रेडेंशियल की गोपनीयता बनाए रखने के लिए जिम्मेदार हैं।
        </p>

        <h2>4. प्लेटफ़ॉर्म की भूमिका और सीमाएँ</h2>
        <p>
          संगठन विशुद्ध रूप से एक तकनीकी बुनियादी ढांचा प्रदाता है।
        </p>
        <ul>
          <li>हम आपके संगठन के लिए सीधे भुगतान संसाधित <strong>नहीं</strong> करते हैं। "दान" मॉड्यूल सख्ती से आपके अपने रिकॉर्ड रखने के लिए एक मैनुअल बहीखाता है।</li>
          <li>हम हमारे प्लेटफ़ॉर्म का उपयोग करने वाले किसी भी संगठन की वैधता को सत्यापित <strong>नहीं</strong> करते हैं।</li>
          <li>हम किसी भी संगठन द्वारा धन, डेटा या अधिकार के किसी भी दुरुपयोग के लिए जिम्मेदार <strong>नहीं</strong> हैं।</li>
        </ul>

        <h2>5. उपयोगकर्ता और संगठन की जिम्मेदारियां</h2>
        <p>
          संगठन पूरी तरह से इसके लिए जिम्मेदार हैं:
        </p>
        <ul>
          <li>डेटा अपलोड करने से पहले अपने सदस्यों से आवश्यक सहमति प्राप्त करना।</li>
          <li>डिजिटल पर्सनल डेटा प्रोटेक्शन एक्ट, 2023 (DPDP एक्ट) सहित सभी लागू कानूनों का अनुपालन करना।</li>
          <li>अपने वित्तीय बहीखातों की सटीकता सुनिश्चित करना।</li>
        </ul>

        <h2>6. डेटा स्वामित्व</h2>
        <p>
          आप अपने डेटा के मालिक हैं। हम आपके द्वारा अपलोड किए गए सदस्य डेटा या रिकॉर्ड पर किसी भी बौद्धिक संपदा अधिकार का दावा नहीं करते हैं। 
          हम डेटा प्रोसेसर के रूप में कार्य करते हैं, आपकी जानकारी को आपकी ओर से सुरक्षित रूप से संग्रहीत करते हैं।
        </p>

        <h2>7. समर्थक सदस्यता</h2>
        <p>
          "समर्थक योजना" ₹99/माह की एक वैकल्पिक, स्वैच्छिक सदस्यता है।
        </p>
        <ul>
          <li>भुगतान <strong>रेज़रपे</strong>, एक तृतीय-पक्ष भुगतान गेटवे द्वारा संसाधित किए जाते हैं।</li>
          <li>सदस्यता छिपी हुई सुविधाओं को अनलॉक नहीं करती है; यह मुख्य रूप से प्लेटफ़ॉर्म के रखरखाव की लागत का समर्थन करती है।</li>
          <li>हम आपके क्रेडिट कार्ड या बैंकिंग विवरण संग्रहीत नहीं करते हैं।</li>
        </ul>

        <h2>8. स्वीकार्य उपयोग</h2>
        <p>
          आप निम्नलिखित के लिए प्लेटफ़ॉर्म का उपयोग नहीं करने के लिए सहमत हैं:
        </p>
        <ul>
          <li>भारतीय कानून के तहत अवैध गतिविधियाँ।</li>
          <li>अभद्र भाषा, हिंसा को उकसाना, या उत्पीड़न।</li>
          <li>धोखाधड़ी से धन जुटाना या वित्तीय घोटाले।</li>
          <li>मैलवेयर वितरित करना या प्लेटफ़ॉर्म की सुरक्षा से समझौता करने का प्रयास करना।</li>
        </ul>
        <p>इन नियमों के उल्लंघन के परिणामस्वरूप आपके खाते को तत्काल निलंबित या समाप्त कर दिया जाएगा।</p>

        <h2>9. दायित्व की सीमा</h2>
        <p>
          कानून द्वारा अनुमति दी गई पूर्ण सीमा तक, संगठन और बहुजन क्वीर फाउंडेशन किसी भी अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी, या दंडात्मक क्षति के लिए उत्तरदायी नहीं होंगे, जिसमें लाभ, डेटा, या सद्भावना की हानि शामिल है, जो आपके प्लेटफ़ॉर्म के उपयोग से उत्पन्न होती है।
        </p>

        <h2>10. शासी कानून और विवाद समाधान</h2>
        <p>
          ये शर्तें भारत के कानूनों द्वारा शासित और उनके अनुसार होंगी। 
          इन शर्तों से उत्पन्न होने वाले किसी भी विवाद को विशेष रूप से नई दिल्ली, भारत में स्थित अदालतों के अधिकार क्षेत्र के अधीन किया जाएगा।
        </p>

        <h2>11. संपर्क जानकारी</h2>
        <p>
          कानूनी पूछताछ के लिए, कृपया हमसे संपर्क करें:<br />
          <strong>ईमेल:</strong> legal@sangathan.app<br />
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
      <h1>Terms of Service</h1>
      <p className="text-gray-500 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <p>
        Welcome to Sangathan ("Platform"). These Terms of Service ("Terms") govern your use of our website, application, and services. 
        By accessing or using Sangathan, you agree to be bound by these Terms.
      </p>

      <h2>1. Introduction</h2>
      <p>
        Sangathan is an initiative by the <strong>Bahujan Queer Foundation</strong> ("we", "us", or "our"), a non-profit entity based in India. 
        The Platform provides digital infrastructure for grassroots organisations to manage members, meetings, and records.
      </p>

      <h2>2. Definitions</h2>
      <ul>
        <li><strong>"User"</strong> means any individual who creates an account or accesses the Platform.</li>
        <li><strong>"Organisation"</strong> means the collective entity created by a User on the Platform.</li>
        <li><strong>"Member Data"</strong> means the information uploaded by an Organisation regarding its members.</li>
        <li><strong>"Supporter Plan"</strong> means the optional paid subscription service.</li>
      </ul>

      <h2>3. Eligibility & Account Creation</h2>
      <p>
        You must be at least 18 years old to use this Platform. You agree to provide accurate, current, and complete information during registration. 
        You are responsible for maintaining the confidentiality of your account credentials.
      </p>

      <h2>4. Platform Role & Limitations</h2>
      <p>
        Sangathan is purely a technology infrastructure provider.
      </p>
      <ul>
        <li>We do <strong>not</strong> process payments directly for your Organisation. The "Donations" module is strictly a manual ledger for your own record-keeping.</li>
        <li>We do <strong>not</strong> verify the legitimacy of any Organisation using our Platform.</li>
        <li>We are <strong>not</strong> responsible for any misuse of funds, data, or authority by any Organisation.</li>
      </ul>

      <h2>5. User & Organisation Responsibilities</h2>
      <p>
        Organisations are solely responsible for:
      </p>
      <ul>
        <li>Obtaining necessary consent from their members before uploading data.</li>
        <li>Complying with all applicable laws, including the Digital Personal Data Protection Act, 2023 (DPDP Act).</li>
        <li>Ensuring the accuracy of their financial ledgers.</li>
      </ul>

      <h2>6. Data Ownership</h2>
      <p>
        You own your data. We claim no intellectual property rights over the Member Data or records you upload. 
        We act as a data processor, storing your information securely on your behalf.
      </p>

      <h2>7. Supporter Subscription</h2>
      <p>
        The "Supporter Plan" is an optional, voluntary subscription of ₹99/month.
      </p>
      <ul>
        <li>Payments are processed by <strong>Razorpay</strong>, a third-party payment gateway.</li>
        <li>Subscription does not unlock hidden features; it primarily supports the Platform's maintenance costs.</li>
        <li>We do not store your credit card or banking details.</li>
      </ul>

      <h2>8. Acceptable Usage</h2>
      <p>
        You agree not to use the Platform for:
      </p>
      <ul>
        <li>Illegal activities under Indian law.</li>
        <li>Hate speech, incitement to violence, or harassment.</li>
        <li>Fraudulent fundraising or financial scams.</li>
        <li>Distributing malware or attempting to compromise the Platform's security.</li>
      </ul>
      <p>Violation of these rules will result in immediate suspension or termination of your account.</p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Sangathan and the Bahujan Queer Foundation shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Platform.
      </p>

      <h2>10. Governing Law & Dispute Resolution</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of India. 
        Any disputes arising out of these Terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
      </p>

      <h2>11. Contact Information</h2>
      <p>
        For legal inquiries, please contact us at:<br />
        <strong>Email:</strong> legal@sangathan.app<br />
        <strong>Address:</strong> Bahujan Queer Foundation, New Delhi, India.
      </p>
    </div>
  )
}
