import { NextResponse } from 'next/server';
import { SERVICES_DATA } from '@/data/servicesData';
import { SCHEMES_DATA } from '@/data/schemesData';
import { CONTACTS_DATA } from '@/data/contactsData';
import { searchFilter } from '@/lib/search';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body.question || body.query;
    const language = body.language || 'ta';

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const cleanQ = question.trim().toLowerCase();

    // 1. Search Services Knowledge Base
    const matchedServices = searchFilter(SERVICES_DATA, cleanQ, (s) => [
      s.name.ta,
      s.name.en,
      s.description.ta,
      s.description.en,
      s.department.ta,
      s.department.en,
      ...s.keywords
    ]);

    // 2. Search Schemes Knowledge Base
    const matchedSchemes = searchFilter(SCHEMES_DATA, cleanQ, (s) => [
      s.name.ta,
      s.name.en,
      s.description.ta,
      s.description.en,
      s.benefit.ta,
      s.benefit.en,
      s.targetAudience.ta,
      s.targetAudience.en
    ]);

    // 3. Search Contacts
    const matchedContacts = searchFilter(CONTACTS_DATA, cleanQ, (c) => [
      c.title.ta,
      c.title.en,
      c.phone,
      c.address.ta,
      c.address.en
    ]);

    // Synthesize verified answer
    if (matchedServices.length > 0) {
      const s = matchedServices[0];
      const isTa = language === 'ta';
      const answer = isTa
        ? `**${s.name.ta}**\n\n${s.description.ta}\n\n**தேவையான முக்கிய ஆவணங்கள்:**\n${s.documents.ta.slice(0, 4).map((d) => `• ${d}`).join('\n')}\n\n**கட்டணம் & காலம்:** ${s.fee.ta} (${s.timeEstimate.ta}).\n\nநால்ரோடு மக்கள் இ-சேவை மையத்தில் (முருகேசன் கே: 97903 82437) உடனடியாக விண்ணப்பிக்கலாம்.`
        : `**${s.name.en}**\n\n${s.description.en}\n\n**Key Documents Required:**\n${s.documents.en.slice(0, 4).map((d) => `• ${d}`).join('\n')}\n\n**Fee & Turnaround:** ${s.fee.en} (${s.timeEstimate.en}).\n\nApply directly with assistance from Nalroad Makkal e-Seva Centre (Murugesan K: 97903 82437).`;

      return NextResponse.json({
        answer,
        source: s.department[language as 'ta' | 'en'],
        verified: true,
        referenceId: s.id,
        type: 'service'
      });
    }

    if (matchedSchemes.length > 0) {
      const sc = matchedSchemes[0];
      const isTa = language === 'ta';
      const answer = isTa
        ? `**${sc.name.ta}**\n\n${sc.description.ta}\n\n**திட்டப் பலன்:** ${sc.benefit.ta}\n**யாருக்கு பொருந்தும்:** ${sc.targetAudience.ta}\n\n**தேவையான ஆவணங்கள்:**\n${sc.documents.ta.slice(0, 4).map((d) => `• ${d}`).join('\n')}\n\nவிவரங்களுக்கு நால்ரோடு இ-சேவை மையம் (97903 82437) அல்லது அதிகாரப்பூர்வ தளம் (${sc.officialLink}) வழியாக அணுகலாம்.`
        : `**${sc.name.en}**\n\n${sc.description.en}\n\n**Benefit:** ${sc.benefit.en}\n**Eligibility:** ${sc.targetAudience.en}\n\n**Documents Required:**\n${sc.documents.en.slice(0, 4).map((d) => `• ${d}`).join('\n')}\n\nFor assisted filing, visit Nalroad e-Seva Centre or view official portal at ${sc.officialLink}.`;

      return NextResponse.json({
        answer,
        source: sc.sponsor,
        verified: true,
        referenceId: sc.id,
        type: 'scheme'
      });
    }

    if (matchedContacts.length > 0) {
      const c = matchedContacts[0];
      const isTa = language === 'ta';
      const answer = isTa
        ? `**${c.title.ta}**\n\n📞 தொலைபேசி எண்: **${c.phone}**\n📍 முகவரி: ${c.address.ta}`
        : `**${c.title.en}**\n\n📞 Phone: **${c.phone}**\n📍 Address: ${c.address.en}`;

      return NextResponse.json({
        answer,
        source: 'திண்டுக்கல் மாவட்ட நிர்வாக அடைவு',
        verified: true,
        referenceId: c.id,
        type: 'contact'
      });
    }

    // Fallback response with Murugesan K
    const fallbackAnswer = language === 'ta'
      ? 'மன்னிக்கவும், உங்கள் கேள்விக்கான சரியான அரசு வழிகாட்டுதல் தரவுத்தளத்தில் நேரடியாக கிடைக்கவில்லை.\n\nதயவுசெய்து நால்ரோடு மக்கள் இ-சேவை மைய ஆபரேட்டர் **முருகேசன் கே** அவர்களை **97903 82437** என்ற எண்ணில் நேரடியாக தொடர்பு கொள்ளவும். அவர் உங்களுக்கு வழிகாட்டுவார்.'
      : 'This specific information could not be verified automatically in the public directory.\n\nPlease contact Nalroad Makkal e-Seva operator **Murugesan K** directly at **97903 82437** for personal assistance.';

    return NextResponse.json({
      answer: fallbackAnswer,
      source: 'நால்ரோடு மக்கள் இ-சேவை மையம்',
      verified: false,
      fallback: true
    });
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
