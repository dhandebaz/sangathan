export interface UnionTerms {
  president: string
  vicePresident: string
  generalSecretary: string
  jointSecretary: string
  gyapan: string
  protest: string
  memorandum: string
  election: string
  memberDrive: string
  jointFront: string
}

export const REGIONAL_UNION_TERMS: Record<string, UnionTerms> = {
  hi: {
    president: 'अध्यक्ष',
    vicePresident: 'उपाध्यक्ष',
    generalSecretary: 'महासचिव',
    jointSecretary: 'सह-सचिव',
    gyapan: 'ज्ञापन',
    protest: 'प्रदर्शन / आंदोलन',
    memorandum: 'मांग पत्र',
    election: 'छात्र संघ चुनाव',
    memberDrive: 'सदस्यता अभियान',
    jointFront: 'संयुक्त मोर्चा'
  },
  bn: {
    president: 'সভাপতি',
    vicePresident: 'সহ-সভাপতি',
    generalSecretary: 'সাধারণ সম্পাদক',
    jointSecretary: 'যুগ্ম সম্পাদক',
    gyapan: 'স্মারকলিপি',
    protest: 'বিক্ষোভ সমাবেশ',
    memorandum: 'দাবি সনদ',
    election: 'ছাত্র সংসদ নির্বাচন',
    memberDrive: 'সদস্য সংগ্রহ অভিযান',
    jointFront: 'যৌথ মোর্চা'
  },
  ta: {
    president: 'தலைவர்',
    vicePresident: 'துணைத் தலைவர்',
    generalSecretary: 'பொதுச் செயலாளர்',
    jointSecretary: 'இணைச் செயலாளர்',
    gyapan: 'மனு',
    protest: 'போராட்டம்',
    memorandum: 'கோரிக்கை மனு',
    election: 'மாணவர் பேரவை தேர்தல்',
    memberDrive: 'உறுப்பினர் சேர்க்கை',
    jointFront: 'கூட்டு முன்னணி'
  },
  te: {
    president: 'అధ్యక్షుడు',
    vicePresident: 'ఉపాధ్యక్షుడు',
    generalSecretary: 'ప్రధాన కార్యదర్శి',
    jointSecretary: 'సంయుక్త కార్యదర్శి',
    gyapan: 'వినతిపత్రం',
    protest: 'నిరసన ప్రదర్శన',
    memorandum: 'డిమాండ్ల పత్రం',
    election: 'విద్యార్థి సంఘం ఎన్నికలు',
    memberDrive: 'సభ్యత్వ నమోదు',
    jointFront: 'ఐక్య వేదిక'
  },
  mr: {
    president: 'अध्यक्ष',
    vicePresident: 'उपाध्यक्ष',
    generalSecretary: 'सरचिटणीस',
    jointSecretary: 'सह-चिटणीस',
    gyapan: 'निवेदन',
    protest: 'आंदोलन / निदर्शने',
    memorandum: 'मागणी पत्र',
    election: 'विद्यार्थी संघटना निवडणूक',
    memberDrive: 'सभासद नोंदणी मोहीम',
    jointFront: 'संयुक्त आघाडी'
  },
  kn: {
    president: 'ಅಧ್ಯಕ್ಷರು',
    vicePresident: 'ಉಪಾಧ್ಯಕ್ಷರು',
    generalSecretary: 'ಪ್ರಧಾನ ಕಾರ್ಯದರ್ಶಿ',
    jointSecretary: 'ಸಂಚಾಲಕರು',
    gyapan: 'ಮನವಿ ಪತ್ರ',
    protest: 'ಪ್ರತಿಭಟನೆ',
    memorandum: 'ಬೇಡಿಕೆಗಳ ಪತ್ರ',
    election: 'ವಿದ್ಯಾರ್ಥಿ ಸಂಘದ ಚುನಾವಣೆ',
    memberDrive: 'ಸದಸ್ಯತ್ವ ಅಭಿಯಾನ',
    jointFront: 'ಸಂಯುಕ್ತ ರಂಗ'
  }
}

export function getRegionalUnionTerms(lang: string): UnionTerms {
  return REGIONAL_UNION_TERMS[lang] || REGIONAL_UNION_TERMS['hi']
}
