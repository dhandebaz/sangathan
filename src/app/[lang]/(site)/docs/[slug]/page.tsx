import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string; slug: string }>
}

const DOCS_CONTENT_EN: Record<string, { title: string; content: string }> = {
  'getting-started': {
    title: 'Getting Started with Sangathan',
    content: `
      Welcome to Sangathan, the operating system for grassroots organisations. This guide will help you set up your digital workspace in minutes.

      ### What is Sangathan?
      Sangathan is a platform designed to replace scattered WhatsApp groups and spreadsheets. It helps you manage members, donations, meetings, and forms in one secure place. It is built for NGOs, student unions, and community collectives.

      ### Creating Your Organisation
      1. Go to the signup page.
      2. Verify your email address (this is required for security).
      3. Enter your **Organisation Name** and a unique **Slug** (e.g., \`sangathan.app/org-name\`).
      4. You are now the Super Admin of your new digital workspace.

      ### Dashboard Overview
      Once logged in, you will see the main Dashboard.
      - **Sidebar**: Quick access to Members, Forms, Meetings, and Donations.
      - **Quick Stats**: Real-time count of active members and pending actions.
      - **Recent Activity**: A log of who did what in your organisation.

      ### Understanding Roles
      - **Admin**: Full control. Can manage billing, settings, and other admins.
      - **Editor**: Can add/edit members, forms, and meetings. Cannot delete the organisation.
      - **Viewer**: Read-only access to data. Good for auditors or observers.
      - **Member**: No dashboard access. This role is for people in your directory who don't manage the platform.

      ### Best Practices
      - **Keep it Clean**: Only add verified members to your database.
      - **Regular Backups**: Use the "Print" feature in each module to save PDF copies of your records.
      - **Secure Access**: Never share your login password. Create separate accounts for other team members.
    `
  },
  'members': {
    title: 'Managing Members',
    content: `
      The Members module is your central directory. It replaces your phone contacts and Excel sheets.

      ### Adding a Member
      1. Click **"Add Member"** on the top right.
      2. Fill in the **Full Name** and **Phone Number** (required).
      3. Assign a **Role** (usually 'Member' for general volunteers).
      4. Click Save. The member is now active.

      ### Searching & Filtering
      - Use the search bar to find members by name or phone number.
      - Use the status filter to see only **Active** or **Inactive** members.
      - Use pagination controls at the bottom to browse large lists.

      ### Editing & Status
      - Click on any member row to edit their details.
      - To deactivate a member (e.g., if they leave the org), change their status to **Inactive**. This preserves their history but hides them from active lists.

      ### Exporting Data
      - Click the **"Print List"** button to generate a clean, printable PDF of your directory.
      - **Data Safety**: Only Admins and Editors can export data. Viewer accounts cannot export.
    `
  },
  'forms': {
    title: 'Public Forms System',
    content: `
      Forms allow you to collect data from the public without giving them access to your dashboard. Ideal for volunteer signups or surveys.

      ### Creating a Form
      1. Go to **Forms** > **New Form**.
      2. Give it a clear **Title** and **Description**.
      3. Add Fields:
         - **Text**: For names, short answers.
         - **Number**: For ages, quantities.
         - **Phone**: Validates 10-digit numbers.
         - **Dropdown**: For selecting options (e.g., "State", "Gender").
      4. Mark critical fields as **Required**.
      5. Click **Publish**.

      ### Sharing & Submissions
      - Copy the **Public Link** (e.g., \`/f/uuid\`) and share it on WhatsApp or social media.
      - View responses in real-time under the **Submissions** tab of the form.
      - **Export**: You can print submissions as a PDF report.

      ### Security Features
      - **Rate Limiting**: We prevent bots from spamming your forms.
      - **Honeypot**: Hidden fields trap automated scripts.
      - **Data Ownership**: You own all submission data. We do not use it for marketing.
    `
  },
  'meetings': {
    title: 'Meetings & Attendance',
    content: `
      Track who shows up. The Meetings module helps you schedule gatherings and maintain attendance records.

      ### Creating a Meeting
      1. Go to **Meetings** > **Schedule Meeting**.
      2. Enter the **Title**, **Date**, and **Time**.
      3. (Optional) Add a **Location** or notes.
      4. Click Save.

      ### Video Conferencing
      - Every meeting automatically generates a secure **Jitsi Video Link**.
      - Click "Join Video Call" to start the meeting instantly without extra software.

      ### Attendance Tracking
      - Open a meeting to see the member list.
      - Mark members as **Present**, **Absent**, or **Excused**.
      - This data is saved permanently, helping you identify your most active volunteers.

      ### Exporting Minutes
      - Click **"Print Summary"** to get a PDF of the meeting details and attendance list for your physical files.
    `
  },
  'donations': {
    title: 'Donation Ledger',
    content: `
      A transparent record of your organisation's finances.
      
      **Important**: Sangathan does **not** process donations. We provide a ledger to record payments you receive via UPI, Cash, or Bank Transfer.

      ### Recording a Donation
      - **Manual Entry**: Admins can log a donation received offline (Cash/Bank).
      - **Public Submission**: Donors can use your public "Donate" link to submit proof of payment (UPI Reference No).

      ### Verification Workflow
      1. Public submissions appear as **Pending**.
      2. Admin checks their bank statement for the UPI Reference.
      3. If matched, Admin clicks **"Verify"**.
      4. The record is locked and added to the total.

      ### Transparency & Export
      - Use the **"Print Ledger"** button to generate a financial report.
      - We recommend sharing this report with your members monthly to build trust.
    `
  },
  'supporter-plan': {
    title: 'Supporter Plan',
    content: `
      Sangathan is free software supported by the community. The Supporter Plan is an optional way to help us keep the servers running.

      ### What is it?
      - **Cost**: ₹99 / month.
      - **Model**: Voluntary contribution. No critical features are paywalled.

      ### Benefits
      - **Supporter Badge**: A gold star on your dashboard.
      - **Remove Branding**: Option to hide "Powered by Sangathan" from your public forms and pages.
      - **Priority Support**: Faster response times for your queries.

      ### Managing Subscription
      - Go to **Dashboard** > **Supporter Plan**.
      - Click "Become a Supporter" to pay via Razorpay (UPI/Card).
      - **Cancellation**: You can cancel anytime from the same page. Your benefits will last until the end of the current month.
    `
  },
  'security': {
    title: 'Security & Data Protection',
    content: `
      We take your data seriously. Here is how we protect your organisation.

      ### Multi-Tenant Isolation
      - Your data is stored in a separate logical silo.
      - Even if you share a database, **Row Level Security (RLS)** ensures that no other organisation can ever see your records.

      ### Data Privacy
      - **No Selling**: We do not sell, rent, or trade your member lists.
      - **Ownership**: You can export all your data at any time. It belongs to you.

      ### Admin Best Practices
      - **Role Management**: Only give "Admin" access to people you fully trust. Use "Editor" for day-to-day tasks.
      - **Review Logs**: Check the **Audit Logs** regularly to see who is exporting data or changing settings.
      - **Secure Devices**: Always log out when using a shared computer.
    `
  },
  'system-admin': {
    title: 'System Administration',
    content: `
      (For Platform Operators Only)

      ### System Admin Role
      - The System Admin has oversight of the entire Sangathan instance.
      - They cannot see private organisation data (like member phones) but can view usage stats.

      ### Suspension Powers
      - If an organisation violates the Acceptable Use Policy (e.g., hate speech, fraud), the System Admin can **Suspend** it.
      - Suspended organisations cannot log in, but their data is preserved for review.

      ### Maintenance Mode
      - During critical updates, the platform may enter Maintenance Mode.
      - Data is safe, but login may be disabled for a few minutes.
    `
  }
}

const DOCS_CONTENT_HI: Record<string, { title: string; content: string }> = {
  'getting-started': {
    title: 'संगठन के साथ शुरुआत',
    content: `
      संगठन में आपका स्वागत है, जो जमीनी संगठनों के लिए एक ऑपरेटिंग सिस्टम है। यह मार्गदर्शिका आपको मिनटों में अपना डिजिटल वर्कस्पेस सेट करने में मदद करेगी।

      ### संगठन क्या है?
      संगठन एक ऐसा प्लेटफ़ॉर्म है जिसे बिखरे हुए व्हाट्सएप समूहों और स्प्रेडशीट को बदलने के लिए डिज़ाइन किया गया है। यह आपको सदस्यों, दान, बैठकों और फॉर्मों को एक सुरक्षित स्थान पर प्रबंधित करने में मदद करता है। यह एनजीओ, छात्र संघों और सामुदायिक समूहों के लिए बनाया गया है।

      ### अपना संगठन बनाना
      1. साइनअप पेज पर जाएं।
      2. अपना ईमेल पता सत्यापित करें (सुरक्षा के लिए यह आवश्यक है)।
      3. अपना **संगठन का नाम** और एक अद्वितीय **स्लग** (जैसे, \`sangathan.app/org-name\`) दर्ज करें।
      4. अब आप अपने नए डिजिटल वर्कस्पेस के सुपर एडमिन हैं।

      ### डैशबोर्ड अवलोकन
      लॉग इन करने के बाद, आपको मुख्य डैशबोर्ड दिखाई देगा।
      - **साइडबार**: सदस्य, फॉर्म, बैठकें और दान तक त्वरित पहुंच।
      - **त्वरित आँकड़े**: सक्रिय सदस्यों और लंबित कार्यों की वास्तविक समय की गणना।
      - **हाल की गतिविधि**: आपके संगठन में किसने क्या किया, इसका एक लॉग।

      ### भूमिकाओं को समझना
      - **व्यवस्थापक (Admin)**: पूर्ण नियंत्रण। बिलिंग, सेटिंग्स और अन्य व्यवस्थापकों का प्रबंधन कर सकता है।
      - **संपादक (Editor)**: सदस्यों, फॉर्म और बैठकों को जोड़/संपादित कर सकता है। संगठन को हटा नहीं सकता।
      - **दर्शक (Viewer)**: डेटा तक केवल पढ़ने की पहुंच। ऑडिटर्स या पर्यवेक्षकों के लिए अच्छा है।
      - **सदस्य (Member)**: कोई डैशबोर्ड एक्सेस नहीं। यह भूमिका आपकी निर्देशिका में उन लोगों के लिए है जो प्लेटफ़ॉर्म का प्रबंधन नहीं करते हैं।
    `
  },
  'members': {
    title: 'सदस्यों का प्रबंधन',
    content: `
      सदस्य मॉड्यूल आपकी केंद्रीय निर्देशिका है। यह आपके फोन संपर्कों और एक्सेल शीट को बदल देता है।

      ### सदस्य जोड़ना
      1. ऊपर दाईं ओर **"सदस्य जोड़ें"** पर क्लिक करें।
      2. **पूरा नाम** और **फोन नंबर** (आवश्यक) भरें।
      3. एक **भूमिका** असाइन करें (आमतौर पर सामान्य स्वयंसेवकों के लिए 'सदस्य')।
      4. सहेजें पर क्लिक करें। सदस्य अब सक्रिय है।

      ### खोजना और फ़िल्टर करना
      - नाम या फोन नंबर से सदस्यों को खोजने के लिए सर्च बार का उपयोग करें।
      - केवल **सक्रिय** या **निष्क्रिय** सदस्यों को देखने के लिए स्थिति फ़िल्टर का उपयोग करें।
      - बड़ी सूचियों को ब्राउज़ करने के लिए नीचे दिए गए पृष्ठांकन नियंत्रणों का उपयोग करें।

      ### संपादन और स्थिति
      - किसी भी सदस्य के विवरण को संपादित करने के लिए उसकी पंक्ति पर क्लिक करें।
      - किसी सदस्य को निष्क्रिय करने के लिए (जैसे, यदि वे संगठन छोड़ देते हैं), उनकी स्थिति को **निष्क्रिय** में बदलें। यह उनके इतिहास को सुरक्षित रखता है लेकिन उन्हें सक्रिय सूचियों से छिपा देता है।

      ### डेटा निर्यात
      - अपनी निर्देशिका का एक साफ, प्रिंट करने योग्य पीडीएफ बनाने के लिए **"सूची प्रिंट करें"** बटन पर क्लिक करें।
      - **डेटा सुरक्षा**: केवल व्यवस्थापक और संपादक ही डेटा निर्यात कर सकते हैं। दर्शक खाते निर्यात नहीं कर सकते।
    `
  },
  'forms': {
    title: 'सार्वजनिक फॉर्म सिस्टम',
    content: `
      फॉर्म आपको जनता से डेटा एकत्र करने की अनुमति देते हैं, बिना उन्हें आपके डैशबोर्ड तक पहुंच दिए। स्वयंसेवक साइनअप या सर्वेक्षण के लिए आदर्श।

      ### फॉर्म बनाना
      1. **फॉर्म** > **नया फॉर्म** पर जाएं।
      2. इसे एक स्पष्ट **शीर्षक** और **विवरण** दें।
      3. फ़ील्ड जोड़ें:
         - **टेक्स्ट**: नाम, संक्षिप्त उत्तरों के लिए।
         - **संख्या**: उम्र, मात्रा के लिए।
         - **फोन**: 10-अंकीय संख्याओं को मान्य करता है।
         - **ड्रॉपडाउन**: विकल्प चुनने के लिए (जैसे, "राज्य", "लिंग")।
      4. महत्वपूर्ण फ़ील्ड को **आवश्यक** के रूप में चिह्नित करें।
      5. **प्रकाशित करें** पर क्लिक करें।

      ### साझा करना और प्रस्तुतियाँ
      - **सार्वजनिक लिंक** (जैसे, \`/f/uuid\`) कॉपी करें और इसे व्हाट्सएप या सोशल मीडिया पर साझा करें।
      - फॉर्म के **सबमिशन** टैब के तहत वास्तविक समय में प्रतिक्रियाएं देखें।
      - **निर्यात**: आप सबमिशन को पीडीएफ रिपोर्ट के रूप में प्रिंट कर सकते हैं।

      ### सुरक्षा सुविधाएँ
      - **रेट लिमिटिंग**: हम बॉट्स को आपके फॉर्म स्पैम करने से रोकते हैं।
      - **हनीपॉट**: छिपे हुए फ़ील्ड स्वचालित स्क्रिप्ट को फंसाते हैं।
      - **डेटा स्वामित्व**: आप सभी सबमिशन डेटा के मालिक हैं। हम इसका उपयोग विपणन के लिए नहीं करते हैं।
    `
  },
  'meetings': {
    title: 'बैठकें और उपस्थिति',
    content: `
      ट्रैक करें कि कौन आता है। बैठकें मॉड्यूल आपको सभाओं को शेड्यूल करने और उपस्थिति रिकॉर्ड बनाए रखने में मदद करता है।

      ### बैठक बनाना
      1. **बैठकें** > **बैठक शेड्यूल करें** पर जाएं।
      2. **शीर्षक**, **तारीख** और **समय** दर्ज करें।
      3. (वैकल्पिक) एक **स्थान** या नोट्स जोड़ें।
      4. सहेजें पर क्लिक करें।

      ### वीडियो कॉन्फ्रेंसिंग
      - प्रत्येक बैठक स्वचालित रूप से एक सुरक्षित **जित्सी वीडियो लिंक** बनाती है।
      - अतिरिक्त सॉफ़्टवेयर के बिना तुरंत बैठक शुरू करने के लिए "वीडियो कॉल में शामिल हों" पर क्लिक करें।

      ### उपस्थिति ट्रैकिंग
      - सदस्य सूची देखने के लिए एक बैठक खोलें।
      - सदस्यों को **उपस्थित**, **अनुपस्थित**, या **क्षमा** के रूप में चिह्नित करें।
      - यह डेटा स्थायी रूप से सहेजा जाता है, जिससे आपको अपने सबसे सक्रिय स्वयंसेवकों की पहचान करने में मदद मिलती है।

      ### कार्यवृत्त निर्यात
      - अपनी भौतिक फ़ाइलों के लिए बैठक विवरण और उपस्थिति सूची का पीडीएफ प्राप्त करने के लिए **"सारांश प्रिंट करें"** पर क्लिक करें।
    `
  },
  'donations': {
    title: 'दान बहीखाता',
    content: `
      आपके संगठन के वित्त का एक पारदर्शी रिकॉर्ड।
      
      **महत्वपूर्ण**: संगठन दान को संसाधित **नहीं** करता है। हम आपको यूपीआई, नकद, या बैंक हस्तांतरण के माध्यम से प्राप्त भुगतान रिकॉर्ड करने के लिए एक बहीखाता प्रदान करते हैं।

      ### दान रिकॉर्ड करना
      - **मैनुअल प्रविष्टि**: व्यवस्थापक ऑफ़लाइन प्राप्त दान (नकद/बैंक) लॉग कर सकते हैं।
      - **सार्वजनिक सबमिशन**: दाता भुगतान का प्रमाण (यूपीआई संदर्भ संख्या) जमा करने के लिए आपके सार्वजनिक "दान" लिंक का उपयोग कर सकते हैं।

      ### सत्यापन कार्यप्रवाह
      1. सार्वजनिक प्रस्तुतियाँ **लंबित** के रूप में दिखाई देती हैं।
      2. व्यवस्थापक यूपीआई संदर्भ के लिए अपने बैंक विवरण की जाँच करता है।
      3. यदि मेल खाता है, तो व्यवस्थापक **"सत्यापित करें"** पर क्लिक करता है।
      4. रिकॉर्ड लॉक हो जाता है और कुल में जुड़ जाता है।

      ### पारदर्शिता और निर्यात
      - वित्तीय रिपोर्ट बनाने के लिए **"बहीखाता प्रिंट करें"** बटन का उपयोग करें।
      - हम विश्वास बनाने के लिए इस रिपोर्ट को अपने सदस्यों के साथ मासिक रूप से साझा करने की सलाह देते हैं।
    `
  },
  'supporter-plan': {
    title: 'समर्थक योजना',
    content: `
      संगठन समुदाय द्वारा समर्थित मुफ्त सॉफ्टवेयर है। समर्थक योजना हमें सर्वर चालू रखने में मदद करने का एक वैकल्पिक तरीका है।

      ### यह क्या है?
      - **लागत**: ₹99 / माह।
      - **मॉडल**: स्वैच्छिक योगदान। कोई महत्वपूर्ण सुविधा पेवॉल नहीं है।

      ### लाभ
      - **समर्थक बैज**: आपके डैशबोर्ड पर एक गोल्ड स्टार।
      - **ब्रांडिंग हटाएं**: अपने सार्वजनिक फॉर्म और पृष्ठों से "संगठन द्वारा संचालित" छिपाने का विकल्प।
      - **प्राथमिकता समर्थन**: आपके प्रश्नों के लिए तेज़ प्रतिक्रिया समय।

      ### सदस्यता प्रबंधन
      - **डैशबोर्ड** > **समर्थक योजना** पर जाएं।
      - रेज़रपे (यूपीआई/कार्ड) के माध्यम से भुगतान करने के लिए "समर्थक बनें" पर क्लिक करें।
      - **रद्दीकरण**: आप उसी पृष्ठ से किसी भी समय रद्द कर सकते हैं। आपके लाभ वर्तमान महीने के अंत तक चलेंगे।
    `
  },
  'security': {
    title: 'सुरक्षा और डेटा संरक्षण',
    content: `
      हम आपके डेटा को गंभीरता से लेते हैं। यहाँ बताया गया है कि हम आपके संगठन की सुरक्षा कैसे करते हैं।

      ### मल्टी-टेनेंट अलगाव
      - आपका डेटा एक अलग लॉजिकल साइलो में संग्रहीत होता है।
      - भले ही आप डेटाबेस साझा करते हैं, **पंक्ति स्तर की सुरक्षा (RLS)** यह सुनिश्चित करती है कि कोई अन्य संगठन आपके रिकॉर्ड कभी नहीं देख सकता है।

      ### डेटा गोपनीयता
      - **कोई बिक्री नहीं**: हम आपकी सदस्य सूची को बेचते, किराए पर देते या व्यापार नहीं करते हैं।
      - **स्वामित्व**: आप किसी भी समय अपना सारा डेटा निर्यात कर सकते हैं। यह आपका है।

      ### व्यवस्थापक सर्वोत्तम प्रथाएं
      - **भूमिका प्रबंधन**: केवल उन लोगों को "व्यवस्थापक" पहुंच दें जिन पर आप पूरी तरह भरोसा करते हैं। दिन-प्रतिदिन के कार्यों के लिए "संपादक" का उपयोग करें।
      - **लॉग की समीक्षा करें**: डेटा निर्यात करने या सेटिंग्स बदलने वाले को देखने के लिए नियमित रूप से **ऑडिट लॉग** की जाँच करें।
      - **सुरक्षित उपकरण**: साझा कंप्यूटर का उपयोग करते समय हमेशा लॉग आउट करें।
    `
  },
  'system-admin': {
    title: 'सिस्टम प्रशासन',
    content: `
      (केवल प्लेटफ़ॉर्म ऑपरेटरों के लिए)

      ### सिस्टम एडमिन भूमिका
      - सिस्टम एडमिन के पास पूरे संगठन इंस्टेंस की निगरानी होती है।
      - वे निजी संगठन डेटा (जैसे सदस्य फोन) नहीं देख सकते हैं लेकिन उपयोग के आँकड़े देख सकते हैं।

      ### निलंबन शक्तियां
      - यदि कोई संगठन स्वीकार्य उपयोग नीति (जैसे, अभद्र भाषा, धोखाधड़ी) का उल्लंघन करता है, तो सिस्टम एडमिन इसे **निलंबित** कर सकता है।
      - निलंबित संगठन लॉग इन नहीं कर सकते, लेकिन समीक्षा के लिए उनका डेटा सुरक्षित रखा जाता है।

      ### रखरखाव मोड
      - महत्वपूर्ण अपडेट के दौरान, प्लेटफ़ॉर्म रखरखाव मोड में प्रवेश कर सकता है।
      - डेटा सुरक्षित है, लेकिन कुछ मिनटों के लिए लॉगिन अक्षम हो सकता है।
    `
  }
}

export default async function DocPage({ params }: PageProps) {
  const { lang, slug } = await params
  const isHindi = lang === 'hi'
  const contentMap = isHindi ? DOCS_CONTENT_HI : DOCS_CONTENT_EN
  const doc = contentMap[slug]

  if (!doc) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
       <Link href={`/${lang}/docs`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8">
          <ArrowLeft size={16} /> {isHindi ? 'दस्तावेज़ पर वापस' : 'Back to Docs'}
       </Link>

       <article className="prose prose-orange max-w-none">
          <h1>{doc.title}</h1>
          <div className="whitespace-pre-wrap text-gray-600 leading-relaxed">
             {doc.content.split('\n').map((line, i) => {
                if (line.trim().startsWith('###')) {
                   return <h3 key={i} className="text-xl font-bold mt-8 mb-4 text-black">{line.replace('###', '').trim()}</h3>
                }
                if (line.trim().startsWith('-')) {
                   return <li key={i} className="ml-4">{line.replace('-', '').trim()}</li>
                }
                if (line.trim().match(/^\d+\./)) {
                   return <div key={i} className="ml-4 mb-2 font-medium">{line.trim()}</div>
                }
                return <p key={i} className="mb-4">{line}</p>
             })}
          </div>
       </article>
    </div>
  )
}
