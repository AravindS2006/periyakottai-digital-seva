import { Scheme } from '@/types';

export const SCHEMES_DATA: Scheme[] = [
  {
    id: 'pm_kisan',
    name: {
      ta: 'பிரதான் மந்திரி கிசான் சம்மான் நிதி (PM-KISAN)',
      en: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)'
    },
    category: 'விவசாயம் (Agriculture)',
    sponsor: 'Central',
    benefit: {
      ta: 'ஆண்டுக்கு ₹6,000 நேரடி வங்கி நிதி உதவி (தலா ₹2,000 வீதம் 3 தவணைகள்)',
      en: '₹6,000 annual direct income support in three ₹2,000 installments'
    },
    description: {
      ta: 'விவசாய இடுபொருட்கள், உரம் மற்றும் விதை வாங்குவதற்கு உதவும் வகையில் அனைத்து விவசாய நில உரிமையாளர்களுக்கும் வழங்கப்படும் நேரடி பண உதவி.',
      en: 'Income support to landholding farmer families across India for procuring seeds, fertilizers, and agricultural inputs.'
    },
    targetAudience: {
      ta: 'விவசாய நிலம் வைத்துள்ள சிறு, குறு மற்றும் அனைத்து விவசாயிகள்',
      en: 'Cultivable landholding farmer families'
    },
    rules: {
      occupations: ['farmer'],
      landRequired: true,
      maxAnnualIncome: 500000
    },
    documents: {
      ta: [
        'நில பட்டா / சிட்டா நகல் (01-02-2019-க்கு முன் பதிவு செய்யப்பட்டது)',
        'விவசாயி ஆதார் அட்டை',
        'ஆதாருடன் இணைக்கப்பட்ட வங்கி கணக்கு பாஸ்புக்'
      ],
      en: [
        'Land Patta / Chitta document',
        'Farmer Aadhaar card',
        'Aadhaar-seeded bank account passbook'
      ]
    },
    howToApply: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் நில ஆவணம் மற்றும் ஆதாருடன் புதிய பதிவு மற்றும் பயோமெட்ரிக் e-KYC செய்து கொள்ளலாம்.',
      en: 'Apply and complete biometric e-KYC at Nalroad Makkal e-Seva Centre.'
    },
    officialLink: 'https://pmkisan.gov.in/',
    centreAssistance: true,
    featured: true
  },
  {
    id: 'kmut_scheme',
    name: {
      ta: 'கலைஞர் மகளிர் உரிமைத் திட்டம் (KMUT)',
      en: 'Kalaignar Magalir Urimai Thittam'
    },
    category: 'மகளிர் நலம் (Women Welfare)',
    sponsor: 'Tamil Nadu State',
    benefit: {
      ta: 'மாதந்தோறும் ₹1,000 மகளிர் உரிமைத் தொகை வங்கி கணக்கில் வரவு',
      en: 'Monthly grant of ₹1,000 credited to bank accounts of female heads of families'
    },
    description: {
      ta: 'குடும்பத் தலைவிகளின் உழைப்பை அங்கீகரிக்கவும், அவர்களின் பொருளாதார சுதந்திரத்தை உறுதி செய்யவும் தமிழக அரசு வழங்கும் மாதாந்திர உதவித்தொகை.',
      en: 'Flagship financial dignity initiative providing ₹1,000 per month directly to eligible women heads of households.'
    },
    targetAudience: {
      ta: 'குடும்பத் தலைவிகள் (ஆண்டு வருமானம் ₹2.5 லட்சத்திற்கு குறைவு)',
      en: 'Women heads of families with household income below ₹2.5 Lakhs'
    },
    rules: {
      gender: 'female',
      minAge: 21,
      maxAnnualIncome: 250000,
      maxLandAcres: 10
    },
    documents: {
      ta: [
        'குடும்ப அட்டை (Smart Ration Card)',
        'குடும்பத் தலைவி ஆதார் அட்டை',
        'வங்கி கணக்கு பாஸ்புக் (ஆதார் இணைக்கப்பட்டது)',
        'மின் நுகர்வோர் அட்டை எண் (3600 யூனிட்டுக்குள்)'
      ],
      en: [
        'Smart Ration Card',
        'Aadhaar card of female family head',
        'Bank passbook linked with Aadhaar',
        'Electricity consumer number'
      ]
    },
    howToApply: {
      ta: 'புதிய சேர்க்கை அறிவிப்பு அல்லது நிராகரிக்கப்பட்ட விண்ணப்பங்களுக்கு நால்ரோடு இ-சேவை மையத்தில் மேல்முறையீடு செய்யலாம்.',
      en: 'Assistance for new enrollments and appeal filings at Nalroad e-Seva Centre.'
    },
    officialLink: 'https://kmut.tn.gov.in/',
    centreAssistance: true,
    featured: true
  },
  {
    id: 'pudhumai_penn',
    name: {
      ta: 'புதுமைப் பெண் திட்டம் (Pudhumai Penn)',
      en: 'Pudhumai Penn Scheme'
    },
    category: 'கல்வி (Education)',
    sponsor: 'Tamil Nadu State',
    benefit: {
      ta: 'கல்லூரி படிக்கும் மாணவிகளுக்கு மாதம் ₹1,000 வங்கி கணக்கில் உதவி',
      en: '₹1,000 per month for female students pursuing higher education'
    },
    description: {
      ta: 'அரசுப் பள்ளிகளில் 6 முதல் 12-ம் வகுப்பு வரை படித்து கல்லூரி சேரும் மாணவிகளின் இடைநிற்றலைத் தடுத்து பட்டதாரிகளாக மாற்றும் திட்டம்.',
      en: 'Higher education incentive for girls who studied in TN Government schools from classes 6 to 12.'
    },
    targetAudience: {
      ta: 'அரசுப் பள்ளியில் படித்த கல்லூரி மாணவிகள்',
      en: 'Female college students from government schools'
    },
    rules: {
      gender: 'female',
      studentOnly: true,
      minAge: 17,
      maxAge: 25
    },
    documents: {
      ta: [
        'மாணவி ஆதார் அட்டை',
        'அரசுப் பள்ளி 6-12 மாற்றுச் சான்றிதழ் (TC) / EMIS எண்',
        'கல்லூரி அடையாள அட்டை / சேர்க்கை கட்டண ரசீது',
        'மாணவியின் சொந்த வங்கி பாஸ்புக்'
      ],
      en: [
        'Student Aadhaar card',
        'School TC for classes 6 to 12 (EMIS proof)',
        'College ID / Admission fee receipt',
        'Student bank passbook'
      ]
    },
    howToApply: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் ஆவணங்களை சரிபார்த்து கல்லூரி வாயிலாக விண்ணப்பிக்கலாம்.',
      en: 'Document verification and guidance at Nalroad e-Seva Centre.'
    },
    officialLink: 'https://www.pudhumaipenn.tn.gov.in/',
    centreAssistance: true,
    featured: true
  },
  {
    id: 'tamil_pudhalvan',
    name: {
      ta: 'தமிழ்ப் புதல்வன் திட்டம் (Tamil Pudhalvan)',
      en: 'Tamil Pudhalvan Scheme'
    },
    category: 'கல்வி (Education)',
    sponsor: 'Tamil Nadu State',
    benefit: {
      ta: 'கல்லூரி படிக்கும் அரசுப் பள்ளி மாணவர்களுக்கு மாதம் ₹1,000 நிதி உதவி',
      en: '₹1,000 per month for male students from government schools pursuing higher education'
    },
    description: {
      ta: 'அரசுப் பள்ளிகளில் படித்து கல்லூரி, தொழிற்கல்வி பயிலும் மாணவர்களுக்கு புத்தகங்கள், உபகரணங்கள் வாங்க உதவும் திட்டம்.',
      en: 'Educational allowance for boys who completed classes 6 to 12 in Tamil Nadu government schools.'
    },
    targetAudience: {
      ta: 'அரசுப் பள்ளியில் படித்த கல்லூரி மாணவர்கள்',
      en: 'Male college students from government schools'
    },
    rules: {
      gender: 'male',
      studentOnly: true,
      minAge: 17,
      maxAge: 25
    },
    documents: {
      ta: [
        'மாணவர் ஆதார் அட்டை',
        'அரசுப் பள்ளி TC / EMIS சான்று',
        'கல்லூரி அட்டை',
        'வங்கி பாஸ்புக்'
      ],
      en: [
        'Student Aadhaar card',
        'School TC / EMIS proof',
        'College ID',
        'Bank passbook'
      ]
    },
    howToApply: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் விவரங்களை சரிபார்த்து கல்லூரி மூலம் பதிவு செய்து கொள்ளலாம்.',
      en: 'Verified and registered via college with Nalroad e-Seva assistance.'
    },
    officialLink: 'https://www.tamilpudhalvan.tn.gov.in/',
    centreAssistance: true,
    featured: false
  },
  {
    id: 'drip_irrigation_scheme',
    name: {
      ta: 'சொட்டு நீர் பாசன 100% அரசு மானியத் திட்டம்',
      en: '100% Drip Irrigation Subsidy Scheme (PMKSY)'
    },
    category: 'விவசாயம் (Agriculture)',
    sponsor: 'Joint',
    benefit: {
      ta: 'சிறு/குறு விவசாயிகளுக்கு 100% மானியம்; இதர விவசாயிகளுக்கு 75% மானியம்',
      en: '100% subsidy for small/marginal farmers; 75% for other farmers'
    },
    description: {
      ta: 'தண்ணீர் தட்டுப்பாட்டை சமாளித்து காய்கறி, முருங்கை, வெங்காயம் மகசூலை அதிகரிக்க உதவும் மத்திய-மாநில கூட்டு நுண்ணீர் பாசன திட்டம்.',
      en: 'Joint central-state micro irrigation scheme providing drip systems for drumstick, vegetables, and fruit orchards.'
    },
    targetAudience: {
      ta: 'கிணறு / போர்வெல் வசதியுள்ள விவசாயிகள் (5 ஏக்கர் வரை 100% மானியம்)',
      en: 'Farmers with well/borewell water sources'
    },
    rules: {
      occupations: ['farmer'],
      landRequired: true
    },
    documents: {
      ta: [
        'பட்டா மற்றும் சிட்டா நகல்',
        'VAO அடங்கல் & நீர் ஆதார சான்றிதழ்',
        'புல வரைபடம் (FMB Sketch)',
        'சிறு/குறு விவசாயி சான்றிதழ்'
      ],
      en: [
        'Patta and latest digital Chitta',
        'VAO Adangal & water source proof',
        'FMB field sketch',
        'Small / Marginal Farmer Certificate'
      ]
    },
    howToApply: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் விண்ணப்பித்து ஒட்டன்சத்திரம் தோட்டக்கலை உதவி இயக்குநர் அலுவலக ஒப்புதல் பெறலாம்.',
      en: 'Apply through Nalroad e-Seva Centre for Oddanchatram Horticulture Department approval.'
    },
    officialLink: 'https://tnhorticulture.tn.gov.in/',
    centreAssistance: true,
    featured: true
  },
  {
    id: 'cm_solar_pump',
    name: {
      ta: 'முதலமைச்சரின் சூரியசக்தி பம்புசெட் திட்டம் (70% மானியம்)',
      en: 'Chief Minister Solar Powered Agricultural Pump Scheme (70% Subsidy)'
    },
    category: 'விவசாயம் (Agriculture)',
    sponsor: 'Tamil Nadu State',
    benefit: {
      ta: '70% அரசு மானியத்தில் 5 HP முதல் 10 HP சூரியசக்தி மின் மோட்டார் அமைத்தல்',
      en: '70% government subsidy to install 5 HP to 10 HP solar water pumps'
    },
    description: {
      ta: 'மின் இணைப்பு இல்லாத அல்லது மின்சாரத்திற்காக காத்திருக்கும் விவசாயிகளுக்கு பகல் நேர பாசனத்திற்காக சோலார் பம்புசெட் அமைத்து தரும் திட்டம்.',
      en: 'Provides solar-powered pumps for daytime irrigation to farmers awaiting grid electricity.'
    },
    targetAudience: {
      ta: 'பாசன கிணறு வைத்திருக்கும் விவசாயிகள்',
      en: 'Farmers with irrigation wells seeking daytime solar power'
    },
    rules: {
      occupations: ['farmer'],
      landRequired: true
    },
    documents: {
      ta: [
        'நில பட்டா மற்றும் சிட்டா',
        'VAO நீர்மட்ட சான்றிதழ் & அடங்கல்',
        'ஆதார் அட்டை & வங்கி பாஸ்புக்',
        'விவசாயி பங்குத்தொகை செலுத்துவதற்கான உறுதிமொழி'
      ],
      en: [
        'Patta and Chitta',
        'VAO water level certificate & Adangal',
        'Aadhaar and bank passbook',
        'Undertaking for farmer beneficiary contribution'
      ]
    },
    howToApply: {
      ta: 'திண்டுக்கல் வேளாண் பொறியியல் துறைக்கு நால்ரோடு இ-சேவை மையம் வாயிலாக ஆன்லைனில் விண்ணப்பிக்கலாம்.',
      en: 'Apply online to Agricultural Engineering Department via Nalroad e-Seva Centre.'
    },
    officialLink: 'https://aed.tn.gov.in/',
    centreAssistance: true,
    featured: false
  },
  {
    id: 'cmchis_scheme',
    name: {
      ta: 'முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் (CMCHIS)',
      en: 'Chief Minister Comprehensive Health Insurance Scheme'
    },
    category: 'மருத்துவம் (Health)',
    sponsor: 'Tamil Nadu State',
    benefit: {
      ta: 'குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம் வரை கட்டணமில்லா அறுவை சிகிச்சை & மருத்துவ சிகிச்சை',
      en: 'Cashless hospital treatment up to ₹5 Lakhs per family per year'
    },
    description: {
      ta: 'ஏழை மற்றும் நடுத்தர குடும்பங்கள் தரமான மருத்துவ சிகிச்சை பெற அரசு மற்றும் தனியார் மருத்துவமனைகளில் பணமில்லா சிகிச்சை அளிக்கும் திட்டம்.',
      en: 'Cashless hospitalization and critical surgeries across empanelled hospitals for families with annual income < ₹1.2 Lakhs.'
    },
    targetAudience: {
      ta: 'குடும்ப ஆண்டு வருமானம் ₹1.2 லட்சத்திற்குள் உள்ள அனைத்து குடும்பங்கள்',
      en: 'Families with annual income up to ₹1,20,000 holding smart ration cards'
    },
    rules: {
      maxAnnualIncome: 120000
    },
    documents: {
      ta: [
        'குடும்ப அட்டை (Smart Ration Card)',
        'வருமானச் சான்றிதழ் (வருவாய்த் துறை வழங்கியது)',
        'குடும்பத்தினர் அனைவரின் ஆதார் அட்டைகள்'
      ],
      en: [
        'Smart Ration Card',
        'Income Certificate from Revenue Dept (< ₹1.2 Lakhs)',
        'Aadhaar cards of all family members'
      ]
    },
    howToApply: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் வருமானச் சான்றிதழ் பெற்று ஒட்டன்சத்திரம் வட்டாட்சியர் அலுவலக CMCHIS மையத்தில் கார்டு பெற்றுக் கொள்ளலாம்.',
      en: 'Obtain Revenue Income Certificate at Nalroad e-Seva, then visit Oddanchatram Taluk Office for card enrollment.'
    },
    officialLink: 'https://www.cmchistn.com/',
    centreAssistance: true,
    featured: true
  },
  {
    id: 'oap_scheme',
    name: {
      ta: 'முதியோர் உதவித்தொகை (IGNOAPS / OAP)',
      en: 'Indira Gandhi National Old Age Pension Scheme'
    },
    category: 'சமூக பாதுகாப்பு (Social Security)',
    sponsor: 'Joint',
    benefit: {
      ta: 'மாதம் ₹1,000 ஓய்வூதியம் வாழ்நாள் முழுவதும் நேரடி வங்கி வரவு',
      en: 'Monthly pension of ₹1,000 credited to bank account for life'
    },
    description: {
      ta: '60 வயது பூர்த்தியடைந்த ஆதரவற்ற முதியோர்களுக்கு அடிப்படை வாழ்வாதாரத்தை உறுதி செய்யும் மாதாந்திர ஓய்வூதியம்.',
      en: 'Monthly financial assistance to destitute senior citizens aged 60 and above with no source of regular livelihood.'
    },
    targetAudience: {
      ta: '60 வயதுக்கு மேற்பட்ட ஆதரவற்ற முதியோர்கள்',
      en: 'Senior citizens aged 60+ living in poverty'
    },
    rules: {
      minAge: 60,
      maxAnnualIncome: 100000
    },
    documents: {
      ta: [
        'விண்ணப்பதாரர் ஆதார் அட்டை',
        'வயது சான்று (ஆதார் / மருத்துவ வயது சான்று)',
        'குடும்ப அட்டை & வங்கி கணக்கு பாஸ்புக்'
      ],
      en: [
        'Aadhaar card',
        'Age proof (Aadhaar or medical fitness certificate)',
        'Smart Ration card and bank passbook'
      ]
    },
    howToApply: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் ஆவணங்களை சமர்ப்பித்து சமூக பாதுகாப்பு வட்டாட்சியர் ஒப்புதலுக்கு விண்ணப்பிக்கலாம்.',
      en: 'Submit documents at Nalroad e-Seva Centre for Oddanchatram Special Tahsildar (SSS) processing.'
    },
    officialLink: 'https://www.tnesevai.tn.gov.in/',
    centreAssistance: true,
    featured: true
  },
  {
    id: 'differently_abled_pension',
    name: {
      ta: 'மாற்றுத்திறனாளிகள் மாதாந்திர பராமரிப்பு உதவித்தொகை',
      en: 'Monthly Maintenance Allowance for Differently Abled'
    },
    category: 'சமூக பாதுகாப்பு (Social Security)',
    sponsor: 'Tamil Nadu State',
    benefit: {
      ta: 'மாதம் ₹1,500 முதல் ₹2,000 வரை வங்கி கணக்கில் வரவு',
      en: 'Monthly allowance of ₹1,500 to ₹2,000 credited directly to bank account'
    },
    description: {
      ta: '40% அல்லது அதற்கு மேற்பட்ட மாற்றுத்திறன் கொண்ட நபர்களுக்கு அவர்களின் வாழ்வாதாரத்தை காக்கும் வகையில் தமிழக அரசு வழங்கும் உதவித்தொகை.',
      en: 'Financial assistance for persons with disabilities having 40% or more disability.'
    },
    targetAudience: {
      ta: '40% மேல் மாற்றுத்திறன் கொண்ட நபர்கள்',
      en: 'Persons with physical, visual, hearing, or mental disabilities (40%+)'
    },
    rules: {
      requiresDisability: true
    },
    documents: {
      ta: [
        'மாற்றுத்திறனாளி தேசிய அடையாள அட்டை (UDID Card)',
        'மருத்துவ வாரிய சான்றிதழ் (Disability Certificate)',
        'ஆதார் அட்டை, குடும்ப அட்டை & வங்கி பாஸ்புக்'
      ],
      en: [
        'UDID Unique Disability ID Card',
        'Medical board disability certificate',
        'Aadhaar card, Ration card & Bank passbook'
      ]
    },
    howToApply: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையம் UDID பதிவு மற்றும் மாதாந்திர உதவித்தொகை விண்ணப்பம் செய்து தரும்.',
      en: 'UDID card enrollment and pension filing assisted at Nalroad e-Seva Centre.'
    },
    officialLink: 'https://www.swd.tn.gov.in/',
    centreAssistance: true,
    featured: false
  },
  {
    id: 'kalaignar_kanavu_illam',
    name: {
      ta: 'கலைஞர் கனவு இல்லம் திட்டம் (Kalaignar Kanavu Illam - ₹3.5 Lakhs)',
      en: 'Kalaignar Kanavu Illam Rural Housing Scheme'
    },
    category: 'வீட்டு வசதி (Housing)',
    sponsor: 'Tamil Nadu State',
    benefit: {
      ta: 'குடிசை இல்லாத கிராமங்களை உருவாக்க ₹3.5 லட்சம் அரசு மானியத்தில் கான்கிரீட் வீடு',
      en: 'Financial grant of ₹3.5 Lakhs to build a pucca concrete house in rural areas'
    },
    description: {
      ta: 'கிராமப்புறங்களில் குடிசை மற்றும் ஆஸ்பெஸ்டாஸ் வீடுகளில் வசிக்கும் ஏழை எளிய மக்களுக்கு பாதுகாப்பான கான்கிரீட் வீடு கட்டித் தரும் மாபெரும் திட்டம்.',
      en: 'State flagship initiative to transform all rural thatched and mud huts into modern concrete houses with toilets.'
    },
    targetAudience: {
      ta: 'பெரியகோட்டை கிராமத்தில் சொந்த மனை உள்ள குடிசை வாசிகள்',
      en: 'Hut dwellers in rural villages owning house patta/site'
    },
    rules: {
      maxAnnualIncome: 120000
    },
    documents: {
      ta: [
        'வீட்டு மனை பட்டா (House Site Patta) விண்ணப்பதாரர் பெயரில்',
        'தற்போதைய குடிசை வீட்டின் புகைப்படம் (விண்ணப்பதாரருடன்)',
        'ஆதார் அட்டை, குடும்ப அட்டை & வங்கி பாஸ்புக்'
      ],
      en: [
        'House site Patta in applicant name',
        'Photograph of current hut house with applicant',
        'Aadhaar card, Ration card, and bank passbook'
      ]
    },
    howToApply: {
      ta: 'பெரியகோட்டை கிராம ஊராட்சி செயலாளர் அல்லது ஒட்டன்சத்திரம் ஊராட்சி ஒன்றிய அலுவலகத்தில் பதிவு செய்ய நால்ரோடு மையம் ஆவணங்களை தயார் செய்து தரும்.',
      en: 'Document preparation at Nalroad e-Seva Centre for submission to Periyakottai Panchayat Secretary / BDO.'
    },
    officialLink: 'https://tnrd.tn.gov.in/',
    centreAssistance: true,
    featured: true
  }
];
