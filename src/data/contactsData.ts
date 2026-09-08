import { ContactItem } from '@/types';

export const CONTACTS_DATA: ContactItem[] = [
  // CSC CENTRE PARTNER
  {
    id: 'csc_centre_murugesan',
    title: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையம் (முருகேசன் கு)',
      en: 'Nalroad Makkal e-Seva Centre (Murugesan K)'
    },
    category: 'centre',
    phone: '9790382437',
    email: 'nalroadmakkalesevaimaiyam@gmail.com',
    address: {
      ta: 'நால்ரோடு சந்திப்பு, பெரியாக்கோட்டை அஞ்சல், ஒட்டன்சத்திரம் தாலுகா, திண்டுக்கல் மாவட்டம் - 624614',
      en: 'Nalroad Junction, Periyakottai Post, Oddanchatram Taluk, Dindigul District - 624614'
    },
    timing: {
      ta: 'திங்கள் - சனி: காலை 9:30 - மாலை 5:00 | ஞாயிறு: விடுமுறை',
      en: 'Mon - Sat: 9:30 AM - 5:00 PM | Sun: Holiday'
    },
    verified: true,
    mapUrl: 'https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA'
  },

  // EMERGENCY SERVICES
  {
    id: 'ambulance_108',
    title: {
      ta: 'அரசு ஆம்புலன்ஸ் அவசர ஊர்தி (108)',
      en: 'Government Ambulance Emergency (108)'
    },
    category: 'emergency',
    phone: '108',
    address: {
      ta: 'அனைத்து மருத்துவ அவசரங்களுக்கும் 24 மணி நேரமும் இலவச உதவி',
      en: 'Toll-free 24x7 medical emergency ambulance service across Tamil Nadu'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours Open'
    },
    verified: true
  },
  {
    id: 'police_100',
    title: {
      ta: 'காவல்துறை அவசர உதவி (100)',
      en: 'Police Emergency Helpline (100)'
    },
    category: 'emergency',
    phone: '100',
    address: {
      ta: 'காவல்துறை அவசர கட்டுப்பாட்டு அறை',
      en: 'Police emergency control room'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours Open'
    },
    verified: true
  },
  {
    id: 'fire_101',
    title: {
      ta: 'தீயணைப்பு மற்றும் மீட்புப் பணி (101)',
      en: 'Fire and Rescue Services (101)'
    },
    category: 'emergency',
    phone: '101',
    address: {
      ta: 'தீ விபத்து மற்றும் பேரிடர் மீட்பு',
      en: 'Fire accident and disaster rescue helpline'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours Open'
    },
    verified: true
  },
  {
    id: 'women_helpline_181',
    title: {
      ta: 'பெண்கள் அவசர உதவி மையம் (181)',
      en: 'Women Helpline (181)'
    },
    category: 'emergency',
    phone: '181',
    address: {
      ta: 'குடும்ப வன்முறை மற்றும் பெண்கள் பாதுகாப்புக்கான இலவச உதவி',
      en: 'Toll-free support for women facing distress or domestic violence'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours Open'
    },
    verified: true
  },
  {
    id: 'child_helpline_1098',
    title: {
      ta: 'குழந்தைகள் உதவி மையம் (1098)',
      en: 'Childline Emergency (1098)'
    },
    category: 'emergency',
    phone: '1098',
    address: {
      ta: 'குழந்தைகள் பாதுகாப்பு மற்றும் குழந்தை திருமண தடுப்பு',
      en: '24-hour emergency response for children in need of care and protection'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours Open'
    },
    verified: true
  },
  {
    id: 'kisan_call_centre',
    title: {
      ta: 'கிசான் உழவர் அழைப்பு மையம் (Kisan Call Centre)',
      en: 'Kisan Call Centre (Farmer Advisory)'
    },
    category: 'agriculture',
    phone: '18001801551',
    address: {
      ta: 'விவசாய பயிர் நோய் மேலாண்மை, பூச்சி கட்டுப்பாடு இலவச ஆலோசனை (தமிழ் மொழி)',
      en: 'Toll-free agricultural technical advisory in Tamil for farmers'
    },
    timing: {
      ta: 'காலை 6:00 மணி முதல் இரவு 10:00 மணி வரை (வாரத்தின் 7 நாட்களும்)',
      en: '6:00 AM to 10:00 PM (All 7 days)'
    },
    verified: true
  },
  {
    id: 'cm_helpline_1100',
    title: {
      ta: 'முதலமைச்சரின் உதவி மையம் - முதல்வரின் முகவரி (1100)',
      en: 'Chief Minister Helpline - Mudhalvarin Mugavari (1100)'
    },
    category: 'administration',
    phone: '1100',
    address: {
      ta: 'அரசு சேவைகள் தொடர்பான புகார்கள் மற்றும் கோரிக்கைகள்',
      en: 'Single window grievance redressal for all government public services'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours'
    },
    verified: true
  },

  // LOCAL ADMINISTRATIVE OFFICES (ODDANCHATRAM TALUK)
  {
    id: 'oddanchatram_tahsildar',
    title: {
      ta: 'ஒட்டன்சத்திரம் வட்டாட்சியர் அலுவலகம் (Taluk Office)',
      en: 'Tahsildar / Taluk Office, Oddanchatram'
    },
    category: 'administration',
    phone: '04553-241100',
    alternatePhone: '9445000583',
    address: {
      ta: 'வட்டாட்சியர் அலுவலகம், திண்டுக்கல் - பெங்களூர் மெயின் ரோடு, ஒட்டன்சத்திரம் - 624619',
      en: 'Taluk Office, Dindigul Road, Oddanchatram, Tamil Nadu - 624619'
    },
    timing: {
      ta: 'திங்கள் - வெள்ளி: காலை 10:00 - மாலை 5:45',
      en: 'Mon - Fri: 10:00 AM - 5:45 PM'
    },
    verified: true
  },
  {
    id: 'oddanchatram_bdo',
    title: {
      ta: 'ஒட்டன்சத்திரம் ஊராட்சி ஒன்றிய அலுவலகம் (BDO Office)',
      en: 'Block Development Officer (BDO), Oddanchatram Panchayat Union'
    },
    category: 'administration',
    phone: '7402608105',
    alternatePhone: '7402608106',
    email: 'oddblock.tndgl@nic.in',
    address: {
      ta: 'ஊராட்சி ஒன்றிய அலுவலகம் (பெரியாக்கோட்டை உள்ளிட்ட கிராம பஞ்சாயத்துகள்)',
      en: 'Panchayat Union Office, Oddanchatram (Governs rural gram panchayats)'
    },
    timing: {
      ta: 'திங்கள் - வெள்ளி: காலை 10:00 - மாலை 5:45',
      en: 'Mon - Fri: 10:00 AM - 5:45 PM'
    },
    verified: true
  },
  {
    id: 'horticulture_oddanchatram',
    title: {
      ta: 'தோட்டக்கலை உதவி இயக்குநர் அலுவலகம், ஒட்டன்சத்திரம்',
      en: 'Assistant Director of Horticulture, Oddanchatram Block'
    },
    category: 'agriculture',
    phone: '9600226791',
    address: {
      ta: 'தோட்டக்கலைத் துறை, உழவர் மையம், ஒட்டன்சத்திரம் (சொட்டு நீர் பாசனம், முருங்கை, காய்கறி மானியங்கள்)',
      en: 'Horticulture Department, Uzhavar Maiyam, Oddanchatram (Drip irrigation & vegetable subsidies)'
    },
    timing: {
      ta: 'திங்கள் - வெள்ளி: காலை 10:00 - மாலை 5:00',
      en: 'Mon - Fri: 10:00 AM - 5:00 PM'
    },
    verified: true
  },
  {
    id: 'joint_director_agri_dgl',
    title: {
      ta: 'இணை இயக்குநர் அலுவலகம், வேளாண்மைத் துறை, திண்டுக்கல்',
      en: 'Joint Director of Agriculture, Dindigul District'
    },
    category: 'agriculture',
    phone: '0451-2904031',
    alternatePhone: '9442389204',
    address: {
      ta: 'மாவட்ட ஆட்சியர் பெருந்திட்ட வளாகம், திண்டுக்கல்',
      en: 'District Collectorate Complex, Dindigul'
    },
    timing: {
      ta: 'திங்கள் - வெள்ளி: காலை 10:00 - மாலை 5:45',
      en: 'Mon - Fri: 10:00 AM - 5:45 PM'
    },
    verified: true
  },

  // HOSPITALS & HEALTH CENTRES
  {
    id: 'gh_oddanchatram',
    title: {
      ta: 'அரசு தலைமை மருத்துவமனை, ஒட்டன்சத்திரம்',
      en: 'Government Hospital (Taluk HQ Hospital), Oddanchatram'
    },
    category: 'health',
    phone: '04553-240668',
    alternatePhone: '04553-241774',
    address: {
      ta: 'திண்டுக்கல் மெயின் ரோடு, காந்தி காய்கறி மார்க்கெட் அருகில், ஒட்டன்சத்திரம் - 624619',
      en: 'Dindigul Main Road, Near Gandhi Vegetable Market, Oddanchatram - 624619'
    },
    timing: {
      ta: 'அவசர சிகிச்சை பிரிவு: 24 மணி நேரமும் இயங்கும்',
      en: 'Emergency & Casualty: 24x7'
    },
    verified: true
  },
  {
    id: 'phc_devathur',
    title: {
      ta: 'தேவத்தூர் அரசு ஆரம்ப சுகாதார நிலையம் (PHC Devathur - 624614)',
      en: 'Primary Health Centre (PHC), Devathur (PIN 624614)'
    },
    category: 'health',
    phone: '04553-240668',
    address: {
      ta: 'தேவத்தூர் (பெரியாக்கோட்டை கிராமத்திற்கு அருகிலுள்ள ஆரம்ப சுகாதார நிலையம், ~4 கி.மீ)',
      en: 'Devathur village (Nearest Primary Health Centre to Periyakottai, ~4 km)'
    },
    timing: {
      ta: 'காலை 9:00 முதல் மாலை 4:00 வரை (அவசர பிரசவ பிரிவு 24 மணி நேரம்)',
      en: '9:00 AM - 4:00 PM (Emergency Maternity 24x7)'
    },
    verified: true
  },

  // POLICE & FIRE STATIONS
  {
    id: 'oddanchatram_police',
    title: {
      ta: 'ஒட்டன்சத்திரம் காவல் நிலையம் (Oddanchatram Police Station)',
      en: 'Oddanchatram Police Station'
    },
    category: 'police',
    phone: '04553-240223',
    alternatePhone: '04553-240685',
    address: {
      ta: 'மெயின் ரோடு, ஒட்டன்சத்திரம் - 624619',
      en: 'Main Road, Oddanchatram - 624619'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours Open'
    },
    verified: true
  },
  {
    id: 'all_women_police_oddanchatram',
    title: {
      ta: 'அனைத்து மகளிர் காவல் நிலையம், ஒட்டன்சத்திரம்',
      en: 'All Women Police Station (AWPS), Oddanchatram'
    },
    category: 'police',
    phone: '04553-241007',
    address: {
      ta: 'ஒட்டன்சத்திரம், திண்டுக்கல் மாவட்டம்',
      en: 'Oddanchatram, Dindigul District'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours Open'
    },
    verified: true
  },
  {
    id: 'fire_station_oddanchatram',
    title: {
      ta: 'தீயணைப்பு மற்றும் மீட்புப் பணிகள் நிலையம், ஒட்டன்சத்திரம்',
      en: 'Fire and Rescue Services Station, Oddanchatram'
    },
    category: 'emergency',
    phone: '04553-240399',
    address: {
      ta: 'ஒட்டன்சத்திரம், திண்டுக்கல் மாவட்டம்',
      en: 'Oddanchatram, Dindigul District'
    },
    timing: {
      ta: '24 மணி நேரமும் இயங்கும்',
      en: '24 Hours Open'
    },
    verified: true
  },

  // ELECTRICITY (TANGEDCO)
  {
    id: 'tangedco_oddanchatram',
    title: {
      ta: 'மின்வாரிய அலுவலகம் (TANGEDCO / EB) & மின்னகம்',
      en: 'TANGEDCO Electricity Board, Oddanchatram & Minnagam 24x7'
    },
    category: 'administration',
    phone: '9498794987',
    alternatePhone: '04553-242700',
    address: {
      ta: 'மின்வாரிய அலுவலகம், ஒட்டன்சத்திரம் | மின் தடை புகார்களுக்கு 24x7 மாநில உதவி எண்: 94987 94987',
      en: 'TANGEDCO Sub-Division Office, Oddanchatram | 24x7 State Helpline (Minnagam): 94987 94987'
    },
    timing: {
      ta: 'மின்னகம் புகார் மையம்: 24 மணி நேரமும் இயங்கும்',
      en: 'Minnagam Helpline: 24x7'
    },
    verified: true
  },

  // POSTAL SERVICES (PIN 624614)
  {
    id: 'post_office_chatrapatti_periyakottai',
    title: {
      ta: 'பெரியாக்கோட்டை & சத்திரப்பட்டி அஞ்சல் அலுவலகம் (PIN 624614)',
      en: 'Periyakottai Branch Post Office / Chatrapatti SO (PIN 624614)'
    },
    category: 'administration',
    phone: '04553-240220',
    address: {
      ta: 'பெரியாக்கோட்டை கிராம அஞ்சலகம் / சத்திரப்பட்டி துணை அஞ்சலகம் - 624614',
      en: 'Periyakottai Branch Post Office / Chatrapatti Sub Post Office - PIN 624614'
    },
    timing: {
      ta: 'திங்கள் - சனி: காலை 9:00 - மதியம் 2:00',
      en: 'Mon - Sat: 9:00 AM - 2:00 PM'
    },
    verified: true
  }
];
