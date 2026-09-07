# பெரியாக்கோட்டை டிஜிட்டல் சேவை — Periyakottai Digital Seva
### Smart Village Digital Public Service Platform (Pincode: 624614)

A production-grade, bilingual (**Tamil** as default and **English**), mobile-first civic-tech gateway for the village of **Periyakottai**, Oddanchatram Taluk, Dindigul District, Tamil Nadu. Designed specifically for agricultural households, farmers, senior citizens, women, students, and rural citizens of varying literacy levels.

Connected directly to the local Digital Seva / CSC Centre operated by **Murugesan Kuppusamy (Murugesan K)** — *Nalroad Makkal e-Seva Maiyam*.

---

## 🌾 Project Overview

*   **Village & Gram Panchayat**: Periyakottai (பெரியாக்கோட்டை)
*   **Block / Panchayat Union**: Oddanchatram (ஒட்டன்சத்திரம்)
*   **Taluk**: Oddanchatram Taluk
*   **District**: Dindigul (திண்டுக்கல்), Tamil Nadu
*   **Pincode**: 624614 (Sub Post Office: Chatrapatti; Delivery Branch: Periyakottai)
*   **Local Partner & Operator**:
    *   **Murugesan Kuppusamy (Murugesan K)**
    *   **Centre**: Nalroad Makkal e-Seva Maiyam (நால்ரோடு மக்கள் இ-சேவை மையம்)
    *   **Authorized e-Sevai CSC ID**: `EFADGL0636`
    *   **Phone**: `+91 97903 82437`
    *   **Email**: `nalroadmakkalesevaimaiyam@gmail.com`
    *   **Location**: Nalroad Junction, Periyakottai, Oddanchatram Taluk - 624614
    *   **Google Maps**: [https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA](https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA)
    *   **Working Hours**: Mon - Sat: 9:30 AM - 5:00 PM | Sun: Holiday (திங்கள் - சனி: காலை 9:30 - மாலை 5:00)

---

## 🏛️ Core Modules & Features

1.  **Intelligent Home Experience (`/`)**:
    *   Emergency and government deadlines marquee.
    *   Transliteration & voice-aware search input with instant recommendations.
    *   *"What Can You Do For Me?"* conversational role cards (Farmer, Woman, Senior Citizen, Student, Land/House, Labourer).
    *   Frequently requested certificates grid with one-tap audio narration.
    *   Live snapshot of Oddanchatram Gandhi Market vegetable prices (Drumstick, Shallots, Tomato, Chilli, Maize).
    *   Operator spotlight introducing Murugesan K with direct Call and WhatsApp buttons.
    *   FAQ accordion with Web Speech API audio narration.
2.  **Comprehensive Government Services Directory (`/services`)**:
    *   50+ verified services across 8 categories: Revenue Certificates, Land & Survey (Patta/Chitta), Civil Supplies (Ration Card), Social Security Pensions, Agriculture, Women Welfare, Identity (Aadhaar & PAN), and Health/Education.
    *   Category filtering and multi-lingual fuzzy search (handles Tamil, English, and Tanglish transliterations).
    *   Individual service detail page (`/services/[id]`) with eligibility criteria, fees, time estimates, official `.gov.in` portal links, offline procedure, and interactive document checklist.
3.  **Welfare Schemes & Guided 5-Question Eligibility Engine (`/schemes/eligibility`)**:
    *   Conversational wizard with large pictorial cards asking 5 simple questions:
        1. Occupation (Farmer, Labourer, Homemaker, Student, Self-employed, Senior)
        2. Age Group (<18, 18-35, 35-59, 60+)
        3. Land Ownership (None, <2.5 acres, 2.5-5 acres, >5 acres)
        4. Annual Family Income (<₹72k, <₹1.2L, <₹2.5L, >₹2.5L)
        5. Special Category (Female head, Disability, Widow, None)
    *   Computes matching state & central schemes with a confidence indicator (*"High Match"* / *"Possible Match"*), plain-language reasons why it applies, and instant centre booking.
4.  **Farmer Hub (`/farmer-hub`)**:
    *   Oddanchatram Gandhi Vegetable Market wholesale price tracker with trend indicators.
    *   100% Drip Irrigation Subsidy (PMKSY) guidelines for small/marginal farmers.
    *   70% Solar Agri Pump scheme information.
    *   PM-KISAN ₹6,000 direct benefit transfer & biometric e-KYC assistance.
    *   PMFBY crop insurance deadlines and claim procedures.
    *   Periyakottai & Chatrapatti PACCS cooperative credit guide (zero-interest crop loans up to ₹1.5 Lakhs).
    *   Direct helplines for Oddanchatram Horticulture Officer (`9600226791`), Joint Director of Agriculture Dindigul (`0451-2904031`), and Kisan Call Centre (`1800-180-1551`).
5.  **Nalroad Makkal e-Seva Maiyam Hub (`/csc-centre`)**:
    *   Complete profile of Murugesan K, working hours, and exact location.
    *   Transparent list of services and government fees.
    *   Online appointment and doorstep assistance booking form for elderly and differently-abled villagers.
6.  **Public Request & Grievance Tracker (`/track`)**:
    *   Search by unique Ticket ID (e.g. `PDS-REQ-624614-0101` or `PDS-GRV-624614-0201`) or 10-digit mobile number.
    *   Visual progress timeline showing real-time milestones (`Submitted` → `Under Review` → `In Progress` → `Ready for Citizen` → `Completed`).
    *   Detailed remarks and activity log from Murugesan K.
7.  **Document Assistant (`/documents`)**:
    *   Interactive checklist tool where citizens select any certificate and tick off documents they possess, with WhatsApp sharing and print features.
8.  **Panchayat Information & Civic Grievance Reporting (`/panchayat`)**:
    *   Periyakottai Gram Panchayat profile, hamlets list, and Grama Sabha meeting calendar.
    *   Civic grievance logging form (Drinking water, Streetlights, Road damage, Drainage, Ration shop) with instant tracking ID generation.
9.  **Important & Emergency Contacts Directory (`/contacts`)**:
    *   One-tap calling cards for Oddanchatram Taluk Office (`04553-241100`), BDO (`7402608105`), GH (`04553-240668`), Devathur PHC, Police (`04553-240223`), Fire (`04553-240399`), TANGEDCO Minnagam (`94987 94987`), and Murugesan K (`9790382437`).
10. **Bilingual Knowledge Assistant (`/assistant`)**:
    *   Verified Q&A chat engine answering in Tamil & English, powered by speech-to-text recognition and text-to-speech voice synthesis.
11. **Operator Admin Dashboard (`/admin`)**:
    *   Secure PIN authentication (`624614` or `9790382437`).
    *   Live KPI stats (Total, Pending, Urgent requests, Civic complaints).
    *   Ticket management: change status, record timeline notes, one-tap call/WhatsApp to citizen.

---

## ♿ Accessibility & Rural UX Features

*   **First-Class Tamil (`ta-IN`)**: Natural, culturally authentic Tamil vocabulary throughout.
*   **Persistent Bilingual Toggle**: Zero-flicker instant switching between Tamil and English.
*   **🔊 Web Speech API Text-to-Speech ("கேட்டு அறிய")**: High-clarity voice reader for illiterate or elderly users on all major service and scheme cards.
*   **🎙️ Voice Search ("பேசித் தேடுங்கள்")**: Speech recognition input for hands-free search queries.
*   **🔤 Font Resizing Control**: `A-` (Normal), `A` (Large), and `A+` (Huge) text scaling.
*   **🌓 High-Contrast Mode**: Enhanced borders and maximum contrast for outdoor bright sunlight usage in fields.
*   **Minimum 44-48px Touch Targets**: Mobile-optimized for Android smartphones.
*   **PWA & Offline Resilience**: Service Worker caches emergency numbers, contacts, and core services for patchy 3G/4G connectivity.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Create production build
npm run build

# 4. Start production server
npm start

# 5. Run full endpoint & route audit
npm run audit
```

Default access URL: `http://localhost:3000`

### 🛠️ Operator Management Portal (`/operator` & `/admin`)
*   Navigate to `/operator` or `/admin/login`
*   Enter Operator PIN: `624614` or Mobile: `9790382437`
*   Manage requests, grievances, live centre status (Open/Field Camp/Closed), emergency flash alerts, and notice board.

### 📚 Documentation Reference
*   **[OPERATOR_GUIDE.md](./OPERATOR_GUIDE.md)**: Detailed bilingual operational instructions for operator Murugesan K.
*   **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**: Comprehensive architectural, technical, and civic-tech overview.

