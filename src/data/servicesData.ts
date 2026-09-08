import { Service } from '@/types';

export const SERVICES_DATA: Service[] = [
  // 1. REVENUE CERTIFICATES
  {
    id: 'community_certificate',
    name: {
      ta: 'சாதி சான்றிதழ் (Community Certificate)',
      en: 'Community Certificate'
    },
    category: 'revenue',
    department: {
      ta: 'வருவாய்த் துறை (Revenue Department)',
      en: 'Revenue Department'
    },
    description: {
      ta: 'கல்வி, வேலைவாய்ப்பு மற்றும் அரசு சலுகைகள் பெற உங்கள் சமூகப் பிரிவை (SC / ST / BC / MBC / BCM) உறுதி செய்யும் அதிகாரப்பூர்வ சான்றிதழ்.',
      en: 'Official certificate verifying applicant social category (SC/ST/BC/MBC/BCM) for school/college admissions, jobs, and government reservations.'
    },
    eligibility: {
      ta: [
        'தமிழ்நாட்டில் வசிக்கும் குடிமக்கள்',
        'பெற்றோர் அல்லது ரத்த வழி உறவினர்களின் சாதி சான்றிதழ் உள்ளவர்கள்'
      ],
      en: [
        'Residents of Tamil Nadu',
        'Applicants possessing parents or blood relatives community proof'
      ]
    },
    documents: {
      ta: [
        'விண்ணப்பதாரரின் பாஸ்போர்ட் அளவு புகைப்படம்',
        'ஆதார் அட்டை நகல்',
        'குடும்ப அட்டை (Ration Card) அல்லது இருப்பிட சான்று',
        'தந்தை / தாய் / உடன் பிறந்தோரின் சாதி சான்றிதழ் நகல்',
        'பள்ளி மாற்றுச் சான்றிதழ் (TC) நகல் (மாணவர்களுக்கு)'
      ],
      en: [
        'Passport size photograph',
        'Aadhaar card copy',
        'Smart Ration card or residence proof',
        'Father / Mother / Sibling Community Certificate copy',
        'School Transfer Certificate (TC) copy'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹60 (இ-சேவை மையம்)',
      en: 'Government Fee ₹60 (at e-Seva Centre)'
    },
    timeEstimate: {
      ta: 'விண்ணப்பித்த 7 முதல் 15 வேலை நாட்களுக்குள்',
      en: '7 to 15 working days from application'
    },
    officialPortal: 'https://www.tnesevai.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்திற்கு அசல் ஆவணங்களுடன் வரவும். ஸ்கேன் செய்யப்பட்டு VAO, RI மற்றும் வட்டாட்சியர் (Tahsildar) ஒப்புதலுக்கு அனுப்பப்படும்.',
      en: 'Visit Nalroad Makkal e-Seva Centre with original documents. Uploaded to Revenue Portal for VAO, Revenue Inspector and Tahsildar approval.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['community', 'sathi', 'jathi', 'சாதி', 'ஜாதி', 'சான்றிதழ்', 'certificate', 'bc', 'mbc', 'sc', 'st']
  },
  {
    id: 'income_certificate',
    name: {
      ta: 'வருமான சான்றிதழ் (Income Certificate)',
      en: 'Income Certificate'
    },
    category: 'revenue',
    department: {
      ta: 'வருவாய்த் துறை (Revenue Department)',
      en: 'Revenue Department'
    },
    description: {
      ta: 'குடும்பத்தின் அனைத்து வழிகளிலுமான ஆண்டு வருமானத்தை உறுதி செய்யும் சான்றிதழ். கல்வி உதவித்தொகை, கட்டணச் சலுகை மற்றும் நலத்திட்டங்களுக்கு அவசியம்.',
      en: 'Official document certifying total annual household income from all sources. Essential for scholarships, fee concessions, and government welfare schemes.'
    },
    eligibility: {
      ta: [
        'குடும்பத்தில் வருமானம் ஈட்டும் அனைத்து நபர்களின் விவரம் அளிக்கப்பட வேண்டும்',
        'விவசாய வருமானம், கூலி வருமானம் அல்லது வணிக வருமானம் குறிப்பிட வேண்டும்'
      ],
      en: [
        'Details of all earning household members must be declared',
        'Covers agricultural, wage, or commercial income'
      ]
    },
    documents: {
      ta: [
        'விண்ணப்பதாரர் புகைப்படம்',
        'ஆதார் அட்டை',
        'குடும்ப அட்டை (Ration Card)',
        'ஊதியச் சான்று (Salary Slip) அல்லது வங்கி கணக்கு அறிக்கை (பொருந்துமானால்)',
        'சுய உறுதிமொழி ஆவணம் (மையத்தில் வழங்கப்படும்)'
      ],
      en: [
        'Applicant photograph',
        'Aadhaar card copy',
        'Ration card copy',
        'Salary certificate or bank statement (if salaried)',
        'Self-declaration format (provided at centre)'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹60 (இ-சேவை மையம்)',
      en: 'Government Fee ₹60 (at e-Seva Centre)'
    },
    timeEstimate: {
      ta: '7 முதல் 15 வேலை நாட்கள்',
      en: '7 to 15 working days'
    },
    officialPortal: 'https://www.tnesevai.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் விண்ணப்பித்த பின் கிராம நிர்வாக அலுவலர் (VAO) மற்றும் வருவாய் ஆய்வாளர் (RI) விசாரணை செய்து வட்டாட்சியர் ஒப்புதல் அளிப்பார்.',
      en: 'Apply at Nalroad e-Seva Centre; field verification conducted by VAO & RI before Tahsildar approval.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['income', 'varumanam', 'வருமானம்', 'வருமான சான்றிதழ்', 'வருமானம்', 'salary', 'scholarship']
  },
  {
    id: 'nativity_certificate',
    name: {
      ta: 'இருப்பிட சான்றிதழ் (Nativity / Residence Certificate)',
      en: 'Nativity / Residence Certificate'
    },
    category: 'revenue',
    department: {
      ta: 'வருவாய்த் துறை (Revenue Department)',
      en: 'Revenue Department'
    },
    description: {
      ta: 'விண்ணப்பதாரர் தமிழ்நாட்டில் அல்லது பெரியகோட்டை கிராமத்தில் தொடர்ந்து வசித்து வருவதை உறுதி செய்யும் அதிகாரப்பூர்வ சான்றிதழ்.',
      en: 'Certifies that the applicant is a native/permanent resident of Tamil Nadu, required for state quotas in education and employment.'
    },
    eligibility: {
      ta: ['தமிழ்நாட்டில் குறைந்தபட்சம் 5 ஆண்டுகள் தொடர்ந்து வசிப்பவர்'],
      en: ['Continuous residence in Tamil Nadu for a minimum of 5 years']
    },
    documents: {
      ta: [
        'புகைப்படம்',
        'ஆதார் அட்டை',
        'குடும்ப அட்டை / வாக்காளர் அடையாள அட்டை',
        'பள்ளி மாற்றுச் சான்றிதழ் (TC) அல்லது 5 ஆண்டு இருப்பிட ஆதாரம் (மின் கட்டண ரசீது / வரி ரசீது)'
      ],
      en: [
        'Applicant photograph',
        'Aadhaar card',
        'Smart Ration card or Voter ID',
        'School TC or 5-year residential proof (EB bill / house tax receipt)'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹60',
      en: 'Government Fee ₹60'
    },
    timeEstimate: {
      ta: '7 முதல் 15 நாட்கள்',
      en: '7 to 15 days'
    },
    officialPortal: 'https://www.tnesevai.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் விண்ணப்பம் பதிவு செய்யலாம்.',
      en: 'Online submission at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['nativity', 'residence', 'iruppidam', 'இருப்பிடம்', 'வசிப்பிடம்', 'இருப்பிட சான்றிதழ்']
  },
  {
    id: 'first_graduate_certificate',
    name: {
      ta: 'முதல் பட்டதாரி சான்றிதழ் (First Graduate Certificate)',
      en: 'First Graduate Certificate'
    },
    category: 'revenue',
    department: {
      ta: 'வருவாய்த் துறை & உயர்கல்வித் துறை',
      en: 'Revenue & Higher Education Department'
    },
    description: {
      ta: 'குடும்பத்தில் முதல் முறையாக பட்டப்படிப்பு படிக்கும் மாணவர்களுக்கு அரசு கல்லூரிகள் மற்றும் பொறியியல் கலந்தாய்வில் கல்விக் கட்டண விலக்கு பெற உதவும் சான்றிதழ்.',
      en: 'Tuition fee concession certificate for students whose parents and siblings have not completed graduation.'
    },
    eligibility: {
      ta: [
        'குடும்பத்தில் எவரும் பட்டப்படிப்பு முடித்திருக்கக் கூடாது (தந்தை, தாய், உடன்பிறப்புகள்)',
        'தமிழ்நாட்டில் உள்ள உயர் கல்வி நிறுவனத்தில் சேரும் மாணவர்'
      ],
      en: [
        'No member in the family (parents and elder siblings) should be a graduate',
        'Student enrolling in higher education / engineering / medical counseling'
      ]
    },
    documents: {
      ta: [
        'மாணவர் மற்றும் பெற்றோர் ஆதார் அட்டைகள்',
        'குடும்ப அட்டை (Ration Card)',
        'பெற்றோர் மற்றும் உடன் பிறந்தோரின் பள்ளி மாற்றுச் சான்றிதழ்கள் (TC)',
        '10-ம் மற்றும் 12-ம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்',
        'முதல் பட்டதாரி உறுதிமொழி பத்திரம் (சுய கையொப்பம்)'
      ],
      en: [
        'Student and parents Aadhaar cards',
        'Ration card',
        'Transfer Certificates (TC) of parents and all siblings',
        '10th and 12th standard mark sheets',
        'First Graduate declaration affidavit'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹60',
      en: 'Government Fee ₹60'
    },
    timeEstimate: {
      ta: '10 முதல் 15 வேலை நாட்கள்',
      en: '10 to 15 working days'
    },
    officialPortal: 'https://www.tnesevai.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் தேவையான அனைத்து சான்றிதழ்களையும் கொண்டு வந்து விண்ணப்பிக்கலாம்.',
      en: 'Submit at Nalroad e-Seva Centre with sibling educational proofs.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['first graduate', 'முதல் பட்டதாரி', 'kalloori', 'engineering fee', 'tnea', 'படிப்பு']
  },
  {
    id: 'legal_heir_certificate',
    name: {
      ta: 'வாரிசு சான்றிதழ் (Legal Heir Certificate)',
      en: 'Legal Heir Certificate'
    },
    category: 'revenue',
    department: {
      ta: 'வருவாய்த் துறை (Revenue Department)',
      en: 'Revenue Department'
    },
    description: {
      ta: 'குடும்பத்தில் ஒருவர் இறந்துவிட்டால், அவரது சொத்துக்கள், வங்கி சேமிப்பு மற்றும் அரசு பணப்பலன்களைப் பெற சட்டப்படியான வாரிசுகளை உறுதி செய்யும் சான்றிதழ்.',
      en: 'Certifies the legal heirs of a deceased person for transferring property, pension benefits, bank deposits, and government settlements.'
    },
    eligibility: {
      ta: ['இறந்தவரின் மனைவி/கணவர், பிள்ளைகள் அல்லது பெற்றோர்கள் மட்டுமே விண்ணப்பிக்க முடியும்'],
      en: ['Spouse, children, or parents of the deceased']
    },
    documents: {
      ta: [
        'இறந்தவரின் அசல் இறப்பு சான்றிதழ் (Death Certificate)',
        'இறந்தவரின் ஆதார் அட்டை & குடும்ப அட்டை நகல்',
        'அனைத்து வாரிசுதாரர்களின் ஆதார் அட்டைகள் & புகைப்படங்கள்',
        'வாரிசுதாரர்களின் பிறப்பு சான்றிதழ் அல்லது திருமண சான்றிதழ்',
        'நோட்டரி வழக்கறிஞர் உறுதிமொழி பத்திரம்'
      ],
      en: [
        'Original Death Certificate of the deceased',
        'Aadhaar and Ration card of deceased',
        'Aadhaar cards and photographs of all surviving legal heirs',
        'Birth certificates or marriage proofs of heirs',
        'Notarized affidavit'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹60',
      en: 'Government Fee ₹60'
    },
    timeEstimate: {
      ta: '15 முதல் 30 நாட்கள் (விசாரணைக்கு பின்)',
      en: '15 to 30 days (subject to field inquiry)'
    },
    officialPortal: 'https://www.tnesevai.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் ஆவணங்களை பதிவேற்றலாம். கிராம நிர்வாக அலுவலர் (VAO) வாரிசுதாரர்கள் குறித்து கிராமத்தில் நேரடி விசாரணை நடத்துவார்.',
      en: 'Apply through Nalroad e-Seva Centre. Physical inquiry conducted by local VAO and Revenue Inspector.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['legal heir', 'varisu', 'வாரிசு', 'வாரிசு சான்றிதழ்', 'இறப்பு', 'death', 'property']
  },
  {
    id: 'small_marginal_farmer_certificate',
    name: {
      ta: 'சிறு / குறு விவசாயி சான்றிதழ் (Small / Marginal Farmer Certificate)',
      en: 'Small / Marginal Farmer Certificate'
    },
    category: 'agriculture',
    department: {
      ta: 'வருவாய்த் துறை & வேளாண்மைத் துறை',
      en: 'Revenue & Agriculture Department'
    },
    description: {
      ta: 'சொட்டு நீர் பாசனத்திற்கு 100% அரசு மானியம், பயிர்க்கடன் தள்ளுபடி மற்றும் வேளாண் உபகரண மானியங்கள் பெற 2.5 ஏக்கர் (நன்செய்) அல்லது 5 ஏக்கர் (புன்செய்) நிலம் கொண்ட விவசாயிகளுக்கு வழங்கப்படும் சான்றிதழ்.',
      en: 'Required to avail 100% subsidy on drip irrigation, farm machinery subsidies, and subsidized agriculture loans for farmers holding up to 2.5 acres of wetland or 5 acres of dryland.'
    },
    eligibility: {
      ta: [
        'குறு விவசாயி: 2.5 ஏக்கர் வரை நிலம் வைத்திருப்பவர்',
        'சிறு விவசாயி: 2.5 முதல் 5 ஏக்கர் வரை நிலம் வைத்திருப்பவர்'
      ],
      en: [
        'Marginal farmer: holding up to 2.5 acres',
        'Small farmer: holding 2.5 to 5.0 acres'
      ]
    },
    documents: {
      ta: [
        'விவசாயியின் ஆதார் அட்டை',
        'குடும்ப அட்டை (Ration Card)',
        'நிலத்தின் தற்போதைய பட்டா நகல்',
        'கிராம நிர்வாக அலுவலர் (VAO) வழங்கிய அடங்கல் நகல்',
        'பாஸ்போர்ட் அளவு புகைப்படம்'
      ],
      en: [
        'Farmer Aadhaar card',
        'Ration card',
        'Latest Patta copy',
        'Adangal extract from VAO',
        'Passport photograph'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹60',
      en: 'Government Fee ₹60'
    },
    timeEstimate: {
      ta: '7 முதல் 15 வேலை நாட்கள்',
      en: '7 to 15 working days'
    },
    officialPortal: 'https://www.tnesevai.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்திற்கு பட்டா மற்றும் அடங்கலுடன் வந்தால் விண்ணப்பம் செய்து தரப்படும்.',
      en: 'Submit at Nalroad e-Seva Centre with Patta and current fasli Adangal.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['small farmer', 'marginal farmer', 'சிறு விவசாயி', 'குறு விவசாயி', 'விவசாயம்', 'drip subsidy', 'பாசனம்']
  },

  // 2. LAND & SURVEY (நிலம் & பட்டா)
  {
    id: 'patta_transfer',
    name: {
      ta: 'பட்டா மாறுதல் (Patta Transfer - உட்பிரிவு இல்லாதது & உட்பிரிவு உள்ளது)',
      en: 'Patta Transfer (Sub-division / Non-subdivision)'
    },
    category: 'land',
    department: {
      ta: 'நில அளவை மற்றும் நிலவரித் திட்டம் (Survey and Settlement Dept)',
      en: 'Survey & Settlement / Revenue Dept'
    },
    description: {
      ta: 'பத்திரம் பதிவு செய்யப்பட்ட விவசாய நிலம் அல்லது வீட்டடி மனையை வாங்கியவர் பெயருக்கு பட்டா மாற்றம் செய்யும் அதிகாரப்பூர்வ சேவை.',
      en: 'Online application for transferring title deed / Patta ownership to buyer’s name following property registration.'
    },
    eligibility: {
      ta: [
        'சார்பதிவாளர் அலுவலகத்தில் பதிவு செய்யப்பட்ட கிரையப் பத்திரம், தானப் பத்திரம் அல்லது பாகப்பிரிவினை பத்திரம் உள்ளவர்கள்',
        'வாரிசு உரிமை அடிப்படையில் நிலம் பெற்றவர்கள்'
      ],
      en: [
        'Registered sale deed, gift deed, or partition deed from Sub-Registrar Office',
        'Inheritance of ancestral land with legal heir documents'
      ]
    },
    documents: {
      ta: [
        'பதிவு செய்யப்பட்ட கிரையப் பத்திரம் (Sale Deed) முழு நகல்',
        'முந்தைய மூலப் பத்திரம் (Parent Document)',
        'தற்போதைய பட்டா எண் அல்லது முந்தைய பட்டா நகல்',
        'வில்லங்கச் சான்றிதழ் (EC)',
        'விண்ணப்பதாரர் ஆதார் அட்டை & தொலைபேசி எண்'
      ],
      en: [
        'Full copy of registered Sale Deed / Document',
        'Parent document copy',
        'Existing Patta number or copy',
        'Encumbrance Certificate (EC)',
        'Applicant Aadhaar card & mobile number'
      ]
    },
    fee: {
      ta: 'உட்பிரிவு இல்லாதது: ₹60 | உட்பிரிவு தேவைப்படுவது: அரசு நிர்ணயித்த நில அளவைக் கட்டணம் (சுமார் ₹400 - ₹800)',
      en: 'Without sub-division: ₹60 | With sub-division: Official survey fee (approx ₹400 - ₹800)'
    },
    timeEstimate: {
      ta: 'உட்பிரிவு இல்லையெனில் 15-30 நாட்கள்; உட்பிரிவு எனில் 30-45 நாட்கள் (சர்வேயர் அளவீடு செய்த பின்)',
      en: '15-30 days without sub-division; 30-45 days with field survey'
    },
    officialPortal: 'https://eservices.tn.gov.in/eservicesnew/land/chitta.html',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் உங்கள் பத்திரத்தை கொண்டு வாருங்கள். தமிழ்நாடு AnyWhere AnyTime e-Services போர்ட்டலில் உடனடியாக பதிவேற்றம் செய்யப்படும். சர்வேயர் மற்றும் வட்டாட்சியர் ஒப்புதல் நிலை கண்காணிக்கப்படும்.',
      en: 'Bring registration deed to Nalroad e-Seva Centre. Uploaded via AnyWhere AnyTime portal with direct tracking.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['patta', 'patta transfer', 'பட்டா', 'பட்டா மாறுதல்', 'chitta', 'சிட்டா', 'நிலம்', 'பத்திரம்', 'சர்வே']
  },
  {
    id: 'view_patta_chitta',
    name: {
      ta: 'பட்டா / சிட்டா நகல் பதிவிறக்கம் (View Patta / Chitta Online)',
      en: 'View & Download Patta / Chitta'
    },
    category: 'land',
    department: {
      ta: 'வருவாய் மற்றும் நில நிர்வாகத் துறை',
      en: 'Revenue & Land Administration'
    },
    description: {
      ta: 'உங்கள் நிலத்தின் பட்டா எண், சர்வே எண் மற்றும் உரிமையாளர் பெயரைக் கொண்டு தமிழ்நாடு அரசின் அதிகாரப்பூர்வ சிட்டா நகலை உடனடி பதிவிறக்கம் செய்தல்.',
      en: 'Instant viewing and printing of digitally signed Patta / Chitta extract from Tamil Nadu Land Records portal.'
    },
    eligibility: {
      ta: ['தமிழ்நாட்டில் நிலம் வைத்துள்ள எவரும் நில விவரம் அறிந்து கொள்ள முடியும்'],
      en: ['Open to any landowner possessing district, taluk, village and survey/patta number']
    },
    documents: {
      ta: [
        'மாவட்டம்: திண்டுக்கல்',
        'தாலுகா: ஒட்டன்சத்திரம்',
        'கிராமம்: பெரியகோட்டை அல்லது சுற்றுவட்டார கிராமம்',
        'பட்டா எண் அல்லது சர்வே எண் / உட்பிரிவு எண்'
      ],
      en: [
        'District: Dindigul',
        'Taluk: Oddanchatram',
        'Village: Periyakottai / relevant village',
        'Patta number OR Survey / Sub-division number'
      ]
    },
    fee: {
      ta: 'அரசு பார்வை இலவசம் (மையத்தில் பிரிண்ட் எடுக்க சிறிய சேவை கட்டணம் ₹20-30)',
      en: 'Free government viewing (Printout service at centre ₹20-30)'
    },
    timeEstimate: {
      ta: 'உடனடி பதிவிறக்கம் (2 நிமிடங்கள்)',
      en: 'Instant (under 2 minutes)'
    },
    officialPortal: 'https://eservices.tn.gov.in/eservicesnew/land/chitta.html',
    offlineProcedure: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் உங்கள் பட்டா எண் அல்லது சர்வே எண்ணைக் கூறி உடனே அசல் அரசு நகல் பிரிண்ட் எடுத்துக் கொள்ளலாம்.',
      en: 'Get an instant digitally verified printout at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['chitta', 'patta copy', 'சிட்டா', 'பட்டா நகல்', 'சர்வே எண்', 'நில விவரம்', 'land records']
  },
  {
    id: 'encumbrance_certificate',
    name: {
      ta: 'வில்லங்கச் சான்றிதழ் - EC (Encumbrance Certificate - TNREGINET)',
      en: 'Encumbrance Certificate (EC)'
    },
    category: 'land',
    department: {
      ta: 'பதிவுத் துறை (Registration Department - TNREGINET)',
      en: 'Registration Department (TNREGINET)'
    },
    description: {
      ta: 'ஒரு நிலம் அல்லது வீட்டின் மீது முந்தைய ஆண்டுகளில் நடைபெற்ற அடமானம், விற்பனை மற்றும் வில்லங்க விவரங்களை அறிய உதவும் சான்றிதழ்.',
      en: 'Tracks property transaction history, registered mortgages, sales, or encumbrances for specified survey numbers over any timeframe.'
    },
    eligibility: {
      ta: ['நிலம் வாங்க விரும்புவோர் அல்லது வங்கி கடன் பெற விரும்புவோர்'],
      en: ['Anyone verifying property ownership history or applying for bank loans']
    },
    documents: {
      ta: [
        'சார்பதிவாளர் அலுவலகம்: ஒட்டன்சத்திரம்',
        'கிராமம் பெயர்: பெரியகோட்டை',
        'சர்வே எண் மற்றும் உட்பிரிவு எண்',
        'எந்த ஆண்டு முதல் எந்த ஆண்டு வரை விவரம் தேவை என்ற காலம்'
      ],
      en: [
        'Sub-Registrar Office: Oddanchatram',
        'Village: Periyakottai',
        'Survey and sub-division number',
        'Required search period (from date to date)'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் காலத்தைப் பொறுத்து ₹30 முதல் ₹100 வரை',
      en: 'Government search fee ₹30 to ₹100 based on years searched'
    },
    timeEstimate: {
      ta: 'இணையதள நகல் உடனே கிடைக்கும்; கையொப்பமிட்ட சான்றிதழ் 3 நாட்கள்',
      en: 'Online viewing instant; certified digital copy within 3 days'
    },
    officialPortal: 'https://tnreginet.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மையத்தில் சர்வே எண்ணைக் கொடுத்து உடனடி வில்லங்க விவர அறிக்கை பெறலாம்.',
      en: 'Obtain EC search report instantly at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['ec', 'villangam', 'வில்லங்கம்', 'வில்லங்க சான்றிதழ்', 'tnreginet', 'பத்திரம்', 'mortgage']
  },

  // 3. CIVIL SUPPLIES & RATION (குடும்ப அட்டை)
  {
    id: 'new_smart_ration_card',
    name: {
      ta: 'புதிய ஸ்மார்ட் குடும்ப அட்டை (New Smart Ration Card - TNPDS)',
      en: 'New Smart Ration Card Application'
    },
    category: 'civil_supplies',
    department: {
      ta: 'உணவு மற்றும் நுகர்வோர் பாதுகாப்புத் துறை (TNPDS)',
      en: 'Civil Supplies & Consumer Protection (TNPDS)'
    },
    description: {
      ta: 'திருமணம் ஆன புதிய தம்பதிகள் அல்லது தனிக் குடும்பங்களுக்கு ரேஷன் பொருட்கள், இலவச அரிசி மற்றும் மகளிர் உரிமைத் தொகை பெற ஸ்மார்ட் குடும்ப அட்டை வழங்குதல்.',
      en: 'Application for newly married couples or separate households for subsidized civil supplies, free rice, and welfare entitlement eligibility.'
    },
    eligibility: {
      ta: [
        'தமிழ்நாட்டில் வசிக்கும் தனிக்குடும்பம்',
        'பெற்றோர் குடும்ப அட்டையிலிருந்து பெயர் நீக்கப்பட்டதற்கான நீக்கல் சான்று (Surrender Certificate) இருக்க வேண்டும்'
      ],
      en: [
        'Independent household residing in Tamil Nadu',
        'Name removal / surrender certificate from parents ration card'
      ]
    },
    documents: {
      ta: [
        'குடும்பத் தலைவர் (பெண்) புகைப்படம்',
        'குடும்ப உறுப்பினர்கள் அனைவரின் ஆதார் அட்டை நகல்கள்',
        'இருப்பிட ஆதாரம் (மின் கட்டண ரசீது / வாடகை ஒப்பந்தம் / வீட்டு வரி ரசீது)',
        'பெற்றோர் குடும்ப அட்டையிலிருந்து பெயர் நீக்கப்பட்டதற்கான ரசீது',
        'திருமணப் பத்திரிக்கை அல்லது திருமணப் பதிவுச் சான்றிதழ்'
      ],
      en: [
        'Head of family (female head) photo',
        'Aadhaar cards of all family members',
        'Address proof (EB receipt, gas bill, or house tax receipt)',
        'Name removal / deletion certificate from previous card',
        'Marriage invitation or certificate'
      ]
    },
    fee: {
      ta: 'அரசு இணையதள விண்ணப்பம் இலவசம் (மைய சேவை கட்டணம் ₹50-60)',
      en: 'Government portal free; centre online processing fee ₹50-60'
    },
    timeEstimate: {
      ta: '15 முதல் 30 நாட்கள் (உணவு வழங்கல் ஆய்வாளர் கள விசாரணைக்கு பின்)',
      en: '15 to 30 days after inspection by Civil Supplies Officer (TSO)'
    },
    officialPortal: 'https://www.tnpds.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் பெயர் நீக்கல் மற்றும் புதிய அட்டைக்கான விண்ணப்பம் இரண்டும் செய்து தரப்படும்.',
      en: 'Both member deletion from old card and fresh card registration handled at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['ration', 'smart card', 'tnpds', 'குடும்ப அட்டை', 'ரேஷன் அட்டை', 'ரேஷன்', 'அரிசி அட்டை']
  },
  {
    id: 'ration_card_member_addition',
    name: {
      ta: 'குடும்ப அட்டையில் புதிய உறுப்பினர் சேர்த்தல் (Add Member in Ration Card)',
      en: 'Add Member in Smart Ration Card'
    },
    category: 'civil_supplies',
    department: {
      ta: 'உணவுப் பொருள் வழங்கல் துறை (TNPDS)',
      en: 'Civil Supplies (TNPDS)'
    },
    description: {
      ta: 'குடும்பத்தில் புதிதாகப் பிறந்த குழந்தை அல்லது திருமணமாகி வந்த மருமகள் பெயரை ஸ்மார்ட் ரேஷன் கார்டில் சேர்த்தல்.',
      en: 'Add newborn child or newly married daughter-in-law to family ration card.'
    },
    eligibility: {
      ta: ['குழந்தை எனில் பிறப்புச் சான்றிதழ்; மருமகள் எனில் முந்தைய குடும்ப அட்டையிலிருந்து பெயர் நீக்கப்பட்ட சான்று'],
      en: ['Birth certificate for child; removal slip from maternal card for bride']
    },
    documents: {
      ta: [
        'ஸ்மார்ட் குடும்ப அட்டை எண்',
        'சேர்க்கப்பட வேண்டிய நபரின் ஆதார் அட்டை (குழந்தைகளுக்கு பிறப்புச் சான்றிதழ்)',
        'பெயர் நீக்கல் சான்றிதழ் (திருமணம் ஆனவருக்கு)'
      ],
      en: [
        'Existing Smart Ration card number',
        'Aadhaar card of member (Birth certificate for child below 5)',
        'Name removal slip from parent card (for spouse)'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் இல்லை (மைய சேவை கட்டணம் ₹30-50)',
      en: 'Govt free (Centre service fee ₹30-50)'
    },
    timeEstimate: {
      ta: '7 முதல் 15 நாட்கள்',
      en: '7 to 15 days'
    },
    officialPortal: 'https://www.tnpds.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் உடனே ஆன்லைனில் விண்ணப்பிக்கலாம்.',
      en: 'Instant online filing at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['ration member', 'குழந்தை பெயர் சேர்க்க', 'ரேஷன் சேர்த்தல்', 'tnpds update']
  },

  // 4. SOCIAL SECURITY & PENSIONS (சமூகப் பாதுகாப்பு)
  {
    id: 'old_age_pension',
    name: {
      ta: 'முதியோர் உதவித்தொகை - OAP (Indira Gandhi Old Age Pension Scheme)',
      en: 'Old Age Pension (IGNOAPS / OAP)'
    },
    category: 'social_security',
    department: {
      ta: 'சமூகப் பாதுகாப்புத் திட்டம் - வருவாய்த் துறை',
      en: 'Social Security Schemes - Revenue Department'
    },
    description: {
      ta: '60 வயதுக்கு மேற்பட்ட ஆதரவற்ற முதியோர்களுக்கு மாதம் ₹1,000 வங்கி கணக்கில் அரசு உதவித்தொகை வழங்கும் திட்டம்.',
      en: 'Monthly pension of ₹1,000 directly credited to bank account for destitute senior citizens aged 60 and above.'
    },
    eligibility: {
      ta: [
        'வயது 60 அல்லது அதற்கு மேல் இருக்க வேண்டும்',
        'ஆதரவற்ற நிலையில் இருப்பவர் (ஆண்டு வருமானம் ₹1,00,000-க்குள் இருக்க வேண்டும்)',
        'வேறு எந்த அரசு ஓய்வூதியமும் பெறாதவராக இருத்தல் வேண்டும்'
      ],
      en: [
        'Age 60 years or above',
        'Destitute status with family income below ₹1,00,000',
        'Must not be receiving any other government pension'
      ]
    },
    documents: {
      ta: [
        'விண்ணப்பதாரரின் ஆதார் அட்டை',
        'வயதுக்கான சான்று (ஆதார் அல்லது பள்ளி சான்றிதழ் அல்லது மருத்துவ வயது சான்று)',
        'குடும்ப அட்டை (Ration card)',
        'வங்கி கணக்கு புத்தக நகல் (Account Number & IFSC Code)',
        'பாஸ்போர்ட் அளவு புகைப்படம்'
      ],
      en: [
        'Applicant Aadhaar card',
        'Age proof (Aadhaar or medical age certificate)',
        'Ration card',
        'Bank passbook copy with IFSC',
        'Passport photograph'
      ]
    },
    fee: {
      ta: 'விண்ணப்பம் முற்றிலும் இலவசம் (இ-சேவை மையம் அரசு கட்டணம் ₹60)',
      en: 'Scheme is free (Govt processing fee ₹60 at e-Seva)'
    },
    timeEstimate: {
      ta: '30 முதல் 45 நாட்கள் (சமூக பாதுகாப்பு வட்டாட்சியர் கள ஆய்வுக்கு பின்)',
      en: '30 to 45 days upon verification by Special Tahsildar (SSS)'
    },
    officialPortal: 'https://www.tnesevai.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு இ-சேவை மையத்திற்கு வங்கி பாஸ்புக் மற்றும் ஆதாருடன் வந்தால் விண்ணப்பம் செய்து தரப்படும். ஒட்டன்சத்திரம் சமூக பாதுகாப்பு வட்டாட்சியர் அலுவலகம் ஆய்வு செய்யும்.',
      en: 'Apply at Nalroad e-Seva Centre with bank passbook and Aadhaar. Field inspection conducted by Oddanchatram SSS office.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['oap', 'muthiyor', 'முதியோர்', 'ஓய்வூதியம்', 'முதியோர் உதவித்தொகை', 'pension', 'old age', '1000']
  },
  {
    id: 'destitute_widow_pension',
    name: {
      ta: 'விதவை உதவித்தொகை (Destitute Widow Pension Scheme)',
      en: 'Destitute Widow Pension Scheme'
    },
    category: 'social_security',
    department: {
      ta: 'வருவாய்த் துறை (சமூக பாதுகாப்புத் திட்டம்)',
      en: 'Revenue Dept (Social Security)'
    },
    description: {
      ta: 'கணவனை இழந்த ஆதரவற்ற பெண்களுக்கு மாதந்தோறும் ₹1,000 நிதி உதவி வழங்கும் தமிழ்நாடு அரசு திட்டம்.',
      en: 'Monthly financial assistance of ₹1,000 for destitute widows.'
    },
    eligibility: {
      ta: [
        'கணவர் இறந்திருக்க வேண்டும்',
        'மறுமணம் செய்யாதவராக இருக்க வேண்டும்',
        'ஆண்டு வருமானம் ₹1,00,000-க்குள் இருக்க வேண்டும்'
      ],
      en: [
        'Husband must be deceased',
        'Must not have remarried',
        'Annual income must not exceed ₹1,00,000'
      ]
    },
    documents: {
      ta: [
        'கணவரின் அசல் இறப்புச் சான்றிதழ் (Husband Death Certificate)',
        'விதவை சான்றிதழ் அல்லது வருவாய்த் துறை அறிக்கை',
        'விண்ணப்பதாரர் ஆதார் அட்டை',
        'குடும்ப அட்டை',
        'வங்கி கணக்கு பாஸ்புக் நகல்'
      ],
      en: [
        'Original death certificate of husband',
        'Destitute Widow certificate / verification report',
        'Applicant Aadhaar card',
        'Ration card',
        'Bank passbook copy'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹60',
      en: 'Government Fee ₹60'
    },
    timeEstimate: {
      ta: '30 நாட்கள்',
      en: '30 days'
    },
    officialPortal: 'https://www.tnesevai.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் கணவரின் இறப்புச் சான்றிதழுடன் வந்து விண்ணப்பிக்கலாம்.',
      en: 'Apply through Nalroad e-Seva Centre with husband death certificate.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['widow pension', 'vidhavai', 'விதவை', 'விதவை உதவித்தொகை', 'ஆதரவற்ற விதவை', 'மகளிர்']
  },

  // 5. FARMER & AGRICULTURE (விவசாயம்)
  {
    id: 'pm_kisan_registration',
    name: {
      ta: 'PM கிசான் சம்மான் நிதி & e-KYC (PM-KISAN ₹6,000 Scheme)',
      en: 'PM-KISAN Registration & Biometric e-KYC'
    },
    category: 'agriculture',
    department: {
      ta: 'மத்திய வேளாண்மை மற்றும் உழவர் நலத்துறை',
      en: 'Ministry of Agriculture & Farmers Welfare'
    },
    description: {
      ta: 'சொந்த விவசாய நிலம் வைத்துள்ள தகுதியான விவசாயிகளுக்கு ஆண்டுக்கு ₹6,000 (மூன்று தவணைகளாக தலா ₹2,000) நேரடி வங்கி பரிமாற்றம் செய்யும் திட்டம்.',
      en: 'Direct Income Support of ₹6,000 per year in three 4-monthly installments of ₹2,000 to all landholding farmer families.'
    },
    eligibility: {
      ta: [
        'சொந்த பெயரில் விவசாய நிலம் உள்ள உழவர்கள்',
        'நில பட்டா 01-02-2019 தேதிக்கு முன் பதிவு செய்யப்பட்டிருக்க வேண்டும்',
        'அரசு ஊழியர்கள், ஓய்வுபெற்ற அதிகாரிகள், வருமான வரி செலுத்துபவர்கள் தகுதி பெற மாட்டார்கள்'
      ],
      en: [
        'Farmer families with cultivable landholding in their name',
        'Land ownership registered prior to 01-02-2019',
        'Excludes institutional landholders, income tax payees, and government employees'
      ]
    },
    documents: {
      ta: [
        'விவசாயியின் ஆதார் அட்டை (ஆதார் இணைக்கப்பட்ட மொபைல் எண் அவசியம்)',
        'நிலத்தின் பட்டா எண் / சிட்டா நகல்',
        'ஆதாருடன் இணைக்கப்பட்ட தேசியமயமாக்கப்பட்ட வங்கி கணக்கு (Aadhaar Seeding / NPCI Mapping)',
        'குடும்ப அட்டை'
      ],
      en: [
        'Farmer Aadhaar card with mobile linked',
        'Land Patta / Chitta document',
        'Aadhaar-seeded bank account (NPCI / DBT enabled)',
        'Ration card'
      ]
    },
    fee: {
      ta: 'புதிய பதிவு அரசு கட்டணம் இலவசம் (மையத்தில் e-KYC கைரேகை ₹20-30)',
      en: 'Government registration free (Biometric e-KYC fee ₹20-30 at centre)'
    },
    timeEstimate: {
      ta: 'ஒட்டன்சத்திரம் வேளாண் அலுவலர் கள ஆய்வுக்கு பின் அடுத்த தவணையில் பணம் வரவு வைக்கப்படும்',
      en: 'Credit commences from next installment post Oddanchatram Agri Dept approval'
    },
    officialPortal: 'https://pmkisan.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்திற்கு வந்து கைரேகை மூலம் பயோமெட்ரிக் e-KYC செய்துகொள்ளலாம். NPCI வங்கி இணைப்பு நிலையும் சரிபார்க்கப்படும்.',
      en: 'Complete biometric e-KYC and check NPCI DBT bank linking status at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['pm kisan', 'கிசான்', 'pm-kisan', 'விவசாய உதவி', '6000', 'ekyc', 'e-kyc', 'biometric']
  },
  {
    id: 'drip_irrigation_subsidy',
    name: {
      ta: 'சொட்டு நீர் பாசன மானியம் - 100% (PMKSY Micro Irrigation Subsidy)',
      en: 'Micro Irrigation / Drip Irrigation Subsidy'
    },
    category: 'agriculture',
    department: {
      ta: 'தோட்டக்கலைத் துறை & வேளாண் பொறியியல் துறை (Oddanchatram)',
      en: 'Horticulture & Agricultural Engineering Dept'
    },
    description: {
      ta: 'ஒட்டன்சத்திரம் பகுதியில் முருங்கை, வெங்காயம், தக்காளி மற்றும் தோட்டக்கலை பயிர்களுக்கு தண்ணீர் சேமிப்பு சொட்டு நீர் அமைப்புகள் அமைக்க சிறு/குறு விவசாயிகளுக்கு 100% மானியம், இதர விவசாயிகளுக்கு 75% மானியம்.',
      en: '100% subsidy for small and marginal farmers (up to 5 acres) and 75% subsidy for other farmers to install drip irrigation systems for drumstick, onion, tomato, and vegetables.'
    },
    eligibility: {
      ta: [
        'சொந்த கிணறு / ஆழ்துளை கிணறு (Borewell) மற்றும் மின் மோட்டார் வசதி உள்ள விவசாயிகள்',
        'சிறு/குறு விவசாயி சான்றிதழ் வைத்திருப்பவர்களுக்கு 100% மானியம்'
      ],
      en: [
        'Farmers with functional open well or borewell irrigation facility',
        'Small/Marginal Farmer Certificate holders qualify for 100% subsidy'
      ]
    },
    documents: {
      ta: [
        'பட்டா மற்றும் அசல் சிட்டா நகல்',
        'கிராம நிர்வாக அலுவலர் (VAO) அடங்கல் & நீர் ஆதார சான்று',
        'புல வரைபடம் (FMB Sketch)',
        'சிறு/குறு விவசாயி சான்றிதழ் (100% மானியத்திற்கு)',
        'விவசாயி ஆதார், புகைப்படம் & வங்கி பாஸ்புக்'
      ],
      en: [
        'Patta and latest digital Chitta',
        'VAO Adangal & water source certificate',
        'FMB field sketch',
        'Small / Marginal Farmer Certificate',
        'Aadhaar, photo, and bank passbook'
      ]
    },
    fee: {
      ta: 'மானியம் அரசு வழங்குகிறது (விண்ணப்ப பதிவு சேவை கட்டணம் மட்டும்)',
      en: 'Direct government subsidy to registered vendors'
    },
    timeEstimate: {
      ta: 'தோட்டக்கலை அலுவலர் மதிப்பீட்டிற்கு பின் 30 முதல் 60 நாட்களுக்குள் அமைத்து தரப்படும்',
      en: '30 to 60 days following field survey by Oddanchatram Horticulture Officer'
    },
    officialPortal: 'https://tnhorticulture.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் தேவையான நில ஆவணங்களுடன் பதிவு செய்து, ஒட்டன்சத்திரம் தோட்டக்கலை உதவி இயக்குநர் அலுவலகத்திற்கு (AD Horticulture: 9600226791) அனுப்பப்படும்.',
      en: 'Registered through Nalroad e-Seva Centre and processed by Assistant Director of Horticulture Oddanchatram (9600226791).'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['drip', 'micro irrigation', 'சொட்டு நீர்', 'பாசனம்', 'மானியம்', 'subsidy', 'முருங்கை', 'வெங்காயம்']
  },
  {
    id: 'crop_insurance_pmfby',
    name: {
      ta: 'பயிர் காப்பீடு திட்டம் (Pradhan Mantri Fasal Bima Yojana - PMFBY)',
      en: 'Crop Insurance (PMFBY)'
    },
    category: 'agriculture',
    department: {
      ta: 'வேளாண்மைத் துறை & கூட்டுறவுத் துறை',
      en: 'Agriculture Department & Co-operatives'
    },
    description: {
      ta: 'வறட்சி, புயல், பூச்சித் தாக்குதல் மற்றும் இயற்கை பேரிடர்களால் ஏற்படும் பயிர் இழப்பிற்கு விவசாயிகளுக்கு முழு இழப்பீடு வழங்கும் காப்பீட்டுத் திட்டம்.',
      en: 'Comprehensive crop loss insurance against drought, unseasonal rain, pests, and natural disasters.'
    },
    eligibility: {
      ta: ['அரசு அறிவிக்கை செய்த பருவகால பயிர்களை (மக்காச்சோளம், வெங்காயம், பருத்தி போன்றவை) சாகுபடி செய்யும் விவசாயிகள்'],
      en: ['Farmers cultivating notified seasonal crops in Oddanchatram block']
    },
    documents: {
      ta: [
        'நடப்பு பசலி அடங்கல் (VAO கையொப்பமிட்டது அல்லது இ-அடங்கல்)',
        'பட்டா அல்லது குத்தகை ஒப்பந்த ஆவணம்',
        'விவசாயியின் ஆதார் அட்டை',
        'வங்கி சேமிப்பு கணக்கு பாஸ்புக்'
      ],
      en: [
        'Current Fasli Adangal (e-Adangal or VAO signed)',
        'Patta or registered lease agreement',
        'Farmer Aadhaar card',
        'Bank savings passbook copy'
      ]
    },
    fee: {
      ta: 'அரசு நிர்ணயித்த குறைந்தபட்ச பிரீமியம் கட்டணம் (1.5% முதல் 2% வரை)',
      en: 'Nominal subsidized premium (1.5% to 2% of sum insured)'
    },
    timeEstimate: {
      ta: 'பயிர் அறுவடை பரிசோதனை முடிவுகள் அறிவிக்கப்பட்ட பின் இழப்பீடு வங்கியில் வரவு வைக்கப்படும்',
      en: 'Claims credited post Crop Cutting Experiments (CCE) yield loss notification'
    },
    officialPortal: 'https://pmfby.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையம் அல்லது சத்திரப்பட்டி / பெரியகோட்டை தொடக்க வேளாண்மை கூட்டுறவு கடன் சங்கத்தில் (PACCS) காலக்கெடுவுக்குள் பிரீமியம் செலுத்தி பதிவு செய்யலாம்.',
      en: 'Enroll within cutoff dates at Nalroad e-Seva Centre or local PACCS bank.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['pmfby', 'crop insurance', 'பயிர் காப்பீடு', 'இழப்பீடு', 'வறட்சி', 'அடங்கல்', 'விவசாயம்']
  },

  // 6. WOMEN & CHILD WELFARE (மகளிர் & குழந்தைகள்)
  {
    id: 'kalaignar_magalir_urimai',
    name: {
      ta: 'கலைஞர் மகளிர் உரிமைத் திட்டம் - KMUT (₹1,000/மாதம்)',
      en: 'Kalaignar Magalir Urimai Thittam (KMUT)'
    },
    category: 'women_welfare',
    department: {
      ta: 'சிறப்பு திட்ட செயலாக்கத் துறை (Tamil Nadu Govt)',
      en: 'Special Programme Implementation Dept'
    },
    description: {
      ta: 'குடும்பத் தலைவிகளின் வாழ்வாதாரத்தை உயர்த்தவும், உழைப்பை அங்கீகரிக்கவும் மாதம் ₹1,000 உரிமைத் தொகையாக வழங்கும் வரலாற்றுச் சிறப்புமிக்க திட்டம்.',
      en: 'Direct monthly entitlement grant of ₹1,000 to eligible female heads of families in Tamil Nadu.'
    },
    eligibility: {
      ta: [
        'குடும்ப ஆண்டு வருமானம் ₹2.5 லட்சத்திற்கு கீழ் இருக்க வேண்டும்',
        'குடும்பத்தில் 5 ஏக்கர் நன்செய் அல்லது 10 ஏக்கர் புன்செய் நிலத்திற்கு குறைவாக இருக்க வேண்டும்',
        'ஆண்டு மின் நுகர்வு 3600 யூனிட்டிற்கு குறைவாக இருக்க வேண்டும்',
        'குடும்பத்தில் அரசு ஊழியர்கள், ஓய்வூதியதாரர்கள், 4 சக்கர வாகனம் (கார்/ஜீப்) வைத்திருப்பவர்கள் இருக்கக் கூடாது'
      ],
      en: [
        'Annual household income below ₹2.5 Lakhs',
        'Landholding less than 5 acres wetland or 10 acres dryland',
        'Annual electricity consumption under 3600 units',
        'No government employees, pension recipients, or four-wheeler (car/SUV) owners'
      ]
    },
    documents: {
      ta: [
        'குடும்ப அட்டை (Smart Ration Card)',
        'குடும்பத் தலைவியின் ஆதார் அட்டை',
        'ஆதாருடன் இணைக்கப்பட்ட சொந்த வங்கி கணக்கு (வங்கி பாஸ்புக்)',
        'மின் நுகர்வோர் அட்டை எண் (EB Consumer Number)'
      ],
      en: [
        'Smart Ration card',
        'Aadhaar card of female family head',
        'Aadhaar-seeded bank account passbook',
        'TANGEDCO electricity consumer number'
      ]
    },
    fee: {
      ta: 'முற்றிலும் இலவசம்',
      en: 'Completely Free'
    },
    timeEstimate: {
      ta: 'அரசு பரிசீலனைக்கு பின் ஒவ்வொரு மாதமும் 15-ம் தேதி வங்கி கணக்கில் வரவு வைக்கப்படும்',
      en: 'Credited on the 15th of every month post-verification'
    },
    officialPortal: 'https://kmut.tn.gov.in/',
    offlineProcedure: {
      ta: 'விண்ணப்ப நிலை அறிதல், மேல்முறையீடு (Appeal) செய்தல் மற்றும் வங்கி கணக்கு மாற்றம் போன்ற அனைத்து உதவிகளையும் நால்ரோடு இ-சேவை மையத்தில் பெறலாம்.',
      en: 'Track status, file appeals for rejected applications, and update bank details at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['kmut', 'magalir urimai', 'மகளிர் உரிமைத் தொகை', '1000', 'குடும்பத் தலைவி', 'பெண்கள்', 'உதவி']
  },
  {
    id: 'pudhumai_penn_scheme',
    name: {
      ta: 'புதுமைப் பெண் திட்டம் (Moovalur Higher Education ₹1,000/Month)',
      en: 'Pudhumai Penn Scheme (Higher Education Support for Girls)'
    },
    category: 'women_welfare',
    department: {
      ta: 'சமூக நலன் மற்றும் மகளிர் உரிமைத் துறை',
      en: 'Social Welfare & Women Rights Dept'
    },
    description: {
      ta: 'அரசுப் பள்ளிகளில் 6 முதல் 12-ம் வகுப்பு வரை படித்து உயர்கல்வி (கல்லூரி, பாலிடெக்னிக், தொழிற்கல்வி) பயிலும் மாணவிகளுக்கு மாதம் ₹1,000 வங்கிக் கணக்கில் உதவித்தொகை.',
      en: 'Financial incentive of ₹1,000 per month for girl students who studied classes 6th to 12th in Tamil Nadu government schools pursuing higher education.'
    },
    eligibility: {
      ta: [
        'தமிழ்நாடு அரசுப் பள்ளிகளில் 6-ம் வகுப்பு முதல் 12-ம் வகுப்பு வரை படித்த மாணவிகள்',
        'பட்டப்படிப்பு, பொறியியல், பாலிடெக்னிக், நர்சிங் அல்லது தொழிற்கல்வி பயில்பவர்'
      ],
      en: [
        'Girl students enrolled in Govt schools from classes 6 to 12 in TN',
        'Currently pursuing undergraduate degree, diploma, ITI, or engineering'
      ]
    },
    documents: {
      ta: [
        'மாணவியின் ஆதார் அட்டை',
        '6 முதல் 12-ம் வகுப்பு அரசு பள்ளி மாற்றுச் சான்றிதழ் (TC) அல்லது தலைமை ஆசிரியர் சான்று (EMIS எண்)',
        'கல்லூரி அடையாள அட்டை / சேர்க்கை ரசீது',
        'மாணவியின் சொந்த வங்கி கணக்கு பாஸ்புக் நகல்'
      ],
      en: [
        'Student Aadhaar card',
        'Class 6-12 Govt school TC or Headmaster EMIS certificate',
        'College ID card / admission fee receipt',
        'Student bank passbook copy'
      ]
    },
    fee: {
      ta: 'முற்றிலும் இலவசம்',
      en: 'Free'
    },
    timeEstimate: {
      ta: 'கல்லூரி முதல்வர் சரிபார்த்த பின் மாதாந்திர உதவித்தொகை வரவு',
      en: 'Monthly disbursal post principal verification'
    },
    officialPortal: 'https://www.pudhumaipenn.tn.gov.in/',
    offlineProcedure: {
      ta: 'கல்லூரி மூலமாக அல்லது நால்ரோடு இ-சேவை மைய வழிகாட்டுதலுடன் ஆன்லைனில் விண்ணப்பிக்கலாம்.',
      en: 'Applied via college portal or guided through Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['pudhumai penn', 'புதுமை பெண்', 'கல்லூரி உதவி', 'மாணவிகள்', '1000', 'scholarship']
  },

  // 7. IDENTITY & CENTRAL CSC (அடையாள அட்டை)
  {
    id: 'aadhaar_services',
    name: {
      ta: 'ஆதார் திருத்தம் & PVC அட்டை (Aadhaar Update & PVC Card)',
      en: 'Aadhaar Demographic Update & PVC Card'
    },
    category: 'identity',
    department: {
      ta: 'இந்திய தனித்துவ அடையாள ஆணையம் (UIDAI)',
      en: 'Unique Identification Authority of India (UIDAI)'
    },
    description: {
      ta: 'ஆதார் அட்டையில் முகவரி மாற்றம், செல்போன் எண் இணைப்பு சரிபார்த்தல், பெயர் திருத்தம் மற்றும் உயர்தர பாக்கெட் PVC பிளாஸ்டிக் ஆதார் அட்டை பெறுதல்.',
      en: 'Address change, phone verification, and doorstep ordering of tamper-proof UIDAI Smart PVC Aadhaar Card.'
    },
    eligibility: {
      ta: ['ஏற்கனவே ஆதார் எண் வைத்துள்ள அனைத்து குடிமக்கள்'],
      en: ['All existing Aadhaar cardholders']
    },
    documents: {
      ta: [
        'தற்போதைய ஆதார் அட்டை எண்',
        'முகவரி மாற்றத்திற்கு: வாக்காளர் அட்டை / குடும்ப அட்டை / வங்கி பாஸ்புக் / கிராம நிர்வாக அலுவலர் சான்று',
        'மொபைல் எண் (OTP பெற)'
      ],
      en: [
        'Current Aadhaar card number',
        'For address update: Voter ID / Ration card / Bank passbook / VAO letter',
        'Linked mobile number for OTP'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹50 (PVC கார்டு UIDAI நேரடி அஞ்சலில் வீட்டிற்கு வரும்)',
      en: 'UIDAI fee ₹50 (Delivered directly via Speed Post)'
    },
    timeEstimate: {
      ta: '5 முதல் 10 நாட்களுக்குள் அஞ்சலில் வரும்',
      en: 'Delivered via speed post in 5 to 10 days'
    },
    officialPortal: 'https://myaadhaar.uidai.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் உடனே ஆன்லைன் முகவரி திருத்தம் மற்றும் PVC ஸ்மார்ட் கார்டு ஆர்டர் செய்து தரப்படும்.',
      en: 'Processed immediately at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['aadhaar', 'adhar', 'ஆதார்', 'pvc card', 'ஆதார் திருத்தம்', 'uidai', 'address change']
  },
  {
    id: 'pan_card_services',
    name: {
      ta: 'புதிய பான் கார்டு & திருத்தம் (New PAN Card & Correction - NSDL / UTI)',
      en: 'New PAN Card & Corrections (NSDL / UTI)'
    },
    category: 'identity',
    department: {
      ta: 'வருமான வரித் துறை (Income Tax Department)',
      en: 'Income Tax Department (NSDL / UTIITSL)'
    },
    description: {
      ta: 'வங்கி கணக்கு தொடங்க, பயிர்க்கடன் பெற மற்றும் சொத்து கிரையப் பத்திரம் பதிவு செய்ய கட்டாயமான நிரந்தர கணக்கு எண் (PAN) அட்டை பெறுதல்.',
      en: 'Permanent Account Number (PAN) card required for bank accounts, agricultural loans, and property transactions.'
    },
    eligibility: {
      ta: ['வயது வரம்பில்லை (18 வயதுக்கு குறைவானவர்களுக்கும் Minor PAN கார்டு உண்டு)'],
      en: ['No age restriction (Minor PAN cards available with parental documents)']
    },
    documents: {
      ta: [
        'ஆதார் அட்டை நகல்',
        '2 பாஸ்போர்ட் அளவு புகைப்படங்கள் (வெள்ளை பின்புலம்)',
        'மொபைல் எண் மற்றும் கையொப்பம்'
      ],
      en: [
        'Aadhaar card copy',
        '2 passport size photographs (white background)',
        'Mobile number and signature'
      ]
    },
    fee: {
      ta: 'அரசு கட்டணம் ₹107 (மைய சேவை கட்டணம் தனி)',
      en: 'Government fee ₹107 (Processing charges extra)'
    },
    timeEstimate: {
      ta: 'இ-பான் (e-PAN PDF) 2 நாட்களில்; அசல் பிளாஸ்டிக் கார்டு 10-15 நாட்களில் அஞ்சலில் வரும்',
      en: 'Digital e-PAN in 48 hours; Physical card via India Post in 10-15 days'
    },
    officialPortal: 'https://www.onlineservices.nsdl.com/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் கைரேகை அல்லது ஆதார் OTP மூலம் உடனே விண்ணப்பிக்கலாம்.',
      en: 'Biometric or OTP based instant application at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['pan', 'pan card', 'பான்', 'பான் கார்டு', 'nsdl', 'income tax', 'வங்கி']
  },

  // 8. HEALTH & EDUCATION (மருத்துவம் & கல்வி)
  {
    id: 'cmchis_health_insurance',
    name: {
      ta: 'முதலமைச்சரின் விரிவான மருத்துவக் காப்பீடு (CMCHIS Card - ₹5 Lakhs)',
      en: 'Chief Minister Comprehensive Health Insurance Scheme (CMCHIS)'
    },
    category: 'health_education',
    department: {
      ta: 'மக்கள் நல்வாழ்வு மற்றும் குடும்ப நலத்துறை',
      en: 'Health & Family Welfare Department'
    },
    description: {
      ta: 'குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம் வரை அரசு மற்றும் குறிப்பிட்ட தனியார் மருத்துவமனைகளில் கட்டணமில்லா அறுவை சிகிச்சை மற்றும் மருத்துவ சிகிச்சை பெற உதவும் திட்டம்.',
      en: 'Cashless hospitalisation and surgical coverage up to ₹5 Lakhs per family per year across empanelled government and private hospitals.'
    },
    eligibility: {
      ta: [
        'குடும்ப ஆண்டு வருமானம் ₹1,20,000-க்குள் இருக்க வேண்டும் (குடும்ப அட்டையில் உள்ள அனைவருக்கும் பொருந்தும்)',
        'தமிழ்நாடு முதலமைச்சரின் ஸ்மார்ட் குடும்ப அட்டை உள்ள குடும்பங்கள்'
      ],
      en: [
        'Annual family income not exceeding ₹1,20,000',
        'Must hold valid Tamil Nadu Smart Ration Card'
      ]
    },
    documents: {
      ta: [
        'குடும்ப அட்டை (Smart Ration Card) அசல் & நகல்',
        'கிராம நிர்வாக அலுவலர் (VAO) மற்றும் வருவாய்த் துறை வழங்கிய வருமானச் சான்றிதழ்',
        'குடும்ப உறுப்பினர்கள் அனைவரின் ஆதார் அட்டைகள்',
        'குடும்பத் தலைவர் புகைப்படம்'
      ],
      en: [
        'Smart Ration Card original & copy',
        'Income Certificate issued by Revenue Dept (< ₹1.2 Lakhs)',
        'Aadhaar cards of all family members',
        'Family group photo / Head of family photo'
      ]
    },
    fee: {
      ta: 'அரசு அட்டை முற்றிலும் இலவசம்',
      en: 'Government Card is completely free'
    },
    timeEstimate: {
      ta: 'மாவட்ட ஆட்சியர் அலுவலகம் / வட்டாட்சியர் அலுவலக சிறப்பு மையத்தில் உடனடியாக வழங்கப்படும்',
      en: 'Instant enrollment at designated Taluk / Collectorate kiosks'
    },
    officialPortal: 'https://www.cmchistn.com/',
    offlineProcedure: {
      ta: 'நால்ரோடு இ-சேவை மையத்தில் தேவையான வருமான சான்றிதழ் எடுத்துக்கொண்டு ஒட்டன்சத்திரம் வட்டாட்சியர் அலுவலக CMCHIS மையத்திற்கு செல்ல வழிகாட்டப்படும்.',
      en: 'Get your prerequisite Income Certificate at Nalroad e-Seva Centre, then visit Oddanchatram Taluk Office CMCHIS kiosk for biometric card print.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['cmchis', 'மருத்துவ காப்பீடு', 'health insurance', 'காப்பீடு அட்டை', '5 லட்சம்', 'மருத்துவம்']
  },
  {
    id: 'tamil_pudhalvan_scheme',
    name: {
      ta: 'தமிழ்ப் புதல்வன் திட்டம் (Higher Education Support for Boys ₹1,000/Month)',
      en: 'Tamil Pudhalvan Scheme (Boys College Education Grant)'
    },
    category: 'health_education',
    department: {
      ta: 'சமூக நலத்துறை & உயர்கல்வித் துறை',
      en: 'Social Welfare & Higher Education Dept'
    },
    description: {
      ta: 'அரசுப் பள்ளிகளில் 6 முதல் 12-ம் வகுப்பு வரை படித்து கல்லூரி, தொழிற்கல்வி பயிலும் மாணவர்களுக்கு பாடப்புத்தகங்கள், உபகரணங்கள் வாங்க மாதம் ₹1,000 உதவித்தொகை.',
      en: 'Monthly financial assistance of ₹1,000 directly to bank accounts of male students from government schools pursuing higher education.'
    },
    eligibility: {
      ta: [
        'தமிழ்நாடு அரசுப் பள்ளிகளில் 6 முதல் 12-ம் வகுப்பு வரை தமிழ் வழியில் அல்லது ஆங்கில வழியில் படித்த மாணவர்கள்',
        'அங்கீகரிக்கப்பட்ட கலை, அறிவியல், பொறியியல், பாலிடெக்னிக், தொழிற்கல்வி பயில்பவர்'
      ],
      en: [
        'Male students educated in TN Govt schools from class 6 to 12',
        'Currently enrolled in recognized degree, polytechnic, or ITI programs'
      ]
    },
    documents: {
      ta: [
        'மாணவர் ஆதார் அட்டை',
        'அரசுப் பள்ளி மாற்றுச் சான்றிதழ் (TC) அல்லது EMIS எண் சான்று',
        'கல்லூரி அடையாள அட்டை மற்றும் சேர்க்கை ரசீது',
        'மாணவரின் ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு பாஸ்புக் நகல்'
      ],
      en: [
        'Student Aadhaar card',
        'School TC with EMIS verification',
        'College ID & admission proof',
        'Aadhaar seeded bank passbook'
      ]
    },
    fee: {
      ta: 'இலவசம்',
      en: 'Free'
    },
    timeEstimate: {
      ta: 'கல்லூரி ஒப்புதலுக்கு பின் மாதாந்திர வரவு',
      en: 'Monthly disbursal post college registration'
    },
    officialPortal: 'https://www.tamilpudhalvan.tn.gov.in/',
    offlineProcedure: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையத்தில் விவரங்களை சரிபார்த்து கல்லூரி வாயிலாக பதிவு செய்ய வழிகாட்டப்படும்.',
      en: 'Guidance and document verification provided at Nalroad e-Seva Centre.'
    },
    verified: true,
    lastVerified: '2026-09-01',
    popular: true,
    keywords: ['tamil pudhalvan', 'தமிழ் புதல்வன்', 'மாணவர் உதவித்தொகை', '1000', 'கல்லூரி', 'கல்வி']
  }
];
