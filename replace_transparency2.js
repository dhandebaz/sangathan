const fs = require('fs');
let lines = fs.readFileSync('src/app/[lang]/(site)/transparency/page.tsx', 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('Data Collection Transparency'));
const endIndex = lines.findIndex(l => l.includes('Governance & Neutrality'));

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `        {/* Anti-Practices Transparency */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{isHindi ? 'हम क्या नहीं करते हैं' : 'What we DO NOT do'}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isHindi ? 'हमारा व्यवसाय मॉडल आपके ध्यान या डेटा का मुद्रीकरण करने पर निर्भर नहीं है। यहाँ वह सब कुछ है जो अन्य कंपनियाँ करती हैं, लेकिन हम नहीं करते।' : 'Our business model does not rely on monetizing your attention or data. Here are the common industry practices we explicitly refuse to engage in.'}
            </p>
          </div>

          <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
             <div className="flex items-center justify-center gap-3 mb-10">
                <FileSearch className="w-8 h-8 text-red-500" />
                <h3 className="font-bold text-2xl text-slate-900">
                  {isHindi ? 'हमारी सख्त ' : 'Our Strict '} <span className="text-red-500">Anti-Practices</span>
                </h3>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'राजनीतिक प्रोफाइलिंग' : 'Political Profiling'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम आपके राजनीतिक झुकाव का अनुमान या बिक्री नहीं करते हैं।' : 'We do not infer, sell, or analyze your political leanings or affiliations.'}</span>
                </div>
                
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'विज्ञापन लक्ष्यीकरण' : 'Ad Targeting & Pixels'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'कोई विज्ञापन नहीं। कोई गुप्त कुकीज़ नहीं। कोई क्रॉस-साइट ट्रैकिंग नहीं।' : 'Zero ads. Zero secret cookies. Zero cross-site tracking pixels.'}</span>
                </div>
                
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'डिवाइस फ़िंगरप्रिंटिंग' : 'Device Fingerprinting'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम पूरे वेब पर आपकी गतिविधियों का प्रोफाइल नहीं बनाते हैं।' : 'We do not build a shadow profile of you across the internet using your hardware footprint.'}</span>
                </div>
                
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'लोकेशन ट्रैकिंग' : 'Location Tracking'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम आपकी जीपीएस स्थिति या पृष्ठभूमि आंदोलनों को ट्रैक नहीं करते हैं।' : 'We never track or store your GPS coordinates or background movements.'}</span>
                </div>
                
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'इनबॉक्स स्कैनिंग' : 'Inbox Scanning'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम विज्ञापन या AI प्रशिक्षण के लिए आपके संचार नहीं पढ़ते हैं।' : 'We do not read or scan your communications for ad-profiling or AI training.'}</span>
                </div>

                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'एआई के लिए डेटा स्क्रैपिंग' : 'Data Scraping for AI'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम बाहरी एलएलएम को प्रशिक्षित करने के लिए आपके संगठन के डेटा का उपयोग नहीं करते हैं।' : 'We refuse to use your organisation\\'s private data to train external Large Language Models.'}</span>
                </div>

                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'वेंडर लॉक-इन' : 'Vendor Lock-in'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम आपके डेटा को बंधक नहीं बनाते। आप कभी भी अपना डेटा निर्यात कर सकते हैं।' : 'We don\\'t hold your data hostage. You can export your member lists and data in CSV format at any time.'}</span>
                </div>

                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'डेटा ब्रोकर्स को बिक्री' : 'Selling to Data Brokers'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम तीसरे पक्ष के डेटा दलालों से आपकी जानकारी नहीं खरीदते या बेचते हैं।' : 'We never purchase shadow profiles or sell your member lists to third-party data brokers.'}</span>
                </div>
             </div>
          </div>
        </section>`;

  const newLines = [
    ...lines.slice(0, startIndex),
    replacement,
    '\n',
    ...lines.slice(endIndex)
  ];
  fs.writeFileSync('src/app/[lang]/(site)/transparency/page.tsx', newLines.join('\n'));
  console.log('Success');
} else {
  console.log('Failed to find lines');
}
