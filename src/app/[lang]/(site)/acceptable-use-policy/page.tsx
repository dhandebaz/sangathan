import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy - Sangathan',
  description: 'Standards for using the Sangathan platform safely and responsibly.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function AcceptableUsePage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  if (isHindi) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-orange">
        <h1>स्वीकार्य उपयोग नीति</h1>
        <p className="text-gray-500 font-medium">अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN')}</p>
        
        <p>
          संगठन को समुदायों को सशक्त बनाने के लिए बनाया गया है। सभी उपयोगकर्ताओं के लिए सुरक्षित वातावरण सुनिश्चित करने के लिए, हमने यह स्वीकार्य उपयोग नीति (AUP) स्थापित की है। 
          हमारे प्लेटफ़ॉर्म का उपयोग करके, आप इन दिशानिर्देशों का पालन करने के लिए सहमत हैं।
        </p>

        <h2>1. निषिद्ध गतिविधियाँ</h2>
        <p>आप संगठन का उपयोग निम्नलिखित के लिए नहीं कर सकते हैं:</p>
        
        <h3>अवैध और हानिकारक कृत्य</h3>
        <ul>
          <li>भारत के किसी भी स्थानीय, राज्य या राष्ट्रीय कानूनों का उल्लंघन करना।</li>
          <li>हिंसा, आतंकवाद या अवैध कृत्यों को बढ़ावा देना या उकसाना।</li>
          <li>बाल यौन शोषण सामग्री (CSAM) या गैर-सहमति वाली यौन सामग्री वितरित करना।</li>
          <li>मानव तस्करी या शोषण में शामिल होना।</li>
        </ul>

        <h3>धोखाधड़ी और धोखा</h3>
        <ul>
          <li>किसी व्यक्ति या संस्था का रूप धारण करना।</li>
          <li>धोखाधड़ी से धन जुटाने की योजनाएँ या वित्तीय घोटाले चलाना।</li>
          <li>जनता को गुमराह करने के लिए फर्जी संगठन बनाना।</li>
        </ul>

        <h3>उत्पीड़न और अभद्र भाषा</h3>
        <ul>
          <li>व्यक्तियों को डराना, परेशान करना या धमकाना।</li>
          <li>नस्ल, जाति, धर्म, लिंग, यौन अभिविन्यास या विकलांगता के आधार पर भेदभाव या नफरत को बढ़ावा देना।</li>
        </ul>

        <h3>तकनीकी दुरुपयोग</h3>
        <ul>
          <li>मैलवेयर, वायरस या हानिकारक कोड वितरित करना।</li>
          <li>अन्य संगठनों के डेटा तक पहुँचने का प्रयास करना (किरायेदार अलगाव को तोड़ना)।</li>
          <li>प्लेटफ़ॉर्म के खिलाफ सेवा से इनकार (DoS) हमले शुरू करना।</li>
          <li>खाते बनाने या फॉर्म जमा करने (स्पैम) के लिए बॉट्स या स्वचालित स्क्रिप्ट का उपयोग करना।</li>
          <li>प्लेटफ़ॉर्म के स्रोत कोड को रिवर्स इंजीनियर या कॉपी करने का प्रयास करना।</li>
        </ul>

        <h2>2. सामग्री मानक</h2>
        <p>
          संगठन उनके द्वारा पोस्ट की गई सामग्री (जैसे, फॉर्म या मीटिंग नोट्स में) के लिए जिम्मेदार हैं। 
          हम उस सामग्री को हटाने का अधिकार सुरक्षित रखते हैं जो इस नीति का उल्लंघन करती है।
        </p>

        <h2>3. प्रवर्तन</h2>
        <p>
          हम उल्लंघनों को गंभीरता से लेते हैं। यदि हम यह निर्धारित करते हैं कि आपने इस AUP का उल्लंघन किया है, तो हम निम्नलिखित कार्रवाई कर सकते हैं:
        </p>
        <ul>
          <li><strong>चेतावनी:</strong> संगठन व्यवस्थापक को औपचारिक चेतावनी जारी करना।</li>
          <li><strong>सामग्री हटाना:</strong> आपत्तिजनक सामग्री को हटाना।</li>
          <li><strong>निलंबन:</strong> अपने खाते या संगठन को अस्थायी रूप से अक्षम करना।</li>
          <li><strong>समाप्ति:</strong> अपने खाते को स्थायी रूप से प्रतिबंधित करना और अपना डेटा हटाना।</li>
          <li><strong>कानूनी कार्रवाई:</strong> कानून प्रवर्तन अधिकारियों को गंभीर उल्लंघनों की रिपोर्ट करना।</li>
        </ul>

        <h2>4. उल्लंघनों की रिपोर्ट करना</h2>
        <p>
          यदि आप हमारे प्लेटफ़ॉर्म पर इस नीति के किसी भी उल्लंघन को देखते हैं, तो कृपया इसकी तुरंत रिपोर्ट करें:
          <br />
          <strong>ईमेल:</strong> safety@sangathan.app
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
      <h1>Acceptable Use Policy</h1>
      <p className="text-gray-500 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <p>
        Sangathan is built to empower communities. To ensure a safe environment for all users, we have established this Acceptable Use Policy (AUP). 
        By using our Platform, you agree to comply with these guidelines.
      </p>

      <h2>1. Prohibited Activities</h2>
      <p>You may not use Sangathan to:</p>
      
      <h3>Illegal & Harmful Acts</h3>
      <ul>
        <li>Violate any local, state, or national laws of India.</li>
        <li>Promote or incite violence, terrorism, or illegal acts.</li>
        <li>Distribute child sexual abuse material (CSAM) or non-consensual sexual content.</li>
        <li>Engage in human trafficking or exploitation.</li>
      </ul>

      <h3>Fraud & Deception</h3>
      <ul>
        <li>Impersonate any person or entity.</li>
        <li>Run fraudulent fundraising schemes or financial scams.</li>
        <li>Create fake organisations to mislead the public.</li>
      </ul>

      <h3>Harassment & Hate Speech</h3>
      <ul>
        <li>Bully, harass, or threaten individuals.</li>
        <li>Promote discrimination or hatred based on race, caste, religion, gender, sexual orientation, or disability.</li>
      </ul>

      <h3>Technical Abuse</h3>
      <ul>
        <li>Distribute malware, viruses, or harmful code.</li>
        <li>Attempt to access data of other Organisations (breaking tenant isolation).</li>
        <li>Launch Denial of Service (DoS) attacks against the Platform.</li>
        <li>Use bots or automated scripts to create accounts or submit forms (spam).</li>
        <li>Reverse engineer or attempt to copy the Platform's source code.</li>
      </ul>

      <h2>2. Content Standards</h2>
      <p>
        Organisations are responsible for the content they post (e.g., in Forms or Meeting notes). 
        We reserve the right to remove content that violates this policy.
      </p>

      <h2>3. Enforcement</h2>
      <p>
        We take violations seriously. If we determine that you have violated this AUP, we may take the following actions:
      </p>
      <ul>
        <li><strong>Warning:</strong> Issue a formal warning to the Organisation admin.</li>
        <li><strong>Content Removal:</strong> Delete the offending content.</li>
        <li><strong>Suspension:</strong> Temporarily disable your account or Organisation.</li>
        <li><strong>Termination:</strong> Permanently ban your account and delete your data.</li>
        <li><strong>Legal Action:</strong> Report severe violations to law enforcement authorities.</li>
      </ul>

      <h2>4. Reporting Violations</h2>
      <p>
        If you witness any violation of this policy on our Platform, please report it immediately to:
        <br />
        <strong>Email:</strong> safety@sangathan.app
      </p>
    </div>
  )
}
