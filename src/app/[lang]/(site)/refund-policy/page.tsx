import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy - Sangathan',
  description: 'Policy regarding the Supporter Plan subscription refunds.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function RefundPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  if (isHindi) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-orange">
        <h1>वापसी नीति</h1>
        <p className="text-gray-500 font-medium">अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN')}</p>
        
        <p>
          हमारी वैकल्पिक समर्थक योजना के माध्यम से संगठन का समर्थन करने के लिए धन्यवाद। 
          यह नीति धनवापसी और रद्दीकरण के संबंध में शर्तों को रेखांकित करती है।
        </p>

        <h2>1. सदस्यता की प्रकृति</h2>
        <p>
          "समर्थक योजना" (₹99/माह) संगठन प्लेटफ़ॉर्म के रखरखाव और विकास का समर्थन करने के लिए एक <strong>स्वैच्छिक योगदान</strong> है।
        </p>
        <ul>
          <li>यह किसी भी महत्वपूर्ण सुविधा को अनलॉक <strong>नहीं</strong> करता है। मुख्य प्लेटफ़ॉर्म सभी उपयोगकर्ताओं के लिए मुफ़्त रहता है।</li>
          <li>यह "समर्थक बैज" प्रदान करता है और सार्वजनिक पृष्ठों से प्लेटफ़ॉर्म ब्रांडिंग को हटाने की क्षमता देता है।</li>
        </ul>

        <h2>2. धनवापसी पात्रता</h2>
        <p>
          निष्पक्षता सुनिश्चित करने के लिए हम धनवापसी अनुरोधों को मामले-दर-मामले आधार पर संभालते हैं।
        </p>
        <ul>
          <li><strong>7-दिन की गारंटी:</strong> यदि आपने गलती से सदस्यता ली है या असंतुष्ट हैं, तो आप प्रारंभिक भुगतान के <strong>7 दिनों</strong> के भीतर पूर्ण धनवापसी का अनुरोध कर सकते हैं।</li>
          <li><strong>7 दिनों के बाद:</strong> 7-दिन की विंडो बीत जाने के बाद सदस्यता आमतौर पर गैर-वापसी योग्य होती है। हालाँकि, आप किसी भी समय भविष्य की बिलिंग रद्द कर सकते हैं।</li>
        </ul>

        <h2>3. रद्दीकरण प्रक्रिया</h2>
        <p>
          आप किसी भी समय डैशबोर्ड से सीधे अपनी सदस्यता रद्द कर सकते हैं:
        </p>
        <ol>
          <li><strong>डैशबोर्ड &gt; समर्थक योजना</strong> पर जाएं।</li>
          <li>"सदस्यता प्रबंधित करें" या "रद्द करें" पर क्लिक करें।</li>
          <li>आपकी सदस्यता वर्तमान बिलिंग चक्र के अंत तक सक्रिय रहेगी, जिसके बाद आपसे दोबारा शुल्क नहीं लिया जाएगा।</li>
        </ol>

        <h2>4. धनवापसी प्रसंस्करण</h2>
        <p>
          यदि आपका धनवापसी अनुरोध स्वीकृत हो जाता है:
        </p>
        <ul>
          <li>धनवापसी को <strong>रेज़रपे</strong> के माध्यम से मूल भुगतान विधि में संसाधित किया जाएगा।</li>
          <li>कृपया राशि को आपके बैंक खाते में प्रतिबिंबित होने के लिए 5-10 व्यावसायिक दिनों की अनुमति दें।</li>
        </ul>

        <h2>5. विवेकाधीन खंड</h2>
        <p>
          संगठन धनवापसी से इनकार करने का अधिकार सुरक्षित रखता है यदि हम नीति के दुरुपयोग का पता लगाते हैं, जैसे कि बार-बार सदस्यता/रद्दीकरण चक्र या हमारी सेवा की शर्तों का उल्लंघन।
        </p>

        <h2>6. हमसे संपर्क करें</h2>
        <p>
          धनवापसी का अनुरोध करने या बिलिंग सहायता के लिए, कृपया हमें ईमेल करें:
          <br />
          <strong>ईमेल:</strong> support@sangathan.app
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
      <h1>Refund Policy</h1>
      <p className="text-gray-500 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <p>
        Thank you for choosing to support Sangathan via our optional Supporter Plan. 
        This policy outlines the terms regarding refunds and cancellations.
      </p>

      <h2>1. Nature of Subscription</h2>
      <p>
        The "Supporter Plan" (₹99/month) is a <strong>voluntary contribution</strong> to support the maintenance and development of the Sangathan platform.
      </p>
      <ul>
        <li>It does <strong>not</strong> unlock any critical features. The core platform remains free for all users.</li>
        <li>It provides a "Supporter Badge" and the ability to remove platform branding from public pages.</li>
      </ul>

      <h2>2. Refund Eligibility</h2>
      <p>
        We handle refund requests on a case-by-case basis to ensure fairness.
      </p>
      <ul>
        <li><strong>7-Day Guarantee:</strong> If you subscribed by mistake or are unsatisfied, you may request a full refund within <strong>7 days</strong> of the initial payment.</li>
        <li><strong>After 7 Days:</strong> Subscriptions are generally non-refundable once the 7-day window has passed. However, you can cancel future billing at any time.</li>
      </ul>

      <h2>3. Cancellation Process</h2>
      <p>
        You can cancel your subscription at any time directly from the Dashboard:
      </p>
      <ol>
        <li>Go to <strong>Dashboard &gt; Supporter Plan</strong>.</li>
        <li>Click "Manage Subscription" or "Cancel".</li>
        <li>Your subscription will remain active until the end of the current billing cycle, after which you will not be charged again.</li>
      </ol>

      <h2>4. Processing Refunds</h2>
      <p>
        If your refund request is approved:
      </p>
      <ul>
        <li>Refunds will be processed to the original payment method via <strong>Razorpay</strong>.</li>
        <li>Please allow 5-10 business days for the amount to reflect in your bank account.</li>
      </ul>

      <h2>5. Discretionary Clause</h2>
      <p>
        Sangathan reserves the right to refuse refunds if we detect abuse of the policy, such as repeated subscription/cancellation cycles or violation of our Terms of Service.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        To request a refund or for billing support, please email us at:
        <br />
        <strong>Email:</strong> support@sangathan.app
      </p>
    </div>
  )
}
