'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { SCHEMES_DATA } from '@/data/schemesData';
import { Scheme } from '@/types';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import { RequestModal } from '@/components/RequestModal';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Building2
} from 'lucide-react';

interface Answers {
  occupation: string;
  ageGroup: string;
  land: string;
  income: string;
  special: string;
}

export default function EligibilityWizardPage() {
  const { language } = useI18n();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    occupation: '',
    ageGroup: '',
    land: '',
    income: '',
    special: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const totalSteps = 5;

  const handleSelectOption = (field: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setAnswers({
      occupation: '',
      ageGroup: '',
      land: '',
      income: '',
      special: ''
    });
    setCurrentStep(1);
  };

  // Compute matched schemes based on transparent rule set
  const matchedSchemes: { scheme: Scheme; confidence: 'high' | 'medium'; reason: { ta: string; en: string } }[] = [];

  if (currentStep > totalSteps || (answers.occupation && answers.ageGroup && answers.land && answers.income && answers.special)) {
    // 1. PM-KISAN
    if (answers.occupation === 'farmer' && answers.land !== 'none') {
      const s = SCHEMES_DATA.find((x) => x.id === 'pm_kisan');
      if (s) {
        matchedSchemes.push({
          scheme: s,
          confidence: 'high',
          reason: {
            ta: 'நீங்கள் விவசாயி என்றும் சொந்த நிலம் உள்ளவர் என்றும் குறிப்பிட்டுள்ளதால் ஆண்டுக்கு ₹6,000 பெற அதிக தகுதி உண்டு.',
            en: 'High match as you are a landholding farmer eligible for ₹6,000 direct income support.'
          }
        });
      }
    }

    // 2. Drip Irrigation Subsidy
    if (answers.occupation === 'farmer' && answers.land !== 'none') {
      const s = SCHEMES_DATA.find((x) => x.id === 'drip_irrigation_scheme');
      if (s) {
        matchedSchemes.push({
          scheme: s,
          confidence: answers.land === 'under_2.5' || answers.land === 'under_5' ? 'high' : 'medium',
          reason: {
            ta: answers.land === 'under_2.5' || answers.land === 'under_5'
              ? 'சிறு / குறு விவசாயிகளுக்கு 100% முழு மானியத்தில் சொட்டு நீர் பாசனம் பெற தகுதி உண்டு.'
              : 'விவசாயிகளுக்கு 75% மானியத்தில் பாசன வசதி பெறலாம்.',
            en: 'Qualify for 100% drip subsidy for small/marginal farmers or 75% for others.'
          }
        });
      }
    }

    // 3. Solar Agri Pump
    if (answers.occupation === 'farmer' && answers.land !== 'none') {
      const s = SCHEMES_DATA.find((x) => x.id === 'cm_solar_pump');
      if (s) {
        matchedSchemes.push({
          scheme: s,
          confidence: 'medium',
          reason: {
            ta: 'விவசாய கிணறு பாசனத்திற்கு 70% அரசு மானியத்தில் சூரியசக்தி பம்புசெட் பெற தகுதி சாத்தியம்.',
            en: 'Possible match for 70% subsidized daytime solar irrigation pump.'
          }
        });
      }
    }

    // 4. Kalaignar Magalir Urimai Thittam (KMUT)
    if (
      (answers.special === 'female_head' || answers.occupation === 'homemaker') &&
      (answers.income === 'under_72k' || answers.income === 'under_1.2l' || answers.income === 'under_2.5l') &&
      answers.land !== 'above_5'
    ) {
      const s = SCHEMES_DATA.find((x) => x.id === 'kmut_scheme');
      if (s) {
        matchedSchemes.push({
          scheme: s,
          confidence: 'high',
          reason: {
            ta: 'குடும்ப ஆண்டு வருமானம் ₹2.5 லட்சத்திற்குள் இருப்பதாலும், பெண் குடும்பத் தலைவி என்பதாலும் மாதம் ₹1,000 உரிமைத் தொகை பெற தகுதி உண்டு.',
            en: 'High match: eligible female head of family with annual income below ₹2.5 Lakhs.'
          }
        });
      }
    }

    // 5. Pudhumai Penn / Tamil Pudhalvan
    if (answers.occupation === 'student' && (answers.ageGroup === '18_35' || answers.ageGroup === 'under_18')) {
      const s1 = SCHEMES_DATA.find((x) => x.id === 'pudhumai_penn');
      const s2 = SCHEMES_DATA.find((x) => x.id === 'tamil_pudhalvan');
      if (s1) {
        matchedSchemes.push({
          scheme: s1,
          confidence: 'high',
          reason: {
            ta: 'அரசுப் பள்ளியில் படித்து கல்லூரி செல்லும் மாணவிகளுக்கு மாதம் ₹1,000 உதவித்தொகை.',
            en: 'Eligible for female students from government schools pursuing higher education.'
          }
        });
      }
      if (s2) {
        matchedSchemes.push({
          scheme: s2,
          confidence: 'high',
          reason: {
            ta: 'அரசுப் பள்ளியில் படித்து கல்லூரி செல்லும் மாணவர்களுக்கு மாதம் ₹1,000 தமிழ்ப் புதல்வன் திட்டம்.',
            en: 'Eligible for male students from government schools in college programs.'
          }
        });
      }
    }

    // 6. CMCHIS Health Insurance (Up to 5 Lakhs)
    if (answers.income === 'under_72k' || answers.income === 'under_1.2l') {
      const s = SCHEMES_DATA.find((x) => x.id === 'cmchis_scheme');
      if (s) {
        matchedSchemes.push({
          scheme: s,
          confidence: 'high',
          reason: {
            ta: 'குடும்ப ஆண்டு வருமானம் ₹1.2 லட்சத்திற்குள் உள்ளதால் ₹5 லட்சம் வரையிலான மருத்துவக் காப்பீடு பெற தகுதி உண்டு.',
            en: 'High match: annual family income below ₹1.2 Lakhs qualifies for ₹5 Lakhs free hospital treatment.'
          }
        });
      }
    }

    // 7. Old Age Pension (OAP)
    if (answers.ageGroup === 'above_60' && (answers.income === 'under_72k' || answers.income === 'under_1.2l')) {
      const s = SCHEMES_DATA.find((x) => x.id === 'oap_scheme');
      if (s) {
        matchedSchemes.push({
          scheme: s,
          confidence: 'high',
          reason: {
            ta: '60 வயதுக்கு மேற்பட்ட ஆதரவற்ற முதியோர்களுக்கு மாதம் ₹1,000 மாதாந்திர ஓய்வூதியம் கிடைக்க வாய்ப்புள்ளது.',
            en: 'High match: senior citizens aged 60+ in destitute status eligible for ₹1,000 monthly pension.'
          }
        });
      }
    }

    // 8. Differently Abled Pension
    if (answers.special === 'disability') {
      const s = SCHEMES_DATA.find((x) => x.id === 'differently_abled_pension');
      if (s) {
        matchedSchemes.push({
          scheme: s,
          confidence: 'high',
          reason: {
            ta: 'மாற்றுத்திறனாளிகளுக்கு மாதம் ₹1,500 முதல் ₹2,000 வரை மாதாந்திர பராமரிப்பு உதவித்தொகை பெற தகுதி உண்டு.',
            en: 'Direct maintenance pension of ₹1,500 - ₹2,000 for persons with disability.'
          }
        });
      }
    }

    // 9. Kalaignar Kanavu Illam (Pucca House)
    if ((answers.income === 'under_72k' || answers.income === 'under_1.2l') && answers.occupation !== 'student') {
      const s = SCHEMES_DATA.find((x) => x.id === 'kalaignar_kanavu_illam');
      if (s) {
        matchedSchemes.push({
          scheme: s,
          confidence: 'medium',
          reason: {
            ta: 'குடிசை அல்லது ஆஸ்பெஸ்டாஸ் வீடுகளில் வசிக்கும் ஏழை குடும்பங்கள் ₹3.5 லட்சம் வீடு கட்டும் மானியத்திற்கு விண்ணப்பிக்கலாம்.',
            en: 'Hut dwellers owning house patta can apply for ₹3.5 Lakhs pucca house grant.'
          }
        });
      }
    }
  }

  const isStepComplete = () => {
    if (currentStep === 1) return !!answers.occupation;
    if (currentStep === 2) return !!answers.ageGroup;
    if (currentStep === 3) return !!answers.land;
    if (currentStep === 4) return !!answers.income;
    if (currentStep === 5) return !!answers.special;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 px-3 py-1 rounded-full text-xs font-extrabold">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>{language === 'ta' ? 'திட்ட தகுதி அறிதல் வழிகாட்டி' : 'Guided Scheme Eligibility Engine'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
          {language === 'ta' ? 'உங்களுக்கு கிடைக்கும் அரசு திட்டங்கள்' : 'Discover Welfare Schemes for Your Family'}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto">
          {language === 'ta'
            ? '5 எளிய கேள்விகளுக்கு பதிலளித்து, உங்களுக்கு கிடைக்கக்கூடிய அனைத்து அரசு சலுகைகளையும் ஆவணங்களுடன் தெரிந்து கொள்ளுங்கள்.'
            : 'Answer 5 simple questions to see eligible government subsidies and financial assistance.'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
          <span>{language === 'ta' ? `கேள்வி ${currentStep} / ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}</span>
          <span className="text-emerald-700">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* QUESTION WIZARD STEPS */}
      {currentStep <= totalSteps ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-md space-y-6">
          {/* STEP 1: OCCUPATION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                1. {language === 'ta' ? 'உங்கள் முதன்மை தொழில் என்ன?' : 'What is your primary occupation?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'farmer', title: { ta: '👨‍🌾 விவசாயி (Farmer)', en: 'Farmer (Agricultural Landowner)' } },
                  { id: 'labourer', title: { ta: '🌾 விவசாய தொழிலாளி / கூலி (Labourer)', en: 'Agricultural / Daily Wage Worker' } },
                  { id: 'homemaker', title: { ta: '👩 குடும்பத் தலைவி (Homemaker)', en: 'Homemaker / Female Head' } },
                  { id: 'student', title: { ta: '🎓 மாணவர் (Student)', en: 'Student (School / College)' } },
                  { id: 'self_employed', title: { ta: '💼 சுயதொழில் / சிறு வணிகர்', en: 'Self-Employed / Small Business' } },
                  { id: 'senior', title: { ta: '👵 முதியோர் / பணியில்லாதவர்', en: 'Senior Citizen / Unemployed' } }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption('occupation', opt.id)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${
                      answers.occupation === opt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{opt.title[language]}</span>
                    {answers.occupation === opt.id && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: AGE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                2. {language === 'ta' ? 'உங்கள் வயதுப் பிரிவு என்ன?' : 'What is your age group?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'under_18', title: { ta: '18 வயதுக்குட்பட்டவர் (< 18)', en: 'Below 18 years' } },
                  { id: '18_35', title: { ta: '18 முதல் 35 வயது வரை (18 - 35)', en: '18 to 35 years (Youth)' } },
                  { id: '35_59', title: { ta: '35 முதல் 59 வயது வரை (35 - 59)', en: '35 to 59 years (Adult)' } },
                  { id: 'above_60', title: { ta: '60 வயது அல்லது அதற்கு மேல் (60+ மூத்த குடிமக்கள்)', en: '60 years or above (Senior Citizen)' } }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption('ageGroup', opt.id)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${
                      answers.ageGroup === opt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{opt.title[language]}</span>
                    {answers.ageGroup === opt.id && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: LAND */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                3. {language === 'ta' ? 'உங்களிடம் சொந்த விவசாய நிலம் உள்ளதா?' : 'Do you own cultivable agricultural land?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'none', title: { ta: 'நிலம் இல்லை (No Land)', en: 'No agricultural land' } },
                  { id: 'under_2.5', title: { ta: '2.5 ஏக்கர் வரை (குறு விவசாயி - Marginal)', en: 'Up to 2.5 acres (Marginal Farmer)' } },
                  { id: 'under_5', title: { ta: '2.5 முதல் 5 ஏக்கர் வரை (சிறு விவசாயி - Small)', en: '2.5 to 5.0 acres (Small Farmer)' } },
                  { id: 'above_5', title: { ta: '5 ஏக்கருக்கு மேல் (Large Farmer)', en: 'More than 5.0 acres' } }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption('land', opt.id)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${
                      answers.land === opt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{opt.title[language]}</span>
                    {answers.land === opt.id && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: INCOME */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                4. {language === 'ta' ? 'உங்கள் குடும்ப ஆண்டு வருமானம் தோராயமாக எவ்வளவு?' : 'Approximate annual household income?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'under_72k', title: { ta: '₹72,000 வரை (வறுமைக்கோட்டிற்கு கீழ்)', en: 'Up to ₹72,000 (BPL)' } },
                  { id: 'under_1.2l', title: { ta: '₹1.20 லட்சம் வரை (மருத்துவ காப்பீடு வரம்பு)', en: 'Up to ₹1.20 Lakhs (CMCHIS limit)' } },
                  { id: 'under_2.5l', title: { ta: '₹2.50 லட்சம் வரை (மகளிர் உரிமை தொகை வரம்பு)', en: 'Up to ₹2.50 Lakhs (KMUT limit)' } },
                  { id: 'above_2.5l', title: { ta: '₹2.50 லட்சத்திற்கு மேல்', en: 'Above ₹2.50 Lakhs' } }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption('income', opt.id)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${
                      answers.income === opt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{opt.title[language]}</span>
                    {answers.income === opt.id && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SPECIAL STATUS */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                5. {language === 'ta' ? 'குடும்பத்தில் சிறப்பு நிலைகள் ஏதேனும் உள்ளதா?' : 'Any special category applicable to your family?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'female_head', title: { ta: 'பெண் குடும்பத் தலைவி (Female Head of Household)', en: 'Female Head of Household' } },
                  { id: 'disability', title: { ta: 'மாற்றுத்திறனாளி (Person with Disability - 40%+)', en: 'Person with Disability (40%+)' } },
                  { id: 'widow', title: { ta: 'ஆதரவற்ற விதவை / கைவிடப்பட்ட பெண்', en: 'Destitute Widow / Deserted Woman' } },
                  { id: 'none', title: { ta: 'எதுவும் இல்லை (None of the above)', en: 'None of the above' } }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption('special', opt.id)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${
                      answers.special === opt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{opt.title[language]}</span>
                    {answers.special === opt.id && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 px-4 py-2 rounded-xl border border-slate-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'ta' ? 'முந்தைய கேள்வி' : 'Back'}</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition-all"
            >
              <span>{currentStep === totalSteps ? (language === 'ta' ? 'தகுதி முடிவுகளைப் பார்க்க' : 'See Results') : (language === 'ta' ? 'அடுத்த கேள்வி' : 'Next Question')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div className="space-y-8 animate-in fade-in zoom-in-95">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                    {language === 'ta' ? 'உங்கள் பதில்களுக்கான திட்ட முடிவுகள்' : 'Your Matching Welfare Schemes'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === 'ta'
                      ? `${matchedSchemes.length} திட்டங்கள் உங்கள் குடும்பத்திற்கு பொருந்த வாய்ப்புள்ளது`
                      : `${matchedSchemes.length} schemes likely match your family profile`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'மீண்டும் தொடங்க' : 'Restart Quiz'}</span>
              </button>
            </div>

            {/* Official Disclaimer Alert */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {language === 'ta'
                  ? 'முக்கிய குறிப்பு: இது உங்கள் பதில்களின் அடிப்படையிலான வழிகாட்டுதல் மட்டுமே. இறுதியான தகுதி மற்றும் ஒப்புதல் சம்பந்தப்பட்ட அரசு துறைகளின் கள ஆய்வுக்கு பிறகே நிர்ணயிக்கப்படும்.'
                  : 'Important Note: This is indicative matching based on your declared details. Final eligibility is determined upon official government verification.'}
              </span>
            </div>
          </div>

          {/* Matched Schemes List */}
          {matchedSchemes.length > 0 ? (
            <div className="space-y-6">
              {matchedSchemes.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        item.confidence === 'high'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {item.confidence === 'high'
                        ? (language === 'ta' ? '★ உயர் தகுதி (High Match)' : '★ High Match')
                        : (language === 'ta' ? 'சாத்தியமான தகுதி (Possible)' : 'Possible Match')}
                    </span>

                    <span className="text-xs font-bold text-slate-500">
                      {item.scheme.category}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-slate-950">
                    {item.scheme.name[language]}
                  </h3>

                  {/* Why it matches */}
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-semibold">
                    💡 {item.reason[language]}
                  </div>

                  {/* Benefit */}
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-slate-900">
                      {language === 'ta' ? 'திட்டப் பலன்: ' : 'Benefit: '}
                    </span>
                    <span className="text-emerald-800 font-extrabold">
                      {item.scheme.benefit[language]}
                    </span>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      {language === 'ta' ? 'தேவையான முக்கிய ஆவணங்கள்:' : 'Required Documents:'}
                    </span>
                    <ul className="space-y-1">
                      {item.scheme.documents[language].map((doc, dIdx) => (
                        <li key={dIdx} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={item.scheme.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-600 hover:text-emerald-800"
                    >
                      {language === 'ta' ? 'அதிகாரப்பூர்வ அரசு தளம்' : 'Official Portal'} →
                    </a>

                    <button
                      onClick={() => {
                        setSelectedScheme(item.scheme);
                        setModalOpen(true);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{language === 'ta' ? 'நால்ரோடு மையத்தில் விண்ணப்பிக்க' : 'Apply via Nalroad Centre'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <p className="font-bold text-slate-800">
                {language === 'ta' ? 'நேரடி திட்டங்கள் கண்டறியப்படவில்லை' : 'No direct matches found'}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {language === 'ta'
                  ? 'நால்ரோடு மக்கள் இ-சேவை மையத்தை (9790382437) தொடர்பு கொண்டால் உங்கள் குடும்ப சூழ்நிலைக்கு ஏற்ற பிற அரசு உதவிகளை அறியலாம்.'
                  : 'Contact Nalroad e-Seva Centre (9790382437) to explore other community and government support.'}
              </p>
            </div>
          )}
        </div>
      )}

      {selectedScheme && (
        <RequestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          serviceId={selectedScheme.id}
          serviceName={selectedScheme.name[language]}
        />
      )}
    </div>
  );
}
