import { CropPrice, LocalizedString } from '@/types';

export interface AgriSubsidySummary {
  id: string;
  title: LocalizedString;
  subsidyRate: LocalizedString;
  eligibility: LocalizedString;
  department: LocalizedString;
  keyBenefit: LocalizedString;
}

export const ODDANCHATRAM_CROP_PRICES: CropPrice[] = [
  {
    cropName: {
      ta: 'முருங்கைக்காய் (Drumstick - செடி முருங்கை / கரும்பு முருங்கை)',
      en: 'Drumstick (Moringa)'
    },
    variety: 'செடி முருங்கை',
    unit: {
      ta: 'கிலோ',
      en: 'kg'
    },
    priceRange: '₹35 - ₹55 / கிலோ',
    trend: 'up',
    market: 'ஒட்டன்சத்திரம் காந்தி காய்கறி சந்தை (Oddanchatram Gandhi Market)',
    updatedDate: '2026-09-07'
  },
  {
    cropName: {
      ta: 'சின்ன வெங்காயம் (Shallots / Small Onion)',
      en: 'Shallots / Small Onion'
    },
    variety: 'நாசிக் & உள்ளூர் சிவப்பு',
    unit: {
      ta: 'கிலோ',
      en: 'kg'
    },
    priceRange: '₹40 - ₹62 / கிலோ',
    trend: 'stable',
    market: 'ஒட்டன்சத்திரம் காந்தி சந்தை',
    updatedDate: '2026-09-07'
  },
  {
    cropName: {
      ta: 'தக்காளி (Tomato)',
      en: 'Tomato'
    },
    variety: 'நாட்டு தக்காளி & ஹைபிரிட் (பெட்டி 15 கிலோ)',
    unit: {
      ta: 'பெட்டி (15 கிலோ)',
      en: 'Box (15 kg)'
    },
    priceRange: '₹280 - ₹380 / பெட்டி (₹18-₹25/கிலோ)',
    trend: 'down',
    market: 'ஒட்டன்சத்திரம் உழவர் சந்தை & காந்தி மார்க்கெட்',
    updatedDate: '2026-09-07'
  },
  {
    cropName: {
      ta: 'பச்சை மிளகாய் (Green Chilli)',
      en: 'Green Chilli'
    },
    variety: 'சம்பா & குண்டு மிளகாய்',
    unit: {
      ta: 'கிலோ',
      en: 'kg'
    },
    priceRange: '₹32 - ₹48 / கிலோ',
    trend: 'stable',
    market: 'ஒட்டன்சத்திரம் மார்க்கெட்',
    updatedDate: '2026-09-07'
  },
  {
    cropName: {
      ta: 'அவரைக்காய் (Butter Beans / Broad Beans)',
      en: 'Broad Beans (Avarai)'
    },
    variety: 'பட்டை அவரை',
    unit: {
      ta: 'கிலோ',
      en: 'kg'
    },
    priceRange: '₹45 - ₹65 / கிலோ',
    trend: 'up',
    market: 'ஒட்டன்சத்திரம் காந்தி சந்தை',
    updatedDate: '2026-09-07'
  },
  {
    cropName: {
      ta: 'மக்காச்சோளம் (Maize / Corn)',
      en: 'Maize (Corn)'
    },
    variety: 'உலர் தானியம்',
    unit: {
      ta: 'குவிண்டால் (100 கிலோ)',
      en: 'Quintal (100 kg)'
    },
    priceRange: '₹2,250 - ₹2,450 / குவிண்டால்',
    trend: 'stable',
    market: 'ஒட்டன்சத்திரம் & திண்டுக்கல் ஒழுங்குமுறை விற்பனைக் கூடம்',
    updatedDate: '2026-09-07'
  }
];

export const AGRI_SUBSIDIES: AgriSubsidySummary[] = [
  {
    id: 'drip',
    title: {
      ta: 'சொட்டு நீர் மற்றும் தெளிப்பு நீர் பாசன மானியம்',
      en: 'Micro Irrigation (Drip & Sprinkler) Subsidy'
    },
    subsidyRate: {
      ta: 'சிறு/குறு விவசாயிகளுக்கு 100% மானியம்; இதர விவசாயிகளுக்கு 75%',
      en: '100% for Small/Marginal farmers; 75% for others'
    },
    eligibility: {
      ta: 'பாசன கிணறு அல்லது ஆழ்துளை கிணறு மற்றும் மின் இணைப்பு உள்ள விவசாயிகள்',
      en: 'Farmers with functional well or borewell irrigation facility'
    },
    department: {
      ta: 'தோட்டக்கலைத் துறை, ஒட்டன்சத்திரம் (அலுவலர்: 9600226791)',
      en: 'Horticulture Dept, Oddanchatram (Officer: 9600226791)'
    },
    keyBenefit: {
      ta: '60% வரை தண்ணீர் சேமிப்பு, உரம் நேரடியாக வேருக்கு செல்லும், 40% வரை கூடுதல் மகசூல்',
      en: 'Saves up to 60% water, direct fertigation to roots, increases yield by 40%'
    }
  },
  {
    id: 'solar_pump',
    title: {
      ta: 'முதலமைச்சரின் சூரியசக்தி பம்புசெட் திட்டம்',
      en: 'Chief Minister Solar Agri Pump Scheme'
    },
    subsidyRate: {
      ta: '70% அரசு மானியம் (விவசாயி பங்குத் தொகை 30% மட்டும்)',
      en: '70% Government Subsidy (Farmer share only 30%)'
    },
    eligibility: {
      ta: 'மின் இணைப்பு இல்லாத அல்லது மின்சாரத்திற்காக காத்திருக்கும் பாசன விவசாயிகள்',
      en: 'Farmers awaiting agricultural grid electricity'
    },
    department: {
      ta: 'வேளாண் பொறியியல் துறை, திண்டுக்கல்',
      en: 'Agricultural Engineering Dept, Dindigul'
    },
    keyBenefit: {
      ta: 'பகல் நேரங்களில் தடையற்ற இலவச சூரிய மின்சாரத்தில் பாசனம் செய்யலாம்',
      en: 'Reliable daytime irrigation with zero electricity bills'
    }
  },
  {
    id: 'crop_insurance',
    title: {
      ta: 'பிரதான் மந்திரி பயிர் காப்பீட்டு திட்டம் (PMFBY)',
      en: 'Pradhan Mantri Fasal Bima Yojana (Crop Insurance)'
    },
    subsidyRate: {
      ta: 'மிகக்குறைந்த பிரீமியம்: 1.5% முதல் 2% மட்டுமே; மீதமுள்ள கட்டணத்தை அரசே ஏற்கும்',
      en: 'Minimal farmer premium (1.5% to 2%), rest borne by Govt'
    },
    eligibility: {
      ta: 'அரசு அறிவிக்கை செய்துள்ள பருவ பயிர்களை சாகுபடி செய்யும் விவசாயிகள்',
      en: 'Farmers cultivating notified seasonal crops'
    },
    department: {
      ta: 'வேளாண்மைத் துறை & தொடக்க வேளாண் கூட்டுறவு வங்கி',
      en: 'Agriculture Dept & PACCS Bank'
    },
    keyBenefit: {
      ta: 'வறட்சி, புயல், பூச்சித் தாக்குதலால் ஏற்படும் பயிர் இழப்பிற்கு முழு வங்கி இழப்பீடு',
      en: 'Direct bank compensation for crop loss due to drought, unseasonal rain or pests'
    }
  },
  {
    id: 'soil_health_card',
    title: {
      ta: 'மண் வள அட்டை திட்டம் (Soil Health Card)',
      en: 'Soil Health Card Scheme'
    },
    subsidyRate: {
      ta: 'முற்றிலும் இலவச மண் பரிசோதனை',
      en: 'Completely free soil sample testing'
    },
    eligibility: {
      ta: 'அனைத்து நில உரிமையாளர்களுக்கும் 3 ஆண்டுகளுக்கு ஒரு முறை',
      en: 'All agricultural landowners every 3 years'
    },
    department: {
      ta: 'வேளாண்மை மண் பரிசோதனை ஆய்வகம், திண்டுக்கல்',
      en: 'Soil Testing Laboratory, Dindigul'
    },
    keyBenefit: {
      ta: 'மண்ணில் உள்ள தழை, மணி, சாம்பல் சத்து அளவு அறிந்து தேவைக்கேற்ப சரியான உரம் இடலாம். உரச் செலவு குறையும்.',
      en: 'Determines NPK balance and micronutrient status, preventing excessive fertilizer wastage'
    }
  }
];

export const PACCS_GUIDE = {
  name: {
    ta: 'சத்திரப்பட்டி & பெரியாக்கோட்டை தொடக்க வேளாண்மை கூட்டுறவு கடன் சங்கம் (PACCS)',
    en: 'Chatrapatti & Periyakottai Primary Agricultural Co-operative Credit Society (PACCS)'
  },
  services: [
    {
      title: {
        ta: 'வட்டி இல்லா பயிர்க்கடன் (Zero Interest Crop Loan)',
        en: 'Zero Interest Crop Loan'
      },
      desc: {
        ta: 'விவசாயிகளுக்கு பயிர் சாகுபடி செய்ய கூட்டுறவு வங்கிகள் மூலம் வழங்கப்படும் கடன். குறித்த காலத்தில் (12 மாதத்திற்குள்) திருப்பி செலுத்தினால் வட்டி முற்றிலும் தள்ளுபடி (0% வட்டி).',
        en: 'Short-term crop cultivation loan up to ₹1.5 Lakhs. 100% interest subvention for prompt repayment within 12 months.'
      }
    },
    {
      title: {
        ta: 'மானிய விலையில் உரம் மற்றும் விதை விநியோகம்',
        en: 'Subsidized Fertilizer & Quality Seed Supply'
      },
      desc: {
        ta: 'யூரியா (Urea), டிஏபி (DAP), பொட்டாஷ் மற்றும் காம்ப்ளக்ஸ் உரங்கள் நியாயமான அரசு நிர்ணய விலையில் இருப்பு வைக்கப்பட்டு விவசாயிகளுக்கு வழங்கப்படுகிறது.',
        en: 'Direct distribution of subsidized Urea, DAP, Potash and certified seeds at government controlled prices.'
      }
    },
    {
      title: {
        ta: 'நகைக்கடன் மற்றும் கறவை மாடு கடன்',
        en: 'Gold Loan & Dairy Cattle Assistance'
      },
      desc: {
        ta: 'குறைந்த வட்டியில் விவசாய தேவைகளுக்கான நகைக்கடன் மற்றும் பால் உற்பத்தியை பெருக்க கறவை மாடு வாங்குவதற்கான நிதி உதவி.',
        en: 'Low-interest agricultural jewel loans and dairy cattle loans for rural livestock farmers.'
      }
    }
  ]
};

// WhatsApp group link for real-time daily auction rates at Oddanchatram Gandhi Market
export const ODDANCHATRAM_MARKET_WHATSAPP_LINK =
  'https://chat.whatsapp.com/'; // Placeholder link; also links with Murugesan (+91 97903 82437)

export const ODDANCHATRAM_MARKET_DISCLAIMER = {
  ta: 'கவனத்திற்கு: ஒட்டன்சத்திரம் காந்தி காய்கறி சந்தை ஏல விலைகள் தினமும் வரத்து அடிப்படையில் மாறுபடும். தினசரி காலை மற்றும் மாலை ஏல நிலவரங்களை உடனுக்குடன் தெரிந்துகொள்ள வாட்ஸ்அப் குழுவில் இணையவும்.',
  en: 'Important Note: Oddanchatram Gandhi Vegetable Market auction rates fluctuate daily based on arrivals. Join the official WhatsApp group for daily morning and evening auction price updates.'
};

