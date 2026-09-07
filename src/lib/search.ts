// Multi-lingual & Transliteration Aware Search Utility

const TRANSLITERATION_MAP: Record<string, string[]> = {
  patta: ['பட்டா', 'நிலம்', 'chitta', 'சிட்டா', 'land'],
  chitta: ['சிட்டா', 'பட்டா', 'patta', 'நில ஆவணம்'],
  income: ['வருமானம்', 'varumanam', 'வருமான சான்றிதழ்'],
  varumanam: ['வருமானம்', 'income', 'வருமான சான்றிதழ்'],
  community: ['சாதி', 'ஜாதி', 'community', 'jathi', 'sathi', 'சமூக'],
  jathi: ['ஜாதி', 'சாதி', 'community'],
  sathi: ['சாதி', 'ஜாதி', 'community'],
  nativity: ['இருப்பிடம்', 'iruppidam', 'வசிப்பிடம்'],
  iruppidam: ['இருப்பிடம்', 'nativity', 'இருப்பிட சான்றிதழ்'],
  ration: ['ரேஷன்', 'குடும்ப அட்டை', 'ration card', 'smart card', 'kudumba attai'],
  kudumbam: ['குடும்பம்', 'குடும்ப அட்டை', 'ration'],
  farmer: ['விவசாயி', 'உழவர்', 'vivasayi', 'uzhavar', 'agri', 'agriculture'],
  vivasayi: ['விவசாயி', 'farmer', 'உழவர்', 'வேளாண்மை'],
  uzhavar: ['உழவர்', 'விவசாயி', 'farmer', 'உழவர் பாதுகாப்பு'],
  pension: ['ஓய்வூதியம்', 'உதவித்தொகை', 'முதியோர்', 'muthiyor', 'oap'],
  muthiyor: ['முதியோர்', 'pension', 'ஓய்வூதியம்', 'முதியோர் உதவித்தொகை'],
  vidhavai: ['விதவை', 'widow', 'விதவை ஓய்வூதியம்'],
  widow: ['விதவை', 'vidhavai', 'ஆதரவற்ற விதவை'],
  drip: ['சொட்டு நீர்', 'micro irrigation', 'பாசனம்'],
  pasanam: ['பாசனம்', 'irrigation', 'சொட்டு நீர்'],
  solar: ['சூரியசக்தி', 'solar pump', 'பம்புசெட்'],
  aadhaar: ['ஆதார்', 'adhar', 'aadhar'],
  pan: ['பான்', 'பான் கார்டு', 'pan card'],
  voter: ['வாக்காளர்', 'voter id', 'தேர்தல்'],
  kisan: ['கிசான்', 'pm kisan', 'பி.எம் கிசான்'],
  magalir: ['மகளிர்', 'கலைஞர் மகளிர் உரிமை', 'kmut', '1000']
};

export function searchFilter<T>(
  items: T[],
  query: string,
  extractor: (item: T) => string[]
): T[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return items;

  // Find any transliterated terms matching the query
  const queryTokens = cleanQuery.split(/\s+/);
  const expandedTokens = new Set<string>(queryTokens);

  queryTokens.forEach((token) => {
    Object.entries(TRANSLITERATION_MAP).forEach(([key, equivalents]) => {
      if (token.includes(key) || key.includes(token)) {
        equivalents.forEach((eq) => expandedTokens.add(eq.toLowerCase()));
      }
      equivalents.forEach((eq) => {
        if (token.includes(eq.toLowerCase()) || eq.toLowerCase().includes(token)) {
          expandedTokens.add(key);
          equivalents.forEach((subEq) => expandedTokens.add(subEq.toLowerCase()));
        }
      });
    });
  });

  const searchWords = Array.from(expandedTokens);

  return items.filter((item) => {
    const textCorpus = extractor(item).join(' ').toLowerCase();
    // Match if any token is found
    return searchWords.some((word) => textCorpus.includes(word));
  });
}
